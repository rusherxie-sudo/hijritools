// 字数统计/字符统计核心库。纯函数，DOM 无关。

export function countWords(text) {
  if (!text) return 0;
  const words = text.trim().split(/\s+/).filter((w) => w.length > 0);
  return words.length;
}

export function countChars(text) {
  if (!text) return 0;
  return text.length;
}

export function countCharsNoSpaces(text) {
  if (!text) return 0;
  return text.replace(/\s/g, '').length;
}

export function countSentences(text) {
  if (!text) return 0;
  const sentences = text.split(/[.。！؟!?\n]+/).filter((s) => s.trim().length > 0);
  return sentences.length;
}

export function countParagraphs(text) {
  if (!text) return 0;
  const paras = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  return paras.length > 0 ? paras.length : (text.trim().length > 0 ? 1 : 0);
}

export function countLines(text) {
  if (!text) return 0;
  return text.split('\n').length;
}

export function avgWordLength(text) {
  if (!text) return 0;
  const words = text.trim().split(/\s+/).filter((w) => w.length > 0);
  if (words.length === 0) return 0;
  const total = words.reduce((sum, w) => sum + w.length, 0);
  return Math.round((total / words.length) * 100) / 100;
}

export function readingTime(text, wordsPerMinute = 200) {
  const words = countWords(text);
  if (words === 0) return 0;
  return Math.ceil(words / wordsPerMinute);
}
