import Link from "next/link";
import { textbook11Lessons, textbook11ProblemCount } from "@/lib/textbook11";

export const metadata = {
  title: "Решения по учебника за 11. клас · SingularityLab",
  description: "Решения по физика за 11. клас, подредени по урок и номер на задача. Вектори, движение в равнина, скорост и ускорение, с указания и собствени чертежи.",
};

export default function TextbookSolutionsPage() {
  return <main className="mx-auto max-w-3xl px-5 pb-24">
    <header className="pt-11 pb-8">
      <Link href="/" className="text-[13px] font-semibold text-minus underline underline-offset-4">Начало</Link>
      <h1 className="mt-4 font-serif text-[clamp(30px,6vw,44px)] font-bold leading-tight">Решения по учебника за 11. клас</h1>
      <p className="mt-4 text-[17px] leading-relaxed text-muted">Физика, профилирана подготовка. Отворете учебника на съответния урок и изберете номера на задачата.</p>
      <p className="mt-3 text-[14px] leading-relaxed text-muted">Тук са публикувани самостоятелно разработени решения и чертежи. Условията не са възпроизведени. Номерата следват учебника и може да се различават от номерацията на уроците в сайта.</p>
      <p className="mt-4 text-[13px] font-semibold text-minus">{textbook11Lessons.length} урока с решения · {textbook11ProblemCount} задачи и въпроси</p>
    </header>
    <section aria-labelledby="kinematics-title">
      <h2 id="kinematics-title" className="border-b-2 border-ink pb-2 font-serif text-[26px] font-bold">Кинематика</h2>
      <div className="mt-5 space-y-5">
        {textbook11Lessons.map(lesson => <article key={lesson.slug} className="rounded-[10px] border-[1.5px] border-ink bg-surface p-5 shadow-hard-sm">
          <p className="text-[11px] font-bold uppercase tracking-widest text-minus">Урок {lesson.number} в учебника</p>
          <h3 className="mt-2 font-serif text-[24px] font-bold"><Link href={`/reshenia/11-klas/${lesson.slug}`} className="hover:text-minus">{lesson.title}</Link></h3>
          <nav aria-label={`Задачи към урок ${lesson.number}`} className="mt-4 flex flex-wrap gap-2">
            {lesson.problems.map(problem => <Link key={problem.number} href={`/reshenia/11-klas/${lesson.slug}#zadacha-${problem.number}`} aria-label={`Урок ${lesson.number}, задача ${problem.number}`} className="flex h-11 min-w-11 items-center justify-center rounded-lg border border-ink bg-paper px-3 text-[14px] font-bold hover:bg-hl focus-visible:outline-2 focus-visible:outline-minus">{problem.number}</Link>)}
          </nav>
        </article>)}
      </div>
    </section>
  </main>;
}
