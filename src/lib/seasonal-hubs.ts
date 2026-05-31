export type SeasonTheme = 'spring' | 'summer' | 'autumn' | 'winter';

export interface SeasonalCalendarEntry {
  date: string; // e.g. "Fri 23–Sat 24 Oct"
  moment: string; // e.g. "Champagne Weekend"
  opportunity: string; // e.g. "Fizz by the glass, a sparkling tasting"
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
      },
      {
        date: '19 Sep–4 Oct',
        moment: 'Oktoberfest',
        opportunity: 'Steins, pretzels and an Oompah night of your own',
      },
      {
        date: 'Fri 25 Sep',
        moment: 'Macmillan Coffee Morning',
        opportunity: 'A quiet daytime filled, and a good cause',
      },
      {
        date: 'All October',
        moment: 'Sober October',
        opportunity: 'A proper low/no range that earns its place',
      },
      {
        date: 'Sun 4 Oct',
        moment: 'National Vodka Day',
        opportunity: 'A cocktail special, a Bloody Mary brunch',
      },
      {
        date: 'Mon 19 Oct',
        moment: 'Gin & Tonic Day',
        opportunity: 'A G&T board, a local gin spotlight',
      },
      {
        date: 'Fri 23–Sat 24 Oct',
        moment: 'Champagne Weekend',
        opportunity: 'Fizz by the glass, a sparkling tasting',
      },
      {
        date: 'Sat 31 Oct',
        moment: 'Halloween',
        opportunity: 'Family by day, fancy dress by night',
      },
      {
        date: 'Thu 5 Nov',
        moment: 'Bonfire Night',
        opportunity: 'Hot drinks, comfort food, the warm-up',
      },
      {
        date: '6–21 Nov',
        moment: 'Autumn rugby',
        opportunity: 'Big-screen bookings, match platters',
      },
      {
        date: 'Fri 27–Sun 29 Nov',
        moment: 'Rugby finals weekend (Twickenham)',
        opportunity: 'A full weekend of bookable rugby',
      },
      {
        date: 'Fri 27 Nov',
        moment: 'Black Friday',
        opportunity: 'Gift cards, deposits, bounce-back vouchers',
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
      },
      {
        date: 'Mon 30 Nov',
        moment: "Cyber Monday + St Andrew's Day",
        opportunity: 'An online voucher push and a Scottish supper special',
      },
      {
        date: 'All December',
        moment: 'Christmas party season',
        opportunity: 'Set menus, pre-orders, deposits — the diary fills early',
      },
      {
        date: 'Fri 25 Dec',
        moment: 'Christmas Day',
        opportunity: 'A booked-only lunch, or a well-earned rest with deposits banked',
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
      },
      {
        date: 'Mon 25 Jan',
        moment: 'Burns Night',
        opportunity: 'A haggis supper, a whisky flight, a reason to book midweek',
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
 * Returns the first matching hub (a spoke belongs to at most one hub today).
 * Used to add a hub-level breadcrumb to spoke posts.
 */
export function getHubForSpoke(slug: string): SeasonalHub | undefined {
  return SEASON_HUBS.find((hub) => hub.featuredGuides.includes(slug));
}
