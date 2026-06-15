import { describe, it, expect } from 'vitest';
import { sanitizeInput, buildFileName } from '../src/lib/qrcode-helpers.js';

describe('QR/条形码输入清洗', () => {
  it('空输入或纯空白返回 ok:false', () => {
    expect(sanitizeInput('').ok).toBe(false);
    expect(sanitizeInput('   ').ok).toBe(false);
    expect(sanitizeInput(null).ok).toBe(false);
  });

  it('正常输入返回 ok 并 trim', () => {
    const r = sanitizeInput('  hello  ');
    expect(r.ok).toBe(true);
    expect(r.value).toBe('hello');
  });

  it('超长 QR 输入被拒', () => {
    expect(sanitizeInput('x'.repeat(1001), 'qr').ok).toBe(false);
  });

  it('条形码上限更严（>80 被拒）', () => {
    expect(sanitizeInput('x'.repeat(81), 'barcode').ok).toBe(false);
    expect(sanitizeInput('x'.repeat(40), 'barcode').ok).toBe(true);
  });
});

describe('下载文件名生成', () => {
  it('从 URL 生成安全文件名', () => {
    // 协议被剥离，非字母数字（含点/斜杠）统一转连字符，文件名更安全
    expect(buildFileName('https://hijritools.com/age/', 'qr')).toBe('qr-hijritools-com-age.png');
  });

  it('空输入用默认名', () => {
    expect(buildFileName('', 'qr')).toBe('qr.png');
    expect(buildFileName('   ', 'barcode')).toBe('barcode.png');
  });

  it('条形码前缀', () => {
    expect(buildFileName('12345', 'barcode')).toBe('barcode-12345.png');
  });
});
