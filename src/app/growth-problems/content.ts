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
 * with, and "using AI intelligently", which the keyword research found is the
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
 * @see tasks/repositioning/data/designer-growth-problem-variants.json for the source
 * @see tasks/repositioning/copy/growth-problems.md for the audit
 */
export interface GrowthProblem {
  slug: string;
  /** Position in the hub listing, zero-padded. */
  number: string;
  title: string;
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
    line: 'Flat revenue, busy team, no agreed cause.',
    titleLead: 'Growth has',
    titleMark: 'stalled.',
    intro:
      'Revenue is flat, the team is busy, and nobody agrees on why. More activity is the reflex. It is rarely the answer.',
    symptoms: [
      'Revenue has been flat for long enough that it is no longer a blip.',
      'Everyone has a different theory about the cause.',
      'New initiatives launch, spike, then fade.',
      'The market grew and you did not.',
    ],
    causes:
      'Stalled growth is rarely one thing. It usually pairs weak demand creation with a conversion journey that leaks, capped by systems that cannot absorb more volume.',
    areas: ['demand', 'conversion', 'scale'],
    examine: [
      {
        what: 'Where growth actually stopped',
        why: 'Pipeline, conversion or capacity: the flat line starts in one of the three far more often than not.',
      },
      {
        what: 'What the data can prove',
        why: 'Confident explanations rarely survive contact with the numbers.',
      },
      {
        what: 'The smallest change that moves it',
        why: 'The smallest intervention capable of material change, not the biggest programme.',
      },
    ],
    proof: {
      heading: 'What stalled in our own venue, and what moved it.',
      body: 'The Anchor, our own venue, was flat, and the explanation everybody offered was the economy. It was not the economy. Once we found what was actually causing it, Google Search visibility grew 828%, private hire bookings grew 567%, table bookings grew 403%, food revenue grew 98% in three months, and booking no-shows fell 89%. Every figure is from The Anchor, measured against a baseline taken before any work started. It is one business, and it is ours, so the risk of getting it wrong was ours too. One honest limit: the third leg of a stall, systems that cannot absorb more volume, is something we diagnose but have no measured result for. If that turns out to be your constraint, we will tell you, and we will not point at a number to prove it.',
      hasNumbers: true,
    },
  },
  {
    slug: 'weak-demand',
    number: '02',
    title: 'Demand or pipeline is weak',
    line: 'The pipeline dries up when you stop pushing.',
    titleLead: 'Demand is',
    titleMark: 'too thin.',
    intro:
      'The pipeline dries up the moment you stop pushing. Demand depends on effort, not on a system that creates it.',
    symptoms: [
      'New business relies on the same few channels or customers.',
      'Referrals are welcome but unplanned.',
      'Marketing activity spikes and troughs with your attention.',
      'You are invisible where buyers actually look.',
    ],
    causes:
      'Weak demand usually pairs an unclear proposition with channel dependence, and it drags conversion down with it: thin pipelines make every deal feel desperate.',
    areas: ['demand', 'conversion'],
    examine: [
      {
        what: 'Where buyers actually look',
        why: 'Search, referral and repeat: measured against where you show up.',
      },
      {
        what: 'The proposition, tested',
        why: 'Whether the market can tell what you are for in one pass.',
      },
      {
        what: 'What compounds',
        why: 'Channels that build an asset versus activity that evaporates.',
      },
    ],
    proof: {
      heading: 'The demand that was going somewhere else.',
      body: 'The Anchor, our own venue, had a demand problem it could not see, because the demand was going somewhere else entirely. The site described the venue in the language the venue used about itself, while people nearby were searching in completely different words for completely different things. Rebuilt around what people actually search for, Google Search visibility grew 828% against a Search Console baseline taken before any of it, and private hire bookings grew 567%, from about six a year to twenty confirmed in six months. That second figure is what the visibility was worth in money. The mechanism has nothing to do with pubs: a business describes itself in its own words, its customers search in theirs, and the gap between the two is demand somebody else is collecting.',
      hasNumbers: true,
    },
  },
  {
    slug: 'leads-not-converting',
    number: '03',
    title: 'Leads are not converting',
    line: 'Enquiries arrive and quietly die in the journey.',
    titleLead: 'Leads are',
    titleMark: 'not converting.',
    intro:
      'Enquiries arrive and quietly die. The leads are usually fine. What happens between first contact and decision is not.',
    symptoms: [
      'Enquiries go quiet after the first reply.',
      'You could not say what your conversion rate is at each step.',
      'Follow-up depends on someone remembering.',
      'Price objections arrive before value was ever shown.',
    ],
    causes:
      'Conversion problems usually live in the journey, not the leads: slow follow-up, unclear next steps, and an experience that talks people out of buying.',
    areas: ['conversion', 'experience'],
    examine: [
      {
        what: 'The journey, step by step',
        why: 'Where enquiries actually stall, measured, not assumed.',
      },
      {
        what: 'Speed and clarity of follow-up',
        why: 'How fast an enquiry gets a real answer, and what happens when nobody picks it up.',
      },
      {
        what: 'What the buyer experiences',
        why: 'The gap between what you promise and what an enquiry feels like.',
      },
    ],
    proof: {
      heading: 'The gap between wanting to come and having a table.',
      body: 'At The Anchor, our own venue, plenty of people wanted to come. The booking route was a phone number during service, and nobody was counting how many tried and gave up. We rebuilt the journey from interest to confirmed table, then added confirmations and reminders. Table bookings grew 403% against the previous run rate, and no-shows fell 89%, from about one in five to about one in fifty. The second number is the one that changed the economics: the table was held and the food was prepped whether or not anyone arrived. Every business has a version of the held table, whether it is a slot, a quote, an appointment or a sample, and almost nobody measures the drop-off between interest and confirmation.',
      hasNumbers: true,
    },
  },
  {
    slug: 'margin-under-pressure',
    number: '04',
    title: 'Margin is under pressure',
    line: 'Revenue grows but profit does not.',
    titleLead: 'Margin is under',
    titleMark: 'pressure.',
    intro:
      'Revenue grows but profit does not. Somewhere between price, mix, cost and manual work, the margin is leaking.',
    symptoms: [
      'Turnover is up and the bank balance is not.',
      'Discounting is the default response to a quiet period.',
      'Prices have not been tested against value in years.',
      'Cost-to-serve creeps up with every workaround.',
    ],
    causes:
      'Margin leaks compound: discounting to create demand, manual work inflating cost-to-serve, and pricing that has never been tested against value.',
    areas: ['margin', 'operations', 'demand'],
    examine: [
      {
        what: 'Price and mix, against value',
        why: 'What customers would actually pay, not what feels safe.',
      },
      {
        what: 'Where cost-to-serve hides',
        why: 'Manual work and workarounds that inflate every order.',
      },
      {
        what: 'The discount habit',
        why: 'What each promotion really costs once the discount comes off the margin rather than the price.',
      },
    ],
    proof: {
      heading: 'Mix rebuilt around what each line actually contributes.',
      body: 'At The Anchor, our own venue, the kitchen was busy and the contribution did not match the effort. Pricing had been set by looking at what everyone else charged and taking a bit off. We rebuilt the menu around what each dish actually contributes rather than what it costs, rewrote the descriptions to sell rather than to list, and gave the pricing a reason. Food revenue grew 98% within three months, and the growth came from the lines worth selling rather than from volume across the board. Now be exact about what that number is. It measures revenue, not margin percentage. We do not publish a gross margin figure and we are not going to imply one from a revenue result. What this case proves is the mechanism: the thing that sells most is rarely the thing worth selling most, and nobody finds that out from the revenue line.',
      hasNumbers: true,
    },
  },
  {
    slug: 'operations-slowing-us-down',
    number: '05',
    title: 'Operations are slowing the business',
    line: 'Manual effort is absorbing the capacity growth needs.',
    titleLead: 'Operations are slowing',
    titleMark: 'the business.',
    intro:
      'The team works hard and the business moves slowly. Manual effort is absorbing the capacity growth needs.',
    symptoms: [
      'Key work depends on one person or their spreadsheet.',
      'Hours go on tasks a system should do.',
      'Every sale creates admin somewhere else.',
      'Hiring is the answer to every capacity question.',
    ],
    causes:
      'Operational drag is a scale problem in disguise. Work that depends on effort or memory sets a hard ceiling on how big the business can get.',
    areas: ['operations', 'scale'],
    examine: [
      {
        what: 'Where the hours actually go',
        why: 'The real workflow, walked through, not the org chart version.',
      },
      {
        what: 'What should be a system',
        why: 'The manual work that automation or better process removes outright.',
      },
      {
        what: 'The single points of failure',
        why: 'What stops if one person is away for a fortnight.',
      },
    ],
    proof: {
      heading: 'What we would look at before hiring again.',
      body: 'We have no number for this one, and we are not going to borrow one from somewhere else on this site. Every figure we publish comes from The Anchor, our own venue, and all five measure demand, bookings or revenue. Not one of them measures hours reclaimed, cost-to-serve, or capacity released. We used to quote a time-reclaimed figure and we withdrew it, because it was a raw count nobody could check rather than a measured result. So here is what we bring instead of a percentage. We walk the real workflow rather than the org chart version, find where the hours actually go, name the work a system should be doing outright, and find what stops if one person is away for a fortnight. Then we agree the measure and take the baseline before any work starts, so the number that ends up in this section next time is yours and you can check it.',
      hasNumbers: false,
    },
  },
  {
    slug: 'experience-leaking-value',
    number: '06',
    title: 'Customer experience is leaking value',
    line: 'Customers buy once and drift away.',
    titleLead: 'Experience is',
    titleMark: 'leaking value.',
    intro:
      'Customers buy once and drift away. Retention is an experience problem before it is a marketing problem.',
    symptoms: [
      'First-time buyers rarely come back.',
      'Problems surface in reviews, not in conversations.',
      'Repeat rate is a mystery number.',
      'Service quality depends on who is on shift.',
    ],
    causes:
      'Experience leaks show up as conversion and demand problems: a business that has to win every customer twice never gets ahead of its own pipeline.',
    areas: ['experience', 'conversion'],
    examine: [
      {
        what: 'The journey after the sale',
        why: 'What actually happens between first purchase and the second that never comes.',
      },
      {
        what: 'Where promises break',
        why: 'The gap between marketing and the experienced reality.',
      },
      {
        what: 'What customers would say',
        why: 'Direct feedback, gathered before the review goes public.',
      },
    ],
    proof: {
      heading: 'The part of that journey we have actually measured.',
      body: 'Straight answer first: we have no retention number. None of the five figures we publish measures repeat purchase, repeat rate or lifetime value, and the retention figure we used to quote was withdrawn because we could not stand behind how it was counted. What we have measured is one part of the journey after a customer commits. At The Anchor, our own venue, adding confirmations and reminders after a booking cut no-shows by 89%, from about one in five to about one in fifty. That proves what staying in contact is worth between the yes and the arrival. It does not prove anyone came back a second time, and we will not present it as though it does. On retention itself we would start where most businesses have nothing: finding your actual repeat rate, and agreeing the baseline before any work starts.',
      hasNumbers: true,
    },
  },
  {
    slug: 'using-ai-intelligently',
    number: '07',
    title: 'Using AI intelligently',
    line: 'Tools everywhere, payoff nowhere obvious.',
    titleLead: 'You want AI that',
    titleMark: 'earns its place.',
    intro:
      'Everyone says AI. Almost nobody says where it pays. The question is not which tool, it is which problem.',
    symptoms: [
      'Tools were bought and quietly abandoned.',
      'The team is curious but nobody owns it.',
      'Competitors claim AI and you cannot tell if it is real.',
      'Every supplier pitch starts with the technology.',
    ],
    causes:
      'AI-shaped confusion is usually an operations and scale question: where manual work, decisions or response times are the constraint, AI can pay. Anywhere else it is theatre.',
    areas: ['operations', 'scale'],
    examine: [
      {
        what: 'Where hours and errors cluster',
        why: 'AI pays where repetitive judgement and manual work meet volume.',
      },
      {
        what: 'What your data can support',
        why: 'AI ideas die on data quality more often than on the technology. Better to know that before you build.',
      },
      {
        what: 'The build-versus-buy line',
        why: 'What a tool solves, what needs building, what needs neither.',
      },
    ],
    proof: {
      heading: 'How we use AI, and what we will not claim for it.',
      body: 'We have no AI number, and the honest reason is that we have never separated one out. AI is how a two-person business did the work behind the five figures we publish from The Anchor, our own venue: the research, the drafting, the analysis, the repetitive judgement. It is not the reason those figures moved. Menu economics moved food revenue by 98%. Search intent moved visibility by 828%. AI made that work fast enough to be worth doing at all. We used to quote a time-reclaimed figure for it, and we withdrew it, because it was a raw count nobody could verify. So what is on offer here is not a result, it is a filter. We will tell you where AI would pay in your business, where your data will not support the idea yet, and where the honest answer is that it would be theatre. That third answer is the one most suppliers will not give you.',
      hasNumbers: false,
    },
  },
  {
    slug: 'systems-cannot-keep-up',
    number: '08',
    title: 'Systems cannot support the next stage',
    line: 'What got you here creaks at higher volume.',
    titleLead: 'Your systems cannot support',
    titleMark: 'the next stage.',
    intro:
      'What got you here creaks at higher volume. Growth is being rationed by spreadsheets, workarounds and heroics.',
    symptoms: [
      'Volume spikes cause errors, not just work.',
      'Reporting takes days and trusts nobody.',
      'Adding revenue means adding headcount at the same rate.',
      'Nobody wants to touch the systems that work.',
    ],
    causes:
      'Scale limits drag operations and erode margin at exactly the moment the business needs both: teams patch by hand what systems should absorb.',
    areas: ['scale', 'operations', 'margin'],
    examine: [
      {
        what: 'Where volume breaks things',
        why: 'The workflows that break as volume climbs, found before it climbs.',
      },
      {
        what: 'The data foundation',
        why: 'Whether numbers exist once, in one place, or many times in many spreadsheets.',
      },
      {
        what: 'Sequence of the fix',
        why: 'What must change first so everything after it gets easier.',
      },
    ],
    proof: {
      heading: 'What we would look at before volume finds the cracks.',
      body: 'No number here either, and we would rather say so than dress one up. The five figures we publish all come from The Anchor, our own venue, and all five measure demand, bookings or revenue. None of them measures what happened to a system at higher volume. The Anchor is a single site, so we have not tested our own work against the kind of volume that breaks reporting or forces headcount up in step with revenue. Anyone claiming otherwise from these numbers would be the first thing you should not trust. What we do bring is the sequencing question, which is the one most businesses get wrong: which workflows fail at twice the volume, whether your numbers exist once in one place or many times in many spreadsheets, and what has to change first so everything after it gets easier. We agree the measures and take the baseline before any work starts, so the result is yours to check.',
      hasNumbers: false,
    },
  },
];

export function getGrowthProblem(slug: string): GrowthProblem | undefined {
  return GROWTH_PROBLEMS.find((problem) => problem.slug === slug);
}
