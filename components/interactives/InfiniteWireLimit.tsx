"use client";

import { useEffect, useRef, useState } from "react";
import Formula from "@/components/Formula";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
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

function angleLabelPoint(cx: number, cy: number, a1: number, a2: number, r: number) {
  let d = a2 - a1;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  const mid = a1 + d / 2;
  return {
    x: Math.max(WIRE_X + 20, Math.min(W - 20, cx + (r + 14) * Math.cos(mid))),
    y: Math.max(18, Math.min(H - 18, cy + (r + 14) * Math.sin(mid))),
  };
}

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
  // Фиксирана „световна“ решетка през 5a. Тя се свива заедно с камерата:
  // в началото проводникът е по-къс от една клетка, а при L/a → 200
  // пресича десетки клетки. Така отдалечаването се усеща визуално.
  const worldGrid = Array.from({ length: 81 }, (_, i) => (i - 40) * 5);

  const p = { x: WIRE_X + aPx, y: CY };
  const topY = CY - halfPx;
  const botY = CY + halfPx;

  const sin1 = ratio(x);
  const th = (Math.asin(sin1) * 180) / Math.PI;
  const al = 90 - th;
  const sinSum = 2 * sin1;
  const isTheta = mode === "theta";
  // Когато проводникът практически е безкраен, геометричният маркер се
  // сгъстява около проводника. Между 65° и 75° го скриваме плавно, а
  // числената стойност остава винаги достъпна в readout лентата.
  const angleOpacity = Math.max(0, Math.min(1, (75 - th) / 10));

  const dirR1 = Math.atan2(topY - p.y, WIRE_X - p.x);
  const dirR2 = Math.atan2(botY - p.y, WIRE_X - p.x);

  // При отдалечаването a може да стане само няколко пиксела. Запазваме
  // четим маркер, но го преместваме надясно, така че дъгите да не пресичат проводника.
  const angleOuterR = Math.min(64, Math.max(30, aPx * 0.72));
  const angleInnerR = Math.min(46, Math.max(18, angleOuterR - 18));
  const angleCx = Math.max(p.x, WIRE_X + angleOuterR + 10);
  const angleShifted = angleCx > p.x + 0.5;
  const theta1Label = angleLabelPoint(angleCx, p.y, Math.PI, dirR1, angleInnerR);
  const theta2Label = angleLabelPoint(angleCx, p.y, Math.PI, dirR2, angleOuterR);
  const alpha1Label = angleLabelPoint(angleCx, p.y, -Math.PI / 2, dirR1, angleInnerR);
  const alpha2Label = angleLabelPoint(angleCx, p.y, Math.PI / 2, dirR2, angleOuterR);

  const readout: { label: string; value: string }[] = [
    { label: "$L/a$", value: x >= X_MAX * 0.99 ? "$200\\;(\\to\\infty)$" : `$${x.toFixed(1)}$` },
    isTheta
      ? { label: "$\\theta_1=\\theta_2\\to90^\\circ$", value: `$${th.toFixed(2)}^\\circ$` }
      : { label: "$\\alpha_1=\\alpha_2\\to0^\\circ$", value: `$${al.toFixed(2)}^\\circ$` },
    isTheta
      ? { label: "$\\sin\\theta_1+\\sin\\theta_2\\to2$", value: `$${sinSum.toFixed(4)}$` }
      : { label: "$\\cos\\alpha_1+\\cos\\alpha_2\\to2$", value: `$${sinSum.toFixed(4)}$` },
    { label: "$B(L)/B_\\infty$", value: `$${(100 * sin1).toFixed(2)}\\,\\%$` },
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
            <span>Дължина спрямо разстоянието: <RichText text="$L/a$" /></span>
            <span className="font-bold tabular-nums text-minus"><RichText text={`$${x.toFixed(1)}$`} /></span>
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

        {/* Фон в реални единици a — мащабира се с „камерата“ */}
        <g aria-hidden="true">
          {worldGrid.map((u) => {
            const screenX = WIRE_X + u * pxu;
            if (screenX < 0 || screenX > W) return null;
            const major = u % 25 === 0;
            return (
              <line
                key={`gx-${u}`}
                x1={screenX}
                y1={0}
                x2={screenX}
                y2={H}
                stroke={major ? C.minus : C.wire}
                opacity={major ? 0.14 : 0.035}
                strokeWidth={major ? 1.2 : 1}
              />
            );
          })}
          {worldGrid.map((u) => {
            const screenY = CY + u * pxu;
            if (screenY < 0 || screenY > H) return null;
            const major = u % 25 === 0;
            return (
              <line
                key={`gy-${u}`}
                x1={0}
                y1={screenY}
                x2={W}
                y2={screenY}
                stroke={major ? C.minus : C.wire}
                opacity={major ? 0.14 : 0.035}
                strokeWidth={major ? 1.2 : 1}
              />
            );
          })}
        </g>

        <line x1={WIRE_X} y1={topY} x2={WIRE_X} y2={botY} stroke={C.wire} strokeWidth={Math.max(2, Math.min(4, pxu / 12))} />
        <Arrow x1={WIRE_X} y1={CY + 16} x2={WIRE_X} y2={CY - 16} color={C.warn} width={2.5} />
        <circle cx={WIRE_X} cy={topY} r={5} fill={C.wire} />
        <circle cx={WIRE_X} cy={botY} r={5} fill={C.wire} />
        <text x={WIRE_X - 40} y={topY + 4} fill={C.mut} fontSize={13} textAnchor="middle">1</text>
        <text x={WIRE_X - 40} y={botY + 4} fill={C.mut} fontSize={13} textAnchor="middle">2</text>

        {/* Перпендикулярното разстояние a — свива се визуално при отдалечаване */}
        <line x1={WIRE_X} y1={p.y} x2={p.x} y2={p.y} stroke={C.mut} strokeWidth={1.6} strokeDasharray="5 4" />
        <SvgTex x={p.x + 12} y={p.y + 20} tex="a" color={C.mut} width={28} />

        {/* r-векторите и двата ъгъла — винаги и двата видими */}
        <Arrow x1={p.x} y1={p.y} x2={WIRE_X} y2={topY} color={C.minus} width={2} texLabel="r_1" texLabelDy={-2} />
        <Arrow x1={p.x} y1={p.y} x2={WIRE_X} y2={botY} color={C.minus} width={2} texLabel="r_2" texLabelDy={8} />
        <g
          opacity={angleOpacity}
          aria-hidden={angleOpacity === 0}
          style={{ transition: "opacity 180ms ease-out" }}
        >
          {angleShifted && (
            <line x1={p.x} y1={p.y} x2={angleCx} y2={p.y} stroke={C.faint} strokeWidth={1.3} strokeDasharray="3 4" />
          )}
          {isTheta ? (
            <g>
              <AngleArc cx={angleCx} cy={p.y} a1={Math.PI} a2={dirR1} r={angleInnerR} color={C.plus} />
              <AngleArc cx={angleCx} cy={p.y} a1={Math.PI} a2={dirR2} r={angleOuterR} color={C.plus} />
              <SvgTex x={theta1Label.x} y={theta1Label.y} tex="\theta_1" color={C.plus} fontSize={12.5} width={46} anchor="middle" />
              <SvgTex x={theta2Label.x} y={theta2Label.y} tex="\theta_2" color={C.plus} fontSize={12.5} width={46} anchor="middle" />
            </g>
          ) : (
            <g>
              <line
                x1={angleCx}
                y1={Math.max(25, Math.min(topY, p.y - angleOuterR - 6))}
                x2={angleCx}
                y2={Math.min(H - 25, Math.max(botY, p.y + angleOuterR + 6))}
                stroke={C.faint}
                strokeWidth={1.3}
                strokeDasharray="3 5"
              />
              <AngleArc cx={angleCx} cy={p.y} a1={-Math.PI / 2} a2={dirR1} r={angleInnerR} color={C.ok} />
              <AngleArc cx={angleCx} cy={p.y} a1={Math.PI / 2} a2={dirR2} r={angleOuterR} color={C.ok} />
              <SvgTex x={alpha1Label.x} y={alpha1Label.y} tex="\alpha_1" color={C.ok} fontSize={12.5} width={46} anchor="middle" />
              <SvgTex x={alpha2Label.x} y={alpha2Label.y} tex="\alpha_2" color={C.ok} fontSize={12.5} width={46} anchor="middle" />
            </g>
          )}
        </g>

        <circle cx={p.x} cy={p.y} r={6} fill={C.wire} />
        <SvgTex x={p.x + 12} y={p.y - 10} tex="P" color={C.wire} width={30} />
      </svg>

      {/* Живи стойности */}
      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule sm:grid-cols-4">
        {readout.map((r) => (
          <div key={r.label} className="bg-surface px-3 py-2.5">
            <dt className="text-[10.5px] font-bold tracking-wide text-muted"><RichText text={r.label} /></dt>
            <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-minus"><RichText text={r.value} /></dd>
          </div>
        ))}
      </dl>

      {/* Графиката на предела */}
      <p className="mt-5 mb-2 text-[14px] text-muted">
        <RichText text="Отношението $B(L)/B_\infty$ като функция от $L/a$ — кривата се приближава към $1$, без да го достига при крайно $L$. Това е смисълът на думата **граница**:" />
      </p>
      <svg viewBox={`0 0 ${GW} ${GH}`} className={STAGE_CLASS + " select-none"}>
        <rect width={GW} height={GH} fill={STAGE_BG} />
        {/* мрежа и оси */}
        {[0, 0.25, 0.5, 0.75].map((v) => (
          <line key={v} x1={GPL} y1={gy(v)} x2={GW - GPR} y2={gy(v)} stroke={C.wire} opacity={0.08} strokeWidth={1} />
        ))}
        {[10, 20, 30].map((v) => (
          <line key={v} x1={gx(v)} y1={GPT} x2={gx(v)} y2={GH - GPB} stroke={C.wire} opacity={0.08} strokeWidth={1} />
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
        <SvgTex x={GW - GPR} y={GH - 12} tex="L/a" color={C.mut} fontSize={12.5} width={54} anchor="end" />
        <SvgTex x={GPL + 4} y={GPT - 10} tex="B(L)/B_\infty" color={C.mut} fontSize={12.5} width={96} />
        {/* асимптотата — границата */}
        <line x1={GPL} y1={gy(1)} x2={GW - GPR} y2={gy(1)} stroke={C.ok} strokeWidth={1.5} strokeDasharray="7 5" />
        <SvgTex x={GW - GPR - 6} y={gy(1) - 9} tex="B_\infty=\mu_0I/(2\pi a)" color={C.ok} fontSize={12} width={152} anchor="end" />
        {/* кривата */}
        <path d={curve} fill="none" stroke={C.minus} strokeWidth={2.5} />
        {/* маркерът на текущото L/a */}
        <line x1={gx(mx)} y1={GH - GPB} x2={gx(mx)} y2={gy(ratio(mx))} stroke={C.faint} strokeWidth={1.3} strokeDasharray="3 4" />
        <circle cx={gx(mx)} cy={gy(ratio(mx))} r={6} fill={C.warn} stroke={STAGE_BG} strokeWidth={2} />
        <SvgTex
          x={Math.min(gx(mx) + 10, GW - 120)}
          y={gy(ratio(mx)) + (ratio(mx) > 0.9 ? 22 : -10)}
          tex={`${(100 * sin1).toFixed(1)}\\,\\%`}
          color={C.warn}
          fontSize={13}
          width={78}
        />
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
