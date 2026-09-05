import { describe, it, expect } from 'vitest';
import { chineseZodiac, chineseZodiacInfo } from '../src/lib/chinese-zodiac.js';
import { CHINESE_ZODIAC } from '../src/data/chinese-zodiac.js';

describe('中国生肖（娱乐）', () => {
  it('数据表含 12 生肖，每个有 key/阿语名/emoji/特质', () => {
    expect(CHINESE_ZODIAC.length).toBe(12);
    for (const z of CHINESE_ZODIAC) {
      expect(z.key).toBeTruthy();
      expect(z.nameAr).toBeTruthy();
      expect(z.emoji).toBeTruthy();
      expect(z.trait).toBeTruthy();
    }
  });

  it('已知年份锚点正确', () => {
    expect(chineseZodiac(2020)).toBe('rat');    // 2020 = 鼠年
    expect(chineseZodiac(2021)).toBe('ox');      // 2021 = 牛年
    expect(chineseZodiac(2024)).toBe('dragon');  // 2024 = 龙年
    expect(chineseZodiac(2008)).toBe('rat');     // 2008 = 鼠年
  });

  it('循环每 12 年重复', () => {
    expect(chineseZodiac(2020)).toBe(chineseZodiac(2032));
    expect(chineseZodiac(2020)).toBe(chineseZodiac(2008));
  });

  it('处理更早年份（无负索引）', () => {
    expect(chineseZodiac(1900)).toBe('rat');  // 1900 = 庚子鼠年
    expect(chineseZodiac(1948)).toBe('rat');
  });

  it('chineseZodiacInfo 返回完整信息', () => {
    const info = chineseZodiacInfo(2024);
    expect(info.key).toBe('dragon');
    expect(info.nameAr).toBe('التنين');
  });

  it('非整数年份抛 RangeError', () => {
    expect(() => chineseZodiac(2020.5)).toThrow(RangeError);
  });
});
