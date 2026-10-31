"use client";

import type { ReactNode } from "react";
import RichText from "@/components/RichText";
import { binodal, maxwellConstruction, reducedPressure } from "@/lib/realGas";
import SvgTex from "./SvgTex";
import { Arrow, C, DRAWING_FONT_FAMILY, PANEL_CLASS, STAGE_BG, STAGE_CLASS, TexChip } from "./svg";

/**
 * Статичните чертежи за университетската термодинамика на реалния газ.
 *
 * Всички величини минават през SvgTex; българските думи в сцената са само
 * кратки главни надписи с C.mut, а прозата стои в caption под сцената.
 * Всяка фигура е центрирана в платното си с поле под 10%.
 */

const q = (v: number) => Math.round(v * 100) / 100;

function Scene({
  w,
  h,
  label,
  caption,
  minWidth,
  children,
}: {
  w: number;
  h: number;
  label: string;
  caption?: ReactNode;
  minWidth?: number;
  children: ReactNode;
}) {
  const svg = (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={STAGE_CLASS}
      style={{ fontFamily: DRAWING_FONT_FAMILY, minWidth }}
      role="img"
      aria-label={label}
    >
      <rect width={w} height={h} fill={STAGE_BG} />
      <g stroke={C.faint} opacity={0.12}>
        {Array.from({ length: Math.ceil(w / 26) + 1 }, (_, i) => (
          <line key={`v${i}`} x1={i * 26} y1={0} x2={i * 26} y2={h} />
        ))}
        {Array.from({ length: Math.ceil(h / 26) + 1 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 26} x2={w} y2={i * 26} />
        ))}
      </g>
      {children}
    </svg>
  );
  return (
    <div className={PANEL_CLASS}>
      {minWidth ? <div className="overflow-x-auto">{svg}</div> : svg}
      {caption ? (
        <p className="mt-3 text-[13.5px] leading-relaxed text-muted">{caption}</p>
      ) : null}
    </div>
  );
}

/** Ос със стрелка в края. */
function Axes({ x0, y0, x1, y1 }: { x0: number; y0: number; x1: number; y1: number }) {
  return (
    <g stroke={C.wire} strokeWidth={1.6} fill={C.wire}>
      <line x1={x0} y1={y0} x2={x1} y2={y0} />
      <line x1={x0} y1={y0} x2={x0} y2={y1} />
      <polygon points={`${x1 + 10},${y0} ${x1},${y0 - 5} ${x1},${y0 + 5}`} stroke="none" />
      <polygon points={`${x0},${y1 - 10} ${x0 - 5},${y1} ${x0 + 5},${y1}`} stroke="none" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* §1 на урока за апарата: двата опита, които дават едно и също число  */
/* ------------------------------------------------------------------ */

export function MaxwellBridgeFigure() {
  return (
    <Scene
      w={660}
      h={330}
      label="Два различни опита: калориметрия при изотермно разширение и манометър при нагряване в затворен съд"
      caption={
        <>
          Вляво се мери топлина, вдясно - налягане. Съотношението на Максуел{" "}
          <RichText text={String.raw`$\left(\partial s/\partial\nu\right)_T=\left(\partial p/\partial T\right)_\nu$`} />{" "}
          твърди, че двата опита дават едно и също число. Това е проверимо предсказание, а не
          преобразуване на символи.
        </>
      }
    >
      <line x1={330} y1={40} x2={330} y2={286} stroke={C.faint} strokeDasharray="6 6" />

      {/* Ляво: изотермно разширение, измерена топлина */}
      <text x={146} y={56} fill={C.mut} fontSize={12.5} fontWeight={600} textAnchor="middle" letterSpacing="0.08em">
        КАЛОРИМЕТРИЯ
      </text>
      <rect x={56} y={120} width={180} height={80} fill="none" stroke={C.wire} strokeWidth={2} />
      <rect x={58} y={122} width={102} height={76} fill={C.minus} fillOpacity={0.16} />
      <rect x={160} y={114} width={10} height={92} fill={C.wire} />
      <Arrow x1={174} y1={160} x2={228} y2={160} color={C.wire} width={2} />
      <Arrow x1={120} y1={250} x2={120} y2={204} color={C.plus} width={2.4} />
      <SvgTex x={146} y={98} tex="T=\text{const}" color={C.mut} fontSize={13} width={84} anchor="middle" />
      <SvgTex x={138} y={262} tex="\delta Q=T\,ds" color={C.plus} fontSize={13} width={88} />

      {/* Дясно: нагряване при постоянен обем, измерено налягане */}
      <text x={514} y={56} fill={C.mut} fontSize={12.5} fontWeight={600} textAnchor="middle" letterSpacing="0.08em">
        МАНОМЕТЪР
      </text>
      <rect x={424} y={120} width={180} height={80} fill={C.plus} fillOpacity={0.12} stroke={C.wire} strokeWidth={2} />
      <Arrow x1={578} y1={192} x2={578} y2={132} color={C.plus} width={2.4} />
      <SvgTex x={566} y={162} tex="\Delta p" color={C.plus} fontSize={13} width={32} anchor="end" />
      <Arrow x1={470} y1={250} x2={470} y2={204} color={C.plus} width={2.4} />
      <SvgTex x={514} y={98} tex="\nu=\text{const}" color={C.mut} fontSize={13} width={84} anchor="middle" />
      <SvgTex x={488} y={262} tex="\left(\frac{\partial p}{\partial T}\right)_{\!\nu}" color={C.plus} fontSize={13} width={66} />

      <TexChip x={330} y={162} tex="=" color={C.ok} width={14} fontSize={15} anchor="middle" />
    </Scene>
  );
}

/* ------------------------------------------------------------------ */
/* Устройство с поток: защо енталпията                                */
/* ------------------------------------------------------------------ */

export function FlowDeviceFigure() {
  return (
    <Scene
      w={660}
      h={300}
      label="Газ влиза в устройство с поток, получава топлина и отдава техническа работа"
      caption={
        <>
          Всеки мол на входа бива избутан навътре от газа зад него, а на изхода сам бута газа пред
          себе си. Затова в поток се води сметка не на вътрешната енергия, а на енталпията.
        </>
      }
    >
      <rect x={46} y={120} width={200} height={52} fill={C.minus} fillOpacity={0.12} stroke={C.wire} strokeWidth={1.6} />
      <rect x={414} y={120} width={200} height={52} fill={C.plus} fillOpacity={0.12} stroke={C.wire} strokeWidth={1.6} />
      <rect x={246} y={84} width={168} height={124} rx={12} fill={STAGE_BG} stroke={C.wire} strokeWidth={2.2} />
      <text x={330} y={150} fill={C.mut} fontSize={13} fontWeight={600} textAnchor="middle" letterSpacing="0.08em">
        УСТРОЙСТВО
      </text>

      <Arrow x1={76} y1={146} x2={136} y2={146} color={C.minus} width={2.4} />
      <Arrow x1={524} y1={146} x2={584} y2={146} color={C.plus} width={2.4} />
      <SvgTex x={146} y={102} tex="p_1,\ \nu_1,\ u_1" color={C.minus} fontSize={13} width={96} anchor="middle" />
      <SvgTex x={514} y={102} tex="p_2,\ \nu_2,\ u_2" color={C.plus} fontSize={13} width={96} anchor="middle" />
      <SvgTex x={146} y={192} tex="+p_1\nu_1" color={C.mut} fontSize={13} width={66} anchor="middle" />
      <SvgTex x={514} y={192} tex="-p_2\nu_2" color={C.mut} fontSize={13} width={66} anchor="middle" />

      <Arrow x1={330} y1={286} x2={330} y2={214} color={C.plus} width={2.4} />
      <SvgTex x={344} y={252} tex="Q" color={C.plus} fontSize={14} width={22} />
      <Arrow x1={330} y1={84} x2={330} y2={22} color={C.ok} width={2.4} />
      <SvgTex x={344} y={44} tex="A_{\text{техн}}" color={C.ok} fontSize={13} width={62} />
    </Scene>
  );
}

/* ------------------------------------------------------------------ */
/* Свободно разширение срещу дроселиране                              */
/* ------------------------------------------------------------------ */

export function ExpansionComparisonFigure() {
  return (
    <Scene
      w={660}
      h={290}
      label="Вляво свободно разширение във вакуум при постоянна вътрешна енергия, вдясно дроселиране през преграда при постоянна енталпия"
      caption={
        <>
          Двата опита изглеждат близки, но се различават по запазваната величина. Вляво газът не
          върши работа и вътрешната енергия е постоянна; вдясно потокът внася и изнася работа на
          избутване и постоянна остава енталпията.
        </>
      }
    >
      <line x1={330} y1={44} x2={330} y2={252} stroke={C.faint} strokeDasharray="6 6" />

      <text x={170} y={56} fill={C.mut} fontSize={12.5} fontWeight={600} textAnchor="middle" letterSpacing="0.08em">
        СВОБОДНО РАЗШИРЕНИЕ
      </text>
      <rect x={52} y={108} width={236} height={104} fill="none" stroke={C.wire} strokeWidth={2.2} />
      <rect x={57} y={113} width={226} height={94} fill="none" stroke={C.faint} strokeWidth={1.4} />
      <rect x={59} y={115} width={109} height={90} fill={C.minus} fillOpacity={0.18} />
      <line x1={170} y1={115} x2={170} y2={142} stroke={C.wire} strokeWidth={2.4} />
      <line x1={170} y1={178} x2={170} y2={205} stroke={C.wire} strokeWidth={2.4} />
      <Arrow x1={178} y1={160} x2={214} y2={160} color={C.minus} width={2} />
      <text x={248} y={164} fill={C.mut} fontSize={12} fontWeight={600} textAnchor="middle" letterSpacing="0.08em">
        ВАКУУМ
      </text>
      <SvgTex x={170} y={86} tex="u=\text{const}" color={C.ok} fontSize={13} width={84} anchor="middle" />
      <SvgTex x={170} y={238} tex="\Delta T<0" color={C.minus} fontSize={13} width={66} anchor="middle" />

      <text x={490} y={56} fill={C.mut} fontSize={12.5} fontWeight={600} textAnchor="middle" letterSpacing="0.08em">
        ДРОСЕЛИРАНЕ
      </text>
      <rect x={372} y={130} width={236} height={60} fill="none" stroke={C.wire} strokeWidth={2.2} />
      <rect x={478} y={130} width={24} height={60} fill={C.warn} fillOpacity={0.3} />
      <g stroke={C.warn} strokeWidth={1.2}>
        {[483, 489, 495].map((x) => (
          <line key={x} x1={x} y1={132} x2={x} y2={188} />
        ))}
      </g>
      <Arrow x1={390} y1={160} x2={450} y2={160} color={C.minus} width={2.4} />
      <Arrow x1={528} y1={160} x2={588} y2={160} color={C.plus} width={2.4} />
      <SvgTex x={490} y={86} tex="h=\text{const}" color={C.ok} fontSize={13} width={84} anchor="middle" />
      <SvgTex x={490} y={238} tex="p_1>p_2" color={C.plus} fontSize={13} width={66} anchor="middle" />
    </Scene>
  );
}

/* ------------------------------------------------------------------ */
/* Цикъл на Карно в T-s                                               */
/* ------------------------------------------------------------------ */

export function CarnotTsFigure() {
  return (
    <Scene
      w={620}
      h={360}
      label="Цикълът на Карно в координати температура и ентропия е правоъгълник; площта под горната страна е приетата топлина"
      caption={
        <>
          В тези координати обратимата адиабата е отсечка с постоянна ентропия, а изотермата -
          хоризонтала. Долният ръб на платното е нулата на температурата, затова цялата площ под
          горната изотерма е приетата топлина.
        </>
      }
    >
      <Axes x0={86} y0={304} x1={548} y1={36} />
      <rect x={192} y={200} width={276} height={104} fill={C.minus} fillOpacity={0.16} />
      <rect x={192} y={86} width={276} height={114} fill={C.warn} fillOpacity={0.18} />
      <path d="M192,86 H468 V200 H192 Z" fill="none" stroke={C.wire} strokeWidth={2.6} />
      <g stroke={C.faint} strokeDasharray="4 4">
        <line x1={86} y1={86} x2={192} y2={86} />
        <line x1={86} y1={200} x2={192} y2={200} />
      </g>
      <g fill={C.wire}>
        <polygon points="336,86 322,80 322,92" />
        <polygon points="468,149 462,135 474,135" />
        <polygon points="324,200 338,194 338,206" />
        <polygon points="192,149 186,163 198,163" />
      </g>
      <SvgTex x={76} y={86} tex="T_1" color={C.plus} fontSize={13} width={30} anchor="end" />
      <SvgTex x={76} y={200} tex="T_2" color={C.minus} fontSize={13} width={30} anchor="end" />
      <SvgTex x={76} y={304} tex="0" color={C.mut} fontSize={13} width={16} anchor="end" />
      <SvgTex x={330} y={145} tex="A=Q_1-Q_2" color={C.ok} fontSize={14} width={118} anchor="middle" />
      <SvgTex x={330} y={252} tex="Q_2=T_2\Delta s" color={C.minus} fontSize={13} width={104} anchor="middle" />
      <SvgTex x={548} y={330} tex="s" color={C.mut} fontSize={13} width={16} anchor="middle" />
      <SvgTex x={100} y={48} tex="T" color={C.mut} fontSize={13} width={16} />
    </Scene>
  );
}

/* ------------------------------------------------------------------ */
/* Хладилникът: схема и цикъл в p-h                                   */
/* ------------------------------------------------------------------ */

export function FridgeSchematicFigure() {
  return (
    <Scene
      w={660}
      h={340}
      label="Схема на парокомпресионен хладилник: изпарител, компресор, кондензатор и дроселен вентил"
      caption={
        <>
          Агентът обикаля четири устройства с поток. Компресорът вкарва работа, кондензаторът отдава
          топлина в кухнята, вентилът понижава налягането без обмен на топлина и работа, а в
          изпарителя течността кипи за сметка на храната.
        </>
      }
    >
      <rect x={200} y={56} width={260} height={46} rx={8} fill={C.plus} fillOpacity={0.18} stroke={C.plus} strokeWidth={2} />
      <rect x={200} y={244} width={260} height={46} rx={8} fill={C.minus} fillOpacity={0.18} stroke={C.minus} strokeWidth={2} />
      <text x={330} y={84} fill={C.wire} fontSize={12.5} fontWeight={600} textAnchor="middle" letterSpacing="0.08em">
        КОНДЕНЗАТОР
      </text>
      <text x={330} y={272} fill={C.wire} fontSize={12.5} fontWeight={600} textAnchor="middle" letterSpacing="0.08em">
        ИЗПАРИТЕЛ
      </text>

      <path
        d="M460,267 H530 V196 M530,144 V79 H460 M200,79 H130 V144 M130,196 V267 H200"
        fill="none"
        stroke={C.wire}
        strokeWidth={2}
      />
      <circle cx={530} cy={170} r={26} fill={STAGE_BG} stroke={C.ok} strokeWidth={2.2} />
      <path d="M516,182 L542,170 L516,158" fill="none" stroke={C.ok} strokeWidth={1.6} />
      <g fill={C.warn}>
        <polygon points="118,156 142,156 130,170" />
        <polygon points="118,184 142,184 130,170" />
      </g>
      <g fill={C.wire}>
        <polygon points="494,267 480,261 480,273" />
        <polygon points="530,116 524,130 536,130" />
        <polygon points="166,79 180,73 180,85" />
        <polygon points="130,224 124,210 136,210" />
      </g>

      <text x={498} y={174} fill={C.mut} fontSize={12} fontWeight={600} textAnchor="end" letterSpacing="0.08em">
        КОМПРЕСОР
      </text>
      <text x={160} y={152} fill={C.mut} fontSize={12} fontWeight={600} letterSpacing="0.08em">
        ВЕНТИЛ
      </text>
      <SvgTex x={124} y={190} tex="h=\text{const}" color={C.warn} fontSize={12.5} width={76} anchor="end" />

      <Arrow x1={330} y1={56} x2={330} y2={18} color={C.plus} width={2.4} />
      <SvgTex x={346} y={34} tex="Q_1" color={C.plus} fontSize={13} width={30} />
      <Arrow x1={330} y1={326} x2={330} y2={290} color={C.minus} width={2.4} />
      <SvgTex x={346} y={312} tex="Q_2" color={C.minus} fontSize={13} width={30} />
      <Arrow x1={596} y1={170} x2={560} y2={170} color={C.ok} width={2.4} />
      <SvgTex x={586} y={146} tex="A" color={C.ok} fontSize={13} width={18} />

      <SvgTex x={548} y={286} tex="1" color={C.wire} fontSize={13} width={14} />
      <SvgTex x={548} y={62} tex="2" color={C.wire} fontSize={13} width={14} />
      <SvgTex x={112} y={62} tex="3" color={C.wire} fontSize={13} width={14} anchor="end" />
      <SvgTex x={112} y={286} tex="4" color={C.wire} fontSize={13} width={14} anchor="end" />
    </Scene>
  );
}

export function FridgePhFigure() {
  return (
    <Scene
      w={660}
      h={400}
      label="Цикълът на хладилника в координати налягане и енталпия, с купола на съвместно съществуване"
      caption={
        <>
          Вертикалата 3 към 4 е вентилът: енталпията не се променя, затова частта пара расте.
          Хоризонталите са кондензаторът и изпарителят, а наклонената отсечка 1 към 2 е компресорът.
          Дължините по хоризонталата се четат направо като топлина и работа за килограм агент.
        </>
      }
    >
      <Axes x0={70} y0={344} x1={604} y1={36} />
      <path
        d="M190,332 C200,198 272,96 360,92 C448,96 522,200 546,332"
        fill="none"
        stroke={C.faint}
        strokeWidth={1.8}
      />
      {/*
        Точка 3 лежи точно на лявото рамо на купола (наситена течност), 1 - на
        дясното (наситена пара), а 2 е извън купола надясно (прегрята пара).
        Вертикалата 3-4 е при постоянна енталпия, затова има един и същ x.
      */}
      <polygon points="528,268 560,140 265,140 265,268" fill={C.ok} fillOpacity={0.1} />
      <path d="M528,268 L560,140 L265,140 L265,268 Z" fill="none" stroke={C.ok} strokeWidth={2.4} />
      <g fill={C.ok}>
        <polygon points="400,140 414,134 414,146" />
        <polygon points="265,210 259,196 271,196" />
        <polygon points="400,268 386,274 386,262" />
        <polygon points="545.7,197.2 547.2,212 537.5,209.6" />
      </g>
      <g fill={C.wire}>
        <circle cx={528} cy={268} r={4.5} />
        <circle cx={560} cy={140} r={4.5} />
        <circle cx={265} cy={140} r={4.5} />
        <circle cx={265} cy={268} r={4.5} />
      </g>
      <SvgTex x={536} y={292} tex="1" color={C.wire} fontSize={13} width={14} />
      <SvgTex x={572} y={124} tex="2" color={C.wire} fontSize={13} width={14} />
      <SvgTex x={251} y={124} tex="3" color={C.wire} fontSize={13} width={14} anchor="end" />
      <SvgTex x={251} y={292} tex="4" color={C.wire} fontSize={13} width={14} anchor="end" />
      <SvgTex x={430} y={118} tex="Q_1" color={C.plus} fontSize={13} width={30} anchor="middle" />
      <SvgTex x={380} y={292} tex="Q_2" color={C.minus} fontSize={13} width={30} anchor="middle" />
      <SvgTex x={578} y={200} tex="A" color={C.ok} fontSize={13} width={18} />
      <text x={385} y={214} fill={C.mut} fontSize={12} fontWeight={600} textAnchor="middle" letterSpacing="0.06em">
        ТЕЧНОСТ + ПАРА
      </text>
      <text x={118} y={112} fill={C.mut} fontSize={12} fontWeight={600} letterSpacing="0.06em">
        ТЕЧНОСТ
      </text>
      <text x={596} y={322} fill={C.mut} fontSize={12} fontWeight={600} textAnchor="end" letterSpacing="0.06em">
        ПАРА
      </text>
      <SvgTex x={604} y={370} tex="h" color={C.mut} fontSize={13} width={16} anchor="middle" />
      <SvgTex x={84} y={48} tex="p" color={C.mut} fontSize={13} width={16} />
    </Scene>
  );
}

/* ------------------------------------------------------------------ */
/* Семейството изотерми: заглавна фигура на раздела                   */
/* ------------------------------------------------------------------ */

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Линейна смес на два цвята от палитрата - студено към горещо. */
function mix(a: string, b: string, t: number): string {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  return `rgb(${ca.map((v, i) => Math.round(v + (cb[i] - v) * t)).join(",")})`;
}

const FAMILY_T = [0.8, 0.85, 0.9, 0.95, 1, 1.06, 1.13, 1.22, 1.32, 1.44, 1.58];

export function IsothermFamilyFigure() {
  const w = 680;
  const h = 420;
  const left = 74;
  const right = 644;
  const top = 36;
  const bottom = 362;
  const lv0 = Math.log(0.45);
  const lv1 = Math.log(14);
  const X = (v: number) => left + ((Math.log(v) - lv0) / (lv1 - lv0)) * (right - left);
  const Y = (p: number) => bottom - (p / 2.2) * (bottom - top);

  const dome = binodal();
  const domePoints = [
    ...dome.liquid.map(([v, p]) => `${q(X(v))},${q(Y(p))}`),
    `${q(X(1))},${q(Y(1))}`,
    ...[...dome.vapour].reverse().map(([v, p]) => `${q(X(v))},${q(Y(p))}`),
  ].join(" ");

  const curves = FAMILY_T.map((T, i) => {
    const state = maxwellConstruction(T);
    const points: string[] = [];
    for (let k = 0; k <= 320; k += 1) {
      const v = Math.exp(Math.log(0.44) + (Math.log(14.5) - Math.log(0.44)) * (k / 320));
      let p = reducedPressure(v, T);
      if (state && v > state.vLiquid && v < state.vVapour) p = state.ps;
      if (p > 2.3 || p < -0.05) continue;
      points.push(`${q(X(v))},${q(Y(p))}`);
    }
    return { T, color: mix(C.minus, C.plus, i / (FAMILY_T.length - 1)), points: points.join(" ") };
  });

  return (
    <Scene
      w={w}
      h={h}
      label="Семейство изотерми на Ван дер Ваалс в приведени единици от студено към горещо, с областта на съвместно съществуване на течност и пара"
      minWidth={520}
      caption={
        <>
          Всяка крива е една температура. Под критичната изотермата има хоризонтален участък: там
          течност и пара съществуват заедно и свиването не променя налягането. Над нея преходът
          изчезва и остава едно единствено флуидно състояние. Оста на обема е логаритмична, за да се
          поберат и течността, и разредената пара.
        </>
      }
    >
      <defs>
        <clipPath id="isotherm-family-clip">
          <rect x={left} y={top} width={right - left} height={bottom - top} />
        </clipPath>
      </defs>
      <Axes x0={left} y0={bottom} x1={right} y1={top} />
      <g clipPath="url(#isotherm-family-clip)">
        <polygon points={domePoints} fill={C.minus} fillOpacity={0.12} stroke={C.faint} strokeWidth={1.4} strokeDasharray="4 5" />
        {curves.map((c) => (
          <polyline
            key={c.T}
            points={c.points}
            fill="none"
            stroke={c.color}
            strokeWidth={c.T === 1 ? 3.2 : 2}
            strokeLinejoin="round"
          />
        ))}
        <circle cx={X(1)} cy={Y(1)} r={5.5} fill={C.wire} />
      </g>
      {[0.5, 1, 2, 5, 10].map((v) => (
        <SvgTex key={v} x={X(v)} y={bottom + 22} tex={v < 1 ? "0{,}5" : String(v)} color={C.mut} fontSize={12} width={28} anchor="middle" />
      ))}
      {[0, 1, 2].map((p) => (
        <SvgTex key={p} x={left - 10} y={Y(p)} tex={String(p)} color={C.mut} fontSize={12} width={14} anchor="end" />
      ))}
      <SvgTex x={X(1) + 14} y={Y(1) - 18} tex="K" color={C.wire} fontSize={13} width={18} />
      <SvgTex x={right} y={bottom + 52} tex="\nu/\nu_c" color={C.mut} fontSize={13} width={48} anchor="end" />
      <SvgTex x={left + 14} y={top + 12} tex="p/p_c" color={C.mut} fontSize={13} width={46} />
      <SvgTex x={right - 6} y={Y(1.95)} tex="T>T_c" color={C.plus} fontSize={13} width={56} anchor="end" />
      <SvgTex x={X(5.6)} y={Y(0.12)} tex="T<T_c" color={C.minus} fontSize={13} width={56} anchor="middle" />
      <text x={X(1.55)} y={Y(0.33)} fill={C.mut} fontSize={12} fontWeight={600} textAnchor="middle" letterSpacing="0.06em">
        ТЕЧНОСТ + ПАРА
      </text>
    </Scene>
  );
}
