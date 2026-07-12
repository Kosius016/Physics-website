"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BTN_SEC, PANEL_CLASS, STAGE_CLASS } from "./svg";
import {
  det,
  drawMatrixScene,
  IDENTITY,
  lerpMat,
  MatrixDisplay,
  MatrixSliders,
  MC_H,
  MC_W,
  type Mat2,
} from "./matrixCanvas";

/**
 * Игрището на матриците: 2×2 матрица с плъзгачи, която трансформира
 * решетката, базисните вектори и пиксел-арт ракета в реално време.
 * Preset-ите се прилагат с плавна анимация от текущата матрица.
 */

const PRESETS: { label: string; m: Mat2 }[] = [
  { label: "Единична", m: [1, 0, 0, 1] },
  { label: "Ротация 45°", m: [0.71, -0.71, 0.71, 0.71] },
  { label: "Ротация 90°", m: [0, -1, 1, 0] },
  { label: "Мащаб ×1.5", m: [1.5, 0, 0, 1.5] },
  { label: "Срязване", m: [1, 0.6, 0, 1] },
  { label: "Огледало", m: [-1, 0, 0, 1] },
  { label: "Проекция (смачкване)", m: [1, 0.5, 0, 0] },
];

export default function MatrixPlayground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const [m, setM] = useState<Mat2>(IDENTITY);
  const [animating, setAnimating] = useState(false);

  const draw = useCallback((mat: Mat2) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    drawMatrixScene(ctx, mat, { sprite: true, basis: true, squareOutline: true });
  }, []);

  useEffect(() => {
    draw(m);
  }, [m, draw]);

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const animateTo = (target: Mat2) => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setAnimating(true);
    const from = m;
    const t0 = performance.now();
    const dur = 700;
    const frame = (now: number) => {
      const k = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - k, 3);
      setM(lerpMat(from, target, eased));
      if (k < 1) {
        animRef.current = requestAnimationFrame(frame);
      } else {
        animRef.current = null;
        setAnimating(false);
      }
    };
    animRef.current = requestAnimationFrame(frame);
  };

  const d = det(m);

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button key={p.label} className={BTN_SEC} disabled={animating} onClick={() => animateTo(p.m)}>
            {p.label}
          </button>
        ))}
      </div>

      <canvas ref={canvasRef} width={MC_W} height={MC_H} className={STAGE_CLASS} />

      <div className="mt-4 flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
        <div className="min-w-[260px] flex-1">
          <MatrixSliders m={m} onChange={setM} disabled={animating} />
        </div>
        <div className="flex flex-col gap-2 text-[14px]">
          <MatrixDisplay m={m} label="M" highlight />
          <div className="text-muted">
            î ↦ <span className="font-mono font-bold tabular-nums text-plus">({m[0].toFixed(2)}, {m[2].toFixed(2)})</span>
            {"   "}ĵ ↦ <span className="font-mono font-bold tabular-nums text-ok">({m[1].toFixed(2)}, {m[3].toFixed(2)})</span>
          </div>
          <div className="text-muted">
            det M ={" "}
            <span className={`font-mono font-bold tabular-nums ${Math.abs(d) < 0.03 ? "text-plus" : "text-minus"}`}>
              {d.toFixed(2)}
            </span>{" "}
            <span className="text-[12.5px]">(площта — тема на следващия урок)</span>
          </div>
        </div>
      </div>

      <p className="mt-3 text-[13.5px] text-muted">
        Червената и зелената стрелка са образите на базисните вектори î и ĵ — те са{" "}
        <strong className="text-ink">колоните на матрицата</strong>. Жълтият контур е образът на
        единичния квадрат. Опитайте „Проекция“ и наблюдавайте какво губи картинката.
      </p>
    </div>
  );
}
