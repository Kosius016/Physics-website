"use client";

import { useEffect, useRef, useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import { Arrow, BTN_PRI, C, PANEL_CLASS, STAGE_BG, STAGE_CLASS } from "./svg";

const q = (v: number) => Math.round(v * 1000) / 1000;
const GW = 640;
const GH = 300;
const GPL = 60;
const GPR = 20;
const GPT = 24;
const GPB = 40;

/**
 * Фазовата връзка в генератора: Φ ∝ cos ωt, а ЕДН ∝ sin ωt. Двете са
 * изместени с четвърт период — точно когато потокът е максимален, ЕДН е
 * нула, и обратно. Това визуализира най-честото объркване в главата.
 */
export default function GeneratorEMF() {
  const [deg, setDeg] = useState(60);
  const [playing, setPlaying] = useState(false);
  const frameRef = useRef<number | null>(null);

  const rad = (deg * Math.PI) / 180;
  const flux = Math.cos(rad); // Φ/Φmax
  const emf = Math.sin(rad); // ℰ/ℰmax

  useEffect(() => () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); }, []);

  const play = () => {
    if (playing) {
      setPlaying(false);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      return;
    }
    setPlaying(true);
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      setDeg((d) => (d + dt * 0.06) % 360);
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
  };

  const gx = (d: number) => GPL + ((GW - GPL - GPR) * d) / 360;
  const gyMid = GPT + (GH - GPT - GPB) / 2;
  const amp = (GH - GPT - GPB) / 2 - 8;
  const gy = (v: number) => gyMid - v * amp;

  const fluxPath = Array.from({ length: 121 }, (_, i) => {
    const d = i * 3;
    return `${i ? "L" : "M"} ${q(gx(d))} ${q(gy(Math.cos((d * Math.PI) / 180)))}`;
  }).join(" ");
  const emfPath = Array.from({ length: 121 }, (_, i) => {
    const d = i * 3;
    return `${i ? "L" : "M"} ${q(gx(d))} ${q(gy(Math.sin((d * Math.PI) / 180)))}`;
  }).join(" ");

  // Малкият индикатор на контура горе вдясно: нормалата се върти с θ.
  const dcx = 566;
  const dcy = 62;
  const dR = 30;

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-2">
        <button type="button" className={BTN_PRI} onClick={play}>{playing ? "Пауза" : "Завъртете ▶"}</button>
      </div>

      <svg viewBox={`0 0 ${GW} ${GH}`} className={STAGE_CLASS + " select-none"} role="img" aria-label="Магнитен поток и индуцирано ЕДН като функция на ъгъла на завъртане">
        <rect width={GW} height={GH} fill={STAGE_BG} />

        {/* нулева ос и вертикали през 90° */}
        <line x1={GPL} y1={gy(0)} x2={GW - GPR} y2={gy(0)} stroke={C.wire} opacity="0.18" strokeWidth="1" />
        {[90, 180, 270].map((d) => <line key={d} x1={gx(d)} y1={GPT} x2={gx(d)} y2={GH - GPB} stroke={C.wire} opacity="0.08" />)}
        {[0, 90, 180, 270, 360].map((d) => (
          <text key={d} x={gx(d)} y={GH - GPB + 18} fill={C.mut} fontSize="11.5" textAnchor="middle">{d}°</text>
        ))}

        {/* кривите */}
        <path d={fluxPath} fill="none" stroke={C.minus} strokeWidth="2.6" />
        <path d={emfPath} fill="none" stroke={C.ok} strokeWidth="2.6" />
        <SvgTex x={GPL + 6} y={gy(1) - 4} tex="\Phi_B\propto\cos\omega t" color={C.minus} fontSize={12.5} width={112} />
        <SvgTex x={gx(96)} y={gy(1) - 4} tex="\mathcal{E}\propto\sin\omega t" color={C.ok} fontSize={12.5} width={96} />

        {/* марковата линия и точки на текущия ъгъл */}
        <line x1={gx(deg)} y1={GPT} x2={gx(deg)} y2={GH - GPB} stroke={C.faint} strokeWidth="1.4" strokeDasharray="4 4" />
        <circle cx={gx(deg)} cy={gy(flux)} r="5.5" fill={C.minus} stroke={STAGE_BG} strokeWidth="2" />
        <circle cx={gx(deg)} cy={gy(emf)} r="5.5" fill={C.ok} stroke={STAGE_BG} strokeWidth="2" />

        {/* индикатор на контура: нормала спрямо полето */}
        <circle cx={dcx} cy={dcy} r={dR} fill="none" stroke={C.faint} strokeWidth="1.3" />
        <ellipse cx={dcx} cy={dcy} rx={q(Math.abs(flux) * dR)} ry={dR} fill={C.warn} fillOpacity="0.14" stroke={C.warn} strokeWidth="2" />
        <Arrow x1={dcx} y1={dcy} x2={q(dcx + (dR + 8) * Math.cos(rad))} y2={q(dcy - (dR + 8) * Math.sin(rad))} color={C.ok} width={2} />
      </svg>

      <dl className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule sm:grid-cols-3">
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Ъгъл</dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-ink"><RichText text={`$\\omega t=${deg.toFixed(0)}^\\circ$`} /></dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Поток</dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-minus"><RichText text={`$\\Phi_B/\\Phi_{\\max}=${flux.toFixed(2)}$`} /></dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">ЕДН</dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-ok"><RichText text={`$\\mathcal{E}/\\mathcal{E}_{\\max}=${emf.toFixed(2)}$`} /></dd>
        </div>
      </dl>

      <label className="mt-4 block text-[13px] font-medium text-muted">
        <span className="flex justify-between"><span>Ъгъл на завъртане <RichText text="$\omega t$" /></span><strong className="text-minus"><RichText text={`$${deg.toFixed(0)}^\\circ$`} /></strong></span>
        <input className="w-full accent-(--color-minus)" type="range" min="0" max="360" step="1" value={deg} onChange={(e) => { setPlaying(false); if (frameRef.current) cancelAnimationFrame(frameRef.current); setDeg(+e.target.value); }} />
      </label>

      <p className="mt-3 text-[13.5px] text-muted">
        <RichText text="Плъзнете ъгъла: там, където потокът (синьо) е в **връх или дъно**, наклонът му е нула и ЕДН (зелено) минава през **нула**. Там, където потокът пресича нулата, той се мени най-бързо и ЕДН е **максимално**. Затова максимален поток означава нулево ЕДН — важна е скоростта на изменение, не самата стойност." />
      </p>
    </div>
  );
}
