import { chromium } from "playwright";
import { mkdir, writeFile, readdir } from "node:fs/promises";
import path from "node:path";

const pageUrl = process.env.PAGE_URL || "https://baribal-studio.ru/foto";
const outDir = path.resolve("output/creatium-card-diagnostic");
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1600, height: 1100 }, deviceScaleFactor: 1 });
const page = await context.newPage();
page.setDefaultTimeout(12000);
const requests = [], responses = [];
page.on("request", r => { if (/image|creatium|cdn|upload|media/i.test(r.url())) requests.push({url:r.url(),method:r.method(),resourceType:r.resourceType()}); });
page.on("response", r => { const h=r.headers(); if ((h["content-type"]||"").startsWith("image/") || /image|creatium|cdn|upload|media/i.test(r.url())) responses.push({url:r.url(),status:r.status(),contentType:h["content-type"]||"",contentLength:h["content-length"]||""}); });
try {
  await page.goto(pageUrl,{waitUntil:"domcontentloaded",timeout:60000});
  await page.waitForTimeout(2500);
  for(let i=0;i<7;i++){await page.evaluate(y=>window.scrollTo(0,y),i*650);await page.waitForTimeout(250);}
  await page.evaluate(()=>window.scrollTo(0,0)); await page.waitForTimeout(800);
  const controls=page.getByText("Все фото",{exact:false}),count=await controls.count(),cards=[];
  for(let n=0;n<Math.min(count,2);n++){
    const control=controls.nth(n);
    const data=await control.evaluate(el=>{
      const visible=node=>{const r=node.getBoundingClientRect(),s=getComputedStyle(node);return r.width>0&&r.height>0&&s.display!=="none"&&s.visibility!=="hidden";};
      let root=el;
      for(let d=0;root&&d<12;d++,root=root.parentElement){const t=(root.innerText||"").replace(/\s+/g," ").trim();if(/Все фото/i.test(t)&&t.length>10&&t.length<3000&&root.querySelectorAll("img").length+root.querySelectorAll("[style*='background']").length>0)break;}
      root=root||el.parentElement;
      const images=[root,...root.querySelectorAll("*")].filter(visible).map(node=>{
        const attrs={};for(const a of [...node.attributes||[]])attrs[a.name]=a.value;
        const style=getComputedStyle(node),r=node.getBoundingClientRect(),bg=style.backgroundImage;
        const urls=[...new Set([node.currentSrc,node.src,node.getAttribute("src"),node.getAttribute("srcset"),node.getAttribute("data-src"),node.getAttribute("data-srcset"),node.getAttribute("data-original"),node.getAttribute("data-lazy-src"),...[...bg.matchAll(/url\\(["']?(.*?)["']?\\)/g)].map(m=>m[1])].filter(Boolean))];
        if(!urls.length&&node.tagName!=="IMG"&&node.tagName!=="SOURCE")return null;
        return {tag:node.tagName,cls:String(node.className||"").slice(0,300),id:node.id||"",rect:{x:r.x,y:r.y,width:r.width,height:r.height},naturalWidth:node.naturalWidth||0,naturalHeight:node.naturalHeight||0,currentSrc:node.currentSrc||"",src:node.getAttribute("src")||"",srcset:node.getAttribute("srcset")||"",dataSrc:node.getAttribute("data-src")||"",dataSrcset:node.getAttribute("data-srcset")||"",backgroundImage:bg,urls,attributes:attrs};
      }).filter(Boolean);
      return {text:(root.innerText||"").slice(0,4000),root:{tag:root.tagName,id:root.id,cls:String(root.className||"").slice(0,500),html:root.outerHTML.slice(0,30000)},images};
    });
    cards.push({cardNumber:n+1,...data});
    await writeFile(path.join(outDir,"card-"+(n+1)+"-before.html"),data.root.html);
    await writeFile(path.join(outDir,"card-"+(n+1)+"-before.json"),JSON.stringify(data,null,2));
    await control.scrollIntoViewIfNeeded();
    await control.click({timeout:10000}).catch(async()=>{await control.evaluate(el=>el.click());});
    await page.waitForTimeout(1400);
    const popup=await page.evaluate(()=>{
      const visible=el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return r.width>0&&r.height>0&&s.display!=="none"&&s.visibility!=="hidden"&&Number(s.opacity||1)>0;};
      const roots=[...document.querySelectorAll("body *")].filter(el=>visible(el)&&(/modal|popup|fancybox|lightbox|gallery|swiper|viewer/i.test(String(el.className||""))||el.getAttribute("role")==="dialog")).sort((a,b)=>{const ra=a.getBoundingClientRect(),rb=b.getBoundingClientRect();return rb.width*rb.height-ra.width*ra.height;}).slice(0,15);
      return roots.map(el=>({tag:el.tagName,id:el.id,cls:String(el.className||"").slice(0,300),html:el.outerHTML.slice(0,50000)}));
    });
    cards[n].popupRoots=popup;
    await writeFile(path.join(outDir,"card-"+(n+1)+"-popup.json"),JSON.stringify(popup,null,2));
    await page.screenshot({path:path.join(outDir,"card-"+(n+1)+"-popup.png"),fullPage:false});
    await page.keyboard.press("Escape").catch(()=>{}); await page.waitForTimeout(600);
  }
  const report={pageUrl,generatedAt:new Date().toISOString(),title:await page.title(),cardControlCount:count,cards,requests:[...new Map(requests.map(x=>[x.url,x])).values()],responses:[...new Map(responses.map(x=>[x.url,x])).values()]};
  await writeFile(path.join(outDir,"diagnostic-report.json"),JSON.stringify(report,null,2));
  await writeFile(path.join(outDir,"page.html"),await page.content());
  console.log(JSON.stringify({ok:true,cardControlCount:count,files:await readdir(outDir)}));
} finally {await browser.close();}
