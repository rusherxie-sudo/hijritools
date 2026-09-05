// 姓名配对「契合度」纯函数（娱乐用途）。
// 要求：确定性（同一对名字恒定）+ 对称（顺序无关）。绝非随机、绝无科学依据。

/** 归一化名字：去首尾空格、内部空格，转小写（阿语无大小写，仅对拉丁字母生效）。 */
function normalize(name) {
  return (name ?? '').trim().replace(/\s+/g, '').toLowerCase();
}

/**
 * 计算两个名字的「契合度」0–100。
 * 用两个名字字符码的对称累加量（和 + 平方和 + 长度积）做哈希，
 * 因加法/乘法可交换，故结果与传入顺序无关。
 * @param {string} nameA
 * @param {string} nameB
 * @returns {number} 0–100 整数
 */
export function loveScore(nameA, nameB) {
  const a = normalize(nameA);
  const b = normalize(nameB);
  if (!a || !b) throw new Error('两个名字都不能为空');

  let sum = 0;   // 字符码之和（对称）
  let sq = 0;    // 字符码平方和（对称，增加区分度）
  for (const ch of a + b) {
    const c = ch.codePointAt(0);
    sum += c;
    sq += c * c;
  }
  // 长度积对称；整体混合后取模 101 得 0–100
  const h = (sum * 131 + sq * 17 + a.length * b.length * 7) >>> 0;
  return h % 101;
}
