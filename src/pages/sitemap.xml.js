// 自动生成 sitemap.xml：从 tools.js 汇总所有页面（含法规工具的每国页）。
// 新增工具/国家后无需手改，构建时自动包含。
import { liveTools } from '../data/tools.js';

const SITE = 'https://hijritools.com';

const blogPosts = [
  { loc: '/blog/', lastmod: '2026-06-27' },
  { loc: '/blog/hijri-converter-guide/', lastmod: '2026-06-27' },
  { loc: '/blog/age-calculator-hijri/', lastmod: '2026-06-27' },
  { loc: '/blog/pregnancy-calculator-hijri/', lastmod: '2026-06-27' },
  { loc: '/blog/weighted-percentage-guide/', lastmod: '2026-06-27' },
  { loc: '/blog/zakat-calculator-guide/', lastmod: '2026-06-27' },
  { loc: '/blog/hijri-calendar-1448/', lastmod: '2026-06-27' },
];

export function GET() {
  // lastmod = 每个工具自带的 updated（内容最后实质更新日），稳定且只在真改时变化。
  // 绝不用构建日（new Date()）——那会让全站 lastmod 每次构建都变，Google 判定不可信而忽略。
  const entries = [];

  // 首页内容 = 工具列表，故其 lastmod 取所有工具 updated 的最新值。
  const dates = liveTools.map((t) => t.updated).filter(Boolean).sort();
  entries.push({ loc: '/', lastmod: dates.at(-1) ?? null });

  // 信任/信息页(非工具)。lastmod 用各自创建/更新日(静态法律页极少变)。
  for (const p of ['/about/', '/privacy/', '/contact/', '/terms/']) {
    entries.push({ loc: p, lastmod: '2026-06-16' });
  }

  for (const t of liveTools) {
    if (Array.isArray(t.staticPaths)) {
      for (const p of t.staticPaths) entries.push({ loc: p, lastmod: t.updated ?? null });
      continue;
    }
    entries.push({ loc: `/${t.slug}/`, lastmod: t.updated ?? null });
    if (t.type === 'regulatory' && Array.isArray(t.countries)) {
      for (const cc of t.countries) entries.push({ loc: `/${t.slug}/${cc}/`, lastmod: t.updated ?? null });
    }
  }

  // 博客文章
  for (const p of blogPosts) {
    entries.push(p);
  }

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    entries
      .map(({ loc, lastmod }) =>
        `  <url><loc>${SITE}${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`)
      .join('\n') +
    `\n</urlset>\n`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
