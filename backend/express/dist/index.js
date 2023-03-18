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
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = "3456";
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
app.get('/wordle/new', (req, res) => {
    // const { stdout, stderr } = await exec('ls');
    //  console.log('stdout:', stdout);
    //  console.log('stderr:', stderr);
    res.json({ word: wordList_1.WordList[Math.floor(Math.random() * wordList_1.WordList.length)] });
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
