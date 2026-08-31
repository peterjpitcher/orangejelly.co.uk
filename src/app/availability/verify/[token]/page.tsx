import type { Metadata } from 'next';
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
 * The shell both outcomes sit in.
 *
 * It opens the `<main>` landmark itself. `MainGate` passes the tool routes
 * straight through without one, so before this the skip link at the top of every
 * page pointed at nothing on this screen and there was no main region to jump to.
 * The vote and 404 screens under /availability already carry their own.
 */
function Outcome({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <main id="main-content" className="py-14 md:py-20">
      <div className="page-shell">
        <div className="mx-auto max-w-md space-y-6 text-center">{children}</div>
      </div>
    </main>
  );
}

/**
 * The outcome badge. Decoration: the meaning is carried by the H1 beneath it, so
 * the glyph is hidden from assistive technology.
 *
 * White on the deep orange is 5.24:1. The brand orange would be 2.97:1, which is
 * why the fill is never that one.
 */
function OutcomeBadge({ glyph, tone }: { glyph: string; tone: 'ok' | 'danger' }): JSX.Element {
  return (
    <span
      aria-hidden="true"
      className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full border-1.5 border-oj-ink text-2xl shadow-press-sm ${
        tone === 'ok' ? 'bg-oj-orange-deep text-oj-on-band' : 'bg-oj-cream-2 text-oj-danger'
      }`}
    >
      {glyph}
    </span>
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
    <div className="rounded-oj border-1.5 border-oj-ink bg-oj-cream p-4 text-left shadow-press-sm">
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
    <Outcome>
      <OutcomeBadge glyph="✓" tone="ok" />
      <h1 className="text-[34px] font-black leading-tight tracking-[-0.02em] text-oj-ink">
        You&apos;re all set
      </h1>

      <Alert tone="ok" role="status" title="Your poll is live" className="text-left">
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
    <Outcome>
      <OutcomeBadge glyph="✕" tone="danger" />
      <h1 className="text-[34px] font-black leading-tight tracking-[-0.02em] text-oj-ink">
        That link didn&apos;t work
      </h1>

      <Alert tone="danger" title="We couldn't confirm your email" className="text-left">
        Confirmation links work once and last a day. If you&apos;ve already used it, your links are
        in the email we sent straight afterwards. Otherwise, set up a new poll.
      </Alert>

      <Button variant="ghost" size="lg" href="/availability/new" className="w-full md:w-auto">
        Set up a new poll
      </Button>
    </Outcome>
  );
}
