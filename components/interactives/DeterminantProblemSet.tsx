"use client";

import GuidedProblem from "./GuidedProblem";
import { determinantProblems } from "./determinantProblems";

/** Клиентска обвивка на водените задачи от урока за детерминанти. */
export default function DeterminantProblemSet() {
  return (
    <div className="space-y-6">
      {determinantProblems.map((p, i) => (
        <GuidedProblem key={p.title} index={i + 1} data={p} />
      ))}
    </div>
  );
}
