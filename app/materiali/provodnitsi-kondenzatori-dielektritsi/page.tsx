import Link from "next/link";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Formula from "@/components/Formula";
import LessonNav from "@/components/LessonNav";
import Quiz from "@/components/Quiz";
import RichText from "@/components/RichText";
import Section from "@/components/Section";
import PredictionQuestion from "@/components/interactives/PredictionQuestion";
import {
  CavityChargeFigure,
  TwoSpheresFigure,
} from "@/components/interactives/ConductorGeometryFigures";
import {
  CapacitorDielectricLab,
  DielectricConfigurationGuide,
  GaussShellExplorer,
} from "@/components/interactives/ElectrostaticsReviewLabs";
import type { QuizQuestion } from "@/lib/types";

const PAGE_TITLE = "Проводници, кондензатори и диелектрици · Преговор";
const PAGE_DESCRIPTION =
  "Интерактивен преговор по електростатика: проводници, закон на Гаус, кондензатори, енергия и диелектрици.";

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
  { id: "conductors", n: "§2", label: "Проводници" },
  { id: "gauss", n: "§3", label: "Гаус" },
  { id: "capacitors", n: "§4", label: "Кондензатори" },
  { id: "constant", n: "§5", label: "Q или V" },
  { id: "dielectrics", n: "§6", label: "Диелектрици" },
  { id: "strategy", n: "§7", label: "Стратегии" },
  { id: "check", n: "§8", label: "Самопроверка" },
] as const;

const REVIEW_QUIZ: QuizQuestion[] = [
  {
    question:
      "Неутрална концентрична сферична черупка има заряд $+q$ в центъра. Каква е плътността по външната повърхност с радиус $b$?",
    options: [
      { text: "$\\sigma=q/(4\\pi b^2)$", correct: true },
      { text: "$\\sigma=-q/(4\\pi b^2)$", correct: false },
      { text: "$\\sigma=0$", correct: false },
    ],
    explanation:
      "Зарядът $+q$ индуцира $-q$ по вътрешната повърхност. Черупката е неутрална, затова отвън остава $+q$. При сферична симетрия той е разпределен равномерно и $\\sigma=q/(4\\pi b^2)$.",
  },
  {
    question:
      "Какъв е еквивалентният капацитет на $4\\,\\mu\\mathrm F$ и $12\\,\\mu\\mathrm F$ в серия?",
    options: [
      { text: "$3\\,\\mu\\mathrm F$", correct: true },
      { text: "$8\\,\\mu\\mathrm F$", correct: false },
      { text: "$16\\,\\mu\\mathrm F$", correct: false },
    ],
    explanation:
      "При последователно свързване $1/C_e=1/C_1+1/C_2$. Следователно $C_e=(4\\cdot12)/(4+12)=3\\,\\mu\\mathrm F$, което е по-малко и от двата капацитета.",
  },
  {
    question:
      "Плосък кондензатор остава свързан към батерия, а разстоянието $d$ между плочите намалява двойно. Какво става със заряда $Q$?",
    options: [
      { text: "Удвоява се", correct: true },
      { text: "Намалява двойно", correct: false },
      { text: "Не се променя", correct: false },
    ],
    explanation:
      "Батерията поддържа $V=\\mathrm{const}$. Понеже $C=\\varepsilon_0A/d$, намаляването на $d$ два пъти удвоява $C$, а от $Q=CV$ следва, че зарядът също се удвоява.",
  },
  {
    question:
      "Същият кондензатор е откачен от батерията. Разстоянието $d$ намалява двойно. Какво става с напрежението $V$?",
    options: [
      { text: "Намалява двойно", correct: true },
      { text: "Удвоява се", correct: false },
      { text: "Не се променя", correct: false },
    ],
    explanation:
      "След откачането $Q=\\mathrm{const}$. Намаляването на $d$ два пъти удвоява $C$, затова $V=Q/C$ намалява два пъти.",
  },
  {
    question:
      "Сфери с радиуси $R$ и $2R$ носят заряди $q$ и $2q$ и са достатъчно отдалечени. Какъв е зарядът на голямата сфера след свързване?",
    options: [
      { text: "$2q$", correct: true },
      { text: "$3q/2$", correct: false },
      { text: "$q$", correct: false },
    ],
    explanation:
      "Още преди свързването потенциалите са равни: $V_1=kq/R$ и $V_2=k(2q)/(2R)=kq/R$. Заряд не протича, затова голямата сфера запазва заряда $2q$.",
  },
  {
    question:
      "Идеален плосък кондензатор остава свързан към батерия. Вкарваме диелектрик, без да местим плочите. Кое е вярно?",
    options: [
      { text: "$V$ и $E$ остават постоянни, $Q$ и $U$ нарастват", correct: true },
      { text: "$Q$ и $E$ остават постоянни, $V$ намалява", correct: false },
      { text: "Само капацитетът се променя", correct: false },
    ],
    explanation:
      "Батерията фиксира $V$, а плочите не се местят, следователно $E=V/d$ също е постоянно. Диелектрикът увеличава $C$, затова $Q=CV$ и $U=CV^2/2$ нарастват.",
  },
  {
    question:
      "Кога формулата $E=\\rho r/(3\\varepsilon_0)$ е приложима в този материал?",
    options: [
      { text: "Вътре в равномерно заредена плътна сфера", correct: true },
      { text: "Във всеки равномерно зареден обем", correct: false },
      { text: "Във всеки проводник", correct: false },
    ],
    explanation:
      "Формулата следва от сферичната симетрия и $Q_{\\mathrm{encl}}=(4\\pi r^3/3)\\rho$. За произволна форма равномерната обемна плътност не е достатъчна, за да получим $E=\\rho r/(3\\varepsilon_0)$.",
  },
];

function Condition({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border-[1.5px] border-minus bg-minus/10 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide text-minus">
      {children}
    </span>
  );
}

function ReviewBox({
  title,
  children,
  tone = "blue",
}: {
  title: string;
  children: React.ReactNode;
  tone?: "blue" | "red" | "green";
}) {
  const color =
    tone === "red" ? "text-plus" : tone === "green" ? "text-ok" : "text-minus";
  return (
    <div className="rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard-sm">
      <p className={`mb-2 text-[11px] font-bold uppercase tracking-[.16em] ${color}`}>{title}</p>
      {children}
    </div>
  );
}

const referenceRows = [
  ["Константа на Кулон", "$k=1/(4\\pi\\varepsilon_0)\\approx8{,}99\\times10^9$"],
  ["Проницаемост на вакуума", "$\\varepsilon_0\\approx8{,}85\\times10^{-12}\\,\\mathrm{F/m}$"],
  ["Поле на точков заряд", "$E=kq/r^2$"],
  ["Потенциал на точков заряд", "$V=kq/r$"],
  ["Вътре в равномерно заредена плътна сфера", "$E=\\rho r/(3\\varepsilon_0)$"],
  ["До проводяща повърхност във вакуум", "$E=\\sigma/\\varepsilon_0$"],
  ["Плосък кондензатор", "$C=\\varepsilon_0A/d$"],
  ["Плосък кондензатор с диелектрик", "$C=\\varepsilon_r\\varepsilon_0A/d$"],
  ["Сферичен кондензатор", "$C=4\\pi\\varepsilon_0R_1R_2/(R_2-R_1)$"],
  ["Паралелно свързване", "$C_e=\\sum_i C_i$"],
  ["Последователно свързване", "$1/C_e=\\sum_i1/C_i$"],
  ["Енергия", "$U=CV^2/2=Q^2/(2C)=QV/2$"],
  ["Плътност на енергията", "$u=\\varepsilon E^2/2$"],
] as const;

export default function ElectrostaticsReviewPage() {
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
          <span>Физика · глава 4</span>
        </nav>
        <div className="mt-3 flex flex-wrap gap-2">
          <Condition>Преговор след урок</Condition>
          <Condition>15-20 мин</Condition>
        </div>
        <h1 className="mb-3 mt-4 font-serif text-[clamp(36px,7vw,52px)] font-bold leading-[1.04] text-ink">
          Проводници, <span className="text-plus">кондензатори</span> и{" "}
          <span className="text-minus">диелектрици</span>
        </h1>
        <p className="text-[17px] text-muted">
          Стегнат преговор по електростатика в среди: основни правила, условия за
          приложимост, алгоритми за задачи, интерактивни графики и самопроверка.
        </p>
      </header>

      <LessonNav items={NAV} />

      <Section id="map" n="§1" title="Ментална карта на главата">
        <p>
          Цялата глава се свежда до три блока и един диагностичен въпрос. Първо
          възстановете връзките между идеите, после отворете формулите.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <ReviewBox title="Проводници">
            <p className="text-[14.5px]">
              В равновесие полето в материала е нула, проводникът е еквипотенциален, а
              излишният заряд е по повърхностите.
            </p>
          </ReviewBox>
          <ReviewBox title="Кондензатори" tone="red">
            <p className="text-[14.5px]">
              Капацитетът се определя от геометрията и средата. В серия е общ зарядът, в
              паралел е общ потенциалът.
            </p>
          </ReviewBox>
          <ReviewBox title="Диелектрици" tone="green">
            <p className="text-[14.5px]">
              Поляризацията променя полето и увеличава капацитета. Резултатът зависи от
              това дали батерията е свързана.
            </p>
          </ReviewBox>
        </div>
        <div className="mt-5 rounded-r-lg border-l-4 border-plus bg-hl px-5 py-4">
          <p className="text-[11px] font-bold uppercase tracking-[.18em] text-plus">
            Въпросът, който решава половината глава
          </p>
          <p className="mt-1 font-serif text-[24px] font-bold">
            Какво е постоянно: зарядът <RichText text="$Q$" /> или потенциалът{" "}
            <RichText text="$V$" />?
          </p>
        </div>
      </Section>

      <Section id="conductors" n="§2" title="Проводници в електростатично равновесие">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["1", "Полето вътре в проводящия материал е нула."],
            ["2", "Целият проводник е еквипотенциален."],
            ["3", "Излишният заряд е разположен по повърхностите."],
            ["4", "Полето точно отвън е перпендикулярно и $E = \\sigma/\\varepsilon_0$ във вакуум."],
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
        <p className="mt-4">
          Първото правило е причината за останалите. Ако в метала имаше поле, свободните
          заряди щяха да се движат и системата нямаше да е в равновесие.
        </p>

        <h3 className="mt-8 font-serif text-[21px] font-bold">Кухина и индуциран заряд</h3>
        <div className="mt-2">
          <Condition>При концентрични сфери и заряд в центъра</Condition>
        </div>
        <p className="mt-3">
          Точков заряд <RichText text="$+q$" /> е в центъра на сферична кухина с радиус{" "}
          <RichText text="$a$" /> в неутрална проводяща черупка с външен радиус{" "}
          <RichText text="$b$" />. Гаусова повърхност в метала трябва да обхваща нулев пълен
          заряд.
        </p>
        <div className="mt-4">
          <CavityChargeFigure />
        </div>
        <div className="mt-4">
          <Formula
            latex={String.raw`Q_{\mathrm{in}}=-q,\qquad Q_{\mathrm{out}}=+q,\qquad
            \sigma_{\mathrm{in}}=-\frac{q}{4\pi a^2},\quad
            \sigma_{\mathrm{out}}=\frac{q}{4\pi b^2}`}
          />
        </div>
        <div className="mt-4 rounded-r-lg border-l-4 border-minus bg-hl px-4 py-3 text-[15px]">
          <strong>Винаги вярно:</strong> общият заряд по вътрешната повърхност е{" "}
          <RichText text="$-q$" />. <strong>Само при сферичната симетрия:</strong>{" "}
          разпределението е равномерно и можем да делим на <RichText text="$4\pi a^2$" />.
        </div>
        <p className="mt-4">
          Ако черупката има собствен заряд <RichText text="$Q$" />, вътрешната повърхност
          остава с <RichText text="$-q$" />, а външната носи <RichText text="$Q+q$" />.
        </p>
        <ReviewBox title="Заземяване">
          <p>
            За тази сферично симетрична конфигурация, при липса на външни заряди, заземяването
            налага <RichText text="$V=0$" /> и зарядът от външната повърхност изтича в Земята.
            Вътрешният индуциран заряд <RichText text="$-q$" /> остава.
          </p>
        </ReviewBox>

        <h3 className="mt-8 font-serif text-[21px] font-bold">Свързване на две сфери</h3>
        <div className="mt-2">
          <Condition>При пренебрежимо взаимно влияние</Condition>
        </div>
        <p className="mt-3">
          Две достатъчно отдалечени сфери се свързват с жица. Зарядът се запазва, а
          потенциалите се изравняват.
        </p>
        <div className="mt-4 xl:-mx-[5.5rem] 2xl:-mx-[9.5rem]">
          <TwoSpheresFigure />
        </div>
        <div className="mt-4">
          <Formula
            latex={String.raw`Q_1'+Q_2'=Q_1+Q_2,\qquad
            \frac{Q_1'}{R_1}=\frac{Q_2'}{R_2},\qquad
            Q_i'=\frac{R_i}{R_1+R_2}(Q_1+Q_2)`}
          />
        </div>
        <p className="mt-4">
          По-малката сфера има по-голяма повърхностна плътност и по-силно поле, защото{" "}
          <RichText text="$\sigma\propto1/R$" />. Това стои зад действието на острите върхове.
        </p>
        <div className="mt-4 rounded-r-lg border-l-4 border-plus bg-plus/10 px-4 py-3 text-[15px]">
          <strong>Енергия:</strong> ако началните потенциали са различни, част от
          електростатичната енергия се разсейва и <RichText text="$U_f<U_i$" />. Ако те още
          в началото са равни, заряд не протича и <RichText text="$U_f=U_i$" />.
        </div>
      </Section>

      <Section id="gauss" n="§3" title="Теорема на Гаус за сферични системи">
        <Formula
          latex={String.raw`\oint\vec E\cdot d\vec A=\frac{Q_{\mathrm{encl}}}{\varepsilon_0}
          \quad\Longrightarrow\quad
          \vec E=\frac{Q_{\mathrm{encl}}(r)}{4\pi\varepsilon_0r^2}\,\hat r`}
        />
        <ol className="mt-5 list-decimal space-y-2 pl-5">
          <li>Разделете пространството на области според радиусите на границите.</li>
          <li>
            За всяка област намерете <RichText text="$Q_{\mathrm{encl}}(r)$" />, включително
            индуцираните заряди.
          </li>
          <li>Приложете закона на Гаус поотделно във всяка област.</li>
          <li>Проверете, че резултатът в проводящия материал е нула.</li>
          <li>
            Вътре в равномерно заредена <strong>плътна сфера</strong> полето е линейно:{" "}
            <RichText text="$E=\rho r/(3\varepsilon_0)$" />.
          </li>
        </ol>

        <div className="mt-6 xl:-mx-[5.5rem] 2xl:-mx-[9.5rem]">
          <GaussShellExplorer />
        </div>

        <h3 className="mt-8 font-serif text-[21px] font-bold">Резултатът по области</h3>
        <p className="mt-2">
          За плътна сфера с радиус <RichText text="$R_1$" /> и заряд{" "}
          <RichText text="$Q_1$" />, обградена от концентрична черупка{" "}
          <RichText text="$R_2<R_3$" /> със собствен заряд <RichText text="$Q$" />:
        </p>
        <div className="mt-4 overflow-x-auto rounded-[10px] border-[1.5px] border-ink bg-surface shadow-hard-sm">
          <table className="w-full min-w-[650px] border-collapse text-[14px]">
            <thead className="bg-hl">
              <tr>
                <th className="p-3 text-left">Област</th>
                <th className="p-3 text-left">Обхванат заряд</th>
                <th className="p-3 text-left">Поле</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {[
                [
                  "$r<R_1$",
                  "$Q_{\\mathrm{encl}}=Q_1r^3/R_1^3$",
                  String.raw`$E=Q_1r/(4\pi\varepsilon_0R_1^3)$`,
                ],
                [
                  "$R_1<r<R_2$",
                  "$Q_{\\mathrm{encl}}=Q_1$",
                  String.raw`$E=Q_1/(4\pi\varepsilon_0r^2)$`,
                ],
                ["$R_2<r<R_3$", "$Q_{\\mathrm{encl}}=0$", "$E=0$"],
                [
                  "$r>R_3$",
                  "$Q_{\\mathrm{encl}}=Q_1+Q$",
                  String.raw`$E=(Q_1+Q)/(4\pi\varepsilon_0r^2)$`,
                ],
              ].map(([region, charge, field]) => (
                <tr key={region}>
                  <td className="p-3">
                    <RichText text={region} />
                  </td>
                  <td className="p-3">
                    <RichText text={charge} />
                  </td>
                  <td className="p-3">
                    <RichText text={field} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          Следователно <RichText text="$\sigma(R_2)=-Q_1/(4\pi R_2^2)$" /> и{" "}
          <RichText text="$\sigma(R_3)=(Q_1+Q)/(4\pi R_3^2)$" />. При отрицателен{" "}
          <RichText text="$Q_1$" /> знаците се обръщат, но алгоритъмът не се променя.
        </p>
      </Section>

      <Section id="capacitors" n="§4" title="Кондензатори">
        <ReviewBox title="Дефиниция">
          <p>
            Капацитетът на система от два проводника с равни и противоположни заряди{" "}
            <RichText text="$\pm Q$" /> и потенциална разлика <RichText text="$V$" /> е:
          </p>
          <div className="mt-3">
            <RichText text="$C=Q/V,\qquad [C]=\mathrm F=\mathrm{C/V}$" />
          </div>
        </ReviewBox>
        <p className="mt-4">
          Капацитетът се определя от <strong>геометрията и средата</strong>. Ако зарядът се
          удвои, потенциалът също се удвоява и отношението остава същото.
        </p>

        <div className="mt-5 overflow-x-auto rounded-[10px] border-[1.5px] border-ink bg-surface shadow-hard-sm">
          <table className="w-full min-w-[600px] border-collapse text-[14.5px]">
            <thead className="bg-hl">
              <tr>
                <th className="p-3 text-left">Конфигурация</th>
                <th className="p-3 text-left">Капацитет</th>
                <th className="p-3 text-left">Условие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {[
                ["Плосък, вакуум", String.raw`$C=\varepsilon_0A/d$`, "Пренебрегваме краищата"],
                [
                  "Плосък, диелектрик",
                  String.raw`$C=\varepsilon_r\varepsilon_0A/d$`,
                  "Пълно запълване",
                ],
                [
                  "Сферичен",
                  String.raw`$C=4\pi\varepsilon_0R_1R_2/(R_2-R_1)$`,
                  "Концентрични сфери",
                ],
                [
                  "Изолирана сфера",
                  String.raw`$C=4\pi\varepsilon_0R$`,
                  String.raw`$V(\infty)=0$`,
                ],
              ].map(([name, formula, condition]) => (
                <tr key={name}>
                  <td className="p-3 font-semibold">{name}</td>
                  <td className="p-3">
                    <RichText text={formula} />
                  </td>
                  <td className="p-3 text-muted">
                    <RichText text={condition} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <ReviewBox title="Последователно">
            <p>
              Общ е <strong>зарядът</strong>, а потенциалните разлики се сумират.
            </p>
            <div className="mt-3">
              <Formula
                latex={String.raw`\begin{aligned}
                  Q_1&=Q_2=\cdots=Q,\\
                  V&=\sum_i V_i,\\
                  \frac{1}{C_e}&=\sum_i\frac{1}{C_i}
                \end{aligned}`}
              />
            </div>
            <p className="mt-2 text-[14px] text-muted">
              <RichText text="$C_e<\min(C_i)$: еквивалентният капацитет е по-малък от всеки отделен." />
            </p>
          </ReviewBox>
          <ReviewBox title="Паралелно" tone="red">
            <p>
              Обща е <strong>потенциалната разлика</strong>, а зарядите се сумират.
            </p>
            <div className="mt-3">
              <Formula
                latex={String.raw`\begin{aligned}
                  V_1&=V_2=\cdots=V,\\
                  Q&=\sum_i Q_i,\\
                  C_e&=\sum_i C_i
                \end{aligned}`}
              />
            </div>
            <p className="mt-2 text-[14px] text-muted">
              <RichText text="$C_e>C_i$: еквивалентният капацитет е по-голям от всеки отделен." />
            </p>
          </ReviewBox>
        </div>

        <h3 className="mt-8 font-serif text-[21px] font-bold">Енергия</h3>
        <div className="mt-3">
          <Formula
            latex={String.raw`U=\frac12CV^2=\frac{Q^2}{2C}=\frac12QV,\qquad
            u=\frac12\varepsilon E^2`}
          />
        </div>
        <p className="mt-4">
          Трите израза са еквивалентни. При фиксиран заряд най-удобен е{" "}
          <RichText text="$Q^2/(2C)$" />, а при фиксиран потенциал използвайте{" "}
          <RichText text="$CV^2/2$" />.
        </p>
      </Section>

      <Section id="constant" n="§5" title="Ключовият въпрос: заряд или потенциал?">
        <PredictionQuestion
          prompt="Батерията остава свързана. Вкарваме диелектрик докрай, без да местим плочите. Какво става с полето $E$?"
          options={[
            { text: "Нараства $\\varepsilon_r$ пъти", correct: false },
            { text: "Остава постоянно", correct: true },
            { text: "Намалява $\\varepsilon_r$ пъти", correct: false },
          ]}
          explanation="Батерията фиксира $V$, а разстоянието $d$ не се променя. За идеален плосък кондензатор $E=V/d=\mathrm{const}$. Допълнителният заряд идва от батерията."
        />

        <div className="mt-6 xl:-mx-[5.5rem] 2xl:-mx-[9.5rem]">
          <CapacitorDielectricLab />
        </div>

        <h3 className="mt-8 font-serif text-[21px] font-bold">Таблицата за решение</h3>
        <div className="mt-4 overflow-x-auto rounded-[10px] border-[1.5px] border-ink bg-surface shadow-hard-sm">
          <table className="w-full min-w-[680px] border-collapse text-[14px]">
            <thead className="bg-hl">
              <tr>
                <th className="p-3 text-left"></th>
                <th className="p-3 text-left">Откачен</th>
                <th className="p-3 text-left">Свързан</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              <tr>
                <th className="p-3 text-left">Фиксирано</th>
                <td className="p-3">
                  зарядът <RichText text="$Q$" />
                </td>
                <td className="p-3">
                  потенциалът <RichText text="$V$" />
                </td>
              </tr>
              <tr>
                <th className="p-3 text-left">При промяна на C</th>
                <td className="p-3">
                  променят се <RichText text="$V,E,U$" />
                </td>
                <td className="p-3">
                  променят се <RichText text="$Q,U$" />
                </td>
              </tr>
              <tr>
                <th className="p-3 text-left">Пълно вкарване на диелектрик</th>
                <td className="p-3">
                  <RichText text="$C\uparrow,\ V\downarrow,\ E\downarrow,\ U\downarrow$" />
                </td>
                <td className="p-3">
                  <RichText text="$C\uparrow,\ Q\uparrow,\ E=\mathrm{const},\ U\uparrow$" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[14px] text-muted">
          Последното <RichText text="$E=\mathrm{const}$" /> е вярно за идеален плосък
          кондензатор при непроменено разстояние между плочите.
        </p>
        <div className="mt-4 rounded-r-lg border-l-4 border-minus bg-hl px-4 py-3 text-[15px]">
          При откачен кондензатор полето изтегля диелектрика за сметка на енергията си. При
          свързан кондензатор батерията прехвърля допълнителен заряд и внася енергия в
          системата.
        </div>
      </Section>

      <Section id="dielectrics" n="§6" title="Диелектрици и частично запълване">
        <p>
          В линеен диелектрик <RichText text="$\varepsilon=\varepsilon_r\varepsilon_0$" /> и{" "}
          <RichText text="$\varepsilon_r\ge1$" />. При пълно запълване:
        </p>
        <div className="mt-4">
          <Formula
            latex={String.raw`C\longrightarrow\varepsilon_rC,\qquad
            E\longrightarrow\frac{E_0}{\varepsilon_r}\quad(Q=\mathrm{const})`}
          />
        </div>
        <p className="mt-4">
          Поляризацията създава свързани заряди по повърхностите на диелектрика. Тяхното поле
          е насочено срещу външното. При свързана батерия свободният заряд по плочите се
          увеличава, докато потенциалът остава фиксиран.
        </p>

        <div className="mt-6 xl:-mx-[5.5rem] 2xl:-mx-[9.5rem]">
          <DielectricConfigurationGuide />
        </div>

        <h3 className="mt-8 font-serif text-[21px] font-bold">Частично вкаран диелектрик</h3>
        <p className="mt-2">
          Диелектрик с дължина <RichText text="$x$" /> влиза странично в кондензатор с дължина{" "}
          <RichText text="$l$" />, ширина <RichText text="$a$" /> и разстояние{" "}
          <RichText text="$d$" />. Запълнената и празната част са паралелни:
        </p>
        <div className="mt-4">
          <Formula
            latex={String.raw`C(x)=\frac{\varepsilon_0a}{d}
            \left[l+(\varepsilon_r-1)x\right]`}
          />
        </div>
        <p className="mt-4">
          Зависимостта е линейна по <RichText text="$x$" />. Това обяснява защо промяната на
          припокритата площ е удобен начин за плавно настройване на капацитета.
        </p>
      </Section>

      <Section id="strategy" n="§7" title="Стратегии, справочник и чести грешки">
        <div className="grid gap-4 sm:grid-cols-2">
          <ReviewBox title="Тип А · Сфери и черупки">
            <ol className="list-decimal space-y-1.5 pl-5 text-[14.5px]">
              <li>Начертайте и означете всяка повърхност.</li>
              <li>Определете индуцираните заряди отвътре навън.</li>
              <li>Приложете Гаус във всяка област.</li>
              <li>Разделете всеки повърхностен заряд на площта му.</li>
            </ol>
          </ReviewBox>
          <ReviewBox title="Тип Б · Свързани проводници" tone="red">
            <ol className="list-decimal space-y-1.5 pl-5 text-[14.5px]">
              <li>Запазете пълния заряд.</li>
              <li>Изравнете потенциалите.</li>
              <li>Решете системата.</li>
              <li>Сметнете началната и крайната енергия поотделно.</li>
            </ol>
          </ReviewBox>
          <ReviewBox title="Тип В · Мрежи от кондензатори" tone="green">
            <ol className="list-decimal space-y-1.5 pl-5 text-[14.5px]">
              <li>Опростявайте до един еквивалентен капацитет.</li>
              <li>Върнете се назад към потенциалите и зарядите.</li>
              <li>В серия проверете зарядите, в паралел потенциалите.</li>
              <li>При мост първо проверете симетрията.</li>
            </ol>
          </ReviewBox>
          <ReviewBox title="Тип Г · Диелектрици">
            <ol className="list-decimal space-y-1.5 pl-5 text-[14.5px]">
              <li>Свързан или откачен?</li>
              <li>Пресметнете новия капацитет.</li>
              <li>
                Използвайте <RichText text="$C=Q/V$" /> за останалото.
              </li>
              <li>При частично запълване разпознайте серия или паралел.</li>
            </ol>
          </ReviewBox>
        </div>

        <h3 className="mt-9 font-serif text-[21px] font-bold">Бърз справочник</h3>
        <div className="mt-4 overflow-x-auto rounded-[10px] border-[1.5px] border-ink bg-surface shadow-hard-sm">
          <table className="w-full min-w-[650px] border-collapse text-[13.5px]">
            <thead className="bg-hl">
              <tr>
                <th className="p-3 text-left">Величина или случай</th>
                <th className="p-3 text-left">Израз</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {referenceRows.map(([label, formula]) => (
                <tr key={label}>
                  <td className="p-3">{label}</td>
                  <td className="p-3 font-semibold">
                    <RichText text={formula} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mt-9 font-serif text-[21px] font-bold">Чести грешки</h3>
        <ul className="mt-4 space-y-3">
          {[
            "При заземяване на разглежданата сферична конфигурация се маха външният заряд, не вътрешният индуциран.",
            "Последователните кондензатори имат общ заряд, не общ потенциал.",
            "Пропуска се εᵣ във формулата за капацитет при диелектрик.",
            "Приема се фиксиран заряд, докато батерията още е свързана.",
            "Използва се гаусова повърхност, без да се отчетат индуцираните заряди.",
            "Енергията се приема за запазена при свързване на проводници с различни потенциали.",
            "Специален резултат при сферична симетрия се използва за произволна геометрия.",
            "Радиусите остават в сантиметри вместо да се превърнат в метри.",
          ].map((mistake, index) => (
            <li
              key={mistake}
              className="flex gap-3 rounded-[10px] border-[1.5px] border-rule bg-surface px-4 py-3"
            >
              <span className="mt-0.5 font-bold tabular-nums text-plus">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-[14.5px]">{mistake}</span>
            </li>
          ))}
        </ul>

        <details className="mt-8 rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard-sm">
          <summary className="cursor-pointer font-serif text-[20px] font-bold">
            Типични изпитни въпроси
          </summary>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-[15px]">
            <li>
              Формулирайте условията за електростатично равновесие и обяснете защо излишният
              заряд е по повърхността.
            </li>
            <li>
              Заряд е поставен в центъра на сферична кухина в неутрална концентрична черупка.
              Намерете зарядите, плътностите и полето по области.
            </li>
            <li>
              Как се променят зарядите и потенциалът при свързване на две отдалечени заредени
              сфери? Кога енергията намалява?
            </li>
            <li>Изведете капацитета на плосък кондензатор.</li>
            <li>
              Плосък кондензатор се стеснява до <RichText text="$d/2$" />. Сравнете{" "}
              <RichText text="$C,Q,V,U$" /> при откачена и при свързана батерия.
            </li>
            <li>
              Изведете еквивалентния капацитет за двете конфигурации с диелектрици{" "}
              <RichText text="$\varepsilon$" /> и <RichText text="$2\varepsilon$" />.
            </li>
            <li>Обяснете как поляризацията влияе на полето.</li>
          </ol>
        </details>
      </Section>

      <Section id="check" n="§8" title="Бърза самопроверка">
        <p className="mb-6">
          Отговорете без справочника. След избор въпросът се заключва и показва верния отговор.
        </p>
        <Quiz questions={REVIEW_QUIZ} />
        <div className="mt-8 rounded-[10px] border-[1.5px] border-ink bg-ink px-5 py-5 text-white shadow-hard">
          <p className="text-[11px] font-bold uppercase tracking-[.18em] text-hl">
            Финален чек
          </p>
          <p className="mt-2 text-[15.5px]">
            Ако можете да обясните защо <RichText text="$E=0$" /> в метала, да изберете между{" "}
            <RichText text="$Q=\mathrm{const}$" /> и <RichText text="$V=\mathrm{const}$" /> и да
            разпознаете серия спрямо паралел при диелектрици, главата е организирана.
          </p>
        </div>
        <p className="mt-6 text-[15px]">
          <Link href="/materiali" className="font-bold text-minus hover:underline">
            ← Назад към всички материали
          </Link>
        </p>
      </Section>
    </main>
  );
}
