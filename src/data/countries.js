// 国家注册表（一等数据维度）。新增国家 = 加一条，并在各法规工具数据表补该国值，
// 法规页由 getStaticPaths 自动生成。hijriOffset = 相对沙特乌姆库拉历的默认偏移天数。

export const countries = {
  sa: { code: 'sa', nameAr: 'السعودية', nameEn: 'Saudi Arabia', currency: 'SAR', currencyAr: 'ريال', hijriOffset: 0, enabled: true },
  ae: { code: 'ae', nameAr: 'الإمارات', nameEn: 'UAE', currency: 'AED', currencyAr: 'درهم', hijriOffset: 0, enabled: true },
  qa: { code: 'qa', nameAr: 'قطر', nameEn: 'Qatar', currency: 'QAR', currencyAr: 'ريال', hijriOffset: 0, enabled: true },
  kw: { code: 'kw', nameAr: 'الكويت', nameEn: 'Kuwait', currency: 'KWD', currencyAr: 'دينار', hijriOffset: 0, enabled: true },
  bh: { code: 'bh', nameAr: 'البحرين', nameEn: 'Bahrain', currency: 'BHD', currencyAr: 'دينار', hijriOffset: 0, enabled: true },
  om: { code: 'om', nameAr: 'عُمان', nameEn: 'Oman', currency: 'OMR', currencyAr: 'ريال', hijriOffset: 0, enabled: true },
  // 扩展位（默认关闭，演示可扩展性）：
  eg: { code: 'eg', nameAr: 'مصر', nameEn: 'Egypt', currency: 'EGP', currencyAr: 'جنيه', hijriOffset: 0, enabled: false },
};

/** 已启用国家代码列表（用于 getStaticPaths）。 */
export const enabledCountryCodes = Object.values(countries)
  .filter((c) => c.enabled)
  .map((c) => c.code);

/** 海湾六国（GCC）顺序，用于对比表。 */
export const gccOrder = ['sa', 'ae', 'qa', 'kw', 'bh', 'om'];
