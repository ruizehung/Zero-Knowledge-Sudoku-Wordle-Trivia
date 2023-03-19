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
exports.getGameStateServerView = void 0;
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const util_1 = __importDefault(require("util"));
const exec = util_1.default.promisify(require('child_process').exec);
function getGameStateServerView(execution_id, serverAleoViewKey) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get game state server view
        let attempts = 0;
        while (attempts < 5) {
            try {
                // Wait 5 seconds to fetech transaction. Without waiting it could fail.
                yield new Promise(resolve => setTimeout(resolve, 5000));
                const execution_id_get_response = yield (0, cross_fetch_1.default)(`http://0.0.0.0:3030/testnet3/transaction/${execution_id}`);
                const execution_id_get_response_json = yield execution_id_get_response.json();
                const record_ciphertext = execution_id_get_response_json["execution"]["transitions"][0]["outputs"][0]["value"];
                const { stdout: stdout_decrypt, stderr: stderr_decrypt } = yield exec(`snarkos developer decrypt  -v ${serverAleoViewKey} -c ${record_ciphertext}`);
                console.log('stdout_decrypt:\n', stdout_decrypt);
                return stdout_decrypt;
            }
            catch (error) {
                console.error(error);
                attempts += 1;
            }
        }
        throw new Error('Failed to get game state server view');
    });
}
exports.getGameStateServerView = getGameStateServerView;
