const KG_PER_LB = 0.45359237;
const CM_PER_INCH = 2.54;

export function convertWeight(value, fromUnit, toUnit) {
  if (fromUnit === toUnit) return value;
  
  const kg = fromUnit === 'lb' ? value * KG_PER_LB : value;
  return toUnit === 'lb' ? kg / KG_PER_LB : kg;
}

export function convertLength(value, fromUnit, toUnit) {
  if (fromUnit === toUnit) return value;
  const cm = fromUnit === 'in' ? value * CM_PER_INCH : value;
  return toUnit === 'in' ? cm / CM_PER_INCH : cm;
}

export function roundTo(value, decimals = 1) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
