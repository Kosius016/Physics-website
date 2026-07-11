"use client";

import { useRef, useState } from "react";
import Formula from "@/components/Formula";
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

type Mode = "theta" | "alpha" | "both";

const MODES: { key: Mode; label: string }[] = [
  { key: "theta", label: "θ от перпендикуляра" },
  { key: "alpha", label: "α от проводника" },
  { key: "both", label: "θ + α = 90°" },
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

  const readout: { label: string; value: string }[] =
    mode === "theta"
      ? [
          { label: "a (перп. разст.)", value: (a / 40).toFixed(2) + " ед." },
          { label: "θ₁", value: th1.toFixed(1) + "°" },
          { label: "θ₂", value: th2.toFixed(1) + "°" },
          { label: "sin θ₁ + sin θ₂", value: sinSum.toFixed(3) },
        ]
      : mode === "alpha"
        ? [
            { label: "a (перп. разст.)", value: (a / 40).toFixed(2) + " ед." },
            { label: "α₁ = 90° − θ₁", value: (90 - th1).toFixed(1) + "°" },
            { label: "α₂ = 90° − θ₂", value: (90 - th2).toFixed(1) + "°" },
            { label: "cos α₁ + cos α₂", value: sinSum.toFixed(3) },
          ]
        : [
            { label: "θ₁", value: th1.toFixed(1) + "°" },
            { label: "α₁", value: (90 - th1).toFixed(1) + "°" },
            { label: "θ₁ + α₁", value: "90.0°" },
            { label: "sin θ₁ = cos α₁", value: sin1.toFixed(3) },
          ];

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[14px] text-muted">
          Преместете точката <strong className="text-ink">P</strong> — включително отвъд краищата на
          проводника.
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
              {m.label}
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
        <text x={WIRE_X - 26} y={CY + 5} fill={C.warn} fontSize={15} fontWeight={700}>
          I
        </text>
        {[A_TOP, A_BOT].map((e, i) => (
          <g key={i}>
            <circle cx={e.x} cy={e.y} r={5} fill={C.wire} />
            <text x={e.x - 28} y={e.y + 5} fill={C.mut} fontSize={13}>
              {i === 0 ? "1" : "2"}
            </text>
          </g>
        ))}

        {/* Перпендикулярът от P към правата на проводника */}
        <line x1={WIRE_X} y1={p.y} x2={p.x} y2={p.y} stroke={C.mut} strokeWidth={1.6} strokeDasharray="6 5" />
        <text x={(WIRE_X + p.x) / 2} y={p.y - 8} fill={C.mut} fontSize={13.5} fontWeight={600} textAnchor="middle">
          a
        </text>
        <path d={`M ${WIRE_X + 10} ${p.y} L ${WIRE_X + 10} ${p.y - 10} L ${WIRE_X} ${p.y - 10}`} fill="none" stroke={C.faint} strokeWidth={1.3} />

        {/* Помощна права, успоредна на проводника, през P (за α и за правия ъгъл) */}
        {mode !== "theta" && (
          <line x1={p.x} y1={25} x2={p.x} y2={H - 25} stroke={C.faint} strokeWidth={1.3} strokeDasharray="3 5" />
        )}

        {/* r-векторите към двата края */}
        <Arrow x1={p.x} y1={p.y} x2={A_TOP.x} y2={A_TOP.y} color={C.minus} width={2.2} label="r₁" labelDx={-24} labelDy={-2} />
        <Arrow x1={p.x} y1={p.y} x2={A_BOT.x} y2={A_BOT.y} color={C.minus} width={2.2} label="r₂" labelDx={-24} labelDy={12} />

        {/* Дъгите на ъглите при P */}
        {mode === "theta" && (
          <g>
            <AngleArc cx={p.x} cy={p.y} a1={dirPerp} a2={dirR1} r={44} color={C.plus} label={`θ₁=${th1.toFixed(0)}°`} />
            <AngleArc cx={p.x} cy={p.y} a1={dirPerp} a2={dirR2} r={60} color={C.plus} label={`θ₂=${th2.toFixed(0)}°`} />
          </g>
        )}
        {mode === "alpha" && (
          <g>
            <AngleArc cx={p.x} cy={p.y} a1={dirUp} a2={dirR1} r={44} color={C.ok} label={`α₁=${(90 - th1).toFixed(0)}°`} />
            <AngleArc cx={p.x} cy={p.y} a1={dirDown} a2={dirR2} r={60} color={C.ok} label={`α₂=${(90 - th2).toFixed(0)}°`} />
          </g>
        )}
        {mode === "both" && (
          <g>
            {/* Правият ъгъл между перпендикуляра и успоредната на проводника */}
            <path
              d={`M ${p.x - 26} ${p.y} L ${p.x - 26} ${p.y - 26} L ${p.x} ${p.y - 26}`}
              fill="none"
              stroke={C.mut}
              strokeWidth={1.5}
            />
            {/* θ₁ (от перпендикуляра до r₁) + α₁ (от r₁ до проводника) запълват 90° */}
            <AngleArc cx={p.x} cy={p.y} a1={dirPerp} a2={dirR1} r={44} color={C.plus} label={`θ₁=${th1.toFixed(0)}°`} />
            <AngleArc cx={p.x} cy={p.y} a1={dirR1} a2={dirUp} r={56} color={C.ok} label={`α₁=${(90 - th1).toFixed(0)}°`} />
            <text x={p.x + 14} y={p.y - 44} fill={C.wire} fontSize={13} fontWeight={700}>
              θ₁ + α₁ = 90°
            </text>
          </g>
        )}

        {/* Точката P */}
        <circle cx={p.x} cy={p.y} r={7} fill={C.wire} style={{ cursor: "grab" }} />
        <text x={p.x + 14} y={p.y + 5} fill={C.wire} fontSize={14} fontWeight={700}>
          P
        </text>
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
          <>
            <strong className="text-ink">θ се мери от перпендикуляра a към r-вектора.</strong> Затова
            във формулата стои sin θ. Когато P се премести отвъд някой край, съответният ъгъл става{" "}
            <strong className="text-ink">отрицателен</strong> и приносът му се изважда.
          </>
        )}
        {mode === "alpha" && (
          <>
            <strong className="text-ink">α се мери от направлението на проводника към r-вектора</strong>{" "}
            (пунктираната успоредна права през P). Това е <strong className="text-ink">различен
            ъгъл</strong> от θ — двата са <strong className="text-ink">допълнителни</strong>: θ + α =
            90°. Затова sin θ = cos α и двете формули дават едно и също число — сумата в таблицата не
            зависи от избора на означение.
          </>
        )}
        {mode === "both" && (
          <>
            <strong className="text-ink">Ето и двата ъгъла едновременно:</strong> перпендикулярът и
            проводникът затварят прав ъгъл (маркиран при P), а r-векторът го разделя на θ (червено, от
            перпендикуляра) и α (зелено, от проводника). Двете части винаги дават{" "}
            <strong className="text-ink">θ + α = 90°</strong> — затова sin θ = cos α. Учебниците
            избират едното означение, но физиката е една и съща.
          </>
        )}
      </div>
    </div>
  );
}
