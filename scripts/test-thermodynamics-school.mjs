import assert from "node:assert/strict";
import katex from "katex";
import { readFileSync } from "node:fs";
import { SCHOOL_R, equalHeating, processState, pathState, rectangleCycle, reflection, moleculeModels, moleculeCoordinates } from "../lib/thermodynamicsSchool.ts";
import { thermoLessons } from "../lib/thermodynamicsContent.ts";
import { thermodynamicsCourse } from "../lib/thermodynamicsCourse.ts";
const near=(a,b,tolerance=1e-7)=>assert.ok(Math.abs(a-b)<tolerance, a+" != "+b);
const entries=thermodynamicsCourse.flatMap(s=>s.lessons);
assert.equal(entries.length,13);assert.equal(entries.filter(e=>!e.href).length,4);
assert.equal(Object.keys(thermoLessons).length,9);
let mathCount=0;
function checkStrings(value, key="") {
  if (typeof value==="string") {
    assert.ok(!/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value),"Control character in "+value);
    assert.ok(!value.includes("\u2014"),"Long dash: "+value);
    assert.ok(!/\\int|\\frac\{d[A-Z]/.test(value),"Calculus in core course: "+value);
    if(key==="latex"){katex.renderToString(value,{throwOnError:true});mathCount++;}
    else{
      assert.equal((value.match(/\$/g)||[]).length%2,0,"Unclosed math: "+value);
      for(const [,tex] of value.matchAll(/\$([^$]+)\$/g)){katex.renderToString(tex,{throwOnError:true});mathCount++;}
    }
  } else if(Array.isArray(value))value.forEach(v=>checkStrings(v,key));
  else if(value && typeof value==="object")Object.entries(value).forEach(([k,v])=>checkStrings(v,k));
}
checkStrings(thermoLessons);
for(const lesson of Object.values(thermoLessons)){
  for(const question of [...lesson.quiz,...lesson.sections.flatMap(s=>s.prediction?[s.prediction]:[])]){
    assert.equal(question.options.filter(o=>o.correct).length,1);
    assert.ok(question.options.every(o=>o.why));
  }
}
for(const s of [3,5,6])for(const q of [0,10,150,300]){
  const h=equalHeating(q,s);
  near(h.cp-h.cv,SCHOOL_R);
  for(const state of [h.fixed,h.moving]){
    near(state.p*state.v,0.1*SCHOOL_R*state.t);
    near(state.du,s/2*0.1*SCHOOL_R*(state.t-300));
    near(q,state.du+state.a);
  }
  near(h.moving.a,100*(h.moving.v-h.v0));
  assert.ok(h.fixed.t>=h.moving.t);
}
for(const kind of ["isochoric","isobaric","isothermal","adiabatic"])for(const u of [0,.13,.5,.89,1]){
  const state=processState(kind,u);
  near(state.p*state.v/200,state.t/300);
  near(state.q,state.du+state.a);
  if(kind==="adiabatic"){near(state.q,0);near(state.p*state.v**(5/3),100*2**(5/3));}
  if(kind==="isochoric")near(state.a,0);
  if(kind==="isothermal")near(state.du,0);
}
near(pathState(true,1).du,2400);near(pathState(false,1).du,2400);
near(pathState(true,1).q,3600);near(pathState(false,1).q,2800);
near(rectangleCycle(300).a,800);near(rectangleCycle(300).q1,3600);
near(rectangleCycle(300).q2,2800);
near(reflection(80,0).energyRatio,1);
assert.ok(reflection(80,10).energyRatio<1);assert.ok(reflection(80,-10).energyRatio>1);
for(const [kind,model] of Object.entries(moleculeModels)){
  const modes=[...model.rotationAxes.map(a=>"r"+a),...model.vibrationNames.map((_,i)=>"v"+i)];
  for(const mode of modes)for(const phase of [0,.125,.25,.5,.75,1]){
    const points=moleculeCoordinates(kind,mode,phase);
    for(const axis of [0,1,2])near(points.reduce((sum,p,i)=>sum+p[axis]*model.masses[i],0),0);
    if(mode.startsWith("r"))for(const [a,b] of model.bonds){
      near(Math.hypot(...points[a].map((v,i)=>v-points[b][i])),Math.hypot(...model.points[a].map((v,i)=>v-model.points[b][i])));
    }
  }
}
for(const file of ["components/interactives/ThermodynamicsCourseLabs.tsx","components/interactives/MolecularFreedom.tsx"]){
  const source=readFileSync(file,"utf8");
  assert.ok(!/#(?:[0-9a-f]{3}){1,2}\b/i.test(source),"Local color literal");
  assert.ok(!source.includes(String.fromCharCode(164))&&!source.includes("«{")&&!source.includes(".raw"+String.fromCharCode(96)),"Unexpanded authoring marker");
}
console.log("PASS: textbook map, "+mathCount+" LaTeX expressions, all answer explanations, ideal-gas law, first law, Mayer, Poisson, path dependence, collision energy, molecular centers of mass and rigid bond lengths.");
