import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { useColorMode } from '../theme/ColorModeProvider';

const NAV_LINKS = [
  { path: '/reserve', labelKey: 'nav.reserve' },
  { path: '/reservations', labelKey: 'nav.reservations' },
  { path: '/admin/rooms', labelKey: 'nav.admin' },
] as const;

export function Navbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { mode, toggleColorMode } = useColorMode();

  return (
    <AppBar position="static" color="primary" enableColorOnDark>
      <Toolbar sx={{ gap: { xs: 1, sm: 2 }, flexWrap: 'wrap', py: 1 }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}
        >
          {t('app.title')}
        </Typography>

        <Stack direction="row" spacing={1}>
          {NAV_LINKS.map((link) => (
            <Button
              key={link.path}
              component={Link}
              to={link.path}
              color="inherit"
              variant={location.pathname === link.path ? 'outlined' : 'text'}
            >
              {t(link.labelKey)}
            </Button>
          ))}
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
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
          <IconButton color="inherit" onClick={toggleColorMode} aria-label={t('common.toggleTheme')}>
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
