"use client";

import type { ReactNode } from "react";
import RichText from "@/components/RichText";
import { C, PANEL_CLASS } from "@/components/interactives/svg";

/**
 * Споделената обвивка на интерактивните проверки в страниците със задачи:
 * бял панел, заглавие, сцена, плъзгачи и readout лента под нея.
 *
 * Числените стойности никога не влизат в SVG сцената, а само в readout лентата
 * (виж CLAUDE.md §4), затова `Readouts` е част от обвивката, а не по избор.
 */

export type ReadoutTone = "text-ink" | "text-minus" | "text-plus" | "text-ok";

export type ReadoutItem = {
  label: string;
  tex: string;
  tone?: ReadoutTone;
};

/** Десетично число с запетая, готово за KaTeX. */
export function decimal(value: number, digits = 2) {
  return value.toFixed(digits).replace(".", "{,}");
}

/** Закръгляне за SVG координати, за да не се раждат дълги дробни числа в DOM. */
export function svgNumber(value: number) {
  return Math.round(value * 1000) / 1000;
}

export function RangeControl({
  label,
  value,
  min,
  max,
  step,
  valueLabel,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  valueLabel: ReactNode;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between gap-3 text-[13px] font-semibold">
        <span>{label}</span>
        <span className="tabular-nums text-minus">{valueLabel}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-minus"
      />
    </label>
  );
}

export function Readouts({
  items,
  columns = "sm:grid-cols-3 xl:grid-cols-6",
}: {
  items: ReadoutItem[];
  columns?: string;
}) {
  return (
    <dl
      className={`mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule ${columns}`}
    >
      {items.map((item) => (
        <div key={item.label} className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">
            <RichText text={item.label} />
          </dt>
          <dd className={`mt-0.5 text-[14px] font-bold tabular-nums ${item.tone ?? "text-ink"}`}>
            <RichText text={`$${item.tex}$`} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function LabShell({
  title,
  description,
  children,
  controls,
  controlsColumns = "sm:grid-cols-2",
  readouts,
  readoutColumns,
}: {
  title: string;
  description: string;
  children: ReactNode;
  controls?: ReactNode;
  controlsColumns?: string;
  readouts: ReadoutItem[];
  readoutColumns?: string;
}) {
  return (
    <div className={PANEL_CLASS}>
      <div className="mb-4">
        <p className="text-[11px] font-bold uppercase tracking-[.16em] text-minus">
          Интерактивна проверка
        </p>
        <h3 className="mt-1 font-serif text-[22px] font-bold">{title}</h3>
        <p className="mt-1 max-w-3xl text-[14px] text-muted">{description}</p>
      </div>
      {children}
      {controls && <div className={`mt-4 grid gap-4 ${controlsColumns}`}>{controls}</div>}
      <Readouts items={readouts} columns={readoutColumns} />
    </div>
  );
}

/** Мрежа и оси за графика в сцена: четвъртини по двете посоки. */
export function graphGrid({
  left,
  top,
  width,
  height,
}: {
  left: number;
  top: number;
  width: number;
  height: number;
}) {
  return (
    <g>
      {[0, 0.25, 0.5, 0.75, 1].map((fraction) => (
        <g key={fraction}>
          <line
            x1={left + fraction * width}
            y1={top}
            x2={left + fraction * width}
            y2={top + height}
            stroke={C.faint}
            strokeWidth={1}
          />
          <line
            x1={left}
            y1={top + fraction * height}
            x2={left + width}
            y2={top + fraction * height}
            stroke={C.faint}
            strokeWidth={1}
          />
        </g>
      ))}
      <line x1={left} y1={top + height} x2={left + width} y2={top + height} stroke={C.wire} strokeWidth={2} />
      <line x1={left} y1={top} x2={left} y2={top + height} stroke={C.wire} strokeWidth={2} />
    </g>
  );
}
