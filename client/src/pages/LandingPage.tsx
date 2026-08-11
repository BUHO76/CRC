import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ pt: 8 }}>
      <Typography variant="h4" gutterBottom>
        {t('landing.title')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {t('landing.subtitle')}
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={() => navigate('/admin/rooms')}>
          {t('landing.admin')}
        </Button>
        <Button variant="outlined" onClick={() => navigate('/reserve')}>
          {t('landing.user')}
        </Button>
      </Stack>
    </Container>
  );
}
