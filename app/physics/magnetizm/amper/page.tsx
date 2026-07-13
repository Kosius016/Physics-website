import Link from "next/link";
import Formula from "@/components/Formula";
import LessonNav from "@/components/LessonNav";
import RichText from "@/components/RichText";
import Section from "@/components/Section";
import AmpereLoopExplorer from "@/components/interactives/AmpereLoopExplorer";
import AmpereProblemSet from "@/components/interactives/AmpereProblemSet";
import PredictionQuestion from "@/components/interactives/PredictionQuestion";
import SolenoidAmpere from "@/components/interactives/SolenoidAmpere";
import { TeacherModeProvider, TeacherModeToggle, TeacherNote } from "@/components/interactives/TeacherMode";

export const metadata = {
  title: "Законът на Ампер — симетрия вместо интегриране · STEM Платформа",
};

const SECTION_NAV = [
  { id: "bridge", n: "§1", label: "Мостът" },
  { id: "circulation", n: "§2", label: "Циркулация" },
  { id: "loop", n: "§3", label: "Контурът" },
  { id: "wire", n: "§4", label: "Проводник" },
  { id: "solenoid", n: "§5", label: "Соленоид" },
  { id: "toroid", n: "§6", label: "Тороид" },
  { id: "limits", n: "§7", label: "Кога помага" },
  { id: "problems", n: "§8", label: "Задачи" },
  { id: "recap", n: "§9", label: "Обобщение" },
] as const;

export default function AmpereLessonPage() {
  return (
    <TeacherModeProvider>
      <main className="mx-auto max-w-3xl px-5 pb-24">
        <header className="pt-11 pb-2">
          <nav aria-label="Път до урока" className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[.22em] text-muted">
            <Link href="/physics" className="rounded-sm transition-colors hover:text-minus">Физика</Link>
            <span aria-hidden="true">·</span>
            <Link href="/physics?level=university#magnetism" className="rounded-sm transition-colors hover:text-minus">Магнетизъм</Link>
          </nav>
          <h1 className="mt-2 mb-2 font-serif text-[clamp(34px,7vw,48px)] leading-[1.08] font-bold text-ink">
            Законът на Ампер: симетрия вместо интегриране
          </h1>
          <p className="text-[17px] text-muted">
            Интерактивна глава: циркулация на магнитното поле, избор на амперова линия, прав проводник, соленоид и тороид
          </p>
        </header>

        <LessonNav items={SECTION_NAV} right={<TeacherModeToggle />} />

        <Section id="bridge" n="§1" title="От Био–Савар към Ампер">
          <div className="space-y-3">
            <p className="text-[18px] text-ink">
              В <Link href="/physics/magnetizm/bio-savar" className="font-semibold text-minus hover:underline">предишната глава</Link>{" "}
              построихме магнитното поле, като събирахме приноса на всяко малко парче ток. Това е
              универсален метод — но за безкраен проводник сметката е дълга, въпреки че резултатът
              има проста кръгова симетрия.
            </p>
            <p className="text-ink/90">
              Законът на Ампер сменя въпроса. Вместо „какъв е приносът на всяко <RichText text="$d\vec l$" />?“
              питаме: <strong>как магнитното поле обикаля около целия ток?</strong> При правилна
              симетрия една затворена линия заменя целия интеграл на Био–Савар.
            </p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[10px] border-[1.5px] border-ink bg-surface px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[.15em] text-plus">Био–Савар</p>
              <p className="mt-2 text-[15px] text-ink/90">Събира приноси от източника. Работи за почти всяка геометрия, но често изисква интегриране.</p>
            </div>
            <div className="rounded-[10px] border-[1.5px] border-ink bg-surface px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[.15em] text-minus">Ампер</p>
              <p className="mt-2 text-[15px] text-ink/90">Използва циркулация и симетрия. Изключително кратък при прав проводник, соленоид и тороид.</p>
            </div>
          </div>
          <TeacherNote>
            <p>Започнете с вече известния резултат B=μ₀I/2πr и попитайте: „Коя част от формулата прилича на обиколка?“ Целта е 2πr да бъде разпознато преди записването на закона.</p>
          </TeacherNote>
        </Section>

        <Section id="circulation" n="§2" title="Циркулация: колко полето следва контура">
          <p className="text-ink/90">
            Избираме затворен контур и вървим по него на малки стъпки <RichText text="$d\vec l$" />.
            Във всяка точка вземаме само компонента на <RichText text="$\vec B$" />, която сочи по
            посоката на движението. Скалярното произведение прави точно това:
          </p>
          <div className="mt-4"><Formula latex={String.raw`\oint_C \vec B\cdot d\vec l=\mu_0 I_{\text{обхв}}`} /></div>
          <div className="mt-5 mb-5">
            <PredictionQuestion
              prompt="Ако B е перпендикулярно на малък участък dl от контура, какъв е приносът B·dl?"
              options={[{ text: "Нула", correct: true }, { text: "B·dl", correct: false }, { text: "−B·dl във всички случаи", correct: false }]}
              explanation="B·dl = B dl cos 90° = 0. Законът събира само тангенциалната част на полето — тази, която действително „върви“ по контура."
            />
          </div>
          <div className="rounded-r-lg border-l-4 border-plus bg-hl px-4 py-3 text-[15.5px] leading-relaxed">
            <strong className="text-ink">Не бъркайте с Гаус:</strong> потокът пресича повърхнина;
            циркулацията обикаля по затворена линия. Ампер измерва „въртенето“ на магнитното поле
            около токовете, не количеството поле през площ.
          </div>
          <TeacherNote><p>Прекарайте пръст по нарисуван контур: поле по пръста → положителен принос; срещу пръста → отрицателен; напречно → нула. Това дава телесен смисъл на скаларното произведение.</p></TeacherNote>
        </Section>

        <Section id="loop" n="§3" title="Кой амперов контур прави задачата лесна?">
          <p className="mb-5 text-ink/90">
            Законът е верен за <strong>всеки</strong> затворен контур. Но сметка без интегриране
            получаваме само ако симетрията прави B константно по важните части и определя ъгъла с
            <RichText text="$d\vec l$" />. Сравнете четирите контура.
          </p>
          <AmpereLoopExplorer />
          <TeacherNote><p>Не казвайте „квадратът е грешен“. Той е законен контур, но лош инструмент: B се мени по него и не може да бъде изнесено пред интеграла. Разликата между „вярно“ и „полезно“ е централната идея.</p></TeacherNote>
        </Section>

        <Section id="wire" n="§4" title="Безкраен прав проводник — резултатът за три реда">
          <p className="text-ink/90">
            Избираме кръг с радиус r, центриран върху проводника. Кръговата симетрия дава две
            решаващи неща: B има една и съща големина навсякъде и е успоредно на контура.
          </p>
          <div className="mt-5 space-y-4">
            <div><p className="mb-2 text-[12px] font-bold uppercase tracking-[.15em] text-minus">1 · Законът</p><Formula latex={String.raw`\oint\vec B\cdot d\vec l=\mu_0I`} /></div>
            <div><p className="mb-2 text-[12px] font-bold uppercase tracking-[.15em] text-minus">2 · Симетрията</p><Formula latex={String.raw`\oint\vec B\cdot d\vec l=B\oint dl=B(2\pi r)`} /></div>
            <div><p className="mb-2 text-[12px] font-bold uppercase tracking-[.15em] text-minus">3 · Резултатът</p><Formula latex={String.raw`\boxed{B(r)=\frac{\mu_0I}{2\pi r}}`} /></div>
          </div>
          <p className="mt-4 text-ink/90">
            Това е същият резултат, който получихме като граница в Био–Савар. Двата закона не си
            противоречат: единият строи полето от източниците, другият използва общото му обикаляне.
          </p>
        </Section>

        <Section id="solenoid" n="§5" title="Соленоид: почти равномерно поле">
          <p className="mb-5 text-ink/90">
            При дълъг соленоид полетата на навивките се усилват вътре и почти се компенсират навън.
            Избираме правоъгълен контур: едната му страна е вътре, другата — далеч отвън. Късите
            страни са перпендикулярни на B и не допринасят.
          </p>
          <SolenoidAmpere />
          <div className="mt-5"><Formula latex={String.raw`BL=\mu_0(nL)I\quad\Longrightarrow\quad\boxed{B\approx\mu_0nI},\qquad n=\frac NL`} /></div>
          <TeacherNote><p>Формулата е приближение: настоявайте върху думите „дълъг“ и „далеч от краищата“. Плъзгачът L е удобен за разграничаване между общия брой N и гъстотата n=N/L.</p></TeacherNote>
        </Section>

        <Section id="toroid" n="§6" title="Тороид: соленоид без краища">
          <p className="text-ink/90">
            Огъваме соленоида в затворен пръстен. Симетрията вече е кръгова: B следва концентрични
            окръжности в сърцевината. Амперовият контур обхваща всяка от N-те навивки, затова
            <RichText text="$I_{\text{обхв}}=NI$" />.
          </p>
          <div className="my-5"><Formula latex={String.raw`B(2\pi r)=\mu_0NI\quad\Longrightarrow\quad\boxed{B(r)=\frac{\mu_0NI}{2\pi r}}`} /></div>
          <ul className="list-disc space-y-2 pl-5 text-ink/90">
            <li>В сърцевината полето намалява като 1/r — вътрешната страна е по-силна.</li>
            <li>В идеалния модел извън тороида обхванатият сумарен ток е нула и полето е почти нулево.</li>
            <li>Затова тороидалните индуктори държат магнитното поле близо до себе си и намаляват смущенията.</li>
          </ul>
        </Section>

        <Section id="limits" n="§7" title="Кога Ампер помага — и кога не">
          <div className="overflow-x-auto rounded-[10px] border-[1.5px] border-ink bg-surface shadow-hard">
            <table className="w-full min-w-[570px] border-collapse text-[15px]">
              <thead className="bg-hl"><tr><th className="p-3 text-left">Геометрия</th><th className="p-3 text-left">Законът верен?</th><th className="p-3 text-left">Лесна сметка?</th><th className="p-3 text-left">Причина</th></tr></thead>
              <tbody className="divide-y divide-rule">
                <tr><td className="p-3">Безкраен проводник</td><td className="p-3">Да</td><td className="p-3 font-bold text-ok">Да</td><td className="p-3">кръгова симетрия</td></tr>
                <tr><td className="p-3">Дълъг соленоид</td><td className="p-3">Да</td><td className="p-3 font-bold text-ok">Приблизително</td><td className="p-3">равномерно вътре</td></tr>
                <tr><td className="p-3">Тороид</td><td className="p-3">Да</td><td className="p-3 font-bold text-ok">Да</td><td className="p-3">затворена кръгова симетрия</td></tr>
                <tr><td className="p-3">Къс/огънат проводник</td><td className="p-3">Да</td><td className="p-3 font-bold text-plus">Обикновено не</td><td className="p-3">B не е константно по удобен контур</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-ink/90"><strong>Правило за избор:</strong> ако можете предварително да кажете посоката и къде големината на B е еднаква — опитайте Ампер. Ако геометрията е произволна, върнете се към Био–Савар или числена симулация.</p>
        </Section>

        <Section id="problems" n="§8" title="Практически задачи с водено решение">
          <p className="mb-5 text-ink/90">Четири конфигурации — кабел, ток вътре в дебел проводник, електромагнит и тороид. Първо се избира симетрията и обхванатият ток, после се отключва сметката.</p>
          <AmpereProblemSet />
        </Section>

        <Section id="recap" n="§9" title="Обобщение">
          <div className="rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard">
            <ul className="list-disc space-y-2 pl-5 text-[15.5px] leading-relaxed text-ink/90">
              <li>Законът на Ампер свързва <strong>циркулацията на B</strong> с обхванатия ток.</li>
              <li>Контурът не е физически обект — избираме го така, че симетрията да изнесе B пред интеграла.</li>
              <li>Прав проводник: <RichText text="$B=\mu_0I/(2\pi r)$" />.</li>
              <li>Дълъг соленоид: <RichText text="$B\approx\mu_0nI$" />; тороид: <RichText text="$B=\mu_0NI/(2\pi r)$" />.</li>
              <li>Законът е винаги верен за стационарни токове, но е изчислително силен само при достатъчна симетрия.</li>
            </ul>
          </div>
          <p className="mt-5 text-ink/90"><strong>Следваща глава:</strong>{" "}<Link href="/physics/magnetizm/lorentz" className="font-semibold text-minus hover:underline">силата на Лоренц</Link> — вече знаем как токовете създават магнитно поле; следва да видим как полето действа върху движещи се заряди и проводници.</p>
        </Section>
      </main>
    </TeacherModeProvider>
  );
}
