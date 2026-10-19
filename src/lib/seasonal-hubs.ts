export type SeasonTheme = 'spring' | 'summer' | 'autumn' | 'winter';

export interface SeasonalCalendarEntry {
  date: string; // e.g. "Fri 23–Sat 24 Oct"
  moment: string; // e.g. "Champagne Weekend"
  opportunity: string; // e.g. "Fizz by the glass, a sparkling tasting"
  /**
   * Optional path to the in-depth guide for this moment. When present, the
   * SeasonalCalendar renders the card as a link through to the full how-to.
   * Omit for moments that don't (yet) have a dedicated guide.
   */
  href?: string;
}

export interface SeasonalHub {
  season: SeasonTheme;
  /** Token-set key driving the themed UX. Selected via a static data-season attribute. */
  theme: SeasonTheme;
  hubSlug: string;
  label: string; // e.g. "Autumn Pub Playbook"
  shortLabel: string; // e.g. "Autumn Playbook"
  dateRangeLabel: string; // e.g. "September–November"
  /** Dated moments rendered by the SeasonalCalendar component. */
  calendar: SeasonalCalendarEntry[];
  featuredGuides: string[]; // ordered spoke slugs
}

export const SEASON_HUBS: SeasonalHub[] = [
  {
    season: 'summer',
    theme: 'summer',
    hubSlug: 'summer-pub-marketing',
    label: 'Summer Pub Playbook',
    shortLabel: 'Summer Playbook',
    dateRangeLabel: 'June–August',
    // No dated calendar by design: this playbook is five evergreen summer
    // marketing moves (not a run of dated events), so SeasonalCalendar is
    // intentionally empty and renders nothing. The spokes are the five moves.
    calendar: [],
    featuredGuides: [
      'summer-pub-event-ideas',
      'social-media-strategy-for-pubs',
      'google-business-profile-pub-guide',
      'email-marketing-pub-retention',
      'build-loyalty-scheme-fill-pub',
    ],
  },
  {
    season: 'autumn',
    theme: 'autumn',
    hubSlug: 'autumn-pub-event-ideas',
    label: 'Autumn Pub Playbook',
    shortLabel: 'Autumn Playbook',
    dateRangeLabel: 'September–November',
    calendar: [
      {
        date: '17–27 Sep',
        moment: 'Cask Ale Week',
        opportunity: 'Beer of the day, cask passport, meet-the-brewer',
        href: '/guides/cask-ale-week-pub-guide',
      },
      {
        date: '19 Sep–4 Oct',
        moment: 'Oktoberfest',
        opportunity: 'Steins, pretzels and an Oompah night of your own',
        href: '/guides/oktoberfest-pub-guide',
      },
      {
        date: 'Fri 25 Sep',
        moment: 'Macmillan Coffee Morning',
        opportunity: 'A quiet daytime filled, and a good cause',
        href: '/guides/macmillan-coffee-morning-pub-guide',
      },
      {
        date: 'All October',
        moment: 'Sober October',
        opportunity: 'A proper low/no range that earns its place',
        href: '/guides/sober-october-low-no-alcohol-pubs',
      },
      {
        date: 'Sun 4 Oct',
        moment: 'National Vodka Day',
        opportunity: 'A cocktail special, a Bloody Mary brunch',
        href: '/guides/national-drinks-days-pub-guide',
      },
      {
        date: 'Mon 19 Oct',
        moment: 'Gin & Tonic Day',
        opportunity: 'A G&T board, a local gin spotlight',
        href: '/guides/national-drinks-days-pub-guide',
      },
      {
        date: 'Fri 23–Sat 24 Oct',
        moment: 'Champagne Weekend',
        opportunity: 'Fizz by the glass, a sparkling tasting',
        href: '/guides/national-drinks-days-pub-guide',
      },
      {
        date: 'Sat 31 Oct',
        moment: 'Halloween',
        opportunity: 'Family by day, fancy dress by night',
        href: '/guides/pub-halloween-bonfire-night-events',
      },
      {
        date: 'Thu 5 Nov',
        moment: 'Bonfire Night',
        opportunity: 'Hot drinks, comfort food, the warm-up',
        href: '/guides/pub-halloween-bonfire-night-events',
      },
      {
        date: '6–21 Nov',
        moment: 'Autumn rugby',
        opportunity: 'Big-screen bookings, match platters',
        href: '/guides/autumn-rugby-nations-championship-pubs',
      },
      {
        date: 'Fri 27–Sun 29 Nov',
        moment: 'Rugby finals weekend (Twickenham)',
        opportunity: 'A full weekend of bookable rugby',
        href: '/guides/autumn-rugby-nations-championship-pubs',
      },
      {
        date: 'Fri 27 Nov',
        moment: 'Black Friday',
        opportunity: 'Gift cards, deposits, bounce-back vouchers',
        href: '/guides/black-friday-pub-ideas',
      },
      {
        date: 'Mon 30 Nov',
        moment: "St Andrew's Day + Cyber Monday",
        opportunity: 'A Scottish special + an online voucher push',
      },
    ],
    featuredGuides: [
      'wine-tasting-evenings-for-pubs',
      'sober-october-low-no-alcohol-pubs',
      'cask-ale-week-pub-guide',
      'oktoberfest-pub-guide',
      'macmillan-coffee-morning-pub-guide',
      'national-drinks-days-pub-guide',
      'pub-halloween-bonfire-night-events',
      'autumn-rugby-nations-championship-pubs',
      'black-friday-pub-ideas',
    ],
  },
  {
    season: 'winter',
    theme: 'winter',
    hubSlug: 'christmas-pub-event-ideas',
    label: 'Christmas Pub Playbook',
    shortLabel: 'Christmas Playbook',
    dateRangeLabel: 'November to January',
    calendar: [
      {
        date: 'Fri 27 Nov',
        moment: 'Black Friday',
        opportunity: 'Gift cards, party deposits, a December bounce-back voucher',
        href: '/guides/black-friday-pub-ideas',
      },
      {
        date: 'Mon 30 Nov',
        moment: "Cyber Monday + St Andrew's Day",
        opportunity: 'An online voucher push and a Scottish supper special',
      },
      {
        date: 'All December',
        moment: 'Christmas party season',
        opportunity: 'Set menus, pre-orders, deposits: the diary fills early',
        href: '/guides/pub-christmas-bookings-fill-december',
      },
      {
        date: 'Fri 25 Dec',
        moment: 'Christmas Day',
        opportunity: 'A booked-only lunch, or a well-earned rest with deposits banked',
        href: '/guides/christmas-pub-promotion-ideas',
      },
      {
        date: 'Sat 26 Dec',
        moment: 'Boxing Day',
        opportunity: 'Walkers, leftovers buffet, sport on the big screen',
      },
      {
        date: 'Thu 31 Dec',
        moment: "New Year's Eve",
        opportunity: 'A ticketed night with a deposit, not a quiet free-for-all',
        href: '/guides/pub-new-years-eve-planning-guide',
      },
      {
        date: 'Fri 1 Jan',
        moment: "New Year's Day",
        opportunity: 'A recovery brunch and a warming roast for the walkers',
      },
      {
        date: 'All January',
        moment: 'Dry January / low and no',
        opportunity: 'A proper low-and-no range that keeps January tables full',
        href: '/guides/sober-october-low-no-alcohol-pubs',
      },
      {
        date: 'Mon 25 Jan',
        moment: 'Burns Night',
        opportunity: 'A haggis supper, a whisky flight, a reason to book midweek',
        href: '/guides/burns-night-pub-ideas',
      },
    ],
    featuredGuides: [
      'christmas-pub-promotion-ideas',
      'pub-christmas-bookings-fill-december',
      'black-friday-pub-ideas',
      'wine-tasting-evenings-for-pubs',
      'pub-new-years-eve-planning-guide',
      'turn-heating-costs-into-winter-wins',
    ],
  },
  {
    season: 'spring',
    theme: 'spring',
    hubSlug: 'spring-pub-event-ideas',
    label: 'Spring Pub Playbook',
    shortLabel: 'Spring Playbook',
    // The Greene King spring toolkit's season, which starts in January rather than
    // in March, so it overlaps the end of the Christmas playbook on purpose.
    dateRangeLabel: 'January to April',
    calendar: [
      {
        date: 'All January',
        moment: 'Dry January',
        opportunity: 'A proper alcohol-free range that keeps January tables full',
        href: '/guides/sober-october-low-no-alcohol-pubs',
      },
      {
        date: 'Mon 25 Jan',
        moment: 'Burns Night',
        opportunity: 'One sitting, one price, a haggis supper pre-ordered',
        href: '/guides/burns-night-pub-ideas',
      },
      {
        date: '5 Feb–13 Mar',
        moment: "Men's Six Nations",
        opportunity: 'Five rounds, all free to air, bookings for the big matches',
        href: '/guides/pub-six-nations-rugby-marketing',
      },
      {
        date: 'Tue 9 Feb',
        moment: 'Pancake Day',
        opportunity: 'Something new on the pudding board for a quiet Tuesday',
      },
      {
        date: 'Sun 14 Feb',
        moment: "Valentine's Day",
        opportunity: 'A weekend of set menus, two sittings and deposits',
        href: '/guides/valentines-day-pub-ideas',
      },
      {
        date: 'Mon 22 Feb',
        moment: 'National Margarita Day',
        opportunity: 'A cocktail on the board for a quiet Monday',
        href: '/guides/national-drinks-days-pub-guide',
      },
      {
        date: 'Mon 1 Mar',
        moment: "St David's Day",
        opportunity: 'A Welsh special, and a reason for Welsh pubs to celebrate',
      },
      {
        date: 'Sun 7 Mar',
        moment: "Mother's Day",
        opportunity: 'Fixed sittings, deposits and a set menu built round the roast',
        href: '/guides/mothers-day-pub-ideas',
      },
      {
        date: 'Wed 17 Mar',
        moment: "St Patrick's Day",
        opportunity: 'One headline: live music, a quiz or an Irish night',
        href: '/guides/st-patricks-day-pub-ideas',
      },
      {
        date: 'Fri 26–Mon 29 Mar',
        moment: 'Easter weekend',
        opportunity: 'Four days of trade, with a plan for each one',
        href: '/guides/easter-pub-ideas',
      },
      {
        date: 'Sat 27 Mar',
        moment: 'International Whisk(e)y Day',
        opportunity: 'A whisky flight on Easter Saturday',
        href: '/guides/national-drinks-days-pub-guide',
      },
      {
        date: 'Sun 28 Mar',
        moment: 'The clocks go forward',
        opportunity: 'Lighter evenings, and the start of beer garden season',
      },
      {
        date: '10 Apr–15 May',
        moment: "Women's Six Nations",
        opportunity: 'Three matches every Saturday afternoon, all on the BBC',
        href: '/guides/pub-six-nations-rugby-marketing',
      },
      {
        date: 'Fri 23 Apr',
        moment: "St George's Day",
        opportunity: 'An English menu and a Friday night with a reason',
      },
    ],
    // Ordered by the season, after the planning guide that leads the playbook. The
    // drinks days and low-and-no guides are autumn spokes too; getHubForSpoke keeps
    // their breadcrumb under autumn because that hub comes first.
    featuredGuides: [
      'plan-your-pub-spring-with-ai',
      'sober-october-low-no-alcohol-pubs',
      'burns-night-pub-ideas',
      'pub-six-nations-rugby-marketing',
      'valentines-day-pub-ideas',
      'mothers-day-pub-ideas',
      'st-patricks-day-pub-ideas',
      'easter-pub-ideas',
      'national-drinks-days-pub-guide',
    ],
  },
];

/**
 * Calendar months (1–12) that belong to each season, Northern-hemisphere /
 * UK convention. Used to decide which hub is "on now".
 */
const SEASON_MONTHS: Record<SeasonTheme, number[]> = {
  spring: [3, 4, 5],
  summer: [6, 7, 8],
  autumn: [9, 10, 11],
  winter: [12, 1, 2],
};

/**
 * Is the given hub in its season for the supplied date?
 * Defaults to "now". Drives the "on now" badge on playbook cards.
 */
export function isHubInSeason(hub: SeasonalHub, date: Date = new Date()): boolean {
  const month = date.getMonth() + 1; // getMonth() is 0-indexed
  return SEASON_MONTHS[hub.season].includes(month);
}

export function getHubBySlug(slug: string): SeasonalHub | undefined {
  return SEASON_HUBS.find((hub) => hub.hubSlug === slug);
}

export function isHubSlug(slug: string): boolean {
  return SEASON_HUBS.some((hub) => hub.hubSlug === slug);
}

/**
 * Find the hub that features a given spoke slug among its `featuredGuides`.
 * Returns the first matching hub in SEASON_HUBS order. A few spokes, such as the
 * drinks days guide, sit in two playbooks; their breadcrumb follows the first.
 * Used to add a hub-level breadcrumb to spoke posts.
 */
export function getHubForSpoke(slug: string): SeasonalHub | undefined {
  return SEASON_HUBS.find((hub) => hub.featuredGuides.includes(slug));
}
