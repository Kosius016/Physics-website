"use client";

import GuidedProblem from "./GuidedProblem";
import { lorentzProblems } from "./lorentzProblems";

export default function LorentzProblemSet() {
  return <div className="space-y-6">{lorentzProblems.map((problem,i)=><GuidedProblem key={problem.title} index={i+1} data={problem}/>)}</div>;
}
