# Guide enquiry measurement runbook

Prepared 5 September 2026. Implementation is local until the release record confirms a deployment. No automation or database migration is required.

## Weekly readout

1. Sign in to `/admin` and open Enquiries. Use Enquiry measurement above the lead list. The default cohort covers the last 28 complete Europe/London dates. For a weekly view choose seven complete dates, and compare the same weekdays. Record both the creation period and the displayed observation time.
2. Enter any controlled test enquiry UUIDs in the exclusion box. Retain test rows. The report displays supplied IDs and how many matched this cohort. Maintain the approved test ID register in the existing restricted operational record, never in a public report. Anonymous test CTA/start events cannot be excluded using a lead ID and must be disclosed separately.
3. Record stored enquiries, unknown guide context, each current lead stage, qualified or later, conversation booked and clients. Qualified or later includes qualified, conversation booked and client. These are current stages for the creation cohort, not stage entries during the reporting period. Declined-after-qualified history cannot be reconstructed. Record the cohort age and observation date when comparing outcomes.
4. Review each real lead in the existing protected lead list. Qualified means a genuine business enquiry within Orange Jelly's work, with a relevant problem and willingness to discuss action. Client means paid work agreed. Record aggregate unsuitable-enquiry count and time spent qualifying, without personal details. Apply any lead state changes through the existing authorised operational process.
5. Enter genuine new WhatsApp conversations and known duplicate conversations in the manual fields. Count conversations actually received, never button clicks. The fields are temporary and clear on reload or period change. Copy the aggregate numbers to the weekly readout. Do not match identities automatically or invent emails to create lead rows. Record the duplicate adjustment separately.
6. Add Google clicks for the targeted guides and all guides from a dated Search Console export. Record the export's latest complete date, which can lag the report date. Combine recognised old and current URLs for the same guide when comparing. The admin view does not connect to Search Console, so its unavailable label is deliberate.
7. Record first-party CTA, WhatsApp and form-start events. Keep `guide-enquiry-v1` and legacy or unversioned events separate. They count events, not unique people. Anonymous and consented observations cannot be stitched together into visitor sessions.
8. Add consented guide sessions and unique-session click/start rates only if the analytics source provides matching guide, period, event version and session coverage. Record the source, freshness and consent coverage. Otherwise record unavailable. Never divide all stored enquiries by consented sessions. Google clicks are also not an interchangeable denominator.
9. Record missing data and notification failures separately from zero results. A summary error means the full cohort could not be verified; refresh or shorten the period. The endpoint rejects oversized or incomplete reports rather than publishing a partial total.

## Baseline and decisions

Capture the 28 complete days before the verified pilot deployment where the available records support it. The supplied Search Console export ends on 2 September 2026. Existing event and enquiry counts can include tests and are not automatically a genuine commercial baseline. If historical exclusion IDs, context or compatible session data are unavailable, label the first period baseline collection.

Review the pilot after 28 days, with weekly checks of receipt, quality and workload. Compare the same guides and equal weekday coverage. Seasonal demand and acquisition mix can change independently of the enquiry journey. Before/after differences are directional evidence and do not establish causality. Keep actual counts when the sample is too small to interpret a rate.

Extend guide coverage only after visitor paths, receipt, attribution and reporting pass verification and conversations are relevant. Pause expansion for failed enquiries, incorrect WhatsApp links, inaccessible controls, misleading proof, unprotected reports or an unmanageable irrelevant-enquiry workload. Do not schedule monitoring without a separate request.

## Controlled delivery evidence

A production submission and notification require explicit approval and a contact address Peter controls. Implementation permission alone does not provide that address. Until authorised evidence is recorded, receipt is unverified.

For the approved test, retain deployment ID, commit, London timestamp, tested URL, visible confirmation, exactly one stored lead UUID, validated source context, conversion-record receipt and notification delivery to the configured destination with a usable reply address. Keep personal values out of the report. Add the UUID to report exclusions without deleting the row. A successful page build or mocked test is not receipt evidence.

Use isolated failure tests for database failure, notification failure, event-write failure, malformed input, rate limiting and repeat submission. Database failure must retain the visitor's inputs and show an error with an alternative contact method. Secondary failure after a stored enquiry must leave an operational error without telling the visitor their recorded enquiry failed.

## Reporting boundaries

The report reads only IDs, creation timestamps, current stages, source context and event metadata on the server. The API returns counts and recognised published guide slugs, never names, email addresses, messages, raw URLs or contact IDs. Access uses the existing shared admin bearer gate. All reads are uncached. No new storage, PII destination or migration is introduced.

Both cohort dates are inclusive London calendar dates. The query uses an inclusive start midnight and exclusive following midnight, including clock-change days. Each table is paginated by ID with an exact count check; an interrupted or truncated read fails explicitly. Contact and event reads are separate snapshots, not a historical status ledger or transactionally frozen commercial audit. Refresh after changing lead stages.
