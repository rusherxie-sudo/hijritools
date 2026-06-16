import { describe, it, expect } from 'vitest';
import { tafqit, tafqitCurrency } from '../src/lib/tafqit.js';

// 锚点为标准阿拉伯语 تفقيط(تمييز)正确写法,独立来源,禁止用实现反推。
// 连接词「 و」、百用「مئة」、双数作 مضاف 删 نون、数字3-10性别与名词相反。

describe('tafqit — 整数', () => {
  it('个位与零', () => {
    expect(tafqit(0)).toBe('صفر');
    expect(tafqit(2)).toBe('اثنان');
    expect(tafqit(9)).toBe('تسعة');
  });
  it('十几与整十', () => {
    expect(tafqit(11)).toBe('أحد عشر');
    expect(tafqit(20)).toBe('عشرون');
    expect(tafqit(21)).toBe('واحد وعشرون');
    expect(tafqit(99)).toBe('تسعة وتسعون');
  });
  it('百位(مئتان 双数)', () => {
    expect(tafqit(100)).toBe('مئة');
    expect(tafqit(200)).toBe('مئتان');
    expect(tafqit(300)).toBe('ثلاثمئة');
    expect(tafqit(101)).toBe('مئة وواحد');
    expect(tafqit(125)).toBe('مئة وخمسة وعشرون');
  });
  it('千位(2→双数, 3-10→复数 آلاف)', () => {
    expect(tafqit(1000)).toBe('ألف');
    expect(tafqit(2000)).toBe('ألفان');
    expect(tafqit(3000)).toBe('ثلاثة آلاف');
    expect(tafqit(10000)).toBe('عشرة آلاف');
    expect(tafqit(11000)).toBe('أحد عشر ألفًا');
    expect(tafqit(100000)).toBe('مئة ألف');
  });
  it('مضاف 删 نون 与 tail 复数(关键修复)', () => {
    expect(tafqit(200000)).toBe('مئتا ألف');       // مئتان→مئتا
    expect(tafqit(110000)).toBe('مئة وعشرة آلاف');  // tail 10 → 复数
    expect(tafqit(103000)).toBe('مئة وثلاثة آلاف');
  });
  it('百万/十亿', () => {
    expect(tafqit(1000000)).toBe('مليون');
    expect(tafqit(2000000)).toBe('مليونان');
    expect(tafqit(3000000)).toBe('ثلاثة ملايين');
    expect(tafqit(2000000000)).toBe('ملياران');
  });
  it('综合', () => {
    expect(tafqit(1234)).toBe('ألف ومئتان وأربعة وثلاثون');
    expect(tafqit(1234567)).toBe('مليون ومئتان وأربعة وثلاثون ألفًا وخمسمئة وسبعة وستون');
  });
  it('非法输入', () => {
    expect(tafqit('abc')).toBe('');
    expect(tafqit(NaN)).toBe('');
  });
});

describe('tafqitCurrency — 数-名一致(SAR: ريال/هللة)', () => {
  it('整数主币 tail 选形', () => {
    expect(tafqitCurrency(1)).toBe('ريال واحد');             // 单数
    expect(tafqitCurrency(2)).toBe('ريالان');                // 双数
    expect(tafqitCurrency(3)).toBe('ثلاثة ريالات');          // 3-10 复数
    expect(tafqitCurrency(10)).toBe('عشرة ريالات');
    expect(tafqitCurrency(11)).toBe('أحد عشر ريالًا');        // 11-99 宾格
    expect(tafqitCurrency(21)).toBe('واحد وعشرون ريالًا');
    expect(tafqitCurrency(100)).toBe('مئة ريال');            // 整百 属格
    expect(tafqitCurrency(200)).toBe('مئتا ريال');           // مئتان→مئتا
    expect(tafqitCurrency(1000)).toBe('ألف ريال');
    expect(tafqitCurrency(2000)).toBe('ألفا ريال');          // ألفان→ألفا
  });
  it('阴性辅币 هللة(数字3-10去ة)', () => {
    expect(tafqitCurrency(0.25)).toBe('خمس وعشرون هللة');    // 25 阴性 خمس
    expect(tafqitCurrency(0.5)).toBe('خمسون هللة');
    expect(tafqitCurrency(0.03)).toBe('ثلاث هللات');         // 3 阴性 ثلاث + 复数
    expect(tafqitCurrency(0.02)).toBe('هللتان');             // 双数
    expect(tafqitCurrency(0.01)).toBe('هللة واحدة');
    expect(tafqitCurrency(0.567)).toBe('سبع وخمسون هللة');   // 57 阴性 سبع
  });
  it('主+辅币组合', () => {
    expect(tafqitCurrency(1234.5)).toBe('ألف ومئتان وأربعة وثلاثون ريالًا وخمسون هللة');
    expect(tafqitCurrency(1.01)).toBe('ريال واحد وهللة واحدة');
    expect(tafqitCurrency(2.02)).toBe('ريالان وهللتان');
    expect(tafqitCurrency(3.03)).toBe('ثلاثة ريالات وثلاث هللات');
    expect(tafqitCurrency(3.5)).toBe('ثلاثة ريالات وخمسون هللة');
  });
  it('tail==2 复合数(و 紧贴后词)', () => {
    expect(tafqitCurrency(102)).toBe('مئة وريالان');
    expect(tafqitCurrency(1002)).toBe('ألف وريالان');
  });
  it('零金额', () => {
    expect(tafqitCurrency(0)).toBe('صفر ريال');
  });
});

describe('tafqitCurrency — 多币种', () => {
  it('AED(درهم/فلس,/100;均阳性)', () => {
    expect(tafqitCurrency(2, { currency: 'AED' })).toBe('درهمان');
    expect(tafqitCurrency(3, { currency: 'AED' })).toBe('ثلاثة دراهم');
    expect(tafqitCurrency(50, { currency: 'AED' })).toBe('خمسون درهمًا');
    expect(tafqitCurrency(0.05, { currency: 'AED' })).toBe('خمسة فلوس');
    expect(tafqitCurrency(0.5, { currency: 'AED' })).toBe('خمسون فلسًا');
  });
  it('KWD(دينار/فلس,/1000)', () => {
    expect(tafqitCurrency(1.5, { currency: 'KWD' })).toBe('دينار واحد وخمسمئة فلس');
    expect(tafqitCurrency(2, { currency: 'KWD' })).toBe('ديناران');
    expect(tafqitCurrency(0.005, { currency: 'KWD' })).toBe('خمسة فلوس');
  });
  it('OMR(ريال/بيسة 阴性,/1000)', () => {
    expect(tafqitCurrency(0.25, { currency: 'OMR' })).toBe('مئتان وخمسون بيسة');
    expect(tafqitCurrency(2.25, { currency: 'OMR' })).toBe('ريالان ومئتان وخمسون بيسة');
  });
});
