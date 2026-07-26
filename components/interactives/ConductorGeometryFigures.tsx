"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import { BTN_SEC, C, PANEL_CLASS, STAGE_BG, STAGE_CLASS } from "./svg";

/**
 * Двете геометрии от §2, които дотук се описваха само с думи.
 *
 * Схемите носят разположението (какво къде седи), а числата остават в readout
 * лентите под тях, както изисква CLAUDE.md §4.
 */

const METAL_FILL = "rgba(242,239,245,0.13)";

function Cap({
  x,
  y,
  children,
  color = C.mut,
  size = 11,
  anchor = "start",
}: {
  x: number;
  y: number;
  children: string;
  color?: string;
  size?: number;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      fill={color}
      fontSize={size}
      fontWeight={800}
      letterSpacing="0.11em"
      textAnchor={anchor}
      fontFamily="var(--font-sans), system-ui, sans-serif"
    >
      {children}
    </text>
  );
}

function Plus({ x, y, r = 5, color = C.plus }: { x: number; y: number; r?: number; color?: string }) {
  return (
    <g stroke={color} strokeWidth={2} strokeLinecap="round">
      <line x1={x - r} y1={y} x2={x + r} y2={y} />
      <line x1={x} y1={y - r} x2={x} y2={y + r} />
    </g>
  );
}

function Minus({ x, y, r = 5, color = C.minus }: { x: number; y: number; r?: number; color?: string }) {
  return <line x1={x - r} y1={y} x2={x + r} y2={y} stroke={color} strokeWidth={2} strokeLinecap="round" />;
}

/** Знаци, разпределени равномерно по окръжност. */
function onCircle(cx: number, cy: number, radius: number, count: number, phase = 0) {
  return Array.from({ length: count }, (_, i) => {
    const a = phase + (2 * Math.PI * i) / count;
    return { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a), key: i };
  });
}

/* ------------------------------------------------------------------ */
/* Кухина и индуциран заряд                                            */
/* ------------------------------------------------------------------ */

type ShellMode = "neutral" | "charged" | "grounded";

/** `label` минава през RichText, `aria` е чист текст за екранните четци. */
const MODES: { key: ShellMode; label: string; aria: string; outerTex: string; note: string }[] = [
  {
    key: "neutral",
    label: "Неутрална черупка",
    aria: "неутрална черупка",
    outerTex: String.raw`+q`,
    note: "Черупката е неутрална, затова външната повърхност носи точно $+q$.",
  },
  {
    key: "charged",
    label: "Собствен заряд $Q$",
    aria: "черупка със собствен заряд Q",
    outerTex: String.raw`Q+q`,
    note: "Собственият заряд се добавя само отвън: вътрешната повърхност пак е $-q$.",
  },
  {
    key: "grounded",
    label: "Заземена",
    aria: "заземена черупка",
    outerTex: "",
    note: "Външният заряд изтича в Земята. Индуцираният $-q$ вътре остава.",
  },
];

export function CavityChargeFigure() {
  const [mode, setMode] = useState<ShellMode>("neutral");
  const active = MODES.find((m) => m.key === mode)!;

  const CX = 210;
  const CY = 200;
  const A = 62; // радиус на кухината
  const B = 108; // външен радиус
  const GAUSS = 86; // гаусова повърхност вътре в метала

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => setMode(m.key)}
            aria-pressed={mode === m.key}
            className={`cursor-pointer rounded-lg border-[1.5px] border-ink px-3.5 py-2 text-[13px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-minus ${
              mode === m.key ? "bg-ink text-white" : "bg-surface text-ink hover:bg-hl"
            }`}
          >
            <RichText text={m.label} />
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-[10px]">
        <div className="min-w-[520px]">
          <svg
            viewBox="0 0 620 400"
            className={STAGE_CLASS}
            role="img"
            aria-label={`Разрез на проводяща черупка със заряд плюс q в центъра на кухината; режим: ${active.aria}`}
          >
            <rect width={620} height={400} fill={STAGE_BG} />

            {/* Металът е пръстенът между a и b */}
            <circle cx={CX} cy={CY} r={B} fill={METAL_FILL} stroke={C.wire} strokeWidth={2} />
            <circle cx={CX} cy={CY} r={A} fill={STAGE_BG} stroke={C.wire} strokeWidth={2} />

            {/* Гаусова повърхност вътре в метала */}
            <circle
              cx={CX}
              cy={CY}
              r={GAUSS}
              fill="none"
              stroke={C.ok}
              strokeWidth={1.8}
              strokeDasharray="7 6"
            />

            {/* Точковият заряд в центъра */}
            <circle cx={CX} cy={CY} r={9} fill={C.plus} />
            <SvgTex x={CX + 14} y={CY - 14} tex="+q" color={C.plus} fontSize={15} width={44} />

            {/* Индуциран заряд по вътрешната повърхност */}
            {onCircle(CX, CY, A, 12, -Math.PI / 2).map((p) => (
              <Minus key={`in-${p.key}`} x={p.x} y={p.y} />
            ))}

            {/* Заряд по външната повърхност (според режима) */}
            {mode !== "grounded" &&
              onCircle(CX, CY, B, 14, -Math.PI / 2).map((p) => (
                <Plus key={`out-${p.key}`} x={p.x} y={p.y} />
              ))}

            {/* Заземяване */}
            {mode === "grounded" && (
              <g className="animate-rise" stroke={C.wire} strokeWidth={2} strokeLinecap="round">
                <line x1={CX} y1={CY + B} x2={CX} y2={CY + B + 40} />
                <line x1={CX - 22} y1={CY + B + 40} x2={CX + 22} y2={CY + B + 40} />
                <line x1={CX - 14} y1={CY + B + 48} x2={CX + 14} y2={CY + B + 48} />
                <line x1={CX - 6} y1={CY + B + 56} x2={CX + 6} y2={CY + B + 56} />
              </g>
            )}

            {/* Радиуси a и b */}
            <line x1={CX} y1={CY} x2={CX - A} y2={CY} stroke={C.faint} strokeWidth={1.5} />
            <SvgTex x={CX - A / 2} y={CY - 12} tex="a" color={C.mut} fontSize={13} width={20} anchor="middle" />
            <line x1={CX} y1={CY} x2={CX + B * 0.71} y2={CY + B * 0.71} stroke={C.faint} strokeWidth={1.5} />
            <SvgTex x={CX + 52} y={CY + 44} tex="b" color={C.mut} fontSize={13} width={20} />

            <Cap x={CX} y={CY - A + 22} anchor="middle" size={10}>КУХИНА</Cap>
            <Cap x={CX} y={CY - B + 20} anchor="middle" size={10}>ПРОВОДНИК</Cap>

            {/* Легенда вдясно, с водещи линии — фиксирани позиции, без застъпване */}
            <g stroke={C.faint} strokeWidth={1.2} strokeDasharray="4 4">
              <line x1={CX + A * 0.72} y1={CY - A * 0.72} x2={396} y2={110} />
              <line x1={CX + GAUSS * 0.86} y1={CY - GAUSS * 0.5} x2={396} y2={196} />
              {mode !== "grounded" && (
                <line x1={CX + B * 0.86} y1={CY - B * 0.5} x2={396} y2={282} />
              )}
            </g>

            <Cap x={404} y={96} color={C.minus}>ВЪТРЕШНА ПОВЪРХНОСТ</Cap>
            <SvgTex x={404} y={122} tex={String.raw`Q_{\text{вътр}}=-q`} color={C.minus} fontSize={15} width={150} />

            <Cap x={404} y={182} color={C.ok}>ГАУСОВА ПОВЪРХНОСТ В МЕТАЛА</Cap>
            <SvgTex x={404} y={208} tex={String.raw`Q_{\text{обхв}}=0`} color={C.ok} fontSize={15} width={140} />

            {mode !== "grounded" && (
              <g className="animate-rise">
                <Cap x={404} y={268} color={C.plus}>ВЪНШНА ПОВЪРХНОСТ</Cap>
                <SvgTex
                  x={404}
                  y={294}
                  tex={String.raw`Q_{\text{външ}}=${active.outerTex}`}
                  color={C.plus}
                  fontSize={15}
                  width={150}
                />
              </g>
            )}
            {mode === "grounded" && (
              <g className="animate-rise">
                <Cap x={404} y={268} color={C.mut}>ВЪНШНА ПОВЪРХНОСТ</Cap>
                <Cap x={404} y={292} color={C.mut} size={12}>ЗАРЯДЪТ ИЗТИЧА</Cap>
              </g>
            )}
          </svg>
        </div>
      </div>

      <p className="mt-3 text-[14px] leading-relaxed text-ink/90">
        <RichText text={active.note} />
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-muted">
        Полето в самия метал е нула, затова всяка гаусова повърхност вътре в него обхваща нулев
        пълен заряд. Оттам следва вътрешната повърхност: тя трябва да компенсира точно централния
        заряд.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Свързване на две сфери                                              */
/* ------------------------------------------------------------------ */

export function TwoSpheresFigure() {
  const [ratio, setRatio] = useState(0.55); // R_2 / R_1

  const R1_PX = 58;
  const R2_PX = R1_PX * ratio;
  const C1X = 150;
  const C2X = 430;
  const CY = 168;

  /* Потенциалите се изравняват: Q_i' пропорционално на R_i. */
  const share1 = 1 / (1 + ratio);
  const share2 = ratio / (1 + ratio);
  /* sigma ∝ Q'/R² ⇒ отношението е обратно на радиусите. */
  const sigmaRatio = 1 / ratio;

  const fmt = (v: number, d = 2) => v.toFixed(d).replace(".", "{,}");

  return (
    <div className={PANEL_CLASS}>
      <div className="overflow-x-auto rounded-[10px]">
        <div className="min-w-[520px]">
          <svg
            viewBox="0 0 620 300"
            className={STAGE_CLASS}
            role="img"
            aria-label={`Две сфери, свързани с жица; втората е ${ratio.toFixed(2)} пъти по-малка от първата`}
          >
            <rect width={620} height={300} fill={STAGE_BG} />

            {/* Жицата */}
            <line x1={C1X + R1_PX} y1={CY} x2={C2X - R2_PX} y2={CY} stroke={C.wire} strokeWidth={2.5} />

            {/* Сферите */}
            <circle cx={C1X} cy={CY} r={R1_PX} fill={METAL_FILL} stroke={C.wire} strokeWidth={2} />
            <circle cx={C2X} cy={CY} r={R2_PX} fill={METAL_FILL} stroke={C.wire} strokeWidth={2} />

            {/* Еднакъв брой знаци на всяка сфера: по-малката ги събира по-нагъсто,
                което е точно смисълът на sigma ∝ 1/R. */}
            {onCircle(C1X, CY, R1_PX, 12, -Math.PI / 2).map((p) => (
              <Plus key={`s1-${p.key}`} x={p.x} y={p.y} r={4.5} />
            ))}
            {onCircle(C2X, CY, R2_PX, 12, -Math.PI / 2).map((p) => (
              <Plus key={`s2-${p.key}`} x={p.x} y={p.y} r={4.5} />
            ))}

            {/* Радиуси */}
            <line x1={C1X} y1={CY} x2={C1X + R1_PX} y2={CY} stroke={C.faint} strokeWidth={1.5} />
            <SvgTex x={C1X + R1_PX / 2} y={CY - 12} tex="R_1" color={C.mut} fontSize={13} width={30} anchor="middle" />
            <line x1={C2X} y1={CY} x2={C2X + R2_PX} y2={CY} stroke={C.faint} strokeWidth={1.5} />
            <SvgTex x={C2X + R2_PX / 2} y={CY - 12} tex="R_2" color={C.mut} fontSize={13} width={30} anchor="middle" />

            <SvgTex x={C1X} y={CY + R1_PX + 34} tex="Q_1'" color={C.plus} fontSize={15} width={40} anchor="middle" />
            <SvgTex x={C2X} y={CY + R1_PX + 34} tex="Q_2'" color={C.plus} fontSize={15} width={40} anchor="middle" />

            <Cap x={(C1X + C2X) / 2} y={CY - 22} anchor="middle" size={10}>
              ЖИЦА: ОБЩ ПОТЕНЦИАЛ
            </Cap>
            <SvgTex
              x={(C1X + C2X) / 2}
              y={276}
              tex={String.raw`V_1=V_2\ \Rightarrow\ \frac{Q_1'}{R_1}=\frac{Q_2'}{R_2}`}
              color={C.ok}
              fontSize={15}
              width={220}
              anchor="middle"
            />
          </svg>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule sm:grid-cols-4">
        {[
          { label: "Отношение на радиусите", tex: String.raw`$R_2/R_1=${fmt(ratio)}$`, tone: "text-minus" },
          { label: "Дял от заряда, сфера 1", tex: String.raw`$Q_1'=${fmt(share1)}\,Q$`, tone: "text-plus" },
          { label: "Дял от заряда, сфера 2", tex: String.raw`$Q_2'=${fmt(share2)}\,Q$`, tone: "text-plus" },
          { label: "Плътности", tex: String.raw`$\sigma_1/\sigma_2=${fmt(sigmaRatio)}$`, tone: "text-ok" },
        ].map((r) => (
          <div key={r.label} className="min-w-0 bg-surface px-3 py-2.5">
            <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">{r.label}</dt>
            <dd className={`mt-0.5 text-[14.5px] font-bold tabular-nums ${r.tone}`}>
              <RichText text={r.tex} />
            </dd>
          </div>
        ))}
      </dl>

      <label className="mt-4 block text-[13px] font-semibold text-ink">
        <span className="mb-1.5 flex items-center justify-between gap-3">
          <RichText text="Колко по-малка е втората сфера" />
          <span className="tabular-nums text-minus">
            <RichText text={String.raw`$R_2/R_1=${fmt(ratio)}$`} />
          </span>
        </span>
        <input
          className="w-full accent-(--color-minus)"
          type="range"
          min="0.3"
          max="1"
          step="0.05"
          value={ratio}
          onChange={(e) => setRatio(Number(e.target.value))}
          aria-label="Отношение на радиуса на втората сфера към първата"
        />
      </label>

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className={BTN_SEC} onClick={() => setRatio(1)}>
          Еднакви сфери
        </button>
        <button type="button" className={BTN_SEC} onClick={() => setRatio(0.55)}>
          Върнете началните стойности
        </button>
      </div>

      <p className="mt-4 text-[13.5px] leading-relaxed text-muted">
        И на двете сфери е нарисуван един и същ брой знаци: по-малката ги събира на по-къса
        обиколка и точно това е по-високата повърхностна плътност. По-големият дял от заряда
        обаче отива на голямата сфера, защото при общ потенциал зарядът расте с радиуса.
      </p>
    </div>
  );
}
