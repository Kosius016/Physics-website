"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import { Arrow, C, STAGE_BG, BTN_PRI, BTN_SEC } from "./svg";
import { ThermoPanel, ThermoScene, ThermoSlider, ThermoReadout, MotionControls, useThermoMotion, formatThermo as fmt } from "./ThermoControls";

type V3 = [number, number, number];
const project = ([x,y,z]: V3, cx=200, cy=145): [number,number] => [cx+Math.sqrt(3)/2*x-y/2,cy+x/4+Math.sqrt(3)/4*y-Math.sqrt(3)/2*z];
const sphere = (theta: number, phi: number, r: number): V3 => [r*Math.sin(theta)*Math.cos(phi),r*Math.sin(theta)*Math.sin(phi),r*Math.cos(theta)];
const curve = (points: V3[], cx=200, cy=145) => points.map(p=>project(p,cx,cy).join(",")).join(" ");
const samples = (f: (t: number)=>V3, steps=90) => Array.from({length:steps+1},(_,i)=>f(i/steps));
function Atom({x,y,label,r=14,muted=false}:{x:number;y:number;label?:string;r?:number;muted?:boolean}) {
  return <g data-molecule-atom transform={`translate(${x} ${y})`} opacity={muted?.25:1}><circle r={r} fill={STAGE_BG} stroke={C.wire} strokeWidth={1.5}/>{label ? <SvgTex x={0} y={0} tex={label} width={2*r} anchor="middle" color={C.wire} fontSize={16}/> : <circle r={r-3} fill={C.minus}/>}</g>;
}
const cross = (x:number,y:number) => <path d={`M${x-4} ${y}h8M${x} ${y-4}v8`} stroke={C.warn} strokeWidth={1.5}/>;

/** Figure 1 of the supplied notes: compare what changes, not unrelated particle clouds. */
export function MolecularMotions() {
  const motion=useThermoMotion(7), [axis,setAxis]=useState(0), phase=motion.phase*2*Math.PI;
  const shift=55*Math.sin(phase), angle=phase, half=57+17*Math.cos(phase);
  const offset: [number,number]=axis===0?[shift,0]:axis===1?[-shift*.65,shift*.45]:[0,-shift];
  return <ThermoPanel title="Трите вида молекулно движение">
    <p className="mb-4 text-sm">Една и съща двуатомна молекула. Сравнете кое се променя спрямо пунктирното начално положение.</p>
    <div className="grid gap-5 sm:grid-cols-3">
      {["Постъпателно","Въртеливо","Трептително"].map((name,i)=><div key={name}>
        <h3 className="mb-2 text-center font-serif font-semibold">{name}</h3>
        <ThermoScene title={name+" движение на двуатомна молекула"} height={240} viewBox={i===0?"60 0 300 240":"90 32 220 176"}>
          {i===0 && <>{[[320,180],[255,215],[285,137]].map(([ax,ay],j)=><g key={j}><Arrow x1={285} y1={180} x2={ax} y2={ay} color={axis===j?C.warn:C.faint} width={1}/><SvgTex x={ax+(j===1?-14:8)} y={ay+(j===2?-13:8)} tex={["x","y","z"][j]} width={22} fontSize={18} color={axis===j?C.warn:C.mut}/></g>)}
            <g opacity={.25}><line x1={145} y1={110} x2={255} y2={110} stroke={C.wire} strokeDasharray="5 5"/><Atom x={145} y={110}/><Atom x={255} y={110}/></g>
            <line x1={145+offset[0]} y1={110+offset[1]} x2={255+offset[0]} y2={110+offset[1]} stroke={C.minus} strokeWidth={3}/><Atom x={145+offset[0]} y={110+offset[1]}/><Atom x={255+offset[0]} y={110+offset[1]}/>{cross(200+offset[0],110+offset[1])}</>}
          {i===1 && <><circle cx={200} cy={120} r={62} stroke={C.faint} strokeDasharray="5 5" fill="none"/><line x1={138} y1={120} x2={262} y2={120} stroke={C.faint} strokeDasharray="5 5"/>
            <line x1={200-62*Math.cos(angle)} y1={120+62*Math.sin(angle)} x2={200+62*Math.cos(angle)} y2={120-62*Math.sin(angle)} stroke={C.minus} strokeWidth={3}/>
            <Atom x={200-62*Math.cos(angle)} y={120+62*Math.sin(angle)}/><Atom x={200+62*Math.cos(angle)} y={120-62*Math.sin(angle)}/>{cross(200,120)}</>}
          {i===2 && <><line x1={143} y1={85} x2={143} y2={160} stroke={C.faint} strokeDasharray="5 5"/><line x1={257} y1={85} x2={257} y2={160} stroke={C.faint} strokeDasharray="5 5"/>
            <Spring left={200-half+14} right={200+half-14} y={120}/><Atom x={200-half} y={120}/><Atom x={200+half} y={120}/>{cross(200,120)}</>}
        </ThermoScene>
        <p className="mt-3 text-sm">{["Центърът на масата се премества. Ориентацията и връзката се запазват.","Ориентацията се изменя. Центърът на масата и дължината се запазват.","Дължината на връзката се изменя. Центърът на масата остава неподвижен."][i]}</p>
      </div>)}
    </div>
    <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Посока на постъпателното движение">{["x","y","z"].map((a,i)=><button type="button" key={a} className={axis===i?BTN_PRI:BTN_SEC} aria-pressed={axis===i} onClick={()=>setAxis(i)}><RichText text={`По $${a}$`}/></button>)}</div>
    <MotionControls motion={motion}/>
    <p className="mt-3 text-sm text-muted">Кръстчето означава центъра на масата. Движенията са отделени, за да се сравнят; в газа могат да протичат едновременно.</p>
  </ThermoPanel>;
}

/** Figure 2: two independent orientation coordinates. */
export function MolecularOrientation() {
  const [theta,setTheta]=useState(55),[phi,setPhi]=useState(35);
  const th=theta*Math.PI/180,ph=phi*Math.PI/180,r=106;
  const p=project(sphere(th,ph,r)),n=project(sphere(Math.PI-th,ph+Math.PI,r));
  return <ThermoPanel title="Защо линейната молекула има два ъгъла">
    <ThermoScene title="Молекулна ос върху помощна сфера с полярен и азимутален ъгъл" height={290}>
      <circle cx={200} cy={145} r={r} fill="none" stroke={C.faint}/>
      <polyline points={curve(samples(t=>sphere(Math.PI/2,t*2*Math.PI,r)))} fill="none" stroke={C.mut} strokeWidth={1}/>
      <polyline points={curve(samples(t=>sphere(t*2*Math.PI,ph,r)))} fill="none" stroke={C.minus} strokeOpacity={.35} strokeWidth={1.5}/>
      <Arrow x1={200} y1={255} x2={200} y2={25} color={C.mut} width={1}/><SvgTex x={200} y={13} tex="z" anchor="middle" width={22} color={C.wire} fontSize={18}/>
      <Arrow x1={200} y1={145} x2={315} y2={178} color={C.mut} width={1}/><SvgTex x={330} y={180} tex="x" width={22} color={C.wire} fontSize={18}/>
      <polyline points={curve(samples(t=>sphere(th*t,ph,43),30))} fill="none" stroke={C.minus} strokeWidth={2}/>
      <polyline points={curve(samples(t=>sphere(Math.PI/2,ph*t,62),40))} fill="none" stroke={C.warn} strokeWidth={2}/>
      <line x1={n[0]} y1={n[1]} x2={p[0]} y2={p[1]} stroke={C.wire} strokeWidth={3}/><Atom x={p[0]} y={p[1]}/><Atom x={n[0]} y={n[1]}/>{cross(200,145)}
      <SvgTex x={345} y={70} tex="\theta" width={30} color={C.minus} fontSize={22}/>
      <SvgTex x={345} y={235} tex="\varphi" width={30} color={C.warn} fontSize={22}/>
    </ThermoScene>
    <ThermoSlider label={`Полярен ъгъл: $\\theta=${theta}^\\circ$`} value={theta} min={15} max={165} onChange={setTheta}/>
    <ThermoSlider label={`Завъртане около полярната ос: $\\varphi=${phi}^\\circ$`} value={phi} min={0} max={360} onChange={setPhi}/>
    <p className="mt-4 text-sm"><RichText text={String.raw`Променете само $\varphi$: избира се друг меридиан. После променете само $\theta$: молекулната ос се накланя по избрания меридиан. $\theta$ се измерва от полярната ос, а $\varphi$ по екватора от посоката $x$. Сферата е помощна конструкция, не повърхност на молекулата.`}/></p>
  </ThermoPanel>;
}

/** Figures 3–4: fixed axis, visibly different effect of rotation about it. */
export function ThirdMolecularAngle() {
  const motion=useThermoMotion(8),[endOn,setEndOn]=useState(false),psi=2*Math.PI*motion.phase;
  const draw=(kind:"linear"|"bent")=>{
    const pts:V3[]=kind==="linear"?[[0,0,75],[0,0,0],[0,0,-75]]:[[0,0,7.25],[-64,0,-58],[64,0,-58]];
    const rotate=([x,y,z]:V3):V3=>[x*Math.cos(psi)-y*Math.sin(psi),x*Math.sin(psi)+y*Math.cos(psi),z];
    const toScreen=(p:V3):[number,number]=>endOn?[200+p[0],130-p[1]]:project(p,200,130);
    const screen=pts.map(p=>toScreen(rotate(p))),labels=kind==="linear"?["\\mathrm O","\\mathrm C","\\mathrm O"]:["\\mathrm O","\\mathrm H","\\mathrm H"];
    return <ThermoScene title={(kind==="linear"?"Линейна":"Огъната")+" молекула при въртене около собствената ос"} height={260} viewBox="90 5 220 250">
      {endOn ? <circle cx={200} cy={130} r={64} fill="none" stroke={C.faint} strokeDasharray="5 5"/> : <Arrow x1={200} y1={238} x2={200} y2={20} color={C.mut} width={1}/>}
      {!endOn&&<SvgTex x={218} y={26} tex="z" width={22} color={C.mut} fontSize={18}/>}
      <g opacity={.25}>{pts.map((p,i)=>{const [x,y]=toScreen(p);return <circle key={i} cx={x} cy={y} r={18} fill="none" stroke={C.wire} strokeDasharray="4 4"/>;})}</g>
      {(kind==="linear"?[[0,1],[1,2]]:[[0,1],[0,2]]).map(([a,b])=><line key={a+":"+b} x1={screen[a][0]} y1={screen[a][1]} x2={screen[b][0]} y2={screen[b][1]} stroke={C.minus} strokeWidth={3}/>)}
      {screen.map(([x,y],i)=>endOn&&kind==="linear"&&i!==1?null:<Atom key={i} x={x} y={y} r={18} label={labels[i]}/>)}
    </ThermoScene>;
  };
  return <ThermoPanel title="Кога е необходим трети ъгъл">
    <div className="mb-4 flex flex-wrap gap-2">{[false,true].map(value=><button type="button" key={String(value)} className={endOn===value?BTN_PRI:BTN_SEC} aria-pressed={endOn===value} onClick={()=>setEndOn(value)}>{value?"Поглед по оста":"Поглед отстрани"}</button>)}</div>
    <div className="grid gap-4 sm:grid-cols-2"><div><h3 className="mb-2 text-center font-serif"><RichText text={String.raw`$\mathrm{CO_2}$ · линейна`}/></h3>{draw("linear")}</div><div><h3 className="mb-2 text-center font-serif"><RichText text={String.raw`$\mathrm{H_2O}$ · огъната`}/></h3>{draw("bent")}</div></div>
    <MotionControls motion={motion}/>
    <ThermoReadout items={[["Трети ъгъл",`\\psi=${fmt(360*motion.phase,0)}^\\circ`],["Без активни трептения",String.raw`s_{\mathrm{CO_2}}=5,\quad s_{\mathrm{H_2O}}=6`]]}/>
    <p className="mt-4 text-sm"><RichText text={String.raw`При $\mathrm{CO_2}$ всички ядра са върху оста и не сменят положението си. При $\mathrm{H_2O}$ водородните ядра са извън нея: завърта се равнината на цялата молекула. Дължините на връзките и ъгълът между тях остават постоянни. Погледът по оста показва тази промяна най-ясно; при линейната молекула ядрата се застъпват в проекцията.`}/></p>
  </ThermoPanel>;
}

function Spring({left,right,y}:{left:number;right:number;y:number}) {
  const points=Array.from({length:25},(_,i)=>[left+(right-left)*i/24,y+(i===0||i===24?0:(i%2?6:-6))].join(",")).join(" ");
  return <polyline points={points} fill="none" stroke={C.minus} strokeWidth={1.5}/>;
}
/** Figure 5: one coordinate, two energy contributions, one conserved sum. */
export function MolecularVibration() {
  const motion=useThermoMotion(7),angle=2*Math.PI*motion.phase,q=Math.cos(angle),u=-Math.sin(angle),half=70+30*q;
  return <ThermoPanel title="Едно трептене, две части на енергията">
    <ThermoScene title="Разтягане на молекулна връзка и превръщане между кинетична и потенциална енергия" height={300}>
      <line x1={130} y1={35} x2={130} y2={145} stroke={C.faint} strokeDasharray="4 4"/><line x1={270} y1={35} x2={270} y2={145} stroke={C.faint} strokeDasharray="4 4"/>
      <Spring left={200-half+16} right={200+half-16} y={85}/><Atom x={200-half} y={85} r={16}/><Atom x={200+half} y={85} r={16}/>{cross(200,85)}
      {Math.abs(u)>.03&&<><Arrow x1={200-half} y1={52} x2={200-half-38*u} y2={52} color={C.warn}/><Arrow x1={200+half} y1={52} x2={200+half+38*u} y2={52} color={C.warn}/></>}
      <line x1={200-half} y1={132} x2={200+half} y2={132} stroke={C.mut}/><SvgTex x={200} y={148} tex="\ell" anchor="middle" color={C.wire} width={25} fontSize={18}/>
      {[{y:195,tex:"E_k",v:u*u,c:C.minus},{y:235,tex:"E_p",v:q*q,c:C.warn},{y:275,tex:"E",v:1,c:C.wire}].map(({y,tex,v,c})=><g key={tex}><SvgTex x={43} y={y} tex={tex} color={c} width={40} fontSize={18}/><rect x={100} y={y-8} width={245} height={16} fill="none" stroke={C.faint}/><rect x={100} y={y-8} width={245*v} height={16} fill={c} opacity={.65}/></g>)}
    </ThermoScene>
    <div className="mt-4 flex flex-wrap gap-2">{[[0,"Разтегната"],[.25,"Равновесна дължина"],[.5,"Свита"]].map(([v,label])=><button type="button" key={v} className={BTN_SEC} onClick={()=>motion.seek(Number(v))}>{label}</button>)}</div>
    <MotionControls motion={motion}/>
    <ThermoReadout items={[["Деформация",`q/q_{\\max}=${fmt(q,2)}`],["Относителна скорост",`u/u_{\\max}=${fmt(u,2)}`],["Кинетична част",`E_k/E=${fmt(u*u,2)}`],["Потенциална част",`E_p/E=${fmt(q*q,2)}`]]}/>
    <p className="mt-4 text-sm"><RichText text={String.raw`Пунктирът показва равновесните положения на ядрата. При максимална деформация скоростта е нула; при равновесната дължина тя е максимална. Общата трептителна енергия $E=E_k+E_p$ е постоянна. Пружината е модел на връзката при малки деформации.`}/></p>
  </ThermoPanel>;
}
