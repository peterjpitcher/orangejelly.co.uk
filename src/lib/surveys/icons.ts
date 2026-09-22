import {
  Award,
  Banknote,
  Beer,
  BedDouble,
  Building2,
  CalendarCheck,
  CalendarDays,
  Car,
  ClipboardCheck,
  Coins,
  Gift,
  GraduationCap,
  IdCard,
  Megaphone,
  MessageSquare,
  Music,
  Package,
  PartyPopper,
  Receipt,
  Smartphone,
  Star,
  Store,
  Ticket,
  TrendingUp,
  UserPlus,
  Users,
  Utensils,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

/**
 * The icons a survey option may name, and nothing else.
 *
 * Survey rows come from the database, so an icon is a name, not a component. A
 * closed list keeps the bundle to the icons actually used (lucide tree-shakes
 * named imports, not lookups by string) and means a typo renders no icon
 * instead of failing. `scripts/survey-to-sql.ts` refuses names not listed here.
 */
export const SURVEY_ICONS: Readonly<Record<string, LucideIcon>> = {
  award: Award,
  banknote: Banknote,
  beer: Beer,
  'bed-double': BedDouble,
  'building-2': Building2,
  'calendar-check': CalendarCheck,
  'calendar-days': CalendarDays,
  car: Car,
  'clipboard-check': ClipboardCheck,
  coins: Coins,
  gift: Gift,
  'graduation-cap': GraduationCap,
  'id-card': IdCard,
  megaphone: Megaphone,
  'message-square': MessageSquare,
  music: Music,
  package: Package,
  'party-popper': PartyPopper,
  receipt: Receipt,
  smartphone: Smartphone,
  star: Star,
  store: Store,
  ticket: Ticket,
  'trending-up': TrendingUp,
  'user-plus': UserPlus,
  users: Users,
  utensils: Utensils,
  wrench: Wrench,
};

/** True only for names in the list, never for inherited names such as "constructor". */
export function isSurveyIcon(name: string): boolean {
  return Object.prototype.hasOwnProperty.call(SURVEY_ICONS, name);
}

export function surveyIcon(name: string | null): LucideIcon | null {
  return name && isSurveyIcon(name) ? SURVEY_ICONS[name] : null;
}
