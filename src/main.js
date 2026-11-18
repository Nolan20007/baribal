import "./styles.css";
import { portfolioGalleries } from "./portfolio-galleries.js";
try { const savedTheme = localStorage.getItem("baribal-theme"); if (savedTheme === "light" || savedTheme === "dark") document.documentElement.dataset.theme = savedTheme; } catch {}
const logo = new URL("../assets/images/brand/ca257917ad27e3cc4c7f0e446bc6d0bfdc1cb9d92bc77c476dde83c5275612f5.png", import.meta.url).href;
const work = [
  { image: new URL("../assets/images/portfolio/558905d76ecd9119f333da37f74c2034cfae158253a32f631c2c16cc85eba03d.jpg", import.meta.url).href, type: "Оклейка", title: "Оклейка LAND CRUISER в матовый полиуретан", text: "Отличная защита кузова и выразительный матовый дизайн." },
  { image: new URL("../assets/images/portfolio/edb1f571acdac6f0a9bc76b7bdcff548467bed7c317eac3fbbbbe6e41cd3430c.jpg", import.meta.url).href, type: "Бронирование", title: "Защита BMW 8", text: "Бронирование передней части автомобиля и лобового стекла." },
  { image: new URL("../assets/images/portfolio/89aa4c603c5fe509040b7999422cd307e8aea34d9ce8fcd7862940961bd39ffa.jpg", import.meta.url).href, type: "Бронирование", title: "Защита Lexus", text: "Оклейка передней части кузова защитной полиуретановой плёнкой." }
];
const portfolio = [
  { image: new URL("../assets/images/portfolio/f2a0cd04be8b7aede709121dd35b5d8607cb52964483cd59913567dcc0251497.png", import.meta.url).href, type: "Бронирование", title: "Porsche — защита передней части", text: "Бронирование всей передней части автомобиля Porsche антигравийной плёнкой." },
  { image: new URL("../assets/images/portfolio/373fc89cebe2f66cde3be34be69fb7020db6ccb03af57f5b93d64ae9edfc7e4d.jpg", import.meta.url).href, type: "Бронирование", title: "Kia Sorento — защита кузова", text: "Бронирование кузова автомобиля Kia Sorento." },
  { image: new URL("../assets/images/portfolio/f36c80712078ed5ca1ce65228e701b98b882b331ae9441a7036b338e62779802.jpg", import.meta.url).href, type: "Бронирование", title: "Mercedes GLS 400d — защита кузова", text: "Бронирование кузова автомобиля Mercedes GLS 400d." },
  { image: new URL("../assets/images/portfolio/66c9faaf6e1bae4279f4744709f6b84e9704eee35396645de8ebe1ee68666ea0.jpg", import.meta.url).href, type: "Бронирование", title: "Toyota Prado — защита кузова", text: "Бронирование кузова автомобиля Toyota Prado." },
  { image: new URL("../assets/images/portfolio/8bfc9a70f703dc3d73c4b6f620023c70a22a64e1b48d4aa3de5b8d49fe3e8b47.jpg", import.meta.url).href, type: "Стайлинг плёнкой", title: "Toyota RAV-4 — чёрная крыша HEXIS", text: "Стайлинг крыши чёрной плёнкой HEXIS для Toyota RAV-4." },
  { image: new URL("../assets/images/portfolio/800b60573d63e11f6cc7951a71807419d199ec994c56ce49c0ad4eb049d6024d.jpg", import.meta.url).href, type: "Защитное покрытие", title: "Tesla — покрытие AdVance", text: "Нанесение защитного покрытия для кузова AdVance на автомобиль Tesla." },
  { image: new URL("../assets/images/portfolio/060d71d9a58460ff432945512ae7acb4fe0c4084f2052d96cb8ec5aa0813e7c9.jpg", import.meta.url).href, type: "Защитное покрытие", title: "AdVance — защита кузова", text: "Нанесение защитного покрытия для кузова по технологии AdVance." },
  { image: new URL("../assets/images/portfolio/d92cd7473a1cf5344c429921e20b4ae153959d2ab69275714f02c97d0f855a3f.jpg", import.meta.url).href, type: "Бронирование плёнкой", title: "Бронирование передней части HEXIS", text: "Защита передней части кузова антигравийной плёнкой HEXIS." },
  { image: new URL("../assets/images/portfolio/cb42231a233b675dacc33fa230eaf0ee18c0ec01c00181154dfa1cdce9948633.jpg", import.meta.url).href, type: "Защитное покрытие", title: "AdVance — защитное покрытие кузова", text: "Нанесение защитного покрытия для кузова по технологии AdVance." },
  { image: new URL("../assets/images/portfolio/e3c0695b8c659cf2bc1729a50307f751c341e1fab3992cb3d5cb8e8bc067081d.jpg", import.meta.url).href, type: "Защитное покрытие", title: "AdVance — защита автомобиля", text: "Нанесение защитного покрытия для кузова по технологии AdVance." },
  { image: new URL("../assets/images/portfolio/0c19e039a9f8b201b663411f4e0c93d6a758508610858b12cc2523374bb57b2f.jpg", import.meta.url).href, type: "Бронирование плёнкой", title: "Защита передней части HEXIS", text: "Бронирование передней части кузова плёнкой HEXIS." },
  { image: new URL("../assets/images/portfolio/bc70bf4bbe99d67e3b222db414d9a3413540c91ef50a7103890d4ac82787b335.jpg", import.meta.url).href, type: "Бронирование и защита", title: "HEXIS и ClearPlex — комплексная защита", text: "Бронирование передней части кузова плёнкой HEXIS и лобового стекла плёнкой ClearPlex." },
  { image: new URL("../assets/images/portfolio/0625a61719fc5e9780f71465c5e18e941669283627b5b5c3bd24072488faebc6.jpg", import.meta.url).href, type: "Бронирование плёнкой", title: "Защита капота и крыльев", text: "Бронирование капота и крыльев автомобиля защитной плёнкой." },
  { image: new URL("../assets/images/portfolio/ce53466fb79b03601efba65e939271708f0f5bff07b51473c3957944abaa28d4.jpg", import.meta.url).href, type: "Бронирование и защита", title: "Бронирование капота и AdVance", text: "Бронирование капота плёнкой и нанесение защитного покрытия AdVance на кузов." },
  { image: new URL("../assets/images/portfolio/fcb956f826e24303810af4a323ee505b0aa7eac16d07eeb8b2def9b1bc5a0fa0.jpg", import.meta.url).href, type: "Бронирование плёнкой", title: "Полное бронирование HEXIS", text: "Бронирование кузова автомобиля плёнкой HEXIS." },
  { image: new URL("../assets/images/portfolio/0055b833544bd3550f1a90b3f038637a8d1b4a9a570018a5614231ed3ce1b0e9.jpg", import.meta.url).href, type: "Бронирование и защита", title: "Комплексная защита кузова и стёкол", text: "Защита капота, крыльев, фар, стоек, бамперов и передней части крыши; бронирование лобового стекла ClearPlex и покрытие кузова AdVance." },
  { image: new URL("../assets/images/portfolio/bf670c7abac755af4ae8389a60e8d9155bf6ba7a4e0b0dbad4cf4f7492b74809.jpg", import.meta.url).href, type: "Полный комплекс", title: "Toyota Camry — комплексная защита", text: "Бронирование капота плёнкой HEXIS, тонирование и защитное покрытие кузова AdVance." },
  { image: new URL("../assets/images/portfolio/b3506ebeac21ce70494c2dead57199858f6b942aeaab7836a4b32d7cf86b982e.jpg", import.meta.url).href, type: "Бронирование плёнкой", title: "Toyota RAV-4 — бронирование капота", text: "Бронирование капота плёнкой HEXIS на новом Toyota RAV-4." },
  { image: new URL("../assets/images/portfolio/4ae3160519ad9c8be5d0fcfccb6e34e7b4e75347e5847f0db78f445ac6c3948c.jpg", import.meta.url).href, type: "Бронирование плёнкой", title: "Toyota Fortuner — защита капота и фар", text: "Бронирование капота и фар плёнкой HEXIS для Toyota Fortuner." },
  { image: new URL("../assets/images/portfolio/fd19178423f242ab3e160a14836e831d495088ce0d8719f6d46ee9c7ff6031c5.jpg", import.meta.url).href, type: "Оклейка винилом", title: "Hyundai Santa Fe — рекламная оклейка", text: "Оклейка кузова виниловой плёнкой для рекламного оформления автомобиля Hyundai Santa Fe." },
  { image: new URL("../assets/images/portfolio/c8062d3ff75c11dbd475011ab459ebcfe06764fa722d252bcc9f0d787ed2fa64.jpg", import.meta.url).href, type: "Бронирование и уход", title: "Toyota Camry — полировка и химчистка", text: "Полировка кузова и бережная химчистка салона Toyota Camry." },
  { image: new URL("../assets/images/portfolio/0c99d17a8910ea3aed57ae56402f51e54ead9aa5d3ffe170aa243589d556f751.jpg", import.meta.url).href, type: "Бронирование и защита", title: "Hyundai Santa Fe — HEXIS и AdVance", text: "Бронирование капота плёнкой HEXIS и обработка кузова защитным покрытием AdVance." },
  { image: new URL("../assets/images/portfolio/47dc032495c996ea40bdc300d16d9e00f4d43730348d1603f4daacef85cd56df.jpg", import.meta.url).href, type: "Бронирование и защита", title: "Комплекс HEXIS, ClearPlex и AdVance", text: "Бронирование капота и бампера плёнкой HEXIS, лобового стекла ClearPlex и защитное покрытие AdVance." },
  { image: new URL("../assets/images/portfolio/46d1f36a60847620cb95c151fcb0b4316cf351f76babaad53f505969625fb015.jpg", import.meta.url).href, type: "Бронирование плёнкой", title: "BMW X7 — защита передней части", text: "Бронирование капота, бампера и фар плёнкой HEXIS." },
  { image: new URL("../assets/images/portfolio/d969d8fa5464d8042bf09c67dc3c6e68a9da70b171aba39c0a83f7b47581a06d.jpg", import.meta.url).href, type: "Бронирование плёнкой", title: "Mercedes SL — полная защита кузова", text: "Полное бронирование кузова, капота, зеркал, бампера и крыльев антигравийной плёнкой." },
  { image: new URL("../assets/images/portfolio/169d28f97e8b02d6bc8cf78e31ea90bf0c8faf421cc8b7c44615deeb6af01e18.jpg", import.meta.url).href, type: "Бронирование плёнкой", title: "Mercedes C450 — полная защита кузова", text: "Полное бронирование кузова, капота, зеркал, бампера и крыльев антигравийной плёнкой." },
  { image: new URL("../assets/images/portfolio/647dd21ead1bb5ba6461f0cb5c52377d4faf7a321e3fdafef8387369eb87549e.jpg", import.meta.url).href, type: "Бронирование плёнкой", title: "Mercedes C-Class — защита передней части", text: "Бронирование капота, бампера, передних крыльев и фар антигравийной плёнкой." },
  { image: new URL("../assets/images/portfolio/83008931745ae4897c8625163cd70eaa2da468410e63fa9111e600e0476d3e5a.jpg", import.meta.url).href, type: "Бронирование плёнкой", title: "Volkswagen Touareg — защита передней части", text: "Бронирование капота, бампера, передних крыльев и фар антигравийной плёнкой." },
  { image: new URL("../assets/images/portfolio/5a4ff6cda2d691434eaa1b6f93bcdbc0854f9b8e601f6c07b6ab7f2f2d651319.jpg", import.meta.url).href, type: "Бронирование плёнкой", title: "Audi Q7 — защита передней части", text: "Бронирование капота, бампера, передних крыльев и фар плёнкой." },
  { image: new URL("../assets/images/portfolio/7ac3006d7c31261881c25724685d1aeee4211bba1e11da918346b170fc2c79c2.jpg", import.meta.url).href, type: "Бронирование и AdVance", title: "Jeep Cherokee и Porsche Boxster — комплексная защита", text: "Бронирование капота, бампера и крыльев в сочетании с защитой кузова AdVance." },
  { image: new URL("../assets/images/portfolio/71461392b5f5e699e01e0b32f0b7f539e283a2f1365f342fdd5906b675b9dd56.jpg", import.meta.url).href, type: "Детейлинг и AdVance", title: "Toyota Land Cruiser 200 — комплексный детейлинг", text: "Полный детейлинг, полировка кузова и дисков, нанесение защитного покрытия AdVance." },
  { image: new URL("../assets/images/portfolio/3c1223c29a55871d4ed24a2b78515c096d1f7e8bc9737b5c13604df36340c6ba.jpg", import.meta.url).href, type: "Бронирование и AdVance", title: "Mercedes C450 — защита кузова", text: "Бронирование отдельных элементов и защитное покрытие кузова по технологии AdVance." },
  { image: new URL("../assets/images/portfolio/3837ffd66fe11fdb2a4e0f5c04afb22d0c35b31722fec43a2e04d5a1e9846bf5.jpg", import.meta.url).href, type: "Стайлинг винилом", title: "Volkswagen Polo — виниловый стайлинг", text: "Полный стайлинг кузова виниловой плёнкой." },
  { image: new URL("../assets/images/portfolio/39d2df69f0c46a53bb949fb9d04850264a5af7c1c8f315f1869a82c07733422c.jpg", import.meta.url).href, type: "Бронирование плёнкой", title: "Volkswagen Touareg — защита капота и бампера", text: "Бронирование капота и бампера автомобиля." },
  { image: new URL("../assets/images/portfolio/0fcede994e06190cb659c0bd80f574a4bef9771dd09d664a1a429ea84f48f32b.jpg", import.meta.url).href, type: "Стайлинг винилом", title: "Toyota IQ — индивидуальный дизайн", text: "Разработка дизайна и стайлинг кузова виниловой плёнкой." },
  { image: new URL("../assets/images/portfolio/1b68778cdc988824e4bc5f88cf3d5ab57fe4358ffa52f3a2e9c9cb53e37cea35.jpg", import.meta.url).href, type: "Защитное покрытие AdVance", title: "Mercedes G-Class — защита кузова", text: "Защита кузова по технологии AdVance." },
  { image: new URL("../assets/images/portfolio/87759269073dad0537555a4515cafa1e9061bafc182396d8eb97b82c82cb5fd7.jpg", import.meta.url).href, type: "Стайлинг винилом", title: "Такси Яндекс — оформление автопарка", text: "Стайлинг кузова виниловой плёнкой для автомобилей такси." },
  { image: new URL("../assets/images/portfolio/f6349d80cc394f2f0f6be9da57a4240cd05735a3d2492a7ad8c4f0dd1631405b.jpg", import.meta.url).href, type: "Бронирование и AdVance", title: "Mercedes ML500 — комплексная защита", text: "Бронирование капота и бампера в сочетании с защитой кузова AdVance." },
  { image: new URL("../assets/images/portfolio/bb1cc0d5bf34c80118b2dadd632e67f655c89012e6c976c0120cb2a5330e5e91.jpg", import.meta.url).href, type: "Бронирование плёнкой", title: "Mercedes GLS 500 — защита передней части", text: "Бронирование капота, крыльев и бампера." },
  { image: new URL("../assets/images/portfolio/e482fb4bae07d97f55fc0a00cbf9bf89ede980ba98bade3d55b4deedcef8bd97.jpg", import.meta.url).href, type: "Защитное покрытие AdVance", title: "Porsche Cayenne — защитное покрытие", text: "Защита кузова по технологии AdVance." },
  { image: new URL("../assets/images/portfolio/44d7f038ac56b6ebeafcfb2b4bfb02cb266fd760fb8f77e54d656b5623e2a9b4.jpg", import.meta.url).href, type: "Бронирование плёнкой", title: "Land Rover Discovery — защита кузова", text: "Бронирование капота, крыльев и передних дверей." },
  { image: new URL("../assets/images/portfolio/11cd07246cbe73e0dbacbd805c7677bd5da102d68ececb9202be69a6f78d53d9.jpg", import.meta.url).href, type: "Защитное покрытие AdVance", title: "Porsche Cayenne Turbo — AdVance", text: "Защита кузова по технологии AdVance." },
  { image: new URL("../assets/images/portfolio/76ecf4c853ebb81d75a0afc36c3db27094d00504eb48eeeef00b3fca445fb22f.jpg", import.meta.url).href, type: "Бронирование плёнкой", title: "Toyota Camry — защита передней части", text: "Бронирование капота, бампера и стоек." },
  { image: new URL("../assets/images/portfolio/018e394500a933220cfeaf32bf5bb694a215c92b0f81a12b912e91e62272a8d0.jpg", import.meta.url).href, type: "Бронирование плёнкой", title: "Lexus NX — защита кузова", text: "Бронирование капота, крыльев и бампера." },
  { image: new URL("../assets/images/portfolio/32e3304ab254964d3fdf7b9b7b5d26e72ed134e7e811bb522003ea5e24046fb4.jpg", import.meta.url).href, type: "Защитное покрытие AdVance", title: "Audi Q7 — защита кузова", text: "Защита кузова по технологии AdVance." },
  { image: new URL("../assets/images/portfolio/2e9e951b50e087f8acb392651bcf7e00ee314363078c95886e27ff0854528c8c.jpg", import.meta.url).href, type: "Бронирование и AdVance", title: "Porsche Macan — комплексная защита", text: "Бронирование капота и защитное покрытие AdVance." },
  { image: new URL("../assets/images/portfolio/027e2c441df524d9042d94db70867d1b720890fdcc9e62cf95dd4eefbe4d4c94.jpg", import.meta.url).href, type: "Бронирование плёнкой", title: "Mercedes GLS — защита передней части", text: "Бронирование капота и бампера." },
  { image: new URL("../assets/images/portfolio/e45270d0363953d11fcd4a5f28ef5d02569784c8c3f0e3529eede760ef798a01.jpg", import.meta.url).href, type: "Защитное покрытие AdVance", title: "Volvo XC70 — защита кузова", text: "Защита кузова по технологии AdVance." },
  { image: new URL("../assets/images/portfolio/993661b9b4960f11d1d665383c08b60091491c90ae16221a0b3e67742886680d.jpg", import.meta.url).href, type: "Бронирование плёнкой", title: "Mercedes C Coupe — полное бронирование", text: "Полное бронирование кузова антигравийной плёнкой." },
  { image: new URL("../assets/images/portfolio/24d21057fc683cbc58da0e94e5628060da8261f0758bd17bb46e23108989a638.jpg", import.meta.url).href, type: "Защитное покрытие AdVance", title: "Toyota RAV4 — защита кузова", text: "Защита кузова по технологии AdVance." },
  { image: new URL("../assets/images/portfolio/b07ab313fa12622258f6b4e104b8055387147efbcde98ba317a565937783e6cd.jpg", import.meta.url).href, type: "Предпродажная подготовка", title: "Toyota Prado — комплексная подготовка", text: "Химчистка салона и двигателя, восстановление элементов пластика." },
  { image: new URL("../assets/images/portfolio/c457cb3e6de9470c3d65cbba6fc0f7fc5c93fc884d92bc95a06efdb53797d732.jpg", import.meta.url).href, type: "Бронирование плёнкой", title: "Toyota RAV4 — защита передней части", text: "Бронирование капота, бампера и передних крыльев." },
  { image: new URL("../assets/images/portfolio/f89d87bc2972a69c4052fbe14601653e934a3537879f0f6be73b506a6b4f0d6c.jpg", import.meta.url).href, type: "Защитное покрытие AdVance", title: "Toyota Camry — покрытие AdVance", text: "Защита кузова по технологии AdVance." },
  { image: new URL("../assets/images/portfolio/bb671947718a84148f5133dbf648dedfb95c260fef629dcff8bd19b2f665cc14.jpg", import.meta.url).href, type: "Бронирование плёнкой", title: "Audi A5 — полное бронирование", text: "Полное бронирование кузова автомобиля." },
  { image: new URL("../assets/images/portfolio/010572b38d30fa6e84ebf255e7dede09e53347c4a759c5056a52c98a37bbe29c.jpg", import.meta.url).href, type: "Бронирование и защита", title: "Mercedes GL — бронирование элементов", text: "Бронирование капота, бампера и крыльев." },
  { image: new URL("../assets/images/portfolio/45c2e3bdc87b3ebc4e6709d966d99de9acd2e0373372e7532c7b272669d621f1.jpg", import.meta.url).href, type: "Бронирование плёнкой", title: "Jeep — защита передней части", text: "Бронирование капота, бампера и крыльев." },
  { image: new URL("../assets/images/portfolio/b63ad4c7c0556e030904f44d536445f614b09fd8fc2ec44bba8e74fb488c506a.jpg", import.meta.url).href, type: "Бронирование плёнкой", title: "Jeep — защита кузова", text: "Бронирование капота, бампера и крыльев." },
  { image: new URL("../assets/images/portfolio/4cc399c809dbd9d65e327885f2a04f3544a480a79dde0f1f827227531bd8bae9.jpg", import.meta.url).href, type: "Бронирование и AdVance", title: "BMW X6 — комплексная защита", text: "Бронирование капота и защитное покрытие кузова AdVance." },
  { image: new URL("../assets/images/portfolio/4f9cfbd5d64ca8fcd8472cf2855acaeb7ba307485656619a4e52ef8453996a55.jpg", import.meta.url).href, type: "Бронирование плёнкой", title: "Honda Accord — защита передней части", text: "Бронирование капота, бампера и крыльев." },
  { image: new URL("../assets/images/portfolio/1720cd5dfac0bd253338e0e16850d395b6afe373908b31008d1a0e42d159a891.jpg", import.meta.url).href, type: "Защитное покрытие AdVance", title: "Mercedes GL — покрытие AdVance", text: "Защита кузова по технологии AdVance." }
];
const services = [
  { title: "AdVance", subtitle: "Защитное покрытие кузова", text: "Уникальный блеск и защита вашего автомобиля. Покрытие помогает сохранить безупречный внешний вид.", price: "от 15 000 ₽", image: new URL("../assets/images/portfolio/89aa4c603c5fe509040b7999422cd307e8aea34d9ce8fcd7862940961bd39ffa.jpg", import.meta.url).href },
  { title: "Бронирование плёнкой", subtitle: "Защита кузова от сколов", text: "Полиуретановые плёнки Quantum Pro и SunTek помогают защитить лакокрасочное покрытие от сколов, царапин, дорожного мусора и насекомых.", price: "от 3 000 ₽", image: new URL("../assets/images/portfolio/71461392b5f5e699e01e0b32f0b7f539e283a2f1365f342fdd5906b675b9dd56.jpg", import.meta.url).href },
  { title: "BariGlass", subtitle: "Защита автомобильных стёкол", text: "Гидрофобная защита стёкол от грязи, дождя, пыли и снега.", price: "от 1 000 ₽", image: new URL("../assets/images/portfolio/9b030b9709366cc66251118718cfbfd2ca25d34eabdfee90842ce602aee57b35.jpg", import.meta.url).href },
  { title: "BariTools", subtitle: "Защита салона автомобиля", text: "Защитное покрытие на основе оксида кремния для материалов интерьера.", price: "от 9 000 ₽", image: new URL("../assets/images/portfolio/73b239e1305c79983656d7ede9857eb88ab3d3272fd164e798a9e8d47534ebd0.jpg", import.meta.url).href },
  { title: "Предпродажная подготовка", subtitle: "Подготовка автомобиля к продаже", text: "Комплексная подготовка, чтобы автомобиль выглядел ухоженно и производил правильное впечатление.", price: "от 7 000 ₽", image: new URL("../assets/images/portfolio/dadba623d0da72b327c555ca1c93cb728c5d8d9e41a69066e077bb578ed79034.jpg", import.meta.url).href }
];
const videos = [1, 2, 3, 4];
const localVideo = new URL("../assets/video/studio.mp4", import.meta.url).href;
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
  ["Все услуги и технологии", "/tehnology"], ["Наши работы", "/foto"], ["Видео", "/video"], ["Отзывы", "/reviews"]
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
      <label><input type="checkbox" name="contact_method" value="phone" checked><span class="contact-option-icon contact-option-phone" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M5 3.8 8.2 3l2.1 5.1-2.1 1.7a15 15 0 0 0 6 6l1.7-2.1 5.1 2.1-.8 3.2a2 2 0 0 1-2.2 1.5A17 17 0 0 1 3.5 6a2 2 0 0 1 1.5-2.2Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span>По телефону</span></label>
      <label><input type="checkbox" name="contact_method" value="max"><span class="contact-option-icon contact-option-max" aria-hidden="true">M</span><span>MAX</span></label>
      <label><input type="checkbox" name="contact_method" value="telegram"><span class="contact-option-icon contact-option-telegram" aria-hidden="true"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M21.7 4.4 18.5 20c-.2 1.1-.9 1.4-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.2L6 13.5l-4.9-1.6c-1.1-.3-1.1-1.1.2-1.6L20.4 3c.9-.3 1.7.2 1.3 1.4Z"/></svg></span><span>Telegram</span></label>
      <label><input type="checkbox" name="contact_method" value="other" data-contact-other-toggle><span>Другой способ</span></label>
    </div>
    <div class="contact-other-details" hidden>
      <label>Укажите e-mail, мессенджер или другой способ связи
        <input type="text" name="contact_other" placeholder="Например: name@mail.ru или Signal">
      </label>
    </div>
  </fieldset>`;
const callback = () => `
  <div class="modal" id="callback-modal" aria-hidden="true"><div class="modal-backdrop js-close"></div><section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button class="modal-close js-close" aria-label="Закрыть">×</button><div class="callback-modal-heading"><img src="${contactWidgetImage}" alt=""><span class="eyebrow">BARIBAL · ПЕРМЬ</span></div><h2 id="modal-title">Мы вам перезвоним</h2><p id="callback-context">Оставьте номер — обсудим задачу и подберём решение для вашего автомобиля.</p><form class="lead-form demo-form"><input type="hidden" name="service" id="callback-service" value=""><label>Ваше имя<input name="name" placeholder="Как к вам обращаться" /></label><label>Телефон<input name="phone" type="tel" placeholder="+7 (___) ___-__-__" required /></label>${contactPreferences()}<button class="button" type="submit">Заказать консультацию</button><output></output></form></section></div>`;
const demoWorkGalleries = [
  [new URL("../assets/images/portfolio/558905d76ecd9119f333da37f74c2034cfae158253a32f631c2c16cc85eba03d.jpg", import.meta.url).href,new URL("../assets/images/portfolio/373fc89cebe2f66cde3be34be69fb7020db6ccb03af57f5b93d64ae9edfc7e4d.jpg", import.meta.url).href,new URL("../assets/images/portfolio/f36c80712078ed5ca1ce65228e701b98b882b331ae9441a7036b338e62779802.jpg", import.meta.url).href,new URL("../assets/images/portfolio/66c9faaf6e1bae4279f4744709f6b84e9704eee35396645de8ebe1ee68666ea0.jpg", import.meta.url).href,new URL("../assets/images/portfolio/8bfc9a70f703dc3d73c4b6f620023c70a22a64e1b48d4aa3de5b8d49fe3e8b47.jpg", import.meta.url).href],
  [new URL("../assets/images/portfolio/edb1f571acdac6f0a9bc76b7bdcff548467bed7c317eac3fbbbbe6e41cd3430c.jpg", import.meta.url).href,new URL("../assets/images/portfolio/800b60573d63e11f6cc7951a71807419d199ec994c56ce49c0ad4eb049d6024d.jpg", import.meta.url).href,new URL("../assets/images/portfolio/060d71d9a58460ff432945512ae7acb4fe0c4084f2052d96cb8ec5aa0813e7c9.jpg", import.meta.url).href,new URL("../assets/images/portfolio/d92cd7473a1cf5344c429921e20b4ae153959d2ab69275714f02c97d0f855a3f.jpg", import.meta.url).href,new URL("../assets/images/portfolio/cb42231a233b675dacc33fa230eaf0ee18c0ec01c00181154dfa1cdce9948633.jpg", import.meta.url).href],
  [new URL("../assets/images/portfolio/89aa4c603c5fe509040b7999422cd307e8aea34d9ce8fcd7862940961bd39ffa.jpg", import.meta.url).href,new URL("../assets/images/portfolio/018e394500a933220cfeaf32bf5bb694a215c92b0f81a12b912e91e62272a8d0.jpg", import.meta.url).href,new URL("../assets/images/portfolio/32e3304ab254964d3fdf7b9b7b5d26e72ed134e7e811bb522003ea5e24046fb4.jpg", import.meta.url).href,new URL("../assets/images/portfolio/2e9e951b50e087f8acb392651bcf7e00ee314363078c95886e27ff0854528c8c.jpg", import.meta.url).href,new URL("../assets/images/portfolio/027e2c441df524d9042d94db70867d1b720890fdcc9e62cf95dd4eefbe4d4c94.jpg", import.meta.url).href],
  [new URL("../assets/images/portfolio/73b239e1305c79983656d7ede9857eb88ab3d3272fd164e798a9e8d47534ebd0.jpg", import.meta.url).href,new URL("../assets/images/portfolio/b07ab313fa12622258f6b4e104b8055387147efbcde98ba317a565937783e6cd.jpg", import.meta.url).href],
  [new URL("../assets/images/portfolio/8bfc9a70f703dc3d73c4b6f620023c70a22a64e1b48d4aa3de5b8d49fe3e8b47.jpg", import.meta.url).href,new URL("../assets/images/portfolio/fd19178423f242ab3e160a14836e831d495088ce0d8719f6d46ee9c7ff6031c5.jpg", import.meta.url).href,new URL("../assets/images/portfolio/3837ffd66fe11fdb2a4e0f5c04afb22d0c35b31722fec43a2e04d5a1e9846bf5.jpg", import.meta.url).href,new URL("../assets/images/portfolio/0fcede994e06190cb659c0bd80f574a4bef9771dd09d664a1a429ea84f48f32b.jpg", import.meta.url).href,new URL("../assets/images/portfolio/87759269073dad0537555a4515cafa1e9061bafc182396d8eb97b82c82cb5fd7.jpg", import.meta.url).href]
];
const workGalleryModal = (label = "ТЕСТОВАЯ ПОДБОРКА · ФОТО ЗАМЕНИМ") => `<div class="work-gallery-modal" id="work-gallery-modal" aria-hidden="true"><button class="work-gallery-backdrop" type="button" data-gallery-close aria-label="Закрыть галерею"></button><section class="work-gallery-dialog" role="dialog" aria-modal="true" aria-label="Фотогалерея выполненной работы"><button class="work-gallery-close" type="button" data-gallery-close aria-label="Закрыть">×</button><span class="work-gallery-demo-label">${label}</span><h2 class="work-gallery-title"></h2><div class="work-gallery-stage"><button class="work-gallery-arrow prev" type="button" data-gallery-prev aria-label="Предыдущее фото">‹</button><img class="work-gallery-image" alt="" /><button class="work-gallery-arrow next" type="button" data-gallery-next aria-label="Следующее фото">›</button></div><div class="work-gallery-footer"><span class="work-gallery-counter"></span><div class="work-gallery-dots"></div></div></section></div>`;
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
  return `<article class="work-card portfolio-card${index >= 9 ? " is-extra" : ""}" data-categories="${categories.join("|")}"><div class="work-image"><img src="${item.image}" alt="${item.title}" loading="lazy" /></div><div class="work-copy"><span class="eyebrow">${item.type}</span><h3>${item.title}</h3><p>${item.text}</p><div class="work-actions"><button class="text-link js-service-info" type="button" data-service-title="${serviceTitle}">Подробнее <span>↗</span></button><a class="text-link js-callback" href="#callback" data-service-title="${serviceTitle}">Хочу так же <span>↗</span></a><button class="text-link js-open-work-gallery" type="button" data-portfolio-gallery-index="${index}">Все фото <span>↗</span></button></div></div></article>`;
}).join("");
const serviceCards = () => services.map((item, i) => `<article class="service-card"><div class="service-image"><img src="${item.image}" alt="" loading="lazy" /></div><div class="service-copy"><span class="eyebrow">0${i + 1} / УСЛУГА</span><h3>${item.title}</h3><h4>${item.subtitle}</h4><p>${item.text}</p><div class="service-bottom"><b>${item.price}</b><button class="text-link js-callback">Узнать больше <span>↗</span></button></div></div></article>`).join("");
const estimateSection = (showSelectedSummary = false) => `<section class="estimate"><div class="wrap estimate-inner"><div class="estimate-intro"><span class="eyebrow">ИНДИВИДУАЛЬНЫЙ ПОДХОД</span><h2>Рассчитаем стоимость<br /><em>защиты вашего автомобиля</em></h2><p>Расскажите, что хотите защитить. Мы свяжемся с вами и сориентируем по стоимости.</p></div><div class="estimate-services"><span class="estimate-services-title">Выберите услуги</span><label class="estimate-service-option"><input type="checkbox" name="requestedServices" value="AdVance — защитное покрытие кузова" /><span>AdVance — защитное покрытие кузова</span></label><label class="estimate-service-option"><input type="checkbox" name="requestedServices" value="Бронирование автомобиля плёнкой" /><span>Бронирование автомобиля плёнкой</span></label><label class="estimate-service-option"><input type="checkbox" name="requestedServices" value="BariGlass — защита стёкол авто" /><span>BariGlass — защита стёкол авто</span></label><label class="estimate-service-option"><input type="checkbox" name="requestedServices" value="BariTools — обработка салона авто" /><span>BariTools — обработка салона авто</span></label><label class="estimate-service-option"><input type="checkbox" name="requestedServices" value="Химчистка салона автомобиля" /><span>Химчистка салона автомобиля</span></label><label class="estimate-service-option"><input type="checkbox" name="requestedServices" value="Удаление вмятин без покраски" /><span>Удаление вмятин без покраски</span></label><label class="estimate-service-option"><input type="checkbox" name="requestedServices" value="Шумо-вибро-теплоизоляция" /><span>Шумо-вибро-теплоизоляция</span></label><label class="estimate-service-option"><input type="checkbox" name="requestedServices" value="Тонирование стёкол" /><span>Тонирование стёкол</span></label><label class="estimate-service-option"><input type="checkbox" name="requestedServices" value="Предпродажная подготовка автомобиля" /><span>Предпродажная подготовка автомобиля</span></label><label class="estimate-service-option"><input type="checkbox" name="requestedServices" value="Ручная полировка" /><span>Ручная полировка</span></label><label class="estimate-service-option"><input type="checkbox" name="requestedServices" value="Автовинил — стайлинг плёнкой" /><span>Автовинил — стайлинг плёнкой</span></label><label class="estimate-service-option"><input type="checkbox" name="requestedServices" value="Ремонт сидений автомобиля" /><span>Ремонт сидений автомобиля</span></label><label class="estimate-service-option"><input type="checkbox" name="requestedServices" value="Бронирование лобового стекла Quantum Anti-Skol" /><span>Бронирование лобового стекла Quantum Anti-Skol</span></label><label class="estimate-service-option"><input type="checkbox" name="requestedServices" value="Полировка и защитная обработка фар" /><span>Полировка и защитная обработка фар</span></label><label class="estimate-service-option"><input type="checkbox" name="requestedServices" value="Профессиональная химчистка двигателя" /><span>Профессиональная химчистка двигателя</span></label></div><form class="estimate-form demo-form"><label>Ваш автомобиль<input name="car" placeholder="Марка и модель" /></label>${showSelectedSummary ? `<div class="estimate-selected"><div class="estimate-selected-heading"><span>Выбранные услуги</span><b data-selected-count>0</b></div><ul class="estimate-selected-list" data-selected-services><li class="estimate-selected-empty">Пока ничего не выбрано</li></ul><input type="hidden" name="selected_services" data-selected-value value=""></div>` : `<label>Что вас интересует<select name="service"><option>Защита кузова</option><option>Автохимчистка</option><option>Автовинил</option><option>Защита стёкол</option><option>Другое</option></select></label>`}<label>Телефон<input name="phone" type="tel" placeholder="+7 (___) ___-__-__" required /></label>${contactPreferences()}<button class="button" type="submit">Отправить на расчёт <span>↗</span></button><output></output></form></div></section>`;

const homePage = () => `
  <main>
    <section class="hero"><div class="hero-shade"></div><div class="hero-test-controls"><div class="hero-design-control"><button class="hero-design-toggle" type="button" aria-label="Переключить оформление сайта">Сменить дизайн</button><span class="hero-design-name" aria-live="polite">Основной</span></div></div><div class="wrap hero-content"><span class="eyebrow">BARIBAL · СТУДИЯ ЗАЩИТНЫХ ТЕХНОЛОГИЙ</span><h1>Современные технологии<br /><em>защиты автомобиля</em><br />в Перми</h1><p>Профессиональный уход, защита кузова и интерьера<br class="desktop-only" /> с гарантией от 12 до 72 месяцев</p><div class="hero-actions"><button class="button js-callback">Записаться на обслуживание <span>↗</span></button><a class="button button-outline" href="#works">Наши работы</a></div><div class="hero-index"><img src="${logo}" alt="BARIBAL" /><span>ЗАЩИТА · УХОД · СТИЛЬ</span></div></div></section>
    <section class="section works-section" id="works"><div class="wrap"><div class="section-heading"><div><span class="eyebrow">ПОРТФОЛИО</span><h2>Последние выполненные<br /><em>нами работы</em></h2></div><a class="text-link" href="#callback">Обсудить проект <span>↗</span></a></div><div class="work-grid">${workCards()}</div>${workGalleryModal()}<div class="center-action"><button class="button button-dark js-callback">Хочу такой же результат</button></div></div></section>
    ${estimateSection()}
    <section class="section services-section" id="services"><div class="wrap"><div class="section-heading"><div><span class="eyebrow">ЧТО МЫ ДЕЛАЕМ</span><h2>Услуги студии <em>BARIBAL</em></h2></div><p>Технологичные решения для сохранения внешнего вида и ценности вашего автомобиля.</p></div><div class="service-grid">${serviceCards()}</div></div></section>

    <section class="section studio-section" id="studio"><div class="wrap"><div class="section-heading"><div><span class="eyebrow">МЫ РАБОТАЕМ В ПЕРМИ</span><h2>Наша <em>студия</em></h2></div><p>Приезжайте познакомиться, обсудить задачу и выбрать подходящее решение для автомобиля.</p></div><div class="studio-gallery"><div class="studio-address-card"><span class="eyebrow">ЖДЁМ ВАС В ГОСТИ</span><h3>BARIBAL<br><em>STUDIO</em></h3><p>Пермь, ул. Героев Хасана, 105Э</p><span class="studio-address-note">За ТЦ «Шоколад», в районе Велты</span></div><figure class="studio-photo studio-photo-main"><img src="${new URL("../assets/images/studio/760f52fe35ff8702c47501873ce0d7363d54895d149d5983acab9af632d1d8f7.jpg", import.meta.url).href}" alt="Здание студии BARIBAL" loading="lazy"><figcaption>Студия BARIBAL · Пермь</figcaption></figure><figure class="studio-photo studio-photo-full"><img src="${new URL("../assets/images/studio/1bf56e15d4c43e2ba929054311d110f13977539498f271979101044a2ff78c65.jpg", import.meta.url).href}" alt="Въезд в студию BARIBAL" loading="lazy"><figcaption>Въезд в студию</figcaption></figure><figure class="studio-photo studio-photo-full"><img src="${new URL("../assets/images/studio/a28375f952d247ef3101e3722439b46b3de14b9c91487f876babea2ef3452db0.jpg", import.meta.url).href}" alt="Фасад студии BARIBAL на улице Героев Хасана" loading="lazy"><figcaption>Фасад студии</figcaption></figure><div class="studio-map studio-map-card"><div class="studio-map-heading"><span class="eyebrow">КАК НАС НАЙТИ</span><h3>Мы на <em>карте</em></h3></div><div class="studio-map-frame"><iframe title="Расположение студии BARIBAL на Яндекс Картах" src="https://yandex.ru/map-widget/v1/?text=Пермь%2C%20ул.%20Героев%20Хасана%2C%20105%D0%AD&z=16" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div><div class="studio-map-address"><span class="eyebrow">ЖДЁМ ВАС В ГОСТИ</span><p><strong>Пермь, ул. Героев Хасана, 105Э</strong><br>за ТЦ «Шоколад», в районе Велты</p></div><a class="button button-small studio-map-link" href="https://yandex.ru/maps/?text=Пермь%2C%20ул.%20Героев%20Хасана%2C%20105%D0%AD" target="_blank" rel="noopener">Построить маршрут ↗</a></div></div></section>
    <section class="section partners-section" id="partners"><div class="wrap"><div class="section-heading"><div><span class="eyebrow">НАМ ДОВЕРЯЮТ</span><h2>Клиенты и <em>партнёры</em></h2></div></div><div class="partner-grid"><div class="partner-logo"><img src="${new URL("../assets/images/partners/655f4241637cbf07876d259486260802893bb5cecdcedff158e537f1eab20f1d.jpg", import.meta.url).href}" alt="Логотип партнёра 1" loading="lazy"></div><div class="partner-logo"><img src="${new URL("../assets/images/partners/c5e22a1f2be817e9eee92001706926f28932d7c22f8f7d03ee348bf77cf87bae.jpg", import.meta.url).href}" alt="Логотип партнёра 2" loading="lazy"></div><div class="partner-logo"><img src="${new URL("../assets/images/partners/15f64374fbc34fceedd5c9629ec37657374eff833b10164289eee2d0fa324277.jpg", import.meta.url).href}" alt="Логотип партнёра 3" loading="lazy"></div><div class="partner-logo"><img src="${new URL("../assets/images/partners/37e98ad04c6042908f513aa4b99aa616842fa7addaec4634fc9a05876ceb83b1.jpg", import.meta.url).href}" alt="Логотип партнёра 4" loading="lazy"></div><div class="partner-logo"><img src="${new URL("../assets/images/partners/b57925d8ecfff61a0372effd96d5bbcb5a6048fe9ee37c4dda0df00387a4da53.jpg", import.meta.url).href}" alt="Логотип партнёра 5" loading="lazy"></div><div class="partner-logo"><img src="${new URL("../assets/images/partners/3850c35cd253db0588cf4027f4896da41fd6b842f24b6360407bc913f0b168cd.jpg", import.meta.url).href}" alt="Логотип партнёра 6" loading="lazy"></div><div class="partner-logo"><img src="${new URL("../assets/images/partners/d4e3d6dfc303c496a8c05217360b7753766fbd9580173d4efaf4b32b09ad9641.jpg", import.meta.url).href}" alt="Логотип партнёра 7" loading="lazy"></div><div class="partner-logo"><img src="${new URL("../assets/images/partners/f5a7ef16a3f09c54b5f3223b235da34538d224ddfad89063cea3b486be1e5ac4.jpg", import.meta.url).href}" alt="Логотип партнёра 8" loading="lazy"></div><div class="partner-logo"><img src="${new URL("../assets/images/partners/8d3654414bf3b71ab8c3c676d51ce4175b0db2e08da82a1a49ab9ec6ce8f6c53.jpg", import.meta.url).href}" alt="Логотип партнёра 9" loading="lazy"></div><div class="partner-logo"><img src="${new URL("../assets/images/partners/7d1bfc0b86a53ca3a35f59392ae2a254a96188358cb24eaf4b3996587d9f3ac4.jpg", import.meta.url).href}" alt="Логотип партнёра 10" loading="lazy"></div><div class="partner-logo"><img src="${new URL("../assets/images/partners/6110b5a32e0880f127ba342fe60ae49ad7dc83f8b4e36ba6a119fc1cf69fe61c.jpg", import.meta.url).href}" alt="Логотип партнёра 11" loading="lazy"></div></div></div></section>
    <section class="video-teaser"><div class="wrap video-teaser-inner"><div><span class="eyebrow">ЗНАКОМСТВО СО СТУДИЕЙ</span><h2>Посмотрите,<br /><em>как мы работаем</em></h2><p>Процессы, технологии и результаты в видео.</p><a class="button" href="/video">Смотреть видео <span>↗</span></a></div><div class="video-preview">${videoPlayer(work[0].image, "BARIBAL — процесс работы")}</div></div></section>
    <section class="contact-strip"><div class="wrap contact-strip-inner"><div><span class="eyebrow">ЖДЁМ ВАС В СТУДИИ</span><h2>Ваш автомобиль<br /><em>в надёжных руках</em></h2></div><div><p>Пермь, ул. Героев Хасана, 105Э</p><a href="tel:+73422024142">+7 (342) 202-41-42</a></div><button class="button js-callback">Записаться <span>↗</span></button></div></section>
  </main>`;
const videoPage = () => `
  <main><section class="page-hero"><div class="wrap"><span class="eyebrow">BARIBAL · ВИДЕО</span><h1>Наши <em>видео</em></h1><p>Знакомьтесь с технологиями, процессами и результатами нашей работы.</p></div></section><section class="section video-section"><div class="wrap"><div class="video-grid">${videos.map((id, i) => `<article class="video-card"><div class="video-frame">${videoPlayer(portfolio[i].image, `BARIBAL — тестовое видео ${i + 1}`)}</div><div class="video-label"><span>0${i + 1}</span><h3>Видео ${i + 1}</h3></div></article>`).join("")}</div></div></section></main>`;

const basePath = "/baribal";
const contactWidgetImage = new URL("../foto/foto.png", import.meta.url).href;
const cleanPath = location.pathname.startsWith(basePath) ? location.pathname.slice(basePath.length) : location.pathname;
const path = cleanPath.replace(/\/$/, "") || "/";
const pageTitles = {
  "/": "Детейлинг и защита автомобилей в Перми — BARIBAL",
  "/video": "Видео работ и технологий защиты автомобилей — BARIBAL",
  "/tehnology": "Услуги и технологии защиты автомобилей в Перми — BARIBAL",
  "/kuzov": "Бронирование кузова автомобиля плёнкой в Перми — BARIBAL",
  "/himchistka": "Химчистка салона автомобиля в Перми — BARIBAL",
  "/avtovinil": "Оклейка автомобилей винилом в Перми — BARIBAL",
  "/foto": "Портфолио работ по защите и детейлингу автомобилей — BARIBAL",
  "/reviews": "Отзывы клиентов студии BARIBAL в Перми",
  "/politika-konfidencialnosti": "Политика конфиденциальности — BARIBAL"
};
document.title = pageTitles[path] || pageTitles["/"];
const pageHero = (eyebrow, title, intro = "") => `<section class="page-hero"><div class="wrap"><span class="eyebrow">${eyebrow}</span><h1>${title}</h1>${intro ? `<p>${intro}</p>` : ""}</div></section>`;
const contentPage = (eyebrow, title, intro, body) => `<main>${pageHero(eyebrow,title,intro)}<section class="section"><div class="wrap">${body}</div></section></main>`;
const galleryPage = () => contentPage("ПОРТФОЛИО BARIBAL","Наши <em>работы</em>","Выберите интересующее направление — покажем проекты с подходящими видами работ.",`<div class="portfolio-filters" role="group" aria-label="Фильтр работ"><button class="portfolio-filter is-active" type="button" data-filter="Все работы" aria-pressed="true">Все работы</button><button class="portfolio-filter" type="button" data-filter="Защита кузова" aria-pressed="false">Защита кузова</button><button class="portfolio-filter" type="button" data-filter="Защита стёкол" aria-pressed="false">Защита стёкол</button><button class="portfolio-filter" type="button" data-filter="Оклейка и стайлинг" aria-pressed="false">Оклейка и стайлинг</button><button class="portfolio-filter" type="button" data-filter="Детейлинг и уход" aria-pressed="false">Детейлинг и уход</button></div><div class="work-grid" id="portfolio-grid">${portfolioCards()}</div>${workGalleryModal("ФОТОГАЛЕРЕЯ BARIBAL")}<div class="center-action portfolio-more-wrap"><button class="button button-dark" id="portfolio-more" type="button" aria-expanded="false">Показать все работы</button></div><div class="center-action"><button class="button js-callback">Обсудить ваш автомобиль</button></div>`);
const allServices = [
  { title: "AdVance", subtitle: "Защитное покрытие кузова", text: "Защитное покрытие для выразительного блеска и сохранения внешнего вида автомобиля. Гарантия на покрытие — 3 года.", price: "от 15 000 ₽", image: new URL("../assets/images/portfolio/89aa4c603c5fe509040b7999422cd307e8aea34d9ce8fcd7862940961bd39ffa.jpg", import.meta.url).href},
  { title: "Бронирование кузова плёнкой", subtitle: "Quantum Pro и SunTek", text: "Защитная плёнка помогает уберечь лакокрасочное покрытие от мелкого щебня, дорожного мусора и насекомых.", price: "от 3 000 ₽", image: new URL("../assets/images/portfolio/71461392b5f5e699e01e0b32f0b7f539e283a2f1365f342fdd5906b675b9dd56.jpg", import.meta.url).href},
  { title: "BariGlass", subtitle: "Защита автомобильных стёкол", text: "Гидрофобная обработка стёкол для защиты от грязи, дождя, пыли и снега. Технология на основе SiO₂ обеспечивает прочное сцепление покрытия со стеклом.", price: "от 1 000 ₽", image: new URL("../assets/images/portfolio/9b030b9709366cc66251118718cfbfd2ca25d34eabdfee90842ce602aee57b35.jpg", import.meta.url).href},
  { title: "BariTools", subtitle: "Защита материалов салона", text: "Защитное покрытие на основе оксида кремния для ухода за различными материалами интерьера автомобиля.", price: "от 9 000 ₽", image: new URL("../assets/images/portfolio/73b239e1305c79983656d7ede9857eb88ab3d3272fd164e798a9e8d47534ebd0.jpg", import.meta.url).href},
  { title: "Химчистка салона", subtitle: "Глубокая очистка интерьера", text: "Очистка потолка, напольного покрытия и сидений, удаление пыли из труднодоступных мест, уход за пластиковыми деталями с антистатическим эффектом.", price: "от 2 000 ₽", image: new URL("../assets/images/services/aacf7314a82989f550f3c7e6f41fbde6b9c3ddec452db2bf3a541af2464c105a.png", import.meta.url).href},
  { title: "Удаление вмятин без покраски", subtitle: "Технология PDR", text: "Беспокрасочное удаление вмятин с сохранением заводского лакокрасочного покрытия, если характер повреждения это позволяет.", price: "от 500 ₽", image: new URL("../assets/images/services/28b4ff3f89ade1068c8a50912cb74951a7decda038f9f55bf1f774059b489438.jpg", import.meta.url).href},
  { title: "Шумо-вибро-теплоизоляция", subtitle: "Комфорт в салоне автомобиля", text: "Изоляция автомобиля комплексно или отдельными узлами. Стоимость зависит от выбранных материалов и объёма работ.", price: "от 30 000 ₽", image: new URL("../assets/images/services/9c37cbc1e811cb4845bc4d62c19068dc7d01371b90809f304891d12f741521f7.jpg", import.meta.url).href},
  { title: "Тонирование стёкол", subtitle: "Комфорт и внешний вид", text: "Профессиональное тонирование автомобильных стёкол с подбором решения под автомобиль и пожелания владельца.", price: "от 2 500 ₽", image: new URL("../assets/images/services/e64894dea72df5073ae1639aaac0bd1614dc50583d0732e4b00fe3285f5a9e51.jpg", import.meta.url).href},
  { title: "Предпродажная подготовка", subtitle: "Подготовка автомобиля к продаже", text: "Комплекс работ по улучшению внешнего вида и состояния автомобиля перед продажей.", price: "от 7 000 ₽", image: new URL("../assets/images/portfolio/dadba623d0da72b327c555ca1c93cb728c5d8d9e41a69066e077bb578ed79034.jpg", import.meta.url).href},
  { title: "Ручная полировка", subtitle: "Бережный уход за поверхностями", text: "Полировка с использованием мягких аппликаторов и микрофибры для деликатной обработки лакокрасочного покрытия и других поверхностей.", price: "от 5 000 ₽", image: new URL("../assets/images/services/e383a1af2d8957c76c8a4537ba46dd919d75be0fc9c9f2525beef02ffc6b4e34.jpg", import.meta.url).href},
  { title: "Автовинил", subtitle: "Стайлинг и оклейка плёнкой", text: "Оклейка поверхностей любой сложности: защитная, рекламная и стайлинговая. Гарантия на выполненные работы — 1 год.", price: "от 15 000 ₽", image: new URL("../assets/images/services/5d35a9de831d240de2be6bf8ee9189ea1aed746ba3f5c81b9ffd2a320f2fe404.jpg", import.meta.url).href},
    { title: "Ремонт сидений", subtitle: "Восстановление обивки", text: "Ремонт повреждений и восстановление внешнего вида автомобильных сидений.", price: "от 3 000 ₽", image: new URL("../assets/images/services/4d3758fc8097dd00e83c86d0bff76650b92b406ca36ee0629cb7ab80f7207329.jpg", import.meta.url).href},
    { title: "Бронирование лобового стекла Quantum Anti-Skol", subtitle: "Прозрачная защита от сколов и царапин", text: "Защитная плёнка Quantum Anti-Skol принимает на себя часть ударных и абразивных воздействий, помогая снизить риск сколов и царапин на лобовом стекле. Отличается высокой прозрачностью, минимальной выраженностью фактуры и гидрофобным эффектом.", price: "от 8 000 ₽", image: new URL("../assets/images/services/ea576f2ff3542a25c7656c8f0f57c2dfc66d516a065c16d8e4cdb6eb94410049.jpg", import.meta.url).href},
  { title: "Полировка и защита фар", subtitle: "Восстановление прозрачности оптики", text: "Полировка специальными пастами помогает вернуть фарам первоначальный блеск. Можно дополнить защитной обработкой.", price: "3 000 ₽", image: new URL("../assets/images/services/e383a1af2d8957c76c8a4537ba46dd919d75be0fc9c9f2525beef02ffc6b4e34.jpg", import.meta.url).href},
  { title: "Химчистка двигателя", subtitle: "Профессиональный уход под капотом", text: "Очистка двигателя с применением специальных средств и с учётом особенностей подкапотного пространства.", price: "1 500 ₽", image: new URL("../assets/images/services/caabd32f8a60ddd7165dd167da2db564ee9647349bcff292b79ea0a7b374643e.jpg", import.meta.url).href}
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
    benefits: ["Quantum Pro: самовосстанавливающийся верхний слой помогает устранять мелкие поверхностные царапины", "Гидрофобные свойства облегчают уход и помогают воде быстрее скатываться с поверхности", "Повышенная стойкость к загрязнениям и воздействию автохимии", "Высокая прозрачность помогает сохранить исходный вид лакокрасочного покрытия", "SunTek: у отдельных серий есть самовосстанавливающийся слой и повышенная стойкость к пятнам и дорожным загрязнениям"],
    tech: "Для оклейки кузова предлагаем полиуретановые плёнки Quantum Pro и SunTek. Quantum Pro отличается прозрачностью, гидрофобными свойствами, устойчивостью к загрязнениям и химическим воздействиям; её верхний слой помогает восстанавливать мелкие поверхностные царапины. У отдельных серий SunTek также есть самовосстанавливающийся верхний слой, стойкость к загрязнениям и высокая оптическая прозрачность. По желанию заказчика можем использовать другую плёнку выбранного бренда — предварительно согласовав конкретный материал и его характеристики.",
    fit: "Тем, кто хочет снизить риск появления сколов и царапин на кузове, особенно при частых поездках по трассе и дорогам с гравийным покрытием. Плёнка поможет защитить наиболее уязвимые зоны автомобиля и сохранить заводское лакокрасочное покрытие."
  },
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
  "Ремонт сидений": {
    lead: "Ремонт сидений помогает вернуть обивке аккуратный вид и комфорт, не прибегая к полной замене кресла, если повреждение локальное.",
    story: "Наиболее заметный износ появляется на боковых валиках, подушке и участках постоянного контакта. В зависимости от материала и состояния обивки можно выполнить локальное восстановление, ремонт швов или другие подходящие работы. Задача — аккуратно вписать отремонтированный участок в общий вид салона.",
    benefits: ["Восстановление локальных повреждений и следов износа", "Более опрятный вид водительского и пассажирских сидений", "Подбор способа ремонта под кожу, экокожу или ткань", "Возможность продлить срок службы оригинальной обивки"],
    tech: "Технология и визуальное совпадение зависят от материала, оттенка, фактуры и степени повреждения. Иногда для качественного результата требуется ремонт или замена большей зоны — это обсуждается заранее.",
    fit: "Тем, у кого появились трещины, потёртости, разрывы или другие локальные дефекты обивки сидений."
  },
  "Бронирование лобового стекла Quantum Anti-Skol": {
    lead: "Quantum Anti-Skol — прозрачная защитная плёнка для лобового стекла, которая принимает на себя часть повседневных дорожных воздействий и помогает снизить риск сколов и царапин.",
    story: "Песок, мелкие камни и дорожный мусор могут повредить лобовое стекло. Quantum Anti-Skol образует на его внешней поверхности дополнительный защитный слой, который принимает часть ударных и абразивных воздействий. Плёнка рассчитана на сохранение хорошей оптической видимости и практически незаметна при аккуратной установке.",
    benefits: ["Дополнительный защитный слой помогает снизить риск сколов и повреждений от камней и дорожного абразива", "Высокая оптическая прозрачность помогает сохранить хороший обзор", "Устойчивость к поверхностным царапинам", "Гидрофобный эффект помогает воде быстрее скатываться со стекла", "Плёнку можно снять или заменить без замены самого стекла"],
    tech: "Quantum Anti-Skol выпускается в прозрачном исполнении; для версии PET указывается толщина 120 мкм. Плёнка обладает высокой оптической прозрачностью, устойчивостью к поверхностным царапинам и гидрофобным эффектом. Она наносится на внешнюю сторону стекла и при необходимости может быть снята или заменена. Точные характеристики зависят от выбранной версии материала. Плёнка снижает риск повреждений, но не гарантирует сохранность стекла при любом ударе.",
    fit: "Водителям, которые часто ездят по трассе и хотят дополнительно защитить лобовое стекло от камней, песка и дорожного абразива."
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
  const page = contentPage("УСЛУГИ И ТЕХНОЛОГИИ","Все услуги и технологии <em>студии BARIBAL</em>","Полный каталог услуг студии: защита кузова и стёкол, уход за салоном, восстановление и стайлинг автомобиля.",`<div class="service-grid">${allServiceCards()}</div><div class="prose-block"><h2>Подберём решение под ваш автомобиль</h2><p>Можно выбрать отдельную услугу или обсудить комплекс работ. Итоговая стоимость зависит от марки и состояния автомобиля, площади обработки, выбранных материалов и объёма работ.</p><p>Стоимость каждой услуги зависит от автомобиля, состояния поверхности, площади обработки и выбранных материалов. Указанная цена «от» обозначает начальную стоимость; итоговый расчёт выполняется с учётом объёма работ.</p></div>`);
  return page.replace("</main>", `${estimateSection(true)}</main>`);
};
const bodyServices = [
  { title: "AdVance", subtitle: "Защитное покрытие кузова", text: "Защитное покрытие для блеска и сохранения лакокрасочного покрытия. Гарантия на покрытие — 3 года.", price: "от 15 000 ₽", image: new URL("../assets/images/portfolio/89aa4c603c5fe509040b7999422cd307e8aea34d9ce8fcd7862940961bd39ffa.jpg", import.meta.url).href},
  { title: "Бронирование автомобиля защитной плёнкой", subtitle: "Quantum Pro и SunTek · другие плёнки по выбору", text: "Для защиты кузова используем полиуретановые плёнки Quantum Pro и SunTek. Они помогают сохранить лакокрасочное покрытие от сколов, царапин, дорожного мусора и насекомых. По желанию заказчика можем подобрать и установить другую плёнку выбранного им бренда — после согласования материала и его характеристик.", price: "от 3 000 ₽", image: new URL("../assets/images/portfolio/71461392b5f5e699e01e0b32f0b7f539e283a2f1365f342fdd5906b675b9dd56.jpg", import.meta.url).href},
  { title: "Удаление вмятин без покраски", subtitle: "Технология PDR", text: "Беспокрасочное удаление вмятин с сохранением заводского лакокрасочного покрытия, если характер повреждения это позволяет.", price: "от 500 ₽", image: new URL("../assets/images/services/28b4ff3f89ade1068c8a50912cb74951a7decda038f9f55bf1f774059b489438.jpg", import.meta.url).href},
  { title: "Ручная полировка", subtitle: "Бережное восстановление блеска", text: "Ручная обработка с использованием профессиональных аппликаторов и микрофибры для ухода за лакокрасочным покрытием и другими поверхностями.", price: "от 5 000 ₽", image: new URL("../assets/images/services/e383a1af2d8957c76c8a4537ba46dd919d75be0fc9c9f2525beef02ffc6b4e34.jpg", import.meta.url).href},
  { title: "Полировка и защита фар", subtitle: "Возвращаем оптике прозрачность", text: "Полировка специальными составами помогает вернуть фарам первоначальный блеск. После обработки наносится защитный состав.", price: "3 000 ₽", image: new URL("../assets/images/services/e383a1af2d8957c76c8a4537ba46dd919d75be0fc9c9f2525beef02ffc6b4e34.jpg", import.meta.url).href},
  { title: "Автовинил", subtitle: "Стайлинг плёнкой", text: "Оклейка отдельных элементов и поверхностей автомобиля виниловой плёнкой. Подбор решения и дизайна под ваш автомобиль.", price: "от 15 000 ₽", image: new URL("../assets/images/services/5d35a9de831d240de2be6bf8ee9189ea1aed746ba3f5c81b9ffd2a320f2fe404.jpg", import.meta.url).href}
];
const bodyServiceCards = () => bodyServices.map((item, i) => `<article class="service-card"><div class="service-image"><img src="${item.image}" alt="${item.title}" loading="lazy" /></div><div class="service-copy"><span class="eyebrow">0${i + 1} / УСЛУГА</span><h3>${item.title}</h3><h4>${item.subtitle}</h4><p>${item.text}</p><div class="service-bottom"><b>${item.price}</b><div class="service-actions"><button class="text-link js-service-info" type="button" data-service-title="${item.title}">Подробнее <span>↗</span></button><button class="button button-order js-callback" type="button" data-service-title="${item.title}">Обсудить детали</button></div></div></div></article>`).join("");
const bodyPage = () => contentPage("ЗАЩИТА АВТОМОБИЛЯ","Профессиональная <em>защита кузова</em>","Защита, восстановление и уход за кузовом автомобиля — от антигравийной плёнки до ручной полировки.",`<div class="service-grid">${bodyServiceCards()}</div><div class="prose-block"><h2>Комплексный уход за кузовом</h2><p>В студии BARIBAL можно подобрать отдельную услугу или объединить несколько работ в комплекс: сначала подготовить и отполировать поверхность, затем нанести защитное покрытие или оклеить уязвимые зоны плёнкой.</p><p>Удаление вмятин без покраски выполняется по технологии PDR, если состояние покрытия и геометрия повреждения это позволяют. Возможность и стоимость работ мастер определяет после осмотра автомобиля.</p><p>Стоимость зависит от состояния автомобиля, площади обработки и объёма работ. Указанная цена «от» обозначает начальную стоимость; точный расчёт выполняется после осмотра.</p></div><button class="button js-callback">Получить консультацию</button>`);
const cleanPage = () => contentPage("УХОД ЗА АВТОМОБИЛЕМ","Бережная <em>химчистка салона</em>","Профессиональные материалы и внимание к каждой детали интерьера.",`<div class="split-feature"><div class="feature-photo"><img src="${new URL("../assets/images/portfolio/73b239e1305c79983656d7ede9857eb88ab3d3272fd164e798a9e8d47534ebd0.jpg", import.meta.url).href}" alt="Интерьер автомобиля после химчистки"></div><div class="prose-block"><h2>Свежесть и чистота в салоне</h2><p>Студия BARIBAL очищает потолок, велюровое напольное покрытие и сиденья, удаляет пыль из труднодоступных мест. Пластиковые детали обрабатываем составами с антистатическим эффектом и возвращаем салону приятный запах.</p><p>После процедуры весь салон остаётся сухим, чистым и ухоженным. Используем профессиональные материалы и подбираем способ обработки с учётом отделки автомобиля.</p><p><strong>Стоимость химчистки — от 2 000 ₽.</strong></p><div class="hero-actions"><button class="button js-callback">Записаться на химчистку</button><button class="button button-outline js-open-work-gallery" type="button" data-gallery-index="3" data-gallery-title="Фотографии химчистки салона">Фотографии</button></div></div></div>${workGalleryModal("ФОТОГАЛЕРЕЯ ХИМЧИСТКИ")}`);
const vinylPage = () => contentPage("СТАЙЛИНГ И ЗАЩИТА","Автовинил — <em>стайлинг плёнкой</em>","Оклейка поверхностей любой сложности — от отдельных элементов до кузова автомобиля.",`<div class="split-feature"><div class="feature-photo"><img src="${work[0].image}" alt="Оклейка автомобиля плёнкой"></div><div class="prose-block"><h2>Точная оклейка и выразительный результат</h2><p>Нанесение виниловой плёнки на кузов требует опыта: сложные изгибы, криволинейные поверхности и условия эксплуатации необходимо учитывать на каждом этапе.</p><p>Специалисты BARIBAL выполняют защитную, рекламную и стайлинговую оклейку. Контролируем качество материалов и работ, вручную прорабатываем сложные участки и устраняем выявленный брак.</p><ul class="feature-list"><li>Современные технологии и контроль качества</li><li>Гарантия 1 год на выполненные работы</li><li>Точность, профессионализм и аккуратность</li></ul><p><strong>Стоимость оклейки — от 15 000 ₽.</strong></p><div class="hero-actions"><button class="button js-callback">Обсудить оклейку</button><button class="button js-open-work-gallery" type="button" data-gallery-index="4" data-gallery-title="Примеры оклейки">Примеры оклейки</button></div></div></div>${workGalleryModal("ГАЛЕРЕЯ ОКЛЕЙКИ")}`);
const reviewsPage = () => contentPage("МНЕНИЕ КЛИЕНТОВ","Отзывы наших <em>клиентов</em>","Нам важно, чтобы результат радовал владельца автомобиля и спустя время.",`<div class="review-quote"><span>“</span><blockquote>После покупки автомобиля, заехали в Барибал. Заказывали бронирование пленкой. Прошло два года, а состояние покрытия прежнее. Ни сколов, ни царапин нет. Периодически приезжаем на химчистку салона. В целом все устраивает. Сервис хороший. Ребята с опытом.</blockquote><b>Александр</b></div><div class="review-form-wrap"><h2>Оставьте свой отзыв</h2><p>Расскажите о своём опыте — отзыв появится на этой странице после проверки.</p><form class="lead-form demo-form"><label>Ваше имя<input name="name" placeholder="Имя"></label><label>Марка и модель автомобиля<input name="car" required placeholder="Например, Toyota Camry"></label><label>Текст отзыва<textarea name="review" required rows="5" placeholder="Поделитесь впечатлениями"></textarea></label><button class="button" type="submit">Отправить отзыв</button><small>Форма пока в режиме предпросмотра; публикация отзывов будет подключена отдельно.</small><output></output></form></div>`);
const privacyPage = () => contentPage("ДОКУМЕНТЫ","Политика <em>конфиденциальности</em>","Политика обработки персональных данных сайта BARIBAL.",`<div class="prose-block legal-copy"><p>Политика обработки персональных данных разработана в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных» и определяет порядок обработки персональных данных и меры по обеспечению их безопасности владельцем сайта baribal-studio.ru.</p><h2>Цели обработки</h2><p>Персональные данные используются для предоставления запрашиваемых услуг и информации, ответа на обращения, улучшения качества обслуживания, внутреннего учёта и связи с пользователями.</p><h2>Какие данные могут обрабатываться</h2><p>Имя, адрес электронной почты, номер телефона, файлы cookie и иная информация, которую пользователь добровольно передаёт через формы сайта.</p><h2>Обработка и защита</h2><p>Обработка осуществляется на законной основе и только в объёме, необходимом для заявленных целей. Оператор принимает меры для защиты данных и не продаёт персональные данные пользователей.</p><h2>Отзыв согласия</h2><p>Пользователь может обратиться к оператору по вопросам обработки и отзыва согласия по электронной почте: mihail051206@yandex.ru.</p></div>`);
const pageMap = {"/":homePage,"/video":videoPage,"/tehnology":techPage,"/kuzov":bodyPage,"/himchistka":cleanPage,"/avtovinil":vinylPage,"/foto":galleryPage,"/reviews":reviewsPage,"/politika-konfidencialnosti":privacyPage};
const renderPage = pageMap[path] || homePage;
document.querySelector("#app").innerHTML = header() + renderPage() + footer() + callback() + serviceInfoModal() + `<aside class="contact-widget" aria-label="Связаться с BARIBAL"><button class="contact-widget-toggle" type="button" aria-expanded="false" aria-controls="contact-widget-panel"><img src="${contactWidgetImage}" alt=""><span>Связаться с нами</span><b aria-hidden="true">+</b></button><section class="contact-widget-panel" id="contact-widget-panel" aria-hidden="true"><div class="contact-widget-heading"><img src="${contactWidgetImage}" alt=""><div><b>Давайте обсудим ваш запрос</b><span>Оставьте номер — мы свяжемся с вами</span></div></div><a class="contact-widget-phone" href="tel:+79824814142">+7 (982) 481-41-42</a><form class="lead-form demo-form contact-widget-form"><label>Ваше имя<input name="name" placeholder="Как к вам обращаться"></label><label>Телефон<input name="phone" type="tel" placeholder="+7 (___) ___-__-__" required></label>${contactPreferences()}<button class="button" type="submit">Заказать звонок <span>↗</span></button><output></output></form></section></aside>` + '<button class="back-to-top" type="button" aria-label="Переместиться наверх" title="Переместиться наверх"><span class="back-to-top-label">Наверх</span><span aria-hidden="true">↑</span></button>';
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
    galleryImage.alt = `${galleryTitle.textContent} — фото ${galleryIndex + 1}`;
    galleryCounter.textContent = `${galleryIndex + 1} / ${galleryItems.length}`;
    galleryDots.innerHTML = galleryItems.map((_, i) => `<button type="button" class="work-gallery-dot${i === galleryIndex ? " is-active" : ""}" data-gallery-dot="${i}" aria-label="Фото ${i + 1}" aria-current="${i === galleryIndex ? "true" : "false"}"></button>`).join("");
  };
  const showGallery = index => { galleryIndex = (index + galleryItems.length) % galleryItems.length; renderWorkGallery(); };
  const closeWorkGallery = () => { workGallery.classList.remove("is-open"); workGallery.setAttribute("aria-hidden","true"); document.body.classList.remove("no-scroll"); };
  document.querySelectorAll(".js-open-work-gallery").forEach(button => button.addEventListener("click", () => {
    const index = Number(button.dataset.galleryIndex);
    const portfolioIndex = button.dataset.portfolioGalleryIndex;
    const isPortfolioGallery = portfolioIndex !== undefined;
    galleryItems = isPortfolioGallery ? (portfolioGalleries[Number(portfolioIndex)]?.images || []) : (demoWorkGalleries[index] || []);
    galleryTitle.textContent = button.dataset.galleryTitle || (isPortfolioGallery ? portfolio[Number(portfolioIndex)]?.title : work[index]?.title) || "Фотографии работы";
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
  const item = allServices.find(service => service.title === title) || bodyServices.find(service => service.title === title) || (title === "Бронирование лобового стекла ClearPlex" ? allServices.find(service => service.title === "Бронирование лобового стекла Quantum Anti-Skol") : null);
  const details = serviceDetails[title] || (title === "Бронирование кузова плёнкой" ? serviceDetails["Бронирование автомобиля защитной плёнкой"] : null) || (title === "Бронирование плёнкой 3M" ? serviceDetails["Бронирование автомобиля защитной плёнкой"] : null);
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
  output.textContent = "Предпросмотр: форма готова. Подключение реальной отправки заявок — следующий этап.";
}));
