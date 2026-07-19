import type { Metadata } from 'next';
import Heading from '@/components/Heading';
import Section from '@/components/Section';
import Text from '@/components/Text';
import CreatePollForm from '@/components/polls/create/create-poll-form';
import AuthedNav from '@/components/admin/AuthedNav';

/**
 * Create a poll.
 *
 * A Server Component holding the static chrome; the form is the only client
 * boundary. Nothing on this page is fetched, so there is no loading state to
 * stream — the form handles its own submitting state.
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
      <Section background="cream" padding="large">
        <Heading level={1} align="left" color="charcoal">
          Find a time that works
        </Heading>
        <Text size="lg" color="muted" className="mt-4 max-w-2xl">
          Put up to eight options to your team, send them one link, and see who can make what. No
          accounts, no app, nothing for them to download.
        </Text>
        <CreatePollForm />
      </Section>
    </>
  );
}
