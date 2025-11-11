import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import Button from '@/components/Button';
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
    'The page you are looking for could not be found. Let us help you find what you need to fill your pub.',
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
        subtitle="Like a punter who can't find your pub - but don't worry, we'll get you back on track"
        showCTA={false}
      />

      <LandmarkMain>
        <Section>
          <div className="max-w-4xl mx-auto text-center">
            <Heading level={2} className="mb-6">
              404 - Page Not Found
            </Heading>

            <Text size="lg" className="mb-8 max-w-2xl mx-auto">
              The page you're looking for seems to have wandered off like a customer to the pub down
              the road. But don't worry - we've got plenty of ways to help you fill those empty
              tables.
            </Text>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button href="/" variant="primary" size="medium">
                Back to Homepage
              </Button>
              <Button href="/services" variant="secondary" size="medium">
                View Our Services
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
                  Empty Pub Solutions?
                </Heading>
                <Text className="mb-4">
                  If your tables are sitting empty, we've got proven strategies to fill them - fast.
                </Text>
                <Button href="/empty-pub-solutions" variant="ghost" size="small">
                  Fill Your Pub →
                </Button>
              </Card>

              <Card variant="bordered" padding="medium">
                <Heading level={3} className="mb-4">
                  Marketing Help?
                </Heading>
                <Text className="mb-4">
                  Stop wasting time on social media. Let us handle your marketing while you serve
                  customers.
                </Text>
                <Button href="/services#done-for-you-marketing" variant="ghost" size="small">
                  Get Marketing Help →
                </Button>
              </Card>

              <Card variant="bordered" padding="medium">
                <Heading level={3} className="mb-4">
                  Menu Makeover?
                </Heading>
                <Text className="mb-4">
                  Turn your menu into a profit machine with descriptions that make mouths water.
                </Text>
                <Button href="/services#boost-food-sales" variant="ghost" size="small">
                  Boost Food Sales →
                </Button>
              </Card>

              <Card variant="bordered" padding="medium">
                <Heading level={3} className="mb-4">
                  Success Stories?
                </Heading>
                <Text className="mb-4">
                  See how we've helped other pubs go from empty to packed with real results.
                </Text>
                <Button href="/results" variant="ghost" size="small">
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
              No problem! I'm Peter, and I run The Anchor pub. Let's have a chat about what's
              keeping you up at night - I've probably been there too.
            </Text>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <div>
                <Text className="font-semibold mb-2">Quick Chat on WhatsApp</Text>
                <Button
                  href={`https://wa.me/${CONTACT.phoneInternational}?text=Hi%20Peter,%20I%20was%20looking%20for%20something%20on%20your%20website%20but%20couldn't%20find%20it`}
                  variant="primary"
                  size="medium"
                  external
                >
                  Message Peter on WhatsApp
                </Button>
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
            subtitle="Here's what most pub owners are looking for"
            links={quickStartLinks}
            variant="card"
            columns={{ default: 1, md: 3 }}
          />
        </Section>
      </LandmarkMain>
    </>
  );
}
