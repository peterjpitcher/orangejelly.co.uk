# Greene King Spring Toolkit 2027: handover

Two pages for Greene King's Spring Toolkit (January to April 2027), commissioned by Charlotte Brown. Copy deadline: Thursday 22 October 2026. The toolkit reaches pubs by early December 2026, so the guide must be live before then.

## Files

**Send Charlotte the Word file, the QR code, the logo and the photo.**

- `Greene King Spring Toolkit 2027 - Plan your spring in an afternoon.docx`: the clean reading copy, with a short note for Charlotte at the top, the designer's notes in italics and the QR code shown in place at 25 mm. It is made from the Markdown file below with pandoc; change the Markdown, then remake the Word file (command below).
- `spring-toolkit-2027-two-pages.md`: the source, **"Plan your spring in an afternoon"**, about 1,070 words across two pages including the table. First draft, 16 October 2026.
- `QR-code-spring-guide.png`: the QR code, 2220 x 2220 px, black on white. PNG only, as for the BII pieces.
- `Orange-Jelly-logo.png` and `Orange-Jelly-logo-white.png` (1200 x 260 px, copies of `public/brand/logo-horizontal.png` and `public/brand/logo-horizontal-white.png`, the current orange-slice logo) for the Orange Jelly box. Never supply the 2025 "OJ" logo: Peter caught it in the first pack on 17 October 2026 and it has been deleted from the site.
- `Peter-Pitcher-headshot.jpg` (1254 x 1254 px): Peter's new headshot, supplied on 17 October 2026, for the byline.

Everything that goes to Charlotte is written as Peter, in the first person (Peter, 17 October 2026): "a photo of me", not "a photo of Peter".

Remake the Word file with the QR code embedded:

```bash
pandoc marketing/greene-king-spring-2027/spring-toolkit-2027-two-pages.md -f markdown-implicit_figures -t docx --resource-path=marketing/greene-king-spring-2027 -o "marketing/greene-king-spring-2027/Greene King Spring Toolkit 2027 - Plan your spring in an afternoon.docx"
```

## Decisions (Peter, 16 October 2026)

- Two pages, like the autumn playbook.
- Orange Jelly is shown, not labelled: the approved bio line, and "ready for change", which Peter chose over "open to change" because he wants eager people. The retired self-description stays out.
- The byline says The Anchor is a Greene King tenancy and gives its postcode, TW19 6AQ, so readers can look it up.
- One approved claim (table bookings, +403%), in the Orange Jelly box only and never tied to AI.
- Improvements approved the same day: printed prompts cut to about 30 words each (nobody types 70 words from paper), with a line about reading them out to the phone and the full versions behind the QR code; readers photograph the toolkit's own dates page and recipes as the AI's starting point; the payoff spelt out ("by teatime you will have..."); "more than 30 copy-and-paste prompts" as the reason to scan (the guide has 38); "in one quiet afternoon before Christmas" rather than "before the Christmas rush", because the toolkit lands in early December; the logo and photo supplied with the copy.
- Still to come: a real worked example (Peter runs the Mother's Day prompt with The Anchor's details; the guide shows what AI wrote and what he changed).
- Left out of our table, with a note to Charlotte: 7 April (National Beer Day is the American date; the UK's Beer Day Britain is 15 June).
- The Night of Excellence (Tuesday 6 April, Greene King's awards for its pubs) is in the table: the piece is for tenants, not customers (Peter, 16 October 2026). The line suggests AI for a first draft of an entry and tells readers to ask their BDM when entries close, because the 2027 dates are not published. The website guide stays general and leaves it out.

## Where the code leads

The QR code encodes the short link `https://l.the-anchor.pub/pe2ugy`, created on 16 October 2026 in The Anchor's management app (named "Greene King Spring Toolkit 2027: plan your spring with AI (print QR)", owned by Peter). It redirects to:

`https://www.orangejelly.co.uk/guides/plan-your-pub-spring-with-ai?utm_source=greene-king&utm_medium=print-toolkit&utm_campaign=spring-2027`

The printed address `orangejelly.co.uk/spring` is a temporary (307) redirect to the same place, declared in `src/lib/route-manifest.js` with the other seasonal addresses. Peter can repoint the short link in the management app; the printed code itself can never change. Nobody has visited the short link yet, so its count starts at zero.

Made and checked with:

```bash
python3 tasks/bii-articles-2026/make-qr.py https://l.the-anchor.pub/pe2ugy marketing/greene-king-spring-2027 QR-code-spring-guide
```

```bash
swift tasks/bii-articles-2026/read-qr.swift marketing/greene-king-spring-2027/QR-code-spring-guide.png https://l.the-anchor.pub/pe2ugy
```

`make-qr.py` also writes an SVG; it is not supplied.

## Print notes

- Print the code at 25 mm square. The smallest safe size is 20 mm.
- Keep the white border around it, and keep it black on white.
- Test a printed proof with two or three phones before going to press, once the guide is live.
