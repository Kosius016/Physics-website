import assert from 'node:assert/strict';
import { heating, energyParts, twoPaths, workProcess, R } from '../lib/thermodynamics.ts';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8, `${a} != ${b}`);
for(const n of [.05,.1,1]) for(const q of [0,10,150,300]) {
  const m=heating(q,n);
  for(const state of [m.fixed,m.moving]) {
    near(state.p*state.v,n*R*state.t);
    near(state.du,1.5*n*R*(state.t-300));
    near(q,state.du+state.work);
  }
  near(m.moving.work,100*(m.moving.v-m.v0));
  assert.ok(m.fixed.t>=m.moving.t);
}
assert.deepEqual(twoPaths(),[{work:400,du:750,q:1150},{work:200,du:750,q:950}]);
for(const v of [1,2,3,4]) {
  near(workProcess(v,false,8).exact,100*(v-2));
  near(workProcess(v,false,8).approximate,100*(v-2));
  const coarse=workProcess(v,true,4),fine=workProcess(v,true,80);
  assert.ok(Math.abs(fine.approximate-fine.exact)<=Math.abs(coarse.approximate-coarse.exact));
}
for(const [r,s,f] of [[0,0,3],[2,0,5],[2,1,7],[3,0,6],[3,3,12]]) {
  const e=energyParts(r,s,1,400);
  assert.equal(e.f,f);
  near(e.translation+e.rotation+e.vibration,f/2*R*400);
  near(e.translation,1.5*R*400);
}
console.log('PASS: ideal-gas law, heating balances, work signs, rectangle convergence, two paths, equipartition.');
