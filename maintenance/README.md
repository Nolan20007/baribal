# Служебные инструменты BARIBAL

Эта папка предназначена для скриптов разработки, переноса и проверки материалов.

## localize-creatium-assets.mjs

Скачивает изображения, на которые ссылается текущий код сайта, проверяет формат и контрольную сумму SHA-256, удаляет бинарные дубли и заменяет ссылки на локальные ресурсы.

- Источник списка: `creatium-image-inventory.json`.
- Результат: `assets/images/` и `creatium-localization-report.json`.
- Автоматический запуск: workflow `Localize Creatium assets`.
- Не нужен на Timeweb: это инструмент миграции/обслуживания.

## extract-creatium-images.mjs

Скрипт Playwright для извлечения фотографий и дополнительных галерей со старого сайта Creatium.

- Страница: `https://baribal-studio.ru/foto`.
- Запуск: `npm run extract:creatium` (для извлечения карточек и галерей).
- Результаты временно создаются в `output/creatium-images/`.
- Скрипт требует Playwright и установленный Chromium.
- Не нужен на опубликованном сайте и на Timeweb.

## normalize-creatium-galleries.mjs

Обрабатывает результат извлечения галерей, считает SHA-256, повторно использует уже сохранённые файлы и формирует индекс карточек и фотографий.

- Вход: `output/creatium-images/cards/`.
- Выход: `assets/images/portfolio/galleries/` и `creatium-gallery-index.json`.
- Запускается workflow `Extract and archive Creatium galleries`.
- Это служебный этап миграции, не серверная часть сайта.

## Другие файлы

- `creatium-image-inventory.json` — исходный список внешних URL и мест их использования.
- `creatium-localization-report.json` — отчёт о скачанных локальных изображениях и их SHA-256.
- `asset-audit.md` — журнал ревизии ресурсов.

**Важно:** содержимое `maintenance/` не является частью сайта. На Timeweb загружается только production-сборка `dist/`.
