export type SudokuABI = {
    solution: number[];
    puzzle: number[];
}

export type WordleABI = {
    solution_hash: string;
    solution: number[];
    guess: number[];
    guess_result: number[];
}

export type TriviaABI = {
    answers_hash: string;
    answers: number[];
    options: number[];
    guesses: number[];
    score: number;
}

