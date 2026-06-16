// 折扣计算核心库。纯函数（DOM 无关）。
// 所有结果经 cleanFloat 抑制 IEEE 浮点噪声（如 0.99000…1 → 0.99），保留 10 位有效精度。
// 非法/缺失输入或除零一律返回 null（页面侧负责兜底显示）。

/** 抑制浮点误差：四舍五入到 10 位小数。 */
function cleanFloat(n) {
  if (!Number.isFinite(n)) return n;
  return Math.round((n + Number.EPSILON) * 1e10) / 1e10;
}

/** 输入是否为有限数值（拒绝 NaN / Infinity / 非数字字符串）。 */
function isNum(n) {
  return typeof n === 'number' && Number.isFinite(n);
}

/** 折后价 = 原价 ×（1 − 折扣率/100）。非法输入返回 null。 */
export function priceAfterDiscount(original, pct) {
  if (!isNum(original) || !isNum(pct)) return null;
  return cleanFloat(original * (1 - pct / 100));
}

/** 省下的金额 = 原价 × 折扣率/100。非法输入返回 null。 */
export function savedAmount(original, pct) {
  if (!isNum(original) || !isNum(pct)) return null;
  return cleanFloat(original * (pct / 100));
}

/** 折扣率(%) =（原价 − 售价）/ 原价 × 100。原价为 0 或非法输入返回 null。 */
export function discountRate(original, sale) {
  if (!isNum(original) || !isNum(sale) || original === 0) return null;
  return cleanFloat(((original - sale) / original) * 100);
}
