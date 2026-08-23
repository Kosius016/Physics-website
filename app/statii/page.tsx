import Link from "next/link";
import { articles } from "@/lib/articles";

export const metadata = {
  title: "Статии · SingularityLab",
  description: "Научнопопулярни статии: физиката зад познатите явления, разказана в дълбочина.",
};

export default function ArticlesPage() {
  const sorted = [...articles].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <main className="mx-auto max-w-4xl px-5 pb-24 pt-10">
      <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-minus">Нова секция</p>
      <h1 className="mt-2 font-serif text-4xl font-bold leading-tight text-ink sm:text-5xl">Статии</h1>
      <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-muted">
        Дълги четива за науката зад познатите явления. Без бързане и без опростяване до
        неистина: какво знаем, откъде го знаем и кои въпроси още стоят отворени.
      </p>

      <div className="mt-8 space-y-5">
        {sorted.map((a) => (
          <Link
            key={a.slug}
            href={`/statii/${a.slug}`}
            className="block rounded-xl border-[1.5px] border-ink bg-surface p-5 shadow-hard transition-transform hover:-translate-y-0.5"
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold uppercase tracking-[0.14em]">
              <span className="text-plus">{a.tag}</span>
              <span className="text-muted">{a.topic}</span>
              <span className="text-muted">·</span>
              <span className="text-muted">{a.dateLabel}</span>
              <span className="text-muted">·</span>
              <span className="text-muted">{a.minutes} мин четене</span>
            </div>
            <h2 className="mt-3 font-serif text-[26px] font-bold leading-snug text-ink">{a.title}</h2>
            <p className="mt-2 text-[15.5px] leading-relaxed text-muted">{a.subtitle}</p>
            <p className="mt-4 text-[13.5px] font-bold text-minus">Прочетете статията →</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
