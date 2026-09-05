const CONVERSION = {
  m2: { m2: 1, cm2: 10000, km2: 0.000001, ft2: 10.7639, hectare: 0.0001, donum: 0.001 },
  cm2: { m2: 0.0001, cm2: 1, km2: 1e-10, ft2: 0.001076, hectare: 1e-8, donum: 1e-7 },
  km2: { m2: 1000000, cm2: 1e10, km2: 1, ft2: 10763910, hectare: 100, donum: 1000 },
  ft2: { m2: 0.092903, cm2: 929.03, km2: 9.29e-8, ft2: 1, hectare: 9.29e-6, donum: 9.29e-5 },
  hectare: { m2: 10000, cm2: 1e8, km2: 0.01, ft2: 107639, hectare: 1, donum: 10 },
  donum: { m2: 1000, cm2: 1e7, km2: 0.001, ft2: 10763.9, hectare: 0.1, donum: 1 },
};

export function rectArea(length, width) {
  return length * width;
}

export function triArea(base, height) {
  return (base * height) / 2;
}

export function circleArea(radius) {
  return Math.PI * radius * radius;
}

export function convertArea(value, fromUnit, toUnit) {
  const rate = CONVERSION[fromUnit]?.[toUnit];
  if (rate === undefined) return value;
  return value * rate;
}

export const AREA_UNITS = {
  m2: 'متر مربع',
  cm2: 'سنتيمتر مربع',
  km2: 'كيلومتر مربع',
  ft2: 'قدم مربع',
  hectare: 'هكتار',
  donum: 'دونم',
};
