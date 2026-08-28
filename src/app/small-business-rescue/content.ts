/**
 * `/small-business-rescue`, formerly `/pub-rescue`.
 *
 * De-sectored on Peter's instruction: the page is for any small business whose
 * revenue is actively falling, not only a pub. `/pub-rescue` earned 6 clicks in
 * twelve months and the query "pub rescue" earned none, so the move costs almost
 * nothing and D14 puts these landing pages in the free-to-restructure group.
 *
 * IT IS FALLING, NOT FLAT. That is what separates this from
 * `/growth-problems/growth-has-stalled`, which is the same six areas at rest. A
 * business losing revenue week on week has less time and fewer options than one
 * that has plateaued, and the page is written for that difference.
 *
 * The page still refuses the emergency framing. A business that genuinely cannot
 * pay this month needs an accountant and an insolvency practitioner, and saying so
 * is both true and the reason to trust the rest of it. It also keeps Orange Jelly
 * out of a regulated category it is not in.
 */
export const CAUSES = [
  {
    title: 'Nobody who could buy from you remembers you exist',
    body: 'Visibility decays quietly and nothing tells you it is happening. The enquiries do not stop, they thin, and the month it becomes obvious is nine months after it started.',
  },
  {
    title: 'One good week is propping up three bad ones',
    body: 'The monthly average hides it, so it goes unnoticed until a quarter does the arithmetic for you.',
  },
  {
    title: 'You are selling plenty and keeping very little',
    body: 'Busy and not much better off is a margin problem wearing a demand problem’s clothes, and the usual response, selling harder, makes it worse.',
  },
  {
    title: 'People commit and then do not turn up',
    body: 'A booking, a slot, an appointment, a quote accepted and then gone quiet. It was paid for twice: once when you held it, once when you filled it with nothing.',
  },
  {
    title: 'The team is doing by hand what a system should do',
    body: 'Nobody has time to fix the thing that would give them time, which is precisely how it survives a downturn that kills everything else.',
  },
  {
    title: 'Everybody has a different theory',
    body: 'The most expensive of the six, because it stops any of the others being addressed. Every week spent arguing about the cause is a week the cause continues.',
  },
] as const;

export const WOULD_NOT_DO = [
  'Sell you a marketing retainer for a margin problem.',
  'Start before there is a baseline, because then nobody can tell whether it worked.',
  'Keep going once the slide has stopped and the useful thing is done.',
] as const;

/**
 * The five questions the old page ranked for, kept because the search value is in
 * the questions. Every answer is rewritten: the originals quoted a package at a
 * price (D3), were written in the founder's first person (D21), and one implied a
 * response time (D23).
 */
export const FAQS = [
  {
    q: 'How quickly can you help?',
    a: 'The first conversation is usually the same week, and we will not promise you a date on a web page we cannot keep. What we can say is what happens in it: an hour, free, going through what is actually happening and what we would look at first. If it is urgent we will say so and treat it that way.',
  },
  {
    q: 'What if we cannot afford help right now?',
    a: 'Then say so on the call, because it changes what we would recommend rather than whether we will talk to you. There is no price on this site: every engagement is scoped to the problem and agreed in writing first, and a business losing money is exactly the wrong one to sell a large programme to. Sometimes the honest answer is a short piece of work, and sometimes it is that you do not need us yet.',
  },
  {
    q: 'Do you work with all types of business?',
    a: 'The six causes above behave the same way in a professional services firm, a trade business and a venue, which is why this page is no longer written only for pubs. Where it does not transfer is anything needing sector accreditation or technical knowledge of your field. We will tell you inside the first hour if that is you.',
  },
  {
    q: 'What makes you different from other consultants?',
    a: 'We run a business ourselves. The Anchor is our own venue, a real trading business with a wage bill and suppliers, and everything on this site was tested there before it was offered to anybody. That is a different kind of experience from advising, and it is the reason we will tell you when the answer is that you do not need us.',
  },
  {
    q: 'What if it does not work?',
    a: 'We agree the measure and take the baseline before anything is built, so that question has an answer rather than an argument. We stay close through the first month, review against the baseline rather than against activity, and change direction when the number says to. If it is not moving we will say that too.',
  },
] as const;
