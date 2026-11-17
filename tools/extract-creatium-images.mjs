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
const failures = [];
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
page.setDefaultTimeout(12000);

function remember(url, source) {
  if (!url || typeof url !== "string") return;
  try {
    const absolute = new URL(url, pageUrl);
    if (!["http:", "https:"].includes(absolute.protocol)) return;
    if (/\.(?:svg|png|jpe?g|webp|gif|avif|bmp|tiff?)(?:$|[?#])/i.test(absolute.href) ||
        /image\//i.test(source)) {
      found.set(absolute.href, source);
    }
  } catch {}
}

page.on("response", async response => {
  try {
    const type = response.headers()["content-type"] || "";
    if (type.startsWith("image/") && response.status() < 400) remember(response.url(), "network");
  } catch {}
});

try {
  console.log("Opening:", pageUrl);
  await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2500);

  // Scroll in steps so lazy-loaded galleries have a chance to load.
  const height = await page.evaluate(() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight));
  for (let y = 0; y < height; y += 700) {
    await page.evaluate(pos => window.scrollTo(0, pos), y);
    await page.waitForTimeout(350);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(700);

  const urls = await page.evaluate(() => {
    const values = [];
    const add = (value, kind) => {
      if (value) values.push({ url: value, kind });
    };
    for (const img of document.images) {
      add(img.currentSrc, "img-currentSrc");
      add(img.src, "img-src");
      for (const candidate of (img.getAttribute("srcset") || "").split(",")) {
        add(candidate.trim().split(/\s+/)[0], "img-srcset");
      }
      for (const attr of img.attributes) {
        if (/^(data-src|data-original|data-lazy-src|data-image|data-full|data-href)$/i.test(attr.name)) add(attr.value, attr.name);
      }
    }
    for (const source of document.querySelectorAll("picture source, source[srcset]")) {
      for (const candidate of (source.getAttribute("srcset") || "").split(",")) add(candidate.trim().split(/\s+/)[0], "source-srcset");
    }
    for (const el of document.querySelectorAll("*")) {
      const bg = getComputedStyle(el).backgroundImage;
      for (const match of bg.matchAll(/url\(["']?(.*?)["']?\)/g)) add(match[1], "css-background");
      for (const attr of el.attributes || []) {
        if (/^(data-src|data-original|data-lazy-src|data-image|data-full|data-background|data-bg)$/i.test(attr.name)) add(attr.value, attr.name);
      }
    }
    for (const a of document.querySelectorAll("a[href]")) {
      const href = a.href;
      if (/\.(?:jpe?g|png|webp|gif|avif|bmp|tiff?)(?:$|[?#])/i.test(href)) add(href, "image-link");
    }
    return values;
  });

  for (const item of urls) remember(item.url, item.kind);
  console.log("Unique image URLs discovered:", found.size);

  let index = 0;
  const manifest = [];
  for (const [url, source] of found) {
    index++;
    try {
      const response = await context.request.get(url, { timeout: 30000, failOnStatusCode: false });
      if (!response.ok()) throw new Error("HTTP " + response.status());
      const body = await response.body();
      const type = (response.headers()["content-type"] || "").split(";")[0].toLowerCase();
      if (!type.startsWith("image/") && body.length < 100) throw new Error("Response is not an image");
      const extByType = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif", "image/avif": ".avif", "image/svg+xml": ".svg", "image/bmp": ".bmp", "image/tiff": ".tif" };
      const urlExt = path.extname(new URL(url).pathname).slice(0, 8);
      const ext = extByType[type] || (urlExt && /^\.[a-z0-9]+$/i.test(urlExt) ? urlExt : ".img");
      const hash = crypto.createHash("sha1").update(url).digest("hex").slice(0, 10);
      const file = String(index).padStart(3, "0") + "-" + hash + ext;
      await writeFile(path.join(outDir, file), body);
      manifest.push({ file, url, source, status: "downloaded", bytes: body.length, contentType: type });
      console.log("Saved", file, body.length, "bytes");
    } catch (error) {
      failures.push({ url, source, error: String(error.message || error) });
      manifest.push({ file: "", url, source, status: "failed", error: String(error.message || error) });
      console.warn("Failed:", url, error.message || error);
    }
  }

  const report = {
    pageUrl,
    scannedAt: new Date().toISOString(),
    discovered: found.size,
    downloaded: manifest.filter(x => x.status === "downloaded").length,
    failed: failures.length,
    images: manifest,
    failures
  };
  await writeFile(path.join(outDir, "report.json"), JSON.stringify(report, null, 2), "utf8");
  const csv = ["file,status,source,bytes,contentType,url,error", ...manifest.map(x =>
    [x.file, x.status, x.source, x.bytes || "", x.contentType || "", x.url, x.error || ""]
      .map(v => '"' + String(v ?? "").replaceAll('"', '""') + '"').join(",")
  )].join("\n");
  await writeFile(path.join(outDir, "report.csv"), csv, "utf8");
  console.log(JSON.stringify({ discovered: report.discovered, downloaded: report.downloaded, failed: report.failed }, null, 2));
} catch (error) {
  console.error(error);
  throw error;
} finally {
  await browser.close();
}
