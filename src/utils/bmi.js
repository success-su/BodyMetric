const KG_PER_LB = 0.45359237;
const CM_PER_INCH = 2.54;
export function toKg(value, unit) {
  return unit === 'lb' ? value * KG_PER_LB : value;
}

export function toMeters(value, unit) {
  const cm = unit === 'in' ? value * CM_PER_INCH : value;
  return cm / 100;
}

export function calculateBmi(weight, weightUnit, height, heightUnit) {
  const kg = toKg(weight, weightUnit);
  const meters = toMeters(height, heightUnit);
  if (!kg || !meters || kg <= 0 || meters <= 0) return null;
  return kg / (meters * meters);
}

export function bmiCategory(bmi) {
  if (bmi === null) return null;
  if (bmi < 18.5) {
    return { label: 'Underweight', color: '#3B82F6' };
  }
  if (bmi < 25) {
    return { label: 'Normal', color: '#22C55E' };
  }
  if (bmi < 30) {
    return { label: 'Overweight', color: '#F59E0B' };
  }
  return { label: 'Obese', color: '#EF4444' };
}
