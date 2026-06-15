// 海湾各国增值税（VAT）税率数据。事实数据，标注来源与生效年份。
// 税率变化只改这里，计算逻辑（lib/vat.js）不动。

export const vatRates = {
  sa: { rate: 15, since: '2020-07-01', source: 'هيئة الزكاة والضريبة والجمارك (ZATCA)' },
  ae: { rate: 5, since: '2018-01-01', source: 'الهيئة الاتحادية للضرائب (FTA)' },
  bh: { rate: 10, since: '2022-01-01', source: 'الجهاز الوطني للإيرادات (NBR)' },
  om: { rate: 5, since: '2021-04-16', source: 'جهاز الضرائب العماني' },
  qa: { rate: 0, since: null, source: 'لا تطبّق قطر ضريبة القيمة المضافة حتى الآن' },
  kw: { rate: 0, since: null, source: 'لا تطبّق الكويت ضريبة القيمة المضافة حتى الآن' },
};

export function getVatRate(countryCode) {
  return vatRates[countryCode];
}
