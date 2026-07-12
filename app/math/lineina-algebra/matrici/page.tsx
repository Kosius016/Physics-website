import Link from "next/link";
import Formula from "@/components/Formula";
import LessonNav from "@/components/LessonNav";
import RichText from "@/components/RichText";
import Section from "@/components/Section";
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
  title: "Матрици — езикът на трансформациите · STEM Платформа",
};

const SECTION_NAV = [
  { id: "why", n: "§1", label: "Защо матрици" },
  { id: "playground", n: "§2", label: "Игрището" },
  { id: "columns", n: "§3", label: "Колоните" },
  { id: "composition", n: "§4", label: "Композиция" },
  { id: "applications", n: "§5", label: "Приложения" },
  { id: "problems", n: "§6", label: "Задачи" },
  { id: "recap", n: "§7", label: "Обобщение" },
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
              За такова действие ни трябва отделен обект — <strong>машина, която изяжда вектор и
              връща вектор</strong>, по едно и също правило за всички. Когато правилото е линейно
              (запазва мрежата от успоредни линии и началото), машината се описва с крайно малко
              информация: <strong>матрица</strong>. В 2D — само 4 числа, които кодират какво става
              с цялата безкрайна равнина.
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
            чак после как се записва и смята. Числата в матрицата не са таблица — те са инструкция.
          </div>
          <TeacherNote>
            <p>
              Добър вход: „имам снимка от 1 милион пиксела и искам да я завъртя — колко числа ми
              трябват, за да опиша завъртането?“ Отговорът (4, при милион точки) е първото „уау“ на
              линейната алгебра. Диагностика: ако ученикът мисли матрицата като „таблица с данни“,
              §2 е лекарството — не продължавайте към сметки, преди да е играл с плъзгачите.
            </p>
          </TeacherNote>
        </Section>

        {/* §2 Игрището */}
        <Section id="playground" n="§2" title="Какво прави матрицата: игрището">
          <div className="space-y-3">
            <p className="text-ink/90">
              Четирите плъзгача са четирите числа на матрицата. Всичко на екрана — решетката,
              жълтият квадрат, ракетата — се прекарва през нея. Опитайте preset-ите, после
              разбъркайте ръчно: кое число за какво отговаря?
            </p>
          </div>
          <div className="mt-5 mb-5">
            <PredictionQuestion
              prompt="Преди плъзгачите: какво ще направи с ракетата матрицата с колони î′ = (0, 1) и ĵ′ = (−1, 0)?"
              options={[
                { text: "Ще я завърти на 90° обратно на часовниковата стрелка", correct: true },
                { text: "Ще я обърне огледално", correct: false },
                { text: "Ще я разтегне по диагонала", correct: false },
              ]}
              explanation="î (дясно) отива нагоре, ĵ (горе) отива наляво — и двете са завъртени на 90° обратно на часовниковата стрелка, а с тях и цялата равнина. Проверете с preset-а „Ротация 90°“."
            />
          </div>
          <MatrixPlayground />
          <TeacherNote>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Дайте 3–4 минути свободна игра, после структурирайте: „направи ракетата двойно
                по-широка, без да пипаш височината“ (само a), „наклони я като италик“ (само b).
              </li>
              <li>
                Диагностичен въпрос: „кой плъзгач мести червената стрелка вертикално?“ (c — и това е
                моментът да се каже, че î′ = (a, c) е първата КОЛОНА).
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
              <strong>колоните на матрицата са образите на базисните вектори</strong>. Ако знаете
              къде кацат î = (1, 0) и ĵ = (0, 1), знаете къде каца всяка точка — защото всяка точка
              е комбинация от тях:
            </p>
            <Formula latex={String.raw`M = \begin{pmatrix} a & b \\ c & d \end{pmatrix}: \qquad \hat{\imath} = \begin{pmatrix}1\\0\end{pmatrix} \mapsto \begin{pmatrix}a\\c\end{pmatrix},\quad \hat{\jmath} = \begin{pmatrix}0\\1\end{pmatrix} \mapsto \begin{pmatrix}b\\d\end{pmatrix}`} />
            <p className="text-ink/90">
              Оттук умножението матрица–вектор не е формула за наизустяване, а изречение: „вземи{" "}
              <RichText text="$x$" /> части от новото î и <RichText text="$y$" /> части от новото
              ĵ“:
            </p>
            <Formula latex={String.raw`\begin{pmatrix} a & b \\ c & d \end{pmatrix}\begin{pmatrix} x \\ y \end{pmatrix} = x\begin{pmatrix} a \\ c \end{pmatrix} + y\begin{pmatrix} b \\ d \end{pmatrix} = \begin{pmatrix} ax + by \\ cx + dy \end{pmatrix}`} />
            <p className="text-ink/90">
              Затова конструирането на матрица за дадено действие започва винаги с един и същи
              въпрос: <strong>къде отиват î и ĵ?</strong> Отговорите се подреждат като колони —
              готово.
            </p>
          </div>
          <TeacherNote>
            <p>
              Тук се решава дали умножението ще е ритуал или разбиране. Накарайте ученика да изведе
              сам матрицата на ротация на 90° само от въпроса „къде отиват î и ĵ“ — без формули.
              Честа грешка: записване на образите като редове; лечението е проверка върху самия î
              (трябва да „излезе“ първата колона).
            </p>
          </TeacherNote>
        </Section>

        {/* §4 Композиция */}
        <Section id="composition" n="§4" title="Умножение = едно действие след друго">
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
                Физическа демонстрация без екран: телефон върху масата — „завърти 90°, после обърни
                с екрана надолу“ срещу обратния ред. Различният резултат се вижда с ръце.
              </li>
              <li>
                Записът S·R за „първо R“ е постоянен източник на грешки — закответе го към g(f(x)):
                първата функция е най-близо до аргумента.
              </li>
              <li>Питайте: „кога редът все пак не влияе?“ (две ротации; две мащабирания).</li>
            </ul>
          </TeacherNote>
        </Section>

        {/* §5 Приложения */}
        <Section id="applications" n="§5" title="Къде работят матриците">
          <div className="space-y-4">
            {[
              {
                tag: "Игри и компютърна графика",
                text: "Всеки кадър видеокартата умножава милиони върхове по матрици: ротация, мащаб, перспектива. „Model–View–Projection“ е просто произведение на три матрици — композицията от §4 в индустриален мащаб.",
              },
              {
                tag: "Аеро и роботика",
                text: "Дрон, ракета или роботска ръка живее в няколко координатни системи едновременно (сензор, тяло, свят). Преводът между тях е ротационна матрица; автопилотът прави тези умножения стотици пъти в секунда.",
              },
              {
                tag: "Машинно обучение",
                text: "Един слой на невронна мрежа е буквално y = φ(W·x + b): матрица W смесва входовете. „Обучение“ значи подбиране на числата в матриците. GPU-тата са бързи точно в умножение на матрици — затова са валутата на AI.",
              },
              {
                tag: "Инженерство и физика",
                text: "Напрежения в материал, инерчни тензори, свързани трептения, електрически четириполюсници — навсякъде, където „всяко влияе на всяко“ линейно, седи матрица.",
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
                <p className="mt-1.5 text-[15.5px] leading-relaxed text-ink/90">{b.text}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* §6 Задачи */}
        <Section id="problems" n="§6" title="Задачи с водено решение">
          <div className="space-y-3">
            <p className="text-ink/90">
              Всяка задача е от практиката и следва реда на главата: първо двата геометрични
              въпроса, чак след тях — сметката, стъпка по стъпка. Фигурите се дострояват с всеки
              отговор.
            </p>
          </div>
          <div className="mt-5">
            <MatrixProblemSet />
          </div>
        </Section>

        {/* §7 Обобщение */}
        <Section id="recap" n="§7" title="Обобщение">
          <div className="rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard">
            <ul className="list-disc space-y-2 pl-5 text-[15.5px] leading-relaxed text-ink/90">
              <li>
                Матрицата не е таблица, а <strong>машина за трансформиране на цялата равнина</strong>;
                4 числа стигат, защото линейността пренася правилото върху всяка точка.
              </li>
              <li>
                <strong>Колоните са образите на базисните вектори.</strong> Конструиране на матрица =
                отговор на „къде отиват î и ĵ?“.
              </li>
              <li>
                Умножение матрица–вектор: <RichText text="$x$" /> части от î′ плюс{" "}
                <RichText text="$y$" /> части от ĵ′.
              </li>
              <li>
                Умножение матрица–матрица = композиция на действия; редът има значение (S·R значи
                „първо R“), затова A·B ≠ B·A по принцип.
              </li>
              <li>
                Едни и същи матрици въртят спрайтове, навигират дронове, смесват сигнали в невронни
                мрежи — научите ли геометрията, приложенията са „безплатни“.
              </li>
            </ul>
          </div>
          <p className="mt-5 text-ink/90">
            <strong>Следваща глава:</strong>{" "}
            <Link href="/math/lineina-algebra/determinanti" className="font-semibold text-minus hover:underline">
              Детерминанти — площта на трансформацията
            </Link>{" "}
            — едно число, което казва колко матрицата разтяга площите, дали обръща ориентацията и
            дали изобщо действието ѝ може да се отмени.
          </p>
        </Section>
      </main>
    </TeacherModeProvider>
  );
}
