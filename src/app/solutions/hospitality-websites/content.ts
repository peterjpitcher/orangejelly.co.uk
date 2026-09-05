import type { ServicePageContent } from '@/components/oj/ServicePage';

export const CONTENT: ServicePageContent = {
  label: 'Hospitality websites',
  heading: 'Hospitality websites that make choosing and booking easier.',
  intro:
    'We design and build hospitality websites, connecting what guests want to know with a clear way to enquire or book.',
  audience:
    'For venues that need a new website or want their existing one to turn more interest into visits.',
  evidence: {
    heading: 'A website rebuilt around real guest searches',
    body: 'At The Anchor, our own venue, we rebuilt the website around what people were looking for and made the private hire enquiry route easier to find. The published case study explains the search and website work together.',
    boundary:
      'This is evidence from our own venue. Its results reflect the wider work described in the case study, rather than a forecast for your website.',
    href: '/results/nobody-could-find-us',
    label: 'Read The Anchor website and search case study',
  },
  deliverables: [
    {
      title: 'Pages that answer guest questions',
      body: 'Clear menus, events, private hire information and reasons to visit, organised around how people choose a venue. The content and pages depend on your offer.',
    },
    {
      title: 'A clear route to book',
      body: 'Prominent booking and enquiry routes on mobile and desktop. Where your provider supports it, connect the existing booking tool so guests can move from deciding to booking.',
    },
    {
      title: 'Search and booking measurement',
      body: 'Build clear page structure and search information, then agree how to measure enquiries and bookings. Separate booking-button clicks from confirmed bookings wherever the provider makes that data available.',
    },
  ],
  fit: {
    heading: 'Improve what works. Rebuild what holds you back.',
    body: 'A complete rebuild is useful when the structure or platform prevents the changes you need. If the foundations work, improving content, navigation and the booking journey may be enough. AI can help with an agreed task, but it is not a requirement for a good website.',
  },
  process: [
    {
      title: 'Understand the guest journey',
      body: 'Review your website, the questions guests ask, your booking provider and the points where people give up.',
    },
    {
      title: 'Agree and build the changes',
      body: 'Set out the pages, content responsibilities, integrations and testing before work starts. Test the route from finding a page to making an enquiry or booking.',
    },
    {
      title: 'Measure and choose what comes next',
      body: 'Review the agreed measures after launch. Prioritise further changes using what guests do, with additional work agreed separately.',
    },
  ],
  faqs: [
    {
      q: 'Do I need a completely new website?',
      a: 'We first check what your existing site can do. A focused improvement can be the right choice when the platform and structure already support the guest journey.',
    },
    {
      q: 'Can I keep my existing booking provider?',
      a: 'That is the starting point. We check its supported links, embedded forms and integration options before recommending a change. Some providers limit what can be connected or measured.',
    },
    {
      q: 'Who supplies and owns the website content?',
      a: 'We agree who supplies copy and images, who can edit the site and the ownership and licensing terms before building. Any third-party images or software need suitable permissions.',
    },
    {
      q: 'How will we know whether it brings more bookings?',
      a: 'We agree a baseline and the data available from your website and booking provider. We distinguish clicks, enquiries and confirmed bookings, and account for other activity that can affect demand.',
    },
  ],
  related: [
    { href: '/solutions/booking-systems', label: 'Booking systems and connected guest journeys' },
    { href: '/pub-marketing', label: 'Pub growth and marketing' },
  ],
  invitation: 'What should your website do better?',
};
