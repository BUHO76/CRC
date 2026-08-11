import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DesktopDatePicker as DatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DesktopTimePicker as TimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import dayjs, { type Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { OPERATING_HOURS } from '@shared/schemas/reservation.schema';
import type { Room } from '@shared/schemas/room.schema';
import { hasOverlap } from '@shared/utils/overlap';
import { PageContainer } from '../components/PageContainer';
import { useErrorModal } from '../components/ErrorModalProvider';
import { createReservationRequest, fetchReservations } from '../features/reservations/api';
import { validateReservationInput } from '../features/reservations/validation';
import { fetchRooms } from '../features/rooms/api';
import { getApiErrorMessage } from '../lib/errorMessage';

const TIME_FORMAT = 'HH:mm';
const DATE_FORMAT = 'YYYY-MM-DD';

interface FieldErrors {
  roomNumber?: string;
  reservedBy?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
}

export function ReservePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showError } = useErrorModal();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomNumber, setRoomNumber] = useState('');
  const [reservedBy, setReservedBy] = useState('');
  const [date, setDate] = useState<Dayjs | null>(null);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchRooms()
      .then(setRooms)
      .catch((err) => showError(getApiErrorMessage(err, t)));
  }, [t, showError]);

  const minTime = useMemo(() => dayjs(OPERATING_HOURS.start, TIME_FORMAT), []);
  const maxTime = useMemo(() => dayjs(OPERATING_HOURS.end, TIME_FORMAT), []);

  const handleSubmit = async () => {
    const raw = {
      roomNumber,
      reservedBy,
      date: date ? date.format(DATE_FORMAT) : '',
      startTime: startTime ? startTime.format(TIME_FORMAT) : '',
      endTime: endTime ? endTime.format(TIME_FORMAT) : '',
    };

    const result = validateReservationInput(raw, t);
    if (!result.success) {
      setErrors(result.fieldErrors);
      return;
    }
    setErrors({});

    setIsSubmitting(true);
    try {
      const existing = await fetchReservations({
        roomNumber: result.data.roomNumber,
        date: result.data.date,
      });
      if (hasOverlap(existing, result.data)) {
        showError(t('errors.reservationOverlap'));
        return;
      }

      await createReservationRequest(result.data);
      navigate('/reservations');
    } catch (err) {
      showError(getApiErrorMessage(err, t));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer center maxWidth="sm">
      <Paper elevation={2} sx={{ p: { xs: 3, sm: 5 }, width: '100%' }}>
        <Typography variant="h4" align="center" gutterBottom>
          {t('nav.reserve')}
        </Typography>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            select
            label={t('rooms.title')}
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            error={Boolean(errors.roomNumber)}
            helperText={errors.roomNumber}
          >
            {rooms.map((room) => (
              <MenuItem key={room._id} value={room.number}>
                {room.number} ({t('rooms.capacity')}: {room.capacity})
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label={t('reservations.reservedBy')}
            value={reservedBy}
            onChange={(e) => setReservedBy(e.target.value)}
            error={Boolean(errors.reservedBy)}
            helperText={errors.reservedBy}
          />

          <DatePicker
            label={t('reservations.date')}
            value={date}
            onChange={setDate}
            minDate={dayjs()}
            slotProps={{ textField: { error: Boolean(errors.date), helperText: errors.date } }}
          />

          <Stack direction="row" spacing={2}>
            <TimePicker
              label={t('reservations.startTime')}
              value={startTime}
              onChange={setStartTime}
              minTime={minTime}
              maxTime={maxTime}
              slotProps={{ textField: { error: Boolean(errors.startTime), helperText: errors.startTime } }}
            />
            <TimePicker
              label={t('reservations.endTime')}
              value={endTime}
              onChange={setEndTime}
              minTime={minTime}
              maxTime={maxTime}
              slotProps={{ textField: { error: Boolean(errors.endTime), helperText: errors.endTime } }}
            />
          </Stack>

          <Box textAlign="center">
            <Button variant="contained" size="large" onClick={handleSubmit} disabled={isSubmitting}>
              {t('reservations.submit')}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </PageContainer>
  );
}
