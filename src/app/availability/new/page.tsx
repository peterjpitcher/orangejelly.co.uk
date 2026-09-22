import type { Metadata } from 'next';
import CreatePollForm from '@/components/polls/create/create-poll-form';
import AuthedNav from '@/components/admin/AuthedNav';
import BackOfficeBand from '@/components/admin/BackOfficeBand';
import BackOfficeHero from '@/components/admin/BackOfficeHero';

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
      <main id="main-content" className="overflow-hidden">
        {/* The ink hero the public reading pages open on. The line is ours, not
            somebody's poll title, so it takes the lowercase display face. */}
        <BackOfficeHero
          eyebrow="new poll"
          title="find a time that works."
          intro="Put up to eight options to your team, send them one link, and see who can make what. No accounts, no app, nothing for them to download."
        />
        {/* Paper, the surface the calendar grid and its cream cells were drawn
            for. The form starts with its own top margin, so the band drops its
            top padding to match the other screens. */}
        <BackOfficeBand tone="paper" divider={false} className="pt-4 sm:pt-6">
          <CreatePollForm />
        </BackOfficeBand>
      </main>
    </>
  );
}
