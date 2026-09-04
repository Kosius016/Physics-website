"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "@/components/interactives/SvgTex";
import {
  C,
  PANEL_CLASS,
  STAGE_BG,
  STAGE_CLASS,
} from "@/components/interactives/svg";
import {
  BREADBOARD_GRID,
  BreadboardBase,
  Dmm,
  IecResistor,
  PhysicalResistor,
  ViewTabs,
  type ViewMode,
} from "@/components/materiali/CircuitViews";
import { RangeControl, Readouts, decimal } from "@/components/problem-sets/LabShell";

type NetworkMode = "series" | "parallel" | "mixed";

const NETWORKS: Record<NetworkMode, { label: string; equivalent: number }> = {
  series: { label: "Последователно", equivalent: 6500 },
  parallel: { label: "Успоредно", equivalent: 1 / (1 / 1000 + 1 / 2200 + 1 / 3300) },
  mixed: { label: "Смесено", equivalent: 1000 + 1 / (1 / 2200 + 1 / 3300) },
};

const BANDS = {
  r1: ["brown", "black", "red", "gold"],
  r2: ["red", "red", "red", "gold"],
  r3: ["orange", "orange", "red", "gold"],
} as const;

function MeterLeads({ redX, redY, blackX, blackY }: { redX: number; redY: number; blackX: number; blackY: number }) {
  return (
    <g>
      <path d={`M 658 296 C 640 360, 570 390, ${redX} ${redY}`} fill="none" stroke={C.plus} strokeWidth={3.5} strokeLinecap="round" />
      <path d={`M 606 296 C 560 414, 235 420, ${blackX} ${blackY}`} fill="none" stroke={C.wire} strokeWidth={3.5} strokeLinecap="round" />
      <circle cx={redX} cy={redY} r={7} fill={C.plus} />
      <circle cx={blackX} cy={blackY} r={7} fill={C.wire} />
    </g>
  );
}

function SeriesParallelSchematic({ mode }: { mode: NetworkMode }) {
  return (
    <svg viewBox="0 0 720 440" className={STAGE_CLASS} aria-label={`Електрическа схема на ${NETWORKS[mode].label.toLowerCase()} свързани резистори и омметър`}>
      <rect width={720} height={440} fill={STAGE_BG} />
      {mode === "series" ? (
        <g>
          <line x1={100} y1={190} x2={113} y2={190} stroke={C.wire} strokeWidth={2.5} />
          <IecResistor x={175} y={190} label={String.raw`R_1`} />
          <IecResistor x={300} y={190} label={String.raw`R_2`} />
          <IecResistor x={425} y={190} label={String.raw`R_3`} />
          <line x1={487} y1={190} x2={520} y2={190} stroke={C.wire} strokeWidth={2.5} />
        </g>
      ) : mode === "parallel" ? (
        <g>
          <line x1={120} y1={92} x2={120} y2={288} stroke={C.wire} strokeWidth={2.5} />
          <line x1={500} y1={92} x2={500} y2={288} stroke={C.wire} strokeWidth={2.5} />
          {[110, 190, 270].map((y, index) => (
            <g key={y}>
              <line x1={120} y1={y} x2={248} y2={y} stroke={C.wire} strokeWidth={2.5} />
              <IecResistor x={310} y={y} label={String.raw`R_${index + 1}`} />
              <line x1={372} y1={y} x2={500} y2={y} stroke={C.wire} strokeWidth={2.5} />
            </g>
          ))}
        </g>
      ) : (
        <g>
          <line x1={100} y1={190} x2={138} y2={190} stroke={C.wire} strokeWidth={2.5} />
          <IecResistor x={200} y={190} label={String.raw`R_1`} />
          <line x1={262} y1={190} x2={300} y2={190} stroke={C.wire} strokeWidth={2.5} />
          <line x1={300} y1={120} x2={300} y2={260} stroke={C.wire} strokeWidth={2.5} />
          <line x1={500} y1={120} x2={500} y2={260} stroke={C.wire} strokeWidth={2.5} />
          <line x1={300} y1={130} x2={338} y2={130} stroke={C.wire} strokeWidth={2.5} />
          <IecResistor x={400} y={130} label={String.raw`R_2`} />
          <line x1={462} y1={130} x2={500} y2={130} stroke={C.wire} strokeWidth={2.5} />
          <line x1={300} y1={250} x2={338} y2={250} stroke={C.wire} strokeWidth={2.5} />
          <IecResistor x={400} y={250} label={String.raw`R_3`} />
          <line x1={462} y1={250} x2={500} y2={250} stroke={C.wire} strokeWidth={2.5} />
          <line x1={500} y1={190} x2={520} y2={190} stroke={C.wire} strokeWidth={2.5} />
          <circle cx={300} cy={190} r={5} fill={C.warn} />
        </g>
      )}
      <circle cx={100} cy={190} r={6} fill={C.warn} />
      <circle cx={520} cy={190} r={6} fill={C.warn} />
      <SvgTex x={84} y={170} tex="1" color={C.warn} width={20} anchor="end" />
      <SvgTex x={536} y={170} tex="2" color={C.warn} width={20} />
      <Dmm />
      <MeterLeads redX={520} redY={190} blackX={100} blackY={190} />
    </svg>
  );
}

function SeriesParallelBreadboard({ mode }: { mode: NetworkMode }) {
  const left = BREADBOARD_GRID.columns[1];
  const firstJoint = BREADBOARD_GRID.columns[5];
  const secondJoint = BREADBOARD_GRID.columns[10];
  const middle = BREADBOARD_GRID.columns[7];
  const right = BREADBOARD_GRID.columns[15];
  const rows = BREADBOARD_GRID.topRows;
  const probeTargets =
    mode === "series"
      ? { black: { x: left, y: rows[3] }, red: { x: right, y: rows[1] } }
      : mode === "parallel"
        ? { black: { x: left, y: rows[3] }, red: { x: right, y: rows[3] } }
        : { black: { x: left, y: rows[0] }, red: { x: right, y: rows[2] } };
  return (
    <svg viewBox="0 0 720 440" className={STAGE_CLASS} aria-label={`Breadboard монтаж на ${NETWORKS[mode].label.toLowerCase()} свързани резистори и точките за омметъра`}>
      <rect width={720} height={440} fill={STAGE_BG} />
      <BreadboardBase />
      {mode === "series" ? (
        <g>
          <PhysicalResistor x1={left} y1={rows[1]} x2={firstJoint} y2={rows[1]} bands={BANDS.r1} label={String.raw`R_1`} />
          <PhysicalResistor x1={firstJoint} y1={rows[2]} x2={secondJoint} y2={rows[2]} bands={BANDS.r2} label={String.raw`R_2`} />
          <PhysicalResistor x1={secondJoint} y1={rows[3]} x2={right} y2={rows[3]} bands={BANDS.r3} label={String.raw`R_3`} />
        </g>
      ) : mode === "parallel" ? (
        <g>
          <PhysicalResistor x1={left} y1={rows[0]} x2={right} y2={rows[0]} bands={BANDS.r1} label={String.raw`R_1`} />
          <PhysicalResistor x1={left} y1={rows[2]} x2={right} y2={rows[2]} bands={BANDS.r2} label={String.raw`R_2`} />
          <PhysicalResistor x1={left} y1={rows[4]} x2={right} y2={rows[4]} bands={BANDS.r3} label={String.raw`R_3`} />
        </g>
      ) : (
        <g>
          <PhysicalResistor x1={left} y1={rows[2]} x2={middle} y2={rows[2]} bands={BANDS.r1} label={String.raw`R_1`} />
          <PhysicalResistor x1={middle} y1={rows[0]} x2={right} y2={rows[0]} bands={BANDS.r2} label={String.raw`R_2`} />
          <PhysicalResistor x1={middle} y1={rows[4]} x2={right} y2={rows[4]} bands={BANDS.r3} label={String.raw`R_3`} />
        </g>
      )}
      <circle cx={probeTargets.black.x} cy={probeTargets.black.y} r={6} fill={C.warn} />
      <circle cx={probeTargets.red.x} cy={probeTargets.red.y} r={6} fill={C.warn} />
      <SvgTex x={probeTargets.black.x} y={probeTargets.black.y - 26} tex="1" color={C.warn} width={20} anchor="middle" />
      <SvgTex x={probeTargets.red.x} y={probeTargets.red.y - 26} tex="2" color={C.warn} width={20} anchor="middle" />
      <Dmm />
      <MeterLeads redX={probeTargets.red.x} redY={probeTargets.red.y} blackX={probeTargets.black.x} blackY={probeTargets.black.y} />
    </svg>
  );
}

export function SeriesParallelLab() {
  const [view, setView] = useState<ViewMode>("schematic");
  const [mode, setMode] = useState<NetworkMode>("mixed");
  const equivalent = NETWORKS[mode].equivalent;

  return (
    <div className={PANEL_CLASS}>
      <p className="text-[11px] font-bold uppercase tracking-[.16em] text-minus">Измервателна задача</p>
      <h3 className="mt-1 font-serif text-[22px] font-bold">Три резистора, три различни въпроса</h3>
      <p className="mt-1 text-[14px] text-muted">
        Подредете едни и същи резистори по три начина. Предскажете показанието, след това сглобете точно breadboard изгледа и измерете между означените точки.
      </p>
      <div className="mt-4 grid gap-3">
        <ViewTabs view={view} onChange={setView} />
        <div className="flex flex-wrap gap-2" role="group" aria-label="Топология на мрежата">
          {(Object.keys(NETWORKS) as NetworkMode[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={mode === key}
              onClick={() => setMode(key)}
              className={mode === key ? "cursor-pointer rounded-lg border-[1.5px] border-ink bg-ink px-3.5 py-2 text-[13px] font-bold text-white shadow-hard-sm" : "cursor-pointer rounded-lg border-[1.5px] border-ink bg-surface px-3.5 py-2 text-[13px] font-semibold text-ink shadow-hard-sm hover:bg-hl"}
            >
              {NETWORKS[key].label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4">
        {view === "schematic" ? <SeriesParallelSchematic mode={mode} /> : <SeriesParallelBreadboard mode={mode} />}
      </div>
      <Readouts
        columns="sm:grid-cols-4"
        items={[
          { label: "$R_1$", tex: String.raw`1{,}0\,\mathrm{k\Omega}` },
          { label: "$R_2$", tex: String.raw`2{,}2\,\mathrm{k\Omega}` },
          { label: "$R_3$", tex: String.raw`3{,}3\,\mathrm{k\Omega}` },
          {
            label: "Очаквано $R_{12}$",
            tex: equivalent >= 1000 ? String.raw`${decimal(equivalent / 1000, 3)}\,\mathrm{k\Omega}` : String.raw`${decimal(equivalent, 0)}\,\Omega`,
            tone: "text-ok",
          },
        ]}
      />
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        Мултицетът е в режим за съпротивление и няма свързано захранване. Всеки крак и всяка
        сонда са в отделна дупка. Еднаквата колона свързва дупките в група от пет.
      </p>
    </div>
  );
}

function finiteLadder(cells: number, resistance: number) {
  let equivalent = 2 * resistance;
  for (let index = 2; index <= cells; index += 1) {
    equivalent = resistance + (resistance * equivalent) / (resistance + equivalent);
  }
  return equivalent;
}

function LadderSchematic({ cells }: { cells: number }) {
  const inputX = 76;
  const lastX = 510;
  const step = (lastX - inputX) / cells;
  const top = 108;
  const bottom = 278;
  const nodes = Array.from({ length: cells + 1 }, (_, index) => inputX + index * step);
  return (
    <svg viewBox="0 0 720 440" className={STAGE_CLASS} aria-label={`Електрическа схема на резисторна стълба с ${cells} клетки и свързан омметър`}>
      <rect width={720} height={440} fill={STAGE_BG} />
      <line x1={inputX} y1={bottom} x2={lastX} y2={bottom} stroke={C.wire} strokeWidth={2.5} />
      {nodes.slice(1).map((x, index) => {
        const previous = nodes[index];
        const center = (previous + x) / 2;
        const bodyWidth = Math.min(44, step * 0.56);
        return (
          <g key={x}>
            <line x1={previous} y1={top} x2={center - bodyWidth / 2} y2={top} stroke={C.wire} strokeWidth={2.5} />
            <rect x={center - bodyWidth / 2} y={top - 12} width={bodyWidth} height={24} fill={STAGE_BG} stroke={C.wire} strokeWidth={2.5} />
            <line x1={center + bodyWidth / 2} y1={top} x2={x} y2={top} stroke={C.wire} strokeWidth={2.5} />
            <line x1={x} y1={top} x2={x} y2={(top + bottom) / 2 - 24} stroke={C.wire} strokeWidth={2.5} />
            <rect x={x - 12} y={(top + bottom) / 2 - 24} width={24} height={48} fill={STAGE_BG} stroke={C.wire} strokeWidth={2.5} />
            <line x1={x} y1={(top + bottom) / 2 + 24} x2={x} y2={bottom} stroke={C.wire} strokeWidth={2.5} />
            <circle cx={x} cy={top} r={4.5} fill={C.warn} />
          </g>
        );
      })}
      <SvgTex x={inputX} y={78} tex="1" color={C.warn} width={20} anchor="middle" />
      <SvgTex x={inputX} y={306} tex="2" color={C.warn} width={20} anchor="middle" />
      <SvgTex x={292} y={58} tex={String.raw`R`} color={C.warn} width={24} anchor="middle" />
      <SvgTex x={292} y={336} tex={String.raw`\text{всички резистори са еднакви}`} color={C.mut} width={228} anchor="middle" fontSize={12} />
      <Dmm />
      <MeterLeads redX={inputX} redY={top} blackX={inputX} blackY={bottom} />
    </svg>
  );
}

function LadderBreadboard({ cells }: { cells: number }) {
  const nodes = [0, 3, 6, 9, 12, 15]
    .slice(0, cells + 1)
    .map((index) => BREADBOARD_GRID.columns[index]);
  const inputX = nodes[0];
  const topRows = BREADBOARD_GRID.topRows;
  const bottomRows = BREADBOARD_GRID.bottomRows;
  const groundRailY = BREADBOARD_GRID.bottomRailRows[1];
  return (
    <svg viewBox="0 0 720 440" className={STAGE_CLASS} aria-label={`Breadboard монтаж на резисторна стълба с ${cells} клетки и точките за омметъра`}>
      <rect width={720} height={440} fill={STAGE_BG} />
      <BreadboardBase />
      {nodes.slice(1).map((x, index) => (
        <g key={x}>
          <PhysicalResistor x1={nodes[index]} y1={topRows[1]} x2={x} y2={topRows[0]} bands={BANDS.r1} label={String.raw`R`} />
          <PhysicalResistor x1={x} y1={topRows[4]} x2={x} y2={bottomRows[2]} bands={BANDS.r1} label={String.raw`R`} />
          <path d={`M ${x} ${bottomRows[3]} C ${x + 9} 344, ${x + 9} 382, ${x} ${groundRailY}`} fill="none" stroke={C.minus} strokeWidth={3.2} strokeLinecap="round" />
          <circle cx={x} cy={topRows[2]} r={5} fill={C.warn} />
        </g>
      ))}
      <circle cx={inputX} cy={topRows[3]} r={6} fill={C.warn} />
      <circle cx={inputX} cy={groundRailY} r={6} fill={C.warn} />
      <SvgTex x={inputX} y={topRows[3] - 26} tex="1" color={C.warn} width={20} anchor="middle" />
      <SvgTex x={inputX - 18} y={groundRailY} tex="2" color={C.warn} width={20} anchor="end" />
      <Dmm />
      <MeterLeads redX={inputX} redY={topRows[3]} blackX={inputX} blackY={groundRailY} />
    </svg>
  );
}

export function GoldenRatioLadderLab() {
  const [view, setView] = useState<ViewMode>("schematic");
  const [cells, setCells] = useState(4);
  const resistance = 1000;
  const equivalent = finiteLadder(cells, resistance);
  const phi = (1 + Math.sqrt(5)) / 2;
  const relativeError = Math.abs(equivalent / resistance - phi) / phi;

  return (
    <div className={PANEL_CLASS}>
      <p className="text-[11px] font-bold uppercase tracking-[.16em] text-minus">Крайна стълба към безкраен предел</p>
      <h3 className="mt-1 font-serif text-[22px] font-bold">Как безкрайността се побира на breadboard</h3>
      <p className="mt-1 text-[14px] text-muted">
        Добавяйте еднакви клетки. Измеримата крайна мрежа се приближава бързо до резултата на безкрайната задача.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <ViewTabs view={view} onChange={setView} />
        <RangeControl
          label="Брой клетки"
          value={cells}
          min={1}
          max={5}
          step={1}
          valueLabel={<RichText text={`$N=${cells}$`} />}
          onChange={setCells}
        />
      </div>
      <div className="mt-4">
        {view === "schematic" ? <LadderSchematic cells={cells} /> : <LadderBreadboard cells={cells} />}
      </div>
      <Readouts
        columns="sm:grid-cols-4"
        items={[
          { label: "Един резистор", tex: String.raw`R=1{,}00\,\mathrm{k\Omega}` },
          { label: "Брой клетки", tex: `N=${cells}`, tone: "text-minus" },
          { label: "Измерим резултат", tex: String.raw`R_N=${decimal(equivalent / 1000, 4)}\,\mathrm{k\Omega}`, tone: "text-ok" },
          { label: "Грешка спрямо $\varphi R$", tex: String.raw`${decimal(relativeError * 100, 3)}\%`, tone: "text-plus" },
        ]}
      />
    </div>
  );
}
