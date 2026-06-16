import { describe, it, expect } from 'vitest';
import { bmi, bmiCategory } from '../src/lib/health.js';

describe('BMI 计算', () => {
  it('锚点：bmi(70,175)=22.9', () => {
    expect(bmi(70, 175)).toBe(22.9);
  });
  it('锚点：bmi(95,170)=32.9', () => {
    expect(bmi(95, 170)).toBe(32.9);
  });
  it('锚点：bmi(50,170)=17.3', () => {
    expect(bmi(50, 170)).toBe(17.3);
  });
  it('保留 1 位小数', () => {
    // 60/(1.7^2) = 20.7612... → 20.8
    expect(bmi(60, 170)).toBe(20.8);
  });
  it('非法输入返回 null', () => {
    expect(bmi(0, 175)).toBe(null);
    expect(bmi(70, 0)).toBe(null);
    expect(bmi(-70, 175)).toBe(null);
    expect(bmi(70, -175)).toBe(null);
    expect(bmi(NaN, 175)).toBe(null);
    expect(bmi(70, NaN)).toBe(null);
    expect(bmi(undefined, undefined)).toBe(null);
  });
});

describe('WHO BMI 分级', () => {
  it('<18.5 نحافة', () => {
    expect(bmiCategory(17.3)).toBe('نحافة');
    expect(bmiCategory(18.4)).toBe('نحافة');
  });
  it('18.5–24.9 وزن طبيعي', () => {
    expect(bmiCategory(18.5)).toBe('وزن طبيعي');
    expect(bmiCategory(22.9)).toBe('وزن طبيعي');
    expect(bmiCategory(24.9)).toBe('وزن طبيعي');
  });
  it('25–29.9 زيادة في الوزن', () => {
    expect(bmiCategory(25)).toBe('زيادة في الوزن');
    expect(bmiCategory(29.9)).toBe('زيادة في الوزن');
  });
  it('≥30 سمنة', () => {
    expect(bmiCategory(30)).toBe('سمنة');
    expect(bmiCategory(32.9)).toBe('سمنة');
  });
  it('非法输入返回 null', () => {
    expect(bmiCategory(null)).toBe(null);
    expect(bmiCategory(NaN)).toBe(null);
    expect(bmiCategory(undefined)).toBe(null);
  });
});
