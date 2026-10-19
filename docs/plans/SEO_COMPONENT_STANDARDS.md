# SEO Component Standards for shadcn/ui Migration

## 🎯 2024/2025 SEO Best Practices for React Components

Based on latest Google guidelines and industry standards, every component must follow these SEO principles:

### Core Principles
1. **Server-Side Rendering First**: Use Next.js SSR/SSG for all content
2. **Schema Markup Everything**: JSON-LD on every applicable component
3. **Semantic HTML Always**: Proper HTML5 elements for structure
4. **Performance Obsessed**: Core Web Vitals as primary metric
5. **Mobile-First Design**: Google uses mobile-first indexing

## 📐 Component SEO Standards

### 1. Heading Component
```typescript
interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  id?: string; // For anchor links
  itemProp?: string; // For schema markup
  className?: string;
}

// Requirements:
- MUST render semantic h1-h6 tags
- MUST support schema markup via itemProp
- MUST have proper hierarchy (only one h1 per page)
- SHOULD have id for anchor linking
- SHOULD support aria-label for accessibility
```

### 2. Image Component
```typescript
interface ImageProps {
  src: string;
  alt: string; // REQUIRED - never optional
  width: number;
  height: number;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  itemProp?: string; // For schema markup
  sizes?: string; // Responsive images
}

// Requirements:
- MUST have descriptive alt text (minimum 10 characters)
- MUST specify width/height to prevent CLS
- MUST support lazy loading (default)
- MUST generate WebP/AVIF formats
- SHOULD include schema ImageObject when applicable
- SHOULD use fetchPriority='high' for LCP images
```

### 3. Link Component
```typescript
interface LinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  rel?: string;
  itemProp?: string;
  prefetch?: boolean;
}

// Requirements:
- MUST use Next.js Link for internal navigation
- MUST add rel="noopener noreferrer" for external links
- MUST NOT use target="_blank" without rel attributes
- SHOULD prefetch internal links (Next.js default)
- SHOULD support schema markup
```

### 4. Article Component
```typescript
interface ArticleProps {
  title: string;
  content: React.ReactNode;
  author: Author;
  datePublished: string;
  dateModified?: string;
  image?: ImageProps;
  category?: string;
}

// MUST include full Article schema:
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": title,
  "author": {
    "@type": "Person",
    "name": author.name,
    "url": author.url
  },
  "datePublished": datePublished,
  "dateModified": dateModified,
  "image": imageSchema,
  "publisher": organizationSchema,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": currentUrl
  }
}
```

### 5. FAQ Component
```typescript
interface FAQProps {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

// MUST include FAQPage schema:
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": questions.map(q => ({
    "@type": "Question",
    "name": q.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": q.answer
    }
  }))
}
```

### 6. Service Component
```typescript
interface ServiceProps {
  name: string;
  description: string;
  price: string;
  image?: ImageProps;
  provider: Organization;
}

// MUST include Service schema:
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": name,
  "description": description,
  "provider": provider,
  "areaServed": "United Kingdom",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": name,
    "itemListElement": [{
      "@type": "Offer",
      "price": price,
      "priceCurrency": "GBP"
    }]
  }
}
```

## 🔍 Schema Implementation Rules

### JSON-LD Best Practices
1. **Always use JSON-LD format** (not microdata or RDFa)
2. **Place in <script> tags** in the page head or body
3. **Validate with Google's Rich Results Test**
4. **Use @id to link related schemas**
5. **Include all required properties**

### Required Schemas by Page Type

#### Every Page Must Have:
```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Page Title",
  "description": "Page Description",
  "url": "https://www.orangejelly.co.uk/page",
  "isPartOf": {
    "@type": "WebSite",
    "@id": "https://www.orangejelly.co.uk/#website"
  }
}
```

#### Organization Schema (Site-wide):
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.orangejelly.co.uk/#organization",
  "name": "Orange Jelly Limited",
  "url": "https://www.orangejelly.co.uk",
  "logo": "https://www.orangejelly.co.uk/brand/social-avatar.png",
  "sameAs": ["social media URLs"],
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "GB"
  }
}
```

## 🚀 Performance SEO Standards

### Core Web Vitals Requirements
Every component must meet these thresholds:

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP | <2.5s | 2.5s-4s | >4s |
| INP | <200ms | 200-500ms | >500ms |
| CLS | <0.1 | 0.1-0.25 | >0.25 |

### Component Performance Rules
1. **Images**: Always specify dimensions, use native lazy loading
2. **Fonts**: Preload critical fonts, use font-display: swap
3. **JavaScript**: Minimize bundle size, use dynamic imports
4. **CSS**: Critical CSS inline, non-critical deferred
5. **Third-party**: Load after main content

## 📱 Mobile SEO Requirements

### Mobile-First Standards
- **Touch Targets**: Minimum 44x44px
- **Text Size**: Minimum 16px for body text
- **Viewport**: Proper meta viewport tag
- **Responsive**: All components must be mobile-responsive
- **Speed**: 3G load time under 3 seconds

### Mobile Schema Additions
```json
{
  "potentialAction": {
    "@type": "ViewAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "android-app://com.example/http/example.com/page"
    }
  }
}
```

## ✅ Component Validation Checklist

Before any component is considered complete:

### HTML Validation
- [ ] Valid HTML5 markup
- [ ] Proper heading hierarchy
- [ ] Semantic elements used
- [ ] No deprecated tags
- [ ] Proper nesting

### Schema Validation
- [ ] JSON-LD validates in Google tool
- [ ] All required properties included
- [ ] Proper @type specified
- [ ] Connected with @id where applicable
- [ ] No syntax errors

### Accessibility Validation
- [ ] ARIA labels where needed
- [ ] Alt text on all images
- [ ] Keyboard navigable
- [ ] Screen reader friendly
- [ ] Color contrast passes

### Performance Validation
- [ ] No layout shift
- [ ] Images optimized
- [ ] Lazy loading implemented
- [ ] Bundle size acceptable
- [ ] No render blocking

### Mobile Validation
- [ ] Touch targets 44px+
- [ ] Text readable
- [ ] Responsive design
- [ ] Fast 3G performance
- [ ] No horizontal scroll

## 🔧 Implementation Tools

### Development Tools
- **schema-dts**: TypeScript types for schema.org
- **next-seo**: SEO management for Next.js
- **@vercel/og**: Dynamic OG image generation

### Validation Tools
- **Google Rich Results Test**: Validate schema markup
- **Lighthouse**: Performance and SEO audit
- **Schema Validator**: schema.org validator
- **WAVE**: Accessibility testing
- **Mobile-Friendly Test**: Google's mobile test

### Monitoring Tools
- **Google Search Console**: Monitor search performance
- **Core Web Vitals**: Track real user metrics
- **Structured Data Report**: Schema coverage

## 📊 SEO Component Metrics

Track these for each component:

### Development Metrics
- Schema implementation rate: 100%
- Semantic HTML usage: 100%
- Alt text coverage: 100%
- Performance budget adherence: 100%

### Production Metrics
- Rich snippet eligibility: 90%+
- Core Web Vitals pass rate: 90%+
- Mobile usability: 100%
- Crawl errors: 0

## 🚨 Common SEO Mistakes to Avoid

1. **Missing Alt Text**: Every image needs descriptive alt text
2. **Wrong Heading Order**: Don't skip heading levels
3. **Invalid Schema**: Always validate before deploying
4. **Slow Loading**: Optimize everything
5. **Poor Mobile UX**: Test on real devices
6. **Duplicate Content**: Use canonical URLs
7. **Broken Links**: Regular link audits
8. **Missing Meta**: Every page needs unique meta

---

**Version**: 1.0  
**Updated**: November 2024  
**Standard**: Google Core Web Vitals + Schema.org 2024