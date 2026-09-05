# hijritools

> 面向海湾六国（GCC）的阿拉伯语（RTL）在线工具站。

## 核心信息
- **域名**：https://hijritools.com
- **用途**：阿拉伯语计算/换算工具站（伊历换算、VAT、天课、遗产、孕期、BMI 等），Google 自然搜索引流 + 广告变现（当前线上无广告，是否接 AdSense 由 Owner 决定）
- **目标用户**：海湾六国（GCC）阿拉伯语用户，可扩展
- **站点语言**：阿拉伯语（RTL）；开发沟通用中文（Owner 不懂阿语，页面阿语由 AI 生成并须过审）
- **GitHub**：`rusherxie-sudo/hijritools`（main，public）

## 技术栈
- Astro 4（纯静态 SSG）+ Vanilla JS（无 TypeScript）+ vitest + `@umalqura/core`（乌姆库拉伊历）+ jsbarcode + qrcode
- 包管理器：npm
- 单一数据源：`src/data/tools.js`（工具元数据）、`src/data/blog.js`（博客 20 篇）、`src/data/countries.js`；数据与算法分离（`src/data`=事实，`src/lib`=算法）
- 计算逻辑 TDD，测试是唯一正确性保证

## 部署
- Cloudflare Pages 项目 `hijritools`（account `c298aa412970652ea303af17f5d82617`），生产分支 main
- GitHub Actions `deploy.yml`：verify（npm test + build）→ `cloudflare/pages-action` 部署。需仓库 Secrets：`CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID`（均已配置，2026-09-06）
- 回退：Cloudflare 后台部署历史一键回退（不依赖 git）

## 数据依赖
- 无后端/数据库，纯静态

## 页面规模
- 90 个已构建 URL = 首页 + 信任页(4) + 38 个 live 工具（含 /calendar/1447-49、/traffic/sa/ + 7 分类、/retirement/ + 5 职业、/vat/{6 国}）+ 20 篇 blog + 6 个分类页
- sitemap.xml 由 `src/pages/sitemap.xml.js` 单一数据源驱动（tools.js + blog.js + traffic-violations + retirement-careers），与 dist 页面一一对应，0 死链
- 已上线 A 级工具：伊历换算/年龄/日期差/孕期/百分比/VAT 六国等 38 个

## SEO 结构
- sitemap.xml（数据源驱动，真实 lastmod，不含死链）
- robots.txt：AI crawler 允许 + Bytespider/CCBot 阻止
- `<html lang="ar" dir="rtl">`、canonical、JSON-LD（WebApplication/Article/FAQPage）
- RTL：CSS 逻辑属性，数字用 `.num`（dir:ltr）
- 分析：GA4 `G-EW5LTTLXTY`（仅生产注入）+ GSC + Bing Webmaster（Google/Bing 双口径）

## 权威文档
- `CLAUDE.md`（项目宪法：技术栈/铁律/开发流程/风险分级，最全）
- `docs/`：design-brief、交接文档、后续开发计划、research/（SEMrush 中东调研）
- `PROJECT.md`（本文，本质档案）

## 历史轨迹
- 主体内容 2026-06 上线（手动 wrangler 部署）；2026-09-05 接入 GitHub Actions 自动部署并补全仓库 Secret（此前后端可自动部署）
- 2026-09-06：修复 sitemap/博客索引一致性——移除 2 死链、/blog/ 与 sitemap 补全至 90 页全量覆盖

## 尚未做（按风险分级，需先满足前置条件）
- **天课计算器增强 / 实时金价**（需金价 CI + 教法权威来源 + 阿语审校）
- **劳工赔偿 / 离职补偿金六国**（需各国法条权威来源 + 人工验证，沙特先行）
