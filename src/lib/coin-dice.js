// 抛硬币 / 掷骰子纯函数。随机源 rng 可注入以便测试（默认 Math.random）。

/** 抛硬币：返回 'heads'（صورة）或 'tails'（كتابة）。 */
export function flipCoin(rng = Math.random) {
  return rng() < 0.5 ? 'heads' : 'tails';
}

/**
 * 掷骰子：返回长度 count 的点数数组，每个 1..sides。
 * @param {number} count 骰子数（≥1）
 * @param {number} sides 面数（≥2，默认 6）
 * @param {() => number} rng
 */
export function rollDice(count = 1, sides = 6, rng = Math.random) {
  if (!Number.isInteger(count) || count < 1) throw new RangeError('骰子数需 ≥ 1');
  if (!Number.isInteger(sides) || sides < 2) throw new RangeError('面数需 ≥ 2');
  const out = [];
  for (let i = 0; i < count; i++) {
    out.push(Math.min(Math.floor(rng() * sides) + 1, sides));
  }
  return out;
}
