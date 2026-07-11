import type { Lesson } from "@/lib/types";
import RichText from "./RichText";
import Formula from "./Formula";
import LessonNav from "./LessonNav";
import Quiz from "./Quiz";
import Section from "./Section";
import SimulationHost from "./simulations/SimulationHost";

const SECTION_NAV = [
  { id: "motivation", n: "§1", label: "Мотивация" },
  { id: "intuition", n: "§2", label: "Интуиция" },
  { id: "math", n: "§3", label: "Математика" },
  { id: "simulation", n: "§4", label: "Симулация" },
  { id: "examples", n: "§5", label: "Примери" },
  { id: "problems", n: "§6", label: "Задачи" },
  { id: "check", n: "§7", label: "Проверка" },
] as const;

export default function LessonRenderer({ lesson }: { lesson: Lesson }) {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-24">
      {/* Заглавие */}
      <header className="pt-11 pb-2">
        <span className="text-[12px] font-semibold uppercase tracking-[0.22em] text-muted">
          {lesson.kicker}
        </span>
        <h1 className="mt-2 mb-2 font-serif text-[clamp(34px,7vw,48px)] leading-[1.08] font-bold text-ink">
          {lesson.title}
        </h1>
        {lesson.subtitle && <p className="text-[17px] text-muted">{lesson.subtitle}</p>}
      </header>

      {/* Навигация с котви към секциите */}
      <LessonNav items={SECTION_NAV} />

      {/* §1 Мотивация */}
      <Section id="motivation" n="§1" title="Мотивация">
        <div className="space-y-3">
          {lesson.motivation.paragraphs.map((p, i) => (
            <p key={i} className={i === 0 ? "text-[18px] text-ink" : "text-ink/90"}>
              <RichText text={p} />
            </p>
          ))}
        </div>
      </Section>

      {/* §2 Интуиция */}
      <Section id="intuition" n="§2" title="Интуиция">
        <div className="space-y-3">
          {lesson.intuition.paragraphs.map((p, i) => (
            <p key={i} className={i === 0 ? "text-[18px] text-ink" : "text-ink/90"}>
              <RichText text={p} />
            </p>
          ))}
        </div>

        {lesson.intuition.callout && (
          <div className="mt-5 rounded-r-lg border-l-4 border-plus bg-hl px-4 py-3 text-[15.5px] leading-relaxed">
            {lesson.intuition.callout.title && (
              <strong className="text-ink">{lesson.intuition.callout.title}. </strong>
            )}
            <RichText text={lesson.intuition.callout.text} />
          </div>
        )}

        {lesson.intuition.figure && (
          <figure className="mt-6 flex flex-wrap items-center gap-6 rounded-[10px] border-[1.5px] border-ink bg-surface p-5 shadow-hard">
            <div
              className="shrink-0"
              dangerouslySetInnerHTML={{ __html: lesson.intuition.figure.svg }}
            />
            {lesson.intuition.figure.caption && (
              <figcaption className="min-w-[220px] flex-1 text-[15px] leading-relaxed text-muted">
                <RichText text={lesson.intuition.figure.caption} />
              </figcaption>
            )}
          </figure>
        )}
      </Section>

      {/* §3 Математика */}
      <Section id="math" n="§3" title="Математика">
        <div className="space-y-4">
          {lesson.math.items.map((item, i) => (
            <div key={i} className="space-y-3">
              {item.text && (
                <p className="text-ink/90">
                  <RichText text={item.text} />
                </p>
              )}
              <Formula latex={item.latex} />
            </div>
          ))}
          {lesson.math.note && (
            <p className="text-ink/90">
              <RichText text={lesson.math.note} />
            </p>
          )}
        </div>
      </Section>

      {/* §4 Симулация */}
      <Section id="simulation" n="§4" title="Интерактивна симулация">
        {lesson.simulation.description && (
          <p className="mb-5 text-ink/90">
            <RichText text={lesson.simulation.description} />
          </p>
        )}
        <div className="rounded-xl border-[1.5px] border-ink bg-surface p-4 shadow-hard">
          <SimulationHost section={lesson.simulation} />
        </div>
      </Section>

      {/* §5 Примери */}
      <Section id="examples" n="§5" title="Решени примери">
        <div className="space-y-4">
          {lesson.examples.map((ex, i) => (
            <div key={i} className="rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-minus">
                {ex.title}
              </span>
              <p className="mt-1.5 text-ink/90">
                <RichText text={ex.problem} />
              </p>
              <details className="group mt-3 rounded-[8px] border-[1.5px] border-rule px-4 py-2.5 open:border-ink">
                <summary className="cursor-pointer text-[15px] font-semibold text-ink select-none">
                  <span className="group-open:hidden">Покажи решение</span>
                  <span className="hidden group-open:inline">Скрий решение</span>
                </summary>
                <div className="mt-2.5 space-y-2 border-t-[1.5px] border-dashed border-rule pt-2.5 text-[15.5px] leading-relaxed text-ink/90">
                  {ex.solution.map((line, li) => (
                    <p key={li}>
                      <RichText text={line} />
                    </p>
                  ))}
                </div>
              </details>
            </div>
          ))}
        </div>
      </Section>

      {/* §6 Задачи */}
      <Section id="problems" n="§6" title="Задачи за упражнение">
        <div className="space-y-4">
          {lesson.problems.map((pr, i) => (
            <div key={i} className="rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-plus">
                {pr.title}
              </span>
              <p className="mt-1.5 text-ink/90">
                <RichText text={pr.text} />
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* §7 Проверка */}
      <Section id="check" n="§7" title="Проверка на разбиране">
        <Quiz questions={lesson.check} />
      </Section>
    </main>
  );
}
