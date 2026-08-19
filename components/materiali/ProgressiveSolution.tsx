"use client";

import { Children, useState, type ReactNode } from "react";

export default function ProgressiveSolution({
  hint,
  /**
   * Показва цялото решение наведнъж при отваряне, без бутона за следваща
   * стъпка. Отключването стъпка по стъпка остава по подразбиране.
   */
  revealAll = false,
  children,
}: {
  hint: ReactNode;
  revealAll?: boolean;
  children: ReactNode;
}) {
  const steps = Children.toArray(children);
  const [hintOpen, setHintOpen] = useState(false);
  const [solutionOpen, setSolutionOpen] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const shownSteps = revealAll ? steps.length : Math.min(visibleSteps, steps.length);
  const allVisible = shownSteps >= steps.length;

  function toggleSolution() {
    const next = !solutionOpen;
    setSolutionOpen(next);
    if (next) setVisibleSteps((count) => Math.max(1, count));
  }

  return (
    <div className="mt-6 space-y-3">
      <div className="overflow-hidden rounded-[10px] border-[1.5px] border-rule bg-hl shadow-hard-sm">
        <button
          type="button"
          aria-expanded={hintOpen}
          onClick={() => setHintOpen((open) => !open)}
          className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left text-[15px] font-bold text-ink"
        >
          <span aria-hidden="true" className={`text-[12px] transition-transform ${hintOpen ? "rotate-90" : ""}`}>
            ▶
          </span>
          {hintOpen ? "Скрий указанието" : "Покажи указание"}
        </button>
        {hintOpen ? (
          <div className="border-t-[1.5px] border-rule bg-surface px-4 py-3 text-[14.5px] leading-relaxed text-ink/90 animate-rise">
            {hint}
          </div>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-surface shadow-hard-sm">
        <button
          type="button"
          aria-expanded={solutionOpen}
          onClick={toggleSolution}
          className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left text-[15px] font-bold text-minus"
        >
          <span aria-hidden="true" className={`text-[12px] transition-transform ${solutionOpen ? "rotate-90" : ""}`}>
            ▶
          </span>
          {solutionOpen ? "Скрий решението" : "Покажи решението"}
        </button>

        {solutionOpen ? (
          <div className="border-t-[1.5px] border-ink px-4 py-5 sm:px-5 animate-rise">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b-[1.5px] border-dashed border-rule pb-2">
              <p className="text-[11px] font-bold uppercase tracking-[.17em] text-minus">
                Решение стъпка по стъпка
              </p>
              <p className="text-[12px] font-bold tabular-nums text-muted" aria-live="polite">
                {revealAll ? `${steps.length} стъпки` : `${shownSteps} от ${steps.length} стъпки`}
              </p>
            </div>

            <div className="space-y-8">{steps.slice(0, shownSteps)}</div>

            {!allVisible && !revealAll ? (
              <button
                type="button"
                onClick={() => setVisibleSteps((count) => Math.min(steps.length, count + 1))}
                className="mt-6 cursor-pointer rounded-lg border-[1.5px] border-ink bg-hl px-4 py-2 text-[13.5px] font-bold text-ink shadow-hard-sm active:translate-x-px active:translate-y-px active:shadow-none"
              >
                Следваща стъпка →
              </button>
            ) : revealAll ? null : (
              <p className="mt-6 rounded-r-lg border-l-4 border-ok bg-ok/10 px-4 py-3 text-[14px] font-semibold text-ink animate-rise">
                Пълното решение е отключено.
              </p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
