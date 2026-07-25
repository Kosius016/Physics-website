import Link from "next/link";
import LessonNav from "@/components/LessonNav";
import Section from "@/components/Section";
import ProblemSetProblem from "@/components/problem-sets/ProblemSetProblem";
import { linearAlgebraIdentityProblems } from "@/lib/problemSets/linearAlgebraIdentities";

export const metadata = {
  title: "Детерминанти и векторни тъждества · Problem set 01",
  description:
    "10 задачи с доказателства и решения за векторно, смесено произведение и детерминанти.",
};

const SECTION_NAV = [
  { id: "vector-identities", n: "I", label: "Векторни тъждества" },
  { id: "triple-product", n: "II", label: "Смесено произведение" },
  { id: "determinants", n: "III", label: "Детерминанти" },
] as const;

const RELATED_LESSONS = [
  {
    href: "/math/lineina-algebra/matrici",
    label: "Матрици",
    text: "Запис, редове, стълбове и линейни преобразувания",
  },
  {
    href: "/math/lineina-algebra/determinanti",
    label: "Детерминанти",
    text: "Ориентирана площ, обем и елементарни операции",
  },
  {
    href: "/math/lineina-algebra/vektorno-proizvedenie",
    label: "Векторно произведение",
    text: "Посока, площ, смесено произведение и компланарност",
  },
] as const;

function ProblemRange({ from, to }: { from: number; to: number }) {
  return (
    <div className="space-y-6">
      {linearAlgebraIdentityProblems
        .filter((problem) => problem.number >= from && problem.number <= to)
        .map((problem) => (
          <ProblemSetProblem key={problem.number} problem={problem} />
        ))}
    </div>
  );
}

export default function LinearAlgebraIdentityProblemSetPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-24">
      <header className="pt-11 pb-3">
        <nav
          aria-label="Път до problem set"
          className="flex flex-wrap items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-muted"
        >
          <Link href="/zadachi" className="transition-colors hover:text-minus">
            Задачи
          </Link>
          <span aria-hidden="true">·</span>
          <span>Линейна алгебра</span>
        </nav>
        <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-minus">
          Problem set 01
        </p>
        <h1 className="mt-1 font-serif text-[clamp(34px,7vw,48px)] font-bold leading-[1.08] text-ink">
          Детерминанти и векторни тъждества
        </h1>
        <p className="mt-3 text-[17px] leading-relaxed text-muted">
          10 задачи с доказателства, указания и пълни решения. Опитайте първо самостоятелно,
          после разгънете само помощта, от която имате нужда.
        </p>
      </header>

      <LessonNav items={SECTION_NAV} />

      <div className="mt-8 rounded-[10px] border-[1.5px] border-ink bg-hl px-5 py-4 shadow-hard-sm">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-minus">Свързани уроци</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {RELATED_LESSONS.map((lesson) => (
            <Link
              key={lesson.href}
              href={lesson.href}
              className="rounded-[9px] border border-rule bg-surface px-4 py-3 transition-colors hover:border-ink"
            >
              <p className="font-bold text-ink">{lesson.label}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{lesson.text}</p>
            </Link>
          ))}
        </div>
      </div>

      <Section id="vector-identities" n="I" title="Векторни тъждества">
        <p className="mb-6 text-[16px] leading-relaxed text-ink/90">
          Задачи 1 до 5 започват от компонентната формула и стигат до тъждества, които съкращават
          сложни вложени произведения.
        </p>
        <ProblemRange from={1} to={5} />
      </Section>

      <Section id="triple-product" n="II" title="Смесено произведение">
        <p className="mb-6 text-[16px] leading-relaxed text-ink/90">
          Задачи 6 до 9 свързват векторното произведение с детерминантите, ориентирания обем и
          условието за компланарност.
        </p>
        <ProblemRange from={6} to={9} />
      </Section>

      <Section id="determinants" n="III" title="Детерминанти">
        <p className="mb-6 text-[16px] leading-relaxed text-ink/90">
          Финалната задача използва елементарни операции и индукция, за да изведе общата
          детерминанта на Вандермонд.
        </p>
        <ProblemRange from={10} to={10} />
      </Section>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t-2 border-ink pt-5">
        <Link href="/zadachi" className="font-semibold text-minus hover:underline">
          ← Всички problem sets
        </Link>
        <Link href="/math/lineina-algebra/vektorno-proizvedenie" className="font-semibold text-minus hover:underline">
          Към урока за векторно произведение →
        </Link>
      </div>
    </main>
  );
}
