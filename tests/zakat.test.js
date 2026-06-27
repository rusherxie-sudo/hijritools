import { describe, it, expect } from 'vitest';
import { calcZakat } from '../src/lib/zakat.js';

describe('calcZakat', () => {
  it('returns 0 when cash is below nisab (85g gold)', () => {
    const r = calcZakat(1000, 0, 280); // 1000 < 85*280=23800
    expect(r.reachedNisab).toBe(false);
    expect(r.zakatAmount).toBe(0);
  });

  it('calculates zakat on cash only when above nisab', () => {
    const r = calcZakat(50000, 0, 280);
    expect(r.reachedNisab).toBe(true);
    expect(r.zakatAmount).toBeCloseTo(1250, 2); // 50000 * 0.025
    expect(r.totalWealth).toBe(50000);
  });

  it('includes gold value in total wealth', () => {
    const r = calcZakat(10000, 100, 300); // 10000 + 100*300 = 40000 > 85*300=25500
    expect(r.reachedNisab).toBe(true);
    expect(r.totalWealth).toBe(40000);
    expect(r.zakatAmount).toBeCloseTo(1000, 2); // 40000 * 0.025
  });

  it('returns null for negative inputs', () => {
    const r = calcZakat(-100, 0, 280);
    expect(r.totalWealth).toBeNull();
  });

  it('returns null for NaN inputs', () => {
    const r = calcZakat('abc', 0, 280);
    expect(r.totalWealth).toBeNull();
  });

  it('handles zero gold price — nisab is 0 so any wealth reaches it', () => {
    const r = calcZakat(50000, 100, 0);
    expect(r.reachedNisab).toBe(true); // nisab = 85*0 = 0, total >= 0
    expect(r.zakatAmount).toBe(1250);
  });

  it('returns clean float without floating point artifacts', () => {
    const r = calcZakat(99999, 0, 280);
    expect(r.zakatAmount).toBeCloseTo(2499.975, 4);
  });
});
