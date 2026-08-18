import Link from "next/link";
import coaxialConnectorPhoto from "@/public/images/zadachi/coaxial-f-connector.jpg";
import parallelPlatePhoto from "@/public/images/zadachi/parallel-plate-capacitor.jpg";
import Formula from "@/components/Formula";
import LessonNav from "@/components/LessonNav";
import RichText from "@/components/RichText";
import Section from "@/components/Section";
import PredictionQuestion from "@/components/interactives/PredictionQuestion";
import ProgressiveSolution from "@/components/materiali/ProgressiveSolution";
import ProblemContextPhoto from "@/components/problem-sets/ProblemContextPhoto";
import type { RichTextString } from "@/lib/types";
import {
  BreakdownOptimizationLab,
  ChargingEnergyGraph,
  CoaxialApproximationLab,
  EnergyConcentrationLab,
  PlateEnergyLab,
  SharingEnergyLab,
} from "@/components/materiali/CapacitorProblemLabs";

export const metadata = {
  title: "Задачи за кондензатори с решения · STEM Платформа",
  description:
    "Шест трудни задачи за плосък и коаксиален кондензатор с пълни решения, графики и интерактивни симулации.",
};

const NAV = [
  { id: "energy", n: "§1", label: "Енергия" },
  { id: "coax-flat", n: "§2", label: "Коаксиален → плосък" },
  { id: "breakdown", n: "§3", label: "Пробив" },
  { id: "plates", n: "§4", label: "Дърпане на плочите" },
  { id: "missing-energy", n: "§5", label: "Изчезнала енергия" },
  { id: "concentration", n: "§6", label: "Енергия в обема" },
  { id: "recap", n: "§7", label: "Обобщение" },
] as const;

function ProblemStatement({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard-sm">
      <p className="text-[11px] font-bold uppercase tracking-[.16em] text-plus">Условие</p>
      <div className="mt-3 space-y-3 text-[15.5px] leading-relaxed text-ink/90">{children}</div>
    </div>
  );
}

function SolutionPart({
  label,
  title,
  children,
}: {
  label: string;
  title: RichTextString;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-[2.5rem_1fr]">
      <div
        aria-hidden="true"
        data-solution-step={label}
        className="flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-ink bg-hl text-[13px] font-bold text-ink"
      >
        {label}
      </div>
      <div className="min-w-0">
        <h3 className="font-serif text-[20px] font-bold">
          <span className="sr-only">Подточка {label}: </span>
          <RichText text={title} />
        </h3>
        <div className="mt-2 space-y-3 text-[15.5px] leading-relaxed text-ink/90">{children}</div>
      </div>
    </div>
  );
}

function Solution({ hint, children }: { hint: React.ReactNode; children: React.ReactNode }) {
  return <ProgressiveSolution hint={hint}>{children}</ProgressiveSolution>;
}

function ResultBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-r-lg border-l-4 border-ok bg-ok/10 px-4 py-3 text-[15px] font-semibold">
      {children}
    </div>
  );
}

export default function CapacitorProblemsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-24">
      <header className="pb-2 pt-11">
        <Link href="/zadachi" className="text-[13px] font-semibold text-minus hover:underline">
          Задачи / Електростатика
        </Link>
        <p className="mt-6 text-[11px] font-bold uppercase tracking-[.22em] text-minus">
          Практикум с водени решения
        </p>
        <h1 className="mt-2 font-serif text-[clamp(38px,7vw,58px)] font-bold leading-[1.04] text-ink">
          Плосък и цилиндричен кондензатор
        </h1>
        <p className="mt-4 max-w-2xl text-[17px] text-muted">
          Шест трудни задачи със сбити условия и решения, които се отключват стъпка по
          стъпка. Всяка ключова зависимост може да бъде проверена с графика или симулация.
        </p>
        <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-wide">
          <span className="rounded-full border-[1.5px] border-ink bg-surface px-3 py-1.5"><RichText text="$1$-$3$ задължителни" /></span>
          <span className="rounded-full border-[1.5px] border-ink bg-surface px-3 py-1.5"><RichText text="$4$-$5$ разширени" /></span>
          <span className="rounded-full border-[1.5px] border-plus bg-plus/10 px-3 py-1.5 text-plus"><RichText text="$6$ бонус" /></span>
        </div>
        <div className="mt-6 rounded-[10px] border-[1.5px] border-rule bg-hl px-4 py-3 text-[14.5px]">
          Навсякъде използваме <RichText text={String.raw`$\varepsilon_0=8{,}85\times10^{-12}\,\mathrm{F/m}$`} /> и{" "}
          <RichText text="$e=2{,}718$" />. Графиките не заменят извеждането: те служат за
          проверка на физическия смисъл и на пределните случаи.
        </div>
      </header>

      <LessonNav items={NAV} />

      <Section id="energy" n="§1" title="Каква енергия е запасена в един кондензатор?">
        <ProblemStatement>
          <p>
            Пренасяме малък положителен заряд <RichText text="$dq$" /> от отрицателната до
            положителната плоча на плосък кондензатор. Разстоянието е <RichText text="$d$" />,
            полето е еднородно и външната сила има големина <RichText text="$F=dqE$" />.
          </p>
          <ol className="list-[lower-alpha] space-y-2 pl-6">
            <li>Изведете <RichText text={String.raw`$dA=\Delta V\,dq$`} /> от работата по пътя между плочите.</li>
            <li>Обяснете защо пълната работа не е <RichText text={String.raw`$Q\Delta V$`} />.</li>
            <li>Начертайте <RichText text={String.raw`$\Delta V(q)$`} /> при зареждане от <RichText text="$0$" /> до <RichText text="$Q$" />.</li>
            <li>Намерете работата като лице под графиката.</li>
            <li>Проверете чрез средното напрежение.</li>
            <li>Получете трите еквивалентни форми на енергията.</li>
            <li>Изведете обемната плътност <RichText text="$u$" /> за плосък кондензатор.</li>
          </ol>
        </ProblemStatement>

        <div className="mt-6">
          <PredictionQuestion
            prompt={String.raw`Как се променя напрежението, докато кондензатор с постоянен капацитет се зарежда от $0$ до $Q$?`}
            options={[
              {
                text: "Расте линейно с натрупания заряд",
                correct: true,
                why: String.raw`$\Delta V=q/C$, а $C$ е постоянно. Затова графиката е права през началото.`,
              },
              {
                text: "Остава равно на крайното напрежение",
                correct: false,
                why: String.raw`В началото $q=0$, следователно и $\Delta V=0$. Крайното напрежение не действа през целия процес.`,
              },
              {
                text: "Намалява, защото свободните места за заряд се запълват",
                correct: false,
                why: String.raw`При линеен кондензатор новият заряд повишава потенциалната разлика: $\Delta V=q/C$.`,
              },
            ]}
            explanation={String.raw`Точно тази линейност създава множителя $1/2$ в енергията.`}
          />
        </div>

        <div className="mt-6">
          <ChargingEnergyGraph />
        </div>

        <Solution
          hint={
            <RichText
              text={String.raw`Първо начертайте зависимостта $\Delta V(q)=q/C$. Работата е лицето под тази графика, не правоъгълник с височина $\Delta V_f$.`}
            />
          }
        >
          <SolutionPart label="a" title="Работа за една малка порция заряд">
            <p>
              При бавно пренасяне външната сила уравновесява електричната. Понеже полето е
              еднородно, силата е постоянна по целия път.
            </p>
            <Formula
              latex={String.raw`dA=\int_0^d F\,dl
              =\int_0^d dq\,E\,dl
              =dq\,Ed
              =\Delta V\,dq`}
            />
          </SolutionPart>

          <SolutionPart label="b" title={String.raw`Защо не получаваме $Q\Delta V$?`}>
            <p>
              Потенциалната разлика не е постоянна. Тя започва от нула и расте с натрупването
              на заряд, така че първите порции се пренасят с по-малка работа от последните.
            </p>
          </SolutionPart>

          <SolutionPart label="c" title="Графика на напрежението">
            <p>
              От дефиницията <RichText text={String.raw`$C=q/\Delta V$`} /> следва{" "}
              <RichText text={String.raw`$\Delta V=q/C$`} />. Получаваме права през началото с наклон
              <RichText text="$1/C$" />.
            </p>
          </SolutionPart>

          <SolutionPart label="d" title="Лицето под правата">
            <p>Работата е интегралът под графиката, тоест лице на триъгълник.</p>
            <Formula
              latex={String.raw`U=A=\int_0^Q\frac{q}{C}\,dq
              =\frac{Q^2}{2C}
              =\frac12Q\Delta V`}
            />
          </SolutionPart>

          <SolutionPart label="e" title="Проверка със средното напрежение">
            <p>
              Средната стойност на линейно нарастваща величина е половината от крайната.
            </p>
            <Formula latex={String.raw`\langle\Delta V\rangle=\frac12\Delta V,\qquad U=\langle\Delta V\rangle Q=\frac12Q\Delta V`} />
          </SolutionPart>

          <SolutionPart label="f" title="Трите форми на енергията">
            <p>Замествайки <RichText text={String.raw`$Q=C\Delta V$`} />, получаваме:</p>
            <Formula latex={String.raw`\boxed{U=\frac12Q\Delta V=\frac12C(\Delta V)^2=\frac{Q^2}{2C}}`} />
          </SolutionPart>

          <SolutionPart label="g" title="Енергията е разпределена в полето">
            <p>
              За плосък кондензатор използваме <RichText text={String.raw`$C=\varepsilon_0S/d$`} /> и{" "}
              <RichText text={String.raw`$\Delta V=Ed$`} />.
            </p>
            <Formula
              latex={String.raw`U=\frac12\frac{\varepsilon_0S}{d}(Ed)^2
              =\frac12\varepsilon_0E^2(Sd),\qquad
              \boxed{u=\frac{U}{Sd}=\frac12\varepsilon_0E^2}`}
            />
            <ResultBox>
              Множителят <RichText text="$Sd$" /> е обемът между плочите. Енергията може да
              се мисли като разпределена в самото електрично поле.
            </ResultBox>
          </SolutionPart>
        </Solution>
      </Section>

      <Section id="coax-flat" n="§2" title="Кога коаксиалният кондензатор става плосък?">
        <ProblemStatement>
          <p>
            Коаксиален кондензатор има <RichText text={String.raw`$a=5{,}0\,\mathrm{mm}$`} /> и{" "}
            <RichText text={String.raw`$L=1{,}0\,\mathrm m$`} />. Поставете <RichText text="$b=a+d$" /> и{" "}
            <RichText text="$x=d/a$" />.
          </p>
          <ol className="list-[lower-alpha] space-y-2 pl-6">
            <li>Запишете точния капацитет чрез <RichText text="$x$" />.</li>
            <li>Разложете логаритъма и обърнете реда до член от ред <RichText text="$x^2$" />.</li>
            <li>Свържете водещия член с вътрешната площ, а линейната поправка със средния радиус.</li>
            <li>Намерете относителните грешки на двете плоски апроксимации.</li>
            <li>Сравнете точните грешки с реда за <RichText text="$x=0{,}1$" /> и <RichText text="$x=0{,}01$" />.</li>
          </ol>
        </ProblemStatement>

        <div className="mt-6">
          <ProblemContextPhoto
            src={coaxialConnectorPhoto}
            alt="Близък план на F-конектор върху коаксиален кабел с видими централен проводник, диелектрик и метален корпус"
            eyebrow="Физическият обект"
            title="Коаксиалната геометрия в телевизионния кабел"
            caption="Медното жило продължава като централен проводник, диелектрикът пази разстоянието до външния екран, а екранировката се свързва с металния корпус на F-конектора. Това е реалният обект зад радиусите в задачата."
            credit="Colin / Wikimedia Commons"
            creditHref="https://commons.wikimedia.org/wiki/File:F_Connector_Side.jpg"
            license="CC BY-SA 3.0"
            licenseHref="https://creativecommons.org/licenses/by-sa/3.0/"
          />
        </div>

        <div className="mt-6">
          <PredictionQuestion
            prompt={String.raw`Коя плоска площ очаквате да премахне грешката от първи ред по $d/a$?`}
            options={[
              {
                text: String.raw`Площта при средния радиус $a+d/2$`,
                correct: true,
                why: String.raw`Средният радиус включва точно линейната поправка $1+x/2$ към водещия член.`,
              },
              {
                text: String.raw`Площта при вътрешния радиус $a$`,
                correct: false,
                why: String.raw`Тази площ дава само водещия член и оставя относителна грешка $-x/2+O(x^2)$.`,
              },
              {
                text: "И двете имат една и съща грешка",
                correct: false,
                why: String.raw`Едната грешка е линейна по $x$, а другата започва от $x^2$.`,
              },
            ]}
            explanation={String.raw`Средният радиус не е геометрична догадка. Той се появява като първата поправка от реда на Тейлър.`}
          />
        </div>

        <div className="mt-6">
          <CoaxialApproximationLab />
        </div>

        <Solution
          hint={
            <RichText
              text={String.raw`Въведете $x=d/a$ и започнете от $\ln(1+x)$. След това обърнете получения ред, като пазите членовете до $x^2$.`}
            />
          }
        >
          <SolutionPart label="a" title="Точната формула чрез малкия параметър">
            <p>Понеже <RichText text="$b/a=(a+d)/a=1+x$" />, точната формула става:</p>
            <Formula latex={String.raw`\boxed{C=\frac{2\pi\varepsilon_0L}{\ln(1+x)}}`} />
          </SolutionPart>

          <SolutionPart label="b" title="Обръщане на реда">
            <p>Отделяме водещия множител <RichText text="$x$" />:</p>
            <Formula
              latex={String.raw`\ln(1+x)=x\left(1-\frac{x}{2}+\frac{x^2}{3}+O(x^3)\right)`}
            />
            <p>
              Прилагаме <RichText text="$(1+y)^{-1}=1-y+y^2+O(y^3)$" /> към израза в
              скобите.
            </p>
            <Formula
              latex={String.raw`\left(1-\frac{x}{2}+\frac{x^2}{3}\right)^{-1}
              =1+\frac{x}{2}-\frac{x^2}{12}+O(x^3)`}
            />
            <Formula
              latex={String.raw`\boxed{C=\frac{2\pi\varepsilon_0aL}{d}
              \left(1+\frac{x}{2}-\frac{x^2}{12}+O(x^3)\right)}`}
            />
          </SolutionPart>

          <SolutionPart label="c" title="Вътрешна площ и среден радиус">
            <p>Само водещият член дава плосък кондензатор с вътрешната цилиндрична площ.</p>
            <Formula latex={String.raw`C_{\text{вътр}}=\frac{2\pi\varepsilon_0aL}{d}=\frac{\varepsilon_0(2\pi aL)}{d}`} />
            <p>Добавянето на линейната поправка заменя <RichText text="$a$" /> със средния радиус.</p>
            <Formula
              latex={String.raw`\frac{2\pi\varepsilon_0aL}{d}\left(1+\frac{x}{2}\right)
              =\frac{2\pi\varepsilon_0L}{d}\left(a+\frac d2\right)
              =C_{\text{ср}}`}
            />
          </SolutionPart>

          <SolutionPart label="d" title="Ред на относителните грешки">
            <Formula
              latex={String.raw`\frac{C_{\text{вътр}}-C}{C}
              =\frac{\ln(1+x)}{x}-1
              =-\frac{x}{2}+\frac{x^2}{3}+O(x^3)`}
            />
            <Formula
              latex={String.raw`\frac{C_{\text{ср}}-C}{C}
              =\left(1+\frac{x}{2}\right)\frac{\ln(1+x)}{x}-1
              =\frac{x^2}{12}+O(x^3)`}
            />
            <ResultBox>
              Вътрешната площ има грешка от ред <RichText text="$x$" />, а средният радиус{" "}
              от ред <RichText text="$x^2$" />.
            </ResultBox>
          </SolutionPart>

          <SolutionPart label="e" title="Числена проверка">
            <div className="overflow-x-auto rounded-[10px] border-[1.5px] border-ink bg-surface shadow-hard-sm">
              <table className="w-full min-w-[620px] border-collapse text-[13.5px]">
                <thead className="bg-hl">
                  <tr>
                    <th className="p-3 text-left"><RichText text="$x$" /></th>
                    <th className="p-3 text-left">Вътр. точна</th>
                    <th className="p-3 text-left">Вътр. ред</th>
                    <th className="p-3 text-left">Средна точна</th>
                    <th className="p-3 text-left">Средна ред</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule">
                  <tr>
                    <td className="p-3"><RichText text="$0{,}1$" /></td>
                    <td className="p-3"><RichText text={String.raw`$-4{,}6898\%$`} /></td>
                    <td className="p-3"><RichText text={String.raw`$-4{,}6667\%$`} /></td>
                    <td className="p-3"><RichText text={String.raw`$+0{,}07569\%$`} /></td>
                    <td className="p-3"><RichText text={String.raw`$+0{,}08333\%$`} /></td>
                  </tr>
                  <tr>
                    <td className="p-3"><RichText text="$0{,}01$" /></td>
                    <td className="p-3"><RichText text={String.raw`$-0{,}49669\%$`} /></td>
                    <td className="p-3"><RichText text={String.raw`$-0{,}49667\%$`} /></td>
                    <td className="p-3"><RichText text={String.raw`$+0{,}000825\%$`} /></td>
                    <td className="p-3"><RichText text={String.raw`$+0{,}000833\%$`} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              При десетократно намаляване на <RichText text="$d/a$" /> първата грешка
              намалява около <RichText text="$10$" /> пъти, а втората около <RichText text="$100$" /> пъти.
            </p>
          </SolutionPart>
        </Solution>
      </Section>

      <Section id="breakdown" n="§3" title="По-дебелата изолация винаги ли пази от пробив?">
        <ProblemStatement>
          <p>
            Въздушен коаксиален кабел има фиксиран външен радиус <RichText text={String.raw`$b=10\,\mathrm{mm}$`} /> и
            пробивно поле <RichText text={String.raw`$E_{\mathrm{crit}}=3{,}0\,\mathrm{MV/m}$`} />. Търсим{" "}
            радиуса <RichText text="$a$" />, който дава най-високо пробивно напрежение.
          </p>
          <ol className="list-[lower-alpha] space-y-2 pl-6">
            <li>Изведете <RichText text="$E(r)$" /> от потенциалната разлика.</li>
            <li>Сравнете максималното поле при <RichText text={String.raw`$10\,\mathrm{kV}$`} /> за <RichText text={String.raw`$a=1{,}0\,\mathrm{mm}$`} /> и <RichText text={String.raw`$a=0{,}5\,\mathrm{mm}$`} />.</li>
            <li>Намерете аналитично радиуса за максимално пробивно напрежение.</li>
            <li>Пресметнете оптимума и проверете кабел с <RichText text={String.raw`$a=1{,}0\,\mathrm{mm}$`} />.</li>
            <li>Оценете чувствителността при отклонение <RichText text={String.raw`$\pm20\%$`} />.</li>
          </ol>
        </ProblemStatement>

        <div className="mt-6">
          <PredictionQuestion
            prompt="Ако направим вътрешното жило все по-тънко при фиксиран външен радиус, какво става с максималното поле при дадено напрежение?"
            options={[
              {
                text: "След определен момент нараства",
                correct: true,
                why: String.raw`Междината расте, но множителят $1/a$ концентрира полето при повърхността на тънкото жило.`,
              },
              {
                text: "Винаги намалява",
                correct: false,
                why: String.raw`Това отчита само ширината на междината и пропуска радиалната концентрация $E\propto1/r$.`,
              },
              {
                text: "Не се променя",
                correct: false,
                why: String.raw`Формулата съдържа едновременно $a$ и $\ln(b/a)$, така че зависимостта не е постоянна.`,
              },
            ]}
            explanation={String.raw`Състезават се два ефекта: по-голяма междина и по-силна концентрация на полето около тънкото жило.`}
          />
        </div>

        <div className="mt-6">
          <BreakdownOptimizationLab />
        </div>

        <Solution
          hint={
            <RichText
              text={String.raw`Първо намерете къде $E(r)$ е максимално. После оптимизирайте $\Delta V_{\mathrm{crit}}(a)=E_{\mathrm{crit}}a\ln(b/a)$ по $a$.`}
            />
          }
        >
          <SolutionPart label="a" title="Полето и мястото на максимума">
            <p>
              За коаксиален цилиндър <RichText text={String.raw`$E(r)=\lambda/(2\pi\varepsilon_0r)$`} />.
              Интегрирането между двата проводника дава:
            </p>
            <Formula
              latex={String.raw`\Delta V=\int_a^b E(r)\,dr
              =\frac{\lambda}{2\pi\varepsilon_0}\ln\frac ba,\qquad
              \boxed{E(r)=\frac{\Delta V}{r\ln(b/a)}}`}
            />
            <p>
              Понеже полето спада като <RichText text="$1/r$" />, то е най-силно при{" "}
              вътрешната повърхност <RichText text="$r=a$" />.
            </p>
          </SolutionPart>

          <SolutionPart label="b" title="Проверка на идеята за по-тънко жило">
            <Formula
              latex={String.raw`E_{\max}(a=1{,}0\,\mathrm{mm})
              =\frac{10^4}{10^{-3}\ln 10}
              =4{,}34\,\mathrm{MV/m}`}
            />
            <Formula
              latex={String.raw`E_{\max}(a=0{,}5\,\mathrm{mm})
              =\frac{10^4}{0{,}5\times10^{-3}\ln 20}
              =6{,}68\,\mathrm{MV/m}`}
            />
            <p>
              Междината се увеличава, но полето става по-силно. Факторът <RichText text="$1/a$" />
              расте по-бързо, отколкото логаритъмът го компенсира.
            </p>
          </SolutionPart>

          <SolutionPart label="c" title="Аналитичен максимум">
            <p>При пробив <RichText text={String.raw`$E(a)=E_{\mathrm{crit}}$`} />, следователно:</p>
            <Formula latex={String.raw`\Delta V_{\mathrm{crit}}(a)=E_{\mathrm{crit}}a\ln\frac ba`} />
            <Formula
              latex={String.raw`\frac{d\Delta V_{\mathrm{crit}}}{da}
              =E_{\mathrm{crit}}\left(\ln\frac ba-1\right)=0
              \quad\Longrightarrow\quad
              \boxed{a_{\mathrm{opt}}=\frac be}`}
            />
            <p>
              Втората производна е <RichText text={String.raw`$-E_{\mathrm{crit}}/a<0$`} />, затова
              стационарната точка е максимум.
            </p>
          </SolutionPart>

          <SolutionPart label="d" title="Числен резултат">
            <Formula
              latex={String.raw`a_{\mathrm{opt}}=\frac{10\,\mathrm{mm}}{e}=3{,}68\,\mathrm{mm},\qquad
              \Delta V_{\max}=\frac{E_{\mathrm{crit}}b}{e}=11{,}0\,\mathrm{kV}`}
            />
            <p>
              При <RichText text={String.raw`$a=1{,}0\,\mathrm{mm}$`} /> пробивното напрежение е само{" "}
              <RichText text={String.raw`$6{,}91\,\mathrm{kV}$`} />. Следователно кабелът не издържа{" "}
              <RichText text={String.raw`$10\,\mathrm{kV}$`} />.
            </p>
          </SolutionPart>

          <SolutionPart label="e" title="Производствен допуск">
            <p>
              Нека <RichText text={String.raw`$a=y\,a_{\mathrm{opt}}$`} />. Нормализираното пробивно
              напрежение е:
            </p>
            <Formula latex={String.raw`\frac{\Delta V_{\mathrm{crit}}}{\Delta V_{\max}}=y(1-\ln y)`} />
            <p>
              За <RichText text="$y=1{,}2$" /> спадът е <RichText text={String.raw`$1{,}9\%$`} />, а за{" "}
              <RichText text="$y=0{,}8$" /> е <RichText text={String.raw`$2{,}2\%$`} />.
            </p>
            <ResultBox>
              Оптимумът е реален, но е благоприятно плосък: отклонение от{" "}
              <RichText text={String.raw`$20\%$`} /> в радиуса намалява пробивното напрежение само
              с около <RichText text={String.raw`$2\%$`} />.
            </ResultBox>
          </SolutionPart>
        </Solution>
      </Section>

      <Section id="plates" n="§4" title="Дърпаме плочите, а енергията намалява?">
        <ProblemStatement>
          <p>
            Плосък кондензатор има <RichText text={String.raw`$S=100\,\mathrm{cm^2}$`} />,{" "}
            <RichText text={String.raw`$d_1=1{,}0\,\mathrm{mm}$`} /> и начално напрежение{" "}
            <RichText text={String.raw`$1000\,\mathrm V$`} />. Раздалечаваме плочите бавно до{" "}
            <RichText text={String.raw`$d_2=3{,}0\,\mathrm{mm}$`} />.
          </p>
          <p className="font-semibold">Случай А: кондензаторът е изключен, <RichText text={String.raw`$Q=\mathrm{const}$`} />.</p>
          <ol className="list-[lower-alpha] space-y-2 pl-6">
            <li>Намерете <RichText text={String.raw`$C_1,Q,C_2,\Delta V_2$`} /> и промяната на енергията.</li>
            <li>Намерете силата, външната работа и проверете баланса.</li>
          </ol>
          <p className="font-semibold">Случай Б: кондензаторът остава свързан, <RichText text={String.raw`$\Delta V=\mathrm{const}$`} />.</p>
          <ol className="list-[lower-alpha] space-y-2 pl-6" start={3}>
            <li>Намерете <RichText text="$C_2,Q_2$" /> и промяната на енергията.</li>
            <li>Намерете енергията, върната към източника, и външната работа.</li>
            <li>Проследете с думи всеки джаул.</li>
          </ol>
        </ProblemStatement>

        <div className="mt-6">
          <ProblemContextPhoto
            src={parallelPlatePhoto}
            alt="Реален учебен плосък кондензатор с две кръгли метални плочи и регулируемо разстояние между тях"
            eyebrow="От модела към лабораторията"
            title="Плочите не са само идеализация"
            caption="При този учебен кондензатор разстоянието между металните плочи се настройва механично. Същата промяна на геометрията стои в центъра на задачата за силата, работата и енергийния баланс."
            credit="Hannes Grobe / Wikimedia Commons"
            creditHref="https://commons.wikimedia.org/wiki/File:Plattenkondensator_hg.jpg"
            license="CC BY 3.0"
            licenseHref="https://creativecommons.org/licenses/by/3.0/"
          />
        </div>

        <div className="mt-6">
          <PredictionQuestion
            prompt="При свързан източник раздалечаваме плочите. Как се променя енергията на самия кондензатор?"
            options={[
              {
                text: "Намалява",
                correct: true,
                why: String.raw`При фиксирано напрежение $U=C V^2/2$, а $C=\varepsilon_0S/d$ намалява.`,
              },
              {
                text: "Нараства, защото външната сила върши положителна работа",
                correct: false,
                why: String.raw`Кондензаторът не е затворена система. Част от енергията и външната работа се връщат към източника.`,
              },
              {
                text: "Остава постоянна",
                correct: false,
                why: String.raw`Напрежението е постоянно, но капацитетът намалява, затова $U=CV^2/2$ не остава постоянно.`,
              },
            ]}
            explanation={String.raw`Знакът на външната работа не определя самостоятелно промяната на енергията, когато има трети участник.`}
          />
        </div>

        <div className="mt-6">
          <PlateEnergyLab />
        </div>

        <Solution
          hint={
            <RichText
              text={String.raw`Разделете двата случая още в началото: при изключен кондензатор $Q=\mathrm{const}$, а при свързан източник $\Delta V=\mathrm{const}$.`}
            />
          }
        >
          <SolutionPart label="A-a" title="Изключен кондензатор: начално и крайно състояние">
            <Formula
              latex={String.raw`C_1=\frac{\varepsilon_0S}{d_1}=88{,}5\,\mathrm{pF},\qquad
              Q=C_1\Delta V_1=88{,}5\,\mathrm{nC}`}
            />
            <Formula
              latex={String.raw`C_2=\frac{\varepsilon_0S}{d_2}=29{,}5\,\mathrm{pF},\qquad
              \Delta V_2=\frac{Q}{C_2}=3000\,\mathrm V`}
            />
            <Formula
              latex={String.raw`U_1=44{,}3\,\mu\mathrm J,\qquad
              U_2=133\,\mu\mathrm J,\qquad
              \boxed{U_2-U_1=+88{,}5\,\mu\mathrm J}`}
            />
          </SolutionPart>

          <SolutionPart label="A-b" title="Сила и външна работа">
            <p>
              Върху едната плоча действа само полето на другата,{" "}
              <RichText text={String.raw`$E_{\text{чуждо}}=\sigma/(2\varepsilon_0)$`} />.
            </p>
            <Formula
              latex={String.raw`F=Q\frac{\sigma}{2\varepsilon_0}
              =\frac{Q^2}{2\varepsilon_0S}
              =44{,}3\,\mathrm{mN}`}
            />
            <p>При постоянни <RichText text="$Q$" /> и <RichText text="$S$" /> силата не зависи от разстоянието.</p>
            <Formula
              latex={String.raw`A_{\text{вън}}=F(d_2-d_1)
              =44{,}3\,\mathrm{mN}\cdot2{,}0\,\mathrm{mm}
              =88{,}5\,\mu\mathrm J=U_2-U_1`}
            />
          </SolutionPart>

          <SolutionPart label="Б-c" title="Свързан източник: зарядът и енергията намаляват">
            <Formula
              latex={String.raw`C_2=29{,}5\,\mathrm{pF},\qquad
              Q_2=C_2\Delta V=29{,}5\,\mathrm{nC}`}
            />
            <Formula
              latex={String.raw`U_2=\frac12C_2(\Delta V)^2=14{,}8\,\mu\mathrm J,\qquad
              \boxed{U_2-U_1=-29{,}5\,\mu\mathrm J}`}
            />
          </SolutionPart>

          <SolutionPart label="Б-d" title="Източник и външна работа">
            <p>Към източника се връща заряд <RichText text={String.raw`$Q_1-Q_2=59{,}0\,\mathrm{nC}$`} />.</p>
            <Formula
              latex={String.raw`E_{\text{към източника}}
              =\Delta V(Q_1-Q_2)=59{,}0\,\mu\mathrm J`}
            />
            <p>Работата на източника върху системата е отрицателна. От баланса:</p>
            <Formula
              latex={String.raw`A_{\text{вън}}+A_{\text{изт}}=U_2-U_1,\qquad
              A_{\text{вън}}=-29{,}5-(-59{,}0)=+29{,}5\,\mu\mathrm J`}
            />
          </SolutionPart>

          <SolutionPart label="Б-e" title="Проследяване на енергията">
            <ResultBox>
              Външната сила внася <RichText text={String.raw`$29{,}5\,\mu\mathrm J$`} />. Полето губи{" "}
              още <RichText text={String.raw`$29{,}5\,\mu\mathrm J$`} />. Сборът{" "}
              <RichText text={String.raw`$59{,}0\,\mu\mathrm J$`} /> се прибира от източника.
              Кондензаторът сам по себе си не е затворена система.
            </ResultBox>
          </SolutionPart>
        </Solution>
      </Section>

      <Section id="missing-energy" n="§5" title="Парадоксът на изчезналата енергия">
        <ProblemStatement>
          <p>
            Два еднакви кондензатора с капацитет <RichText text="$C$" /> са изолирани от
            източници. Първият е зареден до <RichText text={String.raw`$\Delta V_0$`} />, вторият е
            незареден. Свързваме едноименните плочи с проводници с общо съпротивление{" "}
            <RichText text="$R$" />.
          </p>
          <ol className="list-[lower-alpha] space-y-2 pl-6">
            <li>Намерете крайното общо напрежение.</li>
            <li>Сравнете началната и крайната полева енергия.</li>
            <li>Интегрирайте <RichText text="$I^2R$" /> при дадения ток.</li>
            <li>Обяснете границата <RichText text={String.raw`$R\to0$`} />.</li>
            <li>Обобщете за различни капацитети и начални напрежения.</li>
          </ol>
        </ProblemStatement>

        <div className="mt-6">
          <PredictionQuestion
            prompt="Зарядът на изолираната двойка се запазва. Запазва ли се и електростатичната енергия?"
            options={[
              {
                text: "Не, част се превръща в топлина и излъчване",
                correct: true,
                why: String.raw`Запазването на заряд не налага запазване на полевата енергия. Преходният ток пренася енергия към други форми.`,
              },
              {
                text: "Да, защото системата е изолирана от източници",
                correct: false,
                why: String.raw`Изолацията от източници пази общия заряд, но вътрешното съпротивление може да отдели топлина.`,
              },
              {
                text: String.raw`Да, но само ако $R$ е малко`,
                correct: false,
                why: String.raw`По-малкото $R$ скъсява процеса и увеличава тока. Интегралът $\int I^2R\,dt$ остава същият.`,
              },
            ]}
            explanation={String.raw`Енергията на цялата физична система се запазва, но електростатичната й част намалява.`}
          />
        </div>

        <div className="mt-6">
          <SharingEnergyLab />
        </div>

        <Solution
          hint={
            <RichText
              text={String.raw`Използвайте запазването на общия заряд за крайното напрежение. За липсващата енергия пресметнете $\int_0^\infty I^2R\,dt$.`}
            />
          }
        >
          <SolutionPart label="a" title="Крайно напрежение">
            <p>
              Общият заряд е <RichText text={String.raw`$Q_{\text{общ}}=C\Delta V_0$`} />, а след
              свързването общият капацитет е <RichText text="$2C$" />.
            </p>
            <Formula latex={String.raw`\boxed{\Delta V_f=\frac{C\Delta V_0}{2C}=\frac{\Delta V_0}{2}}`} />
          </SolutionPart>

          <SolutionPart label="b" title="Половината полева енергия липсва">
            <Formula
              latex={String.raw`U_i=\frac12C(\Delta V_0)^2,\qquad
              U_f=2\cdot\frac12C\left(\frac{\Delta V_0}{2}\right)^2
              =\frac14C(\Delta V_0)^2`}
            />
            <Formula
              latex={String.raw`\boxed{U_{\text{загуба}}=U_i-U_f
              =\frac14C(\Delta V_0)^2=\frac12U_i}`}
            />
          </SolutionPart>

          <SolutionPart label="c" title="Интегралът на джауловата топлина">
            <Formula
              latex={String.raw`I(t)=\frac{\Delta V_0}{R}\exp\left(-\frac{2t}{RC}\right)`}
            />
            <Formula
              latex={String.raw`\int_0^\infty I^2R\,dt
              =\frac{(\Delta V_0)^2}{R}
              \int_0^\infty e^{-4t/(RC)}\,dt
              =\frac14C(\Delta V_0)^2`}
            />
            <p>
              При по-малко <RichText text="$R$" /> токът е по-голям, но времето е
              пропорционално по-кратко. Точно затова крайният интеграл не зависи от
              съпротивлението.
            </p>
          </SolutionPart>

          <SolutionPart label="d" title={String.raw`Сингулярната граница $R\to0$`}>
            <p>
              Когато <RichText text={String.raw`$R\to0$`} />, токът става все по-голям и все по-кратък,
              но пренесената енергия остава крайна. Реалната верига винаги има паразитно
              съпротивление и индуктивност. При много малко съпротивление част от енергията
              се излъчва като електромагнитна вълна. Идеалният проводник не създава ново
              крайно състояние с възстановена полева енергия.
            </p>
          </SolutionPart>

          <SolutionPart label="e" title={String.raw`Произволни $C_1$, $C_2$, $\Delta V_1$ и $\Delta V_2$`}>
            <p>При еднаква полярност запазването на заряда дава:</p>
            <Formula
              latex={String.raw`\Delta V_f=\frac{C_1\Delta V_1+C_2\Delta V_2}{C_1+C_2}`}
            />
            <p>След заместване в <RichText text="$U_i-U_f$" /> и съкращаване:</p>
            <Formula
              latex={String.raw`\boxed{U_{\text{загуба}}
              =\frac12\frac{C_1C_2}{C_1+C_2}
              (\Delta V_1-\Delta V_2)^2}`}
            />
            <p>
              Загуба няма само при равни начални напрежения. При противоположна полярност
              разликата се заменя със сумата <RichText text={String.raw`$\Delta V_1+\Delta V_2$`} />.
            </p>
          </SolutionPart>
        </Solution>
      </Section>

      <Section id="concentration" n="§6" title="Бонус: половината енергия в един процент от обема">
        <ProblemStatement>
          <p>
            Коаксиален кондензатор има радиуси <RichText text="$a$" /> и <RichText text="$b$" />,
            заряд <RichText text="$Q$" /> и дължина <RichText text="$L$" />. Използвайте
            плътността <RichText text={String.raw`$u=\varepsilon_0E^2/2$`} />.
          </p>
          <ol className="list-[lower-alpha] space-y-2 pl-6">
            <li>Намерете енергията в тънък слой от <RichText text="$r$" /> до <RichText text="$r+dr$" />.</li>
            <li>Намерете дела на енергията между <RichText text="$a$" /> и <RichText text="$r$" />.</li>
            <li>Изведете радиуса, който съдържа половината енергия.</li>
            <li>За <RichText text={String.raw`$a=1\,\mathrm{mm}$`} /> и <RichText text={String.raw`$b=100\,\mathrm{mm}$`} /> сравнете енергийния и обемния дял.</li>
            <li>Сравнете с плосък кондензатор.</li>
          </ol>
        </ProblemStatement>

        <div className="mt-6">
          <PredictionQuestion
            prompt="Къде е радиусът, който огражда половината енергия на коаксиалния кондензатор?"
            options={[
              {
                text: String.raw`При геометричната средна $\sqrt{ab}$`,
                correct: true,
                why: String.raw`Енергията се натрупва като $\ln(r/a)$, затова половината логаритъм дава $r=\sqrt{ab}$.`,
              },
              {
                text: String.raw`При аритметичната средна $(a+b)/2$`,
                correct: false,
                why: String.raw`Това би било естествено при линейно разпределение по радиуса, но тук $dU\propto dr/r$.`,
              },
              {
                text: "При радиус, ограждащ половината обем",
                correct: false,
                why: String.raw`Полето е по-силно близо до вътрешното жило, затова енергийният и обемният дял не съвпадат.`,
              },
            ]}
            explanation={String.raw`Логаритмичното натрупване превръща средата по логаритмична скала в геометрична средна.`}
          />
        </div>

        <div className="mt-6">
          <EnergyConcentrationLab />
        </div>

        <Solution
          hint={
            <RichText
              text={String.raw`За цилиндричен слой използвайте $d\mathcal V=2\pi rL\,dr$. Понеже $E\propto1/r$, енергията на слоя е пропорционална на $dr/r$.`}
            />
          }
        >
          <SolutionPart label="a" title="Енергия в тънък цилиндричен слой">
            <p>
              Полето и обемът на слой с дебелина <RichText text="$dr$" /> са:
            </p>
            <Formula
              latex={String.raw`E(r)=\frac{Q}{2\pi\varepsilon_0Lr},\qquad
              d\mathcal V=2\pi rL\,dr`}
            />
            <Formula
              latex={String.raw`dU=u\,d\mathcal V
              =\frac12\varepsilon_0E^2\,2\pi rL\,dr
              =\frac{Q^2}{4\pi\varepsilon_0L}\frac{dr}{r}`}
            />
            <p>
              Един множител <RichText text="$r$" /> от обема съкращава единия от двата
              множителя <RichText text="$r$" /> в <RichText text="$E^2$" />.
            </p>
          </SolutionPart>

          <SolutionPart label="b" title="Дял от пълната енергия">
            <p>Интегралът на <RichText text="$dr/r$" /> е логаритъм.</p>
            <Formula
              latex={String.raw`U(a<r'<r)\propto\ln\frac ra,\qquad
              U_{\text{общо}}\propto\ln\frac ba`}
            />
            <Formula
              latex={String.raw`\boxed{\frac{U(a<r'<r)}{U_{\text{общо}}}
              =\frac{\ln(r/a)}{\ln(b/a)}}`}
            />
          </SolutionPart>

          <SolutionPart label="c" title="Радиусът на половината енергия">
            <Formula
              latex={String.raw`\frac{\ln(r_{1/2}/a)}{\ln(b/a)}=\frac12
              \quad\Longrightarrow\quad
              \ln\frac{r_{1/2}}a=\ln\sqrt{\frac ba}`}
            />
            <Formula latex={String.raw`\boxed{r_{1/2}=\sqrt{ab}}`} />
          </SolutionPart>

          <SolutionPart label="d" title={String.raw`Половината енергия в $0{,}99\%$ от обема`}>
            <Formula latex={String.raw`r_{1/2}=\sqrt{1\cdot100}\,\mathrm{mm}=10\,\mathrm{mm}`} />
            <Formula
              latex={String.raw`\frac{\mathcal V(a<r<r_{1/2})}{\mathcal V(a<r<b)}
              =\frac{r_{1/2}^2-a^2}{b^2-a^2}
              =\frac{10^2-1^2}{100^2-1^2}
              =0{,}00990=0{,}99\%`}
            />
          </SolutionPart>

          <SolutionPart label="e" title="Сравнение с плоския кондензатор">
            <p>
              При идеален плосък кондензатор полето е еднородно и{" "}
              <RichText text={String.raw`$u=\varepsilon_0E^2/2$`} /> е постоянно. Половината енергия е
              в половината обем. При коаксиалния кондензатор полето расте силно към
              вътрешното жило и енергията се концентрира там.
            </p>
            <ResultBox>
              Практическото следствие е, че изолацията около вътрешното жило е най-критична
              както за пробива, така и за локалното енергийно натоварване.
            </ResultBox>
          </SolutionPart>
        </Solution>
      </Section>

      <Section id="recap" n="§7" title="Какво трябва да остане след задачите">
        <div className="rounded-[10px] border-[1.5px] border-ink bg-ink px-5 py-5 text-white shadow-hard">
          <p className="text-[11px] font-bold uppercase tracking-[.18em] text-hl">Обобщение</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px]">
            <li>Множителят <RichText text="$1/2$" /> в енергията идва от линейното нарастване на напрежението.</li>
            <li>Средният радиус на тънък коаксиален кондензатор е резултат от реда на Тейлър.</li>
            <li>Пробивът се определя от максималното локално поле, не само от дебелината на междината.</li>
            <li>При механична промяна първо решете дали е постоянен зарядът или напрежението.</li>
            <li>Запазването на заряд не означава запазване на електростатичната енергия.</li>
            <li>При нееднородно поле енергията може да е концентрирана в много малък обем.</li>
          </ul>
        </div>
        <div className="mt-6 flex flex-wrap gap-4 text-[14.5px] font-semibold">
          <Link href="/zadachi" className="text-minus hover:underline">
            ← Всички задачи
          </Link>
          <Link href="/physics/elektrichestvo/kondenzatori" className="text-minus hover:underline">
            Урокът за кондензатори →
          </Link>
          <Link href="/physics/elektrichestvo/dielektrici" className="text-minus hover:underline">
            Следва: диелектрици →
          </Link>
        </div>
      </Section>
    </main>
  );
}
