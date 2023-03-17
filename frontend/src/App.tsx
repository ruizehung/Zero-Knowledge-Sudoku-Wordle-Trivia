import { useEffect, useState } from 'react';
import './App.css';
import { AppBar, Box, Button, Container, CssBaseline, Grid, Paper, ThemeProvider, Toolbar, Typography, createTheme } from '@mui/material';

function App() {
  const mdTheme = createTheme();
  const [sudokuArray, setSudokuArray] = useState<string[][]>([]);
  
  useEffect(() => {
    const newSudokuArray: string[][] = [];
    for (let i = 0; i < 9; i++) {
      newSudokuArray.push([]);
      for (let j = 0; j < 9; j++) {
        newSudokuArray[i].push(j.toString());
      }
    }
    setSudokuArray(newSudokuArray);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInput = (r: number, c: number, newValue: any) => {
    sudokuArray[r][c] = newValue;
    setSudokuArray(sudokuArray);
    console.log(sudokuArray);
  }

  return (
    <ThemeProvider theme={mdTheme}>
      {
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar position="fixed" color="default">
            <Toolbar
              sx={{
                pr: "24px", // keep right padding when drawer closed
              }}
            >
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
                style={{ fontSize: "1.7rem", textAlign: "center" }}
              >
                ZK Sudoku
              </Typography>
            </Toolbar>
          </AppBar>
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Toolbar />
            <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
              <Paper
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
                      <table id="sudoku">
                        <tbody>
                          <tr>
                            <td><input type="text" defaultValue={sudokuArray[0][0]} onChange={(event) => handleInput(0, 0, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[0][1]} onChange={(event) => handleInput(0, 1, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[0][2]} onChange={(event) => handleInput(0, 2, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[0][3]} onChange={(event) => handleInput(0, 3, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[0][4]} onChange={(event) => handleInput(0, 4, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[0][5]} onChange={(event) => handleInput(0, 5, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[0][6]} onChange={(event) => handleInput(0, 6, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[0][7]} onChange={(event) => handleInput(0, 7, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[0][8]} onChange={(event) => handleInput(0, 8, event.target.value)} /></td>
                          </tr>
                          <tr>
                            <td><input type="text" defaultValue={sudokuArray[1][0]} onChange={(event) => handleInput(1, 0, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[1][1]} onChange={(event) => handleInput(1, 1, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[1][2]} onChange={(event) => handleInput(1, 2, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[1][3]} onChange={(event) => handleInput(1, 3, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[1][4]} onChange={(event) => handleInput(1, 4, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[1][5]} onChange={(event) => handleInput(1, 5, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[1][6]} onChange={(event) => handleInput(1, 6, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[1][7]} onChange={(event) => handleInput(1, 7, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[1][8]} onChange={(event) => handleInput(1, 8, event.target.value)} /></td>
                          </tr>
                          <tr>
                            <td><input type="text" defaultValue={sudokuArray[2][0]} onChange={(event) => handleInput(2, 0, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[2][1]} onChange={(event) => handleInput(2, 1, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[2][2]} onChange={(event) => handleInput(2, 2, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[2][3]} onChange={(event) => handleInput(2, 3, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[2][4]} onChange={(event) => handleInput(2, 4, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[2][5]} onChange={(event) => handleInput(2, 5, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[2][6]} onChange={(event) => handleInput(2, 6, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[2][7]} onChange={(event) => handleInput(2, 7, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[2][8]} onChange={(event) => handleInput(2, 8, event.target.value)} /></td>
                          </tr>
                          <tr>
                            <td><input type="text" defaultValue={sudokuArray[3][0]} onChange={(event) => handleInput(3, 0, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[3][1]} onChange={(event) => handleInput(3, 1, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[3][2]} onChange={(event) => handleInput(3, 2, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[3][3]} onChange={(event) => handleInput(3, 3, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[3][4]} onChange={(event) => handleInput(3, 4, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[3][5]} onChange={(event) => handleInput(3, 5, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[3][6]} onChange={(event) => handleInput(3, 6, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[3][7]} onChange={(event) => handleInput(3, 7, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[3][8]} onChange={(event) => handleInput(3, 8, event.target.value)} /></td>

                          </tr>
                          <tr>
                            <td><input type="text" defaultValue={sudokuArray[4][0]} onChange={(event) => handleInput(4, 0, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[4][1]} onChange={(event) => handleInput(4, 1, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[4][2]} onChange={(event) => handleInput(4, 2, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[4][3]} onChange={(event) => handleInput(4, 3, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[4][4]} onChange={(event) => handleInput(4, 4, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[4][5]} onChange={(event) => handleInput(4, 5, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[4][6]} onChange={(event) => handleInput(4, 6, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[4][7]} onChange={(event) => handleInput(4, 7, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[4][8]} onChange={(event) => handleInput(4, 8, event.target.value)} /></td>

                          </tr>
                          <tr>
                            <td><input type="text" defaultValue={sudokuArray[5][0]} onChange={(event) => handleInput(5, 0, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[5][1]} onChange={(event) => handleInput(5, 1, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[5][2]} onChange={(event) => handleInput(5, 2, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[5][3]} onChange={(event) => handleInput(5, 3, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[5][4]} onChange={(event) => handleInput(5, 4, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[5][5]} onChange={(event) => handleInput(5, 5, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[5][6]} onChange={(event) => handleInput(5, 6, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[5][7]} onChange={(event) => handleInput(5, 7, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[5][8]} onChange={(event) => handleInput(5, 8, event.target.value)} /></td>

                          </tr>
                          <tr>
                            <td><input type="text" defaultValue={sudokuArray[6][0]} onChange={(event) => handleInput(6, 0, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[6][1]} onChange={(event) => handleInput(6, 1, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[6][2]} onChange={(event) => handleInput(6, 2, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[6][3]} onChange={(event) => handleInput(6, 3, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[6][4]} onChange={(event) => handleInput(6, 4, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[6][5]} onChange={(event) => handleInput(6, 5, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[6][6]} onChange={(event) => handleInput(6, 6, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[6][7]} onChange={(event) => handleInput(6, 7, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[6][8]} onChange={(event) => handleInput(6, 8, event.target.value)} /></td>

                          </tr>
                          <tr>
                            <td><input type="text" defaultValue={sudokuArray[7][0]} onChange={(event) => handleInput(7, 0, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[7][1]} onChange={(event) => handleInput(7, 1, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[7][2]} onChange={(event) => handleInput(7, 2, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[7][3]} onChange={(event) => handleInput(7, 3, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[7][4]} onChange={(event) => handleInput(7, 4, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[7][5]} onChange={(event) => handleInput(7, 5, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[7][6]} onChange={(event) => handleInput(7, 6, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[7][7]} onChange={(event) => handleInput(7, 7, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[7][8]} onChange={(event) => handleInput(7, 8, event.target.value)} /></td>

                          </tr>
                          <tr>
                            <td><input type="text" defaultValue={sudokuArray[8][0]} onChange={(event) => handleInput(8, 0, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[8][1]} onChange={(event) => handleInput(8, 1, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[8][2]} onChange={(event) => handleInput(8, 2, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[8][3]} onChange={(event) => handleInput(8, 3, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[8][4]} onChange={(event) => handleInput(8, 4, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[8][5]} onChange={(event) => handleInput(8, 5, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[8][6]} onChange={(event) => handleInput(8, 6, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[8][7]} onChange={(event) => handleInput(8, 7, event.target.value)} /></td>
                            <td><input type="text" defaultValue={sudokuArray[8][8]} onChange={(event) => handleInput(8, 8, event.target.value)} /></td>

                          </tr>
                        </tbody>
                      </table>
                    </Grid>
                    <Grid item xs={5} style={{ marginTop: 10 }}>
                      <Button> New Game </Button>
                      <Button> Validate Solution</Button>
                      <Button> Submit to Leo </Button>
                      <Button> Submit to Noir </Button>
                    </Grid>
                  </Grid>
                </Box>

              </Paper>
            </Container>
          </Box>
        </Box>
      }
    </ThemeProvider>
  );
}

export default App;
