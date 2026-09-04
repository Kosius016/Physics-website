import Link from "next/link";
import Formula from "@/components/Formula";
import LessonNav from "@/components/LessonNav";
import RichText from "@/components/RichText";
import Section from "@/components/Section";
import PredictionQuestion from "@/components/interactives/PredictionQuestion";
import {
  TeacherModeProvider,
  TeacherModeToggle,
  TeacherNote,
} from "@/components/interactives/TeacherMode";
import {
  BridgeMeasurementLab,
  CircuitSymbolStrip,
} from "@/components/materiali/CircuitViews";
import {
  GoldenRatioLadderLab,
  SeriesParallelLab,
} from "@/components/problem-sets/ResistorCircuitLabs";
import {
  ProblemStatement,
  ResultBox,
  Solution,
  SolutionPart,
} from "@/components/problem-sets/SolutionParts";

export const metadata = {
  title: "Резисторни вериги: пресметнете, сглобете, измерете · SingularityLab",
  description:
    "Задачи с електрически схеми и breadboard монтажи: еквивалентно съпротивление, мост, диагностика и безкрайна стълба със златното сечение.",
};

const SECTION_NAV = [
  { id: "three-networks", n: "§1", label: "Три мрежи" },
  { id: "target", n: "§2", label: "Целева стойност" },
  { id: "bridge", n: "§3", label: "Мост" },
  { id: "inside", n: "§4", label: "Във веригата" },
  { id: "fault", n: "§5", label: "Диагностика" },
  { id: "infinite", n: "§6", label: "Безкрайна стълба" },
  { id: "recap", n: "§7", label: "Обобщение" },
] as const;

export default function ResistorCircuitsProblemsPage() {
  return (
    <TeacherModeProvider>
      <main className="mx-auto max-w-3xl px-5 pb-24">
        <header className="pb-2 pt-11">
          <nav
            aria-label="Път до задачите"
            className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-muted"
          >
            <Link
              href="/materiali?subject=physics&level=university&type=zadachi"
              className="rounded-sm transition-colors hover:text-minus focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-minus"
            >
              Задачи
            </Link>
            <span aria-hidden="true">·</span>
            <span>Електрични вериги</span>
          </nav>
          <h1 className="mb-2 mt-2 font-serif text-[clamp(34px,7vw,48px)] font-bold leading-[1.08] text-ink">
            Резисторни вериги: пресметнете, сглобете, измерете
          </h1>
          <p className="max-w-2xl text-[17px] text-muted">
            Пет измерими задачи и една безкрайна. Всяка схема има конкретен breadboard монтаж,
            точки за мултицета и резултат, който може да се провери на масата.
          </p>
        </header>

        <LessonNav items={SECTION_NAV} right={<TeacherModeToggle />} />

        <Section id="three-networks" n="§1" title="Задача 1: едни резистори, три мрежи">
          <CircuitSymbolStrip />

          <div className="mt-6">
            <ProblemStatement>
              <p>
                Разполагате с <RichText text={String.raw`$R_1=1{,}0\,\mathrm{k\Omega}$`} />,{" "}
                <RichText text={String.raw`$R_2=2{,}2\,\mathrm{k\Omega}$`} /> и{" "}
                <RichText text={String.raw`$R_3=3{,}3\,\mathrm{k\Omega}$`} />. Свържете ги
                последователно, успоредно и като{" "}
                <RichText text={String.raw`$R_1+(R_2\parallel R_3)$`} />.
              </p>
              <ol className="list-[bulgarian-alpha] space-y-1.5 pl-5">
                <li>Подредете трите резултата без смятане.</li>
                <li>Пресметнете еквивалентното съпротивление във всеки случай.</li>
                <li>
                  Сглобете трите мрежи и измерете между точки <RichText text="$1$" /> и{" "}
                  <RichText text="$2$" />.
                </li>
                <li>Обяснете разликата между номиналната и измерената стойност.</li>
              </ol>
            </ProblemStatement>
          </div>

          <div className="mt-6">
            <PredictionQuestion
              prompt="Кое подреждане на трите еквивалентни съпротивления е възможно?"
              options={[
                {
                  text: "$R_{\\parallel}<R_1<R_{\\text{смесено}}<R_3<R_{\\text{посл}}$",
                  correct: true,
                  why: "Успоредната мрежа е по-малка от най-малкия резистор. Смесената съдържа $R_1$ последователно с еквивалента на успоредната част, а последователната е сборът на всички.",
                },
                {
                  text: "$R_1<R_{\\parallel}<R_3<R_{\\text{смесено}}<R_{\\text{посл}}$",
                  correct: false,
                  why: "Еквивалентното съпротивление при успоредно свързване не може да бъде по-голямо от най-малкия успореден клон.",
                },
                {
                  text: "$R_{\\text{посл}}<R_{\\text{смесено}}<R_1<R_{\\parallel}<R_3$",
                  correct: false,
                  why: "Последователното добавяне увеличава еквивалентното съпротивление, а успоредният път го намалява.",
                },
              ]}
            />
          </div>

          <div className="mt-6">
            <SeriesParallelLab />
          </div>

          <Solution hint={<span>Преди числата използвайте двете граници: последователният сбор е по-голям от всеки член, а резултатът при успоредно свързване е по-малък от най-малкия клон.</span>}>
            <SolutionPart label="а" title="Последователно">
              <Formula latex={String.raw`R_{\text{посл}}=R_1+R_2+R_3=6{,}50\,\mathrm{k\Omega}`} />
            </SolutionPart>
            <SolutionPart label="б" title="Успоредно">
              <Formula latex={String.raw`\frac1{R_{\parallel}}=\frac1{R_1}+\frac1{R_2}+\frac1{R_3}`} />
              <ResultBox>
                <RichText text={String.raw`$R_{\parallel}\approx569\,\Omega$`} />
              </ResultBox>
            </SolutionPart>
            <SolutionPart label="в" title="Смесено">
              <Formula latex={String.raw`R_{\text{смесено}}=R_1+\frac{R_2R_3}{R_2+R_3}=2{,}32\,\mathrm{k\Omega}`} />
            </SolutionPart>
          </Solution>

          <TeacherNote>
            <p>
              Не давайте формулите предварително. Нека ученикът първо реши кои два възела са общи
               за успоредно свързаните резистори. При измерване захранването отсъства, а сондата остава в
              гнездото за напрежение и съпротивление, не в токовото гнездо.
            </p>
          </TeacherNote>
        </Section>

        <Section id="target" n="§2" title="Задача 2: проектирайте целева стойност">
          <ProblemStatement>
            <p>
              Със същите три резистора направете мрежа, възможно най-близка до{" "}
              <RichText text={String.raw`$2{,}30\,\mathrm{k\Omega}$`} />. Всеки резистор трябва
              да участва точно веднъж. Допустими са само последователно и успоредно свързване.
            </p>
            <ol className="list-[bulgarian-alpha] space-y-1.5 pl-5">
              <li>Начертайте поне три различни кандидата.</li>
              <li>Изберете най-близкия преди да отворите решението.</li>
              <li>Сглобете го и проверете с мултицета.</li>
            </ol>
          </ProblemStatement>

          <Solution hint={<span>Успоредната комбинация на двата по-големи резистора е малко над <RichText text={String.raw`$1\,\mathrm{k\Omega}$`} />.</span>}>
            <SolutionPart label="а" title="Създайте успоредна част">
              <Formula latex={String.raw`R_2\parallel R_3=\frac{2{,}2\cdot3{,}3}{2{,}2+3{,}3}\,\mathrm{k\Omega}=1{,}32\,\mathrm{k\Omega}`} />
            </SolutionPart>
            <SolutionPart label="б" title="Добавете останалия резистор">
              <Formula latex={String.raw`R_{12}=R_1+(R_2\parallel R_3)=2{,}32\,\mathrm{k\Omega}`} />
              <ResultBox>
                Отклонението от целта е около <RichText text={String.raw`$0{,}87\%$`} />, преди да
                отчетете толеранса на истинските резистори.
              </ResultBox>
            </SolutionPart>
            <SolutionPart label="в" title="Проверете реалните компоненти">
              <p>
                Измерете всеки резистор отделно и повторете сметката с реалните стойности. Тази
                прогноза трябва да съвпадне по-добре с измерването на готовата мрежа.
              </p>
            </SolutionPart>
          </Solution>
        </Section>

        <Section id="bridge" n="§3" title="Задача 3: резистор, който не променя резултата">
          <ProblemStatement>
            <p>
              Постройте мост от пет резистора. В началната подредба използвайте{" "}
              <RichText text={String.raw`$R_1=R_3=1\,\mathrm{k\Omega}$`} />,{" "}
              <RichText text={String.raw`$R_2=R_4=2{,}2\,\mathrm{k\Omega}$`} /> и{" "}
              <RichText text={String.raw`$R_5=1\,\mathrm{k\Omega}$`} />.
            </p>
            <ol className="list-[bulgarian-alpha] space-y-1.5 pl-5">
              <li>Предскажете и измерете <RichText text="$R_{12}$" />.</li>
              <li>Извадете <RichText text="$R_5$" /> и измерете отново.</li>
              <li>Разменете <RichText text="$R_3$" /> и <RichText text="$R_4$" />.</li>
              <li>Обяснете защо средният резистор вече влияе.</li>
            </ol>
          </ProblemStatement>

          <div className="mt-6">
            <PredictionQuestion
              prompt="В балансираната подредба как ще се промени $R_{12}$, ако извадите средния резистор $R_5$?"
              options={[
                {
                  text: "Почти няма да се промени, защото точки $3$ и $4$ са с еднакъв потенциал.",
                  correct: true,
                  why: "Двата делителя имат еднакво отношение. Между средните точки няма напрежение и през $R_5$ не протича ток.",
                },
                {
                  text: "Ще нарасне точно с $1\\,\\mathrm{k\\Omega}$.",
                  correct: false,
                  why: "$R_5$ не е последователен на цялата мрежа и не може просто да се прибави към еквивалентното съпротивление.",
                },
                {
                  text: "Ще стане нула, защото средният път е прекъснат.",
                  correct: false,
                  why: "Двата външни клона остават свързани между точки $1$ и $2$. Отворен клон не създава късо съединение.",
                },
              ]}
            />
          </div>

          <div className="mt-6">
            <BridgeMeasurementLab />
          </div>

          <Solution hint={<span>Проверете отношението на двата делителя, преди да пишете възлови уравнения.</span>}>
            <SolutionPart label="а" title="Балансиран мост">
              <p>
                Понеже <RichText text="$V(3)=V(4)$" />, през{" "}
                <RichText text="$R_5$" /> не протича ток.
              </p>
              <Formula latex={String.raw`R_{12}=3{,}2\,\mathrm{k\Omega}\parallel3{,}2\,\mathrm{k\Omega}=1{,}60\,\mathrm{k\Omega}`} />
            </SolutionPart>
            <SolutionPart label="б" title="Разбалансиран мост">
              <p>
                След размяната <RichText text={String.raw`$V(3)\ne V(4)$`} /> и средният клон участва.
                Възловото пресмятане дава:
              </p>
              <Formula latex={String.raw`R_{12}\approx1{,}462\,\mathrm{k\Omega}`} />
            </SolutionPart>
          </Solution>

          <TeacherNote title="Монтажът на масата">
            <p>
              Използвайте колони <RichText text="$5$" />, <RichText text="$15$" /> и{" "}
              <RichText text="$25$" />. Горната половина е горният клон, долната е долният.
              Свържете крайните колони през процепа, а <RichText text="$R_5$" /> поставете
              вертикално през средата. Breadboard изгледът показва и точните места на сондите.
            </p>
          </TeacherNote>
        </Section>

        <Section id="inside" n="§4" title="Задача 4: защо един килоом изглежда като 615 ома">
          <ProblemStatement>
            <p>
              В разбалансирания мост цветният код на <RichText text="$R_5$" /> показва{" "}
              <RichText text={String.raw`$1\,\mathrm{k\Omega}$`} />. Без да го изваждате,
              измервате между краищата му и получавате около{" "}
              <RichText text={String.raw`$615\,\Omega$`} />. Решете дали е повреден.
            </p>
          </ProblemStatement>

          <Solution hint={<span>Проследете всички пътища между точки <RichText text="$3$" /> и <RichText text="$4$" />.</span>}>
            <SolutionPart label="а" title="Трите успоредни пътя">
              <p>
                Между точките има път през <RichText text="$R_5$" />, през{" "}
                <RichText text="$R_1+R_3$" /> и през <RichText text="$R_2+R_4$" />.
              </p>
            </SolutionPart>
            <SolutionPart label="б" title="Какво вижда омметърът">
              <Formula latex={String.raw`R_{34}=1\,\mathrm{k\Omega}\parallel3{,}2\,\mathrm{k\Omega}\parallel3{,}2\,\mathrm{k\Omega}\approx615\,\Omega`} />
            </SolutionPart>
            <SolutionPart label="в" title="Изолирайте компонента">
              <p>
                Повдигнете единия крак на <RichText text="$R_5$" /> и измерете от свързания край
                до свободния крак. Успоредните пътища изчезват.
              </p>
              <ResultBox>
                Показанието става близо до{" "}
                <RichText text={String.raw`$1\,\mathrm{k\Omega}$`} />. Резисторът не е
                повреден. Първото измерване е вярно, но отговаря на друг въпрос.
              </ResultBox>
            </SolutionPart>
          </Solution>
        </Section>

        <Section id="fault" n="§5" title="Задача 5: открийте скритата повреда">
          <ProblemStatement>
            <p>
              Преподавателят прави точно една промяна в моста: прекъснат джъмпер, крак в съседна
              колона или резистор с грешна стойност. Разполагате с максимум пет измервания.
            </p>
            <ol className="list-[bulgarian-alpha] space-y-1.5 pl-5">
              <li>Преди всяко измерване запишете очаквания резултат.</li>
              <li>След измерването изключете поне една възможна повреда.</li>
              <li>Повдигнете крак само след като посочите подозрителния компонент.</li>
              <li>
                След ремонта повторете измерването между точки <RichText text="$1$" /> и{" "}
                <RichText text="$2$" />.
              </li>
            </ol>
          </ProblemStatement>

          <Solution hint={<span>Първото измерване трябва да раздели възможностите на големи групи, а не да проверява произволен резистор.</span>}>
            <SolutionPart label="а" title="Започнете от цялата мрежа">
              <p>
                Измерете <RichText text="$R_{12}$" />. Показание{" "}
                <RichText text={String.raw`$\mathrm{OL}$`} /> насочва към прекъсване, а твърде
                малка стойност към късо съединение или грешен резистор.
              </p>
            </SolutionPart>
            <SolutionPart label="б" title="Разделете търсенето">
              <p>
                Следващото измерване трябва да реши в коя половина на моста е дефектът. Не
                проверявайте всички компоненти един по един без хипотеза.
              </p>
            </SolutionPart>
            <SolutionPart label="в" title="Потвърдете ремонта">
              <p>
                Изолирайте само подозрителния компонент. След поправката измерете отново цялата
                мрежа и сравнете с предвидената стойност.
              </p>
            </SolutionPart>
          </Solution>

          <TeacherNote title="Две добри скрити повреди">
            <p>
              За първи опит преместете един крак с една колона. За втори скрийте цветните ленти и
              заменете <RichText text={String.raw`$1\,\mathrm{k\Omega}$`} /> с{" "}
              <RichText text={String.raw`$10\,\mathrm{k\Omega}$`} />. Давайте точка само за
              измерване, което предварително има ясна цел.
            </p>
          </TeacherNote>
        </Section>

        <Section id="infinite" n="§6" title="Задача 6: безкрайната стълба и златното сечение">
          <ProblemStatement>
            <p>
              Стълбата се състои от безкрайно много еднакви клетки. Във всяка клетка има един
              последователен резистор <RichText text="$R$" /> и един резистор{" "}
              <RichText text="$R$" /> към връщащата линия. Намерете еквивалентното съпротивление{" "}
              <RichText text="$X$" /> между входните точки.
            </p>
            <ol className="list-[bulgarian-alpha] space-y-1.5 pl-5">
              <li>Постройте крайни стълби с от една до пет клетки.</li>
              <li>Измерете <RichText text="$R_N$" /> след всяка добавена клетка.</li>
              <li>Използвайте самоподобието, за да намерите безкрайния предел.</li>
            </ol>
          </ProblemStatement>

          <div className="mt-6">
            <PredictionQuestion
              prompt="Какво става с еквивалентното съпротивление, когато добавяте клетки след първата?"
              options={[
                {
                  text: "Намалява и се приближава към крайна стойност, по-голяма от $R$.",
                  correct: true,
                  why: "Всяка нова клетка добавя път, но остава и първият последователен резистор. Така резултатът е ограничен между $R$ и $2R$.",
                },
                {
                  text: "Расте без граница, защото всеки път добавяме още два резистора.",
                  correct: false,
                  why: "Новите клетки не са всички последователни. Всеки нов напречен резистор добавя успореден път.",
                },
                {
                  text: "Става нула, защото безкрайно много успоредно свързани резистори дават късо.",
                  correct: false,
                  why: "Преди всички успоредни разклонения стои последователен резистор $R$, затова еквивалентното съпротивление остава по-голямо от $R$.",
                },
              ]}
            />
          </div>

          <div className="mt-6">
            <GoldenRatioLadderLab />
          </div>

          <Solution hint={<span>След първия резистор останалата безкрайна част изглежда точно като цялата стълба.</span>}>
            <SolutionPart label="а" title="Използвайте самоподобието">
              <p>
                След първия последователен резистор има успоредно свързване на един{" "}
                <RichText text="$R$" /> и още едно копие на цялата стълба{" "}
                <RichText text="$X$" />.
              </p>
              <Formula latex={String.raw`X=R+(R\parallel X)=R+\frac{RX}{R+X}`} />
            </SolutionPart>
            <SolutionPart label="б" title="Премахнете мерните единици">
              <p>Въведете <RichText text="$x=X/R$" />. Тогава:</p>
              <Formula latex={String.raw`x=1+\frac{x}{1+x}\quad\Longrightarrow\quad x^2-x-1=0`} />
            </SolutionPart>
            <SolutionPart label="в" title="Изберете физическия корен">
              <Formula latex={String.raw`x=\frac{1\pm\sqrt5}{2}`} />
              <p>
                Отрицателният корен не може да е отношение на две положителни съпротивления.
              </p>
              <ResultBox>
                <RichText text={String.raw`$X=\varphi R$`} />, където{" "}
                <RichText text={String.raw`$\varphi=(1+\sqrt5)/2\approx1{,}618$`} />.
              </ResultBox>
            </SolutionPart>
            <SolutionPart label="г" title="Проверете безкрайността с пет клетки">
              <p>
                За <RichText text={String.raw`$R=1\,\mathrm{k\Omega}$`} /> пет клетки дават{" "}
                <RichText text={String.raw`$R_5\approx1{,}61818\,\mathrm{k\Omega}$`} />.
                Това вече е достатъчно близо, за да различите златното сечение с обикновен
                мултицет и резистори с малък толеранс.
              </p>
            </SolutionPart>
          </Solution>

          <TeacherNote title="Да, задачата е по сегашните знания">
            <p>
              Не е нужен анализ или безкраен ред. Нужни са само последователно и успоредно
              свързване, разпознаване на самоподобие и решаване на квадратно уравнение. За добър
              експеримент използвайте еднакви резистори с <RichText text={String.raw`$1\%$`} />
              толеранс и първо измерете всеки поотделно.
            </p>
          </TeacherNote>
        </Section>

        <Section id="recap" n="§7" title="Какво трябва да остане след задачите">
          <div className="rounded-[10px] border-[1.5px] border-ink bg-ink px-5 py-5 text-white shadow-hard">
            <p className="text-[11px] font-bold uppercase tracking-[.18em] text-hl">Обобщение</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px]">
              <li>Първо определете възлите, после решавайте кои резистори са последователни или успоредни.</li>
              <li>Еквивалентното съпротивление винаги е между конкретни две точки.</li>
              <li>При измерване на съпротивление всички външни източници се премахват.</li>
              <li>Резистор във верига може да се отчете по-малък заради други успоредни пътища.</li>
              <li>Балансираният мост се разпознава по еднаквото отношение на двата делителя.</li>
              <li>Самоподобието превръща безкрайната стълба в едно квадратно уравнение.</li>
            </ul>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 text-[14.5px] font-semibold">
            <Link href="/materiali/kod-na-rezistorite" className="text-minus hover:underline">
              Цветен код на резисторите →
            </Link>
            <Link href="/materiali?subject=physics&level=university&type=zadachi" className="text-minus hover:underline">
              Всички задачи →
            </Link>
          </div>
        </Section>
      </main>
    </TeacherModeProvider>
  );
}
