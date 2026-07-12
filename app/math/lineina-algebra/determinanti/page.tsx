import Link from "next/link";
import Formula from "@/components/Formula";
import LessonNav from "@/components/LessonNav";
import RichText from "@/components/RichText";
import Section from "@/components/Section";
import DeterminantDerivation from "@/components/interactives/DeterminantDerivation";
import DeterminantArea from "@/components/interactives/DeterminantArea";
import DeterminantProblemSet from "@/components/interactives/DeterminantProblemSet";
import PredictionQuestion from "@/components/interactives/PredictionQuestion";
import {
  TeacherModeProvider,
  TeacherModeToggle,
  TeacherNote,
} from "@/components/interactives/TeacherMode";

export const metadata = {
  title: "Детерминанти — площта на трансформацията · STEM Платформа",
};

const SECTION_NAV = [
  { id: "why", n: "§1", label: "Идеята" },
  { id: "area", n: "§2", label: "Площта" },
  { id: "derive", n: "§3", label: "Извеждане" },
  { id: "compute", n: "§4", label: "Смятане" },
  { id: "zero", n: "§5", label: "det = 0" },
  { id: "applications", n: "§6", label: "Приложения" },
  { id: "problems", n: "§7", label: "Задачи" },
  { id: "recap", n: "§8", label: "Обобщение" },
] as const;

/**
 * Интерактивна глава: Детерминанти (линейна алгебра, университетско ниво).
 * Централна идея: det = (знакова) площ на образа на единичния квадрат.
 * Формулата ad − bc идва СЛЕД геометрията.
 */
export default function DeterminantsLessonPage() {
  return (
    <TeacherModeProvider>
      <main className="mx-auto max-w-3xl px-5 pb-24">
        {/* Заглавие */}
        <header className="pt-11 pb-2">
          <nav
            aria-label="Път до урока"
            className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-muted"
          >
            <Link
              href="/physics?subject=math&level=university"
              className="rounded-sm transition-colors hover:text-minus"
            >
              Математика
            </Link>
            <span aria-hidden="true">·</span>
            <Link
              href="/physics?subject=math&level=university#linear-algebra"
              className="rounded-sm transition-colors hover:text-minus"
            >
              Линейна алгебра
            </Link>
          </nav>
          <h1 className="mt-2 mb-2 font-serif text-[clamp(34px,7vw,48px)] leading-[1.08] font-bold text-ink">
            Детерминанти: площта на трансформацията
          </h1>
          <p className="text-[17px] text-muted">
            Интерактивна глава: едно число, което мери разтягане на площ, издава огледално обръщане
            и предсказва дали трансформацията изобщо може да се отмени
          </p>
        </header>

        <LessonNav items={SECTION_NAV} right={<TeacherModeToggle />} />

        {/* §1 Идеята */}
        <Section id="why" n="§1" title="Едно число за цяла матрица — защо?">
          <div className="space-y-3">
            <p className="text-[18px] text-ink">
              В <Link href="/math/lineina-algebra/matrici" className="font-semibold text-minus hover:underline">предишната глава</Link>{" "}
              матрицата беше машина, която трансформира цялата равнина. Естественият следващ въпрос
              на инженера е: <strong>колко „агресивна“ е машината?</strong> Разтяга ли, свива ли,
              обръща ли огледално — и може ли действието ѝ да се върне назад?
            </p>
            <p className="text-ink/90">
              Изненадата на тази глава: и четирите въпроса се отговарят от{" "}
              <strong>едно-единствено число</strong>, сметнато от матрицата — детерминантата.
              Никакви картинки не са нужни на компютъра: det &gt; 1 значи „разтяга площите“, det
              &lt; 0 значи „обръща като огледало“, det = 0 значи „смачква и не може да се върне“.
            </p>
            <p className="text-ink/90">
              Преди формулата — геометрията. Целият смисъл на детерминантата се вижда върху една
              шахматна дъска.
            </p>
          </div>
          <TeacherNote>
            <p>
              Дръжте въпроса „може ли да се върне назад?“ жив от самото начало — той прави det = 0
              значимо, преди да е дефинирано. Ако ученикът е играл с preset-а „Проекция“ от
              предишната глава, започнете оттам: „какво загуби ракетата и защо няма връщане?“
            </p>
          </TeacherNote>
        </Section>

        {/* §2 Площта */}
        <Section id="area" n="§2" title="Детерминантата е площ (със знак)">
          <div className="space-y-3">
            <p className="text-ink/90">
              Шахматната дъска долу е единичният квадрат — площ точно 1. Каквото матрицата прави с
              него, прави с <strong>всяка</strong> площ в равнината (линейността пренася правилото).
              Следете числото „площ на образа“ при всеки preset.
            </p>
          </div>
          <div className="mt-5 mb-5">
            <PredictionQuestion
              prompt="Преди симулацията: срязването [1 0.8; 0 1] накланя силно квадрата. Какво прави то с площта му?"
              options={[
                { text: "Не я променя — успоредникът е точно толкова, колкото квадратът", correct: true },
                { text: "Увеличава я — фигурата става по-дълга", correct: false },
                { text: "Намалява я — фигурата се „изтънява“", correct: false },
              ]}
              explanation="Срязването мести всеки хоризонтален слой настрани, без да променя нито ширината, нито височината му — като изкривена колода карти: обемът на колодата не се променя. Проверете с preset-а „Срязване“: площта остава 1.000."
            />
          </div>
          <DeterminantArea />
          <div className="mt-5 rounded-r-lg border-l-4 border-plus bg-hl px-4 py-3 text-[15.5px] leading-relaxed">
            <strong className="text-ink">Дефиницията (геометрична):</strong> det M е{" "}
            <strong className="text-ink">знаковата площ</strong> на образа на единичния квадрат.
            Големината мери разтягането на площите; знакът пази ориентацията: минус значи, че
            равнината е обърната като през огледало.
          </div>
          <TeacherNote>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Задължителни спирки: „Срязване“ (разтяга разстояния, но det = 1 — площта е
                неприкосновена) и „Огледало“ (нищо не е разтегнато, а det = −1).
              </li>
              <li>
                Диагностика: „направи с плъзгачите det ≈ 2, без да пипаш b и c“ (a·d = 2). После
                „det = 2 само със срязване?“ — невъзможно; защо?
              </li>
              <li>
                Знакът: следете кога червено-синият ред на шахматната дъска се обръща — това Е
                смяната на ориентация, не абстракция.
              </li>
            </ul>
          </TeacherNote>
        </Section>

        {/* §3 Геометрично извеждане */}
        <Section id="derive" n="§3" title="Геометрично извеждане на ad − bc">
          <div className="space-y-3">
            <p className="text-ink/90">
              Нека колоните на матрицата са <RichText text="$\vec u=(a,c)$" /> и{" "}
              <RichText text="$\vec v=(b,d)$" />. Те образуват успоредника, чиято знакова площ
              търсим. Вместо да помним формула, ще го <strong>изправим със срязване</strong>.
            </p>
          </div>

          <div className="my-5">
            <DeterminantDerivation />
          </div>

          <div className="space-y-4">
            <div>
              <p className="mb-2 text-[12px] font-bold uppercase tracking-[.15em] text-minus">Стъпка 1 · Изправяме основата</p>
              <p className="mb-3 text-ink/90">
                При <RichText text="$a\neq0$" /> прилагаме срязването
                <RichText text="$\ (x,y)\mapsto(x,\,y-\frac ca x)$" />. То мести хоризонталните
                слоеве настрани, без да променя площта. Първата колона става хоризонтална:
              </p>
              <Formula latex={String.raw`\vec u=(a,c)\ \longmapsto\ \vec u'=(a,0)`} />
            </div>

            <div>
              <p className="mb-2 text-[12px] font-bold uppercase tracking-[.15em] text-minus">Стъпка 2 · Намираме височината</p>
              <p className="mb-3 text-ink/90">
                Същото срязване изпраща втората колона в
                <RichText text="$\vec v'=(b,\,d-\frac ca b)$" />. Следователно изправеният
                успоредник има основа <RichText text="$a$" /> и знакова височина
                <RichText text="$d-\frac{bc}{a}$" />.
              </p>
              <Formula latex={String.raw`S_{\text{знакова}}=a\left(d-\frac{bc}{a}\right)`} />
            </div>

            <div>
              <p className="mb-2 text-[12px] font-bold uppercase tracking-[.15em] text-minus">Стъпка 3 · Опростяваме</p>
              <Formula latex={String.raw`\boxed{\det\begin{pmatrix}a&b\\c&d\end{pmatrix}=ad-bc}`} />
              <p className="mt-3 text-ink/90">
                Ако резултатът е отрицателен, геометричната площ е <RichText text="$|ad-bc|$" />,
                а минусът казва, че ориентацията е обърната. При <RichText text="$a=0$" /> можем да
                разменим колоните, да повторим аргумента и да отчетем смяната на знака.
              </p>
            </div>
          </div>
          <TeacherNote>
            <p>
              Извеждането е умишлено чрез срязване, защото ученикът вече е видял в §2, че то пази
              площта. За числения пример на фигурата: u=(3,1), v=(1,2); след срязването основата е
              3, височината 2−1/3=5/3 и площта е 5. Проверка: 3·2−1·1=5. Така буквеният запис има
              видим геометричен механизъм.
            </p>
          </TeacherNote>
        </Section>

        {/* §4 Смятане */}
        <Section id="compute" n="§4" title="Смятане и свойства">
          <div className="space-y-3">
            <p className="text-ink/90">
              За матрица 2×2 вече не учим правилото наизуст: <strong>ad</strong> е площта, която би
              останала без кръстосаното накланяне, а <strong>bc</strong> е корекцията от него.
              Например:
            </p>
            <Formula latex={String.raw`\det\begin{pmatrix}3&1\\1&2\end{pmatrix}=3\cdot2-1\cdot1=5`} />
            <p className="text-ink/90">
              За 3×3 детерминантата е <strong>обем</strong> на образа на единичното кубче и се
              разгъва по първия ред — три детерминанти 2×2 с редуващи се знаци:
            </p>
            <Formula latex={String.raw`\det\begin{pmatrix} a & b & c \\ d & e & f \\ g & h & i \end{pmatrix} = a\begin{vmatrix} e & f \\ h & i \end{vmatrix} - b\begin{vmatrix} d & f \\ g & i \end{vmatrix} + c\begin{vmatrix} d & e \\ g & h \end{vmatrix}`} />
            <p className="text-ink/90">
              Свойствата, които вършат работа на практика, сега са очевидни — защото са изречения за
              площи:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-ink/90">
              <li>
                <RichText text="$\det(A\cdot B) = \det A \cdot \det B$" /> — две машини една след
                друга умножават разтяганията си.
              </li>
              <li>
                <RichText text="$\det(kM) = k^2 \det M$" /> в 2D — мащаб k по двете оси прави k²
                по площ.
              </li>
              <li>Ротациите и срязванията имат det = 1 — не пипат площи.</li>
              <li>Размяна на две колони обръща знака — сменя ориентацията.</li>
            </ul>
          </div>
          <TeacherNote>
            <p>
              Преди 3×3 дайте три бързи 2×2 примера: положителен, отрицателен и нулев. Искайте
              първо геометрично предсказание (площ, ориентация, смачкване), после числото.
              det(AB)=detA·detB е естествено от гледна точка на последователни разтягания на площ.
            </p>
          </TeacherNote>
        </Section>

        {/* §5 det = 0 */}
        <Section id="zero" n="§5" title="det = 0: смачкване без връщане">
          <div className="space-y-3">
            <p className="text-ink/90">
              Бутонът „Смачкай до det = 0“ в §2 показа какво значи изродена матрица: целият квадрат
              се сплеска в отсечка — <strong>площ нула</strong>. Различни точки се сляха в една, а
              сливането не може да се „разлепи“: няма матрица, която да върне картинката.
            </p>
            <Formula latex={String.raw`\det M \neq 0 \;\Longleftrightarrow\; M^{-1}\ \text{съществува} \;\Longleftrightarrow\; M\vec{x}=\vec{b}\ \text{има точно едно решение}`} />
            <p className="text-ink/90">
              В предишния урок прочетохме <RichText text="$M\vec{x}=\vec{b}$" /> като „кой вход x
              машината M е превърнала в измерения изход b?“. Сега виждаме точния тест: отговорът е
              единствен само ако машината не е слепила различни входове. Тогава обратната матрица
              съществува и в 2D се записва:
            </p>
            <Formula latex={String.raw`M^{-1} = \frac{1}{ad-bc}\begin{pmatrix} d & -b \\ -c & a \end{pmatrix}`} />
            <p className="text-ink/90">
              Делението на <RichText text="$ad-bc$" /> е буквално „разтегни обратно толкова, колкото
              беше свито“ — и е невъзможно точно когато det = 0.
            </p>
          </div>
          <TeacherNote>
            <p>
              Свържете трите лица на det = 0: геометрично (смачкване), алгебрично (колоните са
              зависими — едната е кратна на другата), практично (системата няма еднозначно решение).
              Диагностичен въпрос за след урока: „det = 0.001 добре ли е?“ — почти-смачкана матрица
              усилва шума ×1000; инженерите се пазят и от околността на нулата.
            </p>
          </TeacherNote>
        </Section>

        {/* §6 Приложения */}
        <Section id="applications" n="§6" title="Къде работи детерминантата">
          <div className="space-y-4">
            {[
              {
                tag: "Компютърна графика",
                text: "Знакът на det (3×3) казва коя страна на триъгълник „гледа към камерата“ — така енджинът изхвърля половината повърхнини, без да ги рисува (backface culling). |det| на трансформацията решава колко детайлна текстура да се зареди.",
              },
              {
                tag: "Аеро и CFD",
                text: "Мрежите около крило се генерират в удобни координати и се пренасят в реални чрез якобиан — детерминанта на локалната матрица от производни. Клетка с якобиан ≈ 0 е изродена и чупи симулацията; генераторите на мрежи проверяват това за милиони клетки.",
              },
              {
                tag: "Геодезия, GIS и дронове",
                text: "Площ на парцел от GPS точки: shoelace формулата е сума от 2×2 детерминанти. Знакът различава обхождане по/обратно на часовниковата стрелка — така GIS системите знаят кое е „вътрешност“ на полигона.",
              },
              {
                tag: "Инженерни системи",
                text: "Преди да се реши система от уравнения (вериги, ферми, баланси), det на матрицата на коефициентите казва дали изобщо има еднозначно решение — т.е. дали измерванията/уравненията са независими.",
              },
              {
                tag: "Векторно произведение (следваща тема)",
                text: "|a × b| е точно |det| на матрицата с a и b като колони — площта на успоредника върху тях. Детерминантата е тайната самоличност на векторното произведение.",
              },
            ].map((b) => (
              <div key={b.tag} className="rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4">
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-minus">
                  {b.tag}
                </span>
                <p className="mt-1.5 text-[15.5px] leading-relaxed text-ink/90">{b.text}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* §7 Задачи */}
        <Section id="problems" n="§7" title="Задачи с водено решение">
          <div className="space-y-3">
            <p className="text-ink/90">
              Четири задачи от четири различни индустрии — всяка започва с геометричните въпроси и
              отключва сметката след тях.
            </p>
          </div>
          <div className="mt-5">
            <DeterminantProblemSet />
          </div>
        </Section>

        {/* §8 Обобщение */}
        <Section id="recap" n="§8" title="Обобщение">
          <div className="rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard">
            <ul className="list-disc space-y-2 pl-5 text-[15.5px] leading-relaxed text-ink/90">
              <li>
                det M е <strong>знаковата площ</strong> на образа на единичния квадрат (в 3D —
                обем): една матрица → едно число за „агресивността“ ѝ.
              </li>
              <li>|det| = коефициент на площ; знакът = ориентация (минус ⇔ огледално обръщане).</li>
              <li>
                В 2D формулата <RichText text="$ad-bc$" /> идва от срязване, което изправя едната
                колона, без да променя площта: основа × знакова височина.
              </li>
              <li>
                Срязване и ротация: det = 1 — формата се мени, площта никога.
              </li>
              <li>
                <strong>det = 0 ⇔ смачкване ⇔ необратимост ⇔ системата няма еднозначно решение.</strong>{" "}
                Една проверка преди всяко „делене на матрица“.
              </li>
              <li>
                Якобиан = „det на място“ за криви карти; shoelace = det по двойки върхове; |a × b| =
                det — все същото число в работни дрехи.
              </li>
            </ul>
          </div>
          <p className="mt-5 text-ink/90">
            <strong>Следваща глава:</strong> векторно и смесено произведение — детерминантата в 3D,
            където площите стават обеми, а знакът — правило на дясната ръка (мостът обратно към{" "}
            <Link href="/physics/magnetizm/bio-savar" className="font-semibold text-minus hover:underline">
              Био-Савар
            </Link>
            ).
          </p>
        </Section>
      </main>
    </TeacherModeProvider>
  );
}
