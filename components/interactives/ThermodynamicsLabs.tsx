"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import PredictionQuestion, { type PredictionOption } from "./PredictionQuestion";
import { energyParts, heating, twoPaths, workProcess } from "@/lib/thermodynamics";

const button = "rounded-lg border border-ink bg-surface px-4 py-2 shadow-hard-sm focus-visible:outline-2 focus-visible:outline-minus disabled:opacity-50 aria-pressed:bg-hl aria-pressed:font-semibold";
const fmt = (n: number) => n.toLocaleString("bg-BG", { maximumFractionDigits: 1 });
function Box({ title, children }: { title: string; children: ReactNode }) {
  return <div className="my-6 rounded-xl border-[1.5px] border-ink bg-surface p-4 sm:p-6 shadow-hard"><h3 className="mb-4 font-semibold">{title}</h3>{children}</div>;
}
function Slider({ label, value, min, max, step = 1, onChange }: { label: string; value: number; min: number; max: number; step?: number; onChange: (n: number) => void }) {
  return <label className="my-3 block text-sm font-medium">{label}<input className="mt-2 block w-full accent-[#2e6fd8]" type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} /></label>;
}
const PredictionContext = createContext<{ prediction: string; setPrediction: (s: string) => void }>({ prediction: "", setPrediction: () => {} });
export function ThermodynamicsProvider({ children }: { children: ReactNode }) {
  const [prediction, setPrediction] = useState("");
  useEffect(() => { try { setPrediction(sessionStorage.getItem("thermo-prediction") || ""); } catch {} }, []);
  return <PredictionContext.Provider value={{ prediction, setPrediction: s => { setPrediction(s); try { sessionStorage.setItem("thermo-prediction", s); } catch {} } }}>{children}</PredictionContext.Provider>;
}
export function PredictThenExplore({ prompt, options, children }: { prompt: string; options: PredictionOption[]; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <div className="space-y-5"><PredictionQuestion prompt={prompt} options={options} onAnswered={() => setOpen(true)} />{open ? children : <p className="text-sm text-muted">Избери предположение, за да отвориш демонстрацията и извеждането. Грешките са част от изследването.</p>}</div>;
}
function Cylinder({ ratio, label, fixed = false }: { ratio: number; label: string; fixed?: boolean }) {
  const y = 210 - 70 * ratio;
  return <svg viewBox="0 0 240 240" role="img" aria-label={label} className="mx-auto w-full max-w-[240px]">
    <rect x="55" y={y} width="130" height={210-y} fill="#dbeafe" />
    <path d="M55 35V210H185V35" fill="none" stroke="#1b2430" strokeWidth="4" />
    <rect x="50" y={y-8} width="140" height="8" fill="#5b6878" />
    {fixed ? <path d={`M40 ${y-4}h25m110 0h25`} stroke="#c94a3d" strokeWidth="8" /> : <><path d={`M120 ${y-8}v-24`} stroke="#1b2430" strokeWidth="5" /><rect x="90" y={y-48} width="60" height="24" rx="3" fill="#fff3d6" stroke="#1b2430" /><text x="120" y={y-31} textAnchor="middle" fontSize="12">товар</text></>}
    {Array.from({length:12},(_,i)=><circle key={i} cx={73+(i%4)*31} cy={y+20+Math.floor(i/4)*(190-y)/3} r="4" fill="#2e6fd8" />)}
    <text x="120" y="232" textAnchor="middle" fontSize="13">{label}</text>
  </svg>;
}
export function HeatingLab({ revisit = false }: { revisit?: boolean }) {
  const { prediction, setPrediction } = useContext(PredictionContext);
  const [q, setQ] = useState(150);
  const model = heating(q);
  return <Box title={revisit ? "Връщане към първото предположение" : "Една и съща топлина. Два цилиндъра."}>
    {!revisit && <><p className="mb-3">В кой газ температурата ще се повиши повече?</p><div className="flex flex-wrap gap-2">{["При застопореното бутало", "При подвижното бутало", "Еднакво"].map(s=><button key={s} className={button} aria-pressed={prediction===s} onClick={()=>setPrediction(s)}>{s}</button>)}</div></>}
    {prediction && <p role="status" className="my-3 rounded bg-hl p-3">Твоето запазено предположение: <strong>{prediction}</strong>{!revisit && ". Ще го обясним с енергийния баланс в §7."}</p>}
    {(prediction || revisit) && <><p className="text-sm text-muted">И в двата съда: n = 0,10 mol; T₀ = 300 K; p₀ = 100 kPa. Бавно нагряване; идеален едноатомен газ. Подвижното бутало е без триене, с постоянно външно налягане.</p>
      <Slider label={`Подадена топлина Q = ${q} J`} min={0} max={300} step={10} value={q} onChange={setQ} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{(["fixed", "moving"] as const).map((key,i)=>{const s=model[key];return <div key={key} className="rounded-lg border border-rule p-3"><Cylinder ratio={s.v/model.v0} fixed={!i} label={i ? "Подвижно бутало" : "Застопорено бутало"} /><p className="font-semibold">T = {fmt(s.t)} K</p><p className="text-sm">V = {fmt(s.v)} L · p = {fmt(s.p)} kPa</p><div className="my-2 flex h-5 overflow-hidden rounded bg-paper" aria-hidden="true"><div className="bg-minus" style={{width:`${s.du/300*100}%`}} /><div className="bg-plus" style={{width:`${s.work/300*100}%`}} /></div><p className="text-sm">Синьо: ΔU = {fmt(s.du)} J<br />Червено: A<sub>газ</sub> = {fmt(s.work)} J</p></div>;})}</div>
      {revisit && <p className="mt-4">При застопореното бутало цялото Q увеличава U. При подвижното ⅖ от Q се предава като работа на околната среда, а ⅗ увеличават U. Затова първият газ се затопля повече.</p>}</>}
  </Box>;
}
export function EquilibriumLab() {
  const [mode, setMode] = useState("slow");
  const [progress,setProgress]=useState(0);
  return <Box title="Как поставяме допълнителния товар?">
    <label className="block">Натоварване <select className={button} value={mode} onChange={e=>{setMode(e.target.value);setProgress(0);}}><option value="slow">Постепенно, без триене</option><option value="sudden">Рязко</option><option value="friction">Бавно, с триене</option></select></label>
    <Slider label={`Етап на процеса: ${progress}%`} value={progress} min={0} max={100} onChange={setProgress} />
    <Cylinder ratio={1-progress/250} label="Газът е системата; товарът е отвън" />
    <p className="rounded bg-hl p-3" role="status">{mode==="slow" ? "Идеализирано бавно свиване: газът преминава през почти равновесни състояния. Можем да означим всяко с p, V, T." : mode==="sudden" ? "След рязкото натоварване буталото ускорява, възникват вълни и нееднородности. Междинната рисунка показва само обем, не единно равновесно p и T. Чакаме ново равновесие." : "Възможно е газът да остава близо до равновесие, но триенето разсейва механична енергия. Квазистатичен не означава непременно обратим."}</p>
    <p className="mt-2 text-sm text-muted">Схематични положения, управлявани с плъзгача; това не е числен модел на преходната динамика.</p>
  </Box>;
}
// Starts paused, including for reduced-motion users; no animation until explicit play.
function useClock() {
  const [playing,setPlaying]=useState(false), [time,setTime]=useState(0);
  useEffect(()=>{const media=matchMedia("(prefers-reduced-motion: reduce)");const stop=()=>{if(media.matches)setPlaying(false);};media.addEventListener("change",stop);return()=>media.removeEventListener("change",stop);},[]);
  useEffect(()=>{if(!playing)return;let frame=0, previous=0;const tick=(now:number)=>{if(previous)setTime(t=>t+Math.min(now-previous,40)/1000);previous=now;frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);},[playing]);
  return {playing,setPlaying,time,setTime};
}
function MoleculeMotion({kind,translation,rotation,vibration}: {kind:number;translation:boolean;rotation:boolean;vibration:boolean}) {
  const {playing,setPlaying,time,setTime}=useClock();
  const phase = time*2;
  const cx=150+(translation?65*Math.sin(time):0), cy=105+(translation?25*Math.sin(time*1.7):0);
  const stretch=vibration?10*Math.sin(phase*3):0;
  const angle=rotation&&kind>0?phase*35:0;
  // H2O positions are shifted by the mass-weighted centroid (O:H = 16:1).
  const raw=kind===0?[[0,0,4]]:kind===1?[[-36-stretch,0,14],[36+stretch,0,14]]:[[0,0,16],[-40-stretch,32+stretch/2,1],[40+stretch,32+stretch/2,1]];
  const mass=raw.reduce((s,a)=>s+a[2],0), mx=raw.reduce((s,a)=>s+a[0]*a[2],0)/mass, my=raw.reduce((s,a)=>s+a[1]*a[2],0)/mass;
  const atoms=raw.map(a=>[a[0]-mx,a[1]-my,a[2]]);
  return <><svg viewBox="0 0 300 220" role="img" aria-label="Схематична молекула; кръстчето означава центъра на масата" className="w-full rounded-lg bg-paper">
    <path d="M30 105H270M150 20V195" stroke="#c9d2dc" strokeDasharray="4 4" />
    <g transform={`translate(${cx} ${cy}) rotate(${angle})`}>
      {atoms.slice(1).map((a,i)=><line key={i} x1={atoms[0][0]} y1={atoms[0][1]} x2={a[0]} y2={a[1]} stroke="#5b6878" strokeWidth="5" />)}
      {atoms.map((a,i)=><g key={i}><circle cx={a[0]} cy={a[1]} r={a[2]===1?10:18} fill={kind===2&&i===0?"#c94a3d":"#2e6fd8"} /><text x={a[0]} y={a[1]+4} textAnchor="middle" fill="white" fontSize="12">{kind===0?"He":kind===1?"N":i===0?"O":"H"}</text></g>)}
    </g><circle cx={cx} cy={cy} r="6" fill="white" /><path d={`M${cx-8} ${cy}h16M${cx} ${cy-8}v16`} stroke="#1b2430" strokeWidth="2" /><text x="10" y="210" fontSize="12">+ център на масата</text>
  </svg><div className="mt-3 flex gap-2"><button className={button} onClick={()=>setPlaying(!playing)}>{playing?"Пауза":"Пусни движението"}</button><button className={button} onClick={()=>{setPlaying(false);setTime(0);}}>Начало</button></div><Slider label="Кадър (ръчно разглеждане)" value={Math.round((time%10)*100)} min={0} max={1000} onChange={n=>{setPlaying(false);setTime(n/100);}} /></>;
}
export function AtomEnergyLab() {
  const [n,setN]=useState(1),[t,setT]=useState(300);
  const energy=energyParts(0,0,n,t).translation;
  return <Box title="Събираме енергиите на атомите">
    <Slider label={`Количество хелий n = ${fmt(n)} mol`} value={n} min={0.5} max={2} step={0.5} onChange={setN} />
    <Slider label={`Абсолютна температура T = ${t} K`} value={t} min={150} max={600} step={50} onChange={setT} />
    <p>Средно на атом: {fmt(1.5*1.380649*t/100)} × 10⁻²¹ J</p>
    <div className="my-3 h-6 rounded bg-paper" aria-hidden="true"><div className="h-full bg-minus rounded" style={{width:`${n*t/1200*100}%`}} /></div>
    <p className="font-semibold">Общо U = {fmt(energy)} J</p><p className="text-sm text-muted">Първо удвои n при T = 300 K. После върни n = 1 mol и удвои T. Сравни енергията на един атом и енергията на цялата проба.</p>
  </Box>;
}
export function MoleculeLab() {
  const [kind,setKind]=useState(1),[translation,setTranslation]=useState(true),[rotation,setRotation]=useState(false),[vibration,setVibration]=useState(false),[active,setActive]=useState(false),[n,setN]=useState(1),[t,setT]=useState(400);
  return <Box title="Лаборатория на молекулните движения">
    <label className="block mb-3">Молекула <select className={button} value={kind} onChange={e=>setKind(Number(e.target.value))}><option value={0}>He · едноатомна</option><option value={1}>N₂ · линейна</option><option value={2}>H₂O · нелинейна, газ</option></select></label>
    <fieldset className="mb-4 flex flex-wrap gap-4"><legend className="text-sm text-muted">Кои движения да се виждат?</legend>{([["Постъпателно",translation,setTranslation],["Въртеливо",rotation,setRotation],["Трептително",vibration,setVibration]] as const).map(([name,value,set],i)=><label key={name} className="text-sm"><input type="checkbox" checked={value} disabled={kind===0&&i>0} onChange={e=>set(e.target.checked)} /> {name}</label>)}</fieldset>
    <MoleculeMotion key={kind} kind={kind} translation={translation} rotation={rotation} vibration={vibration&&kind>0} />
    <p className="my-3 text-sm">Постъпателното движение премества кръстчето. Въртенето сменя ориентацията около него. Трептенето променя връзките, без само по себе си да мести центъра на масата. Изключи другите две движения и провери всяко поотделно.</p>
    <p className="text-sm text-muted">Схематична двумерна проекция, без реален пространствен или времеви мащаб. При H₂O е показано симетрично разтягане; има и други модове. Бутоните управляват видимостта на движенията, а не температурата или физическото им „замразяване“.</p>
    <h4 className="mt-6 font-semibold">Енергия при еднакви n и T</h4>
    <Slider label={`Количество n = ${fmt(n)} mol`} value={n} min={0.1} max={2} step={0.1} onChange={setN} />
    <Slider label={`Температура T = ${t} K (сравнение при избран модел)`} value={t} min={400} max={800} step={10} onChange={setT} />
    <label className="block text-sm"><input type="checkbox" checked={active} onChange={e=>setActive(e.target.checked)} /> Сравни с класическия предел: всички вибрационни модове активни</label>
    <p className="my-2 text-sm text-muted">Този превключвател сравнява два идеализирани предела; не твърди, че всички вибрации са активни при избраната T. H₂O се разглежда като разреден газ.</p>
    {["He","N₂","H₂O"].map((name,i)=>{const e=energyParts([0,2,3][i],active?[0,1,3][i]:0,n,t);const total=e.translation+e.rotation+e.vibration;return <div key={name} className="my-4"><p className="text-sm font-medium">{name}: f = {e.f}; U = {fmt(total)} J</p><div className="flex h-5 bg-paper rounded overflow-hidden" aria-hidden="true">{[e.translation,e.rotation,e.vibration].map((v,j)=><div key={j} style={{width:`${v/(6*n*8.314462618*t)*100}%`,background:["#2e6fd8","#2f8f4e","#c94a3d"][j]}} />)}</div><p className="text-xs">Постъпателна: {fmt(e.translation)} J · Въртелива: {fmt(e.rotation)} J · Трептителна: {fmt(e.vibration)} J</p></div>;})}
    <p className="text-sm">Еднаква скала: синьо — постъпателна; зелено — въртелива; червено — трептителна. Сините части са еднакви за трите газа.</p>
  </Box>;
}
export function WorkLab() {
  const [v,setV]=useState(3),[variable,setVariable]=useState(false),[slices,setSlices]=useState(8);
  const model=workProcess(v,variable,slices), x=(a:number)=>45+a*85, y=(p:number)=>230-p*.9;
  return <Box title="Бутало ↔ площ под p(V)">
    <label className="text-sm"><input type="checkbox" checked={variable} onChange={e=>setVariable(e.target.checked)} /> Променливо налягане: pV = 200 J (изотермен модел)</label>
    <Slider label={`Краен обем V₂ = ${fmt(v)} L; начален V₁ = 2 L`} value={v} min={1} max={4} step={0.1} onChange={setV} />
    {variable&&<Slider label={`Брой правоъгълници: ${slices}`} value={slices} min={2} max={80} onChange={setSlices} />}
    <div className="grid sm:grid-cols-[1fr_2fr] items-center"><Cylinder ratio={v/2} label={`V = ${fmt(v)} L`} /><svg viewBox="0 0 420 275" role="img" aria-label="Налягане спрямо обем с оцветена работа" className="w-full">
      <path d="M45 20V230H400" fill="none" stroke="#1b2430" strokeWidth="2" />
      {model.rectangles.map((r,i)=><rect key={i} x={x(Math.min(r.v,r.v+r.dv))} y={y(r.p)} width={Math.abs(r.dv)*85} height={230-y(r.p)} fill={v>=2?"#2e6fd855":"#c94a3d55"} stroke="#ffffff" strokeWidth=".5" />)}
      <path d={Array.from({length:61},(_,i)=>{const a=1+i/20;return `${i?"L":"M"}${x(a)} ${y(model.pressure(a))}`;}).join(" ")} stroke="#1b2430" fill="none" strokeWidth="2" />
      {[1,2,3,4].map(a=><text key={a} x={x(a)} y="249" textAnchor="middle" fontSize="12">{a}</text>)}{[100,200].map(p=><text key={p} x="39" y={y(p)+4} textAnchor="end" fontSize="11">{p}</text>)}
      <circle cx={x(2)} cy={y(model.pressure(2))} r="5" fill="#2f8f4e" /><circle cx={x(v)} cy={y(model.pressure(v))} r="5" fill="#c94a3d" /><text x="50" y="16" fontSize="13">p (kPa)</text><text x="340" y="269" fontSize="13">V (L)</text>
    </svg></div>
    <p className="font-semibold">A<sub>газ</sub> = {fmt(model.exact)} J · ΔV = {fmt(v-2)} L</p>
    {variable&&<p>Сума с левите спрямо посоката на процеса краища: {fmt(model.approximate)} J. Увеличи броя правоъгълници и сравни с точната стойност.</p>}
    <p className="text-sm mt-2">Зелено: начало; червено: край. Площта е положителна при разширяване и влиза с минус при свиване. 1 kPa · L = 1 J. Моделът е квазистатичен.</p>
  </Box>;
}
export function PathsLab() {
  const [path,setPath]=useState(0),[progress,setProgress]=useState(100);
  const results=twoPaths(), s=progress/100;
  const v=path===0?(s<.5?1:1+4*(s-.5)):(s<.5?1+4*s:3);
  const p=path===0?(s<.5?100+200*s:200):(s<.5?100:100+200*(s-.5));
  const work=path===0?200*(v-1):100*(v-1),du=1.5*(p*v-100);
  return <Box title="Едни краища, различни площи">
    <div className="flex gap-2">{["Път I","Път II"].map((label,i)=><button key={label} className={button} aria-pressed={path===i} onClick={()=>setPath(i)}>{label}</button>)}</div>
    <Slider label={`Проследи пътя: ${progress}%`} value={progress} min={0} max={100} onChange={setProgress} />
    <svg viewBox="0 0 420 290" role="img" aria-label="Двата пътя от A до B; работата до маркера е оцветена" className="w-full">
      <path d="M45 20V250H395" fill="none" stroke="#1b2430" strokeWidth="2" />
      <rect x="130" y={path===0?70:160} width={(v-1)*85} height={path===0?180:90} fill={path===0?"#2e6fd833":"#c94a3d33"} />
      <path d="M130 160V70H300" stroke="#2e6fd8" strokeWidth={path===0?5:2} fill="none" /><path d="M130 160H300V70" stroke="#c94a3d" strokeWidth={path===1?5:2} fill="none" strokeDasharray="8 4" />
      <text x="110" y="180">A</text><text x="307" y="66">B</text><text x="170" y="60" fill="#2e6fd8">I →</text><text x="170" y="184" fill="#c94a3d">II →</text>
      <circle cx={45+v*85} cy={250-p*.9} r="7" fill="#2f8f4e" />
      {[1,2,3].map(a=><text key={a} x={45+a*85} y="267">{a}</text>)}{[100,200].map(a=><text key={a} x="7" y={255-a*.9}>{a}</text>)}<text x="50" y="18">p (kPa)</text><text x="337" y="284">V (L)</text>
    </svg>
    <p role="status">До маркера: A<sub>газ</sub> = {fmt(work)} J; ΔU = {fmt(du)} J; Q = {fmt(du+work)} J.</p>
    <div className="overflow-x-auto mt-4"><table className="w-full text-sm text-left"><caption className="text-left font-semibold mb-2">За целия преход A → B</caption><thead><tr><th>Величина</th><th>Път I</th><th>Път II</th></tr></thead><tbody>{([["Aгаз","work"],["ΔU","du"],["Q","q"]] as const).map(([label,key])=><tr key={key} className="border-t border-rule"><th className="py-2">{label}</th>{results.map((r,i)=><td key={i}>{r[key]} J</td>)}</tr>)}</tbody></table></div>
  </Box>;
}
