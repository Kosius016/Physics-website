"use client";

import { useEffect, useState } from "react";
import RichText from "@/components/RichText";
import type { QuizQuestion } from "@/lib/types";

function shuffledQuestions(questions: QuizQuestion[]): QuizQuestion[] {
  return questions.map((question) => {
    const options = [...question.options];
    for (let i = options.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return { ...question, options };
  });
}

/**
 * Quiz с моментална обратна връзка: клик върху опция заключва въпроса,
 * оцветява верния отговор (и грешния, ако е избран) и обновява резултата.
 */
export default function Quiz({ questions }: { questions: QuizQuestion[] }) {
  const [displayQuestions, setDisplayQuestions] = useState<QuizQuestion[] | null>(null);
  // Индекс на избраната опция за всеки въпрос; null = още неотговорен.
  const [picked, setPicked] = useState<(number | null)[]>(() => questions.map(() => null));

  useEffect(() => {
    setDisplayQuestions(shuffledQuestions(questions));
    setPicked(questions.map(() => null));
  }, [questions]);

  if (!displayQuestions) {
    return (
      <div
        className="rounded-[10px] border-[1.5px] border-rule bg-surface px-4 py-5 text-[14px] text-muted"
        aria-busy="true"
      >
        Разбъркваме вариантите…
      </div>
    );
  }

  const answered = picked.filter((p) => p !== null).length;
  const correctCount = picked.filter(
    (p, qi) => p !== null && displayQuestions[qi].options[p].correct,
  ).length;

  return (
    <div className="flex flex-col gap-7">
      {displayQuestions.map((q, qi) => {
        const pickedIdx = picked[qi];
        const locked = pickedIdx !== null;
        const pickedCorrect = locked ? q.options[pickedIdx].correct : false;
        return (
          <div key={qi}>
            <p className="mb-3 font-semibold text-ink">
              {qi + 1}. <RichText text={q.question} />
            </p>
            <div className="flex flex-col gap-2.5">
              {q.options.map((opt, oi) => {
                let cls =
                  "rounded-[10px] border-[1.5px] px-4 py-2.5 text-left text-[15px] transition-all ";
                if (!locked) {
                  cls +=
                    "cursor-pointer border-rule bg-surface text-ink shadow-hard-sm hover:border-ink active:translate-x-px active:translate-y-px active:shadow-none";
                } else if (opt.correct) {
                  cls += "border-ok bg-ok/10 font-semibold text-ink";
                } else if (pickedIdx === oi) {
                  cls += "border-plus bg-plus/10 text-ink";
                } else {
                  cls += "border-rule bg-surface text-muted";
                }
                return (
                  <button
                    key={oi}
                    disabled={locked}
                    onClick={() =>
                      setPicked((prev) => prev.map((p, i) => (i === qi ? oi : p)))
                    }
                    className={cls}
                  >
                    <RichText text={opt.text} />
                  </button>
                );
              })}
            </div>
            {locked && (q.explanation || q.options.some((o) => o.why)) && (
              <div
                className={`mt-3 rounded-r-lg border-l-4 px-4 py-3 text-[14.5px] leading-relaxed animate-rise ${
                  pickedCorrect ? "border-ok bg-ok/10" : "border-plus bg-plus/10"
                }`}
                role="status"
              >
                <p>
                  <strong className={pickedCorrect ? "text-ok" : "text-plus"}>
                    {pickedCorrect ? "Вярно. " : "Не съвсем. "}
                  </strong>
                  {q.options[pickedIdx].why && <RichText text={q.options[pickedIdx].why} />}
                </p>
                {!pickedCorrect && q.options.find((o) => o.correct)?.why && (
                  <p className="mt-2">
                    <strong className="text-ok">Верният отговор: </strong>
                    <RichText text={q.options.find((o) => o.correct)!.why!} />
                  </p>
                )}
                {q.explanation && (
                  <p className="mt-2">
                    <RichText text={q.explanation} />
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}

      {answered > 0 && (
        <p className="rounded-r-lg border-l-4 border-minus bg-hl px-4 py-2.5 text-[15px]">
          Резултат:{" "}
          <span className="font-bold tabular-nums text-ink">
            {correctCount} / {answered}
          </span>{" "}
          верни от отговорените ({questions.length} общо въпроса).
        </p>
      )}
    </div>
  );
}
