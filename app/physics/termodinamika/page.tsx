import Link from "next/link";
import RichText from "@/components/RichText";
import { thermodynamicsCourse } from "@/lib/thermodynamicsCourse";
export const metadata = { title: "Термодинамика · 12. клас · SingularityLab" };
export default function Page() {
  return <main className="mx-auto max-w-3xl px-5 pt-11 pb-24">
    <Link href="/physics?level=12" className="text-sm text-minus">Физика · <RichText text="$12.$" /> клас</Link>
    <h1 className="mt-3 font-serif text-4xl font-bold">Термодинамика</h1>
    <p className="mt-5 text-lg leading-relaxed">От молекулното движение към енергийния баланс, ентропията и топлинните машини. Редът следва предоставеното съдържание на учебника. Основните извеждания използват алгебра и геометрия.</p>
    {thermodynamicsCourse.map(section => <section key={section.title} className="mt-10">
      <h2 className="mb-4 border-b-2 border-ink pb-2 font-serif text-2xl font-bold">{section.title.replace("Термодинамика · ", "")}</h2>
      <ol className="divide-y divide-rule rounded-lg border border-ink bg-surface">
        {section.lessons.map(lesson => <li key={lesson.number}>{lesson.href
          ? <Link href={lesson.href} className="flex items-center gap-4 px-4 py-4 hover:bg-hl"><span className="w-8 shrink-0 text-minus"><RichText text={"$" + lesson.number + "$"} /></span><span>{lesson.title}</span><span aria-hidden className="ml-auto">→</span></Link>
          : <div className="flex items-center gap-4 px-4 py-4 text-muted"><span className="w-8 shrink-0"><RichText text={"$" + lesson.number + "$"} /></span><span className="min-w-0 flex-1">{lesson.title}</span><span className="shrink-0 text-xs font-semibold">Скоро</span></div>}</li>)}
      </ol>
    </section>)}
    <aside className="mt-10 border-t border-rule pt-5"><Link className="text-minus underline" href="/physics/termodinamika/za-naprednali">Математическо допълнение за напреднали</Link><p className="mt-2 text-sm text-muted">Работа чрез интеграл, изотерма и закон на Поасон. Не е предварително условие за основния курс.</p></aside>
  </main>;
}
