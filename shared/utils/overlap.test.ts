import { describe, expect, it } from 'vitest';
import { hasOverlap, timeRangesOverlap } from './overlap';

describe('timeRangesOverlap', () => {
  it('returns false when candidate is entirely before existing', () => {
    const existing = { startTime: '10:00', endTime: '11:00' };
    const candidate = { startTime: '09:00', endTime: '10:00' };
    expect(timeRangesOverlap(existing, candidate)).toBe(false);
  });

  it('returns false when candidate is entirely after existing', () => {
    const existing = { startTime: '09:00', endTime: '10:00' };
    const candidate = { startTime: '10:00', endTime: '11:00' };
    expect(timeRangesOverlap(existing, candidate)).toBe(false);
  });

  it('returns false for back-to-back adjacent ranges (touching boundary is not overlap)', () => {
    const existing = { startTime: '09:00', endTime: '10:00' };
    const candidate = { startTime: '10:00', endTime: '11:00' };
    expect(timeRangesOverlap(existing, candidate)).toBe(false);
    expect(timeRangesOverlap(candidate, existing)).toBe(false);
  });

  it('returns true for identical ranges', () => {
    const existing = { startTime: '09:00', endTime: '10:00' };
    const candidate = { startTime: '09:00', endTime: '10:00' };
    expect(timeRangesOverlap(existing, candidate)).toBe(true);
  });

  it('returns true when candidate starts during existing', () => {
    const existing = { startTime: '09:00', endTime: '10:00' };
    const candidate = { startTime: '09:30', endTime: '10:30' };
    expect(timeRangesOverlap(existing, candidate)).toBe(true);
  });

  it('returns true when candidate ends during existing', () => {
    const existing = { startTime: '09:30', endTime: '10:30' };
    const candidate = { startTime: '09:00', endTime: '10:00' };
    expect(timeRangesOverlap(existing, candidate)).toBe(true);
  });

  it('returns true when candidate fully contains existing', () => {
    const existing = { startTime: '09:30', endTime: '10:00' };
    const candidate = { startTime: '09:00', endTime: '10:30' };
    expect(timeRangesOverlap(existing, candidate)).toBe(true);
  });
});

describe('hasOverlap', () => {
  it('returns false for an empty existing list', () => {
    expect(hasOverlap([], { startTime: '09:00', endTime: '10:00' })).toBe(false);
  });

  it('returns false when no reservation in the list conflicts', () => {
    const existing = [
      { startTime: '09:00', endTime: '10:00' },
      { startTime: '13:00', endTime: '14:00' },
    ];
    expect(hasOverlap(existing, { startTime: '10:00', endTime: '11:00' })).toBe(false);
  });

  it('returns true when one reservation in the list conflicts', () => {
    const existing = [
      { startTime: '09:00', endTime: '10:00' },
      { startTime: '13:00', endTime: '14:00' },
    ];
    expect(hasOverlap(existing, { startTime: '13:30', endTime: '14:30' })).toBe(true);
  });
});
