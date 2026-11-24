"use strict";

const reviewForm = document.querySelector("[data-review-form]");
const reviewFileInput = reviewForm?.querySelector("[data-review-photos]");
const reviewFileList = reviewForm?.querySelector("[data-review-file-list]");
const reviewOutput = reviewForm?.querySelector("output");

const reviewModal = document.getElementById("review-submit-modal");
const reviewModalTrigger = document.querySelector("[data-review-modal-open]");
let reviewModalLastFocus = null;

if (reviewModal && reviewModalTrigger) {
  const closeButtons = reviewModal.querySelectorAll("[data-review-modal-close]");
  const dialog = reviewModal.querySelector('[role="dialog"]');
  const openReviewModal = () => {
    reviewModalLastFocus = document.activeElement;
    if (reviewForm?.dataset.submitting !== "1" && reviewOutput) reviewOutput.textContent = "";
    reviewModal.classList.add("modal-open");
    reviewModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    window.requestAnimationFrame(() => reviewModal.querySelector('input[name="name"]')?.focus());
  };
  const closeReviewModal = () => {
    reviewModal.classList.remove("modal-open");
    reviewModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    if (reviewModalLastFocus instanceof HTMLElement) reviewModalLastFocus.focus();
  };

  reviewModalTrigger.addEventListener("click", openReviewModal);
  closeButtons.forEach((button) => button.addEventListener("click", closeReviewModal));
  document.addEventListener("keydown", (event) => {
    if (!reviewModal.classList.contains("modal-open")) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeReviewModal();
      return;
    }
    if (event.key !== "Tab" || !dialog) return;
    const focusable = [...dialog.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])')]
      .filter((element) => element.getClientRects().length > 0);
    if (!focusable.length) {
      event.preventDefault();
      dialog.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

const formatReviewDate = (value) => {
  const date = new Date(String(value || "").replace(" ", "T"));
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("ru-RU", {
    day: "numeric", month: "long", year: "numeric"
  }).format(date);
};

const renderApprovedReviews = async () => {
  const container = document.querySelector("[data-approved-reviews]");
  if (!container) return;
  try {
    const response = await fetch(new URL("/api/reviews.php", window.location.origin), {
      headers: { Accept: "application/json" },
      credentials: "same-origin"
    });
    if (!response.ok) return;
    const data = await response.json();
    if (!data.success || !Array.isArray(data.reviews) || !data.reviews.length) return;

    data.reviews.forEach((review) => {
      const card = document.createElement("article");
      card.className = "approved-review-card";
      const meta = document.createElement("div");
      meta.className = "approved-review-meta";
      const author = document.createElement("strong");
      author.textContent = review.name || "Клиент BARIBAL";
      const car = document.createElement("span");
      car.textContent = review.car || "";
      const date = document.createElement("time");
      date.textContent = formatReviewDate(review.date);
      meta.append(author, car, date);
      const body = document.createElement("p");
      body.textContent = review.text || "";
      card.append(meta, body);
      if (Array.isArray(review.photos) && review.photos.length) {
        const photos = document.createElement("div");
        photos.className = "approved-review-photos";
        review.photos.forEach((url) => {
          const frame = document.createElement("div");
          frame.className = "approved-review-photo";
          const image = document.createElement("img");
          image.src = url;
          image.alt = "Фотография к отзыву клиента BARIBAL";
          image.loading = "lazy";
          image.decoding = "async";
          image.classList.add("js-shared-lightbox-image");
          image.setAttribute("role", "button");
          image.setAttribute("tabindex", "0");
          image.setAttribute("aria-label", "Открыть фотографию к отзыву");
          image.title = "Открыть фотографию";
          frame.append(image);
          photos.append(frame);
        });
        card.append(photos);
      }
      container.append(card);
    });
  } catch {
    // Existing editorial reviews remain visible if the review API is temporarily unavailable.
  }
};

if (reviewForm && reviewFileInput && reviewFileList) {
  const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
  const renderFileList = () => {
    reviewFileList.replaceChildren();
    const files = [...reviewFileInput.files];
    files.forEach((file) => {
      const item = document.createElement("span");
      item.className = "review-file-item";
      item.textContent = file.name;
      reviewFileList.append(item);
    });
  };

  reviewFileInput.addEventListener("change", () => {
    renderFileList();
    const files = [...reviewFileInput.files];
    if (files.length > 3) {
      reviewFileInput.value = "";
      renderFileList();
      if (reviewOutput) reviewOutput.textContent = "Можно приложить не более трёх фотографий.";
      return;
    }
    const invalid = files.find((file) => !allowedTypes.has(file.type) || file.size > 2 * 1024 * 1024);
    if (invalid) {
      reviewFileInput.value = "";
      renderFileList();
      if (reviewOutput) reviewOutput.textContent = "Выберите JPG, PNG или WebP размером до 2 МБ каждый.";
    } else if (reviewOutput) {
      reviewOutput.textContent = "";
    }
  });

  reviewForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (reviewForm.dataset.submitting === "1") return;
    if (!reviewForm.reportValidity()) return;
    const files = [...reviewFileInput.files];
    if (files.length > 3 || files.some((file) => !allowedTypes.has(file.type) || file.size > 2 * 1024 * 1024)) {
      if (reviewOutput) reviewOutput.textContent = "Проверьте фотографии: не более трёх файлов JPG, PNG или WebP до 2 МБ каждый.";
      return;
    }

    const button = reviewForm.querySelector('button[type="submit"]');
    reviewForm.dataset.submitting = "1";
    if (button) button.disabled = true;
    if (reviewOutput) reviewOutput.textContent = "Отправляем отзыв…";
    try {
      const response = await fetch(new URL("/api/review-submit.php", window.location.origin), {
        method: "POST",
        body: new FormData(reviewForm),
        headers: { Accept: "application/json" },
        credentials: "same-origin"
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Не удалось отправить отзыв. Попробуйте ещё раз.");
      }
      reviewForm.reset();
      renderFileList();
      if (reviewOutput) reviewOutput.textContent = result.message || "Спасибо! Отзыв отправлен на проверку.";
    } catch (error) {
      if (reviewOutput) reviewOutput.textContent = error.message || "Не удалось отправить отзыв. Попробуйте ещё раз.";
    } finally {
      delete reviewForm.dataset.submitting;
      if (button) button.disabled = false;
    }
  });
}

renderApprovedReviews();
