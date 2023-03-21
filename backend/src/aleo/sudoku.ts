import express, { Router, Request, Response } from "express";
import util from "util";
import { convertSudokuBoardToAleoPuzzleInfo } from "../utils/sudoku";
const exec = util.promisify(require('child_process').exec);

const router: Router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    console.log(`${req.originalUrl} called with ${JSON.stringify(req.body)}`);
    if (req.body.private_key === "" || req.body.private_key == null) {
        res.json({ error: "Player private_key is required" });
        return
    }

    if (req.body.puzzle === "" || req.body.puzzle == null) {
        res.json({ error: "Puzzle is required" });
        return
    }
    
    if (req.body.solution === "" || req.body.solution == null) {
        res.json({ error: "Solution is required" });
        return
    }

    const cmd = `snarkos developer execute sudoku.aleo solve_puzzle "${convertSudokuBoardToAleoPuzzleInfo(req.body.puzzle)}" "${convertSudokuBoardToAleoPuzzleInfo(req.body.solution)}" --private-key ${req.body.private_key} --query "http://localhost:3030" --broadcast "http://localhost:3030/testnet3/transaction/broadcast"`;
    const { stdout, stderr } = await exec(cmd);
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);

    res.json({ output: stdout });    
});

export default router;