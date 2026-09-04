"use client";

import { useRef, useState } from "react";
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
import {
  Arrow,
  BTN_PRI,
  BTN_SEC,
  C,
  DRAWING_FONT_FAMILY,
  PANEL_CLASS,
  STAGE_CLASS,
  svgPoint,
} from "./svg";

/**
 * Интерактивите към урок 1.3 „Движение на материална точка в една равнина“.
 *
 * Общата линия на урока: всяко твърдение за движение е твърдение спрямо
 * избрана отправна система. Затова сцените показват един и същ обект два
 * пъти - веднъж спрямо едно тяло за отчитане и веднъж спрямо друго - а
 * числата остават в readout лентата под сцената.
 *
 * Споделеният инструментариум (Stage, Readouts, RangeControl, Toggle,
 * useClock, scaler) идва от ./acPlot, за да няма втора реализация на оси,
 * мащаби и часовник.
 */

const q = (v: number) => Math.round(v * 100) / 100;

/** Дължина в най-подходящата единица, готова за $…$ в RichText. */
function lenTex(m: number): string {
  const fmt = (v: number, u: string) => `${dec(v, v < 10 ? 2 : v < 100 ? 1 : 0)}\\,\\mathrm{${u}}`;
  if (m < 1) return fmt(m * 100, "cm");
  if (m < 1000) return fmt(m, "m");
  const km = m / 1000;
  if (km < 1e5) return fmt(km, "km");
  const e = Math.floor(Math.log10(km));
  return `${dec(km / 10 ** e, 1)}\\cdot10^{${e}}\\,\\mathrm{km}`;
}

/** Безразмерно отношение в удобен за четене вид. */
function ratioTex(v: number): string {
  if (v >= 0.1) return dec(v, 2);
  const e = Math.floor(Math.log10(v));
  return `${dec(v / 10 ** e, 1)}\\cdot10^{${e}}`;
}

/* ================================================== §2 · материална точка */

interface BodyKind {
  key: string;
  name: string;
  /** Характерен размер в метри. */
  L: number;
  shape: "rect" | "circle";
}

const BODIES: BodyKind[] = [
  { key: "ball", name: "Футболна топка", L: 0.22, shape: "circle" },
  { key: "train", name: "Влак", L: 200, shape: "rect" },
  { key: "earth", name: "Земята", L: 12_742_000, shape: "circle" },
];

/** Готови ситуации: тяло + разстоянието, върху което следим движението му. */
const SITUATIONS = [
  { label: "Удар по топката отблизо", body: "ball", d: 1 },
  { label: "Топка през цялото игрище", body: "ball", d: 100 },
  { label: "Маневра на влак в гарата", body: "train", d: 50 },
  { label: "Влак София - Пловдив", body: "train", d: 144_000 },
  { label: "Земята около Слънцето", body: "earth", d: 1.5e11 },
] as const;

const PM_W = 660;
const PM_H = 296;
/** Разстоянието A → B заема винаги един и същ отрязък от сцената. */
const PM_SPAN = 512;
const PM_X0 = 74;

/**
 * Кога тялото е материална точка: решава не размерът, а отношението му към
 * разстоянието, върху което следим движението.
 */
export function PointMassLab() {
  const [bodyKey, setBodyKey] = useState("train");
  /** Плъзгачът работи в log10(d/L), защото мащабите са с шест порядъка разлика. */
  const [k, setK] = useState(Math.log10(720));

  const body = BODIES.find((b) => b.key === bodyKey) ?? BODIES[1];
  const d = body.L * 10 ** k;
  const ratio = body.L / d;

  const bodyPx = Math.min(600, Math.max(2.6, PM_SPAN * ratio));
  const tiny = bodyPx < 9;
  const verdict = ratio < 0.01 ? "ok" : ratio < 0.1 ? "edge" : "no";
  const verdictWord =
    verdict === "ok" ? "МАТЕРИАЛНА ТОЧКА" : verdict === "edge" ? "ГРАНИЧЕН СЛУЧАЙ" : "ТЯЛОТО НЕ Е ТОЧКА";
  const verdictColor = verdict === "ok" ? C.ok : verdict === "edge" ? C.warn : C.plus;

  const barY = 108;
  const bodyY = 212;
  const rectH = Math.max(3, Math.min(30, bodyPx * 0.17));

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-2">
        {SITUATIONS.map((s) => (
          <button
            key={s.label}
            type="button"
            className={BTN_SEC}
            onClick={() => {
              const b = BODIES.find((x) => x.key === s.body) ?? BODIES[1];
              setBodyKey(b.key);
              setK(Math.log10(s.d / b.L));
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <StageScroll minWidth={560}>
        <svg
          viewBox={`0 0 ${PM_W} ${PM_H}`}
          className={STAGE_CLASS + " select-none"}
          role="img"
          aria-label="Сравнение между размера на тялото и разстоянието, върху което следим движението му"
        >
          <Stage w={PM_W} h={PM_H} title="РАЗМЕР НА ТЯЛОТО СПРЯМО РАЗСТОЯНИЕТО" />

          <text
            x={PM_W - 20}
            y={24}
            textAnchor="end"
            fill={verdictColor}
            fontFamily={DRAWING_FONT_FAMILY}
            fontSize={12.5}
            fontWeight={600}
            letterSpacing="0.06em"
          >
            {verdictWord}
          </text>

          {/* Разстоянието A → B */}
          <line x1={PM_X0} y1={barY - 26} x2={PM_X0} y2={barY + 26} stroke={C.mut} strokeWidth={1.6} />
          <line
            x1={PM_X0 + PM_SPAN}
            y1={barY - 26}
            x2={PM_X0 + PM_SPAN}
            y2={barY + 26}
            stroke={C.mut}
            strokeWidth={1.6}
          />
          <Arrow x1={PM_X0} y1={barY} x2={PM_X0 + PM_SPAN} y2={barY} color={C.minus} width={2.2} />
          <Arrow x1={PM_X0 + PM_SPAN} y1={barY} x2={PM_X0} y2={barY} color={C.minus} width={2.2} />
          <SvgTex x={PM_X0 + PM_SPAN / 2} y={barY - 24} tex="d" color={C.minus} width={26} anchor="middle" />
          <SvgTex x={PM_X0} y={barY + 44} tex="A" color={C.mut} width={26} anchor="middle" />
          <SvgTex x={PM_X0 + PM_SPAN} y={barY + 44} tex="B" color={C.mut} width={26} anchor="middle" />

          {/* Тялото в същия мащаб */}
          {body.shape === "rect" ? (
            <rect
              x={PM_X0}
              y={q(bodyY - rectH / 2)}
              width={q(bodyPx)}
              height={q(rectH)}
              rx={2}
              fill={verdictColor}
            />
          ) : (
            <circle cx={q(PM_X0 + bodyPx / 2)} cy={bodyY} r={q(bodyPx / 2)} fill={verdictColor} />
          )}

          {tiny && (
            <circle
              cx={q(PM_X0 + bodyPx / 2)}
              cy={bodyY}
              r={17}
              fill="none"
              stroke={verdictColor}
              strokeWidth={1.4}
              strokeDasharray="4 4"
              opacity={0.7}
            />
          )}

          {/* Мярка за размера на тялото - само когато има място за нея */}
          {bodyPx > 54 && (
            <g>
              <line x1={PM_X0} y1={bodyY + 30} x2={PM_X0} y2={bodyY + 48} stroke={C.faint} strokeWidth={1.4} />
              <line
                x1={q(PM_X0 + bodyPx)}
                y1={bodyY + 30}
                x2={q(PM_X0 + bodyPx)}
                y2={bodyY + 48}
                stroke={C.faint}
                strokeWidth={1.4}
              />
              <Arrow x1={PM_X0} y1={bodyY + 42} x2={q(PM_X0 + bodyPx)} y2={bodyY + 42} color={C.faint} width={1.6} />
              <Arrow x1={q(PM_X0 + bodyPx)} y1={bodyY + 42} x2={PM_X0} y2={bodyY + 42} color={C.faint} width={1.6} />
            </g>
          )}
          <SvgTex
            x={bodyPx > 54 ? q(PM_X0 + bodyPx / 2) : PM_X0 + 30}
            y={bodyY + (bodyPx > 54 ? 66 : 36)}
            tex="L"
            color={verdictColor}
            width={26}
            anchor={bodyPx > 54 ? "middle" : "start"}
          />
        </svg>
      </StageScroll>

      <Readouts
        cells={[
          { label: "Размер на тялото", tex: `L=${lenTex(body.L)}` },
          { label: "Разстояние", tex: `d=${lenTex(d)}`, color: "var(--color-minus)" },
          { label: "Отношение", tex: `L/d=${ratioTex(ratio)}`, color: "var(--color-warn)" },
          {
            label: "Може ли да е точка",
            tex:
              verdict === "ok"
                ? "\\text{да}"
                : verdict === "edge"
                  ? "\\text{на границата}"
                  : "\\text{не}",
            color:
              verdict === "ok"
                ? "var(--color-ok)"
                : verdict === "edge"
                  ? "var(--color-warn)"
                  : "var(--color-plus)",
          },
        ]}
      />

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <span className="mb-1.5 block text-[13px] font-semibold text-ink">Тяло</span>
          <div className="flex flex-wrap gap-2">
            {BODIES.map((b) => (
              <Toggle key={b.key} on={b.key === bodyKey} onChange={() => setBodyKey(b.key)}>
                {b.name}
              </Toggle>
            ))}
          </div>
        </div>
        <RangeControl
          label="Разстояние на движението"
          value={k}
          min={-0.4}
          max={5.4}
          step={0.02}
          valueTex={`d=${lenTex(d)}`}
          onChange={setK}
        />
      </div>

      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Тялото не се смалява - смалява се **делът** му от разстоянието. Едно и също тяло е материална точка в едната задача и не е в другата." />
      </p>
    </div>
  );
}

/* ================================================ §3 · отправна система */

const FR_W = 660;
const FR_H = 412;
/** Напречна ширина и надлъжна дължина на вагона в метри. */
const CAR_W = 3.2;
const CAR_L = 9;
/** Топката тръгва от този надлъжен маркер във вагона. */
const BALL_ALONG = 4.5;

const FR_TOP_LABEL = 50;
const FR_TOP_GROUND = 64;
const FR_TOP_CAR = 80;
const FR_DIVIDER = 222;
const FR_BOT_LABEL = 244;
const FR_BOT_GROUND = 258;
const FR_BOT_CAR = 274;

/** Вагонът в изглед отгоре: контур и надлъжни маркери. */
function Carriage({ x, y, ppm }: { x: number; y: number; ppm: number }) {
  const w = CAR_L * ppm;
  const h = CAR_W * ppm;
  return (
    <g>
      <rect
        x={q(x)}
        y={y}
        width={q(w)}
        height={q(h)}
        rx={Math.min(7, h / 5)}
        fill={C.mut}
        fillOpacity={0.12}
        stroke={C.wire}
        strokeWidth={2.2}
      />
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1={q(x + w * f)}
          y1={y + 4}
          x2={q(x + w * f)}
          y2={q(y + h - 4)}
          stroke={C.faint}
          strokeWidth={1}
        />
      ))}
    </g>
  );
}

/**
 * Една и съща топка, две отправни системи. Изглед отгоре, за да няма нужда
 * от гравитация: топката се търкаля право надолу през вагона, а вагонът се
 * движи надлъжно. Спрямо вагона следата е отсечка напряко; спрямо перона
 * същата топка описва наклонена права.
 */
export function FrameOfReferenceLab() {
  const [u, setU] = useState(6);
  const [vRel, setVRel] = useState(2.4);
  const [playing, setPlaying] = useState(false);
  const [manual, setManual] = useState(0.55);
  const [trails, setTrails] = useState(true);

  const T = CAR_W / vRel;
  const { turns, setTurns } = useClock(playing, 0.34, 0.55);
  const tau = playing ? turns % 1 : manual;
  const t = tau * T;

  /**
   * Мащабът се нагажда към целия пробег, за да няма нито празна половина
   * сцена при неподвижен вагон, нито изтичане навън при бърз вагон. Зависи
   * само от плъзгачите, затова по време на анимацията не се мени.
   */
  const runM = u * T + CAR_L;
  const ppm = Math.max(9, Math.min(38, (FR_W - 56) / (runM + 2)));
  const startX = (FR_W - runM * ppm) / 2;
  const tickStep = ppm < 12 ? 5 : ppm < 22 ? 2 : 1;

  /** Положение спрямо земята (в метри). */
  const gx = u * t + BALL_ALONG;
  const gy = vRel * t;

  const sGround = t * Math.hypot(u, vRel);
  const sCar = vRel * t;

  const mx = (m: number) => startX + m * ppm;

  /** Изглед от вагона: неподвижен вагон в средата на панела. */
  const carFixed = (FR_W - CAR_L * ppm) / 2;
  const uArrow = Math.min(78, 18 + u * 7);

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className={BTN_PRI}
          onClick={() => {
            if (playing) setManual(turns % 1);
            setPlaying((p) => !p);
          }}
        >
          {playing ? "Пауза" : "Пуснете ▶"}
        </button>
        <button
          type="button"
          className={BTN_SEC}
          onClick={() => {
            setPlaying(false);
            setTurns(0);
            setManual(0);
          }}
        >
          Отначало
        </button>
        <Toggle on={trails} onChange={setTrails}>
          Следи
        </Toggle>
      </div>

      <StageScroll minWidth={640}>
        <svg
          viewBox={`0 0 ${FR_W} ${FR_H}`}
          className={STAGE_CLASS + " select-none"}
          role="img"
          aria-label="Изглед отгоре: топка се търкаля право надолу в движещ се вагон, гледана от перона и от вагона"
        >
          <Stage w={FR_W} h={FR_H} title="ЕДНО ДВИЖЕНИЕ · ДВЕ ОТПРАВНИ СИСТЕМИ" />

          {/* ---------------- изглед от перона ---------------- */}
          <text
            x={20}
            y={FR_TOP_LABEL}
            fill={C.mut}
            fontFamily={DRAWING_FONT_FAMILY}
            fontSize={12}
            fontWeight={600}
            letterSpacing="0.05em"
          >
            ИЗГЛЕД ОТ ПЕРОНА
          </text>
          {u > 0.05 && (
            <Arrow
              x1={FR_W - 40 - uArrow}
              y1={FR_TOP_LABEL - 4}
              x2={FR_W - 40}
              y2={FR_TOP_LABEL - 4}
              color={C.warn}
              width={2.6}
              texLabel={String.raw`\vec u`}
              texLabelDx={-uArrow / 2}
              texLabelDy={-15}
              texLabelWidth={26}
              texLabelAnchor="middle"
            />
          )}

          {/* перонът и километричните камъни */}
          <line x1={0} y1={FR_TOP_GROUND} x2={FR_W} y2={FR_TOP_GROUND} stroke={C.faint} strokeWidth={1.4} />
          {Array.from({ length: 80 }, (_, i) => i * tickStep).map((m) => {
            const x = mx(m);
            if (x < 6 || x > FR_W - 6) return null;
            return (
              <line key={m} x1={q(x)} y1={FR_TOP_GROUND} x2={q(x)} y2={FR_TOP_GROUND + 8} stroke={C.faint} strokeWidth={1.2} />
            );
          })}

          <Carriage x={mx(u * t)} y={FR_TOP_CAR} ppm={ppm} />

          {trails && (
            <line
              x1={q(mx(BALL_ALONG))}
              y1={FR_TOP_CAR}
              x2={q(mx(gx))}
              y2={q(FR_TOP_CAR + gy * ppm)}
              stroke={C.plus}
              strokeWidth={3}
              strokeLinecap="round"
              opacity={0.85}
            />
          )}
          <circle cx={q(mx(BALL_ALONG))} cy={FR_TOP_CAR} r={3.5} fill={C.faint} />
          <SvgTex
            x={q(mx(BALL_ALONG) - 10)}
            y={FR_TOP_CAR - 13}
            tex="O"
            color={C.mut}
            fontSize={12.5}
            width={20}
            anchor="middle"
          />
          <circle cx={q(mx(gx))} cy={q(FR_TOP_CAR + gy * ppm)} r={7} fill={C.ok} />

          {/* ---------------- изглед от вагона ---------------- */}
          <line x1={0} y1={FR_DIVIDER} x2={FR_W} y2={FR_DIVIDER} stroke={C.faint} strokeWidth={1} opacity={0.5} />
          <text
            x={20}
            y={FR_BOT_LABEL}
            fill={C.mut}
            fontFamily={DRAWING_FONT_FAMILY}
            fontSize={12}
            fontWeight={600}
            letterSpacing="0.05em"
          >
            ИЗГЛЕД ОТ ВАГОНА
          </text>
          {u > 0.05 && (
            <Arrow
              x1={FR_W - 40}
              y1={FR_BOT_LABEL - 4}
              x2={FR_W - 40 - uArrow}
              y2={FR_BOT_LABEL - 4}
              color={C.warn}
              width={2.6}
              texLabel={String.raw`-\vec u`}
              texLabelDx={uArrow / 2}
              texLabelDy={-15}
              texLabelWidth={32}
              texLabelAnchor="middle"
            />
          )}

          {/* сега перонът е този, който бяга назад */}
          <line x1={0} y1={FR_BOT_GROUND} x2={FR_W} y2={FR_BOT_GROUND} stroke={C.faint} strokeWidth={1.4} />
          {Array.from({ length: 120 }, (_, i) => (i - 20) * tickStep).map((m) => {
            const x = carFixed + (m - u * t) * ppm;
            if (x < 6 || x > FR_W - 6) return null;
            return (
              <line key={m} x1={q(x)} y1={FR_BOT_GROUND} x2={q(x)} y2={FR_BOT_GROUND + 8} stroke={C.faint} strokeWidth={1.2} />
            );
          })}

          <Carriage x={carFixed} y={FR_BOT_CAR} ppm={ppm} />
          {trails && (
            <line
              x1={q(carFixed + BALL_ALONG * ppm)}
              y1={FR_BOT_CAR}
              x2={q(carFixed + BALL_ALONG * ppm)}
              y2={q(FR_BOT_CAR + gy * ppm)}
              stroke={C.plus}
              strokeWidth={3}
              strokeLinecap="round"
              opacity={0.85}
            />
          )}
          <circle cx={q(carFixed + BALL_ALONG * ppm)} cy={FR_BOT_CAR} r={3.5} fill={C.faint} />
          <SvgTex
            x={q(carFixed + BALL_ALONG * ppm - 10)}
            y={FR_BOT_CAR - 13}
            tex="O'"
            color={C.mut}
            fontSize={12.5}
            width={24}
            anchor="middle"
          />
          <circle cx={q(carFixed + BALL_ALONG * ppm)} cy={q(FR_BOT_CAR + gy * ppm)} r={7} fill={C.ok} />
        </svg>
      </StageScroll>

      <Legend
        items={[
          { color: C.plus, tex: "следа на топката (траектория)" },
          { color: C.ok, tex: "топката" },
          { color: C.warn, tex: "относително движение на вагона и перона" },
        ]}
      />

      <Readouts
        cells={[
          { label: "Скорост на вагона", tex: `u=${dec(u, 1)}\\,\\mathrm{m/s}`, color: "var(--color-warn)" },
          { label: "Топката спрямо вагона", tex: `v'=${dec(vRel, 1)}\\,\\mathrm{m/s}`, color: "var(--color-minus)" },
          { label: "Следа спрямо перона", tex: `s=${dec(sGround, 2)}\\,\\mathrm{m}`, color: "var(--color-plus)" },
          { label: "Следа спрямо вагона", tex: `s'=${dec(sCar, 2)}\\,\\mathrm{m}`, color: "var(--color-plus)" },
        ]}
      />

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <RangeControl
          label="Скорост на вагона"
          value={u}
          min={0}
          max={9}
          step={0.1}
          valueTex={`u=${dec(u, 1)}\\,\\mathrm{m/s}`}
          accent="accent-warn"
          onChange={setU}
        />
        <RangeControl
          label="Топката спрямо вагона"
          value={vRel}
          min={0.8}
          max={4}
          step={0.1}
          valueTex={`v'=${dec(vRel, 1)}\\,\\mathrm{m/s}`}
          onChange={setVRel}
        />
      </div>
      {!playing && (
        <div className="mt-3">
          <RangeControl
            label="Момент от движението"
            value={manual}
            min={0}
            max={1}
            step={0.005}
            valueTex={`t=${dec(t, 2)}\\,\\mathrm{s}`}
            accent="accent-ok"
            onChange={setManual}
          />
        </div>
      )}

      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Свалете скоростта на вагона до нула: двете следи съвпадат. Върнете я - и същата топка изведнъж има две различни траектории и два различни изминати пътя. Нито едната картина не е „по-вярната“." />
      </p>
    </div>
  );
}

/* ==================================================== §4 · радиус-вектор */

const RV_W = 620;
const RV_H = 396;
const RV_O = { x: 76, y: 336 };
const RV_U = 46;
/** Второто начало на координатната система (в метри спрямо първото). */
const RV_O2 = { x: 8.4, y: 4.3 };

/** Ос с деления и числа - всичко през SvgTex, както изисква стилът на урока. */
function AxisTicks({ n, horizontal }: { n: number; horizontal: boolean }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => i + 1).map((i) => {
        const x = horizontal ? RV_O.x + i * RV_U : RV_O.x;
        const y = horizontal ? RV_O.y : RV_O.y - i * RV_U;
        return (
          <g key={i}>
            <line
              x1={horizontal ? x : x - 5}
              y1={horizontal ? y - 5 : y}
              x2={horizontal ? x : x + 5}
              y2={horizontal ? y + 5 : y}
              stroke={C.mut}
              strokeWidth={1.4}
            />
            {i % 2 === 0 && (
              <SvgTex
                x={horizontal ? x : x - 12}
                y={horizontal ? y + 19 : y}
                tex={String(i)}
                color={C.faint}
                fontSize={11.5}
                width={22}
                anchor={horizontal ? "middle" : "end"}
              />
            )}
          </g>
        );
      })}
    </g>
  );
}

/**
 * Радиус-векторът: положението на точката като вектор от избраното начало.
 * Вторият, изместен център прави видимо, че радиус-векторът зависи от избора
 * на отправна система - за разлика от преместването в §6.
 */
export function RadiusVectorLab() {
  const [p, setP] = useState({ x: 6.2, y: 4.1 });
  const [second, setSecond] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragging = useRef(false);

  const px = RV_O.x + p.x * RV_U;
  const py = RV_O.y - p.y * RV_U;
  const o2x = RV_O.x + RV_O2.x * RV_U;
  const o2y = RV_O.y - RV_O2.y * RV_U;

  const r = Math.hypot(p.x, p.y);
  const phi = (Math.atan2(p.y, p.x) * 180) / Math.PI;
  const d2 = { x: p.x - RV_O2.x, y: p.y - RV_O2.y };
  const r2 = Math.hypot(d2.x, d2.y);

  const move = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const [sx, sy] = svgPoint(svg, clientX, clientY, RV_W, RV_H);
    setP({
      x: Math.min(10.4, Math.max(0.3, (sx - RV_O.x) / RV_U)),
      y: Math.min(5.4, Math.max(0.3, (RV_O.y - sy) / RV_U)),
    });
  };

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-2">
        <Toggle on={second} onChange={setSecond}>
          Второ начало на координатната система
        </Toggle>
      </div>

      <StageScroll minWidth={560} maxWidth={760}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${RV_W} ${RV_H}`}
          className={STAGE_CLASS + " cursor-grab touch-none select-none active:cursor-grabbing"}
          role="img"
          aria-label="Радиус-вектор на точка в равнината с проекции по двете оси"
          onPointerDown={(e) => {
            dragging.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            move(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => dragging.current && move(e.clientX, e.clientY)}
          onPointerUp={() => (dragging.current = false)}
          onPointerCancel={() => (dragging.current = false)}
        >
          <Stage w={RV_W} h={RV_H} title="ПОЛОЖЕНИЕТО КАТО ВЕКТОР · ВЛАЧЕТЕ ТОЧКАТА" />

          {/* оси */}
          <line x1={RV_O.x} y1={RV_O.y} x2={RV_W - 30} y2={RV_O.y} stroke={C.mut} strokeWidth={1.8} />
          <polygon points={`${RV_W - 22},${RV_O.y} ${RV_W - 34},${RV_O.y - 5} ${RV_W - 34},${RV_O.y + 5}`} fill={C.mut} />
          <line x1={RV_O.x} y1={RV_O.y} x2={RV_O.x} y2={40} stroke={C.mut} strokeWidth={1.8} />
          <polygon points={`${RV_O.x},${32} ${RV_O.x - 5},${44} ${RV_O.x + 5},${44}`} fill={C.mut} />
          <AxisTicks n={10} horizontal />
          <AxisTicks n={6} horizontal={false} />
          <SvgTex x={RV_W - 26} y={RV_O.y + 24} tex={String.raw`x\,[\mathrm{m}]`} color={C.mut} fontSize={12.5} width={62} anchor="end" />
          <SvgTex x={RV_O.x + 12} y={40} tex={String.raw`y\,[\mathrm{m}]`} color={C.mut} fontSize={12.5} width={62} />
          <SvgTex x={RV_O.x - 14} y={RV_O.y + 20} tex="O" color={C.mut} fontSize={13} width={22} anchor="middle" />

          {/* проекции */}
          <line x1={q(px)} y1={q(py)} x2={q(px)} y2={RV_O.y} stroke={C.faint} strokeWidth={1.5} strokeDasharray="5 4" />
          <line x1={q(px)} y1={q(py)} x2={RV_O.x} y2={q(py)} stroke={C.faint} strokeWidth={1.5} strokeDasharray="5 4" />
          <line x1={RV_O.x} y1={RV_O.y} x2={q(px)} y2={RV_O.y} stroke={C.warn} strokeWidth={3} opacity={0.75} />
          <line x1={RV_O.x} y1={RV_O.y} x2={RV_O.x} y2={q(py)} stroke={C.plus} strokeWidth={3} opacity={0.75} />
          <SvgTex x={q((RV_O.x + px) / 2)} y={RV_O.y - 15} tex="x" color={C.warn} fontSize={13} width={22} anchor="middle" />
          <SvgTex x={RV_O.x + 13} y={q((RV_O.y + py) / 2)} tex="y" color={C.plus} fontSize={13} width={22} />

          {/* радиус-векторът; етикетът стои по средата, за да не се лепи за M */}
          <Arrow x1={RV_O.x} y1={RV_O.y} x2={q(px)} y2={q(py)} color={C.minus} width={3} />
          <SvgTex
            x={q((RV_O.x + px) / 2 - 10)}
            y={q((RV_O.y + py) / 2 - 14)}
            tex={String.raw`\vec r`}
            color={C.minus}
            fontSize={14}
            width={24}
            anchor="end"
          />

          {second && (
            <g className="animate-rise">
              <line x1={q(o2x)} y1={q(o2y)} x2={q(o2x + 44)} y2={q(o2y)} stroke={C.mut} strokeWidth={1.4} opacity={0.7} />
              <line x1={q(o2x)} y1={q(o2y)} x2={q(o2x)} y2={q(o2y - 44)} stroke={C.mut} strokeWidth={1.4} opacity={0.7} />
              <SvgTex x={q(o2x - 12)} y={q(o2y + 16)} tex="O'" color={C.mut} fontSize={13} width={26} anchor="middle" />
              <Arrow x1={q(o2x)} y1={q(o2y)} x2={q(px)} y2={q(py)} color={C.ok} width={2.6} />
              <SvgTex
                x={q((o2x + px) / 2 + 10)}
                y={q((o2y + py) / 2 + 12)}
                tex={String.raw`\vec r\,'`}
                color={C.ok}
                fontSize={14}
                width={28}
              />
            </g>
          )}

          <circle cx={q(px)} cy={q(py)} r={8} fill={C.wire} stroke={C.minus} strokeWidth={2.4} />
          <SvgTex x={q(px + 13)} y={q(py - 14)} tex="M" color={C.wire} fontSize={13} width={24} />
        </svg>
      </StageScroll>

      <Readouts
        cells={
          second
            ? [
                { label: "Спрямо O", tex: `\\vec r=(${dec(p.x, 1)};\\,${dec(p.y, 1)})\\,\\mathrm{m}`, color: "var(--color-minus)" },
                { label: "Модул спрямо O", tex: `r=${dec(r, 2)}\\,\\mathrm{m}`, color: "var(--color-minus)" },
                { label: "Спрямо O'", tex: `\\vec r\\,'=(${dec(d2.x, 1)};\\,${dec(d2.y, 1)})\\,\\mathrm{m}`, color: "var(--color-ok)" },
                { label: "Модул спрямо O'", tex: `r'=${dec(r2, 2)}\\,\\mathrm{m}`, color: "var(--color-ok)" },
              ]
            : [
                { label: "Абсциса", tex: `x=${dec(p.x, 2)}\\,\\mathrm{m}`, color: "var(--color-warn)" },
                { label: "Ордината", tex: `y=${dec(p.y, 2)}\\,\\mathrm{m}`, color: "var(--color-plus)" },
                { label: "Модул", tex: `r=${dec(r, 2)}\\,\\mathrm{m}`, color: "var(--color-minus)" },
                { label: "Ъгъл с оста Ox", tex: `\\varphi=${dec(phi, 1)}^\\circ`, color: "var(--color-minus)" },
              ]
        }
      />

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <RangeControl
          label="Абсциса"
          value={p.x}
          min={0.3}
          max={10.4}
          step={0.05}
          valueTex={`x=${dec(p.x, 2)}\\,\\mathrm{m}`}
          accent="accent-warn"
          onChange={(v) => setP((s) => ({ ...s, x: v }))}
        />
        <RangeControl
          label="Ордината"
          value={p.y}
          min={0.3}
          max={5.4}
          step={0.05}
          valueTex={`y=${dec(p.y, 2)}\\,\\mathrm{m}`}
          accent="accent-plus"
          onChange={(v) => setP((s) => ({ ...s, y: v }))}
        />
      </div>

      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Включете второто начало: точката не е мръднала, но радиус-векторът е друг. Радиус-векторът описва **положение спрямо избрано начало**, а не свойство на самата точка." />
      </p>
    </div>
  );
}

/* =============================== §5 · преместването не зависи от началото */

const DI_W = 620;
const DI_H = 270;

/**
 * Една и съща двойка положения в две успоредни координатни системи.
 * Радиус-векторите се сменят при преместването на началото, но стрелката
 * между положения 1 и 2 остава една и съща.
 */
export function DisplacementInvarianceDiagram() {
  const left = {
    origin: { x: 52, y: 210 },
    p1: { x: 103, y: 171 },
    p2: { x: 235, y: 88 },
  };
  const right = {
    origin: { x: 456, y: 210 },
    p1: { x: 393, y: 171 },
    p2: { x: 525, y: 88 },
  };

  return (
    <div className={PANEL_CLASS}>
      <StageScroll minWidth={540}>
        <svg
          viewBox={`0 0 ${DI_W} ${DI_H}`}
          className={STAGE_CLASS + " select-none"}
          role="img"
          aria-label="Едно и също преместване между положения 1 и 2 в две координатни системи с различни начала O и O прим"
        >
          <Stage w={DI_W} h={DI_H} title="ЕДНО ПРЕМЕСТВАНЕ · ДВЕ НАЧАЛА" />
          <line x1={310} y1={44} x2={310} y2={226} stroke={C.faint} strokeWidth={1} opacity={0.55} />

          {/* Първа координатна система. */}
          <Arrow x1={28} y1={left.origin.y} x2={286} y2={left.origin.y} color={C.faint} width={1.3} />
          <Arrow x1={left.origin.x} y1={226} x2={left.origin.x} y2={48} color={C.faint} width={1.3} />
          <SvgTex x={281} y={left.origin.y + 19} tex="x" color={C.mut} fontSize={11.5} width={18} anchor="end" />
          <SvgTex x={left.origin.x + 10} y={51} tex="y" color={C.mut} fontSize={11.5} width={18} />
          <SvgTex x={left.origin.x - 10} y={left.origin.y + 18} tex="O" color={C.mut} fontSize={12.5} width={20} anchor="middle" />

          <Arrow x1={left.origin.x} y1={left.origin.y} x2={left.p1.x} y2={left.p1.y} color={C.minus} width={1.8} />
          <Arrow x1={left.origin.x} y1={left.origin.y} x2={left.p2.x} y2={left.p2.y} color={C.minus} width={1.8} />
          <SvgTex x={78} y={181} tex={String.raw`\vec r_1`} color={C.minus} fontSize={12.5} width={30} anchor="middle" />
          <SvgTex x={140} y={143} tex={String.raw`\vec r_2`} color={C.minus} fontSize={12.5} width={30} anchor="middle" />

          <Arrow x1={left.p1.x} y1={left.p1.y} x2={left.p2.x} y2={left.p2.y} color={C.ok} width={3} />
          <SvgTex x={169} y={112} tex={String.raw`\Delta\vec r`} color={C.ok} fontSize={13} width={42} anchor="middle" />
          <circle cx={left.p1.x} cy={left.p1.y} r={5.5} fill={C.wire} stroke={C.minus} strokeWidth={1.8} />
          <circle cx={left.p2.x} cy={left.p2.y} r={5.5} fill={C.wire} stroke={C.minus} strokeWidth={1.8} />
          <SvgTex x={left.p1.x - 9} y={left.p1.y - 15} tex="1" color={C.wire} fontSize={11.5} width={16} anchor="middle" />
          <SvgTex x={left.p2.x + 10} y={left.p2.y - 12} tex="2" color={C.wire} fontSize={11.5} width={16} anchor="middle" />

          {/* Втората система има изместено начало, но същите две положения. */}
          <Arrow x1={334} y1={right.origin.y} x2={594} y2={right.origin.y} color={C.faint} width={1.3} />
          <Arrow x1={right.origin.x} y1={226} x2={right.origin.x} y2={48} color={C.faint} width={1.3} />
          <SvgTex x={589} y={right.origin.y + 19} tex="x'" color={C.mut} fontSize={11.5} width={22} anchor="end" />
          <SvgTex x={right.origin.x + 10} y={51} tex="y'" color={C.mut} fontSize={11.5} width={22} />
          <SvgTex x={right.origin.x - 11} y={right.origin.y + 18} tex="O'" color={C.mut} fontSize={12.5} width={24} anchor="middle" />

          <Arrow x1={right.origin.x} y1={right.origin.y} x2={right.p1.x} y2={right.p1.y} color={C.minus} width={1.8} />
          <Arrow x1={right.origin.x} y1={right.origin.y} x2={right.p2.x} y2={right.p2.y} color={C.minus} width={1.8} />
          <SvgTex x={425} y={181} tex={String.raw`\vec r_1\,'`} color={C.minus} fontSize={12.5} width={34} anchor="middle" />
          <SvgTex x={497} y={142} tex={String.raw`\vec r_2\,'`} color={C.minus} fontSize={12.5} width={34} anchor="middle" />

          <Arrow x1={right.p1.x} y1={right.p1.y} x2={right.p2.x} y2={right.p2.y} color={C.ok} width={3} />
          <SvgTex x={459} y={112} tex={String.raw`\Delta\vec r`} color={C.ok} fontSize={13} width={42} anchor="middle" />
          <circle cx={right.p1.x} cy={right.p1.y} r={5.5} fill={C.wire} stroke={C.minus} strokeWidth={1.8} />
          <circle cx={right.p2.x} cy={right.p2.y} r={5.5} fill={C.wire} stroke={C.minus} strokeWidth={1.8} />
          <SvgTex x={right.p1.x - 9} y={right.p1.y - 15} tex="1" color={C.wire} fontSize={11.5} width={16} anchor="middle" />
          <SvgTex x={right.p2.x + 10} y={right.p2.y - 12} tex="2" color={C.wire} fontSize={11.5} width={16} anchor="middle" />

          <SvgTex
            x={DI_W / 2}
            y={251}
            tex={String.raw`\vec r_2-\vec r_1=\vec r_2\,'-\vec r_1\,'=\Delta\vec r`}
            color={C.ok}
            fontSize={13}
            width={330}
            anchor="middle"
          />
        </svg>
      </StageScroll>
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Сините радиус-вектори зависят от избраното начало. Зелената стрелка свързва същите две положения и не се променя." />
      </p>
    </div>
  );
}

/* ============================================ §5-§6 · път и преместване */

const PD_W = 680;
const PD_H = 404;
const PD_O = { x: 52, y: 360 };
const PD_U = 40;
const PD_XM = 15;
const PD_YM = 8;

interface Route {
  key: string;
  name: string;
  /** Параметризация τ ∈ [0,1] → точка в метри. */
  at: (tau: number) => { x: number; y: number };
  closed?: boolean;
}

const ROUTES: Route[] = [
  {
    key: "line",
    name: "Права",
    at: (t) => ({ x: 1.6 + 11.8 * t, y: 1.6 + 5 * t }),
  },
  {
    key: "arc",
    name: "Дъга",
    at: (t) => {
      const a = Math.PI * (1 - t);
      return { x: 7.5 + 5 * Math.cos(a), y: 1.8 + 5 * Math.sin(a) };
    },
  },
  {
    key: "zigzag",
    name: "Зигзаг",
    at: (t) => {
      const pts = [
        { x: 1.6, y: 1.6 },
        { x: 4.6, y: 6.6 },
        { x: 7.6, y: 1.6 },
        { x: 10.6, y: 6.6 },
        { x: 13.4, y: 3.4 },
      ];
      const seg = Math.min(pts.length - 2, Math.floor(t * (pts.length - 1)));
      const local = t * (pts.length - 1) - seg;
      return {
        x: pts[seg].x + (pts[seg + 1].x - pts[seg].x) * local,
        y: pts[seg].y + (pts[seg + 1].y - pts[seg].y) * local,
      };
    },
  },
  {
    key: "loop",
    name: "Затворена обиколка",
    closed: true,
    at: (t) => {
      const a = -Math.PI / 2 + 2 * Math.PI * t;
      return { x: 7.5 + 2.6 * Math.cos(a), y: 4.2 + 2.6 * Math.sin(a) };
    },
  },
];

const PD_SAMPLES = 400;

/** Кумулативна дължина по маршрута - за да е числото път, а не оценка. */
function cumulative(route: Route): number[] {
  const out = [0];
  let prev = route.at(0);
  for (let i = 1; i <= PD_SAMPLES; i += 1) {
    const p = route.at(i / PD_SAMPLES);
    out.push(out[i - 1] + Math.hypot(p.x - prev.x, p.y - prev.y));
    prev = p;
  }
  return out;
}

const PD_LENGTHS: Record<string, number[]> = Object.fromEntries(
  ROUTES.map((r) => [r.key, cumulative(r)]),
);

/**
 * Изминат път срещу преместване. Затвореният маршрут е ключовият случай:
 * пътят расте до края, а преместването се връща на нула.
 */
export function PathDisplacementLab() {
  const [routeKey, setRouteKey] = useState("arc");
  const [playing, setPlaying] = useState(false);
  const [manual, setManual] = useState(0.62);

  const route = ROUTES.find((r) => r.key === routeKey) ?? ROUTES[1];
  const { turns, setTurns } = useClock(playing, 0.3, 0.62);
  const tau = playing ? turns % 1 : manual;

  const start = route.at(0);
  const now = route.at(tau);
  const cum = PD_LENGTHS[route.key];
  const idx = tau * PD_SAMPLES;
  const i0 = Math.min(PD_SAMPLES - 1, Math.floor(idx));
  const s = cum[i0] + (cum[i0 + 1] - cum[i0]) * (idx - i0);
  const disp = Math.hypot(now.x - start.x, now.y - start.y);

  const sx = (m: number) => PD_O.x + m * PD_U;
  const sy = (m: number) => PD_O.y - m * PD_U;
  const pathD = (from: number, to: number, n = 160) =>
    Array.from({ length: n + 1 }, (_, i) => {
      const p = route.at(from + ((to - from) * i) / n);
      return `${i === 0 ? "M" : "L"} ${q(sx(p.x))} ${q(sy(p.y))}`;
    }).join(" ");

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {ROUTES.map((r) => (
          <Toggle
            key={r.key}
            on={r.key === routeKey}
            onChange={() => {
              setRouteKey(r.key);
              setTurns(0);
              setManual(r.closed ? 1 : 0.62);
              setPlaying(false);
            }}
          >
            {r.name}
          </Toggle>
        ))}
      </div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className={BTN_PRI}
          onClick={() => {
            if (playing) setManual(turns % 1);
            setPlaying((p) => !p);
          }}
        >
          {playing ? "Пауза" : "Пуснете ▶"}
        </button>
        <button
          type="button"
          className={BTN_SEC}
          onClick={() => {
            setPlaying(false);
            setTurns(0);
            setManual(0);
          }}
        >
          Отначало
        </button>
      </div>

      <StageScroll minWidth={640}>
        <svg
          viewBox={`0 0 ${PD_W} ${PD_H}`}
          className={STAGE_CLASS + " select-none"}
          role="img"
          aria-label="Точка се движи по избран маршрут: изминатият път се удебелява, а преместването е права стрелка от началото до текущото положение"
        >
          <Stage w={PD_W} h={PD_H} title="ИЗМИНАТ ПЪТ И ПРЕМЕСТВАНЕ" />

          {/* метрична мрежа */}
          {Array.from({ length: PD_XM + 1 }, (_, i) => (
            <line key={`gx${i}`} x1={q(sx(i))} y1={q(sy(PD_YM))} x2={q(sx(i))} y2={PD_O.y} stroke={C.faint} strokeWidth={0.8} opacity={0.35} />
          ))}
          {Array.from({ length: PD_YM + 1 }, (_, i) => (
            <line key={`gy${i}`} x1={PD_O.x} y1={q(sy(i))} x2={q(sx(PD_XM))} y2={q(sy(i))} stroke={C.faint} strokeWidth={0.8} opacity={0.35} />
          ))}
          <line x1={PD_O.x} y1={PD_O.y} x2={q(sx(PD_XM))} y2={PD_O.y} stroke={C.mut} strokeWidth={1.6} />
          <line x1={PD_O.x} y1={PD_O.y} x2={PD_O.x} y2={q(sy(PD_YM))} stroke={C.mut} strokeWidth={1.6} />
          <SvgTex x={q(sx(PD_XM))} y={PD_O.y + 22} tex={String.raw`x\,[\mathrm{m}]`} color={C.mut} fontSize={12} width={60} anchor="end" />
          <SvgTex x={PD_O.x + 10} y={q(sy(PD_YM)) + 6} tex={String.raw`y\,[\mathrm{m}]`} color={C.mut} fontSize={12} width={60} />

          {/* целият маршрут, после изминатата част */}
          <path d={pathD(0, 1)} fill="none" stroke={C.faint} strokeWidth={2} strokeDasharray="6 5" />
          {tau > 0.002 && (
            <path d={pathD(0, tau)} fill="none" stroke={C.warn} strokeWidth={4.5} strokeLinecap="round" />
          )}

          {/* преместването: върхът спира преди маркера, за да се вижда */}
          {disp > 0.14 && (
            <g>
              <Arrow
                x1={q(sx(start.x))}
                y1={q(sy(start.y))}
                x2={q(sx(now.x) - ((sx(now.x) - sx(start.x)) / (PD_U * disp)) * 12)}
                y2={q(sy(now.y) - ((sy(now.y) - sy(start.y)) / (PD_U * disp)) * 12)}
                color={C.ok}
                width={3.2}
              />
              <SvgTex
                x={q((sx(start.x) + sx(now.x)) / 2 + 16)}
                y={q((sy(start.y) + sy(now.y)) / 2 + 16)}
                tex={String.raw`\Delta\vec r`}
                color={C.ok}
                fontSize={14}
                width={34}
              />
            </g>
          )}

          {/*
            Началото и краят съвпадат в два случая: преди тръгване и в края на
            затворената обиколка. Тогава двата номера се сливат в един етикет,
            вместо да се застъпват.
          */}
          <circle cx={q(sx(start.x))} cy={q(sy(start.y))} r={7} fill={C.mut} />
          {disp > 0.35 && (
            <SvgTex x={q(sx(start.x))} y={q(sy(start.y)) - 20} tex="1" color={C.mut} fontSize={12.5} width={20} anchor="middle" />
          )}
          <circle cx={q(sx(now.x))} cy={q(sy(now.y))} r={8.5} fill={C.ok} />
          <SvgTex
            x={q(sx(now.x))}
            y={q(sy(now.y)) - 22}
            tex={disp > 0.35 ? "2" : "1{=}2"}
            color={C.ok}
            fontSize={12.5}
            width={disp > 0.35 ? 20 : 40}
            anchor="middle"
          />
        </svg>
      </StageScroll>

      <Legend
        items={[
          { color: C.warn, tex: "изминат път $s$ (по траекторията)" },
          { color: C.ok, tex: "преместване $\\Delta\\vec r$ (по правата)" },
        ]}
      />

      <Readouts
        cells={[
          { label: "Изминат път", tex: `s=${dec(s, 2)}\\,\\mathrm{m}`, color: "var(--color-warn)" },
          { label: "Преместване", tex: `|\\Delta\\vec r|=${dec(disp, 2)}\\,\\mathrm{m}`, color: "var(--color-ok)" },
          {
            label: "Отношение",
            tex: disp < 0.05 ? "s/|\\Delta\\vec r|\\to\\infty" : `s/|\\Delta\\vec r|=${dec(s / disp, 2)}`,
            color: "var(--color-minus)",
          },
          { label: "Изминат дял", tex: `${dec(tau * 100, 0)}\\,\\%`, color: "var(--color-ink)" },
        ]}
      />

      {!playing && (
        <div className="mt-4">
          <RangeControl
            label="Докъде е стигнало тялото"
            value={manual}
            min={0}
            max={1}
            step={0.002}
            valueTex={`s=${dec(s, 2)}\\,\\mathrm{m}`}
            accent="accent-warn"
            onChange={setManual}
          />
        </div>
      )}

      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Изберете „Затворена обиколка“ и стигнете до края: пътят е цялата обиколка, а преместването е нула. Двете величини отговарят на различни въпроси - **колко е изминало** тялото и **накъде се е оказало**." />
      </p>
    </div>
  );
}

/* ================================== §7 · движението в равнина = x(t) и y(t) */

const CM_W = 700;
const CM_H = 384;
const CM_O = { x: 54, y: 332 };
const CM_U = 38;
const CM_M = 7;
const CM_T = 4;

interface PlaneMotion {
  key: string;
  name: string;
  at: (t: number) => { x: number; y: number };
}

const MOTIONS: PlaneMotion[] = [
  {
    key: "line",
    name: "Права под ъгъл",
    at: (t) => ({ x: 0.7 + 1.5 * t, y: 0.6 + 1.5 * t }),
  },
  {
    key: "circle",
    name: "Окръжност",
    at: (t) => {
      const a = -Math.PI / 2 + (2 * Math.PI * t) / CM_T;
      return { x: 3.6 + 2.6 * Math.cos(a), y: 3.6 + 2.6 * Math.sin(a) };
    },
  },
  {
    key: "wave",
    name: "Криволинейна",
    at: (t) => ({ x: 0.6 + 1.6 * t, y: 3.6 + 2.6 * Math.sin((2 * Math.PI * t) / CM_T) }),
  },
];

const CM_XBOX = { x: 396, y: 58, w: 246, h: 92 };
const CM_YBOX = { x: 396, y: 222, w: 246, h: 92 };

/** Деления и числа по осите на едната графика. */
function PlotTicks({ s, color }: { s: ReturnType<typeof scaler>; color: string }) {
  return (
    <g>
      {[1, 2, 3, 4].map((tt) => (
        <g key={`t${tt}`}>
          <line x1={q(s.sx(tt))} y1={q(s.y0)} x2={q(s.sx(tt))} y2={q(s.y0 + 4)} stroke={C.mut} strokeWidth={1.2} />
          <SvgTex x={q(s.sx(tt))} y={q(s.y0 + 16)} tex={String(tt)} color={C.faint} fontSize={11} width={18} anchor="middle" />
        </g>
      ))}
      {[3, 6].map((v) => (
        <g key={`v${v}`}>
          <line x1={s.box.x - 4} y1={q(s.sy(v))} x2={s.box.x + 4} y2={q(s.sy(v))} stroke={C.mut} strokeWidth={1.2} />
          <SvgTex x={s.box.x - 9} y={q(s.sy(v))} tex={String(v)} color={color} fontSize={11} width={18} anchor="end" />
        </g>
      ))}
    </g>
  );
}

/**
 * Разлагането на равнинното движение: точката в равнината и двете графики
 * x(t) и y(t) се движат едновременно. Движението в равнина е две
 * едновременни едномерни движения.
 */
export function CoordinateMotionLab() {
  const [motionKey, setMotionKey] = useState("wave");
  const [playing, setPlaying] = useState(false);
  const [manual, setManual] = useState(1.15);

  const motion = MOTIONS.find((m) => m.key === motionKey) ?? MOTIONS[2];
  const { turns, setTurns } = useClock(playing, 0.26, 1.15 / CM_T);
  const t = playing ? (turns % 1) * CM_T : manual;
  const p = motion.at(t);

  const sx = (m: number) => CM_O.x + m * CM_U;
  const sy = (m: number) => CM_O.y - m * CM_U;
  const trace = (to: number, n = 150) =>
    Array.from({ length: n + 1 }, (_, i) => {
      const pt = motion.at((to * i) / n);
      return `${i === 0 ? "M" : "L"} ${q(sx(pt.x))} ${q(sy(pt.y))}`;
    }).join(" ");

  const xS = scaler(CM_XBOX, CM_T, CM_M, 0);
  const yS = scaler(CM_YBOX, CM_T, CM_M, 0);

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {MOTIONS.map((m) => (
          <Toggle
            key={m.key}
            on={m.key === motionKey}
            onChange={() => {
              setMotionKey(m.key);
              setTurns(0);
              setManual(1.15);
              setPlaying(false);
            }}
          >
            {m.name}
          </Toggle>
        ))}
        <button
          type="button"
          className={BTN_PRI}
          onClick={() => {
            if (playing) setManual((turns % 1) * CM_T);
            setPlaying((v) => !v);
          }}
        >
          {playing ? "Пауза" : "Пуснете ▶"}
        </button>
      </div>

      <StageScroll minWidth={660}>
        <svg
          viewBox={`0 0 ${CM_W} ${CM_H}`}
          className={STAGE_CLASS + " select-none"}
          role="img"
          aria-label="Движение в равнината и едновременните графики на двете координати като функции на времето"
        >
          <Stage w={CM_W} h={CM_H} title="ЕДНО ДВИЖЕНИЕ В РАВНИНАТА · ДВЕ КООРДИНАТИ ВЪВ ВРЕМЕТО" />

          {/* --- равнината --- */}
          {Array.from({ length: CM_M + 1 }, (_, i) => (
            <g key={i}>
              <line x1={q(sx(i))} y1={q(sy(CM_M))} x2={q(sx(i))} y2={CM_O.y} stroke={C.faint} strokeWidth={0.8} opacity={0.32} />
              <line x1={CM_O.x} y1={q(sy(i))} x2={q(sx(CM_M))} y2={q(sy(i))} stroke={C.faint} strokeWidth={0.8} opacity={0.32} />
            </g>
          ))}
          <line x1={CM_O.x} y1={CM_O.y} x2={q(sx(CM_M))} y2={CM_O.y} stroke={C.mut} strokeWidth={1.6} />
          <line x1={CM_O.x} y1={CM_O.y} x2={CM_O.x} y2={q(sy(CM_M))} stroke={C.mut} strokeWidth={1.6} />
          <SvgTex x={q(sx(CM_M))} y={CM_O.y + 24} tex={String.raw`x\,[\mathrm{m}]`} color={C.mut} fontSize={12} width={60} anchor="end" />
          <SvgTex x={CM_O.x + 10} y={q(sy(CM_M)) - 4} tex={String.raw`y\,[\mathrm{m}]`} color={C.mut} fontSize={12} width={60} />
          {[2, 4].map((n) => (
            <g key={`px${n}`}>
              <SvgTex x={q(sx(n))} y={CM_O.y + 17} tex={String(n)} color={C.faint} fontSize={11} width={18} anchor="middle" />
              <SvgTex x={CM_O.x - 9} y={q(sy(n))} tex={String(n)} color={C.faint} fontSize={11} width={18} anchor="end" />
            </g>
          ))}

          <path d={trace(CM_T)} fill="none" stroke={C.faint} strokeWidth={2} strokeDasharray="6 5" />
          {t > 0.02 && <path d={trace(t)} fill="none" stroke={C.wire} strokeWidth={3} strokeLinecap="round" opacity={0.85} />}

          {/* проекциите по двете оси */}
          <line x1={q(sx(p.x))} y1={q(sy(p.y))} x2={q(sx(p.x))} y2={CM_O.y} stroke={C.warn} strokeWidth={1.6} strokeDasharray="5 4" />
          <line x1={q(sx(p.x))} y1={q(sy(p.y))} x2={CM_O.x} y2={q(sy(p.y))} stroke={C.plus} strokeWidth={1.6} strokeDasharray="5 4" />
          <circle cx={q(sx(p.x))} cy={CM_O.y} r={5} fill={C.warn} />
          <circle cx={CM_O.x} cy={q(sy(p.y))} r={5} fill={C.plus} />
          <circle cx={q(sx(p.x))} cy={q(sy(p.y))} r={8} fill={C.ok} />

          {/* --- графиките --- */}
          <PlotFrame s={xS} xLabel={String.raw`t\,[\mathrm{s}]`} yLabel={String.raw`x\,[\mathrm{m}]`} yLabelColor={C.warn} quarterTicks={false} />
          <PlotTicks s={xS} color={C.warn} />
          <path d={xS.path((tt) => motion.at(tt).x, 180)} fill="none" stroke={C.faint} strokeWidth={1.8} strokeDasharray="5 4" />
          <path d={xS.path((tt) => motion.at(tt).x, 140, 0, Math.max(0.001, t))} fill="none" stroke={C.warn} strokeWidth={3} />
          <line x1={q(xS.sx(t))} y1={CM_XBOX.y} x2={q(xS.sx(t))} y2={CM_XBOX.y + CM_XBOX.h} stroke={C.faint} strokeWidth={1.2} strokeDasharray="4 4" />
          <circle cx={q(xS.sx(t))} cy={q(xS.sy(p.x))} r={6} fill={C.warn} />

          <PlotFrame s={yS} xLabel={String.raw`t\,[\mathrm{s}]`} yLabel={String.raw`y\,[\mathrm{m}]`} yLabelColor={C.plus} quarterTicks={false} />
          <PlotTicks s={yS} color={C.plus} />
          <path d={yS.path((tt) => motion.at(tt).y, 180)} fill="none" stroke={C.faint} strokeWidth={1.8} strokeDasharray="5 4" />
          <path d={yS.path((tt) => motion.at(tt).y, 140, 0, Math.max(0.001, t))} fill="none" stroke={C.plus} strokeWidth={3} />
          <line x1={q(yS.sx(t))} y1={CM_YBOX.y} x2={q(yS.sx(t))} y2={CM_YBOX.y + CM_YBOX.h} stroke={C.faint} strokeWidth={1.2} strokeDasharray="4 4" />
          <circle cx={q(yS.sx(t))} cy={q(yS.sy(p.y))} r={6} fill={C.plus} />
        </svg>
      </StageScroll>

      <Readouts
        cells={[
          { label: "Време", tex: `t=${dec(t, 2)}\\,\\mathrm{s}` },
          { label: "Абсциса", tex: `x=${dec(p.x, 2)}\\,\\mathrm{m}`, color: "var(--color-warn)" },
          { label: "Ордината", tex: `y=${dec(p.y, 2)}\\,\\mathrm{m}`, color: "var(--color-plus)" },
          { label: "Модул на радиус-вектора", tex: `r=${dec(Math.hypot(p.x, p.y), 2)}\\,\\mathrm{m}`, color: "var(--color-minus)" },
        ]}
      />

      {!playing && (
        <div className="mt-4">
          <RangeControl
            label="Момент от движението"
            value={manual}
            min={0}
            max={CM_T}
            step={0.01}
            valueTex={`t=${dec(manual, 2)}\\,\\mathrm{s}`}
            accent="accent-ok"
            onChange={setManual}
          />
        </div>
      )}

      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Кривата вляво не е зададена като крива. Тя е резултат от двете графики вдясно: **едно движение по Ox и едно по Oy, които текат едновременно**." />
      </p>
    </div>
  );
}
