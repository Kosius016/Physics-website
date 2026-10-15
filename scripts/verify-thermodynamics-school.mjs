import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { thermodynamicsCourse } from "../lib/thermodynamicsCourse.ts";
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base=process.env.COURSE_BASE_URL || "http://localhost:3015";
const browser=await chromium.launch({channel:"chrome",headless:true});
const page=await browser.newPage({viewport:{width:1280,height:900}});
const errors=[],report=[];
page.on("pageerror",e=>errors.push(e.message));
page.on("console",m=>{if(m.type()==="error")errors.push(m.text());});
mkdirSync("tmp/thermodynamics-course",{recursive:true});
async function audit(label) {
  const result=await page.evaluate(()=>{
    const issues=[], rectOf=el=>(el.tagName.toLowerCase()==="foreignobject"?(el.querySelector(".katex")||el):el).getBoundingClientRect();
    for(const svg of document.querySelectorAll("main svg")){
      const labels=[...svg.querySelectorAll("text,foreignObject")].filter(el=>{
        let n=el,opacity=1;while(n&&n!==svg){opacity*=parseFloat(getComputedStyle(n).opacity);n=n.parentElement;}
        const r=rectOf(el);return opacity>=.3&&r.width>0&&r.height>0;
      });
      for(let i=0;i<labels.length;i++)for(let j=i+1;j<labels.length;j++){
        const a=rectOf(labels[i]),b=rectOf(labels[j]);
        if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>4&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>4&&labels[i].textContent!==labels[j].textContent)
          issues.push((svg.getAttribute("aria-label")||"")+": "+labels[i].textContent+" / "+labels[j].textContent);
      }
    }
    const walker=document.createTreeWalker(document.querySelector("main"),NodeFilter.SHOW_TEXT);
    const rawMath=[];let node;
    while(node=walker.nextNode()){
      const el=node.parentElement;if(!el||el.closest(".katex,script,style"))continue;
      if(node.textContent.includes("$")||node.textContent.includes(".raw"))rawMath.push(node.textContent);
    }
    return {overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
      errors:document.querySelectorAll(".katex-error").length,issues,rawMath,
      invalid:[...document.querySelectorAll("main svg *")].some(el=>[...el.attributes].some(a=>/NaN|Infinity/.test(a.value)))};
  });
  assert.equal(result.overflow,0,label+" overflow");
  assert.equal(result.errors,0,label+" KaTeX");
  assert.deepEqual(result.issues,[],label+" labels");
  assert.deepEqual(result.rawMath,[],label+" raw math");
  assert.equal(result.invalid,false,label+" invalid SVG");
}
async function range(locator,value){const step=Number(await locator.getAttribute('step'))||1;const adjusted=Math.round(Number(value)/step)*step;await locator.fill(String(Number(adjusted.toFixed(6))));await locator.dispatchEvent("input");}

async function extremes(lab,label){
  const sliders=await lab.locator('input[type="range"]').all();
  for(let mask=0;mask<2**sliders.length;mask++){
    for(let i=0;i<sliders.length;i++)await range(sliders[i],await sliders[i].getAttribute(mask&(1<<i)?"max":"min"));
    await audit(label+" extrema "+mask);
  }
}
try{
  await page.goto(base+"/physics?level=12");
  assert.ok(await page.locator('a[href^="/physics/termodinamika/"]').count()>=4);
  assert.equal(await page.locator('a[href="/physics/termodinamika/entropiya-vtori-printsip"]').count(),0);
  await page.goto(base+"/physics/termodinamika");
  assert.equal(await page.getByText("Скоро",{exact:true}).count(),9);
  await audit("course");
  for(const entry of thermodynamicsCourse.flatMap(s=>s.lessons).filter(l=>l.href)){
    assert.equal((await page.goto(base+entry.href)).status(),200);
    await page.locator("main h1").waitFor();
    assert.equal(await page.locator("main h1").innerText(),entry.title);
    await audit(entry.href);
    for(const lab of await page.locator('[data-thermo-lab]').all()){
      await extremes(lab,entry.href);
      const buttons=await lab.locator('button[aria-pressed]').all();
      for(const button of buttons){await button.click();await extremes(lab,await button.innerText());}
      // Intermediate phases catch projected atoms crossing labels.
      const phase=lab.locator('input[min="0"][max="1"]');
      if(await phase.count())for(const v of [.125,.25,.375,.5,.625,.75,.875]){await range(phase,v);await audit("intermediate phase");}
    }
    if(entry.href.endsWith('osnovni-ponyatiya')){
      const lab=page.locator('#freedom [data-thermo-lab]');
      await range(lab.locator('input[type="range"]'),0);
      const atom=lab.locator('[data-molecule-atom]').nth(2),before=await atom.getAttribute('transform');
      await lab.getByRole('button',{name:'Пуснете движението',exact:true}).focus();await page.keyboard.press('Enter');
      await page.waitForTimeout(250);assert.notEqual(await atom.getAttribute('transform'),before);
      await lab.getByRole('button',{name:'Пауза',exact:true}).click();
      const paused=await atom.getAttribute('transform');await page.waitForTimeout(150);assert.equal(await atom.getAttribute('transform'),paused);
      const vibration=page.locator('#vibration [data-thermo-lab]');
      await vibration.getByRole('button',{name:'Равновесна дължина',exact:true}).click();
      assert.ok((await vibration.locator('dd annotation').allTextContents()).includes('E_k/E=1{,}00'));
      assert.ok((await vibration.locator('dd annotation').allTextContents()).includes('E_p/E=0{,}00'));
    }
    // Numeric exercises no longer have generic decorative diagrams.
    assert.equal(await page.locator('[data-school-problem] svg').count(),0);
    for(const problem of await page.locator('[data-school-problem]').all()){
      for(let gate=0;gate<2;gate++){await problem.locator('button:not([disabled])').first().click();await audit('problem gate');}
      while(await problem.getByRole('button',{name:/Първа стъпка|Следваща стъпка/}).count()){
        await problem.getByRole('button',{name:/Първа стъпка|Следваща стъпка/}).click();await audit('solution step');
      }
    }
    await page.getByRole('button',{name:'Режим преподавател',exact:false}).click();
    assert.ok(await page.getByText('Методически бележки',{exact:true}).count()>0);
    for(const width of [375,900,1280,1536,1920]){
      await page.setViewportSize({width,height:1000});await audit(entry.href+' width '+width);
    }
    // Capture each actual figure for visual inspection, with the sticky lesson nav out of the crop.
    await page.addStyleTag({content:'.sticky {position:static!important}'});
    for(const width of [375,1280]){
      await page.setViewportSize({width,height:1000});
      for(const lab of await page.locator('[data-thermo-lab]').all()){
        const section=await lab.evaluate(el=>el.closest('section').id);
        await lab.screenshot({path:'tmp/thermodynamics-course/pdf-'+section+'-'+width+'.png'});
      }
    }
    report.push({route:entry.href,status:'passed'});
    await page.setViewportSize({width:1280,height:1000});
  }
  await page.goto(base+'/physics/termodinamika/za-naprednali');await audit('advanced');
  // Unwritten chapters must not remain available as full old lessons.
  for(const slug of ['entropiya-vtori-printsip','toplinni-dvigateli','hladilni-mashini','proverka']){
    const response=await page.goto(base+'/physics/termodinamika/'+slug);assert.equal(response.status(),404);
  }
  // Expected 404 navigation logs are not runtime failures.
  assert.deepEqual(errors.filter(e=>!e.includes('404')),[]);
  writeFileSync('tmp/thermodynamics-course/browser-report.json',JSON.stringify(report,null,2));
  console.log('PASS: 4 source-based lessons, 9 forthcoming topics; figure variants, slider extrema and phases; animation/pause; no decorative task diagrams; all guided steps; KaTeX, SVG labels, responsive widths 375/900/1280/1536/1920.');
}finally{await browser.close();}
