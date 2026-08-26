# Orange Jelly Design System

**Orange Jelly** is the growth partner for ambitious small and mid-sized businesses (roughly 10–500 people). It gets under the skin of a business, exposes what is blocking growth, and builds practical solutions using creativity, technology, AI and commercial judgement. It is explicitly NOT a hospitality marketing agency, a social posting service, or an AI consultancy.

- Promise: **You bring the growth problem. We build the solution.**
- Essence: **Brilliant change, made real.** Idea: **An unfair advantage for ambitious businesses.**
- Method: **HEAR. EXPOSE. BUILD. PROVE.**
- Six pressure points: Create demand · Convert more · Protect margin · Remove operational drag · Improve experience · Build for scale
- Offers: Growth Diagnostic → Growth Sprint → Growth Partnership → Transformation Programme
- Proof world: The Anchor, a real trading pub used as a **live small-business growth laboratory** (403% table bookings, 567% private hire, 98% food revenue, 828% search visibility, 89% fewer no-shows — proof candidates, verify before publishing).
- Primary CTA: **Book a growth diagnostic**. Campaign CTA: **Bring us the problem**.

**Sources:** local folder `Orange Jelly Brand/orange_jelly_brand_system_v0.1/` (13 markdown strategy docs + `brand-system.json` + combined DOCX). Text-only brand pack: **no logo files, no font binaries, no existing UI code or Figma** were provided. Visual foundations below are built from the pack's written visual-identity direction (doc 04) and website blueprint (doc 10).

## CONTENT FUNDAMENTALS

Voice: **Direct. Intelligent. Provocative. Practical. Human.** Bold, bright, commercially direct, with enough warmth to bring people along.

- British English. **Never use an em dash.** Sentence case for headings; very limited ALL CAPS (reserved for the method: HEAR. EXPOSE. BUILD. PROVE.)
- Say the important thing first. Short sentences. Active voice. Contractions where natural. One strong idea per sentence; a short sentence carries force.
- Use `we` and `you` confidently. Speak peer-to-peer with experienced operators; challenge the problem, never the person.
- Numbers and examples wherever they add credibility; every bold claim followed by proof (result, example, method, quote, or honest measurement plan).
- Message order: name the problem → commercial stakes → challenge the obvious answer → how we approach it → proof → one clear next action.
- Expletives are **high voltage, not wallpaper**: `f***ing` (partially censored), at most once, only in founder/manifesto contexts. Never in forms, legal, case studies.
- No emoji. No rhetorical-question padding. No multiple exclamation marks.
- Favour: growth problem, pressure point, build the solution, practical AI, operational drag, measurable change. Ban: innovative solutions, cutting-edge, game-changing, synergy, unlock your potential, growth journey, 360-degree, full-service, best in class, thought leader, AI-powered (unless material), bespoke.
- Signature lines (reusable verbatim): "You bring the growth problem. We build the solution." / "AI is part of the toolkit, not the product." / "A content calendar will not fix a broken growth system." / "Brilliant thinking is useless until it changes something." / "Big enough to have real growth problems. Small enough to move fast."

## VISUAL FOUNDATIONS

Feel: **serious about outcomes but not self-important**. High contrast, strong hierarchy, bold declarative typography, clean grid with moments of controlled disruption. Energy earned by substance. Never juvenile jelly illustration.

- **Color:** logo orange `#F76B0C` is a proprietary signal for **action, pressure or focus** — CTAs, highlights, key data; never wallpaper. Slate ink `#23252E` (from the logo wordmark) for authority (text, inverse blocks). Warm off-white cream `#F7F5F1` page ground; `#FCFBF9` cards. One soft accent, peach `#FFD3AD`, reserved for selection, focus and highlight marks. Semantic ok/danger exist for form states only (intentional addition). Approved pairs: ink on cream, cream on ink, ink on orange, orange on ink, peach on ink. Orange text on cream only at large sizes (use `--oj-orange-deep` for small accents).
- **Type:** one grotesk family with strong weight contrast, not decorative variety. Display = Schibsted Grotesk **Black** (weight 900, line-height .98, tracking -.025em) for declarative statements. Body = Schibsted Grotesk 400/500 at 17px/1.55. Evidence, eyebrows and data = Schibsted Grotesk 600–700, uppercase eyebrows tracked +.14em. No mono/secondary face — one family, weight does the work. Sentence case everywhere except the method words.
- **Evidence as design assets:** big black numbers, baseline-and-result framing, stat blocks given as much space as headlines.
- **Backgrounds:** flat solid color fields only — cream pages with full-bleed ink or orange sections for emphasis. No gradients, no textures, no patterns, no photography treatments defined yet (photography direction: real leaders, real work, candid; never robots/glowing brains/stock handshakes).
- **Borders & shadows:** 1.5px solid ink borders. Shadows are **hard offsets, never blurred** (`5px 5px 0 ink`) — the "pressure" motif. No soft elevation system.
- **Corners:** near-square. 3px radius on blocks/inputs/buttons, 8px max on large cards, pills only for tags. No large rounding.
- **Motion & states:** snap easing `cubic-bezier(.2,.9,.25,1)`, 120–200ms. Hover = block **shifts** up-left 2px and gains the hard pressure shadow (grid disruption motif); press = returns flat. Links: orange-deep → ink on hover. Focus = double ring (page color + orange). Restraint: animate transforms, no bounces, no fades-everywhere.
- **Layout:** 1160px container, generous space around important statements, clean 12-col grid with one deliberately disruptive element per view (offset block, stretched type, highlight mark). Cards: paper surface, ink border, near-square, dense typographic hierarchy (mono eyebrow → black headline → body).
- **Graphic devices:** highlight marks (solid peach blocks, orange sweeps), lines connecting causes to outcomes, blocks that shift/stretch, pressure-point dots. No jelly mascots, no blobs, no AI circuitry.
- **Transparency/blur:** none. Flat, printed, confident.

## ICONOGRAPHY

The brand pack ships **no icon set or imagery**; the logo suite lives in `assets/` (cut from the supplied files, transparent backgrounds):

- `logo-primary.png` — icon + stacked wordmark; default lockup on light surfaces
- `logo-horizontal.png` — icon + one-line wordmark; headers/nav, height ≥ 32px
- `logo-icon.png` — mark only, min 24px; `logo-icon-white.png` — reversed mark for ink or orange surfaces
- `social-avatar.png` (512), `favicon-32.png` / `favicon-16.png`, `logo-badge.png` (orange pill sticker)

- **Logo:** full-colour lockups on light surfaces only; on ink use the white reversed mark (or two-tone type wordmark). Never redraw, recolor, or stretch the files.
- **Icons:** none used by default. The system leans on typographic devices instead: unicode arrows `→ ↗` for actions/links, `01–04` numerals for the method steps, `+`/`×` for expand/close. If a fuller set is ever needed, use Lucide (CDN) at 1.5px stroke to match border weight — flagged as a substitution, not brand canon.
- No emoji anywhere.

## Index

- `styles.css` — global entry (imports everything below)
- `assets/` — logo suite (see ICONOGRAPHY)
- `tokens/` — `colors.css`, `typography.css`, `spacing.css` (radius/borders/shadows/motion), `fonts.css` (Google Fonts substitute — FLAG: replace with licensed binaries), `base.css` (body, links, selection, `.oj-display`, `.oj-eyebrow`, `.oj-mark` utilities), `prose.css` (`.oj-prose` long-form article styles + `.oj-callout`)
- `guidelines/` — foundation specimen cards (Design System tab)
- `components/core/` — Button, Tag (`dot="ok"` = availability badge), Stat, Mark
- `components/forms/` — Field, Input, Select, Textarea, Checkbox, Radio, Slider
- `components/content/` — Card, ProofCard, MethodStep, PressureCard, Quote
- `components/chrome/` — Header, Footer, Breadcrumb, StickyCTA
- `components/feedback/` — Alert, Modal
- `components/marketing/` — LogoStrip, OfferCard (price-free by design), CompareTable, NewsletterBand
- `components/editorial/` — FAQ, ArticleCard, Toc
- `ui_kits/website/` — marketing-site kit: interactive `index.html` (Home, How we work, Results, Start here screens as JSX)
- `templates/` — landing-page, blog-article, blog-listing, case-study, start-here, about (seeds for consuming projects)
- `SKILL.md` — agent skill entry point

**Intentional additions** (not in source, needed for UI): form ok/danger colors; Field/Input/Select/Textarea/Checkbox (enquiry form in doc 10 requires them); peach accent value chosen within doc 04's "one optional high-energy accent" allowance. Aug 2026 site audit (orangejelly.co.uk redesign): chrome (Header/Footer/Breadcrumb/StickyCTA), feedback (Alert/Modal), marketing (LogoStrip/OfferCard/CompareTable/NewsletterBand), editorial (FAQ/ArticleCard/Toc), Radio/Slider and `.oj-prose` added so every page type of the live site can be rebuilt. OfferCard stays price-free pending the open pricing decision.

**Open decisions inherited from the pack** (do not silently decide): pricing, offer naming. Palette re-tuned Aug 2026 against the supplied logo; logo suite refreshed from final files (their orange samples ≈ `#FD6604`, tokens keep the approved `#F76B0C`). See `13-open-decisions.md` in source.
