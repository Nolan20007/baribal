import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const manifest=JSON.parse(await readFile("maintenance/verified-gallery-batch.json","utf8"));
const root="output/verified-gallery-candidates";
await mkdir(root,{recursive:true});
const report={range:manifest.range,cards:[],rejected:[]};
for(const card of manifest.cards){
  const dir=path.join(root,String(card.cardIndex).padStart(3,"0"));
  await mkdir(dir,{recursive:true});
  const seen=new Set(), items=[];
  for(let i=0;i<card.galleryUrls.length;i++){
    const url=card.galleryUrls[i];
    if(seen.has(url)){report.rejected.push({cardIndex:card.cardIndex,url,reason:"duplicate URL within card"});continue;}
    seen.add(url);
    const res=await fetch(url,{signal:AbortSignal.timeout(30000)});
    if(!res.ok) throw new Error("HTTP "+res.status+" card "+card.cardIndex+" "+url);
    const bytes=Buffer.from(await res.arrayBuffer());
    const meta=await sharp(bytes).metadata();
    const hash=crypto.createHash("sha256").update(bytes).digest("hex");
    const ext=meta.format==="png"?"png":meta.format==="webp"?"webp":"jpg";
    const file=String(i+1).padStart(2,"0")+"."+ext;
    const reason=(!["jpeg","png","webp"].includes(meta.format)?"unsupported format":
      (meta.width<500||meta.height<300?"below 500x300":
      (bytes.length<100000?"below 100 KB":"")));
    if(reason){report.rejected.push({cardIndex:card.cardIndex,url,bytes:bytes.length,width:meta.width,height:meta.height,reason});continue;}
    await writeFile(path.join(dir,file),bytes);
    items.push({order:i+1,file,url,bytes:bytes.length,width:meta.width,height:meta.height,sha256:hash});
    console.log("DOWNLOADED",card.cardIndex,file,meta.width+"x"+meta.height,bytes.length);
  }
  report.cards.push({cardIndex:card.cardIndex,description:card.description,images:items});
}
await writeFile(path.join(root,"report.json"),JSON.stringify(report,null,2)+"\n");
console.log("DOWNLOAD_BATCH_OK",JSON.stringify({cards:report.cards.length,files:report.cards.reduce((n,c)=>n+c.images.length,0),rejected:report.rejected.length}));
