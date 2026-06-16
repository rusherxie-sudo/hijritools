// 单位换算核心库。三类:长度、重量、温度。纯函数(DOM 无关)。
// 长度/重量:统一转为基准单位(米 / 千克)再转目标。温度:单独公式(无线性基准)。
// 跨类别或未知单位 → 返回 null。

/** 长度:各单位 → 米 的系数。基准单位 = 米。 */
const LENGTH = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  inch: 0.0254,
  ft: 0.3048,
  yard: 0.9144,
  mile: 1609.344,
};

/** 重量:各单位 → 千克 的系数。基准单位 = 千克。 */
const WEIGHT = {
  mg: 0.000001,
  g: 0.001,
  kg: 1,
  ton: 1000,
  lb: 0.45359237,
  oz: 0.028349523125,
};

const TEMP_UNITS = ['C', 'F', 'K'];

/** 抑制浮点误差:四舍五入到 10 位小数。 */
function cleanFloat(n) {
  if (!Number.isFinite(n)) return n;
  return Math.round((n + Number.EPSILON) * 1e10) / 1e10;
}

/** 任意温度单位 → 摄氏度。 */
function toCelsius(value, unit) {
  if (unit === 'C') return value;
  if (unit === 'F') return (value - 32) * (5 / 9);
  if (unit === 'K') return value - 273.15;
  return null;
}

/** 摄氏度 → 任意温度单位。 */
function fromCelsius(celsius, unit) {
  if (unit === 'C') return celsius;
  if (unit === 'F') return celsius * (9 / 5) + 32;
  if (unit === 'K') return celsius + 273.15;
  return null;
}

/**
 * 在同类单位间换算。跨类别或未知单位返回 null。
 * @param {number} value 数值
 * @param {string} fromUnit 源单位
 * @param {string} toUnit 目标单位
 * @returns {number|null}
 */
export function convert(value, fromUnit, toUnit) {
  if (!Number.isFinite(value)) return null;

  // 线性单位(长度 / 重量):同表内才可换算。
  for (const table of [LENGTH, WEIGHT]) {
    const hasFrom = Object.prototype.hasOwnProperty.call(table, fromUnit);
    const hasTo = Object.prototype.hasOwnProperty.call(table, toUnit);
    if (hasFrom && hasTo) {
      return cleanFloat((value * table[fromUnit]) / table[toUnit]);
    }
    if (hasFrom || hasTo) return null; // 一个在表内一个不在 → 跨类
  }

  // 温度:单独公式。
  if (TEMP_UNITS.includes(fromUnit) && TEMP_UNITS.includes(toUnit)) {
    return cleanFloat(fromCelsius(toCelsius(value, fromUnit), toUnit));
  }
  if (TEMP_UNITS.includes(fromUnit) || TEMP_UNITS.includes(toUnit)) return null;

  // 两个单位都未知。
  return null;
}

/** 供页面使用的单位分组(阿语名 + 单位键)。 */
export const UNIT_GROUPS = {
  length: {
    units: [
      { key: 'mm', ar: 'مليمتر' },
      { key: 'cm', ar: 'سنتيمتر' },
      { key: 'm', ar: 'متر' },
      { key: 'km', ar: 'كيلومتر' },
      { key: 'inch', ar: 'إنش' },
      { key: 'ft', ar: 'قدم' },
      { key: 'yard', ar: 'ياردة' },
      { key: 'mile', ar: 'ميل' },
    ],
  },
  weight: {
    units: [
      { key: 'mg', ar: 'مليغرام' },
      { key: 'g', ar: 'غرام' },
      { key: 'kg', ar: 'كيلوغرام' },
      { key: 'ton', ar: 'طن' },
      { key: 'lb', ar: 'رطل' },
      { key: 'oz', ar: 'أونصة' },
    ],
  },
  temperature: {
    units: [
      { key: 'C', ar: 'مئوية' },
      { key: 'F', ar: 'فهرنهايت' },
      { key: 'K', ar: 'كلفن' },
    ],
  },
};
