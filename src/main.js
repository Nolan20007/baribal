import "./styles.css";
try { const savedTheme = localStorage.getItem("baribal-theme"); if (savedTheme === "light" || savedTheme === "dark") document.documentElement.dataset.theme = savedTheme; } catch {}
const logo = "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/f055b8b248f6e844ebf90239d4536b94.png";
const work = [
  { image: "https://img1.creatium.ru/disk2/d8/42/1a/7a83075790fe329feddf15ee2582b4adb2/1.jpg", type: "Оклейка", title: "Оклейка LAND CRUISER в матовый полиуретан", text: "Отличная защита кузова и выразительный матовый дизайн." },
  { image: "https://i.1.creatium.io/plp/u21.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/a9956d63b09e5fbef3f76be971ecb4c5.jpg", type: "Бронирование", title: "Защита BMW 8", text: "Бронирование передней части автомобиля и лобового стекла." },
  { image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/c2d8bf6b6f8e8cdd6e21617c92f6d618.jpg", type: "Бронирование", title: "Защита Lexus", text: "Оклейка передней части кузова защитной полиуретановой плёнкой." }
];
const portfolio = [
  { image: "https://img1.creatium.ru/bf/2a/19/74285428ae252f0b4501cbea631e585284/1.png", type: "Бронирование", title: "Porsche — защита передней части", text: "Бронирование всей передней части автомобиля Porsche антигравийной плёнкой." },
  { image: "https://i.1.creatium.io/plp/u20.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/467ae06547d65bf51338a8b2e5fbd71d.jpg", type: "Бронирование", title: "Kia Sorento — защита кузова", text: "Бронирование кузова автомобиля Kia Sorento." },
  { image: "https://i.1.creatium.io/plp/u20.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/85217f2d2a6845fe27e15fd62c9206eb.jpg", type: "Бронирование", title: "Mercedes GLS 400d — защита кузова", text: "Бронирование кузова автомобиля Mercedes GLS 400d." },
  { image: "https://i.1.creatium.io/plp/u20.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/dabf547cf6e4e32efa87794a144a793a.jpg", type: "Бронирование", title: "Toyota Prado — защита кузова", text: "Бронирование кузова автомобиля Toyota Prado." },
  { image: "https://i.1.creatium.io/plp/u20.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/6840a8eecb4636bece9fbf09584163f1.jpg", type: "Стайлинг плёнкой", title: "Toyota RAV-4 — чёрная крыша HEXIS", text: "Стайлинг крыши чёрной плёнкой HEXIS для Toyota RAV-4." },
  { image: "https://i.1.creatium.io/plp/u20.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/f51495a97ca9a4e66158ab61688e3e54.jpg", type: "Защитное покрытие", title: "Tesla — покрытие AdVance", text: "Нанесение защитного покрытия для кузова AdVance на автомобиль Tesla." },
  { image: "https://i.1.creatium.io/plp/u20.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/ebe468efd593a38848c0988c3d2cf44c.jpg", type: "Защитное покрытие", title: "AdVance — защита кузова", text: "Нанесение защитного покрытия для кузова по технологии AdVance." },
  { image: "https://i.1.creatium.io/plp/u20.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/d8dda45fa03603508519b27f3032c7c6.jpg", type: "Бронирование плёнкой", title: "Бронирование передней части HEXIS", text: "Защита передней части кузова антигравийной плёнкой HEXIS." },
  { image: "https://i.1.creatium.io/plp/u20.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/743cdf4b21a5c6b6f449b390ceaa9a98.jpg", type: "Защитное покрытие", title: "AdVance — защитное покрытие кузова", text: "Нанесение защитного покрытия для кузова по технологии AdVance." },
  { image: "https://i.1.creatium.io/plp/u20.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/8c91fa2b6fb74932a6a4463df778e4db.jpg", type: "Защитное покрытие", title: "AdVance — защита автомобиля", text: "Нанесение защитного покрытия для кузова по технологии AdVance." },
  { image: "https://i.1.creatium.io/plp/u20.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/0e5184c2d802a7a100feb91ce2abfff1.jpg", type: "Бронирование плёнкой", title: "Защита передней части HEXIS", text: "Бронирование передней части кузова плёнкой HEXIS." },
  { image: "https://i.1.creatium.io/plp/u20.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/c43db8de69deb66bf35f3f40be2ed93f.jpg", type: "Бронирование и защита", title: "HEXIS и ClearPlex — комплексная защита", text: "Бронирование передней части кузова плёнкой HEXIS и лобового стекла плёнкой ClearPlex." },
  { image: "https://i.1.creatium.io/plp/u20.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/54e17fb6c7ef3a8d832c962b017422c9.jpg", type: "Бронирование плёнкой", title: "Защита капота и крыльев", text: "Бронирование капота и крыльев автомобиля защитной плёнкой." },
  { image: "https://i.1.creatium.io/plp/u20.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/269f2a45aa3af6ba2d6dce3a97708424.jpg", type: "Бронирование и защита", title: "Бронирование капота и AdVance", text: "Бронирование капота плёнкой и нанесение защитного покрытия AdVance на кузов." },
  { image: "https://i.1.creatium.io/plp/u20.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/437541f7c4719e625bda5a164bf62945.jpg", type: "Бронирование плёнкой", title: "Полное бронирование HEXIS", text: "Бронирование кузова автомобиля плёнкой HEXIS." },
  { image: "https://i.1.creatium.io/plp/u20.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/7b6ed580923a10658f79d89a25b5cbd2.jpg", type: "Бронирование и защита", title: "Комплексная защита кузова и стёкол", text: "Защита капота, крыльев, фар, стоек, бамперов и передней части крыши; бронирование лобового стекла ClearPlex и покрытие кузова AdVance." },
  { image: "https://i.1.creatium.io/plp/u20.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/d3d3b30082bdcf5ad8fe6cc088c3b0f9.jpg", type: "Полный комплекс", title: "Toyota Camry — комплексная защита", text: "Бронирование капота плёнкой HEXIS, тонирование и защитное покрытие кузова AdVance." },
  { image: "https://i.1.creatium.io/plp/u20.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/4936c597274e5848db9fcb8145fe45fb.jpg", type: "Бронирование плёнкой", title: "Toyota RAV-4 — бронирование капота", text: "Бронирование капота плёнкой HEXIS на новом Toyota RAV-4." },
  { image: "https://i.1.creatium.io/plp/u20.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/6d0cf28054a7eb2100945ab72e9f8713.jpg", type: "Бронирование плёнкой", title: "Toyota Fortuner — защита капота и фар", text: "Бронирование капота и фар плёнкой HEXIS для Toyota Fortuner." },
  { image: "https://i.1.creatium.io/plp/u20.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/d44e2de30289b2c485b8acddd093e385.jpg", type: "Оклейка винилом", title: "Hyundai Santa Fe — рекламная оклейка", text: "Оклейка кузова виниловой плёнкой для рекламного оформления автомобиля Hyundai Santa Fe." },
  { image: "https://i.1.creatium.io/plp/u1.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/04afce45398da01fc7f7df45a26a77b8.jpg", type: "Бронирование и уход", title: "Toyota Camry — полировка и химчистка", text: "Полировка кузова и бережная химчистка салона Toyota Camry." },
  { image: "https://i.1.creatium.io/plp/u1.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/52391e2f066ecb0ddb48c6513426c2c0.jpg", type: "Бронирование и защита", title: "Hyundai Santa Fe — HEXIS и AdVance", text: "Бронирование капота плёнкой HEXIS и обработка кузова защитным покрытием AdVance." },
  { image: "https://i.1.creatium.io/plp/u1.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/29461bdf067af92fd645ec0d8f429732.jpg", type: "Бронирование и защита", title: "Комплекс HEXIS, ClearPlex и AdVance", text: "Бронирование капота и бампера плёнкой HEXIS, лобового стекла ClearPlex и защитное покрытие AdVance." },
  { image: "https://i.1.creatium.io/plp/u1.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/a2758dc9d8510f1ea47218cb06f652db.jpg", type: "Бронирование плёнкой", title: "BMW X7 — защита передней части", text: "Бронирование капота, бампера и фар плёнкой HEXIS." },
  { image: "https://i.1.creatium.io/plp/u1.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/7069eadb3d82a4725e6cdd50d4567417.jpg", type: "Бронирование плёнкой", title: "Mercedes SL — полная защита кузова", text: "Полное бронирование кузова, капота, зеркал, бампера и крыльев антигравийной плёнкой." },
  { image: "https://i.1.creatium.io/plp/u1.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/9c7d5e932d3544bdd15b7568e2e5018d.jpg", type: "Бронирование плёнкой", title: "Mercedes C450 — полная защита кузова", text: "Полное бронирование кузова, капота, зеркал, бампера и крыльев антигравийной плёнкой." },
  { image: "https://i.1.creatium.io/plp/u1.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/76ed393fa302bad1970cb0a789fdaa5f.jpg", type: "Бронирование плёнкой", title: "Mercedes C-Class — защита передней части", text: "Бронирование капота, бампера, передних крыльев и фар антигравийной плёнкой." },
  { image: "https://i.1.creatium.io/plp/u1.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/0d48cc9a7bf83b6120229b4891b2aae7.jpg", type: "Бронирование плёнкой", title: "Volkswagen Touareg — защита передней части", text: "Бронирование капота, бампера, передних крыльев и фар антигравийной плёнкой." },
  { image: "https://i.1.creatium.io/plp/u1.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/ad0c37ea213ecb062ef35d4e27a142bc.jpg", type: "Бронирование плёнкой", title: "Audi Q7 — защита передней части", text: "Бронирование капота, бампера, передних крыльев и фар плёнкой." },
  { image: "https://i.1.creatium.io/plp/u1.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/0c8eaf73f65a5818d561422b30272862.jpg", type: "Бронирование и AdVance", title: "Jeep Cherokee и Porsche Boxster — комплексная защита", text: "Бронирование капота, бампера и крыльев в сочетании с защитой кузова AdVance." },
  { image: "https://i.1.creatium.io/plp/u1.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/49e6ea0c7e4f85447a41d1a7867892de.jpg", type: "Детейлинг и AdVance", title: "Toyota Land Cruiser 200 — комплексный детейлинг", text: "Полный детейлинг, полировка кузова и дисков, нанесение защитного покрытия AdVance." },
  { image: "https://i.1.creatium.io/plp/u1.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/48c17908208bbb503add303b0563a8a4.jpg", type: "Бронирование и AdVance", title: "Mercedes C450 — защита кузова", text: "Бронирование отдельных элементов и защитное покрытие кузова по технологии AdVance." },
  { image: "https://i.1.creatium.io/plp/u1.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/9aea36833a4913d8b6f61dad1f101302.jpg", type: "Стайлинг винилом", title: "Volkswagen Polo — виниловый стайлинг", text: "Полный стайлинг кузова виниловой плёнкой." },
  { image: "https://i.1.creatium.io/plp/u1.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/7232dd017dd22e80c31b37a5c7c03d6b.jpg", type: "Бронирование плёнкой", title: "Volkswagen Touareg — защита капота и бампера", text: "Бронирование капота и бампера автомобиля." },
  { image: "https://i.1.creatium.io/plp/u1.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/c72ef3f7aa0f0dcdc08540ec4a25f68c.jpg", type: "Стайлинг винилом", title: "Toyota IQ — индивидуальный дизайн", text: "Разработка дизайна и стайлинг кузова виниловой плёнкой." },
  { image: "https://i.1.creatium.io/plp/u1.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/f48bc45abe31219e98a95ea7c6f5e712.jpg", type: "Защитное покрытие AdVance", title: "Mercedes G-Class — защита кузова", text: "Защита кузова по технологии AdVance." },
  { image: "https://i.1.creatium.io/plp/u1.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/64ae5e93ad68cadd0dfb37277679e28b.jpg", type: "Стайлинг винилом", title: "Такси Яндекс — оформление автопарка", text: "Стайлинг кузова виниловой плёнкой для автомобилей такси." },
  { image: "https://i.1.creatium.io/plp/u1.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/77c4576a0805a73ad0ffb1cc56f6af19.jpg", type: "Бронирование и AdVance", title: "Mercedes ML500 — комплексная защита", text: "Бронирование капота и бампера в сочетании с защитой кузова AdVance." },
  { image: "https://i.1.creatium.io/plp/u1.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/d07ac3d3b0041833d8337e1815830e71.jpg", type: "Бронирование плёнкой", title: "Mercedes GLS 500 — защита передней части", text: "Бронирование капота, крыльев и бампера." },
  { image: "https://i.1.creatium.io/plp/u1.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/ee632ea92877f6cc0c078c03a704b700.jpg", type: "Защитное покрытие AdVance", title: "Porsche Cayenne — защитное покрытие", text: "Защита кузова по технологии AdVance." },
  { image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/d9662f8bbb5e51010f2d3e964d9c184e.jpg", type: "Бронирование плёнкой", title: "Land Rover Discovery — защита кузова", text: "Бронирование капота, крыльев и передних дверей." },
  { image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/6b08ceda3bd32c48c12d04db86cee3a3.jpg", type: "Защитное покрытие AdVance", title: "Porsche Cayenne Turbo — AdVance", text: "Защита кузова по технологии AdVance." },
  { image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/30bd7e7bc274390942dffc1aec658d56.jpg", type: "Бронирование плёнкой", title: "Toyota Camry — защита передней части", text: "Бронирование капота, бампера и стоек." },
  { image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/ca8599bb03bcfe269f262f2080156461.jpg", type: "Бронирование плёнкой", title: "Lexus NX — защита кузова", text: "Бронирование капота, крыльев и бампера." },
  { image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/e8009f2131c81b988fc3b123f04d4797.jpg", type: "Защитное покрытие AdVance", title: "Audi Q7 — защита кузова", text: "Защита кузова по технологии AdVance." },
  { image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/6bdb39c8b7baf9828f59dca37b5b1d61.jpg", type: "Бронирование и AdVance", title: "Porsche Macan — комплексная защита", text: "Бронирование капота и защитное покрытие AdVance." },
  { image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/4f3a5b41e9f61356456e9e435b11afb6.jpg", type: "Бронирование плёнкой", title: "Mercedes GLS — защита передней части", text: "Бронирование капота и бампера." },
  { image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/8bb21f4a0da4db874c7e611c55e2d572.jpg", type: "Защитное покрытие AdVance", title: "Volvo XC70 — защита кузова", text: "Защита кузова по технологии AdVance." },
  { image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/782db70e51f020993a061ed742fe6c55.jpg", type: "Бронирование плёнкой", title: "Mercedes C Coupe — полное бронирование", text: "Полное бронирование кузова антигравийной плёнкой." },
  { image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/f98931e55d941bc1c48e598fb91d3f0d.jpg", type: "Защитное покрытие AdVance", title: "Toyota RAV4 — защита кузова", text: "Защита кузова по технологии AdVance." },
  { image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/287c37f0e852494cc33facdd7b26cbc0.jpg", type: "Предпродажная подготовка", title: "Toyota Prado — комплексная подготовка", text: "Химчистка салона и двигателя, восстановление элементов пластика." },
  { image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/7ff6e80e18fd3a420ca7df3318bd5ec3.jpg", type: "Бронирование плёнкой", title: "Toyota RAV4 — защита передней части", text: "Бронирование капота, бампера и передних крыльев." },
  { image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/ad35e11d587c8670ef976b507cfe8459.jpg", type: "Защитное покрытие AdVance", title: "Toyota Camry — покрытие AdVance", text: "Защита кузова по технологии AdVance." },
  { image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/1561362c75f97cc1dcfe72f6a57528b5.jpg", type: "Бронирование плёнкой", title: "Audi A5 — полное бронирование", text: "Полное бронирование кузова автомобиля." },
  { image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/fdb11f33900bb35cbaf8ea240168a58b.jpg", type: "Бронирование и защита", title: "Mercedes GL — бронирование элементов", text: "Бронирование капота, бампера и крыльев." },
  { image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/42ba1e9075f9df940966c38ee71645a6.jpg", type: "Бронирование плёнкой", title: "Jeep — защита передней части", text: "Бронирование капота, бампера и крыльев." },
  { image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/cf150dc64b42e3951da00c9ff4e7fb6e.jpg", type: "Бронирование плёнкой", title: "Jeep — защита кузова", text: "Бронирование капота, бампера и крыльев." },
  { image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/58ceeb4741a0b1531b073e50938d21b2.jpg", type: "Бронирование и AdVance", title: "BMW X6 — комплексная защита", text: "Бронирование капота и защитное покрытие кузова AdVance." },
  { image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/b36cac3c5862459f5281da3849444fec.jpg", type: "Бронирование плёнкой", title: "Honda Accord — защита передней части", text: "Бронирование капота, бампера и крыльев." },
  { image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/82031b3ffe2183130159dd523661a4ef.jpg", type: "Защитное покрытие AdVance", title: "Mercedes GL — покрытие AdVance", text: "Защита кузова по технологии AdVance." }
];
const services = [
  { title: "AdVance", subtitle: "Защитное покрытие кузова", text: "Уникальный блеск и защита вашего автомобиля. Покрытие помогает сохранить безупречный внешний вид.", price: "от 15 000 ₽", image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/c2d8bf6b6f8e8cdd6e21617c92f6d618.jpg" },
  { title: "Бронирование плёнкой", subtitle: "Защита кузова от сколов", text: "Плёнки HEXIS и SunTek защищают лакокрасочное покрытие от щебня, дорожного мусора и насекомых.", price: "от 3 000 ₽", image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/49e6ea0c7e4f85447a41d1a7867892de.jpg" },
  { title: "BariGlass", subtitle: "Защита автомобильных стёкол", text: "Гидрофобная защита стёкол от грязи, дождя, пыли и снега.", price: "от 1 000 ₽", image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/4b5f58279e7a750381ae4ee669310e73.jpg" },
  { title: "BariTools", subtitle: "Защита салона автомобиля", text: "Защитное покрытие на основе оксида кремния для материалов интерьера.", price: "от 9 000 ₽", image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/ecf5c275ca7d90525ddb346743a18d2d.jpg" },
  { title: "Предпродажная подготовка", subtitle: "Подготовка автомобиля к продаже", text: "Комплексная подготовка, чтобы автомобиль выглядел ухоженно и производил правильное впечатление.", price: "от 7 000 ₽", image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/dec8114f9b6c7e5f9554f686986a9fa3.jpg" }
];
const videos = [1, 2, 3, 4];
const localVideo = new URL("../1.mp4", import.meta.url).href;
const videoPlayer = (poster, label) => `
  <div class="baribal-player">
    <video playsinline preload="metadata" aria-label="${label}">
      <source src="${localVideo}" type="video/mp4">Ваш браузер не поддерживает воспроизведение видео.
    </video>
    <div class="video-poster">
      <img src="${poster}" alt="${label}" loading="lazy">
      <button class="video-poster-play" type="button" data-player-start aria-label="Воспроизвести видео"><span></span></button>
      <span class="video-poster-caption">BARIBAL <i>·</i> VIDEO</span>
    </div>
    <div class="baribal-controls" data-player-controls hidden>
      <button class="player-play" type="button" data-player-play aria-label="Воспроизвести или приостановить">▶</button>
      <span class="player-time" data-player-time>0:00 / 0:00</span>
      <input class="player-progress" data-player-progress type="range" min="0" max="100" step="0.1" value="0" aria-label="Позиция видео">
      <button class="player-mute" type="button" data-player-mute aria-label="Выключить звук">♪</button>
      <button class="player-fullscreen" type="button" data-player-fullscreen aria-label="Полноэкранный режим">⛶</button>
    </div>
  </div>`;
const isVideoPage = location.pathname.replace(/\/$/, "") === "/video";
const nav = [
  ["Главная", "/"], ["Защита кузова", "/kuzov"], ["Автохимчистка", "/himchistka"], ["Автовинил", "/avtovinil"],
  ["Все технологии", "/tehnology"], ["Наши работы", "/foto"], ["Видео", "/video"], ["Отзывы", "/reviews"]
];
const header = () => `
  <div class="topline"><div class="wrap topline-inner"><span class="top-address">Пермь, ул. Героев Хасана, 105Э</span><div><a href="tel:+73422024142">+7 (342) 202-41-42</a><a href="tel:+79824814142">+7 (982) 481-41-42</a></div></div></div>
  <header class="header"><div class="wrap header-inner">
    <a class="brand" href="/"><img src="${logo}" alt="" /><span><b>BARIBAL</b><small>СТУДИЯ ЗАЩИТНЫХ ТЕХНОЛОГИЙ</small></span></a>
    <button class="menu-toggle" aria-label="Открыть меню" aria-expanded="false"><i></i><i></i><i></i></button>
    <nav class="nav">${nav.map(([label, href]) => `<a href="${href}" ${(isVideoPage && href === "/video") ? 'aria-current="page"' : ""}>${label}</a>`).join("")}</nav>
    <button class="device-preview-open" type="button" aria-haspopup="dialog" aria-controls="device-preview-modal">Тестовый блок</button>
    <button class="theme-toggle" type="button" data-theme-toggle aria-label="Переключить цветовую тему"><span class="theme-icon" aria-hidden="true">☀</span><span class="theme-label">Светлая</span></button>
    <button class="button button-small js-callback">Записаться</button>
  </div></header>`;
const footer = () => `
  <footer class="footer"><div class="wrap footer-grid">
    <a class="brand footer-brand" href="/"><img src="${logo}" alt="" /><span><b>BARIBAL</b><small>СТУДИЯ ЗАЩИТНЫХ ТЕХНОЛОГИЙ</small></span></a>
    <div><h4>Контакты</h4><a href="tel:+73422024142">+7 (342) 202-41-42</a><a href="tel:+79824814142">+7 (982) 481-41-42</a><a href="mailto:mihail051206@yandex.ru">mihail051206@yandex.ru</a></div>
    <div class="footer-address"><h4>Адрес студии</h4><p>Пермь, ул. Героев Хасана, 105Э</p><p>За ТЦ «Шоколад», в районе Велты</p><a class="footer-route-button" href="https://yandex.ru/maps/org/baribal/66190218088?si=t32uycp3bmd4me8yudj9meng48" target="_blank" rel="noopener noreferrer">Построить маршрут <span aria-hidden="true">↗</span></a></div>
    <div><h4>Навигация</h4><a href="/tehnology">Услуги</a><a href="/foto">Наши работы</a><a href="/reviews">Отзывы</a><a href="/video">Видео</a><a href="/politika-konfidencialnosti">Политика конфиденциальности</a></div>
  </div><div class="wrap footer-bottom"><span>© BARIBAL — студия защитных технологий</span><span>Пермь</span></div></footer>`;
const contactPreferences = () => `
  <fieldset class="contact-preferences">
    <legend>Как с вами связаться?</legend>
    <div class="contact-preference-list">
      <label><input type="checkbox" name="contact_method" value="phone" checked><span>По телефону</span></label>
      <label><input type="checkbox" name="contact_method" value="max"><span>MAX</span></label>
      <label><input type="checkbox" name="contact_method" value="telegram"><span>Telegram</span></label>
      <label><input type="checkbox" name="contact_method" value="whatsapp"><span>WhatsApp</span></label>
      <label><input type="checkbox" name="contact_method" value="viber"><span>Viber</span></label>
      <label><input type="checkbox" name="contact_method" value="other" data-contact-other-toggle><span>Другой способ</span></label>
    </div>
    <div class="contact-other-details" hidden>
      <label>Укажите e-mail, мессенджер или другой способ связи
        <input type="text" name="contact_other" placeholder="Например: name@mail.ru или Signal">
      </label>
    </div>
  </fieldset>`;
const callback = () => `
  <div class="modal" id="callback-modal" aria-hidden="true"><div class="modal-backdrop js-close"></div><section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button class="modal-close js-close" aria-label="Закрыть">×</button><span class="eyebrow">BARIBAL · ПЕРМЬ</span><h2 id="modal-title">Мы вам перезвоним</h2><p id="callback-context">Оставьте номер — обсудим задачу и подберём решение для вашего автомобиля.</p><form class="lead-form demo-form"><input type="hidden" name="service" id="callback-service" value=""><label>Ваше имя<input name="name" placeholder="Как к вам обращаться" /></label><label>Телефон<input name="phone" type="tel" placeholder="+7 (___) ___-__-__" required /></label>${contactPreferences()}<button class="button" type="submit">Заказать консультацию</button><output></output></form></section></div>`;
const demoWorkGalleries = [
  ["https://img1.creatium.ru/disk2/d8/42/1a/7a83075790fe329feddf15ee2582b4adb2/1.jpg","https://i.1.creatium.io/plp/u20.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/467ae06547d65bf51338a8b2e5fbd71d.jpg","https://i.1.creatium.io/plp/u20.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/85217f2d2a6845fe27e15fd62c9206eb.jpg","https://i.1.creatium.io/plp/u20.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/dabf547cf6e4e32efa87794a144a793a.jpg","https://i.1.creatium.io/plp/u20.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/6840a8eecb4636bece9fbf09584163f1.jpg"],
  ["https://i.1.creatium.io/plp/u21.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/a9956d63b09e5fbef3f76be971ecb4c5.jpg","https://i.1.creatium.io/plp/u20.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/f51495a97ca9a4e66158ab61688e3e54.jpg","https://i.1.creatium.io/plp/u20.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/ebe468efd593a38848c0988c3d2cf44c.jpg","https://i.1.creatium.io/plp/u20.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/d8dda45fa03603508519b27f3032c7c6.jpg","https://i.1.creatium.io/plp/u20.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/743cdf4b21a5c6b6f449b390ceaa9a98.jpg"],
  ["https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/c2d8bf6b6f8e8cdd6e21617c92f6d618.jpg","https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/ca8599bb03bcfe269f262f2080156461.jpg","https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/e8009f2131c81b988fc3b123f04d4797.jpg","https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/6bdb39c8b7baf9828f59dca37b5b1d61.jpg","https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/4f3a5b41e9f61356456e9e435b11afb6.jpg"]
];
const workGalleryModal = () => `<div class="work-gallery-modal" id="work-gallery-modal" aria-hidden="true"><button class="work-gallery-backdrop" type="button" data-gallery-close aria-label="Закрыть галерею"></button><section class="work-gallery-dialog" role="dialog" aria-modal="true" aria-label="Фотогалерея выполненной работы"><button class="work-gallery-close" type="button" data-gallery-close aria-label="Закрыть">×</button><span class="work-gallery-demo-label">ТЕСТОВАЯ ПОДБОРКА · ФОТО ЗАМЕНИМ</span><h2 class="work-gallery-title"></h2><div class="work-gallery-stage"><button class="work-gallery-arrow prev" type="button" data-gallery-prev aria-label="Предыдущее фото">‹</button><img class="work-gallery-image" alt="" /><button class="work-gallery-arrow next" type="button" data-gallery-next aria-label="Следующее фото">›</button></div><div class="work-gallery-footer"><span class="work-gallery-counter"></span><div class="work-gallery-dots"></div></div></section></div>`;
const workCards = (items = work) => items.map((item, index) => { const serviceTitle = serviceForWork(item); return `<article class="work-card"><div class="work-image"><img src="${item.image}" alt="${item.title}" loading="lazy" /></div><div class="work-copy"><span class="eyebrow">${item.type}</span><h3>${item.title}</h3><p>${item.text}</p><div class="work-actions"><button class="text-link js-service-info" type="button" data-service-title="${serviceTitle}">Подробнее <span>↗</span></button><a class="text-link js-callback" href="#callback" data-service-title="${serviceTitle}">Хочу так же <span>↗</span></a><button class="text-link js-open-work-gallery" type="button" data-gallery-index="${index}">Все фото <span>↗</span></button></div></div></article>`; }).join("");
const portfolioCategories = item => {
  const value = `${item.type} ${item.title} ${item.text}`.toLowerCase();
  const result = [];
  if (/clearplex|лобов(ое|ого|ому)|стекл/.test(value)) result.push("Защита стёкол");
  if (/химчист|детейлинг|полировк|предпродаж|салон/.test(value)) result.push("Детейлинг и уход");
  if (/винил|стайлинг|рекламн|изменение цвета/.test(value)) result.push("Оклейка и стайлинг");
  if (/бронир|защит|advance|кузов|пленк|плёнк|hexis|suntek/.test(value)) result.push("Защита кузова");
  return result.length ? [...new Set(result)] : ["Другое"];
};
const serviceForWork = item => {
  const value = `${item.type} ${item.title} ${item.text}`.toLowerCase();
  if (/clearplex|лобов(ое|ого|ому) стекл|защит(а|ы) ст[её]кол/.test(value)) return "Бронирование лобового стекла ClearPlex";
  if (/bariglass/.test(value)) return "BariGlass";
  if (/baritools/.test(value)) return "BariTools";
  if (/химчист|детейлинг|салон/.test(value)) return "Химчистка салона";
  if (/полировк/.test(value)) return "Ручная полировка";
  if (/винил|стайлинг|рекламн|изменение цвета/.test(value)) return "Автовинил";
  if (/advance|защитное покрытие/.test(value)) return "AdVance";
  return "Бронирование кузова плёнкой";
};
const portfolioCards = () => portfolio.map((item, index) => {
  const categories = portfolioCategories(item);
  const serviceTitle = serviceForWork(item);
  return `<article class="work-card portfolio-card${index >= 9 ? " is-extra" : ""}" data-categories="${categories.join("|")}"><div class="work-image"><img src="${item.image}" alt="${item.title}" loading="lazy" /></div><div class="work-copy"><span class="eyebrow">${item.type}</span><h3>${item.title}</h3><p>${item.text}</p><div class="work-actions"><button class="text-link js-service-info" type="button" data-service-title="${serviceTitle}">Подробнее <span>↗</span></button><a class="text-link js-callback" href="#callback" data-service-title="${serviceTitle}">Хочу так же <span>↗</span></a></div></div></article>`;
}).join("");
const serviceCards = () => services.map((item, i) => `<article class="service-card"><div class="service-image"><img src="${item.image}" alt="" loading="lazy" /></div><div class="service-copy"><span class="eyebrow">0${i + 1} / УСЛУГА</span><h3>${item.title}</h3><h4>${item.subtitle}</h4><p>${item.text}</p><div class="service-bottom"><b>${item.price}</b><button class="text-link js-callback">Узнать больше <span>↗</span></button></div></div></article>`).join("");
const estimateSection = (showSelectedSummary = false) => `<section class="estimate"><div class="wrap estimate-inner"><div class="estimate-intro"><span class="eyebrow">ИНДИВИДУАЛЬНЫЙ ПОДХОД</span><h2>Рассчитаем стоимость<br /><em>защиты вашего автомобиля</em></h2><p>Расскажите, что хотите защитить. Мы свяжемся с вами и сориентируем по стоимости.</p></div><div class="estimate-services"><span class="estimate-services-title">Выберите услуги</span><label class="estimate-service-option"><input type="checkbox" name="requestedServices" value="AdVance — защитное покрытие кузова" /><span>AdVance — защитное покрытие кузова</span></label><label class="estimate-service-option"><input type="checkbox" name="requestedServices" value="Бронирование автомобиля плёнкой" /><span>Бронирование автомобиля плёнкой</span></label><label class="estimate-service-option"><input type="checkbox" name="requestedServices" value="BariGlass — защита стёкол авто" /><span>BariGlass — защита стёкол авто</span></label><label class="estimate-service-option"><input type="checkbox" name="requestedServices" value="BariTools — обработка салона авто" /><span>BariTools — обработка салона авто</span></label><label class="estimate-service-option"><input type="checkbox" name="requestedServices" value="Химчистка салона автомобиля" /><span>Химчистка салона автомобиля</span></label><label class="estimate-service-option"><input type="checkbox" name="requestedServices" value="Удаление вмятин без покраски" /><span>Удаление вмятин без покраски</span></label><label class="estimate-service-option"><input type="checkbox" name="requestedServices" value="Шумо-вибро-теплоизоляция" /><span>Шумо-вибро-теплоизоляция</span></label><label class="estimate-service-option"><input type="checkbox" name="requestedServices" value="Тонирование стёкол" /><span>Тонирование стёкол</span></label><label class="estimate-service-option"><input type="checkbox" name="requestedServices" value="Предпродажная подготовка автомобиля" /><span>Предпродажная подготовка автомобиля</span></label><label class="estimate-service-option"><input type="checkbox" name="requestedServices" value="Ручная полировка" /><span>Ручная полировка</span></label><label class="estimate-service-option"><input type="checkbox" name="requestedServices" value="Автовинил — стайлинг плёнкой" /><span>Автовинил — стайлинг плёнкой</span></label><label class="estimate-service-option"><input type="checkbox" name="requestedServices" value="Ремонт пластика салона авто" /><span>Ремонт пластика салона авто</span></label><label class="estimate-service-option"><input type="checkbox" name="requestedServices" value="Ремонт сидений автомобиля" /><span>Ремонт сидений автомобиля</span></label><label class="estimate-service-option"><input type="checkbox" name="requestedServices" value="Перетяжка руля" /><span>Перетяжка руля</span></label><label class="estimate-service-option"><input type="checkbox" name="requestedServices" value="Бронирование лобового стекла ClearPlex" /><span>Бронирование лобового стекла ClearPlex</span></label><label class="estimate-service-option"><input type="checkbox" name="requestedServices" value="Полировка и защитная обработка фар" /><span>Полировка и защитная обработка фар</span></label><label class="estimate-service-option"><input type="checkbox" name="requestedServices" value="Профессиональная химчистка двигателя" /><span>Профессиональная химчистка двигателя</span></label></div><form class="estimate-form demo-form"><label>Ваш автомобиль<input name="car" placeholder="Марка и модель" /></label>${showSelectedSummary ? `<div class="estimate-selected"><div class="estimate-selected-heading"><span>Выбранные услуги</span><b data-selected-count>0</b></div><ul class="estimate-selected-list" data-selected-services><li class="estimate-selected-empty">Пока ничего не выбрано</li></ul><input type="hidden" name="selected_services" data-selected-value value=""></div>` : `<label>Что вас интересует<select name="service"><option>Защита кузова</option><option>Автохимчистка</option><option>Автовинил</option><option>Защита стёкол</option><option>Другое</option></select></label>`}<label>Телефон<input name="phone" type="tel" placeholder="+7 (___) ___-__-__" required /></label>${contactPreferences()}<button class="button" type="submit">Отправить на расчёт <span>↗</span></button><output></output></form></div></section>`;

const homePage = () => `
  <main>
    <section class="hero"><div class="hero-shade"></div><div class="hero-test-controls"><button class="hero-photo-toggle" type="button" aria-label="Показать новую фотографию" aria-pressed="false">Сменить фото</button><div class="hero-design-control"><button class="hero-design-toggle" type="button" aria-label="Переключить оформление сайта">Сменить дизайн</button><span class="hero-design-name" aria-live="polite">Основной</span></div></div><div class="wrap hero-content"><span class="eyebrow">BARIBAL · СТУДИЯ ЗАЩИТНЫХ ТЕХНОЛОГИЙ</span><h1>Современные технологии<br /><em>защиты автомобиля</em><br />в Перми</h1><p>Профессиональный уход, защита кузова и интерьера<br class="desktop-only" /> с гарантией от 12 до 72 месяцев</p><div class="hero-actions"><button class="button js-callback">Записаться на обслуживание <span>↗</span></button><a class="button button-outline" href="#works">Наши работы</a></div><div class="hero-index"><img src="${logo}" alt="BARIBAL" /><span>ЗАЩИТА · УХОД · СТИЛЬ</span></div></div></section>
    <section class="section works-section" id="works"><div class="wrap"><div class="section-heading"><div><span class="eyebrow">ПОРТФОЛИО</span><h2>Последние выполненные<br /><em>нами работы</em></h2></div><a class="text-link" href="#callback">Обсудить проект <span>↗</span></a></div><div class="work-grid">${workCards()}</div>${workGalleryModal()}<div class="center-action"><button class="button button-dark js-callback">Хочу такой же результат</button></div></div></section>
    ${estimateSection()}
    <section class="section services-section" id="services"><div class="wrap"><div class="section-heading"><div><span class="eyebrow">ЧТО МЫ ДЕЛАЕМ</span><h2>Услуги студии <em>BARIBAL</em></h2></div><p>Технологичные решения для сохранения внешнего вида и ценности вашего автомобиля.</p></div><div class="service-grid">${serviceCards()}</div></div></section>

    <section class="section studio-section" id="studio"><div class="wrap"><div class="section-heading"><div><span class="eyebrow">МЫ РАБОТАЕМ В ПЕРМИ</span><h2>Наша <em>студия</em></h2></div><p>Приезжайте познакомиться, обсудить задачу и выбрать подходящее решение для автомобиля.</p></div><div class="studio-gallery"><div class="studio-address-card"><span class="eyebrow">ЖДЁМ ВАС В ГОСТИ</span><h3>BARIBAL<br><em>STUDIO</em></h3><p>Пермь, ул. Героев Хасана, 105Э</p><span class="studio-address-note">За ТЦ «Шоколад», в районе Велты</span></div><figure class="studio-photo studio-photo-main"><img src="https://i.1.creatium.io/plp/u21.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/b0d8da0f788fb697ef85e2876f2e2d8a.jpg" alt="Здание студии BARIBAL" loading="lazy"><figcaption>Студия BARIBAL · Пермь</figcaption></figure><figure class="studio-photo studio-photo-full"><img src="https://i.1.creatium.io/plp/u21.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/7ab8d1717c459b9fcc44c1af91c91aa0.jpg" alt="Въезд в студию BARIBAL" loading="lazy"><figcaption>Въезд в студию</figcaption></figure><figure class="studio-photo studio-photo-full"><img src="https://i.1.creatium.io/plp/u21.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/da220dd7b47feb810724df41a5ca515e.jpg" alt="Фасад студии BARIBAL на улице Героев Хасана" loading="lazy"><figcaption>Фасад студии</figcaption></figure><div class="studio-map studio-map-card"><div class="studio-map-heading"><span class="eyebrow">КАК НАС НАЙТИ</span><h3>Мы на <em>карте</em></h3></div><div class="studio-map-frame"><iframe title="Расположение студии BARIBAL на Яндекс Картах" src="https://yandex.ru/map-widget/v1/?text=Пермь%2C%20ул.%20Героев%20Хасана%2C%20105%D0%AD&z=16" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div><div class="studio-map-address"><span class="eyebrow">ЖДЁМ ВАС В ГОСТИ</span><p><strong>Пермь, ул. Героев Хасана, 105Э</strong><br>за ТЦ «Шоколад», в районе Велты</p></div><a class="button button-small studio-map-link" href="https://yandex.ru/maps/?text=Пермь%2C%20ул.%20Героев%20Хасана%2C%20105%D0%AD" target="_blank" rel="noopener">Построить маршрут ↗</a></div></div></section>
    <section class="section partners-section" id="partners"><div class="wrap"><div class="section-heading"><div><span class="eyebrow">НАМ ДОВЕРЯЮТ</span><h2>Клиенты и <em>партнёры</em></h2></div></div><div class="partner-grid"><div class="partner-logo"><img src="https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/7a1ddbeb7c441bf94297bb7019a3a42e.jpg" alt="Логотип партнёра 1" loading="lazy"></div><div class="partner-logo"><img src="https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/3cb42adbe082d65c4765f1b6af1d38ec.jpg" alt="Логотип партнёра 2" loading="lazy"></div><div class="partner-logo"><img src="https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/55100add09475d0b079eef90c70b5b6b.jpg" alt="Логотип партнёра 3" loading="lazy"></div><div class="partner-logo"><img src="https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/bec077765443f6253661a0dd04c7e48a.jpg" alt="Логотип партнёра 4" loading="lazy"></div><div class="partner-logo"><img src="https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/16a3ac3b0d610d95cd054254f8dd82d6.jpg" alt="Логотип партнёра 5" loading="lazy"></div><div class="partner-logo"><img src="https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/f8c076634d6a4476bf1b1a09e1c9afd8.jpg" alt="Логотип партнёра 6" loading="lazy"></div><div class="partner-logo"><img src="https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/daadf6c993fa258204d2de1b3142b951.jpg" alt="Логотип партнёра 7" loading="lazy"></div><div class="partner-logo"><img src="https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/7181e175d5cff2eaad187d7f7f47a3c6.jpg" alt="Логотип партнёра 8" loading="lazy"></div><div class="partner-logo"><img src="https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/3d8df7015a244f7cecebe1bab38eddca.jpg" alt="Логотип партнёра 9" loading="lazy"></div><div class="partner-logo"><img src="https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/b55e74547638791bcbf6d727dd1dade4.jpg" alt="Логотип партнёра 10" loading="lazy"></div><div class="partner-logo"><img src="https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/4c36baefbeedbad198ccb5f84131fc18.jpg" alt="Логотип партнёра 11" loading="lazy"></div></div></div></section>
    <section class="video-teaser"><div class="wrap video-teaser-inner"><div><span class="eyebrow">ЗНАКОМСТВО СО СТУДИЕЙ</span><h2>Посмотрите,<br /><em>как мы работаем</em></h2><p>Процессы, технологии и результаты в видео.</p><a class="button" href="/video">Смотреть видео <span>↗</span></a></div><div class="video-preview">${videoPlayer(work[0].image, "BARIBAL — процесс работы")}</div></div></section>
    <section class="contact-strip"><div class="wrap contact-strip-inner"><div><span class="eyebrow">ЖДЁМ ВАС В СТУДИИ</span><h2>Ваш автомобиль<br /><em>в надёжных руках</em></h2></div><div><p>Пермь, ул. Героев Хасана, 105Э</p><a href="tel:+73422024142">+7 (342) 202-41-42</a></div><button class="button js-callback">Записаться <span>↗</span></button></div></section>
  </main>`;
const videoPage = () => `
  <main><section class="page-hero"><div class="wrap"><span class="eyebrow">BARIBAL · ВИДЕО</span><h1>Наши <em>видео</em></h1><p>Знакомьтесь с технологиями, процессами и результатами нашей работы.</p></div></section><section class="section video-section"><div class="wrap"><div class="video-grid">${videos.map((id, i) => `<article class="video-card"><div class="video-frame">${videoPlayer(portfolio[i].image, `BARIBAL — тестовое видео ${i + 1}`)}</div><div class="video-label"><span>0${i + 1}</span><h3>Видео ${i + 1}</h3></div></article>`).join("")}</div></div></section></main>`;

const basePath = "/baribal";
const contactWidgetImage = new URL("../3.png", import.meta.url).href;
const cleanPath = location.pathname.startsWith(basePath) ? location.pathname.slice(basePath.length) : location.pathname;
const path = cleanPath.replace(/\/$/, "") || "/";
const pageHero = (eyebrow, title, intro = "") => `<section class="page-hero"><div class="wrap"><span class="eyebrow">${eyebrow}</span><h1>${title}</h1>${intro ? `<p>${intro}</p>` : ""}</div></section>`;
const contentPage = (eyebrow, title, intro, body) => `<main>${pageHero(eyebrow,title,intro)}<section class="section"><div class="wrap">${body}</div></section></main>`;
const galleryPage = () => contentPage("ПОРТФОЛИО BARIBAL","Наши <em>работы</em>","Выберите интересующее направление — покажем проекты с подходящими видами работ.",`<div class="portfolio-filters" role="group" aria-label="Фильтр работ"><button class="portfolio-filter is-active" type="button" data-filter="Все работы" aria-pressed="true">Все работы</button><button class="portfolio-filter" type="button" data-filter="Защита кузова" aria-pressed="false">Защита кузова</button><button class="portfolio-filter" type="button" data-filter="Защита стёкол" aria-pressed="false">Защита стёкол</button><button class="portfolio-filter" type="button" data-filter="Оклейка и стайлинг" aria-pressed="false">Оклейка и стайлинг</button><button class="portfolio-filter" type="button" data-filter="Детейлинг и уход" aria-pressed="false">Детейлинг и уход</button></div><div class="work-grid" id="portfolio-grid">${portfolioCards()}</div><div class="center-action portfolio-more-wrap"><button class="button button-dark" id="portfolio-more" type="button" aria-expanded="false">Показать все работы</button></div><div class="center-action"><button class="button js-callback">Обсудить ваш автомобиль</button></div>`);
const allServices = [
  { title: "AdVance", subtitle: "Защитное покрытие кузова", text: "Защитное покрытие для выразительного блеска и сохранения внешнего вида автомобиля. Гарантия на покрытие — 3 года.", price: "от 15 000 ₽", image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/c2d8bf6b6f8e8cdd6e21617c92f6d618.jpg"},
  { title: "Бронирование кузова плёнкой", subtitle: "HEXIS и SunTek", text: "Защитная плёнка помогает уберечь лакокрасочное покрытие от мелкого щебня, дорожного мусора и насекомых.", price: "от 3 000 ₽", image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/49e6ea0c7e4f85447a41d1a7867892de.jpg"},
  { title: "BariGlass", subtitle: "Защита автомобильных стёкол", text: "Гидрофобная обработка стёкол для защиты от грязи, дождя, пыли и снега. Технология на основе SiO₂ обеспечивает прочное сцепление покрытия со стеклом.", price: "от 1 000 ₽", image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/4b5f58279e7a750381ae4ee669310e73.jpg"},
  { title: "BariTools", subtitle: "Защита материалов салона", text: "Защитное покрытие на основе оксида кремния для ухода за различными материалами интерьера автомобиля.", price: "от 9 000 ₽", image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/ecf5c275ca7d90525ddb346743a18d2d.jpg"},
  { title: "Химчистка салона", subtitle: "Глубокая очистка интерьера", text: "Очистка потолка, напольного покрытия и сидений, удаление пыли из труднодоступных мест, уход за пластиковыми деталями с антистатическим эффектом.", price: "от 2 000 ₽", image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/69101b61bb09aaec23d6acbe5c0f5d9b.png"},
  { title: "Удаление вмятин без покраски", subtitle: "Технология PDR", text: "Беспокрасочное удаление вмятин с сохранением заводского лакокрасочного покрытия, если характер повреждения это позволяет.", price: "от 500 ₽", image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/3d70846270b5fa3cde2c77979087cd00.jpg"},
  { title: "Шумо-вибро-теплоизоляция", subtitle: "Комфорт в салоне автомобиля", text: "Изоляция автомобиля комплексно или отдельными узлами. Стоимость зависит от выбранных материалов и объёма работ.", price: "от 30 000 ₽", image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/fdf81ced0c7433c9daa696e726bd80d6.jpg"},
  { title: "Тонирование стёкол", subtitle: "Комфорт и внешний вид", text: "Профессиональное тонирование автомобильных стёкол с подбором решения под автомобиль и пожелания владельца.", price: "от 2 500 ₽", image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/bddc8d74db7b26ec53ec68c422ae3559.jpg"},
  { title: "Предпродажная подготовка", subtitle: "Подготовка автомобиля к продаже", text: "Комплекс работ по улучшению внешнего вида и состояния автомобиля перед продажей.", price: "от 7 000 ₽", image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/dec8114f9b6c7e5f9554f686986a9fa3.jpg"},
  { title: "Ручная полировка", subtitle: "Бережный уход за поверхностями", text: "Полировка с использованием мягких аппликаторов и микрофибры для деликатной обработки лакокрасочного покрытия и других поверхностей.", price: "от 5 000 ₽", image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/1454bf4370c656c6c5a401dcc442b7f6.jpg"},
  { title: "Автовинил", subtitle: "Стайлинг и оклейка плёнкой", text: "Оклейка поверхностей любой сложности: защитная, рекламная и стайлинговая. Гарантия на выполненные работы — 1 год.", price: "от 15 000 ₽", image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/551044fdde0f96bd733e015140ed3e64.jpg"},
  { title: "Ремонт пластика салона", subtitle: "Восстановление элементов интерьера", text: "Ремонт пластиковых деталей салона для восстановления аккуратного внешнего вида интерьера.", price: "от 1 000 ₽", image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/768eea889a5ac4f16581e1155254db26.jpg"},
  { title: "Ремонт сидений", subtitle: "Восстановление обивки", text: "Ремонт повреждений и восстановление внешнего вида автомобильных сидений.", price: "от 3 000 ₽", image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/f9d4fe0800d0d05ce535a71589489a80.jpg"},
  { title: "Перетяжка руля", subtitle: "Обновление рулевого колеса", text: "Восстановление внешнего вида руля и обновление его отделки.", price: "от 3 000 ₽", image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/85aa64429f5f1ef9da38ea3f6a5dd556.jpg"},
  { title: "Бронирование лобового стекла ClearPlex", subtitle: "Прозрачная защитная плёнка", text: "Специальная прозрачная плёнка для лобового стекла, снижающая риск сколов, трещин и царапин от дорожных воздействий.", price: "от 8 000 ₽", image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/3744fed85fc8e32b710fac51b32342e9.jpg"},
  { title: "Полировка и защита фар", subtitle: "Восстановление прозрачности оптики", text: "Полировка специальными пастами помогает вернуть фарам первоначальный блеск. Можно дополнить защитной обработкой.", price: "3 000 ₽", image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/1454bf4370c656c6c5a401dcc442b7f6.jpg"},
  { title: "Химчистка двигателя", subtitle: "Профессиональный уход под капотом", text: "Очистка двигателя с применением специальных средств и с учётом особенностей подкапотного пространства.", price: "1 500 ₽", image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/20b3a3c6c3e5a50ad030e4a641df61a2.jpg"}
];

const serviceDetails = {
  "AdVance": {
    lead: "AdVance — защитное покрытие для тех, кто хочет надолго сохранить выразительный блеск и ухоженный вид лакокрасочного покрытия своего автомобиля.",
    story: "После мойки и подготовки кузова состав формирует на поверхности защитный слой, который помогает уменьшить сцепление повседневных загрязнений с лаком. Автомобиль дольше выглядит чистым, а регулярный уход становится проще. Покрытие подчёркивает глубину цвета и придаёт кузову более насыщенный блеск.",
    benefits: ["Выразительный блеск и более глубокий визуальный эффект цвета", "Дополнительный барьер от дорожной грязи и повседневных загрязнений", "Более лёгкая мойка и уход за обработанной поверхностью", "Помощь в сохранении аккуратного внешнего вида кузова"],
    tech: "Покрытие помогает надолго сохранить блеск и защитные свойства при правильной подготовке кузова и соблюдении рекомендаций по уходу. Гарантия на покрытие — 3 года.",
    fit: "Владельцам новых и ухоженных автомобилей, которые хотят подчеркнуть внешний вид кузова и сократить время на регулярный уход."
  },
  "Бронирование автомобиля защитной плёнкой": {
    lead: "Антигравийная плёнка помогает сохранить заводское лакокрасочное покрытие и защитить кузов от повседневных дорожных воздействий.",
    story: "Во время поездок песок, мелкие камни и дорожный мусор могут оставлять на кузове сколы и царапины. Прозрачная полиуретановая плёнка принимает часть этих воздействий на себя и помогает сохранить внешний вид автомобиля. Можно защитить отдельные уязвимые элементы или выбрать оклейку большей части кузова.",
    benefits: ["Помогает снизить риск сколов и царапин от дорожного мусора", "Защищает капот, бампер, крылья, зеркала, пороги и другие уязвимые зоны", "Сохраняет исходный цвет и внешний вид лакокрасочного покрытия", "Позволяет подобрать объём защиты под автомобиль и бюджет"],
    tech: "В BARIBAL используют плёнки 3M VentureShield, HEXIS и SunTek. Материалы различаются характеристиками и доступными вариантами исполнения: у отдельных серий HEXIS есть эффект самовосстановления мелких следов, а некоторые плёнки SunTek имеют гидрофобный слой и также способны к самовосстановлению. Специалисты помогут сравнить подходящие варианты, расскажут об особенностях ухода, эксплуатации и гарантийных условиях.",
    fit: "Тем, кто хочет защитить новый автомобиль, часто ездит по трассе или просто стремится дольше сохранить кузов в хорошем состоянии. Особенно актуальна оклейка передней части автомобиля, зеркал, порогов и других зон, которые чаще подвергаются воздействию камней и песка."
  },,
  "BariGlass": {
    lead: "BariGlass — гидрофобная защита автомобильных стёкол, которая помогает сохранять хороший обзор в дождь и упрощает уход за стеклянными поверхностями.",
    story: "После обработки поверхность стекла приобретает водоотталкивающие свойства: вода собирается в капли и легче сходит с поверхности под потоком воздуха и при работе стеклоочистителей. Загрязнения меньше удерживаются на обработанном стекле, поэтому его проще очищать от дорожной плёнки, пыли и следов непогоды. Ваш взгляд остаётся сосредоточен на дороге, а не на мутной водяной плёнке.",
    benefits: ["Водоотталкивающий эффект помогает каплям быстрее скатываться со стекла", "Меньше налипание дорожной грязи и проще повседневная очистка", "Комфортнее обзор в дождливую погоду при исправных стеклоочистителях", "Обработка помогает поддерживать стекло чистым между мойками"],
    tech: "Покрытие обладает химической стойкостью к щелочным средам с уровнем pH до 13 — это помогает ему сохранять свойства даже при контакте с сильными моющими средствами, применяемыми на профессиональных мойках. Основа SiO₂ образует прочную химическую связь со стеклом, благодаря чему покрытие держится дольше и устойчивее, чем обычные составы на силиконовой или фторсодержащей основе.",
    fit: "Особенно полезно тем, кто часто ездит по трассе, много передвигается в городе в дождливую погоду или хочет облегчить уход за стёклами."
  },
  "BariTools": {
    lead: "BariTools — защитная обработка интерьера, которая помогает дольше сохранять материалы салона чистыми и ухоженными.",
    story: "Салон ежедневно сталкивается с пылью, влагой, следами обуви, одеждой и случайными загрязнениями. Защитный состав на основе оксида кремния (SiO₂) создаёт дополнительный функциональный слой на совместимых материалах. Он помогает уменьшить проникновение загрязнений и облегчает последующую очистку, не заменяя регулярный уход.",
    benefits: ["Дополнительная защита обработанных материалов от бытовых загрязнений", "Более простой уход за салоном и меньше усилий при очистке", "Помощь в сохранении аккуратного внешнего вида интерьера", "Возможность подобрать обработку под разные типы отделки"],
    tech: "Состав и технология нанесения подбираются отдельно для кожи, ткани, пластика и других материалов. Не все покрытия подходят для каждой поверхности, поэтому совместимость проверяется до обработки.",
    fit: "Владельцам новых автомобилей, семейных машин и автомобилей с интенсивной ежедневной эксплуатацией, где особенно важны чистота и сохранность интерьера."
  },
  "Химчистка салона": {
    lead: "Профессиональная химчистка помогает вернуть салону свежесть и опрятный вид, удаляя загрязнения не только с видимых поверхностей, но и из труднодоступных зон.",
    story: "Со временем в обивке сидений, ковровом покрытии и других элементах интерьера накапливаются пыль, следы напитков, уличная грязь и повседневные загрязнения. Мы подбираем способ очистки с учётом материала и состояния поверхности, последовательно обрабатываем основные зоны салона и уделяем внимание деталям, которые часто остаются без внимания при обычной уборке.",
    benefits: ["Очистка сидений, ковров, потолка и других элементов интерьера", "Удаление повседневных загрязнений и заметное освежение салона", "Обработка труднодоступных участков и стыков", "Более приятное ощущение чистоты и ухоженности автомобиля"],
    tech: "Метод, химия и степень увлажнения подбираются по типу материала. Для деликатной обивки и сложных загрязнений предварительно оцениваем состояние поверхности и согласуем ожидаемый результат.",
    fit: "Для сезонного обновления автомобиля, после поездок с детьми или животными, перед продажей либо когда обычной уборки уже недостаточно."
  },
  "Удаление вмятин без покраски": {
    lead: "PDR — технология восстановления формы кузовной детали без традиционной покраски, если характер повреждения позволяет выполнить ремонт таким способом.",
    story: "Мастер аккуратно воздействует на металл с обратной стороны панели или специальным инструментом снаружи, постепенно возвращая поверхности исходную геометрию. При подходящих повреждениях удаётся сохранить заводское лакокрасочное покрытие, избежать шпаклёвки и подбора цвета, а также оставить автомобиль с оригинальной окраской.",
    benefits: ["Сохранение заводского лакокрасочного покрытия при подходящих повреждениях", "Без шпаклёвки и окрашивания ремонтируемой зоны", "Сохранение оригинального цвета и фактуры покрытия", "Локальное восстановление внешнего вида детали"],
    tech: "Возможность PDR зависит от глубины и размера вмятины, доступа к обратной стороне панели, расположения повреждения, растяжения металла и состояния краски. Не каждую вмятину можно устранить без покраски — мастер оценивает её до начала работ.",
    fit: "Тем, кто обнаружил вмятину после парковки, града или лёгкого контакта и хочет по возможности сохранить заводскую окраску."
  },
  "Шумо-вибро-теплоизоляция": {
    lead: "Комплексная шумо-, вибро- и теплоизоляция помогает сделать поездки комфортнее: уменьшить дорожный гул, вибрации кузова и влияние внешней среды.",
    story: "Шум от шин, двигателя и дорожного покрытия передаётся через панели кузова в салон. Специальные материалы помогают снизить вибрации металлических элементов и ослабить проникновение части внешних шумов. Обработка отдельных зон или всего автомобиля позволяет настроить результат под привычные маршруты и ожидания владельца.",
    benefits: ["Снижение вибраций дверей, пола, крыши и других панелей", "Меньше дорожного шума и гула от колёс", "Более комфортное общение и прослушивание музыки в салоне", "Возможность поэтапной обработки отдельных зон"],
    tech: "Состав слоёв и материалы подбираются для каждой зоны с учётом конструкции автомобиля. Итоговый эффект зависит от исходной шумоизоляции, площади обработки и выбранных материалов; абсолютной тишины такая услуга не обещает.",
    fit: "Водителям, которые много времени проводят за рулём, часто ездят по трассе или хотят повысить акустический комфорт автомобиля."
  },
  "Тонирование стёкол": {
    lead: "Тонирование помогает настроить свет в салоне, добавить приватности и придать автомобилю более цельный, выразительный внешний вид.",
    story: "Специальная плёнка наносится на внутреннюю поверхность стекла и подбирается по оттенку и характеристикам светопропускания. В зависимости от выбранного материала она может уменьшать яркость солнечного света и помогать сделать пребывание в салоне комфортнее. Важно подобрать решение не только по внешнему эффекту, но и с учётом требований законодательства.",
    benefits: ["Более комфортное восприятие яркого дневного света", "Дополнительная приватность для пассажиров и вещей в салоне", "Аккуратный и завершённый внешний вид автомобиля", "Подбор оттенка и характеристик под пожелания владельца"],
    tech: "Светопропускание стёкол после установки должно соответствовать действующим требованиям. Перед работой подбираем плёнку и проверяем, на какие стёкла допустимо её нанесение.",
    fit: "Тем, кто хочет повысить приватность задней части салона, уменьшить яркость света и обновить внешний облик автомобиля."
  },
  "Предпродажная подготовка": {
    lead: "Предпродажная подготовка помогает представить автомобиль в лучшем свете — ухоженный внешний вид и чистый салон формируют правильное первое впечатление.",
    story: "Покупатель оценивает автомобиль ещё до тест-драйва: замечает состояние кузова, стёкол, оптики, колёс и интерьера. Мы осматриваем автомобиль и предлагаем разумный набор процедур, который подчёркивает его достоинства: очистку, уход за салоном, полировку и другие подходящие работы. Никаких лишних процедур — только то, что действительно уместно для конкретного состояния машины.",
    benefits: ["Более привлекательный внешний вид при осмотре и на фотографиях", "Чистый, ухоженный салон и аккуратные детали интерьера", "Возможность освежить кузов и оптику перед продажей", "Комплекс работ под состояние и бюджет автомобиля"],
    tech: "Состав подготовки определяется после осмотра. Косметические процедуры улучшают презентацию автомобиля, но не заменяют диагностику технического состояния и не гарантируют конкретную цену продажи.",
    fit: "Владельцам, которые планируют выставить автомобиль на продажу и хотят подготовить его к фотографированию, показам и встречам с покупателями."
  },
  "Ручная полировка": {
    lead: "Ручная полировка — аккуратный способ уделить особое внимание отдельным участкам и поверхностям, где важны контроль и точность обработки.",
    story: "Для локальных зон, сложных форм и деликатных поверхностей мастер может использовать ручные аппликаторы и микрофибру с подходящими полировальными составами. Такой подход позволяет работать постепенно и контролировать воздействие на каждом участке. Возможный результат зависит от типа поверхности и характера дефектов.",
    benefits: ["Точная работа на локальных и труднодоступных участках", "Контролируемая обработка сложных форм и деталей", "Освежение внешнего вида подходящих поверхностей", "Бережный подход с подбором состава под материал"],
    tech: "Ручная полировка не является универсальной заменой машинной коррекции ЛКП и не устраняет глубокие царапины. Перед процедурой оцениваем материал и дефекты, чтобы определить реалистичный результат.",
    fit: "Для локального обновления деталей и поверхностей, где требуется аккуратная ручная работа."
  },
  "Автовинил": {
    lead: "Автовинил открывает широкие возможности для персонализации автомобиля — от неброских акцентов до полного изменения его визуального образа.",
    story: "Виниловая плёнка позволяет изменить цвет, фактуру и отдельные детали внешнего вида без традиционной перекраски. Можно оклеить крышу, зеркала, элементы интерьера или весь кузов. При выборе учитываются геометрия деталей, состояние лакокрасочного покрытия, свойства материала и условия эксплуатации автомобиля.",
    benefits: ["Большой выбор цветов, оттенков и фактур", "Оклейка отдельных элементов или всего автомобиля", "Возможность обновить стиль без изменения заводской окраски", "Индивидуальный дизайн под характер автомобиля"],
    tech: "Для качественного результата важны правильная подготовка поверхности, подходящий материал и точный монтаж на сложных изгибах и кромках. Гарантия на работы и материалы — 1 год.",
    fit: "Тем, кто хочет выделить автомобиль, обновить его внешний вид или оформить отдельные элементы в едином стиле."
  },
  "Ремонт пластика салона": {
    lead: "Восстановление пластиковых элементов помогает вернуть интерьеру аккуратность и избежать замены деталей, если повреждение допускает ремонт.",
    story: "Царапины, потёртости и локальные повреждения на дверных картах, центральной консоли и других элементах заметны каждый день. В зависимости от материала и характера дефекта мастер подбирает технологию восстановления, чтобы привести поверхность в более аккуратное состояние и сохранить оригинальную деталь.",
    benefits: ["Работа с локальными царапинами, потёртостями и повреждениями", "Восстановление внешнего вида отдельных элементов интерьера", "Возможность сохранить оригинальную деталь вместо замены", "Подбор метода под материал и фактуру пластика"],
    tech: "Не все повреждения можно устранить полностью: результат зависит от глубины дефекта, структуры пластика и предыдущих ремонтов. Возможность восстановления определяется после осмотра.",
    fit: "Владельцам автомобилей с потёртыми или повреждёнными пластиковыми деталями, которые хотят освежить интерьер."
  },
  "Ремонт сидений": {
    lead: "Ремонт сидений помогает вернуть обивке аккуратный вид и комфорт, не прибегая к полной замене кресла, если повреждение локальное.",
    story: "Наиболее заметный износ появляется на боковых валиках, подушке и участках постоянного контакта. В зависимости от материала и состояния обивки можно выполнить локальное восстановление, ремонт швов или другие подходящие работы. Задача — аккуратно вписать отремонтированный участок в общий вид салона.",
    benefits: ["Восстановление локальных повреждений и следов износа", "Более опрятный вид водительского и пассажирских сидений", "Подбор способа ремонта под кожу, экокожу или ткань", "Возможность продлить срок службы оригинальной обивки"],
    tech: "Технология и визуальное совпадение зависят от материала, оттенка, фактуры и степени повреждения. Иногда для качественного результата требуется ремонт или замена большей зоны — это обсуждается заранее.",
    fit: "Тем, у кого появились трещины, потёртости, разрывы или другие локальные дефекты обивки сидений."
  },
  "Перетяжка руля": {
    lead: "Руль — деталь, к которой водитель прикасается в каждой поездке. Перетяжка возвращает ему аккуратный вид и приятные тактильные ощущения.",
    story: "Со временем обод руля теряет первоначальную фактуру, покрытие истирается и становится менее приятным на ощупь. Новая отделка позволяет обновить эту важную деталь интерьера, выбрать подходящий материал и фактуру, а также согласовать внешний вид с общим стилем салона.",
    benefits: ["Обновление изношенной и потёртой поверхности", "Более приятный контакт с рулём во время поездки", "Выбор материала, фактуры и оформления", "Аккуратный внешний вид одной из ключевых деталей салона"],
    tech: "Материал и конструкция отделки согласуются до начала работ. Важны качество швов, натяжение материала и сохранение корректной работы всех штатных элементов рулевого колеса.",
    fit: "Владельцам автомобилей с изношенным рулём, а также тем, кто хочет обновить интерьер и сделать его более индивидуальным."
  },
  "Бронирование лобового стекла ClearPlex": {
    lead: "ClearPlex — прозрачная защитная плёнка для лобового стекла, которая помогает принять на себя часть повседневных дорожных воздействий и сохранить само стекло.",
    story: "Песок, мелкие камни, дорожный мусор и постоянная работа стеклоочистителей постепенно оставляют на лобовом стекле следы эксплуатации. Специальная прозрачная плёнка создаёт дополнительный внешний слой, который принимает часть этих воздействий. При правильной установке она сохраняет обзор и практически не меняет внешний вид стекла.",
    benefits: ["Дополнительный барьер от мелких сколов и абразивных царапин", "Защита от части воздействий песка и дорожного мусора", "Помощь в сохранении исходного стекла и его прозрачности", "Особенно актуально для автомобилей с частыми поездками по трассе"],
    tech: "Совместимость, срок службы, правила ухода и характеристики конкретной плёнки, включая UV-защиту, необходимо сверять с технической спецификацией производителя. Плёнка снижает риск повреждений, но не делает стекло неуязвимым.",
    fit: "Водителям, которые часто ездят по трассе, передвигаются по дорогам с активным грузовым трафиком или хотят дополнительно защитить дорогостоящее лобовое стекло."
  },
  "Полировка и защита фар": {
    lead: "Помутневшие фары портят внешний вид автомобиля и могут ухудшать световой поток. Полировка помогает вернуть оптике более прозрачный и ухоженный вид.",
    story: "Под воздействием солнца, дорожной пыли и времени поверхность фар может мутнеть и покрываться мелкими следами износа. После оценки состояния мастер подбирает способ восстановления поверхности, а затем наносит защитный состав, чтобы помочь дольше сохранить полученный результат.",
    benefits: ["Уменьшение поверхностного помутнения и мелких следов износа", "Более прозрачный и аккуратный внешний вид оптики", "Обновление внешнего облика передней части автомобиля", "Защитный финиш для поддержания результата"],
    tech: "Полировка подходит не для всех дефектов. Внутреннее помутнение, трещины, глубокие повреждения или разрушение материала требуют отдельной оценки и могут не устраняться полировкой.",
    fit: "Владельцам автомобилей с помутневшими фарами и поверхностными дефектами прозрачного слоя."
  },
  "Химчистка двигателя": {
    lead: "Аккуратная очистка подкапотного пространства помогает вернуть моторному отсеку ухоженный вид и облегчает визуальный контроль за его состоянием.",
    story: "Под капотом постепенно скапливаются пыль, дорожная грязь и следы технических жидкостей. Перед очисткой оценивается состояние моторного отсека, типы поверхностей и чувствительные электрические компоненты. Метод подбирается так, чтобы удалить загрязнения с необходимыми мерами предосторожности.",
    benefits: ["Удаление пыли и дорожной грязи с подходящих поверхностей", "Более опрятный вид моторного отсека", "Удобнее замечать свежие подтёки и изменения состояния узлов", "Очистка с учётом материалов и чувствительных компонентов"],
    tech: "Подкапотное пространство требует осторожного подхода: способ очистки и защита электрооборудования определяются после осмотра. Услуга не заменяет техническое обслуживание и диагностику двигателя.",
    fit: "Тем, кто хочет привести моторный отсек в порядок перед продажей, после длительной эксплуатации или для поддержания общего ухоженного состояния автомобиля."
  }
};
const serviceInfoModal = () => `
  <div class="modal service-info-modal" id="service-info-modal" aria-hidden="true">
    <div class="modal-backdrop js-close"></div>
    <section class="modal-card service-info-card" role="dialog" aria-modal="true" aria-labelledby="service-info-title">
      <button class="modal-close js-close" aria-label="Закрыть">×</button>
      <span class="eyebrow">ТЕХНОЛОГИИ BARIBAL</span>
      <h2 id="service-info-title"></h2>
      <p class="service-info-lead" id="service-info-lead"></p>
      <div class="service-info-story" id="service-info-story"></div>
      <h3>Преимущества</h3>
      <ul id="service-info-benefits"></ul>
      <div class="service-info-tech"><b>Технология и важные нюансы</b><p id="service-info-tech"></p></div>
      <div class="service-info-fit"><b>Кому подойдёт</b><p id="service-info-fit"></p></div>
      <div class="service-info-bottom"><span id="service-info-price"></span><button class="button" id="service-info-order" type="button">Хочу так же <span>↗</span></button></div>
    </section>
  </div>`;
const allServiceCards = () => allServices.map((item, i) => `<article class="service-card"><div class="service-image"><img src="${item.image}" alt="${item.title}" loading="lazy" /></div><div class="service-copy"><span class="eyebrow">0${i + 1} / УСЛУГА</span><h3>${item.title}</h3><h4>${item.subtitle}</h4><p>${item.text}</p><div class="service-bottom"><b>${item.price}</b><div class="service-actions"><button class="text-link js-service-info" type="button" data-service-title="${item.title}">Подробнее <span>↗</span></button><button class="button button-order js-callback" type="button" data-service-title="${item.title}">Заказать</button></div></div></div></article>`).join("");

const techPage = () => {
  const page = contentPage("УСЛУГИ И ТЕХНОЛОГИИ","Все технологии <em>студии BARIBAL</em>","Полный каталог услуг студии: защита кузова и стёкол, уход за салоном, восстановление и стайлинг автомобиля.",`<div class="service-grid">${allServiceCards()}</div><div class="prose-block"><h2>Подберём решение под ваш автомобиль</h2><p>Можно выбрать отдельную услугу или обсудить комплекс работ. Итоговая стоимость зависит от марки и состояния автомобиля, площади обработки, выбранных материалов и объёма работ.</p><p>Стоимость каждой услуги зависит от автомобиля, состояния поверхности, площади обработки и выбранных материалов. Указанная цена «от» обозначает начальную стоимость; итоговый расчёт выполняется с учётом объёма работ.</p></div>`);
  return page.replace("</main>", `${estimateSection(true)}</main>`);
};
const bodyServices = [
  { title: "AdVance", subtitle: "Защитное покрытие кузова", text: "Защитное покрытие для блеска и сохранения лакокрасочного покрытия. Гарантия на покрытие — 3 года.", price: "от 15 000 ₽", image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/c2d8bf6b6f8e8cdd6e21617c92f6d618.jpg"},
  { title: "Бронирование автомобиля защитной плёнкой", subtitle: "Защита от сколов и дорожных воздействий", text: "Оклейка кузова полиуретановыми плёнками 3M VentureShield, HEXIS и SunTek. Помогает защитить лакокрасочное покрытие от мелких камней, песка, дорожного мусора и насекомых.", price: "от 3 000 ₽", image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/49e6ea0c7e4f85447a41d1a7867892de.jpg"},
  { title: "Удаление вмятин без покраски", subtitle: "Технология PDR", text: "Беспокрасочное удаление вмятин с сохранением заводского лакокрасочного покрытия, если характер повреждения это позволяет.", price: "от 500 ₽", image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/3d70846270b5fa3cde2c77979087cd00.jpg"},
  { title: "Ручная полировка", subtitle: "Бережное восстановление блеска", text: "Ручная обработка с использованием профессиональных аппликаторов и микрофибры для ухода за лакокрасочным покрытием и другими поверхностями.", price: "от 5 000 ₽", image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/1454bf4370c656c6c5a401dcc442b7f6.jpg"},
  { title: "Полировка и защита фар", subtitle: "Возвращаем оптике прозрачность", text: "Полировка специальными составами помогает вернуть фарам первоначальный блеск. После обработки наносится защитный состав.", price: "3 000 ₽", image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/1454bf4370c656c6c5a401dcc442b7f6.jpg"},
  { title: "Автовинил", subtitle: "Стайлинг плёнкой", text: "Оклейка отдельных элементов и поверхностей автомобиля виниловой плёнкой. Подбор решения и дизайна под ваш автомобиль.", price: "от 15 000 ₽", image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/551044fdde0f96bd733e015140ed3e64.jpg"}
];
const bodyServiceCards = () => bodyServices.map((item, i) => `<article class="service-card"><div class="service-image"><img src="${item.image}" alt="${item.title}" loading="lazy" /></div><div class="service-copy"><span class="eyebrow">0${i + 1} / УСЛУГА</span><h3>${item.title}</h3><h4>${item.subtitle}</h4><p>${item.text}</p>${item.title === "Бронирование автомобиля защитной плёнкой" ? '<div class="service-certification"><button class="text-link" type="button">Сертификат</button></div>' : ""}<div class="service-bottom"><b>${item.price}</b><div class="service-actions"><button class="text-link js-service-info" type="button" data-service-title="${item.title}">Подробнее <span>↗</span></button><button class="button button-order js-callback" type="button" data-service-title="${item.title}">Обсудить детали</button></div></div></div></article>`).join("");
const bodyPage = () => contentPage("ЗАЩИТА АВТОМОБИЛЯ","Профессиональная <em>защита кузова</em>","Защита, восстановление и уход за кузовом автомобиля — от антигравийной плёнки до ручной полировки.",`<div class="service-grid">${bodyServiceCards()}</div><div class="prose-block"><h2>Комплексный уход за кузовом</h2><p>В студии BARIBAL можно подобрать отдельную услугу или объединить несколько работ в комплекс: сначала подготовить и отполировать поверхность, затем нанести защитное покрытие или оклеить уязвимые зоны плёнкой.</p><p>Удаление вмятин без покраски выполняется по технологии PDR, если состояние покрытия и геометрия повреждения это позволяют. Возможность и стоимость работ мастер определяет после осмотра автомобиля.</p><p>Стоимость зависит от состояния автомобиля, площади обработки и объёма работ. Указанная цена «от» обозначает начальную стоимость; точный расчёт выполняется после осмотра.</p></div><button class="button js-callback">Получить консультацию</button>`);
const cleanPage = () => contentPage("УХОД ЗА АВТОМОБИЛЕМ","Бережная <em>химчистка салона</em>","Профессиональные материалы и внимание к каждой детали интерьера.",`<div class="split-feature"><div class="feature-photo"><img src="https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/ecf5c275ca7d90525ddb346743a18d2d.jpg" alt="Интерьер автомобиля после ухода"></div><div class="prose-block"><h2>Свежесть и чистота в салоне</h2><p>Студия BARIBAL очищает потолок, велюровое напольное покрытие и сиденья, удаляет пыль из труднодоступных мест. Обрабатываем пластиковые детали средствами с антистатическим эффектом и возвращаем салону приятный запах.</p><p>После процедуры салон остаётся сухим, чистым и ухоженным. Используем профессиональные материалы и подбираем способ обработки с учётом отделки автомобиля.</p><p><strong>Стоимость химчистки — от 2 000 ₽.</strong></p><button class="button js-callback">Записаться на химчистку</button></div></div>`);
const vinylPage = () => contentPage("СТАЙЛИНГ И ЗАЩИТА","Автовинил — <em>стайлинг плёнкой</em>","Оклейка поверхностей любой сложности — от отдельных элементов до кузова автомобиля.",`<div class="split-feature"><div class="feature-photo"><img src="${work[0].image}" alt="Оклейка автомобиля плёнкой"></div><div class="prose-block"><h2>Точная оклейка и выразительный результат</h2><p>Нанесение виниловой плёнки на кузов требует опыта: сложные изгибы, криволинейные поверхности и условия эксплуатации необходимо учитывать на каждом этапе.</p><p>Специалисты BARIBAL выполняют защитную, рекламную и стайлинговую оклейку. Контролируем качество материалов и работ, вручную прорабатываем сложные участки и устраняем выявленный брак.</p><ul class="feature-list"><li>Современные технологии и контроль качества</li><li>Гарантия 1 год на выполненные работы</li><li>Точность, профессионализм и аккуратность</li></ul><button class="button js-callback">Обсудить оклейку</button></div></div>`);
const reviewsPage = () => contentPage("МНЕНИЕ КЛИЕНТОВ","Отзывы наших <em>клиентов</em>","Нам важно, чтобы результат радовал владельца автомобиля и спустя время.",`<div class="review-quote"><span>“</span><blockquote>После покупки автомобиля, заехали в Барибал. Заказывали бронирование пленкой. Прошло два года, а состояние покрытия прежнее. Ни сколов, ни царапин нет. Периодически приезжаем на химчистку салона. В целом все устраивает. Сервис хороший. Ребята с опытом.</blockquote><b>Александр</b></div><div class="review-form-wrap"><h2>Оставьте свой отзыв</h2><p>Расскажите о своём опыте — отзыв появится на этой странице после проверки.</p><form class="lead-form demo-form"><label>Ваше имя<input name="name" placeholder="Имя"></label><label>Марка и модель автомобиля<input name="car" required placeholder="Например, Toyota Camry"></label><label>Текст отзыва<textarea name="review" required rows="5" placeholder="Поделитесь впечатлениями"></textarea></label><button class="button" type="submit">Отправить отзыв</button><small>Форма пока в режиме предпросмотра; публикация отзывов будет подключена отдельно.</small><output></output></form></div>`);
const privacyPage = () => contentPage("ДОКУМЕНТЫ","Политика <em>конфиденциальности</em>","Политика обработки персональных данных сайта BARIBAL.",`<div class="prose-block legal-copy"><p>Политика обработки персональных данных разработана в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных» и определяет порядок обработки персональных данных и меры по обеспечению их безопасности владельцем сайта baribal-studio.ru.</p><h2>Цели обработки</h2><p>Персональные данные используются для предоставления запрашиваемых услуг и информации, ответа на обращения, улучшения качества обслуживания, внутреннего учёта и связи с пользователями.</p><h2>Какие данные могут обрабатываться</h2><p>Имя, адрес электронной почты, номер телефона, файлы cookie и иная информация, которую пользователь добровольно передаёт через формы сайта.</p><h2>Обработка и защита</h2><p>Обработка осуществляется на законной основе и только в объёме, необходимом для заявленных целей. Оператор принимает меры для защиты данных и не продаёт персональные данные пользователей.</p><h2>Отзыв согласия</h2><p>Пользователь может обратиться к оператору по вопросам обработки и отзыва согласия по электронной почте: mihail051206@yandex.ru.</p></div>`);
const pageMap = {"/":homePage,"/video":videoPage,"/tehnology":techPage,"/kuzov":bodyPage,"/himchistka":cleanPage,"/avtovinil":vinylPage,"/foto":galleryPage,"/reviews":reviewsPage,"/politika-konfidencialnosti":privacyPage};
const renderPage = pageMap[path] || homePage;
document.querySelector("#app").innerHTML = header() + renderPage() + footer() + callback() + serviceInfoModal() + `<aside class="contact-widget" aria-label="Связаться с BARIBAL"><button class="contact-widget-toggle" type="button" aria-expanded="false" aria-controls="contact-widget-panel"><img src="${contactWidgetImage}" alt=""><span>Связаться с нами</span><b aria-hidden="true">+</b></button><section class="contact-widget-panel" id="contact-widget-panel" aria-hidden="true"><div class="contact-widget-heading"><img src="${contactWidgetImage}" alt=""><div><b>Давайте обсудим ваш автомобиль</b><span>Оставьте номер — мы свяжемся с вами</span></div></div><a class="contact-widget-phone" href="tel:+79824814142">+7 (982) 481-41-42</a><form class="lead-form demo-form contact-widget-form"><label>Ваше имя<input name="name" placeholder="Как к вам обращаться"></label><label>Телефон<input name="phone" type="tel" placeholder="+7 (___) ___-__-__" required></label>${contactPreferences()}<button class="button" type="submit">Заказать звонок <span>↗</span></button><output></output></form></section></aside>` + '<button class="back-to-top" type="button" aria-label="Переместиться наверх" title="Переместиться наверх"><span class="back-to-top-label">Наверх</span><span aria-hidden="true">↑</span></button>';
if (location.pathname === basePath || location.pathname.startsWith(basePath + "/")) {
  document.querySelectorAll("#app a[href^=\"/\"]").forEach(link => { link.setAttribute("href", basePath + link.getAttribute("href")); });
}

const previewModal = document.createElement("div");
previewModal.className = "device-preview-modal";
previewModal.id = "device-preview-modal";
previewModal.setAttribute("aria-hidden", "true");
previewModal.innerHTML = `
  <div class="device-preview-backdrop" data-preview-close></div>
  <section class="device-preview-dialog" role="dialog" aria-modal="true" aria-labelledby="device-preview-title">
    <header class="device-preview-modal-head">
      <div><span class="device-preview-modal-kicker">BARIBAL · АДАПТИВНОСТЬ</span><h2 id="device-preview-title">Предпросмотр сайта</h2></div>
      <div class="device-preview-modal-actions">
        <button class="device-preview-mode is-active" type="button" data-preview-width="390" aria-pressed="true">Телефон</button>
        <button class="device-preview-mode" type="button" data-preview-width="1366" aria-pressed="false">Ноутбук</button>
        <button class="device-preview-mode" type="button" data-preview-width="1920" aria-pressed="false">Широкий монитор</button>
        <button class="device-preview-close" type="button" data-preview-close aria-label="Закрыть окно">×</button>
      </div>
    </header>
    <div class="device-preview-viewport"><iframe title="Предпросмотр сайта BARIBAL" loading="lazy"></iframe></div>
  </section>`;
document.body.append(previewModal);
const previewFrame = previewModal.querySelector("iframe");
const previewButtons = [...previewModal.querySelectorAll("[data-preview-width]")];
let previewLoaded = false;
const setPreviewWidth = width => {
  previewFrame.style.width = width + "px";
  previewButtons.forEach(button => {
    const active = Number(button.dataset.previewWidth) === width;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
};
const openPreview = () => {
  if (!previewLoaded) {
    previewFrame.src = location.href;
    previewLoaded = true;
  }
  setPreviewWidth(390);
  previewModal.classList.add("is-open");
  previewModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("device-preview-modal-open");
  previewModal.querySelector(".device-preview-mode").focus();
};
const closePreview = () => {
  previewModal.classList.remove("is-open");
  previewModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("device-preview-modal-open");
  document.querySelector(".device-preview-open")?.focus();
};
document.querySelector(".device-preview-open")?.addEventListener("click", openPreview);
previewButtons.forEach(button => button.addEventListener("click", () => setPreviewWidth(Number(button.dataset.previewWidth))));
previewModal.querySelectorAll("[data-preview-close]").forEach(button => button.addEventListener("click", closePreview));
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && previewModal.classList.contains("is-open")) closePreview();
});
const heroPhotoToggle = document.querySelector(".hero-photo-toggle");
heroPhotoToggle?.addEventListener("click", () => {
  const showingNewPhoto = document.querySelector(".hero").classList.toggle("is-alt-photo");
  heroPhotoToggle.setAttribute("aria-pressed", String(showingNewPhoto));
  heroPhotoToggle.setAttribute("aria-label", showingNewPhoto ? "Показать старую фотографию" : "Показать новую фотографию");
});
const designToggle = document.querySelector(".hero-design-toggle");
const designName = document.querySelector(".hero-design-name");
const designNames = ["Основной", "Премиум", "Хайтек", "Автомобильный"];
let activeDesign = 0;
try {
  const savedDesign = Number(localStorage.getItem("baribal-design"));
  if (Number.isInteger(savedDesign) && savedDesign >= 0 && savedDesign < designNames.length) activeDesign = savedDesign;
} catch {}
const applyDesign = () => {
  document.documentElement.dataset.design = String(activeDesign + 1);
  if (designToggle) {
    designToggle.setAttribute("aria-label", `Текущий дизайн: ${designNames[activeDesign]}. Переключить дизайн`);
    designToggle.dataset.design = String(activeDesign + 1);
    if (designName) designName.textContent = designNames[activeDesign];
  }
};
applyDesign();
designToggle?.addEventListener("click", () => {
  activeDesign = (activeDesign + 1) % designNames.length;
  applyDesign();
  try { localStorage.setItem("baribal-design", String(activeDesign)); } catch {}
});
const backToTop = document.querySelector(".back-to-top");
const updateBackToTop = () => {
  const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
  backToTop.classList.toggle("is-visible", scrollPosition > 300);
};
window.addEventListener("scroll", updateBackToTop, { passive: true, capture: true });
window.addEventListener("pageshow", updateBackToTop);
window.addEventListener("resize", updateBackToTop);
document.addEventListener("scroll", updateBackToTop, { passive: true, capture: true });
updateBackToTop();
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const contactWidget = document.querySelector(".contact-widget");
const contactWidgetToggle = document.querySelector(".contact-widget-toggle");
const contactWidgetPanel = document.querySelector(".contact-widget-panel");
let contactWidgetDismissed = false;
let contactWidgetAlreadyShown = false;
try {
  contactWidgetDismissed = sessionStorage.getItem("baribal-contact-widget-dismissed") === "1";
  contactWidgetAlreadyShown = sessionStorage.getItem("baribal-contact-widget-shown") === "1";
} catch {}
const setContactWidgetOpen = open => {
  contactWidget.classList.toggle("is-open", open);
  contactWidgetToggle.setAttribute("aria-expanded", String(open));
  contactWidgetPanel.setAttribute("aria-hidden", String(!open));
  contactWidgetToggle.querySelector("span").textContent = open ? "Скрыть" : "Связаться с нами";
  contactWidgetToggle.querySelector("b").textContent = open ? "−" : "+";
};
contactWidgetToggle.addEventListener("click", () => {
  const opening = !contactWidget.classList.contains("is-open");
  if (opening) {
    contactWidgetAlreadyShown = true;
    try { sessionStorage.setItem("baribal-contact-widget-shown", "1"); } catch {}
  } else {
    contactWidgetDismissed = true;
    try { sessionStorage.setItem("baribal-contact-widget-dismissed", "1"); } catch {}
  }
  setContactWidgetOpen(opening);
});
if (!contactWidgetAlreadyShown && !contactWidgetDismissed) {
  window.setTimeout(() => {
    if (!contactWidgetAlreadyShown && !contactWidgetDismissed) {
      contactWidgetAlreadyShown = true;
      try { sessionStorage.setItem("baribal-contact-widget-shown", "1"); } catch {}
      setContactWidgetOpen(true);
    }
  }, 7000);
}
document.querySelectorAll(".contact-preferences").forEach(group => {
  const otherToggle = group.querySelector("[data-contact-other-toggle]");
  const details = group.querySelector(".contact-other-details");
  const otherInput = group.querySelector('input[name="contact_other"]');
  const syncOther = () => {
    const visible = otherToggle.checked;
    details.hidden = !visible;
    otherInput.required = visible;
  };
  otherToggle.addEventListener("change", syncOther);
  syncOther();
});


/* BARIBAL video players: branded poster, play control and orange timeline. */
const formatPlayerTime = seconds => {
  if (!Number.isFinite(seconds)) return "0:00";
  const value = Math.floor(seconds);
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`;
};
document.querySelectorAll(".baribal-player").forEach(player => {
  const video = player.querySelector("video");
  const poster = player.querySelector(".video-poster");
  const controls = player.querySelector("[data-player-controls]");
  const playButton = player.querySelector("[data-player-play]");
  const progress = player.querySelector("[data-player-progress]");
  const time = player.querySelector("[data-player-time]");
  const muteButton = player.querySelector("[data-player-mute]");
  const updatePlayState = () => {
    playButton.textContent = video.paused ? "▶" : "Ⅱ";
    playButton.setAttribute("aria-label", video.paused ? "Воспроизвести видео" : "Приостановить видео");
  };
  const updateProgress = () => {
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    const percent = duration ? (video.currentTime / duration) * 100 : 0;
    progress.value = String(percent);
    progress.style.setProperty("--player-progress", `${percent}%`);
    time.textContent = `${formatPlayerTime(video.currentTime)} / ${formatPlayerTime(duration)}`;
  };
  const startVideo = () => {
    poster.hidden = true;
    controls.hidden = false;
    video.play().catch(() => {
      poster.hidden = false;
      controls.hidden = true;
    });
  };
  player.querySelector("[data-player-start]").addEventListener("click", startVideo);
  playButton.addEventListener("click", () => {
    if (video.paused) {
      if (video.ended) video.currentTime = 0;
      video.play().catch(() => {});
    } else video.pause();
  });
  video.addEventListener("play", updatePlayState);
  video.addEventListener("pause", updatePlayState);
  video.addEventListener("timeupdate", updateProgress);
  video.addEventListener("loadedmetadata", updateProgress);
  video.addEventListener("ended", updatePlayState);
  progress.addEventListener("input", () => {
    if (Number.isFinite(video.duration)) video.currentTime = video.duration * Number(progress.value) / 100;
  });
  muteButton.addEventListener("click", () => {
    video.muted = !video.muted;
    muteButton.textContent = video.muted ? "×" : "♪";
    muteButton.setAttribute("aria-label", video.muted ? "Включить звук" : "Выключить звук");
  });
  player.querySelector("[data-player-fullscreen]").addEventListener("click", () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else player.requestFullscreen?.();
  });
  updatePlayState();
  updateProgress();
});

const themeButton = document.querySelector("[data-theme-toggle]");
const applyTheme = theme => {
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem("baribal-theme", theme); } catch {}
  const nextTheme = theme === "dark" ? "light" : "dark";
  themeButton.querySelector(".theme-icon").textContent = nextTheme === "light" ? "☀" : "☾";
  themeButton.querySelector(".theme-label").textContent = nextTheme === "light" ? "Светлая" : "Тёмная";
  themeButton.setAttribute("aria-label", nextTheme === "light" ? "Включить светлую тему" : "Включить тёмную тему");
  themeButton.setAttribute("aria-pressed", String(theme === "light"));
};
applyTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
themeButton.addEventListener("click", () => applyTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light"));

const menuButton = document.querySelector(".menu-toggle");
menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  document.querySelector(".nav").classList.toggle("nav-open", open);
});
const portfolioGrid = document.querySelector("#portfolio-grid");
const portfolioMore = document.querySelector("#portfolio-more");
let portfolioExpanded = false;
let activePortfolioFilter = "Все работы";
const updatePortfolioView = () => {
  if (!portfolioGrid) return;
  const cards = [...portfolioGrid.querySelectorAll(".portfolio-card")];
  const filtered = cards.filter(card => activePortfolioFilter === "Все работы" || card.dataset.categories.split("|").includes(activePortfolioFilter));
  cards.forEach(card => {
    const visibleInFilter = filtered.includes(card);
    const position = filtered.indexOf(card);
    card.hidden = !visibleInFilter || (!portfolioExpanded && position >= 9);
    card.classList.toggle("is-extra", position >= 9 && !portfolioExpanded);
    card.classList.toggle("is-visible", position >= 9 && portfolioExpanded);
  });
  if (portfolioMore) {
    const hasMore = filtered.length > 9;
    portfolioMore.hidden = !hasMore;
    portfolioMore.setAttribute("aria-expanded", String(portfolioExpanded));
    portfolioMore.textContent = portfolioExpanded ? "Свернуть работы" : `Показать все работы (${filtered.length})`;
  }
};
if (portfolioMore) portfolioMore.addEventListener("click", () => { portfolioExpanded = !portfolioExpanded; updatePortfolioView(); });
document.querySelectorAll(".portfolio-filter").forEach(button => button.addEventListener("click", () => {
  activePortfolioFilter = button.dataset.filter;
  portfolioExpanded = false;
  document.querySelectorAll(".portfolio-filter").forEach(filter => {
    const active = filter === button;
    filter.classList.toggle("is-active", active);
    filter.setAttribute("aria-pressed", String(active));
  });
  updatePortfolioView();
}));
updatePortfolioView();
document.querySelectorAll(".nav a").forEach(link => link.addEventListener("click", () => {
  document.querySelector(".nav").classList.remove("nav-open");
  menuButton.setAttribute("aria-expanded", "false");
}));
const workGallery = document.querySelector("#work-gallery-modal");
if (workGallery) {
  const galleryImage = workGallery.querySelector(".work-gallery-image");
  const galleryTitle = workGallery.querySelector(".work-gallery-title");
  const galleryCounter = workGallery.querySelector(".work-gallery-counter");
  const galleryDots = workGallery.querySelector(".work-gallery-dots");
  let galleryIndex = 0, galleryItems = [], galleryStartX = 0;
  const renderWorkGallery = () => {
    galleryImage.src = galleryItems[galleryIndex];
    galleryImage.alt = `Тестовое фото ${galleryIndex + 1}`;
    galleryCounter.textContent = `${galleryIndex + 1} / ${galleryItems.length}`;
    galleryDots.innerHTML = galleryItems.map((_, i) => `<button type="button" class="work-gallery-dot${i === galleryIndex ? " is-active" : ""}" data-gallery-dot="${i}" aria-label="Фото ${i + 1}" aria-current="${i === galleryIndex ? "true" : "false"}"></button>`).join("");
  };
  const showGallery = index => { galleryIndex = (index + galleryItems.length) % galleryItems.length; renderWorkGallery(); };
  const closeWorkGallery = () => { workGallery.classList.remove("is-open"); workGallery.setAttribute("aria-hidden","true"); document.body.classList.remove("no-scroll"); };
  document.querySelectorAll(".js-open-work-gallery").forEach(button => button.addEventListener("click", () => {
    const index = Number(button.dataset.galleryIndex);
    galleryItems = demoWorkGalleries[index] || [];
    galleryTitle.textContent = work[index]?.title || "Фотографии работы";
    showGallery(0);
    workGallery.classList.add("is-open");
    workGallery.setAttribute("aria-hidden","false");
    document.body.classList.add("no-scroll");
    workGallery.querySelector(".work-gallery-close").focus();
  }));
  workGallery.querySelectorAll("[data-gallery-close]").forEach(button => button.addEventListener("click", closeWorkGallery));
  workGallery.querySelector("[data-gallery-prev]").addEventListener("click", () => showGallery(galleryIndex - 1));
  workGallery.querySelector("[data-gallery-next]").addEventListener("click", () => showGallery(galleryIndex + 1));
  galleryDots.addEventListener("click", event => { const dot = event.target.closest("[data-gallery-dot]"); if (dot) showGallery(Number(dot.dataset.galleryDot)); });
  galleryImage.addEventListener("touchstart", event => { galleryStartX = event.changedTouches[0].clientX; }, {passive:true});
  galleryImage.addEventListener("touchend", event => { const delta = event.changedTouches[0].clientX - galleryStartX; if (Math.abs(delta) > 45) showGallery(galleryIndex + (delta < 0 ? 1 : -1)); }, {passive:true});
  document.addEventListener("keydown", event => {
    if (!workGallery.classList.contains("is-open")) return;
    if (event.key === "Escape") closeWorkGallery();
    if (event.key === "ArrowLeft") showGallery(galleryIndex - 1);
    if (event.key === "ArrowRight") showGallery(galleryIndex + 1);
  });
}
const modal = document.querySelector("#callback-modal");
const openModal = (workTitle = "", serviceTitle = "") => {
  const context = document.querySelector("#callback-context");
  const title = document.querySelector("#modal-title");
  const serviceField = document.querySelector("#callback-service");
  title.textContent = serviceTitle ? "Заказать услугу" : "Мы вам перезвоним";
  serviceField.value = serviceTitle || "";
  context.textContent = serviceTitle
    ? `Вы выбрали «${serviceTitle}». Оставьте телефон — мы свяжемся с вами, ответим на вопросы и согласуем удобное время.`
    : workTitle
      ? `Вы выбрали работу «${workTitle}». Оставьте телефон — обсудим похожее решение для вашего автомобиля.`
      : "Оставьте номер — обсудим задачу и подберём решение для вашего автомобиля.";
  modal.classList.add("modal-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
};
const closeModal = () => { modal.classList.remove("modal-open"); modal.setAttribute("aria-hidden", "true"); document.body.classList.remove("no-scroll"); };
document.querySelectorAll(".js-callback").forEach(button => button.addEventListener("click", event => { event.preventDefault(); openModal(button.dataset.workTitle || "", button.dataset.serviceTitle || ""); }));
const infoModal = document.querySelector("#service-info-modal");
const closeInfoModal = () => { infoModal.classList.remove("modal-open"); infoModal.setAttribute("aria-hidden", "true"); document.body.classList.remove("no-scroll"); };
const openServiceInfo = title => {
  const item = allServices.find(service => service.title === title) || bodyServices.find(service => service.title === title);
  const details = serviceDetails[title] || (title === "Бронирование плёнкой 3M" ? serviceDetails["Бронирование кузова плёнкой"] : null);
  if (!item || !details) return;
  document.querySelector("#service-info-title").textContent = item.title;
  document.querySelector("#service-info-lead").textContent = details.lead;
  document.querySelector("#service-info-story").textContent = details.story;
  document.querySelector("#service-info-benefits").innerHTML = details.benefits.map(point => `<li>${point}</li>`).join("");
  document.querySelector("#service-info-tech").textContent = details.tech;
  document.querySelector("#service-info-fit").textContent = details.fit;
  document.querySelector("#service-info-price").textContent = item.price;
  document.querySelector("#service-info-order").dataset.serviceTitle = item.title;
  infoModal.classList.add("modal-open");
  infoModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
};
document.querySelectorAll(".js-service-info").forEach(button => button.addEventListener("click", () => openServiceInfo(button.dataset.serviceTitle)));
document.querySelector("#service-info-order").addEventListener("click", () => {
  const title = document.querySelector("#service-info-order").dataset.serviceTitle;
  closeInfoModal();
  openModal("", title);
});
document.querySelectorAll(".js-close").forEach(button => button.addEventListener("click", () => { closeModal(); closeInfoModal(); }));
document.addEventListener("keydown", event => { if (event.key === "Escape") { closeModal(); closeInfoModal(); } });
document.querySelectorAll('input[type="tel"]').forEach(input => input.addEventListener("input", () => {
  let digits = input.value.replace(/\D/g, "");
  if (digits.startsWith("8")) digits = "7" + digits.slice(1);
  if (digits.startsWith("7")) digits = digits.slice(1);
  digits = digits.slice(0, 10);
  const parts = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 8), digits.slice(8, 10)];
  input.value = digits ? "+7" + (parts[0] ? " (" + parts[0] : "") + (parts[0]?.length === 3 ? ")" : "") + (parts[1] ? " " + parts[1] : "") + (parts[2] ? "-" + parts[2] : "") + (parts[3] ? "-" + parts[3] : "") : "";
}));
/* Keep the selected-services summary in sync with the checklist. */
document.querySelectorAll(".estimate").forEach(section => {
  const checkboxes = [...section.querySelectorAll('.estimate-service-option input[type="checkbox"]')];
  const list = section.querySelector("[data-selected-services]");
  const count = section.querySelector("[data-selected-count]");
  const hidden = section.querySelector("[data-selected-value]");
  if (!list || !count || !hidden) return;
  const syncSelectedServices = () => {
    const selected = checkboxes.filter(input => input.checked).map(input => input.value);
    count.textContent = String(selected.length);
    hidden.value = selected.join(", ");
    list.innerHTML = selected.length
      ? selected.map(service => `<li>${service}</li>`).join("")
      : '<li class="estimate-selected-empty">Пока ничего не выбрано</li>';
  };
  checkboxes.forEach(input => input.addEventListener("change", syncSelectedServices));
  syncSelectedServices();
});

document.querySelectorAll(".demo-form").forEach(form => form.addEventListener("submit", event => {
  event.preventDefault();
  const output = form.querySelector("output");
  output.textContent = "Предпросмотр: форма готова. Подключение отправки через Creatium — следующий этап.";
}));
