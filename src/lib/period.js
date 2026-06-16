// 月经周期计算核心库。基于末次月经首日（LMP）+ 周期长度。
// 标准方法：下次月经 = LMP + 周期长度；排卵日 = 下次月经 − 14 天（黄体期固定约 14 天）；
// 易孕窗口 = 排卵日 −5 ~ +1 天（精子存活约 5 天 + 卵子存活约 1 天）。
// 纯函数，DOM 无关；日期一律用 ISO 字符串（"YYYY-MM-DD"），经 date-utils 的 UTC 安全函数运算。

import { parseISODate, addDays, toISODate } from './date-utils.js';

const LUTEAL_DAYS = 14; // 黄体期（排卵到下次月经）
const SPERM_DAYS = 5; // 精子存活
const OVUM_DAYS = 1; // 卵子存活

/**
 * 下次月经日期 = 末次月经首日 + 周期长度。
 * @param {string} lastPeriodISO 末次月经第一天 "YYYY-MM-DD"
 * @param {number} cycleLength 月经周期天数（默认 28）
 * @returns {string} 下次月经日期 ISO
 */
export function nextPeriod(lastPeriodISO, cycleLength = 28) {
  const d = parseISODate(lastPeriodISO);
  return toISODate(addDays(d, cycleLength));
}

/**
 * 排卵日 = 下次月经 − 14 天。
 * @param {string} lastPeriodISO 末次月经第一天 ISO
 * @param {number} cycleLength 周期天数（默认 28）
 * @returns {string} 排卵日 ISO
 */
export function ovulationDay(lastPeriodISO, cycleLength = 28) {
  const next = parseISODate(nextPeriod(lastPeriodISO, cycleLength));
  return toISODate(addDays(next, -LUTEAL_DAYS));
}

/**
 * 易孕窗口 = 排卵日前 5 天 ~ 后 1 天。
 * @param {string} lastPeriodISO 末次月经第一天 ISO
 * @param {number} cycleLength 周期天数（默认 28）
 * @returns {{start: string, end: string}} 窗口起止 ISO
 */
export function fertileWindow(lastPeriodISO, cycleLength = 28) {
  const ovu = parseISODate(ovulationDay(lastPeriodISO, cycleLength));
  return {
    start: toISODate(addDays(ovu, -SPERM_DAYS)),
    end: toISODate(addDays(ovu, OVUM_DAYS)),
  };
}

/**
 * 未来 N 次月经日期列表（每次相隔 cycleLength 天）。
 * @param {string} lastPeriodISO 末次月经第一天 ISO
 * @param {number} cycleLength 周期天数（默认 28）
 * @param {number} count 次数（默认 3）
 * @returns {string[]} 未来各次月经日期 ISO，按时间升序
 */
export function futurePeriods(lastPeriodISO, cycleLength = 28, count = 3) {
  const out = [];
  let cur = parseISODate(lastPeriodISO);
  for (let i = 0; i < count; i++) {
    cur = addDays(cur, cycleLength);
    out.push(toISODate(cur));
  }
  return out;
}
