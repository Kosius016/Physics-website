"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import { Arrow, BTN_SEC, C, CurrentSymbol, PANEL_CLASS, STAGE_BG, STAGE_CLASS } from "./svg";

const MU0 = 4 * Math.PI * 1e-7;

export default function ParallelWireForce() {
  const [i1, setI1] = useState(10);
  const [i2, setI2] = useState(8);
  const [distance, setDistance] = useState(0.2);
  const [out1, setOut1] = useState(true);
  const [out2, setOut2] = useState(true);
  const same = out1 === out2;
  const b1 = MU0 * i1 / (2 * Math.PI * distance);
  const forcePerLength = MU0 * i1 * i2 / (2 * Math.PI * distance);
  const leftX = 205;
  const rightX = 435;
  const cy = 205;
  const forceScale = Math.min(92, 45 + forcePerLength * 5e5);

  return <div className={PANEL_CLASS}>
    <div className="mb-3 flex flex-wrap gap-2"><button type="button" className={BTN_SEC} onClick={()=>setOut1(v=>!v)}>Обърнете <RichText text="$I_1$" /> ⇅</button><button type="button" className={BTN_SEC} onClick={()=>setOut2(v=>!v)}>Обърнете <RichText text="$I_2$" /> ⇅</button><button type="button" className={BTN_SEC} onClick={()=>{setOut1(true);setOut2(true);}}>Еднакви токове</button><button type="button" className={BTN_SEC} onClick={()=>{setOut1(true);setOut2(false);}}>Противоположни</button></div>
    <svg viewBox="0 0 640 410" className={STAGE_CLASS+" select-none"} role="img" aria-label="Сила между два успоредни проводника с ток">
      <rect width="640" height="410" fill={STAGE_BG}/>
      {Array.from({length:27},(_,i)=><line key={`v${i}`} x1={i*25} y1="0" x2={i*25} y2="410" stroke={C.wire} opacity={0.045}/>)}
      {Array.from({length:18},(_,i)=><line key={`h${i}`} x1="0" y1={i*25} x2="640" y2={i*25} stroke={C.wire} opacity={0.045}/>)}
      {[52,88,126].map(r=><g key={r}><circle cx={leftX} cy={cy} r={r} fill="none" stroke={C.minus} strokeOpacity={0.15}/><circle cx={rightX} cy={cy} r={r} fill="none" stroke={C.plus} strokeOpacity={0.12}/></g>)}
      <line x1={leftX} y1={cy+145} x2={rightX} y2={cy+145} stroke={C.mut} strokeWidth="1.5"/><line x1={leftX} y1={cy+137} x2={leftX} y2={cy+153} stroke={C.mut}/><line x1={rightX} y1={cy+137} x2={rightX} y2={cy+153} stroke={C.mut}/><SvgTex x={(leftX+rightX)/2} y={cy+168} tex="d" color={C.mut} width={28} anchor="middle"/>
      <CurrentSymbol x={leftX} y={cy} out={out1} r={21} color={C.minus} texLabel="I_1"/><CurrentSymbol x={rightX} y={cy} out={out2} r={21} color={C.plus} texLabel="I_2"/>
      <Arrow x1={rightX+35} y1={cy+(out1?50:-50)} x2={rightX+35} y2={cy+(out1?-50:50)} color={C.minus} width={2.2} texLabel="\vec B_1" texLabelDx={8}/>
      <Arrow x1={rightX} y1={cy-46} x2={rightX+(same?-forceScale:forceScale)} y2={cy-46} color={C.ok} width={3.2}/>
      <Arrow x1={leftX} y1={cy-46} x2={leftX+(same?forceScale:-forceScale)} y2={cy-46} color={C.ok} width={3.2}/>
      <SvgTex x={rightX+(same?-forceScale/2:forceScale/2)} y={cy-71} tex="\vec F_2/L" color={C.ok} width={72} anchor="middle"/>
      <SvgTex x={leftX+(same?forceScale/2:-forceScale/2)} y={cy-71} tex="\vec F_1/L" color={C.ok} width={72} anchor="middle"/>
      <text x="24" y="32" fill={C.mut} fontSize="13" fontWeight="700">НАПРЕЧЕН РАЗРЕЗ: ⊙ навън, ⊗ навътре</text>
      <text x="616" y="38" textAnchor="end" fill={same?C.ok:C.warn} fontSize="21" fontWeight="700">{same?"ПРИВЛИЧАНЕ":"ОТБЛЪСКВАНЕ"}</text>
    </svg>
    <dl className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule min-[440px]:grid-cols-2 sm:grid-cols-4">
      <div className="min-w-0 bg-surface px-3 py-2.5">
        <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Поле при проводник 2</dt>
        <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-minus">
          <RichText text={String.raw`$B_1=${(b1*1e6).toFixed(2)}\,\mu\mathrm{T}$`} />
        </dd>
      </div>
      <div className="min-w-0 bg-surface px-3 py-2.5">
        <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Сила на единица дължина</dt>
        <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-ok">
          <RichText text={String.raw`$\dfrac{F}{L}=${(forcePerLength*1e6).toFixed(2)}\,\mu\mathrm{N/m}$`} />
        </dd>
      </div>
      <div className="min-w-0 bg-surface px-3 py-2.5">
        <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Посока</dt>
        <dd className="mt-0.5 text-[15px] font-bold text-ink">{same?"навътре":"навън"}</dd>
      </div>
      <div className="min-w-0 bg-surface px-3 py-2.5">
        <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">
          <RichText text={String.raw`$\vec F_1$ и $\vec F_2$`} />
        </dt>
        <dd className="mt-0.5 text-[15px] font-bold text-ink">
          <RichText text={String.raw`**равни, срещуположни**; $\vec F_1=-\vec F_2$`} />
        </dd>
      </div>
    </dl>
    <div className="mt-4 grid gap-4 sm:grid-cols-3">
      <label className="text-[13px] font-medium text-muted"><span className="flex justify-between"><span>Ток <RichText text="$I_1$" /></span><strong className="text-minus"><RichText text={`$${i1.toFixed(0)}\\,\\mathrm{A}$`} /></strong></span><input className="w-full accent-(--color-minus)" type="range" min="1" max="50" step="1" value={i1} onChange={(e)=>setI1(+e.target.value)}/></label>
      <label className="text-[13px] font-medium text-muted"><span className="flex justify-between"><span>Ток <RichText text="$I_2$" /></span><strong className="text-minus"><RichText text={`$${i2.toFixed(0)}\\,\\mathrm{A}$`} /></strong></span><input className="w-full accent-(--color-minus)" type="range" min="1" max="50" step="1" value={i2} onChange={(e)=>setI2(+e.target.value)}/></label>
      <label className="text-[13px] font-medium text-muted"><span className="flex justify-between"><span>Разстояние <RichText text="$d$" /></span><strong className="text-minus"><RichText text={`$${(distance*100).toFixed(0)}\\,\\mathrm{cm}$`} /></strong></span><input className="w-full accent-(--color-minus)" type="range" min="0.05" max="0.5" step="0.01" value={distance} onChange={(e)=>setDistance(+e.target.value)}/></label>
    </div>
  </div>;
}
