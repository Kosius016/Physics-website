"use client";

import GuidedProblem from "./GuidedProblem";
import { bioSavartProblems } from "./bioSavartProblems";

/**
 * Клиентска обвивка на осемте водени задачи: фигурите са функции (phase) → JSX
 * и не могат да се подават от сървърен към клиентски компонент, затова
 * списъкът се рендва изцяло от клиентската страна.
 */
export default function BioSavartProblemSet() {
  return (
    <div className="space-y-6">
      {bioSavartProblems.map((p, i) => (
        <GuidedProblem key={p.title} index={i + 1} data={p} />
      ))}
    </div>
  );
}
