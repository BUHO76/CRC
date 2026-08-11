import { roomInputSchema, type RoomInput } from '@shared/schemas/room.schema';
import type { TFunction } from 'i18next';

interface RoomFieldErrors {
  number?: string;
  capacity?: string;
}

type RoomValidationResult =
  | { success: true; data: RoomInput }
  | { success: false; fieldErrors: RoomFieldErrors };

export function validateRoomInput(
  rawNumber: string,
  rawCapacity: string,
  t: TFunction,
): RoomValidationResult {
  const result = roomInputSchema.safeParse({ number: rawNumber, capacity: rawCapacity });
  if (result.success) {
    return { success: true, data: result.data };
  }

  const fieldErrors: RoomFieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (field === 'number') {
      fieldErrors.number ??= t('validation.room.numberRequired');
    }
    if (field === 'capacity') {
      fieldErrors.capacity ??= t('validation.room.capacityInvalid');
    }
  }
  return { success: false, fieldErrors };
}
