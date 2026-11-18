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
    if (!/\.(?:svg|png|jpe?g|webp|gif|avif|bmp|tiff?)(?:$|[?#])/i.test(u.href)) return "";
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
    const overlayPattern = /modal|popup|gallery|fancybox|lightbox|swiper|slick|fotorama|viewer|overlay|photo/i;
    const roots = [...document.querySelectorAll(
      "[role='dialog'],[aria-modal='true'],[class*='modal'],[class*='popup'],[class*='gallery'],[class*='fancybox'],[class*='lightbox'],[class*='swiper'],[class*='slick'],[class*='fotorama'],[class*='viewer'],[class*='overlay']"
    )].filter(root => visible(root) && overlayPattern.test(String(root.className || "") + " " + root.getAttribute("role")));
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

      // Creatium may expose every slide in the popup DOM (including lazy-loaded slides)
      // without creating a separate lightbox. Collect those first; then use the viewer
      // navigation only as a fallback for galleries that render a single slide at a time.
      const directUrls = await readGalleryImages();
      const seen = new Set();
      for (const url of directUrls) {
        const normalized = normalizeUrl(url);
        if (normalized && !seen.has(normalized) && record.gallery.length < requestedGalleryLimit) {
          seen.add(normalized);
          record.gallery.push({ url: normalized, order: record.gallery.length + 1 });
        }
      }

      if (record.gallery.length <= 1 && record.gallery.length < requestedGalleryLimit) {
        const firstUrl = await findViewerImage() || await clickModalPhoto();
        if (firstUrl) {
          let current = firstUrl;
          for (let n = 0; n < requestedGalleryLimit && current; n++) {
            const normalized = normalizeUrl(current);
            if (!normalized || seen.has(normalized)) {
              const nextAfterDuplicate = await clickNext(current);
              if (!nextAfterDuplicate) break;
              current = nextAfterDuplicate;
              continue;
            }
            seen.add(normalized);
            record.gallery.push({ url: normalized, order: record.gallery.length + 1 });
            console.log("  gallery image", record.gallery.length);
            const next = await clickNext(current);
            if (!next) break;
            current = next;
          }
        }
      }
      record.status = record.gallery.length
        ? (directUrls.length ? "captured-popup-images" : "captured-viewer-sequence")
        : "viewer-not-detected";
      if (!record.gallery.length) console.warn("  No gallery image detected; no guessed files saved.");

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
