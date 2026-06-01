---
generated: true
last_updated: 2026-04-26T00:00:00Z
source: session-setup
project: orangejelly-website
---

# Data Model

No database — static Next.js site.

All content is sourced from:
- Markdown files in `/content/blog/` (Licensees' Guide posts)
- Markdown files for ways-to-work packages
- Hardcoded data in page/component files

There is no Supabase, PostgreSQL, or any other database dependency.

## Content Sources

| Source | Format | Reader |
|--------|--------|--------|
| `/content/blog/*.md` | Markdown + YAML frontmatter | `src/lib/markdown/markdown.ts` |
| Ways-to-work packages | Markdown + YAML frontmatter | `src/lib/markdown/markdown.ts` |
| Business metrics, testimonials | Hardcoded in components | N/A |

## Search Index

A static search index is built at build time via `npm run build:search` and served as a static JSON file. No runtime database queries.
