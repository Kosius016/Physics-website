"use client";

import Link from "next/link";
import { useState } from "react";
import {
  getCourseMap,
  LEVELS,
  SUBJECTS,
  type Level,
  type Subject,
} from "@/lib/courseMaps";

function Pill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        active
          ? "cursor-pointer rounded-full border-[1.5px] border-ink bg-ink px-4 py-1.5 text-[13.5px] font-bold text-white shadow-hard-sm"
          : "cursor-pointer rounded-full border-[1.5px] border-ink bg-surface px-4 py-1.5 text-[13.5px] font-semibold text-ink transition-colors hover:bg-hl active:translate-x-px active:translate-y-px"
      }
    >
      {label}
    </button>
  );
}

/**
 * Филтри предмет/ниво + course map: раздели с номерирани списъци от уроци.
 */
export default function CourseBrowser({
  initialLevel = "11. клас",
  initialSubject = "Физика",
}: {
  initialLevel?: Level;
  initialSubject?: Subject;
}) {
  const [subject, setSubject] = useState<Subject>(initialSubject);
  const [level, setLevel] = useState<Level>(initialLevel);

  const sections = getCourseMap(subject, level);

  return (
    <div className="mx-auto max-w-3xl px-5 pb-24">
      {/* Ред с pill филтри */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 py-6">
        <div className="flex items-center gap-2">
          <span className="mr-1 text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
            Предмет
          </span>
          {SUBJECTS.map((s) => (
            <Pill key={s} label={s} active={subject === s} onClick={() => setSubject(s)} />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="mr-1 text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
            Ниво
          </span>
          {LEVELS.map((l) => (
            <Pill key={l} label={l} active={level === l} onClick={() => setLevel(l)} />
          ))}
        </div>
      </div>

      {/* Course map */}
      <div className="pt-2">
        {sections.length === 0 ? (
          <div className="rounded-[10px] border-[1.5px] border-dashed border-rule bg-surface px-6 py-14 text-center text-[15px] text-muted">
            Съдържанието за {subject}, {level} се подготвя.
          </div>
        ) : (
          sections.map((section, si) => (
            <section
              key={section.title}
              id={
                section.title === "Електричество"
                  ? "electricity"
                  : section.title === "Магнетизъм"
                    ? "magnetism"
                    : section.title === "Линейна алгебра"
                      ? "linear-algebra"
                      : undefined
              }
              className="mb-10 scroll-mt-24"
            >
              <h2 className="mb-4 border-b-2 border-ink pb-1.5 font-serif text-[24px] font-bold text-ink">
                <span className="mr-2 align-[0.15em] text-[0.65em] tracking-[0.1em] text-muted">
                  §{si + 1}
                </span>
                {section.title}
              </h2>
              <ol className="divide-y-[1.5px] divide-rule overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-surface shadow-hard">
                {section.lessons.map((lesson) => (
                  <li key={lesson.number}>
                    {lesson.href ? (
                      <Link
                        href={lesson.href}
                        className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-hl"
                      >
                        <span className="w-9 shrink-0 text-[15px] font-bold tabular-nums text-minus">
                          {lesson.number}
                        </span>
                        <span className="flex-1 text-[16px] font-semibold text-ink">
                          {lesson.title}
                        </span>
                        <span className="font-bold text-ink opacity-0 transition-opacity group-hover:opacity-100">
                          →
                        </span>
                      </Link>
                    ) : (
                      <div className="flex items-center gap-4 px-5 py-4">
                        <span className="w-9 shrink-0 text-[15px] font-bold tabular-nums text-rule">
                          {lesson.number}
                        </span>
                        <span className="flex-1 text-[16px] text-muted">{lesson.title}</span>
                        <span className="rounded-full border-[1.5px] border-rule px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-muted">
                          Скоро
                        </span>
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
