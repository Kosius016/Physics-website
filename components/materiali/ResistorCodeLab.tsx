"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "@/components/interactives/SvgTex";
import { C, PANEL_CLASS, STAGE_BG, STAGE_CLASS } from "@/components/interactives/svg";
import { Readouts, decimal } from "@/components/problem-sets/LabShell";
import {
  DIGIT_COLOR_NAMES,
  MULTIPLIER_COLOR_NAMES,
  RESISTOR_COLORS,
  TOLERANCE_COLOR_NAMES,
  type ResistorColorName,
} from "./resistorPalette";

type BandMode = 4 | 5;

function ohmLatex(value: number) {
  if (value >= 1_000_000) return String.raw`${decimal(value / 1_000_000, 3)}\,\mathrm{M\Omega}`;
  if (value >= 1_000) return String.raw`${decimal(value / 1_000, 3)}\,\mathrm{k\Omega}`;
  if (value >= 1) return String.raw`${decimal(value, value < 10 ? 2 : 0)}\,\Omega`;
  return String.raw`${decimal(value * 1_000, 0)}\,\mathrm{m\Omega}`;
}

function roleLabel(mode: BandMode, index: number) {
  if (index < mode - 2) return `${index + 1}-ва значеща цифра`;
  if (index === mode - 2) return "Множител";
  return "Толеранс";
}

function optionsFor(mode: BandMode, index: number): readonly ResistorColorName[] {
  if (index < mode - 2) return DIGIT_COLOR_NAMES;
  if (index === mode - 2) return MULTIPLIER_COLOR_NAMES;
  return TOLERANCE_COLOR_NAMES;
}

function digitFor(name: ResistorColorName) {
  const color = RESISTOR_COLORS[name];
  return "digit" in color ? color.digit : 0;
}

function toleranceFor(name: ResistorColorName) {
  const color = RESISTOR_COLORS[name];
  return "tolerance" in color ? color.tolerance : 20;
}

function BandSelect({
  mode,
  index,
  value,
  onChange,
}: {
  mode: BandMode;
  index: number;
  value: ResistorColorName;
  onChange: (value: ResistorColorName) => void;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-[12px] font-bold text-muted">{roleLabel(mode, index)}</span>
      <span className="flex items-center gap-2 rounded-lg border-[1.5px] border-ink bg-surface px-2.5 py-2">
        <span
          aria-hidden="true"
          className="h-4 w-4 shrink-0 rounded-full border border-ink/40"
          style={{ backgroundColor: RESISTOR_COLORS[value].hex }}
        />
        <select
          value={value}
          onChange={(event) => onChange(event.target.value as ResistorColorName)}
          className="min-w-0 flex-1 cursor-pointer bg-transparent text-[13px] font-semibold text-ink outline-none"
        >
          {optionsFor(mode, index).map((name) => (
            <option key={name} value={name}>
              {RESISTOR_COLORS[name].label}
            </option>
          ))}
        </select>
      </span>
    </label>
  );
}

export default function ResistorCodeLab() {
  const [mode, setMode] = useState<BandMode>(4);
  const [fourBands, setFourBands] = useState<ResistorColorName[]>([
    "yellow",
    "violet",
    "red",
    "gold",
  ]);
  const [fiveBands, setFiveBands] = useState<ResistorColorName[]>([
    "brown",
    "black",
    "black",
    "brown",
    "brown",
  ]);
  const bands = mode === 4 ? fourBands : fiveBands;
  const setBands = mode === 4 ? setFourBands : setFiveBands;
  const digitCount = mode - 2;
  const digits = bands.slice(0, digitCount).map(digitFor);
  const significant = digits.reduce<number>((value, digit) => value * 10 + digit, 0);
  const multiplier = RESISTOR_COLORS[bands[digitCount]].multiplier ?? 1;
  const tolerance = toleranceFor(bands[digitCount + 1]);
  const resistance = significant * multiplier;
  const minimum = resistance * (1 - tolerance / 100);
  const maximum = resistance * (1 + tolerance / 100);
  const positions = mode === 4 ? [230, 274, 326, 466] : [214, 252, 290, 340, 466];

  function updateBand(index: number, value: ResistorColorName) {
    setBands((current) => current.map((band, bandIndex) => (bandIndex === index ? value : band)));
  }

  function cycleBand(index: number) {
    const options = optionsFor(mode, index);
    const currentIndex = options.indexOf(bands[index]);
    updateBand(index, options[(currentIndex + 1) % options.length]);
  }

  return (
    <div className={PANEL_CLASS}>
      <p className="text-[11px] font-bold uppercase tracking-[.16em] text-minus">Интерактивен декодер</p>
      <h3 className="mt-1 font-serif text-[22px] font-bold">Сменете лентите, прочетете стойността</h3>
      <p className="mt-1 text-[14px] text-muted">
        Щракнете върху лента или използвайте списъка под резистора. Отделената крайна лента винаги е толерансът.
      </p>

      <div className="my-4 inline-flex overflow-hidden rounded-lg border-[1.5px] border-ink" role="group" aria-label="Брой цветни ленти">
        {([4, 5] as BandMode[]).map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={mode === value}
            onClick={() => setMode(value)}
            className={mode === value ? "cursor-pointer bg-ink px-4 py-2 text-[13px] font-bold text-white" : "cursor-pointer border-l-[1.5px] border-ink bg-surface px-4 py-2 text-[13px] font-semibold text-ink first:border-l-0 hover:bg-hl"}
          >
            {value} ленти
          </button>
        ))}
      </div>

      <svg viewBox="0 0 720 250" className={STAGE_CLASS} aria-label={`Резистор с ${mode} сменяеми цветни ленти`}>
        <rect width={720} height={250} fill={STAGE_BG} />
        <line x1={72} y1={125} x2={180} y2={125} stroke={C.mut} strokeWidth={5} />
        <line x1={540} y1={125} x2={648} y2={125} stroke={C.mut} strokeWidth={5} />
        <path
          d="M 180 98 C 198 82, 218 76, 244 76 H 476 C 502 76, 522 82, 540 98 V 152 C 522 168, 502 174, 476 174 H 244 C 218 174, 198 168, 180 152 Z"
          fill={C.warn}
          opacity={0.72}
          stroke={C.wire}
          strokeWidth={2}
        />
        {bands.map((band, index) => (
          <g key={`${mode}-${index}`}>
            <rect
              x={positions[index] - 10}
              y={78}
              width={20}
              height={94}
              fill={RESISTOR_COLORS[band].hex}
              stroke={C.wire}
              strokeWidth={0.8}
              role="button"
              tabIndex={0}
              aria-label={`${roleLabel(mode, index)}: ${RESISTOR_COLORS[band].label}. Натиснете за следващ цвят.`}
              onClick={() => cycleBand(index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  cycleBand(index);
                }
              }}
              className="cursor-pointer"
            />
            <SvgTex x={positions[index]} y={204} tex={String(index + 1)} color={C.mut} width={20} anchor="middle" fontSize={11} />
          </g>
        ))}
      </svg>

      <div className={`mt-4 grid gap-3 ${mode === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-5"}`}>
        {bands.map((band, index) => (
          <BandSelect key={`${mode}-select-${index}`} mode={mode} index={index} value={band} onChange={(value) => updateBand(index, value)} />
        ))}
      </div>

      <Readouts
        columns="sm:grid-cols-4"
        items={[
          { label: "Значещи цифри", tex: String(significant), tone: "text-minus" },
          { label: "Множител", tex: multiplier >= 1 ? String.raw`\times${multiplier}` : String.raw`\times${decimal(multiplier, 2)}`, tone: "text-plus" },
          { label: "Номинална стойност", tex: ohmLatex(resistance), tone: "text-ok" },
          { label: "Допустим интервал", tex: String.raw`${ohmLatex(minimum)}\ldots${ohmLatex(maximum)}` },
        ]}
      />
      <p className="mt-3 text-[13.5px] text-muted">
        Толеранс: <RichText text={String.raw`$\pm${decimal(tolerance, tolerance < 1 ? 2 : 0)}\%$`} />.
        Цветовете са стандартизирани означения, а не точна екранна проба на боята върху всеки производител.
      </p>
    </div>
  );
}
