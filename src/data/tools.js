// 工具元数据单一数据源。导航、首页卡片、相关链接、sitemap 全部引用这里。
// type: 'calc'（纯计算单页）| 'regulatory'（法规工具，按国分页）。

export const tools = [
  {
    slug: 'hijri',
    titleAr: 'التاريخ الهجري اليوم',
    shortAr: 'التاريخ الهجري',
    descAr: 'حوّل بين التاريخ الهجري (أم القرى) والميلادي، واعرف تاريخ اليوم الهجري مع تقويم شهري ومناسبات إسلامية.',
    category: 'date',
    type: 'calc',
    icon: '🌙',
    live: true,
    related: ['age', 'date-diff', 'pregnancy'],
  },
  {
    slug: 'age',
    titleAr: 'حاسبة العمر بالهجري والميلادي',
    shortAr: 'حاسبة العمر',
    descAr: 'احسب عمرك بالتقويمين الهجري والميلادي بدقة، مع العد التنازلي لعيد ميلادك القادم.',
    category: 'date',
    type: 'calc',
    icon: '🎂',
    live: true,
    related: ['hijri', 'date-diff', 'age-diff'],
  },
  {
    slug: 'date-diff',
    titleAr: 'حساب الفرق بين تاريخين',
    shortAr: 'الفرق بين تاريخين',
    descAr: 'احسب عدد الأيام والأسابيع والسنوات بين تاريخين بدقة.',
    category: 'date',
    type: 'calc',
    icon: '📅',
    live: true,
    related: ['age', 'age-diff', 'hijri'],
  },
  {
    slug: 'pregnancy',
    titleAr: 'حاسبة الحمل وموعد الولادة بالأسابيع',
    shortAr: 'حاسبة الحمل',
    descAr: 'احسبي موعد الولادة المتوقع وعمر الحمل بالأسابيع، مع تاريخ الولادة بالهجري.',
    category: 'health',
    type: 'calc',
    icon: '👶',
    live: true,
    related: ['age', 'date-diff', 'hijri'],
  },
  {
    slug: 'percentage',
    titleAr: 'حاسبة النسبة المئوية',
    shortAr: 'النسبة المئوية',
    descAr: 'احسب النسبة المئوية بكل أنواعها: نسبة من رقم، نسبة الزيادة والنقصان، والفرق المئوي.',
    category: 'finance',
    type: 'calc',
    icon: '٪',
    live: true,
    related: ['vat', 'age', 'date-diff'],
  },
  {
    slug: 'vat',
    titleAr: 'حاسبة ضريبة القيمة المضافة',
    shortAr: 'ضريبة القيمة المضافة',
    descAr: 'احسب ضريبة القيمة المضافة في دول الخليج: أضف الضريبة أو استخرجها من السعر الشامل.',
    category: 'finance',
    type: 'regulatory',
    icon: '🧾',
    live: true,
    related: ['percentage'],
    countries: ['sa', 'ae', 'qa', 'kw', 'bh', 'om'],
  },
  {
    slug: 'age-diff',
    titleAr: 'حاسبة الفرق في العمر بين شخصين',
    shortAr: 'الفرق في العمر',
    descAr: 'احسب الفرق في العمر بين شخصين بالسنوات والأشهر والأيام، ومن الأكبر.',
    category: 'date',
    type: 'calc',
    icon: '👥',
    live: true,
    related: ['age', 'date-diff', 'hijri'],
  },
  {
    slug: 'calendar',
    href: '/calendar/1447/',
    titleAr: 'التقويم الهجري 1447',
    shortAr: 'التقويم الهجري 1447',
    descAr: 'التقويم الهجري لعام 1447 كاملًا بالأشهر والأيام والمناسبات الإسلامية، مع ما يقابلها بالميلادي.',
    category: 'date',
    type: 'calc',
    icon: '🗓️',
    live: true,
    staticPaths: ['/calendar/1447/'],
    related: ['hijri', 'age', 'pregnancy'],
  },
  {
    slug: 'ovulation',
    titleAr: 'حاسبة التبويض وأيام الإباضة',
    shortAr: 'حاسبة التبويض',
    descAr: 'احسبي أيام التبويض وفترة الخصوبة وموعد الدورة القادمة من تاريخ آخر دورة شهرية.',
    category: 'health',
    type: 'calc',
    icon: '🌸',
    live: true,
    related: ['pregnancy', 'age', 'date-diff'],
  },
  {
    slug: 'gender-predictor',
    titleAr: 'الجدول الصيني لتوقع نوع الجنين بالهجري',
    shortAr: 'توقع نوع الجنين',
    descAr: 'الجدول الصيني لتوقع نوع الجنين حسب عمر الأم وشهر الحمل الهجري — للتسلية فقط.',
    category: 'entertainment',
    type: 'calc',
    icon: '🎎',
    live: true,
    related: ['pregnancy', 'ovulation', 'age'],
  },
  {
    slug: 'qrcode',
    titleAr: 'مولّد رمز QR والباركود',
    shortAr: 'مولّد باركود QR',
    descAr: 'أنشئ رمز QR أو باركود من نص أو رابط، وحمّله صورة PNG مجانًا بدون تسجيل.',
    category: 'utility',
    type: 'calc',
    icon: '🔳',
    live: true,
    related: ['percentage', 'hijri', 'age'],
  },
];

/** 工具落地 URL：日历等特殊路径用 href，其余按 slug。 */
export function toolLink(t) {
  return t.href ?? `/${t.slug}/`;
}

/** 已上线工具。 */
export const liveTools = tools.filter((t) => t.live);

/** 按 slug 取工具。 */
export function getTool(slug) {
  return tools.find((t) => t.slug === slug);
}

/** 分类的阿拉伯语名称。 */
export const categoryNamesAr = {
  date: 'التاريخ والوقت',
  finance: 'المال والضرائب',
  health: 'الصحة',
  entertainment: 'الترفيه',
  utility: 'أدوات مفيدة',
};
