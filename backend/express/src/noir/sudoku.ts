import express, { Router, Request, Response } from "express";
import fs from "fs";
import { acir_from_bytes } from "@noir-lang/noir_wasm";
import { SudokuABI } from "./abi";
import { create_proof, setup_generic_prover_and_verifier } from "@noir-lang/barretenberg/dest/client_proofs";
import path from "path";

const router: Router = express.Router();

router.post('/proof', async (req: Request, res: Response) => {
    console.log(`${req.originalUrl} called with ${JSON.stringify(req.body)}`);
    const buffer = fs.readFileSync(path.resolve(__dirname, '../../circuits/sudokuAcir.buf'));
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

export default router;