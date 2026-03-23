import HomePage from './HomePage';
import { AsyncErrorBoundary } from '@/components/ErrorBoundary';
import { generateStaticMetadata } from '@/lib/metadata';
import { getAllBlogPosts } from '@/lib/markdown/markdown';
import path from 'path';

export async function generateMetadata() {
  return generateStaticMetadata({
    title: 'Pub Marketing That Works -- From a Real Publican',
    description:
      'Pub marketing tested at a real pub. We grew quiz night to 35 regulars and food GP from 58% to 71%. Practical help from \u00a375/hr + VAT. No retainers.',
    path: '/',
    ogImage: '/images/og-default.jpg',
    ogType: 'website',
  });
}

// Local data for homepage
const getLocalHomeData = () => {
  const hero = {
    title: 'Pub marketing from a working pub. Proven systems that fill seats.',
    subtitle:
      'Orange Jelly helps pubs, bars, and hospitality venues fill empty tables and build midweek trade. We are a small, hands-on team using proactive strategy, AI-enabled delivery, and practical systems proven at The Anchor to drive bookings, footfall, and revenue.',
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
      title: 'Empty Tables Midweek',
      description: 'Proven systems to fill Tuesday and Wednesday nights',
      linkHref: '/quiet-midweek-solutions',
    },
    {
      emoji: '📉',
      title: 'Pub Struggling?',
      description: 'Honest diagnosis and a clear plan to turn things around',
      linkHref: '/fix-my-pub',
    },
    {
      emoji: '🏚️',
      title: 'Empty Pub',
      description: 'A 30-day recovery plan that rebuilds consistent trade',
      linkHref: '/empty-pub-solutions',
    },
    {
      emoji: '🏪',
      title: 'Competing with Chains',
      description: 'Beat the big brands without matching their budgets',
      linkHref: '/compete-with-pub-chains',
    },
    {
      emoji: '🚨',
      title: 'Pub in Crisis?',
      description: 'Emergency turnaround help for struggling pubs',
      linkHref: '/fix-my-pub',
    },
    {
      emoji: '💷',
      title: 'No Marketing Budget?',
      description: 'Free and low-cost pub marketing ideas that work',
      linkHref: '/pub-marketing-no-budget',
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
      description: 'Fresh thinking that modernises growth without operational chaos',
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
      title: 'Accelerate Weekly Execution',
      description: 'Turn 25 hours each week into growth actions that drive bookings and revenue',
    },
  ];

  const metrics = {
    quizNight: '25-30 teams',
    quizNightContext: 'regular teams each month',
    foodGP: '£250/week',
    foodGPContext: 'Sunday waste cut',
    socialViews: '60,000-70,000',
    socialViewsContext: 'people reached monthly',
    hoursSaved: '25 growth hours',
    hoursSavedContext: 'redirected weekly with AI',
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
    { value: '25-35', label: 'Quiz Night Regulars' },
    { value: '58% → 71%', label: 'Food GP Growth' },
    { value: '60-70K', label: 'Monthly Social Views' },
    { value: '£75-100K', label: 'Value Added' },
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

// Load recent blog posts for the homepage
function getRecentBlogPosts() {
  try {
    const blogDirectory = path.join(process.cwd(), 'content/blog');
    const allPosts = getAllBlogPosts(
      blogDirectory,
      { draft: false, dateTo: new Date() },
      { field: 'publishedAt', direction: 'desc' }
    );

    return allPosts.slice(0, 9).map((post) => {
      const frontMatterRecord = post.frontMatter as Record<string, unknown>;
      const publishedDate =
        typeof post.publishedAt === 'string'
          ? post.publishedAt
          : typeof frontMatterRecord.publishedDate === 'string'
            ? frontMatterRecord.publishedDate
            : new Date().toISOString();

      return {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt || '',
        publishedDate,
        readingTime: Math.round(post.readingTime?.minutes || 5),
      };
    });
  } catch (error) {
    console.error('Error loading blog posts for homepage:', error);
    return [];
  }
}

// Component that uses local data
function HomePageData() {
  const data = getLocalHomeData();
  const recentPosts = getRecentBlogPosts();

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
      recentPosts={recentPosts}
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
