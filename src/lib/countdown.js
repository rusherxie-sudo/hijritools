// 倒计时核心库：到伊历节日（رمضان/عيد الفطر/عيد الأضحى）或任意公历日期的剩余天数。
// 纯函数，DOM 无关，时区无关；所有「今天」由调用方传入（页面用 new Date()，测试可注入）。
// 伊历换算只走 src/lib/hijri.js 封装；日期数学只用 src/lib/date-utils.js 的 UTC 安全函数。

import { diffInDays } from './date-utils.js';
import { gregorianToHijri, hijriToGregorian } from './hijri.js';

// 三大伊历节日（伊历月/日）。key 供页面/测试稳定引用，nameAr 用于展示。
export const EVENTS = [
  { key: 'ramadan', hm: 9, hd: 1, nameAr: 'رمضان' },
  { key: 'fitr', hm: 10, hd: 1, nameAr: 'عيد الفطر' },
  { key: 'adha', hm: 12, hd: 10, nameAr: 'عيد الأضحى' },
];

/**
 * 两个日期相差的整天数（toDate - fromDate），忽略时分秒。
 * @param {Date} fromDate
 * @param {Date} toDate
 * @returns {number} 整数天（toDate 早于 fromDate 时为负）
 */
export function daysBetween(fromDate, toDate) {
  return diffInDays(fromDate, toDate);
}

/**
 * 从 fromDate（含当天）起，给定伊历月/日的下一个公历日期。
 * 先取 fromDate 所在伊历年的目标日；若该日已早于 fromDate，则取下一伊历年的目标日。
 * @param {Date} fromDate 参考日期（含当天）
 * @param {number} hijriMonth 伊历月 1-12
 * @param {number} hijriDay 伊历日
 * @param {number} offset 国家偏移天数（默认 0 = 沙特官历），与 hijri.js 约定一致
 * @returns {Date} 该事件的下一个公历日期（00:00 UTC）
 */
export function nextHijriEvent(fromDate, hijriMonth, hijriDay, offset = 0) {
  const todayH = gregorianToHijri(fromDate, offset);
  let g = hijriToGregorian(todayH.hy, hijriMonth, hijriDay, offset);
  // 今年的该伊历日已过（严格早于参考日），跳到下一伊历年
  if (diffInDays(fromDate, g) < 0) {
    g = hijriToGregorian(todayH.hy + 1, hijriMonth, hijriDay, offset);
  }
  return g;
}
