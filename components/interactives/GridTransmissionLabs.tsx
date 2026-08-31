"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import {
  Legend,
  RangeControl,
  Readouts,
  SourceSymbol,
  Stage,
  StageScroll,
  dec,
  type Cell,
} from "./acPlot";
import { BTN_SEC, C, DRAWING_FONT_FAMILY, PANEL_CLASS, STAGE_CLASS } from "./svg";

/**
 * Интерактиви към §2, §3 и §10 на урока за трансформатора и преноса.
 *
 * Общият модел е **еднофазен еквивалент с два проводника**: това е обявено
 * и в текста на урока, защото реалната мрежа е трифазна. Целта на опростения
 * модел е да изолира ролята на $I^2R$, а не да описва точно далекопровод.
 *
 * Числата в сцените не влизат в SVG-то: вътре стоят само символни етикети
 * през SvgTex, а стойностите живеят в readout лентата под сцената.
 */

/** Специфично съпротивление на алуминий при стайна температура, Ω·m. */
const RHO_AL = 2.65e-8;

/* ------------------------------------------------------------ формати */

/** Мощност в W, kW или MW, готова за $…$. */
function watts(value: number): string {
  if (Math.abs(value) >= 1e6) return `${dec(value / 1e6, 2)}\\,\\mathrm{MW}`;
  if (Math.abs(value) >= 1e3) return `${dec(value / 1e3, 1)}\\,\\mathrm{kW}`;
  return `${dec(value, 1)}\\,\\mathrm W`;
}

/** Напрежение в V или kV, готово за $…$. */
function volts(value: number): string {
  if (Math.abs(value) >= 1e3) return `${dec(value / 1e3, 1)}\\,\\mathrm{kV}`;
  return `${dec(value, 0)}\\,\\mathrm V`;
}

/* ----------------------------------------------------- моделът на линията */

interface LineInputs {
  /** Напрежение **при товара**, kV. */
  kv: number;
  /** Доставена мощност, MW. */
  mw: number;
  /** Дължина на линията, km. */
  km: number;
  /** Сечение на един проводник, mm². */
  mm2: number;
}

interface LineResult {
  r: number;
  i: number;
  loss: number;
  drop: number;
  send: number;
  input: number;
  eta: number;
  /** Дял на загубата от подадената мощност: 0…1. */
  frac: number;
}

/**
 * Решава линията при зададено напрежение **при товара**.
 *
 * Съзнателно не фиксираме напрежението на източника: тогава токът не е
 * $I=P/V$ и трябва да се решава делител. Границата на предаваната мощност
 * при фиксиран източник е изведена отделно в текста на урока.
 */
function solveLine({ kv, mw, km, mm2 }: LineInputs): LineResult {
  const r = (2 * RHO_AL * km * 1e3) / (mm2 * 1e-6);
  const i = (mw * 1e6) / (kv * 1e3);
  const loss = i * i * r;
  const drop = i * r;
  const input = mw * 1e6 + loss;
  return {
    r,
    i,
    loss,
    drop,
    send: kv * 1e3 + drop,
    input,
    eta: (mw * 1e6) / input,
    frac: loss / input,
  };
}

/* ============================================================ §2, §3 */

const V_PRESETS = [
  { kv: 20, label: "20 kV" },
  { kv: 220, label: "220 kV" },
  { kv: 400, label: "400 kV" },
] as const;

/**
 * Лабораторията за далекопровода.
 *
 * Долната лента е енергийна: широчината ѝ е **делът**, не абсолютната
 * мощност, затова картината остава четима и при 0,4 %, и при 62 % загуба.
 * Абсолютните стойности стоят в readout лентата.
 */
export function TransmissionLossLab() {
  const [logKv, setLogKv] = useState(Math.log10(20));
  const [mw, setMw] = useState(20);
  const [km, setKm] = useState(150);
  const [mm2, setMm2] = useState(240);

  const kv = 10 ** logKv;
  const v = solveLine({ kv, mw, km, mm2 });

  const W = 660;
  const H = 330;

  // ред A: физическата картина
  const lineLeft = 96;
  const lineRight = 564;
  const topWire = 76;
  const botWire = 116;

  // ред B: енергийната лента
  const bandTop = 196;
  const bandH = 76;
  const bandLeft = 110;
  const bandRight = 556;
  const bandBottom = bandTop + bandH;
  // хайрлайн, за да остане видима и нищожната загуба
  const lossH = Math.max(1.2, v.frac * bandH);
  const split = bandBottom - lossH;

  const glow = Math.min(1, v.frac * 1.7);
  const lossBiggerThanDelivered = v.loss > mw * 1e6;

  const cells: Cell[] = [
    { label: "Ток в линията", tex: `I=${dec(v.i, 0)}\\,\\mathrm A`, color: C.warn },
    { label: "Съпротивление", tex: `R_{\\text{лин}}=${dec(v.r, 1)}\\,\\Omega` },
    { label: "Загуба", tex: `P_{\\text{зг}}=${watts(v.loss)}`, color: C.plus },
    {
      label: "Дял от подаденото",
      tex: `${dec(v.frac * 100, 1)}\\,\\%`,
      color: v.frac > 0.05 ? C.plus : C.ok,
    },
    { label: "Спад по линията", tex: `\\Delta V_{\\text{лин}}=${volts(v.drop)}` },
    { label: "В началото", tex: `V_{\\text{нач}}=${volts(v.send)}` },
    { label: "Подадено", tex: `P_{\\text{вх}}=${watts(v.input)}` },
    { label: "КПД на преноса", tex: `\\eta=${dec(v.eta * 100, 1)}\\,\\%`, color: C.ok },
  ];

  return (
    <div className={PANEL_CLASS}>
      <StageScroll minWidth={620}>
        <svg viewBox={`0 0 ${W} ${H}`} className={STAGE_CLASS} aria-label="Далекопровод и енергиен баланс">
          <Stage w={W} h={H} title="ЕДНОФАЗЕН ЕКВИВАЛЕНТ · ДВА ПРОВОДНИКА" />

          {/* ---------------------------------------------- ред A: линията */}
          <rect x={26} y={52} width={70} height={88} rx={6} fill="none" stroke={C.warn} strokeWidth={2.2} />
          <SourceSymbol x={61} y={96} r={17} color={C.warn} />
          <text
            x={61}
            y={158}
            textAnchor="middle"
            fill={C.mut}
            fontFamily={DRAWING_FONT_FAMILY}
            fontSize={11.5}
            fontWeight={600}
            letterSpacing="0.08em"
          >
            ЦЕНТРАЛА
          </text>

          <rect x={564} y={52} width={70} height={88} rx={6} fill="none" stroke={C.ok} strokeWidth={2.2} />
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x={577 + i * 16}
              y={82 + (i % 2) * 12}
              width={11}
              height={44 - (i % 2) * 12}
              fill="none"
              stroke={C.ok}
              strokeWidth={1.6}
            />
          ))}
          <text
            x={599}
            y={158}
            textAnchor="middle"
            fill={C.mut}
            fontFamily={DRAWING_FONT_FAMILY}
            fontSize={11.5}
            fontWeight={600}
            letterSpacing="0.08em"
          >
            ГРАД
          </text>

          {/* нагряването на проводниците: прозрачност по дела на загубата */}
          {[topWire, botWire].map((y) => (
            <g key={y}>
              <line x1={lineLeft} y1={y} x2={lineRight} y2={y} stroke={C.plus} strokeWidth={7} opacity={glow * 0.55} />
              <line x1={lineLeft} y1={y} x2={lineRight} y2={y} stroke={C.wire} strokeWidth={2.4} />
            </g>
          ))}

          {/* променливият ток няма постоянна посока: двупосочна стрелка */}
          <g stroke={C.warn} strokeWidth={2} fill={C.warn}>
            <line x1={296} y1={96} x2={364} y2={96} />
            <polygon points="296,96 308,91 308,101" />
            <polygon points="364,96 352,91 352,101" />
          </g>
          <SvgTex x={330} y={80} tex="I" color={C.warn} fontSize={14} width={14} anchor="middle" />
          <SvgTex
            x={330}
            y={132}
            tex="R_{\text{лин}}"
            color={C.mut}
            fontSize={13}
            width={54}
            anchor="middle"
          />

          {/* ---------------------------------------- ред B: енергийна лента */}
          <line x1={bandLeft - 6} y1={bandTop} x2={bandLeft - 6} y2={bandBottom} stroke={C.warn} strokeWidth={3} />
          <SvgTex
            x={bandLeft - 6}
            y={bandTop - 12}
            tex="P_{\text{вх}}"
            color={C.warn}
            fontSize={13.5}
            width={46}
            anchor="middle"
          />

          {/* доставеното */}
          <path
            d={`M ${bandLeft} ${bandTop} L ${bandRight} ${bandTop} L ${bandRight} ${split} L ${bandLeft} ${split} Z`}
            fill={C.ok}
            opacity={0.82}
          />
          <SvgTex x={505} y={bandTop - 12} tex="P" color={C.ok} fontSize={13.5} width={16} anchor="middle" />

          {/* загубеното: отклонява се надолу и излиза от сцената */}
          <path
            d={`M ${bandLeft} ${split}
                L 250 ${split}
                C 300 ${split} 322 ${H - 12} 336 ${H - 2}
                L 278 ${H - 2}
                C 262 ${H - 12} 250 ${bandBottom} 205 ${bandBottom}
                L ${bandLeft} ${bandBottom} Z`}
            fill={C.plus}
            opacity={0.86}
          />
          <SvgTex
            x={352}
            y={H - 22}
            tex="P_{\text{зг}}=I^2R_{\text{лин}}"
            color={C.plus}
            fontSize={13.5}
            width={112}
          />
        </svg>
      </StageScroll>

      <Readouts cells={cells} cols={4} />

      <p aria-live="polite" className="mt-3 text-[13.5px] leading-relaxed text-muted">
        {lossBiggerThanDelivered ? (
          <RichText
            text={`При това напрежение линията разсейва **повече мощност, отколкото стига до града**: за да получи товарът $${watts(
              mw * 1e6,
            )}$, централата трябва да подаде $${watts(v.input)}$.`}
          />
        ) : (
          <RichText text="Зелената лента е доставената мощност, червената е разсеяната в проводниците. Широчините са дялове от подаденото, затова картината остава четима и при нищожна загуба." />
        )}
      </p>

      <Legend
        items={[
          { color: C.ok, tex: "$P$ до товара" },
          { color: C.plus, tex: "$P_{\\text{зг}}$ в топлина" },
          { color: C.warn, tex: "$P_{\\text{вх}}$ от централата" },
        ]}
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {V_PRESETS.map((p) => (
          <button
            key={p.kv}
            type="button"
            className={BTN_SEC}
            onClick={() => {
              setLogKv(Math.log10(p.kv));
              setMw(20);
              setKm(150);
              setMm2(240);
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <RangeControl
          label="Напрежение при товара"
          value={logKv}
          min={Math.log10(1)}
          max={Math.log10(400)}
          step={0.005}
          valueTex={`V=${dec(kv, kv < 10 ? 2 : 0)}\\,\\mathrm{kV}`}
          onChange={setLogKv}
          accent="accent-warn"
        />
        <RangeControl
          label="Доставена мощност"
          value={mw}
          min={2}
          max={50}
          step={1}
          valueTex={`P=${dec(mw, 0)}\\,\\mathrm{MW}`}
          onChange={setMw}
        />
        <RangeControl
          label="Дължина на линията"
          value={km}
          min={20}
          max={400}
          step={10}
          valueTex={`\\ell=${dec(km, 0)}\\,\\mathrm{km}`}
          onChange={setKm}
        />
        <RangeControl
          label="Сечение на проводника"
          value={mm2}
          min={60}
          max={800}
          step={20}
          valueTex={`S_{\\text{пр}}=${dec(mm2, 0)}\\,\\mathrm{mm^2}`}
          onChange={setMm2}
        />
      </div>
    </div>
  );
}

/* ================================================================= §3 */

const DECADE_LABELS: Record<number, string> = {
  4: "100\\,\\mathrm{kW}",
  5: "1\\,\\mathrm{MW}",
  6: "10\\,\\mathrm{MW}",
  7: "100\\,\\mathrm{MW}",
  8: "1\\,\\mathrm{GW}",
};

const KV_TICKS = [5, 10, 20, 50, 100, 200, 400];

/**
 * Загубата срещу напрежението в двойно логаритмичен мащаб.
 *
 * Целта е наклонът: една декада надясно сваля кривата с две декади надолу.
 * Триъгълникът го показва, вместо да се твърди в текста.
 */
export function LossVsVoltagePlot() {
  const [logKv, setLogKv] = useState(Math.log10(20));

  const mw = 20;
  const km = 150;
  const mm2 = 240;
  const r = (2 * RHO_AL * km * 1e3) / (mm2 * 1e-6);

  const W = 620;
  const H = 300;
  const box = { x: 92, y: 30, w: 468, h: 214 };

  const xMin = Math.log10(5);
  const xMax = Math.log10(500);
  const yMin = 4;
  const yMax = 9;

  const sx = (lx: number) => box.x + ((lx - xMin) / (xMax - xMin)) * box.w;
  const sy = (ly: number) => box.y + box.h - ((ly - yMin) / (yMax - yMin)) * box.h;

  const lossAt = (kv: number) => ((mw * 1e6) ** 2 * r) / (kv * 1e3) ** 2;
  const curve = Array.from({ length: 80 }, (_, i) => {
    const lx = xMin + ((xMax - xMin) * i) / 79;
    return `${i === 0 ? "M" : "L"} ${sx(lx).toFixed(1)} ${sy(Math.log10(lossAt(10 ** lx))).toFixed(1)}`;
  }).join(" ");

  const kv = 10 ** logKv;
  const loss = lossAt(kv);
  const px = sx(logKv);
  const py = sy(Math.log10(loss));

  // триъгълникът на наклона: от 20 kV една декада надясно
  const tx0 = sx(Math.log10(20));
  const ty0 = sy(Math.log10(lossAt(20)));
  const tx1 = sx(Math.log10(200));
  const ty1 = sy(Math.log10(lossAt(200)));

  return (
    <div className={PANEL_CLASS}>
      <StageScroll minWidth={580}>
        <svg viewBox={`0 0 ${W} ${H}`} className={STAGE_CLASS} aria-label="Загуба срещу напрежение">
          <Stage w={W} h={H} title="ДВОЙНО ЛОГАРИТМИЧЕН МАЩАБ" />

          {/* мрежа по декади */}
          {[4, 5, 6, 7, 8].map((d) => (
            <g key={d}>
              <line x1={box.x} y1={sy(d)} x2={box.x + box.w} y2={sy(d)} stroke={C.faint} strokeWidth={1} />
              <SvgTex
                x={box.x - 10}
                y={sy(d) - 8}
                tex={DECADE_LABELS[d]}
                color={C.mut}
                fontSize={11.5}
                width={62}
                anchor="end"
              />
            </g>
          ))}
          {KV_TICKS.map((t) => (
            <g key={t}>
              <line
                x1={sx(Math.log10(t))}
                y1={box.y}
                x2={sx(Math.log10(t))}
                y2={box.y + box.h}
                stroke={C.faint}
                strokeWidth={1}
                opacity={0.5}
              />
              <SvgTex
                x={sx(Math.log10(t))}
                y={box.y + box.h + 8}
                tex={`${t}`}
                color={C.mut}
                fontSize={11.5}
                width={26}
                anchor="middle"
              />
            </g>
          ))}
          <SvgTex
            x={box.x + box.w}
            y={box.y + box.h + 26}
            tex="V\ [\mathrm{kV}]"
            color={C.mut}
            fontSize={12.5}
            width={62}
            anchor="end"
          />

          {/* триъгълникът на наклона */}
          <g stroke={C.warn} strokeWidth={1.8} fill="none" strokeDasharray="5 4">
            <line x1={tx0} y1={ty0} x2={tx1} y2={ty0} />
            <line x1={tx1} y1={ty0} x2={tx1} y2={ty1} />
          </g>
          <SvgTex
            x={(tx0 + tx1) / 2}
            y={ty0 - 22}
            tex="\times10"
            color={C.warn}
            fontSize={13}
            width={38}
            anchor="middle"
          />
          <SvgTex x={tx1 + 10} y={(ty0 + ty1) / 2 - 9} tex="\div100" color={C.warn} fontSize={13} width={42} />

          <path d={curve} fill="none" stroke={C.plus} strokeWidth={2.8} />
          <circle cx={px} cy={py} r={6} fill={C.ok} stroke={C.wire} strokeWidth={1.6} />
        </svg>
      </StageScroll>

      <Readouts
        cells={[
          { label: "Напрежение", tex: `V=${dec(kv, kv < 10 ? 2 : 0)}\\,\\mathrm{kV}`, color: C.warn },
          { label: "Ток", tex: `I=${dec((mw * 1e6) / (kv * 1e3), 0)}\\,\\mathrm A` },
          { label: "Загуба", tex: `P_{\\text{зг}}=${watts(loss)}`, color: C.plus },
          { label: "Дял от 20 MW", tex: `${dec((loss / (mw * 1e6)) * 100, 1)}\\,\\%` },
        ]}
        cols={4}
      />

      <div className="mt-4">
        <RangeControl
          label="Напрежение при товара"
          value={logKv}
          min={xMin}
          max={xMax}
          step={0.005}
          valueTex={`V=${dec(kv, kv < 10 ? 2 : 0)}\\,\\mathrm{kV}`}
          onChange={setLogKv}
          accent="accent-warn"
        />
      </div>

      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Правата линия в двоен логаритмичен мащаб означава степенна зависимост, а наклонът е показателят. Тук той е $-2$: една декада надясно сваля загубата с две декади." />
      </p>
    </div>
  );
}

/* ================================================================ §10 */

interface Stage2 {
  cap: string;
  kv: number;
  role: string;
}

const GRID_STAGES: Stage2[] = [
  { cap: "ГЕНЕРАТОР", kv: 20, role: "Машината дава средно напрежение: изолацията в статора не позволява повече." },
  { cap: "ПРЕНОС", kv: 400, role: "Магистралата на мрежата. Токът е малък, затова загубата на километър е нищожна." },
  { cap: "РЕГИОНАЛНО", kv: 110, role: "Първо понижаване: захранва големи консуматори и регионални подстанции." },
  { cap: "РАЗПРЕДЕЛЕНИЕ", kv: 20, role: "Средно напрежение из града, до всеки квартален трафопост." },
  { cap: "ПОТРЕБИТЕЛ", kv: 0.4, role: "Последната стъпка. Точно затова тя е дълга стотици метри, а не стотици километри." },
];

/** Референтна линия за сравнението: 100 km, два проводника по 240 mm². */
const REF_R_PER_100KM = (2 * RHO_AL * 1e5) / (240 * 1e-6);

/**
 * Картата на мрежата от генератора до контакта.
 *
 * Не е калкулатор на истински далекопровод: показва какво прави **едно и
 * също** пренасяне на мощност през еднакъв референтен проводник при всяко
 * от нивата. Така единствената променлива остава напрежението, точно както
 * в §3.
 */
export function GridCascade({ compact = false }: { compact?: boolean }) {
  const [selected, setSelected] = useState(1);
  const [mw, setMw] = useState(20);

  const stages = compact ? GRID_STAGES.filter((_, i) => i !== 2 && i !== 3) : GRID_STAGES;
  const current = Math.min(selected, stages.length - 1);
  const active = stages[current];

  const i = (mw * 1e6) / (active.kv * 1e3);
  const loss = i * i * REF_R_PER_100KM;

  const W = 904;
  const H = 250;
  const blockW = 130;
  const gap = (W - 38 - stages.length * blockW) / (stages.length - 1);
  const centerOf = (n: number) => 19 + blockW / 2 + n * (blockW + gap);

  return (
    <div className={PANEL_CLASS}>
      <StageScroll minWidth={compact ? 620 : 780}>
        <svg viewBox={`0 0 ${W} ${H}`} className={STAGE_CLASS} aria-label="Веригата от централата до контакта">
          <Stage w={W} h={H} title="ОТ ЦЕНТРАЛАТА ДО КОНТАКТА" />

          {/* съединителните линии и трансформаторите между нивата */}
          {stages.slice(0, -1).map((s, n) => {
            const x0 = centerOf(n) + blockW / 2;
            const x1 = centerOf(n + 1) - blockW / 2;
            const xm = (x0 + x1) / 2;
            const up = stages[n + 1].kv > s.kv;
            return (
              <g key={`link-${n}`}>
                <line x1={x0} y1={110} x2={x1} y2={110} stroke={C.wire} strokeWidth={2.2} />
                <circle cx={xm - 7} cy={110} r={10} fill="none" stroke={C.warn} strokeWidth={2.2} />
                <circle cx={xm + 7} cy={110} r={10} fill="none" stroke={C.ok} strokeWidth={2.2} />
                <polygon
                  points={
                    up
                      ? `${xm},${76} ${xm - 6},${88} ${xm + 6},${88}`
                      : `${xm},${88} ${xm - 6},${76} ${xm + 6},${76}`
                  }
                  fill={up ? C.ok : C.minus}
                />
              </g>
            );
          })}

          {stages.map((s, n) => {
            const cx = centerOf(n);
            const on = n === current;
            return (
              <g
                key={s.cap}
                role="button"
                tabIndex={0}
                aria-label={`${s.cap}, ${s.kv} киловолта`}
                className="cursor-pointer"
                onClick={() => setSelected(n)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelected(n);
                  }
                }}
              >
                <rect
                  x={cx - blockW / 2}
                  y={62}
                  width={blockW}
                  height={96}
                  rx={8}
                  fill={on ? C.ok : "transparent"}
                  fillOpacity={on ? 0.12 : 1}
                  stroke={on ? C.ok : C.faint}
                  strokeWidth={on ? 2.6 : 1.8}
                />
                <text
                  x={cx}
                  y={86}
                  textAnchor="middle"
                  fill={on ? C.ok : C.mut}
                  fontFamily={DRAWING_FONT_FAMILY}
                  fontSize={11}
                  fontWeight={600}
                  letterSpacing="0.08em"
                >
                  {s.cap}
                </text>
                <SvgTex
                  x={cx}
                  y={106}
                  tex={s.kv >= 1 ? `${s.kv}\\,\\mathrm{kV}` : `${dec(s.kv, 1)}\\,\\mathrm{kV}`}
                  color={on ? C.wire : C.mut}
                  fontSize={17}
                  width={78}
                  anchor="middle"
                />
              </g>
            );
          })}

          <text
            x={W / 2}
            y={196}
            textAnchor="middle"
            fill={C.mut}
            fontFamily={DRAWING_FONT_FAMILY}
            fontSize={12.5}
          >
            Изберете ниво, за да видите какъв ток изисква то.
          </text>
        </svg>
      </StageScroll>

      <Readouts
        cells={[
          { label: "Ниво", tex: `V=${active.kv >= 1 ? dec(active.kv, 0) : dec(active.kv, 1)}\\,\\mathrm{kV}`, color: C.warn },
          { label: "Нужен ток", tex: `I=${dec(i, 0)}\\,\\mathrm A` },
          { label: "Загуба на 100 km", tex: `P_{\\text{зг}}=${watts(loss)}`, color: C.plus },
          {
            label: "Дял от пренасяното",
            tex: `${dec(Math.min(999999, (loss / (mw * 1e6)) * 100), 1)}\\,\\%`,
            color: loss > mw * 1e6 ? C.plus : C.ok,
          },
        ]}
        cols={4}
      />

      <p aria-live="polite" className="mt-3 text-[13.5px] leading-relaxed text-ink/90">
        <RichText text={`**${active.cap.charAt(0)}${active.cap.slice(1).toLowerCase()}.** ${active.role}`} />
      </p>

      <div className="mt-4">
        <RangeControl
          label="Пренасяна мощност"
          value={mw}
          min={2}
          max={50}
          step={1}
          valueTex={`P=${dec(mw, 0)}\\,\\mathrm{MW}`}
          onChange={setMw}
        />
      </div>

      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Сравнението е при **един и същ референтен проводник**: 100 km и две жила по $240\,\mathrm{mm^2}$. Единственото, което се мени между нивата, е напрежението." />
      </p>
    </div>
  );
}
