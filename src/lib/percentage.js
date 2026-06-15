// 百分比计算核心库。涵盖常见四种场景。纯函数。
// 所有结果经 cleanFloat 抑制 IEEE 浮点噪声（如 229.9999… → 230），保留 10 位有效精度。

/** 抑制浮点误差：四舍五入到 10 位小数。 */
function cleanFloat(n) {
  if (!Number.isFinite(n)) return n;
  return Math.round((n + Number.EPSILON) * 1e10) / 1e10;
}

/** Y 的 X%。 */
export function percentOf(percent, total) {
  return cleanFloat((percent / 100) * total);
}

/** part 占 total 的百分比。total=0 时返回 0。 */
export function whatPercent(part, total) {
  if (total === 0) return 0;
  return cleanFloat((part / total) * 100);
}

/** 从 oldValue 到 newValue 的百分比变化（正=增长，负=下降）。 */
export function percentChange(oldValue, newValue) {
  if (oldValue === 0) return newValue === 0 ? 0 : Infinity;
  return cleanFloat(((newValue - oldValue) / Math.abs(oldValue)) * 100);
}

/** 在 base 上增加 percent%。 */
export function increaseByPercent(base, percent) {
  return cleanFloat(base * (1 + percent / 100));
}

/** 在 base 上减少 percent%。 */
export function decreaseByPercent(base, percent) {
  return cleanFloat(base * (1 - percent / 100));
}
