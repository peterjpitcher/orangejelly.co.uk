# Tier-one ranking briefs

**Task:** T079. **Closes:** gap G4.

Fourteen posts take 81% of the blog's clicks, and the blog takes 92.9% of the site's. These
are the briefs for improving them, one per post.

**Each brief tests one change.** That is deliberate and it is the part most likely to get lost.
Making three improvements at once and watching the number move tells you nothing about which
one did it, and on pages this valuable, not knowing is expensive.

**Position and CTR are different problems.** Every brief says which one it is diagnosing and
why. Conflating them is the usual reason this work fails: rewriting a title that was already
converting, or adding depth to a page nobody was seeing in the first place.

**Peter approves any change to these posts (T080).** Nothing here has been executed.

---

## christmas-pub-promotion-ideas

`/licensees-guide/christmas-pub-promotion-ideas` · 27 clicks · 1836 impressions · 1.47% CTR · position 11.81

**What the searcher wants.** Somebody typing "christmas pub ideas" wants a browsable list of things they could actually run in their pub in December: quiz nights, jumper days, wreath workshops, Boxing Day openings. They are shopping for ideas to pick from, not commissioning a planning methodology. Secondary intent, visible in "christmas party promotion" and "christmas marketing for hospitality", is how to sell the December offer once chosen. The commercial intent (Christmas packages, deposits, corporate bookers) is a different, later-stage query set that this page currently leads with.

**Diagnosis.** This is a POSITION problem, not a CTR problem. At an average position of 11.81 the expected CTR for an informational query is roughly 1.0 to 1.5%; the page delivers 1.47%, which is at or slightly above par. There is no CTR gap to close. The impression distribution confirms it: the three queries carrying 425 of the identifiable impressions sit at positions 15.55, 19.89 and 21.37, all page two, where zero clicks is the correct expected outcome. Rewriting the title would move 27 clicks to maybe 32. Moving the head term from 15.55 onto page one is worth an order of magnitude more.

The position is weak because of intent mismatch. The page is titled and structured as a planning and pricing guide, not an ideas list. The H1 leads "Start Planning Christmas Now"; the first three sections are planning order, package structure and plate-cost maths including an HMRC digression, and the body is roughly 2,100 words of which the actual ideas are 15 bullets across three scattered sections. The title promises 19 ideas the page does not enumerate. The exact phrase "christmas pub ideas" appears nowhere in the title, H1 or meta description. Google is being asked to rank a pricing guide for a listicle query against competitors who deliver the list.

Compounding it: three sibling pages target the same cluster. /christmas-pub-event-ideas ranks 10.62 on 146 impressions, /pub-christmas-bookings-fill-december at 6.42, /seasonal-pub-events-calendar at 5. This page and christmas-pub-event-ideas are competing for "christmas event ideas for pubs" from the same site, which splits the signal and caps both.

**The one change.** ONE change: rebuild the page so it actually is the 19-idea list it promises, with the ideas as the dominant, front-loaded body and the planning, pricing and deposit material relegated beneath them.

Concretely: consolidate the existing 15 scattered bullets, extend to a genuine 19, give each idea a named H3 with two or three sentences of how to run it (who it is for, when in December it fits, what it needs), and place that block immediately after the intro. The plate-cost worked example, HMRC exemption, deposits and terms, and the planning timeline all move below it as the "now sell it" half of the page.

The title and H1 change with it, because they are the surface of the same restructure, not a separate edit: lead with the ideas promise and carry the head phrase, e.g. "19 Christmas Pub Ideas That Fill December (And How to Sell Them)". Meta description follows suit.

Mechanism: this converts a pricing guide that Google ranks 15th for a listicle query into a listicle that answers it, while keeping every commercial section that makes the page useful. It targets position, which is where the loss is, and it does so without touching the URL or shedding the deeper content that earns the long tail currently producing the 27 clicks.

**Permitted:**

- Rewrite the H1 and frontmatter title to lead with the ideas promise and carry the phrase 'christmas pub ideas' naturally; keep it under roughly 60 characters where possible
- Rewrite metaDescription and excerpt to match the new ideas-first framing, British English, no prices
- Reorder the body: ideas block moves directly under the intro; pricing, HMRC, deposits, terms and timeline move below it
- Expand the ideas from 15 scattered bullets to 19 discrete named items, each with an H3 and two or three sentences of practical how-to
- Add or reorder H2/H3 headings to group the 19 ideas (evening events, daytime, community, the quiet fortnight, the Boxing Day to New Year window)
- Add frontmatter keywords already implied by the query data: 'christmas event ideas for pubs', 'christmas pub events ideas'
- Update quickAnswer to answer 'what Christmas ideas can I run in my pub' rather than 'when should I start planning'
- Add or amend FAQs to cover the ideas intent, e.g. what to run in the quiet first fortnight of December
- Fix the founder voice: 'I run The Anchor in Stanwell Moor as a Greene King tenant' becomes company voice referring to The Anchor as our own venue
- Restate the −89% no-shows claim in approved form with provenance: cut booking no-shows by 89% at The Anchor, our own venue
- Adjust internal links so the sibling Christmas pages point up to this one as the hub rather than sideways

**Not permitted:**

- Changing the URL or the slug frontmatter value; the URL is /licensees-guide/christmas-pub-promotion-ideas and it stays
- Deleting the pricing, deposits, terms or timeline sections; they move down the page, they do not go away
- Adding any new statistic, percentage or benchmark; only the five claims in CLAIMS.md may be quantified, as percentages, with The Anchor stated as our own venue
- Adding any Orange Jelly price, day rate or package name
- Adding a response-time promise of any kind
- First person singular anywhere; company voice, 'we', never the founder
- British English throughout, and none of the cost-reduction vocabulary the repo pre-commit hook blocks.
- Cutting the £34.95 / £8.10 / £150 worked examples for the sake of the claims rule; these are illustrative pub economics and HMRC's own figure, not Orange Jelly performance claims, and removing them strips the page's differentiator
- Redirecting, merging or deleting /christmas-pub-event-ideas as part of this change; the cannibalisation is real but it is a separate decision on a separate URL
- Removing the existing internal links to seasonal-pub-events-calendar, summer-pub-event-ideas, pub-christmas-bookings-fill-december or how-to-run-successful-pub-events
- Padding word count for its own sake; the page is already 2,100 words and depth is not the problem

**Success measure.** Primary: average position for 'christmas pub ideas' moves from 15.55 into the top ten, measured in GSC over the 28 days to mid-November 2026 (peak season for this term, so the read is clean). Secondary: page-level average position moves from 11.81 to under 9, and clicks over the December quarter exceed 27 (the full prior-year total). Deliberately NOT a success measure: CTR. At 1.47% against a position-11.81 par of 1.0 to 1.5% there is nothing to win there, and a CTR that dips while position climbs is the expected, healthy pattern.

**Risk if wrong.** Downside is contained: the URL, the internal link graph and every substantive section survive, so the worst case is a page that ranks as badly as it does now with a better structure. Two real risks. First, seasonality: this term peaks September to December, so a change landing now cannot be evaluated against a summer baseline and a naive mid-autumn read will look like a false win. Compare year on year, not month on month. Second, and larger, the restructure does not fix the cannibalisation. If /christmas-pub-event-ideas continues to compete for 'christmas event ideas for pubs' at position 10.62, this page may take the head term and still be capped on the plural-event variants. If position has not improved by January 2026, the next intervention is consolidation of the sibling, not a further rewrite of this page. Minor risk: moving the pricing material below the ideas could soften performance on the small set of commercial long-tail queries currently producing some of the 27 clicks; keeping those sections intact and headed, just lower, mitigates it.

---

## why-is-my-pub-empty

`/licensees-guide/why-is-my-pub-empty` · 24 clicks · 1183 impressions · 2.03% CTR · position 7.2

**What the searcher wants.** Somebody typing "empty pub" or "why is my pub so quiet" is a licensee at the panic stage. They want a diagnosis they can act on tonight, not a philosophy. Specifically they want to be told which of a small number of causes is theirs, in what order to check them, and what the first move is this week. Note the split intent in the SERP: a meaningful slice of "empty pub" impressions are property-security searches, so a portion of this page's impressions can never convert to clicks whatever we do.

**Diagnosis.** This is a POSITION problem, not a CTR problem, and the two must not be conflated here. At average position 7.2 the expected CTR band is roughly 2 to 3.5%. The page returns 2.03%, which is at the bottom of par rather than a failure. Strip out the ~66 impressions from security-intent queries ("securing empty pub", "empty pub security") that can never click, and effective CTR is ~2.15%. A title rewrite would therefore buy perhaps 10 to 15 extra clicks a year. Position 7.2 to position 3 buys 60 to 90. The lever is position. The reason position is stuck at 7 is structural, not editorial: the site runs five URLs at the same intent, all clustered at positions 5 to 10 and all starved of clicks (/licensees-guide/why-is-my-pub-empty 7.2, /licensees-guide/pub-empty-tuesday-nights 5.05, /empty-pub-solutions 9.85, /licensees-guide/fill-empty-pub-tables 9.14, /licensees-guide/fill-empty-seats-midweek-offers 7.77). Google has five candidates for one query set and commits to none. Worse, this page actively donates equity to three of its own rivals: it links out mid-body to fill-empty-pub-tables, revenue-levers-struggling-pubs and empty-pub-solutions, and gets nothing back. It is the strongest page in the cluster and it is subsidising the pages beating it down.

**The one change.** Make this page the hub of the empty-pub cluster and reverse the internal link flow into it. One change: point the primary in-body internal link of each of the four sibling pages (pub-empty-tuesday-nights, fill-empty-pub-tables, fill-empty-seats-midweek-offers, empty-pub-solutions) at /licensees-guide/why-is-my-pub-empty using intent-matched anchor text ("why your pub is empty", "diagnose an empty pub"), and demote this page's three outbound links to the same siblings to a single further-reading block at the foot rather than mid-body. That concentrates one clear canonical answer for "empty pub" instead of five diluted ones. Consolidation is the mechanism that moves average position; nothing else on this page plausibly moves it four places.

**Permitted:**

- Rewrite the four sibling pages' primary internal link to point at /licensees-guide/why-is-my-pub-empty with intent-matched anchor text
- Move this page's three mid-body outbound links (fill-empty-pub-tables, revenue-levers-struggling-pubs, empty-pub-solutions) into a single further-reading block at the foot
- MANDATORY COMPLIANCE, do these in the same pass: strip every unapproved number from the body and FAQs, specifically the £2,000 per week loss, 35 to 127 daily customers, £3,200 to £9,800 weekly revenue, 3 to 8 staff, TripAdvisor 3.2 to 4.6, the ~20% weekday revenue lift, the £500 lighting figure and the £50-200 event figure
- MANDATORY COMPLIANCE: delete the two pricing FAQs (£75 per hour plus VAT, packages from £375 + VAT) from both the frontmatter faqs block and the body FAQ section, and delete the 'Week 1 brings more website traffic and phone calls' response-time answer
- MANDATORY COMPLIANCE: convert the whole article from founder first person to company voice: 'When I took on The Anchor in 2019' becomes a 'we' construction, 'Monthly Landlord's Forum where customers tell me' likewise, and The Anchor is described as our own venue
- Delete the duplicated 'Frequently Asked Questions' section (the page carries two) and keep one
- Remove the 'Download our free Empty Pub Turnaround Toolkit' call to action, no such asset exists
- Rewrite metaDescription and excerpt in company voice, dropping 'From a landlord who's been there'
- Adjust H2 and H3 wording to carry natural query phrasing such as 'why your pub is quiet on weekdays'

**Not permitted:**

- Changing the URL, slug or filename, /licensees-guide/why-is-my-pub-empty stays exactly as it is
- Redirecting, deleting, noindexing or merging any of the four sibling pages, this is a linking change only
- Adding any statistic, percentage or figure that is not one of the five claims in CLAIMS.md, and any approved claim used must be a percentage with The Anchor named as our own venue
- Adding any price, hourly rate or package name anywhere on the page or in frontmatter
- Adding any response-time or timeframe promise ('results in 30 days', 'week 1 brings')
- Reverting to founder first person or naming Peter Pitcher in the body
- Changing publishedDate, or the featuredImage path
- Removing the FAQ section wholesale or the frontmatter faqs array, the schema is load-bearing
- American spelling, or any the cost-reduction vocabulary, the repo pre-commit hook blocks both
- Padding word count for its own sake, the page is already long enough to rank at 7

**Success measure.** Page-level average position for /licensees-guide/why-is-my-pub-empty in GSC, measured on a rolling 90-day window, falls from 7.2 to below 5.0 by end November 2026. Secondary: clicks exceed a 24 per year run rate. Guardrail: CTR must not drop below 2.0%, and combined clicks across all five cluster URLs (currently 28) must not fall. Position is the primary metric; if position moves and clicks do not follow, the next brief is a CTR brief, not this one.

**Risk if wrong.** The sibling pages lose their own long-tail. pub-empty-tuesday-nights currently sits at position 5.05 with 4 clicks and could slip if it starts pointing authority away. Worst realistic case is 4 clicks a year lost against a target of 60 or more gained. Fully reversible by restoring the original link targets, no URLs or content are destroyed. Second risk: if the 1,183 impressions turn out to be mostly security-intent long tail rather than licensee intent, better position converts poorly and the whole page is worth less than it looks. That is testable, not fatal, and would show up as position improving while clicks stay flat.

---

## oktoberfest-pub-guide

`/licensees-guide/oktoberfest-pub-guide` · 30 clicks · 798 impressions · 3.76% CTR · position 6.88

**What the searcher wants.** Somebody searching "oktoberfest ideas for pubs/bars" is a licensee or venue manager six to eight weeks out from late September, deciding whether to bother and what the night actually consists of. They want a runnable shopping list: which beer to order, what food a normal kitchen can plate on a busy Saturday, what the room should look like, and above all what people will DO for three hours. The query family is dominated by "ideas", "event ideas", "entertainment ideas", "party ideas" - the noun is ideas, plural and enumerable. Secondary intent is a fast factual check on the 2026 Munich dates, which the page already answers well.

**Diagnosis.** POSITION, not CTR, and the query table makes it close to unarguable. All 30 clicks come from the two queries where the page sits in the top five: "oktoberfest ideas for bars" (pos 4.42, 10.42% CTR) and "oktoberfest ideas" (pos 6.57, 9.52% CTR). Both are at or above the normal click curve for those slots, so the title and meta description are earning clicks whenever they are actually seen. Every query at position 10 or worse - "oktoberfest pub" (11.76, 21 impressions), "oktoberfest bar" (11.0), "ideas for oktoberfest" (11.5), "how to organise a beer festival" (17.6) - returns exactly zero clicks, which is what page two always returns. The 3.76% blended CTR at average position 6.88 is roughly par for position seven; it looks weak only because the average is dragged down by a long tail of page-two and irrelevant US queries ("columbus oktoberfest 2026", "helen georgia oktoberfest"). Rewriting the title would be fixing something that is not broken and would spend the one measurable change on the wrong lever. Two pieces of context sharpen this. First, the page only went live on 31 May 2026, so all 798 impressions were earned entirely out of season, in June to August; the Oktoberfest peak has not happened once in this data window. Second, the page is titled "Oktoberfest Ideas for Pubs" but never delivers a discrete list of ideas - the H2s are narrative (dates, beer, food, decoration, promotion) and the only activity mentioned anywhere is a single half-clause about a "best stein hold" moment. That is the gap: it half-ranks for the entertainment and activity variants because it half-covers them.

**The one change.** Add ONE new H2 section - "Oktoberfest games and entertainment ideas" - placed between "Music, decoration and atmosphere" and "Make it social: long tables and group bookings", giving eight to ten concrete, named, runnable activities in a scannable list (stein-holding contest, best-dressed lederhosen and dirndl prize, keg-tapping ceremony to open the night, pretzel-eating race, Oompah singalong or live band slot, Bavarian-themed quiz round, beer-mat flipping, hourly Prost toast, a garden relay if the weather holds). Nothing else on the page changes. The mechanism is topical coverage, not persuasion: the page's own head noun is "ideas", the entertainment and activity variants are exactly where it stalls at positions 7 to 12, and adding the one substantive section it is missing is the cheapest available way to deepen relevance for the whole "ideas" cluster at once. It also gives the piece a natural, quotable list block for AI answers and People Also Ask. Do it before mid-September so it is crawled and settled ahead of the seasonal peak; leaving the title and meta untouched means any movement is cleanly attributable to the section.

**Permitted:**

- Insert one new H2 section, 'Oktoberfest games and entertainment ideas', between the existing 'Music, decoration and atmosphere' and 'Make it social: long tables and group bookings' sections
- Write it as a scannable bulleted or numbered list of 8-10 named activities, each with one or two sentences of how to actually run it (kit needed, when in the night, who runs it)
- Delete the existing throwaway clause about 'a bit of stein-themed fun goes a long way too (a friendly "best stein hold" moment, that sort of thing)' from the 'Make it social' section, since the new section covers it properly - keep the responsible-retailing sentences that follow it
- Add one FAQ to both the frontmatter faqs array and the FAQs section at the foot of the page: 'What games can you play at an Oktoberfest?' with an answer drawn from the new section
- Add 'oktoberfest entertainment ideas' and 'oktoberfest event ideas' to the frontmatter keywords array
- Add 'how do I entertain people at an Oktoberfest' to voiceSearchQueries
- Add one contextual internal link from the new section to an existing guide where genuinely relevant (e.g. the Autumn Pub Playbook or how to run successful pub events)

**Not permitted:**

- Do not change the URL or the slug - it stays /licensees-guide/oktoberfest-pub-guide
- Do not change the title, the H1, the metaDescription, the excerpt or the quickAnswer in this pass - CTR is at par and changing them destroys attribution for the position change
- Do not add any statistic, percentage, benchmark, uplift figure or 'pubs typically see...' claim - only the five approved claims in CLAIMS.md exist and none of them belong here
- Do not add prices, price ranges, budgets, cost estimates, package names or 'from £' anywhere, including for steins, kegs or entertainment
- Do not add any response-time or turnaround promise to the CTA or body copy
- Do not include drinking games, speed-drinking, sculling, boat races, yard-of-ale, stein-downing or anything where alcohol volume or speed is the contest - the stein hold is a strength-and-endurance HOLD, and the existing responsible-retailing paragraph must survive intact
- Do not restructure, reorder, retitle or trim any existing section beyond the single deleted clause named above
- Do not touch the ctaSettings block, the schema block, the featuredImage or the publishedDate
- Do not shift to first person or reference the founder - company voice, 'we', and The Anchor is 'our own venue'
- British English throughout, and none of the cost-reduction vocabulary the repo pre-commit hook blocks.
- Do not add a second new section, a comparison table, or a conclusion - one section, then stop

**Success measure.** Measured over 1 September to 31 October 2026 in GSC, filtered to this URL. Primary: average position for the 'ideas' cluster - 'oktoberfest ideas', 'oktoberfest event ideas', 'oktoberfest entertainment ideas', 'ideas for oktoberfest' - improves, with 'oktoberfest ideas' reaching top three. Secondary: 'oktoberfest pub' clears page two (from 11.76 to single figures) and registers its first clicks. Guardrail: blended CTR does not fall below 3.5%, confirming the untouched title still converts. Because this is the page's first in-season window, judge position movement per query rather than total clicks - clicks will rise from seasonality regardless and will tell you nothing on their own.

**Risk if wrong.** Low downside, capped. Worst realistic case is that the section adds length without moving position, and a well-performing page carries 400 extra words that are genuinely useful to a licensee anyway - no ranking loss, no lost clicks, since title, meta and URL are untouched. The two real risks are self-inflicted rather than algorithmic. One: writing the section carelessly and including a drinking game, which would be a responsible-retailing failure on a piece aimed at licensees and far more damaging to Orange Jelly's credibility than any ranking gain is worth. Two: scope creep - if the executor also rewrites the title 'while they are in there', the September to October result becomes uninterpretable and the position lever cannot be evaluated. Both are avoided by holding to the forbidden list. Timing risk is the only genuine deadline: published after mid-September, the change misses the season and the next honest read is autumn 2027.

---

## summer-pub-event-ideas

`/licensees-guide/summer-pub-event-ideas` · 159 clicks · 10355 impressions · 1.54% CTR · position 16.82

**What the searcher wants.** Someone running a pub in April or May, staring at a garden and an empty diary, wanting a shortlist of formats they can actually staff and afford this season. They are shopping for ideas but they buy on feasibility: what does it cost to set up, who runs it, what happens if it rains. They are not researching licensing law, and they are not looking for a philosophy of events. They want to pick two or three things and put dates in the diary this week.

**Diagnosis.** This is a POSITION problem, not a CTR problem, and the data says so unambiguously. At average position 16.82, a 1.54% CTR is at or slightly above the normal curve for page two (typically 1-2%). The site's own comparators confirm the curve is behaving: autumn-pub-event-ideas sits at position 7.92 and earns 3.63% CTR with an almost identical title pattern; oktoberfest-pub-guide at 6.88 earns 3.76%; quiz-night-ideas at 12.11 earns 1.89%. The title is converting its share of the impressions it gets. There is no CTR gap to close, and a title or meta-description rewrite would be effort spent on the wrong variable.

Why it sits at 16.8 is the real question. The page has 10,355 impressions, more than any other page on the site, which means Google understands the topic and considers the page relevant to a very wide query set. It just ranks the page below fifteen or so competitors on nearly all of it. The structural cause is visible in the file: twenty formats delivered as twenty one-line bullets across four categories. "Garden games league. Boules, giant Jenga, cornhole. Buy once, run all summer, no ongoing cost." That is one sentence for a subtopic that has its own query ("pub garden games", position 29). The page is relevant to everything and the best answer to nothing, so it ranks broadly and shallowly. Summer is also the most contested seasonal term in this space, fought over by brewery, EPOS and supplier blogs that give each idea a proper section. Autumn ranks at 7.92 on 441 impressions because almost nobody competes for it; summer does not get that pass.

The genuinely good material on this page is the break-even maths section and the licensing detail, and neither of those is what the target queries ask for. The twenty ideas, which are what people came for, are the thinnest part of the page.

**The one change.** Give the formats depth. Convert the twenty one-line bullets into named H3 sections for the eight highest-demand formats (beer garden BBQ night, outdoor quiz, garden games league, street food pop-up, family and kids craft morning, dog show or community day, acoustic garden session, silent disco), each with 120-200 words covering setup, who runs it, how the evening actually goes, and the failure mode. Keep the other twelve as a scannable list underneath so the long-tail relevance is not lost.

The mechanism: the page currently earns 10,355 impressions of demonstrated topical relevance but cannot win any individual subtopic query because no subtopic gets more than a sentence. Giving each major format a heading and real how-to substance creates eight passages that can be the best answer to a specific query, instead of one page that is an adequate answer to forty. This is the change that moves average position; nothing about the title, the URL or the schema will.

Only one change. Do not also rewrite the title, do not also add FAQs, do not also touch the maths section. If the position moves, we want to know what moved it.

**Permitted:**

- Expand the eight named formats into H3 subsections with substantive how-to detail: kit needed, staffing, running order, timings, the common failure mode. Draw on how these are actually run at The Anchor, our own venue, described qualitatively.
- Add H3 headings using the natural query language people search: 'Beer garden BBQ night', 'Outdoor quiz', 'Garden games league', 'Street food pop-up', 'Family craft morning', 'Village dog show', 'Acoustic garden session', 'Silent disco'.
- Retain all twenty format names. The twelve not expanded stay as a bulleted list below the eight deep sections.
- Fix the first-person breach at line 53: 'I run The Anchor in Stanwell Moor' must become company voice, 'we' not the founder, with The Anchor described as our own venue. Same for 'It is the cheapest way I know to fill a garden' (line 103) and 'the ones I would actually put on a whiteboard'.
- Extend the existing planning-grid table to cover the eight expanded formats, keeping the same columns (setup cost, extra staff, weather risk, repeatable weekly) and the same qualitative scale.
- Update updatedDate in frontmatter.
- Add keywords to the frontmatter keywords array that match the new H3s, e.g. 'pub garden games', 'beer garden bbq ideas', 'outdoor quiz night'.
- Keep and lightly tighten the licensing, weather and safety section, and the break-even maths section. Both are differentiators. Do not delete either.

**Not permitted:**

- The URL must not change. The slug stays summer-pub-event-ideas and the path stays /licensees-guide/summer-pub-event-ideas. No redirect, no rename, no folder move.
- Do not rewrite the title or the metaDescription. The CTR analysis says they are working; changing them contaminates the measurement of the one change being tested.
- Do not add any statistic, percentage, result or performance figure. Only the five claims in CLAIMS.md may be quantified, only as percentages, only with The Anchor named as our own venue. Nothing on this page currently uses them and nothing needs to.
- Do not add prices for Orange Jelly work, hourly rates, package names or anything resembling a rate card. The existing figures in the maths section are illustrative licensee cost examples and stay as they are; do not add more, and do not reframe any of them as a result we produced.
- Do not add response-time promises, turnaround claims or availability statements anywhere, including the closing CTA.
- Do not merge, redirect or absorb summer-moments-simple-campaigns. It earns 33 clicks on distinct campaign intent and consolidation is an irreversible bet we are not taking on this pass.
- Do not remove any of the twenty formats. They carry the long-tail impressions.
- Do not remove the internal links to /licensees-guide/pub-event-ideas, /licensees-guide/pop-up-events-for-pubs, /licensees-guide/prs-ppl-music-licensing-pubs, /licensees-guide/summer-pub-marketing or /quiet-midweek-solutions.
- No American spelling. No the cost-reduction vocabulary, which the repo's pre-commit hook blocks. No em dashes.
- Do not change the publishedDate, the category, the featuredImage path or the existing FAQ set.

**Success measure.** Average position for /licensees-guide/summer-pub-event-ideas in GSC, measured over a 28-day window, compared against the same 28 days pre-change and against the site-wide position trend to control for seasonality. Target: 16.82 down to below 12 within 90 days of Google recrawling. Clicks are the lagging confirmation, not the primary read: at 10,355 impressions, moving from 16.8 to 11 should roughly double clicks on flat impressions.

Secondary read: position on the specific subtopic queries that got their own H3 ("pub garden games" from 29, "outdoor events ideas" from 31.58, "summer bar promotion ideas" from 20.37). If the mechanism is right, these move first and move most, because they are the queries the new sections were built to answer.

Guardrail: CTR must not fall below 1.5%. If position improves and CTR stays flat or drops, the title has become a mismatch for a better position and that is the point at which a title test becomes the right next change. Note the seasonality trap: measure the change from a summer baseline against a summer window, or wait for the 2027 season, because a spring-to-autumn comparison will show a collapse that has nothing to do with the edit.

**Risk if wrong.** The realistic downside is a partial rewrite that thins the long tail. This page's 10,355 impressions come from breadth, from forty-odd loosely related summer and garden queries the twenty bullets happen to touch. If the rewrite deepens eight formats and quietly drops or buries the other twelve, impressions fall and the page can end at a better average position on much less volume, which looks like a win in one column and is a loss in clicks. Keeping all twenty names is the mitigation and it is not optional.

The second risk is that the diagnosis is wrong and the ceiling is authority rather than depth: a site earning 969 clicks a year may simply lack the domain strength to hold a top-ten position on a term contested by brewery and supplier blogs, in which case a better page still sits at 15. That would show as improved rankings on the low-competition subtopic queries and no movement on the head term, which is a readable, informative outcome rather than a wasted pass.

The measurement risk is the largest practical one. Summer seasonality will swamp the signal if this is measured across the wrong months, and someone will read a natural autumn decline as damage from the edit and revert a change that was working. Fix the comparison windows before the edit ships, not after.

Downside is bounded: nothing structural changes, the URL is untouched, the existing rankings have no mechanism by which to collapse, and the edit is revertible with a git revert.

---

## quiz-night-ideas

`/licensees-guide/quiz-night-ideas` · 122 clicks · 6438 impressions · 1.89% CTR · position 12.11

**What the searcher wants.** A licensee or a volunteer host who has to fill a quiet Tuesday and needs a menu of specific rounds, themes and formats they can lift and run this week, plus the two or three parameters they cannot guess (how many rounds, how long it should last, what to give as a prize). The intent is browse-and-steal, not read-a-guide. It is served by pages that make the individual formats scannable and countable, and satisfied inside the SERP by AI Overviews and People Also Ask for the parametric half of the cluster.

**Diagnosis.** This is a POSITION problem, not a CTR problem.

Three pieces of evidence point the same way. First, where the page genuinely reaches the top ten it earns clicks at a normal or better rate: "pub quiz formats" 7.69% at position 8.69, "pub quiz rounds ideas" 6.67% at 15.93, "best pub quiz rounds" 14.29% at 21.57. A title that failed to earn the click would not produce those numbers. Second, banding the 171 quiz-related query rows by position shows CTR of 1.9% at positions 5 to 10, 1.42% at 10 to 20 and 0.95% beyond 20. That is a normal decay curve, not a snippet failure. Third, the site-wide 1.89% is an arithmetic artefact: the great bulk of the 6,438 impressions sit on page two and beyond, where near-zero CTR is the expected result, and averaging them against the small page-one slice drags the headline figure down. Fixing the title cannot rescue an impression at position 26.

The mechanism behind the weak position is on-page targeting mismatch. The title, the H1 and every heading say "quiz night". The demand says "pub quiz". Across the visible query set the "pub quiz *" family carries roughly 700 impressions and returns 12 clicks at an average position around 15 to 20, while the smaller "quiz night *" family holds position 7 to 10. The page ranks best on exactly the phrasing it is titled for and worst on the phrasing that carries the volume. The phrase "pub quiz" appears nowhere in the title, the H1, the metaDescription, the excerpt or any H2. It appears in the frontmatter keywords, which Google does not read.

There is a second, contributing mechanism worth naming but not fixing in this changeset: /licensees-guide/quiz-night-101 draws 3,615 impressions at average position 8.01, better than this page's 12.11, on what is plainly the same intent cluster. The site is competing with itself and Google is choosing between the two. Because the query export is not joined to pages this cannot be proven from the data to hand, only inferred, so treat it as the next hypothesis rather than this one.

**The one change.** Rewrite the title tag, the H1 and the metaDescription so the page is explicitly targeted at "pub quiz" as well as "quiz night", and so the three format modifiers that carry the zero-click impressions (rounds, themes, formats) appear in the title rather than only in the body.

Proposed title: "Pub Quiz Ideas: 26 Quiz Night Formats, Rounds and Themes". H1 matched to it. The metaDescription rewritten to lead with the same phrasing.

Why this one change and not another: it is the only intervention that addresses the specific gap the data shows, which is that the page ranks two pages deep on terms whose exact phrasing it does not contain in any element Google weights. It costs nothing in content, it is reversible in a single commit, and it keeps "quiz night ideas" in the title so the position-7.51 head term is not surrendered. Every other candidate change either adds content the page already contains in prose, or requires touching a second URL.

**Permitted:**

- Rewrite the `title` frontmatter field to lead with 'Pub Quiz Ideas' while retaining 'Quiz Night' and the number 26
- Rewrite the single H1 on line 49 to match the new title exactly
- Rewrite the `metaDescription` frontmatter field to open with the 'pub quiz' phrasing and name rounds, themes and formats within the first 120 characters
- Rewrite the `excerpt` frontmatter field to match the new metaDescription framing
- Rename the four cluster H2s to carry the query phrasing, for example 'Cluster 2: Interactive rounds' becomes 'Pub quiz round ideas that keep the room moving' and 'Cluster 3: Theme nights' becomes 'Pub quiz theme night ideas'
- Add 'pub quiz' variants to the `keywords` frontmatter array
- Add two FAQ entries drawn from existing zero-click queries the body already answers in prose: how long a pub quiz should last, and how many rounds it should have. Answers must be lifted from the existing copy, lines 61 and 135, and add no new figures
- Fix the founder-voice breach on line 149 so the sentence reads as company voice with The Anchor named as our own venue, keeping the 403% table bookings figure exactly as approved in CLAIMS.md

**Not permitted:**

- Changing the slug, the filename or the published URL /licensees-guide/quiz-night-ideas in any way
- Removing the phrase 'quiz night ideas' from the title, since that term currently holds position 7.51 and is the page's only page-one head term
- Touching /licensees-guide/quiz-night-101, redirecting it, deprecating it or altering its title. The cannibalisation hypothesis is unproven and belongs to a separate changeset
- Adding any new statistic, percentage, benchmark or industry figure. Only the five claims in CLAIMS.md may be quantified
- Adding or altering prices, package names or anything that reads as a rate. The existing £2 to £3 entry fee and £40 bar tab figures are the reader's own operating numbers in a worked example, not our prices, and must stay exactly as they are
- Adding any response-time or turnaround promise
- Restructuring the body, reordering the four clusters, cutting any of the 26 formats or changing the worked example on line 121
- Adding new outbound or internal links beyond those already present
- American spelling, and any use of the cost-reduction vocabulary, both of which the repo's pre-commit hooks block
- Changing publishedDate. Update `updatedDate` only

**Success measure.** Primary: average position on the "pub quiz *" query family (pub quiz ideas, pub quiz format, pub quiz themes, pub quiz round ideas, pub quiz topics) moves from roughly 15 to 20 into the top ten, measured in GSC at 8 and 12 weeks after deployment against the same 12-month trailing window. Secondary: page clicks rise from 122 to above 170 annualised. Guardrail: "quiz night ideas" must not fall below position 10, and total page impressions must not drop. If position improves but clicks do not, the diagnosis was wrong and the problem is CTR after all, which is then a separate and testable change.

**Risk if wrong.** The live risk is losing the head term. "quiz night ideas" sits at position 7.51 and supplies 7 of the page's clicks; retitling a page that already ranks can cost two to four positions for six to eight weeks while Google re-evaluates, and occasionally the loss does not recover. Retaining "Quiz Night" in the title mitigates but does not eliminate this.

The secondary risk is that the diagnosis is right about position and wrong about cause. If the real constraint is the cannibalisation with quiz-night-101, or simply that stronger domains own this SERP, the retitle moves nothing and the page has been disturbed for no gain. That outcome is cheap to reverse, one commit, and it usefully eliminates the on-page hypothesis so the next test can go straight at the two-page split.

Rollback: revert the commit if the head term drops below position 12 for three consecutive weeks.

---

## cash-bingo-101

`/licensees-guide/cash-bingo-101` · 54 clicks · 2621 impressions · 2.06% CTR · position 9.18

**What the searcher wants.** Two distinct crowds hit these queries and only one of them is ours. "How to play bingo", "how does bingo work", "bingo machine" and the like are players wanting game rules; those impressions are noise and will never convert. The queries that matter, "pub bingo", "bingo in pubs", "pub bingo rules", "do i need a licence to run a bingo night", are licensees asking one question first: am I allowed to run this, and what are the limits? They want the legal answer (no operating licence needed inside exempt equal-chance gaming, £5 per person per game, £2,000 stakes and prizes in any seven days) confirmed fast, then the practical bits: what to charge for books, what to pay out, how to run the night without disputes. They are not searching for a "101".

**Diagnosis.** This is a POSITION problem, not a CTR problem. 2.06% CTR at an average position of 9.18 is roughly what that position pays. The average is a blend hiding the real shape: the page ranks 5.14 for "how to run a bingo night in a pub" and earns 6% CTR there, which is normal to good, proving the title and description can earn clicks when the page is actually visible. The drag comes from the other end. "pub bingo" (518 impressions) and "bingo in pubs" (389 impressions) are 907 impressions, around 35% of the page's total, sitting at positions 12.0 to 12.8, i.e. page two, where sub-1% CTR is the norm. Those two terms are simultaneously depressing the average position toward 9 and starving the click count. Rewriting the title to chase CTR would be fixing the wrong half. The cause of the page-two ranking is a relevance mismatch at the top of the page: the title tag, H1, slug and meta description all lead with "cash bingo" and "licensee guide", while the head terms Google is testing us on are "pub bingo" and "bingo in pubs". The exact phrase the query uses appears nowhere in the title or H1, and the H1 ("Responsible Formats, Smooth Operations, Happy Players") signals nothing about pubs or rules. Google is ranking us on body relevance alone and placing us below pages whose titles say what the searcher typed. The scatter of position-2 rankings on one-impression player queries ("how to play bingo", "is bingo gambling") confirms the page's topical signal currently reads as generic bingo, not pub-operator bingo.

**The one change.** Re-anchor the page's primary topic from "cash bingo" to "pub bingo rules" in the title tag, H1 and opening 150 words, keeping the URL and keeping "cash bingo" as a secondary phrase. Concretely: title tag on the pattern "Pub Bingo Rules: How to Run Cash Bingo Legally"; H1 mirrors it; the first paragraph is replaced with a direct answer to the licence question (exempt equal-chance gaming, no operating licence, the statutory £5 and £2,000 limits, all already cited to the Gambling Commission in the existing copy) instead of the current nostalgia opener about dabbers. One change, one mechanism: the head terms carrying 907 impressions sit on page two because the phrase they use is absent from every prominent element on the page. Putting it there is the highest-leverage relevance signal available and needs no new claims, no new data and no URL change. Everything below the fold stays as it is.

**Permitted:**

- Rewrite the title tag in frontmatter to lead with the phrase 'pub bingo' and retain 'cash bingo' in the second half, under 60 characters
- Rewrite the H1 on line 39 to mirror the new title; drop the 'Responsible Formats, Smooth Operations, Happy Players' strapline
- Replace the opening paragraph (line 41) with a direct answer to the licensing question, reusing the Gambling Commission facts and link already present on line 45, and keeping the existing 'planning guidance, not legal advice' caveat
- Update metaDescription to describe the licensing and rules answer rather than 'Thursday nights'; keep it 150 to 160 characters
- Add 'pub bingo rules' and 'bingo in pubs' to the frontmatter keywords array
- Rewrite the closing 'Need backup?' section (lines 154 to 156) into company voice: 'we', not the founder by name; The Anchor is 'our own venue' if referenced at all
- Adjust the author byline handling so the page does not read as a personal byline, if the site template allows it
- Leave the existing statutory figures (£5 per person per game, £2,000 per seven days) in place: they are Gambling Commission limits with the source linked, not business claims

**Not permitted:**

- Do not change the URL. It stays /licensees-guide/cash-bingo-101 and the slug field stays 'cash-bingo-101'
- Do not add any statistic, percentage or performance number. Only the five claims in CLAIMS.md may be quantified, and none of them relate to bingo
- Do not add Orange Jelly prices, hourly rates, package names or package tiers anywhere on the page
- Do not add a response-time promise to the closing CTA
- Do not name the founder or write in the first person singular; The Anchor is 'our own venue'
- Do not touch anything below the H1 and opening paragraph in this change: the compliance snapshot, format section, kit table, money handling, run-of-show, marketing, budget table, compliance signposts and FAQs all stay exactly as they are, so the effect is measurable in isolation
- Do not remove the Gambling Commission outbound links or the 'not legal advice' caveat
- Do not chase the player-intent queries ('how to play bingo', 'bingo machine'). They are worthless impressions and broadening toward them dilutes the operator signal we are trying to strengthen
- Do not use the cost-reduction vocabulary; the repo pre-commit hook blocks it. British English throughout

**Success measure.** Query-level position in GSC, not the page's blended average. The test is whether "pub bingo" and "bingo in pubs" move from positions 12.0 to 12.8 into the top 10, checked at 8 and 12 weeks after the change ships. Secondary: page clicks rising from the current 54 per year run rate, and those two terms converting above 1% CTR. Explicitly not a success measure: the page's average position figure, which will move for compositional reasons as soon as the query mix shifts and will mislead either way. Guardrail to watch alongside: "how to run a bingo night in a pub" must hold its position around 5 and its 6% CTR.

**Risk if wrong.** The page currently earns most of its clicks from "cash bingo" (position 9.48) and "how to run a bingo night in a pub" (position 5.14, 6% CTR). Demoting "cash bingo" out of the title's leading position could cost those rankings, which is roughly 5 of the 54 annual clicks plus the strongest term on the page. Mitigation is built into the change: "cash bingo" stays in the title, stays in the H1, stays in the slug and stays throughout the body, so the phrase remains well represented; only the leading emphasis shifts. The other risk is that the page-two rankings on "pub bingo" and "bingo in pubs" are not a title relevance problem at all but an authority problem against national bingo brands and trade bodies, in which case the change moves nothing and we have spent a fortnight learning that. That is an acceptable cost: the edit is reversible in one commit, it touches no structure, and the null result itself rules out the cheapest hypothesis and points the next attempt at links and depth rather than on-page copy. The genuine danger to avoid is the tempting version of this brief where somebody "improves" the whole article at once, at which point nothing is attributable and a fourteen-post tier-one asset has been rewritten on a hunch.

---

## midweek-pub-offers-that-work

`/licensees-guide/midweek-pub-offers-that-work` · 23 clicks · 1362 impressions · 1.69% CTR · position 7.72

**What the searcher wants.** Someone searching this is a licensee staring at an empty Tuesday-to-Thursday and wanting a list of specific promotions they can copy this week. They want ideas they can pick from, with a reason each one does not lose money. They are not looking for a philosophy of discounting, a 12-week phased plan, or a consultancy pitch. The dominant commercial framing in the query data is not "midweek" at all, it is "promotions that work" and "pub ideas to make money" , the timing qualifier is secondary to "will this make me money".

**Diagnosis.** This is a CTR problem, not a position problem, and the cause is a title-to-query mismatch.

Position 7.72 is clickable. Pages averaging position 7-8 routinely earn 2.5-3.5% CTR. This page earns 1.69%, so roughly two in every three clicks available at its current rank are going to someone else. It is being shown enough; it is not being chosen. If position were the constraint, the page would be sitting at 15+ and the CTR would be near zero , which is exactly what happens on the handful of head terms it genuinely cannot reach (positions 20.8 to 43.75, all zero clicks). Those are a separate, smaller problem and not where the 1,362 impressions live.

The reason it is not chosen is visible in the query data. Almost every query with real impression volume is a broad profitable-promotions query , "pub promotions that work" (90), "pub ideas to make money" (170), "pub promotion ideas" (33), "summer bar promotion ideas" (19). The explicitly midweek queries carry 66 impressions between them. The title leads with "Midweek", so a searcher on "pub promotions that work" reads a result scoped to three specific nights and scrolls past it. The parenthetical "(Not Just Footfall)" is trade jargon that adds no reason to click, and "Actually Drive Profits" is a vague promise with no shape to it , no indication that there are fourteen named, copyable offers behind the link.

There is a second, non-ranking problem that must be fixed regardless: the article carries unapproved quantified claims, Orange Jelly pricing, founder first-person voice, a duplicated FAQ and an offer of a downloadable toolkit that does not exist. None of that is why it underperforms, but all of it breaches the constraints and a title change should not ship without it.

**The one change.** Rewrite the title tag and the H1 so they lead with the demand language the page is actually shown for and carry the item count, keeping "Midweek" as the qualifier rather than the lead.

From: "Midweek Pub Offers That Actually Drive Profits (Not Just Footfall)"
To something on the pattern of: "14 Pub Promotions That Make Money on a Quiet Midweek Night"

Why this one change and not the others: the impression base is already there and the rank is already clickable, so the only variable standing between 1,362 impressions and more than 23 clicks is whether the blue link answers the query the person typed. Leading with "Pub Promotions That Make Money" matches the exact commercial phrasing carrying the volume, the numeral signals a scannable list rather than an essay, and "Quiet Midweek Night" preserves the midweek relevance that earns the position-8 long tail. It is one edit, it is reversible in minutes, and it does not touch the URL or the body.

The "14" is a count of the offers already in the article, not a performance statistic and not a claim.

**Permitted:**

- Rewrite the `title` frontmatter field and the H1 on line 43 to the new pattern , these two must match each other
- Rewrite `metaDescription` to match the new title's promise: name the fourteen offers and the margin angle, 150-160 characters, no numbers beyond the item count
- Rewrite `excerpt` to align with the new metaDescription (currently uses American 'programs' spelling in quickAnswer too , fix to 'schemes')
- Rewrite `quickAnswer` (line 7) to British English and to lead with the same framing as the new title
- Change `author` from 'Peter Pitcher' to the company, and rewrite line 45 ('After testing dozens of midweek promotions at The Anchor') and line 51 ('Let me share a painful lesson... we once ran') into company voice: 'we', 'our own venue, The Anchor'
- Delete the £75 per hour and £375 package pricing from the FAQ block at lines 517 and 525 , no prices anywhere
- Delete the duplicated 'Do you offer payment plans?' FAQ (lines 523-529 contain it twice); remove the payment-plan FAQ entirely once pricing is gone
- Remove or de-quantify the unapproved performance figures: '15 regular business bookings, £450 weekly additional lunch revenue' (line 131), 'Profit per table: £21' and the surrounding maths (lines 155-161), 'Kids meals cost £2.30 to produce' (line 156). Only the five CLAIMS.md figures may be quantified
- Delete the 'Ready to Make Midweek Profitable?' toolkit block (lines 491-503) , the download does not exist and promising it is a false offer
- Rewrite the 'How quickly will I see results?' FAQ (line 513) to remove the implied 30-day performance promise
- Fix the broken markdown ordered list at lines 351-359 (all items numbered '1.')
- Add the phrase 'pub promotions that make money' naturally once in the opening two paragraphs so the body supports the new title
- Add 'pub promotions that work' and 'pub ideas to make money' to the `keywords` and `tags` frontmatter arrays

**Not permitted:**

- Do not change the URL, the filename, or the `slug` field , this page is the authority being protected and it is one of fourteen posts carrying 81% of blog clicks
- Do not remove the word 'Midweek' from the title or H1. It is the qualifier that earns the position-8 long tail and the whole internal cluster (/quiet-midweek-solutions, /licensees-guide/pub-empty-tuesday-nights, /licensees-guide/fill-empty-seats-midweek-offers) points here on that basis
- Do not remove or renumber the fourteen offers. The list is the asset and the new title promises it
- Do not remove the three internal links on lines 63, 101 and 489
- Do not change `publishedDate`. Update `updatedDate` only
- Do not add any statistic, percentage, price or performance claim that is not one of the five in CLAIMS.md, and do not restate an approved claim without saying it came from The Anchor, our own venue
- Do not add a response-time promise anywhere
- British English throughout, and none of the cost-reduction vocabulary the repo pre-commit hook blocks.
- Do not write in the first person singular or name the founder
- Do not use em dashes
- Do not rewrite the body wholesale in the same change. The title is the test; a simultaneous body rewrite makes the result unreadable
- Do not touch the illustrative menu prices in the fourteen offers (£15 steak night, £13 curry club and so on). Those are the licensee's own pricing examples and are the substance of the article, not Orange Jelly's prices

**Success measure.** GSC page-level CTR for /licensees-guide/midweek-pub-offers-that-work over the 90 days after the change, compared against the 1.69% baseline, with average position held at 8.0 or better.

Pass: CTR at or above 3.0% with position no worse than 8.0. On 1,362 annualised impressions that is roughly 40 clicks against today's 23.
Marginal: CTR between 2.0% and 3.0%. Keep the title, leave it another 90 days before judging.
Fail: CTR at or below 1.69%, or average position falls past 9.5.

Read impressions as a control, not a target. If impressions rise sharply while CTR stays flat, the title has broadened the page's query set rather than improved its click rate, which is a different outcome and needs a different response. Check at 30 days for early direction but do not act before 90 , the query mix on this page is long-tail and noisy at low volume.

**Risk if wrong.** The realistic downside is losing the midweek exact-match relevance that currently earns the good end of the 7.72 average. Roughly a thousand of the 1,362 impressions come from unreported long tail, and a fair share of those will be midweek-phrased. Demoting "Midweek" from the first word to a trailing qualifier could cost position on exactly the queries the page currently wins, and take clicks below 23. Keeping "Midweek" in the title at all is the mitigation, and it is why the recommendation is not to drop it for a purely generic promotions title.

The second risk is that the diagnosis is wrong and the CTR deficit is not the title but the SERP itself: if these queries return AI Overviews or a strong People Also Ask block, position 7.72 is worth less than the CTR curve implies and no title will recover it. Nothing in the export can rule that out. If 90 days show position held and CTR unmoved, that is the answer, and the next move is a body and schema change rather than another title.

Both failure modes are cheap. Revert the title, keep the compliance fixes, and the page returns to baseline within a crawl cycle. The genuinely expensive mistake would be changing the URL, which is why that is forbidden.

---

## social-media-strategy-for-pubs

`/licensees-guide/social-media-strategy-for-pubs` · 43 clicks · 4489 impressions · 0.96% CTR · position 12.57

**What the searcher wants.** Somebody searching "social media marketing for pubs" or "what should a pub post" is a licensee or a duty manager who already has a Facebook page and an Instagram account and is posting into a void. They do not want the concept of a strategy explained. They want two things in this order: a decision about which platform gets their limited time, and concrete examples of posts they can copy this week. The queries with the highest CTR in this cluster are the "ideas" and "content" shapes, not the "strategy" shapes. Intent is do-it-yourself and immediate, not evaluative , the buyers of a service search "instagram services for pubs" and "paid social for pubs" as separate queries, and those belong to the service pages, not here.

**Diagnosis.** This is a POSITION problem, not a CTR problem, and the evidence is unambiguous. An average position of 12.57 is page two. Expected CTR at positions 12-13 is roughly 0.9% to 1.3%; the page returns 0.96%. It is performing exactly to par for where it sits. There is no click being left on the table by the title , there is no click on offer, because almost nobody scrolls that far. The proof it is not a CTR fault is in the same dataset: where this cluster does surface on page one, it converts normally ("pub social media ideas", position 6.57, 7.14% CTR).

Two things make the measured CTR look worse than it is and should not be mistaken for a title fault. First, roughly 900 of the 4,489 impressions come from supplier-intent queries (instagram services for pubs, paid social for pubs, facebook services for pubs, content creation services for pubs). A guide cannot convert those and should not try , they are the service pages' job. Second, the site fields at least three competing URLs for the head term (this guide at 12.57, /services/social-media-marketing-for-pubs at 11.96, /services/paid-social-for-pubs at 6.81), so Google is splitting the signal.

The root cause of the low position is simple and fixable: the page is titled and framed for a phrase nobody searches. "Social media strategy for pubs" and "pub social media strategy" appear nowhere in 1,009 rows of query data. The 564-impression head term is "social media marketing for pubs", and the word "marketing" appears in neither the title nor the H1. The page's single strongest relevance signal is pointed at a term with no demand, while it accidentally ranks 12.55 for the term with all of it. The trailing "in 2025" compounds it: on a page updated in August 2026, a title advertising last year suppresses a guide whose whole premise is currency.

**The one change.** Retitle the page to lead with the head term and drop the stale year, and mirror that change in the H1, meta description, excerpt and the opening two paragraphs so the whole page points at one query instead of a phantom one.

Concretely: "The Complete Social Media Strategy Guide for Pubs in 2025" becomes something on the pattern of "Social Media Marketing for Pubs: How to Build a Plan That Fills Tables". The H1 matches. The metaDescription and excerpt lead on "social media marketing for your pub" rather than "social media strategy". The first line of body copy uses the phrase once, naturally.

Why this one and not the alternatives: the page already ranks 12.55 for a 564-impression term it does not mention in its title. That is the cheapest relevance gain available anywhere on this page , Google has already decided the page is topically about that term and is ranking it on body copy alone. Adding depth (a month of worked post examples) is the obvious second move and would probably help, but it is a bigger, slower change with a diffuse mechanism; the title mismatch is a specific, identifiable defect with a specific, identifiable fix. Do the title first so its effect is measurable in isolation. Do not do both at once or you will not know which worked.

One thing must be fixed in the same edit for compliance reasons, not ranking ones: the article breaks company voice twice. Line 55 reads "I run The Anchor in Stanwell Moor and I do our marketing myself" and line 125 reads "The most common failure I see". Both must move to "we" and The Anchor must be described as our own venue. This is a house-rules fix riding along with the title change, not part of the hypothesis.

**Permitted:**

- Change the frontmatter `title` to lead with 'Social Media Marketing for Pubs' and remove 'in 2025'
- Change the H1 on line 49 to match the new title exactly
- Rewrite `metaDescription` (line 18) and `excerpt` (line 6) to lead on 'social media marketing for your pub'
- Reorder the `keywords` array so 'social media marketing for pubs' sits first; add 'what to post on social media for a pub'
- Rewrite the opening two paragraphs (lines 51-55) to use the head phrase once naturally and to state the promise in the first sentence
- Rewrite line 55 from first person to company voice: 'we' running our own venue, The Anchor, never 'I' and never the founder by name
- Rewrite line 125 'The most common failure I see' into company voice
- Update `updatedDate` to the date the edit ships
- Reword the `quickAnswer` (line 7) to open with the head phrase, keeping it to 40-60 words
- Add or reword `voiceSearchQueries` entries to include 'what should a pub post on social media' shapes
- Keep and lightly reword the existing +403% table bookings sentence on line 111, adding the provenance 'at The Anchor, our own venue'
- Leave every existing internal link in place; they are working authority plumbing

**Not permitted:**

- Changing the URL or the `slug` field , the slug stays social-media-strategy-for-pubs even though the title no longer says 'strategy'. The URL is the asset being protected
- Changing `publishedDate` (2025-06-26) to fake freshness
- Adding any statistic, percentage, benchmark or industry figure. Only the five claims in CLAIMS.md may be quantified, and only the +403% table bookings claim belongs on this page
- Adding a price, a package name, an hourly rate or a fee of any kind
- Adding a response-time promise ('we reply within 24 hours' and anything like it)
- Any first-person singular voice anywhere in the file , no 'I', no 'my', no naming the founder
- Describing The Anchor as anything other than our own venue
- Removing the CAP Code section , it is genuine differentiation almost no competing guide carries
- Removing the existing internal links to the Google Business Profile, Facebook, Instagram or summer marketing guides
- Adding a second competing H1 or changing the heading hierarchy
- British English throughout, and none of the cost-reduction vocabulary the repo pre-commit hook blocks.
- Editing /services/social-media-marketing-for-pubs in the same changeset. One variable at a time, or the result is unreadable
- Adding a month of worked post examples in this changeset , that is the next test, not this one

**Success measure.** Primary: average position for the query 'social media marketing for pubs' on this URL, measured in GSC filtered to page + query. It sits at 12.55. Moving into single figures within 8-12 weeks means the change worked; reaching the top five would take the query from 1 click to roughly 20-40 a year on its current 564 impressions.

Secondary: page-level average position, currently 12.57, and page-level clicks, currently 43 a year. A move to average position 8 or better should take the page past 120 clicks a year without any CTR change at all.

Explicitly not a success measure: page-level CTR. It will move sideways or even fall as impressions rise, and roughly a fifth of this page's impressions come from supplier-intent queries it can never convert. Judging this change on CTR will produce the wrong verdict.

Check at week 4 for movement and week 12 for the verdict. Do not touch the page again in between, or the test is worthless.

**Risk if wrong.** The real risk is cannibalisation. Pointing this guide's title at 'social media marketing for pubs' aims it at the same phrase as /services/social-media-marketing-for-pubs, which currently ranks 11.96 for it. If Google reads the two as duplicates it may rank neither, and the guide could drift further down rather than up. Mitigation is in the title construction: the guide's title must carry an unmistakably informational tail ('How to Build a Plan That Fills Tables', or similar) so the intent split is visible in the SERP, and the service page must not be touched in the same changeset.

The second risk is smaller and recoverable. A retitle causes a re-evaluation, and positions often wobble for two to four weeks before settling. If position is still below 12.57 at week 12, revert the title and the hypothesis is disproven , the ceiling is depth, not relevance, and the next test is the month of worked post examples.

Both risks are fully reversible: nothing here changes the URL, so a revert restores the previous state exactly. The one genuinely irreversible mistake would be changing the slug, which is why it is on the forbidden list.

---

## profitable-pub-food-menu-ideas

`/licensees-guide/profitable-pub-food-menu-ideas` · 104 clicks · 5629 impressions · 1.85% CTR · position 7.79

**What the searcher wants.** Two distinct populations sit under one URL. The commercial head ("pub menu ideas", "most profitable bar food", "how to create a pub menu") is a licensee wanting a scannable list of dishes that make money, with numbers attached, in the first screen. They want inspiration first and the maths second. The converting tail is a licensee who already knows the problem and wants the working: how to strip VAT before calculating GP, what blended food GP should be, whether a roast pays, how to cost a dish when the till will not. This page is written almost entirely for the second group and opens with an essay ("Gross profit is not profit") that answers neither query directly.

**Diagnosis.** POSITION, not CTR. The 7.79 average is a statistical artefact of two non-overlapping query sets and should not be read as "position 8 underperforming at 1.85%". Evidence: (1) roughly 64 navigational queries in the export are people searching a specific pub's menu ("the bull inn menu", "kitty o'shea's menu", "the pack horse hayfield menu"), each 1-3 impressions, mostly position 1-4, all zero clicks. Those rank beautifully and can never be clicked, because the searcher wants that pub's actual menu. They drag the average position down towards 7.79 whilst contributing nothing but impressions, which mechanically crushes the CTR figure. (2) Every query the page genuinely deserves sits on page two or three: 359 impressions at 19.94, 149 at 27.11, 168 at 14.62, 118 at 17.80. At those positions a sub-1% CTR is normal and expected, not a title failure. (3) The one place the page is on page one for a commercial term, "high profit menu items" at 3.89, it is a near-synonym of a term it ranks 20th for. So the title is not the constraint: almost nobody is being shown it in a clickable slot for a query with commercial volume. Rewriting the title or meta description would move essentially nothing, because you cannot win a click from position 20. The reason the head terms sit on page two is relevance framing: for "pub menu ideas" and "most profitable bar food" the page's first 800 words are a P&L walkthrough of an illustrative pub, and the dish table that actually answers the query is buried below it. Google is reading this as a gross-profit accounting page, and ranking it accordingly.

**The one change.** Move the existing "The 12 most profitable types of pub food" section (its four-factor lead-in and the 12-row dish table) so it becomes the first content block after a short intro, ahead of "Gross profit is not profit", and rewrite that H2 to carry the head phrasing: "The most profitable pub menu ideas: 12 dish types". One change. It is a relevance change rather than a click change, which is what a position problem needs. It puts the answer to "pub menu ideas" and "most profitable bar food" in the first screen and in the page's first substantive heading, which is the strongest on-page signal available without touching the URL or adding a word of new content. Nothing is deleted and no new claim is introduced: the same table, moved. The GP maths, VAT working and menu engineering grid follow immediately after, so the page still satisfies the tail it currently converts.

**Permitted:**

- Reorder existing H2 sections only: move 'The 12 most profitable types of pub food' (lines 84-115, including 'One caution on braising', 'The quiet winners nobody costs' and 'The dishes that look profitable and are not') above 'Gross profit is not profit' (lines 76-82). Move whole blocks; do not rewrite their bodies.
- Rewrite that one H2 to 'The most profitable pub menu ideas: 12 dish types'.
- Cut the three-paragraph intro (lines 70-74) to roughly 60 words that state the answer up front and hand straight off to the table. The illustrative-model disclaimer at line 74 must survive the cut, relocated to sit with the P&L section it governs.
- Update metaDescription and quickAnswer wording only as far as needed to match the new opening order. No new figures in either.
- Separate compliance fix, required regardless: convert first person to company voice. Line 72 'I run The Anchor in Stanwell Moor as a Greene King tenant' becomes 'We run The Anchor, our own venue in Stanwell Moor, as a Greene King tenant'. Line 54 'In my experience', line 189 'My rule' and 'Every operator I have done this with', line 251 'I did all of this in my own kitchen first'. Frontmatter author field to be resolved separately, not in this edit.
- Add internal links into this page from the wet-led vs food-led, menu-engineering and pub-wages guides, using 'pub menu ideas' and 'most profitable pub food' as anchor text.

**Not permitted:**

- Changing the slug or URL. It stays /licensees-guide/profitable-pub-food-menu-ideas.
- Changing publishedDate (2025-03-13). Update updatedDate only.
- Adding any new statistic, benchmark, currency figure or outcome claim. The only quantified results claim permitted is the +98% food revenue in three months already present at lines 50 and 253, as a percentage, attributed to The Anchor as our own venue. Leave both instances exactly as written.
- Adding a price, a package name, or any response-time promise.
- Rewriting the title as a CTR play. This is not a CTR problem and a title rewrite risks the tail rankings that produce roughly 102 of the 104 clicks.
- Deleting or condensing the VAT working (lines 128-157), the dish-costing steps (lines 159-167), the chef-minutes tables (lines 169-191) or the menu engineering grid (lines 193-241). These earn the clicks the page currently gets.
- Removing the braising food-safety caution (line 105) or the delivery-economics passage (line 115).
- Broadening the language from 'pub' to 'restaurant' to chase 'profitable menu items'. That query's SERP is restaurant-led and largely US; chasing it dilutes the pub specificity that wins 'high profit menu items' at 3.89.
- Removing any existing internal link.
- Changing the featured image path or the quickStats block.

**Success measure.** Primary: average position for 'pub menu ideas' moves from 14.62 into single digits, and 'most profitable bar food' from 17.80 to under 12, measured over a 12-week window starting eight weeks after the change. Secondary: total page clicks over that 12-week window up at least 30% against the equivalent prior period (baseline run-rate 104 clicks per year, roughly 24 per 12 weeks). Guardrail, and this is the one that decides whether to keep the change: page-level impressions must not fall and 'high profit menu items' (3.89) and 'high margin foods' (6.33) must not drop below position 10. Do not read page CTR as the success measure; it is contaminated by the navigational pub-name impressions and will move for reasons unrelated to this edit.

**Risk if wrong.** This page earns roughly 102 of its 104 clicks from a long tail of costing, GP, VAT and roast-profitability queries where it ranks 1-5, none of which are individually large enough to appear in the top-1,009 export. Reordering the page changes what Google reads as its primary topic, and the tail is the asset. If Google re-reads it as a listicle, the costing and VAT rankings can soften and the page loses more than the head terms could return, because the head terms are only worth about 800 impressions between them. Mitigation: move blocks intact rather than rewriting them, so every passage that earns a tail ranking survives word for word, and revert if the guardrail trips. Second risk: 'profitable menu items' at 359 impressions is tempting and probably unwinnable on a UK pub page. If the executor drifts towards generic restaurant framing to reach it, the page loses the pub specificity that is currently its only page-one commercial ranking, and gains nothing.

---

## pub-vat-accounting-guide

`/licensees-guide/pub-vat-accounting-guide` · 27 clicks · 1978 impressions · 1.37% CTR · position 7.51

**What the searcher wants.** Two intents, and only one of them is being served. The dominant intent is a rate lookup: somebody behind a bar, or their bookkeeper, wants to know what rate applies to a specific thing they just sold. Alcohol, food eaten in, a sandwich taken away, crisps. They want a one-line answer they can act on in ten seconds. The secondary intent is a calculation: "how to calculate vat for a pub business" is the single highest-volume VAT term this page sees, and those people want the arithmetic, gross to net, and how it interacts with GP. Neither is a reading intent. Nobody searching these terms wants a 3,000-word primer on choosing an accountant. The SERP for these terms is HMRC and gov.uk guidance plus hospitality accountancy firms, all of whom answer in the first screen.

**Diagnosis.** POSITION, not CTR, and the average position of 7.51 is misleading you.

Break the number apart. Every VAT query visible in the export sits at position 8.75 to 23.62 and every one of them has zero clicks. The 7.51 average is being propped up by long-tail passage matches too small to appear in the top-1,000 query export, where the page ranks 3 to 6 and picks up its 27 clicks. So the page has two populations: a small long-tail set that ranks well and converts, and the head terms that carry nearly all of the 1,978 impressions and rank off the clickable part of page one. The 1.37% CTR is the arithmetic consequence of that split. It is not a title failure.

The proof is that positions 8.75 to 13.10 earn close to zero clicks regardless of what the title says. Rewriting the title at position 11.49 changes nothing, because almost nobody scrolls that far. Any CTR work here is spending the one safe change on the wrong lever.

Why it ranks 9 to 24 on the head terms: the page answers the rate question in prose, spread across two sections and roughly 400 words, and it answers the calculation question in a single throwaway paragraph framed as a GP warning, under a heading about drinks. There is no heading, no table, no extractable block that matches what these queries ask. Competing pages lead with the answer. This one leads with a narrative about a licensee's first VAT return. On a YMYL tax query where Google is already sceptical of a marketing agency as a source, burying the answer is the difference between position 4 and position 11.

Second, smaller contributor: the page is written in the first person by a named founder on a tax topic where the author has no accountancy credential. That is an authority problem we cannot solve with a credential we do not have, so it is not the change to make, but it caps how far this page can climb.

**The one change.** Put a single, complete VAT rate table immediately after the opening paragraph, before any other content, covering every category a pub sells: alcohol, soft drinks, hot food eaten in, cold food eaten in, hot takeaway, cold takeaway, bar snacks eaten in, bar snacks taken away. One row per category, rate in its own column, one short "what this means at the bar" note per row. Directly beneath it, a worked gross-to-net calculation on a single sale, showing the divide-by-1.2 method and naming it as how you calculate VAT for a pub business.

Rewrite the existing prose sections to reference the table rather than repeat it, so the answer exists in exactly one place at the top rather than diffused across two sections in the middle.

That is the one change. It targets both head intents at once with the same block, it is the structure the pages currently outranking this one use, and it converts the page's strongest existing asset (the content is genuinely accurate and specific) into something Google can see is the answer. Everything else on the list, the accountant-choosing section, the record-keeping routine, the mistakes, stays exactly where it is and keeps serving the long tail that produces the current 27 clicks.

Do not pair this with a title rewrite. If you change both and the number moves, you will not know which did it, and you will apply the wrong lesson to the other thirteen posts.

**Permitted:**

- Insert a VAT rate table directly after the opening section, above 'Why VAT matters more in pubs than most businesses'. Table only, no new prose introduction beyond one line.
- Add a worked gross-to-net calculation beneath the table, using the existing pint example already in the article at line 77 so no new figures are introduced.
- Add one H2 or H3 whose wording matches the calculation intent, e.g. 'How to work out the VAT on a pub sale'. The page currently has no heading that matches its highest-volume query.
- Rewrite the 'VAT on drinks' and 'VAT on food' sections to point at the table instead of restating the rates in prose. Cut the duplication, keep the practical notes about takeaway tracking and bar snacks, which are the useful part.
- Convert first person to company voice throughout. Lines 61, 77 and 214 currently use 'I'. 'when I took on The Anchor in Stanwell Moor as a Greene King tenant' becomes a reference to our own venue in the company voice. Change frontmatter author from the founder's name to the company.
- Fix the typo 'underlaim' to 'underclaim' at line 222.
- Update the Making Tax Digital paragraph in the FAQ at line 46. It says 'From April 2026 this extends to income tax self-assessment' as a future event. That date has passed. Rewrite in the present tense.
- Verify the 90,000 pound registration threshold, the 20 percent standard rate and the 6.5 percent flat rate against current HMRC guidance before publishing, and correct if they have moved. These are statutory figures, not claims, and they must be right on a tax page.
- Remove the '150 to 400 pounds per month' accountant fee band at lines 42 and 208 and replace with guidance on fee structure, fixed monthly rather than hourly, and what the fee should cover. It reads as a price, it is unsourced, and it dates.
- Change the CTA button text at line 50 from the package name to plain language such as 'Talk to us about your numbers'. Leave the link target unchanged so the route does not break.
- Add or update FAQ schema so the existing FAQs are marked up, if they are not already emitted by the template.

**Not permitted:**

- Do not change the URL or the slug. /licensees-guide/pub-vat-accounting-guide stays exactly as it is. This is the asset being protected.
- Do not change the title or the meta description in this pass. The diagnosis is position, not CTR. Changing both at once destroys the read on which lever worked.
- Do not delete or reorder the second half of the article: record keeping, choosing an accountant, common mistakes, the weekly routine. That content is producing all 27 of the current clicks through long-tail passage matches. Moving it risks losing them.
- Do not remove the three internal links to brewery-tie-improve-your-deal, cash-flow-crisis-breaking-cycle, revenue-levers-struggling-pubs or pub-business-plan-template-guide.
- Do not add any statistic, percentage or performance number. The only quantified claims permitted anywhere are the five in CLAIMS.md, as percentages, attributed to our own venue. None of them belong on a VAT page, so the correct number of claims here is zero. Statutory HMRC rates and thresholds are not claims and are not covered by this rule.
- Do not add prices for Orange Jelly work, package names, or any response-time promise.
- Do not add author credentials, 'reviewed by an accountant' badges, or any expertise signal that is not true.
- Do not write in the first person or name the founder. Company voice, 'we'. The Anchor is 'our own venue'.
- Do not use American spelling, and do not use the cost-reduction vocabulary. The repo pre-commit hook blocks both.
- Do not add a second VAT article or split this one. There is no cannibalisation today and creating some would be self-inflicted.

**Success measure.** Measured in GSC at 90 days against the same 12-month baseline, on the page URL:

Primary: average position on the head cluster (pub vat, do pubs charge vat, is there vat on alcohol in pubs, how to calculate vat for a pub business) moves from its current 8.75 to 13.10 band into the top 5. That is the mechanism working.

Secondary: page clicks rise from 27. A move to 45 to 60 would be consistent with the head terms reaching the top 5 at this impression volume.

Guardrail: impressions must not fall and long-tail clicks must not drop. If total clicks fall, the restructure has cost the long-tail passages and should be reverted.

Explicitly NOT a success measure: CTR. If position improves, impressions will rise faster than clicks and CTR may fall even on a clear win. Judge this on position and absolute clicks only.

**Risk if wrong.** Three real risks, in order of likelihood.

First and most likely: the table makes the page more extractable, Google takes the answer into an AI Overview or featured snippet, and impressions and position both improve while clicks stay flat or fall. On rate-lookup queries this is a genuine possibility, because the answer is short enough to be fully satisfied in the SERP. If this happens the page is winning the visibility and losing the traffic, and the honest response is to accept it, because the alternative is staying at position 11 with no clicks either way.

Second: reworking the top of the page disturbs the long-tail passage matches that currently produce all 27 clicks. This is why the second half of the article is fenced off in forbiddenEdits. Keep the change confined to the first third.

Third, and the one to watch: if the diagnosis is wrong and the head terms do not move, the conclusion is that this is an authority ceiling on a YMYL tax topic, not a structure problem, and no on-page change will fix it. In that case the correct call is to stop investing in this page and accept it as a 27-click asset that supports topical breadth, rather than escalating to a title rewrite and then a rebuild. Know that in advance so the failure does not turn into three more changes on the most valuable page on the site.

Baseline note: revert is cheap, this is a single markdown file under version control, so take a checkpoint commit before the edit.

---

## summer-moments-simple-campaigns

`/licensees-guide/summer-moments-simple-campaigns` · 33 clicks · 1818 impressions · 1.82% CTR · position 17.31

**What the searcher wants.** A licensee planning the diary somewhere between February and May wants a pick-list of summer promotions they can actually run: the name, the offer, what goes on the chalkboard, what the team says at the bar. They are shopping for formats to steal, not for a philosophy of seasonality. The winning result is scannable, sectioned by occasion, and gives them something they could put up next weekend.

**Diagnosis.** POSITION, not CTR. At an average position of 17.31 the page is on page two for effectively everything, where typical CTR is roughly 0.5% to 1%. It gets 1.82%, which beats its own slot, beats the sibling summer page (summer-pub-event-ideas: 1.54% at position 16.82) and beats most of the licensees-guide. The snippet is already earning more than the ranking deserves, so rewriting the title purely for click appeal would fix a problem that does not exist.

The position is low because the page gives Google nothing to match. The title is "Summer Moments, Simple Campaigns: an inspiring idea bank for pub teams (May to Aug)". Nobody searches "summer moments", "simple campaigns" or "idea bank". The H1, the frontmatter description and the first 200 words contain no phrase a licensee would type. The body then spreads across five unrelated subjects (bank holiday formats, Father's Day, a cider weekender, Wimbledon and Ascot, wine tasting), so no single topic accumulates enough relevance to compete for any of them.

Two aggravating factors. First, cannibalisation: summer-pub-event-ideas takes 10,355 impressions and 159 clicks at position 16.82, is explicitly built for "summer pub events", and carries the same seasons: summer tag. Both pages chase the generic summer terms and this one, at a fifth of the size, loses. Second, a real technical defect: the frontmatter uses description: and publishedAt:, neither of which the loaders read (verified in src/lib/blog-md.ts:181-189 and src/app/licensees-guide/[slug]/page.tsx:336-340, which look for excerpt / metaDescription / publishedDate). The page therefore ships with no authored meta description and no status field. That is worth fixing, but it is not the binding constraint, because CTR is above par regardless.

**The one change.** Retarget the page's naming signals onto "summer pub promotion ideas": rewrite the title tag, the H1 and the opening paragraph so the phrase people actually search appears in the three places Google weights most. Concretely, something like "Summer Pub Promotion Ideas: Formats You Can Run From May to August" replacing "Summer Moments, Simple Campaigns: an inspiring idea bank for pub teams (May to Aug)".

Why this one and not the others: the body already contains the substance that would justify a page-one ranking for the promotions cluster. What is missing is any signal at page level that the article is about that. Every high-weight slot currently holds abstract brand language. This is also the only change that simultaneously resolves the cannibalisation, because it hands the events cluster cleanly to summer-pub-event-ideas and claims the promotions cluster, which the export shows nobody on this site currently owns (six promotion queries, 165 impressions, zero clicks, all beyond position 20).

Do this alone first. Do not bundle it with a content expansion, or you will not know what moved the number.

**Permitted:**

- Rewrite the `title` frontmatter and the on-page H1 to lead with summer pub promotion phrasing. This is the hypothesis; make this edit even if you make no other.
- Rewrite the first two paragraphs so the target phrase appears naturally within the first 100 words, replacing the current 'Summer is not one long season' opening.
- Rewrite `quickAnswer` so it answers 'what summer promotions should a pub run' in the words people search, rather than describing a mindset.
- Fix the broken frontmatter keys so the page matches every other post: `excerpt` instead of `description`, `publishedDate` instead of `publishedAt`, plus `status: "published"`, `updatedDate`, `metaDescription` and `keywords`. The current `description:` key is inert.
- Rename the existing H2s to carry the phrases the body already earns: bank holiday promotion ideas, Father's Day pub promotion ideas, cider festival weekender, Wimbledon and Royal Ascot pub ideas, pub wine tasting night ideas. Keep the sections themselves intact.
- Replace the closing paragraph (currently 'tell me what kind of pub you are ... and I will turn this into a tailored calendar') with company voice: 'we', never the founder.
- Add or reword FAQ entries so at least one uses the promotions phrasing, in place of or alongside the current three.
- Add an internal link to /licensees-guide/summer-pub-event-ideas that names the split explicitly (events there, promotions here), and add the reciprocal link on that page so the two declare their territories.
- Tighten or cut repetitive thought-starter bullets where they pad the page without adding a format.

**Not permitted:**

- The URL. The slug stays summer-moments-simple-campaigns. No rename, no redirect, no merge into the sibling page, however tempting the cannibalisation argument is.
- Do not add any number, percentage, uplift, benchmark, GP figure, spend per head or attendance figure. Only the five claims in /CLAIMS.md may be quantified and none of them apply here, so this page carries no statistics at all. That includes plausible-sounding industry figures.
- No prices anywhere. No 'from £', no package names, no day rates.
- No response-time promises ('we reply within', 'same day').
- No first person singular and no naming the founder. The Anchor is 'our own venue'.
- Do not retarget the page toward generic 'summer pub events' or 'pub garden events'. That is summer-pub-event-ideas, which has 10,355 impressions to this page's 1,818. Moving there recreates the cannibalisation with the weaker page.
- Do not delete or restructure the five subject sections (bank holidays, Father's Day, cider weekender, Wimbledon and Ascot, wine tasting). That body is the relevance the new title will cash in.
- Do not change summer-pub-event-ideas' own title or H1 in the same changeset. One variable at a time, or the result is unreadable.
- British English throughout, and none of the cost-reduction vocabulary. The repo pre-commit hook blocks both.
- Do not backdate or forward-date `publishedDate` to fake freshness. Use `updatedDate`.
- Do not add new outbound or affiliate links, and do not change the existing internal links to /licensees-guide/seasonal-pub-events-calendar, /licensees-guide/wine-tasting-evenings-for-pubs or /licensees-guide/national-drinks-days-pub-guide.

**Success measure.** Primary: average position for this URL moves from 17.31 into the 8 to 12 band within 8 to 12 weeks, measured in GSC filtered to the page. Clicks move from 33 to 80 or more over the following 12 months.

Leading indicator at 4 weeks: the promotions queries (pub promotions that work, pub promotion ideas, summer bar promotion ideas) start appearing against THIS URL in the page-filtered query report at a position under 20, rather than showing only site-wide. If they have not appeared by week 6, the hypothesis is wrong.

Guard rail: check summer-pub-event-ideas has not lost position or clicks. If it has, the two pages are still competing and the split has not landed. Note the seasonal confound: this is a May to August subject, so compare like-for-like months, not month on month.

**Risk if wrong.** Low absolute downside, capped at the 33 clicks a year the page currently earns, and a title change typically reshuffles rankings for two to four weeks before settling. The genuine risk is that the promotions cluster has no independent demand at all: 165 impressions across six queries is thin evidence, and it is possible those impressions belong to the sibling page anyway, in which case this page has no territory to claim and the correct answer would be a merge and 301 into summer-pub-event-ideas. That option is closed because the URL cannot change, so the page stays as an authority-carrying asset either way. Second risk: the current title is genuinely distinctive brand voice, and the replacement is generic, so anything the page earns from being memorable is given up in exchange for query matching. Given it earns 33 clicks a year, that is a trade worth taking.

---

## quiz-night-101

`/licensees-guide/quiz-night-101` · 48 clicks · 3615 impressions · 1.33% CTR · position 8.01

**What the searcher wants.** Someone about to run, or about to fix, a quiz night at their own venue. They want the operating spec, not inspiration: how long it should be, how many rounds, what order they go in, what kit is needed, how to charge, how to keep it fair. A secondary slice of the cluster is players wanting to get better at quizzes ("how to get good at pub quizzes") and that traffic is worthless here. The commercially useful intent is operator intent, and the page's body already serves it well.

**Diagnosis.** CTR, not position. GSC page-level average position is impression-weighted, so 3,615 impressions at an average of 8.01 means the bulk of this page's impressions genuinely sit at the bottom of page one, not on page two. That is a clickable position: published curves put position 8 at roughly 1.5% to 2.5%. This page earns 1.33%, which is below par rather than catastrophic.

The decisive evidence is the sister page. /licensees-guide/quiz-night-ideas sits four positions worse (12.11) and earns 1.89% CTR, a 42% higher click rate from a materially worse slot, on the same site, same cluster, same audience. The difference between the two is the title. "Quiz Night Ideas" is exactly what people typed. "Quiz Night 101: Licensee Guide" contains none of the language in any of the 170 quiz queries in the export: nobody searches "101", nobody searches "licensee guide". A searcher who typed "how to run a pub quiz" scans for words matching their task, this listing offers none, and they click the one below it that does.

The meta description makes it worse by promising something the page does not deliver: it ends "...and downloadable templates". There are no downloadable templates on the page. That either fails to win the click or wins it and loses the trust.

The body is not the problem. The article already answers the highest-impression questions in the cluster: 90 minutes, five to six rounds, a full run-of-show timetable, kit list, scoring, licensing. It is a good page wearing a name nobody is looking for.

**The one change.** Rewrite the title tag and meta description so the SERP listing names the task in the searcher's own words.

Title: from "Quiz Night 101: Licensee Guide" to "How to Run a Pub Quiz: Format, Rounds and Timings" (49 characters). Every substantive word appears in the query data: "how to run a pub quiz" (121 impressions), "pub quiz format" (84), "pub quiz rounds" and variants, "how long does a pub quiz last" (48).

Meta description: replace with copy stating the operating spec the page actually contains, dropping the untrue templates promise. In the shape of: "A complete operating guide to running a weekly pub quiz: how long it should run, how many rounds, a full run-of-show timetable, the kit you need, scoring, prizes and music licensing."

Why this one and nothing else: it acts directly on the diagnosed mechanism, it is reversible in a single commit, and it carries near-zero risk to a top-fourteen asset because it touches no URL, no body copy and no internal links. Title alignment also lifts on-page relevance, so any position gain is upside rather than the thing being bet on. At an unchanged position 8, moving CTR from 1.33% to the 2.2 to 2.5% par band is roughly 80 to 90 clicks a year against 48 today: about 4% of the entire site's annual search traffic from one line of frontmatter.

**Permitted:**

- Frontmatter `title` (line 2) , replace "Quiz Night 101: Licensee Guide" with a task-matching title of 50 to 60 characters leading with "How to Run a Pub Quiz".
- Frontmatter `metaDescription` (line 17) , rewrite to 150 to 160 characters describing what the page actually contains. The phrase "downloadable templates" must go.
- The H1 on line 40 , may be aligned to the new title so page and listing agree. Optional; same commit or not at all.
- Frontmatter `excerpt` (line 6) , may be brought into line with the new description for consistency on listing pages.
- Frontmatter `updatedDate` (line 5) , set to the date of the edit.
- The closing CTA on line 197 , rewrite into company voice ("we", not the founder) and remove the personal mailbox and the sticky-button instruction. Zero ranking impact, but it breaches the voice rules and sits in the same file.
- Frontmatter `author` (line 8) , may change from "Peter Pitcher" to the company byline if the site's author handling supports it.

**Not permitted:**

- The URL and the `slug` field. /licensees-guide/quiz-night-101 stays exactly as it is. No redirect, no rename, no folder move.
- Any new statistic, percentage, benchmark or outcome figure. Only the five claims in CLAIMS.md may be quantified, and none of them belongs on this page.
- Any Orange Jelly price, package name, day rate or response-time promise in the title, description or CTA.
- Restructuring the article body, merging sections, or deleting the round table, run-of-show timetable, kit table or metrics table. The body is not the diagnosed problem and cutting it risks the rankings being protected.
- Removing or altering the three internal links: /licensees-guide/pub-empty-tuesday-nights, /licensees-guide/quiz-night-ideas, /licensees-guide/prs-ppl-music-licensing-pubs. The link to the ideas page is load-bearing for the stronger sibling.
- Re-pointing this page at the "ideas" and "themes" queries. Those belong to /licensees-guide/quiz-night-ideas, which already earns 122 clicks against them. Competing with it costs more than it wins.
- `publishedDate`, `featuredImage`, the FAQ block and the `faqs`/`quickAnswer` frontmatter , untouched in this change.
- US spellings, and the cost-reduction vocabulary the repo's pre-commit hook blocks.
- Founder voice anywhere. "We" and "our own venue", never "I".

**Success measure.** GSC page report for /licensees-guide/quiz-night-101, eight weeks after the change ships and is confirmed indexed, against the 12-month baseline of 48 clicks / 3,615 impressions / 1.33% CTR / position 8.01.

Primary: CTR at or above 2.2% with average position held at 8.5 or better. That combination proves the title did the work.

Secondary, and the number that actually matters: clicks per 1,000 impressions, up from 13.3. Use this rather than CTR alone so a shift in impression mix cannot flatter the result.

Guard: if impressions fall more than 15% while CTR rises, the title has over-narrowed the page's query matching and the gain is illusory. Revert.

Check at week 4 whether Google is displaying the new title or rewriting it. Google rewrites roughly a third of titles, and if it is rewriting this one the test has not run and the result is void.

**Risk if wrong.** Low, and fully reversible in one commit.

The real downside is a wasted quarter rather than damage. If the change does not lift CTR, the diagnosis was wrong and the true constraint is position on the 10-to-30 tail ("quiz night format" at 29.38, "how long does a pub quiz last" at 19.42), which needs a different and much slower fix: internal linking and a cleaner split of territory with quiz-night-ideas. Eight weeks lost, nothing broken.

The genuine risk is over-narrowing. A title built entirely around "how to run a pub quiz" can stop Google matching the page to the broader format and length queries it currently picks up impressions from, so impressions fall even as CTR rises. That is why the guard is on clicks per 1,000 impressions, and why body coverage must stay broad.

A smaller risk: the two quiz pages may swap which one Google prefers for a given query. Survivable, since both are ours, but it makes the eight-week read noisier, so check the sister page's numbers at the same time rather than reading this page in isolation.

What cannot go wrong: no URL change, no broken links, no content removed, no unapproved claim introduced.

---

## content-marketing-ideas-pubs

`/licensees-guide/content-marketing-ideas-pubs` · 18 clicks · 3130 impressions · 0.58% CTR · position 15.41

**What the searcher wants.** Two intents sit in this cluster and the page straddles both. The broad one ("social media marketing for pubs", "social media for pubs") is a strategy query: which platforms, how often, does it work at all. The narrow one ("pub social media ideas", "bar content ideas", "pub content", "what should a pub post") is a supply query: the person has already decided to post and wants a list of things to post and a calendar to slot them into. The narrow intent is where this page already places well (positions 2.8 to 6.7) and the broad intent is where it sits on page two.

**Diagnosis.** POSITION, not CTR, and the cause is cannibalisation by a sibling post.

At an average position of 15.41 the page is on page two for the great majority of its 3,130 impressions. Page-two CTR is roughly 0.5% to 1.5%, so 0.58% is close to what that position pays. The arithmetic settles it: a best-case title rewrite at position 15 gets to maybe 1.5% CTR, or about 47 clicks a year, up from 18. Moving to position 6 pays roughly 6%, or about 190 clicks. The title is not the constraint; the ranking is.

The reason it cannot reach page one is visible in Pages.csv. /licensees-guide/social-media-strategy-for-pubs sits at 4,489 impressions, position 12.57, 43 clicks. The two posts are near-duplicates: both around 2,000 words, both give a weekly posting rhythm, both give a platform-by-platform breakdown, both give a tracking section, both answer "what should a pub post". Google has picked the sibling as the stronger of the two for the broad query and this page ranks behind it. The site is competing with itself on a term with 564 impressions and neither page wins it. Piling more relevance for "social media marketing for pubs" onto this page would deepen the conflict rather than resolve it.

The supporting evidence is that where the two pages do not overlap, this one already ranks: "pub content" at 2.82, "bar content ideas" at 6.67, "pub social media ideas" at 6.57. Those are the positions of a page Google trusts on the narrow intent. It is the duplicated strategy material that is dragging the average to 15.41.

**The one change.** Remove the overlap with /licensees-guide/social-media-strategy-for-pubs by re-scoping this page to the "what to post" intent only, signalled from the title tag and H1 downwards, and cutting or collapsing every section that duplicates the sibling.

Concretely: the strategy material goes (the "Where to post, and what each channel is for" table, "How to tell whether it is working", the boosting FAQ), replaced by a one-line cross-link to the sibling. What stays and expands is the part the sibling does not have: the four pillars as a usable bank of post ideas, the weekly rhythm, the twenty-minute filming routine, the weak-versus-better post examples.

This is one change because it is one decision: this page is the ideas and calendar page, the sibling is the strategy page. Everything else follows from it.

The mechanism is that clarifying which page answers which query lets Google rank each on its own term instead of suppressing one. The page already proves it can hold positions 3 to 7 on the narrow terms; this consolidates the whole page behind those terms rather than splitting it across two jobs.

The title override in src/lib/seo-overrides.ts ("Pub Content Ideas: What to Post to Fill Tables") is already correctly aimed at the narrow intent. The body is not. That gap is the problem.

**Permitted:**

- Rewrite the H1 in content/blog/content-marketing-ideas-pubs.md to match the SEO title's intent and lead with the post-ideas framing (current H1 'Pub Content That Fills Seats: What to Post and When' overlaps the Instagram post's title; make it unambiguously an ideas/calendar page)
- Delete the 'Where to post, and what each channel is for' channel table (lines 107-121) and replace it with two sentences plus a link to /licensees-guide/social-media-strategy-for-pubs for platform roles; keep the existing links to the Facebook, Instagram and email guides
- Delete or heavily cut 'How to tell whether it is working' (lines 144-155); the sibling owns measurement. One sentence and a cross-link is enough
- Delete the 'Should I boost posts with paid spend?' mini FAQ (lines 175-176) , the sibling's FAQ answers the same question
- Expand the four pillars into a longer, scannable bank of concrete post ideas , this is the page's reason to exist and what the query 'pub social media ideas' wants. More prompts per pillar, more weak-versus-better rewrite examples in the style of the quiz-night example at lines 99-105
- Rewrite excerpt, metaDescription and quickAnswer in the frontmatter to lead on post ideas and the weekly calendar, not on strategy
- Rewrite the keywords and tags arrays to drop 'content marketing' and 'creative pub marketing' in favour of the terms the page actually places for: pub social media ideas, pub content ideas, what to post pub, pub content calendar
- Rewrite or replace FAQs that duplicate the sibling's FAQs word-for-substance ('How often should a pub post on social media?' appears on both pages with near-identical answers) , keep one on each page, differently framed
- Update src/lib/seo-overrides.ts description for this path if the body scope changes; the title is already right and should stay
- Fix line 91 to read 'The Anchor, our own venue' per CLAIMS.md provenance wording, and keep the +828% search visibility claim exactly as it is
- Add an internal link from the sibling social-media-strategy-for-pubs post down to this page as the ideas bank, so the pair reads as strategy-then-ideas rather than two rivals

**Not permitted:**

- Changing the URL /licensees-guide/content-marketing-ideas-pubs, the slug, or the filename. Not for any reason, including the slug no longer describing the content well
- Deleting the post, redirecting it, or merging it into social-media-strategy-for-pubs
- Adding 'social media marketing for pubs' as the H1 or title-tag head term , that is the sibling's query and doing this makes the cannibalisation worse, not better
- Adding any statistic, figure, percentage or benchmark that is not one of the five claims in CLAIMS.md. Specifically: no engagement rates, no reach figures, no 'posts get X% more', no follower counts, no industry averages
- Adding any price, fee, rate or package name. The existing link to /services/content-creation-for-pubs stays as a plain link with no commercial detail attached
- Adding any response-time or turnaround promise
- Writing in the founder's first person. The page currently uses 'you' and 'we' correctly , keep it. Do not import the sibling's 'I run The Anchor' voice
- Calling The Anchor anything other than 'our own venue' (line 91 currently says 'our own pub')
- American spellings, and the cost-reduction vocabulary the pre-commit hook blocks
- Removing the existing internal links to the Facebook, Instagram, email marketing and Google Business Profile guides , those are earning the cluster its internal signal
- Changing publishedDate. updatedDate may be refreshed

**Success measure.** Primary: average position for /licensees-guide/content-marketing-ideas-pubs in GSC moves from 15.41 to under 10.0 over a 90-day window compared with the 90 days before the edit. Secondary: clicks move from 18 a year to 60 or more on an annualised run rate.

The check that tells you the mechanism worked rather than the weather changed: the pair must improve together, not trade places. Track social-media-strategy-for-pubs (currently 43 clicks, pos 12.57) alongside this page. Success is both pages gaining. If this page rises and the sibling falls by a similar amount, you have moved the problem, not fixed it.

Query-level confirmation: "pub social media ideas", "pub content" and "bar content ideas" hold or improve on their current positions of 6.57, 2.82 and 6.67, and impressions on those narrow terms grow. Do not judge this on "social media marketing for pubs" , that term is being deliberately conceded to the sibling.

Read nothing before 8 weeks. Impressions of 3,130 a year is roughly 60 a week, which is far too thin to read a weekly trend.

**Risk if wrong.** The real risk is that the cannibalisation reading is wrong and the page is simply outranked by external competitors on every term. In that case cutting the channel table and the measurement section removes ~500 words of topical coverage and the page drops further, from 15.41 towards 20, taking the 18 clicks with it. That is a loss of about 2% of total site clicks. Small in absolute terms, but this is a tier-one page and the downside is real.

The second risk is that the narrow intent has too little demand to matter. "pub social media ideas" is 14 impressions a year, "bar content ideas" is 3, "pub content" is 11. Winning all of them outright is worth a few clicks. The volume in this cluster genuinely sits in the broad term this brief tells you to concede. The bet is that ranking 6th on the narrow cluster plus a healthier sibling on the broad one beats two pages both stuck on page two. If broad demand does not flow to the sibling, the cluster's total clicks stay flat and the work was wasted effort rather than damage.

Both risks are recoverable: the URL does not change and nothing is redirected, so the edit is a content revert away from where it started. Keep the pre-edit version of the file recoverable in git and note the commit hash in the tracking record.

Confidence that the diagnosis is position rather than CTR: high, the arithmetic is not close. Confidence that cannibalisation is the specific cause of the position: moderate to high, based on the two posts' near-identical structure and the gap between this page's narrow-term positions (2.8 to 6.7) and its broad-term positions (12.5 to 17.5).

---

## compete-with-wetherspoons

`/licensees-guide/compete-with-wetherspoons` · 16 clicks · 1262 impressions · 1.27% CTR · position 8.97

**What the searcher wants.** Two audiences collide on this keyword cloud and only one is ours. The queries we can actually see in the export ("wetherspoons competitors", "what makes wetherspoons exclusive") are consumer, student and business-research intent , people studying the Wetherspoons business model, not running a pub. The intent we want is the licensee who has just heard a Spoons is opening nearby, or has watched trade drop since one did, and wants to know what to do about it: whether to cut prices (no), what they can offer that a chain structurally cannot, and how long the dip lasts. That searcher wants a plan from somebody who has actually traded against one, not a listicle. The SERP for that intent is dominated by trade press and generic advice posts, which is beatable.

**Diagnosis.** POSITION, not CTR. Three reasons. (1) Position 8.97 is bottom-of-page-one , under AI Overviews, People Also Ask and a video pack, it is frequently below the fold. Modern expected CTR there is roughly 1.5–2.5%; at 1.27% the page is slightly under-performing its slot, not dramatically. That gap is worth a fraction of a click a week. There is no title rewrite that turns 1,262 impressions at position 9 into meaningful traffic. (2) The visible impressions are the wrong audience. Of the 1,262, only ~82 are attributable to queries in the export, and both of those queries are consumer/analyst intent. Somebody researching "what makes wetherspoons exclusive" will never click "A Survival Guide for Independent Pubs" and should not. A material share of the impression base is structurally unclickable, which depresses measured CTR without anything being wrong with the snippet. (3) The remaining ~1,180 impressions are a long tail of licensee-intent queries each too small to appear in a 1,009-row export , exactly the profile of a page that is present everywhere in its topic and top-3 for nothing. That is a ranking problem. The cause is that the page is generic. Its evidence layer is four third-party pubs we have no relationship with (The Coach House in Reading, The Blackfriar, The Eagle, The Fat Cat) and unverifiable colour about buying regulars' birthday drinks. Every competing page on this SERP has the same generic advice. Nothing here demonstrates anyone has actually done it. Secondary drags, real but smaller: a near-duplicate at /compete-with-pub-chains splitting the same intent, a broken find/replace artefact reading "a typical neighbourhood pub Living Room", and four closing FAQs that are sales boilerplate rather than answers.

**The one change.** Rebuild the page's evidence layer as a first-hand account of trading as an independent pub thirty minutes from a Wetherspoons at our own venue, and remove the borrowed third-party pub examples entirely. One change: swap generic advice for lived operator experience. Why this one and not the others , at position 9 the page is losing to trade press and to other generic advice pages, and it cannot out-generic them. The only differentiator available that no competitor on this SERP can copy is having actually run a pub against a Spoons. That is precisely the first-hand-experience signal the helpful-content systems reward, it is the thing that makes the page quotable and linkable, and it is the one asset this page already owns and currently does not use. A title or meta rewrite is the tempting alternative and it is the wrong fix: it optimises a CTR that is already roughly par for the slot, on an impression base that is partly the wrong audience.

**Permitted:**

- Delete lines 320-334 entirely , the four closing 'Frequently Asked Questions' carrying £75/hour, £375+VAT packages, payment plans and the 'results inside 30 days / week 1 brings more website traffic' timeline. These breach the no-prices, no-package-names and no-response-time rules and must go regardless of the ranking work.
- Delete line 80 (The Coach House, Reading) and lines 244-248 (Success Stories: The Blackfriar, The Eagle, The Fat Cat). Replace with first-hand narrative from our own venue.
- Add new first-hand sections describing what actually happened at our own venue trading thirty minutes from a Wetherspoons: what we changed, what we tried that did not work, what the first three months felt like. Qualitative and specific. No numbers.
- Fix line 116: 'a typical neighbourhood pub Living Room' is a broken find/replace artefact. Rewrite as clean copy.
- Change the frontmatter author field from 'Peter Pitcher' to the company, and sweep the body for first-person or founder framing (line 294 'at The Anchor' becomes 'at our own venue').
- Rewrite excerpt, metaDescription and quickAnswer wording for clarity and voice, provided the primary target phrase 'compete with Wetherspoons' stays intact in title, H1 and metaDescription.
- Tighten or replace the six in-body FAQs (lines 284-306) so they answer the licensee questions properly rather than in one line each.
- Resolve the cannibalisation with /compete-with-pub-chains , that URL may be 301'd into this one or demoted. It carries 1 impression and 0 clicks, so the redirect risk is nil.
- Add or adjust internal links out to related guides.

**Not permitted:**

- Do not change the URL. /licensees-guide/compete-with-wetherspoons stays exactly as is. No slug change, no folder move, no redirect of this page.
- Do not change the title tag or the H1. They are carrying position 9 on a broad query cloud; changing them puts that at risk for no measured gain.
- Do not add any number, percentage, figure or statistic. The only quantified claims that exist anywhere are the five in CLAIMS.md, they are all Anchor performance metrics, and none of them is about competing with a chain. Adding an unapproved figure to this page is the single worst outcome of this work.
- Do not reinstate prices, hourly rates, package names, package prices or payment-plan copy anywhere on the page.
- Do not make any timeline or response-time promise, including softer forms like 'within weeks' or 'inside 30 days'.
- Do not name any third-party pub, brewery or operator we have no relationship with as evidence.
- Do not write in the first person or reference the founder by name. Company voice, 'we'. The Anchor is 'our own venue'.
- Do not use American spellings. Do not use the cost-reduction vocabulary the pre-commit hook blocks.
- Do not restructure the heading hierarchy wholesale. Sections may have their contents rewritten; the H2 skeleton stays recognisable so the page is not treated as a new document.
- Do not remove the existing internal links to /licensees-guide/pub-differentiation-strategies or /licensees-guide/quiz-night-ideas.

**Success measure.** Average position for the page in GSC, filtered to this URL, over the 90 days after the change. Baseline 8.97. Target 6.0 or better, with a secondary read on whether licensee-intent queries ('how to compete with wetherspoons', 'wetherspoons opened near me') start surfacing above the export threshold. Explicitly do NOT judge this on clicks: 16 clicks a year is roughly one every three weeks, so any click movement inside 90 days is noise and reading it as signal will produce a wrong conclusion in both directions. Check at 30 days for damage only, not for gain , position work on an established page takes a full crawl and reassessment cycle.

**Risk if wrong.** This page is already on page one and produces 16 of the site's 969 annual clicks. Substantially rewriting the body of a ranking URL can lose the ranking: if Google reassesses it as a different, weaker document, it slips to 12-15 and the 16 clicks go to zero. That is roughly 1.7% of total site traffic at risk. The mitigation is that URL, title, H1 and heading skeleton are all frozen, so the page's identity is preserved and only its substance improves , and the change is committed as a single revertable changeset. Set a stop-loss: if page-filtered average position is worse than 11 at 60 days, revert from git. The second risk is subtler and worth stating: the first-hand rewrite makes the page far more useful to licensees while doing nothing for the consumer-intent impressions, so measured CTR may not move much even if the work succeeds. That is the correct outcome, not a failure, and it is why position is the measure.

---

