import { describe, it, expect } from 'vitest';
import { parseNames, pickOne, shuffle } from '../src/lib/random-picker.js';

describe('随机抽签', () => {
  it('parseNames 按行拆、去空格、剔空行', () => {
    expect(parseNames('أحمد\n  سارة  \n\nخالد\n')).toEqual(['أحمد', 'سارة', 'خالد']);
  });

  it('parseNames 空输入返回空数组', () => {
    expect(parseNames('')).toEqual([]);
    expect(parseNames('   \n  \n')).toEqual([]);
    expect(parseNames(null)).toEqual([]);
  });

  it('pickOne 用注入 rng 确定性抽取', () => {
    const list = ['a', 'b', 'c'];
    expect(pickOne(list, () => 0)).toBe('a');
    expect(pickOne(list, () => 0.99)).toBe('c');
    expect(pickOne(list, () => 0.5)).toBe('b');
  });

  it('pickOne 空名单抛错', () => {
    expect(() => pickOne([])).toThrow();
  });

  it('shuffle 返回同长度且元素相同的排列（不改原数组）', () => {
    const orig = ['a', 'b', 'c', 'd'];
    const out = shuffle(orig, () => 0.5);
    expect(out.length).toBe(orig.length);
    expect([...out].sort()).toEqual([...orig].sort());
    expect(orig).toEqual(['a', 'b', 'c', 'd']); // 原数组未被修改
  });
});
