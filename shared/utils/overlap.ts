export interface TimeRange {
  startTime: string;
  endTime: string;
}

export function timeRangesOverlap(a: TimeRange, b: TimeRange): boolean {
  return a.startTime < b.endTime && a.endTime > b.startTime;
}

export function hasOverlap(existing: TimeRange[], candidate: TimeRange): boolean {
  return existing.some((reservation) => timeRangesOverlap(reservation, candidate));
}
