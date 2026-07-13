import type { GuidedProblemData } from "./GuidedProblem";
import { Arrow, C } from "./svg";

function FieldMarks({ out = false, x0 = 250, x1 = 460 }: { out?: boolean; x0?: number; x1?: number }) {
  const cols = Math.max(1, Math.floor((x1 - x0) / 45));
  return <g>{Array.from({ length: cols * 5 }, (_, i) => { const x = x0 + 20 + (i % cols) * 45; const y = 50 + Math.floor(i / cols) * 48; return out ? <g key={i} opacity=".55"><circle cx={x} cy={y} r="6" fill="none" stroke={C.minus}/><circle cx={x} cy={y} r="2" fill={C.minus}/></g> : <g key={i} opacity=".55" stroke={C.minus} strokeWidth="1.4"><line x1={x-4} y1={y-4} x2={x+4} y2={y+4}/><line x1={x-4} y1={y+4} x2={x+4} y2={y-4}/></g>; })}</g>;
}

export const lorentzProblems: GuidedProblemData[] = [
  {
    title: "Електронен сноп",
    statement: "**Електронен сноп.** Електрон се движи надясно със скорост 3.0×10⁶ m/s в поле B = 0.20 T, насочено навътре в екрана. Намерете посоката и големината на магнитната сила.",
    figure: (phase) => <g>
      <FieldMarks x0={210} />
      <circle cx="130" cy="150" r="14" fill={C.minus} stroke={C.wire} strokeWidth="2"/><text x="130" y="155" fill={C.wire} textAnchor="middle" fontWeight="700">−</text>
      <Arrow x1={150} y1={150} x2={235} y2={150} color={C.warn} label="v" />
      {phase >= 1 && <Arrow x1={130} y1={150} x2={130} y2={235} color={C.ok} label="Fᴮ" />}
      {phase >= 2 && <text x="28" y="42" fill={C.mut} fontSize="13">за +q силата би била нагоре</text>}
      {phase >= 3 && <text x="28" y="270" fill={C.ok} fontSize="16" fontWeight="700">|Fᴮ| = 9.61×10⁻¹⁴ N</text>}
    </g>,
    directionQuestion: { prompt: "Първо за положителен заряд: накъде сочи v×B?", options: [{text:"Нагоре",correct:true},{text:"Надолу",correct:false},{text:"Надясно",correct:false}], explanation:"Дясно × навътре дава нагоре според правилото на дясната ръка." },
    additionQuestion: { prompt: "Електронът е отрицателен. Какво става с посоката?", options: [{text:"Обръща се надолу",correct:true},{text:"Остава нагоре",correct:false},{text:"Силата става нула",correct:false}], explanation:"Векторното произведение дава посоката за +q. Умножението по отрицателен q обръща силата." },
    hints: ["Използвайте |Fᴮ|=|q|vB, защото v⊥B.", "|e|=1.602×10⁻¹⁹ C."],
    steps: [
      {text:"Ъгълът е 90°, следователно sinθ=1.",latex:String.raw`|F_B|=|q|vB\sin90^\circ`},
      {text:"Заместваме заряда на електрона, скоростта и полето.",latex:String.raw`|F_B|=1.602\cdot10^{-19}\cdot3.0\cdot10^6\cdot0.20=9.61\cdot10^{-14}\ \mathrm N`},
      {text:"Посоката е **надолу** — обратна на v×B, защото зарядът е отрицателен."},
    ],
    teacherNotes:["Изисквайте винаги двустъпков ритуал: първо +q с дясната ръка, после знакът на реалния заряд.","Не позволявайте посоката да се извежда от рисунка на траектория преди силата."],
  },
  {
    title: "Селектор на скорости",
    statement: "**Селектор на скорости.** Йони минават през взаимно перпендикулярни полета E = 3.0×10⁴ V/m и B = 0.15 T. С каква скорост ще преминат без отклонение?",
    figure: (phase) => <g>
      <line x1="65" y1="65" x2="420" y2="65" stroke={C.plus} strokeWidth="4"/><line x1="65" y1="235" x2="420" y2="235" stroke={C.minus} strokeWidth="4"/>
      {[115,180,245,310,375].map((x)=><Arrow key={x} x1={x} y1={90} x2={x} y2={132} color={C.plus} width={1.8}/>) }
      <FieldMarks x0={70} x1={420} />
      <circle cx="90" cy="150" r="12" fill={C.plus} stroke={C.wire}/><text x="90" y="155" fill={C.wire} textAnchor="middle">+</text>
      <Arrow x1={106} y1={150} x2={175} y2={150} color={C.warn} label="v"/>
      {phase>=1&&<><Arrow x1={235} y1={150} x2={235} y2={105} color={C.ok} label="Fᴱ"/><Arrow x1={265} y1={150} x2={265} y2={195} color={C.minus} label="Fᴮ"/></>}
      {phase>=2&&<text x="440" y="150" fill={C.ok} fontSize="14" fontWeight="700">Fᴱ + Fᴮ = 0</text>}
      {phase>=3&&<text x="240" y="278" textAnchor="middle" fill={C.warn} fontSize="16" fontWeight="700">v = E/B = 2.0×10⁵ m/s</text>}
    </g>,
    directionQuestion:{prompt:"Как трябва да са насочени електричната и магнитната сила за частица без отклонение?",options:[{text:"В противоположни посоки",correct:true},{text:"В една и съща посока",correct:false},{text:"И двете по скоростта",correct:false}],explanation:"Равномерното движение изисква нулева резултантна напречна сила."},
    additionQuestion:{prompt:"Кое условие избира точната скорост?",options:[{text:"qE=qvB",correct:true},{text:"qE+qvB=2qE",correct:false},{text:"E=v/B",correct:false}],explanation:"Големините на противоположните сили трябва да са равни. Зарядът се съкращава."},
    hints:["При v⊥B магнитната сила е qvB.","1 V/m = 1 N/C."],
    steps:[{text:"При липса на отклонение силите се компенсират.",latex:String.raw`qE=qvB`},{text:"Съкращаваме q и изолираме скоростта.",latex:String.raw`v=\frac EB=\frac{3.0\cdot10^4}{0.15}=2.0\cdot10^5\ \mathrm{m/s}`},{text:"Резултатът не зависи от масата и заряда — селекторът пропуска всяка частица с тази скорост."}],
    teacherNotes:["Това е добър пример защо пълната формула съдържа E+v×B.","Питайте какво става при по-бърза частица: магнитната сила надделява."],
  },
  {
    title: "Масспектрометър",
    statement: "**Масспектрометър.** Еднократно йонизиран неонов йон с маса 20 u влиза перпендикулярно в B = 0.50 T със скорост 2.0×10⁵ m/s. Намерете радиуса на траекторията.",
    figure:(phase)=><g><FieldMarks/><circle cx="75" cy="210" r="12" fill={C.plus} stroke={C.wire}/><text x="75" y="215" fill={C.wire} textAnchor="middle">+</text><Arrow x1={90} y1={210} x2={160} y2={210} color={C.warn} label="v"/><path d="M75 210 C190 210 210 95 210 42" fill="none" stroke={phase>=1?C.warn:C.faint} strokeWidth="3" strokeDasharray={phase>=1?undefined:"7 5"}/>{phase>=2&&<line x1="210" y1="210" x2="210" y2="98" stroke={C.faint} strokeDasharray="5 4"/>}{phase>=2&&<text x="222" y="155" fill={C.mut} fontSize="13">r</text>}{phase>=3&&<text x="295" y="95" fill={C.ok} fontSize="17" fontWeight="700">r = 8.29 cm</text>}</g>,
    directionQuestion:{prompt:"Как е насочена магнитната сила спрямо скоростта по траекторията?",options:[{text:"Винаги към центъра на кривината",correct:true},{text:"По допирателната",correct:false},{text:"Винаги нагоре",correct:false}],explanation:"Fᴮ е перпендикулярна на моментната v и играе ролята на центростремителна сила."},
    additionQuestion:{prompt:"Как ще се промени радиусът за по-тежък йон при същите v, q и B?",options:[{text:"Ще стане по-голям",correct:true},{text:"Ще стане по-малък",correct:false},{text:"Няма да се промени",correct:false}],explanation:"r=mv/(|q|B), следователно радиусът е пропорционален на масата."},
    hints:["Приравнете |q|vB и mv²/r.","1 u=1.6605×10⁻²⁷ kg."],
    steps:[{text:"Магнитната сила е центростремителна.",latex:String.raw`|q|vB=\frac{mv^2}{r}`},{text:"Съкращаваме едно v и изолираме r.",latex:String.raw`r=\frac{mv}{|q|B}`},{text:"Заместваме m=20u и q=e.",latex:String.raw`r=\frac{20(1.6605\cdot10^{-27})(2.0\cdot10^5)}{(1.602\cdot10^{-19})(0.50)}=0.0829\ \mathrm m=8.29\ \mathrm{cm}`}],
    teacherNotes:["Това е тийзър към следващия урок за движение по окръжност.","Питайте как уредът различава изотопи: различната маса дава различен радиус."],
  },
  {
    title: "Сила върху проводник",
    statement: "**Проводник в мотор.** Прав участък с дължина L = 0.20 m носи ток I = 5.0 A перпендикулярно на поле B = 0.40 T. Намерете магнитната сила.",
    figure:(phase)=><g><FieldMarks x0={230}/><line x1="75" y1="220" x2="75" y2="80" stroke={C.plus} strokeWidth="7"/><Arrow x1={75} y1={205} x2={75} y2={95} color={C.warn} label="I"/>{phase>=1&&<Arrow x1={95} y1={150} x2={190} y2={150} color={C.ok} label="F"/>}{phase>=2&&<text x="260" y="255" fill={C.mut} fontSize="13">всички движещи се заряди дават сили в една посока</text>}{phase>=3&&<text x="260" y="82" fill={C.ok} fontSize="17" fontWeight="700">F = 0.40 N</text>}</g>,
    directionQuestion:{prompt:"Как намираме посоката на силата върху проводника?",options:[{text:"От I×B с правилото на дясната ръка",correct:true},{text:"Винаги по тока",correct:false},{text:"Винаги срещу тока",correct:false}],explanation:"Посоката на условния ток замества средната посока на положителните заряди."},
    additionQuestion:{prompt:"Защо силите върху отделните носители се събират?",options:[{text:"Те имат еднаква средна дрейфова посока в един и същ участък",correct:true},{text:"Магнитното поле им увеличава заряда",correct:false},{text:"Проводникът няма електрони",correct:false}],explanation:"Сумирането на qv×B за носителите води до макроскопичната формула IL×B."},
    hints:["F=ILB sinθ.","Тук θ=90°."],
    steps:[{text:"Макроскопичната формула следва от сумата на силите на Лоренц върху носителите.",latex:String.raw`\vec F=I\vec L\times\vec B`},{text:"Понеже проводникът е перпендикулярен на полето, sin90°=1.",latex:String.raw`F=ILB=5.0\cdot0.20\cdot0.40=0.40\ \mathrm N`},{text:"Това е силата, която задвижва проводящата рамка в прост електромотор."}],
    teacherNotes:["Уточнете, че L е вектор по условния ток.","Свържете микроскопичната сила qv×B с наблюдаемото движение на цял проводник."],
  },
];
