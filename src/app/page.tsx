import HomePage from './HomePage';
import { AsyncErrorBoundary } from '@/components/ErrorBoundary';
import { generateStaticMetadata } from '@/lib/metadata';

export async function generateMetadata() {
  return generateStaticMetadata({
    title: 'Transformative Marketing for Hospitality Partners',
    description:
      'Orange Jelly accelerates hospitality growth through transformative, action-first marketing. Small team support, proactive strategy, AI-enabled delivery, measurable outcomes.',
    path: '/',
    keywords: [
      'transformative hospitality marketing',
      'hospitality growth partner',
      'pub marketing',
      'bar marketing',
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
    title: 'Transformative marketing for hospitality. Built to accelerate growth.',
    subtitle:
      'Orange Jelly is a transformative marketing partner for hospitality businesses. We are a small, hands-on team helping partners grow through challenging times with proactive strategy, AI-enabled delivery, and practical systems that drive bookings, footfall, and repeat visits.',
    ctaText: 'See How We Help',
    bottomText:
      'Pay for progress, not overheads • £75 per hour plus VAT • Small team, direct support',
    backgroundImage: '/images/headers/homepage.png',
  };

  const faqs = [
    {
      question: 'Can I just get a one-off consultation?',
      answer:
        "Yes. Many hospitality partners start with one focused session to remove their biggest bottleneck. It's £75 per hour plus VAT, no minimum commitment, and we prioritise actions you can execute straight away.",
    },
    {
      question: 'How quickly can Orange Jelly create momentum?',
      answer:
        'Most partners see early movement within days, then meaningful commercial progress over 30 days with consistent execution. We focus on practical actions that improve bookings, visibility, and repeat visits.',
    },
    {
      question: 'What makes Orange Jelly different from a typical agency?',
      answer:
        'We are small on purpose. You work directly with us, not layers of account managers. We test everything at The Anchor first, then apply what works with practical, action-first support.',
    },
    {
      question: 'What does hospitality marketing cost with Orange Jelly?',
      answer:
        'Support is £75 per hour plus VAT with transparent tracking. You only invest in the time needed to move the numbers, and we can start with a small focused block.',
    },
  ];

  const problems = [
    {
      emoji: '🪑',
      title: 'Inconsistent Bookings',
      description: 'Turn quiet periods into reliable demand',
      linkHref: '/quiet-midweek-solutions',
    },
    {
      emoji: '📱',
      title: 'Low Visibility',
      description: 'Show up where local customers decide',
      linkHref: '/services#transformational-marketing',
    },
    {
      emoji: '🎯',
      title: 'Slow Execution',
      description: 'Move from ideas to weekly momentum',
      linkHref: '/services',
    },
  ];

  const features = [
    {
      icon: '💰',
      title: 'Pay For Progress',
      description: 'Your investment goes into delivery, not agency overhead',
    },
    {
      icon: '📅',
      title: 'Proactive Growth Plans',
      description: 'Direction, priorities, and execution each week',
    },
    {
      icon: '🛡️',
      title: 'Positive Disruption, Safe Delivery',
      description: 'Fresh thinking that modernizes growth without operational chaos',
    },
    {
      icon: '❤️',
      title: 'Small Team, Real Experience',
      description: 'Friendly, hands-on support from people in real hospitality trade',
    },
    {
      icon: '✅',
      title: 'Action-First Delivery',
      description: 'Less talk, more traction',
    },
    {
      icon: '⭐',
      title: 'Up to 25 Hours Reclaimed',
      description: 'Time saved each week through practical AI-enabled systems',
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
      description: 'Featured in BII magazine for AI innovation',
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
      description: 'Proud BII members, featured for our AI innovation in hospitality.',
      logoUrl: '/partners/bii-logo.png',
      url: 'https://www.bii.org/',
    },
  ];
  const partnerships = partnershipsData;

  const trustBarItems = [
    { value: 'Small team', label: 'Direct, hands-on support' },
    { value: 'Action-first', label: 'Clear plans and weekly momentum' },
    { value: '£75/hour', label: 'Pay for progress, not overheads' },
  ];

  const sectionHeadings = {
    problemsHeading: 'Where Hospitality Growth Gets Stuck',
    solutionsHeading: 'Explore the Fastest Route to Momentum',
    resultsHeading: 'Real Results from The Anchor',
    resultsTestimonial:
      "We've added £75,000-£100,000 of value to our business using AI. We cut £250/week in Sunday waste and £4,000+ a month in supplier, rota, and energy costs. It's a step-change in how the pub performs, and every strategy is proven in our own venue.",
    resultsSubtext:
      'Featured in BII magazine for AI innovation. From quiz nights to tasting events, this is measurable change in performance.',
    resultsButtonText: 'See More Hospitality Results',
    calculatorHeading: 'Estimate Your Growth Potential',
    calculatorSubtext:
      'Every venue is different. Estimate the upside from focused, action-first marketing.',
    aboutHeading: 'Built in a Real Venue',
    aboutText1:
      "I'm Peter. Billy runs The Anchor in Stanwell Moor day-to-day, and I lead marketing and growth. The Anchor is our proving ground for strategies that work under real trading pressure.",
    aboutText2:
      'Orange Jelly exists to bring that same transformative approach to other hospitality partners: proactive plans, faster execution, practical tools, and measurable outcomes.',
    aboutButtonText: 'Read Our Full Story →',
    aboutCardText: 'Real venue experience + measurable growth systems',
    aboutCardLabel: 'Proven Daily At',
    ctaBannerHeading: 'Less Talk. More Traction.',
    ctaBannerText:
      "Tell me where momentum is stuck. I'll share the highest-impact next steps we use at The Anchor to create measurable progress.",
    ctaBannerButton: 'Start a Growth Conversation',
    faqHeading: 'Frequently Asked Questions',
    finalCtaTitle: 'Ready for a Step-Change in Performance?',
    finalCtaSubtitle:
      "Let's focus on the biggest bottleneck first and build weekly momentum from there.",
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
