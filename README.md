# Orange Jelly Website

AI-powered marketing solutions for UK pubs, from one licensee to another.

## Overview

This is the website for Orange Jelly Limited, a business that helps UK pubs use AI tools for marketing and business improvement. Founded by Peter Pitcher, who runs The Anchor pub in Stanwell Moor.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **SEO**: Schema.org structured data
- **Deployment**: Optimized for Vercel/Netlify

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build

```bash
npm run build
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Environment Variables

Copy `.env.example` to `.env.local` for local development:

```bash
cp .env.example .env.local
```

### Available Variables

- `NEXT_PUBLIC_BASE_URL` - Base URL for the website (defaults to https://www.orangejelly.co.uk)
  - Used in sitemap.xml and robots.txt generation
  - Leave blank to use default
  - Set to `http://localhost:3000` for local development
  - Set to staging URL for staging environments

## Key Features

### Dynamic SEO Files

- **robots.txt** - Automatically generated with correct domain
- **sitemap.xml** - Dynamically created with all pages

### Schema.org Implementation

Comprehensive structured data for:
- Organization details
- FAQ sections on all pages
- Product/Service schemas
- Blog posts with speakable content
- HowTo guides

### Performance Optimizations

- Image optimization with Next.js Image component
- Font optimization with next/font
- Component code splitting
- Static generation for all pages

## Content Management

### Blog Posts

Blog posts are stored as Markdown files in `/content/blog/`. Each post includes:
- Frontmatter metadata
- SEO optimization
- Automatic schema generation

### Adding New Blog Posts

1. Create a new `.md` file in `/content/blog/`
2. Add required frontmatter (see existing posts for examples)
3. The post will be automatically included in the build

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # Reusable React components
├── lib/             # Utility functions and constants
└── content/         # Blog posts and static content

public/              # Static assets
```

## Important Files

- `src/lib/constants.ts` - Business information and pricing
- `src/app/layout.tsx` - Root layout with global metadata
- `CLAUDE.md` - AI assistant documentation

## Deployment

The site is optimized for deployment on:
- Vercel (recommended)
- Netlify
- Any Node.js hosting platform

For production deployment, ensure:
1. Environment variables are set correctly
2. Build completes without errors
3. All TypeScript checks pass

## Contact

- **Founder**: Peter Pitcher
- **Email**: peter@orangejelly.co.uk
- **Phone**: 07990 587315
- **Website**: https://www.orangejelly.co.uk

## License

© 2024 Orange Jelly Limited. All rights reserved.