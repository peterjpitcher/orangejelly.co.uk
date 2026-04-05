# Commercial Transformation — Plan B: Atomic Launch

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build all new pages, rewrite existing pages, set up redirects, swap navigation, and deploy everything as a single atomic release. After this plan, the site presents one coherent package-led commercial model.

**Architecture:** All work done on a feature branch. New pages use the components built in Plan A. Existing pages are rewritten to route to packages. Redirects, nav swap, footer swap, and sitemap update all merge together. No mixed commercial model is ever visible to the public.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, components from `src/components/packages/`

**Spec:** `docs/superpowers/specs/2026-04-05-commercial-transformation-design.md`

**Depends on:** Plan A (Foundation) — all components and data files must exist.

---

## File Map

### New Files to Create

```
src/app/ways-to-work/page.tsx                          — Package comparison page
src/app/ways-to-work/[slug]/page.tsx                   — Package detail pages (dynamic route)
src/app/capabilities/page.tsx                           — Digital capability stack page
```

### Files to Modify

```
src/app/page.tsx                                        — Homepage rewrite (package-led)
src/app/pub-marketing-agency/page.tsx                   — Reframe as "Why Choose OJ"
src/app/fix-my-pub/page.tsx                             — Route to Turnaround Intensive
src/app/empty-pub-solutions/page.tsx                    — Route to Growth Fix / Growth Partner
src/app/pub-rescue/page.tsx                             — Route to Turnaround Intensive (restore from redirect)
src/app/quiet-midweek-solutions/page.tsx                — Route to Growth Fix
src/app/compete-with-pub-chains/page.tsx                — Route to Growth Fix / Growth Partner
src/app/pub-marketing-no-budget/page.tsx                — Route to Growth Fix
src/app/results/page.tsx                                — Claims-governed proof page
src/app/contact/page.tsx                                — Package-aware form
src/components/blog/BlogPost.tsx                        — Update "Related services" links
src/lib/seo-overrides.ts                                — Add entries for new pages, update existing
src/lib/constants.ts                                    — Update PRICING from hourly to package-led
src/lib/metadata.ts                                     — Update default metadata
src/app/sitemap.ts                                      — Add new URLs, remove redirected ones
content/data/navigation.json                            — Replace with new structure
content/data/footer.json                                — Replace with new structure
next.config.js                                          — Add redirects, remove /pub-rescue redirect
```

---

## Task 1: Create Feature Branch

- [ ] **Step 1: Create and switch to feature branch**

```bash
git checkout -b feat/package-led-commercial-model
```

- [ ] **Step 2: Verify branch**

```bash
git branch --show-current
```
Expected: `feat/package-led-commercial-model`

---

## Task 2: Ways to Work Page

**Files:**
- Create: `src/app/ways-to-work/page.tsx`

- [ ] **Step 1: Create the Ways to Work page**

This is the centrepiece — the package comparison page. Read the spec Section 6 "Ways to Work" for the full structure.

The page must include these sections in order:
1. Hero: "Clear packages. Honest pricing. Real hospitality expertise."
2. Package cards: 4 across using `<PackageCard>` from packages barrel. Growth Partner highlighted.
3. Comparison: `<PackageComparison>` component
4. Add-ons: `<AddOnList>` component
5. Payment plans: `<PaymentPlanBanner>` component
6. FAQs: 6-8 questions about packages (use existing FAQAccordionWrapper or FAQItem components)
7. CTA: `<PackageCTA>` component (no specific package — general enquiry)

Use `generateStaticMetadata()` from `src/lib/metadata.ts` with:
- Title: "Pub Marketing Packages — Clear Pricing, Real Expertise | Orange Jelly"
- Description: "Four clear packages for pub and hospitality marketing. From a one-off Growth Fix to ongoing Growth Partner support. Payment plans available. No hidden fees."
- Path: "/ways-to-work"

Add structured data: `ItemList` schema with 4 `ListItem` entries.

FAQ content (hardcode in page — these are specific to the Ways to Work context):
1. "Which package is right for my pub?" — If you have one clear issue, start with Growth Fix. If you need ongoing monthly support, Momentum Month or Growth Partner. If your pub needs a complete reset, the Turnaround Intensive.
2. "Can I switch between packages?" — Yes. Many clients start with a Growth Fix and move to Momentum Month or Growth Partner once they see results.
3. "What about content creation?" — Strategy and content planning are included. Content production (filming, photography, heavy editing) is available as a separately scoped add-on.
4. "Do you offer payment plans?" — Yes. We offer flexible payment options to make support accessible. Ask Peter when you get in touch.
5. "How quickly will I see results?" — Growth Fix clients typically see their first win within 2 weeks. Momentum Month and Growth Partner clients build visible momentum within 30-60 days.
6. "What happens after a Growth Fix?" — You get your action plan and results. If you want ongoing support, step up to Momentum Month or Growth Partner. No pressure.
7. "What is included in the Turnaround Intensive website rebuild?" — A lean, template-led website of 5-8 core pages, mobile-first, with refreshed positioning, proof flow, and basic SEO. Advanced integrations and bespoke development are separate scope.
8. "Can I add extra hours?" — Additional hours can be arranged as needed. We will always discuss scope and pricing upfront.

- [ ] **Step 2: Verify it builds**

```bash
npm run build
```
Expected: `/ways-to-work` appears in the build output.

- [ ] **Step 3: Commit**

```bash
git add src/app/ways-to-work/page.tsx
git commit -m "feat: add Ways to Work package comparison page"
```

---

## Task 3: Package Detail Pages (Dynamic Route)

**Files:**
- Create: `src/app/ways-to-work/[slug]/page.tsx`

- [ ] **Step 1: Create the dynamic route page**

This page uses `<PackageDetail slug={params.slug} />` as its primary content. It also needs:

1. `generateStaticParams()` returning all 4 package slugs: growth-fix, momentum-month, growth-partner, turnaround-intensive
2. `generateMetadata()` that reads the package by slug and returns the SEO metadata from the spec:
   - growth-fix: "Growth Fix — Solve One Pub Problem Fast | From £375 + VAT"
   - momentum-month: "Momentum Month — Ongoing Pub Marketing Support | £900/mo + VAT"
   - growth-partner: "Growth Partner — Full Pub Marketing Support | Orange Jelly"
   - turnaround-intensive: "Pub Turnaround Intensive — 30-Day Commercial Reset | Orange Jelly"
3. Breadcrumb structured data: Home > Ways to Work > [Package Name]
4. Service schema for each package

Read `src/app/licensees-guide/[slug]/page.tsx` for the existing dynamic route pattern in this project.

For the Turnaround Intensive page specifically, add the website rebuild scope section AFTER the PackageDetail component — or extend PackageDetail to accept a `children` prop for additional sections. The rebuild scope content is defined in the spec Section 11.

- [ ] **Step 2: Verify all 4 pages build**

```bash
npm run build
```
Expected: `/ways-to-work/growth-fix`, `/ways-to-work/momentum-month`, `/ways-to-work/growth-partner`, `/ways-to-work/turnaround-intensive` all appear in build output.

- [ ] **Step 3: Commit**

```bash
git add src/app/ways-to-work/
git commit -m "feat: add package detail pages with dynamic routing"
```

---

## Task 4: Capabilities Page

**Files:**
- Create: `src/app/capabilities/page.tsx`

- [ ] **Step 1: Create the capabilities page**

Sections:
1. Hero: "Everything we can help with" — intro paragraph about OJ's full digital capability stack
2. `<CapabilityGrid>` component (full mode, not compact)
3. Support depth note: "Support depth varies by package. See our packages to find the right fit."
4. `<ContentBoundaries>` component — the three-layer content creation model
5. CTA: "Find the right package" → `/ways-to-work` using `<PackageCTA>`

Metadata:
- Title: "Pub Marketing Capabilities — Social Media, Events, SEO & More | Orange Jelly"
- Description: "Full-stack pub marketing support: social media, events, paid ads, local visibility, content, website optimisation, and more. See what's included in each package."
- Path: "/capabilities"

Add BreadcrumbList structured data.

- [ ] **Step 2: Verify it builds**

- [ ] **Step 3: Commit**

```bash
git add src/app/capabilities/page.tsx
git commit -m "feat: add capabilities page with digital stack overview"
```

---

## Task 5: Homepage Rewrite

**Files:**
- Modify: `src/app/page.tsx` (and any data files it uses)

- [ ] **Step 1: Read the current homepage thoroughly**

Read `src/app/page.tsx` and understand every section. The rewrite must preserve the SEO keyword targeting ("hospitality marketing" 500/mo) while restructuring for the package model.

- [ ] **Step 2: Rewrite the homepage**

New structure per spec Section 6:
1. **Hero** — "Hospitality marketing from a working pub" (preserve keyword). Update value prop to mention packages. Primary CTA: "See Our Packages" → /ways-to-work. Secondary: WhatsApp.
2. **ProofStrip** — Replace hardcoded metrics with `<ProofStrip claimIds={['food-gp-growth', 'quiz-regulars', 'social-views', 'value-added']} />`
3. **Where growth gets stuck** — Keep problem cards but update their CTAs to route to packages (not standalone problem pages). E.g., "Quiet midweek?" → /ways-to-work/growth-fix
4. **Package summary** — 4 `<PackageCard>` components. Growth Partner highlighted.
5. **Capability summary** — `<CapabilityGrid compact />` with link to /capabilities
6. **Why OJ is different** — Preserve founder-led, Anchor-tested messaging
7. **Results** — 2-3 `<CaseStudyCard>` components from case-studies.json
8. **Final CTA** — `<PackageCTA />` with payment plan note

Remove: any "£75/hour" as primary pricing. Replace with "Packages from £375 + VAT" or similar.

Update metadata to:
- Title: "Hospitality Marketing That Fills Seats | Orange Jelly"
- Description: "Hospitality marketing packages from a working pub. Strategy, events, social, local visibility — tested at The Anchor, delivered for your venue. Packages from £375 + VAT."

- [ ] **Step 3: Verify build and visual check**

- [ ] **Step 4: Commit**

```bash
git commit -m "feat: rewrite homepage with package-led commercial model"
```

---

## Task 6: Rewrite Problem Pages

**Files:**
- Modify: `src/app/fix-my-pub/page.tsx` (or its data file)
- Modify: `src/app/empty-pub-solutions/page.tsx`
- Modify: `src/app/quiet-midweek-solutions/page.tsx`
- Modify: `src/app/compete-with-pub-chains/page.tsx`
- Modify: `src/app/pub-marketing-no-budget/page.tsx`

- [ ] **Step 1: Read all 5 problem pages**

Understand their current structure. They use `PubServiceLandingPage` component and/or data files from `content/data/`.

- [ ] **Step 2: Rewrite each page to route to packages**

For each page, the pattern is:
1. Keep the empathetic problem framing (this is a strength)
2. Replace the solution section with the relevant package recommendation
3. Replace "£75/hour" pricing with package pricing
4. Add `<PackageCard>` for the recommended package(s)
5. Add `<CaseStudyCard>` for relevant proof
6. Update CTA to route to the specific package detail page

Routing per spec:
- `/fix-my-pub` → Turnaround Intensive
- `/empty-pub-solutions` → Growth Fix or Growth Partner (show both cards)
- `/quiet-midweek-solutions` → Growth Fix
- `/compete-with-pub-chains` → Growth Fix or Growth Partner (show both)
- `/pub-marketing-no-budget` → Growth Fix ("Even with a tight budget, a focused Growth Fix can deliver a clear win from just £375 + VAT")

Preserve all existing URLs and keyword targets. Do NOT change slugs or meta keyword targeting.

- [ ] **Step 3: Verify all 5 pages build**

- [ ] **Step 4: Commit**

```bash
git commit -m "feat: rewrite problem pages to route to packages"
```

---

## Task 7: Rewrite Pub Marketing Agency Page

**Files:**
- Modify: `src/app/pub-marketing-agency/page.tsx`

- [ ] **Step 1: Read the current page**

- [ ] **Step 2: Reframe as "Why Choose Orange Jelly"**

New structure:
1. Hero: "Why Choose Orange Jelly as Your Hospitality Marketing Partner" (preserve "hospitality marketing agency" keyword)
2. What makes OJ different — founder-led, Anchor-tested, action-first, no agency overhead
3. Proof strip with governed claims
4. Package overview: "Clear packages, honest pricing" with 4 `<PackageCard>` components
5. CTA: `<PackageCTA />`

Remove all "£75/hour" references. Replace with package-led messaging.

Preserve the URL `/pub-marketing-agency` and "hospitality marketing agency" (500/mo) keyword targeting.

- [ ] **Step 3: Commit**

```bash
git commit -m "feat: reframe pub-marketing-agency as Why Choose OJ"
```

---

## Task 8: Update Results, Contact, and BlogPost

**Files:**
- Modify: `src/app/results/page.tsx` (or its data source)
- Modify: `src/app/contact/page.tsx` (or its ContactPage component)
- Modify: `src/components/blog/BlogPost.tsx`

- [ ] **Step 1: Update Results page**

Replace hardcoded metrics with `<Claim>` components. Add `<CaseStudyCard>` components for each case study. Add package context: "This is the kind of result Growth Partner delivers."

- [ ] **Step 2: Update Contact page**

Add a package pre-select dropdown to the form. Read `packages.json` via `getPackages()` to populate options. Accept URL param: `/contact?package=growth-partner`. Add payment plan mention: "Payment plans available — ask Peter."

Read the existing contact page/form component to understand the current implementation before modifying.

- [ ] **Step 3: Update BlogPost.tsx "Related services" links**

In `src/components/blog/BlogPost.tsx`, find the "Related services" section (around lines 196-227). Replace the hardcoded service page links with package-aware links:

Replace:
- `/services/instagram-services-for-pubs` → `/capabilities`
- `/services/facebook-services-for-pubs` → `/capabilities`
- `/services/paid-social-for-pubs` → `/capabilities`
- `/services/content-creation-for-pubs` → `/capabilities`
- `/services/social-media-marketing-for-pubs` → `/capabilities`
- `/fix-my-pub` → `/ways-to-work/turnaround-intensive`

Update the section heading from "Related services" to "How we can help" and the link labels to be package-aware.

- [ ] **Step 4: Commit**

```bash
git commit -m "feat: update results, contact, and blog links for package model"
```

---

## Task 9: Pricing Sweep

**Files:**
- Modify: `src/lib/constants.ts`
- Modify: `src/lib/seo-overrides.ts`
- Modify: `src/lib/metadata.ts`
- Modify: Various page files with hardcoded "£75" references

- [ ] **Step 1: Update PRICING constant**

In `src/lib/constants.ts`, change PRICING from:
```typescript
export const PRICING = {
  hourlyRate: {
    amount: 75,
    display: '£75/hour plus VAT',
    description: 'Simple, honest pricing for all services',
  },
} as const;
```

To:
```typescript
export const PRICING = {
  startingFrom: {
    amount: 375,
    display: 'Packages from £375 + VAT',
    description: 'Clear packages for every stage of growth',
  },
} as const;
```

- [ ] **Step 2: Search for all "75" pricing references**

Run: `grep -rn "75.*hour\|75.*VAT\|£75\|75/hr\|hourlyRate\|hourly.rate\|hourly_rate" src/ content/data/ --include="*.ts" --include="*.tsx" --include="*.json" --include="*.md"`

Update every reference found. This includes:
- SEO overrides in `seo-overrides.ts`
- Page metadata in various `page.tsx` files
- Data files (services.json, regional data files, etc.)
- Component props and static text

- [ ] **Step 3: Update SEO overrides for new pages**

Add entries to `src/lib/seo-overrides.ts` for:
- `/ways-to-work`
- `/ways-to-work/growth-fix`
- `/ways-to-work/momentum-month`
- `/ways-to-work/growth-partner`
- `/ways-to-work/turnaround-intensive`
- `/capabilities`

Use the exact titles and descriptions from the spec Section 6.

- [ ] **Step 4: Verify no "£75/hour" remains as primary offer**

Run the grep again. Confirm zero results (or only historical/blog content references that are acceptable).

- [ ] **Step 5: Commit**

```bash
git commit -m "feat: replace hourly pricing with package-led pricing across site"
```

---

## Task 10: Navigation, Footer, Redirects, and Sitemap

**Files:**
- Modify: `content/data/navigation.json` — replace with navigation-new.json content
- Modify: `content/data/footer.json` — replace with footer-new.json content
- Modify: `next.config.js` — add redirects, remove /pub-rescue redirect
- Modify: `src/app/sitemap.ts` — add new URLs, remove old ones

- [ ] **Step 1: Swap navigation**

Replace the content of `content/data/navigation.json` with the content from `content/data/navigation-new.json`.

- [ ] **Step 2: Swap footer**

Replace the `links` section of `content/data/footer.json` with the `links` from `content/data/footer-new.json`. Preserve all other fields (businessName, contact, company, social, copyright).

- [ ] **Step 3: Update redirects in next.config.js**

Read `next.config.js`. In the `redirects()` function:

1. REMOVE the existing `/pub-rescue` → `/fix-my-pub` redirect
2. ADD these new redirects:
```javascript
{
  source: '/services',
  destination: '/ways-to-work',
  permanent: true,
},
{
  source: '/services/social-media-marketing-for-pubs',
  destination: '/capabilities',
  permanent: true,
},
{
  source: '/services/paid-social-for-pubs',
  destination: '/capabilities',
  permanent: true,
},
{
  source: '/services/content-creation-for-pubs',
  destination: '/capabilities',
  permanent: true,
},
```

3. UPDATE the existing Instagram and Facebook redirects to point directly to `/capabilities` (not to the social media hub) to avoid redirect chains:
```javascript
{
  source: '/services/instagram-services-for-pubs',
  destination: '/capabilities',
  permanent: true,
},
{
  source: '/services/facebook-services-for-pubs',
  destination: '/capabilities',
  permanent: true,
},
```

- [ ] **Step 4: Update sitemap**

Read `src/app/sitemap.ts`.

Remove from sitemap:
- `/services`
- `/services/social-media-marketing-for-pubs`
- `/services/paid-social-for-pubs`
- `/services/content-creation-for-pubs`
- `/services/instagram-services-for-pubs`
- `/services/facebook-services-for-pubs`

Add to sitemap:
- `/ways-to-work`
- `/ways-to-work/growth-fix`
- `/ways-to-work/momentum-month`
- `/ways-to-work/growth-partner`
- `/ways-to-work/turnaround-intensive`
- `/capabilities`

- [ ] **Step 5: Restore /pub-rescue page**

If `/pub-rescue` was previously just a redirect (no page.tsx), create a page at `src/app/pub-rescue/page.tsx` that routes to the Turnaround Intensive package (same pattern as other problem pages in Task 6). If the page already exists from the redirect removal, update its content.

- [ ] **Step 6: Verify redirects work**

```bash
npm run build
```

Check that redirected URLs don't appear as pages and new URLs do appear.

- [ ] **Step 7: Commit**

```bash
git commit -m "feat: swap nav/footer, add redirects, update sitemap for package model"
```

---

## Task 11: Full QA and Build Verification

- [ ] **Step 1: Run lint**

```bash
npm run lint
```
Expected: Zero errors, zero warnings.

- [ ] **Step 2: Run type check**

```bash
npx tsc --noEmit
```
Expected: Clean.

- [ ] **Step 3: Run all tests**

```bash
npm test
```
Expected: All pass. Some existing tests may need updates if they reference old service pages or hourly pricing.

- [ ] **Step 4: Run production build**

```bash
npm run build
```
Expected: Successful. Verify:
- `/ways-to-work` and 4 sub-pages appear
- `/capabilities` appears
- `/services` does NOT appear as a page (should be a redirect)
- All problem pages still build
- All blog posts still build
- All regional pages still build

- [ ] **Step 5: Fix any issues**

If any check fails, fix and commit:
```bash
git commit -m "fix: resolve build issues from package model migration"
```

- [ ] **Step 6: Final pricing grep**

```bash
grep -rn "£75.*hour\|75/hr\|hourlyRate" src/ --include="*.ts" --include="*.tsx"
```
Expected: Zero results (or only in test files referencing old patterns).

---

## Task 12: Merge to Main

- [ ] **Step 1: Verify all checks pass on feature branch**

```bash
npm run lint && npx tsc --noEmit && npm test && npm run build
```

- [ ] **Step 2: Merge feature branch**

```bash
git checkout main
git merge feat/package-led-commercial-model
```

- [ ] **Step 3: Verify build on main**

```bash
npm run build
```

- [ ] **Step 4: Clean up prepared files**

Delete the staging files that are no longer needed:
```bash
rm content/data/navigation-new.json content/data/footer-new.json
git add -A
git commit -m "chore: remove staging nav/footer files after merge"
```

---

## Plan B Complete

The site now presents one coherent package-led commercial model:
- 6 new pages live (Ways to Work + 4 package details + Capabilities)
- Homepage rewritten with packages
- 5 problem pages routing to packages
- Agency page reframed
- Results page claims-governed
- Contact page package-aware
- Blog "Related services" links updated
- All service pages redirected
- Navigation and footer swapped
- No "£75/hour" as primary offer anywhere
- All SEO keyword targets preserved

**Next:** Plan C (Polish) — CTA sweep across 74 blog posts and 8 regional pages.
