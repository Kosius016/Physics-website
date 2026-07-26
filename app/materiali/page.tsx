import Link from "next/link";

export const metadata = {
  title: "Материали за преговор · STEM Платформа",
  description:
    "Кратки, структурирани материали за преговор по физика с интерактивни графики, справочници и самопроверка.",
};

export default function MaterialsPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 pb-24">
      <header className="max-w-3xl pb-8 pt-12">
        <p className="text-[11px] font-bold uppercase tracking-[.22em] text-minus">
          Библиотека
        </p>
        <h1 className="mt-2 font-serif text-[clamp(38px,7vw,58px)] font-bold leading-[1.04] text-ink">
          Материали за <span className="text-plus">преговор</span>
        </h1>
        <p className="mt-4 max-w-2xl text-[17px] text-muted">
          Стегнати карти на темите, формули с точните условия за приложимост, стратегии за
          задачи и интерактивна самопроверка.
        </p>
      </header>

      <section aria-labelledby="materials-heading">
        <h2
          id="materials-heading"
          className="mb-5 border-b-2 border-ink pb-1.5 font-serif text-[26px] font-bold"
        >
          <span className="mr-2.5 align-[0.15em] text-[0.62em] tracking-[0.1em] text-muted">
            §1
          </span>
          Налични материали
        </h2>

        <Link
          href="/materiali/provodnitsi-kondenzatori-dielektritsi"
          className="group grid overflow-hidden rounded-[12px] border-[1.5px] border-ink bg-surface shadow-hard transition-transform hover:-translate-y-0.5 md:grid-cols-[1.15fr_.85fr]"
        >
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border-[1.5px] border-plus bg-plus/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-plus">
                Ново
              </span>
              <span className="rounded-full border-[1.5px] border-rule px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-muted">
                Физика · Електростатика
              </span>
            </div>
            <h3 className="mt-5 font-serif text-[clamp(28px,5vw,38px)] font-bold leading-[1.08]">
              Проводници, кондензатори и диелектрици
            </h3>
            <p className="mt-3 max-w-xl text-[15.5px] text-muted">
              От електростатичното равновесие и теоремата на Гаус до избора между фиксиран
              заряд и фиксиран потенциал.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-semibold text-ink">
              <span>15-20 мин преговор</span>
              <span>3 интерактива</span>
              <span>7 въпроса</span>
            </div>
          </div>

          <div className="flex min-h-52 flex-col justify-between border-t-[1.5px] border-ink bg-hl p-6 md:border-l-[1.5px] md:border-t-0">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.18em] text-muted">
                Ключов въпрос
              </p>
              <p className="mt-3 font-serif text-[26px] font-bold leading-tight">
                Зарядът или потенциалът е постоянен?
              </p>
            </div>
            <span className="mt-8 text-[15px] font-bold text-minus">
              Отворете материала <span aria-hidden="true">→</span>
            </span>
          </div>
        </Link>
      </section>

    
    </main>
  );
}
