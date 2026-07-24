import { Arrow, C, STAGE_BG } from "./svg";
import SvgTex from "./SvgTex";

/**
 * Статичните чертежи към урока по Фарадей.
 *
 * Сцените са SVG (не canvas), за да могат всички величини и числа да се
 * набират с KaTeX през <SvgTex>. Български думи остават като кратки
 * главни надписи; прозата живее в captions под чертежа.
 */

export type FaradayDiagramKind =
  | "gfi"
  | "pickup"
  | "coil-emf"
  | "exponential"
  | "sliding-rod"
  | "rotating-rod"
  | "field-region"
  | "solenoid"
  | "generator-values"
  | "motor-current"
  | "eddy-brake";

const W = 600;
const H = 340;
const q = (v: number) => Math.round(v * 100) / 100;

/* ---------- споделени градивни части ---------- */

function Stage({ title }: { title: string }) {
  return (
    <>
      <rect width={W} height={H} fill={STAGE_BG} />
      {Array.from({ length: Math.ceil(W / 25) }, (_, i) => (
        <line key={`v${i}`} x1={i * 25} y1="0" x2={i * 25} y2={H} stroke={C.faint} opacity="0.1" />
      ))}
      {Array.from({ length: Math.ceil(H / 25) }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 25} x2={W} y2={i * 25} stroke={C.faint} opacity="0.1" />
      ))}
      <text x="24" y="30" fill={C.mut} fontSize="12" fontWeight="800" letterSpacing="0.06em">{title}</text>
    </>
  );
}

/** Поле навътре в екрана: решетка от ⊗ */
function FieldIn({ x, y, w, h, step = 34 }: { x: number; y: number; w: number; h: number; step?: number }) {
  const marks: { cx: number; cy: number }[] = [];
  for (let yy = y + step / 2; yy < y + h - 4; yy += step)
    for (let xx = x + step / 2; xx < x + w - 4; xx += step) marks.push({ cx: xx, cy: yy });
  return (
    <g stroke={C.minus} strokeWidth="1.6" opacity="0.55" strokeLinecap="round">
      {marks.map((m, i) => (
        <g key={i}>
          <line x1={m.cx - 4} y1={m.cy - 4} x2={m.cx + 4} y2={m.cy + 4} />
          <line x1={m.cx + 4} y1={m.cy - 4} x2={m.cx - 4} y2={m.cy + 4} />
        </g>
      ))}
    </g>
  );
}

/** Заоблена плочка с LaTeX стойност */
function Badge({ x, y, tex, color, width = 128, fontSize = 13 }: { x: number; y: number; tex: string; color: string; width?: number; fontSize?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={width} height={28} rx={14} fill={color} fillOpacity="0.16" stroke={color} strokeWidth="1" />
      <SvgTex x={x + width / 2} y={y + 14} tex={tex} color={color} fontSize={fontSize} width={width - 12} anchor="middle" />
    </g>
  );
}

function Axes({ x, y, w, h, xTex = "t" }: { x: number; y: number; w: number; h: number; xTex?: string }) {
  return (
    <g>
      <Arrow x1={x} y1={y + h} x2={x + w} y2={y + h} color={C.mut} width={1.4} />
      <Arrow x1={x} y1={y + h} x2={x} y2={y} color={C.mut} width={1.4} />
      <SvgTex x={x + w + 4} y={y + h + 2} tex={xTex} color={C.mut} fontSize={12} width={20} />
    </g>
  );
}

function Resistor({ x, y, tex }: { x: number; y: number; tex?: string }) {
  const pts = Array.from({ length: 9 }, (_, i) => {
    const d = i * 9;
    const z = i === 0 || i === 8 ? 0 : i % 2 ? 8 : -8;
    return `${x + z},${y + d}`;
  }).join(" ");
  return (
    <g>
      <polyline points={pts} fill="none" stroke={C.warn} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      {tex && <SvgTex x={x - 16} y={y + 36} tex={tex} color={C.warn} fontSize={15} width={26} anchor="end" />}
    </g>
  );
}

/** Дъгова стрелка (затворена линия на E, индуциран ток) */
function LoopArrow({ cx, cy, rx, ry, cw = false, color = C.ok }: { cx: number; cy: number; rx: number; ry: number; cw?: boolean; color?: string }) {
  const a0 = cw ? 0.5 : 2.7;
  const a1 = cw ? 5.6 : -2.5;
  const p0 = { x: cx + rx * Math.cos(a0), y: cy + ry * Math.sin(a0) };
  const p1 = { x: cx + rx * Math.cos(a1), y: cy + ry * Math.sin(a1) };
  const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0;
  const sweep = cw ? 1 : 0;
  // допирателна във върха, за да легне триъгълникът по дъгата
  const tan = Math.atan2(ry * Math.cos(a1), -rx * Math.sin(a1)) + (cw ? Math.PI : 0);
  const s = 11;
  return (
    <g>
      <path d={`M ${q(p0.x)} ${q(p0.y)} A ${rx} ${ry} 0 ${large} ${sweep} ${q(p1.x)} ${q(p1.y)}`} fill="none" stroke={color} strokeWidth="2.6" />
      <polygon
        points={`${q(p1.x)},${q(p1.y)} ${q(p1.x - s * Math.cos(tan - 0.42))},${q(p1.y - s * Math.sin(tan - 0.42))} ${q(p1.x - s * Math.cos(tan + 0.42))},${q(p1.y - s * Math.sin(tan + 0.42))}`}
        fill={color}
      />
    </g>
  );
}

function Magnet({ x, y, w, h, vertical = false }: { x: number; y: number; w: number; h: number; vertical?: boolean }) {
  if (vertical) {
    return (
      <g>
        <rect x={x} y={y} width={w} height={h / 2} rx="4" fill={C.plus} />
        <rect x={x} y={y + h / 2} width={w} height={h / 2} rx="4" fill={C.minus} />
        <text x={x + w / 2} y={y + h / 4 + 8} textAnchor="middle" fill={STAGE_BG} fontSize="22" fontWeight="900">N</text>
        <text x={x + w / 2} y={y + (3 * h) / 4 + 8} textAnchor="middle" fill={STAGE_BG} fontSize="22" fontWeight="900">S</text>
      </g>
    );
  }
  return (
    <g>
      <rect x={x} y={y} width={w / 2} height={h} rx="4" fill={C.plus} />
      <rect x={x + w / 2} y={y} width={w / 2} height={h} rx="4" fill={C.minus} />
      <text x={x + w / 4} y={y + h / 2 + 8} textAnchor="middle" fill={STAGE_BG} fontSize="22" fontWeight="900">N</text>
      <text x={x + (3 * w) / 4} y={y + h / 2 + 8} textAnchor="middle" fill={STAGE_BG} fontSize="22" fontWeight="900">S</text>
    </g>
  );
}

/* ---------- отделните чертежи ---------- */

function Gfi() {
  const cx = 288;
  const cy = 176;
  return (
    <g>
      <Stage title="ДЕФЕКТНОТОКОВА ЗАЩИТА" />
      <ellipse cx={cx} cy={cy} rx="108" ry="88" fill="none" stroke={C.mut} strokeWidth="22" opacity="0.5" />
      {Array.from({ length: 26 }, (_, i) => {
        const a = (i / 26) * Math.PI * 2;
        return (
          <line key={i} x1={q(cx + 94 * Math.cos(a))} y1={q(cy + 76 * Math.sin(a))} x2={q(cx + 122 * Math.cos(a))} y2={q(cy + 101 * Math.sin(a))} stroke={C.warn} strokeWidth="2.2" />
        );
      })}
      <line x1="52" y1="130" x2="530" y2="130" stroke={C.plus} strokeWidth="6" />
      <line x1="52" y1="222" x2="530" y2="222" stroke={C.minus} strokeWidth="6" />
      <Arrow x1={70} y1={104} x2={148} y2={104} color={C.plus} width={2.4} texLabel="I_{\text{навън}}" texLabelDy={-12} texLabelWidth={78} />
      <Arrow x1={148} y1={250} x2={70} y2={250} color={C.minus} width={2.4} texLabel="I_{\text{обратно}}" texLabelDy={16} texLabelWidth={80} texLabelAnchor="start" />
      <path d="M 404 108 L 458 74 L 520 74" fill="none" stroke={C.warn} strokeWidth="2.5" />
      <rect x="466" y="50" width="98" height="46" rx="8" fill={STAGE_BG} stroke={C.warn} strokeWidth="2" />
      <text x="515" y="78" textAnchor="middle" fill={C.warn} fontSize="12.5" fontWeight="800">СЕНЗОР</text>
      <Arrow x1={516} y1={240} x2={548} y2={298} color={C.warn} width={2.4} />
      <text x="556" y="312" textAnchor="end" fill={C.warn} fontSize="12" fontWeight="700">утечка</text>
      <Badge x={28} y={292} tex="I_{\text{навън}}=I_{\text{обратно}}\Rightarrow \Phi_B=0" color={C.ok} width={244} />
    </g>
  );
}

function Pickup() {
  const wave = Array.from({ length: 135 }, (_, i) => {
    const x = 32 + i * 4;
    const y = 88 + 9 * Math.sin((x - 32) / 27) * Math.exp(-Math.abs(x - 300) / 250);
    return `${i ? "L" : "M"} ${q(x)} ${q(y)}`;
  }).join(" ");
  const sine = Array.from({ length: 121 }, (_, i) => `${i ? "L" : "M"} ${435 + i} ${q(262 - 19 * Math.sin(i / 9))}`).join(" ");
  return (
    <g>
      <Stage title="ПИКЪП НА ЕЛЕКТРИЧЕСКА КИТАРА" />
      <path d={wave} fill="none" stroke={C.wire} strokeWidth="3.5" />
      <Arrow x1={300} y1={58} x2={300} y2={104} color={C.warn} width={2.4} texLabel="\text{вибрация}" texLabelDx={10} texLabelDy={-26} texLabelWidth={72} />
      <rect x="222" y="134" width="156" height="124" rx="16" fill={C.mut} fillOpacity="0.12" stroke={C.mut} strokeWidth="2" />
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={238 + i * 3} y={139 + i * 3} width={124 - i * 6} height={110 - i * 6} fill="none" stroke={C.warn} strokeWidth="1.8" />
      ))}
      <Magnet x={262} y={150} w={76} h={82} />
      <Arrow x1={390} y1={196} x2={504} y2={196} color={C.ok} width={3} texLabel="u(t)" texLabelDy={-14} texLabelWidth={40} />
      <Axes x={435} y={232} w={122} h={58} />
      <path d={sine} fill="none" stroke={C.ok} strokeWidth="2.4" />
    </g>
  );
}

function CoilEmf() {
  return (
    <g>
      <Stage title="ПРИМЕР 31.1 · РАСТЯЩО ПОЛЕ" />
      <FieldIn x={52} y={58} w={332} h={242} step={35} />
      {Array.from({ length: 5 }, (_, i) => (
        <rect key={i} x={102 + i * 5} y={90 + i * 5} width={210 - i * 10} height={170 - i * 10} fill="none" stroke={C.warn} strokeWidth="2.4" />
      ))}
      <Arrow x1={74} y1={294} x2={74} y2={96} color={C.minus} width={3} texLabel="B\uparrow" texLabelDx={-4} texLabelDy={-12} texLabelWidth={34} />
      <line x1="113" y1="278" x2="301" y2="278" stroke={C.mut} strokeWidth="1.4" />
      <line x1="113" y1="272" x2="113" y2="284" stroke={C.mut} strokeWidth="1.4" />
      <line x1="301" y1="272" x2="301" y2="284" stroke={C.mut} strokeWidth="1.4" />
      <SvgTex x={207} y={292} tex="d=0{,}18\,\mathrm{m}" color={C.mut} fontSize={13} width={110} anchor="middle" />
      <rect x="402" y="64" width="166" height="208" rx="12" fill={C.mut} fillOpacity="0.1" stroke={C.mut} strokeOpacity="0.5" strokeWidth="1.5" />
      <SvgTex x={422} y={100} tex="N=200" color={C.wire} fontSize={17} width={120} />
      <SvgTex x={422} y={142} tex="0\rightarrow0{,}50\,\mathrm{T}" color={C.minus} fontSize={16} width={126} />
      <SvgTex x={422} y={182} tex="\Delta t=0{,}80\,\mathrm{s}" color={C.mut} fontSize={15} width={124} />
      <line x1="422" y1="212" x2="548" y2="212" stroke={C.faint} strokeWidth="1" />
      <SvgTex x={422} y={242} tex="|\mathcal{E}|\approx4{,}0\,\mathrm{V}" color={C.warn} fontSize={18} width={130} />
    </g>
  );
}

function Exponential() {
  const curve = (scale: number, offset: number) =>
    Array.from({ length: 216 }, (_, i) => {
      const x = 84 + i * 2;
      const y = 270 - scale * Math.exp(-(i * 2) / 128) + offset;
      return `${i ? "L" : "M"} ${q(x)} ${q(y)}`;
    }).join(" ");
  return (
    <g>
      <Stage title="ПРИМЕР 31.2 · ЕКСПОНЕНЦИАЛНО ЗАТИХВАНЕ" />
      <Axes x={78} y={74} w={452} h={204} />
      <path d={curve(170, -5)} fill="none" stroke={C.minus} strokeWidth="2.8" />
      <path d={curve(112, 0)} fill="none" stroke={C.ok} strokeWidth="2.8" />
      <Badge x={300} y={70} tex="B(t)=B_{\max}e^{-\alpha t}" color={C.minus} width={168} />
      <Badge x={300} y={106} tex="\mathcal{E}(t)=\alpha AB_{\max}e^{-\alpha t}" color={C.ok} width={196} />
      <line x1="212" y1="74" x2="212" y2="278" stroke={C.warn} strokeWidth="1.4" strokeDasharray="5 5" />
      <SvgTex x={212} y={298} tex="\tau=1/\alpha" color={C.warn} fontSize={13} width={64} anchor="middle" />
    </g>
  );
}

function SlidingRod() {
  return (
    <g>
      <Stage title="ПРИМЕР 31.3 · ПРЪЧКА ВЪРХУ РЕЛСИ" />
      <FieldIn x={146} y={56} w={396} h={236} step={36} />
      <line x1="87" y1="90" x2="535" y2="90" stroke={C.wire} strokeWidth="5" />
      <line x1="87" y1="268" x2="535" y2="268" stroke={C.wire} strokeWidth="5" />
      <line x1="88" y1="90" x2="88" y2="117" stroke={C.wire} strokeWidth="4" />
      <Resistor x={88} y={117} tex="R" />
      <line x1="88" y1="189" x2="88" y2="268" stroke={C.wire} strokeWidth="4" />
      <line x1="402" y1="87" x2="402" y2="271" stroke={C.warn} strokeWidth="10" />
      <Arrow x1={402} y1={58} x2={508} y2={58} color={C.warn} width={3} texLabel="\vec v" texLabelDy={-12} texLabelWidth={28} />
      <Arrow x1={382} y1={240} x2={382} y2={128} color={C.ok} width={2.6} texLabel="I" texLabelDx={-20} texLabelDy={4} texLabelWidth={20} />
      <SvgTex x={416} y={180} tex="\ell" color={C.warn} fontSize={19} width={22} />
      <Badge x={168} y={298} tex="F_B=B I\ell \;\text{спира пръчката}" color={C.plus} width={232} />
    </g>
  );
}

function RotatingRod() {
  const ox = 201;
  const oy = 198;
  return (
    <g>
      <Stage title="ПРИМЕР 31.4 · ВЪРТЯЩА СЕ ПРЪЧКА" />
      <FieldIn x={44} y={56} w={330} h={240} step={39} />
      <line x1={ox} y1={oy} x2="321" y2="96" stroke={C.warn} strokeWidth="10" />
      <circle cx={ox} cy={oy} r="9" fill={C.wire} />
      <Arrow x1={322} y1={96} x2={362} y2={142} color={C.ok} width={3} texLabel="v=\omega r" texLabelDx={-16} texLabelDy={20} texLabelWidth={62} texLabelAnchor="middle" />
      <path d={`M ${q(ox + 85 * Math.cos(-1.55))} ${q(oy + 85 * Math.sin(-1.55))} A 85 85 0 0 1 ${q(ox + 85 * Math.cos(-0.35))} ${q(oy + 85 * Math.sin(-0.35))}`} fill="none" stroke={C.warn} strokeWidth="2.4" />
      <SvgTex x={268} y={104} tex="\omega" color={C.warn} fontSize={15} width={24} anchor="middle" />
      <Arrow x1={207} y1={209} x2={306} y2={125} color={C.mut} width={1.5} texLabel="r" texLabelDx={-42} texLabelDy={22} texLabelWidth={18} />
      <rect x="398" y="70" width="172" height="192" rx="12" fill={C.mut} fillOpacity="0.1" stroke={C.mut} strokeOpacity="0.5" strokeWidth="1.5" />
      <text x="418" y="106" fill={C.mut} fontSize="12.5" fontWeight="700">ВЪТРЕШНА ТОЧКА</text>
      <SvgTex x={418} y={134} tex="v\ \text{малка}" color={C.ok} fontSize={16} width={130} />
      <text x="418" y="178" fill={C.mut} fontSize="12.5" fontWeight="700">ВЪНШНА ТОЧКА</text>
      <SvgTex x={418} y={206} tex="v\ \text{голяма}" color={C.ok} fontSize={16} width={130} />
      <SvgTex x={418} y={242} tex="\mathcal{E}=\tfrac12 B\omega\ell^2" color={C.warn} fontSize={17} width={140} />
    </g>
  );
}

function FieldRegion() {
  return (
    <g>
      <Stage title="ПРИМЕР 31.6 · КОНТУР ПРЕЗ ПОЛЕВА ОБЛАСТ" />
      <rect x="205" y="56" width="340" height="152" rx="8" fill={C.minus} fillOpacity="0.1" />
      <FieldIn x={205} y={56} w={340} h={152} step={33} />
      <rect x="126" y="83" width="142" height="100" fill="none" stroke={C.warn} strokeWidth="6" />
      <Arrow x1={116} y1={62} x2={194} y2={62} color={C.warn} width={3} texLabel="\vec v" texLabelDy={-12} texLabelWidth={26} />
      <Axes x={70} y={244} w={208} h={62} />
      <polyline points="76,300 115,300 154,256 215,256 254,300 274,300" fill="none" stroke={C.minus} strokeWidth="2.4" />
      <SvgTex x={62} y={250} tex="\Phi_B" color={C.minus} fontSize={14} width={34} anchor="end" />
      <Axes x={340} y={244} w={208} h={62} />
      <polyline points="346,276 384,276 384,250 423,250 423,276 487,276 487,303 526,303 526,276 545,276" fill="none" stroke={C.ok} strokeWidth="2.4" />
      <SvgTex x={332} y={250} tex="\mathcal{E}" color={C.ok} fontSize={14} width={26} anchor="end" />
      <text x="197" y="200" textAnchor="middle" fill={C.warn} fontSize="12.5" fontWeight="800">ВЛИЗА</text>
    </g>
  );
}

function Solenoid() {
  return (
    <g>
      <Stage title="ПРИМЕР 31.7 · ИНДУЦИРАНО ВИХРОВО ПОЛЕ" />
      {Array.from({ length: 15 }, (_, i) => (
        <ellipse key={i} cx="290" cy={70 + i * 14} rx="86" ry="23" fill="none" stroke={C.warn} strokeWidth="3.5" />
      ))}
      {Array.from({ length: 5 }, (_, i) => (
        <Arrow key={i} x1={240 + i * 25} y1={250} x2={240 + i * 25} y2={80} color={C.minus} width={1.7} />
      ))}
      {[118, 148, 180].map((r, i) => (
        <LoopArrow key={r} cx={290} cy={175} rx={r} ry={r * 0.35} cw={i % 2 === 0} color={C.ok} />
      ))}
      <SvgTex x={300} y={104} tex="B(t)" color={C.minus} fontSize={16} width={48} anchor="middle" />
      <text x="290" y="312" textAnchor="middle" fill={C.ok} fontSize="12.5" fontWeight="800">ЗАТВОРЕНИ ЛИНИИ НА E</text>
      <Badge x={20} y={82} tex="r<R:\ E\propto r" color={C.warn} width={122} />
      <Badge x={438} y={82} tex="r>R:\ E\propto 1/r" color={C.warn} width={138} />
    </g>
  );
}

function GeneratorValues() {
  return (
    <g>
      <Stage title="ПРИМЕР 31.8 · ГЕНЕРАТОР" />
      <rect x="48" y="72" width="108" height="192" rx="12" fill={C.plus} />
      <rect x="440" y="72" width="108" height="192" rx="12" fill={C.minus} />
      <text x="102" y="182" textAnchor="middle" fill={STAGE_BG} fontSize="40" fontWeight="900">N</text>
      <text x="494" y="182" textAnchor="middle" fill={STAGE_BG} fontSize="40" fontWeight="900">S</text>
      {[105, 137, 169, 201, 233].map((y) => (
        <Arrow key={y} x1={172} y1={y} x2={424} y2={y} color={C.minus} width={1.7} />
      ))}
      <g transform="translate(300 172) rotate(-20)">
        <rect x="-76" y="-60" width="152" height="120" fill="none" stroke={C.warn} strokeWidth="7" />
      </g>
      <Arrow x1={258} y1={72} x2={344} y2={73} color={C.warn} width={3} texLabel="\omega" texLabelDy={-12} texLabelWidth={24} />
      <Badge x={26} y={294} tex="N=8" color={C.warn} width={76} />
      <Badge x={112} y={294} tex="B=0{,}500\,\mathrm{T}" color={C.minus} width={128} />
      <Badge x={250} y={294} tex="f=60{,}0\,\mathrm{Hz}" color={C.ok} width={126} />
      <Badge x={386} y={294} tex="\mathcal{E}_{\max}\approx136\,\mathrm{V}" color={C.warn} width={152} />
    </g>
  );
}

function MotorCurrent() {
  return (
    <g>
      <Stage title="ПРИМЕР 31.9 · ТОК И ОБРАТНО ЕДН" />
      <rect x="34" y="70" width="112" height="190" rx="12" fill={C.mut} fillOpacity="0.1" stroke={C.mut} strokeOpacity="0.5" strokeWidth="1.5" />
      <line x1="73" y1="112" x2="107" y2="112" stroke={C.plus} strokeWidth="5" />
      <line x1="66" y1="137" x2="114" y2="137" stroke={C.minus} strokeWidth="3" />
      <text x="90" y="98" textAnchor="middle" fill={C.plus} fontSize="18" fontWeight="900">+</text>
      <text x="90" y="164" textAnchor="middle" fill={C.minus} fontSize="18" fontWeight="900">−</text>
      <SvgTex x={90} y={214} tex="120\,\mathrm{V}" color={C.wire} fontSize={16} width={80} anchor="middle" />
      <line x1="146" y1="112" x2="231" y2="112" stroke={C.plus} strokeWidth="4" />
      <polyline points="231,112 231,226 146,226" fill="none" stroke={C.wire} strokeWidth="4" />
      <circle cx="321" cy="168" r="74" fill={C.mut} fillOpacity="0.12" stroke={C.wire} strokeWidth="3.5" />
      <text x="321" y="168" textAnchor="middle" fill={C.warn} fontSize="34" fontWeight="900">M</text>
      <SvgTex x={321} y={204} tex="R=10\,\Omega" color={C.mut} fontSize={14} width={90} anchor="middle" />
      <line x1="231" y1="112" x2="321" y2="94" stroke={C.plus} strokeWidth="4" />
      <line x1="321" y1="242" x2="231" y2="226" stroke={C.minus} strokeWidth="4" />
      <Arrow x1={392} y1={130} x2={456} y2={92} color={C.ok} width={3} texLabel="\omega" texLabelDy={-10} texLabelWidth={24} />
      <Arrow x1={470} y1={158} x2={414} y2={190} color={C.warn} width={3} texLabel="\mathcal{E}_{\text{обр}}=70\,\mathrm{V}" texLabelDx={64} texLabelDy={30} texLabelWidth={124} texLabelAnchor="middle" />
      <Badge x={40} y={292} tex="\text{пускане}:\ 12\,\mathrm{A}" color={C.plus} width={148} />
      <Badge x={226} y={292} tex="\text{при обороти}:\ 5{,}0\,\mathrm{A}" color={C.ok} width={198} />
    </g>
  );
}

function EddyBrake() {
  return (
    <g>
      <Stage title="ВИХРОВИ ТОКОВЕ: СПИРАЧКА И ЛАМИНИРАНЕ" />
      <Magnet x={58} y={84} w={52} h={160} vertical />
      <rect x="126" y="74" width="128" height="180" rx="6" fill={C.mut} fillOpacity="0.14" stroke={C.wire} strokeWidth="2" />
      <LoopArrow cx={190} cy={140} rx={34} ry={30} cw color={C.ok} />
      <LoopArrow cx={190} cy={206} rx={34} ry={30} color={C.ok} />
      <Arrow x1={190} y1={286} x2={264} y2={286} color={C.warn} width={2.6} texLabel="\vec v" texLabelDy={-12} texLabelWidth={24} />
      <Arrow x1={190} y1={310} x2={120} y2={310} color={C.plus} width={2.6} texLabel="\vec F_B" texLabelDy={14} texLabelWidth={32} />
      <text x="190" y="66" textAnchor="middle" fill={C.mut} fontSize="12" fontWeight="700">ДИСК / РЕЛСА</text>
      <line x1="300" y1="70" x2="300" y2="300" stroke={C.faint} strokeWidth="1.4" strokeDasharray="6 6" />
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={i} x={352 + i * 26} y="98" width="16" height="150" rx="3" fill={C.minus} fillOpacity="0.16" stroke={C.minus} strokeWidth="1.6" />
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <LoopArrow key={i} cx={360 + i * 26} cy={172} rx={6} ry={26} cw={i % 2 === 0} color={C.ok} />
      ))}
      <text x="450" y="80" textAnchor="middle" fill={C.mut} fontSize="12" fontWeight="700">ИЗОЛИРАНИ ПЛАСТИНИ</text>
      <Badge x={340} y={286} tex="\text{малки контури}\Rightarrow I^2R\downarrow" color={C.ok} width={222} />
    </g>
  );
}

const DIAGRAMS: Record<FaradayDiagramKind, () => React.ReactElement> = {
  gfi: Gfi,
  pickup: Pickup,
  "coil-emf": CoilEmf,
  exponential: Exponential,
  "sliding-rod": SlidingRod,
  "rotating-rod": RotatingRod,
  "field-region": FieldRegion,
  solenoid: Solenoid,
  "generator-values": GeneratorValues,
  "motor-current": MotorCurrent,
  "eddy-brake": EddyBrake,
};

const LABELS: Record<FaradayDiagramKind, string> = {
  gfi: "Схема на дефектнотокова защита с два проводника през железен пръстен и сензорна намотка",
  pickup: "Схема на пикъп на електрическа китара с вибрираща струна, магнит и намотка",
  "coil-emf": "Намотка от 200 квадратни навивки в растящо магнитно поле",
  exponential: "Графики на експоненциално затихващо поле и индуцирано ЕДН",
  "sliding-rod": "Пръчка, плъзгаща се по релси в магнитно поле, затворени с резистор",
  "rotating-rod": "Пръчка, въртяща се около единия си край в перпендикулярно поле",
  "field-region": "Правоъгълен контур, минаващ през полева област, с графики на потока и ЕДН",
  solenoid: "Соленоид с променлив ток и затворени линии на индуцираното електрично поле",
  "generator-values": "Намотка, въртяща се между полюсите на магнит, с данните на генератора",
  "motor-current": "Схема на двигател с източник, съпротивление и обратно ЕДН",
  "eddy-brake": "Вихрови токове в плътна плоча и в ламинирана сърцевина",
};

export default function FaradayDiagram({ kind, caption }: { kind: FaradayDiagramKind; caption?: string }) {
  const Draw = DIAGRAMS[kind];
  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full rounded-[10px] border-[1.5px] border-ink select-none"
        role="img"
        aria-label={LABELS[kind]}
      >
        <Draw />
      </svg>
      {caption && (
        <figcaption className="mt-2 text-[13px] leading-relaxed text-muted">{caption}</figcaption>
      )}
    </figure>
  );
}
