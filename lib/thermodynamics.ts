/** SI internally; p in kPa times V in litres is numerically joules. */
export const R = 8.314462618;
export function heating(q: number, n = 0.1, t0 = 300, p0 = 100) {
  const v0 = n * R * t0 / p0;
  const dtV = 2 * q / (3 * n * R);
  const dtP = 2 * q / (5 * n * R);
  return { v0, fixed: { t: t0 + dtV, v: v0, p: p0 * (t0 + dtV) / t0, du: q, work: 0 },
    moving: { t: t0 + dtP, v: n * R * (t0 + dtP) / p0, p: p0, du: 3 * q / 5, work: 2 * q / 5 } };
}
export function energyParts(rotations: number, modes: number, n: number, t: number) {
  return { translation: 1.5 * n * R * t, rotation: rotations / 2 * n * R * t,
    vibration: modes * n * R * t, f: 3 + rotations + 2 * modes };
}
export function twoPaths() {
  const du = 1.5 * (200 * 3 - 100 * 1);
  return [200, 100].map(p => ({ work: p * 2, du, q: du + p * 2 }));
}
export function workProcess(endV: number, variable: boolean, slices: number) {
  const pressure = (v: number) => variable ? 200 / v : 100;
  const dv = (endV - 2) / slices;
  const rectangles = Array.from({ length: slices }, (_, i) => ({ v: 2 + i * dv, dv, p: pressure(2 + i * dv) }));
  return { rectangles, approximate: rectangles.reduce((sum, r) => sum + r.p * r.dv, 0),
    exact: variable ? 200 * Math.log(endV / 2) : 100 * (endV - 2), pressure };
}
