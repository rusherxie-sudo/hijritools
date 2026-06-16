// 房贷 / 融资计算核心库（等额本息 / القسط الثابت）。纯函数，DOM 无关。
// 伊斯兰金融话术：annualRatePct 视为「年化利润率 نسبة الربح」，不绑定具体银行。
// 公式：r = annualRatePct/100/12，n = years×12，
//   M = P·r·(1+r)^n / ((1+r)^n − 1)；零利率（r=0）时 M = P/n。

/** 四舍五入到 2 位小数（货币）。 */
function cleanFloat(n) {
  if (!Number.isFinite(n)) return n;
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/**
 * 等额本息月供（القسط الشهري）。
 * @param {number} principal     融资总额（本金）
 * @param {number} annualRatePct 年化利润率（百分比，如 5 表示 5%）
 * @param {number} years         还款年数
 * @returns {number} 每月还款额，保留 2 位小数
 */
export function monthlyPayment(principal, annualRatePct, years) {
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (n <= 0) return 0;
  if (r === 0) return cleanFloat(principal / n);
  const pow = Math.pow(1 + r, n);
  return cleanFloat((principal * r * pow) / (pow - 1));
}

/** 总还款额（إجمالي المبلغ）= 月供 × 月数。 */
export function totalPayment(principal, annualRatePct, years) {
  const n = years * 12;
  return cleanFloat(monthlyPayment(principal, annualRatePct, years) * n);
}

/** 总利润 / 总成本（إجمالي الأرباح）= 总还款额 − 本金。 */
export function totalProfit(principal, annualRatePct, years) {
  return cleanFloat(totalPayment(principal, annualRatePct, years) - principal);
}
