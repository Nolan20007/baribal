import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const base = "https://i.1.creatium.io/plp/u20.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/";
const cards = [
  { cardIndex:8, folder:"008-бронирование-пленкои-сделали-бронирование-переднеи-части-кузова-п", description:"Бронирование пленкой Сделали бронирование передней части кузова пленкой HEXIS", cover:"d8dda45fa03603508519b27f3032c7c6.jpg", images:["926b9229f4de6a48ebeb90f7213e95e3.jpg","d8434ee76c6642d3821c2681a447744c.jpg","a04665e2b1f2119c6e4bf07f5680b2c6.jpg","4668986a5c3d9bfba8f80dcb6d8e5af4.jpg","445549bd73457b0023374f6a78bc6887.jpg","6206e30e7fe829cd1953a9c81f1710db.jpg","3054b1d2f38d48e54ac3fdf90bcce9b0.jpg","d8dda45fa03603508519b27f3032c7c6.jpg","80037c61151bfbb184848a34d35ad4d4.jpg"] },
  { cardIndex:9, folder:"009-защитное-покрытие-нанесли-защитное-покрытие-для-кузова-эдванс", description:"Защитное покрытие Нанесли защитное покрытие для кузова Эдванс", cover:"743cdf4b21a5c6b6f449b390ceaa9a98.jpg", images:["b1c840637ddb95d3e3d4addd951121aa.jpg","926ec0d2dda49374fa2f1c7bfc80489f.jpg","499cb05e66c0cb2b9b47f93cb7ce49af.jpg","31afe50b1fd7b0da477482e626dfc0bb.jpg","743cdf4b21a5c6b6f449b390ceaa9a98.jpg"] }
];
const root = "output/creatium-images/cards";
for (const card of cards) {
  const dir = path.join(root, card.folder);
  await mkdir(path.join(dir,"gallery"), {recursive:true});
  const unique = [...new Set([card.cover,...card.images])];
  const local = new Map();
  for (const name of unique) {
    const response = await fetch(base+name);
    if (!response.ok) throw new Error("HTTP "+response.status+" for "+name);
    const bytes = Buffer.from(await response.arrayBuffer());
    if ((response.headers.get("content-type")||"").toLowerCase().split(";")[0] !== "image/jpeg" || bytes.length < 100000) throw new Error("Invalid original "+name);
    local.set(name,bytes);
  }
  const coverBytes = local.get(card.cover);
  await writeFile(path.join(dir,"main.jpg"),coverBytes);
  const gallery = [];
  for (let i=0;i<card.images.length;i++) {
    const name=card.images[i], file=String(i+1).padStart(2,"0")+".jpg";
    await writeFile(path.join(dir,"gallery",file),local.get(name));
    gallery.push({order:i+1,file});
  }
  await writeFile(path.join(dir,"card-info.json"),JSON.stringify({
    cardIndex:card.cardIndex,description:card.description,cardText:card.description+" Все фото",
    status:"captured-by-direct-original-links",mainImageFile:"main.jpg",galleryCountDetected:gallery.length,gallery
  },null,2)+"\n");
  console.log("CARD_READY",card.cardIndex,"gallery",gallery.length);
}

// Trigger the isolated two-card publishing workflow.
