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
await mkdir(outDir, { recursive: true });
const found = new Map();
const skipped = [];
const failures = [];
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
page.setDefaultTimeout(5000);

function remember(url, source) {
  if (!url || typeof url !== "string") return;
  try {
    const absolute = new URL(url, pageUrl);
    if (!["http:", "https:"].includes(absolute.protocol)) return;
    if (/\.(?:svg|png|jpe?g|webp|gif|avif|bmp|tiff?)(?:$|[?#])/i.test(absolute.href) ||
        /image\//i.test(source)) found.set(absolute.href, source);
  } catch {}
}

async function collectDomImages(source) {
  const items = await page.evaluate(() => {
    const values = [];
    const add = (value, kind) => { if (value) values.push({ url: value, kind }); };
    for (const img of document.images) {
      add(img.currentSrc, "img-currentSrc");
      add(img.src, "img-src");
      for (const candidate of (img.getAttribute("srcset") || "").split(",")) add(candidate.trim().split(/\s+/)[0], "img-srcset");
      for (const attr of img.attributes) if (/^(data-src|data-original|data-lazy-src|data-image|data-full|data-href|data-large)$/i.test(attr.name)) add(attr.value, attr.name);
    }
    for (const source of document.querySelectorAll("picture source, source[srcset]")) {
      for (const candidate of (source.getAttribute("srcset") || "").split(",")) add(candidate.trim().split(/\s+/)[0], "source-srcset");
    }
    for (const el of document.querySelectorAll("*")) {
      const bg = getComputedStyle(el).backgroundImage;
      for (const match of bg.matchAll(/url\(["']?(.*?)["']?\)/g)) add(match[1], "css-background");
      for (const attr of el.attributes || []) if (/^(data-src|data-original|data-lazy-src|data-image|data-full|data-background|data-bg)$/i.test(attr.name)) add(attr.value, attr.name);
    }
    for (const a of document.querySelectorAll("a[href]")) {
      if (/\.(?:jpe?g|png|webp|gif|avif|bmp|tiff?)(?:$|[?#])/i.test(a.href)) add(a.href, "image-link");
    }
    return values;
  });
  for (const item of items) remember(item.url, source || item.kind);
}

page.on("response", async response => {
  try {
    const type = response.headers()["content-type"] || "";
    if (type.startsWith("image/") && response.status() < 400) remember(response.url(), "network");
  } catch {}
});

async function scrollWholePage() {
  let previous = 0;
  for (let pass = 0; pass < 8; pass++) {
    const height = await page.evaluate(() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight));
    for (let y = 0; y < height; y += 650) {
      await page.evaluate(pos => window.scrollTo(0, pos), y);
      await page.waitForTimeout(250);
    }
    await page.waitForTimeout(500);
    const next = await page.evaluate(() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight));
    if (next === previous && pass > 0) break;
    previous = next;
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
}

async function clickThroughGalleries() {
  // Creatium pages commonly use Fancybox, Swiper, GLightbox and custom clickable image cards.
  const selectors = [
    "[data-fancybox]", "[data-lightbox]", "[data-gallery] a", "[class*='gallery'] a",
    "[class*='swiper'] a", "[class*='slider'] a", "a:has(img)", "[role='button']:has(img)"
  ];
  const candidates = await page.evaluate((selectors) => {
    const seen = new Set();
    const result = [];
    for (const selector of selectors) {
      for (const el of document.querySelectorAll(selector)) {
        const rect = el.getBoundingClientRect();
        if (rect.width < 35 || rect.height < 35) continue;
        const href = el.getAttribute("href") || el.getAttribute("data-src") || el.getAttribute("data-fancybox");
        const img = el.querySelector("img") || (el.tagName === "IMG" ? el : null);
        const src = href || img?.currentSrc || img?.src;
        if (!src || seen.has(src)) continue;
        seen.add(src);
        result.push({ selector, src });
      }
    }
    return result.slice(0, 100);
  }, selectors);

  console.log("Gallery-like clickable elements:", candidates.length);
  let opened = 0;
  for (const candidate of candidates) {
    try {
      // Re-locate by URL so that earlier DOM changes do not invalidate an index.
      const locator = page.locator(candidate.selector).filter({ has: page.locator("img") });
      let target = locator.filter({ has: page.locator("img") });
      const count = await target.count();
      let clicked = false;
      for (let i = 0; i < Math.min(count, 100); i++) {
        const item = target.nth(i);
        const href = await item.getAttribute("href").catch(() => null);
        const imgSrc = await item.locator("img").first().getAttribute("src").catch(() => null);
        if ((href || imgSrc || "") !== candidate.src && (imgSrc || "") !== candidate.src) continue;
        await item.scrollIntoViewIfNeeded();
        await item.click({ timeout: 1800 }).catch(() => {});
        clicked = true;
        break;
      }
      if (!clicked) continue;
      await page.waitForTimeout(650);
      await collectDomImages("gallery-viewer");
      // Also inspect common viewer containers for full-size sources.
      const viewerImages = await page.evaluate(() => {
        const selectors = ["[class*='fancybox'] img", "[class*='lightbox'] img", "[class*='glightbox'] img",
          "[role='dialog'] img", "[class*='modal'] img", "[class*='viewer'] img"];
        return selectors.flatMap(s => [...document.querySelectorAll(s)].map(img => img.currentSrc || img.src).filter(Boolean));
      });
      for (const src of viewerImages) remember(src, "gallery-viewer");
      opened++;
      await page.keyboard.press("Escape").catch(() => {});
      await page.waitForTimeout(250);
    } catch {}
  }
  console.log("Gallery items opened:", opened);
}

try {
  console.log("Opening:", pageUrl);
  await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2200);
  await scrollWholePage();
  await collectDomImages("initial-page");
  await clickThroughGalleries();
  await scrollWholePage();
  await collectDomImages("after-gallery-scan");

  console.log("Unique image URLs discovered:", found.size);
  const manifest = [];
  let index = 0;
  for (const [url, source] of found) {
    try {
      const response = await context.request.get(url, { timeout: 30000, failOnStatusCode: false });
      if (!response.ok()) throw new Error("HTTP " + response.status());
      const body = await response.body();
      const type = (response.headers()["content-type"] || "").split(";")[0].toLowerCase();
      if (!type.startsWith("image/")) throw new Error("Not an image content-type: " + type);
      if (body.length < 2048) { skipped.push({ url, source, reason: "under 2 KB (likely tracking pixel or UI icon)", bytes: body.length }); continue; }

      // Ask Chromium to decode the image and reject tiny tracking pixels and UI glyphs.
      const dimensions = await page.evaluate(async url => {
        const img = new Image();
        img.src = url;
        try { await img.decode(); } catch {}
        return { width: img.naturalWidth || 0, height: img.naturalHeight || 0 };
      }, url).catch(() => ({ width: 0, height: 0 }));
      if (dimensions.width < 64 || dimensions.height < 64) {
        skipped.push({ url, source, reason: "smaller than 64 px in at least one dimension", bytes: body.length, ...dimensions });
        continue;
      }
      const extByType = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif", "image/avif": ".avif", "image/svg+xml": ".svg", "image/bmp": ".bmp", "image/tiff": ".tif" };
      const ext = extByType[type] || ".img";
      const hash = crypto.createHash("sha1").update(url).digest("hex").slice(0, 10);
      const file = String(++index).padStart(3, "0") + "-" + hash + ext;
      await writeFile(path.join(outDir, file), body);
      manifest.push({ file, url, source, status: "downloaded", bytes: body.length, contentType: type, ...dimensions });
      console.log("Saved", file, dimensions.width + "x" + dimensions.height, body.length, "bytes");
    } catch (error) {
      failures.push({ url, source, error: String(error.message || error) });
      manifest.push({ file: "", url, source, status: "failed", error: String(error.message || error) });
      console.warn("Failed:", url, error.message || error);
    }
  }

  const report = {
    pageUrl, scannedAt: new Date().toISOString(), discovered: found.size,
    downloaded: manifest.filter(x => x.status === "downloaded").length,
    skipped: skipped.length, failed: failures.length, images: manifest, skippedAssets: skipped, failures
  };
  await writeFile(path.join(outDir, "report.json"), JSON.stringify(report, null, 2), "utf8");
  const rows = [...manifest.map(x => ({ ...x, kind: "downloaded-or-failed" })),
    ...skipped.map(x => ({ ...x, status: "skipped", kind: "filtered" }))];
  const csv = ["file,status,source,bytes,width,height,url,error", ...rows.map(x =>
    [x.file || "", x.status || "", x.source || "", x.bytes || "", x.width || "", x.height || "", x.url || "", x.error || x.reason || ""]
      .map(v => '"' + String(v ?? "").replaceAll('"', '""') + '"').join(",")
  )].join("\n");
  await writeFile(path.join(outDir, "report.csv"), csv, "utf8");
  console.log(JSON.stringify({ discovered: report.discovered, downloaded: report.downloaded, skipped: report.skipped, failed: report.failed }, null, 2));
} finally {
  await browser.close();
}
