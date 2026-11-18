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
