#!/bin/bash

puzzle="{ row1: {
    n1: 5u8,
    n2: 3u8,
    n3: 0u8,
    n4: 0u8,
    n5: 7u8,
    n6: 0u8,
    n7: 0u8,
    n8: 0u8,
    n9: 0u8
  }, row2: {
    n1: 6u8,
    n2: 0u8,
    n3: 0u8,
    n4: 1u8,
    n5: 9u8,
    n6: 5u8,
    n7: 0u8,
    n8: 0u8,
    n9: 0u8
  }, row3: {
    n1: 0u8,
    n2: 9u8,
    n3: 8u8,
    n4: 0u8,
    n5: 0u8,
    n6: 0u8,
    n7: 0u8,
    n8: 6u8,
    n9: 0u8
  }, row4: {
    n1: 8u8,
    n2: 0u8,
    n3: 0u8,
    n4: 0u8,
    n5: 6u8,
    n6: 0u8,
    n7: 0u8,
    n8: 0u8,
    n9: 3u8
  }, row5: {
    n1: 4u8,
    n2: 0u8,
    n3: 0u8,
    n4: 8u8,
    n5: 0u8,
    n6: 3u8,
    n7: 0u8,
    n8: 0u8,
    n9: 1u8
  }, row6: {
    n1: 7u8,
    n2: 0u8,
    n3: 0u8,
    n4: 0u8,
    n5: 2u8,
    n6: 0u8,
    n7: 0u8,
    n8: 0u8,
    n9: 6u8
  }, row7: {
    n1: 0u8,
    n2: 6u8,
    n3: 0u8,
    n4: 0u8,
    n5: 0u8,
    n6: 0u8,
    n7: 2u8,
    n8: 8u8,
    n9: 0u8
  }, row8: {
    n1: 0u8,
    n2: 0u8,
    n3: 0u8,
    n4: 4u8,
    n5: 1u8,
    n6: 9u8,
    n7: 0u8,
    n8: 0u8,
    n9: 5u8
  }, row9: {
    n1: 0u8,
    n2: 0u8,
    n3: 0u8,
    n4: 0u8,
    n5: 8u8,
    n6: 0u8,
    n7: 0u8,
    n8: 7u8,
    n9: 9u8
  }
}"

snarkos developer execute sudoku.aleo solve_puzzle "$puzzle" "{ row1: { 
    n1: 5u8,
    n2: 3u8,
    n3: 4u8,
    n4: 6u8,
    n5: 7u8,
    n6: 8u8,
    n7: 9u8,
    n8: 1u8,
    n9: 2u8
  }, row2: {
    n1: 6u8,
    n2: 7u8,
    n3: 2u8,
    n4: 1u8,
    n5: 9u8,
    n6: 5u8,
    n7: 3u8,
    n8: 4u8,
    n9: 8u8
  }, row3: {
    n1: 1u8,
    n2: 9u8,
    n3: 8u8,
    n4: 3u8,
    n5: 4u8,
    n6: 2u8,
    n7: 5u8,
    n8: 6u8,
    n9: 7u8
  }, row4: {
    n1: 8u8,
    n2: 5u8,
    n3: 9u8,
    n4: 7u8,
    n5: 6u8,
    n6: 1u8,
    n7: 4u8,
    n8: 2u8,
    n9: 3u8
  }, row5: {
    n1: 4u8,
    n2: 2u8,
    n3: 6u8,
    n4: 8u8,
    n5: 5u8,
    n6: 3u8,
    n7: 7u8,
    n8: 9u8,
    n9: 1u8
  }, row6: {
    n1: 7u8,
    n2: 1u8,
    n3: 3u8,
    n4: 9u8,
    n5: 2u8,
    n6: 4u8,
    n7: 8u8,
    n8: 5u8,
    n9: 6u8
  }, row7: {
    n1: 9u8,
    n2: 6u8,
    n3: 1u8,
    n4: 5u8,
    n5: 3u8,
    n6: 7u8,
    n7: 2u8,
    n8: 8u8,
    n9: 4u8
  }, row8: {
    n1: 2u8,
    n2: 8u8,
    n3: 7u8,
    n4: 4u8,
    n5: 1u8,
    n6: 9u8,
    n7: 6u8,
    n8: 3u8,
    n9: 5u8
  }, row9: {
    n1: 3u8,
    n2: 4u8,
    n3: 5u8,
    n4: 2u8,
    n5: 8u8,
    n6: 6u8,
    n7: 1u8,
    n8: 7u8,
    n9: 9u8
  }
}" --private-key $PRIVATE_KEY --query "http://localhost:3030" --broadcast "http://localhost:3030/testnet3/transaction/broadcast" 

# echo "Should output solved: true.public "

