import { Router } from 'express';
import { createReservation, deleteReservation, listReservations } from '../controllers/reservations.controller';

export const reservationsRouter = Router();

reservationsRouter.get('/', listReservations);
reservationsRouter.post('/', createReservation);
reservationsRouter.delete('/:id', deleteReservation);
