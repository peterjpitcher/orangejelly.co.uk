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
      'macmillan-coffee-morning-pub-guide',
      'national-drinks-days-pub-guide',
      'autumn-rugby-nations-championship-pubs',
      'black-friday-pub-ideas',
    ],
  },
];

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
