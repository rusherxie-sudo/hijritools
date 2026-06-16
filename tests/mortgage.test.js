import { describe, it, expect } from 'vitest';
import { monthlyPayment, totalPayment, totalProfit } from '../src/lib/mortgage.js';

describe('房贷/融资计算（等额本息）', () => {
  it('月供：500000 / 5% / 20 年 ≈ 3299.78', () => {
    expect(monthlyPayment(500000, 5, 20)).toBeCloseTo(3299.78, 1);
  });

  it('零利率：本金均摊到月数 100000 / 0% / 10 年 = 833.33', () => {
    expect(monthlyPayment(100000, 0, 10)).toBe(833.33);
  });

  it('总还款额：500000 / 5% / 20 年 ≈ 791947', () => {
    expect(totalPayment(500000, 5, 20)).toBeCloseTo(791946.89, 0);
  });

  it('总利润（总还款额 − 本金）≈ 291947', () => {
    expect(totalProfit(500000, 5, 20)).toBeCloseTo(291946.89, 0);
  });

  it('结果保留 2 位小数', () => {
    const m = monthlyPayment(500000, 5, 20);
    expect(Number.isInteger(m * 100)).toBe(true);
  });
});
