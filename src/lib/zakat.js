/**
 * Zakat calculation — simplified version.
 * Pure functions, DOM-free.
 * Only handles cash/deposits + gold. User provides gold price manually.
 * Formula: (cash + gold_weight × gold_price_per_gram) × 0.025
 */

/**
 * Calculate zakat amount.
 * @param {number} cash - Cash and bank deposits (in SAR or any currency)
 * @param {number} goldGrams - Gold weight in grams
 * @param {number} goldPricePerGram - Gold price per gram (same currency as cash)
 * @returns {{ totalWealth: number|null, zakatAmount: number|null, reachedNisab: boolean }} Zakat amount or null if invalid input
 */
export function calcZakat(cash, goldGrams, goldPricePerGram) {
  if (!Number.isFinite(cash) || !Number.isFinite(goldGrams) || !Number.isFinite(goldPricePerGram)) {
    return { totalWealth: null, zakatAmount: null, reachedNisab: false };
  }
  if (cash < 0 || goldGrams < 0 || goldPricePerGram < 0) {
    return { totalWealth: null, zakatAmount: null, reachedNisab: false };
  }

  const goldValue = goldGrams * goldPricePerGram;
  const totalWealth = cash + goldValue;
  const nisab = 85 * goldPricePerGram; // 85 grams of gold = nisab threshold
  const reachedNisab = totalWealth >= nisab;

  if (!reachedNisab) {
    return { totalWealth: cleanFloat(totalWealth), zakatAmount: 0, reachedNisab: false };
  }

  const zakatAmount = totalWealth * 0.025;
  return {
    totalWealth: cleanFloat(totalWealth),
    zakatAmount: cleanFloat(zakatAmount),
    reachedNisab: true,
  };
}

function cleanFloat(n) {
  if (!Number.isFinite(n)) return n;
  return Math.round((n + Number.EPSILON) * 1e6) / 1e6;
}
