import { describe, it, expect } from 'vitest';
import { flipCoin, rollDice } from '../src/lib/coin-dice.js';

describe('抛硬币掷骰子', () => {
  it('flipCoin 用注入 rng 确定性', () => {
    expect(flipCoin(() => 0)).toBe('heads');
    expect(flipCoin(() => 0.49)).toBe('heads');
    expect(flipCoin(() => 0.5)).toBe('tails');
    expect(flipCoin(() => 0.99)).toBe('tails');
  });

  it('rollDice 返回正确长度与点数', () => {
    expect(rollDice(3, 6, () => 0)).toEqual([1, 1, 1]);
    expect(rollDice(1, 6, () => 0.99)).toEqual([6]);
    expect(rollDice(2, 6, () => 0.5)).toEqual([4, 4]);
  });

  it('rollDice 点数始终在 1..sides 范围内', () => {
    const rolls = rollDice(50, 6);
    for (const r of rolls) {
      expect(r).toBeGreaterThanOrEqual(1);
      expect(r).toBeLessThanOrEqual(6);
    }
  });

  it('rollDice 非法参数抛 RangeError', () => {
    expect(() => rollDice(0)).toThrow(RangeError);
    expect(() => rollDice(1, 1)).toThrow(RangeError);
  });
});
