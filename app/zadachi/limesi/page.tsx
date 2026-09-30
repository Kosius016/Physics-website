import Link from "next/link";
import Formula from "@/components/Formula";
import LessonNav from "@/components/LessonNav";
import RichText from "@/components/RichText";
import Section from "@/components/Section";
import ProgressiveSolution from "@/components/materiali/ProgressiveSolution";
import { ProblemStatement, SolutionPart } from "@/components/problem-sets/SolutionParts";
import { TeacherModeProvider, TeacherModeToggle, TeacherNote } from "@/components/interactives/TeacherMode";
import { limitProblemGroups, limitProblems } from "@/lib/problemSets/limits";

export const metadata = {
  title: "Лимеси: 30 задачи от основи до олимпиадни идеи · SingularityLab",
  description: "Сборник с 30 задачи за граници в шест нива: указания, решения стъпка по стъпка, физически приложения, контрол на грешката и трудни доказателства.",
};
const NAV = [...limitProblemGroups.map((group,i)=>({id:group.id,n:"§"+(i+1),label:group.level})),{id:"recap",n:"§7",label:"Обобщение"}];
const LETTERS = ["а","б","в","г"];

export default function LimitsProblemsPage() {
  return <TeacherModeProvider><main className="mx-auto max-w-3xl px-5 pb-24">
    <header className="pb-2 pt-11">
      <Link href="/materiali?subject=math&level=university&type=zadachi" className="text-sm font-semibold text-minus hover:underline">Материали / Математика / Задачи</Link>
      <p className="mt-7 text-xs font-bold uppercase tracking-[.2em] text-minus">Практика по математически анализ</p>
      <h1 className="mt-3 font-serif text-[clamp(36px,7vw,56px)] font-bold leading-[1.08]">Лимеси: от първа стъпка до доказателство</h1>
      <p className="mt-5 text-lg leading-relaxed text-muted">Тридесет задачи, подредени в шест нива. Първо опитайте сами, после отворете указанието. Решението се разкрива постепенно, за да можете да продължите от мястото, на което сте спрели.</p>
      <div className="my-6 rounded-xl border-[1.5px] border-ink bg-hl p-5">
        <p className="leading-relaxed">Първи маршрут: задачи 1–10. След урока: 11–24. За задълбочаване: 25–30. Трудността е ориентир; някои кратки решения изискват нетривиална идея.</p>
        <Link href="/math/analiz/limesi" className="mt-3 inline-block font-semibold text-minus hover:underline">Към урока и интерактивните графики →</Link>
      </div>
      <p className="text-sm leading-relaxed text-muted">Всички тригонометрични аргументи са в радиани. Решенията използват само инструментите от урока и посочените в указанията тъждества. Не са необходими производни, Лопитал или редове на Тейлър.</p>
    </header>
    <LessonNav items={NAV} right={<TeacherModeToggle/>}/>
    <TeacherNote>За диагностика използвайте 3, 4 и 5 преди алгебричните сметки. За домашна работа изберете задачи от различни групи, вместо всички наведнъж. Задачи 27 и 29 образуват свързана двойка: съществуване на граница, после скорост на сходимост.</TeacherNote>
    {limitProblemGroups.map((group,index)=><Section key={group.id} id={group.id} n={"§"+(index+1)} title={group.title}>
      <p className="mb-7 text-muted">{group.intro}</p>
      <div className="space-y-12">{limitProblems.filter(p=>p.id>=group.range[0]&&p.id<=group.range[1]).map(problem=><article id={"zadacha-"+problem.id} key={problem.id} className="scroll-mt-24">
        <h3 className="mb-4 font-serif text-[23px] font-bold leading-snug"><span className="mb-1 block font-sans text-xs font-bold uppercase tracking-widest text-minus">Задача {problem.id} · {group.level}</span>{problem.title}</h3>
        <ProblemStatement><p><RichText text={problem.statement}/></p>{problem.formula ? <Formula latex={problem.formula}/> : null}</ProblemStatement>
        <ProgressiveSolution hint={<RichText text={problem.hint}/>}>
          {problem.steps.map((step,i)=><SolutionPart key={step.title} label={LETTERS[i]} title={step.title}><p><RichText text={step.text}/></p>{step.latex ? <Formula latex={step.latex}/> : null}</SolutionPart>)}
        </ProgressiveSolution>
      </article>)}</div>
    </Section>)}
    <Section id="recap" n="§7" title="Какво проверихте с тези задачи?">
      <p className="leading-relaxed">Можете да различавате стойност от граница, да избирате преобразуване, да доказвате липса на лимес и да превръщате допуск за грешка в конкретно изискване. Това са инструментите, с които следващите теми за производни и интеграли придобиват смисъл.</p>
      <div className="mt-5 flex flex-wrap gap-5 font-semibold text-minus"><Link href="/math/analiz/limesi" className="hover:underline">Обратно към урока →</Link><Link href="/materiali?subject=math&level=university&type=zadachi" className="hover:underline">Още материали по математика →</Link></div>
    </Section>
  </main></TeacherModeProvider>;
}
