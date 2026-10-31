import Link from "next/link";
import RichText from "@/components/RichText";
import Formula from "@/components/Formula";
import Section from "@/components/Section";
import { IsothermFamilyFigure } from "@/components/interactives/RealGasFigures";

export const metadata = {
  title: "Термодинамика на реалния газ · Университетско ниво · SingularityLab",
  description:
    "Пълен курс по термодинамика на реалния газ: пълен диференциал и съотношения на Максуел, термодинамично уравнение на състоянието, газът на Ван дер Ваалс до критичната точка и кривата на инверсия, топлинни и хладилни машини, 12 задачи с решения.",
};

const raw = String.raw;

const LESSONS = [
  {
    number: "1.1",
    title: "Математическият апарат и термодинамичните потенциали",
    href: "/physics/termodinamika-universitet/matematichen-aparat",
    summary:
      "Пълен диференциал, циклично правило, коефициентите на разширение и свиваемост, четирите потенциала и съотношенията на Максуел.",
  },
  {
    number: "1.2",
    title: "Главните връзки: уравнението на състоянието определя всичко",
    href: "/physics/termodinamika-universitet/glavnite-vrazki",
    summary:
      "Термодинамично уравнение на състоянието, законът на Стефан-Болцман, топлинните капацитети, адиабатите, ентропията, свободно разширение и дроселиране.",
  },
  {
    number: "1.3",
    title: "Газът на Ван дер Ваалс докрай",
    href: "/physics/termodinamika-universitet/van-der-vaals",
    summary:
      "Критична точка, приведено уравнение и закон за съответните състояния, правило на Максуел, метастабилни състояния, крива на инверсия. Две симулации.",
  },
  {
    number: "1.4",
    title: "Топлинни и хладилни машини",
    href: "/physics/termodinamika-universitet/mashini",
    summary:
      "Границите на двигателя, хладилника и термопомпата от двата принципа, после истинският парокомпресионен цикъл с енталпии.",
  },
] as const;

const QUANTITIES = [
  { what: "моларен обем", tex: raw`\nu=V/n`, unit: raw`\mathrm{m^3/mol}` },
  { what: "моларна вътрешна енергия", tex: raw`u=U/n`, unit: raw`\mathrm{J/mol}` },
  { what: "моларна ентропия", tex: raw`s`, unit: raw`\mathrm{J/(mol\cdot K)}` },
  { what: "моларна енталпия", tex: raw`h=u+p\nu`, unit: raw`\mathrm{J/mol}` },
  { what: "моларна свободна енергия", tex: raw`f=u-Ts`, unit: raw`\mathrm{J/mol}` },
  { what: "моларен потенциал на Гибс", tex: raw`g=h-Ts`, unit: raw`\mathrm{J/mol}` },
  { what: "моларни топлинни капацитети", tex: raw`c_V,\ c_p`, unit: raw`\mathrm{J/(mol\cdot K)}` },
  { what: "количество вещество", tex: raw`n`, unit: raw`\mathrm{mol}` },
  { what: "работа на газа", tex: raw`A`, unit: raw`\mathrm{J}` },
  { what: "топлина, приета от газа", tex: raw`Q`, unit: raw`\mathrm{J}` },
  {
    what: "коефициент на обемно разширение",
    tex: raw`\alpha=\frac{1}{\nu}\left(\frac{\partial\nu}{\partial T}\right)_{\!p}`,
    unit: raw`\mathrm{K^{-1}}`,
  },
  {
    what: "изотермна свиваемост",
    tex: raw`\kappa_T=-\frac{1}{\nu}\left(\frac{\partial\nu}{\partial p}\right)_{\!T}`,
    unit: raw`\mathrm{Pa^{-1}}`,
  },
];

const GAS_ROWS = [
  { gas: raw`\mathrm{He}`, a: "0{,}00346", b: "2{,}38", cV: "12{,}5", tc: "5{,}2", pc: "2{,}3" },
  { gas: raw`\mathrm{H_2}`, a: "0{,}0248", b: "2{,}66", cV: "20{,}4", tc: "33{,}2", pc: "13{,}0" },
  { gas: raw`\mathrm{N_2}`, a: "0{,}137", b: "3{,}87", cV: "20{,}8", tc: "126{,}2", pc: "34{,}0" },
  { gas: raw`\mathrm{O_2}`, a: "0{,}138", b: "3{,}19", cV: "21{,}1", tc: "154{,}6", pc: "50{,}4" },
  { gas: raw`\mathrm{CO_2}`, a: "0{,}364", b: "4{,}27", cV: "28{,}8", tc: "304{,}1", pc: "73{,}8" },
  { gas: raw`\mathrm{H_2O}`, a: "0{,}554", b: "3{,}05", cV: "—", tc: "647{,}1", pc: "220{,}6" },
];

export default function RealGasCoursePage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-24">
      <header className="pt-11 pb-2">
        <nav
          aria-label="Път до раздела"
          className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-muted"
        >
          <Link href="/physics" className="transition-colors hover:text-minus">
            Физика
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/physics?level=university#thermodynamics" className="transition-colors hover:text-minus">
            Университетско
          </Link>
        </nav>
        <h1 className="mt-2 mb-3 font-serif text-[clamp(34px,7vw,48px)] leading-[1.08] font-bold text-ink">
          Термодинамика на реалния газ
        </h1>
        <p className="text-[17px] leading-relaxed text-muted">
          Идеалният газ отговаря на въпроса какво става при дадено уравнение на състоянието. Тук
          въпросът се сменя: кои връзки важат за <strong className="text-ink">всяко</strong> вещество
          и какво точно добавя привличането между молекулите. Отговорът обяснява защо има течен
          азот, защо термопомпата дава повече топлина, отколкото харчи, и защо гуменият ластик се
          затопля, когато го разтегнете.
        </p>
      </header>

      <div className="my-7">
        <IsothermFamilyFigure />
      </div>

      <Section id="lessons" n="§1" title="Уроците в раздела">
        <ol className="divide-y-[1.5px] divide-rule overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-surface shadow-hard">
          {LESSONS.map((lesson) => (
            <li key={lesson.number}>
              <Link href={lesson.href} className="group block px-5 py-4 transition-colors hover:bg-hl">
                <div className="flex items-center gap-4">
                  <span className="w-9 shrink-0 text-[15px] font-bold tabular-nums text-minus">
                    <RichText text={`$${lesson.number}$`} />
                  </span>
                  <span className="flex-1 text-[16px] font-semibold text-ink">{lesson.title}</span>
                  <span className="font-bold text-ink opacity-0 transition-opacity group-hover:opacity-100">
                    →
                  </span>
                </div>
                <p className="mt-1.5 pl-13 text-[14px] leading-relaxed text-muted">{lesson.summary}</p>
              </Link>
            </li>
          ))}
        </ol>
        <div className="mt-5 rounded-[10px] border-[1.5px] border-ink bg-hl px-5 py-4">
          <p className="text-[15.5px] leading-relaxed">
            Към раздела има и отделна страница с{" "}
            <Link href="/zadachi/termodinamika-realen-gaz" className="font-semibold text-minus hover:underline">
              дванадесет задачи с решения стъпка по стъпка
            </Link>{" "}
            и пет упражнения за самостоятелен извод: от разширителния съд на отоплението през
            машината на Линде до хладилника в кухнята.
          </p>
        </div>
        <p className="mt-5 text-[15.5px] leading-relaxed text-ink/90">
          Предполагаме познати производна и интеграл, първият принцип и процесите с идеален газ. Ако
          интегралът за работа и законът на Поасон още не са уверени, започнете от{" "}
          <Link href="/physics/termodinamika/za-naprednali" className="font-semibold text-minus hover:underline">
            математическото допълнение към курса за 12. клас
          </Link>
          .
        </p>
      </Section>

      <Section id="oznachenia" n="§2" title="Означения и данни">
        <p className="text-ink/90">
          Работим почти винаги с <RichText text={raw`$1\,\mathrm{mol}$`} />. Моларните величини са с
          малки букви, пълните - с главни.{" "}
          <strong>
            Внимание: тук <RichText text={raw`$\nu$`} /> е моларният обем, а количеството вещество е{" "}
            <RichText text="$n$" />
          </strong>{" "}
          - обратно на навика от училищния курс. Причината е, че малкото{" "}
          <RichText text="$a$" /> е заето от константата на Ван дер Ваалс, а{" "}
          <RichText text="$V$" /> остава за пълния обем.
        </p>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse text-[15px]">
            <thead>
              <tr className="border-b-2 border-ink text-left">
                <th className="py-2 pr-3 font-semibold">Величина</th>
                <th className="py-2 pr-3 font-semibold">Означение</th>
                <th className="py-2 font-semibold">Единица</th>
              </tr>
            </thead>
            <tbody>
              {QUANTITIES.map((row) => (
                <tr key={row.what} className="border-b border-rule">
                  <td className="py-2 pr-3 align-top text-ink/90">{row.what}</td>
                  <td className="py-2 pr-3 align-top">
                    <RichText text={`$${row.tex}$`} />
                  </td>
                  <td className="py-2 align-top">
                    <RichText text={`$${row.unit}$`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-5 text-ink/90">Уравнението на Ван дер Ваалс в тези означения:</p>
        <div className="mt-3">
          <Formula
            latex={raw`\left(p+\frac{a}{\nu^2}\right)(\nu-b)=RT\qquad\Longleftrightarrow\qquad p=\frac{RT}{\nu-b}-\frac{a}{\nu^2}`}
          />
        </div>
        <p className="mt-3 text-[15px] text-muted">
          с <RichText text={raw`$R=8{,}314\,\mathrm{J/(mol\cdot K)}$`} />. Индексът при{" "}
          <RichText text="$c_V$" /> значи „при постоянен обем“, тоест при постоянно{" "}
          <RichText text={raw`$\nu$`} />.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-[15px]">
            <thead>
              <tr className="border-b-2 border-ink text-left">
                <th className="py-2 pr-3 font-semibold">Газ</th>
                <th className="py-2 pr-3 font-semibold">
                  <RichText text={raw`$a,\ \mathrm{Pa\cdot m^6/mol^2}$`} />
                </th>
                <th className="py-2 pr-3 font-semibold">
                  <RichText text={raw`$b,\ 10^{-5}\,\mathrm{m^3/mol}$`} />
                </th>
                <th className="py-2 pr-3 font-semibold">
                  <RichText text={raw`$c_V,\ \mathrm{\tfrac{J}{mol\cdot K}}$`} />
                </th>
                <th className="py-2 pr-3 font-semibold">
                  <RichText text={raw`$T_c,\ \mathrm{K}$`} />
                </th>
                <th className="py-2 font-semibold">
                  <RichText text={raw`$p_c,\ \mathrm{bar}$`} />
                </th>
              </tr>
            </thead>
            <tbody>
              {GAS_ROWS.map((row) => (
                <tr key={row.gas} className="border-b border-rule">
                  <td className="py-2 pr-3">
                    <RichText text={`$${row.gas}$`} />
                  </td>
                  <td className="py-2 pr-3 tabular-nums">
                    <RichText text={`$${row.a}$`} />
                  </td>
                  <td className="py-2 pr-3 tabular-nums">
                    <RichText text={`$${row.b}$`} />
                  </td>
                  <td className="py-2 pr-3 tabular-nums">
                    {row.cV === "—" ? "—" : <RichText text={`$${row.cV}$`} />}
                  </td>
                  <td className="py-2 pr-3 tabular-nums">
                    <RichText text={`$${row.tc}$`} />
                  </td>
                  <td className="py-2 tabular-nums">
                    <RichText text={`$${row.pc}$`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          Стойностите на <RichText text="$c_V$" /> са при около{" "}
          <RichText text={raw`$300\,\mathrm{K}$`} />. За преминаване от таблици в други единици:{" "}
          <RichText text={raw`$1\,\mathrm{L^2{\cdot}bar/mol^2}=0{,}1\,\mathrm{Pa\cdot m^6/mol^2}$`} /> и{" "}
          <RichText text={raw`$1\,\mathrm{L/mol}=10^{-3}\,\mathrm{m^3/mol}$`} />.
        </p>
      </Section>

      <Section id="iztochnici" n="§3" title="Източници на данните">
        <ul className="list-disc space-y-2 pl-5 text-[15.5px] leading-relaxed text-ink/90">
          <li>
            Константите <RichText text="$a$" /> и <RichText text="$b$" />: таблицата на константите
            на Ван дер Ваалс в Wikipedia.
          </li>
          <li>
            Измерените температури на инверсия на хелий, водород, азот и кислород: справочни данни за
            ефекта на Джаул-Томсън.
          </li>
          <li>
            Свойствата на водата, на R134a, на азота и на въздуха (<RichText text={raw`$\alpha$`} />,{" "}
            <RichText text={raw`$\kappa_T$`} />, енталпии, критични точки, скорост на звука):
            изчислени с библиотеката CoolProp.
          </li>
        </ul>
      </Section>
    </main>
  );
}
