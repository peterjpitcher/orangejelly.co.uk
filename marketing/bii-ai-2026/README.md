# BII News: AI in hospitality, handover

Print article for BII News, the British Institute of Innkeeping's members' magazine, in two lengths. The BII prints one of them. Copy deadline: Friday 13 November 2026.

## Files

- `ai-in-pubs-550-words.md`: **"Five ways to put AI to work in your pub"**, 546 words (limit 550), with the bio box and footer strip.
- `ai-in-pubs-300-words.md`: **"Three ways to put AI to work in your pub"**, 298 words (limit 300), with the same bio box and footer strip.
- `QR-code-AI-in-pubs-guide.png`: the QR code for the footer strip, 2220 x 2220 px, black on white. It is the only QR file: Peter asked for PNG only on 16 October 2026.

Both articles end with Peter's invitation to call 07990 587315 or email peter@orangejelly.co.uk.

## Where the code leads

The QR code encodes the short link `https://l.the-anchor.pub/mkucbz`, created on 15 October 2026 in The Anchor's management app (named "BII News: AI for Pubs guide (print QR)", owned by Peter). The shortener counts every scan and redirects to the full guide:

`https://www.orangejelly.co.uk/guides/ai-for-pubs?utm_source=bii&utm_medium=print-magazine&utm_campaign=ai-for-pubs-2026`

Peter can change where the short link points in the management app, but the printed code itself can never change.

Made and checked with:

```bash
python3 tasks/bii-articles-2026/make-qr.py https://l.the-anchor.pub/mkucbz marketing/bii-ai-2026 QR-code-AI-in-pubs-guide
```

```bash
swift tasks/bii-articles-2026/read-qr.swift marketing/bii-ai-2026/QR-code-AI-in-pubs-guide.png https://l.the-anchor.pub/mkucbz
```

`make-qr.py` also writes an SVG; it is not supplied.

```bash
node tasks/bii-articles-2026/count-words.mjs marketing/bii-ai-2026/ai-in-pubs-550-words.md marketing/bii-ai-2026/ai-in-pubs-300-words.md
```

## Print notes

- Print the code at 25 mm square. The smallest safe size is 20 mm.
- Keep the white border around it. Do not crop into it.
- Keep it black on white.
- Test a printed proof with two or three phones before going to press.
