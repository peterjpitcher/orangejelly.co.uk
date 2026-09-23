# Agent reference, Orange Jelly website

Reference material for AI agents and developers, moved out of `CLAUDE.md` on 4 September 2026 so the instruction file stays short. `CLAUDE.md` holds the rules; this file holds the detail. If the two disagree, `CLAUDE.md` wins, and the code wins over both.

Everything here was checked against the repository on 4 September 2026. Anything marked "not read by the code" is carried for completeness only.

---

## 1. Components

### Legacy components (`src/components/`)

Still used across the older pages. Props as declared in the source:

| Component | Props |
|---|---|
| `Heading` | `level` 1 to 6 (required); `align` inherit, left, center, right; `color` inherit, brand-base, orange, orange-on-dark, blue-support, white, base, support, accent, highlight, grounded; `className`; `itemProp`. There are no `size` or `weight` props. The old `charcoal` and `teal` colour names are gone. |
| `Text` | `size` xs, sm, base, lg, xl, 2xl (2xl is the maximum); `color` inherit, brand-base, muted, white, base, support, accent, highlight, grounded; `weight` normal, medium, semibold, bold; `align`; `as` p, span, div; `id`; `className`; `itemProp`. |
| `OptimizedImage` | `src` and `alt` required; `width`, `height`, `priority` (above the fold only), `sizes`, `fill`, `quality`, `placeholder`, `blurDataURL`, `loading`, `style`, `onLoad`, `className`. The same file exports `ResponsiveImage` and `OptimizedBackground`. |
| `Button` | `variant` primary, secondary, outline, ghost, custom, outline-white, base, support, accent; `size` small, medium, large; `href` renders a link; `external`; `whatsapp`; `loading`; `disabled`; `fullWidth`; `type`; `onClick`; `aria-label` (required when icon-only). |

### The repositioned design system (`src/components/oj/`)

Built for the 2026 repositioning. Exported from `@/components/oj`: `Button`, `GroundProvider` and `useGround`, `Stat`, `Tag`, `Mark`, `Header`, `Footer`, `OjHeader`, `OjFooter`, `Breadcrumb`, `Field` and `useFieldControl`, `GuideSearch`, `SiteSearch`, `EnquiryForm`, `NewsletterBand`, `SeasonalBand`, `Anchor`, `KeepCase`, plus the barrels re-exported from `inputs`, `content`, `feedback`, `editorial`, `marketing`, `diagnostic` and `conversion`.

- `oj/Button` takes the `cva` variants plus `ground` (normally inherited from the nearest `GroundProvider`, which is set by whatever painted the background), `arrow` (a decorative arrow hidden from assistive technology) and `href` (renders an anchor). It must stay a client component; see the gotchas in `CLAUDE.md`.
- `src/components/oj/layers.ts` fixes the z-index order of everything pinned to the viewport: sticky CTA 50, mobile drawer 59, header 60, then the cookie notice and modals above. Use those constants, never a bare z-index.

### shadcn primitives (`src/components/ui/`)

Configured in `components.json` (style new-york, RSC, CSS variables): accordion, alert, avatar, badge, button, card, checkbox, dialog, faq-accordion, form, image, input, label, navigation-menu, progress, select, separator, sheet, skeleton, table, tabs, textarea, typography.

### Design tokens

Colours are `--oj-*` CSS variables in `src/app/globals.css`, exposed to Tailwind through `tailwind.config.js`: `--oj-orange`, `--oj-orange-deep`, `--oj-orange-soft`, `--oj-ember`, `--oj-peach`, `--oj-ink`, `--oj-ink-2`, `--oj-ink-3`, `--oj-paper`, `--oj-cream`, `--oj-cream-2`, `--oj-link`, `--oj-link-hover`, `--oj-ok`, `--oj-danger`, `--oj-ring`, `--oj-ring-inverse`, `--oj-border-default`, `--oj-border-soft`, the `--oj-surface-*` set (page, card, band, action, inverse, sunken), the `--oj-text-*` set (body, secondary, muted, accent, inverse, on-action, on-band) and `--oj-sticky-offset`. The brand orange is `#F16F23` (hsl 22 88% 54%), defined once in `tailwind.config.js`.

The pre-2026 palette (orange `#EA580C`, teal `#006064`, red-orange `#FF6B35`) is retired. Do not reintroduce it, including in generated blog images. `scripts/check-design-tokens.mjs` lists the only files allowed to contain raw hex, each with a stated reason, and `src/test/design-tokens.contrast.test.ts` asserts contrast.

## 2. Key utilities (`src/lib/`)

| Utility | File | Purpose |
|---|---|---|
| `cn()` | `utils.ts` | clsx plus tailwind-merge |
| `generateMetadata()` | `metadata.ts` | Per-page metadata with canonical, en-GB and x-default alternates, Open Graph |
| `readMarkdownFile()` | `markdown.ts` | Reads a Markdown file from disk |
| `getBlogImageSrc()`, `getDefaultBlogImage()` | `blog-images.ts` | Resolves a guide's image, falling back to the slug map, then `/images/blog/default.svg` |
| `getSitemapRoutes()`, `getRedirects()`, `getRedirectedGuideSlugs()` | `route-manifest.js` | The route manifest API used by `next.config.js` and `sitemap.ts` |
| `formatDateInLondon()`, `getTodayIsoDate()`, `toLocalIsoDate()` | `dateUtils.ts` | Europe/London date handling |
| `hasAnalyticsConsent()`, `trackClientEvent()` | `tracking.ts` | Consent-gated GTM events |
| `isTokenRoute()` | `token-routes.ts` | Whether a path carries a bearer token in the URL |

## 3. Writing a guide (`content/blog/`)

Guides render at `/guides/<slug>`. They are the 106 hospitality articles and carry almost all of the site's search traffic, so check the protected-posts rule in `CLAUDE.md` before touching an existing one.

### File and front matter

Create `content/blog/<slug>.md` with a kebab-case slug that matches the `slug` field. The fields below are what the existing posts use. `src/lib/blog-md.ts` reads `title`, `excerpt`, `publishedDate`, `updatedDate`, `category`, `tags`, `featuredImage`, `publishedAt`, `draft`, `status` and `seo`; the guide page and its helpers read `faqs`, `quickAnswer`, `keywords`, `metaDescription`, `voiceSearchQueries`, `localSEO`, `quickStats`, `seasons`, `occasions`, `ctaSettings` and `featured`.

```yaml
---
title: "Question-based title that names the pain point"
slug: your-article-slug
excerpt: "150 to 160 character summary for search results and social shares"
publishedDate: 2026-09-07
updatedDate: 2026-09-07            # optional
status: published                  # draft hides the post; a future publishedDate schedules it
category: marketing                # one of: revenue-growth, operations, marketing, events, food-drink, people, property, turnaround
tags:
  - tag one
  - tag two
author:
  name: Peter Pitcher
  bio: Founder of Orange Jelly
featuredImage: "/images/blog/heroes/your-article-slug.webp"
metaDescription: "150 to 160 characters"
keywords:
  - primary keyword
quickAnswer: "40 to 60 word direct answer to the title question."
voiceSearchQueries:
  - "natural question people would ask"
localSEO:
  - UK-specific term
faqs:
  - question: "Specific question with good keywords?"
    answer: "Answer that stands alone, two or three sentences."
seasons: []                        # optional, seasonal hubs
occasions: []                      # optional, seasonal hubs
ctaSettings:                       # optional
  ctaType: contact
---
```

`hasQuickAnswer`, `hasFAQs`, `hasQuickStats` and a `schema` block appear in older posts but are not read by the code; leave them out of new posts.

### Structure that has worked

Opening hook (two or three paragraphs: empathy for the problem, a relatable example, the promise), then "The real problem", then two or three solution sections, each with a concrete tactic, real numbers only where `CLAIMS.md` allows them, and objections handled immediately. Close with an action plan (week one, week two), the results to expect (immediate, month one, months three to six), common objections answered, and a bottom line with one clear first step.

### Featured image

Add a 1200 by 630 hero at `public/images/blog/heroes/<slug>.webp` and reference it in `featuredImage`. The slug map in `src/lib/blog-images.ts` is only a fallback for posts without one, and the old process of drawing a branded SVG per post is retired.

### Checklist before publishing

- Title is question-based and names a specific pain point; 50 to 60 characters
- 1,500 to 3,000 words, scannable, H2 for sections and H3 for subsections
- Quick answer 40 to 60 words; at least three FAQs
- Only the five approved claims are quantified, with The Anchor as provenance; no invented statistics
- British English, and growth framing rather than cost-reduction framing (`npm run check:british-english`, `npm run check:growth-language`)
- Examples come from The Anchor, in the company voice from `docs/TONE_OF_VOICE.md`
- Internal links to related guides, solutions or growth problems
- Slug does not collide with an insight (`npm run check:slugs`)
- `npm run build` passes (it rebuilds the search index and runs every check)

### Publishing

Set `status: published` and a `publishedDate`; a future date holds the post until then. Commit as `feat(blog): add guide, <title>`, push, and verify the live URL. The search index (`public/search-index.json`) is regenerated at build time and is not committed. The RSS and JSON feeds are routes (`src/app/rss.xml`, `src/app/feed.json`) and need no build step.

## 4. Writing an insight (`content/insights/`)

Insights render at `/insights/<slug>` and are validated by the zod schema in `src/lib/insights.ts`. The build fails on a bad file.

| Field | Rule |
|---|---|
| `collection` | Must be the literal `insights`. This is the discriminant; the directory is not trusted. |
| `title`, `slug`, `excerpt` | Required, non-empty |
| `publishedDate` | Required; a future date schedules the post |
| `status` | `draft` or `published` (default `published`) |
| `author` | `{ name, bio? }` |
| `problemPage` | Required; must match a live growth-problem slug (checked against `GROWTH_PROBLEMS`), because the article hands over to that page |
| `targetTerm` | Required; the keyword the article exists for |
| `sector` | Optional: professional-services, trades, hospitality |
| `researchLed` | `true` when written from research rather than Orange Jelly's own work; it is shown on the page |
| `category`, `tags`, `quickAnswer`, `faqs` | Optional |

`npm run check:claims` runs on `content/insights`, so only the five approved claims may appear as numbers.

## 5. Full command list

| Script | What it does |
|---|---|
| `dev`, `start` | Next.js dev server, production server |
| `build` | growth-language, british-english, design-tokens, positioning, slugs and claims checks, then `build:search`, then `next build` |
| `lint` | `next lint` plus the same six checks |
| `type-check` | `tsc --noEmit` |
| `test`, `test:run`, `test:ui`, `test:coverage` | Vitest watch, single run, UI, coverage |
| `format`, `format:check` | Prettier on `src/` |
| `build:search`, `build:all` | Search index to `public/search-index.json`; `build:all` runs the same step. The feeds are routes, so there is no feed build |
| `check:growth-language`, `check:british-english`, `check:design-tokens`, `check:positioning`, `check:slugs`, `check:claims` | The six gates, individually |
| `check:token-privacy` | Playwright proof that poll token routes load no third-party scripts, run against `https://www.orangejelly.co.uk` |
| `check:synthetic` | External smoke check that the deployed site responds |
| `monitor:posts` | Weekly check on the thirty protected posts |
| `launch:checklist` | Regenerates `tasks/repositioning/LAUNCH-CHECKLIST.md` from the route manifest |
| `audit:contrast`, `audit:images`, `audit:typography`, `audit:widths`, `audit:redirects` | Playwright and static audits; some default to `localhost:3000`, so read the script header before running |
| `prepare` | Installs Husky hooks |

## 6. Environment variables

Every variable is documented with its reasoning in `.env.example`. The grouped list:

| Group | Variables |
|---|---|
| Site | `NEXT_PUBLIC_BASE_URL` (overrides the canonical host for previews), `NEXT_PUBLIC_GTM_ID` |
| Supabase | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAILS` (comma-separated allow-list for `/admin`) |
| Resend | `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_NOTIFICATION_EMAIL`, `POLL_FROM_EMAIL` (normally unset; poll mail reuses `CONTACT_FROM_EMAIL`) |
| Polls | `CRON_SECRET`, `RATE_LIMIT_KEY_PEPPER`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` |
| Optional | `DATABASE_URL`, `DATABASE_SSL` (direct Postgres fallback for local or non-Supabase environments) |
| Read in code, absent from `.env.example` | `NEXT_PUBLIC_GOOGLE_VERIFICATION`, `PREVIEW_SECRET` (draft mode via `/api/preview`), `ANALYZE` (bundle analyser) |

The four that behave in non-obvious ways are in `CLAUDE.md`; read those before changing any of them.

### Supabase tables

Nine, created by the migrations in `supabase/migrations/`: `contacts`, `newsletter_subscribers`, `conversion_events` and `lead_sources` (the lead data layer, June 2026, RLS enabled in a follow-up migration), then `polls`, `poll_options`, `poll_participants`, `poll_responses` and `poll_rate_limits` (availability polls, July 2026). Nothing else in the site touches a database.

## 7. Quality targets

Targets, not tooling-enforced unless stated:

- Core Web Vitals: LCP under 2.5 s, INP under 200 ms, CLS under 0.1, TTFB under 600 ms
- Budgets: JavaScript under 200 KB compressed, CSS under 50 KB, images under 100 KB each, page under 1 MB (`ANALYZE=true npm run build` opens the bundle analyser)
- Coverage: 80% line coverage on new modules unless justified in the PR (no threshold is configured in `vitest.config.ts`)
- Accessibility: WCAG 2.1 AA, keyboard operability, visible focus, alt text on every image, touch targets of at least 44 px. Contrast is asserted by `src/test/design-tokens.contrast.test.ts` and keyboard behaviour by `src/test/keyboard-operability.test.tsx`
- Mobile-first: check every change at a phone width

## 8. Release, rollback and post-deploy checks

Vercel builds every branch as a preview and `main` as production (region lhr1). Roll back from the Vercel dashboard or with a git revert; never force-push `main`. After a production deploy run `npm run check:synthetic` and `npm run check:token-privacy`, and in the weeks after a content change `npm run monitor:posts`.

## 9. Test placeholders

Use invented venues in tests and fixtures: "The Test Arms", owner "Test Landlord", `test@pub.example`. Never use a retired claim as a sample number, even in a test; `check:claims` and the retired-claims table in `CLAIMS.md` exist to keep those figures out of the repository.

## 10. Decision filter

Before shipping, ask: can Peter stand behind every claim (`CLAIMS.md`)? Does it fit the positioning (`docs/brand/positioning-overview.md`)? Is the code maintainable? Does it keep the performance targets? If any answer is no, reconsider.

## 11. Historical material

- The site ran on Sanity until the Markdown migration. `scripts/` keeps around 130 one-off migration and fix scripts, `docs/migration/` and `docs/reports/` keep the reports, and `docs/plans/SCHEDULED_PUBLISHING_IMPLEMENTATION.md` describes Sanity scheduling that no longer applies (scheduling is now a future `publishedDate`).
- `docs/CLAIMS_MASTER.md` and `docs/plans/APPROVED_CLAIMS.md` are deprecated stubs; `/CLAIMS.md` replaced them on 1 June 2026.
- `docs/architecture/*.md` and `.claude/session-context.md` were generated in April 2026, before the Supabase lead database and the repositioning, and describe a static site with no database. Treat them as history.
- `CLAUDE_OLD.md` in the repository root is an earlier (2025) version of the development guide.
