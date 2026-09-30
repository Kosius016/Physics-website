import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import katex from "katex";

const source = readFileSync("lib/problemSets/limits.ts", "utf8");
const context = { exports: {} };
vm.runInNewContext(ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, context);
const { limitProblems, limitProblemGroups } = context.exports;
assert.equal(limitProblems.length, 30);
assert.equal(new Set(limitProblems.map(p => p.id)).size, 30);
for (let id = 1; id <= 30; id++) {
  assert.equal(limitProblems[id - 1].id, id);
  assert.equal(limitProblemGroups.filter(g => id >= g.range[0] && id <= g.range[1]).length, 1);
}
let formulaCount = 0;
function formula(text) {
  katex.renderToString(text, { throwOnError: true, strict: "error" });
  formulaCount++;
}
function prose(text) {
  assert.ok(!/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text), "Control character in lesson text");
  const pieces = text.split("$");
  assert.equal(pieces.length % 2, 1, "Unbalanced math delimiter: " + text);
  for (let i = 1; i < pieces.length; i += 2) formula(pieces[i]);
}
for (const p of limitProblems) {
  assert.ok(p.hint.length > 10 && p.steps.length >= 2);
  prose(p.statement); prose(p.hint);
  if (p.formula) formula(p.formula);
  for (const step of p.steps) { prose(step.text); if (step.latex) formula(step.latex); }
}
// Also check static lesson formulas and graph annotations in their actual TSX source.
for (const file of ["app/math/analiz/limesi/page.tsx", "components/interactives/LimitLabs.tsx"]) {
  const ast = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  function visit(node) {
    if (ts.isJsxAttribute(node) && ["latex", "tex"].includes(node.name.getText(ast)) && node.initializer) {
      const v = node.initializer;
      if (ts.isStringLiteral(v)) formula(v.text);
      else if (ts.isJsxExpression(v) && v.expression && ts.isTaggedTemplateExpression(v.expression) && ts.isNoSubstitutionTemplateLiteral(v.expression.template)) {
        formula(v.expression.template.rawText ?? v.expression.template.text);
      }
    }
    if (ts.isStringLiteral(node) && node.text.includes("$")) prose(node.text);
    if (ts.isTaggedTemplateExpression(node) && ts.isNoSubstitutionTemplateLiteral(node.template)) {
      const value = node.template.rawText ?? node.template.text;
      if (value.includes("$")) prose(value);
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
}
const near = (a,b,tol=1e-11) => assert.ok(Math.abs(a-b)<tol, a+" != "+b);
// Direct sums independently check both the chart and the worked area derivation.
for (const n of [2,4,8,16,32,64,128,250,500]) {
  const left = Array.from({length:n},(_,k)=>(k/n)**2/n).reduce((a,b)=>a+b,0);
  const right = Array.from({length:n},(_,k)=>((k+1)/n)**2/n).reduce((a,b)=>a+b,0);
  near(left,(n-1)*(2*n-1)/(6*n*n));
  near(right-left,1/n);
  assert.ok(left<1/3 && right>1/3);
  assert.ok(Math.abs((left+right)/2-1/3)<=1/(2*n));
}
// Verify guarantees against interior points, not just endpoint substitutions.
for (const eps of [0.0001,0.01,0.6,1,10]) {
  const delta=Math.min(1,eps/5);
  for (const r of [-0.999,-0.5,0.5,0.999]) assert.ok(Math.abs((2+r*delta)**2-4)<eps);
}
for (const angle of [0.001,0.1,0.5,0.8]) {
  assert.ok(Math.cos(angle)<=Math.sin(angle)/angle);
  assert.ok(1-Math.sin(angle)/angle<=angle**2/2);
}
// Check the difficult recurrence's exact identity and convergence constant.
let a=0;
for(let n=0;n<=12;n++) {
  near(a,2*Math.cos(Math.PI/2**(n+1)));
  assert.ok(2-a<=2**(1-n)+1e-14);
  if(n>=8) near(4**n*(2-a),Math.PI**2/4,1e-5);
  a=Math.sqrt(2+a);
}
near(3/301<0.01 ? 1 : 0,1);
assert.ok(3/300>=0.01);
assert.ok(2**-7<0.01 && 2**-6>=0.01);
console.log("Limits checks passed: 30 problems, 6 groups, "+formulaCount+" formulas, area sums, error guarantees, small angles and nested radicals.");
