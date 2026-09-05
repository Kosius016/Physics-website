"use client";

import { useEffect, useRef, useState, type ReactNode, type PointerEvent } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import { Stage, StageScroll, Readouts, RangeControl, Toggle, Legend, dec } from "./acPlot";
import { Arrow, C, PANEL_CLASS, STAGE_CLASS, TexChip, BTN_PRI, BTN_SEC } from "./svg";

type V = [number, number];
const ORIGIN: V = [280, 220];
const ZERO: V = [0, 0];
const BASE: V = [3, 2];
const OTHER: V = [1, 3];
const SCALE = 22;
const WIDTH = 560;
const HEIGHT = 420;
const FLIGHT_DURATION = 10;
const VELOCITY_SCALE = 8;
const DRONE_PRESETS = [
  { label: "Страничен вятър", speed: 12, heading: 90, windSpeed: 4, windHeading: 0 },
  { label: "Насрещен вятър", speed: 12, heading: 70, windSpeed: 5, windHeading: 250 },
  { label: "Попътен вятър", speed: 10, heading: 45, windSpeed: 4, windHeading: 45 },
] as const;
const clamp = (v: number, limit: number) => Math.max(-limit, Math.min(limit, Math.round(v * 2) / 2));
const cleanZero = (value: number) => Math.abs(value) < 1e-10 ? 0 : value;
const radians = (degrees: number) => degrees * Math.PI / 180;
const angle = ([x, y]: V) => (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
const sum = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1]];
const point = (v: V): V => [ORIGIN[0] + SCALE * v[0], ORIGIN[1] - SCALE * v[1]];

function Vector({ v, from = ZERO, color, dashed = false }: { v: V; from?: V; color: string; dashed?: boolean }) {
  const p = point(from), q = point(sum(from, v));
  return Math.hypot(...v) < 1e-8 ? <circle cx={p[0]} cy={p[1]} r={4} fill={color} /> : <Arrow x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} color={color} dashed={dashed} />;
}

function Axes() {
  return <g><Arrow x1={30} y1={220} x2={525} y2={220} color={C.faint} /><Arrow x1={280} y1={390} x2={280} y2={55} color={C.faint} /><SvgTex x={536} y={220} tex="x" width={20} color={C.mut} /><SvgTex x={280} y={43} tex="y" width={20} color={C.mut} anchor="middle" /><TexChip x={265} y={237} tex="O" width={14} color={C.mut} anchor="middle" /></g>;
}

function Scene({ title, children }: { title: string; children: ReactNode }) {
  return <StageScroll minWidth={330}><svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className={STAGE_CLASS} aria-label={title}><Stage w={WIDTH} h={HEIGHT} title={title} /><Axes />{children}</svg></StageScroll>;
}

function Handle({ v, from = ZERO, onChange, name, color, limit }: { v: V; from?: V; onChange: (v: V) => void; name: string; color: string; limit: number }) {
  const p = point(sum(v, from));
  function move(e: PointerEvent<SVGCircleElement>) {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    const svg = e.currentTarget.ownerSVGElement!;
    const matrix = svg.getScreenCTM();
    if (!matrix) return;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(matrix.inverse());
    onChange([clamp((p.x - ORIGIN[0]) / SCALE - from[0], limit), clamp((ORIGIN[1] - p.y) / SCALE - from[1], limit)]);
  }
  return <g><circle cx={p[0]} cy={p[1]} r={6} fill={color} /><circle cx={p[0]} cy={p[1]} r={24} fill="transparent" style={{ touchAction: "none", cursor: "grab" }} role="button" tabIndex={0} aria-label={name} onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); }} onPointerMove={move} onPointerUp={e => e.currentTarget.releasePointerCapture(e.pointerId)} onKeyDown={e => { const delta: Record<string, V> = { ArrowLeft: [-0.5, 0], ArrowRight: [0.5, 0], ArrowUp: [0, 0.5], ArrowDown: [0, -0.5] }; if (delta[e.key]) { e.preventDefault(); onChange([clamp(v[0] + delta[e.key][0], limit), clamp(v[1] + delta[e.key][1], limit)]); } }} /></g>;
}

function Controls({ name, v, set, limit }: { name: string; v: V; set: (v: V) => void; limit: number }) {
  return <div className="mt-4 grid gap-3 sm:grid-cols-2">{([0, 1] as const).map(i => <RangeControl key={i} label={<RichText text={`$${name}_${i === 0 ? "x" : "y"}$`} />} value={v[i]} min={-limit} max={limit} step={0.5} valueTex={dec(v[i], 1)} onChange={n => set(i === 0 ? [n, v[1]] : [v[0], n])} />)}</div>;
}

export function ForceResultantLab() {
  const [theta, setTheta] = useState(90);
  const a: V = [5, 0], b: V = [5 * Math.cos(theta * Math.PI / 180), 5 * Math.sin(theta * Math.PI / 180)];
  const c = sum(a, b), magnitude = Math.hypot(...c);
  return <div className={PANEL_CLASS} aria-label="Изследване на две сили"><Scene title="РЕЗУЛТАНТНА НА ДВЕ СИЛИ"><circle cx={280} cy={220} r={12} fill={C.faint} /><Vector v={b} from={a} color={C.faint} dashed /><Vector v={c} color={C.ok} /><Vector v={a} color={C.minus} /><Vector v={b} color={C.warn} /></Scene><Legend items={[{ color: C.minus, tex: "$\\vec F_1$" }, { color: C.warn, tex: "$\\vec F_2$" }, { color: C.ok, tex: "$\\vec R$" }]} /><div className="mt-4"><RangeControl label="Ъгъл между силите" value={theta} min={0} max={180} step={1} valueTex={`${theta}^\\circ`} onChange={setTheta} /></div><Readouts cells={[{ label: "Първа сила", tex: "F_1=5\\,\\mathrm{N}" }, { label: "Втора сила", tex: "F_2=5\\,\\mathrm{N}" }, { label: "Резултантна", tex: `R=${dec(magnitude)}\\,\\mathrm{N}` }]} cols={3} /><p className="mt-3 text-sm text-muted">Променете ъгъла. При съвпадение стрелките се покриват; зелената резултантна достига два пъти по-далеч. При компенсация тя става точка.</p></div>;
}

export function VectorComponentsLab() {
  const [v, setV] = useState<V>([4, 3]);
  const p = point(v), m = Math.hypot(...v);
  const quadrant = !m ? "Начало" : !v[0] || !v[1] ? "Върху ос" : v[0] > 0 ? v[1] > 0 ? "I квадрант" : "IV квадрант" : v[1] > 0 ? "II квадрант" : "III квадрант";
  return <div className={PANEL_CLASS} aria-label="Изследване на компоненти"><Scene title="КОМПОНЕНТИ НА ВЕКТОРА"><path d={`M ${p[0]} 220 L ${p[0]} ${p[1]} L 280 ${p[1]}`} fill="none" stroke={C.faint} strokeDasharray="5 5" /><Vector v={[v[0], 0]} color={C.warn} /><Vector v={[0, v[1]]} color={C.plus} /><Vector v={v} color={C.minus} /><Handle v={v} onChange={setV} name="Край на вектора, използвайте стрелките" color={C.minus} limit={6} /></Scene><Legend items={[{ color: C.minus, tex: "$\\vec a$" }, { color: C.warn, tex: "$a_x\\hat i$" }, { color: C.plus, tex: "$a_y\\hat j$" }]} /><p className="mt-3 text-sm text-muted">Плъзнете точката или използвайте стрелките на клавиатурата и двата плъзгача. Компонентите в тази геометрична сцена са в условни единици.</p><Controls name="a" v={v} set={setV} limit={6} /><p className="mt-3"><RichText text={`$\\vec a=${dec(v[0], 1)}\\,\\hat i${v[1] < 0 ? "-" : "+"}${dec(Math.abs(v[1]), 1)}\\,\\hat j$`} /></p><Readouts cells={[{ label: "Големина", tex: `a=${dec(m)}` }, { label: "Посока", tex: m ? `\\alpha=${dec(angle(v), 1)}^\\circ` : "\\text{не е определена}" }]} /><p className="mt-2 text-sm">{quadrant}</p></div>;
}

export function VectorAdditionLab() {
  const [a, setA] = useState<V>([3, 1]), [b, setB] = useState<V>([-1, 3]);
  const [parallel, setParallel] = useState(false), [reverse, setReverse] = useState(false);
  const first = reverse ? b : a, second = reverse ? a : b;
  const c = sum(a, b);
  return <div className={PANEL_CLASS} aria-label="Изследване на събиране"><div className="mb-3 flex flex-wrap gap-2"><Toggle on={parallel} onChange={setParallel}>Успоредник</Toggle><Toggle on={reverse} onChange={setReverse}>Обратен ред</Toggle></div><Scene title="СЪБИРАНЕ НА ВЕКТОРИ"><Vector v={first} color={reverse ? C.warn : C.minus} /><Vector v={second} from={first} color={reverse ? C.minus : C.warn} />{parallel && <><Vector v={second} color={C.faint} dashed /><Vector v={first} from={second} color={C.faint} dashed /></>}<Vector v={c} color={C.ok} /><Handle v={first} onChange={reverse ? setB : setA} name="Край на първия вектор" color={reverse ? C.warn : C.minus} limit={3} /><Handle v={second} from={first} onChange={reverse ? setA : setB} name="Край на втория вектор" color={reverse ? C.minus : C.warn} limit={3} /></Scene><Legend items={[{ color: C.minus, tex: "$\\vec a$" }, { color: C.warn, tex: "$\\vec b$" }, { color: C.ok, tex: "$\\vec c$" }]} /><p className="mt-3 text-sm">{parallel ? "Успоредник: сивите страни допълват двата възможни пътя." : "Триъгълник: вторият вектор започва от края на първия."} Плъзнете краищата или използвайте плъзгачите.</p><Controls name="a" v={a} set={setA} limit={3} /><Controls name="b" v={b} set={setB} limit={3} /><p className="mt-3"><RichText text={`По $x$: $c_x=a_x+b_x=${dec(a[0], 1)}+(${dec(b[0], 1)})=${dec(c[0], 1)}$`} /></p><p><RichText text={`По $y$: $c_y=a_y+b_y=${dec(a[1], 1)}+(${dec(b[1], 1)})=${dec(c[1], 1)}$`} /></p><p className="mt-2"><RichText text={`$\\vec c=${dec(c[0], 1)}\\hat i+(${dec(c[1], 1)})\\hat j$`} /></p></div>;
}

/** Приложение на събирането: скорост спрямо въздуха + вятър = скорост спрямо земята. */
export function DroneWindSimulation() {
  const [speed, setSpeed] = useState(12);
  const [heading, setHeading] = useState(90);
  const [windSpeed, setWindSpeed] = useState(4);
  const [windHeading, setWindHeading] = useState(0);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const previousFrame = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) {
      previousFrame.current = null;
      return;
    }
    let frame = 0;
    const tick = (now: number) => {
      const previous = previousFrame.current ?? now;
      previousFrame.current = now;
      setTime((current) => {
        const next = current + (now - previous) / 1000;
        if (next >= FLIGHT_DURATION) {
          setPlaying(false);
          return FLIGHT_DURATION;
        }
        return next;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  const air: V = [cleanZero(speed * Math.cos(radians(heading))), cleanZero(speed * Math.sin(radians(heading)))];
  const wind: V = [cleanZero(windSpeed * Math.cos(radians(windHeading))), cleanZero(windSpeed * Math.sin(radians(windHeading)))];
  const rawGround = sum(air, wind);
  const ground: V = [cleanZero(rawGround[0]), cleanZero(rawGround[1])];
  const magnitude = Math.hypot(...ground);
  const direction = magnitude < 1e-8 ? null : angle(ground);
  const velocityPoint = (v: V): V => [ORIGIN[0] + VELOCITY_SCALE * v[0], ORIGIN[1] - VELOCITY_SCALE * v[1]];
  const airEnd = velocityPoint(air);
  const resultEnd = velocityPoint(ground);
  const progress = time / FLIGHT_DURATION;
  const droneX = ORIGIN[0] + (resultEnd[0] - ORIGIN[0]) * progress;
  const droneY = ORIGIN[1] + (resultEnd[1] - ORIGIN[1]) * progress;

  function applyPreset(preset: (typeof DRONE_PRESETS)[number]) {
    setSpeed(preset.speed);
    setHeading(preset.heading);
    setWindSpeed(preset.windSpeed);
    setWindHeading(preset.windHeading);
    setTime(0);
    setPlaying(false);
  }

  function start() {
    if (time >= FLIGHT_DURATION) setTime(0);
    setPlaying(true);
  }

  return (
    <div className={PANEL_CLASS} aria-label="Симулация на дрон във вятър">
      <div className="mb-3 flex flex-wrap gap-2">
        {DRONE_PRESETS.map((preset) => <button key={preset.label} type="button" className={BTN_SEC} onClick={() => applyPreset(preset)}>{preset.label}</button>)}
      </div>
      <Scene title="ДРОН ВЪВ ВЯТЪР">
        <line x1={ORIGIN[0]} y1={ORIGIN[1]} x2={resultEnd[0]} y2={resultEnd[1]} stroke={C.ok} strokeWidth={2} strokeDasharray="5 5" opacity={0.45} />
        <Arrow x1={ORIGIN[0]} y1={ORIGIN[1]} x2={airEnd[0]} y2={airEnd[1]} color={C.minus} />
        <Arrow x1={airEnd[0]} y1={airEnd[1]} x2={resultEnd[0]} y2={resultEnd[1]} color={C.warn} />
        <Arrow x1={ORIGIN[0]} y1={ORIGIN[1]} x2={resultEnd[0]} y2={resultEnd[1]} color={C.ok} />
        <g transform={`translate(${droneX} ${droneY}) rotate(${-(direction ?? 0)})`} aria-hidden="true">
          <path d="M 0 -9 L 7 7 L 0 4 L -7 7 Z" fill={C.wire} stroke={C.minus} strokeWidth={1.5} />
          <circle cx={0} cy={0} r={3} fill={C.minus} />
        </g>
      </Scene>
      <Legend items={[{ color: C.minus, tex: "$\\vec v_{\\text{въздух}}$" }, { color: C.warn, tex: "$\\vec v_{\\text{вятър}}$" }, { color: C.ok, tex: "$\\vec v_{\\text{земя}}$" }]} />
      <p className="mt-3 text-sm text-muted">Синята стрелка показва командата на дрона спрямо въздуха. Жълтата се добавя от края ѝ. Зелената скорост определя действителната траектория над земята.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <RangeControl label="Скорост на дрона спрямо въздуха" value={speed} min={4} max={16} step={0.5} valueTex={`${dec(speed, 1)}\\,\\mathrm{m/s}`} onChange={(value) => { setSpeed(value); setTime(0); }} />
        <RangeControl label="Курс на дрона" value={heading} min={0} max={360} step={1} valueTex={`${heading}^\\circ`} onChange={(value) => { setHeading(value); setTime(0); }} />
        <RangeControl label="Скорост на вятъра" value={windSpeed} min={0} max={8} step={0.5} valueTex={`${dec(windSpeed, 1)}\\,\\mathrm{m/s}`} onChange={(value) => { setWindSpeed(value); setTime(0); }} />
        <RangeControl label="Посока на вятъра" value={windHeading} min={0} max={360} step={1} valueTex={`${windHeading}^\\circ`} onChange={(value) => { setWindHeading(value); setTime(0); }} />
      </div>
      <div className="mt-4"><RangeControl label="Време" value={time} min={0} max={FLIGHT_DURATION} step={0.1} valueTex={`${dec(time, 1)}\\,\\mathrm{s}`} onChange={(value) => { setTime(value); setPlaying(false); }} /></div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className={BTN_PRI} onClick={playing ? () => setPlaying(false) : start}>{playing ? "Пауза" : "Пуснете симулацията"}</button>
        <button type="button" className={BTN_SEC} onClick={() => { setPlaying(false); setTime(0); }}>В началото</button>
      </div>
      <Readouts cols={5} cells={[
        { label: "По x", tex: `v_x=${dec(ground[0])}\\,\\mathrm{m/s}` },
        { label: "По y", tex: `v_y=${dec(ground[1])}\\,\\mathrm{m/s}` },
        { label: "Скорост", tex: `v=${dec(magnitude)}\\,\\mathrm{m/s}` },
        { label: "Посока", tex: direction === null ? "\\text{не е определена}" : `\\alpha=${dec(direction, 1)}^\\circ` },
        { label: "Изминато", tex: `s=${dec(magnitude * time)}\\,\\mathrm{m}` },
      ]} />
      <p className="mt-3"><RichText text={`По $x$: $v_x=${dec(air[0])}+(${dec(wind[0])})=${dec(ground[0])}\\,\\mathrm{m/s}$. По $y$: $v_y=${dec(air[1])}+(${dec(wind[1])})=${dec(ground[1])}\\,\\mathrm{m/s}$.`} /></p>
    </div>
  );
}

export function VectorOperationsLab() {
  const [k, setK] = useState(1), [subtract, setSubtract] = useState(false), [added, setAdded] = useState(false);
  const negative: V = [-OTHER[0], -OTHER[1]];
  const result: V = subtract ? sum(BASE, negative) : [k * BASE[0], k * BASE[1]];
  return <div className={PANEL_CLASS} aria-label="Изследване на изваждане и умножение"><div className="mb-3"><Toggle on={subtract} onChange={v => { setSubtract(v); setAdded(false); }}>Изваждане</Toggle></div><Scene title={subtract ? "ИЗВАЖДАНЕ НА ВЕКТОРИ" : "УМНОЖЕНИЕ НА ВЕКТОР С ЧИСЛО"}><g opacity={subtract ? 1 : 0.25}><Vector v={BASE} color={C.minus} /></g>{subtract && <><g opacity={0.25}><Vector v={OTHER} color={C.warn} /></g><Vector v={negative} color={C.warn} />{added && <Vector v={negative} from={BASE} color={C.faint} dashed />}</>}{(!subtract || added) && <Vector v={result} color={C.ok} />}</Scene><Legend items={subtract ? [{ color: C.minus, tex: "$\\vec a$" }, { color: C.warn, tex: "$-\\vec b$" }, { color: C.ok, tex: "$\\vec a-\\vec b$" }] : [{ color: C.minus, tex: "$\\vec a$" }, { color: C.ok, tex: "$k\\vec a$" }]} />{subtract ? <div className="mt-4"><button className={BTN_SEC} aria-pressed={added} onClick={() => setAdded(!added)}>{added ? "Покажете само обръщането" : "Добавете противоположния вектор"}</button><p className="mt-3"><RichText text={added ? "Преместваме $-\\vec b$ до края на $\\vec a$. По $x$: $c_x=a_x-b_x=3-1=2$. По $y$: $c_y=a_y-b_y=2-3=-1$." : "Обърнете $\\vec b$: големината се запазва, а и двете компоненти сменят знака си."} /></p></div> : <div className="mt-4"><RangeControl label={<RichText text="$k$" />} value={k} min={-2} max={2} step={0.25} valueTex={dec(k)} onChange={setK} /><Readouts cells={[{ label: "Големина", tex: `|k\\vec a|=${dec(Math.hypot(...result))}` }, { label: "Множител", tex: `k=${dec(k)}` }]} /><p className="mt-3 text-sm">{k === 0 ? "Нулев вектор: няма определена посока." : k < 0 ? "Посоката е противоположна на началната." : "Посоката е същата като началната."}</p></div>}</div>;
}
