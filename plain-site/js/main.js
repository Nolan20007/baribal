// BRIBAL — plain JavaScript, with a small data module for project galleries.
// Gallery batch 121-140 publication trigger: data and image assets are committed.
"use strict";

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nav");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("nav-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      navigation.classList.remove("nav-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Открыть меню");
    }
  });
}

document.documentElement.classList.add("js-ready");

// Callback modal behavior is centralized in callback-modal.js.

// Keep the estimate summary in sync with the selected services.
const estimateForm = document.querySelector(".estimate-form");
const estimateOptions = document.querySelectorAll('input[name="requestedServices"]');
if (estimateForm && estimateOptions.length) {
  const selectedCount = estimateForm.querySelector("[data-selected-count]");
  const selectedList = estimateForm.querySelector("[data-selected-services]");
  const selectedValue = estimateForm.querySelector("[data-selected-value]");
  const syncEstimate = () => {
    const selected = [...estimateOptions].filter((option) => option.checked).map((option) => option.value);
    selectedCount.textContent = String(selected.length);
    selectedValue.value = selected.join(", ");
    selectedList.replaceChildren();
    if (!selected.length) {
      const empty = document.createElement("li");
      empty.className = "estimate-selected-empty";
      empty.textContent = "Пока ничего не выбрано";
      selectedList.append(empty);
    } else {
      selected.forEach((service) => {
        const item = document.createElement("li");
        item.textContent = service;
        selectedList.append(item);
      });
    }
  };
  estimateOptions.forEach((option) => option.addEventListener("change", syncEstimate));
  syncEstimate();
}

document.querySelectorAll(".demo-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const output = form.querySelector("output");
    if (output) output.textContent = "Предпросмотр: форма готова. Подключение реальной отправки заявок — следующий этап.";
  });
});


// Floating callback widget: same timed opening and session behavior as the original site.
const contactWidget = document.querySelector(".contact-widget");
if (contactWidget) {
  const contactWidgetToggle = contactWidget.querySelector(".contact-widget-toggle");
  const contactWidgetPanel = contactWidget.querySelector(".contact-widget-panel");
  let widgetDismissed = false;
  let widgetAlreadyShown = false;
  try {
    widgetDismissed = sessionStorage.getItem("baribal-contact-widget-dismissed") === "1";
    widgetAlreadyShown = sessionStorage.getItem("baribal-contact-widget-shown") === "1";
  } catch {}
  const setWidgetOpen = (open) => {
    contactWidget.classList.toggle("is-open", open);
    contactWidgetToggle.setAttribute("aria-expanded", String(open));
    contactWidgetPanel.setAttribute("aria-hidden", String(!open));
    contactWidgetToggle.querySelector("span").textContent = open ? "Скрыть" : "Связаться с нами";
    contactWidgetToggle.querySelector("b").textContent = open ? "−" : "+";
  };
  contactWidgetToggle.addEventListener("click", () => {
    const opening = !contactWidget.classList.contains("is-open");
    if (opening) {
      widgetAlreadyShown = true;
      try { sessionStorage.setItem("baribal-contact-widget-shown", "1"); } catch {}
    } else {
      widgetDismissed = true;
      try { sessionStorage.setItem("baribal-contact-widget-dismissed", "1"); } catch {}
    }
    setWidgetOpen(opening);
  });
  if (!widgetAlreadyShown && !widgetDismissed) {
    window.setTimeout(() => {
      if (!widgetAlreadyShown && !widgetDismissed) {
        widgetAlreadyShown = true;
        try { sessionStorage.setItem("baribal-contact-widget-shown", "1"); } catch {}
        setWidgetOpen(true);
      }
    }, 7000);
  }
  contactWidget.querySelectorAll(".contact-preferences").forEach((group) => {
    const otherToggle = group.querySelector("[data-contact-other-toggle]");
    const details = group.querySelector(".contact-other-details");
    const otherInput = group.querySelector('input[name="contact_other"]');
    if (!otherToggle || !details || !otherInput) return;
    const syncOther = () => {
      details.hidden = !otherToggle.checked;
      otherInput.required = otherToggle.checked;
    };
    otherToggle.addEventListener("change", syncOther);
    syncOther();
  });
}


try {
  const savedTheme = localStorage.getItem("baribal-theme");
  if (savedTheme === "light" || savedTheme === "dark") document.documentElement.dataset.theme = savedTheme;
} catch {}

const themeButton = document.querySelector("[data-theme-toggle]");
const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem("baribal-theme", theme); } catch {}
  if (!themeButton) return;
  const nextTheme = theme === "dark" ? "light" : "dark";
  themeButton.querySelector(".theme-icon").textContent = nextTheme === "light" ? "☀" : "☾";
  themeButton.querySelector(".theme-label").textContent = nextTheme === "light" ? "Светлая" : "Тёмная";
  themeButton.setAttribute("aria-label", nextTheme === "light" ? "Включить светлую тему" : "Включить тёмную тему");
  themeButton.setAttribute("aria-pressed", String(theme === "light"));
};
applyTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
themeButton?.addEventListener("click", () => applyTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light"));



// BARIBAL branded video player. The original test MP4 is currently an empty file,
// so the poster and controls remain visible and playback reports the missing media clearly.
const formatPlayerTime = (seconds) => {
  if (!Number.isFinite(seconds)) return "0:00";
  const value = Math.floor(seconds);
  return Math.floor(value / 60) + ":" + String(value % 60).padStart(2, "0");
};
document.querySelectorAll(".baribal-player").forEach((player) => {
  const video = player.querySelector("video");
  const poster = player.querySelector(".video-poster");
  const controls = player.querySelector("[data-player-controls]");
  const playButton = player.querySelector("[data-player-play]");
  const progress = player.querySelector("[data-player-progress]");
  const time = player.querySelector("[data-player-time]");
  const muteButton = player.querySelector("[data-player-mute]");
  const status = player.querySelector(".video-player-status");
  if (!video || !poster || !controls || !playButton || !progress || !time || !muteButton) return;
  const showUnavailable = () => {
    poster.hidden = false;
    controls.hidden = true;
    if (status) { status.hidden = false; status.textContent = "Тестовый видеофайл пока не загружен"; }
  };
  const updatePlayState = () => {
    playButton.textContent = video.paused ? "▶" : "Ⅱ";
    playButton.setAttribute("aria-label", video.paused ? "Воспроизвести видео" : "Приостановить видео");
  };
  const updateProgress = () => {
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    const percent = duration ? video.currentTime / duration * 100 : 0;
    progress.value = String(percent);
    progress.style.setProperty("--player-progress", percent + "%");
    time.textContent = formatPlayerTime(video.currentTime) + " / " + formatPlayerTime(duration);
  };
  const startVideo = () => {
    if (video.dataset.videoUnavailable === "true") { showUnavailable(); return; }
    if (status) status.hidden = true;
    poster.hidden = true;
    controls.hidden = false;
    const result = video.play();
    if (result && typeof result.catch === "function") result.catch(showUnavailable);
  };
  player.querySelector("[data-player-start]")?.addEventListener("click", startVideo);
  playButton.addEventListener("click", () => {
    if (video.paused) {
      if (video.ended) video.currentTime = 0;
      const result = video.play();
      if (result && typeof result.catch === "function") result.catch(showUnavailable);
    } else video.pause();
  });
  video.addEventListener("error", showUnavailable);
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
  player.querySelector("[data-player-fullscreen]")?.addEventListener("click", () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else player.requestFullscreen?.();
  });
  updatePlayState();
  updateProgress();
});

// Desktop-only responsive test preview, restored without the removed design switcher.
const previewLauncher = document.querySelector(".device-preview-open");
if (previewLauncher) {
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
          <a class="device-preview-mode" href="/baribal/vite-archive/" target="_blank" rel="noopener noreferrer">Старая версия Vite</a>
          <button class="device-preview-close" type="button" data-preview-close aria-label="Закрыть окно">×</button>
        </div>
      </header>
      <div class="device-preview-viewport"><iframe title="Предпросмотр сайта BARIBAL" loading="lazy"></iframe></div>
    </section>`;
  document.body.append(previewModal);
  const previewFrame = previewModal.querySelector("iframe");
  const previewButtons = [...previewModal.querySelectorAll("[data-preview-width]")];
  let previewLoaded = false;
  const setPreviewWidth = (width) => {
    previewFrame.style.width = width + "px";
    previewButtons.forEach((button) => {
      const active = Number(button.dataset.previewWidth) === width;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  };
  const openPreview = () => {
    if (!previewLoaded) { previewFrame.src = location.href; previewLoaded = true; }
    setPreviewWidth(390);
    previewModal.classList.add("is-open");
    previewModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("device-preview-modal-open");
    previewModal.querySelector(".device-preview-mode")?.focus();
  };
  const closePreview = () => {
    previewModal.classList.remove("is-open");
    previewModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("device-preview-modal-open");
    previewLauncher.focus();
  };
  previewLauncher.addEventListener("click", openPreview);
  previewButtons.forEach((button) => button.addEventListener("click", () => setPreviewWidth(Number(button.dataset.previewWidth))));
  previewModal.querySelectorAll("[data-preview-close]").forEach((button) => button.addEventListener("click", closePreview));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && previewModal.classList.contains("is-open")) closePreview();
  });
}

const backToTop = document.querySelector(".back-to-top");
if (backToTop) {
  // Use a self-contained SVG so the arrow shape does not depend on system fonts.
  const arrowContainer = backToTop.querySelector('span[aria-hidden="true"]');
  if (arrowContainer) {
    const arrowSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    arrowSvg.setAttribute("viewBox", "0 0 24 24");
    arrowSvg.setAttribute("width", "22");
    arrowSvg.setAttribute("height", "22");
    arrowSvg.setAttribute("focusable", "false");
    arrowSvg.setAttribute("aria-hidden", "true");
    const arrowPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    arrowPath.setAttribute("d", "M12 19V5M5 12l7-7 7 7");
    arrowPath.setAttribute("fill", "none");
    arrowPath.setAttribute("stroke", "currentColor");
    arrowPath.setAttribute("stroke-width", "2");
    arrowPath.setAttribute("stroke-linecap", "round");
    arrowPath.setAttribute("stroke-linejoin", "round");
    arrowSvg.append(arrowPath);
    arrowContainer.replaceChildren(arrowSvg);
  }
  // Shared "Вверх" label sits beside the existing arrow on every page.
  const backToTopGroup = document.createElement("div");
  backToTopGroup.className = "back-to-top-group";
  const backToTopLabel = document.createElement("button");
  backToTopLabel.className = "back-to-top-label";
  backToTopLabel.type = "button";
  backToTopLabel.textContent = "Вверх";
  backToTopLabel.setAttribute("aria-label", "Прокрутить страницу наверх");
  backToTop.parentNode.insertBefore(backToTopGroup, backToTop);
  backToTopGroup.append(backToTopLabel, backToTop);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const updateBackToTop = () => {
    const visible = (window.scrollY || document.documentElement.scrollTop || 0) > 300;
    backToTop.classList.toggle("is-visible", visible);
    backToTopGroup.classList.toggle("is-visible", visible);
  };
  window.addEventListener("scroll", updateBackToTop, { passive: true });
  window.addEventListener("pageshow", updateBackToTop);
  updateBackToTop();
  backToTop.addEventListener("click", scrollToTop);
  backToTopLabel.addEventListener("click", scrollToTop);
}

const serviceDetails = {
  "Керамическое покрытие кузова": {
    lead: "Керамическое покрытие кузова помогает сохранить ухоженный вид лакокрасочного покрытия, подчеркнуть глубину цвета и облегчить регулярный уход за автомобилем.",
    story: "После тщательной мойки и подготовки кузова на лакокрасочное покрытие наносится специальный состав. После отверждения он формирует тонкий защитный слой с выраженным гидрофобным эффектом: вода собирается в капли и легче скатывается с поверхности, а повседневные загрязнения проще удалять при мойке.",
    benefits: ["Придаёт кузову выразительный блеск и подчёркивает глубину цвета","Создаёт гидрофобный эффект — вода легче скатывается с поверхности","Помогает упростить регулярную мойку и уход за автомобилем","Дополняет защиту лакокрасочного покрытия от повседневных загрязнений"],
    tech: "Керамическое покрытие не является антигравийной плёнкой: оно не предназначено для защиты от сколов камнями и не делает кузов неуязвимым для царапин. Качество и срок службы зависят от конкретного состава, подготовки поверхности и соблюдения рекомендаций по уходу. Подходящий вариант и стоимость определяются после консультации и осмотра автомобиля.",
    fit: "Владельцам новых и подержанных автомобилей, которые хотят подчеркнуть блеск кузова, получить водоотталкивающий эффект и упростить дальнейший уход."
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
}

const infoModal = document.querySelector("#service-info-modal");
let lastModalTrigger = null;
const closeInfoModal = () => {
  if (!infoModal) return;
  infoModal.classList.remove("modal-open");
  infoModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
};
const serviceAliases = {
  "Бронирование кузова плёнкой": "Бронирование автомобиля защитной плёнкой",
  "Бронирование плёнкой": "Бронирование автомобиля защитной плёнкой",
  "Бронирование лобового стекла": "Бронирование лобового стекла Quantum Anti-Skol"
};
const servicePrices = {
  "Керамическое покрытие кузова": "по запросу",
  "Бронирование автомобиля защитной плёнкой": "от 3 000 ₽",
  "BariGlass": "от 1 000 ₽",
  "BariTools": "от 9 000 ₽",
  "Химчистка салона": "от 2 000 ₽",
  "Удаление вмятин без покраски": "от 500 ₽",
  "Шумо-вибро-теплоизоляция": "от 30 000 ₽",
  "Тонирование стёкол": "от 2 500 ₽",
  "Предпродажная подготовка": "от 7 000 ₽",
  "Ручная полировка": "от 5 000 ₽",
  "Автовинил": "от 15 000 ₽",
  "Ремонт сидений": "от 3 000 ₽",
  "Бронирование лобового стекла Quantum Anti-Skol": "от 8 000 ₽",
  "Полировка и защита фар": "3 000 ₽",
  "Химчистка двигателя": "1 500 ₽"
};
const serviceTitleForCard = (card) => {
  const title = card.querySelector("h3")?.textContent.trim() || "";
  return serviceAliases[title] || title;
};
const openServiceInfo = (title, trigger) => {
  if (!infoModal) return;
  const lookupTitle = serviceAliases[title] || title;
  const details = serviceDetails[lookupTitle] || serviceDetails[title];
  if (!details) return;
  const card = [...document.querySelectorAll(".service-card")].find((item) => item.querySelector("h3")?.textContent.trim() === title || item.querySelector("h3")?.textContent.trim() === lookupTitle);
  const price = card?.querySelector(".service-bottom b")?.textContent.trim() || servicePrices[lookupTitle] || servicePrices[title] || trigger?.dataset.servicePrice || "";
  infoModal.querySelector("#service-info-title").textContent = title;
  infoModal.querySelector("#service-info-lead").textContent = details.lead;
  infoModal.querySelector("#service-info-story").textContent = details.story;
  const benefits = infoModal.querySelector("#service-info-benefits");
  benefits.replaceChildren();
  details.benefits.forEach((point) => { const li = document.createElement("li"); li.textContent = point; benefits.append(li); });
  infoModal.querySelector("#service-info-tech").textContent = details.tech;
  infoModal.querySelector("#service-info-fit").textContent = details.fit;
  infoModal.querySelector("#service-info-price").textContent = price;
  infoModal.querySelector("#service-info-order").dataset.serviceTitle = title;
  lastModalTrigger = trigger || document.activeElement;
  infoModal.classList.add("modal-open");
  infoModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  infoModal.querySelector(".modal-close")?.focus();
};
document.querySelectorAll(".service-card").forEach((card) => {
  const title = serviceTitleForCard(card);
  const detailsButton = card.querySelector(".js-service-info");
  const orderButton = card.querySelector(".js-callback, .button-order");
  if (detailsButton) detailsButton.dataset.serviceTitle = title;
  if (orderButton) orderButton.dataset.serviceTitle = title;
  detailsButton?.addEventListener("click", () => openServiceInfo(title, detailsButton));
});
document.querySelectorAll("#works .work-card .js-service-info").forEach((button) => button.addEventListener("click", () => openServiceInfo(button.dataset.serviceTitle, button)));
document.querySelector("#service-info-order")?.addEventListener("click", (event) => {
  const title = event.currentTarget.dataset.serviceTitle || "";
  closeInfoModal();
  window.BaribalCallbackModal?.open({ serviceTitle: title, trigger: event.currentTarget });
});
document.querySelectorAll("#service-info-modal .js-close").forEach((button) => button.addEventListener("click", closeInfoModal));
document.addEventListener("keydown", (event) => {
  const activeModal = document.querySelector(".modal.modal-open");
  if (!activeModal) return;
  if (event.key === "Escape" && activeModal.id === "service-info-modal") { event.preventDefault(); closeInfoModal(); }
  if (event.key === "Tab") {
    const focusable = [...activeModal.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter((el) => !el.hidden);
    if (!focusable.length) return;
    if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable[focusable.length - 1].focus(); }
    else if (!event.shiftKey && document.activeElement === focusable[focusable.length - 1]) { event.preventDefault(); focusable[0].focus(); }
  }
});
document.querySelectorAll(".contact-preferences").forEach((group) => {
  const toggle = group.querySelector("[data-contact-other-toggle]");
  const details = group.querySelector(".contact-other-details");
  const input = group.querySelector('input[name="contact_other"]');
  if (!toggle || !details || !input) return;
  const sync = () => { details.hidden = !toggle.checked; input.required = toggle.checked; };
  toggle.addEventListener("change", sync);
  sync();
});


// One consistent Russian phone input for every callback and estimate form.
document.querySelectorAll('input[type="tel"]').forEach((input) => {
  const formatPhone = (value, cursor) => {
    let digits = value.replace(/\D/g, "");
    let digitsBeforeCursor = value.slice(0, cursor).replace(/\D/g, "").length;
    if (digits.startsWith("7") || digits.startsWith("8")) {
      digits = digits.slice(1);
      digitsBeforeCursor = Math.max(0, digitsBeforeCursor - 1);
    }
    digits = digits.slice(0, 10);
    digitsBeforeCursor = Math.min(digitsBeforeCursor, digits.length);

    const area = digits.slice(0, 3);
    const subscriber = digits.slice(3, 6);
    const firstPair = digits.slice(6, 8);
    const secondPair = digits.slice(8, 10);
    let formatted = "+7";
    if (area) formatted += " (" + area;
    if (area.length === 3) formatted += ")";
    if (subscriber) formatted += " " + subscriber;
    if (firstPair) formatted += "-" + firstPair;
    if (secondPair) formatted += "-" + secondPair;

    let nextCursor = 2;
    if (digitsBeforeCursor > 0) {
      let seen = 0;
      while (nextCursor < formatted.length && seen < digitsBeforeCursor) {
        if (/\d/.test(formatted[nextCursor])) seen++;
        nextCursor++;
      }
    }
    return { value: formatted, cursor: nextCursor, digitCount: digits.length };
  };

  const updatePhone = () => {
    const result = formatPhone(input.value, input.selectionStart ?? input.value.length);
    input.value = result.value;
    input.setSelectionRange(result.cursor, result.cursor);
    input.setCustomValidity(
      result.digitCount < 6
        ? "Введите не менее 6 цифр номера после +7 (для полного номера — 10)."
        : ""
    );
  };

  input.setAttribute("inputmode", "numeric");
  input.setAttribute("autocomplete", "tel");
  if (!input.value) input.value = "+7";
  updatePhone();
  input.addEventListener("input", updatePhone);
});

// The original portfolio filters and "show all" interaction.
const portfolioGrid = document.querySelector("#portfolio-grid");
if (portfolioGrid) {
  const cards = [...portfolioGrid.querySelectorAll(".work-card")];
  const categoryForCard = (card) => {
    const value = (card.textContent || "").toLowerCase();
    const categories = [];
    if (/clearplex|лобов(ое|ого|ому)|ст[её]кл/.test(value)) categories.push("Защита стёкол");
    if (/химчист|детейлинг|полировк|предпродаж|салон|интерьер|уход|очистк/.test(value)) categories.push("Детейлинг и уход");
    if (/винил|стайлинг|рекламн|изменение цвета|ливре|оклейк/.test(value)) categories.push("Оклейка и стайлинг");
    if (/бронир|защит|Gyeon|кузов|пленк|плёнк|hexis|suntek/.test(value)) categories.push("Защита кузова");
    if (!categories.length) categories.push("Другое");
    return [...new Set(categories)];
  };
  cards.forEach((card, index) => {
    card.classList.add("portfolio-card");
    card.dataset.categories = categoryForCard(card).join("|");
    if (!card.querySelector(".portfolio-card-number")) {
      const image = card.querySelector(".work-image");
      if (image) { const number = document.createElement("span"); number.className = "portfolio-card-number"; const projectNumber = Number(card.dataset.projectNumber || index + 1); number.textContent = "#" + projectNumber; number.setAttribute("aria-label", "Карточка " + projectNumber); image.prepend(number); }
    }
    const actions = card.querySelector(".work-actions");
    if (actions && !actions.querySelector(".js-callback")) {
      const button = document.createElement("button");
      button.type = "button"; button.className = "text-link js-callback"; button.textContent = "Хочу так же ↗"; button.dataset.workTitle = card.querySelector("h3")?.textContent.trim() || "";
      actions.replaceChildren(button);
    }
    const info = actions?.querySelector(".js-service-info");
    if (info) {
      const text = card.textContent.toLowerCase();
      const title = /bariglass/.test(text) ? "BariGlass"
        : /baritools/.test(text) ? "BariTools"
        : /clearplex|лобов|ст[её]кл/.test(text) ? "Бронирование лобового стекла Quantum Anti-Skol"
        : /химчист|детейлинг|салон/.test(text) ? "Химчистка салона"
        : /полировк/.test(text) ? "Ручная полировка"
        : /винил|стайлинг|рекламн|изменение цвета/.test(text) ? "Автовинил"
        : /Gyeon|защитное покрытие/.test(text) ? "Gyeon"
        : "Бронирование автомобиля защитной плёнкой";
      info.dataset.serviceTitle = title;
      info.addEventListener("click", () => openServiceInfo(title, info));
    }
    const callbackButton = actions?.querySelector(".js-callback");
    if (callbackButton && info?.dataset.serviceTitle) callbackButton.dataset.serviceTitle = info.dataset.serviceTitle;
  });
  let activeFilter = "Все работы";
  const updatePortfolio = () => {
    const filtered = cards.filter((card) => activeFilter === "Все работы" || card.dataset.categories.split("|").includes(activeFilter));
    cards.forEach((card) => {
      card.hidden = !filtered.includes(card);
      card.classList.remove("is-extra", "is-visible");
    });
  };
  document.querySelectorAll(".portfolio-filter").forEach((button) => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll(".portfolio-filter").forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    updatePortfolio();
  }));
  updatePortfolio();
}

// Homepage and portfolio images now use one shared photo viewer.

// Shared BARIBAL photo viewer: the same lightbox is used by every page.
(() => {
  const grid = document.querySelector("#portfolio-grid");
  const cards = grid ? [...grid.querySelectorAll(".work-card")] : [];
  const galleryFileForCard = (number) => {
    if (number <= 20) return "work-galleries-1-20.json";
    if (number <= 40) return "work-galleries-21-40.json";
    if (number <= 60) return "work-galleries-41-60.json";
    if (number <= 80) return "work-galleries-61-80.json";
    if (number <= 100) return "work-galleries-81-100.json";
    if (number <= 120) return "work-galleries-101-120.json";
    if (number <= 140) return "work-galleries-121-140.json";
    if (number >= 141 && number <= 154) return "work-galleries-141-154.json";
    return null;
  };
  const galleryFilePromises = new Map();
  const loadGalleryForCard = async (number) => {
    const file = galleryFileForCard(number);
    if (!file) return {};
    if (!galleryFilePromises.has(file)) {
      galleryFilePromises.set(file, fetch("../data/" + file)
        .then(response => response.ok ? response.json() : {})
        .catch(error => {
          console.warn("Could not load portfolio gallery data:", file, error);
          return {};
        }));
    }
    return galleryFilePromises.get(file);
  };

  const modal = document.createElement("div");
  modal.className = "project-modal";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = '<div class="project-modal__backdrop" data-close></div><section class="project-modal__panel" role="dialog" aria-modal="true" aria-labelledby="project-modal-title"><button class="project-modal__close" type="button" aria-label="Закрыть" data-close>×</button><div class="project-modal__visual"><button class="project-modal__nav project-modal__prev" type="button" aria-label="Предыдущее фото">‹</button><img class="project-modal__image" alt=""><button class="project-modal__nav project-modal__next" type="button" aria-label="Следующее фото">›</button></div><div class="project-modal__details"><span class="eyebrow project-modal__eyebrow">ФОТОГАЛЕРЕЯ BARIBAL</span><h2 id="project-modal-title"></h2><p class="project-modal__description"></p><div class="project-modal__footer"><span class="project-modal__count"></span><span class="project-modal__hint"></span></div></div></section>';
  document.body.append(modal);

  const image = modal.querySelector(".project-modal__image");
  const title = modal.querySelector("#project-modal-title");
  const description = modal.querySelector(".project-modal__description");
  const eyebrow = modal.querySelector(".project-modal__eyebrow");
  const count = modal.querySelector(".project-modal__count");
  const hint = modal.querySelector(".project-modal__hint");
  const previous = modal.querySelector(".project-modal__prev");
  const next = modal.querySelector(".project-modal__next");
  let items = [];
  let index = 0;
  let trigger = null;
  let touchX = 0;

  const render = () => {
    image.src = items[index].src;
    image.alt = (title.textContent || "Фотография") + " — фото " + (index + 1);
    count.textContent = (index + 1) + " / " + items.length;
    previous.hidden = next.hidden = items.length < 2;
    hint.textContent = items.length < 2 ? "Фотография" : "Листайте фотографии";
  };
  const move = (step) => {
    if (items.length < 2) return;
    index = (index + step + items.length) % items.length;
    render();
  };
  const openItems = (nextItems, heading, text, source, isProject) => {
    const unique = [];
    const seen = new Set();
    nextItems.forEach(item => {
      if (!item || !item.src || seen.has(item.src)) return;
      seen.add(item.src);
      unique.push(item);
    });
    if (!unique.length) return;
    items = unique;
    index = 0;
    trigger = source || document.activeElement;
    title.textContent = heading || "Фотографии";
    description.textContent = text || "";
    description.hidden = !text;
    eyebrow.textContent = isProject ? "ПРОЕКТ BARIBAL" : "ФОТОГАЛЕРЕЯ BARIBAL";
    render();
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    modal.querySelector(".project-modal__close").focus();
  };
  const close = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    if (trigger && typeof trigger.focus === "function") trigger.focus();
  };
  const eligibleImage = (img) => {
    if (!img || !img.getAttribute("src")) return false;
    // Empty alt marks an image as decorative; do not turn it into a focusable lightbox control.
    if (!img.alt || !img.alt.trim()) return false;
    if (img.closest(".brand, .video-poster, .project-modal, .work-gallery-modal, .verified-gallery, .contact-widget, #callback-modal, #device-preview-modal")) return false;
    if (img.closest("a, button")) return false;
    if (img.closest("#portfolio-grid")) return false;
    if (img.closest("[data-no-lightbox], .no-lightbox")) return false;
    return true;
  };
  const detailsForImage = (img) => {
    const serviceGallery = img.closest("#service-info-gallery");
    if (serviceGallery) {
      const images = [...serviceGallery.querySelectorAll("img")].filter(eligibleImage);
      const heading = document.querySelector("#service-info-title")?.textContent.trim() || "Бронирование кузова";
      const lead = document.querySelector("#service-info-lead")?.textContent.trim() || "";
      const story = document.querySelector("#service-info-story")?.textContent.trim() || "";
      return { images: images.length ? images : [img], heading, text: [lead, story].filter(Boolean).join(" ") };
    }
    const card = img.closest(".work-card, .service-card, .split-feature, .feature-photo, figure");
    const scope = card || img.parentElement;
    const heading = scope?.querySelector("h2, h3, h4, figcaption")?.textContent.trim()
      || img.getAttribute("alt")?.trim()
      || "Фотографии";
    const text = scope?.querySelector(".work-copy p, .service-copy p, .prose-block p, figcaption")?.textContent.trim() || "";
    const grouped = card ? [...card.querySelectorAll("img")].filter(eligibleImage) : [img];
    const images = grouped.length ? grouped : [img];
    return { images, heading, text };
  };
  const openWorkCardGallery = async (card, source) => {
    const cover = card.querySelector(".work-image img");
    if (!cover?.getAttribute("src")) return;
    const heading = card.querySelector("h2, h3, h4")?.textContent.trim() || cover.alt || "Фотографии";
    const text = card.querySelector(".work-copy p")?.textContent.trim() || "";

    if (grid && grid.contains(card)) {
      const position = cards.indexOf(card);
      const number = Number(card.dataset.projectNumber || position + 1);
      const galleryMap = await loadGalleryForCard(number);
      const sources = [cover.currentSrc || cover.src, ...(galleryMap[String(number)] || []).map(path => new URL(path, document.baseURI).href)];
      openItems(sources.map(src => ({ src })), heading, text, source, true);
      return;
    }

    const galleryButton = card.querySelector(".js-open-work-gallery");
    const customImages = (galleryButton?.dataset.galleryImages || "").split("|").map(path => path.trim()).filter(Boolean);
    const images = customImages.length
      ? customImages.map(path => ({ src: new URL(path, document.baseURI).href }))
      : [...card.querySelectorAll("img")].filter(eligibleImage).map(img => ({ src: img.currentSrc || img.src }));
    openItems(images, galleryButton?.dataset.galleryTitle || heading, text, source, false);
  };

  const openImage = (img) => {
    if (!eligibleImage(img)) return;
    const workCard = img.closest(".work-card");
    if (workCard) {
      openWorkCardGallery(workCard, img);
      return;
    }
    const data = detailsForImage(img);
    openItems(data.images.map(item => ({ src: item.currentSrc || item.src })), data.heading, data.text, img, false);
  };

  // The 154 portfolio cards retain their verified per-project photo sets.
  cards.forEach((card, position) => {
    card.classList.add("portfolio-card--interactive");
    card.tabIndex = 0;
    card.setAttribute("aria-label", "Открыть проект: " + (card.querySelector("h3")?.textContent.trim() || ""));
    const openProject = (source) => openWorkCardGallery(card, source);
    card.addEventListener("click", event => {
      if (event.target.closest("button, a, input, select, textarea")) return;
      openProject(event.target.closest(".work-image") || card);
    });
    card.addEventListener("keydown", event => {
      if (event.target === card && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        openProject(card);
      }
    });
    const cover = card.querySelector(".work-image img");
    if (cover) {
      cover.classList.add("has-verified-gallery");
      cover.title = "Открыть фотографии проекта";
      cover.style.cursor = "zoom-in";
    }
  });

  // Any ordinary content photo on any page opens this same viewer.
  document.querySelectorAll("img").forEach(img => {
    if (!eligibleImage(img)) return;
    img.classList.add("js-shared-lightbox-image");
    img.setAttribute("role", "button");
    img.setAttribute("tabindex", "0");
    img.setAttribute("aria-label", "Открыть фотографию: " + (img.alt || "BARIBAL"));
    img.title = img.title || "Открыть фотографию";
  });
  document.addEventListener("click", event => {
    const img = event.target.closest("img.js-shared-lightbox-image");
    if (img) openImage(img);
  });
  document.addEventListener("keydown", event => {
    const img = event.target.closest?.("img.js-shared-lightbox-image");
    if (img && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openImage(img);
    }
  });

  // Existing “Все фото” buttons also use the shared viewer and gather photos from their own block.
  document.querySelectorAll(".js-open-work-gallery").forEach(button => {
    button.addEventListener("click", () => {
      const workCard = button.closest(".work-card");
      if (workCard) {
        openWorkCardGallery(workCard, button);
        return;
      }
      const scope = button.closest(".service-card, .split-feature, section") || button.parentElement;
      const customImages = (button.dataset.galleryImages || "").split("|").map(path => path.trim()).filter(Boolean);
      const images = customImages.length
        ? customImages.map(path => ({ src: new URL(path, document.baseURI).href }))
        : [...(scope?.querySelectorAll("img") || [])].filter(eligibleImage).map(img => ({ src: img.currentSrc || img.src }));
      const titleText = button.dataset.galleryTitle || scope?.querySelector("h2, h3, h4")?.textContent.trim() || "Фотографии";
      openItems(images, titleText, "", button, false);
    });
  });

  modal.querySelectorAll("[data-close]").forEach(element => element.addEventListener("click", close));
  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  image.addEventListener("touchstart", event => { touchX = event.changedTouches[0].clientX; }, { passive: true });
  image.addEventListener("touchend", event => {
    const delta = event.changedTouches[0].clientX - touchX;
    if (Math.abs(delta) > 45) move(delta < 0 ? 1 : -1);
  }, { passive: true });
  document.addEventListener("keydown", event => {
    if (!modal.classList.contains("is-open")) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") move(-1);
    if (event.key === "ArrowRight") move(1);
  });

  // Remove legacy per-page gallery shells; their buttons are wired above.
  document.querySelectorAll(".work-gallery-modal").forEach(element => element.remove());
})();

// WebP copies are generated separately; original image paths remain active until verification.
