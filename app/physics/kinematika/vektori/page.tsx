import Link from "next/link";

export const metadata = {
  title: "Вектори (упражнение) · SingularityLab",
  description:
    "Урок по кинематика за 11. клас, профилирана подготовка: скаларни и векторни величини, събиране и разлагане на вектори по оси. Урокът се подготвя.",
};

/**
 * Място за урок 1.1 „Вектори (упражнение)“ - първият урок от темата
 * Кинематика. Страницата съществува вече, защото урок 1.2 препраща към нея
 * вместо да преговаря вектори. Съдържанието идва с отделен урок.
 */
export default function VectorsLessonPlaceholderPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-24">
      <header className="pt-11 pb-2">
        <nav
          aria-label="Път до урока"
          className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-muted"
        >
          <Link
            href="/physics"
            className="rounded-sm transition-colors hover:text-minus focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-minus"
          >
            Физика
          </Link>
          <span aria-hidden="true">·</span>
          <Link
            href="/physics?level=11#kinematics"
            className="rounded-sm transition-colors hover:text-minus focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-minus"
          >
            Кинематика
          </Link>
        </nav>
        <h1 className="mt-2 mb-2 font-serif text-[clamp(32px,6.6vw,46px)] leading-[1.08] font-bold text-ink">
          Вектори (упражнение)
        </h1>
        <p className="text-[17px] text-muted">
          11. клас, профилирана подготовка · скаларни и векторни величини, събиране и разлагане по
          оси
        </p>
      </header>

      <div className="mt-8 rounded-[10px] border-[1.5px] border-ink bg-surface px-6 py-7 shadow-hard">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-plus">Скоро</p>
        <p className="mt-2 text-[17px] leading-relaxed text-ink/90">
          Урокът се подготвя. Дотогава инструментите за вектори, които са нужни в кинематиката, се
          използват директно в следващия урок.
        </p>
        <Link
          href="/physics/kinematika/dvizhenie-v-ravnina"
          className="mt-5 inline-block rounded-lg border-[1.5px] border-ink bg-ink px-4 py-2 text-[13.5px] font-bold text-white shadow-hard-sm transition-opacity hover:opacity-90"
        >
          Към урока „Движение на материална точка в една равнина“
        </Link>
      </div>
    </main>
  );
}
