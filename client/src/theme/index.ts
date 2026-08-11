import { createTheme, type Theme } from '@mui/material/styles';

export type ColorMode = 'light' | 'dark';

export function getTheme(mode: ColorMode): Theme {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? '#6fb6bb' : '#2f5d62',
      },
      secondary: {
        main: mode === 'dark' ? '#f2b84c' : '#d98e04',
      },
    },
    shape: {
      borderRadius: 8,
    },
  });
}
