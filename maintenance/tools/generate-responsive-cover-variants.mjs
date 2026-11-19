import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sourceDir = path.resolve("assets/images/pages/foto");
const outputDir = path.join(sourceDir, "responsive");
const reportPath = path.resolve("maintenance/reports/responsive-cover-variants.json");
const widths = [400, 900, 1600];
const quality = 82;
const limit = Math.max(0, Number.parseInt(process.env.RESPONSIVE_LIMIT ?? "5", 10) || 0);

const entries = (await fs.readdir(sourceDir, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && /\.(jpe?g|png)$/i.test(entry.name))
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

const sources = limit > 0 ? entries.slice(0, limit) : entries;
const report = {
  sourceDirectory: "assets/images/pages/foto",
  outputDirectory: "assets/images/pages/foto/responsive",
  requestedWidths: widths,
  quality,
  limit: limit || "all",
  sourceCount: sources.length,
  processed: 0,
  variantsCreated: 0,
  skippedExisting: 0,
  failures: [],
  files: []
};

await fs.mkdir(outputDir, { recursive: true });

for (const filename of sources) {
  const sourcePath = path.join(sourceDir, filename);
  const base = path.basename(filename, path.extname(filename));
  try {
    const metadata = await sharp(sourcePath, { failOn: "error" }).metadata();
    if (!metadata.width || !metadata.height) throw new Error("Missing source dimensions");

    const sourceRecord = {
      source: filename,
      sourceWidth: metadata.width,
      sourceHeight: metadata.height,
      variants: []
    };

    const actualWidths = [...new Set(widths.map((width) => Math.min(width, metadata.width)))];
    for (const width of actualWidths) {
      const outputName = `${base}-${width}.webp`;
      const outputPath = path.join(outputDir, outputName);
      try {
        const stat = await fs.stat(outputPath);
        if (stat.size > 0) {
          const existing = await sharp(outputPath).metadata();
          sourceRecord.variants.push({
            file: outputName, width: existing.width, height: existing.height,
            bytes: stat.size, status: "already-exists"
          });
          report.skippedExisting++;
          continue;
        }
      } catch {}

      const result = await sharp(sourcePath, { failOn: "error" })
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality, effort: 5, smartSubsample: true })
        .toFile(outputPath);

      if (!result.size || !result.width || !result.height || result.width > metadata.width) {
        throw new Error(`Invalid output: ${outputName}`);
      }
      sourceRecord.variants.push({
        file: outputName, width: result.width, height: result.height,
        bytes: result.size, status: "created"
      });
      report.variantsCreated++;
    }
    report.files.push(sourceRecord);
    report.processed++;
  } catch (error) {
    report.failures.push({ source: filename, error: String(error?.message || error) });
  }
}

await fs.mkdir(path.dirname(reportPath), { recursive: true });
await fs.writeFile(reportPath, JSON.stringify(report, null, 2) + "\n");

console.log(JSON.stringify({
  sourceCount: report.sourceCount,
  processed: report.processed,
  variantsCreated: report.variantsCreated,
  skippedExisting: report.skippedExisting,
  failures: report.failures,
  dimensions: report.files.map((item) => ({
    source: item.source,
    sourceWidth: item.sourceWidth,
    sourceHeight: item.sourceHeight,
    variants: item.variants.map((v) => ({ width: v.width, height: v.height, file: v.file }))
  }))
}, null, 2));

if (report.failures.length) process.exitCode = 1;
