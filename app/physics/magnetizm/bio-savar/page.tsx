import Formula from "@/components/Formula";
import LessonNav from "@/components/LessonNav";
import RichText from "@/components/RichText";
import Section from "@/components/Section";
import Link from "next/link";
import BioSavartProblemSet from "@/components/interactives/BioSavartProblemSet";
import CircularArcField from "@/components/interactives/CircularArcField";
import FieldSuperposition from "@/components/interactives/FieldSuperposition";
import FiniteWireAngles from "@/components/interactives/FiniteWireAngles";
import InfiniteWireLimit from "@/components/interactives/InfiniteWireLimit";
import LoopAxisField from "@/components/interactives/LoopAxisField";
import PredictionQuestion from "@/components/interactives/PredictionQuestion";
import RightHandRule from "@/components/interactives/RightHandRule";
import {
  TeacherModeProvider,
  TeacherModeToggle,
  TeacherNote,
} from "@/components/interactives/TeacherMode";

export const metadata = {
  title: "Закон на Био-Савар — геометрията зад формулата · STEM Платформа",
};

const SECTION_NAV = [
  { id: "idea", n: "§1", label: "Идеята" },
  { id: "right-hand", n: "§2", label: "Дясната ръка" },
  { id: "superposition", n: "§3", label: "Суперпозиция" },
  { id: "angles", n: "§4", label: "Ъглите" },
  { id: "infinity", n: "§5", label: "Границата" },
  { id: "arc", n: "§6", label: "Дъга" },
  { id: "loop-axis", n: "§7", label: "Ос на контур" },
  { id: "problems", n: "§8", label: "Задачи" },
  { id: "recap", n: "§9", label: "Обобщение" },
] as const;

/**
 * Интерактивна глава: Закон на Био-Савар (университетско ниво).
 * Педагогически ред: наблюдение → предположение → визуализация → обяснение
 * → математика. Формулите се появяват едва след геометрията.
 * Страницата е шаблон за бъдещите глави (Ампер, Гаус, потенциал, индукция):
 * Section + LessonNav + PredictionQuestion + GuidedProblem + TeacherMode.
 */
export default function BioSavartLessonPage() {
  return (
    <TeacherModeProvider>
      <main className="mx-auto max-w-3xl px-5 pb-24">
        {/* Заглавие */}
        <header className="pt-11 pb-2">
          <nav aria-label="Път до урока" className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-muted">
            <Link href="/physics" className="rounded-sm transition-colors hover:text-minus focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-minus">
              Физика
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/physics?level=university#magnetism" className="rounded-sm transition-colors hover:text-minus focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-minus">
              Магнетизъм
            </Link>
          </nav>
          <h1 className="mt-2 mb-2 font-serif text-[clamp(34px,7vw,48px)] leading-[1.08] font-bold text-ink">
            Законът на Био-Савар: геометрията зад формулата
          </h1>
          <p className="text-[17px] text-muted">
            Интерактивна глава: посока и суперпозиция, дъга и кръгов контур, краен проводник и
            границата към безкраен
          </p>
        </header>

        {/* Навигация + режим преподавател */}
        <LessonNav items={SECTION_NAV} right={<TeacherModeToggle />} />

        {/* §1 Идеята */}
        <Section id="idea" n="§1" title="Какво описва законът">
          <div className="space-y-3">
            <p className="text-[18px] text-ink">
              Всеки участък от проводник с ток създава около себе си магнитно поле. Законът на
              Био-Савар отговаря на въпроса: <strong>какъв е приносът на едно малко парченце ток
              в дадена точка на пространството?</strong> Преди какъвто и да е запис с формула си
              струва да се откроят двата геометрични въпроса, от които зависи всичко:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-ink/90">
              <li>
                <strong>Накъде сочи приносът?</strong> Посоката се определя изцяло от взаимното
                разположение на елемента ток и точката на наблюдение — правилото на дясната ръка
                (§2).
              </li>
              <li>
                <strong>Колко е силен?</strong> Приносът отслабва с квадрата на разстоянието и
                зависи от ъгъла между елемента ток и посоката към точката (§4).
              </li>
            </ul>
            <p className="text-ink/90">
              И понеже пълното поле е <strong>векторна сума</strong> от всички приноси, между двата
              въпроса винаги застава трети: <strong>събират ли се приносите, или се
              компенсират?</strong> (§3). Тези три въпроса са цялата „трудна“ част на закона —
              останалото е аритметика.
            </p>
          </div>

          <div className="mt-5 rounded-r-lg border-l-4 border-plus bg-hl px-4 py-3 text-[15.5px] leading-relaxed">
            <strong className="text-ink">Подходът в тази глава:</strong> първо „защо“ (геометрията),
            после „колко“ (числата). За всяка конфигурация се задава един и същи ритуал от два
            въпроса — <strong className="text-ink">накъде сочи всяко <RichText text="$d\vec B$" />?</strong> и{" "}
            <strong className="text-ink">събират ли се, или се компенсират?</strong> — и чак тогава
            идва сметката.
          </div>

          <details className="group mt-5 rounded-[8px] border-[1.5px] border-rule px-4 py-2.5 open:border-ink">
            <summary className="cursor-pointer text-[15px] font-semibold text-ink select-none">
              <span className="group-open:hidden">Записът на закона (за след §2–§4)</span>
              <span className="hidden group-open:inline">Записът на закона</span>
            </summary>
            <div className="mt-3 space-y-3 border-t-[1.5px] border-dashed border-rule pt-3">
              <Formula latex={String.raw`d\vec{B} = \frac{\mu_0}{4\pi}\,\frac{I\,d\vec{l}\times\hat{r}}{r^2}`} />
              <p className="text-[15.5px] leading-relaxed text-ink/90">
                Прочит: <strong>посоката</strong> идва от векторното произведение{" "}
                <RichText text="$d\vec{l}\times\hat{r}$" /> — точно правилото на дясната ръка от §2;{" "}
                <strong>големината</strong> е <RichText text="$\dfrac{\mu_0 I\,dl\sin\theta}{4\pi r^2}$" /> —
                отслабване с <RichText text="$1/r^2$" /> и ъглова зависимост{" "}
                <RichText text="$\sin\theta$" />, която е тема на §4. Всичко в главата е разгръщане
                на тези два множителя.
              </p>
            </div>
          </details>

          <TeacherNote>
            <p>
              Добро начало е да се отложи формулата: започнете от въпроса „какво изобщо трябва да
              определи един такъв закон?“ и оставете ученика сам да стигне до „посока + големина“.
              Диагностичен въпрос: „полето на два проводника — как се комбинира?“ — отговорът
              издава дали векторният характер е осъзнат.
            </p>
          </TeacherNote>
        </Section>

        {/* §2 Дясната ръка */}
        <Section id="right-hand" n="§2" title="Посоката: правилото на дясната ръка">
          <div className="space-y-3">
            <p className="text-ink/90">
              Палецът — по посоката на тока. Свитите пръсти показват накъде „обикаля“ полето около
              проводника. В равнината на чертежа резултатът винаги е един от двата символа:{" "}
              <strong>⊙ навън от екрана</strong> (върхът на стрела към наблюдателя) или{" "}
              <strong>⊗ навътре</strong> (опашката ѝ). Интерактивът по-долу е за упражняване на
              точно този рефлекс — първо предположение, после проверка.
            </p>
          </div>
          <div className="mt-5">
            <RightHandRule />
          </div>
          <TeacherNote>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Настоявайте предположението да се прави с истинската ръка, не наум — грешките идват
                от „въртене на ума“, не на китката.
              </li>
              <li>
                Диагностични позиции: точка НАД проводника (мнозина се объркват, защото „ляво/дясно“
                изчезва); смяна на посоката на тока при същата точка.
              </li>
              <li>
                Изгледът отгоре е мостът към ⊙/⊗ означенията — помолете ученика сам да обясни защо
                „нагоре в изгледа“ значи „навътре в екрана“.
              </li>
            </ul>
          </TeacherNote>
        </Section>

        {/* §3 Суперпозиция */}
        <Section id="superposition" n="§3" title="Кога полетата се събират и кога се изваждат">
          <div className="space-y-3">
            <p className="text-ink/90">
              Магнитните полета са <strong>вектори</strong>: две полета с равни големини могат да
              дадат двойно поле, точна нула или нещо по средата — решава единствено{" "}
              <strong>геометрията на посоките</strong>. Четирите случая по-долу покриват целия
              спектър: първо се вижда само разположението, векторите се появяват след отговора.
            </p>
          </div>
          <div className="mt-5">
            <FieldSuperposition />
          </div>
          <TeacherNote>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Това е възловата секция за повечето ученици. Не позволявайте отговор без обосновка —
                искайте „лявото поле сочи…, дясното сочи…” преди избора.
              </li>
              <li>
                Случай 3 (точка над средата) е диагностичен за истинско векторно мислене: питайте
                кои компоненти се съкращават и защо резултатът е хоризонтален.
              </li>
              <li>
                Ако случаите се решават уверено, импровизирайте устно пети: „а ако точката е вляво от
                двата проводника?“
              </li>
            </ul>
          </TeacherNote>
        </Section>

        {/* §4 Ъглите */}
        <Section id="angles" n="§4" title="Ъглите при краен проводник">
          <div className="space-y-3">
            <p className="text-ink/90">
              Формулата за краен прав проводник изглежда различно в различните учебници само защото
              ъгълът се <strong>дефинира</strong> по два начина. Геометрията е обща: от точката <RichText text="$P$" /> се
              спуска <strong>перпендикуляр</strong> към правата на проводника (разстоянието{" "}
              <RichText text="$a$" />) и се гледа под какви ъгли от <RichText text="$P$" /> се виждат{" "}
              <strong>двата края</strong>. Интерактивът показва двете означения и връзката между
              тях.
            </p>
          </div>
          <div className="mt-5">
            <FiniteWireAngles />
          </div>
          <div className="mt-5 rounded-r-lg border-l-4 border-plus bg-hl px-4 py-3 text-[15.5px] leading-relaxed">
            <strong className="text-ink"><RichText text="$\theta$ и $\alpha$ не са един и същи ъгъл." /></strong> Това са{" "}
            <strong className="text-ink">две различни дефиниции на допълнителни ъгли</strong>: <RichText text="$\theta$" /> се
            брои от перпендикуляра, <RichText text="$\alpha$" /> — от направлението на проводника, и винаги{" "}
            <strong className="text-ink"><RichText text="$\theta+\alpha=90^\circ$" /></strong>. Оттам{" "}
            <RichText text="$\sin\theta = \cos\alpha$" /> — затова формулата „със синуси“ и формулата
            „с косинуси“ дават едно и също число. Режимът <RichText text="$\theta+\alpha=90^\circ$" /> показва двата ъгъла как
            запълват правия ъгъл заедно.
          </div>
          <TeacherNote>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Попитайте кой ъгъл използва учебникът на ученика и започнете от неговото означение —
                чак после покажете другото и режима „θ + α = 90°“.
              </li>
              <li>
                Задължителна диагностика: преместете P отвъд края на проводника и попитайте защо
                θ₁ става отрицателен и какво прави това с приноса.
              </li>
              <li>Проверка: „при кое положение на P сумата е най-голяма?“ (срещу средата, близо).</li>
            </ul>
          </TeacherNote>
        </Section>

        {/* §5 Границата */}
        <Section id="infinity" n="§5" title="Безкрайният проводник като граница">
          <div className="space-y-3">
            <p className="text-ink/90">
              Какво означава „безкраен проводник“? Не нов обект, а <strong>граница</strong>:
              поведението на крайния проводник, когато дължината му стане огромна спрямо
              разстоянието <RichText text="$a$" />. В симулацията изгледът се отдалечава, така че{" "}
              <strong>краищата остават видими</strong> — и се вижда как двата ъгъла плавно се
              стремят към 90°, а полето — към граничната си стойност. Графиката отдолу показва
              същото като крива: <RichText text="$B(L)/B_\infty$" /> се приближава към 1, без да го
              достига при крайно L.
            </p>
          </div>
          <div className="mt-5">
            <InfiniteWireLimit />
          </div>
          <TeacherNote>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Целта е думата „граница“ да получи съдържание. Дръжте вниманието върху двете
                представяния едновременно: ъглите в сцената и точката върху кривата.
              </li>
              <li>
                Практически въпрос по графиката: „при какво L/a полето е 95 % от граничното? А
                99 %?“ — изводът „безкраен = много по-дълъг от a“ е по-ценен от формулата.
              </li>
              <li>
                Свържете с α-означението: θ → 90° е същото като α → 0° — добра проверка на §4.
              </li>
            </ul>
          </TeacherNote>
        </Section>

        {/* §6 Кръгова дъга */}
        <Section id="arc" n="§6" title="Поле в центъра на кръгова дъга">
          <div className="space-y-3">
            <p className="text-ink/90">
              С инструментите от §1–§5 вече могат да се „четат“ и криви проводници. Първата
              класическа геометрия: кръгова дъга с радиус <RichText text="$a$" /> и две прави
              радиални части, а точката на наблюдение <RichText text="$O$" /> е центърът.
            </p>
          </div>
          <div className="mt-5 mb-5">
            <PredictionQuestion
              prompt="Преди сметката: кои части на проводника изобщо създават поле в центъра $O$?"
              options={[
                { text: "Само дъгата — по правите части $d\\vec s\\parallel\\hat r$ и приносът е нула", correct: true },
                { text: "Целият проводник — всяко парче ток дава принос", correct: false },
                { text: "Само правите части — те са най-близо до O", correct: false },
              ]}
              explanation="Правите части са радиални: за всеки техен елемент $d\vec s\parallel\hat r$, затова $d\vec s\times\hat r=0$ — същата логика като в Задача 2 от §8. Геометрията зачерква две трети от проводника, преди да сме написали интеграл."
            />
          </div>
          <div className="my-5"><CircularArcField /></div>
          <div className="space-y-3">
            <p className="text-ink/90">
              По дъгата всеки елемент е на едно и също разстояние <RichText text="$a$" />, перпендикулярен е на{" "}
              <RichText text="$\hat r$" /> (<RichText text="$\sin90^\circ=1$" />) и всички приноси сочат в една посока —
              събират се като числа. Интегралът се свежда до дължината на дъгата{" "}
              <RichText text="$s=a\theta$" />:
            </p>
            <Formula latex={String.raw`dB=\frac{\mu_0I}{4\pi}\frac{ds}{a^2}`} />
            <Formula latex={String.raw`B=\frac{\mu_0I}{4\pi a^2}\int_{\text{дъга}}ds=\frac{\mu_0I}{4\pi a^2}(a\theta)=\boxed{\frac{\mu_0I\theta}{4\pi a}}`} />
          </div>
          <div className="mt-5 rounded-r-lg border-l-4 border-plus bg-hl px-4 py-3 text-[15.5px] leading-relaxed">
            Ъгълът <strong>трябва да е в радиани</strong>. При пълна окръжност{" "}
            <RichText text="$\theta=2\pi$" /> се получава важният граничен случай{" "}
            <RichText text="$B(O)=\mu_0I/(2a)$" />.
          </div>
          <TeacherNote>
            <p>Преди формулата попитайте кои части на проводника могат да бъдат зачеркнати само по посока. След това използвайте стойностите <RichText text="$90^\circ$" />, <RichText text="$180^\circ$" /> и <RichText text="$360^\circ$" />: полето трябва да расте линейно с <RichText text="$\theta$" />, не с <RichText text="$\theta^2$" />.</p>
          </TeacherNote>
        </Section>

        {/* §7 Ос на кръгов контур */}
        <Section id="loop-axis" n="§7" title="Поле по оста на кръгов токов контур">
          <div className="space-y-3">
            <p className="text-ink/90">
              Втората класическа геометрия: контур с радиус <RichText text="$a$" /> лежи в равнината <RichText text="$yz$" />, а точката <RichText text="$P$" /> е на
              разстояние <RichText text="$x$" /> по оста. Всеки елемент е на едно и също разстояние{" "}
              <RichText text="$r=\sqrt{a^2+x^2}$" /> от <RichText text="$P$" /> и е перпендикулярен на посоката към <RichText text="$P$" /> —
              но приносите му са <strong>наклонени</strong> спрямо оста.
            </p>
          </div>
          <div className="mt-5 mb-5">
            <PredictionQuestion
              prompt="Съберат ли се приносите на всички елементи от контура, кои компоненти на $d\vec B$ оцеляват?"
              options={[
                { text: "Само компонентите по оста — напречните се унищожават по двойки срещуположни елементи", correct: true },
                { text: "Всички — полето е просто сумата от модулите", correct: false },
                { text: "Само напречните — те са по-големи", correct: false },
              ]}
              explanation="Всеки елемент има „огледален” партньор от другата страна на контура: осевите им компоненти са еднакви и се събират, а напречните са противоположни и се съкращават — точно случаят „частично компенсиране” от §3, повторен по целия контур."
            />
          </div>
          <div className="my-5"><LoopAxisField /></div>
          <div className="space-y-4">
            <Formula latex={String.raw`dB=\frac{\mu_0I}{4\pi}\frac{ds}{a^2+x^2},\qquad dB_x=dB\cos\alpha`} />
            <Formula latex={String.raw`\cos\alpha=\frac{a}{\sqrt{a^2+x^2}},\qquad \oint ds=2\pi a`} />
            <Formula latex={String.raw`\boxed{B_x(x)=\frac{\mu_0Ia^2}{2(a^2+x^2)^{3/2}}}`} />
          </div>
          <ul className="mt-5 list-disc space-y-2 pl-5 text-ink/90">
            <li>В центъра <RichText text="$x=0$" />: <RichText text="$B=\mu_0I/(2a)$" /> — същият резултат като пълната дъга от §6.</li>
            <li>Далеч от контура <RichText text="$x\gg a$" />: <RichText text="$B_x\approx\mu_0Ia^2/(2x^3)$" /> — полето намалява като <RichText text="$1/x^3$" />, характерно за дипол.</li>
            <li>Посоката по цялата ос се определя с правилото на дясната ръка за токовия контур.</li>
          </ul>
          <TeacherNote><p>Това е магнитният аналог на електричното поле по оста на зареден пръстен, но при магнитния случай започваме с векторното произведение. Изисквайте ученикът да посочи коя компонента се унищожава, преди да интегрира.</p></TeacherNote>
        </Section>

        {/* §8 Задачи */}
        <Section id="problems" n="§8" title="Задачи с водено решение">
          <div className="space-y-3">
            <p className="text-ink/90">
              Всяка задача следва реда от §1: първо въпросът за <strong>посоката</strong>, после за{" "}
              <strong>събирането/компенсирането</strong>, и едва след двата отговора се отключва
              решението — стъпка по стъпка, с фигура, която се достроява с всеки отговор.
            </p>
          </div>
          <div className="mt-5">
            <BioSavartProblemSet />
          </div>
        </Section>

        {/* §9 Обобщение */}
        <Section id="recap" n="§9" title="Обобщение">
          <div className="rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard">
            <ul className="list-disc space-y-2 pl-5 text-[15.5px] leading-relaxed text-ink/90">
              <li>
                Посоката на <RichText text="$d\vec{B}$" /> винаги идва от{" "}
                <RichText text="$d\vec{l}\times\hat{r}$" /> — правилото на дясната ръка, приложено
                към конкретната геометрия.
              </li>
              <li>
                Полетата са вектори: първо посоки, после големини. Равни големини с противоположни
                посоки дават нула; еднакви посоки — удвояване; ъгъл между тях — частично
                компенсиране.
              </li>
              <li>
                Точка върху правата на проводника ⇒ <RichText text="$d\vec{l}\parallel\hat{r}$" /> ⇒
                нулев принос, без сметки.
              </li>
              <li>
                Кръгова дъга с ъгъл <RichText text="$\theta$" /> дава в центъра
                <RichText text="$B=\mu_0I\theta/(4\pi a)$" />; радиалните прави части дават нула.
              </li>
              <li>
                По оста на кръгов контур напречните компоненти се унищожават и
                <RichText text="$B_x=\mu_0Ia^2/[2(a^2+x^2)^{3/2}]$" />.
              </li>
              <li>
                При краен проводник ъглите се мерят към двата края: от перпендикуляра (<RichText text="$\theta,\,\sin$" />) или
                от проводника (<RichText text="$\alpha,\,\cos$" />) — допълнителни ъгли, <RichText text="$\theta+\alpha=90^\circ$" />, една и съща физика.
              </li>
              <li>
                „Безкраен проводник“ е граница: при <RichText text="$L \gg a$" /> ъглите клонят към
                <RichText text="$90^\circ$" />, скобата — към 2, и{" "}
                <RichText text="$B \to \frac{\mu_0 I}{4\pi a}\cdot 2 = \frac{\mu_0 I}{2\pi a}$" />.
              </li>
            </ul>
          </div>
          <p className="mt-5 text-ink/90">
            <strong>Свързана тема:</strong>{" "}<Link href="/physics/magnetizm/amper" className="font-semibold text-minus hover:underline">законът на Ампер</Link> — при конфигурации с висока симетрия той
            заменя интегрирането по Био-Савар с един ред. Двата закона описват едно и също поле от
            две различни страни.
          </p>
        </Section>
      </main>
    </TeacherModeProvider>
  );
}
