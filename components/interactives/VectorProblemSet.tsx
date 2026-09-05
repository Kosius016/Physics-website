"use client";

import GuidedProblem from "./GuidedProblem";
import { vectorProblems } from "./vectorProblems";

export default function VectorProblemSet() {
  return <div className="space-y-6">{vectorProblems.map((data, i) => <GuidedProblem key={data.title} index={i + 1} data={data} />)}</div>;
}
