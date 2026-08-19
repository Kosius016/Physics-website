import Link from "next/link";
import RichText from "@/components/RichText";

export const metadata = {
  title: "Задачи · STEM Платформа",
  description: "Тематични серии със сбити условия, указания и решения стъпка по стъпка.",
};

export default function ProblemSetsPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 pb-24">
      <header className="pt-12 pb-8">
        <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-minus">Самостоятелна работа</p>
        <h1 className="mt-2 font-serif text-[clamp(36px,7vw,52px)] font-bold leading-tight text-ink">
          Задачи
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
          href="/zadachi/kondenzatori"
          className="group grid overflow-hidden rounded-[12px] border-[1.5px] border-ink bg-surface shadow-hard transition-transform hover:-translate-y-0.5 md:grid-cols-[1.15fr_.85fr]"
        >
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.17em] text-minus">
                Серия по физика
              </span>
              <span className="rounded-full border border-rule bg-hl px-3 py-1 text-[11px] font-semibold text-muted">
                Електростатика
              </span>
            </div>
            <h3 className="mt-4 font-serif text-[clamp(28px,5vw,38px)] font-bold leading-[1.08] text-ink group-hover:text-minus">
              Плосък и коаксиален кондензатор
            </h3>
            <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed text-ink/85">
              Енергия, пробив, плоско приближение и енергийни баланси. Всяко решение се
              отключва стъпка по стъпка, а ключовите резултати се проверяват с графики.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-semibold text-ink">
              <span><RichText text="$6$ задачи" /></span>
              <span><RichText text="$6$ интерактивни проверки" /></span>
              <span>Водени решения</span>
            </div>
            <p className="mt-6 text-[13px] font-bold text-minus">Отворете серията →</p>
          </div>

          <div className="flex min-h-[17rem] flex-col justify-between border-t-[1.5px] border-ink bg-ink px-6 py-6 text-white md:min-h-0 md:border-l-[1.5px] md:border-t-0">
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-hl">
              От геометрията до енергията
            </p>
            <div className="my-5 space-y-3 font-serif text-[clamp(19px,3vw,26px)] font-bold">
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
            <p className="text-[12px] font-semibold text-white/75">Снимки · схеми · симулации</p>
          </div>
        </Link>

        <Link
          href="/zadachi/chestota-period-valni"
          className="group mt-5 grid overflow-hidden rounded-[12px] border-[1.5px] border-ink bg-surface shadow-hard transition-transform hover:-translate-y-0.5 md:grid-cols-[1.15fr_.85fr]"
        >
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.17em] text-minus">
                Серия по физика
              </span>
              <span className="rounded-full border border-rule bg-hl px-3 py-1 text-[11px] font-semibold text-muted">
                Трептения и вълни
              </span>
            </div>
            <h3 className="mt-4 font-serif text-[clamp(28px,5vw,38px)] font-bold leading-[1.08] text-ink group-hover:text-minus">
              Честота, период и вълни
            </h3>
            <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed text-ink/85">
              От въртеливо движение към честота, оттам към дължина и скорост на вълната, фаза,
              интерференция и биения. Всяко решение се отключва стъпка по стъпка.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-semibold text-ink">
              <span><RichText text="$20$ задачи" /></span>
              <span><RichText text="$5$ интерактивни проверки" /></span>
              <span>Водени решения</span>
            </div>
            <p className="mt-6 text-[13px] font-bold text-minus">Отворете серията →</p>
          </div>

          <div className="flex min-h-[17rem] flex-col justify-between border-t-[1.5px] border-ink bg-ink px-6 py-6 text-white md:min-h-0 md:border-l-[1.5px] md:border-t-0">
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-hl">
              От въртенето до биенията
            </p>
            <div className="my-5 space-y-3 font-serif text-[clamp(19px,3vw,26px)] font-bold">
              <div className="border-l-4 border-minus pl-4 text-minus">
                <RichText text={String.raw`$\omega=2\pi f$`} />
              </div>
              <div className="border-l-4 border-ok pl-4 text-ok">
                <RichText text={String.raw`$\lambda=v/f$`} />
              </div>
              <div className="border-l-4 border-hl pl-4 text-hl">
                <RichText text={String.raw`$A_{\text{рез}}=2A\cos\tfrac{\Delta\varphi}{2}$`} />
              </div>
            </div>
            <p className="text-[12px] font-semibold text-white/75">Графики · симулации · фаза</p>
          </div>
        </Link>

        <Link
          href="/zadachi/redove-na-teylar"
          className="group mt-5 grid overflow-hidden rounded-[12px] border-[1.5px] border-ink bg-surface shadow-hard transition-transform hover:-translate-y-0.5 md:grid-cols-[1.15fr_.85fr]"
        >
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.17em] text-minus">
                Серия по математични методи
              </span>
              <span className="rounded-full border border-rule bg-hl px-3 py-1 text-[11px] font-semibold text-muted">
                Анализ и електростатика
              </span>
            </div>
            <h3 className="mt-4 font-serif text-[clamp(28px,5vw,38px)] font-bold leading-[1.08] text-ink group-hover:text-minus">
              Редове на Тейлър и Маклорен
            </h3>
            <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed text-ink/85">
              Граници чрез редове, после потенциал на дипол, на двойка заряди и на зареден
              пръстен, и накрая шест физични задачи от механиката, относителността и оптиката.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-semibold text-ink">
              <span><RichText text="$16$ задачи с решения" /></span>
              <span><RichText text="$6$ водени задачи" /></span>
              <span><RichText text="$10$ графики" /></span>
            </div>
            <p className="mt-6 text-[13px] font-bold text-minus">Отворете серията →</p>
          </div>

          <div className="flex min-h-[17rem] flex-col justify-between border-t-[1.5px] border-ink bg-ink px-6 py-6 text-white md:min-h-0 md:border-l-[1.5px] md:border-t-0">
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-hl">
              Точна крива, локален полином
            </p>
            <div className="my-5 space-y-3 font-serif text-[clamp(19px,3vw,26px)] font-bold">
              <div className="border-l-4 border-minus pl-4 text-minus">
                <RichText text={String.raw`$\dfrac{\sin x-x}{x^3}\to-\dfrac16$`} />
              </div>
              <div className="border-l-4 border-ok pl-4 text-ok">
                <RichText text={String.raw`$\Delta V\approx kp/x^2$`} />
              </div>
              <div className="border-l-4 border-hl pl-4 text-hl">
                <RichText text={String.raw`$E\approx kQz/R^3$`} />
              </div>
            </div>
            <p className="text-[12px] font-semibold text-white/75">Граници · дипол · пръстен</p>
          </div>
        </Link>

        <Link
          href="/zadachi/lineina-algebra-tazhdestva"
          className="group mt-6 block rounded-[12px] border-[1.5px] border-ink bg-surface px-6 py-5 shadow-hard transition-transform hover:-translate-y-0.5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.17em] text-minus">
              Серия по математика
            </span>
            <span className="rounded-full border border-rule bg-hl px-3 py-1 text-[11px] font-semibold text-muted">
              Университетско ниво
            </span>
          </div>
          <h3 className="mt-3 font-serif text-[26px] font-bold leading-tight text-ink group-hover:text-minus">
            Детерминанти и векторни тъждества
          </h3>
          <p className="mt-2 max-w-2xl text-[15.5px] leading-relaxed text-ink/85">
            <RichText text="$10$ задачи" /> с доказателства и решения: Лагранж, BAC-CAB, Якоби,
            Бине-Коши, смесено произведение, компланарност и детерминантата на Вандермонд.
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
