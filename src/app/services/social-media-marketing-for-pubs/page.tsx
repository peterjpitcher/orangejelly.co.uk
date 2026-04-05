import { generateMetadata as generateMeta } from '@/lib/metadata';
import PubServiceLandingPage from '@/components/PubServiceLandingPage';
import Section from '@/components/Section';
import Container from '@/components/Container';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import Card from '@/components/Card';
import Grid from '@/components/Grid';
import FeatureList from '@/components/FeatureList';
import socialMediaData from '../../../../content/data/services/social-media-marketing-for-pubs.json';

export const metadata = generateMeta({
  title: 'Social Media Marketing for Pubs — Instagram, Facebook and More',
  description:
    'Social media marketing for pubs across Instagram and Facebook: a repeatable plan, templates, and execution rhythm that drives bookings and footfall. Packages from £375 + VAT.',
  path: '/services/social-media-marketing-for-pubs',
  ogType: 'website',
});

export default function SocialMediaMarketingForPubsPage() {
  return (
    <>
      <PubServiceLandingPage
        data={socialMediaData}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Social Media Marketing for Pubs' },
        ]}
      />

      {/* Instagram for Pubs Section */}
      <Section background="cream" padding="large">
        <Container maxWidth="6xl">
          <Heading level={2} align="center" className="mb-4">
            Instagram for Pubs
          </Heading>
          <Text size="lg" align="center" className="mb-10 max-w-3xl mx-auto text-charcoal/80">
            Instagram builds awareness and vibe. Most pub accounts fail because they post random
            content with no plan, then give up when it does not move the needle. Here is what
            actually works.
          </Text>

          <Grid columns={{ default: 1, md: 2, lg: 3 }} gap="medium">
            <Card variant="bordered" padding="large">
              <Heading level={3} className="mb-3">
                Reels and Stories workflow
              </Heading>
              <Text color="muted">
                Simple filming prompts, scripts, and templates so you can create short-form content
                on your phone without overthinking it.
              </Text>
            </Card>
            <Card variant="bordered" padding="large">
              <Heading level={3} className="mb-3">
                Caption and hook templates
              </Heading>
              <Text color="muted">
                Ready-to-use copy that sells specific nights: quiz, Sunday lunch, sport, live music,
                and specials.
              </Text>
            </Card>
            <Card variant="bordered" padding="large">
              <Heading level={3} className="mb-3">
                Local visibility routine
              </Heading>
              <Text color="muted">
                What to do for 10 minutes a day to get in front of local customers without spam or
                cringe.
              </Text>
            </Card>
          </Grid>

          <div className="mt-8 max-w-3xl mx-auto">
            <Heading level={3} className="mb-4">
              Instagram tips for busy licensees
            </Heading>
            <FeatureList
              items={[
                'Phone-first content wins for pubs because it feels real and authentic',
                'Batch content in one session per week using AI assistance',
                'Focus on posts that sell a specific night, not generic pub photos',
                'You do not need to post every day — consistency beats frequency',
              ]}
              icon="check"
              iconColor="green"
              spacing="normal"
            />
          </div>
        </Container>
      </Section>

      {/* Facebook for Pubs Section */}
      <Section background="white" padding="large">
        <Container maxWidth="6xl">
          <Heading level={2} align="center" className="mb-4">
            Facebook for Pubs
          </Heading>
          <Text size="lg" align="center" className="mb-10 max-w-3xl mx-auto text-charcoal/80">
            For pubs, Facebook is often more valuable than Instagram because it reaches locals,
            families, and community groups that actually decide where to go. The wins come from
            events, groups, reviews, and a repeatable weekly rhythm.
          </Text>

          <Grid columns={{ default: 1, md: 2, lg: 3 }} gap="medium">
            <Card variant="bordered" padding="large">
              <Heading level={3} className="mb-3">
                Local group playbook
              </Heading>
              <Text color="muted">
                What to post in local Facebook groups, where to post it, and how to avoid getting
                ignored or banned.
              </Text>
            </Card>
            <Card variant="bordered" padding="large">
              <Heading level={3} className="mb-3">
                Event promotion templates
              </Heading>
              <Text color="muted">
                Copy and images you can reuse for quiz night, live sport, food nights, tastings, and
                seasonal events.
              </Text>
            </Card>
            <Card variant="bordered" padding="large">
              <Heading level={3} className="mb-3">
                Reviews and reputation
              </Heading>
              <Text color="muted">
                A simple system for getting more reviews and replying in a way that builds trust
                with locals.
              </Text>
            </Card>
          </Grid>

          <div className="mt-8 max-w-3xl mx-auto">
            <Heading level={3} className="mb-4">
              Why Facebook still matters for pubs
            </Heading>
            <FeatureList
              items={[
                'Facebook Events are one of the best free tools for filling pub nights',
                'Local community groups drive real discovery and word-of-mouth',
                'Reviews on Facebook influence where families and groups choose to go',
                'A tidy page with clear info, menus, and booking links converts visitors',
              ]}
              icon="check"
              iconColor="green"
              spacing="normal"
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
