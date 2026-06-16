import { describe, it, expect } from 'vitest';
import {
  nextPeriod,
  ovulationDay,
  fertileWindow,
  futurePeriods,
} from '../src/lib/period.js';

describe('月经周期计算（period）', () => {
  describe('nextPeriod：下次月经 = 末次月经首日 + 周期长度', () => {
    it('28 天周期：2026-06-01 → 2026-06-29', () => {
      expect(nextPeriod('2026-06-01', 28)).toBe('2026-06-29');
    });

    it('30 天周期：2026-06-01 → 2026-07-01（跨月）', () => {
      expect(nextPeriod('2026-06-01', 30)).toBe('2026-07-01');
    });

    it('21 天短周期：2026-06-01 → 2026-06-22', () => {
      expect(nextPeriod('2026-06-01', 21)).toBe('2026-06-22');
    });

    it('默认周期为 28 天', () => {
      expect(nextPeriod('2026-06-01')).toBe('2026-06-29');
    });
  });

  describe('ovulationDay：排卵日 = 下次月经 − 14 天', () => {
    it('28 天周期：2026-06-01 → 2026-06-15', () => {
      expect(ovulationDay('2026-06-01', 28)).toBe('2026-06-15');
    });

    it('30 天周期：2026-06-01 → 2026-06-17', () => {
      // 下次月经 2026-07-01 − 14 = 2026-06-17
      expect(ovulationDay('2026-06-01', 30)).toBe('2026-06-17');
    });

    it('默认周期为 28 天', () => {
      expect(ovulationDay('2026-06-01')).toBe('2026-06-15');
    });
  });

  describe('fertileWindow：排卵日前 5 天 ~ 后 1 天', () => {
    it('28 天周期：2026-06-01 → start 2026-06-10, end 2026-06-16', () => {
      expect(fertileWindow('2026-06-01', 28)).toEqual({
        start: '2026-06-10',
        end: '2026-06-16',
      });
    });

    it('默认周期为 28 天', () => {
      expect(fertileWindow('2026-06-01')).toEqual({
        start: '2026-06-10',
        end: '2026-06-16',
      });
    });
  });

  describe('futurePeriods：未来 N 次月经日期列表', () => {
    it('28 天周期、3 次：每次相隔 28 天', () => {
      expect(futurePeriods('2026-06-01', 28, 3)).toEqual([
        '2026-06-29',
        '2026-07-27',
        '2026-08-24',
      ]);
    });

    it('30 天周期、2 次', () => {
      expect(futurePeriods('2026-06-01', 30, 2)).toEqual([
        '2026-07-01',
        '2026-07-31',
      ]);
    });

    it('N=0 返回空数组', () => {
      expect(futurePeriods('2026-06-01', 28, 0)).toEqual([]);
    });
  });
});
