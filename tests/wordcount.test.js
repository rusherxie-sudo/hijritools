import { describe, it, expect } from 'vitest';
import {
  countWords,
  countChars,
  countCharsNoSpaces,
  countSentences,
  countParagraphs,
  countLines,
  avgWordLength,
  readingTime,
} from '../src/lib/wordcount.js';

describe('字数统计', () => {
  it('countWords: 空字符串 = 0', () => {
    expect(countWords('')).toBe(0);
  });

  it('countWords: 英文 5 个词', () => {
    expect(countWords('Hello world this is a test')).toBe(6);
  });

  it('countWords: 阿拉伯语 4 个词', () => {
    expect(countWords('مرحبا بك في موقعنا')).toBe(4);
  });

  it('countWords: 多空格合并', () => {
    expect(countWords('  hello   world  ')).toBe(2);
  });

  it('countChars: 含空格', () => {
    expect(countChars('abc def')).toBe(7);
  });

  it('countCharsNoSpaces: 不含空格', () => {
    expect(countCharsNoSpaces('abc def')).toBe(6);
  });

  it('countSentences: 3 个句子', () => {
    expect(countSentences('Sentence one. Sentence two! Sentence three?')).toBe(3);
  });

  it('countSentences: 阿拉伯语', () => {
    expect(countSentences('الاولى. الثانية! الثالثة؟')).toBe(3);
  });

  it('countParagraphs: 2 段', () => {
    expect(countParagraphs('para one\n\npara two')).toBe(2);
  });

  it('countParagraphs: 1 段（无空行）', () => {
    expect(countParagraphs('single paragraph')).toBe(1);
  });

  it('countLines: 3 行', () => {
    expect(countLines('line1\nline2\nline3')).toBe(3);
  });

  it('avgWordLength: 平均词长', () => {
    expect(avgWordLength('ab cd ef')).toBeCloseTo(2, 0);
  });

  it('readingTime: 400 词 = 2 分钟 (200 wpm)', () => {
    const longText = Array(400).fill('word').join(' ');
    expect(readingTime(longText)).toBe(2);
  });

  it('readingTime: 空文本 = 0', () => {
    expect(readingTime('')).toBe(0);
  });
});
