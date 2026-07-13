"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import { BTN_SEC, C, CurrentSymbol, PANEL_CLASS, STAGE_BG, STAGE_CLASS } from "./svg";

const q = (v: number) => Math.round(v * 1000) / 1000;

export default function CircularArcField() {
  const [theta, setTheta] = useState(120);
  const [radius, setRadius] = useState(0.12);
  const [current, setCurrent] = useState(4);
  const [ccw, setCcw] = useState(true);
  const cx = 290;
  const cy = 205;
  // Един източник на истина за физичния и изобразения радиус:
  // 5 cm → 45 px, 30 cm → 140 px.
  const rv = 45 + (radius - 0.05) * 380;
  const half = (theta * Math.PI) / 360;
  const point = (a: number, distance = rv) => ({
    x: q(cx + distance * Math.cos(a)),
    y: q(cy - distance * Math.sin(a)),
  });
  const start = point(-half);
  const end = point(half);
  // Фиксираното продължение пази радиалните участъци в кадър и при максимален a.
  const leadStart = point(-half, rv + 38);
  const leadEnd = point(half, rv + 38);
  const large = theta > 180 ? 1 : 0;
  const arcPath = theta >= 359.5 ? "" : `M ${start.x} ${start.y} A ${rv} ${rv} 0 ${large} 0 ${end.x} ${end.y}`;
  const thetaRad = (theta * Math.PI) / 180;
  const angleRadius = Math.min(43, Math.max(24, rv * 0.58));
  const radiusLabel = point(half, rv * 0.72);
  // Един дискретен шеврон върху проводника показва посоката, без да
  // превръща част от дъгата във втора, визуално конкурираща се линия.
  const currentMarker = point(0);
  const currentTipY = currentMarker.y + (ccw ? -7 : 7);
  const currentBaseY = currentMarker.y + (ccw ? 5 : -5);
  const currentChevron = `${q(currentMarker.x - 5)},${q(currentBaseY)} ${q(currentMarker.x)},${q(currentTipY)} ${q(currentMarker.x + 5)},${q(currentBaseY)}`;
  const fieldMicroTesla = 0.1 * current * thetaRad / radius;

  return <div className={PANEL_CLASS}>
    <div className="mb-3 flex flex-wrap gap-2">
      <button type="button" className={BTN_SEC} onClick={() => setTheta(90)}>Четвърт окръжност</button>
      <button type="button" className={BTN_SEC} onClick={() => setTheta(180)}>Полуокръжност</button>
      <button type="button" className={BTN_SEC} onClick={() => setTheta(360)}>Пълна окръжност</button>
      <button type="button" className={BTN_SEC} onClick={() => setCcw((v) => !v)}>Обърнете тока ⇅</button>
    </div>
    <svg viewBox="0 0 640 420" className={STAGE_CLASS + " select-none"} role="img" aria-label="Магнитно поле в центъра на проводник с форма на кръгова дъга">
      <rect width="640" height="420" fill={STAGE_BG}/>
      {Array.from({length:27},(_,i)=><line key={`v${i}`} x1={i*25} y1="0" x2={i*25} y2="420" stroke={C.faint} opacity="0.12"/>)}
      {Array.from({length:18},(_,i)=><line key={`h${i}`} x1="0" y1={i*25} x2="640" y2={i*25} stroke={C.faint} opacity="0.12"/>)}
      {theta >= 359.5 ? <circle cx={cx} cy={cy} r={rv} fill="none" stroke={C.warn} strokeWidth="6"/> : <>
        <line x1={leadStart.x} y1={leadStart.y} x2={start.x} y2={start.y} stroke={C.wire} strokeWidth="5"/>
        <path d={arcPath} fill="none" stroke={C.warn} strokeWidth="6" strokeLinecap="round"/>
        <line x1={end.x} y1={end.y} x2={leadEnd.x} y2={leadEnd.y} stroke={C.wire} strokeWidth="5"/>
      </>}
      <line x1={cx} y1={cy} x2={end.x} y2={end.y} stroke={C.faint} strokeDasharray="5 4"/>
      <SvgTex x={radiusLabel.x+8} y={radiusLabel.y-8} tex="a" color={C.mut} width={28}/>
      {theta >= 359.5
        ? <circle cx={cx} cy={cy} r={angleRadius} fill="none" stroke={C.plus} strokeWidth="1.8"/>
        : <path d={`M ${q(cx+angleRadius*Math.cos(-half))} ${q(cy-angleRadius*Math.sin(-half))} A ${angleRadius} ${angleRadius} 0 ${large} 0 ${q(cx+angleRadius*Math.cos(half))} ${q(cy-angleRadius*Math.sin(half))}`} fill="none" stroke={C.plus} strokeWidth="1.8"/>}
      <SvgTex x={cx+angleRadius+16} y={cy-3} tex={String.raw`\theta`} color={C.plus} width={32} anchor="middle"/>
      {theta < 359.5 && <text x="24" y="32" fill={C.mut} fontSize="12" fontWeight="700">РАДИАЛНИ УЧАСТЪЦИ: БЕЗ ПРИНОС</text>}
      <g aria-hidden="true">
        <polyline points={currentChevron} fill="none" stroke={STAGE_BG} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points={currentChevron} fill="none" stroke={C.wire} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <SvgTex x={cx+rv+15} y={cy} tex="I" color={C.wire} width={30}/>
      <CurrentSymbol x={cx} y={cy} out={ccw} r={15} color={C.ok}/>
      <SvgTex x={cx-22} y={cy+25} tex={String.raw`\vec B(O)`} color={C.ok} width={74} anchor="end"/>
    </svg>
    <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule sm:grid-cols-4">
      <div className="bg-surface px-3 py-2.5">
        <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Поле в O</dt>
        <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-ok">
          <RichText text={`$B(O)=${fieldMicroTesla.toFixed(2)}\\,\\mu\\mathrm{T}$`} />
        </dd>
      </div>
      <div className="bg-surface px-3 py-2.5">
        <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Закон за дъгата</dt>
        <dd className="mt-0.5 text-[14px] font-bold text-minus">
          <RichText text="$B(O)=\frac{\mu_0 I\theta}{4\pi a}$" />
        </dd>
      </div>
      <div className="bg-surface px-3 py-2.5">
        <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Ъгъл в радиани</dt>
        <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-minus">
          <RichText text={`$\\theta=${thetaRad.toFixed(3)}\\,\\mathrm{rad}$`} />
        </dd>
      </div>
      <div className="bg-surface px-3 py-2.5">
        <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Посока на полето</dt>
        <dd className="mt-0.5 text-[14px] font-bold text-ink">
          <RichText text={ccw ? "$\\odot$ навън от екрана" : "$\\otimes$ навътре в екрана"} />
        </dd>
      </div>
    </dl>
    <div className="mt-4 grid gap-4 sm:grid-cols-3">
      <label className="text-[13px] font-medium text-muted"><span className="flex justify-between"><span>Ъгъл <RichText text="$\theta$" /></span><strong className="text-minus"><RichText text={`$${theta}^\\circ$`} /></strong></span><input className="w-full accent-(--color-minus)" type="range" min="15" max="360" step="5" value={theta} onChange={(e)=>setTheta(+e.target.value)}/></label>
      <label className="text-[13px] font-medium text-muted"><span className="flex justify-between"><span>Радиус <RichText text="$a$" /></span><strong className="text-minus"><RichText text={`$${(radius*100).toFixed(0)}\\,\\mathrm{cm}$`} /></strong></span><input className="w-full accent-(--color-minus)" type="range" min="0.05" max="0.3" step="0.01" value={radius} onChange={(e)=>setRadius(+e.target.value)}/></label>
      <label className="text-[13px] font-medium text-muted"><span className="flex justify-between"><span>Ток <RichText text="$I$" /></span><strong className="text-minus"><RichText text={`$${current.toFixed(1)}\\,\\mathrm{A}$`} /></strong></span><input className="w-full accent-(--color-minus)" type="range" min="0.5" max="10" step="0.5" value={current} onChange={(e)=>setCurrent(+e.target.value)}/></label>
    </div>
    <p className="mt-3 text-[13.5px] text-muted"><RichText text="Всички елементи на дъгата са на едно разстояние $a$ и дават поле в една посока. Радиалните прави части не допринасят, защото $d\vec{s}\times\hat r=0$." /></p>
  </div>;
}
