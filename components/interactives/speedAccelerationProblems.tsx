import type { GuidedProblemData } from "./GuidedProblem";
import SvgTex from "./SvgTex";
import { Arrow, C, DRAWING_FONT_FAMILY } from "./svg";

function axes() {
  return <>
    <Arrow x1={65} y1={215} x2={430} y2={215} color={C.faint} width={1.5} />
    <Arrow x1={120} y1={248} x2={120} y2={35} color={C.faint} width={1.5} />
    <SvgTex x={439} y={238} tex="x" color={C.mut} width={20} />
    <SvgTex x={143} y={35} tex="y" color={C.mut} width={20} />
    <SvgTex x={94} y={241} tex="O" color={C.mut} width={20} />
  </>;
}

export const speedAccelerationProblems: GuidedProblemData[] = [
  {
    title: "Скорост на робот по компоненти",
    statement: String.raw`Робот се движи по хоризонтален под. В даден момент компонентите на скоростта му са $v_x=3\,\mathrm{m/s}$ и $v_y=4\,\mathrm{m/s}$. Намерете големината и посоката на скоростта.`,
    figureHeight: 280,
    figure: phase => <g style={{fontFamily: DRAWING_FONT_FAMILY}}>
      {axes()}
      <path d="M 255 215 V 35 H 120" fill="none" stroke={C.faint} strokeDasharray="5 5" opacity={phase > 1 ? 0.25 : 1} />
      {phase >= 1 && <g opacity={phase > 1 ? 0.25 : 1}>
        <Arrow x1={120} y1={215} x2={255} y2={215} color={C.minus} />
        <Arrow x1={120} y1={215} x2={120} y2={35} color={C.warn} />
        <SvgTex x={200} y={241} tex="v_x" color={C.minus} width={40} />
        <SvgTex x={65} y={120} tex="v_y" color={C.warn} width={40} />
      </g>}
      {phase >= 2 && <><Arrow x1={120} y1={215} x2={255} y2={35} color={C.ok} width={3} /><SvgTex x={274} y={44} tex={String.raw`\vec v`} color={C.ok} width={40} /></>}
      {phase >= 3 && <SvgTex x={174} y={188} tex={String.raw`\theta`} color={C.wire} width={30} />}
    </g>,
    figureCaption: phase => phase < 1 ? "Осите са фиксирани спрямо пода. Определете четвъртината, преди да смятате." : phase < 2 ? "Двете компоненти са перпендикулярни." : "Векторът на скоростта е диагоналът на правоъгълника, построен върху компонентите.",
    directionQuestion: {prompt: "В коя четвъртина сочи скоростта?", options: [
      {text: "В първа", correct: true, why: "И двете компоненти са положителни: надясно и нагоре на чертежа."},
      {text: "Във втора", correct: false, why: "Във втора четвъртина хоризонталната компонента трябва да е отрицателна."},
      {text: "В четвърта", correct: false, why: "В четвърта четвъртина вертикалната компонента трябва да е отрицателна."},
    ], explanation: "Знаците на компонентите определят четвъртината."},
    additionQuestion: {prompt: "Как намираме големината от двете компоненти?", options: [
      {text: String.raw`$\sqrt{v_x^2+v_y^2}$`, correct: true, why: "Компонентите са катети на правоъгълен триъгълник. Големината на скоростта е хипотенузата."},
      {text: String.raw`$v_x+v_y$`, correct: false, why: "Така бихме събирали големини по една и съща посока. Тук компонентите са перпендикулярни."},
      {text: String.raw`$v_y-v_x$`, correct: false, why: "Компонентите не са противопосочни, затова не се компенсират чрез разлика на големините."},
    ], explanation: "Събираме векторните компоненти, а не техните големини като числа."},
    hints: ["Начертайте правоъгълен триъгълник. Първо намерете хипотенузата, после ъгъла спрямо хоризонталната ос."],
    steps: [
      {text: "По x: положителната компонента е насочена надясно.", latex: String.raw`v_x=3\,\mathrm{m/s}`},
      {text: "По y: положителната компонента е насочена нагоре. Обединяваме ги с единичните вектори.", latex: String.raw`\vec v=(3\hat i+4\hat j)\,\mathrm{m/s}`},
      {text: "От Питагоровата теорема намираме големината.", latex: String.raw`v=\sqrt{3^2+4^2}\,\mathrm{m/s}=5\,\mathrm{m/s}`},
      {text: "Ъгълът е в първа четвъртина, измерен от положителната хоризонтална посока.", latex: String.raw`\tan\theta=\frac43,\qquad\theta\approx53{,}1^\circ`},
    ],
    teacherNotes: ["Попитайте защо сборът на големините дава прекалено голям резултат. Свържете отговора с правилото на триъгълника от урока за векторите."],
  },
  {
    title: "Средно ускорение при завой",
    statement: String.raw`Количка сменя посоката си от изток на север за $2\,\mathrm{s}$. В началото и края бързината е $6\,\mathrm{m/s}$. Оста $x$ сочи на изток, а $y$ на север. Намерете средното ускорение за завоя.`,
    figureHeight: 280,
    figure: phase => <g style={{fontFamily: DRAWING_FONT_FAMILY}}>
      {axes()}
      <Arrow x1={120} y1={215} x2={300} y2={215} color={C.minus} width={3} />
      <SvgTex x={315} y={195} tex={String.raw`\vec v_1`} color={C.minus} width={50} />
      <g opacity={phase >= 1 ? 0.25 : 1}><Arrow x1={375} y1={225} x2={375} y2={45} color={C.minus} width={3} /></g>
      <SvgTex x={phase >= 1 ? 63 : 392} y={62} tex={String.raw`\vec v_2`} color={C.minus} width={50} />
      {phase >= 1 && <Arrow x1={120} y1={215} x2={120} y2={35} color={C.minus} width={3} />}
      {phase >= 2 && <><Arrow x1={300} y1={215} x2={120} y2={35} color={C.ok} width={3} /><SvgTex x={246} y={109} tex={String.raw`\Delta\vec v`} color={C.ok} width={65} /></>}
    </g>,
    figureCaption: phase => phase < 1 ? "Схема на началната и крайната скорост, не на траекторията." : phase < 2 ? "Пренасяме крайния вектор до началото на първия, без да променяме посоката му." : "Разликата сочи на северозапад. Средното ускорение има същата посока.",
    directionQuestion: {prompt: "Как се променя хоризонталната компонента на скоростта?", options: [
      {text: "Намалява до нула", correct: true, why: "В края движението е на север и хоризонталната компонента е нула."},
      {text: "Остава същата", correct: false, why: "Еднаквата бързина не означава еднакви компоненти при различни посоки."},
      {text: "Става отрицателна", correct: false, why: "В края няма движение на запад. Хоризонталната компонента е нула, а отрицателна е промяната ѝ."},
    ], explanation: "Разглеждаме всяка компонента самостоятелно."},
    additionQuestion: {prompt: "Кой запис дава промяната на скоростта?", options: [
      {text: String.raw`$(-6\hat i+6\hat j)\,\mathrm{m/s}$`, correct: true, why: "Изваждаме началната хоризонтална компонента и добавяме крайната вертикална."},
      {text: String.raw`$(6\hat i+6\hat j)\,\mathrm{m/s}$`, correct: false, why: "Това е сборът на началната и крайната скорост, не разликата им."},
      {text: String.raw`$0\,\mathrm{m/s}$`, correct: false, why: "Само разликата на големините е нула. Векторите имат различни посоки."},
    ], explanation: String.raw`Промяната винаги е крайна минус начална: $\Delta\vec v=\vec v_2-\vec v_1$.`},
    hints: ["Запишете нулевите компоненти изрично. Това предотвратява размяната на началната и крайната стойност."],
    steps: [
      {text: "По x: крайната компонента е нула.", latex: String.raw`a_{\text{ср},x}=\frac{0-6}{2}\,\mathrm{m/s^2}=-3\,\mathrm{m/s^2}`},
      {text: "По y: началната компонента е нула.", latex: String.raw`a_{\text{ср},y}=\frac{6-0}{2}\,\mathrm{m/s^2}=3\,\mathrm{m/s^2}`},
      {text: "Комбинираме компонентите и намираме големината на средното ускорение.", latex: String.raw`|\vec a_{\text{ср}}|=\sqrt{(-3)^2+3^2}\,\mathrm{m/s^2}=3\sqrt2\,\mathrm{m/s^2}\approx4{,}24\,\mathrm{m/s^2}`},
      {text: "Посоката е на северозапад, под равни ъгли към север и запад. Това е средното ускорение за целия интервал; данните не определят моментното ускорение във всяка точка.", latex: String.raw`\vec a_{\text{ср}}=(-3\hat i+3\hat j)\,\mathrm{m/s^2}`},
    ],
    teacherNotes: ["Еднаквите крайни бързини не доказват постоянна бързина през целия интервал. Не добавяйте такова предположение към условието."],
  },
  {
    title: "Отрицателно ускорение при движение наляво",
    statement: String.raw`Тяло се движи по оста $x$ с начална компонента $v_{1x}=-2\,\mathrm{m/s}$. Ускорението е постоянно: $a_x=-1\,\mathrm{m/s^2}$. Намерете скоростта след $3\,\mathrm{s}$ и определете дали тялото се забавя.`,
    figureHeight: 200,
    figure: phase => <g style={{fontFamily: DRAWING_FONT_FAMILY}}>
      <Arrow x1={35} y1={168} x2={440} y2={168} color={C.faint} /><SvgTex x={443} y={181} tex="x" color={C.mut} width={20} />
      <Arrow x1={355} y1={62} x2={275} y2={62} color={C.minus} width={3} /><SvgTex x={378} y={62} tex={String.raw`\vec v_1`} color={C.minus} width={50} />
      {phase >= 1 && <><Arrow x1={355} y1={103} x2={300} y2={103} color={C.plus} width={3} /><SvgTex x={378} y={103} tex={String.raw`\vec a`} color={C.plus} width={50} /></>}
      {phase >= 2 && <><Arrow x1={355} y1={143} x2={155} y2={143} color={C.ok} width={3} /><SvgTex x={378} y={143} tex={String.raw`\vec v_2`} color={C.ok} width={50} /></>}
    </g>,
    figureCaption: phase => phase < 1 ? "Отрицателната компонента на скоростта означава движение наляво." : "Скоростта и ускорението са еднопосочни. Стрелките за скорост и ускорение са с различни мащаби.",
    directionQuestion: {prompt: "Накъде сочи ускорението?", options: [
      {text: "Наляво, както скоростта", correct: true, why: "И двете компоненти са отрицателни спрямо положителната посока надясно."},
      {text: "Надясно, срещу скоростта", correct: false, why: "Ускорение надясно би имало положителна компонента."},
      {text: "Няма посока", correct: false, why: "Ускорението не е нулево. Отрицателният знак задава посока, не липса на вектор."},
    ], explanation: "Отрицателното ускорение е насочено срещу положителната посока на оста."},
    additionQuestion: {prompt: "Какво става с бързината в този интервал?", options: [
      {text: "Нараства", correct: true, why: "Компонентата става все по-отрицателна и нейният модул расте."},
      {text: "Намалява", correct: false, why: "Това би станало при ускорение надясно, противоположно на движението наляво."},
      {text: "Остава постоянна", correct: false, why: "Ненулевото ускорение по правата променя компонентата на скоростта."},
    ], explanation: "Сравняваме посоките на скоростта и ускорението, а не само знака на ускорението."},
    hints: [String.raw`От $a_x=(v_{2x}-v_{1x})/\Delta t$ изразете крайната компонента. Равенството е точно, защото ускорението е постоянно.`],
    steps: [
      {text: "По x: за всяка секунда компонентата намалява с един метър в секунда.", latex: String.raw`\Delta v_x=a_x\Delta t=-3\,\mathrm{m/s}`},
      {text: "Прибавяме промяната към началната компонента.", latex: String.raw`v_{2x}=v_{1x}+\Delta v_x=(-2-3)\,\mathrm{m/s}=-5\,\mathrm{m/s}`},
      {text: "По y: движение няма. Бързината е модулът на хоризонталната компонента и е нараснала. Тялото не се забавя.", latex: String.raw`v_{2y}=0,\qquad \vec v_2=-5\hat i\,\mathrm{m/s},\qquad v_2=5\,\mathrm{m/s}`},
    ],
    teacherNotes: ["Сменете посоката на оста устно. Знаците ще станат положителни, но физическото движение ще остане същото."],
  },
];
