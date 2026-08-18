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
} from "./acPlot";

/**
 * Интерактиви към задачите за кондензатори (секция „Материали").
 *
 * Всички ползват общия инструментариум от acPlot.tsx (мащаби, оси, контроли,
 * readout ленти), затова числата в графиката и в лентата под нея не могат да
 * се разминат: смятат се на едно място.
 *
 * Сцените са с ширина на текстовата колона, както е поискано - без изнасяне в
 * полето. На телефон се плъзгат хоризонтално вътре в панела си.
 */

const EPS0 = 8.85e-12;
const W = 640;
const H = 340;
const MINW = 520;

/* ==================================================== §1 работа при зареждане */

/**
 * Правата $\Delta V=q/C$ и лицето под нея. Целта е ученикът да види защо
 * работата е $\tfrac12 Q\Delta V$, а не $Q\Delta V$: правоъгълникът е точно
 * два пъти по-голям от триъгълника.
 */
export function ChargingWorkLab() {
  const cap = 100e-9; // 100 nF
  const qMax = 1e-6; // 1 µC
  const [q, setQ] = useState(0.62e-6);
  const [showRect, setShowRect] = useState(true);

  const vMax = qMax / cap; // 10 V
  const v = q / cap;
  const work = (q * q) / (2 * cap);
  const rect = q * v;

  const s = scaler({ x: 74, y: 52, w: 470, h: 236 }, qMax * 1.08, vMax * 1.12, 0);
  const line = (x: number) => x / cap;

  const tri = `M ${s.sx(0)} ${s.y0} L ${s.sx(q)} ${s.y0} L ${s.sx(q)} ${s.sy(v)} Z`;

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-1.5">
        <Toggle on={showRect} onChange={setShowRect}>
          Правоъгълникът <RichText text="$q\,\Delta V$" />
        </Toggle>
      </div>

      <StageScroll minWidth={MINW}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className={`${STAGE_CLASS} select-none`}
          role="img"
          aria-label="Напрежението расте линейно със заряда; работата е лицето на триъгълника под правата"
        >
          <Stage w={W} h={H} title="РАБОТАТА Е ЛИЦЕТО ПОД ПРАВАТА, НЕ ЛИЦЕТО НА ПРАВОЪГЪЛНИКА" />
          <PlotFrame s={s} xLabel="q" yLabel="\Delta V" yLabelColor={C.warn} quarterTicks={false} />

          {showRect && (
            <rect
              x={s.sx(0)}
              y={s.sy(v)}
              width={Math.max(0, s.sx(q) - s.sx(0))}
              height={Math.max(0, s.y0 - s.sy(v))}
              fill={C.minus}
              fillOpacity={0.14}
              stroke={C.minus}
              strokeWidth={1.4}
              strokeDasharray="6 4"
            />
          )}
          <path d={tri} fill={C.ok} fillOpacity={0.3} />
          <path d={s.path(line, 60, 0, qMax)} fill="none" stroke={C.faint} strokeWidth={2} />
          <path d={s.path(line, 40, 0, Math.max(q, 1e-12))} fill="none" stroke={C.warn} strokeWidth={3} />
          <circle cx={s.sx(q)} cy={s.sy(v)} r={6} fill={C.warn} />
          <line
            x1={s.sx(q)}
            y1={s.y0}
            x2={s.sx(q)}
            y2={s.sy(v)}
            stroke={C.faint}
            strokeDasharray="4 4"
          />
          <SvgTex
            x={s.sx(q * 0.5)}
            y={s.sy(v * 0.32)}
            tex="A"
            color={C.ok}
            fontSize={15}
            width={20}
            anchor="middle"
          />
          <SvgTex
            x={s.sx(qMax) + 10}
            y={s.sy(line(qMax)) - 14}
            tex="\Delta V=q/C"
            color={C.mut}
            fontSize={13}
            width={84}
            anchor="end"
          />
        </svg>
      </StageScroll>

      <div className="mt-4">
        <RangeControl
          label={<RichText text="Натрупан заряд $q$" />}
          value={q * 1e6}
          min={0}
          max={1}
          step={0.01}
          valueTex={`${dec(q * 1e6, 2)}\\,\\mu\\mathrm{C}`}
          onChange={(value) => setQ(value * 1e-6)}
        />
      </div>

      <Readouts
        cols={4}
        cells={[
          { label: "Напрежение", tex: `\\Delta V=${dec(v, 2)}\\,\\mathrm{V}`, color: "var(--color-warn)" },
          { label: "Лице на триъгълника", tex: `A=${dec(work * 1e6, 2)}\\,\\mu\\mathrm{J}`, color: "var(--color-ok)" },
          { label: "Лице на правоъгълника", tex: `q\\,\\Delta V=${dec(rect * 1e6, 2)}\\,\\mu\\mathrm{J}`, color: "var(--color-minus)" },
          { label: "Отношение", tex: `A/(q\\,\\Delta V)=${q > 0 ? dec(work / rect, 3) : "0{,}500"}`, color: "var(--color-ink)" },
        ]}
      />
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Отношението не мърда от $0{,}5$ при никоя стойност на плъзгача: точно това е множителят, който липсва в наивното $Q\,\Delta V$. Причината е геометрична - лицето под наклонена права е половината от лицето на описания правоъгълник. $C=100\,\mathrm{nF}$." />
      </p>
    </div>
  );
}

/* =========================================== §2 коаксиален към плосък: грешките */

export function CoaxialLimitLab() {
  const [x, setX] = useState(0.1);
  const aRad = 5e-3;
  const len = 1;

  const exact = (t: number) => (2 * Math.PI * EPS0 * len) / Math.log(1 + t);
  const inner = (t: number) => (2 * Math.PI * EPS0 * aRad * len) / (t * aRad);
  const mean = (t: number) => inner(t) * (1 + t / 2);
  const errIn = (t: number) => (inner(t) / exact(t) - 1) * 100;
  const errMe = (t: number) => (mean(t) / exact(t) - 1) * 100;

  const X_MAX = 0.5;
  const s = scaler({ x: 96, y: 52, w: 448, h: 232 }, X_MAX, 26, 0);

  return (
    <div className={PANEL_CLASS}>
      <StageScroll minWidth={MINW}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className={`${STAGE_CLASS} select-none`}
          role="img"
          aria-label="Относителните грешки на двете приближения като функция от отношението разстояние към радиус"
        >
          <Stage w={W} h={H} title="ЕДНАТА ГРЕШКА ПАДА ЛИНЕЙНО, ДРУГАТА КВАДРАТИЧНО" />
          <PlotFrame s={s} xLabel="x=d/a" yLabel="\delta\ (\%)" yLabelColor={C.mut} quarterTicks={false} />

          <path
            d={s.path((t) => Math.abs(errIn(t)), 200, 0.002, X_MAX)}
            fill="none"
            stroke={C.plus}
            strokeWidth={3}
          />
          <path
            d={s.path((t) => (t / 2) * 100, 40, 0.002, X_MAX)}
            fill="none"
            stroke={C.plus}
            strokeWidth={1.6}
            strokeDasharray="6 5"
          />
          <path
            d={s.path((t) => Math.abs(errMe(t)), 200, 0.002, X_MAX)}
            fill="none"
            stroke={C.ok}
            strokeWidth={3}
          />
          <path
            d={s.path((t) => ((t * t) / 12) * 100, 60, 0.002, X_MAX)}
            fill="none"
            stroke={C.ok}
            strokeWidth={1.6}
            strokeDasharray="6 5"
          />

          <line x1={s.sx(x)} y1={s.box.y} x2={s.sx(x)} y2={s.y0} stroke={C.warn} strokeWidth={1.8} />
          <circle cx={s.sx(x)} cy={s.sy(Math.min(Math.abs(errIn(x)), 26))} r={5.5} fill={C.plus} />
          <circle cx={s.sx(x)} cy={s.sy(Math.min(Math.abs(errMe(x)), 26))} r={5.5} fill={C.ok} />
        </svg>
      </StageScroll>

      <Legend
        items={[
          { color: C.plus, tex: "$|C_{\\text{вътр}}-C|/C$ (плътна) срещу $x/2$ (пунктир)" },
          { color: C.ok, tex: "$|C_{\\text{ср}}-C|/C$ (плътна) срещу $x^2/12$ (пунктир)" },
        ]}
      />

      <div className="mt-4">
        <RangeControl
          label={<RichText text="Отношение $x=d/a$" />}
          value={x}
          min={0.01}
          max={0.5}
          step={0.01}
          valueTex={`${dec(x, 2)}`}
          onChange={setX}
        />
      </div>

      <Readouts
        cols={4}
        cells={[
          { label: "Точна стойност", tex: `C=${dec(exact(x) * 1e12, 1)}\\,\\mathrm{pF}`, color: "var(--color-ink)" },
          { label: "По вътрешната площ", tex: `${dec(errIn(x), 3)}\\%`, color: "var(--color-plus)" },
          { label: "По средния радиус", tex: `${dec(errMe(x), 4)}\\%`, color: "var(--color-ok)" },
          {
            label: "Отношение на грешките",
            tex: `${dec(Math.abs(errIn(x) / errMe(x)), 0)}\\times`,
            color: "var(--color-muted)",
          },
        ]}
      />
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Плътните криви са точните грешки, пунктирите са предсказанията на реда на Тейлър. Наместете $x=0{,}1$, после $x=0{,}01$: първата грешка пада около $10$ пъти, втората около $100$ пъти. $a=5\,\mathrm{mm}$, $L=1\,\mathrm{m}$." />
      </p>
    </div>
  );
}

/* ====================================================== §3 оптимален радиус */

export function BreakdownOptimumLab() {
  const bOut = 10e-3;
  const eBr = 3.0e6;
  const [a, setA] = useState(1.0);
  const [showBand, setShowBand] = useState(true);

  const aM = a * 1e-3;
  const vBr = (r: number) => eBr * r * Math.log(bOut / r); // пробивно напрежение
  const aOpt = bOut / Math.E;
  const vMax = vBr(aOpt);
  const eMaxAt10kV = 10e3 / (aM * Math.log(bOut / aM));

  const s = scaler({ x: 74, y: 52, w: 470, h: 232 }, 10, 13, 0);

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-1.5">
        <Toggle on={showBand} onChange={setShowBand}>
          Поле <RichText text="$\pm20\%$" /> около оптимума
        </Toggle>
      </div>

      <StageScroll minWidth={MINW}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className={`${STAGE_CLASS} select-none`}
          role="img"
          aria-label="Пробивното напрежение като функция от радиуса на вътрешното жило, с ясен максимум"
        >
          <Stage w={W} h={H} title="ПРОБИВНОТО НАПРЕЖЕНИЕ ИМА МАКСИМУМ · И ТОЙ Е МНОГО ПЛОСЪК" />
          <PlotFrame s={s} xLabel="a\ (\mathrm{mm})" yLabel="\Delta V_{\text{пр}}\ (\mathrm{kV})" yLabelColor={C.ok} quarterTicks={false} />

          {showBand && (
            <rect
              x={s.sx(0.8 * aOpt * 1e3)}
              y={s.box.y}
              width={s.sx(1.2 * aOpt * 1e3) - s.sx(0.8 * aOpt * 1e3)}
              height={s.box.h}
              fill={C.ok}
              fillOpacity={0.12}
            />
          )}

          <line
            x1={s.box.x}
            y1={s.sy(10)}
            x2={s.box.x + s.box.w}
            y2={s.sy(10)}
            stroke={C.minus}
            strokeWidth={2}
            strokeDasharray="8 5"
          />
          <SvgTex
            x={s.box.x + s.box.w - 4}
            y={s.sy(10) - 15}
            tex="10\,\mathrm{kV}"
            color={C.minus}
            fontSize={12.5}
            width={58}
            anchor="end"
          />

          <path
            d={s.path((r) => vBr(r * 1e-3) / 1e3, 220, 0.08, 9.94)}
            fill="none"
            stroke={C.ok}
            strokeWidth={3}
          />

          <line
            x1={s.sx(aOpt * 1e3)}
            y1={s.sy(vMax / 1e3)}
            x2={s.sx(aOpt * 1e3)}
            y2={s.y0}
            stroke={C.faint}
            strokeDasharray="5 4"
          />
          <circle cx={s.sx(aOpt * 1e3)} cy={s.sy(vMax / 1e3)} r={6} fill={C.warn} />
          <SvgTex
            x={s.sx(aOpt * 1e3)}
            y={s.y0 + 22}
            tex="b/e"
            color={C.warn}
            fontSize={13}
            width={34}
            anchor="middle"
          />

          <line x1={s.sx(a)} y1={s.box.y} x2={s.sx(a)} y2={s.y0} stroke={C.plus} strokeWidth={1.8} />
          <circle cx={s.sx(a)} cy={s.sy(vBr(aM) / 1e3)} r={5.5} fill={C.plus} />
        </svg>
      </StageScroll>

      <div className="mt-4">
        <RangeControl
          label={<RichText text="Радиус на жилото $a$" />}
          value={a}
          min={0.2}
          max={9.5}
          step={0.1}
          valueTex={`${dec(a, 1)}\\,\\mathrm{mm}`}
          onChange={setA}
        />
      </div>

      <Readouts
        cols={4}
        cells={[
          { label: "Пробивно напрежение", tex: `\\Delta V_{\\text{пр}}=${dec(vBr(aM) / 1e3, 2)}\\,\\mathrm{kV}`, color: "var(--color-ok)" },
          { label: "Спрямо оптимума", tex: `${dec((vBr(aM) / vMax - 1) * 100, 1)}\\%`, color: "var(--color-muted)" },
          {
            label: "Поле при 10 kV",
            tex: `E_{\\max}=${dec(eMaxAt10kV / 1e6, 2)}\\,\\mathrm{MV/m}`,
            color: eMaxAt10kV > eBr ? "var(--color-plus)" : "var(--color-ink)",
          },
          {
            label: "При 10 kV кабелът",
            tex: eMaxAt10kV > eBr ? `\\text{пробива}` : `\\text{издържа}`,
            color: eMaxAt10kV > eBr ? "var(--color-plus)" : "var(--color-ok)",
          },
        ]}
      />
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Плъзнете $a$ надолу от оптимума: междината се уголемява, но кривата пада - точно обратното на очакването от предложението „по-тънко жило, по-дебела изолация“. В зеленото поле радиусът се мени с $\pm20\%$, а напрежението губи едва около $2\%$. $b=10\,\mathrm{mm}$, $E_{\text{пр}}=3{,}0\,\mathrm{MV/m}$." />
      </p>
    </div>
  );
}

/* ==================================================== §4 раздалечаване на плочи */

export function PlateSeparationLab() {
  const area = 100e-4;
  const d1 = 1e-3;
  const v0 = 1000;
  const [d, setD] = useState(1.0);
  const [mode, setMode] = useState<"Q" | "V">("Q");

  const dM = d * 1e-3;
  const c1 = (EPS0 * area) / d1;
  const q1 = c1 * v0;
  const a1 = 0.5 * c1 * v0 * v0;

  const capAt = (x: number) => (EPS0 * area) / x;
  const energyQ = (x: number) => (q1 * q1 * x) / (2 * EPS0 * area); // Q = const
  const energyV = (x: number) => (EPS0 * area * v0 * v0) / (2 * x); // ΔV = const

  const cap = capAt(dM);
  const qNow = mode === "Q" ? q1 : cap * v0;
  const vNow = mode === "Q" ? q1 / cap : v0;
  const aNow = mode === "Q" ? energyQ(dM) : energyV(dM);
  const forceQ = (q1 * q1) / (2 * EPS0 * area);
  const forceV = (EPS0 * area * v0 * v0) / (2 * dM * dM);

  const s = scaler({ x: 82, y: 52, w: 462, h: 232 }, 3.4, 150, 0);

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          className={BTN_SEC}
          onClick={() => setMode((m) => (m === "Q" ? "V" : "Q"))}
        >
          {mode === "Q" ? "Случай А: изключен · превключи" : "Случай Б: свързан · превключи"}
        </button>
      </div>

      <StageScroll minWidth={MINW}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className={`${STAGE_CLASS} select-none`}
          role="img"
          aria-label="Енергията на кондензатора при раздалечаване на плочите в двата случая"
        >
          <Stage w={W} h={H} title="ЕДНО И СЪЩО ДЪРПАНЕ, ДВЕ ПРОТИВОПОЛОЖНИ ПОСОКИ НА ЕНЕРГИЯТА" />
          <PlotFrame s={s} xLabel="x\ (\mathrm{mm})" yLabel="A\ (\mu\mathrm{J})" yLabelColor={C.mut} quarterTicks={false} />

          <path
            d={s.path((x) => energyQ(x * 1e-3) * 1e6, 80, 0.5, 3.4)}
            fill="none"
            stroke={C.plus}
            strokeWidth={mode === "Q" ? 3.4 : 2}
            opacity={mode === "Q" ? 1 : 0.45}
          />
          <path
            d={s.path((x) => energyV(x * 1e-3) * 1e6, 120, 0.5, 3.4)}
            fill="none"
            stroke={C.minus}
            strokeWidth={mode === "V" ? 3.4 : 2}
            opacity={mode === "V" ? 1 : 0.45}
          />

          <line x1={s.sx(1)} y1={s.box.y} x2={s.sx(1)} y2={s.y0} stroke={C.faint} strokeDasharray="5 4" />
          <SvgTex x={s.sx(1)} y={s.y0 + 22} tex="d_1" color={C.mut} fontSize={12.5} width={26} anchor="middle" />
          <line x1={s.sx(3)} y1={s.box.y} x2={s.sx(3)} y2={s.y0} stroke={C.faint} strokeDasharray="5 4" />
          <SvgTex x={s.sx(3)} y={s.y0 + 22} tex="d_2" color={C.mut} fontSize={12.5} width={26} anchor="middle" />

          <line x1={s.sx(d)} y1={s.box.y} x2={s.sx(d)} y2={s.y0} stroke={C.warn} strokeWidth={1.8} />
          <circle
            cx={s.sx(d)}
            cy={s.sy(Math.min(aNow * 1e6, 150))}
            r={6}
            fill={mode === "Q" ? C.plus : C.minus}
          />
        </svg>
      </StageScroll>

      <Legend
        items={[
          { color: C.plus, tex: "Случай А: $Q=\\mathrm{const}$, $A\\propto x$" },
          { color: C.minus, tex: "Случай Б: $\\Delta V=\\mathrm{const}$, $A\\propto 1/x$" },
        ]}
      />

      <div className="mt-4">
        <RangeControl
          label={<RichText text="Разстояние между плочите $x$" />}
          value={d}
          min={1}
          max={3}
          step={0.05}
          valueTex={`${dec(d, 2)}\\,\\mathrm{mm}`}
          onChange={setD}
        />
      </div>

      <Readouts
        cols={5}
        cells={[
          { label: "Капацитет", tex: `C=${dec(cap * 1e12, 2)}\\,\\mathrm{pF}`, color: "var(--color-ink)" },
          { label: "Заряд", tex: `Q=${dec(qNow * 1e9, 2)}\\,\\mathrm{nC}`, color: "var(--color-muted)" },
          { label: "Напрежение", tex: `\\Delta V=${dec(vNow, 0)}\\,\\mathrm{V}`, color: "var(--color-warn)" },
          {
            label: "Енергия",
            tex: `A=${dec(aNow * 1e6, 2)}\\,\\mu\\mathrm{J}`,
            color: mode === "Q" ? "var(--color-plus)" : "var(--color-minus)",
          },
          {
            label: "Промяна спрямо старта",
            tex: `${dec((aNow - a1) * 1e6, 2)}\\,\\mu\\mathrm{J}`,
            color: aNow >= a1 ? "var(--color-plus)" : "var(--color-ok)",
          },
        ]}
      />
      <Readouts
        cols={3}
        cells={[
          {
            label: "Сила на привличане",
            tex: `F=${dec((mode === "Q" ? forceQ : forceV) * 1e3, 2)}\\,\\mathrm{mN}`,
            color: "var(--color-ink)",
          },
          {
            label: "Зависи ли F от x",
            tex: mode === "Q" ? `\\text{не}` : `\\text{да, } F\\propto 1/x^2`,
            color: "var(--color-muted)",
          },
          {
            label: "Работа на външната сила",
            tex:
              mode === "Q"
                ? `A_{\\text{вън}}=${dec((energyQ(dM) - a1) * 1e6, 2)}\\,\\mu\\mathrm{J}`
                : `A_{\\text{вън}}=${dec(((EPS0 * area * v0 * v0) / 2) * (1 / d1 - 1 / dM) * 1e6, 2)}\\,\\mu\\mathrm{J}`,
            color: "var(--color-ok)",
          },
        ]}
      />
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="В случай А външната работа отива изцяло в кондензатора, затова двете числа съвпадат. В случай Б външната сила пак върши положителна работа, но енергията на кондензатора **пада**: разликата се връща в източника. $S=100\,\mathrm{cm^2}$, $\Delta V_{\text{нач}}=1000\,\mathrm{V}$." />
      </p>
    </div>
  );
}

/* ================================================= §5 загубената половина енергия */

export function ChargeSharingLab() {
  const cap = 100e-9;
  const v0 = 10;
  const [res, setRes] = useState(50);

  const tau = (res * cap) / 4; // константа на спадане на мощността
  const p0 = (v0 * v0) / res;
  const lost = (cap * v0 * v0) / 4;
  const before = 0.5 * cap * v0 * v0;

  const T_MAX = 8e-6;
  const s = scaler({ x: 96, y: 52, w: 448, h: 232 }, T_MAX, 5.6, 0);
  const power = (t: number) => p0 * Math.exp(-t / tau);

  const areaPath = `${s.path(power, 200, 0, T_MAX)} L ${s.sx(T_MAX)} ${s.y0} L ${s.sx(0)} ${s.y0} Z`;

  return (
    <div className={PANEL_CLASS}>
      <StageScroll minWidth={MINW}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className={`${STAGE_CLASS} select-none`}
          role="img"
          aria-label="Разсеяната мощност във времето: при малко съпротивление тя е висока и кратка, при голямо ниска и дълга"
        >
          <Stage w={W} h={H} title="ВИСОКО И ТЯСНО ИЛИ НИСКО И ШИРОКО · ЛИЦЕТО Е ЕДНО И СЪЩО" />
          <PlotFrame s={s} xLabel="t\ (\mu\mathrm{s})" yLabel="p\ (\mathrm{W})" yLabelColor={C.plus} quarterTicks={false} />
          <path d={areaPath} fill={C.plus} fillOpacity={0.3} />
          <path d={s.path(power, 240, 0, T_MAX)} fill="none" stroke={C.plus} strokeWidth={3} />
          <SvgTex
            x={s.sx(T_MAX * 0.52)}
            y={s.sy(1.1)}
            tex="\int p\,dt=\tfrac14 C\,\Delta V_0^2"
            color={C.plus}
            fontSize={13}
            width={132}
            anchor="middle"
          />
        </svg>
      </StageScroll>

      <div className="mt-4">
        <RangeControl
          label={<RichText text="Съпротивление на проводниците $R$" />}
          value={res}
          min={20}
          max={100}
          step={5}
          valueTex={`${res}\\,\\Omega`}
          onChange={setRes}
        />
      </div>

      <Readouts
        cols={5}
        cells={[
          { label: "Начална мощност", tex: `p(0)=${dec(p0, 2)}\\,\\mathrm{W}`, color: "var(--color-plus)" },
          { label: "Време на спадане", tex: `RC/4=${dec(tau * 1e6, 2)}\\,\\mu\\mathrm{s}`, color: "var(--color-muted)" },
          { label: "Енергия преди", tex: `${dec(before * 1e6, 2)}\\,\\mu\\mathrm{J}`, color: "var(--color-ink)" },
          { label: "Енергия след", tex: `${dec((before - lost) * 1e6, 2)}\\,\\mu\\mathrm{J}`, color: "var(--color-ink)" },
          { label: "Разсеяна", tex: `${dec(lost * 1e6, 2)}\\,\\mu\\mathrm{J}`, color: "var(--color-plus)" },
        ]}
      />
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Менете $R$ и гледайте последните три числа: те не помръдват. Височината на върха расте като $1/R$, ширината му расте като $R$, а произведението - лицето - е винаги $\tfrac14 C\,\Delta V_0^2$, тоест точно половината от началната енергия. $C=100\,\mathrm{nF}$, $\Delta V_0=10\,\mathrm{V}$." />
      </p>
    </div>
  );
}

/* ============================================ §6 къде седи енергията в коаксиала */

export function EnergyEnclosedLab() {
  const [aMm, setAMm] = useState(1);
  const [bMm, setBMm] = useState(100);
  const [rMm, setRMm] = useState(10);

  const a = Math.min(aMm, bMm / 1.5);
  const b = bMm;
  const r = Math.min(Math.max(rMm, a), b);
  const half = Math.sqrt(a * b);

  const frac = Math.log(r / a) / Math.log(b / a);
  const volFrac = (r * r - a * a) / (b * b - a * a);

  /** Логаритмична ос: така делът на енергията е права линия. */
  const lg = (v: number) => Math.log10(v);
  const s = scaler({ x: 250, y: 58, w: 300, h: 226 }, lg(b) - lg(a), 1.08, 0);
  const px = (v: number) => s.sx(lg(v) - lg(a));

  const cx = 128;
  const cy = 170;
  const rad = (v: number) => 9 + (97 * (v - a)) / (b - a);

  return (
    <div className={PANEL_CLASS}>
      <StageScroll minWidth={MINW}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className={`${STAGE_CLASS} select-none`}
          role="img"
          aria-label="Напречно сечение на коаксиален кабел и делът на енергията вътре в радиус r"
        >
          <Stage w={W} h={H} title="ПОЛОВИНАТА ЕНЕРГИЯ СЕДИ В МАЛЪК ДЯЛ ОТ ОБЕМА" />

          <circle cx={cx} cy={cy} r={rad(b)} fill={C.faint} fillOpacity={0.1} stroke={C.mut} strokeWidth={2} />
          <path
            d={`M ${cx} ${cy} m ${-rad(r)} 0 a ${rad(r)} ${rad(r)} 0 1 0 ${2 * rad(r)} 0 a ${rad(r)} ${rad(r)} 0 1 0 ${-2 * rad(r)} 0
                M ${cx} ${cy} m ${-rad(a)} 0 a ${rad(a)} ${rad(a)} 0 1 1 ${2 * rad(a)} 0 a ${rad(a)} ${rad(a)} 0 1 1 ${-2 * rad(a)} 0`}
            fill={C.warn}
            fillOpacity={0.32}
            fillRule="evenodd"
          />
          <circle cx={cx} cy={cy} r={rad(r)} fill="none" stroke={C.warn} strokeWidth={2.2} />
          <circle cx={cx} cy={cy} r={rad(a)} fill={C.plus} fillOpacity={0.5} stroke={C.plus} strokeWidth={2} />
          <SvgTex x={cx} y={cy + rad(b) + 22} tex="b" color={C.mut} fontSize={13} width={18} anchor="middle" />
          <SvgTex x={cx - rad(r) - 12} y={cy + 2} tex="a" color={C.plus} fontSize={13} width={18} anchor="end" />
          <SvgTex x={cx + rad(r) + 4} y={cy - rad(r) - 12} tex="r" color={C.warn} fontSize={13} width={18} anchor="middle" />

          <PlotFrame s={s} xLabel="\log r" yLabel="A(r)/A" yLabelColor={C.ok} quarterTicks={false} />
          <path
            d={s.path((u) => u / (lg(b) - lg(a)), 40, 0, lg(b) - lg(a))}
            fill="none"
            stroke={C.ok}
            strokeWidth={3}
          />
          <line x1={px(half)} y1={s.sy(0.5)} x2={px(half)} y2={s.y0} stroke={C.faint} strokeDasharray="5 4" />
          <line x1={s.box.x} y1={s.sy(0.5)} x2={px(half)} y2={s.sy(0.5)} stroke={C.faint} strokeDasharray="5 4" />
          <circle cx={px(half)} cy={s.sy(0.5)} r={6} fill={C.minus} />
          <SvgTex
            x={px(half)}
            y={s.y0 + 22}
            tex="\sqrt{ab}"
            color={C.minus}
            fontSize={12.5}
            width={46}
            anchor="middle"
          />
          <circle cx={px(r)} cy={s.sy(frac)} r={5.5} fill={C.warn} />
        </svg>
      </StageScroll>

      <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-3">
        <RangeControl
          label={<RichText text="Вътрешен радиус $a$" />}
          value={aMm}
          min={0.5}
          max={10}
          step={0.5}
          valueTex={`${dec(aMm, 1)}\\,\\mathrm{mm}`}
          onChange={setAMm}
        />
        <RangeControl
          label={<RichText text="Външен радиус $b$" />}
          value={bMm}
          min={20}
          max={200}
          step={5}
          valueTex={`${bMm}\\,\\mathrm{mm}`}
          onChange={setBMm}
        />
        <RangeControl
          label={<RichText text="Текущ радиус $r$" />}
          value={rMm}
          min={0.5}
          max={200}
          step={0.5}
          valueTex={`${dec(r, 1)}\\,\\mathrm{mm}`}
          onChange={setRMm}
        />
      </div>

      <Readouts
        cols={4}
        cells={[
          { label: "Дял от енергията", tex: `${dec(frac * 100, 1)}\\%`, color: "var(--color-ok)" },
          { label: "Дял от обема", tex: `${dec(volFrac * 100, 2)}\\%`, color: "var(--color-warn)" },
          { label: "Половината енергия при", tex: `\\sqrt{ab}=${dec(half, 1)}\\,\\mathrm{mm}`, color: "var(--color-minus)" },
          {
            label: "Обем до $\\sqrt{ab}$",
            tex: `${dec(((half * half - a * a) / (b * b - a * a)) * 100, 2)}\\%`,
            color: "var(--color-muted)",
          },
        ]}
      />
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Върху логаритмична ос делът на енергията е права линия: всяка декада по радиуса носи еднакъв дял. Затова половината пада точно по средата на логаритмичната скала, тоест при геометричната средна $\sqrt{ab}$ - а тя е много близо до вътрешното жило." />
      </p>
    </div>
  );
}
