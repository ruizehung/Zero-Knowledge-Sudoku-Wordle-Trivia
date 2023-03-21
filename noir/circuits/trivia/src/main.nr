use dep::std;

fn main(answer_hash: pub Field, answer: Field, guess : pub Field, correctness : pub Field) {
    if (answer == guess) {
        constrain correctness == 1;
    } else {
        constrain correctness == 0;
    }
    let computed_hash = std::hash::pedersen([answer]);
    constrain answer_hash == computed_hash[0];
}