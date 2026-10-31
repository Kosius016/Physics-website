"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import { C, DRAWING_FONT_FAMILY, PANEL_CLASS, STAGE_BG, STAGE_CLASS } from "./svg";

const W = 720;
const H = 400;
const LEFT = 66;
const RIGHT = 640;
const TOP = 26;
const BOTTOM = 320;
const X_MIN = -20;
const X_MAX = 15;
const Y_MAX = 16;
const REAL_SHARE = 0.5;

const X = (t: number) => LEFT + ((t - X_MIN) / (X_MAX - X_MIN)) * (RIGHT - LEFT);
const Y = (e: number) => TOP + ((Y_MAX - e) / Y_MAX) * (BOTTOM - TOP);
const q = (v: number) => Math.round(v * 100) / 100;

/** Граничният коефициент на термопомпа между вода в отоплението и външен въздух. */
const epsilon = (hot: number, cold: number) => (hot + 273.15) / (hot - cold);

function curve(hot: number, share: number): string {
  const pts: string[] = [];
  for (let k = 0; k <= 140; k += 1) {
    const cold = X_MIN + ((X_MAX - X_MIN) * k) / 140;
    pts.push(`${q(X(cold))},${q(Y(share * epsilon(hot, cold)))}`);
  }
  return pts.join(" ");
}

/**
 * Колко топлина дава термопомпата за единица електричество.
 *
 * Границата от втория принцип зависи само от двете температури, затова
 * кривата е една и съща за всяка машина. Плъзгачите менят температурата на
 * водата в отоплението и външната температура; реалната крива е около
 * половината от граничната.
 */
export default function HeatPumpLab() {
  const [hot, setHot] = useState(35);
  const [cold, setCold] = useState(-5);
  const [load, setLoad] = useState(8);

  const ideal = epsilon(hot, cold);
  const real = ideal * REAL_SHARE;
  const electric = load / real;
  const fromAir = load - electric;
  const references = [35, 55].filter((ref) => Math.abs(ref - hot) >= 3);

  return (
    <div className={PANEL_CLASS}>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className={STAGE_CLASS}
          style={{ fontFamily: DRAWING_FONT_FAMILY, minWidth: 540 }}
          role="img"
          aria-label="Коефициентът на термопомпата в зависимост от външната температура, гранична и реална крива"
        >
          <rect width={W} height={H} fill={STAGE_BG} />
          <g stroke={C.faint} opacity={0.12}>
            {Array.from({ length: Math.ceil(W / 26) + 1 }, (_, i) => (
              <line key={`v${i}`} x1={i * 26} y1={0} x2={i * 26} y2={H} />
            ))}
            {Array.from({ length: Math.ceil(H / 26) + 1 }, (_, i) => (
              <line key={`h${i}`} x1={0} y1={i * 26} x2={W} y2={i * 26} />
            ))}
          </g>
          <defs>
            <clipPath id="cop-lab-clip">
              <rect x={LEFT} y={TOP} width={RIGHT - LEFT} height={BOTTOM - TOP} />
            </clipPath>
          </defs>

          <g stroke={C.wire} strokeWidth={1.6} fill={C.wire}>
            <line x1={LEFT} y1={BOTTOM} x2={RIGHT} y2={BOTTOM} />
            <line x1={LEFT} y1={BOTTOM} x2={LEFT} y2={TOP} />
            <polygon points={`${RIGHT + 10},${BOTTOM} ${RIGHT},${BOTTOM - 5} ${RIGHT},${BOTTOM + 5}`} stroke="none" />
            <polygon points={`${LEFT},${TOP - 10} ${LEFT - 5},${TOP} ${LEFT + 5},${TOP}`} stroke="none" />
          </g>
          <line x1={LEFT} y1={Y(1)} x2={RIGHT} y2={Y(1)} stroke={C.mut} strokeWidth={1.2} strokeDasharray="5 5" />

          <g clipPath="url(#cop-lab-clip)">
            {references.map((ref) => (
              <polyline key={ref} points={curve(ref, 1)} fill="none" stroke={C.faint} strokeWidth={1.6} />
            ))}
            <polyline points={curve(hot, 1)} fill="none" stroke={C.minus} strokeWidth={3.2} />
            <polyline points={curve(hot, REAL_SHARE)} fill="none" stroke={C.ok} strokeWidth={2.8} strokeDasharray="7 5" />
            <line x1={X(cold)} y1={TOP} x2={X(cold)} y2={BOTTOM} stroke={C.faint} strokeDasharray="3 4" />
            {ideal <= Y_MAX ? <circle cx={X(cold)} cy={Y(ideal)} r={6} fill={C.minus} /> : null}
            <circle cx={X(cold)} cy={Y(real)} r={6} fill={STAGE_BG} stroke={C.ok} strokeWidth={2.6} />
          </g>

          {[0, 2, 4, 6, 8, 10, 12, 14, 16].map((e) => (
            <SvgTex key={e} x={LEFT - 10} y={Y(e)} tex={String(e)} color={C.mut} fontSize={12} width={22} anchor="end" />
          ))}
          {[-20, -15, -10, -5, 0, 5, 10, 15].map((t) => (
            <SvgTex
              key={t}
              x={X(t)}
              y={BOTTOM + 22}
              tex={t < 0 ? `-${Math.abs(t)}` : String(t)}
              color={C.mut}
              fontSize={12}
              width={28}
              anchor="middle"
            />
          ))}
          <SvgTex x={RIGHT} y={BOTTOM + 52} tex="t_{\text{навън}},\ ^\circ\mathrm{C}" color={C.mut} fontSize={13} width={104} anchor="end" />
          <SvgTex x={LEFT + 14} y={TOP + 12} tex="\varepsilon_{\text{тп}}" color={C.mut} fontSize={13} width={36} />
          {references.map((ref) => {
            const value = epsilon(ref, X_MAX);
            if (value > Y_MAX) return null;
            return (
              <SvgTex
                key={ref}
                x={RIGHT + 16}
                y={Y(value)}
                tex={`${ref}\\,^\\circ\\mathrm{C}`}
                color={C.faint}
                fontSize={12}
                width={54}
              />
            );
          })}
          <SvgTex x={LEFT + 14} y={Y(1) - 16} tex="\varepsilon=1" color={C.mut} fontSize={12} width={44} />
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[12.5px] text-muted">
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="inline-block h-[3px] w-4 rounded-full" style={{ background: C.minus }} />
          граница от втория принцип
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="inline-block h-[3px] w-4 rounded-full" style={{ background: C.ok }} />
          реална машина, около половината
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="inline-block h-[3px] w-4 rounded-full" style={{ background: C.faint }} />
          другите температури на водата
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule sm:grid-cols-4">
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Граничен коефициент</dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-minus">
            <RichText text={`$\\varepsilon=${ideal.toFixed(1).replace(".", "{,}")}$`} />
          </dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Реален коефициент</dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-ok">
            <RichText text={`$\\varepsilon=${real.toFixed(1).replace(".", "{,}")}$`} />
          </dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Нужно електричество</dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-plus">
            <RichText text={`$${electric.toFixed(1).replace(".", "{,}")}\\,\\mathrm{kW}$`} />
          </dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Взето от външния въздух</dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-ink">
            <RichText text={`$${fromAir.toFixed(1).replace(".", "{,}")}\\,\\mathrm{kW}$`} />
          </dd>
        </div>
      </dl>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <label className="text-[13px] font-medium text-muted">
          <span className="flex justify-between">
            <span>Вода в отоплението</span>
            <strong className="text-minus">
              <RichText text={`$${hot}\\,^\\circ\\mathrm{C}$`} />
            </strong>
          </span>
          <input className="w-full accent-(--color-minus)" type="range" min="25" max="70" step="1" value={hot} onChange={(e) => setHot(+e.target.value)} />
        </label>
        <label className="text-[13px] font-medium text-muted">
          <span className="flex justify-between">
            <span>Температура навън</span>
            <strong className="text-ok">
              <RichText text={`$${cold}\\,^\\circ\\mathrm{C}$`} />
            </strong>
          </span>
          <input className="w-full accent-(--color-ok)" type="range" min="-20" max="15" step="1" value={cold} onChange={(e) => setCold(+e.target.value)} />
        </label>
        <label className="text-[13px] font-medium text-muted">
          <span className="flex justify-between">
            <span>Топлинни загуби на къщата</span>
            <strong className="text-plus">
              <RichText text={`$${load}\\,\\mathrm{kW}$`} />
            </strong>
          </span>
          <input className="w-full accent-(--color-plus)" type="range" min="2" max="16" step="1" value={load} onChange={(e) => setLoad(+e.target.value)} />
        </label>
      </div>
    </div>
  );
}
