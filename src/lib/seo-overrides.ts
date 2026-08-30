export type SeoOverride = {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
};

export const seoOverrides: Record<string, SeoOverride> = {
  '/': {
    title: 'Hospitality Marketing From a Real Publican | Orange Jelly',
    description:
      'Hospitality marketing proven at a real pub. We grew table bookings 403% and food revenue 98% at The Anchor. Packages from £375 + VAT.',
    keywords: [
      'hospitality marketing',
      'hospitality marketing ideas',
      'pub marketing',
      'pub marketing ideas',
      'hospitality growth',
    ],
  },
  '/ways-to-work': {
    title: 'Pub Marketing Packages and Prices From £375 + VAT',
    description:
      'Four clear pub marketing packages, from a one-off Growth Fix to ongoing partner support. Transparent pricing, payment plans available, no hidden fees.',
  },
  '/ways-to-work/growth-fix': {
    title: 'Growth Fix: Solve One Pub Problem Fast From £375 + VAT',
    description:
      'Solve one clear pub problem fast. The Growth Fix gives you a focused action plan and one targeted intervention in just 5 hours. From £375 + VAT.',
  },
  '/ways-to-work/momentum-month': {
    title: 'Momentum Month: Ongoing Pub Marketing, £900/mo + VAT',
    description:
      'Monthly pub marketing support that builds real momentum. Strategy, content planning, and hands-on execution. £900/mo + VAT.',
  },
  '/ways-to-work/growth-partner': {
    title: 'Growth Partner: Full Pub Marketing Support | Orange Jelly',
    description:
      'Full-service pub marketing partnership. Strategy, execution, and continuous optimisation to grow your venue. From £1,800/mo + VAT.',
  },
  '/ways-to-work/turnaround-intensive': {
    title: 'Pub Turnaround Intensive: a 30-Day Commercial Reset',
    description:
      'A 30-day intensive to reset your pub commercially. Full diagnostic, action plan, website rebuild, and hands-on support.',
  },
  '/capabilities': {
    title: 'Pub Marketing Capabilities: Social, Events, SEO and More',
    description:
      'Full-stack pub marketing: social media, events, paid ads, local visibility, content and website work. See what is included in each package.',
  },
  '/pub-marketing': {
    title: 'Pub Marketing: Proven Systems From a Working Licensee',
    description:
      'Pub marketing that fills tables, run by a licensee who does it daily: strategy, social, events and local visibility. Packages from £375 + VAT.',
  },
  '/pub-marketing-agency': {
    title: 'Pub Marketing Agency for Independent Pubs & Bars',
    description:
      'A pub marketing agency run by a working licensee, not account managers. Social, events, paid ads and local SEO for independent pubs. From £375 + VAT.',
  },
  /*
   * The rescue page's override is deleted rather than renamed.
   *
   * It read "Pub Rescue: Fast Turnaround Help From a Working Licensee" and quoted
   * "Packages from £375 + VAT". Inert today, because the page exports its own
   * metadata, but it names a package at a price on a site that has neither (D3), and
   * carrying it through the rename would have kept a live breach one refactor away.
   */
  '/empty-pub-solutions': {
    title: 'Empty Pub? A Proven Plan to Fill Tables Again',
    description:
      'An empty pub is a fixable problem. A practical plan to bring footfall back: events, offers and local visibility, from a working licensee. From £375 + VAT.',
  },
  '/quiet-midweek-solutions': {
    title: 'Quiet Midweek? Fill Tuesday & Wednesday Nights',
    description:
      'Turn dead midweek nights into reliable trade with Tuesday and Wednesday formats tested at The Anchor, tailored to your pub. From £375 + VAT.',
  },
  '/licensees-guide/profitable-pub-food-menu-ideas': {
    title: 'Profitable Pub Food: 12 Dish Types and the GP Maths',
    description:
      'Profitable pub food worked properly: 12 dish types, UK GP benchmarks, a VAT-correct costing example, and how to price up without losing your regulars.',
  },
  '/licensees-guide/social-media-strategy-for-pubs': {
    title: 'Social Media for Pubs: The Weekly Plan That Fills Tables',
    description:
      'A weekly social media plan for pubs: what to post, when, and how to turn views into bookings. The system behind our 828% search visibility growth.',
  },
  '/licensees-guide/summer-pub-event-ideas': {
    title: 'Pub Event Ideas for Summer: 35 That Make Money',
    description:
      '35 summer pub event ideas you can actually run: themes, timelines and promotion that drive bookings and repeat visits. From a working pub.',
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
    title: 'How to Run a Pub Quiz: Format, Rounds, Scoring and Prizes',
    description:
      'How to run a pub quiz that builds regular teams: format, round structure, scoring, timings, prizes and promotion. Tested weekly in a working pub.',
  },
  '/licensees-guide/recession-proof-pub-strategies': {
    title: 'Recession-Proof Pub Strategies (Keep Trade Up)',
    description:
      'Practical ways to protect pub trade when money is tight: offers that work, messaging, regulars, and simple systems that keep covers up.',
  },
  '/licensees-guide/cash-bingo-101': {
    title: 'Pub Bingo: How to Run a Cash Bingo Night That Pays',
    description:
      'How to run bingo in a pub: 90-ball format, the compliance position, kit and setup, payout models and a run-of-show that fills a quiet midweek night.',
  },
  // --- Sprint 2: Top 20 blog post SEO overrides ---
  '/licensees-guide/quiz-night-ideas': {
    title: 'Quiz Night Ideas: 25 Pub Quiz Formats That Pack Tables',
    description:
      '25 quiz night ideas that fill pubs weekly. Formats, round ideas, and hosting tips from a pub that grew table bookings 403%. Steal our system.',
  },
  '/licensees-guide/compete-with-wetherspoons': {
    title: 'How to Compete with Wetherspoons (12 Strategies)',
    description:
      'Wetherspoons opened nearby? 12 proven strategies independent pubs use to compete and win. Written by a licensee who competes with chains daily.',
  },
  '/licensees-guide/how-to-run-successful-pub-events': {
    title: 'How to Run Successful Pub Events (Complete Guide)',
    description:
      'The complete guide to profitable pub events. Planning, promotion, and execution systems that grew our table bookings 403%. Templates included.',
  },
  '/licensees-guide/fill-empty-pub-tables': {
    title: 'How to Fill Empty Pub Tables (Proven System)',
    description:
      '15 proven strategies to fill empty pub tables. Tested at The Anchor with real results. Practical tactics you can start this week.',
  },
  '/licensees-guide/why-is-my-pub-empty': {
    title: 'Why Is My Pub Empty? 7 Real Reasons and Fixes',
    description:
      'Honest reasons your pub is empty and practical fixes that work. From a licensee who grew table bookings 403%. No fluff, just solutions.',
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
    title: 'Pub Content Ideas: What to Post to Fill Tables',
    description:
      'What to post and when: a simple content plan for pubs. Weekly templates, real examples, and ideas that turn social media views into bookings.',
  },
  '/licensees-guide/instagram-marketing-for-pubs': {
    title: 'Instagram for Pubs: What to Post and When to Post It',
    description:
      'Instagram for pubs without the guesswork: what to post, the best times to post, and how to turn food photos into bookings. A simple weekly system.',
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
    title: 'How to Run a Pub: The Fundamentals That Actually Matter',
    description:
      'Running a pub is relentless. The fundamentals that actually matter: licensing, money, staff, marketing and filling tables, from a working publican.',
    keywords: [
      'how to run a pub',
      'running a pub',
      'pub management',
      'pub landlord guide',
      'licensee guide',
    ],
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
    title: 'Pub Co-Branding: Partner With Local Brands and Share Costs',
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
  '/licensees-guide/pop-up-events-for-pubs': {
    title: 'Pop-Up Events for Pubs: Formats That Fill Quiet Nights',
    description:
      'Pop-up events that fill quiet nights: street food, guest chefs, makers markets and themed takeovers, plus how to plan, price and promote them.',
  },
  // --- Sprint 4: Newly published draft posts ---
  '/licensees-guide/brewery-tie-improve-your-deal': {
    title: 'Pub Lease Guide: Leases, Tenancies and Brewery Ties',
    description:
      'Complete guide to pub leases, tenancies and brewery ties. Understand your agreement, negotiate better terms, know your Pubs Code rights, and plan finances.',
    keywords: [
      'pub lease',
      'pub tenancy',
      'brewery tie',
      'tied pub',
      'pub lease agreement',
      'MRO option',
      'Pubs Code',
    ],
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
  '/licensees-guide/does-your-pub-need-a-website': {
    title: 'Does Your Pub Need a Website? What Actually Works in 2026',
    description:
      'Honest advice on pub websites and SEO. What to include, how much to spend, and why Google Business Profile matters more than you think.',
    keywords: ['pub website', 'pub seo', 'local seo for pubs', 'pub website cost'],
  },
  '/licensees-guide/buying-a-pub-complete-guide': {
    title: 'Buying a Pub: Complete UK Guide for First-Time Buyers',
    description:
      'Thinking of buying a pub? Freehold vs leasehold, the real costs, due-diligence traps and a 90-day plan. Honest guidance from someone who runs one.',
    keywords: [
      'buying a pub',
      'how to start a pub',
      'taking over a pub',
      'pub for sale UK',
      'pub tenancy',
    ],
  },
  '/licensees-guide/pub-recruitment-hiring-bar-staff': {
    title: 'Pub Recruitment: How to Hire (and Keep) Great Bar Staff',
    description:
      'How to hire and keep good pub staff: where to find candidates, job ad templates, interview red flags, onboarding and retention that actually works.',
    keywords: [
      'hospitality recruitment',
      'hiring bar staff',
      'pub staff recruitment',
      'pub chef recruitment',
      'pub staff retention',
    ],
  },
  '/licensees-guide/food-hygiene-rating-five-star-guide': {
    title: 'How to Get a 5-Star Food Hygiene Rating (Pub Guide)',
    description:
      'How to score 5 on food hygiene: what EHO inspectors assess, how to prepare, the common failures, re-inspection, and the daily routines that hold it.',
    keywords: [
      'food hygiene rating',
      'how to improve food hygiene rating',
      'EHO inspection',
      'food hygiene rating 5',
      'food hygiene inspection pub',
    ],
  },
  '/licensees-guide/pub-business-plan-template-guide': {
    title: 'Pub Business Plan: Free Template & Step-by-Step Guide',
    description:
      'Write a pub business plan that gets approved: financials, market analysis, operations and marketing. Free template from a working licensee.',
    keywords: [
      'pub business plan',
      'pub business plan template',
      'how to write a pub business plan',
      'brewery application business plan',
    ],
  },
  '/licensees-guide/pub-insurance-cover-guide': {
    title: 'Pub Insurance: What Cover You Need and What It Costs',
    description:
      'What insurance does a pub need? Public and employers liability, buildings, contents and business interruption, with realistic UK costs.',
    keywords: [
      'pub insurance',
      'pub liability insurance',
      'employers liability pub',
      'pub insurance cost',
      'pub buildings insurance',
      'business interruption insurance pub',
    ],
  },
  '/licensees-guide/prs-ppl-music-licensing-pubs': {
    title: 'PRS and PPL Music Licensing for Pubs: What You Actually Pay',
    description:
      'TheMusicLicence explained: what PRS and PPL actually cover, how fees work by venue size, and the penalties for getting it wrong. Written by a licensee.',
    keywords: [
      'pub background music',
      'PRS licence pub',
      'PPL licence pub',
      'music licence cost pub',
      'pub music playlist',
      'TheMusicLicence',
    ],
  },
  '/licensees-guide/pub-health-safety-checklist': {
    title: "Pub Health and Safety: The Licensee's Practical Checklist",
    description:
      'A practical health and safety checklist for licensees: risk assessments, fire safety, COSHH, cellar safety, noise and inspection prep.',
    keywords: [
      'pub health and safety',
      'fire safety pub',
      'pub noise complaint',
      'pub risk assessment',
      'COSHH pub',
      'pub inspection checklist',
    ],
  },
  '/licensees-guide/pub-epos-system-guide': {
    title: 'The Complete Guide to Pub EPOS Systems in 2026',
    description:
      'What to look for in a pub EPOS system. Key features, integration checklist, and how to use till data to grow revenue. Written by a working licensee.',
    keywords: [
      'pub epos system',
      'best epos system for pubs',
      'pub till system',
      'pub point of sale',
      'epos system for pubs',
    ],
  },
  '/licensees-guide/pub-wages-labour-costs-guide': {
    title: 'Pub Wages and Labour Costs: What to Pay, How to Control It',
    description:
      'What to pay pub staff in the UK and how to keep labour costs under 30%. Realistic rates by role, rota tips, and benchmarks from a working licensee.',
    keywords: [
      'pub wages uk',
      'bar staff pay rates',
      'pub overheads',
      'pub labour costs',
      'pub staff wages',
    ],
  },
  '/licensees-guide/pub-christmas-bookings-fill-december': {
    title: 'Pub Christmas Bookings: How to Fill Your December Calendar',
    description:
      'Fill December with Christmas bookings: pricing, deposit policies, set menus, entertainment and a 12-week promotion timeline from a working pub.',
    keywords: [
      'pub christmas party booking',
      'pub christmas ideas',
      'christmas pub quiz',
      'pub christmas menu',
      'pub december bookings',
    ],
  },
  '/licensees-guide/pub-licensing-premises-personal-licence-guide': {
    title: 'Pub Licensing Explained: Premises, Personal and TENs',
    description:
      'Every licence a pub landlord needs explained in plain English. Premises licences, personal licences, TENs, costs, timelines, and common mistakes to avoid.',
    keywords: [
      'premises licence',
      'pub licensing',
      'personal licence holder',
      'temporary event notice',
      'TEN notice',
      'alcohol licence',
      'designated premises supervisor',
    ],
  },
  '/licensees-guide/how-to-respond-bad-pub-reviews': {
    title: 'How to Respond to Bad Pub Reviews (Without Making It Worse)',
    description:
      'Response templates for 1-star pub reviews: the three golden rules, what never to say, and how to generate more positive reviews.',
    keywords: [
      'how to respond to bad pub reviews',
      'pub reputation management',
      'pub tripadvisor ranking',
      'how to get more pub reviews',
      'bad pub review response',
    ],
  },
  '/licensees-guide/google-business-profile-pub-guide': {
    title: 'Google Business Profile for Pubs: The Complete Setup Guide',
    description:
      'Set up and optimise your pub Google Business Profile: get into the local 3-pack, manage reviews and turn searches into customers.',
    keywords: [
      'pub google maps',
      'google business profile pub',
      'how to get on google maps pub',
      'pub near me ranking',
      'local seo for pubs',
    ],
  },
  '/licensees-guide/cellar-management-beer-quality-guide': {
    title: 'Pub Cellar Management: Keep Beer Fresh and Cut Wastage',
    description:
      'Flat pints and ullage quietly wreck your GP. The cellar routine that protects margin: temperature, line cleaning, FIFO stock rotation and wastage tracking.',
    keywords: [
      'cellar management',
      'pub stock take',
      'pub wastage',
      'cask ale',
      'beer quality',
      'line cleaning',
      'pub cellar temperature',
    ],
  },
  '/licensees-guide/pub-halloween-bonfire-night-events': {
    title: 'Pub Bonfire Night & Halloween: Events That Actually Work',
    description:
      'Halloween and Bonfire Night ideas for pubs: themed quizzes, family daytime events, ticketed fireworks and seasonal menus that drive autumn trade.',
    keywords: [
      'pub halloween party',
      'pub bonfire night',
      'pub autumn events',
      'halloween pub event ideas',
      'bonfire night pub menu',
    ],
  },
  '/licensees-guide/pub-accessibility-welcoming-guide': {
    title: 'Pub Accessibility: Making Your Venue Welcoming for Everyone',
    description:
      'Make your pub accessible, dog friendly and family friendly: Equality Act 2010 duties, practical improvements and the business case for it.',
    keywords: [
      'disabled access',
      'pub dog friendly',
      'pub child friendly',
      'accessible pub',
      'pub accessibility',
      'Equality Act 2010 pubs',
    ],
  },
  '/licensees-guide/pub-vat-accounting-guide': {
    title: 'Pub VAT Explained: What to Reclaim and When to Register',
    description:
      'Plain-English pub VAT and bookkeeping: what you can reclaim, when to register, the mistakes that cost you, and how to pick a hospitality accountant.',
    keywords: [
      'pub vat',
      'vat on pub food',
      'pub accounting',
      'pub bookkeeping',
      'pub tax mistakes',
      'hospitality accountant',
    ],
  },
  '/licensees-guide/pub-drinks-menu-design-guide': {
    title: 'Pub Drinks Menu: Design a Menu That Grows Revenue',
    description:
      'Design a pub drinks menu that sells high-margin lines: layout psychology, pricing ladders, cocktails, wine for non-experts and premium softs.',
    keywords: [
      'pub drinks menu',
      'pub cocktail list',
      'pub wine list ideas',
      'pub gin menu',
      'pub soft drinks',
      'drinks menu design',
    ],
  },
  '/licensees-guide/pub-toilet-refurbishment-budget-guide': {
    title: 'Pub Toilet Refurbishment on a Budget: Make an Impression',
    description:
      'Budget pub toilet refurbishment: prioritise paint, lighting, mirrors and hand drying for under £1,000. Maintenance schedule and real costs.',
    keywords: [
      'pub toilet refurbishment',
      'pub lighting ideas',
      'pub toilet upgrade',
      'pub bathroom renovation',
      'pub toilet maintenance',
    ],
  },
  '/licensees-guide/pub-new-years-eve-planning-guide': {
    title: "New Year's Eve for Pubs: Planning, Pricing & Promotion",
    description:
      "Plan a profitable pub New Year's Eve: ticketing vs walk-in, pricing, menus, entertainment, staffing and turning NYE visitors into January regulars.",
    keywords: [
      'pub new year menu',
      'pub valentines menu',
      'pub bank holiday events',
      'new years eve pub',
      'pub NYE event',
    ],
  },
  '/licensees-guide/pub-chalkboard-a-board-ideas': {
    title: 'Pub Chalkboard & A-Board Ideas That Actually Drive Footfall',
    description:
      'Pub chalkboard and A-board ideas that turn passers-by into customers: what to write, design tips, seasonal messages and the legal rules.',
    keywords: [
      'pub chalkboard ideas',
      'pub a-board signs',
      'pub window display',
      'pub pavement sign',
      'pub signage ideas',
    ],
  },
  '/licensees-guide/how-much-profit-does-a-pub-make': {
    title: 'How Much Profit Does a Pub Make? Realistic Numbers for 2026',
    description:
      'Real pub profit benchmarks for 2026: wet GP, food GP, labour, rent, and take-home pay. From a licensee who grew food revenue 98% and table bookings 403%.',
    keywords: [
      'how much profit does a pub make',
      'average pub turnover uk',
      'pub gross profit',
      'pub profit calculator',
      'pub break even',
    ],
  },
  // --- Week 24-26: Final editorial calendar posts ---
  '/licensees-guide/pub-six-nations-rugby-marketing': {
    title: 'Six Nations 2026: How to Make the Most of Rugby in Your Pub',
    description:
      'How to screen Six Nations rugby in your pub: setup, food and drink deals, bookings, promotion and turning match-day crowds into regulars.',
    keywords: ['pub Six Nations', 'pub sporting events', 'screening rugby in pub', 'pub match day'],
  },
  '/licensees-guide/wet-led-vs-food-led-pubs': {
    title: 'Wet-Led vs Food-Led Pubs: Understanding Your Revenue Model',
    description:
      'Wet-led vs food-led pubs explained. Revenue models, GP targets, staffing, marketing differences, and how to decide which model is right for your venue.',
    keywords: [
      'wet led pub',
      'dry led pub',
      'food led pub',
      'pub revenue model',
      'pub gross profit',
    ],
  },
  '/licensees-guide/pub-marketing-plan-2026-monthly-guide': {
    title: 'Your Pub Marketing Plan for 2026: Month-by-Month Guide',
    description:
      'Month-by-month pub marketing plan for 2026. What to promote, events to run, social media themes, and how to build momentum across the year.',
    keywords: [
      'pub marketing plan',
      'pub marketing calendar 2026',
      'pub promotion ideas',
      'pub events calendar',
    ],
  },
  // --- 2026-08-09 CTR reclaim: pages earning impressions well below the click-through
  // rate expected for their position. Evidence: GSC 12-month export, see
  // tasks/keyword-plan/2026-08-09-ctr-reclaim.md ---
  // No '/services' entry: next.config 301s /services to /ways-to-work, so an override
  // here would never render. GSC still shows impressions against the old URL, which is
  // historical rather than a live page.
  '/licensees-guide': {
    title: "The Licensee's Guide: 100+ Practical Guides for UK Pubs",
    description:
      'Over 100 practical guides for UK licensees: filling tables, running events, menu margins, staffing, compliance and marketing. From a working publican.',
  },
  '/results': {
    title: 'Pub Marketing Results: What Actually Moved the Numbers',
    description:
      'Real results from The Anchor: Google Search visibility up 828%, table bookings up 403% and food revenue up 98%. The work behind each number.',
  },
  '/licensees-guide/national-drinks-days-pub-guide': {
    title: 'National Drinks Days 2026: A Pub Promotion Calendar',
    description:
      'Every national drinks day worth running in 2026, with dates, serves, pricing and promotion you can set up in a single shift. Built for licensees.',
  },
  '/licensees-guide/cask-ale-week-pub-guide': {
    title: 'Cask Ale Week 2026: A 10-Day Beer Festival Plan',
    description:
      'Run Cask Ale Week 2026 as your own beer festival: a 10-day plan with featured casks, a beer passport, tasting paddles and plain-English tasting notes.',
  },
  '/licensees-guide/macmillan-coffee-morning-pub-guide': {
    title: 'Pub Coffee Morning Ideas: Fill a Quiet Daytime',
    description:
      'Coffee morning ideas for pubs: a run-sheet, raffle and local-group tie-in that fill a dead daytime and raise money. Includes the Macmillan 2026 date.',
  },
  '/licensees-guide/autumn-rugby-nations-championship-pubs': {
    title: 'Autumn Internationals 2026: Fill Your Pub for the Rugby',
    description:
      'Fill your pub for the November 2026 autumn internationals: fixtures, table bookings, match platters and a screen and sound checklist for licensees.',
  },
  // --- 2026-08-09 truncation fix: pages with no override had "| Orange Jelly"
  // appended, pushing the rendered title past the ~60-char SERP limit (and repeating
  // the brand twice on /about). An override is used verbatim, with no suffix. ---
  '/about': {
    title: 'Hospitality Consultant: Meet the Team Behind Orange Jelly',
    description:
      'Meet Peter Pitcher, hospitality consultant and founder, who runs The Anchor in Stanwell Moor. Hands-on, action-first marketing help for UK pubs.',
  },
  '/fix-my-pub': {
    title: 'Fix My Pub: Emergency Turnaround Help From a Licensee',
    description:
      'Pub in crisis or just struggling? I run one myself. Tell me what is wrong and I will show you the fastest fix. Packages from £375 + VAT.',
  },
  '/compete-with-pub-chains': {
    title: 'Compete With Pub Chains: a Challenger Strategy',
    description:
      'How independent pubs win against the chains: pick the ground you can own, price with intent, and build the things a chain cannot copy.',
  },
  '/pub-marketing-no-budget': {
    title: 'No-Budget Pub Marketing: Practical Free Strategies',
    description:
      'Pub marketing when there is no budget: the free levers that actually move trade, in the order to pull them. From a working licensee.',
  },
  '/services/social-media-marketing-for-pubs': {
    title: 'Social Media Marketing for Pubs: Instagram and Facebook',
    description:
      'Social media marketing for pubs across Instagram and Facebook: a repeatable plan, templates and an execution rhythm that drives bookings.',
  },
  '/services/content-creation-for-pubs': {
    title: 'Content Creation for Pubs: Phone-First, Done in Hours',
    description:
      'Photos, Reels, captions and a batching system so you create a week of pub content in one session. Phone-first, no editing skills needed.',
  },
  '/services/paid-social-for-pubs': {
    title: 'Paid Social for Pubs: Meta Ads That Fill Quiet Nights',
    description:
      'Facebook and Instagram ads that sell one specific night: your quiet Tuesday, Sunday lunch or event. Locally targeted, measured on real bookings.',
  },
  // The seven county overrides that sat here were removed when those pages were
  // consolidated into /pub-marketing. An override for a URL that 301s never renders.
  '/licensees-guide/pub-event-ideas': {
    title: 'Pub Event Ideas: A Year-Round Guide to Quiet Nights',
    description:
      'Pub event ideas for every month: quiz, bingo, music, sport and seasonal formats, with what each one costs to run and what it should return.',
  },
  '/licensees-guide/christmas-pub-event-ideas': {
    title: 'Christmas Pub Event Ideas: How to Fill December',
    description:
      'Christmas pub event ideas that fill December and carry into January: party nights, set menus, deposits and a promotion timeline that works.',
  },
  '/licensees-guide/summer-pub-marketing': {
    title: 'Summer Pub Marketing: Turn Footfall Into Revenue',
    description:
      'Summer pub marketing that converts good weather into takings: garden trade, event hooks, menu tweaks and the promotion that pulls people in.',
  },
  '/licensees-guide/autumn-pub-event-ideas': {
    title: 'Autumn Pub Event Ideas: A September to November Plan',
    description:
      'Autumn pub event ideas that fill tables: cask, low and no, wine, Halloween, rugby and gifting, with a month-by-month plan for running each one.',
  },
  '/licensees-guide/black-friday-pub-ideas': {
    title: 'Black Friday Pub Ideas That Build December Trade',
    description:
      'Black Friday ideas for pubs that build December: take party deposits and pre-orders, sell gift cards, and run a January bounce-back. No discount war.',
  },
  '/licensees-guide/sober-october-low-no-alcohol-pubs': {
    title: 'Sober October: Low and No Alcohol Drinks That Sell',
    description:
      'Build a low and no alcohol range that actually sells: non alcoholic beer worth stocking, a small alcohol free bar, and Sober October done properly.',
  },
};
