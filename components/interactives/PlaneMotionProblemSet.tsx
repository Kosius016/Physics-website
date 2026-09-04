"use client";

import GuidedProblem from "./GuidedProblem";
import { planeMotionProblems } from "./planeMotionProblems";

/**
 * Клиентска обвивка на водените задачи към урока за движение в равнина:
 * фигурите са функции (phase) → JSX и не могат да се подават от сървърен
 * към клиентски компонент, затова списъкът се рендва от клиентската страна.
 */
export default function PlaneMotionProblemSet() {
  return (
    <div className="space-y-6">
      {planeMotionProblems.map((p, i) => (
        <GuidedProblem key={p.title} index={i + 1} data={p} />
      ))}
    </div>
  );
}
