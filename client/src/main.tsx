import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './i18n'
import { ColorModeProvider } from './theme/ColorModeProvider'
import { ErrorModalProvider } from './components/ErrorModalProvider'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ColorModeProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ErrorModalProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ErrorModalProvider>
      </LocalizationProvider>
    </ColorModeProvider>
  </StrictMode>,
)
