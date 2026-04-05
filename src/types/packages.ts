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
