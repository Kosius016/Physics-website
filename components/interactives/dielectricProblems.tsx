import type { GuidedProblemData } from "./GuidedProblem";
import SvgTex from "./SvgTex";
import { Arrow, C } from "./svg";

function Sign({ x, y, positive }: { x: number; y: number; positive: boolean }) {
  return (
    <g stroke={positive ? C.plus : C.minus} strokeWidth={2.1} strokeLinecap="round">
      <line x1={x - 4} y1={y} x2={x + 4} y2={y} />
      {positive && <line x1={x} y1={y - 4} x2={x} y2={y + 4} />}
    </g>
  );
}

function DielectricSlab({
  x,
  y,
  width,
  height,
  tex,
  color = C.warn,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  tex: string;
  color?: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={color} fillOpacity={0.2} stroke={color} strokeWidth={1.5} />
      <SvgTex x={x + width / 2} y={y + height / 2} tex={tex} color={color} width={90} anchor="middle" />
    </g>
  );
}

function fullSlabFigure({
  phase,
  connected,
  epsilonR,
  resultTex,
}: {
  phase: number;
  connected: boolean;
  epsilonR: number;
  resultTex: string;
}) {
  const plateX1 = 80;
  const plateX2 = 400;
  const top = 62;
  const bottom = 226;
  const xs = [110, 150, 190, 230, 270, 310, 350, 390];
  return (
    <g>
      <rect x={plateX1} y={top - 6} width={plateX2 - plateX1} height={12} rx={3} fill={C.wire} />
      <rect x={plateX1} y={bottom - 6} width={plateX2 - plateX1} height={12} rx={3} fill={C.wire} />
      <DielectricSlab
        x={plateX1}
        y={top + 6}
        width={plateX2 - plateX1}
        height={bottom - top - 12}
        tex={`\\varepsilon_r=${epsilonR}`}
      />
      {phase >= 1 && (
        <g opacity={phase === 1 ? 1 : 0.25}>
          {xs.map((x) => (
            <Arrow key={x} x1={x} y1={top + 18} x2={x} y2={bottom - 18} color={C.minus} width={1.8} />
          ))}
          {xs.map((x) => (
            <g key={`bound-${x}`}>
              <Sign x={x} y={top + 18} positive={false} />
              <Sign x={x} y={bottom - 18} positive />
            </g>
          ))}
        </g>
      )}
      {connected ? (
        <g>
          <path d={`M ${plateX2} ${top} H 443 V 118`} fill="none" stroke={C.wire} strokeWidth={2} />
          <path d={`M ${plateX2} ${bottom} H 443 V 178`} fill="none" stroke={C.wire} strokeWidth={2} />
          <line x1={425} y1={132} x2={461} y2={132} stroke={C.plus} strokeWidth={4} />
          <line x1={432} y1={164} x2={454} y2={164} stroke={C.minus} strokeWidth={4} />
          <line x1={443} y1={118} x2={443} y2={132} stroke={C.wire} strokeWidth={2} />
          <line x1={443} y1={164} x2={443} y2={178} stroke={C.wire} strokeWidth={2} />
          <SvgTex x={443} y={105} tex="V" color={C.warn} width={28} anchor="middle" />
        </g>
      ) : (
        <g stroke={C.wire} strokeWidth={2}>
          <line x1={plateX2} y1={top} x2={442} y2={top} />
          <line x1={plateX2} y1={bottom} x2={442} y2={bottom} />
          <circle cx={450} cy={top} r={4} fill={C.wire} stroke="none" />
          <circle cx={450} cy={bottom} r={4} fill={C.wire} stroke="none" />
        </g>
      )}
      {phase >= 2 && (
        <SvgTex
          x={240}
          y={270}
          tex={connected ? String.raw`V=\mathrm{const}` : String.raw`Q=\mathrm{const}`}
          color={phase === 2 ? C.ok : C.mut}
          width={104}
          anchor="middle"
        />
      )}
      {phase >= 3 && (
        <SvgTex x={240} y={292} tex={resultTex} color={C.ok} width={270} anchor="middle" />
      )}
    </g>
  );
}

function isolatedFigure(phase: number) {
  return fullSlabFigure({
    phase,
    connected: false,
    epsilonR: 5,
    resultTex: String.raw`C'=500\,\mathrm{pF},\quad V'=24\,\mathrm V`,
  });
}

function connectedFigure(phase: number) {
  return fullSlabFigure({
    phase,
    connected: true,
    epsilonR: 3,
    resultTex: String.raw`Q'=30\,\mathrm{nC},\quad U'=0{,}75\,\mu\mathrm J`,
  });
}

function layeredFigure(phase: number) {
  const left = 90;
  const right = 390;
  const top = 48;
  const middle = 150;
  const bottom = 252;
  const xs = [120, 165, 210, 255, 300, 345];
  return (
    <g>
      <rect x={left} y={top - 6} width={right - left} height={12} rx={3} fill={C.wire} />
      <rect x={left} y={bottom - 6} width={right - left} height={12} rx={3} fill={C.wire} />
      <DielectricSlab x={left} y={top + 6} width={right - left} height={middle - top - 6} tex={String.raw`\varepsilon_{r1}=2`} color={C.warn} />
      <DielectricSlab x={left} y={middle} width={right - left} height={bottom - middle - 6} tex={String.raw`\varepsilon_{r2}=4`} color={C.minus} />
      {phase >= 1 && (
        <g opacity={phase === 1 ? 1 : 0.25}>
          {xs.map((x) => (
            <Arrow key={x} x1={x} y1={top + 20} x2={x} y2={bottom - 20} color={C.ok} width={1.8} />
          ))}
        </g>
      )}
      {phase >= 2 && (
        <SvgTex
          x={435}
          y={150}
          tex={String.raw`\frac1C=\frac{d/2}{2\varepsilon_0A}+\frac{d/2}{4\varepsilon_0A}`}
          color={phase === 2 ? C.ok : C.mut}
          width={96}
          anchor="middle"
          fontSize={11.5}
        />
      )}
      {phase >= 3 && (
        <SvgTex x={240} y={286} tex={String.raw`C=118\,\mathrm{pF}`} color={C.ok} width={110} anchor="middle" />
      )}
    </g>
  );
}

export const dielectricProblems: GuidedProblemData[] = [
  {
    title: "Откачен кондензатор",
    statement: String.raw`Кондензатор с $C_0=100\,\mathrm{pF}$ е зареден до $V_0=120\,\mathrm V$ и после е откачен. Вкарваме диелектрик с $\varepsilon_r=5$ докрай. Намерете новите $C,V,U$ и сравнете полето.`,
    figure: isolatedFigure,
    figureCaption: (phase) =>
      [
        "Отворените клеми означават, че зарядът няма път за изтичане.",
        "Свързаните заряди създават поле срещу първоначалното.",
        "Първата стъпка е да фиксирате $Q$, не $V$.",
        "Капацитетът нараства пет пъти, а напрежението и енергията намаляват пет пъти.",
      ][phase],
    directionQuestion: {
      prompt: "Накъде сочи полето на свързаните заряди в диелектрика?",
      options: [
        { text: "Срещу първоначалното поле", correct: true },
        { text: "По посока на първоначалното поле", correct: false },
        { text: "Перпендикулярно на плочите, но без определена посока", correct: false },
      ],
      explanation: "Поляризацията поставя свързан отрицателен заряд до положителната плоча и свързан положителен заряд до отрицателната. Полето им е срещу полето на свободните заряди.",
    },
    additionQuestion: {
      prompt: "Коя величина остава фиксирана след откачането?",
      options: [
        { text: "Зарядът $Q$", correct: true },
        { text: "Напрежението $V$", correct: false },
        { text: "Енергията $U$", correct: false },
      ],
      explanation: "Няма проводящ път към батерия или Земя, затова свободният заряд по плочите не може да се промени.",
    },
    hints: [String.raw`Първо намерете $Q=C_0V_0$, после използвайте $C'=\varepsilon_rC_0$.`],
    steps: [
      {
        text: "Запазете началния заряд и увеличете капацитета.",
        latex: String.raw`Q=C_0V_0=12\,\mathrm{nC},\qquad
          C'=\varepsilon_rC_0=500\,\mathrm{pF}`,
      },
      {
        text: "При фиксиран заряд напрежението намалява.",
        latex: String.raw`V'=\frac{Q}{C'}=\frac{V_0}{\varepsilon_r}=24\,\mathrm V,\qquad
          E'=\frac{E_0}{\varepsilon_r}`,
      },
      {
        text: "Използвайте формата на енергията с фиксиран заряд.",
        latex: String.raw`U_0=\frac12C_0V_0^2=0{,}720\,\mu\mathrm J,\qquad
          U'=\frac{Q^2}{2C'}=\frac{U_0}{5}=0{,}144\,\mu\mathrm J`,
      },
    ],
    teacherNotes: [
      "Ако ученикът запази напрежението, попитайте откъде би дошъл допълнителният заряд.",
      "Намалялата енергия се превръща в механична работа при вкарването на диелектрика.",
    ],
  },
  {
    title: "Свързан към батерия",
    statement: String.raw`Кондензатор с $C_0=200\,\mathrm{pF}$ остава свързан към $50\,\mathrm V$. Вкарваме диелектрик с $\varepsilon_r=3$ докрай. Намерете новите $C,Q,U$ и сравнете полето.`,
    figure: connectedFigure,
    figureCaption: (phase) =>
      [
        "Батерията остава част от системата и може да прехвърля заряд.",
        "Поляризацията сама би намалила полето, но батерията добавя свободен заряд.",
        "Фиксирано е напрежението, не зарядът.",
        "При непроменено разстояние полето остава същото, а зарядът и енергията нарастват.",
      ][phase],
    directionQuestion: {
      prompt: "Когато диелектрикът започне да намалява напрежението, как реагира батерията?",
      options: [
        { text: "Прехвърля още свободен заряд към плочите", correct: true },
        { text: "Изтегля целия заряд от плочите", correct: false },
        { text: "Не може да влияе на заряда", correct: false },
      ],
      explanation: "Батерията поддържа зададената потенциална разлика. За по-големия капацитет това изисква по-голям заряд $Q=CV$.",
    },
    additionQuestion: {
      prompt: "Какво става с полето при същото разстояние между плочите?",
      options: [
        { text: "Остава постоянно", correct: true },
        { text: "Намалява три пъти", correct: false },
        { text: "Нараства три пъти", correct: false },
      ],
      explanation: "За идеален плосък кондензатор $E=V/d$. Батерията фиксира $V$, а $d$ не се променя.",
    },
    hints: ["Използвайте формите $Q=CV$ и $U=CV^2/2$, защото напрежението е фиксирано."],
    steps: [
      {
        text: "Диелектрикът увеличава капацитета.",
        latex: String.raw`C'=\varepsilon_rC_0=600\,\mathrm{pF}`,
      },
      {
        text: "Батерията поддържа напрежението и внася допълнителен заряд.",
        latex: String.raw`Q_0=C_0V=10\,\mathrm{nC},\qquad
          Q'=C'V=30\,\mathrm{nC}`,
      },
      {
        text: "Енергията на кондензатора нараства с капацитета.",
        latex: String.raw`U_0=\frac12C_0V^2=0{,}250\,\mu\mathrm J,\qquad
          U'=\frac12C'V^2=0{,}750\,\mu\mathrm J,\qquad E'=E_0`,
      },
    ],
    teacherNotes: [
      "Не казвайте, че поляризацията няма ефект върху полето. Тя се компенсира от допълнителния свободен заряд, внесен от батерията.",
      "Енергията на кондензатора не е затворена система, защото батерията извършва работа.",
    ],
  },
  {
    title: "Два слоя по дебелината",
    statement: String.raw`Плосък кондензатор има $A=100\,\mathrm{cm^2}$ и $d=2{,}00\,\mathrm{mm}$. Половината дебелина е запълнена с $\varepsilon_{r1}=2$, а другата половина с $\varepsilon_{r2}=4$. Намерете еквивалентния капацитет.`,
    figure: layeredFigure,
    figureCaption: (phase) =>
      [
        "Една силова линия преминава през двата материала един след друг.",
        "Посоката на полето е една и съща, но големината му е различна в двата слоя.",
        "Слоевете по дебелината са еквивалентни на последователни кондензатори.",
        "Еквивалентният капацитет е около $118\\,\\mathrm{pF}$.",
      ][phase],
    directionQuestion: {
      prompt: "Как е насочено полето в двата слоя?",
      options: [
        { text: "В една и съща посока от $+$ към $-$", correct: true },
        { text: "Посоката се обръща на границата", correct: false },
        { text: "Полето е успоредно на границата", correct: false },
      ],
      explanation: "Двата слоя са между едни и същи крайни плочи. Потенциалът намалява в една посока през целия кондензатор.",
    },
    additionQuestion: {
      prompt: "В кой слой полето е по-голямо?",
      options: [
        { text: "В слоя с $\\varepsilon_r=2$", correct: true },
        { text: "В слоя с $\\varepsilon_r=4$", correct: false },
        { text: "Еднакво е", correct: false },
      ],
      explanation: "При липса на свободен заряд на вътрешната граница нормалната компонента на $D$ е еднаква. Понеже $E=D/\\varepsilon$, по-малката проницаемост дава по-голямо поле.",
    },
    hints: ["Всеки слой има площ $A$, но дебелина $d/2$."],
    steps: [
      {
        text: "Запишете капацитета на всеки слой.",
        latex: String.raw`C_1=\frac{2\varepsilon_0A}{d/2}
          =\frac{4\varepsilon_0A}{d},\qquad
          C_2=\frac{4\varepsilon_0A}{d/2}
          =\frac{8\varepsilon_0A}{d}`,
      },
      {
        text: "Съберете реципрочните стойности, защото слоевете са последователни.",
        latex: String.raw`\frac1C=\frac1{C_1}+\frac1{C_2}
          =\frac{3d}{8\varepsilon_0A}
          \quad\Longrightarrow\quad
          C=\frac{8\varepsilon_0A}{3d}`,
      },
      {
        text: "Преобразувайте размерите в SI и заместете.",
        latex: String.raw`C=\frac{8\cdot8{,}85\times10^{-12}\cdot1{,}00\times10^{-2}}
          {3\cdot2{,}00\times10^{-3}}
          =1{,}18\times10^{-10}\,\mathrm F=118\,\mathrm{pF}`,
      },
    ],
    teacherNotes: [
      "Честа грешка е слоевете да се приемат за паралелни само защото са нарисувани като два правоъгълника.",
      "Използвайте силова линия: ако тя пресича материалите един след друг, свързването е последователно.",
    ],
  },
];
