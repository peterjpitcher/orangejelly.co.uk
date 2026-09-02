/**
 * The eight growth problems.
 *
 * Ported from the design team's template at
 * `docs/brand/design-system/templates/growth-problem/GrowthProblem.dc.html`, which
 * carried all eight written out. The port is a transform of that source rather than
 * a retype, because retyping a supplied asset is how all seven taxonomy tints
 * silently drifted from the pack.
 *
 * EIGHT PROBLEMS, SIX AREAS. The homepage names six AREAS, which is where growth
 * gets stuck. These are eight SYMPTOMS, which is how it presents. Six map one to
 * one; the other two are "growth has stalled", the umbrella most people arrive
 * with, and "where would AI help", which the keyword research found is the
 * strongest entry cluster the company has. Each problem tags itself with the areas
 * it touches, so the two vocabularies stay joined rather than competing.
 *
 * WHAT CHANGED FROM THE SUPPLIED COPY. Eight lines were rewritten because they
 * broke a decision, and every one of them was an unsupported number: "half of stall
 * diagnoses", "half of AI ideas", "flat for three quarters", "fail at 2x", "once
 * the uplift is halved", and a superlative about response time. Only the five
 * claims in CLAIMS.md may be quantified, and they are all from our own venue. The
 * shared closing section also said EXPOSE, which the method no longer uses, and
 * sold a named diagnostic rather than a conversation.
 *
 * PLAIN ENGLISH, 2 SEPTEMBER 2026. The titles are now what a business owner would
 * say ("Sales are up, profit is not"), not the category ("Margin is under
 * pressure"). The search terms the old titles carried live on in `metaTitle`, which
 * is what the browser tab and the search result show. The proof paragraphs on the
 * three pages with no measured result came down from a hundred and fifty words of
 * explanation to three sentences: honest is good, and one sentence of honest is
 * enough.
 *
 * @see tasks/repositioning/data/designer-growth-problem-variants.json for the source
 * @see tasks/repositioning/copy/growth-problems.md for the audit
 */
export interface GrowthProblem {
  slug: string;
  /** Position in the hub listing, zero-padded. */
  number: string;
  /** The problem in the reader's words. Hub card, breadcrumb, links. */
  title: string;
  /**
   * The browser tab and search result. Carries the search term the plain title
   * dropped ("leads not converting", "margin under pressure") so the page keeps
   * ranking for what people actually type.
   */
  metaTitle: string;
  /** One line for the hub card. */
  line: string;
  titleLead: string;
  titleMark: string;
  intro: string;
  symptoms: readonly string[];
  causes: string;
  /** Which of the six areas this problem touches. Drives the category tags. */
  areas: readonly string[];
  examine: ReadonlyArray<{ what: string; why: string }>;
  /** What we can honestly show. Some of these have no number behind them yet. */
  proof: { heading: string; body: string; hasNumbers: boolean };
}

export const GROWTH_PROBLEMS: readonly GrowthProblem[] = [
  {
    slug: 'growth-has-stalled',
    number: '01',
    title: 'Growth has stalled',
    metaTitle: 'Growth has stalled: busy, but not growing',
    line: 'Busy team, flat sales, and nobody agrees why.',
    titleLead: 'Busy, but sales',
    titleMark: 'have stopped growing.',
    intro:
      "Sales are flat, the team is busy, and nobody agrees on why. Doing more is the reflex. It's rarely the answer.",
    symptoms: [
      "Sales have been flat for long enough that it's no longer a blip.",
      'Everyone has a different theory about the cause.',
      'New ideas launch, spike, then fade.',
      'The market grew and you did not.',
    ],
    causes:
      'Stalled growth is rarely one thing. Usually not enough new people are finding you, too many of the ones who do are slipping away before they buy, and the way the business runs could not handle more anyway.',
    areas: ['demand', 'conversion', 'scale'],
    examine: [
      {
        what: 'Where growth actually stopped',
        why: 'New customers, people who ask but do not buy, or the business being at capacity: the flat line usually starts in one of the three.',
      },
      {
        what: 'What the numbers can prove',
        why: 'Confident explanations rarely survive contact with the numbers.',
      },
      {
        what: 'The smallest change that moves it',
        why: 'The smallest thing that would make a real difference, not the biggest programme.',
      },
    ],
    proof: {
      heading: 'What stalled in our own pub, and what moved it.',
      body: 'The Anchor was flat, and the explanation everybody offered was the economy. It was not the economy. Once we found what was actually causing it, Google Search visibility grew 828%, private hire bookings grew 567%, table bookings grew 403%, food revenue grew 98% in three months, and booking no-shows fell 89%, all measured against the numbers before any work started. One honest limit: the third leg of a stall, a business that could not handle more volume, is something we can find but have no measured result for yet.',
      hasNumbers: true,
    },
  },
  {
    slug: 'weak-demand',
    number: '02',
    title: 'Not enough new customers',
    metaTitle: 'Weak demand: not enough new customers',
    line: 'Enquiries dry up the moment you stop pushing.',
    titleLead: 'Not enough',
    titleMark: 'new customers.',
    intro:
      'Enquiries dry up the moment you stop pushing. New business depends on effort, not on anything that brings people in by itself.',
    symptoms: [
      'New business comes from the same few places or the same few customers.',
      'Referrals are welcome but nobody plans for them.',
      'Marketing happens in bursts, when somebody has time.',
      'You are invisible where your customers actually look.',
    ],
    causes:
      'Not enough new customers usually comes from two things: people cannot tell what you are for, and you rely on one or two ways of being found. It drags everything after it down too, because a thin pipeline makes every sale feel desperate.',
    areas: ['demand', 'conversion'],
    examine: [
      {
        what: 'Where your customers actually look',
        why: 'Search, word of mouth and people coming back, measured against where you actually show up.',
      },
      {
        what: 'Whether people can tell what you are for',
        why: 'Whether a stranger could say in one sentence what you offer and why they would pick you.',
      },
      {
        what: 'What keeps working after you stop',
        why: 'Ways of being found that build up over time, against activity that stops the day you stop.',
      },
    ],
    proof: {
      heading: 'The customers who were going somewhere else.',
      body: "The Anchor had a demand problem it couldn't see, because the demand was going somewhere else entirely. The website described the pub in the words the pub used about itself, while people nearby were searching in completely different words for completely different things. Rebuilt around what people actually search for, Google Search visibility grew 828% against the numbers before, and private hire bookings grew 567%, from about six a year to twenty confirmed in six months. That second figure is what the visibility was worth in money. The lesson has nothing to do with pubs: a business describes itself in its own words, its customers search in theirs, and the gap between the two is customers somebody else is collecting.",
      hasNumbers: true,
    },
  },
  {
    slug: 'leads-not-converting',
    number: '03',
    title: "Enquiries don't turn into customers",
    metaTitle: 'Leads not converting into customers',
    line: 'People get in touch, then quietly go quiet.',
    titleLead: "Enquiries don't",
    titleMark: 'turn into customers.',
    intro:
      'People get in touch, then go quiet. The enquiries are usually fine. What happens between the first contact and the decision is not.',
    symptoms: [
      'Enquiries go quiet after the first reply.',
      'You could not say how many enquiries turn into customers, or where the rest drop out.',
      'Following up depends on someone remembering.',
      "People ask the price before they know what they'd get.",
    ],
    causes:
      'The problem usually lives in what happens after someone asks, not in the enquiries themselves: slow replies, no clear next step, and an experience that talks people out of buying.',
    areas: ['conversion', 'experience'],
    examine: [
      {
        what: 'The steps from asking to buying',
        why: 'Where enquiries actually drop out, measured, not assumed. A call, a form, a booking, a quote: each has a place people give up.',
      },
      {
        what: 'How fast and how clearly you follow up',
        why: 'How quickly an enquiry gets a real answer, and what happens when nobody picks it up.',
      },
      {
        what: 'What it feels like to be the customer',
        why: 'The gap between what you promise and what an enquiry actually feels like.',
      },
    ],
    proof: {
      heading: 'The gap between wanting to come and having a table.',
      body: "At The Anchor, plenty of people wanted to come. The only way to book was a phone number during service, and nobody was counting how many tried and gave up. We rebuilt the steps from interest to confirmed table, then added confirmations and reminders. Table bookings grew 403% compared with before, and no-shows fell 89%, from about one in five to about one in fifty. The second number is the one that changed the money: the table was held and the food was prepped whether or not anyone arrived. Every business has a version of the held table, whether it's a slot, a quote, an appointment or a sample. Almost nobody measures the drop-off between interest and confirmation.",
      hasNumbers: true,
    },
  },
  {
    slug: 'margin-under-pressure',
    number: '04',
    title: 'Sales are up, profit is not',
    metaTitle: 'Margin under pressure: sales up, profit not',
    line: 'Turnover grows and the bank balance does not.',
    titleLead: 'Sales are up.',
    titleMark: 'Profit is not.',
    intro:
      'Turnover grows and the bank balance does not. Somewhere between what you charge, what sells, what it costs and the hours spent by hand, the profit is leaking.',
    symptoms: [
      'Turnover is up and the bank balance is not.',
      'Discounting is the default response to a quiet period.',
      'Prices have not been checked against what people would pay in years.',
      'Every workaround adds a little to what each job costs you.',
    ],
    causes:
      'Profit leaks add up: discounting to bring people in, manual work quietly adding to the cost of every job, and prices that were set by looking at the competition rather than at what the product is worth.',
    areas: ['margin', 'operations', 'demand'],
    examine: [
      {
        what: 'What you charge, and what sells',
        why: 'What customers would actually pay, not what feels safe, and which products make money against which just make work.',
      },
      {
        what: 'What each job really costs you',
        why: 'The manual steps and workarounds that quietly add to the cost of every order.',
      },
      {
        what: 'The discount habit',
        why: 'What each promotion really costs once the discount comes off the profit rather than the price.',
      },
    ],
    proof: {
      heading: 'A menu rebuilt around what each dish actually makes.',
      body: "At The Anchor, the kitchen was busy and the profit didn't match the effort. Prices had been set by looking at what everyone else charged and taking a bit off. We rebuilt the menu around what each dish actually makes rather than what it costs, rewrote the descriptions to sell rather than to list, and gave the pricing a reason. Food revenue grew 98% within three months, and the growth came from the dishes worth selling rather than from selling more of everything. To be exact, that number measures revenue, not margin percentage. We do not publish a margin figure and we will not imply one from a revenue result. What this shows is the lesson: the thing that sells most is rarely the thing worth selling most, and nobody finds that out from the sales line.",
      hasNumbers: true,
    },
  },
  {
    slug: 'operations-slowing-us-down',
    number: '05',
    title: 'Too much of the work is manual',
    metaTitle: 'Operations slowing the business down',
    line: 'The team works hard and the business still moves slowly.',
    titleLead: 'Too much of the work',
    titleMark: 'is done by hand.',
    intro:
      'The team works hard and the business moves slowly. The hours that growth needs are going on work a system should be doing.',
    symptoms: [
      'Key work depends on one person or their spreadsheet.',
      'Hours go on tasks a system should do.',
      'Every sale creates admin somewhere else.',
      'Hiring is the answer to every capacity question.',
    ],
    causes:
      'Work that depends on effort or memory puts a hard ceiling on how big the business can get. This is a growth problem in disguise: rekeying orders, chasing paperwork, copying figures between systems, and nobody with the time to fix any of it.',
    areas: ['operations', 'scale'],
    examine: [
      {
        what: 'Where the hours actually go',
        why: 'The real way work gets done, walked through step by step, not the version on the org chart.',
      },
      {
        what: 'What should be a system',
        why: 'The manual work that software or a better process removes outright.',
      },
      {
        what: 'What stops if one person is away',
        why: 'The jobs that only one person knows how to do, and what happens to them in a fortnight off.',
      },
    ],
    proof: {
      heading: 'What we would look at before hiring again.',
      body: "No number for this one yet, and we won't borrow one from elsewhere on this site: every figure we publish measures customers, bookings or revenue, not hours freed up. What we bring instead is the looking. We walk the real workflow, find where the hours go, name the work a system should be doing, and find what stops if one person is away. Then we agree how to measure it before any work starts, so the number that ends up here next time is yours and you can check it.",
      hasNumbers: false,
    },
  },
  {
    slug: 'experience-leaking-value',
    number: '06',
    title: "Customers don't come back",
    metaTitle: "Customer experience: they don't come back",
    line: 'People buy once, then drift away.',
    titleLead: 'Customers buy once,',
    titleMark: "then don't come back.",
    intro:
      'People buy once, then drift away. Getting them back is about what it was like to be a customer, before it is about marketing.',
    symptoms: [
      'First-time customers rarely come back.',
      'You hear about problems in reviews, not in conversations.',
      'Nobody could say what proportion of customers return.',
      'How good the service is depends on who is working that day.',
    ],
    causes:
      "A business that has to win every customer twice never gets ahead. What looks like a marketing problem is usually about what happens after the sale, which is nobody in particular's job.",
    areas: ['experience', 'conversion'],
    examine: [
      {
        what: 'What happens after the sale',
        why: 'What actually happens between the first purchase and the second one that never comes.',
      },
      {
        what: 'Where the promise breaks',
        why: 'The gap between what the marketing says and what the customer actually gets.',
      },
      {
        what: 'What customers would tell you',
        why: 'Asked directly, before the review goes public.',
      },
    ],
    proof: {
      heading: 'The part of that journey we have actually measured.',
      body: 'Straight answer first: we have no retention number, no figure for how many customers come back, and we will not present one we cannot stand behind. What we have measured is one part of what happens after a customer says yes. At The Anchor, adding confirmations and reminders after a booking cut no-shows by 89%, from about one in five to about one in fifty. That proves what staying in touch is worth between the booking and the arrival. It does not prove anyone came back a second time. On that, we would start where most businesses have nothing: finding out your actual repeat rate, and agreeing the starting number before any work begins.',
      hasNumbers: true,
    },
  },
  {
    slug: 'using-ai-intelligently',
    number: '07',
    title: 'Where would AI actually help?',
    metaTitle: 'Using AI intelligently: where it would help',
    line: 'Tools everywhere, payoff nowhere obvious.',
    titleLead: 'Where would AI',
    titleMark: 'actually help?',
    intro:
      'Everyone says AI. Almost nobody says where it pays. The question is not which tool, it is which problem.',
    symptoms: [
      'Tools were bought and quietly abandoned.',
      'The team is curious but nobody owns it.',
      'Competitors claim AI and you cannot tell if it is real.',
      'Every supplier pitch starts with the technology.',
    ],
    causes:
      'AI pays where the same repetitive work, the same decisions or slow replies are holding the business back. Anywhere else it is for show. Which means the question is really about how the work gets done, not about the technology.',
    areas: ['operations', 'scale'],
    examine: [
      {
        what: 'Where the hours and the mistakes pile up',
        why: 'AI pays where repetitive judgement and manual work meet volume: chasing, drafting, checking, sorting.',
      },
      {
        what: 'Whether your data is good enough',
        why: 'AI ideas fail on messy or missing data more often than on the technology. Better to know that before you build anything.',
      },
      {
        what: 'What to buy, what to build, what to leave alone',
        why: 'What an off-the-shelf tool solves, what needs building for you, and what needs neither.',
      },
    ],
    proof: {
      heading: 'How we use AI, and what we will not claim for it.',
      body: 'We have no AI number, because we have never separated one out. AI is how a two-person business did the work behind the five figures we publish from The Anchor: the research, the drafting, the analysis, the repetitive checking. It is not the reason those figures moved. Menu pricing moved food revenue by 98%. Writing for what people search for moved visibility by 828%. AI made that work fast enough to be worth doing at all. So what is on offer here is not a result, it is a filter: where AI would pay in your business, where your data will not support it yet, and where the honest answer is that it would be theatre.',
      hasNumbers: false,
    },
  },
  {
    slug: 'systems-cannot-keep-up',
    number: '08',
    title: "Your systems can't cope with more",
    metaTitle: "Systems can't support the next stage",
    line: 'What got you here creaks at higher volume.',
    titleLead: "Your systems can't",
    titleMark: 'cope with more.',
    intro:
      'What got you here creaks at higher volume. Growth is being held back by spreadsheets, workarounds and people going the extra mile every week.',
    symptoms: [
      'Busy periods cause mistakes, not just more work.',
      'Reporting takes days and nobody trusts it.',
      'More sales means more staff at the same rate.',
      'Nobody wants to touch the systems that work.',
    ],
    causes:
      'When the systems cannot keep up, people patch the gaps by hand, which eats the hours and the profit at exactly the moment the business needs both.',
    areas: ['scale', 'operations', 'margin'],
    examine: [
      {
        what: 'Where volume breaks things',
        why: 'The parts of the business that break as it gets busier, found before they do. Usually the till, the bookings, the stock, or the reporting.',
      },
      {
        what: 'Whether your numbers live in one place',
        why: 'Whether each figure exists once, in one system, or many times in many spreadsheets that disagree.',
      },
      {
        what: 'What to fix first',
        why: 'What must change first so everything after it gets easier.',
      },
    ],
    proof: {
      heading: 'What we would look at before volume finds the cracks.',
      body: 'No number here yet, and we would rather say so than dress one up: every figure we publish measures customers, bookings or revenue, and The Anchor is a single site that has not been tested at the volume that breaks reporting. What we bring is the order of the fix, which is the thing most businesses get wrong: which parts fail first at twice the volume, whether your numbers exist once or in many places, and what has to change first so everything after it gets easier. We agree how to measure it before any work starts, so the result is yours to check.',
      hasNumbers: false,
    },
  },
];

export function getGrowthProblem(slug: string): GrowthProblem | undefined {
  return GROWTH_PROBLEMS.find((problem) => problem.slug === slug);
}
