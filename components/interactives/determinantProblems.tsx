import { Arrow, C, STAGE_BG } from "./svg";
import { SvgMatrixScene, type Mat2 } from "./matrixCanvas";
import type { GuidedProblemData } from "./GuidedProblem";
import SvgTex from "./SvgTex";

/**
 * Водени задачи за урока „Детерминанти — площта на трансформацията“.
 */

const I: Mat2 = [1, 0, 0, 1];

/* Фигурни помощници */
const pts = (list: [number, number][]) => list.map(([x, y]) => `${x},${y}`).join(" ");

export const determinantProblems: GuidedProblemData[] = [
  {
    title: "Памет за текстура",
    statement:
      String.raw`В една игра спрайт се трансформира с матрицата $M=\begin{pmatrix}3&1\\1&2\end{pmatrix}$. Художникът пита: колко пъти повече пиксели ще покрива образът, за да задели памет за текстурата?`,
    figure: (phase) => {
      const M: Mat2 = phase >= 2 ? [3, 1, 1, 2] : I; // истинската матрица, по-дребен мащаб
      return (
        <g>
          <SvgMatrixScene m={M} checker square ox={130} oy={230} s={34} />
          {phase >= 2 && (
            <SvgTex x={460} y={54} tex="A'=|\det M|A" color={C.warn} fontSize={14} width={132} anchor="end" className="animate-rise" />
          )}
          {phase >= 3 && (
            <SvgTex x={460} y={82} tex="A'=5A" color={C.ok} fontSize={15} width={72} anchor="end" className="animate-rise" />
          )}
        </g>
      );
    },
    figureCaption: (phase) =>
      phase >= 3
        ? "Площта и необходимата текстурна памет нарастват $5$ пъти."
        : phase >= 2
          ? String.raw`Всяка клетка умножава площта си по $|\det M|$.`
          : phase >= 1
            ? "Шахматната мрежа проследява как се преобразува единичният квадрат."
            : undefined,
    directionQuestion: {
      prompt: "Какво прави $M$ с равнината, съдейки по колоните ѝ $(3,1)$ и $(1,2)$?",
      options: [
        { text: "Разтяга я: базисните вектори стават по-дълги и се раздалечават от осите", correct: true },
        { text: "Само я върти: дължините се запазват", correct: false },
        { text: "Свива я: образът е по-малък от оригинала", correct: false },
      ],
      explanation:
        String.raw`Колоните са образите на $\hat{\imath}$ и $\hat{\jmath}$. Векторът $(3,1)$ е дълъг над $3$ единици, а $(1,2)$ над $2$. Единичният квадрат става голям успоредник, следователно площите растат. Ротация би запазила дължините $1$.`,
    },
    additionQuestion: {
      prompt: "Какъв е знакът на $\\det M$ и какво означава той?",
      options: [
        { text: "Положителен: ориентацията е запазена", correct: true },
        { text: "Отрицателен: образът е огледално обърнат", correct: false },
        { text: "Нула: равнината се смачква", correct: false },
      ],
      explanation:
        String.raw`$\hat{\imath}'=(3,1)$ и $\hat{\jmath}'=(1,2)$ стоят един спрямо друг както $\hat{\imath}$ и $\hat{\jmath}$. Редът на цветовете в шахматната мрежа се запазва, затова $\det M>0$.`,
    },
    hints: [
      "За матрица $2\\times2$: $\\det M=ad-bc$.",
      "$|\\det M|$ е коефициентът на площ, не на дължина.",
    ],
    steps: [
      {
        text: "Смятаме детерминантата:",
        latex: String.raw`\det M = \begin{vmatrix} 3 & 1 \\ 1 & 2 \end{vmatrix} = 3\cdot 2 - 1\cdot 1 = 5`,
      },
      {
        text: "Единичният квадрат с площ $1$ става успоредник върху $(3,1)$ и $(1,2)$ с площ $|\\det M|=5$. Всяка фигура, включително спрайтът, умножава площта си по $5$.",
      },
      {
        text: "Отговор за художника: **$5$ пъти повече пиксели**, значи приблизително $5$ пъти повече памет. Затова графичните енджини държат $\\det M$ на всяка трансформация под ръка.",
      },
    ],
    teacherNotes: [
      "Най-честата грешка е „$5$ пъти по-голямо“ да се тълкува като $5$ пъти по-дълго. Дължините се менят различно по посоки, а площта се мени еднакво навсякъде с $|\\det M|$.",
      "Диагностика: „колко расте площта при матрица $2I$?“ Отговорът е $4$, не $2$: квадратът на мащаба.",
      "Свържете със симулацията: срязването има $\\det M=1$. То разтяга дължини, но пази площ.",
    ],
  },
  {
    title: "Якобианът на полярната мрежа",
    statement:
      "Симулация на въздушния поток около профил използва полярна мрежа: $x=r\\cos\\theta$, $y=r\\sin\\theta$. Клетките далеч от центъра изглеждат по-големи. Намерете якобиановата матрица и покажете защо площният елемент е $dA=r\\,dr\\,d\\theta$.",
    figure: (phase) => {
      const cx = 90;
      const cy = 250;
      const rays = [0, 0.35, 0.7, 1.05];
      const radii = [60, 105, 150, 195, 240];
      return (
        <g>
          {/* полярна мрежа */}
          {radii.map((r) => (
            <path
              key={r}
              d={`M ${cx + r} ${cy} A ${r} ${r} 0 0 0 ${cx + r * Math.cos(1.05)} ${cy - r * Math.sin(1.05)}`}
              fill="none"
              stroke="rgba(95,168,245,0.4)"
              strokeWidth={1.3}
            />
          ))}
          {rays.map((a) => (
            <line
              key={a}
              x1={cx + 55 * Math.cos(a)}
              y1={cy - 55 * Math.sin(a)}
              x2={cx + 245 * Math.cos(a)}
              y2={cy - 245 * Math.sin(a)}
              stroke="rgba(95,168,245,0.4)"
              strokeWidth={1.3}
            />
          ))}
          {/* близка и далечна клетка */}
          {phase >= 1 && (
            <g className="animate-rise">
              <path
                d={`M ${cx + 60 * Math.cos(0.7)} ${cy - 60 * Math.sin(0.7)} A 60 60 0 0 0 ${cx + 60 * Math.cos(1.05)} ${cy - 60 * Math.sin(1.05)} L ${cx + 105 * Math.cos(1.05)} ${cy - 105 * Math.sin(1.05)} A 105 105 0 0 1 ${cx + 105 * Math.cos(0.7)} ${cy - 105 * Math.sin(0.7)} Z`}
                fill="rgba(232,86,63,0.5)"
              />
              <path
                d={`M ${cx + 195 * Math.cos(0.35)} ${cy - 195 * Math.sin(0.35)} A 195 195 0 0 0 ${cx + 195 * Math.cos(0.7)} ${cy - 195 * Math.sin(0.7)} L ${cx + 240 * Math.cos(0.7)} ${cy - 240 * Math.sin(0.7)} A 240 240 0 0 1 ${cx + 240 * Math.cos(0.35)} ${cy - 240 * Math.sin(0.35)} Z`}
                fill="rgba(255,211,77,0.5)"
              />
            </g>
          )}
          {phase >= 2 && (
            <SvgTex x={460} y={56} tex="dA\propto r" color={C.warn} fontSize={14} width={82} anchor="end" className="animate-rise" />
          )}
          {phase >= 3 && (
            <SvgTex x={460} y={84} tex="dA=r\,dr\,d\theta" color={C.ok} fontSize={15} width={126} anchor="end" className="animate-rise" />
          )}
        </g>
      );
    },
    figureCaption: (phase) =>
      phase >= 3
        ? String.raw`Локалният коефициент за площ е $\det J=r$, следователно $dA=r\,dr\,d\theta$.`
        : phase >= 2
          ? String.raw`При еднакви $dr$ и $d\theta$ по-далечната клетка има по-голяма площ.`
        : phase >= 1
            ? String.raw`Оцветените клетки имат еднакви стъпки $dr$ и $d\theta$, но различни радиуси.`
            : undefined,
    directionQuestion: {
      prompt: "Клетките на полярната мрежа с еднакви стъпки $\\Delta r$ и $\\Delta\\theta$ имат ли еднаква площ?",
      options: [
        { text: "Не, колкото по-далеч от центъра, толкова по-големи", correct: true },
        { text: "Да, стъпките са еднакви, значи и площите", correct: false },
        { text: "Зависи от ъгъла $\\theta$", correct: false },
      ],
      explanation:
        "Дъгата с ъгъл $\\Delta\\theta$ на радиус $r$ има дължина $r\\Delta\\theta$, която расте с $r$. Клетката е приблизително правоъгълник със страни $\\Delta r$ и $r\\Delta\\theta$, затова далечните клетки са по-големи.",
    },
    additionQuestion: {
      prompt: "Какво измерва детерминантата на якобиановата матрица на прехода $(r,\\theta)\\mapsto(x,y)$?",
      options: [
        { text: "Локалния коефициент на разтягане на площ в дадената точка", correct: true },
        { text: "Ъгъла, на който мрежата е завъртяна", correct: false },
        { text: "Дължината на радиус-вектора на клетката", correct: false },
      ],
      explanation:
        "Преходът е крива карта, но **локално** за малка клетка е линеен, с матрица от частните производни. За линейна карта $|\\det J|$ е коефициентът на площ. Якобианът е „детерминанта на място“.",
    },
    hints: [
      "Запишете матрицата от частните производни на $x=r\\cos\\theta$, $y=r\\sin\\theta$ по $r$ и $\\theta$.",
      "$\\cos^2\\theta+\\sin^2\\theta=1$ ще опрости детерминантата.",
    ],
    steps: [
      {
        text: "Якобиановата матрица има колона по $r$ и колона по $\\theta$:",
        latex: String.raw`J = \begin{pmatrix} \dfrac{\partial x}{\partial r} & \dfrac{\partial x}{\partial \theta} \\[6pt] \dfrac{\partial y}{\partial r} & \dfrac{\partial y}{\partial \theta} \end{pmatrix} = \begin{pmatrix} \cos\theta & -r\sin\theta \\ \sin\theta & r\cos\theta \end{pmatrix}`,
      },
      {
        text: "Детерминантата:",
        latex: String.raw`\det J = r\cos^2\theta + r\sin^2\theta = r`,
      },
      {
        text: "Малката клетка $dr\\,d\\theta$ се разтяга по площ точно $r$ пъти: $dA=r\\,dr\\,d\\theta$. Затова далечните клетки на фигурата са по-големи и всяка CFD симулация или смяна на променливи носи якобиан.",
      },
    ],
    teacherNotes: [
      "Ключовият мост е $\\det M=$ площ за линейни карти; якобианът пренася идеята локално върху криви карти.",
      "Честа грешка е разместване на колоните по $r$ и по $\\theta$. Детерминантата сменя знак, но площта е $|\\det J|$.",
      "Практически въпрос: „какво значи клетка с $\\det J\\approx0$ в мрежа за симулация?“ Това е изродена клетка и солверът става нестабилен.",
    ],
  },
  {
    title: "Двата сензора и нулевата детерминанта",
    statement:
      "Два сензора мерят смеси от величините $x$ и $y$: първият дава $2x+3y=8$, вторият $4x+6y=16$. Могат ли показанията да определят $x$ и $y$? Ако не, какво трябва да се смени? Заменете втория сензор с $4x+5y=14$.",
    figure: (phase) => {
      // прави: 2x+3y=8 и 4x+6y=16 съвпадат; после 4x+5y=14 пресича
      const T = (x: number, y: number): [number, number] => [70 + x * 55, 260 - y * 55];
      return (
        <g>
          {/* оси */}
          <line x1={T(0, -0.3)[0]} y1={T(0, -0.3)[1]} x2={T(0, 4.3)[0]} y2={T(0, 4.3)[1]} stroke="rgba(255,255,255,0.35)" strokeWidth={1.5} />
          <line x1={T(-0.3, 0)[0]} y1={T(-0.3, 0)[1]} x2={T(6.3, 0)[0]} y2={T(6.3, 0)[1]} stroke="rgba(255,255,255,0.35)" strokeWidth={1.5} />
          {/* права 1: 2x+3y=8 → y=(8-2x)/3, x∈[-0.2, 6.2] */}
          <line x1={T(-0.2, 2.8)[0]} y1={T(-0.2, 2.8)[1]} x2={T(6.2, -1.47)[0]} y2={T(6.2, -1.47)[1]} stroke={C.minus} strokeWidth={2.5} />
          <SvgTex x={T(4.6, 0.1)[0]} y={T(4.6, 0.1)[1] - 12} tex="2x+3y=8" color={C.minus} fontSize={12.5} width={92} />
          {phase >= 1 && phase < 2 && (
            <line x1={T(-0.2, 2.8)[0]} y1={T(-0.2, 2.8)[1]} x2={T(6.2, -1.47)[0]} y2={T(6.2, -1.47)[1]} stroke={C.plus} strokeWidth={1.5} strokeDasharray="8 6" className="animate-rise" />
          )}
          {phase >= 2 && (
            <g className="animate-rise">
              {/* права 2': 4x+5y=14 → y=(14-4x)/5 */}
              <line x1={T(-0.2, 2.96)[0]} y1={T(-0.2, 2.96)[1]} x2={T(4.5, -0.8)[0]} y2={T(4.5, -0.8)[1]} stroke={C.warn} strokeWidth={2.5} />
              <SvgTex x={T(3.4, 0.6)[0]} y={T(3.4, 0.6)[1] - 10} tex="4x+5y=14" color={C.warn} fontSize={12.5} width={102} />
              <circle cx={T(1, 2)[0]} cy={T(1, 2)[1]} r={6} fill={C.ok} stroke={STAGE_BG} strokeWidth={2} />
              <SvgTex x={T(1, 2)[0] + 12} y={T(1, 2)[1] - 8} tex="(1,2)" color={C.ok} fontSize={13} width={54} />
            </g>
          )}
        </g>
      );
    },
    figureCaption: (phase) =>
      phase >= 2
        ? "Подмененият втори сензор дава независима права и еднозначно пресичане в $(1,2)$."
        : phase >= 1
          ? "Уравнението $4x+6y=16$ лежи върху същата права като $2x+3y=8$: няма нова информация."
          : undefined,
    directionQuestion: {
      prompt: "Може ли двойката $2x+3y=8$ и $4x+6y=16$ да определи $x$ и $y$ еднозначно?",
      options: [
        { text: "Не, второто уравнение е първото по $2$ и не носи нова информация", correct: true },
        { text: "Да, две уравнения с две неизвестни винаги имат едно решение", correct: false },
        { text: "Не, системата няма никакво решение", correct: false },
      ],
      explanation:
        "$4x+6y=16$ е точно $2(2x+3y=8)$: вторият сензор мери същата комбинация, само в друг мащаб. Геометрично двете прави съвпадат и всяка точка от тях е решение.",
    },
    additionQuestion: {
      prompt: "Как детерминантата издава проблема, преди да сме решавали каквото и да е?",
      options: [
        { text: "$\\det M=0$: редовете са пропорционални", correct: true },
        { text: "$\\det M<0$: системата е нестабилна", correct: false },
        { text: "По различните десни страни на уравненията", correct: false },
      ],
      explanation:
        String.raw`$\det\begin{pmatrix}2&3\\4&6\end{pmatrix}=2\cdot6-3\cdot4=0$. Матрица с $\det M=0$ смачква равнината в права. Различни входове дават еднакви изходи, така че входът не може да се възстанови по изхода.`,
    },
    hints: [
      "Сравнете двете уравнения. Какво е отношението на коефициентите им?",
      "За поправената система правилото на Крамер дели на $\\det M$. Кога това е позволено?",
    ],
    steps: [
      {
        text: "Проверката, която инженерът прави първо:",
        latex: String.raw`\det\begin{pmatrix} 2 & 3 \\ 4 & 6 \end{pmatrix} = 12 - 12 = 0 \;\;\Rightarrow\;\; \text{системата е изродена}`,
      },
      {
        text: "С подменения сензор $\\det M=2\\cdot5-3\\cdot4=-2\\ne0$, така че системата вече е решима. Прилагаме правилото на Крамер:",
        latex: String.raw`x = \frac{\begin{vmatrix} 8 & 3 \\ 14 & 5 \end{vmatrix}}{-2} = \frac{40-42}{-2} = 1,\qquad y = \frac{\begin{vmatrix} 2 & 8 \\ 4 & 14 \end{vmatrix}}{-2} = \frac{28-32}{-2} = 2`,
      },
      {
        text: "Отговор: $(x,y)=(1,2)$. Практическият урок е, че **двата сензора трябва да мерят независими комбинации**. Независимостта се проверява с една детерминанта, преди да е купено оборудването.",
      },
    ],
    teacherNotes: [
      "Тук $\\det M=0$ престава да е абстракция: това е „сензорите ми са излишни“. Потърсете реални примери с две уравнения от една и съща везна.",
      "Разширение: при $\\det M=0{,}001$ системата е формално решима, но шумът може да се усили около $1000$ пъти. Инженерите избягват и стойности близо до нулата.",
      "Геометрията е диагностична: съвпадащи прави дават безброй решения, а успоредни прави нямат общо решение. Попитайте как трябва да се смени дясната страна за втория случай.",
    ],
  },
  {
    title: "Площ от GPS координати",
    statement:
      "Дрон заснема три репера: $A(1,1)$, $B(4,2)$ и $C(2,5)$, в стотици метри. Намерете площта на $\\triangle ABC$ чрез детерминанта, без формула на Херон и без височини.",
    figure: (phase) => {
      const T = (x: number, y: number): [number, number] => [60 + x * 52, 270 - y * 44];
      const A = T(1, 1);
      const B = T(4, 2);
      const Cc = T(2, 5);
      const D = T(1 + 3 + 1, 1 + 1 + 4); // A + AB + AC (връх на успоредника)
      return (
        <g>
          {/* мрежа */}
          {Array.from({ length: 8 }, (_, i) => (
            <g key={i} stroke="rgba(255,255,255,0.07)" strokeWidth={1}>
              <line x1={T(i, 0)[0]} y1={T(i, 0)[1]} x2={T(i, 6)[0]} y2={T(i, 6)[1]} />
              <line x1={T(0, i)[0]} y1={T(0, i)[1]} x2={T(7.5, i)[0]} y2={T(7.5, i)[1]} />
            </g>
          ))}
          {phase >= 2 && (
            <polygon points={pts([A, B, D, Cc])} fill="rgba(95,168,245,0.18)" stroke="rgba(95,168,245,0.5)" strokeWidth={1.3} strokeDasharray="6 5" className="animate-rise" />
          )}
          <polygon points={pts([A, B, Cc])} fill={phase >= 2 ? "rgba(232,86,63,0.4)" : "none"} stroke={C.wire} strokeWidth={2} />
          {phase >= 1 && (
            <g className="animate-rise">
              <Arrow x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} color={C.plus} width={2.5} texLabel="\vec{AB}=(3,1)" texLabelDy={16} texLabelWidth={104} />
              <Arrow x1={A[0]} y1={A[1]} x2={Cc[0]} y2={Cc[1]} color={C.ok} width={2.5} texLabel="\vec{AC}=(1,4)" texLabelDx={-84} texLabelDy={-6} texLabelWidth={104} />
            </g>
          )}
          {[["A", A], ["B", B], ["C", Cc]].map(([lb, p]) => (
            <g key={lb as string}>
              <circle cx={(p as [number, number])[0]} cy={(p as [number, number])[1]} r={5} fill={C.warn} stroke={STAGE_BG} strokeWidth={2} />
              <SvgTex x={(p as [number, number])[0] + 9} y={(p as [number, number])[1] + 14} tex={lb as string} color={C.warn} fontSize={13} width={24} />
            </g>
          ))}
          {phase >= 2 && <SvgTex x={460} y={40} tex="S_{\parallel}=|\det|=11" color={C.mut} fontSize={13} width={134} anchor="end" className="animate-rise" />}
          {phase >= 3 && (
            <SvgTex x={460} y={66} tex="S_{\triangle}=5{,}5\times10^4\,\mathrm{m^2}" color={C.ok} fontSize={14} width={170} anchor="end" className="animate-rise" />
          )}
        </g>
      );
    },
    figureCaption: (phase) =>
      phase >= 3
        ? String.raw`Триъгълникът е половината от успоредника: $S_\triangle=5{,}5\times10^4\,\mathrm{m^2}$.`
        : phase >= 2
          ? String.raw`Успоредникът върху $\vec{AB}$ и $\vec{AC}$ има площ $|\det M|=11$.`
        : phase >= 1
            ? String.raw`Векторите $\vec{AB}=(3,1)$ и $\vec{AC}=(1,4)$ опъват успоредника.`
            : undefined,
    directionQuestion: {
      prompt: String.raw`Успоредникът върху $\vec{AB}$ и $\vec{AC}$ има площ $|\det M|$. Каква част от него е $\triangle ABC$?`,
      options: [
        { text: "Точно половината: диагоналът $BC$ го разполовява", correct: true },
        { text: "Една трета", correct: false },
        { text: "Целият: триъгълник и успоредник съвпадат", correct: false },
      ],
      explanation:
        String.raw`Успоредникът върху $\vec{AB}$ и $\vec{AC}$ се състои от $\triangle ABC$ и негово точно копие. Затова $S_\triangle=\frac12|\det M|$.`,
    },
    additionQuestion: {
      prompt: "От какво зависи ЗНАКЪТ на детерминантата тук?",
      options: [
        { text: "От посоката на обхождане на върховете (по/обратно на часовниковата стрелка)", correct: true },
        { text: "От дължините на страните", correct: false },
        { text: "От избора на координатно начало", correct: false },
      ],
      explanation:
        "Разменим ли $B$ и $C$, колоните на матрицата се разменят и $\\det M$ сменя знак. Затова за площта взимаме $|\\det M|$, а знакът дава информация за ориентацията.",
    },
    hints: [
      "Преместете началото в $A$: работете с $\\vec{AB}=B-A$ и $\\vec{AC}=C-A$.",
      "Площта на успоредника е $|\\det M|$ за матрицата с двата вектора като колони.",
    ],
    steps: [
      {
        text: "Векторите от A:",
        latex: String.raw`\vec{AB} = (4-1,\; 2-1) = (3, 1),\qquad \vec{AC} = (2-1,\; 5-1) = (1, 4)`,
      },
      {
        text: "Детерминантата с тях като колони и площта:",
        latex: String.raw`\det\begin{pmatrix} 3 & 1 \\ 1 & 4 \end{pmatrix} = 12 - 1 = 11 \;\;\Rightarrow\;\; S_{\triangle} = \tfrac{1}{2}\,|11| = 5{,}5`,
      },
      {
        text: "В мерните единици на задачата: $5{,}5\\times10^4\\,\\mathrm{m^2}$. Същата сметка по двойки върхове е формулата на Гаус за площ на произволен полигон и е равнинната версия на **векторното произведение**.",
      },
    ],
    teacherNotes: [
      "Това е мостът към векторното произведение: $|\\vec a\\times\\vec b|=|\\det M|=$ площ.",
      "Честа грешка е разбърканият ред $B-A$ срещу $A-B$. Знакът се обръща, но $|\\det M|$ дава същата площ; при полигоните редът е критичен.",
      "Проверка на здравия разум: начертайте грубо триъгълника. Площ около $5$-$6$ квадратчета изглежда ли правдоподобно?",
    ],
  },
];
