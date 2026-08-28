/**
 * The repositioning component library.
 *
 * Deliberately a separate namespace from src/components. The existing components
 * serve around 200 call sites on pages that have not been rebuilt, and replacing
 * them in place would restyle the live site months before the launch release.
 * These sit alongside; the old ones come out when nothing imports them.
 *
 * Ported from docs/brand/design-system/components/. Each port keeps the prop
 * contract from the matching .d.ts.txt and the behaviour from the .prompt.md, but
 * is expressed in this repo's CVA and Tailwind idiom rather than copied.
 */
export { Button, type ButtonProps } from './Button';
export { Stat, type StatProps } from './Stat';
export { Tag, type TagProps } from './Tag';
export { Mark, type MarkProps } from './Mark';
export { Header, type HeaderProps, type HeaderItem, type HeaderSubItem } from './Header';
export { Footer, type FooterProps, type FooterColumn } from './Footer';
export { Breadcrumb, type BreadcrumbProps } from './Breadcrumb';
export { Field, useFieldControl, type FieldProps } from './Field';
export {
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  type InputProps,
  type TextareaProps,
  type SelectProps,
  type CheckboxProps,
  type RadioProps,
} from './inputs';
export {
  Card,
  PressureCard,
  ProofCard,
  MethodStep,
  Quote,
  type CardProps,
  type PressureCardProps,
  type ProofCardProps,
  type MethodStepProps,
  type QuoteProps,
} from './content';
export {
  Alert,
  Modal,
  EmptyState,
  Skeleton,
  type AlertProps,
  type ModalProps,
  type EmptyStateProps,
  type SkeletonProps,
} from './feedback';
export {
  FAQ,
  Toc,
  CategoryTag,
  ArticleCard,
  Pagination,
  Tabs,
  NextStep,
  type FAQProps,
  type TocProps,
  type CategoryId,
  type CategoryTagProps,
  type ArticleCardProps,
  type PaginationProps,
  type TabsProps,
  type NextStepProps,
  type NextStepLink,
} from './editorial';
export {
  OfferCard,
  CompareTable,
  LogoStrip,
  NewsletterBand,
  SeasonalBand,
  type OfferCardProps,
  type CompareTableProps,
  type LogoStripProps,
  type NewsletterBandProps,
  type SeasonalBandProps,
  type SeasonalItem,
} from './marketing';
export {
  PressureMap,
  PressureCheck,
  Scorecard,
  PRESSURE_AREAS,
  PRESSURE_SYMPTOMS,
  SCORECARD_QUESTIONS,
  type PressureArea,
  type PressureMapProps,
  type PressureSymptom,
  type PressureCheckProps,
  type ScorecardQuestion,
  type ScorecardProps,
} from './diagnostic';
export {
  StickyCTA,
  CookieNotice,
  ShareRow,
  type StickyCTAProps,
  type CookieNoticeProps,
  type ShareRowProps,
} from './conversion';
export { SiteSearch, type SiteSearchProps, type SiteSearchResult } from './SiteSearch';
export { EnquiryForm, type EnquiryFormProps, type EnquiryEntryPoint } from './EnquiryForm';
export { OjHeader, OjFooter, type OjHeaderProps, type OjNavKey } from './SiteChrome';
export { Band, type BandProps } from './Band';
export { Anchor, type AnchorProps } from './Anchor';
export { KeepCase, type KeepCaseProps } from './KeepCase';
