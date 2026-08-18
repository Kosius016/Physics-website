import Image from "next/image";
import Link from "next/link";
import FieldAtlas from "@/components/materiali/FieldAtlas";
import RichText from "@/components/RichText";

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
          href="/materiali/elektrichestvo-i-magnetizam"
          className="group mb-6 grid overflow-hidden rounded-[12px] border-[1.5px] border-ink bg-surface shadow-hard transition-transform hover:-translate-y-0.5 md:grid-cols-[1.15fr_.85fr]"
        >
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border-[1.5px] border-plus bg-plus/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-plus">
                Ново
              </span>
              <span className="rounded-full border-[1.5px] border-rule px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-muted">
                Физика · Електричество и магнетизъм
              </span>
            </div>
            <h3 className="mt-5 font-serif text-[clamp(28px,5vw,38px)] font-bold leading-[1.08]">
              Електричество и магнетизъм: голям справочник
            </h3>
            <p className="mt-3 max-w-xl text-[15.5px] text-muted">
              Всички величини с дефинициите им, законите с условията за приложимост,
              стандартните резултати, стратегиите за задачи и типичните грешки.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-semibold text-ink">
              <span>40-50 мин преговор</span>
              <span>14 секции</span>
              <span>10 въпроса</span>
            </div>
          </div>

          <div className="relative isolate flex min-h-[22rem] flex-col justify-between overflow-hidden border-t-[1.5px] border-ink bg-hl px-6 py-6 md:min-h-0 md:border-l-[1.5px] md:border-t-0">
            <FieldAtlas className="absolute inset-0 -z-10 h-full w-full transition-transform duration-500 group-hover:scale-[1.025]" />
            <ul className="space-y-1.5 text-[13.5px] font-semibold text-ink">
              {[
                "Заряд, поле, поток и потенциал",
                "Проводници, кондензатори, диелектрици",
                "Лоренц, Био-Савар, Ампер",
                "Фарадей, Ленц, индуктивност",
                "Вериги: RC срещу RL",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true" className="text-minus">
                    ·
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <p className="text-[10px] font-bold uppercase tracking-[.18em] text-muted">
                Червената нишка
              </p>
              <p className="mt-1 font-serif text-[19px] font-bold leading-tight text-ink">
                Две полета, шест въпроса
              </p>
              <span className="mt-3 inline-block text-[14px] font-bold text-minus">
                Отворете материала <span aria-hidden="true">→</span>
              </span>
            </div>
          </div>
        </Link>

        <Link
          href="/materiali/provodnitsi-kondenzatori-dielektritsi"
          className="group grid overflow-hidden rounded-[12px] border-[1.5px] border-ink bg-surface shadow-hard transition-transform hover:-translate-y-0.5 md:grid-cols-[1.15fr_.85fr]"
        >
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap gap-2">
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

          <div className="flex min-h-[22rem] flex-col border-t-[1.5px] border-ink bg-hl md:min-h-0 md:border-l-[1.5px] md:border-t-0">
            <div className="relative min-h-48 flex-1 overflow-hidden border-b-[1.5px] border-ink">
              <Image
                src="/images/materiali/capacitor-grounded-sphere.png"
                alt="Стилизирана схема на кондензатор с диелектрик и заземена сфера"
                fill
                sizes="(min-width: 768px) 42vw, 100vw"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.025]"
              />
            </div>
            <div className="bg-hl px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[.18em] text-muted">
                Ключов въпрос
              </p>
              <p className="mt-1 font-serif text-[20px] font-bold leading-tight text-ink">
                Зарядът или потенциалът е постоянен?
              </p>
              <span className="mt-3 inline-block text-[14px] font-bold text-minus">
                Отворете материала <span aria-hidden="true">→</span>
              </span>
            </div>
          </div>
        </Link>

        <Link
          href="/materiali/zadachi-kondenzatori"
          className="group mt-6 grid overflow-hidden rounded-[12px] border-[1.5px] border-ink bg-surface shadow-hard transition-transform hover:-translate-y-0.5 md:grid-cols-[1.15fr_.85fr]"
        >
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border-[1.5px] border-plus bg-plus/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-plus">
                Ново
              </span>
              <span className="rounded-full border-[1.5px] border-rule px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-muted">
                Физика · Задачи с решения
              </span>
            </div>
            <h3 className="mt-5 font-serif text-[clamp(28px,5vw,38px)] font-bold leading-[1.08]">
              Трудни задачи за кондензатори
            </h3>
            <p className="mt-3 max-w-xl text-[15.5px] text-muted">
              Плоски и коаксиални кондензатори, енергийни парадокси, пробив и асимптотични
              приближения. Всяка задача има пълно решение и интерактивна проверка.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-semibold text-ink">
              <span>6 задачи</span>
              <span>6 интерактива</span>
              <span>Пълни решения</span>
            </div>
          </div>

          <div className="flex min-h-[20rem] flex-col justify-between border-t-[1.5px] border-ink bg-ink px-6 py-6 text-white md:min-h-0 md:border-l-[1.5px] md:border-t-0">
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-hl">
              От графиката до физическия смисъл
            </p>
            <div className="my-6 space-y-3 font-serif text-[clamp(20px,3vw,27px)] font-bold">
              <div className="border-l-4 border-minus pl-4 text-minus">
                <RichText text={String.raw`$U=\frac12Q\Delta V$`} />
              </div>
              <div className="border-l-4 border-ok pl-4 text-ok">
                <RichText text={String.raw`$a_{\mathrm{opt}}=b/e$`} />
              </div>
              <div className="border-l-4 border-hl pl-4 text-hl">
                <RichText text={String.raw`$r_{1/2}=\sqrt{ab}$`} />
              </div>
            </div>
            <span className="text-[14px] font-bold text-white">
              Решете задачите <span aria-hidden="true">→</span>
            </span>
          </div>
        </Link>

        <Link
          href="/materiali/redove-na-teylar"
          className="group mt-6 grid overflow-hidden rounded-[12px] border-[1.5px] border-ink bg-surface shadow-hard transition-transform hover:-translate-y-0.5 md:grid-cols-[1.15fr_.85fr]"
        >
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border-[1.5px] border-plus bg-plus/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-plus">
                Ново
              </span>
              <span className="rounded-full border-[1.5px] border-rule px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-muted">
                Математични методи · Физика
              </span>
            </div>
            <h3 className="mt-5 font-serif text-[clamp(28px,5vw,38px)] font-bold leading-[1.08]">
              Редове на Тейлър във физиката
            </h3>
            <p className="mt-3 max-w-xl text-[15.5px] text-muted">
              Махало, гравитация, относителност, дифракция, адиабатен процес и зареден
              пръстен. Всяка следваща стъпка от решението се отключва с верен отговор.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-semibold text-ink">
              <span>6 задачи</span>
              <span>24 отключващи въпроса</span>
              <span>7 графики</span>
            </div>
          </div>

          <div className="flex min-h-[20rem] flex-col justify-between border-t-[1.5px] border-ink bg-ink px-6 py-6 text-white md:min-h-0 md:border-l-[1.5px] md:border-t-0">
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-hl">
              Точна крива, локален полином
            </p>
            <div className="my-6 space-y-3 font-serif text-[clamp(18px,2.6vw,24px)] font-bold">
              <div className="border-l-4 border-minus pl-4 text-minus">
                <RichText text={String.raw`$\sin x\approx x-x^3/3!$`} />
              </div>
              <div className="border-l-4 border-ok pl-4 text-ok">
                <RichText text={String.raw`$(1+x)^\alpha\approx1+\alpha x+\cdots$`} />
              </div>
              <div className="border-l-4 border-hl pl-4 text-hl">
                <RichText text={String.raw`$K\approx mv^2/2+3mv^4/(8c^2)$`} />
              </div>
            </div>
            <span className="text-[14px] font-bold text-white">
              Започнете практикума <span aria-hidden="true">→</span>
            </span>
          </div>
        </Link>
      </section>

    </main>
  );
}
