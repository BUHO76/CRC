import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

export function ComingSoonPage() {
  const { t } = useTranslation();

  return (
    <Container maxWidth="sm" sx={{ pt: 8 }}>
      <Typography variant="h4" gutterBottom>
        {t('comingSoon.title')}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {t('comingSoon.body')}
      </Typography>
    </Container>
  );
}
