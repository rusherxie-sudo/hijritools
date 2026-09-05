import { describe, it, expect } from 'vitest';
import { rectArea, triArea, circleArea, convertArea } from '../src/lib/area.js';

describe('rectArea', () => {
  it('calculates rectangle area', () => {
    expect(rectArea(5, 3)).toBe(15);
    expect(rectArea(0, 10)).toBe(0);
    expect(rectArea(2.5, 4)).toBe(10);
  });
});

describe('triArea', () => {
  it('calculates triangle area', () => {
    expect(triArea(6, 4)).toBe(12);
    expect(triArea(0, 10)).toBe(0);
    expect(triArea(3, 7)).toBe(10.5);
  });
});

describe('circleArea', () => {
  it('calculates circle area', () => {
    const r = circleArea(1);
    expect(r).toBeCloseTo(Math.PI, 2);
    expect(circleArea(0)).toBe(0);
    expect(circleArea(2)).toBeCloseTo(12.566, 2);
  });
});

describe('convertArea', () => {
  it('converts m2 to cm2', () => {
    expect(convertArea(1, 'm2', 'cm2')).toBeCloseTo(10000, 0);
  });

  it('converts m2 to km2', () => {
    expect(convertArea(1000000, 'm2', 'km2')).toBeCloseTo(1, 2);
  });

  it('converts ft2 to m2', () => {
    expect(convertArea(10.764, 'ft2', 'm2')).toBeCloseTo(1, 1);
  });

  it('same unit returns same value', () => {
    expect(convertArea(5, 'm2', 'm2')).toBe(5);
  });
});
