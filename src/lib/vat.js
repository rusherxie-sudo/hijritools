// 增值税（VAT / ضريبة القيمة المضافة）计算核心库。
// 海湾各国税率不同，税率由 data/vat.js 提供。本库只做纯算术。纯函数。

/** 四舍五入到 2 位小数（货币）。 */
function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/**
 * 不含税价 → 含税价。
 * @param {number} net 不含税金额
 * @param {number} rate 税率（百分比，如 15 表示 15%）
 * @returns {{net, vat, gross}}
 */
export function addVat(net, rate) {
  const vat = round2(net * (rate / 100));
  return { net: round2(net), vat, gross: round2(net + vat) };
}

/**
 * 含税价 → 不含税价（反推）。
 * @param {number} gross 含税金额
 * @param {number} rate 税率（百分比）
 * @returns {{net, vat, gross}}
 */
export function removeVat(gross, rate) {
  const divisor = 1 + rate / 100;
  if (divisor <= 0) throw new RangeError('税率不能 ≤ -100%');
  const net = round2(gross / divisor);
  const vat = round2(gross - net);
  return { net, vat, gross: round2(gross) };
}
