# CLAUDE.md — HijriTools 项目宪法

## 关于本项目
阿拉伯语（RTL）工具站 hijritools.com。面向海湾六国（可扩展），Google 自然搜索引流 + AdSense 变现。
Astro 纯静态 → Cloudflare Pages。设计/竞品/风险文档见 `docs/superpowers/specs/2026-06-14-hijritools-design.md`。

## 语言
- 与 Owner 的对话和所有中文文档：**一律中文**（Owner 不懂阿拉伯语，无法校对阿语）。
- 页面内阿语内容由 Claude 生成。

## 技术栈
- **Astro**（SSG 纯静态 HTML 输出），`trailingSlash: 'always'`，`build.format: 'directory'`。
- 计算逻辑：Vanilla JS 纯函数（`src/lib/`，不依赖 DOM）。
- 伊历：**乌姆库拉历**，依赖 `@umalqura/core`，由 `src/lib/hijri.js` 封装。
- 测试：Vitest（TDD）。部署：Cloudflare Pages。分析：GSC + GA4。
- 字体：Tajawal（首版 Google Fonts，后续可自托管 woff2 提速）。

## 必守铁律

### 计算逻辑 TDD
- 计算函数写在 `src/lib/<tool>.js` 纯函数（DOM 无关）。**先写测试确认 RED，再实现 GREEN**。
- Owner 无法校对计算正确性，测试是唯一保证。

### 伊历换算（关键陷阱）
- `@umalqura/core` 内部按**本地时区**工作；`src/lib/hijri.js` 已通过「整数 y/m/d 交换」消除时区依赖（`uqFromGregorian`/`uqDateToUtc`）。**不要直接用库的 `.date` Date 对象**，否则在 UTC 构建机上会差 1 天。
- 锚点：2026-06-14 = 1447-12-28；1447-01-01 = 2025-06-26。改动 hijri.js 后必须跑 `tests/hijri.test.js`。
- 多国偏移 `offset` = 换算前对公历加的天数；g→h→g 在同一 offset 下守恒。

### 数据与算法分离
- `src/data/` = 事实（税率/国家/节日，标注来源与日期）；`src/lib/` = 算法。法规变化只改 data。
- 工具元数据单一数据源：`src/data/tools.js`。国家注册表：`src/data/countries.js`。
- **新增国家** = 在 countries.js 加一条 + 在对应工具 data 补该国值；法规页由 `getStaticPaths` 自动生成，sitemap 自动包含。

### Astro 客户端脚本
- 工具页交互写在页面底部 `<script>`（被 Astro 打包为 module，可 `import` lib）。
- **不要用 `<script define:vars>` 配合 `import`**——define:vars 会把脚本降级为内联非模块脚本，import 静默失败。需要传服务端值时用 `data-*` 属性（见 `vat/[country].astro`）。

### SEO（每页必须）
- `<html lang="ar" dir="rtl">`、title、meta description、唯一 h1、canonical、JSON-LD（WebApplication，含 FAQ 时加 FAQPage）。由 `ToolLayout.astro` + `lib/seo.js` 统一注入。
- 内链 ≥3（`RelatedTools`）。免责声明必挂（`Disclaimer`，按工具类型）。
- 法规工具每国独立页针对本国关键词。

### RTL
- CSS 一律逻辑属性（`margin-inline-start` 等）。数字/计算结果用 `.num`（`dir:ltr`）防错乱。

## 命令
- `npm test` 测试 ｜ `npm run dev` 开发 ｜ `npm run build` 构建（dist/）｜ `npm run preview` 预览

## 已上线工具（A 级，纯计算/低风险）
伊历换算 `/hijri/`、年龄 `/age/`、日期差 `/date-diff/`、孕期 `/pregnancy/`、百分比 `/percentage/`、VAT 六国 `/vat/{country}/`。

## 新工具开发流程
1. `src/data/tools.js` 加元数据（或 `live:true`）。
2. `tests/<tool>.test.js` 写测试 → `npm test` 确认 RED。
3. `src/lib/<tool>.js` 实现纯函数 → GREEN。
4. `src/pages/<slug>/index.astro`（用 ToolLayout + 组件 + 底部 module script）。
5. `npm run build` 验证。

## 尚未做（按设计文档风险分级，需先满足前置条件）
- **天课计算器**（B+C 级）：需金价 CI 流程 + 教法权威来源校验 + 阿语审校。
- **劳工赔偿六国**（C 级）：需各国法条权威来源 + 人工验证（沙特先行）。
- 详见设计文档第 1 节「能力可行性分级」与第 10 节「质量保障」。
