import express, { Router, Request, Response } from "express";
import util from "util";
import { generateSampleTriviaQuiz, getGameStateServerView, hashStringToNumber } from "../utils";
const exec = util.promisify(require('child_process').exec);

const router: Router = express.Router();
const serverAleoPrivateKey = process.env.ALEO_PRIVATE_KEY;
const serverAleoViewKey = process.env.ALEO_VIEW_KEY;

let lastestTriviaGameStateServerViewRecord = "";
let triviaPrompts: string[] = [];
let triviaOptions: string[][] = [];
let triviaAnswers: string[] = [];

router.post('/new', async (req: Request, res: Response) => {
    console.log(`${req.originalUrl} called with ${JSON.stringify(req.body)}`);
    if (req.body.player_address === "") {
        res.json({ error: "Player address is required" });
        return
    }
    const { prompts, options, answers } = generateSampleTriviaQuiz();
    triviaPrompts = prompts; 
    triviaOptions = options;
    triviaAnswers = answers;

    const cmd = `snarkos developer execute trivia.aleo new_quiz ${req.body.player_address} "{
        prompt: ${hashStringToNumber(prompts[0])}field,
        option1: ${hashStringToNumber(options[0][0])}field,
        option2: ${hashStringToNumber(options[0][1])}field,
        option3: ${hashStringToNumber(options[0][2])}field,
        option4: ${hashStringToNumber(options[0][3])}field,
        answer: ${hashStringToNumber(answers[0])}field
    }" "{
        prompt: ${hashStringToNumber(prompts[1])}field,
        option1: ${hashStringToNumber(options[1][0])}field,
        option2: ${hashStringToNumber(options[1][1])}field,
        option3: ${hashStringToNumber(options[1][2])}field,
        option4: ${hashStringToNumber(options[1][3])}field,
        answer: ${hashStringToNumber(answers[1])}field
    }" "{
        prompt: ${hashStringToNumber(prompts[2])}field,
        option1: ${hashStringToNumber(options[2][0])}field,
        option2: ${hashStringToNumber(options[2][1])}field,
        option3: ${hashStringToNumber(options[2][2])}field,
        option4: ${hashStringToNumber(options[2][3])}field,
        answer: ${hashStringToNumber(answers[2])}field
    }" --private-key ${serverAleoPrivateKey} --query "http://localhost:3030" --broadcast "http://localhost:3030/testnet3/transaction/broadcast"`

    const { stdout: stdout_new, stderr: stderr_new } = await exec(cmd);

    console.log('stdout:', stdout_new);
    console.log('stdout:', stdout_new.split("\n")[4]);
    const execution_id = stdout_new.split("\n")[4];

    try {
        const game_state_server_view = await getGameStateServerView(execution_id, serverAleoViewKey!);
        // There is a bug in snarkOS output formating ....
        lastestTriviaGameStateServerViewRecord = game_state_server_view.replace("    }\n  ", "    ").replace("    }\n  ", "    ");
        console.log(`game_state_server_view: ${lastestTriviaGameStateServerViewRecord}`);
        lastestTriviaGameStateServerViewRecord = lastestTriviaGameStateServerViewRecord.trim();
        res.json({ status: "ready", execution_id: execution_id, prompt: prompts[0], options: options[0] })
    } catch (e) {
        console.log(e);
        res.json({ status: "failed" })
    }
});

router.post('/answer_question', async (req: Request, res: Response) => {
    console.log(`${req.originalUrl} called with ${JSON.stringify(req.body)}`);
    if (req.body.player_address === "" || req.body.player_address == null) {
        res.json({ error: "Player address is required" });
        return
    }
    if (req.body.player_guess === "" || req.body.player_guess == null) {
        res.json({ error: "Player guess is required" });
        return
    }

    const cmd = `snarkos developer execute trivia.aleo answer_question "${lastestTriviaGameStateServerViewRecord}" ${req.body.player_address} "${hashStringToNumber(req.body.player_guess)}field" --private-key ${serverAleoPrivateKey} --query "http://localhost:3030" --broadcast "http://localhost:3030/testnet3/transaction/broadcast"`;
    console.log(cmd);
    const { stdout: stdout_guess, stderr } = await exec(cmd);
    console.log('stdout:', stdout_guess);
    console.log('stdout:', stdout_guess.split("\n")[4]);
    const execution_id = stdout_guess.split("\n")[4];

    try {
        const game_state_server_view = await getGameStateServerView(execution_id, serverAleoViewKey!);
        // There is a bug in snarkOS output formating ....
        lastestTriviaGameStateServerViewRecord = game_state_server_view.replace("    }\n  ", "    ").replace("    }\n  ", "    ");
        console.log(`game_state_server_view: ${lastestTriviaGameStateServerViewRecord}`);
        lastestTriviaGameStateServerViewRecord = lastestTriviaGameStateServerViewRecord.trim();
    } catch (e) {
        console.log(e);
        res.json({ status: "failed" })
    }

    // Using a regular expression literal to match the question_to_answer
    const questionToAnswerRegex = /question_to_answer:\s*(\S+)\s*/;
    const scoreRegex = /player_score:\s*(\S+)\s*/;

    // Using the match method of String to get an array of matches
    const questionToAnswerMatches = lastestTriviaGameStateServerViewRecord.match(questionToAnswerRegex);
    const questionToAnswerAleoFormat = questionToAnswerMatches![1]; // The first group is the value of question_to_answer
    console.log(`questionToAnswerAleoFormat: ${questionToAnswerAleoFormat}`);

    const scoreMatches = lastestTriviaGameStateServerViewRecord.match(scoreRegex);
    const scoreAleoFormat = scoreMatches![1]; // The first group is the value of question_to_answer
    console.log(`scoreAleoFormat: ${scoreAleoFormat}`);
    
    const digitRegex = /(\d+)u/; // match one or more digits followed by u
    
    let match = questionToAnswerAleoFormat.trim().match(digitRegex); // apply the regex to the string and get the match result
    console.log(`questionToAnswer: ${match![1]}`);
    const questionToAnswer = parseInt(match![1]); // get the first capture group which is the number

    match = scoreAleoFormat.trim().match(digitRegex); // apply the regex to the string and get the match result
    console.log(`score: ${match![1]}`);
    const score = parseInt(match![1]); // get the first capture group which is the number

    if (questionToAnswer < 3) {
        res.json({ status: "success", execution_id: execution_id, answer_to_last_question: triviaAnswers[questionToAnswer - 1], score: score , prompt: triviaPrompts[questionToAnswer], options: triviaOptions[questionToAnswer] })
    } else {
        res.json({ status: "success", execution_id: execution_id, answer_to_last_question: triviaAnswers[questionToAnswer - 1], score: score })
    }
});

export default router;