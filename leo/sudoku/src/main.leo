// The 'sudoku' program.
program sudoku.aleo {
    struct NineNumbers {
        n1: u8,
        n2: u8,
        n3: u8,
        n4: u8,
        n5: u8,
        n6: u8,
        n7: u8,
        n8: u8,
        n9: u8,
    }

    // n23 means row 2 column 3
    // Each number value should be from 1 to 9
    // 0 means empty cell
    // Note: Seems like a single struct can hold at most 32 fields
    struct PuzzleInfo {
        row1: NineNumbers,
        row2: NineNumbers,
        row3: NineNumbers,
        row4: NineNumbers,
        row5: NineNumbers,
        row6: NineNumbers,
        row7: NineNumbers,
        row8: NineNumbers,
        row9: NineNumbers
    }

    record Puzzle {
        public owner: address,
        gates: u64,
        public solved: bool,
        public info: PuzzleInfo
    }
    
    transition solve_puzzle(public puzzle: PuzzleInfo, private solution: PuzzleInfo ) -> Puzzle {    
        // Check that the solution is indeed solving the puzzle
        assert(solution_row_match_puzzle_row(puzzle.row1, solution.row1) &&
                solution_row_match_puzzle_row(puzzle.row2, solution.row2) &&
                solution_row_match_puzzle_row(puzzle.row3, solution.row3) &&
                solution_row_match_puzzle_row(puzzle.row4, solution.row4) &&
                solution_row_match_puzzle_row(puzzle.row5, solution.row5) &&
                solution_row_match_puzzle_row(puzzle.row6, solution.row6) &&
                solution_row_match_puzzle_row(puzzle.row7, solution.row7) &&
                solution_row_match_puzzle_row(puzzle.row8, solution.row8) && 
                solution_row_match_puzzle_row(puzzle.row9, solution.row9));
        
        let rows_valid: bool = is_valid_line(solution.row1) && is_valid_line(solution.row2) && is_valid_line(solution.row3) && is_valid_line(solution.row4) && is_valid_line(solution.row5) && is_valid_line(solution.row6) && is_valid_line(solution.row7) && is_valid_line(solution.row8) && is_valid_line(solution.row9);

        let column1: NineNumbers = NineNumbers { n1: solution.row1.n1, n2: solution.row2.n1, n3: solution.row3.n1, n4: solution.row4.n1, n5: solution.row5.n1, n6: solution.row6.n1, n7: solution.row7.n1, n8: solution.row8.n1, n9: solution.row9.n1 };
        let column2: NineNumbers = NineNumbers { n1: solution.row1.n2, n2: solution.row2.n2, n3: solution.row3.n2, n4: solution.row4.n2, n5: solution.row5.n2, n6: solution.row6.n2, n7: solution.row7.n2, n8: solution.row8.n2, n9: solution.row9.n2 };
        let column3: NineNumbers = NineNumbers { n1: solution.row1.n3, n2: solution.row2.n3, n3: solution.row3.n3, n4: solution.row4.n3, n5: solution.row5.n3, n6: solution.row6.n3, n7: solution.row7.n3, n8: solution.row8.n3, n9: solution.row9.n3 };
        let column4: NineNumbers = NineNumbers { n1: solution.row1.n4, n2: solution.row2.n4, n3: solution.row3.n4, n4: solution.row4.n4, n5: solution.row5.n4, n6: solution.row6.n4, n7: solution.row7.n4, n8: solution.row8.n4, n9: solution.row9.n4 };
        let column5: NineNumbers = NineNumbers { n1: solution.row1.n5, n2: solution.row2.n5, n3: solution.row3.n5, n4: solution.row4.n5, n5: solution.row5.n5, n6: solution.row6.n5, n7: solution.row7.n5, n8: solution.row8.n5, n9: solution.row9.n5 };
        let column6: NineNumbers = NineNumbers { n1: solution.row1.n6, n2: solution.row2.n6, n3: solution.row3.n6, n4: solution.row4.n6, n5: solution.row5.n6, n6: solution.row6.n6, n7: solution.row7.n6, n8: solution.row8.n6, n9: solution.row9.n6 };
        let column7: NineNumbers = NineNumbers { n1: solution.row1.n7, n2: solution.row2.n7, n3: solution.row3.n7, n4: solution.row4.n7, n5: solution.row5.n7, n6: solution.row6.n7, n7: solution.row7.n7, n8: solution.row8.n7, n9: solution.row9.n7 };
        let column8: NineNumbers = NineNumbers { n1: solution.row1.n8, n2: solution.row2.n8, n3: solution.row3.n8, n4: solution.row4.n8, n5: solution.row5.n8, n6: solution.row6.n8, n7: solution.row7.n8, n8: solution.row8.n8, n9: solution.row9.n8 };
        let column9: NineNumbers = NineNumbers { n1: solution.row1.n9, n2: solution.row2.n9, n3: solution.row3.n9, n4: solution.row4.n9, n5: solution.row5.n9, n6: solution.row6.n9, n7: solution.row7.n9, n8: solution.row8.n9, n9: solution.row9.n9 };

        let cols_valid: bool = is_valid_line(column1) && is_valid_line(column2) && is_valid_line(column3) && is_valid_line(column4) && is_valid_line(column5) && is_valid_line(column6) && is_valid_line(column7) && is_valid_line(column8) && is_valid_line(column9);
        
        // 1 2 3
        // 4 5 6
        // 7 8 9
        let subgrid1: NineNumbers = NineNumbers { n1: solution.row1.n1, n2: solution.row1.n2, n3: solution.row1.n3, n4: solution.row2.n1, n5: solution.row2.n2, n6: solution.row2.n3, n7: solution.row3.n1, n8: solution.row3.n2, n9: solution.row3.n3 };
        let subgrid2: NineNumbers = NineNumbers { n1: solution.row1.n4, n2: solution.row1.n5, n3: solution.row1.n6, n4: solution.row2.n4, n5: solution.row2.n5, n6: solution.row2.n6, n7: solution.row3.n4, n8: solution.row3.n5, n9: solution.row3.n6 };
        let subgrid3: NineNumbers = NineNumbers { n1: solution.row1.n7, n2: solution.row1.n8, n3: solution.row1.n9, n4: solution.row2.n7, n5: solution.row2.n8, n6: solution.row2.n9, n7: solution.row3.n7, n8: solution.row3.n8, n9: solution.row3.n9 };
        let subgrid4: NineNumbers = NineNumbers { n1: solution.row4.n1, n2: solution.row4.n2, n3: solution.row4.n3, n4: solution.row5.n1, n5: solution.row5.n2, n6: solution.row5.n3, n7: solution.row6.n1, n8: solution.row6.n2, n9: solution.row6.n3 };
        let subgrid5: NineNumbers = NineNumbers { n1: solution.row4.n4, n2: solution.row4.n5, n3: solution.row4.n6, n4: solution.row5.n4, n5: solution.row5.n5, n6: solution.row5.n6, n7: solution.row6.n4, n8: solution.row6.n5, n9: solution.row6.n6 };
        let subgrid6: NineNumbers = NineNumbers { n1: solution.row4.n7, n2: solution.row4.n8, n3: solution.row4.n9, n4: solution.row5.n7, n5: solution.row5.n8, n6: solution.row5.n9, n7: solution.row6.n7, n8: solution.row6.n8, n9: solution.row6.n9 };
        let subgrid7: NineNumbers = NineNumbers { n1: solution.row7.n1, n2: solution.row7.n2, n3: solution.row7.n3, n4: solution.row8.n1, n5: solution.row8.n2, n6: solution.row8.n3, n7: solution.row9.n1, n8: solution.row9.n2, n9: solution.row9.n3 };
        let subgrid8: NineNumbers = NineNumbers { n1: solution.row7.n4, n2: solution.row7.n5, n3: solution.row7.n6, n4: solution.row8.n4, n5: solution.row8.n5, n6: solution.row8.n6, n7: solution.row9.n4, n8: solution.row9.n5, n9: solution.row9.n6 };
        let subgrid9: NineNumbers = NineNumbers { n1: solution.row7.n7, n2: solution.row7.n8, n3: solution.row7.n9, n4: solution.row8.n7, n5: solution.row8.n8, n6: solution.row8.n9, n7: solution.row9.n7, n8: solution.row9.n8, n9: solution.row9.n9 };

        let subgrids_valid: bool = is_valid_line(subgrid1) && is_valid_line(subgrid2) && is_valid_line(subgrid3) && is_valid_line(subgrid4) && is_valid_line(subgrid5) && is_valid_line(subgrid6) && is_valid_line(subgrid7) && is_valid_line(subgrid8) && is_valid_line(subgrid9);

        return Puzzle {
            owner: self.caller,
            gates: 0u64,
            solved: rows_valid && cols_valid && subgrids_valid,
            info: puzzle,
        };
    }

    function solution_row_match_puzzle_row(puzzle_row: NineNumbers, solution_row: NineNumbers) -> bool {
        return (puzzle_row.n1 == 0u8 || puzzle_row.n1 == solution_row.n1) && 
                (puzzle_row.n2 == 0u8 || puzzle_row.n2 == solution_row.n2) && 
                (puzzle_row.n3 == 0u8 || puzzle_row.n3 == solution_row.n3) && 
                (puzzle_row.n4 == 0u8 || puzzle_row.n4 == solution_row.n4) && 
                (puzzle_row.n5 == 0u8 || puzzle_row.n5 == solution_row.n5) &&
                (puzzle_row.n6 == 0u8 || puzzle_row.n6 == solution_row.n6) && 
                (puzzle_row.n7 == 0u8 || puzzle_row.n7 == solution_row.n7) && 
                (puzzle_row.n8 == 0u8 || puzzle_row.n8 == solution_row.n8) && 
                (puzzle_row.n9 == 0u8 || puzzle_row.n9 == solution_row.n9);
    }

    function is_valid_line(l: NineNumbers) -> bool {
        l = bubble_sort_line(l);
        return l.n1 == 1u8 && l.n2 == 2u8 && l.n3 == 3u8 && l.n4 == 4u8 && l.n5 == 5u8 && l.n6 == 6u8 && l.n7 == 7u8 && l.n8 == 8u8 && l.n9 == 9u8;
    }

    inline bubble_sort_line(l: NineNumbers) -> NineNumbers {
        // Unpack the entries in the board into variables.
        let n1: u8 = l.n1;
        let n2: u8 = l.n2;
        let n3: u8 = l.n3;
        let n4: u8 = l.n4;
        let n5: u8 = l.n5;
        let n6: u8 = l.n6;
        let n7: u8 = l.n7;
        let n8: u8 = l.n8;
        let n9: u8 = l.n9;

        if n2 < n1 {
            let temp: u8 = n1;
            n1 = n2;
            n2 = temp;
        }

        if n3 < n2 {
            let temp: u8 = n2;
            n2 = n3;
            n3 = temp;
        }

        if n4 < n3 {
            let temp: u8 = n3;
            n3 = n4;
            n4 = temp;
        }

        if n5 < n4 {
            let temp: u8 = n4;
            n4 = n5;
            n5 = temp;
        }

        if n6 < n5 {
            let temp: u8 = n5;
            n5 = n6;
            n6 = temp;
        }

        if n7 < n6 {
            let temp: u8 = n6;
            n6 = n7;
            n7 = temp;
        }

        if n8 < n7 {
            let temp: u8 = n7;
            n7 = n8;
            n8 = temp;
        }
        
        if n9 < n8 {
            let temp: u8 = n8;
            n8 = n9;
            n9 = temp;
        }

        
        if n2 < n1 {
            let temp: u8 = n1;
            n1 = n2;
            n2 = temp;
        }

        
        if n3 < n2 {
            let temp: u8 = n2;
            n2 = n3;
            n3 = temp;
        }

        
        if n4 < n3 {
            let temp: u8 = n3;
            n3 = n4;
            n4 = temp;
        }

        
        if n5 < n4 {
            let temp: u8 = n4;
            n4 = n5;
            n5 = temp;
        }

        
        if n6 < n5 {
            let temp: u8 = n5;
            n5 = n6;
            n6 = temp;
        }

        
        if n7 < n6 {
            let temp: u8 = n6;
            n6 = n7;
            n7 = temp;
        }

        if n8 < n7 {
            let temp: u8 = n7;
            n7 = n8;
            n8 = temp;
        }

        
        if n2 < n1 {
            let temp: u8 = n1;
            n1 = n2;
            n2 = temp;
        }

        
        if n3 < n2 {
            let temp: u8 = n2;
            n2 = n3;
            n3 = temp;
        }

        
        if n4 < n3 {
            let temp: u8 = n3;
            n3 = n4;
            n4 = temp;
        }

        
        if n5 < n4 {
            let temp: u8 = n4;
            n4 = n5;
            n5 = temp;
        }

        
        if n6 < n5 {
            let temp: u8 = n5;
            n5 = n6;
            n6 = temp;
        }

        if n7 < n6 {
            let temp: u8 = n6;
            n6 = n7;
            n7 = temp;
        }

        
        if n2 < n1 {
            let temp: u8 = n1;
            n1 = n2;
            n2 = temp;
        }

        
        if n3 < n2 {
            let temp: u8 = n2;
            n2 = n3;
            n3 = temp;
        } 
        
        if n4 < n3 { 
            let temp: u8 = n3;
            n3 = n4;
            n4 = temp;
        } 
        
        if n5 < n4 { 
            let temp: u8 = n4;
            n4 = n5;
            n5 = temp;
        } 

        if n6 < n5 {
            let temp: u8 = n5;
            n5 = n6;
            n6 = temp;
        }
        
        if n2 < n1 { 
            let temp: u8 = n1;
            n1 = n2;
            n2 = temp;
        } 
        
        if n3 < n2 { 
            let temp: u8 = n2;
            n2 = n3;
            n3 = temp;
        }

        
        if n4 < n3 {
            let temp: u8 = n3;
            n3 = n4;
            n4 = temp;
        }

        if n5 < n4 { 
            let temp: u8 = n4;
            n4 = n5;
            n5 = temp;
        } 

        
        if n2 < n1 {
            let temp: u8 = n1;
            n1 = n2;
            n2 = temp;
        }

        
        if n3 < n2 {
            let temp: u8 = n2;
            n2 = n3;
            n3 = temp;
        }

        if n4 < n3 {
            let temp: u8 = n3;
            n3 = n4;
            n4 = temp;
        }

        
        if n2 < n1 {
            let temp: u8 = n1;
            n1 = n2;
            n2 = temp;
        }

        if n3 < n2 {
            let temp: u8 = n2;
            n2 = n3;
            n3 = temp;
        }

        if n2 < n1 {
            let temp: u8 = n1;
            n1 = n2;
            n2 = temp;
        }

        return NineNumbers { n1, n2, n3, n4, n5, n6, n7, n8, n9 };
    }
}