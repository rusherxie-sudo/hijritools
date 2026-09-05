// 星座查询纯函数（娱乐用途）。按公历月/日查西方十二星座。
import { ZODIAC, ZODIAC_BOUNDARIES } from '../data/zodiac.js';

/**
 * 按公历月、日返回星座 key。
 * 规则：某月内 day >= 该月新星座起始日 → 新星座；否则 → 上一个月的星座（1 月回绕到 12 月的摩羯）。
 * @param {number} month 1–12
 * @param {number} day 1–31
 * @returns {string} 星座 key（ZODIAC 的键）
 */
export function zodiacSign(month, day) {
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new RangeError('月份需在 1–12 之间');
  }
  if (!Number.isInteger(day) || day < 1 || day > 31) {
    throw new RangeError('日期需在 1–31 之间');
  }
  const i = month - 1;
  const [, startDay, sign] = ZODIAC_BOUNDARIES[i];
  if (day >= startDay) return sign;
  // 未到本月新星座起始日 → 上一个月的星座（回绕）
  return ZODIAC_BOUNDARIES[(i + 11) % 12][2];
}

/** 取星座完整信息对象。 */
export function zodiacInfo(month, day) {
  const key = zodiacSign(month, day);
  return { key, ...ZODIAC[key] };
}
