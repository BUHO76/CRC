import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';

interface ErrorModalContextValue {
  showError: (message: string) => void;
}

const ErrorModalContext = createContext<ErrorModalContextValue | undefined>(undefined);

export function ErrorModalProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [message, setMessage] = useState<string | null>(null);

  const showError = useCallback((nextMessage: string) => {
    setMessage(nextMessage);
  }, []);

  const value = useMemo(() => ({ showError }), [showError]);

  return (
    <ErrorModalContext.Provider value={value}>
      {children}
      <Dialog open={message !== null} onClose={() => setMessage(null)}>
        <DialogTitle>{t('common.errorTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMessage(null)} variant="contained">
            {t('common.ok')}
          </Button>
        </DialogActions>
      </Dialog>
    </ErrorModalContext.Provider>
  );
}

export function useErrorModal(): ErrorModalContextValue {
  const context = useContext(ErrorModalContext);
  if (!context) {
    throw new Error('useErrorModal must be used within an ErrorModalProvider');
  }
  return context;
}
