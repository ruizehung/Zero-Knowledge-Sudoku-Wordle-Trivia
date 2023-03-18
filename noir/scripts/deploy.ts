import { ethers } from "hardhat";

async function main() {
  const SudokuVerifier = await ethers.getContractFactory("SudokuVerifier");
  const sudokuVerifier = await SudokuVerifier.deploy();

  await sudokuVerifier.deployed();

  console.log(
    `SudokuVerifier deployed to ${sudokuVerifier.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
