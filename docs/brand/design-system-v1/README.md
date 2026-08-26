# Handoff: Orange Jelly Website Redesign

## Overview
Full redesign of orangejelly.co.uk, repositioning Orange Jelly from pub-marketing consultancy to **growth partner for ambitious SMEs**. The bundle contains a complete design system (tokens, 29 React reference components, brand guidelines) and 6 page templates covering the whole site: homepage, start-here/contact, about, case study, blog listing, blog article.

## About the Design Files
Everything here is a **design reference created in HTML** — prototypes showing intended look and behaviour, **not production code to ship**. Your task is to **recreate these designs in the existing `OJ-OrangeJelly.co.uk` codebase**: Next.js 14 (App Router) + TypeScript + Tailwind, with CVA, Radix primitives, lucide-react and framer-motion already available. Follow the repo's own conventions (`CLAUDE.md`, `AGENTS.md`) and note its build gates: `check:design-tokens`, `check:british-english`, `check:growth-language` — map the tokens below into `tailwind.config.js` rather than hard-coding values, and keep all copy British English.

The component source files carry a `.txt` suffix (`Button.jsx.txt`, `Button.d.ts.txt`) so this bundle stays inert inside the design tool — treat them as normal `.jsx`/`.d.ts` content. They are plain-React reference implementations — port them to typed Tailwind/CVA components rather than pasting. Each component has a `.d.ts` (exact prop contract) and a `.prompt.md` (usage rules). Templates are `.dc.html` files; read the markup between `<x-dc>` tags — all styles are inline, so every value is visible at the point of use. Opened inside this design project they render live.

## Fidelity
**High-fidelity.** Colors, type scale, spacing, borders, shadows, copy and states are final design intent. Recreate pixel-perfectly. Two placeholders: founder photo (About) and case-study client imagery.

## Design DNA (applies everywhere)
- Surfaces: cream page `#F7F5F1`, paper cards `#FCFBF9`, ink inverse sections `#23252E`.
- **Orange `#F76B0C` is an action signal**, not decoration: CTAs, highlights, live markers. Body-size orange text uses `--oj-orange-deep #C05408` (contrast).
- Borders: `1.5px solid #23252E` on cards/inputs; radius `3px` (pills `999px`). No soft grey borders.
- **Pressure shadow**: hard offset, never blur — `5px 5px 0 #23252E` (sm `3px 3px 0`). Hover: element translates `-2px,-2px` and shadow grows; active: translates into the shadow. Timing `120ms/200ms cubic-bezier(.2,.9,.25,1)`.
- Highlights on display type: peach `#FFD3AD` or orange as a **lower-half gradient band** (`linear-gradient(transparent 52%, <color> 52%, <color> 98%, transparent 98%)`) so ascenders/tight line-height are never covered. Never full-height solid behind multi-line text.
- Eyebrow labels: 12.5px, 700, `letter-spacing .14em`, uppercase, color `#C05408` (peach `#FFD3AD` on ink).
- **Voice: display headings render lowercase** (`text-transform: lowercase` on h1/h2) — currently shipped on the About template (`textCase="headings"` default) and under consideration site-wide. Body text stays sentence case; never lowercase proper nouns in body copy.
- Header comes in two tones: cream (default) and **orange campaign header** (white wordmark/nav, ink CTA button). About currently defaults to orange.
- Footer: ink, orange jelly logo mark + `© 2026 Orange Jelly Limited` (never "Ltd") + tagline "AI is part of the toolkit, not the product."

## Design Tokens (`tokens/*.css` — mirror into Tailwind theme)
Colors: orange `#F76B0C`, orange-deep `#C05408`, ember `#7A3708`, orange-soft `#FDE3CC`, peach `#FFD3AD`, ink `#23252E`, ink-2 `#4A4C58`, ink-3 `#757784`, cream `#F7F5F1`, cream-2 `#ECE9E2`, paper `#FCFBF9`, ok `#1E7A3C`, danger `#C42B09`. Semantic aliases in `tokens/colors.css` (surface-*, text-*, border-*, link `#C05408` / hover ink).
Type: **Schibsted Grotesk** for everything (⚠ substitute — swap in licensed brand fonts when supplied; loaded via Google Fonts in `tokens/fonts.css`). Sizes: hero 72 / display 56 / h1 44 / h2 32 / h3 23 / lg 19 / body 17 / sm 14.5 / xs 12.5 px. Weights 900/700/600/500/400. Line-heights: display .98, tight 1.12, body 1.55. Tracking: display −.025em, eyebrow .14em.
Spacing: 4, 8, 12, 16, 24, 32, 48, 64, 96 px. Container **1160px** (32px side padding). Border widths 1.5 / 3 px.
Long-form: `.oj-prose` styles in `tokens/prose.css` (lead paragraph, links, blockquote, etc.) — port to a Tailwind Typography config.

## Screens (templates/)
Each maps to a route in `src/app/`. Exact values are inline in the `.dc.html`.
1. **Landing page** (`landing-page/LandingPage.dc.html` → `/`): hero with highlighted display headline + primary CTA, growth-pressures grid (PressureCard), method steps (MethodStep), proof band on ink (Stat row), case-study teaser (ProofCard), CTA band, footer.
2. **Start here / contact** (`start-here/StartHere.dc.html` → `/start-here`): qualifying intro, contact form (Field/Input/Select/Textarea/Checkbox + validation states), what-happens-next steps, FAQ accordion.
3. **About** (`about/About.dc.html` → `/about`): manifesto hero, 2×2 beliefs grid, founder story (photo placeholder + `.oj-prose`), "live lab" ink section with 4 Stats (The Anchor: 403% table bookings, 89% fewer no-shows, 828% search visibility, 98% food revenue), CTA. Has orange-header and lowercase-headings toggles.
4. **Case study** (`case-study/CaseStudy.dc.html` → `/results/[slug]`): breadcrumb, outcome-first hero, baseline→result stat comparison, narrative sections, quote, next-case CTA. ⚠ Figures are placeholder — verify with real client data before publish.
5. **Blog listing** (`blog-listing/BlogListing.dc.html` → `/insights`): featured article, ArticleCard grid, Tag filters, NewsletterBand.
6. **Blog article** (`blog-article/BlogArticle.dc.html` → `/insights/[slug]`): article header with meta, Toc sidebar (sticky), `.oj-prose` body, inline Quote/Alert, author block, related articles, NewsletterBand.

## Components (components/, 29 total)
- **core/**: Button (primary orange / ink / ghost; sm-md-lg; optional arrow; press-shadow interaction), Stat (light/dark tones), Tag (incl. availability badge variant), Mark (highlight span).
- **chrome/**: Header (cream + orange tones, sticky), Footer (columns + legal bar), Breadcrumb, StickyCTA.
- **content/**: Card, PressureCard, ProofCard, MethodStep, Quote.
- **forms/**: Field, Input, Select, Textarea, Checkbox, Radio, Slider — 1.5px ink borders, orange focus ring (`0 0 0 2px page, 0 0 0 4.5px orange`), danger `#C42B09` error states.
- **feedback/**: Alert (info/ok/danger), Modal (ink overlay, press-shadow panel).
- **marketing/**: OfferCard (⚠ deliberately price-free — pricing strategy open), CompareTable, LogoStrip (⚠ partner logos Greene King/BII not yet migrated — awaiting go-ahead), NewsletterBand.
- **editorial/**: ArticleCard, FAQ (accordion), Toc.
Prop contracts in each `.d.ts.txt`; behaviour/usage rules in each `.prompt.md`.

## Interactions & Behavior
- Buttons/cards with press shadow: hover translate `-2px,-2px` + shadow grow; active translate `+3px,+3px` + shadow collapse. `120ms` hover, `cubic-bezier(.2,.9,.25,1)`.
- Header sticky (`top:0`), 64px tall, bottom border 1.5px ink. Current page: `inset 0 -3px 0` underline (ink on cream, white on orange).
- FAQ/Toc/Modal: simple open/close state; Modal traps focus, closes on overlay/Esc (use Radix Dialog).
- Forms: validate on blur; error = danger border + message below; success Alert on submit. Wire to existing form stack (`react-hook-form` + resolvers are in the repo).
- Focus-visible everywhere: the orange double ring token.
- Links: `#C05408`, hover ink, underline on hover.

## State Management
Presentational site — local state only: form state (react-hook-form), modal/FAQ/mobile-nav open booleans, sticky-CTA scroll visibility. Blog/case-study content from the repo's existing content layer (`content/`, Supabase where applicable).

## Assets (assets/)
`logo-primary.png`, `logo-horizontal.png` (cream header), `logo-icon.png` (orange mark — footer), `logo-icon-white.png` (orange header), `logo-badge.png`, `favicon-16/32.png`, `social-avatar.png`. Migrate to the repo's `public/`.

## Guidelines (guidelines/)
17 brand-spec pages (open in a browser): wordmark & app icons, highlight rules, method/pressure patterns, voice, color pairs & contrast, spacing/borders/states, full type specimens. Treat these as the rulebook when the templates don't answer a question.

## Files
- `templates/<slug>/<Name>.dc.html` — the 6 page designs (source of truth for layout + copy)
- `components/<group>/<Name>.jsx.txt|.d.ts.txt|.prompt.md` — reference implementation, prop contract, usage rules (`.txt` suffix is packaging only)
- `tokens/*.css`, `styles.css` — design tokens
- `guidelines/*.html` — brand rules; `ds-overview.md`, `SKILL.md` — system-level docs
- `_ds_bundle.js` + per-template `support.js`/`ds-base.js` — preview runtime only; ignore for implementation
