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
  // Capture image links directly, then exercise gallery/lightbox and carousel controls.
  // Store selector + index rather than guessing a locator from href/data-fancybox values:
  // data-fancybox is often only a gallery group name, not an image URL.
  const imageSelectors = [
    "[data-fancybox]", "[data-lightbox]", "[data-gallery] a",
    "a:has(img)", "[role='button']:has(img)",
    "[class*='gallery'] img", "[class*='swiper'] img",
    "[class*='slider'] img", "[class*='carousel'] img"
  ];
  const candidates = await page.evaluate(selectors => {
    const result = [];
    const seen = new Set();
    for (const selector of selectors) {
      let nodes = [];
      try { nodes = [...document.querySelectorAll(selector)]; } catch {}
      nodes.forEach((el, index) => {
        const img = el.tagName === "IMG" ? el : el.querySelector("img");
        const rect = el.getBoundingClientRect();
        if (rect.width < 35 || rect.height < 35) return;
        const href = el.getAttribute("href") || el.getAttribute("data-src") ||
          el.getAttribute("data-full") || el.getAttribute("data-original");
        const src = href || img?.currentSrc || img?.src;
        if (!src) return;
        const key = selector + "|" + src;
        if (seen.has(key)) return;
        seen.add(key);
        result.push({ selector, index, src });
      });
    }
    return result.slice(0, 160);
  }, imageSelectors);

  console.log("Gallery/image click candidates:", candidates.length);
  let opened = 0;
  for (const candidate of candidates) {
    try {
      const locator = page.locator(candidate.selector).nth(candidate.index);
      if (!(await locator.count())) continue;
      await locator.scrollIntoViewIfNeeded({ timeout: 1500 }).catch(() => {});
      await locator.click({ timeout: 1800, force: true }).catch(() => {});
      await page.waitForTimeout(450);
      await collectDomImages("gallery-viewer");
      const viewerImages = await page.evaluate(() => {
        const selectors = [
          "[class*='fancybox'] img", "[class*='lightbox'] img",
          "[class*='glightbox'] img", "[role='dialog'] img",
          "[class*='modal'] img", "[class*='viewer'] img",
          "[class*='pswp'] img"
        ];
        return selectors.flatMap(s => [...document.querySelectorAll(s)]
          .map(img => img.currentSrc || img.src).filter(Boolean));
      });
      for (const src of viewerImages) remember(src, "gallery-viewer");
      opened++;
      await page.keyboard.press("Escape").catch(() => {});
      await page.waitForTimeout(180);
    } catch {}
  }

  // Step through common carousel implementations. This catches slides whose images
  // are inserted only when they become active (lazy-loaded Swiper/Slick/Owl sliders).
  const nextSelectors = [
    ".swiper-button-next", ".slick-next", ".owl-next",
    "[aria-label*='next' i]", "[title*='next' i]",
    "[class*='gallery'] [class*='next']",
    "[class*='slider'] [class*='next']",
    "[class*='carousel'] [class*='next']"
  ];
  let advanced = 0;
  for (const selector of nextSelectors) {
    let count = 0;
    try { count = await page.locator(selector).count(); } catch {}
    for (let i = 0; i < Math.min(count, 8); i++) {
      const control = page.locator(selector).nth(i);
      try {
        if (!(await control.isVisible())) continue;
        // A bounded loop prevents a looping carousel from running forever.
        for (let step = 0; step < 24; step++) {
          await control.click({ timeout: 1200, force: true }).catch(() => {});
          await page.waitForTimeout(350);
          await collectDomImages("carousel-slide");
          const activeImages = await page.evaluate(() => {
            const selectors = [
              ".swiper-slide-active img", ".slick-current img",
              ".owl-item.active img", "[aria-hidden='false'] img",
              "[class*='carousel'] img", "[class*='slider'] img"
            ];
            return selectors.flatMap(s => [...document.querySelectorAll(s)]
              .map(img => img.currentSrc || img.src).filter(Boolean));
          });
          for (const src of activeImages) remember(src, "carousel-slide");
          advanced++;
          const disabled = await control.getAttribute("aria-disabled").catch(() => null);
          const cls = await control.getAttribute("class").catch(() => "");
          if (disabled === "true" || /\bdisabled\b/.test(cls || "")) break;
        }
      } catch {}
    }
  }
  console.log("Gallery items opened:", opened);
  console.log("Carousel advances attempted:", advanced);
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
