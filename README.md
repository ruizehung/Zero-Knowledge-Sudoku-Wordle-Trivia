# Aleo-Aztec-Game

This repository contains the implementation of zero-knowledge version of Sudoku, Wordle, and Trivia game using both the [Aleo](https://www.aleo.org/) and [Noir](https://noir-lang.org/).

## Setup
### Noir
- cd `noir`
- `npm install`
- Open a new terminal in `noir` and run `npx hardhat node`
- `npm run deploy` to deploy verifier contracts to local node. 
  - Take a note of the addresses the contracts deployed to and set that in `frontend/src/constant.ts`.

### Aleo
- Follow https://developer.aleo.org/testnet/getting_started/deploy_execute to setup a local node in development mode till step 4
  - Note: The snarkOS commit hash I used is 8cfa1657746bcdc372207f788f093b3060aac350
- To deploy `sudoku.aleo`:
    - `cd aleo/sudoku && leo build`
    - `export PRIVATE_KEY=<PRIVATE_KEY>`
    - Run
    ```
    snarkos developer deploy sudoku.aleo --private-key $PRIVATE_KEY --query "http://localhost:3030" --path "build/" \
    --broadcast "http://localhost:3030/testnet3/transaction/broadcast" --fee 600000 \
    --record <Record_that_you_just_transferred_credits_to>
    ```
- To deploy `wordle.aleo`:
    - `cd aleo/wordle && leo build`
    - `export PRIVATE_KEY=<PRIVATE_KEY>`
    - Run
    ```
    snarkos developer deploy wordle.aleo --private-key $PRIVATE_KEY --query "http://localhost:3030" --path "build/" \
    --broadcast "http://localhost:3030/testnet3/transaction/broadcast" --fee 600000 \
    --record <Record_that_you_just_transferred_credits_to>
    ```
- To deploy `trivia.aleo`:
    - `cd aleo/trivia && leo build`
    - `export PRIVATE_KEY=<PRIVATE_KEY>`
    - Run
    ```
    snarkos developer deploy trivia.aleo --private-key $PRIVATE_KEY --query "http://localhost:3030" --path "build/" \
    --broadcast "http://localhost:3030/testnet3/transaction/broadcast" --fee 600000 \
    --record <Record_that_you_just_transferred_credits_to>
    ```

### Start backend Server
- Open a new terminal 
- cd `backend`
- `npm install`
- `npm run dev`

### Start frontend
- Open a new terminal 
- cd `frontend/`
- `npm install`
- `npm run start`

### Testing
#### Noir 
- cd `noir`
- `npm run test-sudoku`
- `npm run test-wordle`
- `npm run test-trivial`

Note: Testing noir circuits individually works. But if you test them all at once with `npx hardhat test` some might fail. 


### Credits 
- Wordle frontend is copied from https://github.com/iamshaunjp/React-Wordle/tree/lesson-15