// 孕期计算核心库。基于末次月经（LMP）的 Naegele 法则：预产期 = LMP + 280 天。
// 差异化：同时输出预产期的「伊历日期」。纯函数。

import { startOfUtcDay, addDays, diffInDays } from './date-utils.js';
import { gregorianToHijri } from './hijri.js';

const GESTATION_DAYS = 280; // 40 周

/**
 * 由末次月经首日计算孕期信息。
 * @param {Date} lmpDate 末次月经第一天
 * @param {Date} asOfDate 截止日（默认今天）
 * @param {number} offset 伊历国家偏移
 */
export function pregnancyFromLMP(lmpDate, asOfDate, offset = 0) {
  const lmp = startOfUtcDay(lmpDate);
  const asOf = startOfUtcDay(asOfDate);

  const dueDate = addDays(lmp, GESTATION_DAYS);
  const conception = addDays(lmp, 14); // 估计受孕日

  const daysElapsed = Math.max(0, diffInDays(lmp, asOf));
  const gestWeeks = Math.floor(daysElapsed / 7);
  const gestDays = daysElapsed % 7;

  // 孕周分期：1-13 周一孕期，14-27 二孕期，28+ 三孕期
  let trimester = 1;
  if (gestWeeks >= 28) trimester = 3;
  else if (gestWeeks >= 14) trimester = 2;

  const daysRemaining = diffInDays(asOf, dueDate); // 可为负（已过预产期）
  const progressPercent = Math.min(100, Math.max(0, (daysElapsed / GESTATION_DAYS) * 100));

  return {
    dueDate,
    dueDateHijri: gregorianToHijri(dueDate, offset),
    conception,
    gestationalAge: { weeks: gestWeeks, days: gestDays },
    trimester,
    daysRemaining,
    progressPercent,
  };
}
