import { generateStaticMetadata } from '@/lib/metadata';
import { getAllBlogPosts } from '@/lib/markdown/markdown';
import { AsyncErrorBoundary } from '@/components/ErrorBoundary';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Grid from '@/components/Grid';
import AnimatedItem from '@/components/AnimatedItem';
import Container from '@/components/Container';
import Box from '@/components/Box';
import OptimizedImage from '@/components/OptimizedImage';
import FAQItem from '@/components/FAQItem';
import Link from 'next/link';
import { FAQSchema } from '@/components/StructuredData';
import { SpeakableContent } from '@/components/SpeakableContent';
import SeasonalPlaybooksBand from '@/components/SeasonalPlaybooksBand';
import {
  ProofStrip,
  PackageCard,
  CapabilityGrid,
  CaseStudyCard,
  PackageCTA,
} from '@/components/packages';
import path from 'path';

export async function generateMetadata() {
  return generateStaticMetadata({
    title: 'Hospitality Marketing That Fills Seats | Orange Jelly',
    description:
      'Hospitality marketing packages from a working pub. Strategy, events, social, local visibility — tested at The Anchor, delivered for your venue. Packages from £375 + VAT.',
    path: '/',
    ogImage: '/images/og-default.jpg',
    ogType: 'website',
  });
}

const faqs = [
  {
    question: 'Which package is right for my pub?',
    answer:
      'If you have one clear issue, start with a Growth Fix. If you need ongoing monthly support, Momentum Month or Growth Partner. If your pub needs a complete reset, the Turnaround Intensive.',
  },
  {
    question: 'How quickly can Orange Jelly create momentum?',
    answer:
      'Growth Fix clients typically see their first win within 2 weeks. Momentum Month and Growth Partner clients build visible momentum within 30-60 days.',
  },
  {
    question: 'What makes Orange Jelly different from a typical agency?',
    answer:
      'We are small on purpose. You work directly with us, not layers of account managers. We test everything at The Anchor first, then apply what works with practical, action-first support.',
  },
  {
    question: 'Do you offer payment plans?',
    answer:
      'Yes. We offer flexible payment options to make support accessible. Ask Peter when you get in touch.',
  },
];

const problems = [
  {
    emoji: '\u{1FA91}',
    title: 'Empty Tables Midweek',
    description: 'Proven systems to fill Tuesday and Wednesday nights',
    linkHref: '/ways-to-work/growth-fix',
  },
  {
    emoji: '\u{1F4C9}',
    title: 'Pub Struggling?',
    description: 'Honest diagnosis and a clear plan to turn things around',
    linkHref: '/ways-to-work/turnaround-intensive',
  },
  {
    emoji: '\u{1F3DA}\u{FE0F}',
    title: 'Empty Pub',
    description: 'A 30-day recovery plan that rebuilds consistent trade',
    linkHref: '/ways-to-work/growth-fix',
  },
  {
    emoji: '\u{1F3EA}',
    title: 'Competing with Chains',
    description: 'Beat the big brands without matching their budgets',
    linkHref: '/ways-to-work/growth-partner',
  },
  {
    emoji: '\u{1F6A8}',
    title: 'Pub in Crisis?',
    description: 'Emergency turnaround help for struggling pubs',
    linkHref: '/ways-to-work/turnaround-intensive',
  },
  {
    emoji: '\u{1F4B7}',
    title: 'No Marketing Budget?',
    description: 'Focused marketing from just £375 + VAT',
    linkHref: '/ways-to-work/growth-fix',
  },
];

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

export default function Home() {
  const recentPosts = getRecentBlogPosts();

  return (
    <AsyncErrorBoundary>
      <FAQSchema faqs={faqs} />
      <SpeakableContent
        cssSelectors={[
          '.hero-title',
          '.hero-subtitle',
          '.trust-bar',
          '.problem-card h3',
          '.cta-section h2',
          '.cta-section p',
        ]}
        url="/"
      />

      {/* Hero */}
      <Hero
        title="Hospitality marketing from a working pub. Proven packages that fill seats."
        subtitle="Orange Jelly delivers hospitality marketing that works for pubs, bars, and venues. Clear packages built on systems proven at The Anchor — strategy, events, social, and local visibility that drive bookings, footfall, and revenue."
        secondaryAction={{
          text: 'See Our Packages',
          href: '/ways-to-work',
        }}
        bottomText="Packages from £375 + VAT • Proven at The Anchor • Payment plans available"
        backgroundImage="/images/headers/homepage.png"
      />

      {/* Proof Strip */}
      <ProofStrip claimIds={['search-visibility', 'table-bookings', 'food-revenue', 'no-shows']} />

      {/* Seasonal Playbooks */}
      <SeasonalPlaybooksBand
        highlightInSeason
        background="cream"
        subtitle="Ready-to-run guides for the moments that matter each season — built and tested at The Anchor. Pick the playbook that fits the calendar ahead."
      />

      {/* Where Growth Gets Stuck */}
      <Section>
        <Heading level={2} align="center" className="mb-4">
          Where Hospitality Growth Gets Stuck
        </Heading>
        <Text size="lg" color="muted" align="center" className="mb-10 max-w-2xl mx-auto">
          Sound familiar? Every problem has a package built to solve it.
        </Text>
        <Grid columns={{ default: 1, md: 2, lg: 3 }} gap="medium">
          {problems.map((problem) => (
            <AnimatedItem key={problem.title} animation="slide-up" delay={100}>
              <Link href={problem.linkHref} className="block group h-full">
                <Card
                  variant="bordered"
                  className="h-full p-6 transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="text-3xl mb-3">{problem.emoji}</div>
                  <Heading level={3} className="mb-2 group-hover:text-orange transition-colors">
                    {problem.title}
                  </Heading>
                  <Text color="muted">{problem.description}</Text>
                </Card>
              </Link>
            </AnimatedItem>
          ))}
        </Grid>
      </Section>

      {/* Package Summary */}
      <Section background="cream">
        <Heading level={2} align="center" className="mb-4">
          Clear Packages. Honest Pricing.
        </Heading>
        <Text size="lg" color="muted" align="center" className="mb-10 max-w-2xl mx-auto">
          Four packages for every stage of growth. No hidden fees, no lock-in.
        </Text>
        <Grid columns={{ default: 1, md: 2, lg: 4 }} gap="medium">
          <PackageCard packageId="growth-fix" />
          <PackageCard packageId="momentum-month" />
          <PackageCard packageId="growth-partner" highlighted />
          <PackageCard packageId="turnaround-intensive" />
        </Grid>
        <Box className="text-center mt-8">
          <Button href="/ways-to-work" variant="primary" size="large">
            Compare All Packages
          </Button>
        </Box>
      </Section>

      {/* Capability Summary */}
      <Section>
        <Heading level={2} align="center" className="mb-4">
          Everything We Can Help With
        </Heading>
        <Text size="lg" color="muted" align="center" className="mb-10 max-w-2xl mx-auto">
          A full digital capability stack, tested at The Anchor. Support depth varies by package.
        </Text>
        <CapabilityGrid compact />
        <Box className="text-center mt-8">
          <Button href="/capabilities" variant="secondary">
            See Full Capability Breakdown
          </Button>
        </Box>
      </Section>

      {/* Why OJ Is Different */}
      <Section background="white">
        <AnimatedItem animation="slide-up" delay={200}>
          <Grid columns={{ default: 1, md: 2 }} gap="large" className="items-center">
            <Box>
              <Heading level={2} className="mb-6">
                Built in a Real Venue
              </Heading>
              <Text size="lg" color="muted" className="mb-4">
                I&apos;m Peter. Billy runs The Anchor in Stanwell Moor day-to-day, and I lead
                marketing and growth. The Anchor is our proving ground for strategies that work
                under real trading pressure.
              </Text>
              <Text size="lg" color="muted" className="mb-6">
                Orange Jelly exists to bring that same transformative approach to other hospitality
                venues: proactive plans, faster execution, practical tools, and measurable outcomes.
              </Text>
              <Button href="/about" variant="ghost" className="text-lg">
                Read Our Full Story
              </Button>
            </Box>
            <a
              href="https://www.the-anchor.pub"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
              aria-label="Visit The Anchor website"
            >
              <Card
                variant="colored"
                background="white"
                padding="large"
                className="!bg-teal text-center relative overflow-hidden transition-opacity hover:opacity-95"
              >
                <Text size="xs" color="white" align="center" className="mb-4 opacity-90">
                  Proven Daily At
                </Text>
                <OptimizedImage
                  src="/images/the-anchor/the-anchor-exterior.jpg"
                  alt="Exterior of The Anchor in Stanwell Moor"
                  width={320}
                  height={180}
                  className="mx-auto mb-4 rounded-lg"
                  style={{ width: 'auto', height: 'auto' }}
                />
                <Text color="white" align="center" className="opacity-90 font-semibold">
                  Real venue experience + measurable growth systems
                </Text>
                <Box
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange to-transparent"
                  position="absolute"
                />
              </Card>
            </a>
          </Grid>
        </AnimatedItem>
      </Section>

      {/* Results */}
      <Section background="teal">
        <Heading level={2} color="white" align="center" className="mb-4">
          Real Results from The Anchor
        </Heading>
        <Text size="lg" color="white" align="center" className="opacity-90 mb-10 max-w-2xl mx-auto">
          Not projections. Not estimates. These are real outcomes from a real pub, using the same
          systems we deliver for clients.
        </Text>
        <Grid columns={{ default: 1, md: 3 }} gap="large">
          <CaseStudyCard id="anchor-midweek-turnaround" />
          <CaseStudyCard id="anchor-food-gp" />
          <CaseStudyCard id="anchor-social-growth" />
        </Grid>
        <Box className="text-center mt-8">
          <Button href="/results" variant="secondary" size="large">
            See More Results
          </Button>
        </Box>
      </Section>

      {/* Latest Pub Marketing Guides */}
      {recentPosts && recentPosts.length > 0 && (
        <Section background="white">
          <Heading level={2} align="center" className="mb-4">
            Latest Pub Marketing Guides
          </Heading>
          <Text size="lg" color="muted" align="center" className="mb-10 max-w-2xl mx-auto">
            Practical advice from a working licensee. Every guide is tested at The Anchor first.
          </Text>
          <Grid columns={{ default: 1, md: 2, lg: 3 }} gap="large">
            {recentPosts.map((post) => (
              <AnimatedItem key={post.slug} animation="slide-up" delay={100}>
                <Link href={`/licensees-guide/${post.slug}`} className="block group h-full">
                  <Card
                    variant="bordered"
                    className="h-full p-6 transition-all hover:shadow-lg hover:-translate-y-1"
                  >
                    <Heading level={3} className="mb-2 group-hover:text-orange transition-colors">
                      {post.title}
                    </Heading>
                    <Text color="muted" className="mb-4 line-clamp-2">
                      {post.excerpt}
                    </Text>
                    <Text size="sm" color="muted">
                      {post.readingTime} min read
                    </Text>
                  </Card>
                </Link>
              </AnimatedItem>
            ))}
          </Grid>
          <Box className="text-center mt-8">
            <Button href="/licensees-guide" variant="secondary">
              Browse All Guides
            </Button>
          </Box>
        </Section>
      )}

      {/* Areas We Cover */}
      <Section background="cream">
        <Heading level={2} align="center" className="mb-4">
          Areas We Cover
        </Heading>
        <Text size="lg" color="muted" align="center" className="mb-10 max-w-2xl mx-auto">
          Pub marketing support across Surrey and the South East. Based at The Anchor in Stanwell
          Moor, serving independent pubs locally.
        </Text>
        <Grid columns={{ default: 2, md: 4 }} gap="medium">
          {[
            { label: 'Surrey', href: '/pub-marketing-surrey' },
            { label: 'London', href: '/pub-marketing-london' },
            { label: 'Berkshire', href: '/pub-marketing-berkshire' },
            { label: 'Buckinghamshire', href: '/pub-marketing-buckinghamshire' },
            { label: 'Hampshire', href: '/pub-marketing-hampshire' },
            { label: 'Hertfordshire', href: '/pub-marketing-hertfordshire' },
            { label: 'Kent', href: '/pub-marketing-kent' },
            { label: 'Oxfordshire', href: '/pub-marketing-oxfordshire' },
          ].map((area) => (
            <AnimatedItem key={area.href} animation="slide-up" delay={100}>
              <Link href={area.href} className="block group">
                <Card
                  variant="bordered"
                  className="!p-3 sm:!p-4 md:!p-6 text-center transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <Heading
                    level={3}
                    className="text-sm sm:text-base md:text-lg group-hover:text-orange transition-colors break-words"
                  >
                    {area.label}
                  </Heading>
                  <Text size="xs" color="muted" className="mt-1 sm:text-sm">
                    Pub Marketing
                  </Text>
                </Card>
              </Link>
            </AnimatedItem>
          ))}
        </Grid>
      </Section>

      {/* FAQ Section */}
      <Section background="white">
        <Heading level={2} className="text-center mb-8">
          Frequently Asked Questions
        </Heading>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </Section>

      {/* Final CTA */}
      <Section background="orange-light" padding="small">
        <AnimatedItem animation="scale" delay={300}>
          <Container maxWidth="3xl" center className="text-center">
            <Heading level={2} align="center" className="mb-4">
              Ready to Fill More Seats?
            </Heading>
            <Text size="lg" align="center" className="mb-6 max-w-2xl mx-auto">
              Tell Peter where momentum is stuck. He&apos;ll point you to the right package and the
              fastest next step.
            </Text>
            <PackageCTA />
            <Text size="sm" color="muted" align="center" className="mt-4">
              Packages from £375 + VAT. Payment plans available.
            </Text>
          </Container>
        </AnimatedItem>
      </Section>
    </AsyncErrorBoundary>
  );
}
