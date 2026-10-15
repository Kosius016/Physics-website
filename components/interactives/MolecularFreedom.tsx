"use client";
import { useState } from "react";
import RichText from "@/components/RichText";
import { moleculeModels, moleculeCoordinates, type MoleculeKind, type Vec3 } from "@/lib/thermodynamicsSchool";
import SvgTex from "./SvgTex";
import { Arrow, BTN_PRI, BTN_SEC, C } from "./svg";
import { MotionControls, ThermoPanel, ThermoReadout, ThermoScene, useThermoMotion } from "./ThermoControls";

const project = ([x, y, z]: Vec3): [number, number] => [200 + 0.84 * x - 0.62 * y, 145 + 0.28 * x + 0.42 * y - z];
export default function MolecularFreedom() {
  const [kind, setKind] = useState<MoleculeKind>("N2");
  const [mode, setMode] = useState("tx"), [vibrations, setVibrations] = useState(false);
  const motion = useThermoMotion(6), model = moleculeModels[kind];
  const points = moleculeCoordinates(kind, mode, motion.phase), initial = moleculeCoordinates(kind, mode, 0);
  const center = mode.startsWith("t") ? points.reduce((sum, p, i) => sum.map((v, axis) => v + p[axis] * model.masses[i]) as Vec3, [0, 0, 0] as Vec3).map(v => v / model.masses.reduce((a, b) => a + b, 0)) as Vec3 : [0, 0, 0] as Vec3;
  const [cx, cy] = project(center);
  const s = 3 + model.rotationAxes.length + (vibrations ? 2 * model.vibrationNames.length : 0);
  const choose = (newMode: string) => { setMode(newMode); motion.seek(0); };
  const modeName = mode.startsWith("t") ? "Премества се центърът на масата; връзките не се променят."
    : mode.startsWith("r") ? "Променя се ориентацията; центърът на масата и истинските дължини на връзките се запазват."
    : "Връзките се деформират; центърът на масата остава неподвижен.";
  return <ThermoPanel title="Независими молекулни движения">
    <div className="flex flex-wrap gap-2" role="group" aria-label="Молекула">
      {(Object.keys(moleculeModels) as MoleculeKind[]).map(key => <button type="button" key={key} className={kind === key ? BTN_PRI : BTN_SEC} aria-pressed={kind === key} onClick={() => { setKind(key); setMode("tx"); setVibrations(false); motion.seek(0); }}>
        <RichText text={"$" + moleculeModels[key].tex + "$"} />
      </button>)}
    </div>
    <div className="my-4 space-y-3">
      <div><p className="mb-2 text-sm font-semibold">Постъпателни движения</p><div className="flex flex-wrap gap-2">
        {["x", "y", "z"].map(axis => <button type="button" key={axis} className={mode === "t" + axis ? BTN_PRI : BTN_SEC} aria-pressed={mode === "t" + axis} onClick={() => choose("t" + axis)}><RichText text={"По $" + axis + "$"} /></button>)}
      </div></div>
      <div><p className="mb-2 text-sm font-semibold">Въртеливи движения</p><div className="flex flex-wrap gap-2">
        {model.rotationAxes.length ? model.rotationAxes.map(axis => <button type="button" key={axis} className={mode === "r" + axis ? BTN_PRI : BTN_SEC} aria-pressed={mode === "r" + axis} onClick={() => choose("r" + axis)}><RichText text={"Около $" + axis + "$"} /></button>) : <p className="text-sm text-muted">Няма молекулно въртене в модела на атом като материална точка.</p>}
      </div></div>
      {model.vibrationNames.length > 0 && <div><p className="mb-2 text-sm font-semibold">Трептителни моди</p><div className="flex flex-wrap gap-2">
        {model.vibrationNames.map((name, i) => <button type="button" key={name} className={mode === "v" + i ? BTN_PRI : BTN_SEC} aria-pressed={mode === "v" + i} onClick={() => choose("v" + i)}>{name}</button>)}
      </div></div>}
    </div>
    <ThermoScene title="Пространствена проекция на избраното молекулно движение" height={280}>
      {([["x", [125, 0, 0]], ["y", [0, 125, 0]], ["z", [0, 0, 108]]] as [string, Vec3][]).map(([axis, vector]) => {
        const [x, y] = project(vector); const [nx, ny] = project(vector.map(v => -v * 0.7) as Vec3);
        return <g key={axis}><Arrow x1={nx} y1={ny} x2={x} y2={y} color={C.faint} width={1.3} /><SvgTex x={x + (axis === "y" ? -12 : 12)} y={y + (axis === "z" ? -12 : 2)} tex={axis} color={C.wire} width={24} anchor="middle" fontSize={18} /></g>;
      })}
      {initial.map((p, i) => { const [x, y] = project(p); return <circle key={i} cx={x} cy={y} r={kind === "H2O" && i > 0 ? 9 : 14} fill="none" stroke={C.faint} strokeDasharray="4 4" />; })}
      {model.bonds.map(([a, b]) => { const p = project(points[a]), q = project(points[b]); return <line key={a + ":" + b} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={C.minus} strokeWidth={5} />; })}
      {points.map((p, i) => { const [x, y] = project(p); const radius = kind === "H2O" && i > 0 ? 9 : 14; return <g key={i} data-molecule-atom={i} transform={"translate(" + x + " " + y + ")"}><circle r={radius} fill={C.minus} stroke={C.wire} strokeWidth={1} />{kind === "CO2" && i === 1 && <circle r={5} fill={C.wire} />}</g>; })}
      <path d={"M" + (cx - 5) + " " + cy + "h10 M" + cx + " " + (cy - 5) + "v10"} stroke={C.warn} strokeWidth={2} />
    </ThermoScene>
    <MotionControls motion={motion} />
    <p className="mt-3 text-sm" aria-live="polite">{modeName}</p>
    <p className="mt-2 text-sm text-muted">Кръстчето е центърът на масата. Пунктирът е началното положение. При въртене проекцията на връзката може да се скъсява, но истинската дължина е постоянна.</p>
    {model.vibrationNames.length > 0 && <label className="mt-4 flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1 accent-minus" checked={vibrations} onChange={e => setVibrations(e.target.checked)} />Класически предел: всички показани трептителни моди са напълно активни.</label>}
    <ThermoReadout items={[["Постъпателни приноси", "3"], ["Въртеливи приноси", String(model.rotationAxes.length)], ["Трептителни моди", String(model.vibrationNames.length)], ["Активни енергийни приноси", "s=3+" + model.rotationAxes.length + "+" + (vibrations ? 2 * model.vibrationNames.length : 0) + "=" + s]]} />
    <p className="mt-3 text-sm text-muted"><RichText text={vibrations ? "Всяка активна мода добавя $2$ енергийни приноса: кинетичен и потенциален. Това е класически предел, не модел за всяка температура." : "Броят $s$ е за модела без активни трептения. Изборът на движение показва геометрията; той сам не променя температурния режим."} /></p>
  </ThermoPanel>;
}
