import "./styles.css";
try { const savedTheme = localStorage.getItem("baribal-theme"); if (savedTheme === "light" || savedTheme === "dark") document.documentElement.dataset.theme = savedTheme; } catch {}
const logo = "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/f055b8b248f6e844ebf90239d4536b94.png";
const work = [
  { image: "https://img1.creatium.ru/disk2/d8/42/1a/7a83075790fe329feddf15ee2582b4adb2/1.jpg", type: "Оклейка", title: "Оклейка LAND CRUISER в матовый полиуретан", text: "Отличная защита кузова и выразительный матовый дизайн." },
  { image: "https://i.1.creatium.io/plp/u21.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/a9956d63b09e5fbef3f76be971ecb4c5.jpg", type: "Бронирование", title: "Защита BMW 8", text: "Бронирование передней части автомобиля и лобового стекла." },
  { image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/c2d8bf6b6f8e8cdd6e21617c92f6d618.jpg", type: "Бронирование", title: "Защита Lexus", text: "Оклейка передней части кузова защитной полиуретановой плёнкой." }
];
const services = [
  { title: "AdVance", subtitle: "Защитное покрытие кузова", text: "Уникальный блеск и защита вашего автомобиля. Покрытие помогает сохранить безупречный внешний вид.", price: "от 15 000 ₽", image: "https://i.1.creatium.io/plp/u21.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/a9956d63b09e5fbef3f76be971ecb4c5.jpg" },
  { title: "Бронирование плёнкой", subtitle: "Защита кузова от сколов", text: "Плёнки HEXIS и SunTek защищают лакокрасочное покрытие от щебня, дорожного мусора и насекомых.", price: "от 3 000 ₽", image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/c2d8bf6b6f8e8cdd6e21617c92f6d618.jpg" },
  { title: "BariGlass", subtitle: "Защита автомобильных стёкол", text: "Гидрофобная защита стёкол от грязи, дождя, пыли и снега.", price: "от 1 000 ₽", image: "https://img1.creatium.ru/disk2/d8/42/1a/7a83075790fe329feddf15ee2582b4adb2/1.jpg" },
  { title: "BariTools", subtitle: "Защита салона автомобиля", text: "Защитное покрытие на основе оксида кремния для материалов интерьера.", price: "от 9 000 ₽", image: "https://i.1.creatium.io/plp/u21.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/a9956d63b09e5fbef3f76be971ecb4c5.jpg" },
  { title: "Предпродажная подготовка", subtitle: "Подготовка автомобиля к продаже", text: "Комплексная подготовка, чтобы автомобиль выглядел ухоженно и производил правильное впечатление.", price: "от 7 000 ₽", image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/c2d8bf6b6f8e8cdd6e21617c92f6d618.jpg" }
];
const videos = ["iVKBjaP6TVI", "GUl93A3olWg", "TdFB4GnGhGk", "XXYMypYvk4E"];
const isVideoPage = location.pathname.replace(/\/$/, "") === "/video";
const nav = [
  ["Защита кузова", "/kuzov"], ["Автохимчистка", "/himchistka"], ["Автовинил", "/avtovinil"],
  ["Все технологии", "/tehnology"], ["Наши работы", "/foto"], ["Видео", "/video"], ["Отзывы", "/reviews"]
];
const header = () => `
  <div class="topline"><div class="wrap topline-inner"><span>Студия защитных технологий</span><div><a href="tel:+73422024142">8 (342) 202-41-42</a><a href="tel:+79824814142">8 (982) 481-41-42</a></div></div></div>
  <header class="header"><div class="wrap header-inner">
    <a class="brand" href="/"><img src="${logo}" alt="" /><span><b>BARIBAL</b><small>СТУДИЯ ЗАЩИТНЫХ ТЕХНОЛОГИЙ</small></span></a>
    <button class="menu-toggle" aria-label="Открыть меню" aria-expanded="false"><i></i><i></i><i></i></button>
    <nav class="nav">${nav.map(([label, href]) => `<a href="${href}" ${(isVideoPage && href === "/video") ? 'aria-current="page"' : ""}>${label}</a>`).join("")}</nav>
    <button class="theme-toggle" type="button" data-theme-toggle aria-label="Переключить цветовую тему"><span class="theme-icon" aria-hidden="true">☀</span><span class="theme-label">Светлая</span></button>
    <button class="button button-small js-callback">Записаться</button>
  </div></header>`;
const footer = () => `
  <footer class="footer"><div class="wrap footer-grid">
    <a class="brand footer-brand" href="/"><img src="${logo}" alt="" /><span><b>BARIBAL</b><small>СТУДИЯ ЗАЩИТНЫХ ТЕХНОЛОГИЙ</small></span></a>
    <div><h4>Контакты</h4><a href="tel:+73422024142">+7 (342) 202-41-42</a><a href="tel:+79824814142">+7 (982) 481-41-42</a><a href="mailto:mihail051206@yandex.ru">mihail051206@yandex.ru</a></div>
    <div><h4>Адрес студии</h4><p>Пермь, ул. Героев Хасана, 105Э</p><p>За ТЦ «Шоколад», в районе Велты</p></div>
    <div><h4>Навигация</h4><a href="/tehnology">Услуги</a><a href="/foto">Наши работы</a><a href="/reviews">Отзывы</a><a href="/video">Видео</a><a href="/politika-konfidencialnosti">Политика конфиденциальности</a></div>
  </div><div class="wrap footer-bottom"><span>© BARIBAL — студия защитных технологий</span><span>Пермь</span></div></footer>`;
const callback = () => `
  <div class="modal" id="callback-modal" aria-hidden="true"><div class="modal-backdrop js-close"></div><section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button class="modal-close js-close" aria-label="Закрыть">×</button><span class="eyebrow">BARIBAL · ПЕРМЬ</span><h2 id="modal-title">Мы вам перезвоним</h2><p id="callback-context">Оставьте номер — обсудим задачу и подберём решение для вашего автомобиля.</p><form class="lead-form demo-form"><label>Ваше имя<input name="name" placeholder="Как к вам обращаться" /></label><label>Телефон<input name="phone" type="tel" placeholder="+7 (___) ___-__-__" required /></label><button class="button" type="submit">Заказать консультацию</button><small>Форма пока работает в режиме предпросмотра. Перед публикацией подключим отправку через Creatium.</small><output></output></form></section></div>`;
const workCards = () => work.map(item => `<article class="work-card"><div class="work-image"><img src="${item.image}" alt="${item.title}" loading="lazy" /></div><div class="work-copy"><span class="eyebrow">${item.type}</span><h3>${item.title}</h3><p>${item.text}</p><a class="text-link js-callback" href="#callback" data-work-title="${item.title}">Обсудить похожую работу <span>↗</span></a></div></article>`).join("");
const serviceCards = () => services.map((item, i) => `<article class="service-card"><div class="service-image"><img src="${item.image}" alt="" loading="lazy" /></div><div class="service-copy"><span class="eyebrow">0${i + 1} / УСЛУГА</span><h3>${item.title}</h3><h4>${item.subtitle}</h4><p>${item.text}</p><div class="service-bottom"><b>${item.price}</b><button class="text-link js-callback">Узнать больше <span>↗</span></button></div></div></article>`).join("");
const homePage = () => `
  <main>
    <section class="hero"><div class="hero-shade"></div><div class="wrap hero-content"><span class="eyebrow">BARIBAL · СТУДИЯ ЗАЩИТНЫХ ТЕХНОЛОГИЙ</span><h1>Современные технологии<br /><em>защиты автомобиля</em><br />в Перми</h1><p>Профессиональный уход, защита кузова и интерьера<br class="desktop-only" /> с гарантией от 12 до 72 месяцев</p><div class="hero-actions"><button class="button js-callback">Записаться на обслуживание <span>↗</span></button><a class="button button-outline" href="#works">Наши работы</a></div><div class="hero-index"><b>01</b><span>ЗАЩИТА · УХОД · СТИЛЬ</span></div></div></section>
    <section class="section works-section" id="works"><div class="wrap"><div class="section-heading"><div><span class="eyebrow">ПОРТФОЛИО</span><h2>Последние выполненные<br /><em>нами работы</em></h2></div><a class="text-link" href="#callback">Обсудить проект <span>↗</span></a></div><div class="work-grid">${workCards()}</div><div class="center-action"><button class="button button-dark js-callback">Хочу такой же результат</button></div></div></section>
    <section class="estimate"><div class="wrap estimate-inner"><div><span class="eyebrow">ИНДИВИДУАЛЬНЫЙ ПОДХОД</span><h2>Рассчитаем стоимость<br /><em>защиты вашего автомобиля</em></h2><p>Расскажите, что хотите защитить. Мы свяжемся с вами и сориентируем по стоимости.</p></div><form class="estimate-form demo-form"><label>Ваш автомобиль<input name="car" placeholder="Марка и модель" /></label><label>Что вас интересует<select name="service"><option>Защита кузова</option><option>Автохимчистка</option><option>Автовинил</option><option>Защита стёкол</option><option>Другое</option></select></label><label>Телефон<input name="phone" type="tel" placeholder="+7 (___) ___-__-__" required /></label><button class="button" type="submit">Отправить на расчёт <span>↗</span></button><small>Демонстрационная форма. Интеграцию с Creatium подключим перед публикацией.</small><output></output></form></div></section>
    <section class="section services-section" id="services"><div class="wrap"><div class="section-heading"><div><span class="eyebrow">ЧТО МЫ ДЕЛАЕМ</span><h2>Услуги студии <em>BARIBAL</em></h2></div><p>Технологичные решения для сохранения внешнего вида и ценности вашего автомобиля.</p></div><div class="service-grid">${serviceCards()}</div></div></section>
    <section class="video-teaser"><div class="wrap video-teaser-inner"><div><span class="eyebrow">ЗНАКОМСТВО СО СТУДИЕЙ</span><h2>Посмотрите,<br /><em>как мы работаем</em></h2><p>Процессы, технологии и результаты в видео.</p><a class="button" href="/video">Смотреть видео <span>↗</span></a></div><div class="video-preview"><img src="https://img1.creatium.ru/disk2/d8/42/1a/7a83075790fe329feddf15ee2582b4adb2/1.jpg" alt="Автомобиль в студии BARIBAL" loading="lazy" /><span class="play-mark">▶</span></div></div></section>
    <section class="contact-strip"><div class="wrap contact-strip-inner"><div><span class="eyebrow">ЖДЁМ ВАС В СТУДИИ</span><h2>Ваш автомобиль<br /><em>в надёжных руках</em></h2></div><div><p>Пермь, ул. Героев Хасана, 105Э</p><a href="tel:+73422024142">+7 (342) 202-41-42</a></div><button class="button js-callback">Записаться <span>↗</span></button></div></section>
  </main>`;
const videoPage = () => `
  <main><section class="page-hero"><div class="wrap"><span class="eyebrow">BARIBAL · ВИДЕО</span><h1>Наши <em>видео</em></h1><p>Знакомьтесь с технологиями, процессами и результатами нашей работы.</p></div></section><section class="section video-section"><div class="wrap"><div class="video-grid">${videos.map((id, i) => `<article class="video-card"><div class="video-frame"><iframe src="https://www.youtube-nocookie.com/embed/${id}" title="BARIBAL — видео ${i + 1}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div><div class="video-label"><span>0${i + 1}</span><h3>Видео ${i + 1}</h3></div></article>`).join("")}</div></div></section></main>`;

const basePath = "/baribal";
const cleanPath = location.pathname.startsWith(basePath) ? location.pathname.slice(basePath.length) : location.pathname;
const path = cleanPath.replace(/\/$/, "") || "/";
const pageHero = (eyebrow, title, intro = "") => `<section class="page-hero"><div class="wrap"><span class="eyebrow">${eyebrow}</span><h1>${title}</h1>${intro ? `<p>${intro}</p>` : ""}</div></section>`;
const contentPage = (eyebrow, title, intro, body) => `<main>${pageHero(eyebrow,title,intro)}<section class="section"><div class="wrap">${body}</div></section></main>`;
const galleryPage = () => contentPage("ПОРТФОЛИО BARIBAL","Наши <em>работы</em>","Примеры защиты, оклейки и ухода за автомобилями в нашей студии.",`<div class="work-grid">${workCards()}</div><div class="center-action"><button class="button button-dark js-callback">Обсудить ваш автомобиль</button></div>`);
const allServices = [
  { title: "AdVance", subtitle: "Защитное покрытие кузова", text: "Защитное покрытие для выразительного блеска и сохранения внешнего вида автомобиля. На старом сайте указана гарантия 3 года.", price: "от 15 000 ₽", image: services[0].image },
  { title: "Бронирование кузова плёнкой", subtitle: "HEXIS и SunTek", text: "Защитная плёнка помогает уберечь лакокрасочное покрытие от мелкого щебня, дорожного мусора и насекомых.", price: "от 3 000 ₽", image: services[1].image },
  { title: "BariGlass", subtitle: "Защита автомобильных стёкол", text: "Гидрофобная обработка стёкол для защиты от грязи, дождя, пыли и снега. В старом описании отмечена долговечная химическая связь покрытия с поверхностью.", price: "от 1 000 ₽", image: services[2].image },
  { title: "BariTools", subtitle: "Защита материалов салона", text: "Защитное покрытие на основе оксида кремния для ухода за различными материалами интерьера автомобиля.", price: "от 9 000 ₽", image: services[3].image },
  { title: "Химчистка салона", subtitle: "Глубокая очистка интерьера", text: "Очистка потолка, напольного покрытия и сидений, удаление пыли из труднодоступных мест, уход за пластиковыми деталями с антистатическим эффектом.", price: "от 2 000 ₽", image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/ecf5c275ca7d90525ddb346743a18d2d.jpg" },
  { title: "Удаление вмятин без покраски", subtitle: "Технология PDR", text: "Беспокрасочное удаление вмятин с сохранением заводского лакокрасочного покрытия, если характер повреждения это позволяет.", price: "от 500 ₽", image: "https://img1.creatium.ru/disk2/d8/42/1a/7a83075790fe329feddf15ee2582b4adb2/1.jpg" },
  { title: "Шумо-вибро-теплоизоляция", subtitle: "Комфорт в салоне автомобиля", text: "Изоляция автомобиля комплексно или отдельными узлами. Стоимость зависит от выбранных материалов и объёма работ.", price: "от 30 000 ₽", image: services[3].image },
  { title: "Тонирование стёкол", subtitle: "Комфорт и внешний вид", text: "Профессиональное тонирование автомобильных стёкол с подбором решения под автомобиль и пожелания владельца.", price: "от 2 500 ₽", image: services[1].image },
  { title: "Предпродажная подготовка", subtitle: "Подготовка автомобиля к продаже", text: "Комплекс работ по улучшению внешнего вида и состояния автомобиля перед продажей.", price: "от 7 000 ₽", image: services[4].image },
  { title: "Ручная полировка", subtitle: "Бережный уход за поверхностями", text: "Полировка с использованием мягких аппликаторов и микрофибры для деликатной обработки лакокрасочного покрытия и других поверхностей.", price: "от 5 000 ₽", image: "https://i.1.creatium.io/plp/u21.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/a9956d63b09e5fbef3f76be971ecb4c5.jpg" },
  { title: "Автовинил", subtitle: "Стайлинг и оклейка плёнкой", text: "Оклейка поверхностей любой сложности: защитная, рекламная и стайлинговая. Старый сайт указывает гарантию 1 год на выполненные работы.", price: "от 15 000 ₽", image: work[0].image },
  { title: "Ремонт пластика салона", subtitle: "Восстановление элементов интерьера", text: "Ремонт пластиковых деталей салона для восстановления аккуратного внешнего вида интерьера.", price: "от 1 000 ₽", image: services[3].image },
  { title: "Ремонт сидений", subtitle: "Восстановление обивки", text: "Ремонт повреждений и восстановление внешнего вида автомобильных сидений.", price: "от 3 000 ₽", image: services[3].image },
  { title: "Перетяжка руля", subtitle: "Обновление рулевого колеса", text: "Восстановление внешнего вида руля и обновление его отделки.", price: "от 3 000 ₽", image: services[3].image },
  { title: "Бронирование лобового стекла ClearPlex", subtitle: "Прозрачная защитная плёнка", text: "Специальная прозрачная плёнка для лобового стекла, снижающая риск сколов, трещин и царапин от дорожных воздействий.", price: "от 8 000 ₽", image: services[2].image },
  { title: "Полировка и защита фар", subtitle: "Восстановление прозрачности оптики", text: "Полировка специальными пастами помогает вернуть фарам первоначальный блеск. Можно дополнить защитной обработкой.", price: "3 000 ₽", image: "https://img1.creatium.ru/disk2/d8/42/1a/7a83075790fe329feddf15ee2582b4adb2/1.jpg" },
  { title: "Химчистка двигателя", subtitle: "Профессиональный уход под капотом", text: "Очистка двигателя с применением специальных средств и с учётом особенностей подкапотного пространства.", price: "1 500 ₽", image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/c2d8bf6b6f8e8cdd6e21617c92f6d618.jpg" }
];
const allServiceCards = () => allServices.map((item, i) => `<article class="service-card"><div class="service-image"><img src="${item.image}" alt="${item.title}" loading="lazy" /></div><div class="service-copy"><span class="eyebrow">0${i + 1} / УСЛУГА</span><h3>${item.title}</h3><h4>${item.subtitle}</h4><p>${item.text}</p><div class="service-bottom"><b>${item.price}</b><button class="text-link js-callback">Узнать больше <span>↗</span></button></div></div></article>`).join("");
const techPage = () => contentPage("УСЛУГИ И ТЕХНОЛОГИИ","Все технологии <em>студии BARIBAL</em>","Полный каталог услуг студии: защита кузова и стёкол, уход за салоном, восстановление и стайлинг автомобиля.",`<div class="service-grid">${allServiceCards()}</div><div class="prose-block"><h2>Подберём решение под ваш автомобиль</h2><p>Можно выбрать отдельную услугу или обсудить комплекс работ. Итоговая стоимость зависит от марки и состояния автомобиля, площади обработки, выбранных материалов и объёма работ.</p><p>Цены на карточках перенесены из прежнего каталога BARIBAL и указаны как ориентир. Актуальность стоимости, наличие материалов и условия гарантии необходимо подтвердить у студии перед записью.</p></div>`);
const bodyServices = [
  { title: "AdVance", subtitle: "Защитное покрытие кузова", text: "Защитное покрытие для блеска и сохранения лакокрасочного покрытия. Гарантия, указанная на старом сайте, — 3 года.", price: "от 15 000 ₽", image: "https://i.1.creatium.io/plp/u21.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/a9956d63b09e5fbef3f76be971ecb4c5.jpg" },
  { title: "Бронирование плёнкой 3M", subtitle: "Защита от сколов и дорожного мусора", text: "Оклейка кузова защитной плёнкой 3M VentureShield. Помогает защитить лакокрасочное покрытие от мелкого щебня, мусора и насекомых.", price: "от 3 000 ₽", image: "https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/c2d8bf6b6f8e8cdd6e21617c92f6d618.jpg" },
  { title: "Удаление вмятин без покраски", subtitle: "Технология PDR", text: "Беспокрасочное удаление вмятин с сохранением заводского лакокрасочного покрытия, если характер повреждения это позволяет.", price: "от 500 ₽", image: "https://img1.creatium.ru/disk2/d8/42/1a/7a83075790fe329feddf15ee2582b4adb2/1.jpg" },
  { title: "Ручная полировка", subtitle: "Бережное восстановление блеска", text: "Ручная обработка с использованием профессиональных аппликаторов и микрофибры для ухода за лакокрасочным покрытием и другими поверхностями.", price: "от 5 000 ₽", image: "https://i.1.creatium.io/plp/u21.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/a9956d63b09e5fbef3f76be971ecb4c5.jpg" },
  { title: "Полировка и защита фар", subtitle: "Возвращаем оптике прозрачность", text: "Полировка специальными составами помогает вернуть фарам первоначальный блеск. После обработки наносится защитный состав.", price: "3 000 ₽", image: "https://img1.creatium.ru/disk2/d8/42/1a/7a83075790fe329feddf15ee2582b4adb2/1.jpg" },
  { title: "Автовинил", subtitle: "Стайлинг плёнкой", text: "Оклейка отдельных элементов и поверхностей автомобиля виниловой плёнкой. Подбор решения и дизайна под ваш автомобиль.", price: "от 15 000 ₽", image: work[0].image }
];
const bodyServiceCards = () => bodyServices.map((item, i) => `<article class="service-card"><div class="service-image"><img src="${item.image}" alt="${item.title}" loading="lazy" /></div><div class="service-copy"><span class="eyebrow">0${i + 1} / УСЛУГА</span><h3>${item.title}</h3><h4>${item.subtitle}</h4><p>${item.text}</p><div class="service-bottom"><b>${item.price}</b><button class="text-link js-callback">Узнать больше <span>↗</span></button></div></div></article>`).join("");
const bodyPage = () => contentPage("ЗАЩИТА АВТОМОБИЛЯ","Профессиональная <em>защита кузова</em>","Защита, восстановление и уход за кузовом автомобиля — от антигравийной плёнки до ручной полировки.",`<div class="service-grid">${bodyServiceCards()}</div><div class="prose-block"><h2>Комплексный уход за кузовом</h2><p>В студии BARIBAL можно подобрать отдельную услугу или объединить несколько работ в комплекс: сначала подготовить и отполировать поверхность, затем нанести защитное покрытие или оклеить уязвимые зоны плёнкой.</p><p>Удаление вмятин без покраски выполняется по технологии PDR, если состояние покрытия и геометрия повреждения это позволяют. Возможность и стоимость работ мастер определяет после осмотра автомобиля.</p><p>Цены на странице приведены как ориентиры по информации старого сайта и требуют подтверждения перед окончательной публикацией.</p></div><button class="button js-callback">Получить консультацию</button>`);
const cleanPage = () => contentPage("УХОД ЗА АВТОМОБИЛЕМ","Бережная <em>химчистка салона</em>","Профессиональные материалы и внимание к каждой детали интерьера.",`<div class="split-feature"><div class="feature-photo"><img src="https://i.1.creatium.io/plp/u8.plpstatic.ru/6109758c7c3dbc7697341195bfdbbc77/ecf5c275ca7d90525ddb346743a18d2d.jpg" alt="Интерьер автомобиля после ухода"></div><div class="prose-block"><h2>Свежесть и чистота в салоне</h2><p>Студия BARIBAL очищает потолок, велюровое напольное покрытие и сиденья, удаляет пыль из труднодоступных мест. Обрабатываем пластиковые детали средствами с антистатическим эффектом и возвращаем салону приятный запах.</p><p>После процедуры салон остаётся сухим, чистым и ухоженным. Используем профессиональные материалы и подбираем способ обработки с учётом отделки автомобиля.</p><p><strong>Стоимость химчистки — от 2 000 ₽.</strong></p><button class="button js-callback">Записаться на химчистку</button></div></div>`);
const vinylPage = () => contentPage("СТАЙЛИНГ И ЗАЩИТА","Автовинил — <em>стайлинг плёнкой</em>","Оклейка поверхностей любой сложности — от отдельных элементов до кузова автомобиля.",`<div class="split-feature"><div class="feature-photo"><img src="${work[0].image}" alt="Оклейка автомобиля плёнкой"></div><div class="prose-block"><h2>Точная оклейка и выразительный результат</h2><p>Нанесение виниловой плёнки на кузов требует опыта: сложные изгибы, криволинейные поверхности и условия эксплуатации необходимо учитывать на каждом этапе.</p><p>Специалисты BARIBAL выполняют защитную, рекламную и стайлинговую оклейку. Контролируем качество материалов и работ, вручную прорабатываем сложные участки и устраняем выявленный брак.</p><ul class="feature-list"><li>Современные технологии и контроль качества</li><li>Гарантия 1 год на выполненные работы</li><li>Точность, профессионализм и аккуратность</li></ul><button class="button js-callback">Обсудить оклейку</button></div></div>`);
const reviewsPage = () => contentPage("МНЕНИЕ КЛИЕНТОВ","Отзывы наших <em>клиентов</em>","Нам важно, чтобы результат радовал владельца автомобиля и спустя время.",`<div class="review-quote"><span>“</span><blockquote>После покупки автомобиля, заехали в Барибал. Заказывали бронирование пленкой. Прошло два года, а состояние покрытия прежнее. Ни сколов, ни царапин нет. Периодически приезжаем на химчистку салона. В целом все устраивает. Сервис хороший. Ребята с опытом.</blockquote><b>Александр</b></div><div class="review-form-wrap"><h2>Оставьте свой отзыв</h2><p>Расскажите о своём опыте — отзыв появится на этой странице после проверки.</p><form class="lead-form demo-form"><label>Ваше имя<input name="name" placeholder="Имя"></label><label>Марка и модель автомобиля<input name="car" required placeholder="Например, Toyota Camry"></label><label>Текст отзыва<textarea name="review" required rows="5" placeholder="Поделитесь впечатлениями"></textarea></label><button class="button" type="submit">Отправить отзыв</button><small>Форма пока в режиме предпросмотра; публикация отзывов будет подключена отдельно.</small><output></output></form></div>`);
const privacyPage = () => contentPage("ДОКУМЕНТЫ","Политика <em>конфиденциальности</em>","Политика обработки персональных данных сайта BARIBAL.",`<div class="prose-block legal-copy"><p>Политика обработки персональных данных разработана в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных» и определяет порядок обработки персональных данных и меры по обеспечению их безопасности владельцем сайта baribal-studio.ru.</p><h2>Цели обработки</h2><p>Персональные данные используются для предоставления запрашиваемых услуг и информации, ответа на обращения, улучшения качества обслуживания, внутреннего учёта и связи с пользователями.</p><h2>Какие данные могут обрабатываться</h2><p>Имя, адрес электронной почты, номер телефона, файлы cookie и иная информация, которую пользователь добровольно передаёт через формы сайта.</p><h2>Обработка и защита</h2><p>Обработка осуществляется на законной основе и только в объёме, необходимом для заявленных целей. Оператор принимает меры для защиты данных и не продаёт персональные данные пользователей.</p><h2>Отзыв согласия</h2><p>Пользователь может обратиться к оператору по вопросам обработки и отзыва согласия по электронной почте: mihail051206@yandex.ru.</p><p><small>Перед публикацией документа на новом домене необходимо проверить и актуализировать сведения об операторе, целях обработки, используемых сервисах и контактах.</small></p></div>`);
const pageMap = {"/":homePage,"/video":videoPage,"/tehnology":techPage,"/kuzov":bodyPage,"/himchistka":cleanPage,"/avtovinil":vinylPage,"/foto":galleryPage,"/reviews":reviewsPage,"/politika-konfidencialnosti":privacyPage};
const renderPage = pageMap[path] || homePage;
document.querySelector("#app").innerHTML = header() + renderPage() + footer() + callback();
if (location.pathname === basePath || location.pathname.startsWith(basePath + "/")) {
  document.querySelectorAll("#app a[href^=\"/\"]").forEach(link => { link.setAttribute("href", basePath + link.getAttribute("href")); });
}

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
document.querySelectorAll(".nav a").forEach(link => link.addEventListener("click", () => {
  document.querySelector(".nav").classList.remove("nav-open");
  menuButton.setAttribute("aria-expanded", "false");
}));
const modal = document.querySelector("#callback-modal");
const openModal = (workTitle = "") => {
  const context = document.querySelector("#callback-context");
  context.textContent = workTitle
    ? `Вы выбрали работу «${workTitle}». Оставьте телефон — обсудим похожее решение для вашего автомобиля.`
    : "Оставьте номер — обсудим задачу и подберём решение для вашего автомобиля.";
  modal.classList.add("modal-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
};
const closeModal = () => { modal.classList.remove("modal-open"); modal.setAttribute("aria-hidden", "true"); document.body.classList.remove("no-scroll"); };
document.querySelectorAll(".js-callback").forEach(button => button.addEventListener("click", event => { event.preventDefault(); openModal(button.dataset.workTitle || ""); }));
document.querySelectorAll(".js-close").forEach(button => button.addEventListener("click", closeModal));
document.addEventListener("keydown", event => { if (event.key === "Escape") closeModal(); });
document.querySelectorAll('input[type="tel"]').forEach(input => input.addEventListener("input", () => {
  let digits = input.value.replace(/\D/g, "");
  if (digits.startsWith("8")) digits = "7" + digits.slice(1);
  if (digits.startsWith("7")) digits = digits.slice(1);
  digits = digits.slice(0, 10);
  const parts = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 8), digits.slice(8, 10)];
  input.value = digits ? "+7" + (parts[0] ? " (" + parts[0] : "") + (parts[0]?.length === 3 ? ")" : "") + (parts[1] ? " " + parts[1] : "") + (parts[2] ? "-" + parts[2] : "") + (parts[3] ? "-" + parts[3] : "") : "";
}));
document.querySelectorAll(".demo-form").forEach(form => form.addEventListener("submit", event => {
  event.preventDefault();
  const output = form.querySelector("output");
  output.textContent = "Предпросмотр: форма готова. Подключение отправки через Creatium — следующий этап.";
}));
