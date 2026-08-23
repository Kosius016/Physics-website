import Link from "next/link";
import Formula from "@/components/Formula";
import LessonNav from "@/components/LessonNav";
import RichText from "@/components/RichText";
import Section from "@/components/Section";
import {
  CapacitanceLinearity,
  CapacitorNetworkExplorer,
  CapacitorNetworkReducer,
  ParallelPlateExplorer,
} from "@/components/interactives/CapacitorLabs";
import CapacitorProblemSet from "@/components/interactives/CapacitorProblemSet";
import {
  CoaxialCapacitorFigure,
  IsolatedSphereFigure,
  SphericalCapacitorFigure,
} from "@/components/interactives/CapacitorGeometryFigures";
import PredictionQuestion from "@/components/interactives/PredictionQuestion";
import {
  TeacherModeProvider,
  TeacherModeToggle,
  TeacherNote,
} from "@/components/interactives/TeacherMode";

export const metadata = {
  title: "Кондензатори: капацитет, свързване и енергия · SingularityLab",
};

const SECTION_NAV = [
  { id: "reservoir", n: "§1", label: "Резервоар" },
  { id: "ratio", n: "§2", label: "Защо C е константа" },
  { id: "parallel-plate", n: "§3", label: "Плосък" },
  { id: "geometries", n: "§4", label: "Геометрии" },
  { id: "parallel", n: "§5", label: "Успоредно" },
  { id: "series", n: "§6", label: "Последователно" },
  { id: "networks", n: "§7", label: "Вериги" },
  { id: "energy", n: "§8", label: "Енергия" },
  { id: "density", n: "§9", label: "Енергия в полето" },
  { id: "problems", n: "§10", label: "Задачи" },
] as const;

function Callout({
  title,
  children,
  tone = "blue",
}: {
  title: string;
  children: React.ReactNode;
  tone?: "blue" | "red" | "green";
}) {
  const border =
    tone === "red" ? "border-plus" : tone === "green" ? "border-ok" : "border-minus";
  const color = tone === "red" ? "text-plus" : tone === "green" ? "text-ok" : "text-minus";
  return (
    <div className={`my-5 rounded-r-lg border-l-4 ${border} bg-hl px-5 py-4`}>
      <p className={`mb-1.5 text-[11px] font-bold uppercase tracking-[.18em] ${color}`}>{title}</p>
      <div className="text-[15.5px] leading-relaxed text-ink/90">{children}</div>
    </div>
  );
}

export default function CapacitorsLessonPage() {
  return (
    <TeacherModeProvider>
      <main className="mx-auto max-w-3xl px-5 pb-24">
        <header className="pb-2 pt-11">
          <nav
            aria-label="Път до урока"
            className="flex flex-wrap items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-muted"
          >
            <Link
              href="/physics"
              className="rounded-sm transition-colors hover:text-minus focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-minus"
            >
              Физика
            </Link>
            <span aria-hidden="true">·</span>
            <Link
              href="/physics?level=university#electricity"
              className="rounded-sm transition-colors hover:text-minus focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-minus"
            >
              Електричество
            </Link>
          </nav>
          <h1 className="mb-3 mt-4 font-serif text-[clamp(36px,7vw,52px)] font-bold leading-[1.04] text-ink">
            Кондензатори: капацитет, свързване и енергия
          </h1>
          <p className="max-w-2xl text-[17px] leading-relaxed text-muted">
            Как геометрията определя колко заряд се съхранява на волт, как се опростяват вериги
            и къде всъщност се намира натрупаната енергия.
          </p>
        </header>

        <LessonNav items={SECTION_NAV} right={<TeacherModeToggle />} />

        <Section id="reservoir" n="§1" title="Резервоар за заряд">
          <p>
            В предишния урок видяхме, че един проводник е еквипотенциален. Ако му дадем заряд,
            потенциалът му се променя. Сега поставяме <strong>два</strong> проводника един срещу
            друг и ги зареждаме с <RichText text="$+Q$" /> и <RichText text="$-Q$" />. Така
            получаваме система, която съхранява заряд и енергия в полето между тях.
          </p>
          <p className="mt-4">
            Практическият въпрос не е само „колко заряд има“, а „колко заряд получаваме за
            дадена потенциална разлика“. Това отношение дефинира капацитета:
          </p>
          <div className="mt-4">
            <Formula
              latex={String.raw`C=\frac{Q}{\Delta V},\qquad
              [C]=\mathrm F=\frac{\mathrm C}{\mathrm V}`}
            />
          </div>
          <Callout title="Как да четете дефиницията">
            <p>
              Голям капацитет означава, че при един и същ волтаж системата побира повече
              заряд. Капацитетът не е самият заряд и не е напрежението, а коефициентът,
              който ги свързва.
            </p>
          </Callout>
          <TeacherNote>
            Попитайте какво би означавал капацитет <RichText text="$1\,\mathrm F$" /> с думи:
            един кулон заряд при един волт потенциална разлика. Подчертайте, че фарадът е
            много голяма единица за повечето лабораторни кондензатори.
          </TeacherNote>
        </Section>

        <Section id="ratio" n="§2" title="Защо капацитетът не зависи от заряда">
          <PredictionQuestion
            prompt="Удвояваме зарядите $+Q$ и $-Q$, без да променяме геометрията и средата. Какво става с потенциалната разлика?"
            options={[
              { text: "Удвоява се", correct: true },
              { text: "Остава същата", correct: false },
              { text: "Нараства четири пъти", correct: false },
            ]}
            explanation="Електростатиката е линейна: удвояването на всички източници удвоява полето, а интегралът на полето удвоява и потенциалната разлика. Следователно отношението $Q/V$ остава същото."
          />

          <div className="my-6">
            <CapacitanceLinearity />
          </div>

          <p>
            За фиксирана геометрия графиката <RichText text="$V(Q)$" /> е права през началото.
            Наклонът ѝ е <RichText text="$1/C$" />. Промяната на заряда движи работната точка
            по правата; промяната на геометрията или средата сменя самия наклон.
          </p>
          <Callout title="Условие за този извод" tone="red">
            <p>
              Говорим за линейна среда и напрежения под пробива. Ако материалът промени
              свойствата си с полето, отношението може да престане да е постоянно.
            </p>
          </Callout>
          <TeacherNote>
            Разграничете „<RichText text="$C$" /> не зависи от <RichText text="$Q$" />“ от
            „<RichText text="$C$" /> никога не се променя“. Плъзгачът за капацитет променя
            наклона и представя друга геометрия.
          </TeacherNote>
        </Section>

        <Section id="parallel-plate" n="§3" title="Плосък кондензатор">
          <p>
            Вземете две големи успоредни плочи с площ <RichText text="$A$" /> и разстояние{" "}
            <RichText text="$d$" />. Далеч от краищата полето между тях е почти еднородно.
            От урока за проводници знаем полето точно до повърхност:
          </p>
          <div className="mt-4">
            <Formula
              latex={String.raw`E=\frac{\sigma}{\varepsilon_0}
              =\frac{Q}{\varepsilon_0A}`}
            />
          </div>
          <p className="mt-4">
            Потенциалната разлика през еднородно поле е{" "}
            <RichText text={String.raw`$\Delta V=Ed$`} />. Заместваме и едва накрая делим
            заряда на напрежението:
          </p>
          <div className="mt-4">
            <Formula
              latex={String.raw`\Delta V=\frac{Qd}{\varepsilon_0A}
              \quad\Longrightarrow\quad
              \boxed{C=\frac{\varepsilon_0A}{d}}`}
            />
          </div>

          <div className="my-6">
            <ParallelPlateExplorer />
          </div>

          <Callout title="Кога формулата е добра">
            <p>
              Тя пренебрегва краевите ефекти. Нужни са плочи с линейни размери много
              по-големи от <RichText text="$d$" /> и достатъчно равномерно припокриване.
            </p>
          </Callout>
          <TeacherNote>
            Преди извеждането поискайте предсказание за зависимостта от площта и
            разстоянието. Добър диагностичен въпрос е защо две плочи с двойна площ могат да се
            разглеждат като два успоредно свързани кондензатора.
          </TeacherNote>
        </Section>

        <Section id="geometries" n="§4" title="Други геометрии">
          <p>
            Алгоритъмът не се променя: намерете полето от симетрията, интегрирайте го между
            проводниците, после използвайте <RichText text="$C=Q/\Delta V$" />.
          </p>

          <div className="mt-5 space-y-4">
            <div className="rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard-sm">
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-minus">
                Концентрични сфери
              </p>
              <p className="mt-2">
                Вътрешната сфера с радиус <RichText text="$R_1$" /> носи{" "}
                <RichText text="$+Q$" />, а концентричната черупка с вътрешен радиус{" "}
                <RichText text="$R_2$" /> носи <RichText text="$-Q$" />. Трите стъпки на
                алгоритъма изглеждат така:
              </p>
              <SphericalCapacitorFigure />

              <ol className="mt-4 list-decimal space-y-4 pl-5">
                <li>
                  <strong>Полето между проводниците.</strong> Гаусова сфера с радиус{" "}
                  <RichText text="$r$" /> между тях обхваща само <RichText text="$+Q$" />,
                  защото <RichText text="$-Q$" /> седи чак по повърхността{" "}
                  <RichText text="$R_2$" />. Сферичната симетрия прави{" "}
                  <RichText text="$E$" /> еднакво по цялата повърхност, затова излиза пред
                  интеграла:
                  <div className="mt-2">
                    <Formula
                      latex={String.raw`E(r)\cdot4\pi r^2=\frac{Q}{\varepsilon_0}
                      \quad\Longrightarrow\quad
                      E(r)=\frac{Q}{4\pi\varepsilon_0 r^2}=\frac{kQ}{r^2}`}
                    />
                  </div>
                </li>
                <li>
                  <strong>Напрежението между тях.</strong> Полето се мени по целия път, затова
                  разликата в потенциала е интеграл, а не произведение{" "}
                  <RichText text="$E\cdot(R_2-R_1)$" />. По радиален път{" "}
                  <RichText text="$\vec E$" /> и <RichText text="$d\vec l$" /> са успоредни:
                  <div className="mt-2">
                    <Formula
                      latex={String.raw`\Delta V=\int_{R_1}^{R_2}\frac{kQ}{r^2}\,dr
                      =kQ\left(\frac1{R_1}-\frac1{R_2}\right)
                      =kQ\,\frac{R_2-R_1}{R_1R_2}`}
                    />
                  </div>
                </li>
                <li>
                  <strong>Капацитетът.</strong> Остава дефиницията. Зарядът се съкращава, точно
                  както изисква §2, и накрая стои само геометрия:
                  <div className="mt-2">
                    <Formula
                      latex={String.raw`C=\frac{Q}{\Delta V}
                      =\frac{1}{k}\cdot\frac{R_1R_2}{R_2-R_1}
                      \quad\Longrightarrow\quad
                      \boxed{C=4\pi\varepsilon_0\frac{R_1R_2}{R_2-R_1}}`}
                    />
                  </div>
                </li>
              </ol>

              <p className="mt-4 text-[14.5px] text-muted">
                Проверка на границите: при много близки сфери{" "}
                <RichText text="$R_2-R_1\to0$" /> и капацитетът расте неограничено, също както{" "}
                <RichText text="$C=\varepsilon_0A/d$" /> при малко <RichText text="$d$" />.
              </p>
            </div>

            <div className="rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard-sm">
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-plus">
                Изолирана сфера
              </p>
              <p className="mt-2">
                Една самотна заредена сфера също е кондензатор, само че вторият ѝ проводник е{" "}
                <strong>безкрайността</strong>: там завършват силовите линии и там приемаме{" "}
                <RichText text="$V=0$" />. Формално това е предишният случай, в който
                отдалечаваме външната черупка неограничено, тоест{" "}
                <RichText text="$R_2\to\infty$" />.
              </p>
              <IsolatedSphereFigure />
              <p className="mt-3">
                В този предел <RichText text="$1/R_2\to0$" />, затова от скобата остава само{" "}
                <RichText text="$1/R_1$" />, а от дробта за капацитета остава самият радиус:
              </p>
              <div className="mt-3">
                <Formula
                  latex={String.raw`C=4\pi\varepsilon_0\frac{R_1R_2}{R_2-R_1}
                  =4\pi\varepsilon_0\frac{R_1}{1-R_1/R_2}
                  \ \xrightarrow[\;R_2\to\infty\;]{}\ 4\pi\varepsilon_0R`}
                />
              </div>
            </div>

            <div className="rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard-sm">
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-ok">
                Коаксиален цилиндър
              </p>
              <p className="mt-2">
                Жило с радиус <RichText text="$R_1$" /> и дължина <RichText text="$L$" /> носи{" "}
                <RichText text="$+Q$" />, оплетката с вътрешен радиус <RichText text="$R_2$" />{" "}
                носи <RichText text="$-Q$" />. Удобно е да работим с линейната плътност{" "}
                <RichText text="$\lambda=Q/L$" />. Същите три стъпки:
              </p>
              <CoaxialCapacitorFigure />

              <ol className="mt-4 list-decimal space-y-4 pl-5">
                <li>
                  <strong>Полето между проводниците.</strong> Гаусовата повърхност е коаксиален
                  цилиндър с радиус <RichText text="$r$" /> и дължина{" "}
                  <RichText text="$\ell$" />. През капаците му поток няма, защото полето е
                  радиално и само се плъзга по тях. Остава страничната стена с площ{" "}
                  <RichText text="$2\pi r\ell$" />:
                  <div className="mt-2">
                    <Formula
                      latex={String.raw`E(r)\cdot2\pi r\ell=\frac{\lambda\ell}{\varepsilon_0}
                      \quad\Longrightarrow\quad
                      E(r)=\frac{\lambda}{2\pi\varepsilon_0 r}`}
                    />
                  </div>
                  <p className="mt-2 text-[14.5px] text-muted">
                    Дължината <RichText text="$\ell$" /> се съкращава: тя беше само помощна и
                    краят на кабела не участва.
                  </p>
                </li>
                <li>
                  <strong>Напрежението между тях.</strong> Тук спадането е като{" "}
                  <RichText text="$1/r$" />, а не като <RichText text="$1/r^2$" />, затова
                  интегралът дава логаритъм:
                  <div className="mt-2">
                    <Formula
                      latex={String.raw`\Delta V=\int_{R_1}^{R_2}\frac{\lambda}{2\pi\varepsilon_0 r}\,dr
                      =\frac{\lambda}{2\pi\varepsilon_0}\ln\!\frac{R_2}{R_1}`}
                    />
                  </div>
                </li>
                <li>
                  <strong>Капацитетът.</strong> Заместваме{" "}
                  <RichText text="$\lambda=Q/L$" /> и зарядът пак се съкращава:
                  <div className="mt-2">
                    <Formula
                      latex={String.raw`C=\frac{Q}{\Delta V}
                      =\frac{\lambda L}{\dfrac{\lambda}{2\pi\varepsilon_0}\ln(R_2/R_1)}
                      \quad\Longrightarrow\quad
                      \boxed{C=\frac{2\pi\varepsilon_0L}{\ln(R_2/R_1)}}`}
                    />
                  </div>
                </li>
              </ol>

              <p className="mt-4 text-[14.5px] text-muted">
                В логаритъма влиза само <strong>отношението</strong> на радиусите, тоест чисто
                число: удвояването и на двата радиуса не променя капацитета. В метри трябва да
                е единствено дължината <RichText text="$L$" />.
              </p>
            </div>
          </div>
          <TeacherNote>
            При сферичния предел покажете защо <RichText text="$R_2/(R_2-R_1)\to1$" /> при{" "}
            <RichText text="$R_2\to\infty$" />. За коаксиалния резултат подчертайте, че се
            пренебрегват краищата на кабела.
          </TeacherNote>
        </Section>

        <Section id="parallel" n="§5" title="Успоредно свързване">
          <p>
            При успоредно свързване двата края на всеки кондензатор са свързани към една и съща
            двойка възли. Следователно потенциалната разлика е обща, а зарядите се сумират:
          </p>
          <div className="mt-4">
            <Formula
              latex={String.raw`V_1=V_2=\cdots=V,\qquad
              Q=\sum_iQ_i=\sum_iC_iV
              \quad\Longrightarrow\quad
              \boxed{C_e=\sum_iC_i}`}
            />
          </div>
          <PredictionQuestion
            prompt="Добавяме още един кондензатор успоредно. Еквивалентният капацитет ще стане:"
            options={[
              { text: "По-голям", correct: true },
              { text: "По-малък", correct: false },
              { text: "Зависи от напрежението", correct: false },
            ]}
            explanation="Успоредният клон добавя още възможност за съхраняване на заряд при същото напрежение. Затова всички положителни капацитети се събират."
          />
          <TeacherNote>
            Полезна проверка: <RichText text="$C_e$" /> трябва да е по-голям от всеки отделен
            капацитет. Ако не е, свързването вероятно е разпознато грешно.
          </TeacherNote>
        </Section>

        <Section id="series" n="§6" title="Последователно свързване">
          <p>
            При последователно свързване средните проводници са изолирани. Ако първоначално са
            неутрални, зарядът по двете им повърхности трябва да се компенсира. Така
            големината на заряда е обща, а потенциалните разлики се сумират:
          </p>
          <div className="mt-4">
            <Formula
              latex={String.raw`Q_1=Q_2=\cdots=Q,\qquad
              V=\sum_iV_i=Q\sum_i\frac1{C_i}
              \quad\Longrightarrow\quad
              \boxed{\frac1{C_e}=\sum_i\frac1{C_i}}`}
            />
          </div>
          <PredictionQuestion
            prompt="Два различни кондензатора са в серия. Кой получава по-голямо напрежение?"
            options={[
              { text: "Този с по-малък капацитет", correct: true },
              { text: "Този с по-голям капацитет", correct: false },
              { text: "Напреженията винаги са равни", correct: false },
            ]}
            explanation="Зарядът е общ, а $V_i=Q/C_i$. При еднакъв $Q$ по-малкият капацитет има по-голяма потенциална разлика."
          />

          <div className="my-6">
            <CapacitorNetworkExplorer />
          </div>

          <Callout title="Бърза проверка" tone="green">
            <p>
              При серия <RichText text="$C_e<\min(C_i)$" />. Еквивалентната система съхранява
              по-малко заряд при същото общо напрежение, защото ефективно увеличаваме
              разстоянието между крайните заряди.
            </p>
          </Callout>
          <TeacherNote>
            В интерактива превключете между последователно и успоредно свързване при едни и
            същи стойности.
            Поискайте учениците първо да предскажат кои колони в readout лентата ще се
            изравнят.
          </TeacherNote>
        </Section>

        <Section id="networks" n="§7" title="Как се решават вериги">
          <p>
            <strong>Общото правило:</strong> проследете тока по време на зареждането. Ако в
            даден възел токът се разклонява към два кондензатора, те са свързани успоредно.
            Ако един и същ ток преминава последователно през два кондензатора без разклонение
            между тях, те са свързани последователно.
          </p>
          <ol className="mt-4 list-decimal space-y-2 pl-5">
            <li>Проследете тока при зареждането и означете възлите, в които се разклонява.</li>
            <li>Разклонение към два клона означава успоредно свързване.</li>
            <li>Един и същ ток без разклонение означава последователно свързване.</li>
            <li>Заменете една група с еквивалентния ѝ кондензатор и прерисувайте веригата.</li>
            <li>Намерете общия заряд или напрежение.</li>
            <li>Върнете се назад, използвайки общото напрежение или общия заряд.</li>
          </ol>

          <div className="my-6">
            <CapacitorNetworkReducer />
          </div>
          <TeacherNote>
            Не разпознавайте свързването по външния вид на чертежа. Проследете къде токът се
            разклонява и къде остава един и същ по време на зареждането.
          </TeacherNote>
        </Section>

        <Section id="energy" n="§8" title="Енергия на заредения кондензатор">
          <p>
            При зареждането потенциалът не е постоянен. Когато вече сме прехвърлили заряд{" "}
            <RichText text="$q$" />, моментната потенциална разлика е{" "}
            <RichText text="$V(q)=q/C$" />. За още малък заряд{" "}
            <RichText text="$dq$" /> е нужна работа <RichText text="$dW=V(q)\,dq$" />. Тя се
            съхранява като енергия на кондензатора, затова{" "}
            <RichText text="$dU=dW$" />:
          </p>
          <div className="mt-4">
            <Formula
              latex={String.raw`U=\int_0^Q\frac{q}{C}\,dq
              =\frac{Q^2}{2C}
              =\frac12QV
              =\frac12CV^2`}
            />
          </div>
          <p className="mt-4">
            Коефициентът <RichText text="$1/2$" /> е геометрично площта под правата{" "}
            <RichText text="$V(Q)$" />: средното напрежение по време на зареждането е
            половината от крайното.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              ["Фиксиран заряд", String.raw`$U=Q^2/(2C)$`, "удобно след откачане"],
              ["Фиксирано напрежение", String.raw`$U=CV^2/2$`, "удобно при батерия"],
              ["Известни Q и V", String.raw`$U=QV/2$`, "пряк резултат"],
            ].map(([title, formula, note]) => (
              <div
                key={title}
                className="rounded-[10px] border-[1.5px] border-ink bg-surface px-4 py-4 shadow-hard-sm"
              >
                <p className="text-[11px] font-bold uppercase tracking-[.14em] text-minus">{title}</p>
                <p className="mt-2 font-semibold">
                  <RichText text={formula} />
                </p>
                <p className="mt-1 text-[13px] text-muted">{note}</p>
              </div>
            ))}
          </div>
          <TeacherNote>
            Честа грешка е да се използва крайното напрежение за целия процес и да се получи{" "}
            <RichText text="$QV$" />. Върнете се към графиката от §2: площта е триъгълник.
          </TeacherNote>
        </Section>

        <Section id="density" n="§9" title="Енергията е в полето">
          <p>
            За плосък кондензатор <RichText text="$C=\varepsilon_0A/d$" /> и{" "}
            <RichText text="$V=Ed$" />. Заместваме ги в енергията:
          </p>
          <div className="mt-4">
            <Formula
              latex={String.raw`U=\frac12CV^2
              =\frac12\frac{\varepsilon_0A}{d}(Ed)^2
              =\frac12\varepsilon_0E^2(Ad)`}
            />
          </div>
          <p className="mt-4">
            Обемът между плочите е <RichText text="$Ad$" />. Следователно енергията на единица
            обем е:
          </p>
          <div className="mt-4">
            <Formula latex={String.raw`\boxed{u=\frac{U}{Ad}=\frac12\varepsilon_0E^2}`} />
          </div>
          <Callout title="Физическият смисъл" tone="green">
            <p>
              Енергията не е „скрита в плочите“. Тя е разпределена в електричното поле. Това
              твърдение остава полезно и при нееднородни полета, където общата енергия се
              получава чрез интеграл на <RichText text="$u$" /> по обема.
            </p>
          </Callout>
          <TeacherNote>
            Проверете размерността: <RichText text="$\varepsilon_0E^2$" /> трябва да даде{" "}
            <RichText text="$\mathrm{J/m^3}$" />. Това е добра връзка между формулата и
            физическото тълкуване.
          </TeacherNote>
        </Section>

        <Section id="problems" n="§10" title="Задачи и обобщение">
          <p className="mb-6">
            Във всяка задача първо определете посоката или правилното свързване, после кое е
            общо, и едва тогава преминете към сметките.
          </p>
          <CapacitorProblemSet />

          <div className="mt-9 rounded-[10px] border-[1.5px] border-ink bg-ink px-5 py-5 text-white shadow-hard">
            <p className="text-[11px] font-bold uppercase tracking-[.18em] text-hl">
              Обобщение
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px]">
              <li>
                <RichText text="$C=Q/V$" /> е свойство на геометрията и средата в линейния
                режим.
              </li>
              <li>
                За плосък кондензатор <RichText text="$C=\varepsilon_0A/d$" /> при пренебрежими
                краеви ефекти.
              </li>
              <li>При успоредно свързване е общо напрежението; при последователно — зарядът.</li>
              <li>
                <RichText text="$U=Q^2/(2C)=CV^2/2=QV/2$" />, а във вакуум{" "}
                <RichText text="$u=\varepsilon_0E^2/2$" />.
              </li>
            </ul>
          </div>
          <p className="mt-6">
            <strong>Следва:</strong>{" "}
            <Link
              href="/physics/elektrichestvo/dielektrici"
              className="font-semibold text-minus hover:underline"
            >
              диелектрици
            </Link>
            . Ще поставим материал между плочите и ще проследим как поляризацията променя
            полето, капацитета и енергията.
          </p>
        </Section>
      </main>
    </TeacherModeProvider>
  );
}
