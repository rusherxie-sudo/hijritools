import { describe, it, expect } from 'vitest';
import { loveScore } from '../src/lib/love-match.js';

describe('姓名配对（娱乐）', () => {
  it('确定性：同一对名字恒定返回同一分数', () => {
    const a = loveScore('سارة', 'أحمد');
    const b = loveScore('سارة', 'أحمد');
    expect(a).toBe(b);
  });

  it('对称：交换顺序结果相同', () => {
    expect(loveScore('سارة', 'أحمد')).toBe(loveScore('أحمد', 'سارة'));
    expect(loveScore('Ali', 'Sara')).toBe(loveScore('Sara', 'Ali'));
  });

  it('结果为 0–100 的整数', () => {
    const r = loveScore('محمد', 'فاطمة');
    expect(Number.isInteger(r)).toBe(true);
    expect(r).toBeGreaterThanOrEqual(0);
    expect(r).toBeLessThanOrEqual(100);
  });

  it('忽略首尾空格与大小写', () => {
    expect(loveScore('  Ali  ', 'Sara')).toBe(loveScore('ali', 'sara'));
  });

  it('空名字抛错', () => {
    expect(() => loveScore('', 'أحمد')).toThrow();
    expect(() => loveScore('سارة', '   ')).toThrow();
  });

  it('不同名字对能产生不同分数（有区分度）', () => {
    const scores = new Set([
      loveScore('سارة', 'أحمد'),
      loveScore('محمد', 'نورة'),
      loveScore('خالد', 'ريم'),
      loveScore('عمر', 'ليلى'),
    ]);
    // 4 对里至少出现 2 个不同分数，证明不是常量
    expect(scores.size).toBeGreaterThanOrEqual(2);
  });
});
