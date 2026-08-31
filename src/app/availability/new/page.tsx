import type { Metadata } from 'next';
import CreatePollForm from '@/components/polls/create/create-poll-form';
import AuthedNav from '@/components/admin/AuthedNav';

/**
 * Create a poll.
 *
 * A Server Component holding the static chrome; the form is the only client
 * boundary. Nothing on this page is fetched, so there is no loading state to
 * stream: the form handles its own submitting state.
 */

export const metadata: Metadata = {
  title: 'Find a time that works | Orange Jelly',
  description:
    'Put up to eight options to your team, send them one link, and see who can make what. No accounts, no app, nothing to download.',
  // A poll-building tool is of no use in search results, and every page under
  // /availability leads to a token URL.
  robots: { index: false, follow: false },
};

export default function NewPollPage(): JSX.Element {
  return (
    <>
      {/* Only visible when you are signed in, so you can move back to your polls
          or the dashboard. A guest creating a poll sees no organiser chrome. */}
      <AuthedNav />
      {/*
        This page opens its own `<main>`. Tool routes are not legacy, so MainGate
        stands back from the landmark and every screen under /availability declares
        one itself; this page was the exception, which left the site-wide skip link
        with no target on it.

        `overflow-hidden` is kept from the Section this replaced: the calendar grid
        inside the form is wider than the column on a small screen, and dropping it
        would turn that into a horizontally scrolling page.
      */}
      <main id="main-content" className="overflow-hidden py-14 md:py-20">
        <div className="page-shell">
          {/* Sentence case and the tool weight, not the lowercase display face.
              This is a working screen, not a marketing page. */}
          <h1 className="text-[clamp(28px,4.5vw,40px)] font-black leading-[1.05] tracking-[-0.02em] text-oj-ink">
            Find a time that works
          </h1>
          {/* `measure-prose`, not `measure`: the latter is the 72rem shell width,
              so an intro paragraph carrying it would run the full page. */}
          <p className="measure-prose mt-4 text-[17px] leading-relaxed text-oj-ink-2">
            Put up to eight options to your team, send them one link, and see who can make what. No
            accounts, no app, nothing for them to download.
          </p>
          <CreatePollForm />
        </div>
      </main>
    </>
  );
}
