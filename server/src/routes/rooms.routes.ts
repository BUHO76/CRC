import { Router } from 'express';
import { createRoom, deleteRoom, listRooms, updateRoom } from '../controllers/rooms.controller';

export const roomsRouter = Router();

roomsRouter.get('/', listRooms);
roomsRouter.post('/', createRoom);
roomsRouter.put('/:id', updateRoom);
roomsRouter.delete('/:id', deleteRoom);
