# Blog Content

This directory contains markdown files for blog posts and articles.

## Structure
- Individual blog post files should be named with slugs (e.g., `how-to-increase-pub-sales.md`)
- Each file should include frontmatter with metadata like title, description, publication date, author, and categories
- Images for blog posts should be referenced from `/public/images/blog/`

## File Format
Blog posts should follow this frontmatter structure:

```markdown
---
title: "Blog Post Title"
description: "SEO-friendly description"
publishedAt: "2024-01-01"
author: "Author Name"
category: "Category Name"
featuredImage: "/images/blog/marketing-theme.png"
featured: true/false
image: "/images/blog/filename.svg"
---

# Blog post content starts here...
```

## Migration Notes
- Content will be migrated from Sanity CMS to markdown files
- Existing blog posts are currently managed through Sanity and accessed via `/licensees-guide/` routes