# Lead conversion verification

5 September 2026. Implementation authorised by Peter's instruction to implement everything.

## Delivered

- Contextual early, end and sticky invitations on autumn, Oktoberfest and food-menu pilot guides.
- Shared category fallback implementation for all remaining guides, disabled until the pilot review described in the spec. No observation period has elapsed yet.
- Earlier enquiry form, short reassurance and guide-specific guidance on start-here/contact.
- WhatsApp and email alternatives using existing contact constants.
- Relevant Anchor proof from existing approved constants, with case-study links.
- Validated context attribution and event contracts, preserving unversioned legacy callers.
- Authenticated aggregate enquiry summary with complete pagination, exclusions, current-stage counts and explicit unavailable denominators.
- Weekly measurement runbook and temporary aggregate WhatsApp notes.
- A small mobile header spacing correction after the browser showed its Menu control extending to 327 px on a 320 px viewport. Recheck measured 320 px document width at 320 px viewport width.

## Evidence

- Production build passed, including page generation. An initial build caught optional page-argument signatures; both were corrected and the build rerun.
- Type-check passed.
- Full suite on the original checkout: 89 files, 1,660 tests passed, three existing tests skipped. Clean release branch excludes unrelated security commits and passed 88 files with 1,645 tests.
- Lint and all six content gates passed. One pre-existing GoogleTagManager beforeInteractive lint warning remains; the unchanged file was deliberately not rewritten for this feature. Existing Browserslist data-age notices also remain.
- Independent agent review identified contact-route attribution and malformed event-version handling. Both were corrected, with tests.
- Supabase live columns inspected read-only for contacts, conversion_events and lead_sources; no dependent views returned. No schema changes required.
- Actual new summary function ran read-only against the live store for 8 August to 4 September. It returned four stored enquiries, all currently new and without guide context. These may include historical tests and are not asserted to be four genuine leads. The new version has no historical events.
- Built application served locally with external storage and email calls intercepted server-side by an isolated fixture harness outside the repository. No production enquiry or email was created.
- Browser: autumn early invitation led to the correct guide/placement enquiry URL; topic copy, form, WhatsApp message and +403% proof were present before process sections.
- Browser: successful fixture submission with situation `help` displayed `that has arrived.` and moved focus to the confirmation. The fixture recorded one contact, an enquiry_submitted event, contextual source and notification attempt with body and reply address.
- Browser: injected database failure displayed `We could not send that`, an email fallback and retained form inputs. Mobile contact width 390 px, document width 390 px.
- Native HTML multipart submission without running JavaScript returned the confirmation with HTTP 200 and retained guide context.
- Browser: Oktoberfest pilot showed both contextual actions at 320 px after header correction; food-menu guide showed its food-sales invitation and approved +98% food revenue proof at 1440 px.
- All three linked live case-study routes returned HTTP 200. Current local build also generated these exact routes.
- Unauthenticated request to new admin summary endpoint returned HTTP 401. Authorised calculation, rejected access, date boundaries, test exclusions and failure cases covered by the focused summary tests, including UTC execution.

## Limits and remaining release evidence

The fixture proves the application submission path, not delivery to a real inbox. A clearly labelled production test enquiry and its actual email receipt remain subject to explicit permission. Live admin browser sign-in and the full manual zoom/keyboard matrix have not been completed; authenticated aggregate query and tests are recorded above without claiming that browser path ran.

The pilot review and all-guide enablement are intentionally deferred until the measurement gate. Do not infer a conversion uplift from implementation or tests. No automation was created.

## Change scope

See `changed-files.txt` for the exact implementation inventory. All guide Markdown, insights, URL manifest, redirects, article metadata, claims, pricing/contact constants, case-study content, auth implementation and migrations were deliberately left unchanged. The branch started from a checkout containing three unrelated local commits; release preparation must exclude those commits.
