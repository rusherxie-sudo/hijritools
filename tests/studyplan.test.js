import { describe, it, expect } from 'vitest';
import { daysUntilExam, weeksUntilExam, generateStudyPlan, QDRAT_SUBJECTS } from '../src/lib/studyplan.js';

describe('备考计划表生成', () => {
  const today = new Date('2026-06-29');

  it('daysUntilExam: 14天后考试 = 14天', () => {
    const exam = new Date('2026-07-13');
    expect(daysUntilExam(exam, today)).toBe(14);
  });

  it('daysUntilExam: 已过期 = 0', () => {
    const exam = new Date('2026-06-01');
    expect(daysUntilExam(exam, today)).toBe(0);
  });

  it('weeksUntilExam: 14天 = 2周', () => {
    const exam = new Date('2026-07-13');
    expect(weeksUntilExam(exam, today)).toBe(2);
  });

  it('weeksUntilExam: 1天 = 1周', () => {
    const exam = new Date('2026-06-30');
    expect(weeksUntilExam(exam, today)).toBe(1);
  });

  it('generateStudyPlan: 生成周计划', () => {
    const exam = new Date('2026-07-13');
    const plan = generateStudyPlan(exam, ['数学', '语文'], 3, today);
    expect(plan.days).toBe(14);
    expect(plan.weeks).toBe(2);
    expect(plan.weeklyPlan.length).toBe(2);
    expect(plan.weeklyPlan[0].subjects.length).toBe(2);
  });

  it('generateStudyPlan: 每日计划', () => {
    const exam = new Date('2026-07-13');
    const plan = generateStudyPlan(exam, ['数学', '语文'], 3, today);
    expect(plan.dailyPlan.length).toBeGreaterThan(0);
  });

  it('generateStudyPlan: 无科目 = 空计划', () => {
    const exam = new Date('2026-07-13');
    const plan = generateStudyPlan(exam, [], 3, today);
    expect(plan.weeklyPlan.length).toBe(0);
    expect(plan.dailyPlan.length).toBe(0);
  });

  it('generateStudyPlan: 总小时数 = 天数 × 每天小时数', () => {
    const exam = new Date('2026-07-13');
    const plan = generateStudyPlan(exam, ['数学'], 3, today);
    expect(plan.totalHours).toBe(14 * 3);
  });

  it('QDRAT_SUBJECTS: 4 个科目', () => {
    expect(QDRAT_SUBJECTS.length).toBe(4);
  });
});
