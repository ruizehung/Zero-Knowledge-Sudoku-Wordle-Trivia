import { Backdrop, Button, CircularProgress, FormControl, FormControlLabel, FormHelperText, Grid, Paper, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { ExpressBackendPort } from "../../constant";
import React from "react";

export default function Trivia() {
    const [isLoading, setIsLoading] = useState(false);
    const [aleoAddress, setAleoAddress] = useState("aleo1alheqp6zm4lfsf640cas2ey4lf6lrp0pqrag754dggaqhfgma5pqvt44zh");
    const [aleoViewKey, setAleoViewKey] = useState("AViewKey1rweDipjg33qhzwjM2YdLPZ11rkS4j3KBbq2giDt7ENhu");
    const [gameStarted, setGameStarted] = useState(false);

    const [gameEnded, setGameEnded] = useState(false);

    const [score, setScore] = useState(0);
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState<string[]>([]);
    const [value, setValue] = useState('');
    const [error, setError] = useState(false);
    const [helperText, setHelperText] = useState('Choose wisely');
    const [disableCheckAns, setDisableCheckAns] = useState(false);

    const startGameWithAleo = async () => {
        setIsLoading(true);
        const respose = await fetch(`http://127.0.0.1:${ExpressBackendPort}/aleo/trivia/new`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                player_address: aleoAddress,
            })
        });
        const data = await respose.json();
        setQuestion(data["prompt"]);
        setOptions(data["options"]);
        setGameStarted(true);
        setIsLoading(false);
    }

    const startGameWithNoir = async () => {

    }

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
        setHelperText(' ');
        setError(false);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (value === "") {
            setHelperText('Please select an option');
            setError(true);
            return;
        }
        setDisableCheckAns(true);
        setIsLoading(true);
        const respose = await fetch(`http://127.0.0.1:${ExpressBackendPort}/aleo/trivia/answer_question`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                player_address: aleoAddress,
                player_guess: value,
            })
        });
        const data = await respose.json();
        setScore(data["score"]);

        if (value === data["answer_to_last_question"]) {
            setHelperText('You got it!');
            setError(false);
        } else {
            setHelperText('Sorry, wrong answer! Correct answer is ' + data["answer_to_last_question"]);
            setError(true);
        }
        setIsLoading(false);
        await new Promise(resolve => setTimeout(resolve, 3000));
        if (data["prompt"] == null) {
            setGameEnded(true);
            return
        }
        setQuestion(data["prompt"]);
        setOptions(data["options"]);
        setError(false);
        setHelperText("");
        setValue("");
        setDisableCheckAns(false);
    };


    return <Paper
        sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            marginX: 8,
        }}
    >
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h1" color={"lightpink"} fontFamily={"fantasy"} sx={{ textAlign: "center" }}>Zrivia!</Typography>
            </Grid>
            {
                !gameStarted ? <Grid container spacing={2} marginTop={1}>
                    <Grid item xs={12} sx={{ textAlign: "center" }}>
                        <Typography variant='h4'>Aleo</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={3} sx={{ textAlign: "center" }}>
                            <Grid item xs={12}>
                                <TextField label="Aleo Address" variant="standard" value={aleoAddress} onChange={(newValue) => setAleoAddress(newValue.target.value)} sx={{ width: 500 }}></TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField label="Aleo View Key" variant="standard" value={aleoViewKey} onChange={(newValue) => setAleoViewKey(newValue.target.value)} sx={{ width: 500 }}></TextField>
                            </Grid>
                            <Grid item xs={12} >
                                <Button variant='contained' onClick={startGameWithAleo}>Start Game</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                    </Grid>
                    <Grid item xs={12} sx={{ textAlign: "center" }}>
                        <Typography variant='h4'>Noir</Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ textAlign: "center" }}>
                        <Button variant='contained' onClick={startGameWithNoir}>Start Game</Button>
                    </Grid>
                </Grid> : <Grid item xs={12} textAlign={"center"}>
                    <Grid item xs={12} sx={{ textAlign: "center" }}>
                        <Typography variant='h6'>{!gameEnded ? "Current": "Final"} Score: {score}</Typography>
                    </Grid>
                    {
                        !gameEnded ? <form onSubmit={handleSubmit}>
                            <FormControl sx={{ m: 3 }} error={error} variant="standard">
                                <Typography variant="h5" sx={{ textAlign: "center" }}>{question}</Typography>
                                <RadioGroup
                                    name="quiz"
                                    value={value}
                                    onChange={handleRadioChange}
                                >
                                    <FormControlLabel value={options[0]} control={<Radio />} label={options[0]} />
                                    <FormControlLabel value={options[1]} control={<Radio />} label={options[1]} />
                                    <FormControlLabel value={options[2]} control={<Radio />} label={options[2]} />
                                    <FormControlLabel value={options[3]} control={<Radio />} label={options[3]} />
                                </RadioGroup>
                                <FormHelperText>{helperText}</FormHelperText>
                                <Button disabled={disableCheckAns} sx={{ mt: 1, mr: 1 }} type="submit" variant="outlined">
                                    Check Answer 😉
                                </Button>
                            </FormControl>
                        </form> : <Grid item xs={12} sx={{ textAlign: "center" }}>
                            <Typography variant='h6'>Done!</Typography>
                        </Grid>
                    }
                </Grid>
            }
        </Grid>
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading}
        >
            <CircularProgress color="inherit" />
        </Backdrop>

    </Paper>
}