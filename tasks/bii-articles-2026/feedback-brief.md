# BII articles: feedback brief

**For:** the agent gathering Peter's feedback · **Written:** 14 October 2026 · **Copy deadline:** Friday 13 November 2026

Your job is to talk the four pieces below through with Peter and hand back one feedback document. Do not edit any of the files: the agent that wrote them makes the changes, because most of the wording is tied to sources and checks that are easy to break.

## The four pieces

Two printed articles for BII News, the British Institute of Innkeeping's members' magazine, and the two full guides on orangejelly.co.uk that their QR codes lead to.

| # | Piece | What it is | Where to read it |
|---|---|---|---|
| 1 | AI in hospitality, print | "Five ways to put AI to work in your pub" (542 words) and a short version, "Three ways..." (292 words). Only one is printed. | `marketing/bii-ai-2026/print-copy.md` |
| 2 | AI in hospitality, guide | "AI for Pubs: What Is New, What Works and Where to Start": what has changed, set-up, twelve prompts to copy, the shortcut signs, house rules and a one-page policy, a first month, and the tasting-night example. | http://localhost:3010/guides/ai-for-pubs (source: `content/blog/ai-for-pubs.md`) |
| 3 | Event food and allergens, print | "Seven food checks before your next party booking" (292 words), with a note at the top asking the BII to verify it. | `marketing/bii-event-food-2026/print-copy.md` |
| 4 | Event food and allergens, guide | "Party and Event Food: The Allergen and Safety Rules for Pubs": law and advice side by side, booking form, buffets, plated functions, other people's food, batch cooking, team briefing, what to do if something goes wrong, and an event-day checklist. | http://localhost:3010/guides/pub-event-food-safety-allergens (source: `content/blog/pub-event-food-safety-allergens.md`) |

The pages run on a local dev server from branch `feat/bii-event-food-article`. If the addresses do not load, ask Peter to have the writing agent restart it. Headings show in lower case on screen: that is the site's house style, not an error.

The specs behind all four are in `tasks/bii-articles-2026/` (`README.md`, then one spec per article). Read them only if you need to know why something is worded as it is.

## What good feedback looks like

Get Peter's view on these, piece by piece:

1. **Does it sound like him?** Tone, word choice, anything he would never say.
2. **Is anything wrong about his own business?** Especially the tasting-night example in pieces 1 and 2. It says The Anchor has run tasting nights for years, that the ideas are its own, and that AI helps plan each one, handle messages with suppliers, design the artwork and build an app to run the night, with guests rating each drink on their phones.
3. **For the print pieces:** which AI version the BII should get (long or short), whether the headlines and introductions grab a licensee, and whether each piece makes someone want to scan the code.
4. **For the guides:** anything missing that a licensee would expect, anything too long, unclear or patronising, and the order of sections.
5. **Anything he wants added.** Note it, but read the limits below first.

## What cannot change without coming back to the writer

These are not off limits, but each needs a source or a decision, so flag them rather than settling them in the conversation:

- **Word limits on the print pieces.** The long AI version must stay 500 to 550 words; the short version and the event food piece 300 at most. The bio box and footer strip do not count. Any addition needs an equal cut.
- **Facts, figures, dates, laws and menu names.** Every one comes from a checked source. A new fact needs a source; a changed one needs re-checking.
- **"The law" and "FSA advice" labels** in the event food pieces. They are the reason the piece is accurate in 300 words: never swap or drop one.
- **Numbers about The Anchor.** Only five approved percentages exist (`/CLAIMS.md`), and none may be tied to AI. The event food guide uses one (private hire bookings up 567%).
- **Greene King.** Not named anywhere; Peter agreed on 14 October. The site never calls Greene King a partner.
- **The bio**, which Peter approved on 14 October.
- **Seasons and dates in print.** The issue date is not known, so print copy mentions no season, month or "this year".

## Already known and in hand

No need to raise these:

- The footer strips say `l.the-anchor.pub/CODE` and there are no QR codes yet. Peter is creating the two short links.
- Peter confirms three ChatGPT menu names on a signed-in account before print; OpenAI's help pages could not be read automatically.
- The BII verifies the event food article itself before it prints.

## What to hand back

One Markdown file, `tasks/bii-articles-2026/feedback-round-1.md`, with:

1. **Decisions** Peter made (for example, long or short AI version), one line each.
2. **Changes**, grouped by piece (1 to 4). For each: the exact current text quoted, what Peter wants instead (his words if he gave them), and why. Mark each one **must** or **nice to have**.
3. **New facts or claims** Peter wants added, each with where it came from (Peter, a document, a web page), so the writer can check it.
4. **Open questions** Peter could not answer on the spot. List them; do not answer them yourself.

Keep Peter's own wording wherever he gave it. Do not rewrite the pieces yourself: proposed wording is welcome, but the writer checks it against the word limits and sources before using it.
