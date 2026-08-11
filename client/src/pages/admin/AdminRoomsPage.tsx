import { useCallback, useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import type { Room, RoomInput } from '@shared/schemas/room.schema';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useErrorModal } from '../../components/ErrorModalProvider';
import { PageContainer } from '../../components/PageContainer';
import { createRoomRequest, deleteRoomRequest, fetchRooms, updateRoomRequest } from '../../features/rooms/api';
import { RoomFormDialog } from '../../features/rooms/RoomFormDialog';
import { getApiErrorMessage } from '../../lib/errorMessage';

export function AdminRoomsPage() {
  const { t } = useTranslation();
  const { showError } = useErrorModal();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formRoom, setFormRoom] = useState<Room | null | undefined>(undefined);
  const [roomPendingDelete, setRoomPendingDelete] = useState<Room | null>(null);

  const loadRooms = useCallback(async () => {
    setIsLoading(true);
    try {
      setRooms(await fetchRooms());
    } catch (err) {
      showError(getApiErrorMessage(err, t));
    } finally {
      setIsLoading(false);
    }
  }, [t, showError]);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const handleFormSubmit = async (input: RoomInput) => {
    try {
      if (formRoom) {
        await updateRoomRequest(formRoom._id, input);
      } else {
        await createRoomRequest(input);
      }
      setFormRoom(undefined);
      await loadRooms();
    } catch (err) {
      showError(getApiErrorMessage(err, t));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!roomPendingDelete) {
      return;
    }
    try {
      await deleteRoomRequest(roomPendingDelete._id);
      setRoomPendingDelete(null);
      await loadRooms();
    } catch (err) {
      showError(getApiErrorMessage(err, t));
    }
  };

  return (
    <PageContainer maxWidth="md">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">{t('rooms.title')}</Typography>
        <Button startIcon={<AddIcon />} variant="contained" onClick={() => setFormRoom(null)}>
          {t('rooms.addRoom')}
        </Button>
      </Box>

      {!isLoading && rooms.length === 0 && (
        <Typography color="text.secondary" align="center" sx={{ py: 6 }}>
          {t('rooms.empty')}
        </Typography>
      )}

      {rooms.length > 0 && (
        <TableContainer component={Paper} elevation={2} sx={{ p: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('rooms.number')}</TableCell>
                <TableCell align="right">{t('rooms.capacity')}</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room._id}>
                  <TableCell>{room.number}</TableCell>
                  <TableCell align="right">{room.capacity}</TableCell>
                  <TableCell align="right">
                    <IconButton aria-label={t('rooms.edit')} onClick={() => setFormRoom(room)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton aria-label={t('rooms.delete')} onClick={() => setRoomPendingDelete(room)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <RoomFormDialog
        open={formRoom !== undefined}
        room={formRoom ?? null}
        onClose={() => setFormRoom(undefined)}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={roomPendingDelete !== null}
        title={t('rooms.deleteConfirmTitle', { number: roomPendingDelete?.number })}
        body={t('rooms.deleteConfirmBody')}
        confirmLabel={t('rooms.delete')}
        cancelLabel={t('rooms.cancel')}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setRoomPendingDelete(null)}
      />
    </PageContainer>
  );
}
