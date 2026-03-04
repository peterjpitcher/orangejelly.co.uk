import { type Metadata } from 'next';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Container from '@/components/Container';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import Card from '@/components/Card';
import Grid from '@/components/Grid';
import Button from '@/components/Button';
import WhatsAppButton from '@/components/WhatsAppButton';
import FAQItem from '@/components/FAQItem';
import FeatureList from '@/components/FeatureList';
import { FAQSchema } from '@/components/StructuredData';
import { generateMetadata as generateMeta } from '@/lib/metadata';
import Link from '@/components/Link';

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: 'Pub Marketing Agency — Real Results From a Working Pub',
    description:
      'Pub marketing agency run by a licensee, not a desk. We grew food GP from 58% to 71% and built 60-70K monthly social views at The Anchor. £75/hr + VAT.',
    path: '/pub-marketing-agency',
    keywords:
      'pub marketing agency, marketing agency for pubs, digital marketing for pubs, marketing agency for bars, marketing for pubs, pub marketing company',
    ogType: 'website',
  });
}

const faqs = [
  {
    question: 'What makes you different from a normal marketing agency?',
    answer:
      'We run a pub. The Anchor in Stanwell Moor is where every tactic gets tested before we recommend it. Generic agencies sell templates. We sell systems that work behind a real bar, with real staff, on a real budget.',
  },
  {
    question: 'Do you work with pubs outside London and the South East?',
    answer:
      'Yes. Most of our work is remote — WhatsApp, video calls, and shared templates. We prioritise pubs across London, Surrey, Berkshire, and the wider South East for in-person visits, but the systems work anywhere in the UK.',
  },
  {
    question: 'How much does a pub marketing agency cost?',
    answer:
      'We charge £75 per hour plus VAT. No retainers, no lock-in contracts, no minimum spend. Most pubs start with a few focused hours on their biggest problem and scale up once they see results.',
  },
  {
    question: 'Can you help with social media, events, and menus — or just one thing?',
    answer:
      'All of it. Social media, event strategy, menu engineering, email marketing, Google Business Profile, and AI-powered automation. We start with whatever will move the needle fastest for your pub.',
  },
  {
    question: 'How quickly will I see results from pub marketing?',
    answer:
      'Early signals (more enquiries, social engagement, bookings) usually appear within days. Bankable, consistent results — more covers, higher spend, repeat visits — typically build over 30 days as systems bed in.',
  },
];

export default function PubMarketingAgencyPage() {
  return (
    <>
      <FAQSchema faqs={faqs} />

      <Hero
        title="A Pub Marketing Agency That Actually Runs a Pub"
        subtitle="We're not pitching from an office. We built these systems behind the bar at The Anchor — and they work. Now we help other UK pubs do the same."
        showCTA
        ctaText="Hi Peter, I'm looking for a pub marketing agency"
        bottomText="£75/hour + VAT • No retainers • No lock-in"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Pub Marketing Agency' }]}
      />

      {/* Why we're different */}
      <Section background="white" padding="large">
        <Container maxWidth="4xl">
          <Heading level={2} align="center" className="mb-6">
            Why Most Pub Marketing Agencies Miss the Mark
          </Heading>
          <div className="space-y-4 max-w-3xl mx-auto mb-12">
            <Text size="lg" className="text-charcoal/80">
              Most marketing agencies treat pubs like any other small business. They sell generic
              social media packages, monthly retainers, and reports full of impressions that never
              translate to bums on seats.
            </Text>
            <Text size="lg" className="text-charcoal/80">
              The problem? They have never pulled a pint, managed a kitchen GP, or tried to fill a
              Tuesday night in January. They don&apos;t understand that your budget is tight, your
              time is tighter, and you need results you can see on the till — not in a dashboard.
            </Text>
            <Text size="lg" className="text-charcoal/80">
              Orange Jelly is different. Peter Pitcher runs The Anchor in Stanwell Moor. Every
              strategy we recommend has been tested in a real pub, with real staff, on a real
              budget. If it doesn&apos;t work behind the bar, it doesn&apos;t go on this website.
            </Text>
          </div>

          <Grid columns={{ default: 1, md: 3 }} gap="large">
            <Card variant="bordered" padding="large">
              <div className="text-3xl mb-4">🍺</div>
              <Heading level={3} className="mb-3">
                Run by a licensee
              </Heading>
              <Text color="muted">
                Not a marketing graduate. Peter is a Greene King tenant who built these systems to
                solve his own problems first.
              </Text>
            </Card>
            <Card variant="bordered" padding="large">
              <div className="text-3xl mb-4">🧪</div>
              <Heading level={3} className="mb-3">
                Tested at The Anchor
              </Heading>
              <Text color="muted">
                Every tactic runs in our pub before we recommend it. Real conditions, real staff,
                real results.
              </Text>
            </Card>
            <Card variant="bordered" padding="large">
              <div className="text-3xl mb-4">💷</div>
              <Heading level={3} className="mb-3">
                No retainers
              </Heading>
              <Text color="muted">
                £75/hour + VAT. Pay for what you use. No six-month contracts, no minimum spend, no
                surprises.
              </Text>
            </Card>
          </Grid>
        </Container>
      </Section>

      {/* Results */}
      <Section background="teal" padding="large">
        <Container maxWidth="5xl">
          <Heading level={2} color="white" align="center" className="mb-4">
            Real Numbers From a Real Pub
          </Heading>
          <Text
            size="lg"
            color="white"
            align="center"
            className="opacity-90 mb-12 max-w-3xl mx-auto"
          >
            These are results from The Anchor — not projections, not estimates. The same systems we
            use for our clients.
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
                Monthly social media views
              </Text>
            </div>
            <div className="text-center">
              <Text size="2xl" weight="bold" className="text-white">
                25-35
              </Text>
              <Text size="sm" className="text-white/80 mt-1">
                Weekly quiz night regulars
              </Text>
            </div>
            <div className="text-center">
              <Text size="2xl" weight="bold" className="text-white">
                25 hrs/wk
              </Text>
              <Text size="sm" className="text-white/80 mt-1">
                Freed with AI automation
              </Text>
            </div>
          </Grid>
        </Container>
      </Section>

      {/* What we do */}
      <Section background="cream" padding="large">
        <Container maxWidth="6xl">
          <Heading level={2} align="center" className="mb-4">
            What a Pub Marketing Agency Should Actually Do
          </Heading>
          <Text size="lg" align="center" className="mb-12 max-w-3xl mx-auto text-charcoal/80">
            Forget vanity metrics. Here is what moves the needle for pubs.
          </Text>

          <Grid columns={{ default: 1, md: 2 }} gap="large">
            <Card variant="bordered" padding="large">
              <Heading level={3} className="mb-4">
                Social Media That Fills Seats
              </Heading>
              <Text className="mb-4">
                Content that makes locals think &ldquo;I need to go there this week.&rdquo; Not
                stock photos and hashtag spam.
              </Text>
              <FeatureList
                items={[
                  'Batch content creation with AI tools',
                  'Platform strategy for Facebook, Instagram, and Google',
                  'Event promotion templates that drive bookings',
                  'Review management and response frameworks',
                ]}
                icon="check"
                iconColor="green"
                spacing="tight"
              />
              <div className="mt-4">
                <Link
                  href="/licensees-guide/social-media-strategy-for-pubs"
                  className="text-orange hover:text-orange-dark font-medium text-sm"
                >
                  Read: Social media strategy for pubs →
                </Link>
              </div>
            </Card>

            <Card variant="bordered" padding="large">
              <Heading level={3} className="mb-4">
                Events That Build Regulars
              </Heading>
              <Text className="mb-4">
                One strong weekly event can transform your midweek. We design events that are easy
                to run, easy to promote, and easy to repeat.
              </Text>
              <FeatureList
                items={[
                  'Quiz nights that grow from 20 to 35 regulars',
                  'Tasting events with 85% retention',
                  'Seasonal calendars that plan themselves',
                  'Run sheets so your team can deliver without you',
                ]}
                icon="check"
                iconColor="green"
                spacing="tight"
              />
              <div className="mt-4">
                <Link
                  href="/licensees-guide/how-to-run-successful-pub-events"
                  className="text-orange hover:text-orange-dark font-medium text-sm"
                >
                  Read: How to run successful pub events →
                </Link>
              </div>
            </Card>

            <Card variant="bordered" padding="large">
              <Heading level={3} className="mb-4">
                Menu Engineering and Margins
              </Heading>
              <Text className="mb-4">
                Your menu is your biggest profit lever. Small changes to layout, descriptions, and
                pricing can shift GP by double digits.
              </Text>
              <FeatureList
                items={[
                  'Menu audit to find hidden margin opportunities',
                  'Descriptions that sell without discounting',
                  'Upsell training scripts for your team',
                  'Pre-order systems to cut waste (we freed up £250/week)',
                ]}
                icon="check"
                iconColor="green"
                spacing="tight"
              />
              <div className="mt-4">
                <Link
                  href="/licensees-guide/menu-engineering-lift-average-spend"
                  className="text-orange hover:text-orange-dark font-medium text-sm"
                >
                  Read: Menu engineering to lift average spend →
                </Link>
              </div>
            </Card>

            <Card variant="bordered" padding="large">
              <Heading level={3} className="mb-4">
                Local SEO and Digital Presence
              </Heading>
              <Text className="mb-4">
                When someone searches &ldquo;pub near me,&rdquo; you need to show up. Google
                Business Profile is often the fastest win for any pub.
              </Text>
              <FeatureList
                items={[
                  'Google Business Profile optimisation',
                  'Review generation and response systems',
                  'Local directory listings',
                  'Website content that ranks for local searches',
                ]}
                icon="check"
                iconColor="green"
                spacing="tight"
              />
              <div className="mt-4">
                <Link
                  href="/pub-marketing"
                  className="text-orange hover:text-orange-dark font-medium text-sm"
                >
                  See all pub marketing services →
                </Link>
              </div>
            </Card>
          </Grid>
        </Container>
      </Section>

      {/* How it works */}
      <Section background="white" padding="large">
        <Container maxWidth="5xl">
          <Heading level={2} align="center" className="mb-12">
            How Working With Us Works
          </Heading>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'WhatsApp chat',
                desc: 'Tell me what is hurting most. Empty nights? Low margins? No time for marketing? We start there.',
              },
              {
                step: '2',
                title: 'Quick diagnosis',
                desc: 'I identify the one thing that will make the biggest difference in your next 30 days.',
              },
              {
                step: '3',
                title: 'Implement together',
                desc: 'You get templates, scripts, and checklists. I can do it for you or show you how — your choice.',
              },
              {
                step: '4',
                title: 'Measure and build',
                desc: 'We double down on what works. Most pubs see clear momentum within the first month.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-orange text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                  {item.step}
                </div>
                <Heading level={4} className="mb-3">
                  {item.title}
                </Heading>
                <Text size="sm" color="muted">
                  {item.desc}
                </Text>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Who this is for */}
      <Section background="cream" padding="large">
        <Container maxWidth="4xl">
          <Grid columns={{ default: 1, md: 2 }} gap="large">
            <Card background="white" padding="large">
              <Heading level={3} className="mb-4 text-green-700">
                This is for you if…
              </Heading>
              <FeatureList
                items={[
                  'You run a pub and want more covers, not more reports',
                  'You have tried agencies before and got nothing useful',
                  'You need practical help, not a 40-page strategy deck',
                  'You want to talk to someone who understands the trade',
                  'You are a tenant, leaseholder, or free house operator',
                ]}
                icon="check"
                iconColor="green"
                spacing="normal"
              />
            </Card>
            <Card background="white" padding="large">
              <Heading level={3} className="mb-4 text-red-600">
                This is not for you if…
              </Heading>
              <FeatureList
                items={[
                  'You want a big agency with a flashy office',
                  'You need someone to run your pub for you',
                  'You are looking for the cheapest option available',
                  'You are not willing to try new approaches',
                ]}
                icon="bullet"
                iconColor="red"
                spacing="normal"
              />
            </Card>
          </Grid>
        </Container>
      </Section>

      {/* FAQ */}
      <Section background="white" padding="large">
        <Container maxWidth="4xl">
          <Heading level={2} align="center" className="mb-12">
            Common Questions About Pub Marketing Agencies
          </Heading>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
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
              Ready to Work With a Pub Marketing Agency That Gets It?
            </Heading>
            <Text size="lg" className="mb-8 max-w-2xl mx-auto">
              Message me on WhatsApp, tell me what is not working, and I will tell you the fastest
              thing to fix. No pitch decks, no sales calls.
            </Text>
            <WhatsAppButton
              text="Hi Peter, I'm looking for a pub marketing agency that actually understands pubs. Can we chat?"
              label="Message Peter on WhatsApp"
              size="large"
              className="mb-4"
            />
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4">
              <Button href="/contact" variant="outline" size="medium">
                Contact form
              </Button>
              <Button href="/services" variant="ghost" size="medium">
                View all services
              </Button>
            </div>
            <Text size="sm" color="muted" className="mt-4">
              £75/hour + VAT • No retainers • 30-day guarantee
            </Text>
          </div>
        </Container>
      </Section>
    </>
  );
}
