"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "@/components/interactives/SvgTex";
import {
  BTN_SEC,
  C,
  DRAWING_FONT_FAMILY,
  STAGE_BG,
  STAGE_CLASS,
} from "@/components/interactives/svg";
import {
  LabShell,
  RangeControl,
  decimal,
  graphGrid,
  svgNumber,
} from "@/components/problem-sets/LabShell";

const EPSILON_0 = 8.85e-12;

function signedPercent(value: number, digits = 3) {
  const sign = value >= 0 ? "+" : "-";
  return `${sign}${decimal(Math.abs(value) * 100, digits)}\\%`;
}

export function ChargingEnergyGraph() {
  const [fraction, setFraction] = useState(0.65);
  const left = 82;
  const top = 42;
  const width = 560;
  const height = 230;
  const px = svgNumber(left + fraction * width);
  const py = svgNumber(top + height - fraction * height);

  return (
    <LabShell
      title="Зареждането като лице под графика"
      description="Преместете заряда. Напрежението расте линейно, а натрупаната енергия е оцветеното лице под правата."
      controls={
        <RangeControl
          label="Пренесена част от крайния заряд"
          value={fraction}
          min={0}
          max={1}
          step={0.01}
          valueLabel={<RichText text={`$q/Q=${decimal(fraction, 2)}$`} />}
          onChange={setFraction}
        />
      }
      readouts={[
        { label: "Заряд", tex: `q/Q=${decimal(fraction, 2)}`, tone: "text-minus" },
        { label: "Напрежение", tex: `\\Delta V/\\Delta V_f=${decimal(fraction, 2)}`, tone: "text-plus" },
        { label: "Енергия", tex: `U/U_f=${decimal(fraction * fraction, 3)}`, tone: "text-ok" },
      ]}
    >
      <svg viewBox="0 0 720 330" className={STAGE_CLASS} aria-label="Графика на напрежението спрямо заряда">
        <rect width={720} height={330} fill={STAGE_BG} />
        {graphGrid({ left, top, width, height })}
        <polygon points={`${left},${top + height} ${px},${top + height} ${px},${py}`} fill={C.ok} opacity={0.24} />
        <line x1={left} y1={top + height} x2={left + width} y2={top} stroke={C.minus} strokeWidth={3} />
        <line x1={px} y1={top + height} x2={px} y2={py} stroke={C.warn} strokeWidth={2} strokeDasharray="6 5" />
        <circle cx={px} cy={py} r={6} fill={C.plus} />
        <SvgTex x={left + width - 8} y={top - 14} tex={String.raw`\Delta V=q/C`} color={C.minus} width={112} anchor="end" />
        <SvgTex x={left + width} y={top + height + 28} tex={String.raw`q/Q`} color={C.wire} width={54} anchor="end" />
        <SvgTex x={left + 8} y={top - 16} tex={String.raw`\Delta V/\Delta V_f`} color={C.wire} width={128} anchor="start" />
        <SvgTex x={(left + px) / 2} y={(top + height + py) / 2 + 18} tex={String.raw`U=\int_0^q V(q')\,dq'`} color={C.ok} width={172} anchor="middle" />
      </svg>
    </LabShell>
  );
}

function coaxErrors(x: number) {
  const exactInner = Math.log1p(x) / x - 1;
  const exactMean = ((1 + x / 2) * Math.log1p(x)) / x - 1;
  return {
    exactInner,
    exactMean,
    seriesInner: -x / 2 + (x * x) / 3,
    seriesMean: (x * x) / 12,
  };
}

function CoaxialGeometrySketch() {
  const cx = 178;
  const cy = 145;

  return (
    <svg
      viewBox="0 0 720 270"
      className={STAGE_CLASS}
      aria-label="Напречно сечение на коаксиален кондензатор и локалното му плоско приближение"
    >
      <defs>
        <marker id="coax-field-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.warn} />
        </marker>
      </defs>
      <rect width={720} height={270} fill={STAGE_BG} />

      <text x={178} y={28} textAnchor="middle" fill={C.mut} fontFamily={DRAWING_FONT_FAMILY} fontSize={12} fontWeight={700} letterSpacing={1.4}>
        НАПРЕЧНО СЕЧЕНИЕ
      </text>
      <circle cx={cx} cy={cy} r={88} fill="none" stroke={C.plus} strokeWidth={13} />
      <circle cx={cx} cy={cy} r={76} fill={C.minus} opacity={0.1} />
      <circle cx={cx} cy={cy} r={43} fill={C.minus} stroke={C.wire} strokeWidth={2} />
      <circle cx={cx} cy={cy} r={4} fill={C.wire} />
      <line x1={cx} y1={cy} x2={cx + 39} y2={cy - 17} stroke={C.wire} strokeWidth={2} />
      <line x1={cx + 43} y1={cy + 8} x2={cx + 78} y2={cy + 15} stroke={C.warn} strokeWidth={2} markerEnd="url(#coax-field-arrow)" />
      <SvgTex x={cx + 18} y={cy - 31} tex="a" color={C.wire} width={24} anchor="middle" />
      <SvgTex x={cx} y={253} tex={String.raw`d=b-a`} color={C.warn} width={70} anchor="middle" />

      <path d="M 294 145 C 330 145, 342 145, 374 145" fill="none" stroke={C.faint} strokeWidth={2} strokeDasharray="6 6" markerEnd="url(#coax-field-arrow)" />
      <SvgTex x={334} y={118} tex={String.raw`d\ll a`} color={C.ok} width={58} anchor="middle" />

      <text x={537} y={28} textAnchor="middle" fill={C.mut} fontFamily={DRAWING_FONT_FAMILY} fontSize={12} fontWeight={700} letterSpacing={1.4}>
        ЛОКАЛЕН ПЛОСЪК МОДЕЛ
      </text>
      <rect x={454} y={72} width={14} height={146} rx={3} fill={C.minus} />
      <rect x={602} y={72} width={14} height={146} rx={3} fill={C.plus} />
      {[96, 128, 160, 192].map((y) => (
        <line key={y} x1={474} y1={y} x2={596} y2={y} stroke={C.warn} strokeWidth={2} markerEnd="url(#coax-field-arrow)" />
      ))}
      <line x1={468} y1={234} x2={602} y2={234} stroke={C.wire} strokeWidth={1.5} />
      <line x1={468} y1={226} x2={468} y2={242} stroke={C.wire} strokeWidth={1.5} />
      <line x1={602} y1={226} x2={602} y2={242} stroke={C.wire} strokeWidth={1.5} />
      <SvgTex x={535} y={250} tex="d" color={C.wire} width={24} anchor="middle" />
      <SvgTex x={535} y={53} tex={String.raw`S_m=2\pi(a+d/2)L`} color={C.ok} width={176} anchor="middle" />
    </svg>
  );
}

export function CoaxialApproximationLab() {
  const [x, setX] = useState(0.1);
  const left = 82;
  const top = 38;
  const width = 560;
  const height = 234;
  const xMin = 0.01;
  const xMax = 0.5;
  const yMin = -0.2;
  const yMax = 0.025;
  const sx = (value: number) => svgNumber(left + ((value - xMin) / (xMax - xMin)) * width);
  const sy = (value: number) => svgNumber(top + ((yMax - value) / (yMax - yMin)) * height);
  const samples = Array.from({ length: 90 }, (_, index) => xMin + (index / 89) * (xMax - xMin));
  const innerPoints = samples.map((value) => `${sx(value)},${sy(coaxErrors(value).exactInner)}`).join(" ");
  const meanPoints = samples.map((value) => `${sx(value)},${sy(coaxErrors(value).exactMean)}`).join(" ");
  const values = coaxErrors(x);

  return (
    <LabShell
      title="Кога коаксиалният кондензатор се държи като плосък?"
      description="Схемата показва кое точно „изправяме“, а графиката сравнява грешките на двете плоски апроксимации. Средният радиус премахва линейната грешка."
      controls={
        <RangeControl
          label="Относителна дебелина"
          value={x}
          min={0.01}
          max={0.5}
          step={0.01}
          valueLabel={<RichText text={`$x=d/a=${decimal(x, 2)}$`} />}
          onChange={setX}
        />
      }
      readouts={[
        { label: "Вътрешна площ", tex: signedPercent(values.exactInner), tone: "text-minus" },
        { label: "Ред за вътр.", tex: signedPercent(values.seriesInner), tone: "text-minus" },
        { label: "Среден радиус", tex: signedPercent(values.exactMean), tone: "text-ink" },
        { label: "Ред за средния", tex: signedPercent(values.seriesMean), tone: "text-ink" },
      ]}
    >
      <div className="space-y-3">
        <CoaxialGeometrySketch />
        <svg viewBox="0 0 720 330" className={STAGE_CLASS} aria-label="Графика на грешките на плоските апроксимации">
          <rect width={720} height={330} fill={STAGE_BG} />
          {graphGrid({ left, top, width, height })}
          <line x1={left} y1={sy(0)} x2={left + width} y2={sy(0)} stroke={C.wire} strokeWidth={1.5} />
          <polyline points={innerPoints} fill="none" stroke={C.minus} strokeWidth={3} />
          <polyline points={meanPoints} fill="none" stroke={C.warn} strokeWidth={3} />
          <line x1={sx(x)} y1={top} x2={sx(x)} y2={top + height} stroke={C.faint} strokeWidth={2} strokeDasharray="6 5" />
          <circle cx={sx(x)} cy={sy(values.exactInner)} r={6} fill={C.minus} />
          <circle cx={sx(x)} cy={sy(values.exactMean)} r={6} fill={C.warn} />
          <SvgTex x={left + width} y={top + height + 28} tex={String.raw`x=d/a`} color={C.wire} width={62} anchor="end" />
          <SvgTex x={left + 8} y={top - 16} tex={String.raw`(C_{\text{апр}}-C)/C`} color={C.wire} width={142} anchor="start" />
          <SvgTex x={left + width - 8} y={sy(-0.16)} tex={String.raw`C_{\text{вътр}}`} color={C.minus} width={92} anchor="end" />
          <SvgTex x={left + width - 8} y={sy(0.012)} tex={String.raw`C_{\text{ср}}`} color={C.warn} width={82} anchor="end" />
        </svg>
      </div>
    </LabShell>
  );
}

export function BreakdownOptimizationLab() {
  const [aMm, setAMm] = useState(1);
  const bMm = 10;
  const breakdownField = 3e6;
  const operatingVoltage = 10_000;
  const a = aMm / 1000;
  const b = bMm / 1000;
  const breakdownVoltage = breakdownField * a * Math.log(b / a);
  const fieldAtTenKv = operatingVoltage / (a * Math.log(b / a));
  const optimum = bMm / Math.E;
  const maximumVoltage = (breakdownField * b) / Math.E;
  const left = 82;
  const top = 38;
  const width = 560;
  const height = 234;
  const xMin = 0.4;
  const xMax = 9.5;
  const yMax = 12_000;
  const sx = (value: number) => svgNumber(left + ((value - xMin) / (xMax - xMin)) * width);
  const sy = (value: number) => svgNumber(top + ((yMax - value) / yMax) * height);
  const samples = Array.from({ length: 120 }, (_, index) => xMin + (index / 119) * (xMax - xMin));
  const curve = samples
    .map((value) => {
      const radius = value / 1000;
      return `${sx(value)},${sy(breakdownField * radius * Math.log(b / radius))}`;
    })
    .join(" ");

  return (
    <LabShell
      title="Оптимумът на коаксиалното жило"
      description="Премествайте радиуса на жилото. По-дебелата междина не гарантира по-малко поле, защото полето се концентрира при малък вътрешен радиус."
      controls={
        <RangeControl
          label="Радиус на вътрешното жило"
          value={aMm}
          min={0.4}
          max={9.5}
          step={0.1}
          valueLabel={<RichText text={`$a=${decimal(aMm, 1)}\,\\mathrm{mm}$`} />}
          onChange={setAMm}
        />
      }
      readouts={[
        { label: "Избран радиус", tex: `a=${decimal(aMm, 1)}\,\\mathrm{mm}`, tone: "text-minus" },
        { label: "Пробивно напр.", tex: `V_{\\mathrm{crit}}=${decimal(breakdownVoltage / 1000, 2)}\,\\mathrm{kV}`, tone: breakdownVoltage >= operatingVoltage ? "text-ok" : "text-plus" },
        { label: String.raw`Поле при $10\,\mathrm{kV}$`, tex: `E_{\\max}=${decimal(fieldAtTenKv / 1e6, 2)}\,\\mathrm{MV/m}`, tone: fieldAtTenKv <= breakdownField ? "text-ok" : "text-plus" },
        { label: "Оптимум", tex: `a_{\\mathrm{opt}}=${decimal(optimum, 2)}\,\\mathrm{mm}`, tone: "text-ok" },
        { label: "Максимум", tex: `V_{\\max}=${decimal(maximumVoltage / 1000, 2)}\,\\mathrm{kV}`, tone: "text-ok" },
      ]}
    >
      <svg viewBox="0 0 720 330" className={STAGE_CLASS} aria-label="Графика на пробивното напрежение спрямо радиуса на жилото">
        <rect width={720} height={330} fill={STAGE_BG} />
        {graphGrid({ left, top, width, height })}
        <polyline points={curve} fill="none" stroke={C.minus} strokeWidth={3} />
        <line x1={left} y1={sy(operatingVoltage)} x2={left + width} y2={sy(operatingVoltage)} stroke={C.plus} strokeWidth={2} strokeDasharray="7 5" />
        <line x1={sx(optimum)} y1={top} x2={sx(optimum)} y2={top + height} stroke={C.ok} strokeWidth={2} strokeDasharray="7 5" />
        <circle cx={sx(aMm)} cy={sy(breakdownVoltage)} r={7} fill={C.warn} />
        <circle cx={sx(optimum)} cy={sy(maximumVoltage)} r={6} fill={C.ok} />
        <SvgTex x={left + width} y={top + height + 28} tex={String.raw`a\ (\mathrm{mm})`} color={C.wire} width={92} anchor="end" />
        <SvgTex x={left + 8} y={top - 16} tex={String.raw`\Delta V_{\mathrm{crit}}`} color={C.wire} width={104} anchor="start" />
        <SvgTex x={left + width - 8} y={sy(operatingVoltage) - 16} tex={String.raw`10\,\mathrm{kV}`} color={C.plus} width={76} anchor="end" />
        <SvgTex x={sx(optimum) + 14} y={top + 18} tex={String.raw`a=b/e`} color={C.ok} width={72} />
      </svg>
    </LabShell>
  );
}

export function PlateEnergyLab() {
  const [mode, setMode] = useState<"charge" | "voltage">("charge");
  const [distanceMm, setDistanceMm] = useState(3);
  const area = 0.01;
  const d1 = 0.001;
  const d = distanceMm / 1000;
  const voltage1 = 1000;
  const capacitance1 = (EPSILON_0 * area) / d1;
  const charge1 = capacitance1 * voltage1;
  const capacitance = (EPSILON_0 * area) / d;
  const charge = mode === "charge" ? charge1 : capacitance * voltage1;
  const voltage = mode === "charge" ? charge / capacitance : voltage1;
  const energy1 = 0.5 * capacitance1 * voltage1 * voltage1;
  const energy = mode === "charge" ? (charge * charge) / (2 * capacitance) : 0.5 * capacitance * voltage1 * voltage1;
  const force = mode === "charge" ? (charge * charge) / (2 * EPSILON_0 * area) : (EPSILON_0 * area * voltage1 * voltage1) / (2 * d * d);
  const externalWork = mode === "charge" ? energy - energy1 : energy1 - energy;
  const returnedToSource = mode === "charge" ? 0 : voltage1 * (charge1 - charge);
  const gap = 64 + ((distanceMm - 1) / 2) * 120;
  const topPlateY = 165 - gap / 2;
  const bottomPlateY = 165 + gap / 2;
  const maxEnergy = 3 * energy1;
  const initialBar = (energy1 / maxEnergy) * 190;
  const currentBar = (energy / maxEnergy) * 190;

  return (
    <LabShell
      title="Кой участва в енергийния баланс?"
      description="Изберете кое остава постоянно и раздалечете плочите. Симулацията отделя енергията на полето, външната работа и обмена с източника."
      controls={
        <>
          <div>
            <span className="mb-1.5 block text-[13px] font-semibold">Режим</span>
            <div className="flex flex-wrap gap-2">
              <button className={BTN_SEC + (mode === "charge" ? " bg-hl" : "")} onClick={() => setMode("charge")}>
                <RichText text={String.raw`Откачен: $Q=\mathrm{const}$`} />
              </button>
              <button className={BTN_SEC + (mode === "voltage" ? " bg-hl" : "")} onClick={() => setMode("voltage")}>
                <RichText text={String.raw`Свързан: $V=\mathrm{const}$`} />
              </button>
            </div>
          </div>
          <RangeControl
            label="Разстояние между плочите"
            value={distanceMm}
            min={1}
            max={3}
            step={0.05}
            valueLabel={<RichText text={`$d=${decimal(distanceMm, 2)}\,\\mathrm{mm}$`} />}
            onChange={setDistanceMm}
          />
        </>
      }
      readouts={[
        { label: "Капацитет", tex: `C=${decimal(capacitance * 1e12, 1)}\,\\mathrm{pF}`, tone: "text-minus" },
        { label: "Заряд", tex: `Q=${decimal(charge * 1e9, 1)}\,\\mathrm{nC}`, tone: "text-plus" },
        { label: "Напрежение", tex: `V=${decimal(voltage, 0)}\,\\mathrm V`, tone: "text-ink" },
        { label: "Енергия", tex: `U=${decimal(energy * 1e6, 1)}\,\\mu\\mathrm J`, tone: "text-ok" },
        { label: "Външна работа", tex: `A_{\\text{вън}}=${decimal(externalWork * 1e6, 1)}\,\\mu\\mathrm J`, tone: "text-plus" },
        { label: "Към източника", tex: `${decimal(returnedToSource * 1e6, 1)}\,\\mu\\mathrm J`, tone: "text-minus" },
      ]}
    >
      <svg viewBox="0 0 720 340" className={STAGE_CLASS} aria-label="Симулация на раздалечаване на плочите на кондензатор">
        <rect width={720} height={340} fill={STAGE_BG} />
        <g>
          <rect x={80} y={topPlateY - 7} width={290} height={14} rx={4} fill={C.plus} />
          <rect x={80} y={bottomPlateY - 7} width={290} height={14} rx={4} fill={C.minus} />
          {[115, 160, 205, 250, 295, 340].map((x) => (
            <g key={x} opacity={0.8}>
              <line x1={x} y1={topPlateY + 12} x2={x} y2={bottomPlateY - 16} stroke={C.warn} strokeWidth={1.7} />
              <polygon points={`${x},${bottomPlateY - 8} ${x - 4},${bottomPlateY - 18} ${x + 4},${bottomPlateY - 18}`} fill={C.warn} />
            </g>
          ))}
          <line x1={55} y1={topPlateY} x2={55} y2={bottomPlateY} stroke={C.wire} strokeWidth={1.5} />
          <line x1={48} y1={topPlateY} x2={62} y2={topPlateY} stroke={C.wire} strokeWidth={1.5} />
          <line x1={48} y1={bottomPlateY} x2={62} y2={bottomPlateY} stroke={C.wire} strokeWidth={1.5} />
          <SvgTex x={39} y={165} tex="d" color={C.wire} width={24} anchor="end" />
          <SvgTex x={225} y={topPlateY - 24} tex={mode === "charge" ? String.raw`+Q_0` : String.raw`+Q(d)`} color={C.plus} width={68} anchor="middle" />
          <SvgTex x={225} y={bottomPlateY + 24} tex={mode === "charge" ? String.raw`-Q_0` : String.raw`-Q(d)`} color={C.minus} width={68} anchor="middle" />
        </g>
        <g>
          <line x1={470} y1={282} x2={650} y2={282} stroke={C.wire} strokeWidth={2} />
          <rect x={496} y={282 - initialBar} width={48} height={initialBar} fill={C.faint} />
          <rect x={576} y={282 - currentBar} width={48} height={currentBar} fill={C.ok} />
          <SvgTex x={520} y={306} tex={String.raw`U_1`} color={C.mut} width={38} anchor="middle" />
          <SvgTex x={600} y={306} tex={String.raw`U(d)`} color={C.ok} width={48} anchor="middle" />
          <SvgTex x={560} y={55} tex={mode === "charge" ? String.raw`Q=\mathrm{const}` : String.raw`V=\mathrm{const}`} color={C.warn} width={118} anchor="middle" />
        </g>
      </svg>
    </LabShell>
  );
}

export function SharingEnergyLab() {
  const [resistance, setResistance] = useState(50);
  const [timeUnits, setTimeUnits] = useState(1.5);
  const capacitance = 100e-6;
  const voltage0 = 12;
  const tau = (resistance * capacitance) / 2;
  const time = timeUnits * tau;
  const decay = Math.exp(-timeUnits);
  const voltage1 = (voltage0 / 2) * (1 + decay);
  const voltage2 = (voltage0 / 2) * (1 - decay);
  const current = (voltage0 / resistance) * decay;
  const initialEnergy = 0.5 * capacitance * voltage0 * voltage0;
  const fieldEnergy = (capacitance * voltage0 * voltage0 * (1 + Math.exp(-2 * timeUnits))) / 4;
  const heat = initialEnergy - fieldEnergy;
  const left = 82;
  const top = 38;
  const width = 560;
  const height = 234;
  const sx = (value: number) => svgNumber(left + (value / 5) * width);
  const sy = (value: number) => svgNumber(top + (1 - value) * height);
  const samples = Array.from({ length: 100 }, (_, index) => (index / 99) * 5);
  const fieldCurve = samples.map((value) => `${sx(value)},${sy(0.5 * (1 + Math.exp(-2 * value)))}`).join(" ");
  const heatCurve = samples.map((value) => `${sx(value)},${sy(0.5 * (1 - Math.exp(-2 * value)))}`).join(" ");

  return (
    <LabShell
      title="Къде отива липсващата половина?"
      description="Променете съпротивлението. То променя времевата скала и пиковия ток, но не и крайната топлина."
      controls={
        <>
          <RangeControl
            label="Съпротивление на проводниците"
            value={resistance}
            min={5}
            max={150}
            step={1}
            valueLabel={<RichText text={`$R=${decimal(resistance, 0)}\,\\Omega$`} />}
            onChange={setResistance}
          />
          <RangeControl
            label="Време в единици на τ"
            value={timeUnits}
            min={0}
            max={5}
            step={0.05}
            valueLabel={<RichText text={`$t/\\tau=${decimal(timeUnits, 2)}$`} />}
            onChange={setTimeUnits}
          />
        </>
      }
      readouts={[
        { label: "Времева скала", tex: `\\tau=${decimal(tau * 1000, 2)}\,\\mathrm{ms}`, tone: "text-minus" },
        { label: "Момент", tex: `t=${decimal(time * 1000, 2)}\,\\mathrm{ms}` },
        { label: "Ток", tex: `I=${decimal(current * 1000, 1)}\,\\mathrm{mA}`, tone: "text-plus" },
        { label: "Първи конд.", tex: `V_1=${decimal(voltage1, 2)}\,\\mathrm V`, tone: "text-ink" },
        { label: "Втори конд.", tex: `V_2=${decimal(voltage2, 2)}\,\\mathrm V`, tone: "text-minus" },
        { label: "Отделена топлина", tex: `Q_R=${decimal(heat * 1000, 2)}\,\\mathrm{mJ}`, tone: "text-ok" },
      ]}
    >
      <svg viewBox="0 0 720 330" className={STAGE_CLASS} aria-label="Графика на полевата енергия и отделената топлина">
        <rect width={720} height={330} fill={STAGE_BG} />
        {graphGrid({ left, top, width, height })}
        <polyline points={fieldCurve} fill="none" stroke={C.minus} strokeWidth={3} />
        <polyline points={heatCurve} fill="none" stroke={C.ok} strokeWidth={3} />
        <line x1={sx(timeUnits)} y1={top} x2={sx(timeUnits)} y2={top + height} stroke={C.warn} strokeWidth={2} strokeDasharray="6 5" />
        <circle cx={sx(timeUnits)} cy={sy(fieldEnergy / initialEnergy)} r={6} fill={C.minus} />
        <circle cx={sx(timeUnits)} cy={sy(heat / initialEnergy)} r={6} fill={C.ok} />
        <SvgTex x={left + width} y={top + height + 28} tex={String.raw`t/\tau`} color={C.wire} width={44} anchor="end" />
        <SvgTex x={left + 8} y={top - 16} tex={String.raw`U/U_i`} color={C.wire} width={52} anchor="start" />
        <SvgTex x={left + width - 8} y={sy(0.51) - 14} tex={String.raw`U_{\text{поле}}`} color={C.minus} width={98} anchor="end" />
        <SvgTex x={left + width - 8} y={sy(0.49) + 16} tex={String.raw`Q_R`} color={C.ok} width={44} anchor="end" />
      </svg>
    </LabShell>
  );
}

export function EnergyConcentrationLab() {
  const [logRadius, setLogRadius] = useState(1);
  const a = 1;
  const b = 100;
  const radius = 10 ** logRadius;
  const energyFraction = Math.log(radius / a) / Math.log(b / a);
  const volumeFraction = (radius * radius - a * a) / (b * b - a * a);
  const left = 82;
  const top = 38;
  const width = 560;
  const height = 234;
  const sx = (value: number) => svgNumber(left + (value / 2) * width);
  const sy = (value: number) => svgNumber(top + (1 - value) * height);
  const samples = Array.from({ length: 100 }, (_, index) => (index / 99) * 2);
  const energyCurve = samples.map((value) => `${sx(value)},${sy(value / 2)}`).join(" ");
  const volumeCurve = samples
    .map((value) => {
      const r = 10 ** value;
      return `${sx(value)},${sy((r * r - a * a) / (b * b - a * a))}`;
    })
    .join(" ");

  return (
    <LabShell
      title="Енергията и обемът не растат еднакво"
      description="Радиусът е върху логаритмична ос. При коаксиалния кондензатор половината енергия се достига много преди половината обем."
      controls={
        <RangeControl
          label="Външна граница на разглежданата област"
          value={logRadius}
          min={0}
          max={2}
          step={0.01}
          valueLabel={<RichText text={`$r=${decimal(radius, 2)}\,\\mathrm{mm}$`} />}
          onChange={setLogRadius}
        />
      }
      readouts={[
        { label: "Радиус", tex: `r=${decimal(radius, 2)}\,\\mathrm{mm}`, tone: "text-minus" },
        { label: "Част от енергията", tex: `${decimal(energyFraction * 100, 2)}\\%`, tone: "text-ok" },
        { label: "Част от обема", tex: `${decimal(volumeFraction * 100, 3)}\\%`, tone: "text-plus" },
        { label: "Половината енергия", tex: `r_{1/2}=10\,\\mathrm{mm}`, tone: "text-ink" },
      ]}
    >
      <svg viewBox="0 0 720 330" className={STAGE_CLASS} aria-label="Графика на енергийния и обемния дял в коаксиален кондензатор">
        <rect width={720} height={330} fill={STAGE_BG} />
        {graphGrid({ left, top, width, height })}
        <polyline points={energyCurve} fill="none" stroke={C.ok} strokeWidth={3} />
        <polyline points={volumeCurve} fill="none" stroke={C.plus} strokeWidth={3} />
        <line x1={sx(logRadius)} y1={top} x2={sx(logRadius)} y2={top + height} stroke={C.warn} strokeWidth={2} strokeDasharray="6 5" />
        <circle cx={sx(logRadius)} cy={sy(energyFraction)} r={6} fill={C.ok} />
        <circle cx={sx(logRadius)} cy={sy(volumeFraction)} r={6} fill={C.plus} />
        <line x1={sx(1)} y1={top} x2={sx(1)} y2={top + height} stroke={C.faint} strokeWidth={1.5} />
        <SvgTex x={left + width} y={top + height + 28} tex={String.raw`\log_{10}(r/a)`} color={C.wire} width={104} anchor="end" />
        <SvgTex x={left + 8} y={top - 16} tex={String.raw`\text{дял}`} color={C.wire} width={58} anchor="start" />
        <SvgTex x={left + width - 8} y={sy(0.86)} tex={String.raw`U(<r)/U`} color={C.ok} width={82} anchor="end" />
        <SvgTex x={left + width - 8} y={sy(0.72)} tex={String.raw`V(<r)/V`} color={C.plus} width={82} anchor="end" />
        <SvgTex x={sx(1) + 12} y={top + 20} tex={String.raw`r=\sqrt{ab}`} color={C.warn} width={90} />
      </svg>
    </LabShell>
  );
}

export function PlateForceSketch() {
  return (
    <svg viewBox="0 0 720 240" className={STAGE_CLASS} aria-label="Схема на силите между плочите на кондензатор">
      <rect width={720} height={240} fill={STAGE_BG} />
      <rect x={160} y={55} width={400} height={14} rx={4} fill={C.plus} />
      <rect x={160} y={171} width={400} height={14} rx={4} fill={C.minus} />
      {[205, 265, 325, 385, 445, 505].map((x) => (
        <g key={x} opacity={0.75}>
          <line x1={x} y1={78} x2={x} y2={158} stroke={C.warn} strokeWidth={1.7} />
          <polygon points={`${x},166 ${x - 4},156 ${x + 4},156`} fill={C.warn} />
        </g>
      ))}
      <line x1={128} y1={62} x2={78} y2={62} stroke={C.ok} strokeWidth={3} />
      <polygon points="70,62 82,56 82,68" fill={C.ok} />
      <line x1={592} y1={178} x2={642} y2={178} stroke={C.ok} strokeWidth={3} />
      <polygon points="650,178 638,172 638,184" fill={C.ok} />
      <SvgTex x={104} y={38} tex={String.raw`\vec F_{\text{вън}}`} color={C.ok} width={96} anchor="middle" />
      <SvgTex x={616} y={210} tex={String.raw`\vec F_{\text{вън}}`} color={C.ok} width={96} anchor="middle" />
      <SvgTex x={360} y={40} tex={String.raw`+Q`} color={C.plus} width={42} anchor="middle" />
      <SvgTex x={360} y={207} tex={String.raw`-Q`} color={C.minus} width={42} anchor="middle" />
      <text x={360} y={126} textAnchor="middle" fill={C.mut} fontFamily={DRAWING_FONT_FAMILY} fontSize={15} fontWeight={600}>
        РАЗДАЛЕЧАВАНЕ
      </text>
    </svg>
  );
}
