import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const base = "https://i.1.creatium.io/plp/u20.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/";
const cards = [
  { index: 8, slug: "008-booking-film", cover: "d8dda45fa03603508519b27f3032c7c6.jpg", images: [
    "926b9229f4de6a48ebeb90f7213e95e3.jpg","d8434ee76c6642d3821c2681a447744c.jpg","a04665e2b1f2119c6e4bf07f5680b2c6.jpg","4668986a5c3d9bfba8f80dcb6d8e5af4.jpg","445549bd73457b0023374f6a78bc6887.jpg","6206e30e7fe829cd1953a9c81f1710db.jpg","3054b1d2f38d48e54ac3fdf90bcce9b0.jpg","d8dda45fa03603508519b27f3032c7c6.jpg","80037c61151bfbb184848a34d35ad4d4.jpg"
  ]},
  { index: 9, slug: "009-protective-coating", cover: "743cdf4b21a5c6b6f449b390ceaa9a98.jpg", images: [
    "b1c840637ddb95d3e3d4addd951121aa.jpg","926ec0d2dda49374fa2f1c7bfc80489f.jpg","499cb05e66c0cb2b9b47f93cb7ce49af.jpg","31afe50b1fd7b0da477482e626dfc0bb.jpg","743cdf4b21a5c6b6f449b390ceaa9a98.jpg"
  ]}
];
const root = "output/creatium-download-test"; // isolated verification run
await mkdir(root, { recursive: true });
const results = [];
for (const card of cards) {
  const dir = path.join(root, card.slug);
  await mkdir(path.join(dir, "gallery"), { recursive: true });
  const urls = [...new Set([card.cover, ...card.images])];
  for (const name of urls) {
    const response = await fetch(base + name);
    if (!response.ok) throw new Error(`Card ${card.index} ${name}: HTTP ${response.status}`);
    const type = (response.headers.get("content-type") || "").split(";")[0].toLowerCase();
    const bytes = Buffer.from(await response.arrayBuffer());
    if (!type.startsWith("image/") || bytes.length < 1500) throw new Error(`Invalid image ${name}: ${type}, ${bytes.length} bytes`);
    const isCover = name === card.cover;
    const target = isCover ? path.join(dir, "main" + path.extname(name)) : path.join(dir, "gallery", String(card.images.indexOf(name)+1).padStart(2,"0") + path.extname(name));
    await writeFile(target, bytes);
    results.push({card:card.index,file:target,bytes:bytes.length,type,sha256:crypto.createHash("sha256").update(bytes).digest("hex")});
    console.log("DOWNLOADED", card.index, target, bytes.length, type);
  }
}
await writeFile(path.join(root,"download-report.json"), JSON.stringify({cards:2, galleryImages:14, files:results.length, results},null,2));
console.log("DOWNLOAD_TEST_OK", JSON.stringify({galleryImages:14, files:results.length, totalBytes:results.reduce((n,x)=>n+x.bytes,0)}));
