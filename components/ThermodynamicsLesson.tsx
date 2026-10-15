import Link from "next/link";
import Formula from "./Formula";
import LessonNav from "./LessonNav";
import RichText from "./RichText";
import Quiz from "./Quiz";
import PredictionQuestion from "./interactives/PredictionQuestion";
import { TeacherModeProvider, TeacherModeToggle, TeacherNote } from "./interactives/TeacherMode";
import ThermodynamicsCourseLab from "./interactives/ThermodynamicsCourseLabs";
import SchoolThermoProblems from "./interactives/SchoolThermoProblems";
import { thermoEntries, thermoEntry } from "@/lib/thermodynamicsCourse";
import { thermoLessons, type Block } from "@/lib/thermodynamicsContent";

export function ThermoBlock({ block }: { block: Block }) {
  if ("text" in block) return <p className="leading-relaxed"><RichText text={block.text} /></p>;
  if ("latex" in block) return <Formula latex={block.latex} />;
  if ("bullets" in block) return <ul className="list-disc space-y-2 pl-5">{block.bullets.map((text, i) => <li key={i}><RichText text={text} /></li>)}</ul>;
  return <div className="overflow-x-auto rounded-lg border border-rule"><table className="w-full text-left text-sm">
    <thead className="bg-hl"><tr>{block.headers.map((text, i) => <th key={i} className="p-3 font-semibold"><RichText text={text} /></th>)}</tr></thead>
    <tbody>{block.rows.map((row, i) => <tr key={i} className="border-t border-rule">{row.map((text, j) => <td key={j} className="p-3 align-top"><RichText text={text} /></td>)}</tr>)}</tbody>
  </table></div>;
}
function Heading({ number, children }: { number: number; children: React.ReactNode }) {
  return <h2 className="mb-5 border-b-2 border-ink pb-2 font-serif text-[26px] font-bold"><span className="mr-3 text-base text-muted"><RichText text={"$\\S " + number + "$"} /></span>{children}</h2>;
}
export default function ThermodynamicsLesson({ slug }: { slug: string }) {
  const lesson = thermoLessons[slug], entry = thermoEntry(slug)!;
  const entries = thermoEntries.filter(item => item.href), index = entries.indexOf(entry);
  const previous = entries[index - 1], next = entries[index + 1];
  const nav = [...lesson.sections.map(({ id, title }, i) => ({ id, n: "§" + (i + 1), label: title })),
    { id: "problems", n: "§" + (lesson.sections.length + 1), label: "Водени задачи" },
    { id: "check", n: "§" + (lesson.sections.length + 2), label: "Проверка" },
    { id: "recap", n: "§" + (lesson.sections.length + 3), label: "Обобщение" }];
  return <TeacherModeProvider><main className="mx-auto max-w-3xl px-5 pb-24">
    <header className="pt-11 pb-2">
      <nav aria-label="Път до урока" className="flex flex-wrap gap-2 text-sm text-muted"><Link href="/physics?level=12">Физика · <RichText text="$12.$" /> клас</Link><span aria-hidden>›</span><Link href="/physics/termodinamika">Термодинамика</Link></nav>
      <p className="mt-5 text-sm font-semibold text-minus"><RichText text={"Тема $" + entry.number + "$"} /></p>
      <h1 className="mt-2 font-serif text-[clamp(30px,6vw,46px)] font-bold leading-tight">{entry.title}</h1>
      <p className="mt-5 text-lg leading-relaxed"><RichText text={lesson.intro} /></p>
      <p className="mt-4 border-l-4 border-minus pl-4 text-muted"><RichText text={lesson.thread} /></p>
    </header>
    <LessonNav items={nav} right={<TeacherModeToggle />} />
    {lesson.sections.map((section, i) => <section key={section.id} id={section.id} className="scroll-mt-20 pt-12">
      <Heading number={i + 1}>{section.title}</Heading>
      <p className="mb-5 leading-relaxed"><RichText text={section.observation} /></p>
      {section.prediction && <div className="my-5"><PredictionQuestion prompt={section.prediction.question} options={section.prediction.options} explanation={section.prediction.explanation} /></div>}
      {section.lab && <ThermodynamicsCourseLab kind={section.lab} />}
      <div className="space-y-4">{section.blocks.map((block, j) => <ThermoBlock key={j} block={block} />)}</div>
      <TeacherNote><RichText text={section.note} /></TeacherNote>
    </section>)}
    <section id="problems" className="scroll-mt-20 pt-12"><Heading number={lesson.sections.length + 1}>Водени задачи</Heading><SchoolThermoProblems ids={lesson.problems} /></section>
    <section id="check" className="scroll-mt-20 pt-12"><Heading number={lesson.sections.length + 2}>Проверете разбирането</Heading><Quiz questions={lesson.quiz} /></section>
    <section id="recap" className="scroll-mt-20 pt-12"><Heading number={lesson.sections.length + 3}>Обобщение</Heading>
      <ul className="list-disc space-y-3 pl-5">{lesson.recap.map((text, i) => <li key={i}><RichText text={text} /></li>)}</ul>
      <div className="mt-7 border-t border-rule pt-5"><Link href="/physics/termodinamika/za-naprednali" className="font-semibold text-minus underline underline-offset-4">Допълнение за напреднали: производни, интеграли и точни извеждания</Link><p className="mt-2 text-sm text-muted">Допълнението е отделно от основния курс и не е необходимо за задачите в него.</p></div>
      <nav aria-label="Предишен и следващ урок" className="mt-7 flex flex-col gap-4 border-t border-rule pt-5">
        {previous?.href && <Link className="text-minus hover:underline" href={previous.href}>← {previous.title}</Link>}
        {next?.href ? <Link className="font-semibold text-minus hover:underline" href={next.href}>Следва: {next.title} →</Link> : <Link className="font-semibold text-minus hover:underline" href="/physics/termodinamika">Към целия курс →</Link>}
      </nav>
    </section>
  </main></TeacherModeProvider>;
}
