import { describe, it, expect } from 'vitest';
import {
  percentOf, whatPercent, percentChange, increaseByPercent, decreaseByPercent,
} from '../src/lib/percentage.js';

describe('百分比计算', () => {
  it('Y 的 X%', () => {
    expect(percentOf(15, 200)).toBe(30);
  });
  it('part 占 total 的百分比', () => {
    expect(whatPercent(30, 200)).toBe(15);
  });
  it('total 为 0 时返回 0，不报错', () => {
    expect(whatPercent(5, 0)).toBe(0);
  });
  it('百分比增长', () => {
    expect(percentChange(200, 250)).toBe(25);
  });
  it('百分比下降为负', () => {
    expect(percentChange(200, 150)).toBe(-25);
  });
  it('增加百分比', () => {
    expect(increaseByPercent(200, 15)).toBe(230);
  });
  it('减少百分比', () => {
    expect(decreaseByPercent(200, 15)).toBe(170);
  });
});
