"use client";

import GuidedProblem from "./GuidedProblem";
import { capacitorProblems } from "./capacitorProblems";

export default function CapacitorProblemSet() {
  return (
    <div className="space-y-6">
      {capacitorProblems.map((problem, index) => (
        <GuidedProblem key={problem.title} index={index + 1} data={problem} />
      ))}
    </div>
  );
}
