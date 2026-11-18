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
    if (event.key === "Escape") closeGallery();
    if (event.key === "ArrowLeft") showGallery(galleryIndex - 1);
    if (event.key === "ArrowRight") showGallery(galleryIndex + 1);
  });
}
