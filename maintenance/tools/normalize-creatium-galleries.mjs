import { createHash } from "node:crypto";
import { access, copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const cardsRoot = path.join(root, "output/creatium-images/cards");
const destinationRoot = path.join(root, "assets/images/portfolio/galleries");
const indexPath = path.join(root, "maintenance/creatium-gallery-index.json");

async function exists(file) {
  try { await access(file); return true; } catch { return false; }
}
async function walkImages(directory) {
  const result = [];
  if (!await exists(directory)) return result;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await walkImages(full));
    else if (/\.(?:jpe?g|png|webp|gif|avif|svg)$/i.test(entry.name)) result.push(full);
  }
  return result;
}

const hashToPath = new Map();
const localizationReportPath = path.join(root, "maintenance/creatium-localization-report.json");
if (await exists(localizationReportPath)) {
  const localized = JSON.parse(await readFile(localizationReportPath, "utf8"));
  for (const item of localized.assets || []) {
    if (item.sha256 && item.localPath) hashToPath.set(item.sha256, item.localPath);
  }
}
for (const existing of await walkImages(path.join(root, "assets/images"))) {
  const bytes = await readFile(existing);
  const hash = createHash("sha256").update(bytes).digest("hex");
  if (!hashToPath.has(hash)) hashToPath.set(hash, path.relative(root, existing).split(path.sep).join("/"));
}

await mkdir(destinationRoot, { recursive: true });
const cardFolders = (await readdir(cardsRoot, { withFileTypes: true }))
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name)
  .sort();

if (!cardFolders.length) throw new Error("No extracted gallery card folders were found.");

const cards = [];
let uniqueBytesAdded = 0;
let duplicateCount = 0;
for (const folder of cardFolders) {
  const dir = path.join(cardsRoot, folder);
  const infoPath = path.join(dir, "card-info.json");
  if (!await exists(infoPath)) continue;
  const info = JSON.parse(await readFile(infoPath, "utf8"));

  async function localize(filename) {
    if (!filename) return null;
    const sourcePath = path.join(dir, filename);
    if (!await exists(sourcePath)) return null;
    const bytes = await readFile(sourcePath);
    const sha256 = createHash("sha256").update(bytes).digest("hex");
    let localPath = hashToPath.get(sha256);
    if (localPath) {
      duplicateCount++;
    } else {
      const ext = path.extname(filename).toLowerCase() || ".jpg";
      localPath = "assets/images/portfolio/galleries/" + sha256 + ext;
      const target = path.join(root, localPath);
      await mkdir(path.dirname(target), { recursive: true });
      await copyFile(sourcePath, target);
      hashToPath.set(sha256, localPath);
      uniqueBytesAdded += bytes.length;
    }
    return { path: localPath, sha256, bytes: bytes.length };
  }

  const main = await localize(info.mainImageFile);
  const gallery = [];
  for (const item of info.gallery || []) {
    if (!item.file) continue;
    const local = await localize(path.join("gallery", item.file));
    if (local) gallery.push({ order: item.order, ...local });
  }

  cards.push({
    cardIndex: info.cardIndex,
    folder,
    description: info.description || "",
    cardText: info.cardText || "",
    status: info.status || "unknown",
    mainImage: main,
    gallery,
    galleryCountDetected: info.galleryCountDetected || gallery.length,
    galleryCountSaved: gallery.length
  });
}

const previousIndex = await exists(indexPath) ? JSON.parse(await readFile(indexPath, "utf8")) : { cards: [] };
const mergedCards = new Map((previousIndex.cards || []).map(card => [card.cardIndex, card]));
for (const card of cards) mergedCards.set(card.cardIndex, card);
const allCards = [...mergedCards.values()].sort((a, b) => a.cardIndex - b.cardIndex);

const index = {
  generatedAt: new Date().toISOString(),
  source: "https://baribal-studio.ru/foto",
  cardCount: allCards.length,
  cardsWithMainImage: allCards.filter(card => card.mainImage).length,
  additionalGalleryImages: allCards.reduce((sum, card) => sum + card.galleryCountSaved, 0),
  uniqueBytesAdded,
  duplicateReferencesReused: duplicateCount,
  cards: allCards
};
await writeFile(indexPath, JSON.stringify(index, null, 2) + "\n", "utf8");
console.log(JSON.stringify({
  cardsProcessed: cards.length,
  cardsInIndex: index.cardCount,
  cardsWithMainImage: index.cardsWithMainImage,
  additionalGalleryImages: index.additionalGalleryImages,
  uniqueBytesAdded,
  duplicateReferencesReused: duplicateCount,
  index: "maintenance/creatium-gallery-index.json"
}, null, 2));
