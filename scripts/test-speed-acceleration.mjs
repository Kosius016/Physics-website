import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
import katex from "katex";
import { circularInterval, motionState, returnTrip, velocityComponents } from "../lib/speedAcceleration.ts";

const near = (a, b, tolerance = 1e-9) => assert.ok(Math.abs(a - b) < tolerance, `${a} != ${b}`);
assert.deepEqual(returnTrip(8), {x: 0, path: 16, average: 0});
assert.deepEqual(returnTrip(4), {x: 8, path: 8, average: 2});
for (let dt = 0.1; dt <= 2; dt += 0.1) {
  const d = circularInterval(dt);
  assert.ok(d.chord < d.path);
  near(Math.hypot(d.vx, d.vy), d.chord / dt);
  near(d.path / dt, 2);
}
near(circularInterval(0.0001).vx, 2, 1e-8);
near(circularInterval(0.0001).vy, 0, 0.0001);
for (let angle = 0; angle <= 360; angle += 5) {
  for (const speed of [1, 3, 5]) {
    const v = velocityComponents(speed, angle);
    near(Math.hypot(v.x, v.y), speed);
  }
}
for (const kind of ["faster", "slower", "turn"]) {
  for (let t = 0; t <= 4; t += 0.05) {
    const s = motionState(kind, t), h = 1e-5;
    const before = motionState(kind, t - h), after = motionState(kind, t + h);
    near((after.x - before.x) / (2 * h), s.vx, 1e-7);
    near((after.y - before.y) / (2 * h), s.vy, 1e-7);
    near((after.vx - before.vx) / (2 * h), s.ax, 1e-7);
    near((after.vy - before.vy) / (2 * h), s.ay, 1e-7);
    if (kind === "turn") {
      near(Math.hypot(s.vx, s.vy), 2);
      near(s.vx * s.ax + s.vy * s.ay, 0);
      assert.ok(s.ax * -s.x + s.ay * (4 - s.y) > 0);
    }
  }
}
near(Math.hypot(3, 4), 5);
near(Math.atan2(4, 3) * 180 / Math.PI, 53.13010235415598);
near(Math.hypot(-3, 3), 3 * Math.sqrt(2));
near(-2 + -1 * 3, -5);
near((5 - 6) / 0.5, -2);
near((2.5 - 4) / 0.5, -3);
near(Math.hypot(-2, -3), Math.sqrt(13));
near(velocityComponents(10, 150).x, -5 * Math.sqrt(3));
near(velocityComponents(10, 150).y, 5);
near(Math.hypot((1 - 4) / 2, (5 - 1) / 2), 2.5);

// Inspect authored math, including options and unopened solution steps.
let formulas = 0;
for (const file of [
  "app/physics/kinematika/skorost-i-uskorenie/page.tsx",
  "components/interactives/SpeedAccelerationLabs.tsx",
  "components/interactives/speedAccelerationProblems.tsx",
  "components/interactives/speedAccelerationExtraProblems.tsx",
  "components/interactives/SpeedAccelerationFigures.tsx",
]) {
  const source = readFileSync(file, "utf8");
  assert.ok(!source.includes("—"), `${file}: long dash`);
  assert.ok(!/бързин/iu.test(source), `${file}: terminology`);
  assert.ok(!/\\vec\s*[ijk]\b/.test(source), `${file}: basis notation`);
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const check = value => { katex.renderToString(value, {throwOnError: true, strict: "error"}); formulas++; };
  function visit(node) {
    const raw = ts.isTaggedTemplateExpression(node) && node.tag.getText(tree) === "String.raw";
    if (raw && ts.isNoSubstitutionTemplateLiteral(node.template)) {
      const value = node.template.rawText;
      const inline = [...value.matchAll(/\$([^$]+)\$/g)];
      if (value.includes("$")) {
        assert.equal((value.match(/\$/g) || []).length, inline.length * 2, `Unpaired $: ${value}`);
        inline.forEach(match => check(match[1]));
      } else check(value);
    }
    // A single LaTeX slash in a cooked JS string silently drops the slash.
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) {
      if (!(node.parent && ts.isTaggedTemplateExpression(node.parent) && node.parent.tag.getText(tree) === "String.raw")) {
        const literal = node.getText(tree);
        assert.ok(!/(?<!\\)\\(?:Delta|vec|hat|mathrm|circ|,)/.test(literal), `Unescaped math: ${literal}`);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(tree);
}
console.log(`PASS: motion models, component signs, derivatives, worked answers and ${formulas} authored formulas.`);
