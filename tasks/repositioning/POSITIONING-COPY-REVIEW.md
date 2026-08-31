# Positioning copy review

**Reviewed against:** `docs/brand/positioning-overview.md` (supplied 31 Aug 2026, D46).
**Also binding:** `CLAIMS.md`, `tasks/repositioning/decisions.md` D1 to D47, house style.
**Date:** 31 August 2026.

---

## 1. The verdict in three sentences

The site is roughly three quarters of the way to the document: the method, the candour, the two-way qualification, the operator credibility and the price-free conversation-first entry are all already there and correct. What is missing is the top of the message, because the two lines section 37 asks to be preserved exactly appear nowhere on the site, the word "strategic" has been dropped from the category line in nine places, and the largest line on the homepage leads with the reader's problem rather than their ambition. Three real breaches and three gaps, all of them concentrated in the hero, the metadata and the navigation rather than in the body copy, which means this is a short, high-leverage set of edits rather than a rewrite.

---

## 2. What already matches, and should not be touched

- **The method.** HEAR, CHALLENGE, BUILD, OPTIMISE on `/how-we-work` is exactly section 6's diagnose-before-prescribing philosophy, and OPTIMISE closes on "a recommendation to scale it, change it or stop", which is section 20's become-redundant principle written into the product.
- **Candour as a feature.** "what we do not have.", "what we will not do.", the six exclusions on `/start-here` and the withdrawal of retired metrics are section 16 and the empathetic-and-uncompromising tension of section 31 doing real work. Do not soften these to make the site friendlier.
- **The operator credibility, correctly voiced.** The About band "we run a business, not just a practice." carries sections 17 and 18 in company voice with real substance behind it, which is precisely what D47 asked for. `/results` does the same with "proven where the risk was ours."
- **The free first hour, and no price.** D3, D8, D11 and D12 are implemented consistently, and the qualification lists are the filter D3 said something would have to become.
- **The claims discipline.** Every number on the site is one of the five in `CLAIMS.md`, expressed as a percentage and attributed to The Anchor.
- **The refusal to be defined by hospitality.** The sector is contained in `/pub-marketing` and `/licensees-guide`, and the positioning gate stops it leaking back into the company description.
- **The meta descriptions on the repositioned pages.** These are genuinely good and are not part of any finding below.

---

## 3. What contradicts the document

### 3.1 The homepage leads with the reader's problem, not their ambition

**File:** `src/app/page.tsx:62` (H1) and `:31` (title tag).

**Current copy**

> H1: `you bring the growth problem. we build the solution.`
> Title: `Orange Jelly | You bring the problem. We build the solution.`

**Breaches:** section 27 (the primary emotional proposition is "For business owners ready to take control of growth"), section 34 ("the homepage should lead with possibility and growth, not with endless descriptions of what is wrong", and "problem" flagged as overused in customer-facing copy), section 37 and D46 (that line is one of two to preserve exactly). Verified: "take control of growth" appears nowhere in `src/app` or `src/components/oj`, and neither does the word "strategic".

The construction also casts the visitor as the person with the problem and Orange Jelly as the party it is handed to. That is the supplier relationship section 36 says the company is not in.

**Replacement**

H1 (`src/app/page.tsx:62`):

```
for business owners ready to take control of growth.
```

Standfirst (`src/app/page.tsx:65-67`), which keeps section 31's marketing-led-but-solution-agnostic tension intact:

```
We work out what is actually blocking growth, build the strategy to move it, and turn that
into action. Sometimes that is marketing. Often it is not.
```

Title tag (`src/app/page.tsx:31`), at 58 characters against the existing 65-character gate:

```
Orange Jelly | For owners ready to take control of growth.
```

The title drops the word "business" only because "Orange Jelly | For business owners ready to take control of growth." is 67 characters and `src/test/page-metadata.test.ts` caps titles at 65. The H1 carries the line exactly, which is where it matters.

**Moves together, or the build fails:** `src/app/page.tsx` lines 31, 62 and 65-67, `tasks/repositioning/copy/homepage.md` section 1, and the assertion at `src/test/homepage.test.tsx:18`.

### 3.2 The category line is missing the word that differentiates it

**Files:** `src/app/page.tsx:59` and `:33`, `src/app/layout.tsx:78` and `:153`, `src/app/manifest.ts:18`, `src/lib/llms.ts:22`, `src/lib/feeds.ts:28`, `src/app/about/page.tsx:23` and `:59`, `src/app/pub-marketing/page.tsx:88`.

**Current copy** (the homepage eyebrow, and the same paraphrase in eight other places)

> `growth partner for ambitious businesses`

**Breaches:** section 27's category statement is "Orange Jelly is a strategic growth partner for ambitious businesses", section 37 names it one of two foundational lines to preserve exactly, D46 records that requirement in the repo's own words, and section 26 lists "a strategic growth partner" as the first thing Orange Jelly is. Section 8 is why the word carries load: strategy sits above the individual solutions, and without it "growth partner" leaves open exactly the reading section 25 says to prevent, that this is simply a marketing agency.

Verified: `grep -rn "strategic" src/` returns zero results. The wording predates the document by three days, so this is drift rather than a rejected choice, and section 33 lists "Strategy" as language that fits.

**Replacements, one word each**

`src/app/page.tsx:59` (eyebrow):

```
strategic growth partner for ambitious businesses
```

`src/app/page.tsx:33` (152 characters):

```
Strategic growth partner for ambitious small and mid-sized businesses. We work out what is
actually blocking growth, then build the thing that fixes it.
```

`src/app/layout.tsx:78`:

```
A strategic growth partner for ambitious small and mid-sized businesses. We get under the
skin of a business, work out what is actually blocking growth, and build the thing that fixes it.
```

`src/app/about/page.tsx:23` (156 characters):

```
A strategic growth partner for ambitious businesses, small on purpose. Where the thinking
came from, what we will not do, and who you would be dealing with.
```

Then the same one-word insertion at `src/app/layout.tsx:153`, `src/app/manifest.ts:18`, `src/lib/llms.ts:22`, `src/lib/feeds.ts:28`, `src/app/about/page.tsx:59` and `src/app/pub-marketing/page.tsx:88`, plus the mirrored copy sources `tasks/repositioning/copy/homepage.md:15` and `tasks/repositioning/copy/about.md`.

Fix the visible pages and the machine-read metadata in the same pass. Doing only the metadata would leave AI assistants reading "strategic growth partner" while visitors read something weaker. The existing assertions in `src/test/homepage.test.tsx:24` and `src/test/llms.test.ts:20` use substring and regex matching, so they survive the change.

### 3.3 The SEO override table still publishes the old position, and a price

**File:** `src/lib/seo-overrides.ts:9-12`.

**Current copy**

> ```
> '/': {
>   title: 'Hospitality Marketing From a Real Publican | Orange Jelly',
>   description:
>     'Hospitality marketing proven at a real pub. We grew table bookings 403% and food revenue 98% at The Anchor. Packages from £375 + VAT.',
> ```

**Breaches:** section 25 (not simply a marketing agency, not a supplier of predetermined packages), sections 1 and 11 (hospitality is a market and marketing is a capability, neither defines the company), and D3 (no prices anywhere). The `/about` entry at line 781 is the same problem, reading "Hospitality Consultant: Meet the Team Behind Orange Jelly" and describing The Anchor as Peter's, against D21.

Both are inert today only because those two pages export their own metadata. The file already makes this argument itself at lines 61 to 68, where the rescue page's override was deleted rather than renamed for exactly this reason. It matters more here because `/fix-my-pub` proves the refactor is the house pattern, not a remote possibility: it keeps a static export but routes it through `generateMeta`, and its override renders live.

**Replacement:** delete the `'/'` and `'/about'` entries and leave the same style of comment the rescue entry got.

```
  /*
   * The '/' and '/about' overrides are deleted rather than updated.
   *
   * Both pages export their own metadata, so these never rendered. They still
   * described the company as hospitality marketing from a publican, and '/' quoted a
   * package price on a site that has neither (D3). Kept, they were one refactor away
   * from becoming the site's front door again.
   */
```

Trim the 2026-08-09 truncation-fix comment above the `/about` entry at the same time, since it will no longer describe anything.

**Found while verifying this, and live today.** Four pages read their description from this table through `generateMeta`, so four search results currently publish a price against D3, and one publishes the founder's first person against D21 and D47:

| Path | Line | What is live |
|---|---|---|
| `/fix-my-pub` | 789 | "I run one myself... Packages from £375 + VAT." |
| `/pub-marketing-agency` | 59 | "From £375 + VAT." |
| `/empty-pub-solutions` | 72 | "From £375 + VAT." |
| `/quiet-midweek-solutions` | 77 | "From £375 + VAT." |

All four pages retire at phase 4, so the cheapest correct fix is to delete the price sentence from those four descriptions now and let the redirects handle the rest. `/fix-my-pub` also needs its first-person sentence replaced, for example: "Tell us what is happening and we will tell you where the revenue is going."

---

## 4. What the document asks for that the site does not yet do

### 4.1 Strategy is invisible, on the pages that explain the offer

Across the whole repositioned site the word "strategy" appears twice: once in a capability tile on `/solutions`, and once on `/how-we-work` inside a list of failures (`src/app/how-we-work/content.ts:82`, "Handing over a strategy the business cannot actually implement."). None of section 8's strategic questions is asked anywhere: what are we building, who is it for, where should the company grow, what should we stop doing, what type of business do we want to become.

The consequence is structural. Section 27's supporting proposition has three beats, uncover what is holding growth back, build the strategy, turn it into action. HEAR and CHALLENGE deliver the first, BUILD and OPTIMISE deliver the third, and the middle beat is absent. A reader finishes `/how-we-work` confident that Orange Jelly can find and fix what is wrong, and with no reason to believe it operates in business strategy at all. That is the entire distance between "growth partner" and "strategic growth partner".

**Two edits.**

First, stop the one appearance of the word being a criticism of it. `src/app/how-we-work/content.ts:82` becomes:

```
'Handing over a plan the business cannot actually implement.',
```

This must change together with `tasks/repositioning/copy/how-we-work.md:147`, because `src/test/how-we-work-page.test.tsx:103` asserts the two match.

Second, add a paragraph to the "why a method, and not just experience." band, immediately before "It also decides when to stop", and mirror it in the copy source:

```
The method serves a bigger question. Before we work out what is blocking growth, we agree
where the business is going: what you are building, who it is for, where it should grow, and
what it should stop doing. Plenty of businesses this size have never had that conversation
properly, and it is usually the reason two sensible people can look at the same numbers and
disagree about what to do.
```

The opening deliberately avoids setting up a second sequence, because the page closes on "the order is the method."

### 4.2 Eight page titles are filing labels

Every repositioned page's title is its navigation label plus the brand: "Growth problems | Orange Jelly" (30 characters), "How we work | Orange Jelly" (26), "Results | Orange Jelly" (22), "Insights | Orange Jelly" (23), "Start here | Orange Jelly" (25), "About | Orange Jelly" (20), "Contact | Orange Jelly" (22), "What we build | Orange Jelly" (28). The project's own standard, quoted in `src/test/page-metadata.test.ts`, is 50 to 60 characters, so roughly half of what a search result shows goes unused on all eight. None of them says anything about growth, partnership or who this is for, which is section 32's confident and commercial tone reaching a reader who has not arrived yet.

There is also a live regression: `/results` used to render "Pub Marketing Results: What Actually Moved the Numbers" (53 characters) from the override table, and now renders 22 characters, because the page stopped calling the shared helper.

**Replacements, all between 45 and 60 characters, every phrase lifted from the pages' own approved copy**

```
src/app/growth-problems/page.tsx:19  → 'Eight places growth gets stuck | Orange Jelly'
src/app/how-we-work/page.tsx:18      → 'How we work: hear, challenge, build, optimise | Orange Jelly'
src/app/results/page.tsx:21          → 'Results: what changed and by how much | Orange Jelly'
src/app/insights/page.tsx:28         → 'Insights on growth in smaller businesses | Orange Jelly'
src/app/start-here/page.tsx:31       → 'Start here: the first conversation is free | Orange Jelly'
src/app/about/page.tsx:21            → 'About: a growth partner, small on purpose | Orange Jelly'
src/app/solutions/page.tsx:25        → 'What we build to unlock growth | Orange Jelly'
src/app/contact/page.tsx:19          → 'Contact: tell us what is happening | Orange Jelly'
```

### 4.3 Nothing in the navigation says what the company builds

**File:** `src/components/oj/SiteChrome.tsx:52-59` and `:146-152`.

`/solutions` is live, sits in the sitemap at priority 0.8 and is titled "What we build", and nothing on the site links to it. Not the header, not the footer, not any page body. Phase 4 redirects `/capabilities` to it, so on the day that release ships the company's only statement of capability will be an orphan. Section 11 asks specifically that marketing stay visible throughout the site because it is commercially important and highly credible, and today the header has six items and none of them says what Orange Jelly does. Section 10's message, that Orange Jelly chooses the right tools for the job, has nowhere to land.

Separately, the professional services hub, which D13 makes the lead sector, is a footer link inside a column titled "Reading". That files a market the company serves as something to read, which is the same class of mislabelling the comment directly above it says was fixed for the guides.

**Replacement.** Add `'solutions'` to `OjNavKey` and this item to `ITEMS` after `'how-we-work'`:

```
  { key: 'solutions', label: 'What we build', href: '/solutions' },
```

And split the sector out of "Reading" in `OjFooter`:

```
        {
          title: 'Sectors',
          links: [
            { label: 'Professional services', href: '/sectors/professional-services' },
            { label: 'Hospitality', href: '/licensees-guide' },
          ],
        },
        {
          title: 'Reading',
          links: [
            { label: "The Licensee's Guide", href: '/licensees-guide' },
            { label: 'Insights', href: '/insights' },
          ],
        },
```

If seven header items is one too many, put "What we build" in the footer's "Start" column instead and leave the bar at six. Either way it has to exist in the chrome before phase 4 ships. Note that the hospitality sector hub is `/licensees-guide` under T072, not `/pub-marketing`, which is why the Sectors entry points there and duplicates the Reading link. If that duplication bothers you, drop the Hospitality row and leave Sectors as the one lead-sector link.

---

## 5. The one judgement call

**It is not the founder-voice question, which you already closed.** D47 on 31 August settled the tension between D21 and sections 17 and 18: company voice, with the operating experience visible rather than implied. The copy is on the right side of it. About says "we run a business, not just a practice." and names The Anchor as a real trading business with a wage bill and suppliers, which satisfies sections 17 and 18 by substance rather than by grammar, exactly as D47 requires. Nothing in this review asks you to revisit it.

**The live call is the homepage hero versus problem-first entry.**

Section 34 says the homepage should lead with possibility and growth. D8 and D11 say the entry is always a conversation about a problem, and the primary button reads "Bring us the problem". Both are yours, and 3.1 puts them a few pixels apart: an H1 about taking control of growth, with a button about bringing a problem.

**Recommendation: make the change in 3.1 and keep the button exactly as it is.** The two are not in conflict once they sit at different levels. The H1 is who this is for and what they get, which is what filters an ambitious owner in. The button is what happens next, and "Bring us the problem" is a low-commitment, honest instruction rather than a description of the reader. Section 27 wants the primary line to filter for ambition; D11 wants the action to be a conversation rather than a purchase. Both survive.

**The alternative, if you disagree:** keep the problem-first H1 and put the section 37 line in the eyebrow above it. That is cheaper and safer, but it gives the biggest type on the site to the one line section 34 warns against, and the eyebrow is the smallest text in the hero. I would not do it.

---

## 6. What this review did not cover

- **The 105 hospitality guide articles under `/licensees-guide` and the blog markdown in `content/blog` were not read.** They earn 92.9% of the site's search clicks, they are article content rather than positioning copy, and D14 protects them. If you want them assessed against the document that is a separate and much larger job, and the honest starting question is whether the document is meant to govern them at all.
- **The legacy pages scheduled for phase 4 retirement were not reviewed as copy.** `/ways-to-work` and its four children, `/capabilities`, `/fix-my-pub`, `/empty-pub-solutions`, `/quiet-midweek-solutions`, `/compete-with-pub-chains`, `/pub-marketing-agency`, `/pub-marketing-no-budget` and the three `/services` pages still carry the old position and the old chrome. They retire on release day, so only the parts that are live in search today are reported, in 3.3.
- **No live site was fetched.** Everything here was checked against the working tree on `main`, including line numbers, character counts and the tests and gates that pin each string.
- **Visual design, layout and accessibility were out of scope.** This is a copy review only.
- **The enquiry form, transactional email and the acknowledgement copy were not assessed** beyond confirming they carry no price and no response-time promise.