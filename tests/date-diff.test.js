import { describe, it, expect } from 'vitest';
import { dateDifference } from '../src/lib/date-diff.js';
import { utcDate } from '../src/lib/date-utils.js';

describe('日期差计算', () => {
  it('基础天数差', () => {
    const r = dateDifference(utcDate(2026, 6, 1), utcDate(2026, 6, 14));
    expect(r.totalDays).toBe(13);
    expect(r.totalWeeks).toBe(1);
    expect(r.remainderDays).toBe(6);
  });

  it('含结束日时天数 +1', () => {
    const r = dateDifference(utcDate(2026, 6, 1), utcDate(2026, 6, 14), true);
    expect(r.totalDays).toBe(14);
  });

  it('年月天日历差', () => {
    const r = dateDifference(utcDate(2020, 1, 15), utcDate(2026, 6, 14));
    expect(r.years).toBe(6);
    expect(r.months).toBe(4);
    expect(r.days).toBe(30);
  });

  it('日期顺序颠倒也能算，并标记 reversed', () => {
    const r = dateDifference(utcDate(2026, 6, 14), utcDate(2026, 6, 1));
    expect(r.totalDays).toBe(13);
    expect(r.reversed).toBe(true);
  });

  it('同一天差为 0', () => {
    const r = dateDifference(utcDate(2026, 6, 14), utcDate(2026, 6, 14));
    expect(r.totalDays).toBe(0);
    expect(r.years).toBe(0);
  });

  it('回归：月末跨月不产生负天数（1/31 → 3/1）', () => {
    const r = dateDifference(utcDate(2023, 1, 31), utcDate(2023, 3, 1));
    expect(r.days).toBeGreaterThanOrEqual(0);
    expect(r.months).toBe(1);
    expect(r.days).toBe(1); // 1/31 推进1月夹到2/28，再+1天=3/1
  });

  it('回归：1/30 → 3/1 也不下溢', () => {
    const r = dateDifference(utcDate(2023, 1, 30), utcDate(2023, 3, 1));
    expect(r.days).toBeGreaterThanOrEqual(0);
    expect(r.months).toBe(1);
  });
});
