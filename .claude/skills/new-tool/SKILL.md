---
name: new-tool
description: Use when 要为 HijriTools 新增一个计算类(calc)或法规类(regulatory)工具页、新建 /slug/ 路由时。例如 BMI、理想体重、房贷、TDEE、饮水量、违章罚款查询等新工具的开发脚手架。
disable-model-invocation: true
---

# 新工具脚手架(new-tool)

把 CLAUDE.md「新工具开发流程」固化为可执行清单。**计算正确性由测试保证(Owner 无法校对),阿语由 Claude 生成。** 用法:`/new-tool <工具中文名/阿语词/公式说明>`。

## 铁律(违反任意一条即返工)

1. **TDD 先行**:先写 `tests/<tool>.test.js` 跑 `npm test` 确认 **RED**,再写 `src/lib/<tool>.js` 到 **GREEN**。不准先写实现。
2. **数据/算法分离**:纯函数(DOM 无关)进 `src/lib/`;事实进 `src/data/`(标来源+日期)。**判据:只有会随法规/时间/地区变化的事实**(税率、国家列表、罚款额)才进 data;**数学公式的固有常数**(BMI 系数、Hamwi 的 48/2.7 等)不变,直接留在 lib,别建无谓的 data 文件。
3. **单一数据源**:工具元数据只加在 `src/data/tools.js`;新增国家在 `src/data/countries.js`。sitemap/导航/相关链接自动汇总,**不要手改 sitemap**。
4. **客户端脚本**:交互写在 `.astro` 页面底部 `<script>`(Astro 打包为 module,可 `import` lib)。**禁止 `<script define:vars>` 配合 `import`**——会静默失败;传服务端值用 `data-*` 属性(见 `src/pages/vat/[country].astro`)。
5. **SEO 每页必须**:`<html lang="ar" dir="rtl">`、title、meta description、唯一 h1、canonical、JSON-LD(经 `ToolLayout.astro` + `src/lib/seo.js` 注入);内链 ≥3 用 `RelatedTools`;按工具类型挂 `Disclaimer`(health/regulatory 变体)。
6. **RTL**:CSS 一律逻辑属性(`margin-inline-start` 等);数字/计算结果**必须**套 `.num`(`dir:ltr`)防错乱。`src/lib/numerals.js`(东/西阿拉伯数字切换)是**可选显示开关**——默认西数字 0-9 + `.num` 已满足防错乱,现有计算页均未引入,无特殊需求不必用。
7. **伊历**:任何日期换算只走 `src/lib/hijri.js` 封装,**不要直接用库的 `.date` Date 对象**(UTC 构建机会差 1 天)。

## 步骤

1. **元数据**:在 `src/data/tools.js` 加一条(`slug/titleAr/shortAr/descAr/category/type/icon/related`,上线后 `live:true`)。`type` = `'calc'` 或 `'regulatory'`。**必填 `updated:'YYYY-MM-DD'`**(当天上线日)——sitemap 的 lastmod 用它;漏填该页就没有 lastmod。日后实质改了内容时同步更新此日期(切勿写成构建日)。
2. **测试 RED**:写 `tests/<tool>.test.js`,覆盖公式边界 + 锚点 → `npm test` 看红。**锚点必须来自独立来源或手算,绝不能用待测实现反推**——Owner 无法校对,锚点错了 TDD 形同虚设。
3. **实现 GREEN**:写 `src/lib/<tool>.js` 纯函数 → `npm test` 看绿。
4. **页面**:建 `src/pages/<slug>/index.astro`,套 `ToolLayout` + 复用组件 + 底部 module `<script>`。法规类多国页用 `getStaticPaths` + `[country].astro`。
   - **Disclaimer 必须显式选 variant**:健康/医疗类→`health`(含「不替代医生」),法规/税务类→`regulatory`,纯计算才用默认。漏传会让健康工具丢失法律关键文案——最易静默踩偏处。
   - `AdSlot` 只放结果**下方** + 页面底部,绝不放结果上方/弹窗。
   - `related` 必须是 tools.js 里**已存在**的 slug(≥3),否则 `RelatedTools` 渲染空白。
5. **验证**:`npm run build` 通过;确认新页进了 `npm run dev` 的 `/sitemap.xml`。

## 活模板(照抄改名,别造死模板)

| 场景 | 参考现有文件 |
|------|------------|
| 最简计算工具(lib+test+页面) | `src/lib/percentage.js`、`tests/percentage.test.js`、`src/pages/percentage/index.astro` |
| 健康类(挂 health Disclaimer) | `src/pages/pregnancy/index.astro` |
| 法规多国分页(getStaticPaths) | `src/data/vat.js`、`src/pages/vat/[country].astro` |
| 依赖第三方库的前端工具 | `src/pages/qrcode/index.astro`、`src/lib/qrcode-helpers.js` |
| 用伊历的工具 | `src/lib/hijri.js` 锚点见 `tests/hijri.test.js` |

## Common Mistakes

| 症状 | 原因 / 修正 |
|------|-----------|
| 页面交互无反应、import 静默失效 | 用了 `<script define:vars>` + import → 改纯底部 module script,服务端值走 `data-*` |
| 构建机日期差 1 天 | 直接用了 `@umalqura/core` 的 `.date` → 改走 `hijri.js` 封装 |
| 新工具不在 sitemap/导航 | 没加 `src/data/tools.js`(或漏 `live:true`)→ 单一数据源补齐 |
| 计算结果在 RTL 下数字乱序 | 没套 `.num`(`dir:ltr`) |
| 先写实现再补测试 | 违反 TDD 铁律 → 删实现,先 RED |
