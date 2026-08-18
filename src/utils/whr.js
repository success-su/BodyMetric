export function calculateWhr(waist, hip) {
  if (!waist || !hip || waist <= 0 || hip <= 0) return null;
  return waist / hip;
}

export function whrCategory(whr, gender) {
  if (whr === null) return null;

  if (gender === 'male') {
    if (whr <= 0.95) return { label: 'Low Risk', color: '#22C55E' };
    if (whr <= 1.0) return { label: 'Moderate Risk', color: '#F59E0B' };
    return { label: 'High Risk', color: '#EF4444' };
  }

  if (whr <= 0.8) return { label: 'Low Risk', color: '#22C55E' };
  if (whr <= 0.85) return { label: 'Moderate Risk', color: '#F59E0B' };
  return { label: 'High Risk', color: '#EF4444' };
}
