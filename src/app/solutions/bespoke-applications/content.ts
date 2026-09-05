import type { ServicePageContent } from '@/components/oj/ServicePage';

export const CONTENT: ServicePageContent = {
  label: 'Bespoke applications',
  heading: 'Web applications built around the way your business works.',
  intro:
    'We build bespoke browser applications that connect customer information, bookings and everyday work, giving your team a clearer way to run the business.',
  audience:
    'For businesses whose important work falls between spreadsheets, inboxes and separate software tools.',
  evidence: {
    heading: 'Start with the work the system needs to do',
    body: 'At The Anchor, our own venue, the published booking case study describes a connected journey through booking, confirmation and reminders. It shows why the handover between interest and a confirmed visit matters.',
    boundary:
      'Your application starts with the same question: what needs to happen between a customer asking and the work being done?',
    href: '/results/interest-that-did-not-turn-up',
    label: 'Read The Anchor booking journey case study',
  },
  deliverables: [
    {
      title: 'Customer and guest portals',
      body: 'An agreed place for customers to view information, submit requests or manage parts of their journey. The first step is deciding what belongs there and who should have access.',
    },
    {
      title: 'Tools for the work behind the scenes',
      body: 'Browser tools for enquiries, task handovers and operational workflows. Bring the information needed for a decision together, with clear permissions for the people using it.',
    },
    {
      title: 'Connected records and useful AI',
      body: 'Connect supported systems so information can move between them. Where appropriate, AI could summarise an enquiry or prepare a draft for review. Each feature needs an agreed purpose, suitable data and human checks.',
    },
  ],
  fit: {
    heading: 'Bespoke where it earns its place',
    body: 'Existing software may already solve the problem. We compare that option with connecting your tools or building a focused application. A bespoke build makes sense when the workflow matters to your business and available products cannot meet the agreed need.',
  },
  process: [
    {
      title: 'Map the workflow',
      body: 'Work through who uses the system, what they need to do and where the information comes from. Identify access, privacy and integration requirements.',
    },
    {
      title: 'Build and test the agreed scope',
      body: 'Set out the working screens and connections, then test real tasks with suitable test data. Check failure messages and permissions as well as the successful journey.',
    },
    {
      title: 'Plan the next stage',
      body: 'Agree handover, hosting responsibilities and how future changes will be requested. Measure the practical outcome rather than the number of features.',
    },
  ],
  faqs: [
    {
      q: 'When is existing software enough?',
      a: 'When it meets the important workflow, access and reporting needs, using or connecting it can be the right answer. We establish the gap before recommending a bespoke application.',
    },
    {
      q: 'Can you connect our existing customer records?',
      a: 'We check the source system, its permissions and supported connections first. Any migration or connection needs an agreed data scope, access rules and testing before real records are used.',
    },
    {
      q: 'Does this mean a mobile app from an app store?',
      a: 'This service covers applications used through a web browser, including on suitable mobile devices. Native app-store applications are outside the offer described here.',
    },
    {
      q: 'How are ongoing changes handled?',
      a: 'We agree hosting, maintenance and future changes before launch, with additional work scoped separately.',
    },
    {
      q: 'Will the application contain AI?',
      a: 'Only where it serves an agreed purpose. Using AI during development is different from adding AI functionality to the finished application. We explain which is involved and how any AI output will be checked.',
    },
  ],
  related: [
    { href: '/solutions/booking-systems', label: 'Custom booking workflows' },
    {
      href: '/growth-problems/using-ai-intelligently',
      label: 'Using AI intelligently in your business',
    },
  ],
  invitation: 'Which part of your business needs to work better?',
};
