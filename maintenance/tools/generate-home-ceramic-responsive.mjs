import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const source = path.resolve("assets/images/pages/home/services/ceramic-responsive/keramika-na-avto-1.jpg");
const outputDir = path.resolve("assets/images/pages/home/services/ceramic-responsive");
const widths = [400, 900, 1600];
const quality = 82;

const metadata = await sharp(source, { failOn: "error" }).metadata();
if (!metadata.width || !metadata.height) throw new Error("Source image dimensions are missing");
await fs.mkdir(outputDir, { recursive: true });

const report = { source: "keramika-na-avto-1.jpg", sourceWidth: metadata.width, sourceHeight: metadata.height, quality, variants: [] };
for (const requestedWidth of widths) {
  const width = Math.min(requestedWidth, metadata.width);
  const output = path.join(outputDir, `ceramic-coating-${width}.webp`);
  const result = await sharp(source, { failOn: "error" }).rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 5, smartSubsample: true })
    .toFile(output);
  if (!result.size || !result.width || !result.height) throw new Error(`Invalid output: ${output}`);
  report.variants.push({ file: path.relative(process.cwd(), output).split(path.sep).join("/"), width: result.width, height: result.height, bytes: result.size });
}
const reportPath = path.resolve("maintenance/reports/home-ceramic-responsive.json");
await fs.mkdir(path.dirname(reportPath), { recursive: true });
await fs.writeFile(reportPath, JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
