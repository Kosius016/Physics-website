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
import { BTN_PRI, BTN_SEC, C, DRAWING_FONT_FAMILY, PANEL_CLASS, STAGE_CLASS } from "./svg";

/**
 * Интерактивите към §4-§7: ядрото и общият поток, отношението на навивките
 * с товар и опитът с постоянен ток.
 *
 * Държат се разделени, а не като един компонент с превключвател за режим,
 * защото всяка секция иска своята фигура в своя момент: в §4 контрол за
 * товар още не значи нищо, а в §7 селекторът AC/DC е самата поанта.
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

/* ============================================================ §4 и §5 */

const PHASE_CAPTIONS = [
  "Голо ядро. Ламелите се виждат по горното рамо: те ще станат важни чак в §8.",
  "Първичната намотка създава поток, който ядрото затваря в себе си.",
  "Вторичната намотка обхваща **същия** поток. Между двете няма проводник.",
  "Всяка навивка от двете страни вижда едно и също $d\\Phi/dt$. Оттам излиза отношението.",
];

/**
 * Фазовата сцена към §4-§5: ядро → първична и поток → вторична → етикети.
 *
 * Потокът е анимиран, но има и плъзгач за фазата, за да е достъпно
 * състоянието и без движение.
 */
export function CoreFluxScene() {
  const [phase, setPhase] = useState(3);
  const [playing, setPlaying] = useState(true);
  const [manual, setManual] = useState(0);
  const { turns, setTurns } = useClock(playing && phase >= 1, 0.28);

  const tau = playing ? turns : manual;
  const flux = Math.sin(2 * Math.PI * tau);
  const dflux = Math.cos(2 * Math.PI * tau);

  const W = 560;
  const H = 300;

  return (
    <div className={PANEL_CLASS}>
      <StageScroll minWidth={520} maxWidth={620}>
        <svg viewBox={`0 0 ${W} ${H}`} className={STAGE_CLASS} aria-label="Две намотки върху общо ядро">
          <Stage w={W} h={H} title="ОБЩ МАГНИТЕН ПОТОК" />

          <Core dim={phase === 0} />
          {phase >= 1 && <FluxLoop phase={tau} opacity={phase === 1 ? 1 : 0.85} />}

          {phase >= 1 && <Winding cx={CORE.x + CORE.t / 2} n={8} color={C.warn} />}
          {phase >= 2 && <Winding cx={CORE.x + CORE.w - CORE.t / 2} n={5} color={C.ok} />}

          {/* изводи */}
          {phase >= 1 && (
            <g stroke={C.warn} strokeWidth={2.4} fill="none">
              <path d={`M ${CORE.x + CORE.t / 2 - 26} 108 H 58`} />
              <path d={`M ${CORE.x + CORE.t / 2 - 26} 200 H 58`} />
            </g>
          )}
          {phase >= 2 && (
            <g stroke={C.ok} strokeWidth={2.4} fill="none">
              <path d={`M ${CORE.x + CORE.w - CORE.t / 2 + 26} 108 H 502`} />
              <path d={`M ${CORE.x + CORE.w - CORE.t / 2 + 26} 200 H 502`} />
            </g>
          )}

          {phase >= 3 && (
            <>
              <SvgTex x={62} y={132} tex="v_1,\ N_1" color={C.warn} fontSize={14.5} width={62} />
              <SvgTex x={498} y={132} tex="v_2,\ N_2" color={C.ok} fontSize={14.5} width={62} anchor="end" />
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
          {phase >= 1 && phase < 3 && (
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
        </svg>
      </StageScroll>

      <Readouts
        cells={[
          { label: "Поток", tex: `\\Phi/\\Phi_{\\max}=${dec(flux)}`, color: C.minus },
          { label: "Скорост на промяна", tex: `d\\Phi/dt\\ \\propto\\ ${dec(dflux)}` },
          { label: "Първично", tex: `v_1\\ \\propto\\ ${dec(dflux)}`, color: C.warn },
          { label: "Вторично", tex: `v_2\\ \\propto\\ ${dec(dflux)}`, color: C.ok },
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
        <button type="button" className={BTN_PRI} onClick={() => setPhase((p) => Math.min(3, p + 1))} disabled={phase === 3}>
          Следваща стъпка
        </button>
        <span className="text-[13px] font-semibold text-muted">Фаза {phase + 1} от 4</span>
        {phase >= 1 && (
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

/* ============================================================ §5 и §6 */

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
 * Моделът тук е **идеалният** трансформатор, точно както в §6 на урока:
 * без загуби и без ток на празен ход. Реалният ток на празен ход се въвежда
 * чак в §8, за да не се смесват двата модела.
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
  const H = 320;

  /*
   * Мощността като площ: височината на правоъгълника е напрежението,
   * широчината е токът. Двата правоъгълника имат **еднаква площ** и различна
   * форма - точно това е размяната, която трансформаторът извършва.
   */
  const baseLine = 286;
  const areaPx = 4200; // пиксели², еднакви за двете страни
  const hi = Math.max(v1, v2);
  const hOf = (v: number) => Math.max(6, (v / hi) * 92);
  const wOf = (v: number) => areaPx / hOf(v);

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
          ].map((m) => (
            <g key={m.label}>
              <circle cx={m.cx} cy={104} r={38} fill="none" stroke={m.color} strokeWidth={2.4} />
              <line
                x1={m.cx}
                y1={104}
                x2={m.cx + 27 * Math.cos(Math.PI * (1 - Math.min(1, m.value / 400)))}
                y2={104 + 27 * Math.sin(-Math.PI * (1 - Math.min(1, m.value / 400)))}
                stroke={C.wire}
                strokeWidth={2.4}
              />
              <circle cx={m.cx} cy={104} r={3.4} fill={C.wire} />
              <SvgTex x={m.cx} y={152} tex={m.label} color={m.color} fontSize={14} width={26} anchor="middle" />
            </g>
          ))}
          <text
            x={496}
            y={182}
            textAnchor="middle"
            fill={C.mut}
            fontFamily={DRAWING_FONT_FAMILY}
            fontSize={11.5}
            fontWeight={600}
            letterSpacing="0.07em"
          >
            ЕДНА И СЪЩА СТРЕЛКА
          </text>

          {/* мощността като площ: еднаква площ, различна форма */}
          <line x1={40} y1={baseLine} x2={W - 40} y2={baseLine} stroke={C.faint} strokeWidth={1.4} />
          {[
            { x: 76, v: v1, tex: "V_1", texI: "I_1", color: C.warn },
            { x: 330, v: v2, tex: "V_2", texI: "I_2", color: C.ok },
          ].map((b) => (
            <g key={b.tex}>
              <rect
                x={b.x}
                y={baseLine - hOf(b.v)}
                width={Math.min(210, wOf(b.v))}
                height={hOf(b.v)}
                fill={b.color}
                opacity={0.34}
                stroke={b.color}
                strokeWidth={2}
              />
              <SvgTex
                x={b.x - 8}
                y={baseLine - hOf(b.v) / 2 - 10}
                tex={b.tex}
                color={b.color}
                fontSize={13}
                width={26}
                anchor="end"
              />
              <SvgTex
                x={b.x + Math.min(210, wOf(b.v)) / 2}
                y={baseLine + 6}
                tex={b.texI}
                color={b.color}
                fontSize={13}
                width={26}
                anchor="middle"
              />
            </g>
          ))}
          <SvgTex x={W - 54} y={196} tex="V_1I_1=V_2I_2" color={C.wire} fontSize={15} width={112} anchor="end" />
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
        <RichText text="Плъзгачът за товара в най-лявото си положение означава празен ход. В идеалния модел тогава по първичната не тече нищо; истинският намагнитващ ток идва в §8." />
      </p>
    </div>
  );
}

/* ================================================================= §7 */

/**
 * Опитът с постоянен ток.
 *
 * Три реда: положение на ключа, поток през ядрото и вторично напрежение.
 * При DC се вижда единственият импулс - в мига на включване - а после
 * първичният ток пълзи към стойност, ограничена само от съпротивлението
 * на медта.
 */
export function NoDCLab() {
  const [dc, setDc] = useState(true);
  const [t, setT] = useState(1.6);

  const W = 620;
  const H = 330;
  const box = { x: 76, y: 34, w: 470, h: 74 };
  const tMax = 4;

  const closed = (x: number) => x >= 1;
  // при DC: поток по e^{-…} нарастване; при AC: синусоида след включване
  const fluxAt = (x: number) => {
    if (!closed(x)) return 0;
    if (dc) return 1 - Math.exp(-(x - 1) * 3.2);
    return Math.sin(2 * Math.PI * 2.2 * (x - 1));
  };
  const v2At = (x: number) => {
    if (!closed(x)) return 0;
    if (dc) return 3.2 * Math.exp(-(x - 1) * 3.2);
    return Math.cos(2 * Math.PI * 2.2 * (x - 1)) * 1.05;
  };
  const i1At = (x: number) => {
    if (!closed(x)) return 0;
    if (dc) return 1 - Math.exp(-(x - 1) * 3.2);
    return Math.sin(2 * Math.PI * 2.2 * (x - 1) - Math.PI / 2) * 0.28 + 0.28;
  };

  const rows = [
    { y: box.y, label: "\\text{ключ}", color: C.mut, fn: (x: number) => (closed(x) ? 1 : 0), max: 1.25 },
    { y: box.y + 96, label: "\\Phi", color: C.minus, fn: fluxAt, max: 1.35 },
    { y: box.y + 192, label: "v_2", color: C.ok, fn: v2At, max: 3.4 },
  ];

  return (
    <div className={PANEL_CLASS}>
      <StageScroll minWidth={580}>
        <svg viewBox={`0 0 ${W} ${H}`} className={STAGE_CLASS} aria-label="Трансформатор при постоянен и при променлив ток">
          <Stage w={W} h={H} title={dc ? "ПОСТОЯНЕН ТОК" : "ПРОМЕНЛИВ ТОК"} />

          {rows.map((row) => {
            const s = scaler({ ...box, y: row.y }, tMax, row.max, row.label === "\\text{ключ}" ? -0.2 : -row.max);
            return (
              <g key={row.label}>
                <line x1={box.x} y1={s.y0} x2={box.x + box.w + 14} y2={s.y0} stroke={C.mut} strokeWidth={1.4} />
                <line
                  x1={s.sx(1)}
                  y1={row.y - 4}
                  x2={s.sx(1)}
                  y2={row.y + box.h}
                  stroke={C.warn}
                  strokeWidth={1.6}
                  strokeDasharray="4 4"
                />
                <path d={s.path(row.fn, 400)} fill="none" stroke={row.color} strokeWidth={2.6} />
                <SvgTex
                  x={box.x - 10}
                  y={row.y + 18}
                  tex={row.label}
                  color={row.color}
                  fontSize={13.5}
                  width={54}
                  anchor="end"
                />
                <circle cx={s.sx(t)} cy={s.sy(row.fn(t))} r={4.6} fill={row.color} />
              </g>
            );
          })}

          <SvgTex x={box.x + box.w + 18} y={box.y + 210} tex="t" color={C.mut} fontSize={13} width={16} />
          <text
            x={96}
            y={318}
            fill={C.mut}
            fontFamily={DRAWING_FONT_FAMILY}
            fontSize={12}
          >
            {dc
              ? "ЕДН има само в мига на включване; после потокът застива."
              : "Потокът никога не застива, затова вторичната не млъква."}
          </text>
        </svg>
      </StageScroll>

      <Readouts
        cells={[
          { label: "Режим", tex: dc ? "\\text{DC}" : "\\text{AC}", color: dc ? C.plus : C.ok },
          { label: "Поток", tex: `\\Phi/\\Phi_{\\max}=${dec(fluxAt(t))}`, color: C.minus },
          { label: "Вторично напрежение", tex: `v_2\\ \\propto\\ ${dec(v2At(t))}`, color: C.ok },
          {
            label: "Първичен ток",
            tex: dc && t > 1.9 ? "\\text{ограничен само от }R_{\\text{нам}}" : `i_1\\ \\propto\\ ${dec(i1At(t))}`,
            color: dc && t > 1.9 ? C.plus : C.warn,
          },
        ]}
        cols={4}
      />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Toggle on={dc} onChange={() => setDc(true)}>
          Постоянно напрежение
        </Toggle>
        <Toggle on={!dc} onChange={() => setDc(false)}>
          Променливо напрежение
        </Toggle>
      </div>

      <div className="mt-4">
        <RangeControl
          label="Момент от опита"
          value={t}
          min={0}
          max={tMax}
          step={0.01}
          valueTex={`t/t_0=${dec(t)}`}
          onChange={setT}
          accent="accent-warn"
        />
      </div>

      <p aria-live="polite" className="mt-3 text-[13.5px] leading-relaxed text-ink/90">
        <RichText
          text={
            dc
              ? "Жълтата пунктирана линия е моментът на включване. Само там потокът се мени, само там вторичната дава напрежение. След това $d\\Phi/dt\\to0$, а първичният ток расте, докато го спре единствено съпротивлението на намотката."
              : "Тук потокът се мени непрекъснато, затова и вторичното напрежение не изчезва. Реактансът $X_L$ държи първичния ток малък."
          }
        />
      </p>
    </div>
  );
}
