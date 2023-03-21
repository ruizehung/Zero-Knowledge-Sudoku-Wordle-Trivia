import express, { Router, Request, Response } from "express";
import fs from "fs";
import { acir_from_bytes } from "@noir-lang/noir_wasm";
import { TriviaABI } from "./abi";
import { generateSampleTriviaQuiz, getGameStateServerView, hashStringToNumber, numToHex } from "../utils";
import { BarretenbergWasm } from "@noir-lang/barretenberg/dest/wasm";
import { SinglePedersen } from "@noir-lang/barretenberg/dest/crypto";
import path from "path";
import { create_proof, setup_generic_prover_and_verifier } from "@noir-lang/barretenberg/dest/client_proofs";

const router: Router = express.Router();
let playerScore = 0;
let currentPrompts: string[] = [];
let currentOptions: string[][] = [];
let currentAnswers: string[] = [];
let currentAnswersInNumbers: number[] = [];
let currentAnswersHash: string = "";
let currentPlayerGuesses: string[] = [];
let currentQuestionToAnswer: number = -1;

router.get('/new', async (req: Request, res: Response) => {
    console.log(`${req.originalUrl} called with ${JSON.stringify(req.body)}`);

    const { prompts, options, answers } = generateSampleTriviaQuiz();
    currentPrompts = prompts;
    currentOptions = options;
    currentAnswers = answers;
    playerScore = 0;
    currentPlayerGuesses = [];
    currentQuestionToAnswer = -1;
    
    currentAnswersInNumbers = answers.map(answer => hashStringToNumber(answer));
    const barretenberg = await BarretenbergWasm.new();
    const pedersen = new SinglePedersen(barretenberg);
    const answers_buffer = pedersen.compressInputs(currentAnswersInNumbers.map((e: number) => Buffer.from(numToHex(e), 'hex')));
    currentAnswersHash = `0x${answers_buffer.toString('hex')}`;

    res.json({ prompt: currentPrompts[0], options: currentOptions[0], answers_hash: currentAnswersHash  })

});

router.post('/answer_question', async (req: Request, res: Response) => {
    console.log(`${req.originalUrl} called with ${JSON.stringify(req.body)}`);
    if (req.body.player_guess == null) {
        res.json({ error: "Player guess is required" });
        return
    }

    const player_guess = req.body.player_guess;
    currentQuestionToAnswer += 1;
    
    if (currentQuestionToAnswer < currentPrompts.length - 1) {
        if (player_guess == currentAnswers[currentQuestionToAnswer]) {
            playerScore += 1;
        }
        currentPlayerGuesses.push(player_guess);
        res.json({ prompt: currentPrompts[currentQuestionToAnswer + 1], options: currentOptions[currentQuestionToAnswer + 1], score: playerScore, answer_to_last_question: currentAnswers[currentQuestionToAnswer] });
    } else {
        if (player_guess == currentAnswers[currentQuestionToAnswer]) {
            playerScore += 1;
        }
        currentPlayerGuesses.push(player_guess);

        // Compute proof 
        const buffer = fs.readFileSync(path.resolve(__dirname, '../../circuits/triviaAcir.buf'));
        const bytes = new Uint8Array(buffer);
        const acir = acir_from_bytes(bytes);

        const guessesInNumber: number[] = [];
        const optionsInNumber: number[] = [];
        for (let i = 0; i < currentPlayerGuesses.length; i++) {
            guessesInNumber.push(hashStringToNumber(currentPlayerGuesses[i]));
            for (let j = 0; j < currentOptions[i].length; j++) {
                optionsInNumber.push(hashStringToNumber(currentOptions[i][j]));
            }
        }

        const abi: TriviaABI = {
            answers_hash: currentAnswersHash,
            answers: currentAnswersInNumbers,
            options: optionsInNumber,
            guesses: guessesInNumber,
            score: playerScore
        };

        let [prover, _] = await setup_generic_prover_and_verifier(acir);
        const proof = await create_proof(prover, acir, abi);

        res.json({ score: playerScore, answer_to_last_question: currentAnswers[currentQuestionToAnswer], proof });
    }
});

export default router;