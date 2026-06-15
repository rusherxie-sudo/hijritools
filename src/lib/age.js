// 年龄计算核心库。差异化重点：公历 + 伊历「双历法年龄」并列输出、
// 任意「截止到某日」基准、公历与伊历「下次生日倒计时」。纯函数，不依赖 DOM。

import { startOfUtcDay, addDays, diffInDays, calendarDelta, utcDate, isGregorianLeapYear } from './date-utils.js';
import { gregorianToHijri, hijriToGregorian, hijriMonthLength, WEEKDAYS_AR } from './hijri.js';

/** 伊历两日期之间的 {years,months,days}（借位用乌姆库拉月长度）。end>=start。 */
function hijriDelta(birthH, asOfH) {
  let years = asOfH.hy - birthH.hy;
  let months = asOfH.hm - birthH.hm;
  let days = asOfH.hd - birthH.hd;
  if (days < 0) {
    months -= 1;
    // 借「asOf 月的前一个伊历月」的天数
    const by = asOfH.hm === 1 ? asOfH.hy - 1 : asOfH.hy;
    const bm = asOfH.hm === 1 ? 12 : asOfH.hm - 1;
    days += hijriMonthLength(by, bm);
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years: Math.max(0, years), months: Math.max(0, months), days: Math.max(0, days) };
}

/** 求 asOf（含）当天或之后、最近一次 (month, day) 的公历日期。处理 2/29。 */
function nextGregorianOccurrence(month, day, asOf) {
  const asOfDay = startOfUtcDay(asOf);
  let year = asOfDay.getUTCFullYear();
  const build = (y) => {
    if (month === 2 && day === 29 && !isGregorianLeapYear(y)) {
      return utcDate(y, 3, 1); // 平年闰日生日按 3/1
    }
    return utcDate(y, month, day);
  };
  let candidate = build(year);
  if (candidate.getTime() < asOfDay.getTime()) candidate = build(year + 1);
  return candidate;
}

/** 求 asOf（含）当天或之后、最近一次伊历 (hm,hd) 的公历日期。 */
function nextHijriOccurrence(hm, hd, asOf, offset) {
  const asOfDay = startOfUtcDay(asOf);
  const asOfH = gregorianToHijri(asOfDay, offset);
  let year = asOfH.hy;
  const build = (hy) => {
    const len = hijriMonthLength(hy, hm);
    const d = Math.min(hd, len); // 该年此月不足时取月末
    return hijriToGregorian(hy, hm, d, offset);
  };
  let candidate = build(year);
  if (candidate.getTime() < asOfDay.getTime()) candidate = build(year + 1);
  return candidate;
}

/**
 * 计算年龄（双历法 + 下次生日）。
 * @param {Date} birthDate 出生公历日期
 * @param {Date} asOfDate 截止日（默认调用方传入「今天」）
 * @param {number} offset 伊历国家偏移
 */
export function computeAge(birthDate, asOfDate, offset = 0) {
  const birth = startOfUtcDay(birthDate);
  const asOf = startOfUtcDay(asOfDate);
  if (asOf.getTime() < birth.getTime()) {
    throw new RangeError('截止日期不能早于出生日期');
  }

  const totalDays = diffInDays(birth, asOf);
  const gregorian = calendarDelta(birth, asOf);

  const birthH = gregorianToHijri(birth, offset);
  const asOfH = gregorianToHijri(asOf, offset);
  const hijri = hijriDelta(birthH, asOfH);

  const nextGregBday = nextGregorianOccurrence(birth.getUTCMonth() + 1, birth.getUTCDate(), asOf);
  const nextHijriBday = nextHijriOccurrence(birthH.hm, birthH.hd, asOf, offset);

  return {
    totalDays,
    totalWeeks: Math.floor(totalDays / 7),
    totalMonths: gregorian.years * 12 + gregorian.months,
    totalHours: totalDays * 24,
    totalMinutes: totalDays * 24 * 60,
    gregorian, // {years, months, days}
    hijri, // {years, months, days}（伊历岁数，约每 33 年比公历多 1 岁）
    birthWeekday: WEEKDAYS_AR[birth.getUTCDay()],
    nextGregorianBirthday: {
      date: nextGregBday,
      daysUntil: diffInDays(asOf, nextGregBday),
    },
    nextHijriBirthday: {
      date: nextHijriBday,
      daysUntil: diffInDays(asOf, nextHijriBday),
    },
  };
}

/**
 * 两人年龄差（谁更大、相差 Y/M/D）。
 * @returns {{olderIsFirst:boolean, delta:{years,months,days}, totalDays:number}}
 */
export function ageDifference(dateA, dateB) {
  const a = startOfUtcDay(dateA);
  const b = startOfUtcDay(dateB);
  const olderIsFirst = a.getTime() <= b.getTime();
  const [older, younger] = olderIsFirst ? [a, b] : [b, a];
  return {
    olderIsFirst,
    delta: calendarDelta(older, younger),
    totalDays: diffInDays(older, younger),
  };
}
