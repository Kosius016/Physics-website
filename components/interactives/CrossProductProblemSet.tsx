"use client";

import GuidedProblem from "./GuidedProblem";
import { crossProductProblems } from "./crossProductProblems";

/** Клиентска обвивка на водените задачи от урока за векторно произведение. */
export default function CrossProductProblemSet() {
  return (
    <div className="space-y-6">
      {crossProductProblems.map((p, i) => (
        <GuidedProblem key={p.title} index={i + 1} data={p} />
      ))}
    </div>
  );
}
