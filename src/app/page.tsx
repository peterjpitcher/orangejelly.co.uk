import HomePage from './HomePage';
import { AsyncErrorBoundary } from '@/components/ErrorBoundary';
import { generateStaticMetadata } from '@/lib/metadata';

export async function generateMetadata() {
  return generateStaticMetadata({
    title: 'Fill Your Pub with AI-Powered Marketing',
    description:
      'Transform your pub with AI-powered marketing strategies that work. From empty tables to thriving business - proven at The Anchor. Real licensee experience. £75 per hour plus VAT.',
    path: '/',
    keywords: [
      'pub marketing UK',
      'AI pub marketing',
      'fill empty pub tables',
      'pub marketing strategies',
      'increase pub customers',
      'pub social media marketing',
      'pub turnaround',
      'AI marketing for pubs',
    ].join(', '),
    ogImage: '/images/og-default.jpg',
    ogType: 'website',
  });
}

// Local data for homepage
const getLocalHomeData = () => {
  const hero = {
    title: 'Fill Your Pub with AI-Powered Marketing',
    subtitle:
      'Stop struggling with empty tables. We turned The Anchor from failing to thriving using AI marketing strategies that actually work. From one licensee to another - let me show you how.',
    ctaText: 'Get Marketing Help',
    bottomText: '£75 per hour plus VAT • No packages • Real results from real licensees',
  };

  const faqs = [
    {
      question: 'Can I just get a one-off consultation?',
      answer:
        "Of course! Many pubs start with a single consultation to tackle their biggest problem. We charge £75 per hour plus VAT, and there's no minimum commitment. Often, that first session provides enough value to transform your business.",
    },
    {
      question: 'How quickly can Orange Jelly help fill my empty pub?',
      answer:
        "We typically see results within 30 days. Our strategies have been proven at The Anchor where we've turned quiet nights into profitable ones. We use AI-powered marketing that brings customers through the door.",
    },
    {
      question: 'What makes Orange Jelly different from other pub marketing agencies?',
      answer:
        "We actually run a pub - The Anchor in Stanwell Moor. Every strategy we recommend has been tested in our own business first. We're not an agency; I'm a licensee who understands your challenges because I face them too.",
    },
    {
      question: 'What does pub marketing cost with Orange Jelly?',
      answer:
        "We charge £75 per hour plus VAT as a flat rate. I'm always happy to have a free chat first to understand your challenges. All pricing is transparent with no hidden fees, and you only invest in the time you need.",
    },
  ];

  const problems = [
    {
      emoji: '🪑',
      title: 'Empty Tables',
      description: 'Transform quiet nights into busy venues',
      linkHref: '/quiet-midweek-solutions',
    },
    {
      emoji: '📱',
      title: 'Social Media Struggles',
      description: 'Build a following that actually visits',
      linkHref: '/services#social-media-marketing',
    },
    {
      emoji: '🎯',
      title: 'Marketing Confusion',
      description: 'Focus on what actually works',
      linkHref: '/services',
    },
  ];

  const features = [
    {
      icon: '💰',
      title: 'No Agency Fees',
      description: 'Just honest pricing',
    },
    {
      icon: '📅',
      title: 'Results in 30 Days',
      description: 'Proven quick wins with a 30-day turnaround',
    },
    {
      icon: '🛡️',
      title: 'Cost Effective',
      description: 'Less than part-time staff',
    },
    {
      icon: '❤️',
      title: 'Real Licensee',
      description: 'Not just another agency',
    },
    {
      icon: '✅',
      title: '30-Day Game Plan',
      description: 'Structured roadmap that keeps momentum',
    },
    {
      icon: '⭐',
      title: 'Save up to 25 Hours',
      description: 'Every single week reclaimed',
    },
  ];

  const metrics = {
    quizNight: '25-35 people',
    quizNightContext: 'per quiz night (up from 20)',
    foodGP: '71%',
    foodGPContext: 'food GP (up from 58%)',
    socialViews: '60,000-70,000',
    socialViewsContext: 'monthly social media views',
    hoursSaved: '25 hours',
    hoursSavedContext: 'of admin time saved weekly',
  };

  const trustBadges = [
    {
      name: 'BII Featured',
      description: 'Featured in BII Autumn 2025 magazine',
      icon: '🏆',
    },
    {
      name: 'Real Licensees',
      description: 'Active pub operators since 2019',
      icon: '🍺',
    },
    {
      name: 'AI Pioneers',
      description: 'Early AI adopters in hospitality',
      icon: '🤖',
    },
    {
      name: 'Proven Results',
      description: '£75k-£100k value added to our own pub',
      icon: '📈',
    },
  ];

  const siteSettings = {
    title: 'Orange Jelly',
    description: 'Pub marketing that works',
  };

  // Use partnerships from JSON file - import at top level moved inside function to avoid build issues
  const partnershipsData = [
    {
      name: 'Greene King',
      description:
        "We operate The Anchor as a Greene King tenant, sharing our AI innovations with one of the UK's leading pub companies.",
      logoUrl: '/partners/greene-king-logo.png',
      url: 'https://www.greeneking.co.uk/',
    },
    {
      name: 'BII (British Institute of Innkeeping)',
      description:
        'Proud BII members, featured in their Autumn 2025 magazine for our AI innovation in hospitality.',
      logoUrl: '/partners/bii-logo.png',
      url: 'https://www.bii.org/',
    },
  ];
  const partnerships = partnershipsData;

  const trustBarItems = [
    { value: '15-20%', label: 'Covers', subtext: 'Average increase in 6 weeks' },
    { value: '£75/hour', label: 'AI-powered marketing solutions' },
    { value: '30 Days', label: 'Guaranteed turnaround' },
  ];

  const sectionHeadings = {
    problemsHeading: "What's Killing Your Business?",
    solutionsHeading: 'Explore Solutions to Your Biggest Problems',
    resultsHeading: 'Real Results from The Anchor',
    resultsTestimonial:
      "We've added £75,000-£100,000 of value to our business using AI. Our food GP improved from 58% to 71%. Every strategy we share has been proven in our own pub.",
    resultsSubtext:
      "Featured in BII's Autumn 2025 magazine for AI innovation. From quiz nights to tasting events - see how we turned our pub around.",
    resultsButtonText: 'See More Pub Turnarounds',
    calculatorHeading: 'Calculate Your Potential Revenue',
    calculatorSubtext:
      'Every pub is different. See exactly how much more revenue you could generate with proven strategies.',
    aboutHeading: "We're licensees, Just Like You",
    aboutText1:
      "I'm Peter. My husband Billy and I have run The Anchor in Stanwell Moor since March 2019. We faced the same struggles - empty tables, rising costs, fierce competition.",
    aboutText2:
      "Orange Jelly exists because we discovered how AI can add 25 hours of value per week. I've been an early AI adopter since 2021, and now I help other pubs implement the same strategies that transformed our business.",
    aboutButtonText: 'Read Our Full Story →',
    aboutCardText: 'Real pub experience + proven strategies = Orange Jelly',
    aboutCardLabel: 'Proven Daily At',
    ctaBannerHeading: 'Stop Struggling. Start Thriving.',
    ctaBannerText:
      "Tell me what's killing your business. I'll share exactly how we fixed the same problems at The Anchor. Real solutions, no fluff.",
    ctaBannerButton: 'Get Marketing Help',
    faqHeading: 'Frequently Asked Questions',
    finalCtaTitle: 'Ready to Turn Your Pub Around?',
    finalCtaSubtitle:
      "Let's talk about what's really hurting your business. I'll share the exact strategies that saved ours.",
  };

  return {
    hero,
    faqs,
    problems,
    features,
    metrics,
    trustBadges,
    siteSettings,
    partnerships,
    trustBarItems,
    sectionHeadings,
  };
};

// Component that uses local data
function HomePageData() {
  const data = getLocalHomeData();

  return (
    <HomePage
      hero={data.hero}
      faqs={data.faqs}
      problems={data.problems}
      features={data.features}
      metrics={data.metrics}
      trustBadges={data.trustBadges}
      siteSettings={data.siteSettings}
      partnerships={data.partnerships}
      trustBarItems={data.trustBarItems}
      sectionHeadings={data.sectionHeadings}
    />
  );
}

export default function Home() {
  return (
    <AsyncErrorBoundary>
      <HomePageData />
    </AsyncErrorBoundary>
  );
}
