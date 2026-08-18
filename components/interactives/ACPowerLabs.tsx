"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import { BTN_SEC, C, PANEL_CLASS, STAGE_CLASS } from "./svg";
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
  type Scale,
} from "./acPlot";

/**
 * §13: ефективни стойности и мощност. Двата интерактива показват точно това,
 * което извеждаме в текста - че средната стойност на $\sin^2$ е $1/2$ и че
 * фазата решава каква част от обменяната енергия остава във веригата.
 */

const W = 760;
const H = 360;

/** Разделя кривата на участъци с постоянен знак, за да се защрихова цветно. */
function signedAreas(s: Scale, fn: (x: number) => number, samples = 300) {
  const out: { positive: boolean; d: string }[] = [];
  let current: string[] = [];
  let sign = fn(0) >= 0;
  const flush = (endX: number) => {
    if (current.length > 1) {
      out.push({
        positive: sign,
        d: `M ${current[0]} ${current.slice(1).map((p) => `L ${p}`).join(" ")} L ${s.sx(endX)} ${s.y0} Z`,
      });
    }
    current = [];
  };
  for (let i = 0; i <= samples; i += 1) {
    const x = (s.xMax * i) / samples;
    const y = fn(x);
    if (i === 0) current.push(`${s.sx(x)} ${s.y0}`);
    if (y >= 0 !== sign) {
      flush(x);
      sign = y >= 0;
      current.push(`${s.sx(x)} ${s.y0}`);
    }
    current.push(`${s.sx(x)} ${s.sy(y)}`);
  }
  flush(s.xMax);
  return out;
}

/* ================================================= §13a ефективна стойност */

export function RMSVisualizer() {
  const [i0, setI0] = useState(2);
  const [freq, setFreq] = useState(50);
  const [res, setRes] = useState(50);
  const [showI, setShowI] = useState(true);
  const [showSq, setShowSq] = useState(true);
  const [showMean, setShowMean] = useState(true);
  const [showRms, setShowRms] = useState(false);

  const irms = i0 / Math.SQRT2;
  const meanSq = 0.5 * i0 * i0;
  const power = irms * irms * res;

  const s = scaler({ x: 90, y: 62, w: 560, h: 232 }, 2, 1.15);
  const iN = (x: number) => Math.sin(2 * Math.PI * x);
  const sqN = (x: number) => Math.sin(2 * Math.PI * x) ** 2;

  /** Двете еднакви по площ области спрямо средното — както при Serway. */
  const lobes = `M ${s.sx(0)} ${s.sy(0.5)} ${Array.from({ length: 241 }, (_, i) => {
    const x = (2 * i) / 240;
    return `L ${s.sx(x)} ${s.sy(sqN(x))}`;
  }).join(" ")} L ${s.sx(2)} ${s.sy(0.5)} Z`;

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-1.5">
        <Toggle on={showI} onChange={setShowI}>
          Ток
        </Toggle>
        <Toggle on={showSq} onChange={setShowSq}>
          Квадрат на тока
        </Toggle>
        <Toggle on={showMean} onChange={setShowMean}>
          Средно на квадрата
        </Toggle>
        <Toggle on={showRms} onChange={setShowRms}>
          Еквивалентен постоянен ток
        </Toggle>
      </div>

      <StageScroll minWidth={W}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className={`${STAGE_CLASS} select-none`}
          role="img"
          aria-label="Ток, квадрат на тока и средната стойност на квадрата за един период"
        >
          <Stage w={W} h={H} title="СРЕДНОТО НА ТОКА Е НУЛА · СРЕДНОТО НА КВАДРАТА НЕ Е" />
          <PlotFrame s={s} xLabel="t/T" periods={2} />

          {showSq && showMean && <path d={lobes} fill={C.plus} fillOpacity={0.16} fillRule="evenodd" />}
          {showSq && (
            <path d={s.path(sqN, 320)} fill="none" stroke={C.plus} strokeWidth={3} />
          )}
          {showI && <path d={s.path(iN, 320)} fill="none" stroke={C.ok} strokeWidth={2.8} />}

          {showMean && (
            <>
              <line
                x1={s.box.x}
                y1={s.sy(0.5)}
                x2={s.box.x + s.box.w}
                y2={s.sy(0.5)}
                stroke={C.plus}
                strokeWidth={2}
                strokeDasharray="8 5"
              />
              <SvgTex
                x={s.box.x + s.box.w + 8}
                y={s.sy(0.5)}
                tex="\tfrac12 I_0^2"
                color={C.plus}
                fontSize={12.5}
                width={44}
              />
            </>
          )}
          {showRms && (
            <>
              <line
                x1={s.box.x}
                y1={s.sy(1 / Math.SQRT2)}
                x2={s.box.x + s.box.w}
                y2={s.sy(1 / Math.SQRT2)}
                stroke={C.minus}
                strokeWidth={2.4}
              />
              <SvgTex
                x={s.box.x + s.box.w + 8}
                y={s.sy(1 / Math.SQRT2) - 16}
                tex="I_{\mathrm{rms}}"
                color={C.minus}
                fontSize={12.5}
                width={40}
              />
            </>
          )}
        </svg>
      </StageScroll>

      <Legend
        items={[
          { color: C.ok, tex: "$i(t)/I_0$" },
          { color: C.plus, tex: "$i^2(t)/I_0^2$" },
          { color: C.minus, tex: "$I_{\\mathrm{rms}}/I_0=0{,}707$" },
        ]}
      />

      <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-3">
        <RangeControl
          label={<RichText text="Амплитуда $I_0$" />}
          value={i0}
          min={0.5}
          max={5}
          step={0.1}
          valueTex={`${dec(i0, 1)}\\,\\mathrm{A}`}
          onChange={setI0}
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
          label={<RichText text="Съпротивление $R$" />}
          value={res}
          min={5}
          max={200}
          step={5}
          valueTex={`${res}\\,\\Omega`}
          onChange={setRes}
        />
      </div>

      <Readouts
        cols={4}
        cells={[
          { label: "Средно на тока", tex: `\\langle i\\rangle=0`, color: "var(--color-muted)" },
          { label: "Средно на квадрата", tex: `\\langle i^2\\rangle=${dec(meanSq, 2)}\\,\\mathrm{A^2}`, color: "var(--color-plus)" },
          { label: "Ефективен ток", tex: `I_{\\mathrm{rms}}=${dec(irms, 3)}\\,\\mathrm{A}`, color: "var(--color-minus)" },
          { label: "Средна мощност", tex: `\\langle P\\rangle=${dec(power, 1)}\\,\\mathrm{W}`, color: "var(--color-ok)" },
        ]}
      />
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Оцветените лобове са еднакви по площ: колкото квадратът излиза над линията $\tfrac12 I_0^2$, толкова остава под нея. Точно това е геометричният прочит на $\langle\sin^2\omega t\rangle=\tfrac12$. Честотата мени само мащаба на времевата ос - на средните стойности не влияе." />
      </p>
    </div>
  );
}

/* ================================================= §13b мигновена мощност */

const POWER_PRESETS: { name: string; phi: number }[] = [
  { name: "Чист резистор", phi: 0 },
  { name: "Чиста бобина", phi: 90 },
  { name: "Чист кондензатор", phi: -90 },
  { name: "Смесена верига", phi: 45 },
];

export function PowerVisualizer() {
  const [v0, setV0] = useState(12);
  const [i0, setI0] = useState(1.5);
  const [phiDeg, setPhiDeg] = useState(45);

  const phi = (phiDeg * Math.PI) / 180;
  const pAvg = 0.5 * v0 * i0 * Math.cos(phi);
  const s = scaler({ x: 90, y: 58, w: 560, h: 246 }, 2, 1.15);

  const vN = (x: number) => Math.sin(2 * Math.PI * x);
  const iN = (x: number) => Math.sin(2 * Math.PI * x - phi);
  const pN = (x: number) => vN(x) * iN(x);
  const areas = signedAreas(s, pN, 300);

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {POWER_PRESETS.map((preset) => (
          <button
            key={preset.name}
            type="button"
            className={BTN_SEC}
            onClick={() => setPhiDeg(preset.phi)}
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
          aria-label="Напрежение, ток и мигновена мощност; областите с отрицателна мощност са оцветени отделно"
        >
          <Stage w={W} h={H} title="МИГНОВЕНА МОЩНОСТ · ЗЕЛЕНО КЪМ ВЕРИГАТА, ОРАНЖЕВО ОБРАТНО КЪМ ИЗТОЧНИКА" />
          <PlotFrame s={s} xLabel="t/T" periods={2} />

          {areas.map((a, i) => (
            <path
              key={i}
              d={a.d}
              fill={a.positive ? C.ok : C.plus}
              fillOpacity={a.positive ? 0.24 : 0.26}
            />
          ))}

          <path d={s.path(vN, 320)} fill="none" stroke={C.wire} strokeWidth={2.4} />
          <path d={s.path(iN, 320)} fill="none" stroke={C.ok} strokeWidth={2.4} />
          <path d={s.path(pN, 320)} fill="none" stroke={C.plus} strokeWidth={3} />

          <line
            x1={s.box.x}
            y1={s.sy(0.5 * Math.cos(phi))}
            x2={s.box.x + s.box.w}
            y2={s.sy(0.5 * Math.cos(phi))}
            stroke={C.warn}
            strokeWidth={2.2}
            strokeDasharray="8 5"
          />
          <SvgTex
            x={s.box.x + s.box.w + 8}
            y={s.sy(0.5 * Math.cos(phi)) - (Math.abs(Math.cos(phi)) < 0.12 ? 18 : 0)}
            tex="\langle p\rangle"
            color={C.warn}
            fontSize={12.5}
            width={40}
          />
        </svg>
      </StageScroll>

      <Legend
        items={[
          { color: C.wire, tex: "$v(t)$" },
          { color: C.ok, tex: "$i(t)$" },
          { color: C.plus, tex: "$p(t)=v\\,i$" },
          { color: C.warn, tex: "$\\langle p\\rangle$" },
        ]}
      />

      <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-3">
        <RangeControl
          label={<RichText text="Амплитуда $V_0$" />}
          value={v0}
          min={2}
          max={30}
          step={1}
          valueTex={`${v0}\\,\\mathrm{V}`}
          onChange={setV0}
        />
        <RangeControl
          label={<RichText text="Амплитуда $I_0$" />}
          value={i0}
          min={0.2}
          max={3}
          step={0.1}
          valueTex={`${dec(i0, 1)}\\,\\mathrm{A}`}
          onChange={setI0}
        />
        <RangeControl
          label={<RichText text="Фазова разлика $\phi$" />}
          value={phiDeg}
          min={-90}
          max={90}
          step={5}
          valueTex={`${phiDeg}^\\circ`}
          onChange={setPhiDeg}
        />
      </div>

      <Readouts
        cols={4}
        cells={[
          { label: "Фактор на мощността", tex: `\\cos\\phi=${dec(Math.cos(phi), 3)}`, color: "var(--color-warn)" },
          {
            label: "Средна мощност",
            tex: `P_{\\mathrm{avg}}=${dec(pAvg, 2)}\\,\\mathrm{W}`,
            color: "var(--color-ok)",
          },
          {
            label: "Ефективни стойности",
            tex: `V_{\\mathrm{rms}}I_{\\mathrm{rms}}=${dec((v0 * i0) / 2, 2)}\\,\\mathrm{VA}`,
            color: "var(--color-muted)",
          },
          {
            label: "Върнато към източника",
            tex: `${dec(100 * (1 - Math.abs(Math.cos(phi))), 0)}\\%`,
            color: "var(--color-plus)",
          },
        ]}
      />
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="При $\phi=\pm90^\circ$ зелените и оранжевите площи стават еднакви и средната линия ляга върху нулата: за всеки период идеалната бобина или кондензатор връща на източника точно толкова енергия, колкото е взела." />
      </p>
    </div>
  );
}
