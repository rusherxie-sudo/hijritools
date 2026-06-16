import { describe, it, expect } from 'vitest';
import { daysBetween, nextHijriEvent, EVENTS } from '../src/lib/countdown.js';
import { gregorianToHijri, hijriToGregorian } from '../src/lib/hijri.js';
import { utcDate, diffInDays } from '../src/lib/date-utils.js';

describe('daysBetween', () => {
  it('2026-06-16 → 2026-06-26 = 10 天', () => {
    expect(daysBetween(utcDate(2026, 6, 16), utcDate(2026, 6, 26))).toBe(10);
  });

  it('同一天 = 0', () => {
    expect(daysBetween(utcDate(2026, 6, 16), utcDate(2026, 6, 16))).toBe(0);
  });

  it('跨年正确（2025-12-31 → 2026-01-10 = 10）', () => {
    expect(daysBetween(utcDate(2025, 12, 31), utcDate(2026, 1, 10))).toBe(10);
  });

  it('to 早于 from 返回负数', () => {
    expect(daysBetween(utcDate(2026, 6, 26), utcDate(2026, 6, 16))).toBe(-10);
  });

  it('忽略时分秒，只按整天计', () => {
    const a = new Date(Date.UTC(2026, 5, 16, 23, 59, 0));
    const b = new Date(Date.UTC(2026, 5, 17, 0, 1, 0));
    expect(daysBetween(a, b)).toBe(1);
  });
});

describe('EVENTS（事件伊历月日）', () => {
  it('رمضان = (9,1)、عيد الفطر = (10,1)、عيد الأضحى = (12,10)', () => {
    const byKey = Object.fromEntries(EVENTS.map((e) => [e.key, e]));
    expect([byKey.ramadan.hm, byKey.ramadan.hd]).toEqual([9, 1]);
    expect([byKey.fitr.hm, byKey.fitr.hd]).toEqual([10, 1]);
    expect([byKey.adha.hm, byKey.adha.hd]).toEqual([12, 10]);
  });
});

describe('nextHijriEvent', () => {
  // 自洽断言：返回的公历日期反查应正好落在目标伊历月/日，且 >= fromDate。
  const cases = [
    { from: utcDate(2026, 6, 16), hm: 9, hd: 1, label: 'رمضان' },
    { from: utcDate(2026, 6, 16), hm: 10, hd: 1, label: 'عيد الفطر' },
    { from: utcDate(2026, 6, 16), hm: 12, hd: 10, label: 'عيد الأضحى' },
  ];

  for (const c of cases) {
    it(`${c.label}：返回的公历经 hijri.js 反查确为 (${c.hm},${c.hd}) 且不早于参考日`, () => {
      const g = nextHijriEvent(c.from, c.hm, c.hd);
      const h = gregorianToHijri(g);
      expect([h.hm, h.hd]).toEqual([c.hm, c.hd]);
      expect(diffInDays(c.from, g)).toBeGreaterThanOrEqual(0);
    });
  }

  it('与页面算法一致：取今年或下一伊历年的该日（自洽期望值）', () => {
    const from = utcDate(2026, 6, 16);
    const todayH = gregorianToHijri(from);
    // 期望：先试今年伊历年的目标日，已过则取下一伊历年
    let expected = hijriToGregorian(todayH.hy, 9, 1);
    if (diffInDays(from, expected) < 0) expected = hijriToGregorian(todayH.hy + 1, 9, 1);
    const got = nextHijriEvent(from, 9, 1);
    expect(got.getTime()).toBe(expected.getTime());
  });

  it('边界：参考日正好是事件当天 → 返回当天（剩余 0 天）', () => {
    // 找一个确定的事件公历日：1448 رمضان 1 的公历
    const eventDay = hijriToGregorian(1448, 9, 1);
    const g = nextHijriEvent(eventDay, 9, 1);
    expect(g.getTime()).toBe(eventDay.getTime());
    expect(daysBetween(eventDay, g)).toBe(0);
  });

  it('边界：事件已过当年 → 跳到下一伊历年（结果严格晚于事件当天）', () => {
    const eventDay = hijriToGregorian(1448, 9, 1);
    const dayAfter = utcDate(
      eventDay.getUTCFullYear(),
      eventDay.getUTCMonth() + 1,
      eventDay.getUTCDate(),
    );
    dayAfter.setUTCDate(dayAfter.getUTCDate() + 1); // 事件次日
    const g = nextHijriEvent(dayAfter, 9, 1);
    // 应是 1449 رمضان 1，反查仍为 (9,1) 且晚于 1448 的该日
    const h = gregorianToHijri(g);
    expect([h.hm, h.hd]).toEqual([9, 1]);
    expect(diffInDays(eventDay, g)).toBeGreaterThan(0);
    expect(h.hy).toBe(1449);
  });

  it('支持 offset：带偏移时反查（同 offset）仍落在目标日', () => {
    const from = utcDate(2026, 6, 16);
    const g = nextHijriEvent(from, 9, 1, 1);
    const h = gregorianToHijri(g, 1);
    expect([h.hm, h.hd]).toEqual([9, 1]);
    expect(diffInDays(from, g)).toBeGreaterThanOrEqual(0);
  });
});
