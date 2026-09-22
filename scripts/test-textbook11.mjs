import assert from "node:assert/strict";
import katex from "katex";
import { textbook11Lessons, textbook11ProblemCount } from "../lib/textbook11.ts";

let formulas = 0;
const check = tex => {
  katex.renderToString(tex, { throwOnError: true, strict: "error" });
  assert.ok(!/\\vec\s*[ijk]\b/.test(tex), `Basis notation: ${tex}`);
  formulas++;
};
const prose = text => {
  assert.ok(!/[—]|бързин/iu.test(text), `Terminology: ${text}`);
  const matches = [...text.matchAll(/\$([^$]+)\$/g)];
  assert.equal((text.match(/\$/g) || []).length, matches.length * 2, `Unpaired $: ${text}`);
  matches.forEach(match => check(match[1]));
};

assert.equal(new Set(textbook11Lessons.map(lesson => lesson.slug)).size, textbook11Lessons.length);
assert.equal(textbook11ProblemCount, 24);
for (const lesson of textbook11Lessons) {
  assert.deepEqual(lesson.problems.map(problem => problem.number), lesson.problems.map((_, i) => i + 1));
  for (const problem of lesson.problems) {
    assert.ok(problem.hint && problem.steps.length > 0);
    prose(problem.hint);
    for (const step of problem.steps) {
      prose(step.title);
      prose(step.text);
      step.formulas?.forEach(check);
      if (!step.diagram) continue;
      const d = step.diagram;
      prose(d.caption);
      assert.ok(d.bounds[0] < d.bounds[1] && d.bounds[2] < d.bounds[3]);
      d.arrows.forEach(arrow => {
        assert.ok([...arrow.from, ...arrow.to].every(Number.isFinite));
        if (arrow.label) check(arrow.label);
      });
      d.labels?.filter(label => label.text).forEach(label => check(label.text));
    }
  }
}
const lesson = textbook11Lessons.find(item => item.number === 4);
assert.equal(lesson.slug, "skorost-i-uskorenie");
assert.equal(lesson.problems.length, 5);
const diagrams = lesson.problems[4].steps.filter(step => step.diagram).map(step => step.diagram);
assert.equal(diagrams.length, 3);
for (const [i, expected] of [[6, 8], [10, 0], [8, -6]].entries()) {
  const result = diagrams[i].arrows.find(arrow => arrow.color === "ok");
  assert.deepEqual(result.from, [0, 0]);
  assert.deepEqual(result.to, expected);
  assert.equal(Math.hypot(...result.to), 10);
}
console.log(`PASS: 24 textbook solutions, numbering, velocity projections and ${formulas} formulas.`);
