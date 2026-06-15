// JSON-LD 结构化数据构造器。每个工具页注入 WebApplication，含 FAQ 时再加 FAQPage。

const SITE = 'https://hijritools.com';

/** 工具应用结构化数据（节点，配合 graph 使用）。 */
export function webAppJsonLd({ name, description, path, lang = 'ar' }) {
  return {
    '@type': 'WebApplication',
    name,
    description,
    url: `${SITE}${path}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    inLanguage: lang,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'SAR' },
  };
}

/** FAQ 结构化数据（节点）。faqs: [{q, a}] */
export function faqJsonLd(faqs) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/** 站点级实体（首页用）。无站内搜索，故不加 SearchAction。 */
export function websiteJsonLd() {
  return {
    '@type': 'WebSite',
    name: 'HijriTools',
    alternateName: 'أدوات هجرية',
    url: `${SITE}/`,
    inLanguage: 'ar',
  };
}

/** 品牌实体（首页用，建立 Organization 身份）。 */
export function organizationJsonLd() {
  return {
    '@type': 'Organization',
    name: 'HijriTools',
    url: `${SITE}/`,
    logo: `${SITE}/og.png`,
  };
}

/** 面包屑（节点）。items: [{name, path}]，顺序从首页到当前页。 */
export function breadcrumbJsonLd(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE}${it.path}`,
    })),
  };
}

/** 合并多个 JSON-LD 为 @graph。 */
export function graph(...nodes) {
  return { '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) };
}
