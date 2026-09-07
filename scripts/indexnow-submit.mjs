#!/usr/bin/env node
/**
 * IndexNow 常态化推送脚本 —— hijritools.com
 *
 * 用途：每次部署后，把全站 URL 一次性推给 IndexNow（Bing / Yandex / Naver /
 *       Seznam 等搜索引擎联盟），加速收录。hijritools 无后端、纯静态，sitemap
 *       由 src/pages/sitemap.xml.js 生成，本脚本直接读「线上」 sitemap 全量提交。
 *
 * 用法：
 *   node scripts/indexnow-submit.mjs
 *       # 读取 https://hijritools.com/sitemap.xml，全量分批提交
 *   node scripts/indexnow-submit.mjs --dry-run
 *       # 只打印将要提交的 URL 与批次，不发任何请求
 *   node scripts/indexnow-submit.mjs --url https://hijritools.com/foo/ https://hijritools.com/bar/
 *       # 只提交指定 URL（新页面上线后快速催收录）
 *   node scripts/indexnow-submit.mjs --sitemap https://hijritools.com/sitemap.xml
 *       # 覆盖默认 sitemap 地址
 *   node scripts/indexnow-submit.mjs --batch 50
 *       # 覆盖每批 URL 数（默认 100，上限 10000）
 *
 * 说明：
 *   - IndexNow 单请求上限 10000 URL；本脚本默认按 100 一批分批发送。
 *   - 重复提交是幂等安全的（IndexNow 设计为可重复通知，URL 无变化时无副作用）。
 *   - key 文件已部署在站点根目录 https://hijritools.com/<KEY>.txt，
 *     key + keyLocation 已实测返回 HTTP 202 生效。
 *   - 返回码：200 = 已接收，202 = 已排队，403 = key/host 不符，429 = 触发限流。
 */

const HOST = 'hijritools.com';
const KEY = '3984a20c2a38fe7d2dea90fa36c9741b';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const DEFAULT_SITEMAP = `https://${HOST}/sitemap.xml`;
const DEFAULT_BATCH_SIZE = 100;      // 每批 URL 数
const MAX_URLS_PER_REQUEST = 10000;  // IndexNow 单请求硬上限
const BATCH_DELAY_MS = 500;          // 批次间间隔，避免触发限流

function log(msg) {
  const ts = new Date().toLocaleTimeString('zh-CN', { hour12: false });
  console.log(`[${ts}] ${msg}`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 解析命令行参数。
 * 返回 { urls, sitemap, batch, dryRun, help }。
 *   - 所有位置参数（非 --flag）视为要提交的 URL；`--url` 是可选显式标记。
 *   - 无任何 URL 位置参数时，从 sitemap 全量抓取。
 */
function parseArgs(argv) {
  const opts = {
    urls: [],
    sitemap: DEFAULT_SITEMAP,
    batch: DEFAULT_BATCH_SIZE,
    dryRun: false,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') {
      opts.dryRun = true;
    } else if (a === '--help' || a === '-h') {
      opts.help = true;
    } else if (a === '--sitemap') {
      opts.sitemap = argv[++i];
      if (!opts.sitemap) throw new Error('--sitemap 需要一个 URL 参数');
    } else if (a === '--batch') {
      const n = Number(argv[++i]);
      if (!Number.isInteger(n) || n < 1 || n > MAX_URLS_PER_REQUEST) {
        throw new Error(`--batch 需为 1..${MAX_URLS_PER_REQUEST} 的整数，收到 "${argv[i]}"`);
      }
      opts.batch = n;
    } else if (a === '--url') {
      // 可选标记：后续位置参数即 URL（无它也兼容裸 URL 位置参数）。
      continue;
    } else if (a.startsWith('--')) {
      throw new Error(`未知参数 "${a}"（可用 --dry-run / --url / --sitemap / --batch / --help）`);
    } else {
      opts.urls.push(a);
    }
  }
  if (opts.urls.length === 0) opts.urls = null; // null → 使用 sitemap
  return opts;
}

/** 抓取线上 sitemap.xml，返回全部 <loc> URL（去重、保序）。 */
async function fetchSitemapUrls(sitemapUrl) {
  log(`读取 sitemap: ${sitemapUrl}`);
  const res = await fetch(sitemapUrl, { redirect: 'follow' });
  if (!res.ok) {
    throw new Error(`sitemap 请求失败 HTTP ${res.status} ${res.statusText}`);
  }
  const xml = await res.text();
  const urls = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const u = m[1].trim();
    if (u && !urls.includes(u)) urls.push(u);
  }
  if (urls.length === 0) {
    throw new Error(`sitemap 中未解析到任何 <loc>（${sitemapUrl}）`);
  }
  return urls;
}

/** 发送一批 URL 到 IndexNow，返回 HTTP 状态码。 */
async function submitBatch(urlList) {
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });
  return res.status;
}

/** 分批提交全部 URL，返回 { sent, total, okBatches, failedBatches }。 */
async function pushToIndexNow(urls, batchSize, dryRun) {
  if (urls.length > MAX_URLS_PER_REQUEST) {
    log(`⚠️  ${urls.length} 个 URL 超过单请求上限，将按 ${batchSize}/批 分批发送`);
  }
  let sent = 0;
  let okBatches = 0;
  let failedBatches = 0;
  const totalBatches = Math.ceil(urls.length / batchSize);

  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const batchNo = Math.floor(i / batchSize) + 1;

    if (dryRun) {
      log(`[dry-run] 批次 ${batchNo}/${totalBatches}: ${batch.length} 个 URL（不发送）`);
      for (const u of batch) console.log(`  ${u}`);
      continue;
    }

    const code = await submitBatch(batch);
    if (code === 200 || code === 202) {
      sent += batch.length;
      okBatches += 1;
      log(`批次 ${batchNo}/${totalBatches}: HTTP ${code} ✓（${batch.length} 个 URL）`);
    } else {
      failedBatches += 1;
      log(`批次 ${batchNo}/${totalBatches}: HTTP ${code} ✗（${batch.length} 个 URL）`);
    }

    // 非最后一批时，间隔一下避免限流。
    if (i + batchSize < urls.length) await sleep(BATCH_DELAY_MS);
  }
  return { sent, total: urls.length, okBatches, failedBatches };
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.help) {
    console.log(`IndexNow 推送脚本 —— ${HOST}
用法见脚本头部注释，或：
  node scripts/indexnow-submit.mjs [--dry-run] [--url <u> ...] [--sitemap <url>] [--batch <n>]`);
    process.exit(0);
  }

  log('🚀 IndexNow 推送开始');
  const urls = opts.urls ?? (await fetchSitemapUrls(opts.sitemap));
  log(`共 ${urls.length} 个 URL${opts.dryRun ? '（dry-run，不会发送）' : ''}`);

  const { sent, total, okBatches, failedBatches } = await pushToIndexNow(
    urls,
    opts.batch,
    opts.dryRun
  );

  if (opts.dryRun) {
    log(`✅ dry-run 完成，共 ${total} 个 URL 待提交（${Math.ceil(total / opts.batch)} 批）`);
    process.exit(0);
  }

  log(`完成：成功推送 ${sent}/${total} 个 URL（${okBatches} 批成功${failedBatches ? `，${failedBatches} 批失败` : ''}）`);
  if (failedBatches > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(`❌ 错误: ${err.message}`);
  process.exit(1);
});
