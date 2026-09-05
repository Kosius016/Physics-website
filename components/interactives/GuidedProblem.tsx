"use client";

import { useState, type ReactNode } from "react";
import Formula from "@/components/Formula";
import RichText from "@/components/RichText";
import type { RichTextString } from "@/lib/types";
import PredictionQuestion, { type PredictionOption } from "./PredictionQuestion";
import { TeacherNote } from "./TeacherMode";
import { BTN_SEC, STAGE_BG, STAGE_CLASS } from "./svg";

/**
 * Водена задача: интерактивна фигура + задължителният педагогически ред:
 *   1) "Каква ще бъде посоката на всяко dB?"    (въпрос преди всичко)
 *   2) "Ще се събират или ще се компенсират?"   (появява се след 1)
 *   3) Решение стъпка по стъпка                  (отключва се след 2)
 * Фигурата получава phase (0/1/2/3) и достроява полето с всяка фаза —
 * геометрия → dB вектори → резултат → финална стойност.
 * Преизползваем за всякакви уроци: всичко идва от props.
 */

export interface GuidedQuestion {
  prompt: string;
  options: PredictionOption[];
  explanation: RichTextString;
}

export interface SolutionStep {
  text: RichTextString;
  latex?: string;
}

export interface GuidedProblemData {
  title: string;
  statement: RichTextString;
  /** Фигурата по фаза: 0 геометрия, 1 след Q1 (dB), 2 след Q2 (резултат), 3 след всички стъпки. */
  figure: (phase: number) => ReactNode;
  /** Кратко обяснение под фигурата; прозата остава извън SVG сцената. */
  figureCaption?: (phase: number) => RichTextString | undefined;
  /** viewBox височина на фигурата (ширината е винаги 480). */
  figureHeight?: number;
  directionQuestion: GuidedQuestion;
  additionQuestion: GuidedQuestion;
  hints: RichTextString[];
  steps: SolutionStep[];
  teacherNotes: RichTextString[];
}

export default function GuidedProblem({ index, data }: { index: number; data: GuidedProblemData }) {
  const [q1Done, setQ1Done] = useState(false);
  const [q2Done, setQ2Done] = useState(false);
  const [shownSteps, setShownSteps] = useState(0);

  const allSteps = shownSteps >= data.steps.length;
  const phase = (q1Done ? 1 : 0) + (q2Done ? 1 : 0) + (q2Done && allSteps ? 1 : 0);

  return (
    <div className="rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4">
      <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-plus">
        Задача {index}
      </span>
      <p className="mt-1.5 text-ink/90">
        <RichText text={data.statement} />
      </p>

      {/* Интерактивната фигура (тъмна сцена, достроява се по фазите) */}
      <svg
        viewBox={`0 0 480 ${data.figureHeight ?? 300}`}
        className={STAGE_CLASS + " mt-4 select-none"}
        role="img"
        aria-label={data.title}
      >
        <rect width={480} height={data.figureHeight ?? 300} fill={STAGE_BG} />
        {data.figure(phase)}
      </svg>
      {data.figureCaption?.(phase) && (
        <p aria-live="polite" className="mt-2 text-[13.5px] leading-relaxed text-muted">
          <RichText text={data.figureCaption(phase) ?? ""} />
        </p>
      )}

      {/* Подсказки */}
      {data.hints.length > 0 && (
        <div className="mt-3 space-y-2">
          {data.hints.map((h, i) => (
            <details key={i} className="rounded-[8px] border-[1.5px] border-rule px-4 py-2.5 open:border-ink">
              <summary className="cursor-pointer text-[14.5px] font-semibold text-ink select-none">
                Подсказка {data.hints.length > 1 ? i + 1 : ""}
              </summary>
              <p className="mt-2 border-t-[1.5px] border-dashed border-rule pt-2 text-[15px] text-ink/90">
                <RichText text={h} />
              </p>
            </details>
          ))}
        </div>
      )}

      {/* 1) Посоката — винаги първи */}
      <div className="mt-4">
        <PredictionQuestion
          prompt={data.directionQuestion.prompt}
          options={data.directionQuestion.options}
          explanation={data.directionQuestion.explanation}
          onAnswered={() => setQ1Done(true)}
        />
      </div>

      {/* 2) Събиране/компенсиране — след 1 */}
      {q1Done && (
        <div className="mt-4 animate-rise">
          <PredictionQuestion
            prompt={data.additionQuestion.prompt}
            options={data.additionQuestion.options}
            explanation={data.additionQuestion.explanation}
            onAnswered={() => setQ2Done(true)}
          />
        </div>
      )}

      {/* 3) Чак сега математиката */}
      {q2Done && (
        <div className="mt-5 space-y-4 border-t-[1.5px] border-dashed border-rule pt-4 animate-rise">
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-minus">
            Решение стъпка по стъпка
          </span>
          {data.steps.slice(0, shownSteps).map((s, i) => (
            <div key={i} className="space-y-2 animate-rise">
              <p className="text-[15.5px] text-ink/90">
                <span className="mr-2 text-[12px] font-bold uppercase tracking-wide text-muted">
                  Стъпка {i + 1}
                </span>
                <RichText text={s.text} />
              </p>
              {s.latex && <Formula latex={s.latex} />}
            </div>
          ))}
          {!allSteps && (
            <button className={BTN_SEC} onClick={() => setShownSteps((s) => s + 1)}>
              {shownSteps === 0 ? "Първа стъпка" : "Следваща стъпка →"}
            </button>
          )}
        </div>
      )}

      {/* Методически бележки — само в режим преподавател */}
      <TeacherNote title="Методически бележки: чести грешки">
        <ul className="list-disc space-y-1.5 pl-5">
          {data.teacherNotes.map((n, i) => (
            <li key={i}>
              <RichText text={n} />
            </li>
          ))}
        </ul>
      </TeacherNote>
    </div>
  );
}
