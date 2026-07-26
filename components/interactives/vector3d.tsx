import SvgTex from "./SvgTex";
import { C } from "./svg";

/**
 * Споделена 3D проекция за сцените с вектори (векторно и смесено произведение).
 *
 * Проекцията е една и съща във всички фигури на главата, за да не се налага
 * ученикът да пренастройва пространственото си четене при всяка нова картинка:
 * x надясно и леко надолу, y наляво и леко надолу, z нагоре.
 */

export type V3 = [number, number, number];

export const cross = (a: V3, b: V3): V3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];

export const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const norm = (v: V3) => Math.hypot(v[0], v[1], v[2]);
export const addV = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const scaleV = (v: V3, k: number): V3 => [v[0] * k, v[1] * k, v[2] * k];

export type Projector = (v: V3) => [number, number];

/** Проектор с общ мащаб, така че най-дългият подаден вектор да се побере в maxPx. */
export function makeProjector(vectors: V3[], ox: number, oy: number, maxPx: number): Projector {
  const longest = Math.max(1e-6, ...vectors.map(norm));
  const s = maxPx / longest;
  return (v: V3) => [
    round(ox + s * (v[0] - 0.58 * v[1])),
    round(oy + s * (0.34 * v[0] + 0.34 * v[1] - v[2])),
  ];
}

const round = (v: number) => Math.round(v * 1_000_000) / 1_000_000;

/**
 * Осите x, y, z; винаги най-отдолу в сцената.
 *
 * `labels={false}` изключва надписите: в сцени с много вектори те се блъскат
 * във върховете, затова там ориентацията се дава от `MiniAxes` в ъгъла.
 */
export function Axes3D({ P, len = 1.15, labels = true }: { P: Projector; len?: number; labels?: boolean }) {
  const axes: { to: V3; label: string }[] = [
    { to: [len, 0, 0], label: "x" },
    { to: [0, len, 0], label: "y" },
    { to: [0, 0, len], label: "z" },
  ];
  const o = P([0, 0, 0]);
  return (
    <g>
      {axes.map(({ to, label }) => {
        const from = P(scaleV(to, -0.55));
        const p = P(to);
        return (
          <g key={label}>
            <line x1={from[0]} y1={from[1]} x2={p[0]} y2={p[1]} stroke={C.faint} strokeWidth={1.2} />
            {labels && (
              <SvgTex x={p[0] + 5} y={p[1] - 3} tex={label} color={C.mut} fontSize={11} width={22} />
            )}
          </g>
        );
      })}
      <circle cx={o[0]} cy={o[1]} r={2.5} fill={C.wire} />
    </g>
  );
}

/**
 * Малък компас с ориентацията на осите, закотвен на фиксирано място в кадъра.
 * Понеже не зависи от данните на задачата, не може да се застъпи с нищо.
 */
export function MiniAxes({ cx, cy, size = 26 }: { cx: number; cy: number; size?: number }) {
  const P = makeProjector([[1, 0, 0]], cx, cy, size);
  const axes: { to: V3; label: string }[] = [
    { to: [1, 0, 0], label: "x" },
    { to: [0, 1, 0], label: "y" },
    { to: [0, 0, 1], label: "z" },
  ];
  return (
    <g opacity={0.75}>
      {axes.map(({ to, label }) => {
        const p = P(to);
        return (
          <g key={label}>
            <line x1={cx} y1={cy} x2={p[0]} y2={p[1]} stroke={C.mut} strokeWidth={1.3} />
            <SvgTex x={p[0] + 4} y={p[1] + 4} tex={label} color={C.mut} fontSize={12} width={22} />
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={1.8} fill={C.mut} />
    </g>
  );
}

/** Успоредникът върху два вектора, с обща начална точка в началото. */
export function Parallelogram({
  P,
  a,
  b,
  color = C.ok,
  opacity = 0.18,
}: {
  P: Projector;
  a: V3;
  b: V3;
  color?: string;
  opacity?: number;
}) {
  const pts = [P([0, 0, 0]), P(a), P(addV(a, b)), P(b)].map((p) => p.join(",")).join(" ");
  return <polygon points={pts} fill={color} fillOpacity={opacity} stroke={color} strokeWidth={1.5} />;
}

/** Кратък KaTeX етикет до върха на вектор, изместен по посоката му. */
export function TipLabel({
  P,
  v,
  tex,
  color,
  dx = 12,
  dy = -8,
  width = 60,
}: {
  P: Projector;
  v: V3;
  tex: string;
  color: string;
  dx?: number;
  dy?: number;
  width?: number;
}) {
  const p = P(v);
  return <SvgTex x={p[0] + dx} y={p[1] + dy} tex={tex} color={color} fontSize={14} width={width} />;
}
