"use client";

import { useState } from "react";
import PredictionQuestion from "./PredictionQuestion";
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
      "Двете полета имат равни големини (P е на равни разстояния), но полето на левия проводник в P сочи нагоре, а на десния — надолу (проверете с дясната ръка). Равни и противоположни → **пълно компенсиране**: B = 0.",
  },
  {
    title: "Противоположни токове, P по средата",
    out1: true,
    out2: false,
    p: { x: 320, y: 190 },
    correct: "add",
    explanation:
      "Сега десният ток е обърнат, затова и полето му в P се обръща: и dB₁, и dB₂ сочат нагоре. Еднопосочни → **събират се**: B = 2·B₁. Забележете: геометрията е същата, само посоката на единия ток се смени!",
  },
  {
    title: "Еднакви токове, P над средата",
    out1: true,
    out2: true,
    p: { x: 320, y: 70 },
    correct: "partial",
    explanation:
      "Всяко поле е перпендикулярно на своя r-вектор, затова двата вектора сочат под ъгъл — единият нагоре-наляво, другият надолу-наляво. Вертикалните компоненти се съкращават, хоризонталните се събират → **частично компенсиране**: остава хоризонтален резултат.",
  },
  {
    title: "Еднакви токове, P по-близо до левия",
    out1: true,
    out2: true,
    p: { x: 260, y: 190 },
    correct: "partial",
    explanation:
      "Посоките пак са противоположни (нагоре и надолу), но P е по-близо до левия проводник, затова |dB₁| > |dB₂| (полето отслабва като 1/r). Изваждат се, но не докрай → **частично компенсиране**: остава поле нагоре.",
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

        {/* Геометрията: два проводника в напречен разрез + P */}
        <CurrentSymbol x={W1.x} y={W1.y} out={cs.out1} r={15} color={C.warn} label={`I₁ ${cs.out1 ? "⊙" : "⊗"}`} />
        <CurrentSymbol x={W2.x} y={W2.y} out={cs.out2} r={15} color={C.warn} label={`I₂ ${cs.out2 ? "⊙" : "⊗"}`} />
        <line x1={W1.x} y1={W1.y} x2={cs.p.x} y2={cs.p.y} stroke={C.faint} strokeWidth={1.3} strokeDasharray="4 4" />
        <line x1={W2.x} y1={W2.y} x2={cs.p.x} y2={cs.p.y} stroke={C.faint} strokeWidth={1.3} strokeDasharray="4 4" />
        <circle cx={cs.p.x} cy={cs.p.y} r={5} fill={C.wire} />
        <text x={cs.p.x + 10} y={cs.p.y - 8} fill={C.wire} fontSize={14} fontWeight={700}>
          P
        </text>

        {/* Векторите — само след отговор */}
        {revealed && (
          <g>
            <Arrow
              x1={cs.p.x}
              y1={cs.p.y}
              x2={cs.p.x + b1.x * scale}
              y2={cs.p.y + b1.y * scale}
              color={C.minus}
              label="dB₁"
              animate
            />
            <Arrow
              x1={cs.p.x}
              y1={cs.p.y}
              x2={cs.p.x + b2.x * scale}
              y2={cs.p.y + b2.y * scale}
              color={C.plus}
              label="dB₂"
              labelDy={16}
              animate
            />
            {sumIsZero ? (
              <text x={cs.p.x + 14} y={cs.p.y + 26} fill={C.ok} fontSize={15} fontWeight={700} className="animate-rise">
                B = 0
              </text>
            ) : (
              <Arrow
                x1={cs.p.x}
                y1={cs.p.y}
                x2={cs.p.x + bSum.x * scale}
                y2={cs.p.y + bSum.y * scale}
                color={C.ok}
                width={3.5}
                label="B рез."
                labelDy={-8}
                animate
              />
            )}
          </g>
        )}
      </svg>

      <div className="mt-4">
        <PredictionQuestion
          prompt="Ще се съберат ли тези две магнитни полета, или ще се извадят?"
          resetToken={caseIdx}
          options={[
            { text: "Събират се — сочат в еднаква посока", correct: cs.correct === "add" },
            { text: "Частично се компенсират — остава ненулев резултат", correct: cs.correct === "partial" },
            { text: "Напълно се компенсират — B = 0", correct: cs.correct === "cancel" },
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
