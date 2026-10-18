# MYV Visual Asset Mapping (2026-10-18)

This update integrates the 17 images provided by the designer via Nineworks R2 CDN. Images are **linked from CDN URLs**, not copied into the repository.

## Icon placement

| Supplied file number | Meaning | Korean page | English draft |
|---|---|---|---|
| image-1 | V.Point / shopping reward | V.Point overview | V.Point explanatory example |
| image-2 | Verification / reliability | Business — Proof | Business — Proof |
| image-3 | Product / value delivery | Business — Global Engine | Business — Global Engine |
| image-4 | Vision / growth | About — Vision | About — Vision |
| image-5 | Mission / valuable consumption | About — Mission | About — Mission |
| image-6 | Network ecosystem | Business — Domestic Engine | Business — Domestic Engine |
| image-7 | Experience | Prosumer — Experience | Prosumer — Experience |
| image-8 | Product discovery | Prosumer and Partner — Step 1 | Partner — Step 1 |
| image-9 | Relationship / trust | Prosumer — Relationship | Prosumer — Relationship |
| image-10 | Quality verification | Prosumer and Partner — Step 2 | Partner — Step 2 |
| image-11 | Sustainability / recurring value | Prosumer — Sustainability | Prosumer — Long-Term Thinking |
| image-12 | Price competitiveness | Prosumer and Partner — Step 3 | Partner — Step 3 |
| image-13 | Final selection | Prosumer and Partner — Step 4 | Partner — Step 4 |

The English draft currently describes product curation on the Partner page; the Korean Prosumer page also includes its own four-step curation section.

## Hero background placements

- `frame-1`: Prosumer (mobile shopper photo)
- `frame-15`: V.Point (coin stacks photo)
- `frame-94`: Business (globe photo)
- `frame-117`: Partner (partnership handshake photo)

Hero photographs are implemented using `--myv-hero-photo` in HTML and an accessible blue overlay in CSS. They are decorative backgrounds, not content-replacement images.

## Typography and responsiveness

- Korean site: Home maximum 53px; subpage headings approximately 47–49px.
- English draft: Home maximum 61px; subpages maximum 51px.
- Mobile headings are scaled down separately.
- Icons use contained 98px and smaller frames, with responsive adjustments to avoid overflowing cards.
- CSS URLs were cache-busted to `20261018-visual02` on both language versions.

## Verification notes

GitHub source inspection confirmed 13 distinct icon files, 4 distinct photo files, and updated stylesheet links. Live-screen checks and external CDN image-load tests could not be performed from the available execution environment. Review actual desktop/mobile rendering before approving the public design.
