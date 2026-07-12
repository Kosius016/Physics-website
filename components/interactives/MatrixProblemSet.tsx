"use client";

import GuidedProblem from "./GuidedProblem";
import { matrixProblems } from "./matrixProblems";

/** Клиентска обвивка на водените задачи от урока за матрици. */
export default function MatrixProblemSet() {
  return (
    <div className="space-y-6">
      {matrixProblems.map((p, i) => (
        <GuidedProblem key={p.title} index={i + 1} data={p} />
      ))}
    </div>
  );
}
