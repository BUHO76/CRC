import { Reservation } from '../models/Reservation';

const DEFAULT_RESERVATIONS = [
  { roomNumber: '101', reservedBy: 'Alice Johnson', date: '2026-08-12', startTime: '09:00', endTime: '10:00' },
  { roomNumber: '101', reservedBy: 'Bob Smith', date: '2026-08-12', startTime: '10:30', endTime: '11:30' },
  { roomNumber: '102', reservedBy: 'Carla Diaz', date: '2026-08-12', startTime: '13:00', endTime: '14:00' },
  { roomNumber: '201', reservedBy: 'David Lee', date: '2026-08-13', startTime: '09:30', endTime: '10:30' },
  { roomNumber: '301', reservedBy: 'Elena Cruz', date: '2026-08-13', startTime: '15:00', endTime: '16:00' },
];

export async function seedReservationsIfEmpty(): Promise<void> {
  const count = await Reservation.countDocuments();
  if (count > 0) {
    return;
  }

  await Reservation.insertMany(DEFAULT_RESERVATIONS);
  console.log(`[seed] inserted ${DEFAULT_RESERVATIONS.length} reservations`);
}
