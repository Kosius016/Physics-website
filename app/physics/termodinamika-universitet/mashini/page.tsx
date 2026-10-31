import Link from "next/link";
import Formula from "@/components/Formula";
import LessonNav from "@/components/LessonNav";
import RichText from "@/components/RichText";
import Section from "@/components/Section";
import { Check, Derive, Meaning, Steps } from "@/components/DerivationBlocks";
import HeatPumpLab from "@/components/interactives/HeatPumpLab";
import PredictionQuestion from "@/components/interactives/PredictionQuestion";
import {
  CarnotTsFigure,
  FridgePhFigure,
  FridgeSchematicFigure,
} from "@/components/interactives/RealGasFigures";
import {
  TeacherModeProvider,
  TeacherModeToggle,
  TeacherNote,
} from "@/components/interactives/TeacherMode";

export const metadata = {
  title: "Топлинни и хладилни машини · SingularityLab",
  description:
    "Границите на двигателя, хладилника и термопомпата само от двата принципа, цикълът на Карно в координати температура и ентропия, и истинският парокомпресионен цикъл с енталпии.",
};

const raw = String.raw;

const SECTION_NAV = [
  { id: "engine", n: "§1", label: "Двигател" },
  { id: "fridge", n: "§2", label: "Хладилник" },
  { id: "real", n: "§3", label: "Истинският цикъл" },
  { id: "recap", n: "§4", label: "Обобщение" },
] as const;

function P({ text }: { text: string }) {
  return (
    <p className="my-4 text-[16.5px] leading-relaxed text-ink/90">
      <RichText text={text} />
    </p>
  );
}

export default function MachinesLessonPage() {
  return (
    <TeacherModeProvider>
      <main className="mx-auto max-w-3xl px-5 pb-24">
        <header className="pt-11 pb-2">
          <nav
            aria-label="Път до урока"
            className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-muted"
          >
            <Link href="/physics" className="transition-colors hover:text-minus">
              Физика
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/physics/termodinamika-universitet" className="transition-colors hover:text-minus">
              Реален газ
            </Link>
          </nav>
          <h1 className="mt-2 mb-2 font-serif text-[clamp(32px,6.4vw,46px)] leading-[1.08] font-bold text-ink">
            Топлинни и хладилни машини
          </h1>
          <p className="text-[17px] leading-relaxed text-muted">
            Границите идват само от двата принципа, без никакво уравнение на състоянието. После
            сметката за истинския хладилник - с енталпии
          </p>
        </header>

        <LessonNav items={SECTION_NAV} right={<TeacherModeToggle />} />

        <Section id="engine" n="§1" title="Топлинният двигател">
          <P text="Трите предишни урока използваха уравнението на състоянието на всяка стъпка. Този не го използва нито веднъж. Затова резултатите важат еднакво за пара, за идеален газ, за газ на Ван дер Ваалс и за хладилния агент в кухнята - а това е и причината да се наричат принципи." />

          <Derive>
            <Steps>
              <p>
                Работното тяло извършва цикъл: приема <RichText text="$Q_1$" /> от нагревател при{" "}
                <RichText text="$T_1$" />, отдава <RichText text="$Q_2$" /> на охладител при{" "}
                <RichText text="$T_2$" /> и извършва работа <RichText text="$A$" />.
              </p>
              <p>
                След цикъл тялото е в началното състояние, значи{" "}
                <RichText text={raw`$\Delta u=0$`} /> и от първия принцип{" "}
                <RichText text="$A=Q_1-Q_2$" />.
              </p>
              <>
                <p>
                  Ентропията на тялото също се връща, защото е функция на състоянието. Нагревателят
                  губи ентропия <RichText text="$Q_1/T_1$" />, охладителят печели{" "}
                  <RichText text="$Q_2/T_2$" />. За цялата изолирана система вторият принцип изисква
                </p>
                <Formula
                  latex={raw`-\frac{Q_1}{T_1}+\frac{Q_2}{T_2}\ge0\quad\Longrightarrow\quad\frac{Q_2}{Q_1}\ge\frac{T_2}{T_1}`}
                />
              </>
              <p>Остава да се запише коефициентът на полезно действие.</p>
            </Steps>
          </Derive>
          <Formula latex={raw`\eta=\frac{A}{Q_1}=1-\frac{Q_2}{Q_1}\le1-\frac{T_2}{T_1}`} />

          <div className="my-6">
            <CarnotTsFigure />
          </div>

          <Meaning>
            <p>
              Топлината <RichText text="$Q_1$" /> внася в машината ентропия{" "}
              <RichText text="$Q_1/T_1$" />. Машината не може да я унищожи - може само да я изхвърли.
              Най-евтино е да я изхвърли при ниската температура{" "}
              <RichText text="$T_2$" />, но дори това струва поне{" "}
              <RichText text={raw`$Q_2=T_2\cdot Q_1/T_1$`} /> енергия. Това е „данъкът“ на втория
              принцип и той не зависи от конструкцията.
            </p>
            <p>
              В координати <RichText text="$T$" /> и <RichText text="$s$" /> се вижда без сметки:{" "}
              <RichText text={raw`$\delta Q=T\,ds$`} />, значи площта под горната страна е{" "}
              <RichText text="$Q_1$" />, под долната - <RichText text="$Q_2$" />, а самият
              правоъгълник е работата. Отношението на двете площи е{" "}
              <RichText text="$T_2/T_1$" /> направо от геометрията.
            </p>
          </Meaning>
        </Section>

        <Section id="fridge" n="§2" title="Хладилник и термопомпа">
          <P text="Обръщаме цикъла. Сега машината приема $Q_2$ от студеното тяло, консумира работа $A$ (електричество) и отдава $Q_1=Q_2+A$ на топлото. Полезното е различно в двата случая: при хладилника - отнетата топлина, при термопомпата - подадената." />

          <div className="my-6">
            <PredictionQuestion
              prompt="Термопомпа дава на къщата $4\,\mathrm{kJ}$ топлина за всеки $1\,\mathrm{kJ}$ изразходвано електричество. Нарушава ли това първия принцип?"
              options={[
                {
                  text: "Не, защото останалите 3 kJ са взети от външния въздух и само са преместени",
                  correct: true,
                  why: raw`Точно така. Машината не създава топлина, а я премества от студено към топло. Сметката на енергията е $Q_1=Q_2+A$, тоест $4=3+1$ - всичко е наред.`,
                },
                {
                  text: "Да, и затова такива машини не съществуват",
                  correct: false,
                  why: raw`Съществуват и са масови. Коефициентът $\varepsilon=Q_1/A$ може да е много по-голям от 1, без да се създава енергия: разликата идва от околната среда.`,
                },
                {
                  text: "Не, защото коефициентът на полезно действие на машината е 400 процента",
                  correct: false,
                  why: raw`Числото е вярно, но изразът е подвеждащ: КПД е отношение на работа към **приета** топлина и по дефиниция не надхвърля 1. За термопомпата се говори за коефициент на преобразуване $\varepsilon$, а не за КПД, точно за да не се смесват двете.`,
                },
                {
                  text: "Не, защото останалите 3 kJ идват от триенето в компресора",
                  correct: false,
                  why: raw`Триенето само разваля работата на машината, не я подобрява. Трите киловатчаса идват от външния въздух - затова термопомпата отслабва, когато навън стане много студено.`,
                },
              ]}
              explanation={raw`Границата от втория принцип е $\varepsilon_{\text{тп}}\le T_1/(T_1-T_2)$: при малка температурна разлика е голяма, при голяма разлика - малка.`}
            />
          </div>

          <Derive>
            <Steps>
              <>
                <p>
                  Ентропийният баланс: студеното тяло губи <RichText text="$Q_2/T_2$" />, топлото
                  печели <RichText text="$Q_1/T_1$" />:
                </p>
                <Formula
                  latex={raw`\frac{Q_1}{T_1}-\frac{Q_2}{T_2}\ge0\quad\Longrightarrow\quad\frac{Q_1}{Q_2}\ge\frac{T_1}{T_2}`}
                />
              </>
              <>
                <p>
                  За хладилника полезното е <RichText text="$Q_2$" />:
                </p>
                <Formula
                  latex={raw`\varepsilon_{\text{хл}}=\frac{Q_2}{A}=\frac{Q_2}{Q_1-Q_2}=\frac1{Q_1/Q_2-1}`}
                />
              </>
              <>
                <p>
                  За термопомпата полезното е <RichText text="$Q_1$" />:
                </p>
                <Formula
                  latex={raw`\varepsilon_{\text{тп}}=\frac{Q_1}{A}=\frac{Q_1}{Q_1-Q_2}=\frac1{1-Q_2/Q_1}`}
                />
              </>
            </Steps>
          </Derive>
          <Formula
            latex={raw`\varepsilon_{\text{хл}}\le\frac{T_2}{T_1-T_2},\qquad\varepsilon_{\text{тп}}\le\frac{T_1}{T_1-T_2}=\varepsilon_{\text{хл}}^{\max}+1`}
          />

          <Meaning>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Знаменателят е <RichText text="$T_1-T_2$" />: колкото по-голяма е температурната
                разлика, толкова по-скъпо е преместването. Фризерът (
                <RichText text={raw`$-18\,^\circ\mathrm{C}$`} />) харчи повече от хладилното отделение
                (<RichText text={raw`$+4\,^\circ\mathrm{C}$`} />); термопомпата отслабва в студ;
                подовото отопление (<RichText text={raw`$35\,^\circ\mathrm{C}$`} />) е по-изгодно от
                радиаторите (<RichText text={raw`$55\,^\circ\mathrm{C}$`} />).
              </li>
              <li>
                Връзката <RichText text={raw`$\varepsilon_{\text{тп}}=\varepsilon_{\text{хл}}+1$`} />{" "}
                не е съвпадение: термопомпата дава на топлото всичко, което е взела от студеното,{" "}
                <em>плюс</em> изразходваното електричество.
              </li>
            </ul>
          </Meaning>

          <div className="my-7">
            <HeatPumpLab />
          </div>

          <TeacherNote>
            <p>
              Поставете външната температура на{" "}
              <RichText text={raw`$-15\,^\circ\mathrm{C}$`} /> и сравнете двата избора за водата. Това
              е най-кратката обосновка защо при реновиране се сменят и радиаторите, а не само
              котелът.
            </p>
            <p>
              Диагностичен въпрос: „може ли <RichText text={raw`$\varepsilon$`} /> да е по-малко от
              1?“ Може - при много голяма температурна разлика реалната машина пада под единица и тогава
              електрическият радиатор е по-добър.
            </p>
          </TeacherNote>
        </Section>

        <Section id="real" n="§3" title="Истинският хладилник: парокомпресионен цикъл">
          <P text="Хладилникът в кухнята не прави цикъл на Карно. Агентът (R134a или изобутан R600a) обикаля четири устройства с поток, и за всяко от тях важи балансът на енталпията от първия урок." />

          <div className="my-6">
            <FridgeSchematicFigure />
          </div>

          <Derive title="Извод: енергиите по стъпки, за килограм агент">
            <Steps>
              <p>
                Компресор, топлоизолиран: при <RichText text="$Q=0$" /> работата, вложена в парата, е{" "}
                <RichText text="$A=h_2-h_1$" />.
              </p>
              <p>
                Кондензатор, без вал: <RichText text="$Q_1=h_2-h_3$" /> отива в кухнята.
              </p>
              <p>
                Вентил: <RichText text="$h_4=h_3$" />, защото няма ни топлина, ни вал.
              </p>
              <p>
                Изпарител, без вал: <RichText text="$Q_2=h_1-h_4=h_1-h_3$" /> идва от храната.
              </p>
            </Steps>
          </Derive>
          <Formula latex={raw`\varepsilon_{\text{хл}}=\frac{Q_2}{A}=\frac{h_1-h_3}{h_2-h_1}`} />

          <div className="my-6">
            <FridgePhFigure />
          </div>

          <P text="Остава най-странната стъпка: защо един обикновен вентил охлажда. Отговорът не е ефектът на Джаул-Томсън от предишния урок, а нещо по-силно - през вентила агентът е течност, която започва да кипи." />

          <Derive title="Извод: защо вентилът охлажда">
            <Steps>
              <p>
                В точка 3 агентът е течност при <RichText text="$T_1$" />. След вентила налягането е
                ниско и при същото <RichText text="$h$" /> част{" "}
                <RichText text="$x$" /> от него е пара при <RichText text="$T_2$" />, а останалото -
                течност при същата <RichText text="$T_2$" />.
              </p>
              <>
                <p>
                  Енталпията се запазва:
                </p>
                <Formula
                  latex={raw`h_{\text{течн}}(T_1)=(1-x)\,h_{\text{течн}}(T_2)+x\,h_{\text{пара}}(T_2)`}
                />
              </>
              <>
                <p>
                  Изразяваме <RichText text="$x$" />, като използваме{" "}
                  <RichText
                    text={raw`$h_{\text{течн}}(T_1)-h_{\text{течн}}(T_2)\approx c_{\text{течн}}(T_1-T_2)$`}
                  />{" "}
                  и <RichText text={raw`$h_{\text{пара}}-h_{\text{течн}}=L$`} />, където{" "}
                  <RichText text="$L$" /> е топлината на изпарение при{" "}
                  <RichText text="$T_2$" />:
                </p>
                <Formula latex={raw`x\approx\frac{c_{\text{течн}}(T_1-T_2)}{L}`} />
              </>
            </Steps>
          </Derive>

          <Meaning>
            <p>
              Вентилът не „прави студ“ сам. Течността попада под толкова ниско налягане, че кипи при{" "}
              <RichText text={raw`$-20\,^\circ\mathrm{C}$`} />. Частта{" "}
              <RichText text="$x$" />, която се изпарява веднага, взима топлината си от останалата
              течност и я охлажда до тази температура. Останалите{" "}
              <RichText text="$1-x$" /> кипят после в изпарителя - вече за сметка на храната.
            </p>
            <p>
              Затова агентът се избира с критична температура над тази на кондензатора (R134a:{" "}
              <RichText text={raw`$101\,^\circ\mathrm{C}$`} />, изобутан:{" "}
              <RichText text={raw`$135\,^\circ\mathrm{C}$`} />). Над критичната температура няма
              кондензация - това е резултатът от{" "}
              <Link
                href="/physics/termodinamika-universitet/van-der-vaals#critical"
                className="font-semibold text-minus hover:underline"
              >
                критичната точка
              </Link>
              , приложен към избор на химикал.
            </p>
          </Meaning>

          <Check title="Къде се губи работа">
            <p>
              Задача 10 пресмята цял хладилник с таблични енталпии и дава{" "}
              <RichText text={raw`$\varepsilon_{\text{хл}}\approx3{,}1$`} /> при граница от Карно{" "}
              <RichText text={raw`$4{,}2$`} /> - около 73 процента от възможното. Двете места, където
              се губи, са:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Вентилът.</strong> Дроселирането произвежда ентропия: работата, която турбина
                би могла да върне, се губи. Затова големите инсталации понякога слагат разширителна
                машина вместо капилярна тръбичка.
              </li>
              <li>
                <strong>Крайните температурни разлики.</strong> Компресорът изкарва пара при около{" "}
                <RichText text={raw`$49\,^\circ\mathrm{C}$`} />, а тя отдава топлина на среда при{" "}
                <RichText text={raw`$40\,^\circ\mathrm{C}$`} />. Пренос на топлина през ненулева
                разлика винаги е необратим.
              </li>
            </ul>
          </Check>

          <TeacherNote>
            <p>
              Задача 12 (отвореният хладилник) върши повече работа от всяко обяснение: тя принуждава
              ученика да избере система, за която да напише първия принцип. Сложете я веднага след този
              раздел.
            </p>
            <p>
              Честа грешка: „хладилникът произвежда студ“. Полезно упражнение е да се поиска от
              ученика да опише същата машина като термопомпа и да каже кое е полезното в двата случая.
            </p>
          </TeacherNote>
        </Section>

        <Section id="recap" n="§4" title="Обобщение">
          <div className="rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard">
            <ul className="list-disc space-y-2.5 pl-5 text-[15.5px] leading-relaxed text-ink/90">
              <li>
                Границите на всички машини идват от ентропийния баланс:{" "}
                <RichText text={raw`$\eta\le1-T_2/T_1$`} />,{" "}
                <RichText text={raw`$\varepsilon_{\text{хл}}\le T_2/(T_1-T_2)$`} />,{" "}
                <RichText text={raw`$\varepsilon_{\text{тп}}\le T_1/(T_1-T_2)$`} />. В извода не влиза
                никакво вещество.
              </li>
              <li>
                В координати <RichText text="$T$" /> и <RichText text="$s$" /> цикълът на Карно е
                правоъгълник и КПД се чете направо от двете площи.
              </li>
              <li>
                <RichText text={raw`$\varepsilon>1$`} /> не нарушава нищо: машината не създава
                топлина, а я премества, и плаща само за изхвърлянето на ентропията при по-висока
                температура.
              </li>
              <li>
                Истинският хладилник е сметка с енталпии: баланс за всяко устройство с поток и{" "}
                <RichText text={raw`$h=\text{const}$`} /> за вентила. Оттам{" "}
                <RichText text={raw`$\varepsilon=(h_1-h_3)/(h_2-h_1)$`} />.
              </li>
              <li>
                Избраният агент трябва да има критична температура над тази на кондензатора - иначе
                парата няма да кондензира.
              </li>
            </ul>
          </div>
          <p className="mt-5 text-[16px] leading-relaxed text-ink/90">
            <strong>Нататък:</strong>{" "}
            <Link href="/zadachi/termodinamika-realen-gaz" className="font-semibold text-minus hover:underline">
              дванадесетте задачи към раздела
            </Link>{" "}
            минават през всичко: разширителния съд на отоплението, гумения ластик, грешката на Нютон за
            скоростта на звука, реликтовото лъчение, машината на Линде, термопомпата за къща в София и
            хладилника в кухнята.
          </p>
        </Section>
      </main>
    </TeacherModeProvider>
  );
}
