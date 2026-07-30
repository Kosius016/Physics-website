import type { GuidedProblemData } from "./GuidedProblem";
import SvgTex from "./SvgTex";
import { Arrow, C } from "./svg";

function PlatePair({
  top = 82,
  bottom = 218,
  left = 100,
  right = 380,
}: {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}) {
  return (
    <g>
      <rect x={left} y={top - 6} width={right - left} height={12} rx={3} fill={C.wire} />
      <rect x={left} y={bottom - 6} width={right - left} height={12} rx={3} fill={C.wire} />
    </g>
  );
}

function Capacitor({
  x,
  y,
  tex,
  vertical = false,
  color = C.wire,
}: {
  x: number;
  y: number;
  tex: string;
  vertical?: boolean;
  color?: string;
}) {
  return vertical ? (
    <g>
      <line x1={x} y1={y - 40} x2={x} y2={y - 8} stroke={C.wire} strokeWidth={2.5} />
      <line x1={x} y1={y + 8} x2={x} y2={y + 40} stroke={C.wire} strokeWidth={2.5} />
      <line x1={x - 18} y1={y - 8} x2={x + 18} y2={y - 8} stroke={color} strokeWidth={4} />
      <line x1={x - 18} y1={y + 8} x2={x + 18} y2={y + 8} stroke={color} strokeWidth={4} />
      <SvgTex x={x + 24} y={y + 2} tex={tex} color={color} width={66} />
    </g>
  ) : (
    <g>
      <line x1={x - 40} y1={y} x2={x - 8} y2={y} stroke={C.wire} strokeWidth={2.5} />
      <line x1={x + 8} y1={y} x2={x + 40} y2={y} stroke={C.wire} strokeWidth={2.5} />
      <line x1={x - 8} y1={y - 18} x2={x - 8} y2={y + 18} stroke={color} strokeWidth={4} />
      <line x1={x + 8} y1={y - 18} x2={x + 8} y2={y + 18} stroke={color} strokeWidth={4} />
      <SvgTex x={x} y={y - 31} tex={tex} color={color} width={66} anchor="middle" />
    </g>
  );
}

function flatCapacitorFigure(phase: number) {
  const fieldXs = [135, 175, 215, 255, 295, 335];
  return (
    <g>
      <PlatePair />
      <line x1={78} y1={82} x2={78} y2={218} stroke={C.mut} strokeWidth={1.5} />
      <SvgTex x={62} y={150} tex="d" color={C.mut} width={24} anchor="end" />
      <SvgTex x={240} y={246} tex="A" color={C.mut} width={28} anchor="middle" />
      {phase >= 1 && (
        <g className="animate-rise" opacity={phase === 1 ? 1 : 0.25}>
          {fieldXs.map((x) => (
            <Arrow key={x} x1={x} y1={96} x2={x} y2={204} color={C.minus} width={1.8} />
          ))}
          {fieldXs.map((x) => (
            <g key={`sign-${x}`}>
              <SvgTex x={x} y={82} tex="+" color={C.plus} width={18} anchor="middle" fontSize={11} />
              <SvgTex x={x} y={218} tex="-" color={C.minus} width={18} anchor="middle" fontSize={11} />
            </g>
          ))}
        </g>
      )}
      {phase >= 2 && (
        <SvgTex
          x={240}
          y={150}
          tex={String.raw`C=\frac{\varepsilon_0A}{d}`}
          color={phase === 2 ? C.ok : C.mut}
          width={132}
          anchor="middle"
        />
      )}
      {phase >= 3 && (
        <SvgTex
          x={240}
          y={276}
          tex={String.raw`C=118\,\mathrm{pF},\quad Q=1{,}42\,\mathrm{nC}`}
          color={C.ok}
          width={260}
          anchor="middle"
        />
      )}
    </g>
  );
}

function seriesFigure(phase: number) {
  return (
    <g>
      <line x1={45} y1={150} x2={150} y2={150} stroke={C.wire} strokeWidth={2.5} />
      <line x1={168} y1={150} x2={312} y2={150} stroke={C.wire} strokeWidth={2.5} />
      <line x1={330} y1={150} x2={435} y2={150} stroke={C.wire} strokeWidth={2.5} />
      <Capacitor x={159} y={150} tex={String.raw`6\,\mu\mathrm F`} color={C.plus} />
      <Capacitor x={321} y={150} tex={String.raw`3\,\mu\mathrm F`} color={C.minus} />
      <SvgTex x={55} y={122} tex="+" color={C.plus} width={20} anchor="middle" />
      <SvgTex x={425} y={122} tex="-" color={C.minus} width={20} anchor="middle" />
      <SvgTex x={240} y={245} tex={String.raw`V=12\,\mathrm V`} color={C.warn} width={88} anchor="middle" />
      {phase >= 1 && (
        <SvgTex
          x={240}
          y={205}
          tex={String.raw`Q_1=Q_2=Q`}
          color={phase === 1 ? C.ok : C.mut}
          width={108}
          anchor="middle"
        />
      )}
      {phase >= 2 && (
        <SvgTex
          x={240}
          y={72}
          tex={String.raw`C_e=2\,\mu\mathrm F`}
          color={phase === 2 ? C.ok : C.mut}
          width={110}
          anchor="middle"
        />
      )}
      {phase >= 3 && (
        <SvgTex
          x={240}
          y={278}
          tex={String.raw`Q=24\,\mu\mathrm C,\quad V_1=4\,\mathrm V,\quad V_2=8\,\mathrm V`}
          color={C.ok}
          width={310}
          anchor="middle"
        />
      )}
    </g>
  );
}

function mixedNetworkFigure(phase: number) {
  return (
    <g>
      <line x1={52} y1={55} x2={428} y2={55} stroke={C.wire} strokeWidth={2.5} />
      <line x1={52} y1={245} x2={428} y2={245} stroke={C.wire} strokeWidth={2.5} />
      <line x1={135} y1={55} x2={135} y2={117} stroke={C.wire} strokeWidth={2.5} />
      <line x1={135} y1={183} x2={135} y2={245} stroke={C.wire} strokeWidth={2.5} />
      <Capacitor x={135} y={150} vertical tex={String.raw`4\,\mu\mathrm F`} color={C.plus} />
      {phase < 2 ? (
        <g>
          <line x1={345} y1={55} x2={345} y2={91} stroke={C.wire} strokeWidth={2.5} />
          <line x1={345} y1={209} x2={345} y2={245} stroke={C.wire} strokeWidth={2.5} />
          <Capacitor x={345} y={112} vertical tex={String.raw`6\,\mu\mathrm F`} color={C.minus} />
          <Capacitor x={345} y={188} vertical tex={String.raw`3\,\mu\mathrm F`} color={C.warn} />
        </g>
      ) : (
        <g>
          <line x1={345} y1={55} x2={345} y2={117} stroke={C.wire} strokeWidth={2.5} />
          <line x1={345} y1={183} x2={345} y2={245} stroke={C.wire} strokeWidth={2.5} />
          <Capacitor x={345} y={150} vertical tex={String.raw`2\,\mu\mathrm F`} color={C.ok} />
        </g>
      )}
      {phase >= 1 && (
        <SvgTex
          x={345}
          y={280}
          tex={String.raw`C_s=\frac{6\cdot3}{6+3}=2\,\mu\mathrm F`}
          color={phase === 1 ? C.ok : C.mut}
          width={210}
          anchor="middle"
        />
      )}
      {phase >= 2 && (
        <SvgTex x={240} y={28} tex={String.raw`C_e=4+2=6\,\mu\mathrm F`} color={C.ok} width={180} anchor="middle" />
      )}
      {phase >= 3 && (
        <SvgTex
          x={240}
          y={218}
          tex={String.raw`Q_{\text{общо}}=C_eV=60\,\mu\mathrm C`}
          color={C.ok}
          width={210}
          anchor="middle"
        />
      )}
    </g>
  );
}

export const capacitorProblems: GuidedProblemData[] = [
  {
    title: "Плосък кондензатор",
    statement: String.raw`Плосък кондензатор с вакуум между плочите има $A=200\,\mathrm{cm^2}$ и $d=1{,}50\,\mathrm{mm}$. Свързан е към $12\,\mathrm V$. Намерете $C$, $Q$ и $U$.`,
    figure: flatCapacitorFigure,
    figureCaption: (phase) =>
      [
        "Първо превърнете площта и разстоянието в SI.",
        "Полето сочи от положителната към отрицателната плоча.",
        "Геометрията задава капацитета; напрежението влиза чак при намирането на заряда.",
        "Трите резултата са показани след последната сметка.",
      ][phase],
    directionQuestion: {
      prompt: "Горната плоча е положителна. Накъде сочи полето между плочите?",
      options: [
        { text: "Надолу, към отрицателната плоча", correct: true },
        { text: "Нагоре, към положителната плоча", correct: false },
        { text: "Успоредно на плочите", correct: false },
      ],
      explanation: "Посоката на електричното поле е посоката на силата върху положителен пробен заряд: от $+$ към $-$.",
    },
    additionQuestion: {
      prompt: "Ако удвоим площта при същото разстояние, какво става с капацитета?",
      options: [
        { text: "Удвоява се", correct: true },
        { text: "Намалява наполовина", correct: false },
        { text: "Не се променя", correct: false },
      ],
      explanation: "Допълнителната площ е еквивалентна на още един кондензатор, свързан успоредно, затова $C\\propto A$.",
    },
    hints: [
      String.raw`$200\,\mathrm{cm^2}=2{,}00\times10^{-2}\,\mathrm{m^2}$ и $1{,}50\,\mathrm{mm}=1{,}50\times10^{-3}\,\mathrm m$.`,
    ],
    steps: [
      {
        text: "Намерете капацитета само от геометрията.",
        latex: String.raw`C=\frac{\varepsilon_0A}{d}
          =\frac{8{,}85\times10^{-12}\cdot2{,}00\times10^{-2}}{1{,}50\times10^{-3}}
          =1{,}18\times10^{-10}\,\mathrm F`,
      },
      {
        text: "Използвайте дефиницията на капацитета за заряда.",
        latex: String.raw`Q=CV=1{,}18\times10^{-10}\cdot12
          =1{,}42\times10^{-9}\,\mathrm C`,
      },
      {
        text: "При известно напрежение най-пряка е формата $U=CV^2/2$.",
        latex: String.raw`U=\frac12CV^2
          =\frac12\cdot1{,}18\times10^{-10}\cdot12^2
          =8{,}50\times10^{-9}\,\mathrm J`,
      },
    ],
    teacherNotes: [
      "Най-честата грешка е площта да се преобразува с $10^{-3}$ вместо с $10^{-4}$.",
      "Попитайте защо напрежението не участва във формулата за $C$.",
    ],
  },
  {
    title: "Два кондензатора в серия",
    statement: String.raw`Кондензатори $6\,\mu\mathrm F$ и $3\,\mu\mathrm F$ са свързани последователно към $12\,\mathrm V$. Намерете $C_e$, общия заряд и напрежението върху всеки.`,
    figure: seriesFigure,
    figureCaption: (phase) =>
      [
        "Един и същ ток преминава през двата кондензатора без разклонение, затова те са свързани последователно.",
        "Зарядите по двата последователни кондензатора имат еднаква големина.",
        "Еквивалентният капацитет е по-малък и от двата.",
        "По-малкият капацитет получава по-голямата част от напрежението.",
      ][phase],
    directionQuestion: {
      prompt: "Коя плоча на първия кондензатор става положителна при показаната полярност?",
      options: [
        { text: "Лявата", correct: true },
        { text: "Дясната", correct: false },
        { text: "И двете", correct: false },
      ],
      explanation: "Лявата крайна клема е свързана към положителния полюс. Зарядите по съседните плочи се редуват.",
    },
    additionQuestion: {
      prompt: "Как се сравняват големините на зарядите върху двата кондензатора?",
      options: [
        { text: "Равни са", correct: true },
        { text: "По-голям е зарядът на $6\\,\\mu\\mathrm F$", correct: false },
        { text: "По-голям е зарядът на $3\\,\\mu\\mathrm F$", correct: false },
      ],
      explanation: "При зареждането един и същ ток преминава през двата кондензатора без разклонение, затова те натрупват заряди с еднаква големина.",
    },
    hints: [
      "Първо заменете последователната двойка с еквивалентен кондензатор, после намерете общия заряд и чак след това се върнете към отделните кондензатори.",
    ],
    steps: [
      {
        text: "Заменете последователната двойка с нейния еквивалентен кондензатор.",
        latex: String.raw`\frac1{C_e}=\frac1{6}+\frac1{3}\quad\Longrightarrow\quad
          C_e=2\,\mu\mathrm F`,
      },
      {
        text: "Еквивалентният кондензатор е под цялото напрежение.",
        latex: String.raw`Q=C_eV=2\,\mu\mathrm F\cdot12\,\mathrm V=24\,\mu\mathrm C`,
      },
      {
        text: "Върнете се към отделните кондензатори.",
        latex: String.raw`V_1=\frac{Q}{C_1}=4\,\mathrm V,\qquad
          V_2=\frac{Q}{C_2}=8\,\mathrm V,\qquad V_1+V_2=12\,\mathrm V`,
      },
    ],
    teacherNotes: [
      "Ако ученикът събере капацитетите, нека проследи тока: той преминава през двата кондензатора без разклонение.",
      "Проверка: по-малкият капацитет трябва да има по-голямо напрежение при общ заряд.",
    ],
  },
  {
    title: "Смесена верига",
    statement: String.raw`Клон с $4\,\mu\mathrm F$ е свързан успоредно на последователна двойка $6\,\mu\mathrm F$ и $3\,\mu\mathrm F$. Веригата е под $10\,\mathrm V$. Намерете $C_e$, общия заряд и зарядите в двата клона.`,
    figure: mixedNetworkFigure,
    figureCaption: (phase) =>
      [
        "Токът преминава през $6\\,\\mu\\mathrm F$ и $3\\,\\mu\\mathrm F$ по един и същ клон без разклонение.",
        "Първо заменяме последователната двойка с нейния еквивалентен кондензатор.",
        "След замяната остават два успоредно свързани кондензатора.",
        "Върнете се назад: двата клона са под едно и също напрежение.",
      ][phase],
    directionQuestion: {
      prompt: "Кои два кондензатора трябва първо да заменим с един еквивалентен?",
      options: [
        { text: "$6\\,\\mu\\mathrm F$ и $3\\,\\mu\\mathrm F$", correct: true },
        { text: "$4\\,\\mu\\mathrm F$ и $6\\,\\mu\\mathrm F$", correct: false },
        { text: "И трите наведнъж", correct: false },
      ],
      explanation: "Токът преминава през $6\\,\\mu\\mathrm F$ и $3\\,\\mu\\mathrm F$ по един и същ клон без разклонение, затова те са последователни.",
    },
    additionQuestion: {
      prompt: "След замяната кондензаторите $2\\,\\mu\\mathrm F$ и $4\\,\\mu\\mathrm F$ са:",
      options: [
        { text: "Свързани успоредно", correct: true },
        { text: "Последователни", correct: false },
        { text: "Несвързани", correct: false },
      ],
      explanation: "Токът се разклонява към двата клона, затова кондензаторите са свързани успоредно и имат общо напрежение.",
    },
    hints: ["При връщането назад успоредните клонове имат общо напрежение $10\\,\\mathrm V$."],
    steps: [
      {
        text: "Заменете последователната двойка с еквивалентния ѝ кондензатор.",
        latex: String.raw`C_s=\frac{6\cdot3}{6+3}=2\,\mu\mathrm F`,
      },
      {
        text: "Съберете капацитетите на двата успоредни клона.",
        latex: String.raw`C_e=4+2=6\,\mu\mathrm F`,
      },
      {
        text: "Намерете общия заряд и зарядите в клоновете.",
        latex: String.raw`Q_{\text{общо}}=C_eV=60\,\mu\mathrm C,\qquad
          Q_{4}=40\,\mu\mathrm C,\qquad Q_s=20\,\mu\mathrm C`,
      },
    ],
    teacherNotes: [
      "Честа грешка е зарядите в успоредните клонове да се приемат за равни.",
      "В последователния клон всеки от двата оригинални кондензатора носи $20\\,\\mu\\mathrm C$.",
    ],
  },
];
