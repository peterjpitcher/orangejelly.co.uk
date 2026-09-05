import type { ServicePageContent } from '@/components/oj/ServicePage';

export const CONTENT: ServicePageContent = {
  label: 'Booking systems',
  heading: 'Booking systems that connect the guest and the team.',
  intro:
    'We build and connect booking workflows, from the first enquiry to confirmation, changes and follow-up, so guests and staff know what happens next.',
  audience:
    'For businesses with a booking journey that depends on manual handovers or disconnected tools.',
  evidence: {
    heading: 'A booking journey tested in our own venue',
    body: 'At The Anchor, our own venue, we worked on the reason to book, the route to a confirmed table, and confirmations and reminders. The published case study explains those changes together.',
    boundary:
      'The reported results belong to that wider programme. They are not a claim that a booking tool alone caused the improvement, or a promise of the same result elsewhere.',
    href: '/results/interest-that-did-not-turn-up',
    label: 'Read The Anchor booking and reminder case study',
  },
  deliverables: [
    {
      title: 'Connect the journey you already have',
      body: 'Link the website, booking provider and team workflow where supported. Establish which system holds the confirmed booking and how changes reach the people who need them.',
    },
    {
      title: 'Build the missing workflow',
      body: 'A custom enquiry stage, private hire handover or guest information step can fill a specific gap. Agree the rules for availability, confirmation and changes before building.',
    },
    {
      title: 'Make communication clearer',
      body: 'Plan confirmations, reminders and follow-up around the guest journey. Agree message content, consent requirements and what staff should do when a message or connection fails.',
    },
  ],
  fit: {
    heading: 'Connect first. Replace only for a clear reason.',
    body: 'A new booking engine brings responsibilities for availability, changes and reliability. We first check whether your existing provider can handle the core booking while a website connection or focused application fills the gap. A replacement needs a distinct business case and agreed scope.',
  },
  process: [
    {
      title: 'Trace a booking from start to finish',
      body: 'Review enquiries, confirmations, changes, cancellations and the information your team needs. Identify the current booking record and the gaps between systems.',
    },
    {
      title: 'Agree the rules and test them',
      body: 'Define the supported connections and the handling of failures before launch. Test the guest route and staff handover with test bookings.',
    },
    {
      title: 'Measure the booking journey',
      body: 'Agree how to review completed bookings, abandoned enquiries and no-shows where data is available. Confirm who manages each connected service and future changes.',
    },
  ],
  faqs: [
    {
      q: 'Do we need to replace our booking software?',
      a: 'Often the useful change is around the existing provider: a better website route, information capture or staff handover. Replacement is considered only when the provider cannot meet the agreed requirements.',
    },
    {
      q: 'How will booking changes reach the team?',
      a: 'We agree which system is authoritative and how amendments and cancellations move through the workflow. The available connection depends on your provider, and failure handling needs to be tested.',
    },
    {
      q: 'Can the system send guest confirmations and reminders?',
      a: 'These can form part of the agreed scope. We check what your provider already sends, the permissions and message rules, and how staff will see failures before introducing another messaging route.',
    },
    {
      q: 'Who is responsible for third-party booking services?',
      a: 'We set out the responsibilities for provider accounts, subscriptions, access and ongoing maintenance in the scope. A connected service remains subject to its own terms and availability.',
    },
    {
      q: 'Does booking automation need AI?',
      a: 'Many booking tasks need clear rules rather than AI. We would consider AI for a suitable supporting task, such as preparing an enquiry summary, with checks appropriate to its use.',
    },
  ],
  related: [
    { href: '/solutions/hospitality-websites', label: 'Hospitality website design' },
    { href: '/solutions/bespoke-applications', label: 'Bespoke web applications' },
  ],
  invitation: 'Where does your booking journey break down?',
};
