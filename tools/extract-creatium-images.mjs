import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const pageUrl = process.env.PAGE_URL;
if (!pageUrl) throw new Error("PAGE_URL is required");
const parsed = new URL(pageUrl);
if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Only HTTP(S) page URLs are supported");
const host = parsed.hostname.toLowerCase();
if (host === "localhost" || host.endsWith(".localhost") || host === "127.0.0.1" || host === "::1" ||
    /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host)) {
  throw new Error("Local/private network addresses are not allowed");
}

const outDir = path.resolve("output/creatium-images");
const pageAssetsDir = path.join(outDir, "page-assets");
const galleriesDir = path.join(outDir, "galleries");
await mkdir(pageAssetsDir, { recursive: true });
await mkdir(galleriesDir, { recursive: true });

const pageAssets = new Map();
const galleryRecords = [];
const failures = [];
let activeGallery = null;
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
page.setDefaultTimeout(7000);

function isImageUrl(value) {
  try {
    const u = new URL(value, pageUrl);
    return ["http:", "https:"].includes(u.protocol) &&
      /\.(?:svg|png|jpe?g|webp|gif|avif|bmp|tiff?)(?:$|[?#])/i.test(u.href);
  } catch { return false; }
}

function addUrl(map, value, source) {
  if (!value || typeof value !== "string") return;
  try {
    const url = new URL(value, pageUrl).href;
    if (isImageUrl(url)) map.set(url, source || "unknown");
  } catch {}
}

page.on("response", async response => {
  try {
    if (response.status() >= 400) return;
    const type = (response.headers()["content-type"] || "").toLowerCase();
    if (!type.startsWith("image/")) return;
    const url = response.url();
    if (activeGallery) addUrl(activeGallery.assets, url, "gallery-network");
    else addUrl(pageAssets, url, "page-network");
  } catch {}
});

async function collectPageDomImages(targetMap, source) {
  const urls = await page.evaluate(() => {
    const result = [];
    const add = (v) => { if (v) result.push(v); };
    for (const img of document.images) {
      add(img.currentSrc); add(img.src);
      for (const candidate of (img.getAttribute("srcset") || "").split(",")) add(candidate.trim().split(/\s+/)[0]);
      for (const attr of img.attributes) {
        if (/^(data-src|data-original|data-lazy-src|data-image|data-full|data-href|data-large)$/i.test(attr.name)) add(attr.value);
      }
    }
    return result;
  });
  for (const url of urls) addUrl(targetMap, url, source);
}

async function collectGalleryDomImages(targetMap, source) {
  const urls = await page.evaluate(() => {
    const result = [];
    for (const img of document.images) {
      const rect = img.getBoundingClientRect();
      if (rect.width < 35 || rect.height < 35 || getComputedStyle(img).visibility === "hidden") continue;
      let node = img;
      let inViewer = false;
      for (let depth = 0; node && depth < 9; depth++, node = node.parentElement) {
        const cls = typeof node.className === "string" ? node.className : "";
        if (node.getAttribute?.("role") === "dialog" || /modal|gallery|lightbox|fancybox|viewer|popup|overlay|glightbox|pswp/i.test(cls)) {
          inViewer = true; break;
        }
      }
      if (inViewer) result.push(img.currentSrc || img.src);
    }
    return result;
  });
  for (const url of urls) addUrl(targetMap, url, source);
}

async function scrollWholePage() {
  let previous = 0;
  for (let pass = 0; pass < 7; pass++) {
    const height = await page.evaluate(() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight));
    for (let y = 0; y < height; y += 650) {
      await page.evaluate(pos => window.scrollTo(0, pos), y);
      await page.waitForTimeout(180);
    }
    await page.waitForTimeout(350);
    const next = await page.evaluate(() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight));
    if (next === previous && pass > 0) break;
    previous = next;
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
}

function slug(value) {
  return String(value || "project")
    .normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-+|-+$/g, "").slice(0, 55) || "project";
}

async function getCardLabel(button) {
  return await button.evaluate(el => {
    let node = el;
    for (let depth = 0; node && depth < 7; depth++, node = node.parentElement) {
      const heading = node.querySelector("h1,h2,h3,h4,[class*='title'],[class*='name']");
      const headingText = (heading?.innerText || "").replace(/\s+/g, " ").trim();
      if (headingText.length > 2 && headingText.length < 120) return headingText;
      const text = (node.innerText || "").replace(/\s+/g, " ").trim();
      const beforeButton = text.split(/Все фото/i)[0].trim();
      if (beforeButton.length > 2 && beforeButton.length < 120) return beforeButton;
    }
    return "project";
  }).catch(() => "project");
}

async function activeViewerImageUrl() {
  return await page.evaluate(() => {
    const selectors = [
      ".fancybox__image", ".fancybox-image", ".glightbox-container img",
      ".pswp__img", "[class*='lightbox'] img", "[class*='viewer'] img",
      "[role='dialog'] img", "[class*='modal'] img"
    ];
    for (const selector of selectors) {
      const imgs = [...document.querySelectorAll(selector)].filter(el => {
        const r = el.getBoundingClientRect();
        return r.width > 100 && r.height > 100 && getComputedStyle(el).visibility !== "hidden";
      });
      if (imgs.length) {
        imgs.sort((a,b) => (b.getBoundingClientRect().width*b.getBoundingClientRect().height) -
                           (a.getBoundingClientRect().width*a.getBoundingClientRect().height));
        return imgs[0].currentSrc || imgs[0].src || "";
      }
    }
    const visible = [...document.images].filter(img => {
      const r = img.getBoundingClientRect();
      return r.width > 180 && r.height > 140 && getComputedStyle(img).visibility !== "hidden";
    }).sort((a,b) => (b.getBoundingClientRect().width*b.getBoundingClientRect().height) -
                     (a.getBoundingClientRect().width*a.getBoundingClientRect().height));
    return visible[0]?.currentSrc || visible[0]?.src || "";
  });
}

async function clickFirstPhotoInModal() {
  const selectors = [
    "[role='dialog'] img", "[class*='modal'] img", "[class*='gallery'] img",
    "[class*='fancybox'] img", "[class*='lightbox'] img", "img"
  ];
  for (const selector of selectors) {
    const imgs = page.locator(selector);
    const count = await imgs.count().catch(() => 0);
    for (let i = 0; i < Math.min(count, 30); i++) {
      const img = imgs.nth(i);
      const visible = await img.isVisible().catch(() => false);
      if (!visible) continue;
      const box = await img.boundingBox().catch(() => null);
      if (!box || box.width < 70 || box.height < 70) continue;
      await img.click({ timeout: 2500 }).catch(() => {});
      await page.waitForTimeout(450);
      const url = await activeViewerImageUrl();
      if (url) return url;
    }
  }
  return "";
}

async function scanOneGallery(button, cardIndex) {
  const label = await getCardLabel(button);
  const folderName = String(cardIndex).padStart(3, "0") + "-" + slug(label);
  const record = { cardIndex, label, folder: folderName, assets: new Map(), status: "started" };
  console.log("\n[" + cardIndex + "] Opening gallery:", label);

  activeGallery = record;
  try {
    await button.scrollIntoViewIfNeeded();
    await button.click({ timeout: 5000 });
    await page.waitForTimeout(500);
    await collectGalleryDomImages(record.assets, "gallery-modal-dom");

    const firstUrl = await clickFirstPhotoInModal();
    await page.waitForTimeout(450);
    await collectGalleryDomImages(record.assets, "gallery-viewer-dom");
    if (firstUrl) addUrl(record.assets, firstUrl, "active-viewer");

    if (!firstUrl) {
      record.status = "opened-no-viewer-image";
      console.log("  Could not identify the opened image; moving on.");
      await page.keyboard.press("Escape").catch(() => {});
      await page.waitForTimeout(250);
      galleryRecords.push(record);
      return;
    }

    const seenViewerUrls = new Set([firstUrl]);
    let previousUrl = firstUrl;
    let repeated = false;
    for (let step = 0; step < 80; step++) {
      // Creatium's lightbox advances with the right-arrow key; the UI button is a fallback.
      await page.keyboard.press("ArrowRight").catch(() => {});
      await page.waitForTimeout(400);
      let currentUrl = await activeViewerImageUrl();
      if (!currentUrl || currentUrl === previousUrl) {
        const nextSelectors = [
          ".fancybox__button--arrow_right", ".fancybox-button--arrow_right",
          ".glightbox-next", ".pswp__button--arrow--right", ".swiper-button-next",
          'button[aria-label*="next" i]', '[title*="next" i]', '[aria-label*="впер" i]'
        ];
        for (const selector of nextSelectors) {
          const next = page.locator(selector).filter({ visible: true }).first();
          if (await next.count().catch(() => 0)) {
            await next.click({ timeout: 1200 }).catch(() => {});
            await page.waitForTimeout(450);
            currentUrl = await activeViewerImageUrl();
            if (currentUrl && currentUrl !== previousUrl) break;
          }
        }
      }
      await collectGalleryDomImages(record.assets, "gallery-viewer-dom");
      if (currentUrl) addUrl(record.assets, currentUrl, "active-viewer");
      if (!currentUrl) continue;
      if (seenViewerUrls.has(currentUrl)) {
        repeated = true;
        break;
      }
      seenViewerUrls.add(currentUrl);
      previousUrl = currentUrl;
      console.log("  photo", seenViewerUrls.size, "captured");
    }

    record.status = repeated ? "complete-cycle-detected" : "stopped-at-safety-limit";
    record.uniqueViewerImages = seenViewerUrls.size;
    console.log("  Unique viewer images:", seenViewerUrls.size, "| all gallery assets:", record.assets.size);
  } catch (error) {
    record.status = "error";
    record.error = String(error.message || error);
    failures.push({ cardIndex, label, error: record.error });
    console.warn("  Gallery error:", record.error);
  } finally {
    activeGallery = null;
    await page.keyboard.press("Escape").catch(() => {});
    await page.waitForTimeout(350);
    galleryRecords.push(record);
  }
}

async function findAllPhotoButtons() {
  return page.getByText("Все фото", { exact: true }).all();
}

async function saveImage(url, destination) {
  const response = await context.request.get(url, { timeout: 30000, failOnStatusCode: false });
  if (!response.ok()) throw new Error("HTTP " + response.status());
  const body = await response.body();
  const type = (response.headers()["content-type"] || "").split(";")[0].toLowerCase();
  if (!type.startsWith("image/")) throw new Error("Not an image content-type: " + type);
  if (body.length < 2048) return { skipped: "under 2 KB", bytes: body.length };
  const dimensions = await page.evaluate(async url => {
    const img = new Image(); img.src = url;
    try { await img.decode(); } catch {}
    return { width: img.naturalWidth || 0, height: img.naturalHeight || 0 };
  }, url).catch(() => ({ width: 0, height: 0 }));
  if (dimensions.width < 64 || dimensions.height < 64) {
    return { skipped: "smaller than 64 px", bytes: body.length, ...dimensions };
  }
  const extByType = {
    "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp",
    "image/gif": ".gif", "image/avif": ".avif", "image/svg+xml": ".svg",
    "image/bmp": ".bmp", "image/tiff": ".tif"
  };
  const ext = extByType[type] || (path.extname(new URL(url).pathname) || ".img");
  const hash = crypto.createHash("sha1").update(url).digest("hex").slice(0, 8);
  const filename = hash + ext;
  await writeFile(destination, body);
  return { filename, bytes: body.length, contentType: type, ...dimensions };
}

try {
  console.log("Opening:", pageUrl);
  await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2200);
  await scrollWholePage();
  await collectPageDomImages(pageAssets, "initial-page-dom");

  const buttons = await findAllPhotoButtons();
  console.log("Found 'Все фото' buttons:", buttons.length);
  for (let i = 0; i < buttons.length; i++) {
    // Re-query each time because modal opening/closing can rebuild the page DOM.
    const currentButtons = await findAllPhotoButtons();
    if (i >= currentButtons.length) break;
    await scanOneGallery(currentButtons[i], i + 1);
  }

  const manifest = [];
  let pageIndex = 0;
  for (const [url, source] of pageAssets) {
    try {
      const hash = crypto.createHash("sha1").update(url).digest("hex").slice(0, 8);
      const response = await context.request.get(url, { timeout: 30000, failOnStatusCode: false });
      if (!response.ok()) throw new Error("HTTP " + response.status());
      const type = (response.headers()["content-type"] || "").split(";")[0].toLowerCase();
      const ext = ({ "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/svg+xml": ".svg" })[type] || ".img";
      const result = await saveImage(url, path.join(pageAssetsDir, String(++pageIndex).padStart(3, "0") + "-" + hash + ext));
      manifest.push({ scope: "page-assets", cardIndex: "", card: "", url, source, ...result });
    } catch (error) {
      manifest.push({ scope: "page-assets", url, source, error: String(error.message || error) });
    }
  }

  for (const record of galleryRecords) {
    const dir = path.join(galleriesDir, record.folder);
    await mkdir(dir, { recursive: true });
    let imageIndex = 0;
    for (const [url, source] of record.assets) {
      try {
        const hash = crypto.createHash("sha1").update(url).digest("hex").slice(0, 8);
        const response = await context.request.get(url, { timeout: 30000, failOnStatusCode: false });
        if (!response.ok()) throw new Error("HTTP " + response.status());
        const type = (response.headers()["content-type"] || "").split(";")[0].toLowerCase();
        const ext = ({ "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif", "image/avif": ".avif" })[type] || ".img";
        const filename = String(++imageIndex).padStart(2, "0") + "-" + hash + ext;
        const result = await saveImage(url, path.join(dir, filename));
        manifest.push({ scope: "gallery", cardIndex: record.cardIndex, card: record.label, folder: record.folder, file: filename, url, source, ...result });
      } catch (error) {
        manifest.push({ scope: "gallery", cardIndex: record.cardIndex, card: record.label, folder: record.folder, url, source, error: String(error.message || error) });
      }
    }
    await writeFile(path.join(dir, "gallery-info.json"), JSON.stringify({
      cardIndex: record.cardIndex, card: record.label, status: record.status,
      uniqueViewerImages: record.uniqueViewerImages || null,
      savedImages: manifest.filter(x => x.scope === "gallery" && x.cardIndex === record.cardIndex && x.filename).map(x => ({ file: x.file, url: x.url }))
    }, null, 2), "utf8");
  }

  const report = {
    pageUrl, scannedAt: new Date().toISOString(),
    galleryCount: galleryRecords.length,
    galleries: galleryRecords.map(({ assets, ...record }) => ({ ...record, discoveredAssets: assets.size })),
    downloaded: manifest.filter(x => x.filename).length,
    failed: manifest.filter(x => x.error).length,
    skipped: manifest.filter(x => x.skipped).length,
    images: manifest
  };
  await writeFile(path.join(outDir, "report.json"), JSON.stringify(report, null, 2), "utf8");
  const columns = ["scope","cardIndex","card","folder","file","source","bytes","width","height","url","error","skipped"];
  const csv = [columns.join(","), ...manifest.map(row => columns.map(key =>
    '"' + String(row[key] ?? "").replaceAll('"', '""') + '"'
  ).join(","))].join("\n");
  await writeFile(path.join(outDir, "report.csv"), csv, "utf8");

  console.log("\nFinished.");
  console.log(JSON.stringify({
    galleries: galleryRecords.length,
    pageAssets: manifest.filter(x => x.scope === "page-assets" && x.filename).length,
    galleryImages: manifest.filter(x => x.scope === "gallery" && x.filename).length,
    failed: report.failed, skipped: report.skipped,
    output: outDir
  }, null, 2));
  console.log("See report.csv/report.json to match every image to its source card.");
} finally {
  await browser.close();
}
