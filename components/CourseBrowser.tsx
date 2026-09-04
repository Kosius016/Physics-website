import Link from "next/link";
import { getCourseMap, type Level, type Subject } from "@/lib/courseMaps";

/**
 * Course map за предмета и нивото от URL-а: раздели с номерирани списъци от уроци.
 */
export default function CourseBrowser({
  level = "11. клас",
  subject = "Физика",
}: {
  level?: Level;
  subject?: Subject;
}) {
  const sections = getCourseMap(subject, level);

  return (
    <div className="mx-auto max-w-3xl px-5 pb-24 pt-10">
      <div>
        {sections.length === 0 ? (
          <div className="rounded-[10px] border-[1.5px] border-dashed border-rule bg-surface px-6 py-14 text-center text-[15px] text-muted">
            Съдържанието за {subject}, {level} се подготвя.
          </div>
        ) : (
          sections.map((section, si) => (
            <section
              key={section.title}
              id={
                section.title === "Механика · Кинематика"
                  ? "kinematics"
                  : section.title === "Електричество"
                    ? "electricity"
                    : section.title === "Магнетизъм"
                      ? "magnetism"
                      : section.title === "Променлив ток"
                        ? "ac"
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
