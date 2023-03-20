import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

import { acir_from_bytes, compile } from '@noir-lang/noir_wasm';
import { setup_generic_prover_and_verifier, create_proof } from '@noir-lang/barretenberg/dest/client_proofs';
import fs from "fs";
import cors from 'cors';
import util from "util";
const exec = util.promisify(require('child_process').exec);

import { SudokuABI } from './abi';
import { generateSudokuPuzzle, generateValidSudoku } from './utils/sudoku';

dotenv.config();

import aleo from './aleo/aleo';
import aleoSudoku from './aleo/sudoku';
import aleoWordle from './aleo/wordle';
import aleoTrivia from './aleo/trivia';



const app: Express = express();
const port = process.env.PORT;
const serverAleoPrivateKey = process.env.ALEO_PRIVATE_KEY;
const serverAleoViewKey = process.env.ALEO_VIEW_KEY;

app.use(express.json());
app.use(cors()); // Add CORS middleware

app.use('/aleo', aleo);
app.use('/aleo/trivia', aleoTrivia);
app.use('/aleo/sudoku', aleoSudoku);
app.use('/aleo/wordle', aleoWordle);

app.get('/sudoku', async (req: Request, res: Response) => {
    const sudoku = generateValidSudoku();
    const puzzle = generateSudokuPuzzle(sudoku);
    res.json({ "puzzle": puzzle, "solution": sudoku });
});

app.post('/noir/sudoku/proof', async (req: Request, res: Response) => {
    const buffer = fs.readFileSync('../circuits/sudokuAcir.buf');
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


app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

