"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import { AngleArc, Arrow, BTN_PRI, BTN_SEC, C, PANEL_CLASS, STAGE_CLASS } from "./svg";
import {
  CapSymbol,
  InductorSymbol,
  Legend,
  PlotFrame,
  RangeControl,
  Readouts,
  ResistorSymbol,
  SourceSymbol,
  Stage,
  StageScroll,
  Toggle,
  dec,
  scaler,
  useClock,
} from "./acPlot";

/**
 * §11 и §12: пълната лаборатория за последователна RLC верига и кривата на
 * резонанса. Двата интерактива смятат по едни и същи формули, изведени в
 * урока, така че числата им никога не се разминават.
 *
 * Уговорка за знаците (важи в целия урок):
 *   v(t) = V0 sin(ωt),  i(t) = I0 sin(ωt − φ),  φ = arctan((X_L − X_C)/R).
 */

/** Единственото място, където се смятат величините на веригата. */
function rlcState(v0: number, freq: number, res: number, ind: number, capUF: number) {
  const omega = 2 * Math.PI * freq;
  const xl = omega * ind;
  const xc = 1 / (omega * capUF * 1e-6);
  const z = Math.hypot(res, xl - xc);
  const i0 = v0 / z;
  const phi = Math.atan2(xl - xc, res);
  const f0 = 1 / (2 * Math.PI * Math.sqrt(ind * capUF * 1e-6));
  return { omega, xl, xc, z, i0, phi, f0, vr: i0 * res, vl: i0 * xl, vc: i0 * xc };
}

const TW = 700;
const TH = 320;
const PW = 460;
const PH = 420;

/* ============================================ §11 пълна RLC лаборатория */

export function RLCLaboratory() {
  const [v0, setV0] = useState(12);
  const [freq, setFreq] = useState(50);
  const [res, setRes] = useState(40);
  const [ind, setInd] = useState(0.12);
  const [cap, setCap] = useState(60);
  const [playing, setPlaying] = useState(false);
  const [showParts, setShowParts] = useState(true);
  const { turns, setTurns } = useClock(playing, 0.22, 0.1);

  const st = rlcState(v0, freq, res, ind, cap);
  const { omega, xl, xc, z, i0, phi, f0, vr, vl, vc } = st;
  const cycle = ((turns % 2) + 2) % 2;

  const character =
    Math.abs(xl - xc) < 0.02 * res ? "resonant" : xl > xc ? "inductive" : "capacitive";

  /* --- панел 1: времеви графики --- */
  const s = scaler({ x: 86, y: 74, w: 520, h: 190 }, 2, 1.2);
  const vFn = (x: number) => Math.sin(2 * Math.PI * x);
  const iFn = (x: number) => Math.sin(2 * Math.PI * x - phi);
  /**
   * Нулите се сравняват около средата на прозореца: при $\phi<0$ нулата на
   * тока пада преди $t=0$ и маркерът иначе би обхванал цял период.
   */
  const zeroV = 1;
  const zeroI = 1 + phi / (2 * Math.PI);

  /* --- панел 2: фазори --- */
  const cx = PW / 2;
  const cy = PH / 2;
  const span = Math.max(vr, vl, vc, v0, 1);
  const k = 138 / span;
  const rot = (x: number, y: number): [number, number] => [
    cx + k * x,
    cy - k * y,
  ];
  const [rx, ry] = rot(vr, 0);
  const [lx, ly] = rot(0, vl);
  const [cxx, cyy] = rot(0, -vc);
  const [sx, sy] = rot(vr, vl - vc);

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-2">
        <button type="button" className={BTN_PRI} onClick={() => setPlaying((p) => !p)}>
          {playing ? "Пауза" : "Пуснете времето ▶"}
        </button>
        <button
          type="button"
          className={BTN_SEC}
          onClick={() => {
            setTurns(0.1);
            setPlaying(false);
          }}
        >
          Нулиране
        </button>
        <button type="button" className={BTN_SEC} onClick={() => setFreq(Math.round(f0))}>
          Настройте на резонанс
        </button>
        <Toggle on={showParts} onChange={setShowParts}>
          Отделните напрежения
        </Toggle>
      </div>

      <div className="grid gap-4">
        {/* ---------------- панел 1 ---------------- */}
        <StageScroll minWidth={TW}>
          <svg
            viewBox={`0 0 ${TW} ${TH}`}
            className={`${STAGE_CLASS} select-none`}
            role="img"
            aria-label="Напрежение на източника и ток във веригата във времето, с означено изместване между нулите"
          >
            <Stage w={TW} h={TH} title="ВРЕМЕВИ ГРАФИКИ · ИЗМЕСТВАНЕТО МЕЖДУ НУЛИТЕ Е ФАЗАТА" />
            <PlotFrame s={s} xLabel="t/T" periods={2} />

            <path d={s.path(vFn, 300)} fill="none" stroke={C.wire} strokeWidth={3} />
            <path d={s.path(iFn, 300)} fill="none" stroke={C.ok} strokeWidth={3} />

            {Math.abs(phi) > 0.06 && (
              <g>
                <line
                  x1={s.sx(zeroV)}
                  y1={s.y0}
                  x2={s.sx(zeroV)}
                  y2={s.y0 + 52}
                  stroke={C.wire}
                  strokeDasharray="4 4"
                />
                <line
                  x1={s.sx(zeroI)}
                  y1={s.y0}
                  x2={s.sx(zeroI)}
                  y2={s.y0 + 52}
                  stroke={C.ok}
                  strokeDasharray="4 4"
                />
                <line
                  x1={s.sx(zeroV)}
                  y1={s.y0 + 46}
                  x2={s.sx(zeroI)}
                  y2={s.y0 + 46}
                  stroke={C.plus}
                  strokeWidth={2.6}
                />
                <SvgTex
                  x={s.sx((zeroV + zeroI) / 2)}
                  y={s.y0 + 68}
                  tex="\Delta t=\phi/\omega"
                  color={C.plus}
                  fontSize={12.5}
                  width={78}
                  anchor="middle"
                />
              </g>
            )}

            <circle cx={s.sx(cycle)} cy={s.sy(vFn(cycle))} r={5.5} fill={C.wire} />
            <circle cx={s.sx(cycle)} cy={s.sy(iFn(cycle))} r={5.5} fill={C.ok} />

            {/* веригата под графиката */}
            <g stroke={C.wire} strokeWidth={2.6} fill="none">
              <line x1={110} y1={292} x2={190} y2={292} />
              <line x1={264} y1={292} x2={300} y2={292} />
              <line x1={362} y1={292} x2={400} y2={292} />
              <line x1={412} y1={292} x2={470} y2={292} />
            </g>
            <SourceSymbol x={110} y={292} r={15} color={C.warn} />
            <ResistorSymbol x={190} y={292} w={74} h={11} color={C.plus} />
            <InductorSymbol x={300} y={292} w={62} color={C.warn} />
            <CapSymbol x={406} y={292} gap={9} plate={20} color={C.minus} />
            <SvgTex x={227} y={272} tex="R" color={C.plus} fontSize={12.5} width={18} anchor="middle" />
            <SvgTex x={331} y={272} tex="L" color={C.warn} fontSize={12.5} width={18} anchor="middle" />
            <SvgTex x={406} y={272} tex="C" color={C.minus} fontSize={12.5} width={18} anchor="middle" />
          </svg>
        </StageScroll>

        {/* ---------------- панел 2 ---------------- */}
        <StageScroll minWidth={320} maxWidth={520}>
          <svg
            viewBox={`0 0 ${PW} ${PH}`}
            className={`${STAGE_CLASS} select-none`}
            role="img"
            aria-label="Фазорна диаграма на същата верига с ток по хоризонталата"
          >
            <Stage w={PW} h={PH} title="ФАЗОРИ · СЪЩИТЕ ЧИСЛА" />
            <line x1={cx - 150} y1={cy} x2={cx + 158} y2={cy} stroke={C.mut} strokeWidth={1.3} />
            <line x1={cx} y1={cy - 150} x2={cx} y2={cy + 150} stroke={C.mut} strokeWidth={1.3} />

            <Arrow x1={cx} y1={cy + 18} x2={cx + 74} y2={cy + 18} color={C.ok} width={3.2} />
            <SvgTex x={cx + 84} y={cy + 24} tex="\vec I" color={C.ok} fontSize={13.5} width={22} />

            {showParts && (
              <>
                <Arrow x1={cx} y1={cy} x2={rx} y2={ry} color={C.plus} width={2.8} />
                <Arrow x1={cx} y1={cy} x2={lx} y2={ly} color={C.warn} width={2.8} />
                <Arrow x1={cx} y1={cy} x2={cxx} y2={cyy} color={C.minus} width={2.8} />
                <g opacity={Math.abs(phi) < 0.16 ? 0.22 : 1}>
                  <SvgTex
                    x={rx + 4}
                    y={cy - 20}
                    tex="\vec V_R"
                    color={C.plus}
                    fontSize={13}
                    width={30}
                    anchor="middle"
                  />
                </g>
                <g opacity={k * vl < 26 ? 0.22 : 1}>
                  <SvgTex x={cx - 26} y={ly + 12} tex="\vec V_L" color={C.warn} fontSize={13} width={30} anchor="end" />
                </g>
                <g opacity={k * vc < 26 ? 0.22 : 1}>
                  <SvgTex x={cx - 26} y={cyy - 12} tex="\vec V_C" color={C.minus} fontSize={13} width={30} anchor="end" />
                </g>
                <line x1={rx} y1={ry} x2={sx} y2={sy} stroke={C.faint} strokeWidth={1.6} strokeDasharray="5 4" />
              </>
            )}

            <Arrow x1={cx} y1={cy} x2={sx} y2={sy} color={C.wire} width={3.4} />
            <SvgTex
              x={cx + (k * Math.hypot(vr, vl - vc) + 24) * Math.cos(phi)}
              y={cy - (k * Math.hypot(vr, vl - vc) + 24) * Math.sin(phi)}
              tex="\vec V"
              color={C.wire}
              fontSize={14}
              width={24}
              anchor="middle"
            />
            {Math.abs(phi) > 0.16 && (
              <AngleArc cx={cx} cy={cy} a1={0} a2={-phi} r={52} color={C.mut} texLabel="\phi" />
            )}
          </svg>
        </StageScroll>
      </div>

      <Legend
        items={[
          { color: C.wire, tex: "$v(t)=V_0\\sin\\omega t$" },
          { color: C.ok, tex: "$i(t)=I_0\\sin(\\omega t-\\phi)$; стрелката $\\vec I$ е изнесена настрани, за да не се слива с $\\vec V_R$" },
          { color: C.plus, tex: "$\\vec V_R$" },
          { color: C.warn, tex: "$\\vec V_L$" },
          { color: C.minus, tex: "$\\vec V_C$" },
        ]}
      />

      <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
        <RangeControl
          label={<RichText text="Амплитуда на източника $V_0$" />}
          value={v0}
          min={2}
          max={30}
          step={1}
          valueTex={`${v0}\\,\\mathrm{V}`}
          onChange={setV0}
        />
        <RangeControl
          label={<RichText text="Честота $f$" />}
          value={freq}
          min={5}
          max={200}
          step={1}
          valueTex={`${freq}\\,\\mathrm{Hz}`}
          onChange={setFreq}
        />
        <RangeControl
          label={<RichText text="Съпротивление $R$" />}
          value={res}
          min={5}
          max={200}
          step={5}
          valueTex={`${res}\\,\\Omega`}
          onChange={setRes}
        />
        <RangeControl
          label={<RichText text="Индуктивност $L$" />}
          value={ind}
          min={0.02}
          max={0.5}
          step={0.01}
          valueTex={`${dec(ind * 1000, 0)}\\,\\mathrm{mH}`}
          onChange={setInd}
        />
        <RangeControl
          label={<RichText text="Капацитет $C$" />}
          value={cap}
          min={10}
          max={200}
          step={5}
          valueTex={`${cap}\\,\\mu\\mathrm{F}`}
          onChange={setCap}
        />
      </div>

      <Readouts
        cols={4}
        cells={[
          { label: "Ъглова честота", tex: `\\omega=${dec(omega, 0)}\\,\\mathrm{rad/s}`, color: "var(--color-muted)" },
          { label: "Индуктивно", tex: `X_L=${dec(xl, 1)}\\,\\Omega`, color: "var(--color-warn)" },
          { label: "Капацитивно", tex: `X_C=${dec(xc, 1)}\\,\\Omega`, color: "var(--color-minus)" },
          { label: "Импеданс", tex: `Z=${dec(z, 1)}\\,\\Omega`, color: "var(--color-ink)" },
          { label: "Ток", tex: `I_0=${dec(i0, 3)}\\,\\mathrm{A}`, color: "var(--color-ok)" },
          { label: "Фазов ъгъл", tex: `\\phi=${dec((phi * 180) / Math.PI, 1)}^\\circ`, color: "var(--color-plus)" },
          { label: "Върху R", tex: `V_R=${dec(vr, 1)}\\,\\mathrm{V}`, color: "var(--color-plus)" },
          { label: "Резонансна честота", tex: `f_0=${dec(f0, 1)}\\,\\mathrm{Hz}`, color: "var(--color-ok)" },
        ]}
      />

      {/* панел 4: характер на веригата + положение спрямо резонанса */}
      <div className="mt-4 overflow-hidden rounded-[10px] border-[1.5px] border-ink">
        <div className="grid grid-cols-3 divide-x-[1.5px] divide-rule border-b-[1.5px] border-rule">
          {(
            [
              ["Капацитивна", "capacitive", "$X_C>X_L,\\ \\phi<0$"],
              ["Резонанс", "resonant", "$X_L=X_C,\\ \\phi=0$"],
              ["Индуктивна", "inductive", "$X_L>X_C,\\ \\phi>0$"],
            ] as const
          ).map(([label, key, tex]) => (
            <div
              key={key}
              className={
                character === key
                  ? "bg-ink px-3 py-2.5 text-center text-white"
                  : "bg-surface px-3 py-2.5 text-center text-muted"
              }
            >
              <p className="text-[13px] font-bold">{label}</p>
              <p className="mt-0.5 text-[12px] opacity-90">
                <RichText text={tex} />
              </p>
            </div>
          ))}
        </div>
        <div className="bg-surface px-4 py-3">
          <div className="relative h-2 rounded-full bg-rule">
            <span
              className="absolute top-1/2 h-4 w-[3px] -translate-y-1/2 bg-ok"
              style={{ left: `${Math.min(98, Math.max(1, (f0 / 200) * 100))}%` }}
            />
            <span
              className="absolute top-1/2 h-5 w-[3px] -translate-y-1/2 rounded bg-plus"
              style={{ left: `${Math.min(99, Math.max(0.5, (freq / 200) * 100))}%` }}
            />
          </div>
          <p className="mt-2 text-[12.5px] text-muted">
            <RichText
              text={`Зелената резка е $f_0=${dec(f0, 1)}\\,\\mathrm{Hz}$, оранжевата - текущата честота $f=${freq}\\,\\mathrm{Hz}$. Скалата е $0$ до $200\\,\\mathrm{Hz}$.`}
            />
          </p>
        </div>
      </div>
    </div>
  );
}

/* =================================================== §12 крива на резонанса */

export function ResonanceExplorer() {
  const [v0, setV0] = useState(12);
  const [res, setRes] = useState(40);
  const [ind, setInd] = useState(0.12);
  const [cap, setCap] = useState(60);
  const [cursor, setCursor] = useState(50);
  const [showBand, setShowBand] = useState(false);

  const F_MAX = 200;
  const f0 = 1 / (2 * Math.PI * Math.sqrt(ind * cap * 1e-6));
  const amp = (f: number) => {
    const w = 2 * Math.PI * f;
    return v0 / Math.hypot(res, w * ind - 1 / (w * cap * 1e-6));
  };
  const peak = v0 / res;
  const I_MAX = 30 / 5; // фиксиран таван: най-големият връх при V0=30 V и R=5 Ω
  const s = scaler({ x: 84, y: 58, w: 596, h: 240 }, F_MAX, Math.min(I_MAX, Math.max(0.25, peak * 1.25)), 0);

  const qFactor = (2 * Math.PI * f0 * ind) / res;
  const bandwidth = res / (2 * Math.PI * ind); // Δf = R/(2πL)

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-1.5">
        <Toggle on={showBand} onChange={setShowBand}>
          Ширина на върха
        </Toggle>
      </div>

      <StageScroll minWidth={760}>
        <svg
          viewBox={`0 0 ${760} 360`}
          className={`${STAGE_CLASS} select-none`}
          role="img"
          aria-label="Амплитудата на тока като функция от честотата с връх при резонансната честота"
        >
          <Stage w={760} h={360} title="РЕЗОНАНСНА КРИВА · ВРЪХЪТ Е ТАМ, КЪДЕТО ДВАТА РЕАКТАНСА СЕ ИЗРАВНЯВАТ" />
          <PlotFrame s={s} xLabel="f" yLabel="I_0\ (\mathrm{A})" yLabelColor={C.ok} quarterTicks={false} />

          {showBand && f0 < F_MAX && (
            <rect
              x={s.sx(Math.max(0, f0 - bandwidth / 2))}
              y={s.box.y}
              width={Math.max(2, s.sx(Math.min(F_MAX, f0 + bandwidth / 2)) - s.sx(Math.max(0, f0 - bandwidth / 2)))}
              height={s.box.h}
              fill={C.ok}
              fillOpacity={0.12}
            />
          )}

          <path d={s.path(amp, 320, 1, F_MAX)} fill="none" stroke={C.ok} strokeWidth={3.2} />

          {f0 < F_MAX && (
            <>
              <line x1={s.sx(f0)} y1={s.sy(Math.min(peak, s.yMax))} x2={s.sx(f0)} y2={s.y0} stroke={C.faint} strokeDasharray="5 5" />
              <circle cx={s.sx(f0)} cy={s.sy(Math.min(peak, s.yMax))} r={6} fill={C.warn} />
              <SvgTex
                x={s.sx(f0)}
                y={s.y0 + 24}
                tex="f_0"
                color={C.warn}
                fontSize={13}
                width={24}
                anchor="middle"
              />
            </>
          )}

          <line x1={s.sx(cursor)} y1={s.box.y} x2={s.sx(cursor)} y2={s.y0} stroke={C.plus} strokeWidth={1.8} />
          <circle cx={s.sx(cursor)} cy={s.sy(Math.min(amp(cursor), s.yMax))} r={5.5} fill={C.plus} />
        </svg>
      </StageScroll>

      <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
        <RangeControl
          label={<RichText text="Съпротивление $R$" />}
          value={res}
          min={5}
          max={200}
          step={5}
          valueTex={`${res}\\,\\Omega`}
          onChange={setRes}
        />
        <RangeControl
          label={<RichText text="Индуктивност $L$" />}
          value={ind}
          min={0.02}
          max={0.5}
          step={0.01}
          valueTex={`${dec(ind * 1000, 0)}\\,\\mathrm{mH}`}
          onChange={setInd}
        />
        <RangeControl
          label={<RichText text="Капацитет $C$" />}
          value={cap}
          min={10}
          max={200}
          step={5}
          valueTex={`${cap}\\,\\mu\\mathrm{F}`}
          onChange={setCap}
        />
        <RangeControl
          label={<RichText text="Амплитуда $V_0$" />}
          value={v0}
          min={2}
          max={30}
          step={1}
          valueTex={`${v0}\\,\\mathrm{V}`}
          onChange={setV0}
        />
        <RangeControl
          label={<RichText text="Курсор по честотата $f$" />}
          value={cursor}
          min={2}
          max={F_MAX}
          step={1}
          valueTex={`${cursor}\\,\\mathrm{Hz}`}
          onChange={setCursor}
        />
      </div>

      <Readouts
        cols={5}
        cells={[
          { label: "Резонансна честота", tex: `f_0=${dec(f0, 1)}\\,\\mathrm{Hz}`, color: "var(--color-warn)" },
          { label: "Връх на кривата", tex: `V_0/R=${dec(peak, 3)}\\,\\mathrm{A}`, color: "var(--color-ok)" },
          { label: "При курсора", tex: `I_0=${dec(amp(cursor), 3)}\\,\\mathrm{A}`, color: "var(--color-plus)" },
          { label: "Ширина", tex: `\\Delta f=${dec(bandwidth, 1)}\\,\\mathrm{Hz}`, color: "var(--color-muted)" },
          { label: "Качествен фактор", tex: `Q=${dec(qFactor, 2)}`, color: "var(--color-ink)" },
        ]}
      />
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Задръжте $L$ и $C$ и менете само $R$: върхът остава на същото място по хоризонтала, но става по-нисък и по-широк. Резонансната честота се определя от $L$ и $C$; $R$ решава колко остър е откликът." />
      </p>
    </div>
  );
}
