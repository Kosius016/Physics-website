"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import { Arrow, BTN_SEC, C, CurrentSymbol, PANEL_CLASS, STAGE_BG, STAGE_CLASS } from "./svg";

const MU0 = 4 * Math.PI * 1e-7;
const W = 700;
const H = 410;

export default function LoopAxisField() {
  const [ratio, setRatio] = useState(1.5);
  const [radius, setRadius] = useState(0.1);
  const [current, setCurrent] = useState(3);
  const [right, setRight] = useState(true);
  const loopX = 155;
  const cy = 205;
  // Един източник на истина за физичния и изобразения радиус:
  // 5 cm → 45 px, 20 cm → 90 px.
  const aPx = 45 + (radius - 0.05) * 300;
  const loopRx = aPx * 0.27;
  // P тръгва от центъра на контура (x = 0) и се движи по оста
  const pX = loopX + ratio * aPx;
  const x = ratio * radius;
  const field = (MU0 * current * radius * radius) / (2 * Math.pow(radius * radius + x * x, 1.5));
  const fieldMicroTesla = field * 1e6;
  const dir = right ? 1 : -1;
  // Наклонът на отделните dB зависи от позицията: cos α = a/r, sin α = x/r
  const hyp = Math.hypot(1, ratio);
  const cosA = 1 / hyp;
  const sinA = ratio / hyp;
  const dbLen = 74;
  // Близо до центъра двата dB съвпадат по посока — разтваряме етикетите им,
  // за да не се застъпват, и прибираме отместването с раздалечаването на върховете.
  const dbLabelSpread = 12 * (1 - sinA);
  // Резултантът отслабва като 1/(1+x²/a²)^{3/2}
  const bLen = 28 + 72 / Math.pow(1 + ratio * ratio, 1.5);

  return <div className={PANEL_CLASS}>
    <div className="mb-3 flex flex-wrap justify-between gap-2"><p className="text-[14px] text-muted"><RichText text="Местете $P$ по оста и следете как симетричните напречни компоненти се унищожават." /></p><button type="button" className={BTN_SEC} onClick={()=>setRight(v=>!v)}>Обърнете тока ⇅</button></div>
    <svg viewBox={`0 0 ${W} ${H}`} className={STAGE_CLASS+" select-none"} role="img" aria-label="Магнитно поле по оста на кръгов токов контур">
      <rect width={W} height={H} fill={STAGE_BG}/>
      {Array.from({length:29},(_,i)=><line key={`v${i}`} x1={i*25} y1="0" x2={i*25} y2={H} stroke={C.faint} opacity="0.12"/>)}
      {Array.from({length:18},(_,i)=><line key={`h${i}`} x1="0" y1={i*25} x2={W} y2={i*25} stroke={C.faint} opacity="0.12"/>)}
      <line x1="32" y1={cy} x2={W-24} y2={cy} stroke={C.faint} strokeDasharray="7 6"/>
      <ellipse cx={loopX} cy={cy} rx={loopRx} ry={aPx} fill={C.minus} fillOpacity="0.07" stroke={C.warn} strokeWidth="5"/>
      {/* B по +x̂ ⇒ токът обикаля обратно на час. стрелка, гледано от +x:
          в горната точка (+y) токът е по +ẑ — към зрителя (⊙). */}
      <CurrentSymbol x={loopX} y={cy-aPx} out={right} r={9} color={C.warn} texLabel="I"/>
      <CurrentSymbol x={loopX} y={cy+aPx} out={!right} r={9} color={C.warn}/>
      <SvgTex x={loopX-18} y={cy-aPx-16} tex={String.raw`d\vec s_1`} color={C.mut} fontSize={12} width={62} anchor="end"/><SvgTex x={loopX-18} y={cy+aPx+20} tex={String.raw`d\vec s_2`} color={C.mut} fontSize={12} width={62} anchor="end"/>
      <line x1={loopX} y1={cy} x2={pX} y2={cy} stroke={C.mut} strokeDasharray="5 4"/><SvgTex x={(loopX+pX)/2} y={cy-14} tex="x" color={C.mut} width={28} anchor="middle"/>
      <line x1={loopX} y1={cy} x2={loopX} y2={cy-aPx} stroke={C.faint}/><SvgTex x={loopX+10} y={cy-aPx/2} tex="a" color={C.mut} width={28}/>
      <circle cx={pX} cy={cy} r="6" fill={C.wire}/><SvgTex x={pX+10} y={cy-12} tex="P" color={C.wire} width={28}/>
      {/* dB от горния и долния елемент: осева част cosα, напречни части ±sinα */}
      <Arrow x1={pX} y1={cy} x2={pX+dir*cosA*dbLen} y2={cy-dir*sinA*dbLen} color={C.plus} width={1.8} texLabel={String.raw`d\vec B_1`} texLabelDx={dir > 0 ? 0 : 60} texLabelDy={-3 - dbLabelSpread} texLabelAnchor={dir > 0 ? undefined : "start"}/>
      <Arrow x1={pX} y1={cy} x2={pX+dir*cosA*dbLen} y2={cy+dir*sinA*dbLen} color={C.plus} width={1.8} texLabel={String.raw`d\vec B_2`} texLabelDx={dir > 0 ? 0 : 60} texLabelDy={7 + dbLabelSpread} texLabelAnchor={dir > 0 ? undefined : "start"}/>
      {ratio > 0.15 && <line x1={pX+dir*cosA*dbLen} y1={cy-dir*sinA*dbLen} x2={pX+dir*cosA*dbLen} y2={cy+dir*sinA*dbLen} stroke={C.faint} strokeDasharray="4 4"/>}
      <Arrow x1={pX} y1={cy} x2={pX+dir*bLen} y2={cy} color={C.ok} width={3.2} texLabel={String.raw`\vec B`} texLabelDx={dir > 0 ? 0 : 60} texLabelDy={dir > 0 ? -11 : 18} texLabelAnchor={dir > 0 ? undefined : "start"}/>
      <text x={W-24} y="36" textAnchor="end" fill={C.mut} fontSize="12.5">НАПРЕЧНИТЕ КОМПОНЕНТИ СЕ УНИЩОЖАВАТ</text>
    </svg>
    <dl className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule sm:grid-cols-6">
      <div className="bg-surface px-3 py-2.5 sm:col-span-2">
        <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted"><RichText text="Поле в $P$" /></dt>
        <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-ok">
          <RichText text={`$|B_x|=${fieldMicroTesla.toFixed(3)}\\,\\mu\\mathrm{T}$`} />
        </dd>
      </div>
      <div className="bg-surface px-3 py-2.5 sm:col-span-2">
        <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Поле по оста</dt>
        <dd className="mt-0.5 text-[13.5px] font-bold text-minus">
          <RichText text="$|B_x|=\frac{\mu_0 I a^2}{2(a^2+x^2)^{3/2}}$" />
        </dd>
      </div>
      <div className="bg-surface px-3 py-2.5">
        <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Положение</dt>
        <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-minus">
          <RichText text={`$x/a=${ratio.toFixed(1)}$`} />
        </dd>
      </div>
      <div className="bg-surface px-3 py-2.5">
        <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Посока на полето</dt>
        <dd className="mt-0.5 text-[15px] font-bold text-ink">
          <RichText text={right ? "$+\\hat{x}$" : "$-\\hat{x}$"} />
        </dd>
      </div>
    </dl>
    <div className="mt-4 grid gap-4 sm:grid-cols-3">
      <label className="text-[13px] font-medium text-muted"><span className="flex justify-between"><span>Положение <RichText text="$x/a$" /></span><strong className="text-minus"><RichText text={`$${ratio.toFixed(1)}$`} /></strong></span><input className="w-full accent-(--color-minus)" type="range" min="0" max="5" step="0.1" value={ratio} onChange={(e)=>setRatio(+e.target.value)}/></label>
      <label className="text-[13px] font-medium text-muted"><span className="flex justify-between"><span>Радиус <RichText text="$a$" /></span><strong className="text-minus"><RichText text={`$${(radius*100).toFixed(0)}\\,\\mathrm{cm}$`} /></strong></span><input className="w-full accent-(--color-minus)" type="range" min="0.05" max="0.2" step="0.01" value={radius} onChange={(e)=>setRadius(+e.target.value)}/></label>
      <label className="text-[13px] font-medium text-muted"><span className="flex justify-between"><span>Ток <RichText text="$I$" /></span><strong className="text-minus"><RichText text={`$${current.toFixed(1)}\\,\\mathrm{A}$`} /></strong></span><input className="w-full accent-(--color-minus)" type="range" min="0.5" max="8" step="0.5" value={current} onChange={(e)=>setCurrent(+e.target.value)}/></label>
    </div>
    <p className="mt-3 text-[13.5px] text-muted"><RichText text="За всяка двойка срещуположни елементи напречните части на $d\vec B$ са равни и противоположни. Остават само компонентите по оста — те се събират." /></p>
  </div>;
}
