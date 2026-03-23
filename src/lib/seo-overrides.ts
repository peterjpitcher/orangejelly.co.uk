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
    title: 'Social Media Strategy for Pubs (Weekly System)',
    description:
      'A weekly social media plan for pubs: what to post, when to post it, and how to turn followers into footfall. Tested at The Anchor.',
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
  // --- Sprint 2: Top 20 blog post SEO overrides ---
  '/licensees-guide/quiz-night-ideas': {
    title: 'Quiz Night Ideas: 25 Formats That Pack Your Pub',
    description:
      '25 quiz night ideas that fill pubs weekly. Formats, round ideas, and hosting tips from a pub that runs 25-35 teams every week. Steal our system.',
  },
  '/licensees-guide/compete-with-wetherspoons': {
    title: 'How to Compete with Wetherspoons (12 Strategies)',
    description:
      'Wetherspoons opened nearby? 12 proven strategies independent pubs use to compete and win. Written by a licensee who competes with chains daily.',
  },
  '/licensees-guide/how-to-run-successful-pub-events': {
    title: 'How to Run Successful Pub Events (Complete Guide)',
    description:
      'The complete guide to profitable pub events. Planning, promotion, and execution systems that grew our quiz night to 35 regulars. Templates included.',
  },
  '/licensees-guide/fill-empty-pub-tables': {
    title: 'How to Fill Empty Pub Tables (Proven System)',
    description:
      '15 proven strategies to fill empty pub tables. Tested at The Anchor with real results. Practical tactics you can start this week.',
  },
  '/licensees-guide/why-is-my-pub-empty': {
    title: 'Why Is My Pub Empty? 7 Real Reasons and Fixes',
    description:
      'Honest reasons your pub is empty and practical fixes that work. From a licensee who turned quiet nights into 25-35 regulars. No fluff, just solutions.',
  },
  '/licensees-guide/midweek-pub-offers-that-work': {
    title: 'Midweek Pub Offers That Actually Work',
    description:
      'Midweek pub offers that boost profit, not just footfall. Proven promotions for Tuesday to Thursday from pubs that turned quiet nights around.',
  },
  '/licensees-guide/low-budget-pub-marketing-ideas': {
    title: 'Low Budget Pub Marketing Ideas (Free and Cheap)',
    description:
      '25 low budget pub marketing ideas that actually work. Free and cheap tactics to fill your pub, tested by a licensee. No agency fees required.',
  },
  '/licensees-guide/content-marketing-ideas-pubs': {
    title: 'Content Marketing Ideas for Pubs (Simple Plan)',
    description:
      'What to post and when: a simple content plan for pubs. Weekly templates, real examples, and ideas that turn social media views into bookings.',
  },
  '/licensees-guide/instagram-marketing-for-pubs': {
    title: 'Instagram Marketing for Pubs (What to Post)',
    description:
      'Instagram marketing for pubs: what to post, when to post, and how to turn food photos into foot traffic. Simple system from a working pub.',
  },
  '/licensees-guide/christmas-pub-promotion-ideas': {
    title: 'Christmas Pub Promotion Ideas That Drive Revenue',
    description:
      '30 Christmas pub promotion ideas to secure December bookings early. Party packages, festive menus, and marketing timelines from a working licensee.',
  },
  '/licensees-guide/seasonal-pub-events-calendar': {
    title: 'Pub Events Calendar: What to Run Each Month',
    description:
      'Month-by-month pub events calendar with profitable ideas for every season. From Burns Night to Christmas, never face a quiet period again.',
  },
  '/licensees-guide/turnaround-playbook-independent-bars': {
    title: 'Pub Turnaround Playbook (30-Day Recovery Plan)',
    description:
      'A step-by-step pub turnaround playbook: stabilise cash, reset your offer, relaunch with proof. Four-phase plan from a licensee who has done it.',
  },
  '/licensees-guide/revenue-levers-struggling-pubs': {
    title: 'Revenue Levers for Struggling Pubs (Quick Wins)',
    description:
      '9 revenue levers every struggling pub should pull this week. Events, bundles, upsells, and space hire tactics that bring in cash fast.',
  },
  '/licensees-guide/menu-engineering-lift-average-spend': {
    title: 'Menu Engineering for Pubs: Lift Average Spend',
    description:
      'Menu engineering tactics for pubs: layout tricks, pricing ladders, and language tweaks that lift average spend. Proven at The Anchor.',
  },
  '/licensees-guide/pub-differentiation-strategies': {
    title: 'Pub Differentiation: 15 Ideas to Stand Out',
    description:
      '15 proven pub differentiation strategies to stand out from the competition. Find your niche, build loyalty, and become the local destination.',
  },
  '/licensees-guide/how-to-attract-families-to-your-pub': {
    title: 'How to Attract Families to Your Pub (Easy Wins)',
    description:
      'Practical ways to attract families to your pub without alienating regulars. Menus, events, and simple changes that fill tables on quiet days.',
  },
  '/licensees-guide/pub-health-check-essential-fundamentals-licensee-success': {
    title: 'Pub Health Check: Essential Fundamentals Guide',
    description:
      'A complete pub health check covering GP targets, cellar management, wastage, marketing, and community engagement. The fundamentals every licensee needs.',
  },
  '/licensees-guide/beat-chain-pubs': {
    title: 'Beat Chain Pubs: Independent Pub Survival Guide',
    description:
      'How independent pubs beat chain pub competition. Leverage your advantages: personal service, flexibility, and community. Strategies that actually work.',
  },
  '/licensees-guide/email-marketing-pub-retention': {
    title: 'Email Marketing for Pubs (Build Repeat Trade)',
    description:
      'Email marketing for pubs: build a database, send campaigns that convert, and turn one-time visitors into regulars. Simple system, real results.',
  },
  // --- Sprint 4: Remaining blog post SEO overrides ---
  '/licensees-guide/theme-hour-power-hour': {
    title: 'Theme Hour for Pubs: Saturday Power Hour Toolkit',
    description:
      'Run a 60-minute Theme Hour before the dinner rush. Playlists, spin-to-win mechanics, and spritz bundles that lift Saturday pre-peak pub trade.',
  },
  '/licensees-guide/turn-heating-costs-into-winter-wins': {
    title: 'Pub Heating Costs: Turn Winter Into Revenue',
    description:
      'Turn winter heating costs into pub revenue. Hot drinks, seasonal events, and smart pricing that cover the spike and boost cold-weather trade.',
  },
  '/licensees-guide/double-drinks-profit-without-selling-more': {
    title: 'Double Pub Drinks Profit Without Selling More',
    description:
      'Shift your pub drinks mix from volume to margin. Premium spirits, coffee, and cocktails that double profit per serve. Proven at The Anchor.',
  },
  '/licensees-guide/boardgame-night-101': {
    title: 'Boardgame Night 101: Fill Quiet Pub Mondays',
    description:
      'Run a board game night that fills Monday tables. Zone layouts, game picks, loyalty mechanics, and food pairings from a working pub toolkit.',
  },
  '/licensees-guide/build-loyalty-scheme-fill-pub': {
    title: 'Pub Loyalty Scheme That Fills Tables Every Week',
    description:
      'Build a simple pub loyalty scheme that rewards visits, drives referrals, and fills Fridays. Mechanics, tech options, and promotion ideas included.',
  },
  '/licensees-guide/cashflow-fixes-when-trade-drops': {
    title: 'Pub Cashflow Fixes When Trade Drops Fast',
    description:
      'Immediate cashflow fixes for pubs when trade drops. 13-week forecast, supplier talks, upsells, and emergency sales drives to stabilise your bar.',
  },
  '/licensees-guide/crisis-pr-landlords-bad-reviews': {
    title: 'Crisis PR for Pub Landlords: Bad Review Recovery',
    description:
      'Handle brutal pub reviews with a 12-hour response protocol. Templates, root-cause fixes, and comeback stories that rebuild trust with locals.',
  },
  '/licensees-guide/delivery-click-collect-without-harm': {
    title: 'Pub Delivery and Click & Collect Without Harm',
    description:
      'Add delivery and click-and-collect to your pub without wrecking dine-in service. Menu design, staffing, and tech setup for dual-channel ops.',
  },
  '/licensees-guide/epos-data-revenue-comeback': {
    title: 'Use Pub EPOS Data to Drive a Revenue Comeback',
    description:
      'Turn EPOS reports into weekly pub action plans. Track covers, spend, and product mix to boost revenue with data-driven decisions.',
  },
  '/licensees-guide/family-craft-hour-101': {
    title: 'Family Craft Hour 101: Sunday Pub Toolkit',
    description:
      'Run a safeguarded Sunday craft hour that fills your pub dining room. Seasonal themes, consent templates, and craft-plus-roast bundles included.',
  },
  '/licensees-guide/fill-empty-seats-midweek-offers': {
    title: 'Pub Midweek Offers That Fill Empty Seats',
    description:
      'Design midweek pub offers that protect GP and fill empty seats. Data-backed bundles, pre-booking hooks, and upsell stacks that convert.',
  },
  '/licensees-guide/food-allergies-gdpr-compliance': {
    title: 'Pub Allergen and GDPR Compliance Made Simple',
    description:
      'Simple allergen and GDPR compliance systems for pubs. Spreadsheet templates, staff scripts, and data handling that prevent costly fines.',
  },
  '/licensees-guide/live-music-events-for-pubs': {
    title: 'Live Music for Pubs: Booking, Hosting, Profit',
    description:
      'Complete guide to profitable live music in your pub. Booking acts, sound setup, licensing, and promotion strategies from open mic to ticketed shows.',
  },
  '/licensees-guide/local-pub-marketing': {
    title: 'Local Pub Marketing: Community Strategies Guide',
    description:
      'Community-focused pub marketing that builds loyal customers. Facebook groups, local partnerships, and neighbourhood strategies that drive footfall.',
  },
  '/licensees-guide/low-cost-decor-refreshes-new-improved': {
    title: 'Low-Cost Pub Decor Refreshes That Signal Change',
    description:
      'Affordable pub decor moves that scream fresh energy. Paint, signage, lighting, and furniture hacks that transform your space without builders.',
  },
  '/licensees-guide/music-bingo-101': {
    title: 'Music Bingo 101: Pub Night Toolkit and Guide',
    description:
      'Run 90-minute music bingo nights at your pub. Playlists, Canva card templates, MC tips, and compliance notes for a midweek crowd-filler.',
  },
  '/licensees-guide/partnering-local-brands-share-marketing': {
    title: 'Partner with Local Brands to Cut Pub Marketing',
    description:
      'Share pub marketing costs by partnering with local brands. Co-branded campaigns, contract templates, and distribution swaps that fill both calendars.',
  },
  '/licensees-guide/premium-pub-positioning': {
    title: 'Premium Pub Positioning: Go Upmarket Profitably',
    description:
      'Position your pub as a premium destination. Craft drinks, chef partnerships, tasting events, and service upgrades that justify higher prices.',
  },
  '/licensees-guide/pub-event-template-profit-nights': {
    title: 'Pub Event Template for Guaranteed Profit Nights',
    description:
      'Reusable pub event blueprint: 6-week timeline, pre-sales, sponsor lock-in, and post-event upsells so every activation hits profit targets.',
  },
  '/licensees-guide/pub-refurbishment-on-budget': {
    title: 'Pub Refurbishment on a Budget: Fix First Guide',
    description:
      'Budget pub refurbishment priorities under 5K. Lighting, paint, seating, and photo spots that bring customers back. Real costs and DIY solutions.',
  },
  '/licensees-guide/quiet-monday-night-promotions': {
    title: 'Monday Night Pub Promotions That Actually Work',
    description:
      'Monday night pub ideas beyond another quiz. Craft clubs, skill-sharing, and community socials tested at The Anchor that build weekly regulars.',
  },
  '/licensees-guide/reboot-pub-atmosphere-on-budget': {
    title: 'Reboot Your Pub Atmosphere on a Budget',
    description:
      'Transform a quiet pub atmosphere with low-cost sensory changes. Music, lighting, scent, host energy, and micro-moments that make the room buzz.',
  },
  '/licensees-guide/rent-supplier-negotiations-cash-tight': {
    title: 'Pub Rent and Supplier Negotiation When Cash Tight',
    description:
      'Negotiate pub rent and supplier terms when cash is tight. Scripts, repayment plans, and relationship tactics that secure breathing room.',
  },
  '/licensees-guide/rescue-your-margins-drinks-mix': {
    title: 'Rescue Pub Margins with a Better Drinks Mix',
    description:
      'Engineer a pub drinks range that defends GP when prices climb. Three-tier pours, limited releases, and bar training that lifts every round.',
  },
  '/licensees-guide/social-media-tactics-footfall-seven-days': {
    title: 'Pub Social Media Tactics: Footfall in 7 Days',
    description:
      'A 7-day social media sprint for pubs. Content ideas, retargeting ads, and direct invites that turn Instagram and Facebook into real bookings.',
  },
  '/licensees-guide/summer-moments-simple-campaigns': {
    title: 'Summer Pub Campaigns: Simple Ideas May to August',
    description:
      'An inspiring idea bank of simple summer campaigns for pub teams. Bank holidays, sunny Fridays, and seasonal formats that drive footfall May to August.',
  },
  '/licensees-guide/survive-off-season-revenue-packages': {
    title: 'Pub Off-Season Packages That Keep Revenue Coming',
    description:
      'Build shoulder-season pub packages for corporates, families, and clubs. Bundle space, food, and experiences into ready-to-buy offers.',
  },
  '/licensees-guide/upselling-secrets-training-scripts': {
    title: 'Pub Upselling Scripts That Feel Natural',
    description:
      'Train your pub team to upsell without sounding pushy. Needs-based questions, two-option offers, and conversational bridges that lift spend.',
  },
  '/licensees-guide/win-back-locals-after-slow-trade': {
    title: 'Win Back Pub Locals After Months of Slow Trade',
    description:
      'A reconnection plan to bring locals back to your pub. Personal invites, 30-day return sequences, and trust-rebuilding tactics that work fast.',
  },
  '/licensees-guide/young-people-wont-come-to-your-pub': {
    title: 'Attract Young People to Your Pub (18-30s Guide)',
    description:
      'Proven strategies to attract 18-30s to your pub. Instagram moments, events they want, and atmosphere fixes that beat their sofa. No gimmicks.',
  },
  '/licensees-guide/30-day-action-plan-stabilise-hospitality': {
    title: '30-Day Pub Action Plan to Stabilise Trade',
    description:
      'A day-by-day checklist to stabilise a struggling pub in 30 days. Cash triage, offer reset, sales push, and scale-up sprints that work.',
  },
  '/licensees-guide/energy-bill-shock-cut-venue-costs': {
    title: 'Cut Pub Energy Bills: Boost Your Margins',
    description:
      'Slash pub utility bills within 30 days. Equipment audits, smart schedules, tariff renegotiation, and team habits that cut costs fast.',
  },
  '/licensees-guide/karaoke-night-101': {
    title: 'Karaoke Night 101: Pub Licensee Toolkit',
    description:
      'Run compliant, high-energy karaoke nights at your pub. Kit checklist, 2-hour run-sheet, rotation rules, and TheMusicLicence reminders.',
  },
  '/licensees-guide/restart-quiz-music-sport-roi': {
    title: 'Restart Pub Quiz, Music and Sport for Max ROI',
    description:
      'Relaunch pub entertainment nights with profit-focused planning. Pre-booking, tiered experiences, and bar bundles that make every night pay.',
  },
  '/licensees-guide/staff-motivation-hacks-no-pay-rise': {
    title: 'Pub Staff Motivation When Pay Rises Are Off',
    description:
      'Motivate pub staff without pay rises. Recognition rituals, skill swaps, and micro-incentives that keep your best people engaged and loyal.',
  },
  '/licensees-guide/zero-waste-stock-management-pubs': {
    title: 'Zero-Waste Pub Stock Management (Survival Mode)',
    description:
      'Protect every pound of GP with disciplined pub stock control. Counting rhythms, shared-ingredient menus, and waste KPIs that cut shrinkage fast.',
  },
  '/licensees-guide/community-outreach-reintroduce-pub': {
    title: 'Community Outreach to Reintroduce Your Pub',
    description:
      'Reconnect your pub with the neighbourhood through purposeful outreach. Schools, clubs, and charity partnerships that turn goodwill into bookings.',
  },
  '/licensees-guide/fizz-street-food-pop-up': {
    title: 'Friday Fizz and Street Food Pop-Up for Pubs',
    description:
      'Run a sell-out Friday fizz and street food pop-up at your pub. Partner checklists, spritz bundles, and a 90-minute ops flow for busy teams.',
  },
  // --- Sprint 4: Newly published draft posts ---
  '/licensees-guide/brewery-tie-improve-your-deal': {
    title: 'Brewery Tie: Legal Ways to Improve Your Pub Deal',
    description:
      'Work within your brewery tie to boost pub profits legally. MRO options, BDM negotiation tactics, and free-of-tie categories that lift margin.',
  },
  '/licensees-guide/cash-flow-crisis-breaking-cycle': {
    title: 'Pub Cash Flow Crisis: Break the Monthly Cycle',
    description:
      'Stop the monthly pub cash panic. Build predictable income with recurring events, payment timing, and a 90-day buffer plan that works.',
  },
  '/licensees-guide/nobody-books-tables-anymore': {
    title: 'Pub Table Bookings vs Walk-Ins: The Right Balance',
    description:
      'Master pub bookings and walk-ins with the golden ratio. No-show prevention, time slots, and a simple system that maximises covers nightly.',
  },
  '/licensees-guide/terrible-online-reviews-damage-control': {
    title: 'Bad Pub Reviews? The Damage Control Playbook',
    description:
      'Turn terrible pub reviews into marketing gold. A 24-hour response framework and prevention system that converts critics into regulars.',
  },
  '/licensees-guide/village-pub-dying-village-survival': {
    title: 'Village Pub Survival: When Your Village Shrinks',
    description:
      'Transform a struggling village pub into a destination. Wider catchment strategies, multi-use spaces, and digital tactics for rural pubs.',
  },
  '/licensees-guide/kitchen-nightmares-chef-quits': {
    title: 'Chef Walked Out? Pub Kitchen Emergency Protocol',
    description:
      'Your pub chef just quit mid-service. Emergency protocol for the first 10 minutes, plus a prevention system so it never happens again.',
  },
};
