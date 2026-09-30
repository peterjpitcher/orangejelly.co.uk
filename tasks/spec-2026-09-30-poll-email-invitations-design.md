# Poll email invitations: design

**Decided by Peter, 30 September 2026.** An organiser can type in email addresses and the system
emails each person an invitation, alongside copying the link and sending it themselves.

This reverses a line in `tasks/availability-poll/SPEC.md` (§7, Q1 route 2, and the "no address
book" notes in §4.3 and §4.4). That spec ruled an invite list out because `/availability/new` is
public, so a list of typed-in addresses would let a stranger use our sending domain to mail anyone.
The decisions below remove that risk rather than accept it.

## Decisions

| # | Decision | Source |
|---|---|---|
| 1 | Only a signed-in admin (ADMIN_EMAILS), on a poll they set up, can send invitations. | Peter |
| 2 | Each invitee gets their own link, `/availability/i/<invite_token>`. | Peter |
| 3 | One automatic reminder to people who have not answered. | Peter |
| 4 | When a time is confirmed, invitees who never answered are told too. | Peter |
| 5 | Resend is on a paid plan: no daily sending budget needed. | Peter |
| 6 | Build and deploy without a spec review round; stop only for surprises. | Peter |
| 7 | At most 50 invitees per poll, as a guard against a pasted list going wrong. | Default |
| 8 | Reminder timing: when the deadline is within 48 hours, or 3 days after the invitation when there is no deadline. Sent by the 03:00 cron. | Default |
| 9 | "Stop emails about this poll" covers the reminder and the confirmation for that person. The deadline reminder to the organiser is unaffected. | Default |

## Data

`poll_invitees` (migration `20260930113639_poll_invitees.sql`, applied to production 30 September
2026): poll, normalised email, unique invite token, the participant they became once they answered
(set null if that answer is deleted), and when the invitation, the reminder and any opt-out
happened. Deleted with the poll (60-day retention). RLS on, no anon or authenticated grants.

## Behaviour

- **Create form:** a "Email the invitation for me" box, shown only to a signed-in admin. The action
  refuses a list from anyone else. The list is stored with the poll and sent the moment it goes
  live (the admin fast path, or verification if that falls back). The success screen says how many
  went and how many did not.
- **Organiser page:** "Invited by email" lists everyone with Answered, Waiting, Email didn't send,
  or Asked us to stop. A signed-in admin can add more, retry the unsent ones, or remove someone.
- **Invitation email:** from the organiser, reply-to the organiser, the options and deadline, the
  personal link, a visible stop link, `List-Unsubscribe` one-click, and an Article 14 notice (the
  organiser gave us the address).
- **Personal link:** the vote screen with the address filled in. Answering through it (or through
  the shared link with the same address) marks the person answered. A second visit offers "Change
  your answers" rather than a second answer. It carries the stop switch (`#emails`).
- **Privacy:** `/privacy` gains "When someone invites you to a poll by email"; the on-page notice
  and the email notice switch to Article 14 wording for invited people only.

## Delivery

Built as two parts (part 1: table, invitations, personal links, tracking, stop switch; part 2: the
reminder pass and the confirmation to invitees who never answered, respecting the stop switch).
They ship in one deploy, because part 1's copy promises the reminder and the confirmation.

## Changes after independent review (30 September 2026)

- `answered_via` (migration `20260930114525`): only an answer through the personal link unlocks
  "change your answers" there. An answer on the shared link with the same address marks the person
  answered but cannot take over or lock out their invite link.
- Invitations are claimed before sending and sent in one Resend batch request, so two overlapping
  sends cannot email anyone twice and 50 invitations no longer take 45 seconds.
- Duplicate adds are skipped (upsert), and a failed read of existing answers stops the add.
- On the verify path the organiser's links email goes before queued invitations, and the fallback
  verify email goes to the address Supabase verified, not the one typed.
