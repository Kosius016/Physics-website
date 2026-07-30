"use client";

import { useState } from "react";
import { Arrow, BTN_PRI, BTN_SEC, C, PANEL_CLASS, STAGE_BG, STAGE_CLASS, TexChip } from "./svg";

/**
 * §4 · Извеждане на E = sigma/epsilon_0 с гаусова „кутийка“ на границата.
 *
 * Четири фази, всяка добавя по едно съображение:
 *   0 геометрия  → 1 кутийката  → 2 кои потоци са нула  → 3 какво остава.
 * Елементите от предишна фаза не изчезват, а падат на opacity 0.25-0.5,
 * за да се вижда откъде идва всяко твърдение.
 *
 * Кутийката стои в центъра на сцената, силовите линии са симетрично от двете
 * ѝ страни, а колоната x = 371..500 е оставена празна за етикетите с потоците.
 * Всеки етикет е `TexChip`: иначе пада върху повърхността или върху линия и
 * става нечетим.
 */

const W = 620;
const H = 320;
const SURFACE_Y = 175;
const METAL_BOTTOM = 300;

const BOX_X1 = 255;
const BOX_X2 = 365;
const BOX_TOP = 132;
const BOX_BOTTOM = 222;
const BOX_CX = (BOX_X1 + BOX_X2) / 2;
const BOX_RX = (BOX_X2 - BOX_X1) / 2;

const ARROW_TOP = 116;
/** Симетрично спрямо центъра 310, с празна колона отдясно за етикетите. */
const FIELD_X = [58, 120, 500, 562];
const CHARGE_X = [40, 85, 130, 175, 220, 265, 310, 355, 400, 445, 490, 535, 580];

/** Празната колона, в която стоят твърденията за потоците. */
const NOTE_X = 378;

const CAPTIONS = [
  "Проводникът е в равновесие: излишният заряд стои по повърхността, а полето точно отвън е перпендикулярно на нея.",
  "Слагаме тънка гаусова „кутийка“ с площ на капака A, която стъпва от двете страни на повърхността.",
  "Страничните стени са успоредни на полето, затова потокът през тях е нула. Долният капак е в метала, където полето е нула.",
  "Остава само горният капак: потокът през цялата кутийка е EA, а обхванатият заряд е σA. Оттук следва E = σ/ε₀.",
];

function PlusGlyph({ x, y }: { x: number; y: number }) {
  return (
    <g stroke={C.plus} strokeWidth={2.2} strokeLinecap="round">
      <line x1={x - 4.5} y1={y} x2={x + 4.5} y2={y} />
      <line x1={x} y1={y - 4.5} x2={x} y2={y + 4.5} />
    </g>
  );
}

export default function PillboxDerivation() {
  const [phase, setPhase] = useState(0);

  const boxColor = phase >= 2 ? C.mut : C.warn;
  const capColor = phase >= 3 ? C.ok : phase >= 2 ? C.warn : C.mut;

  return (
    <div className={PANEL_CLASS}>
      <div className="overflow-x-auto rounded-[10px]">
        <div className="mx-auto min-w-[520px]">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className={STAGE_CLASS}
            role="img"
            aria-label={`Гаусова кутийка върху проводяща повърхност, стъпка ${phase + 1} от 4`}
          >
            <rect width={W} height={H} fill={STAGE_BG} />

            {/* Метал под повърхността */}
            <rect
              x={20}
              y={SURFACE_Y}
              width={W - 40}
              height={METAL_BOTTOM - SURFACE_Y}
              fill={C.wire}
              fillOpacity={0.13}
            />
            <line x1={20} y1={SURFACE_Y} x2={W - 20} y2={SURFACE_Y} stroke={C.wire} strokeWidth={2.5} />
            <text x={35} y={42} fill={C.mut} fontSize={11.5} fontWeight={700} letterSpacing={2}>
              ВАКУУМ
            </text>
            <text x={35} y={288} fill={C.mut} fontSize={11.5} fontWeight={700} letterSpacing={2}>
              МЕТАЛ
            </text>

            {/* Повърхностният заряд */}
            {CHARGE_X.map((x) => (
              <PlusGlyph key={x} x={x} y={SURFACE_Y} />
            ))}
            <TexChip x={232} y={152} tex={String.raw`\sigma`} color={C.plus} width={12} anchor="end" />

            {/* Полето точно отвън: перпендикулярно на повърхността */}
            {FIELD_X.map((x) => (
              <Arrow key={x} x1={x} y1={SURFACE_Y - 4} x2={x} y2={ARROW_TOP} color={C.minus} width={2.4} />
            ))}
            <TexChip x={58} y={96} tex={String.raw`\vec E`} color={C.minus} width={26} />

            {/* Кутийката */}
            {phase >= 1 && (
              <g className="animate-rise">
                <rect
                  x={BOX_X1}
                  y={BOX_TOP}
                  width={BOX_X2 - BOX_X1}
                  height={BOX_BOTTOM - BOX_TOP}
                  fill="none"
                  stroke={boxColor}
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  style={{ transition: "stroke 200ms ease-out" }}
                />
                <ellipse
                  cx={BOX_CX}
                  cy={BOX_TOP}
                  rx={BOX_RX}
                  ry={11}
                  fill="none"
                  stroke={capColor}
                  strokeWidth={2.6}
                  strokeDasharray="6 4"
                  style={{ transition: "stroke 200ms ease-out" }}
                />
                <ellipse
                  cx={BOX_CX}
                  cy={BOX_BOTTOM}
                  rx={BOX_RX}
                  ry={11}
                  fill="none"
                  stroke={boxColor}
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  style={{ transition: "stroke 200ms ease-out" }}
                />
                <g opacity={phase >= 3 ? 0.5 : 1} style={{ transition: "opacity 200ms ease-out" }}>
                  <TexChip x={243} y={120} tex="A" color={capColor} width={14} anchor="end" />
                </g>
              </g>
            )}

            {/* Полето през горния капак */}
            <Arrow
              x1={BOX_CX}
              y1={SURFACE_Y - 4}
              x2={BOX_CX}
              y2={ARROW_TOP - 6}
              color={phase >= 3 ? C.ok : C.minus}
              width={2.8}
            />

            {phase >= 2 && (
              <g
                className="animate-rise"
                opacity={phase >= 3 ? 0.55 : 1}
                style={{ transition: "opacity 200ms ease-out" }}
              >
                <TexChip
                  x={NOTE_X}
                  y={152}
                  tex={String.raw`\Phi_{\text{стени}}=0`}
                  color={C.warn}
                  width={98}
                />
                <TexChip
                  x={BOX_CX}
                  y={258}
                  tex={String.raw`\Phi_{\text{дъно}}=0`}
                  color={C.warn}
                  width={92}
                  anchor="middle"
                />
              </g>
            )}

            {phase >= 3 && (
              <g className="animate-rise">
                <TexChip
                  x={NOTE_X}
                  y={96}
                  tex={String.raw`\Phi=EA=\frac{\sigma A}{\varepsilon_0}`}
                  color={C.ok}
                  width={128}
                />
              </g>
            )}
          </svg>
        </div>
      </div>

      <p aria-live="polite" className="mt-3 min-h-[42px] text-[13.5px] leading-relaxed text-muted">
        {CAPTIONS[phase]}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className={BTN_PRI}
          onClick={() => setPhase((p) => Math.min(3, p + 1))}
          disabled={phase >= 3}
        >
          Следваща стъпка
        </button>
        <button type="button" className={BTN_SEC} onClick={() => setPhase(0)} disabled={phase === 0}>
          Отначало
        </button>
        <span className="self-center text-[12.5px] font-semibold tabular-nums text-muted">
          {phase + 1} / 4
        </span>
      </div>
    </div>
  );
}
