import { describe, it, expect } from 'vitest';
import { convert } from '../src/lib/unit-convert.js';

describe('单位换算', () => {
  describe('长度', () => {
    it('1 米 ≈ 3.28084 英尺', () => {
      expect(convert(1, 'm', 'ft')).toBeCloseTo(3.28084, 5);
    });
    it('1 公里 = 1000 米', () => {
      expect(convert(1, 'km', 'm')).toBe(1000);
    });
    it('1 英寸 = 2.54 厘米', () => {
      expect(convert(1, 'inch', 'cm')).toBe(2.54);
    });
    it('同单位返回原值', () => {
      expect(convert(5, 'm', 'm')).toBe(5);
    });
    it('1 英里 ≈ 1609.344 米', () => {
      expect(convert(1, 'mile', 'm')).toBeCloseTo(1609.344, 3);
    });
    it('1 码 = 3 英尺', () => {
      expect(convert(1, 'yard', 'ft')).toBeCloseTo(3, 6);
    });
    it('1000 毫米 = 1 米', () => {
      expect(convert(1000, 'mm', 'm')).toBe(1);
    });
  });

  describe('重量', () => {
    it('1 千克 ≈ 2.20462 磅', () => {
      expect(convert(1, 'kg', 'lb')).toBeCloseTo(2.20462, 5);
    });
    it('1000 克 = 1 千克', () => {
      expect(convert(1000, 'g', 'kg')).toBe(1);
    });
    it('1 千克 = 1000000 毫克', () => {
      expect(convert(1, 'kg', 'mg')).toBe(1000000);
    });
    it('1 吨 = 1000 千克', () => {
      expect(convert(1, 'ton', 'kg')).toBe(1000);
    });
    it('1 盎司 ≈ 28.349523125 克', () => {
      expect(convert(1, 'oz', 'g')).toBeCloseTo(28.349523125, 6);
    });
  });

  describe('温度', () => {
    it('0°C = 32°F', () => {
      expect(convert(0, 'C', 'F')).toBe(32);
    });
    it('100°C = 212°F', () => {
      expect(convert(100, 'C', 'F')).toBe(212);
    });
    it('0°C = 273.15 K', () => {
      expect(convert(0, 'C', 'K')).toBe(273.15);
    });
    it('32°F = 0°C', () => {
      expect(convert(32, 'F', 'C')).toBe(0);
    });
    it('212°F = 100°C', () => {
      expect(convert(212, 'F', 'C')).toBe(100);
    });
    it('273.15 K = 0°C', () => {
      expect(convert(273.15, 'K', 'C')).toBe(0);
    });
    it('100°C = 373.15 K', () => {
      expect(convert(100, 'C', 'K')).toBe(373.15);
    });
    it('同单位返回原值', () => {
      expect(convert(25, 'C', 'C')).toBe(25);
    });
  });

  describe('跨类别', () => {
    it('米→千克 返回 null', () => {
      expect(convert(1, 'm', 'kg')).toBe(null);
    });
    it('摄氏度→米 返回 null', () => {
      expect(convert(1, 'C', 'm')).toBe(null);
    });
    it('千克→英尺 返回 null', () => {
      expect(convert(1, 'kg', 'ft')).toBe(null);
    });
    it('未知单位 返回 null', () => {
      expect(convert(1, 'm', 'xyz')).toBe(null);
    });
  });
});
