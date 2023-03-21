import { ethers } from "hardhat";

const CONTRACTS = ["SudokuVerifier", "WordleVerifier", "TriviaVerifier"];

async function main() {
  for (const contract of CONTRACTS) {
    const c = await ethers.getContractFactory(contract);
    const deployed_contract = await c.deploy();
  
    console.log(
      `${contract} deployed to ${deployed_contract.address}`
    );
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
