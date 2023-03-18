import './App.css';
import { AppBar, Box, Button, Container, CssBaseline, ThemeProvider, Toolbar, Typography, createTheme } from '@mui/material';
import SudoKu from './components/Sudoku/Sudoku';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Aleo from './components/Aleo/Aleo';

function App() {
  const mdTheme = createTheme();
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={mdTheme}>
      {
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar position="fixed" color="default">
            <Toolbar>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
                style={{ fontSize: "1.7rem", marginLeft: 70 }}
              >
                Zero Knowledge Games
              </Typography>
              <Button sx={{ my: 2, color: 'black', display: 'block' }} onClick={() => navigate("/aleo")}>
                Aleo
              </Button>
              <Button sx={{ my: 2, color: 'black', display: 'block' }} onClick={() => navigate("/sudoku")}>
                Sudoku
              </Button>
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
              <Routes>
                <Route path="/sudoku" element={<SudoKu />} />
                <Route path="/aleo" element={<Aleo />} />
                {/* <Route path="/quiz/:quiz_lti_assignment_id/pair/:pair_id" element={<PairReportPage />} /> */}
              </Routes>
              
            </Container>
          </Box>
        </Box>
      }
    </ThemeProvider>
  );
}

export default App;
