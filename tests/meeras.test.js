import { describe, it, expect } from 'vitest';
import { calculateInheritance } from '../src/lib/meeras.js';

describe('calculateInheritance', () => {
  it('husband + son + daughter', () => {
    const r = calculateInheritance(100000, { husband: true, wife: false, sons: 1, daughters: 1, father: false, mother: false });
    expect(r.error).toBeNull();
    // Husband: 1/4 = 25000
    const husband = r.distributions.find(d => d.name === 'الزوج');
    expect(husband.amount).toBeCloseTo(25000, 0);
    // Remaining 75000: son:daughter = 2:1 → son 50000, daughter 25000
    const son = r.distributions.find(d => d.name === 'الابن');
    expect(son.amount).toBeCloseTo(50000, 0);
    const daughter = r.distributions.find(d => d.name === 'البنت');
    expect(daughter.amount).toBeCloseTo(25000, 0);
  });

  it('husband only (no children)', () => {
    const r = calculateInheritance(100000, { husband: true, wife: false, sons: 0, daughters: 0, father: false, mother: false });
    expect(r.error).toBeNull();
    // Husband: 1/2 = 50000
    const husband = r.distributions.find(d => d.name === 'الزوج');
    expect(husband.amount).toBeCloseTo(50000, 0);
    // Remaining 50000 goes to public treasury (no 'asaba)
    const remaining = r.distributions.find(d => d.name.includes('باق'));
    expect(remaining).toBeDefined();
    expect(remaining.amount).toBeCloseTo(50000, 0);
  });

  it('wife + 2 daughters (no sons)', () => {
    const r = calculateInheritance(120000, { husband: false, wife: true, sons: 0, daughters: 2, father: false, mother: false });
    expect(r.error).toBeNull();
    // Wife: 1/8 = 15000
    const wife = r.distributions.find(d => d.name === 'الزوجة');
    expect(wife.amount).toBeCloseTo(15000, 0);
    // 2 daughters: 2/3 = 80000
    const daughters = r.distributions.find(d => d.name === 'البنات');
    expect(daughters.amount).toBeCloseTo(80000, 0);
    // Remaining: 25000 → treasury
  });

  it('wife + son + daughter + father + mother', () => {
    const r = calculateInheritance(120000, { husband: false, wife: true, sons: 1, daughters: 1, father: true, mother: true });
    expect(r.error).toBeNull();
    // Wife: 1/8 = 15000
    const wife = r.distributions.find(d => d.name === 'الزوجة');
    expect(wife.amount).toBeCloseTo(15000, 0);
    // Father: 1/6 = 20000
    const father = r.distributions.find(d => d.name === 'الأب');
    expect(father.amount).toBeCloseTo(20000, 0);
    // Mother: 1/6 = 20000
    const mother = r.distributions.find(d => d.name === 'الأم');
    expect(mother.amount).toBeCloseTo(20000, 0);
    // Remaining 65000: son:daughter = 2:1 → son 43333.33, daughter 21666.67
    const totalChildren = r.distributions.filter(d => d.name === 'الابن' || d.name === 'البنت');
    expect(totalChildren.length).toBe(2);
  });

  it('returns error for negative estate', () => {
    const r = calculateInheritance(-100, { husband: true, wife: false, sons: 0, daughters: 0, father: false, mother: false });
    expect(r.error).toBe(1);
  });

  it('returns error for zero estate', () => {
    const r = calculateInheritance(0, { husband: true, wife: false, sons: 0, daughters: 0, father: false, mother: false });
    expect(r.error).toBe(2);
  });

  it('2 sons 2 daughters (sons take 2x daughters from residue)', () => {
    const r = calculateInheritance(100000, { husband: false, wife: false, sons: 2, daughters: 2, father: false, mother: false });
    expect(r.error).toBeNull();
    // No Quranic shares, all goes to asaba: 6 shares total (2 sons × 2 + 2 daughters × 1)
    // Each share = 100000/6 ≈ 16666.67
    // Each son: 2 shares = 33333.33
    // Each daughter: 1 share = 16666.67
    const sons = r.distributions.filter(d => d.name === 'الابن');
    expect(sons.length).toBe(2);
    expect(sons[0].amount).toBeCloseTo(33333.33, 0);
    const daughters = r.distributions.filter(d => d.name === 'البنت');
    expect(daughters.length).toBe(2);
    expect(daughters[0].amount).toBeCloseTo(16666.67, 0);
  });

  it('estate distribution sums to total (within rounding)', () => {
    const r = calculateInheritance(100000, { husband: true, wife: false, sons: 1, daughters: 2, father: false, mother: false });
    const total = r.distributions.reduce((s, d) => s + d.amount, 0);
    expect(total).toBeCloseTo(100000, 0);
  });
});
