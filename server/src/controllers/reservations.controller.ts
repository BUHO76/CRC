import type { NextFunction, Request, Response } from 'express';
import { reservationInputSchema } from '@shared/schemas/reservation.schema';
import { hasOverlap } from '@shared/utils/overlap';
import { Reservation } from '../models/Reservation';
import { ApiError } from '../utils/ApiError';

export async function listReservations(req: Request, res: Response, next: NextFunction) {
  try {
    const { roomNumber, date } = req.query;
    const filter: Record<string, string> = {};
    if (typeof roomNumber === 'string' && roomNumber.length > 0) {
      filter.roomNumber = roomNumber;
    }
    if (typeof date === 'string' && date.length > 0) {
      filter.date = date;
    }

    const reservations = await Reservation.find(filter).sort({ date: 1, startTime: 1 });
    res.json(reservations);
  } catch (err) {
    next(err);
  }
}

export async function createReservation(req: Request, res: Response, next: NextFunction) {
  try {
    const input = reservationInputSchema.parse(req.body);

    const sameRoomAndDay = await Reservation.find({ roomNumber: input.roomNumber, date: input.date });
    if (hasOverlap(sameRoomAndDay, input)) {
      throw new ApiError(409, 'Reservation overlaps with an existing booking', 'OVERLAP');
    }

    const reservation = await Reservation.create(input);
    res.status(201).json(reservation);
  } catch (err) {
    next(err);
  }
}

export async function deleteReservation(req: Request, res: Response, next: NextFunction) {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) {
      throw new ApiError(404, 'Reservation not found', 'NOT_FOUND');
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
