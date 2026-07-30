"use client";

import SvgTex from "./SvgTex";
import { Arrow, C, STAGE_BG, STAGE_CLASS } from "./svg";

const RADIAL_ANGLES = Array.from({ length: 8 }, (_, index) => (index * Math.PI) / 4);

function ChargeRing({
  cx,
  cy,
  radius,
  sign,
  color,
}: {
  cx: number;
  cy: number;
  radius: number;
  sign: "+" | "-";
  color: string;
}) {
  return (
    <>
      {RADIAL_ANGLES.map((angle) => (
        <SvgTex
          key={`${sign}-${angle}`}
          x={cx + Math.cos(angle) * radius}
          y={cy + Math.sin(angle) * radius}
          tex={sign}
          color={color}
          width={18}
          anchor="middle"
          fontSize={11}
        />
      ))}
    </>
  );
}

export function SphericalCapacitorFigure() {
  // Платното е прилепнато и квадратно: центърът на фигурата съвпада с центъра
  // на viewBox, за да не увисва чертежът вляво и да се рендва едро.
  const cx = 150;
  const cy = 150;
  const rInner = 54;
  const rOuterSurface = 98;
  const rOuter = 118;
  // Зарядите седят по двете обърнати една към друга повърхности.
  const plusRing = 46;
  const minusRing = 92;
  // Стрелките на полето тръгват след „+" и спират точно преди „-",
  // със същите просвети както в коаксиалното сечение по-долу.
  const arrowStart = 60;
  const arrowEnd = 84;

  return (
    <svg
      viewBox="0 0 300 300"
      className={`${STAGE_CLASS} mx-auto mt-3 block max-w-[360px]`}
      style={{ background: STAGE_BG }}
      role="img"
      aria-label="Напречно сечение на сферичен кондензатор с концентрични проводящи сфери"
    >
      <circle cx={cx} cy={cy} r={rOuter} fill={C.wire} opacity={0.16} stroke={C.wire} strokeWidth={2} />
      <circle cx={cx} cy={cy} r={rOuterSurface} fill={STAGE_BG} stroke={C.minus} strokeWidth={2.5} />
      <circle cx={cx} cy={cy} r={rInner} fill={C.plus} opacity={0.22} stroke={C.plus} strokeWidth={2.5} />
      <ChargeRing cx={cx} cy={cy} radius={plusRing} sign="+" color={C.plus} />
      <ChargeRing cx={cx} cy={cy} radius={minusRing} sign="-" color={C.minus} />
      {RADIAL_ANGLES.map((angle) => (
        <Arrow
          key={angle}
          x1={cx + Math.cos(angle) * arrowStart}
          y1={cy + Math.sin(angle) * arrowStart}
          x2={cx + Math.cos(angle) * arrowEnd}
          y2={cy + Math.sin(angle) * arrowEnd}
          color={C.warn}
          width={1.8}
        />
      ))}
      {/* Водачите тръгват по ъгли между зарядите (символите са на кратни на
          45°), затова етикетите падат в празните междини, не върху „+"/„-". */}
      {(() => {
        const a1 = -Math.PI / 8; // -22.5°: R_1 към вътрешната сфера
        const a2 = Math.PI / 8; //  +22.5°: R_2 към външната повърхност
        return (
          <>
            <line
              x1={cx}
              y1={cy}
              x2={cx + rInner * Math.cos(a1)}
              y2={cy + rInner * Math.sin(a1)}
              stroke={C.plus}
              strokeWidth={1.6}
            />
            <line
              x1={cx}
              y1={cy}
              x2={cx + rOuterSurface * Math.cos(a2)}
              y2={cy + rOuterSurface * Math.sin(a2)}
              stroke={C.minus}
              strokeWidth={1.6}
            />
            <SvgTex
              x={cx + 30 * Math.cos(a1)}
              y={cy + 30 * Math.sin(a1)}
              tex="R_1"
              color={C.plus}
              width={30}
              anchor="middle"
            />
            <SvgTex
              x={cx + (rOuterSurface + 16) * Math.cos(a2)}
              y={cy + (rOuterSurface + 16) * Math.sin(a2)}
              tex="R_2"
              color={C.minus}
              width={30}
              anchor="middle"
            />
          </>
        );
      })()}
      <SvgTex x={cx} y={18} tex={String.raw`\vec E(r)`} color={C.warn} width={42} anchor="middle" />
    </svg>
  );
}

export function IsolatedSphereFigure() {
  // Квадратно платно, сферата в центъра; полето стърчи симетрично навън.
  const cx = 150;
  const cy = 144;
  const r = 64;
  const arrowStart = 74;
  const arrowEnd = 112;

  return (
    <svg
      viewBox="0 0 300 300"
      className={`${STAGE_CLASS} mx-auto mt-3 block max-w-[360px]`}
      style={{ background: STAGE_BG }}
      role="img"
      aria-label="Изолирана заредена проводяща сфера с радиално електрично поле"
    >
      <circle cx={cx} cy={cy} r={r} fill={C.plus} opacity={0.24} stroke={C.plus} strokeWidth={2.5} />
      <ellipse cx={cx} cy={cy} rx={r} ry={22} fill="none" stroke={C.plus} strokeWidth={1.2} opacity={0.6} />
      <ChargeRing cx={cx} cy={cy} radius={r - 8} sign="+" color={C.plus} />
      {RADIAL_ANGLES.map((angle) => (
        <Arrow
          key={angle}
          x1={cx + Math.cos(angle) * arrowStart}
          y1={cy + Math.sin(angle) * arrowStart}
          x2={cx + Math.cos(angle) * arrowEnd}
          y2={cy + Math.sin(angle) * arrowEnd}
          color={C.minus}
          width={1.8}
        />
      ))}
      <line
        x1={cx}
        y1={cy}
        x2={cx + r * Math.cos(-Math.PI / 8)}
        y2={cy + r * Math.sin(-Math.PI / 8)}
        stroke={C.plus}
        strokeWidth={1.6}
      />
      <SvgTex x={180} y={112} tex="R" color={C.plus} width={18} anchor="middle" />
      <SvgTex x={cx} y={276} tex={String.raw`V(\infty)=0`} color={C.warn} width={82} anchor="middle" />
    </svg>
  );
}

export function CoaxialCapacitorFigure() {
  const sectionCx = 472;
  const sectionCy = 158;
  const sectionInner = 34;
  const sectionOuterSurface = 75;
  const sectionOuter = 92;
  const bodyCx = 176;
  const bodyTop = 78;
  const bodyBottom = 246;
  const bodyRx = 80;
  const bodyRy = 23;
  const openingRx = 54;
  const openingRy = 15;
  const rodRx = 24;
  const rodRy = 8;
  const rodTop = 42;
  const rodBottom = bodyTop + 12;

  return (
    <svg
      viewBox="0 0 640 320"
      className={`${STAGE_CLASS} mt-3`}
      style={{ background: STAGE_BG }}
      role="img"
      aria-label="Коаксиален цилиндричен кондензатор с вътрешен и външен проводник"
    >
      <defs>
        <linearGradient id="coax-shell" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={C.minus} stopOpacity={0.12} />
          <stop offset="48%" stopColor={C.minus} stopOpacity={0.34} />
          <stop offset="100%" stopColor={C.minus} stopOpacity={0.12} />
        </linearGradient>
        <linearGradient id="coax-rod" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={C.plus} stopOpacity={0.38} />
          <stop offset="50%" stopColor={C.plus} stopOpacity={0.72} />
          <stop offset="100%" stopColor={C.plus} stopOpacity={0.38} />
        </linearGradient>
      </defs>

      <SvgTex
        x={bodyCx}
        y={18}
        tex={String.raw`\text{пространствен изглед}`}
        color={C.mut}
        width={138}
        anchor="middle"
      />

      {/* Пространствен изглед: външна цилиндрична обвивка с отвор и
          коаксиален вътрешен проводник, както в учебниковата схема. */}
      <path
        d={`M ${bodyCx - bodyRx} ${bodyTop}
            L ${bodyCx - bodyRx} ${bodyBottom}
            A ${bodyRx} ${bodyRy} 0 0 0 ${bodyCx + bodyRx} ${bodyBottom}
            L ${bodyCx + bodyRx} ${bodyTop} Z`}
        fill="url(#coax-shell)"
        stroke={C.minus}
        strokeWidth={2.4}
      />
      <path
        d={`M ${bodyCx - bodyRx} ${bodyBottom}
            A ${bodyRx} ${bodyRy} 0 0 0 ${bodyCx + bodyRx} ${bodyBottom}`}
        fill="none"
        stroke={C.minus}
        strokeWidth={2.4}
      />
      <ellipse
        cx={bodyCx}
        cy={bodyTop}
        rx={bodyRx}
        ry={bodyRy}
        fill={C.minus}
        fillOpacity={0.2}
        stroke={C.minus}
        strokeWidth={2.4}
      />
      <ellipse
        cx={bodyCx}
        cy={bodyTop}
        rx={openingRx}
        ry={openingRy}
        fill={STAGE_BG}
        stroke={C.minus}
        strokeWidth={2.2}
      />

      <rect
        x={bodyCx - rodRx}
        y={rodTop}
        width={2 * rodRx}
        height={rodBottom - rodTop}
        fill="url(#coax-rod)"
      />
      <line x1={bodyCx - rodRx} y1={rodTop} x2={bodyCx - rodRx} y2={rodBottom} stroke={C.plus} strokeWidth={2.2} />
      <line x1={bodyCx + rodRx} y1={rodTop} x2={bodyCx + rodRx} y2={rodBottom} stroke={C.plus} strokeWidth={2.2} />
      <ellipse
        cx={bodyCx}
        cy={rodTop}
        rx={rodRx}
        ry={rodRy}
        fill={C.plus}
        fillOpacity={0.64}
        stroke={C.plus}
        strokeWidth={2.2}
      />
      <path
        d={`M ${bodyCx - openingRx} ${bodyTop}
            Q ${bodyCx} ${bodyTop + 2 * openingRy} ${bodyCx + openingRx} ${bodyTop}`}
        fill="none"
        stroke={C.minus}
        strokeWidth={2.6}
      />
      <SvgTex x={bodyCx} y={62} tex="+Q" color={C.plus} width={34} anchor="middle" />
      <SvgTex x={bodyCx + 68} y={113} tex="-Q" color={C.minus} width={34} anchor="middle" />

      <line x1={282} y1={bodyTop} x2={282} y2={bodyBottom} stroke={C.mut} strokeWidth={1.4} />
      <line x1={275} y1={bodyTop} x2={289} y2={bodyTop} stroke={C.mut} strokeWidth={1.4} />
      <line x1={275} y1={bodyBottom} x2={289} y2={bodyBottom} stroke={C.mut} strokeWidth={1.4} />
      <SvgTex x={300} y={(bodyTop + bodyBottom) / 2} tex="L" color={C.mut} width={24} anchor="middle" />

      <SvgTex
        x={sectionCx}
        y={18}
        tex={String.raw`\text{напречно сечение}`}
        color={C.mut}
        width={124}
        anchor="middle"
      />

      {/* Напречно сечение: радиалното поле е между двете проводящи
          повърхности и завършва върху вътрешната страна на обвивката. */}
      <circle
        cx={sectionCx}
        cy={sectionCy}
        r={sectionOuter}
        fill={C.minus}
        opacity={0.16}
        stroke={C.minus}
        strokeWidth={2.5}
      />
      <circle
        cx={sectionCx}
        cy={sectionCy}
        r={sectionOuterSurface}
        fill={STAGE_BG}
        stroke={C.minus}
        strokeWidth={2.5}
      />
      <circle
        cx={sectionCx}
        cy={sectionCy}
        r={sectionInner}
        fill={C.plus}
        opacity={0.28}
        stroke={C.plus}
        strokeWidth={2.5}
      />
      <ChargeRing cx={sectionCx} cy={sectionCy} radius={28} sign="+" color={C.plus} />
      <ChargeRing cx={sectionCx} cy={sectionCy} radius={68} sign="-" color={C.minus} />
      {RADIAL_ANGLES.map((angle) => (
        <Arrow
          key={angle}
          x1={sectionCx + Math.cos(angle) * 41}
          y1={sectionCy + Math.sin(angle) * 41}
          x2={sectionCx + Math.cos(angle) * 61}
          y2={sectionCy + Math.sin(angle) * 61}
          color={C.warn}
          width={1.8}
        />
      ))}
      <SvgTex x={sectionCx} y={sectionCy + 3} tex="R_1" color={C.plus} width={30} anchor="middle" />
      <SvgTex
        x={sectionCx + 87}
        y={sectionCy + 44}
        tex="R_2"
        color={C.minus}
        width={30}
        anchor="middle"
      />
      <SvgTex
        x={sectionCx}
        y={286}
        tex={String.raw`\vec E(r)`}
        color={C.warn}
        width={42}
        anchor="middle"
      />
    </svg>
  );
}
