import Link from "next/link";
import Formula from "@/components/Formula";
import LessonNav from "@/components/LessonNav";
import RichText from "@/components/RichText";
import Section from "@/components/Section";
import ProblemSetLinkCard from "@/components/problem-sets/ProblemSetLinkCard";
import ColumnPicture from "@/components/interactives/ColumnPicture";
import CompositionOrder from "@/components/interactives/CompositionOrder";
import MatrixPlayground from "@/components/interactives/MatrixPlayground";
import MatrixProblemSet from "@/components/interactives/MatrixProblemSet";
import PredictionQuestion from "@/components/interactives/PredictionQuestion";
import {
  TeacherModeProvider,
  TeacherModeToggle,
  TeacherNote,
} from "@/components/interactives/TeacherMode";

export const metadata = {
  title: "Матрици: езикът на трансформациите · STEM Платформа",
};

const SECTION_NAV = [
  { id: "why", n: "§1", label: "Защо матрици" },
  { id: "playground", n: "§2", label: "Игрището" },
  { id: "columns", n: "§3", label: "Колоните" },
  { id: "systems", n: "§4", label: "Системи" },
  { id: "composition", n: "§5", label: "Композиция" },
  { id: "applications", n: "§6", label: "Приложения" },
  { id: "problems", n: "§7", label: "Задачи" },
  { id: "recap", n: "§8", label: "Обобщение" },
] as const;

/**
 * Интерактивна глава: Матрици (линейна алгебра, университетско ниво).
 * Педагогика: първо трансформацията (какво ПРАВИ матрицата), после записът.
 */
export default function MatricesLessonPage() {
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
            Матрици: езикът на трансформациите
          </h1>
          <p className="text-[17px] text-muted">
            Интерактивна глава: какво всъщност прави една матрица, защо колоните ѝ казват всичко и
            защо редът на умножението има значение
          </p>
        </header>

        <LessonNav items={SECTION_NAV} right={<TeacherModeToggle />} />

        {/* §1 Защо матрици */}
        <Section id="why" n="§1" title="Защо векторите не стигат">
          <div className="space-y-3">
            <p className="text-[18px] text-ink">
              Векторът описва <strong>едно нещо</strong>: една точка, една скорост, едно показание.
              Но повечето интересни операции не са „едно нещо“, а{" "}
              <strong>действие върху всички неща едновременно</strong>: завърти цялата картинка,
              мащабирай целия чертеж, преобразувай всички показания на сензора в другата
              координатна система.
            </p>
            <p className="text-ink/90">
              За такова действие ни трябва отделен обект: <strong>машина, която изяжда вектор и
              връща вектор</strong>, по едно и също правило за всички. Когато правилото е линейно
              (запазва мрежата от успоредни линии и началото), машината се описва с крайно малко
              информация: <strong>матрица</strong>. В равнината само четири числа кодират какво става
              с всички нейни точки.
            </p>
            <p className="text-ink/90">
              Едни и същи 4 числа въртят спрайта в игра, накланят буквите в шрифт, преобразуват
              показанията на жироскоп в дрон и смесват сигналите в невронна мрежа. Затова линейната
              алгебра е „граматиката” на изчислителния свят.
            </p>
          </div>
          <div className="mt-5 rounded-r-lg border-l-4 border-plus bg-hl px-4 py-3 text-[15.5px] leading-relaxed">
            <strong className="text-ink">Подходът в тази глава:</strong> първо се гледа{" "}
            <strong className="text-ink">какво прави</strong> матрицата с картинката (геометрията),
            чак после как се записва и смята. Числата в матрицата не са таблица, а инструкция.
          </div>
          <TeacherNote>
            <p>
              Добър вход: „имам снимка от един милион пиксела и искам да я завъртя. Колко числа ми
              трябват, за да опиша завъртането?“ Отговорът (четири, при милион точки) е първото „уау“ на
              линейната алгебра. Диагностика: ако ученикът мисли матрицата като „таблица с данни“,
              §2 е лекарството. Не продължавайте към сметки, преди да е играл с плъзгачите.
            </p>
          </TeacherNote>
        </Section>

        {/* §2 Игрището */}
        <Section id="playground" n="§2" title="Какво прави матрицата: игрището">
          <div className="space-y-3">
            <p className="text-ink/90">
              Четирите плъзгача са четирите числа на матрицата. Всичко на екрана: решетката,
              жълтият квадрат и ракетата, се прекарва през нея. Опитайте готовите настройки, после
              разбъркайте ръчно: кое число за какво отговаря?
            </p>
          </div>
          <div className="mt-5 mb-5">
            <PredictionQuestion
              prompt={String.raw`Преди плъзгачите: какво ще направи с ракетата матрицата с колони $\hat{\imath}'=(0,1)$ и $\hat{\jmath}'=(-1,0)$?`}
              options={[
                { text: "Ще я завърти на $90^\circ$ обратно на часовниковата стрелка", correct: true },
                { text: "Ще я обърне огледално спрямо вертикалната ос", correct: false },
                { text: "Ще я разтегне по диагонала, без да я върти", correct: false },
              ]}
              explanation={String.raw`$\hat{\imath}$ (надясно) отива нагоре, а $\hat{\jmath}$ (нагоре) отива наляво. И двата са завъртени на $90^\circ$ обратно на часовниковата стрелка, а с тях и цялата равнина. Проверете с настройката „Ротация $90^\circ$“.`}
            />
          </div>
          <MatrixPlayground />
          <TeacherNote>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <RichText text="Дайте $3$-$4$ минути свободна игра, после структурирайте: „направи ракетата двойно по-широка, без да пипаш височината“ (само $a$), „наклони я като италик“ (само $b$)." />
              </li>
              <li>
                <RichText text={String.raw`Диагностичен въпрос: „кой плъзгач мести червената стрелка вертикално?“ Това е $c$ и е моментът да се каже, че $\hat{\imath}'=(a,c)$ е първата **колона**.`} />
              </li>
              <li>
                „Проекция“ е тийзърът за детерминанти: питайте „можеш ли да върнеш ракетата обратно?“
                и оставете въпроса да виси до следващия урок.
              </li>
            </ul>
          </TeacherNote>
        </Section>

        {/* §3 Колоните */}
        <Section id="columns" n="§3" title="Колоните казват всичко">
          <div className="space-y-3">
            <p className="text-ink/90">
              Игрището показа правилото, което върши цялата работа в тази глава:{" "}
              <RichText text={String.raw`**Колоните на матрицата са образите на базисните вектори.** Ако знаете къде кацат $\hat{\imath}=(1,0)$ и $\hat{\jmath}=(0,1)$, знаете къде каца всяка точка, защото всяка точка е комбинация от тях:`} />
            </p>
            <Formula latex={String.raw`M = \begin{pmatrix} a & b \\ c & d \end{pmatrix}: \qquad \hat{\imath} = \begin{pmatrix}1\\0\end{pmatrix} \mapsto \begin{pmatrix}a\\c\end{pmatrix},\quad \hat{\jmath} = \begin{pmatrix}0\\1\end{pmatrix} \mapsto \begin{pmatrix}b\\d\end{pmatrix}`} />
            <p className="text-ink/90">
              <RichText text={String.raw`Оттук умножението матрица-вектор не е формула за наизустяване, а изречение: „вземи $x$ части от новото $\hat{\imath}'$ и $y$ части от новото $\hat{\jmath}'$“:`} />
            </p>
            <Formula latex={String.raw`\begin{pmatrix} a & b \\ c & d \end{pmatrix}\begin{pmatrix} x \\ y \end{pmatrix} = x\begin{pmatrix} a \\ c \end{pmatrix} + y\begin{pmatrix} b \\ d \end{pmatrix} = \begin{pmatrix} ax + by \\ cx + dy \end{pmatrix}`} />
            <p className="text-ink/90">
              Затова конструирането на матрица за дадено действие започва винаги с един и същи
              въпрос: <RichText text={String.raw`**къде отиват $\hat{\imath}$ и $\hat{\jmath}$?**`} /> Отговорите се подреждат като колони.
            </p>
          </div>
          <TeacherNote>
            <p>
              Тук се решава дали умножението ще е ритуал или разбиране. Накарайте ученика да изведе
              <RichText text={String.raw`Нека ученикът сам изведе матрицата на ротация на $90^\circ$ само от въпроса „къде отиват $\hat{\imath}$ и $\hat{\jmath}$?“, без готови формули. Честа грешка е записването на образите като редове; проверката върху самия $\hat{\imath}$ трябва да даде първата колона.`} />
            </p>
          </TeacherNote>
        </Section>

        {/* §4 Системи и обратимост */}
        <Section id="systems" n="§4" title="Матрицата като система: от изхода обратно към входа">
          <div className="space-y-3">
            <p className="text-ink/90">
              Досега задавахме входен вектор <RichText text="$\vec{x}$" /> и матрицата произвеждаше
              изход <RichText text="$\vec{b}$" />. Това е <strong>правата задача</strong>:
            </p>
            <Formula latex={String.raw`M\vec{x}=\vec{b}`} />
            <p className="text-ink/90">
              В практиката често знаем точно обратното. Два сензора са отчели стойностите в{" "}
              <RichText text="$\vec b$" />, а ние търсим неизвестните физични величини в{" "}
              <RichText text="$\vec x$" />. Например:
            </p>
            <Formula latex={String.raw`\begin{pmatrix}2&1\\1&1\end{pmatrix}\begin{pmatrix}x\\y\end{pmatrix}=\begin{pmatrix}5\\3\end{pmatrix}\quad\Longleftrightarrow\quad\begin{cases}2x+y=5\\x+y=3\end{cases}`} />
            <p className="text-ink/90">
              Матрицата не добавя нова магия. Тя <strong>събира цялата система в един запис</strong>.
              Изваждането на второто уравнение от първото дава <RichText text="$x=2$" />, после{" "}
              <RichText text="$y=1$" />. Тоест търсим кой вход е бил изпратен в изхода{" "}
              <RichText text="$\vec b=(5,3)$" />.
            </p>
            <p className="text-ink/90">
              Дотук това е ученическа елиминация и още не обяснява <em>защо</em> решението излиза
              точно едно. Отговорът е геометричен и вече го знаем от §3: умножението беше „вземи{" "}
              <RichText text="$x$" /> части от първата колона и <RichText text="$y$" /> части от
              втората“. Значи системата не пита нищо друго освен{" "}
              <strong>с каква рецепта се смесват двете колони, за да се получи</strong>{" "}
              <RichText text="$\vec b$" />.
            </p>
            <Formula latex={String.raw`x\begin{pmatrix}2\\1\end{pmatrix}+y\begin{pmatrix}1\\1\end{pmatrix}=\begin{pmatrix}5\\3\end{pmatrix}`} />
          </div>

          <div className="mt-5 mb-5">
            <PredictionQuestion
              prompt={String.raw`Двете колони на матрицата сочат в различни посоки. Колко двойки $(x,y)$ могат да улучат точно вектора $\vec b$?`}
              options={[
                { text: "Точно една, защото двете посоки покриват равнината без повторение", correct: true },
                { text: "Безброй много, защото плъзгачите приемат безброй стойности", correct: false },
                { text: String.raw`Нито една, ако $\vec b$ не лежи върху някоя от двете колони`, correct: false },
              ]}
              explanation={String.raw`Два неуспоредни вектора образуват базис: всяка точка на равнината се достига по точно един начин. Затова системата има единствено решение. Ако колоните бяха успоредни, комбинациите щяха да покриват само една права. Това е случаят, който следващият урок ще нарече $\det M=0$.`}
            />
          </div>
          <ColumnPicture />

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              { tag: "Вход", value: String.raw`$\vec x=(2,1)$`, text: "неизвестните величини" },
              { tag: "Машина", value: String.raw`$M=\begin{pmatrix}2&1\\1&1\end{pmatrix}$`, text: "как входовете се смесват" },
              { tag: "Изход", value: String.raw`$\vec b=(5,3)$`, text: "измерените резултати" },
            ].map((item) => (
              <div key={item.tag} className="rounded-[10px] border-[1.5px] border-ink bg-surface px-4 py-3 shadow-hard-sm">
                <p className="text-[10.5px] font-bold uppercase tracking-[.15em] text-minus">{item.tag}</p>
                <p className="mt-1 text-[14px] font-bold text-ink"><RichText text={item.value} /></p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-r-lg border-l-4 border-plus bg-hl px-4 py-3 text-[15.5px] leading-relaxed">
            <strong className="text-ink">Обратима матрица</strong> означава точно това: от всеки
            допустим изход можем да възстановим един-единствен вход. Обратното действие се означава
            с <RichText text="$M^{-1}$" /> и тогава <RichText text="$\vec x=M^{-1}\vec b$" />. Ако
            матрицата е смачкала равнината в права, различни входове са дали един и същ изход и
            възстановяването е невъзможно. Следващият урок ще даде точния тест кога това се случва.
          </div>
          <TeacherNote>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <RichText text={String.raw`Не въвеждайте обратната матрица първо като формула. Използвайте езика „бутон за отмяна“: завъртането и мащабирането могат да се отменят, но проекцията не може, защото е изтрила информация. Едва след това напишете $M^{-1}$.`} />
              </li>
              <li>
                <RichText text={String.raw`Проверка: ученикът трябва да може да прочете $M\vec x=\vec b$ с думи: „кой вход $\vec x$ машината $M$ е превърнала в измерения изход $\vec b$?“`} />
              </li>
              <li>
                На колонната картина поискайте първо да улучат кръгчето „на око“, преди да смятат.
                <RichText text={String.raw`Диагностичен въпрос след това: „ако втората колона беше $(4,2)$ вместо $(1,1)$, кои цели биха станали недостижими?“ Отговор: всички извън правата през $(2,1)$. Това е визуалният предвестник на $\det M=0$.`} />
              </li>
            </ul>
          </TeacherNote>
        </Section>

        {/* §5 Композиция */}
        <Section id="composition" n="§5" title="Умножението като последователност от действия">
          <div className="space-y-3">
            <p className="text-ink/90">
              Защо умножението на матрици е дефинирано по този странен начин „ред по колона“?
              Защото то е измислено да отговаря на въпроса:{" "}
              <strong>коя една матрица върши работата на две, приложени последователно?</strong>{" "}
              Пуснете двете последователности долу и вижте, че резултатите се разминават.
            </p>
          </div>
          <div className="mt-5">
            <CompositionOrder />
          </div>
          <TeacherNote>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <RichText text="Физическа демонстрация без екран: телефон върху масата. „Завърти на $90^\circ$, после обърни с екрана надолу“ се сравнява с обратния ред. Различният резултат се вижда с ръце." />
              </li>
              <li>
                <RichText text={String.raw`Записът $S\!\cdot\!R$ за „първо $R$“ е постоянен източник на грешки. Свържете го с $g(f(x))$: първата функция е най-близо до аргумента.`} />
              </li>
              <li>Питайте: „кога редът все пак не влияе?“ (две ротации; две мащабирания).</li>
            </ul>
          </TeacherNote>
        </Section>

        {/* §6 Приложения */}
        <Section id="applications" n="§6" title="Къде работят матриците">
          <div className="space-y-4">
            {[
              {
                tag: "Игри и компютърна графика",
                text: "Всеки кадър видеокартата умножава милиони върхове по матрици: ротация, мащаб, перспектива. Model-View-Projection е произведение на три матрици: композицията от §5 в индустриален мащаб.",
              },
              {
                tag: "Аеро и роботика",
                text: "Дрон, ракета или роботска ръка живее в няколко координатни системи едновременно (сензор, тяло, свят). Преводът между тях е ротационна матрица; автопилотът прави тези умножения стотици пъти в секунда.",
              },
              {
                tag: "Машинно обучение",
                text: String.raw`Един слой на невронна мрежа е $\,\vec y=\varphi(W\vec x+\vec b)$: матрицата $W$ смесва входовете. „Обучение“ значи подбиране на числата в матриците. Графичните процесори са бързи точно в умножението на матрици, затова са основен инструмент в изкуствения интелект.`,
              },
              {
                tag: "Инженерство и физика",
                text: "Напрежения в материал, инерчни тензори, свързани трептения, електрически четириполюсници: навсякъде, където „всяко влияе на всяко“ линейно, има матрица.",
              },
              {
                tag: "Мрежи и графи",
                text: "Матрицата на съседство кодира кой е свързан с кого; нейните степени броят маршрути. PageRank на Google е собствен вектор на огромна матрица на уеб-връзките.",
              },
            ].map((b) => (
              <div key={b.tag} className="rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4">
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-minus">
                  {b.tag}
                </span>
                <p className="mt-1.5 text-[15.5px] leading-relaxed text-ink/90"><RichText text={b.text} /></p>
              </div>
            ))}
          </div>
        </Section>

        {/* §7 Задачи */}
        <Section id="problems" n="§7" title="Задачи с водено решение">
          <div className="space-y-3">
            <p className="text-ink/90">
              Всяка задача е от практиката и следва реда на главата: първо двата геометрични
              въпроса, а чак след тях идва сметката, стъпка по стъпка. Фигурите се дострояват с всеки
              отговор.
            </p>
          </div>
          <div className="mt-5">
            <MatrixProblemSet />
          </div>
          <ProblemSetLinkCard note="Продължете към общата серия за линейна алгебра. Задача 10 използва матричния запис на детерминантата на Вандермонд, а останалите задачи показват къде водят детерминантите във векторния анализ." />
        </Section>

        {/* §8 Обобщение */}
        <Section id="recap" n="§8" title="Обобщение">
          <div className="rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard">
            <ul className="list-disc space-y-2 pl-5 text-[15.5px] leading-relaxed text-ink/90">
              <li>
                Матрицата не е таблица, а <strong>машина за трансформиране на цялата равнина</strong>;
                4 числа стигат, защото линейността пренася правилото върху всяка точка.
              </li>
              <li>
                <RichText text={String.raw`**Колоните са образите на базисните вектори.** Конструирането на матрица е отговор на въпроса „къде отиват $\hat{\imath}$ и $\hat{\jmath}$?“`} />
              </li>
              <li>
                <RichText text={String.raw`Умножение матрица-вектор: $x$ части от $\hat{\imath}'$ плюс $y$ части от $\hat{\jmath}'$.`} />
              </li>
              <li>
                <RichText text={String.raw`$M\vec x=\vec b$ е система от линейни уравнения в компактен вид: правата задача намира изхода $\vec b$, а обратната търси неизвестния вход $\vec x$. Колонната картина я чете като рецепта за смесване на колоните.`} />
              </li>
              <li>
                Обратимост означава, че входът може да се възстанови еднозначно. Проекцията губи
                информация и няма „undo“ матрица.
              </li>
              <li>
                <RichText text={String.raw`Умножението матрица-матрица е композиция на действия. Редът има значение: $S\!\cdot\!R$ означава „първо $R$“, а по принцип $A\!\cdot\!B\ne B\!\cdot\!A$.`} />
              </li>
              <li>
                Едни и същи матрици въртят спрайтове, навигират дронове, смесват сигнали в невронни
                мрежи. Научите ли геометрията, приложенията са „безплатни“.
              </li>
            </ul>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[10px] border-[1.5px] border-ok bg-ok/10 px-4 py-3">
              <p className="font-semibold text-ink">Можете да продължите, ако…</p>
              <p className="mt-1 text-[14.5px] leading-relaxed text-ink/85">
                <RichText text={String.raw`конструирате матрицата на дадено действие само от въпроса „къде отиват $\hat{\imath}$ и $\hat{\jmath}$?“ и обяснявате защо $S\!\cdot\!R$ значи „първо $R$“.`} />
              </p>
            </div>
            <div className="rounded-[10px] border-[1.5px] border-plus bg-plus/10 px-4 py-3">
              <p className="font-semibold text-ink">Върнете се към §3, ако…</p>
              <p className="mt-1 text-[14.5px] leading-relaxed text-ink/85">
                смятате умножението правилно, но не можете да кажете какво прави матрицата с
                картинката, без да смятате.
              </p>
            </div>
          </div>
          <p className="mt-5 text-ink/90">
            <strong>Следваща глава:</strong>{" "}
            <Link href="/math/lineina-algebra/determinanti" className="font-semibold text-minus hover:underline">
              Детерминанти: площта на трансформацията
            </Link>
            , едно число, което казва колко матрицата разтяга площите, дали обръща ориентацията и
            дали изобщо действието ѝ може да се отмени.
          </p>
        </Section>
      </main>
    </TeacherModeProvider>
  );
}
