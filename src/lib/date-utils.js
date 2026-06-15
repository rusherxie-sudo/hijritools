// 通用公历日期纯函数工具。全部不依赖 DOM、不依赖时区（按 UTC 计算以保证可测试性）。
// 设计原则：日期一律以「当天 00:00 UTC」为锚点，避免本地时区导致的跨日误差。

/** 用 UTC 构造一个「纯日期」（时分秒清零）。月份 month 为 1-12。 */
export function utcDate(year, month, day) {
  return new Date(Date.UTC(year, month - 1, day));
}

/** 把任意 Date 归一化到当天 00:00 UTC。 */
export function startOfUtcDay(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

/** 在日期上增加 n 天（可为负），返回新 Date（00:00 UTC）。 */
export function addDays(date, n) {
  const d = startOfUtcDay(date);
  d.setUTCDate(d.getUTCDate() + n);
  return d;
}

/** 两个日期相差的整数天数（b - a）。忽略时分秒。 */
export function diffInDays(a, b) {
  const ms = startOfUtcDay(b).getTime() - startOfUtcDay(a).getTime();
  return Math.round(ms / 86400000);
}

/** 判断是否为有效 Date。 */
export function isValidDate(date) {
  return date instanceof Date && !Number.isNaN(date.getTime());
}

/** 解析 <input type="date"> 的 "YYYY-MM-DD" 字符串为规范 UTC 日期。无效（含越界月日）返回 null。 */
export function parseISODate(str) {
  if (typeof str !== 'string') return null;
  const m = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const da = Number(m[3]);
  const d = utcDate(y, mo, da);
  if (!isValidDate(d)) return null;
  // Date.UTC 会把越界月日滚动到相邻月（如 2-30→3-2）；回读分量校验，拒绝被篡改的输入
  if (d.getUTCFullYear() !== y || d.getUTCMonth() + 1 !== mo || d.getUTCDate() !== da) {
    return null;
  }
  return d;
}

/** 客户端「今天」（取用户本地日历日，转为规范 UTC 日期）。仅供浏览器使用。 */
export function todayUtc() {
  const now = new Date();
  return utcDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

/** 把规范 UTC 日期格式化为 "YYYY-MM-DD"（供 input value）。 */
export function toISODate(date) {
  const d = startOfUtcDay(date);
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${d.getUTCFullYear()}-${mm}-${dd}`;
}

/** 公历闰年判定。 */
export function isGregorianLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * 计算「整年/整月/整天」形式的时间差（b 在 a 之后）。
 * 采用「锚点法」：先把 start 按年月推进 total 个月（落到月末则夹住），
 * 再数锚点到 end 的天数。避免「向 end 前一个月借天数」时的下溢（如 1/31→3/1 旧算法得 -2 天）。
 * 返回 { years, months, days }，均为非负整数。a >= b 时返回全 0。
 */
export function calendarDelta(a, b) {
  const start = startOfUtcDay(a);
  const end = startOfUtcDay(b);
  if (end.getTime() <= start.getTime()) return { years: 0, months: 0, days: 0 };

  let total =
    (end.getUTCFullYear() - start.getUTCFullYear()) * 12 +
    (end.getUTCMonth() - start.getUTCMonth());
  // 若 end 的「日」还没到 start 的「日」，说明最后一个月未满，回退一个月
  if (end.getUTCDate() < start.getUTCDate()) total -= 1;

  // 把 start 推进 total 个月作为锚点（目标月不足 start 日号时夹到月末）
  const anchorY = start.getUTCFullYear() + Math.floor((start.getUTCMonth() + total) / 12);
  const anchorM = ((start.getUTCMonth() + total) % 12 + 12) % 12;
  const daysInAnchorMonth = new Date(Date.UTC(anchorY, anchorM + 1, 0)).getUTCDate();
  const anchorD = Math.min(start.getUTCDate(), daysInAnchorMonth);
  const anchor = Date.UTC(anchorY, anchorM, anchorD);

  const days = Math.round((end.getTime() - anchor) / 86400000);
  return { years: Math.floor(total / 12), months: total % 12, days };
}
