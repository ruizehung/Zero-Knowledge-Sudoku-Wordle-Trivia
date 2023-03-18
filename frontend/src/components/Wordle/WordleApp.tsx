import './WordleApp.css';
import { Paper } from "@mui/material";
import { useEffect, useState } from "react";
import Wordle from './Wordle';

export function WordleApp() {
    const [solution, setSolution] = useState(null)

    useEffect(() => {
        const getNewWord = async () => {
            const response = await fetch("http://127.0.0.1:3456/wordle/new");
            const data = await response.json();
            setSolution(data["word"]);
        }
        getNewWord();
    }, [setSolution])

    return <Paper
        sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            marginX: 8,
        }}
    >
        <div className="App">
            <h1>ZK Wordle</h1>
            {solution && <Wordle solution={solution} />}
        </div>
    </Paper>
}