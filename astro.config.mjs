import { defineConfig } from 'astro/config';

// 纯静态站点（SSG），部署到 Cloudflare Pages。
// 语言：阿拉伯语 RTL。市场：海湾六国起步、可扩展。
// sitemap 由 src/pages/sitemap.xml.js 自定义端点生成（从 tools.js 自动汇总）。
export default defineConfig({
  site: 'https://hijritools.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
