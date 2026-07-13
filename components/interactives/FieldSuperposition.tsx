"use client";

import { useState } from "react";
import PredictionQuestion from "./PredictionQuestion";
import SvgTex from "./SvgTex";
import { Arrow, BTN_PRI, C, CurrentSymbol, PANEL_CLASS, STAGE_BG, STAGE_CLASS } from "./svg";

/**
 * Серия упражнения "събират ли се полетата, или се компенсират".
 * Два проводника, перпендикулярни на екрана (⊙/⊗ в напречен разрез), и точка P.
 * Първо се вижда САМО геометрията; след отговора на въпроса се появяват
 * dB₁, dB₂ и резултантният вектор с обяснение. 4 случая: събиране,
 * частично и пълно компенсиране.
 */

const W = 640;
const H = 340;
const W1 = { x: 200, y: 190 };
const W2 = { x: 440, y: 190 };

type Verdict = "add" | "partial" | "cancel";

interface SuperCase {
  title: string;
  /** true = ток навън от екрана (⊙) */
  out1: boolean;
  out2: boolean;
  p: { x: number; y: number };
  correct: Verdict;
  explanation: string;
}

const CASES: SuperCase[] = [
  {
    title: "Еднакви токове, P по средата",
    out1: true,
    out2: true,
    p: { x: 320, y: 190 },
    correct: "cancel",
    explanation:
      "Двете полета имат равни големини ($P$ е на равни разстояния), но полето на левия проводник в $P$ сочи нагоре, а на десния — надолу. Равни и противоположни → **пълно компенсиране**: $B=0$.",
  },
  {
    title: "Противоположни токове, P по средата",
    out1: true,
    out2: false,
    p: { x: 320, y: 190 },
    correct: "add",
    explanation:
      "Сега десният ток е обърнат, затова и полето му в $P$ се обръща: и $d\\vec B_1$, и $d\\vec B_2$ сочат нагоре. Еднопосочни → **събират се**: $B=2B_1$.",
  },
  {
    title: "Еднакви токове, P над средата",
    out1: true,
    out2: true,
    p: { x: 320, y: 70 },
    correct: "partial",
    explanation:
      "Всяко поле е перпендикулярно на своя $\\vec r$, затова двата вектора сочат под ъгъл. Вертикалните компоненти се съкращават, хоризонталните се събират → **частично компенсиране**: остава хоризонтален резултат.",
  },
  {
    title: "Еднакви токове, P по-близо до левия",
    out1: true,
    out2: true,
    p: { x: 260, y: 190 },
    correct: "partial",
    explanation:
      "Посоките пак са противоположни, но $P$ е по-близо до левия проводник, затова $|d\\vec B_1|>|d\\vec B_2|$ (полето отслабва като $1/r$). Изваждат се, но не докрай → **частично компенсиране**: остава поле нагоре.",
  },
];

/** Поле на праволинеен ток ⊥ екрана в точка P (екранни координати, ненормирано). */
function fieldAt(wire: { x: number; y: number }, out: boolean, p: { x: number; y: number }) {
  const dx = p.x - wire.x;
  const dy = p.y - wire.y;
  const r2 = dx * dx + dy * dy;
  const s = out ? 1 : -1;
  // ⊙ (към наблюдателя): B ∝ (dy, -dx)/r² в екранни координати
  return { x: (s * dy) / r2, y: (s * -dx) / r2 };
}

function q(value: number) {
  return Math.round(value * 1_000) / 1_000;
}

/** Subtle field lines with tangent arrows. The largest circle always passes through P. */
function FieldCircles({
  wire,
  p,
  out,
  color,
  phase,
}: {
  wire: { x: number; y: number };
  p: { x: number; y: number };
  out: boolean;
  color: string;
  phase: number;
}) {
  const radiusToP = Math.hypot(p.x - wire.x, p.y - wire.y);
  const radii = [radiusToP * 0.42, radiusToP * 0.7, radiusToP];

  return (
    <g className="animate-rise" aria-hidden="true">
      {radii.map((radius, index) => {
        const angle = phase + index * 1.42;
        // In SVG, increasing polar angle turns clockwise. An outward current
        // therefore needs the negative tangent to show the physical CCW field.
        const direction = out ? -1 : 1;
        const tx = direction * -Math.sin(angle);
        const ty = direction * Math.cos(angle);
        const tipX = wire.x + radius * Math.cos(angle);
        const tipY = wire.y + radius * Math.sin(angle);
        const baseX = tipX - tx * 8;
        const baseY = tipY - ty * 8;
        const nx = -ty * 3.5;
        const ny = tx * 3.5;

        return (
          <g key={index}>
            <circle
              cx={wire.x}
              cy={wire.y}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={index === radii.length - 1 ? 1.6 : 1.2}
              strokeOpacity={index === radii.length - 1 ? 0.42 : 0.25}
            />
            <polygon
              points={`${q(tipX)},${q(tipY)} ${q(baseX + nx)},${q(baseY + ny)} ${q(baseX - nx)},${q(baseY - ny)}`}
              fill={color}
              fillOpacity={index === radii.length - 1 ? 0.8 : 0.58}
            />
          </g>
        );
      })}
    </g>
  );
}

function ComponentLine({
  axis,
  origin,
  value,
  cancel,
  offset,
  color,
}: {
  axis: "x" | "y";
  origin: { x: number; y: number };
  value: number;
  cancel: number;
  offset: number;
  color: string;
}) {
  if (Math.abs(value) < 0.5) return null;

  const sign = Math.sign(value);
  const cancelEnd = sign * Math.min(cancel, Math.abs(value));
  const hasCancelingPart = cancel > 0.5;
  const hasRemainder = Math.abs(value) - Math.abs(cancelEnd) > 0.5;
  const point = (amount: number) =>
    axis === "x"
      ? { x: origin.x + amount, y: origin.y + offset }
      : { x: origin.x + offset, y: origin.y + amount };
  const start = point(0);
  const split = point(hasCancelingPart ? cancelEnd : value);
  const end = point(value);
  const common = {
    stroke: color,
    strokeWidth: 2,
    strokeDasharray: "6 5",
    strokeLinecap: "round" as const,
  };

  return (
    <g aria-hidden="true">
      {hasCancelingPart && (
        <line
          x1={start.x}
          y1={start.y}
          x2={split.x}
          y2={split.y}
          {...common}
          className="animate-fadeout"
        />
      )}
      {(hasRemainder || !hasCancelingPart) && (
        <line
          x1={hasCancelingPart ? split.x : start.x}
          y1={hasCancelingPart ? split.y : start.y}
          x2={end.x}
          y2={end.y}
          {...common}
          strokeOpacity={0.82}
        />
      )}
    </g>
  );
}

function ComponentProjections({
  p,
  b1,
  b2,
  scale,
}: {
  p: { x: number; y: number };
  b1: { x: number; y: number };
  b2: { x: number; y: number };
  scale: number;
}) {
  const v1 = { x: b1.x * scale, y: b1.y * scale };
  const v2 = { x: b2.x * scale, y: b2.y * scale };
  const cancelX = v1.x * v2.x < 0 ? Math.min(Math.abs(v1.x), Math.abs(v2.x)) : 0;
  const cancelY = v1.y * v2.y < 0 ? Math.min(Math.abs(v1.y), Math.abs(v2.y)) : 0;

  return (
    <g className="animate-rise">
      <ComponentLine axis="x" origin={p} value={v1.x} cancel={cancelX} offset={-6} color={C.minus} />
      <ComponentLine axis="y" origin={p} value={v1.y} cancel={cancelY} offset={-6} color={C.minus} />
      <ComponentLine axis="x" origin={p} value={v2.x} cancel={cancelX} offset={6} color={C.plus} />
      <ComponentLine axis="y" origin={p} value={v2.y} cancel={cancelY} offset={6} color={C.plus} />
    </g>
  );
}

export default function FieldSuperposition() {
  const [caseIdx, setCaseIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const cs = CASES[caseIdx];
  const b1 = fieldAt(W1, cs.out1, cs.p);
  const b2 = fieldAt(W2, cs.out2, cs.p);
  const bSum = { x: b1.x + b2.x, y: b1.y + b2.y };

  // Мащаб: по-дългият от двата вектора да е ~85px
  const m1 = Math.hypot(b1.x, b1.y);
  const m2 = Math.hypot(b2.x, b2.y);
  const scale = 85 / Math.max(m1, m2);
  const mSum = Math.hypot(bSum.x, bSum.y);
  const sumIsZero = mSum < 1e-9;

  const next = () => {
    setCaseIdx((i) => (i + 1) % CASES.length);
    setRevealed(false);
  };

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[14px] text-muted">
          <span className="font-bold tabular-nums text-ink">
            Случай {caseIdx + 1}/{CASES.length}:
          </span>{" "}
          {cs.title}
        </p>
        <div className="flex items-center gap-1.5">
          {CASES.map((_, i) => (
            <span
              key={i}
              className={`inline-block h-2.5 w-2.5 rounded-full border border-ink ${i === caseIdx ? "bg-ink" : i < caseIdx ? "bg-rule" : "bg-surface"}`}
            />
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className={STAGE_CLASS + " select-none"}>
        <rect width={W} height={H} fill={STAGE_BG} />

        {revealed && (
          <g>
            <FieldCircles wire={W1} p={cs.p} out={cs.out1} color={C.minus} phase={-0.58} />
            <FieldCircles wire={W2} p={cs.p} out={cs.out2} color={C.plus} phase={0.58} />
          </g>
        )}

        {/* Геометрията: два проводника в напречен разрез + P */}
        <CurrentSymbol x={W1.x} y={W1.y} out={cs.out1} r={15} color={C.warn} texLabel="I_1" />
        <CurrentSymbol x={W2.x} y={W2.y} out={cs.out2} r={15} color={C.warn} texLabel="I_2" />
        <line x1={W1.x} y1={W1.y} x2={cs.p.x} y2={cs.p.y} stroke={C.faint} strokeWidth={1.3} strokeDasharray="4 4" />
        <line x1={W2.x} y1={W2.y} x2={cs.p.x} y2={cs.p.y} stroke={C.faint} strokeWidth={1.3} strokeDasharray="4 4" />
        <circle cx={cs.p.x} cy={cs.p.y} r={5} fill={C.wire} />
        <SvgTex x={cs.p.x + 10} y={cs.p.y - 10} tex="P" color={C.wire} width={28} />

        {/* Векторите — само след отговор */}
        {revealed && (
          <g>
            {cs.correct === "partial" && <ComponentProjections p={cs.p} b1={b1} b2={b2} scale={scale} />}
            <Arrow
              x1={cs.p.x}
              y1={cs.p.y}
              x2={cs.p.x + b1.x * scale}
              y2={cs.p.y + b1.y * scale}
              color={C.minus}
              texLabel="d\vec B_1"
              texLabelDy={-4}
              animate
            />
            <Arrow
              x1={cs.p.x}
              y1={cs.p.y}
              x2={cs.p.x + b2.x * scale}
              y2={cs.p.y + b2.y * scale}
              color={C.plus}
              texLabel="d\vec B_2"
              texLabelDy={9}
              animate
            />
            {sumIsZero ? (
              <SvgTex x={cs.p.x + 14} y={cs.p.y + 25} tex="\vec B=0" color={C.ok} width={70} className="animate-rise" />
            ) : (
              <Arrow
                x1={cs.p.x}
                y1={cs.p.y}
                x2={cs.p.x + bSum.x * scale}
                y2={cs.p.y + bSum.y * scale}
                color={C.ok}
                width={3.5}
                texLabel="\vec B_{\text{рез}}"
                texLabelDy={-10}
                animate
              />
            )}
          </g>
        )}
      </svg>

      {revealed && (
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 px-1 text-[11.5px] leading-5 text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-0 w-5 border-t-2" style={{ borderColor: C.minus }} />
            поле от първия проводник
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-0 w-5 border-t-2" style={{ borderColor: C.plus }} />
            поле от втория проводник
          </span>
          {cs.correct === "partial" && (
            <>
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="inline-block h-0 w-5 border-t-2 border-dashed"
                  style={{ borderColor: C.mut }}
                />
                компонента
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="inline-block h-1.5 w-5 rounded-full opacity-25"
                  style={{ backgroundColor: C.mut }}
                />
                избледнява = компенсира се
              </span>
            </>
          )}
        </div>
      )}

      <div className="mt-4">
        <PredictionQuestion
          prompt="Ще се съберат ли тези две магнитни полета, или ще се извадят?"
          resetToken={caseIdx}
          options={[
            { text: "Събират се — сочат в еднаква посока", correct: cs.correct === "add" },
            { text: "Частично се компенсират — остава ненулев резултат", correct: cs.correct === "partial" },
            { text: "Напълно се компенсират — $B=0$", correct: cs.correct === "cancel" },
          ]}
          explanation={cs.explanation}
          onAnswered={() => setRevealed(true)}
        />
      </div>

      {revealed && (
        <div className="mt-4 flex justify-end">
          <button className={BTN_PRI} onClick={next}>
            {caseIdx + 1 < CASES.length ? "Следващ случай →" : "Отначало ↻"}
          </button>
        </div>
      )}
    </div>
  );
}
