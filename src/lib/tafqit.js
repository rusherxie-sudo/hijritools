// تفقيط الأرقام — 数字转阿拉伯文字大写（支票/发票/合同金额）。纯函数，DOM 无关。
//
// 语法要点（标准阿拉伯语 تفقيط）：
// - 个位用阳性基式（واحد/اثنان/ثلاثة…）。连接词统一用「 و」。
// - 个位 و 十位顺序：个位在前（واحد وعشرون = 21）。
// - 百用「مئة」拼写（非 مائة）；مئتان=200，ثلاثمئة=300…
// - 级联单位（千 ألف / مليون / مليار）随其「数量 count」变形：
//     count=1 → 单数主格（ألف）
//     count=2 → 双数（ألفان）
//     count 3–10 → 复数（آلاف / ملايين / مليارات）：ثلاثة آلاف
//     count 为 100 的整数倍（100,200…）→ 单数属格不带 tanwin（مئة ألف）
//     其余（11–99，或带余数的百位）→ 单数宾格带 tanwin（ألفًا）：أحد عشر ألفًا
// 锚点见 tests/tafqit.test.js（独立来源，非实现反推）。

// 个位（0–9）阳性基式。
const ONES = ['صفر', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
// 11–19。下标 = 个位数字（11→1…19→9）。
const TEENS = ['عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
// 整十（下标 = 十位数字：2→عشرون…9→تسعون）。
const TENS = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
// 整百（下标 = 百位数字）。
const HUNDREDS = ['', 'مئة', 'مئتان', 'ثلاثمئة', 'أربعمئة', 'خمسمئة', 'ستمئة', 'سبعمئة', 'ثمانمئة', 'تسعمئة'];

// 级联单位：每三位一段。index 0 = 个/百/千段（无单位词）。
const SCALES = [
  null,
  { one: 'ألف', two: 'ألفان', plural: 'آلاف', acc: 'ألفًا' },
  { one: 'مليون', two: 'مليونان', plural: 'ملايين', acc: 'مليونًا' },
  { one: 'مليار', two: 'ملياران', plural: 'مليارات', acc: 'مليارًا' },
];

const JOIN = ' و';

/** 0–99 转文字（个位在前，و 连接十位）。 */
function tens2(n) {
  if (n < 10) return ONES[n];
  if (n < 20) return TEENS[n - 10];
  const t = Math.floor(n / 10);
  const u = n % 10;
  if (u === 0) return TENS[t];
  return `${ONES[u]}${JOIN}${TENS[t]}`;
}

/** 1–999 转文字（百位 و 余数）。 */
function below1000(n) {
  if (n < 100) return tens2(n);
  const h = Math.floor(n / 100);
  const rest = n % 100;
  if (rest === 0) return HUNDREDS[h];
  return `${HUNDREDS[h]}${JOIN}${tens2(rest)}`;
}

/**
 * 级联单位词形：根据该段「数量 count」(1–999) 选择 单数/双数/复数/宾格。
 * count=1 时不输出数字本身（ألف 而非 واحد ألف）；count=2 输出双数词（ألفان）。
 * 其余情况输出「count 文字 + 单位词」。
 */
function scaleWord(count, scale) {
  if (count === 1) return scale.one;
  if (count === 2) return scale.two;
  const countWords = below1000(count);
  if (count >= 3 && count <= 10) return `${countWords} ${scale.plural}`;
  if (count % 100 === 0) return `${countWords} ${scale.one}`; // مئة ألف
  return `${countWords} ${scale.acc}`; // أحد عشر ألفًا
}

/** 整数（含 0）转阿拉伯文字。支持 0 至十亿级。 */
export function tafqit(input) {
  let n = Math.floor(Math.abs(Number(input)));
  if (!Number.isFinite(n)) return '';
  if (n === 0) return ONES[0];

  const neg = Number(input) < 0;

  // 拆成三位一组（低位在前）。
  const groups = [];
  let rem = n;
  while (rem > 0) {
    groups.push(rem % 1000);
    rem = Math.floor(rem / 1000);
  }

  const parts = [];
  // 从高位到低位拼接。
  for (let i = groups.length - 1; i >= 0; i--) {
    const g = groups[i];
    if (g === 0) continue;
    if (i === 0) {
      parts.push(below1000(g)); // 末段无单位词
    } else {
      parts.push(scaleWord(g, SCALES[i]));
    }
  }

  const words = parts.join(JOIN);
  return neg ? `سالب ${words}` : words;
}

/**
 * 货币与小数转文字。
 * @param {number|string} input 金额，如 1234.5
 * @param {object} opts
 * @param {string} opts.currencyName 主币名（默认 ريال）
 * @param {string} opts.subName 辅币名（默认 هللة）
 * @param {number} opts.subDivisor 辅币进位（默认 100：1 ريال = 100 هللة；درهم 用 1000）
 * @returns {string} 如 'ألف ومئتان وأربعة وثلاثون ريالًا وخمسون هللة'
 *
 * 主币词形：仅有主币时用基式（ألف ريال）；当后接小数从句时主币带宾格 tanwin（ريالًا）。
 * 辅币词形：仅有辅币时用基式（خمسون هللة）；与主币并列时带宾格 tanwin（فلسًا）。
 */
export function tafqitCurrency(input, opts = {}) {
  const {
    currencyName = 'ريال',
    subName = 'هللة',
    subDivisor = 100,
  } = opts;

  const value = Math.abs(Number(input));
  if (!Number.isFinite(value)) return '';

  const whole = Math.floor(value);
  // 辅币位数 = log10(divisor)，按进位四舍五入。
  const digits = Math.round(Math.log10(subDivisor));
  const sub = Math.round((value - whole) * subDivisor);

  // 进位溢出修正（如 0.999*100 → 100 应进位为 1 主币）。
  let wholeAdj = whole;
  let subAdj = sub;
  if (subAdj >= subDivisor) {
    wholeAdj += Math.floor(subAdj / subDivisor);
    subAdj = subAdj % subDivisor;
  }

  const hasSub = subAdj > 0;

  // 主币从句。
  let mainClause;
  if (wholeAdj === 0 && hasSub) {
    mainClause = ''; // 仅辅币
  } else {
    const tanwin = applyTanwin(currencyName);
    // 有辅币从句时主币带 tanwin（宾格），否则用基式。
    mainClause = `${tafqit(wholeAdj)} ${hasSub ? tanwin : currencyName}`;
  }

  if (!hasSub) return mainClause;

  // 辅币从句：与主币并列时带 tanwin，否则基式。
  const subWord = mainClause ? applyTanwin(subName) : subName;
  const subClause = `${tafqit(subAdj)} ${subWord}`;

  return mainClause ? `${mainClause}${JOIN}${subClause}` : subClause;
}

/**
 * 给币名加宾格 tanwin（ريال→ريالًا، درهم→درهمًا، فلس→فلسًا）。
 * 以 ة（تاء مربوطة）结尾的词（如 هللة）其 tanwin 为 fatha 变音符，纯文本中省略，原样返回。
 * 以 alif/ى 结尾的词不重复加。
 */
function applyTanwin(name) {
  if (name.endsWith('ة')) return name;
  if (name.endsWith('ا') || name.endsWith('ى')) return name;
  return `${name}ًا`;
}
