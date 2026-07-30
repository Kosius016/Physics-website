"use client";

import GuidedProblem from "./GuidedProblem";
import { conductorProblems } from "./conductorProblems";

/**
 * Клиентска обвивка: `figure` е функция и не може да мине през границата
 * сървър → клиент, затова страницата на урока остава сървърен компонент,
 * а задачите се монтират оттук.
 */
export default function ConductorProblemSet() {
  return (
    <div className="space-y-6">
      {conductorProblems.map((problem, index) => (
        <GuidedProblem key={problem.title} index={index + 1} data={problem} />
      ))}
    </div>
  );
}
