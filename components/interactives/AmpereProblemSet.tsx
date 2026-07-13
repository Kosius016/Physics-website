"use client";

import GuidedProblem from "./GuidedProblem";
import { ampereProblems } from "./ampereProblems";

export default function AmpereProblemSet() {
  return <div className="space-y-6">{ampereProblems.map((problem, i) => <GuidedProblem key={problem.title} index={i + 1} data={problem} />)}</div>;
}
