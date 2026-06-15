import { describe, it, expect } from 'vitest';
import { computeAge, ageDifference } from '../src/lib/age.js';
import { utcDate } from '../src/lib/date-utils.js';

describe('年龄计算', () => {
  it('整岁：1990-06-14 到 2026-06-14 = 36 岁', () => {
    const a = computeAge(utcDate(1990, 6, 14), utcDate(2026, 6, 14));
    expect(a.gregorian).toEqual({ years: 36, months: 0, days: 0 });
  });

  it('带月日借位：2000-01-31 到 2026-06-14', () => {
    const a = computeAge(utcDate(2000, 1, 31), utcDate(2026, 6, 14));
    expect(a.gregorian.years).toBe(26);
    expect(a.gregorian.months).toBe(4); // 1月31到6月14，跨过2,3,4,5月
  });

  it('总天数正确', () => {
    const a = computeAge(utcDate(2026, 6, 4), utcDate(2026, 6, 14));
    expect(a.totalDays).toBe(10);
    expect(a.totalWeeks).toBe(1);
  });

  it('额外时间维度：总月数 / 总小时 / 总分钟', () => {
    const a = computeAge(utcDate(2026, 6, 4), utcDate(2026, 6, 14));
    expect(a.totalMonths).toBe(0);
    expect(a.totalHours).toBe(10 * 24);
    expect(a.totalMinutes).toBe(10 * 24 * 60);
  });

  it('伊历年龄与公历年龄不同（约每33年差1岁）', () => {
    const a = computeAge(utcDate(1990, 6, 14), utcDate(2026, 6, 14));
    // 36 公历年 ≈ 37 伊历年
    expect(a.hijri.years).toBeGreaterThanOrEqual(36);
    expect(a.hijri.years).toBeLessThanOrEqual(38);
  });

  it('截止到任意指定日（非今天）', () => {
    const a = computeAge(utcDate(2020, 1, 1), utcDate(2020, 7, 1));
    expect(a.gregorian).toEqual({ years: 0, months: 6, days: 0 });
  });

  it('出生当天为生日时，下次公历生日倒计时为 0', () => {
    const a = computeAge(utcDate(1990, 6, 14), utcDate(2026, 6, 14));
    expect(a.nextGregorianBirthday.daysUntil).toBe(0);
  });

  it('下次公历生日在未来时倒计时为正', () => {
    const a = computeAge(utcDate(1990, 12, 25), utcDate(2026, 6, 14));
    expect(a.nextGregorianBirthday.daysUntil).toBeGreaterThan(0);
    expect(a.nextGregorianBirthday.daysUntil).toBeLessThanOrEqual(366);
  });

  it('提供伊历下次生日倒计时（0-355 天内）', () => {
    const a = computeAge(utcDate(1990, 6, 14), utcDate(2026, 6, 14));
    expect(a.nextHijriBirthday.daysUntil).toBeGreaterThanOrEqual(0);
    expect(a.nextHijriBirthday.daysUntil).toBeLessThanOrEqual(355);
  });

  it('出生星期几用阿拉伯语', () => {
    // 1990-06-14 是周四
    const a = computeAge(utcDate(1990, 6, 14), utcDate(2026, 6, 14));
    expect(a.birthWeekday).toBe('الخميس');
  });

  it('闰日 2/29 生日在平年按 3/1 计下次生日', () => {
    const a = computeAge(utcDate(2000, 2, 29), utcDate(2025, 6, 1));
    // 2026 是平年，下次生日应落在 2026-03-01
    expect(a.nextGregorianBirthday.date.toISOString().slice(0, 10)).toBe('2026-03-01');
  });

  it('截止日早于出生日应抛错', () => {
    expect(() => computeAge(utcDate(2026, 6, 14), utcDate(1990, 1, 1))).toThrow(RangeError);
  });

  it('两人年龄差：A 比 B 大', () => {
    const d = ageDifference(utcDate(1990, 1, 1), utcDate(1995, 1, 1));
    expect(d.olderIsFirst).toBe(true);
    expect(d.delta).toEqual({ years: 5, months: 0, days: 0 });
  });

  it('回归：月末出生不产生负天数（1/31 生，截止 3/1）', () => {
    const a = computeAge(utcDate(1990, 1, 31), utcDate(2026, 3, 1));
    expect(a.gregorian.days).toBeGreaterThanOrEqual(0);
    expect(a.gregorian.months).toBe(1);
    expect(a.gregorian.days).toBe(1);
  });
});
