// Contact Information
export const CONTACT = {
  phone: '07990 587315',
  phoneInternational: '+447990587315',
  whatsappNumber: '447990587315',
  email: 'peter@orangejelly.co.uk',
  location: 'Stanwell Moor',
  owner: 'Peter Pitcher',
  responseTime: 'as soon as I can',
} as const;

// Company Information
export const COMPANY = {
  name: 'Orange Jelly',
  tagline: 'Marketing that actually works for busy licensees',
  website: 'https://www.orangejelly.co.uk',
  vatStatus: 'All prices exclude VAT',
} as const;

// Pricing Configuration
export const PRICING = {
  // Hourly Rate - All services billed at this rate
  hourlyRate: {
    amount: 75,
    display: '£75/hour plus VAT',
    description: 'Simple, honest pricing for all services',
  },
} as const;

// Common Messages
export const MESSAGES = {
  // WhatsApp Messages
  whatsapp: {
    default: 'Hi Peter, got time for a quick chat about my pub?',
    services: "Hi Peter, I'd like to chat about your services",
    training: "Hi Peter, I'm interested in AI training for my pub",
    recovery: 'Hi Peter, I need help with my struggling pub',
    blog: 'Hi Peter, I just read your blog post and need help with my pub',
    notListed: 'Hi Peter, I need help with something not on your services list...',
    caseStudies: 'Hi Peter, just read your case studies. Can we chat?',
    lostPage: "Hi Peter, I got lost on your site. Can you help me find what I'm looking for?",
  },

  // Response Times
  response: {
    whatsapp:
      "I personally reply to every message. During service? I'll get back to you after. Otherwise, expect a reply within a few hours",
    email:
      "I personally reply to every message. During service? I'll get back to you after. Otherwise, expect a reply within a few hours",
  },

  // Trust Messages
  trust: {
    timeSaved: 'Time saved promise',
    atLeastFiveHours: 'Save up to 25 Hours',
    thirtyDays: '30 Days',
    noContracts: 'No hidden fees, no long contracts, no surprises',
    noAgencyFees: 'No Agency Fees',
    fromlicensees: 'From Real licensees',
    resultsIn14Days: 'Results in 30 Days',
    costEffective: 'Costs less than a part-time employee',
    coversIncrease: '25-35 Quiz Regulars',
    coversIncreaseLabel: 'Up from 20 people',
    foodGPIncrease: '+8% Food GP',
    foodGPIncreaseLabel: 'Improved profit margins',
    sundayRoastRevenue: '£400+ Weekly',
    sundayRoastRevenueLabel: 'Extra Sunday roast revenue',
  },

  // CTA Messages
  cta: {
    primary: 'Fill Your Pub',
    secondary: 'Get More Customers',
    bookCall: 'Get Help Now',
    tryRiskFree: 'Start Your Turnaround',
    getQuickWins: 'Start Filling Tables',
    seeHow: 'See What Works',
    getHelp: 'Stop Struggling',
  },
} as const;

// Success Metrics (from case studies)
export const SUCCESS_METRICS = {
  theAnchor: {
    revenueIncrease: '£400+',
    averageSpendBefore: '£14.50',
    averageSpendAfter: '£18.50',
    percentageIncrease: '28%',
    description: 'Sunday roast sales up £400+ per week',
  },
  costSavings: {
    identified: '£2,000/month',
    description: 'Identified cost savings through efficiency',
  },
  menuOptimization: {
    spendIncrease: '£4.50',
    description: 'Menu rewrite increased spend per head by £4.50',
  },
} as const;

// Service Features
export const FEATURES = {
  support: [
    'WhatsApp preferred for quick responses',
    'Based in Stanwell Moor, serving pubs across the UK',
    'Run by actual licensees who understand your challenges',
  ],
} as const;

// Quiz Example
export const QUIZ_EXAMPLE = {
  entry: '£2',
  message:
    "QUIZ NIGHT! 8pm start. I've written easier questions this week (I promise 😂). £2 entry, winning team gets a round + the glory. Book a table - kitchen's open til 9!",
} as const;

// URLs
export const URLS = {
  whatsapp: (message: string = MESSAGES.whatsapp.default) =>
    `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`,
  email: `mailto:${CONTACT.email}`,
  phone: `tel:${CONTACT.phoneInternational}`,
} as const;

// Format helpers
export const formatPrice = (amount: number, includeVAT: boolean = true): string => {
  const formatted = `£${amount.toFixed(2).replace(/\.00$/, '')}`;
  return includeVAT ? `${formatted} + VAT` : formatted;
};

export const formatPhoneDisplay = (): string => {
  return `WhatsApp: ${CONTACT.phone}`;
};
