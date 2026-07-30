import Link from "next/link";
import Formula from "@/components/Formula";
import LessonNav from "@/components/LessonNav";
import RichText from "@/components/RichText";
import Section from "@/components/Section";
import DielectricPolarization from "@/components/interactives/DielectricPolarization";
import DielectricProblemSet from "@/components/interactives/DielectricProblemSet";
import {
  CapacitorDielectricLab,
  DielectricConfigurationGuide,
} from "@/components/interactives/ElectrostaticsReviewLabs";
import PredictionQuestion from "@/components/interactives/PredictionQuestion";
import {
  TeacherModeProvider,
  TeacherModeToggle,
  TeacherNote,
} from "@/components/interactives/TeacherMode";

export const metadata = {
  title: "Диелектрици: поляризация, капацитет и енергия · STEM Платформа",
};

/** Изнасяне на широките сцени в дясното поле на голям екран. */
const BLEED = "xl:-mr-[11rem] 2xl:-mr-[19rem]";

const SECTION_NAV = [
  { id: "material", n: "§1", label: "Материалът" },
  { id: "polarization", n: "§2", label: "Поляризация" },
  { id: "field", n: "§3", label: "Свързани заряди" },
  { id: "constant", n: "§4", label: "Q или V" },
  { id: "work", n: "§5", label: "Работа" },
  { id: "partial", n: "§6", label: "Частично" },
  { id: "strength", n: "§7", label: "Пробив" },
  { id: "problems", n: "§8", label: "Задачи" },
  { id: "recap", n: "§9", label: "Обобщение" },
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

export default function DielectricsLessonPage() {
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
            Диелектрици: поляризация, капацитет и енергия
          </h1>
          <p className="max-w-2xl text-[17px] leading-relaxed text-muted">
            Как изолаторът реагира на полето, защо увеличава капацитета и защо отговорът
            зависи решително от това дали батерията остава свързана.
          </p>
        </header>

        <LessonNav items={SECTION_NAV} right={<TeacherModeToggle />} />

        <Section id="material" n="§1" title="Какво прави веществото">
          <p>
            В предишния урок между плочите имаше вакуум. Сега вкарваме стъкло, пластмаса или
            керамика. Свободен ток през идеалния изолатор не протича, но капацитетът нараства.
            Значи зарядите в материала не са неподвижни в абсолютен смисъл: те могат да се
            изместват на микроскопични разстояния.
          </p>
          <p className="mt-4">
            Експериментът на Фарадей показва, че при пълно запълване на плосък кондензатор
            капацитетът се умножава по безразмерен фактор{" "}
            <RichText text="$\varepsilon_r$" />:
          </p>
          <div className="mt-4">
            <Formula
              latex={String.raw`C=\varepsilon_rC_0
              =\frac{\varepsilon_r\varepsilon_0A}{d},\qquad
              \varepsilon=\varepsilon_r\varepsilon_0`}
            />
          </div>
          <Callout title="Въпросът на урока">
            <p>
              Ако материалът не провежда, как успява да промени полето? Отговорът е
              поляризация: малко разделяне или подреждане на положителен и отрицателен заряд.
            </p>
          </Callout>
          <TeacherNote>
            Започнете с наблюдението, не с формулата. Попитайте какво може да се промени в
            изолатор, щом свободните заряди не могат да преминат от едната плоча до другата.
          </TeacherNote>
        </Section>

        <Section id="polarization" n="§2" title="Поляризация отвътре">
          <p>
            Молекулата е <strong>полярна</strong>, ако положителният и отрицателният център не
            съвпадат и без външно поле. Полето се стреми да ориентира постоянния ѝ диполен
            момент. При <strong>неполярна</strong> молекула полето леко измества електронния
            облак спрямо ядрата и индуцира дипол.
          </p>

          <div className={`my-6 ${BLEED}`}>
            <DielectricPolarization />
          </div>

          <p>
            Каквато и да е причината, резултатът е един и същ: всяка молекула се превръща в
            мъничък дипол, насочен по полето. Вътре в обема краищата на съседните диполи се
            компенсират взаимно, затова там нетен заряд не се появява. Некомпенсирани остават
            само краищата по <strong>двете гранични повърхности</strong>: това са свързаните
            заряди, с които се занимава §3.
          </p>
          <TeacherNote>
            Подчертайте, че „свързан“ не означава неподвижен. Зарядът се измества в рамките на
            молекулата или се ориентира, но не се пренася свободно през целия образец.
          </TeacherNote>
        </Section>

        <Section id="field" n="§3" title="Свързаните заряди намаляват полето">
          <PredictionQuestion
            prompt="Положителната плоча е отляво, отрицателната отдясно. Накъде сочи полето, създадено от свързаните заряди на диелектрика?"
            options={[
              {
                text: "Отдясно наляво, срещу полето на плочите",
                correct: true,
                why: "До положителната плоча се събира свързан **отрицателен** заряд, а до отрицателната свързан положителен. Полето на тази двойка сочи от плюса към минуса, тоест срещу външното.",
              },
              {
                text: "Отляво надясно, по посока на полето на плочите",
                correct: false,
                why: "Тогава пълното поле в диелектрика щеше да е по-силно, напрежението щеше да расте и капацитетът да **намалява**. Опитът показва точно обратното.",
              },
              {
                text: "Перпендикулярно на полето на плочите",
                correct: false,
                why: "Диполите се подреждат **по** полето, не напречно на него, затова и полето, което създават, лежи на същата права.",
              },
            ]}
            explanation="Свързаните заряди не могат да усилят полето, което ги е създало: те винаги му се противопоставят."
          />
          <p className="mt-5">
            Ако свободният заряд по плочите е фиксиран, полето във вакуум би било{" "}
            <RichText text="$E_0=\sigma_f/\varepsilon_0$" />. Поляризацията го намалява до:
          </p>
          <div className="mt-4">
            <Formula
              latex={String.raw`E=\frac{E_0}{\varepsilon_r}
              =\frac{\sigma_f}{\varepsilon_r\varepsilon_0}
              \qquad(Q=\mathrm{const})`}
            />
          </div>
          <p className="mt-4">
            При същото разстояние потенциалната разлика също намалява{" "}
            <RichText text="$\varepsilon_r$" /> пъти. Понеже{" "}
            <RichText text="$C=Q/V$" />, капацитетът нараства{" "}
            <RichText text="$\varepsilon_r$" /> пъти.
          </p>
          <Callout title="Какво измерва εr" tone="green">
            <p>
              Относителната проницаемост описва колко силно материалът се поляризира в
              линейния режим. Тя е безразмерна и зависи от веществото, температурата и
              честотата на полето.
            </p>
          </Callout>
          <TeacherNote>
            Формулата <RichText text="$E=E_0/\varepsilon_r$" /> тук е за фиксиран свободен
            заряд и пълно запълване. Не я пренасяйте механично към свързан с батерия
            кондензатор.
          </TeacherNote>
        </Section>

        <Section id="constant" n="§4" title="Ключовият въпрос: заряд или потенциал">
          <p>
            Диелектрикът винаги увеличава капацитета. Но какво става с останалите величини
            зависи от външната връзка. Отворени клеми фиксират свободния заряд; идеална батерия
            фиксира потенциалната разлика.
          </p>
          <PredictionQuestion
            prompt="Батерията остава свързана. Вкарваме диелектрик докрай, без да местим плочите. Какво става с полето $E$?"
            options={[
              {
                text: "Остава постоянно",
                correct: true,
                why: "Батерията държи $V$ фиксирано, а плочите не се местят. За идеален плосък кондензатор $E=V/d$, значи и полето не мърда.",
              },
              {
                text: "Намалява $\\varepsilon_r$ пъти",
                correct: false,
                why: "Това се случва при **откачен** кондензатор, където фиксиран е зарядът. Тук батерията долива точно толкова свободен заряд, колкото да компенсира поляризацията.",
              },
              {
                text: "Нараства $\\varepsilon_r$ пъти",
                correct: false,
                why: "Поляризацията никога не усилва полето: свързаните заряди действат срещу него. Нарастват $C$, $Q$ и $U$, но не и $E$.",
              },
            ]}
            explanation="Първият въпрос при всяка такава задача е един и същ: коя величина държи външната връзка фиксирана."
          />

          <div className={`my-6 ${BLEED}`}>
            <CapacitorDielectricLab />
          </div>

          <div className="overflow-x-auto rounded-[10px] border-[1.5px] border-ink bg-surface shadow-hard-sm">
            <table className="w-full min-w-[650px] border-collapse text-[14px]">
              <thead className="bg-hl">
                <tr>
                  <th className="p-3 text-left">Пълно вкарване</th>
                  <th className="p-3 text-left">Откачен: <RichText text="$Q=\mathrm{const}$" /></th>
                  <th className="p-3 text-left">Свързан: <RichText text="$V=\mathrm{const}$" /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {[
                  ["Капацитет", String.raw`$C'=\varepsilon_rC$`, String.raw`$C'=\varepsilon_rC$`],
                  ["Заряд", "$Q'=Q$", String.raw`$Q'=\varepsilon_rQ$`],
                  ["Напрежение", String.raw`$V'=V/\varepsilon_r$`, "$V'=V$"],
                  ["Поле", String.raw`$E'=E/\varepsilon_r$`, "$E'=E$"],
                  ["Енергия", String.raw`$U'=U/\varepsilon_r$`, String.raw`$U'=\varepsilon_rU$`],
                ].map(([name, isolated, connected]) => (
                  <tr key={name}>
                    <th className="p-3 text-left">{name}</th>
                    <td className="p-3"><RichText text={isolated} /></td>
                    <td className="p-3"><RichText text={connected} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <TeacherNote>
            Преди всяка сметка изисквайте едно изречение: „клемите са отворени, следователно
            зарядът е фиксиран“ или „батерията остава, следователно напрежението е фиксирано“.
          </TeacherNote>
        </Section>

        <Section id="work" n="§5" title="Кой върши работата">
          <p>
            Полето изтегля диелектрика към областта между плочите, защото така системата може
            да достигне състояние с по-голям капацитет. Но енергийният разказ е различен в
            двата режима.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard-sm">
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-minus">
                Откачен кондензатор
              </p>
              <p className="mt-2">
                <RichText text="$Q=\mathrm{const}$" /> и{" "}
                <RichText text="$U=Q^2/(2C)$" />. Когато <RichText text="$C$" /> нараства,
                енергията на полето намалява. Разликата става механична работа.
              </p>
            </div>
            <div className="rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard-sm">
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-plus">
                Свързан кондензатор
              </p>
              <p className="mt-2">
                <RichText text="$V=\mathrm{const}$" /> и{" "}
                <RichText text="$U=CV^2/2$" />. Енергията на кондензатора нараства, защото
                батерията внася заряд и извършва работа.
              </p>
            </div>
          </div>
          <p className="mt-5">
            При бавно странично вкарване силата може да се получи от изменението на
            подходящата енергия спрямо проникването <RichText text="$x$" />. При фиксиран
            заряд:
          </p>
          <div className="mt-4">
            <Formula latex={String.raw`F_x=-\frac{d}{dx}\left(\frac{Q^2}{2C(x)}\right)`} />
          </div>
          <p className="mt-4">
            При фиксирано напрежение батерията е част от енергийния баланс. За малка промяна
            на капацитета тя извършва работа{" "}
            <RichText text="$dW_{\text{бат}}=V\,dQ=V^2dC$" />. Половината увеличава
            енергията на кондензатора, а другата половина може да се превърне в механична
            работа при квазистатично движение.
          </p>
          <TeacherNote>
            Не прилагайте просто <RichText text="$F=-dU_{\text{кондензатор}}/dx$" /> при
            фиксирано напрежение, без да отчетете батерията. Това е най-честата концептуална
            грешка в този раздел.
          </TeacherNote>
        </Section>

        <Section id="partial" n="§6" title="Частично запълване: серия или паралел">
          <p>
            Погледнете една силова линия. Ако тя минава през два материала един след друг,
            слоевете са еквивалентни на последователни кондензатори. Ако различни силови линии
            минават през различни материали между едни и същи плочи, частите са паралелни.
          </p>

          <div className="my-5">
            <PredictionQuestion
              prompt="Диелектрик запълва долната половина от разстоянието между плочите, по цялата им площ. Как се пресмята капацитетът?"
              options={[
                {
                  text: "Като два последователно свързани кондензатора",
                  correct: true,
                  why: "Всяка силова линия минава първо през въздуха, после през диелектрика. Двата слоя стоят **един след друг** по пътя на полето, а това е определението за последователно свързване.",
                },
                {
                  text: "Като два успоредно свързани кондензатора",
                  correct: false,
                  why: "Успоредно е тогава, когато различни силови линии минават през различни материали, тоест при делене по **площ**. Тук деленето е по дебелина.",
                },
                {
                  text: "Като един кондензатор със средна проницаемост",
                  correct: false,
                  why: "Не може: в двата слоя полето е различно, защото $E=D/\\varepsilon$. Осредняването на материала дава грешен резултат, дори когато изглежда правдоподобно.",
                },
              ]}
              explanation="Цялото правило е в една дума: делене по **дебелина** дава серия, делене по **площ** дава паралел."
            />
          </div>

          <div className={`my-6 ${BLEED}`}>
            <DielectricConfigurationGuide />
          </div>

          <div className="mt-5 space-y-4">
            <div className="rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard-sm">
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-minus">
                Вкарване отстрани
              </p>
              <p className="mt-2">
                Празната и запълнената площ са паралелни. За ширина{" "}
                <RichText text="$a$" />, дължина <RichText text="$l$" /> и проникване{" "}
                <RichText text="$x$" />:
              </p>
              <div className="mt-3">
                <Formula
                  latex={String.raw`C(x)=\frac{\varepsilon_0a}{d}
                  \left[(l-x)+\varepsilon_rx\right]
                  =\frac{\varepsilon_0a}{d}
                  \left[l+(\varepsilon_r-1)x\right]`}
                />
              </div>
            </div>
            <div className="rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard-sm">
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-plus">
                Слоеве по дебелината
              </p>
              <p className="mt-2">
                При дебелини <RichText text="$d_i$" /> и проницаемости{" "}
                <RichText text="$\varepsilon_i$" /> слоевете са последователни:
              </p>
              <div className="mt-3">
                <Formula
                  latex={String.raw`\frac1C=\sum_i\frac{d_i}{\varepsilon_iA}`}
                />
              </div>
            </div>
          </div>
          <TeacherNote>
            Изисквайте рисунка на силова линия преди формулата. „Едни след други“ означава
            серия; „различни канали между същите възли“ означава паралел.
          </TeacherNote>
        </Section>

        <Section id="strength" n="§7" title="Диелектрична якост и пробив">
          <p>
            Реалният диелектрик издържа само до определено поле. Над диелектричната якост
            част от свързаните електрони се освобождават, възниква лавина от носители и
            изолаторът започва да провежда. Това е електричен пробив.
          </p>
          <div className="mt-4">
            <Formula latex={String.raw`V_{\max}\approx E_{\text{пробив}}\,d`} />
          </div>
          <p className="mt-4">
            Намаляването на <RichText text="$d$" /> увеличава капацитета, но при същото
            напрежение увеличава и полето <RichText text="$E=V/d$" />. Затова конструкцията е
            компромис между голям капацитет, работно напрежение, загуби и надеждност.
          </p>
          <Callout title="Инженерен прочит" tone="red">
            <p>
              Формулата <RichText text="$C=\varepsilon A/d$" /> насърчава малко{" "}
              <RichText text="$d$" />, докато условието за пробив налага долна граница на
              дебелината. Реалният кондензатор се проектира и по двете ограничения.
            </p>
          </Callout>
          <TeacherNote>
            Подчертайте, че <RichText text="$E_{\text{пробив}}$" /> не е универсална
            константа: зависи от материала, дебелината, дефектите, температурата и формата на
            електродите.
          </TeacherNote>
        </Section>

        <Section id="problems" n="§8" title="Водени задачи">
          <p className="mb-6">
            Започнете всяка задача с външната връзка и геометрията на материала. Това определя
            кое се запазва и дали еквивалентните части са в серия или паралел.
          </p>
          <DielectricProblemSet />
        </Section>

        <Section id="recap" n="§9" title="Обобщение">
          <div className="rounded-[10px] border-[1.5px] border-ink bg-ink px-5 py-5 text-white shadow-hard">
            <p className="text-[11px] font-bold uppercase tracking-[.18em] text-hl">
              Четири опорни идеи
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px]">
              <li>Поляризацията създава свързани повърхностни заряди.</li>
              <li>
                При фиксиран свободен заряд полето намалява до{" "}
                <RichText text="$E_0/\varepsilon_r$" />, а капацитетът нараства до{" "}
                <RichText text="$\varepsilon_rC_0$" />.
              </li>
              <li>
                Откачен означава <RichText text="$Q=\mathrm{const}$" />; свързан означава{" "}
                <RichText text="$V=\mathrm{const}$" />.
              </li>
              <li>
                Слоеве по дебелината са серия, а части по площта са паралел.
              </li>
            </ul>
          </div>
          <p className="mt-6">
            Главата завършва с{" "}
            <Link
              href="/materiali/provodnitsi-kondenzatori-dielektritsi"
              className="font-semibold text-minus hover:underline"
            >
              интерактивния преговор за проводници, кондензатори и диелектрици
            </Link>
            , където трите урока се събират в една карта, справочник и самопроверка.
          </p>
        </Section>
      </main>
    </TeacherModeProvider>
  );
}
