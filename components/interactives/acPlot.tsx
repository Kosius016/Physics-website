"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import { C, DRAWING_FONT_FAMILY, STAGE_BG } from "./svg";

/**
 * Споделен инструментариум за интерактивите към главата „Променлив ток“.
 *
 * Всички графики в главата минават оттук, за да няма дублирана логика за
 * оси, мащаби и анимация: `scaler` дава преобразуването данни → координати на
 * сцената, `PlotFrame` рисува осите, `useClock` е единственият часовник
 * (с задължителен cleanup на rAF).
 *
 * Правилото от CLAUDE.md се спазва навсякъде: числата стоят в readout лентата
 * под сцената, а вътре в SVG влизат само кратки символни етикети през SvgTex.
 */

/* ---------------------------------------------------------------- числа */

/** Десетично число с българска запетая, готово за $…$ в RichText. */
export function dec(value: number, digits = 2): string {
  return value.toFixed(digits).replace(".", "{,}");
}

const q = (value: number) => Math.round(value * 100) / 100;

/* ------------------------------------------------------------ часовник */

/**
 * Общ часовник за анимациите: връща изминалите „обороти“ (безразмерно време
 * в периоди) и функция за нулиране. Скоростта е в периоди за секунда стенно
 * време, затова анимацията остава гледаема и при 60 Hz.
 */
export function useClock(playing: boolean, speed: number, initial = 0) {
  const [turns, setTurns] = useState(initial);
  const frame = useRef<number | null>(null);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setTurns((prev) => prev + dt * speedRef.current);
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null;
    };
  }, [playing]);

  return { turns, setTurns };
}

/* ------------------------------------------------------------- мащаби */

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Scale {
  box: Box;
  xMax: number;
  yMax: number;
  /** данни → сцена по хоризонтала */
  sx: (x: number) => number;
  /** данни → сцена по вертикала (нулата е в средата на кутията) */
  sy: (y: number) => number;
  /** обратното на sx — за влачене по времевата ос */
  ux: (px: number) => number;
  /** път на графиката на fn в интервала [from, to] */
  path: (fn: (x: number) => number, samples?: number, from?: number, to?: number) => string;
  /** затворена област между fn и нулевата линия (за защриховане на мощността) */
  area: (fn: (x: number) => number, from: number, to: number, samples?: number) => string;
  /** нулевата линия в сцена координати */
  y0: number;
  /** долната граница на данните (по подразбиране симетрична на yMax) */
  yMin: number;
}

export function scaler(box: Box, xMax: number, yMax: number, yMin = -yMax): Scale {
  const sx = (x: number) => box.x + (x / xMax) * box.w;
  const sy = (y: number) => box.y + (box.h * (yMax - y)) / (yMax - yMin);
  const y0 = sy(0);
  const clampY = (y: number) => Math.min(box.y + box.h, Math.max(box.y, sy(y)));

  const path: Scale["path"] = (fn, samples = 260, from = 0, to = xMax) =>
    Array.from({ length: samples + 1 }, (_, i) => {
      const x = from + ((to - from) * i) / samples;
      return `${i === 0 ? "M" : "L"} ${q(sx(x))} ${q(clampY(fn(x)))}`;
    }).join(" ");

  const area: Scale["area"] = (fn, from, to, samples = 90) => {
    const top = Array.from({ length: samples + 1 }, (_, i) => {
      const x = from + ((to - from) * i) / samples;
      return `${i === 0 ? "M" : "L"} ${q(sx(x))} ${q(clampY(fn(x)))}`;
    }).join(" ");
    return `${top} L ${q(sx(to))} ${q(y0)} L ${q(sx(from))} ${q(y0)} Z`;
  };

  return {
    box,
    xMax,
    yMax,
    yMin,
    sx,
    sy,
    ux: (px: number) => ((px - box.x) / box.w) * xMax,
    path,
    area,
    y0,
  };
}

/* --------------------------------------------------------------- сцена */

/** Фон на сцената с мека мрежа и надпис в горния ляв ъгъл. */
export function Stage({ w, h, title }: { w: number; h: number; title?: string }) {
  const step = 25;
  return (
    <>
      <rect width={w} height={h} fill={STAGE_BG} />
      {Array.from({ length: Math.ceil(w / step) }, (_, i) => (
        <line key={`v${i}`} x1={i * step} y1={0} x2={i * step} y2={h} stroke={C.faint} opacity={0.1} />
      ))}
      {Array.from({ length: Math.ceil(h / step) }, (_, i) => (
        <line key={`h${i}`} x1={0} y1={i * step} x2={w} y2={i * step} stroke={C.faint} opacity={0.1} />
      ))}
      {title && (
        <text
          x={20}
          y={24}
          fill={C.mut}
          fontFamily={DRAWING_FONT_FAMILY}
          fontSize={12.5}
          fontWeight={600}
          letterSpacing="0.06em"
        >
          {title}
        </text>
      )}
    </>
  );
}

/**
 * Оси на времева графика: хоризонтална ос през нулата със стрелка и етикет,
 * вертикална ос вляво. Делителните черти по времето са на четвъртини период.
 */
export function PlotFrame({
  s,
  xLabel = "t",
  yLabel,
  yLabelColor = C.mut,
  quarterTicks = true,
  periods = 2,
}: {
  s: Scale;
  xLabel?: string;
  yLabel?: string;
  yLabelColor?: string;
  quarterTicks?: boolean;
  periods?: number;
}) {
  const { box, y0 } = s;
  const ticks = quarterTicks
    ? Array.from({ length: periods * 4 + 1 }, (_, i) => (i * s.xMax) / (periods * 4))
    : [];
  return (
    <g>
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={q(s.sx(t))}
          y1={box.y}
          x2={q(s.sx(t))}
          y2={box.y + box.h}
          stroke={C.faint}
          strokeWidth={i % 4 === 0 ? 1.4 : 0.8}
          opacity={i % 4 === 0 ? 0.55 : 0.28}
        />
      ))}
      <line x1={box.x} y1={y0} x2={box.x + box.w + 16} y2={y0} stroke={C.mut} strokeWidth={1.6} />
      <polygon
        points={`${box.x + box.w + 22},${y0} ${box.x + box.w + 12},${y0 - 4} ${box.x + box.w + 12},${y0 + 4}`}
        fill={C.mut}
      />
      <line x1={box.x} y1={box.y - 10} x2={box.x} y2={box.y + box.h} stroke={C.mut} strokeWidth={1.6} />
      <polygon
        points={`${box.x},${box.y - 16} ${box.x - 4},${box.y - 6} ${box.x + 4},${box.y - 6}`}
        fill={C.mut}
      />
      <SvgTex x={box.x + box.w + 24} y={y0 + 15} tex={xLabel} color={C.mut} fontSize={13} width={26} />
      {yLabel && (
        <SvgTex
          x={box.x - 8}
          y={box.y - 14}
          tex={yLabel}
          color={yLabelColor}
          fontSize={13}
          width={92}
          anchor="end"
        />
      )}
    </g>
  );
}

/* ------------------------------------------------------------ контроли */

export function RangeControl({
  label,
  value,
  min,
  max,
  step,
  valueTex,
  onChange,
  accent = "accent-minus",
}: {
  label: ReactNode;
  value: number;
  min: number;
  max: number;
  step: number;
  valueTex: string;
  onChange: (value: number) => void;
  accent?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center justify-between gap-3 text-[13px] font-semibold text-muted">
        <span className="text-ink">{label}</span>
        <span className="tabular-nums text-minus">
          <RichText text={`$${valueTex}$`} />
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className={`w-full ${accent}`}
      />
    </label>
  );
}

/** Малък превключвател-чип за включване на помощни означения. */
export function Toggle({
  on,
  onChange,
  children,
}: {
  on: boolean;
  onChange: (on: boolean) => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => onChange(!on)}
      className={
        on
          ? "cursor-pointer rounded-full border-[1.5px] border-ink bg-ink px-3 py-1 text-[12.5px] font-bold text-white"
          : "cursor-pointer rounded-full border-[1.5px] border-rule bg-surface px-3 py-1 text-[12.5px] font-semibold text-muted transition-colors hover:border-ink hover:text-ink"
      }
    >
      {children}
    </button>
  );
}

export interface Cell {
  label: string;
  tex: string;
  color?: string;
}

/** Readout лента: числените стойности живеят тук, не в сцената. */
export function Readouts({ cells, cols = 4 }: { cells: Cell[]; cols?: 3 | 4 | 5 }) {
  const grid =
    cols === 3
      ? "sm:grid-cols-3"
      : cols === 5
        ? "sm:grid-cols-3 lg:grid-cols-5"
        : "sm:grid-cols-2 lg:grid-cols-4";
  return (
    <dl
      className={`mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule ${grid}`}
    >
      {cells.map((cell) => (
        <div key={cell.label} className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">{cell.label}</dt>
          <dd
            className="mt-0.5 text-[14.5px] font-bold tabular-nums"
            style={{ color: cell.color ?? "var(--color-ink)" }}
          >
            <RichText text={`$${cell.tex}$`} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Легенда под сцената — държи цветовите обяснения извън SVG-то. */
export function Legend({ items }: { items: { color: string; tex: string }[] }) {
  return (
    <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-muted">
      {items.map((item) => (
        <li key={item.tex} className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="inline-block h-2.5 w-4 rounded-[2px]"
            style={{ background: item.color }}
          />
          <RichText text={item.tex} />
        </li>
      ))}
    </ul>
  );
}

/**
 * Хоризонтално превъртане за широките сцени: на телефон сцената се плъзга,
 * вместо надписите да станат нечетими.
 */
export function StageScroll({
  minWidth,
  maxWidth,
  children,
}: {
  minWidth: number;
  /** Таван за квадратните сцени: иначе `w-full` ги раздува на широк екран. */
  maxWidth?: number;
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <div className="mx-auto" style={{ minWidth, maxWidth }}>
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------- символи на елементи */

export function SourceSymbol({ x, y, r = 22, color = C.warn }: { x: number; y: number; r?: number; color?: string }) {
  const w = r * 0.62;
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={STAGE_BG} stroke={color} strokeWidth={2.6} />
      <path
        d={`M ${x - w} ${y} Q ${x - w / 2} ${y - w} ${x} ${y} T ${x + w} ${y}`}
        fill="none"
        stroke={color}
        strokeWidth={2.2}
      />
    </g>
  );
}

export function ResistorSymbol({
  x,
  y,
  w = 74,
  h = 15,
  color = C.plus,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  color?: string;
}) {
  const n = 6;
  const dx = w / n;
  const pts = [`${x},${y}`];
  for (let i = 0; i < n; i += 1) {
    pts.push(`${q(x + dx * (i + 0.5))},${y + (i % 2 === 0 ? -h : h)}`);
  }
  pts.push(`${x + w},${y}`);
  return <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth={2.8} strokeLinejoin="round" />;
}

export function InductorSymbol({
  x,
  y,
  w = 72,
  color = C.warn,
}: {
  x: number;
  y: number;
  w?: number;
  color?: string;
}) {
  const n = 4;
  const r = w / (2 * n);
  const arcs = Array.from({ length: n }, (_, i) => `M ${q(x + i * 2 * r)} ${y} a ${r} ${r} 0 0 1 ${q(2 * r)} 0`).join(" ");
  return <path d={arcs} fill="none" stroke={color} strokeWidth={2.8} />;
}

export function CapSymbol({
  x,
  y,
  gap = 11,
  plate = 26,
  color = C.minus,
}: {
  x: number;
  y: number;
  gap?: number;
  plate?: number;
  color?: string;
}) {
  return (
    <g stroke={color} strokeWidth={3.2}>
      <line x1={x - gap / 2} y1={y - plate / 2} x2={x - gap / 2} y2={y + plate / 2} />
      <line x1={x + gap / 2} y1={y - plate / 2} x2={x + gap / 2} y2={y + plate / 2} />
    </g>
  );
}
