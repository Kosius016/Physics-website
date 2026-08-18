import type { Metadata } from "next";
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
import TaylorProblemSet from "@/components/materiali/TaylorProblemSet";
import TaylorSeriesLab from "@/components/materiali/TaylorSeriesLab";

export const metadata: Metadata = {
  title: "Редове на Тейлър: физични задачи с решения · STEM Платформа",
  description:
    "Шест водени задачи за редове на Тейлър в механиката, гравитацията, относителността, оптиката, термодинамиката и електростатиката.",
};

const NAV = [
  { id: "laboratory", n: "§1", label: "Лаборатория" },
  { id: "problems", n: "§2", label: "Водени задачи" },
  { id: "recap", n: "§3", label: "Обобщение" },
] as const;

const BLEED = "xl:-mr-[11rem] 2xl:-mr-[19rem]";

export default function TaylorSeriesMaterialPage() {
  return (
    <TeacherModeProvider>
      <main className="mx-auto max-w-3xl px-5 pb-24">
        <header className="pb-2 pt-11">
          <Link href="/materiali" className="text-[13px] font-semibold text-minus hover:underline">
            Материали / Математични методи
          </Link>
          <p className="mt-6 text-[11px] font-bold uppercase tracking-[.22em] text-minus">
            Практикум с отключващи се решения
          </p>
          <h1 className="mt-2 font-serif text-[clamp(38px,7vw,58px)] font-bold leading-[1.04] text-ink">
            Редове на Тейлър във физиката
          </h1>
          <p className="mt-4 max-w-2xl text-[17px] text-muted">
            Една идея свързва махалото, гравитацията, дифракцията и относителността:
            намерете малкия безразмерен параметър и оставете само членовете, които физиката
            може да различи.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-wide">
            <span className="rounded-full border-[1.5px] border-ink bg-surface px-3 py-1.5">6 задачи</span>
            <span className="rounded-full border-[1.5px] border-ink bg-surface px-3 py-1.5">24 въпроса</span>
            <span className="rounded-full border-[1.5px] border-plus bg-plus/10 px-3 py-1.5 text-plus">
              Всяка стъпка е заключена
            </span>
          </div>
          <div className="mt-6 rounded-[10px] border-[1.5px] border-rule bg-hl px-4 py-3 text-[14.5px] leading-relaxed">
            <strong>Как работи практикумът:</strong> условието и точната графика са видими веднага.
            За да се появи следващата стъпка от решението, първо трябва да отговорите вярно на
            концептуален въпрос. Грешният избор дава обяснение и позволява нов опит.
          </div>
        </header>

        <LessonNav items={NAV} right={<TeacherModeToggle />} />

        <Section id="laboratory" n="§1" title="Колко члена са достатъчни?">
          <p className="text-ink/90">
            Представете си точна крива, която познавате само близо до една удобна точка.
            Допирателната улавя първото движение. Следващата степен улавя огъването. Всеки нов
            член разширява областта, в която локалната картина прилича на точната.
          </p>

          <div className="mt-5">
            <PredictionQuestion
              prompt="Кое е най-важното първо действие преди да разгънем физична формула?"
              options={[
                {
                  text: "Да намерим малък безразмерен параметър",
                  correct: true,
                  why: String.raw`Само степените на безразмерно малко число могат смислено да се сравняват и подреждат по големина.`,
                },
                {
                  text: "Да заместим всички числени стойности",
                  correct: false,
                  why: "Ранното заместване скрива мащабите и не показва кой член е малък спрямо останалите.",
                },
                {
                  text: "Винаги да запазим точно три члена",
                  correct: false,
                  why: "Броят членове зависи от малкия параметър и търсената точност, не от фиксирано правило.",
                },
              ]}
              explanation={String.raw`Типичните параметри са отношения като $h/R$, $v/c$, $z/R$ или самият малък ъгъл в радиани.`}
            />
          </div>

          <div className={`mt-7 ${BLEED}`}>
            <TaylorSeriesLab />
          </div>

          <div className="mt-8 space-y-4">
            <h3 className="font-serif text-[22px] font-bold text-ink">Трите реда, които ще използваме</h3>
            <p className="text-[15.5px] text-ink/90">
              След наблюдението на графиката можем да запишем математиката. Остатъкът <RichText text="$O(x^n)$" /> означава, че първият пропуснат принос е от порядък <RichText text="$x^n$" /> около точката на разгъване.
            </p>
            <Formula
              latex={String.raw`\sin x=x-\frac{x^3}{3!}+\frac{x^5}{5!}+O(x^7)`}
            />
            <Formula
              latex={String.raw`(1+x)^\alpha=1+\alpha x+\frac{\alpha(\alpha-1)}{2}x^2
              +\frac{\alpha(\alpha-1)(\alpha-2)}{6}x^3+O(x^4)`}
            />
            <Formula
              latex={String.raw`\frac1{1+x}=1-x+x^2-x^3+O(x^4),\qquad |x|<1`}
            />
          </div>

          <TeacherNote>
            <p>
              Преди формулите поискайте от учениците да опишат с думи какво се променя, когато
              точката се отдалечава от нулата. Диагностичният въпрос е: „Малко спрямо какво?“
            </p>
          </TeacherNote>
        </Section>

        <Section id="problems" n="§2" title="Шест физични задачи с водено решение">
          <p className="mb-6 text-ink/90">
            Задачите са от различни области, но алгоритъмът е един: безразмерен параметър,
            подходящ стандартен ред, контрол на пропуснатия член и физическа проверка на знака.
            Не са използвани символи за „лютивина“: трудността е изписана с думи.
          </p>
          <div className={BLEED}>
            <TaylorProblemSet />
          </div>
        </Section>

        <Section id="recap" n="§3" title="Какво трябва да остане след задачите">
          <div className="rounded-[10px] border-[1.5px] border-ink bg-ink px-5 py-5 text-white shadow-hard">
            <p className="text-[11px] font-bold uppercase tracking-[.18em] text-hl">Обобщение</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px]">
              <li>Разгъва се по безразмерен малък параметър, не по произволна размерна величина.</li>
              <li>Симетрията предсказва кои степени трябва да липсват още преди смятането.</li>
              <li>Първият пропуснат член дава естествена оценка за грешката.</li>
              <li>Знакът на поправката трябва да има физически смисъл и да съвпада с графиката.</li>
              <li>Повече членове не означава автоматично по-добър модел далеч от точката на разгъване.</li>
              <li>Един и същ биномен ред описва гравитация, адиабатна компресия и електростатичен потенциал.</li>
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
            <Link href="/materiali" className="text-minus hover:underline">
              ← Всички материали
            </Link>
            <Link href="/physics" className="text-minus hover:underline">
              Към уроците по физика →
            </Link>
          </div>
        </Section>
      </main>
    </TeacherModeProvider>
  );
}
