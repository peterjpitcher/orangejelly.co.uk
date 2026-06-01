---
generated: true
last_updated: 2026-04-26T00:00:00Z
source: session-setup
project: orangejelly-website
---

# Server Actions

## Summary

Only one `'use server'` file exists in this project. The site is primarily static with a single contact form mutation.

## Actions

| Action | File | Purpose | Auth | Tables | Audit |
|--------|------|---------|------|--------|-------|
| `submitContactForm` | `src/app/actions/contact.ts` | Handles contact form submission | None (public) | None (no DB) | None |

## Notes

- No Supabase or database — form submission likely sends email or posts to a third-party service
- No auth-protected actions
- `generateStaticParams` and `generateMetadata` are Next.js framework conventions, not user-facing server actions
