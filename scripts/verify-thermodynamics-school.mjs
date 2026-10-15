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
async function range(locator,value){await locator.fill(String(value));await locator.dispatchEvent("input");}
try{
  await page.goto(base+"/physics?level=12");
  assert.equal(await page.locator("main").count(),0); // shared catalog uses its own container
  const courseLinks=await page.locator('a[href^="/physics/termodinamika/"],a[href="/zadachi/termodinamika/kpd"]').count();
  assert.ok(courseLinks>=9);
  await page.goto(base+"/physics?level=university");
  assert.equal(await page.locator('a[href="/physics/termodinamika/parvi-printsip"]').count(),0);
  await page.goto(base+"/physics/termodinamika");
  assert.equal(await page.getByText("Скоро",{exact:true}).count(),4);
  await audit("course");
  for(const entry of thermodynamicsCourse.flatMap(s=>s.lessons).filter(l=>l.href)){
    assert.equal((await page.goto(base+entry.href)).status(),200);
    await page.locator("main h1").waitFor();
    assert.equal(await page.locator("main h1").innerText(),entry.title);
    assert.equal(await page.getByText("Пътеводител за преподаване и самостоятелна работа",{exact:true}).count(),0);
    await audit(entry.href);
    // Every main lesson is readable before answering anything.
    assert.ok(await page.locator("main section .katex").count()>5);
    for(const lab of await page.locator("[data-thermo-lab]").all()){
      const sliders=await lab.locator('input[type="range"]').all();
      // Every combination of slider extrema, including phase and physical parameters.
      for(let mask=0;mask<2**sliders.length;mask++){
        for(let i=0;i<sliders.length;i++)await range(sliders[i],await sliders[i].getAttribute(mask&(1<<i)?"max":"min"));
        await audit(entry.href+" extrema "+mask);
      }
    }
    if(entry.href.endsWith("osnovni-ponyatiya")){
      const lab=page.locator("#freedom [data-thermo-lab]");
      for(let molecule=0;molecule<4;molecule++){
        await lab.getByRole("group",{name:"Молекула",exact:true}).getByRole("button").nth(molecule).click();
        const buttons=lab.locator('button[aria-pressed]').filter({hasNot:page.locator('input')});
        const count=await buttons.count();
        for(let b=4;b<count;b++){
          await buttons.nth(b).click();
          for(const phase of [0,.25,.5,.75,1]){await range(lab.locator('input[type="range"]'),phase);await audit("molecule "+molecule+" mode "+b);}
        }
        if(await lab.getByRole("checkbox").count())await lab.getByRole("checkbox").check();
        await audit("active vibrations "+molecule);
      }
      await lab.getByRole("group",{name:"Молекула",exact:true}).getByRole("button").nth(1).click();
      await range(lab.locator('input[type="range"]'),0);
      const atom=lab.locator("[data-molecule-atom]").first(), before=await atom.getAttribute("transform");
      await lab.getByRole("button",{name:"Пуснете движението",exact:true}).focus();await page.keyboard.press("Enter");
      await page.waitForTimeout(180);assert.notEqual(await atom.getAttribute("transform"),before);
      await lab.getByRole("button",{name:"Пауза",exact:true}).click();
      const paused=await atom.getAttribute("transform");await page.waitForTimeout(120);assert.equal(await atom.getAttribute("transform"),paused);
      await lab.screenshot({path:"tmp/thermodynamics-course/molecule-desktop.png"});
    }
    if(entry.href.endsWith("protsesi-idealen-gaz")){
      const lab=page.locator("#graphs [data-thermo-lab]");
      for(let process=0;process<4;process++)for(let axis=0;axis<3;axis++){
        await lab.locator('button[aria-pressed]').nth(process).click();
        await lab.locator('button[aria-pressed]').nth(4+axis).click();
        for(const phase of [0,.5,1]){await range(lab.locator('input[type="range"]'),phase);await audit("process "+process+" axis "+axis);}
      }
    }
    if(entry.href.endsWith("parvi-printsip")){
      const work=page.locator("#work [data-thermo-lab]");
      await work.getByRole("checkbox").check();
      const sliders=await work.locator('input[type="range"]').all();
      for(const v of [1,2,2.1,6])for(const p of [50,100,300]){await range(sliders[0],v);await range(sliders[1],p);await audit("work");}
      const paths=page.locator("#paths [data-thermo-lab]");
      for(const button of await paths.locator('button[aria-pressed]').all()){
        await button.click();for(const phase of [0,.5,1]){await range(paths.locator('input[type="range"]'),phase);await audit("paths");}
      }
    }
    // Each guided problem: both gates, all solution phases, and final caption.
    for(const problem of await page.locator("[data-school-problem]").all()){
      for(let gate=0;gate<2;gate++){
        await problem.locator("button:not([disabled])").first().click();
        await audit("problem gate "+gate);
      }
      while(await problem.getByRole("button",{name:/Първа стъпка|Следваща стъпка/}).count()){
        await problem.getByRole("button",{name:/Първа стъпка|Следваща стъпка/}).click();await audit("problem step");
      }
    }
    for(const buttons of await page.locator("#check > div > div").all()){
      const option=buttons.locator("button:not([disabled])").first();if(await option.count())await option.click();
    }
    await page.getByRole("button",{name:"Режим преподавател",exact:false}).click();
    assert.ok(await page.getByText("Методически бележки",{exact:true}).count()>0);
    for(const width of [375,1280,1536,1920]){
      await page.setViewportSize({width,height:900});await audit(entry.href+" width "+width);
    }
    if(entry.href.endsWith("osnovni-ponyatiya")){
      await page.setViewportSize({width:375,height:900});
      await page.locator("#freedom [data-thermo-lab]").screenshot({path:"tmp/thermodynamics-course/molecule-mobile.png"});
    }
    await page.setViewportSize({width:1280,height:900});
    report.push({route:entry.href,status:"passed"});
  }
  await page.goto(base+"/physics/termodinamika/za-naprednali");await audit("advanced");
  assert.equal(await page.locator("main section").count(),4);
  assert.deepEqual(errors,[]);
  writeFileSync("tmp/thermodynamics-course/browser-report.json",JSON.stringify(report,null,2));
  console.log("PASS: 9 lessons, 4 forthcoming topics, grade navigation, all slider extrema, molecular modes, keyboard animation/pause, process coordinates, work/path variants, all guided phases, teacher notes, KaTeX, no raw math, no SVG overlaps, widths 375/1280/1536/1920; console clean.");
}finally{await browser.close();}
