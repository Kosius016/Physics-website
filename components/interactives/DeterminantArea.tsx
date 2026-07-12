"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BTN_PRI, BTN_SEC, PANEL_CLASS, STAGE_CLASS } from "./svg";
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
 * Детерминантата като площ: единичният квадрат (шахматно оцветен, пикселен)
 * се трансформира от M; живото показание сравнява |det M| с площта на
 * успоредника. Отрицателна детерминанта = обърната ориентация (флип),
 * det = 0 = смачкване в права (необратимо).
 */

const PRESETS: { label: string; m: Mat2 }[] = [
  { label: "Единична", m: [1, 0, 0, 1] },
  { label: "Мащаб ×1.5", m: [1.5, 0, 0, 1.5] },
  { label: "Срязване (det = 1!)", m: [1, 0.8, 0, 1] },
  { label: "Ротация (det = 1)", m: [0.71, -0.71, 0.71, 0.71] },
  { label: "Огледало (det = −1)", m: [-1, 0, 0, 1] },
];

const SQUASH: Mat2 = [1, 0.6, 0.5, 0.3]; // det = 0

export default function DeterminantArea() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const [m, setM] = useState<Mat2>([1.2, 0.4, 0.2, 1.1]);
  const [animating, setAnimating] = useState(false);

  const draw = useCallback((mat: Mat2) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    drawMatrixScene(ctx, mat, { checker: true, squareOutline: true, basis: true });
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
    const dur = 900;
    const frame = (now: number) => {
      const k = Math.min((now - t0) / dur, 1);
      setM(lerpMat(from, target, 1 - Math.pow(1 - k, 3)));
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
  const singular = Math.abs(d) < 0.04;

  const readout: { label: string; value: string; tone?: "plus" | "ok" }[] = [
    { label: "det M = ad − bc", value: d.toFixed(2), tone: singular ? "plus" : undefined },
    { label: "Площ на образа |det|", value: Math.abs(d).toFixed(2) },
    {
      label: "Ориентация",
      value: singular ? "—" : d > 0 ? "запазена" : "обърната (флип)",
      tone: d < 0 && !singular ? "plus" : "ok",
    },
    {
      label: "Обратима ли е?",
      value: singular ? "НЕ — смачкана" : "да",
      tone: singular ? "plus" : "ok",
    },
  ];

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button key={p.label} className={BTN_SEC} disabled={animating} onClick={() => animateTo(p.m)}>
            {p.label}
          </button>
        ))}
        <button className={BTN_PRI} disabled={animating} onClick={() => animateTo(SQUASH)}>
          Смачкай до det = 0 ▶
        </button>
      </div>

      <canvas ref={canvasRef} width={MC_W} height={MC_H} className={STAGE_CLASS} />

      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule sm:grid-cols-4">
        {readout.map((r) => (
          <div key={r.label} className="bg-surface px-3 py-2.5">
            <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">{r.label}</dt>
            <dd
              className={`mt-0.5 text-[15px] font-bold tabular-nums ${r.tone === "plus" ? "text-plus" : r.tone === "ok" ? "text-ok" : "text-minus"}`}
            >
              {r.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
        <div className="min-w-[260px] flex-1">
          <MatrixSliders m={m} onChange={setM} disabled={animating} />
        </div>
        <MatrixDisplay m={m} label="M" highlight />
      </div>

      {singular && (
        <p className="mt-3 rounded-r-lg border-l-4 border-plus bg-hl px-4 py-2.5 text-[15px] leading-relaxed animate-rise">
          <strong className="text-ink">Цялата равнина се смачка в една права.</strong> Различни точки
          се сляха в една — информацията е загубена и никоя матрица не може да я върне.{" "}
          <strong className="text-ink">det = 0 ⇔ необратимост</strong>: това е причината детерминантата
          да е първото нещо, което проверяваме преди да „делим“ на матрица.
        </p>
      )}
    </div>
  );
}
