import { Arrow, AngleArc, C, CurrentSymbol } from "./svg";
import type { GuidedProblemData } from "./GuidedProblem";
import SvgTex from "./SvgTex";

/**
 * Осем водени задачи от преговорния урок по закона на Био-Савар.
 * Всяка фигура се достроява по фази: 0 геометрия → 1 dB вектори → 2 резултат
 * → 3 финална стойност (след всички стъпки на решението).
 */

/* ---------- Задача 1 · Кръгов контур ---------- */

const p1Center = { x: 240, y: 150 };
const P1_R = 95;

function p1Figure(phase: number) {
  const { x: cx, y: cy } = p1Center;
  const sample = [0, 120, 240].map((deg) => (deg * Math.PI) / 180);
  return (
    <g>
      <circle cx={cx} cy={cy} r={P1_R} fill="none" stroke={C.wire} strokeWidth={3.5} />
      {/* ток, обратно на часовниковата стрелка */}
      {[30, 150, 270].map((deg) => {
        const phi = (deg * Math.PI) / 180;
        const ax = cx + P1_R * Math.cos(phi);
        const ay = cy + P1_R * Math.sin(phi);
        const tx = Math.sin(phi);
        const ty = -Math.cos(phi);
        return <Arrow key={deg} x1={ax - tx * 12} y1={ay - ty * 12} x2={ax + tx * 12} y2={ay + ty * 12} color={C.warn} width={3} />;
      })}
      <SvgTex x={cx + P1_R + 12} y={cy - 60} tex="I" color={C.warn} width={26} />
      <circle cx={cx} cy={cy} r={4} fill={C.wire} />
      <SvgTex x={cx + 10} y={cy + 18} tex="P" color={C.wire} width={28} />
      <SvgTex x={cx + P1_R / 2 - 6} y={cy - P1_R / 2 - 8} tex="R" color={C.mut} width={28} />
      <line x1={cx} y1={cy} x2={cx + P1_R * 0.707} y2={cy - P1_R * 0.707} stroke={C.faint} strokeWidth={1.3} strokeDasharray="4 4" />

      {phase >= 1 &&
        sample.map((phi, i) => {
          const ex = cx + P1_R * Math.cos(phi);
          const ey = cy + P1_R * Math.sin(phi);
          const tx = Math.sin(phi);
          const ty = -Math.cos(phi);
          return (
            <g
              key={i}
              className="animate-rise"
              opacity={phase === 1 ? 1 : 0.25}
              style={{ transition: "opacity 180ms ease-out" }}
            >
              <line x1={ex - tx * 11} y1={ey - ty * 11} x2={ex + tx * 11} y2={ey + ty * 11} stroke={C.plus} strokeWidth={5} strokeLinecap="round" />
              <SvgTex x={ex + Math.cos(phi) * 20 - 8} y={ey + Math.sin(phi) * 20 + 4} tex={String.raw`d\vec l`} color={C.plus} fontSize={12} width={46} />
              <CurrentSymbol x={cx + 30 * Math.cos(phi)} y={cy + 30 * Math.sin(phi)} out r={8} color={C.minus} />
            </g>
          );
        })}
      {phase >= 2 && (
        <g opacity={phase === 2 ? 1 : 0.25} style={{ transition: "opacity 180ms ease-out" }}>
          <CurrentSymbol x={cx} y={cy} out r={17} color={C.ok} animate />
        </g>
      )}
    </g>
  );
}

/* ---------- Задача 2 · Полуокръжност с прави краища ---------- */

const p2C = { x: 240, y: 190 };
const P2_R = 90;

function p2Figure(phase: number) {
  const { x: cx, y: cy } = p2C;
  return (
    <g>
      {/* прави части (по една права през центъра) */}
      <line x1={40} y1={cy} x2={cx - P2_R} y2={cy} stroke={C.wire} strokeWidth={3.5} />
      <line x1={cx + P2_R} y1={cy} x2={440} y2={cy} stroke={C.wire} strokeWidth={3.5} />
      {/* полуокръжност отгоре */}
      <path d={`M ${cx - P2_R} ${cy} A ${P2_R} ${P2_R} 0 0 1 ${cx + P2_R} ${cy}`} fill="none" stroke={C.wire} strokeWidth={3.5} />
      {/* ток отляво надясно */}
      <Arrow x1={78} y1={cy} x2={106} y2={cy} color={C.warn} width={3} />
      <Arrow x1={374} y1={cy} x2={402} y2={cy} color={C.warn} width={3} />
      {[-135, -45].map((deg) => {
        const phi = (deg * Math.PI) / 180;
        const ax = cx + P2_R * Math.cos(phi);
        const ay = cy + P2_R * Math.sin(phi);
        const tx = -Math.sin(phi);
        const ty = Math.cos(phi);
        return <Arrow key={deg} x1={ax - tx * 11} y1={ay - ty * 11} x2={ax + tx * 11} y2={ay + ty * 11} color={C.warn} width={3} />;
      })}
      <SvgTex x={60} y={cy - 12} tex="I" color={C.warn} width={26} />
      <circle cx={cx} cy={cy} r={4} fill={C.wire} />
      <SvgTex x={cx - 6} y={cy + 22} tex="P" color={C.wire} width={28} anchor="middle" />
      <line x1={cx} y1={cy} x2={cx + P2_R * 0.707} y2={cy - P2_R * 0.707} stroke={C.faint} strokeWidth={1.3} strokeDasharray="4 4" />
      <SvgTex x={cx + 26} y={cy - 6} tex="R" color={C.mut} width={28} />

      {phase >= 1 && (
        <g className="animate-rise" opacity={phase === 1 ? 1 : 0.25} style={{ transition: "opacity 180ms ease-out" }}>
           <SvgTex x={80} y={cy + 26} tex={String.raw`d\vec l\parallel\hat r\Rightarrow d\vec B=0`} color={C.mut} fontSize={12} width={156} anchor="middle" />
           <SvgTex x={360} y={cy + 26} tex={String.raw`d\vec l\parallel\hat r\Rightarrow d\vec B=0`} color={C.mut} fontSize={12} width={156} anchor="middle" />
          <line x1={cx} y1={cy - P2_R} x2={cx} y2={cy} stroke={C.minus} strokeWidth={1.5} strokeDasharray="4 4" />
          <line x1={cx - 12} y1={cy - P2_R} x2={cx + 12} y2={cy - P2_R} stroke={C.plus} strokeWidth={5} strokeLinecap="round" />
           <SvgTex x={cx + 18} y={cy - P2_R + 4} tex={String.raw`d\vec l`} color={C.plus} fontSize={12} width={46} />
          <CurrentSymbol x={cx} y={cy - 32} out={false} r={8} color={C.minus} />
           <SvgTex x={cx + 14} y={cy - 28} tex={String.raw`d\vec B\;\otimes`} color={C.minus} fontSize={12} width={72} />
        </g>
      )}
      {phase >= 2 && (
        <g opacity={phase === 2 ? 1 : 0.25} style={{ transition: "opacity 180ms ease-out" }}>
          <CurrentSymbol x={cx} y={cy} out={false} r={16} color={C.ok} animate />
        </g>
      )}
    </g>
  );
}

/* ---------- Задача 3 · Квадратен контур ---------- */

const p3C = { x: 240, y: 150 };
const P3_H = 95; // половин страна

function p3Figure(phase: number) {
  const { x: cx, y: cy } = p3C;
  const L = cx - P3_H;
  const R = cx + P3_H;
  const T = cy - P3_H;
  const B = cy + P3_H;
  return (
    <g>
      <rect x={L} y={T} width={2 * P3_H} height={2 * P3_H} fill="none" stroke={C.wire} strokeWidth={3.5} />
      {/* ток, обратно на часовниковата стрелка: ляво↓ дъно→ дясно↑ горе← */}
      <Arrow x1={L} y1={cy - 14} x2={L} y2={cy + 14} color={C.warn} width={3} />
      <Arrow x1={cx - 14} y1={B} x2={cx + 14} y2={B} color={C.warn} width={3} />
      <Arrow x1={R} y1={cy + 14} x2={R} y2={cy - 14} color={C.warn} width={3} />
      <Arrow x1={cx + 14} y1={T} x2={cx - 14} y2={T} color={C.warn} width={3} />
      <SvgTex x={L - 24} y={cy + 5} tex="I" color={C.warn} width={26} />
      <SvgTex x={cx - 8} y={B + 24} tex="a" color={C.mut} width={26} />
      <circle cx={cx} cy={cy} r={4} fill={C.wire} />
      <SvgTex x={cx - 22} y={cy + 5} tex="P" color={C.wire} width={28} anchor="end" />
      {/* перпендикулярът към дясната страна */}
      <line x1={cx} y1={cy} x2={R} y2={cy} stroke={C.mut} strokeWidth={1.5} strokeDasharray="6 5" />
      <SvgTex x={cx + P3_H / 2 + 2} y={cy - 8} tex="a/2" color={C.mut} fontSize={12.5} width={42} />

      {phase >= 1 && (
        <g className="animate-rise" opacity={phase === 1 ? 1 : 0.25} style={{ transition: "opacity 180ms ease-out" }}>
          {/* r-вектори към краищата на дясната страна + ъглите 45° */}
          <line x1={cx} y1={cy} x2={R} y2={T} stroke={C.minus} strokeWidth={1.5} strokeDasharray="4 4" />
          <line x1={cx} y1={cy} x2={R} y2={B} stroke={C.minus} strokeWidth={1.5} strokeDasharray="4 4" />
          <AngleArc cx={cx} cy={cy} a1={0} a2={-Math.PI / 4} r={40} color={C.plus} texLabel={String.raw`45^\circ`} />
          <AngleArc cx={cx} cy={cy} a1={0} a2={Math.PI / 4} r={54} color={C.plus} texLabel={String.raw`45^\circ`} />
          {/* приносите на четирите страни */}
          {[[cx - 30, cy] as const, [cx + 30, cy] as const, [cx, cy - 30] as const, [cx, cy + 30] as const].map(([x, y], i) => (
            <CurrentSymbol key={i} x={x} y={y} out r={8} color={C.minus} />
          ))}
        </g>
      )}
      {phase >= 2 && (
        <g opacity={phase === 2 ? 1 : 0.25} style={{ transition: "opacity 180ms ease-out" }}>
          <CurrentSymbol x={cx} y={cy} out r={16} color={C.ok} animate />
        </g>
      )}
    </g>
  );
}

/* ---------- Задача 4 · Две успоредни жици ---------- */

const P4_W1 = { x: 150, y: 140 };
const P4_W2 = { x: 330, y: 140 };
const P4_P = { x: 240, y: 140 };

function p4Figure(phase: number) {
  return (
    <g>
      <CurrentSymbol x={P4_W1.x} y={P4_W1.y} out r={15} color={C.warn} texLabel="I" />
      <CurrentSymbol x={P4_W2.x} y={P4_W2.y} out r={15} color={C.warn} texLabel="I" />
      <line x1={P4_W1.x + 18} y1={P4_W1.y} x2={P4_P.x - 8} y2={P4_P.y} stroke={C.faint} strokeWidth={1.3} strokeDasharray="4 4" />
      <line x1={P4_P.x + 8} y1={P4_P.y} x2={P4_W2.x - 18} y2={P4_W2.y} stroke={C.faint} strokeWidth={1.3} strokeDasharray="4 4" />
      <SvgTex x={(P4_W1.x + P4_P.x) / 2} y={P4_P.y - 10} tex="d/2" color={C.mut} fontSize={12.5} width={42} anchor="middle" />
      <SvgTex x={(P4_P.x + P4_W2.x) / 2} y={P4_P.y - 10} tex="d/2" color={C.mut} fontSize={12.5} width={42} anchor="middle" />
      <circle cx={P4_P.x} cy={P4_P.y} r={5} fill={C.wire} />
      <SvgTex x={P4_P.x - 6} y={P4_P.y + 24} tex="P" color={C.wire} width={28} anchor="middle" />

      {phase >= 1 && (
        <g opacity={phase === 1 ? 1 : 0.25} style={{ transition: "opacity 180ms ease-out" }}>
          <Arrow x1={P4_P.x} y1={P4_P.y} x2={P4_P.x} y2={P4_P.y - 72} color={C.minus} texLabel={String.raw`\vec B_1`} texLabelDx={-8} texLabelWidth={54} animate />
          <Arrow x1={P4_P.x} y1={P4_P.y} x2={P4_P.x} y2={P4_P.y + 72} color={C.plus} texLabel={String.raw`\vec B_2`} texLabelDx={8} texLabelWidth={54} animate />
        </g>
      )}
    </g>
  );
}

/* ---------- Задача 5 · Проводник под прав ъгъл ---------- */

const P5_O = { x: 190, y: 210 };
const P5_P = { x: 370, y: 210 };

function p5Figure(phase: number) {
  const O = P5_O;
  const P = P5_P;
  return (
    <g>
      {/* хоризонтално рамо (от ∞ отляво) и вертикално рамо (към ∞ нагоре) */}
      <line x1={26} y1={O.y} x2={O.x} y2={O.y} stroke={C.wire} strokeWidth={3.5} />
      <line x1={O.x} y1={O.y} x2={O.x} y2={36} stroke={C.wire} strokeWidth={3.5} />
      <SvgTex x={30} y={O.y - 10} tex={String.raw`-\infty`} color={C.mut} fontSize={12} width={42} />
      <SvgTex x={O.x + 10} y={46} tex={String.raw`+\infty`} color={C.mut} fontSize={12} width={42} />
      <Arrow x1={86} y1={O.y} x2={116} y2={O.y} color={C.warn} width={3} />
      <Arrow x1={O.x} y1={140} x2={O.x} y2={110} color={C.warn} width={3} />
      <SvgTex x={96} y={O.y + 22} tex="I" color={C.warn} width={26} />
      <circle cx={O.x} cy={O.y} r={4} fill={C.wire} />
      <SvgTex x={O.x - 8} y={O.y + 24} tex="O" color={C.wire} width={28} anchor="middle" />
      {/* P на продължението на хоризонталното рамо */}
      <line x1={O.x} y1={O.y} x2={P.x} y2={P.y} stroke={C.faint} strokeWidth={1.3} strokeDasharray="4 4" />
      <SvgTex x={(O.x + P.x) / 2} y={O.y - 10} tex="d" color={C.mut} fontSize={12.5} width={26} anchor="middle" />
      <circle cx={P.x} cy={P.y} r={5} fill={C.wire} />
      <SvgTex x={P.x + 12} y={P.y + 5} tex="P" color={C.wire} width={28} />

      {phase >= 1 && (
        <g className="animate-rise" opacity={phase === 1 ? 1 : 0.25} style={{ transition: "opacity 180ms ease-out" }}>
           <SvgTex x={42} y={O.y + 44} tex={String.raw`d\vec l\parallel\hat r\Rightarrow d\vec B=0`} color={C.mut} fontSize={12} width={160} />
          <line x1={P.x} y1={P.y} x2={O.x} y2={O.y} stroke={C.minus} strokeWidth={1.5} strokeDasharray="4 4" />
          <line x1={P.x} y1={P.y} x2={O.x} y2={100} stroke={C.minus} strokeWidth={1.5} strokeDasharray="4 4" />
           <SvgTex x={(P.x + O.x) / 2 - 30} y={150} tex={String.raw`\vec r`} color={C.minus} fontSize={12} width={32} />
          <CurrentSymbol x={P.x} y={P.y - 34} out={false} r={8} color={C.minus} />
           <SvgTex x={P.x + 14} y={P.y - 30} tex={String.raw`d\vec B\;\otimes`} color={C.minus} fontSize={12} width={72} />
        </g>
      )}
      {phase >= 2 && (
        <g opacity={phase === 2 ? 1 : 0.25} style={{ transition: "opacity 180ms ease-out" }}>
          <CurrentSymbol x={P.x} y={P.y} out={false} r={15} color={C.ok} animate />
        </g>
      )}
    </g>
  );
}

/* ---------- Задача 6 · P30.9 · Два несиметрични проводника ---------- */

const P6_W2 = { x: 88, y: 112 };
const P6_O = { x: 248, y: 112 };
const P6_W1 = { x: 328, y: 112 };

function p6Figure(phase: number) {
  return (
    <g>
      <Arrow x1={28} y1={P6_O.y} x2={448} y2={P6_O.y} color={C.faint} width={1.4} />
      <SvgTex x={448} y={P6_O.y - 12} tex="x" color={C.mut} width={24} anchor="end" />
      <line x1={P6_W2.x} y1={P6_O.y - 8} x2={P6_W2.x} y2={P6_O.y + 8} stroke={C.mut} />
      <line x1={P6_O.x} y1={P6_O.y - 8} x2={P6_O.x} y2={P6_O.y + 8} stroke={C.mut} />
      <line x1={P6_W1.x} y1={P6_O.y - 8} x2={P6_W1.x} y2={P6_O.y + 8} stroke={C.mut} />
      <SvgTex x={P6_W2.x} y={P6_O.y + 26} tex="-2a" color={C.mut} width={46} anchor="middle" />
      <SvgTex x={P6_O.x} y={P6_O.y + 26} tex="O" color={C.wire} width={28} anchor="middle" />
      <SvgTex x={P6_W1.x} y={P6_O.y + 26} tex="a" color={C.mut} width={28} anchor="middle" />

      <circle cx={P6_W2.x} cy={P6_W2.y} r={16} fill="none" stroke={C.warn} strokeWidth={2.5} strokeDasharray="4 3" />
      <SvgTex x={P6_W2.x} y={P6_W2.y} tex="?" color={C.warn} width={24} anchor="middle" />
      <SvgTex x={P6_W2.x - 2} y={P6_W2.y - 29} tex="I_2" color={C.warn} width={38} anchor="middle" />
      <CurrentSymbol x={P6_W1.x} y={P6_W1.y} out={false} r={16} color={C.plus} texLabel="I_1" />

      <SvgTex x={10} y={18} tex={String.raw`|\vec B(O)|=2B_0`} color={C.wire} fontSize={11.5} width={150} />
      <SvgTex x={10} y={39} tex={String.raw`B_0=\mu_0I_1/(2\pi a)`} color={C.wire} fontSize={11.5} width={174} />

      {phase >= 1 && (
        <g className="animate-rise" opacity={phase === 1 ? 1 : 0.25} style={{ transition: "opacity 180ms ease-out" }}>
          <Arrow x1={P6_O.x} y1={P6_O.y} x2={P6_O.x} y2={42} color={C.plus} width={3} texLabel={String.raw`\vec B_1`} texLabelWidth={52} />
          <Arrow x1={P6_O.x - 18} y1={P6_O.y} x2={P6_O.x - 18} y2={58} color={C.minus} width={2} dashed texLabel={String.raw`\vec B_2\;(I_2\,\odot)`} texLabelDx={-8} texLabelWidth={116} />
          <Arrow x1={P6_O.x + 18} y1={P6_O.y} x2={P6_O.x + 18} y2={166} color={C.warn} width={2} dashed texLabel={String.raw`\vec B_2\;(I_2\,\otimes)`} texLabelDx={8} texLabelWidth={116} />
        </g>
      )}

      {phase >= 2 && (
        <g className="animate-rise" opacity={phase === 2 ? 1 : 0.35} style={{ transition: "opacity 180ms ease-out" }}>
          <line x1={240} y1={190} x2={240} y2={318} stroke={C.faint} strokeWidth={1.2} strokeDasharray="5 5" />
          <SvgTex x={120} y={198} tex={String.raw`\mathrm{A}`} color={C.mut} fontSize={12.5} width={28} anchor="middle" />
          <SvgTex x={360} y={198} tex={String.raw`\mathrm{B}`} color={C.mut} fontSize={12.5} width={28} anchor="middle" />
          <Arrow x1={120} y1={312} x2={120} y2={246} color={C.ok} width={3.2} texLabel={String.raw`+2B_0\hat y`} texLabelWidth={82} />
          <Arrow x1={360} y1={246} x2={360} y2={312} color={C.ok} width={3.2} texLabel={String.raw`-2B_0\hat y`} texLabelWidth={82} texLabelDy={-4} />
        </g>
      )}

       {phase >= 3 && (
         <g className="animate-rise">
          <CurrentSymbol x={70} y={256} out r={10} color={C.minus} />
          <SvgTex x={88} y={256} tex="I_2=2I_1" color={C.minus} fontSize={13} width={86} />
          <CurrentSymbol x={310} y={256} out={false} r={10} color={C.warn} />
          <SvgTex x={328} y={256} tex="I_2=6I_1" color={C.warn} fontSize={13} width={86} />
        </g>
      )}
    </g>
  );
}

/* ---------- Задача 7 · P30.72 · Два проводника по −x ---------- */

const P7_O = { x: 240, y: 138 };
const P7_LEFT = 155;
const P7_RIGHT = 325;

function p7Figure(phase: number) {
  const gx0 = 70;
  const gx1 = 430;
  const gy0 = 340;
  const graphPath = Array.from({ length: 81 }, (_, i) => {
    const u = (4 * i) / 80;
    const normalized = u === 0 ? 0 : (2 * u) / (1 + u * u);
    const x = gx0 + ((gx1 - gx0) * u) / 4;
    const y = gy0 - 80 * normalized;
    return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");
  const q = { x: P7_O.x, y: 70 };

  return (
    <g>
      <Arrow x1={58} y1={P7_O.y} x2={430} y2={P7_O.y} color={C.faint} width={1.4} />
      <Arrow x1={P7_O.x} y1={218} x2={P7_O.x} y2={22} color={C.faint} width={1.4} />
      <SvgTex x={430} y={P7_O.y - 12} tex="y" color={C.mut} width={24} anchor="end" />
      <SvgTex x={P7_O.x + 12} y={22} tex="z" color={C.mut} width={24} />
      <SvgTex x={P7_O.x + 12} y={P7_O.y + 22} tex="O" color={C.wire} width={28} />
      <circle cx={P7_O.x} cy={P7_O.y} r={4} fill={C.wire} />

      {[P7_LEFT, P7_RIGHT].map((x) => (
        <g key={x}>
          {[30, 58].map((r) => <circle key={r} cx={x} cy={P7_O.y} r={r} fill="none" stroke={C.faint} strokeWidth={1.2} strokeDasharray="5 5" />)}
          <Arrow x1={x - 10} y1={P7_O.y - 58} x2={x + 10} y2={P7_O.y - 58} color={C.minus} width={1.7} />
          <Arrow x1={x + 58} y1={P7_O.y - 10} x2={x + 58} y2={P7_O.y + 10} color={C.minus} width={1.7} />
          <CurrentSymbol x={x} y={P7_O.y} out={false} r={13} color={C.warn} />
        </g>
      ))}
      <SvgTex x={P7_LEFT} y={P7_O.y + 26} tex="-a" color={C.mut} width={30} anchor="middle" />
      <SvgTex x={P7_RIGHT} y={P7_O.y + 26} tex="+a" color={C.mut} width={34} anchor="middle" />
      <SvgTex x={30} y={26} tex={String.raw`I_1=I_2=8\,\mathrm A,\quad\vec I\parallel-\hat x`} color={C.wire} fontSize={12.5} width={230} />
      <SvgTex x={P7_O.x} y={198} tex={String.raw`2a=6\,\mathrm{cm}`} color={C.mut} fontSize={12.5} width={104} anchor="middle" />
      <circle cx={q.x} cy={q.y} r={4} fill={C.wire} />
      <SvgTex x={q.x - 10} y={q.y - 14} tex="P(0,0,z)" color={C.wire} fontSize={12} width={78} anchor="end" />

      {phase >= 1 && (
        <g className="animate-rise" opacity={phase === 1 ? 1 : 0.25} style={{ transition: "opacity 180ms ease-out" }}>
          <Arrow x1={P7_O.x - 20} y1={P7_O.y} x2={P7_O.x - 20} y2={P7_O.y + 38} color={C.minus} width={2.2} />
          <SvgTex x={P7_O.x - 28} y={P7_O.y + 34} tex={String.raw`\vec B_1`} color={C.minus} fontSize={12.5} width={48} anchor="end" />
          <Arrow x1={P7_O.x + 20} y1={P7_O.y} x2={P7_O.x + 20} y2={P7_O.y - 38} color={C.plus} width={2.2} />
          <SvgTex x={P7_O.x + 30} y={P7_O.y - 30} tex={String.raw`\vec B_2`} color={C.plus} fontSize={12.5} width={48} />
          <Arrow x1={q.x} y1={q.y} x2={q.x + 48} y2={q.y + 34} color={C.minus} width={2.2} texLabel={String.raw`\vec B_1`} texLabelWidth={48} />
          <Arrow x1={q.x} y1={q.y} x2={q.x + 48} y2={q.y - 34} color={C.plus} width={2.2} texLabel={String.raw`\vec B_2`} texLabelWidth={48} />
        </g>
      )}

      {phase >= 2 && (
        <g className="animate-rise" opacity={phase === 2 ? 1 : 0.25} style={{ transition: "opacity 180ms ease-out" }}>
          <Arrow x1={q.x} y1={q.y} x2={q.x + 98} y2={q.y} color={C.ok} width={3.2} texLabel={String.raw`\vec B(z)\parallel+\hat y`} texLabelWidth={126} />
        </g>
      )}

      {phase >= 3 && (
        <g className="animate-rise">
          <Arrow x1={gx0} y1={gy0} x2={gx1} y2={gy0} color={C.mut} width={1.4} />
          <Arrow x1={gx0} y1={gy0} x2={gx0} y2={244} color={C.mut} width={1.4} />
          <path d={graphPath} fill="none" stroke={C.ok} strokeWidth={3} />
          <line x1={gx0 + 90} y1={gy0} x2={gx0 + 90} y2={260} stroke={C.faint} strokeWidth={1.3} strokeDasharray="4 4" />
          <circle cx={gx0 + 90} cy={260} r={5.5} fill={C.warn} />
          <SvgTex x={gx0 + 90} y={gy0 + 16} tex="1" color={C.mut} fontSize={11.5} width={20} anchor="middle" />
          <SvgTex x={gx1} y={gy0 + 16} tex="z/a" color={C.mut} fontSize={12} width={38} anchor="end" />
          <SvgTex x={gx0 - 10} y={247} tex={String.raw`B/B_{\max}`} color={C.mut} fontSize={12} width={70} anchor="end" />
          <SvgTex x={gx0 + 102} y={248} tex="z=a" color={C.warn} fontSize={12} width={42} />
          <SvgTex x={gx1} y={248} tex={String.raw`B_{\max}=53.3\,\mu\mathrm T`} color={C.ok} fontSize={12.5} width={132} anchor="end" />
        </g>
      )}
    </g>
  );
}

/* ---------- Задача 8 · P30.76 · Квадратен контур по оста ---------- */

/**
 * Косоъгълна проекция по учебника (SJ, фиг. P30.76): квадратът е почти
 * фронтален (вертикални страни, горният/долният ръб леко се вдигат надясно),
 * а оста излиза от центъра към зрителя — надолу-надясно към P.
 */
const P8_C = { x: 150, y: 148 };
const P8_TL = { x: 72, y: 82 };
const P8_TR = { x: 228, y: 50 };
const P8_BR = { x: 228, y: 214 };
const P8_BL = { x: 72, y: 246 };
const P8_P = { x: 337, y: 253 };

function p8Figure(phase: number) {
  const topMid = { x: (P8_TL.x + P8_TR.x) / 2, y: (P8_TL.y + P8_TR.y) / 2 };
  const axisLen = Math.hypot(P8_P.x - P8_C.x, P8_P.y - P8_C.y);
  const ux = (P8_P.x - P8_C.x) / axisLen;
  const uy = (P8_P.y - P8_C.y) / axisLen;
  // Единичен вектор по горния ръб (за шеврона на тока)
  const topLen = Math.hypot(P8_TR.x - P8_TL.x, P8_TR.y - P8_TL.y);
  const ex = (P8_TR.x - P8_TL.x) / topLen;
  const ey = (P8_TR.y - P8_TL.y) / topLen;
  // Ъгли при P към средата и към края на горната страна (за дъгата θ)
  const aMid = Math.atan2(topMid.y - P8_P.y, topMid.x - P8_P.x);
  const aEnd = Math.atan2(P8_TR.y - P8_P.y, P8_TR.x - P8_P.x);

  return (
    <g>
      {/* Диагоналите определят центъра (както във фигурата от учебника) */}
      <line x1={P8_TL.x} y1={P8_TL.y} x2={P8_BR.x} y2={P8_BR.y} stroke={C.faint} strokeWidth={1.2} strokeDasharray="5 5" />
      <line x1={P8_TR.x} y1={P8_TR.y} x2={P8_BL.x} y2={P8_BL.y} stroke={C.faint} strokeWidth={1.2} strokeDasharray="5 5" />

      <polygon points={`${P8_TL.x},${P8_TL.y} ${P8_TR.x},${P8_TR.y} ${P8_BR.x},${P8_BR.y} ${P8_BL.x},${P8_BL.y}`} fill="none" stroke={C.wire} strokeWidth={3.5} />

      {/* Ток обратно на час. стрелка (гледано откъм P): десен ръб нагоре — както в SJ */}
      <Arrow x1={P8_TR.x} y1={185} x2={P8_TR.x} y2={131} color={C.warn} width={3} />
      <SvgTex x={P8_TR.x + 14} y={158} tex="I" color={C.warn} width={24} />
      <Arrow x1={P8_TL.x + 113 * ex} y1={P8_TL.y + 113 * ey} x2={P8_TL.x + 83 * ex} y2={P8_TL.y + 83 * ey} color={C.warn} width={2.2} />
      <Arrow x1={P8_TL.x} y1={138} x2={P8_TL.x} y2={172} color={C.warn} width={2.2} />
      <Arrow x1={P8_BL.x + 43 * ex} y1={P8_BL.y + 43 * ey} x2={P8_BL.x + 73 * ex} y2={P8_BL.y + 73 * ey} color={C.warn} width={2.2} />

      {/* Размерни линии: L отгоре (хоризонтална) и L отляво (вертикална) */}
      <line x1={P8_TL.x} y1={P8_TL.y - 6} x2={P8_TL.x} y2={26} stroke={C.mut} strokeWidth={1.1} />
      <line x1={P8_TR.x} y1={P8_TR.y - 6} x2={P8_TR.x} y2={26} stroke={C.mut} strokeWidth={1.1} />
      <Arrow x1={P8_C.x} y1={32} x2={P8_TL.x + 1} y2={32} color={C.mut} width={1.2} />
      <Arrow x1={P8_C.x} y1={32} x2={P8_TR.x - 1} y2={32} color={C.mut} width={1.2} />
      <SvgTex x={P8_C.x} y={28} tex="L" color={C.mut} width={26} anchor="middle" />
      <line x1={P8_TL.x - 6} y1={P8_TL.y} x2={38} y2={P8_TL.y} stroke={C.mut} strokeWidth={1.1} />
      <line x1={P8_BL.x - 6} y1={P8_BL.y} x2={38} y2={P8_BL.y} stroke={C.mut} strokeWidth={1.1} />
      <Arrow x1={44} y1={(P8_TL.y + P8_BL.y) / 2} x2={44} y2={P8_TL.y + 1} color={C.mut} width={1.2} />
      <Arrow x1={44} y1={(P8_TL.y + P8_BL.y) / 2} x2={44} y2={P8_BL.y - 1} color={C.mut} width={1.2} />
      <SvgTex x={34} y={(P8_TL.y + P8_BL.y) / 2 + 5} tex="L" color={C.mut} width={26} anchor="end" />

      {/* Оста през центъра, перпендикулярна на равнината (малкият прав ъгъл я маркира) */}
      <line x1={P8_C.x} y1={P8_C.y} x2={P8_P.x} y2={P8_P.y} stroke={C.mut} strokeWidth={1.5} />
      <path
        d={`M ${P8_C.x + 11 * ux} ${P8_C.y + 11 * uy} L ${P8_C.x + 11 * ux} ${P8_C.y + 11 * uy - 11} L ${P8_C.x} ${P8_C.y - 11}`}
        fill="none"
        stroke={C.mut}
        strokeWidth={1.3}
      />
      <SvgTex x={255} y={238} tex="x" color={C.mut} width={26} anchor="middle" />
      <circle cx={P8_C.x} cy={P8_C.y} r={4} fill={C.wire} />
      <circle cx={P8_P.x} cy={P8_P.y} r={5} fill={C.wire} />
      <SvgTex x={P8_P.x + 12} y={P8_P.y - 10} tex="P" color={C.wire} width={28} />

      {phase >= 1 && (
        <g className="animate-rise" opacity={phase === 1 ? 1 : 0.25} style={{ transition: "opacity 180ms ease-out" }}>
          <polygon
            points={`${topMid.x},${topMid.y} ${P8_C.x},${P8_C.y} ${P8_P.x},${P8_P.y}`}
            fill={C.minus}
            fillOpacity={0.08}
            stroke={C.minus}
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
          <line x1={topMid.x} y1={topMid.y} x2={P8_C.x} y2={P8_C.y} stroke={C.plus} strokeWidth={2.4} />
          <line x1={P8_TL.x} y1={P8_TL.y} x2={P8_TR.x} y2={P8_TR.y} stroke={C.plus} strokeWidth={5} strokeLinecap="round" opacity={0.9} />
          <line x1={topMid.x} y1={topMid.y} x2={P8_P.x} y2={P8_P.y} stroke={C.minus} strokeWidth={1.5} strokeDasharray="5 4" />
          <line x1={P8_TL.x} y1={P8_TL.y} x2={P8_P.x} y2={P8_P.y} stroke={C.faint} strokeWidth={1.2} strokeDasharray="4 4" />
          <line x1={P8_TR.x} y1={P8_TR.y} x2={P8_P.x} y2={P8_P.y} stroke={C.faint} strokeWidth={1.2} strokeDasharray="4 4" />
          <SvgTex x={286} y={132} tex={String.raw`\rho=\sqrt{x^2+L^2/4}`} color={C.minus} fontSize={12} width={142} anchor="middle" />
          <SvgTex x={192} y={46} tex="L/2" color={C.plus} fontSize={12} width={42} anchor="middle" />
          <AngleArc cx={P8_P.x} cy={P8_P.y} a1={aMid} a2={aEnd} r={30} color={C.plus} texLabel={String.raw`\theta`} />
        </g>
      )}

      {phase >= 2 && (
        <g className="animate-rise" opacity={phase === 2 ? 1 : 0.25} style={{ transition: "opacity 180ms ease-out" }}>
          <Arrow x1={P8_P.x - 4} y1={P8_P.y - 2} x2={P8_P.x + 52 * ux} y2={P8_P.y + 52 * uy} color={C.minus} width={2.2} />
          <Arrow x1={P8_P.x - 9} y1={P8_P.y + 5} x2={P8_P.x + 34} y2={P8_P.y - 11} color={C.plus} width={2} />
          <Arrow x1={P8_P.x - 12 * ux} y1={P8_P.y - 12 * uy} x2={P8_P.x - 12 * ux} y2={P8_P.y - 12 * uy - 44} color={C.faint} width={1.5} dashed />
          <Arrow x1={P8_P.x - 12 * ux} y1={P8_P.y - 12 * uy} x2={P8_P.x - 12 * ux} y2={P8_P.y - 12 * uy + 44} color={C.faint} width={1.5} dashed />
        </g>
      )}
    </g>
  );
}

/* ---------- Данните на задачите ---------- */

export const bioSavartProblems: GuidedProblemData[] = [
  {
    title: "Кръгов контур",
    statement:
      "Кръгов контур с радиус $R$ носи ток $I$ обратно на часовниковата стрелка. Намерете магнитното поле в центъра $P$ на контура.",
    figure: p1Figure,
    figureCaption: (phase) =>
      phase >= 2
        ? String.raw`Приносите $d\vec B$ са еднопосочни; резултантата е $\odot$ навън от екрана.`
        : phase >= 1
          ? String.raw`За всеки елемент $d\vec l$ полето $d\vec B$ сочи $\odot$ навън от екрана.`
          : undefined,
    directionQuestion: {
      prompt: "Каква ще бъде посоката на всяко $d\\vec B$ в центъра?",
      options: [
        { text: "Всички $d\\vec B$ сочат ⊙ навън от екрана", correct: true },
        { text: "Всички $d\\vec B$ сочат ⊗ навътре в екрана", correct: false },
        { text: "Различни елементи дават различни посоки", correct: false },
      ],
      explanation:
        "Приложете дясната ръка към няколко елемента: палецът по тока (обратно на часовниковата стрелка), и за **всеки** елемент $d\\vec l$ векторът $d\\vec l\\times\\hat r$ сочи навън от екрана. Симетрията тук работи в наша полза — всички приноси са еднопосочни.",
    },
    additionQuestion: {
      prompt: "Тези магнитни полета ще се събират или ще се компенсират?",
      options: [
        { text: "Събират се — всички $d\\vec B$ са в една и съща посока", correct: true },
        { text: "Срещуположните елементи се компенсират по двойки", correct: false },
        { text: "Частично се компенсират", correct: false },
      ],
      explanation:
        "Срещуположните елементи имат противоположни $d\\vec l$, но са и от противоположната страна на $P$ — двете обръщания се неутрализират и $d\\vec B$ им е в **същата** посока. Затова интегралът се превръща в обикновена сума от модули.",
    },
    hints: [
      "Разстоянието от всеки елемент до центъра е едно и също: $r = R$.",
      "Какъв е ъгълът между $d\\vec l$ (допирателна) и $\\hat r$ (радиус)? Колко е $\\sin 90^\\circ$?",
    ],
    steps: [
      {
        text: "За всеки елемент $d\\vec{l}$ радиусът е перпендикулярен на допирателната, затова $\\sin\\theta = 1$ и законът на Био-Савар дава:",
        latex: String.raw`dB = \frac{\mu_0}{4\pi}\,\frac{I\,dl\,\sin 90^\circ}{R^2} = \frac{\mu_0 I}{4\pi R^2}\,dl`,
      },
      {
        text: "Всички $d\\vec B$ са еднопосочни (⊙), затова просто събираме дължините на елементите — а те дават цялата обиколка $2\\pi R$:",
        latex: String.raw`B = \frac{\mu_0 I}{4\pi R^2}\oint dl = \frac{\mu_0 I}{4\pi R^2}\cdot 2\pi R`,
      },
      {
        text: "Съкращаваме и получаваме класическия резултат (посока ⊙ навън, по дясната ръка):",
        latex: String.raw`B = \frac{\mu_0 I}{2R}`,
      },
    ],
    teacherNotes: [
      "Най-честата грешка: ученикът се опитва да интегрира векторно („ама те сочат в различни посоки по контура“) — върнете го към първия въпрос: $d\\vec B$ е перпендикулярно на **равнината** на контура, не лежи в нея.",
      "Диагностичен въпрос: „при ток по часовниковата стрелка какво се променя?“ ($\\vec B$ се обръща на ⊗).",
      "Мнозина забравят $\\sin\\theta = 1$ и носят $\\sin$ в интеграла — попитайте „кой ъгъл точно стои във формулата?“",
    ],
  },
  {
    title: "Полуокръжност",
    statement:
      "Проводник се състои от две прави полубезкрайни части, лежащи на една права, свързани с полуокръжност с радиус $R$ около точка $P$. Токът е $I$. Намерете магнитното поле в $P$.",
    figure: p2Figure,
    figureCaption: (phase) =>
      phase >= 2
        ? "Правите части дават нула, затова резултантата се определя само от дъгата."
        : phase >= 1
          ? String.raw`По правите части $d\vec l\parallel\hat r$; по дъгата всички $d\vec B$ са еднопосочни.`
          : undefined,
    directionQuestion: {
      prompt: "Каква ще бъде посоката на всяко $d\\vec B$ в точка $P$?",
      options: [
        { text: "Правите части не дават принос; дъгата дава $d\\vec B$ ⊗ навътре", correct: true },
        { text: "Всички части дават $d\\vec B$ ⊗ навътре", correct: false },
        { text: "Правите дават ⊙, дъгата — ⊗", correct: false },
      ],
      explanation:
        "За правите части $d\\vec l$ е **успореден** на $\\hat r$ (лежат на една права през $P$), а $d\\vec l\\times\\hat r=0$ при успоредни вектори — нулев принос, без никакво смятане! За дъгата дясната ръка дава ⊗ (токът минава по горницата отляво надясно — по часовниковата стрелка спрямо $P$).",
    },
    additionQuestion: {
      prompt: "Приносите на елементите от дъгата ще се събират или ще се компенсират?",
      options: [
        { text: "Събират се — всички $d\\vec B$ от дъгата са ⊗", correct: true },
        { text: "Лявата половина компенсира дясната", correct: false },
        { text: "Дъгата се компенсира с правите части", correct: false },
      ],
      explanation:
        "Точно като при пълния кръг, всеки елемент от дъгата дава $d\\vec B$ в **същата** посока (⊗). Правите части дават нула, така че няма какво да компенсират.",
    },
    hints: [
      "Разгледайте внимателно $d\\vec{l}\\times\\hat{r}$ за елемент от правата част. Какъв е ъгълът между двата вектора?",
      "Полуокръжността е точно половината от контура в Задача 1.",
    ],
    steps: [
      {
        text: "Правите части: $d\\vec{l} \\parallel \\hat{r}$, следователно за всеки техен елемент:",
        latex: String.raw`|d\vec{l}\times\hat{r}| = dl\,\sin 0^\circ = 0`,
      },
      {
        text: "Остава само дъгата — половин обиколка $\\pi R$ на разстояние $R$, всички приноси еднопосочни:",
        latex: String.raw`B = \frac{\mu_0 I}{4\pi R^2}\cdot \pi R`,
      },
      {
        text: "Полето е точно **половината** от това на пълния кръг, с посока ⊗:",
        latex: String.raw`B = \frac{\mu_0 I}{4R}`,
      },
    ],
    teacherNotes: [
      "Класическа грешка: ученикът прилага формулата за краен прав проводник към правите части и получава ненулев принос. Причината за нулата е $a = 0$ — точката лежи НА правата на проводника, $\\sin\\theta$ гледа тъкмо този случай.",
      "Втора грешка: посоката. Токът по горната дъга отляво надясно е по часовниковата стрелка около $P$ → ⊗. Нека ученикът го провери с ръката си, не наум.",
      "Добър последващ въпрос: „а ако дъгата беше 3/4 окръжност?“ (отговор: $3\\mu_0 I/8R$).",
    ],
  },
  {
    title: "Квадратен контур",
    statement:
      "Квадратен контур със страна $a$ носи ток $I$ обратно на часовниковата стрелка. Намерете магнитното поле в центъра $P$ на квадрата.",
    figure: p3Figure,
    figureCaption: (phase) =>
      phase >= 2
        ? String.raw`Четирите равни приноса се събират в резултантно поле $\odot$ навън от екрана.`
        : phase >= 1
          ? String.raw`Всяка страна дава поле $\odot$ навън; помощните линии показват крайните ъгли за една страна.`
          : undefined,
    directionQuestion: {
      prompt: "Каква ще бъде посоката на $d\\vec B$ от всяка от четирите страни?",
      options: [
        { text: "Всяка страна дава $d\\vec B$ ⊙ навън от екрана", correct: true },
        { text: "Срещуположните страни дават противоположни $d\\vec B$", correct: false },
        { text: "Хоризонталните дават ⊙, вертикалните — ⊗", correct: false },
      ],
      explanation:
        "Пак дясната ръка, страна по страна: токът обикаля обратно на часовниковата стрелка, затова **всяка** страна „върти“ полето в центъра навън от екрана (⊙). Същата логика като при кръга — контурът е просто „ъгловат кръг“.",
    },
    additionQuestion: {
      prompt: "Полетата на четирите страни ще се събират или ще се компенсират?",
      options: [
        { text: "Събират се — 4 еднакви еднопосочни приноса", correct: true },
        { text: "Лява/дясна и горна/долна двойки се компенсират", correct: false },
        { text: "Частично се компенсират", correct: false },
      ],
      explanation:
        "Четирите страни са симетрични спрямо центъра и всичките дават ⊙ → общото поле е точно $4\\times$ приноса на една страна. Интуицията „срещуположните се борят“ важи за успоредни прави с еднакви токове, но тук токът **обикаля** — обратната страна носи ток в обратна посока и приносът ѝ пак е ⊙.",
    },
    hints: [
      "Една страна е краен проводник. На какво разстояние от центъра е тя и какви са двата ъгъла към краищата ѝ?",
      "Вижте фигурата: $a/2$ и два ъгъла по $45^\\circ$. Използвайте $B = \\dfrac{\\mu_0 I}{4\\pi a_\\perp}(\\sin\\theta_1+\\sin\\theta_2)$ от §4.",
    ],
    steps: [
      {
        text: "Една страна: краен проводник на перпендикулярно разстояние $a/2$ от $P$, с ъгли $\\theta_1=\\theta_2=45^\\circ$ към краищата (виж дъгите на фигурата):",
        latex: String.raw`B_{\text{страна}} = \frac{\mu_0 I}{4\pi\,(a/2)}\left(\sin 45^\circ + \sin 45^\circ\right) = \frac{\mu_0 I}{2\pi a}\cdot\sqrt{2}`,
      },
      {
        text: "Четирите страни дават равни, еднопосочни приноси (Q2!), затова умножаваме по 4:",
        latex: String.raw`B = 4\cdot\frac{\sqrt{2}\,\mu_0 I}{2\pi a}`,
      },
      {
        text: "Опростяваме — поле в центъра на квадратен контур (посока ⊙):",
        latex: String.raw`B = \frac{2\sqrt{2}\,\mu_0 I}{\pi a}`,
      },
    ],
    teacherNotes: [
      "Двете места, където се греши почти винаги: разстоянието е $a/2$ (не $a$) и ъглите са $45^\\circ$ (не $90^\\circ$). Фигурата ги показва точно за да се посочат с пръст.",
      "Ако ученикът напише $\\sin\\theta_1 + \\sin\\theta_2 = \\sin 90^\\circ$ — върнете го към §4: ъглите се мерят от перпендикуляра към **всеки край поотделно**.",
      "Хубава проверка за края: кръг с „диаметър“ $a$ дава $\\mu_0 I/a$ — квадратът дава малко по-малко ($\\approx 0.9\\,\\mu_0 I/a$). Звучи ли правдоподобно, че е същият мащаб?",
    ],
  },
  {
    title: "Две успоредни жици",
    statement:
      "Два дълги успоредни проводника на разстояние $d$ носят еднакви по големина токове $I$, и двата насочени навън от екрана (⊙). Намерете магнитното поле в точка $P$ по средата между тях. А ако токовете бяха противоположни?",
    figure: p4Figure,
    figureCaption: (phase) =>
      phase >= 3
        ? "При противоположни токове двата приноса между проводниците стават еднопосочни."
        : phase >= 2
          ? String.raw`При еднакви токове и симетрична точка приносите са равни и противоположни: $\vec B=0$.`
          : phase >= 1
            ? String.raw`Дясната ръка дава противоположни посоки за $\vec B_1$ и $\vec B_2$ в средата.`
            : undefined,
    figureHeight: 260,
    directionQuestion: {
      prompt: "Каква ще бъде посоката на $\\vec B_1$ и $\\vec B_2$ в $P$?",
      options: [
        { text: "$\\vec B_1$ сочи нагоре, $\\vec B_2$ — надолу", correct: true },
        { text: "И двете сочат нагоре (еднопосочни)", correct: false },
        { text: "И двете сочат към проводниците", correct: false },
      ],
      explanation:
        "Ток ⊙ (към наблюдателя) върти полето обратно на часовниковата стрелка. Спрямо **левия** проводник $P$ е отдясно → $\\vec B_1$ е нагоре. Спрямо **десния** проводник $P$ е отляво → $\\vec B_2$ е надолу. Еднакви токове, но $P$ ги „вижда“ от противоположни страни!",
    },
    additionQuestion: {
      prompt: "Тези магнитни полета ще се събират или ще се компенсират?",
      options: [
        { text: "Напълно се компенсират — $\\vec B=0$", correct: true },
        { text: "Събират се — $B=2B_1$", correct: false },
        { text: "Частично се компенсират", correct: false },
      ],
      explanation:
        "$P$ е на равни разстояния $d/2$, затова $|\\vec B_1|=|\\vec B_2|$, а посоките са противоположни → **точно нула**. Всичко се реши от геометрията, преди да напишем и една формула.",
    },
    hints: [
      "Използвайте интерактива от §2: къде е $P$ спрямо всеки от проводниците поотделно?",
      "Симетрична ли е задачата спрямо средата? Какво следва за големините?",
    ],
    steps: [
      {
        text: "Големина на полето на всеки проводник в $P$ (безкраен проводник, §5, на разстояние $d/2$):",
        latex: String.raw`B_1 = B_2 = \frac{\mu_0 I}{2\pi\,(d/2)} = \frac{\mu_0 I}{\pi d}`,
      },
      {
        text: "Посоките са противоположни (Q1), големините равни → векторната сума е нула:",
        latex: String.raw`\vec{B} = \vec{B}_1 + \vec{B}_2 = \vec{0}`,
      },
      {
        text: "Ако токовете са **противоположни** (единият ⊙, другият ⊗): $\\vec B_2$ се обръща, двата вектора стават еднопосочни и вместо да се унищожат, се удвояват:",
        latex: String.raw`B = 2\cdot\frac{\mu_0 I}{\pi d} = \frac{2\mu_0 I}{\pi d}`,
      },
    ],
    teacherNotes: [
      "Точно тук се къса нишката при повечето ученици: механично събират модулите $B_1 + B_2$, без да питат за посоките. Двата въпроса преди решението са в този ред нарочно.",
      "Контраинтуитивното: еднакви токове → нула по средата; противоположни токове → максимум. Мнозина очакват обратното („еднаквите се подсилват“). Върнете към първия въпрос: посоката зависи от това **от коя страна на проводника** се намира точката.",
      "Идея за разширение: а извън двата проводника? (Полетата вече не са антипаралелни навсякъде — добра тема за самостоятелна работа с интерактива от §3.)",
    ],
  },
  {
    title: "Проводник под прав ъгъл",
    statement:
      "Проводник е огънат под прав ъгъл в точка $O$: токът $I$ идва по хоризонталното рамо и завива нагоре по вертикалното. Намерете магнитното поле в точка $P$, която лежи на продължението на хоризонталното рамо, на разстояние $d$ от $O$.",
    figure: p5Figure,
    figureCaption: (phase) =>
      phase >= 2
        ? String.raw`Хоризонталното рамо дава нула; остава полето $\otimes$ от вертикалното рамо.`
        : phase >= 1
          ? String.raw`За хоризонталното рамо $d\vec l\parallel\hat r$, следователно $d\vec B=0$.`
          : undefined,
    directionQuestion: {
      prompt: "Каква ще бъде посоката на $d\\vec B$ от всяко от двете рамена в $P$?",
      options: [
        { text: "Хоризонталното рамо: $d\\vec B=0$; вертикалното: $d\\vec B$ ⊗", correct: true },
        { text: "И двете рамена дават $d\\vec B$ ⊗", correct: false },
        { text: "Хоризонталното дава ⊙, вертикалното ⊗", correct: false },
      ],
      explanation:
        "$P$ лежи на **правата на хоризонталното рамо** → за всеки негов елемент $d\\vec{l} \\parallel \\hat{r}$ и приносът е нула (както правите части в Задача 2). За вертикалното рамо: ток нагоре, $P$ е отдясно → дясната ръка дава ⊗.",
    },
    additionQuestion: {
      prompt: "Ще има ли събиране или компенсиране на полета тук?",
      options: [
        { text: "Няма какво да се компенсира — принос дава само вертикалното рамо", correct: true },
        { text: "Двете рамена се компенсират напълно", correct: false },
        { text: "Двете рамена се събират", correct: false },
      ],
      explanation:
        "Едното „поле“ е тъждествено нула, така че въпросът събиране/компенсиране се решава тривиално: остава само приносът на вертикалното рамо. Затова винаги първо питаме за посоките — половината задача изчезна.",
    },
    hints: [
      "Сравнете хоризонталното рамо с правите части от Задача 2.",
      "Вертикалното рамо е **полубезкраен** проводник: какви са двата му ъгъла спрямо перпендикуляра от $P$? (Внимание: перпендикулярното разстояние тук е $d$.)",
    ],
    steps: [
      {
        text: "Хоризонталното рамо: $P$ е на неговата права, $d\\vec{l}\\times\\hat{r} = 0$ навсякъде → принос нула.",
        latex: String.raw`B_{\text{хориз.}} = 0`,
      },
      {
        text: "Вертикалното рамо: краен проводник от $O$ до $\\infty$, перпендикулярно разстояние $a = d$. Близкият край ($O$) е точно в петата на перпендикуляра → $\\theta_2 = 0^\\circ$; далечният край бяга към безкрайност → $\\theta_1 \\to 90^\\circ$:",
        latex: String.raw`B = \frac{\mu_0 I}{4\pi d}\left(\sin 90^\circ + \sin 0^\circ\right) = \frac{\mu_0 I}{4\pi d}\,(1 + 0)`,
      },
      {
        text: "Резултат — точно **половината** от полето на безкраен проводник, с посока ⊗ (дясната ръка за ток нагоре, $P$ отдясно):",
        latex: String.raw`B = \frac{\mu_0 I}{4\pi d}`,
      },
    ],
    teacherNotes: [
      "Полубезкрайният проводник е идеалният тест дали формулата от §4 е разбрана или наизустена: единият ъгъл е $90^\\circ$, другият $0^\\circ$ — и това се ВИЖДА от фигурата, не се помни.",
      "Честа грешка: мерят $d$ от края на вертикалното рамо по диагонал, вместо перпендикулярното разстояние от $P$ до правата на рамото.",
      "Свържете с §5: $\\mu_0 I/4\\pi d$ е точно половината от $\\mu_0 I/2\\pi d$. Защо „половин проводник → половин поле“ работи тук? (Защото приносите са еднопосочни и адитивни.)",
    ],
  },
  {
    title: "P30.9 · Две възможни стойности на тока",
    statement:
      "Два безкрайни проводника пробождат равнината при $x=a$ и $x=-2a$. Първият носи ток $I_1$ навътре в екрана (⊗), а посоката и големината на $I_2$ са неизвестни. В началото $O$ е измерено $|\\vec B(O)|=2\\mu_0I_1/(2\\pi a)$. Намерете **двете** възможности за $I_2$.",
    figure: p6Figure,
    figureCaption: (phase) =>
      phase >= 3
        ? "Случай A: $I_2=2I_1$ навън. Случай B: $I_2=6I_1$ навътре."
        : phase >= 2
          ? String.raw`Има две допустими резултанти: A — $+2B_0\hat y$; B — $-2B_0\hat y$.`
          : phase >= 1
            ? "Първият принос е фиксиран; посоката на втория зависи от неизвестната посока на $I_2$."
            : undefined,
    figureHeight: 330,
    directionQuestion: {
      prompt: "Как се насочва $\\vec B_2$ в $O$ при двете възможни посоки на $I_2$?",
      options: [
        { text: "$I_2$ навън (⊙) дава $\\vec B_2$ нагоре; $I_2$ навътре (⊗) — надолу", correct: true },
        { text: "$I_2$ навън (⊙) дава $\\vec B_2$ надолу; $I_2$ навътре (⊗) — нагоре", correct: false },
        { text: "Посоката на $I_2$ не променя $\\vec B_2$", correct: false },
      ],
      explanation:
        "Точката $O$ е **вдясно** от проводника при $x=-2a$. Ток ⊙ създава поле обратно на часовниковата стрелка, следователно вдясно полето сочи нагоре. При ток ⊗ цялото поле се обръща и сочи надолу.",
    },
    additionQuestion: {
      prompt: "Ако $B_0=\\mu_0I_1/(2\\pi a)$ и $\\vec B_1=+B_0\\hat y$, кои две стойности на подписания принос $b_2$ дават $|\\vec B|=2B_0$?",
      options: [
        { text: "$b_2=+B_0$ или $b_2=-3B_0$", correct: true },
        { text: "$b_2=+2B_0$ или $b_2=-2B_0$", correct: false },
        { text: "Само $b_2=+B_0$", correct: false },
      ],
      explanation:
        "Измерен е **модулът**, не посоката. Резултантата може да бъде $+2B_0\\hat y$ или $-2B_0\\hat y$. От $B_0+b_2=+2B_0$ следва $b_2=+B_0$; от $B_0+b_2=-2B_0$ следва $b_2=-3B_0$.",
    },
    hints: [
      "Полето на първия проводник в $O$ е $B_0=\\mu_0I_1/(2\\pi a)$ и сочи нагоре. Защо?",
      "Запишете условието като уравнение с модул: $|B_0+b_2|=2B_0$. Двете възможности идват от двата знака след сваляне на модула.",
      "Вторият проводник е на разстояние $2a$, затова $|B_2|=\\mu_0|I_2|/(4\\pi a)$.",
    ],
    steps: [
      {
        text: "Избираме $+\\hat y$ нагоре. Проводникът $I_1$ е при $x=a$, токът е ⊗ и $O$ е отляво от него; дясната ръка дава поле нагоре:",
        latex: String.raw`\vec B_1=B_0\hat y,\qquad B_0=\frac{\mu_0I_1}{2\pi a}`,
      },
      {
        text: "Нека $b_2$ е подписаната $y$-компонента на полето на втория проводник. Условието за измерения модул има две алгебрични разклонения:",
        latex: String.raw`|B_0+b_2|=2B_0\quad\Longrightarrow\quad B_0+b_2=\pm2B_0`,
      },
      {
        text: "Следователно вторият принос трябва или да добави още $B_0$ нагоре, или да надделее с $3B_0$ надолу:",
        latex: String.raw`b_2=+B_0\qquad\text{или}\qquad b_2=-3B_0`,
      },
      {
        text: "Понеже вторият проводник е на разстояние $2a$, отношението на модулите е $|B_2|/B_0=|I_2|/(2I_1)$. Знакът се превежда чрез геометрията от първия въпрос:",
        latex: String.raw`\boxed{I_2=2I_1\ \text{навън }(\odot)}\qquad\text{или}\qquad\boxed{I_2=6I_1\ \text{навътре }(\otimes)}`,
      },
    ],
    teacherNotes: [
      "Същественото тук е, че уредът дава $|\\vec B|$. Ако ученикът реши само клона $+2B_0$, ще намери само по-малкия ток $2I_1$.",
      "Накарайте ученика първо да нарисува $\\vec B_1$, после двете възможни резултанти $+2B_0\\hat y$ и $-2B_0\\hat y$. Така стойностите $+B_0$ и $-3B_0$ за втория принос се виждат геометрично преди алгебрата.",
      "Проверка на факторите: вторият проводник е два пъти по-далеч. Затова за поле $B_0$ му трябва ток $2I_1$, а за поле $3B_0$ — ток $6I_1$.",
    ],
  },
  {
    title: "P30.72 · Поле на два успоредни проводника по оста z",
    statement:
      "Два безкрайни проводника са успоредни на оста $x$, разположени при $y=\\pm a$, $z=0$, и носят токове $I=8.00\\,\\mathrm A$ по посока $-\\hat x$. Разстоянието между тях е $2a=6.00\\,\\mathrm{cm}$. Скицирайте полето в равнината $yz$, намерете $\\vec B(0)$, изведете $\\vec B(z)$ по положителната ос $z$, границата при $z\\to\\infty$, положението на максимума и $B_{\\max}$.",
    figure: p7Figure,
    figureCaption: (phase) =>
      phase >= 3
        ? "Полето започва от нула, достига максимум при $z=a$ и после отново клони към нула."
        : phase >= 2
          ? String.raw`По оста $z$ напречните компоненти се компенсират, а компонентите по $+\hat y$ се събират.`
          : phase >= 1
            ? String.raw`В $O$ приносите са противоположни; над $O$ те имат равни компоненти по $+\hat y$.`
            : undefined,
    figureHeight: 360,
    directionQuestion: {
      prompt: "Какви са посоките на полетата в началото и в точка $(0,0,z)$ с $z>0$?",
      options: [
        { text: "В $O$ полетата са противоположни; при $z>0$ техните $z$-компоненти се компенсират, а $y$-компонентите се събират", correct: true },
        { text: "В $O$ полетата се събират по $+\\hat z$; при $z>0$ се компенсират напълно", correct: false },
        { text: "Навсякъде по оста $z$ резултантата е по $+\\hat z$", correct: false },
      ],
      explanation:
        "В равнината $yz$ токът $-\\hat x$ се вижда като ⊗ и полето обикаля по часовниковата стрелка. В средата между проводниците двата вектора са вертикални, равни и противоположни. Над тях векторите са огледални: вертикалните компоненти се унищожават, а хоризонталните сочат по $+\\hat y$.",
    },
    additionQuestion: {
      prompt: "Какво следва от симетрията за общото поле по положителната ос $z$?",
      options: [
        { text: "$\\vec B(z)$ е по $+\\hat y$ и намалява към нула при $z\\to\\infty$", correct: true },
        { text: "$\\vec B(z)$ е по $+\\hat z$ и клони към константа", correct: false },
        { text: "$\\vec B(z)=0$ за всяко $z$", correct: false },
      ],
      explanation:
        "Симетрията премахва $z$-компонентата, но удвоява $y$-компонентата. Далеч от двойката всеки проводник дава поле от порядък $1/z$, но водещите им противоположни части се компенсират и общото поле спада към нула.",
    },
    hints: [
      "За всеки проводник разстоянието до точката $(0,0,z)$ е $\\rho=\\sqrt{a^2+z^2}$.",
      "Използвайте векторната форма за безкраен проводник: посоката е тангенциална, а модулът е $\\mu_0I/(2\\pi\\rho)$.",
      "За максимума диференцирайте само функцията $f(z)=z/(a^2+z^2)$.",
    ],
    steps: [
      {
        text: "В равнината $yz$ двата тока са ⊗, затова полевите линии са часовникови окръжности около точките $y=\\pm a$. В началото приносите са равни и противоположни:",
        latex: String.raw`\vec B(0)=\vec B_1(0)+\vec B_2(0)=\vec0`,
      },
      {
        text: "За точка по оста $z$ разстоянието до всеки проводник е $\\rho=\\sqrt{a^2+z^2}$. Двата приноса имат еднакви $y$-компоненти и противоположни $z$-компоненти:",
        latex: String.raw`\vec B_{1,2}=\frac{\mu_0I}{2\pi(a^2+z^2)}\left(z\,\hat y\mp a\,\hat z\right)`,
      },
      {
        text: "Събирането премахва компонентите по $z$ и удвоява компонентата по $y$:",
        latex: String.raw`\boxed{\vec B(z)=\frac{\mu_0Iz}{\pi(a^2+z^2)}\,\hat y}`,
      },
      {
        text: "В началото множителят $z$ дава нула. При много голямо $z$ знаменателят расте като $z^2$, затова полето отново клони към нула:",
        latex: String.raw`\vec B(0)=0,\qquad \lim_{z\to\infty}\vec B(z)=\vec0`,
      },
      {
        text: "За максимума диференцираме скаларния множител. Единственият вътрешен максимум по положителната ос е при $z=a$:",
        latex: String.raw`\frac{d}{dz}\frac{z}{a^2+z^2}=\frac{a^2-z^2}{(a^2+z^2)^2}=0\quad\Longrightarrow\quad z=a=3.00\,\mathrm{cm}`,
      },
      {
        text: "Замествайки $I=8.00\\,\\mathrm A$ и $a=3.00\\,\\mathrm{cm}$, получаваме:",
        latex: String.raw`B_{\max}=\frac{\mu_0I}{2\pi a}=5.33\times10^{-5}\,\mathrm T=\boxed{53.3\,\mu\mathrm T}`,
      },
    ],
    teacherNotes: [
      "Не позволявайте симетрията да бъде формулирана само като „едното се маха“. Ученикът трябва да посочи **коя компонента** се компенсира и **коя** се удвоява.",
      "Полезна проверка: $B(0)=0$ и $B(\\infty)=0$ означават, че между тях задължително има максимум. Това прави резултата $z=a$ интуитивно правдоподобен.",
      "При численото заместване най-честата грешка е $2a=6\\,\\mathrm{cm}$ да бъде използвано като $a=6\\,\\mathrm{cm}$. Маркирайте $a=3\\,\\mathrm{cm}$ още върху чертежа.",
    ],
  },
  {
    title: "P30.76 · Поле по оста на квадратен контур",
    statement:
      "Квадратен проводников контур със страна $L$ носи ток $I$ в показаната на фигурата посока. Точка $P$ е на разстояние $x$ от центъра по оста, перпендикулярна на равнината на контура. Изведете магнитното поле в $P$ и проверете резултата при $x=0$.",
    figure: p8Figure,
    figureCaption: (phase) =>
      phase >= 3
        ? String.raw`След събирането остава само аксиалното поле $\vec B=B_x\hat x$.`
        : phase >= 2
          ? "Напречните компоненти се компенсират, а четирите аксиални компоненти се събират."
          : phase >= 1
            ? "Оцветената страна показва геометрията за един принос; останалите следват по симетрия."
            : undefined,
    figureHeight: 320,
    directionQuestion: {
      prompt: "Как са насочени приносите от четирите страни в точка $P$?",
      options: [
        { text: "Всеки има компонента по оста $x$ в една и съща посока и напречна компонента", correct: true },
        { text: "Всеки принос е изцяло по оста $x$", correct: false },
        { text: "Приносите на срещуположните страни са напълно противоположни", correct: false },
      ],
      explanation:
        "Полето на една крайна страна не е чисто аксиално. Но четирите страни са свързани с ротационната симетрия на квадрата: аксиалните им компоненти сочат еднакво, а напречните са по двойки противоположни.",
    },
    additionQuestion: {
      prompt: "Как се събират компонентите на четирите страни?",
      options: [
        { text: "$\\sum\\vec B_\\perp=0$, а четирите равни $B_x$ се събират", correct: true },
        { text: "$\\sum B_x=0$, а напречните компоненти се събират", correct: false },
        { text: "Всички компоненти се компенсират", correct: false },
      ],
      explanation:
        "Срещуположните страни унищожават напречните си компоненти. По оста остава само $\\hat x$-компонентата, която е четири пъти аксиалния принос на една страна.",
    },
    hints: [
      "Разстоянието от $P$ до правата на една страна е $\\rho=\\sqrt{x^2+L^2/4}$.",
      "За крайния проводник използвайте $B_{\\text{стр.}}=\\mu_0I\\sin\\theta/(2\\pi\\rho)$, където $\\sin\\theta=(L/2)/\\sqrt{x^2+L^2/2}$.",
      "След като намерите модула от една страна, вземете аксиалната му проекция с множител $(L/2)/\\rho$ и чак тогава умножете по четири.",
    ],
    steps: [
      {
        text: "За една страна точката $P$ лежи върху перпендикулярния ѝ среден разрез. Перпендикулярното разстояние и геометричният ъгъл са:",
        latex: String.raw`\rho=\sqrt{x^2+\frac{L^2}{4}},\qquad \sin\theta=\frac{L/2}{\sqrt{\rho^2+L^2/4}}=\frac{L/2}{\sqrt{x^2+L^2/2}}`,
      },
      {
        text: "Формулата за краен прав проводник с два еднакви крайни ъгъла дава модула на полето от една страна:",
        latex: String.raw`B_{\text{стр.}}=\frac{\mu_0I}{2\pi\rho}\sin\theta=\frac{\mu_0IL}{4\pi\rho\sqrt{x^2+L^2/2}}`,
      },
      {
        text: "Този вектор не е изцяло по оста. От геометрията аксиалната проекция носи още множител $(L/2)/\\rho$:",
        latex: String.raw`B_{x,\text{стр.}}=B_{\text{стр.}}\frac{L/2}{\rho}=\frac{\mu_0IL^2}{8\pi\rho^2\sqrt{x^2+L^2/2}}`,
      },
      {
        text: "Напречните компоненти се унищожават, а четирите еднакви аксиални компоненти се събират. С $\\rho^2=x^2+L^2/4$ получаваме:",
        latex: String.raw`\boxed{\vec B(x)=\frac{\mu_0IL^2}{2\pi\left(x^2+L^2/4\right)\sqrt{x^2+L^2/2}}\,\hat x}`,
      },
      {
        text: "Проверка в центъра: формулата трябва да съвпадне с вече намереното поле на квадратен контур от Задача 3:",
        latex: String.raw`B(0)=\frac{2\sqrt2\,\mu_0I}{\pi L}`,
      },
    ],
    teacherNotes: [
      "Най-важната методическа точка: не умножавайте $B_{\\text{стр.}}$ по четири. Първо трябва да се вземе **аксиалната проекция**, защото напречната част се компенсира.",
      "Двата различни корена имат различен произход: $\\sqrt{x^2+L^2/4}$ е разстоянието до правата на страната, а $\\sqrt{x^2+L^2/2}$ е разстоянието до неин край.",
      "Две силни проверки: при $x=0$ се възстановява резултатът за центъра; при $x\\gg L$ полето спада като $1/x^3$, както поле на магнитен дипол с момент $m=IL^2$.",
    ],
  },
];
