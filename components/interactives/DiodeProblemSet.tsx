"use client";

import GuidedProblem from "./GuidedProblem";
import { diodeProblems } from "./diodeProblems";

export default function DiodeProblemSet() {
  return (
    <div className="space-y-8">
      {diodeProblems.map((problem, i) => (
        <GuidedProblem key={problem.title} index={i + 1} data={problem} />
      ))}
    </div>
  );
}
