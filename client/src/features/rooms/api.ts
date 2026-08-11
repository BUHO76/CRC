import type { Room, RoomInput } from '@shared/schemas/room.schema';
import { api } from '../../lib/api';

export async function fetchRooms(): Promise<Room[]> {
  const { data } = await api.get<Room[]>('/rooms');
  return data;
}

export async function createRoomRequest(input: RoomInput): Promise<Room> {
  const { data } = await api.post<Room>('/rooms', input);
  return data;
}

export async function updateRoomRequest(id: string, input: RoomInput): Promise<Room> {
  const { data } = await api.put<Room>(`/rooms/${id}`, input);
  return data;
}

export async function deleteRoomRequest(id: string): Promise<void> {
  await api.delete(`/rooms/${id}`);
}
