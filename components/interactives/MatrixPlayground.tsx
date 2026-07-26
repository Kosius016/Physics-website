"use client";

import { useEffect, useRef, useState } from "react";
import RichText from "@/components/RichText";
import { BTN_SEC, PANEL_CLASS } from "./svg";
import {
  det,
  IDENTITY,
  lerpMat,
  MatrixDisplay,
  MatrixScene,
  MatrixSliders,
  texNumber,
  type Mat2,
} from "./matrixCanvas";

const PRESETS: { label: string; m: Mat2 }[] = [
  { label: "Единична", m: [1, 0, 0, 1] },
  { label: "Ротация $45^\\circ$", m: [0.71, -0.71, 0.71, 0.71] },
  { label: "Ротация $90^\\circ$", m: [0, -1, 1, 0] },
  { label: "Мащаб $\\times 1{,}5$", m: [1.5, 0, 0, 1.5] },
  { label: "Срязване", m: [1, 0.6, 0, 1] },
  { label: "Огледало", m: [-1, 0, 0, 1] },
  { label: "Проекция (смачкване)", m: [1, 0.5, 0, 0] },
];

export default function MatrixPlayground() {
  const animRef = useRef<number | null>(null);
  const [m, setM] = useState<Mat2>(IDENTITY);
  const [animating, setAnimating] = useState(false);

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
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            className={BTN_SEC}
            disabled={animating}
            onClick={() => animateTo(preset.m)}
          >
            <RichText text={preset.label} />
          </button>
        ))}
      </div>

      <MatrixScene
        m={m}
        sprite
        square
        ariaLabel="Матрична трансформация на координатна решетка, базисни вектори и ракета"
      />

      <div className="mt-4 flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
        <div className="min-w-[260px] flex-1">
          <MatrixSliders m={m} onChange={setM} disabled={animating} />
        </div>
        <div className="flex flex-col gap-2 text-[14px]">
          <MatrixDisplay m={m} label="M" highlight />
          <div className="text-muted">
            <RichText
              text={String.raw`$\hat{\imath}\mapsto\left(${texNumber(m[0])},${texNumber(m[2])}\right),\qquad \hat{\jmath}\mapsto\left(${texNumber(m[1])},${texNumber(m[3])}\right)$`}
            />
          </div>
          <div className={Math.abs(d) < 0.03 ? "text-plus" : "text-minus"}>
            <RichText text={String.raw`$\det M=${texNumber(d)}$`} />
            <span className="ml-2 text-[12.5px] text-muted">
              (площта е тема на следващия урок)
            </span>
          </div>
        </div>
      </div>

      <p className="mt-3 text-[13.5px] text-muted">
        <RichText text="Червената и зелената стрелка са образите на базисните вектори $\hat{\imath}$ и $\hat{\jmath}$: те са **колоните на матрицата**. Жълтият контур е образът на единичния квадрат. Опитайте „Проекция“ и наблюдавайте какво губи картинката." />
      </p>
    </div>
  );
}
