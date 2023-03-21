import express, { Router, Request, Response } from "express";
import { WordList } from "../wordList";
import fs from "fs";
import { acir_from_bytes, compile } from "@noir-lang/noir_wasm";
import { WordleABI } from "./abi";
import { create_proof, setup_generic_prover_and_verifier } from "@noir-lang/barretenberg/dest/client_proofs";
import path from "path";
import { BarretenbergWasm } from "@noir-lang/barretenberg/dest/wasm";
import { SinglePedersen } from "@noir-lang/barretenberg/dest/crypto";
import { numToHex } from "../utils";

const router: Router = express.Router();

let currentSolution = "";
let solutionHash = "";
let solution_arr: number[] = [];

router.get('/new', async (req: Request, res: Response) => {
    console.log(`${req.originalUrl} called with ${JSON.stringify(req.body)}`);

    currentSolution = WordList[Math.floor(Math.random() * WordList.length)];
    console.log('solution:', currentSolution);
    
    solution_arr = [];
    for (let i = 0; i < currentSolution.length; i++) {
        solution_arr.push(currentSolution[i].charCodeAt(0) - "a".charCodeAt(0));
    }
    const barretenberg = await BarretenbergWasm.new();
    const pedersen = new SinglePedersen(barretenberg);
    const solution_buffer = pedersen.compressInputs(solution_arr.map((e: number) => Buffer.from(numToHex(e), 'hex')));

    solutionHash = `0x${solution_buffer.toString('hex')}`;
    res.json({ status: "ready", solutionHash })
});

router.post('/guess', async (req: Request, res: Response) => {
    console.log(`${req.originalUrl} called with ${JSON.stringify(req.body)}`);
    if (req.body.guess == null) {
        res.json({ error: "Player guess is required" });
        return
    }

    // Compute guess_results
    const guess_results: number[] = [1, 1, 1, 1, 1];
    let solution = [...currentSolution];
    let guess = [...req.body.guess];
    for (let i = 0; i < solution.length; i++) {
        if (solution[i] === guess[i]) {
            guess_results[i] = 3;
            solution[i] = "";
            guess[i] = "";
        }
    }

    for (let i = 0; i < solution.length; i++) {
        if (guess_results[i] === 1) {
            for (let j = 0; j < solution.length; j++) {
                if (i != j && guess[i] === solution[j] && guess[i] !== "" && solution[j] !== "") {
                    guess_results[i] = 2;
                    guess[i] = "";
                    solution[j] = "";
                    break;
                }
            }
        }
    }

    // Compute proof
    const buffer = fs.readFileSync(path.resolve(__dirname, '../../circuits/wordleAcir.buf'));
    const bytes = new Uint8Array(buffer);
    const acir = acir_from_bytes(bytes);

    const guess_arr: number[] = [];
    for (let i = 0; i < solution.length; i++) {
        guess_arr.push(req.body.guess[i].charCodeAt(0) - "a".charCodeAt(0));
    }

    const abi: WordleABI = {
        solution_hash: solutionHash,
        solution: solution_arr,
        guess: guess_arr,
        guess_result: guess_results
    };

    let [prover, _] = await setup_generic_prover_and_verifier(acir);
    const proof = await create_proof(prover, acir, abi);

    res.json({ guess_results: guess_results, proof: proof });
});

export default router;