import Link from "next/link";
import Formula from "@/components/Formula";
import LessonNav from "@/components/LessonNav";
import RichText from "@/components/RichText";
import Section from "@/components/Section";
import PredictionQuestion from "@/components/interactives/PredictionQuestion";
import SpeedAccelerationProblemSet from "@/components/interactives/SpeedAccelerationProblemSet";
import { PositionDifferenceFigure, TangentVelocityFigure, AccelerationComponentsFigure } from "@/components/interactives/SpeedAccelerationFigures";
import { AccelerationMotionLab, AverageVelocityLab, DerivativeLab, InstantVelocityLab, VelocityChangeLab, VelocityComponentsLab } from "@/components/interactives/SpeedAccelerationLabs";
import { TeacherModeProvider, TeacherModeToggle, TeacherNote } from "@/components/interactives/TeacherMode";

export const metadata = {
  title: "Скорост и ускорение · SingularityLab",
  description: "Интерактивен урок за 11. клас: средна и моментна скорост, компоненти по осите и ускорение при промяна на големината или посоката на скоростта.",
};

const SECTION_NAV = [
  {id: "average", n: "§1", label: "Средна скорост"},
  {id: "instant", n: "§2", label: "В даден момент"},
  {id: "components", n: "§3", label: "По осите"},
  {id: "acceleration", n: "§4", label: "Ускорение"},
  {id: "change", n: "§5", label: "Промяна на скоростта"},
  {id: "problems", n: "§6", label: "Задачи"},
  {id: "math", n: "§7", label: "Връзка с математиката"},
  {id: "recap", n: "§8", label: "Обобщение"},
] as const;

function P({children}: {children: React.ReactNode}) {
  return <p className="my-3 text-[17px] leading-relaxed text-ink/90">{children}</p>;
}
function Note({children}: {children: React.ReactNode}) {
  return <div className="my-5 rounded-r-lg border-l-4 border-plus bg-hl px-4 py-3 text-[17px] leading-relaxed">{children}</div>;
}

export default function SpeedAccelerationPage() {
  return <TeacherModeProvider><main className="mx-auto max-w-3xl px-5 pb-24">
    <header className="pt-11 pb-2">
      <nav aria-label="Път до урока" className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-widest text-muted">
        <Link href="/physics" className="hover:text-minus">Физика</Link><span>·</span><Link href="/physics?level=11#kinematics" className="hover:text-minus">Кинематика · 11. клас</Link>
      </nav>
      <h1 className="mt-3 font-serif text-[clamp(32px,6.6vw,46px)] font-bold leading-tight">Скорост и ускорение</h1>
      <p className="mt-3 text-[17px] text-muted">Как се променя положението на тялото и как се променя неговата скорост.</p>
    </header>
    <LessonNav items={SECTION_NAV} right={<TeacherModeToggle />} />

    <Section id="average" n="§1" title="Какво научаваме от две положения">
      <P>В <Link className="font-semibold text-minus underline" href="/physics/kinematika/dvizhenie-v-ravnina">предишния урок</Link> описахме къде се намира тялото и какво е преместването му. Но една и съща отсечка може да се измине за секунда или за минута. За да сравним движенията, трябва да включим и времето.</P>
      <P>Представете си, че отивате до края на коридора и се връщате на същото място. Изминали сте път, но началното и крайното положение съвпадат.</P>
      <PredictionQuestion prompt="Какво ще получите, ако разделите преместването за цялото отиване и връщане на изминалото време?" options={[
        {text: "Нула", correct: true, why: "Началното и крайното положение съвпадат. Преместването е нула, независимо колко дълго е продължило движението."},
        {text: "Големината на скоростта, с която сте вървели", correct: false, why: "Големината на скоростта при ходенето не е нула. Но тук делим преместването, а не изминатия път."},
        {text: "Не може да се пресметне", correct: false, why: "Интервалът е положителен. Нулево преместване, разделено на ненулево време, дава нулева средна векторна скорост."},
      ]} />
      <AverageVelocityLab />
      <P><strong>Средната векторна скорост</strong> показва преместването за единица време през избрания интервал. Тя е насочена като преместването, когато то не е нула.</P>
      <Formula latex={String.raw`\vec v_{\text{ср}}=\frac{\Delta\vec r}{\Delta t},\qquad \Delta t=t_2-t_1>0`} />
      <P>Познатата <strong>средна скорост по изминатия път</strong> е отношението на пътя към времето. Тя е скаларна величина и не бива да се смесва с големината на средната векторна скорост.</P>
      <Formula latex={String.raw`v_{\text{ср}}=\frac{s}{\Delta t},\qquad |\vec v_{\text{ср}}|\leq v_{\text{ср}}`} />
      <TeacherNote><p>Попитайте дали нулева средна векторна скорост означава покой през целия интервал. Винаги уточнявайте дали числителят е път или преместване. Без стрелка тук означаваме средната скорост по изминатия път; модулът на средната векторна скорост се записва изрично с модулни скоби.</p></TeacherNote>
    </Section>

    <Section id="instant" n="§2" title="Скоростта в даден момент">
      <P>Средната скорост за цялото пътуване не казва какво показва скоростомерът точно сега. Нека сравняваме положенията през все по-кратки интервали, започващи от един и същ момент.</P>
      <PredictionQuestion prompt="Тяло се движи по окръжност от точка $1$ към точка $2$. Ако отчетем положението му след все по-кратко време, точка $2$ ще е все по-близо до точка $1$. На коя линия ще бъде почти успоредна стрелката от $1$ към $2$?" options={[
        {text: "На допирателната към окръжността в точка $1$", correct: true, why: "При скъсяване на интервала отсечката между двете положения се доближава по посока до допирателната в началната точка."},
        {text: "На радиуса през точка $1$", correct: false, why: "Радиусът свързва точката с центъра. Стрелката на преместването свързва две последователни положения по окръжността."},
        {text: "Винаги към положителната посока на $x$", correct: false, why: "Посоката зависи от траекторията и движението, а не от избора на координатни оси."},
      ]} />
      <InstantVelocityLab />
      <P>Преместването намалява, но намалява и времето. Тяхното отношение се приближава до определен вектор: <strong>моментната скорост</strong>. При ненулева скорост той е по допирателната към траекторията и сочи по посоката на движението.</P>
      <PositionDifferenceFigure />
      <P><RichText text={String.raw`Сините радиус-вектори показват положенията в двата момента. Като извадим началния от крайния, получаваме зеленото преместване $\Delta\vec r$. Делението на положителния интервал $\Delta t$ запазва посоката му и дава средната векторна скорост за този кратък интервал.`} /></P>
      <Formula latex={String.raw`\vec v(t)\approx\frac{\vec r(t+\Delta t)-\vec r(t)}{\Delta t}\quad\text{за достатъчно малко }\Delta t`} />
      <Note>Това е приближение за краен интервал. Точната моментна скорост е стойността, към която отношението се стреми при скъсяване на интервала. Не поставяме нула в знаменателя.</Note>
      <P><RichText text={String.raw`**Големината на скоростта** е $v=|\vec v|$. Тя е неотрицателна и се измерва в $\mathrm{m/s}$. За малък интервал $|\Delta\vec r|\approx\Delta s$, затова $v\approx\Delta s/\Delta t$. При покой $\vec v=0$ и векторът няма определена посока.`} /></P>
      <TangentVelocityFigure />
      <TeacherNote><p>Разделете два въпроса: „Накъде сочи стрелката?“ и „Какво става с отношението на дължината ѝ към времето?“. Късата стрелка на преместването сама по себе си не означава малка скорост.</p></TeacherNote>
    </Section>

    <Section id="components" n="§3" title="Компоненти на скоростта">
      <P>Дрон се движи едновременно на изток и на север. За да опишем скоростта му, можем да проследим поотделно как се променят двете координати. Приемаме неподвижни оси спрямо избраната отправна система.</P>
      <PredictionQuestion prompt="Дронът лети на северозапад. Оста $x$ сочи на изток, а оста $y$ на север. Какви са знаците на компонентите?" options={[
        {text: String.raw`$v_x<0$, $v_y>0$`, correct: true, why: "Запад е срещу положителната посока на хоризонталната ос, а север е по положителната посока на вертикалната."},
        {text: String.raw`$v_x>0$, $v_y>0$`, correct: false, why: "Две положителни компоненти означават движение на североизток."},
        {text: String.raw`$v_x<0$, $v_y<0$`, correct: false, why: "Две отрицателни компоненти означават движение на югозапад."},
      ]} />
      <VelocityComponentsLab />
      <P><RichText text={String.raw`Единичните вектори $\hat i$ и $\hat j$ задават положителните посоки на осите. Числата $v_x$ и $v_y$ са скаларни компоненти със знак; векторните компоненти са $v_x\hat i$ и $v_y\hat j$.`} /></P>
      <Formula latex={String.raw`\vec v=v_x\hat i+v_y\hat j,\qquad v=\sqrt{v_x^2+v_y^2}`} />
      <P><RichText text={String.raw`**По x:** за малък интервал $v_x\approx\Delta x/\Delta t$. **По y:** $v_y\approx\Delta y/\Delta t$. За средните компоненти през целия интервал същите отношения са точни.`} /></P>
      <P><RichText text={String.raw`Ако ъгълът $\theta$ е измерен от положителната посока на $x$ обратно на часовниковата стрелка, проекциите са:`} /></P>
      <Formula latex={String.raw`v_x=v\cos\theta,\qquad v_y=v\sin\theta`} />
      <TeacherNote><p>Проверете дали ученикът определя знаците преди смятане. При намиране на посока от компонентите отношението им не е достатъчно: първо определете четвъртината. Еднакъв тангенс имат и две противоположни посоки.</p></TeacherNote>
    </Section>

    <Section id="acceleration" n="§4" title="Кога има ускорение">
      <P>При натискане на газта автомобилът ускорява, а при спиране се забавя. Но какво става при завой, ако показанието на скоростомера не се променя?</P>
      <PredictionQuestion prompt="Автомобил преминава по кръгов завой с постоянна големина на скоростта. Има ли ускорение?" options={[
        {text: "Да", correct: true, why: "Посоката на скоростта се променя. Следователно се променя векторът на скоростта, дори големината му да остава същата."},
        {text: "Не", correct: false, why: "Скоростомерът показва големината на скоростта. Той не отчита промяната на нейната посока."},
        {text: "Само при влизането в завоя", correct: false, why: "Посоката продължава да се променя през целия криволинеен участък, не само при влизането в него."},
      ]} />
      <AccelerationMotionLab />
      <Note><strong>Ускорението описва промяната на вектора на скоростта.</strong> Може да се променя големината му, посоката му или и двете.</Note>
      <P>При движение по права еднопосочните скорост и ускорение означават увеличаване на големината на скоростта, а противопосочните означават намаляване. При равномерно движение по окръжност ускорението е перпендикулярно на скоростта и сочи към центъра.</P>
      <P>Затова не определяме „ускоряване“ или „забавяне“ само по знака на една компонента на ускорението. Знакът описва посока спрямо избраната ос.</P>
      <TeacherNote><p>Попитайте: „Ако обърнем положителната посока на оста, автомобилът ще започне ли физически да ускорява вместо да се забавя?“. Това показва защо знакът сам по себе си не описва изменението на големината на скоростта.</p></TeacherNote>
    </Section>

    <Section id="change" n="§5" title="Как намираме ускорението">
      <P>Вече умеем да изваждаме вектори. За промяната на скоростта вземаме крайния вектор и изваждаме началния. Преди сметките трябва да видим тази разлика на чертежа.</P>
      <PredictionQuestion prompt="Пренесохме двете скорости до общо начало. Коя стрелка показва промяната от първата към втората?" options={[
        {text: "От върха на първата към върха на втората", correct: true, why: String.raw`Към $\vec v_1$ добавяме тази стрелка и достигаме върха на $\vec v_2$. Следователно тя е $\vec v_2-\vec v_1$.`},
        {text: "От върха на втората към върха на първата", correct: false, why: String.raw`Това е обратната промяна $\vec v_1-\vec v_2$. Тя има противоположна посока.`},
        {text: "От общото начало към средата между върховете", correct: false, why: "Този вектор не е разликата. При равни скорости той дори може да е ненулев, макар промяна да няма."},
      ]} />
      <VelocityChangeLab />
      <Formula latex={String.raw`\Delta\vec v=\vec v_2-\vec v_1,\qquad \vec a_{\text{ср}}=\frac{\Delta\vec v}{\Delta t}`} />
      <P><RichText text={String.raw`Времето $\Delta t$ е положително, затова средното ускорение има посоката на $\Delta\vec v$. Делим промяна, измерена в $\mathrm{m/s}$, на време в секунди. Получаваме единицата $\mathrm{m/s^2}$.`} /></P>
      <P><RichText text={String.raw`Например постоянно $a_x=2\,\mathrm{m/s^2}$ означава, че всяка секунда компонентата $v_x$ се увеличава с $2\,\mathrm{m/s}$. Това не означава, че координатата се увеличава с два метра всяка секунда.`} /></P>
      <P><strong>Моментното ускорение</strong> се получава по същата идея като моментната скорост: скъсяваме интервала, започващ от избрания момент, и следим към какъв вектор се приближава отношението.</P>
      <Formula latex={String.raw`\vec a(t)\approx\frac{\vec v(t+\Delta t)-\vec v(t)}{\Delta t}\quad\text{за достатъчно малко }\Delta t`} />
      <P>При фиксирани координатни оси можем да извършим изваждането по компоненти.</P>
      <AccelerationComponentsFigure />
      <Formula latex={String.raw`\begin{aligned}\text{По }x:\quad a_{\text{ср},x}&=\frac{v_{2x}-v_{1x}}{\Delta t},\\[4pt]\text{По }y:\quad a_{\text{ср},y}&=\frac{v_{2y}-v_{1y}}{\Delta t}.\end{aligned}`} />
      <P><RichText text={String.raw`Моментният вектор се записва $\vec a=a_x\hat i+a_y\hat j$. Ако ускорението е постоянно през интервала, средното и моментното ускорение съвпадат точно.`} /></P>
      <TeacherNote><p>Двете крайни скорости не определят всички междинни скорости. Симулацията на изваждането дава средно ускорение, не задължително моментното ускорение в началната точка. Не отъждествявайте зелената стрелка с ускорението във всяка точка на завоя.</p></TeacherNote>
    </Section>

    <Section id="problems" n="§6" title="Водени задачи">
      <P>Първо определете посоките и знаците, после запишете действията по осите. Решенията се отварят стъпка по стъпка.</P>
      <SpeedAccelerationProblemSet />
    </Section>

    <Section id="math" n="§7" title="Връзка с математиката">
      <P>Следващият раздел е по желание. Той дава име на идеята за моментна промяна, без да е необходим за задачите по-горе.</P>
      <details className="rounded-xl border-[1.5px] border-ink bg-surface p-5">
        <summary className="cursor-pointer font-semibold">Какво означава производна</summary>
        <P><RichText text={String.raw`Нека движение по права е зададено с $x(t)=k t^2$, където $k=1\,\mathrm{m/s^2}$. Когато времето е в секунди, числените координати са $0,1,4,9,\ldots$ метра. Каква е скоростта при $t_0=2\,\mathrm{s}$?`} /></P>
        <P><RichText text={String.raw`На графиката хоризонталната ос е **време**, а вертикалната е **координата**. Параболата не е траекторията на тялото: самото тяло се движи по права. Наклонът на секущата е средната компонента $v_{\text{ср},x}$ за избрания интервал.`} /></P>
        <DerivativeLab />
        <P><RichText text={String.raw`За интервал $h>0$ разликата на координатите е $k(t_0+h)^2-kt_0^2$. Разкриваме скобите и делим на ненулевото $h$:`} /></P>
        <Formula latex={String.raw`\frac{x(t_0+h)-x(t_0)}h=k(2t_0+h)\;\longrightarrow\;2kt_0=4\,\mathrm{m/s}`} />
        <P>Числото, към което се приближава наклонът на секущата, е наклонът на допирателната. Математическото му име е производна.</P>
        <Formula latex={String.raw`v_x(t)=x'(t)=\lim_{h\to0}\frac{x(t+h)-x(t)}h`} />
        <P><RichText text={String.raw`За същото движение $v_x(t)=2kt$. Ускорението е производната на скоростта: $a_x(t)=v_x'(t)=2k=2\,\mathrm{m/s^2}$. Тук не са нужни правила за интегриране.`} /></P>
      </details>
      <TeacherNote><p>Използвайте този раздел след физическия смисъл. Не е необходимо ученикът да владее формалното определение за граница, за да сравни резултатите при скъсяващи се интервали.</p></TeacherNote>
    </Section>

    <Section id="recap" n="§8" title="Обобщение">
      <ul className="list-disc space-y-3 pl-5 text-[17px] leading-relaxed">
        <li>Средната векторна скорост се намира от преместването и времето. Средната скорост по изминатия път се намира от пътя и времето.</li>
        <li>Моментната скорост описва движението в избран момент. При ненулева скорост тя е по допирателната към траекторията.</li>
        <li><RichText text={String.raw`Компонентите $v_x$ и $v_y$ имат знак, а големината $v=\sqrt{v_x^2+v_y^2}$ е неотрицателна.`} /></li>
        <li>Ускорение има при промяна на големината или посоката на скоростта. Постоянна големина на скоростта не изключва ускорение.</li>
        <li><RichText text={String.raw`За интервал: $\vec a_{\text{ср}}=(\vec v_2-\vec v_1)/\Delta t$. За моментно ускорение скъсяваме интервала. Единицата е $\mathrm{m/s^2}$.`} /></li>
        <li>Ако ускорението е нула през целия интервал, скоростта е постоянна: движението е праволинейно равномерно или тялото е в покой.</li>
      </ul>
      <div className="mt-7 rounded-xl border-[1.5px] border-ink bg-surface p-5 shadow-hard-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-minus">Следващ урок · предстои</p>
        <h3 className="mt-2 font-serif text-xl font-bold">Праволинейно движение</h3>
        <P>Ще приложим компонентите на скоростта и ускорението към движение по една ос и ще свържем описанието с графиките.</P>
        <Link href="/physics?level=11#kinematics" className="font-semibold text-minus underline">Към картата на раздела →</Link>
      </div>
    </Section>
  </main></TeacherModeProvider>;
}
