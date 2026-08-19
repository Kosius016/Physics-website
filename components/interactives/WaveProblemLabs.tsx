"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import { AngleArc, Arrow, BTN_PRI, BTN_SEC, C, PANEL_CLASS, STAGE_CLASS } from "./svg";
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
 * Интерактиви към домашната работа „честота, период и вълни“.
 *
 * Ползват общия инструментариум от acPlot.tsx, затова числата в графиката и в
 * readout лентата под нея се смятат на едно място и не могат да се разминат.
 * Сцените са с ширината на текстовата колона, без изнасяне в полето.
 */

const W = 640;
const H = 340;
const MINW = 520;

/* ============================================ §I въртене, честота и период */

/** Свързва трите записа на едно и също движение: обиколки, ъгъл и време. */
export function RotationLab() {
  const [radius, setRadius] = useState(0.25);
  const [freq, setFreq] = useState(3);
  const [playing, setPlaying] = useState(false);
  const { turns, setTurns } = useClock(playing, 0.35, 0.18);

  const omega = 2 * Math.PI * freq;
  const period = 1 / freq;
  const speed = radius * omega;
  const theta = 2 * Math.PI * turns;
  const elapsed = turns * period;

  const cx = 176;
  const cy = 174;
  const rPix = 40 + 92 * (radius / 0.5);

  const s = scaler({ x: 366, y: 66, w: 216, h: 216 }, 2, 1.15);
  const wave = (x: number) => Math.sin(2 * Math.PI * x);
  const cycle = ((turns % 2) + 2) % 2;

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-2">
        <button type="button" className={BTN_PRI} onClick={() => setPlaying((p) => !p)}>
          {playing ? "Пауза" : "Завъртете ▶"}
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

      <StageScroll minWidth={MINW}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className={`${STAGE_CLASS} select-none`}
          role="img"
          aria-label="Точка по окръжност и вертикалната ѝ проекция като функция от времето"
        >
          <Stage w={W} h={H} title="ЕДНО ДВИЖЕНИЕ, ТРИ ЗАПИСА · ОБИКОЛКИ, ЪГЪЛ, ВРЕМЕ" />

          <circle cx={cx} cy={cy} r={rPix} fill="none" stroke={C.mut} strokeWidth={1.8} />
          <line x1={cx - rPix - 16} y1={cy} x2={cx + rPix + 16} y2={cy} stroke={C.faint} strokeWidth={1.2} />
          <line x1={cx} y1={cy - rPix - 16} x2={cx} y2={cy + rPix + 16} stroke={C.faint} strokeWidth={1.2} />

          {Math.abs(Math.sin(theta / 2)) > 0.06 && (
            <AngleArc cx={cx} cy={cy} a1={0} a2={-theta} r={30} color={C.plus} texLabel="\theta" />
          )}
          <Arrow
            x1={cx}
            y1={cy}
            x2={cx + rPix * Math.cos(theta)}
            y2={cy - rPix * Math.sin(theta)}
            color={C.warn}
            width={2.8}
          />
          <SvgTex
            x={cx - rPix / 2}
            y={cy - 12}
            tex="R"
            color={C.warn}
            fontSize={13}
            width={18}
            anchor="middle"
          />
          <circle
            cx={cx + rPix * Math.cos(theta)}
            cy={cy - rPix * Math.sin(theta)}
            r={7}
            fill={C.ok}
          />
          {/* скоростта е допирателна към окръжността */}
          <Arrow
            x1={cx + rPix * Math.cos(theta)}
            y1={cy - rPix * Math.sin(theta)}
            x2={cx + rPix * Math.cos(theta) - 42 * Math.sin(theta)}
            y2={cy - rPix * Math.sin(theta) - 42 * Math.cos(theta)}
            color={C.minus}
            width={2.6}
            texLabel="\vec v"
            texLabelWidth={22}
          />

          <PlotFrame s={s} xLabel="t/T" yLabel="y" yLabelColor={C.ok} periods={2} />
          <path d={s.path(wave, 220)} fill="none" stroke={C.faint} strokeWidth={2} />
          <path d={s.path(wave, 160, 0, Math.max(cycle, 0.001))} fill="none" stroke={C.ok} strokeWidth={2.8} />
          <line
            x1={cx + rPix * Math.cos(theta)}
            y1={cy - rPix * Math.sin(theta)}
            x2={s.sx(cycle)}
            y2={cy - rPix * Math.sin(theta)}
            stroke={C.ok}
            strokeWidth={1.2}
            strokeDasharray="5 5"
            opacity={0.6}
          />
          <circle cx={s.sx(cycle)} cy={s.sy(Math.sin(theta))} r={5.5} fill={C.ok} />
        </svg>
      </StageScroll>

      <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
        <RangeControl
          label={<RichText text="Радиус $R$" />}
          value={radius}
          min={0.05}
          max={0.5}
          step={0.05}
          valueTex={`${dec(radius, 2)}\\,\\mathrm{m}`}
          onChange={setRadius}
        />
        <RangeControl
          label={<RichText text="Честота $f$ (обиколки за секунда)" />}
          value={freq}
          min={0.5}
          max={6}
          step={0.5}
          valueTex={`${dec(freq, 1)}\\,\\mathrm{Hz}`}
          onChange={setFreq}
        />
      </div>

      <Readouts
        cols={5}
        cells={[
          { label: "Период", tex: `T=${dec(period, 3)}\\,\\mathrm{s}`, color: "var(--color-ink)" },
          { label: "Ъглова честота", tex: `\\omega=${dec(omega, 2)}\\,\\mathrm{rad/s}`, color: "var(--color-plus)" },
          { label: "Линейна скорост", tex: `v=R\\omega=${dec(speed, 2)}\\,\\mathrm{m/s}`, color: "var(--color-minus)" },
          { label: "Изминат ъгъл", tex: `\\theta=${dec(theta, 2)}\\,\\mathrm{rad}`, color: "var(--color-warn)" },
          { label: "Изминато време", tex: `t=${dec(elapsed, 3)}\\,\\mathrm{s}`, color: "var(--color-muted)" },
        ]}
      />
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Задръжте $f$ и менете само $R$: ъгловата честота не мърда, а линейната скорост се мени. Точно това прави възможно две точки с различни $\omega$ да имат еднаква скорост, стига произведението $R\omega$ да съвпада." />
      </p>
    </div>
  );
}

/* ================================ §II хармонично трептене и стойности по време */

export function HarmonicSampleLab() {
  const [amp, setAmp] = useState(4);
  const [freq, setFreq] = useState(5);
  const [showQuarters, setShowQuarters] = useState(true);

  const omega = 2 * Math.PI * freq;
  const period = 1 / freq;
  const s = scaler({ x: 90, y: 56, w: 456, h: 232 }, 2 * period, amp * 1.25);
  const y = (t: number) => amp * Math.sin(omega * t);
  const marks = [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((k) => k * period);

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-1.5">
        <Toggle on={showQuarters} onChange={setShowQuarters}>
          Четвъртини от периода
        </Toggle>
      </div>

      <StageScroll minWidth={MINW}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className={`${STAGE_CLASS} select-none`}
          role="img"
          aria-label="Хармонично трептене за два периода с отбелязани четвъртини от периода"
        >
          <Stage w={W} h={H} title="ДВА ПЪЛНИ ПЕРИОДА · СТОЙНОСТИТЕ ПАДАТ НА ЧЕТВЪРТИНИТЕ" />
          <PlotFrame s={s} xLabel="t\ (\mathrm{s})" yLabel="y\ (\mathrm{cm})" yLabelColor={C.warn} periods={2} />
          <path d={s.path(y, 320)} fill="none" stroke={C.warn} strokeWidth={3} />

          {showQuarters &&
            marks.map((t) => (
              <g key={t}>
                <line
                  x1={s.sx(t)}
                  y1={s.y0}
                  x2={s.sx(t)}
                  y2={s.sy(y(t))}
                  stroke={C.faint}
                  strokeDasharray="4 4"
                />
                <circle cx={s.sx(t)} cy={s.sy(y(t))} r={5} fill={C.ok} />
              </g>
            ))}
          <line
            x1={s.sx(0)}
            y1={s.sy(amp)}
            x2={s.sx(2 * period)}
            y2={s.sy(amp)}
            stroke={C.minus}
            strokeWidth={1.4}
            strokeDasharray="7 5"
          />
          <SvgTex
            x={s.sx(2 * period) - 4}
            y={s.sy(amp) - 15}
            tex="A"
            color={C.minus}
            fontSize={13}
            width={18}
            anchor="end"
          />
          <line
            x1={s.sx(0)}
            y1={s.sy(-amp * 1.12)}
            x2={s.sx(period)}
            y2={s.sy(-amp * 1.12)}
            stroke={C.plus}
            strokeWidth={2.4}
          />
          <SvgTex
            x={s.sx(period / 2)}
            y={s.sy(-amp * 1.12) + 18}
            tex="T"
            color={C.plus}
            fontSize={13}
            width={18}
            anchor="middle"
          />
        </svg>
      </StageScroll>

      <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
        <RangeControl
          label={<RichText text="Амплитуда $A$" />}
          value={amp}
          min={1}
          max={8}
          step={0.5}
          valueTex={`${dec(amp, 1)}\\,\\mathrm{cm}`}
          onChange={setAmp}
        />
        <RangeControl
          label={<RichText text="Честота $f$" />}
          value={freq}
          min={1}
          max={10}
          step={0.5}
          valueTex={`${dec(freq, 1)}\\,\\mathrm{Hz}`}
          onChange={setFreq}
        />
      </div>

      <Readouts
        cols={5}
        cells={[
          { label: "Ъглова честота", tex: `\\omega=${dec(omega, 2)}\\,\\mathrm{rad/s}`, color: "var(--color-plus)" },
          { label: "Период", tex: `T=${dec(period, 3)}\\,\\mathrm{s}`, color: "var(--color-ink)" },
          { label: "При $T/4$", tex: `y=${dec(y(period / 4), 2)}\\,\\mathrm{cm}`, color: "var(--color-ok)" },
          { label: "При $T/2$", tex: `y=${dec(Math.abs(y(period / 2)) < 1e-9 ? 0 : y(period / 2), 2)}\\,\\mathrm{cm}`, color: "var(--color-ok)" },
          { label: "При $3T/4$", tex: `y=${dec(y((3 * period) / 4), 2)}\\,\\mathrm{cm}`, color: "var(--color-ok)" },
        ]}
      />
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Зелените точки стоят на всяка четвъртина от периода. Затова стойностите се повтарят по схемата $0,\ +A,\ 0,\ -A$: не заради конкретните числа, а заради това къде падат четвъртините." />
      </p>
    </div>
  );
}

/* ========================================= §III дължина на вълната срещу честота */

const SPEED_PRESETS = [
  { name: "Въже", v: 12 },
  { name: "Задача 8", v: 20 },
  { name: "Звук във въздух", v: 340 },
];

export function LambdaFreqLab() {
  const [speed, setSpeed] = useState(20);
  const [freq, setFreq] = useState(5);

  const lambda = speed / freq;
  const F_MAX = 12;
  const yMax = speed / 1.6;
  const s = scaler({ x: 96, y: 56, w: 448, h: 232 }, F_MAX, yMax, 0);

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {SPEED_PRESETS.map((preset) => (
          <button
            key={preset.name}
            type="button"
            className={BTN_SEC}
            onClick={() => setSpeed(preset.v)}
          >
            {preset.name}
          </button>
        ))}
      </div>

      <StageScroll minWidth={MINW}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className={`${STAGE_CLASS} select-none`}
          role="img"
          aria-label="Дължината на вълната като функция от честотата при постоянна скорост"
        >
          <Stage w={W} h={H} title="ПРИ ПОСТОЯННА СКОРОСТ ПРОИЗВЕДЕНИЕТО λf НЕ СЕ МЕНИ" />
          <PlotFrame s={s} xLabel="f\ (\mathrm{Hz})" yLabel="\lambda\ (\mathrm{m})" yLabelColor={C.minus} quarterTicks={false} />

          <path
            d={s.path((f) => speed / f, 260, 0.35, F_MAX)}
            fill="none"
            stroke={C.minus}
            strokeWidth={3}
          />
          <line x1={s.sx(freq)} y1={s.box.y} x2={s.sx(freq)} y2={s.y0} stroke={C.warn} strokeWidth={1.8} />
          <line
            x1={s.box.x}
            y1={s.sy(Math.min(lambda, yMax))}
            x2={s.sx(freq)}
            y2={s.sy(Math.min(lambda, yMax))}
            stroke={C.faint}
            strokeDasharray="5 4"
          />
          <circle cx={s.sx(freq)} cy={s.sy(Math.min(lambda, yMax))} r={6} fill={C.warn} />
        </svg>
      </StageScroll>

      <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
        <RangeControl
          label={<RichText text="Скорост на вълната $v$" />}
          value={speed}
          min={4}
          max={360}
          step={2}
          valueTex={`${dec(speed, 0)}\\,\\mathrm{m/s}`}
          onChange={setSpeed}
        />
        <RangeControl
          label={<RichText text="Честота $f$" />}
          value={freq}
          min={0.5}
          max={12}
          step={0.5}
          valueTex={`${dec(freq, 1)}\\,\\mathrm{Hz}`}
          onChange={setFreq}
        />
      </div>

      <Readouts
        cols={4}
        cells={[
          { label: "Дължина на вълната", tex: `\\lambda=${dec(lambda, 3)}\\,\\mathrm{m}`, color: "var(--color-minus)" },
          { label: "Период", tex: `T=${dec(1 / freq, 3)}\\,\\mathrm{s}`, color: "var(--color-ink)" },
          { label: "Произведение", tex: `\\lambda f=${dec(lambda * freq, 1)}\\,\\mathrm{m/s}`, color: "var(--color-ok)" },
          { label: "При двойна честота", tex: `\\lambda=${dec(speed / (2 * freq), 3)}\\,\\mathrm{m}`, color: "var(--color-muted)" },
        ]}
      />
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Кривата е хипербола: удвояването на честотата намалява наполовина дължината на вълната. Забележете, че третата лента не се променя при движение на плъзгача за $f$ - тя е скоростта, а тя се определя от средата, не от източника." />
      </p>
    </div>
  );
}

/* ================================================= §IV фаза и §V интерференция */

/**
 * Две трептения с еднаква честота: фазовата разлика, времевото отместване и
 * резултантната амплитуда $2A\cos(\Delta\varphi/2)$ на едно място.
 */
export function InterferenceLab() {
  const [phiDeg, setPhiDeg] = useState(90);
  const [freq, setFreq] = useState(2);
  const [showSum, setShowSum] = useState(true);

  const amp = 1;
  const phi = (phiDeg * Math.PI) / 180;
  const period = 1 / freq;
  const omega = 2 * Math.PI * freq;
  const dt = phi / omega;
  const sumAmp = 2 * amp * Math.abs(Math.cos(phi / 2));

  const s = scaler({ x: 90, y: 56, w: 456, h: 232 }, period, 2.4);
  const y1 = (t: number) => amp * Math.sin(omega * t);
  const y2 = (t: number) => amp * Math.sin(omega * t + phi);
  const ySum = (t: number) => y1(t) + y2(t);

  const kind =
    Math.abs(sumAmp - 2 * amp) < 1e-6
      ? "конструктивна"
      : sumAmp < 1e-6
        ? "деструктивна"
        : "междинна";

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {[0, 45, 90, 180].map((d) => (
          <button key={d} type="button" className={BTN_SEC} onClick={() => setPhiDeg(d)}>
            {d}°
          </button>
        ))}
        <Toggle on={showSum} onChange={setShowSum}>
          Сумата
        </Toggle>
      </div>

      <StageScroll minWidth={MINW}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className={`${STAGE_CLASS} select-none`}
          role="img"
          aria-label="Две трептения с еднаква честота и различна фаза заедно с тяхната сума"
        >
          <Stage w={W} h={H} title="СЪБИРАТ СЕ МОМЕНТНИТЕ ОТКЛОНЕНИЯ, НЕ АМПЛИТУДИТЕ" />
          <PlotFrame s={s} xLabel="t\ (\mathrm{s})" yLabel="y" yLabelColor={C.mut} periods={1} />

          {showSum && <path d={s.path(ySum, 300)} fill="none" stroke={C.ok} strokeWidth={3.4} />}
          <path d={s.path(y1, 300)} fill="none" stroke={C.warn} strokeWidth={2.4} />
          <path d={s.path(y2, 300)} fill="none" stroke={C.minus} strokeWidth={2.4} />

          {Math.abs(phiDeg) > 1 && dt < period && (
            <g>
              <line x1={s.sx(0)} y1={s.y0} x2={s.sx(0)} y2={s.y0 + 44} stroke={C.warn} strokeDasharray="4 4" />
              <line
                x1={s.sx(period - dt)}
                y1={s.y0}
                x2={s.sx(period - dt)}
                y2={s.y0 + 44}
                stroke={C.minus}
                strokeDasharray="4 4"
              />
              <line
                x1={s.sx(period - dt)}
                y1={s.y0 + 38}
                x2={s.sx(period)}
                y2={s.y0 + 38}
                stroke={C.plus}
                strokeWidth={2.6}
              />
              <SvgTex
                x={s.sx(period - dt / 2)}
                y={s.y0 + 58}
                tex="\Delta t"
                color={C.plus}
                fontSize={12.5}
                width={30}
                anchor="middle"
              />
            </g>
          )}
        </svg>
      </StageScroll>

      <Legend
        items={[
          { color: C.warn, tex: "$y_1=A\\sin\\omega t$" },
          { color: C.minus, tex: "$y_2=A\\sin(\\omega t+\\Delta\\varphi)$" },
          { color: C.ok, tex: "$y_1+y_2$" },
        ]}
      />

      <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
        <RangeControl
          label={<RichText text="Фазова разлика $\Delta\varphi$" />}
          value={phiDeg}
          min={0}
          max={360}
          step={5}
          valueTex={`${phiDeg}^\\circ`}
          onChange={setPhiDeg}
        />
        <RangeControl
          label={<RichText text="Честота $f$" />}
          value={freq}
          min={1}
          max={5}
          step={0.5}
          valueTex={`${dec(freq, 1)}\\,\\mathrm{Hz}`}
          onChange={setFreq}
        />
      </div>

      <Readouts
        cols={5}
        cells={[
          { label: "В радиани", tex: `\\Delta\\varphi=${dec(phi, 2)}`, color: "var(--color-plus)" },
          { label: "Част от периода", tex: `${dec(phiDeg / 360, 3)}\\,T`, color: "var(--color-muted)" },
          { label: "Отместване", tex: `\\Delta t=${dec(dt, 3)}\\,\\mathrm{s}`, color: "var(--color-minus)" },
          {
            label: "Резултантна амплитуда",
            tex: `${dec(sumAmp, 3)}\\,A`,
            color: "var(--color-ok)",
          },
          { label: "Вид", tex: `\\text{${kind}}`, color: "var(--color-ink)" },
        ]}
      />
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Резултантната амплитуда следва $2A\cos(\Delta\varphi/2)$: максимална е при $0$, нула при $180^\circ$, а при $90^\circ$ е $\sqrt2\,A\approx1{,}41\,A$ - нито едното, нито другото. Същата стойност излиза и от разликата в пътищата чрез $\Delta\varphi=2\pi\,\Delta r/\lambda$." />
      </p>
    </div>
  );
}

/* ===================================================== §VI различни честоти и биения */

export function BeatsLab() {
  const [f1, setF1] = useState(10);
  const [f2, setF2] = useState(12);
  const [showEnvelope, setShowEnvelope] = useState(true);

  const beat = Math.abs(f2 - f1);
  const tBeat = beat > 0 ? 1 / beat : Infinity;
  const T_MAX = 2;
  const s = scaler({ x: 90, y: 56, w: 456, h: 232 }, T_MAX, 2.4);

  const sum = (t: number) => Math.sin(2 * Math.PI * f1 * t) + Math.sin(2 * Math.PI * f2 * t);
  const env = (t: number) => 2 * Math.cos(Math.PI * (f2 - f1) * t);

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-1.5">
        <Toggle on={showEnvelope} onChange={setShowEnvelope}>
          Обвивка
        </Toggle>
      </div>

      <StageScroll minWidth={MINW}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className={`${STAGE_CLASS} select-none`}
          role="img"
          aria-label="Сума на две трептения с близки честоти и нейната обвивка, тоест биенията"
        >
          <Stage w={W} h={H} title="ДВЕ БЛИЗКИ ЧЕСТОТИ · СИЛАТА НА ЗВУКА ПУЛСИРА" />
          <PlotFrame s={s} xLabel="t\ (\mathrm{s})" yLabel="y_1+y_2" yLabelColor={C.ok} quarterTicks={false} />

          {showEnvelope && (
            <>
              <path d={s.path(env, 300)} fill="none" stroke={C.plus} strokeWidth={2} strokeDasharray="7 5" />
              <path
                d={s.path((t) => -env(t), 300)}
                fill="none"
                stroke={C.plus}
                strokeWidth={2}
                strokeDasharray="7 5"
              />
            </>
          )}
          <path d={s.path(sum, 900)} fill="none" stroke={C.ok} strokeWidth={2} />

          {beat > 0 && tBeat <= T_MAX && (
            <>
              <line
                x1={s.sx(0)}
                y1={s.sy(-2.2)}
                x2={s.sx(tBeat)}
                y2={s.sy(-2.2)}
                stroke={C.warn}
                strokeWidth={2.6}
              />
              <SvgTex
                x={s.sx(tBeat / 2)}
                y={s.sy(-2.2) + 18}
                tex="T_{\text{биене}}"
                color={C.warn}
                fontSize={12.5}
                width={56}
                anchor="middle"
              />
            </>
          )}
        </svg>
      </StageScroll>

      <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
        <RangeControl
          label={<RichText text="Първа честота $f_1$" />}
          value={f1}
          min={6}
          max={16}
          step={0.5}
          valueTex={`${dec(f1, 1)}\\,\\mathrm{Hz}`}
          onChange={setF1}
        />
        <RangeControl
          label={<RichText text="Втора честота $f_2$" />}
          value={f2}
          min={6}
          max={16}
          step={0.5}
          valueTex={`${dec(f2, 1)}\\,\\mathrm{Hz}`}
          onChange={setF2}
        />
      </div>

      <Readouts
        cols={4}
        cells={[
          { label: "Честота на биенията", tex: `f_{\\text{б}}=${dec(beat, 1)}\\,\\mathrm{Hz}`, color: "var(--color-plus)" },
          {
            label: "Между два максимума",
            tex: beat > 0 ? `${dec(tBeat, 3)}\\,\\mathrm{s}` : `\\infty`,
            color: "var(--color-warn)",
          },
          {
            label: "Максимуми за 10 s",
            tex: `${dec(beat * 10, 0)}`,
            color: "var(--color-ink)",
          },
          {
            label: "Фазовата разлика расте с",
            tex: `2\\pi\\,${dec(beat, 1)}\\,t`,
            color: "var(--color-muted)",
          },
        ]}
      />
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Изравнете двете честоти: биенията се разреждат и в границата изчезват. Точно това слуша настройчикът на пиано. Честотите тук са понижени, за да се вижда картината, но математиката е същата при $256$ и $260\,\mathrm{Hz}$ - там обвивката пулсира 4 пъти в секунда." />
      </p>
    </div>
  );
}
