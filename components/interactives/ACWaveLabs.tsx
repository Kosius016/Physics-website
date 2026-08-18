"use client";

import { useRef, useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import { Arrow, BTN_PRI, BTN_SEC, C, PANEL_CLASS, STAGE_CLASS, svgPoint } from "./svg";
import {
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
 * Интерактиви към §2 и §3: какво точно се редува в „променлив ток“ и от какво
 * е съставена синусоидата. Цветовата уговорка на цялата глава:
 *   бяло — източник v(t) и резултантно напрежение, зелено — ток i(t),
 *   оранжево — резистор, жълто — бобина, синьо — кондензатор.
 */

const W = 760;
const H = 340;

/* =================================================== §2 верига с резистор */

/**
 * Синхронизира три неща: точката върху синусоидата, знака на напрежението и
 * посоката на стрелките за тока. Целта е ученикът да види, че „променлив“
 * значи буквално сменящ посоката си два пъти за период.
 */
export function ACSourceCircuit() {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(0.3);
  const { turns, setTurns } = useClock(playing, speed, 0.13);

  const cycle = ((turns % 2) + 2) % 2; // позиция в прозореца от два периода
  const theta = 2 * Math.PI * cycle;
  const v = Math.sin(theta);
  const positive = v >= 0;

  const s = scaler({ x: 452, y: 92, w: 250, h: 180 }, 2, 1.15);
  const glow = 0.12 + 0.6 * v * v;

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-2">
        <button type="button" className={BTN_PRI} onClick={() => setPlaying((p) => !p)}>
          {playing ? "Пауза" : "Пуснете ▶"}
        </button>
        <button
          type="button"
          className={BTN_SEC}
          onClick={() => setSpeed((sp) => (sp === 0.3 ? 0.08 : 0.3))}
        >
          {speed === 0.3 ? "Забавено ▷" : "Нормална скорост"}
        </button>
        <button type="button" className={BTN_SEC} onClick={() => setTurns(0.13)}>
          Нулиране
        </button>
      </div>

      <StageScroll minWidth={W}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className={`${STAGE_CLASS} select-none`}
          role="img"
          aria-label="Верига с източник на променливо напрежение и резистор, синхронизирана със синусоидата"
        >
          <Stage w={W} h={H} title="ПРОМЕНЛИВ ТОК · ЗНАКЪТ НА НАПРЕЖЕНИЕТО СМЕНЯ ПОСОКАТА НА ТОКА" />

          {/* --- веригата --- */}
          <g stroke={C.wire} strokeWidth={3.4} fill="none">
            <line x1={92} y1={100} x2={330} y2={100} />
            <line x1={330} y1={100} x2={330} y2={270} />
            <line x1={330} y1={270} x2={92} y2={270} />
            <line x1={92} y1={270} x2={92} y2={207} />
            <line x1={92} y1={163} x2={92} y2={100} />
          </g>
          <circle cx={211} cy={100} r={34} fill={C.plus} opacity={glow * 0.5} />
          <ResistorSymbol x={174} y={100} w={74} color={C.plus} />
          <SvgTex x={211} y={62} tex="R" color={C.plus} fontSize={15} width={22} anchor="middle" />
          <SourceSymbol x={92} y={185} r={22} color={C.warn} />
          <SvgTex x={44} y={185} tex="v(t)" color={C.warn} fontSize={14} width={44} anchor="middle" />

          {/* полярност: сменя се заедно със знака */}
          <SvgTex
            x={131}
            y={positive ? 155 : 215}
            tex="+"
            color={C.plus}
            fontSize={17}
            width={16}
            anchor="middle"
          />
          <SvgTex
            x={131}
            y={positive ? 215 : 155}
            tex="-"
            color={C.minus}
            fontSize={17}
            width={16}
            anchor="middle"
          />

          {/* токът: посоката следва знака на v */}
          {Math.abs(v) > 0.05 && (
            <>
              <Arrow
                x1={positive ? 268 : 320}
                y1={100}
                x2={positive ? 320 : 268}
                y2={100}
                color={C.ok}
                width={3}
              />
              <Arrow
                x1={positive ? 205 : 145}
                y1={270}
                x2={positive ? 145 : 205}
                y2={270}
                color={C.ok}
                width={3}
              />
              <SvgTex x={175} y={295} tex="i(t)" color={C.ok} fontSize={14} width={40} anchor="middle" />
            </>
          )}

          {/* --- синусоидата --- */}
          <PlotFrame s={s} xLabel="t" yLabel="v" yLabelColor={C.warn} periods={2} />
          <path
            d={s.path((x) => Math.sin(2 * Math.PI * x), 240)}
            fill="none"
            stroke={C.warn}
            strokeWidth={2.6}
          />
          <line
            x1={s.sx(cycle)}
            y1={s.box.y}
            x2={s.sx(cycle)}
            y2={s.box.y + s.box.h}
            stroke={C.faint}
            strokeDasharray="4 4"
          />
          <circle cx={s.sx(cycle)} cy={s.sy(v)} r={6} fill={positive ? C.plus : C.minus} />
          <SvgTex
            x={s.sx(1) }
            y={s.box.y + s.box.h + 22}
            tex="T"
            color={C.mut}
            fontSize={12.5}
            width={18}
            anchor="middle"
          />
        </svg>
      </StageScroll>

      <label className="mt-4 block">
        <span className="mb-1 flex items-center justify-between gap-3 text-[13px] font-semibold text-muted">
          <span className="text-ink">Ръчно превъртане на времето</span>
          <span className="tabular-nums text-minus">
            <RichText text={`$t=${dec(cycle, 2)}\\,T$`} />
          </span>
        </span>
        <input
          type="range"
          min={0}
          max={2}
          step={0.005}
          value={cycle}
          onChange={(event) => {
            setPlaying(false);
            setTurns(Number(event.target.value));
          }}
          className="w-full accent-minus"
        />
      </label>

      <Readouts
        cols={3}
        cells={[
          { label: "Фаза", tex: `\\omega t=${dec((cycle * 360) % 360, 0)}^\\circ`, color: "var(--color-muted)" },
          {
            label: "Напрежение",
            tex: `v=${dec(v, 2)}\\,V_0`,
            color: "var(--color-ink)",
          },
          {
            label: "Посока на тока",
            tex: positive ? "\\circlearrowright" : "\\circlearrowleft",
            color: "var(--color-ok)",
          },
        ]}
      />
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="За половин период стрелките сочат в едната посока, за другата половина - в обратната. Средният ток за цял период е нула, но резисторът се нагрява и в двете половини: това ще стане важно в §13." />
      </p>
    </div>
  );
}

/* ============================================== §3 анатомия на синусоидата */

const WINDOW = 0.04; // 40 ms фиксиран прозорец: смяната на f се вижда

export function SineWaveLab() {
  const [amp, setAmp] = useState(6);
  const [freq, setFreq] = useState(50);
  const [phiDeg, setPhiDeg] = useState(0);
  const [deg, setDeg] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(0.6);
  const { turns, setTurns } = useClock(playing, speed);

  const [showAmp, setShowAmp] = useState(true);
  const [showPeriod, setShowPeriod] = useState(true);
  const [showZeros, setShowZeros] = useState(false);
  const [showExtrema, setShowExtrema] = useState(false);
  const [showPhase, setShowPhase] = useState(false);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragRef = useRef<{ x: number; phi: number } | null>(null);

  const phi = (phiDeg * Math.PI) / 180;
  const omega = 2 * Math.PI * freq;
  const period = 1 / freq;
  const y = (t: number) => amp * Math.sin(omega * t + phi);

  const s = scaler({ x: 74, y: 66, w: 604, h: 214 }, WINDOW, 11);
  const tNow = ((turns / freq) % WINDOW + WINDOW) % WINDOW;

  /** Първият максимум в прозореца — котва за означенията на A и T. */
  const tPeak = (() => {
    const base = (Math.PI / 2 - phi) / omega;
    let t = base;
    while (t < 0) t += period;
    while (t > WINDOW - period) t -= period;
    return t < 0 ? base + period : t;
  })();
  const peakVisible = tPeak >= 0 && tPeak + period <= WINDOW;

  /** Възходящите нули: y = 0 и y' > 0. */
  const risingZeros: number[] = [];
  for (let k = -2; k < 12; k += 1) {
    const t = (2 * Math.PI * k - phi) / omega;
    if (t >= 0 && t <= WINDOW) risingZeros.push(t);
  }
  const allZeros: number[] = [];
  for (let k = -2; k < 24; k += 1) {
    const t = (Math.PI * k - phi) / omega;
    if (t >= 0 && t <= WINDOW) allZeros.push(t);
  }
  const extrema: number[] = [];
  for (let k = -2; k < 24; k += 1) {
    const t = (Math.PI / 2 + Math.PI * k - phi) / omega;
    if (t >= 0 && t <= WINDOW) extrema.push(t);
  }

  const startDrag = (clientX: number) => {
    if (!svgRef.current) return;
    const [px] = svgPoint(svgRef.current, clientX, 0, W, H);
    dragRef.current = { x: px, phi: phiDeg };
  };
  const moveDrag = (clientX: number) => {
    if (!svgRef.current || !dragRef.current) return;
    const [px] = svgPoint(svgRef.current, clientX, 0, W, H);
    const dt = (s.ux(px) - s.ux(dragRef.current.x));
    // Отместване надясно с dt означава по-малка фазова константа: φ → φ − ω·dt
    let next = dragRef.current.phi - (omega * dt * 180) / Math.PI;
    next = ((((next + 180) % 360) + 360) % 360) - 180;
    setPhiDeg(Math.round(next));
  };

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-2">
        <button type="button" className={BTN_PRI} onClick={() => setPlaying((p) => !p)}>
          {playing ? "Пауза" : "Пуснете ▶"}
        </button>
        <button
          type="button"
          className={BTN_SEC}
          onClick={() => setSpeed((sp) => (sp === 0.6 ? 0.15 : 0.6))}
        >
          {speed === 0.6 ? "Забавено ▷" : "Нормална скорост"}
        </button>
        <button
          type="button"
          className={BTN_SEC}
          onClick={() => {
            setAmp(6);
            setFreq(50);
            setPhiDeg(0);
            setTurns(0);
            setPlaying(false);
          }}
        >
          Нулиране
        </button>
        <button type="button" className={BTN_SEC} onClick={() => setDeg((d) => !d)}>
          {deg ? "Фазата в радиани" : "Фазата в градуси"}
        </button>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        <Toggle on={showAmp} onChange={setShowAmp}>
          Амплитуда
        </Toggle>
        <Toggle on={showPeriod} onChange={setShowPeriod}>
          Период
        </Toggle>
        <Toggle on={showZeros} onChange={setShowZeros}>
          Нули
        </Toggle>
        <Toggle on={showExtrema} onChange={setShowExtrema}>
          Екстремуми
        </Toggle>
        <Toggle on={showPhase} onChange={setShowPhase}>
          Фазово отместване
        </Toggle>
      </div>

      <StageScroll minWidth={W}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className={`${STAGE_CLASS} cursor-ew-resize select-none`}
          role="img"
          aria-label="Синусоида с означени амплитуда, период, нули, екстремуми и фазово отместване"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            startDrag(event.clientX);
          }}
          onPointerMove={(event) => moveDrag(event.clientX)}
          onPointerUp={() => {
            dragRef.current = null;
          }}
          onPointerCancel={() => {
            dragRef.current = null;
          }}
        >
          <Stage w={W} h={H} title="ВЛАЧЕТЕ ГРАФИКАТА НАСТРАНИ · ТОВА МЕНИ САМО НАЧАЛНАТА ФАЗА" />
          <PlotFrame s={s} xLabel="t" yLabel="y(t)" yLabelColor={C.warn} periods={0} quarterTicks={false} />

          {/* референтна крива с φ = 0 */}
          {showPhase && Math.abs(phiDeg) > 0.5 && (
            <path
              d={s.path((t) => amp * Math.sin(omega * t), 300)}
              fill="none"
              stroke={C.faint}
              strokeWidth={2}
              strokeDasharray="6 5"
            />
          )}

          <path d={s.path(y, 340)} fill="none" stroke={C.warn} strokeWidth={2.8} />

          {/* амплитуда: вертикална стрелка при първия максимум */}
          {showAmp && peakVisible && (
            <g>
              <line
                x1={s.sx(tPeak)}
                y1={s.y0}
                x2={s.sx(tPeak)}
                y2={s.sy(amp)}
                stroke={C.ok}
                strokeWidth={2}
              />
              <polygon
                points={`${s.sx(tPeak)},${s.sy(amp)} ${s.sx(tPeak) - 4},${s.sy(amp) + 9} ${s.sx(tPeak) + 4},${s.sy(amp) + 9}`}
                fill={C.ok}
              />
              <SvgTex
                x={s.sx(tPeak) - 12}
                y={(s.y0 + s.sy(amp)) / 2}
                tex="A"
                color={C.ok}
                fontSize={14}
                width={20}
                anchor="end"
              />
            </g>
          )}

          {/* период: разстояние между два последователни максимума */}
          {showPeriod && peakVisible && (
            <g>
              <line
                x1={s.sx(tPeak)}
                y1={s.sy(amp) - 16}
                x2={s.sx(tPeak + period)}
                y2={s.sy(amp) - 16}
                stroke={C.minus}
                strokeWidth={2}
              />
              <polygon
                points={`${s.sx(tPeak)},${s.sy(amp) - 16} ${s.sx(tPeak) + 9},${s.sy(amp) - 20} ${s.sx(tPeak) + 9},${s.sy(amp) - 12}`}
                fill={C.minus}
              />
              <polygon
                points={`${s.sx(tPeak + period)},${s.sy(amp) - 16} ${s.sx(tPeak + period) - 9},${s.sy(amp) - 20} ${s.sx(tPeak + period) - 9},${s.sy(amp) - 12}`}
                fill={C.minus}
              />
              <SvgTex
                x={s.sx(tPeak + period / 2)}
                y={s.sy(amp) - 32}
                tex="T"
                color={C.minus}
                fontSize={14}
                width={20}
                anchor="middle"
              />
            </g>
          )}

          {showZeros &&
            allZeros.map((t) => (
              <circle key={`z${t}`} cx={s.sx(t)} cy={s.y0} r={4.5} fill={C.minus} stroke={C.wire} strokeWidth={1} />
            ))}
          {showExtrema &&
            extrema.map((t) => (
              <circle key={`e${t}`} cx={s.sx(t)} cy={s.sy(y(t))} r={4.5} fill={C.plus} />
            ))}

          {/* фазово отместване: разстоянието между нулите на двете криви */}
          {showPhase && Math.abs(phiDeg) > 0.5 && risingZeros.length > 0 && (
            <g>
              <line
                x1={s.sx(risingZeros[0])}
                y1={s.y0}
                x2={s.sx(risingZeros[0] + phi / omega)}
                y2={s.y0}
                stroke={C.plus}
                strokeWidth={3}
              />
              <SvgTex
                x={s.sx(risingZeros[0] + phi / (2 * omega))}
                y={s.y0 + 24}
                tex="\phi/\omega"
                color={C.plus}
                fontSize={13}
                width={54}
                anchor="middle"
              />
            </g>
          )}

          <circle cx={s.sx(tNow)} cy={s.sy(y(tNow))} r={6} fill={C.wire} />
        </svg>
      </StageScroll>

      <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-3">
        <RangeControl
          label={<RichText text="Амплитуда $A$" />}
          value={amp}
          min={1}
          max={10}
          step={0.5}
          valueTex={`${dec(amp, 1)}`}
          onChange={setAmp}
        />
        <RangeControl
          label={<RichText text="Честота $f$" />}
          value={freq}
          min={25}
          max={200}
          step={5}
          valueTex={`${freq}\\,\\mathrm{Hz}`}
          onChange={setFreq}
        />
        <RangeControl
          label={<RichText text="Фаза $\phi$" />}
          value={phiDeg}
          min={-180}
          max={180}
          step={5}
          valueTex={deg ? `${phiDeg}^\\circ` : `${dec((phiDeg * Math.PI) / 180, 2)}\\,\\mathrm{rad}`}
          onChange={setPhiDeg}
        />
      </div>

      <Readouts
        cols={5}
        cells={[
          { label: "Амплитуда", tex: `A=${dec(amp, 1)}`, color: "var(--color-ok)" },
          { label: "Честота", tex: `f=${freq}\\,\\mathrm{Hz}`, color: "var(--color-ink)" },
          { label: "Период", tex: `T=${dec(period * 1000, 2)}\\,\\mathrm{ms}`, color: "var(--color-minus)" },
          {
            label: "Ъглова честота",
            tex: `\\omega=${dec(omega, 0)}\\,\\mathrm{rad/s}`,
            color: "var(--color-ink)",
          },
          {
            label: "Фаза",
            tex: deg ? `\\phi=${phiDeg}^\\circ` : `\\phi=${dec(phi, 2)}\\,\\mathrm{rad}`,
            color: "var(--color-plus)",
          },
        ]}
      />
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Прозорецът е фиксиран на $40\,\mathrm{ms}$, затова увеличаването на $f$ побира повече периоди, а $T$ се свива: проверете, че произведението $fT$ остава $1$ при всяко положение на плъзгача." />
      </p>
    </div>
  );
}

/* ================================================== §4 сравнение на две вълни */

interface Preset {
  name: string;
  a1: number;
  f1: number;
  p1: number;
  a2: number;
  f2: number;
  p2: number;
}

const PRESETS: Preset[] = [
  { name: "В фаза", a1: 6, f1: 50, p1: 0, a2: 6, f2: 50, p2: 0 },
  { name: "45°", a1: 6, f1: 50, p1: 0, a2: 6, f2: 50, p2: 45 },
  { name: "90°", a1: 6, f1: 50, p1: 0, a2: 6, f2: 50, p2: 90 },
  { name: "180°", a1: 6, f1: 50, p1: 0, a2: 6, f2: 50, p2: 180 },
  { name: "Различни амплитуди", a1: 8, f1: 50, p1: 0, a2: 3, f2: 50, p2: 0 },
  { name: "Различни честоти", a1: 6, f1: 50, p1: 0, a2: 6, f2: 100, p2: 0 },
];

export function WaveComparator() {
  const [p, setP] = useState<Preset>(PRESETS[2]);
  const { a1, f1, p1, a2, f2, p2 } = p;
  const set = (patch: Partial<Preset>) => setP((prev) => ({ ...prev, ...patch, name: "Ръчно" }));

  const w1 = 2 * Math.PI * f1;
  const w2 = 2 * Math.PI * f2;
  const ph1 = (p1 * Math.PI) / 180;
  const ph2 = (p2 * Math.PI) / 180;
  const y1 = (t: number) => a1 * Math.sin(w1 * t + ph1);
  const y2 = (t: number) => a2 * Math.sin(w2 * t + ph2);

  const s = scaler({ x: 74, y: 62, w: 604, h: 222 }, WINDOW, 11);
  const sameFreq = f1 === f2;
  const dPhiDeg = ((((p2 - p1 + 180) % 360) + 360) % 360) - 180;
  const dPhi = (dPhiDeg * Math.PI) / 180;
  const dt = sameFreq ? dPhi / w1 : 0;

  /** Първата възходяща нула на всяка крива — между тях се мери Δt. */
  const zero = (omega: number, phase: number) => {
    let t = -phase / omega;
    const T = (2 * Math.PI) / omega;
    while (t < 0.25 * T) t += T;
    return t;
  };
  const z1 = zero(w1, ph1);
  const z2 = zero(w2, ph2);

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => setP(preset)}
            className={
              p.name === preset.name
                ? "cursor-pointer rounded-full border-[1.5px] border-ink bg-ink px-3 py-1 text-[12.5px] font-bold text-white"
                : "cursor-pointer rounded-full border-[1.5px] border-rule bg-surface px-3 py-1 text-[12.5px] font-semibold text-muted transition-colors hover:border-ink hover:text-ink"
            }
          >
            {preset.name}
          </button>
        ))}
      </div>

      <StageScroll minWidth={W}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className={`${STAGE_CLASS} select-none`}
          role="img"
          aria-label="Две синусоиди с различни амплитуди, честоти и фази"
        >
          <Stage w={W} h={H} title="ДВЕ СИНУСОИДИ · ФАЗОВАТА РАЗЛИКА Е ИЗМЕСТВАНЕ ПО ВРЕМЕТО" />
          <PlotFrame s={s} xLabel="t" yLabel="y" yLabelColor={C.mut} quarterTicks={false} />

          <path d={s.path(y1, 340)} fill="none" stroke={C.warn} strokeWidth={2.8} />
          <path d={s.path(y2, 340)} fill="none" stroke={C.minus} strokeWidth={2.8} />

          {sameFreq && Math.abs(dPhiDeg) > 0.5 && z1 <= WINDOW && z2 <= WINDOW && (
            <g>
              <line x1={s.sx(z1)} y1={s.y0} x2={s.sx(z1)} y2={s.y0 + 46} stroke={C.warn} strokeDasharray="4 4" />
              <line x1={s.sx(z2)} y1={s.y0} x2={s.sx(z2)} y2={s.y0 + 46} stroke={C.minus} strokeDasharray="4 4" />
              <line x1={s.sx(z1)} y1={s.y0 + 40} x2={s.sx(z2)} y2={s.y0 + 40} stroke={C.plus} strokeWidth={2.6} />
              <SvgTex
                x={s.sx((z1 + z2) / 2)}
                y={s.y0 + 62}
                tex="\Delta t"
                color={C.plus}
                fontSize={13.5}
                width={34}
                anchor="middle"
              />
            </g>
          )}
        </svg>
      </StageScroll>

      <Legend
        items={[
          { color: C.warn, tex: "$y_1=A_1\\sin(\\omega_1 t+\\phi_1)$" },
          { color: C.minus, tex: "$y_2=A_2\\sin(\\omega_2 t+\\phi_2)$" },
        ]}
      />

      <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-3">
        <RangeControl
          label={<RichText text="$A_1$" />}
          value={a1}
          min={1}
          max={10}
          step={0.5}
          valueTex={dec(a1, 1)}
          onChange={(v) => set({ a1: v })}
        />
        <RangeControl
          label={<RichText text="$f_1$" />}
          value={f1}
          min={25}
          max={150}
          step={25}
          valueTex={`${f1}\\,\\mathrm{Hz}`}
          onChange={(v) => set({ f1: v })}
        />
        <RangeControl
          label={<RichText text="$\phi_1$" />}
          value={p1}
          min={-180}
          max={180}
          step={5}
          valueTex={`${p1}^\\circ`}
          onChange={(v) => set({ p1: v })}
        />
        <RangeControl
          label={<RichText text="$A_2$" />}
          value={a2}
          min={1}
          max={10}
          step={0.5}
          valueTex={dec(a2, 1)}
          onChange={(v) => set({ a2: v })}
        />
        <RangeControl
          label={<RichText text="$f_2$" />}
          value={f2}
          min={25}
          max={150}
          step={25}
          valueTex={`${f2}\\,\\mathrm{Hz}`}
          onChange={(v) => set({ f2: v })}
        />
        <RangeControl
          label={<RichText text="$\phi_2$" />}
          value={p2}
          min={-180}
          max={180}
          step={5}
          valueTex={`${p2}^\\circ`}
          onChange={(v) => set({ p2: v })}
        />
      </div>

      {sameFreq ? (
        <Readouts
          cols={4}
          cells={[
            { label: "Фазова разлика", tex: `\\Delta\\phi=${dec(dPhiDeg, 0)}^\\circ`, color: "var(--color-plus)" },
            { label: "В радиани", tex: `\\Delta\\phi=${dec(dPhi, 2)}\\,\\mathrm{rad}`, color: "var(--color-plus)" },
            { label: "Времево изместване", tex: `\\Delta t=${dec(dt * 1000, 2)}\\,\\mathrm{ms}`, color: "var(--color-minus)" },
            { label: "Част от периода", tex: `\\Delta t/T=${dec(dPhiDeg / 360, 3)}`, color: "var(--color-ink)" },
          ]}
        />
      ) : (
        <p className="mt-4 rounded-r-lg border-l-4 border-plus bg-hl px-4 py-3 text-[15px] leading-relaxed">
          <RichText text="**При различни честоти фазова разлика не съществува.** Отместването между двете криви се променя непрекъснато, затова едно число $\Delta\phi$ няма смисъл. Затова целият апарат от следващите секции работи само когато всички величини в веригата се менят с **една и съща** $\omega$ - тази на източника." />
        </p>
      )}
    </div>
  );
}
