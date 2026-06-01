# Landing Page Recommendations -- Page by Page

**Date:** 2026-03-23
**Analyst:** UX/CRO Specialist Agent
**Purpose:** Specific, actionable recommendations for each organic landing page

---

## 1. Homepage (/)

### Above the Fold

**Current H1:** "Transformational hospitality marketing. Built to accelerate growth."
**Recommended H1:** "Your Pub Struggling? I Run One Too. Let Me Help."
**Rationale:** Matches the search intent of the primary audience (struggling pub licensees). Uses "you" language. Establishes credibility ("I run one too") in the headline itself.

**Current subtitle:** 42-word paragraph about "transformative marketing partner" and "AI-enabled delivery"
**Recommended subtitle:** "I'm Peter Pitcher. I run The Anchor in Surrey and I've added GBP75,000+ of value using strategies I now share with other pub landlords. No agency fluff -- just a fellow licensee who knows what works."
**Rationale:** Specific, personal, metric-backed. Immediately establishes E-E-A-T. Under 40 words.

**Current primary CTA:** "See How We Help" (links to /services -- a secondary action, not conversion)
**Recommended primary CTA:** "Message Peter on WhatsApp" (WhatsApp link, pre-filled: "Hi Peter, I need help with my pub")
**Recommended secondary CTA:** "See What We Changed at The Anchor" (links to /results)
**Rationale:** The hero should have one conversion CTA and one evidence CTA. Currently it has a navigation CTA.

**Current bottom text:** "Pay for progress, not overheads * GBP75 per hour plus VAT * Small team, direct support"
**Recommended bottom text:** "GBP75/hour + VAT * No contracts * Results in 30 days * Featured in BII Magazine"
**Rationale:** Add BII credential. "No contracts" is stronger than "small team" for reducing risk perception.

### Content Reordering

**Current order:** Hero -> TrustBar -> FeaturesGrid -> Partnerships -> ProblemCards -> Results -> About -> CTA Banner -> FAQs -> Final CTA

**Recommended order:**
1. Hero (rewritten as above)
2. TrustBar (change to: "BII Featured | GBP75K+ Value Added | 25-35 Quiz Regulars | GBP75/hr + VAT")
3. ProblemCards (move UP -- visitors need problem acknowledgement first)
4. Results Section (move UP -- prove you can solve the problem immediately after naming it)
5. "Latest Guides" section (NEW -- link to 6-9 recent blog posts for indexation)
6. "Areas We Cover" section (NEW -- link to all 8 location pages for indexation)
7. About Preview
8. FeaturesGrid (move DOWN -- features matter less than problems and proof)
9. Partnerships (move DOWN)
10. CTA Banner
11. FAQs (keep 4, these are good)
12. Final CTA

### New Sections to Add

**"Latest from the Licensee's Guide" section:**
```
<Section>
  <Heading level={2}>Latest Pub Marketing Guides</Heading>
  <Text>Free, proven strategies from a working licensee</Text>
  <Grid columns={3}>
    {/* 6-9 most recent blog posts as cards with title + excerpt + link */}
  </Grid>
  <Button href="/licensees-guide">Browse All 60+ Guides</Button>
</Section>
```
**Purpose:** Fixes CRIT-1 from Technical SEO report. Gets blog posts linked from homepage for indexation.

**"Areas We Cover" section:**
```
<Section background="cream">
  <Heading level={2}>Pub Marketing Near You</Heading>
  <Text>Local knowledge from a working licensee</Text>
  <Grid columns={4}>
    {/* 8 location page links: Surrey, London, Berkshire, etc. */}
  </Grid>
</Section>
```
**Purpose:** Fixes CRIT-2 from Technical SEO report. Gets location pages linked from homepage.

**"Problems We Solve" expanded section:**
Add links to ALL solution pages, not just /quiet-midweek-solutions:
- Fix My Pub (/fix-my-pub)
- Empty Pub Solutions (/empty-pub-solutions)
- Quiet Midweek Solutions (/quiet-midweek-solutions)
- Compete with Pub Chains (/compete-with-pub-chains)
- Pub Marketing on No Budget (/pub-marketing-no-budget)

### Trust Bar Revision

**Current items:** "Small team", "Action-first", "GBP75/hour"
**Recommended items:**
| Value | Label |
|-------|-------|
| BII Featured | Recognised for AI innovation in hospitality |
| GBP75K+ Added | Proven value at The Anchor |
| 25-35 Regulars | Quiz night teams every week |
| GBP75/hr + VAT | No contracts, no retainers |

**Rationale:** Replace vague features with specific, verifiable metrics. Every item should answer "why should I trust this person?"

---

## 2. Services Page (/services)

### Hero Revisions

**Current CTA label:** Likely "Start a Growth Conversation" (default)
**Recommended CTA label:** "Tell Me What's Holding Your Pub Back"
**Rationale:** Problem-focused language converts better than solution-focused for an audience in pain.

### Move Guarantee Section Up

**Current position:** After FAQs, near the bottom
**Recommended position:** Immediately after the service packages grid

The guarantee ("If you don't get clear value inside 30 days...") is the strongest trust signal on the page. It should appear right after the user has seen what they would get, not after they have scrolled through FAQs.

### Add a CTA After Each Service Package

Currently the service cards display information but do not have individual CTAs. Add a "Get Help With This" WhatsApp button to each service card, pre-filled with the specific service name. Example: "Hi Peter, I need help with event innovation for my pub."

### Add Cross-Links to Solution Pages

After the service packages, add a section:
```
"Not sure which service? Start with your biggest problem:"
- My pub is empty -> /empty-pub-solutions
- Midweek is dead -> /quiet-midweek-solutions
- I'm losing to chains -> /compete-with-pub-chains
- I just need someone to fix things -> /fix-my-pub
```

### Add Results Snippet

Add a compact metrics bar or testimonial between the service grid and the process section. Something like: "These services added GBP75-100K of value to The Anchor. See the full results." This bridges the gap between "what we offer" and "why you should believe us."

---

## 3. Fix My Pub (/fix-my-pub)

### Add Results Evidence

After the "How it works" process steps and before the FAQs, add a results snippet:
```
"What happened when we fixed The Anchor:"
- Food GP: 58% -> 71%
- Quiz night: 20 -> 25-35 regulars
- Sunday waste: Cut by GBP250/week
[See Full Results ->]
```
**Rationale:** The page makes promises but shows no proof. A results section links to /results and builds trust at the critical moment before the CTA.

### Add Cross-Links to Related Pages

After the FAQs, add:
```
"Related help:"
- 30-Day Recovery Plan -> /empty-pub-solutions
- Midweek Momentum -> /quiet-midweek-solutions
- Compete with Chains -> /compete-with-pub-chains
- See Our Results -> /results
```
**Rationale:** Prevents dead-end. Gives visitors who are not ready to convert a path to continue learning.

### Add Phone Number

Add Peter's phone number as a secondary CTA below the WhatsApp button: "Prefer a call? Ring 07990 587315" -- many pub licensees are in their 40s-60s and may prefer a phone call to WhatsApp.

### Add a Mid-Page CTA

Insert a WhatsApp CTA between the deliverables section and the process section. The page has content blocks without any conversion point for 3-4 scroll depths.

---

## 4. Empty Pub Solutions (/empty-pub-solutions)

### Fix HowTo Schema Cost

**Current:** `estimatedCost: { currency: 'GBP', value: '499' }`
**Recommended:** Change to `estimatedCost: { currency: 'GBP', value: '75' }` with a note or remove the estimatedCost field entirely.
**Rationale:** GBP499 does not match any pricing on the page or site. If Google surfaces this, it will confuse or deter prospects.

### Strengthen the "Real Results" Section

Currently shows one result (The Anchor: "Dead Monday-Wednesday" -> "Quiz night: 25-30 regular teams, Tasting nights: strong repeat attendance", 8 weeks). Add:
- A link to /results for more detail
- The food GP and social media metrics as supplementary proof
- If available, any external client result

### Add Cross-Links

After the CTASection at the bottom, add a related pages section:
```
"More help for struggling pubs:"
- Tell me what's broken and I'll find the fastest fix -> /fix-my-pub
- Build midweek momentum specifically -> /quiet-midweek-solutions
- Competing against big chains? -> /compete-with-pub-chains
```

### Add Sticky Mobile CTA

This page is long (376 lines of JSX, roughly 8-10 mobile screen heights). Add the StickyCTA component. It currently only renders on blog posts.

### Improve Week Cards for Mobile

The 30-day plan uses a 4-column grid that stacks to 1 column on mobile. On a phone, the user sees all 4 weeks stacked vertically -- this is fine, but the cards could benefit from numbered visual indicators (the week number in a circle) to show progression.

---

## 5. Contact Page (/contact)

### Rewrite the Hero

**Current H1:** "Talk to a Hospitality Growth Partner"
**Recommended H1:** "Talk to Peter -- A Fellow Pub Licensee"
**Rationale:** "Hospitality Growth Partner" sounds like an agency. "Fellow Pub Licensee" immediately establishes peer trust.

**Current subtitle:** "I'm Peter. We run The Anchor and help hospitality partners accelerate growth with transformative, action-first marketing."
**Recommended subtitle:** "I run The Anchor in Stanwell Moor. If your pub is struggling, I'll tell you what I'd do -- honestly, no sales pitch."

### Add a Callback Request Form

Below the three contact method cards, add:
```
<Card background="cream">
  <Heading level={3}>Prefer a Callback?</Heading>
  <Text>Leave your details and Peter will ring you within 24 hours.</Text>
  <form>
    <Input label="Your name" required />
    <Input label="Pub name" required />
    <Input label="Phone number" required type="tel" />
    <Select label="Best time to call" options={["Morning (9-12)", "Afternoon (12-5)", "Evening (5-8)"]} />
    <Textarea label="What's your biggest challenge right now?" maxLength={200} />
    <Button type="submit">Request a Callback</Button>
  </form>
</Card>
```
**Rationale:** This is the single highest-impact conversion improvement for the entire site. Many licensees will prefer leaving a number over initiating a WhatsApp conversation.

### Reduce FAQs from 12 to 5

Keep only the 5 most conversion-relevant FAQs:
1. "How quickly can we get started?" (urgency)
2. "Trade is under pressure. Can we talk today?" (crisis response)
3. "Will I speak to someone who understands hospitality operations?" (trust)
4. "I hate pushy sales calls -- will you pressure me?" (objection handling)
5. "What if I just need 10 minutes of advice?" (low commitment)

Remove the 7 others that are redundant or low-impact ("I'm not in your area", "What if I need help outside normal hours", etc.).

### Remove or Minimise External Link to The Anchor

The full-width photo linking to the-anchor.pub sends traffic away from the conversion page. Replace with a non-linking image or link to /results instead. If keeping the link, add `rel="noopener noreferrer"` and use a less prominent placement.

### Consolidate the Page Length

The contact page renders approximately: Hero + 3 contact cards + contact details + why work with us + what happens next + availability status + Anchor photo + 12 FAQs + trust section + social proof strip + final CTA + related links. That is 12 distinct sections on a contact page.

**Recommended streamlined layout:**
1. Hero (rewritten)
2. Three contact cards (WhatsApp, Phone, Callback Form)
3. "What Happens Next" process (5 steps -- keep this)
4. Compact trust bar (metrics in one row)
5. 5 FAQs
6. Final CTA

---

## 6. Results Page (/results)

### Add CTA Immediately After Case Studies

**Current:** CaseStudySelector -> Trust Section (no CTA until final section)
**Recommended:** CaseStudySelector -> **Inline CTA** -> Trust Section -> Related Links -> Final CTA

Insert after the CaseStudySelector:
```
<Section background="orange-light" padding="small">
  <div className="text-center">
    <Text size="lg" weight="semibold">
      Want results like these at your pub?
    </Text>
    <WhatsAppButton
      text="Hi Peter, I saw your results and I want the same for my pub"
      label="Chat With Peter About Your Pub"
      size="large"
    />
    <Text size="sm" color="muted">
      GBP75/hour + VAT | No contracts | Results in 30 days
    </Text>
  </div>
</Section>
```
**Rationale:** Peak interest is immediately after viewing evidence. The current page makes you scroll through two more sections before offering a conversion option.

### Add Hero CTA

The Results page hero does not have `showCTA` enabled. Add a secondary CTA: "Get Results Like These" with a WhatsApp link.

### Expand Results with Specific Metrics

The trust section metrics card shows 4 numbers. Expand with more detail:
- Before/after comparisons (not just "GBP75-100K value added" but "From GBP0 quiz night revenue to GBP500+/week")
- Timeline ("Achieved in 8 weeks, maintained for 18+ months")
- Specific strategy used ("AI-powered social media scheduling cut content creation from 10 hours to 2 hours/month")

### Add "Start With Your Biggest Problem" Section

Replace the generic "Related Links" section with problem-specific links:
```
"Where do you want to start?"
- My pub is empty most nights -> /empty-pub-solutions
- I need help right now -> /fix-my-pub
- Midweek is killing me -> /quiet-midweek-solutions
- I'm losing to Wetherspoons -> /compete-with-pub-chains
- I have no marketing budget -> /pub-marketing-no-budget
```

---

## 7. Location Page: Pub Marketing Surrey (/pub-marketing-surrey)

### Add "Also Serving" Cross-Links

At the bottom of the page (before or after FAQs), add:
```
<Section background="cream">
  <Heading level={2}>Also Serving Nearby Counties</Heading>
  <Grid columns={4}>
    <Button href="/pub-marketing-london" variant="outline">London</Button>
    <Button href="/pub-marketing-berkshire" variant="outline">Berkshire</Button>
    <Button href="/pub-marketing-hampshire" variant="outline">Hampshire</Button>
    <Button href="/pub-marketing-kent" variant="outline">Kent</Button>
    <Button href="/pub-marketing-buckinghamshire" variant="outline">Buckinghamshire</Button>
    <Button href="/pub-marketing-hertfordshire" variant="outline">Hertfordshire</Button>
    <Button href="/pub-marketing-oxfordshire" variant="outline">Oxfordshire</Button>
  </Grid>
</Section>
```
**Rationale:** Fixes CRIT-2 from Technical SEO report. Creates a location hub that Google can recognise as a cluster. Also helps users in border areas find the right page.

**Apply this to ALL 8 location pages** -- each should link to the other 7.

### Add Results Evidence

After the "What's working for Surrey pubs" section, add a compact results snippet:
```
"What we achieved at The Anchor (Stanwell Moor, Surrey):"
- Quiz night: 25-35 regular teams
- Food GP: 58% -> 71%
- Social media: 60-70K monthly views
[See Full Results ->]
```
**Rationale:** The page talks about what works but does not show proof. Adding results specific to Surrey (The Anchor is in Surrey) strengthens the local authority claim.

### Add Relevant Blog Post Links

After the FAQ section, add links to 3-4 blog posts relevant to Surrey pub challenges:
- Quiz night ideas (relevant to midweek)
- How to compete with Wetherspoons (relevant to town centre competition)
- Social media marketing for pubs (relevant to visibility)
- Pub food margin ideas (relevant to commuter lunch trade)

### Add Phone Number as Secondary CTA

Below the WhatsApp button in the CTA section, add: "Or call Peter: 07990 587315"

---

## 8. Blog Post: Quiz Night Ideas (/licensees-guide/quiz-night-ideas)

### Contextualise the StickyCTA

**Current sticky CTA text:** "Need help with your pub? Get Help" (generic)
**Recommended:** "Need help setting up quiz nights? Chat with Peter" (topic-specific)

To implement: Pass the post title or category to the StickyCTA component and use it to generate contextual CTA text. Example: `"Need help with ${post.category.name.toLowerCase()}? Chat with Peter"`

### Contextualise the In-Article CTA

**Current:** "Need Help Implementing These Ideas?" with "Get Help Now" button
**Recommended:** "Want Peter to Help Set Up Quiz Nights at Your Pub?" with "Chat About Quiz Nights" button pre-filled with "Hi Peter, I want help setting up quiz nights at my pub."

### Add Table of Contents for Long Posts

The `TableOfContents` component exists in the codebase (`src/components/blog/TableOfContents.tsx`) but is not rendered in the blog post page. For posts over 1,500 words, add a table of contents after the QuickAnswer component. This improves:
- User experience (easy navigation)
- SEO (Google can generate jump-to links in search results)
- Time on page (users who can see structure are more likely to stay)

### Link Tags to Tag Pages

Currently tags are displayed as styled `<span>` elements but are not clickable. Either link them to tag/category filter pages or remove them. Non-interactive elements that look interactive (pill-shaped, styled differently) create confusion.

### Add "What to Read Next" Section

After the adjacent post navigation, add a curated "What to Read Next" section with 3 posts from the same category. The `RelatedPosts` component exists but is not currently rendered (it receives `relatedPosts` prop but is unused in the template).

---

## Cross-Cutting Recommendations (Apply to All Pages)

### 1. Add Micro-Trust Copy Next to Every WhatsApp CTA

Immediately below (within 20px) of every WhatsApp button, add one line:
"Peter responds within 24 hours -- no sales pitch, just practical advice"

This is already present on some pages but not consistently. Standardise it site-wide.

### 2. Add Phone Number as Secondary CTA Everywhere

Below every WhatsApp button, add: "Prefer a call? 07990 587315"
Currently the phone number only appears on the contact page. Many licensees in the target demographic (40s-60s) prefer phone calls.

### 3. Standardise CTA Button Labels

**Current variety:** "Start a Growth Conversation", "Let's Build Momentum", "Get Help Now", "Start Building Momentum", "Start My 30-Day Plan", "Message Peter on WhatsApp", "Get in Touch", "Get Help", "Chat on WhatsApp"

**Recommended standardisation:**
- Primary (WhatsApp): "Message Peter on WhatsApp"
- Secondary (Phone): "Call Peter: 07990 587315"
- Tertiary (Form): "Request a Callback"
- Blog-specific: "Get Help With [Topic]"

The variety of labels creates cognitive load. A consistent label builds familiarity and reduces decision friction.

### 4. Add Pricing to Navigation or Prominent Position

The GBP75/hour pricing is Orange Jelly's biggest differentiator against agencies charging GBP1,500-5,000/month. This should be visible in the navigation bar or a persistent trust bar, not just in page content. Consider adding "GBP75/hr + VAT" to the navigation CTA button label: "Chat with Peter (GBP75/hr + VAT)".

### 5. Create a Conversion-Focused Footer

The current footer has good structure but lacks conversion focus. Add:
- All 8 location page links under a "Your Area" heading
- All solution page links under a "Common Problems" heading
- A prominent WhatsApp CTA at the top of the footer
- Remove the disclaimer text from the very bottom or move it to a separate page

---

## Implementation Priority Matrix

| Week | Actions | Pages Affected | Expected Impact |
|------|---------|---------------|-----------------|
| 1 | Rewrite homepage H1/subtitle, add callback form to contact page, add sticky CTA to solution pages | /, /contact, 5 solution pages | +20-30% conversion rate |
| 2 | Add "Also Serving" to location pages, add results evidence to fix-my-pub and location pages, add CTA after results case studies | 8 location pages, /fix-my-pub, /results | +15-20% engagement, fixes indexation |
| 3 | Add blog posts and location pages to homepage, add solution pages to navigation | / (homepage), site-wide nav | +30-50% indexed pages (SEO), +10% cross-page navigation |
| 4 | Create email capture lead magnet, add micro-trust copy to all CTAs, contextualise blog CTAs | Site-wide, blog posts | +10-15% conversion rate, builds nurture funnel |

---

## Measurement Plan

Track these metrics to measure the impact of recommendations:

| Metric | Current Baseline | 30-Day Target | Tool |
|--------|-----------------|---------------|------|
| WhatsApp click-through rate | Unknown | Establish baseline + 20% | GTM events on WhatsApp links |
| Contact form submissions | 0 (no form exists) | 5-10/month | Form submission tracking |
| Email list signups | 0 (no capture exists) | 20-50/month | Email platform analytics |
| Bounce rate on solution pages | Unknown | Reduce by 15% | Google Analytics |
| Pages per session from homepage | Unknown | Increase by 30% | Google Analytics |
| Phone calls from website | Unknown | Establish baseline | Call tracking or GTM tel: link events |
| Time on page (solution pages) | Unknown | Increase by 20% | Google Analytics |

---

## Final Note

The content and trust signals on orangejelly.co.uk are genuinely strong. Peter's real pub experience, real metrics, and personal voice are rare in the consulting space. The recommendations above are not about changing the message -- they are about removing friction between a convinced visitor and the conversion action, and ensuring every visitor has a path forward regardless of their readiness level.
