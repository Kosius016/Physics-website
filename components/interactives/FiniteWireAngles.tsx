"use client";

import { useRef, useState } from "react";
import Formula from "@/components/Formula";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import { Arrow, AngleArc, C, PANEL_CLASS, STAGE_BG, STAGE_CLASS, svgPoint } from "./svg";

/**
 * Ъглите в закона на Био-Савар за КРАЕН прав проводник.
 * Точката P се мести с мишката; на живо се виждат перпендикулярното
 * разстояние a, r-векторите към двата края и стойностите на ъглите.
 * Три режима на означение:
 *   θ — от перпендикуляра (формула със sin),
 *   α — от направлението на проводника (формула с cos),
 *   θ+α=90° — двата ъгъла едновременно: ДОПЪЛНИТЕЛНИ ъгли, които заедно
 *   запълват правия ъгъл между перпендикуляра и проводника.
 */

const W = 640;
const H = 400;
const WIRE_X = 180;
const CY = H / 2;
const HALF_L = 140;

const A_TOP = { x: WIRE_X, y: CY - HALF_L }; // край 1 (горе)
const A_BOT = { x: WIRE_X, y: CY + HALF_L }; // край 2 (долу)

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

type Mode = "theta" | "alpha" | "both";

const MODES: { key: Mode; label: string }[] = [
  { key: "theta", label: "$\\theta$ от перпендикуляра" },
  { key: "alpha", label: "$\\alpha$ от проводника" },
  { key: "both", label: "$\\theta+\\alpha=90^\\circ$" },
];

export default function FiniteWireAngles() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [p, setP] = useState({ x: 420, y: CY });
  const [mode, setMode] = useState<Mode>("theta");
  const dragging = useRef(false);

  const onMove = (clientX: number, clientY: number) => {
    if (!dragging.current || !svgRef.current) return;
    const [x, y] = svgPoint(svgRef.current, clientX, clientY, W, H);
    setP({
      x: Math.min(W - 30, Math.max(WIRE_X + 45, x)),
      y: Math.min(H - 25, Math.max(25, y)),
    });
  };

  // Геометрия (със знак: d отрицателно, когато P е отвъд съответния край)
  const a = p.x - WIRE_X;
  const d1 = p.y - A_TOP.y;
  const d2 = A_BOT.y - p.y;
  const r1 = Math.hypot(a, d1);
  const r2 = Math.hypot(a, d2);
  const sin1 = d1 / r1;
  const sin2 = d2 / r2;
  const th1 = (Math.asin(sin1) * 180) / Math.PI;
  const th2 = (Math.asin(sin2) * 180) / Math.PI;
  const sinSum = sin1 + sin2;

  // Екранни посоки при P
  const dirPerp = Math.PI; // към проводника
  const dirR1 = Math.atan2(A_TOP.y - p.y, A_TOP.x - p.x);
  const dirR2 = Math.atan2(A_BOT.y - p.y, A_BOT.x - p.x);
  const dirUp = -Math.PI / 2;
  const dirDown = Math.PI / 2;

  // Дъгата не може да е по-голяма от отсечката от P до проводника.
  // При P близо до ръб на сцената ограничаваме и вертикалния радиус.
  const roomBeforeWire = a - 10;
  const thetaOuterR = Math.min(60, roomBeforeWire);
  const thetaInnerR = Math.min(44, Math.max(16, thetaOuterR - 14));
  const alphaTopR = Math.max(12, Math.min(44, roomBeforeWire, p.y - 8));
  const alphaBottomR = Math.max(12, Math.min(60, roomBeforeWire, H - p.y - 8));
  const bothAlphaR = Math.max(12, Math.min(56, roomBeforeWire, p.y - 8));
  const rightAngleSize = Math.max(10, Math.min(26, roomBeforeWire, p.y - 8));

  const theta1Label = angleLabelPoint(p.x, p.y, dirPerp, dirR1, thetaInnerR);
  const theta2Label = angleLabelPoint(p.x, p.y, dirPerp, dirR2, thetaOuterR);
  const alpha1Label = angleLabelPoint(p.x, p.y, dirUp, dirR1, alphaTopR);
  const alpha2Label = angleLabelPoint(p.x, p.y, dirDown, dirR2, alphaBottomR);
  const bothFormulaOnRight = p.x < W - 180;
  const bothFormulaOffset = Math.max(40, bothAlphaR + 14);
  const bothFormulaY = p.y - bothFormulaOffset >= 18
    ? p.y - bothFormulaOffset
    : Math.min(H - 18, p.y + bothFormulaOffset);
  // В комбинирания режим двете означения се раздалечават от свободната
  // страна на P. Така не се наслагват едно върху друго при P отвъд края.
  const bothLabelsOnRight = p.x < W - 100;
  const bothLabelX = p.x + (bothLabelsOnRight ? 50 : -50);
  const bothThetaLabelY = Math.min(H - 18, p.y + 17);
  const bothAlphaLabelY = Math.max(18, p.y - 17);

  const readout: { label: string; value: string }[] =
    mode === "theta"
      ? [
          { label: "$a$ (перп. разст.)", value: `$${(a / 40).toFixed(2)}\\,\\text{ед.}$` },
          { label: "$\\theta_1$", value: `$${th1.toFixed(1)}^\\circ$` },
          { label: "$\\theta_2$", value: `$${th2.toFixed(1)}^\\circ$` },
          { label: "$\\sin\\theta_1+\\sin\\theta_2$", value: `$${sinSum.toFixed(3)}$` },
        ]
      : mode === "alpha"
        ? [
            { label: "$a$ (перп. разст.)", value: `$${(a / 40).toFixed(2)}\\,\\text{ед.}$` },
            { label: "$\\alpha_1=90^\\circ-\\theta_1$", value: `$${(90 - th1).toFixed(1)}^\\circ$` },
            { label: "$\\alpha_2=90^\\circ-\\theta_2$", value: `$${(90 - th2).toFixed(1)}^\\circ$` },
            { label: "$\\cos\\alpha_1+\\cos\\alpha_2$", value: `$${sinSum.toFixed(3)}$` },
          ]
        : [
            { label: "$\\theta_1$", value: `$${th1.toFixed(1)}^\\circ$` },
            { label: "$\\alpha_1$", value: `$${(90 - th1).toFixed(1)}^\\circ$` },
            { label: "$\\theta_1+\\alpha_1$", value: "$90.0^\\circ$" },
            { label: "$\\sin\\theta_1=\\cos\\alpha_1$", value: `$${sin1.toFixed(3)}$` },
          ];

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[14px] text-muted">
          <RichText text="Преместете точката $P$ — включително отвъд краищата на проводника." />
        </p>
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button
              key={m.key}
              className={
                mode === m.key
                  ? "cursor-pointer rounded-full border-[1.5px] border-ink bg-ink px-4 py-1.5 text-[13.5px] font-bold text-white shadow-hard-sm"
                  : "cursor-pointer rounded-full border-[1.5px] border-ink bg-surface px-4 py-1.5 text-[13.5px] font-semibold text-ink transition-colors hover:bg-hl"
              }
              onClick={() => setMode(m.key)}
            >
              <RichText text={m.label} />
            </button>
          ))}
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className={STAGE_CLASS + " touch-none select-none"}
        onPointerDown={(e) => {
          dragging.current = true;
          (e.target as Element).setPointerCapture?.(e.pointerId);
          onMove(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => onMove(e.clientX, e.clientY)}
        onPointerUp={() => (dragging.current = false)}
        onPointerLeave={() => (dragging.current = false)}
      >
        <rect width={W} height={H} fill={STAGE_BG} />

        {/* Проводникът (краен) с ток нагоре */}
        <line x1={WIRE_X} y1={A_TOP.y} x2={WIRE_X} y2={A_BOT.y} stroke={C.wire} strokeWidth={4} />
        <Arrow x1={WIRE_X} y1={CY + 16} x2={WIRE_X} y2={CY - 16} color={C.warn} width={3} />
        <SvgTex x={WIRE_X - 26} y={CY} tex="I" color={C.warn} width={22} anchor="end" />
        {[A_TOP, A_BOT].map((e, i) => (
          <g key={i}>
            <circle cx={e.x} cy={e.y} r={5} fill={C.wire} />
            <text x={e.x - 40} y={e.y + 4} fill={C.mut} fontSize={13} textAnchor="middle">
              {i === 0 ? "1" : "2"}
            </text>
          </g>
        ))}

        {/* Перпендикулярът от P към правата на проводника */}
        <line x1={WIRE_X} y1={p.y} x2={p.x} y2={p.y} stroke={C.mut} strokeWidth={1.6} strokeDasharray="6 5" />
        <SvgTex x={(WIRE_X + p.x) / 2} y={p.y - 10} tex="a" color={C.mut} width={30} anchor="middle" />
        <path d={`M ${WIRE_X + 10} ${p.y} L ${WIRE_X + 10} ${p.y - 10} L ${WIRE_X} ${p.y - 10}`} fill="none" stroke={C.faint} strokeWidth={1.3} />

        {/* Помощна права, успоредна на проводника, през P (за α и за правия ъгъл) */}
        {mode !== "theta" && (
          <line x1={p.x} y1={25} x2={p.x} y2={H - 25} stroke={C.faint} strokeWidth={1.3} strokeDasharray="3 5" />
        )}

        {/* r-векторите към двата края */}
        <Arrow x1={p.x} y1={p.y} x2={A_TOP.x} y2={A_TOP.y} color={C.minus} width={2.2} texLabel="r_1" texLabelDy={-2} />
        <Arrow x1={p.x} y1={p.y} x2={A_BOT.x} y2={A_BOT.y} color={C.minus} width={2.2} texLabel="r_2" texLabelDy={8} />

        {/* Дъгите на ъглите при P */}
        {mode === "theta" && (
          <g>
            <AngleArc cx={p.x} cy={p.y} a1={dirPerp} a2={dirR1} r={thetaInnerR} color={C.plus} />
            <AngleArc cx={p.x} cy={p.y} a1={dirPerp} a2={dirR2} r={thetaOuterR} color={C.plus} />
            <SvgTex x={theta1Label.x} y={theta1Label.y} tex={String.raw`\theta_1`} color={C.plus} fontSize={12.5} width={46} anchor="middle" />
            <SvgTex x={theta2Label.x} y={theta2Label.y} tex={String.raw`\theta_2`} color={C.plus} fontSize={12.5} width={46} anchor="middle" />
          </g>
        )}
        {mode === "alpha" && (
          <g>
            <AngleArc cx={p.x} cy={p.y} a1={dirUp} a2={dirR1} r={alphaTopR} color={C.ok} />
            <AngleArc cx={p.x} cy={p.y} a1={dirDown} a2={dirR2} r={alphaBottomR} color={C.ok} />
            <SvgTex x={alpha1Label.x} y={alpha1Label.y} tex={String.raw`\alpha_1`} color={C.ok} fontSize={12.5} width={46} anchor="middle" />
            <SvgTex x={alpha2Label.x} y={alpha2Label.y} tex={String.raw`\alpha_2`} color={C.ok} fontSize={12.5} width={46} anchor="middle" />
          </g>
        )}
        {mode === "both" && (
          <g>
            {/* Правият ъгъл между перпендикуляра и успоредната на проводника */}
            <path
              d={`M ${p.x - rightAngleSize} ${p.y} L ${p.x - rightAngleSize} ${p.y - rightAngleSize} L ${p.x} ${p.y - rightAngleSize}`}
              fill="none"
              stroke={C.mut}
              strokeWidth={1.5}
            />
            {/* θ₁ (от перпендикуляра до r₁) + α₁ (от r₁ до проводника) запълват 90° */}
            <AngleArc cx={p.x} cy={p.y} a1={dirPerp} a2={dirR1} r={thetaInnerR} color={C.plus} />
            <AngleArc cx={p.x} cy={p.y} a1={dirR1} a2={dirUp} r={bothAlphaR} color={C.ok} />
            <SvgTex x={bothLabelX} y={bothThetaLabelY} tex={String.raw`\theta_1`} color={C.plus} fontSize={12.5} width={46} anchor="middle" />
            <SvgTex x={bothLabelX} y={bothAlphaLabelY} tex={String.raw`\alpha_1`} color={C.ok} fontSize={12.5} width={46} anchor="middle" />
            <SvgTex
              x={bothFormulaOnRight ? p.x + 14 : p.x - 14}
              y={bothFormulaY}
              tex={String.raw`\theta_1+\alpha_1=90^\circ`}
              color={C.wire}
              width={150}
              anchor={bothFormulaOnRight ? "start" : "end"}
            />
          </g>
        )}

        {/* Точката P */}
        <circle cx={p.x} cy={p.y} r={7} fill={C.wire} style={{ cursor: "grab" }} />
        <SvgTex x={p.x + 14} y={p.y} tex="P" color={C.wire} width={30} />
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

      <div className="mt-4">
        <Formula
          latex={
            mode === "theta"
              ? String.raw`B = \frac{\mu_0 I}{4\pi a}\left(\sin\theta_1 + \sin\theta_2\right)`
              : mode === "alpha"
                ? String.raw`B = \frac{\mu_0 I}{4\pi a}\left(\cos\alpha_1 + \cos\alpha_2\right)`
                : String.raw`\theta_i + \alpha_i = 90^\circ \;\;\Longrightarrow\;\; \sin\theta_i = \cos\alpha_i`
          }
        />
      </div>

      <div className="mt-3 rounded-r-lg border-l-4 border-minus bg-hl px-4 py-2.5 text-[15px] leading-relaxed">
        {mode === "theta" && (
          <RichText text="**Посока на измерване:** $\theta$ се мери от перпендикуляра $a$ към $\vec r$. Затова във формулата стои $\sin\theta$. Когато $P$ се премести отвъд някой край, съответният ъгъл става **отрицателен** и приносът му се изважда." />
        )}
        {mode === "alpha" && (
          <RichText text="**Посока на измерване:** $\alpha$ се мери от направлението на проводника към $\vec r$ (пунктираната успоредна права през $P$). Това е **различен ъгъл** от $\theta$ — двата са **допълнителни**: $\theta+\alpha=90^\circ$. Затова $\sin\theta=\cos\alpha$ и двете формули дават едно и също число." />
        )}
        {mode === "both" && (
          <RichText text="**Ето и двата ъгъла едновременно:** перпендикулярът и проводникът затварят прав ъгъл при $P$, а $\vec r$ го разделя на $\theta$ и $\alpha$. Двете части винаги дават $\theta+\alpha=90^\circ$, затова $\sin\theta=\cos\alpha$." />
        )}
      </div>
    </div>
  );
}
