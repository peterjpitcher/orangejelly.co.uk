---
generated: true
last_updated: 2026-04-26T00:00:00Z
source: session-setup
project: orangejelly-website
---

# Project Overview — orangejelly-website

## Summary

Marketing website for **Orange Jelly Limited**, a pub marketing consultancy founded by Peter Pitcher. Targets struggling UK pub licensees with proven marketing strategies.

- **Domain**: www.orangejelly.co.uk
- **Framework**: Next.js 15 (App Router), React 19, TypeScript (strict)
- **Styling**: Tailwind CSS v4 + custom design tokens
- **Deployment**: Vercel
- **Database**: None — fully static/SSG site
- **Auth**: No user authentication (public marketing site with one server action for contact form)
- **Content**: Markdown files in `/content/blog/` for the Licensees' Guide blog

## Architecture Type

Static-first Next.js site. All pages are Server Components by default. Content is sourced from local markdown files (no CMS, no database). The only server-side mutation is the contact form submission (`submitContactForm`).

## Key Sections

| Section | Purpose |
|---------|---------|
| Homepage (`/`) | Primary landing + ROI calculator |
| `/about` | Founder story + credentials |
| `/capabilities` | What Orange Jelly does |
| `/ways-to-work` | Service packages (dynamic slugs) |
| `/results` | Proof/case study metrics |
| `/contact` | Contact form (only interactive page) |
| `/licensees-guide` | SEO blog — Licensees' Guide |
| `/pub-marketing-*` | Location-specific SEO landing pages (8 counties) |
| `/pub-marketing-agency` etc. | Intent-specific SEO landing pages |
| `/fix-my-pub`, `/pub-rescue` etc. | Problem-specific SEO landing pages |

## Middleware

`src/middleware.ts` handles:
1. Legacy category slug redirects (308) for `/licensees-guide/category/*`
2. Canonical hostname redirect to `www.orangejelly.co.uk` (301)
3. Security headers on all non-API responses (CSP, HSTS, X-Frame-Options, etc.)

## Analytics

- Google Tag Manager (`NEXT_PUBLIC_GTM_ID`) with Google Consent Mode v2
- Vercel Analytics + Speed Insights
- Microsoft Clarity (via CSP allowlist)
