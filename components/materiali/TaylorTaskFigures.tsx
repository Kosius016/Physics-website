"use client";

import { useId } from "react";
import RichText from "@/components/RichText";
import SvgTex from "@/components/interactives/SvgTex";
import { Legend } from "@/components/interactives/acPlot";
import { C, DRAWING_FONT_FAMILY, PANEL_CLASS, STAGE_BG, STAGE_CLASS } from "@/components/interactives/svg";

/**
 * Статични фигури към задачите за редове на Тейлър.
 *
 * Тук няма плъзгачи: всяка задача пита за една конкретна крива и за едно
 * конкретно приближение, затова свободен параметър няма какво да покаже.
 * Числените стойности стоят в лентата под сцената, а не в самата сцена.
 */

const W = 640;
const H = 330;
const BOX = { left: 76, right: 552, top: 52, bottom: 284 } as const;

interface Curve {
  fn: (x: number) => number;
  color: string;
  width?: number;
  dash?: string;
  /** Част от областта, ако кривата не е дефинирана навсякъде. */
  from?: number;
  to?: number;
}

interface Guide {
  y: number;
  tex: string;
  color: string;
}

interface Tick {
  at: number;
  tex: string;
}

interface PlotProps {
  title: string;
  aria: string;
  xDomain: [number, number];
  yDomain: [number, number];
  curves: Curve[];
  xTicks?: Tick[];
  yTicks?: Tick[];
  guides?: Guide[];
  xTex: string;
  /** Изписва се над горния ляв ъгъл на рамката, за да не се бие с кривите. */
  yTex?: string;
  xTexDy?: number;
  /** Отместване на числата по хоризонталната ос: отрицателно ги вдига над нея. */
  xTickDy?: number;
}

function Plot({
  title,
  aria,
  xDomain,
  yDomain,
  curves,
  xTicks = [],
  yTicks = [],
  guides = [],
  xTex,
  yTex,
  xTexDy = -6,
  xTickDy = 18,
}: PlotProps) {
  const clipId = useId().replaceAll(":", "");
  const sx = (x: number) =>
    BOX.left + ((x - xDomain[0]) / (xDomain[1] - xDomain[0])) * (BOX.right - BOX.left);
  const sy = (y: number) =>
    BOX.bottom - ((y - yDomain[0]) / (yDomain[1] - yDomain[0])) * (BOX.bottom - BOX.top);
  const axisY = yDomain[0] <= 0 && yDomain[1] >= 0 ? sy(0) : BOX.bottom;
  const axisX = xDomain[0] <= 0 && xDomain[1] >= 0 ? sx(0) : BOX.left;

  const path = (curve: Curve) => {
    const a = curve.from ?? xDomain[0];
    const b = curve.to ?? xDomain[1];
    return Array.from({ length: 241 }, (_, i) => {
      const x = a + ((b - a) * i) / 240;
      return `${i === 0 ? "M" : "L"}${sx(x).toFixed(2)},${sy(curve.fn(x)).toFixed(2)}`;
    }).join(" ");
  };

  return (
    <div className="overflow-x-auto">
      <div className="mx-auto min-w-[600px]">
        <svg viewBox={`0 0 ${W} ${H}`} className={`${STAGE_CLASS} select-none`} role="img" aria-label={aria}>
          <rect width={W} height={H} fill={STAGE_BG} />
          <defs>
            <clipPath id={clipId}>
              <rect
                x={BOX.left}
                y={BOX.top}
                width={BOX.right - BOX.left}
                height={BOX.bottom - BOX.top}
              />
            </clipPath>
          </defs>

          <text
            x={20}
            y={22}
            fill={C.mut}
            fontFamily={DRAWING_FONT_FAMILY}
            fontSize={12.5}
            fontWeight={600}
            letterSpacing="0.06em"
          >
            {title}
          </text>

          {/* помощна мрежа */}
          {[0.25, 0.5, 0.75].map((part) => (
            <g key={part} stroke={C.faint} strokeWidth={1} opacity={0.5}>
              <line
                x1={BOX.left}
                y1={BOX.top + part * (BOX.bottom - BOX.top)}
                x2={BOX.right}
                y2={BOX.top + part * (BOX.bottom - BOX.top)}
              />
              <line
                x1={BOX.left + part * (BOX.right - BOX.left)}
                y1={BOX.top}
                x2={BOX.left + part * (BOX.right - BOX.left)}
                y2={BOX.bottom}
              />
            </g>
          ))}

          {/* хоризонталните ориентири на граничните стойности */}
          <g clipPath={`url(#${clipId})`}>
            {guides.map((g) => (
              <line
                key={g.tex}
                x1={BOX.left}
                y1={sy(g.y)}
                x2={BOX.right}
                y2={sy(g.y)}
                stroke={g.color}
                strokeWidth={1.4}
                strokeDasharray="6 5"
                opacity={0.75}
              />
            ))}
          </g>

          <g stroke={C.mut} strokeWidth={1.5}>
            <line x1={BOX.left} y1={axisY} x2={BOX.right + 14} y2={axisY} />
            <line x1={axisX} y1={BOX.top - 10} x2={axisX} y2={BOX.bottom} />
          </g>

          <g clipPath={`url(#${clipId})`}>
            {curves.map((curve, i) => (
              <path
                key={i}
                d={path(curve)}
                fill="none"
                stroke={curve.color}
                strokeWidth={curve.width ?? 2.8}
                strokeDasharray={curve.dash}
                strokeLinecap="round"
              />
            ))}
          </g>

          {/* деления */}
          {xTicks.map((t) => (
            <g key={`x${t.at}`}>
              <line x1={sx(t.at)} y1={axisY} x2={sx(t.at)} y2={axisY + 5} stroke={C.mut} strokeWidth={1.4} />
              <SvgTex
                x={sx(t.at)}
                y={axisY + xTickDy}
                tex={t.tex}
                color={C.mut}
                fontSize={12}
                width={44}
                anchor="middle"
              />
            </g>
          ))}
          {yTicks.map((t) => (
            <g key={`y${t.at}`}>
              <line x1={axisX - 5} y1={sy(t.at)} x2={axisX} y2={sy(t.at)} stroke={C.mut} strokeWidth={1.4} />
              <SvgTex
                x={axisX - 10}
                y={sy(t.at)}
                tex={t.tex}
                color={C.mut}
                fontSize={12}
                width={54}
                anchor="end"
              />
            </g>
          ))}

          {/* стойностите на границите стоят до самите ориентири */}
          {guides.map((g) => (
            <SvgTex
              key={`g${g.tex}`}
              x={BOX.right + 8}
              y={sy(g.y)}
              tex={g.tex}
              color={g.color}
              fontSize={13}
              width={64}
            />
          ))}

          <SvgTex x={BOX.right + 8} y={axisY + xTexDy} tex={xTex} color={C.mut} fontSize={13} width={72} />
          {yTex && <SvgTex x={BOX.left - 6} y={BOX.top - 12} tex={yTex} color={C.mut} fontSize={13} width={150} />}
        </svg>
      </div>
    </div>
  );
}

/* ================================================== §I граници чрез редове */

const nearZero = (x: number, eps: number, value: number, fn: (t: number) => number) =>
  Math.abs(x) < eps ? value : fn(x);

/** Трите частни от задачи 4, 5 и 8 клонят към различни, но напълно определени числа. */
export function LimitRatioFigure() {
  return (
    <div className={PANEL_CLASS}>
      <Plot
        title="ЕДНО И СЪЩО ПОВЕДЕНИЕ: ЧАСТНОТО КЛОНИ КЪМ ЧИСЛО, НЕ КЪМ НУЛА"
        aria="Три частни, които при клонене на аргумента към нула се приближават към различни крайни стойности"
        xDomain={[-3, 3]}
        yDomain={[-0.85, 0.6]}
        xTex="x"
        xTexDy={-14}
        xTickDy={-13}
        curves={[
          {
            fn: (x) => nearZero(x, 1e-4, 0.5, (t) => (1 - Math.cos(t)) / (t * t)),
            color: C.ok,
          },
          {
            fn: (x) => nearZero(x, 1e-3, -1 / 6, (t) => (Math.sin(t) - t) / t ** 3),
            color: C.minus,
          },
          {
            fn: (x) => nearZero(x, 1e-4, -0.5, (t) => (Math.log(1 + t) - t) / (t * t)),
            color: C.warn,
            from: -0.55,
            to: 3,
          },
        ]}
        xTicks={[
          { at: -2, tex: "-2" },
          { at: -1, tex: "-1" },
          { at: 1, tex: "1" },
          { at: 2, tex: "2" },
        ]}
        guides={[
          { y: 0.5, tex: String.raw`\tfrac12`, color: C.ok },
          { y: -1 / 6, tex: String.raw`-\tfrac16`, color: C.minus },
          { y: -0.5, tex: String.raw`-\tfrac12`, color: C.warn },
        ]}
      />

      <Legend
        items={[
          { color: C.ok, tex: String.raw`$\dfrac{1-\cos x}{x^2}$ (задача 4)` },
          { color: C.minus, tex: String.raw`$\dfrac{\sin x-x}{x^3}$ (задача 5)` },
          { color: C.warn, tex: String.raw`$\dfrac{\ln(1+x)-x}{x^2}$ (задача 8)` },
        ]}
      />

      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="И трите частни са от вида $0/0$ при $x=0$, тоест самата точка е изключена от областта. Въпреки това кривите не се разкъсват: приближават се плавно към пунктираната си права. Редът обяснява защо. Числителят и знаменателят започват с една и съща степен на $x$, тя се съкращава и остава отношението на **коефициентите** пред нея. Тъкмо това число е границата." />
      </p>
    </div>
  );
}

/* ============================================ §II дипол и зареден пръстен */

const DIPOLE_EXACT = (u: number) => 1 / (u - 1) - 1 / (u + 1);
const DIPOLE_APPROX = (u: number) => 2 / (u * u);

/** Точният потенциал на дипола по оста и приближението $kp/x^2$. */
export function DipolePotentialFigure() {
  const rows = [2, 3, 5, 8].map((u) => ({
    u,
    err: ((DIPOLE_EXACT(u) - DIPOLE_APPROX(u)) / DIPOLE_EXACT(u)) * 100,
  }));

  return (
    <div className={PANEL_CLASS}>
      <Plot
        title="ДИПОЛ ПО ОСТА · ПРИБЛИЖЕНИЕТО ДОГОНВА ТОЧНАТА КРИВА"
        aria="Точният потенциал на дипола по оста и приближението, пропорционално на едно върху х на квадрат"
        xDomain={[1.5, 8]}
        yDomain={[0, 2]}
        xTex="x/a"
        yTex={String.raw`\Delta V\ \big/\ (kq/a)`}
        curves={[
          { fn: DIPOLE_EXACT, color: C.wire, width: 3 },
          { fn: DIPOLE_APPROX, color: C.ok, width: 2.6, dash: "8 5" },
        ]}
        xTicks={[
          { at: 2, tex: "2" },
          { at: 4, tex: "4" },
          { at: 6, tex: "6" },
        ]}
        yTicks={[
          { at: 0.5, tex: "0{,}5" },
          { at: 1, tex: "1{,}0" },
          { at: 1.5, tex: "1{,}5" },
        ]}
      />

      <Legend
        items={[
          { color: C.wire, tex: String.raw`точно: $\Delta V=kq\left(\frac1{x-a}-\frac1{x+a}\right)$` },
          { color: C.ok, tex: String.raw`приближение: $\Delta V\approx kp/x^2$` },
        ]}
      />

      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule sm:grid-cols-4">
        {rows.map((row) => (
          <div key={row.u} className="min-w-0 bg-surface px-3 py-2.5">
            <dt className="text-[10.5px] font-bold tracking-wide text-muted">
              <RichText text={`Грешка при $x=${row.u}a$`} />
            </dt>
            <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-ok">
              <RichText text={`$${row.err.toFixed(1).replace(".", "{,}")}\\,\\%$`} />
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Приближението не е „приблизително вярно навсякъде“: близо до зарядите то греши с десетки проценти, а грешката пада бързо с отдалечаването. Затова условието $x\gg a$ не е украса, а част от отговора." />
      </p>
    </div>
  );
}

const RING_EXACT = (t: number) => 1 / Math.sqrt(1 + t * t);
const RING_POINT = (t: number) => 1 / t;
const RING_CORRECTED = (t: number) => (1 / t) * (1 - 1 / (2 * t * t));

/** Потенциалът на пръстен по оста: точков заряд срещу първата поправка. */
export function RingPotentialFigure() {
  const rows = [1.5, 2, 3].map((t) => ({
    t,
    point: ((RING_POINT(t) - RING_EXACT(t)) / RING_EXACT(t)) * 100,
    corrected: ((RING_CORRECTED(t) - RING_EXACT(t)) / RING_EXACT(t)) * 100,
  }));

  return (
    <div className={PANEL_CLASS}>
      <Plot
        title="ЗАРЕДЕН ПРЪСТЕН · ЕДНА ПОПРАВКА ВЪРШИ ПОЧТИ ЦЯЛАТА РАБОТА"
        aria="Потенциалът на зареден пръстен по оста, сравнен с точков заряд и с първата поправка"
        xDomain={[1, 5]}
        yDomain={[0, 1.05]}
        xTex="z/R"
        yTex={String.raw`\Delta V\ \big/\ (kQ/R)`}
        curves={[
          { fn: RING_EXACT, color: C.wire, width: 3 },
          { fn: RING_POINT, color: C.warn, width: 2.4, dash: "8 5" },
          { fn: RING_CORRECTED, color: C.ok, width: 2.6 },
        ]}
        xTicks={[
          { at: 2, tex: "2" },
          { at: 3, tex: "3" },
          { at: 4, tex: "4" },
        ]}
        yTicks={[
          { at: 0.25, tex: "0{,}25" },
          { at: 0.5, tex: "0{,}50" },
          { at: 0.75, tex: "0{,}75" },
          { at: 1, tex: "1{,}00" },
        ]}
      />

      <Legend
        items={[
          { color: C.wire, tex: String.raw`точно: $\Delta V=kQ/\sqrt{z^2+R^2}$` },
          { color: C.warn, tex: String.raw`точков заряд: $kQ/z$` },
          { color: C.ok, tex: String.raw`с поправката: $\frac{kQ}{z}\left(1-\frac{R^2}{2z^2}\right)$` },
        ]}
      />

      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule sm:grid-cols-3">
        {rows.map((row) => (
          <div key={row.t} className="min-w-0 bg-surface px-3 py-2.5">
            <dt className="text-[10.5px] font-bold tracking-wide text-muted">
              <RichText text={`При $z=${row.t.toFixed(1).replace(".", "{,}")}R$`} />
            </dt>
            <dd className="mt-0.5 text-[14.5px] font-bold tabular-nums text-ok">
              <RichText
                text={`$${row.point > 0 ? "+" : ""}${row.point.toFixed(1).replace(".", "{,}")}\\,\\%\\ \\to\\ ${row.corrected > 0 ? "+" : ""}${row.corrected.toFixed(1).replace(".", "{,}")}\\,\\%$`}
              />
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Първото число е грешката на голия точков заряд, второто е грешката след единствената поправка от ред $R^2/z^2$. Знакът също носи смисъл: всички точки на пръстена са на разстояние по-голямо от $z$, затова истинският потенциал е **по-малък** от този на точков заряд и поправката е отрицателна. Забележете и че зелената крива се обръща надолу при $z\approx R$: там разгъването вече е извън областта си на приложимост, защото $R^2/z^2$ престава да бъде малко." />
      </p>
    </div>
  );
}
