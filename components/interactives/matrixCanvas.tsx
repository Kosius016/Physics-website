import { C, STAGE_BG } from "./svg";

/**
 * Споделено ядро за матричните интерактиви (уроци по линейна алгебра):
 * 2×2 матрици, рисуване на трансформирана сцена върху тъмен canvas
 * (решетка, единичен квадрат, базисни вектори, пиксел-арт спрайт,
 * шахматна мрежа за площ) + UI парчета (матричен дисплей, плъзгачи).
 *
 * Конвенция: M = [a, b, c, d] представя [[a, b], [c, d]] (по редове):
 *   x' = a·x + b·y,  y' = c·x + d·y;  î ↦ (a, c),  ĵ ↦ (b, d).
 */

export type Mat2 = [number, number, number, number];

export const IDENTITY: Mat2 = [1, 0, 0, 1];

export function det([a, b, c, d]: Mat2): number {
  return a * d - b * c;
}

/** m1 · m2 — прилага се ПЪРВО m2, после m1. */
export function mul(m1: Mat2, m2: Mat2): Mat2 {
  const [a1, b1, c1, d1] = m1;
  const [a2, b2, c2, d2] = m2;
  return [
    a1 * a2 + b1 * c2,
    a1 * b2 + b1 * d2,
    c1 * a2 + d1 * c2,
    c1 * b2 + d1 * d2,
  ];
}

export function lerpMat(m1: Mat2, m2: Mat2, t: number): Mat2 {
  return m1.map((v, i) => v + (m2[i] - v) * t) as Mat2;
}

/* ---------- Сцена ---------- */

export const MC_W = 640;
export const MC_H = 460;
const OX = 260;
const OY = 300;
const S = 55; // px за 1 единица

const GRID_RANGE = 9;

// Пиксел-арт ракета (редове отгоре надолу)
const SPRITE = [
  "....w....",
  "...www...",
  "..wwbww..",
  ".wwwbwww.",
  ".wwbbbww.",
  ".wwwbwww.",
  ".wwwwwww.",
  ".r.www.r.",
  "rr.www.rr",
  "r..yyy..r",
  "....y....",
];
const SPRITE_COLORS: Record<string, string> = {
  w: C.wire,
  b: C.minus,
  r: C.plus,
  y: C.warn,
};
const SPRITE_PX = 0.28; // размер на пиксел в световни единици
const SPRITE_ORIGIN = { x: 0.45, y: 0.25 }; // долен ляв ъгъл на спрайта

/** Световна точка → екранна, през матрицата M. */
function tx(M: Mat2, x: number, y: number): [number, number] {
  const [a, b, c, d] = M;
  return [OX + (a * x + b * y) * S, OY - (c * x + d * y) * S];
}

function poly(ctx: CanvasRenderingContext2D, pts: [number, number][]) {
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
  ctx.closePath();
}

function arrow(
  ctx: CanvasRenderingContext2D,
  from: [number, number],
  to: [number, number],
  color: string,
  label?: string,
) {
  const ang = Math.atan2(to[1] - from[1], to[0] - from[0]);
  const hl = 10;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(from[0], from[1]);
  ctx.lineTo(to[0] - hl * 0.6 * Math.cos(ang), to[1] - hl * 0.6 * Math.sin(ang));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(to[0], to[1]);
  ctx.lineTo(to[0] - hl * Math.cos(ang - 0.4), to[1] - hl * Math.sin(ang - 0.4));
  ctx.lineTo(to[0] - hl * Math.cos(ang + 0.4), to[1] - hl * Math.sin(ang + 0.4));
  ctx.closePath();
  ctx.fill();
  if (label) {
    ctx.font = "bold 15px ui-monospace, monospace";
    ctx.fillText(label, to[0] + 10 * Math.cos(ang) + 4, to[1] + 10 * Math.sin(ang) - 4);
  }
}

export interface SceneOpts {
  /** Пиксел-арт ракетата, трансформирана от M. */
  sprite?: boolean;
  /** Шахматна мрежа върху единичния квадрат (за площ/детерминанта). */
  checker?: boolean;
  /** Контур на образа на единичния квадрат. */
  squareOutline?: boolean;
  /** Базисните вектори î′, ĵ′. */
  basis?: boolean;
}

/** Рисува цялата сцена за матрица M върху тъмния canvas. */
export function drawMatrixScene(ctx: CanvasRenderingContext2D, M: Mat2, opts: SceneOpts) {
  ctx.fillStyle = STAGE_BG;
  ctx.fillRect(0, 0, MC_W, MC_H);

  // Оригиналната решетка (бледа, статична)
  ctx.strokeStyle = "rgba(242,239,245,0.075)";
  ctx.lineWidth = 1;
  for (let k = -GRID_RANGE; k <= GRID_RANGE; k++) {
    ctx.beginPath();
    ctx.moveTo(OX + k * S, 0);
    ctx.lineTo(OX + k * S, MC_H);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, OY - k * S);
    ctx.lineTo(MC_W, OY - k * S);
    ctx.stroke();
  }

  // Трансформираната решетка (образът на квадратната мрежа)
  for (let k = -GRID_RANGE; k <= GRID_RANGE; k++) {
    const axis = k === 0;
    ctx.strokeStyle = axis ? "rgba(89,173,255,0.72)" : "rgba(89,173,255,0.21)";
    ctx.lineWidth = axis ? 1.8 : 1;
    ctx.beginPath();
    ctx.moveTo(...tx(M, k, -GRID_RANGE));
    ctx.lineTo(...tx(M, k, GRID_RANGE));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(...tx(M, -GRID_RANGE, k));
    ctx.lineTo(...tx(M, GRID_RANGE, k));
    ctx.stroke();
  }

  // Шахматна мрежа на единичния квадрат (пикселизирана площ)
  if (opts.checker) {
    const n = 8;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const x0 = i / n;
        const y0 = j / n;
        const x1 = (i + 1) / n;
        const y1 = (j + 1) / n;
        poly(ctx, [tx(M, x0, y0), tx(M, x1, y0), tx(M, x1, y1), tx(M, x0, y1)]);
        ctx.fillStyle = (i + j) % 2 === 0 ? "rgba(255,118,84,0.66)" : "rgba(89,173,255,0.66)";
        ctx.fill();
      }
    }
  }

  // Пиксел-арт спрайтът
  if (opts.sprite) {
    const rows = SPRITE.length;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < SPRITE[r].length; c++) {
        const ch = SPRITE[r][c];
        if (ch === ".") continue;
        const x0 = SPRITE_ORIGIN.x + c * SPRITE_PX;
        const y0 = SPRITE_ORIGIN.y + (rows - 1 - r) * SPRITE_PX;
        poly(ctx, [
          tx(M, x0, y0),
          tx(M, x0 + SPRITE_PX, y0),
          tx(M, x0 + SPRITE_PX, y0 + SPRITE_PX),
          tx(M, x0, y0 + SPRITE_PX),
        ]);
        ctx.fillStyle = SPRITE_COLORS[ch];
        ctx.fill();
      }
    }
  }

  // Образът на единичния квадрат
  if (opts.squareOutline) {
    poly(ctx, [tx(M, 0, 0), tx(M, 1, 0), tx(M, 1, 1), tx(M, 0, 1)]);
    ctx.strokeStyle = C.warn;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Базисните вектори
  if (opts.basis) {
    const o = tx(M, 0, 0);
    arrow(ctx, o, tx(M, 1, 0), C.plus, "î′");
    arrow(ctx, o, tx(M, 0, 1), C.ok, "ĵ′");
  }

  // Начало
  ctx.fillStyle = C.wire;
  ctx.beginPath();
  ctx.arc(OX, OY, 3, 0, 2 * Math.PI);
  ctx.fill();
}

/* ---------- SVG вариант на сцената (за фигурите в задачите) ---------- */

/**
 * Малка SVG сцена с трансформирана решетка/спрайт/шахматна мрежа —
 * използва се във фазовите фигури на GuidedProblem (viewBox 480×300).
 */
export function SvgMatrixScene({
  m,
  ox = 150,
  oy = 210,
  s = 42,
  sprite = false,
  checker = false,
  square = false,
  grid = true,
  spriteOpacity = 1,
}: {
  m: Mat2;
  ox?: number;
  oy?: number;
  s?: number;
  sprite?: boolean;
  checker?: boolean;
  square?: boolean;
  grid?: boolean;
  spriteOpacity?: number;
}) {
  const [a, b, c, d] = m;
  const T = (x: number, y: number): [number, number] => [
    ox + (a * x + b * y) * s,
    oy - (c * x + d * y) * s,
  ];
  const pts = (list: [number, number][]) => list.map(([x, y]) => `${x},${y}`).join(" ");
  const R = 7;
  const rows = SPRITE.length;
  return (
    <g>
      {grid &&
        Array.from({ length: 2 * R + 1 }, (_, i) => i - R).map((k) => (
          <g key={k} stroke={k === 0 ? "rgba(89,173,255,0.7)" : "rgba(89,173,255,0.2)"} strokeWidth={k === 0 ? 1.6 : 1}>
            <line x1={T(k, -R)[0]} y1={T(k, -R)[1]} x2={T(k, R)[0]} y2={T(k, R)[1]} />
            <line x1={T(-R, k)[0]} y1={T(-R, k)[1]} x2={T(R, k)[0]} y2={T(R, k)[1]} />
          </g>
        ))}
      {checker &&
        Array.from({ length: 36 }, (_, idx) => {
          const i = idx % 6;
          const j = Math.floor(idx / 6);
          const c4: [number, number][] = [
            T(i / 6, j / 6),
            T((i + 1) / 6, j / 6),
            T((i + 1) / 6, (j + 1) / 6),
            T(i / 6, (j + 1) / 6),
          ];
          return (
            <polygon
              key={idx}
              points={pts(c4)}
              fill={(i + j) % 2 === 0 ? "rgba(255,118,84,0.66)" : "rgba(89,173,255,0.66)"}
            />
          );
        })}
      {sprite && (
        <g opacity={spriteOpacity}>
          {SPRITE.flatMap((row, r) =>
            row.split("").map((ch, col) => {
              if (ch === ".") return null;
              const x0 = SPRITE_ORIGIN.x + col * SPRITE_PX;
              const y0 = SPRITE_ORIGIN.y + (rows - 1 - r) * SPRITE_PX;
              const c4: [number, number][] = [
                T(x0, y0),
                T(x0 + SPRITE_PX, y0),
                T(x0 + SPRITE_PX, y0 + SPRITE_PX),
                T(x0, y0 + SPRITE_PX),
              ];
              return <polygon key={`${r}-${col}`} points={pts(c4)} fill={SPRITE_COLORS[ch]} />;
            }),
          )}
        </g>
      )}
      {square && (
        <polygon
          points={pts([T(0, 0), T(1, 0), T(1, 1), T(0, 1)])}
          fill="none"
          stroke={C.warn}
          strokeWidth={2}
        />
      )}
      <circle cx={ox} cy={oy} r={2.5} fill={C.wire} />
    </g>
  );
}

/* ---------- UI парчета ---------- */

/** Матрица 2×2 с „скоби“, табличен шрифт. */
export function MatrixDisplay({
  m,
  label,
  highlight = false,
}: {
  m: Mat2;
  label?: string;
  highlight?: boolean;
}) {
  const [a, b, c, d] = m;
  const fmt = (v: number) => (Object.is(v, -0) ? 0 : Math.round(v * 100) / 100).toString();
  return (
    <span className="inline-flex items-center gap-2">
      {label && <span className="text-[14px] font-semibold text-muted">{label} =</span>}
      <span
        className={`inline-flex items-stretch font-mono text-[15px] font-semibold tabular-nums ${highlight ? "text-minus" : "text-ink"}`}
      >
        <span className="w-1.5 rounded-l-[3px] border-y-2 border-l-2 border-current" />
        <span className="grid grid-cols-2 gap-x-3 px-1.5 py-0.5 text-center">
          <span>{fmt(a)}</span>
          <span>{fmt(b)}</span>
          <span>{fmt(c)}</span>
          <span>{fmt(d)}</span>
        </span>
        <span className="w-1.5 rounded-r-[3px] border-y-2 border-r-2 border-current" />
      </span>
    </span>
  );
}

/** Четири плъзгача, подредени като елементите на матрицата. */
export function MatrixSliders({
  m,
  onChange,
  disabled = false,
}: {
  m: Mat2;
  onChange: (m: Mat2) => void;
  disabled?: boolean;
}) {
  const labels = ["a", "b", "c", "d"] as const;
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
      {labels.map((lb, i) => (
        <div key={lb}>
          <label
            htmlFor={`mat-${lb}`}
            className="mb-0.5 flex items-baseline justify-between text-[13px] font-medium text-muted"
          >
            <span className="font-mono font-bold">{lb}</span>
            <span className="font-mono font-bold tabular-nums text-minus">{m[i].toFixed(2)}</span>
          </label>
          <input
            id={`mat-${lb}`}
            type="range"
            min={-2}
            max={2}
            step={0.05}
            value={m[i]}
            disabled={disabled}
            onChange={(e) => {
              const next = [...m] as Mat2;
              next[i] = parseFloat(e.target.value);
              onChange(next);
            }}
            className="w-full accent-(--color-minus)"
          />
        </div>
      ))}
    </div>
  );
}
