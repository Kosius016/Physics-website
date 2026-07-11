"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SimulationProps } from "@/lib/types";

/**
 * Симулация "движение под ъгъл" (projectile motion).
 * Очаквани параметри: v0 (m/s), theta (градуси).
 * Рисува върху тъмен canvas (контраст с хартиената страница, като в прототипа).
 */

const G = 9.8;
const W = 640;
const H = 420;
const GROUND_Y = H - 40;
const ORIGIN_X = 50;
const MAX_TRACES = 5;

// Цветове върху тъмната сцена
const STAGE_BG = "#0e1420";
const GROUND = "rgba(255,255,255,0.55)";
const TICK = "rgba(255,255,255,0.25)";
const TICK_LABEL = "rgba(255,255,255,0.55)";
const TRACE = "rgba(95,168,245,0.28)";
const CURRENT = "rgba(95,168,245,0.85)";
const COMPARE = "rgba(232,86,63,0.85)";

interface Trace {
  v0: number;
  theta: number;
}

function computeStats(v0: number, thetaDeg: number) {
  const theta = (thetaDeg * Math.PI) / 180;
  const vx = v0 * Math.cos(theta);
  const vy = v0 * Math.sin(theta);
  const T = (2 * vy) / G;
  const Hmax = (vy * vy) / (2 * G);
  const R = (v0 * v0 * Math.sin(2 * theta)) / G;
  return { vx, vy, T, Hmax, R };
}

export default function ProjectileMotion({ params }: SimulationProps) {
  const v0 = params.v0 ?? 20;
  const theta = params.theta ?? 45;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const [traces, setTraces] = useState<Trace[]>([]);
  const [compareV0, setCompareV0] = useState<number | null>(null);

  const stats = computeStats(v0, theta);

  const draw = useCallback(
    (animT: number | null) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      // Мащаб: максималният възможен обхват за текущото v0 (при 45°) да се събира.
      const maxR = (v0 * v0) / G;
      const usableWidth = W - ORIGIN_X - 30;
      const pxPerMeter = Math.max(2, Math.min(14, usableWidth / Math.max(maxR, 10)));

      const toPx = (xm: number, ym: number): [number, number] => [
        ORIGIN_X + xm * pxPerMeter,
        GROUND_Y - ym * pxPerMeter,
      ];

      const drawTrajectory = (
        tv0: number,
        tThetaDeg: number,
        color: string,
        lineWidth: number,
        dashed: boolean,
      ) => {
        const th = (tThetaDeg * Math.PI) / 180;
        const vx = tv0 * Math.cos(th);
        const vy0 = tv0 * Math.sin(th);
        const T = (2 * vy0) / G;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.setLineDash(dashed ? [5, 5] : []);
        const steps = 80;
        for (let i = 0; i <= steps; i++) {
          const t = (T * i) / steps;
          const x = vx * t;
          const y = Math.max(vy0 * t - 0.5 * G * t * t, 0);
          const [px, py] = toPx(x, y);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      };

      // Тъмен фон, земя и маркери за разстояние
      ctx.fillStyle = STAGE_BG;
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = GROUND;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y);
      ctx.lineTo(W, GROUND_Y);
      ctx.stroke();

      ctx.fillStyle = TICK_LABEL;
      ctx.font = "11px sans-serif";
      for (let m = 0; m < 400; m += 5) {
        const [px] = toPx(m, 0);
        if (px > W - 10) break;
        ctx.beginPath();
        ctx.moveTo(px, GROUND_Y);
        ctx.lineTo(px, GROUND_Y + 6);
        ctx.strokeStyle = TICK;
        ctx.lineWidth = 1;
        ctx.stroke();
        if (m % 10 === 0) ctx.fillText(m + "m", px - 8, GROUND_Y + 20);
      }

      // Бледи следи от предишни изстрелвания
      for (const tr of traces) {
        drawTrajectory(tr.v0, tr.theta, TRACE, 2, false);
      }

      // Сравнителна траектория при 45°
      if (compareV0 !== null) {
        drawTrajectory(compareV0, 45, COMPARE, 2, true);
      }

      // Текуща траектория (preview)
      drawTrajectory(v0, theta, CURRENT, 2, false);

      // Анимирано тяло
      if (animT !== null) {
        const th = (theta * Math.PI) / 180;
        const vx = v0 * Math.cos(th);
        const vy0 = v0 * Math.sin(th);
        const x = vx * animT;
        const y = Math.max(vy0 * animT - 0.5 * G * animT * animT, 0);
        const [px, py] = toPx(x, y);
        ctx.beginPath();
        ctx.arc(px, py, 7, 0, 2 * Math.PI);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.strokeStyle = STAGE_BG;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    },
    [v0, theta, traces, compareV0],
  );

  // Прерисуване при промяна на параметри/следи; спира текуща анимация.
  useEffect(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    draw(null);
  }, [draw]);

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const launch = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const { T } = computeStats(v0, theta);
    const start = performance.now();
    // Мащабирана скорост на възпроизвеждане, ограничена за удобство.
    const duration = Math.min(Math.max((T * 1000) / 2, 900), 3500);

    const frame = (now: number) => {
      const elapsed = (now - start) / duration;
      draw(Math.min(elapsed, 1) * T);
      if (elapsed < 1) {
        animRef.current = requestAnimationFrame(frame);
      } else {
        animRef.current = null;
        setTraces((prev) => [...prev, { v0, theta }].slice(-MAX_TRACES));
      }
    };
    animRef.current = requestAnimationFrame(frame);
  };

  const readout: { label: string; value: string }[] = [
    { label: "T (време на полет)", value: stats.T.toFixed(2) + " s" },
    { label: "H (макс. височина)", value: stats.Hmax.toFixed(2) + " m" },
    { label: "R (обхват)", value: stats.R.toFixed(2) + " m" },
    { label: "v₀x / v₀y", value: stats.vx.toFixed(1) + " / " + stats.vy.toFixed(1) + " m/s" },
  ];

  const secondaryBtn =
    "cursor-pointer rounded-lg border-[1.5px] border-ink bg-surface px-3.5 py-2 text-[13.5px] font-semibold text-ink shadow-hard-sm transition-colors hover:bg-hl active:translate-x-px active:translate-y-px active:shadow-none";

  return (
    <div className="flex flex-col gap-4">
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="block h-auto w-full rounded-[10px] border-[1.5px] border-ink"
      />

      <div className="flex flex-wrap gap-2.5">
        <button
          onClick={launch}
          className="cursor-pointer rounded-lg border-[1.5px] border-ink bg-ink px-4 py-2 text-[13.5px] font-bold text-white shadow-hard-sm transition-opacity hover:opacity-90 active:translate-x-px active:translate-y-px active:shadow-none"
        >
          Изстрелвай ▶
        </button>
        <button
          onClick={() => {
            setTraces([]);
            setCompareV0(null);
          }}
          className={secondaryBtn}
        >
          Изчисти следите
        </button>
        <button onClick={() => setCompareV0(v0)} className={secondaryBtn}>
          Сравни с 45°
        </button>
      </div>

      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule sm:grid-cols-4">
        {readout.map((r) => (
          <div key={r.label} className="bg-surface px-3 py-2.5">
            <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">
              {r.label}
            </dt>
            <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-minus">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
