// 随机抽签纯函数。随机源 rng 可注入以便测试（默认 Math.random）。

/** 解析多行文本为名单：按行拆、去首尾空格、剔除空行。 */
export function parseNames(text) {
  return (text ?? '')
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/** 从名单随机抽一个。rng 返回 [0,1)。空名单抛错。 */
export function pickOne(list, rng = Math.random) {
  if (!Array.isArray(list) || list.length === 0) throw new Error('名单为空');
  const i = Math.floor(rng() * list.length);
  return list[Math.min(i, list.length - 1)];
}

/** Fisher–Yates 洗牌，返回新数组（不改原数组）。rng 可注入。 */
export function shuffle(list, rng = Math.random) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const k = Math.min(j, i);
    [a[i], a[k]] = [a[k], a[i]];
  }
  return a;
}
