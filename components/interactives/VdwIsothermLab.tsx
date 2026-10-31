"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import { binodal, maxwellConstruction, reducedPressure, spinodalPressure } from "@/lib/realGas";
import SvgTex from "./SvgTex";
import { C, DRAWING_FONT_FAMILY, PANEL_CLASS, STAGE_BG, STAGE_CLASS } from "./svg";

const W = 720;
const H = 440;
const LEFT = 70;
const RIGHT = 690;
const TOP = 28;
const BOTTOM = 368;
const V_MIN = 0.4;
const V_MAX = 4.6;
const P_MIN = -0.6;
const P_MAX = 2;

/**
 * Осите са линейни по двете координати. Логаритмична ос по обема изглежда
 * по-компактно, но тогава двете равни площи вече не изглеждат равни - а точно
 * това е цялата идея на конструкцията на Максуел.
 */
const X = (v: number) => LEFT + ((v - V_MIN) / (V_MAX - V_MIN)) * (RIGHT - LEFT);
const Y = (p: number) => TOP + ((P_MAX - p) / (P_MAX - P_MIN)) * (BOTTOM - TOP);
const q = (v: number) => Math.round(v * 100) / 100;

/** Точки по изотермата между два обема, с отрязване извън платното. */
function branch(from: number, to: number, T: number, steps = 120): string {
  const pts: string[] = [];
  for (let k = 0; k <= steps; k += 1) {
    const v = from + (to - from) * (k / steps);
    const p = Math.min(P_MAX + 1, Math.max(P_MIN - 1, reducedPressure(v, T)));
    pts.push(`${q(X(v))},${q(Y(p))}`);
  }
  return pts.join(" ");
}

const PROBE_MIN = 0.42;
const PROBE_MAX = 4.5;

/**
 * Изотермите на Ван дер Ваалс в приведени единици и конструкцията на Максуел.
 *
 * Температурният плъзгач мести изотермата; под критичната програмата намира
 * хоризонталата, за която двете оцветени площи са равни, и разделя кривата на
 * устойчив, метастабилен и неустойчив участък. Вторият плъзгач мести пробна
 * точка по кривата и казва в кой от трите участъка е попаднала.
 */
export default function VdwIsothermLab() {
  const [T, setT] = useState(0.9);
  const [probeVolume, setProbeVolume] = useState(2.6);
  const [showAreas, setShowAreas] = useState(true);
  const [showDomes, setShowDomes] = useState(true);

  const state = maxwellConstruction(T);
  const probeV = probeVolume;
  const probeP = reducedPressure(probeV, T);
  const criticalIsotherm = branch(0.345, V_MAX, 1, 220);

  let phase = "устойчиво";
  if (state) {
    if (probeV > state.vLiquid && probeV < state.vVapour) {
      phase =
        probeV < state.vSpinLiquid || probeV > state.vSpinVapour ? "метастабилно" : "неустойчиво";
    }
  }
  const phaseColor =
    phase === "устойчиво" ? "text-minus" : phase === "метастабилно" ? "text-warn" : "text-plus";

  const dome = binodal();
  const domePoints = [
    ...dome.liquid.map(([v, p]) => `${q(X(v))},${q(Y(p))}`),
    `${q(X(1))},${q(Y(1))}`,
    ...[...dome.vapour].reverse().map(([v, p]) => `${q(X(v))},${q(Y(p))}`),
  ].join(" ");
  const spinodalPoints = Array.from({ length: 201 }, (_, k) => {
    const v = 0.5 + (V_MAX - 0.5) * (k / 200);
    return `${q(X(v))},${q(Y(spinodalPressure(v)))}`;
  }).join(" ");

  const CO2_TC = 304.1;
  const CO2_PC = 73.8;

  return (
    <div className={PANEL_CLASS}>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className={STAGE_CLASS}
          style={{ fontFamily: DRAWING_FONT_FAMILY, minWidth: 560 }}
          role="img"
          aria-label="Изотерма на Ван дер Ваалс в приведени единици с хоризонталата на Максуел, равните площи, бинодалата и спинодалата"
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
            <clipPath id="vdw-lab-clip">
              <rect x={LEFT} y={TOP} width={RIGHT - LEFT} height={BOTTOM - TOP} />
            </clipPath>
          </defs>

          {/* Оси и нулата на налягането */}
          <g stroke={C.wire} strokeWidth={1.6} fill={C.wire}>
            <line x1={LEFT} y1={BOTTOM} x2={RIGHT} y2={BOTTOM} />
            <line x1={LEFT} y1={BOTTOM} x2={LEFT} y2={TOP} />
            <polygon points={`${RIGHT + 10},${BOTTOM} ${RIGHT},${BOTTOM - 5} ${RIGHT},${BOTTOM + 5}`} stroke="none" />
            <polygon points={`${LEFT},${TOP - 10} ${LEFT - 5},${TOP} ${LEFT + 5},${TOP}`} stroke="none" />
          </g>
          <line x1={LEFT} y1={Y(0)} x2={RIGHT} y2={Y(0)} stroke={C.mut} strokeWidth={1.2} />

          <g clipPath="url(#vdw-lab-clip)">
            {showDomes ? (
              <>
                <polyline points={domePoints} fill="none" stroke={C.mut} strokeWidth={1.6} />
                <polyline points={spinodalPoints} fill="none" stroke={C.mut} strokeWidth={1.6} strokeDasharray="5 4" />
              </>
            ) : null}
            <polyline points={criticalIsotherm} fill="none" stroke={C.faint} strokeWidth={1.3} strokeDasharray="2 5" />

            {state ? (
              <>
                {showAreas ? (
                  <>
                    <polygon
                      points={`${branch(state.vLiquid, state.vMiddle, T, 90)} ${q(X(state.vMiddle))},${q(Y(state.ps))} ${q(X(state.vLiquid))},${q(Y(state.ps))}`}
                      fill={C.plus}
                      fillOpacity={0.2}
                    />
                    <polygon
                      points={`${branch(state.vMiddle, state.vVapour, T, 140)} ${q(X(state.vVapour))},${q(Y(state.ps))} ${q(X(state.vMiddle))},${q(Y(state.ps))}`}
                      fill={C.warn}
                      fillOpacity={0.24}
                    />
                  </>
                ) : null}
                <polyline points={branch(0.345, state.vLiquid, T)} fill="none" stroke={C.minus} strokeWidth={3} />
                <polyline points={branch(state.vLiquid, state.vSpinLiquid, T, 60)} fill="none" stroke={C.warn} strokeWidth={3} strokeDasharray="7 5" />
                <polyline points={branch(state.vSpinLiquid, state.vSpinVapour, T, 150)} fill="none" stroke={C.plus} strokeWidth={3} strokeDasharray="2 5" strokeLinecap="round" />
                <polyline points={branch(state.vSpinVapour, state.vVapour, T, 90)} fill="none" stroke={C.warn} strokeWidth={3} strokeDasharray="7 5" />
                <polyline points={branch(state.vVapour, V_MAX, T)} fill="none" stroke={C.minus} strokeWidth={3} />
                <line x1={X(state.vLiquid)} y1={Y(state.ps)} x2={X(state.vVapour)} y2={Y(state.ps)} stroke={C.wire} strokeWidth={2.4} />
                <g fill={C.wire}>
                  <circle cx={X(state.vLiquid)} cy={Y(state.ps)} r={4.5} />
                  <circle cx={X(state.vVapour)} cy={Y(state.ps)} r={4.5} />
                </g>
              </>
            ) : (
              <polyline points={branch(0.345, V_MAX, T, 240)} fill="none" stroke={C.minus} strokeWidth={3} />
            )}

            <circle cx={X(1)} cy={Y(1)} r={4} fill={C.mut} />
            {probeP > P_MIN && probeP < P_MAX ? (
              <circle cx={X(probeV)} cy={Y(probeP)} r={6} fill={STAGE_BG} stroke={C.ok} strokeWidth={2.6} />
            ) : null}
          </g>

          {[1, 2, 3, 4].map((v) => (
            <SvgTex key={v} x={X(v)} y={BOTTOM + 22} tex={String(v)} color={C.mut} fontSize={12} width={28} anchor="middle" />
          ))}
          {[0, 1, 2].map((p) => (
            <SvgTex key={p} x={LEFT - 10} y={Y(p)} tex={String(p)} color={C.mut} fontSize={12} width={14} anchor="end" />
          ))}
          <SvgTex x={RIGHT} y={BOTTOM + 52} tex="\nu/\nu_c" color={C.mut} fontSize={13} width={48} anchor="end" />
          <SvgTex x={LEFT + 14} y={TOP + 12} tex="p/p_c" color={C.mut} fontSize={13} width={46} />
          <SvgTex x={X(1) + 12} y={Y(1) - 16} tex="K" color={C.mut} fontSize={13} width={18} />
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[12.5px] text-muted">
        {[
          { color: C.minus, text: "устойчиви състояния" },
          { color: C.warn, text: "метастабилни: прегрята течност и преохладена пара" },
          { color: C.plus, text: "неустойчиви" },
          { color: C.wire, text: "линия на Максуел" },
          { color: C.mut, text: "бинодала и спинодала" },
        ].map((item) => (
          <span key={item.text} className="flex items-center gap-1.5">
            <span aria-hidden="true" className="inline-block h-[3px] w-4 rounded-full" style={{ background: item.color }} />
            {item.text}
          </span>
        ))}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule sm:grid-cols-3">
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Налягане на насищане</dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-ink">
            {state ? <RichText text={`$p_s/p_c=${state.ps.toFixed(3).replace(".", "{,}")}$`} /> : "няма"}
          </dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Течност</dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-minus">
            {state ? <RichText text={`$\\nu_l/\\nu_c=${state.vLiquid.toFixed(3).replace(".", "{,}")}$`} /> : "няма"}
          </dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Пара</dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-minus">
            {state ? <RichText text={`$\\nu_v/\\nu_c=${state.vVapour.toFixed(2).replace(".", "{,}")}$`} /> : "няма"}
          </dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Пробна точка</dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-ok">
            <RichText text={`$p/p_c=${probeP.toFixed(3).replace(".", "{,}")}$`} />
          </dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Състояние там</dt>
          <dd className={`mt-0.5 text-[15px] font-bold ${phaseColor}`}>{phase}</dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Същото за въглероден диоксид</dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-ink">
            {state ? (
              <RichText
                text={`$${(T * CO2_TC - 273.15).toFixed(0)}\\,^\\circ\\mathrm{C}$, $${(state.ps * CO2_PC).toFixed(1).replace(".", "{,}")}\\,\\mathrm{bar}$`}
              />
            ) : (
              <RichText text={`$${(T * CO2_TC - 273.15).toFixed(0)}\\,^\\circ\\mathrm{C}$: свръхкритичен`} />
            )}
          </dd>
        </div>
      </dl>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-[13px] font-medium text-muted">
          <span className="flex justify-between">
            <span>
              Температура <RichText text="$T/T_c$" />
            </span>
            <strong className="text-minus">
              <RichText text={`$${T.toFixed(3).replace(".", "{,}")}$`} />
            </strong>
          </span>
          <input
            className="w-full accent-(--color-minus)"
            type="range"
            min="0.8"
            max="1.1"
            step="0.005"
            value={T}
            onChange={(e) => setT(+e.target.value)}
          />
        </label>
        <label className="text-[13px] font-medium text-muted">
          <span className="flex justify-between">
            <span>
              Пробна точка <RichText text="$\nu/\nu_c$" />
            </span>
            <strong className="text-ok">
              <RichText text={`$${probeV.toFixed(2).replace(".", "{,}")}$`} />
            </strong>
          </span>
          <input
            className="w-full accent-(--color-ok)"
            type="range"
            min={PROBE_MIN}
            max={PROBE_MAX}
            step="0.01"
            value={probeVolume}
            onChange={(e) => setProbeVolume(+e.target.value)}
          />
        </label>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        <label className="flex cursor-pointer items-center gap-2 text-[13.5px] font-medium text-ink">
          <input type="checkbox" className="accent-(--color-plus)" checked={showAreas} onChange={(e) => setShowAreas(e.target.checked)} />
          Оцвети двете площи
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-[13.5px] font-medium text-ink">
          <input type="checkbox" className="accent-(--color-minus)" checked={showDomes} onChange={(e) => setShowDomes(e.target.checked)} />
          Покажи границите на областите
        </label>
      </div>

      {state ? (
        <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
          Двете площи се изравняват числено:{" "}
          <RichText text={`$${state.areaBelow.toFixed(4).replace(".", "{,}")}$`} /> и{" "}
          <RichText text={`$${state.areaAbove.toFixed(4).replace(".", "{,}")}$`} /> в приведени
          единици. Това е условието, че потенциалът на Гибс на течността и на парата е един и същ.
        </p>
      ) : (
        <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
          Над критичната температура изотермата е монотонна: няма примка, няма хоризонтала и няма
          граница между течност и пара.
        </p>
      )}
    </div>
  );
}
