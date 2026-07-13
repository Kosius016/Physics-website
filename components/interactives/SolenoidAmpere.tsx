"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import { Arrow, BTN_SEC, C, PANEL_CLASS, STAGE_BG, STAGE_CLASS } from "./svg";

const MU0 = 4 * Math.PI * 1e-7;

export default function SolenoidAmpere() {
  const [turns, setTurns] = useState(600);
  const [length, setLength] = useState(0.6);
  const [current, setCurrent] = useState(1.5);
  const [direction, setDirection] = useState<1 | -1>(1);
  const density = turns / length;
  const fieldMilliTesla = MU0 * density * current * 1000;
  const visibleTurns = Math.round(10 + ((turns - 200) / 800) * 18);

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[14px] text-muted">Променяйте навивките, дължината и тока — полето реагира веднага.</p>
        <button type="button" className={BTN_SEC} onClick={() => setDirection((d) => (d === 1 ? -1 : 1))}>Обърнете тока ⇅</button>
      </div>

      <svg viewBox="0 0 640 360" className={STAGE_CLASS + " select-none"} role="img" aria-label="Соленоид с почти равномерно магнитно поле във вътрешността">
        <rect width="640" height="360" fill={STAGE_BG} />
        <g opacity=".7">
          {Array.from({ length: 27 }, (_, i) => <line key={`v${i}`} x1={i * 25} y1="0" x2={i * 25} y2="360" stroke={C.wire} opacity={0.05} />)}
          {Array.from({ length: 16 }, (_, i) => <line key={`h${i}`} x1="0" y1={i * 25} x2="640" y2={i * 25} stroke={C.wire} opacity={0.05} />)}
        </g>

        <rect x="92" y="102" width="456" height="156" rx="76" fill={C.minus} fillOpacity={0.065} stroke={C.minus} strokeOpacity={0.2} />
        {Array.from({ length: visibleTurns }, (_, i) => {
          const x = 108 + (424 * i) / Math.max(visibleTurns - 1, 1);
          return <ellipse key={i} cx={x} cy="180" rx="13" ry="82" fill="none" stroke={i % 2 ? C.plus : C.warn} strokeWidth="1.8" opacity=".82" />;
        })}

        {[-42, -21, 0, 21, 42].map((dy) => (
          <Arrow key={dy} x1={direction === 1 ? 132 : 508} y1={180 + dy} x2={direction === 1 ? 508 : 132} y2={180 + dy} color={C.minus} width={2.2} />
        ))}
        <path d="M 510 125 C 585 85, 585 275, 510 235" fill="none" stroke={C.wire} strokeOpacity={0.23} strokeWidth="1.5" strokeDasharray="7 6" />
        <path d="M 130 235 C 55 275, 55 85, 130 125" fill="none" stroke={C.wire} strokeOpacity={0.23} strokeWidth="1.5" strokeDasharray="7 6" />

        <rect x="165" y="150" width="310" height="60" rx="6" fill="none" stroke={C.ok} strokeWidth="2.3" strokeDasharray="8 5" />
        <text x="320" y="139" fill={C.ok} fontSize="13" fontWeight="700" textAnchor="middle">АМПЕРОВ КОНТУР: едната страна е вътре, другата — отвън</text>
        <text x="320" y="232" fill={C.mut} fontSize="12.5" textAnchor="middle">външният принос е пренебрежим при дълъг соленоид</text>
        <text x="24" y="34" fill={C.mut} fontSize="13" fontWeight="700">ДЪЛЪГ СОЛЕНОИД</text>
      </svg>

      <dl className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule min-[440px]:grid-cols-2 sm:grid-cols-4">
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Навивки</dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-minus">
            <RichText text={String.raw`$N=${turns}$`} />
          </dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">
            <RichText text={String.raw`$n=N/L$`} />
          </dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-minus">
            <RichText text={String.raw`$n=${density.toFixed(0)}\,\mathrm{m}^{-1}$`} />
          </dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Ток</dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-minus">
            <RichText text={String.raw`$I=${current.toFixed(1)}\,\mathrm{A}$`} />
          </dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">
            <RichText text={String.raw`$B\simeq\mu_0 nI$`} />
          </dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-ok">
            <RichText text={String.raw`$B=${fieldMilliTesla.toFixed(2)}\,\mathrm{mT}$`} />
          </dd>
        </div>
      </dl>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <label className="text-[13px] font-medium text-muted">
          <span className="flex justify-between"><span>Навивки <RichText text="$N$" /></span><strong className="text-minus"><RichText text={`$${turns}$`} /></strong></span>
          <input className="w-full accent-(--color-minus)" type="range" min="200" max="1000" step="20" value={turns} onChange={(e) => setTurns(+e.target.value)} />
        </label>
        <label className="text-[13px] font-medium text-muted">
          <span className="flex justify-between"><span>Дължина <RichText text="$L$" /></span><strong className="text-minus"><RichText text={`$${length.toFixed(2)}\\,\\mathrm{m}$`} /></strong></span>
          <input className="w-full accent-(--color-minus)" type="range" min="0.2" max="1" step="0.02" value={length} onChange={(e) => setLength(+e.target.value)} />
        </label>
        <label className="text-[13px] font-medium text-muted">
          <span className="flex justify-between"><span>Ток <RichText text="$I$" /></span><strong className="text-minus"><RichText text={`$${current.toFixed(1)}\\,\\mathrm{A}$`} /></strong></span>
          <input className="w-full accent-(--color-minus)" type="range" min="0.2" max="3" step="0.1" value={current} onChange={(e) => setCurrent(+e.target.value)} />
        </label>
      </div>
    </div>
  );
}
