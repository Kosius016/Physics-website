"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import {
  Legend,
  RangeControl,
  Readouts,
  Stage,
  StageScroll,
  Toggle,
  dec,
  scaler,
  useClock,
  type Cell,
} from "./acPlot";
import { BTN_PRI, BTN_SEC, C, PANEL_CLASS, STAGE_CLASS } from "./svg";

/**
 * Интерактивите към §7 и §9: ядрото и общият поток, отношението на навивките
 * с товар и опитът с постоянен ток.
 *
 * Държат се разделени, а не като един компонент с превключвател за режим,
 * защото всяка секция иска своята фигура в своя момент: в §7 контрол за
 * товар още не значи нищо.
 */

/* ------------------------------------------------- общо: ядро и намотки */

const CORE = { x: 132, y: 58, w: 296, h: 184, t: 34 };

/** Правоъгълно ламелирано ядро: външен контур минус прозорецът. */
function Core({ dim = false }: { dim?: boolean }) {
  const { x, y, w, h, t } = CORE;
  return (
    <g>
      <path
        d={`M ${x} ${y} h ${w} v ${h} h ${-w} Z
            M ${x + t} ${y + t} v ${h - 2 * t} h ${w - 2 * t} v ${-(h - 2 * t)} Z`}
        fillRule="evenodd"
        fill={C.mut}
        opacity={dim ? 0.18 : 0.3}
        stroke={C.mut}
        strokeWidth={1.6}
      />
      {/* ламелите: тънки вертикални резки по горното и долното рамо */}
      {Array.from({ length: 14 }, (_, i) => (
        <line
          key={i}
          x1={x + 18 + i * 20}
          y1={y + 5}
          x2={x + 18 + i * 20}
          y2={y + t - 5}
          stroke={C.faint}
          strokeWidth={1}
        />
      ))}
    </g>
  );
}

/**
 * Намотка върху вертикално рамо: `n` видими навивки.
 * Над 12 навивки рисуваме 12 и оставяме броя за readout лентата.
 */
function Winding({
  cx,
  n,
  color,
  opacity = 1,
}: {
  cx: number;
  n: number;
  color: string;
  opacity?: number;
}) {
  const shown = Math.max(3, Math.min(12, Math.round(n)));
  const top = CORE.y + CORE.t + 12;
  const span = CORE.h - 2 * CORE.t - 24;
  const step = span / shown;
  const r = Math.min(11, step / 2);
  return (
    <g stroke={color} strokeWidth={2.6} fill="none" opacity={opacity}>
      {Array.from({ length: shown }, (_, i) => {
        const y = top + step * (i + 0.5);
        return <ellipse key={i} cx={cx} cy={y} rx={26} ry={r} />;
      })}
    </g>
  );
}

/** Затворените силови линии вътре в ядрото, с посока според знака на потока. */
function FluxLoop({ phase, opacity = 1 }: { phase: number; opacity?: number }) {
  const { x, y, w, h, t } = CORE;
  const inset = t / 2;
  const d = `M ${x + inset} ${y + inset} h ${w - 2 * inset} v ${h - 2 * inset} h ${-(w - 2 * inset)} Z`;
  return (
    <g opacity={opacity}>
      <path
        d={d}
        fill="none"
        stroke={C.minus}
        strokeWidth={2.4}
        strokeDasharray="12 9"
        strokeDashoffset={-phase * 21}
        opacity={0.9}
      />
    </g>
  );
}

/* ================================================================= §7 */

/** Навивките, които сцената реално рисува: readout лентата ползва същите. */
const N1_DRAWN = 8;
const N2_DRAWN = 5;

const PHASE_CAPTIONS = [
  "Най-простият опит е очевиден: две намотки една до друга във въздуха. Първичната наистина създава променлив поток и във вторичната наистина се появява ЕДН.",
  "Грешката е в свързването: почти целият поток се затваря около първата намотка и пропуска втората. Напрежение има, но $k\\ll1$ и така не се пренася голяма мощност.",
  "Решението е общ феромагнитен път. За магнитния поток той е много по-лесен път от въздуха, затова разсеяният поток намалява и $k$ се доближава до 1.",
  "Двете медни намотки остават електрически отделени. Ядрото ги държи и води потока, но е изолирано от проводниците и не е проводящ мост между двете вериги.",
  "Всяка навивка от двете страни вижда едно и също $d\\Phi/dt$. Осем навивки срещу пет дават $v_2/v_1=5/8=0{,}63$: отношението на напреженията е отношението на навивките.",
];

/** Разсеяният поток при първия, въздушен вариант на устройството. */
function AirFlux({ phase }: { phase: number }) {
  const cx = CORE.x + CORE.t / 2;
  const cy = CORE.y + CORE.h / 2;
  return (
    <g fill="none" stroke={C.minus} strokeDasharray="10 8" strokeDashoffset={-phase * 20}>
      {[
        { rx: 48, ry: 54, opacity: 0.9 },
        { rx: 78, ry: 76, opacity: 0.72 },
        { rx: 116, ry: 98, opacity: 0.55 },
        { rx: 244, ry: 122, opacity: 0.3 },
      ].map((loop) => (
        <ellipse
          key={loop.rx}
          cx={cx}
          cy={cy}
          rx={loop.rx}
          ry={loop.ry}
          strokeWidth={2.1}
          opacity={loop.opacity}
        />
      ))}
    </g>
  );
}

/**
 * Фазовата сцена към §7: ядро → първична и поток → вторична → етикети.
 *
 * Потокът е анимиран, но има и плъзгач за фазата, за да е достъпно
 * състоянието и без движение.
 */
export function CoreFluxScene() {
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [manual, setManual] = useState(0);
  const { turns, setTurns } = useClock(playing, 0.28);

  const tau = playing ? turns : manual;
  const flux = Math.sin(2 * Math.PI * tau);
  // ЕДН на **една** навивка: то е общото за двете страни
  const perTurn = Math.cos(2 * Math.PI * tau);

  const W = 560;
  const H = 300;

  return (
    <div className={PANEL_CLASS}>
      <StageScroll minWidth={520} maxWidth={620}>
        <svg viewBox={`0 0 ${W} ${H}`} className={STAGE_CLASS} aria-label="Две намотки върху общо ядро">
          <Stage
            w={W}
            h={H}
            title={phase < 2 ? "ПЪРВИ ОПИТ: ДВЕ НАМОТКИ ВЪВ ВЪЗДУХ" : "РЕШЕНИЕ: ОБЩ МАГНИТЕН ПЪТ"}
          />

          {phase < 2 ? <AirFlux phase={tau} /> : <Core />}
          {phase >= 2 && <FluxLoop phase={tau} opacity={0.9} />}

          <Winding cx={CORE.x + CORE.t / 2} n={N1_DRAWN} color={C.warn} />
          <Winding cx={CORE.x + CORE.w - CORE.t / 2} n={N2_DRAWN} color={C.ok} opacity={phase < 2 ? 0.72 : 1} />

          {/* изводи */}
          <g stroke={C.warn} strokeWidth={2.4} fill="none">
            <path d={`M ${CORE.x + CORE.t / 2 - 26} 108 H 58`} />
            <path d={`M ${CORE.x + CORE.t / 2 - 26} 200 H 58`} />
          </g>
          <g stroke={C.ok} strokeWidth={2.4} fill="none" opacity={phase < 2 ? 0.72 : 1}>
            <path d={`M ${CORE.x + CORE.w - CORE.t / 2 + 26} 108 H 502`} />
            <path d={`M ${CORE.x + CORE.w - CORE.t / 2 + 26} 200 H 502`} />
          </g>

          {phase >= 3 && (
            <>
              <SvgTex x={62} y={128} tex="v_1,\ N_1=8" color={C.warn} fontSize={14} width={76} />
              <SvgTex x={498} y={128} tex="v_2,\ N_2=5" color={C.ok} fontSize={14} width={76} anchor="end" />
              <SvgTex
                x={CORE.x + CORE.w / 2}
                y={CORE.y + CORE.h / 2 - 12}
                tex="\Phi(t)"
                color={C.minus}
                fontSize={16}
                width={48}
                anchor="middle"
              />
            </>
          )}
          {phase >= 2 && phase < 3 && (
            <SvgTex
              x={CORE.x + CORE.w / 2}
              y={CORE.y + CORE.h / 2 - 12}
              tex="\Phi"
              color={C.minus}
              fontSize={16}
              width={22}
              anchor="middle"
            />
          )}
          {phase === 1 && (
            <>
              <SvgTex x={126} y={44} tex="\\Phi_1" color={C.minus} fontSize={14} width={30} anchor="middle" />
              <SvgTex x={414} y={44} tex="\\Phi_2\\ll\\Phi_1" color={C.ok} fontSize={13.5} width={82} anchor="middle" />
            </>
          )}
        </svg>
      </StageScroll>

      <Readouts
        cells={phase < 2
          ? [
              { label: "Свързване", tex: "k\\approx0{,}2", color: C.plus },
              { label: "Поток на първичната", tex: `\\Phi_1/\\Phi_{\\max}=${dec(flux)}`, color: C.minus },
              { label: "През вторичната", tex: "\\Phi_2\\approx0{,}2\\Phi_1", color: C.ok },
              { label: "Резултат", tex: "\\text{силно разсейване}", color: C.plus },
            ]
          : [
              { label: "Свързване", tex: "k\\approx0{,}98", color: C.ok },
              { label: "Общ поток", tex: `\\Phi/\\Phi_{\\max}=${dec(flux)}`, color: C.minus },
              { label: "ЕДН на навивка", tex: `d\\Phi/dt\\ \\propto\\ ${dec(perTurn)}` },
              { label: "Вторично, 5 навивки", tex: `v_2\\ \\propto\\ ${dec(N2_DRAWN * perTurn)}`, color: C.ok },
            ]}
        cols={4}
      />

      <p aria-live="polite" className="mt-3 text-[13.5px] leading-relaxed text-ink/90">
        <RichText text={PHASE_CAPTIONS[phase]} />
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" className={BTN_SEC} onClick={() => setPhase((p) => Math.max(0, p - 1))} disabled={phase === 0}>
          Назад
        </button>
        <button type="button" className={BTN_PRI} onClick={() => setPhase((p) => Math.min(4, p + 1))} disabled={phase === 4}>
          {phase === 0 ? "Открий проблема" : phase === 1 ? "Покажи решението" : "Следваща стъпка"}
        </button>
        <span className="text-[13px] font-semibold text-muted">Стъпка {phase + 1} от 5</span>
        {phase >= 0 && (
          <Toggle
            on={playing}
            onChange={(on) => {
              if (!on) setManual(turns % 1);
              else setTurns(manual);
              setPlaying(on);
            }}
          >
            {playing ? "Спри" : "Пусни"}
          </Toggle>
        )}
      </div>

      {phase >= 1 && !playing && (
        <div className="mt-4">
          <RangeControl
            label="Фаза на променливия ток"
            value={manual}
            min={0}
            max={1}
            step={0.005}
            valueTex={`\\omega t/2\\pi=${dec(manual)}`}
            onChange={setManual}
          />
        </div>
      )}
    </div>
  );
}

/* ============================================================ §8 и §9 */

interface TurnsPreset {
  label: string;
  n1: number;
  n2: number;
  v1: number;
  load: number | null;
}

const TURNS_PRESETS: TurnsPreset[] = [
  { label: "1:1 разделителен", n1: 1000, n2: 1000, v1: 230, load: 200 },
  { label: "230 → 12 V", n1: 2300, n2: 120, v1: 230, load: 12 },
  { label: "Повишаващ", n1: 400, n2: 4000, v1: 230, load: 20000 },
  { label: "Празен ход", n1: 2300, n2: 120, v1: 230, load: null },
];

/**
 * Отношението на навивките с товар: двата ватметъра показват едно и също.
 *
 * Моделът тук е **идеалният** трансформатор, точно както в §9 на урока:
 * без загуби и без ток на празен ход. Реалният ток на празен ход се въвежда
 * чак в §10, за да не се смесват двата модела.
 */
export function TurnsRatioLab() {
  const [n1, setN1] = useState(2300);
  const [n2, setN2] = useState(120);
  const [v1, setV1] = useState(230);
  const [load, setLoad] = useState<number | null>(12);

  const ratio = n2 / n1;
  const v2 = v1 * ratio;
  const i2 = load === null ? 0 : v2 / load;
  const i1 = i2 * ratio;
  const p2 = v2 * i2;
  const p1 = v1 * i1;

  const W = 620;
  const H = 328;

  /*
   * Размяната се показва с две огледални двойки ленти, а не с „еднаква площ“:
   * при отношение 19:1 правоъгълник с вярна площ става невидима нишка, а
   * клампването ѝ би направило картината невярна. Всяка двойка е нормирана
   * към своя максимум, затова дългото и късото се разменят между редовете
   * при всяко отношение.
   */
  const barX = 132;
  const barW = 372;
  const vMax = Math.max(v1, v2, 1e-9);
  const iMax = Math.max(i1, i2, 1e-9);
  const rows = [
    { y: 208, tex: "V_1", value: v1, max: vMax, color: C.warn },
    { y: 232, tex: "V_2", value: v2, max: vMax, color: C.ok },
    { y: 274, tex: "I_1", value: i1, max: iMax, color: C.warn },
    { y: 298, tex: "I_2", value: i2, max: iMax, color: C.ok },
  ];

  /** Пълна скала на ватметъра: закръглена нагоре до цяла декада. */
  const pFull = p1 > 0 ? 10 ** Math.ceil(Math.log10(p1)) : 1;

  const cells: Cell[] = [
    { label: "Отношение", tex: `N_2/N_1=${dec(ratio, ratio < 0.1 ? 3 : 2)}` },
    { label: "Вторично напрежение", tex: `V_2=${dec(v2, 1)}\\,\\mathrm V`, color: C.ok },
    { label: "Вторичен ток", tex: `I_2=${dec(i2, 2)}\\,\\mathrm A`, color: C.ok },
    { label: "Първичен ток", tex: `I_1=${dec(i1, 3)}\\,\\mathrm A`, color: C.warn },
    { label: "Мощност вход", tex: `P_1=${dec(p1, 1)}\\,\\mathrm W`, color: C.warn },
    { label: "Мощност изход", tex: `P_2=${dec(p2, 1)}\\,\\mathrm W`, color: C.ok },
  ];

  return (
    <div className={PANEL_CLASS}>
      <StageScroll minWidth={580}>
        <svg viewBox={`0 0 ${W} ${H}`} className={STAGE_CLASS} aria-label="Отношение на навивките и размяна напрежение срещу ток">
          <Stage w={W} h={H} title="ИДЕАЛЕН ТРАНСФОРМАТОР" />

          {/* ядрото по средата, намотките отстрани */}
          <g transform="translate(30,-6) scale(0.62)">
            <Core />
            <Winding cx={CORE.x + CORE.t / 2} n={n1 / 200} color={C.warn} />
            <Winding cx={CORE.x + CORE.w - CORE.t / 2} n={n2 / 200} color={C.ok} />
          </g>

          <SvgTex x={92} y={54} tex="N_1" color={C.warn} fontSize={14} width={28} anchor="middle" />
          <SvgTex x={288} y={54} tex="N_2" color={C.ok} fontSize={14} width={28} anchor="middle" />

          {/* двата ватметъра */}
          {[
            { cx: 440, label: "P_1", color: C.warn, value: p1 },
            { cx: 552, label: "P_2", color: C.ok, value: p2 },
          ].map((m) => {
            const frac = Math.min(1, m.value / pFull);
            const ang = Math.PI * (1 - frac); // 180° при нула, 0° при пълна скала
            return (
              <g key={m.label}>
                <circle cx={m.cx} cy={104} r={38} fill="none" stroke={m.color} strokeWidth={2.4} />
                {Array.from({ length: 6 }, (_, k) => {
                  const a = Math.PI * (1 - k / 5);
                  return (
                    <line
                      key={k}
                      x1={m.cx + 31 * Math.cos(a)}
                      y1={104 - 31 * Math.sin(a)}
                      x2={m.cx + 37 * Math.cos(a)}
                      y2={104 - 37 * Math.sin(a)}
                      stroke={C.faint}
                      strokeWidth={1.6}
                    />
                  );
                })}
                <line
                  x1={m.cx}
                  y1={104}
                  x2={m.cx + 28 * Math.cos(ang)}
                  y2={104 - 28 * Math.sin(ang)}
                  stroke={C.wire}
                  strokeWidth={2.4}
                />
                <circle cx={m.cx} cy={104} r={3.4} fill={C.wire} />
                <SvgTex x={m.cx} y={150} tex={m.label} color={m.color} fontSize={14} width={26} anchor="middle" />
              </g>
            );
          })}

          {/* две огледални двойки: дългото и късото си сменят местата */}
          {rows.map((r) => (
            <g key={r.tex}>
              <line
                x1={barX}
                y1={r.y + 7}
                x2={barX + barW}
                y2={r.y + 7}
                stroke={C.faint}
                strokeWidth={1}
                opacity={0.5}
              />
              <rect
                x={barX}
                y={r.y}
                width={Math.max(2, (r.value / r.max) * barW)}
                height={14}
                rx={3}
                fill={r.color}
                opacity={0.85}
              />
              <SvgTex x={barX - 12} y={r.y - 2} tex={r.tex} color={r.color} fontSize={13} width={26} anchor="end" />
            </g>
          ))}
          <line x1={barX - 40} y1={253} x2={barX + barW} y2={253} stroke={C.faint} strokeWidth={1.2} />

          <SvgTex x={496} y={176} tex="V_1I_1=V_2I_2" color={C.wire} fontSize={15} width={112} anchor="middle" />
        </svg>
      </StageScroll>

      <Readouts cells={cells} cols={3} />

      <Legend
        items={[
          { color: C.warn, tex: "първична страна" },
          { color: C.ok, tex: "вторична страна" },
        ]}
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {TURNS_PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            className={BTN_SEC}
            onClick={() => {
              setN1(p.n1);
              setN2(p.n2);
              setV1(p.v1);
              setLoad(p.load);
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <RangeControl
          label="Навивки, първична"
          value={n1}
          min={100}
          max={4000}
          step={20}
          valueTex={`N_1=${dec(n1, 0)}`}
          onChange={setN1}
          accent="accent-warn"
        />
        <RangeControl
          label="Навивки, вторична"
          value={n2}
          min={20}
          max={4000}
          step={20}
          valueTex={`N_2=${dec(n2, 0)}`}
          onChange={setN2}
        />
        <RangeControl
          label="Първично напрежение"
          value={v1}
          min={12}
          max={400}
          step={1}
          valueTex={`V_1=${dec(v1, 0)}\\,\\mathrm V`}
          onChange={setV1}
          accent="accent-warn"
        />
        <RangeControl
          label="Товар на вторичната"
          value={load ?? 0}
          min={0}
          max={200}
          step={1}
          valueTex={load === null ? "\\text{празен ход}" : `R_{\\text{т}}=${dec(load, 0)}\\,\\Omega`}
          onChange={(x) => setLoad(x === 0 ? null : x)}
        />
      </div>

      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="**Двата ватметъра показват една и съща стрелка.** Долните ленти са две огледални двойки: щом напрежението е дълго отгоре и късо отдолу, при токовете е точно обратното. Всяка двойка е нормирана към своя максимум." />
      </p>
      <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Плъзгачът за товара в най-лявото си положение означава празен ход. В идеалния модел тогава по първичната не тече нищо; истинският намагнитващ ток идва в §10." />
      </p>
    </div>
  );
}
