import { z } from 'zod';

export const roomInputSchema = z.object({
  number: z.string().trim().min(1),
  capacity: z.coerce.number().int().positive(),
});

export type RoomInput = z.infer<typeof roomInputSchema>;

export interface Room extends RoomInput {
  _id: string;
  createdAt: string;
}
