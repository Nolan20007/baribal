/* One submission adapter for every BARIBAL lead form.
   An empty endpoint keeps GitHub Pages in preview mode until the Timeweb PHP handler is ready. */
(() => {
  const endpoint = document
    .querySelector('meta[name="baribal-lead-endpoint"]')
    ?.getAttribute("content")
    ?.trim() || "";

  const forms = document.querySelectorAll(".demo-form");
  if (!forms.length) return;

  const getValue = (formData, name) => String(formData.get(name) || "").trim();

  const getFormType = (form) => {
    if (form.classList.contains("contact-widget-form")) return "contact_widget";
    if (form.classList.contains("estimate-form")) return "estimate";
    return "callback_modal";
  };

  forms.forEach((form) => {
    // Honeypot for filtering basic automated submissions on the server.
    if (!form.querySelector('[name="website"]')) {
      const honeypot = document.createElement("input");
      honeypot.type = "text";
      honeypot.name = "website";
      honeypot.autocomplete = "off";
      honeypot.tabIndex = -1;
      honeypot.hidden = true;
      honeypot.setAttribute("aria-hidden", "true");
      form.append(honeypot);
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const output = form.querySelector("output");
      const showStatus = (message) => {
        if (output) output.textContent = message;
      };

      if (!endpoint) {
        showStatus("Форма подготовлена. Приём заявок включим после установки обработчика на Timeweb.");
        return;
      }

      if (form.dataset.leadSubmitting === "true") return;

      const formData = new FormData(form);
      const payload = {
        form_type: getFormType(form),
        name: getValue(formData, "name"),
        phone: getValue(formData, "phone"),
        car: getValue(formData, "car"),
        service: getValue(formData, "service"),
        selected_services: getValue(formData, "selected_services"),
        contact_methods: formData.getAll("contact_method").map((value) => String(value)),
        contact_other: getValue(formData, "contact_other"),
        website: getValue(formData, "website"),
        page_url: window.location.href,
        page_title: document.title
      };

      const submitButton = form.querySelector('button[type="submit"]');
      const wasDisabled = submitButton?.disabled ?? false;
      form.dataset.leadSubmitting = "true";
      if (submitButton) submitButton.disabled = true;
      showStatus("Отправляем заявку…");

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          cache: "no-store",
          body: JSON.stringify(payload)
        });

        let result = null;
        try {
          result = await response.json();
        } catch {
          // A non-JSON response is a failed submission.
        }

        if (!response.ok || result?.success !== true) {
          throw new Error("Lead endpoint returned an unsuccessful response");
        }

        showStatus("Спасибо! Заявка отправлена. Мы свяжемся с вами.");
      } catch (error) {
        console.error("BARIBAL lead submission failed:", error);
        showStatus("Не удалось отправить заявку. Попробуйте ещё раз или позвоните: +7 (342) 202-41-42.");
      } finally {
        delete form.dataset.leadSubmitting;
        if (submitButton) submitButton.disabled = wasDisabled;
      }
    });
  });
})();
