/** School examples consistently use R = 8.31 J/(mol K). p[kPa] V[L] = E[J]. */
export const SCHOOL_R = 8.31;

/** Rz(phi) Ry(theta) Rz(psi): axis direction, then rotation about that axis. */
export function orientMolecule([x, y, z]: [number, number, number], theta: number, phi: number, psi: number): [number, number, number] {
  const a = x * Math.cos(psi) - y * Math.sin(psi);
  const b = x * Math.sin(psi) + y * Math.cos(psi);
  const c = a * Math.cos(theta) + z * Math.sin(theta);
  return [c * Math.cos(phi) - b * Math.sin(phi), c * Math.sin(phi) + b * Math.cos(phi), -a * Math.sin(theta) + z * Math.cos(theta)];
}
export type ProcessKind = "isochoric" | "isobaric" | "isothermal" | "adiabatic";
export function processState(kind: ProcessKind, progress: number, s = 3) {
  const r = 1 + progress, gamma = (s + 2) / s;
  const v = kind === "isochoric" ? 2 : 2 * r;
  const p = kind === "isochoric" ? 100 * r : kind === "isobaric" ? 100 : 100 / r ** (kind === "adiabatic" ? gamma : 1);
  const t = 300 * p * v / 200;
  const du = s / 2 * (p * v - 200);
  const a = kind === "isochoric" ? 0 : kind === "isobaric" ? 100 * (v - 2) : kind === "adiabatic" ? -du : 200 * Math.log(r);
  return { p, v, t, du, a, q: du + a };
}
export function equalHeating(q: number, s = 3, nu = 0.1) {
  const cv = s / 2 * SCHOOL_R, cp = cv + SCHOOL_R, t0 = 300, p0 = 100;
  const v0 = nu * SCHOOL_R * t0 / p0;
  const tv = t0 + q / (nu * cv), tp = t0 + q / (nu * cp);
  return { cv, cp, v0, fixed: { t: tv, v: v0, p: p0 * tv / t0, du: q, a: 0 },
    moving: { t: tp, v: v0 * tp / t0, p: p0, du: s / (s + 2) * q, a: 2 / (s + 2) * q } };
}
export function pathState(highFirst: boolean, progress: number) {
  const first = progress <= 0.5, u = first ? progress * 2 : (progress - 0.5) * 2;
  const v = highFirst ? (first ? 2 : 2 + 4 * u) : (first ? 2 + 4 * u : 6);
  const p = highFirst ? (first ? 100 + 200 * u : 300) : (first ? 100 : 100 + 200 * u);
  const a = highFirst ? (first ? 0 : 1200 * u) : (first ? 400 * u : 400);
  const du = 1.5 * (p * v - 200);
  return { v, p, a, du, q: du + a };
}
export function rectangleCycle(highPressure: number) {
  const a = (highPressure - 100) * 4;
  const q1 = 1.5 * 2 * (highPressure - 100) + 2.5 * highPressure * 4;
  return { a, q1, q2: q1 - a, efficiency: a / q1 };
}
export function reflection(v: number, u: number) {
  return { outgoing: 2 * u - v, energyRatio: (2 * u - v) ** 2 / v ** 2 };
}
export type MoleculeKind = "He" | "N2" | "CO2" | "H2O";
export type Vec3 = [number, number, number];
export const moleculeModels: Record<MoleculeKind, { tex: string; masses: number[]; points: Vec3[]; rotationAxes: ("x" | "y" | "z")[]; vibrationNames: string[]; bonds: [number, number][] }> = {
  He: { tex: "\\mathrm{He}", masses: [4], points: [[0, 0, 0]], rotationAxes: [], vibrationNames: [], bonds: [] },
  N2: { tex: "\\mathrm{N_2}", masses: [14, 14], points: [[-55, 0, 0], [55, 0, 0]], rotationAxes: ["y", "z"], vibrationNames: ["Разтягане"], bonds: [[0, 1]] },
  CO2: { tex: "\\mathrm{CO_2}", masses: [16, 12, 16], points: [[-72, 0, 0], [0, 0, 0], [72, 0, 0]], rotationAxes: ["y", "z"], vibrationNames: ["Симетрично разтягане", "Асиметрично разтягане", "Огъване в равнината", "Огъване извън равнината"], bonds: [[0, 1], [1, 2]] },
  H2O: { tex: "\\mathrm{H_2O}", masses: [16, 1, 1], points: [[0, 0, 0], [-60, 0, -46], [60, 0, -46]], rotationAxes: ["x", "y", "z"], vibrationNames: ["Симетрично разтягане", "Асиметрично разтягане", "Огъване"], bonds: [[0, 1], [0, 2]] },
};
export function centerMolecule(points: Vec3[], masses: number[]): Vec3[] {
  const total = masses.reduce((a, b) => a + b, 0);
  const center = [0, 1, 2].map(axis => points.reduce((sum, p, i) => sum + masses[i] * p[axis], 0) / total);
  return points.map(p => p.map((v, axis) => v - center[axis]) as Vec3);
}
export function moleculeCoordinates(kind: MoleculeKind, motion: string, phase: number): Vec3[] {
  const model = moleculeModels[kind], angle = 2 * Math.PI * phase, wave = Math.sin(angle);
  let points = model.points.map(p => [...p] as Vec3);
  if (motion.startsWith("v")) {
    const mode = Number(motion.slice(1));
    if (kind === "N2") points = points.map(p => [p[0] * (1 + 0.25 * wave), p[1], p[2]]);
    if (kind === "CO2") points = points.map((p, i) => {
      if (mode === 0) return [p[0] * (1 + 0.22 * wave), 0, 0];
      if (mode === 1) return [p[0] + (i === 1 ? -22 : 12) * wave, 0, 0];
      return [p[0], mode === 2 ? (i === 1 ? -24 : 12) * wave : 0, mode === 3 ? (i === 1 ? -24 : 12) * wave : 0];
    });
    if (kind === "H2O") points = points.map((p, i) => {
      if (i === 0) return p;
      if (mode < 2) { const factor = 1 + 0.22 * wave * (mode === 1 && i === 2 ? -1 : 1); return [p[0] * factor, 0, p[2] * factor]; }
      const theta = Math.atan2(p[2], p[0]) + (i === 1 ? -1 : 1) * 0.22 * wave;
      const length = Math.hypot(p[0], p[2]); return [length * Math.cos(theta), 0, length * Math.sin(theta)];
    });
  }
  points = centerMolecule(points, model.masses);
  if (motion.startsWith("r")) {
    const c = Math.cos(angle), s = Math.sin(angle);
    points = points.map(([x, y, z]) => motion === "rx" ? [x, y * c - z * s, y * s + z * c] : motion === "ry" ? [x * c + z * s, y, -x * s + z * c] : [x * c - y * s, x * s + y * c, z]);
  }
  if (motion.startsWith("t")) {
    const axis = { tx: 0, ty: 1, tz: 2 }[motion] ?? 0;
    points = points.map(p => p.map((v, i) => v + (i === axis ? 45 * wave : 0)) as Vec3);
  }
  return points;
}
