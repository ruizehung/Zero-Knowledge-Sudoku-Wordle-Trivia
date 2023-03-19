import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import fetch from 'cross-fetch';
import { acir_from_bytes, compile } from '@noir-lang/noir_wasm';
import { setup_generic_prover_and_verifier, create_proof } from '@noir-lang/barretenberg/dest/client_proofs';
import fs from "fs";
import cors from 'cors';
import util from "util";
const exec = util.promisify(require('child_process').exec);

import { SudokuABI } from './abi';
import { WordList } from './wordList';
import { getGameStateServerView } from './utils';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const serverAleoPrivateKey = process.env.ALEO_PRIVATE_KEY;
const serverAleoViewKey = process.env.ALEO_VIEW_KEY;

app.use(express.json());
app.use(cors()); // Add CORS middleware

app.get('/', async (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.post('/sudoku', async (req: Request, res: Response) => {
    const buffer = fs.readFileSync('circuits/sudokuAcir.buf');
    const bytes = new Uint8Array(buffer);
    const acir = acir_from_bytes(bytes);
    const abi: SudokuABI = {
        solution: req.body.solution,
        puzzle: req.body.puzzle,
    };

    let [prover, _] = await setup_generic_prover_and_verifier(acir);
    const proof = await create_proof(prover, acir, abi);

    res.json({ proof: proof })
});

let lastestGameRecord = "";

app.post('/wordle/new', async (req: Request, res: Response) => {
    console.log(`/wordle/new called with ${JSON.stringify(req.body)}`);
    if (req.body.player_address === "") {
        res.json({ error: "Player address is required" });
        return
    }
    const solution = WordList[Math.floor(Math.random() * WordList.length)];
    console.log('solution:', solution);

    // Create Game 
    const solution_array: number[] = [];
    for (let i = 0; i < solution.length; i++) {
        solution_array.push(solution.charCodeAt(i) - "a".charCodeAt(0));
    }
    const { stdout: stdout_create_game, stderr: stderr_create_game } = await exec(`snarkos developer execute wordle.aleo create_game "{ c1: ${solution_array[0]}u8, c2: ${solution_array[1]}u8, c3: ${solution_array[2]}u8, c4: ${solution_array[3]}u8, c5: ${solution_array[4]}u8 }" ${req.body.player_address} --private-key ${serverAleoPrivateKey} --query "http://localhost:3030" --broadcast "http://localhost:3030/testnet3/transaction/broadcast"`);
    console.log('stdout:', stdout_create_game);
    console.log('stdout:', stdout_create_game.split("\n")[4]);
    const execution_id = stdout_create_game.split("\n")[4];

    try {
        lastestGameRecord = await getGameStateServerView(execution_id, serverAleoViewKey!);
        lastestGameRecord = lastestGameRecord.trim();
        res.json({ status: "ready" })
    } catch (e) {
        console.log(e);
        res.json({ status: "failed" })
    }
});

app.post('/wordle/guess', async (req: Request, res: Response) => {
    console.log(`/wordle/guess called with ${JSON.stringify(req.body)}`);
    if (req.body.guess === "" || req.body.guess == null) {
        res.json({ error: "Player guess is required" });
        return
    }
    if (req.body.player_address === "" || req.body.player_address == null) {
        res.json({ error: "Player address is required" });
        return
    }
    if (req.body.player_view_key === "" || req.body.player_view_key == null) {
        res.json({ error: "Player view key is required" });
        return
    }
    const cmd = `snarkos developer execute wordle.aleo guess "${lastestGameRecord}" ${req.body.player_address} "{ c1: ${req.body.guess[0]}u8, c2: ${req.body.guess[1]}u8, c3: ${req.body.guess[2]}u8, c4: ${req.body.guess[3]}u8, c5: ${req.body.guess[4]}u8 }" --private-key ${serverAleoPrivateKey} --query "http://localhost:3030" --broadcast "http://localhost:3030/testnet3/transaction/broadcast"`;
    console.log(cmd);
    const { stdout: stdout_guess, stderr } = await exec(cmd);
    console.log('stdout:', stdout_guess);
    console.log('stdout:', stdout_guess.split("\n")[4]);
    const execution_id = stdout_guess.split("\n")[4];
    // Get game state server view

    try {
        lastestGameRecord = await getGameStateServerView(execution_id, serverAleoViewKey!);
        lastestGameRecord = lastestGameRecord.trim();
    } catch (e) {
        console.log(e);
        res.json({ status: "failed", error: e });
        return 
    }

    const guess_results: number[] = [];
    let regex = /guess_result:\s*\{([^}]+)\}/; // match guess_result followed by a curly brace block
    let match = lastestGameRecord.match(regex); // apply the regex to the string and get the match result
    if (match) {
        let guess_result = match[1]; // get the first capture group and add curly braces around it
        console.log(guess_result); // print the guess_result as a string
        for (const result of guess_result.split(",\n")) {
            let regex = /(\d+)u/; // match one or more digits followed by u
            let match = result.trim().match(regex); // apply the regex to the string and get the match result
            let number = match![1]; // get the first capture group which is the number
            console.log(number); // print the number as a string
            guess_results.push(parseInt(number));
        }
    }
    res.json({ guess_results: guess_results })
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

