"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import {
  AngleArc,
  Arrow,
  BTN_PRI,
  BTN_SEC,
  C,
  DRAWING_FONT_FAMILY,
  PANEL_CLASS,
  STAGE_BG,
  STAGE_CLASS,
} from "./svg";
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
 * ВАЖНО ЗА ВСИЧКИ СЦЕНИ ТУК: осите са **фиксирани**, а не изведени от текущите
 * стойности на плъзгачите. Ако прозорецът по времето е „два периода“, а
 * вертикалният обхват е „амплитудата“, кривата се пренормира заедно с
 * параметъра и изглежда неподвижна, макар числата да се менят. Затова:
 *   - времевият прозорец е в секунди и е константа;
 *   - вертикалният обхват е константа в реални единици.
 * Така всеки плъзгач има видим ефект върху картината.
 */

const W = 640;
const H = 340;
const MINW = 520;

/* ============================================ §1 въртене, честота и период */

const R_MAX = 0.5; // метри: горната граница на радиуса, задава мащаба
const ROT_WINDOW = 1.0; // секунда: фиксиран прозорец на графиката

/**
 * Свързва трите записа на едно и също движение: обиколки, ъгъл и време.
 * Радиусът на окръжността в пиксели съвпада с вертикалния мащаб на графиката,
 * затова проекцията на върха и точката върху кривата са на една височина.
 */
export function RotationLab() {
  const [radius, setRadius] = useState(0.25);
  const [freq, setFreq] = useState(3);
  const [playing, setPlaying] = useState(false);
  const { turns, setTurns } = useClock(playing, 0.35, 0.12);

  const omega = 2 * Math.PI * freq;
  const period = 1 / freq;
  const speed = radius * omega;

  /** turns върви в секунди симулирано време (забавено спрямо стенното). */
  const tSim = turns;
  const theta = omega * tSim;
  const tVis = ((tSim % ROT_WINDOW) + ROT_WINDOW) % ROT_WINDOW;

  const s = scaler({ x: 316, y: 58, w: 258, h: 240 }, ROT_WINDOW, R_MAX);
  const cx = 152;
  const cy = s.y0;
  const half = s.box.h / 2;
  /** Един и същ мащаб за окръжността и за графиката: метри → пиксели. */
  const rPix = (radius / R_MAX) * half;

  const tipX = cx + rPix * Math.cos(theta);
  const tipY = cy - rPix * Math.sin(theta);
  const wave = (t: number) => radius * Math.sin(omega * t);

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
            setTurns(0.12);
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

          {/* най-голямата допустима окръжност, за да се вижда мащабът */}
          <circle cx={cx} cy={cy} r={half} fill="none" stroke={C.faint} strokeDasharray="4 6" />
          <circle cx={cx} cy={cy} r={rPix} fill="none" stroke={C.mut} strokeWidth={1.8} />
          <line x1={cx - half - 14} y1={cy} x2={cx + half + 14} y2={cy} stroke={C.faint} strokeWidth={1.2} />
          <line x1={cx} y1={cy - half - 14} x2={cx} y2={cy + half + 14} stroke={C.faint} strokeWidth={1.2} />

          {rPix > 26 && Math.abs(Math.sin(theta / 2)) > 0.06 && (
            <AngleArc cx={cx} cy={cy} a1={0} a2={-theta} r={Math.min(30, rPix * 0.6)} color={C.plus} texLabel="\theta" />
          )}
          <Arrow x1={cx} y1={cy} x2={tipX} y2={tipY} color={C.warn} width={2.8} />
          {rPix > 30 && (
            <SvgTex
              x={cx + (rPix / 2) * Math.cos(theta) - 14 * Math.sin(theta)}
              y={cy - (rPix / 2) * Math.sin(theta) - 14 * Math.cos(theta)}
              tex="R"
              color={C.warn}
              fontSize={13}
              width={18}
              anchor="middle"
            />
          )}
          <circle cx={tipX} cy={tipY} r={7} fill={C.ok} />
          <Arrow
            x1={tipX}
            y1={tipY}
            x2={tipX - 40 * Math.sin(theta)}
            y2={tipY - 40 * Math.cos(theta)}
            color={C.minus}
            width={2.6}
            texLabel="\vec v"
            texLabelWidth={22}
          />

          <PlotFrame s={s} xLabel="t\ (\mathrm{s})" yLabel="y\ (\mathrm{m})" yLabelColor={C.ok} quarterTicks={false} />
          <path d={s.path(wave, 300)} fill="none" stroke={C.faint} strokeWidth={2} />
          <path d={s.path(wave, 240, 0, Math.max(tVis, 0.001))} fill="none" stroke={C.ok} strokeWidth={2.8} />
          {/* връзката между двете картини е на една и съща височина по построение */}
          <line
            x1={tipX}
            y1={tipY}
            x2={s.sx(tVis)}
            y2={tipY}
            stroke={C.ok}
            strokeWidth={1.2}
            strokeDasharray="5 5"
            opacity={0.6}
          />
          <circle cx={s.sx(tVis)} cy={s.sy(wave(tSim))} r={5.5} fill={C.ok} />
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
          min={1}
          max={8}
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
          { label: "Изминато време", tex: `t=${dec(tSim, 3)}\\,\\mathrm{s}`, color: "var(--color-muted)" },
        ]}
      />
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Прозорецът е фиксиран на $1{,}0\,\mathrm{s}$, а вертикалният мащаб на $0{,}5\,\mathrm{m}$: затова **радиусът мени височината на вълната**, а **честотата мени броя периоди в кадъра**. Задръжте $f$ и менете само $R$: ъгловата честота не мърда, а линейната скорост се мени. Точно това прави възможно две точки с различни $\omega$ да имат еднаква скорост." />
      </p>
    </div>
  );
}

/* ================================ §2 хармонично трептене и стойности по време */

const HARM_WINDOW = 0.6; // секунда: фиксиран прозорец
const HARM_Y = 9; // сантиметра: фиксиран вертикален обхват

export function HarmonicSampleLab() {
  const [amp, setAmp] = useState(4);
  const [freq, setFreq] = useState(5);
  const [showQuarters, setShowQuarters] = useState(true);

  const omega = 2 * Math.PI * freq;
  const period = 1 / freq;
  const s = scaler({ x: 90, y: 56, w: 456, h: 232 }, HARM_WINDOW, HARM_Y);
  const y = (t: number) => amp * Math.sin(omega * t);

  /** Четвъртините на периода, ограничени до прозореца. */
  const marks: number[] = [];
  for (let k = 0; k * (period / 4) <= HARM_WINDOW + 1e-9; k += 1) marks.push((k * period) / 4);

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
          aria-label="Хармонично трептене във фиксиран времеви прозорец с отбелязани четвъртини от периода"
        >
          <Stage w={W} h={H} title="ФИКСИРАН ПРОЗОРЕЦ · АМПЛИТУДАТА МЕНИ ВИСОЧИНАТА, ЧЕСТОТАТА БРОЯ ПЕРИОДИ" />
          <PlotFrame s={s} xLabel="t\ (\mathrm{s})" yLabel="y\ (\mathrm{cm})" yLabelColor={C.warn} quarterTicks={false} />

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
                <circle cx={s.sx(t)} cy={s.sy(y(t))} r={4.5} fill={C.ok} />
              </g>
            ))}

          <path d={s.path(y, 400)} fill="none" stroke={C.warn} strokeWidth={3} />

          <line
            x1={s.box.x}
            y1={s.sy(amp)}
            x2={s.box.x + s.box.w}
            y2={s.sy(amp)}
            stroke={C.minus}
            strokeWidth={1.4}
            strokeDasharray="7 5"
          />
          <SvgTex
            x={s.box.x + s.box.w - 4}
            y={s.sy(amp) - 15}
            tex="A"
            color={C.minus}
            fontSize={13}
            width={18}
            anchor="end"
          />
          {period <= HARM_WINDOW && (
            <>
              <line
                x1={s.sx(0)}
                y1={s.sy(-HARM_Y * 0.86)}
                x2={s.sx(period)}
                y2={s.sy(-HARM_Y * 0.86)}
                stroke={C.plus}
                strokeWidth={2.4}
              />
              <SvgTex
                x={s.sx(period / 2)}
                y={s.sy(-HARM_Y * 0.86) + 18}
                tex="T"
                color={C.plus}
                fontSize={13}
                width={18}
                anchor="middle"
              />
            </>
          )}
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
        <RichText text="Прозорецът е фиксиран на $0{,}6\,\mathrm{s}$, а обхватът по вертикала на $\pm9\,\mathrm{cm}$. Затова амплитудата вдига и сваля кривата, а честотата сгъстява периодите. При $f=5\,\mathrm{Hz}$ един период е $0{,}2\,\mathrm{s}$, значи в кадъра влизат три; двата, които иска задачата, са първите два." />
      </p>
    </div>
  );
}

/* ========================================= §3 дължина на вълната срещу честота */

/**
 * Статична фигура към задача 8, подточка г).
 *
 * Тук нарочно няма плъзгачи: задачата иска една конкретна крива при една
 * конкретна скорост и трите отчитания от условието. Скоростта е фиксирана на
 * 20 m/s, а трите точки са означени с буквите на подточките, за да се вижда
 * че числата в решението се четат от графиката, а не са отделна сметка.
 */

const LAMBDA_V = 20; // m/s: скоростта от условието на задача 8
const LAMBDA_MAX = 12; // метра: фиксиран вертикален обхват
const F_MAX = 12; // Hz: фиксиран хоризонтален обхват

const LAMBDA_POINTS = [
  { label: "a", f: 2, lambda: 10 },
  { label: "b", f: 5, lambda: 4 },
  { label: "c", f: 10, lambda: 2 },
];

export function LambdaFreqFigure() {
  const s = scaler({ x: 96, y: 56, w: 448, h: 232 }, F_MAX, LAMBDA_MAX, 0);
  const fFrom = LAMBDA_V / LAMBDA_MAX; // честотата, при която кривата влиза в кадъра

  return (
    <div className={PANEL_CLASS}>
      <StageScroll minWidth={MINW}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className={`${STAGE_CLASS} select-none`}
          role="img"
          aria-label="Дължината на вълната като функция от честотата при скорост 20 метра за секунда"
        >
          <Stage w={W} h={H} title="ПОСТОЯННА СКОРОСТ · ПО-ВИСОКА ЧЕСТОТА, ПО-КЪСА ВЪЛНА" />
          <PlotFrame
            s={s}
            xLabel="f\ (\mathrm{Hz})"
            yLabel="\lambda\ (\mathrm{m})"
            yLabelColor={C.minus}
            quarterTicks={false}
          />

          {/* пунктирните отсечки показват как се чете всяка двойка от осите */}
          {LAMBDA_POINTS.map((p) => (
            <g key={`read-${p.label}`}>
              <line
                x1={s.box.x}
                y1={s.sy(p.lambda)}
                x2={s.sx(p.f)}
                y2={s.sy(p.lambda)}
                stroke={C.faint}
                strokeWidth={1.2}
                strokeDasharray="5 4"
              />
              <line
                x1={s.sx(p.f)}
                y1={s.sy(p.lambda)}
                x2={s.sx(p.f)}
                y2={s.y0}
                stroke={C.faint}
                strokeWidth={1.2}
                strokeDasharray="5 4"
              />
            </g>
          ))}

          <path
            d={s.path((f) => LAMBDA_V / f, 320, fFrom, F_MAX)}
            fill="none"
            stroke={C.minus}
            strokeWidth={3.2}
          />

          {/* деления само на трите стойности от условието */}
          {LAMBDA_POINTS.map((p) => (
            <g key={`tick-${p.label}`}>
              <line x1={s.sx(p.f)} y1={s.y0} x2={s.sx(p.f)} y2={s.y0 + 5} stroke={C.mut} strokeWidth={1.4} />
              <SvgTex
                x={s.sx(p.f)}
                y={s.y0 + 17}
                tex={String(p.f)}
                color={C.mut}
                fontSize={12.5}
                width={30}
                anchor="middle"
              />
              <line
                x1={s.box.x - 5}
                y1={s.sy(p.lambda)}
                x2={s.box.x}
                y2={s.sy(p.lambda)}
                stroke={C.mut}
                strokeWidth={1.4}
              />
              <SvgTex
                x={s.box.x - 10}
                y={s.sy(p.lambda)}
                tex={String(p.lambda)}
                color={C.mut}
                fontSize={12.5}
                width={30}
                anchor="end"
              />
            </g>
          ))}

          {/* трите отчитания, означени с буквите на подточките */}
          {LAMBDA_POINTS.map((p) => (
            <g key={`dot-${p.label}`}>
              <circle
                cx={s.sx(p.f)}
                cy={s.sy(p.lambda)}
                r={10.5}
                fill={C.warn}
                stroke={STAGE_BG}
                strokeWidth={2}
              />
              <text
                x={s.sx(p.f)}
                y={s.sy(p.lambda) + 4.4}
                textAnchor="middle"
                fill={STAGE_BG}
                fontFamily={DRAWING_FONT_FAMILY}
                fontSize={13}
                fontWeight={600}
              >
                {p.label}
              </text>
            </g>
          ))}
        </svg>
      </StageScroll>

      <Legend
        items={[
          { color: C.minus, tex: "$\\lambda=v/f$ при $v=20\\,\\mathrm{m/s}$" },
          { color: C.warn, tex: "трите отчитания от подточки a, b и c" },
        ]}
      />

      <Readouts
        cols={3}
        cells={[
          {
            label: "Подточка a",
            tex: "f=2\\,\\mathrm{Hz}\\Rightarrow\\lambda=10\\,\\mathrm{m}",
            color: "var(--color-minus)",
          },
          {
            label: "Подточка b",
            tex: "f=5\\,\\mathrm{Hz}\\Rightarrow\\lambda=4\\,\\mathrm{m}",
            color: "var(--color-minus)",
          },
          {
            label: "Подточка c",
            tex: "f=10\\,\\mathrm{Hz}\\Rightarrow\\lambda=2\\,\\mathrm{m}",
            color: "var(--color-minus)",
          },
        ]}
      />

      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Кривата е **хипербола**, защото произведението $\lambda f$ е постоянно и равно на скоростта: удвоите ли честотата, дължината на вълната се снишава наполовина. Кривата се приближава до двете оси, без да ги достига. В **по-бърза среда** зависимостта е от същия вид, но с по-голямо $v$, тоест цялата хипербола стои по-високо. Затова за звук във въздуха ($340\,\mathrm{m/s}$) при $100\,\mathrm{Hz}$ дължината е $3{,}4\,\mathrm{m}$, далеч над този кадър." />
      </p>
    </div>
  );
}

/* ================================================= §4 фаза и §5 интерференция */

const INT_WINDOW = 1.0; // секунда: фиксиран прозорец

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

  const s = scaler({ x: 90, y: 56, w: 456, h: 232 }, INT_WINDOW, 2.4);
  const y1 = (t: number) => amp * Math.sin(omega * t);
  const y2 = (t: number) => amp * Math.sin(omega * t + phi);
  const ySum = (t: number) => y1(t) + y2(t);

  /** Двойка съседни възходящи нули около средата на прозореца. */
  const zero1 = period * Math.max(1, Math.floor(INT_WINDOW / (2 * period)));
  const zero2 = zero1 - dt;

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
          <PlotFrame s={s} xLabel="t\ (\mathrm{s})" yLabel="y" yLabelColor={C.mut} quarterTicks={false} />

          {showSum && <path d={s.path(ySum, 420)} fill="none" stroke={C.ok} strokeWidth={3.4} />}
          <path d={s.path(y1, 420)} fill="none" stroke={C.warn} strokeWidth={2.4} />
          <path d={s.path(y2, 420)} fill="none" stroke={C.minus} strokeWidth={2.4} />

          {Math.abs(phiDeg) > 1 && zero2 > 0 && zero1 < INT_WINDOW && (
            <g>
              <line x1={s.sx(zero1)} y1={s.y0} x2={s.sx(zero1)} y2={s.y0 + 44} stroke={C.warn} strokeDasharray="4 4" />
              <line x1={s.sx(zero2)} y1={s.y0} x2={s.sx(zero2)} y2={s.y0 + 44} stroke={C.minus} strokeDasharray="4 4" />
              <line
                x1={s.sx(zero2)}
                y1={s.y0 + 38}
                x2={s.sx(zero1)}
                y2={s.y0 + 38}
                stroke={C.plus}
                strokeWidth={2.6}
              />
              <SvgTex
                x={s.sx((zero1 + zero2) / 2)}
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
          min={2}
          max={6}
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
          { label: "Резултантна амплитуда", tex: `${dec(sumAmp, 3)}\\,A`, color: "var(--color-ok)" },
          { label: "Вид", tex: `\\text{${kind}}`, color: "var(--color-ink)" },
        ]}
      />
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Прозорецът е фиксиран на $1{,}0\,\mathrm{s}$, затова честотата сгъстява периодите, а фазовата разлика мести синята крива спрямо оранжевата. Резултантната амплитуда следва $2A\cos(\Delta\varphi/2)$: максимална при $0$, нула при $180^\circ$, а при $90^\circ$ е $\sqrt2\,A\approx1{,}41\,A$. Обърнете внимание, че $\Delta t$ намалява с честотата, макар фазовата разлика да е същата." />
      </p>
    </div>
  );
}

/* ===================================================== §6 биения */

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
          { label: "Максимуми за 10 s", tex: `${dec(beat * 10, 0)}`, color: "var(--color-ink)" },
          { label: "Средна честота на тона", tex: `${dec((f1 + f2) / 2, 2)}\\,\\mathrm{Hz}`, color: "var(--color-muted)" },
        ]}
      />
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Изравнете двете честоти: биенията се разреждат и в границата изчезват. Честотите тук са понижени, за да се вижда картината, но математиката е същата при $256$ и $260\,\mathrm{Hz}$ - там обвивката пулсира 4 пъти в секунда." />
      </p>
    </div>
  );
}
