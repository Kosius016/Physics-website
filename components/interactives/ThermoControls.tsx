"use client";
import { useEffect, useId, useState, type ReactNode } from "react";
import RichText from "@/components/RichText";
import { BTN_PRI, PANEL_CLASS, STAGE_BG, STAGE_CLASS, DRAWING_FONT_FAMILY } from "./svg";

export const formatThermo = (value: number, digits = 1) => (Math.abs(value) < 1e-9 ? 0 : value).toFixed(digits).replace(".", "{,}");
export function ThermoPanel({ title, children }: { title: string; children: ReactNode }) {
  return <figure data-thermo-lab className={PANEL_CLASS + " my-5 min-w-0"}>
    <figcaption className="mb-4 font-serif text-xl font-semibold">{title}</figcaption>{children}
  </figure>;
}
export function ThermoScene({ title, children, height = 250 }: { title: string; children: ReactNode; height?: number }) {
  return <svg viewBox={"0 0 400 " + height} className={STAGE_CLASS} style={{ fontFamily: DRAWING_FONT_FAMILY }} role="img" aria-label={title}>
    <title>{title}</title><rect width={400} height={height} fill={STAGE_BG} />{children}
  </svg>;
}
export function ThermoSlider({ label, value, min, max, step = 1, onChange }: { label: string; value: number; min: number; max: number; step?: number; onChange: (value: number) => void }) {
  const id = useId();
  return <div className="mt-4 min-w-0"><label htmlFor={id} className="block text-sm font-semibold"><RichText text={label} /></label>
    <input id={id} className="mt-2 block w-full accent-minus" type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} />
  </div>;
}
export function ThermoReadout({ items }: { items: [string, string][] }) {
  return <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-rule bg-rule">
    {items.map(([label, tex]) => <div key={label} className="min-w-0 bg-surface px-3 py-2">
      <dt className="text-xs text-muted">{label}</dt><dd className="mt-1 overflow-x-auto text-sm font-semibold"><RichText text={"$" + tex + "$"} /></dd>
    </div>)}
  </dl>;
}
export function useThermoMotion(duration = 8) {
  const [phase, setPhase] = useState(0), [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setPlaying(false); setPhase(p => (p + 0.125) % 1); return; }
    let frame = 0, previous: number | undefined;
    function tick(now: number) {
      if (previous !== undefined) { const delta = Math.min(now - previous, 50) / (1000 * duration); setPhase(p => (p + delta) % 1); }
      previous = now; frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, duration]);
  const seek = (p: number) => { setPlaying(false); setPhase(p); };
  return { phase, seek, playing, toggle: () => setPlaying(p => !p) };
}
export function MotionControls({ motion }: { motion: ReturnType<typeof useThermoMotion> }) {
  return <div className="mt-4">
    <button type="button" className={BTN_PRI} onClick={motion.toggle}>{motion.playing ? "Пауза" : "Пуснете движението"}</button>
    <ThermoSlider label={"Фаза на движението: $" + formatThermo(motion.phase * 100, 0) + "\\%$"} value={motion.phase} min={0} max={1} step={0.005} onChange={motion.seek} />
  </div>;
}
