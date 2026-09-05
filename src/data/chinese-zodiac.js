// 中国十二生肖数据（阿语）。按公历出生年查。锚点：2020 年 = 鼠（الفأر）。
// 顺序即生肖循环顺序，索引 = ((year - 4) % 12 + 12) % 12。

export const CHINESE_ZODIAC = [
  { key: 'rat',     nameAr: 'الفأر',    emoji: '🐀', trait: 'ذكي، سريع البديهة، ومدبّر بارع.' },
  { key: 'ox',      nameAr: 'الثور',    emoji: '🐂', trait: 'مجتهد، صبور، وموثوق يعتمد عليه.' },
  { key: 'tiger',   nameAr: 'النمر',    emoji: '🐅', trait: 'شجاع، واثق، ومحب للتحدي والقيادة.' },
  { key: 'rabbit',  nameAr: 'الأرنب',   emoji: '🐇', trait: 'لطيف، هادئ، وحذر يحب السلام.' },
  { key: 'dragon',  nameAr: 'التنين',   emoji: '🐉', trait: 'قوي، طموح، ومفعم بالحيوية والكاريزما.' },
  { key: 'snake',   nameAr: 'الأفعى',   emoji: '🐍', trait: 'حكيم، غامض، وعميق التفكير.' },
  { key: 'horse',   nameAr: 'الحصان',   emoji: '🐎', trait: 'نشيط، محب للحرية، واجتماعي مغامر.' },
  { key: 'goat',    nameAr: 'الخروف',   emoji: '🐑', trait: 'حنون، مبدع، ومسالم يحب الفن.' },
  { key: 'monkey',  nameAr: 'القرد',    emoji: '🐒', trait: 'ذكي، مرح، وسريع الحيلة والابتكار.' },
  { key: 'rooster', nameAr: 'الديك',    emoji: '🐓', trait: 'دقيق، صريح، وواثق ومنظّم.' },
  { key: 'dog',     nameAr: 'الكلب',    emoji: '🐕', trait: 'وفيّ، صادق، وحامٍ يهتم بالآخرين.' },
  { key: 'pig',     nameAr: 'الخنزير',  emoji: '🐖', trait: 'كريم، طيّب القلب، ومتفائل يحب الحياة.' },
];

// 索引偏移：2020 % 12 = 4，而 2020 是鼠（索引 0），故 index = (year - 4) mod 12。
export const ZODIAC_YEAR_OFFSET = 4;
