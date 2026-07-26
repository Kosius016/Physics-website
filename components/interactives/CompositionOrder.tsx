"use client";

import { useEffect, useRef, useState } from "react";
import RichText from "@/components/RichText";
import { BTN_PRI, BTN_SEC, PANEL_CLASS } from "./svg";
import {
  IDENTITY,
  lerpMat,
  MatrixDisplay,
  MatrixScene,
  mul,
  type Mat2,
} from "./matrixCanvas";

const R: Mat2 = [0, -1, 1, 0];
const SH: Mat2 = [1, 0.6, 0, 1];

const SR = mul(SH, R);
const RS = mul(R, SH);

export default function CompositionOrder() {
  const animRef = useRef<number | null>(null);
  const [m, setM] = useState<Mat2>(IDENTITY);
  const [ran, setRan] = useState<"none" | "rs" | "sr">("none");
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const run = (first: Mat2, composed: Mat2, tag: "rs" | "sr") => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setAnimating(true);
    setRan(tag);
    const t0 = performance.now();
    const stepMs = 800;
    const pauseMs = 350;
    const ease = (k: number) => 1 - Math.pow(1 - k, 3);
    const frame = (now: number) => {
      const t = now - t0;
      if (t < stepMs) {
        setM(lerpMat(IDENTITY, first, ease(t / stepMs)));
      } else if (t < stepMs + pauseMs) {
        setM(first);
      } else if (t < 2 * stepMs + pauseMs) {
        setM(lerpMat(first, composed, ease((t - stepMs - pauseMs) / stepMs)));
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

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button className={BTN_PRI} disabled={animating} onClick={() => run(R, SR, "rs")}>
          <RichText text="Първо $R$ (ротация), после $S$ (срязване)" />
        </button>
        <button className={BTN_PRI} disabled={animating} onClick={() => run(SH, RS, "sr")}>
          <RichText text="Първо $S$, после $R$" />
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

      <MatrixScene
        m={m}
        sprite
        ariaLabel="Последователно прилагане на ротация и срязване върху ракета и координатна решетка"
      />

      <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 text-[14px]">
        <MatrixDisplay m={R} label="R" />
        <MatrixDisplay m={SH} label="S" />
        {ran === "rs" && <MatrixDisplay m={SR} label={String.raw`S\!\cdot\!R`} highlight />}
        {ran === "sr" && <MatrixDisplay m={RS} label={String.raw`R\!\cdot\!S`} highlight />}
      </div>

      {ran !== "none" && !animating && (
        <p className="mt-3 rounded-r-lg border-l-4 border-minus bg-hl px-4 py-2.5 text-[15px] leading-relaxed animate-rise">
          <RichText
            text={String.raw`**Забележете реда на записа:** „първо $R$, после $S$“ се записва $S\!\cdot\!R$. Матрицата, приложена първа, стои най-вдясно, както при функциите $S(R(\mathbf{x}))$. Пуснете и другия ред: ракетата завършва на различно място, защото $S\!\cdot\!R\ne R\!\cdot\!S$. Умножението на матрици не е разместимо.`}
          />
        </p>
      )}
    </div>
  );
}
