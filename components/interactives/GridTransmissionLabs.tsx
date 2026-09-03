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
 * Интерактиви към §1, §2, §5 и §12 на урока за трансформатора и преноса.
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


/* ================================================================= §5 */

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

/* ================================================================= §1 */

/**
 * Начална задача, без да издава решението с 400 kV и цялата каскада.
 *
 * Ученикът отдалечава квартала, докато и двата края остават при историческите
 * 110 V. Червеният ореол показва само, че по линията възниква проблем; точната
 * сметка и причината идват в §2.
 */
export function OpeningReachLab() {
  const [logDistance, setLogDistance] = useState(Math.log10(20));
  const distance = 10 ** logDistance;
  // При същите числа като §2 загубата е 10 % приблизително при 22 m.
  const lossRelativeToLoad = (distance / 22) * 0.1;
  const glow = Math.min(1, Math.log10(1 + lossRelativeToLoad * 8) / 2.2);

  const status =
    lossRelativeToLoad < 0.12
      ? "\\text{още приемливо}"
      : lossRelativeToLoad < 1
        ? "\\text{силно нагряване}"
        : "\\text{невъзможен пренос}";

  const W = 620;
  const H = 230;
  const left = 92;
  const right = 528;

  return (
    <div className={PANEL_CLASS}>
      <StageScroll minWidth={540} maxWidth={680}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className={STAGE_CLASS}
          aria-label="Начална задача: кварталът се отдалечава от 110-волтова централа"
        >
          <Stage w={W} h={H} title="КОЛКО ДАЛЕЧ МОЖЕ ДА Е КВАРТАЛЪТ?" />

          <rect x={42} y={70} width={100} height={92} rx={8} fill="none" stroke={C.warn} strokeWidth={2.4} />
          <SourceSymbol x={92} y={112} r={20} color={C.warn} />
          <text x={92} y={184} textAnchor="middle" fill={C.mut} fontFamily={DRAWING_FONT_FAMILY} fontSize={11.5} fontWeight={700}>
            ЦЕНТРАЛА · 110 V
          </text>

          <rect x={478} y={70} width={100} height={92} rx={8} fill="none" stroke={C.ok} strokeWidth={2.4} />
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x={497 + i * 19}
              y={101 + (i % 2) * 10}
              width={13}
              height={38 - (i % 2) * 10}
              fill="none"
              stroke={C.ok}
              strokeWidth={1.8}
            />
          ))}
          <text x={528} y={184} textAnchor="middle" fill={C.mut} fontFamily={DRAWING_FONT_FAMILY} fontSize={11.5} fontWeight={700}>
            КВАРТАЛ · 110 V
          </text>

          {[94, 132].map((y) => (
            <g key={y}>
              <line x1={left + 50} y1={y} x2={right - 50} y2={y} stroke={C.plus} strokeWidth={12} opacity={glow * 0.5} />
              <line x1={left + 50} y1={y} x2={right - 50} y2={y} stroke={C.wire} strokeWidth={2.5} />
            </g>
          ))}
          <SvgTex x={310} y={76} tex="?" color={glow > 0.35 ? C.plus : C.warn} fontSize={22} width={24} anchor="middle" />
          <SvgTex x={310} y={148} tex="\\ell" color={C.mut} fontSize={14} width={20} anchor="middle" />
        </svg>
      </StageScroll>

      <Readouts
        cells={[
          { label: "В двата края", tex: "V=110\\,\\mathrm V", color: C.warn },
          { label: "Разстояние", tex: `\\ell=${metres(distance)}` },
          { label: "Проводник", tex: "S=240\\,\\mathrm{mm^2}" },
          { label: "Линията", tex: status, color: lossRelativeToLoad < 0.12 ? C.ok : C.plus },
        ]}
        cols={4}
      />

      <p aria-live="polite" className="mt-3 text-[13.5px] leading-relaxed text-ink/90">
        {lossRelativeToLoad < 0.12
          ? "На няколко десетки метра системата още изглежда възможна."
          : lossRelativeToLoad < 1
            ? "Само няколко улици по-далеч проводниците вече поглъщат голям дял от подаденото."
            : "Градът е твърде далеч: със 110 V линията би се нагрявала повече, отколкото захранва товара."}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {[
          { label: "22 m · дворът", distance: 22 },
          { label: "1 km · квартал", distance: 1_000 },
          { label: "150 km · друг град", distance: 150_000 },
        ].map((preset) => (
          <button
            key={preset.distance}
            type="button"
            className={BTN_SEC}
            onClick={() => setLogDistance(Math.log10(preset.distance))}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <RangeControl
          label="Отдалечи квартала"
          value={logDistance}
          min={Math.log10(20)}
          max={Math.log10(150_000)}
          step={0.01}
          valueTex={`\\ell=${metres(distance)}`}
          onChange={setLogDistance}
          accent="accent-warn"
        />
      </div>

      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        Тук умишлено още не показваме решението. Следващата секция ще изведе числата зад червения ореол.
      </p>
    </div>
  );
}

/* ================================================================ §12 */

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
 * в §5.
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
  const H = 176;
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
                <line x1={x0} y1={104} x2={x1} y2={104} stroke={C.wire} strokeWidth={2.2} />
                <circle cx={xm - 7} cy={104} r={10} fill="none" stroke={C.warn} strokeWidth={2.2} />
                <circle cx={xm + 7} cy={104} r={10} fill="none" stroke={C.ok} strokeWidth={2.2} />
                <polygon
                  points={
                    up
                      ? `${xm},${70} ${xm - 6},${82} ${xm + 6},${82}`
                      : `${xm},${82} ${xm - 6},${70} ${xm + 6},${70}`
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
                  y={56}
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
                  y={80}
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
                  y={100}
                  tex={s.kv >= 1 ? `${s.kv}\\,\\mathrm{kV}` : `${dec(s.kv, 1)}\\,\\mathrm{kV}`}
                  color={on ? C.wire : C.mut}
                  fontSize={17}
                  width={78}
                  anchor="middle"
                />
              </g>
            );
          })}

        </svg>
      </StageScroll>

      <Readouts
        cells={[
          { label: "Ниво", tex: `V=${active.kv >= 1 ? dec(active.kv, 0) : dec(active.kv, 1)}\\,\\mathrm{kV}`, color: C.warn },
          { label: "Нужен ток", tex: `I=${dec(i, 0)}\\,\\mathrm A` },
          {
            label: "Загуба на 100 km",
            tex: loss > mw * 1e6 ? `\\text{невъзможно}` : `P_{\\text{зг}}=${watts(loss)}`,
            color: C.plus,
          },
          {
            label: "Спрямо пренасяното",
            tex:
              loss > mw * 1e6
                ? `\\times${dec(loss / (mw * 1e6), 0)}\\ \\text{повече}`
                : `${dec((loss / (mw * 1e6)) * 100, 2)}\\,\\%`,
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

/* ================================================================= §2 */

/** Специфично съпротивление на мед при стайна температура, Ω·m. */
const RHO_CU = 1.68e-8;

/** Пръстените на картата са по декади, иначе 22 m и 20 km не се побират заедно. */
const RING_DECADES = [0, 1, 2, 3, 4, 5, 6] as const;
const RING_LABELS: Record<number, string> = {
  0: "1\\,\\mathrm m",
  1: "10\\,\\mathrm m",
  2: "100\\,\\mathrm m",
  3: "1\\,\\mathrm{km}",
  4: "10\\,\\mathrm{km}",
  5: "100\\,\\mathrm{km}",
  6: "1000\\,\\mathrm{km}",
};

/** Разстоянието в метри, готово за $…$. */
function metres(value: number): string {
  if (value >= 1e3) return `${dec(value / 1e3, value >= 1e4 ? 0 : 1)}\\,\\mathrm{km}`;
  return `${dec(value, value < 100 ? 1 : 0)}\\,\\mathrm m`;
}

/**
 * Докъде стига токът: обхватът на една централа при зададено напрежение.
 *
 * Питаме обратното на обичайния въпрос. Вместо „каква е загубата на
 * тази линия“ питаме „колко дълга може да бъде линията, ако загубата
 * не бива да надхвърли даден дял“. Отговорът при $110\,\mathrm V$ е
 * шокиращо малък и точно това отваря главата.
 *
 * Радиалната скала е логаритмична и пръстените са означени, защото
 * иначе двадесет метра и двадесет километра не се побират в едно платно.
 */
export function DCRangeLab() {
  const [logV, setLogV] = useState(Math.log10(110));
  const [mm2, setMm2] = useState(240);
  const [lossPct, setLossPct] = useState(10);
  const [kw, setKw] = useState(400);

  const v = 10 ** logV;
  const i = (kw * 1e3) / v;
  // допустимото съпротивление на линията при зададен дял на загубата
  const rMax = ((lossPct / 100) * kw * 1e3) / i ** 2;
  const reach = (rMax * mm2 * 1e-6) / (2 * RHO_CU);

  // почти квадратно платно: кръгова фигура в широк правоъгълник оставя
  // четвърт празно поле отстрани
  const W = 420;
  const H = 350;
  const cx = 210;
  const cy = 172;
  const rPx = 145;
  const perDecade = rPx / 6;
  // log10 на метрите, ограничен до платното
  const decades = Math.max(0, Math.min(6, Math.log10(Math.max(1, reach))));
  const offMap = reach > 1e6;

  return (
    <div className={PANEL_CLASS}>
      <StageScroll minWidth={380} maxWidth={470}>
        <svg viewBox={`0 0 ${W} ${H}`} className={STAGE_CLASS} aria-label="Обхват на централата при дадено напрежение">
          <Stage w={W} h={H} title="ДОКЪДЕ СТИГА ЕДНА ЦЕНТРАЛА" />

          {RING_DECADES.map((d) => (
            <g key={d}>
              <circle
                cx={cx}
                cy={cy}
                r={d * perDecade}
                fill="none"
                stroke={C.faint}
                strokeWidth={1}
                strokeDasharray="3 5"
              />
              {d > 0 && (
                /* Означенията се редят надолу по вертикала: по хоризонтала
                   съседните се застъпват, а нагоре най-външното удря
                   заглавието на сцената. */
                <SvgTex
                  x={cx + 8}
                  y={cy + d * perDecade - 7}
                  tex={RING_LABELS[d]}
                  color={C.mut}
                  fontSize={10.5}
                  width={56}
                />
              )}
            </g>
          ))}

          {/* обхватът */}
          <circle
            cx={cx}
            cy={cy}
            r={Math.max(3, decades * perDecade)}
            fill={offMap ? C.ok : C.plus}
            fillOpacity={0.2}
            stroke={offMap ? C.ok : C.plus}
            strokeWidth={2.6}
          />

          {/* централата */}
          <rect x={cx - 15} y={cy - 15} width={30} height={30} rx={5} fill="none" stroke={C.warn} strokeWidth={2.4} />
          <SourceSymbol x={cx} y={cy} r={9} color={C.warn} />

        </svg>
      </StageScroll>

      <Readouts
        cells={[
          { label: "Напрежение", tex: `V=${volts(v)}`, color: C.warn },
          { label: "Нужен ток", tex: `I=${dec(i, i < 100 ? 1 : 0)}\\,\\mathrm A` },
          { label: "Допустимо съпротивление", tex: `R_{\\max}=${dec(rMax, rMax < 1 ? 4 : 1)}\\,\\Omega` },
          {
            label: "Обхват",
            tex: offMap ? "\\text{хиляди километри}" : `\\ell_{\\max}=${metres(reach)}`,
            color: offMap ? C.ok : C.plus,
          },
        ]}
        cols={4}
      />

      <p aria-live="polite" className="mt-3 text-[13.5px] leading-relaxed text-ink/90">
        <RichText
          text={
            reach < 60
              ? "**Кварталът трябва да е в двора на централата.** При това напрежение токът е толкова голям, че проводникът изяжда позволената загуба още преди да е излязъл от улицата."
              : reach < 3000
                ? "Обхватът вече се мери в стотици метри, но една централа на квартал остава единственият възможен модел."
                : "При това напрежение разстоянието спира да бъде ограничението. Проблемът се премества другаде: как да върнем напрежението надолу за потребителя."
          }
        />
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {[
          { label: "110 V (Едисън)", v: 110 },
          { label: "20 kV", v: 20e3 },
          { label: "100 kV", v: 100e3 },
        ].map((p) => (
          <button key={p.label} type="button" className={BTN_SEC} onClick={() => setLogV(Math.log10(p.v))}>
            {p.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <RangeControl
          label="Напрежение на линията"
          value={logV}
          min={Math.log10(100)}
          max={Math.log10(400e3)}
          step={0.005}
          valueTex={`V=${volts(v)}`}
          onChange={setLogV}
          accent="accent-warn"
        />
        <RangeControl
          label="Мощност на квартала"
          value={kw}
          min={50}
          max={2000}
          step={50}
          valueTex={`P=${dec(kw, 0)}\\,\\mathrm{kW}`}
          onChange={setKw}
        />
        <RangeControl
          label="Сечение на проводника"
          value={mm2}
          min={60}
          max={1000}
          step={20}
          valueTex={`S_{\\text{пр}}=${dec(mm2, 0)}\\,\\mathrm{mm^2}`}
          onChange={setMm2}
        />
        <RangeControl
          label="Допустима загуба"
          value={lossPct}
          min={2}
          max={30}
          step={1}
          valueTex={`${dec(lossPct, 0)}\\,\\%`}
          onChange={setLossPct}
        />
      </div>

      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Проводникът е меден, два са и обхватът е разстоянието, при което загубата тъкмо достига позволения дял. Пръстените са по декади, иначе двадесет метра и двадесет километра не се побират в едно платно." />
      </p>
    </div>
  );
}
