"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
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
import { BTN_SEC, C, DRAWING_FONT_FAMILY, PANEL_CLASS, STAGE_BG, STAGE_CLASS } from "./svg";

/**
 * Интерактиви към §6-§8: полувълново изправяне, мостът и изглаждането.
 *
 * Схемата на моста е нарисувана с двете шини: всички четири диода сочат към
 * плюсовата шина, а източникът стои между двата крака. Така чертежът е равнинен
 * (никъде две жици не се пресичат) и проводящата двойка се вижда веднага.
 */

const W = 640;
const MINW = 540;
const VD = 0.7; // волта: спадът върху един проводящ силициев диод

/** Символ на диод: триъгълникът сочи към чертата, тоест в посоката на тока. */
function Diode({
  x,
  y,
  angle,
  on,
  label,
}: {
  x: number;
  y: number;
  angle: number;
  on: boolean;
  label?: string;
}) {
  const color = on ? C.ok : C.mut;
  return (
    <g>
      {on && <circle cx={x} cy={y} r={19} fill={C.ok} opacity={0.18} />}
      <g transform={`translate(${x} ${y}) rotate(${angle})`}>
        <polygon points="-10,-9 -10,9 6,0" fill={color} />
        <line x1={6} y1={-10.5} x2={6} y2={10.5} stroke={color} strokeWidth={2.8} />
      </g>
      {label && (
        <text
          x={x + 20}
          y={y + 5}
          fill={color}
          fontFamily={DRAWING_FONT_FAMILY}
          fontSize={12.5}
          fontWeight={600}
        >
          {label}
        </text>
      )}
    </g>
  );
}

/** Правоъгълен резистор с извод нагоре и надолу. */
function LoadBox({ x, y1, y2 }: { x: number; y1: number; y2: number }) {
  const h = 56;
  const mid = (y1 + y2) / 2;
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={mid - h / 2} stroke={C.wire} strokeWidth={2.2} />
      <line x1={x} y1={mid + h / 2} x2={x} y2={y2} stroke={C.wire} strokeWidth={2.2} />
      <rect x={x - 15} y={mid - h / 2} width={30} height={h} fill={STAGE_BG} stroke={C.wire} strokeWidth={2.2} />
    </g>
  );
}

/** Кръгче на променливотоков източник. */
function AcSource({ x, y, r = 16 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={STAGE_BG} stroke={C.warn} strokeWidth={2.4} />
      <path
        d={`M ${x - r * 0.62} ${y} q ${r * 0.31} ${-r * 0.55} ${r * 0.62} 0 q ${r * 0.31} ${r * 0.55} ${r * 0.62} 0`}
        fill="none"
        stroke={C.warn}
        strokeWidth={2}
      />
    </g>
  );
}

/* =============================================== §6-§7 изправяне и мостът */

const RECT_WINDOW = 0.04; // секунди: фиксиран прозорец, два периода при 50 Hz
const RECT_VP = 10; // волта: фиксиран вертикален обхват

export function RectifierLab() {
  const [bridge, setBridge] = useState(true);
  const [playing, setPlaying] = useState(true);
  const { turns, setTurns } = useClock(playing, 0.12);

  const f = 50;
  const vp = 8;
  const t = ((turns % RECT_WINDOW) + RECT_WINDOW) % RECT_WINDOW;
  const vin = (x: number) => vp * Math.sin(2 * Math.PI * f * x);
  const vout = (x: number) => {
    const v = vin(x);
    if (bridge) return Math.max(0, Math.abs(v) - 2 * VD);
    return Math.max(0, v - VD);
  };
  const now = vin(t);
  const positive = now >= 0;
  /** Средната стойност се интегрира числено: изрязаната крива не е чиста синусоида. */
  const meanOut =
    Array.from({ length: 400 }, (_, k) => vout(((k + 0.5) * RECT_WINDOW) / 400)).reduce((a, b) => a + b, 0) / 400;

  /* --- схемата --- */
  const CH = 300;
  const railTop = 74;
  const railBot = 252;
  const legL = 120;
  const legR = 250;
  const node = 163;
  const loadX = 330;

  const pathBridge = positive
    ? `M ${legL} ${node} V ${railTop} H ${loadX} V ${railBot} H ${legR} V ${node}`
    : `M ${legR} ${node} V ${railTop} H ${loadX} V ${railBot} H ${legL} V ${node}`;
  const pathHalf = `M 120 ${railTop} H ${loadX} V ${railBot} H 120 V ${railTop}`;

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Toggle on={!bridge} onChange={() => setBridge(false)}>
          Полувълнов (един диод)
        </Toggle>
        <Toggle on={bridge} onChange={() => setBridge(true)}>
          Мост (четири диода)
        </Toggle>
        <button type="button" className={BTN_SEC} onClick={() => setPlaying((p) => !p)}>
          {playing ? "Пауза" : "Пусни"}
        </button>
      </div>

      <StageScroll minWidth={MINW}>
        <svg
          viewBox={`0 0 ${W} ${CH}`}
          className={`${STAGE_CLASS} select-none`}
          role="img"
          aria-label="Схема на изправителя с осветена проводяща двойка диоди"
        >
          <Stage
            w={W}
            h={CH}
            title={bridge ? "МОСТ · ДВА ДИОДА ПРОВЕЖДАТ, ДВА СА ЗАТВОРЕНИ" : "ПОЛУВЪЛНОВ · ЕДИН ДИОД, ПОЛОВИН ВЪЛНА"}
          />

          {bridge ? (
            <>
              <path d={pathBridge} fill="none" stroke={C.ok} strokeWidth={7} opacity={0.22} strokeLinejoin="round" />
              <g stroke={C.wire} strokeWidth={2.2} fill="none">
                <path d={`M ${legL} ${railTop} H ${loadX}`} />
                <path d={`M ${legL} ${railBot} H ${loadX}`} />
                <path d={`M ${legL} ${railTop} V ${railBot}`} />
                <path d={`M ${legR} ${railTop} V ${railBot}`} />
                <path d={`M ${legL} ${node} H ${legL + 27}`} />
                <path d={`M ${legR - 27} ${node} H ${legR}`} />
              </g>
              <AcSource x={(legL + legR) / 2} y={node} />
              <Diode x={legL} y={(railTop + node) / 2} angle={-90} on={positive} label="D1" />
              <Diode x={legR} y={(railTop + node) / 2} angle={-90} on={!positive} label="D2" />
              <Diode x={legL} y={(node + railBot) / 2} angle={-90} on={!positive} label="D3" />
              <Diode x={legR} y={(node + railBot) / 2} angle={-90} on={positive} label="D4" />
              <LoadBox x={loadX} y1={railTop} y2={railBot} />
            </>
          ) : (
            <>
              <path d={pathHalf} fill="none" stroke={C.ok} strokeWidth={7} opacity={positive ? 0.22 : 0.05} strokeLinejoin="round" />
              <g stroke={C.wire} strokeWidth={2.2} fill="none">
                <path d={`M 120 ${railTop} H ${loadX}`} />
                <path d={`M 120 ${railBot} H ${loadX}`} />
                <path d={`M 120 ${railTop} V ${node - 20}`} />
                <path d={`M 120 ${node + 20} V ${railBot}`} />
              </g>
              <AcSource x={120} y={node} />
              <Diode x={225} y={railTop} angle={0} on={positive} label="D" />
              <LoadBox x={loadX} y1={railTop} y2={railBot} />
            </>
          )}

          <text x={loadX + 26} y={railTop - 8} fill={C.ok} fontFamily={DRAWING_FONT_FAMILY} fontSize={14} fontWeight={600}>
            +
          </text>
          <text x={loadX + 26} y={railBot + 18} fill={C.minus} fontFamily={DRAWING_FONT_FAMILY} fontSize={14} fontWeight={600}>
            −
          </text>
          <SvgTex x={loadX + 26} y={(railTop + railBot) / 2} tex="R_{\text{т}}" color={C.mut} fontSize={13} width={40} />

          <text
            x={404}
            y={74}
            fill={C.mut}
            fontFamily={DRAWING_FONT_FAMILY}
            fontSize={12.5}
            fontWeight={600}
            letterSpacing="0.07em"
          >
            {positive ? "ГОРНА ПОЛУВЪЛНА" : "ДОЛНА ПОЛУВЪЛНА"}
          </text>
          <text x={404} y={100} fill={C.mut} fontFamily={DRAWING_FONT_FAMILY} fontSize={13}>
            {bridge
              ? positive
                ? "Проводят D1 и D4."
                : "Проводят D2 и D3."
              : positive
                ? "Диодът проводи."
                : "Диодът е затворен."}
          </text>
          <text x={404} y={124} fill={C.mut} fontFamily={DRAWING_FONT_FAMILY} fontSize={13}>
            {bridge ? "Токът през товара" : positive ? "Токът през товара" : "През товара не тече"}
          </text>
          <text x={404} y={144} fill={C.mut} fontFamily={DRAWING_FONT_FAMILY} fontSize={13}>
            {bridge ? "върви надолу и в двата случая." : positive ? "върви надолу." : "нищо."}
          </text>
        </svg>
      </StageScroll>

      <div className="mt-3">
        <StageScroll minWidth={MINW}>
          <svg
            viewBox={`0 0 ${W} 260`}
            className={`${STAGE_CLASS} select-none`}
            role="img"
            aria-label="Входното напрежение и напрежението върху товара във времето"
          >
            <Stage w={W} h={260} title="ВХОД СРЕЩУ ТОВАР" />
            {(() => {
              const s = scaler({ x: 76, y: 64, w: 500, h: 158 }, RECT_WINDOW, RECT_VP);
              return (
                <>
                  <PlotFrame s={s} xLabel="t" yLabel="v\ (\mathrm{V})" yLabelColor={C.mut} quarterTicks={false} />
                  <path d={s.path(vin, 420)} fill="none" stroke={C.faint} strokeWidth={2.2} />
                  <path d={s.path(vout, 420)} fill="none" stroke={C.ok} strokeWidth={3.2} />
                  <line
                    x1={s.sx(t)}
                    y1={s.box.y}
                    x2={s.sx(t)}
                    y2={s.box.y + s.box.h}
                    stroke={C.warn}
                    strokeWidth={1.6}
                    strokeDasharray="5 4"
                  />
                  <circle cx={s.sx(t)} cy={s.sy(vin(t))} r={5} fill={C.faint} stroke={STAGE_BG} strokeWidth={2} />
                  <circle cx={s.sx(t)} cy={s.sy(vout(t))} r={6} fill={C.ok} stroke={STAGE_BG} strokeWidth={2} />
                </>
              );
            })()}
          </svg>
        </StageScroll>
      </div>

      <Legend
        items={[
          { color: C.faint, tex: "вход $v_{\\text{вх}}(t)$ от трансформатора" },
          { color: C.ok, tex: "напрежение върху товара $v_{\\text{т}}(t)$" },
        ]}
      />

      <div className="mt-4">
        <RangeControl
          label={<RichText text="Момент от прозореца" />}
          value={t}
          min={0}
          max={RECT_WINDOW}
          step={0.0002}
          valueTex={`t=${dec(t * 1000, 1)}\\,\\mathrm{ms}`}
          onChange={(v) => {
            setPlaying(false);
            setTurns(v);
          }}
        />
      </div>

      <Readouts
        cols={4}
        cells={[
          { label: "Вход в момента", tex: `v_{\\text{вх}}=${dec(now, 2)}\\,\\mathrm{V}`, color: "var(--color-muted)" },
          { label: "Върху товара", tex: `v_{\\text{т}}=${dec(vout(t), 2)}\\,\\mathrm{V}`, color: "var(--color-ok)" },
          {
            label: "Честота на пулсациите",
            tex: `f_{\\text{пулс}}=${bridge ? 2 * f : f}\\,\\mathrm{Hz}`,
            color: "var(--color-ink)",
          },
          {
            label: "Средна стойност",
            tex: `\\bar v=${dec(meanOut, 2)}\\,\\mathrm{V}`,
            color: "var(--color-muted)",
          },
        ]}
      />

      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Мостът не прави нищо повече от това да размени кои два диода проводят. Токът през товара обаче тръгва в една и съща посока и в двете полувълни, затова долната полувълна се обръща нагоре вместо да се изхвърли. Оттам идват и двете печалби: средната стойност се удвоява, а пулсациите стават двойно по-чести, тоест по-лесни за изглаждане." />
      </p>
    </div>
  );
}

/* ================================================== §8 изглаждащ кондензатор */

const SM_WINDOW = 0.06; // секунди
const SM_VP = 18; // волта

export function SmoothingLab() {
  const [cap, setCap] = useState(1000); // микрофаради
  const [load, setLoad] = useState(0.35); // ампера
  const [bridge, setBridge] = useState(true);

  const f = 50;
  const vp = 17 - (bridge ? 2 * VD : VD);
  const fr = bridge ? 2 * f : f;
  const ripple = load / (fr * cap * 1e-6);
  const vmin = Math.max(0, vp - ripple);
  const vdc = (vp + vmin) / 2;

  /** Кондензаторът следва върха, после се разрежда в товара до следващия връх. */
  const rect = (x: number) => {
    const v = vp * Math.abs(Math.sin(2 * Math.PI * f * x));
    return bridge ? v : Math.max(0, vp * Math.sin(2 * Math.PI * f * x));
  };
  const smoothed = (x: number) => {
    const period = 1 / fr;
    const peakAt = bridge ? period / 2 : 1 / (4 * f);
    const since = ((x - peakAt) % period + period) % period;
    const fall = vp - ripple * (since / period);
    return Math.max(rect(x), fall);
  };

  const s = scaler({ x: 76, y: 66, w: 500, h: 172 }, SM_WINDOW, SM_VP, 0);

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-2">
        <Toggle on={!bridge} onChange={() => setBridge(false)}>
          Полувълнов
        </Toggle>
        <Toggle on={bridge} onChange={() => setBridge(true)}>
          Мост
        </Toggle>
      </div>

      <StageScroll minWidth={MINW}>
        <svg
          viewBox={`0 0 ${W} 300`}
          className={`${STAGE_CLASS} select-none`}
          role="img"
          aria-label="Изгладеното напрежение върху товара при различен капацитет и различен ток"
        >
          <Stage w={W} h={300} title="КОНДЕНЗАТОРЪТ ДЪРЖИ НАПРЕЖЕНИЕТО МЕЖДУ ДВА ВЪРХА" />
          <PlotFrame s={s} xLabel="t" yLabel="v_{\text{т}}\ (\mathrm{V})" yLabelColor={C.ok} quarterTicks={false} />

          <path d={s.path(rect, 480, 0, SM_WINDOW)} fill="none" stroke={C.faint} strokeWidth={2} />
          <path d={s.path(smoothed, 480, 0, SM_WINDOW)} fill="none" stroke={C.ok} strokeWidth={3.2} />

          <line x1={s.box.x} y1={s.sy(vp)} x2={s.box.x + s.box.w} y2={s.sy(vp)} stroke={C.warn} strokeWidth={1.3} strokeDasharray="6 5" />
          <line x1={s.box.x} y1={s.sy(vmin)} x2={s.box.x + s.box.w} y2={s.sy(vmin)} stroke={C.warn} strokeWidth={1.3} strokeDasharray="6 5" />
          <line x1={s.box.x + s.box.w + 10} y1={s.sy(vp)} x2={s.box.x + s.box.w + 10} y2={s.sy(vmin)} stroke={C.warn} strokeWidth={2} />
          <SvgTex
            x={s.box.x + s.box.w + 18}
            y={(s.sy(vp) + s.sy(vmin)) / 2}
            tex="\Delta V"
            color={C.warn}
            fontSize={13}
            width={42}
          />
        </svg>
      </StageScroll>

      <Legend
        items={[
          { color: C.faint, tex: "без кондензатор" },
          { color: C.ok, tex: "с кондензатор" },
          { color: C.warn, tex: "размах на пулсацията $\\Delta V$" },
        ]}
      />

      <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
        <RangeControl
          label={<RichText text="Капацитет $C$" />}
          value={cap}
          min={100}
          max={4700}
          step={100}
          valueTex={`${dec(cap, 0)}\\,\\mu\\mathrm{F}`}
          onChange={setCap}
        />
        <RangeControl
          label={<RichText text="Ток през товара $I$" />}
          value={load}
          min={0.05}
          max={1}
          step={0.05}
          valueTex={`${dec(load, 2)}\\,\\mathrm{A}`}
          onChange={setLoad}
        />
      </div>

      <Readouts
        cols={4}
        cells={[
          { label: "Размах на пулсацията", tex: `\\Delta V=${dec(ripple, 2)}\\,\\mathrm{V}`, color: "var(--color-warn)" },
          { label: "Средно напрежение", tex: `V_{\\text{ср}}=${dec(vdc, 2)}\\,\\mathrm{V}`, color: "var(--color-ok)" },
          { label: "Честота на пулсациите", tex: `f_{\\text{пулс}}=${fr}\\,\\mathrm{Hz}`, color: "var(--color-ink)" },
          {
            label: "Относителна пулсация",
            tex: `\\Delta V/V_{\\text{ср}}=${dec((100 * ripple) / Math.max(0.01, vdc), 1)}\\,\\%`,
            color: "var(--color-muted)",
          },
        ]}
      />

      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Между два върха товарът се храни само от кондензатора, затова напрежението пада по $\Delta V=I\,\Delta t/C$. Мостът разполовява $\Delta t$ и с това разполовява пулсацията при същия капацитет. Удвояването на $C$ прави същото. Обърнете внимание, че по-големият ток винаги влошава картината: кондензаторът не е източник, а само резервоар." />
      </p>
    </div>
  );
}
