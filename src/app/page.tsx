import HomePage from './HomePage';
import { AsyncErrorBoundary } from '@/components/ErrorBoundary';
import { generateStaticMetadata } from '@/lib/metadata';

export async function generateMetadata() {
  return generateStaticMetadata({
    title: 'Hospitality Marketing Specialist for Pubs, Restaurants & Bars',
    description:
      'Hospitality marketing specialist leveraging AI to deliver great results for pubs, restaurants, and bars. Proven at The Anchor. Real operator experience. £75 per hour plus VAT.',
    path: '/',
    keywords: [
      'hospitality marketing specialist',
      'AI hospitality marketing',
      'pub marketing',
      'restaurant marketing',
      'bar marketing',
      'fill tables',
      'increase bookings',
      'hospitality marketing UK',
    ].join(', '),
    ogImage: '/images/og-default.jpg',
    ogType: 'website',
  });
}

// Local data for homepage
const getLocalHomeData = () => {
  const hero = {
    title: 'Hospitality Marketing Specialist for Pubs, Restaurants & Bars',
    subtitle:
      'Leveraging AI to deliver great results for pubs, restaurants, and bars. We combine technology and creativity to drive growth, fill tables, and save time.',
    ctaText: 'Get Marketing Help',
    bottomText: '£75 per hour plus VAT • No packages • Proven hospitality results',
  };

  const faqs = [
    {
      question: 'Can I just get a one-off consultation?',
      answer:
        "Of course! Many pubs, restaurants, and bars start with a single consultation to tackle their biggest problem. We charge £75 per hour plus VAT, and there's no minimum commitment. Often, that first session provides enough value to transform your business.",
    },
    {
      question: 'How quickly can Orange Jelly help fill my pub, restaurant, or bar?',
      answer:
        'We typically see results within 30 days. Our strategies have been proven at The Anchor and adapted for pubs, restaurants, and bars. We use AI-powered marketing that brings customers through the door.',
    },
    {
      question: 'What makes Orange Jelly different from other hospitality marketing agencies?',
      answer:
        "We actually run a pub - The Anchor in Stanwell Moor. Billy handles day-to-day operations while I handle marketing and business development. Every strategy we recommend has been tested in our own business first. We're not an agency; I'm an operator who understands hospitality challenges because I face them too.",
    },
    {
      question: 'What does hospitality marketing cost with Orange Jelly?',
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
      title: 'Real Hospitality Operator',
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
    quizNight: '25-30 teams',
    quizNightContext: 'regular teams each month',
    foodGP: '£250/week',
    foodGPContext: 'Sunday waste cut',
    socialViews: '60,000-70,000',
    socialViewsContext: 'people reached monthly',
    hoursSaved: 'Up to 25 hours',
    hoursSavedContext: 'saved every week with AI',
  };

  const trustBadges = [
    {
      name: 'BII Featured',
      description: 'Featured in BII Autumn 2025 magazine',
      icon: '🏆',
    },
    {
      name: 'Real Operators',
      description: 'Active hospitality operators since 2019',
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
    description: 'Hospitality marketing that works',
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
    { value: '25 hours/week', label: 'Time saved with AI' },
    { value: '60-70k', label: 'Monthly social reach' },
    { value: '£75/hour', label: 'Hourly support' },
  ];

  const sectionHeadings = {
    problemsHeading: "What's Killing Your Business?",
    solutionsHeading: 'Explore Solutions to Your Biggest Problems',
    resultsHeading: 'Real Results from The Anchor',
    resultsTestimonial:
      "We've added £75,000-£100,000 of value to our business using AI. We cut £250/week in Sunday waste and £4,000+ a month in supplier, rota, and energy costs. Every strategy we share has been proven in our own pub.",
    resultsSubtext:
      "Featured in BII's Autumn 2025 magazine for AI innovation. From quiz nights to tasting events - see how we turned our pub around.",
    resultsButtonText: 'See More Hospitality Turnarounds',
    calculatorHeading: 'Calculate Your Potential Revenue',
    calculatorSubtext:
      'Every pub is different. See exactly how much more revenue you could generate with proven strategies.',
    aboutHeading: 'Innovating at The Anchor',
    aboutText1:
      "I'm Peter. Billy runs The Anchor in Stanwell Moor day-to-day, and I handle marketing and business development around a full-time role. This is my lab – where I combine technology and creativity to solve real hospitality problems.",
    aboutText2:
      "Orange Jelly is the result of that innovation. I'm a Hospitality Marketing Specialist who leverages AI to deliver great results for pubs, restaurants, and bars. I help businesses accelerate success by implementing the same data-driven strategies that transformed our pub.",
    aboutButtonText: 'Read Our Full Story →',
    aboutCardText: 'Real pub experience + proven strategies = Orange Jelly',
    aboutCardLabel: 'Proven Daily At',
    ctaBannerHeading: 'Stop Struggling. Start Thriving.',
    ctaBannerText:
      "Tell me what's killing your business. I'll share exactly how we fixed the same problems at The Anchor. Real solutions, no fluff.",
    ctaBannerButton: 'Get Marketing Help',
    faqHeading: 'Frequently Asked Questions',
    finalCtaTitle: 'Ready to Turn Your Pub, Restaurant, or Bar Around?',
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
