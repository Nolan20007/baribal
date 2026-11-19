import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const manifest = JSON.parse(await readFile("maintenance/verified-gallery-batch-61-80.json", "utf8"));
const destination = "assets/images/portfolio/galleries";
const dataDir = "plain-site/data";
await mkdir(destination, { recursive: true });
await mkdir(dataDir, { recursive: true });
const galleries = {};
let downloaded = 0;
let reused = 0;
for (const card of manifest.cards) {
  if (card.cardIndex === 75) continue;
  const paths = [];
  const seen = new Set();
  for (const filename of card.filenames) {
    if (seen.has(filename)) continue;
    seen.add(filename);
    const url = manifest.baseUrl + filename;
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error("HTTP " + response.status + " for card " + card.cardIndex + ": " + url);
    const bytes = Buffer.from(await response.arrayBuffer());
    const meta = await sharp(bytes).metadata();
    if (!["jpeg", "png", "webp"].includes(meta.format) || meta.width < 500 || meta.height < 300 || bytes.length < 100000) {
      console.log("SKIPPED_INVALID", card.cardIndex, filename, meta.format, meta.width, meta.height, bytes.length);
      continue;
    }
    const hash = crypto.createHash("sha256").update(bytes).digest("hex");
    const ext = meta.format === "png" ? ".png" : meta.format === "webp" ? ".webp" : ".jpg";
    const relative = destination + "/" + hash + ext;
    try {
      await readFile(relative);
      reused++;
    } catch {
      await writeFile(relative, bytes);
      downloaded++;
    }
    paths.push("../" + relative);
    console.log("SAVED", card.cardIndex, filename, meta.width + "x" + meta.height, bytes.length);
  }
  galleries[String(card.cardIndex)] = paths;
}
await writeFile(dataDir + "/work-galleries-61-80.json", JSON.stringify(galleries, null, 2) + "\n");
console.log("GALLERIES_READY", JSON.stringify({ cards: Object.keys(galleries).length, downloaded, reused, photos: Object.values(galleries).reduce((n, a) => n + a.length, 0), skippedCard: 75 }));
