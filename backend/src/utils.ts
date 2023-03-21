import fetch from 'cross-fetch';
import util from "util";
const exec = util.promisify(require('child_process').exec);

export function hashStringToNumber(str: string): number {
    var hash = 0,
        i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return parseInt(hash.toString().replace('-', ''), 10);
}

export function generateSampleTriviaQuiz() {
    const prompts: string[] = [];
    const options: string[][] = [];
    const answers: string[] = [];
    prompts.push("Which planet in our solar system is the hottest?");
    prompts.push("Which is the smallest continent in the world?");
    prompts.push("Who directed the movie 'Jaws'?");

    options.push(["Venus", "Mars", "Earth", "Jupiter"]);
    options.push(["North America", "Europe", "Asia", "Australia"]);
    options.push(["Steven Spielberg", "Martin Scorsese", "George Lucas", "Francis Ford Coppola"]);

    answers.push("Venus", "Australia", "Steven Spielberg");

    return { prompts, options, answers };
}

export async function getGameStateServerView(execution_id: string, serverAleoViewKey: string) {
    // Get game state server view
    let attempts = 0;
    while (attempts < 5) {
        try {
            // Wait 5 seconds to fetech transaction. Without waiting it could fail.
            await new Promise(resolve => setTimeout(resolve, 5000));
            const execution_id_get_response = await fetch(`http://0.0.0.0:3030/testnet3/transaction/${execution_id}`);
            const execution_id_get_response_json: any = await execution_id_get_response.json();
            const game_state_server_view_record_ciphertext = execution_id_get_response_json["execution"]["transitions"][0]["outputs"][0]["value"];
            const { stdout: game_state_server_view, _ } = await exec(`snarkos developer decrypt  -v ${serverAleoViewKey} -c ${game_state_server_view_record_ciphertext}`);
            return game_state_server_view;
        } catch (error) {
            console.error(error);
            attempts += 1;
        }
    }
    throw new Error('Failed to get game state server view');
}

/**
 * Converts a number to a 32 byte hex string so structure mirrors Noir's for accurate hashing
 * 
 * @param {number} num - number to be hexlified
 * @returns 32 bytes hex string
 */
export const numToHex = (num: number) => {
    const hex = (num).toString(16);
    // Add missing padding based of hex number length
    return `${'0'.repeat(64 - hex.length)}${hex}`;
}