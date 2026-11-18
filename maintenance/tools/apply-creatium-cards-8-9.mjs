import { readFile, writeFile } from "node:fs/promises";
const index = JSON.parse(await readFile("maintenance/creatium-gallery-index.json","utf8"));
const cards = [8,9].map(n=>index.cards.find(c=>c.cardIndex===n));
if (cards.some(c=>!c?.mainImage?.path || !c.gallery?.length)) throw new Error("Normalized cards 8/9 incomplete");
const modulePath="src/portfolio-galleries.js";
let source=await readFile(modulePath,"utf8");
const used=[...source.matchAll(/import image(\\d+) from/g)].map(m=>Number(m[1]));
let next=Math.max(...used)+1;
const newImports=[];
const refs={};
for (const card of cards) {
  const names=[];
  for (const item of card.gallery) {
    const name="image"+next++;
    newImports.push('import '+name+' from "../'+item.path+'";');
    names.push(name);
  }
  refs[card.cardIndex]=names;
}
source=source.replace(/export const portfolioGalleries = \[/,newImports.join("\n")+"\n\nexport const portfolioGalleries = [");
for (const card of cards) {
  const line=new RegExp("\\{ sourceCardIndex: "+card.cardIndex+", images: \\[[^\\]]*\\] \\}");
  const replacement="{ sourceCardIndex: "+card.cardIndex+", images: ["+refs[card.cardIndex].join(", ")+"] }";
  if (!line.test(source)) throw new Error("Cannot find gallery mapping for card "+card.cardIndex);
  source=source.replace(line,replacement);
}
await writeFile(modulePath,source);
const mainPath="src/main.js";
let main=await readFile(mainPath,"utf8");
const old8='d92cd7473a1cf5344c429921e20b4ae153959d2ab69275714f02c97d0f855a3f.jpg';
const old9='a3acaf24d28586f1d46f4d2967bd7f0280702a78b1fb1fd6e3b22efa74c9a606.jpg';
main=main.replace(old8,cards[0].mainImage.path.split("/").pop()).replace(old9,cards[1].mainImage.path.split("/").pop());
await writeFile(mainPath,main);
console.log("UPDATED_PORTFOLIO",JSON.stringify(cards.map(c=>({card:c.cardIndex,cover:c.mainImage.path,gallery:c.gallery.length}))));
