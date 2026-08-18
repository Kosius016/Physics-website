"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import { Arrow, BTN_PRI, BTN_SEC, C, PANEL_CLASS, STAGE_CLASS } from "./svg";
import {
  CapSymbol,
  InductorSymbol,
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
  type Scale,
} from "./acPlot";

/**
 * §7-§10: поведението на всеки елемент поотделно под синусоидално въздействие.
 * Резисторът дава нулева фазова разлика; кондензаторът и бобината получават
 * своите $\pm\pi/2$ от производната, затова двата интерактива са построени
 * върху един и същ скелет: въздействие → производна → отклик.
 */

const W = 760;

/* ------------------------------------------------------------ помощници */

/** Една следа с нормиран мащаб: формата е важна, числото е в readout лентата. */
function Trace({
  s,
  fn,
  color,
  label,
  dashed = false,
  width = 2.7,
}: {
  s: Scale;
  fn: (t: number) => number;
  color: string;
  label: string;
  dashed?: boolean;
  width?: number;
}) {
  return (
    <g>
      <PlotFrame s={s} xLabel="" yLabel={label} yLabelColor={color} periods={2} />
      <path
        d={s.path(fn, 300)}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeDasharray={dashed ? "7 5" : undefined}
      />
    </g>
  );
}

/** Тънък индикатор „колко голяма е амплитудата“ спрямо фиксиран максимум. */
function Gauge({
  x,
  y,
  h,
  frac,
  color,
}: {
  x: number;
  y: number;
  h: number;
  frac: number;
  color: string;
}) {
  const f = Math.max(0, Math.min(1, frac));
  return (
    <g>
      <rect x={x} y={y} width={12} height={h} rx={4} fill={C.faint} fillOpacity={0.18} stroke={C.mut} strokeWidth={1} />
      <rect x={x + 1.5} y={y + h * (1 - f) + 1.5} width={9} height={Math.max(0, h * f - 3)} rx={3} fill={color} />
    </g>
  );
}

/* ================================================= §7 резистор под променливо */

export function ResistorACLab() {
  const [v0, setV0] = useState(10);
  const [res, setRes] = useState(25);
  const [freq, setFreq] = useState(50);
  const [playing, setPlaying] = useState(false);
  const { turns, setTurns } = useClock(playing, 0.28);

  const omega = 2 * Math.PI * freq;
  const i0 = v0 / res;
  const cycle = ((turns % 2) + 2) % 2;

  const s = scaler({ x: 88, y: 92, w: 430, h: 200 }, 2, 1.18);
  const cx = 640;
  const cy = s.y0;

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-2">
        <button type="button" className={BTN_PRI} onClick={() => setPlaying((p) => !p)}>
          {playing ? "Пауза" : "Пуснете ▶"}
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
          viewBox={`0 0 ${W} 380`}
          className={`${STAGE_CLASS} select-none`}
          role="img"
          aria-label="Напрежение и ток през резистор при променливо напрежение: двете криви съвпадат по фаза"
        >
          <Stage w={W} h={380} title="РЕЗИСТОР · ЕДНОВРЕМЕННИ НУЛИ, ЕДНОВРЕМЕННИ МАКСИМУМИ" />

          <PlotFrame s={s} xLabel="t/T" periods={2} />
          <path
            d={s.path((x) => Math.sin(2 * Math.PI * x), 300)}
            fill="none"
            stroke={C.wire}
            strokeWidth={3.4}
          />
          <path
            d={s.path((x) => Math.sin(2 * Math.PI * x), 300)}
            fill="none"
            stroke={C.ok}
            strokeWidth={2.4}
            strokeDasharray="9 7"
          />
          <circle cx={s.sx(cycle)} cy={s.sy(Math.sin(2 * Math.PI * cycle))} r={6} fill={C.ok} />

          {/* фазорите: две стрелки в една посока */}
          <circle cx={cx} cy={cy} r={92} fill="none" stroke={C.faint} strokeDasharray="4 6" />
          <Arrow
            x1={cx}
            y1={cy}
            x2={cx + 88 * Math.cos(2 * Math.PI * cycle)}
            y2={cy - 88 * Math.sin(2 * Math.PI * cycle)}
            color={C.wire}
            width={3.4}
          />
          <Arrow
            x1={cx}
            y1={cy}
            x2={cx + 58 * Math.cos(2 * Math.PI * cycle)}
            y2={cy - 58 * Math.sin(2 * Math.PI * cycle)}
            color={C.ok}
            width={3}
          />
          <SvgTex
            x={cx + 112 * Math.cos(2 * Math.PI * cycle)}
            y={cy - 112 * Math.sin(2 * Math.PI * cycle)}
            tex="\vec V,\ \vec I"
            color={C.mut}
            fontSize={13}
            width={48}
            anchor="middle"
          />

          {/* веригата */}
          <g stroke={C.wire} strokeWidth={3} fill="none">
            <line x1={100} y1={330} x2={210} y2={330} />
            <line x1={284} y1={330} x2={330} y2={330} />
          </g>
          <ResistorSymbol x={210} y={330} w={74} color={C.plus} />
          <SourceSymbol x={100} y={330} r={18} color={C.warn} />
          <SvgTex x={247} y={356} tex="R" color={C.plus} fontSize={13} width={20} anchor="middle" />
        </svg>
      </StageScroll>

      <Legend
        items={[
          { color: C.wire, tex: "$v(t)=V_0\\sin\\omega t$" },
          { color: C.ok, tex: "$i(t)=(V_0/R)\\sin\\omega t$" },
        ]}
      />

      <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-3">
        <RangeControl
          label={<RichText text="Амплитуда $V_0$" />}
          value={v0}
          min={2}
          max={20}
          step={1}
          valueTex={`${v0}\\,\\mathrm{V}`}
          onChange={setV0}
        />
        <RangeControl
          label={<RichText text="Съпротивление $R$" />}
          value={res}
          min={5}
          max={100}
          step={5}
          valueTex={`${res}\\,\\Omega`}
          onChange={setRes}
        />
        <RangeControl
          label={<RichText text="Честота $f$" />}
          value={freq}
          min={10}
          max={200}
          step={5}
          valueTex={`${freq}\\,\\mathrm{Hz}`}
          onChange={setFreq}
        />
      </div>

      <Readouts
        cols={4}
        cells={[
          { label: "Ъглова честота", tex: `\\omega=${dec(omega, 0)}\\,\\mathrm{rad/s}`, color: "var(--color-muted)" },
          { label: "Амплитуда на тока", tex: `I_0=${dec(i0, 2)}\\,\\mathrm{A}`, color: "var(--color-ok)" },
          { label: "Отношение", tex: `V_0/I_0=${dec(res, 0)}\\,\\Omega`, color: "var(--color-plus)" },
          { label: "Фазова разлика", tex: `\\Delta\\phi=0`, color: "var(--color-ink)" },
        ]}
      />
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Плъзгачите за $R$ и за $f$ променят числата, но не и картината: двете криви остават една върху друга, а двете стрелки - събрани в една посока. Отношението $V_0/I_0$ не зависи от $f$ - това е разликата, която ще се появи при другите два елемента." />
      </p>
    </div>
  );
}

/* ============================== §8 и §9 производната като източник на фазата */

function DerivativeLab({ mode }: { mode: "C" | "L" }) {
  const isCap = mode === "C";
  const [amp, setAmp] = useState(isCap ? 10 : 1.5);
  const [freq, setFreq] = useState(50);
  const [param, setParam] = useState(isCap ? 50 : 0.12);
  const [showMarks, setShowMarks] = useState(true);

  const omega = 2 * Math.PI * freq;
  const reactance = isCap ? 1 / (omega * param * 1e-6) : omega * param;
  const response = isCap ? omega * param * 1e-6 * amp : omega * param * amp;

  /** Фиксиран максимум за индикатора — за да се вижда растежът с честотата. */
  const gaugeMax = isCap ? 2 * Math.PI * 200 * 120e-6 * 20 : 2 * Math.PI * 200 * 0.5 * 3;

  const rows = [
    { y: 66 },
    { y: 178 },
    { y: 290 },
  ];
  const box = (y: number) => scaler({ x: 96, y, w: 540, h: 84 }, 2, 1.2);
  const s1 = box(rows[0].y);
  const s2 = box(rows[1].y);
  const s3 = box(rows[2].y);

  const drive = (x: number) => Math.sin(2 * Math.PI * x);
  const deriv = (x: number) => Math.cos(2 * Math.PI * x);

  /** Моментите, в които въздействието е екстремум: там производната е нула. */
  const marks = [0.25, 0.75, 1.25, 1.75];

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-1.5">
        <Toggle on={showMarks} onChange={setShowMarks}>
          Ключови моменти
        </Toggle>
      </div>

      <StageScroll minWidth={W}>
        <svg
          viewBox={`0 0 ${W} 400`}
          className={`${STAGE_CLASS} select-none`}
          role="img"
          aria-label={
            isCap
              ? "Напрежение върху кондензатор, неговата производна и токът, който е пропорционален на производната"
              : "Ток през бобина, неговата производна и напрежението, което е пропорционално на производната"
          }
        >
          <Stage
            w={W}
            h={400}
            title={
              isCap
                ? "КОНДЕНЗАТОР · ТОКЪТ ПОВТАРЯ ПРОИЗВОДНАТА НА НАПРЕЖЕНИЕТО"
                : "БОБИНА · НАПРЕЖЕНИЕТО ПОВТАРЯ ПРОИЗВОДНАТА НА ТОКА"
            }
          />

          {showMarks &&
            marks.map((m) => (
              <line
                key={m}
                x1={s1.sx(m)}
                y1={s1.box.y - 6}
                x2={s1.sx(m)}
                y2={s3.box.y + s3.box.h + 6}
                stroke={C.faint}
                strokeWidth={1.4}
                strokeDasharray="5 5"
              />
            ))}

          <Trace
            s={s1}
            fn={drive}
            color={isCap ? C.wire : C.ok}
            label={isCap ? "v(t)" : "i(t)"}
          />
          <Trace
            s={s2}
            fn={deriv}
            color={C.minus}
            dashed
            label={isCap ? "\\dfrac{dv}{dt}" : "\\dfrac{di}{dt}"}
          />
          <Trace
            s={s3}
            fn={deriv}
            color={isCap ? C.ok : C.wire}
            label={isCap ? "i(t)" : "v(t)"}
          />

          {showMarks &&
            marks.map((m) => (
              <g key={`m${m}`}>
                <circle cx={s1.sx(m)} cy={s1.sy(drive(m))} r={4.5} fill={C.plus} />
                <circle cx={s2.sx(m)} cy={s2.y0} r={4.5} fill={C.plus} />
                <circle cx={s3.sx(m)} cy={s3.y0} r={4.5} fill={C.plus} />
              </g>
            ))}

          <Gauge
            x={692}
            y={s3.box.y}
            h={s3.box.h}
            frac={response / gaugeMax}
            color={isCap ? C.ok : C.wire}
          />
          <SvgTex
            x={698}
            y={s3.box.y - 16}
            tex={isCap ? "I_0" : "V_0"}
            color={isCap ? C.ok : C.wire}
            fontSize={12.5}
            width={26}
            anchor="middle"
          />
          <SvgTex x={s3.sx(2) + 24} y={s3.y0 + 16} tex="t" color={C.mut} fontSize={13} width={20} />

          {/* елементът във веригата */}
          {isCap ? (
            <CapSymbol x={706} y={110} color={C.minus} />
          ) : (
            <InductorSymbol x={676} y={110} w={62} color={C.warn} />
          )}
          <SvgTex
            x={706}
            y={146}
            tex={isCap ? "C" : "L"}
            color={isCap ? C.minus : C.warn}
            fontSize={14}
            width={22}
            anchor="middle"
          />
        </svg>
      </StageScroll>

      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        {isCap ? (
          <RichText text="В отбелязаните моменти $v$ е в екстремум, значи $dv/dt=0$, значи **токът е нула точно тогава, когато напрежението е максимално**. А когато $v$ минава през нулата, наклонът е най-стръмен и токът е максимален. Точно това е изместване с четвърт период." />
        ) : (
          <RichText text="В отбелязаните моменти токът е в екстремум, значи $di/dt=0$ и **напрежението върху бобината е нула точно когато токът е максимален**. Когато токът минава през нулата, той се променя най-бързо и напрежението е максимално." />
        )}
      </p>

      <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-3">
        <RangeControl
          label={<RichText text={isCap ? "Амплитуда $V_0$" : "Амплитуда $I_0$"} />}
          value={amp}
          min={isCap ? 2 : 0.2}
          max={isCap ? 20 : 3}
          step={isCap ? 1 : 0.1}
          valueTex={isCap ? `${amp}\\,\\mathrm{V}` : `${dec(amp, 1)}\\,\\mathrm{A}`}
          onChange={setAmp}
        />
        <RangeControl
          label={<RichText text="Честота $f$" />}
          value={freq}
          min={10}
          max={200}
          step={5}
          valueTex={`${freq}\\,\\mathrm{Hz}`}
          onChange={setFreq}
        />
        <RangeControl
          label={<RichText text={isCap ? "Капацитет $C$" : "Индуктивност $L$"} />}
          value={param}
          min={isCap ? 10 : 0.02}
          max={isCap ? 120 : 0.5}
          step={isCap ? 5 : 0.01}
          valueTex={isCap ? `${param}\\,\\mu\\mathrm{F}` : `${dec(param * 1000, 0)}\\,\\mathrm{mH}`}
          onChange={setParam}
        />
      </div>

      <Readouts
        cols={4}
        cells={[
          { label: "Ъглова честота", tex: `\\omega=${dec(omega, 0)}\\,\\mathrm{rad/s}`, color: "var(--color-muted)" },
          {
            label: isCap ? "Капацитивно съпротивление" : "Индуктивно съпротивление",
            tex: isCap ? `X_C=${dec(reactance, 1)}\\,\\Omega` : `X_L=${dec(reactance, 1)}\\,\\Omega`,
            color: isCap ? "var(--color-minus)" : "var(--color-warn)",
          },
          {
            label: isCap ? "Амплитуда на тока" : "Амплитуда на напрежението",
            tex: isCap ? `I_0=${dec(response, 3)}\\,\\mathrm{A}` : `V_0=${dec(response, 1)}\\,\\mathrm{V}`,
            color: isCap ? "var(--color-ok)" : "var(--color-ink)",
          },
          {
            label: "Фазова разлика",
            tex: isCap ? `\\Delta\\phi=-90^\\circ` : `\\Delta\\phi=+90^\\circ`,
            color: "var(--color-plus)",
          },
        ]}
      />
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        {isCap ? (
          <RichText text="Всяка следа е мащабирана към собствената си амплитуда - формата е важна, числата стоят в лентата. Стълбчето вдясно показва $I_0$ спрямо фиксиран максимум: увеличете $f$ и то расте, а $X_C$ в лентата пада." />
        ) : (
          <RichText text="Стълбчето вдясно показва $V_0$ спрямо фиксиран максимум при зададена амплитуда на тока: увеличете $f$ и то расте заедно с $X_L$. Бобината се съпротивлява толкова по-силно, колкото по-бърза е промяната." />
        )}
      </p>
    </div>
  );
}

export function CapacitorDerivativeLab() {
  return <DerivativeLab mode="C" />;
}

export function InductorDerivativeLab() {
  return <DerivativeLab mode="L" />;
}

/* ========================================== §10 двете съпротивления срещу f */

export function ReactancePlot() {
  const [ind, setInd] = useState(0.12);
  const [cap, setCap] = useState(40);
  const [showDiff, setShowDiff] = useState(false);
  const [cursor, setCursor] = useState(50);

  const F_MAX = 200;
  const X_MAX = 160;
  const xl = (f: number) => 2 * Math.PI * f * ind;
  const xc = (f: number) => 1 / (2 * Math.PI * f * cap * 1e-6);
  const f0 = 1 / (2 * Math.PI * Math.sqrt(ind * cap * 1e-6));

  const s = scaler({ x: 84, y: 58, w: 596, h: 246 }, F_MAX, X_MAX, 0);
  const crossVisible = f0 > 2 && f0 < F_MAX;

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-1.5">
        <Toggle on={showDiff} onChange={setShowDiff}>
          Разлика <RichText text="$|X_L-X_C|$" />
        </Toggle>
      </div>

      <StageScroll minWidth={W}>
        <svg
          viewBox={`0 0 ${W} 380`}
          className={`${STAGE_CLASS} select-none`}
          role="img"
          aria-label="Индуктивното съпротивление расте с честотата, капацитивното намалява; кривите се пресичат"
        >
          <Stage w={W} h={380} title="ДВЕ ПРОТИВОПОЛОЖНИ ЗАВИСИМОСТИ ОТ ЧЕСТОТАТА" />
          <PlotFrame s={s} xLabel="f" yLabel="X\ (\Omega)" yLabelColor={C.mut} quarterTicks={false} />

          <path d={s.path(xl, 200, 0.5, F_MAX)} fill="none" stroke={C.warn} strokeWidth={3} />
          <path d={s.path(xc, 300, 0.5, F_MAX)} fill="none" stroke={C.minus} strokeWidth={3} />
          {showDiff && (
            <path
              d={s.path((f) => Math.abs(xl(f) - xc(f)), 300, 0.5, F_MAX)}
              fill="none"
              stroke={C.mut}
              strokeWidth={2}
              strokeDasharray="6 5"
            />
          )}

          {crossVisible && (
            <>
              <line
                x1={s.sx(f0)}
                y1={s.sy(xl(f0))}
                x2={s.sx(f0)}
                y2={s.y0}
                stroke={C.faint}
                strokeDasharray="5 5"
              />
              <circle cx={s.sx(f0)} cy={s.sy(xl(f0))} r={7} fill={C.ok} />
            </>
          )}

          {/* курсор по честотата */}
          <line
            x1={s.sx(cursor)}
            y1={s.box.y}
            x2={s.sx(cursor)}
            y2={s.y0}
            stroke={C.plus}
            strokeWidth={1.8}
          />
          <circle cx={s.sx(cursor)} cy={s.sy(Math.min(xl(cursor), X_MAX))} r={5} fill={C.warn} />
          <circle cx={s.sx(cursor)} cy={s.sy(Math.min(xc(cursor), X_MAX))} r={5} fill={C.minus} />
          <SvgTex
            x={s.sx(cursor)}
            y={s.box.y - 16}
            tex="f"
            color={C.plus}
            fontSize={13}
            width={18}
            anchor="middle"
          />
        </svg>
      </StageScroll>

      <Legend
        items={[
          { color: C.warn, tex: "$X_L=2\\pi fL$" },
          { color: C.minus, tex: "$X_C=1/(2\\pi fC)$" },
          { color: C.ok, tex: "пресечна точка" },
        ]}
      />

      <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-3">
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
          min={10}
          max={200}
          step={5}
          valueTex={`${cap}\\,\\mu\\mathrm{F}`}
          onChange={setCap}
        />
        <RangeControl
          label={<RichText text="Курсор по честотата $f$" />}
          value={cursor}
          min={2}
          max={F_MAX}
          step={1}
          valueTex={`${cursor}\\,\\mathrm{Hz}`}
          onChange={setCursor}
        />
      </div>

      <Readouts
        cols={4}
        cells={[
          { label: "При курсора", tex: `X_L=${dec(xl(cursor), 1)}\\,\\Omega`, color: "var(--color-warn)" },
          { label: "При курсора", tex: `X_C=${dec(xc(cursor), 1)}\\,\\Omega`, color: "var(--color-minus)" },
          {
            label: "Разлика",
            tex: `X_L-X_C=${dec(xl(cursor) - xc(cursor), 1)}\\,\\Omega`,
            color: "var(--color-muted)",
          },
          {
            label: "Пресичане при",
            tex: crossVisible ? `f=${dec(f0, 1)}\\,\\mathrm{Hz}` : `f>${F_MAX}\\,\\mathrm{Hz}`,
            color: "var(--color-ok)",
          },
        ]}
      />
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Намерете пресечната точка за няколко двойки $L$ и $C$ и запишете числата, преди да отгърнете следващата секция. Въпросът, който си струва да си зададете: от какво зависи тя - и защо в него не участва $R$?" />
      </p>
    </div>
  );
}
