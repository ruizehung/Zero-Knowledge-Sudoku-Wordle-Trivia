import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { acir_from_bytes, compile } from '@noir-lang/noir_wasm';
import { setup_generic_prover_and_verifier, create_proof } from '@noir-lang/barretenberg/dest/client_proofs';
import fs from "fs";
import cors from 'cors';
import util from "util";
const exec = util.promisify(require('child_process').exec);

import { SudokuABI } from './abi';
import { WordList } from './wordList';

dotenv.config();

const app: Express = express();
const port = "3456";

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

app.get('/wordle/new', (req: Request, res: Response) => {
    // const { stdout, stderr } = await exec('ls');
    //  console.log('stdout:', stdout);
    //  console.log('stderr:', stderr);
    res.json({ word: WordList[Math.floor(Math.random() * WordList.length)] })
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

