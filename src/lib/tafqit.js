// تفقيط الأرقام — 数字转阿拉伯文字大写（支票/发票/合同金额）。纯函数，DOM 无关。
//
// 实现「数-名一致 تمييز」完整规则(锚点见 tests/tafqit.test.js,独立来源非反推):
// - 名词形态按金额末两位 tail 选:tail 1→单数(ريال واحد)、2→双数(ريالان)、
//   3-10→复数属格(ثلاثة ريالات)、11-99→单数宾格(أحد عشر ريالًا)、整百千→单数属格(مئة ريال)。
// - 数字 3-10 性别与名词「相反」:阳名 ريال→ثلاثة(带ة);阴名 هللة→ثلاث(无ة)。
// - 双数作 مضاف(后接名词/级联词)删 نون:مئتان→مئتا、ألفان→ألفا、مليونان→مليونا。
// - 级联词(ألف/مليون/مليار)按其数量 count 的 tail 同理变形。

// 个位 0–9：阳性 / 阴性两套(3-9 阴性去ة)。
const ONES = ['صفر', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
const ONES_F = ['صفر', 'واحدة', 'اثنتان', 'ثلاث', 'أربع', 'خمس', 'ست', 'سبع', 'ثماني', 'تسع'];
// 11–19(下标=个位):阳性 / 阴性。
const TEENS = ['عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
const TEENS_F = ['عشر', 'إحدى عشرة', 'اثنتا عشرة', 'ثلاث عشرة', 'أربع عشرة', 'خمس عشرة', 'ست عشرة', 'سبع عشرة', 'ثماني عشرة', 'تسع عشرة'];
// 整十(下标=十位)。无性别。
const TENS = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
// 整百(下标=百位)。مئة 为阴性名词,各形对两性通用。
const HUNDREDS = ['', 'مئة', 'مئتان', 'ثلاثمئة', 'أربعمئة', 'خمسمئة', 'ستمئة', 'سبعمئة', 'ثمانمئة', 'تسعمئة'];

// 级联单位:每三位一段。index 0 = 个/百/千段(无单位词)。
const SCALES = [
  null,
  { one: 'ألف', two: 'ألفان', plural: 'آلاف', acc: 'ألفًا' },
  { one: 'مليون', two: 'مليونان', plural: 'ملايين', acc: 'مليونًا' },
  { one: 'مليار', two: 'ملياران', plural: 'مليارات', acc: 'مليارًا' },
];

const JOIN = ' و';

// 双数主格 → مضاف(删 نون),用于双数后直接接名词/级联词。
const MUDAF = { 'مئتان': 'مئتا', 'ألفان': 'ألفا', 'مليونان': 'مليونا', 'ملياران': 'مليارا' };
function toMudaf(words) {
  for (const dual in MUDAF) {
    if (words === dual || words.endsWith(JOIN + dual)) {
      return words.slice(0, words.length - dual.length) + MUDAF[dual];
    }
  }
  return words;
}

/** 0–99 转文字(个位在前)。f=阴性。 */
function tens2(n, f = false) {
  const O = f ? ONES_F : ONES;
  const T = f ? TEENS_F : TEENS;
  if (n < 10) return O[n];
  if (n < 20) return T[n - 10];
  const t = Math.floor(n / 10);
  const u = n % 10;
  if (u === 0) return TENS[t];
  return `${O[u]}${JOIN}${TENS[t]}`;
}

/** 1–999 转文字。f=阴性。 */
function below1000(n, f = false) {
  if (n < 100) return tens2(n, f);
  const h = Math.floor(n / 100);
  const rest = n % 100;
  if (rest === 0) return HUNDREDS[h];
  return `${HUNDREDS[h]}${JOIN}${tens2(rest, f)}`;
}

/** 级联词形:按该段数量 count(1–999)的 tail 选 单数/双数/复数/宾格/属格。 */
function scaleWord(count, scale) {
  if (count === 1) return scale.one;
  if (count === 2) return scale.two;
  const w = below1000(count);
  const t = count % 100;
  if (t >= 3 && t <= 10) return `${w} ${scale.plural}`; // ثلاثة آلاف / مئة وعشرة آلاف
  if (t === 0) return `${toMudaf(w)} ${scale.one}`;      // مئة ألف / مئتا ألف
  return `${w} ${scale.acc}`;                            // أحد عشر ألفًا
}

/** 整数(含 0)转阿拉伯文字。0 至十亿级。 */
export function tafqit(input) {
  const num = Number(input);
  if (!Number.isFinite(num)) return '';
  let n = Math.floor(Math.abs(num));
  if (n === 0) return ONES[0];

  const groups = [];
  let rem = n;
  while (rem > 0) {
    groups.push(rem % 1000);
    rem = Math.floor(rem / 1000);
  }

  const parts = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    const g = groups[i];
    if (g === 0) continue;
    parts.push(i === 0 ? below1000(g) : scaleWord(g, SCALES[i]));
  }

  const words = parts.join(JOIN);
  return num < 0 ? `سالب ${words}` : words;
}

/** n<1000 用性别感知;否则用整数 tafqit(级联内部为阳性,仅主币用)。 */
function intWords(n, f) {
  return n < 1000 ? below1000(n, f) : tafqit(n);
}

/**
 * 数字 + 被数名词的「数-名一致」短语。
 * @param {number} n 数量(>0)
 * @param {object} noun { one، two، plural، acc، f }(f=阴性)
 */
function numberNoun(n, noun) {
  if (n === 1) return `${noun.one} ${noun.f ? 'واحدة' : 'واحد'}`;
  if (n === 2) return noun.two;
  const t = n % 100;
  const w = intWords(n, noun.f);
  if (t === 0) return `${toMudaf(w)} ${noun.one}`;                 // مئتا ريال / ألفا ريال / ألف ريال
  if (t === 1) return `${w} ${noun.one}`;                          // مئة وواحد ريال
  if (t === 2) return `${w.replace(/(اثنان|اثنتان)$/, '')}${noun.two}`; // مئة وريالان
  if (t >= 3 && t <= 10) return `${w} ${noun.plural}`;            // ثلاثة ريالات
  return `${w} ${noun.acc}`;                                       // أربعة وثلاثون ريالًا
}

// 名词形态库。acc = 单数宾格(辅音结尾加 ًا;ة 结尾宾格 tanwin 为 ﹸ变音,纯文本省略 → 同基式)。
const RIYAL = { one: 'ريال', two: 'ريالان', plural: 'ريالات', acc: 'ريالًا', f: false };
const DIRHAM = { one: 'درهم', two: 'درهمان', plural: 'دراهم', acc: 'درهمًا', f: false };
const DINAR = { one: 'دينار', two: 'ديناران', plural: 'دنانير', acc: 'دينارًا', f: false };
const HALALA = { one: 'هللة', two: 'هللتان', plural: 'هللات', acc: 'هللة', f: true };
const FILS = { one: 'فلس', two: 'فلسان', plural: 'فلوس', acc: 'فلسًا', f: false };
const BAISA = { one: 'بيسة', two: 'بيستان', plural: 'بيسات', acc: 'بيسة', f: true };

// 海湾六国货币表(main/sub/subDivisor)。
export const CURRENCIES = {
  SAR: { ar: 'ريال سعودي', main: RIYAL, sub: HALALA, subDivisor: 100 },
  AED: { ar: 'درهم إماراتي', main: DIRHAM, sub: FILS, subDivisor: 100 },
  QAR: { ar: 'ريال قطري', main: RIYAL, sub: DIRHAM, subDivisor: 100 },
  KWD: { ar: 'دينار كويتي', main: DINAR, sub: FILS, subDivisor: 1000 },
  BHD: { ar: 'دينار بحريني', main: DINAR, sub: FILS, subDivisor: 1000 },
  OMR: { ar: 'ريال عماني', main: RIYAL, sub: BAISA, subDivisor: 1000 },
};

/**
 * 金额(含小数)转文字,遵循 تمييز。
 * @param {number|string} input 金额,如 1234.5
 * @param {object} opts { currency:'SAR' }(默认 SAR)
 * @returns {string} 如 'ألف ومئتان وأربعة وثلاثون ريالًا وخمسون هللة'
 */
export function tafqitCurrency(input, opts = {}) {
  const value = Math.abs(Number(input));
  if (!Number.isFinite(value)) return '';
  const cur = CURRENCIES[opts.currency] || CURRENCIES.SAR;

  const whole = Math.floor(value);
  let sub = Math.round((value - whole) * cur.subDivisor);
  let wholeAdj = whole;
  if (sub >= cur.subDivisor) { wholeAdj += Math.floor(sub / cur.subDivisor); sub = sub % cur.subDivisor; }

  const mainClause = wholeAdj > 0 ? numberNoun(wholeAdj, cur.main) : '';
  const subClause = sub > 0 ? numberNoun(sub, cur.sub) : '';

  if (mainClause && subClause) return `${mainClause}${JOIN}${subClause}`;
  if (mainClause) return mainClause;
  if (subClause) return subClause;
  return `${tafqit(0)} ${cur.main.one}`; // صفر ريال
}
