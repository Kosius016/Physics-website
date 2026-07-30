"use client";

import { useEffect, useRef, useState } from "react";
import RichText from "@/components/RichText";
import type { RichTextString } from "@/lib/types";

export interface PredictionOption {
  text: string;
  correct: boolean;
  /**
   * Защо точно тази опция е вярна или грешна. Показва се, когато ученикът я
   * избере, и когато тя е верният отговор, а той е посочил друго.
   */
  why?: RichTextString;
}

function shuffled(options: PredictionOption[]): PredictionOption[] {
  const next = [...options];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

/**
 * Въпрос „първо предскажи, после виж“ — опциите изглеждат точно като в Quiz.
 * След отговор се заключва, оцветява вярно/грешно и обяснява избора.
 *
 * Редът на опциите се разбърква при монтиране (както в Quiz), за да не се
 * познава отговорът по позиция. Разбъркването е в useEffect, а не при
 * рендването, защото сървърният и клиентският ред иначе биха се разминали.
 *
 * `resetToken` смяна отвън нулира въпроса (напр. при промяна на геометрията).
 */
export default function PredictionQuestion({
  prompt,
  options,
  explanation,
  resetToken = 0,
  onAnswered,
}: {
  prompt: string;
  options: PredictionOption[];
  explanation?: RichTextString;
  resetToken?: number | string;
  onAnswered?: (correct: boolean) => void;
}) {
  const [shownOptions, setShownOptions] = useState<PredictionOption[] | null>(null);
  const [picked, setPicked] = useState<number | null>(null);

  /**
   * `options` идва като inline масив, тоест е нова референция при всеки render
   * на родителя. Ако беше в зависимостите, всеки render на GuidedProblem щеше
   * да разбърква наново и да отключва вече отговорен въпрос.
   */
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    setShownOptions(shuffled(optionsRef.current));
    setPicked(null);
  }, [resetToken]);

  if (!shownOptions) {
    return (
      <div>
        <p className="mb-3 font-semibold text-ink">
          <RichText text={prompt} />
        </p>
        <div
          className="rounded-[10px] border-[1.5px] border-rule bg-surface px-4 py-5 text-[14px] text-muted"
          aria-busy="true"
        >
          Разбъркваме вариантите…
        </div>
      </div>
    );
  }

  const locked = picked !== null;
  const pickedOption = locked ? shownOptions[picked] : null;
  const isCorrect = pickedOption?.correct ?? false;
  const correctOption = shownOptions.find((option) => option.correct);

  return (
    <div>
      <p className="mb-3 font-semibold text-ink">
        <RichText text={prompt} />
      </p>
      <div className="flex flex-col gap-2.5">
        {shownOptions.map((opt, oi) => {
          let cls = "rounded-[10px] border-[1.5px] px-4 py-2.5 text-left text-[15px] transition-all ";
          if (!locked) {
            cls +=
              "cursor-pointer border-rule bg-surface text-ink shadow-hard-sm hover:border-ink active:translate-x-px active:translate-y-px active:shadow-none";
          } else if (opt.correct) {
            cls += "border-ok bg-ok/10 font-semibold text-ink";
          } else if (picked === oi) {
            cls += "border-plus bg-plus/10 text-ink";
          } else {
            cls += "border-rule bg-surface text-muted";
          }
          return (
            <button
              key={oi}
              disabled={locked}
              onClick={() => {
                setPicked(oi);
                onAnswered?.(opt.correct);
              }}
              className={cls}
            >
              <RichText text={opt.text} />
            </button>
          );
        })}
      </div>
      {locked && (
        <div
          className={`mt-3 rounded-r-lg border-l-4 px-4 py-3 text-[15px] leading-relaxed animate-rise ${
            isCorrect ? "border-ok bg-ok/10" : "border-plus bg-plus/10"
          }`}
          role="status"
        >
          <p>
            <strong className={isCorrect ? "text-ok" : "text-plus"}>
              {isCorrect ? "Вярно. " : "Не съвсем. "}
            </strong>
            {pickedOption?.why && <RichText text={pickedOption.why} />}
          </p>
          {!isCorrect && correctOption?.why && (
            <p className="mt-2">
              <strong className="text-ok">Верният отговор: </strong>
              <RichText text={correctOption.why} />
            </p>
          )}
          {explanation && (
            <p className={pickedOption?.why || (!isCorrect && correctOption?.why) ? "mt-2" : ""}>
              <RichText text={explanation} />
            </p>
          )}
        </div>
      )}
    </div>
  );
}
