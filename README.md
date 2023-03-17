# Aleo-Aztec-Game

## Setup
1. Follow https://developer.aleo.org/testnet/getting_started/deploy_execute to setup a local node in development mode till step 4
2. Deploy `sudoku.aleo`:

    `cd leo/sudoku && leo build`

    `export PRIVATE_KEY=<PRIVATE_KEY>`

    ```
    snarkos developer deploy sudoku.aleo --private-key $PRIVATE_KEY --query "http://localhost:3030" --path "leo/sudoku/build/" \
    --broadcast "http://localhost:3030/testnet3/transaction/broadcast" --fee 600000 \
    --record "{  owner: aleo14fhcxhsvmsyex23g9v3s6c3m6ep8zc54gv8zc9xtxwugpmqs4czqkx7kkz.private,  gates: 6874999400000u64.private,  _nonce: 3999189760269374026587416243617681089060371078748908085662719605779542084395group.public}"
    ```