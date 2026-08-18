"use client";

import { useRef, useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import { AngleArc, Arrow, BTN_PRI, BTN_SEC, C, PANEL_CLASS, STAGE_CLASS, svgPoint } from "./svg";
import {
  Legend,
  PlotFrame,
  RangeControl,
  Readouts,
  Stage,
  StageScroll,
  Toggle,
  dec,
  scaler,
  useClock,
} from "./acPlot";

/**
 * §5-§6 и §9: въртящият се вектор като източник на синусоидата, две въртящи
 * се стрелки и фазата между тях, и фазорната диаграма на последователна RLC
 * верига. Всички са в едно семейство, защото ползват един и същ мащаб:
 * радиусът на окръжността в пиксели съвпада с полувисочината на графиката,
 * така че проекцията и точката върху кривата са на една височина.
 */

const W = 760;
const H = 380;
const R_MAX = 108; // пиксели за максималната амплитуда
const A_MAX = 11;

/* ============================================ §5 въртящ вектор ↔ синусоида */

export function RotatingVectorLab() {
  const [amp, setAmp] = useState(8);
  const [omega, setOmega] = useState(314);
  const [phiDeg, setPhiDeg] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(0.35);

  const [showX, setShowX] = useState(false);
  const [showY, setShowY] = useState(true);
  const [showAngle, setShowAngle] = useState(true);
  const [showComponents, setShowComponents] = useState(false);

  const { turns, setTurns } = useClock(playing, (speed * omega) / 314, 0.6);

  const phi = (phiDeg * Math.PI) / 180;
  const cycle = ((turns % 2) + 2) % 2;
  const theta = 2 * Math.PI * cycle + phi;

  const cx = 168;
  const s = scaler({ x: 336, y: 84, w: 356, h: 2 * R_MAX }, 2, A_MAX);
  const cy = s.y0;
  const r = (amp / A_MAX) * R_MAX;
  const tipX = cx + r * Math.cos(theta);
  const tipY = cy - r * Math.sin(theta);
  const yVal = amp * Math.sin(theta);
  const xVal = amp * Math.cos(theta);

  const wave = (x: number) => amp * Math.sin(2 * Math.PI * x + phi);
  const freq = omega / (2 * Math.PI);

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-2">
        <button type="button" className={BTN_PRI} onClick={() => setPlaying((p) => !p)}>
          {playing ? "Пауза" : "Завъртете ▶"}
        </button>
        <button
          type="button"
          className={BTN_SEC}
          onClick={() => setSpeed((sp) => (sp === 0.35 ? 0.09 : 0.35))}
        >
          {speed === 0.35 ? "Забавено ▷" : "Нормална скорост"}
        </button>
        <button
          type="button"
          className={BTN_SEC}
          onClick={() => {
            setTurns(0);
            setPlaying(false);
          }}
        >
          Нулиране
        </button>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        <Toggle on={showY} onChange={setShowY}>
          Проекция върху y
        </Toggle>
        <Toggle on={showX} onChange={setShowX}>
          Проекция върху x
        </Toggle>
        <Toggle on={showAngle} onChange={setShowAngle}>
          Ъгъл
        </Toggle>
        <Toggle on={showComponents} onChange={setShowComponents}>
          Компоненти
        </Toggle>
      </div>

      <StageScroll minWidth={W}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className={`${STAGE_CLASS} select-none`}
          role="img"
          aria-label="Равномерно въртящ се вектор и синусоидата, която неговата вертикална проекция изписва"
        >
          <Stage w={W} h={H} title="РАВНОМЕРНО ВЪРТЕНЕ · ВЕРТИКАЛНАТА ПРОЕКЦИЯ Е СИНУСОИДА" />

          {/* --- окръжността --- */}
          <circle cx={cx} cy={cy} r={R_MAX} fill="none" stroke={C.faint} strokeDasharray="4 5" />
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.mut} strokeWidth={1.4} opacity={0.5} />
          <line x1={cx - R_MAX - 18} y1={cy} x2={cx + R_MAX + 18} y2={cy} stroke={C.mut} strokeWidth={1.4} />
          <line x1={cx} y1={cy - R_MAX - 18} x2={cx} y2={cy + R_MAX + 18} stroke={C.mut} strokeWidth={1.4} />

          {showComponents && (
            <>
              <line x1={cx} y1={tipY} x2={tipX} y2={tipY} stroke={C.faint} strokeDasharray="4 4" />
              <line x1={tipX} y1={cy} x2={tipX} y2={tipY} stroke={C.faint} strokeDasharray="4 4" />
            </>
          )}
          {showY && (
            <line x1={cx} y1={cy} x2={cx} y2={tipY} stroke={C.ok} strokeWidth={5} strokeLinecap="round" />
          )}
          {showX && (
            <line x1={cx} y1={cy} x2={tipX} y2={cy} stroke={C.minus} strokeWidth={5} strokeLinecap="round" />
          )}
          {showAngle && r > 30 && Math.abs(Math.sin(theta / 2)) > 0.08 && (
            <AngleArc cx={cx} cy={cy} a1={0} a2={-theta} r={26} color={C.plus} texLabel="\theta" />
          )}
          <Arrow x1={cx} y1={cy} x2={tipX} y2={tipY} color={C.warn} width={3} />
          <SvgTex
            x={cx + (r + 26) * Math.cos(theta)}
            y={cy - (r + 26) * Math.sin(theta)}
            tex="\vec A"
            color={C.warn}
            fontSize={14}
            width={26}
            anchor="middle"
          />
          {/*
            Двата етикета се закачат за краищата на проекциите и винаги от
            противоположни страни на осите: така не се срещат помежду си, нито
            с дъгата на ъгъла, която стои близо до центъра.
          */}
          {showY && Math.abs(yVal) > 0.6 && (
            <SvgTex
              x={tipX > cx ? cx - 30 : cx + 30}
              y={tipY}
              tex="A\sin\theta"
              color={C.ok}
              fontSize={12.5}
              width={62}
              anchor={tipX > cx ? "end" : "start"}
            />
          )}
          {showX && Math.abs(xVal) > 0.6 && (
            <SvgTex
              x={tipX}
              y={tipY > cy ? cy - 30 : cy + 30}
              tex="A\cos\theta"
              color={C.minus}
              fontSize={12.5}
              width={62}
              anchor="middle"
            />
          )}

          {/* --- връзката между двете картини --- */}
          <line
            x1={cx}
            y1={tipY}
            x2={s.sx(cycle)}
            y2={tipY}
            stroke={C.ok}
            strokeWidth={1.4}
            strokeDasharray="5 5"
            opacity={0.75}
          />

          {/* --- графиката --- */}
          <PlotFrame s={s} xLabel="t/T" yLabel="y" yLabelColor={C.warn} periods={2} />
          <path d={s.path(wave, 260)} fill="none" stroke={C.faint} strokeWidth={2} />
          <path d={s.path(wave, 200, 0, Math.max(cycle, 0.001))} fill="none" stroke={C.warn} strokeWidth={2.8} />
          <circle cx={s.sx(cycle)} cy={s.sy(yVal)} r={6} fill={C.ok} />
        </svg>
      </StageScroll>

      <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-3">
        <RangeControl
          label={<RichText text="Амплитуда $A$" />}
          value={amp}
          min={2}
          max={10}
          step={0.5}
          valueTex={dec(amp, 1)}
          onChange={setAmp}
        />
        <RangeControl
          label={<RichText text="Ъглова честота $\omega$" />}
          value={omega}
          min={100}
          max={800}
          step={10}
          valueTex={`${omega}\\,\\mathrm{rad/s}`}
          onChange={setOmega}
        />
        <RangeControl
          label={<RichText text="Фаза $\phi$" />}
          value={phiDeg}
          min={-180}
          max={180}
          step={5}
          valueTex={`${phiDeg}^\\circ`}
          onChange={setPhiDeg}
        />
      </div>

      <label className="mt-3 block">
        <span className="mb-1 flex items-center justify-between gap-3 text-[13px] font-semibold text-muted">
          <span className="text-ink">Ръчно завъртане</span>
          <span className="tabular-nums text-minus">
            <RichText text={`$\\theta=${dec(((theta * 180) / Math.PI) % 360, 0)}^\\circ$`} />
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
        cols={5}
        cells={[
          { label: "Ъгъл", tex: `\\theta=\\omega t+\\phi`, color: "var(--color-plus)" },
          { label: "Проекция y", tex: `A\\sin\\theta=${dec(yVal, 2)}`, color: "var(--color-ok)" },
          { label: "Проекция x", tex: `A\\cos\\theta=${dec(xVal, 2)}`, color: "var(--color-minus)" },
          { label: "Честота", tex: `f=${dec(freq, 1)}\\,\\mathrm{Hz}`, color: "var(--color-ink)" },
          { label: "Период", tex: `T=${dec(1000 / freq, 2)}\\,\\mathrm{ms}`, color: "var(--color-ink)" },
        ]}
      />
    </div>
  );
}

/* ==================================== §6 две въртящи се стрелки и фазата */

export function TwoPhasorLab() {
  const [phi2Deg, setPhi2Deg] = useState(90);
  const [playing, setPlaying] = useState(false);
  const { turns, setTurns } = useClock(playing, 0.25, 0.08);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragging = useRef(false);

  const cycle = ((turns % 2) + 2) % 2;
  const base = 2 * Math.PI * cycle;
  const phi2 = (phi2Deg * Math.PI) / 180;

  const cx = 168;
  const s = scaler({ x: 336, y: 84, w: 356, h: 2 * R_MAX }, 2, A_MAX);
  const cy = s.y0;
  const a1 = 8;
  const a2 = 8;
  const r1 = (a1 / A_MAX) * R_MAX;
  const r2 = (a2 / A_MAX) * R_MAX;

  const t1 = base;
  const t2 = base + phi2;
  /**
   * При малка фазова разлика двете стрелки лягат една върху друга. Отместваме
   * етикетите перпендикулярно с отстъп, който намалява с раздалечаването им.
   */
  const spread = 20 * Math.max(0, 1 - Math.abs(phi2) / 0.55);
  const omega = 314;
  const dt = (phi2 / omega) * 1000;

  const drag = (clientX: number, clientY: number) => {
    if (!svgRef.current) return;
    const [px, py] = svgPoint(svgRef.current, clientX, clientY, W, H);
    const ang = Math.atan2(cy - py, px - cx);
    let next = ((ang - base) * 180) / Math.PI;
    next = ((((next + 180) % 360) + 360) % 360) - 180;
    setPhi2Deg(Math.round(next / 5) * 5);
  };

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-2">
        <button type="button" className={BTN_PRI} onClick={() => setPlaying((p) => !p)}>
          {playing ? "Пауза" : "Завъртете двете ▶"}
        </button>
        <button
          type="button"
          className={BTN_SEC}
          onClick={() => {
            setTurns(0);
            setPlaying(false);
          }}
        >
          Нулиране
        </button>
      </div>

      <StageScroll minWidth={W}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className={`${STAGE_CLASS} cursor-grab select-none`}
          role="img"
          aria-label="Две стрелки с една и съща ъглова скорост; ъгълът между тях е фазовата разлика"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            dragging.current = true;
            drag(event.clientX, event.clientY);
          }}
          onPointerMove={(event) => {
            if (dragging.current) drag(event.clientX, event.clientY);
          }}
          onPointerUp={() => {
            dragging.current = false;
          }}
          onPointerCancel={() => {
            dragging.current = false;
          }}
        >
          <Stage w={W} h={H} title="ВЛАЧЕТЕ ВТОРАТА СТРЕЛКА · ЪГЪЛЪТ МЕЖДУ ТЯХ Е ФАЗОВАТА РАЗЛИКА" />

          <circle cx={cx} cy={cy} r={R_MAX} fill="none" stroke={C.faint} strokeDasharray="4 5" />
          <line x1={cx - R_MAX - 18} y1={cy} x2={cx + R_MAX + 18} y2={cy} stroke={C.mut} strokeWidth={1.4} />
          <line x1={cx} y1={cy - R_MAX - 18} x2={cx} y2={cy + R_MAX + 18} stroke={C.mut} strokeWidth={1.4} />

          {Math.abs(phi2Deg) > 4 && (
            <AngleArc cx={cx} cy={cy} a1={-t1} a2={-t2} r={52} color={C.plus} texLabel="\Delta\phi" />
          )}
          <Arrow
            x1={cx}
            y1={cy}
            x2={cx + r1 * Math.cos(t1)}
            y2={cy - r1 * Math.sin(t1)}
            color={C.warn}
            width={3}
          />
          <Arrow
            x1={cx}
            y1={cy}
            x2={cx + r2 * Math.cos(t2)}
            y2={cy - r2 * Math.sin(t2)}
            color={C.minus}
            width={3}
          />
          <SvgTex
            x={cx + (r1 + 24) * Math.cos(t1) - spread * Math.sin(t1)}
            y={cy - (r1 + 24) * Math.sin(t1) - spread * Math.cos(t1)}
            tex="\vec A_1"
            color={C.warn}
            fontSize={13.5}
            width={30}
            anchor="middle"
          />
          <SvgTex
            x={cx + (r2 + 24) * Math.cos(t2) + spread * Math.sin(t2)}
            y={cy - (r2 + 24) * Math.sin(t2) + spread * Math.cos(t2)}
            tex="\vec A_2"
            color={C.minus}
            fontSize={13.5}
            width={30}
            anchor="middle"
          />

          <PlotFrame s={s} xLabel="t/T" yLabel="y" yLabelColor={C.mut} periods={2} />
          <path
            d={s.path((x) => a1 * Math.sin(2 * Math.PI * x), 260)}
            fill="none"
            stroke={C.warn}
            strokeWidth={2.6}
          />
          <path
            d={s.path((x) => a2 * Math.sin(2 * Math.PI * x + phi2), 260)}
            fill="none"
            stroke={C.minus}
            strokeWidth={2.6}
          />
          <circle cx={s.sx(cycle)} cy={s.sy(a1 * Math.sin(t1))} r={5.5} fill={C.warn} />
          <circle cx={s.sx(cycle)} cy={s.sy(a2 * Math.sin(t2))} r={5.5} fill={C.minus} />
          <line
            x1={s.sx(cycle)}
            y1={s.box.y}
            x2={s.sx(cycle)}
            y2={s.box.y + s.box.h}
            stroke={C.faint}
            strokeDasharray="4 4"
          />
        </svg>
      </StageScroll>

      <div className="mt-4">
        <RangeControl
          label={<RichText text="Фаза на втората стрелка $\phi_2$" />}
          value={phi2Deg}
          min={-180}
          max={180}
          step={5}
          valueTex={`${phi2Deg}^\\circ`}
          onChange={setPhi2Deg}
        />
      </div>

      <Readouts
        cols={4}
        cells={[
          { label: "Фазова разлика", tex: `\\Delta\\phi=${phi2Deg}^\\circ`, color: "var(--color-plus)" },
          { label: "В радиани", tex: `\\Delta\\phi=${dec(phi2, 2)}`, color: "var(--color-plus)" },
          {
            label: "Изместване",
            tex: `\\Delta t=${dec(dt, 2)}\\,\\mathrm{ms}`,
            color: "var(--color-minus)",
          },
          { label: "Част от периода", tex: `\\Delta t/T=${dec(phi2Deg / 360, 3)}`, color: "var(--color-ink)" },
        ]}
      />
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Двете стрелки се въртят с една и съща $\omega$, затова ъгълът между тях не се променя с времето. Точно това постоянство прави фазорите използваеми: цялата информация е в дължините и в един неподвижен ъгъл." />
      </p>
    </div>
  );
}

/* ================================================ §9 фазори за RLC верига */

export function RLCPhasorLab() {
  const [res, setRes] = useState(60);
  const [ind, setInd] = useState(0.12);
  const [cap, setCap] = useState(40);
  const [freq, setFreq] = useState(50);
  const [i0, setI0] = useState(1.2);
  const [rotating, setRotating] = useState(false);
  const [showParts, setShowParts] = useState(true);
  const [showSum, setShowSum] = useState(true);
  const { turns, setTurns } = useClock(rotating, 0.16);

  const omega = 2 * Math.PI * freq;
  const xl = omega * ind;
  const xc = 1 / (omega * cap * 1e-6);
  const vr = i0 * res;
  const vl = i0 * xl;
  const vc = i0 * xc;
  const vy = vl - vc;
  const v0 = Math.hypot(vr, vy);
  const phi = Math.atan2(vy, vr);

  const SW = 460;
  const SH = 430;
  const cx = SW / 2;
  const cy = SH / 2;
  const span = Math.max(vr, vl, vc, v0, 1);
  const k = 158 / span; // пиксели на волт
  const base = 2 * Math.PI * (((turns % 1) + 1) % 1);

  const rot = (x: number, y: number): [number, number] => [
    cx + k * (x * Math.cos(base) - y * Math.sin(base)),
    cy - k * (x * Math.sin(base) + y * Math.cos(base)),
  ];
  const [rx, ry] = rot(vr, 0);
  const [lx, ly] = rot(0, vl);
  const [cxx, cyy] = rot(0, -vc);
  const [sx, sy] = rot(vr, vy);

  const iLen = 92;
  /**
   * Токът е успореден на V_R, затова стрелката му се изнася перпендикулярно
   * (както размерна линия): иначе по-дългият фазор на резистора я поглъща.
   */
  const iOff = 18;
  const iStartX = cx + iOff * Math.sin(base);
  const iStartY = cy + iOff * Math.cos(base);
  const [iEndX, iEndY] = [iStartX + iLen * Math.cos(base), iStartY - iLen * Math.sin(base)];

  const character = Math.abs(xl - xc) / Math.max(res, 1) < 0.02 ? "resonant" : xl > xc ? "inductive" : "capacitive";

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-2">
        <button type="button" className={BTN_PRI} onClick={() => setRotating((r) => !r)}>
          {rotating ? "Замразете" : "Завъртете ▶"}
        </button>
        <button
          type="button"
          className={BTN_SEC}
          onClick={() => {
            setTurns(0);
            setRotating(false);
          }}
        >
          Изправете по хоризонтала
        </button>
        <Toggle on={showParts} onChange={setShowParts}>
          Компоненти
        </Toggle>
        <Toggle on={showSum} onChange={setShowSum}>
          Векторна сума
        </Toggle>
      </div>

      <StageScroll minWidth={320} maxWidth={520}>
        <svg
          viewBox={`0 0 ${SW} ${SH}`}
          className={`${STAGE_CLASS} select-none`}
          role="img"
          aria-label="Фазорна диаграма на последователна RLC верига с ток за отправна посока"
        >
          <Stage w={SW} h={SH} title="ФАЗОРИ · ТОКЪТ Е ОТПРАВНАТА ПОСОКА" />
          <circle cx={cx} cy={cy} r={168} fill="none" stroke={C.faint} strokeDasharray="4 6" />

          {/* токът — обща за трите елемента отправна посока */}
          <Arrow x1={iStartX} y1={iStartY} x2={iEndX} y2={iEndY} color={C.ok} width={3.4} />
          <SvgTex
            x={iStartX + (iLen + 24) * Math.cos(base)}
            y={iStartY - (iLen + 24) * Math.sin(base)}
            tex="\vec I"
            color={C.ok}
            fontSize={14}
            width={24}
            anchor="middle"
          />

          {showParts && (
            <>
              <Arrow x1={cx} y1={cy} x2={rx} y2={ry} color={C.plus} width={3} />
              <Arrow x1={cx} y1={cy} x2={lx} y2={ly} color={C.warn} width={3} />
              <Arrow x1={cx} y1={cy} x2={cxx} y2={cyy} color={C.minus} width={3} />
              <g opacity={Math.abs(phi) < 0.14 ? 0.22 : 1}>
                <SvgTex
                  x={cx + (k * vr + 22) * Math.cos(base)}
                  y={cy - (k * vr + 22) * Math.sin(base)}
                  tex="\vec V_R"
                  color={C.plus}
                  fontSize={13.5}
                  width={32}
                  anchor="middle"
                />
              </g>
              <g opacity={vl * k < 24 || Math.abs(phi - Math.PI / 2) < 0.3 ? 0.22 : 1}>
                <SvgTex
                  x={cx - (k * vl + 22) * Math.sin(base)}
                  y={cy - (k * vl + 22) * Math.cos(base)}
                  tex="\vec V_L"
                  color={C.warn}
                  fontSize={13.5}
                  width={32}
                  anchor="middle"
                />
              </g>
              <g opacity={vc * k < 24 || Math.abs(phi + Math.PI / 2) < 0.3 ? 0.22 : 1}>
                <SvgTex
                  x={cx + (k * vc + 22) * Math.sin(base)}
                  y={cy + (k * vc + 22) * Math.cos(base)}
                  tex="\vec V_C"
                  color={C.minus}
                  fontSize={13.5}
                  width={32}
                  anchor="middle"
                />
              </g>
            </>
          )}

          {showSum && (
            <>
              {/* геометрията на събирането: V_R + (V_L − V_C) */}
              <line
                x1={rx}
                y1={ry}
                x2={sx}
                y2={sy}
                stroke={C.faint}
                strokeWidth={1.8}
                strokeDasharray="5 4"
              />
              <line
                x1={cx}
                y1={cy}
                x2={cx - k * vy * Math.sin(base)}
                y2={cy - k * vy * Math.cos(base)}
                stroke={C.mut}
                strokeWidth={2}
                strokeDasharray="5 4"
              />
              <Arrow x1={cx} y1={cy} x2={sx} y2={sy} color={C.wire} width={3.6} />
              <SvgTex
                x={cx + (k * v0 + 26) * Math.cos(base + phi)}
                y={cy - (k * v0 + 26) * Math.sin(base + phi)}
                tex="\vec V"
                color={C.wire}
                fontSize={14.5}
                width={26}
                anchor="middle"
              />
              {Math.abs(phi) > 0.14 && (
                <AngleArc cx={cx} cy={cy} a1={-base} a2={-(base + phi)} r={64} color={C.mut} texLabel="\phi" />
              )}
            </>
          )}
        </svg>
      </StageScroll>

      <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
        <RangeControl
          label={<RichText text="Съпротивление $R$" />}
          value={res}
          min={10}
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
          min={5}
          max={200}
          step={5}
          valueTex={`${cap}\\,\\mu\\mathrm{F}`}
          onChange={setCap}
        />
        <RangeControl
          label={<RichText text="Честота $f$" />}
          value={freq}
          min={10}
          max={200}
          step={1}
          valueTex={`${freq}\\,\\mathrm{Hz}`}
          onChange={setFreq}
        />
        <RangeControl
          label={<RichText text="Амплитуда на тока $I_0$" />}
          value={i0}
          min={0.2}
          max={3}
          step={0.1}
          valueTex={`${dec(i0, 1)}\\,\\mathrm{A}`}
          onChange={setI0}
        />
      </div>

      <Readouts
        cols={5}
        cells={[
          { label: "Върху R", tex: `V_R=${dec(vr, 1)}\\,\\mathrm{V}`, color: "var(--color-plus)" },
          { label: "Върху L", tex: `V_L=${dec(vl, 1)}\\,\\mathrm{V}`, color: "var(--color-warn)" },
          { label: "Върху C", tex: `V_C=${dec(vc, 1)}\\,\\mathrm{V}`, color: "var(--color-minus)" },
          { label: "Резултат", tex: `V_0=${dec(v0, 1)}\\,\\mathrm{V}`, color: "var(--color-ink)" },
          {
            label: "Фазов ъгъл",
            tex: `\\phi=${dec((phi * 180) / Math.PI, 1)}^\\circ`,
            color: "var(--color-ok)",
          },
        ]}
      />

      <p className="mt-3 rounded-r-lg border-l-4 border-minus bg-hl px-4 py-2.5 text-[14.5px] leading-relaxed">
        {character === "resonant" ? (
          <RichText text="**Сега $X_L=X_C$:** двете вертикални стрелки се унищожават и $\vec V$ ляга точно върху $\vec I$. Сумата на две ненулеви напрежения е нула - нещо, което скаларното мислене не допуска." />
        ) : character === "inductive" ? (
          <RichText text="**Сега $X_L>X_C$:** остатъкът сочи нагоре, $\vec V$ изпреварва $\vec I$ и веригата се държи индуктивно ($\phi>0$)." />
        ) : (
          <RichText text="**Сега $X_C>X_L$:** остатъкът сочи надолу, $\vec V$ изостава от $\vec I$ и веригата се държи капацитивно ($\phi<0$)." />
        )}
      </p>

      <Legend
        items={[
          { color: C.ok, tex: "$\\vec I$ (обща за трите елемента; изнесена настрани, за да не се слива с $\\vec V_R$)" },
          { color: C.plus, tex: "$\\vec V_R$" },
          { color: C.warn, tex: "$\\vec V_L$" },
          { color: C.minus, tex: "$\\vec V_C$" },
          { color: C.wire, tex: "$\\vec V$ (сума)" },
        ]}
      />
    </div>
  );
}
