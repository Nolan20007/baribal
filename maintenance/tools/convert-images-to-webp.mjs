import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve("assets/images");
const outputReport = path.resolve("maintenance/reports/webp-conversion-report.json");
const quality = 80;
const allowedExtensions = new Set([".jpg", ".jpeg", ".png"]);
const excludedDirectories = new Set([
  "brand", "partners", "interface", "icons", "icon", "logos", "logo",
  "ui", "sprites", "badges"
]);
const excludedFilename = /(logo|logotype|favicon|icon|sprite|badge|widget|qr[-_]?code)/i;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const result = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!excludedDirectories.has(entry.name.toLowerCase())) {
        result.push(...await walk(full));
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (allowedExtensions.has(ext) && !excludedFilename.test(entry.name)) result.push(full);
    }
  }
  return result;
}

const sources = (await walk(root)).sort();
const report = {
  quality,
  sourceRoot: "assets/images",
  excludedDirectories: [...excludedDirectories],
  scanned: sources.length,
  converted: 0,
  skippedExisting: 0,
  failed: [],
  originalBytes: 0,
  webpBytes: 0,
  files: []
};

for (const source of sources) {
  const destination = source.slice(0, -path.extname(source).length) + ".webp";
  const relativeSource = path.relative(process.cwd(), source).split(path.sep).join("/");
  const relativeDestination = path.relative(process.cwd(), destination).split(path.sep).join("/");
  const sourceStat = await fs.stat(source);
  report.originalBytes += sourceStat.size;

  try {
    try {
      const existing = await fs.stat(destination);
      if (existing.size > 0) {
        report.skippedExisting++;
        report.webpBytes += existing.size;
        report.files.push({ source: relativeSource, output: relativeDestination, status: "already-exists", sourceBytes: sourceStat.size, webpBytes: existing.size });
        continue;
      }
    } catch {}

    const result = await sharp(source, { failOn: "error" })
      .rotate()
      .webp({ quality, effort: 5, smartSubsample: true })
      .toFile(destination);

    if (!result.size || result.width < 1 || result.height < 1) {
      throw new Error("Invalid WebP output dimensions or size");
    }

    report.converted++;
    report.webpBytes += result.size;
    report.files.push({
      source: relativeSource,
      output: relativeDestination,
      status: "converted",
      sourceBytes: sourceStat.size,
      webpBytes: result.size,
      width: result.width,
      height: result.height
    });
  } catch (error) {
    report.failed.push({ source: relativeSource, error: String(error?.message || error) });
  }
}

await fs.mkdir(path.dirname(outputReport), { recursive: true });
await fs.writeFile(outputReport, JSON.stringify(report, null, 2) + "\n");
const savings = report.originalBytes ? (1 - report.webpBytes / report.originalBytes) * 100 : 0;
console.log(JSON.stringify({
  scanned: report.scanned,
  converted: report.converted,
  skippedExisting: report.skippedExisting,
  failed: report.failed.length,
  originalMB: +(report.originalBytes / 1024 / 1024).toFixed(2),
  webpMB: +(report.webpBytes / 1024 / 1024).toFixed(2),
  estimatedSavingsPercent: +savings.toFixed(1),
  report: "maintenance/reports/webp-conversion-report.json"
}, null, 2));

if (report.failed.length) process.exitCode = 1;
