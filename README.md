# Aleo-Aztec-Game

## Setup
### Start backend servers
#### Python Server
- Open a new terminal 
- cd `backend/fastapi`
- (Optional) Create your own python virtual environment and activate it
- `pip install -r requirements.txt`
- `uvicorn main:app --reload`

#### Express Server
- Open a new terminal 
- cd `backend/express`
- `npm install && npm run build`
- `npm start`


### ZK Setup
#### Aleo
- Follow https://developer.aleo.org/testnet/getting_started/deploy_execute to setup a local node in development mode till step 4
  - Note: The snarkOS commit hash I used is 8cfa1657746bcdc372207f788f093b3060aac350
- To deploy `sudoku.aleo`:
    - `cd leo/sudoku && leo build`
    - `export PRIVATE_KEY=<PRIVATE_KEY>`
    - Run
    ```
    snarkos developer deploy sudoku.aleo --private-key $PRIVATE_KEY --query "http://localhost:3030" --path "leo/sudoku/build/" \
    --broadcast "http://localhost:3030/testnet3/transaction/broadcast" --fee 600000 \
    --record <Record_that_you_just_transferred_credits_to>
    ```
#### Noir
- cd `noir`
- `npm install`
- Open a new terminal in `noir` and run `npx hardhat node`
- `npx hardhat run --network localhost scripts/deploy.ts` to deploy sudoku verifier contract. Take a note of the address that the contract is deployed to, and set that in `SudoKuVerifierNoirContractAddress` in `frontend/src/constant.ts`.



Note: Testing noir circuits individually works. But if you test them all at once with `npx hardhat test` some might fail. 
Note: Wordle frontend is copied from https://github.com/iamshaunjp/React-Wordle/tree/lesson-15