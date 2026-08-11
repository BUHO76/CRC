import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { Route, Routes } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { ReservePage } from './pages/ReservePage';
import { ReservationsPage } from './pages/ReservationsPage';
import { AdminRoomsPage } from './pages/admin/AdminRoomsPage';

function App() {
  const { t, i18n } = useTranslation();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t('app.title')}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              color="inherit"
              variant={i18n.language === 'en' ? 'outlined' : 'text'}
              onClick={() => i18n.changeLanguage('en')}
            >
              EN
            </Button>
            <Button
              color="inherit"
              variant={i18n.language === 'es' ? 'outlined' : 'text'}
              onClick={() => i18n.changeLanguage('es')}
            >
              ES
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/rooms" element={<AdminRoomsPage />} />
        <Route path="/reserve" element={<ReservePage />} />
        <Route path="/reservations" element={<ReservationsPage />} />
      </Routes>
    </Box>
  );
}

export default App;
