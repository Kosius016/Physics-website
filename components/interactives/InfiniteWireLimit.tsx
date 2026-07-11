"use client";

import { useEffect, useRef, useState } from "react";
import Formula from "@/components/Formula";
import RichText from "@/components/RichText";
import { Arrow, AngleArc, BTN_PRI, BTN_SEC, C, PANEL_CLASS, STAGE_BG, STAGE_CLASS } from "./svg";

/**
 * Граничният преход краен → безкраен проводник, показан като ПРЕДЕЛ:
 *  — "камерата" се отдалечава, така че краищата остават видими винаги,
 *    а перпендикулярното разстояние a става нищожно спрямо дължината L;
 *  — двата ъгъла се виждат едновременно и плавно клонят към 90°
 *    (или, в означението α — към 0°: допълнителни ъгли);
 *  — графиката B(L)/B∞ като функция от L/a показва как крайният проводник
 *    се доближава асимптотично до резултата за безкраен.
 * Формулата се извежда чак накрая, стъпка по стъпка.
 */

const W = 640;
const H = 400;
const WIRE_X = 250;
const CY = H / 2;
const MAX_HALF_PX = 160; // проводникът винаги се събира във височината
const MAX_PXU = 140; // максимален мащаб (px за едно разстояние a)
const X_MIN = 0.5; // L/a минимум
const X_MAX = 200; // L/a максимум

// Графиката
const GW = 640;
const GH = 230;
const GPL = 62;
const GPR = 18;
const GPT = 26;
const GPB = 40;
const GX_MAX = 40; // ос L/a

/** B(L)/B∞ за симетрично разположена точка: sinθ при половин дължина x/2·a. */
function ratio(x: number) {
  const h = x / 2;
  return h / Math.hypot(h, 1);
}

const STEPS: { text: string; latex: string }[] = [
  {
    text: "Изходната точка е формулата за **краен** проводник от §4 — единственото, което се променя при удължаване, е скобата с ъглите:",
    latex: String.raw`B(L) = \frac{\mu_0 I}{4\pi a}\left(\sin\theta_1 + \sin\theta_2\right)`,
  },
  {
    text: "При $L \\to \\infty$ краищата се отдалечават неограничено и двата ъгъла клонят към прав ъгъл — сцената и графиката показват точно това приближаване:",
    latex: String.raw`\theta_1 \to 90^\circ,\quad \theta_2 \to 90^\circ \;\;\Longrightarrow\;\; \sin\theta_1 + \sin\theta_2 \to 2`,
  },
  {
    text: "Границата на скобата е 2 — стойността, към която тя само се приближава при всяко крайно L. Заместването дава формулата за безкраен проводник:",
    latex: String.raw`B_\infty = \lim_{L\to\infty} B(L) = \frac{\mu_0 I}{4\pi a}\cdot 2 = \frac{\mu_0 I}{2\pi a}`,
  },
];

export default function InfiniteWireLimit() {
  const [t, setT] = useState(0.2); // логаритмичен параметър на L/a
  const [mode, setMode] = useState<"theta" | "alpha">("theta");
  const [animating, setAnimating] = useState(false);
  const [shownSteps, setShownSteps] = useState(0);
  const animRef = useRef<number | null>(null);

  const x = X_MIN * Math.pow(X_MAX / X_MIN, t); // L/a

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const animateToInfinity = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setAnimating(true);
    const t0 = performance.now();
    const start = t;
    const dur = 5000;
    const frame = (now: number) => {
      const k = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - k, 2);
      setT(start + (1 - start) * eased);
      if (k < 1) {
        animRef.current = requestAnimationFrame(frame);
      } else {
        animRef.current = null;
        setAnimating(false);
      }
    };
    animRef.current = requestAnimationFrame(frame);
  };

  // "Камерата": мащаб px/a, така че проводникът ВИНАГИ да се събира
  const halfUnits = x / 2;
  const pxu = Math.max(2, Math.min(MAX_PXU, MAX_HALF_PX / halfUnits));
  const halfPx = halfUnits * pxu;
  const aPx = pxu;
  const zoomedOut = pxu < MAX_PXU - 0.5;

  const p = { x: WIRE_X + aPx, y: CY };
  const topY = CY - halfPx;
  const botY = CY + halfPx;

  const sin1 = ratio(x);
  const th = (Math.asin(sin1) * 180) / Math.PI;
  const al = 90 - th;
  const sinSum = 2 * sin1;
  const isTheta = mode === "theta";

  const dirR1 = Math.atan2(topY - p.y, WIRE_X - p.x);
  const dirR2 = Math.atan2(botY - p.y, WIRE_X - p.x);

  const readout: { label: string; value: string }[] = [
    { label: "L / a", value: x >= X_MAX * 0.99 ? "200 (→ ∞)" : x.toFixed(1) },
    isTheta
      ? { label: "θ₁ = θ₂ → 90°", value: th.toFixed(2) + "°" }
      : { label: "α₁ = α₂ → 0°", value: al.toFixed(2) + "°" },
    isTheta
      ? { label: "sin θ₁ + sin θ₂ → 2", value: sinSum.toFixed(4) }
      : { label: "cos α₁ + cos α₂ → 2", value: sinSum.toFixed(4) },
    { label: "B(L) / B∞", value: (100 * sin1).toFixed(2) + " %" },
  ];

  // Графиката: крива + маркер
  const gx = (v: number) => GPL + ((GW - GPL - GPR) * v) / GX_MAX;
  const gy = (v: number) => GH - GPB - (GH - GPT - GPB) * v;
  const curve = Array.from({ length: 101 }, (_, i) => {
    const vx = (GX_MAX * i) / 100;
    return `${i === 0 ? "M" : "L"} ${gx(vx).toFixed(1)} ${gy(ratio(vx)).toFixed(1)}`;
  }).join(" ");
  const mx = Math.min(x, GX_MAX);

  return (
    <div className={PANEL_CLASS}>
      {/* Контроли */}
      <div className="mb-3 flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="min-w-[200px] flex-1">
          <label
            htmlFor="infwire-length"
            className="mb-1 flex items-baseline justify-between text-[13.5px] font-medium text-muted"
          >
            <span>Дължина спрямо разстоянието: L / a</span>
            <span className="font-bold tabular-nums text-minus">{x.toFixed(1)}</span>
          </label>
          <input
            id="infwire-length"
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={t}
            disabled={animating}
            onChange={(e) => setT(parseFloat(e.target.value))}
            className="w-full accent-(--color-minus)"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            className={
              isTheta
                ? "cursor-pointer rounded-full border-[1.5px] border-ink bg-ink px-3.5 py-1.5 text-[13px] font-bold text-white shadow-hard-sm"
                : "cursor-pointer rounded-full border-[1.5px] border-ink bg-surface px-3.5 py-1.5 text-[13px] font-semibold text-ink transition-colors hover:bg-hl"
            }
            onClick={() => setMode("theta")}
          >
            θ
          </button>
          <button
            className={
              !isTheta
                ? "cursor-pointer rounded-full border-[1.5px] border-ink bg-ink px-3.5 py-1.5 text-[13px] font-bold text-white shadow-hard-sm"
                : "cursor-pointer rounded-full border-[1.5px] border-ink bg-surface px-3.5 py-1.5 text-[13px] font-semibold text-ink transition-colors hover:bg-hl"
            }
            onClick={() => setMode("alpha")}
          >
            α
          </button>
          <button className={BTN_PRI} onClick={animateToInfinity} disabled={animating}>
            {animating ? "Расте…" : "Към безкрайност ▶"}
          </button>
        </div>
      </div>

      {/* Сцената: краищата винаги видими, изгледът се отдалечава */}
      <svg viewBox={`0 0 ${W} ${H}`} className={STAGE_CLASS + " select-none"}>
        <rect width={W} height={H} fill={STAGE_BG} />

        <line x1={WIRE_X} y1={topY} x2={WIRE_X} y2={botY} stroke={C.wire} strokeWidth={Math.max(2, Math.min(4, pxu / 12))} />
        <Arrow x1={WIRE_X} y1={CY + 16} x2={WIRE_X} y2={CY - 16} color={C.warn} width={2.5} />
        <circle cx={WIRE_X} cy={topY} r={5} fill={C.wire} />
        <circle cx={WIRE_X} cy={botY} r={5} fill={C.wire} />
        <text x={WIRE_X - 28} y={topY + 5} fill={C.mut} fontSize={13}>1</text>
        <text x={WIRE_X - 28} y={botY + 5} fill={C.mut} fontSize={13}>2</text>
        <text x={WIRE_X - 30} y={CY - Math.min(halfPx, MAX_HALF_PX) / 2} fill={C.mut} fontSize={12.5} textAnchor="end">
          L = {x.toFixed(0)}·a
        </text>

        {/* Перпендикулярното разстояние a — свива се визуално при отдалечаване */}
        <line x1={WIRE_X} y1={p.y} x2={p.x} y2={p.y} stroke={C.mut} strokeWidth={1.6} strokeDasharray="5 4" />
        <text x={p.x + 12} y={p.y + 22} fill={C.mut} fontSize={13} fontWeight={600}>
          a
        </text>

        {/* r-векторите и двата ъгъла — винаги и двата видими */}
        <Arrow x1={p.x} y1={p.y} x2={WIRE_X} y2={topY} color={C.minus} width={2} label="r₁" labelDx={-24} labelDy={-2} />
        <Arrow x1={p.x} y1={p.y} x2={WIRE_X} y2={botY} color={C.minus} width={2} label="r₂" labelDx={-24} labelDy={12} />
        {isTheta ? (
          <g>
            <AngleArc cx={p.x} cy={p.y} a1={Math.PI} a2={dirR1} r={46} color={C.plus} label={`θ₁=${th.toFixed(1)}°`} />
            <AngleArc cx={p.x} cy={p.y} a1={Math.PI} a2={dirR2} r={64} color={C.plus} label={`θ₂=${th.toFixed(1)}°`} />
          </g>
        ) : (
          <g>
            <line x1={p.x} y1={Math.max(topY, 25)} x2={p.x} y2={Math.min(botY, H - 25)} stroke={C.faint} strokeWidth={1.3} strokeDasharray="3 5" />
            <AngleArc cx={p.x} cy={p.y} a1={-Math.PI / 2} a2={dirR1} r={46} color={C.ok} label={`α₁=${al.toFixed(1)}°`} />
            <AngleArc cx={p.x} cy={p.y} a1={Math.PI / 2} a2={dirR2} r={64} color={C.ok} label={`α₂=${al.toFixed(1)}°`} />
          </g>
        )}

        <circle cx={p.x} cy={p.y} r={6} fill={C.wire} />
        <text x={p.x + 12} y={p.y - 8} fill={C.wire} fontSize={14} fontWeight={700}>
          P
        </text>

        {/* Числото, което се наблюдава */}
        <text x={W - 24} y={54} fill={sinSum > 1.998 ? C.ok : C.warn} fontSize={24} fontWeight={700} textAnchor="end" fontFamily="Georgia, serif">
          {isTheta ? "sinθ₁+sinθ₂" : "cosα₁+cosα₂"} = {sinSum.toFixed(4)}
        </text>
        {sinSum > 1.998 && (
          <text x={W - 24} y={82} fill={C.ok} fontSize={14.5} fontWeight={700} textAnchor="end" className="animate-rise">
            практически на границата 2
          </text>
        )}
        {zoomedOut && (
          <text x={16} y={H - 16} fill={C.faint} fontSize={12.5}>
            изгледът се отдалечава: краищата остават видими, a става нищожно спрямо L
          </text>
        )}
      </svg>

      {/* Живи стойности */}
      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule sm:grid-cols-4">
        {readout.map((r) => (
          <div key={r.label} className="bg-surface px-3 py-2.5">
            <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">{r.label}</dt>
            <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-minus">{r.value}</dd>
          </div>
        ))}
      </dl>

      {/* Графиката на предела */}
      <p className="mt-5 mb-2 text-[14px] text-muted">
        Отношението <strong className="text-ink">B(L)/B∞</strong> като функция от{" "}
        <strong className="text-ink">L/a</strong> — кривата се приближава към 1, без да го достига при
        крайно L. Това е смисълът на думата <strong className="text-ink">граница</strong>:
      </p>
      <svg viewBox={`0 0 ${GW} ${GH}`} className={STAGE_CLASS + " select-none"}>
        <rect width={GW} height={GH} fill={STAGE_BG} />
        {/* мрежа и оси */}
        {[0, 0.25, 0.5, 0.75].map((v) => (
          <line key={v} x1={GPL} y1={gy(v)} x2={GW - GPR} y2={gy(v)} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
        ))}
        {[10, 20, 30].map((v) => (
          <line key={v} x1={gx(v)} y1={GPT} x2={gx(v)} y2={GH - GPB} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
        ))}
        <line x1={GPL} y1={GH - GPB} x2={GW - GPR} y2={GH - GPB} stroke={C.mut} strokeWidth={1.5} />
        <line x1={GPL} y1={GPT} x2={GPL} y2={GH - GPB} stroke={C.mut} strokeWidth={1.5} />
        {[0, 10, 20, 30, 40].map((v) => (
          <text key={v} x={gx(v)} y={GH - GPB + 18} fill={C.mut} fontSize={11.5} textAnchor="middle">
            {v}
          </text>
        ))}
        {[0, 0.5, 1].map((v) => (
          <text key={v} x={GPL - 10} y={gy(v) + 4} fill={C.mut} fontSize={11.5} textAnchor="end">
            {v.toFixed(1)}
          </text>
        ))}
        <text x={GW - GPR} y={GH - 8} fill={C.mut} fontSize={12.5} textAnchor="end">
          L / a
        </text>
        <text x={16} y={GPT - 8} fill={C.mut} fontSize={12.5}>
          B(L)/B∞
        </text>
        {/* асимптотата — границата */}
        <line x1={GPL} y1={gy(1)} x2={GW - GPR} y2={gy(1)} stroke={C.ok} strokeWidth={1.5} strokeDasharray="7 5" />
        <text x={GW - GPR - 6} y={gy(1) - 7} fill={C.ok} fontSize={12} fontWeight={700} textAnchor="end">
          B∞ = μ₀I/2πa (граница)
        </text>
        {/* кривата */}
        <path d={curve} fill="none" stroke={C.minus} strokeWidth={2.5} />
        {/* маркерът на текущото L/a */}
        <line x1={gx(mx)} y1={GH - GPB} x2={gx(mx)} y2={gy(ratio(mx))} stroke={C.faint} strokeWidth={1.3} strokeDasharray="3 4" />
        <circle cx={gx(mx)} cy={gy(ratio(mx))} r={6} fill={C.warn} stroke={STAGE_BG} strokeWidth={2} />
        <text
          x={Math.min(gx(mx) + 10, GW - 120)}
          y={gy(ratio(mx)) + (ratio(mx) > 0.9 ? 22 : -10)}
          fill={C.warn}
          fontSize={13}
          fontWeight={700}
        >
          {(100 * sin1).toFixed(1)} %
        </text>
      </svg>

      {/* Извеждане — чак след наблюдението */}
      <div className="mt-5 space-y-4">
        {STEPS.slice(0, shownSteps).map((s, i) => (
          <div key={i} className="space-y-2 animate-rise">
            <p className="text-[15.5px] text-ink/90">
              <span className="mr-2 text-[12px] font-bold uppercase tracking-wide text-muted">
                Стъпка {i + 1}
              </span>
              <RichText text={s.text} />
            </p>
            <Formula latex={s.latex} />
          </div>
        ))}
        {shownSteps < STEPS.length && (
          <button className={BTN_SEC} onClick={() => setShownSteps((s) => s + 1)}>
            {shownSteps === 0 ? "Извеждане на формулата стъпка по стъпка" : "Следваща стъпка →"}
          </button>
        )}
        {shownSteps === STEPS.length && (
          <div className="rounded-r-lg border-l-4 border-plus bg-hl px-4 py-2.5 text-[15px] leading-relaxed animate-rise">
            <strong className="text-ink">Изводът:</strong> „безкраен проводник“ не е отделен физичен
            обект, а <strong className="text-ink">граница</strong> — стойността, към която полето на
            краен проводник се приближава, когато дължината му стане огромна спрямо разстоянието{" "}
            <RichText text="$a$" />. Графиката показва и практическата страна: още при{" "}
            <RichText text="$L \approx 20a$" /> полето е над 99,5 % от граничното — „безкраен“ значи
            просто „много по-дълъг от a“.
          </div>
        )}
      </div>
    </div>
  );
}
