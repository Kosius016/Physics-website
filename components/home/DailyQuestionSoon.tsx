import SectionHeading from "./SectionHeading";

export default function DailyQuestionSoon() {
  return (
    <section aria-labelledby="daily-question-title" className="pt-16">
      <SectionHeading id="daily-question-title" number="§1" title="Въпрос на деня" />
      <p className="mb-5 max-w-[70ch] text-muted">
        Един кратък въпрос, с който да проверите дали идеята е ясна.
      </p>

      <div className="overflow-hidden rounded-xl border-[1.5px] border-ink bg-surface shadow-hard">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-[1.5px] border-ink bg-hl px-5 py-2.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink">
            Въпрос на деня
          </span>
          <span className="rounded-full border-[1.5px] border-rule bg-surface px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.06em] text-muted">
            Скоро
          </span>
        </div>
        <div className="px-5 py-6 sm:px-6">
          <p className="font-serif text-[22px] font-bold leading-snug text-ink">
            Подготвяме първите въпроси.
          </p>
          <p className="mt-2 max-w-[62ch] text-[15.5px] leading-relaxed text-muted">
            Тук ще има по един въпрос от физика или математика, заедно с кратко обяснение и
            връзка към съответния урок.
          </p>
        </div>
      </div>
    </section>
  );
}
