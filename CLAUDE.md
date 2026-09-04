# CLAUDE.md, Orange Jelly website (orangejelly.co.uk)

Workspace standards (stack defaults, TypeScript, Tailwind, Supabase, Git, testing, workflow) live in `/Users/peterpitcher/Cursor/CLAUDE.md`. Read that first; this file holds only what is unique to this repo. `AGENTS.md` symlinks to it, so Codex and Cursor read the same rules.

Reference detail (component props, guide and insight authoring, the full command and environment-variable lists, quality targets, historical notes) is in `docs/agent-reference.md`.

---

## Before writing any customer-facing copy

1. **Numbers.** `/CLAIMS.md` is the single source of truth. Only five claims may be quantified, always as percentages, always attributed to The Anchor, our own venue: +828% Google Search visibility, +403% table bookings, +567% private hire bookings, -89% booking no-shows, +98% food revenue in three months. Retired claims (25 hours a week, £75K value added, 60-70K social views, 58% to 71% food GP, and the rest in `CLAIMS.md`) never come back. Code constant: `SUCCESS_METRICS` in `src/lib/constants.ts`.
2. **Voice.** `docs/TONE_OF_VOICE.md` is the brand voice; `docs/voice/growth-messaging.md` is the conversion-copy standard: plain English, strong verbs, commercial outcomes, and growth framing rather than cost-reduction framing. British English throughout: optimise, analyse, colour. `scripts/check-growth-language.mjs` holds the banned words and their replacements, and blocks the commit if any appear, so read it rather than repeating them here. `CLAIMS.md` suggests "reclaim", "margin growth" and "cut waste" as the approved alternatives.
3. **Positioning (August 2026).** Orange Jelly is a growth partner for ambitious small and mid-sized businesses. Hospitality is one market it works in, not what it is, so "hospitality marketing agency" and "pub marketing" belong only on the sector pages. Sources: the packs in `docs/brand/` (start with `positioning-overview.md`) and `tasks/repositioning/IMPLEMENTATION-SPEC.md`, decisions D3, D14 and D21.
4. **Pricing.** The only price on the site is £62.50 plus VAT an hour (`PRICING` in `src/lib/constants.ts`, published 31 August 2026). Packages are not coming back. Any other £ figure, the old package names (Growth Fix, Momentum Month, Turnaround Intensive), a `priceRange` in schema, or a response-time promise such as "within 24 hours" fails `check:positioning`.
5. **Do not invent facts.** Verified company facts live in `src/app/about/content.ts` and the organisation schema in `src/app/layout.tsx`: Orange Jelly Limited, founded March 2019, based in Stanwell Moor, Staines; The Anchor is our own venue, held as a Greene King tenancy, so Greene King is never a "partner"; member of the British Institute of Innkeeping; first client outside our own business September 2025; two people, Peter Pitcher on the growth work and Billy Summers running The Anchor. Contact peter@orangejelly.co.uk, 07990 587315, WhatsApp preferred (`CONTACT` in constants). If a claim is not in those files or `CLAIMS.md`, stop and ask.

Six scripts enforce this in `npm run lint` and `npm run build`: `check:claims`, `check:positioning`, `check:growth-language`, `check:british-english`, `check:design-tokens` and `check:slugs`. Each script's header states exactly which paths it scans. When one fails, fix the copy or the code, never the check.

## Stop and ask before

- Changing the price, an approved claim, or how the Greene King tenancy or BII membership is described.
- Removing, renaming or moving any guide, insight or case study (see protected posts).
- Publishing a promise Orange Jelly cannot keep.
- Anything on the workspace file's Ethics and Safety list.

## Stack, where this repo differs

- Next.js 14 App Router (`next@^14.2`), React 18, TypeScript strict, **Tailwind CSS v3.4, not v4**. Design tokens are `--oj-*` CSS variables in `src/app/globals.css`, mapped to Tailwind colours in `tailwind.config.js`. shadcn/Radix primitives in `src/components/ui`. `cn()` in `src/lib/utils.ts`.
- Content is Markdown in `content/` (gray-matter, remark, rehype); there is no CMS, Sanity was retired. `scripts/` still holds around 135 one-off migration and fix scripts; do not run them casually. `vercel.json` still carries two `NEXT_PUBLIC_SANITY_*` values that nothing in `src/` reads.
- Supabase covers only the lead database and availability polls (nine tables, listed in `docs/agent-reference.md`), with migrations in `supabase/migrations/` and the service-role client in `src/lib/db/supabase-admin.ts`. No NextAuth, no Prisma: `/admin` is gated by a Supabase Auth email allow-list (`ADMIN_EMAILS`) and every `/api/admin/*` route uses the shared bearer gate in `src/lib/admin-auth.ts`.
- Resend sends lead alerts and poll mail (`src/lib/email.ts`, `src/lib/poll-emails/`). Cloudflare Turnstile guards poll creation. Rate limiting is Supabase Postgres counters with peppered hashes (`src/lib/rate-limit.ts`): no Redis, no Upstash.
- Tests are Vitest 3 with Testing Library (jsdom) in `src/test/` and co-located `*.test.ts(x)`. Playwright is a dependency of the audit scripts only, never a test runner.
- Prettier: semicolons, single quotes, print width 100. Vercel hosting, region lhr1, apex 301s to www, daily cron `/api/cron/polls` at 03:00.

## Commands

`npm run dev` (launch config `orangejelly-dev`), `npm test` (Vitest watch; `test:run` for one pass), `npm run build`. Three departures from the workspace default: the type-check script is `type-check`, hyphenated; `lint` and `build` run all six content checks first, and `build` also rebuilds the gitignored search index; and `monitor:posts`, `check:synthetic` and `check:token-privacy` hit production, not localhost. `npm run check:<name>` runs one check. Full list in `docs/agent-reference.md`.

Pre-commit (Husky and lint-staged): growth-language and British-English checks on js/ts/json/md, Prettier, `eslint --fix`, and the design-token check on `src/`.

## Architecture

```
src/app/         marketing pages, plus guides (content/blog), insights (content/insights),
                 availability (polls), admin, api/, actions/, llms.txt, sitemap.ts, robots.ts
src/components/  legacy Heading/Text/Button/OptimizedImage (still in use); oj/ (the repositioned
                 design system); ui/ (shadcn); seo/, forms/, polls/, sections/, engagement/, admin/
src/lib/         route-manifest.js, blog-md.ts, insights.ts, metadata.ts, constants.ts, db/
content/         blog/ (106 guides), insights/, data/*.json, faqs/, case-studies/
also             supabase/migrations, docs/, scripts/, tasks/repositioning/ (2026 programme)
```

- **`src/lib/route-manifest.js` is the single source of truth for every public URL** (live, redirect, planned, deleted). It generates both the `next.config.js` redirects and the sitemap, so a redirecting URL can never be advertised as indexable. Add, move or retire routes there. CommonJS on purpose: `next.config.js` cannot require TypeScript.
- **Two content collections that must not mix.** `content/blog` renders at `/guides/<slug>` (`src/lib/blog-md.ts`); `content/insights` at `/insights/<slug>` (`src/lib/insights.ts`, zod-validated, front matter must carry `collection: insights`). The blog loader hard-codes `/guides/` for everything it finds, so an insights file in `content/blog` leaks into the hospitality sitemap, feed and search index. A slug in both fails `check:slugs`.
- Eight guide categories: revenue-growth, operations, marketing, events, food-drink, people, property, turnaround (`src/lib/blog.ts`). Legacy slugs 301 in `src/middleware.ts`.
- `status: draft` hides a post; a future `publishedDate` hides it until due. Full front matter, hero images and the insight schema: `docs/agent-reference.md` sections 3 and 4.
- Default to Server Components. `src/components/oj/Button.tsx` must stay `'use client'` (see gotchas).
- New page: build its metadata with `generateMetadata()` from `src/lib/metadata.ts` (it sets the canonical from the path), then add the route to `src/lib/route-manifest.js` with `sitemap: true`. Dates go through `src/lib/dateUtils.ts` (Europe/London).

## Protected posts

Thirty guides carry 95% of the site's search traffic, and the blog is 92.9% of the site's clicks. Their slugs and files are immutable: `src/test/protected-posts.test.ts` fails if one moves or disappears (baseline `tasks/repositioning/data/baselines/protected-posts-2026-08-27.json`, register `tasks/repositioning/data/protected-posts-register.csv`). Titles and headings may change within the per-tier budget in `tasks/repositioning/IMPLEMENTATION-SPEC.md` (WS6). `npm run monitor:posts` is the weekly check.

## SEO and domain

- Canonical host `https://www.orangejelly.co.uk` (`src/lib/site-config.ts`; `NEXT_PUBLIC_BASE_URL` overrides it for previews). `trailingSlash: false`.
- Every canonical must point at a URL that serves a page (`src/test/canonical-urls.test.ts`). Sitemap, robots and `llms.txt` derive from the route manifest.
- Page security headers live in `src/middleware.ts`; API routes get theirs from `headers()` in `next.config.js`, because middleware excludes them.
- Token routes (`/availability/p/<token>`, `/o/<token>`, `/verify/<token>`) carry a bearer capability in the URL. `src/lib/token-routes.ts` is the single source of truth for the middleware Referrer-Policy and for the script gate that keeps GTM and all third-party JavaScript off those pages. `npm run check:token-privacy` proves it against production.
- Analytics: GTM, consent-gated through `src/lib/tracking.ts` (`hasAnalyticsConsent`, `trackClientEvent`), plus Vercel Analytics and Speed Insights.

## Environment variables

`.env.example` documents every variable and why it exists; the grouped list is in `docs/agent-reference.md`. Three are read in code but absent from it: `NEXT_PUBLIC_GOOGLE_VERIFICATION`, `PREVIEW_SECRET` (draft mode via `/api/preview`) and `ANALYZE` (bundle analyser). Four behave in non-obvious ways:

`CONTACT_FROM_EMAIL` must sit on the Resend-verified sending subdomain (production `noreply@auth.orangejelly.co.uk`); an apex `@orangejelly.co.uk` sender is rejected, and lead alerts are best-effort so a failure never blocks lead capture. Without `CRON_SECRET` the poll cron rejects every request, Vercel's own included, so the 60-day deletion promise silently stops being kept. Without the Turnstile keys, poll creation fails closed, deliberately. Rotating `RATE_LIMIT_KEY_PEPPER` resets every live counter, which is acceptable and needs no migration.

## Gotchas and past bugs

- **Tailwind emits nothing for an unknown colour.** `bg-orange-100 text-orange-800` shipped as unstyled search results, and `text-oj-cream/80` once worked while `text-oj-cream` silently did not. Use the named `oj-*` tokens, never numeric scales, never raw hex outside the files allow-listed in `scripts/check-design-tokens.mjs`.
- **`oj/Button` reads its ground from context, so it must be a client component.** As a server component every page fails at prerender with "u is not a function" from React's serialiser, and the jsdom tests do not catch it.
- **Never `git add -A`, not even `git add -A src`.** It once swept five of Peter's in-flight blog files into an unrelated commit, shipping the code half of a three-part image migration without its markdown or images and blocking the deploy. Stage the exact files you changed.
- `/why-revenue-is-falling` shipped with its canonical pointing at a name that never went live, so the canonical was a 404. On a rename, update the manifest and the canonical together.
- Stacking order for the header, drawer, sticky CTA, cookie notice and modals is fixed in `src/components/oj/layers.ts`; a cookie banner was once impossible to dismiss because the CTA bar sat on top of it.
- The growth-language regex once missed the gerund form of a banned verb and seven instances reached published guides. When adding a banned phrase, test every inflection of it.
- `check:positioning` allows only `£62.50`; an earlier, looser price regex matched the "£2" quiz example in constants.
- The admin bearer gate was copy-pasted into three routes before `src/lib/admin-auth.ts` existed. Never inline an auth check.
- A plausible statistic with no source is worse than no number.
- The route manifest exists because redirects, sitemap and the spec disagreed, and hand-counting redirects was wrong twice. Never add a second list.
- `.claude/session-context.md` and `docs/architecture/*.md` were generated in April 2026 and still say "no database" and "pub marketing consultancy". Trust the code and this file over them.
