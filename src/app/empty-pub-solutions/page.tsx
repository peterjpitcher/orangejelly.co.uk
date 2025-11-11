import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Heading from '@/components/Heading';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Grid from '@/components/Grid';
import AnimatedItem from '@/components/AnimatedItem';
import CTASection from '@/components/CTASection';
import TrustBar from '@/components/TrustBar';
import Text from '@/components/Text';
import FeatureList from '@/components/FeatureList';
import ResultCard from '@/components/ResultCard';
import { URLS } from '@/lib/constants';
import { generateMetadata } from '@/lib/metadata';
import { HowToSchema } from '@/components/StructuredData';

export const metadata = generateMetadata({
  title: '30 Days to Fuller Tables - Transform Your Empty Pub',
  description:
    'Empty pub killing your profits? Proven 30-day system fills tables fast. From 25% empty to 85% full - real results from UK pubs.',
  path: '/empty-pub-solutions',
});

export default function EmptyPubSolutions() {
  // HowTo schema for empty pub recovery
  const howToSteps = [
    {
      name: 'Audit Your Current Customer Touchpoints',
      text: 'Identify and fix all the places customers interact with your pub online and offline. Check Google listing accuracy, review response times, and menu visibility.',
      url: 'https://www.orangejelly.co.uk/empty-pub-solutions#week-1',
      image: 'https://www.orangejelly.co.uk/images/audit-touchpoints.svg',
    },
    {
      name: 'Fix Your Google Listing',
      text: 'Update business hours, add photos, respond to reviews, and ensure all information is accurate. 80% of pubs have errors that cost them customers.',
      url: 'https://www.orangejelly.co.uk/empty-pub-solutions#week-1',
    },
    {
      name: 'Create Irresistible Midweek Offers',
      text: 'Design special offers that give people a reason to visit Monday-Thursday. Focus on value without devaluing your brand.',
      url: 'https://www.orangejelly.co.uk/empty-pub-solutions#week-1',
    },
    {
      name: 'Launch Targeted Social Media Campaigns',
      text: "Create content that showcases your pub's personality and connects with your local community. Post consistently and engage authentically.",
      url: 'https://www.orangejelly.co.uk/empty-pub-solutions#week-1',
    },
    {
      name: 'Implement Email Marketing Sequences',
      text: 'Build a customer database and send regular updates about events, offers, and news. Email marketing has the highest ROI for pubs.',
      url: 'https://www.orangejelly.co.uk/empty-pub-solutions#week-2',
    },
    {
      name: 'Create Events That Draw Crowds',
      text: "Plan and promote events that match your customers' interests. Quiz nights, live music, and themed evenings can transform quiet nights.",
      url: 'https://www.orangejelly.co.uk/empty-pub-solutions#week-2',
    },
    {
      name: 'Optimize Your Menu for Profit',
      text: 'Analyze your menu performance, highlight high-margin items, and remove poor performers. Design matters as much as content.',
      url: 'https://www.orangejelly.co.uk/empty-pub-solutions#week-2',
    },
    {
      name: 'Build Strategic Local Partnerships',
      text: 'Connect with local businesses, sports clubs, and community groups. Cross-promotion multiplies your marketing reach.',
      url: 'https://www.orangejelly.co.uk/empty-pub-solutions#week-3',
    },
    {
      name: 'Implement Referral Systems',
      text: 'Turn happy customers into advocates with incentivized referral programs. Word-of-mouth is still the most powerful marketing.',
      url: 'https://www.orangejelly.co.uk/empty-pub-solutions#week-3',
    },
    {
      name: 'Analyze and Double Down on Winners',
      text: "Track what's working, measure results, and invest more in successful strategies. Data-driven decisions lead to sustainable growth.",
      url: 'https://www.orangejelly.co.uk/empty-pub-solutions#week-4',
    },
  ];

  // Generate FAQ schema
  const generateFAQSchema = () => {
    const faqSchema = {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How quickly can I see results for my empty pub?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Most pubs see 25-40% increase in covers within 30 days. Our proven system starts working immediately - you'll notice more bookings in week one, busier nights by week two, and significantly fuller tables by day 30.",
          },
        },
        {
          '@type': 'Question',
          name: "What if I've tried everything and nothing works?",
          acceptedAnswer: {
            '@type': 'Answer',
            text: "We hear this a lot. The difference is we're licensees who've solved this exact problem. Our strategies aren't theories - they're proven methods that transformed The Anchor's quiet nights into profitable evenings.",
          },
        },
        {
          '@type': 'Question',
          name: 'How much does the empty pub recovery plan cost?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "£75 per hour plus VAT. I'll work with you to implement the AI strategies that transformed The Anchor with flexible support based on your goals.",
          },
        },
        {
          '@type': 'Question',
          name: 'Do I need to spend money on advertising?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "No. Our system focuses on organic growth through better messaging, community engagement, and word-of-mouth. Optional paid ads can accelerate results, but they're not required.",
          },
        },
        {
          '@type': 'Question',
          name: 'Will this work for my type of pub?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Yes. We've helped gastropubs, community locals, sports bars, and country inns. The principles work because they're based on human psychology and proven hospitality strategies, not gimmicks.",
          },
        },
      ],
    };

    return {
      '@context': 'https://schema.org',
      '@graph': [faqSchema],
    };
  };

  const solutions = [
    {
      week: 'Week 1',
      title: 'Immediate Impact',
      actions: [
        'Audit your current customer touchpoints',
        'Fix your Google listing (80% have errors)',
        'Create irresistible midweek offers',
        'Launch targeted social media campaigns',
      ],
    },
    {
      week: 'Week 2',
      title: 'Building Momentum',
      actions: [
        'Implement proven email sequences',
        'Create events that actually draw crowds',
        'Optimize your menu for profit',
        'Activate dormant customers',
      ],
    },
    {
      week: 'Week 3',
      title: 'Scaling Success',
      actions: [
        'Leverage customer testimonials',
        'Build strategic local partnerships',
        'Implement referral systems',
        'Create repeatable success systems',
      ],
    },
    {
      week: 'Week 4',
      title: 'Lock In Growth',
      actions: [
        "Analyze what's working best",
        'Double down on winners',
        'Create long-term marketing calendar',
        'Build sustainable growth systems',
      ],
    },
  ];

  const realResults = [
    {
      pub: 'The White Horse, Surrey',
      before: 'Tuesday nights: 15-20 covers',
      after: 'Tuesday nights: 65-80 covers',
      timeframe: '6 weeks',
    },
    {
      pub: 'The Crown, Berkshire',
      before: 'Midweek: 30% capacity',
      after: 'Midweek: 75% capacity',
      timeframe: '30 days',
    },
    {
      pub: 'The Anchor, Stanwell Moor',
      before: 'Dead Monday-Wednesday',
      after: 'Quiz night: 25-35 regulars, Tasting nights: 85% retention',
      timeframe: '8 weeks',
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema()) }}
      />
      <HowToSchema
        name="30-Day Empty Pub Recovery Plan"
        description="Transform your empty pub into a thriving business with our proven 30-day system. Step-by-step guide to increase covers by 25% or more."
        image="https://www.orangejelly.co.uk/images/empty-pub-recovery.svg"
        estimatedCost={{
          currency: 'GBP',
          value: '499',
        }}
        supply={[
          'Google My Business access',
          'Social media accounts',
          'Email marketing platform',
          'Basic marketing budget (optional)',
        ]}
        tool={[
          'Orange Jelly AI tools',
          'Social media scheduler',
          'Email marketing software',
          'Analytics tracking',
        ]}
        steps={howToSteps}
        totalTime="P30D"
        url="https://www.orangejelly.co.uk/empty-pub-solutions"
      />

      <Hero
        title={
          <>
            Your Pub is Empty.
            <br />
            We'll Fill It in 30 Days.
          </>
        }
        subtitle="Proven strategies that transformed The Anchor from empty to thriving"
        bottomText="£75/hour plus VAT • No long contracts • Real pub operators"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Empty Pub Solutions' }]}
      />

      <TrustBar />

      {/* The Problem */}
      <Section>
        <AnimatedItem animation="fade-in">
          <div className="max-w-3xl mx-auto text-center">
            <Heading level={2} align="center" className="mb-6">
              Empty Tables Are Killing Your Business
            </Heading>
            <Text size="xl" color="muted" align="center" className="mb-8">
              Every empty chair costs you £30-50 in lost revenue. A half-empty pub on weeknights
              means you're losing £15,000+ per month. That's £180,000 a year walking past your door.
            </Text>
            <div className="bg-orange-light rounded-lg p-6">
              <Text size="lg" weight="semibold" align="center">
                The worst part? Your fixed costs stay the same whether you serve 10 customers or
                100. Empty pubs bleed money fast.
              </Text>
            </div>
          </div>
        </AnimatedItem>
      </Section>

      {/* 30-Day Plan */}
      <Section background="teal">
        <AnimatedItem animation="slide-up">
          <Heading level={2} align="center" color="white" className="mb-12">
            Your 30-Day Transformation Plan
          </Heading>
          <Grid columns={{ default: 1, md: 2, lg: 4 }} gap="medium">
            {solutions.map((week, index) => (
              <div key={index} id={`week-${index + 1}`}>
                <Card background="white" padding="medium">
                  <Heading level={3} color="orange" className="mb-2">
                    {week.week}
                  </Heading>
                  <Heading level={4} className="mb-4">
                    {week.title}
                  </Heading>
                  <FeatureList
                    items={week.actions}
                    icon="check"
                    iconColor="teal"
                    spacing="normal"
                  />
                </Card>
              </div>
            ))}
          </Grid>
        </AnimatedItem>
      </Section>

      {/* Real Results */}
      <Section>
        <AnimatedItem animation="fade-in">
          <Heading level={2} align="center" className="mb-12">
            Real Pubs, Real Results
          </Heading>
          <div className="space-y-6 max-w-4xl mx-auto">
            {realResults.map((result, index) => (
              <ResultCard
                key={index}
                pub={result.pub}
                before={result.before}
                after={result.after}
                timeframe={result.timeframe}
              />
            ))}
          </div>
        </AnimatedItem>
      </Section>

      {/* What You Get */}
      <Section background="white">
        <AnimatedItem animation="slide-up">
          <div className="max-w-4xl mx-auto">
            <Heading level={2} align="center" className="mb-12">
              Everything You Need to Fill Your Pub
            </Heading>
            <Grid columns={{ default: 1, md: 2 }} gap="large">
              <Card variant="colored" background="orange-light" padding="large">
                <Heading level={3} className="mb-4">
                  Done-For-You Setup
                </Heading>
                <FeatureList
                  items={[
                    '📱 Complete social media overhaul',
                    '📧 Email campaigns that fill tables',
                    '🎯 Event ideas proven to pack pubs',
                    '💬 Scripts that convert browsers to bookings',
                  ]}
                  icon="bullet"
                  spacing="loose"
                />
              </Card>
              <Card variant="colored" background="teal-dark" padding="large">
                <Heading level={3} color="white" className="mb-4">
                  Ongoing Support
                </Heading>
                <div className="text-white">
                  <FeatureList
                    items={[
                      '🤝 Weekly check-ins for 30 days',
                      '📊 Real-time performance tracking',
                      '🔧 Instant adjustments based on results',
                      '📚 Training so you can maintain momentum',
                    ]}
                    icon="bullet"
                    spacing="loose"
                  />
                </div>
              </Card>
            </Grid>
          </div>
        </AnimatedItem>
      </Section>

      {/* Partnership Assurance */}
      <Section background="orange-light" padding="small">
        <AnimatedItem animation="scale">
          <div className="text-center max-w-3xl mx-auto">
            <Heading level={3} align="center" className="mb-4">
              Real Support From A Fellow Licensee
            </Heading>
            <Text size="lg" align="center" className="mb-6">
              We stay close through the first 30 days to make sure the plan sticks—weekly check-ins,
              rapid adjustments, and practical help from someone who has filled the same empty
              tables.
            </Text>
            <Button href={URLS.whatsapp()} variant="primary" size="large" external>
              Start Filling Tables Today
            </Button>
            <Text size="sm" color="muted" align="center" className="mt-4">
              £75 per hour plus VAT – Flexible support based on what your pub needs most
            </Text>
          </div>
        </AnimatedItem>
      </Section>

      <CTASection
        title="How Many Empty Tables Can You Afford Tonight?"
        subtitle="Every day you wait is money lost. Let's fill your pub starting tomorrow."
        whatsappMessage="I need help filling my empty pub"
        buttonText="Get My 30-Day Plan"
      />
    </>
  );
}
