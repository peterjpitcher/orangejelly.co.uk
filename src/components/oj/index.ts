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
