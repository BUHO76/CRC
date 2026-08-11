import { z } from 'zod';

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const OPERATING_HOURS = {
  start: '09:00',
  end: '17:00',
} as const;

export const reservationInputSchema = z
  .object({
    roomNumber: z.string().trim().min(1),
    reservedBy: z.string().trim().min(1),
    date: z.string().regex(DATE_PATTERN),
    startTime: z.string().regex(TIME_PATTERN),
    endTime: z.string().regex(TIME_PATTERN),
  })
  .refine((data) => data.startTime >= OPERATING_HOURS.start, { path: ['startTime'] })
  .refine((data) => data.endTime <= OPERATING_HOURS.end, { path: ['endTime'] })
  .refine((data) => data.endTime > data.startTime, { path: ['endTime'] });

export type ReservationInput = z.infer<typeof reservationInputSchema>;

export interface Reservation extends ReservationInput {
  _id: string;
  createdAt: string;
}
