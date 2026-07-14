"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import { Arrow, C, CurrentSymbol, PANEL_CLASS, STAGE_BG, STAGE_CLASS } from "./svg";

const q = (v: number) => Math.round(v * 1000) / 1000;

/**
 * Извеждането на закона на Ампер, стъпка 1: по центриран кръг около прав
 * проводник произведението B·2πr не зависи от радиуса. Полето отслабва
 * като 1/r точно толкова, колкото пътеката се удължава като r — двете се
 * съкращават и остава само μ₀I.
 *
 * Дясната половина на сцената прави съкращаването видимо: правоъгълник с
 * височина B и ширина 2πr, чиято площ не се променя при движение на плъзгача.
 */
export default function CirculationRadius() {
  const [radius, setRadius] = useState(1.0); // метри
  const [current, setCurrent] = useState(2); // ампери

  const cx = 172;
  const cy = 205;
  // 0.5 m → 62 px, 2.0 m → 140 px
  const rPx = 62 + ((radius - 0.5) / 1.5) * 78;

  const fieldMicro = 0.2 * current / radius; // μ₀I/2πr в μT
  const pathLength = 2 * Math.PI * radius; // 2πr в метри
  const product = fieldMicro * pathLength; // μ₀I в μT·m — константа по r

  // Тангенциални стрелки по пътеката; дължината им следва B ∝ 1/r
  const arrowLen = Math.min(30, 13 + 34 / radius);
  const arrows = Array.from({ length: 12 }, (_, i) => {
    const a = (2 * Math.PI * i) / 12;
    const x = cx + rPx * Math.cos(a);
    const y = cy + rPx * Math.sin(a);
    // ⊙ ток → полето обикаля обратно на часовниковата стрелка
    const tx = Math.sin(a);
    const ty = -Math.cos(a);
    return {
      x1: q(x - tx * arrowLen * 0.5),
      y1: q(y - ty * arrowLen * 0.5),
      x2: q(x + tx * arrowLen * 0.5),
      y2: q(y + ty * arrowLen * 0.5),
    };
  });

  // Правоъгълникът с постоянна площ: h ∝ B, w ∝ 2πr, площ ∝ μ₀I
  const rectScaleW = 13.5; // px за метър обиколка
  const rectScaleH = 150; // px за μT
  const rw = pathLength * rectScaleW;
  const rh = fieldMicro * rectScaleH;
  const rectRight = 610;
  const rectBottom = 330;

  return (
    <div className={PANEL_CLASS}>
      <svg viewBox="0 0 640 400" className={STAGE_CLASS + " select-none"} role="img" aria-label="Циркулация на магнитното поле по кръг около прав проводник — произведението B по 2πr не зависи от радиуса">
        <rect width="640" height="400" fill={STAGE_BG} />
        {Array.from({ length: 27 }, (_, i) => <line key={`v${i}`} x1={i * 25} y1="0" x2={i * 25} y2="400" stroke={C.faint} opacity="0.12" />)}
        {Array.from({ length: 17 }, (_, i) => <line key={`h${i}`} x1="0" y1={i * 25} x2="640" y2={i * 25} stroke={C.faint} opacity="0.12" />)}

        {/* Лявата половина: проводник + амперов кръг */}
        <circle cx={cx} cy={cy} r={rPx} fill="none" stroke={C.warn} strokeWidth="2.6" strokeDasharray="8 5" />
        <g opacity="0.9">{arrows.map((a, i) => <Arrow key={i} {...a} color={C.minus} width={2} />)}</g>
        <line x1={cx} y1={cy} x2={q(cx + rPx * 0.7071)} y2={q(cy - rPx * 0.7071)} stroke={C.faint} strokeWidth="1.3" strokeDasharray="4 4" />
        <SvgTex x={q(cx + rPx * 0.42)} y={q(cy - rPx * 0.42 - 6)} tex="r" color={C.mut} width={24} />
        <CurrentSymbol x={cx} y={cy} out r={15} color={C.plus} texLabel="I" />
        <SvgTex x={q(cx + rPx * 0.26)} y={q(cy + rPx + 8)} tex="\vec B \parallel d\vec l" color={C.minus} fontSize={12.5} width={84} anchor="middle" />
        <text x="24" y="34" fill={C.mut} fontSize="13" fontWeight="700">ПЪТЕКАТА СЛЕДВА ПОЛЕТО</text>

        {/* Дясната половина: правоъгълникът с постоянна площ */}
        <text x={rectRight} y="34" textAnchor="end" fill={C.mut} fontSize="13" fontWeight="700">ПЛОЩТА НЕ СЕ ПРОМЕНЯ</text>
        <rect
          x={q(rectRight - rw)}
          y={q(rectBottom - rh)}
          width={q(rw)}
          height={q(rh)}
          fill={C.ok}
          fillOpacity="0.18"
          stroke={C.ok}
          strokeWidth="2.2"
          style={{ transition: "all 120ms ease-out" }}
        />
        <SvgTex x={q(rectRight - rw / 2)} y={q(rectBottom - rh / 2 + 8)} tex="\mu_0 I" color={C.ok} fontSize={15} width={52} anchor="middle" />
        <SvgTex x={q(rectRight - rw / 2)} y={q(rectBottom + 22)} tex="2\pi r" color={C.warn} fontSize={12.5} width={44} anchor="middle" />
        <SvgTex x={q(rectRight - rw - 10)} y={q(rectBottom - rh / 2 + 6)} tex="B" color={C.minus} fontSize={12.5} width={26} anchor="end" />
      </svg>

      <dl className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule min-[440px]:grid-cols-3">
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Поле на пътеката</dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-minus">
            <RichText text={String.raw`$B=${fieldMicro.toFixed(3)}\,\mu\mathrm{T}$`} />
          </dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Дължина на пътеката</dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-plus">
            <RichText text={String.raw`$2\pi r=${pathLength.toFixed(2)}\,\mathrm{m}$`} />
          </dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Произведението</dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-ok">
            <RichText text={String.raw`$B\cdot2\pi r=${product.toFixed(3)}\,\mu\mathrm{T{\cdot}m}=\mu_0I$`} />
          </dd>
        </div>
      </dl>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-[13px] font-medium text-muted">
          <span className="flex justify-between"><span>Радиус на пътеката <RichText text="$r$" /></span><strong className="text-minus"><RichText text={`$${radius.toFixed(2)}\\,\\mathrm{m}$`} /></strong></span>
          <input className="w-full accent-(--color-minus)" type="range" min="0.5" max="2" step="0.05" value={radius} onChange={(e) => setRadius(+e.target.value)} />
        </label>
        <label className="text-[13px] font-medium text-muted">
          <span className="flex justify-between"><span>Ток <RichText text="$I$" /></span><strong className="text-minus"><RichText text={`$${current.toFixed(1)}\\,\\mathrm{A}$`} /></strong></span>
          <input className="w-full accent-(--color-minus)" type="range" min="0.5" max="5" step="0.1" value={current} onChange={(e) => setCurrent(+e.target.value)} />
        </label>
      </div>

      <p className="mt-3 text-[13.5px] text-muted">
        <RichText text="Местете $r$: стрелките на полето отслабват като $1/r$, но пътеката се удължава като $r$. Двете точно се съкращават — правоъгълникът вдясно променя формата си, но не и площта си. Тя зависи само от тока: сменете $I$ и площта го следва." />
      </p>
    </div>
  );
}
