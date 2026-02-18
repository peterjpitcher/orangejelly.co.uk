# Repository Guidelines

## Project Structure & Module Organisation
The Next.js app lives in `src/app`, with shared UI in `src/components`, hooks in `src/hooks`, state / schema helpers under `src/lib`, and React contexts in `src/contexts`. Markdown and long-form copy sit in `content`, static assets in `public`, and reusable scripts (search index, feeds, lint helpers) in `scripts`. Marketing material and longer references reside in `docs`; design assets are under `assets`. Test fixtures and utilities live in `src/test`, while `test-results/` stores automated output you can inspect but should not edit manually.

## Build, Test, and Development Commands
- `npm run dev`: local Next.js dev server with hot reload.
- `npm run build` / `npm start`: production build and serve.
- `npm run lint`, `npm run format`, `npm run format:check`: ESLint and Prettier enforcement.
- `npm run type-check`: strict TypeScript validation.
- `npm run test`, `npm run test:coverage`: Vitest suites and coverage report.
- `npm run build:search`, `npm run build:feeds`, `npm run build:all`: regenerate search index and feed JSON before deploys.

## Coding Style & Naming Conventions
Use TypeScript with 2-space indentation, favour functional React components, and keep files in ASCII. Component files adopt `PascalCase.tsx`; hooks use the `useThing` prefix; helpers in `src/lib` use camelCase. Prefer Tailwind utility classes over ad-hoc CSS, and compose class names via `clsx` or `cva`. Run `npm run format` plus `npm run lint` before committing; Husky guards the same checks.

## Testing Guidelines
Vitest with Testing Library backs unit and interaction tests. Place specs as `*.test.ts` / `*.test.tsx` beside the code or in `src/test`. Target key rendering paths, schema logic, and custom hooks; add accessibility assertions where possible. Run `npm run test:coverage` for meaningful refactors and keep new modules above 80% line coverage unless justified in the PR.

## Commit & Pull Request Guidelines
Follow the existing imperative style (`feat: add cookie consent`, `docs: update redeploy note`). Keep messages short, prefix with a Conventional Commit type when it fits, and avoid multi-topic commits. PRs should link related issues, summarise behavioural changes, list commands executed (tests, linting, build), and include screenshots or recordings for UI-facing updates. Highlight any config, content, or search/feed rebuild steps reviewers must repeat.

## Growth Messaging Guardrails
All customer-facing conversion copy must use the growth voice standard in `docs/voice/growth-messaging.md`.

- Keep language plain English with strong verbs: `transform`, `accelerate`, `disrupt`.
- Write to commercial outcomes multi-operators care about: bookings, covers, revenue, margin optimisation, loyalty, engagement, retention.
- Use British English spellings in all customer-facing copy.
- Avoid savings-led phrasing in conversion surfaces (for example: `save time`, `savings`, `saved`).
- Use the approved phrase bank and replacement map in `docs/voice/growth-messaging.md`.
- Before any PR that touches conversion copy, run `npm run check:growth-language`.
- Before any PR that touches customer-facing copy, run `npm run check:british-english`.
- `npm run lint` now includes growth language and British English enforcement and must pass.
- `lint-staged` is configured to run both checks on changed `js/jsx/ts/tsx/json/md` files when pre-commit hooks are enabled.
