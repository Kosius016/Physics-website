"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import { AngleArc, Arrow, BTN_SEC, C, CurrentSymbol, PANEL_CLASS, STAGE_BG, STAGE_CLASS } from "./svg";

export default function CrossProductGeometry() {
  const [a, setA] = useState(3.2);
  const [b, setB] = useState(2.5);
  const [theta, setTheta] = useState(58);
  const [swapped, setSwapped] = useState(false);

  const q = (value: number) => Math.round(value * 1_000_000) / 1_000_000;
  const rad = (theta * Math.PI) / 180;
  const scale = 57;
  const O: [number, number] = [90, 274];
  const A: [number, number] = [q(O[0] + a * scale), O[1]];
  const B: [number, number] = [q(O[0] + b * scale * Math.cos(rad)), q(O[1] - b * scale * Math.sin(rad))];
  const D: [number, number] = [q(A[0] + B[0] - O[0]), q(A[1] + B[1] - O[1])];
  const magnitude = a * b * Math.sin(rad);
  const nearlyZero = magnitude < 0.04;

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Геометрична лаборатория</p>
          <p className="mt-1 text-[14.5px] text-ink/85">Променете страните и ъгъла; после разменете реда.</p>
        </div>
        <button className={BTN_SEC} onClick={() => setSwapped((v) => !v)}>
          {swapped ? "Ред: b × a" : "Ред: a × b"} ↔
        </button>
      </div>

      <svg viewBox="0 0 620 350" className={STAGE_CLASS} role="img" aria-label="Успоредник върху два вектора и посока на векторното произведение">
        <rect width="620" height="350" fill={STAGE_BG} />
        <defs>
          <pattern id="cross-grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(242,239,245,0.07)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="620" height="350" fill="url(#cross-grid)" />

        <polygon
          points={`${O[0]},${O[1]} ${A[0]},${A[1]} ${D[0]},${D[1]} ${B[0]},${B[1]}`}
          fill="rgba(98,215,160,0.18)"
          stroke={C.ok}
          strokeWidth="1.5"
        />
        <line x1={B[0]} y1={B[1]} x2={D[0]} y2={D[1]} stroke={C.faint} strokeWidth="1.5" strokeDasharray="6 5" />
        <line x1={A[0]} y1={A[1]} x2={D[0]} y2={D[1]} stroke={C.faint} strokeWidth="1.5" strokeDasharray="6 5" />
        <line x1={B[0]} y1={B[1]} x2={B[0]} y2={O[1]} stroke={C.warn} strokeWidth="1.5" strokeDasharray="5 5" />

        <Arrow x1={O[0]} y1={O[1]} x2={A[0]} y2={A[1]} color={C.plus} width={3.2} texLabel={String.raw`\vec a`} texLabelDy={18} texLabelWidth={46} />
        <Arrow x1={O[0]} y1={O[1]} x2={B[0]} y2={B[1]} color={C.minus} width={3.2} texLabel={String.raw`\vec b`} texLabelDx={-8} texLabelDy={-4} texLabelWidth={46} />
        <AngleArc cx={O[0]} cy={O[1]} a1={-rad} a2={0} r={50} color={C.warn} texLabel={String.raw`\theta`} />
        {/* Височината се крие при смачкан успоредник; иначе етикетът ѝ се блъска в S. */}
        <g opacity={nearlyZero ? 0 : 1} className="transition-opacity">
          <SvgTex x={B[0] + 10} y={(B[1] + O[1]) / 2} tex={String.raw`b\sin\theta`} color={C.warn} fontSize={13} width={92} />
        </g>
        <SvgTex
          x={(O[0] + D[0]) / 2}
          y={(O[1] + D[1]) / 2 + 30}
          tex={String.raw`S=ab\sin\theta`}
          color={C.ok}
          fontSize={15}
          width={130}
          anchor="middle"
        />

        <g opacity={nearlyZero ? 0.35 : 1}>
          <CurrentSymbol x={520} y={245} out={!swapped} r={24} color={C.ok} />
          <SvgTex
            x={520}
            y={292}
            tex={swapped ? String.raw`\vec b\times\vec a` : String.raw`\vec a\times\vec b`}
            color={C.ok}
            fontSize={15}
            width={126}
            anchor="middle"
          />
          <text x="520" y="322" fill={C.mut} fontSize="12.5" textAnchor="middle">
            {nearlyZero ? "нулев вектор" : swapped ? "навътре в екрана" : "навън от екрана"}
          </text>
        </g>
      </svg>

      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule sm:grid-cols-4">
        {[
          ["|a|", a.toFixed(1)],
          ["|b|", b.toFixed(1)],
          ["ъгъл θ", `${theta}°`],
          ["|a × b|", magnitude.toFixed(2)],
        ].map(([label, value]) => (
          <div key={label} className="bg-surface px-3 py-2.5">
            <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">{label}</dt>
            <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-minus">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <label className="text-[13px] font-semibold text-ink">
          Дължина <RichText text={String.raw`$|\vec a|$`} />
          <input className="mt-2 w-full accent-[#e8563f]" type="range" min="1" max="4" step="0.1" value={a} onChange={(e) => setA(Number(e.target.value))} />
        </label>
        <label className="text-[13px] font-semibold text-ink">
          Дължина <RichText text={String.raw`$|\vec b|$`} />
          <input className="mt-2 w-full accent-[#347fb8]" type="range" min="1" max="4" step="0.1" value={b} onChange={(e) => setB(Number(e.target.value))} />
        </label>
        <label className="text-[13px] font-semibold text-ink">
          Ъгъл <RichText text={String.raw`$\theta$`} />
          <input className="mt-2 w-full accent-[#347fb8]" type="range" min="0" max="180" step="1" value={theta} onChange={(e) => setTheta(Number(e.target.value))} />
        </label>
      </div>

      <p className="mt-4 rounded-r-lg border-l-4 border-minus bg-hl px-4 py-3 text-[15px] leading-relaxed text-ink/90">
        Размяната на реда не променя успоредника и площта му, но обръща нормалата: <RichText text={String.raw`$\vec b\times\vec a=-(\vec a\times\vec b)$`} />.
      </p>
    </div>
  );
}
