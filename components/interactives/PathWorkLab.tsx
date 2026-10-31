"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import { C, DRAWING_FONT_FAMILY, PANEL_CLASS, STAGE_BG, STAGE_CLASS } from "./svg";

const R = 8.314;
const T0 = 300; // K
const V1 = 0.010; // m^3/mol
const V2 = 0.025; // m^3/mol
const P1 = (R * T0) / V1; // Pa
const P2 = (R * T0) / V2; // Pa
const A_ISOTHERM = R * T0 * Math.log(V2 / V1); // J
const DS = R * Math.log(V2 / V1); // J/(mol·K)

const W = 660;
const H = 390;
const LEFT = 96;
const RIGHT = 600;
const TOP = 40;
const BOTTOM = 320;
const V_MIN = 0.008;
const V_MAX = 0.028;
const P_MAX_BAR = 2.8;

const X = (v: number) => LEFT + ((v - V_MIN) / (V_MAX - V_MIN)) * (RIGHT - LEFT);
const Y = (pBar: number) => BOTTOM - (pBar / P_MAX_BAR) * (BOTTOM - TOP);
const q = (v: number) => Math.round(v * 100) / 100;

function isothermPoints(): string {
  const pts: string[] = [];
  for (let k = 0; k <= 120; k += 1) {
    const v = V_MIN + 0.5e-3 + ((V_MAX - V_MIN - 1e-3) * k) / 120;
    pts.push(`${q(X(v))},${q(Y((R * T0) / v / 1e5))}`);
  }
  return pts.join(" ");
}

/**
 * Работата зависи от пътя, вътрешната енергия и ентропията - не.
 *
 * Един мол идеален газ минава от състояние 1 до състояние 2 на същата
 * изотерма по тристъпков път: изохорно до междинното налягане, изобарно до
 * крайния обем, изохорно до крайното налягане. Плъзгачът мести междинното
 * налягане между двата крайни случая и площта под пътя се вижда как се мени,
 * докато двата readout-а отдясно стоят неподвижни.
 */
export default function PathWorkLab() {
  const [pMidBar, setPMidBar] = useState(1.5);
  const [showIsotherm, setShowIsotherm] = useState(false);

  const pMid = pMidBar * 1e5;
  const work = pMid * (V2 - V1); // J
  const tCorner = (pMid * V2) / R; // K в ъгъла на пътя

  const x1 = X(V1);
  const x2 = X(V2);
  const yTop = Y(P1 / 1e5);
  const yBottom = Y(P2 / 1e5);
  const yMid = Y(pMidBar);
  const gap = Math.min(Math.abs(yMid - yTop), Math.abs(yMid - yBottom));
  const midLabelOpacity = Math.max(0, Math.min(1, (gap - 14) / 12));

  return (
    <div className={PANEL_CLASS}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={STAGE_CLASS}
        style={{ fontFamily: DRAWING_FONT_FAMILY }}
        role="img"
        aria-label="Три стъпки между едни и същи състояния на диаграма налягане - обем; площта под пътя се мени с междинното налягане"
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

        {/* Площта под пътя: работата на газа */}
        <rect
          x={x1}
          y={yMid}
          width={x2 - x1}
          height={BOTTOM - yMid}
          fill={C.ok}
          fillOpacity={0.18}
          style={{ transition: "all 120ms ease-out" }}
        />

        {/* Оси */}
        <g stroke={C.wire} strokeWidth={1.6} fill={C.wire}>
          <line x1={LEFT} y1={BOTTOM} x2={RIGHT} y2={BOTTOM} />
          <line x1={LEFT} y1={BOTTOM} x2={LEFT} y2={TOP} />
          <polygon points={`${RIGHT + 10},${BOTTOM} ${RIGHT},${BOTTOM - 5} ${RIGHT},${BOTTOM + 5}`} stroke="none" />
          <polygon points={`${LEFT},${TOP - 10} ${LEFT - 5},${TOP} ${LEFT + 5},${TOP}`} stroke="none" />
        </g>

        {/* Двата крайни пътя остават като ориентир */}
        <g stroke={C.faint} strokeWidth={2} fill="none" opacity={0.75}>
          <path d={`M${x1},${yTop} H${x2} V${yBottom}`} />
          <path d={`M${x1},${yTop} V${yBottom} H${x2}`} />
        </g>

        {/* Изотермата през двете състояния */}
        <polyline points={isothermPoints()} fill="none" stroke={C.faint} strokeWidth={1.4} strokeDasharray="3 5" />
        {showIsotherm ? (
          <path
            d={`M${x1},${yTop} ${Array.from({ length: 60 }, (_, k) => {
              const v = V1 + ((V2 - V1) * (k + 1)) / 60;
              return `L${q(X(v))},${q(Y((R * T0) / v / 1e5))}`;
            }).join(" ")}`}
            fill="none"
            stroke={C.minus}
            strokeWidth={3}
          />
        ) : null}

        {/* Текущият път */}
        <path
          d={`M${x1},${yTop} V${yMid} H${x2} V${yBottom}`}
          fill="none"
          stroke={C.warn}
          strokeWidth={3.4}
          strokeLinejoin="round"
          style={{ transition: "all 120ms ease-out" }}
        />
        <g fill={C.wire}>
          <circle cx={x1} cy={yTop} r={5.5} />
          <circle cx={x2} cy={yBottom} r={5.5} />
        </g>

        {/* Означения */}
        <SvgTex x={x1 + 12} y={yTop - 14} tex="1" color={C.wire} fontSize={14} width={14} />
        <SvgTex x={x2 + 12} y={yBottom + 14} tex="2" color={C.wire} fontSize={14} width={14} />
        <SvgTex x={LEFT - 10} y={yTop} tex="p_1" color={C.mut} fontSize={13} width={30} anchor="end" />
        <SvgTex x={LEFT - 10} y={yBottom} tex="p_2" color={C.mut} fontSize={13} width={30} anchor="end" />
        {/*
          При крайните стойности етикетът се слива с p₁ или p₂: избледнява и се маха.
          Стойността остава видима при плъзгача, затова нищо не се губи.
        */}
        {midLabelOpacity > 0 ? (
          <g style={{ opacity: midLabelOpacity, transition: "opacity 150ms ease-out" }}>
            <SvgTex x={LEFT - 10} y={yMid} tex="p_{\text{межд}}" color={C.warn} fontSize={13} width={62} anchor="end" />
          </g>
        ) : null}
        <SvgTex x={x1} y={BOTTOM + 22} tex="\nu_1" color={C.mut} fontSize={13} width={26} anchor="middle" />
        <SvgTex x={x2} y={BOTTOM + 22} tex="\nu_2" color={C.mut} fontSize={13} width={26} anchor="middle" />
        <SvgTex x={RIGHT} y={BOTTOM + 52} tex="\nu" color={C.mut} fontSize={13} width={18} anchor="end" />
        <SvgTex x={LEFT + 14} y={TOP + 12} tex="p" color={C.mut} fontSize={13} width={18} />
        <SvgTex
          x={(x1 + x2) / 2}
          y={BOTTOM - 20}
          tex="A=\int p\,d\nu"
          color={C.ok}
          fontSize={14}
          width={100}
          anchor="middle"
        />
        <text x={RIGHT} y={TOP + 4} fill={C.mut} fontSize={12} fontWeight={600} textAnchor="end" letterSpacing="0.08em">
          ЕДНА ИЗОТЕРМА
        </text>
      </svg>

      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule sm:grid-cols-4">
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Работа на газа</dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-ok">
            <RichText text={`$A=${work.toFixed(0)}\\,\\mathrm{J}$`} />
          </dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Приета топлина</dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-plus">
            <RichText text={`$Q=${work.toFixed(0)}\\,\\mathrm{J}$`} />
          </dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Вътрешна енергия</dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-ink">
            <RichText text={String.raw`$\Delta u=0$`} />
          </dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Ентропия</dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-minus">
            <RichText text={`$\\Delta s=${DS.toFixed(2)}\\,\\tfrac{\\mathrm{J}}{\\mathrm{mol\\cdot K}}$`} />
          </dd>
        </div>
      </dl>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-[13px] font-medium text-muted">
          <span className="flex justify-between">
            <span>
              Междинно налягане <RichText text={String.raw`$p_{\text{межд}}$`} />
            </span>
            <strong className="text-warn">
              <RichText text={`$${pMidBar.toFixed(2)}\\,\\mathrm{bar}$`} />
            </strong>
          </span>
          <input
            className="w-full accent-(--color-warn)"
            type="range"
            min={(P2 / 1e5).toFixed(2)}
            max={(P1 / 1e5).toFixed(2)}
            step="0.01"
            value={pMidBar}
            onChange={(e) => setPMidBar(+e.target.value)}
          />
        </label>
        <div className="flex flex-col justify-center gap-2">
          <label className="flex cursor-pointer items-center gap-2 text-[13.5px] font-medium text-ink">
            <input
              type="checkbox"
              className="accent-(--color-minus)"
              checked={showIsotherm}
              onChange={(e) => setShowIsotherm(e.target.checked)}
            />
            Покажи обратимия изотермен път
          </label>
          <p className="text-[12.5px] leading-snug text-muted">
            По него{" "}
            <RichText text={`$A=RT\\ln(\\nu_2/\\nu_1)=${A_ISOTHERM.toFixed(0)}\\,\\mathrm{J}$`} /> - между
            двата крайни случая.
          </p>
        </div>
      </div>

      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        В ъгъла на пътя температурата е{" "}
        <RichText text={`$T=${tCorner.toFixed(0)}\\,\\mathrm{K}$`} />, а в двата края е{" "}
        <RichText text={`$${T0}\\,\\mathrm{K}$`} />. Площта под пътя се мени два и половина пъти, но
        началното и крайното състояние са едни и същи: затова{" "}
        <RichText text={String.raw`$\Delta u$`} /> и{" "}
        <RichText text={String.raw`$\Delta s$`} /> не се менят, а{" "}
        <RichText text="$A$" /> и <RichText text="$Q$" /> се менят заедно.
      </p>
    </div>
  );
}
