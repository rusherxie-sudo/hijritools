import { describe, it, expect } from 'vitest';
import { calculateGPA, gpaToPercentage, percentageToGpa, letterGrade } from '../src/lib/gpa.js';

describe('calculateGPA', () => {
  it('returns 0 for empty input', () => {
    expect(calculateGPA([])).toEqual({ gpa: 0, totalCredits: 0, totalPoints: 0 });
  });

  it('calculates for single course (4.0 scale)', () => {
    const r = calculateGPA([{ grade: 95, credits: 3 }], 4);
    expect(r.totalCredits).toBe(3);
    expect(r.gpa).toBeCloseTo(4.0, 1);
  });

  it('calculates for single course (5.0 scale)', () => {
    const r = calculateGPA([{ grade: 95, credits: 3 }], 5);
    expect(r.totalCredits).toBe(3);
    expect(r.gpa).toBeCloseTo(5.0, 1);
  });

  it('calculates weighted GPA across multiple courses', () => {
    const r = calculateGPA([
      { grade: 95, credits: 3 },
      { grade: 85, credits: 4 },
      { grade: 75, credits: 2 },
    ], 4);
    // points: 95→4.0*3=12, 85→3.0*4=12, 75→2.0*2=4 → total 28/9=3.11
    expect(r.totalCredits).toBe(9);
    expect(r.gpa).toBeCloseTo(3.11, 1);
  });

  it('defaults to 4.0 scale when not specified', () => {
    const r = calculateGPA([{ grade: 100, credits: 2 }]);
    expect(r.gpa).toBeCloseTo(4.0, 1);
  });

  it('caps grade at 100', () => {
    const r = calculateGPA([{ grade: 110, credits: 3 }], 4);
    expect(r.gpa).toBeCloseTo(4.0, 1);
  });

  it('floors grade at 0', () => {
    const r = calculateGPA([{ grade: -10, credits: 3 }], 4);
    expect(r.gpa).toBeCloseTo(0, 1);
  });
});

describe('gpaToPercentage', () => {
  it('converts 4.0 GPA to percentage', () => {
    expect(gpaToPercentage(4.0, 4)).toBeCloseTo(100);
    expect(gpaToPercentage(3.0, 4)).toBeCloseTo(85);
    expect(gpaToPercentage(2.0, 4)).toBeCloseTo(75);
  });

  it('converts 5.0 GPA to percentage', () => {
    expect(gpaToPercentage(5.0, 5)).toBeCloseTo(100);
    expect(gpaToPercentage(4.0, 5)).toBeCloseTo(90);
    expect(gpaToPercentage(3.0, 5)).toBeCloseTo(80);
  });
});

describe('percentageToGpa', () => {
  it('converts percentage to 4.0 scale', () => {
    expect(percentageToGpa(100, 4)).toBeCloseTo(4.0);
    expect(percentageToGpa(85, 4)).toBeCloseTo(3.0);
    expect(percentageToGpa(75, 4)).toBeCloseTo(2.0);
  });

  it('converts percentage to 5.0 scale', () => {
    expect(percentageToGpa(100, 5)).toBeCloseTo(5.0);
    expect(percentageToGpa(90, 5)).toBeCloseTo(4.0);
    expect(percentageToGpa(80, 5)).toBeCloseTo(3.0);
  });
});

describe('letterGrade', () => {
  it('returns Arabic letter grades for 4.0 scale', () => {
    expect(letterGrade(4.0, 4)).toBe('ممتاز +A');
    expect(letterGrade(3.5, 4)).toBe('ممتاز A');
    expect(letterGrade(2.0, 4)).toBe('مقبول C');
    expect(letterGrade(1.0, 4)).toBe('راسب D');
    expect(letterGrade(0.5, 4)).toBe('راسب F');
  });
});
