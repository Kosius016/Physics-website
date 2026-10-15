"use client";
import { useState } from "react";
import RichText from "@/components/RichText";
import { SCHOOL_R, pathState } from "@/lib/thermodynamicsSchool";
import type { ThermoLab } from "@/lib/thermodynamicsContent";
import SvgTex from "./SvgTex";
import { Arrow, C, BTN_PRI, BTN_SEC } from "./svg";
import { ThermoPanel, ThermoReadout, ThermoScene, ThermoSlider, formatThermo as fmt } from "./ThermoControls";
import { MolecularMotions, MolecularOrientation, ThirdMolecularAngle, MolecularVibration } from "./PdfMoleculeDiagrams";
const raw=String.raw;
const energy=(v:number)=>`${fmt(v)}\\,\\mathrm J`;
const x=(v:number)=>60+v*43,y=(p:number)=>225-p*.52;
function Axes(){return <><Arrow x1={60} y1={225} x2={375} y2={225} color={C.mut} width={1}/><Arrow x1={60} y1={225} x2={60} y2={20} color={C.mut} width={1}/><SvgTex x={382} y={225} tex="V" width={20} fontSize={18} color={C.wire}/><SvgTex x={35} y={23} tex="p" width={20} fontSize={18} color={C.wire}/></>;}

/** Notes, figure 6: the piston displacement and corresponding work area. */
function WorkLab(){
  const [linear,setLinear]=useState(false),[v,setV]=useState(5),[p2,setP2]=useState(100),[pieces,setPieces]=useState(6);
  const p1=linear?300:100,endP=linear?p2:p1,work=(p1+endP)/2*(v-2),left=x(2),right=x(v);
  return <ThermoPanel title="От преместването на буталото към лицето под графиката">
    <div className="mb-4 flex flex-wrap gap-2">{[false,true].map(value=><button type="button" key={String(value)} className={value===linear?BTN_PRI:BTN_SEC} aria-pressed={linear===value} onClick={()=>setLinear(value)}>{value?"Променящо се налягане":"Постоянно налягане"}</button>)}</div>
    <div className="grid gap-4 sm:grid-cols-2">
      <div><h3 className="mb-2 text-center font-serif">Бутало</h3><ThermoScene title="Лице на буталото и изместен обем" height={285}>
        <path d="M350 55H60V190H350" fill="none" stroke={C.wire} strokeWidth={2}/>
        <rect x={left} y={55} width={right-left} height={135} fill={C.minus} opacity={.13}/><line x1={left} y1={55} x2={left} y2={190} stroke={C.faint} strokeDasharray="5 5"/>
        <line x1={right} y1={55} x2={right} y2={190} stroke={C.wire} strokeWidth={6}/><line x1={right} y1={122} x2={right+35} y2={122} stroke={C.wire} strokeWidth={3}/>
        <Arrow x1={right-62} y1={115} x2={right-8} y2={115} color={C.minus}/><SvgTex x={right-45} y={87} tex="F=pS" width={75} anchor="middle" fontSize={18} color={C.minus}/>
        <SvgTex x={right+12} y={168} tex="S" color={C.wire} width={25} fontSize={18}/>
        <line x1={left} y1={220} x2={right} y2={220} stroke={C.warn}/><path d={`M${left} 214v12M${right} 214v12`} stroke={C.warn}/><SvgTex x={(left+right)/2} y={243} tex="\Delta x" width={50} anchor="middle" color={C.warn} fontSize={20}/>
      </ThermoScene></div>
      <div><h3 className="mb-2 text-center font-serif">Работа на газа</h3><ThermoScene title="Работа като лице на правоъгълник или трапец" height={285}>
        <Axes/><path d={`M${left} 225V${y(p1)}L${right} ${y(endP)}V225Z`} fill={C.minus} opacity={.16}/>
        {linear&&Array.from({length:pieces},(_,i)=>{const width=(right-left)/pieces,pressure=p1+(endP-p1)*(i+.5)/pieces;return <rect key={i} x={left+i*width} y={y(pressure)} width={width} height={225-y(pressure)} fill="none" stroke={C.mut} strokeWidth={.7}/>;})}
        <Arrow x1={left} y1={y(p1)} x2={right} y2={y(endP)} color={C.minus} width={2}/>
        <SvgTex x={left} y={246} tex="V_1" anchor="middle" width={30} color={C.wire} fontSize={18}/><SvgTex x={right} y={246} tex="V_2" anchor="middle" width={30} color={C.wire} fontSize={18}/>
        <SvgTex x={31} y={y(p1)} tex={linear?"p_1":"p"} width={28} color={C.wire} fontSize={18}/>
        {linear&&Math.abs(endP-p1)>60&&<SvgTex x={31} y={y(endP)} tex="p_2" width={28} color={C.wire} fontSize={18}/>}
      </ThermoScene></div>
    </div>
    <ThermoSlider label={raw`Краен обем: $V_2=${fmt(v)}\,\mathrm L$`} value={v} min={3} max={6} step={.1} onChange={setV}/>
    {linear&&<><ThermoSlider label={raw`Крайно налягане: $p_2=${fmt(p2,0)}\,\mathrm{kPa}$`} value={p2} min={50} max={300} step={10} onChange={setP2}/><ThermoSlider label={`Брой тесни правоъгълници: $${pieces}$`} value={pieces} min={2} max={20} onChange={setPieces}/></>}
    <ThermoReadout items={[["Начален обем",raw`V_1=2\,\mathrm L`],["Начално налягане",raw`p_1=${p1}\,\mathrm{kPa}`],["Изместен обем",raw`\Delta V=S\Delta x=${fmt(v-2)}\,\mathrm L`],["Работа",`A=${energy(work)}`]]}/>
    <p className="mt-4 text-sm"><RichText text={linear?raw`При линейно променящо се налягане общото лице е трапец. Правоъгълниците показват разделяне на процеса на малки изменения на обема. Повече участъци приближават формата по-добре. За права линия и средни височини сумата на лицата е точно лицето на трапеца.`:raw`Оцветеният обем е $S\Delta x$. Същото разширение задава ширината $\Delta V$ на правоъгълника вдясно. Височината е $p$, затова лицето му е $p\Delta V$. Показано е бавно разширение; при обратно свиване работата сменя знака.`}/></p>
  </ThermoPanel>;
}
function PathsLab(){
  const [high,setHigh]=useState(true),[progress,setProgress]=useState(1),state=pathState(high,progress);
  const extent=high?Math.max(0,progress*2-1):Math.min(1,progress*2),pressure=high?300:100;
  return <ThermoPanel title="Едни крайни състояния, различни лица">
    <div className="mb-4 flex flex-wrap gap-2">{[true,false].map(value=><button type="button" key={String(value)} className={high===value?BTN_PRI:BTN_SEC} aria-pressed={high===value} onClick={()=>setHigh(value)}>{value?"Първо нагряване":"Първо разширение"}</button>)}</div>
    <ThermoScene title="Два пътя между състоянията и натрупана работа" height={275}>
      <Axes/><rect x={x(2)} y={y(pressure)} width={4*43*extent} height={225-y(pressure)} fill={C.minus} opacity={.16}/>
      <path d={`M${x(2)} ${y(100)}V${y(300)}H${x(6)}`} fill="none" stroke={high?C.minus:C.faint} strokeWidth={high?2.5:1}/>
      <path d={`M${x(2)} ${y(100)}H${x(6)}V${y(300)}`} fill="none" stroke={high?C.faint:C.minus} strokeWidth={high?1:2.5}/>
      <SvgTex x={x(2)+12} y={y(100)+20} tex="1" width={20} color={C.wire} fontSize={18}/><SvgTex x={x(6)+12} y={y(300)-18} tex="2" width={20} color={C.wire} fontSize={18}/>
      <circle data-state-point cx={x(state.v)} cy={y(state.p)} r={6} fill={C.warn}/>
      <SvgTex x={x(2)} y={247} tex="V_1" width={32} anchor="middle" color={C.wire} fontSize={18}/><SvgTex x={x(6)} y={247} tex="V_2" width={32} anchor="middle" color={C.wire} fontSize={18}/>
    </ThermoScene>
    <ThermoSlider label={`Измината част от пътя: $${fmt(progress*100,0)}\\%$`} value={progress} min={0} max={1} step={.01} onChange={setProgress}/>
    <ThermoReadout items={[["Работа",`A=${energy(state.a)}`],["Промяна на вътрешната енергия",raw`\Delta U=${energy(state.du)}`],["Получена топлина",`Q=${energy(state.q)}`],["Текущо състояние",raw`p=${fmt(state.p,0)}\,\mathrm{kPa},\ V=${fmt(state.v)}\,\mathrm L`]]}/>
    <p className="mt-4 text-sm">По вертикалния участък оцветеното лице не нараства. При разширение на по-високо налягане лицето е по-голямо. Сравнете двата пътя при достигнато крайно състояние.</p>
  </ThermoPanel>;
}
/** Figure 8 and problem I.13: show all three processes together. */
function ProcessDiagrams(){
  const [axes,setAxes]=useState<"pV"|"pT"|"TV">("pV");
  const position=(p:number,v:number,t:number):[number,number]=>axes==="pV"?[55+v*115,225-p*88]:axes==="pT"?[55+t*115,225-p*88]:[55+v*115,225-t*88];
  return <ThermoPanel title="Трите изопроцеса в една координатна система">
    <div className="mb-5 flex flex-wrap gap-2">{(["pV","pT","TV"] as const).map(key=><button type="button" key={key} className={axes===key?BTN_PRI:BTN_SEC} aria-pressed={axes===key} onClick={()=>setAxes(key)}><RichText text={`$${key[0]}(${key[1]})$`}/></button>)}</div>
    <div className="grid gap-4 sm:grid-cols-3">{["Изохора","Изобара","Изотерма"].map((name,kind)=>{
      const pts=Array.from({length:60},(_,i)=>{const a=i/59;return kind===0?position(1+a,1,1+a):kind===1?position(1,1+a,1+a):position(1/(1+a),1+a,1);});
      const first=pts[0],last=pts[59];
      return <div key={name}><h3 className="mb-2 text-center font-serif">{name}</h3><ThermoScene title={name+" в "+axes} height={280}>
        <Arrow x1={55} y1={225} x2={365} y2={225} color={C.mut} width={1}/><Arrow x1={55} y1={225} x2={55} y2={22} color={C.mut} width={1}/>
        <SvgTex x={375} y={225} tex={axes[1]} width={24} color={C.wire} fontSize={22}/><SvgTex x={28} y={26} tex={axes[0]} width={24} color={C.wire} fontSize={22}/>
        {axes==="pV"&&kind!==0&&<polygon points={`${first[0]},225 ${pts.map(p=>p.join(",")).join(" ")} ${last[0]},225`} fill={C.minus} opacity={.18}/>}
        <polyline points={pts.map(p=>p.join(",")).join(" ")} fill="none" stroke={C.minus} strokeWidth={2.5}/><Arrow x1={pts[34][0]} y1={pts[34][1]} x2={pts[43][0]} y2={pts[43][1]} color={C.minus} width={2}/>
        <circle cx={first[0]} cy={first[1]} r={4} fill={C.wire}/><circle cx={last[0]} cy={last[1]} r={4} fill={C.wire}/>
        <SvgTex x={first[0]-22} y={first[1]+20} tex="1" width={22} fontSize={20} color={C.wire}/><SvgTex x={last[0]+12} y={last[1]-18} tex="2" width={22} fontSize={20} color={C.wire}/>
      </ThermoScene><p className="mt-3 text-center text-sm"><RichText text={[raw`$V=\mathrm{const}$`,raw`$p=\mathrm{const}$`,raw`$T=\mathrm{const}$`][kind]}/></p></div>;
    })}</div>
    <p className="mt-4 text-sm"><RichText text={raw`Всеки процес започва от същото състояние: $(p_0,V_0,T_0)$. При изохората и изобарата $T_2=2T_0$; при изотермата $V_2=2V_0$. Смяната на осите променя вида на линията, но не и процеса. Само в $p(V)$ оцветеното лице означава работа.`}/></p>
  </ThermoPanel>;
}
/** Figure 11 compares equal temperature rise, not equal input heat. */
function HeatingLab(){
  const [dt,setDt]=useState(60),[s,setS]=useState(3),nu=.1,t0=300;
  const du=s/2*nu*SCHOOL_R*dt,a=nu*SCHOOL_R*dt;
  return <ThermoPanel title="Еднакво нагряване, различна необходима топлина">
    <div className="mb-4 flex flex-wrap gap-2">{[3,5].map(n=><button type="button" key={n} className={s===n?BTN_PRI:BTN_SEC} aria-pressed={s===n} onClick={()=>setS(n)}>{n===3?"Хелий":"Азот без активни трептения"}</button>)}</div>
    <div className="grid gap-4 sm:grid-cols-2">{[false,true].map(moving=>{
      const top=moving?115-85*dt/t0:115;
      return <div key={String(moving)}><h3 className="mb-2 text-center font-serif">{moving?"Подвижно бутало":"Твърд съд"}</h3><ThermoScene title={moving?"Разширение при постоянно налягане":"Нагряване при постоянен обем"} height={260}>
        <rect x={90} y={top} width={220} height={200-top} fill={C.minus} opacity={.1}/>
        <path d={moving?"M90 35V200H310V35":"M90 115V200H310V115Z"} fill="none" stroke={C.wire} strokeWidth={2}/><line x1={90} y1={top} x2={310} y2={top} stroke={C.wire} strokeWidth={moving?5:2}/>
        {moving&&<><line x1={90} y1={115} x2={310} y2={115} stroke={C.faint} strokeDasharray="5 5"/>{dt>0&&<Arrow x1={332} y1={115} x2={332} y2={top} color={C.warn}/>}</>}
        <SvgTex x={200} y={156} tex={moving?"p=\\mathrm{const}":"V=\\mathrm{const}"} width={160} anchor="middle" fontSize={21} color={C.wire}/>
        <Arrow x1={200} y1={249} x2={200} y2={210} color={C.plus}/><SvgTex x={237} y={234} tex={moving?"Q_p":"Q_V"} width={45} color={C.plus} fontSize={20}/>
      </ThermoScene></div>;
    })}</div>
    <ThermoSlider label={raw`Еднакво повишение на температурата: $\Delta T=${dt}\,\mathrm K$`} value={dt} min={0} max={150} step={5} onChange={setDt}/>
    <ThermoReadout items={[["Вътрешна енергия и в двата съда",raw`\Delta U=${energy(du)}`],["Работа при разширението",`A_p=${energy(a)}`],["Топлина в твърдия съд",`Q_V=${energy(du)}`],["Топлина под буталото",`Q_p=${energy(du+a)}`]]}/>
    <p className="mt-4 text-sm"><RichText text={raw`Порциите са еднакви: $n=0{,}10\,\mathrm{mol}$, първоначално при $T_1=300\,\mathrm K$ и $p_1=100\,\mathrm{kPa}$. До една и съща крайна температура промяната на $U$ е еднаква. Под буталото е нужна допълнителна топлина за работата: $Q_p-Q_V=p\Delta V=n R\Delta T$. Капацитетът на съдовете и топлинните загуби са пренебрегнати.`}/></p>
  </ThermoPanel>;
}
export default function ThermodynamicsPdfLab({kind}:{kind:ThermoLab}) {
  switch(kind){case "motions":return <MolecularMotions/>;case "orientation":return <MolecularOrientation/>;case "third-angle":return <ThirdMolecularAngle/>;case "vibration":return <MolecularVibration/>;case "work":return <WorkLab/>;case "paths":return <PathsLab/>;case "processes":return <ProcessDiagrams/>;case "heating":return <HeatingLab/>;}
}
