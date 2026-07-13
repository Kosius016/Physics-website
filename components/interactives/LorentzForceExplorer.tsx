"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import { Arrow, BTN_SEC, C, PANEL_CLASS, STAGE_BG, STAGE_CLASS } from "./svg";

const q3 = (v: number) => Math.round(v * 1000) / 1000;

export default function LorentzForceExplorer() {
  const [positive, setPositive] = useState(true);
  const [fieldOut, setFieldOut] = useState(true);
  const [angle, setAngle] = useState(20);
  const [speed, setSpeed] = useState(4);
  const [field, setField] = useState(0.5);

  const cx = 320;
  const cy = 205;
  const a = (angle * Math.PI) / 180;
  const vx = Math.cos(a);
  const vyScreen = -Math.sin(a);
  const sign = (positive ? 1 : -1) * (fieldOut ? 1 : -1);
  const fx = q3(Math.sin(a) * sign);
  const fyScreen = q3(Math.cos(a) * sign);
  const vLength = 72 + speed * 9;
  const fLength = 54 + field * speed * 11;
  const force = 1.602e-19 * speed * 1e6 * field;

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-2">
        <button type="button" className={BTN_SEC} onClick={() => setPositive((v) => !v)}>
          Заряд: <RichText text={positive ? "$+q$" : "$-q$"} />
        </button>
        <button type="button" className={BTN_SEC} onClick={() => setFieldOut((v) => !v)}>
          <RichText text="$B$" />: {fieldOut ? "⊙ навън" : "⊗ навътре"}
        </button>
      </div>

      <svg viewBox="0 0 640 410" className={STAGE_CLASS + " select-none"} role="img" aria-label="Посока на магнитната сила върху движещ се заряд">
        <rect width="640" height="410" fill={STAGE_BG} />
        {Array.from({ length: 60 }, (_, i) => {
          const x = 28 + (i % 10) * 64;
          const y = 34 + Math.floor(i / 10) * 64;
          return fieldOut ? (
            <g key={i} opacity=".42"><circle cx={x} cy={y} r="7" fill="none" stroke={C.minus} /><circle cx={x} cy={y} r="2.2" fill={C.minus} /></g>
          ) : (
            <g key={i} opacity=".42" stroke={C.minus} strokeWidth="1.5"><line x1={x - 5} y1={y - 5} x2={x + 5} y2={y + 5} /><line x1={x - 5} y1={y + 5} x2={x + 5} y2={y - 5} /></g>
          );
        })}

        <circle cx={cx} cy={cy} r="18" fill={positive ? C.plus : C.minus} stroke={C.wire} strokeWidth="2.5" />
        <text x={cx} y={cy + 6} fill={C.wire} fontSize="20" fontWeight="700" textAnchor="middle">{positive ? "+" : "−"}</text>
        <Arrow x1={cx} y1={cy} x2={q3(cx + vx * vLength)} y2={q3(cy + vyScreen * vLength)} color={C.warn} width={3} texLabel="\vec v" texLabelDy={-4} />
        <Arrow x1={cx} y1={cy} x2={q3(cx + fx * fLength)} y2={q3(cy + fyScreen * fLength)} color={C.ok} width={3} texLabel="\vec F_B" texLabelDy={3} />
        <path d={`M ${q3(cx + vx * 42)} ${q3(cy + vyScreen * 42)} A 42 42 0 0 ${sign > 0 ? 1 : 0} ${q3(cx + fx * 42)} ${q3(cy + fyScreen * 42)}`} fill="none" stroke={C.faint} strokeWidth="1.5" strokeDasharray="4 4" />
        <text x="24" y="30" fill={C.mut} fontSize="13" fontWeight="700">ЕДНОРОДНО ПОЛЕ B {fieldOut ? "ИЗЛИЗА ОТ ЕКРАНА" : "ВЛИЗА В ЕКРАНА"}</text>
        <text x="616" y="34" fill={C.mut} fontSize="13" textAnchor="end">за −q посоката се обръща</text>
      </svg>

      <dl className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule min-[440px]:grid-cols-2 sm:grid-cols-4">
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Заряд</dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-plus">
            <RichText text={String.raw`$q=${positive ? "+e" : "-e"}$`} />
          </dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Ъгъл скорост–поле</dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-minus">
            <RichText text={String.raw`$\angle(\vec v,\vec B)=90^\circ$`} />
          </dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">
            <RichText text={String.raw`$\vec F_m\perp\vec v$`} />
          </dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-ok">
            <RichText text={String.raw`$|\vec F_m|=${(force / 1e-13).toFixed(2)}\!\times\!10^{-13}\,\mathrm{N}$`} />
          </dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">
            <RichText text={String.raw`$P=\vec F_m\!\cdot\!\vec v$`} />
          </dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-ok">
            <RichText text={String.raw`$P=0\,\mathrm{W}$`} />
          </dd>
        </div>
      </dl>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <label className="text-[13px] font-medium text-muted"><span className="flex justify-between"><span>Посока на <RichText text="$\vec v$" /></span><strong className="text-minus"><RichText text={`$${angle}^\\circ$`} /></strong></span><input className="w-full accent-(--color-minus)" type="range" min="0" max="180" step="5" value={angle} onChange={(e) => setAngle(+e.target.value)} /></label>
        <label className="text-[13px] font-medium text-muted"><span className="flex justify-between"><span>Скорост</span><strong className="text-minus"><RichText text={`$${speed.toFixed(1)}\\times10^6\\,\\mathrm{m/s}$`} /></strong></span><input className="w-full accent-(--color-minus)" type="range" min="1" max="8" step="0.5" value={speed} onChange={(e) => setSpeed(+e.target.value)} /></label>
        <label className="text-[13px] font-medium text-muted"><span className="flex justify-between"><span>Поле <RichText text="$B$" /></span><strong className="text-minus"><RichText text={`$${field.toFixed(1)}\\,\\mathrm{T}$`} /></strong></span><input className="w-full accent-(--color-minus)" type="range" min="0.1" max="1" step="0.1" value={field} onChange={(e) => setField(+e.target.value)} /></label>
      </div>
    </div>
  );
}
