import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import katex from "katex";

function load(path) {
  const context = { exports: {} };
  vm.runInNewContext(ts.transpileModule(readFileSync(path, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, context);
  return context.exports;
}
const { complexChapters } = load("lib/complexCourse.ts");
const { complexProblems } = load("lib/problemSets/complexNumbers.ts");
const { multiply, divide, modulus, polar, roots, argument, oscillatorResponse } = load("lib/complexNumbers.ts");
let formulaCount = 0;
function formula(value) { katex.renderToString(value, { throwOnError: true, strict: "error" }); formulaCount++; }
function prose(value) {
  assert.ok(!/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value), "Control character: " + value);
  const parts = value.split("$");
  assert.equal(parts.length % 2, 1, "Unbalanced math: " + value);
  for (let i = 1; i < parts.length; i += 2) formula(parts[i]);
}
assert.equal(complexChapters.length, 4);
assert.equal(complexProblems.length, 32);
assert.equal(new Set(complexProblems.map(p => p.id)).size, 32);
for (const chapter of complexChapters) {
  assert.equal(new Set(chapter.sections.map(s => s.id)).size, chapter.sections.length);
  chapter.recap.forEach(prose);
  for (const section of chapter.sections) {
    if (section.teacher) prose(section.teacher);
    for (const b of section.blocks) {
      if (b.kind === "formula") formula(b.text);
      if (["p", "note"].includes(b.kind)) prose(b.text);
      if (b.kind === "prediction") {
        prose(b.prompt); assert.equal(b.options.filter(o => o.correct).length, 1);
        b.options.forEach(o => { prose(o.text); prose(o.why); });
      }
    }
  }
}
for (const p of complexProblems) {
  assert.equal(complexChapters.filter(c => p.id >= c.practice[0] && p.id <= c.practice[1]).length, 1);
  assert.ok(p.steps.length >= 2); prose(p.statement); prose(p.hint);
  p.steps.forEach(s => { prose(s.text); if (s.latex) formula(s.latex); });
}
const path = "components/interactives/ComplexLabs.tsx";
const ast = ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
function visit(n) {
  if (ts.isJsxAttribute(n) && n.name.getText(ast) === "tex" && n.initializer && ts.isStringLiteral(n.initializer)) formula(n.initializer.text);
  if (ts.isStringLiteral(n) && n.text.includes("$")) prose(n.text);
  ts.forEachChild(n, visit);
}
visit(ast);
const near = (a, b, eps = 1e-10) => assert.ok(Math.abs(a - b) < eps, `${a} != ${b}`);
const nearZ = (a, b) => { near(a.re, b.re); near(a.im, b.im); };
const pow = (z, n) => { let result = { re: 1, im: 0 }; for (let k = 0; k < n; k++) result = multiply(result, z); return result; };
for (const z of [{ re: 3, im: -4 }, { re: -1, im: 0 }, { re: 0, im: 0 }, { re: .01, im: 4 }]) {
  for (const w of [{ re: 2, im: 3 }, { re: -1, im: .4 }]) {
    nearZ(multiply(divide(z, w), w), z);
    near(modulus(multiply(z, w)), modulus(z) * modulus(w));
  }
  for (let n = 2; n <= 8; n++) {
    const all = roots(z, n); assert.equal(all.length, modulus(z) === 0 ? 1 : n);
    all.forEach(w => nearZ(pow(w, n), z));
    for (let j = 0; j < all.length; j++) for (let k = j + 1; k < all.length; k++) assert.ok(Math.hypot(all[j].re - all[k].re, all[j].im - all[k].im) > 1e-6);
  }
}
assert.equal(argument({ re: 0, im: 0 }), null);
near(argument({ re: -1, im: -0 }), Math.PI);
assert.throws(() => divide({ re: 1, im: 0 }, { re: 0, im: 0 }));
assert.throws(() => roots({ re: 1, im: 0 }, 0));
// Independent expected values from the exercises.
nearZ(multiply({ re: 2, im: -3 }, { re: -1, im: 2 }), { re: 4, im: 7 });
nearZ(divide({ re: 4, im: 1 }, { re: 2, im: -1 }), { re: 1.4, im: 1.2 });
nearZ(pow({ re: 1, im: -1 }, 12), { re: -64, im: 0 });
nearZ(pow({ re: 2, im: 1 }, 2), { re: 3, im: 4 });
nearZ(divide({ re: 100, im: 0 }, { re: 30, im: 40 }), { re: 1.2, im: -1.6 });
for (const zeta of [.05, .2, .7, 1]) {
  nearZ(oscillatorResponse(0, zeta), { re: 1, im: 0 });
  nearZ(oscillatorResponse(1, zeta), { re: 0, im: -1 / (2 * zeta) });
  for (const q of [.01, .8, 1, 2.5]) near(modulus(oscillatorResponse(q, zeta)), 1 / Math.sqrt((1 - q * q) ** 2 + 4 * zeta * zeta * q * q));
}
// Euler identity via independent partial sum, not the polar helper itself.
for (const theta of [-Math.PI, -.4, 0, 1, 2 * Math.PI]) {
  let term = { re: 1, im: 0 }, sum = { ...term };
  for (let n = 1; n <= 80; n++) { term = multiply(term, { re: 0, im: theta / n }); sum.re += term.re; sum.im += term.im; }
  nearZ(sum, polar(1, theta));
}
console.log(`Complex course verified: 4 chapters, 32 problems, ${formulaCount} formulas, roots, arithmetic, Euler series and oscillator response.`);
