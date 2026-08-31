"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import { RangeControl, Readouts, Stage, StageScroll, Toggle, dec, useClock } from "./acPlot";
import { C, PANEL_CLASS, STAGE_CLASS } from "./svg";

/**
 * Загубите в ядрото (§8): вихрови токове и хистерезис.
 *
 * Двата режима живеят в един компонент, защото са две страни на един и същ
 * въпрос - къде отива процентът, който не стига до вторичната намотка.
 */

type Mode = "eddy" | "hysteresis";

/* ------------------------------------------------------- вихрови токове */

/**
 * Сечение на ядрото, разрязано на `n` ламели.
 *
 * Индуцираният контур във всяка ламела е по-къс и обхваща по-малък поток,
 * затова сумарната загуба пада като $1/n^2$. Точно това показва плъзгачът.
 */
function EddyScene({ n, phase }: { n: number; phase: number }) {
  const x0 = 168;
  const y0 = 62;
  const w = 240;
  const h = 196;
  const lam = w / n;
  const swirl = Math.sin(2 * Math.PI * phase) > 0;

  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const lx = x0 + i * lam;
        const inset = Math.min(9, lam * 0.22);
        return (
          <g key={i}>
            <rect
              x={lx + 0.6}
              y={y0}
              width={lam - 1.2}
              height={h}
              fill={C.mut}
              opacity={0.22}
              stroke={C.faint}
              strokeWidth={1}
            />
            {lam > 7 && (
              <rect
                x={lx + inset}
                y={y0 + 26}
                width={Math.max(2, lam - 2 * inset)}
                height={h - 52}
                rx={Math.min(10, lam / 3)}
                fill="none"
                stroke={C.plus}
                /* токът във всеки контур пада с дебелината на ламелата: контурите
                   стават повече, но всеки от тях е видимо по-слаб */
                strokeWidth={1.3 + 1.9 / n}
                opacity={0.32 + 0.68 / n}
              />
            )}
            {lam > 26 && (
              <polygon
                points={
                  swirl
                    ? `${lx + lam / 2 - 6},${y0 + 26} ${lx + lam / 2 + 6},${y0 + 26} ${lx + lam / 2},${y0 + 36}`
                    : `${lx + lam / 2 - 6},${y0 + 36} ${lx + lam / 2 + 6},${y0 + 36} ${lx + lam / 2},${y0 + 26}`
                }
                fill={C.plus}
              />
            )}
          </g>
        );
      })}
      <SvgTex
        x={x0 + w / 2 - 20}
        y={y0 - 36}
        tex="\Phi"
        color={C.minus}
        fontSize={14}
        width={20}
        anchor="end"
      />
      <circle cx={x0 + w / 2} cy={y0 - 28} r={8} fill="none" stroke={C.minus} strokeWidth={2} />
      <circle cx={x0 + w / 2} cy={y0 - 28} r={2.6} fill={C.minus} />
    </g>
  );
}

/* ------------------------------------------------------------ хистерезис */

interface Material {
  key: string;
  label: string;
  /** Полуширина на цикъла (коерцитивност), в мащаб 0…1. */
  hc: number;
  /** Насищане. */
  bs: number;
}

const MATERIALS: Material[] = [
  { key: "gost", label: "Трансформаторна ламарина", hc: 0.08, bs: 0.92 },
  { key: "steel", label: "Обикновена стомана", hc: 0.32, bs: 0.86 },
  { key: "hard", label: "Твърд магнит", hc: 0.74, bs: 0.78 },
];

/** Горният и долният клон на цикъла: изместен tanh, затова площта е реална. */
function loopBranch(m: Material, up: boolean, samples = 120) {
  const k = 3.4;
  return Array.from({ length: samples + 1 }, (_, i) => {
    const hx = -1 + (2 * i) / samples;
    const b = m.bs * Math.tanh(k * (hx + (up ? m.hc : -m.hc)));
    return [hx, b] as const;
  });
}

/** Площта на цикъла по трапецното правило: тя е загубата за един цикъл. */
function loopArea(m: Material): number {
  const up = loopBranch(m, true, 240);
  const down = loopBranch(m, false, 240);
  let area = 0;
  for (let i = 1; i < up.length; i += 1) {
    const dh = up[i][0] - up[i - 1][0];
    const gap = (down[i][1] - up[i][1] + (down[i - 1][1] - up[i - 1][1])) / 2;
    area += gap * dh;
  }
  return Math.abs(area);
}

function HysteresisScene({ material, phase }: { material: Material; phase: number }) {
  const cx = 288;
  const cy = 154;
  const rx = 132;
  const ry = 94;

  const toScene = ([hx, b]: readonly [number, number]) => `${(cx + hx * rx).toFixed(1)},${(cy - b * ry).toFixed(1)}`;
  const up = loopBranch(material, true).map(toScene).join(" L ");
  const down = loopBranch(material, false).map(toScene).join(" L ");
  const area = `M ${up} L ${loopBranch(material, false).slice().reverse().map(toScene).join(" L ")} Z`;

  // въртящата се точка: H обикаля синусоидално, B следва съответния клон
  const hNow = Math.sin(2 * Math.PI * phase);
  const goingUp = Math.cos(2 * Math.PI * phase) > 0;
  const bNow = material.bs * Math.tanh(3.4 * (hNow + (goingUp ? material.hc : -material.hc)));

  return (
    <g>
      <path d={area} fill={C.plus} opacity={0.22} />
      <path d={`M ${up}`} fill="none" stroke={C.warn} strokeWidth={2.6} />
      <path d={`M ${down}`} fill="none" stroke={C.warn} strokeWidth={2.6} />

      <line x1={cx - rx - 22} y1={cy} x2={cx + rx + 22} y2={cy} stroke={C.mut} strokeWidth={1.4} />
      <line x1={cx} y1={cy - ry - 26} x2={cx} y2={cy + ry + 22} stroke={C.mut} strokeWidth={1.4} />
      <SvgTex x={cx + rx + 26} y={cy + 16} tex="H" color={C.mut} fontSize={13.5} width={20} />
      <SvgTex x={cx + 10} y={cy - ry - 34} tex="B" color={C.mut} fontSize={13.5} width={20} />

      <circle cx={cx + hNow * rx} cy={cy - bNow * ry} r={5.6} fill={C.ok} stroke={C.wire} strokeWidth={1.4} />
    </g>
  );
}

/* ------------------------------------------------------------ обвивката */

export function CoreLossLab() {
  const [mode, setMode] = useState<Mode>("eddy");
  const [n, setN] = useState(1);
  const [matIndex, setMatIndex] = useState(0);
  const [freq, setFreq] = useState(50);
  const [volume, setVolume] = useState(2.5);
  const [playing, setPlaying] = useState(true);
  const { turns } = useClock(playing, 0.3);

  const W = 576;
  const H = 288;

  const material = MATERIALS[matIndex];
  const refArea = loopArea(MATERIALS[0]);
  const area = loopArea(material);
  /*
   * Мащаб: студено валцувана трансформаторна ламарина при около 1,5 T губи
   * приблизително 90 J/m³ на цикъл. Стойността е ориентировъчна и служи да
   * даде верния порядък, а не каталожна точност.
   */
  const perCycle = (area / refArea) * 90;
  const hystPower = perCycle * freq * (volume / 1000);

  return (
    <div className={PANEL_CLASS}>
      <StageScroll minWidth={540} maxWidth={640}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className={STAGE_CLASS}
          aria-label={mode === "eddy" ? "Вихрови токове в ядрото" : "Хистерезисен цикъл"}
        >
          <Stage w={W} h={H} title={mode === "eddy" ? "СЕЧЕНИЕ НА ЯДРОТО" : "ХИСТЕРЕЗИСЕН ЦИКЪЛ"} />
          {mode === "eddy" ? (
            <EddyScene n={n} phase={playing ? turns : 0.1} />
          ) : (
            <HysteresisScene material={material} phase={playing ? turns : 0.12} />
          )}
        </svg>
      </StageScroll>

      {mode === "eddy" ? (
        <Readouts
          cells={[
            { label: "Ламели", tex: `n=${n}` },
            { label: "Загуба спрямо масивно", tex: `1/n^2=${dec((1 / n ** 2) * 100, 1)}\\,\\%`, color: C.plus },
            { label: "Дебелина на ламела", tex: `d/d_0=${dec(1 / n, 3)}` },
            { label: "Индуциран контур", tex: `\\mathcal E\\ \\propto\\ d` },
          ]}
          cols={4}
        />
      ) : (
        <Readouts
          cells={[
            { label: "Загуба за цикъл", tex: `w=${dec(perCycle, 0)}\\,\\mathrm{J/m^3}`, color: C.plus },
            { label: "Честота", tex: `f=${dec(freq, 0)}\\,\\mathrm{Hz}` },
            { label: "Обем на ядрото", tex: `\\mathcal V=${dec(volume, 1)}\\,\\mathrm{dm^3}` },
            { label: "Мощност", tex: `P=w f\\mathcal V=${dec(hystPower, 1)}\\,\\mathrm W`, color: C.plus },
          ]}
          cols={4}
        />
      )}

      <p aria-live="polite" className="mt-3 text-[13.5px] leading-relaxed text-ink/90">
        <RichText
          text={
            mode === "eddy"
              ? "Синият кръг горе е потокът $\\Phi$, насочен към нас. Разрязването не го намалява, а скъсява пътя, по който индуцираният ток може да обиколи. Всяка ламела обхваща по-малък поток и има по-голямо съпротивление, затова контурите стават повече, но всеки от тях е **по-слаб**, а общата загуба пада с квадрата на броя ламели."
              : `Точката обикаля цикъла веднъж за период. Защрихованата площ е енергията, разсеяна за **един** цикъл и **един кубичен метър**; умножена по честотата и обема, тя дава мощност. Затова ядрата се правят от ${material.label.toLowerCase()} само когато цикълът е тесен.`
          }
        />
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Toggle on={mode === "eddy"} onChange={() => setMode("eddy")}>
          Вихрови токове
        </Toggle>
        <Toggle on={mode === "hysteresis"} onChange={() => setMode("hysteresis")}>
          Хистерезис
        </Toggle>
        <Toggle on={playing} onChange={setPlaying}>
          {playing ? "Спри" : "Пусни"}
        </Toggle>
      </div>

      {mode === "eddy" ? (
        <div className="mt-4">
          <RangeControl
            label="Брой ламели"
            value={n}
            min={1}
            max={12}
            step={1}
            valueTex={`n=${n}`}
            onChange={setN}
            accent="accent-warn"
          />
        </div>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap gap-2">
            {MATERIALS.map((m, i) => (
              <button
                key={m.key}
                type="button"
                aria-pressed={i === matIndex}
                onClick={() => setMatIndex(i)}
                className={
                  i === matIndex
                    ? "cursor-pointer rounded-full border-[1.5px] border-ink bg-ink px-3 py-1 text-[12.5px] font-bold text-white"
                    : "cursor-pointer rounded-full border-[1.5px] border-rule bg-surface px-3 py-1 text-[12.5px] font-semibold text-muted transition-colors hover:border-ink hover:text-ink"
                }
              >
                {m.label}
              </button>
            ))}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <RangeControl
              label="Честота"
              value={freq}
              min={16}
              max={400}
              step={1}
              valueTex={`f=${dec(freq, 0)}\\,\\mathrm{Hz}`}
              onChange={setFreq}
              accent="accent-warn"
            />
            <RangeControl
              label="Обем на ядрото"
              value={volume}
              min={0.2}
              max={20}
              step={0.1}
              valueTex={`\\mathcal V=${dec(volume, 1)}\\,\\mathrm{dm^3}`}
              onChange={setVolume}
            />
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------ разпределение на загубите */

/** Санки лента за §8: къде отива подадената мощност в реален трансформатор. */
export function LossBreakdown() {
  const [loadFrac, setLoadFrac] = useState(1);

  // медните загуби растат с квадрата на товара, стоманените са постоянни
  const rated = 500e3;
  const out = rated * loadFrac;
  const copper = 6500 * loadFrac ** 2;
  const iron = 1100;
  const input = out + copper + iron;
  const eta = out / input;
  const loss = copper + iron;

  const W = 620;
  const H = 268;
  const left = 96;
  const right = 556;
  const span = right - left;

  /*
   * Горната лента е целият енергиен баланс, но при 98,5 % КПД загубите са
   * нишка от два пиксела. Затова тя се разгъва втори път долу, с обявен
   * множител на увеличението: иначе етикетите падат върху зелената лента.
   */
  const top = 56;
  const band = 34;
  const wOut = (out / input) * span;
  const wLoss = Math.max(2, span - wOut);
  const zoom = Math.round(span / wLoss);

  const low = 158;
  const cuFrac = copper / loss;

  return (
    <div className={PANEL_CLASS}>
      <StageScroll minWidth={580}>
        <svg viewBox={`0 0 ${W} ${H}`} className={STAGE_CLASS} aria-label="Разпределение на мощността в реален трансформатор">
          <Stage w={W} h={H} title="КЪДЕ ОТИВА ПОДАДЕНАТА МОЩНОСТ" />

          <line x1={left - 8} y1={top} x2={left - 8} y2={top + band} stroke={C.warn} strokeWidth={3} />
          <SvgTex x={left - 8} y={top - 22} tex="P_1" color={C.warn} fontSize={13.5} width={24} anchor="middle" />

          <rect x={left} y={top} width={wOut} height={band} fill={C.ok} opacity={0.82} />
          <rect x={left + wOut} y={top} width={wLoss} height={band} fill={C.plus} opacity={0.9} />
          <SvgTex x={left + wOut / 2} y={top + 6} tex="P_2" color={C.wire} fontSize={14} width={24} anchor="middle" />

          {/* разгъването на нишката */}
          <g stroke={C.plus} strokeWidth={1.3} strokeDasharray="4 4" fill="none">
            <path d={`M ${left + wOut} ${top + band} L ${left} ${low}`} />
            <path d={`M ${right} ${top + band} L ${right} ${low}`} />
          </g>
          <SvgTex x={right - 16} y={top + band + 30} tex={`\\times${zoom}`} color={C.mut} fontSize={12.5} width={40} anchor="end" />

          <rect x={left} y={low} width={span * cuFrac} height={band} fill={C.plus} opacity={0.85} />
          <rect x={left + span * cuFrac} y={low} width={span * (1 - cuFrac)} height={band} fill={C.minus} opacity={0.8} />
          <SvgTex
            x={left + (span * cuFrac) / 2}
            y={low + 8}
            tex="I^2R"
            color={C.wire}
            fontSize={13}
            width={34}
            anchor="middle"
          />
          <SvgTex
            x={left + span * cuFrac + (span * (1 - cuFrac)) / 2}
            y={low + 8}
            tex="P_{\text{Fe}}"
            color={C.wire}
            fontSize={13}
            width={34}
            anchor="middle"
          />
          <SvgTex
            x={left + (span * cuFrac) / 2}
            y={low + band + 12}
            tex="\propto k^2"
            color={C.plus}
            fontSize={12.5}
            width={44}
            anchor="middle"
          />
          <SvgTex
            x={left + span * cuFrac + (span * (1 - cuFrac)) / 2}
            y={low + band + 12}
            tex="\text{постоянни}"
            color={C.minus}
            fontSize={12.5}
            width={86}
            anchor="middle"
          />
        </svg>
      </StageScroll>

      <Readouts
        cells={[
          { label: "Отдадена мощност", tex: `P_2=${dec(out / 1e3, 0)}\\,\\mathrm{kW}`, color: C.ok },
          { label: "Медни загуби", tex: `P_{\\text{Cu}}=${dec(copper, 0)}\\,\\mathrm W`, color: C.plus },
          { label: "Загуби в ядрото", tex: `P_{\\text{Fe}}=${dec(iron, 0)}\\,\\mathrm W`, color: C.minus },
          { label: "КПД", tex: `\\eta=${dec(eta * 100, 2)}\\,\\%`, color: C.ok },
        ]}
        cols={4}
      />

      <div className="mt-4">
        <RangeControl
          label="Товар спрямо номиналния"
          value={loadFrac}
          min={0.05}
          max={1.2}
          step={0.05}
          valueTex={`P_2/P_{\\text{ном}}=${dec(loadFrac)}`}
          onChange={setLoadFrac}
          accent="accent-warn"
        />
      </div>

      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Плъзнете товара към нулата: отдадената мощност пада, но синята лента остава. Точно затова КПД има максимум **под** номиналния товар, а не при него." />
      </p>
    </div>
  );
}
