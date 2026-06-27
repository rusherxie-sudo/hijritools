/**
 * Islamic inheritance (المواريث / علم الفرائض) calculator — simplified.
 * Pure functions, DOM-free.
 *
 * Handles common scenarios:
 * - Spouse (husband/wife) ± children (sons/daughters)
 * - Parents ± children
 * - Children only
 *
 * Quranic fixed shares:
 *   Husband: 1/2 (no child) | 1/4 (with child)
 *   Wife:    1/4 (no child) | 1/8 (with child)
 *   Daughter (alone): 1/2
 *   Daughters (2+):   2/3 (divided equally)
 *   Father: 1/6 (with child)
 *   Mother: 1/6 (with child) | 1/3 (no child)
 *
 * 'Asaba (residue): sons take residue, son:daughter = 2:1
 */

function gcd(a, b) {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  return (a * b) / gcd(a, b);
}

/**
 * @param {number} estate
 * @param {{husband:boolean, wife:boolean, sons:number, daughters:number, father:boolean, mother:boolean}} rel
 */
export function calculateInheritance(estate, rel) {
  if (!Number.isFinite(estate) || estate < 0) {
    return { distributions: [], error: 1, errorMsg: 'يرجى إدخال مبلغ التركة' };
  }
  if (estate === 0) {
    return { distributions: [], error: 2, errorMsg: 'التركة صفر — لا شيء للتوزيع' };
  }

  const hasChild = (rel.sons + rel.daughters) > 0;
  const totalPeople = (rel.husband ? 1 : 0) + (rel.wife ? 1 : 0) + rel.sons + rel.daughters + (rel.father ? 1 : 0) + (rel.mother ? 1 : 0);
  if (totalPeople === 0) {
    return { distributions: [], error: 3, errorMsg: 'لم يتم اختيار أي وارث' };
  }

  // ---- Determine quranic shares as [num, den] pairs ----
  const fracs = []; // {name, num, den}

  if (rel.husband) fracs.push({ name: 'الزوج', num: 1, den: hasChild ? 4 : 2 });
  if (rel.wife)    fracs.push({ name: 'الزوجة', num: 1, den: hasChild ? 8 : 4 });

  // Daughters: Quranic share only if NO sons (if sons exist, they take as asaba)
  if (rel.daughters === 1 && rel.sons === 0) {
    fracs.push({ name: 'البنت', num: 1, den: 2 });
  } else if (rel.daughters >= 2 && rel.sons === 0) {
    fracs.push({ name: 'البنات', num: 2, den: 3 });
  }

  if (rel.father && hasChild) fracs.push({ name: 'الأب', num: 1, den: 6 });
  if (rel.mother && hasChild) fracs.push({ name: 'الأم', num: 1, den: 6 });
  if (rel.mother && !hasChild) fracs.push({ name: 'الأم', num: 1, den: 3 });

  // ---- Compute common denominator for quranic shares ----
  let commonDen = 1;
  for (const f of fracs) {
    commonDen = lcm(commonDen, f.den);
  }

  // ---- Calculate total distributed and remaining ----
  let totalNum = 0;
  for (const f of fracs) {
    totalNum += f.num * (commonDen / f.den);
  }
  let remaining = commonDen - totalNum;
  if (remaining < 0) remaining = 0; // 'awl (proportional reduction) — simplified

  // ---- Build all shares (quranic + asaba) ----
  const allShares = fracs.map(f => ({
    name: f.name,
    num: f.num * (commonDen / f.den),
    den: commonDen,
    type: 'quranic',
  }));

  // ---- 'Asaba: sons (and possibly father) take residue ----
  if (rel.sons > 0 && remaining > 0) {
    const asabaTotalShares = rel.sons * 2 + rel.daughters; // each son = 2, daughter = 1
    for (let i = 0; i < rel.sons; i++) {
      allShares.push({ name: 'الابن', num: 2 * remaining / asabaTotalShares, den: commonDen, type: 'asaba' });
    }
    for (let i = 0; i < rel.daughters; i++) {
      allShares.push({ name: 'البنت', num: remaining / asabaTotalShares, den: commonDen, type: 'asaba' });
    }
  }

  // ---- Compute actual amounts ----
  // All shares are normalized to commonDen; actual fraction = num / commonDen
  const distributions = allShares.map(sh => ({
    name: sh.name,
    type: sh.type,
    amount: parseFloat(((sh.num / commonDen) * estate).toFixed(2)),
    percentage: parseFloat(((sh.num / commonDen) * 100).toFixed(1)),
  }));

  // If residual unallocated and no asaba, note it
  if (remaining > 0 && rel.sons === 0 && !rel.father) {
    const unallocPct = remaining / commonDen;
    distributions.push({
      name: 'باقٍ للتوزيع على الورثة الآخرين (إن وجد)',
      type: 'asaba',
      amount: parseFloat((unallocPct * estate).toFixed(2)),
      percentage: parseFloat((unallocPct * 100).toFixed(1)),
    });
  }

  return { distributions, error: null, errorMsg: null };
}
