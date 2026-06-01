---
generated: true
last_updated: 2026-04-26T00:00:00Z
source: session-setup
project: orangejelly-website
---

# Routes

## Page Routes (App Router)

| URL | File | Type | Auth |
|-----|------|------|------|
| `/` | `src/app/page.tsx` | Static | None |
| `/about` | `src/app/about/page.tsx` | Static | None |
| `/capabilities` | `src/app/capabilities/page.tsx` | Static | None |
| `/contact` | `src/app/contact/page.tsx` | Static + Action | None |
| `/results` | `src/app/results/page.tsx` | Static | None |
| `/ways-to-work` | `src/app/ways-to-work/page.tsx` | Static | None |
| `/ways-to-work/[slug]` | `src/app/ways-to-work/[slug]/page.tsx` | Dynamic SSG | None |
| `/pub-marketing` | `src/app/pub-marketing/page.tsx` | Static | None |
| `/pub-marketing-agency` | `src/app/pub-marketing-agency/page.tsx` | Static | None |
| `/pub-marketing-no-budget` | `src/app/pub-marketing-no-budget/page.tsx` | Static | None |
| `/pub-marketing-berkshire` | `src/app/pub-marketing-berkshire/page.tsx` | Static | None |
| `/pub-marketing-buckinghamshire` | `src/app/pub-marketing-buckinghamshire/page.tsx` | Static | None |
| `/pub-marketing-hampshire` | `src/app/pub-marketing-hampshire/page.tsx` | Static | None |
| `/pub-marketing-hertfordshire` | `src/app/pub-marketing-hertfordshire/page.tsx` | Static | None |
| `/pub-marketing-kent` | `src/app/pub-marketing-kent/page.tsx` | Static | None |
| `/pub-marketing-london` | `src/app/pub-marketing-london/page.tsx` | Static | None |
| `/pub-marketing-oxfordshire` | `src/app/pub-marketing-oxfordshire/page.tsx` | Static | None |
| `/pub-marketing-surrey` | `src/app/pub-marketing-surrey/page.tsx` | Static | None |
| `/fix-my-pub` | `src/app/fix-my-pub/page.tsx` | Static | None |
| `/pub-rescue` | `src/app/pub-rescue/page.tsx` | Static | None |
| `/empty-pub-solutions` | `src/app/empty-pub-solutions/page.tsx` | Static | None |
| `/quiet-midweek-solutions` | `src/app/quiet-midweek-solutions/page.tsx` | Static | None |
| `/compete-with-pub-chains` | `src/app/compete-with-pub-chains/page.tsx` | Static | None |
| `/licensees-guide` | `src/app/licensees-guide/page.tsx` | Static | None |
| `/licensees-guide/[slug]` | `src/app/licensees-guide/[slug]/page.tsx` | Dynamic SSG | None |
| `/licensees-guide/category/[category]` | `src/app/licensees-guide/category/[category]/page.tsx` | Dynamic SSG | None |
| `/test-shadcn` | `src/app/test-shadcn/page.tsx` | Static | None (dev only) |

## Layouts

| File | Scope |
|------|-------|
| `src/app/layout.tsx` | Root layout — applies to all pages |
| `src/app/contact/layout.tsx` | Contact section layout override |
| `src/app/results/layout.tsx` | Results section layout override |

## API Route Handlers

| URL | Method | File | Auth | Purpose |
|-----|--------|------|------|---------|
| `/about-demo` | GET | `src/app/about-demo/route.ts` | None | Demo redirect/response |
| `/api/preview` | GET | `src/app/api/preview/route.ts` | `PREVIEW_SECRET` env var | Enable Next.js draft/preview mode |
| `/api/preview/exit` | GET | `src/app/api/preview/exit/route.ts` | None | Exit preview mode |

## Redirects (next.config.js — permanent 301)

| From | To |
|------|----|
| `/services` | `/ways-to-work` |
| `/services/instagram-services-for-pubs` | `/capabilities` |
| `/services/facebook-services-for-pubs` | `/capabilities` |
| `/services/paid-social-for-pubs` | `/capabilities` |
| `/services/content-creation-for-pubs` | `/capabilities` |
| `/services/social-media-marketing-for-pubs` | `/capabilities` |

## Middleware Redirects (runtime)

| Trigger | Action | Code |
|---------|--------|------|
| Legacy category slugs in `/licensees-guide/category/*` | Redirect to new 8-category taxonomy slug | 308 |
| Non-canonical hostname (not `www.orangejelly.co.uk`) | Redirect to canonical + HTTPS | 301 |
