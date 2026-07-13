"use client";

import { useEffect, useRef, useState } from "react";
import RichText from "@/components/RichText";
import { BTN_PRI, BTN_SEC, C, PANEL_CLASS, STAGE_BG, STAGE_CLASS } from "./svg";

const U = 1.66054e-27;
const E = 1.60218e-19;
const q3 = (v: number) => Math.round(v * 1000) / 1000;

export default function ParticleDeflectionLab() {
  const [mass, setMass] = useState(20);
  const [speed, setSpeed] = useState(3);
  const [field, setField] = useState(0.5);
  const [positive, setPositive] = useState(true);
  const [fieldOut, setFieldOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const frameRef = useRef<number | null>(null);

  const radiusMeters = (mass * U * speed * 1e5) / (E * field);
  const radiusCm = radiusMeters * 100;
  const radiusPx = Math.max(48, Math.min(230, 38 + radiusCm * 7));
  const curve = (positive ? 1 : -1) * (fieldOut ? 1 : -1); // + надолу на екрана
  const x0 = 78;
  const y0 = 185;
  const maxT = 2.35;
  const centerY = y0 + curve * radiusPx;
  const point = (t: number) => ({ x: q3(x0 + radiusPx * Math.sin(t)), y: q3(centerY - curve * radiusPx * Math.cos(t)) });
  const path = (fraction: number) => Array.from({ length: 81 }, (_, i) => point(maxT * Math.min(i / 80, fraction))).map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join(" ");
  const particle = point(maxT * progress);

  useEffect(() => () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); }, []);
  useEffect(() => {
    setProgress(0);
    setPlaying(false);
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
  }, [mass, speed, field, positive, fieldOut]);

  const play = () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    setPlaying(true);
    const startProgress = progress >= 0.995 ? 0 : progress;
    const started = performance.now();
    const duration = 2600 * (1 - startProgress);
    const tick = (now: number) => {
      const p = Math.min(startProgress + (now - started) / Math.max(duration, 1) * (1 - startProgress), 1);
      setProgress(p);
      if (p < 1) frameRef.current = requestAnimationFrame(tick);
      else { frameRef.current = null; setPlaying(false); }
    };
    frameRef.current = requestAnimationFrame(tick);
  };

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-2">
        <button type="button" className={BTN_PRI} disabled={playing} onClick={play}>{playing ? "Лети…" : progress > 0 ? "Продължи ▶" : "Пусни частицата ▶"}</button>
        <button type="button" className={BTN_SEC} onClick={() => { setProgress(0); setPlaying(false); if (frameRef.current) cancelAnimationFrame(frameRef.current); }}>Нулирай</button>
        <button type="button" className={BTN_SEC} onClick={() => setPositive((v) => !v)}>Заряд: <RichText text={positive ? "$+e$" : "$-e$"} /></button>
        <button type="button" className={BTN_SEC} onClick={() => setFieldOut((v) => !v)}><RichText text="$B$" />: {fieldOut ? "⊙" : "⊗"}</button>
      </div>

      <svg viewBox="0 0 640 370" className={STAGE_CLASS + " select-none"} role="img" aria-label="Отклонение на заредена частица в еднородно магнитно поле">
        <rect width="640" height="370" fill={STAGE_BG} />
        {Array.from({ length: 70 }, (_, i) => { const x = 28 + (i % 10) * 64; const y = 30 + Math.floor(i / 10) * 52; return fieldOut ? <g key={i} opacity=".36"><circle cx={x} cy={y} r="6" fill="none" stroke={C.minus} /><circle cx={x} cy={y} r="2" fill={C.minus} /></g> : <g key={i} opacity=".36" stroke={C.minus} strokeWidth="1.4"><line x1={x-4} y1={y-4} x2={x+4} y2={y+4}/><line x1={x-4} y1={y+4} x2={x+4} y2={y-4}/></g>; })}
        <path d={path(1)} fill="none" stroke={C.wire} strokeOpacity={0.2} strokeWidth="2" strokeDasharray="7 6" />
        <path d={path(progress)} fill="none" stroke={C.warn} strokeWidth="3" />
        <line x1="36" y1={y0} x2={x0 - 16} y2={y0} stroke={C.warn} strokeWidth="3" />
        <polygon points={`${x0-5},${y0} ${x0-18},${y0-7} ${x0-18},${y0+7}`} fill={C.warn} />
        <circle cx={particle.x} cy={particle.y} r="11" fill={positive ? C.plus : C.minus} stroke={C.wire} strokeWidth="2.3" />
        <text x={particle.x} y={particle.y + 5} fill={C.wire} textAnchor="middle" fontSize="15" fontWeight="700">{positive ? "+" : "−"}</text>
        <text x="24" y="28" fill={C.mut} fontSize="13" fontWeight="700">ЕДНОРОДНО B {fieldOut ? "НАВЪН ⊙" : "НАВЪТРЕ ⊗"}</text>
      </svg>

      <dl className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule sm:grid-cols-2">
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Радиус на траекторията</dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-ok">
            <RichText text={String.raw`$r=${radiusCm.toFixed(2)}\,\mathrm{cm}$`} />
          </dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Зависимост</dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-minus">
            <RichText text={String.raw`$r=\dfrac{mv}{|q|B}$`} />
          </dd>
        </div>
      </dl>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <label className="text-[13px] font-medium text-muted"><span className="flex justify-between"><span>Маса на йона</span><strong className="text-minus"><RichText text={`$${mass}\\,\\mathrm{u}$`} /></strong></span><input className="w-full accent-(--color-minus)" type="range" min="1" max="40" step="1" value={mass} onChange={(e)=>setMass(+e.target.value)} /></label>
        <label className="text-[13px] font-medium text-muted"><span className="flex justify-between"><span>Скорост</span><strong className="text-minus"><RichText text={`$${speed.toFixed(1)}\\times10^5\\,\\mathrm{m/s}$`} /></strong></span><input className="w-full accent-(--color-minus)" type="range" min="1" max="5" step="0.2" value={speed} onChange={(e)=>setSpeed(+e.target.value)} /></label>
        <label className="text-[13px] font-medium text-muted"><span className="flex justify-between"><span>Поле <RichText text="$B$" /></span><strong className="text-minus"><RichText text={`$${field.toFixed(1)}\\,\\mathrm{T}$`} /></strong></span><input className="w-full accent-(--color-minus)" type="range" min="0.2" max="1" step="0.1" value={field} onChange={(e)=>setField(+e.target.value)} /></label>
      </div>
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted"><RichText text="По-тежък или по-бърз йон завива по-плавно; по-силно поле прави по-малък радиус. Смяната на знака или на $B$ обръща посоката, но не променя радиуса." /></p>
    </div>
  );
}
