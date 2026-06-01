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
  it('should load 11 capabilities', () => {
    const capabilities = getCapabilities();
    expect(capabilities).toHaveLength(11);
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
  it('should load 5 claims', () => {
    const claims = getClaims();
    expect(claims).toHaveLength(5);
  });

  it('should find food-revenue by ID', () => {
    const claim = getClaimById('food-revenue');
    expect(claim).toBeDefined();
    expect(claim!.displayShort).toContain('98%');
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
