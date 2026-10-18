# MYV English Website — Draft (2026-10-18)

## Pages and URLs

- `/en/` / `index.html` — Home
- `/en/about.html` — About
- `/en/business.html` — Business
- `/en/prosumer.html` — Prosumer program and illustrative calculator
- `/en/partner.html` — Brand partnerships
- `/en/news.html` — English working translations of all 38 news headlines
- `/en/news.html?article=<id>` — Same-page article detail
- `/en/vpoint.html` — V.Point concept and illustrative examples
- `/en/contact.html` — Contact form
- `/en/privacy.html` — Interim English privacy notice
- `/en/thank-you.html` — Contact-form acknowledgement page

English pages use `site.css` and `site.js` within this directory. Shared logos, illustrative assets and `news-posts.json` are taken from the existing Korean site.

## Korean/English switch

- Korean pages: their KR/EN UI is wired by the root `script.js` to the corresponding `/en/` URL.
- English pages: the KR link returns to the matching Korean URL; news detail preserves the article ID.
- Shopping stays linked to the original external `https://myv.co.kr/`.

## Draft / approval checklist

1. **News:** The 38 English headlines are working translations. Thirty articles still show the original Korean body on their in-page detail views, and the remaining eight have no migrated body copy. Do not present these as complete English articles.
2. **Prosumer and V.Point:** Rates, bonus conditions and sample calculations are strictly explanatory; confirm current operational rules and approved international copy before publication.
3. **Privacy:** Current English notice is preliminary. Confirm data processing and external form handling before any official launch.
4. **Contact:** Submission uses FormSubmit to `info@myv.co.kr`; the service must be authorized and tested with the mailbox owner.
5. **SEO:** All English pages temporarily set `noindex,follow` until copy, legal review and functionality are approved.
6. **Responsive QA:** Verify navigation, typography, image sizing, calculator, all inquiry fields, links, and mobile breakpoints on the deployed website.

## Editorial direction

Use clear, internationally readable business English without promising fixed returns, guaranteed incentives or verified global business outcomes. Maintain the Korean site's main navigation structure and MYV blue/white visual direction.
