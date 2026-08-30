/**
 * `/why-revenue-is-falling`, formerly `/pub-rescue`.
 *
 * Two changes, both Peter's.
 *
 * DE-SECTORED. The six causes behave the same way in a professional services firm, a
 * trade business, a shop and a venue, because they are about demand, margin,
 * conversion and systems rather than about what you sell. `/pub-rescue` earned 6
 * clicks in twelve months and the query "pub rescue" earned none of them, so the move
 * costs almost nothing, and D14 puts these landing pages in the free-to-restructure
 * group.
 *
 * REFRAMED. "Rescue" carries insolvency connotations in UK usage, and a page that
 * turns away businesses which genuinely cannot pay should not be wearing the word.
 * More than that, it was the wrong promise: the page never offered to stop the fall,
 * it offered to find the cause. So the page now says that, and the positive intent
 * lives in what is actually on offer rather than in softer language about the same
 * thing.
 *
 * IT IS FALLING, NOT FLAT. That is what separates this from
 * `/growth-problems/growth-has-stalled`, which is the same six areas at rest. A
 * business losing revenue week on week has less time and fewer options than one that
 * has plateaued, and the page is written for that difference.
 *
 * It still refuses the emergency framing. A business that genuinely cannot pay this
 * month needs an accountant and an insolvency practitioner, and saying so is both
 * true and the reason to trust the rest of it.
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
 * The five questions the old page ranked for.
 *
 * The questions are kept word for word, because the search value is in them and the
 * FAQPage schema maps this same array. The answers are rewritten: the originals
 * quoted a package at a price (D3), were written in the founder's first person (D21),
 * and one promised the first conversation would happen the same week, which is a
 * response-time promise in all but name (D23).
 */
export const FAQS = [
  {
    q: 'How quickly can you help?',
    a: 'There are two clocks here and it helps to separate them. The first is how soon you know more than you do now: that is one hour, free, going through what is actually happening, what you have already tried and what we would look at first. The second is how long the cause takes to find, normally a week or two of looking at real numbers, because a cause guessed at in a day is the one that gets fixed twice. We will not put a date on a web page that we cannot keep for everybody who reads it. If it is urgent, say so in your first line and we will treat it that way.',
  },
  {
    q: 'What if we cannot afford help right now?',
    a: 'Say so early. It changes what we would recommend, not whether we will talk to you. The first hour costs nothing, so the money question only applies to what comes after it, and by then you will know what the problem actually is. There is no price on this site because every engagement is scoped to the problem and agreed in writing before anything starts, and a business with less room than usual is exactly the one that should not be sold a large programme. Sometimes the honest recommendation is a small piece of work. Sometimes it is that you now know enough to go and do it yourself.',
  },
  {
    q: 'Do you work with all types of business?',
    a: 'Yes, within one limit. The six causes above behave the same way in a professional services firm, a trade business, a shop and a venue, because they are about demand, margin, conversion and systems rather than about what you sell. Where it does not transfer is anything needing sector accreditation or technical knowledge of your field. If that is you, we will say so inside the first hour and point you at someone better placed, rather than take the work.',
  },
  {
    q: 'What makes you different from other consultants?',
    a: 'We look before we propose. It is easy to arrive with the answer already chosen and treat the diagnosis as a formality on the way to it, and that is how businesses end up paying for the wrong fix. We would rather spend a week or two finding out and then tell you the job is smaller than you feared. That is easier to say when you run a business yourself: The Anchor is our own venue, a real trading business with a wage bill and suppliers, and everything on this site was tested there before it was offered to anybody.',
  },
  {
    q: 'What if it does not work?',
    a: 'We agree the measure and take the baseline before anything is built, so that question has an answer rather than an argument. We stay close through the first month, review against the baseline rather than against activity, and change direction when the number says to. If it is not moving we will say that too.',
  },
] as const;
