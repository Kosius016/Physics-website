"use client";

import { useState, type ReactNode } from "react";
import RichText from "@/components/RichText";
import { circularInterval, motionState, returnTrip, velocityComponents, type MotionKind } from "@/lib/speedAcceleration";
import SvgTex from "./SvgTex";
import { dec, Legend, RangeControl, Readouts, Stage, StageScroll, useClock } from "./acPlot";
import { Arrow, BTN_SEC, C, DRAWING_FONT_FAMILY, PANEL_CLASS, STAGE_CLASS, TexChip } from "./svg";

const q = (value: number) => Math.round(value * 1e6) / 1e6;

function Scene({ title, children, height = 270 }: { title: string; children: ReactNode; height?: number }) {
  return <StageScroll minWidth={260} maxWidth={620}>
    <svg viewBox={`0 0 480 ${height}`} role="img" aria-label={title} className={STAGE_CLASS} style={{ fontFamily: DRAWING_FONT_FAMILY }}>
      <Stage w={480} h={height} />{children}
    </svg>
  </StageScroll>;
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return <figure className={`${PANEL_CLASS} my-6 w-full min-w-0`}>
    <figcaption className="mb-4 font-serif text-lg font-bold">{title}</figcaption>{children}
  </figure>;
}

function Label({ x, y, tex, color = C.mut }: { x: number; y: number; tex: string; color?: string }) {
  return <SvgTex x={q(x)} y={q(y)} tex={tex} color={color} anchor="middle" fontSize={18} width={75} />;
}

export function AverageVelocityLab() {
  const [t, setT] = useState(4);
  const state = returnTrip(t);
  const x = 70 + state.x * 40;
  return <Panel title="Отиване и връщане по права">
    <p className="mb-4 text-sm text-muted">Тялото се движи равномерно до края на отсечката, обръща посоката и се връща със същата големина на скоростта. Моментът на обръщане е идеализиран.</p>
    <Scene title="Положението на тялото при отиване и връщане" height={190}>
      <Arrow x1={45} y1={130} x2={445} y2={130} color={C.faint} width={1.5} />
      <Label x={449} y={154} tex="x" /><Label x={70} y={154} tex="O" />
      <line x1={70} y1={74} x2={390} y2={74} stroke={C.faint} strokeWidth={5} />
      <line x1={70} y1={74} x2={t <= 4 ? x : 390} y2={74} stroke={C.warn} strokeWidth={4} />
      {t > 4 && <line x1={390} y1={87} x2={x} y2={87} stroke={C.warn} strokeWidth={4} />}
      {state.x > 0.1 && <Arrow x1={70} y1={111} x2={x} y2={111} color={C.ok} />}
      <circle cx={x} cy={74} r={8} fill={C.wire} stroke={C.minus} strokeWidth={3} />
      <Label x={230} y={40} tex={String.raw`\Delta\vec r`} color={C.ok} />
    </Scene>
    <div className="mt-4"><RangeControl label="Изминало време" min={0.5} max={8} step={0.5} value={t} onChange={setT} valueTex={`${dec(t, 1)}\\,\\mathrm{s}`} /></div>
    <Readouts cells={[
      { label: "Път", tex: `s=${dec(state.path, 0)}\\,\\mathrm{m}` },
      { label: "Преместване по оста", tex: `\\Delta x=${dec(state.x, 0)}\\,\\mathrm{m}` },
      { label: "Средна скорост по пътя", tex: String.raw`2\,\mathrm{m/s}` },
      { label: "Средна скорост по оста", tex: `${dec(state.average)}\\,\\mathrm{m/s}` },
    ]} />
    <p className="mt-3 text-sm"><RichText text={t === 8 ? String.raw`Тялото се върна в $O$: $\Delta\vec r=0$, но $s=16\,\mathrm{m}$. Затова средната векторна скорост е нула, а средната скорост по изминатия път не е.` : "Преместете плъзгача до края и сравнете двете средни величини."} /></p>
  </Panel>;
}

export function InstantVelocityLab() {
  const [dt, setDt] = useState(2);
  const d = circularInterval(dt);
  const px = q(95 + 72 * d.dx);
  const py = q(223 - 72 * d.dy);
  return <Panel title="Скоростта при скъсяване на интервала">
    <p className="mb-4 text-sm text-muted"><RichText text={String.raw`Първото положение е фиксирано. Приближете второто, като намалите $\Delta t$. Тялото се движи по окръжност с постоянна големина на скоростта $2\,\mathrm{m/s}$.`} /></p>
    <Scene title="Хорда и допирателна към траекторията" height={290}>
      <path d="M 95 223 A 288 288 0 0 0 363.43 39.36" fill="none" stroke={C.faint} strokeWidth={2} />
      <line x1={45} y1={223} x2={440} y2={223} stroke={C.mut} strokeDasharray="6 6" />
      <Arrow x1={95} y1={223} x2={px} y2={py} color={C.minus} width={3} />
      <Arrow x1={95} y1={223} x2={239} y2={223} color={C.ok} width={3} />
      <circle cx={95} cy={223} r={5} fill={C.wire} /><circle cx={px} cy={py} r={5} fill={C.wire} />
      <Label x={80} y={251} tex="1" color={C.wire} />
      <Label x={px + 15} y={py - 24} tex="2" color={C.wire} />
      <Label x={268} y={248} tex={String.raw`\vec v_1`} color={C.ok} />
    </Scene>
    <Legend items={[{ color: C.minus, tex: String.raw`Преместване $\Delta\vec r$` }, { color: C.ok, tex: String.raw`Моментна скорост $\vec v_1$` }]} />
    <p className="mt-2 text-xs text-muted">Дължините на стрелките за преместване и скорост използват различни мащаби: величините имат различни мерни единици. Сравнявайте посоките им.</p>
    <div className="mt-4"><RangeControl label="Времеви интервал" min={0.1} max={2} step={0.1} value={dt} onChange={setDt} valueTex={`${dec(dt, 1)}\\,\\mathrm{s}`} /></div>
    <Readouts cells={[
      { label: "Дължина на хордата", tex: `${dec(d.chord, 5)}\\,\\mathrm{m}` },
      { label: "Дължина на дъгата", tex: `${dec(d.path, 5)}\\,\\mathrm{m}` },
      { label: "Средна скорост по x", tex: `${dec(d.vx, 3)}\\,\\mathrm{m/s}` },
      { label: "Средна скорост по y", tex: `${dec(d.vy, 3)}\\,\\mathrm{m/s}` },
    ]} />
    <p className="mt-3 text-sm"><RichText text={String.raw`При намаляване на интервала компонентите се приближават до $v_x=2\,\mathrm{m/s}$ и $v_y=0$. Хордата е по-къса от дъгата при всеки показан интервал.`} /></p>
  </Panel>;
}

export function VelocityComponentsLab() {
  const [angle, setAngle] = useState(40);
  const [speed, setSpeed] = useState(4);
  const v = velocityComponents(speed, angle);
  const x = q(240 + v.x * 25), y = q(180 - v.y * 25);
  return <Panel title="Проекции на скоростта по осите">
    <Scene title="Вектор на скоростта и неговите компоненти" height={360}>
      <Arrow x1={35} y1={180} x2={440} y2={180} color={C.faint} width={1.5} />
      <Arrow x1={240} y1={325} x2={240} y2={30} color={C.faint} width={1.5} />
      <Label x={450} y={202} tex="x" /><Label x={264} y={28} tex="y" /><Label x={222} y={201} tex="O" />
      <path d={`M ${x} 180 V ${y} H 240`} fill="none" stroke={C.faint} strokeDasharray="5 5" />
      {Math.abs(v.x) > 0.01 && <Arrow x1={240} y1={180} x2={x} y2={180} color={C.minus} width={3} />}
      {Math.abs(v.y) > 0.01 && <Arrow x1={240} y1={180} x2={240} y2={y} color={C.warn} width={3} />}
      <Arrow x1={240} y1={180} x2={x} y2={y} color={C.ok} width={3} />
      <circle cx={x} cy={y} r={4} fill={C.wire} />
      <Label x={405} y={36} tex={String.raw`\vec v`} color={C.ok} />
    </Scene>
    <Legend items={[{color: C.minus, tex: String.raw`$v_x\hat i$`}, {color: C.warn, tex: String.raw`$v_y\hat j$`}, {color: C.ok, tex: String.raw`$\vec v$`}]} />
    <div className="mt-4 space-y-4">
      <RangeControl label={<RichText text="Ъгъл от положителната посока на $x$" />} min={0} max={360} step={5} value={angle} onChange={setAngle} valueTex={`${angle}^{\\circ}`} />
      <RangeControl label="Големина на скоростта" min={1} max={5} step={0.5} value={speed} onChange={setSpeed} valueTex={`${dec(speed, 1)}\\,\\mathrm{m/s}`} />
    </div>
    <Readouts cols={3} cells={[{label: "По x", tex: `v_x=${dec(v.x)}\\,\\mathrm{m/s}`}, {label: "По y", tex: `v_y=${dec(v.y)}\\,\\mathrm{m/s}`}, {label: "Големина", tex: `v=${dec(speed, 1)}\\,\\mathrm{m/s}`}]} />
    <p className="mt-3 text-sm">Завъртете вектора през всички четвъртини. Знаците показват посоките на проекциите, а големината на скоростта остава положителна.</p>
  </Panel>;
}

const motions: { kind: MotionKind; label: string }[] = [
  {kind: "faster", label: "Ускоряване по права"}, {kind: "slower", label: "Забавяне по права"}, {kind: "turn", label: "Равномерно движение в завой"},
];

export function AccelerationMotionLab() {
  const [kind, setKind] = useState<MotionKind>("turn");
  const [playing, setPlaying] = useState(false);
  const { turns, setTurns } = useClock(playing, 0.45);
  const t = turns > 4 ? turns % 4 : turns;
  const s = motionState(kind, t);
  const x = q(70 + s.x * 40), y = q(285 - s.y * 40);
  const trajectory = Array.from({length: 81}, (_, i) => {
    const p = motionState(kind, i / 20);
    return `${i ? "L" : "M"} ${q(70 + p.x * 40)} ${q(285 - p.y * 40)}`;
  }).join(" ");
  return <Panel title="Скорост и ускорение на движещо се тяло">
    <div className="mb-4 flex flex-wrap gap-2">{motions.map(m => <button type="button" key={m.kind} className={`${BTN_SEC} aria-pressed:bg-hl aria-pressed:shadow-none`} aria-pressed={kind === m.kind} onClick={() => {setKind(m.kind); setTurns(0); setPlaying(false);}}>{m.label}</button>)}</div>
    <Scene title="Посоки на моментната скорост и ускорението" height={345}>
      <path d={trajectory} fill="none" stroke={C.faint} strokeWidth={3} />
      <Arrow x1={45} y1={285} x2={445} y2={285} color={C.faint} width={1} />
      <Arrow x1={70} y1={312} x2={70} y2={35} color={C.faint} width={1} />
      <Label x={52} y={309} tex="O" /><Label x={450} y={309} tex="x" /><Label x={91} y={32} tex="y" />
      <Arrow x1={x} y1={y} x2={x + s.vx * 25} y2={y - s.vy * 25} color={C.minus} width={3} />
      <Arrow x1={x} y1={y} x2={x + s.ax * 60} y2={y - s.ay * 60} color={C.plus} width={3} />
      <circle cx={x} cy={y} r={6} fill={C.wire} />
    </Scene>
    <Legend items={[{color: C.minus, tex: String.raw`Моментна скорост $\vec v$`}, {color: C.plus, tex: String.raw`Моментно ускорение $\vec a$`}]} />
    <p className="mt-2 text-xs text-muted">Двете величини са с различни мащаби. Сравнявайте посоките им, не дължината на синята спрямо червената стрелка.</p>
    <div className="mt-4"><RangeControl label="Момент от движението" value={t} min={0} max={4} step={0.05} onChange={value => {setPlaying(false); setTurns(value);}} valueTex={`${dec(t)}\\,\\mathrm{s}`} /></div>
    <div className="mt-3 flex gap-2"><button type="button" className={BTN_SEC} onClick={() => setPlaying(p => !p)}>{playing ? "Пауза" : "Пуснете движението"}</button><button type="button" className={BTN_SEC} onClick={() => {setPlaying(false); setTurns(0);}}>Отначало</button></div>
    <Readouts cols={3} cells={[{label: "Големина на скоростта", tex: `${dec(Math.hypot(s.vx, s.vy))}\\,\\mathrm{m/s}`}, {label: "Ускорение по x", tex: `${dec(s.ax)}\\,\\mathrm{m/s^2}`}, {label: "Ускорение по y", tex: `${dec(s.ay)}\\,\\mathrm{m/s^2}`}]} />
    <p className="mt-3 text-sm">{kind === "turn" ? "Големината на скоростта не се променя. Скоростта е по допирателната, а ускорението е към центъра на окръжността." : kind === "faster" ? "Скоростта и ускорението са еднопосочни. За еднакви времена тялото изминава все по-голям път." : "Скоростта е надясно, а ускорението наляво. В показания интервал тялото се забавя, без да обръща посоката."}</p>
  </Panel>;
}

export function VelocityChangeLab() {
  const [shift, setShift] = useState(0);
  const [angle, setAngle] = useState(60);
  const [dt, setDt] = useState(1);
  const v = velocityComponents(2, angle);
  const ox = 95 + 185 * (1 - shift), oy = 205 - 20 * (1 - shift);
  const end1 = {x: 215, y: 205}, end2 = {x: 95 + v.x * 60, y: 205 - v.y * 60};
  return <Panel title="Построяване на промяната на скоростта">
    <p className="mb-4 text-sm text-muted"><RichText text={String.raw`Двете скорости имат еднаква големина $2\,\mathrm{m/s}$. Първо ги пренесете до общо начало. После проследете стрелката от върха на $\vec v_1$ към върха на $\vec v_2$. Това е схема на вектори, не траектория.`} /></p>
    <Scene title="Изваждане на векторите на скоростта" height={290}>
      <g opacity={shift > 0 ? 0.25 : 1}>
        <circle cx={280} cy={185} r={4} fill={C.wire} />
        {shift > 0 && <Arrow x1={280} y1={185} x2={280 + v.x * 60} y2={185 - v.y * 60} color={C.faint} />}
      </g>
      <Arrow x1={95} y1={205} x2={end1.x} y2={end1.y} color={C.minus} width={3} />
      <Arrow x1={ox} y1={oy} x2={ox + v.x * 60} y2={oy - v.y * 60} color={C.minus} width={3} />
      <Label x={167} y={236} tex={String.raw`\vec v_1`} color={C.minus} />
      <Label x={ox + v.x * 60} y={oy - v.y * 60 - 24} tex={String.raw`\vec v_2`} color={C.minus} />
      {shift === 1 && <>
        <Arrow x1={end1.x} y1={end1.y} x2={end2.x} y2={end2.y} color={C.ok} width={3} />
        <TexChip x={q((end1.x + end2.x) / 2 + 22)} y={q((end1.y + end2.y) / 2)} tex={String.raw`\Delta\vec v`} color={C.ok} width={45} fontSize={18} />
      </>}
      <circle cx={95} cy={205} r={4} fill={C.wire} />
    </Scene>
    <div className="mt-4 space-y-4">
      <RangeControl label="Пренасяне до общо начало" min={0} max={1} step={0.05} value={shift} onChange={setShift} valueTex={`${Math.round(shift * 100)}\\%`} />
      <RangeControl label="Промяна на посоката" min={30} max={120} step={5} value={angle} onChange={setAngle} valueTex={`${angle}^{\\circ}`} />
      <RangeControl label="Време за тази промяна" min={0.5} max={2} step={0.25} value={dt} onChange={setDt} valueTex={`${dec(dt)}\\,\\mathrm{s}`} />
    </div>
    {shift === 1 ? <>
      <Readouts cells={[{label: "Промяна по x", tex: `${dec(v.x - 2)}\\,\\mathrm{m/s}`}, {label: "Промяна по y", tex: `${dec(v.y)}\\,\\mathrm{m/s}`}, {label: "Средно ускорение по x", tex: `${dec((v.x - 2) / dt)}\\,\\mathrm{m/s^2}`}, {label: "Средно ускорение по y", tex: `${dec(v.y / dt)}\\,\\mathrm{m/s^2}`}]} />
      <p className="mt-3 text-sm">Намалете времето, без да променяте векторите. Същата промяна за по-кратко време означава по-голямо средно ускорение.</p>
    </> : <p className="mt-4 text-sm text-muted">Доведете пренасянето докрай, за да се появят разликата и компонентите на средното ускорение.</p>}
  </Panel>;
}

export function DerivativeLab() {
  const [h, setH] = useState(1);
  const x = (t: number) => 60 + t * 90;
  const y = (t: number) => 260 - t * t * 22;
  return <Panel title="Наклон на графиката на координатата">
    <Scene title="Секуща и допирателна на графиката x(t)" height={310}>
      <Arrow x1={60} y1={260} x2={430} y2={260} color={C.faint} />
      <Arrow x1={60} y1={260} x2={60} y2={30} color={C.faint} />
      <Label x={440} y={283} tex="t" /><Label x={40} y={32} tex="x" /><Label x={44} y={278} tex="O" />
      <path d={Array.from({length: 65}, (_, i) => `${i ? "L" : "M"} ${q(x(i / 20))} ${q(y(i / 20))}`).join(" ")} fill="none" stroke={C.wire} strokeWidth={2} />
      <line x1={x(1)} y1={260} x2={x(3.2)} y2={260 - (4 * 3.2 - 4) * 22} stroke={C.ok} strokeWidth={2} />
      <line x1={x(2)} y1={y(2)} x2={x(2 + h)} y2={y(2 + h)} stroke={C.minus} strokeWidth={4} />
      <circle cx={x(2)} cy={y(2)} r={5} fill={C.wire} /><circle cx={x(2 + h)} cy={y(2 + h)} r={5} fill={C.minus} />
    </Scene>
    <Legend items={[{color: C.wire, tex: String.raw`Координата $x(t)$`}, {color: C.minus, tex: "Секуща"}, {color: C.ok, tex: "Допирателна"}]} />
    <div className="mt-4"><RangeControl label="Интервал след втората секунда" min={0.01} max={1} step={0.01} value={h} onChange={setH} valueTex={`${dec(h)}\\,\\mathrm{s}`} /></div>
    <Readouts cols={3} cells={[{label: "Средна скорост по x", tex: `${dec(4 + h)}\\,\\mathrm{m/s}`}, {label: "Моментна скорост по x", tex: String.raw`4\,\mathrm{m/s}`}]} />
  </Panel>;
}
