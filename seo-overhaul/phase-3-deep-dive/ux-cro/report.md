# UX/CRO Analysis Report -- orangejelly.co.uk

**Date:** 2026-03-23
**Analyst:** UX/CRO Specialist Agent
**Status:** Phase 3 -- Deep Dive
**Site:** https://www.orangejelly.co.uk
**Conversion Goals:** WhatsApp messages, phone calls, contact form submissions, consultation bookings

---

## Executive Summary

Orange Jelly's site is well-built technically and has strong trust signals (real metrics, real pub, real person). However, **conversion effectiveness is undermined by three systemic issues:**

1. **WhatsApp is the only conversion mechanism on most pages** -- there is no contact form, no email capture, no booking calendar. Visitors who are not yet ready to message a stranger on WhatsApp have no lower-commitment option.
2. **The homepage does not communicate "pub marketing consultant" within the first viewport** -- the language is abstract ("transformational hospitality marketing", "accelerate growth") rather than concrete ("I help pub landlords fill empty tables").
3. **High-intent landing pages (fix-my-pub, empty-pub-solutions) are orphaned** -- users arriving from search land on these pages but have limited navigation paths to evidence (results) or lower-friction conversion (contact form).

The site converts through a single channel (WhatsApp) with a single friction level (message a real person). Adding a tiered conversion approach -- lead magnet, email capture, callback request -- would capture visitors at different stages of readiness.

---

## Cross-Site UX Issues

### UXCRIT-1: Single Conversion Channel (WhatsApp Only)

**What:** Every CTA on the site points to WhatsApp. The contact page offers phone and email as alternatives, but no page has a contact form, callback request form, or email capture. The `ContactForm` component exists in the codebase but is not rendered on any assessed page.

**Why it matters:** WhatsApp requires the visitor to (a) have WhatsApp, (b) be willing to message a stranger, (c) be ready to engage now. UK pub licensees working long hours may prefer to submit a form and be called back. A significant portion of potential leads will bounce rather than open WhatsApp.

**Impact:** Estimated 30-50% of potential conversions lost due to channel friction.

**Fix:**
- Add a simple callback request form to the contact page: Name, Pub Name, Phone Number, "Best time to call", one-line "What's your biggest challenge?"
- Add an email capture ("Get our free Pub Health Check checklist") to the homepage, blog sidebar, and solution pages
- Keep WhatsApp as the primary CTA but add "Prefer a call? Leave your number" as a secondary option on all CTA sections

### UXCRIT-2: Homepage Value Proposition Is Too Abstract

**What:** The homepage H1 reads: "Transformational hospitality marketing. Built to accelerate growth." The subtitle is 42 words of agency language: "transformative marketing partner", "AI-enabled delivery", "practical systems that drive bookings, footfall, and repeat visits."

**Why it matters:** A struggling pub licensee searching "help my pub is empty" needs to see within 2 seconds: (1) this person helps pubs, (2) they have real results, (3) here is how to get help. The current hero speaks in consultant jargon, not licensee pain language.

**Impact:** High bounce rate from organic search visitors who do not immediately recognise this as relevant to their problem.

**Fix:** Change H1 to: "I Help UK Pubs Fill Empty Tables" or "Your Pub Struggling? I Run One Too. Let Me Help." Change subtitle to: "I'm Peter. I run The Anchor in Surrey and I've added GBP75-100K of value using the same strategies I'll share with you. GBP75/hr, no contracts, results in 30 days."

### UXCRIT-3: No Trust Signals Near Primary CTAs

**What:** The WhatsApp CTAs throughout the site are not accompanied by trust indicators (reviews, testimonials, badges). The TrustBar component shows "Small team", "Action-first", "GBP75/hour" -- these are features, not trust signals.

**Why it matters:** At the moment of conversion, visitors need reassurance. "Featured in BII Magazine", "Added GBP75-100K to our own pub", or a short testimonial quote next to the CTA button significantly increases click-through.

**Fix:** Add a micro-testimonial or key metric directly adjacent to every WhatsApp CTA: "Over GBP75,000 of value added to The Anchor -- BII Featured" or a one-line quote.

### UXCRIT-4: No Social Proof from External Clients

**What:** All results and case studies reference The Anchor -- Orange Jelly's own pub. There are no testimonials, reviews, or case studies from external clients.

**Why it matters:** Prospects think: "Of course you got results at your own pub." External validation -- even one testimonial from the first external client (September 2025) -- would dramatically increase trust.

**Fix:** If any external client feedback exists, add it prominently to the Results page and as a micro-testimonial near CTAs. Even "We've worked with 3 external pubs since September 2025" is better than nothing.

### UXCRIT-5: Mobile Sticky CTA Only Appears on Blog Posts

**What:** The `StickyCTA` component (a fixed bottom bar with "Need help with your pub? Get Help") only renders inside the `BlogPost` component. It does not appear on solution pages, location pages, or the services page.

**Why it matters:** Mobile users scrolling through long-form solution pages (empty-pub-solutions is 376 lines) lose sight of the CTA. A persistent mobile CTA is a proven conversion pattern for service businesses.

**Fix:** Add the mobile sticky CTA to all solution pages (fix-my-pub, empty-pub-solutions, pub-rescue, quiet-midweek-solutions, compete-with-pub-chains) and location pages. Consider a lighter version (just a WhatsApp icon + "Chat with Peter") to avoid being intrusive.

### UXCRIT-6: Navigation Does Not Surface High-Intent Pages

**What:** The main navigation contains: Home, Services, Hospitality Marketing, Guides, Success Stories, About, Contact. The high-intent solution pages (Fix My Pub, Empty Pub Solutions, Pub Rescue) and location pages (Pub Marketing Surrey, etc.) are not in the navigation.

**Why it matters:** Visitors who arrive on the homepage or blog cannot discover these conversion-optimised pages through navigation. The pages are effectively hidden unless the user follows a specific internal link.

**Fix:** Add a "Problems We Solve" dropdown or mega-menu item containing: Fix My Pub, Empty Pub Solutions, Quiet Midweek Solutions, Compete with Pub Chains. Add a "Your Area" link to the footer with all 8 location pages.

---

## Page-by-Page Assessment

---

### 1. Homepage (/)

**Above the Fold:**
- H1: "Transformational hospitality marketing. Built to accelerate growth." -- Too abstract. Does not say "pubs" or "empty tables" or any pain-language.
- Subtitle: 42-word paragraph of consultant speak. A struggling licensee will not read this.
- CTA: "See How We Help" button linking to /services. This is a secondary action, not a conversion CTA. The primary WhatsApp CTA is in the hero but uses a generic label.
- Bottom text: "Pay for progress, not overheads * GBP75 per hour plus VAT * Small team, direct support" -- Good pricing transparency but buried in small text.
- Background image: homepage.png (840KB source, optimised by Next.js Image) -- visually strong.

**Content Flow:**
- TrustBar (features, not trust) -> FeaturesGrid (6 abstract features with emoji icons) -> Partnerships (Greene King, BII) -> ProblemCards (3 cards: Inconsistent Bookings, Low Visibility, Slow Execution) -> Results Section -> About Preview -> CTA Banner -> FAQs -> Final CTA
- The Problem -> Solution flow is inverted. Features and partnerships appear before the problem acknowledgement. A struggling licensee wants to see "I understand your problem" before "here are our features."

**Conversion Friction:**
- Steps to convert: Land on homepage -> Scroll past 6 sections -> Find WhatsApp CTA in CTA Banner -> Click -> WhatsApp opens -> Type message. That is too many steps.
- The hero has a WhatsApp CTA but it is labelled "Start a Growth Conversation" -- sounds like a sales pitch, not help.

**User Journey:**
- Homepage links to: /services, /about, /quiet-midweek-solutions (one problem card), /results, /contact, /licensees-guide (via nav)
- Does NOT link to: any blog posts, any location pages, /fix-my-pub, /empty-pub-solutions, /pub-rescue, /compete-with-pub-chains, /pub-marketing-no-budget
- Dead ends: The Anchor card links externally to the-anchor.pub (sends traffic away from the site)

**Scores:**
| Criterion | Score (1-5) | Notes |
|-----------|-------------|-------|
| Clarity of value prop | 2/5 | Abstract language, no pub-specific pain |
| CTA visibility | 3/5 | WhatsApp in hero, but soft label |
| Trust signals | 3/5 | Real metrics present, but placed too far down |
| Mobile experience | 4/5 | Responsive, good tap targets |
| Internal linking | 1/5 | Links to almost nothing beyond nav |

---

### 2. Services Page (/services)

**Above the Fold:**
- Hero with title from services.json data, CTA, and breadcrumbs
- Hero has WhatsApp CTA (showCTA=true)

**Content Flow:**
- Service landing cards (links to social media sub-pages) -> Real Solutions metrics -> Service packages grid -> Process steps (4 steps) -> Guarantee section -> FAQs -> Partnerships -> Final CTA
- Good Problem -> Solution structure within the service cards
- The guarantee section ("If you don't get clear value inside 30 days...") is excellent but buried far down the page

**Conversion Friction:**
- WhatsApp in hero and at bottom. Process section has a WhatsApp CTA. Three conversion touchpoints is good.
- The "GBP75/hour plus VAT" pricing is stated clearly and early. Good transparency.
- No callback form alternative.

**User Journey:**
- Links to 5 social media service sub-pages, /contact, /results (via nav)
- No links to solution pages (fix-my-pub, empty-pub-solutions)
- No links to location pages
- The service cards link to sub-service pages which are highly specific (Instagram for pubs, Facebook for pubs) -- good for SEO but may fragment the user journey

**Scores:**
| Criterion | Score (1-5) | Notes |
|-----------|-------------|-------|
| Clarity of value prop | 3/5 | Better than homepage but still "hospitality" not "pub" |
| CTA visibility | 4/5 | Multiple WhatsApp CTAs at natural decision points |
| Trust signals | 4/5 | Guarantee section is strong |
| Mobile experience | 4/5 | Grid collapses well |
| Internal linking | 2/5 | Only links to sub-service pages |

---

### 3. Fix My Pub (/fix-my-pub)

**Above the Fold:**
- H1: "Pub Struggling? Let's Fix It" -- Excellent. Matches search intent perfectly.
- Subtitle: "Tell me what's broken. I'll tell you the fastest thing to fix first -- and give you the templates to implement it this week." -- Direct, actionable, personal.
- CTA: WhatsApp with pre-filled "Hi Peter, please help me fix my pub" -- matches intent.
- Bottom text: "GBP75/hour + VAT * No fixed retainers * Peter responds within 24 hours" -- perfect trust signals.

**Content Flow:**
- Intro (fastest win) -> Deliverables (6 items) -> Process (4 steps) -> FAQs -> Final CTA
- Follows Problem -> Solution -> Process -> Action structure. Well-executed.

**Conversion Friction:**
- Two WhatsApp CTAs (hero + final). Good placement.
- No phone number visible (unlike the contact page)
- No secondary conversion option (email, callback)
- The pre-filled WhatsApp message is excellent ("Hi Peter, please help me fix my pub") -- lowers friction significantly

**User Journey:**
- Breadcrumbs: Home > Fix My Pub
- Internal links: Only to Home (breadcrumb) and WhatsApp
- No links to /results, /empty-pub-solutions, or related blog posts
- After reading the page, a visitor who is not ready to message has nowhere to go. Dead end.

**Scores:**
| Criterion | Score (1-5) | Notes |
|-----------|-------------|-------|
| Clarity of value prop | 5/5 | Perfect pain-point matching |
| CTA visibility | 4/5 | Hero + bottom, but no mid-page CTA |
| Trust signals | 3/5 | Real metrics in intro, but no external validation |
| Mobile experience | 4/5 | Clean layout, good readability |
| Internal linking | 1/5 | Effectively a dead end |

---

### 4. Empty Pub Solutions (/empty-pub-solutions)

**Above the Fold:**
- H1: "Quiet Nights to Consistent Trade in 30 Days." -- Good promise.
- Subtitle: "Proven, action-first strategies that transformed The Anchor and can be adapted to your venue" -- solid but could be more specific.
- Bottom text: "GBP75/hour plus VAT * No long contracts * Real pub operators"

**Content Flow:**
- TrustBar -> Problem statement -> 30-Day Plan (4 weeks, card grid) -> Real Results (only The Anchor) -> What You Get (2 cards) -> Partnership assurance -> Final CTA
- Excellent structure. The 30-day plan gives concrete value before asking for anything.

**Conversion Friction:**
- WhatsApp in hero (hidden behind default showCTA), WhatsApp in "Partnership Assurance" section, WhatsApp in final CTASection
- Three conversion points -- well-spaced through the page
- The HowTo schema with estimatedCost "499" conflicts with the page stating "GBP75/hour" -- confusing if Google shows the schema cost in SERPs

**User Journey:**
- Breadcrumbs: Home > Empty Pub Solutions
- No links to /fix-my-pub, /pub-rescue, /results, or blog posts
- The "Real Results" section only shows The Anchor -- should link to /results for more detail
- No related content or next steps section. Dead end after CTA.

**Scores:**
| Criterion | Score (1-5) | Notes |
|-----------|-------------|-------|
| Clarity of value prop | 4/5 | Clear 30-day promise |
| CTA visibility | 4/5 | Three well-placed WhatsApp CTAs |
| Trust signals | 3/5 | Real metrics but self-referential only |
| Mobile experience | 4/5 | Card grid stacks well |
| Internal linking | 1/5 | No cross-links to related pages |

---

### 5. Contact Page (/contact)

**Above the Fold:**
- H1: "Talk to a Hospitality Growth Partner" -- too vague. Should be "Talk to Peter -- A Fellow Pub Licensee"
- Subtitle mentions Peter and The Anchor -- good personal touch
- Hero CTA present (showCTA=true)

**Content Flow:**
- Three contact methods (WhatsApp, Phone, Visit The Anchor) -> Contact details + Why Work With Us + What Happens Next -> The Anchor photo -> FAQs (12 FAQs -- too many, causes scroll fatigue) -> Trust section (Peter's bio) -> Social proof strip (metrics) -> Final CTA -> Related links
- The "What Happens Next" 5-step process is excellent for reducing anxiety
- 12 FAQs is excessive for a contact page -- 4-5 is optimal

**Conversion Friction:**
- Multiple WhatsApp buttons (at least 4 on the page) -- good for conversion
- Phone number prominently displayed with click-to-call -- good
- Email address available -- good
- NO CONTACT FORM. This is the contact page and there is no form to fill in. The `ContactForm` component exists but is not used here.
- "Visit The Anchor" card sends traffic to an external site -- conversion leak
- AvailabilityStatus component gives real-time availability signal -- excellent

**User Journey:**
- Links to: /services, /results, /licensees-guide (via RelatedLinks), the-anchor.pub (external)
- The "Related Links > Next Steps" section at the bottom is well-placed
- The page is extremely long for a contact page -- ~590 lines of JSX. Contact pages should be short and focused.

**Scores:**
| Criterion | Score (1-5) | Notes |
|-----------|-------------|-------|
| Clarity of value prop | 3/5 | Too generic; should lead with "fellow licensee" |
| CTA visibility | 5/5 | WhatsApp everywhere, phone visible, email visible |
| Trust signals | 4/5 | Photo, metrics, availability, "What Happens Next" |
| Mobile experience | 3/5 | Too long; FAQs push the final CTA very far down |
| Internal linking | 3/5 | Related links section helps |

---

### 6. Results Page (/results)

**Above the Fold:**
- Hero with title and subtitle from results.json data
- No CTA in the hero -- missed opportunity

**Content Flow:**
- CaseStudySelector (interactive component) -> Trust section ("This Isn't Theory" + metrics card) -> Related Links ("Ready to Get Similar Results?") -> Final CTA
- The CaseStudySelector is a strong engagement component -- lets users explore specific results
- The metrics card (GBP75-100K value added, 25-35 quiz teams, GBP250/week savings, 60-70K reach) is compelling but only covers The Anchor

**Conversion Friction:**
- No CTA until the "Trust Section" where "See How We Help" links to /services (not a conversion CTA)
- The final CTA at the bottom is the only WhatsApp conversion point
- The page builds strong evidence but fails to convert at the moment of peak interest (after seeing results). There should be a CTA immediately after the case studies.

**User Journey:**
- Links to: /services (via "See How We Help" button), /contact, /results (circular)
- Related links section offers /contact, /services, /results -- good cross-linking
- No links to solution pages or blog posts that expand on the results shown

**Scores:**
| Criterion | Score (1-5) | Notes |
|-----------|-------------|-------|
| Clarity of value prop | 4/5 | Clear results with real numbers |
| CTA visibility | 2/5 | Only one WhatsApp CTA at the very bottom |
| Trust signals | 4/5 | Strong metrics, but all from own pub |
| Mobile experience | 4/5 | CaseStudySelector works on mobile |
| Internal linking | 3/5 | Related links section helps |

---

### 7. Location Page: Pub Marketing Surrey (/pub-marketing-surrey)

**Above the Fold:**
- H1: "Pub Marketing for Surrey Pubs" -- Clear, keyword-matched
- Subtitle: Mentions 1,000 pubs, commuter trade, race day crowds, The Anchor in Stanwell Moor -- excellent local relevance
- CTA: WhatsApp with "Hi Peter, I run a pub in Surrey and need help" -- great intent matching
- Bottom text: "GBP75/hour + VAT * From a working Surrey licensee who gets it"

**Content Flow:**
- Intro (3 paragraphs of genuine local knowledge) -> Wins (4 Surrey-specific opportunities) -> Next Steps (3 internal links: /pub-marketing, /quiet-midweek-solutions, /empty-pub-solutions) -> CTA -> FAQs
- Excellent local content. The Surrey-specific details (M25 corridor, Epsom race days, Guildford gastropubs) demonstrate genuine local expertise.

**Conversion Friction:**
- Two WhatsApp CTAs (hero + bottom section)
- The "Next Steps" section with internal links is excellent -- gives the visitor somewhere to go if not ready to convert
- No phone number or callback option
- No cross-links to other location pages ("Also serving: London, Berkshire, Kent...")

**User Journey:**
- Links to: /pub-marketing, /quiet-midweek-solutions, /empty-pub-solutions (via Next Steps cards)
- No links to other location pages -- missed "Also serving" cluster
- No links to blog posts relevant to Surrey pubs
- No link to /results or /contact

**Scores:**
| Criterion | Score (1-5) | Notes |
|-----------|-------------|-------|
| Clarity of value prop | 5/5 | Perfect local intent matching |
| CTA visibility | 3/5 | Two CTAs but no mid-page conversion |
| Trust signals | 4/5 | Local knowledge, real pub, pricing clear |
| Mobile experience | 4/5 | Clean, readable, good card stacking |
| Internal linking | 3/5 | Next Steps section good, but no location cross-links |

---

### 8. Blog Post: Quiz Night Ideas (/blog/quiz-night-ideas)

**Note:** Blog posts are served under `/licensees-guide/[slug]`, not `/blog/`. The URL `/blog/quiz-night-ideas` likely redirects or 404s. The actual URL would be `/licensees-guide/quiz-night-ideas`.

**Above the Fold:**
- Hero with blog post title (H1)
- Breadcrumbs: Home > Licensees Guide > [Post Title]
- Post metadata: category, author (Peter Pitcher, Founder & Licensee), date, reading time
- Featured image (16:9 aspect ratio)

**Content Flow:**
- Reading progress bar (fixed at top) -- good engagement signal
- Floating share buttons (desktop) / inline share buttons (mobile)
- QuickAnswer component for featured snippet targeting
- Main article content (rendered from markdown)
- In-article CTA card ("Need Help Implementing These Ideas?") -- dark background, prominent
- Related services card (links to 6 service pages: Instagram, Facebook, Paid Social, Content Creation, Social Media Marketing, Fix My Pub) -- excellent internal linking
- Author bio (full variant with photo)
- Adjacent post navigation (previous/next)
- Tags

**Conversion Friction:**
- StickyCTA appears after 30% scroll: Desktop floating card + mobile bottom bar -- excellent
- In-article CTA after content with WhatsApp link -- well-placed
- Desktop StickyCTA has a minimize button -- respects user choice
- Mobile StickyCTA: "Need help with your pub? Get Help" -- clear, actionable
- The CTA button text "Get Help Now" is generic. Better: "Chat With Peter About Quiz Nights"
- The sticky CTA pre-fills "Hi Peter, I just read your blog and need help with my pub" -- good but could reference the specific article topic

**User Journey:**
- Links to: category page, 6 service pages, adjacent posts (prev/next), author page
- The Related Services card provides excellent cross-linking to conversion pages
- No link to /results or /contact
- Tags are displayed but not linked to tag pages (they are just styled spans)

**Scores:**
| Criterion | Score (1-5) | Notes |
|-----------|-------------|-------|
| Clarity of value prop | 4/5 | Content-led, clear educational value |
| CTA visibility | 5/5 | Sticky CTA + in-article CTA + hero |
| Trust signals | 4/5 | Author info, real credentials, reading time |
| Mobile experience | 4/5 | Good reading experience, sticky CTA |
| Internal linking | 4/5 | Related services + adjacent posts |

---

## Conversion Path Analysis

### Current Primary Conversion Path
```
Organic Search -> Landing Page -> Scroll -> Find WhatsApp CTA -> Click -> WhatsApp Opens -> Type Message -> Wait for Reply
```

**Friction points:** Requires WhatsApp app, requires willingness to message stranger, requires composing a message (even pre-filled ones need review), no immediate gratification.

### Recommended Tiered Conversion Approach

**Tier 1 -- Immediate (High intent):**
WhatsApp or Phone Call -- keep as primary CTAs

**Tier 2 -- Medium intent:**
Callback request form: "Leave your number, Peter will call you within 24 hours"
- Fields: Name, Pub Name, Phone, Best time to call, One-line challenge description
- Place on: Contact page, solution pages, after results

**Tier 3 -- Low intent (nurture):**
Email capture with lead magnet: "Get Your Free Pub Health Check Checklist (PDF)"
- Place on: Homepage, blog sidebar, blog post footer, exit-intent popup
- Feeds into an email nurture sequence that builds trust over 2-4 weeks

**Tier 4 -- Passive (brand awareness):**
Newsletter signup: "Weekly pub marketing tip -- 1 email, 1 actionable idea"
- Place in: Footer, blog sidebar

---

## Mobile-Specific Findings

### Strengths
- All tap targets meet 44px minimum (WhatsAppButton enforces min-h-[44px])
- Font sizing uses 16px+ base (prevents iOS zoom on input focus)
- Responsive grid system collapses properly (Grid component handles breakpoints)
- Safe area insets handled in MobileCTA component
- Click-to-call phone links on contact page

### Issues
- **Mobile sticky CTA only on blog posts** -- solution pages and location pages lack this high-converting element
- **Homepage hero subtitle is 42 words** -- on a 375px screen this pushes the CTA below the fold. Should be max 20 words on mobile.
- **Contact page is extremely long on mobile** -- 12 FAQs + trust section + social proof + final CTA = extensive scrolling before the user can convert or leave
- **No "call" CTA in mobile sticky bar** -- many mobile users prefer tapping to call rather than opening WhatsApp
- **The Anchor external link cards** (homepage + contact page) open in a new tab on mobile, which can be disorienting

---

## Conversion Friction Scorecard (Site-Wide)

| Factor | Score | Benchmark | Notes |
|--------|-------|-----------|-------|
| Time to first CTA | 3/5 | < 3 seconds | CTA in hero but below subtitle on mobile |
| Number of conversion channels | 1/5 | 3+ channels | WhatsApp only on most pages |
| Form availability | 0/5 | At least 1 form | No forms on any assessed page |
| Trust signals near CTA | 2/5 | Within 50px | Metrics exist but not adjacent to CTAs |
| Social proof variety | 2/5 | 3+ types | Only own pub results, no testimonials |
| Mobile conversion flow | 3/5 | 2 taps to convert | WhatsApp requires app + message review |
| Exit intent capture | 0/5 | Active | No exit-intent mechanism |
| Follow-up path for non-converters | 1/5 | Email nurture | No email capture anywhere |
| Cross-page conversion path | 2/5 | Clear funnel | Orphaned pages, dead ends |
| Pricing transparency | 5/5 | Visible | GBP75/hr stated on every page |

**Overall Conversion Effectiveness: 19/50 (38%)**

---

## Priority Recommendations Summary

| # | Priority | Recommendation | Impact | Effort |
|---|----------|---------------|--------|--------|
| 1 | P0 | Add callback request form to contact page and solution pages | HIGH | S (4-6 hours) |
| 2 | P0 | Rewrite homepage H1 and subtitle to use pub-specific pain language | HIGH | XS (1 hour) |
| 3 | P0 | Add mobile sticky CTA to all solution and location pages | HIGH | S (2-3 hours) |
| 4 | P1 | Create email capture lead magnet (Pub Health Check Checklist PDF) | HIGH | M (8-12 hours) |
| 5 | P1 | Add trust micro-copy adjacent to all WhatsApp CTAs | MEDIUM | S (2-3 hours) |
| 6 | P1 | Add "Also Serving" cross-links to all location pages | MEDIUM | S (2-3 hours) |
| 7 | P1 | Add CTA immediately after case studies on Results page | MEDIUM | XS (1 hour) |
| 8 | P1 | Reduce contact page FAQs from 12 to 5 | MEDIUM | XS (30 min) |
| 9 | P2 | Add solution pages to navigation (dropdown/mega-menu) | MEDIUM | M (4-6 hours) |
| 10 | P2 | Add location pages to footer | MEDIUM | S (1-2 hours) |
| 11 | P2 | Contextualise blog StickyCTA per article topic | LOW | S (2-3 hours) |
| 12 | P2 | Add external client testimonials to Results page | HIGH | Dependent on client feedback |
| 13 | P3 | Add exit-intent email capture popup | MEDIUM | M (4-6 hours) |
| 14 | P3 | Add phone call CTA to mobile sticky bar | LOW | XS (1 hour) |

---

## HowTo Schema Cost Discrepancy

The `/empty-pub-solutions` page has a HowTo schema with `estimatedCost: { currency: 'GBP', value: '499' }`. The page text states "GBP75 per hour plus VAT". If Google displays the schema-derived cost, visitors will see GBP499 -- which does not match any pricing on the page and could create trust issues. This should either be updated to reflect the hourly rate or removed.

---

## Summary

Orange Jelly has a solid technical foundation and genuinely compelling content -- the real pub experience, real metrics, and Peter's personal voice are powerful differentiators. The primary conversion barrier is not content quality but conversion architecture: a single-channel approach (WhatsApp), orphaned high-intent pages, and missing lower-friction conversion options. Implementing a tiered conversion strategy with forms, email capture, and better cross-linking would significantly increase lead generation from the existing traffic.
