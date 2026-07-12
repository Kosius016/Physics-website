"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BTN_PRI, BTN_SEC, PANEL_CLASS, STAGE_CLASS } from "./svg";
import {
  drawMatrixScene,
  IDENTITY,
  lerpMat,
  MatrixDisplay,
  mul,
  MC_H,
  MC_W,
  type Mat2,
} from "./matrixCanvas";

/**
 * Редът има значение: една и съща двойка операции (ротация R и срязване S),
 * приложени в различен ред, дават различен резултат. Анимира двете стъпки
 * последователно и показва произведенията S·R ≠ R·S.
 */

const R: Mat2 = [0, -1, 1, 0]; // ротация 90° обратно на часовниковата
const SH: Mat2 = [1, 0.6, 0, 1]; // срязване

const SR = mul(SH, R); // първо R, после S
const RS = mul(R, SH); // първо S, после R

export default function CompositionOrder() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const [m, setM] = useState<Mat2>(IDENTITY);
  const [ran, setRan] = useState<"none" | "rs" | "sr">("none");
  const [animating, setAnimating] = useState(false);

  const draw = useCallback((mat: Mat2) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    drawMatrixScene(ctx, mat, { sprite: true, basis: true });
  }, []);

  useEffect(() => {
    draw(m);
  }, [m, draw]);

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  /** Анимира I → first → composed (двете стъпки една след друга). */
  const run = (first: Mat2, composed: Mat2, tag: "rs" | "sr") => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setAnimating(true);
    setRan(tag);
    const t0 = performance.now();
    const stepMs = 800;
    const pauseMs = 350;
    const frame = (now: number) => {
      const t = now - t0;
      if (t < stepMs) {
        setM(lerpMat(IDENTITY, first, easec(t / stepMs)));
      } else if (t < stepMs + pauseMs) {
        setM(first);
      } else if (t < 2 * stepMs + pauseMs) {
        setM(lerpMat(first, composed, easec((t - stepMs - pauseMs) / stepMs)));
      } else {
        setM(composed);
        animRef.current = null;
        setAnimating(false);
        return;
      }
      animRef.current = requestAnimationFrame(frame);
    };
    animRef.current = requestAnimationFrame(frame);
  };
  const easec = (k: number) => 1 - Math.pow(1 - k, 3);

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button className={BTN_PRI} disabled={animating} onClick={() => run(R, SR, "rs")}>
          Първо R (ротация), после S (срязване)
        </button>
        <button className={BTN_PRI} disabled={animating} onClick={() => run(SH, RS, "sr")}>
          Първо S, после R
        </button>
        <button
          className={BTN_SEC}
          disabled={animating}
          onClick={() => {
            setM(IDENTITY);
            setRan("none");
          }}
        >
          Нулирай
        </button>
      </div>

      <canvas ref={canvasRef} width={MC_W} height={MC_H} className={STAGE_CLASS} />

      <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 text-[14px]">
        <MatrixDisplay m={R} label="R" />
        <MatrixDisplay m={SH} label="S" />
        {ran === "rs" && <MatrixDisplay m={SR} label="S·R" highlight />}
        {ran === "sr" && <MatrixDisplay m={RS} label="R·S" highlight />}
      </div>

      {ran !== "none" && !animating && (
        <p className="mt-3 rounded-r-lg border-l-4 border-minus bg-hl px-4 py-2.5 text-[15px] leading-relaxed animate-rise">
          <strong className="text-ink">Забележете реда на записа:</strong> „първо R, после S“ се записва{" "}
          <strong className="text-ink">S·R</strong> — матрицата, приложена първа, стои най-вдясно (както
          при функции: S(R(x)). Пуснете и другия ред: ракетата завършва на различно място, защото{" "}
          <strong className="text-ink">S·R ≠ R·S</strong> — умножението на матрици не е разместимо.
        </p>
      )}
    </div>
  );
}
