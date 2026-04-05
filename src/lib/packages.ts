// src/lib/packages.ts

import type { Package, Capability, AddOn, ClaimsData, Claim, CaseStudy } from '@/types/packages';

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
