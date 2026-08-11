import { Schema, model } from 'mongoose';

export interface ReservationDocument {
  roomNumber: string;
  reservedBy: string;
  date: string;
  startTime: string;
  endTime: string;
  createdAt: Date;
}

const reservationSchema = new Schema<ReservationDocument>(
  {
    roomNumber: { type: String, required: true, trim: true },
    reservedBy: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

reservationSchema.index({ roomNumber: 1, date: 1 });

export const Reservation = model<ReservationDocument>('Reservation', reservationSchema);
