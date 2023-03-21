import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { generateSudokuPuzzle, generateValidSudoku } from './utils/sudoku';

dotenv.config();

import aleo from './aleo/aleo';
import aleoSudoku from './aleo/sudoku';
import aleoWordle from './aleo/wordle';
import aleoTrivia from './aleo/trivia';

import noirSudoku from './noir/sudoku';
import noirWordle from './noir/wordle';
import noirTrivia from './noir/trivia';

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors()); // Add CORS middleware

app.use('/aleo', aleo);
app.use('/aleo/sudoku', aleoSudoku);
app.use('/aleo/wordle', aleoWordle);
app.use('/aleo/trivia', aleoTrivia);

app.use('/noir/sudoku', noirSudoku);
app.use('/noir/wordle', noirWordle);
app.use('/noir/trivia', noirTrivia);

app.get('/sudoku', async (req: Request, res: Response) => {
    const sudoku = generateValidSudoku();
    const puzzle = generateSudokuPuzzle(sudoku);
    res.json({ "puzzle": puzzle, "solution": sudoku });
});


app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

