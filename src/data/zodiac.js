// 西方十二星座数据（阿语）。事实表：名称、符号、日期范围、性格特质（中性、娱乐向）。
// 日期边界采用通行公历范围。ZODIAC_BOUNDARIES 每项 = [月, 该星座起始日, 星座key]，按月排序。

export const ZODIAC = {
  aries:       { nameAr: 'الحمل',   emoji: '♈', rangeAr: '٢١ مارس – ١٩ أبريل',   elementAr: 'ناري',  trait: 'جريء، نشيط، ومبادر يحب التحدي والقيادة.' },
  taurus:      { nameAr: 'الثور',   emoji: '♉', rangeAr: '٢٠ أبريل – ٢٠ مايو',    elementAr: 'ترابي', trait: 'صبور، عملي، ويقدّر الاستقرار والجمال.' },
  gemini:      { nameAr: 'الجوزاء', emoji: '♊', rangeAr: '٢١ مايو – ٢٠ يونيو',    elementAr: 'هوائي', trait: 'اجتماعي، فضولي، وسريع البديهة ومحب للتواصل.' },
  cancer:      { nameAr: 'السرطان', emoji: '♋', rangeAr: '٢١ يونيو – ٢٢ يوليو',   elementAr: 'مائي',  trait: 'عاطفي، حنون، ومرتبط بالعائلة والبيت.' },
  leo:         { nameAr: 'الأسد',   emoji: '♌', rangeAr: '٢٣ يوليو – ٢٢ أغسطس',   elementAr: 'ناري',  trait: 'واثق، كريم، ويحب الظهور والتقدير.' },
  virgo:       { nameAr: 'العذراء', emoji: '♍', rangeAr: '٢٣ أغسطس – ٢٢ سبتمبر',  elementAr: 'ترابي', trait: 'دقيق، منظّم، وعملي يهتم بالتفاصيل.' },
  libra:       { nameAr: 'الميزان', emoji: '♎', rangeAr: '٢٣ سبتمبر – ٢٢ أكتوبر', elementAr: 'هوائي', trait: 'دبلوماسي، محب للعدل والتوازن والجمال.' },
  scorpio:     { nameAr: 'العقرب',  emoji: '♏', rangeAr: '٢٣ أكتوبر – ٢١ نوفمبر', elementAr: 'مائي',  trait: 'عميق، شغوف، وقوي الإرادة والغموض.' },
  sagittarius: { nameAr: 'القوس',   emoji: '♐', rangeAr: '٢٢ نوفمبر – ٢١ ديسمبر', elementAr: 'ناري',  trait: 'متفائل، محب للحرية والمغامرة والسفر.' },
  capricorn:   { nameAr: 'الجدي',   emoji: '♑', rangeAr: '٢٢ ديسمبر – ١٩ يناير',  elementAr: 'ترابي', trait: 'طموح، منضبط، ومسؤول يسعى للنجاح.' },
  aquarius:    { nameAr: 'الدلو',   emoji: '♒', rangeAr: '٢٠ يناير – ١٨ فبراير',  elementAr: 'هوائي', trait: 'مستقل، مبتكر، وإنساني يفكّر خارج الصندوق.' },
  pisces:      { nameAr: 'الحوت',   emoji: '♓', rangeAr: '١٩ فبراير – ٢٠ مارس',   elementAr: 'مائي',  trait: 'حالم، حسّاس، وخيالي محب للفن والتعاطف.' },
};

// 每个月中「新星座开始」的日期与星座。按月 1–12 排序。
export const ZODIAC_BOUNDARIES = [
  [1, 20, 'aquarius'],
  [2, 19, 'pisces'],
  [3, 21, 'aries'],
  [4, 20, 'taurus'],
  [5, 21, 'gemini'],
  [6, 21, 'cancer'],
  [7, 23, 'leo'],
  [8, 23, 'virgo'],
  [9, 23, 'libra'],
  [10, 23, 'scorpio'],
  [11, 22, 'sagittarius'],
  [12, 22, 'capricorn'],
];
