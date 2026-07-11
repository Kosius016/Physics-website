import { Arrow, AngleArc, C, CurrentSymbol } from "./svg";
import type { GuidedProblemData } from "./GuidedProblem";

/**
 * Петте водени задачи от преговорния урок по закона на Био-Савар.
 * Всяка фигура се достроява по фази: 0 геометрия → 1 dB вектори → 2 резултат
 * → 3 финална стойност (след всички стъпки на решението).
 */

/* ---------- Задача 1 · Кръгов контур ---------- */

const p1Center = { x: 240, y: 150 };
const P1_R = 95;

function p1Figure(phase: number) {
  const { x: cx, y: cy } = p1Center;
  const sample = [0, 120, 240].map((deg) => (deg * Math.PI) / 180);
  return (
    <g>
      <circle cx={cx} cy={cy} r={P1_R} fill="none" stroke={C.wire} strokeWidth={3.5} />
      {/* ток, обратно на часовниковата стрелка */}
      {[30, 150, 270].map((deg) => {
        const phi = (deg * Math.PI) / 180;
        const ax = cx + P1_R * Math.cos(phi);
        const ay = cy + P1_R * Math.sin(phi);
        const tx = Math.sin(phi);
        const ty = -Math.cos(phi);
        return <Arrow key={deg} x1={ax - tx * 12} y1={ay - ty * 12} x2={ax + tx * 12} y2={ay + ty * 12} color={C.warn} width={3} />;
      })}
      <text x={cx + P1_R + 12} y={cy - 60} fill={C.warn} fontSize={14} fontWeight={700}>I</text>
      <circle cx={cx} cy={cy} r={4} fill={C.wire} />
      <text x={cx + 10} y={cy + 18} fill={C.wire} fontSize={13.5} fontWeight={700}>P</text>
      <text x={cx + P1_R / 2 - 6} y={cy - P1_R / 2 - 8} fill={C.mut} fontSize={13}>R</text>
      <line x1={cx} y1={cy} x2={cx + P1_R * 0.707} y2={cy - P1_R * 0.707} stroke={C.faint} strokeWidth={1.3} strokeDasharray="4 4" />

      {phase >= 1 &&
        sample.map((phi, i) => {
          const ex = cx + P1_R * Math.cos(phi);
          const ey = cy + P1_R * Math.sin(phi);
          const tx = Math.sin(phi);
          const ty = -Math.cos(phi);
          return (
            <g key={i} className="animate-rise">
              <line x1={ex - tx * 11} y1={ey - ty * 11} x2={ex + tx * 11} y2={ey + ty * 11} stroke={C.plus} strokeWidth={5} strokeLinecap="round" />
              <text x={ex + Math.cos(phi) * 20 - 8} y={ey + Math.sin(phi) * 20 + 4} fill={C.plus} fontSize={12} fontWeight={700}>dℓ</text>
              <CurrentSymbol x={cx + 30 * Math.cos(phi)} y={cy + 30 * Math.sin(phi)} out r={8} color={C.minus} />
            </g>
          );
        })}
      {phase >= 1 && (
        <text x={16} y={284} fill={C.minus} fontSize={13} fontWeight={600} className="animate-rise">
          всеки елемент dℓ дава dB ⊙ навън — в една и съща посока
        </text>
      )}
      {phase >= 2 && <CurrentSymbol x={cx} y={cy} out r={17} color={C.ok} animate />}
      {phase >= 3 && (
        <text x={cx + 26} y={cy + 5} fill={C.ok} fontSize={15} fontWeight={700} className="animate-rise">
          B = μ₀I / 2R
        </text>
      )}
    </g>
  );
}

/* ---------- Задача 2 · Полуокръжност с прави краища ---------- */

const p2C = { x: 240, y: 190 };
const P2_R = 90;

function p2Figure(phase: number) {
  const { x: cx, y: cy } = p2C;
  return (
    <g>
      {/* прави части (по една права през центъра) */}
      <line x1={40} y1={cy} x2={cx - P2_R} y2={cy} stroke={C.wire} strokeWidth={3.5} />
      <line x1={cx + P2_R} y1={cy} x2={440} y2={cy} stroke={C.wire} strokeWidth={3.5} />
      {/* полуокръжност отгоре */}
      <path d={`M ${cx - P2_R} ${cy} A ${P2_R} ${P2_R} 0 0 1 ${cx + P2_R} ${cy}`} fill="none" stroke={C.wire} strokeWidth={3.5} />
      {/* ток отляво надясно */}
      <Arrow x1={78} y1={cy} x2={106} y2={cy} color={C.warn} width={3} />
      <Arrow x1={374} y1={cy} x2={402} y2={cy} color={C.warn} width={3} />
      {[-135, -45].map((deg) => {
        const phi = (deg * Math.PI) / 180;
        const ax = cx + P2_R * Math.cos(phi);
        const ay = cy + P2_R * Math.sin(phi);
        const tx = -Math.sin(phi);
        const ty = Math.cos(phi);
        return <Arrow key={deg} x1={ax - tx * 11} y1={ay - ty * 11} x2={ax + tx * 11} y2={ay + ty * 11} color={C.warn} width={3} />;
      })}
      <text x={60} y={cy - 12} fill={C.warn} fontSize={14} fontWeight={700}>I</text>
      <circle cx={cx} cy={cy} r={4} fill={C.wire} />
      <text x={cx - 6} y={cy + 22} fill={C.wire} fontSize={13.5} fontWeight={700}>P</text>
      <line x1={cx} y1={cy} x2={cx + P2_R * 0.707} y2={cy - P2_R * 0.707} stroke={C.faint} strokeWidth={1.3} strokeDasharray="4 4" />
      <text x={cx + 26} y={cy - 34} fill={C.mut} fontSize={13}>R</text>

      {phase >= 1 && (
        <g className="animate-rise">
          <text x={80} y={cy + 26} fill={C.mut} fontSize={12.5} fontWeight={600}>dℓ ∥ r → принос 0</text>
          <text x={330} y={cy + 26} fill={C.mut} fontSize={12.5} fontWeight={600}>dℓ ∥ r → принос 0</text>
          <line x1={cx} y1={cy - P2_R} x2={cx} y2={cy} stroke={C.minus} strokeWidth={1.5} strokeDasharray="4 4" />
          <line x1={cx - 12} y1={cy - P2_R} x2={cx + 12} y2={cy - P2_R} stroke={C.plus} strokeWidth={5} strokeLinecap="round" />
          <text x={cx + 18} y={cy - P2_R + 4} fill={C.plus} fontSize={12} fontWeight={700}>dℓ</text>
          <CurrentSymbol x={cx} y={cy - 32} out={false} r={8} color={C.minus} />
          <text x={cx + 14} y={cy - 28} fill={C.minus} fontSize={12} fontWeight={600}>dB ⊗</text>
        </g>
      )}
      {phase >= 2 && <CurrentSymbol x={cx} y={cy} out={false} r={16} color={C.ok} animate />}
      {phase >= 3 && (
        <text x={cx + 26} y={cy + 5} fill={C.ok} fontSize={15} fontWeight={700} className="animate-rise">
          B = μ₀I / 4R ⊗
        </text>
      )}
    </g>
  );
}

/* ---------- Задача 3 · Квадратен контур ---------- */

const p3C = { x: 240, y: 150 };
const P3_H = 95; // половин страна

function p3Figure(phase: number) {
  const { x: cx, y: cy } = p3C;
  const L = cx - P3_H;
  const R = cx + P3_H;
  const T = cy - P3_H;
  const B = cy + P3_H;
  return (
    <g>
      <rect x={L} y={T} width={2 * P3_H} height={2 * P3_H} fill="none" stroke={C.wire} strokeWidth={3.5} />
      {/* ток, обратно на часовниковата стрелка: ляво↓ дъно→ дясно↑ горе← */}
      <Arrow x1={L} y1={cy - 14} x2={L} y2={cy + 14} color={C.warn} width={3} />
      <Arrow x1={cx - 14} y1={B} x2={cx + 14} y2={B} color={C.warn} width={3} />
      <Arrow x1={R} y1={cy + 14} x2={R} y2={cy - 14} color={C.warn} width={3} />
      <Arrow x1={cx + 14} y1={T} x2={cx - 14} y2={T} color={C.warn} width={3} />
      <text x={L - 24} y={cy + 5} fill={C.warn} fontSize={14} fontWeight={700}>I</text>
      <text x={cx - 8} y={B + 24} fill={C.mut} fontSize={13}>a</text>
      <circle cx={cx} cy={cy} r={4} fill={C.wire} />
      <text x={cx - 22} y={cy + 5} fill={C.wire} fontSize={13.5} fontWeight={700}>P</text>
      {/* перпендикулярът към дясната страна */}
      <line x1={cx} y1={cy} x2={R} y2={cy} stroke={C.mut} strokeWidth={1.5} strokeDasharray="6 5" />
      <text x={cx + P3_H / 2 - 10} y={cy - 8} fill={C.mut} fontSize={12.5} fontWeight={600}>a/2</text>

      {phase >= 1 && (
        <g className="animate-rise">
          {/* r-вектори към краищата на дясната страна + ъглите 45° */}
          <line x1={cx} y1={cy} x2={R} y2={T} stroke={C.minus} strokeWidth={1.5} strokeDasharray="4 4" />
          <line x1={cx} y1={cy} x2={R} y2={B} stroke={C.minus} strokeWidth={1.5} strokeDasharray="4 4" />
          <AngleArc cx={cx} cy={cy} a1={0} a2={-Math.PI / 4} r={40} color={C.plus} label="45°" />
          <AngleArc cx={cx} cy={cy} a1={0} a2={Math.PI / 4} r={54} color={C.plus} label="45°" />
          {/* приносите на четирите страни */}
          {[[cx - 30, cy] as const, [cx + 30, cy] as const, [cx, cy - 30] as const, [cx, cy + 30] as const].map(([x, y], i) => (
            <CurrentSymbol key={i} x={x} y={y} out r={8} color={C.minus} />
          ))}
        </g>
      )}
      {phase >= 1 && (
        <text x={16} y={284} fill={C.minus} fontSize={13} fontWeight={600} className="animate-rise">
          и четирите страни дават dB ⊙ навън — събират се
        </text>
      )}
      {phase >= 2 && <CurrentSymbol x={cx} y={cy} out r={16} color={C.ok} animate />}
      {phase >= 3 && (
        <text x={cx + 26} y={cy + 34} fill={C.ok} fontSize={15} fontWeight={700} className="animate-rise">
          B = 2√2·μ₀I / πa
        </text>
      )}
    </g>
  );
}

/* ---------- Задача 4 · Две успоредни жици ---------- */

const P4_W1 = { x: 150, y: 140 };
const P4_W2 = { x: 330, y: 140 };
const P4_P = { x: 240, y: 140 };

function p4Figure(phase: number) {
  return (
    <g>
      <CurrentSymbol x={P4_W1.x} y={P4_W1.y} out r={15} color={C.warn} label="I ⊙" />
      <CurrentSymbol x={P4_W2.x} y={P4_W2.y} out r={15} color={C.warn} label="I ⊙" />
      <line x1={P4_W1.x + 18} y1={P4_W1.y} x2={P4_P.x - 8} y2={P4_P.y} stroke={C.faint} strokeWidth={1.3} strokeDasharray="4 4" />
      <line x1={P4_P.x + 8} y1={P4_P.y} x2={P4_W2.x - 18} y2={P4_W2.y} stroke={C.faint} strokeWidth={1.3} strokeDasharray="4 4" />
      <text x={(P4_W1.x + P4_P.x) / 2 - 12} y={P4_P.y - 10} fill={C.mut} fontSize={12.5}>d/2</text>
      <text x={(P4_P.x + P4_W2.x) / 2 - 12} y={P4_P.y - 10} fill={C.mut} fontSize={12.5}>d/2</text>
      <circle cx={P4_P.x} cy={P4_P.y} r={5} fill={C.wire} />
      <text x={P4_P.x - 6} y={P4_P.y + 24} fill={C.wire} fontSize={13.5} fontWeight={700}>P</text>

      {phase >= 1 && (
        <g>
          <Arrow x1={P4_P.x} y1={P4_P.y} x2={P4_P.x} y2={P4_P.y - 72} color={C.minus} label="B₁" labelDx={-30} labelDy={4} animate />
          <Arrow x1={P4_P.x} y1={P4_P.y} x2={P4_P.x} y2={P4_P.y + 72} color={C.plus} label="B₂" labelDx={10} labelDy={4} animate />
        </g>
      )}
      {phase >= 2 && (
        <text x={P4_P.x + 20} y={P4_P.y - 40} fill={C.ok} fontSize={17} fontWeight={700} className="animate-rise">
          B = 0
        </text>
      )}
      {phase >= 3 && (
        <text x={16} y={244} fill={C.ok} fontSize={13.5} fontWeight={600} className="animate-rise">
          при противоположни токове: векторите стават еднопосочни → B = 2μ₀I/πd
        </text>
      )}
    </g>
  );
}

/* ---------- Задача 5 · Проводник под прав ъгъл ---------- */

const P5_O = { x: 190, y: 210 };
const P5_P = { x: 370, y: 210 };

function p5Figure(phase: number) {
  const O = P5_O;
  const P = P5_P;
  return (
    <g>
      {/* хоризонтално рамо (от ∞ отляво) и вертикално рамо (към ∞ нагоре) */}
      <line x1={26} y1={O.y} x2={O.x} y2={O.y} stroke={C.wire} strokeWidth={3.5} />
      <line x1={O.x} y1={O.y} x2={O.x} y2={36} stroke={C.wire} strokeWidth={3.5} />
      <text x={30} y={O.y - 10} fill={C.mut} fontSize={12}>от ∞</text>
      <text x={O.x + 10} y={46} fill={C.mut} fontSize={12}>към ∞</text>
      <Arrow x1={86} y1={O.y} x2={116} y2={O.y} color={C.warn} width={3} />
      <Arrow x1={O.x} y1={140} x2={O.x} y2={110} color={C.warn} width={3} />
      <text x={96} y={O.y + 22} fill={C.warn} fontSize={14} fontWeight={700}>I</text>
      <circle cx={O.x} cy={O.y} r={4} fill={C.wire} />
      <text x={O.x - 8} y={O.y + 24} fill={C.wire} fontSize={13.5} fontWeight={700}>O</text>
      {/* P на продължението на хоризонталното рамо */}
      <line x1={O.x} y1={O.y} x2={P.x} y2={P.y} stroke={C.faint} strokeWidth={1.3} strokeDasharray="4 4" />
      <text x={(O.x + P.x) / 2 - 6} y={O.y - 10} fill={C.mut} fontSize={12.5}>d</text>
      <circle cx={P.x} cy={P.y} r={5} fill={C.wire} />
      <text x={P.x + 12} y={P.y + 5} fill={C.wire} fontSize={13.5} fontWeight={700}>P</text>

      {phase >= 1 && (
        <g className="animate-rise">
          <text x={40} y={O.y + 44} fill={C.mut} fontSize={12.5} fontWeight={600}>
            хоризонталното рамо: dℓ ∥ r → принос 0
          </text>
          <line x1={P.x} y1={P.y} x2={O.x} y2={O.y} stroke={C.minus} strokeWidth={1.5} strokeDasharray="4 4" />
          <line x1={P.x} y1={P.y} x2={O.x} y2={100} stroke={C.minus} strokeWidth={1.5} strokeDasharray="4 4" />
          <text x={(P.x + O.x) / 2 - 30} y={150} fill={C.minus} fontSize={12} fontWeight={600}>r</text>
          <CurrentSymbol x={P.x} y={P.y - 34} out={false} r={8} color={C.minus} />
          <text x={P.x + 14} y={P.y - 30} fill={C.minus} fontSize={12} fontWeight={600}>dB ⊗</text>
        </g>
      )}
      {phase >= 2 && <CurrentSymbol x={P.x} y={P.y} out={false} r={15} color={C.ok} animate />}
      {phase >= 3 && (
        <text x={P.x - 90} y={P.y + 40} fill={C.ok} fontSize={15} fontWeight={700} className="animate-rise">
          B = μ₀I / 4πd ⊗
        </text>
      )}
    </g>
  );
}

/* ---------- Данните на задачите ---------- */

export const bioSavartProblems: GuidedProblemData[] = [
  {
    title: "Кръгов контур",
    statement:
      "Кръгов контур с радиус $R$ носи ток $I$ обратно на часовниковата стрелка. Намерете магнитното поле в центъра P на контура.",
    figure: p1Figure,
    directionQuestion: {
      prompt: "Каква ще бъде посоката на всяко dB в центъра?",
      options: [
        { text: "Всички dB сочат ⊙ навън от екрана", correct: true },
        { text: "Всички dB сочат ⊗ навътре в екрана", correct: false },
        { text: "Различни елементи дават различни посоки", correct: false },
      ],
      explanation:
        "Приложете дясната ръка към няколко елемента: палецът по тока (обратно на часовниковата стрелка), и за **всеки** елемент dℓ векторът $d\\vec{l}\\times\\hat{r}$ сочи навън от екрана. Симетрията тук работи в наша полза — всички приноси са еднопосочни.",
    },
    additionQuestion: {
      prompt: "Тези магнитни полета ще се събират или ще се компенсират?",
      options: [
        { text: "Събират се — всички dB са в една и съща посока", correct: true },
        { text: "Срещуположните елементи се компенсират по двойки", correct: false },
        { text: "Частично се компенсират", correct: false },
      ],
      explanation:
        "Срещуположните елементи имат противоположни dℓ, но са и от противоположната страна на P — двете обръщания се неутрализират и dB им е в **същата** посока. Затова интегралът се превръща в обикновена сума от модули.",
    },
    hints: [
      "Разстоянието от всеки елемент до центъра е едно и също: $r = R$.",
      "Какъв е ъгълът между $d\\vec{l}$ (допирателна) и $\\hat{r}$ (радиус)? Колко е $\\sin 90°$?",
    ],
    steps: [
      {
        text: "За всеки елемент $d\\vec{l}$ радиусът е перпендикулярен на допирателната, затова $\\sin\\theta = 1$ и законът на Био-Савар дава:",
        latex: String.raw`dB = \frac{\mu_0}{4\pi}\,\frac{I\,dl\,\sin 90^\circ}{R^2} = \frac{\mu_0 I}{4\pi R^2}\,dl`,
      },
      {
        text: "Всички dB са еднопосочни (⊙), затова просто събираме дължините на елементите — а те дават цялата обиколка $2\\pi R$:",
        latex: String.raw`B = \frac{\mu_0 I}{4\pi R^2}\oint dl = \frac{\mu_0 I}{4\pi R^2}\cdot 2\pi R`,
      },
      {
        text: "Съкращаваме и получаваме класическия резултат (посока ⊙ навън, по дясната ръка):",
        latex: String.raw`B = \frac{\mu_0 I}{2R}`,
      },
    ],
    teacherNotes: [
      "Най-честата грешка: ученикът се опитва да интегрира векторно („ама те сочат в различни посоки по контура“) — върнете го към първия въпрос: dB е перпендикулярно на **равнината** на контура, не лежи в нея.",
      "Диагностичен въпрос: „при ток по часовниковата стрелка какво се променя?“ (B се обръща на ⊗).",
      "Мнозина забравят $\\sin\\theta = 1$ и носят $\\sin$ в интеграла — попитайте „кой ъгъл точно стои във формулата?“",
    ],
  },
  {
    title: "Полуокръжност",
    statement:
      "Проводник се състои от две прави полубезкрайни части, лежащи на една права, свързани с полуокръжност с радиус $R$ около точка P. Токът е $I$. Намерете магнитното поле в P.",
    figure: p2Figure,
    directionQuestion: {
      prompt: "Каква ще бъде посоката на всяко dB в точка P?",
      options: [
        { text: "Правите части не дават принос; дъгата дава dB ⊗ навътре", correct: true },
        { text: "Всички части дават dB ⊗ навътре", correct: false },
        { text: "Правите дават ⊙, дъгата — ⊗", correct: false },
      ],
      explanation:
        "За правите части $d\\vec{l}$ е **успореден** на $\\hat{r}$ (лежат на една права през P), а $d\\vec{l}\\times\\hat{r} = 0$ при успоредни вектори — нулев принос, без никакво смятане! За дъгата дясната ръка дава ⊗ (токът минава по горницата отляво надясно — по часовниковата стрелка спрямо P).",
    },
    additionQuestion: {
      prompt: "Приносите на елементите от дъгата ще се събират или ще се компенсират?",
      options: [
        { text: "Събират се — всички dB от дъгата са ⊗", correct: true },
        { text: "Лявата половина компенсира дясната", correct: false },
        { text: "Дъгата се компенсира с правите части", correct: false },
      ],
      explanation:
        "Точно като при пълния кръг, всеки елемент от дъгата дава dB в **същата** посока (⊗). Правите части дават нула, така че няма какво да компенсират.",
    },
    hints: [
      "Разгледайте внимателно $d\\vec{l}\\times\\hat{r}$ за елемент от правата част. Какъв е ъгълът между двата вектора?",
      "Полуокръжността е точно половината от контура в Задача 1.",
    ],
    steps: [
      {
        text: "Правите части: $d\\vec{l} \\parallel \\hat{r}$, следователно за всеки техен елемент:",
        latex: String.raw`|d\vec{l}\times\hat{r}| = dl\,\sin 0^\circ = 0`,
      },
      {
        text: "Остава само дъгата — половин обиколка $\\pi R$ на разстояние $R$, всички приноси еднопосочни:",
        latex: String.raw`B = \frac{\mu_0 I}{4\pi R^2}\cdot \pi R`,
      },
      {
        text: "Полето е точно **половината** от това на пълния кръг, с посока ⊗:",
        latex: String.raw`B = \frac{\mu_0 I}{4R}`,
      },
    ],
    teacherNotes: [
      "Класическа грешка: ученикът прилага формулата за краен прав проводник към правите части и получава ненулев принос. Причината за нулата е $a = 0$ — точката лежи НА правата на проводника, $\\sin\\theta$ гледа тъкмо този случай.",
      "Втора грешка: посоката. Токът по горната дъга отляво надясно е по часовниковата стрелка около P → ⊗. Нека ученикът го провери с ръката си, не наум.",
      "Добър последващ въпрос: „а ако дъгата беше 3/4 окръжност?“ (отговор: $3\\mu_0 I/8R$).",
    ],
  },
  {
    title: "Квадратен контур",
    statement:
      "Квадратен контур със страна $a$ носи ток $I$ обратно на часовниковата стрелка. Намерете магнитното поле в центъра P на квадрата.",
    figure: p3Figure,
    directionQuestion: {
      prompt: "Каква ще бъде посоката на dB от всяка от четирите страни?",
      options: [
        { text: "Всяка страна дава dB ⊙ навън от екрана", correct: true },
        { text: "Срещуположните страни дават противоположни dB", correct: false },
        { text: "Хоризонталните дават ⊙, вертикалните — ⊗", correct: false },
      ],
      explanation:
        "Пак дясната ръка, страна по страна: токът обикаля обратно на часовниковата стрелка, затова **всяка** страна „върти“ полето в центъра навън от екрана (⊙). Същата логика като при кръга — контурът е просто „ъгловат кръг“.",
    },
    additionQuestion: {
      prompt: "Полетата на четирите страни ще се събират или ще се компенсират?",
      options: [
        { text: "Събират се — 4 еднакви еднопосочни приноса", correct: true },
        { text: "Лява/дясна и горна/долна двойки се компенсират", correct: false },
        { text: "Частично се компенсират", correct: false },
      ],
      explanation:
        "Четирите страни са симетрични спрямо центъра и всичките дават ⊙ → общото поле е точно $4\\times$ приноса на една страна. Интуицията „срещуположните се борят“ важи за успоредни прави с еднакви токове, но тук токът **обикаля** — обратната страна носи ток в обратна посока и приносът ѝ пак е ⊙.",
    },
    hints: [
      "Една страна е краен проводник. На какво разстояние от центъра е тя и какви са двата ъгъла към краищата ѝ?",
      "Вижте фигурата: $a/2$ и два ъгъла по $45°$. Използвайте $B = \\dfrac{\\mu_0 I}{4\\pi a_\\perp}(\\sin\\theta_1+\\sin\\theta_2)$ от §4.",
    ],
    steps: [
      {
        text: "Една страна: краен проводник на перпендикулярно разстояние $a/2$ от P, с ъгли $\\theta_1 = \\theta_2 = 45°$ към краищата (виж дъгите на фигурата):",
        latex: String.raw`B_{\text{страна}} = \frac{\mu_0 I}{4\pi\,(a/2)}\left(\sin 45^\circ + \sin 45^\circ\right) = \frac{\mu_0 I}{2\pi a}\cdot\sqrt{2}`,
      },
      {
        text: "Четирите страни дават равни, еднопосочни приноси (Q2!), затова умножаваме по 4:",
        latex: String.raw`B = 4\cdot\frac{\sqrt{2}\,\mu_0 I}{2\pi a}`,
      },
      {
        text: "Опростяваме — поле в центъра на квадратен контур (посока ⊙):",
        latex: String.raw`B = \frac{2\sqrt{2}\,\mu_0 I}{\pi a}`,
      },
    ],
    teacherNotes: [
      "Двете места, където се греши почти винаги: разстоянието е $a/2$ (не $a$) и ъглите са $45°$ (не $90°$). Фигурата ги показва точно за да се посочат с пръст.",
      "Ако ученикът напише $\\sin\\theta_1 + \\sin\\theta_2 = \\sin 90°$ — върнете го към §4: ъглите се мерят от перпендикуляра към **всеки край поотделно**.",
      "Хубава проверка за края: кръг с „диаметър“ $a$ дава $\\mu_0 I/a$ — квадратът дава малко по-малко ($\\approx 0.9\\,\\mu_0 I/a$). Звучи ли правдоподобно, че е същият мащаб?",
    ],
  },
  {
    title: "Две успоредни жици",
    statement:
      "Два дълги успоредни проводника на разстояние $d$ носят еднакви по големина токове $I$, и двата насочени навън от екрана (⊙). Намерете магнитното поле в точка P по средата между тях. А ако токовете бяха противоположни?",
    figure: p4Figure,
    figureHeight: 260,
    directionQuestion: {
      prompt: "Каква ще бъде посоката на B₁ и B₂ (полетата на двата проводника) в P?",
      options: [
        { text: "B₁ сочи нагоре, B₂ — надолу (противоположни)", correct: true },
        { text: "И двете сочат нагоре (еднопосочни)", correct: false },
        { text: "И двете сочат към проводниците", correct: false },
      ],
      explanation:
        "Ток ⊙ (към наблюдателя) върти полето обратно на часовниковата стрелка. Спрямо **левия** проводник P е отдясно → B₁ е нагоре. Спрямо **десния** проводник P е отляво → B₂ е надолу. Еднакви токове, но P ги „вижда“ от противоположни страни!",
    },
    additionQuestion: {
      prompt: "Тези магнитни полета ще се събират или ще се компенсират?",
      options: [
        { text: "Напълно се компенсират — B = 0", correct: true },
        { text: "Събират се — B = 2B₁", correct: false },
        { text: "Частично се компенсират", correct: false },
      ],
      explanation:
        "P е на равни разстояния $d/2$, затова $|B_1| = |B_2|$, а посоките са противоположни → **точно нула**. Всичко се реши от геометрията, преди да напишем и една формула.",
    },
    hints: [
      "Използвайте интерактива от §2: къде е P спрямо всеки от проводниците поотделно?",
      "Симетрична ли е задачата спрямо средата? Какво следва за големините?",
    ],
    steps: [
      {
        text: "Големина на полето на всеки проводник в P (безкраен проводник, §5, на разстояние $d/2$):",
        latex: String.raw`B_1 = B_2 = \frac{\mu_0 I}{2\pi\,(d/2)} = \frac{\mu_0 I}{\pi d}`,
      },
      {
        text: "Посоките са противоположни (Q1), големините равни → векторната сума е нула:",
        latex: String.raw`\vec{B} = \vec{B}_1 + \vec{B}_2 = \vec{0}`,
      },
      {
        text: "Ако токовете са **противоположни** (единият ⊙, другият ⊗): B₂ се обръща, двата вектора стават еднопосочни и вместо да се унищожат, се удвояват:",
        latex: String.raw`B = 2\cdot\frac{\mu_0 I}{\pi d} = \frac{2\mu_0 I}{\pi d}`,
      },
    ],
    teacherNotes: [
      "Точно тук се къса нишката при повечето ученици: механично събират модулите $B_1 + B_2$, без да питат за посоките. Двата въпроса преди решението са в този ред нарочно.",
      "Контраинтуитивното: еднакви токове → нула по средата; противоположни токове → максимум. Мнозина очакват обратното („еднаквите се подсилват“). Върнете към първия въпрос: посоката зависи от това **от коя страна на проводника** се намира точката.",
      "Идея за разширение: а извън двата проводника? (Полетата вече не са антипаралелни навсякъде — добра тема за самостоятелна работа с интерактива от §3.)",
    ],
  },
  {
    title: "Проводник под прав ъгъл",
    statement:
      "Проводник е огънат под прав ъгъл в точка O: токът $I$ идва по хоризонталното рамо и завива нагоре по вертикалното. Намерете магнитното поле в точка P, която лежи на продължението на хоризонталното рамо, на разстояние $d$ от O.",
    figure: p5Figure,
    directionQuestion: {
      prompt: "Каква ще бъде посоката на dB от всяко от двете рамена в P?",
      options: [
        { text: "Хоризонталното рамо: 0; вертикалното: dB ⊗ навътре", correct: true },
        { text: "И двете рамена дават dB ⊗", correct: false },
        { text: "Хоризонталното дава ⊙, вертикалното ⊗", correct: false },
      ],
      explanation:
        "P лежи на **правата на хоризонталното рамо** → за всеки негов елемент $d\\vec{l} \\parallel \\hat{r}$ и приносът е нула (както правите части в Задача 2). За вертикалното рамо: ток нагоре, P е отдясно → дясната ръка дава ⊗.",
    },
    additionQuestion: {
      prompt: "Ще има ли събиране или компенсиране на полета тук?",
      options: [
        { text: "Няма какво да се компенсира — принос дава само вертикалното рамо", correct: true },
        { text: "Двете рамена се компенсират напълно", correct: false },
        { text: "Двете рамена се събират", correct: false },
      ],
      explanation:
        "Едното „поле“ е тъждествено нула, така че въпросът събиране/компенсиране се решава тривиално: остава само приносът на вертикалното рамо. Затова винаги първо питаме за посоките — половината задача изчезна.",
    },
    hints: [
      "Сравнете хоризонталното рамо с правите части от Задача 2.",
      "Вертикалното рамо е **полубезкраен** проводник: какви са двата му ъгъла спрямо перпендикуляра от P? (Внимание: перпендикулярното разстояние тук е $d$.)",
    ],
    steps: [
      {
        text: "Хоризонталното рамо: P е на неговата права, $d\\vec{l}\\times\\hat{r} = 0$ навсякъде → принос нула.",
        latex: String.raw`B_{\text{хориз.}} = 0`,
      },
      {
        text: "Вертикалното рамо: краен проводник от O до $\\infty$, перпендикулярно разстояние $a = d$. Близкият край (O) е точно в петата на перпендикуляра → $\\theta_2 = 0°$; далечният край бяга към безкрайност → $\\theta_1 \\to 90°$:",
        latex: String.raw`B = \frac{\mu_0 I}{4\pi d}\left(\sin 90^\circ + \sin 0^\circ\right) = \frac{\mu_0 I}{4\pi d}\,(1 + 0)`,
      },
      {
        text: "Резултат — точно **половината** от полето на безкраен проводник, с посока ⊗ (дясната ръка за ток нагоре, P отдясно):",
        latex: String.raw`B = \frac{\mu_0 I}{4\pi d}`,
      },
    ],
    teacherNotes: [
      "Полубезкрайният проводник е идеалният тест дали формулата от §4 е разбрана или наизустена: единият ъгъл е $90°$, другият $0°$ — и това се ВИЖДА от фигурата, не се помни.",
      "Честа грешка: мерят $d$ от края на вертикалното рамо по диагонал, вместо перпендикулярното разстояние от P до правата на рамото.",
      "Свържете с §5: $\\mu_0 I/4\\pi d$ е точно половината от $\\mu_0 I/2\\pi d$. Защо „половин проводник → половин поле“ работи тук? (Защото приносите са еднопосочни и адитивни.)",
    ],
  },
];
