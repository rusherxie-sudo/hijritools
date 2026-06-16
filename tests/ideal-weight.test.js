import { describe, it, expect } from 'vitest';
import { idealWeightDevine, idealWeightHamwi } from '../src/lib/health.js';

describe('理想体重 Devine', () => {
  it('锚点：男 175 ≈ 70.5', () => {
    expect(idealWeightDevine(175, 'male')).toBeCloseTo(70.5, 1);
  });
  it('锚点：女 165 ≈ 56.9', () => {
    expect(idealWeightDevine(165, 'female')).toBeCloseTo(56.9, 1);
  });
  it('保留 1 位小数', () => {
    expect(Number.isInteger(idealWeightDevine(175, 'male') * 10)).toBe(true);
  });
  it('非法输入返回 null', () => {
    expect(idealWeightDevine(0, 'male')).toBe(null);
    expect(idealWeightDevine(-175, 'male')).toBe(null);
    expect(idealWeightDevine(NaN, 'male')).toBe(null);
    expect(idealWeightDevine(175, 'x')).toBe(null);
    expect(idealWeightDevine(175, undefined)).toBe(null);
  });
});

describe('理想体重 Hamwi', () => {
  it('锚点：男 175 ≈ 72.0', () => {
    expect(idealWeightHamwi(175, 'male')).toBeCloseTo(72.0, 1);
  });
  it('锚点：女 160 ≈ 52.1', () => {
    expect(idealWeightHamwi(160, 'female')).toBeCloseTo(52.1, 1);
  });
  it('保留 1 位小数', () => {
    expect(Number.isInteger(idealWeightHamwi(175, 'male') * 10)).toBe(true);
  });
  it('非法输入返回 null', () => {
    expect(idealWeightHamwi(0, 'female')).toBe(null);
    expect(idealWeightHamwi(-160, 'female')).toBe(null);
    expect(idealWeightHamwi(NaN, 'female')).toBe(null);
    expect(idealWeightHamwi(160, 'z')).toBe(null);
    expect(idealWeightHamwi(160, undefined)).toBe(null);
  });
});
