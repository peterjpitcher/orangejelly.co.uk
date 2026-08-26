# Orange Jelly brand and design system (2026 repositioning)

Safe, version-controlled copy of the two packs that define the Orange Jelly repositioning: from
hospitality marketing agency to **growth partner for ambitious small and mid-sized businesses**.

Stored here on 26 August 2026. Nothing in this folder has been applied to the website yet. It is
reference material until the scoping decisions in `growth-system-v0.1/13-open-decisions.md` are made.

---

## What is here

| Folder | What it is | Files |
|--------|-----------|-------|
| `growth-system-v0.1/` | The strategy pack. Vision, positioning, ideal client, brand identity, tone of voice, method, offers, proof framework, search vision, website blueprint, decision filter, 90-day plan, open decisions. Plus `brand-system.json` (machine-readable summary) and the combined DOCX for human review. | 20 |
| `design-system-v1/` | The design handoff. Tokens, 24 reference components, 6 page templates, 17 brand guideline pages, logo suite. | 141 |
| `_source/` | The original delivered zip, kept verbatim as a fallback. | 1 |

### Provenance

- **Strategy pack** copied byte-for-byte from
  `OneDrive-OrangeJellyLimited/Orange Jelly Brand/orange_jelly_brand_system_v0.1/`.
  Version 0.1, status "working foundation", dated 25 August 2026. Source: founder discovery conversation.
- **Design system** extracted from `Orange Jelly Design System.zip` (iCloud Downloads, 26 August 2026,
  1.8 MB, 141 files). Archive verified with `unzip -t`, all 141 files present.

Both originals remain in place. This is a copy, not a move.

---

## Read in this order

1. `growth-system-v0.1/README.md` then `00-one-page-summary.md`
2. `growth-system-v0.1/01` to `06` (vision, positioning, client, identity, voice, method)
3. `growth-system-v0.1/07` to `10` (offers, proof, search, website blueprint)
4. `design-system-v1/README.md` then `ds-overview.md`
5. `growth-system-v0.1/13-open-decisions.md` **before** making any implementation decision

`growth-system-v0.1/CLAUDE.md` and `AGENTS.md` are agent instructions that ship with the pack. They are
not currently wired into this repo's agent config. That is a deliberate choice pending scoping.

### Source of truth hierarchy (from the pack's own README)

1. Company vision and positioning
2. Ideal client and brand identity
3. Tone of voice and signature method
4. Offer architecture and proof framework
5. Search and website documents
6. Activation plan

---

## The core position

> **You bring the growth problem. We build the solution.**

- Category: growth partner for ambitious small and mid-sized businesses (roughly 10 to 500 people)
- Method: **HEAR. EXPOSE. BUILD. PROVE.**
- Six pressure points: create demand, convert more, protect margin, remove operational drag,
  improve experience, build for scale
- Offer ladder: Growth Diagnostic, Growth Sprint, Growth Partnership, Transformation Programme
- Primary CTA: "Book a growth diagnostic". Campaign CTA: "Bring us the problem"
- AI is part of the toolkit, not the product
- The Anchor is reframed as a live small-business growth laboratory, not the category boundary

---

## Known conflicts with what is currently in this repo

These are recorded, not resolved. Do not silently pick a side.

| # | Conflict | Repo says | Pack says |
|---|----------|-----------|-----------|
| 1 | **Palette** | Navy `#1A2F49`, blue `#01619E`, orange `#F16F23`, pale blue surface `#F2F8FC` (`tailwind.config.js`) | Warm ink `#23252E`, cream `#F7F5F1`, orange `#F76B0C`, peach `#FFD3AD` |
| 2 | **Proof claims** | `/CLAIMS.md` marks the five percentages Authoritative and Approved | `08-proof-and-case-studies.md` and open decision 13 call them proof candidates needing baseline, date range, source and permission before publication |
| 3 | **Tone of voice** | `docs/TONE_OF_VOICE.md` is Authoritative and opens "disruptive hospitality growth partner for venues" | `05-tone-of-voice.md` supersedes it and bans hospitality as the category |
| 4 | **Pricing** | Root `CLAUDE.md` states £75+VAT per hour, packages from £375, 30-day guarantee | `07-offer-architecture.md` sets no prices. Minimum engagement values are an open decision. Hourly-rate pages are marked for redirect or retirement |
| 5 | **Information architecture** | 33 routes, around 12 with pub-specific URLs, 106 hospitality blog posts | `10-website-blueprint.md` wants growth problems, how we work, results, insights, about, start here |
| 6 | **Typeface** | Current site fonts | Schibsted Grotesk, explicitly flagged as a Google Fonts substitute pending licensed brand fonts |

### Gaps in the handoff

- `ds-overview.md` indexes a `ui_kits/website/` folder. It is **not** in the delivered zip.
- Case study template figures are placeholders. Founder photo and client imagery are placeholders.
- `OfferCard` is deliberately price-free while pricing is undecided.
- `LogoStrip` partner logos (Greene King, BII) are not migrated, awaiting go-ahead.

---

## Rules that already apply to any work from these packs

British English. Never an em dash. Sentence case, with ALL CAPS reserved for HEAR. EXPOSE. BUILD. PROVE.
Orange is a signal for action, pressure or focus, never wallpaper. Hard offset shadows, never blurred.
1.5px ink borders. Near-square corners. Every bold claim followed by proof. No emoji, no gradients,
no stock AI imagery.

The repo's existing build gates still apply: `check:design-tokens`, `check:british-english`,
`check:growth-language`.
