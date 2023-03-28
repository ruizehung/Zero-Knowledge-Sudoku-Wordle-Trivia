#! /bin/bash

if ! command -v leo &> /dev/null
then
  echo "leo is not installed."
  exit
fi

leo run new_quiz aleo1alheqp6zm4lfsf640cas2ey4lf6lrp0pqrag754dggaqhfgma5pqvt44zh "{
    prompt: 1234field,
    option1: 34563456787field,
    option2: 76578field,
    option3: 2345432field,
    option4: 52635745635field,
    answer: 2345432field
}" "{
    prompt: 456789765field,
    option1: 32452field,
    option2: 546432field,
    option3: 564532567field,
    option4: 543678543field,
    answer: 32452field
}" "{
    prompt: 45678976field,
    option1: 23453657field,
    option2: 765465467field,
    option3: 234556365456field,
    option4: 6238711732field,
    answer: 6238711732field
}" 

# There is a bug from aleo in the output of the following command ...
# The formating of quiz filed is incorrect. There are extra currly braces
leo run answer_question "{
    owner: aleo1f277ah0ecsknssaw7w3zz68tsj6cjag5jcrgu8qfdkec0fp52vysuuy9s2.private,
    gates: 0u64.private,
    player: aleo1alheqp6zm4lfsf640cas2ey4lf6lrp0pqrag754dggaqhfgma5pqvt44zh.private,
    quiz_id: 2565412135370744165803100348446095394755405371478854334589472736418113055445field.private,
    quiz: {
        question1: {
            prompt: 1234field.private,
            option1: 34563456787field.private,
            option2: 76578field.private,
            option3: 2345432field.private,
            option4: 52635745635field.private,
            answer: 2345432field.private
        }, 
        question2: {
            prompt: 456789765field.private,
            option1: 32452field.private,
            option2: 546432field.private,
            option3: 564532567field.private,
            option4: 543678543field.private,
            answer: 32452field.private
        },
        question3: {
            prompt: 45678976field.private,
            option1: 23453657field.private,
            option2: 765465467field.private,
            option3: 234556365456field.private,
            option4: 6238711732field.private,
            answer: 6238711732field.private
        }
    },
    question_to_answer: 1u8.private,
    player_score: 0u8.private,
    _nonce: 6282376350574510214919500632481654426986067952761050133350276908779696846210group.public
}" aleo1alheqp6zm4lfsf640cas2ey4lf6lrp0pqrag754dggaqhfgma5pqvt44zh 2345432field