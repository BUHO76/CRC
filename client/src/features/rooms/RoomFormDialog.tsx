import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';
import type { Room, RoomInput } from '@shared/schemas/room.schema';
import { validateRoomInput } from './validation';

type Props = {
  open: boolean;
  room: Room | null;
  onClose: () => void;
  onSubmit: (input: RoomInput) => Promise<void>;
};

export function RoomFormDialog({ open, room, onClose, onSubmit }: Props) {
  const { t } = useTranslation();
  const [number, setNumber] = useState('');
  const [capacity, setCapacity] = useState('');
  const [errors, setErrors] = useState<{ number?: string; capacity?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }
    setNumber(room?.number ?? '');
    setCapacity(room ? String(room.capacity) : '');
    setErrors({});
  }, [open, room]);

  const handleSubmit = async () => {
    const result = validateRoomInput(number, capacity, t);
    if (!result.success) {
      setErrors(result.fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(result.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{room ? t('rooms.editRoom') : t('rooms.addRoom')}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label={t('rooms.number')}
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            error={Boolean(errors.number)}
            helperText={errors.number}
            autoFocus
          />
          <TextField
            label={t('rooms.capacity')}
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            error={Boolean(errors.capacity)}
            helperText={errors.capacity}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('rooms.cancel')}</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting}>
          {t('rooms.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
