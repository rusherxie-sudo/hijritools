import { describe, it, expect } from 'vitest';
import { waterIntakeMl } from '../src/lib/health.js';

describe('每日饮水量（ml）', () => {
  it('锚点：waterIntakeMl(70) = 2450', () => {
    expect(waterIntakeMl(70)).toBe(2450);
  });
  it('体重 × 35', () => {
    expect(waterIntakeMl(50)).toBe(1750);
    expect(waterIntakeMl(100)).toBe(3500);
  });
  it('非法输入返回 null', () => {
    expect(waterIntakeMl(0)).toBe(null);
    expect(waterIntakeMl(-70)).toBe(null);
    expect(waterIntakeMl(NaN)).toBe(null);
    expect(waterIntakeMl(undefined)).toBe(null);
    expect(waterIntakeMl(null)).toBe(null);
  });
});
