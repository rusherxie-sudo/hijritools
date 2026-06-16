import { describe, it, expect } from 'vitest';
import { priceAfterDiscount, savedAmount, discountRate } from '../src/lib/discount.js';

describe('折扣计算', () => {
  // 锚点（独立手算）
  it('200 打 15% 折后价 = 170', () => {
    expect(priceAfterDiscount(200, 15)).toBe(170);
  });
  it('200 打 15% 省下 = 30', () => {
    expect(savedAmount(200, 15)).toBe(30);
  });
  it('原价 200 → 售价 170，折扣率 = 15%', () => {
    expect(discountRate(200, 170)).toBe(15);
  });
  it('99.99 打 20% 折后价 = 79.99（容差）', () => {
    expect(priceAfterDiscount(99.99, 20)).toBeCloseTo(79.99, 2);
  });

  // 边界与非法输入
  it('0% 折扣，折后价等于原价', () => {
    expect(priceAfterDiscount(200, 0)).toBe(200);
    expect(savedAmount(200, 0)).toBe(0);
  });
  it('100% 折扣，折后价为 0，全额省下', () => {
    expect(priceAfterDiscount(200, 100)).toBe(0);
    expect(savedAmount(200, 100)).toBe(200);
  });
  it('抑制浮点噪声', () => {
    // 0.1 + 0.2 类噪声场景：1.1 打 10% 应得 0.99 而非 0.9900000001
    expect(priceAfterDiscount(1.1, 10)).toBe(0.99);
  });
  it('折扣率：原价为 0 时返回 null（除零）', () => {
    expect(discountRate(0, 0)).toBeNull();
  });
  it('折扣率：售价高于原价为负（涨价）', () => {
    expect(discountRate(100, 120)).toBe(-20);
  });
  it('非数值输入返回 null', () => {
    expect(priceAfterDiscount(NaN, 15)).toBeNull();
    expect(priceAfterDiscount(200, NaN)).toBeNull();
    expect(savedAmount(NaN, 15)).toBeNull();
    expect(discountRate(200, NaN)).toBeNull();
    expect(priceAfterDiscount('abc', 15)).toBeNull();
  });
});
