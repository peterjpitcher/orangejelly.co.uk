# Commercial Transformation — Plan A: Foundation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build all data files, TypeScript types, and reusable components needed for the package-led commercial model. No public-facing changes.

**Architecture:** JSON data files in `content/data/` feed Server Components that read at build time. All components are Server Components unless they need interactivity (PackageComparison mobile toggle). Types defined in `src/types/packages.ts`. Components live in `src/components/packages/`.

**Tech Stack:** Next.js App Router, TypeScript (strict), Tailwind CSS, Vitest, Lucide React icons

**Spec:** `docs/superpowers/specs/2026-04-05-commercial-transformation-design.md`

---

## File Map

### New Files to Create

```
src/types/packages.ts                          — TypeScript types for all package data models
content/data/packages.json                     — 4 packages with full inclusion logic
content/data/capabilities.json                 — 10 capabilities with per-package support levels
content/data/add-ons.json                      — 7 add-on items
content/data/claims.json                       — 8 governed metrics + governance metadata
content/data/case-studies.json                 — 3 case studies with challenge/action/result
src/lib/packages.ts                            — Data loading helpers for package JSON files
src/components/packages/Claim.tsx              — Renders governed metric by ID
src/components/packages/CaseStudyCard.tsx      — Renders case study card or full narrative
src/components/packages/PackageCard.tsx         — Summary card for Ways to Work page
src/components/packages/PackageCTA.tsx          — WhatsApp primary + form secondary, package-aware
src/components/packages/PackageDetail.tsx       — Full four-layer breakdown template
src/components/packages/PackageComparison.tsx   — Progressive comparison table/cards
src/components/packages/CapabilityGrid.tsx      — 10-capability icon grid
src/components/packages/ProofStrip.tsx          — Horizontal governed metrics strip
src/components/packages/PaymentPlanBanner.tsx   — Payment plan messaging
src/components/packages/AddOnList.tsx           — Separately available services
src/components/packages/ContentBoundaries.tsx   — Three-layer content model visual
src/components/packages/index.ts               — Barrel export
src/test/packages/Claim.test.tsx               — Tests for Claim component
src/test/packages/PackageCard.test.tsx          — Tests for PackageCard component
src/test/packages/packages-data.test.ts        — Data validation tests
```

### Files to Modify (Later — Phases 2-4, not this plan)

```
content/data/navigation.json                   — New nav structure (prepared in this plan, deployed in Plan B)
content/data/footer.json                       — New footer structure (prepared in this plan, deployed in Plan B)
src/lib/constants.ts                           — PRICING constant update (Plan B)
```

---

## Task 1: TypeScript Types

**Files:**
- Create: `src/types/packages.ts`

- [ ] **Step 1: Create the types file**

```typescript
// src/types/packages.ts

export type SupportLevel = 'included' | 'light-touch' | 'add-on' | 'not-included';

export type PriceType = 'one-off' | 'monthly' | 'custom';

export interface PackagePrice {
  amount: number | null;
  display: string;
  type: PriceType;
}

export interface PackageProcess {
  step: number;
  title: string;
  description: string;
}

export interface PaymentPlan {
  available: boolean;
  copy: string;
  cardCopy: string;
}

export interface Package {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  price: PackagePrice;
  hours: string;
  badge: string | null;
  bestFor: string[];
  included: string[];
  lightTouch: string[];
  addOns: string[];
  notIncluded: string[];
  process: PackageProcess[];
  paymentPlan: PaymentPlan;
  ctaWhatsApp: string;
  relatedProof: string[];
  relatedCaseStudies: string[];
  sortOrder: number;
  visible: boolean;
}

export interface Capability {
  id: string;
  name: string;
  shortDescription: string;
  icon: string;
  defaultSupportLevel: Record<string, SupportLevel>;
  exampleOutcomes: string[];
  sortOrder: number;
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  whoFor: string;
  priceNote: string;
  relatedPackages: string[];
  sortOrder: number;
}

export interface Claim {
  id: string;
  metric: string;
  context: string;
  displayShort: string;
  displayLong: string;
  source: string;
  lastVerified: string;
  category: string;
  relatedPackages: string[];
  relatedCapabilities: string[];
}

export interface ClaimsGovernance {
  reviewFrequency: string;
  lastFullReview: string;
  approvedBy: string;
}

export interface ClaimsData {
  claims: Claim[];
  governance: ClaimsGovernance;
}

export interface CaseStudy {
  id: string;
  title: string;
  challenge: string;
  action: string;
  result: string;
  metrics: string[];
  relatedPackages: string[];
  relatedCapabilities: string[];
}
```

- [ ] **Step 2: Verify types compile**

Run: `npx tsc --noEmit`
Expected: No errors from the new file.

- [ ] **Step 3: Commit**

```bash
git add src/types/packages.ts
git commit -m "feat: add TypeScript types for package commercial model"
```

---

## Task 2: Data Loading Helpers

**Files:**
- Create: `src/lib/packages.ts`

- [ ] **Step 1: Create the data loader**

```typescript
// src/lib/packages.ts

import type {
  Package,
  Capability,
  AddOn,
  ClaimsData,
  Claim,
  CaseStudy,
} from '@/types/packages';

import packagesData from '../../content/data/packages.json';
import capabilitiesData from '../../content/data/capabilities.json';
import addOnsData from '../../content/data/add-ons.json';
import claimsData from '../../content/data/claims.json';
import caseStudiesData from '../../content/data/case-studies.json';

// Packages
export function getPackages(): Package[] {
  return (packagesData as Package[])
    .filter((p) => p.visible)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getPackageBySlug(slug: string): Package | undefined {
  return (packagesData as Package[]).find((p) => p.slug === slug && p.visible);
}

export function getPackageById(id: string): Package | undefined {
  return (packagesData as Package[]).find((p) => p.id === id && p.visible);
}

// Capabilities
export function getCapabilities(): Capability[] {
  return (capabilitiesData as Capability[]).sort((a, b) => a.sortOrder - b.sortOrder);
}

// Add-ons
export function getAddOns(): AddOn[] {
  return (addOnsData as AddOn[]).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getAddOnsForPackage(packageId: string): AddOn[] {
  return getAddOns().filter((a) => a.relatedPackages.includes(packageId));
}

// Claims
export function getClaims(): Claim[] {
  return (claimsData as ClaimsData).claims;
}

export function getClaimById(id: string): Claim | undefined {
  return (claimsData as ClaimsData).claims.find((c) => c.id === id);
}

export function getClaimsGovernance(): ClaimsData['governance'] {
  return (claimsData as ClaimsData).governance;
}

// Case Studies
export function getCaseStudies(): CaseStudy[] {
  return caseStudiesData as CaseStudy[];
}

export function getCaseStudyById(id: string): CaseStudy | undefined {
  return (caseStudiesData as CaseStudy[]).find((cs) => cs.id === id);
}

export function getCaseStudiesForPackage(packageId: string): CaseStudy[] {
  return getCaseStudies().filter((cs) => cs.relatedPackages.includes(packageId));
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/packages.ts
git commit -m "feat: add data loading helpers for package model"
```

Note: This file will not compile until the JSON data files exist (Task 3). That is expected.

---

## Task 3: Create All JSON Data Files

**Files:**
- Create: `content/data/packages.json`
- Create: `content/data/capabilities.json` (this file is already specced in the design doc — use the complete version from Section 7)
- Create: `content/data/add-ons.json` (complete version from Section 7)
- Create: `content/data/claims.json` (complete version with all 8 metrics from Section 7)
- Create: `content/data/case-studies.json` (complete version from Section 7)

- [ ] **Step 1: Create packages.json**

Create `content/data/packages.json` with all 4 packages. The complete data for Growth Fix is in the spec (Section 7). The other 3 packages follow the same structure — populate from the inclusion logic in Section 4:

Key differences per package:
- **Momentum Month:** `price.amount: 900`, `price.display: "£900 + VAT /month"`, `price.type: "monthly"`, `hours: "12 hours /month"`, `badge: null`, process from Section 6 process content
- **Growth Partner:** `price.amount: 1800`, `price.display: "£1,800 + VAT /month"`, `price.type: "monthly"`, `hours: "24 hours /month"`, `badge: "Most Popular"`, process from Section 6
- **Turnaround Intensive:** `price.amount: null`, `price.display: "Pricing confirmed after diagnostic"`, `price.type: "custom"`, `hours: "30-day sprint"`, `badge: "Premium"`, process from Section 6

Populate `included`, `lightTouch`, `addOns`, `notIncluded` arrays from the spec Section 4 inclusion logic for each package.

- [ ] **Step 2: Create capabilities.json**

Copy the complete 10-capability JSON from the spec Section 7. All entries with Lucide icon names, support levels, and example outcomes are already defined.

- [ ] **Step 3: Create add-ons.json**

Copy the complete 7-item JSON from the spec Section 7.

- [ ] **Step 4: Create claims.json**

Copy the complete 8-metric JSON with governance block from the spec Section 7.

- [ ] **Step 5: Create case-studies.json**

Copy the complete 3-case-study JSON from the spec Section 7.

- [ ] **Step 6: Verify data loads**

Run: `npx tsc --noEmit`
Expected: No errors. The data loader in `src/lib/packages.ts` should resolve all JSON imports.

- [ ] **Step 7: Commit**

```bash
git add content/data/packages.json content/data/capabilities.json content/data/add-ons.json content/data/claims.json content/data/case-studies.json
git commit -m "feat: add package model data files — packages, capabilities, add-ons, claims, case studies"
```

---

## Task 4: Data Validation Tests

**Files:**
- Create: `src/test/packages/packages-data.test.ts`

- [ ] **Step 1: Write data validation tests**

```typescript
// src/test/packages/packages-data.test.ts

import { describe, it, expect } from 'vitest';
import {
  getPackages,
  getPackageBySlug,
  getCapabilities,
  getAddOns,
  getClaims,
  getClaimById,
  getCaseStudies,
} from '@/lib/packages';

describe('packages.json', () => {
  it('should load 4 visible packages', () => {
    const packages = getPackages();
    expect(packages).toHaveLength(4);
  });

  it('should have required fields on every package', () => {
    const packages = getPackages();
    for (const pkg of packages) {
      expect(pkg.id).toBeTruthy();
      expect(pkg.name).toBeTruthy();
      expect(pkg.slug).toBeTruthy();
      expect(pkg.price.display).toBeTruthy();
      expect(pkg.bestFor.length).toBeGreaterThan(0);
      expect(pkg.included.length).toBeGreaterThan(0);
      expect(pkg.process.length).toBeGreaterThanOrEqual(3);
      expect(pkg.ctaWhatsApp).toBeTruthy();
    }
  });

  it('should find growth-partner by slug', () => {
    const pkg = getPackageBySlug('growth-partner');
    expect(pkg).toBeDefined();
    expect(pkg!.badge).toBe('Most Popular');
  });

  it('should handle Turnaround Intensive null price amount', () => {
    const pkg = getPackageBySlug('turnaround-intensive');
    expect(pkg).toBeDefined();
    expect(pkg!.price.amount).toBeNull();
    expect(pkg!.price.display).toContain('diagnostic');
  });

  it('should return undefined for non-existent slug', () => {
    const pkg = getPackageBySlug('non-existent');
    expect(pkg).toBeUndefined();
  });
});

describe('capabilities.json', () => {
  it('should load 10 capabilities', () => {
    const capabilities = getCapabilities();
    expect(capabilities).toHaveLength(10);
  });

  it('should have support levels for all 4 packages', () => {
    const capabilities = getCapabilities();
    const packageIds = ['growth-fix', 'momentum-month', 'growth-partner', 'turnaround-intensive'];
    for (const cap of capabilities) {
      for (const pkgId of packageIds) {
        expect(cap.defaultSupportLevel[pkgId]).toBeDefined();
        expect(['included', 'light-touch', 'add-on', 'not-included']).toContain(
          cap.defaultSupportLevel[pkgId]
        );
      }
    }
  });
});

describe('add-ons.json', () => {
  it('should load 7 add-ons', () => {
    const addOns = getAddOns();
    expect(addOns).toHaveLength(7);
  });

  it('should have relatedPackages on every add-on', () => {
    const addOns = getAddOns();
    for (const addOn of addOns) {
      expect(addOn.relatedPackages.length).toBeGreaterThan(0);
    }
  });
});

describe('claims.json', () => {
  it('should load 8 claims', () => {
    const claims = getClaims();
    expect(claims).toHaveLength(8);
  });

  it('should find food-gp-growth by ID', () => {
    const claim = getClaimById('food-gp-growth');
    expect(claim).toBeDefined();
    expect(claim!.displayShort).toContain('58%');
  });

  it('should return undefined for non-existent claim', () => {
    const claim = getClaimById('non-existent');
    expect(claim).toBeUndefined();
  });
});

describe('case-studies.json', () => {
  it('should load 3 case studies', () => {
    const caseStudies = getCaseStudies();
    expect(caseStudies).toHaveLength(3);
  });

  it('should have challenge, action, result on every case study', () => {
    const caseStudies = getCaseStudies();
    for (const cs of caseStudies) {
      expect(cs.challenge).toBeTruthy();
      expect(cs.action).toBeTruthy();
      expect(cs.result).toBeTruthy();
    }
  });
});
```

- [ ] **Step 2: Run tests**

Run: `npm test -- src/test/packages/packages-data.test.ts`
Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/test/packages/packages-data.test.ts
git commit -m "test: add data validation tests for package model"
```

---

## Task 5: Claim Component

**Files:**
- Create: `src/components/packages/Claim.tsx`
- Create: `src/test/packages/Claim.test.tsx`

- [ ] **Step 1: Write the failing test**

```typescript
// src/test/packages/Claim.test.tsx

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Claim } from '@/components/packages/Claim';

describe('Claim', () => {
  it('should render displayShort by default', () => {
    render(<Claim id="food-gp-growth" />);
    expect(screen.getByText(/58%/)).toBeTruthy();
  });

  it('should render displayLong when variant is long', () => {
    render(<Claim id="food-gp-growth" variant="long" />);
    expect(screen.getByText(/Grew food gross profit/)).toBeTruthy();
  });

  it('should render metric only when variant is metric-only', () => {
    render(<Claim id="food-gp-growth" variant="metric-only" />);
    expect(screen.getByText('58% → 71%')).toBeTruthy();
  });

  it('should render nothing for non-existent ID', () => {
    const { container } = render(<Claim id="non-existent" />);
    expect(container.innerHTML).toBe('');
  });

  it('should show source when showSource is true', () => {
    render(<Claim id="food-gp-growth" showSource />);
    expect(screen.getByText(/The Anchor trading records/)).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/test/packages/Claim.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the component**

```typescript
// src/components/packages/Claim.tsx

import { getClaimById } from '@/lib/packages';

interface ClaimProps {
  id: string;
  variant?: 'short' | 'long' | 'metric-only';
  showSource?: boolean;
  className?: string;
}

export function Claim({
  id,
  variant = 'short',
  showSource = false,
  className,
}: ClaimProps): React.ReactElement | null {
  const claim = getClaimById(id);

  if (!claim) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Claim] No claim found for id: "${id}"`);
    }
    return null;
  }

  const text =
    variant === 'long'
      ? claim.displayLong
      : variant === 'metric-only'
        ? claim.metric
        : claim.displayShort;

  if (variant === 'long') {
    return (
      <p className={className}>
        {text}
        {showSource && (
          <span className="text-sm text-muted ml-1">(Source: {claim.source})</span>
        )}
      </p>
    );
  }

  return (
    <span className={className}>
      {text}
      {showSource && (
        <span className="text-sm text-muted ml-1">(Source: {claim.source})</span>
      )}
    </span>
  );
}
```

- [ ] **Step 4: Run tests**

Run: `npm test -- src/test/packages/Claim.test.tsx`
Expected: All 5 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/packages/Claim.tsx src/test/packages/Claim.test.tsx
git commit -m "feat: add Claim component for governed metrics display"
```

---

## Task 6: CaseStudyCard Component

**Files:**
- Create: `src/components/packages/CaseStudyCard.tsx`

- [ ] **Step 1: Implement the component**

```typescript
// src/components/packages/CaseStudyCard.tsx

import { getCaseStudyById } from '@/lib/packages';
import { Heading } from '@/components/Heading';
import { Text } from '@/components/Text';
import { Card } from '@/components/Card';
import { Claim } from './Claim';

interface CaseStudyCardProps {
  id: string;
  variant?: 'card' | 'full';
  className?: string;
}

export function CaseStudyCard({
  id,
  variant = 'card',
  className,
}: CaseStudyCardProps): React.ReactElement | null {
  const caseStudy = getCaseStudyById(id);

  if (!caseStudy) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[CaseStudyCard] No case study found for id: "${id}"`);
    }
    return null;
  }

  if (variant === 'card') {
    return (
      <Card className={className}>
        <Heading level={4} className="mb-2">
          {caseStudy.title}
        </Heading>
        <Text color="muted" className="mb-4">
          {caseStudy.result}
        </Text>
        <div className="flex flex-wrap gap-2">
          {caseStudy.metrics.map((metricId) => (
            <span
              key={metricId}
              className="inline-block bg-orange/10 text-orange px-3 py-1 rounded-full text-sm font-medium"
            >
              <Claim id={metricId} variant="short" />
            </span>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <Heading level={3} className="mb-4">
        {caseStudy.title}
      </Heading>
      <div className="space-y-4">
        <div>
          <Text weight="semibold" className="mb-1">
            Challenge
          </Text>
          <Text color="muted">{caseStudy.challenge}</Text>
        </div>
        <div>
          <Text weight="semibold" className="mb-1">
            What we did
          </Text>
          <Text color="muted">{caseStudy.action}</Text>
        </div>
        <div>
          <Text weight="semibold" className="mb-1">
            Result
          </Text>
          <Text color="muted">{caseStudy.result}</Text>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {caseStudy.metrics.map((metricId) => (
          <span
            key={metricId}
            className="inline-block bg-orange/10 text-orange px-3 py-1 rounded-full text-sm font-medium"
          >
            <Claim id={metricId} variant="short" />
          </span>
        ))}
      </div>
    </Card>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/packages/CaseStudyCard.tsx
git commit -m "feat: add CaseStudyCard component for proof display"
```

---

## Task 7: PackageCard Component

**Files:**
- Create: `src/components/packages/PackageCard.tsx`
- Create: `src/test/packages/PackageCard.test.tsx`

- [ ] **Step 1: Write the failing test**

```typescript
// src/test/packages/PackageCard.test.tsx

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PackageCard } from '@/components/packages/PackageCard';

describe('PackageCard', () => {
  it('should render package name and price', () => {
    render(<PackageCard packageId="growth-fix" />);
    expect(screen.getByText('Growth Fix')).toBeTruthy();
    expect(screen.getByText(/£375/)).toBeTruthy();
  });

  it('should show Most Popular badge for growth-partner', () => {
    render(<PackageCard packageId="growth-partner" highlighted />);
    expect(screen.getByText('Most Popular')).toBeTruthy();
  });

  it('should show payment plan copy', () => {
    render(<PackageCard packageId="growth-fix" />);
    expect(screen.getByText(/Payment plans available/)).toBeTruthy();
  });

  it('should handle null price gracefully for turnaround', () => {
    render(<PackageCard packageId="turnaround-intensive" />);
    expect(screen.getByText(/diagnostic/)).toBeTruthy();
  });

  it('should render nothing for non-existent package', () => {
    const { container } = render(<PackageCard packageId="non-existent" />);
    expect(container.innerHTML).toBe('');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/test/packages/PackageCard.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement the component**

```typescript
// src/components/packages/PackageCard.tsx

import { getPackageById } from '@/lib/packages';
import { Heading } from '@/components/Heading';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { cn } from '@/lib/utils';

interface PackageCardProps {
  packageId: string;
  highlighted?: boolean;
  className?: string;
}

export function PackageCard({
  packageId,
  highlighted = false,
  className,
}: PackageCardProps): React.ReactElement | null {
  const pkg = getPackageById(packageId);

  if (!pkg) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[PackageCard] No package found for id: "${packageId}"`);
    }
    return null;
  }

  return (
    <div
      className={cn(
        'flex flex-col rounded-2xl border p-6 h-full',
        highlighted
          ? 'border-orange bg-orange/5 ring-2 ring-orange shadow-lg relative'
          : 'border-gray-200 bg-white',
        className
      )}
    >
      {pkg.badge && (
        <span className="inline-block self-start rounded-full bg-orange px-3 py-1 text-xs font-semibold text-white mb-4">
          {pkg.badge}
        </span>
      )}

      <Heading level={3} className="mb-1">
        {pkg.name}
      </Heading>

      <Text color="muted" size="sm" className="mb-4">
        {pkg.shortDescription}
      </Text>

      <div className="mb-4">
        <Text size="2xl" weight="bold" className="block">
          {pkg.price.display}
        </Text>
        <Text size="sm" color="muted">
          {pkg.hours}
        </Text>
      </div>

      <div className="mb-6 flex-1">
        <Text weight="semibold" size="sm" className="mb-2 block">
          Best for:
        </Text>
        <ul className="space-y-1">
          {pkg.bestFor.slice(0, 4).map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-charcoal/80">
              <span className="text-orange mt-0.5 shrink-0">&#10003;</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {pkg.paymentPlan.available && (
        <Text size="xs" color="muted" className="mb-4 text-center">
          {pkg.paymentPlan.cardCopy}
        </Text>
      )}

      <Button
        href={`/ways-to-work/${pkg.slug}`}
        variant={highlighted ? 'primary' : 'outline'}
        size="medium"
        className="w-full"
      >
        Learn more
      </Button>
    </div>
  );
}
```

- [ ] **Step 4: Run tests**

Run: `npm test -- src/test/packages/PackageCard.test.tsx`
Expected: All 5 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/packages/PackageCard.tsx src/test/packages/PackageCard.test.tsx
git commit -m "feat: add PackageCard component with progressive disclosure"
```

---

## Task 8: PackageCTA Component

**Files:**
- Create: `src/components/packages/PackageCTA.tsx`

- [ ] **Step 1: Implement the component**

```typescript
// src/components/packages/PackageCTA.tsx

import { getPackageById } from '@/lib/packages';
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { CONTACT } from '@/lib/constants';

interface PackageCTAProps {
  packageId?: string;
  className?: string;
}

export function PackageCTA({
  packageId,
  className,
}: PackageCTAProps): React.ReactElement {
  const pkg = packageId ? getPackageById(packageId) : undefined;
  const whatsappMessage = pkg?.ctaWhatsApp || "Hi Peter, I'd like to find out about your packages.";
  const whatsappUrl = `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  const contactUrl = pkg ? `/contact?package=${pkg.slug}` : '/contact';

  return (
    <div className={className}>
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
        <Button href={whatsappUrl} variant="primary" size="large" external>
          Message Peter on WhatsApp
        </Button>
        <Button href={contactUrl} variant="outline" size="large">
          Send an enquiry
        </Button>
      </div>
      <Text size="xs" color="muted" align="center" className="mt-3">
        Prefer email? Use the enquiry form. Peter responds as quickly as he can.
      </Text>
    </div>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/packages/PackageCTA.tsx
git commit -m "feat: add PackageCTA with WhatsApp primary and form secondary"
```

---

## Task 9: PackageDetail Component

**Files:**
- Create: `src/components/packages/PackageDetail.tsx`

- [ ] **Step 1: Implement the component**

```typescript
// src/components/packages/PackageDetail.tsx

import { getPackageBySlug, getAddOns, getCaseStudiesForPackage } from '@/lib/packages';
import { Heading } from '@/components/Heading';
import { Text } from '@/components/Text';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { CaseStudyCard } from './CaseStudyCard';
import { PackageCTA } from './PackageCTA';
import { PaymentPlanBanner } from './PaymentPlanBanner';

interface PackageDetailProps {
  slug: string;
}

export function PackageDetail({ slug }: PackageDetailProps): React.ReactElement | null {
  const pkg = getPackageBySlug(slug);

  if (!pkg) return null;

  const relatedCaseStudies = getCaseStudiesForPackage(pkg.id);
  const allAddOns = getAddOns();
  const packageAddOns = allAddOns.filter((a) => pkg.addOns.includes(a.id));

  return (
    <>
      {/* Hero */}
      <Section className="bg-white pt-16 pb-12">
        <Container>
          {pkg.badge && (
            <span className="inline-block rounded-full bg-orange px-4 py-1 text-sm font-semibold text-white mb-4">
              {pkg.badge}
            </span>
          )}
          <Heading level={1} className="mb-2">
            {pkg.name}
          </Heading>
          <Text size="xl" color="muted" className="mb-4">
            {pkg.shortDescription}
          </Text>
          <div className="mb-6">
            <Text size="2xl" weight="bold">
              {pkg.price.display}
            </Text>
            <Text color="muted" className="ml-2">
              {pkg.hours}
            </Text>
          </div>
          <div className="mb-8">
            <Text weight="semibold" className="mb-2 block">
              Best for:
            </Text>
            <ul className="space-y-1">
              {pkg.bestFor.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-orange mt-0.5 shrink-0">&#10003;</span>
                  <Text>{item}</Text>
                </li>
              ))}
            </ul>
          </div>
          {pkg.paymentPlan.available && (
            <Text size="sm" color="muted" className="mb-6">
              {pkg.paymentPlan.copy}
            </Text>
          )}
          <PackageCTA packageId={pkg.id} />
        </Container>
      </Section>

      {/* Included */}
      <Section className="bg-cream py-12">
        <Container>
          <Heading level={2} className="mb-6">
            What&apos;s included
          </Heading>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pkg.included.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="text-green-600 mt-0.5 shrink-0 text-lg">&#10003;</span>
                <Text>{item}</Text>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Light-touch */}
      {pkg.lightTouch.length > 0 && (
        <Section className="bg-white py-12">
          <Container>
            <Heading level={2} className="mb-2">
              Light-touch support
            </Heading>
            <Text color="muted" className="mb-6">
              We&apos;ll guide you on these, but won&apos;t manage them at full depth.
            </Text>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pkg.lightTouch.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-amber-500 mt-0.5 shrink-0">&#9679;</span>
                  <Text color="muted">{item}</Text>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* Add-ons */}
      {packageAddOns.length > 0 && (
        <Section className="bg-cream py-12">
          <Container>
            <Heading level={2} className="mb-2">
              Available as add-ons
            </Heading>
            <Text color="muted" className="mb-6">
              Need more? These can be added separately.
            </Text>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {packageAddOns.map((addOn) => (
                <Card key={addOn.id} className="p-4">
                  <Text weight="semibold">{addOn.name}</Text>
                  <Text size="sm" color="muted">
                    {addOn.description}
                  </Text>
                </Card>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Not included */}
      {pkg.notIncluded.length > 0 && (
        <Section className="bg-white py-12">
          <Container>
            <Heading level={2} className="mb-2">
              To keep this package focused
            </Heading>
            <Text color="muted" className="mb-6">
              These are outside scope unless separately agreed.
            </Text>
            <ul className="space-y-2">
              {pkg.notIncluded.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-gray-300 mt-0.5 shrink-0">&mdash;</span>
                  <Text color="muted">{item}</Text>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* How it works */}
      <Section className="bg-cream py-12">
        <Container>
          <Heading level={2} className="mb-8">
            How it works
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pkg.process.map((step) => (
              <div key={step.step}>
                <span className="inline-block w-8 h-8 rounded-full bg-orange text-white text-sm font-bold flex items-center justify-center mb-3">
                  {step.step}
                </span>
                <Text weight="semibold" className="mb-1 block">
                  {step.title}
                </Text>
                <Text size="sm" color="muted">
                  {step.description}
                </Text>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Proof */}
      {relatedCaseStudies.length > 0 && (
        <Section className="bg-white py-12">
          <Container>
            <Heading level={2} className="mb-6">
              Results from The Anchor
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedCaseStudies.slice(0, 2).map((cs) => (
                <CaseStudyCard key={cs.id} id={cs.id} variant="card" />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Payment plan */}
      {pkg.paymentPlan.available && (
        <PaymentPlanBanner />
      )}

      {/* Final CTA */}
      <Section className="bg-charcoal py-16">
        <Container>
          <Heading level={2} align="center" color="white" className="mb-4">
            Ready to get started?
          </Heading>
          <Text align="center" color="white" className="mb-8 max-w-2xl mx-auto">
            Message Peter directly or send an enquiry. No obligation, no sales pitch — just a
            conversation about what your venue needs.
          </Text>
          <PackageCTA packageId={pkg.id} />
        </Container>
      </Section>
    </>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: Will show an error for `PaymentPlanBanner` import — this is expected. The component is created in Task 12. Skip the compile check for now; it will pass after Task 12.

- [ ] **Step 3: Commit**

```bash
git add src/components/packages/PackageDetail.tsx
git commit -m "feat: add PackageDetail template with four-layer breakdown"
```

---

## Task 10: PackageComparison Component

**Files:**
- Create: `src/components/packages/PackageComparison.tsx`

- [ ] **Step 1: Implement the component**

```typescript
// src/components/packages/PackageComparison.tsx

'use client';

import { useState } from 'react';
import { getPackages, getCapabilities } from '@/lib/packages';
import { Heading } from '@/components/Heading';
import { Text } from '@/components/Text';
import { cn } from '@/lib/utils';
import type { SupportLevel } from '@/types/packages';

const levelConfig: Record<SupportLevel, { label: string; color: string; icon: string }> = {
  included: { label: 'Included', color: 'text-green-600', icon: '✓' },
  'light-touch': { label: 'Light-touch', color: 'text-amber-500', icon: '●' },
  'add-on': { label: 'Add-on', color: 'text-gray-400', icon: '+' },
  'not-included': { label: '—', color: 'text-gray-300', icon: '—' },
};

function SupportBadge({ level }: { level: SupportLevel }): React.ReactElement {
  const config = levelConfig[level];
  return (
    <span className={cn('flex items-center gap-1 text-sm', config.color)}>
      <span>{config.icon}</span>
      <span className="hidden sm:inline">{config.label}</span>
    </span>
  );
}

interface PackageComparisonProps {
  className?: string;
}

export function PackageComparison({ className }: PackageComparisonProps): React.ReactElement {
  const packages = getPackages();
  const capabilities = getCapabilities();
  const [activePackage, setActivePackage] = useState<string>(packages[0]?.id || '');

  return (
    <div className={className}>
      {/* Desktop: Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 pr-4 text-sm font-semibold text-charcoal w-1/4">Capability</th>
              {packages.map((pkg) => (
                <th
                  key={pkg.id}
                  className={cn(
                    'py-3 px-4 text-sm font-semibold text-center',
                    pkg.badge === 'Most Popular' ? 'text-orange' : 'text-charcoal'
                  )}
                >
                  {pkg.name}
                  {pkg.badge === 'Most Popular' && (
                    <span className="block text-xs font-normal text-orange">Most Popular</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {capabilities.map((cap) => (
              <tr key={cap.id} className="border-b border-gray-100">
                <td className="py-3 pr-4">
                  <Text weight="medium" size="sm">
                    {cap.name}
                  </Text>
                </td>
                {packages.map((pkg) => (
                  <td key={pkg.id} className="py-3 px-4 text-center">
                    <SupportBadge
                      level={cap.defaultSupportLevel[pkg.id] as SupportLevel}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: Tabbed cards */}
      <div className="md:hidden">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {packages.map((pkg) => (
            <button
              key={pkg.id}
              type="button"
              onClick={() => setActivePackage(pkg.id)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                activePackage === pkg.id
                  ? 'bg-orange text-white'
                  : 'bg-gray-100 text-charcoal'
              )}
            >
              {pkg.name}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {capabilities.map((cap) => {
            const level = cap.defaultSupportLevel[activePackage] as SupportLevel;
            return (
              <div key={cap.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                <Text size="sm">{cap.name}</Text>
                <SupportBadge level={level} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

Note: This is a `'use client'` component because it uses `useState` for mobile tab switching.

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/packages/PackageComparison.tsx
git commit -m "feat: add PackageComparison with desktop table and mobile tabs"
```

---

## Task 11: CapabilityGrid Component

**Files:**
- Create: `src/components/packages/CapabilityGrid.tsx`

- [ ] **Step 1: Implement the component**

```typescript
// src/components/packages/CapabilityGrid.tsx

import { getCapabilities } from '@/lib/packages';
import { Text } from '@/components/Text';
import {
  Target,
  Calendar,
  Share2,
  TrendingUp,
  PenTool,
  Camera,
  MapPin,
  Monitor,
  BarChart2,
  BookOpen,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  target: Target,
  calendar: Calendar,
  'share-2': Share2,
  'trending-up': TrendingUp,
  'pen-tool': PenTool,
  camera: Camera,
  'map-pin': MapPin,
  monitor: Monitor,
  'bar-chart-2': BarChart2,
  'book-open': BookOpen,
};

interface CapabilityGridProps {
  className?: string;
  compact?: boolean;
}

export function CapabilityGrid({
  className,
  compact = false,
}: CapabilityGridProps): React.ReactElement {
  const capabilities = getCapabilities();

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${compact ? '5' : '3'} gap-${compact ? '4' : '6'} ${className || ''}`}
    >
      {capabilities.map((cap) => {
        const IconComponent = iconMap[cap.icon] || Target;
        return (
          <div key={cap.id} className="flex items-start gap-3">
            <div className="shrink-0 w-10 h-10 rounded-lg bg-orange/10 flex items-center justify-center">
              <IconComponent className="w-5 h-5 text-orange" />
            </div>
            <div>
              <Text weight="semibold" size="sm" className="block">
                {cap.name}
              </Text>
              {!compact && (
                <Text size="xs" color="muted">
                  {cap.shortDescription}
                </Text>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Install lucide-react if not already present**

Run: `npm ls lucide-react 2>/dev/null || npm install lucide-react`

- [ ] **Step 3: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/packages/CapabilityGrid.tsx
git commit -m "feat: add CapabilityGrid with Lucide icons"
```

---

## Task 12: Remaining Components

**Files:**
- Create: `src/components/packages/ProofStrip.tsx`
- Create: `src/components/packages/PaymentPlanBanner.tsx`
- Create: `src/components/packages/AddOnList.tsx`
- Create: `src/components/packages/ContentBoundaries.tsx`

- [ ] **Step 1: ProofStrip**

```typescript
// src/components/packages/ProofStrip.tsx

import { Claim } from './Claim';

interface ProofStripProps {
  claimIds: string[];
  className?: string;
}

export function ProofStrip({ claimIds, className }: ProofStripProps): React.ReactElement {
  return (
    <div className={`bg-charcoal py-6 ${className || ''}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {claimIds.map((id) => (
            <div key={id} className="text-white">
              <span className="block text-2xl font-bold">
                <Claim id={id} variant="metric-only" className="text-orange" />
              </span>
              <span className="block text-sm text-white/70">
                <Claim id={id} variant="short" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: PaymentPlanBanner**

```typescript
// src/components/packages/PaymentPlanBanner.tsx

import { Heading } from '@/components/Heading';
import { Text } from '@/components/Text';
import { Section } from '@/components/Section';
import { Container } from '@/components/Container';

interface PaymentPlanBannerProps {
  className?: string;
}

export function PaymentPlanBanner({ className }: PaymentPlanBannerProps): React.ReactElement {
  return (
    <Section className={`bg-teal/5 py-12 ${className || ''}`}>
      <Container>
        <div className="text-center max-w-2xl mx-auto">
          <Heading level={3} className="mb-3">
            Flexible payment options available
          </Heading>
          <Text color="muted">
            We want to make support accessible. If you need to spread the cost, ask Peter about
            payment plans when you get in touch. No judgement, no fuss.
          </Text>
        </div>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 3: AddOnList**

```typescript
// src/components/packages/AddOnList.tsx

import { getAddOns } from '@/lib/packages';
import { Text } from '@/components/Text';
import { Card } from '@/components/Card';

interface AddOnListProps {
  packageId?: string;
  className?: string;
}

export function AddOnList({ packageId, className }: AddOnListProps): React.ReactElement {
  const addOns = getAddOns();
  const filtered = packageId
    ? addOns.filter((a) => a.relatedPackages.includes(packageId))
    : addOns;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className || ''}`}>
      {filtered.map((addOn) => (
        <Card key={addOn.id} className="p-5">
          <Text weight="semibold" className="mb-1 block">
            {addOn.name}
          </Text>
          <Text size="sm" color="muted" className="mb-2">
            {addOn.description}
          </Text>
          <Text size="xs" color="muted">
            {addOn.priceNote}
          </Text>
        </Card>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: ContentBoundaries**

```typescript
// src/components/packages/ContentBoundaries.tsx

import { Heading } from '@/components/Heading';
import { Text } from '@/components/Text';

interface ContentBoundariesProps {
  className?: string;
}

export function ContentBoundaries({ className }: ContentBoundariesProps): React.ReactElement {
  const layers = [
    {
      title: 'Strategy',
      color: 'bg-green-50 border-green-200',
      badge: 'Included in packages',
      badgeColor: 'bg-green-100 text-green-700',
      items: [
        'Campaign direction',
        'Content themes and shot lists',
        'Creative prompts and caption guidance',
        'Review of client-shot content',
        'Content priorities tied to commercial outcomes',
      ],
    },
    {
      title: 'Light Production',
      color: 'bg-amber-50 border-amber-200',
      badge: 'Limited inclusion where listed',
      badgeColor: 'bg-amber-100 text-amber-700',
      items: [
        'Small amounts of editing',
        'Repurposing client-shot assets',
        'Limited content shaping within package hours',
      ],
    },
    {
      title: 'Production',
      color: 'bg-red-50 border-red-200',
      badge: 'Always separately scoped',
      badgeColor: 'bg-red-100 text-red-700',
      items: [
        'Filming and photography',
        'Heavy editing and post-production',
        'Large asset batches',
        'Daily posting and scheduling',
        'Community management',
      ],
    },
  ];

  return (
    <div className={className}>
      <Heading level={3} className="mb-6">
        How content creation works
      </Heading>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {layers.map((layer) => (
          <div key={layer.title} className={`rounded-xl border p-5 ${layer.color}`}>
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium mb-3 ${layer.badgeColor}`}>
              {layer.badge}
            </span>
            <Text weight="semibold" className="mb-3 block">
              {layer.title}
            </Text>
            <ul className="space-y-1">
              {layer.items.map((item) => (
                <li key={item} className="text-sm text-charcoal/70">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Verify all compile**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/packages/ProofStrip.tsx src/components/packages/PaymentPlanBanner.tsx src/components/packages/AddOnList.tsx src/components/packages/ContentBoundaries.tsx
git commit -m "feat: add ProofStrip, PaymentPlanBanner, AddOnList, ContentBoundaries components"
```

---

## Task 13: Barrel Export

**Files:**
- Create: `src/components/packages/index.ts`

- [ ] **Step 1: Create barrel export**

```typescript
// src/components/packages/index.ts

export { Claim } from './Claim';
export { CaseStudyCard } from './CaseStudyCard';
export { PackageCard } from './PackageCard';
export { PackageCTA } from './PackageCTA';
export { PackageDetail } from './PackageDetail';
export { PackageComparison } from './PackageComparison';
export { CapabilityGrid } from './CapabilityGrid';
export { ProofStrip } from './ProofStrip';
export { PaymentPlanBanner } from './PaymentPlanBanner';
export { AddOnList } from './AddOnList';
export { ContentBoundaries } from './ContentBoundaries';
```

- [ ] **Step 2: Commit**

```bash
git add src/components/packages/index.ts
git commit -m "feat: add barrel export for package components"
```

---

## Task 14: Prepare Navigation and Footer JSON

These files are prepared but NOT deployed until the atomic launch (Plan B).

**Files:**
- Create: `content/data/navigation-new.json` (staged — not replacing current file yet)
- Create: `content/data/footer-new.json` (staged — not replacing current file yet)

- [ ] **Step 1: Create navigation-new.json**

Use the exact JSON structure from the spec Section 5 "Navigation JSON" block. Write to `navigation-new.json` to avoid affecting the live site.

- [ ] **Step 2: Create footer-new.json**

Use the exact JSON structure from the spec Section 5 "Footer" block. Preserve the `businessName`, `contact`, `company`, `social`, and `copyright` fields from the existing `footer.json` — only replace `links.*`.

- [ ] **Step 3: Commit**

```bash
git add content/data/navigation-new.json content/data/footer-new.json
git commit -m "chore: prepare new navigation and footer data for atomic launch"
```

---

## Task 15: Full Build Verification

- [ ] **Step 1: Run lint**

Run: `npm run lint`
Expected: Zero errors, zero warnings.

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit`
Expected: Clean compilation.

- [ ] **Step 3: Run all tests**

Run: `npm test`
Expected: All tests pass including new package data and component tests.

- [ ] **Step 4: Run build**

Run: `npm run build`
Expected: Successful production build. New components are tree-shaken since no page imports them yet.

- [ ] **Step 5: Commit any fixes**

If any step above required fixes, commit them:
```bash
git add -A
git commit -m "fix: resolve lint/type/build issues in package foundation"
```

---

## Phase 1 Complete

All data files, types, and components are built and tested. No public-facing changes have been made. The site continues to operate with the old commercial model.

**Next:** Plan B (Atomic Launch) builds the new pages, rewrites existing pages, sets up redirects, and deploys everything together.
