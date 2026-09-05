import type { ReactNode } from "react";
import RichText from "@/components/RichText";
import { Stage, StageScroll } from "./acPlot";
import { AngleArc, Arrow, C, DRAWING_FONT_FAMILY, STAGE_CLASS } from "./svg";
import SvgTex from "./SvgTex";

/**
 * Чертежите към приложните предизвикателства в урока за вектори.
 *
 * Всяка фигура има две състояния. В `given` се вижда само условието:
 * геометрията, известните вектори и мястото на неизвестното. В `final`
 * се дострояват търсените вектори и се затваря векторният триъгълник.
 * Първото състояние стои под условието, второто идва с последната стъпка
 * на решението.
 *
 * Мащабът вътре в една фигура е един и същ за всички вектори от един вид,
 * затова дължините на стрелките са сравними на око.
 */

const q = (v: number) => Math.round(v * 100) / 100;
const rad = (deg: number) => (deg * Math.PI) / 180;

/** Кратък главен надпис в сцената (посоки, обекти), не математика. */
function Caps({
  x,
  y,
  children,
  anchor = "start",
}: {
  x: number;
  y: number;
  children: string;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill={C.mut}
      fontFamily={DRAWING_FONT_FAMILY}
      fontSize={11}
      fontWeight={600}
      letterSpacing="0.05em"
    >
      {children}
    </text>
  );
}

/**
 * Дъга на ъгъл, измерен обратно на часовниковата стрелка в математически
 * смисъл. `AngleArc` от svg.tsx върви по по-късия път и не може да опише
 * завъртане над 180 градуса, каквото е ъгълът 210 при вятъра.
 */
function Sweep({
  cx,
  cy,
  r,
  from,
  to,
  color = C.faint,
}: {
  cx: number;
  cy: number;
  r: number;
  from: number;
  to: number;
  color?: string;
}) {
  const p = (deg: number) => `${q(cx + r * Math.cos(rad(deg)))} ${q(cy - r * Math.sin(rad(deg)))}`;
  const large = Math.abs(to - from) > 180 ? 1 : 0;
  return <path d={`M ${p(from)} A ${r} ${r} 0 ${large} 0 ${p(to)}`} fill="none" stroke={color} strokeWidth={1.6} />;
}

/** Прави оси с върхове-стрелки. */
function Axes({
  ox,
  oy,
  xFrom,
  xTo,
  yFrom,
  yTo,
}: {
  ox: number;
  oy: number;
  xFrom: number;
  xTo: number;
  yFrom: number;
  yTo: number;
}) {
  return (
    <g>
      <line x1={xFrom} y1={oy} x2={xTo} y2={oy} stroke={C.mut} strokeWidth={1.5} />
      <polygon points={`${xTo + 8},${oy} ${xTo - 2},${oy - 4.5} ${xTo - 2},${oy + 4.5}`} fill={C.mut} />
      <line x1={ox} y1={yFrom} x2={ox} y2={yTo} stroke={C.mut} strokeWidth={1.5} />
      <polygon points={`${ox},${yTo - 8} ${ox - 4.5},${yTo + 2} ${ox + 4.5},${yTo + 2}`} fill={C.mut} />
    </g>
  );
}

export interface ChallengeFigure {
  height: number;
  title: string;
  draw: (final: boolean) => ReactNode;
  caption: (final: boolean) => string;
}

/* ---------------------------------------------- 3 · Пресичане на река */

const BOAT = { s: { x: 206, y: 256 }, north: 96, ppv: 30 };

const boatFigure: ChallengeFigure = {
  height: 300,
  title: "ПРЕСИЧАНЕ НА РЕКА",
  draw: (final) => {
    const { s, north, ppv } = BOAT;
    const vb = { x: -2.4 * ppv, y: -3.2 * ppv };
    const tip = { x: q(s.x + vb.x), y: q(s.y + vb.y) };
    const res = { x: s.x, y: q(s.y - 3.2 * ppv) };
    return (
      <g>
        <rect x={20} y={north} width={440} height={s.y - north} fill={C.minus} opacity={0.07} />
        <line x1={20} y1={north} x2={460} y2={north} stroke={C.wire} strokeWidth={2.4} />
        <line x1={20} y1={s.y} x2={460} y2={s.y} stroke={C.wire} strokeWidth={2.4} />
        <Caps x={28} y={north - 9}>СЕВЕРЕН БРЯГ</Caps>
        <Caps x={28} y={s.y + 20}>ЮЖЕН БРЯГ</Caps>

        {/* ширината на реката */}
        <line x1={416} y1={north} x2={432} y2={north} stroke={C.faint} strokeWidth={1.4} />
        <line x1={416} y1={s.y} x2={432} y2={s.y} stroke={C.faint} strokeWidth={1.4} />
        <Arrow x1={424} y1={north} x2={424} y2={s.y} color={C.faint} width={1.6} />
        <Arrow x1={424} y1={s.y} x2={424} y2={north} color={C.faint} width={1.6} />
        <SvgTex x={412} y={176} tex={String.raw`180\,\mathrm{m}`} color={C.mut} fontSize={12.5} width={72} anchor="end" />

        {/* компас */}
        <Arrow x1={447} y1={84} x2={447} y2={48} color={C.mut} width={1.6} />
        <Caps x={447} y={42} anchor="middle">С</Caps>

        {/* желаният път */}
        <line x1={s.x} y1={s.y} x2={s.x} y2={north} stroke={C.faint} strokeWidth={1.6} strokeDasharray="6 5" />
        <circle cx={s.x} cy={s.y} r={5} fill={C.wire} />
        <circle cx={s.x} cy={north} r={5} fill={C.wire} />
        <SvgTex x={196} y={274} tex="S" color={C.wire} fontSize={13} width={22} anchor="end" />
        <SvgTex x={s.x} y={north - 14} tex="T" color={C.wire} fontSize={13} width={22} anchor="middle" />

        {!final && (
          <g>
            <Arrow x1={300} y1={150} x2={q(300 + 2.4 * ppv)} y2={150} color={C.warn} width={2.6} />
            <Arrow x1={300} y1={214} x2={q(300 + 2.4 * ppv)} y2={214} color={C.warn} width={2.6} />
            <SvgTex x={300} y={236} tex={String.raw`\vec v_{\text{теч}}`} color={C.warn} fontSize={13} width={54} />
            {/* известна големина, неизвестна посока: върхът лежи по дъгата */}
            <path
              d={`M ${q(s.x - 4 * ppv)} ${s.y} A ${q(4 * ppv)} ${q(4 * ppv)} 0 0 1 ${s.x} ${q(s.y - 4 * ppv)}`}
              fill="none"
              stroke={C.ok}
              strokeWidth={1.8}
              strokeDasharray="6 5"
            />
            {[195, 225, 255].map((deg) => (
              <Arrow
                key={deg}
                x1={s.x}
                y1={s.y}
                x2={q(s.x + 108 * Math.cos(rad(deg)))}
                y2={q(s.y + 108 * Math.sin(rad(deg)))}
                color={C.faint}
                width={1.6}
              />
            ))}
            <SvgTex x={108} y={158} tex={String.raw`v_{\text{лод}}`} color={C.ok} fontSize={13} width={46} anchor="middle" />
          </g>
        )}

        {final && (
          <g>
            <Arrow x1={s.x} y1={s.y} x2={tip.x} y2={tip.y} color={C.minus} width={3} />
            <Arrow x1={tip.x} y1={tip.y} x2={q(tip.x + 2.4 * ppv)} y2={tip.y} color={C.warn} width={2.8} />
            <Arrow x1={s.x} y1={s.y} x2={res.x} y2={res.y} color={C.ok} width={3.4} />
            <AngleArc cx={s.x} cy={s.y} a1={rad(270)} a2={Math.atan2(vb.y, vb.x)} r={44} color={C.mut} />
            <SvgTex x={187} y={199} tex={String.raw`\beta`} color={C.mut} fontSize={13} width={20} anchor="middle" />
            <SvgTex x={156} y={196} tex={String.raw`\vec v_{\text{лод}}`} color={C.minus} fontSize={13} width={52} anchor="end" />
            <SvgTex x={170} y={146} tex={String.raw`\vec v_{\text{теч}}`} color={C.warn} fontSize={13} width={54} anchor="middle" />
            <SvgTex x={216} y={208} tex={String.raw`\vec v`} color={C.ok} fontSize={13} width={24} />
          </g>
        )}
      </g>
    );
  },
  caption: (final) =>
    final
      ? "Западната компонента на скоростта на лодката отменя течението. Резултантната сочи право към $T$, затова пресичането е по правата $ST$."
      : "Дадени са ширината на реката, течението и **големината** на скоростта на лодката. Посоката ѝ още не е известна: тя лежи някъде по пунктираната дъга.",
};

/* ------------------------------------------------- 4 · Доставка с дрон */

const DRONE = { q: { x: 306, y: 246 }, ppv: 8 };

const droneFigure: ChallengeFigure = {
  height: 330,
  title: "МАРШРУТ И СКОРОСТИ ПРИ ДОСТАВКА С ДРОН",
  draw: (final) => {
    const { q: Q, ppv } = DRONE;
    const air = { x: q(Q.x + 16.33 * ppv), y: q(Q.y - 10.5 * ppv) };
    const ground = { x: q(Q.x + 12 * ppv), y: q(Q.y - 8 * ppv) };
    const wind = { x: q(Q.x - 4.33 * ppv), y: q(Q.y + 2.5 * ppv) };
    return (
      <g>
        {/* ляво: маршрутът */}
        <Axes ox={56} oy={268} xFrom={48} xTo={206} yFrom={274} yTo={96} />
        <Caps x={200} y={286} anchor="end">ИЗТОК</Caps>
        <Caps x={64} y={92}>СЕВЕР</Caps>
        <Arrow x1={56} y1={268} x2={188} y2={180} color={C.minus} width={3} />
        <circle cx={188} cy={180} r={4.5} fill={C.wire} />
        <SvgTex x={194} y={172} tex="P" color={C.wire} fontSize={13} width={22} />
        <SvgTex x={46} y={284} tex="O" color={C.mut} fontSize={12.5} width={20} anchor="middle" />
        <SvgTex x={110} y={210} tex={String.raw`\Delta\vec r`} color={C.minus} fontSize={13} width={34} anchor="end" />

        <line x1={232} y1={48} x2={232} y2={310} stroke={C.faint} strokeWidth={1.2} strokeDasharray="5 6" />

        {/* дясно: скоростите */}
        <Axes ox={Q.x} oy={Q.y} xFrom={250} xTo={458} yFrom={290} yTo={100} />
        <Caps x={452} y={264} anchor="end">ИЗТОК</Caps>
        <Caps x={314} y={96}>СЕВЕР</Caps>

        <g opacity={final ? 0.28 : 1}>
          <Sweep cx={Q.x} cy={Q.y} r={34} from={0} to={210} />
          <SvgTex x={272} y={196} tex={String.raw`210^\circ`} color={C.mut} fontSize={12.5} width={38} anchor="middle" />
        </g>

        <Arrow x1={Q.x} y1={Q.y} x2={wind.x} y2={wind.y} color={C.warn} width={2.8} />
        <SvgTex x={266} y={284} tex={String.raw`\vec v_{\text{вятър}}`} color={C.warn} fontSize={13} width={62} anchor="end" />

        {final && (
          <g>
            {/*
              Двата дълги вектора са почти успоредни. Зеленият се рисува пръв и
              синият ляга върху него, за да се вижда докъде стига по-късият.
            */}
            <Arrow x1={Q.x} y1={Q.y} x2={air.x} y2={air.y} color={C.ok} width={3.2} />
            <Arrow x1={ground.x} y1={ground.y} x2={air.x} y2={air.y} color={C.warn} width={2.4} dashed />
            <Arrow x1={Q.x} y1={Q.y} x2={ground.x} y2={ground.y} color={C.minus} width={3} />
            <SvgTex x={412} y={140} tex={String.raw`\vec v_{\text{въздух}}`} color={C.ok} fontSize={13} width={66} anchor="middle" />
            <line x1={420} y1={202} x2={404} y2={186} stroke={C.faint} strokeWidth={1.2} />
            <SvgTex x={430} y={210} tex={String.raw`\vec v_{\text{земя}}`} color={C.minus} fontSize={13} width={58} anchor="middle" />
          </g>
        )}
      </g>
    );
  },
  caption: (final) =>
    final
      ? "Вятърът е почти точно насрещен, затова $\\vec v_{\\text{въздух}}$ сочи почти като $\\vec v_{\\text{земя}}$, но е забележимо по-дълъг. Пунктираната отсечка е добавката $-\\vec v_{\\text{вятър}}$."
      : "Вляво е маршрутът, вдясно са скоростите. От условието е известен само вятърът; скоростта спрямо земята следва от $\\Delta\\vec r$ и времето.",
};

/* ------------------------------------------ 5 · Самолет в страничен вятър */

const PLANE = { o: { x: 70, y: 190 }, ppv: 1.6 };

const planeFigure: ChallengeFigure = {
  height: 300,
  title: "ПОЛЕТ ПРИ СТРАНИЧЕН ВЯТЪР",
  draw: (final) => {
    const { o, ppv } = PLANE;
    const beta = Math.asin(18 / 80);
    const tip = { x: q(o.x + 80 * ppv * Math.cos(beta)), y: q(o.y + 80 * ppv * Math.sin(beta)) };
    const res = { x: q(o.x + 77.95 * ppv), y: o.y };
    return (
      <g>
        <line x1={o.x} y1={o.y} x2={430} y2={o.y} stroke={C.faint} strokeWidth={1.6} strokeDasharray="6 5" />
        <circle cx={o.x} cy={o.y} r={5} fill={C.wire} />
        <circle cx={430} cy={o.y} r={5} fill={C.wire} />
        <Caps x={332} y={176} anchor="middle">ЖЕЛАН ПЪТ</Caps>
        <SvgTex x={332} y={210} tex={String.raw`48\,\mathrm{km}`} color={C.mut} fontSize={12.5} width={68} anchor="middle" />
        <SvgTex x={62} y={208} tex="A" color={C.wire} fontSize={13} width={22} anchor="end" />
        <SvgTex x={438} y={208} tex="B" color={C.wire} fontSize={13} width={22} />

        {/* вятърът над целия маршрут */}
        <Arrow x1={150} y1={120} x2={150} y2={q(120 - 18 * ppv)} color={C.warn} width={2.6} />
        <Arrow x1={300} y1={120} x2={300} y2={q(120 - 18 * ppv)} color={C.warn} width={2.6} />
        {!final && (
          <SvgTex x={312} y={104} tex={String.raw`\vec v_{\text{вятър}}`} color={C.warn} fontSize={13} width={62} />
        )}
        <Caps x={40} y={100}>СЕВЕР ↑</Caps>

        {!final && (
          <g>
            <path
              d={`M ${q(o.x + 80 * ppv)} ${o.y} A ${q(80 * ppv)} ${q(80 * ppv)} 0 0 1 ${q(o.x + 80 * ppv * Math.cos(rad(30)))} ${q(o.y + 80 * ppv * Math.sin(rad(30)))}`}
              fill="none"
              stroke={C.ok}
              strokeWidth={1.8}
              strokeDasharray="6 5"
            />
            <SvgTex x={214} y={244} tex={String.raw`v_{\text{сам}}`} color={C.ok} fontSize={13} width={50} anchor="middle" />
          </g>
        )}

        {final && (
          <g>
            <Arrow x1={o.x} y1={o.y} x2={tip.x} y2={tip.y} color={C.minus} width={3} />
            <Arrow x1={tip.x} y1={tip.y} x2={tip.x} y2={q(tip.y - 18 * ppv)} color={C.warn} width={2.8} />
            <Arrow x1={o.x} y1={o.y} x2={res.x} y2={res.y} color={C.ok} width={3.4} />
            <AngleArc cx={o.x} cy={o.y} a1={0} a2={beta} r={46} color={C.mut} />
            <line x1={128} y1={192} x2={122} y2={176} stroke={C.faint} strokeWidth={1.2} />
            <SvgTex x={120} y={168} tex={String.raw`\beta`} color={C.mut} fontSize={13} width={20} anchor="middle" />
            <SvgTex x={152} y={240} tex={String.raw`\vec v_{\text{сам}}`} color={C.minus} fontSize={13} width={54} anchor="middle" />
            <SvgTex x={206} y={216} tex={String.raw`\vec v_{\text{вятър}}`} color={C.warn} fontSize={13} width={62} />
            <SvgTex x={150} y={176} tex={String.raw`\vec v`} color={C.ok} fontSize={13} width={24} anchor="middle" />
          </g>
        )}
      </g>
    );
  },
  caption: (final) =>
    final
      ? "Носът сочи южно от изток. Северната компонента на въздушната скорост отменя вятъра и остава само движение на изток."
      : "Известни са вятърът и **големината** на скоростта спрямо въздуха. Курсът още не е избран: върхът лежи по пунктираната дъга.",
};

/* --------------------------------------- 6 · Маршрут на геодезически робот */

const ROBOT = { o: { x: 140, y: 306 }, ppm: 2.2 };

const robotFigure: ChallengeFigure = {
  height: 350,
  title: "ЗАТВАРЯНЕ НА МАРШРУТ",
  draw: (final) => {
    const { o, ppm } = ROBOT;
    const step = (from: { x: number; y: number }, len: number, deg: number) => ({
      x: q(from.x + len * ppm * Math.cos(rad(deg))),
      y: q(from.y - len * ppm * Math.sin(rad(deg))),
    });
    const a = step(o, 120, 25);
    const b = step(a, 85, 140);
    const d = step(b, 70, -90);
    const dir = { x: d.x - o.x, y: d.y - o.y };
    const norm = Math.hypot(dir.x, dir.y);
    const off = { x: q((dir.y / norm) * 7), y: q((-dir.x / norm) * 7) };
    return (
      <g>
        <Axes ox={o.x} oy={o.y} xFrom={60} xTo={454} yFrom={318} yTo={62} />
        <Caps x={448} y={324} anchor="end">ИЗТОК</Caps>
        <Caps x={148} y={62}>СЕВЕР</Caps>
        <SvgTex x={130} y={322} tex="O" color={C.mut} fontSize={12.5} width={20} anchor="end" />

        <line x1={o.x} y1={o.y} x2={q(o.x + 76)} y2={o.y} stroke={C.faint} strokeWidth={1.2} strokeDasharray="5 5" />
        <AngleArc cx={o.x} cy={o.y} a1={0} a2={rad(-25)} r={50} color={C.mut} />
        <SvgTex x={206} y={294} tex={String.raw`25^\circ`} color={C.mut} fontSize={12.5} width={34} anchor="middle" />
        <line x1={a.x} y1={a.y} x2={q(a.x + 64)} y2={a.y} stroke={C.faint} strokeWidth={1.2} strokeDasharray="5 5" />
        <AngleArc cx={a.x} cy={a.y} a1={0} a2={rad(-140)} r={44} color={C.mut} />
        <SvgTex x={402} y={148} tex={String.raw`140^\circ`} color={C.mut} fontSize={12.5} width={42} anchor="middle" />

        <Arrow x1={o.x} y1={o.y} x2={a.x} y2={a.y} color={C.minus} width={3} />
        <Arrow x1={a.x} y1={a.y} x2={b.x} y2={b.y} color={C.warn} width={3} />
        <Arrow x1={b.x} y1={b.y} x2={d.x} y2={d.y} color={C.plus} width={3} />
        <SvgTex x={268} y={268} tex={String.raw`\vec a`} color={C.minus} fontSize={13} width={24} />
        <SvgTex x={295} y={150} tex={String.raw`\vec b`} color={C.warn} fontSize={13} width={24} anchor="middle" />
        <SvgTex x={246} y={152} tex={String.raw`\vec d`} color={C.plus} fontSize={13} width={24} />
        <circle cx={d.x} cy={d.y} r={4.5} fill={C.wire} />
        <SvgTex x={q(d.x + 10)} y={q(d.y - 12)} tex="K" color={C.wire} fontSize={13} width={22} />

        {final && (
          <g>
            <Arrow
              x1={q(o.x + off.x)}
              y1={q(o.y + off.y)}
              x2={q(d.x + off.x)}
              y2={q(d.y + off.y)}
              color={C.mut}
              width={2.4}
            />
            <Arrow
              x1={q(d.x - off.x)}
              y1={q(d.y - off.y)}
              x2={q(o.x - off.x)}
              y2={q(o.y - off.y)}
              color={C.ok}
              width={3.4}
            />
            <SvgTex x={214} y={214} tex={String.raw`\vec R`} color={C.mut} fontSize={13} width={26} anchor="end" />
            <SvgTex x={134} y={258} tex={String.raw`\vec c=-\vec R`} color={C.ok} fontSize={13} width={64} anchor="end" />
          </g>
        )}
      </g>
    );
  },
  caption: (final) =>
    final
      ? "Сивата стрелка е общото преместване $\\vec R$ от началото до точка $K$. Коригиращият вектор $\\vec c$ е точно обратният и затваря маршрута."
      : "Трите последователни премествания водят до точка $K$. Търси се едно-единствено преместване, което връща робота в $O$.",
};

export const challengeFigures: Record<string, ChallengeFigure> = {
  "Спасителна лодка в речно течение": boatFigure,
  "Доставка с дрон при насрещен вятър": droneFigure,
  "Самолет в страничен вятър": planeFigure,
  "Затваряне на маршрут на геодезически робот": robotFigure,
};

/**
 * Фигурата, широка колкото текстовата колона (§6). На тесен екран сцената се
 * плъзга хоризонтално, вместо означенията да станат нечетими.
 * `final` превключва между състоянието „само даденото“ и завършения чертеж.
 */
export function ChallengeFigureView({ fig, final = false }: { fig: ChallengeFigure; final?: boolean }) {
  return (
    <figure className="my-5 w-full">
      <StageScroll minWidth={430}>
        <svg
          viewBox={`0 0 480 ${fig.height}`}
          className={STAGE_CLASS}
          role="img"
          aria-label={`${fig.title} (${final ? "решение" : "дадено"})`}
        >
          <Stage w={480} h={fig.height} title={fig.title} />
          {fig.draw(final)}
        </svg>
      </StageScroll>
      <figcaption className="mt-2 text-[13.5px] leading-relaxed text-muted">
        <RichText text={fig.caption(final)} />
      </figcaption>
    </figure>
  );
}
