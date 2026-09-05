// 自动生成 sitemap.xml：从 tools.js 汇总所有页面（含法规工具的每国页）。
// 数据源：tools.js（工具/分类）、blog.js（博客）、traffic-violations.js（交通分类）、retirement-careers.js（退休职业）。
// 新增工具/国家/文章后无需手改，构建时自动包含。
import { liveTools, categoryNamesAr } from '../data/tools.js';
import { blogPosts } from '../data/blog.js';
import { categoryList } from '../data/traffic-violations.js';
import { retirementCareerList } from '../data/retirement-careers.js';

const SITE = 'https://hijritools.com';

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
    // 日历等 staticPaths 工具：逐条落地。
    if (Array.isArray(t.staticPaths)) {
      for (const p of t.staticPaths) entries.push({ loc: p, lastmod: t.updated ?? null });
      continue;
    }
    // 带 href 的工具（如 traffic-sa 落地 /traffic/sa/）：尊重 href，不再按 slug/countries 生成。
    if (t.href) {
      entries.push({ loc: t.href, lastmod: t.updated ?? null });
      if (t.slug === 'traffic-sa') {
        for (const c of categoryList) entries.push({ loc: `/traffic/sa/${c.id}/`, lastmod: t.updated ?? null });
      }
      continue;
    }
    entries.push({ loc: `/${t.slug}/`, lastmod: t.updated ?? null });
    if (t.type === 'regulatory' && Array.isArray(t.countries)) {
      for (const cc of t.countries) entries.push({ loc: `/${t.slug}/${cc}/`, lastmod: t.updated ?? null });
    }
    // 退休工具：除 /retirement/ 外，另有各职业落地页。
    if (t.slug === 'retirement') {
      for (const c of retirementCareerList) entries.push({ loc: `/retirement/${c.code}/`, lastmod: t.updated ?? null });
    }
  }

  // 博客：索引 + 全部文章（单一数据源 blog.js）。
  const blogDates = blogPosts.map((p) => p.date).filter(Boolean).sort();
  entries.push({ loc: '/blog/', lastmod: blogDates.at(-1) ?? null });
  for (const p of blogPosts) {
    entries.push({ loc: `/blog/${p.slug}/`, lastmod: p.lastmod ?? p.date ?? null });
  }

  // 分类汇总页
  for (const slug of Object.keys(categoryNamesAr)) {
    entries.push({ loc: `/category/${slug}/`, lastmod: '2026-06-28' });
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
