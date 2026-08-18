"use client";

import { useMemo, useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "@/components/interactives/SvgTex";
import {
  BTN_SEC,
  C,
  PANEL_CLASS,
  STAGE_BG,
  STAGE_CLASS,
} from "@/components/interactives/svg";

type FunctionKey = "sin" | "exp" | "binomial";

interface FunctionCase {
  label: string;
  exactTex: string;
  firstTex: string;
  secondTex: string;
  domain: [number, number];
  range: [number, number];
  defaultX: number;
  step: number;
  exact: (x: number) => number;
  first: (x: number) => number;
  second: (x: number) => number;
}

const CASES: Record<FunctionKey, FunctionCase> = {
  sin: {
    label: "Синус",
    exactTex: String.raw`\sin x`,
    firstTex: String.raw`x`,
    secondTex: String.raw`x-\frac{x^3}{3!}`,
    domain: [-1.5, 1.5],
    range: [-1.55, 1.55],
    defaultX: 0.6,
    step: 0.01,
    exact: Math.sin,
    first: (x) => x,
    second: (x) => x - x ** 3 / 6,
  },
  exp: {
    label: "Експонента",
    exactTex: String.raw`\mathrm e^x`,
    firstTex: String.raw`1+x`,
    secondTex: String.raw`1+x+\frac{x^2}{2!}`,
    domain: [-1, 1],
    range: [0, 3],
    defaultX: 0.55,
    step: 0.01,
    exact: Math.exp,
    first: (x) => 1 + x,
    second: (x) => 1 + x + x ** 2 / 2,
  },
  binomial: {
    label: "Биномен ред",
    exactTex: String.raw`(1+x)^{-1/2}`,
    firstTex: String.raw`1-\frac{x}{2}`,
    secondTex: String.raw`1-\frac{x}{2}+\frac{3x^2}{8}`,
    domain: [-0.65, 1],
    range: [0.4, 1.8],
    defaultX: 0.4,
    step: 0.01,
    exact: (x) => (1 + x) ** -0.5,
    first: (x) => 1 - x / 2,
    second: (x) => 1 - x / 2 + (3 * x ** 2) / 8,
  },
};

const W = 640;
const H = 330;
const PLOT = { left: 58, right: 616, top: 54, bottom: 292 } as const;

function pathFor(
  fn: (x: number) => number,
  domain: [number, number],
  range: [number, number],
) {
  const sx = (x: number) =>
    PLOT.left + ((x - domain[0]) / (domain[1] - domain[0])) * (PLOT.right - PLOT.left);
  const sy = (y: number) =>
    PLOT.bottom - ((y - range[0]) / (range[1] - range[0])) * (PLOT.bottom - PLOT.top);

  return Array.from({ length: 181 }, (_, i) => {
    const x = domain[0] + (i / 180) * (domain[1] - domain[0]);
    return `${i === 0 ? "M" : "L"}${sx(x).toFixed(2)},${sy(fn(x)).toFixed(2)}`;
  }).join(" ");
}

function bgNumber(value: number, digits = 5) {
  return value.toFixed(digits).replace(".", "{,}");
}

export default function TaylorSeriesLab() {
  const [selected, setSelected] = useState<FunctionKey>("sin");
  const [x, setX] = useState(CASES.sin.defaultX);
  const current = CASES[selected];

  const paths = useMemo(
    () => ({
      exact: pathFor(current.exact, current.domain, current.range),
      first: pathFor(current.first, current.domain, current.range),
      second: pathFor(current.second, current.domain, current.range),
    }),
    [current],
  );

  const sx = (value: number) =>
    PLOT.left +
    ((value - current.domain[0]) / (current.domain[1] - current.domain[0])) *
      (PLOT.right - PLOT.left);
  const sy = (value: number) =>
    PLOT.bottom -
    ((value - current.range[0]) / (current.range[1] - current.range[0])) *
      (PLOT.bottom - PLOT.top);
  const xAxisY =
    current.range[0] <= 0 && current.range[1] >= 0 ? sy(0) : PLOT.bottom;
  const yAxisX =
    current.domain[0] <= 0 && current.domain[1] >= 0 ? sx(0) : PLOT.left;

  const exact = current.exact(x);
  const first = current.first(x);
  const second = current.second(x);
  const error = Math.abs(second - exact);

  return (
    <div className={PANEL_CLASS}>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Избор на функция">
        {(Object.keys(CASES) as FunctionKey[]).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={selected === key}
            className={selected === key ? `${BTN_SEC} bg-hl` : BTN_SEC}
            onClick={() => {
              setSelected(key);
              setX(CASES[key].defaultX);
            }}
          >
            {CASES[key].label}
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto">
        <div className="mx-auto min-w-[640px]">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className={STAGE_CLASS}
            aria-label="Графика на точна функция и две приближения на Тейлър"
          >
            <rect width={W} height={H} fill={STAGE_BG} />

            {[0.25, 0.5, 0.75].map((part) => (
              <g key={part} stroke={C.faint} strokeWidth={1}>
                <line
                  x1={PLOT.left}
                  y1={PLOT.top + part * (PLOT.bottom - PLOT.top)}
                  x2={PLOT.right}
                  y2={PLOT.top + part * (PLOT.bottom - PLOT.top)}
                />
                <line
                  x1={PLOT.left + part * (PLOT.right - PLOT.left)}
                  y1={PLOT.top}
                  x2={PLOT.left + part * (PLOT.right - PLOT.left)}
                  y2={PLOT.bottom}
                />
              </g>
            ))}

            <g stroke={C.mut} strokeWidth={1.5}>
              <line x1={PLOT.left} y1={xAxisY} x2={PLOT.right} y2={xAxisY} />
              <line x1={yAxisX} y1={PLOT.top} x2={yAxisX} y2={PLOT.bottom} />
            </g>

            <path d={paths.exact} fill="none" stroke={C.wire} strokeWidth={3.1} />
            <path d={paths.first} fill="none" stroke={C.warn} strokeWidth={2.4} strokeDasharray="8 5" />
            <path d={paths.second} fill="none" stroke={C.ok} strokeWidth={2.7} />

            <line
              x1={sx(x)}
              y1={PLOT.top}
              x2={sx(x)}
              y2={PLOT.bottom}
              stroke={C.minus}
              strokeWidth={1.5}
              strokeDasharray="4 5"
            />
            <circle cx={sx(x)} cy={sy(exact)} r={5.5} fill={C.wire} stroke={STAGE_BG} strokeWidth={2} />
            <circle cx={sx(x)} cy={sy(second)} r={4.2} fill={C.ok} stroke={STAGE_BG} strokeWidth={2} />

            <g>
              <line x1={78} y1={25} x2={106} y2={25} stroke={C.wire} strokeWidth={3} />
              <SvgTex x={114} y={25} tex={current.exactTex} color={C.wire} width={105} />
              <line x1={245} y1={25} x2={273} y2={25} stroke={C.warn} strokeWidth={2.4} strokeDasharray="7 4" />
              <SvgTex x={281} y={25} tex={current.firstTex} color={C.warn} width={132} />
              <line x1={437} y1={25} x2={465} y2={25} stroke={C.ok} strokeWidth={2.7} />
              <SvgTex x={473} y={25} tex={current.secondTex} color={C.ok} width={152} />
            </g>

            <SvgTex x={PLOT.right - 2} y={xAxisY - 16} tex="x" color={C.mut} width={22} anchor="end" />
            <SvgTex x={yAxisX + 10} y={PLOT.top + 8} tex="f(x)" color={C.mut} width={46} />
          </svg>
        </div>
      </div>

      <label className="mt-4 block text-[13px] font-bold uppercase tracking-wide text-muted">
        Точка на проверка: <RichText text={`$x=${bgNumber(x, 2)}$`} />
      </label>
      <input
        type="range"
        min={current.domain[0]}
        max={current.domain[1]}
        step={current.step}
        value={x}
        onChange={(event) => setX(Number(event.target.value))}
        className="mt-2 w-full accent-minus"
        aria-label="Стойност на x"
      />

      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule sm:grid-cols-4">
        {[
          ["Точна стойност", `$${current.exactTex}=${bgNumber(exact)}$`, "text-ink"],
          ["Първо приближение", `$T_1=${bgNumber(first)}$`, "text-plus"],
          ["Следващ член", `$T_2=${bgNumber(second)}$`, "text-ok"],
          ["Абсолютна грешка", `$|T_2-f|=${bgNumber(error)}$`, "text-minus"],
        ].map(([label, value, color]) => (
          <div key={label} className="min-w-0 bg-surface px-3 py-2.5">
            <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">{label}</dt>
            <dd className={`mt-0.5 text-[14.5px] font-bold tabular-nums ${color}`}>
              <RichText text={value} />
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-3 text-[14px] leading-relaxed text-muted">
        Преместете точката към <RichText text="$x=0$" />. Зелената крива се прилепва към
        точната по-бързо, защото е запазен още един ненулев член от реда.
      </p>
    </div>
  );
}
