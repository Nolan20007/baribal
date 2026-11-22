from __future__ import annotations

import html
import os
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import quote, unquote, urlsplit

from PIL import Image, ImageOps

ROOT = Path("dist").resolve()
PHOTO_WIDTHS = (400, 800, 1200, 1600)
LOGO_WIDTHS = (48, 96, 192, 384)
AVATAR_WIDTHS = (24, 48, 96, 192)
QUALITY = 80
VOID_TAGS = {
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr",
}


def replace_attr(tag: str, name: str, value: str) -> str:
    escaped = html.escape(value, quote=True)
    pattern = re.compile(r"(\s" + re.escape(name) + r"\s*=\s*)(['\"])(.*?)\2", re.I | re.S)
    if pattern.search(tag):
        return pattern.sub(lambda match: match.group(1) + match.group(2) + escaped + match.group(2), tag, count=1)
    insert_at = tag.rfind("/>")
    if insert_at < 0:
        insert_at = tag.rfind(">")
    return tag[:insert_at] + f' {name}="{escaped}"' + tag[insert_at:]


class ImageTagParser(HTMLParser):
    def __init__(self, source: str):
        super().__init__(convert_charrefs=False)
        self.source = source
        self.line_offsets = [0]
        for match in re.finditer("\n", source):
            self.line_offsets.append(match.end())
        self.stack: list[tuple[str, set[str]]] = []
        self.images: list[dict] = []

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag.lower() == "img" and values.get("src"):
            line, column = self.getpos()
            start = self.line_offsets[line - 1] + column
            raw = self.get_starttag_text()
            ancestors = set().union(*(classes for _, classes in self.stack)) if self.stack else set()
            self.images.append({
                "start": start,
                "end": start + len(raw),
                "raw": raw,
                "attrs": values,
                "ancestors": ancestors,
            })
        if tag.lower() not in VOID_TAGS:
            classes = set((values.get("class") or "").split())
            self.stack.append((tag.lower(), classes))

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag.lower() not in VOID_TAGS:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        lowered = tag.lower()
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index][0] == lowered:
                del self.stack[index:]
                break


def local_source(page: Path, url: str) -> Path | None:
    parsed = urlsplit(url)
    if parsed.scheme or parsed.netloc or not parsed.path:
        return None
    raw = unquote(parsed.path)
    target = (ROOT / raw.lstrip("/")) if raw.startswith("/") else (page.parent / raw)
    target = target.resolve()
    try:
        target.relative_to(ROOT)
    except ValueError:
        return None
    return target if target.is_file() else None


def relative_url(page: Path, target: Path) -> str:
    return quote(Path(os.path.relpath(target, page.parent)).as_posix(), safe="/-._~")


def choose_sizes(ancestors: set[str], attrs: dict[str, str], source_width: int) -> str:
    if "brand" in ancestors or "hero-index" in ancestors:
        return "47px" if "brand" in ancestors else "28px"
    if "contact-widget-toggle" in ancestors:
        return "24px"
    if "contact-widget-heading" in ancestors:
        return "40px"
    if "contact-widget" in ancestors:
        return "48px"
    if "work-image" in ancestors or "video-preview" in ancestors:
        return "(max-width: 700px) calc(100vw - 48px), (max-width: 1200px) calc((100vw - 92px) / 3), 379px"
    if "service-image" in ancestors:
        return "(max-width: 700px) calc(100vw - 48px), (max-width: 1100px) 42vw, 250px"
    if "video-card" in ancestors or "video-item" in ancestors:
        return "(max-width: 700px) calc(100vw - 48px), (max-width: 1100px) 50vw, 560px"
    return "(max-width: 700px) calc(100vw - 48px), (max-width: 1100px) 50vw, 600px"


def make_webp(source: Path, destination: Path, width: int) -> tuple[int, int, int]:
    destination.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as original:
        if getattr(original, "is_animated", False):
            raise ValueError("animated image is not converted")
        image = ImageOps.exif_transpose(original)
        if image.width > width:
            height = max(1, round(image.height * width / image.width))
            image = image.resize((width, height), Image.Resampling.LANCZOS)
        has_alpha = "A" in image.getbands() or "transparency" in image.info
        image = image.convert("RGBA" if has_alpha else "RGB")
        image.save(destination, "WEBP", quality=88 if has_alpha else QUALITY, method=4)
        return image.width, image.height, destination.stat().st_size


def main() -> None:
    if not ROOT.is_dir():
        raise SystemExit("dist/ does not exist; assemble the site before optimizing images")

    converted = 0
    skipped = 0
    failed: list[str] = []
    original_bytes = 0
    responsive_bytes = 0
    updated_tags = 0
    full_src_tags = 0
    variant_cache: dict[Path, list[tuple[int, Path]]] = {}

    for page in sorted(ROOT.rglob("*.html")):
        if "components" in page.relative_to(ROOT).parts:
            continue
        source_text = page.read_text(encoding="utf-8")
        parser = ImageTagParser(source_text)
        parser.feed(source_text)
        replacements: list[tuple[int, int, str]] = []

        for item in parser.images:
            attrs = item["attrs"]
            original_url = attrs.get("data-full-src") or attrs["src"]
            source = local_source(page, original_url)
            if source is None:
                skipped += 1
                continue

            try:
                with Image.open(source) as probe:
                    source_width, source_height = probe.size
                    image_format = (probe.format or "").upper()
                    animated = getattr(probe, "is_animated", False)
            except Exception as error:
                failed.append(f"{page.relative_to(ROOT)}: {original_url}: {error}")
                continue

            if animated or image_format not in {"JPEG", "PNG", "WEBP"}:
                skipped += 1
                continue

            # Existing hand-tuned responsive galleries keep their own srcset.
            if attrs.get("srcset"):
                if not attrs.get("data-full-src"):
                    updated = replace_attr(item["raw"], "data-full-src", attrs["src"])
                    replacements.append((item["start"], item["end"], updated))
                    full_src_tags += 1
                continue

            relative_source = source.relative_to(ROOT).as_posix()
            is_logo = source.name.lower() in {"baribal-logo.png", "baribal-logo.webp"}
            is_avatar = relative_source.endswith("foto/foto.png")
            if is_logo:
                widths = [w for w in LOGO_WIDTHS if w < source_width] + [source_width]
            elif is_avatar:
                widths = [w for w in AVATAR_WIDTHS if w < source_width] + [source_width]
            elif source_width > 500:
                widths = [w for w in PHOTO_WIDTHS if w < source_width] + [source_width]
            else:
                skipped += 1
                continue

            # Deduplicate sizes and never upscale an original.
            widths = sorted(set(w for w in widths if 1 <= w <= source_width))
            if len(widths) < 2:
                skipped += 1
                continue

            stem = source.stem
            variants = variant_cache.get(source)
            if variants is None:
                variants = []
                for width in widths:
                    output = source.with_name(f"{stem}.r{width}.webp")
                    try:
                        out_width, out_height, out_bytes = make_webp(source, output, width)
                        variants.append((out_width, output))
                        responsive_bytes += out_bytes
                        converted += 1
                    except Exception as error:
                        failed.append(f"{relative_source} at {width}px: {error}")
                variants.sort(key=lambda pair: pair[0])
                variant_cache[source] = variants

            if len(variants) < 2:
                continue

            variants.sort(key=lambda pair: pair[0])
            srcset = ", ".join(f"{relative_url(page, path)} {width}w" for width, path in variants)
            fallback = relative_url(page, variants[0][1])
            sizes = choose_sizes(item["ancestors"], attrs, source_width)

            updated = item["raw"]
            updated = replace_attr(updated, "data-full-src", original_url)
            updated = replace_attr(updated, "src", fallback)
            updated = replace_attr(updated, "srcset", srcset)
            updated = replace_attr(updated, "sizes", sizes)
            if "decoding" not in attrs:
                updated = replace_attr(updated, "decoding", "async")
            replacements.append((item["start"], item["end"], updated))
            original_bytes += source.stat().st_size
            updated_tags += 1

        for start, end, replacement in sorted(replacements, reverse=True):
            source_text = source_text[:start] + replacement + source_text[end:]
        if replacements:
            page.write_text(source_text, encoding="utf-8")

    if failed:
        print("\n".join(failed[:50]))
        raise SystemExit(f"Responsive image optimization failed for {len(failed)} image variant(s).")

    print(
        "Responsive image optimization passed: "
        f"{updated_tags} image tags updated, {converted} WebP variants generated, "
        f"{full_src_tags} existing responsive images linked to their originals, "
        f"{skipped} images left unchanged. "
        f"Source files represented: {original_bytes / 1024:.1f} KiB; "
        f"generated variants: {responsive_bytes / 1024:.1f} KiB."
    )


if __name__ == "__main__":
    main()
