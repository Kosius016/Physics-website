"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import { Arrow, BTN_SEC, C, PANEL_CLASS, STAGE_BG, STAGE_CLASS } from "./svg";

const q = (v: number) => Math.round(v * 1000) / 1000;

/**
 * Магнитният поток Φ = B·A·cos θ като „уловена площ“. Контурът се вижда
 * анфас (кръг) при θ = 0 и ръб при θ = 90°; елипсата се свива като cos θ,
 * а закрилата площ показва точно колко силови линии минават през него.
 */
export default function FluxExplorer() {
  const [B, setB] = useState(0.6); // тесла
  const [theta, setTheta] = useState(35); // градуси
  const [radiusCm, setRadiusCm] = useState(12); // радиус на контура

  const cx = 250;
  const cy = 180;
  const R = 70 + (radiusCm - 6) * 3.2; // px
  const rad = (theta * Math.PI) / 180;
  const cosT = Math.cos(rad);
  const rx = Math.max(2, Math.abs(cosT) * R); // видимата ширина ∝ |cos θ|

  const area = Math.PI * Math.pow(radiusCm / 100, 2); // m²
  const flux = B * area * cosT; // T·m²

  // Нормалата към контура сключва ъгъл θ с полето (полето е хоризонтално →).
  const nLen = R + 14;
  const nx = cx + nLen * Math.cos(rad);
  const ny = cy - nLen * Math.sin(rad);

  // Хоризонтални силови линии; тези, минаващи през елипсата, се открояват.
  const lines = [-3, -2, -1, 0, 1, 2, 3].map((k) => cy - k * (R / 3.4));

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-2">
        <button type="button" className={BTN_SEC} onClick={() => setTheta(0)}>Анфас (θ = 0°)</button>
        <button type="button" className={BTN_SEC} onClick={() => setTheta(90)}>Ръб (θ = 90°)</button>
      </div>

      <svg viewBox="0 0 640 360" className={STAGE_CLASS + " select-none"} role="img" aria-label="Магнитен поток през контур под ъгъл спрямо полето">
        <rect width="640" height="360" fill={STAGE_BG} />
        {Array.from({ length: 27 }, (_, i) => <line key={`v${i}`} x1={i * 25} y1="0" x2={i * 25} y2="360" stroke={C.faint} opacity="0.1" />)}
        {Array.from({ length: 15 }, (_, i) => <line key={`h${i}`} x1="0" y1={i * 25} x2="640" y2={i * 25} stroke={C.faint} opacity="0.1" />)}

        {/* Равномерно поле B (хоризонтално, надясно) */}
        {lines.map((y, i) => {
          const through = Math.abs(y - cy) <= R;
          return <Arrow key={i} x1={70} y1={q(y)} x2={430} y2={q(y)} color={through ? C.minus : C.faint} width={through ? 2.2 : 1.3} />;
        })}
        <SvgTex x={92} y={40} tex="\vec B" color={C.minus} fontSize={15} width={30} />

        {/* Контурът, видян под ъгъл: елипса, свиваща се като cos θ */}
        <ellipse cx={cx} cy={cy} rx={q(rx)} ry={R} fill={C.warn} fillOpacity="0.14" stroke={C.warn} strokeWidth="3" />
        {/* Нормалата n̂ и ъгълът θ спрямо полето */}
        <Arrow x1={cx} y1={cy} x2={q(nx)} y2={q(ny)} color={C.ok} width={2.4} texLabel="\hat n" texLabelDy={-4} />
        <line x1={cx} y1={cy} x2={cx + nLen} y2={cy} stroke={C.faint} strokeWidth="1.4" strokeDasharray="4 4" />
        {theta > 4 && theta < 176 && (
          <>
            <path d={`M ${q(cx + 34)} ${cy} A 34 34 0 0 ${cosT >= 0 ? 0 : 1} ${q(cx + 34 * cosT)} ${q(cy - 34 * Math.sin(rad))}`} fill="none" stroke={C.ok} strokeWidth="1.8" />
            <SvgTex x={q(cx + 48 * Math.cos(rad / 2))} y={q(cy - 48 * Math.sin(rad / 2) + 4)} tex="\theta" color={C.ok} fontSize={13} width={22} anchor="middle" />
          </>
        )}

        <text x="616" y="40" textAnchor="end" fill={C.mut} fontSize="13" fontWeight="700">УЛОВЕНАТА ПЛОЩ ∝ cos θ</text>
        <text x="250" y="330" textAnchor="middle" fill={C.mut} fontSize="12.5">жълтата площ е частта от контура, „видима“ за полето</text>
      </svg>

      <dl className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule min-[440px]:grid-cols-2 sm:grid-cols-4">
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Поле</dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-minus"><RichText text={`$B=${B.toFixed(2)}\\,\\mathrm{T}$`} /></dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Площ</dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-minus"><RichText text={`$A=${(area * 1e4).toFixed(0)}\\,\\mathrm{cm^2}$`} /></dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Ъгъл</dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-ok"><RichText text={`$\\theta=${theta}^\\circ\\;(\\cos\\theta=${cosT.toFixed(2)})$`} /></dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted"><RichText text="$\Phi_B=BA\cos\theta$" /></dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-warn" style={{ color: C.warn }}><RichText text={`$\\Phi_B=${flux.toFixed(3)}\\,\\mathrm{T\\,m^2}$`} /></dd>
        </div>
      </dl>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <label className="text-[13px] font-medium text-muted">
          <span className="flex justify-between"><span>Поле <RichText text="$B$" /></span><strong className="text-minus"><RichText text={`$${B.toFixed(2)}\\,\\mathrm{T}$`} /></strong></span>
          <input className="w-full accent-(--color-minus)" type="range" min="0.1" max="1" step="0.05" value={B} onChange={(e) => setB(+e.target.value)} />
        </label>
        <label className="text-[13px] font-medium text-muted">
          <span className="flex justify-between"><span>Ъгъл <RichText text="$\theta$" /></span><strong className="text-minus"><RichText text={`$${theta}^\\circ$`} /></strong></span>
          <input className="w-full accent-(--color-minus)" type="range" min="0" max="180" step="5" value={theta} onChange={(e) => setTheta(+e.target.value)} />
        </label>
        <label className="text-[13px] font-medium text-muted">
          <span className="flex justify-between"><span>Радиус на контура</span><strong className="text-minus"><RichText text={`$${radiusCm}\\,\\mathrm{cm}$`} /></strong></span>
          <input className="w-full accent-(--color-minus)" type="range" min="6" max="20" step="1" value={radiusCm} onChange={(e) => setRadiusCm(+e.target.value)} />
        </label>
      </div>

      <p className="mt-3 text-[13.5px] text-muted">
        <RichText text="При $\theta=0$ контурът гледа полето анфас и потокът е максимален ($\cos 0=1$). При $\theta=90^\circ$ контурът е с ръба напред и потокът е нула. Отвъд $90^\circ$ полето влиза от другата страна и $\Phi_B$ сменя знака си. Само промяната на тази стойност във времето поражда ЕДН." />
      </p>
    </div>
  );
}
