import Link from "next/link";
import Formula from "@/components/Formula";
import LessonNav from "@/components/LessonNav";
import RichText from "@/components/RichText";
import Section from "@/components/Section";
import AmpereLoopExplorer from "@/components/interactives/AmpereLoopExplorer";
import AmpereProblemSet from "@/components/interactives/AmpereProblemSet";
import CirculationRadius from "@/components/interactives/CirculationRadius";
import PredictionQuestion from "@/components/interactives/PredictionQuestion";
import SolenoidAmpere from "@/components/interactives/SolenoidAmpere";
import { TeacherModeProvider, TeacherModeToggle, TeacherNote } from "@/components/interactives/TeacherMode";

export const metadata = {
  title: "Законът на Ампер — извеждане чрез симетрия · SingularityLab",
};

const SECTION_NAV = [
  { id: "bridge", n: "§1", label: "Мостът" },
  { id: "circulation", n: "§2", label: "Циркулация" },
  { id: "derivation", n: "§3", label: "Извеждането" },
  { id: "shape", n: "§4", label: "Формата" },
  { id: "method", n: "§5", label: "Методът" },
  { id: "solenoid", n: "§6", label: "Соленоид" },
  { id: "toroid", n: "§7", label: "Тороид" },
  { id: "limits", n: "§8", label: "Кога помага" },
  { id: "problems", n: "§9", label: "Задачи" },
  { id: "recap", n: "§10", label: "Обобщение" },
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
            Интерактивна глава: извеждаме закона от полето на правия проводник, показваме защо формата на контура е без значение и го прилагаме за соленоид и тороид
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
              питаме: <strong>как магнитното поле обикаля около целия ток?</strong> В тази глава няма
              да приемем закона наготово — ще го <strong>изведем</strong> от резултата, който вече
              притежаваме.
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
        </Section>

        <Section id="circulation" n="§2" title="Циркулация: колко полето следва контура">
          <p className="text-ink/90">
            Нужно ни е едно ново понятие. Избираме затворена крива и я обхождаме на малки стъпки{" "}
            <RichText text="$d\vec l$" />. Във всяка точка вземаме само компонентата на{" "}
            <RichText text="$\vec B$" />, която сочи по посоката на движението, и я умножаваме по
            дължината на стъпката. Сборът от всички стъпки се нарича <strong>циркулация</strong>:
          </p>
          <div className="mt-4"><Formula latex={String.raw`\Gamma=\oint_C \vec B\cdot d\vec l`} /></div>
          <div className="mt-5 mb-5">
            <PredictionQuestion
              prompt="Ако B е перпендикулярно на малък участък dl от контура, какъв е приносът B·dl?"
              options={[{ text: "Нула", correct: true }, { text: "B·dl", correct: false }, { text: "−B·dl във всички случаи", correct: false }]}
              explanation="B·dl = B dl cos 90° = 0. Циркулацията събира само тангенциалната част на полето — тази, която действително „върви“ по контура."
            />
          </div>
          <div className="rounded-r-lg border-l-4 border-plus bg-hl px-4 py-3 text-[15.5px] leading-relaxed">
            <strong className="text-ink">Не бъркайте с Гаус:</strong> потокът пресича повърхнина;
            циркулацията обикаля по затворена линия. Циркулацията измерва „въртенето“ на магнитното
            поле около токовете, не количеството поле през площ.
          </div>
          <TeacherNote><p>Прекарайте пръст по нарисуван контур: поле по пръста → положителен принос; срещу пръста → отрицателен; напречно → нула. Това дава телесен смисъл на скаларното произведение.</p></TeacherNote>
        </Section>

        <Section id="derivation" n="§3" title="Извеждането: кръгът, който съкращава r">
          <p className="text-ink/90">
            Тръгваме от единственото, което знаем: полето на безкраен прав проводник обикаля в
            кръг с големина <RichText text="$B=\mu_0I/2\pi r$" />. Да пресметнем циркулацията му по
            най-естествения контур — кръг с радиус <RichText text="$r$" />, центриран върху
            проводника, обходен по посоката на полето.
          </p>
          <div className="mt-5 space-y-4">
            <div><p className="mb-2 text-[12px] font-bold uppercase tracking-[.15em] text-minus">1 · По кръга полето е успоредно на стъпките и с еднаква големина</p><Formula latex={String.raw`\oint\vec B\cdot d\vec l=B\oint dl=B\,(2\pi r)`} /></div>
            <div><p className="mb-2 text-[12px] font-bold uppercase tracking-[.15em] text-minus">2 · Заместваме известното поле</p><Formula latex={String.raw`B\,(2\pi r)=\frac{\mu_0I}{2\pi r}\,(2\pi r)`} /></div>
            <div><p className="mb-2 text-[12px] font-bold uppercase tracking-[.15em] text-minus">3 · Радиусът се съкращава</p><Formula latex={String.raw`\boxed{\oint\vec B\cdot d\vec l=\mu_0I}\qquad\text{за всяко }r`} /></div>
          </div>
          <p className="mt-4 text-ink/90">
            Това не е случайно съкращение, а геометрия: полето <strong>отслабва като{" "}
            <RichText text="$1/r$" /> точно толкова, колкото пътеката се удължава като{" "}
            <RichText text="$r$" /></strong>. Каквото губим от големината, печелим от дължината.
          </p>
          <div className="mt-5 mb-5">
            <PredictionQuestion
              prompt="Удвояваме радиуса на кръговата пътека. Какво става с циркулацията ∮B·dl?"
              options={[{ text: "Остава същата: μ₀I", correct: true }, { text: "Намалява наполовина", correct: false }, { text: "Удвоява се", correct: false }]}
              explanation="B пада двойно, но пътеката става двойно по-дълга. Произведението B·2πr не се променя — то зависи само от тока вътре."
            />
          </div>
          <CirculationRadius />
          <TeacherNote>
            <p>Започнете с известния резултат B=μ₀I/2πr и попитайте: „Коя част от формулата прилича на обиколка?“ Целта е 2πr да бъде разпознато като дължина на пътека, преди да се запише циркулацията. Правоъгълникът с постоянна площ е нагледът, който остава в паметта.</p>
          </TeacherNote>
        </Section>

        <Section id="shape" n="§4" title="Формата на контура няма значение">
          <p className="text-ink/90">
            Дотук — само за центриран кръг. Истинската сила на резултата е, че той оцелява за{" "}
            <strong>всякакъв</strong> затворен контур. Причината се вижда в приноса на едно-единствено
            парче: на разстояние <RichText text="$r$" /> от проводника парче дъга под малък ъгъл{" "}
            <RichText text="$d\varphi$" /> има дължина <RichText text="$r\,d\varphi$" />, а полето там е{" "}
            <RichText text="$\mu_0I/2\pi r$" />:
          </p>
          <div className="mt-4"><Formula latex={String.raw`\vec B\cdot d\vec l=\frac{\mu_0I}{2\pi r}\,\bigl(r\,d\varphi\bigr)=\frac{\mu_0I}{2\pi}\,d\varphi`} /></div>
          <p className="mt-4 text-ink/90">
            Радиусът се съкращава <strong>още на нивото на едната стъпка</strong>: приносът зависи
            само от изметения ъгъл <RichText text="$d\varphi$" />, не от разстоянието. А радиалните
            участъци не носят нищо, защото там <RichText text="$\vec B\perp d\vec l$" />. Затова:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-ink/90">
            <li>контур, който обикаля тока, измита общ ъгъл <RichText text="$2\pi$" /> → циркулация <RichText text="$\mu_0I$" />;</li>
            <li>контур, който не обхваща тока, измита ъгъл напред и после назад → циркулация <RichText text="$0$" />.</li>
          </ul>
          <div className="mt-5 mb-5">
            <PredictionQuestion
              prompt="Контурът минава близо до проводника, но НЕ го обхваща. Каква е циркулацията по него?"
              options={[{ text: "Точно нула", correct: true }, { text: "μ₀I, щом полето го докосва", correct: false }, { text: "Малка, но положителна", correct: false }]}
              explanation="Изметеният ъгъл тръгва напред и се връща обратно до нула. Полето по контура не е нула, но приносите по отиване и по връщане се унищожават точно."
            />
          </div>
          <AmpereLoopExplorer />
          <p className="mt-5 text-ink/90">
            Остава една стъпка до общия закон. Полетата на много токове се наслагват, а с тях — и
            циркулациите им. Токовете извън контура дават нула; тези вътре дават по{" "}
            <RichText text="$\mu_0I$" /> със знак по правилото на дясната ръка (палецът по тока,
            пръстите по посоката на обхождане):
          </p>
          <div className="mt-4"><Formula latex={String.raw`\boxed{\ \oint_C\vec B\cdot d\vec l=\mu_0 I_{\text{обхв}}\ }\qquad I_{\text{обхв}}=\sum_{\text{вътре}}I_k`} /></div>
          <TeacherNote><p>Не казвайте „стъпаловидният контур е грешен“. Той е законен и дава същата циркулация — точно това е поантата. Разликата между контурите не е „верен/грешен“, а колко удобни са за смятане, което идва в §5.</p></TeacherNote>
        </Section>

        <Section id="method" n="§5" title="Методът: същата сметка, обърната наопаки">
          <p className="text-ink/90">
            В §3 знаехме полето и намерихме циркулацията. Приложението на закона върви наобратно:
            <strong> симетрията ни казва формата на полето</strong>, законът дава големината му.
            Рецептата е винаги една и съща:
          </p>
          <div className="mt-5 space-y-4">
            <div><p className="mb-2 text-[12px] font-bold uppercase tracking-[.15em] text-minus">1 · От симетрията: посока на B и къде големината му е еднаква</p><Formula latex={String.raw`\vec B\parallel d\vec l,\qquad |\vec B|=B=\text{const по контура}`} /></div>
            <div><p className="mb-2 text-[12px] font-bold uppercase tracking-[.15em] text-minus">2 · Изнасяме B пред интеграла</p><Formula latex={String.raw`\oint\vec B\cdot d\vec l=B\cdot(\text{дължина на контура})=\mu_0I_{\text{обхв}}`} /></div>
            <div><p className="mb-2 text-[12px] font-bold uppercase tracking-[.15em] text-minus">3 · Изразяваме B</p><Formula latex={String.raw`B=\frac{\mu_0I_{\text{обхв}}}{\text{дължина}}`} /></div>
          </div>
          <p className="mt-4 text-ink/90">
            За правия проводник така си връщаме <RichText text="$B=\mu_0I/2\pi r$" /> — формулата, от
            която тръгнахме. Това е проверка, не печалба. Печалбата идва при геометрии, където
            Био–Савар би бил мъчителен: вътрешността на дебел проводник (задача 2), соленоидът и
            тороидът — следващите две секции.
          </p>
        </Section>

        <Section id="solenoid" n="§6" title="Соленоид: почти равномерно поле">
          <p className="mb-5 text-ink/90">
            При дълъг соленоид полетата на навивките се усилват вътре и почти се компенсират навън.
            Симетрията дава посоката: полето вътре върви по оста. Избираме правоъгълен контур{" "}
            <RichText text="$abcd$" />: страната <RichText text="$ab$" /> е вътре и по полето,{" "}
            <RichText text="$cd$" /> е далеч отвън, а <RichText text="$bc$" /> и <RichText text="$da$" />{" "}
            са перпендикулярни на <RichText text="$\vec B$" />.
          </p>
          <SolenoidAmpere />
          <div className="mt-5"><Formula latex={String.raw`B\ell=\mu_0(n\ell)I\quad\Longrightarrow\quad\boxed{B\approx\mu_0nI},\qquad n=\frac NL`} /></div>
          <TeacherNote><p>Формулата е приближение: настоявайте върху думите „дълъг“ и „далеч от краищата“. Плъзгачът L е удобен за разграничаване между общия брой N и гъстотата n=N/L. Отбележете, че дължината ℓ на контура се съкращава — затова B не зависи от размера на правоъгълника.</p></TeacherNote>
        </Section>

        <Section id="toroid" n="§7" title="Тороид: соленоид без краища">
          <p className="text-ink/90">
            Огъваме соленоида в затворен пръстен. Симетрията вече е кръгова: B следва концентрични
            окръжности в сърцевината. Амперовият контур обхваща всяка от N-те навивки, затова{" "}
            <RichText text="$I_{\text{обхв}}=NI$" />.
          </p>
          <div className="my-5"><Formula latex={String.raw`B(2\pi r)=\mu_0NI\quad\Longrightarrow\quad\boxed{B(r)=\frac{\mu_0NI}{2\pi r}}`} /></div>
          <ul className="list-disc space-y-2 pl-5 text-ink/90">
            <li>В сърцевината полето намалява като 1/r — вътрешната страна е по-силна.</li>
            <li>В идеалния модел извън тороида обхванатият сумарен ток е нула и полето е почти нулево.</li>
            <li>Затова тороидалните индуктори държат магнитното поле близо до себе си и намаляват смущенията.</li>
          </ul>
        </Section>

        <Section id="limits" n="§8" title="Кога Ампер помага — и кога не">
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

        <Section id="problems" n="§9" title="Практически задачи с водено решение">
          <p className="mb-5 text-ink/90">Четири конфигурации — кабел, ток вътре в дебел проводник, електромагнит и тороид. Първо се избира симетрията и обхванатият ток, после се отключва сметката.</p>
          <AmpereProblemSet />
        </Section>

        <Section id="recap" n="§10" title="Обобщение">
          <div className="rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard">
            <ul className="list-disc space-y-2 pl-5 text-[15.5px] leading-relaxed text-ink/90">
              <li>Изведохме закона, не го приехме: по кръг около прав проводник <RichText text="$B\cdot2\pi r=\mu_0I$" /> — радиусът се съкращава.</li>
              <li>Приносът на всяко парче е <RichText text="$(\mu_0I/2\pi)\,d\varphi$" /> — зависи само от изметения ъгъл, затова <strong>формата на контура е без значение</strong>.</li>
              <li>Общ вид: <RichText text="$\oint\vec B\cdot d\vec l=\mu_0I_{\text{обхв}}$" />; токове извън контура дават нула.</li>
              <li>Прав проводник: <RichText text="$B=\mu_0I/(2\pi r)$" />; дълъг соленоид: <RichText text="$B\approx\mu_0nI$" />; тороид: <RichText text="$B=\mu_0NI/(2\pi r)$" />.</li>
              <li>Законът е винаги верен за стационарни токове, но е изчислително силен само при достатъчна симетрия.</li>
            </ul>
          </div>
          <p className="mt-5 text-ink/90"><strong>Следваща глава:</strong>{" "}<Link href="/physics/magnetizm/lorentz" className="font-semibold text-minus hover:underline">силата на Лоренц</Link> — вече знаем как токовете създават магнитно поле; следва да видим как полето действа върху движещи се заряди и проводници.</p>
        </Section>
      </main>
    </TeacherModeProvider>
  );
}
