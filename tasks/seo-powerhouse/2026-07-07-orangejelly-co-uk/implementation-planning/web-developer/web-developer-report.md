# Web Developer Feasibility Notes — Orange Jelly (2026-07-07)

Consolidated from the Technical SEO Specialist's codebase-level findings (which located exact files/lines) plus the orchestrator's git/live verification. This run is review-only; these are implementation-ready notes, nothing applied.

## Exact fix locations (verified)

| Ticket | File(s) / location | Change | Effort |
|---|---|---|---|
| SEO-106 | `src/app/services/instagram-services-for-pubs/page.tsx` + `.../facebook-services-for-pubs/page.tsx` (each calls `permanentRedirect('/services/social-media-marketing-for-pubs')` which **no-ops on the static Vercel route** — verified live: both serve 200 canonical→homepage). Move the redirect into `next.config.js` `redirects()` (same mechanism as the working `/services`→`/ways-to-work` at `next.config.js:19-21`) | S | 
| SEO-107 | `src/app/sitemap.ts` — add `/services/social-media-marketing-for-pubs`, `/services/paid-social-for-pubs`, `/services/content-creation-for-pubs` | XS |
| SEO-112 | `/capabilities` inbound = `content/data/footer.json` (lines ~23/24/28) + `src/components/blog/BlogPost.tsx` (4 CTAs at ~276/289/302/315, ×106 guides = 424 links) mis-anchored to `/capabilities`. Repoint BlogPost CTAs to named service/money pages; repoint 2 footer links | S–M |
| SEO-115 | `next.config.js` redirects() — add `/licensees-guide/pub-wages-labour-costs-uk` → `/licensees-guide/pub-wages-labour-costs-guide`; fix inbound link in `content/blog/how-much-profit-does-a-pub-make.md` | XS |
| SEO-118 | `src/components/PubServiceLandingPage.tsx` — add Hero `secondaryAction` + bottom CTA reusing `PackageCTA` (dual WhatsApp + enquiry). Confirmed dual-CTA shipped on `PackageCTA` but NOT on this template | S |
| SEO-119 | `src/components/blog/BlogPost.tsx` — render the FAQ block that today exists only as JSON-LD in `EnhancedBlogSchema.tsx:90-100`. One template render addition | S |
| SEO-120 | `src/components/blog/BlogPost.tsx` — mount `NewsletterForm` (component + Supabase `newsletter_signup` path already built; currently mounted nowhere) | XS |
| SEO-124 | `src/components/StructuredData.tsx:58-109` — 3× LocalBusiness missing `address`; 9× WebSite missing `name`/`url` in the guide/category schema emitter | XS–S |
| SEO-101 | `src/components/forms/contact-form.tsx` submit success → push `generate_lead` to dataLayer (via `src/lib/tracking.ts` helper); mirror for CTA clicks | S |
| SEO-102 | `src/lib/db/leads.ts` `storeContactLead()` — add email/webhook notification on successful insert (Resend or Supabase edge function) | S |

## Already resolved (do not action)

- `contact?package=*` already canonicalises to `/contact` via `src/app/contact/layout.tsx` (technical finding 22).
- Sitemap already excludes non-200 URLs (technical).
- June dual-H1, guide→service bridge, `/services`→`/ways-to-work`, cash-flow 410→301 all verified live.

## Sequencing / dependencies

1. Measurement first (SEO-101/102/103) — so every later change is measurable.
2. SEO-106 + SEO-107 together (routing + sitemap) — the channel reclaim.
3. SEO-112 (link rebalance) before SEO-114 (URL-inspect + re-index request).
4. SEO-113 (hub consolidation) gated on the mid-August GSC refresh.
5. Content/editorial (SEO-108/109/110/119/121) can proceed in parallel once routing is set.

## Build health

Prior June branches built green (per REVIEW-HANDOFF.md). All listed changes are additive or single-file; each should pass `npm run type-check && npm run lint && npm test && npm run build` independently. Pre-commit hooks enforce British English + no "save/savings".
