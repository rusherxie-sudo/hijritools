import { describe, it, expect } from 'vitest';
import { calendarDelta, parseISODate, diffInDays, utcDate } from '../src/lib/date-utils.js';

describe('日期工具', () => {
  describe('calendarDelta', () => {
    it('整年', () => {
      expect(calendarDelta(utcDate(2000, 1, 1), utcDate(2005, 1, 1))).toEqual({ years: 5, months: 0, days: 0 });
    });
    it('月末跨月不下溢（1/31 → 3/1）', () => {
      expect(calendarDelta(utcDate(2023, 1, 31), utcDate(2023, 3, 1))).toEqual({ years: 0, months: 1, days: 1 });
    });
    it('多年含月日借位（2020-01-15 → 2026-06-14）', () => {
      expect(calendarDelta(utcDate(2020, 1, 15), utcDate(2026, 6, 14))).toEqual({ years: 6, months: 4, days: 30 });
    });
    it('end <= start 返回全 0', () => {
      expect(calendarDelta(utcDate(2026, 6, 14), utcDate(2026, 6, 14))).toEqual({ years: 0, months: 0, days: 0 });
    });
    it('闰日：2020-02-29 → 2021-02-28 接近满一年', () => {
      const d = calendarDelta(utcDate(2020, 2, 29), utcDate(2021, 2, 28));
      expect(d.years).toBe(0);
      expect(d.months).toBe(11);
      expect(d.days).toBeGreaterThanOrEqual(0);
    });
  });

  describe('parseISODate', () => {
    it('合法日期', () => {
      expect(parseISODate('2026-06-14').toISOString().slice(0, 10)).toBe('2026-06-14');
    });
    it('拒绝越界日（2 月 30 日）', () => {
      expect(parseISODate('2023-02-30')).toBeNull();
    });
    it('拒绝越界月（13 月）', () => {
      expect(parseISODate('2023-13-01')).toBeNull();
    });
    it('拒绝 0 月 / 0 日', () => {
      expect(parseISODate('2023-00-10')).toBeNull();
      expect(parseISODate('2023-04-00')).toBeNull();
    });
    it('拒绝格式错误', () => {
      expect(parseISODate('2023/04/01')).toBeNull();
      expect(parseISODate('abc')).toBeNull();
      expect(parseISODate(null)).toBeNull();
    });
    it('接受闰年 2 月 29 日', () => {
      expect(parseISODate('2024-02-29').toISOString().slice(0, 10)).toBe('2024-02-29');
    });
  });
});
