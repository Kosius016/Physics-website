"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import { RangeControl, Readouts, Stage, StageScroll, Toggle, dec, useClock } from "./acPlot";
import { C, PANEL_CLASS, STAGE_CLASS } from "./svg";

/**
 * Загубите от вихрови токове в проводящото ядро.
 */

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
      {/* Вдясно от кръгчето: вляво заглавието на сцената стига дотук и се застъпва. */}
      <SvgTex
        x={x0 + w / 2 + 20}
        y={y0 - 28}
        tex="\Phi"
        color={C.minus}
        fontSize={14}
        width={20}
        anchor="start"
      />
      <circle cx={x0 + w / 2} cy={y0 - 28} r={8} fill="none" stroke={C.minus} strokeWidth={2} />
      <circle cx={x0 + w / 2} cy={y0 - 28} r={2.6} fill={C.minus} />
    </g>
  );
}

/* ------------------------------------------------------------ обвивката */

export function CoreLossLab() {
  const [n, setN] = useState(1);
  const [playing, setPlaying] = useState(true);
  const { turns } = useClock(playing, 0.3);

  const W = 576;
  const H = 288;

  return (
    <div className={PANEL_CLASS}>
      <StageScroll minWidth={540} maxWidth={640}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className={STAGE_CLASS}
          aria-label="Вихрови токове в плътно и ламелирано ядро"
        >
          <Stage w={W} h={H} title="ОТ ПЛЪТНО ЯДРО КЪМ ЛАМЕЛИ" />
          <EddyScene n={n} phase={playing ? turns : 0.1} />
        </svg>
      </StageScroll>

      <Readouts
        cells={[
          { label: "Ламели", tex: `n=${n}` },
          { label: "Загуба спрямо масивно", tex: `1/n^2=${dec((1 / n ** 2) * 100, 1)}\\,\\%`, color: C.plus },
          { label: "Дебелина на ламела", tex: `d/d_0=${dec(1 / n, 3)}` },
          { label: "Индуциран контур", tex: `\\mathcal E\\ \\propto\\ d` },
        ]}
        cols={4}
      />

      <p aria-live="polite" className="mt-3 text-[13.5px] leading-relaxed text-ink/90">
        <RichText
          text="Синият кръг горе е потокът $\\Phi$, насочен към нас. Разрязването не го намалява, а прекъсва широкия път на тока. Всяка изолирана ламела обхваща по-малка площ и допуска само по-малък контур, затова общото нагряване рязко намалява."
        />
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Toggle on={playing} onChange={setPlaying}>
          {playing ? "Спри" : "Пусни"}
        </Toggle>
      </div>

      <div className="mt-4">
        <RangeControl
          label="Брой изолирани ламели"
          value={n}
          min={1}
          max={12}
          step={1}
          valueTex={`n=${n}`}
          onChange={setN}
          accent="accent-warn"
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------ разпределение на загубите */

/** Санки лента за §10: къде отива подадената мощност в реален трансформатор. */
export function LossBreakdown() {
  const [loadFrac, setLoadFrac] = useState(1);

  // медните загуби растат с квадрата на товара, вихровите в ядрото са почти постоянни
  const rated = 500e3;
  const out = rated * loadFrac;
  const copper = 6500 * loadFrac ** 2;
  const core = 1100;
  const input = out + copper + core;
  const eta = out / input;
  const loss = copper + core;

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
            tex="P_{\text{ядро}}"
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
          { label: "Вихрови токове в ядрото", tex: `P_{\\text{ядро}}=${dec(core, 0)}\\,\\mathrm W`, color: C.minus },
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
