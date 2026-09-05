// 退休计算器职业变体（用于 5 个独立落地页，覆盖长尾搜索词）。
// 每个职业 = 不同的默认值 + 不同的标题/描述，工具逻辑完全相同。
// 通用规划工具，不绑定具体国家养老金制度。

export const retirementCareers = {
  general: {
    code: 'general',
    nameAr: 'عام',
    titleAr: 'حاسبة المعاش والتقاعد — ادخر لتقاعدك',
    shortAr: 'حاسبة المعاش',
    descAr: 'احسب قيمة مدخراتك عند التقاعد من المبلغ الذي تدخره شهريًا ونسبة العائد السنوية وعدد سنوات الادخار، مع تقدير الدخل الشهري بعد التقاعد. أداة تخطيط مالي مجانية.',
    icon: '🏦',
    defaults: { monthly: 2000, returnPct: 5, currentAge: 30, retirementAge: 60 },
  },
  teachers: {
    code: 'teachers',
    nameAr: 'للمعلمين',
    titleAr: 'حاسبة تقاعد المعلمين — تخطيع معاشك',
    shortAr: 'تقاعد المعلمين',
    descAr: 'حاسبة معاش التقاعد للمعلمات والمعلمين: احسب قيمة مدخراتك عند التقاعد من المبلغ الشهري ونسبة العائد والسنوات، مع تقدير الدخل الشهري بعد التقاعد. أداة تخطيط مالي مجانية.',
    icon: '👩‍🏫',
    defaults: { monthly: 1500, returnPct: 5, currentAge: 28, retirementAge: 60 },
  },
  government: {
    code: 'government',
    nameAr: 'لموظفي الحكومة',
    titleAr: 'حاسبة تقاعد الموظفين الحكوميين',
    shortAr: 'تقاعد الموظفين',
    descAr: 'حاسبة معاش التقاعد لموظفي القطاع العام والحكومي: احسب قيمة مدخراتك عند التقاعد من الادخار الشهري ونسبة العائد والسنوات، مع تقدير الدخل الشهري بعد التقاعد. أداة مجانية.',
    icon: '🏛️',
    defaults: { monthly: 2500, returnPct: 5, currentAge: 30, retirementAge: 60 },
  },
  military: {
    code: 'military',
    nameAr: 'للعسكريين',
    titleAr: 'حاسبة التقاعد العسكري — ادخر لمستقبلك',
    shortAr: 'التقاعد العسكري',
    descAr: 'حاسبة معاش التقاعد العسكري: احسب قيمة مدخراتك عند التقاعد من المبلغ الشهري ونسبة العائد والسنوات، مع تقدير الدخل الشهري بعد التقاعد. أداة تخطيط مالي مجانية.',
    icon: '🎖️',
    defaults: { monthly: 3000, returnPct: 5, currentAge: 25, retirementAge: 55 },
  },
  civil: {
    code: 'civil',
    nameAr: 'مدني',
    titleAr: 'حاسبة التقاعد المدني — التخطيط المالي',
    shortAr: 'التقاعد المدني',
    descAr: 'حاسبة معاش التقاعد للقطاع المدني والعاملين في القطاع الخاص: احسب قيمة مدخراتك عند التقاعد من الادخار الشهري ونسبة العائد والسنوات، مع تقدير الدخل الشهري بعد التقاعد. أداة مجانية.',
    icon: '💼',
    defaults: { monthly: 2000, returnPct: 5, currentAge: 30, retirementAge: 62 },
  },
};

export const retirementCareerList = Object.values(retirementCareers);
