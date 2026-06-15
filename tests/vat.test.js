import { describe, it, expect } from 'vitest';
import { addVat, removeVat } from '../src/lib/vat.js';

describe('增值税计算', () => {
  it('沙特 15%：不含税 100 → 含税 115', () => {
    const r = addVat(100, 15);
    expect(r).toEqual({ net: 100, vat: 15, gross: 115 });
  });

  it('阿联酋 5%：不含税 200 → 含税 210', () => {
    const r = addVat(200, 5);
    expect(r).toEqual({ net: 200, vat: 10, gross: 210 });
  });

  it('反推：含税 115 @15% → 不含税 100', () => {
    const r = removeVat(115, 15);
    expect(r.net).toBe(100);
    expect(r.vat).toBe(15);
  });

  it('0% 税率（卡塔尔/科威特）', () => {
    const r = addVat(100, 0);
    expect(r).toEqual({ net: 100, vat: 0, gross: 100 });
  });

  it('小数金额四舍五入到 2 位', () => {
    const r = addVat(33.33, 15);
    expect(r.vat).toBe(5.0);
    expect(r.gross).toBe(38.33);
  });
});
