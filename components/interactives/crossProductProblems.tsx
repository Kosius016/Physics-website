import type { ReactNode } from "react";
import type { GuidedProblemData } from "./GuidedProblem";
import SvgTex from "./SvgTex";
import { Arrow, C } from "./svg";
import {
  Axes3D,
  MiniAxes,
  Parallelogram,
  TipLabel,
  addV,
  cross,
  makeProjector,
  norm,
  scaleV,
  type V3,
} from "./vector3d";

/**
 * Водени задачи за урока „Векторно произведение“.
 *
 * Редът е същият като в останалите глави: въпрос за типа и посоката на
 * резултата → втори концептуален въпрос → чак тогава сметката. Фигурата се
 * достроява по фази: 0 двата вектора → 1 успоредникът → 2 нормалата →
 * 3 численият резултат.
 */

interface SceneConfig {
  /** Двата множителя, в реда на умножението. */
  a: V3;
  b: V3;
  texA: string;
  texB: string;
  /** Резултатът; по подразбиране е a × b. */
  result?: V3;
  texResult: string;
  /** Трети вектор (смесено произведение); рисува се от фаза 1. */
  c?: V3;
  texC?: string;
  /** Надпис със стойността, показан на фаза 3. */
  finalTex?: string;
}

/** Изгражда фазовата фигура на задачата от конфигурацията ѝ. */
function buildFigure(cfg: SceneConfig): (phase: number) => ReactNode {
  const result = cfg.result ?? cross(cfg.a, cfg.b);
  const scaleRef = Math.max(norm(cfg.a), norm(cfg.b), cfg.c ? norm(cfg.c) : 0);
  /* Нормалата често е далеч по-дълга от множителите; свиваме я само за показване. */
  const resultShown =
    norm(result) > 1e-9 ? scaleV(result, (0.95 * scaleRef) / norm(result)) : result;

  const spanned: V3[] = [cfg.a, cfg.b, addV(cfg.a, cfg.b), resultShown];
  if (cfg.c) spanned.push(cfg.c, addV(addV(cfg.a, cfg.b), cfg.c));
  const P = makeProjector(spanned, 215, 148, 78);
  const o = P([0, 0, 0]);
  /* Осите се мащабират спрямо сцената, за да не се доближат до върховете на
     векторите; иначе етикетите им се застъпват при някои задачи. */
  const axisLen = 0.4 * Math.max(...spanned.map(norm));

  return (phase: number) => {
    const pa = P(cfg.a);
    const pb = P(cfg.b);
    const pr = P(resultShown);
    return (
      <g>
        <Axes3D P={P} len={axisLen} labels={false} />
        <MiniAxes cx={54} cy={62} />

        {phase >= 1 && (
          <g className="animate-rise">
            <Parallelogram P={P} a={cfg.a} b={cfg.b} />
          </g>
        )}

        <Arrow x1={o[0]} y1={o[1]} x2={pa[0]} y2={pa[1]} color={C.plus} width={3.2} />
        <Arrow x1={o[0]} y1={o[1]} x2={pb[0]} y2={pb[1]} color={C.minus} width={3.2} />
        <TipLabel P={P} v={cfg.a} tex={cfg.texA} color={C.plus} dx={11} dy={-9} />
        <TipLabel P={P} v={cfg.b} tex={cfg.texB} color={C.minus} dx={11} dy={-9} />

        {cfg.c && phase >= 1 && (
          <g className="animate-rise">
            {(() => {
              const pc = P(cfg.c!);
              return <Arrow x1={o[0]} y1={o[1]} x2={pc[0]} y2={pc[1]} color={C.warn} width={3} />;
            })()}
            <TipLabel P={P} v={cfg.c} tex={cfg.texC ?? ""} color={C.warn} dx={11} dy={10} />
          </g>
        )}

        {phase >= 2 && norm(result) > 1e-9 && (
          <g className="animate-rise">
            <Arrow x1={o[0]} y1={o[1]} x2={pr[0]} y2={pr[1]} color={C.ok} width={3.4} />
            <TipLabel P={P} v={resultShown} tex={cfg.texResult} color={C.ok} dx={12} dy={-10} width={96} />
          </g>
        )}

        {phase >= 3 && cfg.finalTex && (
          <SvgTex
            x={24}
            y={276}
            tex={cfg.finalTex}
            color={C.ok}
            fontSize={15}
            width={430}
            className="animate-rise"
          />
        )}
      </g>
    );
  };
}

export const crossProductProblems: GuidedProblemData[] = [
  {
    title: "Сметнете и проверете перпендикулярността",
    statement:
      "Дадени са $\\vec a=(2,-1,3)$ и $\\vec b=(1,4,-2)$. Намерете $\\vec a\\times\\vec b$ и проверете резултата, без да преглеждате сметката отново.",
    figure: buildFigure({
      a: [2, -1, 3],
      b: [1, 4, -2],
      texA: String.raw`\vec a`,
      texB: String.raw`\vec b`,
      texResult: String.raw`\vec a\times\vec b`,
      finalTex: String.raw`\vec a\times\vec b=(-10,\,7,\,9)`,
    }),
    figureCaption: (phase) =>
      phase >= 3
        ? "Зеленият вектор е нормалата; дължината му е площта на осветения успоредник."
        : phase >= 2
          ? "Резултатът стърчи от равнината на двата множителя."
          : phase >= 1
            ? "Успоредникът върху $\\vec a$ и $\\vec b$ е това, чиято площ ще стане дължина на новия вектор."
            : undefined,
    directionQuestion: {
      prompt: "Какъв обект е $\\vec a\\times\\vec b$ и как стои спрямо двата множителя?",
      options: [
        { text: "Вектор, перпендикулярен и на двата множителя", correct: true },
        { text: "Число, което мери колко са успоредни двата вектора", correct: false },
        { text: "Вектор, който лежи в равнината на двата множителя", correct: false },
      ],
      explanation:
        "Резултатът е **вектор**, а не число, и излиза **извън** равнината на множителите. Числото, което мери успоредността, е скаларното произведение.",
    },
    additionQuestion: {
      prompt: "Кой е най-надеждният начин да проверите готовия резултат?",
      options: [
        { text: "Две скаларни произведения: и с двата множителя трябва да дадат нула", correct: true },
        { text: "Да сравните дължините на $\\vec a$ и $\\vec b$", correct: false },
        { text: "Да прочетете знаците в сметката още веднъж", correct: false },
      ],
      explanation:
        "Повторното четене намира същата грешка, която сте направили. Скаларните произведения са **независима** проверка: перпендикулярността следва от дефиницията, затова всяко ненулево число издава сметката.",
    },
    hints: [
      "Запишете детерминантата с $\\vec i,\\vec j,\\vec k$ на първия ред и разгънете със знаците $+\\ -\\ +$.",
      "Средната компонента носи минус пред минора: $-(a_1b_3-a_3b_1)$.",
    ],
    steps: [
      {
        text: "Записваме формалната детерминанта и разгъваме по първия ред:",
        latex: String.raw`\vec a\times\vec b=\begin{vmatrix}\vec i&\vec j&\vec k\\2&-1&3\\1&4&-2\end{vmatrix}=(-10,\;7,\;9)`,
      },
      {
        text: "Проверяваме с двете скаларни произведения:",
        latex: String.raw`\vec a\cdot(-10,7,9)=-20-7+27=0,\qquad \vec b\cdot(-10,7,9)=-10+28-18=0`,
      },
      {
        text: "И двете дават нула, значи резултатът е перпендикулярен на равнината на множителите и сметката издържа проверката.",
      },
    ],
    teacherNotes: [
      "Най-честата грешка е знакът на средната компонента. Изисквайте първо да се напише схемата $+\\ -\\ +$ и чак после числата.",
      "Настоявайте проверката да се прави **винаги**, дори когато ученикът е сигурен: това е навикът, който после спасява изпита.",
    ],
  },
  {
    title: "Площ на триъгълник в пространството",
    statement:
      "Точките са $A(1,0,2)$, $B(3,1,0)$ и $C(0,2,1)$. Намерете площта на триъгълника $ABC$.",
    figure: buildFigure({
      a: [2, 1, -2],
      b: [-1, 2, -1],
      texA: String.raw`\vec{AB}`,
      texB: String.raw`\vec{AC}`,
      texResult: String.raw`\vec{AB}\times\vec{AC}`,
      finalTex: String.raw`S_{\triangle}=\tfrac12\left|\vec{AB}\times\vec{AC}\right|=\tfrac{5\sqrt2}{2}`,
    }),
    figureCaption: (phase) =>
      phase >= 2
        ? "Триъгълникът е точно половината от осветения успоредник."
        : phase >= 1
          ? "Двата вектора тръгват от общия връх $A$ и опъват успоредник."
          : undefined,
    directionQuestion: {
      prompt: "Кои два вектора описват страните на триъгълника от общия връх $A$?",
      options: [
        { text: "$\\vec{AB}$ и $\\vec{AC}$", correct: true },
        { text: "$\\vec{AB}$ и $\\vec{BC}$", correct: false },
        { text: "Радиус-векторите $\\vec{OA}$ и $\\vec{OB}$", correct: false },
      ],
      explanation:
        "Векторното произведение работи с два вектора от **общо начало**. $\\vec{AB}$ и $\\vec{BC}$ тръгват от различни върхове, а радиус-векторите сочат от началото, не от $A$.",
    },
    additionQuestion: {
      prompt: "Дължината $\\left|\\vec{AB}\\times\\vec{AC}\\right|$ е площта на кой обект?",
      options: [
        { text: "На успоредника; триъгълникът е точно половината от него", correct: true },
        { text: "Направо на триъгълника $ABC$", correct: false },
        { text: "На правоъгълника със страни $|\\vec{AB}|$ и $|\\vec{AC}|$", correct: false },
      ],
      explanation:
        "Диагоналът разделя успоредника на два еднакви триъгълника, затова множителят $1/2$ е задължителен. Правоъгълник би се получил само при перпендикулярни страни.",
    },
    hints: [
      "Извадете координатите на $A$ от тези на $B$ и на $C$, за да получите двата вектора.",
      "Не забравяйте множителя $1/2$ накрая.",
    ],
    steps: [
      {
        text: "Двата вектора от общия връх:",
        latex: String.raw`\vec{AB}=(2,1,-2),\qquad \vec{AC}=(-1,2,-1)`,
      },
      {
        text: "Векторното произведение и дължината му:",
        latex: String.raw`\vec{AB}\times\vec{AC}=(3,4,5),\qquad \left|\vec{AB}\times\vec{AC}\right|=\sqrt{50}=5\sqrt2`,
      },
      {
        text: "Площта на триъгълника е половината от площта на успоредника:",
        latex: String.raw`S_{\triangle}=\frac12\left|\vec{AB}\times\vec{AC}\right|=\frac{5\sqrt2}{2}`,
      },
    ],
    teacherNotes: [
      "Изпуснатият множител $1/2$ е класика. Питайте „кое е удвоено?“ и оставете ученика да посочи втория триъгълник върху фигурата.",
      "Добър контролен въпрос: „кой връх избрахте за общо начало и щеше ли да излезе същата площ от $B$?“ (да, площта не зависи от избора).",
    ],
  },
  {
    title: "Равнина през три точки",
    statement:
      "Намерете уравнението на равнината през $P(1,0,2)$, $Q(2,1,2)$ и $R(0,2,3)$.",
    figure: buildFigure({
      a: [1, 1, 0],
      b: [-1, 2, 1],
      texA: String.raw`\vec{PQ}`,
      texB: String.raw`\vec{PR}`,
      texResult: String.raw`\vec n`,
      finalTex: String.raw`x-y+3z-7=0`,
    }),
    figureCaption: (phase) =>
      phase >= 2
        ? "Нормалата $\\vec n$ определя наклона на равнината; точката $P$ я закотвя в пространството."
        : phase >= 1
          ? "Двата вектора лежат В равнината, затова успоредникът им е парче от нея."
          : undefined,
    directionQuestion: {
      prompt: "Какво е достатъчно, за да се запише уравнението на една равнина?",
      options: [
        { text: "Една нейна точка и вектор, перпендикулярен на нея", correct: true },
        { text: "Три вектора, които лежат в самата равнина", correct: false },
        { text: "Дължините на трите страни на триъгълника $PQR$", correct: false },
      ],
      explanation:
        "Нормалата задава **наклона**, а точката задава **къде** стои равнината. Оттам условието „$X$ е в равнината“ се пише като перпендикулярност: $\\vec n\\cdot(X-P)=0$.",
    },
    additionQuestion: {
      prompt: "Как от трите точки се получават два вектора, които лежат в равнината?",
      options: [
        { text: "Изваждаме една и съща точка от другите две", correct: true },
        { text: "Събираме координатите на точките две по две", correct: false },
        { text: "Вземаме радиус-векторите $\\vec{OP}$, $\\vec{OQ}$, $\\vec{OR}$", correct: false },
      ],
      explanation:
        "Разликата на две точки от равнината е вектор, който лежи **в** нея. Радиус-векторите тръгват от началото на координатната система, което по принцип не е в равнината.",
    },
    hints: [
      "Първо два вектора в равнината, после нормала, чак накрая уравнение.",
      "Уравнението се получава от условието $\\vec n\\cdot(X-P)=0$ за произволна точка $X=(x,y,z)$.",
    ],
    steps: [
      {
        text: "Два вектора в равнината, с общо начало $P$:",
        latex: String.raw`\vec{PQ}=(1,1,0),\qquad \vec{PR}=(-1,2,1)`,
      },
      {
        text: "Нормалата е тяхното векторно произведение:",
        latex: String.raw`\vec n=\vec{PQ}\times\vec{PR}=(1,-1,3)`,
      },
      {
        text: "Записваме перпендикулярността спрямо закотвящата точка и опростяваме:",
        latex: String.raw`(x-1)-y+3(z-2)=0\quad\Longrightarrow\quad x-y+3z-7=0`,
      },
    ],
    teacherNotes: [
      "Всяко ненулево кратно на нормалата дава същата равнина; ако ученик получи $(2,-2,6)$, това не е грешка.",
      "Проверка, която трябва да стане рефлекс: заместете и трите изходни точки в готовото уравнение.",
    ],
  },
  {
    title: "Момент на сила",
    statement:
      "Сила $\\vec F=(0,40,0)\\,\\mathrm N$ действа в точка с радиус-вектор $\\vec r=(0{,}30,\\,0,\\,0)\\,\\mathrm m$. Намерете момента $\\vec\\tau=\\vec r\\times\\vec F$.",
    figure: buildFigure({
      a: [0.3, 0, 0],
      b: [0, 0.4, 0],
      texA: String.raw`\vec r`,
      texB: String.raw`\vec F`,
      texResult: String.raw`\vec\tau`,
      finalTex: String.raw`\vec\tau=12\,\vec k\ \mathrm{N\,m}`,
    }),
    figureCaption: (phase) =>
      phase >= 2
        ? "Моментът сочи по оста на въртене, а не по посоката на силата."
        : phase >= 1
          ? "Рамото и силата опъват равнина; въртенето става около перпендикуляра ѝ."
          : undefined,
    directionQuestion: {
      prompt: "Рамото $\\vec r$ сочи по $+x$, силата $\\vec F$ по $+y$. Накъде сочи моментът?",
      options: [
        { text: "По $+z$, тоест по оста, около която тялото се завърта", correct: true },
        { text: "По $+y$, заедно със силата", correct: false },
        { text: "По $-z$, обратно на оста на въртене", correct: false },
      ],
      explanation:
        "От цикъла: $\\vec i\\times\\vec j=\\vec k$. Моментът **никога** не сочи по силата: той сочи по оста, около която силата върти тялото.",
    },
    additionQuestion: {
      prompt: "Коя част от силата всъщност върти тялото?",
      options: [
        { text: "Само съставката, перпендикулярна на рамото", correct: true },
        { text: "Цялата сила, независимо от посоката ѝ", correct: false },
        { text: "Само съставката по рамото", correct: false },
      ],
      explanation:
        "Затова в големината стои $\\sin\\theta$: сила, дръпната **по** рамото ($\\theta=0$), не върти нищо. Всеки, който е бутал врата близо до пантите, го знае с ръце.",
    },
    hints: [
      "Тук не е нужна пълната сметка: и двата вектора лежат по координатни оси.",
      "Използвайте базисния цикъл $\\vec i\\times\\vec j=\\vec k$ и изнесете числата отпред.",
    ],
    steps: [
      {
        text: "И двата вектора са по оси, затова използваме направо цикъла:",
        latex: String.raw`\vec\tau=(0{,}30\,\vec i)\times(40\,\vec j)=0{,}30\cdot40\,(\vec i\times\vec j)=12\,\vec k`,
      },
      {
        text: "Резултатът с мерна единица:",
        latex: String.raw`\vec\tau=(0,\,0,\,12)\ \mathrm{N\,m}`,
      },
      {
        text: "Големината $12\\,\\mathrm{N\\,m}$ е „сила по рамо“, а посоката $+z$ идва от правилото на дясната ръка, приложено от $\\vec r$ към $\\vec F$.",
      },
    ],
    teacherNotes: [
      "Честа грешка: моментът да се сочи по посоката на силата. Диагностика: „ако бутнете вратата, накъде сочи оста на въртене?“",
      "Свържете със знака: обратното въртене би дало $-\\vec k$, тоест размяна на реда $\\vec F\\times\\vec r$.",
    ],
  },
  {
    title: "Посока и големина на силата на Лоренц",
    statement:
      "Заряд $q=2\\,\\mathrm{mC}$ се движи с $\\vec v=(3,0,0)\\,\\mathrm{m/s}$ в поле $\\vec B=(0,0,0{,}5)\\,\\mathrm T$. Намерете $\\vec F=q\\,\\vec v\\times\\vec B$.",
    figure: buildFigure({
      a: [3, 0, 0],
      b: [0, 0, 1.5],
      texA: String.raw`\vec v`,
      texB: String.raw`\vec B`,
      texResult: String.raw`\vec v\times\vec B`,
      finalTex: String.raw`\vec F=(0,\,-3\cdot10^{-3},\,0)\ \mathrm N`,
    }),
    figureCaption: (phase) =>
      phase >= 2
        ? "Силата е перпендикулярна и на скоростта, и на полето: затова само завива траекторията, без да ускорява частицата."
        : phase >= 1
          ? "Скоростта и полето опъват равнина; силата ще излезе от нея."
          : undefined,
    directionQuestion: {
      prompt: "Скоростта е по $+x$, полето по $+z$. Накъде сочи $\\vec v\\times\\vec B$?",
      options: [
        { text: "По $-y$", correct: true },
        { text: "По $+y$", correct: false },
        { text: "По $+z$, заедно с полето", correct: false },
      ],
      explanation:
        "От цикъла $\\vec k\\times\\vec i=\\vec j$ следва, че $\\vec i\\times\\vec k=-\\vec j$: двойката $x\\to z$ върви **назад** по цикъла, затова знакът е минус.",
    },
    additionQuestion: {
      prompt: "Какво се променя, ако зарядът е отрицателен?",
      options: [
        { text: "Силата сочи в обратната посока; големината ѝ остава същата", correct: true },
        { text: "Нищо: посоката зависи само от $\\vec v$ и $\\vec B$", correct: false },
        { text: "Само големината се променя, посоката остава", correct: false },
      ],
      explanation:
        "Множителят $q$ е **знаково** число: отрицателният заряд обръща вектора, без да променя дължината му. Точно затова електроните и протоните завиват в противоположни посоки в едно и също поле.",
    },
    hints: [
      "Първо намерете $\\vec v\\times\\vec B$ и чак накрая умножете по заряда.",
      "Внимавайте с мерната единица на заряда: $2\\,\\mathrm{mC}=2\\cdot10^{-3}\\,\\mathrm C$.",
    ],
    steps: [
      {
        text: "Векторното произведение на скоростта и полето:",
        latex: String.raw`\vec v\times\vec B=(3,0,0)\times(0,0,0{,}5)=(0,\,-1{,}5,\,0)`,
      },
      {
        text: "Умножаваме по заряда, преведен в кулони:",
        latex: String.raw`\vec F=2\cdot10^{-3}\,(0,\,-1{,}5,\,0)=(0,\,-3\cdot10^{-3},\,0)\ \mathrm N`,
      },
      {
        text: "Силата е перпендикулярна на скоростта, затова не променя големината ѝ, а само посоката: така се получава кръговото движение на заредена частица в магнитно поле.",
      },
    ],
    teacherNotes: [
      "Свържете с урока за силата на Лоренц: тук ученикът вижда, че „правилото на лявата/дясната ръка“ от физиката е буквално това векторно произведение.",
      "Диагностичен въпрос: „защо тази сила не може да ускори частицата?“ (перпендикулярна е на движението, значи не върши работа).",
    ],
  },
  {
    title: "Обем на паралелепипед",
    statement:
      "Дадени са $\\vec a=(1,2,0)$, $\\vec b=(0,1,3)$ и $\\vec c=(2,0,1)$. Намерете обема на паралелепипеда върху тях.",
    figure: buildFigure({
      a: [0, 1, 3],
      b: [2, 0, 1],
      c: [1, 2, 0],
      texA: String.raw`\vec b`,
      texB: String.raw`\vec c`,
      texC: String.raw`\vec a`,
      texResult: String.raw`\vec b\times\vec c`,
      finalTex: String.raw`V=\left|\vec a\cdot(\vec b\times\vec c)\right|=13`,
    }),
    figureCaption: (phase) =>
      phase >= 2
        ? "Дължината на зеления вектор е площта на основата; проекцията на $\\vec a$ върху него е височината."
        : phase >= 1
          ? "$\\vec b$ и $\\vec c$ образуват основата, а $\\vec a$ е третият ръб."
          : undefined,
    directionQuestion: {
      prompt: "Кой израз дава обема на паралелепипеда върху трите вектора?",
      options: [
        { text: "$\\left|\\vec a\\cdot(\\vec b\\times\\vec c)\\right|$", correct: true },
        { text: "$|\\vec a|\\cdot|\\vec b|\\cdot|\\vec c|$", correct: false },
        { text: "$|\\vec a\\times\\vec b|+|\\vec b\\times\\vec c|$", correct: false },
      ],
      explanation:
        "Произведението на дължините би било вярно само за взаимно перпендикулярни ръбове. Смесеното произведение отчита и наклона: площ на основата по **перпендикулярната** височина.",
    },
    additionQuestion: {
      prompt: "Какво носи знакът на смесеното произведение, преди да вземем абсолютна стойност?",
      options: [
        { text: "Ориентацията на тройката вектори (дясна или лява)", correct: true },
        { text: "Дали обемът е голям или малък", correct: false },
        { text: "Нищо: знакът зависи от реда на записване и е без значение", correct: false },
      ],
      explanation:
        "Точно както знакът на детерминантата в 2D различаваше огледалното обръщане, тук той различава дясна от лява тройка. Геометричният обем е модулът, но знакът носи истинска информация.",
    },
    hints: [
      "Първо основата: сметнете $\\vec b\\times\\vec c$.",
      "После височината: скаларно произведение на резултата с $\\vec a$.",
    ],
    steps: [
      {
        text: "Нормалата на основата:",
        latex: String.raw`\vec b\times\vec c=(1,\,6,\,-2)`,
      },
      {
        text: "Смесеното произведение:",
        latex: String.raw`\vec a\cdot(\vec b\times\vec c)=1+12+0=13`,
      },
      {
        text: "Обемът е абсолютната му стойност:",
        latex: String.raw`V=\left|\vec a\cdot(\vec b\times\vec c)\right|=13`,
      },
    ],
    teacherNotes: [
      "Свържете с §7: смесеното произведение е детерминантата на матрицата с трите вектора като колони, тоест 3D версията на „площта“ от предишния урок.",
      "Питайте какво би станало, ако разменим два от векторите (знакът се обръща, обемът не се променя).",
    ],
  },
  {
    title: "Кога три вектора са компланарни?",
    statement:
      "За коя стойност на $\\lambda$ векторите $\\vec a=(1,\\lambda,2)$, $\\vec b=(2,-1,1)$ и $\\vec c=(3,2,0)$ лежат в една равнина?",
    figure: buildFigure({
      a: [2, -1, 1],
      b: [3, 2, 0],
      c: [1, -4, 2],
      texA: String.raw`\vec b`,
      texB: String.raw`\vec c`,
      texC: String.raw`\vec a`,
      texResult: String.raw`\vec b\times\vec c`,
      finalTex: String.raw`\lambda=-4\ \Rightarrow\ \vec a\cdot(\vec b\times\vec c)=0`,
    }),
    figureCaption: (phase) =>
      phase >= 2
        ? "При $\\lambda=-4$ векторът $\\vec a$ ляга перпендикулярно на зелената нормала, тоест точно в равнината на другите два."
        : phase >= 1
          ? "$\\vec b$ и $\\vec c$ определят равнина; въпросът е кога $\\vec a$ попада в нея."
          : undefined,
    directionQuestion: {
      prompt: "Какво геометрично условие значи „трите вектора лежат в една равнина“?",
      options: [
        { text: "Паралелепипедът върху тях има нулев обем", correct: true },
        { text: "Всеки два от тях са взаимно перпендикулярни", correct: false },
        { text: "И трите имат еднаква дължина", correct: false },
      ],
      explanation:
        "Ако трите ръба са в една равнина, тялото няма дебелина: височината над основата е нула, значи и обемът е нула. Оттам условието е чисто алгебрично: смесеното произведение да се занули.",
    },
    additionQuestion: {
      prompt: "На кой случай от урока за детерминанти отговаря това?",
      options: [
        { text: "$\\det=0$: пространството е смачкано и обемът изчезва", correct: true },
        { text: "$\\det=1$: обемът се запазва точно", correct: false },
        { text: "$\\det<0$: ориентацията е обърната", correct: false },
      ],
      explanation:
        "Същият критерий, една размерност по-нагоре. В 2D $\\det=0$ значеше „равнината е смачкана в права“; в 3D значи „пространството е смачкано в равнина“, тоест колоните са зависими.",
    },
    hints: [
      "Условието за компланарност е смесеното произведение да е нула.",
      "Сметнете $\\vec b\\times\\vec c$ първо: то не зависи от $\\lambda$.",
    ],
    steps: [
      {
        text: "Нормалата на равнината, определена от $\\vec b$ и $\\vec c$:",
        latex: String.raw`\vec b\times\vec c=(-2,\,3,\,7)`,
      },
      {
        text: "Смесеното произведение зависи линейно от $\\lambda$:",
        latex: String.raw`\vec a\cdot(\vec b\times\vec c)=-2+3\lambda+14=3\lambda+12`,
      },
      {
        text: "Зануляваме го:",
        latex: String.raw`3\lambda+12=0\quad\Longrightarrow\quad \lambda=-4`,
      },
    ],
    teacherNotes: [
      "Задачата затваря кръга с детерминантите: компланарност, нулев обем и линейна зависимост са едно и също твърдение на три езика.",
      "Добър последващ въпрос: „за всяко ли $\\lambda$ извън $-4$ трите вектора образуват базис на пространството?“ (да).",
    ],
  },
];
