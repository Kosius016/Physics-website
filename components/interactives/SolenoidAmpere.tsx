"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import { Arrow, BTN_SEC, C, CurrentSymbol, PANEL_CLASS, STAGE_BG, STAGE_CLASS } from "./svg";

const MU0 = 4 * Math.PI * 1e-7;

/**
 * Надлъжен разрез на дълъг соленоид — фигурата, върху която законът на Ампер
 * дава B = μ₀nI. Горният ред сечения носи ток към зрителя (⊙), долният — от
 * зрителя (⊗); между тях полето е почти равномерно, а отвън — пренебрежимо.
 * Амперовият правоъгълник a–b–c–d пресича горния ред: само страната ab
 * (вътре, по полето) допринася, и обхванатите навивки дават I_обхв = n·ℓ·I.
 */
export default function SolenoidAmpere() {
  const [turns, setTurns] = useState(600);
  const [length, setLength] = useState(0.6);
  const [current, setCurrent] = useState(1.5);
  const [direction, setDirection] = useState<1 | -1>(1);
  const density = turns / length;
  const fieldMilliTesla = MU0 * density * current * 1000;

  // Гъстотата n определя колко сечения се виждат върху фиксиран отрязък
  const visibleTurns = Math.round(8 + ((density - 200) / 4800) * 20);
  const topY = 112;
  const botY = 248;
  const wires = Array.from({ length: visibleTurns }, (_, i) => 100 + (440 * i) / Math.max(visibleTurns - 1, 1));

  // Амперовият правоъгълник: ab вътре (по оста), cd отвън, bc/da напречни
  const rx1 = 170;
  const rx2 = 470;
  const ryIn = 180;
  const ryOut = 58;
  const enclosed = wires.filter((x) => x > rx1 && x < rx2);

  const fieldWidth = 1.7 + Math.min(1.5, fieldMilliTesla / 6);

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[14px] text-muted">Гъстотата на сеченията следва <RichText text="$n=N/L$" /> — полето вътре реагира веднага.</p>
        <button type="button" className={BTN_SEC} onClick={() => setDirection((d) => (d === 1 ? -1 : 1))}>Обърнете тока ⇅</button>
      </div>

      <svg viewBox="0 0 640 360" className={STAGE_CLASS + " select-none"} role="img" aria-label="Надлъжен разрез на соленоид с амперов правоъгълник">
        <rect width="640" height="360" fill={STAGE_BG} />
        {Array.from({ length: 27 }, (_, i) => <line key={`v${i}`} x1={i * 25} y1="0" x2={i * 25} y2="360" stroke={C.faint} opacity="0.1" />)}
        {Array.from({ length: 15 }, (_, i) => <line key={`h${i}`} x1="0" y1={i * 25} x2="640" y2={i * 25} stroke={C.faint} opacity="0.1" />)}

        {/* Вътрешността на соленоида */}
        <rect x="92" y={topY + 12} width="456" height={botY - topY - 24} fill={C.minus} fillOpacity="0.06" />

        {/* Полето вътре: равномерно, по оста */}
        {[138, 159, 180, 201, 222].map((y) => (
          <Arrow key={y} x1={direction === 1 ? 130 : 510} y1={y} x2={direction === 1 ? 510 : 130} y2={y} color={C.minus} width={fieldWidth} />
        ))}
        <SvgTex x={direction === 1 ? 520 : 96} y={186} tex="\vec B" color={C.minus} fontSize={14} width={30} />

        {/* Полето отвън: слабо и обратно — приносът му е пренебрежим */}
        <g opacity="0.4">
          <Arrow x1={direction === 1 ? 400 : 240} y1={30} x2={direction === 1 ? 240 : 400} y2={30} color={C.wire} width={1.3} dashed />
          <Arrow x1={direction === 1 ? 400 : 240} y1={330} x2={direction === 1 ? 240 : 400} y2={330} color={C.wire} width={1.3} dashed />
        </g>
        <text x="612" y="34" textAnchor="end" fill={C.mut} fontSize="12">B ≈ 0 далеч отвън</text>

        {/* Сеченията на навивките: ⊙ насреща, ⊗ навътре */}
        {wires.map((x, i) => (
          <g key={i}>
            {enclosed.includes(x) && <circle cx={x} cy={topY} r="11" fill="none" stroke={C.ok} strokeWidth="1.6" opacity="0.85" />}
            <CurrentSymbol x={x} y={topY} out={direction === 1} r={7} color={C.warn} />
            <CurrentSymbol x={x} y={botY} out={direction !== 1} r={7} color={C.warn} />
          </g>
        ))}

        {/* Амперовият правоъгълник a → b → c → d */}
        <rect x={rx1} y={ryOut} width={rx2 - rx1} height={ryIn - ryOut} rx="4" fill="none" stroke={C.ok} strokeWidth="2.3" strokeDasharray="8 5" />
        <SvgTex x={rx1 - 8} y={ryIn + 18} tex="a" color={C.ok} fontSize={13} width={20} anchor="end" />
        <SvgTex x={rx2 + 8} y={ryIn + 18} tex="b" color={C.ok} fontSize={13} width={20} />
        <SvgTex x={rx2 + 8} y={ryOut - 4} tex="c" color={C.ok} fontSize={13} width={20} />
        <SvgTex x={rx1 - 8} y={ryOut - 4} tex="d" color={C.ok} fontSize={13} width={20} anchor="end" />

        {/* Приносът на всяка страна */}
        <SvgTex x={(rx1 + rx2) / 2} y={ryIn + 22} tex="B\,\ell" color={C.ok} fontSize={14} width={44} anchor="middle" />
        <SvgTex x={(rx1 + rx2) / 2} y={ryOut - 8} tex="\approx 0" color={C.mut} fontSize={12} width={40} anchor="middle" />
        <text x={rx2 + 14} y={(ryIn + ryOut) / 2 + 4} fill={C.mut} fontSize="11.5">⊥ B → 0</text>
        <text x={rx1 - 14} y={(ryIn + ryOut) / 2 + 4} textAnchor="end" fill={C.mut} fontSize="11.5">⊥ B → 0</text>

        {/* Дължината ℓ на работната страна */}
        <line x1={rx1} y1={ryIn + 34} x2={rx2} y2={ryIn + 34} stroke={C.mut} strokeWidth="1.1" />
        <line x1={rx1} y1={ryIn + 28} x2={rx1} y2={ryIn + 40} stroke={C.mut} strokeWidth="1.1" />
        <line x1={rx2} y1={ryIn + 28} x2={rx2} y2={ryIn + 40} stroke={C.mut} strokeWidth="1.1" />
        <SvgTex x={(rx1 + rx2) / 2 + 44} y={ryIn + 40} tex="\ell" color={C.mut} fontSize={12.5} width={20} anchor="middle" />

        <text x="24" y="34" fill={C.mut} fontSize="13" fontWeight="700">ДЪЛЪГ СОЛЕНОИД · НАДЛЪЖЕН РАЗРЕЗ</text>
        <text x="24" y="346" fill={C.mut} fontSize="12">оградените навивки са обхванатият ток: I·(n·ℓ)</text>
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

      <p className="mt-3 text-[13.5px] text-muted">
        <RichText text="Само страната $ab$ работи: тя е вътре и върви по $\vec B$. Страните $bc$ и $da$ са перпендикулярни на полето, а $cd$ е далеч отвън, където $B\approx0$. Затова $\oint\vec B\cdot d\vec l = B\ell = \mu_0(n\ell)I$ и $\ell$ се съкращава." />
      </p>
    </div>
  );
}
