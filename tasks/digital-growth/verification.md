# Digital growth implementation verification

## Scope

Peter authorised the complete implementation and release on 5 September 2026. Work takes place in an isolated checkout from production main, excluding unrelated local security and instruction-file commits.

Three reviewable increments: commercial pages and routes; homepage/hub/shared identity; enquiry, method and contextual links. All changes reuse existing form, storage, consent and auth behaviour. No migration or new integration.

## Evidence so far

- Route and keyword decisions: `page-map.md`, `keyword-evidence.csv`, `gsc-baseline.json`.
- Full initial integrated gate: lint/content gates and type-check passed; 1,657 tests passed; production build passed. Existing GoogleTagManager beforeInteractive warning and Browserslist age notices remain.
- UTC: all 26 enquiry source and summary tests passed.
- Independent read-only review found no blocking route, claim, canonical or enquiry-code issue and requested narrow-screen button checks.
- Browser on built app: homepage and three new commercial pages measured 320 px document width at 320 px viewport. Start-here also fitted.
- Browser identified professional-services button overflow to 401 px and growth-problem buttons to 348 px. Those new related-build buttons now wrap within their available width; the rebuilt browser recheck measured all three at 320 px document width on a 320 px viewport.
- Browser: booking service invitation reached the enquiry form. A successful fixture submission displayed `that has arrived.` with the status focused.
- Browser: injected database failure displayed `We could not send that`, preserved input values and provided the real email fallback.
- Native HTML submission without executing JavaScript returned HTTP 200 with confirmation and preserved autumn guide context.
- The fixture recorded contact, source, submitted event and notification attempt. Server-side fetch interception blocked external storage/email calls, and fake service keys were supplied. No real enquiry or message was created.

## Limits

Fixture delivery is not real inbox receipt; that test still requires explicit permission. No authenticated admin-browser flow was changed or exercised. Service attribution remains incomplete under the existing consent/referrer design and is not presented as a new complete service funnel. No conversion uplift is claimed. Future 28-day and eight-week reviews are not scheduled automatically.

All guide articles, insights, published case studies, pricing/contact/claim constants, authentication, database, poll routes, API actions and consent code are deliberately unchanged. Existing unquantified application scope is described accurately, without invented portfolio images or client evidence.

## Release

Final integrated gate passed: lint/content checks, type-check, 1,657 tests and production build. Desktop layout, keyboard focus progression and the generated share image were inspected. All internal link destinations on the three service pages returned their intended pages; canonicals were checked. Native browser 200% zoom was not separately exercised.

PRs 53, 54 and 55 merged in order, preserving their reviewed commits. Final production commit: `3d801e3f86f8088b9e3adc33085ff820fa461bfb`. Preview `dpl_FBLCWp5W54iRMeqnQzfaLQfGVsst` was READY for source commit `30d365745b1fe1ca6f7fee326d1531f6013ac9bd`; its booking page was verified with the correct production canonical. Production `dpl_Qnjnu9oeg4HmnDTa9tNJZ3aaziEh` reached READY for exact merge commit `3d801e3f86f8088b9e3adc33085ff820fa461bfb`. Direct inspection of `www.orangejelly.co.uk` resolved to that same deployment. Live browser checked the new homepage heading and metadata, all three service headings/canonicals, hub links and booking-service invitation to the revised enquiry form. The live sitemap includes each service URL exactly once. Bounded recent runtime-error retrieval returned no logs.

See `changed-files.txt` for the full implementation inventory. Release evidence updates are local only.
