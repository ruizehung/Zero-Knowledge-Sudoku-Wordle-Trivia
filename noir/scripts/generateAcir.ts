import { compile, acir_to_bytes } from '@noir-lang/noir_wasm';
import { getCircuitSize } from '@noir-lang/barretenberg/dest/client_proofs/generic_proof/standard_example_prover';
import { serialise_acir_to_barrtenberg_circuit } from '@noir-lang/aztec_backend';
import { BarretenbergWasm } from '@noir-lang/barretenberg/dest/wasm';
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { resolve } from 'path';

const PROOFS = ['sudoku', 'wordle', 'trivia'];

const DEPLOY_PATH = resolve(__dirname, '../../backend/circuits');

/**
 * Script to generate the necessary files to generate Noir proofs in the frontend of a React application.
 * The circuit and accompanying acir of the circuit must be turned into a buffer to be read on the frontend 
 */
(async () => {
    for (const proof of PROOFS) {
        const compiled_program = compile(
            resolve(__dirname, `../circuits/${proof}/src/main.nr`)
        );

        const acir = compiled_program.circuit;

        // Write acir file
        writeFileSync(
            resolve(__dirname, `${DEPLOY_PATH}/${proof}Acir.buf`),
            Buffer.from(acir_to_bytes(acir))
        );
    }

    process.exit(0);
})();