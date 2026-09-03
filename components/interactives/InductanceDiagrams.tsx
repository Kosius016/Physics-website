import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import {
  Arrow,
  C,
  CurrentSymbol,
  DRAWING_FONT_FAMILY,
  STAGE_BG,
  STAGE_CLASS,
} from "./svg";

const W = 640;
const H = 340;
const q = (value: number) => Math.round(value * 100) / 100;
const DRAWING_STYLE = { fontFamily: DRAWING_FONT_FAMILY } as const;

function Stage({ title }: { title: string }) {
  return (
    <>
      <rect width={W} height={H} fill={STAGE_BG} />
      {Array.from({ length: Math.ceil(W / 25) }, (_, i) => (
        <line
          key={`v-${i}`}
          x1={i * 25}
          y1="0"
          x2={i * 25}
          y2={H}
          stroke={C.faint}
          opacity="0.1"
        />
      ))}
      {Array.from({ length: Math.ceil(H / 25) }, (_, i) => (
        <line
          key={`h-${i}`}
          x1="0"
          y1={i * 25}
          x2={W}
          y2={i * 25}
          stroke={C.faint}
          opacity="0.1"
        />
      ))}
      <text
        x="24"
        y="30"
        fill={C.mut}
        fontSize="12"
        fontWeight="600"
        letterSpacing="0.035em"
      >
        {title}
      </text>
    </>
  );
}

function MagneticFieldRing({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={C.minus}
        strokeWidth="2.2"
        strokeOpacity="0.86"
      />
      <polygon
        points={`${cx + r},${cy - 12} ${cx + r - 6},${cy + 1} ${cx + r + 6},${cy + 1}`}
        fill={C.minus}
      />
    </g>
  );
}

function Resistor({
  x1,
  x2,
  y,
  color = C.warn,
}: {
  x1: number;
  x2: number;
  y: number;
  color?: string;
}) {
  const lead = 12;
  const innerLeft = x1 + lead;
  const innerRight = x2 - lead;
  const segment = (innerRight - innerLeft) / 8;
  const points = [
    `${x1},${y}`,
    `${innerLeft},${y}`,
    ...Array.from({ length: 7 }, (_, index) => {
      const x = innerLeft + segment * (index + 1);
      const yOffset = index % 2 === 0 ? -13 : 13;
      return `${q(x)},${y + yOffset}`;
    }),
    `${innerRight},${y}`,
    `${x2},${y}`,
  ].join(" ");
  return <polyline points={points} fill="none" stroke={color} strokeWidth="3" />;
}

function Coil({
  x1,
  x2,
  y,
  color = C.minus,
}: {
  x1: number;
  x2: number;
  y: number;
  color?: string;
}) {
  const loops = 5;
  const loopWidth = (x2 - x1 - 24) / loops;
  const path = Array.from({ length: loops }, (_, index) => {
    const x = x1 + 12 + index * loopWidth;
    return `C ${q(x + loopWidth * 0.22)} ${y - 25}, ${q(x + loopWidth * 0.78)} ${y - 25}, ${q(x + loopWidth)} ${y}`;
  }).join(" ");
  return (
    <path
      d={`M ${x1} ${y} L ${x1 + 12} ${y} ${path} L ${x2} ${y}`}
      fill="none"
      stroke={color}
      strokeWidth="3"
    />
  );
}

function Battery({ x, y1, y2 }: { x: number; y1: number; y2: number }) {
  const cy = (y1 + y2) / 2;
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={cy - 24} stroke={C.wire} strokeWidth="3" />
      <line x1={x} y1={cy + 24} x2={x} y2={y2} stroke={C.wire} strokeWidth="3" />
      <line x1={x - 25} y1={cy - 24} x2={x + 25} y2={cy - 24} stroke={C.plus} strokeWidth="4" />
      <line x1={x - 14} y1={cy + 24} x2={x + 14} y2={cy + 24} stroke={C.minus} strokeWidth="4" />
      <SvgTex x={x + 37} y={cy - 23} tex="+" color={C.plus} fontSize={15} width={18} />
      <SvgTex x={x + 37} y={cy + 25} tex="-" color={C.minus} fontSize={15} width={18} />
    </g>
  );
}

export function BasicInductorCircuitDiagram() {
  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={`${STAGE_CLASS} select-none`}
        style={DRAWING_STYLE}
        role="img"
        aria-label="Последователна верига с батерия, резистор и намотка и избрана положителна посока на тока"
      >
        <Stage title="ОПОРНА СХЕМА · БАТЕРИЯ, РЕЗИСТОР И НАМОТКА" />
        <line x1="105" y1="100" x2="195" y2="100" stroke={C.wire} strokeWidth="3" />
        <Resistor x1={195} x2={315} y={100} />
        <line x1="315" y1="100" x2="395" y2="100" stroke={C.wire} strokeWidth="3" />
        <Coil x1={395} x2={535} y={100} />
        <line x1="535" y1="100" x2="535" y2="260" stroke={C.wire} strokeWidth="3" />
        <line x1="535" y1="260" x2="105" y2="260" stroke={C.wire} strokeWidth="3" />
        <Battery x={105} y1={100} y2={260} />
        <Arrow
          x1={135}
          y1={75}
          x2={260}
          y2={75}
          color={C.ok}
          width={2.6}
          texLabel="I(t)>0"
          texLabelDy={-9}
          texLabelWidth={64}
        />
        <SvgTex x={255} y={139} tex="R" color={C.warn} fontSize={17} width={24} anchor="middle" />
        <SvgTex x={465} y={139} tex="L" color={C.minus} fontSize={17} width={24} anchor="middle" />
        <SvgTex x={55} y={185} tex="\mathcal E" color={C.plus} fontSize={17} width={40} />
        <Arrow
          x1={390}
          y1={210}
          x2={260}
          y2={210}
          color={C.minus}
          width={2.8}
          texLabel="\mathcal E_L"
          texLabelDx={15}
          texLabelDy={-12}
          texLabelWidth={62}
          texLabelAnchor="middle"
        />
        <text x="320" y="310" textAnchor="middle" fill={C.mut} fontSize="12" fontWeight="600">
          ЗНАКЪТ НА ЕДН СЕ ОПРЕДЕЛЯ ОТ ИЗБРАНАТА ПОСОКА НА ТОКА
        </text>
      </svg>
      <figcaption className="mt-2 text-[13px] leading-relaxed text-muted">
        Зелената стрелка е нашата положителна посока. При <RichText text="$dI/dt>0$" />{" "}
        индуцираното ЕДН е обратно на нея; при <RichText text="$dI/dt<0$" /> се опитва да
        запази тока в същата посока.
      </figcaption>
    </figure>
  );
}

export function SwitchingRLCircuitDiagram() {
  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={`${STAGE_CLASS} select-none`}
        style={DRAWING_STYLE}
        role="img"
        aria-label="RL верига с двупозиционен ключ за включване към батерия и разреждане през резистор"
      >
        <Stage title="RL ПРЕХОДЕН ПРОЦЕС · ДВЕ ПОЛОЖЕНИЯ НА КЛЮЧА" />
        <circle cx="160" cy="105" r="6" fill={C.plus} />
        <circle cx="160" cy="235" r="6" fill={C.minus} />
        <circle cx="225" cy="170" r="7" fill={C.wire} />
        <line x1="225" y1="170" x2="166" y2="111" stroke={C.ok} strokeWidth="4" strokeLinecap="round" />
        <line x1="225" y1="170" x2="285" y2="170" stroke={C.wire} strokeWidth="3" />
        <Resistor x1={285} x2={395} y={170} />
        <Coil x1={395} x2={535} y={170} />
        <line x1="535" y1="170" x2="535" y2="285" stroke={C.wire} strokeWidth="3" />
        <line x1="535" y1="285" x2="105" y2="285" stroke={C.wire} strokeWidth="3" />
        <line x1="105" y1="105" x2="160" y2="105" stroke={C.wire} strokeWidth="3" />
        <Battery x={105} y1={105} y2={285} />
        <line x1="160" y1="235" x2="160" y2="285" stroke={C.wire} strokeWidth="3" />
        <line
          x1="225"
          y1="170"
          x2="166"
          y2="229"
          stroke={C.minus}
          strokeWidth="3"
          strokeDasharray="7 6"
          opacity="0.55"
          strokeLinecap="round"
        />
        <SvgTex x={151} y={77} tex="1" color={C.plus} fontSize={15} width={18} anchor="middle" />
        <SvgTex x={178} y={217} tex="2" color={C.minus} fontSize={15} width={18} anchor="middle" />
        <SvgTex x={340} y={139} tex="R" color={C.warn} fontSize={16} width={24} anchor="middle" />
        <SvgTex x={466} y={139} tex="L" color={C.minus} fontSize={16} width={24} anchor="middle" />
        <Arrow
          x1={280}
          y1={120}
          x2={405}
          y2={120}
          color={C.ok}
          width={2.5}
          texLabel="I(t)"
          texLabelDy={-10}
          texLabelWidth={46}
        />
        <text x="320" y="319" textAnchor="middle" fill={C.mut} fontSize="12" fontWeight="600">
          1 · НАРАСТВАНЕ С ИЗТОЧНИК    2 · ЗАТИХВАНЕ В ЗАТВОРЕН КОНТУР
        </text>
      </svg>
      <figcaption className="mt-2 text-[13px] leading-relaxed text-muted">
        Плътната зелена линия е ключът в положение 1: батерията, резисторът и индукторът
        образуват един последователен път. Пунктираната синя линия показва другото възможно
        положение на същото подвижно рамо, а не втори постоянен проводник. В положение 2
        батерията е извадена, но резисторът и индукторът остават в затворен контур.
      </figcaption>
    </figure>
  );
}

export function OscillationCircuitDiagram({ mode }: { mode: "lc" | "rlc" }) {
  const hasResistance = mode === "rlc";
  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={`${STAGE_CLASS} select-none`}
        style={DRAWING_STYLE}
        role="img"
        aria-label={`${hasResistance ? "RLC" : "LC"} контур с означени заряд, ток и напрежения`}
      >
        <Stage title={`${hasResistance ? "RLC" : "LC"} КОНТУР · ЗНАЦИ И ПОСОКА НА ОБХОЖДАНЕ`} />
        <line x1="105" y1="95" x2={hasResistance ? 190 : 360} y2="95" stroke={C.wire} strokeWidth="3" />
        {hasResistance ? (
          <>
            <Resistor x1={190} x2={310} y={95} />
            <line x1="310" y1="95" x2="535" y2="95" stroke={C.wire} strokeWidth="3" />
            <SvgTex x={250} y={132} tex="R" color={C.warn} fontSize={16} width={24} anchor="middle" />
          </>
        ) : (
          <line x1="360" y1="95" x2="535" y2="95" stroke={C.wire} strokeWidth="3" />
        )}
        <line x1="535" y1="95" x2="535" y2="160" stroke={C.wire} strokeWidth="3" />
        <line x1="510" y1="160" x2="560" y2="160" stroke={C.plus} strokeWidth="4" />
        <line x1="510" y1="202" x2="560" y2="202" stroke={C.minus} strokeWidth="4" />
        <line x1="535" y1="202" x2="535" y2="265" stroke={C.wire} strokeWidth="3" />
        <line x1="535" y1="265" x2="360" y2="265" stroke={C.wire} strokeWidth="3" />
        <Coil x1={220} x2={360} y={265} />
        <line x1="220" y1="265" x2="105" y2="265" stroke={C.wire} strokeWidth="3" />
        <line x1="105" y1="265" x2="105" y2="95" stroke={C.wire} strokeWidth="3" />
        <Arrow
          x1={130}
          y1={68}
          x2={290}
          y2={68}
          color={C.ok}
          width={2.6}
          texLabel="I=dq/dt"
          texLabelDy={-10}
          texLabelWidth={78}
        />
        <SvgTex x={297} y={303} tex="L" color={C.minus} fontSize={17} width={24} anchor="middle" />
        <SvgTex x={575} y={183} tex="C" color={C.plus} fontSize={17} width={24} />
        <SvgTex x={480} y={137} tex="+q" color={C.plus} fontSize={15} width={34} anchor="end" />
        <SvgTex x={480} y={225} tex="-q" color={C.minus} fontSize={15} width={34} anchor="end" />
        <SvgTex x={432} y={182} tex="V_C=q/C" color={C.plus} fontSize={14} width={82} anchor="end" />
        <SvgTex x={297} y={222} tex="V_L=L\,dI/dt" color={C.minus} fontSize={14} width={112} anchor="middle" />
      </svg>
      <figcaption className="mt-2 text-[13px] leading-relaxed text-muted">
        Посоката на зелената стрелка определя <RichText text="$I=dq/dt$" />. При обход по
        същата посока законът на Кирхоф свързва означените спадове на напрежение.
      </figcaption>
    </figure>
  );
}

export function CoaxialCableDiagram() {
  const cx = 232;
  const cy = 181;
  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={`${STAGE_CLASS} select-none`}
        style={DRAWING_STYLE}
        role="img"
        aria-label="Напречно сечение на коаксиален кабел с радиуси a и b и магнитно поле между проводниците"
      >
        <Stage title="КОАКСИАЛЕН КАБЕЛ · НАПРЕЧНО СЕЧЕНИЕ" />
        <circle
          cx={cx}
          cy={cy}
          r="124"
          fill={C.mut}
          fillOpacity="0.12"
          stroke={C.wire}
          strokeWidth="16"
        />
        <circle
          cx={cx}
          cy={cy}
          r="48"
          fill={C.warn}
          fillOpacity="0.3"
          stroke={C.warn}
          strokeWidth="4"
        />
        <CurrentSymbol x={cx} y={cy} out r={15} color={C.warn} />
        <SvgTex
          x={cx + 22}
          y={cy + 28}
          tex="I"
          color={C.warn}
          fontSize={15}
          width={20}
        />
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle) => (
          <CurrentSymbol
            key={angle}
            x={q(cx + 124 * Math.cos(angle))}
            y={q(cy + 124 * Math.sin(angle))}
            out={false}
            r={10}
            color={C.mut}
          />
        ))}
        <MagneticFieldRing cx={cx} cy={cy} r={84} />
        <SvgTex
          x={cx + 62}
          y={cy - 73}
          tex="\vec B(r)"
          color={C.minus}
          fontSize={15}
          width={64}
        />
        <Arrow
          x1={cx}
          y1={cy}
          x2={cx + 48}
          y2={cy}
          color={C.warn}
          width={1.8}
          texLabel="a"
          texLabelDy={-13}
          texLabelWidth={20}
        />
        <Arrow
          x1={cx}
          y1={cy + 18}
          x2={cx + 124}
          y2={cy + 18}
          color={C.mut}
          width={1.8}
          texLabel="b"
          texLabelDy={16}
          texLabelWidth={20}
        />
        <rect
          x="430"
          y="90"
          width="92"
          height="184"
          fill={C.warn}
          fillOpacity="0.12"
          stroke={C.warn}
          strokeWidth="2"
        />
        <line x1="456" y1="90" x2="456" y2="274" stroke={C.warn} strokeWidth="5" />
        <line x1="506" y1="90" x2="506" y2="274" stroke={C.wire} strokeWidth="10" />
        <Arrow
          x1={456}
          y1={64}
          x2={506}
          y2={64}
          color={C.minus}
          width={1.8}
          texLabel="dr"
          texLabelDy={-12}
          texLabelWidth={28}
        />
        <line x1="548" y1="90" x2="548" y2="274" stroke={C.mut} strokeWidth="1.5" />
        <line x1="540" y1="90" x2="556" y2="90" stroke={C.mut} strokeWidth="1.5" />
        <line x1="540" y1="274" x2="556" y2="274" stroke={C.mut} strokeWidth="1.5" />
        <SvgTex
          x={566}
          y={182}
          tex="\ell"
          color={C.mut}
          fontSize={16}
          width={24}
        />
        <text x="480" y="310" textAnchor="middle" fill={C.mut} fontSize="12" fontWeight="600">
          РАДИАЛНА ИВИЦА
        </text>
      </svg>
      <figcaption className="mt-2 text-[13px] leading-relaxed text-muted">
        Полето е само в областта между проводниците. Потокът през тънката
        радиална ивица е <RichText text="$d\Phi_B=B\ell\,dr$" />.
      </figcaption>
    </figure>
  );
}

export function WirelessChargerDiagram() {
  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={`${STAGE_CLASS} select-none`}
        style={DRAWING_STYLE}
        role="img"
        aria-label="Разделени първична намотка в основата и вторична намотка в дръжката на безконтактно зарядно"
      >
        <Stage title="БЕЗКОНТАКТНО ЗАРЯДНО · КОЯ НАМОТКА КЪДЕ Е" />
        <rect
          x="150"
          y="50"
          width="340"
          height="112"
          rx="18"
          fill={C.ok}
          fillOpacity="0.08"
          stroke={C.ok}
          strokeOpacity="0.35"
        />
        <rect
          x="150"
          y="210"
          width="340"
          height="105"
          rx="18"
          fill={C.warn}
          fillOpacity="0.08"
          stroke={C.warn}
          strokeOpacity="0.35"
        />
        <rect
          x="284"
          y="77"
          width="72"
          height="218"
          rx="30"
          fill={C.minus}
          fillOpacity="0.1"
          stroke={C.minus}
          strokeOpacity="0.25"
          strokeDasharray="5 5"
        />
        {Array.from({ length: 5 }, (_, i) => (
          <ellipse
            key={`handle-${i}`}
            cx="320"
            cy="112"
            rx={112 - i * 13}
            ry={34 - i * 3}
            fill="none"
            stroke={C.ok}
            strokeWidth="2.5"
          />
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <ellipse
            key={`base-${i}`}
            cx="320"
            cy="264"
            rx={120 - i * 12}
            ry={36 - i * 3}
            fill="none"
            stroke={C.warn}
            strokeWidth="2.8"
          />
        ))}
        {[0, 1, 2].map((index) => (
          <Arrow
            key={index}
            x1={298 + index * 22}
            y1={280}
            x2={298 + index * 22}
            y2={86}
            color={C.minus}
            width={1.7}
          />
        ))}
        <SvgTex
          x={365}
          y={184}
          tex="\vec B_1"
          color={C.minus}
          fontSize={15}
          width={42}
        />
        <SvgTex x={452} y={112} tex="N_{\mathrm H}" color={C.ok} fontSize={15} width={48} />
        <SvgTex x={452} y={264} tex="N_{\mathrm B}" color={C.warn} fontSize={15} width={48} />
        <SvgTex x={320} y={185} tex="S" color={C.mut} fontSize={16} width={24} anchor="middle" />
        <Arrow
          x1={142}
          y1={266}
          x2={75}
          y2={266}
          color={C.warn}
          width={2.6}
          texLabel="I_1(t)"
          texLabelDy={-14}
          texLabelWidth={52}
        />
        <text x="174" y="77" fill={C.ok} fontSize="12" fontWeight="600">
          ДРЪЖКА · ВТОРИЧНА
        </text>
        <text x="174" y="238" fill={C.warn} fontSize="12" fontWeight="600">
          ОСНОВА · ПЪРВИЧНА
        </text>
      </svg>
      <figcaption className="mt-2 text-[13px] leading-relaxed text-muted">
        Жълтата намотка е в зарядната основа и носи променливия ток{" "}
        <RichText text="$I_1(t)$" />. Зелената намотка е отделно, в дръжката. Между тях
        няма проводник: синьото поле на основата пресича зелените витки и индуцира
        напрежение в тях.
      </figcaption>
    </figure>
  );
}
