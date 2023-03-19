#! /bin/bash

if ! command -v leo &> /dev/null
then
  echo "leo is not installed."
  exit
fi

leo run create_game "{ c1: 0u8, c2: 1u8, c3: 2u8, c4: 3u8, c5: 4u8 }" aleo1alheqp6zm4lfsf640cas2ey4lf6lrp0pqrag754dggaqhfgma5pqvt44zh

leo run guess "{
  owner: aleo1ynccfwevfsw8vayzzx3qlv4avwzh3t0n399hrnpd732jm6jyacpszpf80s.private,
  gates: 0u64.private,
  player: aleo1alheqp6zm4lfsf640cas2ey4lf6lrp0pqrag754dggaqhfgma5pqvt44zh.private,
  solution: {
    c1: 0u8.private,
    c2: 1u8.private,
    c3: 2u8.private,
    c4: 3u8.private,
    c5: 4u8.private
  },
  remaining_trials: 6u8.private,
  guess_result: {
    r1: 0u8.private,
    r2: 0u8.private,
    r3: 0u8.private,
    r4: 0u8.private,
    r5: 0u8.private
  },
  won: false.private,
  _nonce: 7965622171175162513418677272540163644698786166609661737937080882728398378910group.public
}" aleo1alheqp6zm4lfsf640cas2ey4lf6lrp0pqrag754dggaqhfgma5pqvt44zh "{ c1: 0u8, c2: 1u8, c3: 3u8, c4: 2u8, c5: 5u8 }" 

echo "Should have guess_result guess_result: {
    r1: 3u8.private,
    r2: 3u8.private,
    r3: 2u8.private,
    r4: 2u8.private,
    r5: 1u8.private
  }"

leo run guess "{
  owner: aleo1ynccfwevfsw8vayzzx3qlv4avwzh3t0n399hrnpd732jm6jyacpszpf80s.private,
  gates: 0u64.private,
  player: aleo1alheqp6zm4lfsf640cas2ey4lf6lrp0pqrag754dggaqhfgma5pqvt44zh.private,
  solution: {
    c1: 0u8.private,
    c2: 1u8.private,
    c3: 2u8.private,
    c4: 3u8.private,
    c5: 4u8.private
  },
  remaining_trials: 5u8.private,
  guess_result: {
    r1: 3u8.private,
    r2: 3u8.private,
    r3: 2u8.private,
    r4: 2u8.private,
    r5: 1u8.private
  },
  won: false.private,
  _nonce: 6850592470318186233532408124113664265199184347015583091427439743312169497597group.public
}" aleo1alheqp6zm4lfsf640cas2ey4lf6lrp0pqrag754dggaqhfgma5pqvt44zh "{ c1: 0u8, c2: 1u8, c3: 2u8, c4: 3u8, c5: 4u8 }" 

echo "Should have guess_result guess_result: {
    r1: 3u8.private,
    r2: 3u8.private,
    r3: 3u8.private,
    r4: 3u8.private,
    r5: 3u8.private
  }"