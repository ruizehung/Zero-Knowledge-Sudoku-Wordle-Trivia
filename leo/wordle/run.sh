#! /bin/bash

if ! command -v leo &> /dev/null
then
  echo "leo is not installed."
  exit
fi

leo run create_game "{ c1: 0u8, c2: 1u8, c3: 2u8, c4: 3u8, c5: 4u8 }" 

leo run guess "{
  owner: aleo1ynccfwevfsw8vayzzx3qlv4avwzh3t0n399hrnpd732jm6jyacpszpf80s.private,
  gates: 0u64.private,
  solution: {
    c1: 0u8.private,
    c2: 1u8.private,
    c3: 2u8.private,
    c4: 3u8.private,
    c5: 4u8.private
  },
  remaining_trials: 6u8.public,
  guess_result: {
    r1: 0u8.public,
    r2: 0u8.public,
    r3: 0u8.public,
    r4: 0u8.public,
    r5: 0u8.public
  },
  won: false.public,
  _nonce: 1644191388331069210404353703162005934451077343044760736478341176001440873837group.public
}" "{ c1: 0u8, c2: 1u8, c3: 2u8, c4: 3u8, c5: 4u8 }" 

echo "Should have '3u8.public' for all r in guess_result"

leo run guess "{
  owner: aleo1ynccfwevfsw8vayzzx3qlv4avwzh3t0n399hrnpd732jm6jyacpszpf80s.private,
  gates: 0u64.private,
  solution: {
    c1: 0u8.private,
    c2: 1u8.private,
    c3: 2u8.private,
    c4: 3u8.private,
    c5: 4u8.private
  },
  remaining_trials: 6u8.public,
  guess_result: {
    r1: 0u8.public,
    r2: 0u8.public,
    r3: 0u8.public,
    r4: 0u8.public,
    r5: 0u8.public
  },
  won: false.public,
  _nonce: 1644191388331069210404353703162005934451077343044760736478341176001440873837group.public
}" "{ c1: 0u8, c2: 1u8, c3: 4u8, c4: 3u8, c5: 2u8 }" 

echo "Should have 1st, 2nd, and 4th guess_result = 3u8.public and the remaining be 2u8.public"