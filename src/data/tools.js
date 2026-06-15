// 工具元数据单一数据源。导航、首页卡片、相关链接、sitemap 全部引用这里。
// type: 'calc'（纯计算单页）| 'regulatory'（法规工具，按国分页）。
// descAr 同时用作：页面 meta description、首页卡片描述、工具页引言段，故写到 ~150 字符并含关键词。

export const tools = [
  {
    slug: 'hijri',
    titleAr: 'التاريخ الهجري اليوم',
    shortAr: 'التاريخ الهجري',
    descAr: 'حوّل بين التاريخ الهجري (أم القرى) والميلادي بدقة، واعرف تاريخ اليوم الهجري والميلادي مع تقويم شهري كامل وأهم المناسبات الإسلامية. أداة مجانية بدون تسجيل.',
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
    descAr: 'احسب عمرك بالتقويمين الهجري والميلادي بالسنوات والأشهر والأيام بدقة، مع العد التنازلي لعيد ميلادك القادم واليوم الذي وُلدت فيه. أداة مجانية بدون تسجيل.',
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
    descAr: 'احسب الفرق بين تاريخين بالأيام والأسابيع والأشهر والسنوات بدقة، بالتقويم الهجري أو الميلادي. مثالي لحساب المدد والمواعيد. أداة مجانية وسريعة بدون تسجيل.',
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
    descAr: 'احسبي موعد الولادة المتوقع وعمر الحمل بالأسابيع والأشهر من تاريخ آخر دورة، مع تاريخ الولادة بالتقويمين الهجري والميلادي ومراحل الحمل. حاسبة تقديرية مجانية.',
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
    descAr: 'احسب النسبة المئوية بكل أنواعها: نسبة رقم من رقم، نسبة الزيادة أو النقصان، الفرق المئوي، والزيادة والخصم على المبالغ. حاسبة مجانية دقيقة وسهلة بدون تسجيل.',
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
    descAr: 'احسب ضريبة القيمة المضافة (VAT) في دول الخليج بالنِّسب الرسمية لكل دولة: أضف الضريبة إلى السعر الصافي أو استخرجها من السعر الشامل. حاسبة مجانية ودقيقة.',
    category: 'finance',
    type: 'regulatory',
    icon: '🧾',
    live: true,
    related: ['percentage', 'age', 'date-diff'],
    countries: ['sa', 'ae', 'qa', 'kw', 'bh', 'om'],
  },
  {
    slug: 'age-diff',
    titleAr: 'حاسبة الفرق في العمر بين شخصين',
    shortAr: 'الفرق في العمر',
    descAr: 'احسب فرق العمر بين شخصين بالسنوات والأشهر والأيام بدقة، واعرف من الأكبر وبكم. مفيد للأزواج والإخوة والأصدقاء، بالتقويمين الهجري والميلادي. أداة مجانية.',
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
    descAr: 'التقويم الهجري لعام 1447 هـ كاملًا بجميع الأشهر والأيام والمناسبات الإسلامية، مع ما يقابلها بالتاريخ الميلادي. اعرف بداية الأشهر والأعياد والإجازات مجانًا.',
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
    descAr: 'احسبي أيام التبويض وفترة الخصوبة وأعلى أيام فرص الحمل وموعد الدورة القادمة من تاريخ آخر دورة شهرية وطول دورتك. حاسبة تقديرية مجانية وسهلة بدون تسجيل.',
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
    descAr: 'الجدول الصيني لتوقع نوع الجنين (ولد أو بنت) حسب عمر الأم وشهر الحمل بالتقويم الهجري. نسخة تدعم الأشهر الهجرية — للتسلية والترفيه فقط ولا أساس علمي له.',
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
    descAr: 'أنشئ رمز QR أو باركود من أي نص أو رابط مباشرة في متصفحك، وحمّله صورة PNG عالية الجودة مجانًا وبدون تسجيل أو علامة مائية. سريع وآمن وبدون رفع بياناتك.',
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
