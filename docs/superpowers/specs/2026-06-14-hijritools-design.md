# HijriTools 设计文档（技术选型 · 竞品差异化 · 可落地规格）

> 域名 hijritools.com ｜ 定稿 2026-06-14 ｜ 语言 阿拉伯语(RTL) ｜ 市场 海湾六国起步、可扩展
> 关联调研：`/Users/jww/5kong/find/keywords/clusters/中东阿拉伯语_*`、`中东阿拉伯语_竞品SERP分析报告.md`
> 竞品产品拆解：本文档第 6 节（基于 2026-06-14 实际抓取 hijri-calendar.com / hijri-date.com / hijri.today / ummulqura.org.sa / ee3.us / ehsan.org.sa / zatca / islamic-relief / jisr.net / zenhr / qiwa / hrsd 等）

---

## 0. 一句话定位

竞品格局是「**慢而权威**（政府站）」与「**快而单薄/陈旧**（民间站）」两极。我们的取胜公式：
**官方级准确度（来源透明 + 多国可解释）× 现代级速度与 RTL 体验 × 计算深度与可视化 × SEO 内容纵深**——把竞品各自的单点强项整合进一个纯静态产品，并在「加载速度」「SEO 可爬性」「伊历年龄/多国偏移」「逐段透明计算」四点上做到全行业第一。

---

## 1. 能力可行性分级（项目最重要的一张表）

每个差异化卖点，先问"纯静态站到底做不做得到"，分三级管理，**这决定上线顺序**。

### A 级 — 纯静态天然能做好，结构性优势（最有把握，优先发）
| 卖点 | 根据 |
|------|------|
| 加载速度碾压官方站 | 官方 ummulqura.org.sa 老旧 ASP.NET 无 CDN，抓取超时；我们 Astro 预渲染 + Cloudflare CDN，LCP<1s 是确定性结果 |
| SEO 可爬性碾压 | HRSD/Qiwa 是爬虫读不到的 SPA、Qiwa 计算器还在登录墙后；Astro 输出纯 HTML，每页可完整索引 |
| 纯计算逻辑 | 伊历换算、伊历年龄、截止到某日、逐段赔偿明细、辞职折扣可视化、天课分类累加——确定性数学，Vitest TDD 锁死 |
| 前端生成类 | 分享卡片(Canvas)、PDF 导出、.ics 日历、节日高亮、JSON-LD——浏览器侧执行，静态站胜任 |

### B 级 — 能做但有技术约束，靠方案绕过（接受其代价）
| 卖点 | 约束 | 方案 |
|------|------|------|
| 天课金银价 | 前端调免费金价 API 有限额/key 暴露/CORS/停服风险，不能当主力 | **CI 每日定时拉价 → 写静态 JSON → 自动重部署**（主）；前端实时 API（增强）；用户手输当日价（兜底）。三层永不卡死。接受"每日更新"而非"分钟级实时"——对按伊历年计的天课足够 |
| 礼拜时间（伊历页增强） | 需地理定位 + 天文计算，有维护成本 | 列为 P2 可选；用成熟 JS 库（adhan.js）纯前端计算 |

### C 级 — 真正风险：是"内容正确性"，且 Owner 无法校对（强制治理）
| 风险 | 危险 | 强制管控（写入开发流程，不可跳过） |
|------|------|-----------------------------------|
| 阿语地道性 | Owner 不懂阿语，无法判断措辞是否自然/有无宗教失礼 | 天课等敏感页上线前**母语者审校**；先用最稳妥标准阿语；措辞清单沉淀复用 |
| 天课教法正确性 | 算错伤用户信仰、毁信誉 | 每类资产规则**标注权威来源**（沙特 Ifta / ZATCA）；公式公开可查；免责声明；上线前对照官方计算器交叉验证 |
| 六国劳动法准确性 | 算错误导财务决策 | 每国规则**附法条出处 + 依据版本/日期**；先做沙特（最易找人验证）再逐国扩；免责声明 |

> **铁律**：TDD 只能保证"代码按我给的规则跑对"。规则录错则测试全绿但结果错误。因此 C 级工具的护城河不在代码，在**权威来源 + 引用透明 + 免责**。这也是"逐段明细、法条可点开、金价标来源时间"既是体验加分，更是正确性责任的透明化。

---

## 2. 上线顺序（按 风险×回报 排，不按搜索量盲冲）

| 批次 | 工具 | 风险级 | 理由 |
|------|------|--------|------|
| **第1批（立即）** | 伊历换算/今日伊历、年龄计算器 | A | 纯历法数学，无教法/法律争议；差异点最锋利（伊历年龄、多国偏移、速度）；流量基石 |
| 第2批 | 日期差、孕期、百分比 | A | 纯计算，补全工具池与内链 |
| 第3批 | VAT 计算器（六国分页） | A/低B | 税率是公开固定数字，正确性风险低；练手"国家一等维度"架构 |
| 第4批 | 天课计算器 | B+C | 等金价 CI 流程 + 教法来源校验就绪 |
| 第5批 | 劳工赔偿（沙特先行，再扩六国） | C | 等法条来源 + 人工验证流程就绪；CPC 最高，值得做重 |
| 持续 | 交通违章（信息表）、GPA、房贷 | A | 长尾补充 |

---

## 3. 技术选型（需求 → 技术）

| 需求 | 决策 |
|------|------|
| 纯静态、无后端、无实时 API 依赖 | **Astro**：构建期出纯 HTML，零运行时框架开销，Lighthouse 易满分 |
| 工具共享布局/SEO，元数据集中 | Astro Layout+Component；`src/data/tools.js` 单一数据源 |
| 计算正确性是生命线 | 计算逻辑为 **Vanilla JS 纯函数**(`src/lib/`，不依赖 DOM) + **Vitest TDD** |
| 伊历换算 | **乌姆库拉历**库（`@umalqura/core` 或 `hijri-date`/dralshehri 算法）+ 自定义偏移层 |
| 多国伊历差异 | 乌姆库拉默认 + 全局 ±天偏移 + 各国偏移表 + 免责 |
| 至少六国、可扩展 | 国家为一等数据维度；法规工具用 `getStaticPaths` 从数据表自动生成每国页 |
| 天课金价（纯静态） | CI 每日注入静态 JSON（主）+ 前端 API（增强）+ 手输（兜底） |
| 极致 SEO | 每页 title/description/唯一 h1/canonical/JSON-LD；信息类配长文 |
| 低成本低延迟变现 | **Cloudflare Pages** + **AdSense** |
| 分析 | Google Search Console + GA4 |
| 字体 | **Tajawal** 自托管 woff2(400/500/700) |
| 分享传播（沙特 WhatsApp 渗透极高） | Canvas 出图分享卡 + URL 参数持久化 + .ics 导出 |

**与姊妹站 keisantool 的关键差异**：RTL 阿拉伯语、伊历库依赖、国家一等维度、金价 CI、C 级正确性治理。

---

## 4. 架构与数据模型

### 4.1 工具两层级
- **纯计算工具**（伊历/年龄/日期差/孕期/百分比/面积）：逻辑全球通用，仅历法偏移。**单页 + 偏移控件**，不分国。
- **法规工具**（VAT/劳工赔偿/交通违章/天课）：结果依赖各国法律/税率/价格。**每国独立页** `/{tool}/{country}/` + 总览对比页 `/{tool}/`。

### 4.2 国家注册表 `src/data/countries.js`（核心可扩展点）
```js
// 每个国家一条；新增国家 = 加一条 + 在各工具数据表补该国值，页面由 getStaticPaths 自动生成
export const countries = {
  sa: { code:'sa', nameAr:'السعودية', nameEn:'Saudi Arabia', currency:'SAR',
        hijriOffset:0,  // 相对乌姆库拉历的默认偏移（沙特=0）
        weekendStart:'fri', enabled:true },
  ae: { code:'ae', nameAr:'الإمارات', currency:'AED', hijriOffset:0, enabled:true },
  qa: { code:'qa', nameAr:'قطر',     currency:'QAR', hijriOffset:0, enabled:true },
  kw: { code:'kw', nameAr:'الكويت',  currency:'KWD', hijriOffset:0, enabled:true },
  bh: { code:'bh', nameAr:'البحرين', currency:'BHD', hijriOffset:0, enabled:true },
  om: { code:'om', nameAr:'عُمان',   currency:'OMR', hijriOffset:0, enabled:true },
  // 扩展位：eg, jo, ...（hijriOffset 可为 +1/-1，依各国月相目击习惯）
}
```

### 4.3 工具元数据 `src/data/tools.js`
```js
export const tools = [
  { slug:'hijri', titleAr:'التاريخ الهجري', category:'date', type:'calc',
    live:true, related:['age','date-diff'] },
  { slug:'age', titleAr:'حاسبة العمر', category:'date', type:'calc',
    live:true, related:['hijri','date-diff'] },
  { slug:'vat', titleAr:'حاسبة ضريبة القيمة المضافة', category:'finance', type:'regulatory',
    live:false, countries:['sa','ae','bh','om','qa','kw'], related:['zakat'] },
  { slug:'eos', titleAr:'حاسبة مكافأة نهاية الخدمة', category:'labor', type:'regulatory',
    live:false, countries:['sa','ae','qa','kw','bh','om'], related:['vat'] },
  { slug:'zakat', titleAr:'حاسبة الزكاة', category:'finance', type:'regulatory',
    live:false, countries:['sa'], related:['vat'] },
]
```

### 4.4 `data/`(事实) 与 `lib/`(算法) 分离
- `data/` = 税率/法条/国家/金价 JSON（事实，会变，标注来源与日期）
- `lib/` = 纯函数算法（由测试守护）
- 法规变化只改 `data/`，逻辑不动。

---

## 5. 项目文件结构
```
hijritools/
├── astro.config.mjs
├── package.json
├── CLAUDE.md                       # 项目宪法（中文）
├── docs/superpowers/specs/
├── .github/workflows/
│   └── update-metal-prices.yml     # 每日拉金银价 → 写 data/prices.json → 触发部署
├── public/
│   ├── robots.txt
│   ├── fonts/                      # Tajawal woff2 自托管
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── ToolLayout.astro        # <html lang=ar dir=rtl> + SEO + JSON-LD + 页眉页脚
│   ├── components/
│   │   ├── SiteHeader.astro / SiteFooter.astro
│   │   ├── RelatedTools.astro      # 自动内链 ≥3
│   │   ├── CountrySwitcher.astro   # 法规工具国家切换/对比
│   │   ├── HijriOffsetControl.astro# 伊历 ±天微调 + 各国说明卡
│   │   ├── HijriCalendarGrid.astro # 月历网格 + 节日高亮
│   │   ├── ShareCard.astro         # Canvas 分享卡 + 下载/分享
│   │   ├── ResultBreakdown.astro   # 逐段/逐项明细瀑布（赔偿/天课）
│   │   ├── SourceCitation.astro    # 法条/教法来源 + 日期 + 免责
│   │   ├── AdSlot.astro
│   │   └── Disclaimer.astro
│   ├── data/
│   │   ├── countries.js  tools.js
│   │   ├── prices.json             # CI 注入：金/银价 + 来源 + 时间戳
│   │   ├── hijri-holidays.js       # 伊历固定节日（按国家可偏移）
│   │   ├── vat.js                  # 各国税率 + 来源
│   │   ├── eos/                     # 各国劳工规则 + 法条出处
│   │   │   ├── sa.js ae.js qa.js kw.js bh.js om.js
│   │   └── zakat-rules.js          # 各类资产 nisab/税率 + 教法来源
│   ├── lib/                        # TDD 对象（纯函数）
│   │   ├── hijri.js                # 乌姆库拉换算 + 偏移 + 节日定位
│   │   ├── age.js                  # 双历年龄 + 截止日 + 下次生日
│   │   ├── zakat.js                # 分类天课 + nisab 取低 + 负债扣减
│   │   ├── eos.js                  # 离职赔偿：分段 + 辞职折扣 + 国家规则注入
│   │   ├── vat.js  date-diff.js  pregnancy.js
│   ├── pages/
│   │   ├── index.astro
│   │   ├── hijri/index.astro
│   │   ├── age/index.astro
│   │   ├── vat/{index.astro,[country].astro}
│   │   ├── eos/{index.astro,[country].astro}
│   │   └── zakat/{index.astro,[country].astro}
│   └── styles/{tokens.css, global.css}
└── tests/
    ├── hijri.test.js  age.test.js  zakat.test.js  eos.test.js  vat.test.js
```

---

## 6. 各工具差异化功能规格（基于竞品实拆，逐条可执行）

> 标注 = 竞品现状 → 我们做法。每条都要落到 `lib/` 函数或组件。

### 6.1 伊历换算 `/hijri/`（流量基石，第1批）
竞品实况：官方站慢到爬虫超时；hijri-calendar 多国偏移最强但藏下拉、无节日高亮；hijri.today 当日竟不高亮、节日塞弹窗；普遍无 JSON-LD。

| # | 规格 | 落点 |
|---|------|------|
| 1 | 今日伊历醒目显示 + 全站常驻"العودة لليوم/回到今天"按钮 | `hijri.astro` + `HijriOffsetControl` |
| 2 | 公历↔伊历**双向**，**可视日历选择器 + 手输并存**（替代竞品三级下拉） | `lib/hijri.js` + 选择器组件 |
| 3 | **多国偏移做成一等卖点**：顶部一键切国家，实时显示"本国比乌姆库拉 ±N 天"说明卡 + 依据（计算 vs 月相目击） | `countries.js.hijriOffset` + `HijriOffsetControl` |
| 4 | **月历网格内节日彩色徽标**：斋月整月底色、开斋节、宰牲节、阿拉法特日、阿舒拉、闪瓦勒六日斋、白日斋(13/14/15)；节日随选定国家偏移 | `HijriCalendarGrid` + `hijri-holidays.js` |
| 5 | 当日单元格高亮（竞品普遍缺） | `HijriCalendarGrid` |
| 6 | 东/西阿拉伯数字一键切换（١٢٣⇄123），记忆偏好 | 全局开关 |
| 7 | 实时倒计时：距斋月/宰牲节/阿拉法特日剩 X 天 X 时 | `lib/hijri.js` |
| 8 | 导出：.ics（含节日）、PDF 月历、分享卡图 | `ShareCard` + ics 生成 |
| 9 | 内容纵深 + JSON-LD(Article/FAQPage/Event)：每月解释长文 +「各国伊历为何差1天」专题 + 30+ FAQ | 内容 + Schema |
| 10 | LCP<1s（直接碾压官方站） | Astro 静态 + CDN |

### 6.2 年龄计算器 `/age/`（最快出流量，第1批）
竞品实况：ee3 输出维度多但堆噱头、移动端长滚动；**全部不支持"截止到某日"**；**无一家把"伊历年龄"做成一等输出**（穆斯林按伊历记生日）；普遍无分享卡。

| # | 规格 | 落点 |
|---|------|------|
| 1 | **伊历生日为一等输入 + 一等输出**：同屏并列「公历年龄 + 伊历年龄」(各自 年/月/日)，解释约33年差1岁 | `lib/age.js`（P0 核心差异） |
| 2 | **"截止到某指定日"任意基准日**（默认今天，可切公历/伊历目标日） | `lib/age.js`（P0，吃长尾） |
| 3 | **双历法下次生日倒计时**（公历生日 + 伊历生日各一个，秒级） | `lib/age.js` |
| 4 | 移动端首屏卡片式核心结果（年龄+下次生日+星期+星座），噱头维度（行星年龄/心跳/睡眠）收进可展开区 | 页面布局 |
| 5 | **可分享结果卡**（一键存图 + WhatsApp 分享，含水印回流） | `ShareCard` |
| 6 | 多人对比（2–4人，年龄+两两差，可整表分享） | `lib/age.js` |
| 7 | 出生星期几（地道阿语）+ 出生当天伊历 + 季节 | `lib/age.js` |
| 8 | 即时无刷新计算 + 出生日期编码进 URL（可深链分享/被索引） | 前端 + 路由 |
| 9 | JSON-LD(WebApplication/FAQPage)，标题 `حاسبة العمر بالهجري والميلادي` | Schema |

### 6.3 VAT 计算器 `/vat/{country}/`（练手国家维度，第3批）
六国税率：沙特15% / 阿联酋5% / 巴林10% / 阿曼5% / 卡塔尔0% / 科威特0%。
规格：含税↔不含税双向；每国独立页针对本国词（`ضريبة القيمة المضافة السعودية`）；`/vat/` 总览六国对比表作内链枢纽；税率在 `vat.js` 标注来源与生效日。正确性风险低（公开固定数字）。

### 6.4 天课计算器 `/zakat/`（B+C，第4批）
竞品实况：类型普遍 3–5 类，牲畜/农作物/加密货币近空白；**6/6 竞品结果不可分享/打印**；Ehsan/IslamicFinder 金价只写"上次更新"无来源（信任弱）；仅 HDF 做全负债扣减；政府站内容浅、慈善站强制导流。

| # | 规格 | 落点 |
|---|------|------|
| 1 | **金价三层方案**：CI 每日注入 prices.json（主）+ 前端 API（增强）+ 手输兜底；显示"金价更新于 HH:MM，来源 X"（透明度超 Ehsan） | `.github/workflows` + `prices.json` + `lib/zakat.js` |
| 2 | **最全类型**：现金/存款、金、银、股票(含分红)、贸易库存、投资性房产、**牲畜(骆驼/牛/羊分档)、农作物(灌溉10%/自然20%)、加密货币**，可折叠模块 | `zakat-rules.js` + `lib/zakat.js` |
| 3 | **负债扣减默认项**（借款/到期税费/欠薪/本月必付）→ 输出应税净额明细 | `lib/zakat.js` |
| 4 | **金vs银 nisab 智能取低**（85g金/595g银折算取低门槛）+ 透明说明 | `lib/zakat.js` |
| 5 | **逐项 show-the-math**：每类"金额×2.5%=应缴"逐行 + 合计 | `ResultBreakdown` |
| 6 | **结果可分享/打印/保存**（PNG/PDF + URL 参数持久化）——填补 6/6 空白 | `ShareCard` |
| 7 | Hawl 满伊历年助手：输入达 nisab 的伊历日 → 推算应缴日 + .ics 提醒 | `lib/zakat.js` + `lib/hijri.js` |
| 8 | 多币种（默认 SAR，切 AED/KWD/QAR…，与金价联动） | `countries.js` |
| 9 | **中立纯工具**：零强制捐赠漏斗；官方 ZATCA/Ehsan 作可选软引导 | 页面 |
| 10 | **C级治理**：每类资产规则标教法来源；上线前对照 ZATCA/Ehsan 交叉验证 + 阿语审校 | `SourceCitation` + 流程 |
| 11 | 阿语 + 海湾教法语境深度内容 2500+ 字 + JSON-LD(HowTo/FAQPage) | 内容 + Schema |

### 6.5 劳工离职赔偿 `/eos/{country}/`（CPC 最高，第5批）
竞品实况：Qiwa 计算器**在登录墙后**（接不住搜索流量）；HRSD/Qiwa 是爬虫读不到的 SPA；**没有一家同时做到「逐段明细 + 辞职折扣可视化 + 海湾六国完整 + 法条引用 + 静态可爬」**；ZenHR 偏黎凡特、缺巴林/阿曼；gcc-gratuity 标题占位但内容薄。

| # | 规格 | 落点 |
|---|------|------|
| 1 | **逐段计算瀑布**：前5年=半月×5×工资、第6–N年=整月×N×工资，叠加折扣求和（竞品只给单一数字） | `ResultBreakdown` + `lib/eos.js` |
| 2 | **辞职折扣比例可视化**：三档卡片高亮当前档（2–5年=1/3、5–10年=2/3、10年+=全额），辞职vs解雇并排金额差 | `lib/eos.js` + 组件 |
| 3 | **海湾六国完整规则引擎**（核心护城河）：沙特、阿联酋(Decree-Law 33/2021)、卡塔尔、科威特、巴林、阿曼，各国独立 `data/eos/{cc}.js` + 独立落地页 | `getStaticPaths` |
| 4 | **总应得 = 赔偿本体 + 未休年假折现 + 欠薪 + 代通知金**（竞品只算本体） | `lib/eos.js` |
| 5 | 辞职/解雇/合同到期三分支并排对比 + 第80/81条触发提示 | `lib/eos.js` |
| 6 | **法条逐条透明引用**（可点开阿/英原文：沙特劳动法84/85条、阿联酋 Decree-Law 33…） | `SourceCitation` |
| 7 | **免登录 + 即时结果 + URL分享 + PDF(带法条出处)**（直接打 Qiwa 登录墙软肋） | 前端 |
| 8 | 静态可爬：每国一页完整索引，标题堆"国家+2026"（学 gcc-gratuity 打法、内容做厚） | Astro SSG + Schema |
| 9 | 分步问答向导（大白话替代法条编号，后台映射80/81条） | 组件 |
| 10 | **C级治理**：每国规则附法条版本/日期；沙特先行人工验证再扩国；免责 | `SourceCitation` + 流程 |

---

## 7. 金价 CI 流程（B级关键，具体到可建）
`.github/workflows/update-metal-prices.yml`：
1. 定时（每日一次 cron）+ 手动触发。
2. 拉免费金银价源（metals.dev / goldpricez 等，key 存 GitHub Secret，**不进前端**）。
3. 写 `src/data/prices.json`：`{ gold_sar_g, silver_sar_g, source, updated_at }`。
4. commit → 触发 Cloudflare Pages 重新部署。
5. 前端读静态 JSON；另有可选前端 API 增强（实时）+ 手输兜底（API失败/超额时回退输入框 + "今日沙特金价"引导链接）。
→ 纯静态也实现"每日更新 + 来源透明 + 永不卡死"，追平 ZATCA/HDF 的"每日更新"卖点。

---

## 8. 设计系统
- **基调**：混合型——现代清爽骨架 + 局部沙特/伊斯兰文化元素。
- **主色**：沙特深绿 `#006C35`（`-dark #00532A`，`-light #E6F0EA`）；强调金 `#C8A24B`。中性大面积白底（中和官方感，深绿只用于页眉/按钮/数字结果焦点）。功能色 warning 用琥珀 `#B26A00`（避免纯红负面联想）。
- **字体**：Tajawal 自托管；`--fs-body:1.05rem`、`--lh-body:1.9`（阿拉伯文需更大字号与行高）。
- **数字**：计算结果默认拉丁数字（易读易复制），提供东阿拉伯数字显示开关。
- **RTL 铁律**：`<html lang=ar dir=rtl>`；CSS 一律逻辑属性（`margin-inline-start`/`padding-inline`/`text-align:start`）；图标随 RTL 镜像；**数字/电话/计算结果局部 `dir=ltr`** 防错乱。
- **页面骨架**（上→下）：页眉 → H1 → 简述 → 输入区(浅灰卡，法规工具含 CountrySwitcher) → 主按钮(深绿) → **结果区(浅绿卡，数字大号LTR，金色分隔)←焦点** → **AdSlot(结果正下方，点击率最高)** → 免责 → 长文/FAQ(SEO) → RelatedTools → AdSlot → 页脚。
- **广告铁律**：第一广告位在结果正下方；**绝不放结果上方、绝不弹窗/插页**（避侵入式判罚）。

---

## 9. SEO 规范（每页必须）
title / meta description / 唯一 h1 / canonical / JSON-LD；`<html lang=ar dir=rtl>`；法规工具每国页针对本国关键词；内链 ≥3（RelatedTools 自动）；信息类配长文；免责声明必挂（计算仅供参考 / 节庆以官方公告为准 / 法规与金额以官方为准）。法规工具标题堆"国家+2026"。

---

## 10. 质量保障（TDD + C级人工校验双轨）
- 计算函数为 `src/lib/<tool>.js` 纯函数；**先写测试、确认 RED，再实现 GREEN**。
- 关键测试用例：
  - `hijri`：六国偏移、跨年边界、伊历闰年、公历↔伊历双向往返、节日定位。
  - `age`：伊历年龄、截止到指定日、下次伊历生日跨年、闰年2/29生日。
  - `zakat`：金vs银 nisab 取低、负债扣减、各资产类型、2.5% 边界。
  - `eos`：辞职1/3·2/3·全额档界(满2/5/10年临界日)、解雇全额、各国规则差异、年假并入。
  - `vat`：含税↔不含税双向、0% 国家（卡塔尔/科威特）。
- **C级人工校验（强制，不可跳过）**：天课对照 ZATCA/Ehsan 交叉验证 + 阿语审校；劳工每国对照官方/法条验证（沙特先行）。`data/` 中每条法规/价格标注来源 + 日期。

---

## 11. 验收要点
- 纯静态构建，Lighthouse 性能/SEO/可访问性 ≥90，LCP<1s。
- 全站 RTL 正确，数字结果 LTR 无错乱；东/西数字切换可用。
- 伊历与沙特官方乌姆库拉一致，偏移可对齐他国。
- 每工具页 SEO 五要素齐全、内链≥3、免责在位、广告合规。
- 法规工具每国数据正确且标来源；新增国家仅改数据、页面自动生成。
- 金价三层方案可用（CI注入 / API / 手输）且来源时间透明。
- 计算函数全部有 Vitest 覆盖；C级工具完成人工校验记录。
- 差异化卖点逐条落地（伊历年龄、多国偏移、节日高亮、逐段明细、折扣可视化、分享卡）。
```
