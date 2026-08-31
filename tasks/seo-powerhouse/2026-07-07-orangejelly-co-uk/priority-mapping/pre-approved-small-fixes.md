# Pre-Approved Small Fixes — Orange Jelly (2026-07-07)

Low-risk, reversible fixes that can be implemented without the batched approval gate **if** implementation permission is granted. Each is git-reversible and touches disjoint files. This run is review-only — these are staged as ready-to-implement tickets, not yet applied.

| Ticket | Fix | Files | Risk | Rollback |
|---|---|---|---|---|
| SEO-107 | Add 3 live money pages to sitemap | `src/app/sitemap.ts` | Very low | Revert line(s) |
| SEO-108 | `/fix-my-pub` title/meta rewrite | `src/app/fix-my-pub/page.tsx` (or metadata source) | Low | git revert |
| SEO-111 | Metadata length fixes on 4 commercial pages | respective `page.tsx` metadata | Low | git revert |
| SEO-115 | 301 the `-uk` 404 slug → `-guide`; fix inbound link | `next.config.js`, `content/blog/how-much-profit-does-a-pub-make.md` | Low (standard redirect) | Remove redirect |
| SEO-116 | Repoint residual `/services` links → `/ways-to-work` | breadcrumb component + 6 guide bodies | Very low | git revert |
| SEO-117 | Add inbound links to orphaned `/pub-rescue` | contextual link in related guides/pages | Very low | git revert |
| SEO-124 | Fix 12 missing-required schema fields | `src/components/StructuredData.tsx` (+ WebSite emitter) | Low | git revert |
| SEO-126 | Add Organization/Person `sameAs` + `knowsAbout` | schema/JSON-LD builder | Low | git revert |
| SEO-127 | Real `lastModified` in sitemap | `src/app/sitemap.ts` | Very low | git revert |
| SEO-128 | Fix 8 "save/savings" + 2 US spellings | 6 `content/blog/*.md` files | Very low (pre-commit hook enforces anyway) | git revert |

**Note:** SEO-106 (Instagram/Facebook routing) is *borderline* — the fix itself is a standard redirect (low-risk pattern already used for `/services`), but because it changes how two page-one-ranking URLs resolve, it is listed in the **high-risk approval list** for a cannibalisation/canonical check before shipping.
