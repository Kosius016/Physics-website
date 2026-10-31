"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import {
  GASES,
  criticalPoint,
  inversionCurve,
  jouleThomson,
  maxwellConstruction,
} from "@/lib/realGas";
import SvgTex from "./SvgTex";
import { C, DRAWING_FONT_FAMILY, PANEL_CLASS, STAGE_BG, STAGE_CLASS } from "./svg";

const W = 720;
const H = 440;
const LEFT = 76;
const RIGHT = 692;
const TOP = 28;
const BOTTOM = 368;
const q = (v: number) => Math.round(v * 100) / 100;

/** Стъпка за решетката, която дава кръгли числа. */
function niceStep(range: number, parts: number): number {
  const raw = range / parts;
  const p = 10 ** Math.floor(Math.log10(raw));
  const r = raw / p;
  return (r < 1.5 ? 1 : r < 3 ? 2 : r < 7 ? 5 : 10) * p;
}

const GAS_KEYS = ["N2", "O2", "CO2", "H2", "He"] as const;

/**
 * Кривата на инверсия на Джаул-Томсън за избран газ.
 *
 * Вътре в кривата коефициентът е положителен и дроселирането охлажда газа;
 * извън нея газът се затопля. Двата плъзгача мятат пробната точка по
 * диаграмата, а readout лентата показва коефициента по модела на Ван дер
 * Ваалс. Стайната температура е отбелязана, за да се вижда веднага кои
 * газове могат да се втечняват направо и кои трябва да се охладят първо.
 */
export default function JouleThomsonLab() {
  const [gasKey, setGasKey] = useState<string>("N2");
  const [tFrac, setTFrac] = useState(0.35);
  const [pFrac, setPFrac] = useState(0.3);

  const gas = GASES[gasKey];
  const crit = criticalPoint(gas);
  const pcBar = crit.p / 1e5;
  const tMax = Math.max(7.3 * crit.T, gas.measuredInversion ? gas.measuredInversion * 1.12 : 0);
  const pMaxBar = 10 * pcBar;

  const X = (t: number) => LEFT + (t / tMax) * (RIGHT - LEFT);
  const Y = (p: number) => TOP + ((pMaxBar - p) / pMaxBar) * (BOTTOM - TOP);

  const temperature = Math.max(0.02 * tMax, tFrac * tMax);
  const pressure = Math.max(0.004 * pMaxBar, pFrac * pMaxBar);
  const mu = jouleThomson(gas, temperature, pressure * 1e5);
  const muPerBar = mu === null ? null : mu * 1e5;

  const inversion = inversionCurve();
  const inversionPoints = inversion.map(([tr, pr]) => `${q(X(tr * crit.T))},${q(Y(pr * pcBar))}`).join(" ");

  const saturation: string[] = [];
  for (let tr = 0.75; tr < 0.9995; tr += 0.005) {
    const state = maxwellConstruction(tr);
    if (state) saturation.push(`${q(X(tr * crit.T))},${q(Y(state.ps * pcBar))}`);
  }
  saturation.push(`${q(X(crit.T))},${q(Y(pcBar))}`);

  const stepT = niceStep(tMax, 6);
  const stepP = niceStep(pMaxBar, 5);
  const ticksT = Array.from({ length: Math.floor(tMax / stepT) + 1 }, (_, i) => i * stepT);
  const ticksP = Array.from({ length: Math.floor(pMaxBar / stepP) + 1 }, (_, i) => i * stepP);
  const roomVisible = 293 <= tMax;

  return (
    <div className={PANEL_CLASS}>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className={STAGE_CLASS}
          style={{ fontFamily: DRAWING_FONT_FAMILY, minWidth: 560 }}
          role="img"
          aria-label="Кривата на инверсия на Джаул-Томсън за избрания газ в координати температура и налягане"
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
            <clipPath id="jt-lab-clip">
              <rect x={LEFT} y={TOP} width={RIGHT - LEFT} height={BOTTOM - TOP} />
            </clipPath>
          </defs>

          <g stroke={C.wire} strokeWidth={1.6} fill={C.wire}>
            <line x1={LEFT} y1={BOTTOM} x2={RIGHT} y2={BOTTOM} />
            <line x1={LEFT} y1={BOTTOM} x2={LEFT} y2={TOP} />
            <polygon points={`${RIGHT + 10},${BOTTOM} ${RIGHT},${BOTTOM - 5} ${RIGHT},${BOTTOM + 5}`} stroke="none" />
            <polygon points={`${LEFT},${TOP - 10} ${LEFT - 5},${TOP} ${LEFT + 5},${TOP}`} stroke="none" />
          </g>

          <g clipPath="url(#jt-lab-clip)">
            <polygon points={inversionPoints} fill={C.minus} fillOpacity={0.16} />
            <polyline points={inversionPoints} fill="none" stroke={C.minus} strokeWidth={3} />
            <polyline points={saturation.join(" ")} fill="none" stroke={C.mut} strokeWidth={1.8} />
            <circle cx={X(crit.T)} cy={Y(pcBar)} r={4.5} fill={C.mut} />
            {roomVisible ? (
              <line x1={X(293)} y1={TOP} x2={X(293)} y2={BOTTOM} stroke={C.plus} strokeWidth={1.6} strokeDasharray="6 5" />
            ) : null}
            {gas.measuredInversion ? (
              <polygon
                points={`${q(X(gas.measuredInversion))},${BOTTOM - 2} ${q(X(gas.measuredInversion) - 7)},${BOTTOM - 14} ${q(X(gas.measuredInversion) + 7)},${BOTTOM - 14}`}
                fill={C.wire}
              />
            ) : null}
            <line x1={X(temperature)} y1={TOP} x2={X(temperature)} y2={BOTTOM} stroke={C.faint} strokeDasharray="3 4" />
            <line x1={LEFT} y1={Y(pressure)} x2={RIGHT} y2={Y(pressure)} stroke={C.faint} strokeDasharray="3 4" />
            <circle cx={X(temperature)} cy={Y(pressure)} r={6.5} fill={STAGE_BG} stroke={C.ok} strokeWidth={2.6} />
          </g>

          {ticksT.map((t) => (
            <SvgTex key={t} x={X(t)} y={BOTTOM + 22} tex={String(Math.round(t))} color={C.mut} fontSize={12} width={36} anchor="middle" />
          ))}
          {ticksP.map((p) => (
            <SvgTex key={p} x={LEFT - 10} y={Y(p)} tex={String(Math.round(p))} color={C.mut} fontSize={12} width={30} anchor="end" />
          ))}
          <SvgTex x={RIGHT} y={BOTTOM + 52} tex="T,\ \mathrm{K}" color={C.mut} fontSize={13} width={56} anchor="end" />
          <SvgTex x={LEFT + 14} y={TOP + 12} tex="p,\ \mathrm{bar}" color={C.mut} fontSize={13} width={64} />
          <SvgTex x={X(2.9 * crit.T)} y={Y(3.4 * pcBar)} tex="\mu>0" color={C.minus} fontSize={13} width={52} anchor="middle" />
          <SvgTex
            x={Math.min(X(6.4 * crit.T), RIGHT - 16)}
            y={Y(8.8 * pcBar)}
            tex="\mu<0"
            color={C.plus}
            fontSize={13}
            width={52}
            anchor="end"
          />
          <SvgTex x={X(crit.T) + 12} y={Y(pcBar) - 16} tex="K" color={C.mut} fontSize={13} width={18} />
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[12.5px] text-muted">
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="inline-block h-[3px] w-4 rounded-full" style={{ background: C.minus }} />
          крива на инверсия: вътре газът изстива
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="inline-block h-[3px] w-4 rounded-full" style={{ background: C.mut }} />
          линия на насищане до критичната точка
        </span>
        {roomVisible ? (
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="inline-block h-[3px] w-4 rounded-full" style={{ background: C.plus }} />
            стайна температура
          </span>
        ) : null}
        {gas.measuredInversion ? (
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="inline-block h-0 w-0 border-x-[5px] border-b-[8px] border-x-transparent" style={{ borderBottomColor: C.wire }} />
            измерена горна температура на инверсия
          </span>
        ) : null}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule sm:grid-cols-4">
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Температура</dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-ink">
            <RichText text={`$${temperature.toFixed(0)}\\,\\mathrm{K}$`} />
          </dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Налягане</dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-ink">
            <RichText text={`$${pressure.toFixed(pressure < 10 ? 1 : 0).replace(".", "{,}")}\\,\\mathrm{bar}$`} />
          </dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Коефициент по модела</dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-ok">
            {muPerBar === null ? (
              "няма"
            ) : (
              <RichText
                text={`$\\mu=${(muPerBar < 0 ? "-" : "") + Math.abs(muPerBar).toFixed(Math.abs(muPerBar) < 0.1 ? 3 : 2).replace(".", "{,}")}\\,\\tfrac{\\mathrm{K}}{\\mathrm{bar}}$`}
              />
            )}
          </dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">При дроселиране</dt>
          <dd className={`mt-0.5 text-[15px] font-bold ${muPerBar !== null && muPerBar > 0 ? "text-minus" : "text-plus"}`}>
            {muPerBar === null ? "—" : muPerBar > 0 ? "изстива" : "затопля се"}
          </dd>
        </div>
      </dl>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <label className="text-[13px] font-medium text-muted">
          <span className="block">Газ</span>
          <select
            className="mt-1 w-full cursor-pointer rounded-lg border-[1.5px] border-ink bg-surface px-2.5 py-1.5 text-[13.5px] font-semibold text-ink"
            value={gasKey}
            onChange={(e) => setGasKey(e.target.value)}
          >
            {GAS_KEYS.map((key) => (
              <option key={key} value={key}>
                {GASES[key].name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-[13px] font-medium text-muted">
          <span className="flex justify-between">
            <span>Температура</span>
            <strong className="text-ink">
              <RichText text={`$${temperature.toFixed(0)}\\,\\mathrm{K}$`} />
            </strong>
          </span>
          <input
            className="w-full accent-(--color-minus)"
            type="range"
            min="0.02"
            max="1"
            step="0.002"
            value={tFrac}
            onChange={(e) => setTFrac(+e.target.value)}
          />
        </label>
        <label className="text-[13px] font-medium text-muted">
          <span className="flex justify-between">
            <span>Налягане</span>
            <strong className="text-ink">
              <RichText text={`$${pressure.toFixed(pressure < 10 ? 1 : 0).replace(".", "{,}")}\\,\\mathrm{bar}$`} />
            </strong>
          </span>
          <input
            className="w-full accent-(--color-plus)"
            type="range"
            min="0.004"
            max="1"
            step="0.002"
            value={pFrac}
            onChange={(e) => setPFrac(+e.target.value)}
          />
        </label>
      </div>

      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        Горната температура на инверсия по модела е{" "}
        <RichText text={`$${(6.75 * crit.T).toFixed(0)}\\,\\mathrm{K}$`} />
        {gas.measuredInversion ? (
          <>
            {" "}
            при измерени <RichText text={`$${gas.measuredInversion}\\,\\mathrm{K}$`} />
          </>
        ) : null}
        . Критичната точка по същите константи е{" "}
        <RichText text={`$T_c=${crit.T.toFixed(0)}\\,\\mathrm{K}$`} /> и{" "}
        <RichText text={`$p_c=${pcBar.toFixed(1).replace(".", "{,}")}\\,\\mathrm{bar}$`} />.
      </p>
    </div>
  );
}
