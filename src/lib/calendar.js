// 伊历年历构建（纯函数，构建期与测试共用，零客户端依赖）。
// 输出结构供 Astro 在构建期 .map 渲染成静态 HTML 网格。

import {
  hijriToGregorian, hijriMonthLength, isSacredMonth,
  HIJRI_MONTHS_AR, GREGORIAN_MONTHS_AR,
} from './hijri.js';
import { holidaysInMonth } from '../data/hijri-holidays.js';

/**
 * 构建某伊历月的完整结构。
 * @param {number} hy 伊历年
 * @param {number} hm 伊历月 1-12
 * @param {number} offset 国家偏移（默认 0 = 沙特官历）
 * @returns {{hm, monthName, length, firstWeekday, sacred, days}}
 */
export function buildHijriMonth(hy, hm, offset = 0) {
  const length = hijriMonthLength(hy, hm);
  const first = hijriToGregorian(hy, hm, 1, offset);
  const firstWeekday = first.getUTCDay(); // 0=周日..6=周六
  const monthHolidays = holidaysInMonth(hm);

  const days = [];
  for (let hd = 1; hd <= length; hd++) {
    const g = hijriToGregorian(hy, hm, hd, offset);
    const gm = g.getUTCMonth() + 1;
    days.push({
      hd,
      greg: { y: g.getUTCFullYear(), m: gm, d: g.getUTCDate() },
      gregLabel: `${g.getUTCDate()} ${GREGORIAN_MONTHS_AR[gm]}`,
      weekday: g.getUTCDay(),
      holiday: monthHolidays.find((h) => h.hd === hd) ?? null,
    });
  }

  return {
    hm,
    monthName: HIJRI_MONTHS_AR[hm],
    length,
    firstWeekday,
    sacred: isSacredMonth(hm),
    days,
  };
}

/**
 * 构建某伊历年全 12 个月。
 * @param {number} hy 伊历年
 * @param {number} offset 国家偏移
 * @returns {{hy, months}}
 */
export function buildHijriYear(hy, offset = 0) {
  const months = [];
  for (let hm = 1; hm <= 12; hm++) months.push(buildHijriMonth(hy, hm, offset));
  return { hy, months };
}
