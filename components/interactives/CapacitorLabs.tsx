"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import { Arrow, BTN_PRI, BTN_SEC, C, PANEL_CLASS, STAGE_BG, STAGE_CLASS } from "./svg";

const EPSILON_0 = 8.854_187_812_8e-12;

function decimal(value: number, digits = 2) {
  return value.toFixed(digits).replace(".", "{,}");
}

function Readout({
  label,
  tex,
  tone = "text-ink",
}: {
  label: string;
  tex: string;
  tone?: string;
}) {
  return (
    <div className="min-w-0 bg-surface px-3 py-2.5">
      <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">{label}</dt>
      <dd className={`mt-0.5 text-[14px] font-bold tabular-nums ${tone}`}>
        <RichText text={`$${tex}$`} />
      </dd>
    </div>
  );
}

function RangeControl({
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
  valueLabel: React.ReactNode;
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

function CapacitorSymbol({
  x,
  y,
  vertical = false,
  tex,
  color = C.wire,
}: {
  x: number;
  y: number;
  vertical?: boolean;
  tex: string;
  color?: string;
}) {
  return vertical ? (
    <g>
      <line x1={x} y1={y - 42} x2={x} y2={y - 9} stroke={C.wire} strokeWidth={2.5} />
      <line x1={x} y1={y + 9} x2={x} y2={y + 42} stroke={C.wire} strokeWidth={2.5} />
      <line x1={x - 20} y1={y - 9} x2={x + 20} y2={y - 9} stroke={color} strokeWidth={4} />
      <line x1={x - 20} y1={y + 9} x2={x + 20} y2={y + 9} stroke={color} strokeWidth={4} />
      <SvgTex x={x + 28} y={y + 2} tex={tex} color={color} width={54} />
    </g>
  ) : (
    <g>
      <line x1={x - 42} y1={y} x2={x - 9} y2={y} stroke={C.wire} strokeWidth={2.5} />
      <line x1={x + 9} y1={y} x2={x + 42} y2={y} stroke={C.wire} strokeWidth={2.5} />
      <line x1={x - 9} y1={y - 20} x2={x - 9} y2={y + 20} stroke={color} strokeWidth={4} />
      <line x1={x + 9} y1={y - 20} x2={x + 9} y2={y + 20} stroke={color} strokeWidth={4} />
      <SvgTex x={x} y={y - 35} tex={tex} color={color} width={54} anchor="middle" />
    </g>
  );
}

export function CapacitanceLinearity() {
  const [chargeNc, setChargeNc] = useState(60);
  const [capacitanceNf, setCapacitanceNf] = useState(3);
  const voltage = chargeNc / capacitanceNf;

  const graphLeft = 74;
  const graphBottom = 250;
  const graphWidth = 488;
  const graphHeight = 188;
  const maxQ = 100;
  const maxV = 50;
  const x = (q: number) => graphLeft + (q / maxQ) * graphWidth;
  const y = (v: number) => graphBottom - (v / maxV) * graphHeight;
  const lineEndQ = Math.min(maxQ, maxV * capacitanceNf);
  const lineEndV = lineEndQ / capacitanceNf;

  return (
    <div className={PANEL_CLASS}>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[.18em] text-minus">
          Отношение, не количество
        </p>
        <h3 className="mt-1 font-serif text-[22px] font-bold">Наклонът на правата е постоянен</h3>
        <p className="mt-2 text-[14.5px] text-muted">
          Местете заряда. Точката се движи по една и съща права, докато геометрията и средата
          не се променят.
        </p>
      </div>

      <div className="mt-4 overflow-x-auto rounded-[10px]">
        <div className="min-w-[520px]">
          <svg
            viewBox="0 0 620 300"
            className={STAGE_CLASS}
            role="img"
            aria-label="Графика на напрежението като функция на заряда за кондензатор"
          >
            <rect width={620} height={300} fill={STAGE_BG} />
            <line x1={graphLeft} y1={graphBottom} x2={574} y2={graphBottom} stroke={C.mut} strokeWidth={1.5} />
            <line x1={graphLeft} y1={graphBottom} x2={graphLeft} y2={45} stroke={C.mut} strokeWidth={1.5} />
            {[25, 50, 75, 100].map((q) => (
              <g key={q}>
                <line x1={x(q)} y1={graphBottom - 4} x2={x(q)} y2={graphBottom + 4} stroke={C.faint} />
                <SvgTex x={x(q)} y={270} tex={String(q)} color={C.mut} width={34} anchor="middle" fontSize={11.5} />
              </g>
            ))}
            {[10, 20, 30, 40, 50].map((v) => (
              <g key={v}>
                <line x1={graphLeft - 4} y1={y(v)} x2={graphLeft + 4} y2={y(v)} stroke={C.faint} />
                <SvgTex x={58} y={y(v) + 1} tex={String(v)} color={C.mut} width={30} anchor="end" fontSize={11.5} />
              </g>
            ))}
            <SvgTex x={590} y={230} tex={String.raw`Q\,(\mathrm{nC})`} color={C.wire} width={92} anchor="end" />
            <SvgTex x={54} y={42} tex={String.raw`V\,(\mathrm V)`} color={C.wire} width={78} anchor="middle" />
            <line
              x1={x(0)}
              y1={y(0)}
              x2={x(lineEndQ)}
              y2={y(lineEndV)}
              stroke={C.minus}
              strokeWidth={3}
            />
            <line
              x1={x(chargeNc)}
              y1={graphBottom}
              x2={x(chargeNc)}
              y2={y(voltage)}
              stroke={C.faint}
              strokeWidth={1.5}
              strokeDasharray="5 5"
            />
            <line
              x1={graphLeft}
              y1={y(voltage)}
              x2={x(chargeNc)}
              y2={y(voltage)}
              stroke={C.faint}
              strokeWidth={1.5}
              strokeDasharray="5 5"
            />
            <circle cx={x(chargeNc)} cy={y(voltage)} r={7} fill={C.plus} />
            <SvgTex
              x={x(chargeNc) + 14}
              y={y(voltage) - 12}
              tex={String.raw`\left(Q,V\right)`}
              color={C.plus}
              width={76}
            />
            <SvgTex
              x={380}
              y={72}
              tex={String.raw`\text{наклон}=\frac{\Delta V}{\Delta Q}=\frac1C`}
              color={C.ok}
              width={190}
              anchor="middle"
            />
          </svg>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <RangeControl
          label="Заряд"
          value={chargeNc}
          min={5}
          max={100}
          step={5}
          valueLabel={<RichText text={`$Q=${chargeNc}\\,\\mathrm{nC}$`} />}
          onChange={setChargeNc}
        />
        <RangeControl
          label="Капацитет"
          value={capacitanceNf}
          min={2}
          max={5}
          step={0.5}
          valueLabel={<RichText text={`$C=${decimal(capacitanceNf, 1)}\\,\\mathrm{nF}$`} />}
          onChange={setCapacitanceNf}
        />
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule">
        <Readout label="Заряд" tex={`Q=${chargeNc}\\,\\mathrm{nC}`} tone="text-plus" />
        <Readout label="Напрежение" tex={`V=${decimal(voltage, 1)}\\,\\mathrm V`} tone="text-minus" />
        <Readout label="Отношение" tex={`Q/V=${decimal(capacitanceNf, 1)}\\,\\mathrm{nF}`} tone="text-ok" />
      </dl>
    </div>
  );
}

export function ParallelPlateExplorer() {
  const [areaCm2, setAreaCm2] = useState(120);
  const [gapMm, setGapMm] = useState(6);
  const capacitancePf = (EPSILON_0 * (areaCm2 * 1e-4) * 1e12) / (gapMm * 1e-3);
  const plateWidth = 240 + ((areaCm2 - 50) / 200) * 230;
  const gapPx = 70 + ((gapMm - 2) / 10) * 110;
  const x1 = 310 - plateWidth / 2;
  const x2 = 310 + plateWidth / 2;
  const y1 = 160 - gapPx / 2;
  const y2 = 160 + gapPx / 2;
  const fieldXs = Array.from({ length: 8 }, (_, index) => x1 + 28 + (index * (plateWidth - 56)) / 7);

  return (
    <div className={PANEL_CLASS}>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[.18em] text-minus">
          Геометрията задава капацитета
        </p>
        <h3 className="mt-1 font-serif text-[22px] font-bold">Площ срещу разстояние</h3>
      </div>
      <div className="mt-4 overflow-x-auto rounded-[10px]">
        <div className="min-w-[520px]">
          <svg
            viewBox="0 0 620 320"
            className={STAGE_CLASS}
            role="img"
            aria-label="Плосък кондензатор с регулируема площ и разстояние между плочите"
          >
            <rect width={620} height={320} fill={STAGE_BG} />
            <rect x={x1} y={y1 - 7} width={plateWidth} height={14} rx={3} fill={C.wire} />
            <rect x={x1} y={y2 - 7} width={plateWidth} height={14} rx={3} fill={C.wire} />
            {fieldXs.map((fx) => (
              <Arrow key={fx} x1={fx} y1={y1 + 12} x2={fx} y2={y2 - 12} color={C.minus} width={1.8} />
            ))}
            {fieldXs.map((fx) => (
              <g key={`charge-${fx}`}>
                <SvgTex x={fx} y={y1} tex="+" color={C.plus} width={20} anchor="middle" fontSize={11.5} />
                <SvgTex x={fx} y={y2} tex="-" color={C.minus} width={20} anchor="middle" fontSize={11.5} />
              </g>
            ))}
            <line x1={x1 - 28} y1={y1} x2={x1 - 28} y2={y2} stroke={C.mut} strokeWidth={1.5} />
            <line x1={x1 - 36} y1={y1} x2={x1 - 20} y2={y1} stroke={C.mut} strokeWidth={1.5} />
            <line x1={x1 - 36} y1={y2} x2={x1 - 20} y2={y2} stroke={C.mut} strokeWidth={1.5} />
            <SvgTex x={x1 - 43} y={160} tex="d" color={C.mut} width={26} anchor="end" />
            <line x1={x1} y1={y2 + 38} x2={x2} y2={y2 + 38} stroke={C.mut} strokeWidth={1.5} />
            <line x1={x1} y1={y2 + 31} x2={x1} y2={y2 + 45} stroke={C.mut} strokeWidth={1.5} />
            <line x1={x2} y1={y2 + 31} x2={x2} y2={y2 + 45} stroke={C.mut} strokeWidth={1.5} />
            <SvgTex x={310} y={y2 + 58} tex="A" color={C.mut} width={28} anchor="middle" />
          </svg>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <RangeControl
          label="Площ на плочите"
          value={areaCm2}
          min={50}
          max={250}
          step={10}
          valueLabel={<RichText text={`$A=${areaCm2}\\,\\mathrm{cm^2}$`} />}
          onChange={setAreaCm2}
        />
        <RangeControl
          label="Разстояние"
          value={gapMm}
          min={2}
          max={12}
          step={1}
          valueLabel={<RichText text={`$d=${gapMm}\\,\\mathrm{mm}$`} />}
          onChange={setGapMm}
        />
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule">
        <Readout label="Площ" tex={`A=${areaCm2}\\,\\mathrm{cm^2}`} />
        <Readout label="Разстояние" tex={`d=${gapMm}\\,\\mathrm{mm}`} />
        <Readout label="Капацитет" tex={`C=${decimal(capacitancePf, 1)}\\,\\mathrm{pF}`} tone="text-ok" />
      </dl>
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        Удвояването на площта удвоява капацитета. Удвояването на разстоянието го намалява
        наполовина. Краевите ефекти са пренебрегнати, тоест размерите на плочите са много
        по-големи от разстоянието между тях.
      </p>
    </div>
  );
}

export function CapacitorNetworkExplorer() {
  const [connection, setConnection] = useState<"parallel" | "series">("parallel");
  const [c1, setC1] = useState(4);
  const [c2, setC2] = useState(8);
  const supplyV = 12;
  const parallel = connection === "parallel";
  const equivalent = parallel ? c1 + c2 : (c1 * c2) / (c1 + c2);
  const totalCharge = equivalent * supplyV;
  const q1 = parallel ? c1 * supplyV : totalCharge;
  const q2 = parallel ? c2 * supplyV : totalCharge;
  const v1 = q1 / c1;
  const v2 = q2 / c2;

  return (
    <div className={PANEL_CLASS}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.18em] text-minus">
            Възли и изолирани проводници
          </p>
          <h3 className="mt-1 font-serif text-[22px] font-bold">Кое е общото?</h3>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className={parallel ? BTN_PRI : BTN_SEC}
            onClick={() => setConnection("parallel")}
            aria-pressed={parallel}
          >
            Успоредно
          </button>
          <button
            type="button"
            className={!parallel ? BTN_PRI : BTN_SEC}
            onClick={() => setConnection("series")}
            aria-pressed={!parallel}
          >
            Последователно
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-[10px]">
        <div className="min-w-[520px]">
          <svg
            viewBox="0 0 620 310"
            className={STAGE_CLASS}
            role="img"
            aria-label={parallel ? "Два кондензатора, свързани успоредно" : "Два кондензатора, свързани последователно"}
          >
            <rect width={620} height={310} fill={STAGE_BG} />
            {parallel ? (
              <g>
                <line x1={70} y1={75} x2={95} y2={75} stroke={C.wire} strokeWidth={2.5} />
                <line x1={70} y1={235} x2={95} y2={235} stroke={C.wire} strokeWidth={2.5} />
                <line x1={95} y1={75} x2={525} y2={75} stroke={C.wire} strokeWidth={2.5} />
                <line x1={95} y1={235} x2={525} y2={235} stroke={C.wire} strokeWidth={2.5} />
                <line x1={205} y1={75} x2={205} y2={128} stroke={C.wire} strokeWidth={2.5} />
                <line x1={205} y1={182} x2={205} y2={235} stroke={C.wire} strokeWidth={2.5} />
                <line x1={415} y1={75} x2={415} y2={128} stroke={C.wire} strokeWidth={2.5} />
                <line x1={415} y1={182} x2={415} y2={235} stroke={C.wire} strokeWidth={2.5} />
                <CapacitorSymbol x={205} y={155} vertical tex="C_1" color={C.plus} />
                <CapacitorSymbol x={415} y={155} vertical tex="C_2" color={C.minus} />
                <Arrow x1={160} y1={92} x2={160} y2={218} color={C.plus} width={1.8} />
                <SvgTex x={147} y={155} tex="V_1" color={C.plus} width={38} anchor="end" />
                <Arrow x1={370} y1={92} x2={370} y2={218} color={C.minus} width={1.8} />
                <SvgTex x={357} y={155} tex="V_2" color={C.minus} width={38} anchor="end" />
                <SvgTex x={310} y={52} tex={String.raw`V_1=V_2=V`} color={C.ok} width={132} anchor="middle" />
              </g>
            ) : (
              <g>
                <line x1={70} y1={95} x2={205} y2={95} stroke={C.wire} strokeWidth={2.5} />
                <line x1={223} y1={95} x2={397} y2={95} stroke={C.wire} strokeWidth={2.5} />
                <line x1={415} y1={95} x2={550} y2={95} stroke={C.wire} strokeWidth={2.5} />
                <line x1={550} y1={95} x2={550} y2={225} stroke={C.wire} strokeWidth={2.5} />
                <line x1={70} y1={225} x2={550} y2={225} stroke={C.wire} strokeWidth={2.5} />
                <CapacitorSymbol x={214} y={95} tex="C_1" color={C.plus} />
                <CapacitorSymbol x={406} y={95} tex="C_2" color={C.minus} />
                <Arrow x1={172} y1={32} x2={256} y2={32} color={C.plus} width={1.8} />
                <SvgTex x={214} y={16} tex="V_1" color={C.plus} width={38} anchor="middle" />
                <Arrow x1={364} y1={32} x2={448} y2={32} color={C.minus} width={1.8} />
                <SvgTex x={406} y={16} tex="V_2" color={C.minus} width={38} anchor="middle" />
                <SvgTex x={310} y={150} tex={String.raw`Q_1=Q_2`} color={C.ok} width={100} anchor="middle" />
              </g>
            )}
            <g>
              <line
                x1={70}
                y1={parallel ? 75 : 95}
                x2={70}
                y2={137}
                stroke={C.wire}
                strokeWidth={2}
              />
              <line
                x1={70}
                y1={173}
                x2={70}
                y2={parallel ? 235 : 225}
                stroke={C.wire}
                strokeWidth={2}
              />
              <line x1={53} y1={137} x2={87} y2={137} stroke={C.plus} strokeWidth={4} />
              <line x1={59} y1={173} x2={81} y2={173} stroke={C.minus} strokeWidth={4} />
              <SvgTex x={42} y={155} tex="V" color={C.warn} width={28} anchor="end" />
            </g>
          </svg>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <RangeControl
          label="Първи капацитет"
          value={c1}
          min={2}
          max={12}
          step={1}
          valueLabel={<RichText text={`$C_1=${c1}\\,\\mu\\mathrm F$`} />}
          onChange={setC1}
        />
        <RangeControl
          label="Втори капацитет"
          value={c2}
          min={2}
          max={12}
          step={1}
          valueLabel={<RichText text={`$C_2=${c2}\\,\\mu\\mathrm F$`} />}
          onChange={setC2}
        />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule sm:grid-cols-5">
        <Readout label="Еквивалентен" tex={`C_e=${decimal(equivalent, 2)}\\,\\mu\\mathrm F`} tone="text-ok" />
        <Readout label="Заряд 1" tex={`Q_1=${decimal(q1, 1)}\\,\\mu\\mathrm C`} tone="text-plus" />
        <Readout label="Напрежение 1" tex={`V_1=${decimal(v1, 1)}\\,\\mathrm V`} />
        <Readout label="Заряд 2" tex={`Q_2=${decimal(q2, 1)}\\,\\mu\\mathrm C`} tone="text-minus" />
        <Readout label="Напрежение 2" tex={`V_2=${decimal(v2, 1)}\\,\\mathrm V`} />
      </dl>
    </div>
  );
}

const REDUCTION_CAPTIONS = [
  "Токът преминава през 6 μF и 3 μF по един и същ клон без разклонение, затова те са последователни.",
  "Заменяме двойката с еквивалентен кондензатор 2 μF. Той е свързан успоредно на левия кондензатор 4 μF.",
  "Заменяме двата успоредно свързани кондензатора с един еквивалентен кондензатор 6 μF.",
];

export function CapacitorNetworkReducer() {
  const [phase, setPhase] = useState(0);
  return (
    <div className={PANEL_CLASS}>
      <div className="overflow-x-auto rounded-[10px]">
        <div className="min-w-[520px]">
          <svg
            viewBox="0 0 620 300"
            className={STAGE_CLASS}
            role="img"
            aria-label={`Стъпково опростяване на верига от три кондензатора, стъпка ${phase + 1} от 3`}
          >
            <rect width={620} height={300} fill={STAGE_BG} />
            <line x1={80} y1={65} x2={540} y2={65} stroke={C.wire} strokeWidth={2.5} />
            <line x1={80} y1={235} x2={540} y2={235} stroke={C.wire} strokeWidth={2.5} />
            {phase < 2 ? (
              <g className="animate-rise">
                <line x1={180} y1={65} x2={180} y2={122} stroke={C.wire} strokeWidth={2.5} />
                <line x1={180} y1={178} x2={180} y2={235} stroke={C.wire} strokeWidth={2.5} />
                <CapacitorSymbol x={180} y={150} vertical tex={String.raw`4\,\mu\mathrm F`} color={C.plus} />
                {phase === 0 ? (
                  <>
                    <line x1={430} y1={65} x2={430} y2={98} stroke={C.wire} strokeWidth={2.5} />
                    <line x1={430} y1={202} x2={430} y2={235} stroke={C.wire} strokeWidth={2.5} />
                    <CapacitorSymbol x={430} y={120} vertical tex={String.raw`6\,\mu\mathrm F`} color={C.minus} />
                    <CapacitorSymbol x={430} y={180} vertical tex={String.raw`3\,\mu\mathrm F`} color={C.warn} />
                  </>
                ) : (
                  <>
                    <line x1={430} y1={65} x2={430} y2={122} stroke={C.wire} strokeWidth={2.5} />
                    <line x1={430} y1={178} x2={430} y2={235} stroke={C.wire} strokeWidth={2.5} />
                    <CapacitorSymbol x={430} y={150} vertical tex={String.raw`2\,\mu\mathrm F`} color={C.ok} />
                  </>
                )}
              </g>
            ) : (
              <g className="animate-rise">
                <line x1={310} y1={65} x2={310} y2={122} stroke={C.wire} strokeWidth={2.5} />
                <line x1={310} y1={178} x2={310} y2={235} stroke={C.wire} strokeWidth={2.5} />
                <CapacitorSymbol
                  x={310}
                  y={150}
                  vertical
                  tex={String.raw`C_e=6\,\mu\mathrm F`}
                  color={C.warn}
                />
              </g>
            )}
            {phase >= 1 && (
              <SvgTex
                x={phase === 1 ? 430 : 310}
                y={270}
                tex={phase === 1 ? String.raw`\frac1{C_s}=\frac16+\frac13` : String.raw`C_e=4+2`}
                color={C.ok}
                width={150}
                anchor="middle"
              />
            )}
          </svg>
        </div>
      </div>
      <p aria-live="polite" className="mt-3 min-h-[42px] text-[13.5px] leading-relaxed text-muted">
        {REDUCTION_CAPTIONS[phase]}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className={BTN_PRI}
          onClick={() => setPhase((value) => Math.min(2, value + 1))}
          disabled={phase === 2}
        >
          Следваща стъпка
        </button>
        <button type="button" className={BTN_SEC} onClick={() => setPhase(0)} disabled={phase === 0}>
          Отначало
        </button>
        <span className="self-center text-[12.5px] font-semibold tabular-nums text-muted">
          {phase + 1} / 3
        </span>
      </div>
    </div>
  );
}
