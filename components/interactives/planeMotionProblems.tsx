import { AngleArc, Arrow, C } from "./svg";
import type { GuidedProblemData } from "./GuidedProblem";
import SvgTex from "./SvgTex";

/**
 * Трите водени задачи към урок 1.3 „Движение на материална точка в една
 * равнина“. Фигурите се дострояват по фази: 0 геометрия → 1 участъците на
 * движението → 2 преместването → 3 компонентите и ъгълът.
 *
 * Числата остават в стъпките на решението; в сцените влизат само символи.
 */

/** Помощно затъмняване на елементите от предишна фаза. */
const past = (phase: number, at: number) => ({
  opacity: phase === at ? 1 : 0.28,
  style: { transition: "opacity 180ms ease-out" },
});

/* ---------------- Задача 1 · Туристът: изток, после север ---------------- */

const T1 = { ax: 120, ay: 230, bx: 240, by: 230, cx: 240, cy: 70 };

function p1Figure(phase: number) {
  const { ax, ay, bx, by, cx, cy } = T1;
  return (
    <g>
      {/* мрежа по километри */}
      {Array.from({ length: 11 }, (_, i) => 40 + i * 40).map((x) => (
        <line key={`v${x}`} x1={x} y1={40} x2={x} y2={266} stroke={C.faint} strokeWidth={0.8} opacity={0.3} />
      ))}
      {Array.from({ length: 6 }, (_, i) => 46 + i * 40).map((y) => (
        <line key={`h${y}`} x1={40} y1={y} x2={440} y2={y} stroke={C.faint} strokeWidth={0.8} opacity={0.3} />
      ))}

      {/* посоките на света */}
      <Arrow x1={62} y1={92} x2={62} y2={52} color={C.mut} width={1.8} />
      <text x={62} y={44} textAnchor="middle" fill={C.mut} fontSize={11} fontWeight={600}>
        СЕВЕР
      </text>
      <Arrow x1={62} y1={92} x2={102} y2={92} color={C.mut} width={1.8} />
      <text x={110} y={96} fill={C.mut} fontSize={11} fontWeight={600}>
        ИЗТОК
      </text>

      <circle cx={ax} cy={ay} r={5.5} fill={C.wire} />
      <circle cx={bx} cy={by} r={4.5} fill={C.mut} />
      <circle cx={cx} cy={cy} r={5.5} fill={C.wire} />
      <SvgTex x={ax} y={ay + 22} tex="A" color={C.wire} fontSize={13} width={22} anchor="middle" />
      <SvgTex x={bx + 14} y={by + 20} tex="B" color={C.mut} fontSize={13} width={22} anchor="middle" />
      <SvgTex x={cx} y={cy - 22} tex="C" color={C.wire} fontSize={13} width={22} anchor="middle" />

      {phase >= 1 && (
        <g className="animate-rise" {...past(phase, 1)}>
          <Arrow x1={ax} y1={ay} x2={bx} y2={by} color={C.warn} width={3.4} />
          <Arrow x1={bx} y1={by} x2={cx} y2={cy} color={C.warn} width={3.4} />
          <SvgTex x={205} y={214} tex="s_1" color={C.warn} fontSize={13} width={28} anchor="middle" />
          <SvgTex x={cx + 14} y={152} tex="s_2" color={C.warn} fontSize={13} width={28} />
        </g>
      )}

      {phase >= 2 && (
        <g className="animate-rise">
          <path d={`M ${bx - 14} ${by} L ${bx - 14} ${by - 14} L ${bx} ${by - 14}`} fill="none" stroke={C.faint} strokeWidth={1.4} />
          <Arrow x1={ax} y1={ay} x2={cx} y2={cy} color={C.ok} width={3.4} />
          <SvgTex x={166} y={144} tex={String.raw`\Delta\vec r`} color={C.ok} fontSize={13} width={34} anchor="end" />
        </g>
      )}

      {phase >= 3 && (
        <g className="animate-rise">
          <AngleArc cx={ax} cy={ay} a1={0} a2={Math.atan2(cy - ay, cx - ax)} r={30} color={C.minus} texLabel={String.raw`\varphi`} />
        </g>
      )}
    </g>
  );
}

const problem1: GuidedProblemData = {
  title: "Турист по чупен маршрут",
  statement:
    "Турист тръгва от хижа $A$, върви $3\\,\\mathrm{km}$ на изток до кръстопът $B$, после $4\\,\\mathrm{km}$ на север до заслон $C$. Намерете изминатия път и преместването му.",
  figureHeight: 300,
  figure: p1Figure,
  figureCaption: (phase) =>
    phase === 0
      ? "Маршрутът е зададен само с трите точки. Преди сметките: кое от двете търсим - дължината на пътеката или вектора от началото до края?"
      : phase === 1
        ? "Двата участъка на движението. Изминатият път е тяхната **дължина**, събрана като числа."
        : phase === 2
          ? "Преместването е един-единствен вектор от $A$ до $C$. То не помни, че туристът е минал през $B$."
          : "Ъгълът $\\varphi$ дава посоката на преместването спрямо изток.",
  directionQuestion: {
    prompt: "Накъде сочи преместването на туриста?",
    options: [
      {
        text: "От началната към крайната точка, тоест на североизток",
        correct: true,
        why: "Преместването е векторът $\\Delta\\vec r$ от началното до крайното положение. Междинните точки не влияят на него.",
      },
      {
        text: "По маршрута: първо на изток, после на север",
        correct: false,
        why: "Това описва траекторията, а не преместването. Преместването е **един** вектор, а не поредица от участъци.",
      },
      {
        text: "На север, защото това е последната посока на движение",
        correct: false,
        why: "Последната посока е свойство на движението в края, не на преместването. Иначе всяко движение, завършващо на север, би имало едно и също преместване.",
      },
      {
        text: "Няма определена посока, защото маршрутът е чупен",
        correct: false,
        why: "Чупеният маршрут прави сложна траекторията, но началото и краят си остават две точки, а между тях има точно един вектор.",
      },
    ],
    explanation:
      "Правилото е едно и също за всяка траектория: $\\Delta\\vec r=\\vec r_C-\\vec r_A$.",
  },
  additionQuestion: {
    prompt: "Как се сравняват изминатият път и модулът на преместването?",
    options: [
      {
        text: "Пътят е по-голям: $7\\,\\mathrm{km}$ срещу $5\\,\\mathrm{km}$",
        correct: true,
        why: "Пътят е $3+4=7\\,\\mathrm{km}$, а преместването е хипотенузата $\\sqrt{3^2+4^2}=5\\,\\mathrm{km}$.",
      },
      {
        text: "Равни са: и двете са $7\\,\\mathrm{km}$",
        correct: false,
        why: "Това би било вярно само ако движението беше по права. Тук отсечките са под прав ъгъл и правата от $A$ до $C$ е по-къса от обиколния маршрут.",
      },
      {
        text: "Преместването е по-голямо, защото е по правата",
        correct: false,
        why: "Правата е най-**късото** разстояние между две точки, затова $|\\Delta\\vec r|$ никога не надминава $s$.",
      },
      {
        text: "Пътят е $7\\,\\mathrm{km}$, преместването е $1\\,\\mathrm{km}$",
        correct: false,
        why: "Изваждането $4-3$ би било вярно при движение по една права напред и назад. Тук двете отсечки са перпендикулярни и не се изваждат, а се събират като вектори.",
      },
    ],
    explanation:
      "Общото правило: $|\\Delta\\vec r|\\le s$, като равенство има само при движение по права в една посока.",
  },
  hints: [
    "Пътят е дължина - скаларна величина, която само расте. Преместването е вектор между две точки.",
    "Нанесете двата участъка като вектори и ги съберете по правилото на триъгълника.",
  ],
  steps: [
    {
      text: "Изминатият път е дължината на цялата траектория, тоест сборът на двата участъка:",
      latex: String.raw`s=s_1+s_2=3\,\mathrm{km}+4\,\mathrm{km}=7\,\mathrm{km}`,
    },
    {
      text: "Преместването е векторна сума. В координатна система с ос $Ox$ на изток и $Oy$ на север:",
      latex: String.raw`\Delta\vec r=\Delta\vec r_1+\Delta\vec r_2=3\,\hat i+4\,\hat j\ \ [\mathrm{km}]`,
    },
    {
      text: "Модулът се пресмята по Питагоровата теорема, защото компонентите са перпендикулярни:",
      latex: String.raw`|\Delta\vec r|=\sqrt{3^2+4^2}=5\,\mathrm{km}`,
    },
    {
      text: "Посоката спрямо изток:",
      latex: String.raw`\tan\varphi=\frac{4}{3}\ \Rightarrow\ \varphi\approx53^\circ\ \text{на север от изток}`,
    },
  ],
  teacherNotes: [
    "Най-честата грешка е $7\\,\\mathrm{km}$ да се обяви и за преместване. Питайте: „ако туристът беше отишъл направо, колко щеше да извърви?“",
    "Втора честа грешка е изваждането $4-3=1$ - пренесено по инерция от движение по права.",
    "Добър контролен въпрос: „кое от двете ще покаже GPS-ът като разстояние до хижата - $5$ или $7\\,\\mathrm{km}$?“",
  ],
};

/* ---------------- Задача 2 · Кръгова писта ---------------- */

const T2 = { cx: 240, cy: 200, r: 150 };

function p2Figure(phase: number) {
  const { cx, cy, r } = T2;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.wire} strokeWidth={2.4} strokeDasharray="7 6" />
      <circle cx={cx} cy={cy} r={3.5} fill={C.mut} />
      <line x1={cx} y1={cy} x2={cx} y2={cy - r} stroke={C.mut} strokeWidth={1.5} />
      <SvgTex x={cx + 12} y={cy - r / 2} tex="R" color={C.mut} fontSize={13} width={24} />

      <circle cx={cx - r} cy={cy} r={6} fill={C.wire} />
      <circle cx={cx + r} cy={cy} r={6} fill={C.wire} />
      <SvgTex x={cx - r - 12} y={cy + 2} tex="1" color={C.wire} fontSize={13} width={20} anchor="end" />
      <SvgTex x={cx + r + 12} y={cy + 2} tex="2" color={C.wire} fontSize={13} width={20} />

      {phase >= 1 && (
        <g className="animate-rise" {...past(phase, 1)}>
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke={C.warn}
            strokeWidth={5}
            strokeLinecap="round"
          />
          <SvgTex x={cx} y={cy - r - 22} tex="s" color={C.warn} fontSize={14} width={22} anchor="middle" />
        </g>
      )}

      {phase >= 2 && (
        <g className="animate-rise">
          <Arrow x1={cx - r} y1={cy} x2={cx + r} y2={cy} color={C.ok} width={3.4} />
          <SvgTex x={cx} y={cy + 26} tex={String.raw`\Delta\vec r`} color={C.ok} fontSize={13} width={34} anchor="middle" />
        </g>
      )}

      {phase >= 3 && (
        <g className="animate-rise">
          <path
            d={`M ${cx + r} ${cy} A ${r} ${r} 0 0 1 ${cx - r} ${cy}`}
            fill="none"
            stroke={C.warn}
            strokeWidth={5}
            strokeLinecap="round"
            opacity={0.55}
          />
          <text x={cx} y={cy + r + 34} textAnchor="middle" fill={C.mut} fontSize={11.5} fontWeight={600}>
            ПЪЛНА ОБИКОЛКА
          </text>
        </g>
      )}
    </g>
  );
}

const problem2: GuidedProblemData = {
  title: "Половин и цяла обиколка",
  statement:
    "Спортист тича по кръгова писта с радиус $R=40\\,\\mathrm{m}$. Намерете изминатия път и преместването: а) след половин обиколка; б) след пълна обиколка.",
  figureHeight: 400,
  figure: p2Figure,
  figureCaption: (phase) =>
    phase === 0
      ? "Пистата е окръжност. Точка $1$ е стартът, точка $2$ е диаметрално срещуположната точка."
      : phase === 1
        ? "Изминатият път е дължината на дъгата - тя се мери **по** пистата."
        : phase === 2
          ? "Преместването е правата отсечка между двете точки, тоест диаметърът."
          : "След пълната обиколка спортистът е обратно в точка $1$: пътят е двойно по-дълъг, а преместването е нула.",
  directionQuestion: {
    prompt: "Какво е преместването след половин обиколка?",
    options: [
      {
        text: "Вектор с дължина $2R$ по диаметъра",
        correct: true,
        why: "Началото и краят са диаметрално срещуположни, а правата между тях е диаметърът: $|\\Delta\\vec r|=2R$.",
      },
      {
        text: "Вектор с дължина $\\pi R$",
        correct: false,
        why: "$\\pi R$ е дължината на дъгата, тоест изминатият път. Преместването се мери по правата, а не по пистата.",
      },
      {
        text: "Нула, защото движението е по окръжност",
        correct: false,
        why: "Преместването става нула само когато тялото се върне в началната точка. След половин обиколка то е в срещуположния край.",
      },
      {
        text: "Вектор с дължина $R$",
        correct: false,
        why: "$R$ е разстоянието до центъра. От точка $1$ до точка $2$ се минава през центъра, тоест два радиуса.",
      },
    ],
    explanation: "Преместването зависи само от началното и крайното положение, не от формата на траекторията.",
  },
  additionQuestion: {
    prompt: "А след пълна обиколка, когато спортистът е обратно на старта?",
    options: [
      {
        text: "Пътят е $2\\pi R$, а преместването е нула",
        correct: true,
        why: "Пътят брои цялата обиколка, а преместването свързва началото с края - а те съвпадат, значи $\\Delta\\vec r=\\vec 0$.",
      },
      {
        text: "И пътят, и преместването са $2\\pi R$",
        correct: false,
        why: "Пътят наистина е $2\\pi R$, но преместването не е дължина на траекторията, а вектор между две точки, които тук са една и съща.",
      },
      {
        text: "Пътят е нула, преместването е $2\\pi R$",
        correct: false,
        why: "Разменени са. Пътят никога не намалява: щом краката са изминали обиколката, $s=2\\pi R$.",
      },
      {
        text: "Пътят е $2\\pi R$, преместването е $2R$",
        correct: false,
        why: "$2R$ е преместването след **половин** обиколка. След цяла обиколка крайната точка съвпада с началната.",
      },
    ],
    explanation:
      "Затвореният маршрут е крайният случай: $s>0$, а $|\\Delta\\vec r|=0$. Отношението $s/|\\Delta\\vec r|$ няма смисъл.",
  },
  hints: [
    "Дължината на цялата окръжност е $2\\pi R$, значи половината дъга е $\\pi R$.",
    "За преместването гледайте само двете точки: къде тръгва тялото и къде спира.",
  ],
  steps: [
    {
      text: "а) Пътят при половин обиколка е половината от дължината на окръжността:",
      latex: String.raw`s=\pi R=\pi\cdot40\,\mathrm{m}\approx125{,}7\,\mathrm{m}`,
    },
    {
      text: "Преместването свързва двете диаметрално срещуположни точки:",
      latex: String.raw`|\Delta\vec r|=2R=80\,\mathrm{m}`,
    },
    {
      text: "Отношението показва колко „обиколно“ е движението:",
      latex: String.raw`\frac{s}{|\Delta\vec r|}=\frac{\pi R}{2R}=\frac{\pi}{2}\approx1{,}57`,
    },
    {
      text: "б) При пълна обиколка пътят се удвоява, а крайната точка съвпада с началната:",
      latex: String.raw`s=2\pi R\approx251{,}3\,\mathrm{m},\qquad |\Delta\vec r|=0`,
    },
  ],
  teacherNotes: [
    "Ученици често дават $\\pi R$ и за преместването - смесват дъга с хорда. Покажете, че хордата през центъра е диаметърът.",
    "Втора грешка: „щом преместването е нула, значи спортистът не се е движил“. Разграничете „не се е преместил“ от „не се е движил“.",
    "Полезен въпрос: „кой от двата резултата плаща таксиметровият апарат и кой - навигацията?“",
  ],
};

/* ---------------- Задача 3 · Преместване по радиус-вектори ---------------- */

const T3 = { ox: 56, oy: 290, u: 44 };
const p3 = (x: number, y: number) => ({ x: T3.ox + x * T3.u, y: T3.oy - y * T3.u });

function p3Figure(phase: number) {
  const { ox, oy, u } = T3;
  const m1 = p3(2, 5);
  const m2 = p3(8, 1);
  const corner = { x: m2.x, y: m1.y };
  return (
    <g>
      {/* оси */}
      <line x1={ox} y1={oy} x2={452} y2={oy} stroke={C.mut} strokeWidth={1.7} />
      <polygon points={`460,${oy} 448,${oy - 5} 448,${oy + 5}`} fill={C.mut} />
      <line x1={ox} y1={oy} x2={ox} y2={54} stroke={C.mut} strokeWidth={1.7} />
      <polygon points={`${ox},46 ${ox - 5},58 ${ox + 5},58`} fill={C.mut} />
      <SvgTex x={452} y={oy + 24} tex={String.raw`x\,[\mathrm{m}]`} color={C.mut} fontSize={12} width={58} anchor="end" />
      <SvgTex x={ox + 10} y={58} tex={String.raw`y\,[\mathrm{m}]`} color={C.mut} fontSize={12} width={58} />
      <SvgTex x={ox - 12} y={oy + 18} tex="O" color={C.mut} fontSize={12.5} width={20} anchor="middle" />

      {[2, 4, 6, 8].map((n) => (
        <g key={`x${n}`}>
          <line x1={ox + n * u} y1={oy - 4} x2={ox + n * u} y2={oy + 4} stroke={C.mut} strokeWidth={1.3} />
          <SvgTex x={ox + n * u} y={oy + 18} tex={String(n)} color={C.faint} fontSize={11} width={20} anchor="middle" />
        </g>
      ))}
      {[2, 4].map((n) => (
        <g key={`y${n}`}>
          <line x1={ox - 4} y1={oy - n * u} x2={ox + 4} y2={oy - n * u} stroke={C.mut} strokeWidth={1.3} />
          <SvgTex x={ox - 11} y={oy - n * u} tex={String(n)} color={C.faint} fontSize={11} width={20} anchor="end" />
        </g>
      ))}

      <circle cx={m1.x} cy={m1.y} r={6} fill={C.wire} />
      <circle cx={m2.x} cy={m2.y} r={6} fill={C.wire} />
      <SvgTex x={m1.x - 12} y={m1.y - 4} tex="M_1" color={C.wire} fontSize={13} width={30} anchor="end" />
      <SvgTex x={m2.x + 14} y={m2.y + 20} tex="M_2" color={C.wire} fontSize={13} width={30} />

      {phase >= 1 && (
        <g className="animate-rise" {...past(phase, 1)}>
          <Arrow x1={ox} y1={oy} x2={m1.x} y2={m1.y} color={C.minus} width={2.8} />
          <SvgTex x={(ox + m1.x) / 2 - 12} y={(oy + m1.y) / 2} tex={String.raw`\vec r_1`} color={C.minus} fontSize={13} width={28} anchor="end" />
          <Arrow x1={ox} y1={oy} x2={m2.x} y2={m2.y} color={C.minus} width={2.8} />
          <SvgTex x={(ox + m2.x) / 2} y={(oy + m2.y) / 2 - 16} tex={String.raw`\vec r_2`} color={C.minus} fontSize={13} width={28} anchor="middle" />
        </g>
      )}

      {phase >= 2 && (
        <g className="animate-rise">
          <Arrow x1={m1.x} y1={m1.y} x2={m2.x} y2={m2.y} color={C.ok} width={3.4} />
          <SvgTex x={(m1.x + m2.x) / 2 - 18} y={(m1.y + m2.y) / 2 - 12} tex={String.raw`\Delta\vec r`} color={C.ok} fontSize={13} width={34} anchor="end" />
        </g>
      )}

      {phase >= 3 && (
        <g className="animate-rise">
          <line x1={m1.x} y1={m1.y} x2={corner.x} y2={corner.y} stroke={C.warn} strokeWidth={2.6} strokeDasharray="6 4" />
          <line x1={corner.x} y1={corner.y} x2={m2.x} y2={m2.y} stroke={C.plus} strokeWidth={2.6} strokeDasharray="6 4" />
          <path
            d={`M ${corner.x - 13} ${corner.y} L ${corner.x - 13} ${corner.y + 13} L ${corner.x} ${corner.y + 13}`}
            fill="none"
            stroke={C.faint}
            strokeWidth={1.4}
          />
          <SvgTex x={(m1.x + corner.x) / 2} y={corner.y - 16} tex={String.raw`\Delta x`} color={C.warn} fontSize={13} width={32} anchor="middle" />
          <SvgTex x={corner.x + 14} y={(corner.y + m2.y) / 2} tex={String.raw`\Delta y`} color={C.plus} fontSize={13} width={32} />
        </g>
      )}
    </g>
  );
}

const problem3: GuidedProblemData = {
  title: "Преместване от два радиус-вектора",
  statement:
    "Материална точка минава от положение $\\vec r_1=2\\,\\hat i+5\\,\\hat j$ $[\\mathrm{m}]$ в положение $\\vec r_2=8\\,\\hat i+1\\,\\hat j$ $[\\mathrm{m}]$. Намерете преместването, неговия модул и посоката му.",
  figureHeight: 340,
  figure: p3Figure,
  figureCaption: (phase) =>
    phase === 0
      ? "Двете положения са зададени с координати. Още нищо не е свързано - точките просто стоят в равнината."
      : phase === 1
        ? "Радиус-векторите тръгват от началото $O$ и посочват двете положения."
        : phase === 2
          ? "Преместването свързва край на $\\vec r_1$ с край на $\\vec r_2$: то затваря триъгълника $O,M_1,M_2$."
          : "Компонентите $\\Delta x$ и $\\Delta y$ са катетите; модулът е хипотенузата.",
  directionQuestion: {
    prompt: "Как се намира преместването от двата радиус-вектора?",
    options: [
      {
        text: "$\\Delta\\vec r=\\vec r_2-\\vec r_1$",
        correct: true,
        why: "Векторът от $M_1$ до $M_2$ е разликата „краен минус начален“ - точно както $\\Delta t=t_2-t_1$.",
      },
      {
        text: "$\\Delta\\vec r=\\vec r_1+\\vec r_2$",
        correct: false,
        why: "Събирането би дало диагонала на успоредника от двата радиус-вектора - вектор, който не свързва $M_1$ с $M_2$.",
      },
      {
        text: "$\\Delta\\vec r=\\vec r_1-\\vec r_2$",
        correct: false,
        why: "Този вектор има същия модул, но сочи обратно: от $M_2$ към $M_1$. Редът на изваждането носи посоката.",
      },
      {
        text: "$\\Delta\\vec r=|\\vec r_2|-|\\vec r_1|$",
        correct: false,
        why: "Отдясно стои число, отляво - вектор. Освен това разликата на модулите не е равна на модула на разликата.",
      },
    ],
    explanation: "Формулата $\\Delta\\vec r=\\vec r_2-\\vec r_1$ важи за всяка траектория между двете положения.",
  },
  additionQuestion: {
    prompt: "Каква е ординатната компонента $\\Delta y$ на преместването?",
    options: [
      {
        text: "Отрицателна, защото тялото се измества надолу по оста $Oy$",
        correct: true,
        why: "$\\Delta y=1-5=-4\\,\\mathrm{m}$. Знакът показва посоката по оста, а не че „дължина“ е отрицателна.",
      },
      {
        text: "Положителна, защото преместването е разстояние",
        correct: false,
        why: "Разстоянието е модулът $|\\Delta\\vec r|$ и той наистина е положителен. Компонентите обаче могат да са и отрицателни.",
      },
      {
        text: "Нула, защото тялото се движи главно надясно",
        correct: false,
        why: "Движението надясно се вижда в $\\Delta x$. Ординатата се променя от $5$ на $1$, значи $\\Delta y\\ne0$.",
      },
      {
        text: "Не може да се определи, докато не се даде времето",
        correct: false,
        why: "Преместването зависи само от началното и крайното положение. Времето трябва за скоростта, не за преместването.",
      },
    ],
    explanation: "Знаците на компонентите носят посоката; модулът е винаги неотрицателен.",
  },
  hints: [
    "Извадете компонента по компонента: първо абсцисите, после ординатите.",
    "Проверете накрая дали $|\\vec r_2|-|\\vec r_1|$ дава същото като $|\\vec r_2-\\vec r_1|$.",
  ],
  steps: [
    {
      text: "Преместването е разликата на радиус-векторите, по компоненти:",
      latex: String.raw`\Delta\vec r=\vec r_2-\vec r_1=(8-2)\,\hat i+(1-5)\,\hat j=6\,\hat i-4\,\hat j\ \ [\mathrm{m}]`,
    },
    {
      text: "Модулът се получава от компонентите по Питагоровата теорема:",
      latex: String.raw`|\Delta\vec r|=\sqrt{6^2+(-4)^2}=\sqrt{52}\approx7{,}2\,\mathrm{m}`,
    },
    {
      text: "Посоката спрямо оста $Ox$ (отрицателният ъгъл значи „под оста“, тоест надолу):",
      latex: String.raw`\tan\varphi=\frac{\Delta y}{\Delta x}=\frac{-4}{6}\ \Rightarrow\ \varphi\approx-33{,}7^\circ`,
    },
    {
      text: "Проверка на честата грешка: разликата на модулите не е модул на разликата.",
      latex: String.raw`|\vec r_2|-|\vec r_1|=\sqrt{65}-\sqrt{29}\approx2{,}7\,\mathrm{m}\ \ne\ 7{,}2\,\mathrm{m}`,
    },
  ],
  teacherNotes: [
    "Проверявайте реда на изваждането: $\\vec r_1-\\vec r_2$ дава същия модул и обратна посока, затова грешката минава незабелязано, ако се иска само дължина.",
    "Последната стъпка е ценна сама по себе си: $|\\vec a|-|\\vec b|\\ne|\\vec a-\\vec b|$ е грешка, която се влачи чак до динамиката.",
    "Ако ученикът се затруднява със знаците, дайте му да нанесе точките в тетрадка на квадратчета и да брои квадратчетата.",
  ],
};

export const planeMotionProblems: GuidedProblemData[] = [problem1, problem2, problem3];
