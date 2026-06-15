// QR/条形码生成器的纯逻辑（与库无关，可单测）。库本身在浏览器页面脚本里调用。

const QR_MAX = 1000;       // QR 文本上限（过长不可扫）
const BARCODE_MAX = 80;    // CODE128 合理上限

/**
 * 校验/清洗输入。
 * @param {string} raw 原始输入
 * @param {'qr'|'barcode'} mode 模式
 * @returns {{ok:boolean, value?:string, error?:string}}
 */
export function sanitizeInput(raw, mode = 'qr') {
  const value = typeof raw === 'string' ? raw.trim() : '';
  if (!value) return { ok: false, error: 'يرجى إدخال نص أو رابط.' };
  const max = mode === 'barcode' ? BARCODE_MAX : QR_MAX;
  if (value.length > max) return { ok: false, error: `النص طويل جدًا (الحد ${max} حرفًا).` };
  return { ok: true, value };
}

/**
 * 从输入生成安全的 PNG 下载文件名。
 * @param {string} text 输入文本
 * @param {'qr'|'barcode'} mode
 * @returns {string}
 */
export function buildFileName(text, mode = 'qr') {
  const base = mode === 'barcode' ? 'barcode' : 'qr';
  const slug = (typeof text === 'string' ? text : '')
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/[^a-zA-Z0-9؀-ۿ]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return slug ? `${base}-${slug}.png` : `${base}.png`;
}
