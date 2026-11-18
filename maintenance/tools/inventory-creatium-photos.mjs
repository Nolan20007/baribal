import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const pageUrl = process.env.PAGE_URL || "https://baribal-studio.ru/foto";
const outDir = path.resolve("output/creatium-full-inventory");
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1600, height: 1100 }, deviceScaleFactor: 1 });
const page = await context.newPage();
page.setDefaultTimeout(15000);
const network = new Map();
page.on("response", async response => {
  const url = response.url();
  if (!/\.(png|jpe?g|webp|avif)(?:[?#]|$)|image|media|upload|cdn/i.test(url)) return;
  const h = response.headers();
  network.set(url, { url, status: response.status(), contentType: h["content-type"] || "", contentLength: Number(h["content-length"] || 0) || null });
});
const unique = values => [...new Set(values.filter(Boolean))];
try {
  await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(3000);
  for (let y = 0; y < await page.locator("body").evaluate(el => el.scrollHeight); y += 700) {
    await page.evaluate(y => window.scrollTo(0, y), y);
    await page.waitForTimeout(180);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);

  const total = await page.getByText("Все фото", { exact: false }).count();
  const cards = [];
  for (let index = 0; index < total; index++) {
    const controls = page.getByText("Все фото", { exact: false });
    const control = controls.nth(index);
    if (!(await control.count())) continue;
    await control.scrollIntoViewIfNeeded();
    const before = await control.evaluate(el => {
      const visible = n => { const r=n.getBoundingClientRect(),s=getComputedStyle(n); return r.width>0&&r.height>0&&s.display!=="none"&&s.visibility!=="hidden"; };
      let root=el;
      for(let d=0;root&&d<14;d++,root=root.parentElement) {
        const t=(root.innerText||"").replace(/\s+/g," ").trim();
        if(/Все фото/i.test(t)&&t.length>10&&t.length<5000&&(root.querySelectorAll("img").length+root.querySelectorAll("[style*='background']").length)>0) break;
      }
      root=root||el.parentElement;
      const nodes=[root,...root.querySelectorAll("*")].filter(visible);
      const images=nodes.map(n=>{
        const s=getComputedStyle(n), r=n.getBoundingClientRect();
        const bg=[...s.backgroundImage.matchAll(/url\(["']?(.*?)["']?\)/g)].map(m=>m[1]);
        const urls=[...new Set([n.currentSrc,n.getAttribute("src"),n.getAttribute("data-src"),n.getAttribute("data-original"),n.getAttribute("data-lazy-src"),...bg,...[...n.querySelectorAll?.("source")||[]].flatMap(x=>[x.src,x.srcset])].filter(Boolean))];
        if(!urls.length)return null;
        return {tag:n.tagName,alt:n.getAttribute("alt")||"",href:n.closest("a")?.href||"",urls,srcset:n.getAttribute("srcset")||"",naturalWidth:n.naturalWidth||0,naturalHeight:n.naturalHeight||0,renderedWidth:Math.round(r.width),renderedHeight:Math.round(r.height),className:String(n.className||"").slice(0,200)};
      }).filter(Boolean);
      const anchors=[...root.querySelectorAll("a[href]")].map(a=>({text:(a.innerText||"").trim().slice(0,150),href:a.href}));
      return {text:(root.innerText||"").replace(/\s+/g," ").trim().slice(0,1200),rootTag:root.tagName,rootClass:String(root.className||"").slice(0,300),images,anchors};
    });

    await control.click({ timeout: 12000 }).catch(async () => await control.evaluate(el => el.click()));
    await page.waitForTimeout(1000);
    const popup = await page.evaluate(() => {
      const visible=n=>{const r=n.getBoundingClientRect(),s=getComputedStyle(n);return r.width>0&&r.height>0&&s.display!=="none"&&s.visibility!=="hidden"&&Number(s.opacity||1)>0;};
      const imgs=[...document.querySelectorAll("img")].filter(visible).map(n=>({src:n.getAttribute("src")||"",currentSrc:n.currentSrc||"",srcset:n.getAttribute("srcset")||"",alt:n.alt||"",naturalWidth:n.naturalWidth||0,naturalHeight:n.naturalHeight||0,renderedWidth:Math.round(n.getBoundingClientRect().width),renderedHeight:Math.round(n.getBoundingClientRect().height),href:n.closest("a")?.href||""}));
      const roots=[...document.querySelectorAll("body *")].filter(n=>visible(n)&&(/modal|popup|fancybox|lightbox|gallery|swiper|viewer/i.test(String(n.className||""))||n.getAttribute("role")==="dialog")).sort((a,b)=>{const x=a.getBoundingClientRect(),y=b.getBoundingClientRect();return y.width*y.height-x.width*x.height;}).slice(0,8).map(n=>({tag:n.tagName,id:n.id,className:String(n.className||"").slice(0,250),text:(n.innerText||"").trim().slice(0,500)}));
      return {images:imgs,roots};
    });
    cards.push({index:index+1,card:before,gallery:popup});
    await page.keyboard.press("Escape").catch(()=>{});
    await page.waitForTimeout(350);
    if ((index+1)%10===0) console.log("Processed",index+1,"of",total);
  }
  const allUrls=cards.flatMap(c=>[...c.card.images.flatMap(i=>i.urls),...c.gallery.images.flatMap(i=>[i.src,i.currentSrc])]);
  const report={pageUrl,generatedAt:new Date().toISOString(),pageTitle:await page.title(),detectedCardControls:total,processedCards:cards.length,uniqueImageUrls:unique(allUrls).length,cards,networkResponses:[...network.values()]};
  await writeFile(path.join(outDir,"full-inventory.json"),JSON.stringify(report,null,2));
  const summary=cards.map(c=>({card:c.index,title:c.card.text.slice(0,180),cardImageCandidates:c.card.images.length,galleryVisibleImages:c.gallery.images.length,galleryImageUrls:unique(c.gallery.images.flatMap(i=>[i.currentSrc,i.src])).length}));
  await writeFile(path.join(outDir,"summary.csv"),["card,title,card_image_candidates,gallery_visible_images,gallery_unique_urls",...summary.map(x=>[x.card,JSON.stringify(x.title),x.cardImageCandidates,x.galleryVisibleImages,x.galleryImageUrls].join(","))].join("\n"));
  console.log(JSON.stringify({ok:true,detectedCardControls:total,processedCards:cards.length,uniqueImageUrls:report.uniqueImageUrls,files:["full-inventory.json","summary.csv"]}));
} finally { await browser.close(); }
