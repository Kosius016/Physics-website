"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import { Arrow, BTN_SEC, C, CurrentSymbol, PANEL_CLASS, STAGE_BG, STAGE_CLASS } from "./svg";

type LoopKind = "circle" | "square" | "offset" | "outside";

const LOOPS: { id: LoopKind; label: string; useful: string }[] = [
  { id: "circle", label: "Центриран кръг", useful: "Идеален: $B$ е постоянно и успоредно на $d\\vec l$" },
  { id: "square", label: "Квадрат", useful: "Законът е верен, но $B$ не е постоянно по страните" },
  { id: "offset", label: "Изместен кръг", useful: "Обхваща тока, но симетрията е загубена" },
  { id: "outside", label: "Без ток вътре", useful: "Няма обхванат ток и циркулацията е нулева" },
];

export default function AmpereLoopExplorer() {
  const [loop, setLoop] = useState<LoopKind>("circle");
  const [current, setCurrent] = useState(2);
  const [out, setOut] = useState(true);
  const active = LOOPS.find((item) => item.id === loop)!;
  const encloses = loop !== "outside";
  const circulation = encloses ? 1.256637 * current : 0; // μT·m
  const direction = out ? 1 : -1;
  const q = (v: number) => Math.round(v * 1000) / 1000;

  const fieldArrows = [58, 95, 138].flatMap((radius) =>
    Array.from({ length: radius === 138 ? 16 : 12 }, (_, i) => {
      const count = radius === 138 ? 16 : 12;
      const a = (2 * Math.PI * i) / count;
      const x = 250 + radius * Math.cos(a);
      const y = 200 + radius * Math.sin(a);
      // Ток ⊙ (навън) → полето обикаля обратно на часовниковата стрелка
      const tx = Math.sin(a) * direction;
      const ty = -Math.cos(a) * direction;
      return { x1: q(x - tx * 8), y1: q(y - ty * 8), x2: q(x + tx * 8), y2: q(y + ty * 8) };
    }),
  );

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-2">
        {LOOPS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={loop === item.id ? BTN_SEC + " bg-hl" : BTN_SEC}
            onClick={() => setLoop(item.id)}
          >
            {item.label}
          </button>
        ))}
        <button type="button" className={BTN_SEC} onClick={() => setOut((v) => !v)}>
          Обърнете тока ⇅
        </button>
      </div>

      <svg viewBox="0 0 640 400" className={STAGE_CLASS + " select-none"} role="img" aria-label="Магнитно поле около проводник и различни амперови контури">
        <rect width="640" height="400" fill={STAGE_BG} />
        <g opacity=".75">
          {Array.from({ length: 27 }, (_, i) => <line key={`v${i}`} x1={i * 25} y1="0" x2={i * 25} y2="400" stroke={C.wire} opacity={0.055} />)}
          {Array.from({ length: 17 }, (_, i) => <line key={`h${i}`} x1="0" y1={i * 25} x2="640" y2={i * 25} stroke={C.wire} opacity={0.055} />)}
        </g>

        <g opacity={0.76}>{fieldArrows.map((a, i) => <Arrow key={i} {...a} color={C.wire} width={1.35} />)}</g>

        {loop === "circle" && <circle cx="250" cy="200" r="112" fill="none" stroke={C.warn} strokeWidth="3" strokeDasharray="8 5" />}
        {loop === "square" && <rect x="138" y="88" width="224" height="224" rx="4" fill="none" stroke={C.warn} strokeWidth="3" strokeDasharray="8 5" />}
        {loop === "offset" && <circle cx="302" cy="200" r="112" fill="none" stroke={C.warn} strokeWidth="3" strokeDasharray="8 5" />}
        {loop === "outside" && <circle cx="455" cy="200" r="82" fill="none" stroke={C.warn} strokeWidth="3" strokeDasharray="8 5" />}

        <CurrentSymbol x={250} y={200} out={out} r={18} color={out ? C.plus : C.minus} texLabel="I" />
        <text x="24" y="34" fill={C.mut} fontSize="13" fontWeight="700">МАГНИТНОТО ПОЛЕ ОБИКАЛЯ ОКОЛО ТОКА</text>
      </svg>

      <p className="mt-2 text-[13px] text-muted"><RichText text={active.useful} /></p>

      <dl className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule sm:grid-cols-2">
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Обхванат ток</dt>
          <dd className={`mt-0.5 text-[15px] font-bold tabular-nums ${encloses ? "text-ok" : "text-plus"}`}>
            <RichText text={String.raw`$I_{\mathrm{enc}}=${encloses ? current.toFixed(1) : "0"}\,\mathrm{A}$`} />
          </dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">
            <RichText text={String.raw`$\oint \vec B\!\cdot d\vec l=\mu_0 I_{\mathrm{enc}}$`} />
          </dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-minus">
            <RichText text={String.raw`$${circulation.toFixed(3)}\,\mu\mathrm{T}\!\cdot\!\mathrm{m}$`} />
          </dd>
        </div>
      </dl>

      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <label className="text-[13.5px] font-medium text-muted">
          <span className="mb-1 flex justify-between"><span>Ток <RichText text="$I$" /></span><strong className="text-minus"><RichText text={`$${current.toFixed(1)}\\,\\mathrm{A}$`} /></strong></span>
          <input className="w-full accent-(--color-minus)" type="range" min="0.5" max="5" step="0.1" value={current} onChange={(e) => setCurrent(+e.target.value)} />
        </label>
        <div className="rounded-lg border border-rule bg-hl px-3 py-2 text-[13px] text-ink">
          Законът е верен за всеки контур; <strong>симетрията</strong> решава дали е полезен за смятане.
        </div>
      </div>
    </div>
  );
}
