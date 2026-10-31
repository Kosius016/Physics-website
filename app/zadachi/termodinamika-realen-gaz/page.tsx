import Link from "next/link";
import Formula from "@/components/Formula";
import LessonNav from "@/components/LessonNav";
import RichText from "@/components/RichText";
import Section from "@/components/Section";
import ProgressiveSolution from "@/components/materiali/ProgressiveSolution";
import { Prereq, ProblemStatement, ResultBox, SolutionPart } from "@/components/problem-sets/SolutionParts";
import {
  TeacherModeProvider,
  TeacherModeToggle,
  TeacherNote,
} from "@/components/interactives/TeacherMode";
import {
  realGasProblemGroups,
  realGasProblems,
  realGasSelfDerivations,
  type SolutionBlock,
} from "@/lib/problemSets/realGasThermodynamics";

export const metadata = {
  title: "Термодинамика на реалния газ: 12 задачи с решения · SingularityLab",
  description:
    "От разширителния съд на отоплението и гумения ластик до машината на Линде, термопомпата и хладилника в кухнята. Указания, решения стъпка по стъпка и пет упражнения за самостоятелен извод.",
};

const NAV = [
  ...realGasProblemGroups.map((group, index) => ({
    id: group.id,
    n: `§${index + 1}`,
    label: group.title,
  })),
  { id: "self", n: `§${realGasProblemGroups.length + 1}`, label: "Самостоятелни изводи" },
  { id: "recap", n: `§${realGasProblemGroups.length + 2}`, label: "Обобщение" },
];

function Blocks({ blocks }: { blocks: readonly SolutionBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => (
        <div key={index} className="space-y-3">
          {block.text ? (
            <p>
              <RichText text={block.text} />
            </p>
          ) : null}
          {block.latex ? <Formula latex={block.latex} /> : null}
          {block.bullets ? (
            <ul className="list-disc space-y-1.5 pl-5">
              {block.bullets.map((bullet) => (
                <li key={bullet}>
                  <RichText text={bullet} />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
    </>
  );
}

export default function RealGasProblemsPage() {
  return (
    <TeacherModeProvider>
      <main className="mx-auto max-w-3xl px-5 pb-24">
        <header className="pt-11 pb-2">
          <Link
            href="/materiali?subject=physics&level=university&type=zadachi"
            className="text-sm font-semibold text-minus hover:underline"
          >
            Материали / Физика / Задачи
          </Link>
          <p className="mt-7 text-xs font-bold uppercase tracking-[.2em] text-minus">
            Практика по термодинамика на реалния газ
          </p>
          <h1 className="mt-3 font-serif text-[clamp(34px,6.6vw,52px)] leading-[1.08] font-bold">
            Дванадесет задачи от ластика до хладилника
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Всяка задача използва връзка от раздела и завършва с поука. Първо опитайте сами, после
            отворете указанието; решението се разкрива стъпка по стъпка, за да можете да продължите от
            мястото, на което сте спрели.
          </p>
          <div className="my-6 rounded-xl border-[1.5px] border-ink bg-hl p-5">
            <p className="leading-relaxed">
              Задачи 1-3 се решават само с цикличното правило и едно съотношение на Максуел. Задачи
              4-8 изискват термодинамичното уравнение на състоянието и газа на Ван дер Ваалс. Задачи
              9-12 не изискват никакво уравнение на състоянието - само двата принципа.
            </p>
            <Link
              href="/physics/termodinamika-universitet"
              className="mt-3 inline-block font-semibold text-minus hover:underline"
            >
              Към уроците и означенията →
            </Link>
          </div>
          <p className="text-sm leading-relaxed text-muted">
            Навсякъде <RichText text={String.raw`$\nu$`} /> е моларният обем, а количеството вещество
            е <RichText text="$n$" />. Работата е <RichText text="$A$" />, а не{" "}
            <RichText text="$W$" />. Десетичният знак е запетая.
          </p>
        </header>

        <LessonNav items={NAV} right={<TeacherModeToggle />} />

        <TeacherNote>
          <p>
            За диагностика използвайте задачи 1, 12 и втората част на 2: те разкриват дали ученикът
            избира система, преди да пише първия принцип. За домашна работа изберете по една от всяка
            група, вместо всички от една.
          </p>
          <p>
            Задачи 4 и 7 образуват двойка: едната проверява константата{" "}
            <RichText text="$a$" /> срещу топлината на изпарение, другата - срещу границата на
            прегряване. Заедно показват докъде е верен моделът.
          </p>
        </TeacherNote>

        {realGasProblemGroups.map((group, groupIndex) => (
          <Section key={group.id} id={group.id} n={`§${groupIndex + 1}`} title={group.title}>
            <p className="mb-7 text-muted">
              <RichText text={group.intro} />
            </p>
            <div className="space-y-14">
              {realGasProblems
                .filter((problem) => problem.group === group.id)
                .map((problem) => (
                  <article key={problem.id} id={`zadacha-${problem.id}`} className="scroll-mt-24">
                    <h3 className="mb-4 font-serif text-[23px] font-bold leading-snug">
                      <span className="mb-1 block font-sans text-xs font-bold uppercase tracking-widest text-minus">
                        Задача {problem.id} · {group.title}
                      </span>
                      <RichText text={problem.title} />
                    </h3>

                    <ProblemStatement>
                      {problem.intro.map((paragraph) => (
                        <p key={paragraph}>
                          <RichText text={paragraph} />
                        </p>
                      ))}
                      {problem.parts ? (
                        <ol className="list-[bulgarian-alpha] space-y-1.5 pl-6">
                          {problem.parts.map((part) => (
                            <li key={part}>
                              <RichText text={part} />
                            </li>
                          ))}
                        </ol>
                      ) : null}
                      {problem.given ? (
                        <p className="rounded-[8px] border border-rule bg-hl/60 px-3.5 py-2.5 text-[14.5px]">
                          <span className="mr-1.5 text-[11px] font-bold uppercase tracking-[.14em] text-muted">
                            Дадено
                          </span>
                          <RichText text={problem.given} />
                        </p>
                      ) : null}
                    </ProblemStatement>

                    {problem.prereq ? <Prereq links={problem.prereq} /> : null}

                    <ProgressiveSolution hint={<RichText text={problem.hint} />}>
                      {[
                        ...problem.steps.map((step) => (
                          <SolutionPart key={step.label} label={step.label} title={step.title}>
                            <Blocks blocks={step.blocks} />
                          </SolutionPart>
                        )),
                        <div key="takeaway" className="grid gap-3 sm:grid-cols-[2.5rem_1fr]">
                          <div aria-hidden="true" className="hidden sm:block" />
                          <ResultBox>
                            <span className="mr-1.5 text-[11px] font-bold uppercase tracking-[.14em] text-ok">
                              Поука
                            </span>
                            <RichText text={problem.takeaway} />
                          </ResultBox>
                        </div>,
                      ]}
                    </ProgressiveSolution>
                  </article>
                ))}
            </div>
          </Section>
        ))}

        <Section id="self" n={`§${realGasProblemGroups.length + 1}`} title="Упражнения за самостоятелен извод">
          <p className="mb-7 text-muted">
            Тук е даден само крайният резултат и подсказка. Изводът е ваш; всеки от петте се вмества в
            половин страница.
          </p>
          <div className="space-y-10">
            {realGasSelfDerivations.map((exercise) => (
              <article key={exercise.id} id={`uprazhnenie-${exercise.id}`} className="scroll-mt-24">
                <h3 className="mb-3 font-serif text-[21px] font-bold leading-snug">
                  <span className="mb-1 block font-sans text-xs font-bold uppercase tracking-widest text-minus">
                    Упражнение {exercise.id}
                  </span>
                  <RichText text={exercise.task} />
                </h3>
                {exercise.latex ? <Formula latex={exercise.latex} /> : null}
                <details className="group mt-4 rounded-[8px] border-[1.5px] border-rule px-4 py-2.5 open:border-ink">
                  <summary className="cursor-pointer text-[15px] font-semibold text-ink select-none">
                    <span className="group-open:hidden">Покажи подсказка</span>
                    <span className="hidden group-open:inline">Подсказка</span>
                  </summary>
                  <div className="mt-3 border-t-[1.5px] border-dashed border-rule pt-3 text-[15px] leading-relaxed text-ink/90">
                    <RichText text={exercise.hint} />
                  </div>
                </details>
              </article>
            ))}
          </div>
        </Section>

        <Section id="recap" n={`§${realGasProblemGroups.length + 2}`} title="Какво проверихте с тези задачи">
          <ul className="list-disc space-y-2.5 pl-5 text-[15.5px] leading-relaxed text-ink/90">
            <li>
              Можете да извлечете неизмеримо от измеримо: налягане в затворена тръба от{" "}
              <RichText text={String.raw`$\alpha$`} /> и{" "}
              <RichText text={String.raw`$\kappa_T$`} />, топлина на изпарение от константата{" "}
              <RichText text="$a$" />, ентропия на лъчение от неговото налягане.
            </li>
            <li>
              Разпознавате кой опит кое запазва:{" "}
              <RichText text={String.raw`$u=\text{const}$`} /> при свободно разширение,{" "}
              <RichText text={String.raw`$h=\text{const}$`} /> при дроселиране,{" "}
              <RichText text={String.raw`$s=\text{const}$`} /> при обратима адиабата.
            </li>
            <li>
              Можете да сметнете истинска машина с таблични енталпии и да кажете къде точно се губи
              работа.
            </li>
            <li>
              Знаете и докъде стига моделът на Ван дер Ваалс: вярна картина, числа с точност около 20
              процента, и едно упорито грешно <RichText text="$z_c$" />.
            </li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-5 font-semibold text-minus">
            <Link href="/physics/termodinamika-universitet" className="hover:underline">
              Обратно към раздела →
            </Link>
            <Link
              href="/materiali?subject=physics&level=university&type=zadachi"
              className="hover:underline"
            >
              Още задачи по физика →
            </Link>
          </div>
        </Section>
      </main>
    </TeacherModeProvider>
  );
}
