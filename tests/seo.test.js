import { describe, it, expect } from 'vitest';
import {
  webAppJsonLd,
  faqJsonLd,
  breadcrumbJsonLd,
  websiteJsonLd,
  organizationJsonLd,
  graph,
} from '../src/lib/seo.js';

const SITE = 'https://hijritools.com';

describe('breadcrumbJsonLd', () => {
  it('按顺序生成 ListItem，position 从 1 起，item 为绝对 URL', () => {
    const bc = breadcrumbJsonLd([
      { name: 'الرئيسية', path: '/' },
      { name: 'حاسبة العمر', path: '/age/' },
    ]);
    expect(bc['@type']).toBe('BreadcrumbList');
    expect(bc.itemListElement).toHaveLength(2);
    expect(bc.itemListElement[0]).toMatchObject({
      '@type': 'ListItem',
      position: 1,
      name: 'الرئيسية',
      item: `${SITE}/`,
    });
    expect(bc.itemListElement[1]).toMatchObject({
      position: 2,
      item: `${SITE}/age/`,
    });
  });
});

describe('websiteJsonLd / organizationJsonLd', () => {
  it('WebSite 含名称与绝对 URL，语言为 ar', () => {
    const w = websiteJsonLd();
    expect(w['@type']).toBe('WebSite');
    expect(w.url).toBe(`${SITE}/`);
    expect(w.inLanguage).toBe('ar');
  });
  it('Organization 含 logo 绝对 URL', () => {
    const o = organizationJsonLd();
    expect(o['@type']).toBe('Organization');
    expect(o.logo).toMatch(/^https:\/\/hijritools\.com\//);
  });
});

describe('graph', () => {
  it('包装为 @context + @graph，并过滤 falsy 节点', () => {
    const g = graph(websiteJsonLd(), null, organizationJsonLd());
    expect(g['@context']).toBe('https://schema.org');
    expect(g['@graph']).toHaveLength(2);
  });
});

describe('webAppJsonLd / faqJsonLd（回归）', () => {
  it('WebApplication 含绝对 url 与免费 offer', () => {
    const a = webAppJsonLd({ name: 'x', description: 'd', path: '/age/' });
    expect(a['@type']).toBe('WebApplication');
    expect(a.url).toBe(`${SITE}/age/`);
    expect(a.offers.price).toBe('0');
  });
  it('FAQPage 把 q/a 映射为 Question/Answer', () => {
    const f = faqJsonLd([{ q: 'س', a: 'ج' }]);
    expect(f['@type']).toBe('FAQPage');
    expect(f.mainEntity[0].name).toBe('س');
    expect(f.mainEntity[0].acceptedAnswer.text).toBe('ج');
  });
});
