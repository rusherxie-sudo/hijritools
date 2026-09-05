import { describe, it, expect } from 'vitest';
import {
  futureValue,
  monthlyContributionRequired,
  retirementMonthlyIncome,
  yearsToRetirement,
} from '../src/lib/retirement.js';

describe('退休储蓄计算', () => {
  it('未来值：每月存 1000，年收益 5%，10 年 ≈ 155282', () => {
    expect(futureValue(1000, 5, 10)).toBeCloseTo(155282.28, 0);
  });

  it('未来值：零收益 = 每月存入 × 总月数', () => {
    expect(futureValue(1000, 0, 10)).toBe(120000);
  });

  it('未来值：0 年 = 0', () => {
    expect(futureValue(1000, 5, 0)).toBe(0);
  });

  it('未来值：0 每月存入 = 0', () => {
    expect(futureValue(0, 5, 10)).toBe(0);
  });

  it('每月需存：目标 100000，年收益 5%，10 年 ≈ 644', () => {
    expect(monthlyContributionRequired(100000, 5, 10)).toBeCloseTo(643.99, 0);
  });

  it('每月需存：零收益 = 目标 / 总月数', () => {
    expect(monthlyContributionRequired(120000, 0, 10)).toBe(1000);
  });

  it('退休后月收入（4% 提取规则）：500000 本金 ≈ 1667', () => {
    expect(retirementMonthlyIncome(500000)).toBeCloseTo(1666.67, 0);
  });

  it('退休后月收入：自定义提取率 3%', () => {
    expect(retirementMonthlyIncome(500000, 3)).toBeCloseTo(1250, 0);
  });

  it('距离退休年数：当前 30 岁，退休 60 岁 = 30 年', () => {
    expect(yearsToRetirement(30, 60)).toBe(30);
  });

  it('距离退休年数：已过退休年龄 = 0', () => {
    expect(yearsToRetirement(65, 60)).toBe(0);
  });

  it('结果保留 2 位小数', () => {
    const fv = futureValue(1000, 5, 10);
    expect(Number.isInteger(fv * 100)).toBe(true);
  });
});
