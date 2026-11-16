import "./styles.css";
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
  ["Защита кузова", "#services"], ["Автохимчистка", "#services"], ["Автовинил", "#services"],
  ["Все технологии", "#services"], ["Наши работы", "#works"], ["Видео", "/video"]
];
const header = () => `
  <div class="topline"><div class="wrap topline-inner"><span>Студия защитных технологий</span><div><a href="tel:+73422024142">8 (342) 202-41-42</a><a href="tel:+79824814142">8 (982) 481-41-42</a></div></div></div>
  <header class="header"><div class="wrap header-inner">
    <a class="brand" href="/"><img src="${logo}" alt="" /><span><b>BARIBAL</b><small>СТУДИЯ ЗАЩИТНЫХ ТЕХНОЛОГИЙ</small></span></a>
    <button class="menu-toggle" aria-label="Открыть меню" aria-expanded="false"><i></i><i></i><i></i></button>
    <nav class="nav">${nav.map(([label, href]) => `<a href="${href}" ${(isVideoPage && href === "/video") ? 'aria-current="page"' : ""}>${label}</a>`).join("")}</nav>
    <button class="button button-small js-callback">Записаться</button>
  </div></header>`;
const footer = () => `
  <footer class="footer"><div class="wrap footer-grid">
    <a class="brand footer-brand" href="/"><img src="${logo}" alt="" /><span><b>BARIBAL</b><small>СТУДИЯ ЗАЩИТНЫХ ТЕХНОЛОГИЙ</small></span></a>
    <div><h4>Контакты</h4><a href="tel:+73422024142">+7 (342) 202-41-42</a><a href="tel:+79824814142">+7 (982) 481-41-42</a><a href="mailto:mihail051206@yandex.ru">mihail051206@yandex.ru</a></div>
    <div><h4>Адрес студии</h4><p>Пермь, ул. Героев Хасана, 105Э</p><p>За ТЦ «Шоколад», в районе Велты</p></div>
    <div><h4>Навигация</h4><a href="/#services">Услуги</a><a href="/#works">Наши работы</a><a href="/video">Видео</a></div>
  </div><div class="wrap footer-bottom"><span>© BARIBAL — студия защитных технологий</span><span>Пермь</span></div></footer>`;
const callback = () => `
  <div class="modal" id="callback-modal" aria-hidden="true"><div class="modal-backdrop js-close"></div><section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button class="modal-close js-close" aria-label="Закрыть">×</button><span class="eyebrow">BARIBAL · ПЕРМЬ</span><h2 id="modal-title">Мы вам перезвоним</h2><p>Оставьте номер — обсудим задачу и подберём решение для вашего автомобиля.</p><form class="lead-form demo-form"><label>Ваше имя<input name="name" placeholder="Как к вам обращаться" /></label><label>Телефон<input name="phone" type="tel" placeholder="+7 (___) ___-__-__" required /></label><button class="button" type="submit">Заказать консультацию</button><small>Форма пока работает в режиме предпросмотра. Перед публикацией подключим отправку через Creatium.</small><output></output></form></section></div>`;
const workCards = () => work.map(item => `<article class="work-card"><div class="work-image"><img src="${item.image}" alt="${item.title}" loading="lazy" /></div><div class="work-copy"><span class="eyebrow">${item.type}</span><h3>${item.title}</h3><p>${item.text}</p><a class="text-link" href="#callback">Обсудить похожую работу <span>↗</span></a></div></article>`).join("");
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
document.querySelector("#app").innerHTML = header() + (isVideoPage ? videoPage() : homePage()) + footer() + callback();
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
const openModal = () => { modal.classList.add("modal-open"); modal.setAttribute("aria-hidden", "false"); document.body.classList.add("no-scroll"); };
const closeModal = () => { modal.classList.remove("modal-open"); modal.setAttribute("aria-hidden", "true"); document.body.classList.remove("no-scroll"); };
document.querySelectorAll(".js-callback").forEach(button => button.addEventListener("click", openModal));
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
