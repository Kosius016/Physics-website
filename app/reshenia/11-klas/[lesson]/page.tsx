import Link from "next/link";
import { notFound } from "next/navigation";
import Formula from "@/components/Formula";
import RichText from "@/components/RichText";
import ProgressiveSolution from "@/components/materiali/ProgressiveSolution";
import { SolutionPart } from "@/components/problem-sets/SolutionParts";
import TextbookDiagram from "@/components/problem-sets/TextbookDiagram";
import { textbook11Lessons } from "@/lib/textbook11";

export function generateStaticParams() { return textbook11Lessons.map(lesson => ({ lesson: lesson.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ lesson: string }> }) {
  const { lesson: slug } = await params;
  const lesson = textbook11Lessons.find(item => item.slug === slug);
  if (!lesson) return {};
  return { title: `Урок ${lesson.number}: ${lesson.title} · Решения · SingularityLab`, description: `Решения на ${lesson.problems.length} задачи и въпроси към урок ${lesson.number} за 11. клас. Указания, сметки по оси и авторски чертежи.` };
}

export default async function TextbookLessonSolutions({ params }: { params: Promise<{ lesson: string }> }) {
  const { lesson: slug } = await params;
  const lesson = textbook11Lessons.find(item => item.slug === slug);
  if (!lesson) notFound();
  return <main className="mx-auto max-w-3xl px-5 pb-24">
    <header className="pt-11 pb-6">
      <Link href="/reshenia/11-klas" className="text-[13px] font-semibold text-minus underline underline-offset-4">Решения по учебника за 11. клас</Link>
      <p className="mt-6 text-[11px] font-bold uppercase tracking-widest text-minus">Кинематика · Урок {lesson.number} в учебника</p>
      <h1 className="mt-2 font-serif text-[clamp(28px,5vw,40px)] font-bold leading-tight">{lesson.title}</h1>
      <p className="mt-4 text-[16px] leading-relaxed text-muted">Използвайте условието от учебника. За всяка задача можете да отворите указание, а след това да проследите решението стъпка по стъпка.</p>
      <Link href={lesson.theoryHref} className="mt-4 inline-block rounded-lg border border-ink bg-hl px-4 py-2 text-[13px] font-semibold">Към урока в сайта →</Link>
    </header>
    <nav aria-label="Номера на задачите" className="flex flex-wrap gap-2 border-y border-rule py-4">
      {lesson.problems.map(problem => <Link key={problem.number} href={`#zadacha-${problem.number}`} aria-label={`Задача ${problem.number}`} className="flex h-11 min-w-11 items-center justify-center rounded-lg border border-ink bg-surface px-3 font-semibold hover:bg-hl">{problem.number}</Link>)}
    </nav>
    <div className="divide-y divide-rule">
      {lesson.problems.map(problem => <section key={problem.number} id={`zadacha-${problem.number}`} aria-labelledby={`title-${problem.number}`} className="scroll-mt-28 py-7">
        <h2 id={`title-${problem.number}`} className="font-serif text-[26px] font-bold"><Link href={`#zadacha-${problem.number}`} className="hover:text-minus">Задача {problem.number}</Link></h2>
        <ProgressiveSolution hint={<RichText text={problem.hint} />}>
          {problem.steps.map((step, index) => <SolutionPart key={index} label={step.part ?? String(index + 1)} title={step.title}>
            <p><RichText text={step.text} /></p>
            {step.formulas?.map((latex, i) => <Formula key={i} latex={latex} />)}
            {step.diagram && <figure>
              <TextbookDiagram data={step.diagram} />
              <figcaption className="text-[13px] leading-relaxed text-muted"><RichText text={step.diagram.caption} /></figcaption>
            </figure>}
          </SolutionPart>)}
        </ProgressiveSolution>
      </section>)}
    </div>
    <footer className="mt-8 flex flex-wrap gap-4 border-t border-ink pt-5 text-[14px] font-semibold text-minus">
      <Link href="/reshenia/11-klas">Всички решения за 11. клас</Link>
      {textbook11Lessons.filter(item => item.slug !== lesson.slug).map(item => <Link key={item.slug} href={`/reshenia/11-klas/${item.slug}`}>Урок {item.number}: {item.title} →</Link>)}
    </footer>
  </main>;
}
