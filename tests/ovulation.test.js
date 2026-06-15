import { describe, it, expect } from 'vitest';
import { ovulationFromLMP } from '../src/lib/ovulation.js';
import { utcDate, toISODate } from '../src/lib/date-utils.js';

describe('排卵日计算', () => {
  it('28 天周期：LMP 2026-01-01 → 排卵日 01-15、下次月经 01-29', () => {
    const r = ovulationFromLMP(utcDate(2026, 1, 1), 28);
    expect(toISODate(r.ovulationDay)).toBe('2026-01-15');
    expect(toISODate(r.nextPeriod)).toBe('2026-01-29');
  });

  it('易孕窗口 = 排卵日 -5 ~ +1 天', () => {
    const r = ovulationFromLMP(utcDate(2026, 1, 1), 28);
    expect(toISODate(r.fertileStart)).toBe('2026-01-10');
    expect(toISODate(r.fertileEnd)).toBe('2026-01-16');
  });

  it('排卵日 = 下次月经前 14 天，随周期长度移动（35 天周期）', () => {
    const r = ovulationFromLMP(utcDate(2026, 1, 1), 35);
    expect(toISODate(r.ovulationDay)).toBe('2026-01-22'); // 01-01 + (35-14)
  });

  it('短周期 21 天', () => {
    const r = ovulationFromLMP(utcDate(2026, 1, 1), 21);
    expect(toISODate(r.ovulationDay)).toBe('2026-01-08'); // 01-01 + 7
  });

  it('默认周期为 28 天', () => {
    const r = ovulationFromLMP(utcDate(2026, 1, 1));
    expect(toISODate(r.ovulationDay)).toBe('2026-01-15');
  });

  it('输出排卵日的伊历日期', () => {
    const r = ovulationFromLMP(utcDate(2026, 1, 1), 28);
    expect(r.ovulationHijri).toHaveProperty('hy');
    expect(r.ovulationHijri).toHaveProperty('hm');
    expect(r.ovulationHijri).toHaveProperty('hd');
  });
});
