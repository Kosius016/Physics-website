import Link from "next/link";

export const metadata = {
  title: "Задачи · STEM Платформа",
  description: "Тематични problem sets с доказателства, указания и решения.",
};

export default function ProblemSetsPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 pb-24">
      <header className="pt-12 pb-8">
        <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-minus">Самостоятелна работа</p>
        <h1 className="mt-2 font-serif text-[clamp(36px,7vw,52px)] font-bold leading-tight text-ink">
          Problem sets
        </h1>
        <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-muted">
          Тематични серии от задачи, които свързват няколко урока. Условията са видими веднага,
          а указанията и решенията се разкриват едва когато ги поискате.
        </p>
      </header>

      <section aria-labelledby="available-sets">
        <h2 id="available-sets" className="mb-4 font-serif text-[24px] font-bold text-ink">
          Налични серии
        </h2>
        <Link
          href="/zadachi/lineina-algebra-tazhdestva"
          className="group block rounded-[12px] border-[1.5px] border-ink bg-surface px-6 py-5 shadow-hard transition-transform hover:-translate-y-0.5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.17em] text-minus">
              Problem set 01
            </span>
            <span className="rounded-full border border-rule bg-hl px-3 py-1 text-[11px] font-semibold text-muted">
              Университетско ниво
            </span>
          </div>
          <h3 className="mt-3 font-serif text-[26px] font-bold leading-tight text-ink group-hover:text-minus">
            Детерминанти и векторни тъждества
          </h3>
          <p className="mt-2 max-w-2xl text-[15.5px] leading-relaxed text-ink/85">
            10 задачи с доказателства и решения: Лагранж, BAC-CAB, Якоби, Бине-Коши,
            смесено произведение, компланарност и детерминантата на Вандермонд.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Матрици", "Детерминанти", "Векторно произведение"].map((topic) => (
              <span key={topic} className="rounded-full bg-ink px-3 py-1 text-[11px] font-semibold text-white">
                {topic}
              </span>
            ))}
          </div>
          <p className="mt-5 text-[13px] font-bold text-minus">Отворете серията →</p>
        </Link>
      </section>
    </main>
  );
}
