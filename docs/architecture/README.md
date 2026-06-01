---
generated: true
last_updated: 2026-04-26T00:00:00Z
source: session-setup
project: orangejelly-website
---

# Architecture Docs — orangejelly-website

Auto-generated on 2026-04-26. Regenerates each session via session-setup.

> To add persistent notes that survive regeneration, write to `docs/architecture/NOTES.md`.

## Index

| File | Contents |
|------|---------|
| [overview.md](./overview.md) | Project summary, stack, key sections, middleware, analytics |
| [routes.md](./routes.md) | Full route table — pages, API handlers, redirects |
| [server-actions.md](./server-actions.md) | Server actions (`'use server'`) with auth and purpose |
| [relationships.md](./relationships.md) | Cross-reference map — content flow, components, env vars, analytics |
| [data-model.md](./data-model.md) | No database — static site, content sources documented |

## Quick Facts

- **Stack**: Next.js 15 App Router · React 19 · TypeScript · Tailwind CSS
- **Deployment**: Vercel
- **Database**: None
- **Auth**: None (public marketing site)
- **Server Actions**: 1 (`submitContactForm`)
- **API Routes**: 3 (`/about-demo`, `/api/preview`, `/api/preview/exit`)
- **Pages**: 33 page routes (including dynamic slugs)
- **Content**: Markdown files in `/content/`
