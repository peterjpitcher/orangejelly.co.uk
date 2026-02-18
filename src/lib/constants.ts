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
  tagline: 'Transformative, action-first marketing for hospitality partners',
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
    default: "Hi Peter, I'd like help building momentum for my venue.",
    services: "Hi Peter, I'd like to discuss your hospitality growth services.",
    training: "Hi Peter, I'm interested in practical AI workflows for my venue.",
    recovery: 'Hi Peter, I need help improving trade and momentum at my venue.',
    blog: "Hi Peter, I just read your guide and I'd like help applying it.",
    notListed: 'Hi Peter, I need help with something not on your services list...',
    caseStudies: 'Hi Peter, just read your results from The Anchor. Can we chat?',
    lostPage: 'Hi Peter, I got lost on your site. Can you point me in the right direction?',
  },

  // Response Times
  response: {
    whatsapp: "Message me anytime and I'll reply as quickly as I can around service.",
    email: "Message me anytime and I'll reply as quickly as I can around service.",
  },

  // Trust Messages
  trust: {
    timeSaved: 'Growth capacity promise',
    atLeastFiveHours: 'Transform 25 hours into growth',
    thirtyDays: '30 Days',
    noContracts: 'No hidden fees, no long contracts, no surprises',
    noAgencyFees: 'No Agency Fees',
    fromlicensees: 'Small Team Support',
    resultsIn14Days: 'Results in 30 Days',
    costEffective: '£75/hour plus VAT',
    coversIncrease: '25-30 Quiz Teams',
    coversIncreaseLabel: 'Regular teams each month',
    foodGPIncrease: '£250/week waste cut',
    foodGPIncreaseLabel: '90% reduction in food waste',
    sundayRoastRevenue: '£4,000+ monthly margin growth',
    sundayRoastRevenueLabel: 'Supplier, rota, energy margin gains',
  },

  // CTA Messages
  cta: {
    primary: "Let's Build Momentum",
    secondary: 'Get More Bookings',
    bookCall: 'Start a Growth Chat',
    tryRiskFree: 'Build Momentum',
    getQuickWins: 'Start With Quick Wins',
    seeHow: 'See Measurable Results',
    getHelp: 'Get Action-First Support',
  },
} as const;

// Success Metrics (from case studies)
export const SUCCESS_METRICS = {
  timeSaved: {
    value: 'Up to 25 hours',
    description: 'Weekly growth hours activated using AI systems',
  },
  wasteSavings: {
    value: '£250/week',
    description: 'Sunday food waste reduction',
  },
  monthlySavings: {
    value: '£4,000+/month',
    description: 'Supplier, rota, and energy margin growth',
  },
  valueAdded: {
    value: '£75k-£100k',
    description: 'Estimated business value added with AI',
  },
} as const;

// Service Features
export const FEATURES = {
  support: [
    'WhatsApp preferred for quick responses',
    'Based in Stanwell Moor, supporting hospitality partners across the UK',
    'Run by operators who understand trading pressure firsthand',
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
