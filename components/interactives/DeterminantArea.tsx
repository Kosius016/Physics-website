"use client";

import { useEffect, useRef, useState } from "react";
import RichText from "@/components/RichText";
import { BTN_PRI, BTN_SEC, PANEL_CLASS } from "./svg";
import {
  det,
  lerpMat,
  MatrixDisplay,
  MatrixScene,
  MatrixSliders,
  texNumber,
  type Mat2,
} from "./matrixCanvas";

const PRESETS: { label: string; m: Mat2 }[] = [
  { label: "Единична", m: [1, 0, 0, 1] },
  { label: "Мащаб $\\times 1{,}5$", m: [1.5, 0, 0, 1.5] },
  { label: "Срязване ($\\det M=1$)", m: [1, 0.8, 0, 1] },
  { label: "Ротация ($\\det M=1$)", m: [0.71, -0.71, 0.71, 0.71] },
  { label: "Огледало ($\\det M=-1$)", m: [-1, 0, 0, 1] },
];

const SQUASH: Mat2 = [1, 0.6, 0.5, 0.3];

export default function DeterminantArea() {
  const animRef = useRef<number | null>(null);
  const [m, setM] = useState<Mat2>([1.2, 0.4, 0.2, 1.1]);
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
    {
      label: "$\\det M=ad-bc$",
      value: String.raw`$\det M=${texNumber(d)}$`,
      tone: singular ? "plus" : undefined,
    },
    {
      label: "Площ на образа",
      value: String.raw`$|\det M|=${texNumber(Math.abs(d))}$`,
    },
    {
      label: "Ориентация",
      value: singular ? "няма" : d > 0 ? "запазена" : "обърната (флип)",
      tone: d < 0 && !singular ? "plus" : "ok",
    },
    {
      label: "Обратима ли е?",
      value: singular ? "не, смачкана е" : "да",
      tone: singular ? "plus" : "ok",
    },
  ];

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
        <button className={BTN_PRI} disabled={animating} onClick={() => animateTo(SQUASH)}>
          <RichText text="Смачкай до $\det M=0$" />
        </button>
      </div>

      <MatrixScene
        m={m}
        checker
        square
        ariaLabel="Образ на единичния квадрат при матрична трансформация"
      />

      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule sm:grid-cols-4">
        {readout.map((item) => (
          <div key={item.label} className="bg-surface px-3 py-2.5">
            <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">
              <RichText text={item.label} />
            </dt>
            <dd
              className={`mt-0.5 text-[15px] font-bold tabular-nums ${
                item.tone === "plus" ? "text-plus" : item.tone === "ok" ? "text-ok" : "text-minus"
              }`}
            >
              <RichText text={item.value} />
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
          <RichText text="**Цялата равнина се смачква в една права.** Различни точки се сливат в една: информацията е загубена и никоя матрица не може да я върне. Затова $\det M=0\iff$ необратимост." />
        </p>
      )}
    </div>
  );
}
