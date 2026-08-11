import { Room } from '../models/Room';

const DEFAULT_ROOMS = [
  { number: '101', capacity: 4 },
  { number: '102', capacity: 6 },
  { number: '201', capacity: 8 },
  { number: '202', capacity: 10 },
  { number: '301', capacity: 12 },
];

export async function seedRoomsIfEmpty(): Promise<void> {
  const count = await Room.countDocuments();
  if (count > 0) {
    return;
  }

  await Room.insertMany(DEFAULT_ROOMS);
  console.log(`[seed] inserted ${DEFAULT_ROOMS.length} rooms`);
}
