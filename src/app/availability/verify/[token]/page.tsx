import type { Metadata } from 'next';
import Box from '@/components/Box';
import Button from '@/components/Button';
import Heading from '@/components/Heading';
import Section from '@/components/Section';
import Text from '@/components/Text';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { verifyOrganiserEmail, type PollLinks } from '@/app/actions/polls';

/**
 * The magic-link landing page.
 *
 * The [token] is the `verify_token` — not the organiser token. Verification is a
 * plain GET with no client boundary at all: there is nothing interactive here
 * beyond links, so zero client JS is the correct call and the poll goes live
 * with no hydration delay.
 *
 * Verifying on GET means an email-scanner prefetch can consume the token. The
 * token IS single-use, so a scanner's prefetch publishes the poll and the
 * organiser's own click then shows the "didn't work" outcome. That is the
 * accepted trade-off, and it is exactly why verification also emails the links:
 * they reach the organiser regardless of who or what clicked first. Do not "fix"
 * this by making the token reusable — a reusable magic link is a permanent
 * capability sitting in an inbox.
 */

// This page mutates state. It must never be cached or statically rendered.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Confirm your email | Orange Jelly',
  robots: { index: false, follow: false },
};

interface VerifyPageProps {
  params: { token: string };
}

export default async function VerifyPage({ params }: VerifyPageProps): Promise<JSX.Element> {
  const result = await verifyOrganiserEmail(params.token);

  // One branch for every failure: unknown, consumed, expired, already open, or a
  // malformed token. The action returns the same string for all of them, and
  // this page must not add a distinction the action deliberately removed.
  if (!result.success || !result.links) {
    return <InvalidOutcome />;
  }

  return <SuccessOutcome links={result.links} />;
}

/**
 * Success. Renders both links, clearly separated and labelled.
 *
 * The links are selectable text in a bordered box rather than a copy button:
 * there is no toast component, so a "copied!" confirmation has nowhere to live
 * without adding a client boundary — and these same links are already sitting in
 * the organiser's inbox. `select-all` means one tap selects the whole URL on iOS.
 */
function SuccessOutcome({ links }: { links: PollLinks }): JSX.Element {
  return (
    <Section background="cream" padding="large">
      <div className="max-w-md mx-auto text-center space-y-6">
        {/* The meaning is carried by the H1; the glyph is decoration. */}
        <span aria-hidden="true" className="block text-4xl">
          ✓
        </span>
        <Heading level={1} align="center" color="charcoal">
          You&apos;re all set
        </Heading>

        <Alert
          variant="default"
          role="status"
          className="border-orange bg-orange-light text-charcoal text-left"
        >
          <AlertTitle>Your poll is live</AlertTitle>
          <AlertDescription>
            Share the link below with your team — they don&apos;t need an account, they just tap
            three buttons and they&apos;re done.
          </AlertDescription>
        </Alert>

        <Box
          as="div"
          background="white"
          padding="small"
          rounded="md"
          className="border border-border text-left break-all"
        >
          <Text size="sm" color="muted" className="mb-1">
            Your team&apos;s link
          </Text>
          <Text size="sm" as="span" className="font-mono select-all">
            {links.participantUrl}
          </Text>
        </Box>

        <Box
          as="div"
          background="white"
          padding="small"
          rounded="md"
          className="border border-border text-left break-all"
        >
          <Text size="sm" weight="semibold" className="mb-1">
            Private — just for you
          </Text>
          <Text size="sm" color="muted" className="mb-2">
            Keep this one. Anyone who has it can close the poll and confirm the time.
          </Text>
          <Text size="sm" as="span" className="font-mono select-all">
            {links.organiserUrl}
          </Text>
        </Box>

        <Button
          variant="primary"
          size="large"
          href={`/availability/o/${links.organiserToken}`}
          fullWidth
          className="md:w-auto"
        >
          See my results
        </Button>
      </div>
    </Section>
  );
}

/**
 * Invalid, expired, consumed or unknown.
 *
 * Byte-identical for all four causes. A distinguishable response is a token
 * oracle: a caller could walk tokens and learn which polls exist.
 */
function InvalidOutcome(): JSX.Element {
  return (
    <Section background="cream" padding="large">
      <div className="max-w-md mx-auto text-center space-y-6">
        <span aria-hidden="true" className="block text-4xl">
          ✕
        </span>
        <Heading level={1} align="center" color="charcoal">
          That link didn&apos;t work
        </Heading>

        <Alert variant="destructive" className="text-left">
          <AlertTitle>We couldn&apos;t confirm your email</AlertTitle>
          <AlertDescription>
            Confirmation links work once and last a day. If you&apos;ve already used it, your links
            are in the email we sent straight afterwards. Otherwise, set up a new poll.
          </AlertDescription>
        </Alert>

        <Button
          variant="outline"
          size="large"
          href="/availability/new"
          fullWidth
          className="md:w-auto"
        >
          Set up a new poll
        </Button>
      </div>
    </Section>
  );
}
