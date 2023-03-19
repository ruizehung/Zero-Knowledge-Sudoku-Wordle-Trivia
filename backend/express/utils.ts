import fetch from 'cross-fetch';
import util from "util";
const exec = util.promisify(require('child_process').exec);

export async function getGameStateServerView(execution_id: string, serverAleoViewKey: string) {
    // Get game state server view
    let attempts = 0;
    while (attempts < 5) {
        try {
            // Wait 5 seconds to fetech transaction. Without waiting it could fail.
            await new Promise(resolve => setTimeout(resolve, 5000));
            const execution_id_get_response = await fetch(`http://0.0.0.0:3030/testnet3/transaction/${execution_id}`);
            const execution_id_get_response_json: any = await execution_id_get_response.json();
            const record_ciphertext = execution_id_get_response_json["execution"]["transitions"][0]["outputs"][0]["value"];
            const { stdout: stdout_decrypt, stderr: stderr_decrypt } = await exec(`snarkos developer decrypt  -v ${serverAleoViewKey} -c ${record_ciphertext}`);
            console.log('stdout_decrypt:\n', stdout_decrypt);
            return stdout_decrypt;
        } catch (error) {
            console.error(error);
            attempts += 1;
        }
    }
    throw new Error('Failed to get game state server view');
}