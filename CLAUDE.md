# CLAUDE.md - Universal AI Assistant Development Guide v4.0

**CRITICAL: This file provides comprehensive guidance to AI assistants (Claude, GPT, Copilot, etc.) when working with code in the Orange Jelly repository.**

---

# === PROJECT PROFILE (AI MUST load first) ===
```yaml
name: orangejelly-website
stack: node
runtime: node-20
package_manager: npm

commands:
  install: "npm install"
  build: "npm run build"
  test: "npm test"
  lint: "npm run lint"
  typecheck: "npm run type-check"
  format: "npm run format"
  start: "npm start"
  dev: "npm run dev"

paths:
  src: "./src"
  tests: "./src/test"
  docs: "./docs"
  config: "./"
  content: "./content"

artifacts:
  server: true
  cli: false
  library: false
  frontend: true
  mobile: false
  
quality_bars:
  coverage_min: 80
  complexity_max: 10
  duplication_max: 5
  p95_latency_ms: 300
  error_budget_pct: 1
  bundle_budget_kb: 200
  memory_budget_mb: 512
  
security:
  data_classes: ["public", "internal", "confidential", "pii"]
  secrets_scanning: true
  dependency_check: true
  sast_enabled: true
  
observability:
  logging_level: "info"
  tracing_enabled: true
  metrics_enabled: true
  health_endpoint: "/api/health"
  
release:
  strategy: "manual"
  feature_flags: false
  rollback_window: "30m"
  
conventions:
  naming: "camelCase"
  indent: 2
  quotes: "single"
  semicolons: false

# === ORANGE JELLY SPECIFIC CONFIG ===
business:
  name: "Orange Jelly"
  domain: "orangejelly.co.uk"
  founder: "Peter Pitcher"
  co_owner: "Billy Summers"
  location: "The Anchor, Stanwell Moor, Staines TW19 6AQ"
  founded: "March 5, 2019"
  first_external_client: "September 2025"
  
pricing:
  hourly_rate: "£75 plus VAT"
  packages: true
  packages_from: "£375 plus VAT"
  fixed_prices: true
  guarantee: "30-day"

# Critical business metrics - USE ONLY THESE (canonical SSOT: /CLAIMS.md)
metrics:
  search_visibility: "+828% Google Search visibility"
  table_bookings: "+403% table bookings"
  private_hire: "+567% private hire bookings"
  no_shows: "-89% booking no-shows"
  food_revenue: "+98% food revenue (3 months)"

partnerships:
  greene_king: "Tenant"  # NOT partner
  bii: "Member"
  competition: "30 mins from Wetherspoons"
```

---

## 📑 Document Structure

**Section 1: Core Foundations**
- Project Profile & Configuration ✓
- Agent Behaviour Contract
- Definition of Ready (DoR)
- Definition of Done (DoD)
- Ethics & Safety Stop Conditions

**Section 2: Orange Jelly Specific**
- Component Standards
- Content Rules
- Business Language
- Blog Requirements

**Section 3: Development Workflow**
- Task Complexity Assessment
- Incremental Development Philosophy
- Priority & Focus Management
- Command Adapter Matrix
- Verification Pipeline

**Section 4: AI Optimization**
- Context Window Management
- Prompt Engineering Patterns
- Model-Specific Guidance
- Hallucination Prevention
- Cost Controls

**Section 5: Engineering Standards**
- Non-Functional Requirements
- Resilience Patterns
- Observability Blueprint
- Security & Governance
- API Contracts

**Section 6: Quality Assurance**
- Test Strategy
- Test Data Management
- Performance Validation
- Accessibility Standards
- Regression Prevention

---

## 🤖 Agent Behaviour Contract

### Core Directives
1. **Do ONLY what is asked** - No unsolicited improvements or additions
2. **Ask ONE clarifying question maximum** - If unclear, proceed with safest minimal implementation
3. **Record EVERY assumption** - Document in PR/commit messages
4. **One concern per changeset** - If second concern emerges, park it
5. **Fail safely** - When in doubt, stop and request human approval

### Orange Jelly Specific Rules
6. **Use ONLY real metrics** - See metrics section in project profile
7. **Components only** - Use `<Heading>`, `<Text>`, `<OptimizedImage>` - never raw HTML
8. **Server Components default** - Add `"use client"` only when needed
9. **Blog content is markdown** - Located in `/content/blog/`
10. **Respect business language** - Greene King = Tenant, BII = Member

### Source of Truth Hierarchy
```
1. Project Profile (above)
2. Explicit task instructions  
3. Existing code patterns
4. Industry best practices
5. Framework defaults
```

### Decision Recording
Every non-trivial decision MUST be documented:
```markdown
Decision: [what was decided]
Reason: [why this option]
Alternatives: [what else was considered]
Consequences: [impact and trade-offs]
```

---

## 🏗️ Orange Jelly Component Standards

### Component Props Reference
```typescript
// Heading - NO size/weight props!
<Heading 
  level={1-6}           // Required
  align="left|center|right"
  color="charcoal|orange|teal|white"
  className=""
>

// Text - Max size is 2xl!
<Text
  size="xs|sm|base|lg|xl|2xl"  // NOT 3xl/4xl
  color="charcoal|muted|white"
  weight="normal|medium|semibold|bold"
  align="left|center|right"
>

// OptimizedImage - Alt text REQUIRED
<OptimizedImage
  src="/path"           // Required
  alt="Description"     // Required
  width={800}          // Required
  height={600}         // Required
  priority={true}      // Above-fold only
>

// Button
<Button
  variant="primary|secondary|ghost|outline"
  size="small|medium|large"
  href="/path"         // Makes it a link
  loading={false}
  disabled={false}
  aria-label=""        // Required if icon-only
>
```

### Server vs Client Components
```typescript
// ✅ Server (default - no directive)
export default function Component() {
  const data = await fetchData();
  return <div>{data}</div>;
}

// ✅ Client (only when needed)
"use client";
export default function Interactive() {
  const [state, setState] = useState();
  // Needs: state, effects, browser APIs, onClick
}
```

### File Locations
- **Constants**: `src/lib/constants.ts`
- **Components**: `src/components/`
- **Pages**: `src/app/`
- **Blog**: `/content/blog/` (markdown files)
- **Tests**: `src/test/`
- **Utilities**: `src/lib/`

---

## ✅ Definition of Ready (DoR)

**MANDATORY before ANY coding begins:**

### Requirements Checklist
- [ ] **Problem statement written** - Clear description of issue/need
- [ ] **Success criteria defined** - Measurable definition of "done"
- [ ] **User story clear** - "As a... I want... So that..."
- [ ] **Acceptance criteria listed** - Specific testable requirements

### Technical Checklist  
- [ ] **Inputs/outputs identified** - Data flow documented
- [ ] **Data classes marked** - PII/confidential/internal/public
- [ ] **Dependencies identified** - External services/libraries needed
- [ ] **API contracts defined** - Request/response formats (if applicable)

### Orange Jelly Specific
- [ ] **Real metrics verified** - Using only approved business metrics
- [ ] **Component patterns identified** - Which existing components to use
- [ ] **Content tone appropriate** - Encouraging, solution-focused for struggling licensees

### Risk & Quality Checklist
- [ ] **Failure modes listed** - What can go wrong?
- [ ] **Rollback strategy defined** - How to undo if needed
- [ ] **Test oracle defined** - What proves it works?
- [ ] **Performance targets set** - LCP < 2.5s, INP < 200ms, CLS < 0.1
- [ ] **Security requirements clear** - Auth/authz/encryption needs

---

## 🎯 Definition of Done (DoD)

**A feature is ONLY complete when ALL items pass:**

### Code Quality Gates
- ✅ **Builds successfully** - `npm run build` with no errors
- ✅ **All tests pass** - Unit, integration, and e2e tests green
- ✅ **Coverage meets minimum** - 80% coverage target
- ✅ **No linting errors** - Clean `npm run lint`
- ✅ **Type checks pass** - `npm run type-check` clean
- ✅ **Complexity within limits** - Per quality_bars.complexity_max

### Orange Jelly Quality Gates
- ✅ **Component standards followed** - Using approved components only
- ✅ **Mobile-first tested** - Works on all viewport sizes
- ✅ **Accessibility verified** - WCAG 2.1 AA compliant
- ✅ **Real metrics only** - No false/inflated numbers
- ✅ **Business language correct** - Proper terminology used

### Security Gates
- ✅ **No hardcoded secrets** - Verified by scanning
- ✅ **Dependencies secure** - No critical vulnerabilities
- ✅ **Input validation complete** - All user inputs sanitized
- ✅ **Auth checks in place** - Proper authorization verified

### Performance Gates (Core Web Vitals 2025)
- ✅ **LCP < 2.5s** - Largest Contentful Paint
- ✅ **INP < 200ms** - Interaction to Next Paint
- ✅ **CLS < 0.1** - Cumulative Layout Shift
- ✅ **TTFB < 600ms** - Time to First Byte
- ✅ **Bundle < 200KB** - JavaScript compressed
- ✅ **CSS < 50KB** - Stylesheets compressed

### Documentation Gates
- ✅ **Code commented** - Complex logic explained
- ✅ **API documented** - OpenAPI/comments as appropriate
- ✅ **README updated** - If new setup/config needed
- ✅ **ADR written** - For significant decisions

---

## 🛑 Ethics & Safety Stop Conditions

### HARD STOP - Require Human Approval
**AI MUST stop and request explicit approval before:**

1. **Data Destruction Risk**
   - Any operation that could DELETE user data
   - Schema migrations that drop columns/tables
   - Bulk update operations affecting > 1000 records
   - Removing blog posts or case studies

2. **Security Degradation**
   - Disabling authentication/authorization
   - Removing encryption
   - Exposing internal APIs publicly
   - Handling PII data (pub owner details)

3. **Business Risk**
   - Changing pricing information
   - Modifying core business metrics
   - Altering partnership descriptions
   - Publishing false claims about competitors

4. **Legal/Compliance Risk**
   - Using GPL/AGPL code in proprietary projects
   - Violating GDPR with user data handling
   - Making health/safety claims without evidence
   - Using copyrighted images without license

5. **Availability Risk**
   - Changes that could cause > 1 minute downtime
   - Modifications to payment processing
   - Database migrations on production
   - Rate limit changes that could cause DoS

### Orange Jelly Specific Stop Conditions
6. **Content Integrity Risk**
   - Publishing content that could harm pub reputation
   - Making promises Orange Jelly can't deliver
   - Using metrics not in approved list
   - Creating content that contradicts Peter's values

---

## 📝 Blog Article Creation Guide

### Step 1: Article File Creation
Create markdown file in `/content/blog/` with kebab-case slug:
```
/content/blog/your-article-slug.md
```

### Step 2: Required Frontmatter
```yaml
---
title: "Question-Based Title That Addresses Pain Point"
slug: your-article-slug  # Must match filename
excerpt: "150-160 character summary for search results and social shares"
publishedDate: 2025-01-27  # Always Monday for consistency
status: draft  # draft → published when ready
author:
  name: Peter Pitcher
  bio: Founder of Orange Jelly, helping UK pubs increase revenue through proven strategies
featured: false  # Only true for top articles
category: Revenue Growth  # or Operations, Marketing, Staff Management
tags:
  - Tag 1
  - Tag 2
  - Tag 3
quickAnswer: "40-60 word direct answer to the title question. Critical for voice search and featured snippets. Get straight to the point with actionable advice."
voiceSearchQueries:
  - "natural question people would ask"
  - "another voice search variation"
  - "how to [solve specific problem]"
faqs:
  - question: "Specific question with good keywords?"
    answer: "Clear, comprehensive answer that could stand alone. Include specific numbers and examples. 2-3 sentences minimum."
  - question: "Another common question?"
    answer: "Detailed answer with actionable advice."
  - question: "Third question minimum?"
    answer: "Voice-optimized answer that directly addresses the query."
localSEO:
  - UK pub specific term
  - British hospitality keyword
  - Local business variation
ctaSettings:
  ctaType: "calculator"  # or "contact", "services"
  ctaHeading: "Calculate Your Potential"
  ctaDescription: "See how much you could gain"
  ctaButtonText: "Start Calculating"
  ctaButtonLink: "#roi-calculator"
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "Your article title"
  "description": "Article description"
  "author":
    "@type": "Person"
    "name": "Peter Pitcher"
---
```

### Step 3: Content Structure
```markdown
[Opening Hook - 2-3 paragraphs]
- Start with empathy for their problem
- Share relatable example or shocking statistic
- Promise specific solution

## The Real Problem
- Define the core issue clearly
- Explain why traditional approaches fail
- Set up your solution as different

## Solution Section 1
### Subsection with Specific Tactic
- Detailed implementation steps
- Real numbers and examples
- Address objections immediately

## Solution Section 2
### Another Specific Approach
- Build on previous section
- Add complexity gradually
- Include Peter's experience from The Anchor

## Solution Section 3
### Advanced Strategy
- Higher-level implementation
- Multiplication effects
- Long-term benefits

## Your Action Plan
### Week 1: Foundation
- Monday: Specific task
- Tuesday: Next task
- Wednesday: Implementation
- Thursday: Testing
- Friday: Refinement

### Week 2: Momentum
- Detailed daily actions
- Measurable milestones
- Quick wins to maintain motivation

## Results You Can Expect
### Immediate (Week 1)
- Specific, measurable outcome
- Customer feedback examples
- Revenue/profit impact

### Month 1
- Larger improvements
- System establishment
- Team adoption

### Month 3-6
- Transformation complete
- Cultural change
- Sustained results

## Common Objections Solved
**"My customers won't..."**
[Solution with example]

**"I don't have time..."**
[Time-saving approach]

**"What if it doesn't work..."**
[Risk mitigation/guarantee]

## The Bottom Line
- Summarize key transformation
- Reinforce ease of implementation
- Call to action with specific first step
- End with encouragement
```

### Step 4: Create Featured Image
Create SVG in `/public/images/blog/your-article-slug.svg`:
```svg
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#EA580C"/>
  <text x="600" y="315" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="white">
    Short Punchy Title
  </text>
  <text x="600" y="380" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="white" opacity="0.8">
    Orange Jelly Limited
  </text>
</svg>
```

Colors to use:
- Orange: `#EA580C` (primary brand)
- Teal: `#006064` (secondary)
- Red-Orange: `#FF6B35` (accent)

### Step 5: Add Image Mapping
Update `/src/lib/blog-images.ts`:
```typescript
const imageMap: Record<string, string> = {
  // ... existing mappings
  'your-article-slug': '/images/blog/your-article-slug.svg',
};
```

### Step 6: Quality Checklist
- [ ] **Title**: Question-based, addresses specific pain point
- [ ] **Word count**: 1,500-3,000 words (aim for 2,000+)
- [ ] **Quick Answer**: 40-60 words, direct and actionable
- [ ] **FAQs**: Minimum 3, voice-search optimized
- [ ] **Real metrics**: Only use approved business metrics
- [ ] **Examples**: Include The Anchor experiences
- [ ] **Tone**: Encouraging, solution-focused, empathetic
- [ ] **Structure**: Problem → Solutions → Action → Results
- [ ] **CTAs**: Clear next steps throughout
- [ ] **Mobile**: Check formatting on mobile viewport
- [ ] **SVG**: Created and mapped correctly
- [ ] **Build**: Run `npm run build` to verify

### Step 7: Publishing Process
1. Set `status: "published"` in frontmatter
2. Set `publishedDate` to upcoming Monday
3. Commit with message: `feat(blog): add article - [title]`
4. Push to main branch
5. Verify on production site

### Content Guidelines
- **Voice**: Conversational, like advising a friend
- **Perspective**: "You" focused, not "we" 
- **Examples**: Specific numbers, not vague claims
- **Problems**: Address real struggles, not theoretical
- **Solutions**: Practical, implementable today
- **Proof**: Use Peter's real results from The Anchor
- **Length**: Comprehensive but scannable (use headers)
- **Keywords**: Natural placement, not forced

### SEO Optimization
- **URL slug**: Keep short, include main keyword
- **Title**: 50-60 characters, question format
- **Meta description**: Use excerpt, 150-160 chars
- **Headers**: H2 for main sections, H3 for subsections
- **Internal links**: Link to related articles/services
- **Quick Answer**: Featured snippet optimization
- **FAQs**: Target "People also ask" boxes
- **Local**: Include UK-specific terms

---

## 📊 Command Adapter Matrix

### Orange Jelly Specific Commands
| Intent | Command | Description |
|--------|---------|-------------|
| **Install** | `npm install` | Install dependencies |
| **Build** | `npm run build` | Production build |
| **Test** | `npm test` | Run Vitest tests |
| **Lint** | `npm run lint` | ESLint check |
| **Format** | `npm run format` | Prettier format |
| **Type Check** | `npm run type-check` | TypeScript validation |
| **Run Dev** | `npm run dev` | Start Next.js dev server |
| **Search Build** | `npm run build:search` | Build search index |
| **Feed Build** | `npm run build:feeds` | Generate RSS/JSON feeds |
| **Full Build** | `npm run build:all` | Search + feeds + build |

---

## 🔍 Task Complexity Assessment

### Complexity Scoring Matrix
| Factor | Weight | Score 1 | Score 3 | Score 5 |
|--------|--------|---------|---------|---------|
| **Files Modified** | 2x | 1 file | 2-5 files | 6+ files |
| **Lines of Code** | 1x | < 50 | 50-200 | > 200 |
| **External Dependencies** | 3x | None | 1-2 | 3+ |
| **Data Migration** | 5x | None | Schema change | Data transform |
| **Breaking Changes** | 4x | None | Internal only | Public API |
| **Security Surface** | 3x | None | Auth check | New auth flow |
| **Business Impact** | 4x | None | Internal | Customer-facing |

### Complexity Response Protocol
```
Total Score = Σ(Factor Weight × Factor Score)

0-10 points:  SIMPLE → Implement directly
11-30 points: MEDIUM → Break into 2-3 subtasks  
31-50 points: COMPLEX → Require design doc first
51+ points:   EPIC → Decompose into multiple PRs
```

---

## 🏗️ Incremental Development Protocol

### The 3-Change Rule
**NEVER make more than 3 changes without validation**

```bash
change_count = 0
WHILE work_remaining:
  make_single_atomic_change()
  change_count++
  
  IF change_count >= 3:
    run_validation_suite()
    commit_if_green()
    change_count = 0
```

### Validation Suite (Orange Jelly)
```bash
# 1. Type Check
npm run type-check || exit 1

# 2. Lint Check
npm run lint || exit 1

# 3. Test Check
npm test || exit 1

# 4. Build Check
npm run build || exit 1

# 5. Security Check
grep -r "password\|secret\|key" --exclude-dir=.git . || true

# 6. Business Metrics Check
# Verify no false metrics in changes

# 7. Commit if all pass
git add -A && git commit -m "checkpoint: ${description}"
```

---

## 🛡️ Non-Functional Requirements (NFR) Pack

### 1. Reliability Requirements
```yaml
availability_target: 99.9%
recovery_time_objective: < 5 minutes
recovery_point_objective: < 1 hour
data_durability: 99.999999999%

patterns_required:
  - Retry with exponential backoff
  - Circuit breaker for external calls
  - Graceful degradation
  - Health checks
  - Timeout on all I/O
```

### 2. Performance Requirements  
```yaml
response_time:
  p50: < 100ms
  p95: < 300ms
  p99: < 1000ms

core_web_vitals:
  lcp: < 2.5s
  inp: < 200ms
  cls: < 0.1
  ttfb: < 600ms

resource_limits:
  js_bundle: < 200KB
  css_bundle: < 50KB
  images: < 100KB each
  total_page: < 1MB
```

### 3. Security Requirements
```yaml
authentication: NextAuth.js
authorization: Role-based (admin, user)
encryption:
  at_rest: AES-256
  in_transit: TLS 1.3+
  
input_validation:
  - Zod schemas for all inputs
  - Sanitize user content
  - No SQL, use Prisma/ORM
  - CSP headers configured
  
secrets_management:
  - Use .env.local
  - Never commit secrets
  - Rotate every 90 days
```

### 4. Accessibility Requirements
```yaml
standard: WCAG 2.1 Level AA
requirements:
  - Keyboard navigation for all features
  - Screen reader compatibility  
  - Color contrast ratio ≥ 4.5:1
  - Focus indicators visible
  - Alt text for all images
  - ARIA labels where needed
  - Skip navigation links
  - Mobile-first responsive design
  - Touch targets ≥ 44×44px
```

---

## 📡 Observability Blueprint

### Structured Logging Standard
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "INFO|WARN|ERROR|DEBUG",
  "service": "orangejelly-website",
  "trace_id": "uuid-v4",
  "span_id": "uuid-v4",
  "user_id_hash": "sha256(user_id)",
  "event": "descriptive.event.name",
  "data_class": "public|internal|confidential|pii",
  "duration_ms": 123,
  "error": null,
  "metadata": {}
}
```

### Health Check Endpoints
```yaml
/api/health:  # Liveness - is service running?
  response: {"status": "ok"}
  checks: []

/api/ready:   # Readiness - can service handle traffic?
  response: {"status": "ok", "checks": {...}}
  checks:
    - database connectivity
    - build successful
    - disk space > 10%
    - memory usage < 90%
```

---

## 🧪 Test Strategy & Data Management

### Test Pyramid Distribution
```
       /\        5% - E2E Tests (Critical user journeys)
      /  \
     /    \     15% - Integration Tests (API, DB)
    /      \
   /        \   30% - Component Tests (Modules)
  /          \
 /____________\ 50% - Unit Tests (Functions, Classes)
```

### Orange Jelly Test Patterns
```typescript
// Test behavior, not implementation
it('subscribes user to newsletter', async () => {
  const user = userEvent.setup();
  render(<NewsletterForm />);
  
  await user.type(
    screen.getByLabelText(/email/i),
    'pub@example.com'
  );
  await user.click(screen.getByRole('button'));
  
  expect(await screen.findByText(/thanks/i))
    .toBeInTheDocument();
});
```

### Test Data Values
```yaml
test_pubs:
  name: "The Test Arms"
  owner: "Test Landlord"
  email: "test@pub.example"
  
test_metrics:
  quiz_night: "25 regulars"
  food_gp: "70%"
  value_added: "£75K"
```

---

## 🚀 Release Management & Rollback

### Release Gate Checklist
```yaml
pre_release_gates:
  - [ ] All tests passing
  - [ ] Security scan clean
  - [ ] Performance benchmarks met
  - [ ] Real metrics verified
  - [ ] Content tone appropriate
  - [ ] Documentation updated
  - [ ] Build successful
  - [ ] Mobile tested

deployment:
  platform: Vercel
  branch: main
  preview_branches: all
  rollback: Vercel dashboard or Git revert
```

---

## 📋 PR/Change Templates

### Pull Request Template
```markdown
## What Changed
[1-2 sentences describing the change]

## Why
[Link to issue/ticket and brief context]

## Type of Change
- [ ] Bug fix (non-breaking)
- [ ] New feature (non-breaking)
- [ ] Content update
- [ ] Performance improvement
- [ ] Refactoring

## Orange Jelly Checklist
- [ ] Real metrics only used
- [ ] Component standards followed
- [ ] Mobile-first tested
- [ ] Accessibility verified
- [ ] No false claims

## Testing Evidence
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] Build passes
- [ ] Type check passes
- [ ] Lint clean

## Deployment Notes
[Any special deployment steps or considerations]
```

---

## 🔄 Verification Pipeline

### Orange Jelly Pipeline
```yaml
pipeline:
  1_typecheck:
    command: npm run type-check
    fail_fast: true
    
  2_lint:
    command: npm run lint
    fail_fast: true
    
  3_test:
    command: npm test
    fail_fast: true
    coverage_threshold: 80
    
  4_build:
    command: npm run build
    fail_fast: true
    
  5_bundle_check:
    command: check bundle size < 200KB
    fail_threshold: true
    
  6_accessibility:
    command: check WCAG compliance
    fail_fast: false
```

---

## 🎯 Quick Reference

### Key Utilities
- **cn()**: Class name merger
- **generateMetadata()**: SEO helper
- **readMarkdownFile()**: Blog post reader
- **getBlogImageSrc()**: Image resolution

### Decision Framework
Ask yourself:
1. Would this help a struggling licensee?
2. Can Peter stand behind this claim?
3. Is the code maintainable?
4. Does it maintain performance?

If any answer is "no", reconsider.

### Important Links
- [React Docs](https://react.dev)
- [Next.js 14](https://nextjs.org/docs)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [Testing Library](https://testing-library.com)
- [Vitest](https://vitest.dev)

---

## 🚦 Quick Reference Card

### Before Starting ANY Task
```bash
1. Load Project Profile (top of this doc)
2. Check Definition of Ready
3. Verify using real metrics only
4. Review component standards
5. Create checkpoint: git commit -m "checkpoint: before [task]"
```

### During Development Loop
```bash
while not_done:
  1. Make 1-3 atomic changes
  2. Run: npm run type-check
  3. Run: npm run lint
  4. Run: npm test
  5. If all pass: git commit -m "checkpoint: [description]"
  6. If > 1 hour: document progress
```

### Before Marking Complete
```bash
1. Run full verification pipeline
2. Check all quality gates
3. Verify real metrics only
4. Test mobile responsiveness
5. Update documentation
6. Create PR with template
```

---

## 📜 Universal Principles Summary

### The 10 Commandments of Orange Jelly Development
1. **Thou shalt use only real, verified business metrics**
2. **Thou shalt follow component standards strictly**
3. **Thou shalt default to server components**
4. **Thou shalt test mobile-first always**
5. **Thou shalt ensure accessibility WCAG 2.1 AA**
6. **Thou shalt help struggling licensees with empathy**
7. **Thou shalt maintain < 2.5s LCP performance**
8. **Thou shalt document all decisions**
9. **Thou shalt commit secrets never**
10. **Thou shalt respect Peter's business values**

---

**Version**: 4.1.0 (Orange Jelly Edition)
**Last Updated**: 2025-01-23
**Status**: Production Ready
**Business**: Helping UK pubs thrive with proven solutions

**Remember**: You're helping struggling licensees with proven solutions. Quality > Speed. Real Metrics > Marketing Fluff.

---

*End of Document*
