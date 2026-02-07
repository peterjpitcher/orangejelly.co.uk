import OptimizedImage from '@/components/OptimizedImage';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import WhatsAppButton from '@/components/WhatsAppButton';
import FAQItem from '@/components/FAQItem';
import Heading from '@/components/Heading';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Grid from '@/components/Grid';
import AnimatedItem from '@/components/AnimatedItem';
import FeatureList from '@/components/FeatureList';
import AvailabilityStatus from '@/components/AvailabilityStatus';
import { breadcrumbPaths } from '@/components/Breadcrumb';
import RelatedLinks from '@/components/RelatedLinks';

// Import related links data
import relatedLinksData from '../../../content/data/related-links.json';
import Text from '@/components/Text';
import { CONTACT } from '@/lib/constants';
import { FAQSchema } from '@/components/StructuredData';
import { HandshakeIcon, IdeaIcon, SupportIcon } from '@/components/icons/JourneyIcons';
// Local FAQ data

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ContactPageProps {
  // No props needed - using local data
}

// Contact FAQs
const fallbackFAQs = [
  {
    question: 'How quickly can we get started?',
    answer:
      "Fast. Message me on WhatsApp and I'll reply as quickly as I can. We start with the highest-impact quick wins, then build a 30-day plan to create measurable momentum.",
  },
  {
    question: 'Trade is under pressure. Can we talk today?',
    answer:
      'Yes. WhatsApp me at 07990 587315 and share your biggest bottleneck. If I am in service, I will come back to you as soon as I can so we can map your next actions.',
  },
  {
    question: "I messaged but haven't heard back - did you get it?",
    answer:
      "I personally read every message. If it's been a while, please send a follow-up in case technology failed. You're not bothering me - this is exactly what I do.",
  },
  {
    question: "What's the best way to contact Orange Jelly?",
    answer:
      "WhatsApp is fastest: 07990 587315. Phone and email both work too, but WhatsApp is usually easiest while we're both in hospitality hours.",
  },
  {
    question: 'Will I speak to someone who understands hospitality operations?',
    answer:
      "Yes. I'm Peter. Billy runs The Anchor day-to-day and I handle marketing and growth. You speak directly to us, not a sales team.",
  },
  {
    question: 'I work long hospitality hours - when can I reach you?',
    answer:
      "Message anytime. I understand hospitality schedules and will respond as soon as I can around service. We'll find a slot that works for both of us.",
  },
  {
    question: 'I hate pushy sales calls - will you pressure me?',
    answer:
      "Never. We'll talk through your goals and constraints, then I'll share the most practical next step. No scripts, no pressure.",
  },
  {
    question: 'Can I visit before committing to anything?',
    answer:
      'Yes. Come to The Anchor and see the systems in action. You can chat with Billy, see how we run the routines, and decide if the approach fits your venue.',
  },
  {
    question: 'What if I need help outside normal hours?',
    answer:
      "Hospitality doesn't run on normal hours. Message whenever you need to and I'll reply as soon as I can.",
  },
  {
    question: "I'm not in your area - can you still help?",
    answer:
      'Absolutely. Strategy, marketing systems, menu work, and AI-enabled workflows can all be delivered remotely over video and screen share.',
  },
  {
    question: 'What if I just need 10 minutes of advice?',
    answer:
      "That's fine. Send the question. If it's quick, I'll answer quickly. If it needs depth, we'll schedule a focused call.",
  },
  {
    question: "How do I know you'll actually respond?",
    answer:
      "Every message comes directly to me. You will always get a response, even if it's a short note to say I'm in service and will follow up shortly.",
  },
];

export default function ContactPage({}: ContactPageProps) {
  // Use local FAQ data
  const displayFAQs = fallbackFAQs;
  const contactLinks = (
    (
      relatedLinksData as {
        contact?: { links: Array<{ title: string; href: string; description?: string }> };
      }
    ).contact?.links || []
  ).map((link) => ({
    ...link,
    description: link.description || '',
  }));
  // Generate comprehensive schema for Contact page
  const contactSchema = (() => {
    const contactPageSchema = {
      '@type': 'ContactPage',
      name: 'Contact Orange Jelly',
      description:
        'Get in touch with Peter Pitcher, hospitality growth partner for hospitality businesses. WhatsApp, phone, or visit The Anchor.',
      url: 'https://www.orangejelly.co.uk/contact',
      mainEntity: {
        '@id': 'https://www.orangejelly.co.uk/#organization',
      },
    };

    const orangeJellySchema = {
      '@type': 'ProfessionalService',
      '@id': 'https://www.orangejelly.co.uk/#organization',
      name: 'Orange Jelly Limited',
      telephone: '+44-7990-587315',
      email: 'peter@orangejelly.co.uk',
      founder: {
        '@type': 'Person',
        name: 'Peter Pitcher',
        jobTitle: 'Founder & Hospitality Growth Partner',
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'The Anchor, Horton Road',
        addressLocality: 'Stanwell Moor',
        addressRegion: 'Surrey',
        postalCode: 'TW19 6AQ',
        addressCountry: 'GB',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 51.4563,
        longitude: -0.5152,
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
        description: 'Available via WhatsApp 24/7. In-person meetings by appointment.',
      },
      priceRange: '£75 per hour plus VAT',
      paymentAccepted: ['Cash', 'Bank Transfer', 'Invoice'],
      areaServed: {
        '@type': 'Country',
        name: 'United Kingdom',
      },
    };

    const anchorSchema = {
      '@type': 'LocalBusiness',
      '@id': 'https://www.orangejelly.co.uk/#theanchor',
      name: 'The Anchor',
      description:
        'Traditional pub in Stanwell Moor, home of Orange Jelly. See our action-first growth systems in action.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Horton Road',
        addressLocality: 'Stanwell Moor',
        addressRegion: 'Surrey',
        postalCode: 'TW19 6AQ',
        addressCountry: 'GB',
      },
      telephone: '+44-1784-252832',
      parentOrganization: {
        '@id': 'https://www.orangejelly.co.uk/#organization',
      },
    };

    return {
      '@context': 'https://schema.org',
      '@graph': [orangeJellySchema, anchorSchema, contactPageSchema],
    };
  })();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />

      <FAQSchema faqs={displayFAQs} />

      <Hero
        title="Talk to a Hospitality Growth Partner"
        subtitle="I'm Peter. We run The Anchor and help hospitality partners accelerate growth with transformative, action-first marketing."
        showCTA={true}
        bottomText="Available 7 days a week - hospitality hours understood"
        breadcrumbs={breadcrumbPaths.contact}
        backgroundImage="/images/headers/contact.png"
      />

      {/* Three ways to connect */}
      <Section background="white" padding="large">
        <div className="max-w-4xl mx-auto">
          <Heading level={2} align="center" className="mb-12">
            Three Ways to Start Momentum
          </Heading>

          <Grid columns={{ default: 1, md: 3 }} gap="medium">
            <AnimatedItem animation="slide-up" delay={0}>
              <Card variant="bordered" className="text-center hover:shadow-lg transition-normal">
                <div className="mb-4">
                  <HandshakeIcon />
                </div>
                <Heading level={3} className="mb-4">
                  WhatsApp (Fastest)
                </Heading>
                <Text color="muted" className="mb-6">
                  Fastest for a quick brief on your goals, current blockers, and what you want to
                  improve first.
                </Text>
                <WhatsAppButton
                  text="Hi Peter, can we discuss growth for my venue?"
                  fullWidth
                  size="large"
                />
                <Text size="sm" color="muted" className="mt-2">
                  Response within hours
                </Text>
              </Card>
            </AnimatedItem>

            <AnimatedItem animation="slide-up" delay={100}>
              <Card variant="bordered" className="text-center hover:shadow-lg transition-normal">
                <div className="mb-4">
                  <IdeaIcon />
                </div>
                <Heading level={3} className="mb-4">
                  Phone Call
                </Heading>
                <Text color="muted" className="mb-6">
                  Great for detailed planning. If I'm in service, I'll return your call as soon as
                  possible.
                </Text>
                <Button href={`tel:${CONTACT.phone}`} variant="primary" size="large" fullWidth>
                  Call {CONTACT.phone}
                </Button>
                <Text size="sm" color="muted" className="mt-2">
                  UK business hours
                </Text>
              </Card>
            </AnimatedItem>

            <AnimatedItem animation="slide-up" delay={200}>
              <Card variant="bordered" className="text-center hover:shadow-lg transition-normal">
                <div className="mb-4">
                  <SupportIcon />
                </div>
                <Heading level={3} className="mb-4">
                  Visit The Anchor
                </Heading>
                <Text color="muted" className="mb-6">
                  See the systems in action and how we run execution rhythms in a real venue.
                </Text>
                <Button
                  href="https://www.the-anchor.pub"
                  variant="primary"
                  size="large"
                  fullWidth
                  external
                >
                  Visit The Anchor Website
                </Button>
                <Text size="sm" color="muted" className="mt-2">
                  First pint's on me
                </Text>
              </Card>
            </AnimatedItem>
          </Grid>
        </div>
      </Section>

      {/* Contact details section */}
      <Section background="cream" padding="large">
        <div className="max-w-5xl mx-auto">
          <Grid columns={{ default: 1, md: 2 }} gap="large">
            <AnimatedItem animation="fade-in">
              <Card variant="bordered" background="white" padding="large">
                <Heading level={2} className="mb-6">
                  Direct Contact Details
                </Heading>

                <div className="space-y-6">
                  <div>
                    <Text weight="semibold" className="mb-2">
                      📱 WhatsApp (Preferred)
                    </Text>
                    <WhatsAppButton
                      text="Hi Peter, I need help accelerating growth for my venue"
                      fullWidth
                      size="medium"
                    />
                    <Text size="sm" color="muted" className="mt-2">
                      Available 7 days - I'll respond within hours
                    </Text>
                  </div>

                  <div>
                    <Text weight="semibold" className="mb-2">
                      📞 Phone
                    </Text>
                    <Button
                      href={`tel:${CONTACT.phone}`}
                      variant="ghost"
                      fullWidth
                      className="justify-start"
                    >
                      {CONTACT.phone}
                    </Button>
                    <Text size="sm" color="muted" className="mt-2">
                      If I'm serving, I'll call back ASAP
                    </Text>
                  </div>

                  <div>
                    <Text weight="semibold" className="mb-2">
                      ✉️ Email
                    </Text>
                    <Button
                      href={`mailto:${CONTACT.email}`}
                      variant="ghost"
                      fullWidth
                      className="justify-start"
                    >
                      {CONTACT.email}
                    </Button>
                    <Text size="sm" color="muted" className="mt-2">
                      Best for briefs and follow-up notes
                    </Text>
                  </div>

                  <div>
                    <Text weight="semibold" className="mb-2">
                      🏠 See The Anchor
                    </Text>
                    <Text color="muted">The photo below links directly to The Anchor website.</Text>
                  </div>
                </div>
              </Card>
            </AnimatedItem>

            <AnimatedItem animation="fade-in">
              <div className="space-y-6">
                <Card variant="colored" background="orange-light" padding="large">
                  <Heading level={3} className="mb-4">
                    Why Work With Us?
                  </Heading>
                  <FeatureList
                    items={[
                      'We run a real venue and understand trading pressure',
                      'No call centre or junior handoff',
                      'Clear priorities and action-first plans',
                      'Modern tools, practical execution',
                      'Pay for progress, not overhead-heavy retainers',
                      'No pushy sales process',
                    ]}
                    icon="check"
                    iconColor="orange"
                  />
                </Card>

                <Card variant="bordered" padding="large">
                  <Heading level={3} className="mb-4">
                    What Happens Next?
                  </Heading>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <Text weight="bold" className="text-orange">
                        1.
                      </Text>
                      <Text>You share your current goals and bottlenecks</Text>
                    </div>
                    <div className="flex gap-3">
                      <Text weight="bold" className="text-orange">
                        2.
                      </Text>
                      <Text>We have a focused conversation (no scripts)</Text>
                    </div>
                    <div className="flex gap-3">
                      <Text weight="bold" className="text-orange">
                        3.
                      </Text>
                      <Text>I map the fastest actions to move the numbers</Text>
                    </div>
                    <div className="flex gap-3">
                      <Text weight="bold" className="text-orange">
                        4.
                      </Text>
                      <Text>We agree a plan your team can actually run</Text>
                    </div>
                    <div className="flex gap-3">
                      <Text weight="bold" className="text-orange">
                        5.
                      </Text>
                      <Text>You build weekly momentum and measurable progress</Text>
                    </div>
                  </div>
                </Card>

                <AvailabilityStatus />
              </div>
            </AnimatedItem>
          </Grid>
        </div>
      </Section>

      {/* Map section */}
      <Section background="white" padding="medium">
        <div className="max-w-5xl mx-auto">
          <Card variant="bordered" className="overflow-hidden">
            <a
              href="https://www.the-anchor.pub"
              target="_blank"
              rel="noopener noreferrer"
              className="group block relative h-96 bg-cream"
              aria-label="Visit The Anchor website"
            >
              <OptimizedImage
                src="/images/the-anchor/the-anchor-exterior.jpg"
                alt="Exterior of The Anchor pub in Stanwell Moor"
                width={1200}
                height={400}
                className="object-cover w-full h-full transition-opacity group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <Heading level={3} color="white" className="mb-2">
                    See The Anchor in Action
                  </Heading>
                  <Text color="white">
                    Real hospitality execution, live and running day to day.
                  </Text>
                </div>
              </div>
            </a>
          </Card>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section background="cream" padding="large">
        <div className="max-w-4xl mx-auto">
          <Heading level={2} align="center" className="mb-4">
            Common Questions
          </Heading>
          <Text align="center" color="muted" className="mb-12">
            Real questions from hospitality partners
          </Text>

          <div className="space-y-6">
            {displayFAQs.map((faq, index) => (
              <AnimatedItem key={index} animation="slide-up" delay={index * 50}>
                <FAQItem question={faq.question} answer={faq.answer} />
              </AnimatedItem>
            ))}
          </div>
        </div>
      </Section>

      {/* Trust section */}
      <Section background="white" padding="large">
        <div className="max-w-3xl mx-auto text-center">
          <Heading level={2} className="mb-8">
            Partner-Level Support, No Agency Layers
          </Heading>

          <div className="space-y-6">
            <Text size="lg">
              You get direct access to an operator who works in hospitality every week.
            </Text>

            <Text size="lg">
              I'm Peter Pitcher. Billy runs The Anchor day-to-day, and I handle marketing and
              business development. We test every system in our own venue before we recommend it.
            </Text>

            <Text size="lg">
              Our approach is proactive, modern, and action-first. We focus on bookings, visibility,
              repeat visits, and revenue, not vanity activity.
            </Text>

            <Text size="lg" weight="semibold">
              Disruptive thinking, safe execution: we modernise your marketing without destabilising
              your operation.
            </Text>

            <Text size="lg">
              You are paying for practical progress and direct support from a small team, not agency
              layers or office overhead.
            </Text>
          </div>

          <div className="mt-12 max-w-2xl mx-auto">
            <div className="relative w-full" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <OptimizedImage
                src="/images/peter-and-billy-anchor.jpg"
                alt="Peter Pitcher and Billy Summers at The Anchor pub"
                width={600}
                height={400}
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </div>
            <Text size="sm" color="muted" className="mt-4 text-center">
              Billy and me at The Anchor - where we test everything before recommending it
            </Text>
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <Section background="charcoal" padding="large">
        <div className="max-w-2xl mx-auto text-center">
          <Heading level={2} color="white" className="mb-6">
            Ready to Build Momentum?
          </Heading>
          <Text size="lg" color="white" className="mb-8">
            Share your biggest growth challenge and we'll map the fastest, practical next steps.
          </Text>

          <div className="space-y-4">
            <WhatsAppButton
              text="Peter, I need help accelerating growth for my venue"
              size="large"
            />
            <Text size="sm" color="white" className="opacity-80">
              {CONTACT.phone} • Available 7 days • We understand hospitality hours
            </Text>
          </div>
        </div>
      </Section>

      {/* Related links */}
      <Section background="cream" padding="medium">
        <RelatedLinks title="Next Steps" links={contactLinks} variant="card" />
      </Section>
    </>
  );
}
