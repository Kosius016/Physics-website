import type { GuidedProblemData } from "./GuidedProblem";
import SvgTex from "./SvgTex";
import { CapSymbol, InductorSymbol, ResistorSymbol, SourceSymbol, scaler } from "./acPlot";
import { AngleArc, Arrow, C } from "./svg";

/**
 * Водени задачи към главата за променлив ток. Числата са проверени срещу
 * Serway & Jewett, гл. 33 (примери 33.2, 33.4, 33.5 и 33.6), за да може
 * ученикът да сверява с учебника.
 *
 * Редът, който GuidedProblem налага, е спазен: първо въпрос за характера на
 * веригата, после въпрос за начина на събиране и чак тогава сметката.
 */

const q = (v: number) => Math.round(v * 100) / 100;

/** Обща верига R-L-C в редица, използвана като нулева фаза на две от задачите. */
function SeriesCircuit({ y = 60 }: { y?: number }) {
  return (
    <g>
      <g stroke={C.wire} strokeWidth={2.6} fill="none">
        <line x1={70} y1={y} x2={130} y2={y} />
        <line x1={204} y1={y} x2={240} y2={y} />
        <line x1={302} y1={y} x2={340} y2={y} />
        <line x1={352} y1={y} x2={410} y2={y} />
      </g>
      <SourceSymbol x={70} y={y} r={14} color={C.warn} />
      <ResistorSymbol x={130} y={y} w={74} h={10} color={C.plus} />
      <InductorSymbol x={240} y={y} w={62} color={C.warn} />
      <CapSymbol x={346} y={y} gap={9} plate={18} color={C.minus} />
      <SvgTex x={167} y={y - 20} tex="R" color={C.plus} fontSize={12.5} width={18} anchor="middle" />
      <SvgTex x={271} y={y - 20} tex="L" color={C.warn} fontSize={12.5} width={18} anchor="middle" />
      <SvgTex x={346} y={y - 20} tex="C" color={C.minus} fontSize={12.5} width={18} anchor="middle" />
      <SvgTex x={70} y={y + 28} tex="v(t)" color={C.warn} fontSize={12.5} width={40} anchor="middle" />
    </g>
  );
}

/* --------------------------------------------------------- задача 1 и 4 */

// R = 425 Ω, L = 1.25 H, C = 3.50 µF, f = 60.0 Hz, V0 = 150 V
const P1 = {
  r: 425,
  xl: 471.2,
  xc: 757.9,
  z: 512.7,
  i0: 0.2926,
  phiDeg: -34.0,
  vr: 124.4,
  vl: 137.9,
  vc: 221.8,
};

function PhasorFigure(phase: number) {
  const cx = 190;
  const cy = 175;
  const k = 0.58; // пиксели на волт
  const up = k * P1.vl;
  const down = k * P1.vc;
  const right = k * P1.vr;
  const phi = (P1.phiDeg * Math.PI) / 180;
  const vLen = k * 150;
  return (
    <g>
      <SeriesCircuit y={44} />
      {phase >= 1 && (
        <>
          <Arrow x1={cx} y1={cy} x2={q(cx + right)} y2={cy} color={C.plus} width={2.6} />
          <Arrow x1={cx} y1={cy} x2={cx} y2={q(cy - up)} color={C.warn} width={2.6} />
          <Arrow x1={cx} y1={cy} x2={cx} y2={q(cy + down)} color={C.minus} width={2.6} />
          <SvgTex x={q(cx + right + 26)} y={cy - 14} tex="\vec V_R" color={C.plus} fontSize={12.5} width={32} anchor="middle" />
          <SvgTex x={cx - 30} y={q(cy - up)} tex="\vec V_L" color={C.warn} fontSize={12.5} width={32} anchor="end" />
          <SvgTex x={cx - 30} y={q(cy + down)} tex="\vec V_C" color={C.minus} fontSize={12.5} width={32} anchor="end" />
        </>
      )}
      {phase >= 2 && (
        <>
          <Arrow
            x1={cx}
            y1={cy}
            x2={cx}
            y2={q(cy + down - up)}
            color={C.mut}
            width={2.2}
            dashed
          />
          <Arrow
            x1={cx}
            y1={cy}
            x2={q(cx + vLen * Math.cos(phi))}
            y2={q(cy - vLen * Math.sin(phi))}
            color={C.wire}
            width={3}
          />
          <line
            x1={q(cx + right)}
            y1={cy}
            x2={q(cx + vLen * Math.cos(phi))}
            y2={q(cy - vLen * Math.sin(phi))}
            stroke={C.faint}
            strokeWidth={1.5}
            strokeDasharray="5 4"
          />
          <SvgTex
            x={q(cx + (vLen + 30) * Math.cos(phi))}
            y={q(cy - (vLen + 30) * Math.sin(phi))}
            tex="\vec V"
            color={C.wire}
            fontSize={13}
            width={24}
            anchor="middle"
          />
        </>
      )}
      {phase >= 3 && <AngleArc cx={cx} cy={cy} a1={0} a2={-phi} r={46} color={C.ok} texLabel="\phi" />}
    </g>
  );
}

/* ------------------------------------------------------------- задача 2 */

function ReactanceFigure(phase: number) {
  // L = 20,0 mH; кривите X_L(ω) и X_C(ω) при търсения капацитет C = 2,00 µF
  const ind = 0.02;
  const cap = 2e-6;
  const wMax = 12000;
  const s = scaler({ x: 62, y: 40, w: 356, h: 190 }, wMax, 260, 0);
  const xl = (w: number) => w * ind;
  const xc = (w: number) => 1 / (w * cap);
  const w0 = 5000;
  return (
    <g>
      <line x1={s.box.x} y1={s.y0} x2={s.box.x + s.box.w + 14} y2={s.y0} stroke={C.mut} strokeWidth={1.5} />
      <line x1={s.box.x} y1={s.box.y - 8} x2={s.box.x} y2={s.y0} stroke={C.mut} strokeWidth={1.5} />
      <SvgTex x={s.box.x + s.box.w + 18} y={s.y0 + 15} tex="\omega" color={C.mut} fontSize={12.5} width={22} />
      <SvgTex x={s.box.x - 6} y={s.box.y - 18} tex="X\ (\Omega)" color={C.mut} fontSize={12.5} width={54} anchor="end" />
      <path d={s.path(xl, 120, 100, wMax)} fill="none" stroke={C.warn} strokeWidth={2.6} />
      {phase >= 1 && <path d={s.path(xc, 200, 400, wMax)} fill="none" stroke={C.minus} strokeWidth={2.6} />}
      {phase >= 2 && (
        <>
          <line x1={q(s.sx(w0))} y1={q(s.sy(xl(w0)))} x2={q(s.sx(w0))} y2={s.y0} stroke={C.faint} strokeDasharray="5 4" />
          <circle cx={q(s.sx(w0))} cy={q(s.sy(xl(w0)))} r={6} fill={C.ok} />
        </>
      )}
      {phase >= 3 && (
        <SvgTex x={q(s.sx(w0))} y={s.y0 + 22} tex="\omega_0" color={C.ok} fontSize={12.5} width={26} anchor="middle" />
      )}
      <SvgTex x={s.box.x + s.box.w - 24} y={q(s.sy(xl(wMax * 0.86)))} tex="X_L" color={C.warn} fontSize={12.5} width={26} anchor="middle" />
      {phase >= 1 && (
        <SvgTex x={q(s.sx(1400))} y={q(s.sy(xc(1400))) - 16} tex="X_C" color={C.minus} fontSize={12.5} width={26} anchor="middle" />
      )}
    </g>
  );
}

/* ------------------------------------------------------------- задача 3 */

function InductorFigure(phase: number) {
  const bar = (x: number, frac: number, color: string, label: string) => (
    <g>
      <rect x={x} y={q(200 - 150 * frac)} width={54} height={q(150 * frac)} rx={5} fill={color} fillOpacity={0.8} />
      <SvgTex x={x + 27} y={222} tex={label} color={color} fontSize={12.5} width={62} anchor="middle" />
    </g>
  );
  return (
    <g>
      <g stroke={C.wire} strokeWidth={2.6} fill="none">
        <line x1={64} y1={60} x2={112} y2={60} />
        <line x1={174} y1={60} x2={214} y2={60} />
      </g>
      <SourceSymbol x={64} y={60} r={14} color={C.warn} />
      <InductorSymbol x={112} y={60} w={62} color={C.warn} />
      <SvgTex x={143} y={38} tex="L" color={C.warn} fontSize={13} width={18} anchor="middle" />
      <line x1={64} y1={200} x2={410} y2={200} stroke={C.mut} strokeWidth={1.5} />
      {phase >= 1 && bar(268, 1, C.ok, "60\\,\\mathrm{Hz}")}
      {phase >= 2 && bar(340, 0.01, C.minus, "6\\,\\mathrm{kHz}")}
      {phase >= 3 && (
        <SvgTex x={166} y={140} tex="I_{\text{ср.кв.}}=\dfrac{V_{\text{ср.кв.}}}{\omega L}" color={C.mut} fontSize={13} width={170} anchor="middle" />
      )}
    </g>
  );
}

/* ------------------------------------------------------------- задачите */

export const acProblems: GuidedProblemData[] = [
  {
    title: "Последователна RLC верига при 60 Hz",
    statement:
      "**Пълен анализ.** Последователна верига има $R=425\\,\\Omega$, $L=1{,}25\\,\\mathrm{H}$ и $C=3{,}50\\,\\mu\\mathrm{F}$. Източникът дава $V_0=150\\,\\mathrm{V}$ при $f=60{,}0\\,\\mathrm{Hz}$. Намерете $Z$, $I_0$ и фазовия ъгъл $\\phi$.",
    figure: PhasorFigure,
    figureHeight: 340,
    figureCaption: (phase) =>
      phase >= 3
        ? String.raw`$\phi=-34{,}0^\circ$: токът изпреварва напрежението. Проверка на геометрията: $\sqrt{124{,}4^2+83{,}9^2}=150\,\mathrm{V}$ - точно амплитудата на източника.`
        : phase >= 2
          ? String.raw`Вертикалният остатък е $V_L-V_C=-83{,}9\,\mathrm{V}$ и сочи надолу, затова $\vec V$ пада под $\vec I$.`
          : phase >= 1
            ? String.raw`Трите напрежения са $V_R=124{,}4\,\mathrm{V}$, $V_L=137{,}9\,\mathrm{V}$, $V_C=221{,}8\,\mathrm{V}$. Сборът им като числа е $484\,\mathrm{V}$ - три пъти повече от източника.`
            : undefined,
    directionQuestion: {
      prompt:
        "При $f=60{,}0\\,\\mathrm{Hz}$ кое от двете реактивни съпротивления е по-голямо и какъв характер дава това на веригата?",
      options: [
        {
          text: "$X_C>X_L$, значи веригата е капацитивна и $\\phi<0$",
          correct: true,
          why: "$X_L=\\omega L=471\\,\\Omega$, а $X_C=1/(\\omega C)=758\\,\\Omega$. Разликата $X_L-X_C$ е отрицателна, значи и $\\tan\\phi$ е отрицателен.",
        },
        {
          text: "$X_L>X_C$, значи веригата е индуктивна и $\\phi>0$",
          correct: false,
          why: "Това би било вярно при по-висока честота. При $60\\,\\mathrm{Hz}$ малкият капацитет $3{,}50\\,\\mu\\mathrm{F}$ дава $758\\,\\Omega$ - повече от $471\\,\\Omega$ на бобината.",
        },
        {
          text: "Двете са равни, защото и $L$, и $C$ са в една верига",
          correct: false,
          why: "Равенството $X_L=X_C$ е специално условие (резонанс) и се случва само при една честота, тук около $76\\,\\mathrm{Hz}$, не при всяка.",
        },
        {
          text: "Не може да се сравнят, защото имат различни мерни единици",
          correct: false,
          why: "И двете се измерват в омове: и $\\omega L$, и $1/(\\omega C)$ са отношение на амплитуда напрежение към амплитуда ток.",
        },
      ],
      explanation:
        "Сравнението $X_L$ спрямо $X_C$ решава знака на $\\phi$ още преди да се смята каквото и да е.",
    },
    additionQuestion: {
      prompt: "Как се получава амплитудата на напрежението на източника от трите напрежения?",
      options: [
        {
          text: "$V_0=\\sqrt{V_R^2+(V_L-V_C)^2}$, защото $\\vec V_L$ и $\\vec V_C$ са противоположни, а $\\vec V_R$ е перпендикулярен на тях",
          correct: true,
          why: "Точно това е геометрията на фазорите: $\\vec V_R$ е по тока, $\\vec V_L$ и $\\vec V_C$ са на $\\pm90^\\circ$ от него, затова се събират по Питагор.",
        },
        {
          text: "$V_0=V_R+V_L+V_C$, защото елементите са последователни",
          correct: false,
          why: "Мигновените стойности наистина се събират, но амплитудите - не: трите синусоиди достигат максимумите си в различни моменти. Сборът $484\\,\\mathrm{V}$ противоречи на източника от $150\\,\\mathrm{V}$.",
        },
        {
          text: "$V_0=V_R+(V_L-V_C)$, защото само реактивните се компенсират",
          correct: false,
          why: "Компенсирането на $V_L$ и $V_C$ е вярно, но остатъкът е перпендикулярен на $V_R$, а не успореден - затова се събира по Питагор, не с плюс.",
        },
        {
          text: "$V_0=V_C-V_L$, защото капацитивното е най-голямо",
          correct: false,
          why: "Това изхвърля напълно резистора, върху който при тази верига пада най-голямата активна част от напрежението.",
        },
      ],
      explanation:
        "Оттук се вижда и защо $V_C=221{,}8\\,\\mathrm{V}$ може да надхвърли $150\\,\\mathrm{V}$ на източника без нарушение на нищо: това са амплитуди в различни моменти.",
    },
    hints: [
      "$\\omega=2\\pi f=2\\pi\\cdot60{,}0=377\\,\\mathrm{rad/s}$.",
      "Сметнете първо $X_L=\\omega L$ и $X_C=1/(\\omega C)$, чак после $Z$.",
      "$\\phi=\\arctan\\dfrac{X_L-X_C}{R}$ - знакът идва от числителя.",
    ],
    steps: [
      {
        text: "Ъглова честота и двете реактивни съпротивления.",
        latex: String.raw`\omega=2\pi f=377\ \mathrm{rad/s},\quad X_L=\omega L=471\ \Omega,\quad X_C=\frac{1}{\omega C}=758\ \Omega`,
      },
      {
        text: "Импедансът е хипотенузата на фазорния триъгълник, разделена на I₀.",
        latex: String.raw`Z=\sqrt{R^2+(X_L-X_C)^2}=\sqrt{425^2+(-287)^2}=513\ \Omega`,
      },
      {
        text: "Амплитудата на тока следва от обобщения закон на Ом.",
        latex: String.raw`I_0=\frac{V_0}{Z}=\frac{150}{513}=0{,}292\ \mathrm{A}`,
      },
      {
        text: "Фазовият ъгъл идва от същия триъгълник; отрицателен означава ток, който изпреварва.",
        latex: String.raw`\phi=\arctan\frac{X_L-X_C}{R}=\arctan\frac{-287}{425}=-34{,}0^\circ`,
      },
      {
        text: "Проверка: трите напрежения трябва да върнат точно 150 V.",
        latex: String.raw`\sqrt{(I_0R)^2+(I_0X_L-I_0X_C)^2}=\sqrt{124{,}4^2+83{,}9^2}=150\ \mathrm{V}`,
      },
    ],
    teacherNotes: [
      "Най-честата грешка е събирането на амплитудите като числа. Питайте направо: „колко волта показва волтметър върху кондензатора?“ - $221\\,\\mathrm{V}$ при източник $150\\,\\mathrm{V}$ разклаща увереността и отваря разговора.",
      "Втора честа грешка: $X_C=\\omega C$. Диагностика чрез единиците или чрез границата $\\omega\\to0$.",
      "Помолете за оценка преди сметката: „по-близо ли сме до резонанса или далеч?“ - при $f_0\\approx76\\,\\mathrm{Hz}$ отговорът е „сравнително близо“, което обяснява защо $Z$ не е много по-голямо от $R$.",
    ],
  },
  {
    title: "Настройка на резонанс",
    statement:
      "**Търсен капацитет.** Последователна верига има $R=150\\,\\Omega$ и $L=20{,}0\\,\\mathrm{mH}$ и се захранва с $V_{\\text{ср.кв.}}=20{,}0\\,\\mathrm{V}$ при $\\omega=5000\\,\\mathrm{s^{-1}}$. Какъв капацитет прави тока максимален и колко е той тогава?",
    figure: ReactanceFigure,
    figureHeight: 270,
    figureCaption: (phase) =>
      phase >= 3
        ? String.raw`Пресичането е при $\omega_0=5000\,\mathrm{s^{-1}}$: точно там $Z=R$ и токът е $I_{\text{ср.кв.}}=0{,}133\,\mathrm{A}$.`
        : phase >= 2
          ? String.raw`Търсеният капацитет е този, при който двете криви се пресичат точно при работната честота.`
          : phase >= 1
            ? String.raw`Двете зависимости вървят в противоположни посоки: $X_L$ расте линейно, $X_C$ спада като $1/\omega$.`
            : String.raw`Само $X_L=\omega L$ е известна: тя не зависи от търсения капацитет.`,
    directionQuestion: {
      prompt: "Кое условие прави тока максимален при фиксирани $V_{\\text{ср.кв.}}$, $R$, $L$ и $\\omega$?",
      options: [
        {
          text: "$X_L=X_C$, защото тогава $Z=\\sqrt{R^2+0}=R$ е възможно най-малко",
          correct: true,
          why: "В $Z=\\sqrt{R^2+(X_L-X_C)^2}$ единственото, което може да се променя, е квадратът $(X_L-X_C)^2\\ge0$. Минимумът му е нула.",
        },
        {
          text: "$X_C$ да е възможно най-голямо, за да пропуска повече ток",
          correct: false,
          why: "Голямото $X_C$ увеличава $(X_L-X_C)^2$, значи увеличава $Z$ и намалява тока. Голямо реактивно съпротивление винаги пречи.",
        },
        {
          text: "$R$ да е нула, защото тогава няма загуби",
          correct: false,
          why: "$R$ наистина е в знаменателя, но тук то е фиксирано - въпросът е кой избор на $C$ е най-добър при дадено $R$.",
        },
        {
          text: "$X_L+X_C=R$, за да се уравновесят трите съпротивления",
          correct: false,
          why: "Реактансите влизат в $Z$ като **разлика**, не като сума: те дърпат фазора в противоположни посоки.",
        },
      ],
      explanation:
        "Условието за максимален ток е чисто алгебрично: минимизираме сума от квадрат и константа.",
    },
    additionQuestion: {
      prompt: "Какво се получава, ако се решат $\\omega L=1/(\\omega C)$ спрямо $\\omega$?",
      options: [
        {
          text: "$\\omega_0=1/\\sqrt{LC}$ - същата честота, която $Lq''+q/C=0$ дава за свободните трептения",
          correct: true,
          why: "Умножаването по $\\omega C$ дава $\\omega^2LC=1$. Това е точно характеристичното уравнение на $LC$ контура от предишната глава.",
        },
        {
          text: "$\\omega_0=\\sqrt{LC}$",
          correct: false,
          why: "Проверка по единици: $\\sqrt{LC}$ има размерност на време, а не на честота. Търсената величина е обратната.",
        },
        {
          text: "$\\omega_0=R/L$",
          correct: false,
          why: "$R/L$ е обратното време на затихване в $RL$ верига (и ширината на резонансния връх), а не положението му.",
        },
        {
          text: "$\\omega_0=1/(LC)$",
          correct: false,
          why: "От $\\omega^2LC=1$ следва $\\omega^2=1/(LC)$; корен квадратен още не е взет.",
        },
      ],
      explanation:
        "Съвпадението с честотата на свободните трептения не е случайно: външният източник разклаща система, която сама умее да трепти точно с тази честота.",
    },
    hints: [
      "Максимален ток означава минимален импеданс.",
      "От $\\omega_0=1/\\sqrt{LC}$ изразете $C$.",
      "При резонанс $Z=R$, значи законът на Ом е в най-простата си форма.",
    ],
    steps: [
      {
        text: "Условие за резонанс и израз за търсения капацитет.",
        latex: String.raw`\omega_0=\frac{1}{\sqrt{LC}}\quad\Longrightarrow\quad C=\frac{1}{\omega_0^2L}`,
      },
      {
        text: "Заместваме ω₀ = 5000 s⁻¹ и L = 20,0 mH.",
        latex: String.raw`C=\frac{1}{(5{,}00\times10^{3})^2(20{,}0\times10^{-3})}=2{,}00\ \mu\mathrm{F}`,
      },
      {
        text: "При резонанс реактивните части се компенсират напълно.",
        latex: String.raw`X_L=\omega_0L=100\ \Omega=\frac{1}{\omega_0C}=X_C\quad\Longrightarrow\quad Z=R=150\ \Omega`,
      },
      {
        text: "Токът е максималният възможен за тази верига.",
        latex: String.raw`I_{\text{ср.кв.}}=\frac{V_{\text{ср.кв.}}}{R}=\frac{20{,}0}{150}=0{,}133\ \mathrm{A}`,
      },
      {
        text: "Забележете, че върху $L$ и върху $C$ пада по $I_{\\text{ср.кв.}}X=13{,}3\\,\\mathrm{V}$ - равни и противоположни, затова се унищожават взаимно.",
      },
    ],
    teacherNotes: [
      "Питайте защо в отговора не участва $R$. Това разделя двете роли: $L$ и $C$ определят къде е върхът, $R$ - колко е висок.",
      "Добър момент да се върнете към предишната глава: сравнете $\\omega_0=1/\\sqrt{LC}$ тук и там. Ученикът трябва сам да формулира разликата между собствена и принудена честота.",
      "Диагностичен въпрос: „ако удвоим $C$, накъде се мести върхът?“ (надолу по честота, с множител $1/\\sqrt2$).",
    ],
  },
  {
    title: "Бобина при две различни честоти",
    statement:
      "**Само бобина.** Върху бобина с $L=25{,}0\\,\\mathrm{mH}$ е приложено $V_{\\text{ср.кв.}}=150\\,\\mathrm{V}$. Намерете $X_L$ и $I_{\\text{ср.кв.}}$ при $f=60{,}0\\,\\mathrm{Hz}$, а после при $f=6{,}00\\,\\mathrm{kHz}$.",
    figure: InductorFigure,
    figureHeight: 250,
    figureCaption: (phase) =>
      phase >= 3
        ? String.raw`Стократното увеличаване на честотата свива тока сто пъти: $15{,}9\,\mathrm{A}\to0{,}159\,\mathrm{A}$.`
        : phase >= 2
          ? String.raw`Второто стълбче е при $6{,}00\,\mathrm{kHz}$ и е сто пъти по-ниско от първото.`
          : phase >= 1
            ? String.raw`Първото стълбче е токът при $60{,}0\,\mathrm{Hz}$.`
            : String.raw`Само бобина и източник: $R=0$, значи целият импеданс е $X_L$.`,
    directionQuestion: {
      prompt: "Как се променя токът, ако честотата се увеличи сто пъти при същото напрежение?",
      options: [
        {
          text: "Намалява сто пъти, защото $X_L=\\omega L$ расте пропорционално на честотата",
          correct: true,
          why: "$I_{\\text{ср.кв.}}=V_{\\text{ср.кв.}}/(\\omega L)$: токът е обратно пропорционален на $\\omega$, значи стократното $\\omega$ дава стократно по-малък ток.",
        },
        {
          text: "Нараства сто пъти, защото по-бързата промяна бута повече заряд",
          correct: false,
          why: "Това е поведението на кондензатора ($I_0=\\omega CV_0$). Бобината прави обратното: колкото по-бърза е промяната, толкова по-голямо е обратното ЕДН.",
        },
        {
          text: "Не се променя, защото бобината няма съпротивление",
          correct: false,
          why: "Идеалната бобина наистина няма омово съпротивление, но има реактивно, и то зависи от честотата - точно затова въведохме отделна величина $X_L$.",
        },
        {
          text: "Намалява десет пъти, по корен от отношението на честотите",
          correct: false,
          why: "Корен се появява при импеданса на смесена верига. Тук зависимостта е чисто линейна: $X_L=\\omega L$.",
        },
      ],
      explanation: "Ключът е, че $X_L$ е пропорционално на $\\omega$, а токът - обратно пропорционален на $X_L$.",
    },
    additionQuestion: {
      prompt: "Какво предсказва същата формула в границата на постоянен ток ($\\omega\\to0$)?",
      options: [
        {
          text: "$X_L\\to0$: за постоянен ток идеалната бобина е просто проводник",
          correct: true,
          why: "При $\\omega\\to0$ имаме $X_L=\\omega L\\to0$ и остава само омовото съпротивление на намотката - точно както в главата за $RL$ вериги след установяване.",
        },
        {
          text: "$X_L\\to\\infty$: бобината блокира постоянния ток",
          correct: false,
          why: "Това описва кондензатора, при който $X_C=1/(\\omega C)\\to\\infty$. Двата елемента разменят ролите си в двете граници.",
        },
        {
          text: "$X_L\\to L$: остава само индуктивността",
          correct: false,
          why: "$L$ се мери в хенри, а $X_L$ - в омове; те не могат да са равни. Множителят $\\omega$ е точно този, който преобразува единиците.",
        },
        {
          text: "Формулата спира да важи при $\\omega=0$",
          correct: false,
          why: "Границата е напълно коректна и възпроизвежда позната физика: постоянният ток не създава ЕДН на самоиндукция, защото $di/dt=0$.",
        },
      ],
      explanation:
        "Двете гранични проверки ($\\omega\\to0$ и $\\omega\\to\\infty$) са най-евтиният начин да се провери всяка формула за реактанс.",
    },
    hints: [
      "$X_L=2\\pi fL$.",
      "За чисто индуктивна верига $Z=X_L$, значи $I_{\\text{ср.кв.}}=V_{\\text{ср.кв.}}/X_L$.",
    ],
    steps: [
      {
        text: "Индуктивно съпротивление при 60,0 Hz.",
        latex: String.raw`X_L=2\pi fL=2\pi(60{,}0)(25{,}0\times10^{-3})=9{,}42\ \Omega`,
      },
      {
        text: "Ефективен ток при същата честота.",
        latex: String.raw`I_{\text{ср.кв.}}=\frac{V_{\text{ср.кв.}}}{X_L}=\frac{150}{9{,}42}=15{,}9\ \mathrm{A}`,
      },
      {
        text: "При 6,00 kHz честотата е сто пъти по-голяма.",
        latex: String.raw`X_L=2\pi(6{,}00\times10^{3})(25{,}0\times10^{-3})=942\ \Omega\quad\Longrightarrow\quad I_{\text{ср.кв.}}=0{,}159\ \mathrm{A}`,
      },
      {
        text: "И в двата случая средната мощност е нула: при $\\phi=90^\\circ$ имаме $\\cos\\phi=0$. Бобината взема енергия за четвърт период и я връща през следващата четвърт.",
      },
    ],
    teacherNotes: [
      "Свържете резултата с познатото: намотка, включена последователно на лампа, я затъмнява толкова повече, колкото по-висока е честотата - без да се нагрява осезаемо.",
      "Ако някой попита защо реалната бобина все пак се топли: защото има и омово съпротивление на жицата, което тук пренебрегваме.",
    ],
  },
  {
    title: "Мощност в същата RLC верига",
    statement:
      "**Средна мощност.** За веригата от задача 1 ($V_0=150\\,\\mathrm{V}$, $I_0=0{,}292\\,\\mathrm{A}$, $\\phi=-34{,}0^\\circ$, $R=425\\,\\Omega$) намерете средната мощност по два независими начина и ги сравнете.",
    figure: (phase) => (
      <g>
        <SeriesCircuit y={54} />
        {phase >= 1 && (
          <>
            <rect x={96} y={140} width={110} height={q(30 + 60)} rx={6} fill={C.plus} fillOpacity={0.18} stroke={C.plus} strokeWidth={1.6} />
            <SvgTex x={151} y={186} tex="P_{\mathrm{avg}}" color={C.plus} fontSize={13} width={62} anchor="middle" />
            <SvgTex x={151} y={252} tex="V_{\text{ср.кв.}}I_{\text{ср.кв.}}\cos\phi" color={C.mut} fontSize={12.5} width={190} anchor="middle" />
          </>
        )}
        {phase >= 2 && (
          <>
            <rect x={274} y={140} width={110} height={q(30 + 60)} rx={6} fill={C.ok} fillOpacity={0.18} stroke={C.ok} strokeWidth={1.6} />
            <SvgTex x={329} y={186} tex="P_{\mathrm{avg}}" color={C.ok} fontSize={13} width={62} anchor="middle" />
            <SvgTex x={329} y={252} tex="I_{\text{ср.кв.}}^2R" color={C.mut} fontSize={12.5} width={104} anchor="middle" />
          </>
        )}
        {phase >= 3 && (
          <SvgTex x={240} y={186} tex="=" color={C.wire} fontSize={20} width={22} anchor="middle" />
        )}
      </g>
    ),
    figureHeight: 280,
    figureCaption: (phase) =>
      phase >= 3
        ? String.raw`И двата пътя дават $18{,}1\,\mathrm{W}$. Съвпадението не е случайно: $V_{\text{ср.кв.}}\cos\phi$ е точно проекцията на $\vec V$ върху $\vec I$, тоест $V_R$.`
        : phase >= 2
          ? String.raw`Вторият израз брои само нагряването в резистора.`
          : phase >= 1
            ? String.raw`Първият израз тръгва от източника: $P_{\mathrm{avg}}=V_{\text{ср.кв.}}I_{\text{ср.кв.}}\cos\phi$.`
            : undefined,
    directionQuestion: {
      prompt: "Кои елементи от тази верига участват в средната мощност за цял период?",
      options: [
        {
          text: "Само резисторът: идеалните $L$ и $C$ връщат цялата взета енергия",
          correct: true,
          why: "За тях $\\phi=\\pm90^\\circ$, значи $\\cos\\phi=0$. Енергията им се съхранява в поле и се връща на източника в рамките на същия период.",
        },
        {
          text: "И трите, пропорционално на $R$, $X_L$ и $X_C$",
          correct: false,
          why: "Реактансите ограничават **амплитудата** на тока, но не превръщат енергия в топлина. Ограничаването и разсейването са различни неща.",
        },
        {
          text: "Само бобината, защото тя натрупва най-много енергия",
          correct: false,
          why: "Натрупва и връща. Средната мощност за цял период е нула точно защото площите на вземане и връщане са равни.",
        },
        {
          text: "Само кондензаторът, защото при тази верига $X_C$ е най-голямо",
          correct: false,
          why: "Големината на $X_C$ определя големината на $V_C$, а не разсейването. Идеалният кондензатор не се нагрява.",
        },
      ],
      explanation: "Затова $\\cos\\phi$ се нарича фактор на мощността: той отсява активната част.",
    },
    additionQuestion: {
      prompt: "Защо $V_{\\text{ср.кв.}}I_{\\text{ср.кв.}}\\cos\\phi$ и $I_{\\text{ср.кв.}}^2R$ дават едно и също число?",
      options: [
        {
          text: "Защото от фазорния триъгълник $V_0\\cos\\phi=V_R=I_0R$",
          correct: true,
          why: "Проекцията на $\\vec V$ върху посоката на тока е точно $\\vec V_R$. Заместването на $V_{\\text{ср.кв.}}\\cos\\phi$ с $I_{\\text{ср.кв.}}R$ превръща единия израз в другия.",
        },
        {
          text: "Съвпадение при тези конкретни числа",
          correct: false,
          why: "Тъждеството важи за всяка последователна RLC верига - то следва от геометрията, не от избора на стойности.",
        },
        {
          text: "Защото $\\cos\\phi=R/Z$ винаги е близо до единица",
          correct: false,
          why: "Първата половина е вярна и е точно ключът, но втората не е: при силно реактивна верига $\\cos\\phi$ може да е много малко.",
        },
        {
          text: "Защото средната стойност на $\\cos(2\\omega t-\\phi)$ е нула",
          correct: false,
          why: "Това е вярно и е причината осцилиращият член да отпадне, но то дава първия израз; равенството с $I^2_{\\text{ср.кв.}}R$ идва от геометрията.",
        },
      ],
      explanation:
        "Един и същ факт се вижда двояко: през енергията на източника и през нагряването на резистора.",
    },
    hints: [
      "$V_{\\text{ср.кв.}}=V_0/\\sqrt2$ и $I_{\\text{ср.кв.}}=I_0/\\sqrt2$.",
      "$\\cos(-34{,}0^\\circ)=\\cos(34{,}0^\\circ)=0{,}829$ - знакът на фазата не влияе на мощността.",
    ],
    steps: [
      {
        text: "Ефективни стойности.",
        latex: String.raw`V_{\text{ср.кв.}}=\frac{150}{\sqrt2}=106\ \mathrm{V},\qquad I_{\text{ср.кв.}}=\frac{0{,}292}{\sqrt2}=0{,}206\ \mathrm{A}`,
      },
      {
        text: "Първи път: през фактора на мощността.",
        latex: String.raw`P_{\mathrm{avg}}=V_{\text{ср.кв.}}I_{\text{ср.кв.}}\cos\phi=(106)(0{,}206)(0{,}829)=18{,}1\ \mathrm{W}`,
      },
      {
        text: "Втори път: през нагряването на резистора.",
        latex: String.raw`P_{\mathrm{avg}}=I_{\text{ср.кв.}}^2R=(0{,}206)^2(425)=18{,}1\ \mathrm{W}`,
      },
      {
        text: "Съвпадението е следствие от геометрията, не от числата.",
        latex: String.raw`V_{\text{ср.кв.}}\cos\phi=V_{R,\text{ср.кв.}}=I_{\text{ср.кв.}}R\quad\Longrightarrow\quad V_{\text{ср.кв.}}I_{\text{ср.кв.}}\cos\phi=I_{\text{ср.кв.}}^2R`,
      },
    ],
    teacherNotes: [
      "Ако някой сметне $V_{\\text{ср.кв.}}I_{\\text{ср.кв.}}=21{,}8\\,\\mathrm{VA}$ и го нарече мощност, това е удобен момент за разликата между пълна и активна мощност.",
      "Практическа връзка: заводите с много електродвигатели добавят кондензатори, за да върнат $\\cos\\phi$ близо до единица - същият ток пренася повече полезна мощност.",
    ],
  },
];
