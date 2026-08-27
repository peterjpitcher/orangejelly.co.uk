# Design change request, 27 August 2026

**To:** the team behind `design_handoff_website_redesign`
**From:** Orange Jelly
**Re:** four changes following decisions made after your 26 August handback

Your handback answered every request in full and the bundle is in implementation now. Four decisions
have been made since that affect what you have already built. Three of them are ours, made after you
delivered, and we are sorry for the churn.

Nothing below questions the design. It is all consequences of positioning decisions.

---

## 1. The method has changed. This is the big one.

**Was:** HEAR. EXPOSE. BUILD. PROVE.
**Now:** **HEAR. CHALLENGE. BUILD. OPTIMISE.**

Peter rejected EXPOSE as too aggressive for a first read. CHALLENGE replaces it. PROVE becomes
OPTIMISE, because the offer is a continuing partnership rather than a project that ends at a report.

We know this lands after you built around the old four. The affected files, from a grep of the
bundle:

| File | What carries it |
|---|---|
| `templates/how-we-work/HowWeWork.dc.html` | The whole page structure |
| `templates/landing-page/LandingPage.dc.html` | Method section |
| `templates/solutions/Solutions.dc.html` | Method reference |
| `templates/growth-problem/GrowthProblem.dc.html` | Method reference |
| `templates/case-study/CaseStudy.dc.html` | Narrative structure |
| `components/content/MethodStep.d.ts.txt` | Prop contract |
| `components/content/MethodStep.prompt.md` | Usage rules |
| `ui_kits/website/HowWeWork.jsx.txt`, `Home.jsx.txt` | Both screens |
| `SKILL.md` | The ALL CAPS non-negotiable names the old four |

**What we need:** the four words swapped, and the step copy rewritten where the meaning changed.
HEAR and BUILD are unaffected. CHALLENGE carries roughly what EXPOSE did. **OPTIMISE is genuinely
different from PROVE** and needs new copy, not a relabel.

**One request on OPTIMISE.** Dropping PROVE takes the only measurement language out of the method,
and the brand pack rests its credibility on measurement. Please write the OPTIMISE step so it still
carries "we agree a baseline, we measure against it, we keep improving". Something like: measure,
learn, improve, repeat. It should not read as an open-ended retainer.

## 2. The About template's founder story must go

**Decision:** the brand is Orange Jelly, not Peter. Company voice throughout, "we" not "I", and no
page built around the founder. Peter's reasoning: "I'm only one person."

`templates/about/About.dc.html` ships a founder story section with a photo placeholder and
`.oj-prose` body. That section needs repurposing rather than deleting: same slot, same weight, but
about how the company works and what it believes rather than about a person.

The Anchor stays as proof and is now framed as **"our own venue"** or **"the business we run"**,
never "Peter's pub". The live-lab ink section works as designed with that wording change.

Article bylines keep a named human author, because search and structured data need one. That is the
only place a person appears.

## 3. Expletives are out, site-wide

No expletive appears anywhere on the permanent site. Not the homepage, not About, not the manifesto.

This overrides `05-tone-of-voice.md`, which permitted partially censored use in founder-led and
campaign content, and the `SKILL.md` guidance that follows it.

**What we need:** confirmation that no template, prompt or component copy assumes
"Stop circling the problem. Make the f***ing change." The final CTA band on the landing page is the
likely place.

Reasoning, in case it is useful: the first target sector is professional services, accountancy
practices and law firms. Considered purchase, conservative buyers. The line costs more than it buys.

## 4. Two source conflicts we cannot resolve ourselves

We need a **design authority order**: which file wins when two disagree. Our proposed order is final
decision log, then handback, then tokens and prop contracts and prompts, then templates, then
overview and README, then the superseded v1 material. Please confirm or correct.

Two live conflicts it would settle:

| Conflict | Sources |
|---|---|
| **Is Schibsted Grotesk production or a substitute?** | The handback says treat it as production and the type scale is final. `README.md` and `ds-overview.md` both flag it as a substitute pending licensed fonts. We are building on it as production per the handback. Confirm. |
| **Are gradients allowed?** | `SKILL.md` lists "no gradients" as a non-negotiable. The highlight band device is a `linear-gradient`, and the slider and select treatments use them. We read the highlight band as an approved exception. Confirm. |

Minor: the `README.md` footer still refers to six templates. The bundle has fourteen.

---

## Still with you from the last round

- **Greene King and BII logo migration into `LogoStrip`.** Files are in our `public/`. We have the
  go-ahead, so this is unblocked whenever you are ready.
- Case-study figures. **Now resolved on our side:** Peter has personally validated the five
  performance metrics and they are approved for publication. The verification caveat you designed
  into the Results page can come out.

## What we have implemented so far

For context on pace: the dead code and the abandoned adapter layer are gone, components are down
from 179 to 140, and the token work starts next. Nothing user-facing has changed yet.
