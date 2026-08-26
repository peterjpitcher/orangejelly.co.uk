# Component audit: current site vs new design system

**Date:** 26 August 2026
**Purpose:** input to the governing implementation spec. Establishes what exists, what duplicates
what, what is dead, and what the new design system does not yet cover.

Method: every `.tsx` under `src/components` scanned for references anywhere in `src`. Reference
counts are name-based greps, so treat them as indicative of whether something is live, not as exact
call counts.

---

## Headline numbers

| Measure | Count |
|---|---|
| Components in `src/components` (excluding tests) | 179 |
| Components with no reference anywhere in `src` | **27** (2,617 lines) |
| Components in the new design system | **29** |
| Live routes | 33 |
| Blog posts in `content/blog` | 106 |

The site carries roughly six times the component surface the new design system defines. Most of the
excess is not features, it is three layers of the same thing.

---

## Finding 1: an abandoned migration left three layers of every primitive

The pattern is literal. Eight files in `src/components` contain nothing but this:

```tsx
// Transitional wrapper - will be removed after full migration
import ButtonAdapter from './adapters/ButtonAdapter';
export default ButtonAdapter;
```

So the real stack is:

```
Button.tsx  ->  adapters/ButtonAdapter.tsx  ->  ui/button.tsx (shadcn)
```

Three files, one button. The wrappers are `Button`, `Card`, `Heading`, `Text`, `FAQItem`,
`OptimizedImage`, `AnchorBadge`, `NewsletterForm`, plus `forms/Input`. The migration they were
written for never finished, and nothing imports the adapters except those wrappers.

**This is the single biggest simplification available.** The new design system is the natural
endpoint the migration was reaching for. Collapsing to one layer removes the adapter directory
entirely (16 files) and the wrapper files with it.

## Finding 2: duplicate families

Counts are files that do materially the same job.

| Family | Files now | Design system equivalent | Target |
|---|---|---|---|
| Button | 7 | `core/Button` | 1 |
| Card | 10 | `content/Card`, `PressureCard`, `ProofCard`, `editorial/ArticleCard` | 4 |
| Typography (Heading/Text) | 5 | tokens plus `.oj-prose` | 0 components |
| Form fields | 10 | `forms/Field` + Input/Select/Textarea/Checkbox/Radio/Slider | 7 |
| Whole forms | 7 | `forms/Field` composition, `marketing/NewsletterBand` | 2 |
| FAQ / accordion | 5 | `editorial/FAQ` | 1 |
| Sticky / floating CTA | 7 | `chrome/StickyCTA` | 1 |
| Trust / proof | 10 | `core/Stat`, `content/ProofCard`, `marketing/LogoStrip` | 3 |
| Chrome | 10 | `chrome/Header`, `Footer`, `Breadcrumb` | 3 |
| Layout primitives | 5 | tokens plus container rule (1160px) | 1 |
| Page sections | 10 | composed from templates | 0 as components |
| JSON-LD / schema | 12 | not a design concern | 1 generic plus config |

`demo/ui/` (3 files) has no reference anywhere and appears to be leftover shadcn scaffolding.

## Finding 3: the 27 dead components

Verified as having no reference anywhere in `src`. Safe to delete once confirmed against the
redirect and content plan.

`ServiceComparison`, `adapters/DialogAdapter`, `adapters/AlertAdapter`, `VideoTestimonial`,
`adapters/CheckboxAdapter`, `adapters/TabsAdapter`, `adapters/SelectAdapter`, `blog/TableOfContents`,
`ProgressiveEnhancement`, `VoiceSearchContent`, `VideoObjectSchema`, `EventSchema`, `ProductSchema`,
`MobileCTA`, `BlogPostingSchema`, `AboutSection`, `adapters/TextareaAdapter`, `StructuredDataTest`,
`blog/QuickStats`, `ServiceGrid`, `ResultCard`, `AggregateRatingSchema`, `blog/BlogLayout`,
`ui/tooltip`, `TrustBadgesWrapper`, `SocialProofWrapper`, `AnchorBadge`.

Note `ServiceComparison`, `SocialProof` and `ROICalculator` appear in the
`check-growth-language` target list, so that script needs updating when they go.

## Finding 4: what the design system does not cover

Live parts of the site with no design in the handoff. Listed in
`tasks/repositioning/design-requests.md`.

## Finding 5: the poll app is a separate product inside the same codebase

`src/components/polls/` is 21 components serving `/availability`. It has its own users and its own
purpose and is not part of the marketing site. It needs an explicit in-scope or out-of-scope
decision before the token swap, because a global palette change will restyle it whether we intend
it or not.

---

## Target shape

Collapsing the three layers, deleting the dead files and mapping the duplicate families onto the
29 design-system components should take `src/components` from 179 to roughly 90, without removing
a single user-facing capability. The reduction is layers and repeats, not features.

**Order matters.** Delete dead code first, collapse the wrapper layer second, then swap tokens, then
rebuild page by page. Swapping tokens before collapsing the layers means restyling three copies of
every primitive.
