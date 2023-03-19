// The 'wordle' program.
program wordle.aleo {
    
    // A word of 5 characters. Represent each character as 0 to 25
    struct Word {
        c1: u8,
        c2: u8,
        c3: u8,
        c4: u8,
        c5: u8
    }

    // Result for each character could be 
    // 0 - N/A
    // 1 - wrong
    // 2 - solution contains character but wrong position
    // 3 - solution contains character and the position is correct
    struct GuessResult {
        r1: u8,
        r2: u8,
        r3: u8,
        r4: u8,
        r5: u8
    }

    // Player can compare the solution_hash after each guess to make sure 
    // the server doesn't cheat by changing the solution.
    record GameStatePlayerView {
        owner: address,
        gates: u64,
        server: address,
        solution_hash: field, 
        remaining_trials: u8,
        guess_result: GuessResult,
        won: bool
    }

    record GameStateServerView {
        owner: address,
        gates: u64,
        player: address,
        solution: Word,
        remaining_trials: u8,
        guess_result: GuessResult,
        won: bool
    }

    // Return a game record private to the game creator.
    // Also return the hash of the solution so that players can reference 
    // it in the future to make sure the server doesn't cheat.
    transition create_game(solution: Word, public player: address) -> (GameStateServerView, GameStatePlayerView) {
        let guess_result: GuessResult = GuessResult {
            r1: 0u8,
            r2: 0u8,
            r3: 0u8,
            r4: 0u8,
            r5: 0u8
        };

        let game_state_server_view: GameStateServerView = GameStateServerView {
            owner: self.caller,
            gates: 0u64,
            player: player,
            solution: solution,
            remaining_trials: 6u8,
            guess_result: guess_result,
            won: false
        };

        let game_state_player_view: GameStatePlayerView = GameStatePlayerView {
            owner: player,
            gates: 0u64,
            server: self.caller,
            solution_hash: BHP256::hash(solution),
            remaining_trials: 6u8,
            guess_result: guess_result,
            won: false
        };

        return (game_state_server_view, game_state_player_view);
    }

    transition guess(game: GameStateServerView, public player: address, public guess_word: Word) -> (GameStateServerView, GameStatePlayerView) {
        assert(self.caller == game.owner);
        assert(game.player == player);
        assert(game.remaining_trials > 0u8);
        
        // Extract the actual word 
        let c1: u8 = game.solution.c1;
        let c2: u8 = game.solution.c2;
        let c3: u8 = game.solution.c3;
        let c4: u8 = game.solution.c4;
        let c5: u8 = game.solution.c5;

        // Extract the guess
        let g1: u8 = guess_word.c1;
        let g2: u8 = guess_word.c2;
        let g3: u8 = guess_word.c3;
        let g4: u8 = guess_word.c4;
        let g5: u8 = guess_word.c5;
        
        let r1: u8 = 1u8;
        let r2: u8 = 1u8;
        let r3: u8 = 1u8;
        let r4: u8 = 1u8;
        let r5: u8 = 1u8;

        // Check if any guess character matches the solution
        if (g1 == c1) {
            r1 = 3u8;
            c1 = 26u8; // Marking the character as used
        }
        if (g2 == c2) {
            r2= 3u8;
            c2 = 26u8; // Marking the character as used
        }
        if (g3 == c3) {
            r3 = 3u8;
            c3 = 26u8; // Marking the character as used
        }
        if (g4 == c4) {
            r4 = 3u8;
            c4 = 26u8; // Marking the character as used
        }
        if (g5 == c5) {
            r5 = 3u8;
            c5 = 26u8; // Marking the character as used
        }

        // Check if any guess character is in the solution
        if (r1 == 1u8) {
            if (g1 == c2) {
                r1 = 2u8;
                c2 = 26u8;
            } else if (g1 == c3) {
                r1 = 2u8;
                c3 = 26u8;
            } else if (g1 == c4) {
                r1 = 2u8;
                c4 = 26u8;
            } else if (g1 == c5) {
                r1 = 2u8;
                c5 = 26u8;
            }
        }

        if (r2 == 1u8) {
            if (g2 == c1) {
                r2 = 2u8;
                c1 = 26u8;
            } else if (g2 == c3) {
                r2 = 2u8;
                c3 = 26u8;
            } else if (g2 == c4) {
                r2 = 2u8;
                c4 = 26u8;
            } else if (g2 == c5) {
                r2 = 2u8;
                c5 = 26u8;
            }
        }

        if (r3 == 1u8) {
            if (g3 == c1) {
                r3 = 2u8;
                c1 = 26u8;
            } else if (g3 == c2) {
                r3 = 2u8;
                c2 = 26u8;
            } else if (g3 == c4) {
                r3 = 2u8;
                c4 = 26u8;
            } else if (g3 == c5) {
                r3 = 2u8;
                c5 = 26u8;
            }
        }

        if (r4 == 1u8) {
            if (g4 == c1) {
                r4 = 2u8;
                c1 = 26u8;
            } else if (g4 == c2) {
                r4 = 2u8;
                c2 = 26u8;
            } else if (g4 == c3) {
                r4 = 2u8;
                c3 = 26u8;
            } else if (g4 == c5) {
                r4 = 2u8;
                c5 = 26u8;
            }
        }

        if (r5 == 1u8) {
            if (g5 == c1) {
                r5 = 2u8;
                c1 = 26u8;
            } else if (g5 == c2) {
                r5 = 2u8;
                c2 = 26u8;
            } else if (g5 == c3) {
                r5 = 2u8;
                c3 = 26u8;
            } else if (g5 == c4) {
                r5 = 2u8;
                c4 = 26u8;
            }
        }

        let guess_result: GuessResult = GuessResult {
            r1: r1,
            r2: r2,
            r3: r3,
            r4: r4,
            r5: r5
        };

        let game_state_server_view: GameStateServerView = GameStateServerView {
            owner: self.caller,
            gates: 0u64,
            player: player,
            solution: game.solution,
            remaining_trials: game.remaining_trials - 1u8,
            guess_result: guess_result,
            won: r1 == 3u8 && r2 == 3u8 && r3 == 3u8 && r4 == 3u8 && r5 == 3u8
        };

        let game_state_player_view: GameStatePlayerView = GameStatePlayerView {
            owner: player,
            gates: 0u64,
            server: self.caller,
            solution_hash: BHP256::hash(game.solution),
            remaining_trials: game.remaining_trials - 1u8,
            guess_result: guess_result,
            won: r1 == 3u8 && r2 == 3u8 && r3 == 3u8 && r4 == 3u8 && r5 == 3u8
        };

        return (game_state_server_view, game_state_player_view);
    }    
}
