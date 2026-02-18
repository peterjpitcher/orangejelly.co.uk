# Growth Messaging Standard

## Purpose
Keep all conversion copy aligned to one voice: plain English, strong growth language, clear commercial outcomes.

## Audience
Primary audience is operators and multi-operators focused on:
- Revenue growth
- Bookings and covers
- Margin optimisation
- Loyalty, engagement, and retention

## Voice Rules
- Use short, direct sentences.
- Use strong verbs: `transform`, `accelerate`, `disrupt`.
- Tie bold claims to outcomes and numbers where possible.
- Write like an operator, not a consultant.
- Use British English spelling across all website copy.

## Avoid
- `save time`
- `saved`
- `savings`
- Soft phrases that sound passive (for example: `improve`, `help`) when stronger alternatives are available.

## Preferred Language
- `Drive margin optimisation`
- `Accelerate bookings`
- `Transform flat performance into real growth`
- `Build momentum that compounds quarter after quarter`
- `Turn campaigns into covers, not vanity metrics`

## Approved Statement Bank
1. Transform flat performance into real growth.
2. Accelerate bookings across every venue.
3. Disrupt stale marketing and drive weekly trade.
4. Turn campaigns into covers, not vanity metrics.
5. Drive margin optimisation without cutting quality.
6. Build loyalty that compounds month after month.
7. Convert demand into repeat revenue.
8. Accelerate repeat visits with smarter offers and better follow-up.
9. Transform team output without adding headcount.
10. Disrupt weak channels and invest in what drives revenue.
11. Accelerate demand, not just activity.
12. Drive retention with experiences people return for.
13. Transform each venue into the local first choice.
14. Accelerate revenue with weekly playbooks that work.
15. Disrupt discount-led thinking and build value-led demand.
16. Make every promotion pull its weight in covers and spend.
17. Transform strategy into action that compounds revenue every week.
18. Accelerate performance across one site or many.
19. Build momentum that compounds quarter after quarter.
20. Lead your local market with marketing that runs like operations.

## Quick Replacements
- `save up to 25 hours a week` -> `turn 25 hours a week into growth actions`
- `monthly savings` -> `monthly margin growth`
- `cost savings` -> `margin gains`
- `time savings` -> `faster execution`

## British English Rules
- Prefer `optimise`, `optimised`, `optimising`, `optimisation`.
- Prefer `analyse`, `analysed`, `analysing`.
- Prefer `behaviour`, `favourite`, `maximise`, `recognise`, `centre`.
- In prose, prefer `colour` and `colours`.
- Keep technical keys and code identifiers unchanged where required (for example JSON keys like `color`).

## Enforcement
- Command: `npm run check:growth-language`
- Command: `npm run check:british-english`
- The check runs automatically inside `npm run lint`.
- `lint-staged` is configured to run the check on changed `js/jsx/ts/tsx/json/md` files when pre-commit hooks are enabled.
- `npm run build` also runs both checks before compilation.
- Scope enforced by scripts: key conversion files in `src/app`, `src/components`, plus all `content/**/*.md` and `content/**/*.json`.
