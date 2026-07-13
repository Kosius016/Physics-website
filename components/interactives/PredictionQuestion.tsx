"use client";

import { useEffect, useState } from "react";
import RichText from "@/components/RichText";
import type { RichTextString } from "@/lib/types";

export interface PredictionOption {
  text: string;
  correct: boolean;
}

/**
 * Въпрос "първо предскажи, после виж" — опциите изглеждат точно като в Quiz.
 * След отговор се заключва, оцветява вярно/грешно и показва обяснение.
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
  const [picked, setPicked] = useState<number | null>(null);

  useEffect(() => {
    setPicked(null);
  }, [resetToken]);

  const locked = picked !== null;

  return (
    <div>
      <p className="mb-3 font-semibold text-ink"><RichText text={prompt} /></p>
      <div className="flex flex-col gap-2.5">
        {options.map((opt, oi) => {
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
      {locked && explanation && (
        <div className="mt-3 rounded-r-lg border-l-4 border-minus bg-hl px-4 py-2.5 text-[15px] leading-relaxed animate-rise">
          <strong className="text-ink">Защо: </strong>
          <RichText text={explanation} />
        </div>
      )}
    </div>
  );
}
