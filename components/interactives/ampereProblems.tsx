import type { GuidedProblemData } from "./GuidedProblem";
import { Arrow, C, CurrentSymbol, STAGE_BG } from "./svg";

const q = (v: number) => Math.round(v * 1000) / 1000;

function Loop({ r, color = C.warn }: { r: number; color?: string }) {
  return <circle cx="190" cy="150" r={r} fill="none" stroke={color} strokeWidth="2.5" strokeDasharray="7 5" />;
}

export const ampereProblems: GuidedProblemData[] = [
  {
    title: "Поле край силов кабел",
    statement: "**Силов кабел.** Прав дълъг проводник носи ток I = 400 A. Намерете магнитното поле на 5.0 m от него и сравнете с типичното земно поле (~50 μT).",
    figure: (phase) => <g>
      <CurrentSymbol x={190} y={150} out r={18} color={C.plus} label="400 A" />
      <Loop r={92} />
      {phase >= 1 && [0, 1, 2, 3].map((i) => { const a = i * Math.PI / 2; const x = 190 + 92 * Math.cos(a); const y = 150 + 92 * Math.sin(a); return <Arrow key={i} x1={q(x + 10 * Math.sin(a))} y1={q(y - 10 * Math.cos(a))} x2={q(x - 10 * Math.sin(a))} y2={q(y + 10 * Math.cos(a))} color={C.minus} width={2} />; })}
      <line x1="190" y1="150" x2="282" y2="150" stroke={C.faint} strokeDasharray="5 4" />
      <text x="236" y="140" fill={C.mut} fontSize="13">r = 5.0 m</text>
      {phase >= 2 && <text x="330" y="95" fill={C.ok} fontSize="16" fontWeight="700">B = 16 μT</text>}
      {phase >= 3 && <text x="330" y="122" fill={C.mut} fontSize="13">≈ 1/3 от земното поле</text>}
    </g>,
    directionQuestion: {
      prompt: "При ток навън от екрана накъде обикаля магнитното поле?",
      options: [{ text: "Обратно на часовниковата стрелка", correct: true }, { text: "По часовниковата стрелка", correct: false }, { text: "Радиално навън", correct: false }],
      explanation: "Палецът сочи навън; свитите пръсти обикалят обратно на часовниковата стрелка.",
    },
    additionQuestion: {
      prompt: "Кой контур позволява да изнесем B пред интеграла?",
      options: [{ text: "Кръг с център в проводника", correct: true }, { text: "Произволна изместена елипса", correct: false }, { text: "Отворена отсечка", correct: false }],
      explanation: "По центрирания кръг B е с еднаква големина и навсякъде е успоредно на dl.",
    },
    hints: ["За прав проводник: B·2πr = μ₀I.", "1 T = 10⁶ μT."],
    steps: [
      { text: "Избираме кръгова амперова линия с радиус r. Симетрията прави B константно по нея.", latex: String.raw`\oint\vec B\cdot d\vec l=B(2\pi r)=\mu_0 I` },
      { text: "Заместваме I = 400 A и r = 5.0 m.", latex: String.raw`B=\frac{4\pi\cdot10^{-7}\cdot400}{2\pi\cdot5}=1.6\cdot10^{-5}\ \mathrm T=16\ \mu\mathrm T` },
      { text: "Резултатът е около 32% от 50 μT — осезаем, но по-слаб от типичното земно поле." },
    ],
    teacherNotes: ["Преди сметката искайте оценка: удвояването на r трябва да намали B наполовина.", "Подчертайте, че сравнението със Земята е за мащаб, не оценка за безопасност."],
  },
  {
    title: "Вътре в дебел проводник",
    statement: "**Дебел проводник.** Цилиндричен проводник с радиус R = 2 cm носи равномерно разпределен ток I = 10 A. Намерете B на r = 1 cm вътре в него.",
    figure: (phase) => <g>
      <circle cx="190" cy="150" r="105" fill="rgba(255,118,84,.16)" stroke={C.plus} strokeWidth="2" />
      {Array.from({ length: 21 }, (_, i) => { const a = i * 2.4; const rr = 18 + (i % 4) * 20; return <circle key={i} cx={q(190 + rr * Math.cos(a))} cy={q(150 + rr * Math.sin(a))} r="3" fill={C.plus} />; })}
      <Loop r={52} />
      <text x="190" y="36" textAnchor="middle" fill={C.mut} fontSize="13">R = 2 cm</text>
      {phase >= 1 && <text x="320" y="95" fill={C.warn} fontSize="14" fontWeight="700">Iобхв = I·r²/R²</text>}
      {phase >= 2 && <text x="320" y="124" fill={C.ok} fontSize="16" fontWeight="700">Iобхв = 2.5 A</text>}
      {phase >= 3 && <text x="320" y="153" fill={C.minus} fontSize="16" fontWeight="700">B = 50 μT</text>}
    </g>,
    directionQuestion: {
      prompt: "Амперовият контур при r = R/2 обхваща ли целия ток?",
      options: [{ text: "Не — обхваща само тока през вътрешната площ πr²", correct: true }, { text: "Да — всеки контур вътре вижда целите 10 A", correct: false }, { text: "Не обхваща никакъв ток", correct: false }],
      explanation: "Токът е разпределен по сечението. Контурът обхваща само проводниците/плътността вътре в своята площ.",
    },
    additionQuestion: {
      prompt: "Как се изменя B с r вътре при равномерна токова плътност?",
      options: [{ text: "Расте линейно с r", correct: true }, { text: "Намалява като 1/r", correct: false }, { text: "Остава постоянно", correct: false }],
      explanation: "Iобхв ∝ r², а дължината на контура е ∝ r, следователно B ∝ r.",
    },
    hints: ["J = I/(πR²), после Iобхв = J·πr².", "Използвайте B·2πr = μ₀Iобхв."],
    steps: [
      { text: "Намираме частта от тока, обхваната от контура.", latex: String.raw`I_{\text{обхв}}=I\frac{\pi r^2}{\pi R^2}=10\left(\frac{1}{2}\right)^2=2.5\ \mathrm A` },
      { text: "Прилагаме закона на Ампер върху кръга с радиус r.", latex: String.raw`B=\frac{\mu_0I_{\text{обхв}}}{2\pi r}=\frac{\mu_0Ir}{2\pi R^2}` },
      { text: "При r = 0.01 m и R = 0.02 m получаваме 5.0×10⁻⁵ T = 50 μT." },
    ],
    teacherNotes: ["Типичната грешка е заместване на целия I вътре в проводника.", "Свържете графиката: B расте линейно вътре, достига максимум на повърхността, после спада като 1/r."],
  },
  {
    title: "Проектиране на електромагнит",
    statement: "**Електромагнит.** Дълъг соленоид има N = 800 навивки, L = 0.40 m и ток I = 1.2 A. Оценете полето вътре.",
    figure: (phase) => <g>
      {Array.from({ length: 18 }, (_, i) => <ellipse key={i} cx={70 + i * 19} cy="150" rx="10" ry="65" fill="none" stroke={i % 2 ? C.plus : C.warn} strokeWidth="1.5" />)}
      {phase >= 1 && [-24, 0, 24].map((dy) => <Arrow key={dy} x1={85} y1={150 + dy} x2={385} y2={150 + dy} color={C.minus} width={2.2} />)}
      {phase >= 2 && <rect x="115" y="115" width="230" height="70" fill="none" stroke={C.ok} strokeDasharray="7 5" strokeWidth="2" />}
      {phase >= 3 && <text x="240" y="245" fill={C.ok} fontSize="17" fontWeight="700" textAnchor="middle">B ≈ 3.02 mT</text>}
    </g>,
    directionQuestion: {
      prompt: "Къде полето на дълъг соленоид е приблизително равномерно?",
      options: [{ text: "Във вътрешността, далеч от краищата", correct: true }, { text: "Само извън намотката", correct: false }, { text: "Само върху всяка жица", correct: false }],
      explanation: "Вътрешните приноси се усилват, а външните до голяма степен се компенсират.",
    },
    additionQuestion: {
      prompt: "Кои величини увеличават B?",
      options: [{ text: "По-голяма гъстота n = N/L и по-голям ток I", correct: true }, { text: "Само по-голям диаметър", correct: false }, { text: "По-малко навивки при същата дължина", correct: false }],
      explanation: "За дълъг въздушен соленоид B ≈ μ₀nI.",
    },
    hints: ["Първо n = N/L.", "μ₀ = 4π×10⁻⁷ T·m/A."],
    steps: [
      { text: "Изчисляваме броя навивки на метър.", latex: String.raw`n=\frac NL=\frac{800}{0.40}=2000\ \mathrm{m^{-1}}` },
      { text: "Амперовият правоъгълник има една страна вътре и една отвън; външният принос е приблизително нула.", latex: String.raw`BL=\mu_0(nL)I\quad\Rightarrow\quad B=\mu_0nI` },
      { text: "Заместването дава 3.02×10⁻³ T = 3.02 mT." },
    ],
    teacherNotes: ["Различавайте N (общ брой) от n=N/L (линейна гъстота).", "Формулата е приближение за дълъг соленоид; близо до краищата полето не е равномерно."],
  },
  {
    title: "Тороидален индуктор",
    statement: "**Тороид.** Намотка има N = 500 навивки и ток I = 0.8 A. Намерете B на радиус r = 12 cm в сърцевината.",
    figure: (phase) => <g>
      <circle cx="190" cy="150" r="105" fill="rgba(89,173,255,.12)" stroke={C.minus} strokeWidth="2" />
      <circle cx="190" cy="150" r="52" fill={STAGE_BG} stroke={C.minus} strokeWidth="2" />
      {Array.from({ length: 20 }, (_, i) => { const a = i * Math.PI / 10; return <line key={i} x1={q(190 + 52 * Math.cos(a))} y1={q(150 + 52 * Math.sin(a))} x2={q(190 + 105 * Math.cos(a))} y2={q(150 + 105 * Math.sin(a))} stroke={i % 2 ? C.plus : C.warn} strokeWidth="1.5" />; })}
      {phase >= 1 && <Loop r={78} color={C.ok} />}
      {phase >= 2 && <text x="320" y="96" fill={C.warn} fontSize="14" fontWeight="700">Iобхв = N·I = 400 A</text>}
      {phase >= 3 && <text x="320" y="126" fill={C.ok} fontSize="16" fontWeight="700">B = 0.667 mT</text>}
    </g>,
    directionQuestion: {
      prompt: "Какъв амперов контур следва симетрията на тороида?",
      options: [{ text: "Кръг, концентричен с тороида", correct: true }, { text: "Права линия през центъра", correct: false }, { text: "Кръг около отделна навивка", correct: false }],
      explanation: "Полето обикаля по концентрични кръгове вътре в сърцевината.",
    },
    additionQuestion: {
      prompt: "Какъв ток обхваща контурът вътре в сърцевината?",
      options: [{ text: "Сумата от всички навивки: N·I", correct: true }, { text: "Само I от една навивка", correct: false }, { text: "Нула", correct: false }],
      explanation: "Амперовата повърхност е пробита от всеки от N-те проводника, всеки с ток I.",
    },
    hints: ["B·2πr = μ₀NI.", "Преобразувайте 12 cm в 0.12 m."],
    steps: [
      { text: "По концентричния кръг B е тангенциално и с еднаква големина.", latex: String.raw`B(2\pi r)=\mu_0NI` },
      { text: "Изолираме B и заместваме данните.", latex: String.raw`B=\frac{\mu_0NI}{2\pi r}=\frac{4\pi\cdot10^{-7}\cdot500\cdot0.8}{2\pi\cdot0.12}=6.67\cdot10^{-4}\ \mathrm T` },
      { text: "Следователно B ≈ 0.667 mT. Идеалният тороид задържа почти цялото поле в сърцевината." },
    ],
    teacherNotes: ["Учениците често забравят множителя N.", "Сравнете със соленоида: тороидът е соленоид, огънат в затворен пръстен — няма краища и външното поле е още по-слабо."],
  },
];
