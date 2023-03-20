import express, { Router, Request, Response } from "express";
import fetch from 'cross-fetch';
import util from "util";
const exec = util.promisify(require('child_process').exec);

const router: Router = express.Router();
const serverAleoPrivateKey = process.env.ALEO_PRIVATE_KEY;
const serverAleoViewKey = process.env.ALEO_VIEW_KEY;

router.get('/transaction/:transaction_id', async (req: Request, res: Response) => {
    console.log(`${req.originalUrl} called`);
    const execution_id_get_response = await fetch(`http://0.0.0.0:3030/testnet3/transaction/${req.params.transaction_id}`);
    res.json(await execution_id_get_response.json());
});

router.post('/decrypt', async (req: Request, res: Response) => {
    console.log(`${req.originalUrl} called with ${JSON.stringify(req.body)}`);
    if (req.body.view_key === "" || req.body.view_key == null) {
        res.json({ error: "View key is required" });
        return
    }
    if (req.body.ciphertext === "" || req.body.ciphertext == null) {
        res.json({ error: "Ciphertext is required" });
        return
    }
    const cmd = `snarkos developer decrypt -v ${req.body.view_key} -c ${req.body.ciphertext}`;
    console.log(cmd);
    const { stdout, stderr } = await exec(cmd);
    res.json({ "output": stdout });
});

export default router;