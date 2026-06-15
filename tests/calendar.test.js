import { describe, it, expect } from 'vitest';
import { buildHijriMonth, buildHijriYear } from '../src/lib/calendar.js';

describe('伊历年历构建', () => {
  it('某月天数为 29 或 30，且 days 数组长度一致', () => {
    const m = buildHijriMonth(1447, 1);
    expect([29, 30]).toContain(m.length);
    expect(m.days.length).toBe(m.length);
  });

  it('锚点：1447-01-01 = 公历 2025-06-26（沙特官历）', () => {
    const m = buildHijriMonth(1447, 1);
    const d0 = m.days[0];
    expect(d0.hd).toBe(1);
    expect(d0.greg).toEqual({ y: 2025, m: 6, d: 26 });
    // 2025-06-26 的星期 = firstWeekday
    expect(m.firstWeekday).toBe(new Date(Date.UTC(2025, 5, 26)).getUTCDay());
  });

  it('圣月标记：محرم(1)/رجب(7)/ذو القعدة(11)/ذو الحجة(12) 为 true', () => {
    expect(buildHijriMonth(1447, 1).sacred).toBe(true);
    expect(buildHijriMonth(1447, 7).sacred).toBe(true);
    expect(buildHijriMonth(1447, 11).sacred).toBe(true);
    expect(buildHijriMonth(1447, 12).sacred).toBe(true);
    expect(buildHijriMonth(1447, 2).sacred).toBe(false);
  });

  it('节日定位：ذو الحجة 第 10 天 = عيد الأضحى', () => {
    const m = buildHijriMonth(1447, 12);
    expect(m.days[9].hd).toBe(10);
    expect(m.days[9].holiday?.nameAr).toBe('عيد الأضحى');
  });

  it('每月名称正确（رمضان = 第 9 月）', () => {
    expect(buildHijriMonth(1447, 9).monthName).toBe('رمضان');
  });

  it('全年 12 个月，总天数为 354 或 355', () => {
    const y = buildHijriYear(1447);
    expect(y.months.length).toBe(12);
    const total = y.months.reduce((s, m) => s + m.length, 0);
    expect([354, 355]).toContain(total);
  });
});
