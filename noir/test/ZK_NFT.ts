import { compile } from '@noir-lang/noir_wasm';
import { setup_generic_prover_and_verifier, create_proof, verify_proof } from '@noir-lang/barretenberg/dest/client_proofs';
import { BarretenbergWasm } from '@noir-lang/barretenberg/dest/wasm';
import { SinglePedersen } from '@noir-lang/barretenberg/dest/crypto';
import { ethers } from "hardhat";
import { Contract, ContractFactory, utils } from 'ethers';
import { expect } from "chai";
import path from 'path';
import { numToHex } from '../utils';

describe('ZK NFT', function () {
  let barretenberg: BarretenbergWasm;
  let pedersen: SinglePedersen;

  let sudokuVerifier: ContractFactory;
  let sudokuVerifierContract: Contract;
  let wordleVerifier: ContractFactory;
  let wordleVerifierContract: Contract;
  let triviaVerifier: ContractFactory;
  let triviaVerifierContract: Contract;
  let ZK_NFT: ContractFactory;
  let ZK_NFTContract: Contract;

  before(async () => {
    barretenberg = await BarretenbergWasm.new();
    pedersen = new SinglePedersen(barretenberg);

    sudokuVerifier = await ethers.getContractFactory("SudokuVerifier");
    sudokuVerifierContract = await sudokuVerifier.deploy();
    wordleVerifier = await ethers.getContractFactory("WordleVerifier");
    wordleVerifierContract = await sudokuVerifier.deploy();
    triviaVerifier = await ethers.getContractFactory("TriviaVerifier");
    triviaVerifierContract = await sudokuVerifier.deploy();
    
    ZK_NFT = await ethers.getContractFactory("ZK_NFT");
    ZK_NFTContract = await ZK_NFT.deploy(sudokuVerifierContract.address);
  });

  it("Should mint Sudoku NFT", async () => {   
    const [owner, addr1, addr2] = await ethers.getSigners();    

    const compiled_program = compile(path.resolve(__dirname, '../circuits/sudoku/src/main.nr'));
    let acir = compiled_program.circuit;
    const abi = compiled_program.abi;

    abi.puzzle = [8, 0, 0, 0, 0, 0, 4, 0, 1, 0, 0, 2, 3, 6, 0, 0, 8, 0, 0, 0, 5, 0, 0, 9, 0, 0, 0, 9, 5, 0, 0, 4, 8, 0, 0, 0, 0, 3, 0, 5, 0, 0, 0, 0, 0, 0, 4, 0, 0, 1, 0, 6, 0, 0, 0, 0, 0, 8, 0, 7, 0, 0, 6, 7, 0, 0, 0, 0, 0, 9, 3, 2, 3, 1, 6, 2, 0, 0, 0, 0, 0];
    abi.solution = [8, 9, 3, 7, 2, 5, 4, 6, 1, 4, 7, 2, 3, 6, 1, 5, 8, 9, 1, 6, 5, 4, 8, 9, 3, 2, 7, 9, 5, 7, 6, 4, 8, 2, 1, 3, 6, 3, 1, 5, 7, 2, 8, 9, 4, 2, 4, 8, 9, 1, 3, 6, 7, 5, 5, 2, 9, 8, 3, 7, 1, 4, 6, 7, 8, 4, 1, 5, 6, 9, 3, 2, 3, 1, 6, 2, 9, 4, 7, 5, 8];

    let [prover, verifier] = await setup_generic_prover_and_verifier(acir);

    const proof = await create_proof(prover, acir, abi);    
    await ZK_NFTContract.mintSudokuNFT(addr1.address, "some_uri", proof);
    expect(await ZK_NFTContract.ownerOf(1)).eq(addr1.address);
  });  

  // it("Should mint Wordle NFT", async () => {   
  //   const [owner, addr1, addr2] = await ethers.getSigners();    

  //   const compiled_program = compile(path.resolve(__dirname, '../circuits/wordle/src/main.nr'));
  //   let acir = compiled_program.circuit;
  //   const abi = compiled_program.abi;

  //   abi.solution = [1, 2, 3, 4, 5];
  //   const solution_buffer = pedersen.compressInputs(abi.solution.map((e: number) => Buffer.from(numToHex(e), 'hex')));
  //   abi.solution_hash = `0x${solution_buffer.toString('hex')}`;
  //   abi.guess = [1, 2, 4, 3, 6];
  //   abi.guess_result = [3, 3, 2, 2, 1];

  //   let [prover, verifier] = await setup_generic_prover_and_verifier(acir);

  //   const proof = await create_proof(prover, acir, abi);    
  //   await ZK_NFTContract.mintWordleNFT(addr1.address, "some_uri", proof);
  //   expect(await ZK_NFTContract.ownerOf(1)).eq(addr1.address);
  // });  

  // it("Should mint Trivia NFT", async () => {   
  //   const [owner, addr1, addr2] = await ethers.getSigners();    

  //   const compiled_program = compile(path.resolve(__dirname, '../circuits/trivia/src/main.nr'));
  //   let acir = compiled_program.circuit;
  //   const abi = compiled_program.abi;

  //   abi.answers = [123456789, 9876578, 134256743];
  //   const solution_buffer = pedersen.compressInputs(abi.answers.map((e: number) => Buffer.from(numToHex(e), 'hex')));
  //   abi.answers_hash = `0x${solution_buffer.toString('hex')}`;
  //   abi.options = [123456789, 1, 2, 3, 4, 5, 9876578, 6, 7, 8, 9, 134256743];
  //   abi.guesses = [123456789, 9876578, 134256743];
  //   abi.score = 3;

  //   let [prover, verifier] = await setup_generic_prover_and_verifier(acir);

  //   const proof = await create_proof(prover, acir, abi);    
  //   await ZK_NFTContract.mintTriviaNFT(addr1.address, "some_uri", proof);
  //   expect(await ZK_NFTContract.ownerOf(1)).eq(addr1.address);
  // });  

});