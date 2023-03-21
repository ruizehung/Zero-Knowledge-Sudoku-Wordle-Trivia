use dep::std;

fn main(answer_hash: pub Field, answers: [Field;3], guesses: pub [Field;3], score: pub Field) {
    let mut computed_score: Field = 0;
    for i in 0..3 {
        if (answers[i] == guesses[i]) {
            computed_score = computed_score + 1;
        } 
    };
    constrain computed_score == score;
    let computed_hash = std::hash::pedersen(answers);
    constrain answer_hash == computed_hash[0];
}