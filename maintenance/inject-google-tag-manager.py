from __future__ import annotations

import re
from pathlib import Path

ROOT = Path("dist")
GTM_ID = "GTM-NXWTSG29"

HEAD_SNIPPET = f"""  <!-- Google Tag Manager — BARIBAL -->
  <script>(function(w,d,s,l,i){{w[l]=w[l]||[];w[l].push({{'gtm.start':
  new Date().getTime(),event:'gtm.js'}});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  }})(window,document,'script','dataLayer','{GTM_ID}');</script>
  <!-- End Google Tag Manager -->"""

BODY_SNIPPET = f"""  <!-- Google Tag Manager (noscript) — BARIBAL -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id={GTM_ID}"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->"""


def inject(page: Path) -> None:
    document = page.read_text(encoding="utf-8")
    existing_ids = set(re.findall(r"\bGTM-[A-Z0-9]+\b", document))
    if existing_ids:
        raise SystemExit(
            f"Refusing to add a duplicate or unexpected GTM container in "
            f"{page.relative_to(ROOT)}: {', '.join(sorted(existing_ids))}"
        )
    if re.search(r"googletagmanager\.com/(?:gtm\.js|gtag/js)|google-analytics\.com", document, re.I):
        raise SystemExit(f"Google tag code already exists in {page.relative_to(ROOT)}")
    if not re.search(r"</head\s*>", document, re.I):
        raise SystemExit(f"Missing </head> in {page.relative_to(ROOT)}")
    if not re.search(r"<body\b[^>]*>", document, re.I):
        raise SystemExit(f"Missing <body> in {page.relative_to(ROOT)}")

    document = re.sub(r"</head\s*>", HEAD_SNIPPET + "\n</head>", document, count=1, flags=re.I)
    document = re.sub(
        r"(<body\b[^>]*>)",
        lambda match: match.group(1) + "\n" + BODY_SNIPPET,
        document,
        count=1,
        flags=re.I,
    )

    if document.count(GTM_ID) != 2:
        raise SystemExit(f"GTM snippet validation failed in {page.relative_to(ROOT)}")
    if document.lower().count("<noscript>") < 1:
        raise SystemExit(f"GTM noscript fallback missing in {page.relative_to(ROOT)}")
    page.write_text(document, encoding="utf-8")


def main() -> None:
    if not ROOT.is_dir():
        raise SystemExit("dist/ does not exist; assemble the Timeweb site first")

    pages = sorted(ROOT.rglob("index.html"))
    not_found = ROOT / "404.html"
    if not_found.is_file():
        pages.append(not_found)
    if not pages:
        raise SystemExit("No published HTML pages found in dist/")

    for page in pages:
        inject(page)

    print(
        f"Google Tag Manager {GTM_ID} injected and validated in "
        f"{len(pages)} Timeweb production pages."
    )


if __name__ == "__main__":
    main()
