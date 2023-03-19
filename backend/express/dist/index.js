"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const noir_wasm_1 = require("@noir-lang/noir_wasm");
const client_proofs_1 = require("@noir-lang/barretenberg/dest/client_proofs");
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors"));
const util_1 = __importDefault(require("util"));
const exec = util_1.default.promisify(require('child_process').exec);
const wordList_1 = require("./wordList");
const utils_1 = require("./utils");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
const serverAleoPrivateKey = process.env.ALEO_PRIVATE_KEY;
const serverAleoViewKey = process.env.ALEO_VIEW_KEY;
app.use(express_1.default.json());
app.use((0, cors_1.default)()); // Add CORS middleware
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('Express + TypeScript Server');
}));
app.post('/sudoku', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const buffer = fs_1.default.readFileSync('circuits/sudokuAcir.buf');
    const bytes = new Uint8Array(buffer);
    const acir = (0, noir_wasm_1.acir_from_bytes)(bytes);
    const abi = {
        solution: req.body.solution,
        puzzle: req.body.puzzle,
    };
    let [prover, _] = yield (0, client_proofs_1.setup_generic_prover_and_verifier)(acir);
    const proof = yield (0, client_proofs_1.create_proof)(prover, acir, abi);
    res.json({ proof: proof });
}));
let lastestGameRecord = "";
app.post('/wordle/new', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`/wordle/new called with ${JSON.stringify(req.body)}`);
    if (req.body.player_address === "") {
        res.json({ error: "Player address is required" });
        return;
    }
    const solution = wordList_1.WordList[Math.floor(Math.random() * wordList_1.WordList.length)];
    console.log('solution:', solution);
    // Create Game 
    const solution_array = [];
    for (let i = 0; i < solution.length; i++) {
        solution_array.push(solution.charCodeAt(i) - "a".charCodeAt(0));
    }
    const { stdout: stdout_create_game, stderr: stderr_create_game } = yield exec(`snarkos developer execute wordle.aleo create_game "{ c1: ${solution_array[0]}u8, c2: ${solution_array[1]}u8, c3: ${solution_array[2]}u8, c4: ${solution_array[3]}u8, c5: ${solution_array[4]}u8 }" ${req.body.player_address} --private-key ${serverAleoPrivateKey} --query "http://localhost:3030" --broadcast "http://localhost:3030/testnet3/transaction/broadcast"`);
    console.log('stdout:', stdout_create_game);
    console.log('stdout:', stdout_create_game.split("\n")[4]);
    const execution_id = stdout_create_game.split("\n")[4];
    try {
        lastestGameRecord = yield (0, utils_1.getGameStateServerView)(execution_id, serverAleoViewKey);
        lastestGameRecord = lastestGameRecord.trim();
        res.json({ status: "ready" });
    }
    catch (e) {
        console.log(e);
        res.json({ status: "failed" });
    }
}));
app.post('/wordle/guess', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`/wordle/guess called with ${JSON.stringify(req.body)}`);
    if (req.body.guess === "" || req.body.guess == null) {
        res.json({ error: "Player guess is required" });
        return;
    }
    if (req.body.player_address === "" || req.body.player_address == null) {
        res.json({ error: "Player address is required" });
        return;
    }
    if (req.body.player_view_key === "" || req.body.player_view_key == null) {
        res.json({ error: "Player view key is required" });
        return;
    }
    const cmd = `snarkos developer execute wordle.aleo guess "${lastestGameRecord}" ${req.body.player_address} "{ c1: ${req.body.guess[0]}u8, c2: ${req.body.guess[1]}u8, c3: ${req.body.guess[2]}u8, c4: ${req.body.guess[3]}u8, c5: ${req.body.guess[4]}u8 }" --private-key ${serverAleoPrivateKey} --query "http://localhost:3030" --broadcast "http://localhost:3030/testnet3/transaction/broadcast"`;
    console.log(cmd);
    const { stdout: stdout_guess, stderr } = yield exec(cmd);
    console.log('stdout:', stdout_guess);
    console.log('stdout:', stdout_guess.split("\n")[4]);
    const execution_id = stdout_guess.split("\n")[4];
    // Get game state server view
    try {
        lastestGameRecord = yield (0, utils_1.getGameStateServerView)(execution_id, serverAleoViewKey);
        lastestGameRecord = lastestGameRecord.trim();
    }
    catch (e) {
        console.log(e);
        res.json({ status: "failed", error: e });
        return;
    }
    const guess_results = [];
    let regex = /guess_result:\s*\{([^}]+)\}/; // match guess_result followed by a curly brace block
    let match = lastestGameRecord.match(regex); // apply the regex to the string and get the match result
    if (match) {
        let guess_result = match[1]; // get the first capture group and add curly braces around it
        console.log(guess_result); // print the guess_result as a string
        for (const result of guess_result.split(",\n")) {
            let regex = /(\d+)u/; // match one or more digits followed by u
            let match = result.trim().match(regex); // apply the regex to the string and get the match result
            let number = match[1]; // get the first capture group which is the number
            console.log(number); // print the number as a string
            guess_results.push(parseInt(number));
        }
    }
    res.json({ guess_results: guess_results });
}));
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
