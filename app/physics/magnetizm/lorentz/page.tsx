import Link from "next/link";
import Formula from "@/components/Formula";
import LessonNav from "@/components/LessonNav";
import RichText from "@/components/RichText";
import Section from "@/components/Section";
import LorentzForceExplorer from "@/components/interactives/LorentzForceExplorer";
import LorentzProblemSet from "@/components/interactives/LorentzProblemSet";
import ParticleDeflectionLab from "@/components/interactives/ParticleDeflectionLab";
import PredictionQuestion from "@/components/interactives/PredictionQuestion";
import { TeacherModeProvider, TeacherModeToggle, TeacherNote } from "@/components/interactives/TeacherMode";

export const metadata = { title: "Силата на Лоренц — как полето отклонява заряд · STEM Платформа" };

const NAV = [
  { id: "meaning", n: "§1", label: "Какво е B" },
  { id: "law", n: "§2", label: "Лоренц" },
  { id: "direction", n: "§3", label: "Посоката" },
  { id: "work", n: "§4", label: "Работа" },
  { id: "motion", n: "§5", label: "Отклонение" },
  { id: "wire", n: "§6", label: "Проводник" },
  { id: "applications", n: "§7", label: "Приложения" },
  { id: "problems", n: "§8", label: "Задачи" },
  { id: "recap", n: "§9", label: "Обобщение" },
] as const;

export default function LorentzLessonPage() {
  return <TeacherModeProvider><main className="mx-auto max-w-3xl px-5 pb-24">
    <header className="pt-11 pb-2">
      <nav aria-label="Път до урока" className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[.22em] text-muted">
        <Link href="/physics" className="rounded-sm transition-colors hover:text-minus">Физика</Link><span aria-hidden="true">·</span><Link href="/physics?level=university#magnetism" className="rounded-sm transition-colors hover:text-minus">Магнетизъм</Link>
      </nav>
      <h1 className="mt-2 mb-2 font-serif text-[clamp(34px,7vw,48px)] leading-[1.08] font-bold text-ink">Силата на Лоренц: как полето отклонява заряд</h1>
      <p className="text-[17px] text-muted">Интерактивна глава: посока на v×B, знак на заряда, защо магнитното поле не върши работа и как от това възникват сензори, спектрометри и електромотори</p>
    </header>
    <LessonNav items={NAV} right={<TeacherModeToggle/>}/>

    <Section id="meaning" n="§1" title="Как разбираме, че има магнитно поле">
      <div className="space-y-3">
        <p className="text-[18px] text-ink">В уроците за <Link href="/physics/magnetizm/bio-savar" className="font-semibold text-minus hover:underline">Био–Савар</Link> и <Link href="/physics/magnetizm/amper" className="font-semibold text-minus hover:underline">Ампер</Link> пресмятахме как токовете създават поле B. Но какво означава физически „в тази точка има B“?</p>
        <p className="text-ink/90">Оперативният отговор е: пускаме движещ се заряд. Ако траекторията му се отклони по начин, перпендикулярен на скоростта, сме наблюдавали магнитното действие. Неподвижният заряд не усеща магнитна сила.</p>
      </div>
      <div className="mt-5 rounded-r-lg border-l-4 border-plus bg-hl px-4 py-3 text-[15.5px] leading-relaxed"><strong className="text-ink">Полето не е рисунка от линии.</strong> То е правило, което във всяка точка казва каква сила би изпитал движещ се заряд с дадена скорост.</div>
      <TeacherNote><p>Започнете с контраста: електричното поле действа и на неподвижен заряд; магнитното изисква движение. Това предотвратява най-честото смесване между qE и qv×B.</p></TeacherNote>
    </Section>

    <Section id="law" n="§2" title="Пълната сила на Лоренц">
      <p className="text-ink/90">Електричното и магнитното поле могат да действат едновременно. Силата е сумата от две части:</p>
      <div className="my-5"><Formula latex={String.raw`\boxed{\vec F=q\left(\vec E+\vec v\times\vec B\right)}`}/></div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-[10px] border-[1.5px] border-ink bg-surface px-4 py-3"><p className="text-[11px] font-bold uppercase tracking-[.15em] text-plus">Електрична част qE</p><ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] text-ink/90"><li>не изисква движение;</li><li>може да ускорява и да променя енергията;</li><li>посоката е по/срещу E според знака.</li></ul></div>
        <div className="rounded-[10px] border-[1.5px] border-ink bg-surface px-4 py-3"><p className="text-[11px] font-bold uppercase tracking-[.15em] text-minus">Магнитна част qv×B</p><ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] text-ink/90"><li>изисква движещ се заряд;</li><li>е перпендикулярна на v и B;</li><li>отклонява, без да променя скоростта.</li></ul></div>
      </div>
      <div className="mt-5"><Formula latex={String.raw`|F_B|=|q|vB\sin\alpha`}/></div>
      <p className="mt-4 text-ink/90">Тук α е ъгълът между v и B. Паралелно движение дава нула; перпендикулярно движение дава максимална сила.</p>
    </Section>

    <Section id="direction" n="§3" title="Посоката: три стъпки, без гадаене">
      <div className="mb-5"><PredictionQuestion prompt="Положителен заряд се движи надясно, а B излиза от екрана. Накъде сочи магнитната сила?" options={[{text:"Надолу",correct:true},{text:"Нагоре",correct:false},{text:"По посоката на скоростта",correct:false}]} explanation="За +q: дясно × навън = надолу. Ако зарядът е отрицателен, посоката се обръща нагоре."/></div>
      <ol className="mb-5 list-decimal space-y-2 pl-5 text-ink/90"><li>Забравете временно знака и намерете <RichText text="$\vec v\times\vec B$" /> с дясната ръка.</li><li>Ако q&gt;0, запазете посоката.</li><li>Ако q&lt;0, обърнете я.</li></ol>
      <LorentzForceExplorer/>
      <TeacherNote><p>Настоявайте ученикът винаги да казва „първо за положителен заряд“. Опитът едновременно да върти ръката и да мисли за електрон е източникът на почти всички знакови грешки.</p></TeacherNote>
    </Section>

    <Section id="work" n="§4" title="Защо магнитното поле не върши работа">
      <p className="text-ink/90">Мощността на сила е <RichText text="$P=\vec F\cdot\vec v$" />. Но магнитната сила винаги е перпендикулярна на скоростта:</p>
      <div className="my-5"><Formula latex={String.raw`P_B=\vec F_B\cdot\vec v=q(\vec v\times\vec B)\cdot\vec v=0`}/></div>
      <ul className="list-disc space-y-2 pl-5 text-ink/90"><li>кинетичната енергия остава постоянна;</li><li>големината на скоростта не се променя;</li><li>променя се само посоката — траекторията се огъва.</li></ul>
      <div className="mt-5 rounded-r-lg border-l-4 border-plus bg-hl px-4 py-3 text-[15.5px]"><strong>Важно:</strong> магнитът може да промени движението драматично, без да даде енергия на частицата. Енергията в мотор идва от електрическия източник, не „от магнита“.</div>
    </Section>

    <Section id="motion" n="§5" title="Първи поглед към отклонението">
      <p className="mb-5 text-ink/90">При v⊥B силата остава перпендикулярна на движението и играе ролята на центростремителна сила. Симулацията е мост към следващия урок — пуснете йона и променяйте масата, скоростта и полето.</p>
      <ParticleDeflectionLab/>
      <div className="mt-5"><Formula latex={String.raw`|q|vB=\frac{mv^2}{r}\quad\Longrightarrow\quad\boxed{r=\frac{mv}{|q|B}}`}/></div>
      <TeacherNote><p>Тук целта не е пълното извеждане на кръговото движение, а качествените зависимости: m↑ или v↑ → r↑; B↑ или |q|↑ → r↓; знакът сменя страната, не радиуса.</p></TeacherNote>
    </Section>

    <Section id="wire" n="§6" title="От един заряд към проводник с ток">
      <p className="text-ink/90">Токът е много движещи се носители. Събирането на техните сили на Лоренц върху прав участък дава макроскопичната сила:</p>
      <div className="my-5"><Formula latex={String.raw`\boxed{d\vec F=I\,d\vec l\times\vec B}\qquad\text{и при еднородно B:}\qquad\vec F=I\vec L\times\vec B`}/></div>
      <p className="text-ink/90">Това е силата върху проводник с ток, понякога наричана „сила на Ампер“. Тя не трябва да се бърка с циркулационния закон на Ампер от предишния урок.</p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-ink/90"><li>проводник, успореден на B → F=0;</li><li>перпендикулярен → F=ILB;</li><li>две срещуположни страни на рамка получават сили и създават въртящ момент — принципът на електромотора.</li></ul>
    </Section>

    <Section id="applications" n="§7" title="Къде работи силата на Лоренц">
      <div className="space-y-3">{[
        ["Hall сензор","Движещите се носители се отклоняват към едната страна на пластинка. Полученото Hall напрежение измерва B, ток или положение — в телефони, автомобили и безчеткови мотори."],
        ["Масспектрометър","Йони с еднаква скорост описват различни радиуси според m/q. Така се разделят изотопи и се определя химичният състав."],
        ["Селектор на скорости","Перпендикулярни E и B пропускат без отклонение само частици със v=E/B."],
        ["Циклотрон","Магнитното поле огъва траекторията, а електрично поле между електродите добавя енергия при всяко преминаване."],
        ["Електромотор","Силите върху срещуположните страни на токова рамка образуват въртящ момент."],
      ].map(([tag,text])=><div key={tag} className="rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4"><span className="text-[11px] font-bold uppercase tracking-[.15em] text-minus">{tag}</span><p className="mt-1.5 text-[15px] leading-relaxed text-ink/90">{text}</p></div>)}</div>
    </Section>

    <Section id="problems" n="§8" title="Практически задачи с водено решение">
      <p className="mb-5 text-ink/90">Посоката се решава преди числата. След това задачите свързват закона с електронен сноп, селектор на скорости, масспектрометър и проводник в мотор.</p>
      <LorentzProblemSet/>
    </Section>

    <Section id="recap" n="§9" title="Обобщение">
      <div className="rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard"><ul className="list-disc space-y-2 pl-5 text-[15.5px] leading-relaxed text-ink/90"><li>Пълната сила е <RichText text="$q(\vec E+\vec v\times\vec B)$" />.</li><li>Магнитната част е перпендикулярна на v и B и има големина <RichText text="$|q|vB\sin\alpha$" />.</li><li>Дясната ръка дава посоката за положителен заряд; при отрицателен я обръщаме.</li><li>Магнитното поле не върши работа: променя посоката, но не и кинетичната енергия.</li><li>Сумирането върху носителите в проводник дава <RichText text="$I\vec L\times\vec B$" />.</li></ul></div>
      <p className="mt-5 text-ink/90"><strong>Следваща глава:</strong> движение на заряд в еднородно магнитно поле — окръжност, винтова линия, циклотронна честота и радиус на Лармор.</p>
    </Section>
  </main></TeacherModeProvider>;
}
