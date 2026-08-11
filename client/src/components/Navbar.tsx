import { useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useColorMode } from '../theme/ColorModeProvider';

const NAV_LINKS = [
  { path: '/reserve', labelKey: 'nav.reserve' },
  { path: '/reservations', labelKey: 'nav.reservations' },
] as const;

export function Navbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, toggleColorMode } = useColorMode();
  const [roleMenuAnchor, setRoleMenuAnchor] = useState<HTMLElement | null>(null);

  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleRoleSelect = (path: string) => {
    setRoleMenuAnchor(null);
    navigate(path);
  };

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

          <Button
            color="inherit"
            variant={isAdminRoute ? 'outlined' : 'text'}
            endIcon={<ArrowDropDownIcon />}
            onClick={(e) => setRoleMenuAnchor(e.currentTarget)}
          >
            {isAdminRoute ? t('nav.admin') : t('nav.user')}
          </Button>
          <Menu
            anchorEl={roleMenuAnchor}
            open={Boolean(roleMenuAnchor)}
            onClose={() => setRoleMenuAnchor(null)}
          >
            <MenuItem selected={isAdminRoute} onClick={() => handleRoleSelect('/admin/rooms')}>
              {t('nav.admin')}
            </MenuItem>
            <MenuItem selected={!isAdminRoute} onClick={() => handleRoleSelect('/reserve')}>
              {t('nav.user')}
            </MenuItem>
          </Menu>
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
