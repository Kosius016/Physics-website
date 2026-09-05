import type { GuidedProblemData } from "./GuidedProblem";
import { Arrow, C } from "./svg";
import SvgTex from "./SvgTex";
import { Stage } from "./acPlot";

/** Геометрията е в един и същ мащаб във всички фази на съответната задача. */
function diagram(phase: number, a: [number, number], b: [number, number], scale: number, title: string) {
  const ox = 230, oy = 175;
  const ax = ox + a[0] * scale, ay = oy - a[1] * scale;
  const cx = ax + b[0] * scale, cy = ay - b[1] * scale;
  return <g role="img" aria-label={title}><title>{title}</title><Stage w={480} h={300} title={title} /><Arrow x1={35} y1={oy} x2={445} y2={oy} color={C.faint} /><Arrow x1={ox} y1={270} x2={ox} y2={50} color={C.faint} /><SvgTex x={455} y={oy} tex="x" color={C.mut} width={20} /><SvgTex x={ox} y={38} tex="y" color={C.mut} width={20} anchor="middle" /><path d={`M ${ox} ${oy} L ${ax} ${ay} L ${cx} ${cy}`} stroke={C.faint} strokeDasharray="5 5" fill="none" /><circle cx={ox} cy={oy} r={4} fill={C.wire} /><circle cx={cx} cy={cy} r={4} fill={C.wire} />{phase >= 1 && <><Arrow x1={ox} y1={oy} x2={ax} y2={ay} color={C.minus} /><Arrow x1={ax} y1={ay} x2={cx} y2={cy} color={C.warn} /></>}{phase >= 2 && <Arrow x1={ox} y1={oy} x2={cx} y2={cy} color={C.ok} />}</g>;
}

export const vectorProblems: GuidedProblemData[] = [
  {
    title: "Комбинация на премествания",
    statement: String.raw`Дадени са премествания $\vec a=(2\hat i-\hat j)\,\mathrm{m}$ и $\vec b=(-\hat i-4\hat j)\,\mathrm{m}$. Намерете $\vec c=2\vec a-\vec b$, големината и посоката му спрямо положителната посока на $Ox$.`,
    figure: phase => diagram(phase, [4, -2], [1, 4], 25, "КОМБИНАЦИЯ НА ПРЕМЕСТВАНИЯ"),
    figureCaption: phase => phase === 0 ? "Пунктираният път показва удвоеното първо преместване и обратното на второто. Предвидете знаците." : phase === 1 ? String.raw`Синьо: $2\vec a$. Жълто: $-\vec b$. Началото на втория вектор е в края на първия.` : phase === 2 ? String.raw`Зеленият вектор $\vec c$ свързва началото и края на целия път.` : String.raw`Получаваме $c\approx5{,}39\,\mathrm{m}$ и $\alpha\approx21{,}8^\circ$.`,
    directionQuestion: {
      prompt: String.raw`Какви са знаците на компонентите на $-\vec b$?`,
      options: [
        { text: String.raw`$(+,+)$`, correct: true, why: "Противоположният вектор обръща и двете отрицателни компоненти." },
        { text: String.raw`$(+,-)$`, correct: false, why: "Обърнат е само първият знак. Минусът пред вектора действа върху всяка компонента." },
        { text: String.raw`$(-,-)$`, correct: false, why: "Това са знаците на първоначалния вектор, а не на противоположния." },
      ],
      explanation: String.raw`Първо определете знаците: $2\vec a$ сочи надясно и надолу; $-\vec b$ сочи надясно и нагоре.`,
    },
    additionQuestion: {
      prompt: "Как се комбинират двата приноса?",
      options: [
        { text: "Надясно се усилват, вертикално частично се компенсират", correct: true, why: "Хоризонталните компоненти са положителни, а вертикалните са с различни знаци." },
        { text: "И по двете оси се усилват", correct: false, why: "Вертикалният принос от първия вектор е надолу, а от втория е нагоре." },
        { text: "Компенсират се напълно", correct: false, why: "Пълна компенсация изисква равни големини и противоположни посоки. Тук и двете хоризонтални компоненти са надясно." },
      ],
      explanation: "Проверете всяка ос самостоятелно. Знакът се определя от посоката, а не от дължината на стрелката.",
    },
    hints: [String.raw`Разпределете множителя и минуса: $2\vec a=(4\hat i-2\hat j)\,\mathrm{m}$, $-\vec b=(\hat i+4\hat j)\,\mathrm{m}$.`],
    steps: [
      { text: "Избираме хоризонтална ос надясно и вертикална нагоре. Удвояваме първото преместване и обръщаме второто.", latex: String.raw`2\vec a=(4\hat i-2\hat j)\,\mathrm{m},\qquad -\vec b=(\hat i+4\hat j)\,\mathrm{m}` },
      { text: "По $x$:", latex: String.raw`c_x=2a_x-b_x=2\cdot2-(-1)=5\,\mathrm{m}` },
      { text: "По $y$:", latex: String.raw`c_y=2a_y-b_y=2\cdot(-1)-(-4)=2\,\mathrm{m}` },
      { text: "Събираме компонентните вектори и използваме Питагоровата теорема.", latex: String.raw`\vec c=(5\hat i+2\hat j)\,\mathrm{m},\qquad c=\sqrt{5^2+2^2}\,\mathrm{m}=\sqrt{29}\,\mathrm{m}\approx5{,}39\,\mathrm{m}` },
      { text: "И двете компоненти са положителни: резултатът е в първи квадрант. Ъгълът се измерва обратно на часовниковата стрелка от положителната хоризонтална ос.", latex: String.raw`\alpha=\arctan\frac{2}{5}\approx21{,}8^\circ` },
    ],
    teacherNotes: ["Попитайте защо минусът обръща и двата знака. Ако се обърне само единият, получава ли се противоположен вектор?", "Какъв знак бихте очаквали за вертикалния резултат, преди да смятате?"],
  },
  {
    title: "Маршрут на робот",
    statement: String.raw`Робот се премества първо $5\,\mathrm{m}$ на изток и $2\,\mathrm{m}$ на север по права линия, а после $8\,\mathrm{m}$ на запад и $6\,\mathrm{m}$ на север по друга права линия. Намерете общото преместване $\Delta\vec r$, големината и посоката му, както и изминатия път $s$.`,
    figure: phase => diagram(phase, [5, 2], [-8, 6], 14, "ПРЕМЕСТВАНЕ НА РОБОТ"),
    figureCaption: phase => phase === 0 ? "Пунктираният маршрут има два праволинейни участъка. Преценете от коя страна на началото е крайното положение." : phase === 1 ? "Синьо: първото преместване. Жълто: второто, започващо от края на първото." : phase === 2 ? "Зелената стрелка е общото преместване, а не изминатият път." : String.raw`Общото преместване е $\Delta\vec r=(-3\hat i+8\hat j)\,\mathrm{m}$, с големина $8{,}54\,\mathrm{m}$, а изминатият път е $s\approx15{,}39\,\mathrm{m}$.`,
    directionQuestion: {
      prompt: "Избираме изток и север за положителни посоки. Какви са знаците на второто преместване?",
      options: [
        { text: "$(-,+)$", correct: true, why: "Запад е отрицателната хоризонтална посока, север е положителната вертикална." },
        { text: "$(+,+)$", correct: false, why: "Дадените разстояния са положителни, но западната компонента носи минус." },
        { text: "$(-,-)$", correct: false, why: "Северната компонента е положителна. Смяната на посоката по едната ос не обръща другата." },
      ],
      explanation: "Положителните посоки са наш избор, но след избора трябва да ги спазваме за целия маршрут.",
    },
    additionQuestion: {
      prompt: "Къде спрямо началото се намира роботът накрая?",
      options: [
        { text: "На северозапад", correct: true, why: "Западният принос надделява над източния, а двата северни приноса се събират." },
        { text: "На североизток", correct: false, why: "Този отговор би се получил, ако се пренебрегне минусът на западната компонента." },
        { text: "На югозапад", correct: false, why: "Няма южно преместване: вертикалните компоненти са положителни и в двата участъка." },
      ],
      explanation: "Геометрията предсказва втори квадрант. Това ще ни помогне да проверим изчисления ъгъл.",
    },
    hints: [String.raw`Отрицателна стойност на $\Delta x$ и положителна на $\Delta y$ означават втори квадрант. Обикновеният аркустангенс може да даде ъгъл в грешния квадрант.`],
    steps: [
      { text: "Избираме изток за положителна хоризонтална посока и север за положителна вертикална. Записваме двете премествания.", latex: String.raw`\vec a=(5\hat i+2\hat j)\,\mathrm{m},\qquad\vec b=(-8\hat i+6\hat j)\,\mathrm{m}` },
      { text: "По $x$:", latex: String.raw`\Delta x=a_x+b_x=5+(-8)=-3\,\mathrm{m}` },
      { text: "По $y$:", latex: String.raw`\Delta y=a_y+b_y=2+6=8\,\mathrm{m}` },
      { text: "Възстановяваме вектора и големината му.", latex: String.raw`\Delta\vec r=(-3\hat i+8\hat j)\,\mathrm{m},\qquad |\Delta\vec r|=\sqrt{(-3)^2+8^2}\,\mathrm{m}=\sqrt{73}\,\mathrm{m}\approx8{,}54\,\mathrm{m}` },
      { text: "Резултатът е във втори квадрант. Отчитаме ъгъла обратно на часовниковата стрелка от изток. Изминатият път $s$ е сборът от дължините на двата участъка и е по-голям от преместването.", latex: String.raw`\alpha=180^\circ-\arctan\frac83\approx110{,}6^\circ,\qquad s=\sqrt{29}+10\approx15{,}39\,\mathrm{m}` },
    ],
    teacherNotes: ["Защо отрицателната хоризонтална компонента не означава отрицателна големина?", "Ако ученикът получи отрицателен ъгъл, поискайте да посочи квадранта на чертежа. Различава ли изминатия път от преместването?"],
  },
];
