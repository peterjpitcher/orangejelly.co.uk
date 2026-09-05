/** Enquiry copy for the approved website, application and connected-systems offer. */
export const STEPS = [
  {
    word: 'YOU TELL US.',
    text: 'Tell us what you want to build or improve. Your contact details and a line about the business are enough to start.',
  },
  { word: 'WE REPLY.', text: 'A person reads it and replies about your project or situation.' },
  {
    word: 'WE TALK.',
    text: 'An hour, free, to discuss the website, application or workflow you have in mind, the systems you already use and the result you want.',
  },
  {
    word: 'WE RECOMMEND.',
    text: 'We explain what looks worth building, what existing software may already handle and whether we are the right people for the work.',
  },
  {
    word: 'WE AGREE THE WORK.',
    text: 'The deliverables, hours, responsibilities and measures are agreed in writing before paid work starts.',
  },
] as const;

export const TAKEAWAYS = [
  'An initial view of your website, application or connected-system project and what needs checking.',
  'A practical next step, whether you have a clear brief or need help shaping one.',
  'A straight answer on whether we are the right people for it.',
] as const;

export const NEEDS = [
  {
    title: 'Someone who can agree the work.',
    body: 'Bring the person who knows what the business needs and can make decisions about the project.',
  },
  {
    title: 'A picture of what you use today.',
    body: 'Your website, booking tools, customer systems and the parts that need to work together. We agree any access needed before work begins.',
  },
  {
    title: 'The result you want.',
    body: 'More bookings, clearer enquiries, a better customer experience or a workflow your team can rely on. We agree how to measure it.',
  },
] as const;

export const FIT = {
  works: [
    'You want a new website or a better route from interest to enquiry or booking.',
    'You have an application idea or a clear build brief you want to discuss.',
    'You want customer records, bookings and everyday workflows to work together.',
    'You want useful AI with a clear job and appropriate human checks.',
    'You need help deciding what to build, connect or keep.',
    'You can act once the work is agreed.',
  ],
  doesNot: [
    {
      title: 'You only need routine social posting.',
      body: 'Our core work is websites, applications and connected systems. We can explain where that fits with your marketing.',
    },
    {
      title: 'You need a guaranteed business result.',
      body: 'We agree the work and how to measure it. We cannot guarantee demand, bookings or revenue.',
    },
    {
      title: 'The project cannot get the access it needs.',
      body: 'We agree the necessary access to people and systems before work begins. Without it, we cannot test the whole customer journey.',
    },
    {
      title: 'Nobody can make decisions about the build.',
      body: 'Someone needs to agree the brief, review the work and decide when it is ready to use.',
    },
  ],
} as const;

export const FAQS = [
  {
    q: 'Is the first conversation really free?',
    a: 'Yes. You get an hour to discuss the work and there is no obligation. Any paid work is agreed before it starts.',
  },
  {
    q: 'Can we come with a website or application brief?',
    a: 'Yes. Tell us what you want to build, who will use it and what it needs to achieve. If you are still deciding, we can help shape the brief and check what your existing systems can already do.',
  },
  {
    q: 'Do you only work with hospitality?',
    a: 'No. We build websites, applications and connected systems for small and mid-sized businesses. Our published measured results come from The Anchor, our own venue, and we make that distinction clear.',
  },
  {
    q: 'Who will we actually be dealing with?',
    a: 'You speak to the people doing the work. There is no account manager between you and the build.',
  },
  {
    q: 'What happens to what we tell you?',
    a: 'We use your enquiry to discuss the work with you. It does not sign you up to a marketing list. The privacy notice explains how your information is handled.',
  },
] as const;

export const ENQUIRY_INTRO =
  'Tell Peter what you want to build or improve: a website, an application or the systems behind your customer experience. A line is enough to start.';
export const ENQUIRY_REASSURANCE =
  'Sending a message does not commit you to a call or paid work. The first conversation is free. Any paid work is agreed before it starts.';
