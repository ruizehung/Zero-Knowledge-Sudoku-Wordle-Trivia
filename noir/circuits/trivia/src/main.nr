use dep::std;

fn main(answers_hash: pub Field, answers: [Field;3], options: pub [Field;12], guesses: pub [Field;3], score: pub Field) {
    // Confirm at least one of the options is correct for each question
    let mut answers_found: Field = 0;
    for i in 0..4 {
        if (answers[0] == options[i]) {
            answers_found = answers_found + 1;
        }
    };

    for i in 4..8 {
        if (answers[1] == options[i]) {
            answers_found = answers_found + 1;
        } 
    };

    for i in 8..12 {
        if (answers[2] == options[i]) {
            answers_found = answers_found + 1;
        } 
    };

    constrain answers_found == 3;

    // Confirm the score is correct 
    let mut computed_score: Field = 0;
    for i in 0..3 {
        if (answers[i] == guesses[i]) {
            computed_score = computed_score + 1;
        } 
    };
    constrain computed_score == score;

    // Confirm the answers_hash is correct 
    let computed_hash = std::hash::pedersen(answers);
    constrain answers_hash == computed_hash[0];
}