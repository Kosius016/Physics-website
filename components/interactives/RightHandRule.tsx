"use client";

import { useRef, useState } from "react";
import PredictionQuestion from "./PredictionQuestion";
import { Arrow, BTN_SEC, C, CurrentSymbol, PANEL_CLASS, STAGE_BG, STAGE_CLASS, svgPoint } from "./svg";

/**
 * Интерактив "Правило на дясната ръка": прав проводник с ток нагоре/надолу,
 * влачима наблюдателна точка P. Ученикът първо ПРЕДСКАЗВА посоката на B
 * (⊙ или ⊗); чак след отговора сцената показва верния символ, обяснение и
 * inset "изглед отгоре", където се вижда окръжността на силовата линия.
 * Преместване на P или обръщане на тока нулира въпроса.
 */

const W = 640;
const H = 380;
const WIRE_X = 300;

/** Inset "изглед отгоре": проводникът като ⊙/⊗, силовата линия като окръжност. */
function TopViewInset({ dirUp, dx }: { dirUp: boolean; dx: number }) {
  const cx = 545;
  const cy = 95;
  const r = 42;
  const px = cx + (dx > 0 ? r : -r);
  // Гледаме отгоре: ток нагоре = към наблюдателя на inset-а (⊙) → полето върти
  // обратно на часовниковата стрелка. "Нагоре" в inset-а = навътре в екрана.
  const ccw = dirUp;
  const tangentY = (dx > 0 ? -1 : 1) * (ccw ? 1 : -1); // -1 = нагоре в inset
  return (
    <g className="animate-rise">
      <rect x={cx - 82} y={cy - 78} width={164} height={172} rx={8} fill="rgba(255,255,255,0.06)" stroke={C.faint} />
      <text x={cx} y={cy - 60} fill={C.mut} fontSize={11.5} fontWeight={700} textAnchor="middle">
        ИЗГЛЕД ОТГОРЕ
      </text>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.faint} strokeWidth={1.5} strokeDasharray="5 4" />
      {/* посока на обикаляне на силовата линия */}
      {[[cx, cy - r, ccw ? -1 : 1, 0] as const, [cx, cy + r, ccw ? 1 : -1, 0] as const].map(
        ([ax, ay, tx, ty], i) => (
          <Arrow key={i} x1={ax - tx * 10} y1={ay - ty * 10} x2={ax + tx * 10} y2={ay + ty * 10} color={C.mut} width={1.8} />
        ),
      )}
      <CurrentSymbol x={cx} y={cy} out={dirUp} r={10} color={C.warn} />
      <circle cx={px} cy={cy} r={3.5} fill={C.wire} />
      <text x={px + (dx > 0 ? 8 : -8)} y={cy + 4} fill={C.wire} fontSize={12} fontWeight={700} textAnchor={dx > 0 ? "start" : "end"}>
        P
      </text>
      <Arrow x1={px} y1={cy} x2={px} y2={cy + tangentY * 34} color={C.ok} width={2.5} label="B" labelDx={dx > 0 ? 6 : -16} />
      <text x={cx} y={cy + 78} fill={C.mut} fontSize={10.5} textAnchor="middle">
        ↑ в изгледа = ⊗ навътре в екрана
      </text>
    </g>
  );
}

export default function RightHandRule() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dirUp, setDirUp] = useState(true);
  const [p, setP] = useState({ x: 460, y: 210 });
  const [revealed, setRevealed] = useState(false);
  const dragging = useRef(false);

  const onMove = (clientX: number, clientY: number) => {
    if (!dragging.current || !svgRef.current) return;
    const [x, y] = svgPoint(svgRef.current, clientX, clientY, W, H);
    // Държим P на разумно разстояние от проводника и в сцената
    const clampedX = Math.min(W - 25, Math.max(25, x));
    const safeX =
      Math.abs(clampedX - WIRE_X) < 40 ? (clampedX >= WIRE_X ? WIRE_X + 40 : WIRE_X - 40) : clampedX;
    setP({ x: safeX, y: Math.min(H - 25, Math.max(25, y)) });
    setRevealed(false);
  };

  // B при P: ток нагоре + P вдясно → навътре (⊗); останалите случаи огледално.
  const rightSide = p.x > WIRE_X;
  const into = dirUp === rightSide;

  const explanation = `Обхванете проводника с дясната ръка, с палеца по посоката на тока (${dirUp ? "нагоре" : "надолу"}). Пръстите обвиват проводника и от ${rightSide ? "дясната" : "лявата"} страна, където е P, те ${into ? "влизат в екрана — затова B е ⊗" : "излизат от екрана — затова B е ⊙"}. Изгледът отгоре показва защо: полето обикаля проводника в окръжност и в P е допирателно към нея.`;

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[14px] text-muted">
          Преместете точката <strong className="text-ink">P</strong> около проводника и предскажете
          посоката на полето.
        </p>
        <button
          className={BTN_SEC}
          onClick={() => {
            setDirUp((d) => !d);
            setRevealed(false);
          }}
        >
          Обърни посоката на тока ⇅
        </button>
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

        {/* Проводникът с ток */}
        <line x1={WIRE_X} y1={10} x2={WIRE_X} y2={H - 10} stroke={C.wire} strokeWidth={4} />
        {[70, 190, 310].map((y) => (
          <Arrow
            key={y}
            x1={WIRE_X}
            y1={dirUp ? y + 14 : y - 14}
            x2={WIRE_X}
            y2={dirUp ? y - 14 : y + 14}
            color={C.warn}
            width={3}
          />
        ))}
        <text x={WIRE_X - 24} y={dirUp ? 38 : H - 26} fill={C.warn} fontSize={15} fontWeight={700}>
          I
        </text>

        {/* Наблюдателната точка P (влачима) */}
        <g style={{ cursor: "grab" }}>
          {revealed ? (
            <CurrentSymbol x={p.x} y={p.y} out={!into} r={16} color={C.ok} animate />
          ) : (
            <>
              <circle cx={p.x} cy={p.y} r={16} fill="none" stroke={C.minus} strokeWidth={2} strokeDasharray="4 3" />
              <circle cx={p.x} cy={p.y} r={4} fill={C.minus} />
              <text x={p.x} y={p.y - 24} fill={C.minus} fontSize={14} fontWeight={700} textAnchor="middle">
                ?
              </text>
            </>
          )}
          <text x={p.x + 22} y={p.y + 5} fill={C.wire} fontSize={14} fontWeight={700}>
            P
          </text>
        </g>

        {revealed && <TopViewInset dirUp={dirUp} dx={p.x - WIRE_X} />}

        {revealed && (
          <text x={16} y={H - 16} fill={C.ok} fontSize={13.5} fontWeight={600} className="animate-rise">
            B в P: {into ? "⊗ навътре в екрана" : "⊙ навън от екрана"}
          </text>
        )}
      </svg>

      <div className="mt-4">
        <PredictionQuestion
          prompt="Накъде сочи магнитното поле B в точка P?"
          resetToken={`${dirUp}-${Math.round(p.x)}-${Math.round(p.y)}`}
          options={[
            { text: "⊙ Навън от екрана (към наблюдателя)", correct: !into },
            { text: "⊗ Навътре в екрана (от наблюдателя)", correct: into },
          ]}
          explanation={explanation}
          onAnswered={() => setRevealed(true)}
        />
      </div>
    </div>
  );
}
