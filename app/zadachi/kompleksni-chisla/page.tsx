import Link from "next/link";
import Formula from "@/components/Formula";
import RichText from "@/components/RichText";
import LessonNav from "@/components/LessonNav";
import Section from "@/components/Section";
import ProgressiveSolution from "@/components/materiali/ProgressiveSolution";
import { ProblemStatement, SolutionPart } from "@/components/problem-sets/SolutionParts";
import { TeacherModeProvider, TeacherModeToggle, TeacherNote } from "@/components/interactives/TeacherMode";
import { complexChapters } from "@/lib/complexCourse";
import { complexProblems } from "@/lib/problemSets/complexNumbers";

export const metadata = { title: "Комплексни числа: 32 задачи с решения · SingularityLab", description: "От координати и комплексно деление до доказателство на Ойлер, корени, фазори и квантова интерференция. Указания и поетапни решения." };
const LETTERS = ["а", "б", "в", "г"];
export default function ComplexProblemsPage() {
  return <TeacherModeProvider><main className="mx-auto max-w-3xl px-5 pb-24">
    <header className="pb-3 pt-11"><Link href="/materiali?subject=math&level=university&type=zadachi" className="text-sm font-semibold text-minus hover:underline">Материали / Математика / Задачи</Link><h1 className="mt-7 font-serif text-[clamp(36px,7vw,56px)] font-bold leading-[1.08]">Комплексни числа: 32 задачи</h1><p className="mt-5 text-lg leading-relaxed text-muted">Четири последователни групи: основи, Ойлер, степени и корени, физика. Всяка задача има отделно указание и решение, което се разкрива стъпка по стъпка.</p><p className="mt-4 leading-relaxed">За бърза диагностика изберете задачи 1, 3, 10, 12, 18 и 25. За завършване на курса преминете всички групи. Задачи 12, 15 и 22 изискват доказателство; 31 и 32 са надграждане.</p><Link className="my-5 inline-block font-semibold text-minus hover:underline" href="/math/kompleksni-chisla">Към курса и интерактивните фигури →</Link></header>
    <LessonNav items={[...complexChapters.map((c, i) => ({ id: `part-${i + 1}`, n: `§${i + 1}`, label: `Задачи ${c.practice[0]}–${c.practice[1]}` })), { id: "recap", n: "§5", label: "Самооценка" }]} right={<TeacherModeToggle />} />
    <TeacherNote>За първо занятие използвайте задачи 1–5. Не оценявайте познаване на формула като доказателство: в задача 12 се изисква обосновка на прегрупирането. Във физическите задачи проверявайте знака на фазата и дали амплитудите са пикови.</TeacherNote>
    {complexChapters.map((c, i) => <Section key={c.slug} id={`part-${i + 1}`} n={`§${i + 1}`} title={c.title}>
      <Link href={`/math/kompleksni-chisla/${c.slug}`} className="mb-7 inline-block font-semibold text-minus hover:underline">Припомнете си теорията за тази група →</Link>
      <div className="space-y-12">{complexProblems.filter(p => p.id >= c.practice[0] && p.id <= c.practice[1]).map(p => <article key={p.id} id={`zadacha-${p.id}`} className="scroll-mt-24">
        <h3 className="mb-4 font-serif text-2xl font-bold"><span className="mb-1 block font-sans text-xs font-bold uppercase tracking-widest text-minus">Задача {p.id}</span>{p.title}</h3>
        <ProblemStatement><p><RichText text={p.statement} /></p></ProblemStatement>
        <ProgressiveSolution hint={<RichText text={p.hint} />}>{p.steps.map((step, j) => <SolutionPart key={j} label={LETTERS[j]} title={j === p.steps.length - 1 ? "Резултат и проверка" : "Разсъждение"}><p><RichText text={step.text} /></p>{step.latex && <Formula latex={step.latex} />}</SolutionPart>)}</ProgressiveSolution>
      </article>)}</div>
    </Section>)}
    <Section id="recap" n="§5" title="Самооценка след курса"><p className="leading-relaxed">Готови сте да използвате комплексни числа, когато можете самостоятелно да изберете удобно представяне, да обосновете формулата на Ойлер, да намерите всички корени и да преведете физическия резултат обратно към измерима величина.</p><div className="mt-5 flex flex-wrap gap-5 font-semibold text-minus"><Link href="/math/kompleksni-chisla" className="hover:underline">Обратно към курса →</Link><Link href="/physics/promenliv-tok/impedans-i-rezonans" className="hover:underline">Приложение: импеданс и резонанс →</Link></div></Section>
  </main></TeacherModeProvider>;
}
