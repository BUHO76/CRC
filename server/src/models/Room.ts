import { Schema, model } from 'mongoose';

export interface RoomDocument {
  number: string;
  capacity: number;
  createdAt: Date;
}

const roomSchema = new Schema<RoomDocument>(
  {
    number: { type: String, required: true, unique: true, trim: true },
    capacity: { type: Number, required: true, min: 1 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const Room = model<RoomDocument>('Room', roomSchema);
