// 中国生肖查询纯函数（娱乐用途）。按公历出生年返回生肖。
import { CHINESE_ZODIAC, ZODIAC_YEAR_OFFSET } from '../data/chinese-zodiac.js';

/**
 * 按公历出生年返回生肖索引 0–11（0=鼠）。
 * @param {number} year 公历年份
 */
function zodiacIndex(year) {
  if (!Number.isInteger(year)) throw new RangeError('年份必须为整数');
  return (((year - ZODIAC_YEAR_OFFSET) % 12) + 12) % 12;
}

/** 按公历出生年返回生肖 key。 */
export function chineseZodiac(year) {
  return CHINESE_ZODIAC[zodiacIndex(year)].key;
}

/** 按公历出生年返回生肖完整信息对象。 */
export function chineseZodiacInfo(year) {
  return CHINESE_ZODIAC[zodiacIndex(year)];
}
