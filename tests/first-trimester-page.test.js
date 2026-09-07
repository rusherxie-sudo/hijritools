import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

const source = readFileSync(new URL('../src/pages/blog/first-trimester-pregnancy/index.astro', import.meta.url), 'utf8');

describe('孕早期文章页面', () => {
  it('包含一个与页面标题一致的 H1', () => {
    expect(source.match(/<h1\b[^>]*>/g)).toHaveLength(1);
    expect(source).toContain('<h1>{title}</h1>');
  });

  it('FAQ 不混入中文，并与结构化数据共用同一份内容', () => {
    const faqSource = source.match(/const faqs = \[([\s\S]*?)\n\];/);
    expect(faqSource).not.toBeNull();
    expect(faqSource[1]).not.toMatch(/\p{Script=Han}/u);
    expect(source).toContain('faqJsonLd(faqs)');
    expect(source).toContain('<Faq faqs={faqs} />');
  });
});
