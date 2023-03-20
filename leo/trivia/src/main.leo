// The 'trivia' program.
program trivia.aleo {

    // Question with a prompt and 4 options.
    // Only one of the options is correct.
    // Since Leo hasn't supported string. Now it stores the hash of the string.
    struct Question {
        prompt: field,
        option1: field,
        option2: field,
        option3: field,
        option4: field,
        answer: field
    }

    struct Quiz {
        question1: Question,
        question2: Question,
        question3: Question
    }

    // quiz_id is the hash of quiz struct
    // question_to_answer: 0u8 ~ 2u8
    // player_score: 0u8 ~ 3u8
    record QuizStateServerView {
        owner: address,
        player: address,
        gates: u64,
        quiz_id: field,
        quiz: Quiz,
        question_to_answer: u8, 
        player_score: u8
    }

    record QuizStatePlayerView {
        owner: address,
        server: address,
        gates: u64,
        quiz_id: field,
        question_to_answer: u8, 
        player_guess_to_last_question: field,
        answer_to_last_question: field,
        prompt: field,
        option1: field,
        option2: field,
        option3: field,
        option4: field,
        player_score: u8 
    }

    transition new_quiz(public player: address, q1: Question, q2: Question, q3: Question) -> (QuizStateServerView, QuizStatePlayerView) {
        let quiz: Quiz = Quiz {
            question1: q1,
            question2: q2,
            question3: q3
        };

        let quiz_state_server: QuizStateServerView = QuizStateServerView {
            owner: self.caller,
            player: player,
            gates: 0u64,
            quiz_id: BHP512::hash(quiz),
            quiz: quiz,
            question_to_answer: 0u8, 
            player_score: 0u8
        };

        let quiz_state_player: QuizStatePlayerView = QuizStatePlayerView {
            owner: player,
            server: self.caller,
            gates: 0u64,
            quiz_id: BHP512::hash(quiz),
            question_to_answer: 0u8, 
            player_guess_to_last_question: 0field,
            answer_to_last_question: 0field,
            prompt: q1.prompt,
            option1: q1.option1,
            option2: q1.option2,
            option3: q1.option3,
            option4: q1.option4,
            player_score: 0u8 
        };
        return (quiz_state_server, quiz_state_player);
    }

    transition answer_question(quiz_state: QuizStateServerView, player: address, player_guess: field) -> (QuizStateServerView, QuizStatePlayerView) {
        let answer_to_last_question: field = 0field;
        let player_score: u8 = quiz_state.player_score;
        let prompt: field = 0field;
        let option1: field = 0field;
        let option2: field = 0field;
        let option3: field = 0field;
        let option4: field = 0field;
        
        if (quiz_state.question_to_answer == 0u8) {
            if (player_guess == quiz_state.quiz.question1.answer) {
                player_score = player_score + 1u8;
            } 
            answer_to_last_question = quiz_state.quiz.question1.answer;
            prompt = quiz_state.quiz.question2.prompt;
            option1 = quiz_state.quiz.question2.option1;
            option2 = quiz_state.quiz.question2.option2;
            option3 = quiz_state.quiz.question2.option3;
            option4 = quiz_state.quiz.question2.option4;
        }

        if (quiz_state.question_to_answer == 1u8) {
            if (player_guess == quiz_state.quiz.question2.answer) {
                player_score = player_score + 1u8;
            } 
            answer_to_last_question = quiz_state.quiz.question2.answer;
            prompt = quiz_state.quiz.question3.prompt;
            option1 = quiz_state.quiz.question3.option1;
            option2 = quiz_state.quiz.question3.option2;
            option3 = quiz_state.quiz.question3.option3;
            option4 = quiz_state.quiz.question3.option4;
        }

        if (quiz_state.question_to_answer == 2u8) {
            if (player_guess == quiz_state.quiz.question3.answer) {
                player_score = player_score + 1u8;
            } 
            answer_to_last_question = quiz_state.quiz.question3.answer;
        }


        let quiz_state_server: QuizStateServerView = QuizStateServerView {
            owner: self.caller,
            player: player,
            gates: 0u64,
            quiz_id: BHP512::hash(quiz_state.quiz),
            quiz: quiz_state.quiz,
            question_to_answer: quiz_state.question_to_answer + 1u8, 
            player_score: player_score
        };

        let quiz_state_player: QuizStatePlayerView = QuizStatePlayerView {
            owner: player,
            server: self.caller,
            gates: 0u64,
            quiz_id: BHP512::hash(quiz_state.quiz),
            question_to_answer: quiz_state.question_to_answer + 1u8, 
            player_guess_to_last_question: player_guess,
            answer_to_last_question: answer_to_last_question,
            prompt: prompt,
            option1: option1,
            option2: option2,
            option3: option3,
            option4: option4,
            player_score: player_score 
        };
        return (quiz_state_server, quiz_state_player);
    }
}
