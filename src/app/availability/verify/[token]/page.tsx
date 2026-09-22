import type { Metadata } from 'next';
import BackOfficeBand, { CARD_ON_PAPER } from '@/components/admin/BackOfficeBand';
import BackOfficeHero from '@/components/admin/BackOfficeHero';
import { Alert, Button } from '@/components/oj';
import { verifyOrganiserEmail, type PollLinks } from '@/app/actions/polls';

/**
 * The magic-link landing page.
 *
 * The [token] is the `verify_token`, not the organiser token. Verification is a
 * plain GET, and the outcome is decided and rendered entirely on the server, so
 * the poll goes live and the links are readable before any script runs. Nothing
 * on the screen is interactive beyond its links. `Alert` and `Button` are client
 * components, so they do bring a small hydration bundle with them; nothing the
 * organiser needs from this page waits on it.
 *
 * Verifying on GET means an email-scanner prefetch can consume the token. The
 * token IS single-use, so a scanner's prefetch publishes the poll and the
 * organiser's own click then shows the "didn't work" outcome. That is the
 * accepted trade-off, and it is exactly why verification also emails the links:
 * they reach the organiser regardless of who or what clicked first. Do not "fix"
 * this by making the token reusable: a reusable magic link is a permanent
 * capability sitting in an inbox.
 */

// This page mutates state. It must never be cached or statically rendered.
export const dynamic = 'force-dynamic';
// Verification consumes a single-use token and must read the poll's live state,
// never a cached one. See the organiser page for the Data Cache reasoning.
export const fetchCache = 'force-no-store';

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
 * The frame both outcomes share: the ink hero, then the message on a paper band,
 * the shape the public 404 takes. It used to be a centred column with a round
 * tick or cross above the heading; the public pages carry no badge, and the
 * alert's green or red rule and the heading already say which way it went.
 */
function Outcome({
  title,
  children,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <main id="main-content">
      <BackOfficeHero eyebrow="confirm your email" title={title} />
      <BackOfficeBand tone="paper" divider={false}>
        <div className="max-w-xl space-y-6">{children}</div>
      </BackOfficeBand>
    </main>
  );
}

/**
 * A link the organiser has to keep. Selectable text in a bordered block rather
 * than a copy button: there is no toast component, so a "copied!" confirmation
 * has nowhere to live without adding a client boundary, and these same links are
 * already sitting in the organiser's inbox. `select-all` means one tap selects
 * the whole URL on iOS.
 */
function LinkBlock({
  label,
  note,
  url,
}: {
  label: string;
  note?: string;
  url: string;
}): JSX.Element {
  return (
    <div className={CARD_ON_PAPER}>
      <p className="oj-eyebrow m-0">{label}</p>
      {note ? <p className="mt-2 text-[14px] leading-normal text-oj-ink-2">{note}</p> : null}
      <p className="mt-2 select-all break-all font-mono text-[14px] leading-normal text-oj-ink">
        {url}
      </p>
    </div>
  );
}

/** Success. Renders both links, clearly separated and labelled. */
function SuccessOutcome({ links }: { links: PollLinks }): JSX.Element {
  return (
    <Outcome title="you're all set.">
      <Alert tone="ok" role="status" title="Your poll is live">
        Share the link below with your team. They don&apos;t need an account, they just tap three
        buttons and they&apos;re done.
      </Alert>

      <LinkBlock label="Your team's link" url={links.participantUrl} />

      <LinkBlock
        label="Private: just for you"
        note="Keep this one. Anyone who has it can close the poll and confirm the time."
        url={links.organiserUrl}
      />

      <Button
        variant="primary"
        size="lg"
        href={`/availability/o/${links.organiserToken}`}
        className="w-full md:w-auto"
      >
        See my results
      </Button>
    </Outcome>
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
    <Outcome title="that link didn't work.">
      <Alert tone="danger" title="We couldn't confirm your email">
        Confirmation links work once and last a day. If you&apos;ve already used it, your links are
        in the email we sent straight afterwards. Otherwise, set up a new poll.
      </Alert>

      <Button variant="ghost" size="lg" href="/availability/new" className="w-full md:w-auto">
        Set up a new poll
      </Button>
    </Outcome>
  );
}
