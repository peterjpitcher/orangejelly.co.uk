import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getVoteView } from '../../p/poll-data';
import VoteScreen from '@/components/polls/vote/vote-screen';
import { getInviteByToken } from '@/lib/db/poll-invitees';
import { isSupabaseAdminConfigured } from '@/lib/db/supabase-admin';
import { isWellFormedToken } from '@/lib/poll-tokens';

/**
 * An invited person's own link: the vote screen, with their address filled in.
 *
 * A signed-in admin can email people an invitation (from 30 September 2026), and
 * each gets this link rather than the shared one. It fills in the address they
 * were invited at, marks them answered when they reply, and is where the
 * "stop emails about this poll" switch lives. Once they have answered it offers
 * to change their answer rather than take a second one.
 *
 * The token is a bearer credential in the URL, like every poll link.
 * `Referrer-Policy: no-referrer` comes from `src/middleware.ts` via
 * `isTokenRoute`, which covers `/availability/i/`.
 */
export const dynamic = 'force-dynamic';
// Live counts, never the Data Cache: see the organiser page for why.
export const fetchCache = 'force-no-store';

export const metadata: Metadata = {
  title: 'Give your availability',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

interface InvitePageProps {
  params: { token: string };
}

export default async function InvitePage({ params }: InvitePageProps): Promise<JSX.Element> {
  // ONE outcome for a malformed token, an unknown one, a removed invitation and
  // a poll that is gone: the real 404 every dead poll link gives.
  if (!isWellFormedToken(params.token) || !isSupabaseAdminConfigured()) notFound();

  const invite = await getInviteByToken(params.token);
  if (!invite) notFound();

  const view = await getVoteView(invite.poll.participant_token);
  if (!view) notFound();

  const participantToken = invite.poll.participant_token;

  return (
    <VoteScreen
      view={view}
      participantToken={participantToken}
      invite={{
        inviteToken: params.token,
        email: invite.invitee.email,
        answeredEditUrl: invite.editToken
          ? `/availability/p/${participantToken}/edit/${invite.editToken}`
          : null,
        emailsOn: invite.invitee.opted_out_at === null,
      }}
    />
  );
}
