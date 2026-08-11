import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

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

      <Container maxWidth="sm" sx={{ pt: 8 }}>
        <Typography variant="h4" gutterBottom>
          {t('landing.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('landing.subtitle')}
        </Typography>
      </Container>
    </Box>
  );
}

export default App;
