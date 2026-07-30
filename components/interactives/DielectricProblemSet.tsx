"use client";

import GuidedProblem from "./GuidedProblem";
import { dielectricProblems } from "./dielectricProblems";

export default function DielectricProblemSet() {
  return (
    <div className="space-y-6">
      {dielectricProblems.map((problem, index) => (
        <GuidedProblem key={problem.title} index={index + 1} data={problem} />
      ))}
    </div>
  );
}
