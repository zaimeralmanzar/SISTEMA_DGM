import { describe, it, expect } from 'vitest';
import { overstayServiceMock } from '../services/mocks/overstayService.mock';

describe('overstayService', () => {
  it('returns no overstay when within authorized days', () => {
    const result = overstayServiceMock.calculate('2024-01-01', '2024-01-20', 30);
    expect(result.isOverstay).toBe(false);
    expect(result.exceededDays).toBe(0);
    expect(result.estimatedFee).toBe(0);
  });

  it('calculates exceeded days correctly', () => {
    const result = overstayServiceMock.calculate('2024-01-01', '2024-02-10', 30);
    expect(result.isOverstay).toBe(true);
    expect(result.exceededDays).toBeGreaterThan(0);
    expect(result.estimatedFee).toBe(result.exceededDays * 25);
  });

  it('returns correct elapsed days', () => {
    const result = overstayServiceMock.calculate('2024-01-01', '2024-01-11', 30);
    expect(result.elapsedDays).toBe(10);
  });

  it('handles exactly at authorized days', () => {
    const result = overstayServiceMock.calculate('2024-01-01', '2024-01-31', 30);
    expect(result.isOverstay).toBe(false);
    expect(result.exceededDays).toBe(0);
  });
});
