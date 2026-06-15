// 伊历（乌姆库拉历 Umm al-Qura）换算核心库。沙特官方历法，全球采用最广。
// 依赖 @umalqura/core（KACST 乌姆库拉数据）。纯函数封装，不依赖 DOM。
//
// 多国偏移：不同国家因月相目击差异，伊历日期相对乌姆库拉历有 ±1/±2 天偏移。
// 约定 offset = 「换算前对公历日期增加的天数」。offset=+1 表示该国比沙特官历快 1 天。
// 该定义在跨月/跨年边界自动正确，且 g→h→g 往返在同一 offset 下守恒。

import umalquraModule from '@umalqura/core';
import { utcDate, startOfUtcDay, addDays } from './date-utils.js';

// 兼容 CJS/ESM 互操作：实际函数可能位于 default.default。
const umalqura =
  typeof umalquraModule === 'function'
    ? umalquraModule
    : umalquraModule.default;

// 乌姆库拉历月份名（标准伊斯兰月名，阿拉伯语）。索引 1-12。
export const HIJRI_MONTHS_AR = [
  '', 'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة',
  'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة',
];

// 公历月份名（海湾/沙特用法，非黎凡特用法）。索引 1-12。
export const GREGORIAN_MONTHS_AR = [
  '', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

// 星期名（阿拉伯语，周日起）。索引对应 Date.getUTCDay() 0=周日..6=周六。
// "الاثنين" 用همزة وصل（标准正字法），非 "الإثنين"。
export const WEEKDAYS_AR = [
  'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت',
];

// 乌姆库拉历支持范围（@umalqura/core 约 1356–1500 AH ≈ 公历 1937–2076）。
export const MIN_GREGORIAN_YEAR = 1937;
export const MAX_GREGORIAN_YEAR = 2076;

// 四大圣月（الأشهر الحرم）：محرم(1)、رجب(7)、ذو القعدة(11)、ذو الحجة(12)。
export const SACRED_MONTHS = [1, 7, 11, 12];

/** 判断伊历月号是否为圣月（الأشهر الحرم）。 */
export function isSacredMonth(hm) {
  return SACRED_MONTHS.includes(hm);
}

function assertSupported(date) {
  const y = date.getUTCFullYear();
  if (y < MIN_GREGORIAN_YEAR || y > MAX_GREGORIAN_YEAR) {
    throw new RangeError(
      `公历年份 ${y} 超出乌姆库拉历支持范围（${MIN_GREGORIAN_YEAR}–${MAX_GREGORIAN_YEAR}）`
    );
  }
}

// @umalqura/core 内部按「本地时区」工作：读取传入 Date 的本地分量，
// 并以本地午夜返回 .date。为消除时区依赖，我们全程只经由整数 y/m/d 交换：
// 进：把规范化的 UTC 分量重建为本地 Date 喂给库；出：读库返回 Date 的本地分量再建 UTC 日期。

/** 规范 UTC 日期 → umalqura 对象（按整数分量交换，时区无关）。 */
function uqFromGregorian(date) {
  const local = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return umalqura(local);
}

/** umalqura 对象的公历 .date（本地午夜）→ 规范 UTC 日期（按整数分量交换）。 */
function uqDateToUtc(u) {
  const ld = u.date;
  return utcDate(ld.getFullYear(), ld.getMonth() + 1, ld.getDate());
}

/**
 * 公历 → 伊历（乌姆库拉历）。
 * @param {Date} date 公历日期
 * @param {number} offset 国家偏移天数（默认 0 = 沙特官历）
 * @returns {{hy:number, hm:number, hd:number, weekday:number, monthName:string}}
 */
export function gregorianToHijri(date, offset = 0) {
  const shifted = addDays(date, offset);
  assertSupported(shifted);
  const u = uqFromGregorian(shifted);
  return {
    hy: u.hy,
    hm: u.hm,
    hd: u.hd,
    weekday: startOfUtcDay(date).getUTCDay(),
    monthName: HIJRI_MONTHS_AR[u.hm],
  };
}

/**
 * 伊历（乌姆库拉历）→ 公历。
 * @param {number} hy 伊历年
 * @param {number} hm 伊历月 1-12
 * @param {number} hd 伊历日
 * @param {number} offset 国家偏移天数（默认 0）
 * @returns {Date} 公历日期（00:00 UTC）
 */
export function hijriToGregorian(hy, hm, hd, offset = 0) {
  let u;
  try {
    u = umalqura(hy, hm, hd);
  } catch (e) {
    // 底层库越界抛通用 Error；统一转成 RangeError，便于调用方一致捕获
    throw new RangeError(`伊历日期超出支持范围：${hy}-${hm}-${hd}`);
  }
  return addDays(uqDateToUtc(u), -offset);
}

/**
 * 某伊历月的天数（29 或 30）。
 * @param {number} hy 伊历年
 * @param {number} hm 伊历月 1-12
 * @returns {number}
 */
export function hijriMonthLength(hy, hm) {
  const first = hijriToGregorian(hy, hm, 1);
  const nextY = hm === 12 ? hy + 1 : hy;
  const nextM = hm === 12 ? 1 : hm + 1;
  const firstNext = hijriToGregorian(nextY, nextM, 1);
  const ms = firstNext.getTime() - first.getTime();
  return Math.round(ms / 86400000);
}

/** 今日伊历（基于传入「今天」的公历日期，便于测试注入）。 */
export function todayHijri(today, offset = 0) {
  return gregorianToHijri(today, offset);
}

/**
 * 格式化伊历日期为阿拉伯语长格式，如「28 ذو الحجة 1447 هـ」。
 * @param {{hy:number,hm:number,hd:number}} h
 */
export function formatHijri(h) {
  return `${h.hd} ${HIJRI_MONTHS_AR[h.hm]} ${h.hy} هـ`;
}

/**
 * 格式化公历日期为阿拉伯语长格式，如「14 يونيو 2026 م」。
 * @param {Date} date
 */
export function formatGregorian(date) {
  const d = startOfUtcDay(date);
  return `${d.getUTCDate()} ${GREGORIAN_MONTHS_AR[d.getUTCMonth() + 1]} ${d.getUTCFullYear()} م`;
}

// 重新导出便于页面使用。
export { utcDate };
