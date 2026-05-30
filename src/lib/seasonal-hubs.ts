export interface SeasonalHub {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  hubSlug: string;
  label: string; // e.g. "Autumn Pub Playbook"
  shortLabel: string; // e.g. "Autumn Playbook"
  featuredGuides: string[]; // ordered spoke slugs
}

export const SEASON_HUBS: SeasonalHub[] = [
  {
    season: 'autumn',
    hubSlug: 'autumn-pub-event-ideas',
    label: 'Autumn Pub Playbook',
    shortLabel: 'Autumn Playbook',
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
