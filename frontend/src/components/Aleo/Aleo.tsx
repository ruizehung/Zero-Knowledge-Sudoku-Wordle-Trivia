import { Button, Card, CardContent, Grid, Paper, TextField, Typography } from "@mui/material";
import React from "react";
import { ExpressBackendPort } from "../../constant";

export default function Aleo() {
    const [transactionID, setTransactionID] = React.useState("");
    const [viewKey, setViewKey] = React.useState("");
    const [ciphertext, setCiphertext] = React.useState("");
    const [output, setOutput] = React.useState("");

    const getTranslation = async () => {
        const response = await fetch(`http://127.0.0.1:${ExpressBackendPort}/aleo/transaction/${transactionID}`, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        });
        const responseData = await response.json();
        setOutput(JSON.stringify(responseData, null, 2));
    }

    const decrypt = async () => {
        const response = await fetch(`http://127.0.0.1:${ExpressBackendPort}/aleo/decrypt`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "view_key": viewKey, "ciphertext": ciphertext }),
        });
        const responseData = await response.json();
        setOutput(responseData["output"]);
    }

    return <Paper
        sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            marginX: 8,
            overflow: 'auto'
        }}
    >
        <Grid container spacing={5} sx={{ pl: 2 }}>
            <Grid item xs={12}>
                <Typography variant="h5">Get Transaction</Typography>
                <TextField value={transactionID} label="Transaction ID" variant="outlined" sx={{ marginTop: 2, width: "50vw" }} onChange={(newValue) => setTransactionID(newValue.target.value)}></TextField>
                <Button variant="contained" sx={{ marginTop: 3, marginLeft: 5 }} onClick={getTranslation}>Submit</Button>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h5">Decrypt Record</Typography>
                <TextField value={viewKey} label="View Key" variant="outlined" sx={{ marginTop: 2, width: "50vw" }} onChange={(newValue) => setViewKey(newValue.target.value)}></TextField>
                <TextField value={ciphertext} label="Ciphertext" variant="outlined" sx={{ marginTop: 2, width: "50vw" }} onChange={(newValue) => setCiphertext(newValue.target.value)}></TextField>
                <Button variant="contained" sx={{ marginTop: 3, marginLeft: 5 }} onClick={decrypt}>Decrypt</Button>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h5">Output</Typography>
                <Card sx={{ marginTop: 2, overflow: "auto"}}>
                    <CardContent>
                        <Typography variant="body1" color="text.secondary">
                            <div><pre>{output}</pre></div>
                        </Typography>
                    </CardContent>
                </Card>

            </Grid>
        </Grid>
    </Paper>
}