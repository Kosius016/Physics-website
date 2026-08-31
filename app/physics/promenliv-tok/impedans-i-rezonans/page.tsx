import Link from "next/link";
import Formula from "@/components/Formula";
import LessonNav from "@/components/LessonNav";
import Quiz from "@/components/Quiz";
import RichText from "@/components/RichText";
import Section from "@/components/Section";
import type { QuizQuestion } from "@/lib/types";
import ACProblemSet from "@/components/interactives/ACProblemSet";
import { RLCLaboratory, ResonanceExplorer } from "@/components/interactives/ACCircuitLabs";
import {
  CapacitorDerivativeLab,
  InductorDerivativeLab,
  ReactancePlot,
  ResistorACLab,
} from "@/components/interactives/ACElementLabs";
import {
  RLCPhasorLab,
  RotatingVectorLab,
  TwoPhasorLab,
} from "@/components/interactives/ACPhasorLabs";
import { PowerVisualizer, RMSVisualizer } from "@/components/interactives/ACPowerLabs";
import {
  ACSourceCircuit,
  SineWaveLab,
  WaveComparator,
} from "@/components/interactives/ACWaveLabs";
import PredictionQuestion from "@/components/interactives/PredictionQuestion";
import {
  TeacherModeProvider,
  TeacherModeToggle,
  TeacherNote,
} from "@/components/interactives/TeacherMode";

export const metadata = {
  title: "Променлив ток: реактанс, импеданс и резонанс · SingularityLab",
  description:
    "От LC трептенията към принудените: фаза, фазори, извеждане на X_C, X_L, Z, резонанс, ефективни стойности и мощност, с интерактивни SVG лаборатории.",
};

const SECTION_NAV = [
  { id: "bridge", n: "§1", label: "Мостът" },
  { id: "alternating", n: "§2", label: "Редуването" },
  { id: "sinus", n: "§3", label: "Синусоидата" },
  { id: "phase", n: "§4", label: "Фазата" },
  { id: "rotating", n: "§5", label: "Въртящ вектор" },
  { id: "resistor", n: "§6", label: "Резистор" },
  { id: "capacitor", n: "§7", label: "Кондензатор" },
  { id: "inductor", n: "§8", label: "Бобина" },
  { id: "reactance", n: "§9", label: "Двата реактанса" },
  { id: "phasors", n: "§10", label: "Фазори" },
  { id: "impedance", n: "§11", label: "Импеданс" },
  { id: "resonance", n: "§12", label: "Резонанс" },
  { id: "power", n: "§13", label: "Мощност" },
  { id: "problems", n: "§14", label: "Задачи" },
  { id: "recap", n: "§15", label: "Обобщение" },
] as const;

const BLEED = "xl:-mr-[11rem] 2xl:-mr-[19rem]";

function Wide({ children }: { children: React.ReactNode }) {
  return <div className={BLEED}>{children}</div>;
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-5 rounded-r-lg border-l-4 border-plus bg-hl px-4 py-3 text-[16px] leading-relaxed text-ink">
      {children}
    </div>
  );
}

/** Разгъваем блок с пълната алгебра: не прекъсва разказа, но е на един клик. */
function Derivation({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group my-5 rounded-[8px] border-[1.5px] border-rule px-4 py-2.5 open:border-ink">
      <summary className="cursor-pointer text-[15px] font-semibold text-ink select-none">
        {title}
      </summary>
      <div className="mt-3 space-y-3 border-t-[1.5px] border-dashed border-rule pt-3">{children}</div>
    </details>
  );
}

/** Подзаглавие вътре в секция. */
function Sub({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-7 mb-3 font-serif text-[19px] font-bold text-ink">{children}</h3>
  );
}

const CHECK_QUESTIONS: QuizQuestion[] = [
  {
    question:
      "Изведете от $q=Cv$ каква е фазовата разлика между тока и напрежението на кондензатор. Кой отговор е верен?",
    options: [
      {
        text: "Токът изпреварва напрежението с $90^\\circ$, защото $i=C\\,dv/dt$, а производната на синус е косинус",
        correct: true,
        why: "$v=V_0\\sin\\omega t$ дава $i=\\omega CV_0\\cos\\omega t=\\omega CV_0\\sin(\\omega t+\\pi/2)$: максимумът на тока идва четвърт период по-рано.",
      },
      {
        text: "Токът изостава от напрежението с $90^\\circ$",
        correct: false,
        why: "Това е поведението на бобината. При кондензатора токът е най-голям, когато напрежението тъкмо минава през нулата, тоест преди неговия максимум.",
      },
      {
        text: "Фазова разлика няма, защото $q$ и $v$ са пропорционални",
        correct: false,
        why: "$q$ и $v$ наистина са в фаза. Токът обаче не е зарядът, а неговата производна, и точно диференцирането внася четвъртината период.",
      },
      {
        text: "Разликата зависи от честотата и расте с $\\omega$",
        correct: false,
        why: "С $\\omega$ расте амплитудата на тока ($I_0=\\omega CV_0$), но фазовата разлика остава точно $\\pi/2$ при всяка честота.",
      },
    ],
    explanation:
      "Цялата фаза идва от една операция: диференцирането завърта синусоидата на $+90^\\circ$ и я умножава по $\\omega$.",
  },
  {
    question: "Защо $X_C$ намалява с нарастване на честотата?",
    options: [
      {
        text: "Защото при по-бърза промяна на напрежението през кондензатора преминава по-голям заряд за единица време, значи по-голям ток",
        correct: true,
        why: "$i=C\\,dv/dt$: при същата амплитуда $V_0$ по-голямото $\\omega$ прави наклона по-стръмен, токът расте и отношението $V_0/I_0=1/(\\omega C)$ пада.",
      },
      {
        text: "Защото капацитетът расте с честотата",
        correct: false,
        why: "$C$ е геометрична характеристика на кондензатора и не зависи от честотата. Мени се само скоростта на презареждане.",
      },
      {
        text: "Защото при висока честота диелектрикът пробива",
        correct: false,
        why: "Пробивът е съвсем друго явление и не участва в извеждането. $X_C=1/(\\omega C)$ следва само от $i=C\\,dv/dt$.",
      },
      {
        text: "Защото при по-висока честота кондензаторът се зарежда до по-високо напрежение",
        correct: false,
        why: "Точно обратното: при бърза смяна плочите не успяват да се заредят до голямо напрежение. Затова същият ток изисква **по-малко** напрежение, тоест отношението $V_0/I_0$ пада.",
      },
    ],
    explanation:
      "Едно и също уравнение $i=C\\,dv/dt$ се чете двояко: при по-стръмен наклон токът е по-голям, а при бърза смяна напрежението остава малко.",
  },
  {
    question: "Защо $X_L$ расте с нарастване на честотата?",
    options: [
      {
        text: "Защото $v=L\\,di/dt$: по-бързата промяна на тока поражда по-голямо ЕДН на самоиндукция, което пречи на тока",
        correct: true,
        why: "При същата амплитуда $I_0$ увеличаването на $\\omega$ прави $di/dt$ по-голямо, значи трябва по-голямо напрежение за същия ток: $V_0/I_0=\\omega L$.",
      },
      {
        text: "Защото индуктивността расте с честотата",
        correct: false,
        why: "$L$ зависи от геометрията на намотката, не от честотата. Расте скоростта на промяна, не самата индуктивност.",
      },
      {
        text: "Защото при висока честота съпротивлението на жицата расте",
        correct: false,
        why: "Реален ефект от този вид съществува, но той е извън модела. Идеалната бобина има $R=0$ и все пак дава $X_L=\\omega L$.",
      },
      {
        text: "Защото магнитната енергия $\\tfrac12LI^2$ расте с честотата",
        correct: false,
        why: "Тази енергия зависи от тока, не от честотата. Причината е в закона на Фарадей през $di/dt$.",
      },
    ],
    explanation: "Законът на Ленц в количествен вид: колкото по-рязка е промяната, толкова по-силно противодействие.",
  },
  {
    question: "Защо при много ниска честота бобината се държи почти като парче проводник?",
    options: [
      {
        text: "Защото $X_L=\\omega L\\to0$ при $\\omega\\to0$: бавната промяна почти не поражда ЕДН",
        correct: true,
        why: "В границата на постоянен ток $di/dt=0$, значи $v=L\\,di/dt=0$ и остава само омовото съпротивление на намотката.",
      },
      {
        text: "Защото магнитното поле изчезва при ниска честота",
        correct: false,
        why: "Полето не изчезва, при постоянен ток то е дори постоянно и максимално. Пречи не полето, а неговата промяна.",
      },
      {
        text: "Защото при ниска честота токът не успява да влезе в намотката",
        correct: false,
        why: "Точно обратното: при ниска честота токът тече най-свободно. Ограничението расте с честотата.",
      },
      {
        text: "Защото индуктивността намалява при бавни процеси",
        correct: false,
        why: "$L$ не се променя. Променя се само множителят $\\omega$ пред нея.",
      },
    ],
    explanation: "Проверката на границите е най-бързият тест за всяка формула за реактанс.",
  },
  {
    question: "Защо в границата на постоянен ток кондензаторът се държи като прекъсване?",
    options: [
      {
        text: "Защото $X_C=1/(\\omega C)\\to\\infty$ при $\\omega\\to0$: постоянно напрежение не поддържа ток",
        correct: true,
        why: "При постоянно $v$ имаме $dv/dt=0$, значи $i=C\\,dv/dt=0$. Веднъж зареден, кондензаторът спира тока.",
      },
      {
        text: "Защото зарядите не могат да преминат през диелектрика, значи през кондензатор изобщо не тече ток",
        correct: false,
        why: "Първата половина е вярна, но изводът е прекалено силен: при променливо напрежение във веригата тече ток, докато плочите се презареждат. Спира се само **постоянният** ток.",
      },
      {
        text: "Защото капацитетът клони към нула при ниска честота",
        correct: false,
        why: "$C$ остава същият. Клони към безкрайност реактансът, а не към нула капацитетът.",
      },
      {
        text: "Защото напрежението върху кондензатора става нула",
        correct: false,
        why: "Обратно: при установен постоянен режим цялото напрежение на източника пада именно върху кондензатора.",
      },
    ],
    explanation:
      "Тази граница обяснява защо кондензаторите се ползват за отделяне на постоянна съставка от променлив сигнал.",
  },
  {
    question: "Какво става с импеданса, когато $X_L=X_C$?",
    options: [
      {
        text: "$Z=R$: това е най-малката възможна стойност за дадената верига",
        correct: true,
        why: "В $Z=\\sqrt{R^2+(X_L-X_C)^2}$ вторият член е квадрат, значи не може да е отрицателен. Нулата му дава минимум на $Z$ и максимум на тока.",
      },
      {
        text: "$Z=0$, защото двете реактивни съпротивления се унищожават напълно",
        correct: false,
        why: "Унищожава се само реактивната част. Резисторът остава и точно той ограничава тока при резонанс.",
      },
      {
        text: "$Z=R+X_L+X_C$, тоест максимална стойност",
        correct: false,
        why: "Реактансите никога не се събират скаларно с $R$: техните фазори са перпендикулярни на неговия.",
      },
      {
        text: "$Z=2X_L$, защото двете реактивни напрежения са равни",
        correct: false,
        why: "Равни по големина, но противоположни по посока: сборът им е нула, а не удвоена стойност.",
      },
    ],
    explanation: "Оттук следва и че при резонанс токът и напрежението на източника са в фаза.",
  },
  {
    question: "Защо резонансът настъпва точно при честотата на свободните LC трептения?",
    options: [
      {
        text: "Защото условието $\\omega L=1/(\\omega C)$ дава $\\omega^2=1/(LC)$ - същото уравнение, което дава и собствената честота",
        correct: true,
        why: "Уравнението $Lq''+q/C=0$ води до $\\omega_0^2=1/(LC)$; условието $X_L=X_C$ води до същото. Едно и също съотношение между $L$ и $C$, погледнато веднъж без и веднъж с източник.",
      },
      {
        text: "Съвпадение, което важи само за последователни вериги",
        correct: false,
        why: "Не е съвпадение: и двете условия изразяват равновесие между енергията в бобината и в кондензатора. Върху $\\omega_0$ типът на веригата влияе само чрез това как е дефинирано резонансното условие.",
      },
      {
        text: "Защото при резонанс резисторът престава да разсейва енергия",
        correct: false,
        why: "Обратно: при резонанс токът е максимален и разсейването в резистора е най-голямо.",
      },
      {
        text: "Защото източникът принуждава $L$ и $C$ да работят с една и съща честота",
        correct: false,
        why: "Той ги принуждава при всяка честота. Специалното при $\\omega_0$ е, че точно там принудата съвпада със собствения ритъм на системата.",
      },
    ],
    explanation:
      "Задвижваната система откликва най-силно, когато я разклащаме с нейната собствена честота: същият принцип като при махало.",
  },
  {
    question: "Какво означава отрицателен фазов ъгъл $\\phi$ при уговорката $v=V_0\\sin\\omega t$, $i=I_0\\sin(\\omega t-\\phi)$?",
    options: [
      {
        text: "Токът достига максимума си преди напрежението: веригата е капацитивна, $X_C>X_L$",
        correct: true,
        why: "При $\\phi<0$ аргументът $\\omega t-\\phi$ изпреварва $\\omega t$, значи токът върви напред. От $\\tan\\phi=(X_L-X_C)/R$ това изисква $X_C>X_L$.",
      },
      {
        text: "Токът тече в обратна посока",
        correct: false,
        why: "Обръщането на посоката би било фазова разлика $180^\\circ$. Отрицателният ъгъл е изместване във времето, не смяна на знака.",
      },
      {
        text: "Веригата е индуктивна",
        correct: false,
        why: "Индуктивната верига дава $\\phi>0$: там напрежението изпреварва тока.",
      },
      {
        text: "Средната мощност е отрицателна",
        correct: false,
        why: "В $P_{\\mathrm{avg}}=V_{\\mathrm{rms}}I_{\\mathrm{rms}}\\cos\\phi$ влиза косинусът, а той е четен: знакът на $\\phi$ не влияе.",
      },
    ],
    explanation: "Знакът на $\\phi$ носи една-единствена информация: кой от двата максимума идва пръв.",
  },
  {
    question: "Защо ефективната стойност се дефинира през квадрата на тока, а не през самия ток?",
    options: [
      {
        text: "Защото нагряването се определя от $i^2R$, а средното на $i$ е нула за всеки период",
        correct: true,
        why: "Търсим постоянен ток със същия топлинен ефект. Ефектът е пропорционален на квадрата, затова осредняваме квадрата и чак после вадим корен.",
      },
      {
        text: "Защото квадратът е винаги положителен и така се избягват отрицателни числа",
        correct: false,
        why: "Положителността е удобно следствие, но не е причината. Ако нагряването беше пропорционално на $|i|$, средната стойност щеше да се дефинира другояче.",
      },
      {
        text: "Защото токът в променлива верига е винаги синусоидален",
        correct: false,
        why: "Дефиницията през квадрата работи за произволна периодична форма; за синусоида просто получаваме удобния множител $1/\\sqrt2$.",
      },
      {
        text: "Защото уредите могат да измерват само квадрати",
        correct: false,
        why: "Уредите се градуират в ефективни стойности именно защото те са физически смислените, а не обратното.",
      },
    ],
    explanation:
      "Множителят $1/\\sqrt2$ не е универсален: той идва от $\\langle\\sin^2\\rangle=1/2$ и важи само за синусоида.",
  },
  {
    question: "Защо мигновената мощност $p(t)=v(t)\\,i(t)$ може да стане отрицателна?",
    options: [
      {
        text: "Защото в част от периода $v$ и $i$ имат различни знаци: тогава енергия се връща от веригата към източника",
        correct: true,
        why: "Отрицателна мощност значи обратна посока на енергийния поток. Тя идва от енергията, натрупана в магнитното или електричното поле през предишната четвъртина от периода.",
      },
      {
        text: "Защото резисторът понякога охлажда веригата",
        correct: false,
        why: "Разсейването в резистора е $i^2R\\ge0$ винаги. Отрицателните участъци идват изцяло от реактивните елементи.",
      },
      {
        text: "Защото знакът на $\\phi$ може да е отрицателен",
        correct: false,
        why: "Знакът на $\\phi$ определя кой изпреварва кого. Отрицателни участъци се появяват при всяко $\\phi\\ne0$, независимо от знака.",
      },
      {
        text: "Защото средната мощност е нула",
        correct: false,
        why: "Средната мощност е нула само в чисто реактивен случай. Отрицателни участъци има и когато средната мощност е положителна.",
      },
    ],
    explanation:
      "Оттук идва разликата между пълна мощност $V_{\\mathrm{rms}}I_{\\mathrm{rms}}$ и активна $V_{\\mathrm{rms}}I_{\\mathrm{rms}}\\cos\\phi$.",
  },
  {
    question: "Защо средната мощност в идеална бобина е точно нула?",
    options: [
      {
        text: "Защото $\\phi=90^\\circ$ и $\\cos\\phi=0$: взетата енергия се връща изцяло в рамките на периода",
        correct: true,
        why: "За четвърт период бобината натрупва $\\tfrac12LI_0^2$ в магнитното поле, а през следващата четвърт я връща на източника. Балансът за цял период е нула.",
      },
      {
        text: "Защото през идеална бобина не тече ток",
        correct: false,
        why: "Тече, и то може да е голям: при ниска честота $X_L$ е малко. Липсва разсейване, не ток.",
      },
      {
        text: "Защото напрежението върху идеалната бобина е нула",
        correct: false,
        why: "Напрежението е $\\omega LI_0$ и може да е значително. Нулева е само средната стойност на произведението $vi$.",
      },
      {
        text: "Защото енергията на магнитното поле е нула",
        correct: false,
        why: "Тя е ненулева през целия период; просто се връща обратно, вместо да се превръща в топлина.",
      },
    ],
    explanation: "Реактивните елементи ограничават тока, без да го превръщат в топлина: това е разликата от резистора.",
  },
  {
    question: "Как увеличаването на $R$ променя резонансната крива $I_0(f)$?",
    options: [
      {
        text: "Върхът остава на същата честота, но става по-нисък и по-широк",
        correct: true,
        why: "Положението $f_0=1/(2\\pi\\sqrt{LC})$ не съдържа $R$. Височината е $V_0/R$, а ширината $\\Delta f=R/(2\\pi L)$ расте с $R$: качественият фактор $Q=\\omega_0L/R$ пада.",
      },
      {
        text: "Върхът се измества към по-ниски честоти",
        correct: false,
        why: "Изместване дават само $L$ и $C$. Проверете с плъзгачите: при промяна на $R$ вертикалната резка не мърда.",
      },
      {
        text: "Кривата се вдига, защото по-голямото $R$ дава по-голям ток",
        correct: false,
        why: "Максималният ток е $V_0/R$: по-голямото $R$ винаги дава по-малък връх.",
      },
      {
        text: "Кривата става по-остра, защото загубите потискат страничните честоти",
        correct: false,
        why: "Точно обратното: загубите разширяват върха. Острите резонанси изискват малко $R$, тоест голямо $Q$.",
      },
    ],
    explanation:
      "Затова радиоприемникът иска висок качествен фактор: широк връх би пропуснал и съседните станции.",
  },
];

/**
 * Интерактивна глава: променлив ток (университетско ниво).
 *
 * Червената нишка: всяка нова величина се появява едва след като е била
 * принудена от математиката. $X_C$, $X_L$, $Z$, $\phi$, $\omega_0$,
 * ефективните стойности и средната мощност се извеждат, а не се обявяват.
 * Уговорка за знаците за целия урок:
 *   $v=V_0\sin(\omega t+\phi_V)$, $i=I_0\sin(\omega t+\phi_I)$,
 *   $\Delta\phi=\phi_V-\phi_I$.
 */
export default function AlternatingCurrentLessonPage() {
  return (
    <TeacherModeProvider>
      <main className="mx-auto max-w-3xl px-5 pb-24">
        <header className="pt-11 pb-2">
          <nav
            aria-label="Път до урока"
            className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-muted"
          >
            <Link
              href="/physics"
              className="rounded-sm transition-colors hover:text-minus focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-minus"
            >
              Физика
            </Link>
            <span aria-hidden="true">·</span>
            <Link
              href="/physics?level=university#ac"
              className="rounded-sm transition-colors hover:text-minus focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-minus"
            >
              Променлив ток
            </Link>
          </nav>
          <h1 className="mt-2 mb-2 font-serif text-[clamp(32px,6.6vw,46px)] leading-[1.08] font-bold text-ink">
            Променлив ток: от фазата до импеданса и резонанса
          </h1>
          <p className="text-[17px] text-muted">
            Интерактивна глава: въртящи се вектори и фаза, извеждане на{" "}
            <RichText text="$X_C$, $X_L$ и $Z$" />, резонанс като среща със собствената честота,
            ефективни стойности и мощност
          </p>
        </header>

        <LessonNav items={SECTION_NAV} right={<TeacherModeToggle />} />

        {/* ================================================== §1 */}
        <Section id="bridge" n="§1" title="Мостът: от собствени към принудени трептения">
          <div className="space-y-3">
            <p className="text-[18px] text-ink">
              Предишната глава завърши с контур, в който няма източник: заряден кондензатор,
              бобина и нищо друго. Уравнението, което получихме тогава, беше просто израз на
              второто правило на Кирхоф.
            </p>
          </div>

          <Formula latex={String.raw`L\frac{d^2q}{dt^2}+\frac qC=0`} />

          <p className="mt-3 text-ink/90">
            Разделяме на <RichText text="$L$" /> и получаваме канонично уравнение на хармоничен
            осцилатор:
          </p>
          <Formula latex={String.raw`\frac{d^2q}{dt^2}+\frac{1}{LC}\,q=0`} />

          <p className="mt-3 text-ink/90">
            Коефициентът пред <RichText text="$q$" /> има размерност на квадрат на честота, затова
            получава собствено име:
          </p>
          <Formula latex={String.raw`\omega_0^2\equiv\frac{1}{LC}\qquad\Longrightarrow\qquad q(t)=Q_0\cos(\omega_0t+\phi)`} />

          <p className="mt-3 text-ink/90">
            Токът е производна на заряда, тоест не е нова физика, а едно диференциране:
          </p>
          <Formula latex={String.raw`i=\frac{dq}{dt}=-\omega_0Q_0\sin(\omega_0t+\phi)`} />

          <Callout>
            <strong>Три извода, които ще ползваме до края на главата.</strong>
            <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-[15.5px]">
              <li>
                Синусоидите не са избрани заради удобство: те се появиха{" "}
                <strong>сами</strong>, като решение на уравнението.
              </li>
              <li>
                Диференцирането прави две неща наведнъж:{" "}
                <strong>умножава амплитудата по <RichText text="$\omega$" /></strong> и{" "}
                <strong>измества фазата с четвърт период</strong>. Оттук ще дойдат всички фазови
                разлики по-нататък.
              </li>
              <li>
                Честотата <RichText text="$\omega_0$" /> е свойство на{" "}
                <strong>системата</strong>, а не на нещо външно: тя се определя единствено от{" "}
                <RichText text="$L$" /> и <RichText text="$C$" />.
              </li>
            </ol>
          </Callout>

          <Sub>Новата ситуация</Sub>
          <p className="text-ink/90">
            Сега включваме източник, който <strong>налага</strong> напрежение с честота по свой
            избор:
          </p>
          <Formula latex={String.raw`v(t)=V_0\sin(\omega t+\phi_V)`} />
          <p className="mt-3 text-ink/90">
            Веригата вече не е оставена на себе си. Тя е <strong>задвижвана</strong> и е
            принудена да се мени с честотата <RichText text="$\omega$" /> на източника, каквато и
            да е нейната собствена <RichText text="$\omega_0$" />. Разликата между двете е
            централна за цялата глава:
          </p>

          <div className="my-5 overflow-hidden rounded-[10px] border-[1.5px] border-ink">
            <div className="grid grid-cols-2 divide-x-[1.5px] divide-rule">
              <div className="bg-surface px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted">
                  Собствено трептене
                </p>
                <p className="mt-1.5 text-[15.5px] leading-relaxed text-ink/90">
                  Няма източник. Честотата се определя от системата:{" "}
                  <RichText text="$\omega_0=1/\sqrt{LC}$" />. Амплитудата зависи от началните
                  условия и затихва, ако има <RichText text="$R$" />.
                </p>
              </div>
              <div className="bg-surface px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted">
                  Принудено трептене
                </p>
                <p className="mt-1.5 text-[15.5px] leading-relaxed text-ink/90">
                  Има източник. Честотата се определя от него:{" "}
                  <RichText text="$\omega$" />. Амплитудата в установен режим се определя от
                  веригата и е най-голяма, когато <RichText text="$\omega$" /> се доближи до{" "}
                  <RichText text="$\omega_0$" />.
                </p>
              </div>
            </div>
          </div>

          <PredictionQuestion
            prompt="Верига с $L$ и $C$ има собствена честота $50\,\mathrm{Hz}$. Свързваме я към източник с честота $80\,\mathrm{Hz}$. С каква честота ще се мени токът в установен режим?"
            options={[
              {
                text: "$80\\,\\mathrm{Hz}$: източникът налага своята честота",
                correct: true,
                why: "В установен режим всяка величина в линейна задвижвана верига се мени с честотата на източника. Собствената честота решава само колко силен ще е откликът.",
              },
              {
                text: "$50\\,\\mathrm{Hz}$: системата се връща към собствената си честота",
                correct: false,
                why: "Собственото трептене с $50\\,\\mathrm{Hz}$ съществува само в преходния процес и затихва заради $R$. Остава принуденото.",
              },
              {
                text: "$130\\,\\mathrm{Hz}$: двете честоти се събират",
                correct: false,
                why: "Събиране на честоти се получава при нелинейни елементи. Линейна верига от $R$, $L$ и $C$ не създава нови честоти.",
              },
              {
                text: "$30\\,\\mathrm{Hz}$: разликата между двете",
                correct: false,
                why: "Разликова честота (биене) се появява при наслагване на два независими сигнала, не при задвижване на линейна верига.",
              },
            ]}
            explanation="Затова целият апарат по-нататък се строи за една обща честота: тази на източника."
          />

          <Sub>Уговорка за знаците</Sub>
          <p className="text-ink/90">
            За да не се превърне думата „изпреварва“ в източник на грешки, фиксираме един запис и
            го спазваме до края:
          </p>
          <Formula latex={String.raw`v(t)=V_0\sin(\omega t+\phi_V),\qquad i(t)=I_0\sin(\omega t+\phi_I),\qquad \Delta\phi\equiv\phi_V-\phi_I`} />
          <p className="mt-3 text-ink/90">
            Тоест <RichText text="$\Delta\phi>0$" /> значи, че{" "}
            <strong>напрежението изпреварва тока</strong>, а{" "}
            <RichText text="$\Delta\phi<0$" /> значи, че токът изпреварва напрежението. Ще
            видим, че резисторът дава <RichText text="$\Delta\phi=0$" />, бобината{" "}
            <RichText text="$+\pi/2$" />, а кондензаторът <RichText text="$-\pi/2$" />.
          </p>

          <TeacherNote>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Не бързайте към новата тема. Оставете ученика сам да преразкаже откъде идва{" "}
                <RichText text="$\omega_0^2=1/(LC)$" />: ако не може, следващите секции ще увиснат.
              </li>
              <li>
                Диагностичен въпрос: „кое в тази верига решава честотата и кое решава амплитудата?“
                Разделянето на тези две роли е половината от разбирането на резонанса.
              </li>
              <li>
                Аналогията с махало работи добре: собствена честота срещу честота на бутане.
                Върнете се към нея в §12.
              </li>
            </ul>
          </TeacherNote>
        </Section>

        {/* ================================================== §2 */}
        <Section id="alternating" n="§2" title="Какво точно се редува">
          <div className="space-y-3">
            <p className="text-ink/90">
              „Променлив“ не значи „нестабилен“ или „колеблив“. Значи буквално, че напрежението и
              токът <strong>сменят знака си</strong> периодично: за половин период зарядите се
              движат в едната посока, за другата половина в обратната.
            </p>
            <p className="text-ink/90">
              Долният интерактив свързва три неща, които в учебниците обикновено стоят на различни
              страници: точката върху синусоидата, знака на напрежението и{" "}
              <strong>посоката на стрелките в схемата</strong>. Пуснете анимацията, после я
              забавете и я спрете точно в момент, в който токът сменя посоката си.
            </p>
          </div>

          <Wide>
            <div className="mt-5">
              <ACSourceCircuit />
            </div>
          </Wide>

          <Callout>
            <strong>Първият парадокс на главата.</strong> Средната стойност на тока за цял период е
            точно нула, а резисторът въпреки това се нагрява. Значи величината, която описва
            нагряването, не може да е средният ток. Коя е тя, ще изведем в §13.
          </Callout>

          <TeacherNote>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Спрете анимацията при <RichText text="$v=0$" /> и попитайте къде е токът в този
                момент. За чист резистор отговорът е „също нула“, но много ученици очакват
                „максимален по инерция“: това е добър предвестник на §6 срещу §7-§8.
              </li>
              <li>
                Полезен въпрос: „колко пъти за секунда сменя посоката си токът в контакта при{" "}
                <RichText text="$50\,\mathrm{Hz}$" />?“ Отговорът е сто, не петдесет.
              </li>
            </ul>
          </TeacherNote>
        </Section>

        {/* ================================================== §3 */}
        <Section id="sinus" n="§3" title="Анатомия на синусоидата">
          <div className="space-y-3">
            <p className="text-ink/90">
              Всяка величина в тази глава има вида
            </p>
          </div>
          <Formula latex={String.raw`y(t)=A\sin(\omega t+\phi)`} />
          <p className="mt-3 text-ink/90">
            Четирите числа в този запис не са равноправни: две от тях описват{" "}
            <strong>формата във времето</strong>, а две са свързани помежду си чрез определението
            за период. Нека изведем връзката, вместо да я запомняме.
          </p>

          <Sub>Период</Sub>
          <p className="text-ink/90">
            Синусът се повтаря, когато аргументът му се увеличи с{" "}
            <RichText text="$2\pi$" />. Периодът <RichText text="$T$" /> е точно това време:
          </p>
          <Formula latex={String.raw`\omega(t+T)+\phi=(\omega t+\phi)+2\pi\quad\Longrightarrow\quad \omega T=2\pi\quad\Longrightarrow\quad \boxed{T=\frac{2\pi}{\omega}}`} />

          <Sub>Честота и ъглова честота</Sub>
          <p className="text-ink/90">
            Честотата е броят периоди за секунда, тоест <RichText text="$f=1/T$" />. Заместваме:
          </p>
          <Formula latex={String.raw`f=\frac1T=\frac{\omega}{2\pi}\quad\Longrightarrow\quad \boxed{\omega=2\pi f}`} />
          <p className="mt-3 text-ink/90">
            Множителят <RichText text="$2\pi$" /> не е условност: <RichText text="$\omega$" /> се
            мери в радиани за секунда, защото това е скоростта, с която расте{" "}
            <strong>ъгълът</strong> в аргумента. В §5 този ъгъл ще стане съвсем буквален.
          </p>

          <div className="my-5 overflow-hidden rounded-[10px] border-[1.5px] border-ink">
            <table className="w-full text-[15px]">
              <thead>
                <tr className="border-b-[1.5px] border-rule bg-hl text-left">
                  <th className="px-4 py-2 font-bold">Величина</th>
                  <th className="px-4 py-2 font-bold">Означение</th>
                  <th className="px-4 py-2 font-bold">Какво определя</th>
                </tr>
              </thead>
              <tbody className="divide-y-[1.5px] divide-rule">
                <tr>
                  <td className="px-4 py-2">Амплитуда</td>
                  <td className="px-4 py-2">
                    <RichText text="$A$" />
                  </td>
                  <td className="px-4 py-2 text-ink/90">Височината на върха над нулата</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Период</td>
                  <td className="px-4 py-2">
                    <RichText text="$T=2\pi/\omega$" />
                  </td>
                  <td className="px-4 py-2 text-ink/90">Времето за едно пълно повторение</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Честота</td>
                  <td className="px-4 py-2">
                    <RichText text="$f=1/T$" />
                  </td>
                  <td className="px-4 py-2 text-ink/90">Брой повторения за секунда</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Ъглова честота</td>
                  <td className="px-4 py-2">
                    <RichText text="$\omega=2\pi f$" />
                  </td>
                  <td className="px-4 py-2 text-ink/90">Скорост на нарастване на аргумента</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Начална фаза</td>
                  <td className="px-4 py-2">
                    <RichText text="$\phi$" />
                  </td>
                  <td className="px-4 py-2 text-ink/90">
                    Хоризонталното изместване на цялата крива
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <Wide>
            <div className="mt-5">
              <SineWaveLab />
            </div>
          </Wide>

          <TeacherNote>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Влаченето на кривата настрани е най-бързият начин да се види, че{" "}
                <RichText text="$\phi$" /> не мени нито формата, нито честотата. Помолете ученика
                да предскаже накъде ще се измести кривата при <RichText text="$\phi>0$" /> преди да
                опита (наляво, не надясно).
              </li>
              <li>
                Честа грешка: бъркане на <RichText text="$f$" /> с{" "}
                <RichText text="$\omega$" />. Диагностика: „колко е{" "}
                <RichText text="$\omega$" /> в контакта?“ Отговорът{" "}
                <RichText text="$314\,\mathrm{rad/s}$" /> изисква да е разбрано, че{" "}
                <RichText text="$50$" /> е броят обороти, а не ъгловата скорост.
              </li>
            </ul>
          </TeacherNote>
        </Section>

        {/* ================================================== §4 */}
        <Section id="phase" n="§4" title="Фазова разлика: един ъгъл, две прочитания">
          <div className="space-y-3">
            <p className="text-ink/90">
              Вземаме два сигнала с <strong>една и съща честота</strong>:
            </p>
          </div>
          <Formula latex={String.raw`y_1=A_1\sin(\omega t+\phi_1),\qquad y_2=A_2\sin(\omega t+\phi_2)`} />
          <p className="mt-3 text-ink/90">
            Тяхната фазова разлика е <RichText text="$\Delta\phi=\phi_2-\phi_1$" />. Понеже
            честотите съвпадат, тази разлика <strong>не зависи от времето</strong>: двете криви
            вървят като едно цяло, изместени една спрямо друга.
          </p>

          <Sub>Изместването във времето</Sub>
          <p className="text-ink/90">
            Търсим с колко време втората крива <strong>изпреварва</strong> първата, тоест онова{" "}
            <RichText text="$\Delta t$" />, за което втората достига дадена фаза по-рано:{" "}
            <RichText text="$y_2(t)=y_1(t+\Delta t)$" />. Приравняваме аргументите:
          </p>
          <Formula latex={String.raw`\omega t+\phi_2=\omega(t+\Delta t)+\phi_1\quad\Longrightarrow\quad \omega\,\Delta t=\phi_2-\phi_1=\Delta\phi`} />
          <p className="mt-3 text-ink/90">Оттук веднага:</p>
          <Formula latex={String.raw`\boxed{\Delta t=\frac{\Delta\phi}{\omega}}\qquad\text{и понеже }\omega=\frac{2\pi}{T}:\qquad \boxed{\Delta\phi=2\pi\frac{\Delta t}{T}}`} />
          <p className="mt-3 text-ink/90">
            Второто равенство е особено полезно: <strong>фазовата разлика е просто изместването,
            измерено в части от периода</strong>, умножено по <RichText text="$2\pi$" />. Половин
            период е <RichText text="$\pi$" />, четвърт период е{" "}
            <RichText text="$\pi/2$" />. Положително <RichText text="$\Delta t$" /> значи, че
            втората крива е изместена <strong>наляво</strong> по графиката: тя стига до всяка своя
            стойност по-рано.
          </p>

          <div className="my-5 overflow-hidden rounded-[10px] border-[1.5px] border-ink">
            <table className="w-full text-[15px]">
              <thead>
                <tr className="border-b-[1.5px] border-rule bg-hl text-left">
                  <th className="px-4 py-2 font-bold">
                    <RichText text="$\Delta\phi$" />
                  </th>
                  <th className="px-4 py-2 font-bold">В градуси</th>
                  <th className="px-4 py-2 font-bold">Изместване</th>
                  <th className="px-4 py-2 font-bold">Как се нарича</th>
                </tr>
              </thead>
              <tbody className="divide-y-[1.5px] divide-rule">
                <tr>
                  <td className="px-4 py-2">
                    <RichText text="$0$" />
                  </td>
                  <td className="px-4 py-2">
                    <RichText text="$0^\circ$" />
                  </td>
                  <td className="px-4 py-2">
                    <RichText text="$0$" />
                  </td>
                  <td className="px-4 py-2 text-ink/90">В фаза</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">
                    <RichText text="$\pi/4$" />
                  </td>
                  <td className="px-4 py-2">
                    <RichText text="$45^\circ$" />
                  </td>
                  <td className="px-4 py-2">
                    <RichText text="$T/8$" />
                  </td>
                  <td className="px-4 py-2 text-ink/90">Изпреварва с осминка</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">
                    <RichText text="$\pi/2$" />
                  </td>
                  <td className="px-4 py-2">
                    <RichText text="$90^\circ$" />
                  </td>
                  <td className="px-4 py-2">
                    <RichText text="$T/4$" />
                  </td>
                  <td className="px-4 py-2 text-ink/90">В квадратура</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">
                    <RichText text="$\pi$" />
                  </td>
                  <td className="px-4 py-2">
                    <RichText text="$180^\circ$" />
                  </td>
                  <td className="px-4 py-2">
                    <RichText text="$T/2$" />
                  </td>
                  <td className="px-4 py-2 text-ink/90">В противофаза</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">
                    <RichText text="$3\pi/2$" />
                  </td>
                  <td className="px-4 py-2">
                    <RichText text="$270^\circ$" />
                  </td>
                  <td className="px-4 py-2">
                    <RichText text="$3T/4$" />
                  </td>
                  <td className="px-4 py-2 text-ink/90">
                    Същото като <RichText text="$-\pi/2$" />: изостава с четвъртинка
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-ink/90">
            Последният ред заслужава внимание: фазата е определена с точност до{" "}
            <RichText text="$2\pi$" />, затова „изпреварва с три четвърти“ и „изостава с една
            четвърт“ са едно и също. Затова и предпочитаме да записваме{" "}
            <RichText text="$\Delta\phi$" /> в интервала{" "}
            <RichText text="$(-\pi,\pi]$" />.
          </p>

          <Wide>
            <div className="mt-5">
              <WaveComparator />
            </div>
          </Wide>

          <TeacherNote>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Настройката „различни честоти“ е най-важната в този интерактив: тя показва, че
                фазовата разлика изобщо не е дефинирана, когато честотите се разминават. Оттам
                става ясно защо фазорите работят само за задвижвана линейна верига.
              </li>
              <li>
                Диагностичен въпрос: „ако измерим изместване{" "}
                <RichText text="$2\,\mathrm{ms}$" /> при{" "}
                <RichText text="$50\,\mathrm{Hz}$" />, колко е{" "}
                <RichText text="$\Delta\phi$" />?“ (една десета от периода, тоест{" "}
                <RichText text="$36^\circ$" />).
              </li>
            </ul>
          </TeacherNote>
        </Section>

        {/* ================================================== §5 */}
        <Section id="rotating" n="§5" title="Синусоидата е проекция на въртящ се вектор">
          <div className="space-y-3">
            <p className="text-ink/90">
              Дотук синусоидата беше формула. Сега ще видим, че тя е <strong>сянка</strong>: това е
              най-полезната смяна на гледната точка в цялата глава, защото превръща тригонометрия в
              геометрия.
            </p>
          </div>

          <PredictionQuestion
            prompt="Вектор с постоянна дължина $A$ се върти равномерно. Какво описва неговата вертикална проекция като функция от времето?"
            options={[
              {
                text: "Синусоида с амплитуда $A$",
                correct: true,
                why: "Ъгълът расте равномерно, $\\theta=\\omega t+\\phi$, а вертикалната компонента е $A\\sin\\theta$. Заместването дава точно $A\\sin(\\omega t+\\phi)$.",
              },
              {
                text: "Права линия, защото въртенето е равномерно",
                correct: false,
                why: "Равномерно расте ъгълът, не проекцията. Проекцията се забавя близо до крайните си положения и това извива графиката.",
              },
              {
                text: "Окръжност",
                correct: false,
                why: "Окръжност описва самият връх на вектора в равнината. Проекцията е едно число и графиката ѝ спрямо времето е крива, а не затворена линия.",
              },
              {
                text: "Синусоида, но само ако $\\phi=0$",
                correct: false,
                why: "Ненулевата начална фаза мести кривата настрани, без да променя нейния характер: остава синусоида.",
              },
            ]}
            explanation="Тази проста геометрична картина ще замести цялата тригонометрия по-нататък."
          />

          <Sub>Извеждането</Sub>
          <p className="text-ink/90">
            Нека <RichText text="$\vec A$" /> има постоянна дължина{" "}
            <RichText text="$A$" /> и се върти с постоянна ъглова скорост{" "}
            <RichText text="$\omega$" />. Тогава ъгълът му спрямо оста{" "}
            <RichText text="$x$" /> расте линейно:
          </p>
          <Formula latex={String.raw`\theta(t)=\omega t+\phi\qquad\left(\text{защото }\frac{d\theta}{dt}=\omega=\text{const}\right)`} />
          <p className="mt-3 text-ink/90">
            Декартовите компоненти на вектор с дължина <RichText text="$A$" /> и ъгъл{" "}
            <RichText text="$\theta$" /> са по определение:
          </p>
          <Formula latex={String.raw`A_x=A\cos\theta=A\cos(\omega t+\phi),\qquad A_y=A\sin\theta=A\sin(\omega t+\phi)`} />
          <p className="mt-3 text-ink/90">
            Тоест <strong>всяка синусоидална функция е проекция на равномерно въртене</strong>, а
            двете проекции се различават само по фаза от четвърт период. Оттук нататък ще ползваме{" "}
            <strong>вертикалната</strong> проекция, за да съответства на записа{" "}
            <RichText text="$A\sin(\omega t+\phi)$" />.
          </p>

          <Wide>
            <div className="mt-5">
              <RotatingVectorLab />
            </div>
          </Wide>

          <Sub>Защо това решава задачата с производните</Sub>
          <p className="text-ink/90">
            Ето печалбата, заради която правим всичко това. Диференцираме проекцията:
          </p>
          <Formula latex={String.raw`\frac{d}{dt}\Big[A\sin(\omega t+\phi)\Big]=\omega A\cos(\omega t+\phi)=\omega A\sin\!\left(\omega t+\phi+\frac\pi2\right)`} />
          <Callout>
            <strong>Диференцирането е завъртане на <RichText text="$+90^\circ$" /> и умножение по{" "}
            <RichText text="$\omega$" />.</strong> Нищо друго. Това единствено изречение съдържа
            предварително всички фазови разлики, които ще изведем за кондензатора и бобината: щом
            токът е производна на заряда, а напрежението на бобината е производна на тока, техните
            фазори просто стоят под прав ъгъл.
          </Callout>

          <Sub>Две стрелки: ъгълът между тях е фазовата разлика</Sub>
          <p className="text-ink/90">
            Ако два вектора се въртят с една и съща <RichText text="$\omega$" />, ъгълът между тях
            остава постоянен и е точно <RichText text="$\Delta\phi$" />. Влачете втората стрелка и
            вижте как ъгълът в лявата картина и изместването в дясната са едно и също число, само
            измерено с различни единици.
          </p>

          <Wide>
            <div className="mt-5">
              <TwoPhasorLab />
            </div>
          </Wide>

          <TeacherNote>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Ако ученикът е изучавал хармонично движение в механиката, тук е мястото да се
                свърже: проекцията на равномерно движение по окръжност беше същата конструкция.
              </li>
              <li>
                Диагностичен въпрос: „с какво се различават <RichText text="$A_x$" /> и{" "}
                <RichText text="$A_y$" />?“ Отговорът „само с фаза от{" "}
                <RichText text="$90^\circ$" />“ показва, че връзката е разбрана.
              </li>
              <li>
                Настоявайте на извода за производната. Ако той е приет тук, §7 и §8 стават
                упражнение по алгебра, вместо две нови правила за запомняне.
              </li>
            </ul>
          </TeacherNote>
        </Section>

        {/* ================================================== §6 */}
        <Section id="resistor" n="§6" title="Резистор под променливо напрежение">
          <div className="space-y-3">
            <p className="text-ink/90">
              Започваме с най-простия елемент, за да установим метода. Второто правило на Кирхоф за
              контур с източник и резистор гласи <RichText text="$v-v_R=0$" />, а за резистора важи
              законът на Ом във всеки момент:
            </p>
          </div>
          <Formula latex={String.raw`v(t)=i(t)\,R`} />
          <p className="mt-3 text-ink/90">
            Задаваме <RichText text="$v(t)=V_0\sin\omega t$" /> и решаваме спрямо тока. Тук няма
            производни и няма какво да се измести:
          </p>
          <Formula latex={String.raw`i(t)=\frac{v(t)}{R}=\frac{V_0}{R}\sin\omega t`} />
          <p className="mt-3 text-ink/90">Сравняваме с общия запис <RichText text="$i=I_0\sin(\omega t+\phi_I)$" />:</p>
          <Formula latex={String.raw`I_0=\frac{V_0}{R},\qquad \phi_I=\phi_V\qquad\Longrightarrow\qquad \boxed{\Delta\phi=0}`} />

          <Callout>
            Резисторът <strong>мащабира амплитудата и не пипа фазата</strong>. Освен това
            отношението <RichText text="$V_0/I_0=R$" /> не зависи от честотата. Тъкмо тези две
            свойства ще се окажат изключение, а не правило.
          </Callout>

          <Wide>
            <div className="mt-5">
              <ResistorACLab />
            </div>
          </Wide>

          <TeacherNote>
            <p>
              Тази секция изглежда тривиална и точно затова е важна: тя задава шаблона за следващите
              две. Всеки път правим едно и също: записваме връзката между{" "}
              <RichText text="$v$" /> и <RichText text="$i$" /> за елемента, заместваме синусоида,
              смятаме и чак накрая четем амплитудата и фазата от резултата.
            </p>
          </TeacherNote>
        </Section>

        {/* ================================================== §7 */}
        <Section id="capacitor" n="§7" title="Кондензатор: откъде идват четвърт период и $X_C$">
          <PredictionQuestion
            prompt="Напрежението върху кондензатор е в момент на максимум. Какво е $dv/dt$ в този момент и какъв следователно е токът?"
            options={[
              {
                text: "$dv/dt=0$, значи токът е нула",
                correct: true,
                why: "В екстремум производната се анулира. Понеже $i=C\\,dv/dt$, точно тогава токът е нула: зарядът на плочите е спрял да се мени.",
              },
              {
                text: "$dv/dt$ е максимално, значи и токът е максимален",
                correct: false,
                why: "Максимална е самата функция, не наклонът ѝ. Наклонът е максимален там, където кривата минава през нулата.",
              },
              {
                text: "$dv/dt$ е максимално, но токът е нула",
                correct: false,
                why: "Двете твърдения си противоречат: щом $i=C\\,dv/dt$, максимална производна означава максимален ток.",
              },
              {
                text: "Не може да се каже без да знаем $C$",
                correct: false,
                why: "$C$ влияе на големината на тока, но не на момента, в който той се анулира. Нулата на производната не зависи от множителя пред нея.",
              },
            ]}
            explanation="Дръжте този отговор пред очи: той вече съдържа изместването от четвърт период."
          />

          <Sub>Извеждане на фазата</Sub>
          <p className="text-ink/90">
            За кондензатор връзката между заряд и напрежение е позната от главата за капацитета:
          </p>
          <Formula latex={String.raw`q=Cv`} />
          <p className="mt-3 text-ink/90">
            Токът е скоростта, с която зарядът на плочите се мени, а{" "}
            <RichText text="$C$" /> е константа:
          </p>
          <Formula latex={String.raw`i=\frac{dq}{dt}=C\,\frac{dv}{dt}`} />
          <p className="mt-3 text-ink/90">
            Задаваме <RichText text="$v(t)=V_0\sin\omega t$" /> и диференцираме:
          </p>
          <Formula latex={String.raw`\frac{dv}{dt}=\omega V_0\cos\omega t\qquad\Longrightarrow\qquad i(t)=\omega CV_0\cos\omega t`} />
          <p className="mt-3 text-ink/90">
            Остава да върнем резултата в стандартния синусов запис чрез тъждеството{" "}
            <RichText text="$\cos x=\sin(x+\pi/2)$" />:
          </p>
          <Formula latex={String.raw`i(t)=\omega CV_0\,\sin\!\left(\omega t+\frac\pi2\right)`} />
          <p className="mt-3 text-ink/90">
            Сравняваме с <RichText text="$i=I_0\sin(\omega t+\phi_I)$" />: тук{" "}
            <RichText text="$\phi_I=+\pi/2$" />, а <RichText text="$\phi_V=0$" />, значи
          </p>
          <Formula latex={String.raw`\Delta\phi=\phi_V-\phi_I=-\frac\pi2\qquad\Longrightarrow\qquad \boxed{\text{токът изпреварва напрежението с }\tfrac\pi2}`} />

          <Sub>Извеждане на капацитивното съпротивление</Sub>
          <p className="text-ink/90">
            Сега погледнете само амплитудите. От{" "}
            <RichText text="$I_0=\omega CV_0$" /> изразяваме напрежението:
          </p>
          <Formula latex={String.raw`V_0=I_0\cdot\frac{1}{\omega C}`} />
          <p className="mt-3 text-ink/90">
            Сравнете този ред с амплитудната форма на закона на Ом{" "}
            <RichText text="$V_0=I_0R$" />. Въпросът е буквално един:{" "}
            <strong>коя величина тук играе ролята на <RichText text="$R$" />?</strong> Отговорът е
            множителят пред <RichText text="$I_0$" />, затова му даваме име:
          </p>
          <Formula latex={String.raw`\boxed{X_C\equiv\frac{1}{\omega C}}\qquad\Longrightarrow\qquad V_0=I_0X_C`} />

          <Derivation title="Проверка на единиците и защо това не е съпротивление">
            <p className="text-[15.5px] leading-relaxed text-ink/90">
              По построение <RichText text="$X_C=V_0/I_0$" />, значи единицата е волт на ампер,
              тоест ом:
            </p>
            <Formula latex={String.raw`[X_C]=\frac{[V]}{[A]}=\Omega`} />
            <p className="text-[15.5px] leading-relaxed text-ink/90">
              Същото се вижда и направо от <RichText text="$1/(\omega C)$" />: фарадът е кулон на
              волт, кулон за секунда е ампер, значи{" "}
              <RichText text="$1/(\mathrm{s^{-1}\cdot F})=\mathrm{V/A}$" />.
            </p>
            <p className="text-[15.5px] leading-relaxed text-ink/90">
              Въпреки съвпадението на единиците <RichText text="$X_C$" /> не е обикновено
              съпротивление по две причини. Първо,{" "}
              <strong>зависи от честотата</strong>: една и съща верига „пропуска“ различно при
              различни <RichText text="$\omega$" />. Второ, при него{" "}
              <strong>няма разсейване на енергия</strong>: както ще пресметнем в §13, средната
              мощност в идеален кондензатор е точно нула. Затова думата е друга:{" "}
              <strong>реактивно съпротивление</strong> (реактанс).
            </p>
          </Derivation>

          <Sub>Същото, но с ток за отправна величина</Sub>
          <p className="text-ink/90">
            В §10 ще ни трябва обратната форма, защото в последователна верига общ е токът, а не
            напрежението. Ако вземем <RichText text="$i=I_0\sin\omega t$" />, то интегрирането дава
          </p>
          <Formula latex={String.raw`v_C=\frac{q}{C}=\frac1C\int i\,dt=\frac{I_0}{\omega C}\,\sin\!\left(\omega t-\frac\pi2\right)=I_0X_C\sin\!\left(\omega t-\frac\pi2\right)`} />
          <p className="mt-3 text-ink/90">
            Същият резултат, прочетен от другата страна:{" "}
            <RichText text="$\Delta\phi=\phi_V-\phi_I=-\pi/2$" />. Напрежението върху кондензатора{" "}
            <strong>изостава</strong> от тока с четвърт период.
          </p>

          <Wide>
            <div className="mt-5">
              <CapacitorDerivativeLab />
            </div>
          </Wide>

          <TeacherNote>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Най-честата грешка е <RichText text="$X_C=\omega C$" />. Двойна диагностика: по
                единиците и по границата <RichText text="$\omega\to0$" />, където кондензаторът
                трябва да спре тока.
              </li>
              <li>
                Втора честа грешка: „токът изпреварва“ се разбира като „токът тръгва преди да има
                напрежение“. Обяснете, че става дума за подредба на максимумите в установен режим,
                не за причинност.
              </li>
              <li>
                Полезно упражнение: помолете ученика да изведе същото, като вземе{" "}
                <RichText text="$v=V_0\cos\omega t$" />. Резултатът трябва да е същата фазова
                разлика: тя не зависи от избора на начало на времето.
              </li>
            </ul>
          </TeacherNote>
        </Section>

        {/* ================================================== §8 */}
        <Section id="inductor" n="§8" title="Бобина: същата сметка, огледален резултат">
          <PredictionQuestion
            prompt="Токът през бобина минава през нулата и в този момент се мени най-бързо. Какво прави напрежението върху бобината?"
            options={[
              {
                text: "Достига максимума си, защото $v=L\\,di/dt$",
                correct: true,
                why: "Напрежението следва не тока, а скоростта на неговата промяна. Най-стръмният наклон е при преминаването през нулата, значи там е и максимумът на напрежението.",
              },
              {
                text: "Също е нула, защото токът е нула",
                correct: false,
                why: "Това би било вярно за резистор ($v=iR$). При бобината напрежението не зависи от стойността на тока, а от неговата производна.",
              },
              {
                text: "Е максимално, но само ако токът расте, и нула, ако намалява",
                correct: false,
                why: "Големината е максимална и в двата случая; различава се само знакът на напрежението.",
              },
              {
                text: "Зависи от $L$: при малко $L$ напрежението е нула",
                correct: false,
                why: "$L$ мащабира големината, но моментът на максимума се определя само от формата на $di/dt$.",
              },
            ]}
            explanation="Оттук нататък сметката е същата като при кондензатора, само че ролите на $v$ и $i$ са разменени."
          />

          <Sub>Извеждане</Sub>
          <p className="text-ink/90">
            Законът за самоиндукцията от предишната глава дава напрежението върху идеална бобина:
          </p>
          <Formula latex={String.raw`v=L\,\frac{di}{dt}`} />
          <p className="mt-3 text-ink/90">
            Задаваме <RichText text="$i(t)=I_0\sin\omega t$" /> (за бобината е по-естествено да
            тръгнем от тока) и диференцираме:
          </p>
          <Formula latex={String.raw`\frac{di}{dt}=\omega I_0\cos\omega t\qquad\Longrightarrow\qquad v(t)=\omega LI_0\cos\omega t=\omega LI_0\sin\!\left(\omega t+\frac\pi2\right)`} />
          <p className="mt-3 text-ink/90">
            Сега <RichText text="$\phi_V=+\pi/2$" />, а <RichText text="$\phi_I=0$" />, значи
          </p>
          <Formula latex={String.raw`\Delta\phi=\phi_V-\phi_I=+\frac\pi2\qquad\Longrightarrow\qquad \boxed{\text{напрежението изпреварва тока с }\tfrac\pi2}`} />
          <p className="mt-3 text-ink/90">
            Еквивалентно казано: <strong>токът изостава от напрежението с четвърт период</strong>.
            Това е количествен запис на електромагнитната инерция от предишната глава: токът не
            може да скочи, той се влачи след напрежението.
          </p>

          <Sub>Извеждане на индуктивното съпротивление</Sub>
          <p className="text-ink/90">Отношението на амплитудите се чете направо:</p>
          <Formula latex={String.raw`V_0=\omega L\,I_0\qquad\text{срещу}\qquad V_0=I_0R`} />
          <p className="mt-3 text-ink/90">
            Отново един и същ въпрос дава едно и също име:
          </p>
          <Formula latex={String.raw`\boxed{X_L\equiv\omega L}\qquad\Longrightarrow\qquad V_0=I_0X_L,\qquad [X_L]=\Omega`} />

          <Derivation title="Проверка на единиците">
            <p className="text-[15.5px] leading-relaxed text-ink/90">
              Хенрито е волт-секунда на ампер, защото <RichText text="$v=L\,di/dt$" />. Значи
            </p>
            <Formula latex={String.raw`[\omega L]=\mathrm{s^{-1}}\cdot\frac{\mathrm{V\cdot s}}{\mathrm{A}}=\frac{\mathrm V}{\mathrm A}=\Omega`} />
            <p className="text-[15.5px] leading-relaxed text-ink/90">
              Забележете, че и тук няма разсейване: напрежението и токът са в квадратура, а в §13
              ще видим, че точно това прави средната мощност нула.
            </p>
          </Derivation>

          <Wide>
            <div className="mt-5">
              <InductorDerivativeLab />
            </div>
          </Wide>

          <TeacherNote>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Симетрията между §7 и §8 е ключова: и двете идват от една и съща операция върху
                синусоида. Помолете ученика сам да каже кое е различното (кое от двете е производна
                на кое) и защо това обръща знака.
              </li>
              <li>
                Диагностичен въпрос: „ако бобината е идеална, къде отива енергията, докато токът
                расте?“ Отговорът „в магнитното поле, временно“ подготвя §13.
              </li>
            </ul>
          </TeacherNote>
        </Section>

        {/* ================================================== §9 */}
        <Section id="reactance" n="§9" title="Двата реактанса един срещу друг">
          <div className="space-y-3">
            <p className="text-ink/90">
              Двете величини бяха изведени поотделно, по един и същ път. Сега ги слагаме една до
              друга:
            </p>
          </div>
          <Formula latex={String.raw`X_L=\omega L\qquad\text{срещу}\qquad X_C=\frac{1}{\omega C}`} />
          <p className="mt-3 text-ink/90">
            Зависимостта от честотата е точно противоположна:{" "}
            <RichText text="$X_L\propto\omega$" />, докато{" "}
            <RichText text="$X_C\propto1/\omega$" />. Проверяваме двете граници, защото те трябва
            да възпроизведат позната физика.
          </p>

          <div className="my-5 overflow-hidden rounded-[10px] border-[1.5px] border-ink">
            <table className="w-full text-[15px]">
              <thead>
                <tr className="border-b-[1.5px] border-rule bg-hl text-left">
                  <th className="px-4 py-2 font-bold">Граница</th>
                  <th className="px-4 py-2 font-bold">Бобина</th>
                  <th className="px-4 py-2 font-bold">Кондензатор</th>
                </tr>
              </thead>
              <tbody className="divide-y-[1.5px] divide-rule">
                <tr>
                  <td className="px-4 py-2">
                    <RichText text="$\omega\to0$ (постоянен ток)" />
                  </td>
                  <td className="px-4 py-2 text-ink/90">
                    <RichText text="$X_L\to0$" />: държи се като проводник
                  </td>
                  <td className="px-4 py-2 text-ink/90">
                    <RichText text="$X_C\to\infty$" />: държи се като прекъсване
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2">
                    <RichText text="$\omega\to\infty$" />
                  </td>
                  <td className="px-4 py-2 text-ink/90">
                    <RichText text="$X_L\to\infty$" />: блокира бързите промени
                  </td>
                  <td className="px-4 py-2 text-ink/90">
                    <RichText text="$X_C\to0$" />: пропуска ги свободно
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-ink/90">
            И двете граници съвпадат с това, което вече знаем от постояннотоковите вериги: през
            заредения кондензатор ток не тече, а установеният ток през идеална намотка не среща
            съпротивление. Формулите не въвеждат нова физика, а разширяват старата.
          </p>

          <PredictionQuestion
            prompt="Искаме да задържим сигнал с много висока честота и да пропуснем бавно менящия се. Кой елемент да включим последователно в веригата?"
            options={[
              {
                text: "Бобина, защото $X_L=\\omega L$ расте с честотата",
                correct: true,
                why: "Последователната бобина пропуска бавното (малко $X_L$) и запушва бързото (голямо $X_L$). Точно това прави филтърът за ниски честоти.",
              },
              {
                text: "Кондензатор, защото той не пропуска постоянен ток",
                correct: false,
                why: "Последователният кондензатор прави обратното: спира бавното и пропуска бързото, защото $X_C=1/(\\omega C)$ пада с честотата.",
              },
              {
                text: "Резистор с голяма стойност",
                correct: false,
                why: "Резисторът пречи еднакво на всички честоти: той не различава бързо от бавно и затова не може да филтрира.",
              },
              {
                text: "Никой: последователният елемент влияе еднакво на всички честоти",
                correct: false,
                why: "Точно обратното е причината реактансите да са полезни: те зависят от честотата, и то по противоположни начини.",
              },
            ]}
            explanation="Тази честотна избирателност е основата на всички филтри, а след малко ще даде и резонанса."
          />

          <Wide>
            <div className="mt-5">
              <ReactancePlot />
            </div>
          </Wide>

          <Callout>
            <strong>Задача за наблюдение, преди да четете нататък.</strong> Двете криви се
            пресичат. Намерете пресечната честота за няколко двойки{" "}
            <RichText text="$L$" /> и <RichText text="$C$" /> и се опитайте да отгатнете формулата.
            Ако предположението ви съдържа <RichText text="$\sqrt{LC}$" />, вие вече сте
            преоткрили §12.
          </Callout>

          <Sub>Обобщение на трите елемента</Sub>
          <div className="my-5 overflow-hidden rounded-[10px] border-[1.5px] border-ink">
            <table className="w-full text-[14.5px]">
              <thead>
                <tr className="border-b-[1.5px] border-rule bg-hl text-left">
                  <th className="px-3 py-2 font-bold">Елемент</th>
                  <th className="px-3 py-2 font-bold">Връзка</th>
                  <th className="px-3 py-2 font-bold">
                    <RichText text="$V_0/I_0$" />
                  </th>
                  <th className="px-3 py-2 font-bold">
                    <RichText text="$\Delta\phi$" />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-[1.5px] divide-rule">
                <tr>
                  <td className="px-3 py-2">Резистор</td>
                  <td className="px-3 py-2">
                    <RichText text="$v=iR$" />
                  </td>
                  <td className="px-3 py-2">
                    <RichText text="$R$" />
                  </td>
                  <td className="px-3 py-2">
                    <RichText text="$0$" />
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2">Бобина</td>
                  <td className="px-3 py-2">
                    <RichText text="$v=L\,di/dt$" />
                  </td>
                  <td className="px-3 py-2">
                    <RichText text="$X_L=\omega L$" />
                  </td>
                  <td className="px-3 py-2">
                    <RichText text="$+\pi/2$" />
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2">Кондензатор</td>
                  <td className="px-3 py-2">
                    <RichText text="$i=C\,dv/dt$" />
                  </td>
                  <td className="px-3 py-2">
                    <RichText text="$X_C=1/(\omega C)$" />
                  </td>
                  <td className="px-3 py-2">
                    <RichText text="$-\pi/2$" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <TeacherNote>
            <p>
              Тази таблица е целият апарат, нужен за останалата част от главата. Ако ученикът може
              да я възстанови от двете диференциални връзки в средната колона, значи нищо не е
              запомнено наизуст.
            </p>
          </TeacherNote>
        </Section>

        {/* ================================================== §10 */}
        <Section id="phasors" n="§10" title="Фазори: как да събираме синусоиди, без да ги събираме">
          <div className="space-y-3">
            <p className="text-ink/90">
              В последователна верига с трите елемента напреженията върху тях трябва да се съберат
              до напрежението на източника. Но те са три синусоиди с{" "}
              <strong>различни фази</strong>, затова амплитудите им не се събират като числа. Тук
              §5 се отплаща.
            </p>
            <p className="text-ink/90">
              Наблюдението, което прави метода възможен, е следното: в задвижвана{" "}
              <strong>линейна</strong> верига всички величини се менят с{" "}
              <strong>една и съща</strong> честота <RichText text="$\omega$" />, зададена от
              източника. Различават се само по две неща: амплитуда и фаза. Но точно тези две неща
              описват еднозначно един вектор в равнината.
            </p>
          </div>

          <Callout>
            <strong>Определение.</strong> На синусоидата{" "}
            <RichText text="$A\sin(\omega t+\phi)$" /> съпоставяме вектор с дължина{" "}
            <RichText text="$A$" /> и ъгъл <RichText text="$\phi$" />, който се върти с{" "}
            <RichText text="$\omega$" />. Наричаме го <strong>фазор</strong>. Понеже всички фазори
            се въртят еднакво, можем да „замразим“ общото въртене и да работим само с неподвижната
            геометрия. Мигновената стойност винаги е вертикалната проекция.
          </Callout>

          <p className="text-ink/90">
            Защо това изобщо е позволено? Защото събирането на синусоиди с една честота съответства
            точно на векторно събиране: проекцията на сума от вектори е сума от проекциите. Оттук
            цялата тригонометрия се свежда до един триъгълник.
          </p>

          <Callout>
            <strong>Внимание с думите.</strong> Фазорът не е физичен вектор като{" "}
            <RichText text="$\vec E$" /> или <RichText text="$\vec B$" />. Напрежението няма
            посока в пространството. Фазорът е{" "}
            <strong>счетоводна конструкция</strong>: начин две числа (амплитуда и фаза) да се
            запишат като едно и да се събират по правилата на векторите.
          </Callout>

          <Sub>Защо токът е отправната величина</Sub>
          <p className="text-ink/90">
            В последователна верига през трите елемента тече <strong>един и същ ток</strong> във
            всеки момент: няма къде да се разклони. Затова е удобно той да е отправната посока и
            избираме <RichText text="$\phi_I=0$" />. Това не е условност, а следствие от
            топологията на веригата.
          </p>
          <p className="mt-3 text-ink/90">
            Всяко напрежение тогава се разполага спрямо тази посока според резултатите от §6-§8:
          </p>

          <div className="my-5 space-y-3">
            <Formula latex={String.raw`V_R=I_0R\quad\text{по посока на }\vec I\qquad(\Delta\phi=0)`} />
            <Formula latex={String.raw`V_L=I_0X_L\quad\text{завъртяно на }+90^\circ\qquad(\text{изпреварва})`} />
            <Formula latex={String.raw`V_C=I_0X_C\quad\text{завъртяно на }-90^\circ\qquad(\text{изостава})`} />
          </div>

          <p className="text-ink/90">
            Рисуваме ги: <RichText text="$\vec V_R$" /> хоризонтално,{" "}
            <RichText text="$\vec V_L$" /> нагоре, <RichText text="$\vec V_C$" /> надолу. Понеже
            последните две са противоположни, вертикалната компонента на резултата е тяхната
            разлика:
          </p>
          <Formula latex={String.raw`\vec V=\vec V_R+\vec V_L+\vec V_C\qquad\Longrightarrow\qquad V_x=V_R,\qquad V_y=V_L-V_C`} />

          <Wide>
            <div className="mt-5">
              <RLCPhasorLab />
            </div>
          </Wide>

          <TeacherNote>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Настройте интерактива така, че <RichText text="$V_C$" /> да надхвърли резултантното{" "}
                <RichText text="$V$" />. Въпросът „възможно ли е волтметър на кондензатора да
                покаже повече от напрежението на източника“ обикновено предизвиква недоверие, а
                отговорът е „да“ и се вижда направо от чертежа.
              </li>
              <li>
                Диагностика на разбирането: помолете за предсказание какво ще стане с ъгъла, ако{" "}
                <RichText text="$R$" /> се увеличи много (клони към нула: веригата става почти
                чисто активна).
              </li>
              <li>
                Бутонът за въртене е полезен само веднъж: покажете, че въртенето не мени
                относителната геометрия, после го оставете замразен.
              </li>
            </ul>
          </TeacherNote>
        </Section>

        {/* ================================================== §11 */}
        <Section id="impedance" n="§11" title="Импеданс и фазов ъгъл направо от триъгълника">
          <PredictionQuestion
            prompt="В последователна RLC верига $V_R=30\,\mathrm{V}$, $V_L=80\,\mathrm{V}$ и $V_C=40\,\mathrm{V}$ (амплитуди). Каква е амплитудата на напрежението на източника?"
            options={[
              {
                text: "$50\\,\\mathrm{V}$",
                correct: true,
                why: "Вертикалният остатък е $80-40=40\\,\\mathrm{V}$, а хоризонталният е $30\\,\\mathrm{V}$. По Питагор: $\\sqrt{30^2+40^2}=50\\,\\mathrm{V}$.",
              },
              {
                text: "$150\\,\\mathrm{V}$",
                correct: false,
                why: "Това е скаларният сбор. Той пренебрегва, че трите напрежения достигат максимумите си в различни моменти.",
              },
              {
                text: "$70\\,\\mathrm{V}$",
                correct: false,
                why: "Така се получава, ако се извади само $V_C$ от сбора: $30+80-40$. Остатъкът обаче е перпендикулярен на $V_R$, а не успореден.",
              },
              {
                text: "$110\\,\\mathrm{V}$",
                correct: false,
                why: "Това е $30+80$, тоест пренебрегва изцяло кондензатора, който компенсира половината от напрежението на бобината.",
              },
            ]}
            explanation="Целият §11 е това пресмятане, направено с букви вместо с числа."
          />

          <Sub>Извеждане на импеданса</Sub>
          <p className="text-ink/90">
            Триъгълникът от §10 е правоъгълен, защото{" "}
            <RichText text="$\vec V_R$" /> е перпендикулярен на вертикалния остатък. Значи
          </p>
          <Formula latex={String.raw`V_0^2=V_R^2+(V_L-V_C)^2`} />
          <p className="mt-3 text-ink/90">Заместваме трите напрежения с изразите им през тока:</p>
          <Formula latex={String.raw`V_0^2=(I_0R)^2+(I_0X_L-I_0X_C)^2=I_0^2R^2+I_0^2(X_L-X_C)^2`} />
          <p className="mt-3 text-ink/90">
            Изнасяме общия множител. Ето мястото, където токът изчезва от скобите:
          </p>
          <Formula latex={String.raw`V_0^2=I_0^2\Big[R^2+(X_L-X_C)^2\Big]`} />
          <p className="mt-3 text-ink/90">Коренуваме:</p>
          <Formula latex={String.raw`V_0=I_0\sqrt{R^2+(X_L-X_C)^2}`} />
          <p className="mt-3 text-ink/90">
            Множителят пред <RichText text="$I_0$" /> е отношението{" "}
            <RichText text="$V_0/I_0$" /> за цялата верига. Той играе същата роля, каквато{" "}
            <RichText text="$R$" /> играе за резистора, затова получава име и означение:
          </p>
          <Formula latex={String.raw`\boxed{Z=\sqrt{R^2+(X_L-X_C)^2}}\qquad\Longrightarrow\qquad \boxed{V_0=I_0Z},\qquad \boxed{I_0=\frac{V_0}{Z}}`} />
          <p className="mt-3 text-ink/90">
            Величината <RichText text="$Z$" /> се нарича <strong>импеданс</strong>. Единицата ѝ
            отново е ом, защото е отношение на волт към ампер. Забележете, че тя{" "}
            <strong>зависи от честотата</strong> през двата реактанса: една и съща верига има
            различен импеданс при различни <RichText text="$\omega$" />.
          </p>

          <Sub>Извеждане на фазовия ъгъл</Sub>
          <p className="text-ink/90">
            Същият триъгълник дава и ъгъла между <RichText text="$\vec V$" /> и{" "}
            <RichText text="$\vec I$" />:
          </p>
          <Formula latex={String.raw`\tan\phi=\frac{V_L-V_C}{V_R}=\frac{I_0X_L-I_0X_C}{I_0R}`} />
          <p className="mt-3 text-ink/90">Токът пак се съкращава:</p>
          <Formula latex={String.raw`\boxed{\tan\phi=\frac{X_L-X_C}{R}}\qquad\Longrightarrow\qquad \phi=\arctan\frac{X_L-X_C}{R}`} />

          <div className="my-5 overflow-hidden rounded-[10px] border-[1.5px] border-ink">
            <table className="w-full text-[15px]">
              <thead>
                <tr className="border-b-[1.5px] border-rule bg-hl text-left">
                  <th className="px-4 py-2 font-bold">Условие</th>
                  <th className="px-4 py-2 font-bold">Знак на <RichText text="$\phi$" /></th>
                  <th className="px-4 py-2 font-bold">Характер</th>
                </tr>
              </thead>
              <tbody className="divide-y-[1.5px] divide-rule">
                <tr>
                  <td className="px-4 py-2">
                    <RichText text="$X_L>X_C$" />
                  </td>
                  <td className="px-4 py-2">
                    <RichText text="$\phi>0$" />
                  </td>
                  <td className="px-4 py-2 text-ink/90">
                    Индуктивна: напрежението изпреварва тока
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2">
                    <RichText text="$X_C>X_L$" />
                  </td>
                  <td className="px-4 py-2">
                    <RichText text="$\phi<0$" />
                  </td>
                  <td className="px-4 py-2 text-ink/90">
                    Капацитивна: токът изпреварва напрежението
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2">
                    <RichText text="$X_L=X_C$" />
                  </td>
                  <td className="px-4 py-2">
                    <RichText text="$\phi=0$" />
                  </td>
                  <td className="px-4 py-2 text-ink/90">
                    Чисто активна: <RichText text="$Z=R$" />, ток и напрежение в фаза
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-ink/90">
            С уговорката от §1 токът се записва{" "}
            <RichText text="$i(t)=I_0\sin(\omega t-\phi)$" />, когато източникът е{" "}
            <RichText text="$v(t)=V_0\sin\omega t$" />. Проверете знаците в лабораторията долу: при{" "}
            <RichText text="$\phi>0$" /> зелената крива изостава.
          </p>

          <Wide>
            <div className="mt-5">
              <RLCLaboratory />
            </div>
          </Wide>

          <Derivation title="За напреднали: същото с комплексни числа">
            <p className="text-[15.5px] leading-relaxed text-ink/90">
              Фазорът е вектор в равнина, а комплексното число също. Тъждеството на Ойлер прави
              съответствието точно:
            </p>
            <Formula latex={String.raw`e^{i\theta}=\cos\theta+i\sin\theta`} />
            <p className="text-[15.5px] leading-relaxed text-ink/90">
              При нашата уговорка мигновената стойност е <strong>вертикалната</strong> проекция,
              тоест имагинерната част:
            </p>
            <Formula latex={String.raw`A\sin(\omega t+\phi)=\operatorname{Im}\Big[A\,e^{i(\omega t+\phi)}\Big]=\operatorname{Im}\Big[\underbrace{Ae^{i\phi}}_{\text{комплексна амплитуда}}e^{i\omega t}\Big]`} />
            <p className="text-[15.5px] leading-relaxed text-ink/90">
              Понеже множителят <RichText text="$e^{i\omega t}$" /> е общ за всички величини във
              веригата, той се съкращава от всяко уравнение. Остават само комплексните амплитуди.
              Диференцирането става умножение по <RichText text="$i\omega$" />, защото
            </p>
            <Formula latex={String.raw`\frac{d}{dt}e^{i\omega t}=i\omega\,e^{i\omega t},\qquad i=e^{i\pi/2}\ \ (\text{тоест завъртане на }90^\circ)`} />
            <p className="text-[15.5px] leading-relaxed text-ink/90">
              Оттук трите елемента получават комплексни импеданси направо от своите определящи
              уравнения:
            </p>
            <Formula latex={String.raw`Z_R=R,\qquad Z_L=i\omega L,\qquad Z_C=\frac{1}{i\omega C}=-\frac{i}{\omega C}`} />
            <p className="text-[15.5px] leading-relaxed text-ink/90">
              При последователно свързване комплексните импеданси просто се събират, както
              съпротивленията в постояннотокова верига:
            </p>
            <Formula latex={String.raw`\boxed{Z=R+i\left(\omega L-\frac{1}{\omega C}\right)}`} />
            <p className="text-[15.5px] leading-relaxed text-ink/90">
              Модулът и аргументът на това число са точно двата резултата, изведени по-горе с
              триъгълник:
            </p>
            <Formula latex={String.raw`|Z|=\sqrt{R^2+\left(\omega L-\frac{1}{\omega C}\right)^2},\qquad \arg Z=\arctan\frac{\omega L-\dfrac{1}{\omega C}}{R}`} />
            <p className="text-[15.5px] leading-relaxed text-ink/90">
              Реалната част е тази, която разсейва енергия; имагинерната само я разменя.
              Комплексният запис не добавя нова физика, а спестява рисуването на триъгълници при
              по-сложни вериги.
            </p>
          </Derivation>

          <TeacherNote>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Настоявайте съкращаването на <RichText text="$I_0$" /> да бъде забелязано: то е
                причината <RichText text="$Z$" /> и <RichText text="$\phi$" /> да са
                характеристики на веригата, а не на конкретния режим.
              </li>
              <li>
                Честа грешка: <RichText text="$Z=R+X_L-X_C$" />. Диагностика чрез числата от
                въпроса по-горе: скаларното събиране дава грешен отговор още при първата проверка.
              </li>
              <li>
                Комплексният блок е по избор. Пуснете го само ако групата вече е ползвала{" "}
                <RichText text="$e^{i\theta}$" /> в математиката; иначе триъгълникът е напълно
                достатъчен.
              </li>
            </ul>
          </TeacherNote>
        </Section>

        {/* ================================================== §12 */}
        <Section id="resonance" n="§12" title="Резонанс: когато принудата налучка собствената честота">
          <PredictionQuestion
            prompt="Какво се случва с тока в последователна RLC верига, ако честотата се нагласи така, че $X_L=X_C$?"
            options={[
              {
                text: "Става максимален, защото $Z$ приема най-малката си възможна стойност $R$",
                correct: true,
                why: "В $Z=\\sqrt{R^2+(X_L-X_C)^2}$ вторият член е квадрат и е неотрицателен. Нулирането му дава минимум на $Z$, значи максимум на $I_0=V_0/Z$.",
              },
              {
                text: "Става нула, защото двете съпротивления се компенсират и веригата се затваря",
                correct: false,
                why: "Компенсират се напреженията върху $L$ и $C$, не проводимостта. Точно защото нищо не пречи, токът е максимален.",
              },
              {
                text: "Не се променя, защото $R$ не зависи от честотата",
                correct: false,
                why: "$R$ наистина не зависи, но $Z$ зависи, и то силно. Токът се определя от $Z$, не само от $R$.",
              },
              {
                text: "Става безкраен",
                correct: false,
                why: "Това би било вярно само при $R=0$. Реалната верига винаги има съпротивление и то ограничава върха до $V_0/R$.",
              },
            ]}
            explanation="Остава да намерим при коя честота настъпва това условие."
          />

          <Sub>Извеждане на резонансната честота</Sub>
          <p className="text-ink/90">Записваме условието и заместваме двата реактанса:</p>
          <Formula latex={String.raw`X_L=X_C\qquad\Longrightarrow\qquad \omega L=\frac{1}{\omega C}`} />
          <p className="mt-3 text-ink/90">
            Умножаваме двете страни по <RichText text="$\omega C$" />:
          </p>
          <Formula latex={String.raw`\omega^2LC=1\qquad\Longrightarrow\qquad \boxed{\omega_0=\frac{1}{\sqrt{LC}}}\qquad\Longrightarrow\qquad \boxed{f_0=\frac{1}{2\pi\sqrt{LC}}}`} />

          <Callout>
            <strong>Това е същата честота, с която започна главата.</strong> В §1 я получихме от{" "}
            <RichText text="$Lq''+q/C=0$" />, тоест от контур{" "}
            <strong>без източник</strong>. Сега тя изплува отново, като условие за максимален
            отклик на верига <strong>с източник</strong>. Съвпадението не е случайно: една и съща
            комбинация <RichText text="$LC$" /> определя и с какъв ритъм системата умее да трепти
            сама, и с какъв ритъм трябва да я бутаме, за да откликне най-силно.
          </Callout>

          <p className="text-ink/90">При резонанс реактивната част изчезва напълно:</p>
          <Formula latex={String.raw`X_L-X_C=0\quad\Longrightarrow\quad Z=R\quad\Longrightarrow\quad I_0=\frac{V_0}{R},\qquad \phi=0`} />
          <p className="mt-3 text-ink/90">
            Това е максималната възможна амплитуда на тока при дадени{" "}
            <RichText text="$V_0$, $R$, $L$ и $C$" />, и тогава токът и напрежението на източника са
            в фаза. Забележете обаче, че <strong>напреженията върху $L$ и $C$ не са нула</strong>:
            те са равни по големина и противоположни по фаза, затова се унищожават взаимно, а всяко
            от тях поотделно може да е много по-голямо от напрежението на източника.
          </p>

          <Sub>Кривата на отклика</Sub>
          <p className="text-ink/90">
            Комбинираме <RichText text="$I_0=V_0/Z$" /> с израза за импеданса и получаваме
            амплитудата като функция на честотата:
          </p>
          <Formula latex={String.raw`I_0(\omega)=\frac{V_0}{\sqrt{R^2+\left(\omega L-\dfrac{1}{\omega C}\right)^2}}`} />
          <p className="mt-3 text-ink/90">
            Или направо през честотата, с <RichText text="$\omega=2\pi f$" />:
          </p>
          <Formula latex={String.raw`I_0(f)=\frac{V_0}{\sqrt{R^2+\left(2\pi fL-\dfrac{1}{2\pi fC}\right)^2}}`} />

          <Wide>
            <div className="mt-5">
              <ResonanceExplorer />
            </div>
          </Wide>

          <Derivation title="По избор: колко остър е върхът (качествен фактор)">
            <p className="text-[15.5px] leading-relaxed text-ink/90">
              Височината на върха е <RichText text="$V_0/R$" />, а положението му не зависи от{" "}
              <RichText text="$R$" />. Остава да опишем <strong>ширината</strong>. Приема се да се
              мери на нивото, на което мощността пада наполовина, тоест където{" "}
              <RichText text="$|X_L-X_C|=R$" />. Дефиницията е
            </p>
            <Formula latex={String.raw`Q=\frac{\omega_0}{\Delta\omega}`} />
            <p className="text-[15.5px] leading-relaxed text-ink/90">
              където <RichText text="$\Delta\omega$" /> е разстоянието между двете такива честоти.
              Пресмятането дава <RichText text="$\Delta\omega=R/L$" />, откъдето
            </p>
            <Formula latex={String.raw`Q=\frac{\omega_0}{R/L}=\frac{\omega_0L}{R}`} />
            <p className="text-[15.5px] leading-relaxed text-ink/90">
              Малко <RichText text="$R$" /> значи голямо <RichText text="$Q$" />, тоест висок и
              тесен връх. Радиоприемникът иска точно това: висока избирателност, за да не влизат
              съседните станции.
            </p>
          </Derivation>

          <Sub>За какво служи всичко това</Sub>
          <p className="text-ink/90">
            Честотната избирателност на веригата е причината за две всекидневни приложения. При{" "}
            <strong>настройката на радио</strong> променлив кондензатор мести{" "}
            <RichText text="$f_0$" /> така, че да съвпадне с носещата честота на желаната станция:
            всички станции блъскат антената едновременно, но силен отклик дава само една. При{" "}
            <strong>филтрите</strong> се използва по-простото свойство от §9: последователна бобина
            пропуска ниските честоти, последователен кондензатор пропуска високите.
          </p>

          <TeacherNote>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Задължителна проверка на разбирането: „кое мести върха и кое мени височината му?“
                Ако отговорът смесва двете роли, върнете се към формулите за{" "}
                <RichText text="$f_0$" /> и за максимума <RichText text="$V_0/R$" />.
              </li>
              <li>
                Аналогията с махало е най-силна тук: бутането в такт с махането дава голяма
                амплитуда, бутането в чужд ритъм не дава почти нищо.
              </li>
              <li>
                Опасната страна на резонанса заслужава едно изречение: при малко{" "}
                <RichText text="$R$" /> напреженията върху <RichText text="$L$" /> и{" "}
                <RichText text="$C$" /> могат многократно да надхвърлят напрежението на източника.
              </li>
            </ul>
          </TeacherNote>
        </Section>

        {/* ================================================== §13 */}
        <Section id="power" n="§13" title="Ефективни стойности и мощност">
          <PredictionQuestion
            prompt="Средният ток през нагревател, включен в контакта, е точно нула за всеки период. Защо тогава нагревателят се нагрява?"
            options={[
              {
                text: "Защото нагряването е пропорционално на $i^2$, а квадратът е положителен и в двете половини на периода",
                correct: true,
                why: "Мощността $P=i^2R$ не различава посоката на тока. Средната стойност на $i$ е нула, но средната стойност на $i^2$ не е.",
              },
              {
                text: "Защото в действителност токът не сменя посоката си",
                correct: false,
                why: "Сменя я, и то сто пъти в секунда при $50\\,\\mathrm{Hz}$. Точно това е смисълът на думата „променлив“.",
              },
              {
                text: "Защото средното напрежение не е нула",
                correct: false,
                why: "И то е нула. Симетрията на синусоидата важи еднакво за тока и за напрежението.",
              },
              {
                text: "Защото токът е нула само средно, но в отделните моменти извършва работа, която се натрупва алгебрично",
                correct: false,
                why: "Работата не се натрупва алгебрично със знака на тока: и при двете посоки електроните сблъскват решетката и я загряват.",
              },
            ]}
            explanation="Значи търсената величина е свързана със средното на квадрата, а не със средното на самата величина."
          />

          <Sub>Извеждане на ефективната стойност</Sub>
          <p className="text-ink/90">
            Мигновената мощност в резистор е <RichText text="$P=i^2R$" />. При{" "}
            <RichText text="$i(t)=I_0\sin\omega t$" />:
          </p>
          <Formula latex={String.raw`P(t)=I_0^2R\sin^2\omega t\qquad\Longrightarrow\qquad \langle P\rangle=I_0^2R\,\langle\sin^2\omega t\rangle`} />
          <p className="mt-3 text-ink/90">
            Остава да пресметнем средното на <RichText text="$\sin^2$" />. Използваме тъждеството
            за понижаване на степента:
          </p>
          <Formula latex={String.raw`\sin^2x=\frac{1-\cos2x}{2}`} />
          <p className="mt-3 text-ink/90">
            Средната стойност на <RichText text="$\cos 2\omega t$" /> за цял период е нула (то е
            пълен брой периоди на удвоената честота), затова остава само константата:
          </p>
          <Formula latex={String.raw`\langle\sin^2\omega t\rangle=\frac12-\frac12\langle\cos2\omega t\rangle=\frac12\qquad\Longrightarrow\qquad \langle P\rangle=\frac12I_0^2R`} />
          <p className="mt-3 text-ink/90">
            Сега дефинираме <RichText text="$I_{\mathrm{rms}}$" /> като{" "}
            <strong>онзи постоянен ток, който би нагрявал същия резистор със същата средна
            мощност</strong>:
          </p>
          <Formula latex={String.raw`I_{\mathrm{rms}}^2R=\frac12I_0^2R\qquad\Longrightarrow\qquad \boxed{I_{\mathrm{rms}}=\frac{I_0}{\sqrt2}}\qquad\text{и аналогично}\qquad \boxed{V_{\mathrm{rms}}=\frac{V_0}{\sqrt2}}`} />

          <Callout>
            Съкращението rms идва от <em>root mean square</em>: корен от средното на квадрата,
            изпълнено точно в този ред. Множителят{" "}
            <RichText text="$1/\sqrt2\approx0{,}707$" /> обаче <strong>не е универсален</strong>:
            той идва от <RichText text="$\langle\sin^2\rangle=1/2$" /> и важи само за синусоида.
            Между другото, „напрежение <RichText text="$230\,\mathrm V$" /> в контакта“ е тъкмо
            ефективна стойност; амплитудата е около <RichText text="$325\,\mathrm V$" />.
          </Callout>

          <Wide>
            <div className="mt-5">
              <RMSVisualizer />
            </div>
          </Wide>

          <Sub>Извеждане на средната мощност</Sub>
          <p className="text-ink/90">
            Сега за цялата верига, където токът е изместен по фаза. С уговорката от §1:
          </p>
          <Formula latex={String.raw`v(t)=V_0\sin\omega t,\qquad i(t)=I_0\sin(\omega t-\phi)`} />
          <p className="mt-3 text-ink/90">Мигновената мощност е произведението:</p>
          <Formula latex={String.raw`p(t)=v(t)\,i(t)=V_0I_0\sin\omega t\,\sin(\omega t-\phi)`} />
          <p className="mt-3 text-ink/90">
            Произведението на два синуса се разлага на сума чрез{" "}
            <RichText text="$\sin A\sin B=\tfrac12[\cos(A-B)-\cos(A+B)]$" />:
          </p>
          <Formula latex={String.raw`p(t)=\frac{V_0I_0}{2}\Big[\cos\phi-\cos(2\omega t-\phi)\Big]`} />
          <p className="mt-3 text-ink/90">
            Този запис е целият отговор. Първият член е <strong>константа</strong>, вторият е
            трептене с удвоена честота, чиято средна стойност за цял период е нула. Значи
          </p>
          <Formula latex={String.raw`\langle P\rangle=\frac{V_0I_0}{2}\cos\phi`} />
          <p className="mt-3 text-ink/90">
            Заместваме <RichText text="$V_0=\sqrt2\,V_{\mathrm{rms}}$" /> и{" "}
            <RichText text="$I_0=\sqrt2\,I_{\mathrm{rms}}$" />, при което двойката{" "}
            <RichText text="$\sqrt2$" /> изяжда двойката в знаменателя:
          </p>
          <Formula latex={String.raw`\boxed{P_{\mathrm{avg}}=V_{\mathrm{rms}}I_{\mathrm{rms}}\cos\phi}`} />
          <p className="mt-3 text-ink/90">
            Множителят <RichText text="$\boxed{\cos\phi}$" /> се нарича{" "}
            <strong>фактор на мощността</strong>. Произведението{" "}
            <RichText text="$V_{\mathrm{rms}}I_{\mathrm{rms}}$" /> без него се нарича пълна
            мощност и се мери във волт-ампери, за да не се бърка с активната мощност във ватове.
          </p>

          <Sub>Трите случая</Sub>
          <div className="my-5 overflow-hidden rounded-[10px] border-[1.5px] border-ink">
            <table className="w-full text-[15px]">
              <thead>
                <tr className="border-b-[1.5px] border-rule bg-hl text-left">
                  <th className="px-4 py-2 font-bold">Верига</th>
                  <th className="px-4 py-2 font-bold">
                    <RichText text="$\phi$" />
                  </th>
                  <th className="px-4 py-2 font-bold">
                    <RichText text="$P_{\mathrm{avg}}$" />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-[1.5px] divide-rule">
                <tr>
                  <td className="px-4 py-2">Чист резистор</td>
                  <td className="px-4 py-2">
                    <RichText text="$0$" />
                  </td>
                  <td className="px-4 py-2 text-ink/90">
                    <RichText text="$V_{\mathrm{rms}}I_{\mathrm{rms}}$" /> (максимална)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Чиста бобина</td>
                  <td className="px-4 py-2">
                    <RichText text="$+\pi/2$" />
                  </td>
                  <td className="px-4 py-2 text-ink/90">
                    <RichText text="$0$" />
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Чист кондензатор</td>
                  <td className="px-4 py-2">
                    <RichText text="$-\pi/2$" />
                  </td>
                  <td className="px-4 py-2 text-ink/90">
                    <RichText text="$0$" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-ink/90">
            Физическият прочит: идеалните кондензатор и бобина{" "}
            <strong>съхраняват енергия временно и я връщат</strong>. През едната четвъртина от
            периода енергията отива в електричното или магнитното поле, през следващата се връща на
            източника. За цял период балансът е нула, затова те ограничават тока, без да се
            нагряват.
          </p>

          <Wide>
            <div className="mt-5">
              <PowerVisualizer />
            </div>
          </Wide>

          <Sub>Затваряне на кръга</Sub>
          <p className="text-ink/90">
            Има и втори израз за същата мощност и той не е нова формула, а следствие от геометрията
            в §10. Проекцията на <RichText text="$\vec V$" /> върху посоката на тока е точно{" "}
            <RichText text="$\vec V_R$" />:
          </p>
          <Formula latex={String.raw`V_{\mathrm{rms}}\cos\phi=V_{R,\mathrm{rms}}=I_{\mathrm{rms}}R`} />
          <p className="mt-3 text-ink/90">Заместваме в израза за средната мощност:</p>
          <Formula latex={String.raw`P_{\mathrm{avg}}=V_{\mathrm{rms}}I_{\mathrm{rms}}\cos\phi=I_{\mathrm{rms}}^2R`} />
          <Callout>
            <strong>Цялата средна мощност, доставена от източника, се разсейва в резистора.</strong>{" "}
            Точно както в постояннотокова верига. Реактивните елементи не участват в баланса за цял
            период, а <RichText text="$\cos\phi$" /> е просто геометричният начин да се отсее онази
            част от напрежението, която е в фаза с тока.
          </Callout>

          <TeacherNote>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Практическа връзка: заводи с много електродвигатели (силно индуктивен товар) плащат
                за нисък <RichText text="$\cos\phi$" />, защото същият ток пренася по-малко полезна
                мощност и натоварва мрежата излишно. Лечението е добавяне на кондензатори.
              </li>
              <li>
                Диагностичен въпрос: „вярно ли е, че{" "}
                <RichText text="$1\,\mathrm{kVA}=1\,\mathrm{kW}$" />?“ Отговорът „само при{" "}
                <RichText text="$\cos\phi=1$" />“ показва, че разликата е разбрана.
              </li>
              <li>
                Ако някой попита защо в контакта пише{" "}
                <RichText text="$230\,\mathrm V$" />, а амплитудата е{" "}
                <RichText text="$325\,\mathrm V$" />: защото уредите и стандартите работят с
                ефективни стойности, тоест с топлинния еквивалент.
              </li>
            </ul>
          </TeacherNote>
        </Section>

        {/* ================================================== §14 */}
        <Section id="problems" n="§14" title="Водени задачи">
          <p className="mb-5 text-ink/90">
            Четирите задачи минават по целия път: пълен анализ на верига, настройка на резонанс,
            поведение при две различни честоти и мощност, пресметната по два независими начина.
            Всяка започва с въпрос за характера на веригата, преди да се стигне до числата.
          </p>
          <ACProblemSet />
        </Section>

        {/* ================================================== §15 */}
        <Section id="recap" n="§15" title="Обобщение: една карта на цялата глава">
          <p className="text-ink/90">
            Всичко в тази глава излезе от два факта и една геометрична картина. Ето ги подредени:
          </p>

          <div className="my-5 space-y-3">
            <Formula latex={String.raw`\text{(1)}\quad v(t)=V_0\sin(\omega t+\phi),\qquad \omega=2\pi f=\frac{2\pi}{T}`} />
            <Formula latex={String.raw`\text{(2)}\quad \frac{d}{dt}\Big[A\sin(\omega t+\phi)\Big]=\omega A\sin\!\left(\omega t+\phi+\frac\pi2\right)`} />
            <Formula latex={String.raw`\text{(3)}\quad i=C\frac{dv}{dt}\ \ \Longrightarrow\ \ X_C=\frac{1}{\omega C};\qquad v=L\frac{di}{dt}\ \ \Longrightarrow\ \ X_L=\omega L`} />
            <Formula latex={String.raw`\text{(4)}\quad Z=\sqrt{R^2+(X_L-X_C)^2},\qquad \tan\phi=\frac{X_L-X_C}{R}`} />
            <Formula latex={String.raw`\text{(5)}\quad X_L=X_C\ \ \Longrightarrow\ \ \omega_0=\frac{1}{\sqrt{LC}},\qquad Z=R,\qquad I_0=\frac{V_0}{R}`} />
            <Formula latex={String.raw`\text{(6)}\quad V_{\mathrm{rms}}=\frac{V_0}{\sqrt2},\qquad I_{\mathrm{rms}}=\frac{I_0}{\sqrt2},\qquad P_{\mathrm{avg}}=V_{\mathrm{rms}}I_{\mathrm{rms}}\cos\phi=I_{\mathrm{rms}}^2R`} />
          </div>

          <ul className="mt-6 list-disc space-y-2 pl-5 text-ink/90">
            <li>
              <strong>Ред (2) е сърцето на главата.</strong> Диференцирането завърта фазора на{" "}
              <RichText text="$90^\circ$" /> и го удължава <RichText text="$\omega$" /> пъти.
              Оттам идват и двата реактанса, и двете фазови разлики.
            </li>
            <li>
              <strong>Реактансът не е съпротивление.</strong> Той ограничава амплитудата, но не
              разсейва енергия: <RichText text="$\cos(\pm\pi/2)=0$" />.
            </li>
            <li>
              <strong>Импедансът е обобщение на закона на Ом за амплитуди</strong>, а не нов закон.
              Изведохме го от Питагор, не от определение.
            </li>
            <li>
              <strong>Резонансът свързва двете глави.</strong>{" "}
              <RichText text="$\omega_0=1/\sqrt{LC}$" /> се появи веднъж като собствена честота на
              незадвижван контур и втори път като условие за максимален отклик на задвижван.
            </li>
            <li>
              <strong>Ефективните стойности идват от енергията</strong>, не от удобството:{" "}
              <RichText text="$1/\sqrt2$" /> е следствие от{" "}
              <RichText text="$\langle\sin^2\rangle=1/2$" />.
            </li>
          </ul>

          <Sub>Проверка на разбирането</Sub>
          <p className="mb-5 text-ink/90">
            Дванадесет въпроса по целия път на главата. Обяснението към всяка опция казва защо
            точно тя е вярна или грешна.
          </p>
          <Quiz questions={CHECK_QUESTIONS} />

          <div className="mt-8 rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted">
              Накъде нататък
            </p>
            <p className="mt-2 text-ink/90">
              Естественото продължение е <strong>трансформаторът и преносът на енергия</strong>:
              защо електроенергията се разпределя с променлив ток, как взаимната индуктивност от
              главата за индуктивността позволява напрежението да се променя почти без загуби и
              защо преносът на далечни разстояния се прави при високо напрежение. След него идват{" "}
              <strong>изправителите и филтрите</strong>, за които §9 вече даде цялата нужна
              честотна логика.
            </p>
            <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
              <Link
                href="/physics/promenliv-tok/transformator"
                className="font-semibold text-minus underline decoration-2 underline-offset-2 hover:text-ink"
              >
                Напред към трансформатора и преноса
              </Link>
              <Link
                href="/physics/magnetizm/induktivnost"
                className="font-semibold text-minus underline decoration-2 underline-offset-2 hover:text-ink"
              >
                Назад към индуктивността и LC трептенията
              </Link>
            </p>
          </div>

          <TeacherNote>
            <p>
              Ако разполагате с един час: §1, §5, §7-§9 и §11 са скелетът. Секции §3 и §4 могат да
              се дадат за самостоятелна работа с интерактивите, а §13 да остане за следващия път,
              стига да се спомене, че <RichText text="$230\,\mathrm V$" /> в контакта е ефективна
              стойност.
            </p>
          </TeacherNote>
        </Section>
      </main>
    </TeacherModeProvider>
  );
}
