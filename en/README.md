# MYV — Korean / English layout parity

## One layout, two languages

The **Korean HTML pages are the source of truth** for page structure, responsive layout, images, colors, animations and interactions.

English pages under `/en/` are built by translating Korean text in the same HTML, using the mapping in `en/translations.json`. Both languages load the same **`/styles.css`** and **`/script.js`**.

This replaces the earlier independently designed English landing pages. Do not reintroduce `en/site.css` or `en/site.js` into the mirrored pages.

## Synced page pairs

| Korean | English |
| --- | --- |
| `/index.html` | `/en/index.html` |
| `/about.html` | `/en/about.html` |
| `/business.html` | `/en/business.html` |
| `/prosumer.html` | `/en/prosumer.html` |
| `/partner.html` | `/en/partner.html` |
| `/vpoint.html` | `/en/vpoint.html` |
| `/news.html` | `/en/news.html` |
| `/contact.html` | `/en/contact.html` |
| `/privacy.html` | `/en/privacy.html` |
| `/contact-thanks.html` | `/en/contact-thanks.html` |

The legacy `/en/thank-you.html` URL mirrors `/en/contact-thanks.html`.

## Update workflow

1. Edit the Korean HTML for structure / UX / visual assets.
2. Add missing English phrases to `en/translations.json`.
3. Run `python en/build-en.py` from the repository root.
4. Review both languages, the prosumer calculation, the contact form and mobile layout.
5. Commit Korean changes together with regenerated `en/*.html` files.

`en/locale-switch.js` handles navigation back to the equivalent Korean page. News uses `en/news-archive.js` for English news titles and summaries, with `en/news-titles.json` as the editorial title map.

## Translation status

- All ten mirrored static pages have English interface and informational copy, including the calculator and contact form.
- News listing: 38 translated article titles and 30 translated summary excerpts.
- **The full body of legacy Korean news articles is still held in Korean** in the shared data. Translating article bodies requires separate editorial review; do not claim they are fully localized.
- Current English pages remain marked `noindex,follow` while translation and privacy/legal review are in progress.

## Acceptance checks

Structural parity: equal section counts, card counts, image sources and page links between each Korean/English page pair.

Visual QA still needed on real browsers for the 1920px and mobile views, after GitHub Pages deploys.
