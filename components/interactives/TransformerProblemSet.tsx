"use client";

import GuidedProblem from "./GuidedProblem";
import { TRANSFORMER_PROBLEMS } from "./transformerProblems";

export default function TransformerProblemSet() {
  return (
    <div className="space-y-6">
      {TRANSFORMER_PROBLEMS.map((problem, i) => (
        <GuidedProblem key={problem.title} index={i + 1} data={problem} />
      ))}
    </div>
  );
}
