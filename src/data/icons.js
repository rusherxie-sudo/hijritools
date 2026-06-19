// 工具与分类 → 线性图标 id（对应 public/sprite.svg 的 symbol）。
// 分类副标题为首页分类区头展示文案（阿语，需 arabic-content-reviewer 审校）。

export const toolIconIds = {
  hijri: 'ico-convert',
  age: 'ico-user',
  'date-diff': 'ico-range',
  pregnancy: 'ico-baby',
  percentage: 'ico-percent',
  vat: 'ico-receipt',
  'age-diff': 'ico-range',
  calendar: 'ico-calendar',
  ovulation: 'ico-cal-heart',
  'gender-predictor': 'ico-dice',
  qrcode: 'ico-link',
  'ideal-weight': 'ico-scale',
  bmi: 'ico-activity',
  'body-fat': 'ico-target',
  calories: 'ico-flame',
  water: 'ico-droplet',
  mortgage: 'ico-bank',
  tafqit: 'ico-text',
  countdown: 'ico-hourglass',
  discount: 'ico-wallet',
  'unit-convert': 'ico-ruler',
  period: 'ico-droplet',
  weighted: 'ico-graduation',
};

export const toolIconId = (slug) => toolIconIds[slug] ?? 'ico-spark';

export const categoryMeta = {
  date: { icon: 'ico-calendar', sub: 'حوّل، قارن، واحسب أي تاريخ' },
  health: { icon: 'ico-activity', sub: 'حاسبات صحية تقديرية لجسمك' },
  finance: { icon: 'ico-coins', sub: 'احسب الضرائب والنسب والمبالغ' },
  entertainment: { icon: 'ico-dice', sub: 'أدوات ممتعة وتوقّعات للتسلية' },
  utility: { icon: 'ico-ruler', sub: 'أدوات عملية تسهّل يومك' },
  education: { icon: 'ico-graduation', sub: 'أدوات للدراسة والحساب الأكاديمي' },
};
