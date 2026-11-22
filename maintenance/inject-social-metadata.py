from __future__ import annotations

import re
from html import escape, unescape
from pathlib import Path

ROOT = Path("dist")
SITE_BASE_URL = "https://nolan20007.github.io/baribal"
OG_IMAGE = SITE_BASE_URL + "/og.jpg"
FAVICON_SVG = "assets/images/brand/favicon.svg"
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


def main() -> None:
    if not ROOT.is_dir():
        raise SystemExit("dist/ does not exist; assemble the site first")

    required_assets = (ROOT / "og.jpg", ROOT / FAVICON_SVG, ROOT / FAVICON_PNG)
    missing = [str(path.relative_to(ROOT)) for path in required_assets if not path.is_file() or path.stat().st_size == 0]
    if missing:
        raise SystemExit("Social preview assets missing or empty: " + ", ".join(missing))

    pages = sorted(ROOT.rglob("index.html"))
    if not pages:
        raise SystemExit("No published index.html pages found in dist/")

    for page in pages:
        document = page.read_text(encoding="utf-8")
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
  <link rel="icon" type="image/svg+xml" href="{prefix}{FAVICON_SVG}">
  <link rel="icon" type="image/png" href="{prefix}{FAVICON_PNG}">
  <link rel="apple-touch-icon" href="{prefix}{FAVICON_PNG}">
  <meta property="og:locale" content="ru_RU">
  <meta property="og:site_name" content="BARIBAL">
  <meta property="og:type" content="website">
  <meta property="og:title" content="{title_attr}">
  <meta property="og:description" content="{description_attr}">
  <meta property="og:url" content="{escape(url, quote=True)}">
  <meta property="og:image" content="{OG_IMAGE}">
  <meta property="og:image:secure_url" content="{OG_IMAGE}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1168">
  <meta property="og:image:height" content="768">
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
