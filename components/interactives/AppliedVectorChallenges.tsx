import Formula from "@/components/Formula";
import RichText from "@/components/RichText";
import ProgressiveSolution from "@/components/materiali/ProgressiveSolution";
import { TeacherNote } from "./TeacherMode";

interface ChallengeStep {
  lead: string;
  text?: string;
  latex?: string;
}

interface Challenge {
  title: string;
  statement: string;
  prediction: string;
  hint: string;
  steps: ChallengeStep[];
  teacherNote: string;
}

const CHALLENGES: Challenge[] = [
  {
    title: "Спасителна лодка в речно течение",
    statement: String.raw`Река е широка $180\,\mathrm{m}$ и тече на изток със скорост $2{,}4\,\mathrm{m/s}$. Лодка се движи спрямо водата с $4{,}0\,\mathrm{m/s}$. Под какъв ъгъл западно от север трябва да бъде насочена, за да достигне точката точно срещу старта? Колко време трае пресичането?`,
    prediction: "Равнодействащата скорост трябва да сочи точно на север. Следователно лодката трябва предварително да създаде западна компонента, която отменя течението.",
    hint: String.raw`Започнете от условието за липса на хоризонтално отклонение: $v_x=0$. Едва после използвайте известната големина на скоростта на лодката.`,
    steps: [
      { lead: "Избираме осите.", text: "Положителната хоризонтална посока е на изток, а положителната вертикална е на север. Течението има само хоризонтална компонента.", latex: String.raw`\vec v_{\text{теч}}=(2{,}4\hat i+0\hat j)\,\mathrm{m/s}` },
      { lead: "По $x$:", text: "За да няма отнасяне по реката, хоризонталната компонента на резултата трябва да е нула.", latex: String.raw`v_x=v_{\text{лод},x}+v_{\text{теч},x}=0\quad\Rightarrow\quad v_{\text{лод},x}=-2{,}4\,\mathrm{m/s}` },
      { lead: "Разлагаме скоростта на лодката.", text: "Големината ѝ е известна, затова намираме северната компонента с Питагоровата теорема.", latex: String.raw`v_{\text{лод},y}=\sqrt{4{,}0^2-2{,}4^2}=3{,}2\,\mathrm{m/s},\qquad \beta=\arctan\frac{2{,}4}{3{,}2}=36{,}9^\circ` },
      { lead: "По $y$:", text: "Течението не помага и не пречи на пресичането напряко.", latex: String.raw`v_y=v_{\text{лод},y}+v_{\text{теч},y}=3{,}2+0=3{,}2\,\mathrm{m/s}` },
      { lead: "Намираме времето.", latex: String.raw`t=\frac{180\,\mathrm{m}}{3{,}2\,\mathrm{m/s}}=56{,}25\,\mathrm{s}` },
    ],
    teacherNote: "Диагностичен въпрос: защо времето не се пресмята със скоростта спрямо водата? Честа грешка е ученикът да компенсира течението, но после да използва отново цялата големина на скоростта за пресичането.",
  },
  {
    title: "Доставка с дрон при насрещен вятър",
    statement: String.raw`Дрон трябва да достигне площадка на $1{,}20\,\mathrm{km}$ изток и $0{,}80\,\mathrm{km}$ север за точно $100\,\mathrm{s}$. Вятърът е $5{,}0\,\mathrm{m/s}$ в посока $210^\circ$, измерена обратно на часовниковата стрелка от изток. Каква скорост спрямо въздуха трябва да зададе автопилотът?`,
    prediction: "Вятърът духа към югозапад. Командата на дрона трябва да сочи по-силно към североизток от желаната скорост спрямо земята.",
    hint: String.raw`Първо намерете необходимата скорост спрямо земята от $\Delta\vec r/t$. После използвайте $\vec v_{\text{въздух}}=\vec v_{\text{земя}}-\vec v_{\text{вятър}}$.`,
    steps: [
      { lead: "Намираме целевата скорост спрямо земята.", latex: String.raw`\vec v_{\text{земя}}=\frac{(1200\hat i+800\hat j)\,\mathrm{m}}{100\,\mathrm{s}}=(12\hat i+8\hat j)\,\mathrm{m/s}` },
      { lead: "Разлагаме вятъра.", text: "Ъгълът е в трети квадрант, затова и двете компоненти са отрицателни.", latex: String.raw`\vec v_{\text{вятър}}=5(\cos210^\circ\,\hat i+\sin210^\circ\,\hat j)=(-4{,}33\hat i-2{,}50\hat j)\,\mathrm{m/s}` },
      { lead: "По $x$:", latex: String.raw`v_{\text{въздух},x}=v_{\text{земя},x}-v_{\text{вятър},x}=12-(-4{,}33)=16{,}33\,\mathrm{m/s}` },
      { lead: "По $y$:", latex: String.raw`v_{\text{въздух},y}=v_{\text{земя},y}-v_{\text{вятър},y}=8-(-2{,}50)=10{,}50\,\mathrm{m/s}` },
      { lead: "Възстановяваме големината и курса.", latex: String.raw`\vec v_{\text{въздух}}=(16{,}33\hat i+10{,}50\hat j)\,\mathrm{m/s},\quad v_{\text{въздух}}=19{,}41\,\mathrm{m/s},\quad \alpha=32{,}7^\circ` },
    ],
    teacherNote: "Попитайте защо вятърът се изважда, въпреки че физически скоростите се събират. Ученикът трябва да обясни, че неизвестното събираемо се намира чрез прехвърляне на известното.",
  },
  {
    title: "Окачване на светофар",
    statement: String.raw`Светофар с тегло $240\,\mathrm{N}$ виси неподвижно на два кабела. Левият кабел сключва $35^\circ$ с хоризонталата, а десният $50^\circ$. Намерете силите на опън $T_1$ и $T_2$. Масата на кабелите се пренебрегва.`,
    prediction: "Хоризонталните компоненти на двата опъна трябва да се компенсират, а вертикалните им компоненти заедно трябва да уравновесят теглото.",
    hint: String.raw`Не приемайте, че опъните са равни. Ъглите са различни, затова равни хоризонтални проекции изискват различни големини.`,
    steps: [
      { lead: "Избираме осите и знаците.", text: "Надясно и нагоре са положителни. Левият опън има отрицателна хоризонтална компонента, десният положителна, а теглото сочи надолу." },
      { lead: "По $x$:", latex: String.raw`-T_1\cos35^\circ+T_2\cos50^\circ=0\quad\Rightarrow\quad T_2=T_1\frac{\cos35^\circ}{\cos50^\circ}` },
      { lead: "По $y$:", latex: String.raw`T_1\sin35^\circ+T_2\sin50^\circ-240\,\mathrm{N}=0` },
      { lead: "Решаваме системата.", latex: String.raw`T_1\left(\sin35^\circ+\frac{\cos35^\circ\sin50^\circ}{\cos50^\circ}\right)=240\,\mathrm{N}` },
      { lead: "Получаваме двата опъна и проверяваме равновесието.", latex: String.raw`T_1\approx154{,}9\,\mathrm{N},\qquad T_2\approx197{,}3\,\mathrm{N},\qquad \vec T_1+\vec T_2+\vec G=\vec0` },
    ],
    teacherNote: "Честа грешка е да се използват синуси за хоризонталните проекции, без да се отчете спрямо коя ос са дадени ъглите. Поискайте проверка: по-стръмният десен кабел трябва ли непременно да има по-малък опън?",
  },
  {
    title: "Самолет в страничен вятър",
    statement: String.raw`Самолет лети със скорост $80\,\mathrm{m/s}$ спрямо въздуха. Вятърът е $18\,\mathrm{m/s}$ право на север. Пилотът трябва да поддържа път точно на изток до летище на $48\,\mathrm{km}$. Намерете корекционния ъгъл, скоростта спрямо земята и времето на полета.`,
    prediction: "Носът трябва да бъде насочен южно от изток. Северната компонента на въздушната скорост трябва точно да отмени вятъра.",
    hint: String.raw`Желаната резултантна няма северна компонента. Използвайте първо това условие, а после известната големина $80\,\mathrm{m/s}$.`,
    steps: [
      { lead: "Избираме осите.", text: "Изток е положителната хоризонтална посока, север е положителната вертикална." },
      { lead: "По $y$:", latex: String.raw`v_y=v_{\text{сам},y}+v_{\text{вятър},y}=0\quad\Rightarrow\quad v_{\text{сам},y}=-18\,\mathrm{m/s}` },
      { lead: "Намираме корекционния ъгъл.", latex: String.raw`\sin\beta=\frac{18}{80}\quad\Rightarrow\quad\beta\approx13{,}0^\circ\ \text{южно от изток}` },
      { lead: "По $x$:", latex: String.raw`v_x=v_{\text{сам},x}+v_{\text{вятър},x}=\sqrt{80^2-18^2}+0=77{,}95\,\mathrm{m/s}` },
      { lead: "Намираме времето на полета.", latex: String.raw`t=\frac{48\,000\,\mathrm{m}}{77{,}95\,\mathrm{m/s}}\approx616\,\mathrm{s}\approx10{,}26\,\mathrm{min}` },
    ],
    teacherNote: "Диагностичен въпрос: защо самолетът не се движи по посоката на носа си спрямо земята? Следете и преобразуването от секунди в минути.",
  },
  {
    title: "Затваряне на маршрут на геодезически робот",
    statement: String.raw`Робот измерва терен с три последователни премествания: $120\,\mathrm{m}$ при $25^\circ$, $85\,\mathrm{m}$ при $140^\circ$ и $70\,\mathrm{m}$ право на юг. Какъв единствен коригиращ вектор трябва да изпълни, за да се върне точно в началото?`,
    prediction: "Първо трябва да намерим къде е роботът след трите отсечки. Коригиращият вектор има същата големина и противоположна посока на общото преместване.",
    hint: String.raw`Не събирайте дължините. Разложете всяко преместване, намерете $\vec R$, после използвайте $\vec c=-\vec R$.`,
    steps: [
      { lead: "Разлагаме трите премествания.", latex: String.raw`\begin{aligned}\vec a&=120(\cos25^\circ\,\hat i+\sin25^\circ\,\hat j)\,\mathrm{m}\\\vec b&=85(\cos140^\circ\,\hat i+\sin140^\circ\,\hat j)\,\mathrm{m}\\\vec d&=(0\hat i-70\hat j)\,\mathrm{m}\end{aligned}` },
      { lead: "По $x$:", latex: String.raw`R_x=120\cos25^\circ+85\cos140^\circ+0\approx43{,}64\,\mathrm{m}` },
      { lead: "По $y$:", latex: String.raw`R_y=120\sin25^\circ+85\sin140^\circ-70\approx35{,}35\,\mathrm{m}` },
      { lead: "Обръщаме общото преместване.", latex: String.raw`\vec c=-\vec R=(-43{,}64\hat i-35{,}35\hat j)\,\mathrm{m}` },
      { lead: "Възстановяваме големината и посоката.", latex: String.raw`c=\sqrt{43{,}64^2+35{,}35^2}\,\mathrm{m}\approx56{,}16\,\mathrm{m},\qquad\alpha\approx219{,}0^\circ` },
    ],
    teacherNote: "Ако ученикът получи посока около 39 градуса, попитайте в кой квадрант сочи корекцията. Това разкрива сляпо използване на аркустангенса без квадрант.",
  },
  {
    title: "Втори задвижващ модул на индустриален робот",
    statement: String.raw`Манипулатор трябва да приложи върху детайл резултантна сила $500\,\mathrm{N}$ право нагоре. Първият модул вече действа със сила $320\,\mathrm{N}$ под ъгъл $25^\circ$ източно от вертикалата. Каква сила трябва да създаде вторият модул?`,
    prediction: "Вторият модул трябва едновременно да премахне източната компонента на първия и да допълни недостигащата вертикална компонента.",
    hint: String.raw`Търсената сила е неизвестното събираемо: $\vec F_2=\vec R-\vec F_1$. Внимавайте, че ъгълът на $\vec F_1$ е даден спрямо вертикалата.`,
    steps: [
      { lead: "Записваме целта и разлагаме първата сила.", latex: String.raw`\vec R=(0\hat i+500\hat j)\,\mathrm{N},\qquad\vec F_1=(320\sin25^\circ\,\hat i+320\cos25^\circ\,\hat j)\,\mathrm{N}` },
      { lead: "По $x$:", latex: String.raw`F_{2x}=R_x-F_{1x}=0-320\sin25^\circ\approx-135{,}24\,\mathrm{N}` },
      { lead: "По $y$:", latex: String.raw`F_{2y}=R_y-F_{1y}=500-320\cos25^\circ\approx209{,}98\,\mathrm{N}` },
      { lead: "Възстановяваме търсения вектор.", latex: String.raw`\vec F_2=(-135{,}24\hat i+209{,}98\hat j)\,\mathrm{N},\qquad F_2\approx249{,}76\,\mathrm{N}` },
      { lead: "Определяме посоката и проверяваме сумата.", latex: String.raw`\alpha=\operatorname{atan2}(209{,}98,-135{,}24)\approx122{,}8^\circ,\qquad\vec F_1+\vec F_2=(0\hat i+500\hat j)\,\mathrm{N}` },
    ],
    teacherNote: "Проверете дали ученикът разменя синус и косинус, защото ъгълът е спрямо вертикалата. Поискайте и качествена проверка: защо търсената сила трябва да сочи наляво и нагоре?",
  },
];

function Step({ step, index }: { step: ChallengeStep; index: number }) {
  return (
    <div className="space-y-2">
      <p className="text-[15.5px] leading-relaxed text-ink/90">
        <span className="mr-2 text-[11px] font-bold uppercase tracking-[0.13em] text-muted">Стъпка {index + 1}</span>
        <strong className="text-ink"><RichText text={step.lead} /></strong>{step.text ? <> <RichText text={step.text} /></> : null}
      </p>
      {step.latex ? <Formula latex={step.latex} /> : null}
    </div>
  );
}

export default function AppliedVectorChallenges() {
  return (
    <div className="mt-10 space-y-7">
      <div className="border-b-2 border-ink pb-2">
        <h3 className="font-serif text-[23px] font-bold text-ink">Приложни предизвикателства</h3>
        <p className="mt-1 text-[15px] text-muted">Шест задачи за самостоятелна работа с постепенно разкриване на решенията.</p>
      </div>
      {CHALLENGES.map((challenge, index) => (
        <article key={challenge.title} className="rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-5 shadow-hard-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-plus">Задача {index + 4}</p>
          <h4 className="mt-1 font-serif text-[21px] font-bold text-ink">{challenge.title}</h4>
          <p className="mt-3 text-[16px] leading-relaxed text-ink/90"><RichText text={challenge.statement} /></p>
          <div className="mt-4 rounded-r-lg border-l-4 border-warn bg-hl px-4 py-3 text-[14.5px] leading-relaxed text-ink/90">
            <strong className="text-ink">Преди смятане:</strong> {challenge.prediction}
          </div>
          <ProgressiveSolution hint={<RichText text={challenge.hint} />}>
            {challenge.steps.map((step, stepIndex) => <Step key={step.lead} step={step} index={stepIndex} />)}
          </ProgressiveSolution>
          <TeacherNote title="Диагностичен въпрос"><p>{challenge.teacherNote}</p></TeacherNote>
        </article>
      ))}
    </div>
  );
}
