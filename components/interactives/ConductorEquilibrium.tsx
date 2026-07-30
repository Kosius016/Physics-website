"use client";

import { useEffect, useRef, useState } from "react";
import RichText from "@/components/RichText";
import { Arrow, BTN_SEC, C, PANEL_CLASS, STAGE_BG, STAGE_CLASS, TexChip } from "./svg";

/**
 * §2 · Как проводникът стига до равновесие.
 *
 * Плочата е внесена в еднородно външно поле. Горната половина на плочата носи
 * картината на зарядите (електроните се изтеглят наляво, дясното лице остава с
 * некомпенсирани йони), а долната половина показва защо полето вътре изчезва -
 * като векторно събиране, изписано на три реда:
 *
 *     E_0     →→→→→   (постоянно)
 *     E_инд   ←←      (расте с пренареждането)
 *     ─────────────
 *     E_вътре →→→     (остатъкът, който стига до нула)
 *
 * Дрейфовите стрелки на електроните са дълги колкото остатъчното поле, затова
 * движението спира точно когато третият ред стане нула.
 */

const EPSILON_0 = 8.854_187_812_8e-12;
/** Външното поле в сцената; кръгло число, за да се четат лесно и плътностите. */
const E_EXTERNAL = 1000;

const W = 620;
const H = 360;

const SLAB_X1 = 165;
const SLAB_X2 = 455;
const SLAB_Y1 = 45;
const SLAB_Y2 = 345;

/** Полето навън е непроменено; двата реда стигат, за да се чете еднородно. */
const OUTER_ROWS = [105, 195];

/** Редовете на векторното събиране вътре в плочата. */
const ROW_E0 = 195;
const ROW_IND = 245;
const ROW_RULE = 275;
const ROW_NET = 305;
/** Общо начало и общ край за трите стрелки, за да са сравними на око. */
const ARROW_LEFT = 285;
const ARROW_RIGHT = 405;
const ARROW_SPAN = ARROW_RIGHT - ARROW_LEFT;
const LABEL_X = 182;

const CARRIER_ROWS = [82, 118];
const CARRIER_START_X = 350;
const CARRIER_END_X = 192;
const POSITIVE_X = 432;

function decimal(value: number, digits = 2) {
  return value.toFixed(digits).replace(".", "{,}");
}

function Electron({ x, y, drift }: { x: number; y: number; drift: number }) {
  return (
    <g>
      {drift > 0.02 && (
        <g opacity={drift} style={{ transition: "opacity 120ms linear" }}>
          <Arrow
            x1={x - 11}
            y1={y}
            x2={x - 11 - (11 + drift * 16)}
            y2={y}
            color={C.minus}
            width={2}
          />
        </g>
      )}
      <circle cx={x} cy={y} r={8} fill={STAGE_BG} stroke={C.minus} strokeWidth={2} />
      <line x1={x - 3.6} y1={y} x2={x + 3.6} y2={y} stroke={C.minus} strokeWidth={2} strokeLinecap="round" />
    </g>
  );
}

function PositiveSite({ x, y, opacity }: { x: number; y: number; opacity: number }) {
  return (
    <g opacity={opacity} style={{ transition: "opacity 120ms linear" }}>
      <circle cx={x} cy={y} r={8} fill={STAGE_BG} stroke={C.plus} strokeWidth={2} />
      <line x1={x - 3.6} y1={y} x2={x + 3.6} y2={y} stroke={C.plus} strokeWidth={2} strokeLinecap="round" />
      <line x1={x} y1={y - 3.6} x2={x} y2={y + 3.6} stroke={C.plus} strokeWidth={2} strokeLinecap="round" />
    </g>
  );
}

export default function ConductorEquilibrium() {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const fromRef = useRef(0);

  useEffect(() => {
    if (!playing) return;
    const from = fromRef.current;
    const duration = Math.max(320, 1700 * (1 - from));
    let started: number | null = null;
    let id = requestAnimationFrame(function step(now: number) {
      if (started === null) started = now;
      const progress = Math.min(1, (now - started) / duration);
      setT(from + (1 - from) * progress);
      if (progress < 1) id = requestAnimationFrame(step);
      else setPlaying(false);
    });
    return () => cancelAnimationFrame(id);
  }, [playing]);

  const inside = (1 - t) * E_EXTERNAL;
  const induced = t * E_EXTERNAL;
  /** Полето на двете противоположно заредени лица е sigma/epsilon_0. */
  const sigma = EPSILON_0 * induced * 1e9; // nC/m^2
  const carrierX = CARRIER_START_X + (CARRIER_END_X - CARRIER_START_X) * t;
  const settled = t > 0.985;

  const inducedLength = t * ARROW_SPAN;
  const netLength = (1 - t) * ARROW_SPAN;

  function play() {
    fromRef.current = settled ? 0 : t;
    if (settled) setT(0);
    setPlaying(true);
  }

  return (
    <div className={PANEL_CLASS}>
      <div className="overflow-x-auto rounded-[10px]">
        <div className="mx-auto min-w-[520px]">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className={STAGE_CLASS}
            role="img"
            aria-label={`Метална плоча във външно поле; пренареждането на зарядите е ${Math.round(t * 100)} процента`}
          >
            <rect width={W} height={H} fill={STAGE_BG} />

            {/* Външното поле - непроменено от двете страни на плочата */}
            {OUTER_ROWS.map((y) => (
              <g key={y}>
                <Arrow x1={25} y1={y} x2={145} y2={y} color={C.minus} width={2.4} />
                <Arrow x1={475} y1={y} x2={595} y2={y} color={C.minus} width={2.4} />
              </g>
            ))}
            <TexChip x={25} y={82} tex={String.raw`\vec E_0`} color={C.minus} width={26} />

            {/* Плочата */}
            <rect
              x={SLAB_X1}
              y={SLAB_Y1}
              width={SLAB_X2 - SLAB_X1}
              height={SLAB_Y2 - SLAB_Y1}
              fill={C.wire}
              fillOpacity={0.13}
              stroke={C.wire}
              strokeWidth={2}
              rx={4}
            />
            <text
              x={(SLAB_X1 + SLAB_X2) / 2}
              y={30}
              fill={C.mut}
              fontSize={11.5}
              fontWeight={700}
              letterSpacing={2}
              textAnchor="middle"
            >
              МЕТАЛ
            </text>

            {/* Разделител между картината на зарядите и векторното събиране */}
            <line
              x1={SLAB_X1 + 12}
              y1={152}
              x2={SLAB_X2 - 12}
              y2={152}
              stroke={C.faint}
              strokeWidth={1.2}
              strokeDasharray="5 5"
            />

            {/* Горна половина: свободните електрони се изтеглят наляво */}
            {CARRIER_ROWS.map((y) => (
              <Electron key={`e-${y}`} x={carrierX} y={y} drift={1 - t} />
            ))}
            {/* Дясното лице остава с некомпенсирани положителни йони */}
            {CARRIER_ROWS.map((y) => (
              <PositiveSite key={`p-${y}`} x={POSITIVE_X} y={y} opacity={t} />
            ))}

            {/* Долна половина: E_0 + E_инд = E_вътре, ред по ред */}
            <Arrow
              x1={ARROW_LEFT}
              y1={ROW_E0}
              x2={ARROW_RIGHT}
              y2={ROW_E0}
              color={C.minus}
              width={2.6}
            />
            <TexChip x={LABEL_X} y={ROW_E0} tex={String.raw`\vec E_0`} color={C.minus} width={26} />

            {inducedLength > 10 ? (
              <Arrow
                x1={ARROW_RIGHT}
                y1={ROW_IND}
                x2={ARROW_RIGHT - inducedLength}
                y2={ROW_IND}
                color={C.plus}
                width={2.6}
              />
            ) : (
              <TexChip
                x={ARROW_RIGHT}
                y={ROW_IND}
                tex="0"
                color={C.plus}
                width={9}
                anchor="end"
              />
            )}
            <TexChip
              x={LABEL_X}
              y={ROW_IND}
              tex={String.raw`\vec E_{\text{инд}}`}
              color={C.plus}
              width={54}
            />

            <line
              x1={LABEL_X - 6}
              y1={ROW_RULE}
              x2={ARROW_RIGHT + 6}
              y2={ROW_RULE}
              stroke={C.mut}
              strokeWidth={1.6}
            />

            {netLength > 10 ? (
              <Arrow
                x1={ARROW_LEFT}
                y1={ROW_NET}
                x2={ARROW_LEFT + netLength}
                y2={ROW_NET}
                color={C.ok}
                width={2.8}
              />
            ) : (
              <TexChip x={ARROW_LEFT} y={ROW_NET} tex="0" color={C.ok} width={9} />
            )}
            <TexChip
              x={LABEL_X}
              y={ROW_NET}
              tex={String.raw`\vec E_{\text{вътре}}`}
              color={settled ? C.ok : C.mut}
              width={70}
            />
          </svg>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-4">
        <label className="block min-w-[240px] flex-1">
          <span className="mb-1.5 flex items-center justify-between gap-3 text-[13px] font-semibold text-ink">
            <span>Пренареждане на зарядите</span>
            <span className="tabular-nums text-minus">{Math.round(t * 100)} %</span>
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={t}
            onChange={(event) => {
              setPlaying(false);
              setT(Number(event.target.value));
            }}
            className="w-full accent-minus"
          />
        </label>
        <button type="button" className={BTN_SEC} onClick={play} disabled={playing}>
          {playing ? "Тече…" : settled ? "Отначало" : "Пусни"}
        </button>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule sm:grid-cols-4">
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Външно поле</dt>
          <dd className="mt-0.5 text-[14px] font-bold tabular-nums text-minus">
            <RichText text={`$E_0=${E_EXTERNAL}\\,\\mathrm{V/m}$`} />
          </dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Поле на зарядите</dt>
          <dd className="mt-0.5 text-[14px] font-bold tabular-nums text-plus">
            <RichText text={`$E_{\\text{инд}}=${decimal(induced, 0)}\\,\\mathrm{V/m}$`} />
          </dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Поле в метала</dt>
          <dd className="mt-0.5 text-[14px] font-bold tabular-nums text-ok">
            <RichText text={`$E=${decimal(inside, 0)}\\,\\mathrm{V/m}$`} />
          </dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Плътност по лицата</dt>
          <dd className="mt-0.5 text-[14px] font-bold tabular-nums text-ink">
            <RichText text={`$|\\sigma|=${decimal(sigma)}\\,\\mathrm{nC/m^2}$`} />
          </dd>
        </div>
      </dl>

      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        {settled
          ? "Червената стрелка е станала точно колкото синята и сочи срещу нея. Сборът на трети ред е нула, дрейфът спира: това е равновесието."
          : "Разделените заряди създават собствено поле (червено) срещу външното (синьо). Третият ред е остатъкът, а дрейфовите стрелки на електроните са дълги точно колкото него."}
      </p>
    </div>
  );
}
