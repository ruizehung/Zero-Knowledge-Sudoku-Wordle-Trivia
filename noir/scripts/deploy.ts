import { ethers } from "hardhat";

const CONTRACTS = ["SudokuVerifier", "WordleVerifier", "TriviaVerifier"];

async function main() {
  const sudokuVerifier = await ethers.getContractFactory("SudokuVerifier");
  const sudokuVerifierContract = await sudokuVerifier.deploy();
  console.log(`SudokuVerifier deployed to ${sudokuVerifierContract.address}`);

  const wordleVerifier = await ethers.getContractFactory("WordleVerifier");
  const wordleVerifierContract = await wordleVerifier.deploy();
  console.log(`WordleVerifier deployed to ${wordleVerifierContract.address}`);

  const triviaVerifier = await ethers.getContractFactory("TriviaVerifier");
  const triviaVerifierContract = await triviaVerifier.deploy();
  console.log(`TriviaVerifier deployed to ${triviaVerifierContract.address}`);

  const ZK_NFT = await ethers.getContractFactory("ZK_NFT");
  const ZK_NFTContract = await ZK_NFT.deploy(sudokuVerifierContract.address);
  console.log(`ZK_NFT deployed to ${ZK_NFTContract.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
