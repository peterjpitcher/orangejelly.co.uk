# BII articles 2026: build specs

**Written:** 13 October 2026, updated 14 October 2026 with Peter's answers · **For:** the agent that writes and builds the two articles · **Owner:** Peter Pitcher
**Branch:** `docs/bii-article-specs` · **Status:** specs and research only. No article, guide, short link or QR code exists yet.
**Deadline:** the copy goes to the BII by Friday 13 November 2026. Peter asked on 14 October 2026 for a first draft that week.

Read this file to the end before you open either spec. Its rules are part of both specs.

---

## 1. What you are building

Two short expert articles that Orange Jelly supplies to the British Institute of Innkeeping (BII) for its members' magazine, BII News. Each one carries a QR code that leads to a full guide on orangejelly.co.uk.

| | Article 1 | Article 2 |
|---|---|---|
| Subject | AI in hospitality | Food compliance and allergen handling at parties and events |
| Printed length | 500 to 550 words, plus a second version of 300 words at most | 300 words at most |
| Full guide | `/guides/ai-for-pubs` | `/guides/pub-event-food-safety-allergens` |
| Printed link (also in the QR code) | A short link on Peter's shortener, `l.the-anchor.pub/<code>`. Peter creates it (section 6.1). | The same, a second short link |
| Where Peter's short link points | `https://www.orangejelly.co.uk/guides/ai-for-pubs?utm_source=bii&utm_medium=print-magazine&utm_campaign=ai-for-pubs-2026` | `https://www.orangejelly.co.uk/guides/pub-event-food-safety-allergens?utm_source=bii&utm_medium=print-magazine&utm_campaign=event-food-2026` |
| Spec | `article-1-ai-in-hospitality-spec.md` | `article-2-event-food-allergens-spec.md` |
| Handover folder you create | `marketing/bii-ai-2026/` | `marketing/bii-event-food-2026/` |

Files in this folder:

| File | What it is |
|---|---|
| `README.md` | This file: the rules and the build steps shared by both articles |
| `article-1-ai-in-hospitality-spec.md` | Everything specific to Article 1 |
| `article-2-event-food-allergens-spec.md` | Everything specific to Article 2 |
| `count-words.mjs` | Checks the printed copy against its word limit |
| `make-qr.py` | Makes the print-ready QR code |
| `read-qr.swift` | Reads a QR code image back, to prove what it encodes |
| `proofs/` | Each print plan assembled once, to prove it fits its word limit. Not approved copy, see section 4.3 |
| `research/` | The evidence behind the specs. Background only, see rule 2.3 |

## 2. How to work from these specs

### 2.1 Order of work

1. Read this README, then `article-1-ai-in-hospitality-spec.md`.
2. Build Article 1 completely, on its own branch, through to section 9 (definition of done).
3. Only then read `article-2-event-food-allergens-spec.md` and build Article 2, on its own branch.

Do not work on both at once. They touch the same lines in the same files (section 7), and each has a different sign-off.

### 2.2 Branches and commits

- Work in a git worktree under `.claude/worktrees/`, never in the main folder: other sessions run servers and builds there. Link `node_modules` and `.env.local` from the main folder into the worktree.
- Branch names: `feat/bii-ai-article` and `feat/bii-event-food-article`.
- Start the Article 1 branch from `docs/bii-article-specs`, because the specs and the three tools live there. If that branch has already been merged, start from the latest `origin/main` instead. Start the Article 2 branch from the Article 1 branch unless Article 1 has been merged. Say in the hand-back which base you used.
- Stage files by name. Never `git add -A` and never `git add .`.
- Commit when lint, type-check, tests and build all pass. Message format: `feat(blog): add guide, <title>` for the guide and its wiring, `docs(marketing): add BII <subject> print copy and QR code` for the handover folder.
- **Do not push, open a pull request, merge or deploy.** Stop at a local commit and report. Peter decides when it goes further.

### 2.3 The three rules that matter most

1. **Use only the facts in the spec.** Each spec has a fact bank. Every law, figure, date, product feature, organisation name and web address you write must come from it. Statements in a fact bank are approved wording: use them as written, or split one across two sentences, but never change a figure or the words must, should, may and can. If you think a fact is missing or wrong, do not add or change it: finish what you can and report it in the hand-back. The files in `research/` are background for Peter. They contain claims that were not approved for use. Never lift a fact from `research/` that is not also in a fact bank.
2. **Never guess when the repo disagrees with the spec.** If a file, a line, a count or a command output is not what the spec says, stop that step, carry on with the steps that do not depend on it, and report exactly what you found.
3. **Never make the copy stronger than its source.** The specs label every compliance statement as LAW, GUIDANCE or GOOD PRACTICE. Section 4.6 says which words go with which label.

### 2.4 Things you must not do

- Do not invent a statistic, a quotation, a customer, a case study, a price or an example of what The Anchor does. The specs list the only first-hand statements you may make.
- Do not look for extra facts on the web. You may open the source links in a fact bank to confirm they still say what the spec says (section 8.4). If one has changed, report it. Do not rewrite the fact yourself.
- Do not edit any existing guide in `content/blog/`. Thirty of them are protected and a test fails if one moves.
- Do not change a check script or a test to make it pass, apart from the test edits listed in section 7.
- Do not run any script in `scripts/` that this README does not name.

## 3. Decisions already made

These are settled. Build to them.

| # | Decision | Why |
|---|---|---|
| D1 | Both guides go in `content/blog/` and render at `/guides/<slug>`. Not `content/insights/`. | The readers are licensees. The guides collection is the hospitality library and is where the BII summer 2026 page pointed. |
| D2 | The printed link and the QR code are a short link on Peter's shortener, `l.the-anchor.pub`. Never the guide's address. | Peter's decision, 14 October 2026. The shortener counts every click and scan, as it did for the summer 2026 page, and Peter can repoint the link in The Anchor's management app for as long as the magazine is in circulation. |
| D3 | The guides live at their standard addresses (section 1). Nothing is added to the site for the printed link: no redirect, no alias. | Peter's short link points straight at the guide, so a second redirect on our own domain would only add a second thing to track and keep alive. |
| D4 | Tracking is `utm_source=bii&utm_medium=print-magazine&utm_campaign=<name>-2026`, carried by the short link's destination (section 1), never printed. | The summer 2026 short link carries exactly these tags, so the campaigns compare like for like. |
| D5 | Article 1's long and short versions share one short link and one QR code. | Only one of them is printed. |
| D6 | The AI guide's next step is the growth problem `using-ai-intelligently`. The event food guide's is `operations-slowing-us-down`. | The first is the page about where AI pays. The second matches the two existing compliance guides. |
| D7 | Guide categories: `operations` for the AI guide, `events` for the event food guide. | AI is used across the business, not only in marketing. The event guide belongs beside the event guides a licensee reads when planning a party. |
| D8 | No hero photograph unless Peter supplies one. Set `featuredImage` to `/images/blog/default.svg`, a file that already exists. | Every existing guide has a photograph and you cannot make one. Pointing at a file that does not exist puts a dead address into the site's structured data. With the default the guide renders cleanly with no hero. |
| D9 | Each article is its own branch and its own commit set. | One concern per change, and the compliance article has a slower sign-off. |
| D10 | The printed pieces follow the layout BII News used for Orange Jelly's summer 2026 page (section 4.1). | It is the only direct evidence of what the editor expects, and it worked. |
| D11 | Each guide's path goes into the `PRINTED` list in `src/test/printed-urls.test.ts` (section 7). | The short link points straight at the guide, so renaming or deleting the guide would send every scan to a 404, and nobody would know until Peter looked. The test fails first. Proven on 14 October 2026: with the path listed, the test fails while the guide file is missing and passes once it exists. |
| D12 | Article 2's print copy opens with a note asking the BII to verify it (Article 2 spec, section 5.4). | Peter's decision, 14 October 2026: the BII checks the content itself. |

### Peter's answers, 14 October 2026

| # | Question | Answer | What it means for you |
|---|---|---|---|
| A1 | Does the word limit cover the bio box and footer strip? | No: the article only. | The limits in section 4.3 apply to the article blocks. The furniture block has its own limit and is supplied separately. |
| A2 | Which issue? | Not named. The copy deadline is 13 November 2026. | Neither article mentions a season, a month, Christmas or "this year": the issue may come out after Christmas. |
| A3 | Is the bio right? | Yes, as written in section 4.7. Peter also confirmed that The Anchor is a tenancy, not a lease. | Use the bio word for word. Section 4.7 says how The Anchor may be described. |
| A4 | Which printed link? | Peter's `l.the-anchor.pub` shortener, pointing at the guide's standard address. | Decisions D2 to D4, and section 6. |
| A5 | What format does the BII want? | Not asked. Still assumed: the Markdown file in section 4.2. | Do not create Word or PDF files unless Peter asks. |
| A6 | Who checks Article 2? | The BII verifies it itself. Peter signs off both articles. | Put the note from the Article 2 spec at the top of its print copy (D12). |

### Feedback round 1, 14 October 2026

Peter's feedback (gathered by an interview agent, `feedback-round-1.md`) changed these rules. Where they conflict with anything below, they win.

- **AI pieces:** only the long print version goes to the BII. AI is framed as a well-managed business partner: the publican sets direction, standards and decisions. Both AI pieces end with Peter's personal invitation to call 07990 587315 or email peter@orangejelly.co.uk (contact details from `CONTACT` in `src/lib/constants.ts`). The AI readiness assessment is background reading, not the main next step.
- **New first-hand facts, from Peter on 14 October 2026:** The Anchor's website was built with AI, with Peter setting the direction; AI helps develop food ideas once something catches his eye (his example: black garlic, not a claimed trend); each event starts from one approved brief that feeds posts, emails, event pages and booking details; one back-office system, built with AI's help, covers table and private bookings, events, marketing email and SMS, customer records, pre-paid parking, receipts and customer invoices, mileage, Machine Games Duty, short links and reporting (scope checked against the management app's sections the same day).
- **Not used:** Peter's estimate of £4,000 to £5,000 a year in reduced software costs (unverified, and not one of the approved claims), and any revenue figure tied to AI. Automated review replies are described as an option under an approved process, not as something The Anchor does: no such automation was found in the management app.
- **Food piece, 15 October 2026: print only.** Peter decided not to host a food safety guide on orangejelly.co.uk (too risky). The print article has no QR code, short link or web address. On 16 October 2026 he asked for one version only: the 287-word article; the long version was deleted. Only Article 1 needs a short link. Corrections from Peter's food safety verification are listed in `marketing/bii-event-food-2026/README.md`.
- **Food pieces:** strictly educational, with no Orange Jelly invitation. They add a bought-in food example (sausage rolls and sandwiches). The Anchor's A4 allergen sheets are not mentioned and not supplied: Peter decided on 15 October 2026 that their compliance is unconfirmed.

## 4. The printed copy: rules for both articles

### 4.1 How BII News lays out a page

This is the anatomy of "Five ways to turn summer footfall into summer revenue" (BII News, Summer 2026, page 52), read from the printed page. Build to it.

| Order on the page | What it was | Length on that page |
|---|---|---|
| 1 | An introduction in bold above the headline: two or three sentences that set up the problem | 61 words |
| 2 | The headline, plain and number-led | 9 words |
| 3 | A byline sentence in the third person: "Here, Peter Pitcher MBII suggests five things that he believes every pub should be doing, or doing better, this summer:" | 20 words |
| 4 | Five numbered sections, each with a short instruction as its subhead and one or two short paragraphs | about 400 words |
| 5 | A bio box with a headshot, set apart from the article | about 115 words |
| 6 | A footer strip: one line about Orange Jelly, "For more information visit:", a short link and a QR code | about 30 words |

What that means for you:

- There is no "By Peter Pitcher" line. The contributor is named in the byline sentence, with the letters MBII after his name.
- Sections are numbered, and each subhead is an instruction of two to six words ("Keep your Google listing fresh").
- Numbered steps in the running text, bullets only inside a box.
- A statistic is attributed in the same sentence to a named source.
- The article and the furniture (bio box, footer strip) are separate things. You supply both.

### 4.2 The file

Write the printed copy to `marketing/<handover folder>/print-copy.md`. Use this shape exactly. The word counter depends on it.

```markdown
# BII article: <working title> (print copy)

**For:** BII News, the British Institute of Innkeeping · **Supplied by:** Orange Jelly · **Status:** draft v1, <date>

<Article 2 only: the note to the BII, word for word from section 5.4 of its spec. Article 1 has no note.>

Designer notes are backticked labels in square brackets. They are not for print and are not counted.

<!-- PRINT-BLOCK id="<article block id>" min="<min>" max="<max>" must="Peter Pitcher MBII" -->

`[INTRODUCTION, bold, above the headline]`
<two or three sentences>

`[HEADLINE]`
# <headline>

`[BYLINE SENTENCE, bold]`
Here, Peter Pitcher MBII <what he sets out>:

`[SECTION 1]`
## 1. <instruction>
<body>

`[BOX: <how the box should be set>]`
## <box title as printed>
<box copy>

`[LAST LINE]`
<the line that sends the reader to the code>

<!-- /PRINT-BLOCK -->

<!-- PRINT-BLOCK id="<furniture block id>" min="20" max="<max>" must="l.the-anchor.pub/" -->

`[BIO BOX, with headshot]`
<bio from section 4.7>

`[FOOTER STRIP, with QR code: <file name>.svg, 25 mm square, black on white, keep the white border]`
<footer line from the spec, ending with the short link>

<!-- /PRINT-BLOCK -->
```

- Every word between a pair of `PRINT-BLOCK` comments prints and is counted, except the backticked `[LABELS]`. Anything outside the blocks, such as Article 2's note to the BII, is neither printed nor counted.
- A box title that should print goes on its own line as a `##` heading. The `[BOX: ...]` label itself never prints.
- Use `##` for a printed subhead, `-` for a bullet inside a box, `**bold**` for emphasis. No tables: a magazine column is too narrow.
- Article 1 has two article blocks in one file, the long version first, then one furniture block.

### 4.3 Word limits

| Block id | What it holds | Minimum | Maximum | Aim for |
|---|---|---|---|---|
| `a1-long` | Article 1, long version | 500 | 550 | 530 to 550 |
| `a1-short` | Article 1, short version | 260 | 300 | 285 to 300 |
| `a1-furniture` | Article 1 bio box and footer strip | 20 | 60 | as specified |
| `a2-print` | Article 2 | 260 | 300 | 285 to 300 |
| `a2-furniture` | Article 2 bio box and footer strip | 20 | 75 | as specified |

Check with:

```bash
node tasks/bii-articles-2026/count-words.mjs marketing/bii-ai-2026/print-copy.md
```

Every block must print `PASS`. The counter also fails a block that contains an em dash, a banned word from section 5.4, or that leaves out its `must` text. Paste the counter's output into the hand-back. Never report a word count you worked out yourself.

The counter is strict on purpose: it counts the way a word processor does, so a lone `/` or `@` is a word and so is a web address. Do not pad to reach a minimum and do not cut a locked sentence to get under a maximum. Cut your own sentences first.

The files in `proofs/` are each print plan assembled once, with sample wording where a spec says "yours", to prove the plan fits. All five blocks passed on 13 October 2026, and again on 14 October 2026 after Peter's changes. You may start from a proof, but it is not the deliverable: the sources have to be checked again first (section 8.4), the date line in Article 1's box has to be yours, and Peter has not approved a word of it.

### 4.4 The parts of a printed piece

| Part | Rule |
|---|---|
| Introduction | Two or three sentences in the second person or about pubs in general. It names the situation the reader is in. It does not mention Orange Jelly. |
| Headline | 6 to 11 words, plain, in sentence case. Number-led where the spec says so. No pun that hides the subject, no question the piece does not answer, no exclamation mark. |
| Byline sentence | One sentence, 14 to 24 words, starting "Here, Peter Pitcher MBII" and ending with a colon. |
| Numbered sections | Subhead of two to six words that tells the reader what to do. Then one or two paragraphs of one to three sentences each. |
| Box | A self-contained panel a designer can lift out. It must make sense to someone who reads nothing else on the page. |
| Last line of the article | Says what the full guide adds and tells the reader to scan the code. It does not print the web address: that is in the footer strip. |
| Bio box | The fixed wording in section 4.7. |
| Footer strip | One sentence on what the guide gives, then Peter's short link in full so it can be typed. |

### 4.5 Voice

The reader is a licensee: an owner, tenant or manager running a pub, usually short of time, and wary of anything that sounds like a sales pitch or a lecture. The BII says the vast majority of its members run independent pub businesses. Write as one operator to another.

- Plain English. Sentences under 25 words. One idea per sentence.
- Say what to do, in the order to do it. Prefer "Ask every guest about allergies in writing" to "It is advisable to consider allergy information at the booking stage".
- "You" and "your pub" for the reader. "We" for Orange Jelly and its own pub, The Anchor, and only for the statements a spec allows. Never "I".
- Explain any term a new licensee might not know the first time it appears.
- Calm and exact. No scare stories, no hype. Never write "game-changing", "revolutionary", "unlock", "supercharge", "in today's fast-paced world" or "AI will run your pub".
- British English: optimise, organise, colour, centre, licence (noun), license (verb), programme.
- No em dashes anywhere. Use a comma, a colon, brackets or a new sentence. (BII News uses long dashes itself and may put some back when it sets the page. That is the editor's choice, not yours.)
- Do not sell. Orange Jelly is named in the bio box and the footer strip and nowhere in the article. The only thing the article asks the reader to do is scan the code.

### 4.6 Words for law, guidance and good practice

| Label in the fact bank | Meaning | Words you may use | Words you may not use |
|---|---|---|---|
| LAW | A legal requirement in the nations named | "must", "the law requires", "it is an offence to" | "should", "ideally", "try to" |
| GUIDANCE | What a regulator recommends. Not a legal requirement. | "the Food Standards Agency says you should", "the regulator recommends", "best practice is", or a plain instruction ("Label each dish") | "the law says", "you are required to", "it is illegal" |
| GOOD PRACTICE | Sensible operating practice with no single official source | "we recommend", or a plain instruction ("Brief the team") | "must", "the law", "the rules say", "the regulator says" |

Two cautions:

- Some official guidance pages use the word "must" for things that are advice. Where a fact bank statement quotes one, it names the body that said it. Keep the attribution with the sentence.
- Where a rule differs between England, Wales, Scotland and Northern Ireland, the fact bank says so. Never state a rule for the whole UK unless the fact bank marks it UK-wide.

### 4.7 Fixed wording

Byline sentence: starts "Here, Peter Pitcher MBII" and ends with a colon. Each spec gives the full sentence.

Bio box, for both articles (assumption A3):

> PETER PITCHER MBII leads Orange Jelly, which builds websites, bespoke applications and connected systems that help businesses grow. He runs The Anchor in Stanwell Moor.

Footer strip pattern:

> <What the full guide gives, in one sentence.> Scan the code or visit l.the-anchor.pub/<code>

Print the short link without `https://`, so it is quick to type. Both forms reach the guide. Until Peter gives you the code, write `l.the-anchor.pub/CODE` (section 6.1).

Neither article needs to say how The Anchor is held. If it ever comes up: Peter confirmed on 14 October 2026 that The Anchor is a Greene King tenancy, never a lease, and Greene King is never called a partner. Do not describe the BII membership in any way other than the letters MBII. How those things are worded is Peter's decision.

### 4.8 What never appears in print

- A price, for Orange Jelly's work or for anybody's software.
- A statistic that is not in the fact bank with its source.
- A result claimed for The Anchor. That includes every figure printed in earlier BII News pieces about Peter.
- A named person other than the author.
- A named supplier or product that is not in the fact bank.
- A promise about what the reader will gain.
- Any of the words banned in section 5.4.

## 5. The guide: rules for both articles

### 5.1 Where it lives

Create `content/blog/<slug>.md`. The slug is fixed by the spec and must match the `slug` field. Each spec gives the complete front matter: copy it exactly, then set the two date fields to the day you build (format `2026-11-05`).

Never set a date in the future. The site treats a future `publishedDate` as "scheduled": the guide is left out of the build, the search index and the sitemap until that day, every test still passes, and the short link leads to a page that is not there. The dry run hit exactly this. The first command in section 8.3 is what catches it.

Do not add `hasFAQs`, `hasQuickAnswer`, `hasQuickStats`, `schema` or `ctaSettings`. Older guides carry them and nothing reads them.

### 5.2 Markdown that renders

Proven on 13 October 2026 by building two stub guides and reading the HTML that came out.

| You write | It renders as | Notes |
|---|---|---|
| A first line `# Title` | Nothing: it is removed | The page already prints the title as its only H1. Keep the line, as every existing guide does. |
| `## Heading` | An H2 and an entry in the contents list | The contents rail appears once there are three or more H2s. Keep H2s short. |
| `### Heading` | An H3 | Not in the contents list. |
| A pipe table | A table | Keep to four columns or fewer so it reads on a phone. |
| `- [ ] item` | A tick box list | Use for checklists. |
| `1. item` | A numbered list | Use for steps. |
| `` `text` `` | Inline code | Use for something the reader types, such as `/` or `@`. |
| `> text` | A block quote | Use for a prompt the reader can copy, or a script for staff. |
| `[text](/guides/slug)` | An internal link | Always a path starting with `/`. Never the full domain. |
| `[text](https://...)` | An external link | Official sources only, from the spec's source list. |
| Raw HTML | Nothing: it is stripped | Do not use any. |

Do not put a `## FAQ` or `## Frequently asked questions` heading in the body. The page builds its FAQ section from the `faqs` in the front matter, and a body heading that starts with "FAQ" or "Frequently asked" switches that off.

### 5.3 Length and shape

- 2,000 to 3,000 words in the body, unless the spec gives a different range.
- The opening three paragraphs say who the guide is for, what it covers and what it does not.
- Follow the section order in the spec. Do not add, merge or drop a section.

### 5.4 The gates that will stop you

| Gate | What it rejects | How to run it |
|---|---|---|
| Growth language | The words save, saves, saved, saving and savings, in any sentence. Write "frees up", "gives you the hours back", "cut", "keep", "store" or "bank" as fits. | `node scripts/check-growth-language.mjs content/blog/<slug>.md` |
| British English | optimize, analyze, behavior, favorite, maximize, recognize, prioritize, minimize, organize and organization, realize, apologize, flavor, neighbor, defense, specialty, traveled, canceled, center, labor, color, in every inflection | `npm run check:british-english` |
| Em dash | The em dash character, in any file you write | A write hook blocks the file |
| Retired wording | "growth partner", "Growth Fix", "Momentum Month", "Turnaround Intensive" | `npx vitest run src/test/retired-wording.test.ts` |
| Slugs | A guide slug that an insight already uses | `npm run check:slugs` |

Three traps, all real:

1. **The growth-language gate does not check guides when you run `npm run lint` or `npm run build`.** It checks them only when a file is passed to it by name, which is what the commit hook does. Run the command in the table yourself, with the file name, before you commit.
2. **The British English gate reads web addresses as text.** A link whose address contains one of those spellings (for example `/help-center/` or `/organization/`) fails the build. Every address in the spec source lists has been checked against this. If you ever need a different address and it contains one of those spellings, do not use it: report it.
3. **Software uses banned words as button names.** Several AI products have a setting or a button with "save" or "saved" in its name, and one company calls a page its "Privacy Center". Do not write those names. The specs give wording that avoids them.

The other content rules, which no script checks for you:

- Orange Jelly's own results may be quoted only as the five percentages in `/CLAIMS.md`, always naming The Anchor as our own venue, and only where a spec says so. Never tie one of them to AI: the site states plainly that AI's contribution has not been measured.
- A figure from somebody else (a regulator, a survey) may appear only if it is in the fact bank, and the sentence must name the source and link to it.
- No price for Orange Jelly's work. No named packages. No promise about how fast anyone will reply.
- Never describe Orange Jelly as a pub marketing agency, a hospitality marketing agency or a consultancy. If you need to say what it is, use: "Orange Jelly builds websites, bespoke applications and connected systems that help businesses grow."

### 5.5 Voice

As section 4.5, with more room. The guide may use "we" for what we do at The Anchor, but only for the statements a spec lists. It carries the detail the print piece has no space for, so precision matters more than pace.

### 5.6 Links

- Internal links: only to the paths a spec lists. Every one was checked as live on 13 October 2026.
- External links: only to the addresses in a spec's source list, and only to support the sentence they sit in.
- End each guide with a `## Sources` section listing every external source used, as a bullet list of links, followed by the line a spec gives for the date the sources were checked.

### 5.7 Hero image

Set `featuredImage: "/images/blog/default.svg"` (D8). If Peter supplies a photograph, it goes at `public/images/blog/heroes/<slug>.webp`, 1600 by 900 pixels, WebP, about 120 KB or less, and `featuredImage` changes to `/images/blog/heroes/<slug>.webp`.

## 6. Short link and QR code

Do this after the guide file exists.

### 6.1 The short link comes from Peter

The printed link and the QR code are a short link on Peter's shortener, `l.the-anchor.pub` (D2). It lives in The Anchor's management app, which only Peter uses. You cannot create one and must not try.

Peter creates each short link with the destination in section 1, word for word, and gives you its address. It looks like `https://l.the-anchor.pub/vj8wgo` (the summer 2026 one).

- **If Peter has given you the short link:** print it in the footer strip without `https://`, and make the QR code from it (sections 6.2 and 6.3).
- **If he has not:** write `l.the-anchor.pub/CODE` in the footer strip, skip sections 6.2 and 6.3, and say under "Anything that did not match the spec" in the hand-back that the short link and the QR code are waiting for Peter. Never make up a code, and never make a QR code from any other address.

Do not open the short link yourself, in a browser or with `curl`: every visit counts as a scan in Peter's figures. Peter checks it with a phone before press.

Add nothing to the site for the short link: no entry in `src/lib/route-manifest.js`, no redirect, no alias (D3). The only repo change it needs is the test edit in section 7.

### 6.2 Make the QR code

```bash
python3 tasks/bii-articles-2026/make-qr.py https://l.the-anchor.pub/<code> marketing/bii-ai-2026 bii-ai-2026-qr
```

It writes `bii-ai-2026-qr.svg` and `bii-ai-2026-qr.png` and prints what it encoded and the smallest safe print size. It refuses anything that is not a bare `https://l.the-anchor.pub/` short link. It needs the Python package `segno`, which is installed on Peter's Mac; if the import fails, stop and report, do not install anything.

### 6.3 Prove what the code says

```bash
swift tasks/bii-articles-2026/read-qr.swift marketing/bii-ai-2026/bii-ai-2026-qr.png https://l.the-anchor.pub/<code>
```

It must print `PASS`. This uses the QR reader built into macOS and does not touch the network. Paste the line into the hand-back.

### 6.4 Write the handover note

Create `marketing/<handover folder>/README.md`. Copy the structure of `marketing/bii-summer-2026/README.md`: what the piece is, the files, what the code encodes (Peter's short link), where it goes (the destination in section 1), and the print notes. Do not copy that file's statements about a redirect in `next.config.js`: they do not apply to these articles. Use these print notes: print at 25 mm square (larger than the smallest safe size `make-qr.py` prints, to leave a margin); keep the white border; keep it black on white; test a printed proof with two or three phones before going to press. Add two lines: the short link leads to a missing page until the guide is live on production; and Peter can change where the short link points in the management app, but the printed code itself can never change.

## 7. The repo edits every new guide needs

Proven on 13 October 2026, twice. The second time, both guides were built from the wording in the specs themselves (every fact bank statement, table, block, prompt, FAQ and source link), the edits below were made exactly as written, and `npm run lint`, `npm run type-check`, the full test suite in both time zones (128 files) and `npm run build` all passed. Everything was then reverted. Without the edits, two tests fail.

On 14 October 2026 the printed link moved to Peter's shortener. The site redirect and its two test edits were dropped, and edit 4 below replaced them. Edit 4 was proven on its own the same day: `npx vitest run src/test/printed-urls.test.ts` failed while the guide file was missing and passed, 25 of 25, once it existed. It was then reverted.

Do these in order. `N` is the number of guides after you add yours. Get it from the repo, never from memory:

```bash
ls content/blog/*.md | grep -vi readme | wc -l
```

It is 105 before either article, 106 after the first and 107 after the second.

| # | File | Change |
|---|---|---|
| 1 | `content/blog/<slug>.md` | New file: the guide. |
| 2 | `tasks/repositioning/data/article-next-steps.json` | Add one entry for the slug. The file is sorted by slug: keep it sorted. Since Article 1 was committed on 14 October 2026 it is indented with two spaces (the commit hook's Prettier reformatted it); match whatever indentation you find. The spec gives the entry and the neighbours it sits between. |
| 3 | `src/test/article-next-step.test.ts` | In the test named `covers all 105 articles` (the number in the name will be whatever it is now), change both `toHaveLength(...)` numbers to `N`, and change the number in the test's name to match. |
| 4 | `src/test/printed-urls.test.ts` | Add the guide's path to the end of the `PRINTED` array, with the comment line the spec gives (D11). This test is what stops anyone breaking a printed code later. Article 1 also changes one paragraph of the comment above the array; its spec gives the wording. |
| 5 | `src/app/insights/(list)/page.tsx` | The sentence "where there are {105} of these" prints the guide count. Change the number to `N`. |
| 6 | `marketing/<handover folder>/` | New folder: `print-copy.md`, the two QR files (once Peter has given you the short link), `README.md`. |

Do not touch `src/lib/route-manifest.js`, `src/test/route-manifest.test.ts` or the `PRINTED_ALIASES` array: the printed link is not on this site (D3).

Article 1 needs one more edit, given in its spec: `src/test/article-next-step.test.ts` also holds a list of growth problems that no guide leads to, and the AI guide empties it.

Leave every other mention of "105" alone. There are about twenty in code comments. They are history, not counts, and no test reads them.

## 8. Verify

Run all of this from the worktree, in this order. Do not report a step as passed unless you ran it and read its output.

### 8.1 Content checks

```bash
node scripts/check-growth-language.mjs content/blog/<slug>.md
npm run check:british-english
npm run check:slugs
node tasks/bii-articles-2026/count-words.mjs marketing/<handover folder>/print-copy.md
```

### 8.2 Code checks

```bash
npm run build:search
npm run lint
npm run type-check
npm run test:run
npm run test:utc
npm run build
```

`npm run build:search` comes first because a new worktree has no search index, and `src/test/search-index.test.ts` fails with "no such file" until one exists. That failure is not yours and not a reason to change the test.

Expected:

- `build:search` says the index was built with `N` items (section 7). If it says one fewer than you expect, your guide has a future date.
- Lint ends with six lines that each say "passed". It also prints one warning about `next/script` and `beforeInteractive`. That warning was there before you started: leave it.
- Type-check reports no errors.
- Both test runs report 128 files passed. On 13 October 2026 that was 2,187 tests passed in the first run and 2,188 in the second.
- Build ends with the route table and lists guides under `/guides/[slug]`.

### 8.3 Read what was built

After `npm run build`, confirm from the built files, not from the source. Replace `<slug>` first.

```bash
grep -o "<h1" .next/server/app/guides/<slug>.html | wc -l
```

```bash
grep -c "/guides/<slug><" .next/server/app/sitemap.xml.body
```

Expected, in order: `1`; `1`. If the first command says "No such file or directory", the guide was not built: check its date (section 5.1) and its `status`. Then delete `.next` so the worktree does not carry a stale build.

### 8.4 Check the sources still say it

Each spec has a source list with a "words to find" column. For every row: open the address, look for those words, and record yes or no in the hand-back. If the page has moved, changed or lost the wording, record that and change nothing. Regulators and software companies both rewrite their pages, and print cannot be corrected.

Some sites refuse automated readers (OpenAI's help pages did on 13 October 2026). If you cannot open a page, record "could not open" rather than yes. Do not treat a page you could not read as confirmed.

## 9. Definition of done, for each article

- [ ] The guide exists at the fixed slug, follows the spec's section order and is inside the spec's word range.
- [ ] Every fact, figure and address in the guide and the print copy is in the fact bank. Locked wording is word for word.
- [ ] Every print block passes `count-words.mjs`, and its output is in the hand-back.
- [ ] The guide's path is in the `PRINTED` array in `src/test/printed-urls.test.ts`. Nothing was added to `src/lib/route-manifest.js`.
- [ ] If Peter gave you the short link: it is in the footer strip, the QR code exists as SVG and PNG, and `read-qr.swift` prints `PASS` for it. If he did not: the footer strip says `l.the-anchor.pub/CODE` and the hand-back says so.
- [ ] Article 2 only: the note to the BII is at the top of `print-copy.md`, word for word.
- [ ] The handover folder holds `print-copy.md`, `README.md` and, once the short link exists, both QR files.
- [ ] All of section 8 passes, with nothing skipped.
- [ ] `git status -sb` shows only files this spec told you to create or change.
- [ ] Work is committed on the article's own branch. Nothing is pushed.

## 10. The hand-back

End with a report to Peter in this order:

1. **Outcome** in one sentence: built and verified, or what is not done and why.
2. **Where it is:** branch name, the branch you started from, commit ids, and "local only, not pushed".
3. **Word counts:** the pasted output of `count-words.mjs`.
4. **QR code:** the pasted output of `read-qr.swift`, or "waiting for Peter's short link".
5. **Checks:** one line each for lint, type-check, tests (both time zones) and build, with the totals you saw.
6. **Sources:** the yes, no or could-not-open list from section 8.4.
7. **Anything that did not match the spec**, exactly as found.
8. **What only Peter can do:** the list at the end of the article's spec.

## 11. Stop and report, do not improvise

- A source no longer says what the fact bank quotes.
- A locked sentence will not fit the word limit.
- A check fails and the cause is not in a file you created.
- The guide count, the test names or the `PRINTED` array are not as section 7 describes.
- The short link Peter gave you does not start `https://l.the-anchor.pub/`, or `make-qr.py` refuses it.
- You are about to write something about the law, a product feature, the BII or The Anchor that is not in a fact bank.

## 12. What these specs rest on

- Research was done on 13 October 2026 by six research passes, one topic each. The full dossiers are in `research/`.
- Every legal statement in the Article 2 fact bank was then read at the primary source by the spec's author on the same day: legislation.gov.uk for the law, GOV.UK for Food Standards Agency guidance, the NHS for the emergency steps.
- The Food Standards Agency moved its guidance from food.gov.uk to GOV.UK in June 2026. Old food.gov.uk links found in other documents may be dead. Use only the addresses in the source lists.
- The research ran out of web searches part way through. What that left unanswered is listed at the end of each spec under "Not settled". Nothing in a fact bank depends on those gaps.
- AI products change monthly. Everything about them in Article 1 was true on 13 October 2026 and must be checked again on the day you write and again before print.
- Peter answered the specs' open questions on 14 October 2026 (section 3). The tasting-night example in Article 1 comes from him, checked against The Anchor's event page and the tasting-night app's own product document the same day.
