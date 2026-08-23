const LESSON_STEPS = [
  { number: "§1", title: "Мотивация", body: "Защо въобще ни трябва това." },
  { number: "§2", title: "Интуиция", body: "Картината, преди сметките." },
  { number: "§3", title: "Математика", body: "Изводът, ред по ред." },
  { number: "§4", title: "Симулация", body: "Параметрите се променят на живо." },
  { number: "§5", title: "Решени примери", body: "С всички стъпки, не само отговор." },
  { number: "§6", title: "Задачи", body: "За упражнение, с указания." },
  { number: "§7", title: "Проверка", body: "Въпроси с обяснение защо." },
] as const;

export default function LessonAnatomy() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-3.5">
      {LESSON_STEPS.map((step) => (
        <article
          key={step.number}
          className="rounded-[10px] border-[1.5px] border-ink bg-surface px-3.5 py-4 shadow-hard-sm transition-[transform,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard sm:px-[18px]"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted">
            {step.number}
          </p>
          <h3 className="mt-0.5 font-serif text-[17px] font-bold leading-snug text-ink sm:text-[19px]">
            {step.title}
          </h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted sm:text-[14px]">{step.body}</p>
        </article>
      ))}
    </div>
  );
}
