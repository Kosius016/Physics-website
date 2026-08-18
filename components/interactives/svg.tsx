import SvgTex from "./SvgTex";

/**
 * Споделени помощници за интерактивните фигури (SVG върху тъмна сцена,
 * като canvas-а на съществуващите симулации). Цветовете са светлите
 * варианти на палитрата, четими върху мек графитен фон.
 */

export const STAGE_BG = "#24212d";

/** Серифният шрифт на заглавията в урока, използван и за текст в чертежите. */
export const DRAWING_FONT_FAMILY = 'Georgia, "Times New Roman", serif';

export const C = {
  wire: "#f2eff5",
  plus: "#ff7654", // топло оранжево-червено (плюс, грешка)
  minus: "#59adff", // чисто студено синьо (минус, r-вектори)
  ok: "#62d7a0", // меко зелено (резултат, вярно)
  warn: "#ffd166", // топло жълто (акценти)
  mut: "rgba(242,239,245,0.64)",
  faint: "rgba(242,239,245,0.28)",
} as const;

/** Клас за <svg> сцена — както canvas-а на симулациите. */
export const STAGE_CLASS =
  "block h-auto w-full rounded-[10px] border-[1.5px] border-ink [image-rendering:pixelated]";

/** Бял панел около интерактив — както секцията "Симулация". */
export const PANEL_CLASS = "rounded-xl border-[1.5px] border-ink bg-surface p-4 shadow-hard";

/** Бутони в стила на симулацията. */
export const BTN_PRI =
  "cursor-pointer rounded-lg border-[1.5px] border-ink bg-ink px-4 py-2 text-[13.5px] font-bold text-white shadow-hard-sm transition-opacity hover:opacity-90 active:translate-x-px active:translate-y-px active:shadow-none disabled:cursor-default disabled:opacity-40";
export const BTN_SEC =
  "cursor-pointer rounded-lg border-[1.5px] border-ink bg-surface px-3.5 py-2 text-[13.5px] font-semibold text-ink shadow-hard-sm transition-colors hover:bg-hl active:translate-x-px active:translate-y-px active:shadow-none disabled:cursor-default disabled:opacity-40";

/**
 * KaTeX етикет с плътна подложка в цвета на сцената.
 *
 * Ползва се, когато етикетът неизбежно пада върху линия, окръжност или
 * защрихована област: без подложка текстът се слива с чертежа и не се чете.
 * `width` е ширината на самия етикет, затова я подавайте прилепнала към
 * съдържанието, иначе подложката ще закрие съседни елементи.
 */
export function TexChip({
  x,
  y,
  tex,
  color,
  width,
  fontSize = 13,
  anchor = "start",
  padX = 7,
  padY = 5,
}: {
  x: number;
  y: number;
  tex: string;
  color: string;
  width: number;
  fontSize?: number;
  anchor?: "start" | "middle" | "end";
  padX?: number;
  padY?: number;
}) {
  const height = fontSize + padY * 2;
  const left = anchor === "middle" ? x - width / 2 : anchor === "end" ? x - width : x;
  return (
    <g>
      <rect
        x={left - padX}
        y={y - height / 2}
        width={width + padX * 2}
        height={height}
        rx={5}
        fill={STAGE_BG}
        opacity={0.94}
      />
      <SvgTex x={x} y={y} tex={tex} color={color} width={width} fontSize={fontSize} anchor={anchor} />
    </g>
  );
}

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
  texLabel,
  labelDx = 8,
  labelDy = 4,
  texLabelDx = 0,
  texLabelDy = 0,
  texLabelWidth = 96,
  texLabelAnchor,
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
  texLabel?: string;
  labelDx?: number;
  labelDy?: number;
  texLabelDx?: number;
  texLabelDy?: number;
  texLabelWidth?: number;
  texLabelAnchor?: "start" | "middle" | "end";
  animate?: boolean;
}) {
  const q = (v: number) => Math.round(v * 1_000_000) / 1_000_000;
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const hl = 9;
  const bx = q(x2 - hl * Math.cos(ang));
  const by = q(y2 - hl * Math.sin(ang));
  const wx = q(4 * Math.sin(ang));
  const wy = q(-4 * Math.cos(ang));
  const labelCos = Math.cos(ang);
  const labelSin = Math.sin(ang);
  const texAnchor = texLabelAnchor ?? (labelCos < -0.2 ? "end" : labelCos > 0.2 ? "start" : "middle");
  const texX = q(x2 + 14 * labelCos + texLabelDx);
  const texY = q(y2 + 14 * labelSin + texLabelDy);
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
        points={`${q(x2)},${q(y2)} ${q(bx + wx)},${q(by + wy)} ${q(bx - wx)},${q(by - wy)}`}
        fill={color}
      />
      {texLabel ? (
        <SvgTex
          x={texX}
          y={texY}
          tex={texLabel}
          color={color}
          width={texLabelWidth}
          anchor={texAnchor}
        />
      ) : label ? (
        <text
          x={x2 + labelDx}
          y={y2 + labelDy}
          fill={color}
          fontSize={13.5}
          fontWeight={700}
        >
          {label}
        </text>
      ) : null}
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
  texLabel,
  animate = false,
}: {
  x: number;
  y: number;
  out: boolean;
  r?: number;
  color: string;
  label?: string;
  texLabel?: string;
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
      {texLabel ? (
        <SvgTex x={x + r + 6} y={y + 1} tex={texLabel} color={color} width={104} />
      ) : label ? (
        <text x={x + r + 6} y={y + 4} fill={color} fontSize={13.5} fontWeight={700}>
          {label}
        </text>
      ) : null}
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
  texLabel,
}: {
  cx: number;
  cy: number;
  a1: number;
  a2: number;
  r: number;
  color: string;
  label?: string;
  texLabel?: string;
}) {
  const q = (v: number) => Math.round(v * 1_000_000) / 1_000_000;
  let d = a2 - a1;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  const sweep = d > 0 ? 1 : 0;
  const x1 = q(cx + r * Math.cos(a1));
  const y1 = q(cy + r * Math.sin(a1));
  const x2 = q(cx + r * Math.cos(a2));
  const y2 = q(cy + r * Math.sin(a2));
  const mid = a1 + d / 2;
  return (
    <g>
      <path
        d={`M ${x1} ${y1} A ${q(r)} ${q(r)} 0 0 ${sweep} ${x2} ${y2}`}
        fill="none"
        stroke={color}
        strokeWidth={1.8}
      />
      {texLabel ? (
        <SvgTex
          x={q(cx + (r + 15) * Math.cos(mid))}
          y={q(cy + (r + 15) * Math.sin(mid))}
          tex={texLabel}
          color={color}
          fontSize={12.5}
          width={84}
          anchor="middle"
        />
      ) : label ? (
        <text
          x={q(cx + (r + 15) * Math.cos(mid))}
          y={q(cy + (r + 15) * Math.sin(mid))}
          fill={color}
          fontSize={12.5}
          fontWeight={600}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {label}
        </text>
      ) : null}
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
