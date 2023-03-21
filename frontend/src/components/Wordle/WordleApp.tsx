import './WordleApp.css';
import { Box, Button, FormControlLabel, Grid, Paper, Switch, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Wordle from './Wordle';
import { ZKProvider } from './context/ZKProvider';
import { ethers } from 'ethers';
import { ExpressBackendPort, ZK_FRAMEWORK } from '../../constant';
import { SolutionHashProvider } from './context/SolutionHashProvider';

export function WordleApp() {
    const [aleoAddress, setAleoAddress] = useState("aleo1alheqp6zm4lfsf640cas2ey4lf6lrp0pqrag754dggaqhfgma5pqvt44zh");
    const [aleoViewKey, setAleoViewKey] = useState("AViewKey1rweDipjg33qhzwjM2YdLPZ11rkS4j3KBbq2giDt7ENhu");
    const [gameStarted, setGameStarted] = useState(false);
    const [zkFramework, setZkFramework] = useState<ZK_FRAMEWORK>(ZK_FRAMEWORK.ALEO);
    const [solutionHash, setSolutionHash] = useState("");
    const [serverShouldCheat, setServerShouldCheat] = useState(false);

    useEffect(() => {
        fetch(`http://127.0.0.1:${ExpressBackendPort}/noir/wordle/should_cheat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                shouldCheat: false,
            })
        });
    }, []);

    const startGameWithAleo = async () => {
        setZkFramework(ZK_FRAMEWORK.ALEO);
        setGameStarted(false);
        await fetch(`http://127.0.0.1:${ExpressBackendPort}/aleo/wordle/new`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                player_address: aleoAddress,
            })
        });
        setGameStarted(true);
    }

    const startGameWithNoir = async () => {
        setZkFramework(ZK_FRAMEWORK.NOIR);
        // Connect wallet
        const provider = new ethers.BrowserProvider(window.ethereum!);
        await provider.send("eth_requestAccounts", []);
        const response = await fetch(`http://127.0.0.1:${ExpressBackendPort}/noir/wordle/new`);
        const data = await response.json();
        setSolutionHash(data["solutionHash"]);
        setGameStarted(true);
    }

    const askServerToChangeSolution = () => {
        fetch(`http://127.0.0.1:${ExpressBackendPort}/noir/wordle/change_solution`);
    }

    const handleSetServerShouldCheat = (event: any) => {
        setServerShouldCheat(event.target.checked);
        fetch(`http://127.0.0.1:${ExpressBackendPort}/noir/wordle/should_cheat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                shouldCheat: event.target.checked,
            })
        });
    }

    return <Paper
        sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            marginX: 8,
        }}
    >
        <ZKProvider.Provider value={{ aleoAddress, aleoViewKey, zkFramework }}>
            <SolutionHashProvider.Provider value={{ solutionHash }}>
                <Grid container >
                    <Grid item xs={12} sx={{ textAlign: "center", marginBottom: 3 }}>
                        <Typography variant='h4'>ZK Wordle</Typography>
                    </Grid>

                    <Grid item xs={5}>
                        {
                            gameStarted && <Box className="App">
                                <Wordle />
                            </Box>
                        }
                    </Grid>
                    <Grid item xs={7}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant='h5'>Aleo</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField label="Aleo Address" variant="standard" value={aleoAddress} onChange={(newValue) => setAleoAddress(newValue.target.value)} sx={{ width: 300 }}></TextField>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField label="Aleo View Key" variant="standard" value={aleoViewKey} onChange={(newValue) => setAleoViewKey(newValue.target.value)} sx={{ width: 300 }}></TextField>
                                    </Grid>
                                    <Grid item xs={12} >
                                        <Button disabled={gameStarted} variant='contained' onClick={startGameWithAleo}>Start Game</Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant='h5'>Noir</Typography>
                            </Grid>
                            <Grid item xs={2} >
                                <Button disabled={gameStarted} variant='contained' onClick={startGameWithNoir}>Start Game</Button>
                            </Grid>
                            <Grid item xs={5} >
                                <Button disabled={!gameStarted} variant='contained' onClick={askServerToChangeSolution}>Simulate server changing solution</Button>
                            </Grid>
                            <Grid item xs={5} >
                                <FormControlLabel control={<Switch />} checked={serverShouldCheat} onChange={handleSetServerShouldCheat} label="Server Cheat" />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </SolutionHashProvider.Provider>
        </ZKProvider.Provider>
    </Paper>
}