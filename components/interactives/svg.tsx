/**
 * Споделени помощници за интерактивните фигури (SVG върху тъмна сцена,
 * като canvas-а на съществуващите симулации). Цветовете са светлите
 * варианти на палитрата, четими върху #0e1420.
 */

export const STAGE_BG = "#0e1420";

export const C = {
  wire: "#e8edf2",
  plus: "#e8563f", // червено (ток "+", dB₂, грешка)
  minus: "#5fa8f5", // синьо (dB₁, r-вектори)
  ok: "#4fc47e", // зелено (резултат, вярно)
  warn: "#ffd34d", // жълто (акценти)
  mut: "rgba(255,255,255,0.55)",
  faint: "rgba(255,255,255,0.25)",
} as const;

/** Клас за <svg> сцена — както canvas-а на симулациите. */
export const STAGE_CLASS = "block h-auto w-full rounded-[10px] border-[1.5px] border-ink";

/** Бял панел около интерактив — както секцията "Симулация". */
export const PANEL_CLASS = "rounded-xl border-[1.5px] border-ink bg-surface p-4 shadow-hard";

/** Бутони в стила на симулацията. */
export const BTN_PRI =
  "cursor-pointer rounded-lg border-[1.5px] border-ink bg-ink px-4 py-2 text-[13.5px] font-bold text-white shadow-hard-sm transition-opacity hover:opacity-90 active:translate-x-px active:translate-y-px active:shadow-none disabled:cursor-default disabled:opacity-40";
export const BTN_SEC =
  "cursor-pointer rounded-lg border-[1.5px] border-ink bg-surface px-3.5 py-2 text-[13.5px] font-semibold text-ink shadow-hard-sm transition-colors hover:bg-hl active:translate-x-px active:translate-y-px active:shadow-none disabled:cursor-default disabled:opacity-40";

/** Стрелка (вектор) с връх-триъгълник и опционален етикет. */
export function Arrow({
  x1,
  y1,
  x2,
  y2,
  color,
  width = 2.5,
  dashed = false,
  label,
  labelDx = 8,
  labelDy = 4,
  animate = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  width?: number;
  dashed?: boolean;
  label?: string;
  labelDx?: number;
  labelDy?: number;
  animate?: boolean;
}) {
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const hl = 9;
  const bx = x2 - hl * Math.cos(ang);
  const by = y2 - hl * Math.sin(ang);
  const wx = 4 * Math.sin(ang);
  const wy = -4 * Math.cos(ang);
  return (
    <g className={animate ? "animate-rise" : undefined}>
      <line
        x1={x1}
        y1={y1}
        x2={bx}
        y2={by}
        stroke={color}
        strokeWidth={width}
        strokeDasharray={dashed ? "5 4" : undefined}
      />
      <polygon
        points={`${x2},${y2} ${bx + wx},${by + wy} ${bx - wx},${by - wy}`}
        fill={color}
      />
      {label && (
        <text
          x={x2 + labelDx}
          y={y2 + labelDy}
          fill={color}
          fontSize={13.5}
          fontWeight={700}
        >
          {label}
        </text>
      )}
    </g>
  );
}

/** Ток, перпендикулярен на екрана: ⊙ (навън) или ⊗ (навътре). */
export function CurrentSymbol({
  x,
  y,
  out,
  r = 13,
  color,
  label,
  animate = false,
}: {
  x: number;
  y: number;
  out: boolean;
  r?: number;
  color: string;
  label?: string;
  animate?: boolean;
}) {
  const k = r * 0.55;
  return (
    <g className={animate ? "animate-rise" : undefined}>
      <circle cx={x} cy={y} r={r} fill={STAGE_BG} stroke={color} strokeWidth={2.5} />
      {out ? (
        <circle cx={x} cy={y} r={r * 0.24} fill={color} />
      ) : (
        <g stroke={color} strokeWidth={2.5} strokeLinecap="round">
          <line x1={x - k} y1={y - k} x2={x + k} y2={y + k} />
          <line x1={x - k} y1={y + k} x2={x + k} y2={y - k} />
        </g>
      )}
      {label && (
        <text x={x + r + 6} y={y + 4} fill={color} fontSize={13.5} fontWeight={700}>
          {label}
        </text>
      )}
    </g>
  );
}

/** Дъга на ъгъл между две посоки (в радиани, екранни координати) с етикет. */
export function AngleArc({
  cx,
  cy,
  a1,
  a2,
  r,
  color,
  label,
}: {
  cx: number;
  cy: number;
  a1: number;
  a2: number;
  r: number;
  color: string;
  label?: string;
}) {
  let d = a2 - a1;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  const sweep = d > 0 ? 1 : 0;
  const x1 = cx + r * Math.cos(a1);
  const y1 = cy + r * Math.sin(a1);
  const x2 = cx + r * Math.cos(a2);
  const y2 = cy + r * Math.sin(a2);
  const mid = a1 + d / 2;
  return (
    <g>
      <path
        d={`M ${x1} ${y1} A ${r} ${r} 0 0 ${sweep} ${x2} ${y2}`}
        fill="none"
        stroke={color}
        strokeWidth={1.8}
      />
      {label && (
        <text
          x={cx + (r + 15) * Math.cos(mid)}
          y={cy + (r + 15) * Math.sin(mid)}
          fill={color}
          fontSize={12.5}
          fontWeight={600}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {label}
        </text>
      )}
    </g>
  );
}

/** Преобразува pointer събитие в координати на viewBox-а на SVG елемента. */
export function svgPoint(
  svg: SVGSVGElement,
  clientX: number,
  clientY: number,
  vw: number,
  vh: number,
): [number, number] {
  const rect = svg.getBoundingClientRect();
  return [((clientX - rect.left) * vw) / rect.width, ((clientY - rect.top) * vh) / rect.height];
}
