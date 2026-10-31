/** Pure mathematical helpers shared by the course's interactive figures. Angles are radians. */
export type Complex = { re: number; im: number };
export const add = (z: Complex, w: Complex): Complex => ({ re: z.re + w.re, im: z.im + w.im });
export const multiply = (z: Complex, w: Complex): Complex => ({ re: z.re * w.re - z.im * w.im, im: z.re * w.im + z.im * w.re });
export const modulus = (z: Complex) => Math.hypot(z.re, z.im);
export const polar = (r: number, phi: number): Complex => ({ re: r * Math.cos(phi), im: r * Math.sin(phi) });
export function argument(z: Complex): number | null {
  if (modulus(z) === 0) return null;
  const a = Math.atan2(z.im, z.re);
  return a <= -Math.PI ? Math.PI : a;
}
export function divide(z: Complex, w: Complex): Complex {
  const d = w.re ** 2 + w.im ** 2;
  if (d === 0) throw new RangeError("Division by zero");
  return { re: (z.re * w.re + z.im * w.im) / d, im: (z.im * w.re - z.re * w.im) / d };
}
export function roots(z: Complex, n: number): Complex[] {
  if (!Number.isInteger(n) || n < 1) throw new RangeError("Positive integer degree required");
  if (modulus(z) === 0) return [{ re: 0, im: 0 }];
  return Array.from({ length: n }, (_, k) => polar(modulus(z) ** (1 / n), ((argument(z) ?? 0) + 2 * Math.PI * k) / n));
}
/** Steady-state displacement, divided by F0/k, versus omega/omega0. */
export function oscillatorResponse(ratio: number, damping: number): Complex {
  return divide({ re: 1, im: 0 }, { re: 1 - ratio ** 2, im: 2 * damping * ratio });
}
