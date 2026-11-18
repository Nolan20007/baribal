import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const pageUrl = process.env.PAGE_URL;
if (!pageUrl) throw new Error("PAGE_URL is required");
const parsed = new URL(pageUrl);
if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Only HTTP(S) URLs are supported");

const outDir = path.resolve("output/creatium-images");
const cardsDir = path.join(outDir, "cards");
const pageAssetsDir = path.join(outDir, "page-assets");
await mkdir(cardsDir, { recursive: true });
await mkdir(pageAssetsDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
page.setDefaultTimeout(9000);

const cards = [];
const failures = [];
const requestedStart = Number(process.env.CARD_START || 8);
const requestedEnd = Number(process.env.CARD_END || 8);
const requestedGalleryLimit = Number(process.env.GALLERY_LIMIT || 120);
const requiredCardText = String(process.env.REQUIRED_CARD_TEXT || "GLE Coupe").trim();
if (!Number.isInteger(requestedStart) || !Number.isInteger(requestedEnd) || requestedStart < 1 || requestedEnd < requestedStart) {
  throw new Error("CARD_START/CARD_END must be valid positive card indexes");
}
if (!Number.isInteger(requestedGalleryLimit) || requestedGalleryLimit < 1 || requestedGalleryLimit > 120) {
  throw new Error("GALLERY_LIMIT must be an integer between 1 and 120");
}
const pageAssets = new Map();

function normalizeUrl(value) {
  try {
    const u = new URL(value, pageUrl);
    if (!["http:", "https:"].includes(u.protocol)) return "";
    return u.href;
  } catch { return ""; }
}
function slug(value) {
  return String(value || "card").normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9а-яё]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 65) || "card";
}
function uniquePush(list, url, source) {
  const normalized = normalizeUrl(url);
  if (!normalized || list.some(item => item.url === normalized)) return;
  list.push({ url: normalized, source });
}

async function scrollPage() {
  let oldHeight = 0;
  for (let i = 0; i < 8; i++) {
    const height = await page.evaluate(() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight));
    for (let y = 0; y < height; y += 600) {
      await page.evaluate(y => window.scrollTo(0, y), y);
      await page.waitForTimeout(160);
    }
    await page.waitForTimeout(400);
    const next = await page.evaluate(() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight));
    if (next === oldHeight) break;
    oldHeight = next;
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
}

async function readCard(button, index) {
  return button.evaluate((el, index) => {
    let root = el;
    let best = null;
    for (let depth = 0; root && depth < 9; depth++, root = root.parentElement) {
      const text = (root.innerText || "").replace(/\s+/g, " ").trim();
      const imgs = [...root.querySelectorAll("img")].filter(img => {
        const r = img.getBoundingClientRect();
        return r.width > 80 && r.height > 60;
      });
      if (text.length > 10 && text.length < 1800 && imgs.length) {
        best = { root, text, imgs };
        if (depth >= 2) break;
      }
    }
    if (!best) return { description: "", mainImage: "", cardText: "" };
    const heading = best.root.querySelector("h1,h2,h3,h4,[class*='title'],[class*='name']");
    const description = (heading?.innerText || best.text.split(/Все фото/i)[0] || "").replace(/\s+/g, " ").trim();
    const img = best.imgs.sort((a,b) => {
      const ar = a.getBoundingClientRect(), br = b.getBoundingClientRect();
      return (br.width * br.height) - (ar.width * ar.height);
    })[0];
    const mainImage = img ? (img.currentSrc || img.src || img.getAttribute("data-src") || "") : "";
    return { description: description.slice(0, 500), mainImage, cardText: best.text.slice(0, 1800) };
  }, index);
}

async function readGalleryImages() {
  return page.evaluate(() => {
    const visible = el => {
      const style = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" &&
        Number(style.opacity || 1) > 0 && r.width > 0 && r.height > 0;
    };
    const overlayPattern = /modal|popup|fancybox|lightbox|viewer|overlay/i;
    const roots = [...document.querySelectorAll(
      "[role='dialog'],[aria-modal='true'],[class*='modal'],[class*='popup'],[class*='gallery'],[class*='fancybox'],[class*='lightbox'],[class*='swiper'],[class*='slick'],[class*='fotorama'],[class*='viewer'],[class*='overlay']"
    )].filter(root => {
      if (!visible(root)) return false;
      const style = getComputedStyle(root);
      const zIndex = Number.parseInt(style.zIndex, 10) || 0;
      const semanticOverlay = root.getAttribute("role") === "dialog" ||
        root.getAttribute("aria-modal") === "true" ||
        overlayPattern.test(String(root.className || ""));
      return semanticOverlay || (style.position === "fixed" && zIndex > 5);
    });
    const urls = [];
    const add = value => {
      if (!value) return;
      const url = String(value).trim();
      if (/^https?:\/\//i.test(url) && /\.(?:svg|png|jpe?g|webp|gif|avif|bmp|tiff?)(?:$|[?#])/i.test(url) && !urls.includes(url)) urls.push(url);
    };
    for (const root of roots) {
      for (const img of root.querySelectorAll("img")) {
        if (!visible(img)) continue;
        const r = img.getBoundingClientRect();
        if (r.width < 90 || r.height < 70) continue;
        add(img.currentSrc); add(img.src);
        add(img.getAttribute("data-src")); add(img.getAttribute("data-original"));
        add(img.getAttribute("data-lazy-src")); add(img.getAttribute("data-image"));
        const source = img.closest("picture")?.querySelector("source[srcset]");
        if (source) add(source.srcset.split(",")[0].trim().split(/\s+/)[0]);
      }
      for (const link of root.querySelectorAll("a[href]")) add(link.href);
      for (const el of root.querySelectorAll("*")) {
        const bg = getComputedStyle(el).backgroundImage;
        if (bg && bg !== "none") {
          for (const match of bg.matchAll(/url\(["']?(.*?)["']?\)/g)) add(match[1]);
        }
      }
    }
    return urls;
  });
}

async function findViewerImage() {
  const candidates = await readGalleryImages();
  if (candidates.length) return candidates[0];
  return page.evaluate(() => {
    const selectors = [
      ".fancybox__image", ".fancybox-image", ".glightbox-container img",
      ".pswp__img", "[class*='lightbox'] img", "[class*='viewer'] img",
      "[role='dialog'] img", "[class*='modal'] img", "[class*='popup'] img",
      "[class*='swiper'] img", "[class*='fotorama'] img", "[class*='t-gallery'] img"
    ];
    const candidates = [];
    for (const selector of selectors) {
      for (const img of document.querySelectorAll(selector)) {
        const r = img.getBoundingClientRect();
        if (r.width > 160 && r.height > 120 && getComputedStyle(img).visibility !== "hidden") {
          candidates.push({ img, area: r.width * r.height });
        }
      }
    }
    candidates.sort((a,b) => b.area - a.area);
    const img = candidates[0]?.img;
    return img ? (img.currentSrc || img.src || img.getAttribute("data-src") || "") : "";
  });
}

async function clickModalPhoto() {
  const selectors = [
    "[role='dialog'] img", "[class*='modal'] img", "[class*='gallery'] img",
    "[class*='popup'] img", "[class*='fancybox'] img", "[class*='lightbox'] img",
    "[class*='swiper'] img", "[class*='fotorama'] img", "[class*='t-gallery'] img"
  ];
  for (const selector of selectors) {
    const imgs = page.locator(selector);
    const count = await imgs.count().catch(() => 0);
    for (let i = 0; i < Math.min(count, 40); i++) {
      const img = imgs.nth(i);
      if (!await img.isVisible().catch(() => false)) continue;
      const box = await img.boundingBox().catch(() => null);
      if (!box || box.width < 60 || box.height < 60) continue;
      await img.click({ timeout: 2500 }).catch(() => {});
      await page.waitForTimeout(500);
      const url = await findViewerImage();
      if (url) return url;
    }
  }
  return "";
}

async function extractOriginalsByClickingThumbnails(limit) {
  // Do not scan generic gallery/swiper containers: they also match the page's
  // background carousel. Restrict the search to actual modal/popup overlays.
  const inspect = () => page.evaluate(() => {
    const visible = el => {
      const r = el.getBoundingClientRect(), s = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.display !== "none" &&
        s.visibility !== "hidden" && Number(s.opacity || 1) > 0;
    };
    const selectors = [
      "[role='dialog']", "[aria-modal='true']",
      ".t-popup", "[class*='t-popup__']", "[class*='t-popup']",
      "[class*='modal']", "[class*='lightbox']", "[class*='fancybox']",
      "[class*='pswp']"
    ];
    const nodes = [...new Set(selectors.flatMap(s => [...document.querySelectorAll(s)]))].filter(visible);
    const candidates = nodes.map(root => {
      const r = root.getBoundingClientRect(), s = getComputedStyle(root);
      const imgs = [...root.querySelectorAll("img")].filter(img => {
        const ir = img.getBoundingClientRect();
        return visible(img) && ir.width >= 35 && ir.height >= 35;
      });
      const z = Number.parseInt(s.zIndex, 10) || 0;
      const semantic = root.matches("[role='dialog'],[aria-modal='true'],.t-popup,[class*='t-popup']");
      const fixed = s.position === "fixed";
      const area = r.width * r.height;
      return { root, imgs, z, semantic, fixed, area, rect: {x:r.x,y:r.y,width:r.width,height:r.height},
        tag: root.tagName, id: root.id, cls: String(root.className || "").slice(0,220) };
    }).filter(x => x.imgs.length);
    candidates.sort((a,b) =>
      (Number(b.semantic)*100000 + Number(b.fixed)*50000 + Math.min(b.z,999)*20 + b.imgs.length*10 + b.area/10000) -
      (Number(a.semantic)*100000 + Number(a.fixed)*50000 + Math.min(a.z,999)*20 + a.imgs.length*10 + a.area/10000)
    );
    const chosen = candidates[0];
    return {
      candidateCount: candidates.length,
      candidates: candidates.slice(0,12).map(x => ({
        tag:x.tag,id:x.id,cls:x.cls,zIndex:x.z,fixed:x.fixed,semantic:x.semantic,
        rect:x.rect,imgCount:x.imgs.length,
        images:x.imgs.slice(0,30).map((img,index) => {
          const r=img.getBoundingClientRect();
          const link=img.closest("a[href],button,[role='button']") || img.parentElement;
          return {index,url:img.currentSrc||img.src||img.getAttribute("data-src")||"",
            naturalWidth:img.naturalWidth||0,naturalHeight:img.naturalHeight||0,
            rect:{x:r.x,y:r.y,width:r.width,height:r.height},
            clickable:{tag:link?.tagName||"",cls:String(link?.className||"").slice(0,120),
              href:link?.href||"",role:link?.getAttribute("role")||""}};
        })
      })),
      chosen: chosen ? {tag:chosen.tag,id:chosen.id,cls:chosen.cls,zIndex:chosen.z,
        fixed:chosen.fixed,semantic:chosen.semantic,rect:chosen.rect,imgCount:chosen.imgs.length} : null,
      thumbnails: chosen ? chosen.imgs.map((img,index)=>({
        index,url:img.currentSrc||img.src||img.getAttribute("data-src")||"",
        naturalWidth:img.naturalWidth||0,naturalHeight:img.naturalHeight||0
      })) : []
    };
  });
  const initial = await inspect();
  console.log("  modal candidates:", initial.candidateCount,
    "| chosen:", JSON.stringify(initial.chosen),
    "| thumbnails:", initial.thumbnails.length);
  if (!initial.thumbnails.length) {
    console.log("  overlay diagnostic:", JSON.stringify(initial.candidates));
    return [];
  }

  const networkImages = [];
  const onResponse = async response => {
    try {
      const headers=response.headers(), type=String(headers["content-type"]||"").split(";")[0].toLowerCase();
      const url=response.url();
      if (type.startsWith("image/") && response.status()>=200 && response.status()<300 &&
          !/yandex|metrika|analytics|pixel|tracking|clmap/i.test(url)) {
        networkImages.push({url,type,status:response.status(),bytes:Number(headers["content-length"]||0)});
      }
    } catch {}
  };
  page.on("response",onResponse);
  const results=[];
  const seen=new Set(initial.thumbnails.map(x=>x.url).filter(Boolean));
  try {
    for (const thumb of initial.thumbnails) {
      if (results.length>=limit) break;
      const responseStart=networkImages.length;
      const clickInfo=await page.evaluate(({index})=>{
        const visible=el=>{
          const r=el.getBoundingClientRect(),s=getComputedStyle(el);
          return r.width>0&&r.height>0&&s.display!=="none"&&s.visibility!=="hidden"&&Number(s.opacity||1)>0;
        };
        const selectors=["[role='dialog']","[aria-modal='true']",".t-popup","[class*='t-popup__']",
          "[class*='t-popup']","[class*='modal']","[class*='lightbox']","[class*='fancybox']","[class*='pswp']"];
        const nodes=[...new Set(selectors.flatMap(s=>[...document.querySelectorAll(s)]))].filter(visible);
        const ranked=nodes.map(root=>{
          const r=root.getBoundingClientRect(),s=getComputedStyle(root);
          const imgs=[...root.querySelectorAll("img")].filter(img=>{
            const ir=img.getBoundingClientRect();return visible(img)&&ir.width>=35&&ir.height>=35;
          });
          const z=Number.parseInt(s.zIndex,10)||0, semantic=root.matches("[role='dialog'],[aria-modal='true'],.t-popup,[class*='t-popup']");
          return {root,imgs,score:Number(semantic)*100000+Number(s.position==="fixed")*50000+Math.min(z,999)*20+imgs.length*10+r.width*r.height/10000};
        }).filter(x=>x.imgs.length).sort((a,b)=>b.score-a.score);
        const root=ranked[0]?.root, img=ranked[0]?.imgs[index];
        if(!root||!img)return {ok:false,rootCount:ranked.length};
        const clickable=img.closest("a[href],button,[role='button']")||img;
        const before=img.currentSrc||img.src||"";
        clickable.click();
        return {ok:true,root:{tag:root.tagName,id:root.id,cls:String(root.className||"").slice(0,180)},
          thumb:before,clickTarget:{tag:clickable.tagName,cls:String(clickable.className||"").slice(0,120),href:clickable.href||""}};
      },{index:thumb.index});
      if(!clickInfo.ok){console.log("  thumb",thumb.index+1,"not clickable in current overlay");continue;}
      console.log("  click",thumb.index+1,JSON.stringify(clickInfo));
      await page.waitForTimeout(1100);

      const state=await page.evaluate(()=>{
        const visible=el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);
          return r.width>100&&r.height>80&&s.display!=="none"&&s.visibility!=="hidden"&&Number(s.opacity||1)>0;};
        const selectors=[".fancybox__image",".fancybox-image",".glightbox-container img",".pswp__img",
          "[class*='lightbox'] img","[class*='viewer'] img","[role='dialog'] img",
          "[class*='modal'] img","[class*='popup'] img","[class*='t-popup'] img"];
        const out=[];
        for(const sel of selectors)for(const img of document.querySelectorAll(sel)){
          if(!visible(img))continue;
          const r=img.getBoundingClientRect();
          for(const url of [img.currentSrc,img.src,img.getAttribute("data-original"),img.getAttribute("data-src")]){
            if(url&&!out.some(x=>x.url===url))out.push({url,width:img.naturalWidth||0,height:img.naturalHeight||0,
              rect:{width:r.width,height:r.height},cls:String(img.className||"").slice(0,100)});
          }
        }
        return out;
      });
      const freshNetwork=networkImages.slice(responseStart).map(x=>x.url);
      const urls=[...new Set([...freshNetwork,...state.map(x=>x.url)])].filter(u=>u&&!seen.has(u));
      const measured=await page.evaluate(async urls=>Promise.all(urls.map(url=>new Promise(resolve=>{
        const img=new Image(),timer=setTimeout(()=>resolve({url,width:0,height:0}),5000);
        img.onload=()=>{clearTimeout(timer);resolve({url,width:img.naturalWidth,height:img.naturalHeight});};
        img.onerror=()=>{clearTimeout(timer);resolve({url,width:0,height:0});};img.src=url;
      }))),urls);
      const best=measured.filter(x=>x.width>=500&&x.height>=300)
        .sort((a,b)=>b.width*b.height-a.width*a.height)[0];
      if(best){seen.add(best.url);results.push({url:best.url,naturalWidth:best.width,naturalHeight:best.height});
        console.log("  => original",best.width+"x"+best.height,best.url);}
      else console.log("  => no original; viewer DOM:",JSON.stringify(state),
        "| new image responses:",JSON.stringify(networkImages.slice(responseStart)));
      await page.keyboard.press("Escape").catch(()=>{});
      await page.waitForTimeout(500);
    }
  } finally { page.off("response",onResponse); }
  console.log("  verified distinct originals:",results.length,"of",initial.thumbnails.length);
  return results;
}

async function clickNext(previousUrl) {
  await page.keyboard.press("ArrowRight").catch(() => {});
  for (let wait = 0; wait < 12; wait++) {
    await page.waitForTimeout(250);
    const current = await findViewerImage();
    if (current && normalizeUrl(current) !== normalizeUrl(previousUrl)) return current;
  }
  const selectors = [
    ".fancybox__button--arrow_right", ".fancybox-button--arrow_right",
    ".glightbox-next", ".pswp__button--arrow--right", ".swiper-button-next",
    'button[aria-label*="next" i]', '[title*="next" i]', '[aria-label*="впер" i]'
  ];
  for (const selector of selectors) {
    const next = page.locator(selector).filter({ visible: true }).first();
    if (!await next.count().catch(() => 0)) continue;
    await next.click({ timeout: 1200 }).catch(() => {});
    for (let wait = 0; wait < 12; wait++) {
      await page.waitForTimeout(250);
      const current = await findViewerImage();
      if (current && normalizeUrl(current) !== normalizeUrl(previousUrl)) return current;
    }
  }
  return "";
}

async function saveImage(url, destination) {
  const response = await context.request.get(url, { timeout: 30000, failOnStatusCode: false });
  if (!response.ok()) throw new Error("HTTP " + response.status());
  const body = await response.body();
  const type = (response.headers()["content-type"] || "").split(";")[0].toLowerCase();
  if (!type.startsWith("image/")) throw new Error("Not an image: " + type);
  if (body.length < 1500) throw new Error("Image response is too small");
  const ext = ({ "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif", "image/avif": ".avif" })[type] || ".img";
  await writeFile(destination.replace(/\.[^.]+$/, ext), body);
  return { file: path.basename(destination.replace(/\.[^.]+$/, ext)), bytes: body.length, contentType: type };
}

try {
  console.log("Opening:", pageUrl);
  await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2500);
  await scrollPage();

  const buttonCount = await page.getByText("Все фото", { exact: true }).count();
  console.log("Found gallery cards:", buttonCount);
  const startCard = Math.min(requestedStart, buttonCount);
  const endCard = Math.min(requestedEnd, buttonCount);
  if (startCard > endCard) throw new Error("Requested card range is outside the page");
  console.log("Processing card range:", startCard + "-" + endCard);

  for (let i = startCard - 1; i < endCard; i++) {
    // Rebuild the page between cards so no previous modal/viewer can leak images into the next project.
    if (i > startCard - 1) {
      await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(1800);
      await scrollPage();
    }
    const buttons = page.getByText("Все фото", { exact: true });
    const button = buttons.nth(i);
    const cardInfo = await readCard(button, i + 1).catch(() => ({ description: "", mainImage: "", cardText: "" }));
    const label = cardInfo.description || "card-" + (i + 1);
    if (requiredCardText && !cardInfo.cardText.toLowerCase().includes(requiredCardText.toLowerCase())) {
      throw new Error("Target card text was not found in card " + (i + 1) + "; refusing to extract a different project.");
    }
    const folder = String(i + 1).padStart(3, "0") + "-" + slug(label);
    const dir = path.join(cardsDir, folder);
    const galleryDir = path.join(dir, "gallery");
    await mkdir(galleryDir, { recursive: true });

    const record = {
      cardIndex: i + 1, description: label, cardText: cardInfo.cardText,
      folder, mainImageUrl: normalizeUrl(cardInfo.mainImage), gallery: [],
      status: "started"
    };
    console.log("\n[" + record.cardIndex + "/" + buttonCount + "]", label);

    try {
      await button.scrollIntoViewIfNeeded();
      await button.click({ timeout: 6000 });
      await page.waitForTimeout(600);

      // The popup contains thumbnails only. Click each thumbnail and capture the
      // full-size image that the site loads into its viewer; never save thumbnail URLs.
      const clickedOriginals = await extractOriginalsByClickingThumbnails(requestedGalleryLimit);
      const seen = new Set();
      for (const item of clickedOriginals) {
        const normalized = normalizeUrl(item.url);
        if (normalized && !seen.has(normalized)) {
          seen.add(normalized);
          record.gallery.push({ url: normalized, order: record.gallery.length + 1,
            naturalWidth: item.naturalWidth, naturalHeight: item.naturalHeight });
        }
      }
      record.status = record.gallery.length ? "captured-by-clicking-thumbnails" : "original-image-not-detected";
      if (!record.gallery.length) {
        console.warn("  No full-size originals detected after clicking thumbnails; refusing to save thumbnails.");
      }

      // Close the lightbox/modal before proceeding to the next card.
      await page.keyboard.press("Escape").catch(() => {});
      await page.waitForTimeout(450);
      // If Escape closed only the viewer, close the gallery modal too.
      await page.keyboard.press("Escape").catch(() => {});
      await page.waitForTimeout(350);
    } catch (error) {
      record.status = "error";
      record.error = String(error.message || error);
      failures.push({ cardIndex: record.cardIndex, error: record.error });
      await page.keyboard.press("Escape").catch(() => {});
    }

    // Save the card's primary image separately from the additional gallery sequence.
    if (record.mainImageUrl) {
      try {
        const saved = await saveImage(record.mainImageUrl, path.join(dir, "main.jpg"));
        record.mainImageFile = saved.file;
      } catch (error) {
        record.mainImageError = String(error.message || error);
      }
    }

    for (const item of record.gallery) {
      const filename = String(item.order).padStart(2, "0") + ".jpg";
      try {
        const saved = await saveImage(item.url, path.join(galleryDir, filename));
        item.file = saved.file;
        item.bytes = saved.bytes;
        item.contentType = saved.contentType;
      } catch (error) {
        item.error = String(error.message || error);
      }
    }

    await writeFile(path.join(dir, "card-info.json"), JSON.stringify({
      cardIndex: record.cardIndex,
      description: record.description,
      cardText: record.cardText,
      mainImageUrl: record.mainImageUrl,
      mainImageFile: record.mainImageFile || null,
      galleryCountDetected: record.gallery.length,
      gallery: record.gallery,
      status: record.status,
      errors: { mainImage: record.mainImageError || null, gallery: record.gallery.filter(x => x.error) }
    }, null, 2), "utf8");

    cards.push(record);
    console.log("  saved gallery images:", record.gallery.filter(x => x.file).length, "| status:", record.status);
  }

  const report = {
    pageUrl, scannedAt: new Date().toISOString(),
    cardCount: cards.length,
    requestedRange: { start: startCard, end: endCard },
    requestedGalleryLimit,
    totalAdditionalGalleryImages: cards.reduce((sum, card) => sum + card.gallery.filter(x => x.file).length, 0),
    cards: cards.map(card => ({
      cardIndex: card.cardIndex, description: card.description, folder: card.folder,
      status: card.status, galleryDetected: card.gallery.length,
      gallerySaved: card.gallery.filter(x => x.file).length,
      mainImageSaved: Boolean(card.mainImageFile), errors: card.gallery.filter(x => x.error).length
    })),
    failures
  };
  await writeFile(path.join(outDir, "report.json"), JSON.stringify(report, null, 2), "utf8");
  const csvRows = [["cardIndex","description","folder","status","mainImageSaved","galleryDetected","gallerySaved","galleryErrors"]];
  for (const card of cards) csvRows.push([
    card.cardIndex, card.description, card.folder, card.status, Boolean(card.mainImageFile),
    card.gallery.length, card.gallery.filter(x => x.file).length, card.gallery.filter(x => x.error).length
  ]);
  const csv = csvRows.map(row => row.map(v => '"' + String(v ?? "").replaceAll('"', '""') + '"').join(",")).join("\n");
  await writeFile(path.join(outDir, "report.csv"), csv, "utf8");
  console.log("\nFinished:", JSON.stringify({
    cards: cards.length,
    requestedRange: { start: startCard, end: endCard },
    requestedGalleryLimit,
    additionalGalleryImages: report.totalAdditionalGalleryImages,
    cardsWithGallery: cards.filter(c => c.gallery.length).length,
    failures: failures.length,
    output: outDir
  }, null, 2));
} finally {
  await browser.close();
}
