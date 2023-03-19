import './WordleApp.css';
import { Box, Button, CircularProgress, Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import Wordle from './Wordle';
import { AleoAccountProvider } from './context/AleoAccountProvider';

export function WordleApp() {
    const [aleoAddress, setAleoAddress] = useState("aleo1alheqp6zm4lfsf640cas2ey4lf6lrp0pqrag754dggaqhfgma5pqvt44zh");
    const [aleoViewKey, setAleoViewKey] = useState("AViewKey1rweDipjg33qhzwjM2YdLPZ11rkS4j3KBbq2giDt7ENhu");

    const [gameStarted, setGameStarted] = useState(false);
    const [hasInputAleoAccount, setHasInputAleoAccount] = useState(false);

    const startGame = async () => {
        setHasInputAleoAccount(true);
        setGameStarted(false);
        await fetch("http://127.0.0.1:3456/aleo/wordle/new", {
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

    return <Paper
        sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            marginX: 8,
        }}
    >
        <AleoAccountProvider.Provider value={{ address: aleoAddress, view_key: aleoViewKey }}>
            <Grid container >
                <Grid item xs={12} sx={{ textAlign: "center", marginBottom: 3 }}>
                    <Typography variant='h4'>ZK Wordle</Typography>
                </Grid>

                <Grid item xs={5}>
                    {
                        hasInputAleoAccount && <Box className="App">
                            {!gameStarted ? <Stack alignItems="center">
                                <CircularProgress />
                            </Stack> : <Wordle />}
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
                                <Grid item xs={4}>
                                    <TextField label="Aleo Address" variant="standard" value={aleoAddress} onChange={(newValue) => setAleoAddress(newValue.target.value)} sx={{ width: 300 }}></TextField>
                                </Grid>
                                <Grid item xs={1}>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField label="Aleo View Key" variant="standard" value={aleoViewKey} onChange={(newValue) => setAleoViewKey(newValue.target.value)} sx={{ width: 300 }}></TextField>
                                </Grid>
                                <Grid item xs={4} >
                                    <Button disabled={hasInputAleoAccount} variant='contained' onClick={startGame}>Start Game</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='h5'>Noir</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </AleoAccountProvider.Provider>
    </Paper>
}