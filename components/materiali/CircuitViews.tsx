"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "@/components/interactives/SvgTex";
import {
  BTN_SEC,
  C,
  DRAWING_FONT_FAMILY,
  PANEL_CLASS,
  STAGE_BG,
  STAGE_CLASS,
} from "@/components/interactives/svg";
import { Readouts, decimal } from "@/components/problem-sets/LabShell";
import { RESISTOR_COLORS, type ResistorColorName } from "./resistorPalette";

export type ViewMode = "schematic" | "breadboard";

export const BREADBOARD_GRID = {
  columns: Array.from({ length: 17 }, (_, index) => 72 + index * 26),
  topRows: [126, 148, 170, 192, 214],
  bottomRows: [258, 280, 302, 324, 346],
  topRailRows: [64, 84],
  bottomRailRows: [382, 400],
} as const;

export function ViewTabs({ view, onChange }: { view: ViewMode; onChange: (view: ViewMode) => void }) {
  return (
    <div className="inline-flex overflow-hidden rounded-lg border-[1.5px] border-ink bg-surface" role="group" aria-label="Избор на изглед">
      {(
        [
          ["schematic", "Електрическа схема"],
          ["breadboard", "Breadboard"],
        ] as const
      ).map(([value, label]) => (
        <button
          key={value}
          type="button"
          aria-pressed={view === value}
          onClick={() => onChange(value)}
          className={
            view === value
              ? "cursor-pointer bg-ink px-3.5 py-2 text-[13px] font-bold text-white"
              : "cursor-pointer border-l-[1.5px] border-ink px-3.5 py-2 text-[13px] font-semibold text-ink first:border-l-0 hover:bg-hl"
          }
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function IecResistor({
  x,
  y,
  vertical = false,
  label,
}: {
  x: number;
  y: number;
  vertical?: boolean;
  label: string;
}) {
  if (vertical) {
    return (
      <g>
        <line x1={x} y1={y - 58} x2={x} y2={y - 28} stroke={C.wire} strokeWidth={2.5} />
        <rect x={x - 13} y={y - 28} width={26} height={56} fill={STAGE_BG} stroke={C.wire} strokeWidth={2.5} />
        <line x1={x} y1={y + 28} x2={x} y2={y + 58} stroke={C.wire} strokeWidth={2.5} />
        <SvgTex x={x + 24} y={y} tex={label} color={C.warn} width={42} anchor="start" />
      </g>
    );
  }
  return (
    <g>
      <line x1={x - 62} y1={y} x2={x - 30} y2={y} stroke={C.wire} strokeWidth={2.5} />
      <rect x={x - 30} y={y - 14} width={60} height={28} fill={STAGE_BG} stroke={C.wire} strokeWidth={2.5} />
      <line x1={x + 30} y1={y} x2={x + 62} y2={y} stroke={C.wire} strokeWidth={2.5} />
      <SvgTex x={x} y={y - 28} tex={label} color={C.warn} width={42} anchor="middle" />
    </g>
  );
}

export function PhysicalResistor({
  x1,
  y1,
  x2,
  y2,
  bands,
  label,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  bands: readonly ResistorColorName[];
  label: string;
}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;
  const verticalish = Math.abs(dy) > Math.abs(dx);
  const bodyLength = Math.min(72, length - 28);
  const bandOffsets = bands.length === 4 ? [-23, -10, 3, 23] : [-25, -13, -1, 11, 25];

  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.mut} strokeWidth={2.5} />
      <g transform={`translate(${cx} ${cy}) rotate(${angle})`}>
        <rect
          x={-bodyLength / 2}
          y={-10}
          width={bodyLength}
          height={20}
          rx={9}
          fill={C.warn}
          opacity={0.72}
          stroke={C.wire}
          strokeWidth={1}
        />
        {bands.map((band, index) => (
          <rect
            key={`${band}-${index}`}
            x={bandOffsets[index] - 3}
            y={-10}
            width={6}
            height={20}
            fill={RESISTOR_COLORS[band].hex}
          />
        ))}
      </g>
      <SvgTex
        x={verticalish ? cx + 22 : cx}
        y={verticalish ? cy : cy - 23}
        tex={label}
        color={C.warn}
        width={42}
        anchor={verticalish ? "start" : "middle"}
      />
    </g>
  );
}

export function BreadboardBase() {
  const terminalRows = [...BREADBOARD_GRID.topRows, ...BREADBOARD_GRID.bottomRows];
  const railRows = [...BREADBOARD_GRID.topRailRows, ...BREADBOARD_GRID.bottomRailRows];
  return (
    <g>
      <rect x={34} y={22} width={500} height={396} rx={14} fill={C.wire} fillOpacity={0.1} stroke={C.mut} strokeWidth={2} />
      <line x1={54} y1={44} x2={514} y2={44} stroke={C.plus} strokeWidth={2} opacity={0.9} />
      <line x1={54} y1={102} x2={514} y2={102} stroke={C.minus} strokeWidth={2} opacity={0.9} />
      <line x1={54} y1={366} x2={514} y2={366} stroke={C.plus} strokeWidth={2} opacity={0.9} />
      <line x1={54} y1={416} x2={514} y2={416} stroke={C.minus} strokeWidth={2} opacity={0.9} />
      <rect x={50} y={226} width={468} height={20} rx={3} fill={STAGE_BG} stroke={C.faint} strokeWidth={1.5} />

      {BREADBOARD_GRID.columns.flatMap((x) =>
        terminalRows.map((y) => (
          <rect key={`${x}-${y}`} x={x - 4} y={y - 4} width={8} height={8} rx={1.5} fill={C.faint} />
        )),
      )}
      {BREADBOARD_GRID.columns.flatMap((x) =>
        railRows.map((y) => (
          <rect key={`rail-${x}-${y}`} x={x - 4} y={y - 4} width={8} height={8} rx={1.5} fill={C.faint} />
        )),
      )}

      <text x={48} y={68} textAnchor="middle" fill={C.plus} fontFamily={DRAWING_FONT_FAMILY} fontSize={15} fontWeight={700}>+</text>
      <text x={48} y={88} textAnchor="middle" fill={C.minus} fontFamily={DRAWING_FONT_FAMILY} fontSize={15} fontWeight={700}>−</text>
      <text x={48} y={386} textAnchor="middle" fill={C.plus} fontFamily={DRAWING_FONT_FAMILY} fontSize={15} fontWeight={700}>+</text>
      <text x={48} y={404} textAnchor="middle" fill={C.minus} fontFamily={DRAWING_FONT_FAMILY} fontSize={15} fontWeight={700}>−</text>
      {[
        ["J", BREADBOARD_GRID.topRows[0]],
        ["F", BREADBOARD_GRID.topRows[4]],
        ["E", BREADBOARD_GRID.bottomRows[0]],
        ["A", BREADBOARD_GRID.bottomRows[4]],
      ].map(([label, y]) => (
        <text key={String(label)} x={48} y={Number(y) + 4} textAnchor="middle" fill={C.mut} fontFamily={DRAWING_FONT_FAMILY} fontSize={12} fontWeight={600}>
          {label}
        </text>
      ))}
    </g>
  );
}

type BridgeMode = "balanced" | "unbalanced";
type MeasureTarget = "terminals" | "inside" | "isolated";

export function Dmm({ display = String.raw`\Omega` }: { display?: string }) {
  return (
    <g>
      <rect x={568} y={122} width={126} height={196} rx={14} fill={C.warn} stroke={C.wire} strokeWidth={2} />
      <rect x={585} y={144} width={92} height={52} rx={5} fill={STAGE_BG} stroke={C.wire} strokeWidth={1.5} />
      <SvgTex x={631} y={171} tex={display} color={C.ok} width={58} anchor="middle" />
      <circle cx={631} cy={243} r={28} fill={STAGE_BG} stroke={C.wire} strokeWidth={2} />
      <line x1={631} y1={243} x2={648} y2={228} stroke={C.warn} strokeWidth={3} />
      <circle cx={606} cy={296} r={6} fill={C.wire} />
      <circle cx={658} cy={296} r={6} fill={C.plus} />
      <SvgTex x={606} y={278} tex={String.raw`\mathrm{COM}`} color={C.wire} width={42} anchor="middle" fontSize={10.5} />
      <SvgTex x={658} y={278} tex={String.raw`\Omega`} color={C.plus} width={24} anchor="middle" fontSize={11} />
    </g>
  );
}

function BridgeSchematic({ mode, target }: { mode: BridgeMode; target: MeasureTarget }) {
  const r3Label = mode === "balanced" ? String.raw`R_3` : String.raw`R_3`;
  const r4Label = mode === "balanced" ? String.raw`R_4` : String.raw`R_4`;
  const r5Bottom = target === "isolated" ? 255 : 280;

  const redTarget =
    target === "terminals" ? { x: 555, y: 190 } : { x: 360, y: 105 };
  const blackTarget =
    target === "terminals"
      ? { x: 165, y: 190 }
      : target === "isolated"
        ? { x: 360, y: r5Bottom }
        : { x: 360, y: 280 };

  return (
    <svg viewBox="0 0 720 440" className={STAGE_CLASS} aria-label="Електрическа схема на мостова резисторна мрежа и свързване на мултицет">
      <rect width={720} height={440} fill={STAGE_BG} />
      <path d="M 165 105 V 280 M 555 105 V 280" fill="none" stroke={C.wire} strokeWidth={2.5} />
      <IecResistor x={245} y={105} label={String.raw`R_1`} />
      <IecResistor x={475} y={105} label={String.raw`R_2`} />
      <IecResistor x={245} y={280} label={r3Label} />
      <IecResistor x={475} y={280} label={r4Label} />
      <line x1={165} y1={105} x2={183} y2={105} stroke={C.wire} strokeWidth={2.5} />
      <line x1={307} y1={105} x2={413} y2={105} stroke={C.wire} strokeWidth={2.5} />
      <line x1={537} y1={105} x2={555} y2={105} stroke={C.wire} strokeWidth={2.5} />
      <line x1={165} y1={280} x2={183} y2={280} stroke={C.wire} strokeWidth={2.5} />
      <line x1={307} y1={280} x2={413} y2={280} stroke={C.wire} strokeWidth={2.5} />
      <line x1={537} y1={280} x2={555} y2={280} stroke={C.wire} strokeWidth={2.5} />
      <line x1={360} y1={105} x2={360} y2={134} stroke={C.wire} strokeWidth={2.5} />
      <rect x={347} y={134} width={26} height={92} fill={STAGE_BG} stroke={C.wire} strokeWidth={2.5} />
      <line x1={360} y1={226} x2={360} y2={r5Bottom} stroke={C.wire} strokeWidth={2.5} />
      {target !== "isolated" ? <line x1={360} y1={r5Bottom} x2={360} y2={280} stroke={C.wire} strokeWidth={2.5} /> : null}
      <SvgTex x={385} y={180} tex={String.raw`R_5`} color={C.warn} width={42} />
      {[
        [165, 190, "1"],
        [555, 190, "2"],
        [360, 105, "3"],
        [360, 280, "4"],
      ].map(([x, y, label]) => (
        <g key={label}>
          <circle cx={Number(x)} cy={Number(y)} r={6} fill={C.warn} />
          <SvgTex x={Number(x) + (label === "2" ? 18 : -18)} y={Number(y) - 16} tex={String(label)} color={C.warn} width={20} anchor={label === "2" ? "start" : "end"} />
        </g>
      ))}
      <Dmm />
      <path d={`M 658 296 C 650 360, 620 380, ${redTarget.x} ${redTarget.y}`} fill="none" stroke={C.plus} strokeWidth={3.5} strokeLinecap="round" />
      <path d={`M 606 296 C 560 390, 260 410, ${blackTarget.x} ${blackTarget.y}`} fill="none" stroke={C.wire} strokeWidth={3.5} strokeLinecap="round" />
      <circle cx={redTarget.x} cy={redTarget.y} r={7} fill={C.plus} />
      <circle cx={blackTarget.x} cy={blackTarget.y} r={7} fill={C.wire} />
    </svg>
  );
}

function BridgeBreadboard({ mode, target }: { mode: BridgeMode; target: MeasureTarget }) {
  const leftX = BREADBOARD_GRID.columns[1];
  const middleX = BREADBOARD_GRID.columns[8];
  const rightX = BREADBOARD_GRID.columns[15];
  const topRows = BREADBOARD_GRID.topRows;
  const bottomRows = BREADBOARD_GRID.bottomRows;
  const r3Bands: readonly ResistorColorName[] = mode === "balanced" ? ["brown", "black", "red", "gold"] : ["red", "red", "red", "gold"];
  const r4Bands: readonly ResistorColorName[] = mode === "balanced" ? ["red", "red", "red", "gold"] : ["brown", "black", "red", "gold"];
  const r5Start = { x: middleX, y: topRows[3] };
  const isolatedEnd = { x: middleX + 56, y: 238 };
  const r5End = target === "isolated" ? isolatedEnd : { x: middleX, y: bottomRows[1] };
  const redTarget = target === "terminals" ? { x: rightX, y: topRows[2] } : { x: middleX, y: topRows[2] };
  const blackTarget =
    target === "terminals"
      ? { x: leftX, y: topRows[2] }
      : target === "isolated"
        ? isolatedEnd
        : { x: middleX, y: bottomRows[0] };
  const pointFour = target === "isolated" ? isolatedEnd : { x: middleX, y: bottomRows[0] };

  return (
    <svg viewBox="0 0 720 440" className={STAGE_CLASS} aria-label="Мостова резисторна мрежа върху breadboard и точните места на сондите">
      <rect width={720} height={440} fill={STAGE_BG} />
      <BreadboardBase />
      <path d={`M ${leftX} ${topRows[3]} C ${leftX - 10} 218, ${leftX - 10} 258, ${leftX} ${bottomRows[1]}`} fill="none" stroke={C.plus} strokeWidth={3.5} strokeLinecap="round" />
      <path d={`M ${rightX} ${topRows[3]} C ${rightX + 10} 218, ${rightX + 10} 258, ${rightX} ${bottomRows[1]}`} fill="none" stroke={C.minus} strokeWidth={3.5} strokeLinecap="round" />
      <PhysicalResistor x1={leftX} y1={topRows[1]} x2={middleX} y2={topRows[0]} bands={["brown", "black", "red", "gold"]} label={String.raw`R_1`} />
      <PhysicalResistor x1={middleX} y1={topRows[1]} x2={rightX} y2={topRows[1]} bands={["red", "red", "red", "gold"]} label={String.raw`R_2`} />
      <PhysicalResistor x1={leftX} y1={bottomRows[2]} x2={middleX} y2={bottomRows[2]} bands={r3Bands} label={String.raw`R_3`} />
      <PhysicalResistor x1={middleX} y1={bottomRows[3]} x2={rightX} y2={bottomRows[3]} bands={r4Bands} label={String.raw`R_4`} />
      <PhysicalResistor x1={r5Start.x} y1={r5Start.y} x2={r5End.x} y2={r5End.y} bands={["brown", "black", "red", "gold"]} label={String.raw`R_5`} />
      {[
        [leftX, topRows[2], "1"],
        [rightX, topRows[2], "2"],
        [middleX, topRows[2], "3"],
        [pointFour.x, pointFour.y, "4"],
      ].map(([x, y, label]) => (
        <g key={label}>
          <circle cx={Number(x)} cy={Number(y)} r={6} fill={C.warn} />
          <SvgTex x={Number(x)} y={Number(y) + (label === "4" ? 30 : -26)} tex={String(label)} color={C.warn} width={20} anchor="middle" />
        </g>
      ))}
      <Dmm />
      <path d={`M 658 296 C 620 354, 560 388, ${redTarget.x} ${redTarget.y}`} fill="none" stroke={C.plus} strokeWidth={3.5} strokeLinecap="round" />
      <path d={`M 606 296 C 566 408, 260 420, ${blackTarget.x} ${blackTarget.y}`} fill="none" stroke={C.wire} strokeWidth={3.5} strokeLinecap="round" />
      <circle cx={redTarget.x} cy={redTarget.y} r={7} fill={C.plus} />
      <circle cx={blackTarget.x} cy={blackTarget.y} r={7} fill={C.wire} />
    </svg>
  );
}

function bridgeReading(mode: BridgeMode, target: MeasureTarget) {
  if (target === "isolated") return 1000;
  if (target === "inside") return mode === "balanced" ? 578.947 : 615.385;
  return mode === "balanced" ? 1600 : 1461.538;
}

export function BridgeMeasurementLab() {
  const [view, setView] = useState<ViewMode>("schematic");
  const [mode, setMode] = useState<BridgeMode>("balanced");
  const [target, setTarget] = useState<MeasureTarget>("terminals");
  const reading = bridgeReading(mode, target);

  return (
    <div className={PANEL_CLASS}>
      <p className="text-[11px] font-bold uppercase tracking-[.16em] text-minus">Измервателна лаборатория</p>
      <h3 className="mt-1 font-serif text-[22px] font-bold">Една мрежа, два изгледа</h3>
      <p className="mt-1 text-[14px] text-muted">
        Сменяйте не само схемата, а и въпроса към мултицета. Уредът винаги измерва еквивалентното съпротивление между двете докоснати точки.
      </p>

      <div className="mt-4 grid gap-3">
        <ViewTabs view={view} onChange={setView} />
        <div className="flex flex-wrap gap-2" role="group" aria-label="Подреждане на резисторите">
          <button type="button" aria-pressed={mode === "balanced"} onClick={() => setMode("balanced")} className={mode === "balanced" ? `${BTN_SEC} bg-hl` : BTN_SEC}>
            Балансиран мост
          </button>
          <button type="button" aria-pressed={mode === "unbalanced"} onClick={() => setMode("unbalanced")} className={mode === "unbalanced" ? `${BTN_SEC} bg-hl` : BTN_SEC}>
            Разменете долните резистори
          </button>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Избор на измерване">
          {(
            [
              ["terminals", "Между точки 1 и 2"],
              ["inside", "Върху R₅ във веригата"],
              ["isolated", "R₅ с повдигнат крак"],
            ] as const
          ).map(([value, label]) => (
            <button key={value} type="button" aria-pressed={target === value} onClick={() => setTarget(value)} className={target === value ? `${BTN_SEC} border-minus bg-minus/10 text-minus` : BTN_SEC}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {view === "schematic" ? <BridgeSchematic mode={mode} target={target} /> : <BridgeBreadboard mode={mode} target={target} />}
      </div>

      <Readouts
        columns="sm:grid-cols-3"
        items={[
          { label: "Въпрос към уреда", tex: target === "terminals" ? "R_{12}" : "R_{34}", tone: "text-minus" },
          { label: "Очаквано показание", tex: reading >= 1000 ? String.raw`${decimal(reading / 1000, 3)}\,\mathrm{k\Omega}` : String.raw`${decimal(reading, 0)}\,\Omega`, tone: "text-ok" },
          { label: "Захранване", tex: String.raw`\text{изключено}`, tone: "text-plus" },
        ]}
      />

      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        На breadboard всеки крак, джъмпер и сонда използва отделна дупка. Дупките във всяка
        вертикална група от пет са електрически свързани. При повдигнат крак черната сонда
        докосва свободния метален извод на <RichText text="$R_5$" />.
      </p>
    </div>
  );
}

export function CircuitSymbolStrip() {
  const items = [
    {
      title: "Резистор по IEC",
      caption: "Правоъгълникът е основният символ в задачите и на дъската.",
      drawing: (
        <svg viewBox="0 0 180 90" className={STAGE_CLASS} aria-label="IEC символ на резистор">
          <rect width={180} height={90} fill={STAGE_BG} />
          <line x1={18} y1={45} x2={58} y2={45} stroke={C.wire} strokeWidth={3} />
          <rect x={58} y={30} width={64} height={30} fill={STAGE_BG} stroke={C.wire} strokeWidth={3} />
          <line x1={122} y1={45} x2={162} y2={45} stroke={C.wire} strokeWidth={3} />
          <SvgTex x={90} y={20} tex="R" color={C.warn} width={24} anchor="middle" />
        </svg>
      ),
    },
    {
      title: "Батерия",
      caption: "Дългата пластина е положителният, а късата е отрицателният полюс.",
      drawing: (
        <svg viewBox="0 0 180 90" className={STAGE_CLASS} aria-label="Символ на батерия с дълга и къса пластина">
          <rect width={180} height={90} fill={STAGE_BG} />
          <line x1={18} y1={45} x2={72} y2={45} stroke={C.wire} strokeWidth={3} />
          <line x1={72} y1={18} x2={72} y2={72} stroke={C.wire} strokeWidth={3} />
          <line x1={104} y1={28} x2={104} y2={62} stroke={C.wire} strokeWidth={6} />
          <line x1={104} y1={45} x2={162} y2={45} stroke={C.wire} strokeWidth={3} />
          <SvgTex x={58} y={18} tex="+" color={C.plus} width={20} anchor="middle" />
          <SvgTex x={118} y={18} tex="-" color={C.minus} width={20} anchor="middle" />
        </svg>
      ),
    },
    {
      title: "Омметър",
      caption: "Свързва се между две точки само когато чуждото захранване е премахнато.",
      drawing: (
        <svg viewBox="0 0 180 90" className={STAGE_CLASS} aria-label="Символ на омметър">
          <rect width={180} height={90} fill={STAGE_BG} />
          <line x1={18} y1={45} x2={58} y2={45} stroke={C.wire} strokeWidth={3} />
          <circle cx={90} cy={45} r={31} fill={STAGE_BG} stroke={C.wire} strokeWidth={3} />
          <line x1={121} y1={45} x2={162} y2={45} stroke={C.wire} strokeWidth={3} />
          <SvgTex x={90} y={46} tex={String.raw`\Omega`} color={C.ok} width={30} anchor="middle" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <article key={item.title} className="rounded-[10px] border-[1.5px] border-ink bg-surface p-3 shadow-hard-sm">
          {item.drawing}
          <h3 className="mt-3 font-serif text-[18px] font-bold text-ink">{item.title}</h3>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">{item.caption}</p>
        </article>
      ))}
    </div>
  );
}
