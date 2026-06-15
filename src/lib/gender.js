// 清宫图性别「预测」纯函数（娱乐用途）。查 data/gender-chart.js 表。
import { GENDER_CHART, AGE_MIN, AGE_MAX } from '../data/gender-chart.js';

/**
 * 按母亲年龄 + 受孕（农历/伊历）月份查清宫图。
 * @param {number} motherAge 母亲年龄 18–45
 * @param {number} lunarMonth 受孕月份 1–12
 * @returns {'male'|'female'}
 */
export function predictGender(motherAge, lunarMonth) {
  if (!Number.isInteger(motherAge) || motherAge < AGE_MIN || motherAge > AGE_MAX) {
    throw new RangeError(`年龄需在 ${AGE_MIN}–${AGE_MAX} 之间`);
  }
  if (!Number.isInteger(lunarMonth) || lunarMonth < 1 || lunarMonth > 12) {
    throw new RangeError('月份需在 1–12 之间');
  }
  return GENDER_CHART[motherAge][lunarMonth - 1] === 'B' ? 'male' : 'female';
}
