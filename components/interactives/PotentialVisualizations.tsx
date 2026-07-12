"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Charge = { x: number; y: number; q: 1 | -1 };

function canvasPoint(canvas: HTMLCanvasElement, event: React.PointerEvent<HTMLCanvasElement>) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) * canvas.width) / rect.width,
    y: ((event.clientY - rect.top) * canvas.height) / rect.height,
  };
}

export function PotentialMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragged = useRef<number | null>(null);
  const [charges, setCharges] = useState<Charge[]>([
    { x: 274, y: 240, q: 1 },
    { x: 446, y: 240, q: -1 },
  ]);
  const [vectors, setVectors] = useState(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const { width: w, height: h } = canvas;
    const potential = (x: number, y: number) =>
      charges.reduce((sum, c) => sum + c.q / Math.max(12, Math.hypot(x - c.x, y - c.y)), 0);

    for (let y = 0; y < h; y += 5) {
      for (let x = 0; x < w; x += 5) {
        const value = Math.max(-1, Math.min(1, potential(x + 2.5, y + 2.5) * 22));
        const band = Math.round(value * 9) / 9;
        const a = Math.abs(band);
        ctx.fillStyle = band >= 0
          ? `rgb(${30 + 215 * a},${28 + 120 * a},${40 + 20 * a})`
          : `rgb(${30 + 10 * a},${28 + 120 * a},${40 + 200 * a})`;
        ctx.fillRect(x, y, 5, 5);
      }
    }
    if (vectors) {
      ctx.strokeStyle = "rgba(255,255,255,.88)";
      ctx.fillStyle = "rgba(255,255,255,.88)";
      ctx.lineWidth = 1.3;
      for (let y = 28; y < h; y += 48) for (let x = 28; x < w; x += 48) {
        let ex = 0, ey = 0;
        charges.forEach((c) => {
          const dx = x - c.x, dy = y - c.y;
          const r2 = Math.max(200, dx * dx + dy * dy), r = Math.sqrt(r2);
          ex += c.q * dx / (r2 * r); ey += c.q * dy / (r2 * r);
        });
        const m = Math.hypot(ex, ey); if (m < 1e-9) continue;
        ex /= m; ey /= m;
        ctx.beginPath(); ctx.moveTo(x - ex * 10, y - ey * 10); ctx.lineTo(x + ex * 10, y + ey * 10); ctx.stroke();
        ctx.beginPath(); ctx.arc(x + ex * 10, y + ey * 10, 2.6, 0, Math.PI * 2); ctx.fill();
      }
    }
    charges.forEach((c) => {
      ctx.beginPath(); ctx.arc(c.x, c.y, 15, 0, Math.PI * 2);
      ctx.fillStyle = c.q > 0 ? "#e8563f" : "#3d7be0"; ctx.fill();
      ctx.strokeStyle = "white"; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.fillStyle = "white"; ctx.font = "bold 18px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(c.q > 0 ? "+" : "−", c.x, c.y + 1);
    });
  }, [charges, vectors]);

  useEffect(() => draw(), [draw]);
  const preset = (kind: "dipole" | "quad") => setCharges(kind === "dipole" ? [
    { x: 274, y: 240, q: 1 }, { x: 446, y: 240, q: -1 },
  ] : [
    { x: 255, y: 165, q: 1 }, { x: 465, y: 165, q: -1 },
    { x: 255, y: 315, q: -1 }, { x: 465, y: 315, q: 1 },
  ]);

  return <div className="rounded-xl border-[1.5px] border-ink bg-surface p-3.5 shadow-hard">
    <canvas ref={canvasRef} width={720} height={480} aria-label="Интерактивна карта на електростатичния потенциал" className="block aspect-[3/2] w-full touch-none rounded-lg border-[1.5px] border-ink bg-ink"
      onPointerDown={(e) => { const p = canvasPoint(e.currentTarget, e); dragged.current = charges.findIndex((c) => Math.hypot(p.x - c.x, p.y - c.y) < 28); e.currentTarget.setPointerCapture(e.pointerId); }}
      onPointerMove={(e) => { if (dragged.current === null || dragged.current < 0) return; const p = canvasPoint(e.currentTarget, e); setCharges((old) => old.map((c, i) => i === dragged.current ? { ...c, x: Math.max(15, Math.min(705, p.x)), y: Math.max(15, Math.min(465, p.y)) } : c)); }}
      onPointerUp={() => { dragged.current = null; }} />
    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
      <button type="button" onClick={() => setCharges((c) => [...c, { x: 360, y: 200, q: 1 }])} className="rounded-md border-[1.5px] border-ink bg-ink px-3 py-1.5 font-semibold text-white">+ заряд</button>
      <button type="button" onClick={() => setCharges((c) => [...c, { x: 360, y: 280, q: -1 }])} className="rounded-md border-[1.5px] border-ink bg-surface px-3 py-1.5 font-semibold">− заряд</button>
      <button type="button" onClick={() => preset("dipole")} className="rounded-md border border-rule px-3 py-1.5">Дипол</button>
      <button type="button" onClick={() => preset("quad")} className="rounded-md border border-rule px-3 py-1.5">Квадрупол</button>
      <button type="button" onClick={() => setCharges([])} className="rounded-md border border-rule px-3 py-1.5">Изчисти</button>
      <label className="ml-auto flex items-center gap-2"><input type="checkbox" checked={vectors} onChange={(e) => setVectors(e.target.checked)} /> вектори E</label>
    </div>
    <p className="mt-2 text-[13px] leading-relaxed text-muted">Влачи зарядите. Цветните граници са еквипотенциали; включи векторите и провери, че полето ги пресича перпендикулярно.</p>
  </div>;
}

export function ChargedSphereGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [radius, setRadius] = useState(30);
  const [charge, setCharge] = useState(6);
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d"); if (!ctx) return;
    const w = 720, h = 410, left = 58, right = 700, top = 22, bottom = 370, mid = 205;
    ctx.fillStyle = "#0e1420"; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(255,255,255,.14)"; ctx.lineWidth = 1;
    for (let i = 0; i <= 8; i++) { const x = left + (right-left)*i/8; ctx.beginPath(); ctx.moveTo(x,top); ctx.lineTo(x,bottom); ctx.stroke(); }
    ctx.strokeStyle = "rgba(255,255,255,.65)"; ctx.beginPath(); ctx.moveTo(left,mid); ctx.lineTo(right,mid); ctx.stroke();
    const X = (r: number) => left + (right-left)*r/100;
    ctx.fillStyle = charge >= 0 ? "rgba(232,86,63,.16)" : "rgba(61,123,224,.16)"; ctx.fillRect(left, top, X(radius)-left, bottom-top);
    ctx.setLineDash([5,4]); ctx.beginPath(); ctx.moveTo(X(radius),top); ctx.lineTo(X(radius),bottom); ctx.stroke(); ctx.setLineDash([]);
    const plot = (fn: (r:number)=>number, scale:number, color:string) => { ctx.strokeStyle=color; ctx.lineWidth=3; ctx.beginPath(); for(let r=1;r<=100;r+=.5){ const y=Math.max(top,Math.min(bottom,mid-fn(r)*scale)); r===1?ctx.moveTo(X(r),y):ctx.lineTo(X(r),y); } ctx.stroke(); };
    plot((r) => r < radius ? 0 : charge*radius*radius/(r*r), 2.2, "#e8563f");
    plot((r) => r < radius ? charge*radius : charge*radius*radius/r, .55, "#5fa8f5");
    ctx.font="600 15px sans-serif"; ctx.fillStyle="#e8563f"; ctx.fillText("E(r)",625,48); ctx.fillStyle="#5fa8f5"; ctx.fillText("V(r)",625,70);
    ctx.fillStyle="rgba(255,255,255,.8)"; ctx.font="13px sans-serif"; ctx.fillText("r = R",X(radius)+6,355); ctx.fillText("r →",670,225);
  }, [radius, charge]);
  return <div className="rounded-xl border-[1.5px] border-ink bg-surface p-3.5 shadow-hard">
    <canvas ref={canvasRef} width={720} height={410} aria-label="Графика на полето и потенциала на заредена сфера" className="block aspect-[72/41] w-full rounded-lg border-[1.5px] border-ink bg-ink" />
    <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
      <label className="flex items-center gap-2">Радиус R <input className="min-w-0 flex-1 accent-minus" type="range" min="15" max="45" value={radius} onChange={(e) => setRadius(+e.target.value)} /><strong>{radius}</strong></label>
      <label className="flex items-center gap-2">Заряд Q <input className="min-w-0 flex-1 accent-minus" type="range" min="-10" max="10" value={charge} onChange={(e) => setCharge(+e.target.value)} /><strong>{charge > 0 ? "+" : ""}{charge}</strong></label>
    </div>
    <p className="mt-2 text-[13px] leading-relaxed text-muted">Червено: E е нула вътре и скача на повърхността. Синьо: V е плато вътре и остава непрекъснат.</p>
  </div>;
}
