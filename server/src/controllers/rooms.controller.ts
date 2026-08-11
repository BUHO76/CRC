import type { NextFunction, Request, Response } from 'express';
import { roomInputSchema } from '@shared/schemas/room.schema';
import { Room } from '../models/Room';
import { ApiError } from '../utils/ApiError';

export async function listRooms(_req: Request, res: Response, next: NextFunction) {
  try {
    const rooms = await Room.find().sort({ number: 1 });
    res.json(rooms);
  } catch (err) {
    next(err);
  }
}

export async function createRoom(req: Request, res: Response, next: NextFunction) {
  try {
    const input = roomInputSchema.parse(req.body);
    const room = await Room.create(input);
    res.status(201).json(room);
  } catch (err) {
    next(err);
  }
}

export async function updateRoom(req: Request, res: Response, next: NextFunction) {
  try {
    const input = roomInputSchema.parse(req.body);
    const room = await Room.findByIdAndUpdate(req.params.id, input, {
      new: true,
      runValidators: true,
    });
    if (!room) {
      throw new ApiError(404, 'Room not found');
    }
    res.json(room);
  } catch (err) {
    next(err);
  }
}

export async function deleteRoom(req: Request, res: Response, next: NextFunction) {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      throw new ApiError(404, 'Room not found');
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
