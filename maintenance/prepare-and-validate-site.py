from __future__ import annotations

import re
import shutil
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path("dist").resolve()


def root_relative_prefix(page: Path) -> str:
    depth = len(page.parent.relative_to(ROOT).parts)
    return "../" * depth if depth else "./"


def normalize_asset_prefixes(text: str, prefix: str) -> str:
    # All published pages refer to shared assets from one predictable root.
    for folder in ("assets", "foto"):
        text = re.sub(rf"(?<![A-Za-z0-9_./-])(?:\.\./)+{folder}/", prefix + folder + "/", text)
        text = re.sub(rf"(?<![A-Za-z0-9_./-])\./{folder}/", prefix + folder + "/", text)
    return text


class LocalReferenceParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.references: list[tuple[str, str]] = []
        self.images: list[dict[str, str | None]] = []

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag.lower() == "img" and values.get("src"):
            self.images.append(values)
        for attr in ("src", "href", "poster", "data-full-src"):
            value = values.get(attr)
            if value:
                self.references.append((attr, value))
        srcset = values.get("srcset")
        if srcset:
            for item in srcset.split(","):
                candidate = item.strip().split()
                if candidate:
                    self.references.append(("srcset", candidate[0]))


def is_external_or_special(url: str) -> bool:
    value = url.strip()
    return (
        not value
        or value.startswith(("#", "//"))
        or bool(urlsplit(value).scheme)
    )


def check_local_reference(page: Path, url: str) -> str | None:
    if is_external_or_special(url):
        return None
    parsed = urlsplit(url)
    raw_path = unquote(parsed.path)
    if not raw_path:
        return None
    if raw_path.startswith("/"):
        target = ROOT / raw_path.lstrip("/")
    else:
        target = page.parent / raw_path
    target = target.resolve()
    try:
        target.relative_to(ROOT)
    except ValueError:
        return f"reference escapes published root: {url}"
    if target.is_dir():
        target = target / "index.html"
    if not target.exists():
        return f"missing local target: {url}"
    return None


def main() -> None:
    if not ROOT.exists():
        raise SystemExit("dist/ does not exist; run the copy step first")

    # Keep every supplied studio portrait, not only the small feedback avatar.
    source_photos = Path("foto")
    if source_photos.exists():
        shutil.copytree(source_photos, ROOT / "foto", dirs_exist_ok=True)

    html_pages = sorted(ROOT.rglob("*.html"))
    if not html_pages:
        raise SystemExit("No HTML pages found in dist/")

    for page in html_pages:
        prefix = root_relative_prefix(page)
        original = page.read_text(encoding="utf-8")
        normalized = normalize_asset_prefixes(original, prefix)
        if normalized != original:
            page.write_text(normalized, encoding="utf-8")

    # Stylesheets live in dist/css/, so normalize their shared asset URLs too.
    for stylesheet in ROOT.rglob("*.css"):
        prefix = root_relative_prefix(stylesheet)
        original = stylesheet.read_text(encoding="utf-8")
        normalized = normalize_asset_prefixes(original, prefix)
        if normalized != original:
            stylesheet.write_text(normalized, encoding="utf-8")

    errors: list[str] = []
    checked = 0
    for page in sorted(ROOT.rglob("*.html")):
        parser = LocalReferenceParser()
        parser.feed(page.read_text(encoding="utf-8"))
        for attr, url in parser.references:
            checked += 1
            problem = check_local_reference(page, url)
            if problem:
                errors.append(f"{page.relative_to(ROOT)} [{attr}] {problem}")
        # Content images on ordinary pages must reserve their dimensions and
        # provide an alt attribute. The large portfolio page is intentionally
        # excluded from this migration and keeps its existing image pipeline.
        if "foto" not in page.relative_to(ROOT).parts:
            for image in parser.images:
                if not (image.get("width", "").isdigit() and image.get("height", "").isdigit()):
                    errors.append(f"{page.relative_to(ROOT)} [img] missing numeric width/height: {image.get('src')}")
                if "alt" not in image:
                    errors.append(f"{page.relative_to(ROOT)} [img] missing alt attribute: {image.get('src')}")

    required = [
        ROOT / "index.html",
        ROOT / "about" / "index.html",
        ROOT / "foto" / "foto.png",
        ROOT / "foto" / "foto1.png",
        ROOT / "css" / "style.css",
        ROOT / "js" / "main.js",
        ROOT / "js" / "callback-modal.js",
        ROOT / "js" / "lead-forms.js",
    ]
    for path in required:
        if not path.is_file() or path.stat().st_size == 0:
            errors.append(f"required publication file missing or empty: {path.relative_to(ROOT)}")

    if errors:
        print("\n".join(errors[:100]))
        raise SystemExit(f"Site validation failed: {len(errors)} broken reference(s)/required file(s).")

    print(
        f"Site validation passed: {len(html_pages)} HTML pages, "
        f"{checked} local references, all required pages and studio photos present."
    )


if __name__ == "__main__":
    main()
