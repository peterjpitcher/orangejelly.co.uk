# Surveys: plan

**Started:** 22 September 2026. **Branch:** `feat/surveys`.

Fast, BuzzFeed-style surveys on orangejelly.co.uk that Peter can share on social
media. One tap per question, big answer tiles, a results screen worth sharing, and
a link preview that sells the survey.

## Decisions taken by Peter, 22 September 2026

| # | Decision |
|---|---|
| 1 | Build it in the site, not a hosted tool. Research: `tasks/survey/RESEARCH.md`. |
| 2 | Surveys live in the database, so one goes live without a production release. No builder screen yet; Claude writes them. |
| 3 | Capture contact details (not anonymous-only). |
| 4 | Surveys must relate to the business. The first one asks the pub trade which apps they would use, what they would pay, whether they want a say in the build and whether they would test it. |
| 5 | The app list is built around Peter's ten modules plus Marketing (Customers, Tables, Events, Private bookings, Parking, Tasks, People, Recruit, Rotas, Money), with four extras to test demand beyond them: gift vouchers, review replies, stock and ordering, tips and tronc. |
| 6 | The two app screens allow as many picks as people like (Peter, 22 September 2026). The single favourite comes from the piped "if you could only have one" question. |

## Proceeding with (reversible, say so and it changes)

- **Survey format first.** The first survey is research, not a personality quiz. The schema leaves room for scored quizzes later as additive tables.
- **Answers are anonymous; contact details are optional and separate.** Contact details are asked for only when someone says yes to having a say or testing. They live in their own table, not `contacts`, so research volunteers never land in the sales pipeline or its stats.
- **No automatic email to respondents.** Peter gets an email for every response (his request, 22 September 2026), preview answers included and marked "[Preview]", through the existing Resend path to `CONTACT_NOTIFICATION_EMAIL`. Nothing is sent to the public.
- **Volunteers' details are deleted 24 months after their survey closes**, by a daily cron, matching enquiries (Peter, 22 September 2026; he declined 12 months). The anonymous answers stay.
- **Price bands on the survey are the respondent's answer ranges, not Orange Jelly prices.** Pending Peter's yes, as an exception to "the only number on the site is the hourly rate".
- **Survey pages are `noindex`** and stay out of the sitemap. They are for sharing, not search.
- **Drafts are previewable** through a secret link, `/survey/<slug>/preview/<token>`. The token is in the path so the token-route rules apply (no referrer, no third-party scripts), and nothing is measured there. Preview answers are flagged and left out of every count.
- **Results on the thank-you screen appear only after 20 responses**, so nobody sees "100% chose X" from one vote.
- **Bot protection is a honeypot plus a rate limit** (the enquiry form's pattern). No Turnstile: it would be one more thing that can stop a real respondent.
- **Survey copy is authored as JSON in `content/surveys/`** so the repo's language checks (British English, the growth-language ban) run on it, then a script turns it into SQL. Database content escapes every build check otherwise.

## Data model (migration `20260922113213_surveys.sql`)

- `surveys`: slug, status (`draft|live|closed`), copy, `preview_token`, results threshold, which question the results screen tallies, the consent line.
- `survey_questions`: stable `key`, position, kind (`single|multi|text|contact`), prompt, hint, `min_choices`, `max_choices`, `options_from` (question keys whose picks become this question's options), `show_if` (show only when any listed option was picked).
- `survey_options`: stable `key`, position, label, hint, icon name.
- `survey_responses`: `answers` jsonb keyed by question key, `is_preview`, attribution (`referrer_host`, five `utm_*`), timestamps. No IP, no names.
- `survey_contacts`: one per response at most. Name, email, pub or business name (optional), what they volunteered for, the consent text they saw and when.
- `submit_survey_response(...)`: one transaction writes the response and, if given, the contact. Execute granted to `service_role` only.
- RLS on, no policies, matching every other table.

## Build pieces

Each lands green (lint, type-check, tests, build) and is committed on its own.

### 1. Schema and survey logic
- [x] Migration with tables, constraints, the submit function and grants
- [x] `src/lib/surveys/logic.ts`: visibility (`show_if`), piped options (`options_from`), answer validation, tallies. Pure, shared by client and server
- [x] `src/lib/db/surveys.ts`: load a live or preview survey, submit, results
- [x] Unit tests for the logic and the data layer
- [x] Migration verified on a local Supabase stack

### 2. Public survey player
- [x] `/survey/[slug]`: server page, `noindex`, 404 for unknown or draft without preview token
- [x] Client player: one question per screen, tap to advance on single choice, progress bar, back button, keyboard and screen-reader friendly
- [x] `submitSurvey` server action: Zod, honeypot, rate limit (`survey_submit_ip`), refuses in production if the limiter is not configured, fails closed with a retry and the email fallback
- [x] Thank-you screen with live tallies over the threshold, and share buttons (WhatsApp, Facebook, LinkedIn, copy link, the phone's share sheet) tagged with UTMs
- [x] Share card `opengraph-image.tsx` drawn from the survey title
- [x] Tracking: `survey_started`, `survey_completed`, `survey_shared`
- [x] Test injecting a failed database write asserts the respondent sees the failure

### 3. Contact details, notice, notification and retention
- [x] Contact step (name, email, pub or business, consent tick). No phone: not asked for, and less personal data to hold
- [x] Privacy notice: a "When you answer one of our surveys" subsection, retention line, updated date and its test
- [x] Notification to Peter per volunteer via `sendLeadNotification`, rendered with fixture data in a test
- [x] Daily cron `/api/cron/surveys` deletes volunteers' details 24 months after the survey closes

### 4. Admin
- [x] `/api/admin/surveys` behind `requireAdmin`
- [x] `SurveysPanel`: responses per survey, a tally per question, free-text answers, volunteers

### 5. First survey: which apps would pubs use
- [x] `content/surveys/pub-apps.json` drafted with a range of app ideas
- [x] `scripts/survey-to-sql.ts` validates it and writes the insert SQL
- [x] Merge in Peter's researched list
- [ ] Insert as `draft` in production (needs Peter's yes), Peter previews, then set `live`

## Results

- `0a8337f1` schema, survey rules, first survey draft. `7ea0664c` public page, submission, share card.
  `5cee625a` privacy notice and retention cron. `078f2abe` admin panel.
- Verified on a local Supabase stack (scratch copy of every repo migration plus the two
  applied only in production), in the browser at phone width: draft hidden without the
  preview link, preview answers flagged and uncounted, piping and the named top pick,
  consent refusal, volunteer stored with its consent text, UTM source captured, results
  bars at 26 responses, share card rendered, retention sweep deleting only expired
  volunteers.
- Local-only differences found and not repo defects: the newer local Supabase image grants
  nothing to service_role on older tables and functions. Production grants them (checked).
  The survey migration grants its own explicitly, so it behaves the same on both.
- An independent review found seven defects, all fixed in the review commit: the preview
  token could reach GA4 (it now lives in the path, a token route, and nothing is measured
  there); a stale "Try again" could resend changed answers; retries could store twice (one
  response id per respondent, a repeat is recognised by the primary key); preview
  volunteers showed in admin; admin totals were capped at 5,000; Back could be overridden
  by a pending tap; three authoring gaps and an inherited icon name that crashed the page.
- 1,854 tests pass; lint (bar one pre-existing warning), type-check and build clean.

## Going live

1. Apply `20260922113213_surveys.sql` to production (before the code, or /survey and the
   cron will error on a missing table). **Done 22 September 2026**: applied to
   `miqqkllqfyvaomzgujed` through the Supabase MCP as history version `20260922113213 surveys`
   (repo file checksum `097e2fc0…aec9f`). Verified: RLS on all five tables, no anon or
   authenticated grants, functions executable by service_role only, and a rolled-back smoke
   test of every function path.
2. Merge and deploy.
3. `npx tsx scripts/survey-to-sql.ts content/surveys/pub-apps.json` and run the output against
   production. It lands as `draft`.
4. Peter previews with `/survey/pub-apps/preview/<token>` (the link is in the admin panel).
5. `update surveys set status = 'live', opened_at = now() where slug = 'pub-apps';`
6. To close: `update surveys set status = 'closed', closed_at = now() where slug = 'pub-apps';`
