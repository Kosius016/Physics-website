"use client";

import LessonNav from "@/components/LessonNav";
import RichText from "@/components/RichText";
import Section from "@/components/Section";
import type { PracticumGuide as PracticumGuideData } from "@/lib/practicum";
import PredictionQuestion from "./interactives/PredictionQuestion";
import { TeacherModeProvider, TeacherModeToggle, TeacherNote } from "./interactives/TeacherMode";

const NAV_ITEMS = [
  { id: "observation", n: "§1", label: "Наблюдение" },
  { id: "physics", n: "§2", label: "Физика" },
  { id: "materials", n: "§3", label: "Материали" },
  { id: "setup", n: "§4", label: "Постановка" },
  { id: "procedure", n: "§5", label: "Стъпки" },
  { id: "measurements", n: "§6", label: "Измервания" },
  { id: "analysis", n: "§7", label: "Обработка" },
  { id: "safety", n: "§8", label: "Безопасност" },
] as const;

function TextList({ items, ordered = false }: { items: string[]; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={`${ordered ? "list-decimal" : "list-disc"} space-y-2 pl-6 text-[16px] leading-relaxed text-ink/90`}>
      {items.map((item, index) => <li key={index}><RichText text={item} /></li>)}
    </Tag>
  );
}

export default function PracticumGuide({ guide }: { guide: PracticumGuideData }) {
  return (
    <TeacherModeProvider>
      <main className="mx-auto max-w-3xl px-5 pb-24 pt-10">
        <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-minus">Практикум · {guide.subject} · {guide.topic}</p>
        <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-ink sm:text-5xl">{guide.title}</h1>
        <p className="mt-4 text-[17px] leading-relaxed text-muted"><RichText text={guide.summary} /></p>
        <LessonNav items={NAV_ITEMS} right={<TeacherModeToggle />} />

        <Section id="observation" n="§1" title="Какво ще наблюдаваме"><TextList items={guide.observation} /></Section>
        <Section id="physics" n="§2" title="Физичната идея"><TextList items={guide.physics} /></Section>
        <Section id="materials" n="§3" title="Материали и заместители">
          <ul className="divide-y divide-rule rounded-[10px] border-[1.5px] border-ink bg-surface">
            {guide.materials.map((material) => (
              <li key={material.name} className="px-4 py-3 text-[15px]">
                <strong>{material.name}</strong>{material.quantity ? ` · ${material.quantity}` : ""}
                {material.alternatives?.length ? <span className="block text-muted">Заместители: {material.alternatives.join(", ")}</span> : null}
              </li>
            ))}
          </ul>
        </Section>
        <Section id="setup" n="§4" title="Постановка"><TextList items={guide.setup} ordered /></Section>
        <Section id="procedure" n="§5" title="Прогноза и изпълнение">
          <PredictionQuestion {...guide.prediction} />
          <div className="mt-6"><TextList items={guide.steps} ordered /></div>
        </Section>
        <Section id="measurements" n="§6" title="Измервания">
          <div className="overflow-x-auto rounded-[10px] border-[1.5px] border-ink bg-surface">
            <table className="w-full min-w-lg border-collapse text-left text-[14px]">
              <thead className="bg-hl"><tr>{guide.measurements.columns.map((column) => <th key={column} className="border-b-[1.5px] border-ink px-3 py-2.5">{column}</th>)}</tr></thead>
              <tbody>{(guide.measurements.exampleRows ?? [guide.measurements.columns.map(() => "")]).map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex} className="h-11 border-b border-rule px-3 py-2 last:border-b-0">{cell}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </Section>
        <Section id="analysis" n="§7" title="Обработка и въпроси">
          <TextList items={guide.processing} ordered />
          <div className="mt-6"><TextList items={guide.questions} /></div>
          <TeacherNote title="Чести грешки"><TextList items={guide.commonErrors} /></TeacherNote>
          <TeacherNote><TextList items={guide.teacherNotes} /></TeacherNote>
        </Section>
        <Section id="safety" n="§8" title="Безопасност"><TextList items={guide.safety} /></Section>
      </main>
    </TeacherModeProvider>
  );
}
