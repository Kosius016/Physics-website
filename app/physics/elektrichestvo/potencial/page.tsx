import Formula from "@/components/Formula";
import LessonNav from "@/components/LessonNav";
import RichText from "@/components/RichText";
import Section from "@/components/Section";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChargedSphereGraph, PotentialMap } from "@/components/interactives/PotentialVisualizations";
import { TeacherModeProvider, TeacherModeToggle, TeacherNote } from "@/components/interactives/TeacherMode";

export const metadata = { title: "Електростатичен потенциал · SingularityLab" };

const NAV = [
  { id: "motivation", n: "§1", label: "Защо потенциал" },
  { id: "work", n: "§2", label: "Работа" },
  { id: "definition", n: "§3", label: "Дефиниция" },
  { id: "charges", n: "§4", label: "Заряди" },
  { id: "gradient", n: "§5", label: "Поле и V" },
  { id: "sphere", n: "§6", label: "Сфера" },
  { id: "examples", n: "§7", label: "Примери" },
  { id: "map", n: "§8", label: "Карта" },
  { id: "graph", n: "§9", label: "Графика" },
  { id: "problems", n: "§10", label: "Задачи" },
  { id: "recap", n: "§11", label: "Обобщение" },
] as const;

const Box = ({ title, children, blue = false }: { title: string; children: React.ReactNode; blue?: boolean }) => (
  <div className="my-5 rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard">
    <p className={`mb-2 text-[11px] font-bold uppercase tracking-[.18em] ${blue ? "text-minus" : "text-plus"}`}>{title}</p>
    {children}
  </div>
);

export default function PotentialLessonPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return <TeacherModeProvider><main className="mx-auto max-w-3xl px-5 pb-24">
    <header className="pb-2 pt-11">
      <nav aria-label="Път до урока" className="flex flex-wrap items-center gap-2 text-[12px] font-semibold uppercase tracking-[.22em] text-muted">
        <Link href="/physics" className="rounded-sm transition-colors hover:text-minus focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-minus">Физика</Link>
        <span aria-hidden="true">·</span>
        <Link href="/physics?level=university#electricity" className="rounded-sm transition-colors hover:text-minus focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-minus">Електричество</Link>
        <span aria-hidden="true">·</span>
        <span>Университетско ниво</span>
      </nav>
      <h1 className="mb-2 mt-2 font-serif text-[clamp(34px,7vw,50px)] font-bold leading-[1.08] text-ink">Електростатичен <span className="text-plus">потен</span><span className="text-minus">циал</span></h1>
      <p className="text-[17px] text-muted">От векторното поле E към скаларната функция V — работа, енергия, еквипотенциали и мостът към електрическите вериги.</p>
    </header>
    <LessonNav items={NAV} right={<TeacherModeToggle />} />

    <Section id="motivation" n="§1" title="Защо ни трябва потенциал?">
      <p>Законът на Гаус намира <RichText text="$\vec E$" /> елегантно при висока симетрия. В общия случай обаче полето има три компоненти и се събира векторно. Потенциалът решава три проблема наведнъж:</p>
      <ol className="mt-3 list-decimal space-y-2 pl-5"><li><strong>Скалар вместо вектор:</strong> V е едно число във всяка точка.</li><li><strong>Енергия:</strong> казва каква работа е нужна за преместване на заряд.</li><li><strong>Практика:</strong> напрежението на батерия, ЕКГ и електрическите вериги са потенциални разлики.</li></ol>
      <div className="mt-5 rounded-r-lg border-l-4 border-plus bg-hl px-4 py-3 text-[15.5px]"><strong>Ключова идея:</strong> електростатичното поле е консервативно, затова можем да дефинираме потенциал.</div>
      <TeacherNote>Започнете с контраста „три компоненти срещу едно число“. Попитайте коя величина реално измерва волтметърът.</TeacherNote>
    </Section>

    <Section id="work" n="§2" title="Работа и консервативност на полето">
      <p>Силата върху пробен заряд е <RichText text="$\vec F=q\vec E$" />. Работата на полето от a до b е:</p>
      <div className="mt-4"><Formula latex={String.raw`W_{a\to b}=q\int_a^b \vec E\cdot d\vec l`} /></div>
      <p className="mt-4">В електростатиката резултатът зависи само от началната и крайната точка, не от пътя. Еквивалентно:</p>
      <Box title="Консервативност"><Formula latex={String.raw`\oint \vec E\cdot d\vec l=0 \quad\Longleftrightarrow\quad \nabla\times\vec E=\vec 0`} /></Box>
      <TeacherNote>Нарисувайте два различни пътя между едни и същи точки. Това подготвя интуицията за „височина“ на потенциалния релеф.</TeacherNote>
    </Section>

    <Section id="definition" n="§3" title="Потенциална енергия и потенциал">
      <p>За консервативна сила <RichText text="$\Delta U=-W$" />. Потенциалът е потенциалната енергия на единица пробен заряд.</p>
      <Box title="Дефиниция" blue><Formula latex={String.raw`V(\vec r)=\frac{U(\vec r)}q,\qquad \Delta V=-\int_a^b \vec E\cdot d\vec l`} /><p className="mt-3 text-[15px]">Референтната точка V = 0 е наш избор; за локализирани заряди обикновено е безкрайността.</p></Box>
      <p><RichText text="$1\,\mathrm V=1\,\mathrm{J/C}$" />. Електронволтът е енергията, която електрон придобива при преминаване през 1 V.</p>
      <div className="mt-5 rounded-r-lg border-l-4 border-plus bg-hl px-4 py-3 text-[15.5px]"><strong>Езикова клопка:</strong> V е свойство на полето; <RichText text="$U=qV$" /> е свойство на системата поле + заряд. Отрицателен заряд понижава U, движейки се към по-висок V.</div>
    </Section>

    <Section id="charges" n="§4" title="Точков заряд и суперпозиция">
      <Formula latex={String.raw`V(r)=\frac{kQ}{r},\qquad k=\frac1{4\pi\varepsilon_0}`} />
      <p className="my-4">За много заряди или непрекъснато разпределение:</p>
      <Formula latex={String.raw`V(\vec r)=k\sum_i\frac{q_i}{|\vec r-\vec r_i|},\qquad V(\vec r)=k\int\frac{dq}{|\vec r-\vec r\,'|}`} />
      <p className="mt-4"><strong>Няма компоненти и косинуси:</strong> потенциалите се събират алгебрично. Това е практическата му мощ.</p>
    </Section>

    <Section id="gradient" n="§5" title="Обратната връзка: поле от потенциал">
      <Formula latex={String.raw`\vec E=-\nabla V,\qquad E_r=-\frac{dV}{dr}`} />
      <p className="mt-4">Полето сочи по посоката на най-бързото намаляване на V — „надолу по склона“. Еквипотенциалите са перпендикулярни на силовите линии; движение по тях не изисква работа; колкото са по-гъсти, толкова полето е по-силно.</p>
      <TeacherNote>Аналогията с топографска карта е особено полезна: хоризонтали = еквипотенциали, стръмен склон = силно поле.</TeacherNote>
    </Section>

    <Section id="sphere" n="§6" title="От Гаус към потенциал: заредена сфера">
      <p>За проводникова сфера с радиус R и заряд Q законът на Гаус дава E = 0 вътре и <RichText text="$E=kQ/r^2$" /> отвън. Интегрирането с <RichText text="$V(\infty)=0$" /> дава:</p>
      <div className="mt-4"><Formula latex={String.raw`V(r)=\begin{cases}\dfrac{kQ}{R},&r\le R\\[6pt]\dfrac{kQ}{r},&r\ge R\end{cases}`} /></div>
      <ul className="mt-4 list-disc space-y-2 pl-5"><li>V е непрекъснат дори когато E скача.</li><li>Вътре E = 0, но V не е задължително нула — то е константа.</li><li>Целият проводник е еквипотенциален обем.</li></ul>
    </Section>

    <Section id="examples" n="§7" title="Решени примери">
      <div className="space-y-4">
        <Box title="Пример 1 · Диполна ос"><Formula latex={String.raw`V=kq\left(\frac1{z-a}-\frac1{z+a}\right)=\frac{2kqa}{z^2-a^2}\xrightarrow{z\gg a}\frac{kp}{z^2}`} /><p className="mt-3">Потенциалът на дипола намалява като 1/r², а полето — като 1/r³.</p></Box>
        <Box title="Пример 2 · Сглобяване"><p>За три еднакви заряда във върховете на равностранен триъгълник със страна d събираме енергията на трите двойки:</p><div className="mt-3"><Formula latex={String.raw`U=3\frac{kq^2}{d}`} /></div></Box>
        <Box title="Пример 3 · Електрон"><p>Електрон, ускорен през 100 V, придобива 100 eV и скорост приблизително <RichText text="$5{,}9\times10^6\,\mathrm{m/s}$" />.</p></Box>
      </div>
    </Section>

    <Section id="map" n="§8" title="Карта на потенциала и еквипотенциали"><PotentialMap /></Section>
    <Section id="graph" n="§9" title="Заредена сфера: E(r) срещу V(r)"><ChargedSphereGraph /></Section>

    <Section id="problems" n="§10" title="Задачи за упражнение">
      <div className="space-y-3">
        {[
          ["Загрявка", "Точков заряд Q = 2 nC. Намери V на 3 cm и 6 cm и работата върху q = 1 nC при преместването.", "V₁ ≈ 599 V, V₂ ≈ 300 V; W = q(V₁−V₂) ≈ 3,0×10⁻⁷ J."],
          ["Нулев V ≠ нулево E", "За дипол +q и −q покажи, че в средата V = 0, но E ≠ 0.", "Потенциалите се унищожават като скалари, но двете полета сочат от + към − и се събират."],
          ["Пръстен", "Равномерно зареден пръстен с радиус R и заряд Q: намери V(z) и после E(z).", "V = kQ/√(z²+R²); E_z = kQz/(z²+R²)^(3/2). За z ≫ R получаваме точков заряд."],
          ["Плътна сфера", "За равномерно заредена непроводяща сфера намери V(r) вътре, ако E = kQr/R³.", "V(r) = kQ(3−r²/R²)/(2R), следователно V(0)/V(R) = 3/2."],
        ].map(([title, problem, solution]) => <div key={title} className="rounded-[10px] border-[1.5px] border-ink bg-surface px-4 py-3"><p className="text-[11px] font-bold uppercase tracking-[.15em] text-minus">{title}</p><p className="mt-2">{problem}</p><details className="mt-3 rounded-lg border border-rule px-3 py-2 open:border-ink"><summary className="cursor-pointer font-semibold">Покажи решение</summary><p className="mt-2 text-[15px] text-ink/90">{solution}</p></details></div>)}
      </div>
    </Section>

    <Section id="recap" n="§11" title="Обобщение и какво следва">
      <div className="overflow-x-auto rounded-[10px] border-[1.5px] border-ink bg-surface shadow-hard"><table className="w-full min-w-[560px] border-collapse text-[15px]"><thead className="bg-hl"><tr><th className="p-3 text-left">Величина</th><th className="p-3 text-left">Формула</th><th className="p-3 text-left">Помни</th></tr></thead><tbody className="divide-y divide-rule"><tr><td className="p-3">Разлика в потенциала</td><td className="p-3">ΔV = −∫E·dl</td><td className="p-3">не зависи от пътя</td></tr><tr><td className="p-3">Точков заряд</td><td className="p-3">V = kQ/r</td><td className="p-3">скаларна суперпозиция</td></tr><tr><td className="p-3">Поле от потенциал</td><td className="p-3">E = −∇V</td><td className="p-3">надолу по склона</td></tr><tr><td className="p-3">Енергия</td><td className="p-3">U = qV</td><td className="p-3">зависи и от заряда</td></tr></tbody></table></div>
      <p className="mt-5"><strong>Следва:</strong> <Link href="/physics/elektrichestvo/provodnici" className="font-semibold text-minus hover:underline">проводници в електростатично равновесие</Link>. Досега зарядите бяха неподвижни и поставени на ръка; в метала те се подреждат сами и точно това определя полето.</p>
    </Section>
  </main></TeacherModeProvider>;
}
