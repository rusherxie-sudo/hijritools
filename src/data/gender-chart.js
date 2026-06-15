// 「中国清宫图」性别预测表（الجدول الصيني）。
// 来源：坊间流行的中国清宫图（Chinese Gender Chart）的一个通行版本。
// 行 = 母亲（虚岁/农历）年龄 18–45；列 = 农历/伊历受孕月份 1–12。
// 字符：'B' = ذكر（男）、'G' = أنثى（女）。
// ⚠️ 纯娱乐，无任何医学或科学依据；多个版本流传，本表仅供消遣。

export const AGE_MIN = 18;
export const AGE_MAX = 45;

// 每行 12 个字符，对应受孕月份 1..12。
export const GENDER_CHART = {
  18: 'GBGBBBBBBBBB',
  19: 'BGBGGBBGBBBB',
  20: 'GBGBBGGBGGGG',
  21: 'BGGGGGGGGGGG',
  22: 'GBBGBGBGGGGB',
  23: 'BBGBGBBGBBBG',
  24: 'BGBBGGBGGBBB',
  25: 'GBGGBBGBGGBB',
  26: 'BGBGGBGBGGGG',
  27: 'GBGBGGBGBGGB',
  28: 'BGBGGGBGBGGG',
  29: 'GBGGBGGBGBBB',
  30: 'BGGGGGGGGGGB',
  31: 'BBGGGGGGGGBG',
  32: 'BGBGGGGGGGBB',
  33: 'GBGBGGGBGGGB',
  34: 'BGBGBGGGGGGG',
  35: 'BBGBGBGGGGBB',
  36: 'GBBGBGBGBBBB',
  37: 'BGBBGBGBGBGB',
  38: 'GBGBBGBGBGBG',
  39: 'BGBGBBGBGBBG',
  40: 'GBGBGBBGBGBB',
  41: 'BGBGBGBBGBGB',
  42: 'GBGBGBGBBGBG',
  43: 'BGBGBGBGBBGB',
  44: 'BBGBGBGBGBBG',
  45: 'GBBGBGBGBGBB',
};
