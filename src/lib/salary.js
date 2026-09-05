// 薪资/净工资计算器（通用版，不绑定具体国家制度）。纯函数，DOM 无关。
// 输入：总工资 + 各项扣除百分比（社保/税/医保等）→ 净工资 + 各项明细。

function cleanFloat(n) {
  if (!Number.isFinite(n)) return n;
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function netSalary(grossSalary, deductions = []) {
  const gross = Math.max(0, grossSalary);
  let totalDeduction = 0;
  const breakdown = deductions.map((d) => {
    const amount = cleanFloat((gross * d.percent) / 100);
    totalDeduction += amount;
    return { name: d.name, percent: d.percent, amount };
  });
  const net = cleanFloat(gross - totalDeduction);
  return {
    gross,
    totalDeduction: cleanFloat(totalDeduction),
    net,
    breakdown,
  };
}

export function grossFromNet(netSalary, deductions = []) {
  const net = Math.max(0, netSalary);
  const totalDeductionPct = deductions.reduce((sum, d) => sum + d.percent, 0);
  if (totalDeductionPct >= 100) return { gross: 0, totalDeduction: 0, net, breakdown: [] };
  const gross = cleanFloat(net / (1 - totalDeductionPct / 100));
  const breakdown = deductions.map((d) => ({
    name: d.name,
    percent: d.percent,
    amount: cleanFloat((gross * d.percent) / 100),
  }));
  const totalDeduction = cleanFloat(gross - net);
  return { gross, totalDeduction, net, breakdown };
}

export function annualSalary(monthlySalary) {
  return cleanFloat(monthlySalary * 12);
}

export function dailySalary(monthlySalary, workingDays = 22) {
  return cleanFloat(monthlySalary / workingDays);
}

export function hourlySalary(monthlySalary, workingHours = 176) {
  return cleanFloat(monthlySalary / workingHours);
}
