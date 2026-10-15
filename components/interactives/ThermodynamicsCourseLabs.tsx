"use client";
import { useState, type ReactNode } from "react";
import RichText from "@/components/RichText";
import type { ThermoLab } from "@/lib/thermodynamicsContent";
import { SCHOOL_R, equalHeating, processState, pathState, rectangleCycle, reflection, type ProcessKind } from "@/lib/thermodynamicsSchool";
import MolecularFreedom from "./MolecularFreedom";
import SvgTex from "./SvgTex";
import { Arrow, BTN_PRI, BTN_SEC, C } from "./svg";
import { formatThermo as fmt, MotionControls, ThermoPanel, ThermoReadout, ThermoScene, ThermoSlider, useThermoMotion } from "./ThermoControls";

const raw = String.raw;
const energy = (v: number) => fmt(v) + raw`\,\mathrm J`;
const temp = (v: number) => fmt(v) + raw`\,\mathrm K`;
const reflected = (x: number) => { const a = ((x % 2) + 2) % 2; return a <= 1 ? a : 2 - a; };
function Particles({ x, y, width, height, phase, speed = 1, count = 28 }: { x: number; y: number; width: number; height: number; phase: number; speed?: number; count?: number }) {
  return <g data-particles>{Array.from({ length: count }, (_, i) => {
    const px = reflected(i * 0.38197 + phase * speed * (3 + i % 5) * (i % 2 ? -1 : 1));
    const py = reflected(i * 0.61803 + phase * speed * (2 + i % 4) * (i % 3 ? 1 : -1));
    return <circle key={i} cx={x + 6 + px * (width - 12)} cy={y + 6 + py * (height - 12)} r={2.8} fill={C.minus} />;
  })}</g>;
}
function Cylinder({ x, y, width, phase, speed = 1 }: { x: number; y: number; width: number; phase: number; speed?: number }) {
  return <g><path d={`M${x + width + 30} ${y}H${x}V${y + 58}H${x + width + 30}`} fill="none" stroke={C.wire} strokeWidth={2} />
    <Particles x={x} y={y} width={width} height={58} phase={phase} speed={speed} count={18} />
    <line x1={x + width} x2={x + width} y1={y} y2={y + 58} stroke={C.warn} strokeWidth={7} />
    <line x1={x + width} x2={x + width + 26} y1={y + 29} y2={y + 29} stroke={C.warn} strokeWidth={3} />
  </g>;
}
function GasLab() {
  const [temperature, setTemperature] = useState(300), [volume, setVolume] = useState(3);
  const motion = useThermoMotion(12), width = 90 + 45 * volume, left = (400 - width) / 2;
  return <ThermoPanel title="Движение на частиците и налягане">
    <ThermoScene title="Частици в затворен съд">
      <rect x={left} y={28} width={width} height={188} fill="none" stroke={C.wire} strokeWidth={2} />
      <Particles x={left} y={28} width={width} height={188} phase={motion.phase} speed={Math.sqrt(temperature / 300)} />
    </ThermoScene>
    <ThermoSlider label={`Температура: $T=${temp(temperature)}$`} value={temperature} min={150} max={600} onChange={setTemperature} />
    <ThermoSlider label={raw`Обем: $V=${fmt(volume)}\,\mathrm L$`} value={volume} min={1} max={5} step={0.1} onChange={setVolume} />
    <MotionControls motion={motion} />
    <ThermoReadout items={[["Количество вещество", raw`\nu=0{,}10\,\mathrm{mol}`], ["Равновесно налягане", raw`p=${fmt(0.1 * SCHOOL_R * temperature / volume)}\,\mathrm{kPa}`]]} />
    <p className="mt-3 text-sm text-muted">Сравнявайте равновесни състояния. Промяната на обема с плъзгача не симулира конкретен термодинамичен процес. Междумолекулните сблъсъци са пропуснати в тази схематична проекция.</p>
  </ThermoPanel>;
}
function CollisionLab() {
  const [u, setU] = useState(0), motion = useThermoMotion(7);
  const v = 80, time = motion.phase * 3.4, hit = 200 / (v - u), after = time > hit, wall = 260 + u * time;
  const result = reflection(v, u), x = after ? 60 + v * hit + result.outgoing * (time - hit) : 60 + v * time;
  return <ThermoPanel title="Удар в стена или движещо се бутало">
    <ThermoScene title="Молекула се отразява еластично от масивно бутало">
      <line x1={35} y1={160} x2={365} y2={160} stroke={C.faint} strokeWidth={1} />
      <line x1={wall} x2={wall} y1={55} y2={190} stroke={C.warn} strokeWidth={8} />
      <circle cx={x} cy={135} r={9} fill={C.minus} />
      <Arrow x1={x} y1={110} x2={x + (after ? result.outgoing : v) * 0.5} y2={110} color={C.minus} />
      <SvgTex x={90} y={40} tex={after ? "v_{x,2}" : "v_{x,1}"} color={C.minus} fontSize={18} width={65} />
      <SvgTex x={340} y={40} tex="u" color={C.warn} fontSize={18} width={30} />
      {u !== 0 && <Arrow x1={wall} y1={215} x2={wall + u * 2} y2={215} color={C.warn} />}
    </ThermoScene>
    <ThermoSlider label={`Скорост на буталото спрямо падащата молекула: $u/v=${fmt(u / v, 2)}$`} value={u} min={-15} max={15} onChange={value => { setU(value); motion.seek(0); }} />
    <MotionControls motion={motion} />
    <ThermoReadout items={[["Отразена компонента", `v_{x,2}/v=${fmt(result.outgoing / v, 2)}`], ["Енергия след удара", `E_{k,2}/E_{k,1}=${fmt(result.energyRatio, 2)}`]]} />
    <p className="mt-3 text-sm"><RichText text={raw`При $u=0$ енергията се запазва. При отдалечаване $u>0$ молекулата губи енергия; при приближаване $u<0$ получава. За масивно бутало: $v_{x,2}=2u-v_{x,1}$. Положителната посока е надясно.`} /></p>
  </ThermoPanel>;
}
const px = (v: number) => 55 + v * 44, py = (p: number) => 220 - p * 0.54;
function PVAxes() {
  return <g><Arrow x1={55} y1={220} x2={365} y2={220} color={C.mut} width={1.5} /><Arrow x1={55} y1={220} x2={55} y2={25} color={C.mut} width={1.5} />
    <SvgTex x={372} y={220} tex="V" color={C.wire} fontSize={18} width={24} /><SvgTex x={30} y={27} tex="p" color={C.wire} fontSize={18} width={24} />
  </g>;
}
function Point({ v, p, label, dy = -18 }: { v: number; p: number; label: string; dy?: number }) {
  return <g><circle cx={px(v)} cy={py(p)} r={4} fill={C.warn} /><SvgTex x={px(v)} y={py(p) + dy} tex={label} color={C.wire} width={26} anchor="middle" fontSize={18} /></g>;
}
function WorkLab() {
  const [v, setV] = useState(5), [p, setP] = useState(100), [linear, setLinear] = useState(false);
  const p1 = 100, p2 = linear ? p : 100, work = (p1 + p2) / 2 * (v - 2);
  return <ThermoPanel title="Работата като лице под графиката">
    <ThermoScene title="Правоъгълник или трапец под графиката на налягането">
      <PVAxes /><path d={`M${px(2)} 220V${py(p1)}L${px(v)} ${py(p2)}V220Z`} fill={C.ok} opacity={0.18} />
      <line x1={px(2)} y1={py(p1)} x2={px(v)} y2={py(p2)} stroke={C.minus} strokeWidth={3} />
      <Point v={2} p={p1} label="1" />{Math.abs(v - 2) > 0.65 || Math.abs(p2 - p1) > 70 ? <Point v={v} p={p2} label="2" /> : <circle cx={px(v)} cy={py(p2)} r={4} fill={C.warn} />}
    </ThermoScene>
    <ThermoSlider label={raw`Краен обем: $V_2=${fmt(v)}\,\mathrm L$`} value={v} min={1} max={6} step={0.1} onChange={setV} />
    <label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" checked={linear} onChange={e => setLinear(e.target.checked)} />Линейно променящо се налягане</label>
    {linear && <ThermoSlider label={raw`Крайно налягане: $p_2=${fmt(p, 0)}\,\mathrm{kPa}$`} value={p} min={50} max={300} onChange={setP} />}
    <ThermoReadout items={[["Начален обем", raw`V_1=2\,\mathrm L`], ["Начално налягане", raw`p_1=100\,\mathrm{kPa}`], ["Работа на газа", "A=" + energy(work)], ["Работа на външните сили", "A'=" + energy(-work)]]} />
    <p className="mt-3 text-sm">Началото е неподвижно. Преместете крайния обем от двете му страни и сравнете знака. Оцветеното лице дава големината, а посоката на процеса определя знака.</p>
  </ThermoPanel>;
}
function BalanceLab() {
  const [q, setQ] = useState(300), [a, setA] = useState(500);
  return <ThermoPanel title="Енергия през границата на системата">
    <ThermoScene title="Топлина, работа и промяна на вътрешната енергия">
      <rect x={130} y={72} width={140} height={118} rx={10} fill="none" stroke={C.wire} strokeWidth={2} />
      <SvgTex x={200} y={128} tex="\Delta U" color={C.wire} anchor="middle" fontSize={22} width={75} />
      <Arrow x1={q >= 0 ? 30 : 125} y1={130} x2={q >= 0 ? 125 : 30} y2={130} color={C.plus} />
      <SvgTex x={70} y={96} tex="Q" color={C.plus} anchor="middle" width={30} fontSize={18} />
      <Arrow x1={a >= 0 ? 275 : 370} y1={130} x2={a >= 0 ? 370 : 275} y2={130} color={C.ok} />
      <SvgTex x={325} y={96} tex="A" color={C.ok} anchor="middle" width={30} fontSize={18} />
    </ThermoScene>
    <ThermoSlider label={`Получена топлина със знак: $Q=${energy(q)}$`} value={q} min={-500} max={500} step={10} onChange={setQ} />
    <ThermoSlider label={`Работа на газа със знак: $A=${energy(a)}$`} value={a} min={-500} max={500} step={10} onChange={setA} />
    <ThermoReadout items={[["Промяна на вътрешната енергия", raw`\Delta U=` + energy(q - a)], ["Работа върху газа", "A'=" + energy(-a)]]} />
    <p className="mt-3 text-sm" aria-live="polite">{q === a ? "Вътрешната енергия не се изменя." : q > a ? "Вътрешната енергия се увеличава." : "Вътрешната енергия намалява."}</p>
  </ThermoPanel>;
}
function PathsLab() {
  const [high, setHigh] = useState(true), [progress, setProgress] = useState(1), state = pathState(high, progress);
  return <ThermoPanel title="Пътища между едни и същи състояния">
    <div className="mb-4 flex flex-wrap gap-2">{[true, false].map(value => <button type="button" key={String(value)} className={value === high ? BTN_PRI : BTN_SEC} aria-pressed={value === high} onClick={() => setHigh(value)}>{value ? "Първо нагряване" : "Първо разширение"}</button>)}</div>
    <ThermoScene title="Два пътя с еднакви крайни състояния">
      <PVAxes />
      <path d={`M${px(2)} ${py(100)}V${py(300)}H${px(6)}`} fill="none" stroke={high ? C.minus : C.faint} strokeWidth={high ? 3 : 1.5} />
      <path d={`M${px(2)} ${py(100)}H${px(6)}V${py(300)}`} fill="none" stroke={high ? C.faint : C.minus} strokeWidth={high ? 1.5 : 3} />
      <Point v={2} p={100} label="1" dy={22} /><Point v={6} p={300} label="2" />
      <circle data-state-point cx={px(state.v)} cy={py(state.p)} r={7} fill={C.ok} />
    </ThermoScene>
    <ThermoSlider label={raw`Измината част от пътя: $${fmt(progress * 100, 0)}\%$`} value={progress} min={0} max={1} step={0.01} onChange={setProgress} />
    <ThermoReadout items={[["Работа", "A=" + energy(state.a)], ["Вътрешна енергия", raw`\Delta U=` + energy(state.du)], ["Топлина", "Q=" + energy(state.q)], ["Текущо състояние", raw`p=${fmt(state.p, 0)}\,\mathrm{kPa},\ V=${fmt(state.v)}\,\mathrm L`]]} />
  </ThermoPanel>;
}
const processNames: Record<ProcessKind, string> = { isochoric: "Изохорен", isobaric: "Изобарен", isothermal: "Изотермен", adiabatic: "Адиабатен" };
function ProcessLab() {
  const [kind, setKind] = useState<ProcessKind>("isochoric"), [axes, setAxes] = useState("pV");
  const motion = useThermoMotion(12), state = processState(kind, motion.phase);
  const position = (s: ReturnType<typeof processState>) => axes === "pV" ? [65 + s.v * 65, 225 - s.p * 0.9] : axes === "pT" ? [65 + (s.t - 150) * 0.6, 225 - s.p * 0.9] : [65 + s.v * 65, 225 - (s.t - 100) * 0.36];
  const path = Array.from({ length: 61 }, (_, i) => position(processState(kind, i / 60)));
  const [cx, cy] = position(state), start = position(processState(kind, 0));
  return <ThermoPanel title="Процеси в различни координати">
    <div className="mb-3 flex flex-wrap gap-2">{(Object.keys(processNames) as ProcessKind[]).map(key => <button type="button" className={key === kind ? BTN_PRI : BTN_SEC} key={key} aria-pressed={key === kind} onClick={() => { setKind(key); motion.seek(0); }}>{processNames[key]}</button>)}</div>
    <div className="mb-4 flex flex-wrap gap-2">{["pV", "pT", "TV"].map(key => <button type="button" className={axes === key ? BTN_PRI : BTN_SEC} key={key} aria-pressed={axes === key} onClick={() => setAxes(key)}><RichText text={"$" + key[0] + "(" + key[1] + ")$"} /></button>)}</div>
    <ThermoScene title="Графика на процеса и бутало" height={350}>
      <Arrow x1={60} y1={235} x2={365} y2={235} color={C.mut} width={1.5} /><Arrow x1={60} y1={235} x2={60} y2={25} color={C.mut} width={1.5} />
      <SvgTex x={374} y={235} tex={axes[1]} color={C.wire} width={20} fontSize={18} /><SvgTex x={36} y={28} tex={axes[0]} color={C.wire} width={24} fontSize={18} />
      <polyline points={path.map(p => p.join(",")).join(" ")} fill="none" stroke={C.minus} strokeWidth={3} />
      <circle cx={start[0]} cy={start[1]} r={4} fill={C.warn} /><SvgTex x={start[0] - 18} y={start[1] + 20} tex="1" color={C.wire} width={22} fontSize={18} />
      <circle data-state-point cx={cx} cy={cy} r={6} fill={C.ok} />
      <Cylinder x={100} y={275} width={state.v * 48} phase={motion.phase} speed={Math.sqrt(state.t / 300)} />
    </ThermoScene>
    <MotionControls motion={motion} />
    <ThermoReadout items={[["Температура", "T=" + temp(state.t)], ["Налягане", raw`p=${fmt(state.p)}\,\mathrm{kPa}`], ["Обем", raw`V=${fmt(state.v)}\,\mathrm L`], ["Промяна на вътрешната енергия", raw`\Delta U=` + energy(state.du)], ["Работа", "A=" + energy(state.a)], ["Топлина", "Q=" + energy(state.q)]]} />
    <p className="mt-3 text-sm text-muted">Моделът е за едноатомен идеален газ. Адиабатата е обратима. Буталото показва относителния обем, а движението на точките е схематично.</p>
  </ThermoPanel>;
}
function HeatingLab() {
  const [q, setQ] = useState(150), [s, setS] = useState(3), motion = useThermoMotion(12), state = equalHeating(q, s);
  return <ThermoPanel title="Нагряване на еднакви порции газ">
    <div className="mb-4 flex flex-wrap gap-2">{[3, 5].map(value => <button type="button" className={s === value ? BTN_PRI : BTN_SEC} key={value} aria-pressed={s === value} onClick={() => setS(value)}>{value === 3 ? "Едноатомен газ" : "Двуатомен без трептения"}</button>)}</div>
    <ThermoScene title="Застопорено и подвижно бутало при еднаква получена топлина" height={260}>
      <text x={200} y={26} textAnchor="middle" fill={C.mut} fontSize={14} fontWeight={600}>ЗАСТОПОРЕНО БУТАЛО</text>
      <Cylinder x={65} y={42} width={140} phase={motion.phase} speed={Math.sqrt(state.fixed.t / 300)} />
      <path d="M212 38v68m-6-68h12m-12 68h12" stroke={C.faint} strokeWidth={2} />
      <text x={200} y={142} textAnchor="middle" fill={C.mut} fontSize={14} fontWeight={600}>ПОДВИЖНО БУТАЛО</text>
      <Cylinder x={65} y={158} width={140 * state.moving.v / state.v0} phase={motion.phase} speed={Math.sqrt(state.moving.t / 300)} />
    </ThermoScene>
    <ThermoSlider label={`Топлина за всяка порция: $Q=${energy(q)}$`} value={q} min={0} max={300} step={5} onChange={setQ} />
    <MotionControls motion={motion} />
    <ThermoReadout items={[["При постоянен обем", raw`\Delta T_V=` + temp(state.fixed.t - 300)], ["При постоянно налягане", raw`\Delta T_p=` + temp(state.moving.t - 300)], ["Работа в твърдия съд", "A_V=" + energy(0)], ["Работа под подвижно бутало", "A_p=" + energy(state.moving.a)], ["Моларен капацитет при постоянен обем", raw`C_V=${fmt(state.cv, 2)}\,\mathrm{J/(mol\cdot K)}`], ["Моларен капацитет при постоянно налягане", raw`C_p=${fmt(state.cp, 2)}\,\mathrm{J/(mol\cdot K)}`]]} />
    <p className="mt-3 text-sm"><RichText text={raw`Двете порции са по $\nu=0{,}10\,\mathrm{mol}$, първоначално при $300\,\mathrm K$ и $100\,\mathrm{kPa}$. Топлинният капацитет на съдовете и загубите са пренебрегнати.`} /></p>
  </ThermoPanel>;
}
function EntropyLab() {
  const [q, setQ] = useState(600), [hot, setHot] = useState(400), cold = 300;
  return <ThermoPanel title="Топлообмен между два резервоара">
    <ThermoScene title="Топлина от горещ резервоар към студен резервоар">
      <rect x={25} y={60} width={120} height={125} fill={C.plus} opacity={0.14} /><rect x={255} y={60} width={120} height={125} fill={C.minus} opacity={0.14} />
      <SvgTex x={85} y={120} tex="T_{\text{г}}" color={C.plus} anchor="middle" width={75} fontSize={22} />
      <SvgTex x={315} y={120} tex="T_{\text{с}}" color={C.minus} anchor="middle" width={75} fontSize={22} />
      <Arrow x1={155} y1={125} x2={245} y2={125} color={C.warn} width={2 + q / 300} />
      <SvgTex x={200} y={90} tex="Q" color={C.warn} anchor="middle" width={30} fontSize={18} />
    </ThermoScene>
    <ThermoSlider label={raw`Температура на горещия резервоар: $T_{\text{г}}=${temp(hot)}$`} value={hot} min={310} max={600} step={10} onChange={setHot} />
    <ThermoSlider label={`Пренесена топлина: $Q=${energy(q)}$`} value={q} min={0} max={1200} step={20} onChange={setQ} />
    <ThermoReadout items={[["Студен резервоар", raw`T_{\text{с}}=300\,\mathrm K`], ["Горещ резервоар", raw`\Delta S_{\text{г}}=${fmt(-q / hot, 2)}\,\mathrm{J/K}`], ["Студен резервоар: ентропия", raw`\Delta S_{\text{с}}=${fmt(q / cold, 2)}\,\mathrm{J/K}`], ["Обща промяна", raw`\Delta S=${fmt(q / cold - q / hot, 2)}\,\mathrm{J/K}`]]} />
    <p className="mt-3 text-sm">Резервоарите са толкова големи, че температурите им се приемат за постоянни. Топлината, загубена от единия, е получена от другия.</p>
  </ThermoPanel>;
}
function EngineLab() {
  const [high, setHigh] = useState(300), motion = useThermoMotion(16), data = rectangleCycle(high);
  const corners = [[2, 100], [2, high], [6, high], [6, 100], [2, 100]];
  const leg = Math.min(3, Math.floor(motion.phase * 4)), local = motion.phase * 4 - leg;
  const current = corners[leg].map((v, i) => v + (corners[leg + 1][i] - v) * local);
  return <ThermoPanel title="Работата за един цикъл">
    <ThermoScene title="Правоъгълен цикъл по часовниковата стрелка">
      <PVAxes /><rect x={px(2)} y={py(high)} width={px(6) - px(2)} height={py(100) - py(high)} fill={C.ok} opacity={0.18} />
      <polyline points={corners.map(([v, p]) => px(v) + "," + py(p)).join(" ")} fill="none" stroke={C.minus} strokeWidth={2} />
      {corners.slice(0, 4).map(([v, p], i) => <Point key={i} v={v} p={p} label={String(i + 1)} dy={i === 0 || i === 3 ? 20 : -18} />)}
      <circle data-state-point cx={px(current[0])} cy={py(current[1])} r={7} fill={C.ok} />
    </ThermoScene>
    <ThermoSlider label={raw`Горно налягане: $p_{\text{вис}}=${fmt(high, 0)}\,\mathrm{kPa}$`} value={high} min={180} max={320} step={10} onChange={setHigh} />
    <MotionControls motion={motion} />
    <ThermoReadout items={[["Работа за целия цикъл", "A=" + energy(data.a)], ["КПД на този цикъл", raw`\eta=${fmt(data.efficiency * 100)}\%`], ["Общо получена топлина", "Q_1=" + energy(data.q1)], ["Общо отдадена топлина", "Q_2=" + energy(data.q2)]]} />
    <p className="mt-3 text-sm"><RichText text={raw`Едноатомен газ; долно налягане $100\,\mathrm{kPa}$, крайни обеми $2\,\mathrm L$ и $6\,\mathrm L$. Стойностите са за целия цикъл. Той не е цикъл на Карно.`} /></p>
  </ThermoPanel>;
}
function FridgeLab() {
  const [work, setWork] = useState(200), [epsilon, setEpsilon] = useState(3);
  return <ThermoPanel title="Енергийният баланс на хладилна машина">
    <ThermoScene title="Студен източник, компресор и топло помещение">
      <rect x={130} y={90} width={140} height={110} rx={8} fill="none" stroke={C.wire} strokeWidth={2} />
      <SvgTex x={200} y={143} tex="\Delta U=0" color={C.wire} width={110} anchor="middle" fontSize={18} />
      <Arrow x1={25} y1={145} x2={120} y2={145} color={C.minus} /><SvgTex x={70} y={110} tex="Q_{\text{с}}" color={C.minus} width={65} anchor="middle" fontSize={18} />
      <Arrow x1={280} y1={145} x2={375} y2={145} color={C.plus} /><SvgTex x={330} y={110} tex="Q_{\text{г}}" color={C.plus} width={65} anchor="middle" fontSize={18} />
      <Arrow x1={200} y1={25} x2={200} y2={80} color={C.warn} /><SvgTex x={240} y={45} tex="A'" color={C.warn} width={35} fontSize={18} />
    </ThermoScene>
    <ThermoSlider label={`Внесена работа: $A'=${energy(work)}$`} value={work} min={100} max={600} step={10} onChange={setWork} />
    <ThermoSlider label={raw`Зададен хладилен коефициент: $\varepsilon=${fmt(epsilon)}$`} value={epsilon} min={1} max={5} step={0.1} onChange={setEpsilon} />
    <ThermoReadout items={[["Отнета топлина", raw`Q_{\text{с}}=` + energy(work * epsilon)], ["Отдадена топлина", raw`Q_{\text{г}}=` + energy(work * (epsilon + 1))], ["Коефициент на отопление", raw`\mathrm{COP}_{\text{от}}=` + fmt(epsilon + 1)], ["Промяна за цикъл", raw`\Delta U=0`]]} />
    <p className="mt-3 text-sm">Коефициентът е зададен параметър на модела. Демонстрацията проверява енергийния баланс, без да предсказва характеристиките на конкретен уред.</p>
  </ThermoPanel>;
}
const labs: Record<ThermoLab, () => ReactNode> = { gas: GasLab, collision: CollisionLab, freedom: MolecularFreedom, work: WorkLab, paths: PathsLab, balance: BalanceLab, processes: ProcessLab, heating: HeatingLab, entropy: EntropyLab, engine: EngineLab, fridge: FridgeLab };
export default function ThermodynamicsCourseLab({ kind }: { kind: ThermoLab }) {
  const Lab = labs[kind]; return <Lab />;
}

