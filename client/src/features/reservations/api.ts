import type { Reservation, ReservationInput } from '@shared/schemas/reservation.schema';
import { api } from '../../lib/api';

interface ReservationFilters {
  roomNumber?: string;
  date?: string;
}

export async function fetchReservations(filters: ReservationFilters = {}): Promise<Reservation[]> {
  const { data } = await api.get<Reservation[]>('/reservations', { params: filters });
  return data;
}

export async function createReservationRequest(input: ReservationInput): Promise<Reservation> {
  const { data } = await api.post<Reservation>('/reservations', input);
  return data;
}

export async function deleteReservationRequest(id: string): Promise<void> {
  await api.delete(`/reservations/${id}`);
}
