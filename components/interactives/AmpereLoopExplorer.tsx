"use client";

import { useEffect, useRef, useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import { Arrow, BTN_PRI, BTN_SEC, C, CurrentSymbol, PANEL_CLASS, STAGE_BG, STAGE_CLASS } from "./svg";

const q = (v: number) => Math.round(v * 1000) / 1000;
const CX = 260;
const CY = 205;

/**
 * Извеждането на закона на Ампер, стъпка 2: обхождаме контур около проводника
 * и натрупваме ∮B·dl на живо. Понеже B·dl = (μ₀I/2π)·dφ, приносът на всяко
 * парче зависи само от изметения ъгъл dφ, а не от радиуса:
 *  — по дъгите натрупването върви с постоянна скорост, каквото и да е r;
 *  — по радиалните участъци B ⊥ dl и натрупването спира;
 *  — контур извън тока измита ъгъл напред и после назад — сумата е нула.
 */

type Seg =
  | { kind: "arc"; r: number; from: number; to: number }
  | { kind: "radial"; phi: number; r1: number; r2: number };

type LoopKind = "circle" | "steps" | "outside";

const LOOPS: { id: LoopKind; label: string; segs: Seg[]; hint: string }[] = [
  {
    id: "circle",
    label: "Кръг",
    segs: [{ kind: "arc", r: 110, from: 0, to: 2 * Math.PI }],
    hint: "Натрупването расте равномерно и завършва точно на $\\mu_0 I$ — един пълен изметен ъгъл $2\\pi$.",
  },
  {
    id: "steps",
    label: "Стъпаловиден",
    segs: [
      { kind: "arc", r: 70, from: -Math.PI / 2, to: Math.PI / 2 },
      { kind: "radial", phi: Math.PI / 2, r1: 70, r2: 150 },
      { kind: "arc", r: 150, from: Math.PI / 2, to: (3 * Math.PI) / 2 },
      { kind: "radial", phi: (3 * Math.PI) / 2, r1: 150, r2: 70 },
    ],
    hint: "По радиалните участъци $\\vec B\\perp d\\vec l$ и натрупването спира. Дъгата с голям радиус пълни със същата скорост като малката — крайната стойност е пак $\\mu_0 I$.",
  },
  {
    id: "outside",
    label: "Извън тока",
    segs: [
      { kind: "arc", r: 95, from: -0.85, to: 0.85 },
      { kind: "radial", phi: 0.85, r1: 95, r2: 170 },
      { kind: "arc", r: 170, from: 0.85, to: -0.85 },
      { kind: "radial", phi: -0.85, r1: 170, r2: 95 },
    ],
    hint: "Външната дъга връща изметения ъгъл обратно: натрупаното се покачва и после се връща точно на нула. Контур без ток вътре има нулева циркулация.",
  },
];

/** Точка от параметризацията: φ расте обратно на часовниковата стрелка на екрана. */
const pt = (phi: number, r: number) => ({ x: q(CX + r * Math.cos(phi)), y: q(CY - r * Math.sin(phi)) });

function segLength(s: Seg) {
  return s.kind === "arc" ? s.r * Math.abs(s.to - s.from) : Math.abs(s.r2 - s.r1);
}

/** Позиция, допирателна, радиус и изметен ъгъл при дадена изминала дължина. */
function walk(segs: Seg[], dist: number) {
  let swept = 0;
  for (const s of segs) {
    const len = segLength(s);
    if (dist > len) {
      dist -= len;
      if (s.kind === "arc") swept += s.to - s.from;
      continue;
    }
    const f = len === 0 ? 0 : dist / len;
    if (s.kind === "arc") {
      const phi = s.from + (s.to - s.from) * f;
      const dirSign = s.to >= s.from ? 1 : -1;
      return {
        pos: pt(phi, s.r),
        tan: { x: -Math.sin(phi) * dirSign, y: -Math.cos(phi) * dirSign },
        r: s.r,
        swept: swept + (s.to - s.from) * f,
        onArc: true,
      };
    }
    const r = s.r1 + (s.r2 - s.r1) * f;
    const rd = s.r2 >= s.r1 ? 1 : -1;
    return {
      pos: pt(s.phi, r),
      tan: { x: Math.cos(s.phi) * rd, y: -Math.sin(s.phi) * rd },
      r,
      swept,
      onArc: false,
    };
  }
  const last = segs[segs.length - 1];
  const endSwept = segs.reduce((a, s) => a + (s.kind === "arc" ? s.to - s.from : 0), 0);
  return {
    pos: last.kind === "arc" ? pt(last.to, last.r) : pt(last.phi, last.r2),
    tan: { x: 0, y: 0 },
    r: last.kind === "arc" ? last.r : last.r2,
    swept: endSwept,
    onArc: false,
  };
}

/** Контурът като полилиния за рисуване. */
function loopPolyline(segs: Seg[]) {
  const pts: string[] = [];
  for (const s of segs) {
    const n = s.kind === "arc" ? Math.max(2, Math.ceil((Math.abs(s.to - s.from) * 180) / Math.PI / 4)) : 2;
    for (let i = 0; i <= n; i++) {
      const f = i / n;
      const p = s.kind === "arc" ? pt(s.from + (s.to - s.from) * f, s.r) : pt(s.phi, s.r1 + (s.r2 - s.r1) * f);
      pts.push(`${p.x},${p.y}`);
    }
  }
  return pts.join(" ");
}

export default function AmpereLoopExplorer() {
  const [loop, setLoop] = useState<LoopKind>("circle");
  const [current, setCurrent] = useState(2);
  const [out, setOut] = useState(true);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const frameRef = useRef<number | null>(null);

  const active = LOOPS.find((l) => l.id === loop)!;
  const totalLen = active.segs.reduce((a, s) => a + segLength(s), 0);
  const dir = out ? 1 : -1;
  const k = 0.2 * current; // μ₀I/2π в μT·m на радиан

  const w = walk(active.segs, progress * totalLen);
  const accumulated = dir * k * w.swept; // натрупано ∮B·dl до момента, μT·m
  const encloses = loop !== "outside";
  const target = encloses ? dir * 2 * Math.PI * k : 0; // μ₀·I_обхв

  useEffect(() => () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); }, []);
  useEffect(() => {
    setProgress(0);
    setPlaying(false);
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
  }, [loop]);

  const play = () => {
    if (playing) {
      setPlaying(false);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      return;
    }
    setPlaying(true);
    const startProgress = progress >= 0.995 ? 0 : progress;
    const started = performance.now();
    const duration = 7000 * (1 - startProgress);
    const tick = (now: number) => {
      const p = Math.min(1, startProgress + (now - started) / duration);
      setProgress(p);
      if (p < 1) frameRef.current = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    frameRef.current = requestAnimationFrame(tick);
  };

  // Фонови стрелки на полето (посоката се обръща с тока)
  const fieldArrows = [58, 138].flatMap((radius) =>
    Array.from({ length: radius === 138 ? 14 : 10 }, (_, i) => {
      const count = radius === 138 ? 14 : 10;
      const a = (2 * Math.PI * i) / count;
      const x = CX + radius * Math.cos(a);
      const y = CY + radius * Math.sin(a);
      const tx = Math.sin(a) * dir;
      const ty = -Math.cos(a) * dir;
      return { x1: q(x - tx * 8), y1: q(y - ty * 8), x2: q(x + tx * 8), y2: q(y + ty * 8) };
    }),
  );

  // Изметеният ъгъл като ветрило от проводника (полигон, стъпка 6°)
  const wedge = (() => {
    if (Math.abs(w.swept) < 0.02) return "";
    const steps = Math.max(2, Math.ceil((Math.abs(w.swept) * 180) / Math.PI / 6));
    const pts = [`${CX},${CY}`];
    for (let i = 0; i <= steps; i++) {
      const phi = (w.swept * i) / steps;
      const p = pt(phi, 42);
      pts.push(`${p.x},${p.y}`);
    }
    return pts.join(" ");
  })();

  // dl и B стрелки при ходача
  const dlArrow = { x: w.pos.x + w.tan.x * 30, y: w.pos.y + w.tan.y * 30 };
  const phiHere = Math.atan2(-(w.pos.y - CY), w.pos.x - CX);
  const bDirX = -Math.sin(phiHere) * dir;
  const bDirY = -Math.cos(phiHere) * dir;
  // Дължината на B стрелката следва 1/r — полето е по-слабо на широката дъга
  const bLen = Math.min(44, 14 + 2000 / w.r);
  // По дъгите B ∥ dl — отместваме B радиално навън, за да се виждат и двете
  const bBase = {
    x: w.pos.x + Math.cos(phiHere) * 14,
    y: w.pos.y - Math.sin(phiHere) * 14,
  };

  const fullTurn = 2 * Math.PI * k; // мащаб на лентата: |μ₀I| при пълна обиколка
  const barFill = Math.min(1, Math.abs(accumulated) / fullTurn);

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-2">
        {LOOPS.map((item) => (
          <button key={item.id} type="button" className={loop === item.id ? BTN_SEC + " bg-hl" : BTN_SEC} onClick={() => setLoop(item.id)}>
            {item.label}
          </button>
        ))}
        <button type="button" className={BTN_SEC} onClick={() => setOut((v) => !v)}>Обърнете тока ⇅</button>
        <button type="button" className={BTN_PRI} onClick={play}>{playing ? "Пауза" : progress >= 0.995 ? "Отначало ↻" : "Обходете контура ▶"}</button>
      </div>

      <svg viewBox="0 0 640 400" className={STAGE_CLASS + " select-none"} role="img" aria-label="Обхождане на амперов контур: натрупване на циркулацията на магнитното поле">
        <rect width="640" height="400" fill={STAGE_BG} />
        {Array.from({ length: 27 }, (_, i) => <line key={`v${i}`} x1={i * 25} y1="0" x2={i * 25} y2="400" stroke={C.faint} opacity="0.1" />)}
        {Array.from({ length: 17 }, (_, i) => <line key={`h${i}`} x1="0" y1={i * 25} x2="640" y2={i * 25} stroke={C.faint} opacity="0.1" />)}

        <g opacity="0.5">{fieldArrows.map((a, i) => <Arrow key={i} {...a} color={C.wire} width={1.3} />)}</g>

        {/* Изметеният ъгъл от проводника — сърцето на извеждането */}
        {wedge && <polygon points={wedge} fill={C.warn} fillOpacity="0.16" stroke={C.warn} strokeOpacity="0.4" strokeWidth="1" />}

        <polyline points={loopPolyline(active.segs)} fill="none" stroke={C.warn} strokeWidth="2.6" strokeDasharray="8 5" />

        {/* Ходачът: dl по контура и B на полето в тази точка */}
        <Arrow x1={w.pos.x} y1={w.pos.y} x2={q(dlArrow.x)} y2={q(dlArrow.y)} color={C.warn} width={2.6} texLabel="d\vec l" texLabelDx={-Math.cos(phiHere) * 21} texLabelDy={Math.sin(phiHere) * 21 + 5} />
        <Arrow x1={q(bBase.x)} y1={q(bBase.y)} x2={q(bBase.x + bDirX * bLen)} y2={q(bBase.y + bDirY * bLen)} color={C.minus} width={2.6} texLabel="\vec B" texLabelDx={Math.cos(phiHere) * 10} texLabelDy={-Math.sin(phiHere) * 10 - 2} />
        <circle cx={w.pos.x} cy={w.pos.y} r="6.5" fill={C.wire} stroke={STAGE_BG} strokeWidth="2" />

        <CurrentSymbol x={CX} y={CY} out={out} r={16} color={out ? C.plus : C.minus} texLabel="I" />
        <text x="24" y="34" fill={C.mut} fontSize="13" fontWeight="700">{w.onArc ? "ПО ДЪГАТА: B ∥ dl → ПРИНОСЪТ СЕ ТРУПА" : progress > 0 && progress < 1 ? "РАДИАЛНО: B ⊥ dl → ПРИНОС НУЛА" : "ОБХОДЕТЕ КОНТУРА И СЛЕДЕТЕ НАТРУПВАНЕТО"}</text>
        {Math.abs(w.swept) > 0.45 && (
          <SvgTex x={q(CX + 60 * Math.cos(w.swept / 2))} y={q(CY - 60 * Math.sin(w.swept / 2))} tex="\varphi" color={C.warn} fontSize={13} width={26} anchor="middle" />
        )}
      </svg>

      {/* Лентата на натрупването */}
      <div className="mt-3">
        <div className="flex items-baseline justify-between text-[12px] font-semibold text-muted">
          <span>Натрупано <RichText text="$\oint\vec B\cdot d\vec l$" /></span>
          <span>Целта: <RichText text={String.raw`$\mu_0I_{\text{обхв}}=${target.toFixed(2)}\,\mu\mathrm{T{\cdot}m}$`} /></span>
        </div>
        <div className="mt-1 h-3 overflow-hidden rounded-full border border-ink/40 bg-hl">
          <div
            className="h-full rounded-full"
            style={{
              width: `${barFill * 100}%`,
              background: accumulated * (encloses ? dir : 1) >= -1e-9 ? "var(--color-ok)" : "var(--color-plus)",
              transition: playing ? "none" : "width 150ms ease-out",
            }}
          />
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule min-[440px]:grid-cols-3">
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Обхванат ток</dt>
          <dd className={`mt-0.5 text-[15px] font-bold tabular-nums ${encloses ? "text-ok" : "text-plus"}`}>
            <RichText text={String.raw`$I_{\text{обхв}}=${encloses ? (dir * current).toFixed(1) : "0.0"}\,\mathrm{A}$`} />
          </dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Изметен ъгъл</dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-minus">
            <RichText text={String.raw`$\varphi=${((w.swept * 180) / Math.PI).toFixed(0)}^\circ$`} />
          </dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Натрупано</dt>
          <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-ok">
            <RichText text={String.raw`$${accumulated.toFixed(3)}\,\mu\mathrm{T{\cdot}m}$`} />
          </dd>
        </div>
      </dl>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-[13px] font-medium text-muted">
          <span className="flex justify-between"><span>Докъде е обходено</span><strong className="text-minus">{(progress * 100).toFixed(0)}%</strong></span>
          <input className="w-full accent-(--color-minus)" type="range" min="0" max="1" step="0.002" value={progress} onChange={(e) => { setPlaying(false); if (frameRef.current) cancelAnimationFrame(frameRef.current); setProgress(+e.target.value); }} />
        </label>
        <label className="text-[13px] font-medium text-muted">
          <span className="flex justify-between"><span>Ток <RichText text="$I$" /></span><strong className="text-minus"><RichText text={`$${current.toFixed(1)}\\,\\mathrm{A}$`} /></strong></span>
          <input className="w-full accent-(--color-minus)" type="range" min="0.5" max="5" step="0.1" value={current} onChange={(e) => setCurrent(+e.target.value)} />
        </label>
      </div>

      <p className="mt-3 text-[13.5px] text-muted"><RichText text={active.hint} /></p>
      {loop !== "circle" && encloses && (
        <p className="mt-1.5 text-[13.5px] text-muted"><RichText text="Сравнете с кръга: **крайната стойност е същата**. Циркулацията зависи само от обхванатия ток, не от формата на контура." /></p>
      )}
    </div>
  );
}
