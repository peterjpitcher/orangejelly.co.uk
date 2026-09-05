/**
 * `/sectors/professional-services`.
 *
 * The sector Peter named as the primary target, alongside trades. This is the
 * mirror of what `/guides` is for hospitality, with one enormous
 * difference that the page has to be honest about: there is no professional
 * services case study, because there is not yet a professional services client.
 *
 * The page therefore does the one thing it legitimately can, which is translate.
 * It takes the six growth areas and says what each one looks like inside an
 * accountancy practice, a law firm or a consultancy, in the specific language those
 * businesses use about themselves. That is genuinely useful and it is defensible
 * from the outside, whereas a page implying sector experience would not be.
 */
export const TRANSLATIONS = [
  {
    area: 'demand',
    label: 'Create demand',
    heading: 'Referrals dried up and nobody noticed for a quarter',
    body: 'Most professional services firms were built on referral and word of mouth, which works beautifully until it stops. It rarely stops suddenly. It thins, quarter by quarter, while everyone is busy on delivery, and by the time the pipeline is visibly short the cause is eighteen months upstream.',
    tell: 'Nobody can say how many enquiries came in last month without looking it up, and nobody looked it up.',
  },
  {
    area: 'conversion',
    label: 'Convert more',
    heading: 'The proposal goes out and then nothing happens',
    body: 'Enquiries arrive, a partner has a good conversation, a proposal goes out, and then it sits. Follow-up depends on whoever sent it remembering, and they are chargeable that week. The work that wins is competing directly with the work that bills.',
    tell: 'You could not say what proportion of proposals convert, or how long the ones that do take.',
  },
  {
    area: 'margin',
    label: 'Protect margin',
    heading: 'Realisation is quietly eating the year',
    body: 'Realisation is the gap between what you charge out and what you actually bill, and it is where the year goes. The rate card says one thing and the invoices say another. Scope creeps because saying no to a good client is hard, write-offs get approved one at a time because each is small, and nobody adds them up until the year end does it for them.',
    tell: 'You know your charge-out rates precisely and your realised rate approximately.',
  },
  {
    area: 'operations',
    label: 'Remove operational drag',
    heading: 'Senior people doing work that is not senior',
    body: 'The most expensive people in the building are chasing documents, reformatting reports and re-keying data between systems that do not talk. It is invisible on a timesheet because it gets coded to the client it was for.',
    tell: 'Somebody senior has a spreadsheet nobody else understands, and the firm would notice within a week if they left.',
  },
  {
    area: 'experience',
    label: 'Improve the experience',
    heading: 'Clients renew out of inertia rather than enthusiasm',
    body: 'The work is good. The experience of being a client is inconsistent, depends on which partner you got, and is mostly invisible to the firm because unhappy clients in professional services rarely complain. They just do not expand, and eventually they do not renew.',
    tell: 'You would struggle to name the last client who told you something was wrong before they left.',
  },
  {
    area: 'scale',
    label: 'Build for scale',
    heading: 'Growth means hiring, and hiring is the constraint',
    body: "Every additional pound of revenue needs an additional person, because the way the work gets done has not changed since the firm was half the size. Utilisation, how many of each person's hours get billed, is the only lever anyone reaches for, and it is the one with a ceiling and a resignation attached.",
    tell: 'Your growth plan and your recruitment plan are the same document.',
  },
] as const;

export const WHAT_WE_DO_NOT_HAVE = [
  'A professional services case study. Every measured result we publish is from The Anchor, the venue we run ourselves.',
  'Sector accreditation, a compliance specialism, or a view on your professional indemnity.',
  'A view on your technical work. What an accountant, a solicitor or a surveyor actually does is not our field and we will not pretend otherwise.',
] as const;

export const RELATED_BUILDS = [
  { label: 'Bespoke applications and customer portals', href: '/solutions/bespoke-applications' },
] as const;
