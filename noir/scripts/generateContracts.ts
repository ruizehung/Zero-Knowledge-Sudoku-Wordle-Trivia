import { resolve, join } from 'path';
import { compile } from '@noir-lang/noir_wasm';
import { setup_generic_prover_and_verifier } from '@noir-lang/barretenberg/dest/client_proofs';
import { writeFileSync } from 'fs';

const CIRCUITS = [
  { contract: 'SudokuVerifier', dir: 'sudoku', name: 'Sudoku' }
]

async function generateVerifierContracts() {
  for (const circuit of CIRCUITS) {
    let compiled_program = compile(resolve(__dirname, `../circuits/${circuit.dir}/src/main.nr`));
    const acir = compiled_program.circuit;
    let [_, verifier] = await setup_generic_prover_and_verifier(acir);
  
    syncWriteFile(`../contracts/${circuit.contract}.sol`, verifier.SmartContract().replace('TurboVerifier', circuit.contract));
  
    console.log(`Done writing ${circuit.name} Verifier contract.`);
  }
}

function syncWriteFile(filename: string, data: any) {
  writeFileSync(join(__dirname, filename), data, {
    flag: 'w',
  });
}

generateVerifierContracts().then(() => process.exit(0)).catch(console.log);