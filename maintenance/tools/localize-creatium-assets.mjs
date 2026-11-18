import { createHash } from "node:crypto";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const manifestPath = path.join(root, "maintenance/creatium-image-inventory.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const mainPath = path.join(root, "src/main.js");
const cssPath = path.join(root, "src/styles.css");
const reportPath = path.join(root, "maintenance/creatium-localization-report.json");
let previousReport = { assets: [] };
try { previousReport = JSON.parse(await readFile(reportPath, "utf8")); } catch {}
const previousByUrl = new Map((previousReport.assets || []).map(item => [item.sourceUrl, item]));

function categoryFor(asset, mainLines) {
  const location = asset.locations?.[0];
  if (!location) return "misc";
  if (location.file.endsWith(".css")) return "interface";
  const line = location.line || 0;
  const sourceLine = mainLines[line - 1] || "";
  if (line <= 3) return "brand";
  if (line <= 8) return "portfolio";
  if (line <= 160) return "portfolio";
  if (line >= 181 && line <= 190) {
    const urlIndex = sourceLine.indexOf(asset.url);
    const prefix = sourceLine.slice(0, Math.max(0, urlIndex));
    if (prefix.lastIndexOf("studio-photo") > prefix.lastIndexOf("partner-logo")) return "studio";
    if (prefix.lastIndexOf("partner-logo") >= 0) return "partners";
  }
  if (line >= 200) return "services";
  return "misc";
}

function imageExtension(contentType, body) {
  const bytes = Buffer.from(body);
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return "png";
  if (bytes.subarray(0, 6).toString("ascii").startsWith("GIF8")) return "gif";
  if (bytes.length >= 12 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") return "webp";
  if (bytes.length >= 12 && bytes.toString("ascii", 4, 8) === "ftyp" && /avif|avis/.test(bytes.toString("ascii", 8, 16))) return "avif";
  const head = bytes.subarray(0, 512).toString("utf8").trimStart();
  if (/<svg\b|<\?xml[\s\S]*?<svg\b/i.test(head)) return "svg";
  const type = String(contentType || "").split(";")[0].trim().toLowerCase();
  const types = {
    "image/jpeg": "jpg", "image/jpg": "jpg", "image/png": "png",
    "image/svg+xml": "svg", "image/webp": "webp", "image/gif": "gif",
    "image/avif": "avif"
  };
  return types[type] || "";
}

async function fetchImage(url) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, {
        redirect: "follow",
        headers: { "User-Agent": "BARIBAL-asset-migration/1.0" },
        signal: AbortSignal.timeout(30000)
      });
      if (!response.ok) throw new Error("HTTP " + response.status);
      const body = Buffer.from(await response.arrayBuffer());
      if (body.length < 1000) throw new Error("Image response is unexpectedly small (" + body.length + " bytes)");
      const ext = imageExtension(response.headers.get("content-type"), body);
      if (!ext) throw new Error("Response is not a recognized image (" + (response.headers.get("content-type") || "unknown content type") + ")");
      return { body, ext, contentType: response.headers.get("content-type") || "unknown" };
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise(resolve => setTimeout(resolve, attempt * 1200));
    }
  }
  throw lastError;
}

async function mapLimit(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;
  async function run() {
    while (true) {
      const index = next++;
      if (index >= items.length) return;
      results[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

function replaceJsAssetUrls(source, mapping) {
  const urls = [...mapping.keys()].sort((a, b) => b.length - a.length);
  let output = "";
  let i = 0;
  let quote = null;
  while (i < source.length) {
    if (quote === null) {
      const char = source[i];
      if (char === '"' || char === "'" || char === "`") {
        const matched = urls.find(url => source.startsWith(url, i + 1) && source[i + 1 + url.length] === char);
        if (matched && char !== "`") {
          const local = mapping.get(matched);
          output += 'new URL("../' + local + '", import.meta.url).href';
          i += matched.length + 2;
          continue;
        }
        quote = char;
        output += char;
        i++;
        continue;
      }
      output += char;
      i++;
      continue;
    }
    if (quote === "`") {
      const matched = urls.find(url => source.startsWith(url, i));
      if (matched) {
        const local = mapping.get(matched);
        output += '${new URL("../' + local + '", import.meta.url).href}';
        i += matched.length;
        continue;
      }
    }
    const char = source[i];
    output += char;
    i++;
    if (char === quote && source[i - 2] !== "\\") quote = null;
  }
  return output;
}

const mainSource = await readFile(mainPath, "utf8");
const cssSource = await readFile(cssPath, "utf8");
const mainLines = mainSource.split("\n");
const assets = manifest.assets || [];
if (!assets.length) throw new Error("The Creatium asset inventory is empty.");

const hashToPath = new Map();
const urlToLocalPath = new Map();
const results = await mapLimit(assets, 4, async asset => {
  const category = categoryFor(asset, mainLines);
  const { body, ext, contentType } = await fetchImage(asset.url);
  const sha256 = createHash("sha256").update(body).digest("hex");
  let localPath = hashToPath.get(sha256);
  const duplicate = Boolean(localPath);
  const previous = previousByUrl.get(asset.url);
  if (!localPath && previous?.sha256 === sha256) localPath = previous.localPath;
  if (!localPath) localPath = "assets/images/" + category + "/" + sha256 + "." + ext;
  const absolutePath = path.join(root, localPath);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  try {
    await access(absolutePath);
  } catch {
    await writeFile(absolutePath, body, { flag: "wx" }).catch(error => {
      if (error.code !== "EEXIST") throw error;
    });
  }
  hashToPath.set(sha256, localPath);
  urlToLocalPath.set(asset.url, localPath);
  return {
    sourceUrl: asset.url,
    localPath,
    sha256,
    bytes: body.length,
    contentType,
    duplicateContent: duplicate,
    occurrences: asset.occurrences,
    locations: asset.locations
  };
});

const failedCount = results.filter(item => !item.localPath).length;
if (failedCount) throw new Error("Some source images were not localized.");

const updatedMain = replaceJsAssetUrls(mainSource, urlToLocalPath);
let updatedCss = cssSource;
for (const [url, localPath] of urlToLocalPath) {
  updatedCss = updatedCss.split(url).join("../" + localPath);
}
if (/https?:\/\/[^"'\x60\s)]+creatium/i.test(updatedMain + "\n" + updatedCss)) {
  throw new Error("Creatium image URLs remain in src/main.js or src/styles.css after replacement.");
}

await writeFile(mainPath, updatedMain, "utf8");
await writeFile(cssPath, updatedCss, "utf8");
const report = {
  generatedAt: new Date().toISOString(),
  sourceInventory: "maintenance/creatium-image-inventory.json",
  uniqueSourceUrls: assets.length,
  totalSourceReferences: assets.reduce((sum, item) => sum + (item.occurrences || 1), 0),
  downloadedFiles: hashToPath.size,
  duplicateFilesAvoided: assets.length - hashToPath.size,
  totalBytes: results.reduce((sum, item) => sum + item.bytes, 0),
  assets: results
};
await writeFile(reportPath, JSON.stringify(report, null, 2) + "\n", "utf8");
console.log(JSON.stringify({
  sourceUrls: assets.length,
  downloadedFiles: hashToPath.size,
  duplicateFilesAvoided: assets.length - hashToPath.size,
  totalBytes: report.totalBytes,
  remainingCreatiumReferences: 0
}, null, 2));
