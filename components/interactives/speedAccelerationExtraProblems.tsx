import type { GuidedProblemData } from "./GuidedProblem";
import SvgTex from "./SvgTex";
import { Arrow, C } from "./svg";

function Axes() {
  return <>
    <Arrow x1={45} y1={225} x2={430} y2={225} color={C.faint} width={1.5} />
    <Arrow x1={235} y1={255} x2={235} y2={30} color={C.faint} width={1.5} />
    <SvgTex x={438} y={243} tex="x" color={C.mut} width={20} />
    <SvgTex x={250} y={30} tex="y" color={C.mut} width={20} />
    <SvgTex x={211} y={247} tex="O" color={C.mut} width={20} />
  </>;
}

export const speedAccelerationExtraProblems: GuidedProblemData[] = [
  {
    title: "Две последователни положения",
    statement: String.raw`За интервал $\Delta t=0{,}5\,\mathrm{s}$ точка се премества от $(6\,\mathrm{m};4\,\mathrm{m})$ до $(5\,\mathrm{m};2{,}5\,\mathrm{m})$. Намерете компонентите и големината на средната векторна скорост. Достатъчни ли са данните за моментната скорост?`,
    figureHeight: 280,
    figure: phase => <>
      <Arrow x1={65} y1={225} x2={425} y2={225} color={C.faint} />
      <Arrow x1={65} y1={225} x2={65} y2={30} color={C.faint} />
      <SvgTex x={42} y={247} tex="O" color={C.wire} width={22} />
      <SvgTex x={433} y={247} tex="x" color={C.mut} width={22} />
      <SvgTex x={83} y={30} tex="y" color={C.mut} width={22} />
      <circle cx={335} cy={45} r={5} fill={C.wire} /><circle cx={290} cy={112.5} r={5} fill={C.wire} />
      <SvgTex x={348} y={40} tex="1" color={C.wire} width={20} /><SvgTex x={303} y={123} tex="2" color={C.wire} width={20} />
      {phase >= 1 && <Arrow x1={335} y1={45} x2={290} y2={112.5} color={C.ok} width={3} />}
      {phase >= 2 && <><path d="M 335 45 H 290 V 112.5" fill="none" stroke={C.minus} strokeDasharray="5 5" /><SvgTex x={270} y={24} tex={String.raw`\Delta x`} color={C.minus} width={50} /><SvgTex x={226} y={85} tex={String.raw`\Delta y`} color={C.minus} width={50} /></>}
    </>,
    figureCaption: phase => phase < 1 ? "И двете положения са в първа четвъртина. Това само по себе си не определя знаците на скоростта." : "Преместването е наляво и надолу, защото и двете координати намаляват. Траекторията между положенията не е зададена.",
    directionQuestion: {prompt: "Какви са знаците на средните компоненти на скоростта?", options: [
      {text: "И двете са отрицателни", correct: true, why: "И двете координати намаляват през положителния времеви интервал."},
      {text: "И двете са положителни", correct: false, why: "Положителната координата показва къде е точката, а не накъде се премества тя."},
      {text: "Хоризонталната е положителна, вертикалната отрицателна", correct: false, why: "Хоризонталната координата също намалява, затова и тази компонента е отрицателна."},
    ], explanation: "За скоростта използваме промяната на координатите, а не самите координати."},
    additionQuestion: {prompt: "Какво можем да намерим точно от тези данни?", options: [
      {text: "Средната векторна скорост за интервала", correct: true, why: "Знаем преместването и времето. Тяхното отношение е определението за средна векторна скорост."},
      {text: "Моментната скорост във всяка точка", correct: false, why: "Не знаем как се е изменяла скоростта между двете положения."},
      {text: "Изминатия път", correct: false, why: "Не е дадена траекторията. Разстоянието между положенията може да е по-малко от изминатия път."},
    ], explanation: "Две положения и интервал определят средна скорост, но не цялото движение."},
    hints: ["Извадете началната координата от крайната по всяка ос. Едва след това разделете на времето."],
    steps: [
      {text: "По x:", latex: String.raw`v_{\text{ср},x}=\frac{5-6}{0{,}5}\,\mathrm{m/s}=-2\,\mathrm{m/s}`},
      {text: "По y:", latex: String.raw`v_{\text{ср},y}=\frac{2{,}5-4}{0{,}5}\,\mathrm{m/s}=-3\,\mathrm{m/s}`},
      {text: "Събираме векторните компоненти и намираме модула.", latex: String.raw`\vec v_{\text{ср}}=(-2\hat i-3\hat j)\,\mathrm{m/s},\qquad |\vec v_{\text{ср}}|=\sqrt{13}\,\mathrm{m/s}\approx3{,}61\,\mathrm{m/s}`},
      {text: "За точната моментна скорост е нужно повече описание на движението. Не можем да приемем без основание, че средната скорост е равна на нея."},
    ],
    teacherNotes: ["Проверете дали ученикът различава положителна координата от положителна компонента на скоростта."],
  },
  {
    title: "Скорост под зададен ъгъл",
    statement: String.raw`В даден момент скоростта на дрон има големина $10\,\mathrm{m/s}$ и сключва ъгъл $150^\circ$ с положителната посока на оста $x$, измерен обратно на часовниковата стрелка. Намерете компонентите ѝ.`,
    figureHeight: 280,
    figure: phase => <>
      <Axes />
      <Arrow x1={235} y1={225} x2={79.115427} y2={135} color={C.ok} width={3} />
      <SvgTex x={62} y={110} tex={String.raw`\vec v`} color={C.ok} width={40} />
      {phase >= 1 && <path d="M 280 225 A 45 45 0 0 0 196.028857 202.5" fill="none" stroke={C.mut} />}
      {phase >= 1 && <SvgTex x={273} y={188} tex={String.raw`\theta`} color={C.mut} width={35} />}
      {phase >= 2 && <><path d="M 79.115427 225 V 135 H 235" fill="none" stroke={C.faint} strokeDasharray="5 5" /><Arrow x1={235} y1={225} x2={79.115427} y2={225} color={C.minus} /><Arrow x1={235} y1={225} x2={235} y2={135} color={C.warn} /><SvgTex x={135} y={248} tex="v_x" color={C.minus} width={35} /><SvgTex x={247} y={153} tex="v_y" color={C.warn} width={35} /></>}
    </>,
    figureCaption: () => "Ъгълът се измерва от положителната хоризонтална посока, не от най-близката ос. Векторът е във втора четвъртина.",
    directionQuestion: {prompt: "Коя компонента е отрицателна?", options: [
      {text: "Хоризонталната", correct: true, why: "Векторът сочи наляво и нагоре. Наляво е отрицателната хоризонтална посока."},
      {text: "Вертикалната", correct: false, why: "Вертикалната проекция сочи нагоре, по положителната посока."},
      {text: "И двете", correct: false, why: "Две отрицателни компоненти биха насочили вектора наляво и надолу."},
    ], explanation: "Знаците се определят от чертежа преди заместването."},
    additionQuestion: {prompt: "Кое отношение дава хоризонталната компонента?", options: [
      {text: String.raw`$v\cos\theta$`, correct: true, why: "Ъгълът е измерен спрямо хоризонталната ос, затова проекцията по нея се намира с косинус."},
      {text: String.raw`$v\sin\theta$`, correct: false, why: "За този избор на ъгъл синусът дава вертикалната компонента."},
      {text: String.raw`$v/\cos\theta$`, correct: false, why: "Делението би дало проекция с модул, по-голям от големината на самия вектор."},
    ], explanation: "Проверете формулата и при нулев ъгъл: тогава целият вектор е по хоризонталната ос."},
    hints: [String.raw`Използвайте $150^\circ=180^\circ-30^\circ$. Косинусът във втора четвъртина е отрицателен.`],
    steps: [
      {text: "По x:", latex: String.raw`v_x=10\cos150^\circ\,\mathrm{m/s}=-5\sqrt3\,\mathrm{m/s}\approx-8{,}66\,\mathrm{m/s}`},
      {text: "По y:", latex: String.raw`v_y=10\sin150^\circ\,\mathrm{m/s}=5\,\mathrm{m/s}`},
      {text: "Записваме вектора и проверяваме големината.", latex: String.raw`\vec v=(-5\sqrt3\hat i+5\hat j)\,\mathrm{m/s},\qquad v=\sqrt{75+25}\,\mathrm{m/s}=10\,\mathrm{m/s}`},
    ],
    teacherNotes: ["Ако ученикът избере положителен косинус, поискайте да покаже хоризонталната проекция върху чертежа."],
  },
  {
    title: "Ускорение от две скорости",
    statement: String.raw`За $2\,\mathrm{s}$ скоростта на точка се изменя от $\vec v_1=(4\hat i+\hat j)\,\mathrm{m/s}$ до $\vec v_2=(\hat i+5\hat j)\,\mathrm{m/s}$. Намерете компонентите и големината на средното ускорение.`,
    figureHeight: 280,
    figure: phase => <>
      <Arrow x1={90} y1={225} x2={430} y2={225} color={C.faint} /><Arrow x1={90} y1={225} x2={90} y2={30} color={C.faint} />
      <SvgTex x={66} y={247} tex="O" color={C.mut} width={20} /><SvgTex x={436} y={247} tex="x" color={C.mut} width={20} /><SvgTex x={106} y={30} tex="y" color={C.mut} width={20} />
      <Arrow x1={90} y1={225} x2={230} y2={190} color={C.minus} width={3} />
      <Arrow x1={90} y1={225} x2={125} y2={50} color={C.minus} width={3} />
      <SvgTex x={245} y={193} tex={String.raw`\vec v_1`} color={C.minus} width={45} /><SvgTex x={140} y={44} tex={String.raw`\vec v_2`} color={C.minus} width={45} />
      {phase >= 1 && <Arrow x1={230} y1={190} x2={125} y2={50} color={C.ok} width={3} />}
      {phase >= 2 && <><path d="M 230 190 H 125 V 50" stroke={C.faint} fill="none" strokeDasharray="5 5" /><SvgTex x={209} y={110} tex={String.raw`\Delta\vec v`} color={C.ok} width={60} /></>}
    </>,
    figureCaption: () => "Схема на векторите с общо начало. Разликата свързва върха на началната скорост с върха на крайната, а не началната и крайната позиция на тялото.",
    directionQuestion: {prompt: "Накъде сочи промяната на скоростта?", options: [
      {text: "Наляво и нагоре", correct: true, why: "Хоризонталната компонента намалява, а вертикалната се увеличава."},
      {text: "Надясно и нагоре", correct: false, why: "Това е посоката на двете скорости, но не на разликата им. Хоризонталната промяна е отрицателна."},
      {text: "Наляво и надолу", correct: false, why: "Вертикалната компонента се увеличава, затова промяната по тази ос е положителна."},
    ], explanation: "Посоката на изменението не е задължително посоката на някоя от двете скорости."},
    additionQuestion: {prompt: "Как извършваме изваждането?", options: [
      {text: "Крайна минус начална компонента по всяка ос", correct: true, why: "Векторната разлика се намира чрез разликите на съответните компоненти."},
      {text: "Изваждаме само големините на скоростите", correct: false, why: "Така губим информацията за промяната на посоката."},
      {text: "Събираме съответните компоненти", correct: false, why: "Сборът не описва промяната. Ако двете скорости са еднакви, промяната трябва да е нула."},
    ], explanation: "Намираме векторната разлика и делим на положителния интервал."},
    hints: ["Първо запишете двете промени по осите, после разделете всяка на времето."],
    steps: [
      {text: "По x:", latex: String.raw`a_{\text{ср},x}=\frac{1-4}{2}\,\mathrm{m/s^2}=-1{,}5\,\mathrm{m/s^2}`},
      {text: "По y:", latex: String.raw`a_{\text{ср},y}=\frac{5-1}{2}\,\mathrm{m/s^2}=2\,\mathrm{m/s^2}`},
      {text: "Намираме модула на средното ускорение от перпендикулярните компоненти.", latex: String.raw`|\vec a_{\text{ср}}|=\sqrt{(-1{,}5)^2+2^2}\,\mathrm{m/s^2}=2{,}5\,\mathrm{m/s^2}`},
    ],
    teacherNotes: ["Нито траекторията, нито постоянно ускорение са дадени. Резултатът е среден за интервала, не моментен."],
  },
];
