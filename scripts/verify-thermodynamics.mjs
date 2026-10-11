import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base=process.env.COURSE_BASE_URL || 'http://localhost:3011';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1280,height:900},reducedMotion:'reduce'});
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
mkdirSync('tmp/thermodynamics',{recursive:true});
async function audit() {
  const result=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,
    katexErrors:document.querySelectorAll('.katex-error').length,
    invalidSvg:[...document.querySelectorAll('main svg *')].filter(e=>[...e.attributes].some(a=>/NaN|Infinity/.test(a.value))).length,
    formulas:document.querySelectorAll('main .katex').length}));
  assert.equal(result.overflow,false);assert.equal(result.katexErrors,0);assert.equal(result.invalidSvg,0);assert.ok(result.formulas>20);
}
async function range(locator,value) {await locator.fill(String(value));await locator.dispatchEvent('input');}
try {
  assert.equal((await page.goto(`${base}/physics/termodinamika/parvi-printsip`)).status(),200);
  await page.getByRole('button',{name:'При застопореното бутало',exact:true}).click();
  assert.match(await page.locator('#part-1').innerText(),/Твоето запазено предположение/);
  await range(page.locator('#part-1 input[type=range]'),300);
  assert.match(await page.locator('#part-1').innerText(),/540,5 K/);
  for(const [part,answer] of [[2,'Затворена, но не изолирана'],[3,'Удвоява се'],[4,'Не: молекулите могат да имат допълнителни енергийни приноси'],[5,'Чрез топлина; няма обемна работа'],[6,'Удвоява се'],[7,'60 J'],[8,'По I и работата на газа, и получената топлина са по-големи']]) {
    const section=page.locator(`#part-${part}`);
    await section.getByRole('button',{name:answer,exact:true}).first().click();
    assert.equal(await section.getByText('Избери предположение, за да отвориш демонстрацията и извеждането. Грешките са част от изследването.').count(),0);
  }
  const eq=page.locator('#part-2');
  for(const mode of ['sudden','friction','slow']) {await eq.getByRole('combobox').selectOption(mode);await range(eq.locator('input[type=range]'),100);}
  const molecule=page.locator('#part-4');
  for(const kind of ['0','1','2']) {
    await molecule.getByRole('combobox').selectOption(kind);
    if(kind==='0')assert.equal(await molecule.getByLabel('Въртеливо',{exact:true}).isDisabled(),true);
    else {await molecule.getByLabel('Въртеливо',{exact:true}).check();await molecule.getByLabel('Трептително',{exact:true}).check();}
    await range(molecule.getByLabel('Кадър (ръчно разглеждане)'),340);
  }
  await molecule.getByLabel('Сравни с класическия предел:',{exact:false}).check();
  assert.match(await molecule.innerText(),/H₂O: f = 12/);
  // Keyboard-only start, then actual changing SVG transform and pause stability.
  const play=molecule.getByRole('button',{name:'Пусни движението'});
  await play.focus();await page.keyboard.press('Enter');
  const moving=molecule.locator('svg > g');const before=await moving.getAttribute('transform');
  await page.waitForTimeout(140);assert.notEqual(await moving.getAttribute('transform'),before);
  await molecule.getByRole('button',{name:'Пауза',exact:true}).click();
  const paused=await moving.getAttribute('transform');await page.waitForTimeout(120);assert.equal(await moving.getAttribute('transform'),paused);
  await molecule.getByRole('button',{name:'Начало',exact:true}).click();
  const work=page.locator('#part-6');await range(work.getByLabel('Краен обем',{exact:false}),1);assert.match(await work.innerText(),/−?\-?100 J/);
  await work.getByLabel('Променливо налягане:',{exact:false}).check();await range(work.getByLabel('Брой правоъгълници:',{exact:false}),80);
  const paths=page.locator('#part-8');assert.match(await paths.innerText(),/1150 J/);assert.match(await paths.innerText(),/950 J/);
  await paths.getByRole('button',{name:'Път II',exact:true}).click();await range(paths.getByLabel('Проследи пътя:',{exact:false}),50);assert.match(await paths.innerText(),/ΔU = 300 J/);
  await range(paths.getByLabel('Проследи пътя:',{exact:false}),100);
  // Wrong answers must explain the misconception and reveal correct reasoning.
  await page.locator('#part-9').getByRole('button',{name:'Да: температурата е еднаква',exact:true}).click();
  assert.match(await page.locator('#part-9').innerText(),/Верният отговор/);
  for(const slider of await page.locator('main input[type=range]').all()) {
    for(const attr of ['min','max'])await range(slider,await slider.getAttribute(attr));
  }
  await audit();
  await molecule.getByRole('combobox').scrollIntoViewIfNeeded();await page.screenshot({path:'tmp/thermodynamics/desktop.png'});
  for(const width of [390,320]) {await page.setViewportSize({width,height:844});await audit();await molecule.getByRole('img').scrollIntoViewIfNeeded();await page.screenshot({path:`tmp/thermodynamics/mobile-${width}.png`});}
  await page.setViewportSize({width:1280,height:900});await page.locator('#part-8').scrollIntoViewIfNeeded();await page.screenshot({path:'tmp/thermodynamics/paths.png'});
  await page.reload();await page.locator('#part-1').getByRole('status').first().waitFor();assert.match(await page.locator('#part-1').innerText(),/Твоето запазено предположение: При застопореното бутало/);
  assert.deepEqual(errors,[]);
  console.log('PASS: all section gates, saved prediction, heating, equilibrium modes, 3 molecules, energy modes, animation/keyboard/pause, work, paths, wrong-answer feedback, slider extrema, KaTeX, 1280/390/320px, no browser errors.');
} finally {await browser.close();}
