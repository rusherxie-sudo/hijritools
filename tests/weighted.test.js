import { describe, it, expect } from 'vitest';
import { weightedAverage } from '../src/lib/weighted.js';

describe('加权平均（大学录取加权百分比）', () => {
  it('权重和为 100 的标准情形', () => {
    // 90×30 + 80×40 + 70×30 = 2700 + 3200 + 2100 = 8000；/100 = 80
    expect(weightedAverage([
      { score: 90, weight: 30 },
      { score: 80, weight: 40 },
      { score: 70, weight: 30 },
    ])).toBe(80);
  });

  it('两项均分权重', () => {
    // 100×50 + 50×50 = 7500；/100 = 75
    expect(weightedAverage([
      { score: 100, weight: 50 },
      { score: 50, weight: 50 },
    ])).toBe(75);
  });

  it('权重和不为 100 时按权重和归一化', () => {
    // 90×3 + 60×1 = 270 + 60 = 330；/4 = 82.5
    expect(weightedAverage([
      { score: 90, weight: 3 },
      { score: 60, weight: 1 },
    ])).toBe(82.5);
  });

  it('空数组返回 null', () => {
    expect(weightedAverage([])).toBe(null);
  });

  it('权重和为 0 返回 null', () => {
    expect(weightedAverage([
      { score: 90, weight: 0 },
      { score: 60, weight: 0 },
    ])).toBe(null);
  });

  it('非数组返回 null', () => {
    expect(weightedAverage(null)).toBe(null);
    expect(weightedAverage(undefined)).toBe(null);
  });

  it('含非法项（NaN/非数字 score 或 weight）返回 null', () => {
    expect(weightedAverage([{ score: NaN, weight: 30 }])).toBe(null);
    expect(weightedAverage([{ score: 90, weight: NaN }])).toBe(null);
    expect(weightedAverage([{ score: '90', weight: 30 }])).toBe(null);
  });

  it('负权重视为非法返回 null', () => {
    expect(weightedAverage([
      { score: 90, weight: -10 },
      { score: 60, weight: 20 },
    ])).toBe(null);
  });

  it('抑制浮点误差', () => {
    // 一项：score 任意、weight 任意（非0）→ 返回该 score 本身
    expect(weightedAverage([{ score: 87.5, weight: 40 }])).toBe(87.5);
  });
});
