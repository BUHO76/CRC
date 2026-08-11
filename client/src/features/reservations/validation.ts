import { reservationInputSchema, type ReservationInput } from '@shared/schemas/reservation.schema';
import type { TFunction } from 'i18next';

interface ReservationFieldErrors {
  roomNumber?: string;
  reservedBy?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
}

type ReservationValidationResult =
  | { success: true; data: ReservationInput }
  | { success: false; fieldErrors: ReservationFieldErrors };

interface RawReservationInput {
  roomNumber: string;
  reservedBy: string;
  date: string;
  startTime: string;
  endTime: string;
}

export function validateReservationInput(
  raw: RawReservationInput,
  t: TFunction,
): ReservationValidationResult {
  const result = reservationInputSchema.safeParse(raw);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const fieldErrors: ReservationFieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (field === 'roomNumber') {
      fieldErrors.roomNumber ??= t('validation.reservation.roomNumberRequired');
    }
    if (field === 'reservedBy') {
      fieldErrors.reservedBy ??= t('validation.reservation.reservedByRequired');
    }
    if (field === 'date') {
      fieldErrors.date ??= t('validation.reservation.dateInvalid');
    }
    if (field === 'startTime') {
      fieldErrors.startTime ??= t('validation.reservation.startTimeInvalid');
    }
    if (field === 'endTime') {
      fieldErrors.endTime ??= t('validation.reservation.endTimeInvalid');
    }
  }
  return { success: false, fieldErrors };
}
