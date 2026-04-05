import { CONTACT, MESSAGES } from '@/lib/constants';

// WhatsApp URL helper
export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

// CTA types for the sticky bar
export type CtaType = 'link' | 'whatsapp';

export interface StickyBarConfig {
  message: string;
  ctaText: string;
  ctaLink: string;
  ctaType: CtaType;
}

// Paths where the sticky bar should be hidden
export const STICKY_BAR_HIDDEN_PATHS = [
  '/contact',
  '/ways-to-work/growth-fix',
  '/ways-to-work/momentum-month',
  '/ways-to-work/growth-partner',
  '/ways-to-work/turnaround-intensive',
] as const;

// Paths where the exit-intent modal should NOT fire
export const EXIT_INTENT_EXCLUDED_PATHS = ['/contact', '/ways-to-work'] as const;

// Path-to-message mapping for the sticky bar
export function getStickyBarConfig(pathname: string): StickyBarConfig {
  // Exact match: homepage
  if (pathname === '/') {
    return {
      message: 'Packages from \u00A3375 + VAT \u2014 no retainer',
      ctaText: 'See Packages',
      ctaLink: '/ways-to-work',
      ctaType: 'link',
    };
  }

  // Exact match: /ways-to-work
  if (pathname === '/ways-to-work') {
    return {
      message: 'Not sure which package? Ask Peter',
      ctaText: 'Ask Peter',
      ctaLink: getWhatsAppUrl(MESSAGES.whatsapp.services),
      ctaType: 'whatsapp',
    };
  }

  // Starts with /licensees-guide/ (but not just /licensees-guide)
  if (pathname.startsWith('/licensees-guide/') && pathname !== '/licensees-guide/') {
    return {
      message: 'Want help putting this into practice?',
      ctaText: 'See Our Packages',
      ctaLink: '/ways-to-work',
      ctaType: 'link',
    };
  }

  // Starts with /capabilities
  if (pathname.startsWith('/capabilities')) {
    return {
      message: 'Find the right level of support',
      ctaText: 'Compare Packages',
      ctaLink: '/ways-to-work',
      ctaType: 'link',
    };
  }

  // /pub-marketing-agency
  if (pathname.startsWith('/pub-marketing-agency')) {
    return {
      message: 'See how we work with pubs like yours',
      ctaText: 'Our Packages',
      ctaLink: '/ways-to-work',
      ctaType: 'link',
    };
  }

  // /results
  if (pathname.startsWith('/results')) {
    return {
      message: 'Want results like these?',
      ctaText: 'Talk to Peter',
      ctaLink: getWhatsAppUrl(MESSAGES.whatsapp.caseStudies),
      ctaType: 'whatsapp',
    };
  }

  // Problem/rescue pages
  const problemPaths = [
    '/fix-my-pub',
    '/empty-pub-solutions',
    '/pub-rescue',
    '/quiet-midweek',
    '/compete-with',
    '/pub-marketing-no-budget',
  ];
  if (problemPaths.some((p) => pathname.startsWith(p))) {
    return {
      message: "We can help. Let's talk.",
      ctaText: 'Message Peter',
      ctaLink: getWhatsAppUrl(MESSAGES.whatsapp.recovery),
      ctaType: 'whatsapp',
    };
  }

  // /about
  if (pathname.startsWith('/about')) {
    return {
      message: 'Ready to start a conversation?',
      ctaText: 'Get in Touch',
      ctaLink: '/contact',
      ctaType: 'link',
    };
  }

  // Default
  return {
    message: 'Packages from \u00A3375 + VAT',
    ctaText: 'Learn More',
    ctaLink: '/ways-to-work',
    ctaType: 'link',
  };
}

// Exit-intent problem statements
export interface ProblemOption {
  text: string;
  href: string;
}

export const PROBLEM_OPTIONS: ProblemOption[] = [
  {
    text: "My tables are empty and I don't know how to fill them",
    href: '/ways-to-work/growth-fix',
  },
  {
    text: "I'm drowning in costs and my margins are disappearing",
    href: '/ways-to-work/growth-partner',
  },
  {
    text: "I don't have time to sort marketing \u2014 I'm too busy running the pub",
    href: '/ways-to-work/momentum-month',
  },
  {
    text: 'I just need someone to tell me what to do first',
    href: '/ways-to-work/growth-fix',
  },
];
