import Link from "next/link";
import LessonNav from "@/components/LessonNav";
import RichText from "@/components/RichText";
import ProblemSetProblem from "@/components/problem-sets/ProblemSetProblem";
import { capacitorEnergyProblems } from "@/lib/problemSets/capacitorEnergy";

export const metadata = {
  title: "Задачи: плосък и цилиндричен кондензатор · STEM Платформа",
  description:
    "Шест задачи с пълни решения и интерактивни графики: енергия на кондензатор, ред на Тейлър за коаксиален кабел, оптимален радиус срещу пробив, енергиен баланс при раздалечаване на плочи и загубената половина енергия.",
};

const SECTION_NAV = [
  { id: "zadacha-1", n: "§1", label: "Енергия" },
  { id: "zadacha-2", n: "§2", label: "Тейлър" },
  { id: "zadacha-3", n: "§3", label: "Пробив" },
  { id: "zadacha-4", n: "§4", label: "Плочите" },
  { id: "zadacha-5", n: "§5", label: "Загубата" },
  { id: "zadacha-6", n: "§6", label: "Бонус" },
] as const;

export default function CapacitorProblemsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-24">
      <header className="pt-11 pb-3">
        <nav
          aria-label="Път до задачите"
          className="flex flex-wrap items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-muted"
        >
          <Link
            href="/materiali"
            className="rounded-sm transition-colors hover:text-minus focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-minus"
          >
            Материали
          </Link>
          <span aria-hidden="true">·</span>
          <span>Електростатика</span>
        </nav>
        <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-minus">
          Задачи към материала
        </p>
        <h1 className="mt-1 font-serif text-[clamp(32px,6.6vw,46px)] font-bold leading-[1.08] text-ink">
          Плосък и цилиндричен кондензатор
        </h1>
        <p className="mt-3 text-[17px] leading-relaxed text-muted">
          Шест задачи с пълни решения стъпка по стъпка. Условията са видими веднага, решенията се
          разгъват едва когато ги поискате. Където геометрията или зависимостта носи смисъл, под
          решението стои интерактивна графика.
        </p>
      </header>

      <LessonNav items={SECTION_NAV} />

      <div className="mt-7 rounded-[10px] border-[1.5px] border-ink bg-hl px-5 py-4 shadow-hard-sm">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-minus">Как да ги ползвате</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-ink/90">
          <li>
            <RichText text="Задачи $1$-$3$ и случай А от задача $4$ са **задължителни**." />
          </li>
          <li>
            <RichText text="Случай Б от задача $4$ и задача $5$ са **допълнителни**, задача $6$ е **бонус**." />
          </li>
          <li>
            <RichText text="Използвайте $\varepsilon_0=8{,}85\times10^{-12}\,\mathrm{F/m}$ и $e=2{,}718$." />
          </li>
          <li>
            Задача 1 извежда израза за енергията, който се ползва навсякъде по-нататък. Ако
            прескочите нея, задача 6 ще увисне.
          </li>
        </ul>
      </div>

      <div className="mt-6 rounded-[10px] border-[1.5px] border-rule bg-surface px-5 py-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Свързан материал</p>
        <Link
          href="/materiali/provodnitsi-kondenzatori-dielektritsi"
          className="mt-1.5 block font-serif text-[19px] font-bold text-ink transition-colors hover:text-minus"
        >
          Проводници, кондензатори и диелектрици <span aria-hidden="true">→</span>
        </Link>
        <p className="mt-1 text-[14.5px] leading-relaxed text-muted">
          Преговорът зад тези задачи: теоремата на Гаус, капацитет и ключовият въпрос дали е
          постоянен зарядът, или потенциалът.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {capacitorEnergyProblems.map((problem) => (
          <ProblemSetProblem key={problem.number} problem={problem} />
        ))}
      </div>

      <section className="mt-10 rounded-[12px] border-[1.5px] border-ink bg-surface px-5 py-5 shadow-hard">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted">
          Червената нишка на серията
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-[15.5px] leading-relaxed text-ink/90">
          <li>
            <RichText text="**Всичко тръгва от $u=\tfrac12\varepsilon_0E^2$.** Задача $1$ я извежда, задача $6$ я ползва, за да разпредели енергията по слоеве." />
          </li>
          <li>
            <RichText text="**Приближенията се правят със систематичен ред, не по догадка.** Средният радиус в задача $2$ не е избран от вкус: той е линейният член на реда на Тейлър." />
          </li>
          <li>
            <RichText text="**Логаритъмът е бавен, линейният множител е бърз.** Това решава задача $3$ и обяснява защо по-тънкото жило влошава нещата." />
          </li>
          <li>
            <RichText text="**Кондензаторът рядко е изолирана система.** Задачи $4$ и $5$ показват, че балансът се затваря само когато преброим и източника, и съпротивлението." />
          </li>
        </ul>
      </section>
    </main>
  );
}
