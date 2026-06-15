import { describe, it, expect } from 'vitest';
import {
  gregorianToHijri,
  hijriToGregorian,
  hijriMonthLength,
  formatHijri,
  formatGregorian,
  isSacredMonth,
} from '../src/lib/hijri.js';
import { utcDate } from '../src/lib/date-utils.js';

describe('圣月（الأشهر الحرم）判定', () => {
  it('四个圣月返回 true：محرم(1)، رجب(7)، ذو القعدة(11)، ذو الحجة(12)', () => {
    expect(isSacredMonth(1)).toBe(true);
    expect(isSacredMonth(7)).toBe(true);
    expect(isSacredMonth(11)).toBe(true);
    expect(isSacredMonth(12)).toBe(true);
  });
  it('其余月份返回 false', () => {
    for (const m of [2, 3, 4, 5, 6, 8, 9, 10]) {
      expect(isSacredMonth(m)).toBe(false);
    }
  });
});

describe('伊历换算（乌姆库拉历）', () => {
  it('今天 2026-06-14 应为 1447-12-28（与沙特官历锚点一致）', () => {
    const h = gregorianToHijri(utcDate(2026, 6, 14));
    expect([h.hy, h.hm, h.hd]).toEqual([1447, 12, 28]);
  });

  it('1447-01-01 应对应公历 2025-06-26（沙特官历新年）', () => {
    const g = hijriToGregorian(1447, 1, 1);
    expect(g.toISOString().slice(0, 10)).toBe('2025-06-26');
  });

  it('公历→伊历→公历 往返守恒（无偏移）', () => {
    const original = utcDate(2026, 6, 14);
    const h = gregorianToHijri(original);
    const back = hijriToGregorian(h.hy, h.hm, h.hd);
    expect(back.getTime()).toBe(original.getTime());
  });

  it('伊历→公历→伊历 往返守恒', () => {
    const g = hijriToGregorian(1446, 9, 1); // 斋月首日
    const h = gregorianToHijri(g);
    expect([h.hy, h.hm, h.hd]).toEqual([1446, 9, 1]);
  });

  it('偏移 +1 天：同一公历日的伊历日号比官历大 1', () => {
    const base = gregorianToHijri(utcDate(2026, 6, 14), 0);
    const plus1 = gregorianToHijri(utcDate(2026, 6, 14), 1);
    expect(plus1.hd).toBe(base.hd + 1);
  });

  it('带偏移的往返也守恒', () => {
    const original = utcDate(2026, 3, 20);
    const h = gregorianToHijri(original, 1);
    const back = hijriToGregorian(h.hy, h.hm, h.hd, 1);
    expect(back.getTime()).toBe(original.getTime());
  });

  it('伊历月长度只能是 29 或 30 天', () => {
    for (let m = 1; m <= 12; m++) {
      const len = hijriMonthLength(1447, m);
      expect([29, 30]).toContain(len);
    }
  });

  it('一个伊历年总天数应为 354 或 355 天', () => {
    let total = 0;
    for (let m = 1; m <= 12; m++) total += hijriMonthLength(1447, m);
    expect([354, 355]).toContain(total);
  });

  it('超出支持范围应抛 RangeError', () => {
    expect(() => gregorianToHijri(utcDate(1800, 1, 1))).toThrow(RangeError);
  });

  it('格式化输出阿拉伯语长格式', () => {
    const h = gregorianToHijri(utcDate(2026, 6, 14));
    expect(formatHijri(h)).toBe('28 ذو الحجة 1447 هـ');
    expect(formatGregorian(utcDate(2026, 6, 14))).toBe('14 يونيو 2026 م');
  });
});
