import { useCallback, useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { type Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';
import type { Reservation } from '@shared/schemas/reservation.schema';
import type { Room } from '@shared/schemas/room.schema';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useErrorModal } from '../components/ErrorModalProvider';
import { deleteReservationRequest, fetchReservations } from '../features/reservations/api';
import { fetchRooms } from '../features/rooms/api';
import { getApiErrorMessage } from '../lib/errorMessage';

const DATE_FORMAT = 'YYYY-MM-DD';

export function ReservationsPage() {
  const { t } = useTranslation();
  const { showError } = useErrorModal();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [roomFilter, setRoomFilter] = useState('');
  const [dateFilter, setDateFilter] = useState<Dayjs | null>(null);
  const [pendingCancel, setPendingCancel] = useState<Reservation | null>(null);

  useEffect(() => {
    fetchRooms()
      .then(setRooms)
      .catch((err) => showError(getApiErrorMessage(err, t)));
  }, [t, showError]);

  const loadReservations = useCallback(async () => {
    try {
      setReservations(
        await fetchReservations({
          roomNumber: roomFilter || undefined,
          date: dateFilter ? dateFilter.format(DATE_FORMAT) : undefined,
        }),
      );
    } catch (err) {
      showError(getApiErrorMessage(err, t));
    }
  }, [roomFilter, dateFilter, t, showError]);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  const handleCancelConfirm = async () => {
    if (!pendingCancel) {
      return;
    }
    try {
      await deleteReservationRequest(pendingCancel._id);
      setPendingCancel(null);
      await loadReservations();
    } catch (err) {
      showError(getApiErrorMessage(err, t));
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        {t('nav.reservations')}
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 3, mt: 2 }}>
        <TextField
          select
          label={t('rooms.title')}
          value={roomFilter}
          onChange={(e) => setRoomFilter(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">{t('reservations.allRooms')}</MenuItem>
          {rooms.map((room) => (
            <MenuItem key={room._id} value={room.number}>
              {room.number}
            </MenuItem>
          ))}
        </TextField>
        <DatePicker
          label={t('reservations.date')}
          value={dateFilter}
          onChange={setDateFilter}
          slotProps={{ field: { clearable: true } }}
        />
      </Stack>

      {reservations.length === 0 && (
        <Typography color="text.secondary">{t('reservations.empty')}</Typography>
      )}

      {reservations.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('rooms.number')}</TableCell>
                <TableCell>{t('reservations.reservedBy')}</TableCell>
                <TableCell>{t('reservations.date')}</TableCell>
                <TableCell>{t('reservations.time')}</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation._id}>
                  <TableCell>{reservation.roomNumber}</TableCell>
                  <TableCell>{reservation.reservedBy}</TableCell>
                  <TableCell>{reservation.date}</TableCell>
                  <TableCell>
                    {reservation.startTime}–{reservation.endTime}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label={t('reservations.cancel')}
                      onClick={() => setPendingCancel(reservation)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ConfirmDialog
        open={pendingCancel !== null}
        title={t('reservations.cancelConfirmTitle')}
        body={t('reservations.cancelConfirmBody')}
        confirmLabel={t('reservations.cancel')}
        cancelLabel={t('rooms.cancel')}
        onConfirm={handleCancelConfirm}
        onCancel={() => setPendingCancel(null)}
      />
    </Container>
  );
}
