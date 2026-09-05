import { describe, it, expect } from 'vitest';
import { zodiacSign, zodiacInfo } from '../src/lib/zodiac.js';
import { ZODIAC } from '../src/data/zodiac.js';

describe('星座查询（娱乐）', () => {
  it('数据表含 12 个星座，每个有阿语名/符号/范围/特质', () => {
    const keys = Object.keys(ZODIAC);
    expect(keys.length).toBe(12);
    for (const k of keys) {
      expect(ZODIAC[k].nameAr).toBeTruthy();
      expect(ZODIAC[k].emoji).toBeTruthy();
      expect(ZODIAC[k].rangeAr).toBeTruthy();
      expect(ZODIAC[k].trait).toBeTruthy();
    }
  });

  it('边界日：起始日当天归新星座，前一天归旧星座', () => {
    expect(zodiacSign(3, 21)).toBe('aries');   // 白羊起点
    expect(zodiacSign(3, 20)).toBe('pisces');  // 前一天仍双鱼
    expect(zodiacSign(7, 23)).toBe('leo');      // 狮子起点
    expect(zodiacSign(7, 22)).toBe('cancer');   // 前一天仍巨蟹
  });

  it('1 月上旬回绕到摩羯（跨年）', () => {
    expect(zodiacSign(1, 1)).toBe('capricorn');
    expect(zodiacSign(1, 19)).toBe('capricorn');
    expect(zodiacSign(1, 20)).toBe('aquarius');
  });

  it('12 月下旬为摩羯', () => {
    expect(zodiacSign(12, 22)).toBe('capricorn');
    expect(zodiacSign(12, 21)).toBe('sagittarius');
  });

  it('zodiacInfo 返回带 key 的完整信息', () => {
    const info = zodiacInfo(5, 1); // 5/1 = 金牛
    expect(info.key).toBe('taurus');
    expect(info.nameAr).toBe('الثور');
  });

  it('越界抛 RangeError', () => {
    expect(() => zodiacSign(0, 5)).toThrow(RangeError);
    expect(() => zodiacSign(13, 5)).toThrow(RangeError);
    expect(() => zodiacSign(5, 0)).toThrow(RangeError);
    expect(() => zodiacSign(5, 32)).toThrow(RangeError);
  });
});
