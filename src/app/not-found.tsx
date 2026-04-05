import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import Button from '@/components/Button';
import WhatsAppButton from '@/components/WhatsAppButton';
import Grid from '@/components/Grid';
import Card from '@/components/Card';
import { LandmarkMain } from '@/components/AriaLandmarks';
import RelatedLinks from '@/components/RelatedLinks';

// Import related links data
import relatedLinksData from '../../content/data/related-links.json';
import { CONTACT } from '@/lib/constants';
import { generateStaticMetadata } from '@/lib/metadata';

interface QuickStartLink {
  title: string;
  href: string;
  description: string;
  emoji?: string;
  highlight?: boolean;
}

export const metadata = generateStaticMetadata({
  title: 'Page Not Found',
  description:
    'The page you are looking for could not be found. Let us help you find what you need.',
  path: '/404',
  noIndex: true,
});

export default function NotFound() {
  const quickStartLinks =
    (relatedLinksData as { quickStart?: { links: QuickStartLink[] } }).quickStart?.links || [];

  return (
    <>
      <Hero
        title="Oops! This Page Got Lost"
        subtitle="Looks like this page moved. We will get you back on track."
        showCTA={false}
      />

      <LandmarkMain>
        <Section>
          <div className="max-w-4xl mx-auto text-center">
            <Heading level={2} className="mb-6">
              404 - Page Not Found
            </Heading>

            <Text size="lg" className="mb-8 max-w-2xl mx-auto">
              The page you're looking for is not here anymore. No problem, here are the fastest
              routes to the right section.
            </Text>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button href="/" variant="primary" size="large">
                Back to Homepage
              </Button>
              <Button href="/ways-to-work" variant="secondary" size="large">
                See Our Packages
              </Button>
            </div>
          </div>
        </Section>

        <Section background="cream">
          <div className="max-w-4xl mx-auto">
            <Heading level={2} align="center" className="mb-8">
              Were You Looking For...
            </Heading>

            <Grid columns={{ default: 1, md: 2 }} gap="medium">
              <Card variant="bordered" padding="medium">
                <Heading level={3} className="mb-4">
                  Our Packages?
                </Heading>
                <Text className="mb-4">
                  Four clear packages for every stage of growth. From a one-off fix to ongoing
                  partner support.
                </Text>
                <Button href="/ways-to-work" variant="ghost" size="medium">
                  See Our Packages →
                </Button>
              </Card>

              <Card variant="bordered" padding="medium">
                <Heading level={3} className="mb-4">
                  What We Can Help With?
                </Heading>
                <Text className="mb-4">
                  Social media, events, local visibility, paid ads, content, and more — tested at
                  The Anchor.
                </Text>
                <Button href="/capabilities" variant="ghost" size="medium">
                  See Capabilities →
                </Button>
              </Card>

              <Card variant="bordered" padding="medium">
                <Heading level={3} className="mb-4">
                  Pub Marketing Guide?
                </Heading>
                <Text className="mb-4">
                  The complete pub marketing guide — social media, events, email, local SEO, and
                  menu engineering.
                </Text>
                <Button href="/pub-marketing" variant="ghost" size="medium">
                  Read the Guide →
                </Button>
              </Card>

              <Card variant="bordered" padding="medium">
                <Heading level={3} className="mb-4">
                  Success Stories?
                </Heading>
                <Text className="mb-4">
                  See what we've achieved at The Anchor and the systems we teach.
                </Text>
                <Button href="/results" variant="ghost" size="medium">
                  View Results →
                </Button>
              </Card>
            </Grid>
          </div>
        </Section>

        <Section>
          <div className="max-w-3xl mx-auto text-center">
            <Heading level={2} className="mb-6">
              Still Can't Find What You Need?
            </Heading>

            <Text size="lg" className="mb-8">
              No problem! I'm Peter. Billy runs The Anchor day-to-day, and I handle marketing and
              business development. Let's have a quick chat about where momentum is stuck.
            </Text>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <div>
                <Text className="font-semibold mb-2">Quick Chat on WhatsApp</Text>
                <WhatsAppButton
                  text="Hi Peter, I was looking for something on your website but couldn't find it."
                  label="Message Peter on WhatsApp"
                  size="medium"
                />
              </div>

              <Text>or</Text>

              <div>
                <Text className="font-semibold mb-2">Give Me a Call</Text>
                <Button href={`tel:${CONTACT.phone}`} variant="secondary" size="medium">
                  {CONTACT.phone}
                </Button>
              </div>
            </div>
          </div>
        </Section>

        <Section background="orange-light">
          <RelatedLinks
            title="Popular Pages"
            subtitle="Here's what most hospitality partners are looking for"
            links={quickStartLinks}
            variant="card"
            columns={{ default: 1, md: 3 }}
          />
        </Section>
      </LandmarkMain>
    </>
  );
}
