// 自动生成 sitemap.xml：从 tools.js 汇总所有页面（含法规工具的每国页）。
// 新增工具/国家后无需手改，构建时自动包含。
import { liveTools } from '../data/tools.js';

const SITE = 'https://hijritools.com';

export function GET() {
  // lastmod = 每个工具自带的 updated（内容最后实质更新日），稳定且只在真改时变化。
  // 绝不用构建日（new Date()）——那会让全站 lastmod 每次构建都变，Google 判定不可信而忽略。
  const entries = [];

  // 首页内容 = 工具列表，故其 lastmod 取所有工具 updated 的最新值。
  const dates = liveTools.map((t) => t.updated).filter(Boolean).sort();
  entries.push({ loc: '/', lastmod: dates.at(-1) ?? null });

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
