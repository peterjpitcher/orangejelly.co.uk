# Pre-flight report: repositioning deploy

**Date:** 31 August 2026
**Commit checked:** `37ec452c`, 102 commits ahead of `origin/main`
**Scope:** forms and email, runtime behaviour, SEO and data, accessibility and visual, build and configuration. Five areas, each independently re-verified by a second pass.
**Nothing was deployed, pushed or changed.**

---

## 1. Can this deploy?

**No.** The enquiry form crashes the entire page the moment anyone presses "Let's talk", on both `/contact` and `/start-here`, and there is no other working lead capture anywhere on the site. One line in one file causes it, and it is a fifteen minute fix, but until it is fixed this release ships a site that cannot receive an enquiry.

The reason this is dangerous rather than merely broken: `npm run build` exits 0, `npx tsc --noEmit` exits 0, `npm run lint` passes, all six content gates pass and all 1,613 tests pass. Every gate you would trust is green. The fault only appears when a human presses the button on a real build.

Everything else is in good shape. All 149 sitemap URLs return 200, all 25 redirects resolve in one hop to a live destination, all 105 hero images render, there are no hydration errors on the new build, and the dependency tree is byte-identical to what is deploying successfully today. Fix the blocker, decide on the two social preview items in section 3, and this goes out.

---

## 2. Blockers

### B1. The enquiry form crashes on submit. There is no working lead capture on the site.

**What breaks.** `src/app/actions/enquiry.ts:227` reads:

```ts
export const ENQUIRY_INITIAL_STATE: EnquiryFormState = { step: 1 };
```

That file begins `'use server'`. Next.js permits only async functions to be exported from a `'use server'` file, so the server action module fails to load and the form throws into the error boundary as soon as it is submitted.

**Reproduced twice, independently, on a real production build.** Filled the four fields on `/contact`, clicked "Let's talk": the page was replaced by "SOMETHING BROKE / that is our fault, not yours ... Quote reference 3151331791". The form disappeared. Server log: `Error: A "use server" file can only export async functions, found object.` with `digest: '3151331791'`. Identical result on `/start-here`. It also reproduces under `next dev`, so the fix can be verified without a production build.

**Who it affects.** Every visitor who tries to contact Orange Jelly. `/start-here` is the destination of the primary "Let's talk" call to action in the header on every page of the site (`src/components/oj/SiteChrome.tsx:108`), and `/contact` is the fallback. Both are dead.

**There is no safety net.** I checked whether anything else could catch an enquiry. `submitContactForm` in `src/app/actions/contact.ts` is the only other path that sends a lead email, and its component `src/components/forms/contact-form.tsx` is rendered on no page. `NewsletterSignup.tsx` and `forms/newsletter-form.tsx` are likewise rendered nowhere. `sendLeadNotification` has exactly two call sites: the one that crashes, and one that is unreachable. So the site ships with no working lead path and no working lead email of any kind.

**Why nothing caught it.** `npm run build` (the exact `vercel.json` build command) exits 0 with no mention of the fault. `npx tsc --noEmit` exits 0, because the Next TypeScript rule that catches this only runs in an editor with the Next TS plugin, not in `tsc`. `npx vitest run` gives 86 files and 1,613 tests, all green, including `src/test/enquiry-form.test.tsx` and `src/test/enquiry-action.test.ts`, because Vitest does not enforce the `'use server'` export constraint. There is also no previously working version to notice a regression against: `git cat-file -e origin/main:src/app/actions/enquiry.ts` fails, so the whole enquiry flow is new in this push and has never run in production.

**What it takes to fix.** Move `ENQUIRY_INITIAL_STATE` out of the `'use server'` file into a plain module. `src/lib/schemas/enquiry.ts` already holds the enquiry schemas and is the natural home. Update the import at `src/components/oj/EnquiryForm.tsx:6`. Only async functions may be exported from `src/app/actions/enquiry.ts`.

**Fix the email path in the same change** (see S1 below), then verify once end to end.

---

## 3. Serious but not blocking

### S1. The lead notification email is fired without `await`, and this Next version has no way to keep it alive

`src/app/actions/enquiry.ts:119` is `void afterEnquiryStored(stored.id, data, source);`. The action returns the moment the `contacts` row is written; the conversion event and the Resend call are both still pending. On Vercel the function can be frozen as soon as the response is sent, so the email telling you an enquiry arrived may never be attempted, and the `console.error` that would have recorded the failure never runs either.

There is no escape hatch available on this stack: Next is 14.2.35, `next/server` exports no `after` or `unstable_after`, and `@vercel/functions` is not in `package.json`. The older `src/app/actions/contact.ts:73` does this correctly by awaiting inside the action.

**Cost if shipped.** The lead is safe in Supabase either way, so nothing is lost from the database. What is lost is anyone looking: enquiries pile up in a table with no alert. It is non-deterministic, which is worse than broken, because it will work in testing.

**Fix.** Await `afterEnquiryStored` inside `submitEnquiryStep1` before returning. That adds roughly 200 to 400ms to a form a person submits once. If that latency is unacceptable, add `@vercel/functions` and wrap the call in `waitUntil`, which is the only supported way to defer work on this runtime.

### S2. This site has sent no email in production for at least four weeks, so there is no baseline to notice against

Paging Resend's `/emails` endpoint back to its limit of 2 August 2026 returns 1,948 sends. Grouped by sender: The Anchor 1,587, BaronsHub 222, MixerAI 122, The Dukes Head Leatherhead 16, CareerHub 1. **Not one came from the Orange Jelly website.** The Resend account is shared across at least five unrelated production applications, and the API key sitting in `.env.local` has account-wide reach across all of them.

**Cost if shipped.** It compounds S1 exactly. If the fire-and-forget notification does get frozen after deploy, nobody has a "these normally arrive" expectation to notice against. It also means the availability poll send path has never been exercised in production.

**What to do.** Nothing before deploy. Afterwards, submit one real enquiry and confirm both that the email arrives and that a `conversion_events` row with `event_name='enquiry_submitted'` exists for it. If the row exists but no email arrived, S1 is real.

Related, and worth deciding: `CONTACT_FROM_EMAIL` in `.env.local` uses the apex domain `orangejelly.co.uk`, which is not registered in Resend at all. The only verified domain is `auth.orangejelly.co.uk` (status `partially_failed`: DKIM, both SPF records and the tracking CNAME verified, inbound MX failed, which does not affect sending). `.env.local` is gitignored and never deployed, so this is a local development annoyance only. But **open `CONTACT_FROM_EMAIL` in the Vercel dashboard and confirm the domain is `auth.orangejelly.co.uk` and not the apex.** If it is the apex, every notification fails silently and the enquiry only ever exists in the database. I could not read the encrypted production value.

### S3. The whole repositioning surface has no working social preview image

Two faults compounding.

**First:** 28 pages emit no `og:image` at all. Each defines an `openGraph` block without an `images` key, and Next replaces the parent object rather than merging it, so the layout's image is dropped. `src/app/contact/page.tsx:27-34` is the clearest example. Confirmed against real build output: `grep -c og:image .next/server/app/contact.html` returns 0. Affected: `/contact`, `/about`, `/results` and its 3 case studies, `/start-here`, `/how-we-work`, `/solutions`, `/fractional-cmo`, `/pub-marketing`, `/why-revenue-is-falling`, `/insights` and its 4 articles, `/growth-problems` and its 8 children, `/sectors/professional-services`, `/tools/ai-readiness`. Because those pages define no `twitter` block either, they inherit the root layout's, so their `twitter:title` reads "Orange Jelly | For owners ready to take control of growth" rather than the page's own title.

**Second:** `src/app/robots.ts:18` emits `Disallow: /opengraph-image`. That is the exact URL 29 pages hand to social crawlers as their `twitter:image`, and it is the homepage's `og:image` too (verified in the built `index.html`). Twitterbot, facebookexternalhit and LinkedIn's crawler all honour robots.txt, so the site tells them to fetch an image it also tells them not to fetch. The same rule disallows `/icon` and `/apple-icon`, which is what Google fetches for the favicon shown in search results.

**Cost if shipped.** After this deploy, every share of `/contact`, `/about`, `/results`, `/start-here`, `/solutions`, `/how-we-work`, all 8 growth-problems pages, all 4 insights articles and all 3 case studies renders with no image on any platform, and the homepage loses its image too. These are the pages the repositioning exists to show off. The 104 guide pages are unaffected because they set their own images, so this will not be obvious from spot-checking.

**Fix.** Drop `/opengraph-image` from the robots disallow list (and reconsider `/icon` and `/apple-icon`), and add an `images` key to each page's `openGraph` block, or centralise it through a shared metadata helper so a page-level block cannot silently drop the site default. Adding a page-level `twitter` block corrects the title mismatch at the same time.

### S4. Nine live, indexable pages are withheld from the sitemap, including `/ways-to-work`

Each returns 200 with `<meta name="robots" content="index, follow">` and a self-referencing canonical, and none appears in `sitemap.xml`: `/ways-to-work`, `/capabilities`, `/fix-my-pub`, `/quiet-midweek-solutions`, `/empty-pub-solutions`, `/pub-marketing-no-budget`, `/compete-with-pub-chains`, `/pub-marketing-agency`, `/privacy`.

Mechanism for the first eight: `src/lib/route-manifest.js` marks them `disposition: 'live'` with `sitemap: true`, but `getSitemapRoutes()` (route-manifest.js:700-703) filters out anything in `getNonIndexablePaths()`, and each is declared as a phase 4 redirect source. They are being withheld now for a redirect that has not happened. `/privacy` is separately marked `sitemap: false`.

**Cost if shipped.** `/ways-to-work` is the worst case: it is the section landing page whose four children (`/growth-fix`, `/momentum-month`, `/growth-partner`, `/turnaround-intensive`) **are** in the sitemap, and it is the destination of the `/services` 308 that five guide articles link through. `/fix-my-pub` is the destination of the permanent redirect from `/licensees-guide/cash-flow-crisis-breaking-cycle`. Google is being asked to crawl the children while the parent is hidden, on the same deploy that renames the section carrying 92% of search traffic.

It looks deliberate rather than accidental (phase 4 is staged in the manifest, and `getNonIndexablePaths` drives only the sitemap and the tests, not a noindex tag), so this needs your decision rather than a silent fix.

### S5. `/guides/cash-flow-crisis-breaking-cycle` is in three contradictory states at once

The route manifest declares the slug a retired guide that redirects (`src/lib/route-manifest.js:399-403`, note: "Retired guide, previously 410"), so `getRedirectedGuideSlugs()` removes it from the sitemap. But only the old `/licensees-guide/` path actually redirects. Under the new `/guides/` prefix the article is live, returns 200, self-canonicalises and carries `robots: index, follow`. There is no redirect rule with a `/guides/` source anywhere.

It is also in `search-index.json`, so site search surfaces it, and four published guides link to it in body copy: `pub-business-plan-template-guide.md:160`, `pub-vat-accounting-guide.md:240`, `rent-supplier-negotiations-cash-tight.md:50`, `cashflow-fixes-when-trade-drops.md:166`.

**Cost if shipped.** Either a page you meant to retire is still live and internally linked, or a page you meant to keep is being withheld from Google. Whichever was intended, one of the two is wrong. **Fix.** Decide the intent: add a `/guides/` redirect and replace the four links, or drop it from the manifest's redirect list so the sitemap advertises it again.

### S6. The 404 page renders the site chrome twice, and the upper one is the old navigation

Confirmed on a dead URL: HTTP 404 with two `<header>`, two `<footer>`, two `<main>` and `id="main-content"` twice. `nav[0]` reads "Home / Ways to Work / Capabilities / Results / About / Contact", the pre-repositioning labels. `nav[1]` reads "Unlock growth / How we work / What we build / Results / Insights / Guides". The homepage and guide pages correctly render one of each.

Cause: `src/app/not-found.tsx:31` renders `OjHeader`/`OjFooter` while `src/app/layout.tsx:244-252` also renders the legacy `NavigationWrapper`/`FooterWrapper`. `ChromeGate` (`src/components/ChromeGate.tsx:35`) only suppresses the legacy chrome when `isOjRoute(pathname)` matches, and a 404 URL matches no route.

**Cost if shipped.** Duplicate `id="main-content"` is invalid HTML and makes the skip link ambiguous for screen reader and keyboard users; two `<main>` landmarks break landmark navigation. It matters more than usual here, because renaming a whole section pushes more traffic than normal through the 404 page, and any old inbound link that was never mapped lands exactly there.

**Fix.** Have `ChromeGate` treat an unmatched route as an OJ route, or have `not-found.tsx` not render its own chrome. Then assert in a test that the 404 page has exactly one of each, since nothing currently checks it.

### S7. Microsoft Clarity keeps recording after a visitor rejects analytics, and is not disclosed on `/privacy`

Three problems from one integration, injected by GTM rather than by any component in `src/`.

- **Consent.** After clicking "Reject analytics" (localStorage becomes `{"analytics":false,...}`), I navigated to `/about`, moved and scrolled: `POST https://j.clarity.ms/collect` returned 204. `window.clarity` remains a live function. A session recording tool keeps running against someone who explicitly said no. GA4, by contrast, correctly runs consent-denied (`gcs=G100`, `npa=1`, no cookies).
- **Disclosure.** `/privacy` names Cloudflare, Google Analytics, Google Tag, Resend, Supabase, Turnstile and Vercel. It never mentions Microsoft or Clarity.
- **Correctness.** `src/middleware.ts:80` allows only `www.`, `h.` and `j.clarity.ms` in `connect-src`, but Clarity rotates ingest across lettered shard hosts. Live console on production: `Connecting to 'https://n.clarity.ms/collect' violates the following Content Security Policy directive: connect-src ... The action has been blocked.` Other agents saw `f.`, `l.`, `u.`, `k.` and `e.` blocked on the same site. So the data you do collect is incomplete and the shard letter varies run to run. Across a 154-route crawl of the new build there were 524 `connect-src` violations, which is enough noise to bury a real console error.

The CSP is unchanged in this release (`git diff origin/main..HEAD -- src/middleware.ts` touches only three `/licensees-guide` strings), so this deploy carries the fault forward rather than causing it.

**Cost if shipped.** You relaunch the site with rewritten copy on every page and a renamed section, and the behaviour data you would use to judge it is partial, while a tool you have not disclosed keeps recording people who opted out.

**Fix.** This is a decision for you, not a silent change. If Clarity stays: replace the three literal hosts in `connect-src` with `https://*.clarity.ms`; gate the Clarity tag in GTM on the same consent signal GA4 already uses; add Microsoft Clarity to the `/privacy` third-party list and the banner's "Analytics (optional)" description. If it goes: remove the GTM tag and the preconnect at `src/components/PerformanceMonitor.tsx:80`.

### S8. Helper text on all four package pages renders at 1.89:1 and is effectively invisible

`src/components/packages/PackageCTA.tsx:50-52` uses `<Text size="xs" color="muted">` for "Prefer email? Use the enquiry form. Peter responds as quickly as he can." That computes to `rgb(68,89,116)` on the navy band `rgb(26,47,73)` at 12px: **1.89:1 against a 4.5:1 minimum.** It appears on `/ways-to-work/growth-fix`, `/momentum-month`, `/growth-partner` and `/turnaround-intensive`.

**Cost if shipped.** These are the main commercial pages, and the one line telling a hesitant visitor they can email instead of ringing is the one line they cannot read. The `muted` token is designed for light surfaces and is being used on a dark band.

**Fix.** Use the on-dark muted token, the same reversal `FeatureList` already documents for orange on dark.

### S9. The package comparison table loses its labels below 640px, with no legend

`src/components/packages/PackageComparison.tsx:35` renders the label as `<span className="hidden sm:inline">`. At 375px all 55 label spans compute `display: none`, which also removes them from the accessibility tree. Scanning the page text at 375px: "Included", "Light-touch" and "Not included" are all absent, and there is no legend or key anywhere. At 1280px all three return.

**Cost if shipped.** A phone visitor sees only a tick, a filled circle, a plus or an en dash on the table people use to choose which package to buy, and has to guess. A screen reader user hears a bare dash.

**Fix.** Keep the label available to assistive technology at all widths (visually hidden rather than `display: none`), or render a compact legend above the table on narrow viewports.

### S10. Nineteen guide pages scroll sideways on a phone

52 of 106 guide markdown files contain tables. 19 of those overflow a 375px viewport, because no rendered table is wrapped in a horizontal scroll container: every page reports `inScroller=0`. Worst offenders: `/guides/profitable-pub-food-menu-ideas` at 616px against a 375px viewport (over by 241px), `/guides/family-craft-hour-101` (+117px), `/guides/quiet-monday-night-promotions` (+116px), `/guides/reboot-pub-atmosphere-on-budget` (+108px).

There is a written assumption behind it worth quoting, at `src/app/globals.css:1150-1152`: "The design team confirmed .oj-prose already covers in-article tables, so nothing separate needs building for them." The rule beneath it sets `width: 100%` with no overflow wrapper. These 19 pages falsify that assumption.

**Cost if shipped.** The whole page drifts sideways as you scroll, so body text runs off the edge and the reader has to pan left and right to read every paragraph, not just the table. Most guide traffic is mobile, and these are the pages meant to demonstrate competence. No marketing route is affected.

**Fix.** Wrap rendered tables in a container with `overflow-x: auto` in the guide prose styles. One change fixes all 19.

### S11. The sticky bar's dismiss button is a 16x16 target on 15 routes

`src/components/engagement/StickyEngagementBar.tsx:157-174` carries `min-h-0 min-w-0` around a 16x16 SVG. Measured at 16x16. That is below WCAG 2.2 AA's 24x24 minimum and well below the project's own `--tap-target-size: 44px` (`src/app/globals.css:131`). The bar's two calls to action are also undersized at 101x28 and 131x28. The bar is fixed to the bottom of the screen.

**Cost if shipped.** A visitor with imprecise touch who cannot hit the X keeps a permanently obstructed viewport on a phone. The button is otherwise correct: a real `<button>` with `aria-label="Dismiss"`, keyboard reachable.

**Fix.** Remove `min-h-0 min-w-0` and add padding so the box reaches 44x44 while the icon stays 16x16.

### S12. Preview deployments write to the production database with the production service-role key

`vercel env ls` shows `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` all provisioned for **Preview** as well as Production, and no code path gates the enquiry write or the lead notification on environment. So anyone exercising the enquiry form on a preview URL creates a genuine production lead and emails you for real.

There is a guard in `src/lib/email.ts:171` intended to stop preview builds sending poll email, but it never fires: `NEXT_PUBLIC_BASE_URL` is set in **no** Vercel environment, so `getBaseUrl()` falls back to `https://www.orangejelly.co.uk` and the comparison always passes. Note the harm the guard exists to prevent (a dead preview link in a stranger's inbox) cannot actually occur, because the links point at production and work. The real exposure is the shared credentials, and it is a standing pre-existing condition this deploy does not change.

**A warning about the obvious fix.** The guard compares `getBaseUrl()` against the hard-coded literal `PRODUCTION_BASE_URL = 'https://www.orangejelly.co.uk'` (`src/lib/email.ts:86`). If you set `NEXT_PUBLIC_BASE_URL` in **Production** to anything not byte-identical to that string (the apex without `www`, an `http` scheme, a `vercel.app` host), **every poll email in production stops silently, including the 03:00 daily cron**. The current absence of the variable is precisely what makes production sending work. If you set it, Production must be that exact literal, or left unset. And note it guards poll email only: `sendLeadNotification` has no base-URL guard at all, so a preview enquiry submission still writes a real row and still emails you.

**Cost if shipped.** Unchanged from today. Treat every preview deployment as live and do not exercise the poll or enquiry forms on one.

### S13. The RSS feed declares every hero image as SVG

`src/lib/feeds.ts:65` hardcodes `type="image/svg+xml"` on every `<enclosure>`. All 105 hero images are now `.webp`, so all 20 items in the live feed declare the wrong type. The files themselves are served correctly as `image/webp`, and the XML is still well formed.

**Cost if shipped.** Feed readers and syndication services that trust the declared type will not render the hero, or will reject the enclosure. **Fix.** Derive the MIME type from the extension rather than hardcoding it.

### S14. Your own pre-flight audits are lying to you right now, because three servers share one `.next`

`npm run audit:contrast` against `localhost:3000` reports **6 failing text nodes across 30 of 34 routes**. The same script against a clean copy of identical source reports **41 across 34 of 34**. The two sets are disjoint, not merely smaller: the six on :3000 are `rgba(16,16,16,0.3)` disabled-button text that does not appear in the clean run at all. `audit:images` is similarly wrong (4 "distorted" images, all of them 500 responses, against 1 real one).

Cause: **three** servers are running against the project. `next dev` on :3000 (PID 63114), a second `next dev` on :3001 (PID 64801) sharing the same `.next`, and a stale `next start` on :3100 (PID 1979) from a **pre-rename build** that returns 200 on the package pages but 404s `/guides`. Two dev servers on one `.next` corrupt each other, and a `next build` written into a live dev server's directory does the same. The symptom on every corrupted route is `Cannot find module './1682.js'` from `.next/server/webpack-runtime.js`.

To its credit the audit does not fail quietly: it prints "3 route(s) could not be loaded and were NOT measured" and "The result above is incomplete. Fix these before trusting it." But the headline number is the number people read.

**Fix.** Stop **all three** processes, delete `.next`, restart one. Stopping only :3000 will not hold. Warn whoever owns :3100 first, because deleting `.next` breaks it. Production is unaffected: Vercel builds from a clean checkout.

### S15. `PREVIEW_SECRET` is not set, so draft preview is dead, and `/api/health` does not exist

`src/app/api/preview/route.ts:20-23` reads `process.env.PREVIEW_SECRET`. `vercel env ls production` lists a leftover `SANITY_PREVIEW_SECRET` (390 days old) and no `PREVIEW_SECRET`, so `https://www.orangejelly.co.uk/api/preview` returns 500 "Preview secret not configured". It fails closed, so there is no security hole, but you cannot preview a draft guide before publishing.

Separately, `CLAUDE.md` declares `health_endpoint: "/api/health"` and there is no such route: `https://www.orangejelly.co.uk/api/health` returns 404. If any uptime monitor points there, it is telling you nothing.

**Fix.** Either add `PREVIEW_SECRET` (Production and Preview) with the value currently in `SANITY_PREVIEW_SECRET` and delete the Sanity-named one, or remove `src/app/api/preview` entirely. Add a minimal `src/app/api/health/route.ts` returning `{status:'ok'}` with `export const dynamic = 'force-dynamic'`, or delete the claim from `CLAUDE.md`. Adding the route is the smaller change and gives you something to point a monitor at during the deploy. While you are in there, `src/app/api/preview/route.ts:27` compares the secret with `!==`, a timing oracle; `src/app/api/cron/polls/route.ts:43-49` does it properly with `crypto.timingSafeEqual` and is the pattern to copy.

---

### Minor, worth a tidy pass afterwards, not before

| # | Issue | Where |
|---|---|---|
| M1 | The enquiry honeypot is hidden by CSS alone, and filling it silently discards a real enquiry while showing the success message | `EnquiryForm.tsx:198` with `enquiry.ts:93`; add an inline style so it stays hidden with no stylesheet |
| M2 | A step-two validation failure discards all six qualification answers and still says the enquiry arrived | `enquiry.ts:262-273`, return value never read |
| M3 | The enquiry rate limiter is skipped entirely if `RATE_LIMIT_KEY_PEPPER` goes missing, contradicting the "FAIL CLOSED" comment above it. The pepper is currently present in Preview and Production, so this is latent. There is no CAPTCHA on this form | `enquiry.ts:103`; `polls.ts:174` has the correct pattern |
| M4 | `/api/events` is a public unauthenticated POST writing two rows per call, no rate limit, no length bound on attacker-controlled referrer and UTM text | `src/app/api/events/route.ts:7`, `src/lib/db/leads.ts:42-45` |
| M5 | 19 pages still render the old `FooterSimple` with 18 links under 44px tall, alongside the new `oj/Footer` elsewhere. (The "Licensee's Guide" label is **not** stale: it is the section's intentional display name, used in page titles, breadcrumbs and schema across the new pages too. Do not "fix" it.) | `src/components/FooterSimple.tsx` |
| M6 | 29 heading-level skips across the static routes: `h3` to `h5` from the footer on 21 routes, `h2` to `h4` from case study and step cards on about 12. WCAG 1.3.1 Level A | `FooterSimple.tsx:81,99`; `CaseStudyCard.tsx:32`; `PubServiceLandingPage.tsx:141` |
| M7 | Green tick glyphs measure 4.23:1 on cream against a 4.5:1 minimum, despite a code comment saying the colour was stepped up specifically to clear AA. The step was made but did not go far enough | `src/components/FeatureList.tsx:37` |
| M8 | Amber bullets at 2.15:1, exposed to screen readers, and purely decorative (every item carries the same one) | `PackageDetail.tsx:102` |
| M9 | Olive category badge at 4.45:1 | `/sectors/professional-services` |
| M10 | `/logo.png` is not covered by the immutable cache rule (returns `max-age=0, must-revalidate` while `/images/*` returns `max-age=31536000, immutable`), and it is preloaded on every page but not used in time, producing 20+ console warnings per page load | `vercel.json` headers; `PerformanceMonitor.tsx` |
| M11 | The logo is squashed 4% wherever it renders at 48x48 (source is 328x316), on 17 routes. Eight header images use `fill` inside a `position: static` parent | `audit:images` output |
| M12 | The cookie banner's "Manage settings" reveals no settings: zero checkboxes or toggles, just the same two buttons | Cookie consent banner |
| M13 | Two internal links point at a 308 rather than the destination: `/services` (5 guides plus 3 service pages) and `/services/instagram-services-for-pubs` (1 guide) | markdown body copy |
| M14 | `summer-moments-simple-campaigns.md` uses `publishedAt`/`description` instead of `publishedDate`/`excerpt`, so its excerpt is empty in site search, on category cards and in its BlogPosting schema. Head tags are rescued by an override so an SEO crawl will not show it | `content/blog/summer-moments-simple-campaigns.md:4-5`; `src/lib/blog-md.ts:181` |
| M15 | Sitemap `lastmod` is hardcoded to 2026-08-28 and 2026-08-09 for the case studies, growth-problems and category pages. Today is 2026-08-31 and the rewrite landed after those dates, so the most-changed pages advertise the stalest dates | `src/app/sitemap.ts:52,59,66` |
| M16 | Legacy category URLs become a two-hop chain after this deploy (`/licensees-guide/category/x` 301 to `/guides/category/x`, then 308 to the new taxonomy). Today it is one hop. Still resolves, still passes equity | `route-manifest.js` plus `middleware.ts:118-133` |
| M17 | Middleware runs on every static file in `/public` (359 files, 117MB, now including 105 heroes). Verified: `/logo.png` and `/robots.txt` both return a CSP header. Billable edge invocations for nothing. If you exclude extensions, keep `.svg` inside the matcher | `src/middleware.ts:159-167` |
| M18 | No Node version is pinned anywhere: no `.nvmrc`, no `engines`, no `.npmrc`. The Vercel dashboard setting is the only pin and nothing in the repo would flag a mismatch. Local is v26.4.0 | `package.json` |
| M19 | Dead Sanity configuration is still wired in, including `SANITY_API_TOKEN`, a live write credential injected into every serverless invocation for a CMS with zero references left in `src/` | `vercel.json:5-14`, Vercel env |
| M20 | Three `/services/*` pages still exist as files while also being permanent redirect sources, so they are unreachable dead code that still gets built | `src/app/services/`, manifest indices 1, 11, 12 |
| M21 | `robots.txt` disallows `/admin/` with a trailing slash, so `/admin` itself is crawlable. Nothing sensitive is exposed (all data sits behind `requireAdmin`) | `src/app/robots.ts:14` |
| M22 | API routes receive no CSP header, because the middleware matcher excludes `api`. `next.config.js` supplies the other four security headers for `/api/:path*` but not CSP. Low impact for JSON | `src/middleware.ts:159` |
| M23 | GTM consent-defaults script uses `beforeInteractive` from inside a client component, which Next does not support outside the root layout. Lint warns. Risk is that consent defaults may not run before GTM bootstraps | `src/components/GoogleTagManager.tsx:29` |
| M24 | `axe-core` is imported by a test but not declared in `package.json` (resolves transitively today). `framer-motion` is a production dependency with zero imports | `package.json` |
| M25 | Four large source images will be slow and costly to optimise on a cold cache immediately after deploy: `the-anchor-exterior.jpg` 3.3MB, `low-budget-pub-marketing-ideas.png` 1.7MB, `the-anchor-map.jpg` 1.7MB, `peter-and-billy-anchor.jpg` 1.3MB | `public/images/` |
| M26 | An untracked scratch file `__probe4.mjs` (2.9KB, a Playwright script) has been left in the repo root by one of today's sessions. Untracked so it will not deploy, but it should go | repo root |

---

## 4. What was verified

Every row below was executed, not inferred. All server-based checks ran against isolated copies of the repository with `node_modules` symlinked, so nothing touched your `.next` or your running dev servers.

| Area | Check | Result |
|---|---|---|
| **Build** | Six pre-build content gates (`growth-language`, `british-english`, `design-tokens`, `positioning`, `slugs`, `claims`) | Pass. All exit 0. "Positioning check passed across 55 files, with 2 file(s) still carrying a phase 4 exemption"; "Slug check passed: 105 guide articles, 4 insights, no collisions"; "Claims check passed: every figure in new content is one of the 17 approved" |
| **Build** | `npm run build` (the exact `vercel.json` build command), in an isolated copy | Exit 0. 180 static pages. Does **not** catch the blocker |
| **Build** | `npx tsc --noEmit` | Exit 0, no output. Does **not** catch the blocker |
| **Build** | `npx next lint` | Zero errors, one warning (`GoogleTagManager.tsx:29`, `no-before-interactive-script-outside-document`) |
| **Build** | `npx vitest run` | 86 files, 1,613 tests, all pass, in 12s. Does **not** catch the blocker |
| **Build** | `next.config.js` loads; `redirects()` and `headers()` resolve | Pass. 25 redirects, 1 header group |
| **Build** | Dependency change in this release | **None.** `git diff --stat origin/main..HEAD -- package-lock.json` is empty. Identical risk profile to what is deploying today |
| **Build** | `npm audit --omit=dev` | 4 high, 0 critical (next 14.2.35, postcss, nanoid, picomatch). None new. Next 14.2.35 is patched against CVE-2025-29927, the middleware auth bypass, which matters because middleware sets every security header |
| **Build** | Install-time hooks | Only `"prepare": "husky \|\| true"`. No preinstall/postinstall |
| **Build** | Secrets committed to the repository | None. Full tracked-tree grep for 12 credential patterns: zero hits outside `package-lock`. `.env.local` untracked, covered by `.gitignore:26` |
| **Build** | Untracked files that would join the deploy commit | Three, all documentation or scratch: `REVIEW-HANDOFF.md`, `seo-powerhouse-technical-brief.md`, `__probe4.mjs` |
| **Build** | Deployment asset volume | 359 files, 117MB in `public/`. Well inside Vercel limits; static assets are CDN-served, not bundled into the function |
| **Runtime** | All 149 sitemap routes on a real production build | 149/149 return 200. Zero 4xx or 5xx sub-resources |
| **Runtime** | React hydration mismatches across all 149 routes on the production build | **Zero.** (Live production today throws minified React #425 and #422 on `/contact` and `/availability/new`, so this release fixes them) |
| **Runtime** | 105 hero images actually render, not merely resolve | 105 files on disk, 104 published guides all resolve, 0 missing, 0 broken `naturalWidth` across 149 pages, 424 images |
| **Runtime** | Enquiry form submit on `/contact` and `/start-here`, production build | **FAIL.** Page replaced by error boundary, digest `3151331791`, form gone. See B1 |
| **Runtime** | Every `'use server'` file audited for the same defect | One offender only: `enquiry.ts:227`. The other six action files are clean |
| **Runtime** | All 25 redirects (22 permanent 308, 3 temporary 307: `/autumn`, `/christmas`, `/summer`, the Greene King and BII print toolkits) | 25/25 reach the declared destination, 0 mismatches, 0 chains, every destination returns 200 |
| **Runtime** | All 105 old `/licensees-guide/<slug>` URLs, not just samples | 105/105 reach a 200 in exactly one hop. Unknown slugs 404 correctly |
| **Runtime** | Internal link integrity across all 149 pages | 168 distinct internal hrefs, **zero 404s**, 2 single-hop 308s (`/services`, `/services/instagram-services-for-pubs`) |
| **Runtime** | Deleted routes and phase-4 gating | `/test-shadcn` and `/about-demo` correctly 404. Phase 4 sources still serve 200 as intended |
| **Runtime** | Cookie banner accept / reject / manage | Accept writes consent and sets `_ga`/`_clck`; Reject writes `{"analytics":false}` and sets no cookies; both dismiss and persist across navigation. GA4 correctly honours the reject |
| **Runtime** | AI readiness scorecard end to end | 12 groups, 48 radios. Answered all 12 at both extremes: outcome text changes. Zero JS errors |
| **Runtime** | Site search on `/guides`, including empty state | "quiz" takes links 116 to 124; nonsense query gives the correct "No matching articles" state. Zero JS errors |
| **Runtime** | Mobile drawer at 375px | Toggle 68x44, `aria-expanded` false to true, body overflow locks, 7 links all above 44px, Escape closes, closes on navigation |
| **Runtime** | Protected routes leak no data unauthenticated | `/admin` renders a sign-in form only. `/api/admin/*` and `/api/cron/polls` return 401, `/api/preview` 401/500. `robots.txt` disallows `/admin/`, `/api/`, `/search-index.json` |
| **Runtime** | 404 page | **FAIL.** Correct 404 status, but two headers, two footers, two mains, old nav. See S6 |
| **Forms** | Every form on the site, and which are reachable | 12 files contain `<form>`. Only `EnquiryForm` is on a live page (`contact/page.tsx:61`, `start-here/page.tsx:197`). No live newsletter signup exists anywhere after this release |
| **Forms** | Enquiry validation, escaping and header injection | Correct. Zod schema at `src/lib/schemas/enquiry.ts:20-57`; first issue per field returned; `escapeHtml` covers `& < > " '`; CR/LF stripped from company before the Subject header; `replyTo` is the validated address |
| **Forms** | The contact row is written first, alone, and is the sole success condition | Correct. `storeEnquiryStep1` is awaited and is the only thing that produces a user-facing error. A failed email cannot lose the enquiry |
| **Forms** | Live production `contacts` schema has every column the writer sends | Pass. Queried project `miqqkllqfyvaomzgujed` directly: all columns present, both August migrations applied, `contacts_status_check` matches `LEAD_STATES` exactly |
| **Forms** | Rate-limit machinery works against production | `poll_rate_limit_hit(text,text,int)` exists; `poll_rate_limits` has no bucket CHECK, so the new `enquiry_ip` and `enquiry_email` buckets insert cleanly. Six round trips measured 45 to 277ms against a 1,000ms timeout |
| **Forms** | Insert cannot fail on a missing column | Every NOT NULL column the step-one insert omits carries a default (`qualification '{}'::jsonb`, `status 'new'`, `schema_version 1`, `completed_step 1`, timestamps) |
| **Forms** | Repeat enquirer does not hit a constraint violation | `contacts.email_normalized` has a plain btree index only, no UNIQUE |
| **Forms** | Anon key cannot read lead data | RLS enabled with zero policies on `contacts`, `conversion_events`, `lead_sources`, `newsletter_subscribers` |
| **Forms** | No redirect touches the form pages | None of the 25 redirects touches `/contact` or `/start-here`, and there are no wildcard sources over them |
| **Forms** | Admin API auth over enquiry data | Correct. Bearer token verified with `supabase.auth.getUser(token)` rather than decoded locally, then checked against the `ADMIN_EMAILS` allowlist. Fails closed on missing config |
| **Forms** | Bot protection on the enquiry form | **There is no Turnstile in the enquiry path at all.** Only a honeypot and the rate limiter. Turnstile exists only on the poll create form |
| **SEO** | `sitemap.xml` | 149 `<loc>`, 0 duplicates, `xmllint` clean, all 149 return 200 with no redirect. **But nine live indexable pages are absent, see S4** |
| **SEO** | Canonicals across all 149 pages | 0 missing, 0 multiple, 0 mismatched, 0 duplicated across pages, 0 noindex |
| **SEO** | JSON-LD, all 149 pages (not a sample) | 494 blocks, 0 parse errors, 0 pages without JSON-LD. 643 typed nodes validated against per-type required fields: 0 issues. All dates parse |
| **SEO** | Titles and meta descriptions | No duplicates and none missing across 149 pages |
| **SEO** | `feed.json` | Valid JSON Feed 1.1, 20 items, all URLs on the production host, all resolve 200, newest date matches the newest article |
| **SEO** | `public/search-index.json` currency | Byte-identical to a freshly generated index. 105 entries, all 105 URLs resolve |
| **SEO** | All 105 articles parse; front matter; slugs | 0 parse errors, 0 duplicate slugs, 0 slug/filename mismatches, 0 bad or future dates. 105 unique hero images, 0 missing on disk, 0 shared between articles |
| **SEO** | Internal links inside the 105 markdown files | 114 unique targets, 561 instances, 0 broken |
| **SEO** | Retired claims do not appear in rendered output | 0 hits across 149 pages for the nine retired figures. The 58%/71% figures in guides are industry benchmarks in body copy, not Orange Jelly proof points. `ROICalculator`'s unapproved 80%/75%/15% is not rendered by any page |
| **A11y** | Exactly one `h1` per page | Pass on all 43 routes at both 1280x900 and 375x812 |
| **A11y** | Every image has an alt attribute | Pass. 105 guide pages, 424 images, 0 missing, 0 filename-as-alt. Hero images and the portrait correctly use `alt=""` as decorative |
| **A11y** | Every visible form control has a label | Pass, checked control by control. `/contact` 11 controls, `/tools/ai-readiness` 48 radios, `/availability/new` 19 controls, `/guides` search input. Honeypots correctly hidden from sight, keyboard and assistive technology |
| **A11y** | Keyboard reachability | 0 positive `tabindex`, 0 elements with `cursor: pointer` that are not focusable, on every page tested at 375px. All disclosures are real buttons with `aria-expanded` |
| **A11y** | Skip link | Works. First tab stop, 154x44 at top-left on orange, Enter moves to `#main-content` |
| **A11y** | Focus visibility | 0 of 40 controls per route lacked a visible focus change |
| **A11y** | Colour never the sole carrier of meaning | Pass. Every colour is paired with a text badge or a distinct glyph in `ContentBoundaries`, `PackageComparison` and `FeatureList` |
| **A11y** | Contrast on the guide pages (all 105, which both audit scripts skip by default) | **0 failures.** The dynamic-route blind spot in the audit is real but is hiding nothing |
| **A11y** | Contrast at mobile width (the audit runs desktop-only) | Identical 41 failures, identical breakdown. No mobile-only contrast defects |
| **Config** | Every environment variable the code reads, against `vercel env ls production` | 12 of 12 required vars present. Absent with safe fallbacks: `NEXT_PUBLIC_BASE_URL`, `POLL_FROM_EMAIL`, `NEXT_PUBLIC_GOOGLE_VERIFICATION`, `DATABASE_URL`, `DATABASE_SSL`. Absent and broken: `PREVIEW_SECRET` (S15) |
| **Config** | Supabase, `ADMIN_EMAILS` and `CRON_SECRET` are configured in production | Confirmed by probe without side effects. `/api/admin/stats` returns 401, and the code returns 500 first if Supabase or the allowlist were missing. `/api/cron/polls` returns 401, and returns 503 first if `CRON_SECRET` were unset |
| **Config** | `RATE_LIMIT_KEY_PEPPER` set in Preview and Production | Present, so M3 is latent rather than live |
| **Config** | `NEXT_PUBLIC_GTM_ID` and `NEXT_PUBLIC_TURNSTILE_SITE_KEY` inlined into the production build | Both confirmed live in the DOM. GTM-WBHJ7Q2H and G-HV3S9HHQ9C load; the Turnstile API script is present on `/availability/new` |
| **Config** | Security headers applied in production | `strict-transport-security: max-age=31536000; includeSubDomains`, `x-frame-options: SAMEORIGIN`, `x-content-type-options: nosniff`, `referrer-policy: strict-origin-when-cross-origin`, `permissions-policy: camera=(), microphone=(), geolocation=(), browsing-topics=()`. The middleware block is byte-identical to `origin/main` |
| **Config** | CSP permits GTM, GA4, fonts, Vercel Analytics and Speed Insights | Pass, no violations. Fonts are self-hosted via `next/font`. **Clarity is the sole exception, see S7** |
| **Config** | `vercel.json` cache headers and cron declaration | `/images/*` returns `max-age=31536000, immutable`. The single cron (`/api/cron/polls`, `0 3 * * *`) matches a real route with `runtime: nodejs`, `dynamic: force-dynamic`, `maxDuration: 60` |
| **Config** | `rss.xml` and `feed.json` are current | Both regenerated in the rename commit. Zero occurrences of `licensees-guide` in either |
| **Config** | Dev-only routes are not exposed | `/dev/components` calls `notFound()` when `NODE_ENV === 'production'`, plus noindex metadata |
| **Hygiene** | Repository left unmodified by these checks | `git status --porcelain` unchanged. All work in scratchpad copies, since deleted. Your dev servers untouched |

---

## 5. What could NOT be verified

Be aware of these before you treat section 4 as complete. Nothing here is assumed to work.

1. **That an enquiry actually reaches the database and triggers an email.** The form crashes before the server action is ever invoked, so `storeEnquiryStep1`, `sendLeadNotification` and the rate limiter are all unreachable through the interface. Nobody pushed a test submission straight at the action, because `.env.local` carries live production credentials and it would have written a real row and sent a real email. **Needed:** fix B1, then submit once and confirm both the row and the email land. Say whether you are happy for that test row to exist in production or want it pointed at a branch database first.

2. **The production value of `CONTACT_FROM_EMAIL`.** Vercel stores it encrypted, and `vercel env pull` was deliberately not run because it writes plaintext secrets to disk. **This is the single most load-bearing unknown.** If it is the apex domain rather than `auth.orangejelly.co.uk`, every notification fails silently. **Needed:** you open it in the Vercel dashboard.

3. **That `RESEND_API_KEY` is valid and unexpired.** The variable exists and the code fails closed when it is missing, but proving the key works means sending an email. Compounded by S2: this site has sent nothing in four weeks, so there is no evidence either way. **Needed:** one real submission after deploy.

4. **That `TURNSTILE_SECRET_KEY` pairs with the site key in Vercel.** Both exist and were created on the same day, which is suggestive, not proof. A mismatch fails only at verify time, on submit, so it would show as poll creation silently rejecting everyone. **Needed:** create one real poll on production after deploy.

5. **That the Vercel cron fires and authenticates.** `CRON_SECRET` is confirmed set and the route behaves correctly, but the next run is 03:00 and nobody triggered it. The route returns 500 on any failed pass, and that non-200 is the only alerting the poll retention sweep has. **Needed:** check the Vercel cron log the morning after deploy.

6. **The Vercel Node.js version.** Not in the repository and not exposed by `vercel env ls`. Vercel has been retiring Node 18 (end of life September 2025); if this project is still pinned to 18.x, a deploy this large is the wrong moment to find out. **Needed:** Settings, General, Node.js Version in the dashboard, before deploying.

7. **`NEXT_PUBLIC_BASE_URL` in Vercel Production.** It is `http://localhost:3000` in `.env.local`, which made the local sitemap advertise 149 localhost URLs. `.env.local` is gitignored so that value cannot reach Vercel, and the code default when unset is correct. But a variable set to a *wrong* value in the dashboard would poison every canonical, og:url, sitemap entry and feed URL at once, and would silently kill poll email (see S12). **Needed:** read the Production value in the dashboard.

8. **A production build on the actual repository.** Every build above ran in an isolated copy, because your `.next` is corrupted by three concurrent servers (S14). **Needed:** stop all three, `rm -rf .next`, run one clean `npm run build`.

9. **Real edge and CDN behaviour.** Everything ran against `next start` or `next dev` on localhost. Redirect handling at the edge, image optimisation, cache invalidation and the apex-to-www rule in `vercel.json` are only exercised on the platform. **Needed:** run the route sweep against the Vercel preview deployment before promoting.

10. **Admin authentication beyond the sign-in screen.** No credentials, so `/admin` was confirmed to leak nothing unauthenticated, but the auth flow and everything behind it is untested. **Needed:** you sign in on a preview deployment.

11. **The `/availability` poll flows past `/availability/new`.** Organiser, participant, edit and verify screens are all token-gated and no valid tokens were available. Those forms are unaudited for labels, focus and mobile layout.

12. **Whether Google and Bing accept the structured data.** All 494 blocks are valid JSON and all 643 typed nodes carry their required fields, but Google's Rich Results Test applies stricter and sometimes undocumented rules. **Needed:** run it on one page per template after deploy.

13. **How Facebook, LinkedIn and X actually render shares.** Tag presence and image reachability were confirmed, but scraper behaviour (dimension minimums, cached previous scrapes) cannot be tested locally, and S3 means they are currently blocked from the image anyway. **Needed:** the sharing debuggers on live URLs after deploy.

14. **Real assistive technology.** Every screen reader claim above is inferred from the DOM and the accessibility tree. Nobody drove VoiceOver or NVDA, so reading order and announcement quality are unconfirmed. Likewise no colour-blindness simulation was run: the check was that no distinction is carried by hue alone, programmatically.

15. **Image weight and dimensions of the 105 heroes.** All confirmed to resolve as `image/webp`; none measured against the 100KB budget in `CLAUDE.md`, and og:image needs at least 1200x630 to render large on most platforms. **Needed:** `scripts/audit-images.mjs`, once `.next` is clean.

16. **The no-JavaScript path on the enquiry form.** The server-rendered markup does carry React's progressive-enhancement action fields, so it is wired, but it could not be executed. **Needed:** a manual test with JavaScript disabled, after B1 is fixed.

---

## 6. What to watch after deploying

This release renames the URL section carrying 92% of search traffic, so the first hour is about proving the redirects hold and the first week is about proving Google follows them.

### First hour

1. **Submit the enquiry form once, for real, on production.** Confirm three things: the form does not crash, a row appears in `public.contacts`, and the notification email arrives at `peter@orangejelly.co.uk`. If the row appears but no email does, S1 is real and needs the `await` fix immediately. This is the single most important post-deploy check.
2. **Spot-check ten old guide URLs.** Take ten `/licensees-guide/<slug>` links from Search Console's top pages and confirm each returns a single 301 to the `/guides/` equivalent, which then returns 200. All 105 pass locally; the question is whether Vercel's edge agrees.
3. **Check `/licensees-guide/category/<slug>` for the legacy categories.** These now take two hops (M16). Confirm each lands on the right one of the eight new categories.
4. **Load a dead URL** and confirm the 404 page renders once, not twice, if you fixed S6. If you did not, expect people who followed an unmapped old link to see two navigations, one of them the retired one.
5. **Check the Vercel deployment log for the build itself**, since nobody has run `next build` on a clean `.next` for this commit.
6. **Watch `/contact`, `/start-here` and the homepage on a real phone.** Those three carry the primary conversion path.

### First 24 hours

7. **The 03:00 cron.** Check the Vercel cron log the next morning. The route returns 500 on a failed pass and that non-200 is the only alerting the poll retention sweep has.
8. **Server error rate in Vercel.** Anything above baseline points at a route that renders differently under the platform than under `next start`.
9. **Create one real poll**, if you use them, to prove the Turnstile key pair and the poll email path, neither of which has ever run in production (S2).

### First week

10. **Search Console, Pages report, daily.** You are looking for the crawl of `/guides/*` rising as `/licensees-guide/*` falls. A rise in "Page with redirect" is expected and healthy. A rise in "Not found (404)", "Crawled, currently not indexed" or "Discovered, currently not indexed" on `/guides/*` is not. Submit the new sitemap on day one.
11. **Watch impressions, not positions, for the first ten days.** A section rename usually costs a temporary dip while Google reprocesses. Impressions recovering to baseline within two weeks is normal; still falling at three weeks means something is wrong with the redirects rather than with the ranking.
12. **Check that the nine withheld pages (S4) are being found.** `/ways-to-work` in particular: its four children are in the sitemap and it is not, and it is the destination of the `/services` redirect five guides link through. If it stays uncrawled, that decision needs revisiting.
13. **Share one of the repositioning pages** on LinkedIn or WhatsApp and look at the preview card. If S3 is unfixed, expect no image and the generic homepage title.
14. **Clarity, if you keep it.** Confirm recordings are actually arriving after the CSP wildcard, and that "Reject analytics" genuinely stops it. Until then, treat the data as incomplete.
15. **Watch the Vercel image transformation count.** Every cache is cold and 105 renamed guide URLs are being recrawled at once, on top of the four oversized source images in M25. It will not fail, it will just be slow and costly on the first pass.
16. **`GET /api/health`,** once it exists. If you point an uptime monitor anywhere, point it there rather than at a page.