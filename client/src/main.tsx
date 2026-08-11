import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './i18n'
import { theme } from './theme'
import { ErrorModalProvider } from './components/ErrorModalProvider'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ErrorModalProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ErrorModalProvider>
      </LocalizationProvider>
    </ThemeProvider>
  </StrictMode>,
)
