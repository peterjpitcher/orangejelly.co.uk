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
| 4 | Surveys must relate to the business. The first one asks the pub trade which apps they would use, what they would pay, whether they want a say in the build and whether they would test it. Peter is researching his own list of app ideas to merge in. |

## Proceeding with (reversible, say so and it changes)

- **Survey format first.** The first survey is research, not a personality quiz. The schema leaves room for scored quizzes later as additive tables.
- **Answers are anonymous; contact details are optional and separate.** Contact details are asked for only when someone says yes to having a say or testing. They live in their own table, not `contacts`, so research volunteers never land in the sales pipeline or its stats.
- **No automatic email to respondents.** Peter gets a notification per volunteer through the existing Resend path. Nothing is sent to the public.
- **Survey pages are `noindex`** and stay out of the sitemap. They are for sharing, not search.
- **Drafts are previewable** through a secret `?preview=` link. Preview answers are flagged and left out of every count.
- **Results on the thank-you screen appear only after 20 responses**, so nobody sees "100% chose X" from one vote.
- **Bot protection is a honeypot plus a rate limit** (the enquiry form's pattern). No Turnstile: it would be one more thing that can stop a real respondent.
- **Survey copy is authored as JSON in `content/surveys/`** so the repo's language checks (British English, the growth-language ban) run on it, then a script turns it into SQL. Database content escapes every build check otherwise.

## Data model (migration `20260922120000_surveys.sql`)

- `surveys`: slug, status (`draft|live|closed`), copy, `preview_token`, results threshold, which question the results screen tallies, the consent line.
- `survey_questions`: stable `key`, position, kind (`single|multi|text|contact`), prompt, hint, `min_choices`, `max_choices`, `options_from` (question keys whose picks become this question's options), `show_if` (show only when any listed option was picked).
- `survey_options`: stable `key`, position, label, hint, icon name.
- `survey_responses`: `answers` jsonb keyed by question key, `is_preview`, attribution (`referrer_host`, five `utm_*`), timestamps. No IP, no names.
- `survey_contacts`: one per response at most. Name, email, pub or business name, optional phone, what they volunteered for, the consent text they saw and when.
- `submit_survey_response(...)`: one transaction writes the response and, if given, the contact. Execute granted to `service_role` only.
- RLS on, no policies, matching every other table.

## Build pieces

Each lands green (lint, type-check, tests, build) and is committed on its own.

### 1. Schema and survey logic
- [ ] Migration with tables, constraints, the submit function and grants
- [ ] `src/lib/surveys/logic.ts`: visibility (`show_if`), piped options (`options_from`), answer validation, tallies. Pure, shared by client and server
- [ ] `src/lib/db/surveys.ts`: load a live or preview survey, submit, results
- [ ] Unit tests for the logic and the data layer
- [ ] Migration verified on a local Supabase stack

### 2. Public survey player
- [ ] `/survey/[slug]`: server page, `noindex`, 404 for unknown or draft without preview token
- [ ] Client player: one question per screen, tap to advance on single choice, progress bar, back button, keyboard and screen-reader friendly
- [ ] `submitSurvey` server action: Zod, honeypot, rate limit (`survey_submit_ip`), refuses in production if the limiter is not configured, fails closed with a retry and the email fallback
- [ ] Thank-you screen with live tallies over the threshold, and share buttons (WhatsApp, Facebook, LinkedIn, copy link, the phone's share sheet) tagged with UTMs
- [ ] Share card `opengraph-image.tsx` drawn from the survey title
- [ ] Tracking: `survey_started`, `survey_completed`, `survey_shared`
- [ ] Test injecting a failed database write asserts the respondent sees the failure

### 3. Contact details, notice and notification
- [ ] Contact step (name, email, pub or business, optional phone, consent tick)
- [ ] Privacy notice: a "Taking a survey" subsection, retention line, updated date and its test
- [ ] Notification to Peter per volunteer via `sendLeadNotification`, rendered with fixture data in a test

### 4. Admin
- [ ] `/api/admin/surveys` behind `requireAdmin`
- [ ] `SurveysPanel`: responses per survey, a tally per question, free-text answers, volunteers

### 5. First survey: which apps would pubs use
- [ ] `content/surveys/pub-apps.json` drafted with a range of app ideas
- [ ] `scripts/survey-to-sql.mjs` validates it and writes the insert SQL
- [ ] Merge in Peter's researched list
- [ ] Insert as `draft` in production (needs Peter's yes), Peter previews, then set `live`

## Results

(Recorded as pieces land.)
