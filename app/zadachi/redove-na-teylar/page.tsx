import Link from "next/link";
import Formula from "@/components/Formula";
import LessonNav from "@/components/LessonNav";
import RichText from "@/components/RichText";
import Section from "@/components/Section";
import ProgressiveSolution from "@/components/materiali/ProgressiveSolution";
import TaylorProblemSet from "@/components/materiali/TaylorProblemSet";
import TaylorSeriesLab from "@/components/materiali/TaylorSeriesLab";
import {
  BinomialAccuracyFigure,
  DipolePotentialFigure,
  LimitRatioFigure,
  RingPotentialFigure,
} from "@/components/materiali/TaylorTaskFigures";
import {
  TeacherModeProvider,
  TeacherModeToggle,
  TeacherNote,
} from "@/components/interactives/TeacherMode";
import type { RichTextString } from "@/lib/types";

export const metadata = {
  title: "Задачи: редове на Тейлър и Маклорен · STEM Платформа",
  description:
    "Двадесет и две задачи: граници чрез редове, приложения в електростатиката и шест водени задачи от механиката, относителността и оптиката.",
};

const NAV = [
  { id: "tools", n: "§1", label: "Инструменти" },
  { id: "limits", n: "§2", label: "Граници" },
  { id: "electrostatics", n: "§3", label: "Електростатика" },
  { id: "numeric", n: "§4", label: "Пресмятания" },
  { id: "guided", n: "§5", label: "Водени задачи" },
  { id: "recap", n: "§6", label: "Обобщение" },
] as const;

function ProblemStatement({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard-sm">
      <p className="text-[11px] font-bold uppercase tracking-[.16em] text-plus">Условие</p>
      <div className="mt-3 space-y-3 text-[15.5px] leading-relaxed text-ink/90">{children}</div>
    </div>
  );
}

function ProblemTitle({ n, title }: { n: number; title: RichTextString }) {
  return (
    <h3 className="mb-3 mt-9 font-serif text-[21px] font-bold text-ink">
      <span className="mr-2 text-[13px] font-bold uppercase tracking-[.16em] text-minus">
        Задача {n}
      </span>
      <RichText text={title} />
    </h3>
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
        <h4 className="font-serif text-[20px] font-bold">
          <span className="sr-only">Подточка {label}: </span>
          <RichText text={title} />
        </h4>
        <div className="mt-2 space-y-3 text-[15.5px] leading-relaxed text-ink/90">{children}</div>
      </div>
    </div>
  );
}

function ResultBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-r-lg border-l-4 border-ok bg-ok/10 px-4 py-3 text-[15px] font-semibold">
      {children}
    </div>
  );
}

export default function TaylorProblemsPage() {
  return (
    <TeacherModeProvider>
      <main className="mx-auto max-w-3xl px-5 pb-24">
        <header className="pb-2 pt-11">
          <Link href="/zadachi" className="text-[13px] font-semibold text-minus hover:underline">
            Задачи / Математични методи
          </Link>
          <p className="mt-6 text-[11px] font-bold uppercase tracking-[.22em] text-minus">
            Практикум с водени решения
          </p>
          <h1 className="mt-2 font-serif text-[clamp(38px,7vw,58px)] font-bold leading-[1.04] text-ink">
            Редове на Тейлър и Маклорен
          </h1>
          <p className="mt-4 max-w-2xl text-[17px] text-muted">
            Първо се научаваме да смятаме граници, като заменяме функцията с първите ѝ
            членове. После същият похват описва потенциала на дипол, на пръстен и на
            двойка заряди, а след това дава числа с молив и лист. Накрая шест физични
            задачи проверяват дали похватът е усвоен.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-wide">
            <span className="rounded-full border-[1.5px] border-ink bg-surface px-3 py-1.5">
              <RichText text="$1$-$9$ граници" />
            </span>
            <span className="rounded-full border-[1.5px] border-ink bg-surface px-3 py-1.5">
              <RichText text="$10$-$16$ електростатика" />
            </span>
            <span className="rounded-full border-[1.5px] border-ink bg-surface px-3 py-1.5">
              <RichText text="$17$-$24$ пресмятания" />
            </span>
            <span className="rounded-full border-[1.5px] border-plus bg-plus/10 px-3 py-1.5 text-plus">
              <RichText text="$6$ водени задачи" />
            </span>
          </div>
          <div className="mt-6 rounded-[10px] border-[1.5px] border-rule bg-hl px-4 py-3 text-[14.5px] leading-relaxed">
            Навсякъде в раздела за електростатика използваме{" "}
            <RichText text={String.raw`$k=\dfrac1{4\pi\varepsilon_0}$`} />, а потенциалната
            разлика спрямо безкрайност се означава с{" "}
            <RichText text={String.raw`$\Delta V$`} />. Условието и указанието са видими
            веднага; решението се отключва стъпка по стъпка.
          </div>
        </header>

        <LessonNav items={NAV} right={<TeacherModeToggle />} />

        {/* ======================================================= §1 инструменти */}

        <Section id="tools" n="§1" title="Инструментите, с които се решава всичко тук">
          <p className="text-ink/90">
            Разгъването около нула заменя точната функция с многочлен. Първият член дава
            стойността, вторият наклона, третият огъването. Колкото по-близо сме до точката
            на разгъване, толкова по-малко членове стигат. Отместете плъзгача и вижте къде
            приближението спира да следва точната крива.
          </p>

          <div className="mt-6">
            <TaylorSeriesLab />
          </div>

          <div className="mt-8 space-y-4">
            <h3 className="font-serif text-[22px] font-bold text-ink">Редовете, които стигат</h3>
            <p className="text-[15.5px] text-ink/90">
              Записът <RichText text="$O(x^n)$" /> означава, че първият пропуснат принос е от
              порядък <RichText text="$x^n$" />. Той е нашият уред за грешка: щом знаем кой
              член сме изхвърлили, знаем и колко груб е отговорът.
            </p>
            <Formula latex={String.raw`\sin x=x-\frac{x^3}{3!}+\frac{x^5}{5!}+O(x^7)`} />
            <Formula latex={String.raw`\cos x=1-\frac{x^2}{2!}+\frac{x^4}{4!}+O(x^6)`} />
            <Formula latex={String.raw`\tan x=x+\frac{x^3}{3}+\frac{2x^5}{15}+O(x^7)`} />
            <Formula latex={String.raw`e^{x}=1+x+\frac{x^2}{2!}+\frac{x^3}{3!}+O(x^4)`} />
            <Formula latex={String.raw`\ln(1+x)=x-\frac{x^2}{2}+\frac{x^3}{3}+O(x^4),\qquad |x|<1`} />
            <Formula
              latex={String.raw`(1+x)^\alpha=1+\alpha x+\frac{\alpha(\alpha-1)}{2}x^2
              +\frac{\alpha(\alpha-1)(\alpha-2)}{6}x^3+O(x^4)`}
            />
            <p className="text-[15.5px] text-ink/90">
              Частният случай <RichText text="$\alpha=-1$" /> дава геометричния ред{" "}
              <RichText text={String.raw`$\frac1{1+x}=1-x+x^2-x^3+O(x^4)$`} />, който ще
              използваме при всеки точков заряд.
            </p>
          </div>

          <TeacherNote>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Диагностичен въпрос преди началото: „Малко спрямо какво?“ Учениците често
                наричат малко нещо размерно, например <RichText text="$a$" /> в метри.
              </li>
              <li>
                Честа грешка: разгъване по величина, която не е безразмерна. Проверката е
                проста: ако параметърът има мерна единица, изразът не може да се степенува
                смислено.
              </li>
            </ul>
          </TeacherNote>
        </Section>

        {/* ============================================================ §2 граници */}

        <Section id="limits" n="§2" title="Граници чрез редове">
          <p className="text-ink/90">
            Всички задачи тук са от вида <RichText text="$0/0$" />. Правилото на Лопитал би
            свършило работа, но редът показва <strong>защо</strong> отговорът е точно такъв:
            числителят и знаменателят започват с една и съща степен на{" "}
            <RichText text="$x$" />, тя се съкращава и остава отношението на коефициентите.
          </p>

          <div className="mt-6">
            <LimitRatioFigure />
          </div>

          <ProblemTitle n={1} title={String.raw`Основната граница $\dfrac{\sin x}{x}$`} />
          <ProblemStatement>
            <p>
              Покажете чрез реда на Маклорен за <RichText text="$\sin x$" />, че{" "}
              <RichText text={String.raw`$\lim\limits_{x\to0}\dfrac{\sin x}{x}=1$`} />.
            </p>
          </ProblemStatement>
          <ProgressiveSolution
            hint={
              <RichText text={String.raw`Не съкращавайте наум. Запишете реда, разделете почленно на $x$ и чак тогава пуснете $x\to0$.`} />
            }
          >
            <SolutionPart label="a" title="Записваме реда">
              <Formula latex={String.raw`\sin x=x-\frac{x^3}{6}+\frac{x^5}{120}+O(x^7)`} />
            </SolutionPart>
            <SolutionPart label="b" title="Делим почленно">
              <Formula latex={String.raw`\frac{\sin x}{x}=1-\frac{x^2}{6}+\frac{x^4}{120}+O(x^6)`} />
              <p>
                Дясната страна вече е обикновен многочлен: няма деление на нула и стойността
                при <RichText text="$x=0$" /> се чете направо.
              </p>
            </SolutionPart>
            <SolutionPart label="c" title="Пускаме границата">
              <ResultBox>
                <RichText text={String.raw`$\lim\limits_{x\to0}\dfrac{\sin x}{x}=1$, защото всеки член с $x$ изчезва.`} />
              </ResultBox>
            </SolutionPart>
          </ProgressiveSolution>

          <ProblemTitle n={2} title={String.raw`$\dfrac{\sin 3x}{x}$`} />
          <ProblemStatement>
            <p>
              Намерете <RichText text={String.raw`$\lim\limits_{x\to0}\dfrac{\sin 3x}{x}$`} />.
            </p>
          </ProblemStatement>
          <ProgressiveSolution
            hint={
              <RichText text={String.raw`Редът за $\sin$ важи за целия аргумент. Заместете $x\to3x$ навсякъде, включително в кубичния член.`} />
            }
          >
            <SolutionPart label="a" title="Разгъваме по аргумента">
              <Formula latex={String.raw`\sin 3x=3x-\frac{(3x)^3}{6}+O(x^5)=3x-\frac{9x^3}{2}+O(x^5)`} />
            </SolutionPart>
            <SolutionPart label="b" title="Делим и пускаме границата">
              <Formula latex={String.raw`\frac{\sin 3x}{x}=3-\frac{9x^2}{2}+O(x^4)\ \longrightarrow\ 3`} />
              <ResultBox>
                <RichText text={String.raw`Границата е $3$. Обърнете внимание, че $(3x)^3=27x^3$, а не $3x^3$: това е най-честата грешка тук.`} />
              </ResultBox>
            </SolutionPart>
          </ProgressiveSolution>

          <ProblemTitle n={3} title={String.raw`Общият случай $\dfrac{\sin(ax)}{bx}$`} />
          <ProblemStatement>
            <p>
              Намерете в общ вид{" "}
              <RichText text={String.raw`$\lim\limits_{x\to0}\dfrac{\sin(ax)}{bx}$`} />, където{" "}
              <RichText text={String.raw`$a,b\neq0$`} />.
            </p>
          </ProblemStatement>
          <ProgressiveSolution
            hint={
              <RichText text={String.raw`Задачи 1 и 2 са частни случаи. Проверете отговора си с тях: $a=b=1$ трябва да върне $1$, а $a=3,\ b=1$ трябва да върне $3$.`} />
            }
          >
            <SolutionPart label="a" title="Разгъваме и делим">
              <Formula
                latex={String.raw`\frac{\sin(ax)}{bx}=\frac{ax-\dfrac{a^3x^3}{6}+O(x^5)}{bx}
                =\frac{a}{b}-\frac{a^3x^2}{6b}+O(x^4)`}
              />
            </SolutionPart>
            <SolutionPart label="b" title="Четем границата">
              <ResultBox>
                <RichText text={String.raw`$\lim\limits_{x\to0}\dfrac{\sin(ax)}{bx}=\dfrac{a}{b}$. Проверка: при $a=3,\ b=1$ се връща отговорът на задача 2.`} />
              </ResultBox>
            </SolutionPart>
          </ProgressiveSolution>

          <ProblemTitle n={4} title={String.raw`$\dfrac{1-\cos x}{x^2}$`} />
          <ProblemStatement>
            <p>
              Намерете{" "}
              <RichText text={String.raw`$\lim\limits_{x\to0}\dfrac{1-\cos x}{x^2}$`} />.
            </p>
          </ProblemStatement>
          <ProgressiveSolution
            hint={
              <RichText text={String.raw`Единицата в реда за $\cos x$ се съкращава с единицата отпред. Остава водещ член от ред $x^2$, точно колкото е знаменателят.`} />
            }
          >
            <SolutionPart label="a" title="Изваждаме от единица">
              <Formula
                latex={String.raw`1-\cos x=1-\left(1-\frac{x^2}{2}+\frac{x^4}{24}+O(x^6)\right)
                =\frac{x^2}{2}-\frac{x^4}{24}+O(x^6)`}
              />
            </SolutionPart>
            <SolutionPart label="b" title="Делим и пускаме границата">
              <Formula latex={String.raw`\frac{1-\cos x}{x^2}=\frac12-\frac{x^2}{24}+O(x^4)\ \longrightarrow\ \frac12`} />
              <ResultBox>
                <RichText text={String.raw`Границата е $\tfrac12$. Тя се вижда и на зелената крива от фигурата в началото на раздела.`} />
              </ResultBox>
            </SolutionPart>
          </ProgressiveSolution>

          <ProblemTitle n={5} title={String.raw`$\dfrac{\sin x-x}{x^3}$`} />
          <ProblemStatement>
            <p>
              Намерете{" "}
              <RichText text={String.raw`$\lim\limits_{x\to0}\dfrac{\sin x-x}{x^3}$`} />.
            </p>
          </ProblemStatement>
          <ProgressiveSolution
            hint={
              <RichText text={String.raw`Изваждането на $x$ убива водещия член. Първият оцелял е кубичният, затова знаменателят $x^3$ е точно на място.`} />
            }
          >
            <SolutionPart label="a" title="Какво остава след изваждането">
              <Formula latex={String.raw`\sin x-x=-\frac{x^3}{6}+\frac{x^5}{120}+O(x^7)`} />
            </SolutionPart>
            <SolutionPart label="b" title="Делим и пускаме границата">
              <Formula latex={String.raw`\frac{\sin x-x}{x^3}=-\frac16+\frac{x^2}{120}+O(x^4)\ \longrightarrow\ -\frac16`} />
              <ResultBox>
                <RichText text={String.raw`Границата е $-\tfrac16$. Знакът е отрицателен, защото за малки положителни $x$ важи $\sin x<x$.`} />
              </ResultBox>
            </SolutionPart>
          </ProgressiveSolution>

          <ProblemTitle n={6} title={String.raw`$\dfrac{x-\sin x}{x\,(1-\cos x)}$`} />
          <ProblemStatement>
            <p>
              Намерете{" "}
              <RichText text={String.raw`$\lim\limits_{x\to0}\dfrac{x-\sin x}{x(1-\cos x)}$`} />.
            </p>
          </ProblemStatement>
          <ProgressiveSolution
            hint={
              <RichText text={String.raw`Разгънете числителя и знаменателя поотделно до първия ненулев член. Ако и двата започват с $x^3$, отговорът е отношението на коефициентите.`} />
            }
          >
            <SolutionPart label="a" title="Числителят">
              <Formula latex={String.raw`x-\sin x=\frac{x^3}{6}-\frac{x^5}{120}+O(x^7)`} />
            </SolutionPart>
            <SolutionPart label="b" title="Знаменателят">
              <Formula
                latex={String.raw`x(1-\cos x)=x\left(\frac{x^2}{2}-\frac{x^4}{24}+O(x^6)\right)
                =\frac{x^3}{2}-\frac{x^5}{24}+O(x^7)`}
              />
            </SolutionPart>
            <SolutionPart label="c" title="Съкращаваме водещата степен">
              <Formula
                latex={String.raw`\frac{x-\sin x}{x(1-\cos x)}
                =\frac{\dfrac16-\dfrac{x^2}{120}+O(x^4)}{\dfrac12-\dfrac{x^2}{24}+O(x^4)}
                \ \longrightarrow\ \frac{1/6}{1/2}`}
              />
              <ResultBox>
                <RichText text={String.raw`Границата е $\tfrac13$. Съкращава се $x^3$, а не $x$: и двата израза започват от трета степен.`} />
              </ResultBox>
            </SolutionPart>
          </ProgressiveSolution>

          <ProblemTitle n={7} title={String.raw`$\dfrac{\ln(1+x)}{x}$`} />
          <ProblemStatement>
            <p>
              Намерете{" "}
              <RichText text={String.raw`$\lim\limits_{x\to0}\dfrac{\ln(1+x)}{x}$`} />.
            </p>
          </ProblemStatement>
          <ProgressiveSolution
            hint={
              <RichText text={String.raw`Редът за $\ln(1+x)$ започва направо с $x$. Внимавайте: разгъването е около нула за $x$, а не за целия аргумент $1+x$.`} />
            }
          >
            <SolutionPart label="a" title="Разгъваме и делим">
              <Formula
                latex={String.raw`\frac{\ln(1+x)}{x}=\frac{x-\dfrac{x^2}{2}+\dfrac{x^3}{3}+O(x^4)}{x}
                =1-\frac{x}{2}+\frac{x^2}{3}+O(x^3)`}
              />
            </SolutionPart>
            <SolutionPart label="b" title="Четем границата">
              <ResultBox>
                <RichText text={String.raw`Границата е $1$. Оттук следва и познатото приближение $\ln(1+x)\approx x$ при малки $x$, което се използва в термодинамиката и в оценките на грешка.`} />
              </ResultBox>
            </SolutionPart>
          </ProgressiveSolution>

          <ProblemTitle n={8} title={String.raw`$\dfrac{\ln(1+x)-x}{x^2}$`} />
          <ProblemStatement>
            <p>
              Намерете{" "}
              <RichText text={String.raw`$\lim\limits_{x\to0}\dfrac{\ln(1+x)-x}{x^2}$`} />.
            </p>
          </ProblemStatement>
          <ProgressiveSolution
            hint={
              <RichText text={String.raw`Пак изваждаме водещия член. Този път следващият е квадратичен, а не кубичен, затова знаменателят е $x^2$.`} />
            }
          >
            <SolutionPart label="a" title="Какво остава след изваждането">
              <Formula latex={String.raw`\ln(1+x)-x=-\frac{x^2}{2}+\frac{x^3}{3}+O(x^4)`} />
            </SolutionPart>
            <SolutionPart label="b" title="Делим и пускаме границата">
              <Formula latex={String.raw`\frac{\ln(1+x)-x}{x^2}=-\frac12+\frac{x}{3}+O(x^2)\ \longrightarrow\ -\frac12`} />
              <ResultBox>
                <RichText text={String.raw`Границата е $-\tfrac12$. Сравнете със задача 5: там първата поправка беше кубична, тук е квадратична, защото $\ln$ няма симетрията на $\sin$.`} />
              </ResultBox>
            </SolutionPart>
          </ProgressiveSolution>

          <ProblemTitle n={9} title={String.raw`$\dfrac{\sin x-x+\frac{x^3}{6}}{x^5}$`} />
          <ProblemStatement>
            <p>
              Намерете{" "}
              <RichText
                text={String.raw`$\lim\limits_{x\to0}\dfrac{\sin x-x+\frac{x^3}{6}}{x^5}$`}
              />
              .
            </p>
          </ProblemStatement>
          <ProgressiveSolution
            hint={
              <RichText text={String.raw`Числителят е нарочно построен така, че да убие и двата първи члена на $\sin x$. Затова редът трябва да се знае поне до $x^5$.`} />
            }
          >
            <SolutionPart label="a" title="Изваждаме двата известни члена">
              <Formula
                latex={String.raw`\sin x-x+\frac{x^3}{6}
                =\left(x-\frac{x^3}{6}+\frac{x^5}{120}-\frac{x^7}{5040}+\cdots\right)-x+\frac{x^3}{6}
                =\frac{x^5}{120}-\frac{x^7}{5040}+\cdots`}
              />
            </SolutionPart>
            <SolutionPart label="b" title="Делим и пускаме границата">
              <Formula latex={String.raw`\frac{\sin x-x+\frac{x^3}{6}}{x^5}=\frac1{120}-\frac{x^2}{5040}+O(x^4)\ \longrightarrow\ \frac1{120}`} />
              <ResultBox>
                <RichText text={String.raw`Границата е $\dfrac1{120}=\dfrac1{5!}$. Това не е съвпадение: коефициентът пред $x^n$ в реда на Маклорен е $f^{(n)}(0)/n!$.`} />
              </ResultBox>
            </SolutionPart>
          </ProgressiveSolution>

          <TeacherNote>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Задачи 5, 8 и 9 показват едно и също: изваждането на известните членове
                „вдига“ реда на числителя. Питайте предварително коя ще е първата оцеляла
                степен, преди да се смята.
              </li>
              <li>
                Честа грешка в задача 2: <RichText text="$(3x)^3$" /> се пише като{" "}
                <RichText text="$3x^3$" />. Резултатът за границата остава верен, но първата
                поправка става грешна, а тя е същинската полза от реда.
              </li>
              <li>
                Задача 6 разграничава учениците, които съкращават механично, от тези, които
                следят от коя степен започва всеки израз.
              </li>
            </ul>
          </TeacherNote>
        </Section>

        {/* ==================================================== §3 електростатика */}

        <Section id="electrostatics" n="§3" title="Приложения в електростатиката">
          <p className="text-ink/90">
            Тук редът престава да бъде упражнение и става инструмент. Точният потенциал на
            няколко заряда е сбор от корени и дроби, от който нищо не се вижда. Разгъването
            по малкия параметър <RichText text="$a/x$" /> или{" "}
            <RichText text="$R/z$" /> изважда наяве кое влияе най-силно отдалеч и кое се
            губи. Навсякъде <RichText text={String.raw`$\Delta V$`} /> означава потенциалната
            разлика спрямо безкрайност, а{" "}
            <RichText text={String.raw`$k=\dfrac1{4\pi\varepsilon_0}$`} />.
          </p>

          <ProblemTitle n={10} title="Изместен точков заряд, гледан отдалеч" />
          <ProblemStatement>
            <p>
              Точков заряд <RichText text="$q$" /> се намира на оста{" "}
              <RichText text="$x$" /> в точката <RichText text="$x=a$" />. За{" "}
              <RichText text="$x>a$" /> потенциалът е
            </p>
            <Formula latex={String.raw`\Delta V(x)=\frac{kq}{x-a}`} />
            <p>
              Намерете приближение за потенциала при <RichText text={String.raw`$x\gg a$`} />{" "}
              до член от ред <RichText text={String.raw`$a^2/x^2$`} /> включително.
            </p>
          </ProblemStatement>
          <ProgressiveSolution
            hint={
              <RichText text={String.raw`Малкият безразмерен параметър е $a/x\ll1$. Изнесете $x$ пред скоба, за да се появи изразът $\frac1{1-u}$.`} />
            }
          >
            <SolutionPart label="a" title="Изнасяме мащаба">
              <Formula
                latex={String.raw`\Delta V(x)=\frac{kq}{x-a}=\frac{kq}{x\left(1-\dfrac{a}{x}\right)}
                =\frac{kq}{x}\cdot\frac1{1-u},\qquad u=\frac{a}{x}\ll1`}
              />
              <p>
                Едва след това деление имаме безразмерна величина, която може да се степенува.
                Самото <RichText text="$a$" /> е в метри и не става за разгъване.
              </p>
            </SolutionPart>
            <SolutionPart label="b" title="Прилагаме геометричния ред">
              <Formula latex={String.raw`\frac1{1-u}=1+u+u^2+O(u^3)`} />
            </SolutionPart>
            <SolutionPart label="c" title="Връщаме се към величините">
              <Formula
                latex={String.raw`\boxed{\ \Delta V(x)\approx\frac{kq}{x}\left(1+\frac{a}{x}+\frac{a^2}{x^2}\right)\ }`}
              />
              <ResultBox>
                <RichText text={String.raw`Водещият член $kq/x$ е потенциалът на същия заряд, поставен в началото. Поправките казват само едно: зарядът всъщност е малко по-близо, затова потенциалът е малко по-голям. И трите члена са положителни.`} />
              </ResultBox>
            </SolutionPart>
          </ProgressiveSolution>

          <ProblemTitle n={11} title="Потенциал на дипол по оста" />
          <ProblemStatement>
            <p>
              Два заряда <RichText text="$+q$" /> и <RichText text="$-q$" /> са разположени
              съответно в точките <RichText text="$x=a$" /> и <RichText text="$x=-a$" />. По
              оста <RichText text="$x$" />, за <RichText text="$x>a$" />, потенциалът е
            </p>
            <Formula latex={String.raw`\Delta V(x)=kq\left(\frac1{x-a}-\frac1{x+a}\right)`} />
            <ol className="list-[lower-alpha] space-y-1.5 pl-6">
              <li>
                Намерете първия ненулев член при <RichText text={String.raw`$x\gg a$`} />.
              </li>
              <li>
                Въведете диполния момент <RichText text="$p=2qa$" /> и запишете резултата чрез{" "}
                <RichText text="$p$" />.
              </li>
            </ol>
          </ProblemStatement>
          <ProgressiveSolution
            hint={
              <RichText text={String.raw`Разгънете и двете дроби по $u=a/x$. Втората се получава от първата със замяна $a\to-a$, тоест със смяна на знака при нечетните степени.`} />
            }
          >
            <SolutionPart label="a" title="Двете разгъвания едно до друго">
              <Formula
                latex={String.raw`\frac{1}{x-a}=\frac1x\left(1+u+u^2+u^3+\cdots\right),\qquad
                \frac{1}{x+a}=\frac1x\left(1-u+u^2-u^3+\cdots\right)`}
              />
            </SolutionPart>
            <SolutionPart label="b" title="Изваждаме: четните степени се убиват">
              <Formula
                latex={String.raw`\Delta V(x)=\frac{kq}{x}\left[(1+u+u^2+u^3)-(1-u+u^2-u^3)\right]+\cdots
                =\frac{kq}{x}\left(2u+2u^3+\cdots\right)`}
              />
              <p>
                Постоянните членове се съкращават, защото пълният заряд е нула. Затова{" "}
                <RichText text="$1/x$" /> изчезва и водещото поведение е по-бързо спадащо.
              </p>
            </SolutionPart>
            <SolutionPart label="c" title="Първият ненулев член">
              <Formula
                latex={String.raw`\Delta V(x)\approx\frac{kq}{x}\cdot\frac{2a}{x}=\frac{2kqa}{x^2}`}
              />
            </SolutionPart>
            <SolutionPart label="d" title="Чрез диполния момент">
              <Formula latex={String.raw`\boxed{\ \Delta V(x)\approx\frac{kp}{x^2},\qquad p=2qa\ }`} />
              <ResultBox>
                <RichText text={String.raw`Потенциалът на дипола спада като $1/x^2$, тоест по-бързо от този на единичен заряд. Отдалеч диполът не се вижда като заряд, а само като разделяне на заряд.`} />
              </ResultBox>
            </SolutionPart>
          </ProgressiveSolution>

          <div className="mt-6">
            <DipolePotentialFigure />
          </div>

          <ProblemTitle n={12} title="Поле на дипола по оста му" />
          <ProblemStatement>
            <p>
              Използвайте резултата от предната задача и{" "}
              <RichText text={String.raw`$E_x=-\dfrac{d(\Delta V)}{dx}$`} />, за да намерите
              приблизително електричното поле на дипола по оста му при{" "}
              <RichText text={String.raw`$x\gg a$`} />.
            </p>
          </ProblemStatement>
          <ProgressiveSolution
            hint={
              <RichText text={String.raw`Диференцирайте приближението, а не точния израз. Записът $x^{-2}$ прави производната по-безопасна от записа с дроб.`} />
            }
          >
            <SolutionPart label="a" title="Диференцираме приближението">
              <Formula
                latex={String.raw`E_x=-\frac{d}{dx}\left(kp\,x^{-2}\right)=-kp\cdot(-2)x^{-3}`}
              />
            </SolutionPart>
            <SolutionPart label="b" title="Резултат и проверка на знака">
              <Formula latex={String.raw`\boxed{\ E_x\approx\frac{2kp}{x^3}\ }`} />
              <ResultBox>
                <RichText text={String.raw`Полето спада като $1/x^3$, с една степен по-бързо от потенциала. Знакът е положителен: по положителната посока на оста най-близо е зарядът $+q$, затова полето сочи навън.`} />
              </ResultBox>
              <p>
                Общото правило зад това: <RichText text="$E$" /> е производна на{" "}
                <RichText text={String.raw`$\Delta V$`} />, затова всяко разгъване на
                потенциала до ред <RichText text={String.raw`$1/x^n$`} /> дава поле до ред{" "}
                <RichText text={String.raw`$1/x^{n+1}$`} />.
              </p>
            </SolutionPart>
          </ProgressiveSolution>

          <ProblemTitle n={13} title="Два еднакви заряда: защо липсва член от ред $1/x^2$" />
          <ProblemStatement>
            <p>
              Два еднакви заряда <RichText text="$+q$" /> са разположени в точките{" "}
              <RichText text={String.raw`$x=\pm a$`} />. По оста потенциалът е
            </p>
            <Formula latex={String.raw`\Delta V(x)=kq\left(\frac1{x-a}+\frac1{x+a}\right)`} />
            <ol className="list-[lower-alpha] space-y-1.5 pl-6">
              <li>
                Намерете първите два ненулеви члена при{" "}
                <RichText text={String.raw`$x\gg a$`} />.
              </li>
              <li>
                Обяснете защо членът, пропорционален на{" "}
                <RichText text={String.raw`$1/x^2$`} />, изчезва.
              </li>
            </ol>
          </ProblemStatement>
          <ProgressiveSolution
            hint={
              <RichText text={String.raw`Тук двете разгъвания се събират, а не се изваждат. Сравнете кои степени оцеляват със задача 11 и потърсете симетрията, преди да смятате.`} />
            }
          >
            <SolutionPart label="a" title="Събираме двата реда">
              <Formula
                latex={String.raw`\Delta V(x)=\frac{kq}{x}\left[(1+u+u^2+u^3)+(1-u+u^2-u^3)\right]+\cdots
                =\frac{kq}{x}\left(2+2u^2+\cdots\right)`}
              />
            </SolutionPart>
            <SolutionPart label="b" title="Първите два ненулеви члена">
              <Formula
                latex={String.raw`\boxed{\ \Delta V(x)\approx kq\left(\frac{2}{x}+\frac{2a^2}{x^3}\right)\ }`}
              />
              <p>
                Водещият член е потенциалът на пълния заряд <RichText text="$2q$" />, събран в
                началото. Първата поправка е от ред <RichText text={String.raw`$1/x^3$`} />.
              </p>
            </SolutionPart>
            <SolutionPart label="c" title={String.raw`Защо няма член $1/x^2$`}>
              <p>
                Математически: при събирането нечетните степени на <RichText text="$u$" /> се
                съкращават, а членът от ред <RichText text={String.raw`$1/x^2$`} /> идва
                именно от <RichText text={String.raw`$u^1$`} />.
              </p>
              <p>
                Физически: коефициентът пред <RichText text={String.raw`$1/x^2$`} /> е
                диполният момент на подредбата.
              </p>
              <Formula latex={String.raw`p=q\cdot a+q\cdot(-a)=0`} />
              <ResultBox>
                <RichText text={String.raw`Симетричната двойка няма диполен момент, затова няма и член $1/x^2$. Първата поправка идва от следващия по ред момент, квадруполния, и спада като $1/x^3$.`} />
              </ResultBox>
            </SolutionPart>
          </ProgressiveSolution>

          <ProblemTitle n={14} title="Зареден пръстен, гледан отдалеч" />
          <ProblemStatement>
            <p>
              Пръстен с радиус <RichText text="$R$" /> и общ заряд <RichText text="$Q$" />{" "}
              има потенциал по оста си
            </p>
            <Formula latex={String.raw`\Delta V(z)=\frac{kQ}{\sqrt{z^2+R^2}}`} />
            <p>
              Намерете приближението при <RichText text={String.raw`$z\gg R$`} /> до първата
              поправка към потенциала на точков заряд.
            </p>
          </ProblemStatement>
          <ProgressiveSolution
            hint={
              <RichText text={String.raw`Изнесете $z$ изпод корена. Малкият параметър е $R^2/z^2$, а показателят е $\alpha=-\tfrac12$.`} />
            }
          >
            <SolutionPart label="a" title="Изнасяме мащаба изпод корена">
              <Formula
                latex={String.raw`\Delta V(z)=\frac{kQ}{z\sqrt{1+\dfrac{R^2}{z^2}}}
                =\frac{kQ}{z}\left(1+w\right)^{-1/2},\qquad w=\frac{R^2}{z^2}\ll1`}
              />
            </SolutionPart>
            <SolutionPart label="b" title="Биномен ред с половинен показател">
              <Formula latex={String.raw`(1+w)^{-1/2}=1-\frac{w}{2}+\frac38w^2+O(w^3)`} />
            </SolutionPart>
            <SolutionPart label="c" title="Първата поправка">
              <Formula
                latex={String.raw`\boxed{\ \Delta V(z)\approx\frac{kQ}{z}\left(1-\frac{R^2}{2z^2}\right)\ }`}
              />
              <ResultBox>
                <RichText text={String.raw`Поправката е **отрицателна**, и това може да се провери без сметки: всяка точка от пръстена е на разстояние $\sqrt{z^2+R^2}>z$, тоест по-далеч от центъра. Затова истинският потенциал е по-малък от този на точков заряд $Q$.`} />
              </ResultBox>
              <p>
                Забележете и че поправката е от ред <RichText text={String.raw`$R^2/z^2$`} />,
                а не <RichText text={String.raw`$R/z$`} />: пръстенът е симетричен и няма
                диполен момент, точно както в задача 13.
              </p>
            </SolutionPart>
          </ProgressiveSolution>

          <div className="mt-6">
            <RingPotentialFigure />
          </div>

          <ProblemTitle n={15} title="Поле близо до центъра на пръстена" />
          <ProblemStatement>
            <p>По оста на същия зареден пръстен електричното поле е</p>
            <Formula latex={String.raw`E(z)=k\frac{Qz}{(z^2+R^2)^{3/2}}`} />
            <ol className="list-[lower-alpha] space-y-1.5 pl-6">
              <li>
                Намерете приближението при <RichText text={String.raw`$z\ll R$`} /> до
                най-нисък ненулев ред по <RichText text="$z$" />.
              </li>
              <li>
                Как зависи полето от <RichText text="$z$" /> близо до центъра?
              </li>
            </ol>
          </ProblemStatement>
          <ProgressiveSolution
            hint={
              <RichText text={String.raw`Тук голямата величина е $R$, а не $z$. Изнесете $R$ изпод скобата и разгънете по $z^2/R^2$.`} />
            }
          >
            <SolutionPart label="a" title="Изнасяме правилния мащаб">
              <Formula
                latex={String.raw`(z^2+R^2)^{3/2}=R^3\left(1+\frac{z^2}{R^2}\right)^{3/2}
                \ \Longrightarrow\ E(z)=\frac{kQz}{R^3}\left(1+\frac{z^2}{R^2}\right)^{-3/2}`}
              />
              <p>
                Смяната на мащаба е цялата задача. Ако се изнесе <RichText text="$z$" />,
                параметърът става <RichText text={String.raw`$R^2/z^2$`} />, който тук е
                голям, и редът не се сходи.
              </p>
            </SolutionPart>
            <SolutionPart label="b" title="Най-нисък ненулев ред">
              <Formula
                latex={String.raw`\left(1+\frac{z^2}{R^2}\right)^{-3/2}=1+O\!\left(\frac{z^2}{R^2}\right)
                \ \Longrightarrow\ \boxed{\ E(z)\approx\frac{kQ}{R^3}\,z\ }`}
              />
            </SolutionPart>
            <SolutionPart label="c" title="Какво означава линейната зависимост">
              <ResultBox>
                <RichText text={String.raw`Полето расте **линейно** с отместването от центъра: $E\propto z$.`} />
              </ResultBox>
              <p>
                За заряд с обратен знак това е точно законът на Хук:{" "}
                <RichText text={String.raw`$F=-\dfrac{kQq}{R^3}z$`} />. Затова малко
                отклонение по оста дава хармонично трептене около центъра. В центъра{" "}
                <RichText text="$E=0$" /> по симетрия, а не защото сме пренебрегнали нещо.
              </p>
            </SolutionPart>
          </ProgressiveSolution>

          <ProblemTitle n={16} title="Следващата поправка и къде свършва линейният закон" />
          <ProblemStatement>
            <p>
              За предната задача намерете и следващия коригиращ член в разлагането на{" "}
              <RichText text="$E(z)$" />.
            </p>
          </ProblemStatement>
          <ProgressiveSolution
            hint={
              <RichText text={String.raw`Приложете биномния ред за $(1+w)^{-3/2}$ с $w=z^2/R^2$ и запазете и втория член.`} />
            }
          >
            <SolutionPart label="a" title="Биномният ред с показател -3/2">
              <Formula latex={String.raw`(1+w)^{-3/2}=1-\frac32w+\frac{15}{8}w^2+O(w^3)`} />
            </SolutionPart>
            <SolutionPart label="b" title="Връщаме мащаба">
              <Formula
                latex={String.raw`\boxed{\ E(z)\approx\frac{kQ}{R^3}\,z\left(1-\frac32\frac{z^2}{R^2}\right)\ }`}
              />
            </SolutionPart>
            <SolutionPart label="c" title="Физическата проверка">
              <p>
                Поправката е отрицателна, тоест истинското поле изостава от правата линия.
                Това трябва да е така: полето не може да расте неограничено, защото далеч от
                пръстена то отново спада като <RichText text={String.raw`$1/z^2$`} />.
                Някъде между двата режима има максимум.
              </p>
              <Formula
                latex={String.raw`\frac{dE}{dz}=0\ \Longrightarrow\ z_{\max}=\frac{R}{\sqrt2}\approx0{,}707R`}
              />
              <ResultBox>
                <RichText text={String.raw`Линейният закон е добър само за $z$, съществено по-малко от $R$. Ако сложим $z=0{,}3R$, поправката е $-\tfrac32(0{,}09)=-13{,}5\,\%$: вече осезаема, но все още поправка.`} />
              </ResultBox>
            </SolutionPart>
          </ProgressiveSolution>

          <TeacherNote>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Задачи 11 и 13 са двойка. Питайте предварително коя подредба ще спада
                по-бързо и защо, преди да се смята. Отговорът се вижда от пълния заряд.
              </li>
              <li>
                Задача 15 разделя учениците, които разгъват механично, от тези, които първо
                питат кой параметър е малък. Изнасянето на <RichText text="$z$" /> вместо на{" "}
                <RichText text="$R$" /> е най-честата грешка в целия раздел.
              </li>
              <li>
                Полезно упражнение върху задача 14: помолете за оценка на грешката при{" "}
                <RichText text="$z=2R$" /> преди да погледнат лентата под фигурата.
              </li>
            </ul>
          </TeacherNote>
        </Section>

        {/* ====================================================== §4 пресмятания */}

        <Section id="numeric" n="§4" title="Пресмятания с молив и лист">
          <p className="text-ink/90">
            Досега редът служеше да се разбере как се държи една зависимост. Тук той върши
            съвсем прозаична работа: дава <strong>число</strong>. Похватът е винаги един и
            същ. Изнася се близка кръгла стойност, остатъкът се записва като{" "}
            <RichText text="$1+x$" /> с малко <RichText text="$x$" />, разгъва се и се
            запазват толкова члена, колкото исканата точност изисква. Първият изхвърлен член
            е и оценката за грешката, затова отговорът идва заедно с гаранцията си.
          </p>

          <ProblemTitle n={17} title={String.raw`Пресметнете $\sqrt{101}$`} />
          <ProblemStatement>
            <p>
              Намерете <RichText text={String.raw`$\sqrt{101}$`} /> без калкулатор:
            </p>
            <ol className="list-[lower-alpha] space-y-1.5 pl-6">
              <li>с два члена от реда;</li>
              <li>с три члена;</li>
              <li>
                оценете относителната грешка и на двата отговора. Точната стойност е{" "}
                <RichText text={String.raw`$\sqrt{101}=10{,}049875621$`} />.
              </li>
            </ol>
          </ProblemStatement>
          <ProgressiveSolution
            hint={
              <RichText text={String.raw`Търсете най-близкия точен квадрат. $101=100\cdot1{,}01$, тоест малкият параметър е $x=0{,}01$, а не $101$.`} />
            }
          >
            <SolutionPart label="a" title="Изнасяме близката кръгла стойност">
              <Formula latex={String.raw`\sqrt{101}=\sqrt{100\cdot1{,}01}=10\sqrt{1+x},\qquad x=0{,}01`} />
              <p>
                Това е цялата хитрост. Без изнасянето няма малък параметър и разгъване няма
                откъде да започне.
              </p>
            </SolutionPart>
            <SolutionPart label="b" title="Биномният ред при половинен показател">
              <Formula
                latex={String.raw`(1+x)^{1/2}=1+\frac{x}{2}-\frac{x^2}{8}+\frac{x^3}{16}-\cdots`}
              />
              <p>
                Коефициентите идват от общата формула:{" "}
                <RichText text={String.raw`$\frac{\alpha(\alpha-1)}{2}=\frac{\frac12\left(-\frac12\right)}{2}=-\frac18$`} />
                .
              </p>
            </SolutionPart>
            <SolutionPart label="c" title="Два члена">
              <Formula latex={String.raw`\sqrt{101}\approx10\left(1+\frac{0{,}01}{2}\right)=10\cdot1{,}005=10{,}05`} />
              <p>
                Отклонението е <RichText text={String.raw`$+0{,}000124$`} />, тоест{" "}
                <RichText text={String.raw`$+0{,}0012\,\%$`} />. Това е и предсказаното от
                първия изхвърлен член:{" "}
                <RichText text={String.raw`$10\cdot\frac{x^2}{8}=1{,}25\cdot10^{-4}$`} />.
              </p>
            </SolutionPart>
            <SolutionPart label="d" title="Три члена">
              <Formula
                latex={String.raw`\sqrt{101}\approx10\left(1+0{,}005-\frac{0{,}0001}{8}\right)
                =10\cdot1{,}0049875=10{,}049875`}
              />
              <ResultBox>
                <RichText text={String.raw`$\sqrt{101}\approx10{,}049875$ при точна стойност $10{,}049875621$: относителна грешка $6{,}2\cdot10^{-6}\,\%$, тоест **седем верни значещи цифри** срещу едно събиране и едно умножение.`} />
              </ResultBox>
            </SolutionPart>
          </ProgressiveSolution>

          <ProblemTitle n={18} title={String.raw`Пресметнете $\sqrt[3]{126}$`} />
          <ProblemStatement>
            <p>
              Намерете <RichText text={String.raw`$\sqrt[3]{126}$`} /> с два и с три члена и
              сравнете с точната стойност{" "}
              <RichText text={String.raw`$5{,}013297935$`} />.
            </p>
          </ProblemStatement>
          <ProgressiveSolution
            hint={
              <RichText text={String.raw`Най-близкият точен куб е $125=5^3$. Показателят вече е $\alpha=\tfrac13$, затова коефициентът пред $x^2$ не е $-\tfrac18$.`} />
            }
          >
            <SolutionPart label="a" title="Изнасяме куба">
              <Formula latex={String.raw`\sqrt[3]{126}=\sqrt[3]{125\cdot1{,}008}=5\,(1+x)^{1/3},\qquad x=0{,}008`} />
            </SolutionPart>
            <SolutionPart label="b" title="Коефициентите при третичен показател">
              <Formula
                latex={String.raw`\frac{\alpha(\alpha-1)}{2}=\frac{\frac13\left(-\frac23\right)}{2}=-\frac19
                \ \Longrightarrow\ (1+x)^{1/3}=1+\frac{x}{3}-\frac{x^2}{9}+\cdots`}
              />
              <p>
                Тук е разликата със задача 17: смяната на показателя мени всички коефициенти,
                затова редът не бива да се запомня наизуст за един конкретен корен.
              </p>
            </SolutionPart>
            <SolutionPart label="c" title="Двата отговора">
              <Formula
                latex={String.raw`5\left(1+\frac{0{,}008}{3}\right)=5{,}013333,\qquad
                5\left(1+0{,}0026667-\frac{0{,}000064}{9}\right)=5{,}0132978`}
              />
              <ResultBox>
                <RichText text={String.raw`Два члена дават $+0{,}00071\,\%$, три члена дават $-3{,}1\cdot10^{-6}\,\%$. Всеки нов член сваля грешката с още един порядък по $x$.`} />
              </ResultBox>
            </SolutionPart>
          </ProgressiveSolution>

          <div className="mt-6">
            <BinomialAccuracyFigure />
          </div>

          <ProblemTitle n={19} title={String.raw`$\sin1^\circ$ и $\tan1^\circ$`} />
          <ProblemStatement>
            <ol className="list-[lower-alpha] space-y-1.5 pl-6">
              <li>
                Пресметнете <RichText text={String.raw`$\sin1^\circ$`} /> и{" "}
                <RichText text={String.raw`$\tan1^\circ$`} /> с приближенията{" "}
                <RichText text={String.raw`$\sin\theta\approx\theta$`} /> и{" "}
                <RichText text={String.raw`$\tan\theta\approx\theta$`} />.
              </li>
              <li>Добавете кубичния член и на двете.</li>
              <li>
                Обяснете защо двете грешки са с различен знак и защо едната е двойно
                по-голяма.
              </li>
            </ol>
          </ProblemStatement>
          <ProgressiveSolution
            hint={
              <RichText text={String.raw`Редовете важат само за ъгъл в **радиани**. Първата стъпка е $1^\circ=\pi/180$, а не $1$.`} />
            }
          >
            <SolutionPart label="a" title="Преминаваме в радиани">
              <Formula latex={String.raw`\theta=1^\circ=\frac{\pi}{180}=0{,}0174532925\ \mathrm{rad}`} />
            </SolutionPart>
            <SolutionPart label="b" title="Само водещият член">
              <p>
                И двете приближения дават едно и също число{" "}
                <RichText text={String.raw`$0{,}01745329$`} />, но точните стойности са{" "}
                <RichText text={String.raw`$\sin1^\circ=0{,}01745241$`} /> и{" "}
                <RichText text={String.raw`$\tan1^\circ=0{,}01745506$`} />.
              </p>
              <Formula
                latex={String.raw`\delta_{\sin}=+0{,}0051\,\%,\qquad \delta_{\tan}=-0{,}0102\,\%`}
              />
            </SolutionPart>
            <SolutionPart label="c" title="С кубичния член">
              <Formula
                latex={String.raw`\sin\theta\approx\theta-\frac{\theta^3}{6}=0{,}0174524064,\qquad
                \tan\theta\approx\theta+\frac{\theta^3}{3}=0{,}0174550647`}
              />
              <p>
                Първото съвпада с точната стойност до единадесетия знак, второто до
                деветия.
              </p>
            </SolutionPart>
            <SolutionPart label="d" title="Защо знаците са различни">
              <Formula
                latex={String.raw`\frac{\theta}{\sin\theta}-1\approx+\frac{\theta^2}{6},\qquad
                \frac{\theta}{\tan\theta}-1\approx-\frac{\theta^2}{3}`}
              />
              <ResultBox>
                <RichText text={String.raw`Кубичните членове са $-\theta^3/6$ и $+\theta^3/3$: противоположни по знак и вторият е двойно по-голям. Затова $\sin\theta<\theta<\tan\theta$, а приближението $\tan\theta\approx\theta$ греши двойно повече от $\sin\theta\approx\theta$ при един и същ ъгъл.`} />
              </ResultBox>
            </SolutionPart>
          </ProgressiveSolution>

          <ProblemTitle n={20} title={String.raw`Пресметнете $e^{0{,}1}$`} />
          <ProblemStatement>
            <p>
              Намерете <RichText text={String.raw`$e^{0{,}1}$`} /> с три и с четири члена от
              реда. Точната стойност е <RichText text={String.raw`$1{,}105170918$`} />.
            </p>
          </ProblemStatement>
          <ProgressiveSolution
            hint={
              <RichText text={String.raw`Редът за $e^x$ няма редуване на знаците, затова всички изхвърлени членове са положителни и приближението е винаги **отдолу**.`} />
            }
          >
            <SolutionPart label="a" title="Три члена">
              <Formula
                latex={String.raw`e^{x}\approx1+x+\frac{x^2}{2}=1+0{,}1+0{,}005=1{,}105`}
              />
              <p>
                Отклонението е <RichText text={String.raw`$-0{,}0155\,\%$`} />, и то е
                отрицателно, както се предвижда.
              </p>
            </SolutionPart>
            <SolutionPart label="b" title="Четири члена">
              <Formula
                latex={String.raw`e^{x}\approx1+x+\frac{x^2}{2}+\frac{x^3}{6}=1{,}105+0{,}000166\overline{6}=1{,}1051667`}
              />
              <ResultBox>
                <RichText text={String.raw`$e^{0{,}1}\approx1{,}1051667$ срещу точно $1{,}1051709$: грешка $-0{,}00038\,\%$. Първият изхвърлен член е $x^4/24=4{,}2\cdot10^{-6}$, което почти точно съвпада с действителното отклонение $4{,}25\cdot10^{-6}$.`} />
              </ResultBox>
            </SolutionPart>
          </ProgressiveSolution>

          <ProblemTitle n={21} title={String.raw`Пресметнете $\ln1{,}02$`} />
          <ProblemStatement>
            <p>
              Намерете <RichText text={String.raw`$\ln1{,}02$`} /> с един, два и три члена.
              Точната стойност е <RichText text={String.raw`$0{,}019802627$`} />.
            </p>
            <p>
              След това пресметнете капацитета на единица дължина за коаксиален кабел с{" "}
              <RichText text={String.raw`$b/a=1{,}02$`} />, като използвате{" "}
              <RichText text={String.raw`$C/L=\dfrac{2\pi\varepsilon_0}{\ln(b/a)}$`} />.
            </p>
          </ProblemStatement>
          <ProgressiveSolution
            hint={
              <RichText text={String.raw`Тук $x=0{,}02$, а не $1{,}02$. Приближението $\ln(1+x)\approx x$ греши с около $1\,\%$ вече при $x=0{,}02$: логаритъмът е по-капризен от корена.`} />
            }
          >
            <SolutionPart label="a" title="Трите приближения">
              <Formula
                latex={String.raw`x=0{,}02,\qquad x=0{,}02,\qquad x-\frac{x^2}{2}=0{,}0198,\qquad
                x-\frac{x^2}{2}+\frac{x^3}{3}=0{,}01980267`}
              />
              <Formula
                latex={String.raw`\delta_1=+1{,}00\,\%,\qquad \delta_2=-0{,}013\,\%,\qquad \delta_3=+0{,}0002\,\%`}
              />
              <p>
                Обърнете внимание на редуването на знаците: това е характерно за ред с
                редуващи се членове и означава, че истинската стойност винаги стои{" "}
                <strong>между</strong> две последователни частични суми.
              </p>
            </SolutionPart>
            <SolutionPart label="b" title="Капацитетът на кабела">
              <Formula
                latex={String.raw`\frac{C}{L}=\frac{2\pi\varepsilon_0}{\ln(b/a)}\approx\frac{2\pi\cdot8{,}85\cdot10^{-12}}{0{,}0198}
                =2{,}81\cdot10^{-9}\ \mathrm{F/m}`}
              />
              <ResultBox>
                <RichText text={String.raw`Около $2{,}8\,\mathrm{nF}$ на метър, тоест $55$ пъти повече от $50{,}6\,\mathrm{pF/m}$, колкото дава същата формула при $b/a=3$. Малкият логаритъм в знаменателя е причината: щом стените се доближат, коаксиалният кабел се държи като плосък кондензатор с много тънък процеп.`} />
              </ResultBox>
            </SolutionPart>
          </ProgressiveSolution>

          <ProblemTitle n={22} title={String.raw`Колко греши $\frac12mv^2$ при $v=0{,}10c$`} />
          <ProblemStatement>
            <p>Точната кинетична енергия е</p>
            <Formula
              latex={String.raw`K=mc^2\left(\frac1{\sqrt{1-\beta^2}}-1\right),\qquad \beta=\frac{v}{c}`}
            />
            <ol className="list-[lower-alpha] space-y-1.5 pl-6">
              <li>
                Разгънете по <RichText text={String.raw`$\beta^2$`} /> до втори ненулев член.
              </li>
              <li>
                Пресметнете и трите стойности при <RichText text={String.raw`$\beta=0{,}10$`} />{" "}
                в единици <RichText text={String.raw`$mc^2$`} />.
              </li>
              <li>С колко процента класическата формула греши?</li>
            </ol>
          </ProblemStatement>
          <ProgressiveSolution
            hint={
              <RichText text={String.raw`Малкият параметър е $u=\beta^2=0{,}01$, а показателят е $-\tfrac12$. Не разгъвайте по $\beta$: редът съдържа само четни степени.`} />
            }
          >
            <SolutionPart label="a" title="Разгъваме">
              <Formula
                latex={String.raw`(1-u)^{-1/2}=1+\frac{u}{2}+\frac38u^2+O(u^3)
                \ \Longrightarrow\ \frac{K}{mc^2}=\frac{\beta^2}{2}+\frac38\beta^4+\cdots`}
              />
              <p>
                Първият член е класическият:{" "}
                <RichText text={String.raw`$\tfrac12\beta^2mc^2=\tfrac12mv^2$`} />. Тоест
                класическата механика не е отделна теория, а водещият член на релативистката.
              </p>
            </SolutionPart>
            <SolutionPart label="b" title="Числата при 0,10c">
              <Formula
                latex={String.raw`\frac{K_{\text{точно}}}{mc^2}=0{,}00503782,\qquad
                \frac{K_{\text{клас}}}{mc^2}=0{,}00500000,\qquad
                \frac{K_{\text{с поправка}}}{mc^2}=0{,}00503750`}
              />
            </SolutionPart>
            <SolutionPart label="c" title="Големината на грешката">
              <ResultBox>
                <RichText text={String.raw`Класическата формула подценява с $0{,}75\,\%$ при $v=0{,}10c$. Единствената поправка $\tfrac38\beta^4$ сваля грешката до $0{,}0063\,\%$, тоест сто и двадесет пъти.`} />
              </ResultBox>
              <p>
                Проверка на порядъка без сметки: отношението на втория към първия член е{" "}
                <RichText text={String.raw`$\frac{3\beta^4/8}{\beta^2/2}=\frac34\beta^2=0{,}0075$`} />
                , тоест точно тези <RichText text={String.raw`$0{,}75\,\%$`} />.
              </p>
            </SolutionPart>
          </ProgressiveSolution>

          <ProblemTitle n={23} title={String.raw`Период на махало при амплитуда $20^\circ$`} />
          <ProblemStatement>
            <p>Точният период на математично махало се разлага в реда</p>
            <Formula
              latex={String.raw`T=T_0\left(1+\frac{\theta_0^2}{16}+\frac{11\,\theta_0^4}{3072}+\cdots\right),
              \qquad T_0=2\pi\sqrt{\frac{L}{g}}`}
            />
            <ol className="list-[lower-alpha] space-y-1.5 pl-6">
              <li>
                Пресметнете поправката при <RichText text={String.raw`$\theta_0=20^\circ$`} />{" "}
                с един и с два коригиращи члена.
              </li>
              <li>
                Сравнете с точната стойност{" "}
                <RichText text={String.raw`$T/T_0=1{,}0076690$`} />.
              </li>
            </ol>
          </ProblemStatement>
          <ProgressiveSolution
            hint={
              <RichText text={String.raw`Пак: ъгълът влиза в радиани. $20^\circ$ е $0{,}349$ rad, а $0{,}349^2\approx0{,}122$, тоест поправката е под процент.`} />
            }
          >
            <SolutionPart label="a" title="Първата поправка">
              <Formula
                latex={String.raw`\theta_0=\frac{20\pi}{180}=0{,}3490659\ \mathrm{rad},\qquad
                \frac{\theta_0^2}{16}=\frac{0{,}1218469}{16}=0{,}0076154`}
              />
              <p>
                Тоест <RichText text={String.raw`$T/T_0\approx1{,}0076154$`} />, или{" "}
                <RichText text={String.raw`$+0{,}762\,\%$`} />.
              </p>
            </SolutionPart>
            <SolutionPart label="b" title="Втората поправка">
              <Formula
                latex={String.raw`\frac{11\,\theta_0^4}{3072}=\frac{11\cdot0{,}0148457}{3072}=5{,}32\cdot10^{-5}
                \ \Longrightarrow\ \frac{T}{T_0}\approx1{,}0076686`}
              />
              <ResultBox>
                <RichText text={String.raw`Срещу точното $1{,}0076690$ това е грешка $4\cdot10^{-5}\,\%$. Практическият извод: при $20^\circ$ „малките трептения“ грешат под един процент, но при $60^\circ$ същият ред дава вече около $7\,\%$ и приближението не бива да се използва наивно.`} />
              </ResultBox>
            </SolutionPart>
          </ProgressiveSolution>

          <ProblemTitle n={24} title="Пренос на малки грешки при измерване" />
          <ProblemStatement>
            <p>
              В лабораторно упражнение се измерват <RichText text="$L$" /> и{" "}
              <RichText text="$T$" /> за махало.
            </p>
            <ol className="list-[lower-alpha] space-y-1.5 pl-6">
              <li>
                Дължината е отчетена с <RichText text={String.raw`$+2\,\%$`} /> грешка. С
                колко процента ще сгреши <RichText text="$T$" />?
              </li>
              <li>
                Изведете общото правило за <RichText text="$y=x^n$" />.
              </li>
              <li>
                Ускорението се пресмята като{" "}
                <RichText text={String.raw`$g=\dfrac{4\pi^2L}{T^2}$`} />. Ако{" "}
                <RichText text="$L$" /> е с <RichText text={String.raw`$+2\,\%$`} />, а{" "}
                <RichText text="$T$" /> с <RichText text={String.raw`$-1\,\%$`} />, с колко
                греши <RichText text="$g$" />?
              </li>
            </ol>
          </ProblemStatement>
          <ProgressiveSolution
            hint={
              <RichText text={String.raw`Правилото за пренос на грешки не е отделна формула, а разгъване на Тейлър до първи ред около измерената стойност.`} />
            }
          >
            <SolutionPart label="a" title="Грешката в периода">
              <Formula
                latex={String.raw`T\propto L^{1/2}\ \Longrightarrow\
                \frac{T'}{T}=(1+0{,}02)^{1/2}\approx1+\frac{0{,}02}{2}=1{,}01`}
              />
              <p>
                Тоест <RichText text={String.raw`$+1{,}00\,\%$`} />. Точната стойност е{" "}
                <RichText text={String.raw`$\sqrt{1{,}02}-1=+0{,}995\,\%$`} />: разликата е в
                изхвърления член <RichText text={String.raw`$-\delta^2/8$`} />.
              </p>
            </SolutionPart>
            <SolutionPart label="b" title="Общото правило">
              <Formula
                latex={String.raw`y=x^n\ \Longrightarrow\ (1+\delta)^n\approx1+n\delta
                \ \Longrightarrow\ \boxed{\ \frac{\Delta y}{y}\approx n\,\frac{\Delta x}{x}\ }`}
              />
              <p>
                Показателят умножава относителната грешка. Затова величина, която влиза на
                квадрат, е двойно по-опасна от такава, която влиза линейно.
              </p>
            </SolutionPart>
            <SolutionPart label="c" title="Грешката в ускорението">
              <Formula
                latex={String.raw`\frac{\Delta g}{g}\approx\frac{\Delta L}{L}-2\frac{\Delta T}{T}
                =(+2\,\%)-2(-1\,\%)=+4\,\%`}
              />
              <ResultBox>
                <RichText text={String.raw`Точната стойност е $\frac{1{,}02}{0{,}99^2}-1=+4{,}07\,\%$. Двете грешки се **събират**, защото са с противоположни знаци, а $T$ влиза в знаменателя на квадрат. Ако искате $g$ с $1\,\%$, периодът трябва да е измерен по-добре от $0{,}5\,\%$.`} />
              </ResultBox>
            </SolutionPart>
          </ProgressiveSolution>

          <TeacherNote>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Пуснете задачи 17 и 18 без калкулатор и с ограничение във времето. Целта не е
                отговорът, а рефлексът „коя е близката кръгла стойност“.
              </li>
              <li>
                Задача 19 хваща най-упоритата грешка в целия раздел: разгъване по ъгъл в
                градуси. Ако някой получи <RichText text={String.raw`$\sin1^\circ\approx1$`} />
                , причината е точно тази.
              </li>
              <li>
                Задача 22 е добро място за въпроса „кога класическата механика става
                недостатъчна“. Отговорът зависи от исканата точност, не от някаква граница на
                скоростта.
              </li>
              <li>
                Задача 24 свързва раздела с лабораторните упражнения. Полезно продължение: с
                колко процента трябва да е точна дължината, за да се получи{" "}
                <RichText text="$g$" /> с <RichText text={String.raw`$0{,}5\,\%$`} />?
              </li>
            </ul>
          </TeacherNote>
        </Section>

        {/* ==================================================== §5 водени задачи */}

        <Section id="guided" n="§5" title="Шест физични задачи с водено решение">
          <p className="mb-6 text-ink/90">
            Задачите са от различни области, но алгоритъмът е един: безразмерен параметър,
            подходящ стандартен ред, контрол на пропуснатия член и физическа проверка на
            знака. Тук решението не се отключва с бутон, а с верен отговор на концептуален
            въпрос. Грешният избор дава обяснение и позволява нов опит.
          </p>
          <TaylorProblemSet />
        </Section>

        {/* ======================================================== §5 обобщение */}

        <Section id="recap" n="§6" title="Какво трябва да остане след задачите">
          <div className="rounded-[10px] border-[1.5px] border-ink bg-ink px-5 py-5 text-white shadow-hard">
            <p className="text-[11px] font-bold uppercase tracking-[.18em] text-hl">Обобщение</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px]">
              <li>
                Разгъва се по безразмерен малък параметър. Ако параметърът има мерна единица,
                нещо в постановката е сгрешено.
              </li>
              <li>
                Граница от вида <RichText text="$0/0$" /> се чете от реда: съкращава се общата
                водеща степен и остава отношението на коефициентите пред нея.
              </li>
              <li>
                Изваждането на известните членове вдига реда на числителя. Задачи 5, 8 и 9 са
                една и съща задача на три различни височини.
              </li>
              <li>
                Симетрията предсказва кои степени липсват, преди да се смята: няма пълен
                заряд, няма <RichText text="$1/x$" />; няма диполен момент, няма{" "}
                <RichText text={String.raw`$1/x^2$`} />.
              </li>
              <li>
                Полето е производна на потенциала, затова спада с една степен по-бързо от него.
              </li>
              <li>
                Първият пропуснат член дава естествена оценка за грешката, а знакът му трябва
                да има физически смисъл.
              </li>
              <li>
                При пресмятане редът е инструмент, не илюстрация: изнася се близка кръгла
                стойност, остатъкът се пише като <RichText text="$1+x$" /> и всеки нов член
                сваля грешката с още една степен на <RichText text="$x$" />.
              </li>
              <li>
                Правилото за пренос на грешки{" "}
                <RichText text={String.raw`$\frac{\Delta y}{y}\approx n\frac{\Delta x}{x}$`} />{" "}
                е същото разгъване, спряно на първия член.
              </li>
            </ul>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ["1. Параметър", "Кое отношение е малко и безразмерно?"],
              ["2. Порядък", "До коя степен изисква точността?"],
              ["3. Проверка", "Правилни ли са знакът, симетрията и единиците?"],
            ].map(([title, text]) => (
              <div key={title} className="rounded-[10px] border-[1.5px] border-rule bg-surface p-4">
                <p className="text-[12px] font-bold uppercase tracking-wide text-minus">{title}</p>
                <p className="mt-1 text-[14px] text-muted">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-4 text-[14.5px] font-semibold">
            <Link href="/zadachi" className="text-minus hover:underline">
              ← Всички серии задачи
            </Link>
            <Link href="/physics/elektrichestvo/potencial" className="text-minus hover:underline">
              Урокът за потенциала →
            </Link>
          </div>
        </Section>
      </main>
    </TeacherModeProvider>
  );
}
