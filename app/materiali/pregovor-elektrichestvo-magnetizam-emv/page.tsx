import type { Metadata } from "next";
import Link from "next/link";
import Formula from "@/components/Formula";
import LessonNav from "@/components/LessonNav";
import RichText from "@/components/RichText";
import Section from "@/components/Section";
import {
  TeacherModeProvider,
  TeacherModeToggle,
  TeacherNote,
} from "@/components/interactives/TeacherMode";
import {
  Prereq,
  ProblemStatement,
  Solution,
  SolutionPart,
} from "@/components/problem-sets/SolutionParts";
import {
  reviewConventions,
  reviewDiagnostics,
  reviewGroups,
  reviewProblems,
  type ReviewBlock,
  type ReviewProblem,
} from "@/lib/problemSets/electromagnetismReview";

export const metadata: Metadata = {
  title: "Електричество, магнетизъм и ЕМВ: работен лист с решения · SingularityLab",
  description:
    "Голям преговор преди оптиката: 12 диагностични въпроса и 13 задачи с указания и решения стъпка по стъпка. Електростатика, вериги, магнетизъм, индукция, променлив ток и ЕМВ.",
};

const MATERIALS_HREF = "/materiali?subject=physics&level=university&type=pregovor";
const NAV = [
  { id: "start", n: "§1", label: "Как да работите" },
  { id: "diagnostics", n: "§2", label: "Диагностика" },
  ...reviewGroups.map((group, index) => ({
    id: group.id,
    n: `§${index + 3}`,
    label: ["Електростатика", "Вериги", "Магнетизъм", "Индукция", "Променлив ток", "ЕМВ"][index],
  })),
  { id: "recap", n: "§9", label: "Обобщение" },
];

function Blocks({ blocks }: { blocks: ReviewBlock[] }) {
  return blocks.map((block, index) =>
    block.kind === "formula" ? (
      <Formula key={index} latex={block.text} />
    ) : (
      <p key={index}><RichText text={block.text} /></p>
    ),
  );
}

function ReviewExercise({ problem }: { problem: ReviewProblem }) {
  return (
    <article
      id={`problem-${problem.number}`}
      aria-labelledby={`problem-${problem.number}-heading`}
      className="min-w-0 scroll-mt-20 border-t border-rule pt-8 first:border-t-0 first:pt-0"
    >
      <p className="text-[11px] font-bold uppercase tracking-[.16em] text-minus">
        Задача {problem.number}
      </p>
      <h3
        id={`problem-${problem.number}-heading`}
        className="mb-4 mt-2 font-serif text-[23px] font-bold leading-tight text-ink"
      >
        {problem.title}
      </h3>
      <ProblemStatement>
        <Blocks blocks={problem.intro} />
        <ol className="list-[bulgarian-alpha] space-y-3 pl-6">
          {problem.subparts.map((part, index) => (
            <li key={index}><RichText text={part} /></li>
          ))}
        </ol>
        {problem.extra.map((paragraph, index) => (
          <p key={index}><RichText text={paragraph} /></p>
        ))}
      </ProblemStatement>
      <Solution hint={<RichText text={problem.hint} />}>
        {problem.steps.map((step) => (
          <SolutionPart key={step.label} label={step.label} title={step.title}>
            <Blocks blocks={step.blocks} />
          </SolutionPart>
        ))}
      </Solution>
    </article>
  );
}

export default function ElectromagnetismReviewPage() {
  return (
    <TeacherModeProvider>
      <main className="mx-auto max-w-3xl px-5 pb-24">
        <header className="pb-2 pt-11">
          <nav aria-label="Път до материала" className="flex flex-wrap gap-2 text-[12px] font-semibold text-muted">
            <Link href={MATERIALS_HREF} className="text-minus underline underline-offset-4">
              Материали за преговор
            </Link>
            <span aria-hidden="true">/</span>
            <span>Работен лист</span>
          </nav>
          <p className="mt-6 text-[11px] font-bold uppercase tracking-[.18em] text-minus">
            Голям преговор преди оптиката
          </p>
          <h1 className="mb-3 mt-2 font-serif text-[clamp(32px,6.6vw,46px)] font-bold leading-[1.08] text-ink">
            Електричество, магнетизъм и електромагнитни вълни
          </h1>
          <p className="text-[17px] leading-relaxed text-muted">
            От заряда и полето до преноса на енергия. Възстановете връзките между темите,
            изберете физичния модел и проверете решенията си преди следващата стъпка към оптиката.
          </p>
          <ul aria-label="Съдържание на работния лист" className="mt-5 flex flex-wrap gap-2 text-[12px] font-semibold text-ink">
            {[
              `${reviewDiagnostics.length} диагностични въпроса`,
              `${reviewProblems.length} задачи с решения`,
              `${reviewGroups.length} тематични блока`,
              "Университетско ниво",
            ].map((label) => (
              <li key={label} className="rounded-full border border-rule bg-hl px-3 py-1">{label}</li>
            ))}
          </ul>
        </header>

        <LessonNav items={NAV} right={<TeacherModeToggle />} />

        <Section id="start" n="§1" title="Как да работите с листа">
          <div className="space-y-4 text-[16px] leading-relaxed text-ink/90">
            <p>
              Започнете с диагностиката: отделете 20–25 минути без записки. Отговорете с обяснение
              или скица и отбележете на лист доколко сте уверени: „сигурно“, „колебание“ или „предположение“.
              Отворете отговора едва след самостоятелния опит.
            </p>
            <p>
              Разпределете задачите в шест занятия по около 90 минути, по един тематичен блок.
              Първо направете прогноза и схема, след това изберете закон, решете символно и заместете
              числата. Накрая проверете единиците, посоките и граничните случаи.
            </p>
            <p>
              Под всяка задача има отделно указание и решение. Решението започва с първата стъпка;
              следващите се разкриват последователно. Сравнявайте аргументите си, както и крайния резултат.
            </p>
            <p className="rounded-[10px] border border-rule bg-hl/60 px-4 py-3 text-[14px]">
              <RichText text={reviewConventions} />
            </p>
          </div>
          <Prereq
            links={[{ label: "Електричество и магнетизъм: справочник", href: "/materiali/elektrichestvo-i-magnetizam" }]}
            note="Отворете справочника след първия опит. За всяка използвана формула посочете условията, при които е приложима."
          />
          <TeacherNote title="Как да използвате диагностиката">
            <p>
              Оценявайте идеята и аргумента: 0 за липсваща основна идея, 1 за частично обяснение,
              2 за верен отговор с нужните условия. Отбелязвайте дали затруднението е в понятието,
              модела, знака, математиката или единиците. Увереният грешен отговор изисква обсъждане.
            </p>
          </TeacherNote>
        </Section>

        <Section id="diagnostics" n="§2" title="Начална диагностика">
          <p className="mb-6 text-[16px] leading-relaxed text-muted">
            Кратките въпроси проверяват основните идеи. За всеки отговор посочете физичен аргумент;
            само формула или „да/не“ не е достатъчно.
          </p>
          <div className="space-y-8">
            {reviewDiagnostics.map((question) => (
              <article
                key={question.number}
                id={`diagnostic-${question.number}`}
                aria-labelledby={`diagnostic-${question.number}-heading`}
                className="min-w-0 scroll-mt-20 rounded-[10px] border border-rule bg-surface p-4 sm:p-5"
              >
                <h3 id={`diagnostic-${question.number}-heading`} className="mb-3 text-[12px] font-bold uppercase tracking-[.12em] text-minus">
                  Въпрос {question.number}
                </h3>
                <p className="text-[16px] leading-relaxed text-ink"><RichText text={question.question} /></p>
                <Solution hint={<RichText text={question.hint} />}>
                  <SolutionPart label="1" title="Отговор и обяснение">
                    <p><RichText text={question.answer} /></p>
                  </SolutionPart>
                </Solution>
              </article>
            ))}
          </div>
        </Section>

        {reviewGroups.map((group, index) => (
          <Section key={group.id} id={group.id} n={`§${index + 3}`} title={group.title}>
            <p className="mb-4 text-[16px] leading-relaxed text-muted">{group.description}</p>
            <Prereq links={group.links} />
            <TeacherNote><p>{group.teacherNote}</p></TeacherNote>
            <div className="mt-8 space-y-10">
              {reviewProblems.filter((problem) => group.numbers.includes(problem.number)).map((problem) => (
                <ReviewExercise key={problem.number} problem={problem} />
              ))}
            </div>
          </Section>
        ))}

        <Section id="recap" n="§9" title="Обобщение и следваща стъпка">
          <p className="text-[16px] leading-relaxed text-ink/90">
            След преговора проверете дали можете самостоятелно да:
          </p>
          <ul className="mt-4 list-disc space-y-3 pl-5 text-[16px] leading-relaxed text-ink/90">
            <li>Избирате закон според симетрията, режима и началните условия.</li>
            <li>Определяте посоки и знаци преди числените сметки.</li>
            <li>Свързвате веригите и полетата чрез запазването на заряд и енергия.</li>
            <li>Разчитате фаза, поляризация и пренос на енергия в електромагнитна вълна.</li>
          </ul>
          <p className="mt-5 text-[16px] leading-relaxed text-ink/90">
            Върнете се към задачите, при които е било нужно указание, и променете една предпоставка.
            Ако можете да обясните новия резултат, сте готови за смесена самостоятелна проверка.
            Следващата тема е оптиката: светлината като електромагнитна вълна.
          </p>
          <TeacherNote title="Преди финалното контролно">
            <p>
              Използвайте нови условия и числа, за да проверите пренасянето на знанията.
              Работният вариант е 120 минути и 100 точки, с предварително уговорен формулен лист.
              Първо довършете темите, при които липсва самостоятелен физичен аргумент.
            </p>
          </TeacherNote>
          <Link href={MATERIALS_HREF} className="mt-7 inline-block rounded-sm font-semibold text-minus underline underline-offset-4">
            Обратно към материалите за преговор
          </Link>
        </Section>
      </main>
    </TeacherModeProvider>
  );
}
