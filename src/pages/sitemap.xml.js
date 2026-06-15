// 自动生成 sitemap.xml：从 tools.js 汇总所有页面（含法规工具的每国页）。
// 新增工具/国家后无需手改，构建时自动包含。
import { liveTools } from '../data/tools.js';

const SITE = 'https://hijritools.com';

export function GET() {
  const urls = ['/']; // 首页

  for (const t of liveTools) {
    // 特殊路径工具（如伊历日历 /calendar/1447/）用 staticPaths 显式声明。
    if (Array.isArray(t.staticPaths)) {
      for (const p of t.staticPaths) urls.push(p);
      continue;
    }
    urls.push(`/${t.slug}/`);
    if (t.type === 'regulatory' && Array.isArray(t.countries)) {
      for (const cc of t.countries) urls.push(`/${t.slug}/${cc}/`);
    }
  }

  const lastmod = new Date().toISOString().slice(0, 10);
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${SITE}${u}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n') +
    `\n</urlset>\n`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
