from pathlib import Path
from html import escape as html_escape
import os
import re

ROOT = Path("dist")
COMPONENTS = ROOT / "components"
# GitHub Pages deliberately receives an empty endpoint. The Timeweb workflow
# may set this public same-origin path after the PHP handler is installed.
LEAD_ENDPOINT = os.environ.get("BARIBAL_LEAD_ENDPOINT", "").strip()
if LEAD_ENDPOINT and LEAD_ENDPOINT != "/api/lead.php":
    raise SystemExit("BARIBAL_LEAD_ENDPOINT must be empty or /api/lead.php")
widget = (COMPONENTS / "contact-widget.html").read_text(encoding="utf-8").strip()
modal = (COMPONENTS / "callback-modal.html").read_text(encoding="utf-8").strip()

def extract_outer(html, tag, predicate):
    opening = re.compile(r"<" + tag + r"\b[^>]*>", re.I)
    tokens = re.compile(r"</?" + tag + r"\b[^>]*>", re.I)
    for match in opening.finditer(html):
        if not predicate(match.group(0)):
            continue
        depth = 0
        for item in tokens.finditer(html, match.start()):
            token = item.group(0)
            if token.startswith("</"):
                depth -= 1
            elif not token.rstrip().endswith("/>"):
                depth += 1
            if depth == 0:
                return match.start(), item.end()
    return None

def has_class(tag, class_name):
    match = re.search(r'class=["\']([^"\']*)["\']', tag, re.I)
    return bool(match and class_name in match.group(1).split())

def count_class(html, class_name):
    return sum(class_name in match.group(1).split()
               for match in re.finditer(r'class=["\']([^"\']*)["\']', html, re.I))

def remove_component(html, tag, predicate):
    while True:
        found = extract_outer(html, tag, predicate)
        if not found:
            return html
        html = html[:found[0]] + html[found[1]:]

def relative_asset_paths(fragment, page):
    prefix = Path(os.path.relpath(ROOT, page.parent)).as_posix()
    return fragment.replace("../foto/", prefix + "/foto/")

for page in ROOT.rglob("*.html"):
    if "components" in page.relative_to(ROOT).parts:
        continue
    html = page.read_text(encoding="utf-8")
    html = remove_component(
        html, "aside",
        lambda tag: has_class(tag, "contact-widget")
    )
    html = remove_component(
        html, "div",
        lambda tag: re.search(r'id=["\']callback-modal["\']', tag)
    )

    page_widget = relative_asset_paths(widget, page)
    page_modal = relative_asset_paths(modal, page)

    prefix = Path(os.path.relpath(ROOT, page.parent)).as_posix()
    head_additions = []
    lead_meta = '<meta name="baribal-lead-endpoint" content="' + html_escape(LEAD_ENDPOINT, quote=True) + '">'
    head_additions.append(lead_meta)

    css_href = prefix + "/css/style.css"
    if not re.search(r'<link[^>]+href=["\']' + re.escape(css_href) + r'["\']', html, re.I):
        head_additions.append(f'<link rel="stylesheet" href="{css_href}">')

    for filename in ("callback-modal.js", "lead-forms.js", "main.js"):
        src = prefix + "/js/" + filename
        if not re.search(r'<script[^>]+src=["\']' + re.escape(src) + r'["\']', html, re.I):
            module = ' type="module"' if filename == "main.js" else " defer"
            head_additions.append(f'<script{module} src="{src}"></script>')

    if head_additions:
        html = re.sub(
            r"</head>",
            "  " + "\n  ".join(head_additions) + "\n</head>",
            html, count=1, flags=re.I
        )

    injection = "\n" + page_widget + "\n\n" + page_modal + "\n"
    if not re.search(r"</body>", html, re.I):
        raise SystemExit(f"No closing body tag in {page}")
    html = re.sub(r"</body>", lambda _: injection + "</body>", html, count=1, flags=re.I)
    page.write_text(html, encoding="utf-8")

# Fail the build rather than publish a page with missing or duplicated forms.
for page in ROOT.rglob("*.html"):
    if "components" in page.relative_to(ROOT).parts:
        continue
    html = page.read_text(encoding="utf-8")
    if len(re.findall(r'id=["\']callback-modal["\']', html, re.I)) != 1:
        raise SystemExit(f"Expected exactly one callback modal in {page}")
    if count_class(html, "contact-widget") != 1:
        raise SystemExit(f"Expected exactly one floating contact widget in {page}")

# Partials are build inputs, not public website pages.
for name in ("contact-widget.html", "callback-modal.html"):
    (COMPONENTS / name).unlink(missing_ok=True)
try:
    COMPONENTS.rmdir()
except OSError:
    pass

print("Shared callback forms injected and verified on every published HTML page.")
