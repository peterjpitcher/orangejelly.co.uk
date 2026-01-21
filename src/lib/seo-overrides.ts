export type SeoOverride = {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
};

export const seoOverrides: Record<string, SeoOverride> = {
  '/licensees-guide/profitable-pub-food-menu-ideas': {
    title: 'Profitable Pub Food Menu Ideas (High-Margin Picks)',
    description:
      'High-margin pub food ideas plus simple menu engineering tips to increase spend and profit. Practical, proven guidance from a working pub.',
  },
  '/licensees-guide/social-media-strategy-for-pubs': {
    title: 'Social Media Strategy for Pubs (Simple Weekly System)',
    description:
      'A simple social media plan for pubs: what to post, how to batch content, and how to drive footfall without living on your phone.',
  },
  '/licensees-guide/summer-pub-event-ideas': {
    title: 'Summer Pub Event Ideas That Fill Tables',
    description:
      'Summer pub event ideas you can actually run: themes, timelines, promotion tips, and simple systems that drive bookings and repeat visits.',
  },
  '/licensees-guide/pub-empty-tuesday-nights': {
    title: 'How to Fill an Empty Tuesday Night at Your Pub',
    description:
      'Practical midweek ideas to bring people in: events, offers, content and community. Includes a simple 30-day action plan you can follow.',
  },
  '/licensees-guide/facebook-marketing-local-pubs': {
    title: 'Facebook Marketing for Local Pubs (Groups, Events, Reviews)',
    description:
      'A simple Facebook plan for pubs: community posts, event promotion, reviews, and local reach without wasting hours. Built for pub life.',
  },
  '/licensees-guide/quiz-night-101': {
    title: 'Quiz Night 101: How to Run a Pub Quiz That Fills Tables',
    description:
      'A practical pub quiz guide: formats, pacing, promotion, prizes, and templates to build regular teams and consistent midweek trade.',
  },
  '/licensees-guide/recession-proof-pub-strategies': {
    title: 'Recession-Proof Pub Strategies (Keep Trade Up)',
    description:
      'Practical ways to protect pub trade when money is tight: offers that work, messaging, regulars, and simple systems that keep covers up.',
  },
  '/licensees-guide/cash-bingo-101': {
    title: 'Cash Bingo 101: How to Run It in Your Pub',
    description:
      'A simple cash bingo guide for pubs: how it works, how to run the night, promotion ideas, and tips to keep it profitable.',
  },
};
