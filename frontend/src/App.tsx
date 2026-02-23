import { BrowserRouter, Routes, Route, Link as RouterLink } from 'react-router-dom';
import Dictionaries from './pages/Dictionaries';
import ItemsList from './pages/ItemsList';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';

function App() {
  return (
    <BrowserRouter>

      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Склад Техники
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" component={RouterLink} to="/">
              Позиции
            </Button>
            <Button color="inherit" component={RouterLink} to="/dictionaries">
              Справочники
            </Button>
          </Box>
        </Toolbar>
      </AppBar>


      <Container maxWidth="xl">
        <Routes>
          <Route path="/" element={<ItemsList />} />
          <Route path="/dictionaries" element={<Dictionaries />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
