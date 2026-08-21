import Link from "next/link";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Formula from "@/components/Formula";
import LessonNav from "@/components/LessonNav";
import Quiz from "@/components/Quiz";
import RichText from "@/components/RichText";
import Section from "@/components/Section";
import type { QuizQuestion } from "@/lib/types";

const PAGE_TITLE = "Електричество и магнетизъм · Голям преговор";
const PAGE_DESCRIPTION =
  "Справочник за целия раздел: дефиниции на величините, законите с условията им, стандартните резултати, стратегии за задачи и самопроверка.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const socialImage = `${protocol}://${host}/og.png`;

  return {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    openGraph: {
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      images: [{ url: socialImage, width: 1680, height: 945, alt: PAGE_TITLE }],
    },
    twitter: {
      card: "summary_large_image",
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      images: [socialImage],
    },
  };
}

const NAV = [
  { id: "map", n: "§1", label: "Карта" },
  { id: "charge", n: "§2", label: "Заряд и поле" },
  { id: "gauss", n: "§3", label: "Гаус" },
  { id: "potential", n: "§4", label: "Потенциал" },
  { id: "conductors", n: "§5", label: "Проводници" },
  { id: "capacitors", n: "§6", label: "Кондензатори" },
  { id: "magnetic", n: "§7", label: "Сила и B" },
  { id: "sources", n: "§8", label: "Източници на B" },
  { id: "induction", n: "§9", label: "Индукция" },
  { id: "inductance", n: "§10", label: "Индуктивност" },
  { id: "circuits", n: "§11", label: "Вериги" },
  { id: "strategy", n: "§12", label: "Стратегии" },
  { id: "reference", n: "§13", label: "Справочник" },
  { id: "check", n: "§14", label: "Проверка" },
] as const;

/* ------------------------------------------------------------------ */
/* Малки презентационни блокчета, локални за този справочник           */
/* ------------------------------------------------------------------ */

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border-[1.5px] border-minus bg-minus/10 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide text-minus">
      {children}
    </span>
  );
}

function Card({
  title,
  children,
  tone = "blue",
}: {
  title: string;
  children: React.ReactNode;
  tone?: "blue" | "red" | "green";
}) {
  const color = tone === "red" ? "text-plus" : tone === "green" ? "text-ok" : "text-minus";
  return (
    <div className="min-w-0 rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard-sm">
      <p className={`mb-2 text-[11px] font-bold uppercase tracking-[.16em] ${color}`}>{title}</p>
      {children}
    </div>
  );
}

/** Дефиниция на физична величина: символ, име, вид, единица и смисъл. */
function Def({
  sym,
  name,
  kind,
  unit,
  children,
}: {
  sym: string;
  name: string;
  kind: "скалар" | "вектор" | "безразмерна";
  unit: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-[10px] border-[1.5px] border-ink bg-surface px-4 py-3.5 shadow-hard-sm">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-[19px] font-bold text-minus">
          <RichText text={sym} />
        </span>
        <span className="font-serif text-[17px] font-bold leading-tight">{name}</span>
        <span className="ml-auto whitespace-nowrap rounded-full border border-rule px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-muted">
          {kind} · <RichText text={unit} />
        </span>
      </div>
      <p className="mt-2 text-[14.5px] leading-relaxed text-ink/90">{children}</p>
    </div>
  );
}

/** Закон с формула, съдържание и граници на приложимост. */
function Law({
  title,
  latex,
  says,
  when,
}: {
  title: string;
  latex: string;
  says: string;
  when: string;
}) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[.16em] text-plus">{title}</p>
      <Formula latex={latex} />
      <div className="mt-2.5 space-y-1.5 text-[14.5px] leading-relaxed">
        <p>
          <strong>Какво казва:</strong> <RichText text={says} />
        </p>
        <p className="text-muted">
          <strong className="text-ink">Кога важи:</strong> <RichText text={when} />
        </p>
      </div>
    </div>
  );
}

/** Таблица със справочни редове; всяка клетка минава през RichText. */
function DataTable({
  head,
  rows,
  minWidth = 640,
}: {
  head: string[];
  rows: readonly (readonly string[])[];
  minWidth?: number;
}) {
  return (
    <div className="overflow-x-auto rounded-[10px] border-[1.5px] border-ink bg-surface shadow-hard-sm">
      <table
        className="w-full border-collapse text-[14px]"
        style={{ minWidth: `${minWidth}px` }}
      >
        <thead className="bg-hl">
          <tr>
            {head.map((h) => (
              <th key={h} className="p-3 text-left font-bold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-rule">
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, i) => (
                <td key={i} className={i === 0 ? "p-3 font-semibold" : "p-3"}>
                  <RichText text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Note({ children, tone = "blue" }: { children: React.ReactNode; tone?: "blue" | "red" }) {
  const border = tone === "red" ? "border-plus bg-plus/10" : "border-minus bg-hl";
  return (
    <div className={`mt-4 rounded-r-lg border-l-4 px-4 py-3 text-[15px] leading-relaxed ${border}`}>
      {children}
    </div>
  );
}

function FullLessonLinks({
  lessons,
}: {
  lessons: readonly { href: string; title: string }[];
}) {
  return (
    <aside className="mb-5 flex flex-wrap items-center gap-2 rounded-[10px] border border-rule bg-hl px-3.5 py-3">
      <span className="mr-1 text-[10.5px] font-bold uppercase tracking-[.16em] text-muted">
        {lessons.length === 1 ? "Пълен урок" : "Пълни уроци"}
      </span>
      <nav aria-label="Пълни уроци към секцията" className="flex flex-wrap gap-2">
        {lessons.map((lesson) => (
          <Link
            key={lesson.href}
            href={lesson.href}
            className="rounded-full border-[1.5px] border-minus bg-surface px-3 py-1.5 text-[12.5px] font-bold text-minus transition-colors hover:bg-minus hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-minus"
          >
            {lesson.title} <span aria-hidden="true">→</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-8 font-serif text-[21px] font-bold">{children}</h3>;
}

/* ------------------------------------------------------------------ */
/* Справочни данни                                                     */
/* ------------------------------------------------------------------ */

const CONTRAST_ROWS = [
  [
    "Кой го създава",
    "Всеки електричен заряд, в покой или в движение",
    "Само движещи се заряди: токове и магнитни моменти",
  ],
  [
    "Поток през затворена повърхност",
    String.raw`$\oint\vec E\cdot d\vec A=Q_{\text{вътр}}/\varepsilon_0$`,
    String.raw`$\oint\vec B\cdot d\vec A=0$ (няма магнитни заряди)`,
  ],
  [
    "Циркулация по затворен контур",
    String.raw`$\oint\vec E\cdot d\vec l=-\,d\Phi_B/dt$; нула в статиката`,
    String.raw`$\oint\vec B\cdot d\vec l=\mu_0I_{\text{обхв}}$`,
  ],
  [
    "Сила върху заряд",
    String.raw`$q\vec E$, по посока на полето`,
    String.raw`$q\vec v\times\vec B$, перпендикулярна на $\vec v$ и на $\vec B$`,
  ],
  [
    "Работа върху заряд",
    "Върши работа; в статиката има потенциал $V$",
    "Не върши работа; няма скаларен потенциал",
  ],
  [
    "Плътност на енергията",
    String.raw`$u_E=\tfrac12\varepsilon_0 E^2$`,
    String.raw`$u_B=\frac{1}{2\mu_0}B^2$`,
  ],
] as const;

const E_FIELD_ROWS = [
  [
    "Точков заряд",
    String.raw`$E=\dfrac{kq}{r^2}$`,
    "Радиално; същото и извън сферично симетрично разпределение",
  ],
  [
    "Ос на заредено кръгче",
    String.raw`$E_x=\dfrac{kqx}{(x^2+R^2)^{3/2}}$`,
    "В центъра дава нула; далече преминава в точков заряд",
  ],
  [
    "Безкрайна права нишка",
    String.raw`$E=\dfrac{\lambda}{2\pi\varepsilon_0r}$`,
    "Спада като $1/r$, не като $1/r^2$",
  ],
  [
    "Безкрайна равнина",
    String.raw`$E=\dfrac{\sigma}{2\varepsilon_0}$`,
    "Не зависи от разстоянието; важи близо до крайна равнина",
  ],
  [
    "Две противоположни равнини",
    String.raw`$E=\dfrac{\sigma}{\varepsilon_0}$`,
    "Само между плочите; отвън полетата се компенсират",
  ],
  [
    "Проводяща повърхност, отвън",
    String.raw`$E=\dfrac{\sigma}{\varepsilon_0}$`,
    "Перпендикулярно на повърхността, непосредствено до нея",
  ],
  [
    "Заредена сферична обвивка",
    String.raw`$E=0$ вътре, $E=kQ/r^2$ вън`,
    "Скок точно на повърхността",
  ],
  [
    "Равномерно заредена плътна сфера",
    String.raw`$E=\dfrac{\rho r}{3\varepsilon_0}=\dfrac{kQr}{R^3}$`,
    "Расте линейно от центъра вътре в сферата",
  ],
] as const;

const B_FIELD_ROWS = [
  [
    "Безкраен прав проводник",
    String.raw`$B=\dfrac{\mu_0I}{2\pi r}$`,
    "Концентрични окръжности около проводника",
  ],
  [
    "Краен прав проводник",
    String.raw`$B=\dfrac{\mu_0I}{4\pi a}(\sin\theta_1+\sin\theta_2)$`,
    String.raw`$\theta_i$ се мерят от перпендикуляра към двата края`,
  ],
  [
    "Кръгова дъга в центъра",
    String.raw`$B=\dfrac{\mu_0I\theta}{4\pi a}$`,
    String.raw`$\theta$ е в радиани; радиалните участъци дават нула`,
  ],
  [
    "Център на кръгов контур",
    String.raw`$B=\dfrac{\mu_0NI}{2a}$`,
    String.raw`Частен случай при $\theta=2\pi$`,
  ],
  [
    "Ос на кръгов контур",
    String.raw`$B_x=\dfrac{\mu_0Ia^2}{2(a^2+x^2)^{3/2}}$`,
    "Далече по оста се държи като магнитен дипол",
  ],
  [
    "Дълъг соленоид",
    String.raw`$B=\mu_0nI$, $n=N/\ell$`,
    "Вътре и далече от краищата; отвън приблизително нула",
  ],
  [
    "Тороид",
    String.raw`$B=\dfrac{\mu_0NI}{2\pi r}$`,
    "Само в кухината; зависи от радиуса на обхода",
  ],
  [
    "Два успоредни проводника",
    String.raw`$\dfrac FL=\dfrac{\mu_0I_1I_2}{2\pi d}$`,
    "Еднакви посоки се привличат, противоположни се отблъскват",
  ],
] as const;

const CAPACITOR_ROWS = [
  ["Плосък", String.raw`$C=\dfrac{\varepsilon_0A}{d}$`, "Пренебрегваме краищата"],
  ["Плосък с диелектрик", String.raw`$C=\dfrac{\varepsilon_r\varepsilon_0A}{d}$`, "Пълно запълване"],
  [
    "Сферичен",
    String.raw`$C=\dfrac{4\pi\varepsilon_0R_1R_2}{R_2-R_1}$`,
    "Концентрични сфери",
  ],
  [
    "Цилиндричен",
    String.raw`$C=\dfrac{2\pi\varepsilon_0\ell}{\ln(b/a)}$`,
    String.raw`Дълъг коаксиален кабел, $\ell\gg b$`,
  ],
  ["Изолирана сфера", String.raw`$C=4\pi\varepsilon_0R$`, String.raw`Отчита се спрямо $V(\infty)=0$`],
] as const;

const QUANTITY_ROWS = [
  ["Заряд", "$q$, $Q$", String.raw`$\mathrm C$`, "Мярка за участие в електромагнитно взаимодействие"],
  [
    "Електрично поле",
    String.raw`$\vec E$`,
    String.raw`$\mathrm{N/C}=\mathrm{V/m}$`,
    "Сила на единица пробен заряд",
  ],
  [
    "Електричен поток",
    String.raw`$\Phi_E$`,
    String.raw`$\mathrm{N\,m^2/C}$`,
    "Колко поле пресича дадена повърхност",
  ],
  ["Потенциал", "$V$", String.raw`$\mathrm V=\mathrm{J/C}$`, "Потенциална енергия на единица заряд"],
  ["Капацитет", "$C$", String.raw`$\mathrm F=\mathrm{C/V}$`, "Заряд на единица потенциална разлика"],
  [
    "Диелектрична проницаемост",
    String.raw`$\varepsilon_r$`,
    "1",
    "Колко пъти средата отслабва полето на дадени свободни заряди",
  ],
  ["Ток", "$I$", String.raw`$\mathrm A$`, "Заряд, преминаващ през сечение за единица време"],
  [
    "Плътност на тока",
    String.raw`$\vec j$`,
    String.raw`$\mathrm{A/m^2}$`,
    "Ток на единица напречна площ",
  ],
  ["Съпротивление", "$R$", String.raw`$\Omega$`, "Напрежение на единица ток през елемента"],
  [
    "Магнитна индукция",
    String.raw`$\vec B$`,
    String.raw`$\mathrm T=\mathrm{N/(A\,m)}$`,
    "Поле, дефинирано чрез силата върху движещ се заряд",
  ],
  [
    "Магнитен поток",
    String.raw`$\Phi_B$`,
    String.raw`$\mathrm{T\,m^2}$`,
    "Колко магнитно поле пресича дадена повърхност",
  ],
  [
    "Магнитен момент",
    String.raw`$\vec\mu$`,
    String.raw`$\mathrm{A\,m^2}$`,
    "Мярка колко силен магнит е един токов контур",
  ],
  [
    "ЕДН",
    String.raw`$\mathcal E$`,
    String.raw`$\mathrm V$`,
    "Работа на несторонни за електростатиката сили на единица заряд",
  ],
  [
    "Индуктивност",
    "$L$",
    String.raw`$\mathrm H=\mathrm{V\,s/A}$`,
    "Собствен поточен обхват на единица собствен ток",
  ],
  [
    "Взаимна индуктивност",
    "$M$",
    String.raw`$\mathrm H$`,
    "Поток през втората намотка на единица ток в първата",
  ],
  [
    "Плътност на енергията",
    "$u$",
    String.raw`$\mathrm{J/m^3}$`,
    "Енергия на единица обем, съхранена в полето",
  ],
] as const;

const CONSTANT_ROWS = [
  ["Елементарен заряд", String.raw`$e=1{,}602\times10^{-19}\,\mathrm C$`],
  ["Проницаемост на вакуума", String.raw`$\varepsilon_0=8{,}854\times10^{-12}\,\mathrm{F/m}$`],
  ["Константа на Кулон", String.raw`$k=\dfrac{1}{4\pi\varepsilon_0}=8{,}99\times10^{9}\,\mathrm{N\,m^2/C^2}$`],
  ["Магнитна константа", String.raw`$\mu_0=4\pi\times10^{-7}\,\mathrm{H/m}=1{,}257\times10^{-6}$`],
  [
    "Удобна форма",
    String.raw`$\dfrac{\mu_0}{4\pi}=10^{-7}\,\mathrm{T\,m/A}$`,
  ],
  ["Маса на електрона", String.raw`$m_e=9{,}11\times10^{-31}\,\mathrm{kg}$`],
  ["Електронволт", String.raw`$1\,\mathrm{eV}=1{,}602\times10^{-19}\,\mathrm J$`],
  ["Скорост на светлината", String.raw`$c=1/\sqrt{\varepsilon_0\mu_0}=3{,}00\times10^{8}\,\mathrm{m/s}$`],
] as const;

const MISTAKES = [
  "Полето е вектор, потенциалът е скалар. Полетата се събират по компоненти, потенциалите се събират алгебрично.",
  "$E=0$ не означава $V=0$, и обратно. В центъра между два еднакви заряда полето е нула, а потенциалът не е.",
  "Пред проводяща повърхност полето е $\\sigma/\\varepsilon_0$, а пред тънка заредена равнина е $\\sigma/(2\\varepsilon_0)$. Двете не се смесват.",
  "Гаусовата повърхност винаги дава верен резултат, но е полезна само при симетрия, която изважда $E$ пред интеграла.",
  "При последователно свързани кондензатори общ е зарядът, не напрежението.",
  "Забравя се въпросът дали батерията е свързана. Той решава кое е постоянно: $\\Delta V$ или $Q$.",
  "Магнитната сила не върши работа. Тя променя посоката на скоростта, не големината ѝ.",
  "Ъгълът в $\\Phi_B=BA\\cos\\theta$ се мери спрямо нормалата към площта, не спрямо самата повърхност.",
  "Знакът на Ленц се отнася до промяната на потока, а не до самия поток.",
  "Индукторът се противопоставя на промяната на тока, а не на тока. При установен режим той е обикновена жица.",
  "Единиците не се превръщат: $\\mathrm{cm^2}\\to\\mathrm{m^2}$ е делене на $10^4$, а не на $10^3$.",
  "Токът $I_{\\text{обхв}}$ в закона на Ампер се брои със знак според ориентацията на контура.",
] as const;

const REVIEW_QUIZ: QuizQuestion[] = [
  {
    question:
      "Затворена повърхност обхваща нулев пълен заряд, но наблизо има външен точков заряд. Какво следва за полето по повърхността?",
    options: [
      {
        text: "Потокът е нула, но полето по повърхността не е",
        correct: true,
        why: "Законът на Гаус ограничава само сумата $\\oint\\vec E\\cdot d\\vec A$. Външният заряд внася поле, което влиза от едната страна и излиза от другата, затова нетният поток е нула.",
      },
      {
        text: "И потокът, и полето са нула навсякъде по повърхността",
        correct: false,
        why: "Полето е сума от приносите на всички заряди, включително външните. Нулев поток не означава нулево поле.",
      },
      {
        text: "Потокът зависи от разстоянието до външния заряд",
        correct: false,
        why: "Приносът на всеки външен заряд към потока през затворена повърхност е точно нула, независимо колко е близо.",
      },
    ],
    explanation:
      "Затова законът на Гаус дава $E$ само когато симетрията позволява $E$ да бъде изнесено пред интеграла.",
  },
  {
    question:
      "Плосък кондензатор е откачен от батерията. Разстоянието между плочите се удвоява. Какво става с енергията $U$?",
    options: [
      {
        text: "Удвоява се",
        correct: true,
        why: "При откачен кондензатор $Q$ е постоянен. Удвояването на $d$ намалява $C$ двойно, а $U=Q^2/(2C)$ се удвоява. Работата идва от външната сила, която раздалечава плочите срещу привличането им.",
      },
      {
        text: "Намалява двойно",
        correct: false,
        why: "Това би било вярно при свързана батерия, където $\\Delta V$ е фиксирано и $U=C(\\Delta V)^2/2$ следва намаляването на $C$.",
      },
      {
        text: "Не се променя, защото зарядът е постоянен",
        correct: false,
        why: "Постоянният заряд не означава постоянна енергия: $U=Q^2/(2C)$ зависи и от капацитета, който се променя с геометрията.",
      },
    ],
  },
  {
    question:
      "Електрон влиза перпендикулярно в еднородно магнитно поле. Как се променя кинетичната му енергия?",
    options: [
      {
        text: "Не се променя",
        correct: true,
        why: "Силата $q\\vec v\\times\\vec B$ е винаги перпендикулярна на скоростта, затова мощността ѝ е $\\vec F\\cdot\\vec v=0$ и работата е нула. Променя се само посоката.",
      },
      {
        text: "Расте, защото силата ускорява електрона",
        correct: false,
        why: "Ускорението наистина е ненулево, но е центростремително. То върти вектора на скоростта, без да мени големината му.",
      },
      {
        text: "Намалява, защото полето спира заряда",
        correct: false,
        why: "Магнитното поле не отнема енергия на един заряд. Забавяне се получава само при наличие на електрично поле или на съпротивителна среда.",
      },
    ],
    explanation:
      "Затова траекторията е окръжност с радиус $r=mv_\\perp/(|q|B)$ и период $T=2\\pi m/(|q|B)$, независещ от скоростта.",
  },
  {
    question:
      "Магнит пада с южния полюс надолу през хоризонтален меден пръстен. Каква е посоката на индуцирания ток, гледано отгоре, докато магнитът се приближава?",
    options: [
      {
        text: "Такава, че пръстенът да отблъсква магнита",
        correct: true,
        why: "Ленц: индуцираният ток се противопоставя на увеличаването на потока, затова обърнатата към магнита страна на пръстена става едноименен полюс и го спира. Иначе енергията нямаше да се запазва.",
      },
      {
        text: "Такава, че пръстенът да привлича магнита",
        correct: false,
        why: "Привличането би ускорило падането и би произвело още повече ток. Това е вечен двигател, който противоречи на запазването на енергията.",
      },
      {
        text: "Ток не тече, защото полето е постоянно",
        correct: false,
        why: "Полето на магнита е постоянно във времето, но потокът през пръстена расте, докато магнитът се приближава. Индукцията реагира на промяната на потока.",
      },
    ],
  },
  {
    question:
      "Права рамка се движи с постоянна скорост изцяло вътре в голяма област с еднородно поле $\\vec B$. Тече ли индуциран ток?",
    options: [
      {
        text: "Не, защото потокът не се променя",
        correct: true,
        why: "Полето е еднородно, площта и ориентацията не се менят, затова $\\Phi_B=BA\\cos\\theta$ е константа и $d\\Phi_B/dt=0$. ЕДН от двете противоположни страни се компенсират.",
      },
      {
        text: "Да, защото проводникът се движи в магнитно поле",
        correct: false,
        why: "Движението поражда двигателно ЕДН във всяка страна, но приносите на противоположните страни са равни и се компенсират в затворения контур.",
      },
      {
        text: "Да, но само докато рамката ускорява",
        correct: false,
        why: "Индукцията зависи от скоростта на промяна на потока, не от ускорението. При непроменен поток няма ЕДН независимо от ускорението.",
      },
    ],
    explanation: "Ток се появява само при пресичане на границата на полето, когато потокът се променя.",
  },
  {
    question:
      "В последователна $RL$ верига ключът се затваря в момента $t=0$. Какъв е токът непосредствено след това?",
    options: [
      {
        text: "Нула",
        correct: true,
        why: "Токът през индуктор не може да скочи, защото това би изисквало безкрайно $dI/dt$ и безкрайно ЕДН. Токът тръгва от нула и расте с време $\\tau=L/R$.",
      },
      {
        text: "$\\mathcal E/R$",
        correct: false,
        why: "Това е стойността при установен режим, след няколко времеконстанти, когато $dI/dt\\to0$ и индукторът вече не се съпротивлява.",
      },
      {
        text: "$\\mathcal E/(R+\\omega L)$",
        correct: false,
        why: "Изразът смесва преходния процес при постоянно напрежение с реактивно съпротивление при променлив ток. Тук няма честота.",
      },
    ],
  },
  {
    question:
      "Соленоид има $N$ навивки. Ако удвоим само броя на навивките при непроменени дължина и сечение, как се променя индуктивността?",
    options: [
      {
        text: "Нараства четири пъти",
        correct: true,
        why: "$L=\\mu_0N^2A/\\ell$. Единият множител $N$ идва от по-силното поле, вторият от повече навивки, през които този поток минава.",
      },
      {
        text: "Удвоява се",
        correct: false,
        why: "Това отчита само нарастването на потока или само броя на навивките, но не и двата ефекта едновременно.",
      },
      {
        text: "Не се променя, защото зависи само от геометрията",
        correct: false,
        why: "$L$ наистина зависи само от геометрията и средата, но броят навивки е част от геометрията.",
      },
    ],
  },
  {
    question:
      "Дълъг прав проводник е обхванат от амперов контур с формата на неправилна затворена крива. Колко е $\\oint\\vec B\\cdot d\\vec l$?",
    options: [
      {
        text: "$\\mu_0I$, независимо от формата",
        correct: true,
        why: "Циркулацията зависи само от обхванатия ток. Формата и размерът на контура не влизат в резултата, стига проводникът да е вътре.",
      },
      {
        text: "Зависи от разстоянието до проводника",
        correct: false,
        why: "Полето наистина зависи от разстоянието като $1/r$, но по-дългият път точно компенсира по-слабото поле.",
      },
      {
        text: "Нула, защото контурът не е окръжност",
        correct: false,
        why: "Нула се получава само когато контурът не обхваща ток. Формата няма значение за стойността на циркулацията.",
      },
    ],
    explanation:
      "Законът на Ампер е винаги верен. Полезен е обаче само когато симетрията прави $B$ постоянно по контура.",
  },
  {
    question:
      "Плосък кондензатор остава свързан към батерия. Вкарваме диелектрик докрай. Какво става с полето между плочите?",
    options: [
      {
        text: "Остава непроменено",
        correct: true,
        why: "Батерията фиксира $\\Delta V$, разстоянието $d$ не се променя, затова $E=\\Delta V/d$ е същото. Батерията донася допълнителен свободен заряд, който компенсира поляризацията.",
      },
      {
        text: "Намалява $\\varepsilon_r$ пъти",
        correct: false,
        why: "Това е резултатът при откачен кондензатор, където $Q$ е фиксиран и поляризацията няма как да бъде компенсирана.",
      },
      {
        text: "Нараства $\\varepsilon_r$ пъти",
        correct: false,
        why: "Диелектрикът винаги отслабва или запазва полето при дадени свободни заряди. Той никога не го усилва.",
      },
    ],
  },
  {
    question:
      "Кое от следните е дефиниция, а не изведен резултат?",
    options: [
      {
        text: "$C=Q/\\Delta V$",
        correct: true,
        why: "Капацитетът се дефинира като отношение. Че то не зависи от заряда е нетривиално твърдение, което следва от линейността на електростатиката.",
      },
      {
        text: "$C=\\varepsilon_0A/d$",
        correct: false,
        why: "Това е изведен резултат за конкретна геометрия: поле $\\sigma/\\varepsilon_0$, напрежение $Ed$ и после отношението $Q/\\Delta V$.",
      },
      {
        text: "$B=\\mu_0nI$",
        correct: false,
        why: "Изведен резултат от закона на Ампер за дълъг соленоид, при пренебрегнати краеви ефекти.",
      },
    ],
    explanation:
      "Разделянето на дефиниции, закони и изведени резултати е най-бързият начин да се разбере какво трябва да се помни и какво може да се възстанови.",
  },
];

/* ------------------------------------------------------------------ */

export default function ElectromagnetismCheatSheet() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-24">
      <header className="pb-2 pt-11">
        <nav
          aria-label="Път до материала"
          className="flex flex-wrap items-center gap-2 text-[12px] font-semibold uppercase tracking-[.2em] text-muted"
        >
          <Link
            href="/materiali"
            className="rounded-sm transition-colors hover:text-minus focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-minus"
          >
            Материали
          </Link>
          <span aria-hidden="true">·</span>
          <span>Физика · Електричество и магнетизъм</span>
        </nav>
        <div className="mt-3 flex flex-wrap gap-2">
          <Tag>Преговор на целия раздел</Tag>
          <Tag>Дефиниции и условия</Tag>
          <Tag>40-50 мин</Tag>
        </div>
        <h1 className="mb-3 mt-4 font-serif text-[clamp(36px,7vw,52px)] font-bold leading-[1.04] text-ink">
          <span className="text-plus">Електричество</span> и{" "}
          <span className="text-minus">магнетизъм</span>: голям справочник
        </h1>
        <p className="text-[17px] text-muted">
          Всички величини с дефинициите им, законите с условията за приложимост, стандартните
          резултати, стратегиите за задачи и типичните грешки.
        </p>
      </header>

      <LessonNav items={NAV} />

      {/* ---------------------------------------------------------- */}
      <Section id="map" n="§1" title="Картата: две полета, шест въпроса">
        <p>
          Целият раздел се държи от една схема. Има две полета. За всяко от тях задаваме едни и
          същи въпроси и получаваме сдвоени отговори. Ако тази таблица е усвоена, останалите
          секции са само подробностите.
        </p>

        <div className="mt-5">
          <DataTable
            head={["Въпрос", "Електрично поле", "Магнитно поле"]}
            rows={CONTRAST_ROWS}
            minWidth={720}
          />
        </div>

        <Note>
          <strong>Червената нишка:</strong> полето е посредник. Зарядите не си действат от
          разстояние: единият заряд създава поле, полето действа на другия. Затова всяка задача
          се разделя на две стъпки, а не се решава наведнъж.
        </Note>

        <SubTitle>Трите блока на раздела</SubTitle>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Card title="Електростатика">
            <p className="text-[14.5px]">
              Неподвижни заряди. Полето се смята чрез суперпозиция или чрез Гаус, енергията се
              описва с потенциал. Веществото влиза през проводници и диелектрици.
            </p>
          </Card>
          <Card title="Магнитостатика" tone="red">
            <p className="text-[14.5px]">
              Постоянни токове. Био-Савар събира приноси, Ампер използва симетрия, силата на
              Лоренц описва обратното действие върху заряди и проводници.
            </p>
          </Card>
          <Card title="Индукция" tone="green">
            <p className="text-[14.5px]">
              Променящ се поток. Фарадей свързва двете полета, Ленц дава знака, индуктивността
              превръща ефекта в свойство на елемент от веригата.
            </p>
          </Card>
        </div>

        <SubTitle>Как да четете формулите</SubTitle>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <Card title="Дефиниция">
            <p className="text-[14.5px]">
              Въвежда нова величина чрез вече известни. Не се доказва, а се приема:{" "}
              <RichText text="$\vec E=\vec F/q_0$" />, <RichText text="$C=Q/\Delta V$" />,{" "}
              <RichText text="$L=N\Phi_B/I$" />.
            </p>
          </Card>
          <Card title="Закон" tone="red">
            <p className="text-[14.5px]">
              Твърдение за природата, проверявано с опит: Кулон, Гаус, Ампер, Фарадей. Има
              условия за приложимост, които трябва да се знаят наизуст.
            </p>
          </Card>
          <Card title="Изведен резултат" tone="green">
            <p className="text-[14.5px]">
              Следствие за конкретна геометрия: <RichText text="$C=\varepsilon_0A/d$" />,{" "}
              <RichText text="$B=\mu_0nI$" />. Може да се възстанови, ако се забрави.
            </p>
          </Card>
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      <Section id="charge" n="§2" title="Заряд и електростатично поле">
        <div className="grid gap-4">
          <Def sym="$q$" name="Електричен заряд" kind="скалар" unit="$\mathrm C$">
            Мярка за това колко силно едно тяло участва в електромагнитното взаимодействие.
            Квантуван е: <RichText text="$q=ne$" /> с{" "}
            <RichText text="$e=1{,}602\times10^{-19}\,\mathrm C$" />. Запазва се в затворена
            система и е адитивен: пълният заряд е алгебричната сума на съставните.
          </Def>
          <Def
            sym={String.raw`$\lambda,\ \sigma,\ \rho$`}
            name="Плътности на заряда"
            kind="скалар"
            unit={String.raw`$\mathrm{C/m},\ \mathrm{C/m^2},\ \mathrm{C/m^3}$`}
          >
            Заряд на единица дължина, площ и обем. Използват се, когато зарядът е разпределен
            непрекъснато: <RichText text="$dq=\lambda\,dl$" />, <RichText text="$dq=\sigma\,dS$" />,{" "}
            <RichText text="$dq=\rho\,dV$" />.
          </Def>
          <Def sym={String.raw`$\vec E$`} name="Интензитет на електричното поле" kind="вектор" unit={String.raw`$\mathrm{V/m}$`}>
            Сила, която би действала на единичен положителен пробен заряд, поставен в дадена
            точка: <RichText text="$\vec E=\vec F/q_0$" />. Полето е свойство на пространството
            и съществува независимо от това дали има пробен заряд. Пробният заряд се смята за
            толкова малък, че не размества източниците.
          </Def>
        </div>

        <SubTitle>Законът на Кулон</SubTitle>
        <div className="mt-3">
          <Law
            title="Закон на Кулон"
            latex={String.raw`\vec F_{12}=\frac{1}{4\pi\varepsilon_0}\frac{q_1q_2}{r^2}\,\hat r_{12},
            \qquad k=\frac{1}{4\pi\varepsilon_0}\approx8{,}99\times10^{9}`}
            says="Силата между два заряда е по правата, която ги свързва, пропорционална е на произведението на зарядите и спада с квадрата на разстоянието. Знакът на $q_1q_2$ дава привличане или отблъскване."
            when="За точкови заряди в покой, или за сферично симетрични разпределения, гледани отвън. Във вещество се използва $\varepsilon=\varepsilon_r\varepsilon_0$ вместо $\varepsilon_0$."
          />
        </div>

        <Note>
          <strong>Принцип на суперпозицията:</strong> полето на няколко заряда е{" "}
          <em>векторната</em> сума на отделните полета, <RichText text="$\vec E=\sum_i\vec E_i$" />.
          Всеки заряд създава своето поле така, сякаш другите ги няма. Това е причината цялата
          електростатика да се свежда до интеграли.
        </Note>

        <SubTitle>Непрекъснато разпределение: работният алгоритъм</SubTitle>
        <div className="mt-3">
          <Formula
            latex={String.raw`d\vec E=\frac{1}{4\pi\varepsilon_0}\frac{dq}{r^2}\,\hat r,
            \qquad \vec E=\int d\vec E`}
          />
        </div>
        <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-[15px]">
          <li>Изберете елемент <RichText text="$dq$" /> и изразете заряда му през плътността.</li>
          <li>Запишете разстоянието <RichText text="$r$" /> до точката като функция на променливата на интегриране.</li>
          <li>
            Разложете <RichText text="$d\vec E$" /> по компоненти и потърсете симетрия: коя
            компонента се самокомпенсира?
          </li>
          <li>Интегрирайте само оцелялата компонента.</li>
          <li>Проверете граничния случай: отдалеч всяко ограничено тяло изглежда като точков заряд.</li>
        </ol>

        <SubTitle>
          Стандартни резултати за <RichText text="$E$" />
        </SubTitle>
        <div className="mt-4">
          <DataTable head={["Конфигурация", "Поле", "Забележка"]} rows={E_FIELD_ROWS} minWidth={680} />
        </div>

        <SubTitle>Силови линии</SubTitle>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[15px]">
          <li>Започват от положителни заряди и завършват в отрицателни или в безкрайност.</li>
          <li>Допирателната във всяка точка дава посоката на <RichText text="$\vec E$" />, а гъстотата им дава големината.</li>
          <li>Никога не се пресичат: в дадена точка полето има една посока.</li>
          <li>Пресичат перпендикулярно еквипотенциалните повърхности.</li>
        </ul>

        <SubTitle>Електричен дипол</SubTitle>
        <p className="mt-2">
          Двойка равни по големина и противоположни заряди на разстояние <RichText text="$d$" />{" "}
          образува дипол с момент <RichText text="$\vec p=q\vec d$" />, насочен от минуса към
          плюса. Този модел се повтаря буквално при магнитния момент в §7, затова си струва да се
          запомни като двойка.
        </p>
        <div className="mt-3">
          <Formula
            latex={String.raw`\vec p=q\vec d,\qquad \vec\tau=\vec p\times\vec E,\qquad U=-\vec p\cdot\vec E`}
          />
        </div>
        <p className="mt-3 text-[15px]">
          В еднородно поле резултантната сила върху дипола е нула, но моментът го завърта към
          посоката на полето. Точно това правят молекулите в диелектрика (§6).
        </p>
      </Section>

      {/* ---------------------------------------------------------- */}
      <Section id="gauss" n="§3" title="Поток и закон на Гаус">
        <Def sym={String.raw`$\Phi_E$`} name="Поток на електричното поле" kind="скалар" unit={String.raw`$\mathrm{N\,m^2/C}$`}>
          Мярка за това колко от полето пресича дадена повърхност:{" "}
          <RichText text="$\Phi_E=\int_S\vec E\cdot d\vec S$" />. Векторът{" "}
          <RichText text="$d\vec S$" /> е перпендикулярен на повърхността, затова полето,
          плъзгащо се успоредно на нея, не дава принос. Нагледно: брой силови линии, минаващи
          през повърхността, взети със знак.
        </Def>

        <div className="mt-5">
          <Law
            title="Закон на Гаус"
            latex={String.raw`\oint_S\vec E\cdot d\vec S=\frac{Q_{\text{вътр}}}{\varepsilon_0}`}
            says="Пълният поток през затворена повърхност зависи само от заряда вътре в нея. Външните заряди дават поле по повърхността, но нулев нетен поток: колкото линии влизат, толкова излизат."
            when="Винаги. Това е един от законите на Максуел. Полезен за смятане обаче е само при симетрия, която прави $E$ постоянно по повърхността."
          />
        </div>

        <SubTitle>Кога Гаус спестява работа</SubTitle>
        <p className="mt-2">
          Трикът е <RichText text="$E$" /> да излезе пред интеграла. Това става само при три
          симетрии, за които може да се построи повърхност с постоянно{" "}
          <RichText text="$E$" /> и постоянен ъгъл.
        </p>
        <div className="mt-4">
          <DataTable
            head={["Симетрия", "Гаусова повърхност", "Резултат"]}
            rows={[
              [
                "Сферична",
                "Концентрична сфера",
                String.raw`$E\cdot4\pi r^2=Q_{\text{вътр}}/\varepsilon_0$`,
              ],
              [
                "Цилиндрична",
                String.raw`Съосен цилиндър с дължина $\ell$`,
                String.raw`$E\cdot2\pi r\ell=\lambda\ell/\varepsilon_0$`,
              ],
              [
                "Равнинна",
                "Кутийка, пронизваща равнината",
                String.raw`$E\cdot2A=\sigma A/\varepsilon_0$`,
              ],
            ]}
            minWidth={620}
          />
        </div>

        <Note tone="red">
          <strong>Честа грешка:</strong> пише се <RichText text="$\Phi=EA$" /> без проверка.
          Това важи само ако <RichText text="$E$" /> е еднакво по цялата повърхност{" "}
          <em>и</em> е перпендикулярно на нея. При произволна форма остава интегралът.
        </Note>

        <SubTitle>Алгоритъм за многослойна сферична задача</SubTitle>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[15px]">
          <li>Разделете пространството на области според всички радиуси на границите.</li>
          <li>
            За всяка област намерете <RichText text="$Q_{\text{вътр}}(r)$" />, като включите и
            индуцираните заряди по проводящите повърхности.
          </li>
          <li>Приложете Гаус поотделно във всяка област.</li>
          <li>Проверете, че вътре в проводящ материал получавате нула.</li>
          <li>
            Плътностите се получават чрез деление на площта:{" "}
            <RichText text="$\sigma=Q_{\text{повърхн}}/(4\pi R^2)$" />.
          </li>
        </ol>
      </Section>

      {/* ---------------------------------------------------------- */}
      <Section id="potential" n="§4" title="Потенциал и енергия">
        <FullLessonLinks
          lessons={[{ href: "/physics/elektrichestvo/potencial", title: "Електростатичен потенциал" }]}
        />
        <div className="grid gap-4">
          <Def sym="$V$" name="Електростатичен потенциал" kind="скалар" unit={String.raw`$\mathrm V=\mathrm{J/C}$`}>
            Потенциална енергия на единица заряд в дадена точка:{" "}
            <RichText text="$V=U/q$" />. Има смисъл само разликата между две точки; нулата се
            избира удобно, обикновено в безкрайност или по земята.
          </Def>
          <Def sym="$U$" name="Електростатична потенциална енергия" kind="скалар" unit={String.raw`$\mathrm J$`}>
            Работата, която външна сила трябва да извърши, за да събере системата от заряди от
            безкрайност, без да им придава кинетична енергия. За двойка заряди{" "}
            <RichText text="$U=kq_1q_2/r$" />, като знакът вече е включен в зарядите.
          </Def>
        </div>

        <SubTitle>Определението през работа</SubTitle>
        <div className="mt-3">
          <Formula
            latex={String.raw`W_{A\to B}=q\int_A^B\vec E\cdot d\vec l,\qquad
            V_B-V_A=-\int_A^B\vec E\cdot d\vec l`}
          />
        </div>
        <p className="mt-3">
          Минусът е цялото съдържание: когато полето върши положителна работа върху положителен
          заряд, потенциалната енергия намалява. Положителните заряди се движат от висок към
          нисък потенциал, отрицателните обратно.
        </p>

        <Note>
          Електростатичното поле е <strong>потенциално</strong>:{" "}
          <RichText text="$\oint\vec E\cdot d\vec l=0$" />. Работата не зависи от пътя, а само от
          крайните точки. Тъкмо това свойство изчезва при индукцията (§9) и затова там няма
          потенциал.
        </Note>

        <SubTitle>Основни изрази</SubTitle>
        <div className="mt-3">
          <Formula
            latex={String.raw`V=\frac{1}{4\pi\varepsilon_0}\frac{q}{r},\qquad
            V=\sum_i\frac{kq_i}{r_i},\qquad
            U_{12}=\frac{1}{4\pi\varepsilon_0}\frac{q_1q_2}{r},\qquad
            \vec E=-\nabla V`}
          />
        </div>
        <p className="mt-3">
          Потенциалът е скалар и се събира алгебрично. Това е най-голямото му предимство: няма
          компоненти, няма ъгли. Ако търсите поле, често е по-бързо първо да намерите{" "}
          <RichText text="$V$" /> и после да диференцирате:{" "}
          <RichText text="$E_x=-\partial V/\partial x$" />.
        </p>

        <SubTitle>Еквипотенциални повърхности</SubTitle>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[15px]">
          <li>Повърхности с еднакво <RichText text="$V$" />; преместване по тях не изисква работа.</li>
          <li>Винаги перпендикулярни на силовите линии.</li>
          <li>Гъсто разположени там, където полето е силно, защото <RichText text="$E=-dV/dn$" />.</li>
          <li>Повърхността на всеки проводник в равновесие е еквипотенциална (§5).</li>
        </ul>

        <Note tone="red">
          <strong>Внимание:</strong> <RichText text="$E=0$" /> и{" "}
          <RichText text="$V=0$" /> са независими твърдения. Между два еднакви заряда полето е
          нула, а потенциалът не е. По средата между заряди <RichText text="$+q$" /> и{" "}
          <RichText text="$-q$" /> потенциалът е нула, а полето е максимално.
        </Note>
      </Section>

      {/* ---------------------------------------------------------- */}
      <Section id="conductors" n="§5" title="Проводници в електростатично равновесие">
        <FullLessonLinks
          lessons={[{ href: "/physics/elektrichestvo/provodnici", title: "Проводници" }]}
        />
        <p>
          Проводникът съдържа свободни носители. Ако вътре в него имаше поле, те щяха да се
          движат и системата нямаше да е в равновесие. Първото правило е причина за всички
          останали.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {[
            ["1", "Полето в проводящия материал е нула."],
            ["2", "Целият проводник, включително повърхността, е еквипотенциален."],
            ["3", "Излишният заряд стои по повърхностите, не в обема."],
            ["4", "Полето непосредствено отвън е нормално и $E=\\sigma/\\varepsilon_0$."],
            ["5", "Празна кухина е екранирана от външни статични полета."],
            ["6", "Полето е най-силно там, където кривината е най-голяма."],
          ].map(([number, text]) => (
            <div
              key={number}
              className="flex gap-3 rounded-[10px] border-[1.5px] border-ink bg-surface p-4 shadow-hard-sm"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ink text-[12px] font-bold text-white">
                {number}
              </span>
              <p className="text-[14.5px]">
                <RichText text={text} />
              </p>
            </div>
          ))}
        </div>

        <Note tone="red">
          <strong>Двете различни</strong> <RichText text="$\sigma$" />{" "}
          <strong>формули:</strong> пред проводяща повърхност полето е{" "}
          <RichText text="$\sigma/\varepsilon_0$" />, защото полето влиза само от едната страна.
          Пред тънка заредена равнина, която не е проводник, полето е{" "}
          <RichText text="$\sigma/(2\varepsilon_0)$" /> от двете страни. Разликата е фактор две и
          е една от най-честите грешки.
        </Note>

        <SubTitle>Кухина със заряд вътре</SubTitle>
        <p className="mt-2">
          Заряд <RichText text="$+q$" /> в кухина на неутрална проводяща обвивка индуцира{" "}
          <RichText text="$-q$" /> по вътрешната повърхност и оставя{" "}
          <RichText text="$+q$" /> по външната. Ако обвивката носи собствен заряд{" "}
          <RichText text="$Q$" />, външната повърхност носи <RichText text="$Q+q$" />.
        </p>
        <div className="mt-4">
          <Formula
            latex={String.raw`Q_{\text{вътр}}=-q,\qquad Q_{\text{външн}}=Q+q,\qquad
            \sigma_{\text{вътр}}=-\frac{q}{4\pi a^2},\quad
            \sigma_{\text{външн}}=\frac{Q+q}{4\pi b^2}`}
          />
        </div>
        <p className="mt-3 text-[15px]">
          Пълните заряди по повърхностите са винаги такива. Делението на{" "}
          <RichText text="$4\pi a^2$" /> обаче предполага сферична симетрия: само тогава
          разпределението е равномерно.
        </p>

        <SubTitle>Заземяване и свързване</SubTitle>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Card title="Заземяване">
            <p className="text-[14.5px]">
              Налага <RichText text="$V=0$" />. При сферично симетрична конфигурация без външни
              заряди зарядът от външната повърхност изтича, а индуцираният вътрешен остава.
            </p>
          </Card>
          <Card title="Свързване на два проводника" tone="red">
            <p className="text-[14.5px]">
              Запазва се пълният заряд и се изравняват потенциалите. За две отдалечени сфери:{" "}
              <RichText text="$Q_i'=\dfrac{R_i}{R_1+R_2}(Q_1+Q_2)$" />.
            </p>
          </Card>
        </div>
        <p className="mt-4">
          Понеже <RichText text="$V=kQ/R$" /> и потенциалите се изравняват, следва{" "}
          <RichText text="$\sigma\propto1/R$" />: по-малката сфера има по-голяма плътност и
          по-силно поле край себе си. Това стои зад действието на гръмоотвода и на всеки остър
          връх.
        </p>
        <Note>
          <strong>Енергия при свързване:</strong> ако началните потенциали са различни, протича
          заряд и част от енергията се разсейва, затова <RichText text="$U_f<U_i$" />. Ако
          потенциалите са равни още в началото, заряд не протича и енергията се запазва.
        </Note>
      </Section>

      {/* ---------------------------------------------------------- */}
      <Section id="capacitors" n="§6" title="Кондензатори и диелектрици">
        <FullLessonLinks
          lessons={[
            { href: "/physics/elektrichestvo/kondenzatori", title: "Кондензатори" },
            { href: "/physics/elektrichestvo/dielektrici", title: "Диелектрици" },
          ]}
        />
        <div className="grid gap-4">
          <Def sym="$C$" name="Капацитет" kind="скалар" unit={String.raw`$\mathrm F=\mathrm{C/V}$`}>
            Колко заряд поема системата за единица потенциална разлика:{" "}
            <RichText text="$C=Q/\Delta V$" />. Отношението не зависи от заряда, защото
            удвоеният заряд удвоява и напрежението. Затова <RichText text="$C$" /> е
            характеристика само на <strong>геометрията и средата</strong>.
          </Def>
          <Def
            sym={String.raw`$\varepsilon_r$`}
            name="Относителна диелектрична проницаемост"
            kind="безразмерна"
            unit="1"
          >
            Колко пъти средата отслабва полето на дадени свободни заряди:{" "}
            <RichText text="$\varepsilon=\varepsilon_r\varepsilon_0$" />,{" "}
            <RichText text="$\varepsilon_r\ge1$" />. За вакуум е точно 1, за въздух практически
            1, за вода около 80.
          </Def>
          <Def sym="$u_E$" name="Обемна плътност на енергията" kind="скалар" unit={String.raw`$\mathrm{J/m^3}$`}>
            Енергия на единица обем, съхранена в самото поле:{" "}
            <RichText text="$u_E=\tfrac12\varepsilon E^2$" />. Идеята, че енергията е в полето, а
            не в зарядите, е ключова: тя оцелява и при магнетизма, и при електромагнитните вълни.
          </Def>
        </div>

        <SubTitle>Геометрии</SubTitle>
        <div className="mt-4">
          <DataTable head={["Конфигурация", "Капацитет", "Условие"]} rows={CAPACITOR_ROWS} minWidth={600} />
        </div>

        <SubTitle>Свързване</SubTitle>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Card title="Последователно">
            <p className="text-[14.5px]">
              Общ е <strong>зарядът</strong>, напреженията се сумират.
            </p>
            <div className="mt-3">
              <Formula
                latex={String.raw`Q_i=Q,\quad \Delta V=\sum_i\Delta V_i,\quad \frac{1}{C_e}=\sum_i\frac{1}{C_i}`}
              />
            </div>
            <p className="mt-2 text-[14px] text-muted">
              <RichText text="$C_e<\min(C_i)$: сумата е по-малка и от най-малкия." />
            </p>
          </Card>
          <Card title="Успоредно" tone="red">
            <p className="text-[14.5px]">
              Общо е <strong>напрежението</strong>, зарядите се сумират.
            </p>
            <div className="mt-3">
              <Formula latex={String.raw`\Delta V_i=\Delta V,\quad Q=\sum_iQ_i,\quad C_e=\sum_iC_i`} />
            </div>
            <p className="mt-2 text-[14px] text-muted">
              <RichText text="$C_e>\max(C_i)$: сумата е по-голяма и от най-големия." />
            </p>
          </Card>
        </div>
        <p className="mt-4 text-[15px]">
          Правилото е обратно на това при резисторите (§11) и това е нарочно: при кондензаторите
          последователното свързване увеличава ефективното разстояние, а успоредното увеличава
          ефективната площ.
        </p>

        <SubTitle>Енергия</SubTitle>
        <div className="mt-3">
          <Formula
            latex={String.raw`U=\frac12C(\Delta V)^2=\frac{Q^2}{2C}=\frac12Q\Delta V,\qquad
            u_E=\frac12\varepsilon E^2`}
          />
        </div>
        <p className="mt-3">
          Трите израза са еквивалентни, но не са еднакво удобни. При фиксиран заряд използвайте{" "}
          <RichText text="$Q^2/(2C)$" />, при фиксирано напрежение{" "}
          <RichText text="$C(\Delta V)^2/2$" />. Множителят <RichText text="$1/2$" /> идва от това, че
          зарядът се пренася постепенно и напрежението расте по време на зареждането.
        </p>

        <SubTitle>Диелектрици: какво прави веществото</SubTitle>
        <p className="mt-2">
          Външното поле подрежда молекулните диполи. По повърхностите на диелектрика се появяват{" "}
          <strong>свързани заряди</strong>, чието поле е насочено срещу външното. Свободните
          заряди по плочите не са се променили, но резултантното поле е по-слабо.
        </p>
        <div className="mt-4">
          <Formula
            latex={String.raw`C\longrightarrow\varepsilon_rC_0,\qquad
            E=\frac{E_0}{\varepsilon_r}\ \ (Q=\text{const}),\qquad
            \varepsilon=\varepsilon_r\varepsilon_0`}
          />
        </div>

        <SubTitle>Ключовият въпрос: заряд или потенциал?</SubTitle>
        <p className="mt-2">
          Половината задачи в тази глава се решават с един въпрос: батерията свързана ли е още?
        </p>
        <div className="mt-4">
          <DataTable
            head={["", "Откачен кондензатор", "Свързан към батерия"]}
            rows={[
              ["Фиксирано", "зарядът $Q$", "напрежението $\\Delta V$"],
              [
                String.raw`При промяна на $C$`,
                String.raw`променят се $\Delta V,\ E,\ U$`,
                String.raw`променят се $Q,\ U$`,
              ],
              [
                "Пълно вкарване на диелектрик",
                String.raw`$C\uparrow,\ \Delta V\downarrow,\ E\downarrow,\ U\downarrow$`,
                String.raw`$C\uparrow,\ Q\uparrow,\ E=\text{const},\ U\uparrow$`,
              ],
              [
                "Откъде идва енергията",
                "полето изтегля диелектрика за своя сметка",
                "батерията внася заряд и енергия",
              ],
            ]}
            minWidth={700}
          />
        </div>
        <p className="mt-3 text-[14px] text-muted">
          Редът <RichText text="$E=\text{const}$" /> важи за идеален плосък кондензатор при
          непроменено разстояние между плочите, защото <RichText text="$E=\Delta V/d$" />.
        </p>

        <SubTitle>Частично запълване и пробив</SubTitle>
        <p className="mt-2">
          Диелектрик с дължина <RichText text="$x$" />, вкаран странично в кондензатор с дължина{" "}
          <RichText text="$l$" /> и ширина <RichText text="$a$" />, дава два успоредни
          кондензатора:
        </p>
        <div className="mt-3">
          <Formula latex={String.raw`C(x)=\frac{\varepsilon_0a}{d}\left[l+(\varepsilon_r-1)x\right]`} />
        </div>
        <p className="mt-3 text-[15px]">
          Ако диелектрикът покрива цялата площ, но само част от разстоянието, слоевете са{" "}
          <strong>последователни</strong>. Разпознаването на серия и паралел при слоести
          диелектрици е половината от условието на задачата.
        </p>
        <Note>
          <strong>Диелектрична якост:</strong> всеки изолатор пробива над определено поле (за
          въздух около <RichText text="$3\times10^{6}\,\mathrm{V/m}$" />). Затова диелектрикът
          изпълнява две задачи наведнъж: увеличава <RichText text="$C$" /> и позволява по-високо
          работно напрежение.
        </Note>
      </Section>

      {/* ---------------------------------------------------------- */}
      <Section id="magnetic" n="§7" title="Магнитно поле и сила върху токове">
        <FullLessonLinks
          lessons={[{ href: "/physics/magnetizm/lorentz", title: "Сила на Лоренц" }]}
        />
        <div className="grid gap-4">
          <Def sym={String.raw`$\vec B$`} name="Магнитна индукция" kind="вектор" unit={String.raw`$\mathrm T$`}>
            Дефинира се <strong>операционно</strong>, чрез силата върху движещ се заряд. Има
            една посока, по която зарядът не изпитва сила: това е посоката на{" "}
            <RichText text="$\vec B$" />. Перпендикулярно на нея силата е максимална и
            големината на полето е <RichText text="$B=F_{\max}/(|q|v)$" />. Един тесла е много
            голямо поле: земното е около <RichText text="$5\times10^{-5}\,\mathrm T$" />.
          </Def>
          <Def sym={String.raw`$\vec\mu$`} name="Магнитен диполен момент" kind="вектор" unit={String.raw`$\mathrm{A\,m^2}$`}>
            Мярка колко силен магнит е един токов контур:{" "}
            <RichText text="$\vec\mu=NI\vec A$" />, с посока по нормалата, определена от дясната
            ръка по посоката на тока. Играе същата роля, каквато <RichText text="$\vec p$" />{" "}
            играе в електричното поле.
          </Def>
        </div>

        <div className="mt-5">
          <Law
            title="Сила на Лоренц"
            latex={String.raw`\vec F=q\left(\vec E+\vec v\times\vec B\right),
            \qquad F_B=|q|vB\sin\theta`}
            says="Електричната част действа по посока на полето и не зависи от скоростта. Магнитната част е перпендикулярна едновременно на скоростта и на полето, затова тя само завърта движението."
            when="Винаги, за точков заряд. Знакът на $q$ обръща посоката, затова електроните се отклоняват обратно на положителните йони."
          />
        </div>

        <Note>
          <strong>Магнитната сила не върши работа:</strong>{" "}
          <RichText text="$P=\vec F_B\cdot\vec v=0$" />, защото силата е перпендикулярна на
          скоростта. Кинетичната енергия на един заряд в чисто магнитно поле е постоянна. Ако в
          някоя задача енергията се променя, значи работа е извършило електрично поле или външна
          сила.
        </Note>

        <SubTitle>Движение в еднородно поле</SubTitle>
        <div className="mt-3">
          <Formula
            latex={String.raw`r=\frac{mv_\perp}{|q|B},\qquad
            \omega_c=\frac{|q|B}{m},\qquad
            T=\frac{2\pi m}{|q|B}`}
          />
        </div>
        <p className="mt-3">
          Периодът не зависи от скоростта и от радиуса. Това е причината циклотронът да работи с
          постоянна честота. Ако скоростта има и надлъжна съставка, траекторията е спирала:
          перпендикулярната компонента се върти, надлъжната остава непроменена.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Card title="Селектор на скорости">
            <p className="text-[14.5px]">
              Кръстосани <RichText text="$\vec E$" /> и <RichText text="$\vec B$" />. Преминават
              само частици с <RichText text="$v=E/B$" />, независимо от заряда и масата им.
            </p>
          </Card>
          <Card title="Ефект на Хол" tone="red">
            <p className="text-[14.5px]">
              Напречно напрежение <RichText text="$\Delta V_H=IB/(nqt)$" /> в проводник с ток в поле.
              Знакът му показва носителите: положителни или отрицателни.
            </p>
          </Card>
        </div>

        <SubTitle>Сила върху проводник с ток</SubTitle>
        <div className="mt-3">
          <Formula
            latex={String.raw`d\vec F=I\,d\vec l\times\vec B,\qquad
            \vec F=I\vec L\times\vec B,\qquad F=BIL\sin\theta`}
          />
        </div>
        <p className="mt-3">
          Това не е нов закон, а сумата от силите на Лоренц върху всички носители в проводника.
          При затворен контур в еднородно поле резултантната сила е нула, но моментът обикновено
          не е.
        </p>
        <div className="mt-4">
          <Formula
            latex={String.raw`\vec\mu=NI\vec A,\qquad
            \vec\tau=\vec\mu\times\vec B,\qquad
            U=-\vec\mu\cdot\vec B`}
          />
        </div>
        <p className="mt-3 text-[15px]">
          Моментът върти контура така, че <RichText text="$\vec\mu$" /> да се подреди по{" "}
          <RichText text="$\vec B$" />. Устойчивото равновесие е при{" "}
          <RichText text="$U=-\mu B$" />, неустойчивото при{" "}
          <RichText text="$U=+\mu B$" />. Оттук работят електродвигателят и стрелката на компаса.
        </p>
      </Section>

      {/* ---------------------------------------------------------- */}
      <Section id="sources" n="§8" title="Източници на магнитно поле">
        <FullLessonLinks
          lessons={[
            { href: "/physics/magnetizm/bio-savar", title: "Закон на Био–Савар" },
            { href: "/physics/magnetizm/amper", title: "Закон на Ампер" },
            {
              href: "/physics/magnetizm/usporeni-provodnici",
              title: "Успоредни проводници",
            },
          ]}
        />
        <p>
          Има два начина да се сметне <RichText text="$\vec B$" />. Единият винаги работи, но е
          бавен. Другият е бърз, но само при подходяща симетрия. Разпознаването кой да се
          използва е основното умение в тази глава.
        </p>

        <div className="mt-5">
          <Law
            title="Закон на Био-Савар"
            latex={String.raw`d\vec B=\frac{\mu_0}{4\pi}\frac{I\,d\vec l\times\hat r}{r^2},
            \qquad dB=\frac{\mu_0}{4\pi}\frac{I\,dl\sin\theta}{r^2}`}
            says="Всяко малко парче ток дава принос, който спада с квадрата на разстоянието и е перпендикулярен едновременно на елемента и на посоката към точката. Пълното поле е векторната сума на приносите."
            when="За постоянни токове. Универсален е, но изисква интегриране; използва се, когато симетрията е недостатъчна за Ампер."
          />
        </div>

        <Note>
          <strong>Правило на дясната ръка:</strong> палецът по тока, свитите пръсти по посоката
          на <RichText text="$\vec B$" />. Ток, насочен към наблюдателя (символ ⊙), обикаля
          обратно на часовниковата стрелка.
        </Note>

        <div className="mt-6">
          <Law
            title="Закон на Ампер"
            latex={String.raw`\oint\vec B\cdot d\vec l=\mu_0I_{\text{обхв}}`}
            says="Циркулацията на магнитното поле по затворен контур зависи само от пълния ток, пронизващ контура. Формата и размерът на контура не влизат в резултата."
            when="За постоянни токове (без променящо се електрично поле). Винаги е верен, но дава $B$ само когато симетрията прави $B$ постоянно или нулево по участъци от контура."
          />
        </div>

        <SubTitle>Методът с амперов контур</SubTitle>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[15px]">
          <li>Установете симетрията и предскажете формата на силовите линии.</li>
          <li>Изберете контур, който следва тези линии, за да бъде <RichText text="$\vec B\parallel d\vec l$" />.</li>
          <li>
            Пресметнете <RichText text="$I_{\text{обхв}}$" /> със знак: токовете по посока на
            дясната ръка спрямо ориентацията на контура са положителни.
          </li>
          <li>Изразете <RichText text="$B$" /> и проверете граничния случай.</li>
        </ol>

        <SubTitle>
          Стандартни резултати за <RichText text="$B$" />
        </SubTitle>
        <div className="mt-4">
          <DataTable head={["Конфигурация", "Поле", "Забележка"]} rows={B_FIELD_ROWS} minWidth={700} />
        </div>

        <SubTitle>Сила между успоредни проводници</SubTitle>
        <p className="mt-2">
          Тук се затваря кръгът: първият проводник създава поле, второто го усеща. Причинната
          верига е <RichText text="$I_1\to\vec B_1\to\vec F_2=I_2\vec L\times\vec B_1$" />, а не
          пряко действие между токовете.
        </p>
        <div className="mt-3">
          <Formula latex={String.raw`\frac FL=\frac{\mu_0I_1I_2}{2\pi d},\qquad \vec F_1=-\vec F_2`} />
        </div>
        <p className="mt-3 text-[15px]">
          Еднакво насочени токове се привличат, противоположно насочени се отблъскват. Точно
          обратно на интуицията от електростатиката, където еднаквите заряди се отблъскват.
        </p>

        <Note>
          <strong>Няма магнитни заряди:</strong> <RichText text="$\oint\vec B\cdot d\vec S=0$" />
          . Силовите линии на магнитното поле са затворени, нямат начало и край. Затова
          разрязан магнит дава два нови магнита, а не отделни полюси.
        </Note>
      </Section>

      {/* ---------------------------------------------------------- */}
      <Section id="induction" n="§9" title="Електромагнитна индукция">
        <FullLessonLinks
          lessons={[{ href: "/physics/magnetizm/faraday", title: "Закон на Фарадей" }]}
        />
        <Def sym={String.raw`$\Phi_B$`} name="Магнитен поток" kind="скалар" unit={String.raw`$\mathrm{T\,m^2}$`}>
          Колко магнитно поле пресича дадена повърхност:{" "}
          <RichText text="$\Phi_B=\int_S\vec B\cdot d\vec S$" />, а при еднородно поле и плоска
          повърхност <RichText text="$\Phi_B=BA\cos\theta$" />. Ъгълът{" "}
          <RichText text="$\theta$" /> е между <RichText text="$\vec B$" /> и{" "}
          <strong>нормалата</strong> към площта, не между полето и самата повърхност.
        </Def>

        <div className="mt-5">
          <Law
            title="Закон на Фарадей"
            latex={String.raw`\mathcal E=-N\frac{d\Phi_B}{dt}`}
            says="Променящият се магнитен поток през контур поражда ЕДН. Значение има само скоростта на промяна: голям, но постоянен поток не индуцира нищо."
            when="Фундаментален закон, не се извежда от предишните. Валиден е и когато няма проводник: тогава просто няма ток, но индуцираното поле съществува."
          />
        </div>

        <SubTitle>Трите начина да се промени потокът</SubTitle>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Card title="Променя се B">
            <p className="text-[14.5px]">
              Приближаване на магнит, включване на съседна намотка, променлив ток. Контурът е
              неподвижен, полето се мени.
            </p>
          </Card>
          <Card title="Променя се A" tone="red">
            <p className="text-[14.5px]">
              Прът, плъзгащ се по релси, деформираща се рамка, изваждане на контур от полето.
            </p>
          </Card>
          <Card title="Променя се ъгълът" tone="green">
            <p className="text-[14.5px]">
              Въртяща се рамка в постоянно поле. Точно това е принципът на всеки генератор за
              променлив ток.
            </p>
          </Card>
        </div>

        <SubTitle>Правило на Ленц</SubTitle>
        <p className="mt-2">
          Минусът в закона на Фарадей не е техническа подробност, а запазването на енергията в
          компактна форма: <strong>индуцираният ток се противопоставя на промяната</strong>,
          която го е породила, а не на самия поток.
        </p>
        <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-[15px]">
          <li>Определете посоката на <RichText text="$\vec B$" /> през контура.</li>
          <li>Определете дали потокът расте или намалява.</li>
          <li>Индуцираното поле противодейства: пречи на растежа или поддържа намаляващия поток.</li>
          <li>Приложете дясната ръка, за да превърнете посоката на полето в посока на тока.</li>
        </ol>
        <Note tone="red">
          Ако Ленц беше с обратен знак, всяка малка промяна щеше да се усилва сама и щяхме да
          имаме вечен двигател. Затова знакът е проверка: индуцираните ефекти винаги{" "}
          <em>спъват</em> движението, което ги създава.
        </Note>

        <SubTitle>Двигателно ЕДН</SubTitle>
        <div className="mt-3">
          <Formula
            latex={String.raw`\mathcal E=\int(\vec v\times\vec B)\cdot d\vec l
            \quad\longrightarrow\quad \mathcal E=B\ell v`}
          />
        </div>
        <p className="mt-3">
          Вторият израз важи за прът с дължина <RichText text="$\ell$" />, движещ се
          перпендикулярно на себе си и на полето. Ако веригата е затворена със съпротивление{" "}
          <RichText text="$R$" />, токът е <RichText text="$I=B\ell v/R$" />, а върху пръта
          действа спирачна сила <RichText text="$F=B^2\ell^2v/R$" />. Механичната мощност на
          теглещата сила се превръща изцяло в топлина:{" "}
          <RichText text="$P=Fv=I^2R$" />.
        </p>

        <SubTitle>Индуцирано електрично поле</SubTitle>
        <div className="mt-3">
          <Formula latex={String.raw`\oint\vec E\cdot d\vec l=-\frac{d\Phi_B}{dt}`} />
        </div>
        <p className="mt-3">
          Променящото се магнитно поле поражда електрично поле със{" "}
          <strong>затворени</strong> силови линии. То не е потенциално: работата по затворен
          контур не е нула, затова за него не може да се въведе потенциал. Тук се разделят
          електростатиката и електродинамиката.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Card title="Генератор">
            <p className="text-[14.5px]">
              Рамка с <RichText text="$N$" /> навивки, въртяща се с честота{" "}
              <RichText text="$\omega$" />:{" "}
              <RichText text="$\mathcal E=NBA\omega\sin(\omega t)$" />. Максимумът е, когато
              равнината на рамката е успоредна на полето.
            </p>
          </Card>
          <Card title="Вихрови токове" tone="red">
            <p className="text-[14.5px]">
              В плътен метал индукцията поражда затворени токове, които загряват материала и
              спъват движението. Оттам са индукционният котлон и магнитната спирачка; шихтованите
              сърцевини ги потискат.
            </p>
          </Card>
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      <Section id="inductance" n="§10" title="Индуктивност и енергия на магнитното поле">
        <FullLessonLinks
          lessons={[{ href: "/physics/magnetizm/induktivnost", title: "Индуктивност" }]}
        />
        <div className="grid gap-4">
          <Def sym="$L$" name="Индуктивност (самоиндукция)" kind="скалар" unit={String.raw`$\mathrm H=\mathrm{V\,s/A}$`}>
            Собствен поточен обхват на единица собствен ток:{" "}
            <RichText text="$L=N\Phi_B/I$" />. Понеже полето е пропорционално на тока,
            отношението не зависи от <RichText text="$I$" /> и{" "}
            <RichText text="$L$" /> е чисто геометрична характеристика на намотката и средата в
            нея, точно както <RichText text="$C$" /> е за кондензатора.
          </Def>
          <Def sym="$M$" name="Взаимна индуктивност" kind="скалар" unit={String.raw`$\mathrm H$`}>
            Поток през втората намотка на единица ток в първата:{" "}
            <RichText text="$M=N_2\Phi_{21}/I_1$" />. Забележително е, че{" "}
            <RichText text="$M_{12}=M_{21}$" /> независимо от формата на намотките.
          </Def>
          <Def sym="$u_B$" name="Плътност на магнитната енергия" kind="скалар" unit={String.raw`$\mathrm{J/m^3}$`}>
            <RichText text="$u_B=B^2/(2\mu_0)$" />. Изведена е за соленоид, но е универсална.
            Пълната енергия <RichText text="$LI^2/2$" /> е просто{" "}
            <RichText text="$u_B$" />, умножена по обема, в който полето е ненулево.
          </Def>
        </div>

        <div className="mt-5">
          <Law
            title="ЕДН на самоиндукция"
            latex={String.raw`\mathcal E_L=-L\frac{dI}{dt},\qquad L=\mu_0\frac{N^2}{\ell}A=\mu_0n^2V`}
            says="Намотката поражда напрежение в самата себе си, пропорционално на скоростта на промяна на тока. Втората формула е резултатът за дълъг соленоид с обем $V$."
            when="При квазистационарен режим и линейна среда. При феромагнитна сърцевина $\mu_0$ се заменя с $\mu$, което вече зависи от тока."
          />
        </div>

        <Note>
          <strong>Ключово разграничение:</strong> индукторът не се противопоставя на тока, а на{" "}
          <em>промяната</em> на тока. При установен постоянен ток{" "}
          <RichText text="$dI/dt=0$" /> и напрежението върху идеалния индуктор е нула: той е
          обикновена жица. Затова токът през индуктор не може да скочи мигновено, както
          напрежението върху кондензатор не може.
        </Note>

        <SubTitle>Енергия</SubTitle>
        <div className="mt-3">
          <Formula
            latex={String.raw`U_B=\frac12LI^2,\qquad u_B=\frac{B^2}{2\mu_0},\qquad
            \mathcal EI=I^2R+LI\frac{dI}{dt}`}
          />
        </div>
        <p className="mt-3">
          Последното уравнение е енергийният баланс на <RichText text="$RL$" /> веригата:
          мощността на източника отива частично в топлина и частично в натрупване на магнитна
          енергия. Тази енергия не се губи, а се връща във веригата при изключване. Именно тя
          прави искрата при отваряне на ключ с намотка.
        </p>

        <SubTitle>Взаимна индукция и трептения</SubTitle>
        <div className="mt-3">
          <Formula
            latex={String.raw`\mathcal E_2=-M\frac{dI_1}{dt},\qquad
            \omega_0=\frac{1}{\sqrt{LC}},\qquad
            T=2\pi\sqrt{LC}`}
          />
        </div>
        <p className="mt-3">
          В <RichText text="$LC$" /> контур енергията се прелива между електричното поле на
          кондензатора и магнитното поле на бобината:{" "}
          <RichText text="$Q^2/(2C)+LI^2/2=\text{const}$" />. Пълна аналогия с махало, където{" "}
          <RichText text="$L$" /> играе ролята на маса, а <RichText text="$1/C$" /> на
          коравина.
        </p>
        <div className="mt-3">
          <Formula
            latex={String.raw`\omega'=\sqrt{\frac{1}{LC}-\left(\frac{R}{2L}\right)^2}`}
          />
        </div>
        <p className="mt-3 text-[15px]">
          Съпротивлението внася затихване. При{" "}
          <RichText text="$R^2\ge4L/C$" /> трептенията изчезват напълно и системата само се
          връща към равновесие.
        </p>
      </Section>

      {/* ---------------------------------------------------------- */}
      <Section id="circuits" n="§11" title="Вериги: ток, преходни процеси, RC срещу RL">
        <div className="grid gap-4">
          <Def sym="$I$" name="Електричен ток" kind="скалар" unit={String.raw`$\mathrm A$`}>
            Заряд, преминаващ през напречно сечение за единица време:{" "}
            <RichText text="$I=dQ/dt$" />. Конвенционалната посока е посоката на движение на
            положителните носители; в метал електроните се движат обратно на нея.
          </Def>
          <Def sym={String.raw`$\vec j$`} name="Плътност на тока" kind="вектор" unit={String.raw`$\mathrm{A/m^2}$`}>
            Ток на единица напречна площ: <RichText text="$\vec j=nq\vec v_d$" /> и{" "}
            <RichText text="$I=\int\vec j\cdot d\vec A$" />. Дрейфовата скорост{" "}
            <RichText text="$v_d$" /> е изненадващо малка, но сигналът се разпространява със
            скоростта на полето.
          </Def>
          <Def sym="$R$" name="Съпротивление" kind="скалар" unit={String.raw`$\Omega$`}>
            Напрежение на единица ток: <RichText text="$R=\Delta V/I$" />, а през материала{" "}
            <RichText text="$R=\rho\ell/A$" />. Законът на Ом (<RichText text="$R$" />{" "}
            постоянно) е свойство на материала, а не универсален закон.
          </Def>
        </div>

        <SubTitle>Основни съотношения</SubTitle>
        <div className="mt-3">
          <Formula
            latex={String.raw`\Delta V=IR,\qquad R_{\text{посл}}=\sum_iR_i,\qquad
            \frac{1}{R_{\text{усп}}}=\sum_i\frac{1}{R_i},\qquad
            P=I\Delta V=I^2R=\frac{(\Delta V)^2}{R}`}
          />
        </div>
        <p className="mt-3">
          Правилата за свързване са <strong>обратни</strong> на тези за кондензаторите. Причината
          е, че <RichText text="$R$" /> расте с дължината, а <RichText text="$C$" /> намалява с
          разстоянието.
        </p>
        <Note>
          <strong>Кирхоф:</strong> възловият закон{" "}
          <RichText text="$\sum I_{\text{вх}}=\sum I_{\text{изх}}$" /> изразява запазването на
          заряда, а контурният <RichText text="$\sum\Delta V=0$" /> е запазването на енергията.
          Реален източник дава на клемите си{" "}
          <RichText text="$\Delta V=\mathcal E-Ir$" />.
        </Note>

        <SubTitle>Преходни процеси</SubTitle>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Card title="RC верига">
            <div className="mt-1">
              <Formula
                latex={String.raw`\begin{aligned}
                \tau&=RC\\
                q(t)&=C\mathcal E\left(1-e^{-t/\tau}\right)\\
                q_{\text{разр}}(t)&=Q_0e^{-t/\tau}
                \end{aligned}`}
              />
            </div>
          </Card>
          <Card title="RL верига" tone="red">
            <div className="mt-1">
              <Formula
                latex={String.raw`\begin{aligned}
                \tau&=\frac LR\\
                I(t)&=\frac{\mathcal E}{R}\left(1-e^{-t/\tau}\right)\\
                I_{\text{спад}}(t)&=I_0e^{-t/\tau}
                \end{aligned}`}
              />
            </div>
          </Card>
        </div>
        <p className="mt-4 text-[15px]">
          След време <RichText text="$\tau$" /> процесът е изминал{" "}
          <RichText text="$1-1/e\approx63\%$" /> от пътя си, след{" "}
          <RichText text="$5\tau$" /> практически е приключил. Полупериодът е{" "}
          <RichText text="$t_{1/2}=\tau\ln2$" />.
        </p>

        <SubTitle>Двойката, която трябва да се помни</SubTitle>
        <div className="mt-4">
          <DataTable
            head={["Свойство", "Кондензатор", "Индуктор"]}
            rows={[
              ["Не допуска скок на", "напрежението $\\Delta V_C$", "тока $I_L$"],
              ["Времеконстанта", String.raw`$\tau=RC$`, String.raw`$\tau=L/R$`],
              ["Съхранява енергия в", "електричното поле", "магнитното поле"],
              ["Енергия", String.raw`$\tfrac12C(\Delta V)^2$`, String.raw`$\tfrac12LI^2$`],
              ["При установен постоянен ток", "прекъсване на веригата", "къса връзка"],
              ["В началния момент", "къса връзка", "прекъсване на веригата"],
            ]}
            minWidth={640}
          />
        </div>
        <p className="mt-3 text-[15px] text-muted">
          Последните два реда са едно и също твърдение, погледнато отпред и отзад: това, което
          един елемент пази постоянно, определя как изглежда той в началото и в края.
        </p>
      </Section>

      {/* ---------------------------------------------------------- */}
      <Section id="strategy" n="§12" title="Стратегии и чести грешки">
        <SubTitle>Универсален ред на решаване</SubTitle>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[15px]">
          <li>Начертайте геометрията и изберете положителни посоки. Без чертеж знаците се губят.</li>
          <li>Запишете дадените и търсените величини в SI.</li>
          <li>
            Попитайте: статика или промяна във времето? Има ли симетрия? Кое е фиксирано:{" "}
            <RichText text="$Q$" /> или <RichText text="$\Delta V$" />?
          </li>
          <li>Изберете закона според отговорите, не според това коя формула помните.</li>
          <li>Решете символно докрай и чак тогава заместете с числа.</li>
          <li>Проверете размерността, знака и граничния случай.</li>
        </ol>

        <SubTitle>Типове задачи</SubTitle>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Card title="Поле от разпределен заряд">
            <ol className="list-decimal space-y-1 pl-5 text-[14.5px]">
              <li>Симетрия достатъчна ли е за Гаус?</li>
              <li>Ако не: изберете <RichText text="$dq$" /> и интегрирайте.</li>
              <li>Търсете компонента, която се компенсира.</li>
              <li>Проверете границата на голямо разстояние.</li>
            </ol>
          </Card>
          <Card title="Мрежи от кондензатори" tone="red">
            <ol className="list-decimal space-y-1 pl-5 text-[14.5px]">
              <li>Опростете до един еквивалентен капацитет.</li>
              <li>Върнете се назад към зарядите и напреженията.</li>
              <li>В серия сверявайте заряда, в паралел напрежението.</li>
              <li>При мост първо потърсете симетрия.</li>
            </ol>
          </Card>
          <Card title="Магнитно поле на токове" tone="green">
            <ol className="list-decimal space-y-1 pl-5 text-[14.5px]">
              <li>Права безкрайна нишка или симетричен обход: Ампер.</li>
              <li>Дъги, крайни отсечки, оси: Био-Савар.</li>
              <li>Радиалните участъци не дават принос.</li>
              <li>Съберете приносите като вектори, не като числа.</li>
            </ol>
          </Card>
          <Card title="Индукция">
            <ol className="list-decimal space-y-1 pl-5 text-[14.5px]">
              <li>Изразете <RichText text="$\Phi_B(t)$" /> явно.</li>
              <li>Диференцирайте, не заменяйте с крайни разлики без нужда.</li>
              <li>Посоката се определя от Ленц, не от знака в сметката.</li>
              <li>Проверете енергийния баланс.</li>
            </ol>
          </Card>
        </div>

        <SubTitle>Чести грешки</SubTitle>
        <ul className="mt-4 space-y-3">
          {MISTAKES.map((mistake, index) => (
            <li
              key={mistake}
              className="flex gap-3 rounded-[10px] border-[1.5px] border-rule bg-surface px-4 py-3"
            >
              <span className="mt-0.5 font-bold tabular-nums text-plus">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-[14.5px]">
                <RichText text={mistake} />
              </span>
            </li>
          ))}
        </ul>

        <details className="mt-8 rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard-sm">
          <summary className="cursor-pointer font-serif text-[20px] font-bold">
            Типични изпитни въпроси по целия раздел
          </summary>
          <ol className="mt-4 list-decimal space-y-2.5 pl-5 text-[15px]">
            <li>Формулирайте закона на Гаус и обяснете защо външните заряди не влизат в него.</li>
            <li>
              Изведете полето на безкрайна нишка и на безкрайна равнина. Защо зависимостите от
              разстоянието са различни?
            </li>
            <li>Докажете, че полето в проводник в равновесие е нула, и изведете следствията.</li>
            <li>Изведете капацитета на плосък и на сферичен кондензатор.</li>
            <li>
              Сравнете какво се променя при вкарване на диелектрик при свързана и при откачена
              батерия.
            </li>
            <li>Защо магнитната сила не върши работа? Как тогава работи електродвигателят?</li>
            <li>Изведете полето на безкраен прав проводник по двата начина и ги сравнете.</li>
            <li>Изведете <RichText text="$B$" /> в соленоид и в тороид със закона на Ампер.</li>
            <li>Формулирайте закона на Фарадей и обяснете правилото на Ленц чрез енергията.</li>
            <li>Изведете двигателното ЕДН и покажете енергийния баланс за прът върху релси.</li>
            <li>
              Изведете <RichText text="$L$" /> за соленоид и покажете, че{" "}
              <RichText text="$U=LI^2/2$" />.
            </li>
            <li>
              Сравнете <RichText text="$RC$" /> и <RichText text="$RL$" /> преходните процеси.
            </li>
          </ol>
        </details>
      </Section>

      {/* ---------------------------------------------------------- */}
      <Section id="reference" n="§13" title="Величини, единици и константи">
        <p>
          Таблицата събира всички величини от раздела на едно място. Ако някоя дефиниция не може
          да бъде преразказана с думи, върнете се към съответната секция.
        </p>
        <div className="mt-5">
          <DataTable
            head={["Величина", "Означение", "Единица", "Какво е"]}
            rows={QUANTITY_ROWS}
            minWidth={760}
          />
        </div>

        <SubTitle>Константи</SubTitle>
        <div className="mt-4">
          <DataTable head={["Константа", "Стойност"]} rows={CONSTANT_ROWS} minWidth={560} />
        </div>

        <SubTitle>Полезни връзки между единиците</SubTitle>
        <div className="mt-3">
          <Formula
            latex={String.raw`1\,\mathrm T=1\,\frac{\mathrm N}{\mathrm{A\,m}},
            \qquad 1\,\mathrm H=1\,\frac{\mathrm{V\,s}}{\mathrm A},
            \qquad 1\,\mathrm F=1\,\frac{\mathrm C}{\mathrm V}`}
          />
        </div>
        <p className="mt-3 text-[15px]">
          Проверката на размерността хваща повечето грешки в преписването. Ако{" "}
          <RichText text="$[\,\text{ляво}\,]\ne[\,\text{дясно}\,]$" />, няма смисъл да се
          заместват числа.
        </p>
      </Section>

      {/* ---------------------------------------------------------- */}
      <Section id="check" n="§14" title="Самопроверка по целия раздел">
        <p className="mb-6">
          Десет въпроса без справочник. След избор въпросът се заключва и показва защо избраният
          отговор е верен или не.
        </p>
        <Quiz questions={REVIEW_QUIZ} />

        <div className="mt-8 rounded-[10px] border-[1.5px] border-ink bg-ink px-5 py-5 text-white shadow-hard">
          <p className="text-[11px] font-bold uppercase tracking-[.18em] text-hl">Финален чек</p>
          <p className="mt-2 text-[15.5px]">
            Разделът е усвоен, ако можете да отговорите на шестте въпроса от §1 за двете полета
            наизуст, да изберете между Гаус и интегриране за произволна конфигурация, да решите
            дали е фиксирано <RichText text="$Q$" /> или <RichText text="$\Delta V$" />, и да
            определите посоката на индуцирания ток само чрез запазването на енергията.
          </p>
        </div>

        <Link
          href="/zadachi/kontrolno-elektrostatika"
          className="group mt-6 block rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard-sm transition-transform hover:-translate-y-0.5"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.17em] text-minus">
              Проверете се
            </span>
            <span className="rounded-full border border-rule bg-hl px-3 py-1 text-[11px] font-semibold text-muted">
              Университетско ниво · <RichText text="$1$-$2$ курс" />
            </span>
          </div>
          <h3 className="mt-2 font-serif text-[22px] font-bold leading-tight text-ink group-hover:text-minus">
            Контролно по електростатика с подробни решения
          </h3>
          <p className="mt-2 text-[15px] leading-relaxed text-ink/85">
            Седем въпроса от теорията и четири задачи с пълни решения. Под всяко условие стои
            ред с уроците, на които стъпва задачата.
          </p>
          <p className="mt-3 text-[13px] font-bold text-minus">Отворете контролното →</p>
        </Link>

        <p className="mt-6 text-[15px]">
          <Link href="/materiali" className="font-bold text-minus hover:underline">
            ← Назад към всички материали
          </Link>
        </p>
      </Section>
    </main>
  );
}
