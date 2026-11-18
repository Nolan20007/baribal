// BARIBAL — plain JavaScript. No framework, imports or build step.
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

const callbackModal = document.querySelector("#callback-modal");
let lastModalTrigger = null;
const openCallback = (workTitle = "", serviceTitle = "") => {
  if (!callbackModal) return;
  lastModalTrigger = document.activeElement;
  const title = callbackModal.querySelector("#modal-title");
  const context = callbackModal.querySelector("#callback-context");
  const serviceField = callbackModal.querySelector("#callback-service");
  title.textContent = serviceTitle ? "Заказать услугу" : "Мы вам перезвоним";
  serviceField.value = serviceTitle || "";
  context.textContent = serviceTitle
    ? `Вы выбрали «${serviceTitle}». Оставьте телефон — мы свяжемся с вами, ответим на вопросы и согласуем удобное время.`
    : workTitle
      ? `Вы выбрали работу «${workTitle}». Оставьте телефон — обсудим похожее решение для вашего автомобиля.`
      : "Оставьте номер — обсудим задачу и подберём решение для вашего автомобиля.";
  callbackModal.classList.add("modal-open");
  callbackModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  callbackModal.querySelector('input[name="phone"]')?.focus();
};
const closeCallback = () => {
  if (!callbackModal) return;
  callbackModal.classList.remove("modal-open");
  callbackModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
  if (lastModalTrigger && typeof lastModalTrigger.focus === "function") lastModalTrigger.focus();
};
// Callback buttons are handled by the early delegated listener above.


document.addEventListener("click", (event) => {
  const trigger = event.target.closest(".js-callback");
  if (!trigger) return;
  event.preventDefault();
  event.stopPropagation();
  openCallback(
    trigger.dataset.workTitle || trigger.closest(".work-card")?.querySelector("h3")?.textContent.trim() || "",
    trigger.dataset.serviceTitle || ""
  );
}, true);



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
  const updateBackToTop = () => backToTop.classList.toggle("is-visible", (window.scrollY || document.documentElement.scrollTop || 0) > 300);
  window.addEventListener("scroll", updateBackToTop, { passive: true });
  window.addEventListener("pageshow", updateBackToTop);
  updateBackToTop();
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

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
}

const infoModal = document.querySelector("#service-info-modal");
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
  const price = card?.querySelector(".service-bottom b")?.textContent.trim() || "";
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
document.querySelector("#service-info-order")?.addEventListener("click", (event) => {
  const title = event.currentTarget.dataset.serviceTitle || "";
  closeInfoModal();
  openCallback("", title);
});
document.querySelectorAll(".js-close").forEach((button) => button.addEventListener("click", () => { closeCallback(); closeInfoModal(); }));
document.addEventListener("keydown", (event) => {
  const activeModal = document.querySelector(".modal.modal-open");
  if (!activeModal) return;
  if (event.key === "Escape") { event.preventDefault(); closeCallback(); closeInfoModal(); }
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

// The original portfolio filters and "show all" interaction.
const portfolioGrid = document.querySelector("#portfolio-grid");
const portfolioMore = document.querySelector("#portfolio-more");
if (portfolioGrid) {
  const cards = [...portfolioGrid.querySelectorAll(".work-card")];
  const categoryForCard = (card) => {
    const value = (card.textContent || "").toLowerCase();
    const categories = [];
    if (/clearplex|лобов(ое|ого|ому)|ст[её]кл/.test(value)) categories.push("Защита стёкол");
    if (/химчист|детейлинг|полировк|предпродаж|салон/.test(value)) categories.push("Детейлинг и уход");
    if (/винил|стайлинг|рекламн|изменение цвета/.test(value)) categories.push("Оклейка и стайлинг");
    if (/бронир|защит|advance|кузов|пленк|плёнк|hexis|suntek/.test(value)) categories.push("Защита кузова");
    return [...new Set(categories)];
  };
  cards.forEach((card, index) => {
    card.classList.add("portfolio-card");
    card.dataset.categories = categoryForCard(card).join("|");
    if (!card.querySelector(".portfolio-card-number")) {
      const image = card.querySelector(".work-image");
      if (image) { const number = document.createElement("span"); number.className = "portfolio-card-number"; number.textContent = "#" + (index + 1); number.setAttribute("aria-label", "Карточка " + (index + 1)); image.prepend(number); }
    }
    const actions = card.querySelector(".work-actions");
    if (actions && !actions.querySelector(".js-callback")) {
      const button = document.createElement("button");
      button.type = "button"; button.className = "text-link js-callback"; button.textContent = "Хочу так же ↗"; button.dataset.workTitle = card.querySelector("h3")?.textContent.trim() || "";
      actions.replaceChildren(button);
      button.addEventListener("click", () => openCallback(card.querySelector("h3")?.textContent.trim() || ""));
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
        : /advance|защитное покрытие/.test(text) ? "AdVance"
        : "Бронирование автомобиля защитной плёнкой";
      info.dataset.serviceTitle = title;
      info.addEventListener("click", () => openServiceInfo(title, info));
    }
  });
  let expanded = false;
  let activeFilter = "Все работы";
  const updatePortfolio = () => {
    const filtered = cards.filter((card) => activeFilter === "Все работы" || card.dataset.categories.split("|").includes(activeFilter));
    cards.forEach((card) => {
      const position = filtered.indexOf(card);
      card.hidden = position < 0 || (!expanded && position >= 9);
      card.classList.toggle("is-extra", position >= 9 && !expanded);
      card.classList.toggle("is-visible", position >= 9 && expanded);
    });
    if (portfolioMore) {
      portfolioMore.hidden = filtered.length <= 9;
      portfolioMore.setAttribute("aria-expanded", String(expanded));
      portfolioMore.textContent = expanded ? "Свернуть работы" : "Показать все работы (" + filtered.length + ")";
    }
  };
  portfolioMore?.addEventListener("click", () => { expanded = !expanded; updatePortfolio(); });
  document.querySelectorAll(".portfolio-filter").forEach((button) => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    expanded = false;
    document.querySelectorAll(".portfolio-filter").forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    updatePortfolio();
  }));
  updatePortfolio();
}

// Plain-JS work galleries. The first item is the same cover shown on each card.
const workGallerySets = [
  [
    "../assets/images/portfolio/galleries/a58165e7f70299a15a7ca5f55c623020b4190ebe69f09d124ab5bdd9d3eae3b8.jpg",
    "../assets/images/portfolio/galleries/d1c3405fac34ce652af2ca2e1443cb41b8798be0491419c24ec5e85aea36df23.jpg",
    "../assets/images/portfolio/galleries/e07619d016a9cf994c3a88f261b674ea13202d2a301cd032299eae535e0f1f59.jpg"
  ],
  [
    "../assets/images/portfolio/edb1f571acdac6f0a9bc76b7bdcff548467bed7c317eac3fbbbbe6e41cd3430c.jpg",
    "../assets/images/portfolio/galleries/2e02a5330abbecb7b2cae81331597c3b2c8c50031e576b549f4cefecda4f53d8.jpg",
    "../assets/images/portfolio/galleries/4afed0612adc54eb4225d7a5272eee876bcd2c059e623d25767a7e7e63d9e2a6.jpg",
    "../assets/images/portfolio/galleries/aa23627731b6586bb88ad6ad6c9fc104b778da3eaedc9bd5ca45fa4f02eb85bc.jpg",
    "../assets/images/portfolio/galleries/1cb1beba1256ced2924f78f6a5de57dce733b941e6589a10f4a808062d9a3d03.jpg",
    "../assets/images/portfolio/galleries/8ac2c68ec165ee773d64db3e8f98266f5c53001d1ba2cd6d865081f4cac4fd87.jpg",
    "../assets/images/portfolio/galleries/a39e23a4659c26b5e17e14e9b9e1e5dc1698bc9340b700412c29f236eef4e96e.jpg"
  ],
  [
    "../assets/images/portfolio/89aa4c603c5fe509040b7999422cd307e8aea34d9ce8fcd7862940961bd39ffa.jpg",
    "../assets/images/portfolio/galleries/c140984e92c2df675bed98df0a034876a5457c926d6a4efa70eb15f3030e5576.jpg",
    "../assets/images/portfolio/galleries/f10aeb6251c9d4f0f30ccf7730d150bd55a85d8c32f081914e3f32ab1e184431.jpg"
  ]
];
const workGallery = document.querySelector("#work-gallery-modal");
if (workGallery) {
  const galleryImage = workGallery.querySelector(".work-gallery-image");
  const galleryTitle = workGallery.querySelector(".work-gallery-title");
  const galleryCounter = workGallery.querySelector(".work-gallery-counter");
  const galleryDots = workGallery.querySelector(".work-gallery-dots");
  const previousButton = workGallery.querySelector("[data-gallery-prev]");
  const nextButton = workGallery.querySelector("[data-gallery-next]");
  let galleryItems = [];
  let galleryIndex = 0;
  let touchStartX = 0;
  let lastGalleryTrigger = null;

  const renderGallery = () => {
    galleryImage.src = galleryItems[galleryIndex];
    galleryImage.alt = galleryTitle.textContent + " — фото " + (galleryIndex + 1);
    galleryCounter.textContent = (galleryIndex + 1) + " / " + galleryItems.length;
    galleryDots.replaceChildren();
    galleryItems.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "work-gallery-dot" + (index === galleryIndex ? " is-active" : "");
      dot.setAttribute("aria-label", "Фото " + (index + 1));
      dot.setAttribute("aria-current", String(index === galleryIndex));
      dot.addEventListener("click", () => { galleryIndex = index; renderGallery(); });
      galleryDots.append(dot);
    });
    previousButton.hidden = galleryItems.length < 2;
    nextButton.hidden = galleryItems.length < 2;
  };
  const showGallery = (index) => {
    galleryIndex = (index + galleryItems.length) % galleryItems.length;
    renderGallery();
  };
  const closeGallery = () => {
    workGallery.classList.remove("is-open");
    workGallery.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    if (lastGalleryTrigger) lastGalleryTrigger.focus();
  };

  document.querySelectorAll(".js-open-work-gallery").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.galleryIndex);
      galleryItems = workGallerySets[index] || [];
      if (!galleryItems.length) return;
      lastGalleryTrigger = button;
      galleryTitle.textContent = button.dataset.galleryTitle || "Фотографии работы";
      showGallery(0);
      workGallery.classList.add("is-open");
      workGallery.setAttribute("aria-hidden", "false");
      document.body.classList.add("no-scroll");
      workGallery.querySelector(".work-gallery-close").focus();
    });
  });
  workGallery.querySelectorAll("[data-gallery-close]").forEach((button) => button.addEventListener("click", closeGallery));
  previousButton.addEventListener("click", () => showGallery(galleryIndex - 1));
  nextButton.addEventListener("click", () => showGallery(galleryIndex + 1));
  galleryImage.addEventListener("touchstart", (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
  galleryImage.addEventListener("touchend", (event) => {
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 45) showGallery(galleryIndex + (delta < 0 ? 1 : -1));
  }, { passive: true });
  document.addEventListener("keydown", (event) => {
    if (!workGallery.classList.contains("is-open")) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeGallery();
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showGallery(galleryIndex - 1);
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showGallery(galleryIndex + 1);
      return;
    }
    if (event.key === "Tab") {
      const focusable = [...workGallery.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])')]
        .filter((element) => !element.hidden && element.getAttribute("aria-hidden") !== "true");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}
