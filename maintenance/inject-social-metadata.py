from __future__ import annotations

import base64
import re
from html import escape, unescape
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageFilter, ImageOps

ROOT = Path("dist")
SITE_BASE_URL = "https://baribal-studio.ru"
OG_IMAGE = SITE_BASE_URL + "/assets/images/brand/og-preview-wide.png"
OG_SOURCE_IMAGE = ROOT / "assets/images/brand/og-preview.png"
OG_OUTPUT_IMAGE = ROOT / "assets/images/brand/og-preview-wide.png"
FAVICON_SVG = "assets/images/brand/favicon-new.svg"
FAVICON_PNG = "assets/images/brand/bear-black.png"
DEFAULT_DESCRIPTION = (
    "Студия защитных технологий BARIBAL в Перми: детейлинг, защита кузова "
    "и стёкол, плёнки, керамические покрытия и уход за автомобилем."
)


def attr(tag: str, name: str) -> str | None:
    match = re.search(rf'\b{name}\s*=\s*["\']([^"\']*)["\']', tag, re.I)
    return match.group(1) if match else None


def remove_old_social_and_icon_tags(document: str) -> str:
    tag_pattern = re.compile(r"<(?:meta|link)\b[^>]*>", re.I)

    def keep(match: re.Match[str]) -> str:
        tag = match.group(0)
        if tag.lower().startswith("<link"):
            rel = (attr(tag, "rel") or "").lower().split()
            return "" if any(value in {"icon", "shortcut", "apple-touch-icon"} for value in rel) else tag
        key = (attr(tag, "property") or attr(tag, "name") or "").lower()
        return "" if key.startswith(("og:", "twitter:")) else tag

    return tag_pattern.sub(keep, document)


def page_url(page: Path) -> str:
    relative = page.relative_to(ROOT).as_posix()
    if relative == "index.html":
        route = "/"
    elif relative.endswith("/index.html"):
        route = "/" + relative[: -len("/index.html")] + "/"
    else:
        route = "/" + relative
    return SITE_BASE_URL + route


def generate_raster_icons(source_path: Path, svg_path: Path) -> None:
    with Image.open(source_path) as opened:
        image = ImageOps.exif_transpose(opened).convert("RGBA")
        alpha = image.getchannel("A")
        if alpha.getextrema() == (255, 255):
            raise SystemExit("BARIBAL bear source must have a transparent background")
        bounds = alpha.getbbox()
        if not bounds:
            raise SystemExit("BARIBAL bear source contains no visible pixels")
        image = image.crop(bounds)

    # Keep the bear large and centered, while preserving a fully transparent canvas.
    master_size = 512
    bear = ImageOps.contain(image, (420, 420), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (master_size, master_size), (0, 0, 0, 0))
    position = ((master_size - bear.width) // 2, (master_size - bear.height) // 2)
    canvas.alpha_composite(bear, position)

    # A fine white edge keeps the dark silhouette readable on dark browser themes.
    silhouette = canvas.getchannel("A")
    outline = silhouette.filter(ImageFilter.MaxFilter(35))
    outline_layer = Image.new("RGBA", canvas.size, (255, 255, 255, 0))
    outline_layer.putalpha(outline)
    outlined = Image.alpha_composite(outline_layer, canvas)

    png_buffer = BytesIO()
    outlined.save(png_buffer, format="PNG", optimize=True)
    png_data = png_buffer.getvalue()
    encoded = base64.b64encode(png_data).decode("ascii")
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" '
        'viewBox="0 0 512 512">'
        f'<image width="512" height="512" href="data:image/png;base64,{encoded}"/>'
        '</svg>\\n'
    )
    svg_path.write_text(svg, encoding="utf-8")

    rendered = {
        size: outlined.resize((size, size), Image.Resampling.LANCZOS)
        for size in (16, 32, 48, 180)
    }
    rendered[16].save(ROOT / "favicon-16.png", format="PNG", optimize=True)
    rendered[32].save(ROOT / "favicon-32.png", format="PNG", optimize=True)
    rendered[180].save(ROOT / "apple-touch-icon.png", format="PNG", optimize=True)
    rendered[48].save(ROOT / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])

    for filename in ("favicon-16.png", "favicon-32.png", "apple-touch-icon.png"):
        with Image.open(ROOT / filename) as icon:
            if icon.mode != "RGBA" or icon.getchannel("A").getextrema() == (255, 255):
                raise SystemExit(f"{filename} lost its transparent background")
    print("Transparent BARIBAL bear favicons generated: SVG, ICO, 16px, 32px and 180px.")

def create_wide_social_preview(source_path: Path, output_path: Path) -> tuple[int, int]:
    """Create a 1200x630 share image without stretching or distorting the original artwork."""
    target_width, target_height = 1200, 630
    with Image.open(source_path) as opened:
        image = ImageOps.exif_transpose(opened).convert("RGB")
        source_width, source_height = image.size
        if source_width <= 0 or source_height <= 0:
            raise SystemExit("Social preview source has invalid dimensions")

        resized_height = round(source_height * target_width / source_width)
        image = image.resize((target_width, resized_height), Image.Resampling.LANCZOS)
        if resized_height < target_height:
            raise SystemExit(
                f"Social preview source is too wide to create {target_width}x{target_height} "
                "without adding blank space"
            )

        # Keep the brand header and all service rows; trim only the bottom contact strip.
        image = image.crop((0, 0, target_width, target_height))
        output_path.parent.mkdir(parents=True, exist_ok=True)
        image.save(output_path, format="PNG", optimize=True)

    with Image.open(output_path) as result:
        if result.size != (target_width, target_height):
            raise SystemExit(f"Generated social preview has unexpected dimensions: {result.size}")
    print(f"Generated social preview: {output_path} ({target_width}x{target_height}).")
    return target_width, target_height


def main() -> None:
    if not ROOT.is_dir():
        raise SystemExit("dist/ does not exist; assemble the site first")

    required_assets = (OG_SOURCE_IMAGE, ROOT / FAVICON_PNG)
    missing = [str(path.relative_to(ROOT)) for path in required_assets if not path.is_file() or path.stat().st_size == 0]
    if missing:
        raise SystemExit("Social preview assets missing or empty: " + ", ".join(missing))

    generate_raster_icons(ROOT / FAVICON_PNG, ROOT / FAVICON_SVG)
    og_width, og_height = create_wide_social_preview(OG_SOURCE_IMAGE, OG_OUTPUT_IMAGE)

    pages = sorted(ROOT.rglob("index.html"))
    if not pages:
        raise SystemExit("No published index.html pages found in dist/")

    for page in pages:
        document = page.read_text(encoding="utf-8")
        document = document.replace("https://nolan20007.github.io/baribal", SITE_BASE_URL)
        title_match = re.search(r"<title\b[^>]*>(.*?)</title>", document, re.I | re.S)
        title = re.sub(r"\s+", " ", unescape(title_match.group(1))).strip() if title_match else "BARIBAL — студия защитных технологий"
        description_match = re.search(
            r'<meta\b(?=[^>]*\bname=["\']description["\'])(?=[^>]*\bcontent=["\']([^"\']*)["\'])[^>]*>',
            document,
            re.I,
        )
        description = unescape(description_match.group(1)).strip() if description_match else DEFAULT_DESCRIPTION
        if not description:
            description = DEFAULT_DESCRIPTION

        depth = len(page.parent.relative_to(ROOT).parts)
        prefix = "../" * depth if depth else "./"
        url = page_url(page)
        title_attr = escape(title, quote=True)
        description_attr = escape(description, quote=True)
        image_alt = escape("BARIBAL — студия защитных технологий в Перми", quote=True)

        document = remove_old_social_and_icon_tags(document)
        metadata = f"""
  <link rel="canonical" href="{escape(url, quote=True)}">
  <link rel="icon" href="{prefix}favicon.ico" sizes="any">
  <link rel="icon" type="image/svg+xml" href="{prefix}{FAVICON_SVG}">
  <link rel="icon" type="image/png" sizes="32x32" href="{prefix}favicon-32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="{prefix}favicon-16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="{prefix}apple-touch-icon.png">
  <meta property="og:locale" content="ru_RU">
  <meta property="og:site_name" content="BARIBAL">
  <meta property="og:type" content="website">
  <meta property="og:title" content="{title_attr}">
  <meta property="og:description" content="{description_attr}">
  <meta property="og:url" content="{escape(url, quote=True)}">
  <meta property="og:image" content="{OG_IMAGE}">
  <meta property="og:image:secure_url" content="{OG_IMAGE}">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="{og_width}">
  <meta property="og:image:height" content="{og_height}">
  <meta property="og:image:alt" content="{image_alt}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{title_attr}">
  <meta name="twitter:description" content="{description_attr}">
  <meta name="twitter:image" content="{OG_IMAGE}">
  <meta name="twitter:image:alt" content="{image_alt}">
"""
        if not re.search(r"</head\s*>", document, re.I):
            raise SystemExit(f"HTML page has no closing </head>: {page.relative_to(ROOT)}")
        document = re.sub(r"</head\s*>", metadata + "</head>", document, count=1, flags=re.I)
        page.write_text(document, encoding="utf-8")

    print(f"Social metadata and BARIBAL favicons injected into {len(pages)} HTML pages.")


if __name__ == "__main__":
    main()
