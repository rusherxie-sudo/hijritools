// 健康工具共享公式库。纯函数，DOM 无关。
// 5 个工具（BMI / 理想体重 / 体脂 / 卡路里 / 饮水）共享此库。
// 数学公式的固有常数（BMI、Hamwi、Devine、海军、Mifflin 系数）直接留在 lib——它们不随法规/时间变化。
// 所有结果经 cleanFloat 抑制 IEEE 浮点噪声，再按需四舍五入；非法输入一律返回 null。

/** 抑制浮点误差：四舍五入到 10 位小数。 */
function cleanFloat(n) {
  if (!Number.isFinite(n)) return n;
  return Math.round((n + Number.EPSILON) * 1e10) / 1e10;
}

/** 四舍五入到 d 位小数。 */
function round(n, d) {
  const f = 10 ** d;
  return Math.round((n + Number.EPSILON) * f) / f;
}

/** 正有限数判定。 */
function isPos(n) {
  return Number.isFinite(n) && n > 0;
}

/** BMI = 体重kg / (身高m)²，保留 1 位小数。非法输入返回 null。 */
export function bmi(weightKg, heightCm) {
  if (!isPos(weightKg) || !isPos(heightCm)) return null;
  const m = heightCm / 100;
  return round(weightKg / (m * m), 1);
}

/** WHO BMI 分级（阿语标签）。非法输入返回 null。 */
export function bmiCategory(bmiValue) {
  if (!Number.isFinite(bmiValue)) return null;
  if (bmiValue < 18.5) return 'نحافة';
  if (bmiValue < 25) return 'وزن طبيعي';
  if (bmiValue < 30) return 'زيادة في الوزن';
  return 'سمنة';
}

/** Devine 理想体重(kg)。男 50 / 女 45.5 起，每超 152.4cm（5 英尺）加 2.3kg/英寸。保留 1 位小数。 */
export function idealWeightDevine(heightCm, sex) {
  if (!isPos(heightCm) || (sex !== 'male' && sex !== 'female')) return null;
  const base = sex === 'male' ? 50 : 45.5;
  const inchesOver5ft = (heightCm - 152.4) / 2.54;
  return round(cleanFloat(base + 2.3 * inchesOver5ft), 1);
}

/** Hamwi 理想体重(kg)。男 48 + 2.7/英寸；女 45.5 + 2.2/英寸（超 5 英尺）。保留 1 位小数。 */
export function idealWeightHamwi(heightCm, sex) {
  if (!isPos(heightCm) || (sex !== 'male' && sex !== 'female')) return null;
  const inchesOver5ft = (heightCm - 152.4) / 2.54;
  const result = sex === 'male'
    ? 48 + 2.7 * inchesOver5ft
    : 45.5 + 2.2 * inchesOver5ft;
  return round(cleanFloat(result), 1);
}

/**
 * 美国海军体脂百分比（cm 版），保留 1 位小数。
 * 男 = 495/(1.0324 − 0.19077·log10(waist−neck) + 0.15456·log10(height)) − 450
 * 女 = 495/(1.29579 − 0.35004·log10(waist+hip−neck) + 0.22100·log10(height)) − 450
 * 女性必须提供 hipCm；log10 入参必须为正（男 waist>neck，女 waist+hip>neck）。非法输入返回 null。
 */
export function bodyFatNavy(params) {
  if (!params || typeof params !== 'object') return null;
  const { sex, heightCm, neckCm, waistCm, hipCm } = params;
  if (sex !== 'male' && sex !== 'female') return null;
  if (!isPos(heightCm) || !isPos(neckCm) || !isPos(waistCm)) return null;

  let value;
  if (sex === 'male') {
    const inner = waistCm - neckCm;
    if (!isPos(inner)) return null;
    const denom = 1.0324 - 0.19077 * Math.log10(inner) + 0.15456 * Math.log10(heightCm);
    value = 495 / denom - 450;
  } else {
    if (!isPos(hipCm)) return null;
    const inner = waistCm + hipCm - neckCm;
    if (!isPos(inner)) return null;
    const denom = 1.29579 - 0.35004 * Math.log10(inner) + 0.22100 * Math.log10(heightCm);
    value = 495 / denom - 450;
  }
  if (!Number.isFinite(value)) return null;
  return round(value, 1);
}

/**
 * 基础代谢率 BMR（Mifflin-St Jeor）。
 * 男 = 10·kg + 6.25·cm − 5·age + 5；女 = 10·kg + 6.25·cm − 5·age − 161。
 * 非法 / 缺失输入返回 null。
 */
export function bmr(params) {
  if (!params || typeof params !== 'object') return null;
  const { sex, weightKg, heightCm, age } = params;
  if (sex !== 'male' && sex !== 'female') return null;
  if (!isPos(weightKg) || !isPos(heightCm) || !isPos(age)) return null;
  const baseline = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const result = sex === 'male' ? baseline + 5 : baseline - 161;
  return cleanFloat(result);
}

/** 每日总消耗 TDEE = BMR × 活动系数（取整）。非法输入返回 null。 */
export function tdee(bmrValue, activityFactor) {
  if (!isPos(bmrValue) || !isPos(activityFactor)) return null;
  return Math.round(bmrValue * activityFactor);
}

/** 每日饮水量(ml) = 体重kg × 35。非法输入返回 null。 */
export function waterIntakeMl(weightKg) {
  if (!isPos(weightKg)) return null;
  return cleanFloat(weightKg * 35);
}
