import type { ReactNode } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import { Stage } from "./acPlot";
import { Arrow, C, DRAWING_FONT_FAMILY, PANEL_CLASS, STAGE_CLASS, TexChip } from "./svg";

function Figure({ title, caption, children, height = 270 }: {title: string; caption: string; children: ReactNode; height?: number}) {
  return <figure className={`${PANEL_CLASS} my-6 w-full`}>
    <figcaption className="mb-3 font-serif text-lg font-bold">{title}</figcaption>
    <svg viewBox={`0 0 480 ${height}`} role="img" aria-label={title} className={STAGE_CLASS} style={{fontFamily: DRAWING_FONT_FAMILY, maxHeight: 330}}>
      <Stage w={480} h={height} />{children}
    </svg>
    <p className="mt-3 text-sm leading-relaxed text-muted"><RichText text={caption} /></p>
  </figure>;
}

export function PositionDifferenceFigure() {
  return <Figure title="Положенията в два близки момента" caption={String.raw`От $O$ до всяко положение води радиус-вектор. Зелената стрелка свързва първото положение с второто: $\Delta\vec r=\vec r(t+\Delta t)-\vec r(t)$. Тя е по хордата, а не по дъгата на траекторията.`}>
    <Arrow x1={45} y1={220} x2={440} y2={220} color={C.faint} width={1.5} />
    <Arrow x1={45} y1={220} x2={45} y2={35} color={C.faint} width={1.5} />
    <SvgTex x={23} y={245} tex="O" color={C.wire} width={24} />
    <SvgTex x={442} y={244} tex="x" color={C.mut} width={22} />
    <SvgTex x={61} y={31} tex="y" color={C.mut} width={22} />
    <path d="M 100 180 Q 125 150 155 135 Q 245 90 340 90 Q 375 90 405 100" fill="none" stroke={C.mut} strokeWidth={2} />
    <Arrow x1={45} y1={220} x2={155} y2={135} color={C.minus} dashed />
    <Arrow x1={45} y1={220} x2={340} y2={90} color={C.minus} dashed />
    <Arrow x1={155} y1={135} x2={340} y2={90} color={C.ok} width={3} />
    <circle cx={155} cy={135} r={5} fill={C.wire} /><circle cx={340} cy={90} r={5} fill={C.wire} />
    <SvgTex x={132} y={106} tex="1" color={C.wire} width={20} />
    <SvgTex x={350} y={65} tex="2" color={C.wire} width={20} />
    <TexChip x={81} y={184} tex={String.raw`\vec r(t)`} color={C.minus} width={46} fontSize={16} />
    <TexChip x={232} y={159} tex={String.raw`\vec r(t+\Delta t)`} color={C.minus} width={96} fontSize={16} />
    <SvgTex x={222} y={83} tex={String.raw`\Delta\vec r`} color={C.ok} width={50} fontSize={18} />
  </Figure>;
}

export function TangentVelocityFigure() {
  return <Figure height={210} title="Посока на скоростта по траекторията" caption={String.raw`Тялото преминава последователно през $1$, $2$ и $3$. Във всяка точка скоростта е по съответната допирателна. Стрелките показват еднакви големини на скоростта, но различни посоки.`}>
    <path d="M 40 165 Q 240 -35 440 165" stroke={C.mut} strokeWidth={2} fill="none" />
    {[{x:120,y:101,dx:60,dy:-36,n:"1"},{x:240,y:65,dx:70,dy:0,n:"2"},{x:360,y:101,dx:60,dy:36,n:"3"}].map(p => <g key={p.n}>
      <line x1={p.x-p.dx*.5} y1={p.y-p.dy*.5} x2={p.x+p.dx*1.2} y2={p.y+p.dy*1.2} stroke={C.faint} strokeDasharray="5 5" />
      <Arrow x1={p.x} y1={p.y} x2={p.x+p.dx} y2={p.y+p.dy} color={C.minus} width={3} />
      <circle cx={p.x} cy={p.y} r={5} fill={C.wire} />
      <SvgTex x={p.x-5} y={p.y+26} tex={p.n} color={C.wire} width={20} />
      <SvgTex x={p.x+p.dx*.55} y={p.y+p.dy*.55-24} tex={`\\vec v_${p.n}`} color={C.minus} width={40} fontSize={17} />
    </g>)}
  </Figure>;
}

export function AccelerationComponentsFigure() {
  return <Figure height={245} title="Компоненти на ускорението" caption={String.raw`Червеното ускорение сочи наляво и нагоре. По $x$ компонентата е отрицателна, а по $y$ е положителна: $\vec a=a_x\hat i+a_y\hat j$. Знаците се определят спрямо осите, а не спрямо посоката на движение.`}>
    <Arrow x1={65} y1={190} x2={430} y2={190} color={C.faint} width={1.5} />
    <Arrow x1={265} y1={218} x2={265} y2={30} color={C.faint} width={1.5} />
    <SvgTex x={438} y={211} tex="x" color={C.mut} width={22} /><SvgTex x={283} y={29} tex="y" color={C.mut} width={22} />
    <SvgTex x={278} y={213} tex="O" color={C.wire} width={22} />
    <path d="M 145 190 V 70 H 265" fill="none" stroke={C.faint} strokeDasharray="5 5" />
    <Arrow x1={265} y1={190} x2={145} y2={190} color={C.minus} />
    <Arrow x1={265} y1={190} x2={265} y2={70} color={C.warn} />
    <Arrow x1={265} y1={190} x2={145} y2={70} color={C.plus} width={3} />
    <SvgTex x={112} y={52} tex={String.raw`\vec a`} color={C.plus} width={34} fontSize={18} />
    <SvgTex x={179} y={214} tex={String.raw`a_x\hat i`} color={C.minus} width={65} fontSize={16} />
    <SvgTex x={286} y={121} tex={String.raw`a_y\hat j`} color={C.warn} width={65} fontSize={16} />
  </Figure>;
}
