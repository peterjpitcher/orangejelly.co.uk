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
    question: "I'm losing money every day - how quickly can you help?",
    answer:
      "I understand the urgency - every day matters when you're bleeding money. WhatsApp me right now and I'll respond within hours (or after service if I'm behind the bar). We focus on immediate quick wins, but the full turnaround happens inside 30 days so you can actually breathe again.",
  },
  {
    question: 'My pub is in crisis - can we talk today?',
    answer:
      "Absolutely. WhatsApp me at 07990 587315 - I check messages constantly. If you need immediate help, mark your message as URGENT and I'll prioritise it. I've been where you are, and I know that feeling of desperation. Let's talk solutions today.",
  },
  {
    question: "I messaged but haven't heard back - did you get it?",
    answer:
      "I personally read every message! I'll get back as quickly as I can, but bear with me if I'm in service. If it's been a while, please message again - technology sometimes fails. Never worry about 'bothering' me - helping pubs is what I do.",
  },
  {
    question: "What's the best way to contact Orange Jelly for urgent help?",
    answer:
      "WhatsApp is fastest - 07990 587315. For urgent situations, start your message with URGENT. Phone calls work too, but if I'm serving, WhatsApp ensures I see your message and can respond as soon as I'm free.",
  },
  {
    question: 'Can I speak to someone who actually understands pub problems?',
    answer:
      "That's exactly what you get! I'm Peter. Billy runs The Anchor day-to-day, and I handle marketing and business development. When you message, you're talking to someone who's dealt with staff walking out mid-shift, empty Tuesday nights, and supplier nightmares. No call centre, no junior staff - just one licensee helping another.",
  },
  {
    question: 'I work crazy hours - when can I actually reach you?',
    answer:
      "That's pub life! Message me anytime - 3am stocktake, 6am delivery, Sunday afternoon crisis. I get it. WhatsApp me whenever suits you. I might be serving too, but I'll respond as quickly as I can. We'll find a time to talk properly that works for both of us.",
  },
  {
    question: 'I hate pushy sales calls - will you pressure me?',
    answer:
      "Never. I'm a licensee, not a salesperson. When we chat, I'll listen to your problems and share what worked for us. If I can help, great. If not, I might know someone who can. No scripts, no pressure - just honest conversation about saving your pub.",
  },
  {
    question: 'Can I visit before committing to anything?',
    answer:
      "Please do! Come to The Anchor and see everything in action. Watch how we use the tools, chat with Billy, see our results firsthand. First pint's on me. Seeing is believing - I'd rather show you than tell you. We're in Stanwell Moor, TW19 6AQ.",
  },
  {
    question: 'What if I need help outside normal hours?',
    answer:
      "'Normal hours' don't exist in hospitality! Message me whenever you need help. Having a 3am panic about tomorrow's event? Send that message. Sunday staff crisis? I'm here. Billy runs The Anchor day-to-day and I handle marketing, so I know problems don't wait for business hours.",
  },
  {
    question: "I'm not in your area - can you still help?",
    answer:
      "Absolutely. Marketing, menu design, business analysis, and AI training all work remotely over video calls and screen sharing. If you're outside Surrey/Berkshire/West London, we can still work together without travel.",
  },
  {
    question: 'What if I just need 10 minutes of advice?',
    answer:
      "That's fine! Quick questions are welcome. Sometimes 10 minutes of good advice can save hours of stress. Message me your question - if it's genuinely quick, I'll help right away. If it needs more time, we'll arrange a proper chat.",
  },
  {
    question: "How do I know you'll actually respond?",
    answer:
      "Because I'm not a big company - I'm one person who genuinely cares about helping pubs survive. Every message comes directly to my phone. I've been ghosted by suppliers and consultants too - I won't do that to you. You'll always get a response, even if it's just to say I'm in service and will call back later.",
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
        'Get in touch with Peter Pitcher, hospitality marketing specialist serving pubs, restaurants, and bars. WhatsApp, phone, or visit The Anchor pub.',
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
        jobTitle: 'Founder & Hospitality Marketing Specialist',
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
        'Traditional pub in Stanwell Moor, home of Orange Jelly. See our marketing strategies in action.',
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
        title="Talk to Someone Who Gets It"
        subtitle="I'm Peter. I run a pub and help pubs, restaurants, and bars fill tables with hospitality marketing that works."
        showCTA={true}
        bottomText="Available 7 days a week - pub hours understood"
        breadcrumbs={breadcrumbPaths.contact}
        backgroundImage="/images/headers/contact.png"
      />

      {/* Three ways to connect */}
      <Section background="white" padding="large">
        <div className="max-w-4xl mx-auto">
          <Heading level={2} align="center" className="mb-12">
            Three Ways to Get Help
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
                  I see messages immediately, even during service. Perfect for urgent help or quick
                  questions.
                </Text>
                <WhatsAppButton
                  text="Hi Peter, got time for a quick chat about my pub?"
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
                  Great for detailed discussions. If I'm serving, I'll call you back as soon as I'm
                  free.
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
                  See everything in action. Chat over a pint and watch how we use the tools that
                  saved us.
                </Text>
                <Button
                  href="https://maps.google.com/?q=The+Anchor+Stanwell+Moor+TW19+6AQ"
                  variant="primary"
                  size="large"
                  fullWidth
                  external
                >
                  Get Directions
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
                      text="Hi Peter, I need help with my pub"
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
                      For non-urgent enquiries
                    </Text>
                  </div>

                  <div>
                    <Text weight="semibold" className="mb-2">
                      🏠 Visit Us
                    </Text>
                    <Text>The Anchor</Text>
                    <Text>Horton Road, Stanwell Moor</Text>
                    <Text>Staines TW19 6AQ</Text>
                    <Button
                      href="https://maps.google.com/?q=The+Anchor+Stanwell+Moor+TW19+6AQ"
                      variant="ghost"
                      className="mt-2"
                      external
                    >
                      Get directions →
                    </Button>
                  </div>
                </div>
              </Card>
            </AnimatedItem>

            <AnimatedItem animation="fade-in">
              <div className="space-y-6">
                <Card variant="colored" background="orange-light" padding="large">
                  <Heading level={3} className="mb-4">
                    Why Talk to Me?
                  </Heading>
                  <FeatureList
                    items={[
                      'I run a pub - I understand your challenges',
                      'No call centre or junior staff',
                      'Available when you need help (pub hours!)',
                      'Honest advice from real experience',
                      'No pushy sales tactics - ever',
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
                      <Text>You message me about your situation</Text>
                    </div>
                    <div className="flex gap-3">
                      <Text weight="bold" className="text-orange">
                        2.
                      </Text>
                      <Text>We have a proper chat (no scripts!)</Text>
                    </div>
                    <div className="flex gap-3">
                      <Text weight="bold" className="text-orange">
                        3.
                      </Text>
                      <Text>I share what worked for us</Text>
                    </div>
                    <div className="flex gap-3">
                      <Text weight="bold" className="text-orange">
                        4.
                      </Text>
                      <Text>We create a plan that fits your pub</Text>
                    </div>
                    <div className="flex gap-3">
                      <Text weight="bold" className="text-orange">
                        5.
                      </Text>
                      <Text>You start seeing results in days</Text>
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
            <div className="relative h-96 bg-cream">
              <OptimizedImage
                src="/images/the-anchor-map.jpg"
                alt="Map showing The Anchor pub location in Stanwell Moor"
                width={1200}
                height={400}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <Heading level={3} color="white" className="mb-2">
                    Experience Excellence in Hospitality Online
                  </Heading>
                  <Text color="white">
                    See The Anchor's award-winning online presence firsthand
                  </Text>
                  <Text color="white" size="sm">
                    Visit our website to see how we've transformed our digital footprint
                  </Text>
                  <Button
                    href="https://www.the-anchor.pub"
                    variant="primary"
                    size="small"
                    className="mt-4"
                    external
                  >
                    Visit The Anchor Website
                  </Button>
                </div>
              </div>
            </div>
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
            Real questions from real licensees - because I've been there too
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
            No Corporate Nonsense
          </Heading>

          <div className="space-y-6">
            <Text size="lg">I'm not a marketing agency. I'm not a consultant with theories.</Text>

            <Text size="lg">
              I'm Peter Pitcher. Billy runs The Anchor pub day-to-day, and I handle marketing and
              business development around a full-time role. Every day I face the same challenges you
              do.
            </Text>

            <Text size="lg">
              When you contact me, you're talking to someone who's cleaned up after a kitchen
              disaster at 2am, dealt with no-shows on a busy Friday, and watched competitors steal
              customers.
            </Text>

            <Text size="lg" weight="semibold">
              I've been where you are. I found solutions that work at The Anchor. If you want, I can
              help you implement the same approach.
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
            Stop Struggling Alone
          </Heading>
          <Text size="lg" color="white" className="mb-8">
            Every day you wait is money lost and stress gained. Let's turn your pub around -
            starting today.
          </Text>

          <div className="space-y-4">
            <WhatsAppButton text="Peter, I need help with my pub" size="large" />
            <Text size="sm" color="white" className="opacity-80">
              {CONTACT.phone} • Available 7 days • I understand pub hours
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
