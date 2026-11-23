/* Independent callback modal handler; does not depend on the gallery module. */
(() => {
  const modal = document.getElementById("callback-modal");
  if (!modal) return;
  const title = modal.querySelector("#modal-title");
  const context = modal.querySelector("#callback-context");
  const serviceField = modal.querySelector("#callback-service");
  let lastTrigger = null;

  const open = (workTitle = "", serviceTitle = "", trigger = null) => {
    lastTrigger = trigger || document.activeElement;
    if (title) title.textContent = serviceTitle ? "Заказать услугу" : "Мы вам перезвоним";
    if (serviceField) serviceField.value = serviceTitle || "";
    const form = modal.querySelector("form.lead-form");
    if (form) {
      const scope = trigger?.closest("[data-source-block], .work-card, .service-card, section, article");
      const heading = scope?.querySelector("h1, h2, h3, h4");
      form.dataset.sourceBlock = trigger?.dataset.sourceBlock
        || serviceTitle
        || workTitle
        || heading?.textContent.trim()
        || "Модальное окно обратной связи";
      form.dataset.sourceButton = trigger?.textContent.replace(/\\s+/g, " ").trim() || "Открытие формы";
    }
    if (context) context.textContent = serviceTitle
      ? `Вы выбрали «${serviceTitle}». Оставьте телефон — мы свяжемся с вами, ответим на вопросы и согласуем удобное время.`
      : workTitle
        ? `Вы выбрали работу «${workTitle}». Оставьте телефон — обсудим похожее решение для вашего автомобиля.`
        : "Оставьте номер — обсудим задачу и подберём решение для вашего автомобиля.";
    modal.classList.add("modal-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  };

  const close = () => {
    modal.classList.remove("modal-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    if (lastTrigger && typeof lastTrigger.focus === "function") lastTrigger.focus();
  };

  window.BaribalCallbackModal = Object.freeze({ open, close });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const trigger = target.closest(".js-callback");
    if (!trigger) return;
    event.preventDefault();
    event.stopPropagation();
    const workTitle = trigger.dataset.workTitle
      || trigger.closest(".work-card")?.querySelector("h3")?.textContent.trim()
      || "";
    open(workTitle, trigger.dataset.serviceTitle || "", trigger);
  }, true);

  modal.querySelectorAll(".js-close").forEach((button) => button.addEventListener("click", close));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("modal-open")) {
      event.preventDefault();
      close();
    }
  });
})();