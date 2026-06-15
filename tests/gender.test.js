import { describe, it, expect } from 'vitest';
import { predictGender } from '../src/lib/gender.js';
import { GENDER_CHART, AGE_MIN, AGE_MAX } from '../src/data/gender-chart.js';

describe('清宫图性别预测（娱乐）', () => {
  it('数据表结构：每个年龄行恰好 12 项，值仅为 B/G', () => {
    for (let age = AGE_MIN; age <= AGE_MAX; age++) {
      const row = GENDER_CHART[age];
      expect(row, `缺少年龄 ${age}`).toBeDefined();
      expect(row.length).toBe(12);
      expect(/^[BG]{12}$/.test(row)).toBe(true);
    }
  });

  it('返回值只能是 male 或 female', () => {
    const r = predictGender(28, 5);
    expect(['male', 'female']).toContain(r);
  });

  it('查表正确（与数据表一致）', () => {
    // 18 岁第 1 月 = 'G' → female；第 2 月 = 'B' → male
    expect(predictGender(18, 1)).toBe('female');
    expect(predictGender(18, 2)).toBe('male');
    // 21 岁第 1 月 = 'B' → male
    expect(predictGender(21, 1)).toBe('male');
  });

  it('年龄越界抛 RangeError', () => {
    expect(() => predictGender(17, 5)).toThrow(RangeError);
    expect(() => predictGender(46, 5)).toThrow(RangeError);
  });

  it('月份越界抛 RangeError', () => {
    expect(() => predictGender(28, 0)).toThrow(RangeError);
    expect(() => predictGender(28, 13)).toThrow(RangeError);
  });
});
