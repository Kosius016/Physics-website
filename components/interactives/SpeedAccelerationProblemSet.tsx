"use client";

import GuidedProblem from "./GuidedProblem";
import { speedAccelerationProblems } from "./speedAccelerationProblems";
import { speedAccelerationExtraProblems } from "./speedAccelerationExtraProblems";

const problems = [...speedAccelerationProblems, ...speedAccelerationExtraProblems];

export default function SpeedAccelerationProblemSet() {
  return <div className="my-6 space-y-6">{problems.map((data, index) => <GuidedProblem key={data.title} index={index + 1} data={data} />)}</div>;
}
