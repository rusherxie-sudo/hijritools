// 加权平均核心库（大学录取加权百分比）。纯函数，DOM 无关。
// 按权重和归一化：Σ(score×weight) / Σ(weight)。权重不必正好等于 100。
// 任意非法输入（非数组、空、含 NaN/非数字、负权重、权重和为 0）一律返回 null。
// 结果经 cleanFloat 抑制 IEEE 浮点噪声（如 82.4999… → 82.5），保留 10 位有效精度。

/** 抑制浮点误差：四舍五入到 10 位小数。 */
function cleanFloat(n) {
  if (!Number.isFinite(n)) return n;
  return Math.round((n + Number.EPSILON) * 1e10) / 1e10;
}

/**
 * 加权平均。
 * @param {Array<{score:number, weight:number}>} items
 * @returns {number|null} Σ(score×weight)/Σ(weight)；非法/空/权重和为 0 时返回 null。
 */
export function weightedAverage(items) {
  if (!Array.isArray(items) || items.length === 0) return null;

  let weightedSum = 0;
  let weightTotal = 0;
  for (const item of items) {
    if (!item || typeof item !== 'object') return null;
    const { score, weight } = item;
    // 必须是真正的有限数字（拒绝字符串、NaN、Infinity）
    if (typeof score !== 'number' || !Number.isFinite(score)) return null;
    if (typeof weight !== 'number' || !Number.isFinite(weight)) return null;
    if (weight < 0) return null;
    weightedSum += score * weight;
    weightTotal += weight;
  }

  if (weightTotal === 0) return null;
  return cleanFloat(weightedSum / weightTotal);
}
