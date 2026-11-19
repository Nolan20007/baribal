import { readFile, mkdir, writeFile } from "node:fs/promises";
import crypto from "node:crypto";
import sharp from "sharp";

const config = JSON.parse(await readFile("maintenance/publish-gallery-batch-81-100.json", "utf8"));
const reportPath = "output/creatium-originals-diagnostic/report.json";
const report = JSON.parse(await readFile(reportPath, "utf8"));
if (report.requestedRange?.start !== config.startCard || report.requestedRange?.end !== config.endCard) {
  throw new Error("Diagnostic artifact range does not match requested publication range.");
}
if (report.cardCount !== config.endCard - config.startCard + 1 || report.failures?.length) {
  throw new Error("Diagnostic report is incomplete or contains failed cards.");
}
const destination = "assets/images/portfolio/galleries";
const dataDir = "plain-site/data";
await mkdir(destination, { recursive: true });
await mkdir(dataDir, { recursive: true });
const galleries = {};
const seenHashes = new Map();
let downloaded = 0, reused = 0, skipped = 0;
for (const card of report.cards) {
  if (card.status !== "captured-by-clicking-thumbnails") throw new Error("Unverified card " + card.cardIndex);
  const paths = [];
  const seenUrls = new Set();
  for (const item of card.galleryOriginals || []) {
    if (seenUrls.has(item.url)) continue;
    seenUrls.add(item.url);
    if (!item.url.startsWith("https://i.1.creatium.io/")) throw new Error("Unexpected image host: " + item.url);
    const response = await fetch(item.url, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error("HTTP " + response.status + " for card " + card.cardIndex);
    const bytes = Buffer.from(await response.arrayBuffer());
    const meta = await sharp(bytes).metadata();
    if (!["jpeg", "png", "webp"].includes(meta.format) || meta.width < 500 || meta.height < 300 || bytes.length < 100000) {
      console.log("SKIPPED_INVALID", card.cardIndex, meta.format, meta.width, meta.height, bytes.length);
      skipped++;
      continue;
    }
    const hash = crypto.createHash("sha256").update(bytes).digest("hex");
    const ext = meta.format === "png" ? ".png" : meta.format === "webp" ? ".webp" : ".jpg";
    let relative = seenHashes.get(hash);
    if (relative) {
      reused++;
    } else {
      relative = destination + "/" + hash + ext;
      await writeFile(relative, bytes);
      seenHashes.set(hash, relative);
      downloaded++;
    }
    paths.push("../" + relative);
    console.log("SAVED", card.cardIndex, meta.width + "x" + meta.height, bytes.length);
  }
  galleries[String(card.cardIndex)] = paths;
}
await writeFile(dataDir + "/work-galleries-81-100.json", JSON.stringify(galleries, null, 2) + "\n");
const total = Object.values(galleries).reduce((n, list) => n + list.length, 0);
console.log("GALLERIES_READY", JSON.stringify({ cards: Object.keys(galleries).length, photos: total, downloaded, reused, skipped }));
if (Object.keys(galleries).length !== 20 || total === 0) throw new Error("Gallery publication output is incomplete.");
