/** Exact models shared by the lesson's diagrams and numerical checks. SI units. */
export function returnTrip(t: number) {
  const x = t <= 4 ? 2 * t : 16 - 2 * t;
  return { x, path: 2 * t, average: t > 0 ? x / t : 0 };
}

export function circularInterval(dt: number) {
  const radius = 4;
  const omega = 0.5;
  const angle = omega * dt;
  const dx = radius * Math.sin(angle);
  const dy = radius * (1 - Math.cos(angle));
  return { angle, dx, dy, chord: Math.hypot(dx, dy), path: radius * angle,
    vx: dx / dt, vy: dy / dt, speed: radius * omega };
}

export function velocityComponents(speed: number, degrees: number) {
  const angle = degrees * Math.PI / 180;
  const clean = (n: number) => Math.abs(n) < 1e-10 ? 0 : n;
  return { x: clean(speed * Math.cos(angle)), y: clean(speed * Math.sin(angle)) };
}

export type MotionKind = "faster" | "slower" | "turn";
export function motionState(kind: MotionKind, t: number) {
  if (kind === "turn") {
    const angle = t / 2;
    return { x: 4 * Math.sin(angle), y: 4 * (1 - Math.cos(angle)),
      vx: 2 * Math.cos(angle), vy: 2 * Math.sin(angle),
      ax: -Math.sin(angle), ay: Math.cos(angle) };
  }
  const a = kind === "faster" ? 0.5 : -0.5;
  const initial = kind === "faster" ? 1 : 3;
  return { x: initial * t + a * t * t / 2, y: 0, vx: initial + a * t, vy: 0, ax: a, ay: 0 };
}
