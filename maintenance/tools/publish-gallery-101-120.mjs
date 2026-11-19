import { readFile, mkdir, writeFile } from "node:fs/promises";
import crypto from "node:crypto";
import sharp from "sharp";
import path from "node:path";

const config = JSON.parse(await readFile("maintenance/publish-gallery-batch-101-120.json", "utf8"));
const report = JSON.parse(await readFile("output/creatium-originals-diagnostic/report.json", "utf8"));
if (report.requestedRange?.start !== config.startCard || report.requestedRange?.end !== config.endCard) throw new Error("Diagnostic artifact range mismatch");
if (report.cardCount !== 20 || report.cards?.length !== 20 || report.failures?.length) throw new Error("Diagnostic report incomplete or failed");
const html = await readFile("plain-site/foto/index.html", "utf8");
const cardHtml = []; let cursor=0;
while (true) { const start=html.indexOf('<article class="work-card"',cursor); if(start<0)break; const body=html.indexOf(">",start)+1; const end=html.indexOf("</article>",body); if(body===0||end<0)throw new Error("Malformed work card"); cardHtml.push(html.slice(body,end)); cursor=end+10; }
if(cardHtml.length!==154) throw new Error("Expected 154 cards, found "+cardHtml.length);
const hash=b=>crypto.createHash("sha256").update(b).digest("hex");
const dest="assets/images/portfolio/galleries", dataDir="plain-site/data";
await mkdir(dest,{recursive:true}); await mkdir(dataDir,{recursive:true});
const galleries={}, globalHashes=new Map(); let downloaded=0,reused=0,skipped=0,coverDuplicates=0;
for(const card of report.cards){
  if(card.status!=="captured-by-clicking-thumbnails")throw new Error("Unverified card "+card.cardIndex);
  const block=cardHtml[card.cardIndex-1], imgAt=block?.indexOf("<img"), srcAt=imgAt>=0?block.indexOf('src="',imgAt):-1, srcEnd=srcAt>=0?block.indexOf('"',srcAt+5):-1;
  if(srcAt<0||srcEnd<0)throw new Error("Missing cover source for card "+card.cardIndex);
  const coverPath=path.resolve("plain-site/foto",block.slice(srcAt+5,srcEnd));
  const coverHash=hash(await readFile(coverPath));
  const paths=[],seenUrls=new Set(),seenCardHashes=new Set();
  for(const item of card.galleryOriginals||[]){
    if(seenUrls.has(item.url))continue; seenUrls.add(item.url);
    if(!item.url.startsWith("https://i.1.creatium.io/")&&!item.url.startsWith("https://img1.creatium.ru/"))throw new Error("Unexpected image host "+item.url);
    const res=await fetch(item.url,{signal:AbortSignal.timeout(30000)});
    if(!res.ok)throw new Error("HTTP "+res.status+" card "+card.cardIndex);
    const bytes=Buffer.from(await res.arrayBuffer()),meta=await sharp(bytes).metadata();
    if(!["jpeg","png","webp"].includes(meta.format)||meta.width<500||meta.height<300||bytes.length<100000){console.log("SKIP_LOW_QUALITY",card.cardIndex,meta,bytes.length);skipped++;continue;}
    const digest=hash(bytes);
    if(digest===coverHash){console.log("SKIP_COVER_DUPLICATE",card.cardIndex,item.url);coverDuplicates++;continue;}
    if(seenCardHashes.has(digest)){console.log("SKIP_CARD_DUPLICATE",card.cardIndex);continue;} seenCardHashes.add(digest);
    let rel=globalHashes.get(digest);
    if(rel)reused++; else {const ext=meta.format==="png"?".png":meta.format==="webp"?".webp":".jpg";rel=dest+"/"+digest+ext;await writeFile(rel,bytes);globalHashes.set(digest,rel);downloaded++;}
    paths.push("../"+rel);
  }
  galleries[String(card.cardIndex)]=paths;
}
const jsonPath=dataDir+"/work-galleries-101-120.json";
await writeFile(jsonPath,JSON.stringify(galleries,null,2)+"\n");
const total=Object.values(galleries).reduce((n,x)=>n+x.length,0);
console.log("GALLERIES_READY",JSON.stringify({cards:Object.keys(galleries).length,photos:total,downloaded,reused,skipped,coverDuplicates,perCard:Object.entries(galleries).map(([k,v])=>[k,v.length])}));
if(Object.keys(galleries).length!==20||total===0)throw new Error("Gallery output incomplete");
