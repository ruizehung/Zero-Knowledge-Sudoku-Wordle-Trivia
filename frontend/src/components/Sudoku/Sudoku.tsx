import './Sudoku.css';
import { Paper, Box, Grid, Stack, CircularProgress, Button, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Snackbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { fetchWithTimeout } from '../../utils/utils';

export default function SudoKu() {
    const [sudokuArray, setSudokuArray] = useState<string[][]>([]); // The sudoku array user is working on
    const [solutionArray, setSolutionArray] = useState<string[][]>([]); // The solution array
    const [isLoading, setIsLoading] = useState(true);

    const [openSudokuSnackBar, setOpenSudokuSnackBar] = useState<boolean>(false);
    const [sudokuSnackBarMsg, setSudokuSnackBarMsg] = useState<string>("");

    // Aleo
    const [aleoPrivateKey, setAleoPrivateKey] = useState<string>("");
    const [openAleoDialog, setOpenAleoDialog] = useState<boolean>(false);
    const [isWaitingForAleoResponse, setIsWaitingForAleoResponse] = useState(false);
    const [aleoResponse, setAleoResponse] = useState("");

    useEffect(() => {
        async function init() {
            await getNewSudoku();
            setIsLoading(false);
        }
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function getNewSudoku() {
        const response = await fetch("http://127.0.0.1:8000/sudoku");
        const { puzzle, solution } = await response.json();
        const newSudokuArray: string[][] = [];
        const newSolutionArray: string[][] = [];
        for (let i = 0; i < 9; i++) {
            newSudokuArray.push([]);
            newSolutionArray.push([]);
            for (let j = 0; j < 9; j++) {
                if (puzzle[i][j] === 0) {
                    newSudokuArray[i].push("");
                } else {
                    newSudokuArray[i].push(puzzle[i][j].toString());
                }
                newSolutionArray[i].push(solution[i][j].toString());
            }
        }
        setSudokuArray(newSudokuArray);
        setSolutionArray(newSolutionArray);
    }

    const handleInput = (r: number, c: number, newValue: any) => {
        sudokuArray[r][c] = newValue;
        setSudokuArray(sudokuArray);
    }

    const validateSolution = () => {
        let isValid = true;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (sudokuArray[i][j] !== solutionArray[i][j]) {
                    isValid = false;
                }
            }
        }
        if (isValid) {
            setSudokuSnackBarMsg("Correct!");
        } else {
            setSudokuSnackBarMsg("Incorrect!");
        }
        setOpenSudokuSnackBar(true);
    }

    const fillInSolution = () => {
        setSudokuArray(solutionArray);
    }

    const submitToAleo = async () => {
        const puzzle: number[][] = [];
        const solution: number[][] = [];
        for (let i = 0; i < 9; i++) {
            puzzle.push([]);
            solution.push([])
            for (let j = 0; j < 9; j++) {
                solution[i].push(parseInt(solutionArray[i][j]));
                if (sudokuArray[i][j] !== "") {
                    puzzle[i].push(parseInt(sudokuArray[i][j]));
                } else {
                    puzzle[i].push(0);
                }
            }
        }

        setOpenAleoDialog(true);
        setIsWaitingForAleoResponse(true);
        try {
            const response = await fetchWithTimeout("http://127.0.0.1:8000/leo/sudoku", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ "puzzle": puzzle, "solution": solution, "private_key": aleoPrivateKey }),
                timeout: 240000 // 4 minute
            });
            const responseData = await response.json();
            setAleoResponse(responseData["output"]);
        } catch (error: any) {
            if (error.name === 'AbortError') {
                setAleoResponse("Request timed out!");
            }
        }
        setIsWaitingForAleoResponse(false);
    }

    const handleCloseAleoDialog = () => {
        setOpenAleoDialog(false);
    }

    return <Paper
        sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            marginX: 8,
        }}
    >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Grid container>
                <Grid item xs={7} >
                    {
                        isLoading ? <Stack alignItems="center">
                            <CircularProgress />
                        </Stack> : <table id="sudoku">
                            <tbody>
                                {
                                    [0, 1, 2, 3, 4, 5, 6, 7, 8].map((r) => 
                                        <tr>
                                            <td><input type="text" defaultValue={sudokuArray[r][0]} onChange={(event) => handleInput(r, 0, event.target.value)} /></td>
                                            <td><input type="text" defaultValue={sudokuArray[r][1]} onChange={(event) => handleInput(r, 1, event.target.value)} /></td>
                                            <td><input type="text" defaultValue={sudokuArray[r][2]} onChange={(event) => handleInput(r, 2, event.target.value)} /></td>
                                            <td><input type="text" defaultValue={sudokuArray[r][3]} onChange={(event) => handleInput(r, 3, event.target.value)} /></td>
                                            <td><input type="text" defaultValue={sudokuArray[r][4]} onChange={(event) => handleInput(r, 4, event.target.value)} /></td>
                                            <td><input type="text" defaultValue={sudokuArray[r][5]} onChange={(event) => handleInput(r, 5, event.target.value)} /></td>
                                            <td><input type="text" defaultValue={sudokuArray[r][6]} onChange={(event) => handleInput(r, 6, event.target.value)} /></td>
                                            <td><input type="text" defaultValue={sudokuArray[r][7]} onChange={(event) => handleInput(r, 7, event.target.value)} /></td>
                                            <td><input type="text" defaultValue={sudokuArray[r][8]} onChange={(event) => handleInput(r, 8, event.target.value)} /></td>
                                        </tr>
                                    )   
                                }
                            </tbody>
                        </table>
                    }

                </Grid>
                <Grid item xs={5} style={{ marginTop: 10 }}>
                    <Grid container spacing={5}>
                        <Grid item xs={12} >
                            {/* TODO: Implement new game button without refreshing the page */}
                            <Button onClick={() => window.location.reload()}> New Game </Button>
                            <Button onClick={validateSolution}> Validate Solution</Button>
                            <Button onClick={fillInSolution}> Fill In Solution</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Aleo Private Key" variant="standard" value={aleoPrivateKey} onChange={(newValue) => setAleoPrivateKey(newValue.target.value)}></TextField>
                            <Button onClick={submitToAleo}> Verify with Aleo </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button> Submit to Noir </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>

        <Dialog
            open={openAleoDialog}
            onClose={handleCloseAleoDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Your request has been received!"}
            </DialogTitle>
            <DialogContent>
                {
                    isWaitingForAleoResponse ? <React.Fragment>
                        <DialogContentText id="alert-dialog-description">
                            Please wait for up to 3 minutes before the verification completes.
                        </DialogContentText>
                        <Stack alignItems="center">
                            <CircularProgress />
                        </Stack>
                    </React.Fragment> :
                        <DialogContentText id="alert-dialog-description">
                            {aleoResponse}
                        </DialogContentText>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseAleoDialog} autoFocus>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
        <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={openSudokuSnackBar}
            onClose={() => setOpenSudokuSnackBar(false)}
            message={sudokuSnackBarMsg}
        />
    </Paper>
}