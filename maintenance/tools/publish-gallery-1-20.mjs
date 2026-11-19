import { readFile, mkdir, writeFile, copyFile } from "node:fs/promises";
import crypto from "node:crypto";
import path from "node:path";

const root = "output/gallery";
const summary = JSON.parse(await readFile(path.join(root, "summary.json"), "utf8"));
if (summary.range?.[0] !== 1 || summary.range?.[1] !== 20 || summary.cards?.length !== 20) {
  throw new Error("Gallery summary range/card count mismatch");
}
const destination = "assets/images/portfolio/galleries";
await mkdir(destination, { recursive: true });
const galleryMap = {};
let copied = 0;
for (const card of summary.cards) {
  if (card.cardIndex < 1 || card.cardIndex > 20) throw new Error("Unexpected card index");
  const paths = [];
  for (const photo of card.accepted) {
    const bytes = await readFile(path.join(root, photo.name));
    const digest = crypto.createHash("sha256").update(bytes).digest("hex");
    if (digest !== photo.sha256) throw new Error("SHA-256 mismatch: " + photo.name);
    const ext = path.extname(photo.name).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) throw new Error("Unexpected image extension");
    const filename = digest + (ext === ".jpeg" ? ".jpg" : ext);
    const target = path.join(destination, filename);
    try { await readFile(target); }
    catch { await copyFile(path.join(root, photo.name), target); copied++; }
    paths.push("../" + target);
  }
  galleryMap[String(card.cardIndex)] = paths;
}
if (Object.keys(galleryMap).length !== 20) throw new Error("Expected 20 gallery entries");
await mkdir("plain-site/data", { recursive: true });
await writeFile("plain-site/data/work-galleries-1-20.json", JSON.stringify(galleryMap, null, 2) + "\n");
console.log("VERIFIED_GALLERIES_READY", JSON.stringify({
  cards: Object.keys(galleryMap).length,
  photos: Object.values(galleryMap).reduce((n, a) => n + a.length, 0),
  copied,
  byCard: Object.entries(galleryMap).map(([card, photos]) => [card, photos.length])
}));
