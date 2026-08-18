"use client";

import GuidedProblem from "./GuidedProblem";
import { acProblems } from "./acProblems";

export default function ACProblemSet() {
  return (
    <div className="space-y-6">
      {acProblems.map((problem, i) => (
        <GuidedProblem key={problem.title} index={i + 1} data={problem} />
      ))}
    </div>
  );
}
