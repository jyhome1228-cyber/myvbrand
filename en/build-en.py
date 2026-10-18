#!/usr/bin/env python3
"""Rebuild MYV English pages from the Korean HTML source (same DOM and CSS).

Usage: python en/build-en.py

The translator only replaces editorial strings. It deliberately reuses shared
styles.css and script.js, so the English site never becomes a separate design.
For news, article-body translations are a separate editorial step.
"""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EN = ROOT / "en"
VERSION = "20261018-parity01"
PAGES = (
    "index.html", "about.html", "business.html", "prosumer.html",
    "partner.html", "vpoint.html", "news.html", "contact.html",
    "privacy.html", "contact-thanks.html"
)
TITLES = {
    "index.html": "MYV | Shopping That Creates Value",
    "about.html": "About MYV | MYV",
    "business.html": "Our Business | MYV",
    "prosumer.html": "Prosumer Program | MYV",
    "partner.html": "Brand Partnerships | MYV",
    "vpoint.html": "V.Point Guide | MYV",
    "news.html": "MYV News",
    "contact.html": "Contact Us | MYV",
    "privacy.html": "Privacy Policy | MYV",
    "contact-thanks.html": "Thank You | MYV"
}
TRANSLATIONS = json.loads((EN / "translations.json").read_text(encoding="utf-8"))

def translate_key(text):
    return re.sub(r"\s+", " ", html.unescape(text)).strip()

def translate_node(match):
    source = match.group(1)
    translated = TRANSLATIONS.get(translate_key(source))
    if translated is None:
        return match.group(0)
    head = re.match(r"^\s*", source).group(0)
    tail = re.search(r"\s*$", source).group(0)
    return ">" + head + html.escape(translated, quote=False) + tail + "<"

def translate_attribute(match):
    attr, source = match.groups()
    translated = TRANSLATIONS.get(translate_key(source))
    if translated is None:
        return match.group(0)
    return attr + '="' + html.escape(translated, quote=True) + '"'

def build(name):
    source = (ROOT / name).read_text(encoding="utf-8")
    output = source.replace('<html lang="ko">', '<html lang="en">')
    for before, after in (
        ('="./assets/', '="../assets/'),
        ('="./styles.css', '="../styles.css'),
        ('="./script.js', '="../script.js'),
        ('="./news.css', '="../news.css'),
    ):
        output = output.replace(before, after)
    output = re.sub(r">([^<>]+)<", translate_node, output)
    output = re.sub(r'\b(placeholder|title|alt|aria-label)="([^"]*)"', translate_attribute, output)
    output = re.sub(r"<title>[\s\S]*?</title>",
                    "<title>" + html.escape(TITLES[name]) + "</title>", output, count=1)
    output = re.sub(r'<meta name="description" content="[^"]*" ?/?>',
                    '<meta name="description" content="MYV connects consumers, prosumers and selected brands through value-driven commerce and shared growth." />',
                    output, count=1)
    if 'name="robots"' not in output:
        output = output.replace("</head>", '<meta name="robots" content="noindex,follow" />\n</head>', 1)
    output = re.sub(r'(<button[^>]*class="lang-button )is-active("[^>]*>\s*KR\s*</button>)',
                    r'\1\2', output)
    output = re.sub(r'(<button[^>]*class="lang-button)("[^>]*>\s*EN\s*</button>)',
                    r'\1 is-active\2', output)
    output = re.sub(r'(<span class=")is-active(">KR</span>)', r'\1\2', output)
    output = re.sub(r'<span>EN</span>(?=\s*</div>)',
                    '<span class="is-active">EN</span>', output)
    if name == "prosumer.html":
        output = re.sub(r"won\.format\((direct|asset|activity|total)\) \+ '원'",
                        lambda m: "'KRW ' + won.format(" + m.group(1) + ")", output)
    if name == "contact.html":
        output = output.replace(
            "https://jyhome1228-cyber.github.io/myvbrand/contact-thanks.html",
            "https://jyhome1228-cyber.github.io/myvbrand/en/contact-thanks.html"
        )
        output = output.replace(
            '[MYV 홈페이지] 새로운 문의가 접수되었습니다.',
            '[MYV English Website] New Inquiry'
        )
    if name == "news.html":
        output = re.sub(r'src="\./news-archive\.js\?v=[^"]+"',
                        'src="./news-archive.js?v=' + VERSION + '"', output)
    output = output.replace("</body>",
                            '<script src="./locale-switch.js?v=' + VERSION + '"></script>\n</body>', 1)
    remaining = [m.group(1).strip() for m in re.finditer(r">([^<>]+)<", output)
                 if re.search(r"[가-힣]", m.group(1)) and len(m.group(1).strip()) < 400]
    if remaining:
        raise ValueError(f"{name}: untranslated Korean text: {remaining[:5]}")
    (EN / name).write_text(output, encoding="utf-8")
    return name, len(output)

if __name__ == "__main__":
    for page in PAGES:
        name, size = build(page)
        print(f"Synced en/{name} ({size:,} bytes)")
    (EN / "thank-you.html").write_text(
        (EN / "contact-thanks.html").read_text(encoding="utf-8"), encoding="utf-8"
    )
    print("Synced en/thank-you.html alias")
