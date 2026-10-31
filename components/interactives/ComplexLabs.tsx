"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import RichText from "@/components/RichText";
import { add, argument, modulus, multiply, oscillatorResponse, polar, roots, type Complex } from "@/lib/complexNumbers";
import SvgTex from "./SvgTex";
import { Arrow, BTN_SEC, C, DRAWING_FONT_FAMILY, PANEL_CLASS, STAGE_BG, STAGE_CLASS } from "./svg";

const fmt = (n: number) => (Math.abs(n) < 0.0005 ? "0.000" : n.toFixed(3)).replace(".", "{,}");
const tex = (z: Complex) => `${fmt(z.re)}${z.im < -0.0005 ? "-" : "+"}${fmt(Math.abs(z.im))}i`;
function Range({ label, value, min, max, step = 0.05, set }: { label: string; value: number; min: number; max: number; step?: number; set: (v: number) => void }) {
  const id = useId();
  return <label htmlFor={id} className="block min-w-0 text-sm font-semibold"><RichText text={label} /><input id={id} className="mt-3 block w-full accent-[var(--color-minus)]" type="range" min={min} max={max} step={step} value={value} onChange={e => set(Number(e.target.value))} /></label>;
}
function Panel({ title, caption, children }: { title: string; caption: string; children: ReactNode }) {
  return <figure className={`${PANEL_CLASS} my-7`}><h3 className="mb-4 font-serif text-xl font-bold">{title}</h3>{children}<figcaption className="mt-4 text-sm leading-relaxed text-muted"><RichText text={caption} /></figcaption></figure>;
}
function Readout({ children, live = true }: { children: ReactNode; live?: boolean }) {
  return <div aria-live={live ? "polite" : "off"} className="my-4 space-y-2 overflow-x-auto rounded-lg border border-rule bg-hl p-3 text-sm tabular-nums">{children}</div>;
}
function Plane({ extent, title, children }: { extent: number; title: string; children: (xy: (z: Complex) => [number, number], scale: number) => ReactNode }) {
  const scale = 125 / extent;
  const xy = (z: Complex): [number, number] => [180 + scale * z.re, 180 - scale * z.im];
  return <svg viewBox="0 0 360 360" className={STAGE_CLASS} style={{ background: STAGE_BG, fontFamily: DRAWING_FONT_FAMILY }} role="img" aria-label={title}>
    <title>{title}</title>
    {[-1, -.5, .5, 1].map(t => <g key={t}><line x1={180 + 125 * t} x2={180 + 125 * t} y1="42" y2="318" stroke={C.faint} strokeWidth=".6" /><line y1={180 + 125 * t} y2={180 + 125 * t} x1="42" x2="318" stroke={C.faint} strokeWidth=".6" /></g>)}
    <Arrow x1={35} y1={180} x2={325} y2={180} color={C.mut} width={1} /><Arrow x1={180} y1={325} x2={180} y2={35} color={C.mut} width={1} />
    <SvgTex x={328} y={158} tex="\operatorname{Re}" anchor="end" width={44} color={C.wire} fontSize={15} /><SvgTex x={201} y={30} tex="\operatorname{Im}" width={44} color={C.wire} fontSize={15} />
    <SvgTex x={168} y={195} tex="0" anchor="end" width={16} color={C.mut} />
    <line x1="305" x2="305" y1="177" y2="183" stroke={C.mut} />
    <SvgTex x={305} y={198} tex={String(extent).replace(".", "{,}")} anchor="middle" width={40} color={C.mut} />
    {children(xy, scale)}
  </svg>;
}
function Vector({ z, xy, color, dashed = false, start = { re: 0, im: 0 } }: { z: Complex; xy: (z: Complex) => [number, number]; color: string; dashed?: boolean; start?: Complex }) {
  const [x1, y1] = xy(start), [x2, y2] = xy(add(start, z));
  return modulus(z) < 1e-9 ? <circle cx={x1} cy={y1} r="4" fill={color} /> : <Arrow x1={x1} y1={y1} x2={x2} y2={y2} color={color} dashed={dashed} />;
}
function Legend({ items }: { items: [string, string][] }) {
  return <div className="my-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">{items.map(([label, color]) => <span key={label} className="flex items-center gap-2"><span aria-hidden="true" className="inline-block h-2.5 w-5 rounded-sm" style={{ background: color }} /><RichText text={label} /></span>)}</div>;
}

export function CartesianLab() {
  const [a, setA] = useState(2), [b, setB] = useState(1), [conj, setConj] = useState(false);
  const z = { re: a, im: b }, phi = argument(z);
  return <Panel title="Точка, вектор и комплексно число" caption="Преместете двете координати. Пунктираните отсечки са проекциите върху осите. Спрегнатото число е отражение спрямо реалната ос. При нулата няма посока.">
    <div className="mb-5 grid gap-5 sm:grid-cols-2"><Range label={`$a=${fmt(a)}$`} value={a} min={-3} max={3} set={setA} /><Range label={`$b=${fmt(b)}$`} value={b} min={-3} max={3} set={setB} /></div>
    <Plane extent={3.4} title="Комплексна равнина с проекции и спрегнато число">{xy => { const [x, y] = xy(z); return <><path d={`M180 ${y}H${x}V180`} stroke={C.faint} fill="none" strokeDasharray="4 4" /><Vector z={z} xy={xy} color={C.minus} />{conj && <Vector z={{ re: a, im: -b }} xy={xy} color={C.warn} dashed />}</>; }}</Plane>
    <Legend items={conj ? [["$z$", C.minus], ["$\\overline z$", C.warn]] : [["$z$", C.minus]]} />
    <button type="button" className={BTN_SEC} aria-pressed={conj} onClick={() => setConj(!conj)}>Спрегнато число</button>
    <Readout><RichText text={`$z=${tex(z)},\\quad |z|=${fmt(modulus(z))}$`} /><p><RichText text={phi === null ? "Аргументът на $0$ не е определен." : `$\\operatorname{Arg}z=${fmt(phi)}\\,\\mathrm{rad}$`} /></p></Readout>
  </Panel>;
}

export function MultiplicationLab() {
  const [phi, setPhi] = useState(Math.PI / 2), [r, setR] = useState(1);
  const z = { re: 1, im: .5 }, w = polar(r, phi), product = multiply(z, w);
  return <Panel title="Умножението завърта и мащабира" caption="Синият вектор е фиксиран. Зеленият е произведението. При множител с модул единица се променя само посоката; при нулев множител всичко се свива в началото.">
    <div className="mb-5 grid gap-5 sm:grid-cols-2"><Range label={`$|w|=${fmt(r)}$`} value={r} min={0} max={2} set={setR} /><Range label={`$\\varphi=${fmt(phi)}\\,\\mathrm{rad}$`} value={phi} min={-Math.PI} max={Math.PI} step={Math.PI / 36} set={setPhi} /></div>
    <Plane extent={2.5} title="Завъртане и разтягане при умножение">{(xy, scale) => <><circle cx="180" cy="180" r={modulus(z) * scale} fill="none" stroke={C.faint} /><Vector z={z} xy={xy} color={C.minus} /><Vector z={product} xy={xy} color={C.ok} dashed /></>}</Plane>
    <Legend items={[["$z=1+0{,}5i$", C.minus], ["$zw$", C.ok]]} />
    <div className="flex flex-wrap gap-2">{[["Умножи по i", Math.PI / 2], ["Умножи по −1", Math.PI], ["Умножи по 1", 0]].map(([label, angle]) => <button type="button" className={BTN_SEC} key={label} onClick={() => { setR(1); setPhi(Number(angle)); }}>{label}</button>)}</div>
    <Readout><RichText text={`$w=${tex(w)}$`} /><p><RichText text={`$zw=${tex(product)}$`} /></p></Readout>
  </Panel>;
}

export function EulerLab() {
  const [theta, setTheta] = useState(Math.PI / 3), [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    let frame = 0, previous: number | null = null;
    function tick(now: number) {
      if (previous !== null) { const dt = Math.min((now - previous) / 1000, .05); setTheta(t => { const next = t + dt; return Math.min(2 * Math.PI, next); }); }
      previous = now; frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);
  useEffect(() => { if (theta >= 2 * Math.PI) setPlaying(false); }, [theta]);
  const z = polar(1, theta);
  const path = (fn: (t: number) => number) => Array.from({ length: 161 }, (_, i) => `${i ? "L" : "M"}${40 + 280 * i / 160},${100 - 55 * fn(2 * Math.PI * i / 160)}`).join(" ");
  return <Panel title="Въртенето се проектира в синусоида" caption="Една обиколка е от нула до два пи радиана. Двете проекции са реалната и имагинерната част на същата точка. Анимацията показва геометрията; доказателството за експонентата е в текста.">
    <Range label={`$\\theta=${fmt(theta)}\\,\\mathrm{rad}$`} value={theta} min={0} max={2 * Math.PI} step={.01} set={v => { setPlaying(false); setTheta(v); }} />
    <div className="my-4"><button className={BTN_SEC} type="button" aria-pressed={playing} onClick={() => { if (theta >= 2 * Math.PI) setTheta(0); setPlaying(p => !p); }}>{playing ? "Пауза" : "Пусни една обиколка"}</button></div>
    <Plane extent={1.2} title="Единична окръжност и проекции на въртящ се вектор">{(xy, s) => { const [x, y] = xy(z); const arc = Array.from({ length: 65 }, (_, k) => { const t = theta * k / 64; return `${k ? "L" : "M"}${180 + 25 * Math.cos(t)},${180 - 25 * Math.sin(t)}`; }).join(" "); return <><circle cx="180" cy="180" r={s} fill="none" stroke={C.faint} /><path d={`M180 ${y}H${x}V180`} stroke={C.warn} strokeDasharray="4 4" fill="none" /><path d={arc} fill="none" stroke={C.warn} strokeWidth="1.5" /><Vector z={z} xy={xy} color={C.minus} /></>; }}</Plane>
    <svg viewBox="0 0 360 210" className={`${STAGE_CLASS} mt-4`} style={{ background: STAGE_BG }} role="img" aria-label="Синус и косинус за една обиколка">
      <title>Реална и имагинерна проекция спрямо ъгъла</title>
      <line x1="40" y1="100" x2="325" y2="100" stroke={C.faint} /><line x1="40" y1="35" x2="40" y2="160" stroke={C.faint} />
      <path d={path(Math.cos)} fill="none" stroke={C.minus} strokeWidth="2" /><path d={path(Math.sin)} fill="none" stroke={C.warn} strokeWidth="2" strokeDasharray="5 3" />
      <line x1={40 + 280 * theta / (2 * Math.PI)} x2={40 + 280 * theta / (2 * Math.PI)} y1="35" y2="160" stroke={C.mut} />
      <circle cx={40 + 280 * theta / (2 * Math.PI)} cy={100 - 55 * z.re} r="4" fill={C.minus} /><circle cx={40 + 280 * theta / (2 * Math.PI)} cy={100 - 55 * z.im} r="4" fill={C.warn} />
      <SvgTex x={40} y={179} tex="0" color={C.mut} anchor="middle" width={25} /><SvgTex x={180} y={179} tex="\pi" color={C.mut} anchor="middle" width={25} /><SvgTex x={320} y={179} tex="2\pi" color={C.mut} anchor="middle" width={30} /><SvgTex x={180} y={199} tex="\theta\;(\mathrm{rad})" color={C.wire} anchor="middle" width={110} />
      <SvgTex x={20} y={45} tex="1" color={C.mut} width={20} anchor="middle" /><SvgTex x={20} y={155} tex="-1" color={C.mut} width={25} anchor="middle" />
    </svg>
    <Legend items={[["$\\cos\\theta$", C.minus], ["$\\sin\\theta$ (пунктир)", C.warn]]} />
    <Readout live={!playing}><RichText text={`$e^{i\\theta}=${tex(z)}$`} /><p><RichText text={`$|e^{i\\theta}|=${fmt(modulus(z))}$`} /></p></Readout>
  </Panel>;
}

export function RootsLab() {
  const [n, setN] = useState(3), [phi, setPhi] = useState(Math.PI), [r, setR] = useState(1);
  const zs = roots(polar(r, phi), n), radius = r ** (1 / n);
  return <Panel title="Корените образуват правилен многоъгълник" caption="Всички показани точки на степен n дават едно и също число. При промяна на аргумента многоъгълникът се завърта с n пъти по-малък ъгъл. При нула остава само един различен корен.">
    <div className="mb-5 grid gap-5 sm:grid-cols-2"><Range label={`$n=${n}$`} value={n} min={2} max={8} step={1} set={setN} /><Range label={`$\\arg z=${fmt(phi)}\\,\\mathrm{rad}$`} value={phi} min={-Math.PI} max={Math.PI} set={setPhi} /><Range label={`$|z|=${fmt(r)}$`} value={r} min={0} max={4} set={setR} /></div>
    <Plane extent={2.2} title="Всички комплексни корени на зададеното число">{(xy, s) => <><circle cx="180" cy="180" r={radius * s} stroke={C.faint} fill="none" /><polygon points={zs.map(z => xy(z).join(",")).join(" ")} fill="none" stroke={C.faint} />{zs.map((z, k) => { const [x, y] = xy(z); return <g key={k}><Vector z={z} xy={xy} color={k === 0 ? C.warn : C.faint} dashed /><circle cx={x} cy={y} r="5" fill={k === 0 ? C.warn : C.ok} /></g>; })}</>}</Plane>
    <Readout><RichText text={`$z=${tex(polar(r, phi))},\\quad |w_k|=${fmt(radius)}$`} />{zs.map((z, k) => <p key={k}><RichText text={`$w_{${k}}=${tex(z)}$`} /></p>)}</Readout>
  </Panel>;
}

export function InterferenceLab() {
  const [phi, setPhi] = useState(Math.PI / 2), [r, setR] = useState(1);
  const z = { re: 1, im: 0 }, w = polar(r, phi), sum = add(z, w);
  return <Panel title="Фазовата разлика определя усилването" caption="Събираме две трептения с една и съща честота. Пунктираният вектор е вторият, преместен до края на първия. Дължината на резултата е общата амплитуда, в единици на първата амплитуда.">
    <div className="mb-5 grid gap-5 sm:grid-cols-2"><Range label={`$a_2/a_1=${fmt(r)}$`} value={r} min={0} max={2} set={setR} /><Range label={`$\\Delta\\varphi=${fmt(phi)}\\,\\mathrm{rad}$`} value={phi} min={-Math.PI} max={Math.PI} step={Math.PI / 36} set={setPhi} /></div>
    <Plane extent={3.3} title="Векторно събиране на две комплексни амплитуди">{xy => <><Vector z={z} xy={xy} color={C.minus} /><Vector z={w} xy={xy} color={C.warn} start={z} dashed /><Vector z={sum} xy={xy} color={C.ok} /></>}</Plane>
    <Legend items={[["$\\tilde x_1$", C.minus], ["$\\tilde x_2$", C.warn], ["$\\tilde x_1+\\tilde x_2$", C.ok]]} />
    <Readout><RichText text={`$a/a_1=${fmt(modulus(sum))}$`} /><p><RichText text={modulus(sum) < 1e-9 ? "Пълно гасене. Фазата на резултата не е определена." : `$\\varphi=${fmt(argument(sum) ?? 0)}\\,\\mathrm{rad}$`} /></p></Readout>
  </Panel>;
}

export function ResonanceLab() {
  const [ratio, setRatio] = useState(.8), [damping, setDamping] = useState(.2);
  const response = oscillatorResponse(ratio, damping);
  const peak = damping < 1 / Math.sqrt(2) ? 1 / (2 * damping * Math.sqrt(1 - damping ** 2)) : 1;
  const yMax = Math.ceil(peak * 1.15 * 2) / 2;
  const scaleY = (v: number) => 260 - 210 * v / yMax;
  const curve = Array.from({ length: 301 }, (_, i) => { const q = 2.5 * i / 300; return `${i ? "L" : "M"}${45 + 275 * q / 2.5},${scaleY(modulus(oscillatorResponse(q, damping)))}`; }).join(" ");
  return <Panel title="Амплитуда и фазово закъснение при резонанс" caption="Плъзгачът за честотата премества работната точка. По-слабото затихване прави върха по-висок и по-тесен; вертикалният мащаб се настройва според върха. Показан е само установеният режим; преходното движение не е включено.">
    <div className="mb-5 grid gap-5 sm:grid-cols-2"><Range label={`$\\omega/\\omega_0=${fmt(ratio)}$`} value={ratio} min={0} max={2.5} step={.01} set={setRatio} /><Range label={`$\\zeta=${fmt(damping)}$`} value={damping} min={.05} max={1} step={.01} set={setDamping} /></div>
    <svg viewBox="0 0 360 325" className={STAGE_CLASS} style={{ background: STAGE_BG }} role="img" aria-label="Резонансна крива на относителната амплитуда">
      <title>Амплитудна характеристика на затихващ осцилатор</title>
      {[0, yMax / 2, yMax].map(v => <g key={v}><line x1="45" x2="320" y1={scaleY(v)} y2={scaleY(v)} stroke={C.faint} /><SvgTex x={37} y={scaleY(v)} tex={String(v).replace(".", "{,}")} color={C.mut} anchor="end" width={35} /></g>)}
      <line x1="45" x2="45" y1="35" y2="260" stroke={C.faint} />
      <path d={curve} fill="none" stroke={C.minus} strokeWidth="2.5" /><circle cx={45 + 275 * ratio / 2.5} cy={scaleY(modulus(response))} r="5" fill={C.warn} />
      {[0, 1, 2.5].map(v => <SvgTex key={v} x={45 + 275 * v / 2.5} y={280} tex={String(v).replace(".", "{,}")} anchor="middle" width={35} color={C.mut} />)}
      <SvgTex x={45} y={18} tex="a/(F_0/k)" width={130} color={C.wire} /><SvgTex x={182} y={308} tex="\omega/\omega_0" width={100} anchor="middle" color={C.wire} />
    </svg>
    <Readout><RichText text={`$a/(F_0/k)=${fmt(modulus(response))}$`} /><p><RichText text={`$\\arg\\tilde x=${fmt(argument(response) ?? 0)}\\,\\mathrm{rad}$`} /></p></Readout>
  </Panel>;
}

