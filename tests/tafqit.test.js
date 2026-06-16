import { describe, it, expect } from 'vitest';
import { tafqit, tafqitCurrency } from '../src/lib/tafqit.js';

// 锚点为标准阿拉伯语 تفقيط 写法（个位阳性基式、双数、3–10 复数变体、百/千/مليون 级联）。
// 这些是独立来源的正确写法，禁止用实现反推。连接词用「 و」，百用「مئة」。

describe('tafqit — 整数转阿拉伯文字（独立锚点）', () => {
  it('个位与零', () => {
    expect(tafqit(0)).toBe('صفر');
    expect(tafqit(1)).toBe('واحد');
    expect(tafqit(2)).toBe('اثنان');
    expect(tafqit(3)).toBe('ثلاثة');
    expect(tafqit(4)).toBe('أربعة');
    expect(tafqit(5)).toBe('خمسة');
    expect(tafqit(6)).toBe('ستة');
    expect(tafqit(7)).toBe('سبعة');
    expect(tafqit(8)).toBe('ثمانية');
    expect(tafqit(9)).toBe('تسعة');
  });

  it('十与十几', () => {
    expect(tafqit(10)).toBe('عشرة');
    expect(tafqit(11)).toBe('أحد عشر');
    expect(tafqit(12)).toBe('اثنا عشر');
    expect(tafqit(13)).toBe('ثلاثة عشر');
    expect(tafqit(19)).toBe('تسعة عشر');
  });

  it('整十', () => {
    expect(tafqit(20)).toBe('عشرون');
    expect(tafqit(30)).toBe('ثلاثون');
    expect(tafqit(40)).toBe('أربعون');
    expect(tafqit(90)).toBe('تسعون');
  });

  it('个位 و 十位（顺序：个位在前）', () => {
    expect(tafqit(21)).toBe('واحد وعشرون');
    expect(tafqit(35)).toBe('خمسة وثلاثون');
    expect(tafqit(99)).toBe('تسعة وتسعون');
  });

  it('百位', () => {
    expect(tafqit(100)).toBe('مئة');
    expect(tafqit(200)).toBe('مئتان');
    expect(tafqit(300)).toBe('ثلاثمئة');
    expect(tafqit(500)).toBe('خمسمئة');
    expect(tafqit(900)).toBe('تسعمئة');
  });

  it('百位 و 余数', () => {
    expect(tafqit(101)).toBe('مئة وواحد');
    expect(tafqit(110)).toBe('مئة وعشرة');
    expect(tafqit(125)).toBe('مئة وخمسة وعشرون');
    expect(tafqit(999)).toBe('تسعمئة وتسعة وتسعون');
  });

  it('千位（2 与 3–10 变体）', () => {
    expect(tafqit(1000)).toBe('ألف');
    expect(tafqit(2000)).toBe('ألفان');
    expect(tafqit(3000)).toBe('ثلاثة آلاف');
    expect(tafqit(10000)).toBe('عشرة آلاف');
    expect(tafqit(11000)).toBe('أحد عشر ألفًا');
    expect(tafqit(100000)).toBe('مئة ألف');
  });

  it('千 و 余数（综合锚点）', () => {
    expect(tafqit(1234)).toBe('ألف ومئتان وأربعة وثلاثون');
    expect(tafqit(2026)).toBe('ألفان وستة وعشرون');
  });

  it('百万与十亿（2 与 3–10 变体）', () => {
    expect(tafqit(1000000)).toBe('مليون');
    expect(tafqit(2000000)).toBe('مليونان');
    expect(tafqit(3000000)).toBe('ثلاثة ملايين');
    expect(tafqit(1000000000)).toBe('مليار');
    expect(tafqit(2000000000)).toBe('ملياران');
    expect(tafqit(3000000000)).toBe('ثلاثة مليارات');
  });

  it('大数综合', () => {
    expect(tafqit(1000001)).toBe('مليون وواحد');
    expect(tafqit(1234567)).toBe('مليون ومئتان وأربعة وثلاثون ألفًا وخمسمئة وسبعة وستون');
  });

  it('字符串与小数输入按整数部分处理', () => {
    expect(tafqit('100')).toBe('مئة');
    expect(tafqit(100.0)).toBe('مئة');
  });
});

describe('tafqitCurrency — 货币与小数文字', () => {
  it('整数金额（默认 ريال/هللة）', () => {
    expect(tafqitCurrency(1000)).toBe('ألف ريال');
    expect(tafqitCurrency(1)).toBe('واحد ريال');
  });

  it('含小数（هللة）综合锚点', () => {
    expect(tafqitCurrency(1234.5)).toBe('ألف ومئتان وأربعة وثلاثون ريالًا وخمسون هللة');
  });

  it('小数四舍五入到两位', () => {
    // 0.567 → 57 هللة
    expect(tafqitCurrency(0.567)).toBe('سبعة وخمسون هللة');
  });

  it('零金额', () => {
    expect(tafqitCurrency(0)).toBe('صفر ريال');
  });

  it('可自定义货币名（درهم/فلس，divisor=1000）', () => {
    expect(tafqitCurrency(50, { currencyName: 'درهم', subName: 'فلس', subDivisor: 1000 }))
      .toBe('خمسون درهم');
    expect(tafqitCurrency(50.25, { currencyName: 'درهم', subName: 'فلس', subDivisor: 1000 }))
      .toBe('خمسون درهمًا ومئتان وخمسون فلسًا');
  });

  it('只有小数无整数部分', () => {
    expect(tafqitCurrency(0.5)).toBe('خمسون هللة');
  });
});
