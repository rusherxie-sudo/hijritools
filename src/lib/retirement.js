// 退休储蓄规划计算库（حاسبة المدخرات للتقاعد）。纯函数，DOM 无关。
// 公式：期末值 = 每月存入 × [((1 + r)^n - 1) / r]，r = 年化收益/12/100，n = 年数×12。
// 通用规划工具，不绑定具体国家养老金制度，零验证风险。

function cleanFloat(n) {
  if (!Number.isFinite(n)) return n;
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function futureValue(monthlyContribution, annualReturnPct, years) {
  const PMT = Math.max(0, monthlyContribution);
  const n = Math.max(0, years) * 12;
  if (n <= 0 || PMT <= 0) return 0;
  const r = annualReturnPct / 100 / 12;
  if (r === 0) return cleanFloat(PMT * n);
  const fv = PMT * ((Math.pow(1 + r, n) - 1) / r);
  return cleanFloat(fv);
}

export function monthlyContributionRequired(targetAmount, annualReturnPct, years) {
  const target = Math.max(0, targetAmount);
  const n = Math.max(0, years) * 12;
  if (n <= 0 || target <= 0) return 0;
  const r = annualReturnPct / 100 / 12;
  if (r === 0) return cleanFloat(target / n);
  const pmt = (target * r) / (Math.pow(1 + r, n) - 1);
  return cleanFloat(pmt);
}

export function retirementMonthlyIncome(retirementNest, withdrawalRatePct = 4) {
  const nest = Math.max(0, retirementNest);
  const rate = Math.max(0, withdrawalRatePct) / 100;
  return cleanFloat((nest * rate) / 12);
}

export function yearsToRetirement(currentAge, retirementAge) {
  const diff = Math.max(0, retirementAge - currentAge);
  return diff;
}
