import Link from "next/link";
import { notFound } from "next/navigation";
import Formula from "@/components/Formula";
import LessonNav from "@/components/LessonNav";
import RichText from "@/components/RichText";
import Section from "@/components/Section";
import PredictionQuestion from "@/components/interactives/PredictionQuestion";
import { TeacherModeProvider, TeacherModeToggle, TeacherNote } from "@/components/interactives/TeacherMode";
import { CartesianLab, MultiplicationLab, EulerLab, RootsLab, InterferenceLab, ResonanceLab } from "@/components/interactives/ComplexLabs";
import { complexChapters } from "@/lib/complexCourse";

const LABS = { cartesian: CartesianLab, multiplication: MultiplicationLab, euler: EulerLab, roots: RootsLab, interference: InterferenceLab, resonance: ResonanceLab };
export function generateStaticParams() { return complexChapters.map(c => ({ chapter: c.slug })); }
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ chapter: string }> }) {
  const { chapter } = await params;
  const data = complexChapters.find(c => c.slug === chapter);
  return { title: `${data?.title ?? "Комплексни числа"} · SingularityLab`, description: data?.subtitle };
}

export default async function ComplexChapterPage({ params }: { params: Promise<{ chapter: string }> }) {
  const { chapter } = await params;
  const index = complexChapters.findIndex(c => c.slug === chapter);
  if (index < 0) notFound();
  const data = complexChapters[index], next = complexChapters[index + 1], previous = complexChapters[index - 1];
  const nav = [...data.sections.map((s, i) => ({ id: s.id, n: `§${i + 1}`, label: s.title })), { id: "recap", n: `§${data.sections.length + 1}`, label: "Обобщение и практика" }];
  return <TeacherModeProvider><main className="mx-auto max-w-3xl px-5 pb-24">
    <header className="pb-3 pt-11"><Link href="/math/kompleksni-chisla" className="text-sm font-semibold text-minus hover:underline">Математика / Комплексни числа / Учебен маршрут</Link>
      <p className="mt-7 text-xs font-bold uppercase tracking-[.2em] text-minus">Част {index + 1} от 4</p>
      <h1 className="mt-3 font-serif text-[clamp(34px,6vw,52px)] font-bold leading-[1.08]">{data.title}</h1>
      <p className="mt-5 text-lg leading-relaxed text-muted">{data.subtitle}</p>
      <p className="mt-5 text-sm leading-relaxed"><strong>Преди тази част: </strong>{data.prerequisites}</p>
      <div className="my-6 rounded-lg border border-rule bg-surface p-4"><h2 className="font-semibold">След тази част ще можете</h2><ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed">{data.goals.map(g => <li key={g}>{g}</li>)}</ul></div>
      <nav aria-label="Части на курса" className="mb-4 flex flex-wrap gap-2">{complexChapters.map((c, i) => <Link key={c.slug} href={`/math/kompleksni-chisla/${c.slug}`} aria-current={c.slug === chapter ? "page" : undefined} className={`rounded-full border border-ink px-3 py-1.5 text-sm ${c.slug === chapter ? "bg-hl font-bold" : "bg-surface hover:bg-hl"}`}>Част {i + 1}</Link>)}</nav>
    </header>
    <LessonNav items={nav} right={<TeacherModeToggle />} />
    {data.sections.map((section, i) => <Section key={section.id} id={section.id} n={`§${i + 1}`} title={section.title}>
      <div className="space-y-5">{section.blocks.map((block, j) => {
        if (block.kind === "formula") return <Formula key={j} latex={block.text} />;
        if (block.kind === "note") return <div key={j} className="rounded-r-lg border-l-4 border-ok bg-ok/10 px-5 py-4 leading-relaxed"><RichText text={block.text} /></div>;
        if (block.kind === "p") return <p key={j} className="text-base leading-[1.85] text-ink/90"><RichText text={block.text} /></p>;
        if (block.kind === "prediction") return <PredictionQuestion key={j} prompt={block.prompt} options={block.options} />;
        if (block.kind === "lab") { const Lab = LABS[block.name]; return <Lab key={j} />; }
      })}</div>
      {section.teacher && <TeacherNote><RichText text={section.teacher} /></TeacherNote>}
    </Section>)}
    <Section id="recap" n={`§${data.sections.length + 1}`} title="Обобщение и практика">
      <ul className="list-disc space-y-3 pl-5 leading-relaxed">{data.recap.map(text => <li key={text}><RichText text={text} /></li>)}</ul>
      <div className="mt-6 rounded-xl border-[1.5px] border-ink bg-hl p-5"><h3 className="font-serif text-xl font-bold">Проверете разбирането си</h3><p className="mt-2 leading-relaxed">Решете задачи {data.practice[0]}–{data.practice[1]}. Първо опитайте без отворен урок; после използвайте указанията и постепенното решение. Ако не можете да обясните защо избраното действие работи, върнете се към съответното извеждане.</p><Link href={`/zadachi/kompleksni-chisla#part-${index + 1}`} className="mt-4 inline-block font-semibold text-minus hover:underline">Към задачите за тази част →</Link></div>
      {index === 1 && <Link className="mt-5 block font-semibold text-minus hover:underline" href="/materiali/redove-na-teylar">Допълнителна подготовка: редове на Тейлър →</Link>}
      <nav aria-label="Следващ урок" className="mt-8 flex flex-wrap justify-between gap-5 font-semibold text-minus">{previous && <Link className="hover:underline" href={`/math/kompleksni-chisla/${previous.slug}`}>← Предишна част</Link>}{next ? <Link className="hover:underline" href={`/math/kompleksni-chisla/${next.slug}`}>Част {index + 2}: {next.title} →</Link> : <Link className="hover:underline" href="/physics/promenliv-tok/impedans-i-rezonans">Продължете с импеданс и резонанс →</Link>}</nav>
    </Section>
  </main></TeacherModeProvider>;
}
