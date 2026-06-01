---
generated: true
last_updated: 2026-04-26T00:00:00Z
source: session-setup
project: orangejelly-website
---

# Relationships — Cross-Reference Map

## Content Flow

```
/content/blog/*.md
    └── src/lib/markdown/markdown.ts  (reads + parses markdown)
        ├── /licensees-guide/[slug]    (individual post)
        ├── /licensees-guide           (index listing)
        └── /licensees-guide/category/[category]  (category listing)

/content/ways-to-work/*.md  (assumed)
    └── /ways-to-work/[slug]           (individual package page)
```

## Component → Page Relationships

| Component | Used By |
|-----------|---------|
| `PubMarketingLocationLandingPage` | All 8 county pages (`/pub-marketing-berkshire` etc.) |
| `src/app/contact/ContactPage.tsx` | `/contact/page.tsx` |
| `src/app/results/ResultsPage.tsx` | `/results/page.tsx` |
| `src/app/HomePage.tsx` | `/page.tsx` |
| `src/app/licensees-guide/[slug]/BlogPostClient.tsx` | `/licensees-guide/[slug]/page.tsx` |

## Server Action → UI

| Action | Consumed By |
|--------|-------------|
| `submitContactForm` | `src/app/contact/ContactPage.tsx` (contact form) |

## Environment Variables → Components

| Var | Used In |
|-----|---------|
| `NEXT_PUBLIC_GTM_ID` | `src/components/GoogleTagManager.tsx` |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | `src/components/Meta.tsx` |
| `NEXT_PUBLIC_BASE_URL` | Sitemap, robots.txt generation |
| `PREVIEW_SECRET` | `src/app/api/preview/route.ts` |
| `NODE_ENV` | Middleware (HSTS), schema debug components, ErrorBoundary |

## Middleware → Routes

```
src/middleware.ts
    ├── Matches: all paths except /api/*, /_next/*, /favicon.ico
    ├── Applies: security headers to every response
    ├── Redirects: legacy /licensees-guide/category/* slugs → new taxonomy (308)
    └── Redirects: non-www / HTTP → www.orangejelly.co.uk HTTPS (301)
```

## Analytics Chain

```
GoogleTagManager (NEXT_PUBLIC_GTM_ID)
    └── fires on all pages via root layout
        ├── Google Analytics 4 (via GTM)
        ├── Google Consent Mode v2
        └── Microsoft Clarity (CSP-allowed)

@vercel/analytics → Vercel Analytics dashboard
@vercel/speed-insights → Vercel Speed Insights dashboard
```
