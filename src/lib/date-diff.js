// 两个日期之间的差值计算。输出总天数、周+天、以及日历式 年/月/天。纯函数。

import { startOfUtcDay, diffInDays, calendarDelta } from './date-utils.js';

/**
 * 计算两日期之差。
 * @param {Date} a 起始日期
 * @param {Date} b 结束日期
 * @param {boolean} inclusive 是否把结束日也计入（true 则天数 +1）
 * @returns {{totalDays, totalWeeks, remainderDays, years, months, days, reversed}}
 */
export function dateDifference(a, b, inclusive = false) {
  let start = startOfUtcDay(a);
  let end = startOfUtcDay(b);
  const reversed = end.getTime() < start.getTime();
  if (reversed) [start, end] = [end, start];

  let totalDays = diffInDays(start, end);
  if (inclusive) totalDays += 1;

  const { years, months, days } = calendarDelta(start, end);

  return {
    totalDays,
    totalWeeks: Math.floor(totalDays / 7),
    remainderDays: totalDays % 7,
    years,
    months,
    days,
    reversed,
  };
}
