// 排卵日计算核心库。基于末次月经（LMP）+ 周期长度。
// 标准方法：下次月经 = LMP + 周期长度；排卵日 = 下次月经 - 14 天（黄体期固定约 14 天）；
// 易孕窗口 = 排卵日 -5 ~ +1 天（精子存活约 5 天 + 卵子存活约 1 天）。纯函数。

import { startOfUtcDay, addDays, diffInDays } from './date-utils.js';
import { gregorianToHijri } from './hijri.js';

const LUTEAL_DAYS = 14;   // 黄体期（排卵到下次月经）
const SPERM_DAYS = 5;     // 精子存活
const OVUM_DAYS = 1;      // 卵子存活

/**
 * 由末次月经首日 + 周期长度计算排卵信息。
 * @param {Date} lmpDate 末次月经第一天
 * @param {number} cycleLength 月经周期天数（默认 28）
 * @param {number} offset 伊历国家偏移
 */
export function ovulationFromLMP(lmpDate, cycleLength = 28, offset = 0) {
  const lmp = startOfUtcDay(lmpDate);
  const nextPeriod = addDays(lmp, cycleLength);
  const ovulationDay = addDays(nextPeriod, -LUTEAL_DAYS);
  const fertileStart = addDays(ovulationDay, -SPERM_DAYS);
  const fertileEnd = addDays(ovulationDay, OVUM_DAYS);

  return {
    lmp,
    cycleLength,
    nextPeriod,
    ovulationDay,
    fertileStart,
    fertileEnd,
    fertileDays: diffInDays(fertileStart, fertileEnd) + 1,
    ovulationHijri: gregorianToHijri(ovulationDay, offset),
  };
}
