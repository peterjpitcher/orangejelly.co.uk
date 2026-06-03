# BII Summer 2026 — QR code handover

QR code for the British Institute of Innkeeping magazine feature
**"Five ways to turn summer footfall into summer revenue"** (issue landing ~24 July 2026).

## Files
- `bii-summer-2026-qr.svg` — vector, **use this for print** (scales to any size with no quality loss).
- `bii-summer-2026-qr.png` — 2220 × 2220 px raster, for digital use or quick previews.

## What it encodes
The QR points to the short link **`https://www.orangejelly.co.uk/summer`**, which redirects to the summer hub:

`/licensees-guide/summer-pub-marketing?utm_source=bii&utm_medium=print-magazine&utm_campaign=summer-2026`

The redirect is a temporary (307) redirect defined in `next.config.js`, so the destination can be **repointed each year without reprinting** the code. Tracking lands in GA4 via the UTM tags above.

## Print notes
- Print at **2 cm × 2 cm or larger** for comfortable arm's-length scanning.
- Keep the white quiet-zone border around the code — do not crop into it.
- Keep it **black on white**; tinting reduces scan reliability.
- Test a printed proof with two or three phones before going to press.
