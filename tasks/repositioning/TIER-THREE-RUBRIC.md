# The tier-three scoring rubric

**Task:** T082. **Closes:** gap G5.

Seventy-two posts rank and earn effectively nothing, and eight more are unranked. The call on
each is KEEP, MERGE or RETIRE, and Peter approves every one.

This exists so the decision is repeatable rather than a matter of taste. Two people scoring the
same post should reach the same answer, and if they do not, the rubric is wrong rather than one
of them.

**The first pass is capped at ten posts.** Score ten, review the calls together, then decide
whether the rubric is worth running across the rest.

---

## The criteria

| Criterion | What it measures | Source | Scoring | Weight |
|---|---|---|---|---|
| Demand held (impressions) | How much search demand the URL is already attached to. Impressions, not clicks, because a tier-3 post by definition earns no clicks , impressions are the only evidence Google has an opinion about the page. | protected-posts-register.csv, `impressions` column (GSC, 12 months to 26 Aug 2026). Posts absent from the register have 0 impressions and score 0. Set distribution for calibration: median 43, p75 100, p90 197, max 922. | 5 = 500+ impressions. 4 = 200-499. 3 = 100-199. 2 = 40-99. 1 = 10-39. 0 = under 10, or not in the register. | 3 |
| Position strength | How close the URL already is to earning clicks. A page at 7 needs a title and intro fix; a page at 25 needs a different page. | protected-posts-register.csv, `position` column. GATE: if impressions are under 10, score this 0 regardless of the number , an average position over a handful of impressions is noise, not a ranking. | 5 = position 5.0 or better. 4 = 5.1-8.0. 3 = 8.1-10.0. 2 = 10.1-15.0. 1 = 15.1-25.0. 0 = worse than 25.0, or gated to 0 by the under-10-impressions rule. | 3 |
| Query ownership (cannibalisation) | Whether this URL is the site's answer to its query cluster, or is splitting a cluster a protected post is already winning. This is the criterion that produces MERGE, and it is the only one that can score negative. | Queries.csv matched to the post by subject, cross-checked against the 14 tier-1 and 16 tier-2 slugs in the register. REPEATABILITY TEST: write the post's primary query in five words or fewer, from its H1 and quickAnswer. Do the same for every tier-1 and tier-2 post. Two queries are 'the same intent' if a searcher typing one would be satisfied by the other page. | 5 = no tier-1 or tier-2 post addresses this query cluster at all. 3 = a tier-2 post overlaps but the intent differs (explainer vs profitability guide, 101 vs advanced). 1 = a tier-2 post covers the same intent. -3 = a tier-1 post covers the same intent. | 3 |
| Inbound external links | Whether anyone off-site has linked to it. One genuine referring domain is worth more than every other criterion combined, because it is the one thing that cannot be rebuilt. | An external backlink export (Ahrefs, Semrush or GSC Links report), exported once for the whole corpus before scoring begins. There is no in-repo data for this , do NOT score any post until that export exists, and record the export date on every scorecard. Discount self-referrals from orangejelly.co.uk, generic directories, and syndications of our own content. | Binary. 5 = one or more genuine external referring domains. 0 = none found in the export. | 3 |
| Topic uniqueness on the site | Whether retiring or folding the page would leave a hole in the corpus. Distinct from cannibalisation: that asks who wins, this asks what is lost. | A scan of all 106 files in content/blog/ , slug, title, and H2 list. Compare H2 lists, not vibes. | 5 = no other post in the corpus covers the topic. 3 = one other post touches it, and at least half of this post's H2 sections have no equivalent there. 0 = another post covers 80% or more of the same ground. | 2 |
| Relevance to the positioning | Whether the page can carry a reader towards an enquiry under the new positioning, or is operational content that will never convert. | keyword-research.md , the fifteen target terms. Plus decision D14: hospitality is a contained sector hub inside the new IA, not the company description. | 5 = supports one of the fifteen terms or a hospitality hub head page. 3 = pub content a prospect would plausibly read before enquiring (marketing, revenue, growth, events). 1 = pub-operational content with no enquiry path (licensing, health and safety, cellar, insurance, hygiene). 0 = off-strategy entirely. | 2 |
| Cost to bring to standard | How much work the post needs before it can be published under the current constraints. Inverted: cheap scores high. Stops the rubric from recommending KEEP on posts nobody will ever get round to fixing. | grep the .md file for: `£`, package names, first-person `I `/`my `, response-time language, and any percentage not in CLAIMS.md, plus the cost-reduction vocabulary and non-British spellings the pre-commit hook rejects. | 5 = restyle and NextStep only, no prose change. 3 = a partial rewrite , one section, or stripping prices/claims/founder voice from a few paragraphs. 1 = the constraint breaches run through the whole piece and it needs rewriting end to end. | 2 |
| Durability | Whether the page is still true, and whether its demand recurs. Separates evergreen from one-off. | The post itself: publishedDate, any dated facts (rates, schemes, year-specific figures), and whether the subject is a named annual season. | 5 = evergreen, or a named recurring annual season (Christmas, Halloween, Six Nations, Cask Ale Week, Oktoberfest). 3 = evergreen but undifferentiated. 0 = tied to a single past date, or built on a superseded fact. | 1 |

## Turning the score into a decision

STEP 0 , EXCLUDE. Five register rows are already actioned (beat-chain-pubs, local-pub-marketing, crisis-pr-landlords-bad-reviews, fizz-street-food-pop-up, fill-empty-seats-midweek-offers): the file is gone and a redirect sits in src/lib/route-manifest.js. Do not score them. Live scoring set is 67 ranked plus the 8 unranked (google-business-profile-pub-guide, how-much-profit-does-a-pub-make, pub-epos-system-guide, pub-new-years-eve-planning-guide, pub-six-nations-rugby-marketing, pub-wages-labour-costs-guide, summer-pub-marketing, wet-led-vs-food-led-pubs) = 75.

STEP 1 , AUTOMATIC KEEP GATES. Run all seven in order. Any single hit ends the assessment: outcome is KEEP, no score is calculated, and the scorecard records which gate fired. These override every score.

STEP 2 , SCORE. Only posts that clear every gate get scored. Eight criteria, weights summing to 18. Raw range -9 to 90. Score each criterion independently; do not adjust one because of another.

STEP 3 , BAND.
  50 or above  → KEEP
  25 to 49     → MERGE
  under 25     → RETIRE candidate (never a final answer, go to step 4)

STEP 4 , RETIRE GUARDRAILS. Apply every guardrail to any post in the RETIRE band. One hit converts the outcome to MERGE-by-redirect. Only a post that survives all of them is a true RETIRE (410 and delete). On current data that is expected to be zero or one post out of 75.

STEP 5 , MERGE VIABILITY. Every MERGE outcome, whether from step 3 or step 4, must pass all five viability tests before it goes to Peter. A merge that fails any test becomes KEEP (dormant): the post stays live, gets the restyle and NextStep only, and receives no further investment. "No good merge target" is a reason to keep, never a reason to delete.

STEP 6 , APPROVAL PACK. One batch, not one post at a time. Per post: slug, clicks, impressions, position, the eight criterion scores with their sources, total, band, any gate or guardrail that fired, proposed outcome, and for merges the survivor URL and what moves across. Peter approves the list once.

NOTE ON THE UNRANKED EIGHT. They score 0 on demand and 0 on position (gated), so they start 30 points down and cannot reach KEEP on score alone. That is correct: they must earn KEEP through a gate. Two already do , summer-pub-marketing is the BII print-magazine destination for /summer, and pub-wages-labour-costs-guide is the redirect target for pub-wages-labour-costs-uk.

## Automatic keeps, whatever the score says

- GATE 1 , Ranks in the top 20 for any of the fifteen target terms in keyword-research.md. Source: Queries.csv position, joined to the post by subject. Currently dormant: only `hospitality marketing agency` appears at all (2 impressions, position 48) and no post is attributed to it. The gate exists because new professional-services content will change this, and a re-score must not retire a page that has since started ranking for a term we are building for.
- GATE 2 , One or more genuine external referring domains in the backlink export. A link is years of accumulated signal and cannot be rebuilt by writing something better. Excludes self-referrals, generic directories and syndications of our own content.
- GATE 3 , Only coverage of a named recurring annual season, regardless of impressions. Seasonal posts are sampled at whatever point in their cycle the export happens to catch, so their annual numbers systematically understate them. pub-halloween-bonfire-night-events (2 clicks from 5 impressions, 40% CTR, position 6.2) is the clearest case: on volume alone it looks dead, and it is the site's only Halloween and Bonfire Night page.
- GATE 4 , The URL is a live campaign or partner destination. Source: CAMPAIGN_REDIRECTS in src/lib/route-manifest.js. This currently protects christmas-pub-event-ideas (the /christmas Greene King print-toolkit destination, tier-3 at 3 clicks), autumn-pub-event-ideas, and summer-pub-marketing (the /summer BII print-magazine destination, and one of the unranked eight). Printed partner material points at these. Breaking one breaks something we cannot recall.
- GATE 5 , The URL is the destination of an existing redirect in the route manifest. Retiring it creates a chain or a dead end and breaks the one-hop rule the spec sets. This protects pub-wages-labour-costs-guide, which is the target of pub-wages-labour-costs-uk.
- GATE 6 , Linked from the body of a tier-1 or tier-2 post. Source: grep the slug across content/blog/ and src/. Removing it breaks an internal link on a protected page and strips a supporting-content signal from the fourteen posts carrying 81% of blog clicks. If the link should not exist, remove the link first as a separate approved change, then re-score.
- GATE 7 , Only coverage of a compliance or legal obligation, where the content is currently correct. Verified by full-corpus scan. A licensee arriving on a correct licensing, allergen, hygiene or music-licensing page and finding a 404 is a trust failure, and these pages accumulate links over time. Score 1 on relevance is not grounds to delete a page that is factually right and uniquely ours.

## When retire is the wrong answer even for a bad post

- ANY click in the 12-month window. 20 of the 72 tier-3 posts have at least one. A click is a human who searched, chose us over the results around us, and arrived. That is proven intent match, and it survives a redirect. Deleting it does not.
- 25 or more impressions. Google has formed an opinion about the URL. A 308 redirect passes most of that consolidation to the survivor; a 410 passes nothing. 46 of the 72 clear this bar on their own.
- Average position of 20 or better. 63 of the 72 qualify. A page that ranks is an asset that took years to earn, and its ranking is transferable by redirect. Only 3 posts sit worse than position 20, and two of those are already redirected.
- Any external referring domain (also automatic KEEP gate 2). Links point at a URL, and a 410 wastes them entirely, while a redirect carries them to the survivor.
- Any internal link from a tier-1 or tier-2 post, a service page, or site navigation, unless that link is removed in the same approved change.
- Any live campaign or partner URL pointing at it, including the /autumn, /christmas and /summer entry points and anything in printed Greene King or BII material.
- The topic still has demand and every available merge target would answer the searcher worse. Then the answer is KEEP and rewrite, not RETIRE. A page ranking at 7 for a real query is not a failing page, it is a title and intro problem.
- No honest merge target exists. Redirecting an unrelated page to /licensees-guide is a soft 404 and Google treats it as a delete with extra steps. If nothing is genuinely relevant, the outcome is KEEP (dormant): leave the URL live, restyle it, add the NextStep, invest nothing further.
- THE NET EFFECT, STATED HONESTLY: only 26 of the 72 have zero clicks and under 25 impressions, and 24 of those still rank at position 20 or better. After the guardrails run, the expected count of true deletes across all 75 posts is zero to one. RETIRE is a category that exists for factually superseded or off-strategy content with nowhere honest to point. It is not the disposal route for posts that underperform. Default to redirect.

## How a merge actually works

WHICH URL SURVIVES. Clicks first: the URL with more clicks wins. Tie on clicks, more impressions wins. Tie again, better position wins. Never decide on slug quality, word count, publish date or which one reads better , those are the judgements the rubric exists to remove. Position alone is a trap: pub-event-ideas ranks at 8.87 and summer-pub-event-ideas at 16.82, yet the second earns 159 clicks a year and the first earns none. Clicks are the tiebreak because clicks are the outcome.

Never merge two tier-1 posts. Never merge across the hospitality / professional-services boundary.

WHAT HAPPENS TO THE ABSORBED POST , six steps, one commit, following the precedent already set by the five completed merges in the repo.
1. Content: any H2 section genuinely absent from the survivor moves across, rewritten in the survivor's voice and under the survivor's heading structure, stripped of prices, package names, response-time language and any percentage outside CLAIMS.md. If nothing needs to move, it is not a merge, it is a plain redirect , record it as one.
2. Redirect: add the absorbed path to src/lib/route-manifest.js with disposition 'redirect' and destination set to the survivor. 308 permanent. The manifest generates next.config.js and drives sitemap exclusion, so this single entry does both. One hop only: if the survivor later moves, repoint every entry aimed at it in the same change.
3. File: delete the absorbed .md from content/blog/, matching what was done for beat-chain-pubs, local-pub-marketing, crisis-pr-landlords-bad-reviews, fizz-street-food-pop-up and fill-empty-seats-midweek-offers.
4. Links: repoint every internal link to the absorbed slug at the survivor. grep the slug across content/blog/ and src/. internal-links.test.tsx should catch a miss; do not rely on it alone.
5. Housekeeping: remove the slug from src/lib/blog-images.ts. Sitemap removal is automatic via the manifest.
6. Monitoring: add the absorbed post's queries to the survivor's watch list for eight weeks. If the survivor's clicks fall, the merge was wrong and the redirect is reversible , that is the reason for a redirect rather than a delete.

WHAT MUST BE TRUE FOR THE MERGE TO BE WORTH DOING , all five, or it becomes KEEP (dormant).
1. The absorbed post has under 25% of the survivor's clicks. If it has more, the direction is wrong; re-run the survivor rule.
2. Both answer the same search intent, by the five-word primary-query test. Same topic at different intent (a 101 explainer against a profitability guide) is an internal-linking job, not a merge.
3. The survivor can take the unique material without breaching its change budget , tier-1 posts take a named section addition only if the tier-1 brief approves it, tier-2 posts take no substantive rewrite , and without exceeding roughly 3,500 words.
4. The absorbed post's impressions are for queries the survivor already ranks for or plausibly could. Folding a post that ranks for something the survivor will never rank for loses the ranking and gains nothing.
5. Net URL count falls by one. A merge that produces a third new URL is a rewrite, needs its own approval, and forfeits the authority of both originals.

THE REAL CLUSTERS in the tier-3 set, for sequencing: seven event posts (pub-event-ideas, seasonal-pub-events-calendar, how-to-run-successful-pub-events, pop-up-events-for-pubs, live-music-events-for-pubs against tier-1 summer-pub-event-ideas), three reviews posts, three cash and cost posts, three heating and energy posts, five marketing posts. Score each post individually; use the clusters only to identify candidate survivors.

## Worked example

POST: /licensees-guide/pub-event-ideas. Register: 0 clicks, 100 impressions, position 8.87, tier 3-review, rank 57.

STEP 1, gates. (1) Not in the fifteen. (2) No referring domains in the export. (3) Not a named season , it is the generic term. (4) Not a campaign destination: /autumn, /christmas and /summer point at autumn-pub-event-ideas, christmas-pub-event-ideas and summer-pub-marketing, not this. (5) Not a redirect target. (6) Not linked from a tier-1 or tier-2 body. (7) Not compliance. No gate fires. Proceed to score.

STEP 2, score.
- Demand: 100 impressions, in the 100-199 band = 3, weight 3 = 9.
- Position: 8.87, in the 8.1-10.0 band = 3, weight 3 = 9. (Not gated: 100 impressions is well over 10.)
- Query ownership: primary query "pub event ideas". Tier-1 summer-pub-event-ideas has primary query "summer pub event ideas" and earns 159 clicks from 10,355 impressions. A searcher typing either is satisfied by the tier-1 page. Same intent, tier-1 post = -3, weight 3 = -9.
- Inbound links: none = 0, weight 3 = 0.
- Uniqueness: seven event posts in the corpus. The H2 list is covered above 80% by summer-pub-event-ideas and how-to-run-successful-pub-events = 0, weight 2 = 0.
- Relevance: pub content a prospect reads before enquiring = 3, weight 2 = 6.
- Cost: restyle and NextStep only, no constraint breaches found = 5, weight 2 = 10.
- Durability: evergreen but undifferentiated = 3, weight 1 = 3.
TOTAL: 9 + 9 - 9 + 0 + 0 + 6 + 10 + 3 = 28.

STEP 3, band. 28 sits in 25-49 = MERGE.

STEP 5, viability. (1) 0 clicks against 159 = 0%, under 25%, passes. (2) Same intent, passes. (3) Nothing unique needs to move, so the survivor takes no change at all and its tier-1 change budget is untouched. (4) Its 100 impressions are for event-ideas queries the survivor already ranks for. (5) Net URLs fall by one. All five pass.

OUTCOME: MERGE into /licensees-guide/summer-pub-event-ideas. Survivor chosen on clicks, 159 to 0. Note for the approval pack: this post ranks eight places better than the survivor and still earns nothing, which is the exact pattern cannibalisation produces , two of our pages splitting one cluster, neither winning the click. Because nothing unique moves across, this is a plain redirect: add the path to route-manifest.js with disposition 'redirect' and destination /licensees-guide/summer-pub-event-ideas, delete content/blog/pub-event-ideas.md, repoint internal links, drop the blog-images.ts entry, and watch the survivor's event-ideas queries for eight weeks.

CONTRAST, same rubric. cask-ale-week-pub-guide: 3 clicks, 922 impressions, position 7.92. Demand 5x3=15, position 4x3=12, ownership 5x3=15 (nothing else covers the week), links 0, uniqueness 3x2=6 (cellar-management touches beer quality, not the week), relevance 3x2=6, cost 3x2=6, durability 5x1=5. Total 65 = KEEP. Two people applying this reach 65 and 28 respectively from the same lookups, and the reason is visible in the criteria rather than in taste: 922 impressions at position 7.9 with a 0.33% click-through is a title and intro problem on a page nobody else on the site duplicates.
