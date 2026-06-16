import { describe, it, expect } from 'vitest';
import { bodyFatNavy } from '../src/lib/health.js';

describe('海军体脂公式（cm 版）', () => {
  it('锚点：男 height178 neck38 waist90 ≈ 20.2%', () => {
    const v = bodyFatNavy({ sex: 'male', heightCm: 178, neckCm: 38, waistCm: 90 });
    expect(v).toBeCloseTo(20.2, 0);
  });
  it('保留 1 位小数', () => {
    const v = bodyFatNavy({ sex: 'male', heightCm: 178, neckCm: 38, waistCm: 90 });
    expect(Number.isInteger(v * 10)).toBe(true);
  });
  it('女性需要臀围 hipCm', () => {
    const v = bodyFatNavy({ sex: 'female', heightCm: 165, neckCm: 32, waistCm: 75, hipCm: 95 });
    expect(typeof v).toBe('number');
    expect(v).toBeGreaterThan(0);
  });
  it('女性缺臀围返回 null', () => {
    expect(bodyFatNavy({ sex: 'female', heightCm: 165, neckCm: 32, waistCm: 75 })).toBe(null);
  });
  it('男性腰围必须大于颈围（log10 域）', () => {
    expect(bodyFatNavy({ sex: 'male', heightCm: 178, neckCm: 40, waistCm: 40 })).toBe(null);
    expect(bodyFatNavy({ sex: 'male', heightCm: 178, neckCm: 50, waistCm: 40 })).toBe(null);
  });
  it('非法 / 缺失输入返回 null', () => {
    expect(bodyFatNavy({ sex: 'male', heightCm: 0, neckCm: 38, waistCm: 90 })).toBe(null);
    expect(bodyFatNavy({ sex: 'male', heightCm: 178, neckCm: -38, waistCm: 90 })).toBe(null);
    expect(bodyFatNavy({ sex: 'male', heightCm: 178, neckCm: NaN, waistCm: 90 })).toBe(null);
    expect(bodyFatNavy({ sex: 'x', heightCm: 178, neckCm: 38, waistCm: 90 })).toBe(null);
    expect(bodyFatNavy({})).toBe(null);
    expect(bodyFatNavy(null)).toBe(null);
  });
});
