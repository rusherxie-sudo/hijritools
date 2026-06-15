// 伊历固定宗教日（按伊历月/日）。用于月历高亮与倒计时。
// 日期为乌姆库拉历固定值；实际节庆以各国官方月相委员会公告为准（页面附免责）。

export const hijriHolidays = [
  { hm: 1, hd: 1, nameAr: 'رأس السنة الهجرية', type: 'newyear' },
  { hm: 1, hd: 10, nameAr: 'يوم عاشوراء', type: 'observance' },
  { hm: 9, hd: 1, nameAr: 'بداية شهر رمضان', type: 'ramadan' },
  { hm: 10, hd: 1, nameAr: 'عيد الفطر', type: 'eid' },
  { hm: 12, hd: 9, nameAr: 'يوم عرفة', type: 'observance' },
  { hm: 12, hd: 10, nameAr: 'عيد الأضحى', type: 'eid' },
];

/** 主要倒计时目标（首页/伊历页用）。 */
export const countdownTargets = [
  { hm: 9, hd: 1, nameAr: 'رمضان' },
  { hm: 10, hd: 1, nameAr: 'عيد الفطر' },
  { hm: 12, hd: 9, nameAr: 'يوم عرفة' },
  { hm: 12, hd: 10, nameAr: 'عيد الأضحى' },
];

/** 返回指定伊历月的节日数组。 */
export function holidaysInMonth(hm) {
  return hijriHolidays.filter((h) => h.hm === hm);
}
