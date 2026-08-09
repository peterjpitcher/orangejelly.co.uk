# FAQs Content

This directory contains markdown files for frequently asked questions organised by topic or service area.

## Structure
- FAQ files should be organised by category (e.g., `general.md`, `services.md`, `pricing.md`)
- Each file contains related FAQs for easier management and faster loading
- Cross-references between FAQ categories should use relative links

## File Format
FAQ files should follow this frontmatter structure:

```markdown
---
title: "FAQ Category Title"
description: "Description of what these FAQs cover"
category: "general|services|pricing|technical"
order: 1
---

## Question 1

Answer to question 1...

## Question 2

Answer to question 2...
```

## Migration Notes
- Content will be migrated from Sanity CMS to markdown files
- Existing FAQs are currently managed through Sanity backend
- FAQs appear on various pages including services, contact, and about pages
- Consider SEO benefits of FAQ schema markup when implementing