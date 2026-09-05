import { describe, it, expect } from 'vitest';
import { netSalary, grossFromNet, annualSalary, dailySalary, hourlySalary } from '../src/lib/salary.js';

describe('薪资/净工资计算', () => {
  it('netSalary: 总工资 10000，扣 10% 社保 = 净 9000', () => {
    const r = netSalary(10000, [{ name: '社保', percent: 10 }]);
    expect(r.gross).toBe(10000);
    expect(r.totalDeduction).toBe(1000);
    expect(r.net).toBe(9000);
    expect(r.breakdown[0].amount).toBe(1000);
  });

  it('netSalary: 多项扣除', () => {
    const r = netSalary(10000, [
      { name: '社保', percent: 10 },
      { name: '个税', percent: 5 },
    ]);
    expect(r.totalDeduction).toBe(1500);
    expect(r.net).toBe(8500);
    expect(r.breakdown.length).toBe(2);
  });

  it('netSalary: 无扣除 = 总=净', () => {
    const r = netSalary(10000, []);
    expect(r.net).toBe(10000);
    expect(r.totalDeduction).toBe(0);
  });

  it('grossFromNet: 净 9000，扣 10% = 总 10000', () => {
    const r = grossFromNet(9000, [{ name: '社保', percent: 10 }]);
    expect(r.gross).toBeCloseTo(10000, 0);
    expect(r.net).toBe(9000);
  });

  it('annualSalary: 月 10000 = 年 120000', () => {
    expect(annualSalary(10000)).toBe(120000);
  });

  it('dailySalary: 月 10000，22天工作日 ≈ 454.55', () => {
    expect(dailySalary(10000, 22)).toBeCloseTo(454.55, 1);
  });

  it('hourlySalary: 月 10000，176小时 ≈ 56.82', () => {
    expect(hourlySalary(10000, 176)).toBeCloseTo(56.82, 1);
  });

  it('结果保留 2 位小数', () => {
    const r = netSalary(10000, [{ name: '税', percent: 3.5 }]);
    expect(Number.isInteger(r.net * 100)).toBe(true);
  });
});
