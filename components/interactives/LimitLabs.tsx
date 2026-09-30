"use client";

import { useId, useState, type ReactNode } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import { C, DRAWING_FONT_FAMILY, PANEL_CLASS, STAGE_BG, STAGE_CLASS } from "./svg";

const W = 600, H = 340;
type Bounds = [number, number, number, number];
function scales([xmin, xmax, ymin, ymax]: Bounds) {
  return { x: (v: number) => 64 + (v - xmin) / (xmax - xmin) * 500,
    y: (v: number) => 280 - (v - ymin) / (ymax - ymin) * 240 };
}
const numberTex = (v: number, digits = 3) => v.toFixed(digits).replace(".", "{,}");
function curve(fn: (x: number) => number, a: number, b: number, bounds: Bounds, samples = 240) {
  const s = scales(bounds);
  return Array.from({ length: samples + 1 }, (_, i) => {
    const t = a + (b - a) * i / samples;
    return `${i ? "L" : "M"}${s.x(t).toFixed(2)},${s.y(fn(t)).toFixed(2)}`;
  }).join(" ");
}
function Plot({ bounds, title, children, xLabel = "x", yLabel = "y", xTicks, yTicks }: {
  bounds: Bounds; title: string; children: ReactNode; xLabel?: string; yLabel?: string;
  xTicks: number[]; yTicks: number[];
}) {
  const id = useId().replace(/:/g, "");
  const s = scales(bounds);
  return <div className="overflow-x-auto">
    <svg viewBox={`0 0 ${W} ${H}`} className={`${STAGE_CLASS} min-w-[460px]`} style={{ background: STAGE_BG, fontFamily: DRAWING_FONT_FAMILY }} role="img" aria-label={title}>
      <title>{title}</title>
      <defs><clipPath id={id}><rect x="64" y="40" width="500" height="240" /></clipPath></defs>
      {xTicks.map(v => <g key={v}><line x1={s.x(v)} x2={s.x(v)} y1="40" y2="280" stroke={C.faint} strokeWidth="0.7" /><SvgTex x={s.x(v)} y={300} tex={String(v).replace(".", "{,}")} color={C.mut} anchor="middle" width={45} /></g>)}
      {yTicks.map(v => <g key={v}><line x1="64" x2="564" y1={s.y(v)} y2={s.y(v)} stroke={C.faint} strokeWidth="0.7" /><SvgTex x={50} y={s.y(v)} tex={String(v).replace(".", "{,}")} color={C.mut} anchor="end" width={50} /></g>)}
      <g clipPath={`url(#${id})`}>{children}</g>
      <rect x="64" y="40" width="500" height="240" fill="none" stroke={C.faint} />
      <SvgTex x={314} y={326} tex={xLabel} color={C.wire} anchor="middle" width={130} />
      <SvgTex x={65} y={19} tex={yLabel} color={C.wire} width={150} />
    </svg>
  </div>;
}
function Panel({ title, caption, children }: { title: string; caption: string; children: ReactNode }) {
  return <figure className={`${PANEL_CLASS} my-6`}><h3 className="mb-4 font-serif text-xl font-bold">{title}</h3>{children}<figcaption className="mt-4 text-sm leading-relaxed text-muted"><RichText text={caption} /></figcaption></figure>;
}
function Range({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  const id = useId();
  return <div className="my-4"><label htmlFor={id} className="mb-2 block text-sm font-semibold"><RichText text={label} /></label><input id={id} className="w-full cursor-pointer accent-[var(--color-minus)]" type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} /></div>;
}
function Readout({ children }: { children: ReactNode }) {
  return <div aria-live="polite" className="mt-4 grid gap-2 rounded-lg border border-rule bg-hl px-4 py-3 text-sm tabular-nums sm:grid-cols-2">{children}</div>;
}

export function ApproachLimitLab() {
  const [power, setPower] = useState(0.5);
  const [mode, setMode] = useState("hole");
  const selectId = useId();
  const h = 0.8 * 10 ** (-power);
  const bounds: Bounds = [0, 2, 0, 3.5];
  const s = scales(bounds);
  const hole = mode === "hole";
  const left = hole ? 2 - h : 1, right = hole ? 2 + h : 2;
  return <Panel title="Какво става около точката?" caption="Синята точка идва отляво, оранжевата отдясно. Празните кръгчета показват изключени точки. Плътната точка е отделно зададената стойност $f(1)=3$; тя не променя поведението около нея.">
    <label htmlFor={selectId} className="block text-sm font-semibold">Изберете зависимост</label>
    <select id={selectId} value={mode} onChange={e => setMode(e.target.value)} className="mt-2 w-full rounded-lg border border-ink bg-surface p-2 text-sm">
      <option value="hole">Отстранимо прекъсване: границата съществува</option><option value="jump">Скок: лявата и дясната граница се различават</option>
    </select>
    <Range label="Приближаване към $x=1$" min={0} max={3} step={0.05} value={power} onChange={setPower} />
    <Plot bounds={bounds} title="Граница отляво и отдясно при различна стойност в самата точка" xTicks={[0, 1, 2]} yTicks={[0, 1, 2, 3]}>
      <path d={curve(x => hole ? x + 1 : 1, 0, 1, bounds)} stroke={C.minus} strokeWidth={3} fill="none" />
      <path d={curve(x => hole ? x + 1 : 2, 1, 2, bounds)} stroke={C.plus} strokeWidth={3} fill="none" />
      {(hole ? [2] : [1, 2]).map(v => <circle key={v} cx={s.x(1)} cy={s.y(v)} r={6} fill={STAGE_BG} stroke={C.wire} strokeWidth={2} />)}
      <circle cx={s.x(1)} cy={s.y(3)} r={5} fill={C.warn} />
      <circle cx={s.x(1-h)} cy={s.y(left)} r={5} fill={C.minus} />
      <circle cx={s.x(1+h)} cy={s.y(right)} r={5} fill={C.plus} />
    </Plot>
    <Readout><RichText text={String.raw`Отляво: $x=${numberTex(1-h, 4)}$, $f(x)=${numberTex(left, 4)}$`} /><RichText text={String.raw`Отдясно: $x=${numberTex(1+h, 4)}$, $f(x)=${numberTex(right, 4)}$`} /><span className="sm:col-span-2">{hole ? "Двете стойности се приближават към 2, въпреки че стойността в точката е 3." : "Разстоянието по хоризонтала намалява, но разликата между двете височини остава 1."}</span></Readout>
  </Panel>;
}

export function EpsilonLimitLab() {
  const [eps, setEps] = useState(0.6), [ratio, setRatio] = useState(1);
  const delta = eps / 2 * ratio;
  const bounds: Bounds = [0, 2, 1, 5], s = scales(bounds);
  return <Panel title="Допустима грешка и достатъчна близост" caption="Зелената хоризонтална ивица е допустимата грешка по височина. Синята вертикална ивица е избраният входен интервал. За гаранция цялата част от правата над този интервал трябва да остане в зелената ивица. Границите на интервалите са изключени.">
    <Range label={String.raw`Допустима грешка: $\varepsilon=${numberTex(eps,2)}$`} min={0.15} max={1} step={0.05} value={eps} onChange={setEps} />
    <Range label={String.raw`Избрана близост: $\delta=${numberTex(delta,3)}$`} min={0.5} max={1.5} step={0.05} value={ratio} onChange={setRatio} />
    <Plot bounds={bounds} title="Ивици epsilon и delta за правата y равно на 2x плюс 1 около x равно на 1" xTicks={[0, 1, 2]} yTicks={[1, 3, 5]}>
      <rect x={64} y={s.y(3+eps)} width={500} height={s.y(3-eps)-s.y(3+eps)} fill={C.ok} opacity={0.17} />
      <rect x={s.x(1-delta)} y={40} width={s.x(1+delta)-s.x(1-delta)} height={240} fill={C.minus} opacity={0.15} />
      {[3-eps, 3+eps].map(v => <line key={v} x1={64} x2={564} y1={s.y(v)} y2={s.y(v)} stroke={C.ok} strokeDasharray="5 5" />)}
      <path d={curve(x => 2*x+1, 0, 2, bounds)} fill="none" stroke={C.wire} strokeWidth={3} />
      <path d={curve(x => 2*x+1, 1-delta, 1+delta, bounds)} fill="none" stroke={ratio<=1 ? C.ok : C.plus} strokeWidth={5} />
      <circle cx={s.x(1)} cy={s.y(3)} r={5} fill={STAGE_BG} stroke={C.wire} strokeWidth={2} />
    </Plot>
    <Readout><RichText text={String.raw`$|f(x)-3|=2|x-1|$`} /><span>{ratio <= 1 ? "Гаранцията е изпълнена за всички точки в избрания интервал." : "Интервалът е твърде широк: част от стойностите излизат от допустимата ивица."}</span></Readout>
  </Panel>;
}

export function SequenceLimitLab() {
  const [n, setN] = useState(12), [mode, setMode] = useState("decay");
  const id = useId();
  const value = (k: number) => mode === "decay" ? 1/k : mode === "damped" ? (-1)**k/k : (-1)**k;
  const bounds: Bounds = [0, n+1, -1.2, 1.2], s = scales(bounds);
  return <Panel title="Как се държи опашката на редицата?" caption="Точките са отделни членове, затова не ги свързваме с непрекъсната линия. При сходимост всички достатъчно късни членове остават близо до една стойност. Редуването на знаците само по себе си не пречи на сходимостта.">
    <label className="block text-sm font-semibold" htmlFor={id}>Редица</label><select id={id} value={mode} onChange={e => setMode(e.target.value)} className="mt-2 w-full rounded-lg border border-ink bg-surface p-2 text-sm"><option value="decay">Намаляващи положителни членове</option><option value="damped">Затихващо редуване</option><option value="alternating">Редуване с постоянна амплитуда</option></select>
    <Range label={String.raw`Брой показани членове: $N=${n}$`} value={n} min={5} max={60} step={1} onChange={setN} />
    <Plot bounds={bounds} title="Членове на редица и поведение при нарастващ номер" xLabel="n" yLabel="a_n" xTicks={[1, Math.round(n/2), n]} yTicks={[-1, 0, 1]}>
      <line x1={64} x2={564} y1={s.y(0)} y2={s.y(0)} stroke={C.ok} strokeDasharray="5 5" />
      {Array.from({length:n},(_,i)=>i+1).map(k => <circle key={k} cx={s.x(k)} cy={s.y(value(k))} r={k===n ? 5 : 3.5} fill={k===n ? C.warn : C.minus} />)}
    </Plot>
    <Readout><RichText text={mode === "decay" ? "$a_n=1/n$" : mode === "damped" ? "$a_n=(-1)^n/n$" : "$a_n=(-1)^n$"} /><RichText text={String.raw`$a_{${n}}=${numberTex(value(n),4)}$`} /></Readout>
  </Panel>;
}

export function SqueezeLimitLab() {
  const [radius, setRadius] = useState(0.7);
  const bounds: Bounds = [-radius,radius,-(radius**2)*1.15,radius**2*1.15], s=scales(bounds);
  return <Panel title="Трептене между две свиващи се граници" caption="Жълтата крива се колебае, но остава между двете сини параболи. При увеличение около нулата проверявайте и мащаба по вертикалата: ограждащите стойности намаляват. Картината илюстрира; неравенството доказва.">
    <Range label={String.raw`Прозорец около нулата: $|x|\le ${numberTex(radius,2)}$`} value={radius} min={0.08} max={1} step={0.01} onChange={setRadius} />
    <Plot bounds={bounds} title="Притискане на x на квадрат по sin от 1 върху x между плюс и минус x на квадрат" xTicks={[-Number(radius.toFixed(2)),0,Number(radius.toFixed(2))]} yTicks={[-Number((radius**2).toFixed(3)),0,Number((radius**2).toFixed(3))]}>
      {[1,-1].map(sign=><path key={sign} d={curve(x=>sign*x*x,-radius,radius,bounds)} fill="none" stroke={C.minus} strokeWidth={2} />)}
      <path d={curve(x=>x===0?0:x*x*Math.sin(1/x),-radius,radius,bounds,1600)} fill="none" stroke={C.warn} strokeWidth={2} />
      <circle cx={s.x(0)} cy={s.y(0)} r={4} fill={STAGE_BG} stroke={C.warn} />
    </Plot>
    <Readout><RichText text={String.raw`$-x^2\le x^2\sin(1/x)\le x^2$`} /><RichText text={String.raw`Максимална големина в прозореца: $${numberTex(radius**2,4)}$`} /></Readout>
  </Panel>;
}

export function RectangleLimitLab() {
  const [power,setPower]=useState(2);
  const n=2**power, bounds:Bounds=[0,1,0,1.05], s=scales(bounds);
  const lower=(n-1)*(2*n-1)/(6*n*n), upper=(n+1)*(2*n+1)/(6*n*n);
  return <Panel title="Площта между долна и горна сума" caption="Сините правоъгълници са под кривата. Оранжевите добавки ги допълват до горните правоъгълници. Общата оранжева площ е разликата между сумите и ограничава грешката на всяко от двете приближения.">
    <Range label={String.raw`Брой правоъгълници: $n=${n}$`} value={power} min={1} max={7} step={1} onChange={setPower} />
    <Plot bounds={bounds} title="Долни и горни правоъгълници под параболата y равно на x на квадрат" xTicks={[0,0.5,1]} yTicks={[0,0.5,1]}>
      {Array.from({length:n},(_,i)=>{const lo=(i/n)**2,hi=((i+1)/n)**2;return <g key={i}><rect x={s.x(i/n)} y={s.y(lo)} width={500/n} height={s.y(0)-s.y(lo)} fill={C.minus} opacity={0.42}/><rect x={s.x(i/n)} y={s.y(hi)} width={500/n} height={s.y(lo)-s.y(hi)} fill={C.plus} opacity={0.6}/><line x1={s.x(i/n)} x2={s.x((i+1)/n)} y1={s.y(lo)} y2={s.y(lo)} stroke={C.minus}/></g>;})}
      <path d={curve(x=>x*x,0,1,bounds)} fill="none" stroke={C.wire} strokeWidth={2.5}/>
    </Plot>
    <Readout><RichText text={String.raw`$L_n=${numberTex(lower,5)}$`} /><RichText text={String.raw`$U_n=${numberTex(upper,5)}$`} /><RichText text={String.raw`$U_n-L_n=1/n=${numberTex(1/n,5)}$`} /><RichText text={String.raw`$L_n\le S\le U_n$`} /></Readout>
  </Panel>;
}

export function SecantLimitLab() {
  const [h,setH]=useState(0.8);
  const bounds:Bounds=[0,3.2,0,10.5],s=scales(bounds);
  return <Panel title="Средната скорост се приближава към моментната" caption="За движението $s(t)=ct^2$, $c=1\,\mathrm{m/s^2}$, синята секуща минава през два момента. Зелената допирателна показва граничния наклон при $t=2\,\mathrm s$. Намалете интервала; точките се сближават, а наклонът се стабилизира.">
    <Range label={String.raw`Времеви интервал: $h=${numberTex(h,2)}\,\mathrm s$`} value={h} min={0.02} max={1} step={0.02} onChange={setH}/>
    <Plot bounds={bounds} title="Секуща и допирателна към графиката на положението при t равно на 2 секунди" xLabel="t\ (\mathrm s)" yLabel="s\ (\mathrm m)" xTicks={[0,1,2,3]} yTicks={[0,4,8]}>
      <path d={curve(t=>t*t,0,3.2,bounds)} fill="none" stroke={C.wire} strokeWidth={3}/>
      <path d={curve(t=>4+4*(t-2),0,3.2,bounds)} fill="none" stroke={C.ok} strokeWidth={2} strokeDasharray="6 5"/>
      <path d={curve(t=>4+(4+h)*(t-2),0,3.2,bounds)} fill="none" stroke={C.minus} strokeWidth={2}/>
      <circle cx={s.x(2)} cy={s.y(4)} r={5} fill={C.ok}/><circle cx={s.x(2+h)} cy={s.y((2+h)**2)} r={5} fill={C.minus}/>
    </Plot>
    <Readout><RichText text={String.raw`$\overline v=${numberTex(4+h,2)}\,\mathrm{m/s}$`} /><RichText text={String.raw`$v(2\,\mathrm s)=4\,\mathrm{m/s}$`}/></Readout>
  </Panel>;
}

export function SineLimitLab() {
  const [theta,setTheta]=useState(0.65);
  const r=210, ox=90, oy=280, bx=ox+r*Math.cos(theta),by=oy-r*Math.sin(theta),ty=oy-r*Math.tan(theta);
  return <Panel title="Два триъгълника ограждат кръгов сектор" caption="При единичен радиус малкият триъгълник е вътре в сектора, а секторът е вътре в големия триъгълник. Ъгълът се измерва в радиани. Сравняването на трите лица дава ключовото неравенство за синуса.">
    <Range label={String.raw`Ъгъл: $\theta=${numberTex(theta,2)}\,\mathrm{rad}$`} value={theta} min={0.12} max={0.8} step={0.01} onChange={setTheta}/>
    <div className="overflow-x-auto"><svg viewBox="40 20 330 310" className={`${STAGE_CLASS} min-w-[300px]`} style={{background:STAGE_BG,fontFamily:DRAWING_FONT_FAMILY}} role="img" aria-label="Вписан триъгълник, кръгов сектор и описан триъгълник за сравнение на лица">
      <title>Сравнение на лица при единичен радиус</title>
      <path d={`M${ox},${oy} L${ox+r},${oy} L${ox+r},${ty} Z`} fill={C.plus} opacity={0.18} stroke={C.plus}/>
      <path d={`M${ox},${oy} L${ox+r},${oy} A${r},${r} 0 0 0 ${bx},${by} Z`} fill={C.warn} opacity={0.35} stroke={C.warn}/>
      <path d={`M${ox},${oy} L${ox+r},${oy} L${bx},${by} Z`} fill={C.minus} opacity={0.45} stroke={C.minus}/>
      <path d={`M${ox},${oy} L${ox+r},${oy} M${ox},${oy} L${ox+r},${ty} M${ox+r},${oy} L${ox+r},${ty}`} fill="none" stroke={C.wire} strokeWidth={1.5}/>
      <SvgTex x={ox+r/2} y={305} tex="1" color={C.wire} anchor="middle" width={30}/>
      <SvgTex x={ox+80} y={oy-18} tex="\theta" color={C.wire} width={25}/>
      <SvgTex x={ox+r+15} y={(oy+ty)/2} tex="\tan\theta" color={C.plus} width={65} fontSize={12}/>
    </svg></div>
    <Readout><RichText text={String.raw`$S_{\text{вътр}}=\frac12\sin\theta$`} /><RichText text={String.raw`$S_{\text{сектор}}=\frac12\theta$`} /><RichText text={String.raw`$S_{\text{външ}}=\frac12\tan\theta$`}/><RichText text={String.raw`$\sin\theta/\theta=${numberTex(Math.sin(theta)/theta,5)}$`}/></Readout>
  </Panel>;
}
