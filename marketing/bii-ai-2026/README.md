# BII News: AI in hospitality, handover

Print article for BII News, the British Institute of Innkeeping's members' magazine: **"Five ways to put AI to work in your pub"** (547 words, limit 550), with a short version, **"Three ways to put AI to work in your pub"** (298 words, limit 300), if the BII has less room. Both end with Peter's invitation to call or email him. Copy deadline: Friday 13 November 2026.

## Files

- `print-copy.md`: both versions, the bio box and the footer strip, with designer notes. Only one version is printed.
- `bii-ai-2026-qr.svg` and `bii-ai-2026-qr.png`: the QR code for the short link. Use the SVG for print.

## What the code encodes

Peter's short link on `l.the-anchor.pub`, which counts every scan. It points at the full guide:

`https://www.orangejelly.co.uk/guides/ai-for-pubs?utm_source=bii&utm_medium=print-magazine&utm_campaign=ai-for-pubs-2026`

The short link is `https://l.the-anchor.pub/mkucbz`, created on 15 October 2026 in The Anchor's management app (named "BII News: AI for Pubs guide (print QR)", owned by Peter). It is in the footer strip of `print-copy.md`. The QR code was made and read back with:

```bash
python3 tasks/bii-articles-2026/make-qr.py https://l.the-anchor.pub/mkucbz marketing/bii-ai-2026 bii-ai-2026-qr
```

```bash
swift tasks/bii-articles-2026/read-qr.swift marketing/bii-ai-2026/bii-ai-2026-qr.png https://l.the-anchor.pub/mkucbz
```

- The short link leads to a missing page until the guide is live on production.
- Peter can change where the short link points in the management app, but the printed code itself can never change.

## Print notes

- Print the code at 25 mm square.
- Keep the white border around it. Do not crop into it.
- Keep it black on white.
- Test a printed proof with two or three phones before going to press.
