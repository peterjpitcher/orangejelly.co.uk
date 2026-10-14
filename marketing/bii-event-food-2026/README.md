# BII News: event food and allergens, handover

Print article for BII News, the British Institute of Innkeeping's members' magazine: **"Seven food checks before your next party booking"** (292 words). Copy deadline: Friday 13 November 2026.

The BII verifies this article's food safety and allergen content before it prints. The note at the top of `print-copy.md` asks them to and gives the source for each check. If they change anything, the guide at `/guides/pub-event-food-safety-allergens` is changed to match.

## Files

- `print-copy.md`: the note to the BII, the article, the bio box and the footer strip, with designer notes.
- `bii-event-food-2026-qr.svg` and `bii-event-food-2026-qr.png`: not made yet. They are made from Peter's short link once it exists (see below). Use the SVG for print.

## What the code encodes

Peter's short link on `l.the-anchor.pub`, which counts every scan. It points at the full guide:

`https://www.orangejelly.co.uk/guides/pub-event-food-safety-allergens?utm_source=bii&utm_medium=print-magazine&utm_campaign=event-food-2026`

Until Peter creates it, the footer strip says `l.the-anchor.pub/CODE`. Once he has, replace `CODE` in `print-copy.md`, then make and check the code:

```bash
python3 tasks/bii-articles-2026/make-qr.py https://l.the-anchor.pub/<code> marketing/bii-event-food-2026 bii-event-food-2026-qr
```

```bash
swift tasks/bii-articles-2026/read-qr.swift marketing/bii-event-food-2026/bii-event-food-2026-qr.png https://l.the-anchor.pub/<code>
```

- The short link leads to a missing page until the guide is live on production.
- Peter can change where the short link points in the management app, but the printed code itself can never change.

## Print notes

- Print the code at 25 mm square.
- Keep the white border around it. Do not crop into it.
- Keep it black on white.
- Test a printed proof with two or three phones before going to press.
