import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

import { acir_from_bytes, compile } from '@noir-lang/noir_wasm';
import { setup_generic_prover_and_verifier, create_proof } from '@noir-lang/barretenberg/dest/client_proofs';
import fs from "fs";
import cors from 'cors';
import util from "util";
const exec = util.promisify(require('child_process').exec);

import { SudokuABI } from './noir/abi';
import { generateSudokuPuzzle, generateValidSudoku } from './utils/sudoku';

dotenv.config();

import aleo from './aleo/aleo';
import aleoSudoku from './aleo/sudoku';
import aleoWordle from './aleo/wordle';
import aleoTrivia from './aleo/trivia';

import noirSudoku from './noir/sudoku';
import noirWordle from './noir/wordle';

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors()); // Add CORS middleware

app.use('/aleo', aleo);
app.use('/aleo/trivia', aleoTrivia);
app.use('/aleo/sudoku', aleoSudoku);
app.use('/aleo/wordle', aleoWordle);

app.use('/noir/sudoku', noirSudoku);
app.use('/noir/wordle', noirWordle);

app.get('/sudoku', async (req: Request, res: Response) => {
    const sudoku = generateValidSudoku();
    const puzzle = generateSudokuPuzzle(sudoku);
    res.json({ "puzzle": puzzle, "solution": sudoku });
});


app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

