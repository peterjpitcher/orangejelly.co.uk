/** Method copy for the approved website, application and connected-systems offer. */
export interface MethodDetail {
  word: string;
  line: string;
  body: string;
  outcome?: string;
  discipline: string;
}

export const METHOD_DETAIL: readonly MethodDetail[] = [
  {
    word: 'HEAR.',
    line: 'Understand what you want to build and what it needs to achieve.',
    body: 'Bring a clear brief or a problem to work through. We look at the website, customer journey and systems involved, and speak to the people who will use the result.',
    outcome: 'A shared brief, the existing systems involved and the result we will measure.',
    discipline:
      'Discovery should answer the questions needed for the build. Its depth depends on the project.',
  },
  {
    word: 'CHALLENGE.',
    line: 'Check the proposed build against the way your business works.',
    body: 'We test the assumptions that matter: what customers need, what your current software can do and where a connection or bespoke application is justified. A clear brief is welcome. We refine it with you before agreeing the work.',
    outcome:
      'Agreed deliverables, boundaries, hours and measures, with decisions about what to build or connect.',
    discipline:
      'Use existing software where it fits. Build something bespoke where the business needs it.',
  },
  {
    word: 'BUILD.',
    line: 'Build and test the website, application or connected workflow.',
    body: 'We create the agreed website, browser application or booking workflow and connect the systems it depends on. We test the customer journey and the everyday tasks your team will use, with measurement built in. AI is included where it has a useful role, with human checks appropriate to that role.',
    outcome: 'The agreed build, tested journeys and the information your team needs to use it.',
    discipline:
      'Using AI to write code does not make a website AI-powered. The customer should understand what AI actually does.',
  },
  {
    word: 'OPTIMISE.',
    line: 'Measure the result against where you started.',
    body: 'We compare the agreed measures with the starting point, review how people use the build and explain what to change next. Further development and ongoing improvement are agreed pieces of work.',
    outcome:
      'A before-and-after report where the data supports it, an honest handover and recommendations for the next step.',
    discipline:
      'Separate completed work from measured business outcomes. Do not claim a result the evidence cannot support.',
  },
];

export const PRESSURE_AREAS_EXPLAINED = [
  { area: 'Demand', body: 'Whether enough of the right people know you exist and care.' },
  { area: 'Conversion', body: 'What happens between someone being interested and someone buying.' },
  { area: 'Margin', body: 'What is left after the sale, and where it leaks.' },
  { area: 'Operations', body: 'What the business spends effort on that it should not.' },
  { area: 'Experience', body: 'What people remember, as opposed to what you deliver.' },
  { area: 'Scale', body: 'What breaks first at twice the size.' },
] as const;

export const TIMELINE = [
  {
    stage: 'The first conversation',
    length: 'An hour. Free.',
    body: 'You leave with our first read on where to look, and a straight answer on whether we are the right people.',
  },
  {
    stage: 'Agreeing the build',
    length: 'Matched to your brief.',
    body: 'HEAR and CHALLENGE. We agree how much discovery is needed, the deliverables and the hours before paid work starts.',
  },
  {
    stage: 'Building and measuring',
    length: 'Depends on what we find.',
    body: 'BUILD and OPTIMISE. The shape and the hours are agreed in writing before this starts, never after.',
  },
] as const;

export const STARTING_AGREEMENT = [
  'The problem we are solving, in one sentence we both recognise.',
  'Why it matters now.',
  'The numbers we are starting from, or the honest admission that there are none yet.',
  'What success looks like, as a number where possible.',
  'What is in scope and what is not.',
  'Who can make the decisions, and who owns implementation.',
  'What data and access we need.',
  'How we will review progress.',
  'What would make us stop, change direction or expand.',
] as const;

export const PREVENTS = [
  'Building before the brief, users and intended result are understood.',
  'Treating every problem as a marketing problem.',
  'Using AI where it adds nothing.',
  'Handing over a strategy the business cannot actually implement.',
  'Measuring activity instead of impact.',
  'Carrying on after the useful outcome has already been reached.',
  'Letting everyone avoid the decision the business actually needs to make.',
] as const;
