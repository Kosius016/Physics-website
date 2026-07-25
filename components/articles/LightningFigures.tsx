import SvgTex from "@/components/interactives/SvgTex";
import { C, STAGE_BG, STAGE_CLASS } from "@/components/interactives/svg";

/**
 * Обяснителните чертежи към статията за мълнията.
 *
 * Само SVG (виж CLAUDE.md §4): тъмна сцена, споделената палитра `C.*`,
 * величините минават през `SvgTex`, а българският текст в сцената е само
 * кратки главни надписи.
 */

const FONT = "var(--font-sans), system-ui, sans-serif";

/**
 * Сцената не се смалява под ~540 px, иначе надписите в нея стават нечетими на
 * телефон. Под тази ширина се плъзга хоризонтално в собствената си рамка —
 * самата страница остава без хоризонтален скрол.
 */
function Scene({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[540px]">{children}</div>
    </div>
  );
}

function Cap({
  x,
  y,
  children,
  color = C.mut,
  size = 11.5,
  anchor = "start",
}: {
  x: number;
  y: number;
  children: string;
  color?: string;
  size?: number;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      fill={color}
      fontSize={size}
      fontWeight={700}
      letterSpacing="0.08em"
      textAnchor={anchor}
      fontFamily={FONT}
    >
      {children}
    </text>
  );
}

function Plus({ x, y, r = 7, color = C.plus, opacity = 1 }: { x: number; y: number; r?: number; color?: string; opacity?: number }) {
  return (
    <g stroke={color} strokeWidth={r / 3} strokeLinecap="round" opacity={opacity}>
      <line x1={x - r} y1={y} x2={x + r} y2={y} />
      <line x1={x} y1={y - r} x2={x} y2={y + r} />
    </g>
  );
}

function Minus({ x, y, r = 7, color = C.minus, opacity = 1 }: { x: number; y: number; r?: number; color?: string; opacity?: number }) {
  return (
    <line x1={x - r} y1={y} x2={x + r} y2={y} stroke={color} strokeWidth={r / 3} strokeLinecap="round" opacity={opacity} />
  );
}

/* ------------------------------------------------------------------ */
/* §1 — Зарядите в буреносния облак                                    */
/* ------------------------------------------------------------------ */

export function CloudChargeDiagram() {
  const cloud = "rgba(242,239,245,0.09)";

  return (
    <Scene>
      <svg
        viewBox="0 0 660 430"
        className={STAGE_CLASS}
        role="img"
        aria-label="Разрез на буреносен облак: положителен заряд горе, отрицателен в долната част, индуциран положителен заряд по земята"
      >
        <title>Разпределение на заряда в буреносен облак</title>
        <rect width={660} height={430} fill={STAGE_BG} />

        {/* Облакът */}
        <g fill={cloud} stroke={C.faint} strokeWidth={1.2}>
          <ellipse cx={150} cy={128} rx={98} ry={62} />
          <ellipse cx={270} cy={98} rx={112} ry={68} />
          <ellipse cx={385} cy={132} rx={98} ry={60} />
          <rect x={45} y={150} width={400} height={112} rx={44} />
        </g>

        {/* Нулевата изотерма */}
        <line x1={45} y1={168} x2={462} y2={168} stroke={C.faint} strokeWidth={1.4} strokeDasharray="7 6" />
        <SvgTex x={478} y={168} tex={String.raw`0^{\circ}\mathrm{C}`} color={C.mut} fontSize={13} width={70} />

        {/* Възходящо течение */}
        <g stroke={C.warn} strokeWidth={2.4} strokeLinecap="round" opacity={0.85} fill="none">
          <path d="M96 250 C 84 210, 104 190, 92 150 C 84 122, 100 108, 94 84" />
          <path d="M94 84 l -8 14 M94 84 l 9 13" />
        </g>
        <Cap x={45} y={296} size={10.5}>ВЪЗХОДЯЩО ТЕЧЕНИЕ</Cap>

        {/* Положителна област — леки ледени кристали */}
        <g>
          <Plus x={175} y={104} />
          <Plus x={240} y={88} />
          <Plus x={305} y={96} />
          <Plus x={368} y={92} />
          <Plus x={420} y={112} />
        </g>
        <Cap x={498} y={100} color={C.plus} size={11}>ЛЕДЕНИ КРИСТАЛИ</Cap>
        <Cap x={498} y={116} size={10}>леки, отиват нагоре</Cap>

        {/* Отрицателна област — граупел */}
        <g>
          <Minus x={148} y={214} />
          <Minus x={215} y={226} />
          <Minus x={284} y={216} />
          <Minus x={352} y={228} />
          <Minus x={416} y={214} />
        </g>
        <Cap x={498} y={216} color={C.minus} size={11}>ГРАУПЕЛ</Cap>
        <Cap x={498} y={232} size={10}>тежък, остава ниско</Cap>

        {/* Малката положителна област в основата */}
        <g>
          <Plus x={252} y={256} r={5} opacity={0.75} />
          <Plus x={288} y={258} r={5} opacity={0.75} />
        </g>

        {/* Потенциална разлика */}
        <g stroke={C.ok} strokeWidth={2} strokeLinecap="round" opacity={0.9}>
          <line x1={196} y1={278} x2={196} y2={358} />
          <path d="M196 278 l -6 11 M196 278 l 6 11 M196 358 l -6 -11 M196 358 l 6 -11" />
        </g>
        <SvgTex x={212} y={318} tex={String.raw`\sim 10^{8}\ \mathrm{V}`} color={C.ok} fontSize={14} width={110} />

        {/* Земя */}
        <line x1={30} y1={382} x2={630} y2={382} stroke={C.wire} strokeWidth={2.2} />
        <rect x={30} y={382} width={600} height={28} fill="rgba(242,239,245,0.06)" />
        <g>
          <Plus x={110} y={368} r={5.5} />
          <Plus x={190} y={368} r={5.5} />
          <Plus x={270} y={368} r={5.5} />
          <Plus x={350} y={368} r={5.5} />
          <Plus x={430} y={368} r={5.5} />
        </g>
        <Cap x={498} y={372} color={C.plus} size={10.5}>ИНДУЦИРАН ЗАРЯД</Cap>
      </svg>
    </Scene>
  );
}

/* ------------------------------------------------------------------ */
/* §3 — Четирите фази                                                  */
/* ------------------------------------------------------------------ */

function StageFrame({
  x,
  y,
  title,
  children,
}: {
  x: number;
  y: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={300} height={234} rx={10} fill="rgba(242,239,245,0.035)" stroke={C.faint} strokeWidth={1.2} />
      <Cap x={16} y={26} size={11}>{title}</Cap>
      {children}
      <line x1={20} y1={200} x2={280} y2={200} stroke={C.wire} strokeWidth={1.8} opacity={0.75} />
    </g>
  );
}

function MiniCloud({ opacity = 1 }: { opacity?: number }) {
  return (
    <g opacity={opacity}>
      <g fill="rgba(242,239,245,0.09)" stroke={C.faint} strokeWidth={1.1}>
        <ellipse cx={110} cy={62} rx={58} ry={26} />
        <ellipse cx={170} cy={56} rx={62} ry={28} />
        <rect x={54} y={62} width={176} height={30} rx={15} />
      </g>
    </g>
  );
}

export function LightningStagesDiagram() {
  const leader2 = "M150 94 L140 112 L153 126 L138 145 L147 160";
  const branch2 = "M153 126 L177 141 L172 154";
  const leader3 = "M150 94 L140 112 L153 126 L138 145 L147 160 L160 172";
  const channel4 = "M150 92 L140 112 L153 126 L138 145 L149 161 L166 178 L180 200";

  return (
    <Scene>
      <svg
        viewBox="0 0 620 490"
        className={STAGE_CLASS}
        role="img"
        aria-label="Четири фази на мълнията: разделяне на заряда, стъпаловиден лидер, среща с възходящ стример и възвратен удар"
      >
        <title>Как се образува мълнията — четири фази</title>
        <rect width={620} height={490} fill={STAGE_BG} />

        <StageFrame x={8} y={8} title="1 · ЗАРЯД В ОБЛАКА">
          <MiniCloud />
          <Plus x={112} y={54} r={5} />
          <Plus x={150} y={50} r={5} />
          <Plus x={188} y={54} r={5} />
          <Minus x={120} y={84} r={5} />
          <Minus x={155} y={86} r={5} />
          <Minus x={192} y={84} r={5} />
          <Plus x={110} y={190} r={5} />
          <Plus x={150} y={190} r={5} />
          <Plus x={190} y={190} r={5} />
        </StageFrame>

        <StageFrame x={312} y={8} title="2 · СТЪПАЛОВИДЕН ЛИДЕР">
          <MiniCloud opacity={0.55} />
          <g fill="none" stroke={C.minus} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
            <path d={leader2} />
            <path d={branch2} opacity={0.6} />
          </g>
          <circle cx={147} cy={160} r={9} fill={C.minus} opacity={0.16} />
          <Plus x={110} y={190} r={5} opacity={0.55} />
          <Plus x={150} y={190} r={5} opacity={0.55} />
          <Plus x={190} y={190} r={5} opacity={0.55} />
        </StageFrame>

        <StageFrame x={8} y={248} title="3 · ВЪЗХОДЯЩ СТРИМЕР">
          <MiniCloud opacity={0.45} />
          <g fill="none" stroke={C.minus} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
            <path d={leader3} />
            <path d={branch2} opacity={0.45} />
          </g>
          {/* дърво / висок обект */}
          <path d="M182 200 L182 182" stroke={C.wire} strokeWidth={2} opacity={0.7} />
          <path d="M172 184 L182 166 L192 184 Z" fill="rgba(242,239,245,0.14)" stroke={C.wire} strokeWidth={1.2} opacity={0.7} />
          <g fill="none" stroke={C.plus} strokeWidth={2.2} strokeLinecap="round">
            <path d="M182 166 L176 178 M182 166 L172 172 M182 166 L166 176" transform="rotate(180 182 166)" />
          </g>
          <circle cx={165} cy={176} r={12} fill={C.warn} opacity={0.22} />
          <circle cx={165} cy={176} r={4} fill={C.warn} />
        </StageFrame>

        <StageFrame x={312} y={248} title="4 · ВЪЗВРАТЕН УДАР">
          <MiniCloud opacity={0.5} />
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d={channel4} stroke={C.warn} strokeWidth={9} opacity={0.2} />
            <path d={channel4} stroke={C.warn} strokeWidth={3.4} />
            <path d="M153 126 L177 141 L172 154" stroke={C.warn} strokeWidth={2} opacity={0.55} />
          </g>
          <g stroke={C.ok} strokeWidth={2.2} strokeLinecap="round" fill="none">
            <line x1={232} y1={190} x2={232} y2={108} />
            <path d="M232 108 l -6 12 M232 108 l 6 12" />
          </g>
          <SvgTex x={232} y={218} tex={String.raw`\sim 10^{8}\ \mathrm{m/s}`} color={C.ok} fontSize={13} width={110} anchor="middle" />
        </StageFrame>
      </svg>
    </Scene>
  );
}

/* ------------------------------------------------------------------ */
/* §6 — Каскадата от частици                                           */
/* ------------------------------------------------------------------ */

export function ParticleCascadeDiagram() {
  return (
    <Scene>
      <svg
        viewBox="0 0 660 210"
        className={STAGE_CLASS}
        role="img"
        aria-label="Верига: ускорен електрон се отклонява от молекула, излъчва рентгенов квант, а енергичният фотон ражда двойка електрон и позитрон"
      >
        <title>От ускорен електрон до антиматерия</title>
        <rect width={660} height={210} fill={STAGE_BG} />

        {/* 1 — ускорен електрон */}
        <circle cx={70} cy={92} r={9} fill={C.minus} />
        <SvgTex x={70} y={64} tex="e^-" color={C.minus} fontSize={14} width={40} anchor="middle" />
        <g stroke={C.minus} strokeWidth={2.2} strokeLinecap="round" fill="none">
          <line x1={86} y1={92} x2={168} y2={92} />
          <path d="M168 92 l -12 -6 M168 92 l -12 6" />
        </g>
        <Cap x={70} y={150} size={10.5} anchor="middle">УСКОРЕН</Cap>
        <Cap x={70} y={166} size={10.5} anchor="middle">ЕЛЕКТРОН</Cap>

        {/* 2 — отклонение от молекула */}
        <circle cx={198} cy={92} r={17} fill="rgba(242,239,245,0.10)" stroke={C.faint} strokeWidth={1.3} />
        <g stroke={C.minus} strokeWidth={2.2} strokeLinecap="round" fill="none" opacity={0.8}>
          <path d="M215 88 C 240 78, 254 96, 276 74" />
        </g>
        <Cap x={198} y={150} size={10.5} anchor="middle">МОЛЕКУЛА</Cap>
        <Cap x={198} y={166} size={10.5} anchor="middle">ВЪЗДУХ</Cap>

        {/* 3 — спирачно лъчение */}
        <path
          d="M222 108 q 12 14 24 0 q 12 -14 24 0 q 12 14 24 0 q 12 -14 24 0 q 12 14 24 0"
          fill="none"
          stroke={C.warn}
          strokeWidth={2.4}
          strokeLinecap="round"
        />
        <SvgTex x={370} y={108} tex={String.raw`\gamma`} color={C.warn} fontSize={16} width={30} />
        <Cap x={340} y={150} size={10.5} anchor="middle">СПИРАЧНО ЛЪЧЕНИЕ</Cap>
        <Cap x={340} y={166} size={10.5} anchor="middle">РЕНТГЕН И ГАМА</Cap>

        {/* 4 — раждане на двойка */}
        <g stroke={C.faint} strokeWidth={1.4} strokeDasharray="5 5">
          <line x1={432} y1={40} x2={432} y2={140} />
        </g>
        <g fill="none" strokeWidth={2.2} strokeLinecap="round">
          <path d="M446 92 C 478 92, 500 76, 540 62" stroke={C.minus} />
          <path d="M446 92 C 478 92, 500 108, 540 122" stroke={C.plus} />
        </g>
        <circle cx={548} cy={60} r={8} fill={C.minus} />
        <circle cx={548} cy={124} r={8} fill={C.plus} />
        <SvgTex x={570} y={60} tex="e^-" color={C.minus} fontSize={14} width={40} />
        <SvgTex x={570} y={124} tex="e^+" color={C.plus} fontSize={14} width={40} />
        <Cap x={534} y={166} size={10.5} anchor="middle">ЧАСТИЦА И АНТИЧАСТИЦА</Cap>
      </svg>
    </Scene>
  );
}

/* ------------------------------------------------------------------ */
/* §4 — Инфографика за безопасност                                     */
/* ------------------------------------------------------------------ */

type SafetyIcon = "home" | "tree" | "peak" | "plug" | "clock" | "ruler";

const ICONS: Record<SafetyIcon, React.ReactNode> = {
  home: <path d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />,
  tree: (
    <>
      <path d="M12 3 6 12h12zM12 9l-4 6h8zM12 15v5" />
      <path d="M4 4 20 20" />
    </>
  ),
  peak: <path d="M2 19 9 7l4 6 2.5-3.5L22 19z" />,
  plug: (
    <>
      <path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0z" />
      <path d="M12 17v4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  ruler: (
    <>
      <path d="M3 12h18" />
      <path d="M3 8v8M21 8v8M9 10v4M15 10v4" />
    </>
  ),
};

const SAFETY: { icon: SafetyIcon; rule: string; why: string }[] = [
  {
    icon: "home",
    rule: "Чуете ли гръм — влезте вътре",
    why: "Сграда с инсталации или автомобил с твърд метален покрив отвежда тока по обвивката си.",
  },
  {
    icon: "tree",
    rule: "Никога под самотно дърво",
    why: "Високото и остро тяло усилва полето около себе си и точно от него тръгват възходящи стримери.",
  },
  {
    icon: "peak",
    rule: "Слезте от билото, излезте от водата",
    why: "На открито и високо най-издаденият предмет сте вие.",
  },
  {
    icon: "plug",
    rule: "Вътре: далеч от кабели и тръби",
    why: "Токът може да пропътува дълъг път по проводящите инсталации на сградата.",
  },
  {
    icon: "ruler",
    rule: "Три секунди ≈ един километър",
    why: "Толкова изостава звукът след светкавицата. Кратката пауза значи, че бурята е над вас.",
  },
  {
    icon: "clock",
    rule: "Изчакайте 30 минути след последния гръм",
    why: "Разрядите могат да тръгнат и от края на облака, доста след като дъждът е спрял.",
  },
];

export function SafetyInfographic() {
  return (
    <div className="rounded-xl border-[1.5px] border-ink bg-surface p-5 shadow-hard">
      <p className="text-[11.5px] font-bold uppercase tracking-[0.16em] text-plus">Ако чуете гръм</p>
      <h3 className="mt-1 font-serif text-[21px] font-bold leading-snug text-ink">
        Шест правила, които следват от физиката горе
      </h3>
      <ul className="mt-4 grid gap-x-5 gap-y-4 sm:grid-cols-2">
        {SAFETY.map((s) => (
          <li key={s.rule} className="flex gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-[1.5px] border-ink bg-hl text-ink">
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor"
                strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                {ICONS[s.icon]}
              </svg>
            </span>
            <span className="min-w-0">
              <span className="block text-[15px] font-bold leading-snug text-ink">{s.rule}</span>
              <span className="mt-0.5 block text-[13.5px] leading-snug text-muted">{s.why}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
