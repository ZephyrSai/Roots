// Time model. Years are astronomical-ish: negative = BCE, positive = CE.
// Deep time (before ~8000 BCE) is shown as "years ago".
export const NOW = 2026;
export const T_MIN = -72000;
export const T_MAX = 2026;

// Piecewise-linear "story" scale: deep time is compressed, recent millennia stretched.
const KNOTS = [
  [-72000, 0.0],
  [-12000, 0.15],
  [-4000, 0.36],
  [-1000, 0.60],
  [500, 0.78],
  [T_MAX, 1.0],
];

export function yearToU(y) {
  if (y <= KNOTS[0][0]) return 0;
  for (let i = 1; i < KNOTS.length; i++) {
    const [y1, u1] = KNOTS[i];
    const [y0, u0] = KNOTS[i - 1];
    if (y <= y1) return u0 + (u1 - u0) * (y - y0) / (y1 - y0);
  }
  return 1;
}
export function uToYear(u) {
  u = Math.max(0, Math.min(1, u));
  for (let i = 1; i < KNOTS.length; i++) {
    const [y1, u1] = KNOTS[i];
    const [y0, u0] = KNOTS[i - 1];
    if (u <= u1) return y0 + (y1 - y0) * (u - u0) / (u1 - u0);
  }
  return T_MAX;
}

const nf = new Intl.NumberFormat('en-US');
export function fmtYear(y, short = false) {
  y = Math.round(y);
  if (y < -8000) {
    const ago = Math.round((NOW - y) / 1000) * 1000;
    return short ? `${Math.round(ago / 1000)}k ya` : `${nf.format(ago)} years ago`;
  }
  if (y < 0) {
    const v = -y >= 1000 ? Math.round(-y / 10) * 10 : -y;
    return `${nf.format(v)} BCE`;
  }
  if (y === 0) return '1 CE';
  return y < 1000 ? `${y} CE` : `${y}`;
}
export function fmtRange(a, b) {
  if (a == null) return '';
  if (b == null || b >= NOW - 1) return `${fmtYear(a)} →`;
  if (a < -8000 || b < -8000) return `${fmtYear(a)} – ${fmtYear(b)}`;
  if (a < 0 && b < 0) return `${nf.format(-Math.round(a))}–${nf.format(-Math.round(b))} BCE`;
  if (a < 0) return `${nf.format(-Math.round(a))} BCE – ${fmtYear(b)}`;
  return `${a}–${b} CE`;
}

export const ERAS = [
  { from: -72000, to: -10000, name: 'Palaeolithic', tint: '#2a2440' },
  { from: -10000, to: -3300, name: 'Neolithic', tint: '#1f3330' },
  { from: -3300, to: -1200, name: 'Bronze Age', tint: '#3a2e1c' },
  { from: -1200, to: -300, name: 'Iron Age', tint: '#2b2f38' },
  { from: -300, to: 600, name: 'Classical', tint: '#2c2236' },
  { from: 600, to: 1500, name: 'Medieval', tint: '#23303a' },
  { from: 1500, to: 2026, name: 'Modern', tint: '#30262a' },
];

export const smooth = (a, b, x) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
export const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
