import { describe, it, expect } from 'vitest';
import { bmr, tdee } from '../src/lib/health.js';

describe('Mifflin-St Jeor BMR', () => {
  it('锚点：男 80/180/30 = 1780', () => {
    expect(bmr({ sex: 'male', weightKg: 80, heightCm: 180, age: 30 })).toBe(1780);
  });
  it('锚点：女 60/165/30 = 1320.25', () => {
    expect(bmr({ sex: 'female', weightKg: 60, heightCm: 165, age: 30 })).toBe(1320.25);
  });
  it('非法 / 缺失输入返回 null', () => {
    expect(bmr({ sex: 'male', weightKg: 0, heightCm: 180, age: 30 })).toBe(null);
    expect(bmr({ sex: 'male', weightKg: 80, heightCm: 0, age: 30 })).toBe(null);
    expect(bmr({ sex: 'male', weightKg: 80, heightCm: 180, age: 0 })).toBe(null);
    expect(bmr({ sex: 'male', weightKg: -80, heightCm: 180, age: 30 })).toBe(null);
    expect(bmr({ sex: 'male', weightKg: 80, heightCm: 180, age: NaN })).toBe(null);
    expect(bmr({ sex: 'x', weightKg: 80, heightCm: 180, age: 30 })).toBe(null);
    expect(bmr({})).toBe(null);
    expect(bmr(null)).toBe(null);
  });
});

describe('TDEE', () => {
  it('锚点：tdee(1780, 1.55) = 2759', () => {
    expect(tdee(1780, 1.55)).toBe(2759);
  });
  it('久坐系数 1.2', () => {
    expect(tdee(1780, 1.2)).toBe(2136);
  });
  it('非法输入返回 null', () => {
    expect(tdee(null, 1.55)).toBe(null);
    expect(tdee(1780, null)).toBe(null);
    expect(tdee(NaN, 1.55)).toBe(null);
    expect(tdee(1780, 0)).toBe(null);
    expect(tdee(-1780, 1.55)).toBe(null);
  });
});
