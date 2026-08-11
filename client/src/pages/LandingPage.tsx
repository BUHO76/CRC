import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/PageContainer';

export function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <PageContainer center maxWidth="sm">
      <Stack spacing={3} alignItems="center" textAlign="center">
        <Typography variant="h4">{t('landing.title')}</Typography>
        <Typography variant="body1" color="text.secondary">
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
      </Stack>
    </PageContainer>
  );
}
