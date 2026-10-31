import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.COURSE_BASE_URL || "http://localhost:3010";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage();
const errors = [];
page.on("pageerror", e => errors.push(e.message));
page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
mkdirSync("tmp/complex-course", { recursive: true });
async function audit() {
  const result = await page.evaluate(() => {
    const out = { overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, katex: document.querySelectorAll(".katex-error").length, overlaps: [], invalid: [], clipped: [] };
    for (const svg of document.querySelectorAll("main figure svg")) {
      const labels = [...svg.querySelectorAll("text, foreignObject")].map(el => {
        const target = el.tagName.toLowerCase() === "foreignobject" ? el.querySelector(".katex") || el : el;
        return { text: target.textContent, rect: target.getBoundingClientRect() };
      }).filter(l => l.rect.width && l.rect.height);
      for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++) {
        const a = labels[i], b = labels[j];
        if (Math.min(a.rect.right, b.rect.right) - Math.max(a.rect.left, b.rect.left) > 4 && Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.top, b.rect.top) > 4 && a.text !== b.text) out.overlaps.push(a.text + " / " + b.text);
      }
      const bounds = svg.getBoundingClientRect();
      for (const l of labels) if (l.rect.left < bounds.left - 1 || l.rect.right > bounds.right + 1 || l.rect.top < bounds.top - 1 || l.rect.bottom > bounds.bottom + 1) out.clipped.push(l.text);
      if ([...svg.querySelectorAll("path")].some(p => /NaN|Infinity/.test(p.getAttribute("d")))) out.invalid.push(svg.getAttribute("aria-label"));
    }
    return out;
  });
  assert.deepEqual(result, { overflow: 0, katex: 0, overlaps: [], invalid: [], clipped: [] }, JSON.stringify(result));
}
async function sliders() {
  let count = 0;
  for (const figure of await page.locator("main figure").all()) {
    const inputs = figure.locator('input[type="range"]'), n = await inputs.count();
    const originals = await inputs.evaluateAll(es => es.map(e => e.value));
    for (let mask = 0; mask < 2 ** n; mask++) {
      for (let k = 0; k < n; k++) {
        await inputs.nth(k).evaluate((el, high) => {
          const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
          setter.call(el, high ? el.max : el.min);
          el.dispatchEvent(new Event("input", { bubbles: true })); el.dispatchEvent(new Event("change", { bubbles: true }));
        }, Boolean(mask & (1 << k)));
      }
      await page.waitForTimeout(50); await audit(); count++;
    }
    for (let k = 0; k < n; k++) await inputs.nth(k).evaluate((el, value) => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(el, value);
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }, originals[k]);
  }
  return count;
}
try {
  const routes = ["/math/kompleksni-chisla", ...["osnovi", "oyler", "stepeni-i-koreni", "fizika"].map(s => "/math/kompleksni-chisla/" + s), "/zadachi/kompleksni-chisla"].filter(r => !process.argv.includes("--figures-only") || r.startsWith("/math/kompleksni-chisla/"));
  let corners = 0, steps = 0;
  for (const route of routes) {
    const response = await page.goto(base + route); assert.equal(response.status(), 200);
    await page.locator("h1").waitFor(); await page.waitForTimeout(300);
    for (const width of [375, 1280, 1536, 1920]) { await page.setViewportSize({ width, height: 900 }); await audit(); }
    await page.setViewportSize({ width: 1280, height: 900 });
    corners += await sliders();
    if (route.endsWith("osnovi")) {
      await page.getByRole("button", { name: "Спрегнато число", exact: true }).click(); await audit();
      const multiplication = page.locator("figure").filter({ hasText: "Умножението завърта" });
      for (const label of ["Умножи по i", "Умножи по −1", "Умножи по 1"]) { await multiplication.getByRole("button", { name: label, exact: true }).click(); await audit(); }
      await page.locator("#plane figure").screenshot({ path: "tmp/complex-course/plane-desktop.png", style: "nav.sticky { visibility: hidden !important; }" });
    }
    if (route.endsWith("oyler")) {
      const before = await page.locator("figure svg").first().innerHTML();
      await page.getByRole("button", { name: "Пусни една обиколка" }).click(); await page.waitForTimeout(350);
      assert.notEqual(await page.locator("figure svg").first().innerHTML(), before);
      await page.getByRole("button", { name: "Пауза", exact: true }).click();
      const paused = await page.locator("figure svg").first().innerHTML(); await page.waitForTimeout(150);
      assert.equal(await page.locator("figure svg").first().innerHTML(), paused);
      await page.locator("figure").screenshot({ path: "tmp/complex-course/euler-desktop.png", style: "nav.sticky { visibility: hidden !important; }" });
    }
    const teacher = page.getByRole("button", { name: "Режим преподавател", exact: true });
    if (await teacher.count()) { await teacher.click(); assert.ok(await page.getByText("Методически бележки", { exact: true }).count()); await audit(); }
    // Each prediction must accept an answer and expose a locked explanatory state.
    for (const section of await page.locator("main section").all()) {
      const options = section.locator("button").filter({ hasNotText: /Спрегнато|Умножи|Пусни|Пауза/ });
      const available = await options.count();
      if (available && !route.startsWith("/zadachi")) {
        const first = options.first(); await first.click();
        assert.equal(await first.isDisabled(), true); await audit();
      }
    }
    if (route.startsWith("/zadachi")) {
      assert.equal(await page.locator("[data-solution-step]").count(), 0);
      for (const article of await page.locator("article[id^=zadacha]").all()) {
        await article.getByRole("button", { name: "Покажи указание", exact: true }).click();
        await article.getByRole("button", { name: "Покажи решението", exact: true }).click();
        assert.equal(await article.locator("[data-solution-step]").count(), 1);
        while (await article.getByRole("button", { name: "Следваща стъпка →", exact: true }).count()) { await article.getByRole("button", { name: "Следваща стъпка →", exact: true }).click(); steps++; await audit(); }
      }
      for (const width of [375, 1280, 1536, 1920]) { await page.setViewportSize({ width, height: 900 }); await audit(); }
      await page.locator("#zadacha-12").screenshot({ path: "tmp/complex-course/proof-solution.png" });
    }
    await page.setViewportSize({ width: 375, height: 900 }); await audit(); corners += await sliders();
    if (route.endsWith("fizika")) await page.locator("#oscillator figure").screenshot({ path: "tmp/complex-course/resonance-mobile.png", style: "nav.sticky { visibility: hidden !important; }" });
    if (route.endsWith("oyler")) await page.locator("figure").screenshot({ path: "tmp/complex-course/euler-mobile.png", style: "nav.sticky { visibility: hidden !important; }" });
    console.log("PASS " + route);
  }
  await page.goto(base + "/math/kompleksni-chisla");
  await page.getByRole("link", { name: "Започнете с основите →" }).click(); await page.waitForURL("**/osnovi");
  await page.getByRole("link", { name: "Към задачите за тази част →" }).click(); await page.waitForURL("**/zadachi/kompleksni-chisla#part-1");
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ routes: routes.length, widths: 4, sliderCornerStates: corners, revealedAdditionalSteps: steps, browserErrors: errors }));
} finally { await browser.close(); }
