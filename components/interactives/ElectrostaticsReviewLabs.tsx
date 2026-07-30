"use client";

import { useMemo, useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import { Arrow, BTN_SEC, C, PANEL_CLASS, STAGE_BG, STAGE_CLASS, TexChip } from "./svg";

const EPSILON_0 = 8.854_187_812_8e-12;
const AREA = 0.01;
const BASE_GAP = 0.008;
const BATTERY_VOLTAGE = 12;
const BASE_CAPACITANCE = (EPSILON_0 * AREA) / BASE_GAP;
const BASE_CHARGE = BASE_CAPACITANCE * BATTERY_VOLTAGE;
const BASE_FIELD = BATTERY_VOLTAGE / BASE_GAP;
const BASE_ENERGY = 0.5 * BASE_CAPACITANCE * BATTERY_VOLTAGE ** 2;

function decimal(value: number, digits = 2) {
  return value.toFixed(digits).replace(".", ",");
}

function Readout({
  label,
  value,
  accent = "text-ink",
}: {
  label: string;
  value: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="min-w-0 bg-surface px-3 py-2.5">
      <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">{label}</dt>
      <dd className={`mt-0.5 text-[14px] font-bold tabular-nums ${accent}`}>{value}</dd>
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
  valueLabel: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between gap-3 text-[13px] font-semibold text-ink">
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

export function CapacitorDielectricLab() {
  const [mode, setMode] = useState<"isolated" | "connected">("isolated");
  const [epsilonR, setEpsilonR] = useState(4);
  const [fraction, setFraction] = useState(0.6);
  const [gapMm, setGapMm] = useState(8);

  const gap = gapMm / 1000;
  const mediumFactor = 1 + fraction * (epsilonR - 1);
  const capacitance = (EPSILON_0 * AREA * mediumFactor) / gap;
  const charge = mode === "isolated" ? BASE_CHARGE : capacitance * BATTERY_VOLTAGE;
  const voltage = mode === "isolated" ? charge / capacitance : BATTERY_VOLTAGE;
  const field = voltage / gap;
  const energy =
    mode === "isolated"
      ? charge ** 2 / (2 * capacitance)
      : 0.5 * capacitance * BATTERY_VOLTAGE ** 2;

  const ratios = [
    { tex: "C/C_0", value: capacitance / BASE_CAPACITANCE, color: C.warn },
    { tex: "Q/Q_0", value: charge / BASE_CHARGE, color: C.plus },
    { tex: "V/V_0", value: voltage / BATTERY_VOLTAGE, color: C.minus },
    { tex: "E/E_0", value: field / BASE_FIELD, color: C.ok },
    { tex: "U/U_0", value: energy / BASE_ENERGY, color: C.wire },
  ];
  const graphMax = Math.max(2, ...ratios.map((item) => item.value * 1.12));

  const plateTop = 62;
  const plateBottom = 254;
  const plateLeft = 92;
  const plateRight = 592;
  const slabWidth = Math.max(0, (plateRight - plateLeft) * fraction);
  const fieldXs = Array.from({ length: 11 }, (_, index) => plateLeft + 25 + index * 45);
  const chargeXs = Array.from({ length: 10 }, (_, index) => plateLeft + 24 + index * 50);

  return (
    <div className={PANEL_CLASS}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.18em] text-minus">
            Интерактивен преговор
          </p>
          <h3 className="mt-1 font-serif text-[22px] font-bold leading-tight">
            Какво остава постоянно?
          </h3>
        </div>
        <div className="flex rounded-lg border-[1.5px] border-ink bg-paper p-1">
          <button
            type="button"
            onClick={() => setMode("isolated")}
            aria-pressed={mode === "isolated"}
            className={
              mode === "isolated"
                ? "rounded-md bg-ink px-3 py-1.5 text-[12.5px] font-bold text-white"
                : "rounded-md px-3 py-1.5 text-[12.5px] font-semibold text-muted hover:text-ink"
            }
          >
            Откачен: Q const
          </button>
          <button
            type="button"
            onClick={() => setMode("connected")}
            aria-pressed={mode === "connected"}
            className={
              mode === "connected"
                ? "rounded-md bg-ink px-3 py-1.5 text-[12.5px] font-bold text-white"
                : "rounded-md px-3 py-1.5 text-[12.5px] font-semibold text-muted hover:text-ink"
            }
          >
            Свързан: V const
          </button>
        </div>
      </div>

      <p className="mt-3 text-[14.5px] text-muted">
        Плочите имат площ <RichText text="$A=100\,\mathrm{cm^2}$" />. В началното състояние{" "}
        <RichText text="$d_0=8\,\mathrm{mm}$" />, <RichText text="$V_0=12\,\mathrm V$" /> и между
        тях има въздух.
      </p>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(230px,.75fr)]">
        <svg
          viewBox="0 0 720 320"
          className={STAGE_CLASS}
          style={{ background: STAGE_BG }}
          role="img"
          aria-label="Плосък кондензатор с частично вкаран диелектрик"
        >
          <rect
            x={plateLeft}
            y={plateTop}
            width={plateRight - plateLeft}
            height={12}
            rx={3}
            fill={C.wire}
          />
          <rect
            x={plateLeft}
            y={plateBottom}
            width={plateRight - plateLeft}
            height={12}
            rx={3}
            fill={C.wire}
          />

          {slabWidth > 2 && (
            <g>
              <rect
                x={plateLeft}
                y={plateTop + 13}
                width={slabWidth}
                height={plateBottom - plateTop - 13}
                fill={C.warn}
                opacity={0.22}
              />
              <line
                x1={plateLeft + slabWidth}
                y1={plateTop + 13}
                x2={plateLeft + slabWidth}
                y2={plateBottom}
                stroke={C.warn}
                strokeWidth={2}
                strokeDasharray="6 5"
              />
              <SvgTex
                x={plateLeft + slabWidth / 2}
                y={160}
                tex={`\\varepsilon_r=${decimal(epsilonR, 1)}`}
                color={C.warn}
                width={130}
                anchor="middle"
              />
            </g>
          )}

          {fieldXs.map((x) => (
            <Arrow
              key={x}
              x1={x}
              y1={plateTop + 28}
              x2={x}
              y2={plateBottom - 15}
              color={C.minus}
              width={1.6}
            />
          ))}

          {chargeXs.map((x) => (
            <g key={x}>
              <SvgTex x={x} y={plateTop + 6} tex="+" color={C.plus} width={22} anchor="middle" />
              <SvgTex x={x} y={plateBottom + 6} tex="-" color={C.minus} width={22} anchor="middle" />
            </g>
          ))}

          <line
            x1={58}
            y1={plateTop + 10}
            x2={58}
            y2={plateBottom}
            stroke={C.mut}
            strokeWidth={1.5}
          />
          <line x1={50} y1={plateTop + 10} x2={66} y2={plateTop + 10} stroke={C.mut} strokeWidth={1.5} />
          <line x1={50} y1={plateBottom} x2={66} y2={plateBottom} stroke={C.mut} strokeWidth={1.5} />
          <SvgTex x={40} y={160} tex="d" color={C.mut} width={28} anchor="end" />

          {mode === "connected" ? (
            <g>
              <path
                d={`M ${plateRight} ${plateTop + 6} H 654 V 126`}
                fill="none"
                stroke={C.wire}
                strokeWidth={2}
              />
              <path
                d={`M ${plateRight} ${plateBottom + 6} H 654 V 202`}
                fill="none"
                stroke={C.wire}
                strokeWidth={2}
              />
              <line x1={628} y1={144} x2={680} y2={144} stroke={C.plus} strokeWidth={4} />
              <line x1={638} y1={184} x2={670} y2={184} stroke={C.minus} strokeWidth={4} />
              <line x1={654} y1={126} x2={654} y2={144} stroke={C.wire} strokeWidth={2} />
              <line x1={654} y1={184} x2={654} y2={202} stroke={C.wire} strokeWidth={2} />
              <SvgTex x={654} y={112} tex="V_0" color={C.warn} width={55} anchor="middle" />
            </g>
          ) : (
            <g stroke={C.wire} strokeWidth={2}>
              <path d={`M ${plateRight} ${plateTop + 6} H 640`} />
              <path d={`M ${plateRight} ${plateBottom + 6} H 640`} />
              <circle cx={650} cy={plateTop + 6} r={4} fill={C.wire} stroke="none" />
              <circle cx={650} cy={plateBottom + 6} r={4} fill={C.wire} stroke="none" />
            </g>
          )}

          <SvgTex x={342} y={296} tex="E=V/d" color={C.ok} width={92} anchor="middle" />
        </svg>

        <div className="space-y-4 rounded-[10px] border-[1.5px] border-rule bg-paper p-4">
          <RangeControl
            label="Вкарана част"
            value={fraction}
            min={0}
            max={1}
            step={0.05}
            valueLabel={`${Math.round(fraction * 100)}%`}
            onChange={setFraction}
          />
          <RangeControl
            label="Относителна проницаемост"
            value={epsilonR}
            min={1}
            max={6}
            step={0.5}
            valueLabel={`εᵣ = ${decimal(epsilonR, 1)}`}
            onChange={setEpsilonR}
          />
          <RangeControl
            label="Разстояние между плочите"
            value={gapMm}
            min={4}
            max={12}
            step={1}
            valueLabel={`${gapMm} mm`}
            onChange={setGapMm}
          />
          <button
            type="button"
            className={`${BTN_SEC} w-full`}
            onClick={() => {
              setEpsilonR(4);
              setFraction(0.6);
              setGapMm(8);
            }}
          >
            Върнете началните стойности
          </button>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule sm:grid-cols-5">
        <Readout
          label="Капацитет"
          value={<RichText text={`$C=${decimal(capacitance * 1e12)}\\,\\mathrm{pF}$`} />}
          accent="text-minus"
        />
        <Readout
          label="Заряд"
          value={<RichText text={`$Q=${decimal(charge * 1e12)}\\,\\mathrm{pC}$`} />}
          accent="text-plus"
        />
        <Readout
          label="Напрежение"
          value={<RichText text={`$V=${decimal(voltage)}\\,\\mathrm V$`} />}
        />
        <Readout
          label="Поле"
          value={<RichText text={`$E=${decimal(field, 0)}\\,\\mathrm{V/m}$`} />}
          accent="text-ok"
        />
        <Readout
          label="Енергия"
          value={<RichText text={`$U=${decimal(energy * 1e9, 3)}\\,\\mathrm{nJ}$`} />}
        />
      </dl>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(230px,.8fr)]">
        <svg
          viewBox="0 0 720 250"
          className={STAGE_CLASS}
          style={{ background: STAGE_BG }}
          role="img"
          aria-label="Сравнителна стълбовидна графика на капацитет, заряд, напрежение, поле и енергия"
        >
          <line x1={58} y1={205} x2={680} y2={205} stroke={C.mut} strokeWidth={1.5} />
          <line
            x1={58}
            y1={205 - 155 / graphMax}
            x2={680}
            y2={205 - 155 / graphMax}
            stroke={C.warn}
            strokeWidth={1.3}
            strokeDasharray="6 5"
          />
          <SvgTex
            x={48}
            y={205 - 155 / graphMax}
            tex="1"
            color={C.warn}
            width={24}
            anchor="end"
          />
          {ratios.map((item, index) => {
            const height = Math.max(2, (item.value / graphMax) * 155);
            const x = 95 + index * 116;
            return (
              <g key={item.tex}>
                <rect
                  x={x}
                  y={205 - height}
                  width={62}
                  height={height}
                  rx={5}
                  fill={item.color}
                  opacity={0.82}
                />
                <SvgTex x={x + 31} y={228} tex={item.tex} color={item.color} width={80} anchor="middle" />
              </g>
            );
          })}
        </svg>
        <div className="rounded-r-lg border-l-4 border-minus bg-hl px-4 py-3 text-[14.5px] leading-relaxed">
          <p className="font-bold text-ink">Наблюдавайте зелената колона.</p>
          <p className="mt-1">
            {mode === "connected"
              ? "При фиксирано разстояние полето не се променя, когато вкарвате диелектрик: E = V/d. То се променя само ако местите плочите."
              : "При фиксиран заряд диелектрикът отслабва полето. Разстоянието променя напрежението и капацитета, но не и E за идеални безкрайни плочи."}
          </p>
        </div>
      </div>
    </div>
  );
}

type GaussRegion = "sphere" | "gap" | "metal" | "outside";

function gaussState(r: number, shellCharge: number) {
  if (r < 1) {
    return { region: "sphere" as GaussRegion, enclosed: r ** 3, field: r };
  }
  if (r < 1.6) {
    return { region: "gap" as GaussRegion, enclosed: 1, field: 1 / r ** 2 };
  }
  if (r < 2.2) {
    return { region: "metal" as GaussRegion, enclosed: 0, field: 0 };
  }
  return {
    region: "outside" as GaussRegion,
    enclosed: 1 + shellCharge,
    field: (1 + shellCharge) / r ** 2,
  };
}

const REGION_NAMES: Record<GaussRegion, string> = {
  sphere: "В заредената сфера",
  gap: "Между сферата и черупката",
  metal: "В проводящия материал",
  outside: "Извън системата",
};

function graphPath(
  start: number,
  end: number,
  fieldAt: (r: number) => number,
  mapX: (r: number) => number,
  mapY: (field: number) => number,
) {
  const points = Array.from({ length: 52 }, (_, index) => {
    const r = start + ((end - start) * index) / 51;
    return `${mapX(r)},${mapY(fieldAt(r))}`;
  });
  return `M ${points.join(" L ")}`;
}

export function GaussShellExplorer() {
  const [radius, setRadius] = useState(1.3);
  const [shellCharge, setShellCharge] = useState(0);
  const current = gaussState(radius, shellCharge);

  const graph = useMemo(() => {
    const x = (r: number) => 58 + (r / 3.2) * 604;
    const y = (field: number) => 335 - (field / 1.2) * 250;
    return {
      x,
      y,
      inside: graphPath(0, 1, (r) => r, x, y),
      gap: graphPath(1, 1.6, (r) => 1 / r ** 2, x, y),
      metal: graphPath(1.6, 2.2, () => 0, x, y),
      outside: graphPath(2.2, 3.2, (r) => (1 + shellCharge) / r ** 2, x, y),
    };
  }, [shellCharge]);

  /**
   * Платното е прилепнато към чертежа: при по-широк viewBox същите окръжности
   * се свиват до неразличимо. Центърът е и център на платното, а етикетите
   * стоят по диагоналите, за да остане композицията симетрична.
   */
  const centerX = 230;
  const centerY = 220;
  const scale = 62;
  const diag = 0.72;

  return (
    <div className={PANEL_CLASS}>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[.18em] text-minus">
          Гаус по области
        </p>
        <h3 className="mt-1 font-serif text-[22px] font-bold leading-tight">
          Плътна сфера в проводяща черупка
        </h3>
        <p className="mt-2 text-[14.5px] text-muted">
          Заредената сфера има заряд <RichText text="$Q_1$" />. Черупката има собствен заряд{" "}
          <RichText text="$Q$" />, а по вътрешната ѝ повърхност винаги се индуцира{" "}
          <RichText text="$-Q_1$" />.
        </p>
      </div>

      {/* Едва при 2xl има достатъчно поле, че двете сцени да стоят една до
          друга, без чертежът да се смали до неразличимо. */}
      <div className="mt-4 grid gap-4 2xl:grid-cols-2">
        <svg
          viewBox="0 0 460 440"
          className={STAGE_CLASS}
          style={{ background: STAGE_BG }}
          role="img"
          aria-label="Концентрична заредена сфера, проводяща черупка и избираема гаусова повърхност"
        >
          <circle
            cx={centerX}
            cy={centerY}
            r={2.2 * scale}
            fill={C.wire}
            opacity={0.16}
            stroke={C.wire}
            strokeWidth={2}
          />
          <circle cx={centerX} cy={centerY} r={1.6 * scale} fill={STAGE_BG} stroke={C.wire} strokeWidth={2} />
          <circle
            cx={centerX}
            cy={centerY}
            r={scale}
            fill={C.plus}
            opacity={0.24}
            stroke={C.plus}
            strokeWidth={2}
          />
          {Array.from({ length: 12 }, (_, index) => {
            const angle = (index * Math.PI * 2) / 12;
            return (
              <circle
                key={index}
                cx={centerX + Math.cos(angle) * scale * 0.68}
                cy={centerY + Math.sin(angle) * scale * 0.68}
                r={3}
                fill={C.plus}
              />
            );
          })}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius * scale}
            fill="none"
            stroke={C.warn}
            strokeWidth={2}
            strokeDasharray="7 5"
          />
          <TexChip
            x={centerX + scale * 0.55}
            y={centerY - scale * 0.55}
            tex="Q_1"
            color={C.plus}
            width={24}
          />
          <TexChip
            x={centerX - 1.6 * scale * diag}
            y={centerY - 1.6 * scale * diag}
            tex="-Q_1"
            color={C.minus}
            width={32}
            anchor="end"
          />
          <TexChip
            x={centerX + 2.2 * scale * diag}
            y={centerY + 2.2 * scale * diag}
            tex="Q+Q_1"
            color={C.ok}
            width={48}
          />
          <TexChip
            x={centerX}
            y={centerY + radius * scale + 15}
            tex="r"
            color={C.warn}
            width={8}
            anchor="middle"
          />
        </svg>

        <svg
          viewBox="0 0 720 690"
          className={STAGE_CLASS}
          style={{ background: STAGE_BG }}
          role="img"
          aria-label="Графика на електричното поле по радиуса за сферична система"
        >
          <line x1={58} y1={335} x2={674} y2={335} stroke={C.mut} strokeWidth={1.5} />
          <line x1={58} y1={55} x2={58} y2={620} stroke={C.mut} strokeWidth={1.5} />
          {[1, 1.6, 2.2].map((r) => (
            <line
              key={r}
              x1={graph.x(r)}
              y1={55}
              x2={graph.x(r)}
              y2={620}
              stroke={C.faint}
              strokeWidth={1.2}
              strokeDasharray="5 5"
            />
          ))}
          <path d={graph.inside} fill="none" stroke={C.plus} strokeWidth={3} />
          <path d={graph.gap} fill="none" stroke={C.minus} strokeWidth={3} />
          <path d={graph.metal} fill="none" stroke={C.ok} strokeWidth={4} />
          <path d={graph.outside} fill="none" stroke={C.warn} strokeWidth={3} />
          <line
            x1={graph.x(radius)}
            y1={55}
            x2={graph.x(radius)}
            y2={620}
            stroke={C.wire}
            strokeWidth={1.4}
            strokeDasharray="5 4"
          />
          <circle cx={graph.x(radius)} cy={graph.y(current.field)} r={5} fill={C.wire} />
          <SvgTex x={44} y={58} tex="E" color={C.wire} width={28} anchor="end" />
          <SvgTex x={678} y={655} tex="r" color={C.wire} width={28} />
          <SvgTex x={graph.x(1)} y={660} tex="R_1" color={C.plus} width={52} anchor="middle" />
          <SvgTex x={graph.x(1.6)} y={660} tex="R_2" color={C.minus} width={52} anchor="middle" />
          <SvgTex x={graph.x(2.2)} y={660} tex="R_3" color={C.ok} width={52} anchor="middle" />
        </svg>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <RangeControl
          label="Радиус на гаусовата повърхност"
          value={radius}
          min={0.08}
          max={3.1}
          step={0.02}
          valueLabel={`r = ${decimal(radius)} R₁`}
          onChange={setRadius}
        />
        <RangeControl
          label="Собствен заряд на черупката"
          value={shellCharge}
          min={-2}
          max={2}
          step={0.25}
          valueLabel={`Q = ${decimal(shellCharge)} Q₁`}
          onChange={setShellCharge}
        />
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule sm:grid-cols-3">
        <Readout label="Област" value={REGION_NAMES[current.region]} accent="text-minus" />
        <Readout
          label="Обхванат заряд"
          value={<RichText text={`$Q_{\\mathrm{encl}}=${decimal(current.enclosed)}Q_1$`} />}
          accent="text-plus"
        />
        <Readout
          label="Нормировано поле"
          value={<RichText text={`$E=${decimal(current.field)}E_0$`} />}
          accent={current.region === "metal" ? "text-ok" : "text-ink"}
        />
      </dl>

      <p className="mt-4 rounded-r-lg border-l-4 border-minus bg-hl px-4 py-3 text-[14.5px]">
        {current.region === "metal" ? (
          <>
            В метала <RichText text="$E=0$" />, следователно гаусовата повърхност обхваща нулев
            пълен заряд. Това принуждава заряда по вътрешната повърхност да бъде{" "}
            <RichText text="$-Q_1$" />.
          </>
        ) : (
          <>
            В тази област първо намерете <RichText text={String.raw`$Q_{\mathrm{encl}}(r)$`} />,
            после използвайте{" "}
            <RichText text={String.raw`$E=Q_{\mathrm{encl}}/(4\pi\varepsilon_0r^2)$`} />.
          </>
        )}
      </p>
    </div>
  );
}

export function DielectricConfigurationGuide() {
  const [configuration, setConfiguration] = useState<"series" | "parallel">("series");
  const series = configuration === "series";

  return (
    <div className={PANEL_CLASS}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.18em] text-minus">
            Двете конфигурации
          </p>
          <h3 className="mt-1 font-serif text-[22px] font-bold leading-tight">
            Серия или паралел?
          </h3>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className={series ? `${BTN_SEC} bg-hl` : BTN_SEC}
            onClick={() => setConfiguration("series")}
            aria-pressed={series}
          >
            Слоеве
          </button>
          <button
            type="button"
            className={!series ? `${BTN_SEC} bg-hl` : BTN_SEC}
            onClick={() => setConfiguration("parallel")}
            aria-pressed={!series}
          >
            Колони
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(230px,.85fr)]">
        <svg
          viewBox="0 0 620 330"
          className={STAGE_CLASS}
          style={{ background: STAGE_BG }}
          role="img"
          aria-label={
            series
              ? "Два диелектрични слоя, разположени последователно между плочите"
              : "Две диелектрични колони, разположени паралелно между плочите"
          }
        >
          <rect x={80} y={50} width={460} height={12} rx={3} fill={C.wire} />
          <rect x={80} y={268} width={460} height={12} rx={3} fill={C.wire} />
          {series ? (
            <>
              <rect x={80} y={62} width={460} height={103} fill={C.warn} opacity={0.2} />
              <rect x={80} y={165} width={460} height={103} fill={C.minus} opacity={0.2} />
              <line x1={80} y1={165} x2={540} y2={165} stroke={C.faint} strokeWidth={2} />
              <SvgTex x={310} y={113} tex={String.raw`\varepsilon`} color={C.warn} width={60} anchor="middle" />
              <SvgTex x={310} y={216} tex={String.raw`2\varepsilon`} color={C.minus} width={72} anchor="middle" />
            </>
          ) : (
            <>
              <rect x={80} y={62} width={230} height={206} fill={C.warn} opacity={0.2} />
              <rect x={310} y={62} width={230} height={206} fill={C.minus} opacity={0.2} />
              <line x1={310} y1={62} x2={310} y2={268} stroke={C.faint} strokeWidth={2} />
              <SvgTex x={195} y={165} tex={String.raw`\varepsilon`} color={C.warn} width={60} anchor="middle" />
              <SvgTex x={425} y={165} tex={String.raw`2\varepsilon`} color={C.minus} width={72} anchor="middle" />
            </>
          )}
          {[120, 195, 270, 345, 420, 495].map((x) => (
            <Arrow key={x} x1={x} y1={76} x2={x} y2={253} color={C.ok} width={1.8} />
          ))}
        </svg>

        <div className="flex flex-col justify-center rounded-[10px] border-[1.5px] border-rule bg-paper p-4">
          <p className="text-[11px] font-bold uppercase tracking-[.15em] text-muted">
            Мнемоника
          </p>
          <p className="mt-2 text-[15px]">
            {series
              ? "Една силова линия пресича двата материала един след друг. Кондензаторите са последователни."
              : "Едни силови линии минават само през първия материал, други само през втория. Кондензаторите са паралелни."}
          </p>
          <div className="mt-4">
            <RichText
              text={
                series
                  ? "**Резултат:** $C_e=4\\varepsilon A/(3d)$"
                  : "**Резултат:** $C_e=3\\varepsilon A/(2d)$"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
