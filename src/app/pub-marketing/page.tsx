import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Container from '@/components/Container';
import Grid from '@/components/Grid';
import FAQItem from '@/components/FAQItem';
import FeatureList from '@/components/FeatureList';
import WhatsAppButton from '@/components/WhatsAppButton';
import { FAQSchema } from '@/components/StructuredData';
import { generateMetadata } from '@/lib/metadata';
import Link from 'next/link';
import pubMarketingData from '../../../content/data/pub-marketing.json';

export const metadata = generateMetadata({
  title: 'Pub Marketing: The Complete Guide for UK Licensees',
  description:
    'The definitive pub marketing guide from a working licensee. Social media, events, email, local SEO, and menu engineering — all tested at The Anchor. £75/hr + VAT.',
  path: '/pub-marketing',
  ogType: 'website',
});

type PubMarketingCard = {
  title: string;
  description: string;
  href: string;
  ctaText: string;
};

const pillarFaqs = [
  ...pubMarketingData.faqs,
  {
    question: 'What is the most effective pub marketing channel?',
    answer:
      'For most pubs, Google Business Profile and Facebook deliver the fastest results. Google captures people actively searching for somewhere to eat or drink nearby. Facebook reaches locals who are not yet searching but can be prompted to visit. Start with both and add Instagram or email once the basics are working.',
  },
  {
    question: 'How do I market my pub with no budget?',
    answer:
      'Focus on free channels first: optimise your Google Business Profile, post consistently on Facebook, respond to every review, and ask happy customers to leave new ones. Run a weekly event to create word-of-mouth. These cost nothing but time and can deliver real footfall increases.',
  },
  {
    question: 'Should I hire a pub marketing agency or do it myself?',
    answer:
      'Start by doing the basics yourself using templates and systems. If you are too busy to maintain consistency, a specialist like Orange Jelly can either do it for you or set up AI-powered workflows so it takes minutes instead of hours. We charge £75 per hour plus VAT with no retainers.',
  },
];

export default function PubMarketingPage() {
  const focusAreas = pubMarketingData.focusAreas.items;
  const solutionCards = pubMarketingData.solutions.cards as PubMarketingCard[];

  return (
    <>
      <FAQSchema faqs={pillarFaqs} />

      <Hero
        title="Pub Marketing: The Complete Guide for UK Licensees"
        subtitle="Everything you need to fill tables, build regulars, and grow profit — tested at a real pub, not an agency desk. Social media, events, email, local SEO, and more."
        showCTA
        ctaText={pubMarketingData.hero.ctaText}
        bottomText={pubMarketingData.hero.bottomText}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Pub Marketing' }]}
        backgroundImage="/images/headers/services.png"
      />

      {/* Intro */}
      <Section background="white" padding="large">
        <Container maxWidth="4xl">
          <Heading level={2} align="center" className="mb-6">
            Why Pub Marketing Is Different From Every Other Business
          </Heading>
          <div className="space-y-4 max-w-3xl mx-auto">
            <Text size="lg" className="text-charcoal/80">
              Most small business marketing advice does not work for pubs. You cannot A/B test a
              Tuesday night. Your product is an experience, not a widget. And your competition
              includes chains with six-figure marketing budgets.
            </Text>
            <Text size="lg" className="text-charcoal/80">
              Effective pub marketing focuses on three things: getting found by people already
              looking for somewhere to go, giving them a reason to choose you, and turning
              first-timers into regulars. Everything on this page is built around those three
              objectives.
            </Text>
            <Text size="lg" className="text-charcoal/80">
              I run The Anchor in Stanwell Moor and built these systems to solve my own problems.
              Food GP went from 58% to 71%. Social media hit 60-70K monthly views. Quiz night grew
              from 20 to 25-35 regulars. If it works behind our bar, it goes on this page.
            </Text>
          </div>
        </Container>
      </Section>

      {/* Quick wins */}
      <Section background="cream" padding="large">
        <Container maxWidth="6xl">
          <Heading level={2} align="center" className="mb-4">
            {pubMarketingData.focusAreas.heading}
          </Heading>
          <Text size="lg" align="center" className="mb-10 max-w-3xl mx-auto text-charcoal/70">
            These are the four areas that move the needle fastest for most pubs.
          </Text>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {focusAreas.map((item) => (
              <Card key={item.title} variant="bordered" padding="large">
                <Heading level={3} className="mb-3">
                  {item.title}
                </Heading>
                <Text color="muted">{item.description}</Text>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* === PILLAR SECTION: Social Media === */}
      <Section background="white" padding="large">
        <Container maxWidth="5xl">
          <Heading level={2} align="center" className="mb-4">
            Social Media Marketing for Pubs
          </Heading>
          <Text size="lg" align="center" className="mb-10 max-w-3xl mx-auto text-charcoal/70">
            Social media should make locals think &ldquo;I need to go there this week&rdquo; — not
            just scroll past another stock photo.
          </Text>

          <Grid columns={{ default: 1, md: 2 }} gap="large" className="mb-8">
            <div>
              <Heading level={3} className="mb-4">
                Facebook for Pubs
              </Heading>
              <Text className="mb-4">
                Facebook remains the most effective social platform for UK pubs. Your audience is
                there, local groups drive real footfall, and events tools are built for hospitality.
              </Text>
              <FeatureList
                items={[
                  'Post 3-5 times per week with a mix of events, food, and behind-the-scenes',
                  'Use Facebook Events for every recurring night — they show up in local searches',
                  'Share to local community groups (ask first, follow their rules)',
                  'Respond to every comment within 2 hours during trading',
                ]}
                icon="check"
                iconColor="green"
                spacing="tight"
              />
              <div className="mt-4">
                <Link
                  href="/licensees-guide/facebook-marketing-local-pubs"
                  className="text-orange hover:text-orange-dark font-medium text-sm"
                >
                  Read: Facebook marketing for local pubs →
                </Link>
              </div>
            </div>

            <div>
              <Heading level={3} className="mb-4">
                Instagram for Pubs
              </Heading>
              <Text className="mb-4">
                Instagram works best for food-led pubs and venues with visual appeal. Stories drive
                urgency, Reels build reach, and a strong grid builds credibility.
              </Text>
              <FeatureList
                items={[
                  'Post your best dishes and drinks — natural light, no filters needed',
                  'Use Stories for daily specials, countdowns, and behind-the-scenes',
                  'Reels of 15-30 seconds get 3-5x more reach than static posts',
                  'Tag your location on everything to appear in local discovery',
                ]}
                icon="check"
                iconColor="green"
                spacing="tight"
              />
              <div className="mt-4">
                <Link
                  href="/licensees-guide/instagram-marketing-for-pubs"
                  className="text-orange hover:text-orange-dark font-medium text-sm"
                >
                  Read: Instagram marketing for pubs →
                </Link>
              </div>
            </div>
          </Grid>

          <Card background="orange-light" padding="large">
            <div className="text-center">
              <Text size="lg" weight="semibold" className="mb-2">
                AI frees up 25 hours per week on social media content
              </Text>
              <Text color="muted">
                We batch-create a week of posts in under an hour using AI tools. Templates,
                captions, and scheduling — all systematised so it runs without daily effort.
              </Text>
              <div className="mt-4">
                <Link
                  href="/licensees-guide/social-media-strategy-for-pubs"
                  className="text-orange hover:text-orange-dark font-medium text-sm"
                >
                  Read: Complete social media strategy for pubs →
                </Link>
              </div>
            </div>
          </Card>
        </Container>
      </Section>

      {/* === PILLAR SECTION: Events === */}
      <Section background="cream" padding="large">
        <Container maxWidth="5xl">
          <Heading level={2} align="center" className="mb-4">
            Event Marketing for Pubs
          </Heading>
          <Text size="lg" align="center" className="mb-10 max-w-3xl mx-auto text-charcoal/70">
            One strong weekly event can transform your midweek. The key is consistency, not
            spectacle.
          </Text>

          <Grid columns={{ default: 1, md: 3 }} gap="medium" className="mb-8">
            <Card variant="bordered" padding="large">
              <Heading level={3} className="mb-3">
                Quiz Nights
              </Heading>
              <Text color="muted" className="mb-3">
                The most reliable midweek event for any pub. Low cost, high retention, builds a
                community of regulars who come every week.
              </Text>
              <Text size="sm" weight="semibold" className="text-teal">
                Our result: 25-35 regulars every week, up from 20
              </Text>
              <div className="mt-3">
                <Link
                  href="/licensees-guide/quiz-night-ideas"
                  className="text-orange hover:text-orange-dark font-medium text-sm"
                >
                  Quiz night ideas →
                </Link>
              </div>
            </Card>

            <Card variant="bordered" padding="large">
              <Heading level={3} className="mb-3">
                Tasting Events
              </Heading>
              <Text color="muted" className="mb-3">
                Wine, gin, whisky, or craft beer tastings attract a different crowd and command
                premium pricing. Partner with suppliers for stock and expertise.
              </Text>
              <Text size="sm" weight="semibold" className="text-teal">
                Our result: 85% of tasting guests return within 30 days
              </Text>
            </Card>

            <Card variant="bordered" padding="large">
              <Heading level={3} className="mb-3">
                Live Music
              </Heading>
              <Text color="muted" className="mb-3">
                Live music works when it fits your audience and is promoted properly. Start with
                acoustic acts on quiet nights to test demand before committing to a regular slot.
              </Text>
              <div className="mt-3">
                <Link
                  href="/licensees-guide/live-music-events-for-pubs"
                  className="text-orange hover:text-orange-dark font-medium text-sm"
                >
                  Live music guide →
                </Link>
              </div>
            </Card>
          </Grid>

          <div className="text-center">
            <Link
              href="/licensees-guide/how-to-run-successful-pub-events"
              className="text-orange hover:text-orange-dark font-medium"
            >
              Read the complete guide: How to run successful pub events →
            </Link>
          </div>
        </Container>
      </Section>

      {/* === PILLAR SECTION: Email Marketing === */}
      <Section background="white" padding="large">
        <Container maxWidth="5xl">
          <Heading level={2} align="center" className="mb-4">
            Email Marketing for Pubs
          </Heading>
          <Text size="lg" align="center" className="mb-10 max-w-3xl mx-auto text-charcoal/70">
            Your customer database is the one marketing asset you own. Social platforms change their
            algorithms. Your email list is yours forever.
          </Text>

          <Grid columns={{ default: 1, md: 2 }} gap="large">
            <div>
              <Heading level={3} className="mb-4">
                Building Your Database
              </Heading>
              <Text className="mb-4">
                Start collecting emails and phone numbers from day one. Wi-Fi sign-up, booking
                confirmations, event registrations, and a simple sign-up card on the bar all work.
              </Text>
              <FeatureList
                items={[
                  'Wi-Fi captive portal — guests give email for internet access',
                  'Booking confirmation — capture details from every reservation',
                  'Event sign-ups — quiz teams, tastings, and functions',
                  'Loyalty programme — reward regulars for sharing their details',
                ]}
                icon="check"
                iconColor="green"
                spacing="tight"
              />
              <Text size="sm" weight="semibold" className="text-teal mt-4">
                We built a database of 300 contacts using these methods at The Anchor
              </Text>
            </div>

            <div>
              <Heading level={3} className="mb-4">
                What to Send
              </Heading>
              <Text className="mb-4">
                Keep it simple and useful. One email per week is enough. Focus on what is happening
                this week and one reason to book.
              </Text>
              <FeatureList
                items={[
                  'Weekly "What\'s On" roundup — events, specials, live music',
                  'Seasonal menus and new dish announcements',
                  'Exclusive offers for database members (makes them feel valued)',
                  'Last-minute table availability on quiet nights',
                ]}
                icon="check"
                iconColor="green"
                spacing="tight"
              />
              <div className="mt-4">
                <Link
                  href="/licensees-guide/email-marketing-pub-retention"
                  className="text-orange hover:text-orange-dark font-medium text-sm"
                >
                  Read: Email marketing for pub retention →
                </Link>
              </div>
            </div>
          </Grid>
        </Container>
      </Section>

      {/* === PILLAR SECTION: Local SEO === */}
      <Section background="cream" padding="large">
        <Container maxWidth="5xl">
          <Heading level={2} align="center" className="mb-4">
            Local SEO for Pubs
          </Heading>
          <Text size="lg" align="center" className="mb-10 max-w-3xl mx-auto text-charcoal/70">
            When someone searches &ldquo;pub near me&rdquo; or &ldquo;Sunday roast [your
            town],&rdquo; you need to appear. This is often the fastest win for any pub.
          </Text>

          <Grid columns={{ default: 1, md: 2 }} gap="large" className="mb-8">
            <Card variant="bordered" padding="large">
              <Heading level={3} className="mb-4">
                Google Business Profile
              </Heading>
              <Text className="mb-4">
                Your Google Business Profile is the single most important piece of digital marketing
                for a pub. It appears in Maps, local search, and &ldquo;near me&rdquo; queries.
              </Text>
              <FeatureList
                items={[
                  'Complete every field — hours, menu link, booking link, attributes',
                  'Add 10+ high-quality photos (food, interior, garden, events)',
                  'Post weekly updates with events and specials',
                  'Respond to every review within 24 hours (positive and negative)',
                ]}
                icon="check"
                iconColor="green"
                spacing="tight"
              />
            </Card>

            <Card variant="bordered" padding="large">
              <Heading level={3} className="mb-4">
                Reviews Strategy
              </Heading>
              <Text className="mb-4">
                Reviews are the biggest ranking factor for local search. More reviews, higher
                ratings, and recent activity all push you up the results.
              </Text>
              <FeatureList
                items={[
                  'Ask every happy table to leave a review — a simple card works',
                  'Train staff to mention reviews naturally at the end of a meal',
                  'Respond to negative reviews calmly and professionally',
                  'Never buy fake reviews — Google catches them and penalises you',
                ]}
                icon="check"
                iconColor="green"
                spacing="tight"
              />
            </Card>
          </Grid>
        </Container>
      </Section>

      {/* === PILLAR SECTION: Menu Engineering === */}
      <Section background="white" padding="large">
        <Container maxWidth="5xl">
          <Heading level={2} align="center" className="mb-4">
            Menu Engineering and Profit Growth
          </Heading>
          <Text size="lg" align="center" className="mb-10 max-w-3xl mx-auto text-charcoal/70">
            Your menu is your biggest profit lever. Small changes to layout, descriptions, and
            pricing can shift gross profit by double digits.
          </Text>

          <Grid columns={{ default: 1, md: 3 }} gap="medium" className="mb-8">
            <Card variant="bordered" padding="large">
              <Heading level={4} className="mb-3">
                Menu Layout
              </Heading>
              <Text size="sm" color="muted">
                Place high-margin dishes in the top-right of each section. Use boxes or borders to
                draw attention. Remove pound signs — they make people think about cost.
              </Text>
            </Card>
            <Card variant="bordered" padding="large">
              <Heading level={4} className="mb-3">
                Descriptions That Sell
              </Heading>
              <Text size="sm" color="muted">
                Sensory language increases orders by 27%. &ldquo;Slow-roasted belly pork with
                crackling&rdquo; outsells &ldquo;pork belly&rdquo; every time. Tell the story.
              </Text>
            </Card>
            <Card variant="bordered" padding="large">
              <Heading level={4} className="mb-3">
                Waste Reduction
              </Heading>
              <Text size="sm" color="muted">
                Pre-order systems for Sunday roasts freed up £250 per week at The Anchor. Know your
                numbers, order precisely, and use daily specials to move surplus stock.
              </Text>
            </Card>
          </Grid>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/licensees-guide/menu-engineering-lift-average-spend"
              className="text-orange hover:text-orange-dark font-medium text-sm"
            >
              Menu engineering guide →
            </Link>
            <Link
              href="/licensees-guide/upselling-secrets-training-scripts"
              className="text-orange hover:text-orange-dark font-medium text-sm"
            >
              Upselling training scripts →
            </Link>
            <Link
              href="/licensees-guide/profitable-pub-food-menu-ideas"
              className="text-orange hover:text-orange-dark font-medium text-sm"
            >
              Profitable food menu ideas →
            </Link>
          </div>
        </Container>
      </Section>

      {/* Results */}
      <Section background="teal" padding="large">
        <Container maxWidth="5xl">
          <Heading level={2} color="white" align="center" className="mb-4">
            What Pub Marketing Actually Delivers
          </Heading>
          <Text
            size="lg"
            color="white"
            align="center"
            className="opacity-90 mb-12 max-w-3xl mx-auto"
          >
            Real numbers from The Anchor — the same systems we set up for clients.
          </Text>

          <Grid columns={{ default: 2, md: 4 }} gap="medium">
            <div className="text-center">
              <Text size="2xl" weight="bold" className="text-white">
                58% → 71%
              </Text>
              <Text size="sm" className="text-white/80 mt-1">
                Food gross profit
              </Text>
            </div>
            <div className="text-center">
              <Text size="2xl" weight="bold" className="text-white">
                60-70K
              </Text>
              <Text size="sm" className="text-white/80 mt-1">
                Monthly social views
              </Text>
            </div>
            <div className="text-center">
              <Text size="2xl" weight="bold" className="text-white">
                25-35
              </Text>
              <Text size="sm" className="text-white/80 mt-1">
                Weekly quiz regulars
              </Text>
            </div>
            <div className="text-center">
              <Text size="2xl" weight="bold" className="text-white">
                £250/wk
              </Text>
              <Text size="sm" className="text-white/80 mt-1">
                Waste cut on Sundays
              </Text>
            </div>
          </Grid>
        </Container>
      </Section>

      {/* Solutions */}
      <Section background="white" padding="large">
        <Container maxWidth="6xl">
          <Heading level={2} align="center" className="mb-4">
            {pubMarketingData.solutions.heading}
          </Heading>
          <Text size="lg" align="center" className="mb-10 max-w-3xl mx-auto text-charcoal/70">
            Pick the issue that is costing you the most. We will start there.
          </Text>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {solutionCards.map((card) => (
              <Card key={card.href} variant="bordered" padding="large" className="flex flex-col">
                <div className="flex-1">
                  <Heading level={3} className="mb-3">
                    {card.title}
                  </Heading>
                  <Text color="muted" className="mb-6">
                    {card.description}
                  </Text>
                </div>
                <div>
                  <Button href={card.href} variant="primary" size="medium">
                    {card.ctaText}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* More reading */}
      <Section background="cream" padding="large">
        <Container maxWidth="5xl">
          <Heading level={2} align="center" className="mb-4">
            More Pub Marketing Guides
          </Heading>
          <Text size="lg" align="center" className="mb-10 max-w-3xl mx-auto text-charcoal/70">
            Deep dives into specific pub marketing challenges, written by a licensee who has solved
            them.
          </Text>

          <Grid columns={{ default: 1, md: 2, lg: 3 }} gap="medium">
            {[
              {
                title: 'Low Budget Pub Marketing Ideas',
                href: '/licensees-guide/low-budget-pub-marketing-ideas',
                desc: 'Free and near-free tactics that actually drive footfall.',
              },
              {
                title: 'Midweek Offers That Work',
                href: '/licensees-guide/midweek-pub-offers-that-work',
                desc: 'Proven promotions for the quietest nights of the week.',
              },
              {
                title: 'Compete With Pub Chains',
                href: '/licensees-guide/compete-with-wetherspoons',
                desc: 'Positioning tactics that chains cannot copy.',
              },
              {
                title: 'Revenue Levers for Struggling Pubs',
                href: '/licensees-guide/revenue-levers-struggling-pubs',
                desc: 'The key financial levers every licensee should know.',
              },
              {
                title: 'Staff Motivation Without Pay Rises',
                href: '/licensees-guide/staff-motivation-hacks-no-pay-rise',
                desc: 'Keep your team engaged without increasing the wage bill.',
              },
              {
                title: 'Recession-Proof Pub Strategies',
                href: '/licensees-guide/recession-proof-pub-strategies',
                desc: 'How to protect your pub when the economy tightens.',
              },
            ].map((guide) => (
              <Link key={guide.href} href={guide.href} className="block group">
                <Card
                  variant="bordered"
                  padding="large"
                  className="h-full group-hover:border-orange transition-colors"
                >
                  <Heading level={4} className="mb-2 group-hover:text-orange transition-colors">
                    {guide.title}
                  </Heading>
                  <Text size="sm" color="muted">
                    {guide.desc}
                  </Text>
                </Card>
              </Link>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Locations */}
      <Section background="teal" padding="large">
        <Container maxWidth="4xl">
          <div className="text-center">
            <Heading level={2} color="white" className="mb-4">
              {pubMarketingData.locations.heading}
            </Heading>
            <Text size="lg" color="white" className="opacity-90 mb-8">
              {pubMarketingData.locations.description}
            </Text>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {pubMarketingData.locations.areas.map((area) => {
              const areaSlug = area
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

              return (
                <Link
                  key={area}
                  href={`/pub-marketing-${areaSlug}`}
                  className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  {area}
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Process */}
      <Section background="white" padding="large">
        <Container maxWidth="6xl">
          <Heading level={2} align="center" className="mb-12">
            {pubMarketingData.process.heading}
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(
              pubMarketingData.process.steps as Array<{
                number: string;
                title: string;
                description: string;
              }>
            ).map((step) => (
              <div key={step.number} className="text-center">
                <div className="w-12 h-12 bg-orange text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                  {step.number}
                </div>
                <Heading level={4} className="mb-3">
                  {step.title}
                </Heading>
                <Text size="sm" color="muted">
                  {step.description}
                </Text>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section background="cream" padding="large">
        <Container maxWidth="4xl">
          <Heading level={2} align="center" className="mb-12">
            Pub Marketing Questions Answered
          </Heading>
          <div className="space-y-4">
            {pillarFaqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section background="orange-light" padding="large">
        <Container maxWidth="3xl">
          <div className="text-center">
            <Heading level={2} className="mb-4">
              {pubMarketingData.cta.title}
            </Heading>
            <Text size="lg" className="mb-8 max-w-2xl mx-auto">
              {pubMarketingData.cta.subtitle}
            </Text>
            <WhatsAppButton
              text={pubMarketingData.cta.whatsappMessage}
              label="Message Peter on WhatsApp"
              size="large"
              className="mb-4"
            />
            <div className="mt-4">
              <Button href="/pub-marketing-agency" variant="ghost" size="medium">
                Why choose Orange Jelly as your pub marketing agency?
              </Button>
            </div>
            <Text size="sm" color="muted" className="mt-4">
              £75/hour + VAT • No fixed retainers • No pressure
            </Text>
          </div>
        </Container>
      </Section>
    </>
  );
}
