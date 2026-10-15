import Link from "next/link";
import Formula from "@/components/Formula";
import RichText from "@/components/RichText";
import LessonNav from "@/components/LessonNav";
import { TeacherModeProvider, TeacherModeToggle, TeacherNote } from "@/components/interactives/TeacherMode";
const raw = String.raw;
export const metadata = { title: "Термодинамика: математическо допълнение · SingularityLab" };
function P({ text }: { text: string }) { return <p className="my-4 leading-relaxed"><RichText text={text}/></p>; }
const sections = [{id:"work",n:"§1",label:"Работа"}, {id:"isotherm",n:"§2",label:"Изотерма"}, {id:"poisson",n:"§3",label:"Поасон"}, {id:"recap",n:"§4",label:"Обобщение"}];
export default function Page() {
  return <TeacherModeProvider><main className="mx-auto max-w-3xl px-5 pb-24">
    <header className="pt-11"><Link href="/physics/termodinamika" className="text-sm text-minus">← Термодинамика · <RichText text="$12.$"/> клас</Link>
      <h1 className="mt-4 font-serif text-4xl font-bold">Математическо допълнение за напреднали</h1>
      <P text="Тук използваме производни и интеграли. Основните уроци и задачите в тях не изискват това допълнение. Започваме от познатите лица на правоъгълници и уточняваме как се получава точният резултат за крива."/>
    </header>
    <LessonNav items={sections} right={<TeacherModeToggle/>}/>
    <section id="work" className="scroll-mt-20 pt-12 space-y-4">
      <h2 className="font-serif text-2xl font-bold"><RichText text="$\S 1$"/> Работа при променливо налягане</h2>
      <P text={raw`Разделяме изменението на обема на тесни участъци. Във всеки налягането се променя малко, затова работата е приблизително $p_i\Delta V_i$. Сумирането е геометрично събиране на лицата.`}/>
      <Formula latex={raw`A\approx\sum_i p_i\Delta V_i`}/>
      <P text="При все по-тесни участъци сумата се приближава към точна стойност. Определеният интеграл е записът на тази граница."/>
      <Formula latex={raw`A=\int_{V_1}^{V_2}p(V')\,dV'`}/>
      <P text={raw`При натрупана работа $A(V)$ производната по обема е налягането: $dA/dV=p(V)$. Производната показва скоростта на изменение на работата при малка промяна на обема, а не скорост във времето.`}/>
      <TeacherNote>Този запис предполага механично равновесие на границата. При необратим процес работата срещу съпротивление се определя от външното налягане. Не прилагайте равновесната крива на газа към свободно разширение.</TeacherNote>
    </section>
    <section id="isotherm" className="scroll-mt-20 pt-12 space-y-4">
      <h2 className="font-serif text-2xl font-bold"><RichText text="$\S 2$"/> Защо при изотерма се появява логаритъм</h2>
      <P text={raw`При постоянно количество идеален газ и постоянна температура $p(V)=n RT/V$. Налягането намалява при разширение; лицето под кривата не е правоъгълник.`}/>
      <Formula latex={raw`A=n RT\int_{V_1}^{V_2}\frac{dV'}{V'}`}/>
      <P text={raw`Използваме математическия факт $d(\ln x)/dx=1/x$ за $x>0$. Получаваме:`}/>
      <Formula latex={raw`\boxed{A=n RT\ln\frac{V_2}{V_1}}`}/>
      <P text={raw`Аргументът $V_2/V_1$ е безразмерен. При разширение логаритъмът е положителен, при свиване отрицателен. Нулевата работа при $V_2=V_1$ следва от $\ln1=0$. За идеален газ $\Delta U=0$, следователно $Q=A$.`}/>
      <P text="Можем да проверим резултата и с производна, както в записките. Търсим функция, чиято производна дава налягането и която е нула при началния обем."/>
      <Formula latex={raw`\frac{d}{dV}\left(n RT\ln\frac{V}{V_1}\right)=\frac{n RT}{V}`}/>
      <P text={raw`При $1\,\mathrm{mol}$ газ, $T=300\,\mathrm K$ и удвояване на обема:`}/>
      <Formula latex={raw`A=1\cdot8{,}31\cdot300\ln2\approx1728\,\mathrm J`}/>
      <TeacherNote>Еднакво относително разширение дава еднаква работа при еднаква температура. Това обяснява логаритмичния характер по-добре от запомняне на интеграл.</TeacherNote>
    </section>
    <section id="poisson" className="scroll-mt-20 pt-12 space-y-4">
      <h2 className="font-serif text-2xl font-bold"><RichText text="$\S 3$"/> Извеждане на закона на Поасон</h2>
      <P text="При адиабатно разширение положителната работа намалява вътрешната енергия. Приемаме идеален газ, обратим процес, постоянни моларни топлинни капацитети и само обемна работа."/>
      <Formula latex={raw`dU+\delta A=0,\qquad n C_V\,dT+p\,dV=0`}/>
      <P text={raw`Символът $\delta A$ напомня, че работата зависи от процеса. Замествайки $p=n RT/V$ и разделяйки на $n C_VT$, получаваме връзка между относителните изменения:`}/>
      <Formula latex={raw`\frac{dT}{T}=-\frac R{C_V}\frac{dV}{V}=-(\gamma-1)\frac{dV}{V}`}/>
      <P text={raw`Използваме $\gamma=C_p/C_V$ и $C_p-C_V=R$. Интегрираме между крайните състояния:`}/>
      <Formula latex={raw`\int_{T_1}^{T_2}\frac{dT'}{T'}=-(\gamma-1)\int_{V_1}^{V_2}\frac{dV'}{V'}`}/>
      <Formula latex={raw`\ln\frac{T_2}{T_1}=-(\gamma-1)\ln\frac{V_2}{V_1}`}/>
      <P text="Преминаваме от равенство на логаритми към равенство на положителните им аргументи:"/>
      <Formula latex={raw`T_1V_1^{\gamma-1}=T_2V_2^{\gamma-1}`}/>
      <P text={raw`Накрая заместваме $T=pV/(n R)$ и съкращаваме постоянния множител:`}/>
      <Formula latex={raw`\boxed{p_1V_1^\gamma=p_2V_2^\gamma}`}/>
      <P text="Работата може да се намери от крайното изменение на вътрешната енергия, без нов интеграл:"/>
      <Formula latex={raw`A=n C_V(T_1-T_2)=\frac{p_1V_1-p_2V_2}{\gamma-1}`}/>
      <TeacherNote>Равенството за работата от крайните температури изисква адиабатен процес и постоянен капацитет. Обратимост е нужна за използването на закона на Поасон между обемите и наляганията.</TeacherNote>
    </section>
    <section id="recap" className="scroll-mt-20 pt-12">
      <h2 className="font-serif text-2xl font-bold"><RichText text="$\S 4$"/> Обобщение</h2>
      <ul className="mt-4 list-disc space-y-3 pl-5"><li>Интегралът уточнява събирането на малки лица.</li><li>Логаритъмът при изотермата следва от обратната пропорционалност на налягането и обема.</li><li>Законът на Поасон съчетава първия принцип, газовото уравнение и допълнителни предпоставки.</li></ul>
      <Link className="mt-6 block font-semibold text-minus underline" href="/physics/termodinamika/protsesi-idealen-gaz">Обратно към процесите с идеален газ →</Link>
    </section>
  </main></TeacherModeProvider>;
}
