"use client";

import { useEffect, useRef, useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import {
  Arrow,
  BTN_PRI,
  BTN_SEC,
  C,
  DRAWING_FONT_FAMILY,
  PANEL_CLASS,
  STAGE_BG,
  STAGE_CLASS,
} from "./svg";

const W = 720;
const H = 360;
const MU_0 = 4 * Math.PI * 1e-7;
const q = (value: number) => Math.round(value * 1000) / 1000;
const bg = (value: number, digits = 2) => value.toFixed(digits).replace(".", "{,}");
const DRAWING_STYLE = { fontFamily: DRAWING_FONT_FAMILY } as const;

function Stage({ title }: { title: string }) {
  return (
    <>
      <rect width={W} height={H} fill={STAGE_BG} />
      {Array.from({ length: Math.ceil(W / 25) }, (_, i) => (
        <line
          key={`v-${i}`}
          x1={i * 25}
          y1="0"
          x2={i * 25}
          y2={H}
          stroke={C.faint}
          opacity="0.1"
        />
      ))}
      {Array.from({ length: Math.ceil(H / 25) }, (_, i) => (
        <line
          key={`h-${i}`}
          x1="0"
          y1={i * 25}
          x2={W}
          y2={i * 25}
          stroke={C.faint}
          opacity="0.1"
        />
      ))}
      <text
        x="24"
        y="30"
        fill={C.mut}
        fontSize="12"
        fontWeight="600"
        letterSpacing="0.035em"
      >
        {title}
      </text>
    </>
  );
}

function Readout({
  cells,
}: {
  cells: { label: string; tex: string; color: string }[];
}) {
  return (
    <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule lg:grid-cols-4">
      {cells.map((cell) => (
        <div key={cell.label} className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">
            {cell.label}
          </dt>
          <dd
            className="mt-0.5 text-[15px] font-bold tabular-nums"
            style={{ color: cell.color }}
          >
            <RichText text={cell.tex} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Solenoid({
  x,
  y,
  turns = 12,
  width = 250,
  height = 132,
}: {
  x: number;
  y: number;
  turns?: number;
  width?: number;
  height?: number;
}) {
  return (
    <g>
      {Array.from({ length: turns }, (_, i) => (
        <ellipse
          key={i}
          cx={x + (i * width) / (turns - 1)}
          cy={y}
          rx="20"
          ry={height / 2}
          fill="none"
          stroke={C.warn}
          strokeWidth="3.2"
        />
      ))}
    </g>
  );
}

function Coil({
  x,
  y,
  turns = 7,
  color = C.warn,
}: {
  x: number;
  y: number;
  turns?: number;
  color?: string;
}) {
  return (
    <g>
      {Array.from({ length: turns }, (_, i) => (
        <ellipse
          key={i}
          cx={x + i * 5}
          cy={y}
          rx="25"
          ry="79"
          fill="none"
          stroke={color}
          strokeWidth="3"
        />
      ))}
    </g>
  );
}

function makePath(
  samples: number,
  point: (index: number) => [number, number],
) {
  return Array.from({ length: samples }, (_, index) => {
    const [x, y] = point(index);
    return `${index === 0 ? "M" : "L"} ${q(x)} ${q(y)}`;
  }).join(" ");
}

export function SelfInductionLab() {
  const [current, setCurrent] = useState(3);
  const [rate, setRate] = useState(4);
  const inductance = 0.18;
  const emf = -inductance * rate;
  const fieldOpacity = 0.25 + 0.65 * (current / 6);
  const emfRight = rate < 0;

  return (
    <div className={PANEL_CLASS}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={`${STAGE_CLASS} select-none`}
        style={DRAWING_STYLE}
        role="img"
        aria-label="Самоиндукция в соленоид при нарастващ или намаляващ ток"
      >
        <Stage title="САМОИНДУКЦИЯ · ПРОМЯНАТА НА ТОКА ПОРАЖДА ОБРАТНО ЕДН" />

        <Solenoid x={235} y={182} />
        <line x1="92" y1="116" x2="215" y2="116" stroke={C.wire} strokeWidth="4" />
        <line x1="505" y1="116" x2="625" y2="116" stroke={C.wire} strokeWidth="4" />
        <line x1="92" y1="248" x2="215" y2="248" stroke={C.wire} strokeWidth="4" />
        <line x1="505" y1="248" x2="625" y2="248" stroke={C.wire} strokeWidth="4" />
        <line x1="92" y1="116" x2="92" y2="248" stroke={C.wire} strokeWidth="4" />
        <line x1="625" y1="116" x2="625" y2="156" stroke={C.wire} strokeWidth="4" />
        <line x1="625" y1="208" x2="625" y2="248" stroke={C.wire} strokeWidth="4" />
        <line x1="605" y1="168" x2="645" y2="168" stroke={C.plus} strokeWidth="4" />
        <line x1="612" y1="196" x2="638" y2="196" stroke={C.minus} strokeWidth="3" />

        {current > 0.05 && (
          <>
            <Arrow
              x1={120}
              y1={92}
              x2={205}
              y2={92}
              color={C.warn}
              width={3}
              texLabel="I"
              texLabelDy={-12}
              texLabelWidth={20}
            />
            {[0, 1, 2].map((index) => (
              <g key={index} opacity={fieldOpacity}>
                <Arrow
                  x1={265}
                  y1={158 + index * 24}
                  x2={475}
                  y2={158 + index * 24}
                  color={C.minus}
                  width={1.8}
                />
              </g>
            ))}
            <SvgTex
              x={370}
              y={139}
              tex="\vec B"
              color={C.minus}
              fontSize={15}
              width={34}
              anchor="middle"
            />
          </>
        )}

        {Math.abs(rate) > 0.05 && (
          <Arrow
            x1={emfRight ? 320 : 415}
            y1={286}
            x2={emfRight ? 415 : 320}
            y2={286}
            color={C.plus}
            width={3}
            texLabel="\mathcal{E}_L"
            texLabelDy={16}
            texLabelWidth={42}
          />
        )}
        <SvgTex x={512} y={183} tex="L" color={C.warn} fontSize={17} width={22} />
        <text x="370" y="326" textAnchor="middle" fill={C.mut} fontSize="12" fontWeight="600">
          ОБРАТНОТО ЕДН СЕ ПРОТИВОПОСТАВЯ НА ПРОМЯНАТА
        </text>
      </svg>

      <Readout
        cells={[
          { label: "Ток", tex: `$I=${bg(current)}\\,\\mathrm{A}$`, color: C.warn },
          {
            label: "Скорост на промяна",
            tex: `$dI/dt=${bg(rate)}\\,\\mathrm{A/s}$`,
            color: rate >= 0 ? C.ok : C.plus,
          },
          {
            label: "Индуктивност",
            tex: `$L=${bg(inductance * 1000, 0)}\\,\\mathrm{mH}$`,
            color: C.minus,
          },
          {
            label: "Самоиндуцирано ЕДН",
            tex: `$\\mathcal{E}_L=${bg(emf)}\\,\\mathrm{V}$`,
            color: C.plus,
          },
        ]}
      />

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-[13px] font-medium text-muted">
          <span className="flex justify-between gap-3">
            <span>Ток <RichText text="$I$" /></span>
            <strong className="text-minus"><RichText text={`$${bg(current)}\\,\\mathrm{A}$`} /></strong>
          </span>
          <input
            className="w-full accent-(--color-minus)"
            type="range"
            min="0"
            max="6"
            step="0.1"
            value={current}
            onChange={(event) => setCurrent(+event.target.value)}
          />
        </label>
        <label className="text-[13px] font-medium text-muted">
          <span className="flex justify-between gap-3">
            <span>Промяна <RichText text="$dI/dt$" /></span>
            <strong className="text-minus">
              <RichText text={`$${bg(rate)}\\,\\mathrm{A/s}$`} />
            </strong>
          </span>
          <input
            className="w-full accent-(--color-minus)"
            type="range"
            min="-10"
            max="10"
            step="0.5"
            value={rate}
            onChange={(event) => setRate(+event.target.value)}
          />
        </label>
      </div>
      <p className="mt-3 text-[13.5px] text-muted">
        <RichText text="Това е моментна снимка: $I$ и $dI/dt$ са независими моментни величини. Първо задръжте $dI/dt$ и променете $I$. Ще видите, че $\mathcal E_L$ не се изменя. После преместете $dI/dt$ през нулата. При $dI/dt>0$ намотката се противопоставя на нарастването; при $dI/dt<0$ тя поддържа стария ток. При постоянен ток $dI/dt=0$ и самоиндуцираното ЕДН изчезва, въпреки че полето остава." />
      </p>
    </div>
  );
}

export function RLCircuitLab() {
  const [mode, setMode] = useState<"growth" | "decay">("growth");
  const [timeMs, setTimeMs] = useState(5);
  const [resistance, setResistance] = useState(6);
  const [inductanceMh, setInductanceMh] = useState(30);
  const epsilon = 12;
  const tauMs = inductanceMh / resistance;
  const steadyCurrent = epsilon / resistance;
  const timeRatio = timeMs / tauMs;
  const normalizedCurrent =
    mode === "growth" ? 1 - Math.exp(-timeRatio) : Math.exp(-timeRatio);
  const current = steadyCurrent * normalizedCurrent;
  const resistorVoltage = current * resistance;
  const inductorVoltage =
    mode === "growth" ? epsilon - resistorVoltage : -resistorVoltage;

  const maxTimeMs = 50;
  const left = 64;
  const right = 498;
  const top = 56;
  const bottom = 290;
  const gx = (time: number) => left + ((right - left) * time) / maxTimeMs;
  const gy = (value: number) => bottom - value * (bottom - top - 16);
  const curve = makePath(151, (index) => {
    const sampleTime = (maxTimeMs * index) / 150;
    const sampleRatio = sampleTime / tauMs;
    const value =
      mode === "growth" ? 1 - Math.exp(-sampleRatio) : Math.exp(-sampleRatio);
    return [gx(sampleTime), gy(value)];
  });
  const voltageOrigin = 590;
  const voltageScale = 6.5;
  const voltageBar = (value: number) => ({
    x: value >= 0 ? voltageOrigin : voltageOrigin + value * voltageScale,
    width: Math.abs(value) * voltageScale,
  });
  const resistorBar = voltageBar(resistorVoltage);
  const inductorBar = voltageBar(inductorVoltage);

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          className={mode === "growth" ? BTN_PRI : BTN_SEC}
          onClick={() => setMode("growth")}
        >
          Включване
        </button>
        <button
          type="button"
          className={mode === "decay" ? BTN_PRI : BTN_SEC}
          onClick={() => setMode("decay")}
        >
          Изключване
        </button>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={`${STAGE_CLASS} select-none`}
        style={DRAWING_STYLE}
        role="img"
        aria-label="Графика на тока във времето при включване и изключване на RL контур"
      >
        <Stage title="RL КОНТУР · ЕКСПОНЕНЦИАЛЕН ОТГОВОР" />
        <Arrow x1={left} y1={bottom} x2={right} y2={bottom} color={C.mut} width={1.5} />
        <Arrow x1={left} y1={bottom} x2={left} y2={top} color={C.mut} width={1.5} />
        <SvgTex
          x={right - 4}
          y={bottom + 46}
          tex="t\;(\mathrm{ms})"
          color={C.mut}
          fontSize={13}
          width={76}
          anchor="end"
        />
        <SvgTex
          x={left - 12}
          y={top + 4}
          tex="I/I_\infty"
          color={C.mut}
          fontSize={13}
          width={54}
          anchor="end"
        />
        <line
          x1={gx(tauMs)}
          y1={top}
          x2={gx(tauMs)}
          y2={bottom}
          stroke={C.warn}
          strokeWidth="1.5"
          strokeDasharray="5 5"
        />
        <SvgTex
          x={gx(tauMs) + 14}
          y={top + 18}
          tex="\tau"
          color={C.warn}
          fontSize={13}
          width={24}
          anchor="start"
        />
        <line
          x1={left}
          y1={gy(1)}
          x2={right}
          y2={gy(1)}
          stroke={C.faint}
          strokeWidth="1.2"
          strokeDasharray="4 5"
        />
        {[0, 25, 50].map((tick) => (
          <SvgTex
            key={tick}
            x={gx(tick)}
            y={bottom + 22}
            tex={String(tick)}
            color={C.mut}
            fontSize={11.5}
            width={24}
            anchor="middle"
          />
        ))}
        <path d={curve} fill="none" stroke={C.ok} strokeWidth="3.2" />
        <circle
          cx={gx(timeMs)}
          cy={gy(normalizedCurrent)}
          r="6"
          fill={C.warn}
          stroke={STAGE_BG}
          strokeWidth="2"
        />
        <SvgTex
          x={right - 18}
          y={mode === "growth" ? gy(0.86) : gy(0.18)}
          tex={
            mode === "growth"
              ? String.raw`I(t)=I_\infty(1-e^{-t/\tau})`
              : String.raw`I(t)=I_0e^{-t/\tau}`
          }
          color={C.ok}
          fontSize={14}
          width={190}
          anchor="end"
        />
        <line
          x1={voltageOrigin}
          y1="72"
          x2={voltageOrigin}
          y2="282"
          stroke={C.faint}
          strokeWidth="1.4"
          strokeDasharray="4 4"
        />
        <SvgTex
          x={voltageOrigin}
          y={62}
          tex="V\;(\mathrm V)"
          color={C.mut}
          fontSize={12.5}
          width={66}
          anchor="middle"
        />
        <SvgTex x={532} y={99} tex="V_R" color={C.warn} fontSize={14} width={32} anchor="middle" />
        <rect
          x={resistorBar.x}
          y="112"
          width={resistorBar.width}
          height="32"
          rx="4"
          fill={C.warn}
          fillOpacity="0.82"
        />
        <SvgTex x={532} y={193} tex="V_L" color={C.minus} fontSize={14} width={32} anchor="middle" />
        <rect
          x={inductorBar.x}
          y="206"
          width={inductorBar.width}
          height="32"
          rx="4"
          fill={C.minus}
          fillOpacity="0.82"
        />
        <SvgTex x={voltageOrigin + 9} y={303} tex="+" color={C.ok} fontSize={13} width={18} />
        <SvgTex x={voltageOrigin - 9} y={303} tex="-" color={C.plus} fontSize={13} width={18} anchor="end" />
      </svg>

      <Readout
        cells={[
          {
            label: "Времеконстанта",
            tex: `$\\tau=${bg(tauMs)}\\,\\mathrm{ms}$`,
            color: C.warn,
          },
          {
            label: "Текущ ток",
            tex: `$I(t)=${bg(current, 3)}\\,\\mathrm{A}$`,
            color: C.ok,
          },
          {
            label: "Върху резистора",
            tex: `$V_R=${bg(resistorVoltage, 2)}\\,\\mathrm V$`,
            color: C.warn,
          },
          {
            label: "Върху намотката",
            tex: `$V_L=${bg(inductorVoltage, 2)}\\,\\mathrm V$`,
            color: C.minus,
          },
        ]}
      />

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <label className="text-[13px] font-medium text-muted">
          <span className="flex justify-between gap-2">
            <span>Време</span>
            <strong className="text-minus">
              <RichText
                text={`$t=${bg(timeMs, 1)}\\,\\mathrm{ms}=${bg(timeRatio, 2)}\\tau$`}
              />
            </strong>
          </span>
          <input
            className="w-full accent-(--color-minus)"
            type="range"
            min="0"
            max={maxTimeMs}
            step="0.5"
            value={timeMs}
            onChange={(event) => setTimeMs(+event.target.value)}
          />
        </label>
        <label className="text-[13px] font-medium text-muted">
          <span className="flex justify-between gap-2">
            <RichText text="Съпротивление $R$" />
            <strong className="text-minus">
              <RichText text={`$${bg(resistance)}\\,\\Omega$`} />
            </strong>
          </span>
          <input
            className="w-full accent-(--color-minus)"
            type="range"
            min="2"
            max="12"
            step="0.5"
            value={resistance}
            onChange={(event) => setResistance(+event.target.value)}
          />
        </label>
        <label className="text-[13px] font-medium text-muted">
          <span className="flex justify-between gap-2">
            <RichText text="Индуктивност $L$" />
            <strong className="text-minus">
              <RichText text={`$${bg(inductanceMh, 0)}\\,\\mathrm{mH}$`} />
            </strong>
          </span>
          <input
            className="w-full accent-(--color-minus)"
            type="range"
            min="10"
            max="80"
            step="2"
            value={inductanceMh}
            onChange={(event) => setInductanceMh(+event.target.value)}
          />
        </label>
      </div>
      <p className="mt-3 text-[13.5px] text-muted">
        <RichText text={`Хоризонталната ос вече е реално време, затова промяната на $R$ или $L$ видимо премества $\\tau=L/R$ и разтяга кривата. Жълтата и синята лента показват $V_R$ и $V_L$: при включване $V_R+V_L=${epsilon}\\,\\mathrm V$, а при затихване $V_R+V_L=0$. При $t=\\tau$ токът е $63{,}2\\%$ от $I_\\infty=${bg(steadyCurrent)}\\,\\mathrm A$ или е останал $36{,}8\\%$ от $I_0$.`} />
      </p>
    </div>
  );
}

export function MagneticEnergyLab() {
  const [current, setCurrent] = useState(3);
  const turns = 300;
  const length = 0.25;
  const area = 4e-4;
  const n = turns / length;
  const inductance = (MU_0 * turns * turns * area) / length;
  const field = MU_0 * n * current;
  const energy = 0.5 * inductance * current * current;
  const density = (field * field) / (2 * MU_0);
  const fieldLines = Math.max(1, Math.round(1 + current));

  return (
    <div className={PANEL_CLASS}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={`${STAGE_CLASS} select-none`}
        style={DRAWING_STYLE}
        role="img"
        aria-label="Енергия в магнитното поле на соленоид"
      >
        <Stage title="БАТЕРИЯ → МАГНИТНО ПОЛЕ · ЕНЕРГИЯТА СЕ НАТРУПВА В ОБЕМА" />
        <Solenoid x={250} y={180} turns={13} width={270} height={150} />
        <rect
          x="250"
          y="112"
          width="270"
          height="136"
          rx="68"
          fill={C.minus}
          fillOpacity={0.05 + current * 0.018}
        />
        {Array.from({ length: fieldLines }, (_, index) => {
          const y = 138 + (index * 84) / Math.max(1, fieldLines - 1);
          return (
            <Arrow
              key={index}
              x1={274}
              y1={y}
              x2={496}
              y2={y}
              color={C.minus}
              width={1.4 + current * 0.08}
            />
          );
        })}
        <SvgTex
          x={385}
          y={102}
          tex="\vec B"
          color={C.minus}
          fontSize={16}
          width={34}
          anchor="middle"
        />
        <Arrow
          x1={82}
          y1={132}
          x2={205}
          y2={132}
          color={C.ok}
          width={3}
          texLabel="P_{\text{бат}}"
          texLabelDy={-13}
          texLabelWidth={62}
        />
        <Arrow
          x1={205}
          y1={228}
          x2={82}
          y2={228}
          color={C.plus}
          width={3}
          texLabel="P_L"
          texLabelDy={16}
          texLabelWidth={36}
          texLabelAnchor="start"
        />
        <SvgTex x={535} y={180} tex="V=A\ell" color={C.mut} fontSize={15} width={66} />
        <text x="385" y="316" textAnchor="middle" fill={C.mut} fontSize="12" fontWeight="600">
          ЕНЕРГИЯТА Е В ПОЛЕТО, НЕ В ЖИЦАТА
        </text>
      </svg>

      <Readout
        cells={[
          { label: "Ток", tex: `$I=${bg(current)}\\,\\mathrm{A}$`, color: C.warn },
          {
            label: "Поле",
            tex: `$B=${bg(field * 1000, 3)}\\,\\mathrm{mT}$`,
            color: C.minus,
          },
          {
            label: "Енергия",
            tex: `$U_B=${bg(energy * 1000, 3)}\\,\\mathrm{mJ}$`,
            color: C.ok,
          },
          {
            label: "Енергийна плътност",
            tex: `$u_B=${bg(density, 3)}\\,\\mathrm{J/m^3}$`,
            color: C.plus,
          },
        ]}
      />

      <label className="mt-4 block text-[13px] font-medium text-muted">
        <span className="flex justify-between gap-3">
          <span>Ток през соленоида</span>
          <strong className="text-minus">
            <RichText text={`$I=${bg(current)}\\,\\mathrm{A}$`} />
          </strong>
        </span>
        <input
          className="w-full accent-(--color-minus)"
          type="range"
          min="0"
          max="6"
          step="0.1"
          value={current}
          onChange={(event) => setCurrent(+event.target.value)}
        />
      </label>
      <p className="mt-3 text-[13.5px] text-muted">
        <RichText text="Удвоете $I$: $B$ се удвоява, но $U_B$ и $u_B$ нарастват четири пъти. Батерията върши работа срещу обратното ЕДН, а тази работа остава като енергия на магнитното поле." />
      </p>
    </div>
  );
}

export function MutualInductanceLab() {
  const [separation, setSeparation] = useState(0.35);
  const [rate, setRate] = useState(4);
  const x1 = 180;
  const x2 = 430 + separation * 125;
  const mutualMh = 4 * Math.exp(-1.8 * separation);
  const emf = -(mutualMh / 1000) * rate;
  const linkOpacity = 0.2 + 0.7 * Math.exp(-1.8 * separation);

  return (
    <div className={PANEL_CLASS}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={`${STAGE_CLASS} select-none`}
        style={DRAWING_STYLE}
        role="img"
        aria-label="Две намотки с взаимна индуктивност и променливо разстояние"
      >
        <Stage title="ВЗАИМНА ИНДУКЦИЯ · ЕДНО ПОЛЕ СВЪРЗВА ДВЕ ВЕРИГИ" />
        <Coil x={x1} y={182} />
        <Coil x={x2} y={182} color={C.ok} />
        {[-48, -24, 0, 24, 48].map((dy, index) => (
          <path
            key={dy}
            d={`M ${x1 + 30} ${182 + dy} C ${x1 + 105} ${80 + index * 50}, ${x2 - 80} ${80 + index * 50}, ${x2} ${182 + dy * 0.72}`}
            fill="none"
            stroke={C.minus}
            strokeWidth="1.8"
            opacity={linkOpacity}
          />
        ))}
        <Arrow
          x1={x1 - 85}
          y1={88}
          x2={x1 - 15}
          y2={88}
          color={C.warn}
          width={3}
          texLabel="I_1"
          texLabelDy={-12}
          texLabelWidth={24}
        />
        <Arrow
          x1={x2 + 88}
          y1={88}
          x2={x2 + 18}
          y2={88}
          color={C.ok}
          width={3}
          texLabel="\mathcal{E}_2"
          texLabelDy={-14}
          texLabelWidth={42}
          texLabelAnchor="start"
        />
        <SvgTex
          x={x1 + 15}
          y={290}
          tex="N_1"
          color={C.warn}
          fontSize={15}
          width={28}
          anchor="middle"
        />
        <SvgTex
          x={x2 + 15}
          y={290}
          tex="N_2"
          color={C.ok}
          fontSize={15}
          width={28}
          anchor="middle"
        />
        <SvgTex
          x={(x1 + x2) / 2}
          y={72}
          tex="\Phi_{12}"
          color={C.minus}
          fontSize={16}
          width={42}
          anchor="middle"
        />
        <text x="360" y="326" textAnchor="middle" fill={C.mut} fontSize="12" fontWeight="600">
          ПО-БЛИЗКИ НАМОТКИ → ПОВЕЧЕ СВЪРЗАН ПОТОК
        </text>
      </svg>

      <Readout
        cells={[
          {
            label: "Разстояние",
            tex: `$d=${bg(2 + separation * 18)}\\,\\mathrm{cm}$`,
            color: C.mut,
          },
          {
            label: "Взаимна индуктивност",
            tex: `$M=${bg(mutualMh, 3)}\\,\\mathrm{mH}$`,
            color: C.minus,
          },
          {
            label: "Промяна на първичния ток",
            tex: `$dI_1/dt=${bg(rate)}\\,\\mathrm{A/s}$`,
            color: C.warn,
          },
          {
            label: "Индуцирано ЕДН",
            tex: `$\\mathcal{E}_2=${bg(emf * 1000, 2)}\\,\\mathrm{mV}$`,
            color: C.ok,
          },
        ]}
      />

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-[13px] font-medium text-muted">
          <span className="flex justify-between gap-2">
            <span>Разстояние между намотките</span>
            <strong className="text-minus">
              <RichText text={`$${bg(2 + separation * 18)}\\,\\mathrm{cm}$`} />
            </strong>
          </span>
          <input
            className="w-full accent-(--color-minus)"
            type="range"
            min="0"
            max="1"
            step="0.02"
            value={separation}
            onChange={(event) => setSeparation(+event.target.value)}
          />
        </label>
        <label className="text-[13px] font-medium text-muted">
          <span className="flex justify-between gap-2">
            <RichText text="Промяна $dI_1/dt$" />
            <strong className="text-minus">
              <RichText text={`$${bg(rate)}\\,\\mathrm{A/s}$`} />
            </strong>
          </span>
          <input
            className="w-full accent-(--color-minus)"
            type="range"
            min="-10"
            max="10"
            step="0.5"
            value={rate}
            onChange={(event) => setRate(+event.target.value)}
          />
        </label>
      </div>
      <p className="mt-3 text-[13.5px] text-muted">
        <RichText text="Преместете намотките: $M$ зависи от общата геометрия и ориентация, не от моментните токове. Обърнете знака на $dI_1/dt$ и $\mathcal E_2$ се обръща по закона на Ленц." />
      </p>
    </div>
  );
}

export function LCEnergyLab() {
  const [phaseDeg, setPhaseDeg] = useState(38);
  const [playing, setPlaying] = useState(false);
  const frameRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  const togglePlay = () => {
    if (playing) {
      setPlaying(false);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      return;
    }
    setPlaying(true);
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      setPhaseDeg((old) => (old + dt * 0.055) % 360);
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
  };

  const phase = (phaseDeg * Math.PI) / 180;
  const chargeNorm = Math.cos(phase);
  const currentNorm = -Math.sin(phase);
  const electricPart = chargeNorm * chargeNorm;
  const magneticPart = currentNorm * currentNorm;
  const capacitance = 9e-12;
  const inductance = 2.81e-3;
  const voltage = 12;
  const omega = 1 / Math.sqrt(inductance * capacitance);
  const qMax = capacitance * voltage;
  const iMax = omega * qMax;
  const totalEnergy = 0.5 * capacitance * voltage * voltage;

  const barY = 94;
  const barHeight = 178;
  const chargePositive = chargeNorm >= 0;

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-2">
        <button type="button" className={BTN_PRI} onClick={togglePlay}>
          {playing ? "Пауза" : "Пуснете трептенето ▶"}
        </button>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={`${STAGE_CLASS} select-none`}
        style={DRAWING_STYLE}
        role="img"
        aria-label="LC контур с прехвърляне на енергия между кондензатора и индуктора"
      >
        <Stage title="LC КОНТУР · ЕНЕРГИЯТА СЕ ПРЕХВЪРЛЯ МЕЖДУ ДВЕ ПОЛЕТА" />

        <line x1="78" y1="92" x2="264" y2="92" stroke={C.wire} strokeWidth="4" />
        <line x1="78" y1="268" x2="264" y2="268" stroke={C.wire} strokeWidth="4" />
        <line x1="264" y1="92" x2="264" y2="115" stroke={C.wire} strokeWidth="4" />
        <line x1="264" y1="245" x2="264" y2="268" stroke={C.wire} strokeWidth="4" />
        <line x1="78" y1="92" x2="78" y2="156" stroke={C.wire} strokeWidth="4" />
        <line x1="78" y1="204" x2="78" y2="268" stroke={C.wire} strokeWidth="4" />
        <line x1="53" y1="164" x2="103" y2="164" stroke={C.plus} strokeWidth="5" />
        <line x1="53" y1="196" x2="103" y2="196" stroke={C.minus} strokeWidth="5" />
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <ellipse
            key={index}
            cx={264}
            cy={128 + index * 21}
            rx="20"
            ry="14"
            fill="none"
            stroke={C.warn}
            strokeWidth="3"
          />
        ))}
        <SvgTex x={112} y={180} tex="C" color={C.mut} fontSize={16} width={24} />
        <SvgTex x={294} y={180} tex="L" color={C.warn} fontSize={16} width={24} />
        <SvgTex
          x={119}
          y={chargePositive ? 145 : 215}
          tex={chargePositive ? "+q" : "-q"}
          color={chargePositive ? C.plus : C.minus}
          fontSize={15}
          width={34}
          anchor="middle"
        />
        <SvgTex
          x={119}
          y={chargePositive ? 215 : 145}
          tex={chargePositive ? "-q" : "+q"}
          color={chargePositive ? C.minus : C.plus}
          fontSize={15}
          width={34}
          anchor="middle"
        />
        {Math.abs(currentNorm) > 0.03 && (
          <Arrow
            x1={currentNorm < 0 ? 125 : 228}
            y1={68}
            x2={currentNorm < 0 ? 228 : 125}
            y2={68}
            color={C.ok}
            width={3}
            texLabel="I"
            texLabelDy={-12}
            texLabelWidth={18}
          />
        )}

        <rect
          x="405"
          y={barY}
          width="104"
          height={barHeight}
          rx="8"
          fill={C.faint}
          fillOpacity="0.16"
          stroke={C.mut}
          strokeWidth="1.5"
        />
        <rect
          x="549"
          y={barY}
          width="104"
          height={barHeight}
          rx="8"
          fill={C.faint}
          fillOpacity="0.16"
          stroke={C.mut}
          strokeWidth="1.5"
        />
        <rect
          x="405"
          y={barY + barHeight * (1 - electricPart)}
          width="104"
          height={barHeight * electricPart}
          rx="7"
          fill={C.plus}
          fillOpacity="0.82"
        />
        <rect
          x="549"
          y={barY + barHeight * (1 - magneticPart)}
          width="104"
          height={barHeight * magneticPart}
          rx="7"
          fill={C.minus}
          fillOpacity="0.82"
        />
        <SvgTex
          x={457}
          y={296}
          tex="U_E/U"
          color={C.plus}
          fontSize={14}
          width={58}
          anchor="middle"
        />
        <SvgTex
          x={601}
          y={296}
          tex="U_B/U"
          color={C.minus}
          fontSize={14}
          width={58}
          anchor="middle"
        />
        <text x="529" y="326" textAnchor="middle" fill={C.mut} fontSize="12" fontWeight="600">
          СУМАТА ОСТАВА ПОСТОЯННА
        </text>
      </svg>

      <Readout
        cells={[
          {
            label: "Фаза",
            tex: `$\\omega t=${bg(phaseDeg, 0)}^\\circ$`,
            color: C.mut,
          },
          {
            label: "Заряд",
            tex: `$q=${bg(chargeNorm * qMax * 1e12, 1)}\\,\\mathrm{pC}$`,
            color: chargeNorm >= 0 ? C.plus : C.minus,
          },
          {
            label: "Ток",
            tex: `$I=${bg(currentNorm * iMax * 1000, 3)}\\,\\mathrm{mA}$`,
            color: C.ok,
          },
          {
            label: "Обща енергия",
            tex: `$U=${bg(totalEnergy * 1e9, 3)}\\,\\mathrm{nJ}$`,
            color: C.warn,
          },
        ]}
      />

      <label className="mt-4 block text-[13px] font-medium text-muted">
        <span className="flex justify-between gap-3">
          <span>Фаза на трептенето</span>
          <strong className="text-minus">
            <RichText text={`$\\omega t=${bg(phaseDeg, 0)}^\\circ$`} />
          </strong>
        </span>
        <input
          className="w-full accent-(--color-minus)"
          type="range"
          min="0"
          max="360"
          step="1"
          value={phaseDeg}
          onChange={(event) => {
            setPlaying(false);
            if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
            frameRef.current = null;
            setPhaseDeg(+event.target.value);
          }}
        />
      </label>
      <p className="mt-3 text-[13.5px] text-muted">
        <RichText text="При $|q|=Q_{\max}$ токът е нула и цялата енергия е електрична. Четвърт период по-късно $q=0$, $|I|=I_{\max}$ и енергията е магнитна. Зарядът и токът са изместени по фаза с $90^\circ$, а двете енергии се менят като $\cos^2\omega t$ и $\sin^2\omega t$." />
      </p>
    </div>
  );
}

function normalizedRlcCharge(ratio: number, time: number) {
  if (Math.abs(ratio - 1) < 1e-6) {
    return Math.exp(-time) * (1 + time);
  }
  if (ratio < 1) {
    const beta = Math.sqrt(1 - ratio * ratio);
    return (
      Math.exp(-ratio * time) *
      (Math.cos(beta * time) + (ratio / beta) * Math.sin(beta * time))
    );
  }
  const delta = Math.sqrt(ratio * ratio - 1);
  return (
    Math.exp(-ratio * time) *
    (Math.cosh(delta * time) + (ratio / delta) * Math.sinh(delta * time))
  );
}

export function RLCDampingLab() {
  const [ratio, setRatio] = useState(0.35);
  const [time, setTime] = useState(4);
  const inductance = 0.04;
  const capacitance = 100e-6;
  const criticalResistance = 2 * Math.sqrt(inductance / capacitance);
  const resistance = ratio * criticalResistance;
  const omega0 = 1 / Math.sqrt(inductance * capacitance);
  const alpha = resistance / (2 * inductance);
  const charge = normalizedRlcCharge(ratio, time);
  const regime =
    ratio < 0.999 ? "подкритично" : ratio > 1.001 ? "свръхкритично" : "критично";

  const left = 66;
  const right = 688;
  const mid = 180;
  const amplitude = 118;
  const bottom = 316;
  const gx = (value: number) => left + ((right - left) * value) / 16;
  const gy = (value: number) => mid - value * amplitude;
  const curve = makePath(241, (index) => {
    const t = (16 * index) / 240;
    return [gx(t), gy(normalizedRlcCharge(ratio, t))];
  });
  const upperEnvelope =
    ratio < 1
      ? makePath(121, (index) => {
          const t = (16 * index) / 120;
          return [gx(t), gy(Math.exp(-ratio * t))];
        })
      : null;
  const lowerEnvelope =
    ratio < 1
      ? makePath(121, (index) => {
          const t = (16 * index) / 120;
          return [gx(t), gy(-Math.exp(-ratio * t))];
        })
      : null;

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-2">
        <button type="button" className={BTN_SEC} onClick={() => setRatio(0.35)}>
          Подкритично
        </button>
        <button type="button" className={BTN_SEC} onClick={() => setRatio(1)}>
          Критично
        </button>
        <button type="button" className={BTN_SEC} onClick={() => setRatio(1.55)}>
          Свръхкритично
        </button>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={`${STAGE_CLASS} select-none`}
        style={DRAWING_STYLE}
        role="img"
        aria-label="Зарядът в RLC контур при подкритично, критично и свръхкритично затихване"
      >
        <Stage title="RLC КОНТУР · СЪПРОТИВЛЕНИЕТО ИЗБИРА РЕЖИМА" />
        <Arrow x1={left} y1={mid} x2={right} y2={mid} color={C.mut} width={1.5} />
        <Arrow x1={left} y1={bottom} x2={left} y2={52} color={C.mut} width={1.5} />
        <SvgTex
          x={right}
          y={mid + 22}
          tex="\omega_0t"
          color={C.mut}
          fontSize={13}
          width={48}
          anchor="end"
        />
        <SvgTex
          x={left - 12}
          y={56}
          tex="q/Q_0"
          color={C.mut}
          fontSize={13}
          width={45}
          anchor="end"
        />
        {upperEnvelope && lowerEnvelope && (
          <>
            <path d={upperEnvelope} fill="none" stroke={C.faint} strokeWidth="1.5" strokeDasharray="5 5" />
            <path d={lowerEnvelope} fill="none" stroke={C.faint} strokeWidth="1.5" strokeDasharray="5 5" />
          </>
        )}
        <path d={curve} fill="none" stroke={C.ok} strokeWidth="3.2" />
        <line
          x1={gx(time)}
          y1={56}
          x2={gx(time)}
          y2={bottom}
          stroke={C.warn}
          strokeWidth="1.3"
          strokeDasharray="4 5"
        />
        <circle
          cx={gx(time)}
          cy={gy(charge)}
          r="6"
          fill={C.warn}
          stroke={STAGE_BG}
          strokeWidth="2"
        />
        <SvgTex
          x={right - 10}
          y={58}
          tex={
            ratio < 0.999
              ? "R<R_c"
              : ratio > 1.001
                ? "R>R_c"
                : "R=R_c"
          }
          color={ratio < 0.999 ? C.ok : ratio > 1.001 ? C.plus : C.warn}
          fontSize={15}
          width={58}
          anchor="end"
        />
        <SvgTex
          x={right - 10}
          y={88}
          tex="R_c=2\sqrt{L/C}"
          color={C.mut}
          fontSize={13}
          width={112}
          anchor="end"
        />
      </svg>

      <Readout
        cells={[
          {
            label: "Спрямо критичното",
            tex: `$R/R_c=${bg(ratio)}$`,
            color: ratio < 0.999 ? C.ok : ratio > 1.001 ? C.plus : C.warn,
          },
          {
            label: "Съпротивление",
            tex: `$R=${bg(resistance)}\\,\\Omega$`,
            color: C.minus,
          },
          {
            label: "Режим",
            tex: regime,
            color: ratio < 0.999 ? C.ok : ratio > 1.001 ? C.plus : C.warn,
          },
          {
            label: "Заряд",
            tex: `$q/Q_0=${bg(charge, 3)}$`,
            color: C.warn,
          },
        ]}
      />

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-[13px] font-medium text-muted">
          <span className="flex justify-between gap-2">
            <span>Затихване</span>
            <strong className="text-minus">
              <RichText text={`$R/R_c=${bg(ratio)}$`} />
            </strong>
          </span>
          <input
            className="w-full accent-(--color-minus)"
            type="range"
            min="0"
            max="2"
            step="0.05"
            value={ratio}
            onChange={(event) => setRatio(+event.target.value)}
          />
        </label>
        <label className="text-[13px] font-medium text-muted">
          <span className="flex justify-between gap-2">
            <span>Безразмерно време</span>
            <strong className="text-minus">
              <RichText text={`$\\omega_0t=${bg(time)}$`} />
            </strong>
          </span>
          <input
            className="w-full accent-(--color-minus)"
            type="range"
            min="0"
            max="16"
            step="0.1"
            value={time}
            onChange={(event) => setTime(+event.target.value)}
          />
        </label>
      </div>
      <p className="mt-3 text-[13.5px] text-muted">
        <RichText text={`За избраните $L$ и $C$: $R_c=${bg(criticalResistance)}\\,\\Omega$, $\\omega_0=${bg(omega0, 0)}\\,\\mathrm{rad/s}$ и $\\alpha=${bg(alpha, 1)}\\,\\mathrm{s^{-1}}$. Под $R_c$ зарядът сменя знак; при и над $R_c$ се връща към нула без трептене.`} />
      </p>
    </div>
  );
}
