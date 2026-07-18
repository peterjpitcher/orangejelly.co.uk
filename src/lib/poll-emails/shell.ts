import { escapeHtml } from '@/lib/email';

/**
 * The shared chrome every poll email sits inside, and the small helpers that
 * keep the HTML and plain-text parts honest.
 *
 * ON THE HEX LITERALS — a deliberate, narrow exception to the Definition of
 * Done's "no hardcoded hex" rule. Email clients cannot consume Tailwind; there
 * is no build step in an inbox. Every literal below is the canonical token value
 * from tailwind.config.js and no other value may appear here:
 *   #F65403  brand.DEFAULT
 *   #1A2F49  brand-base.DEFAULT / charcoal.DEFAULT
 *   #01619E  blue-support.DEFAULT / teal.DEFAULT
 *   #F2F8FC  surface.DEFAULT / cream.DEFAULT
 */

export const BRAND_ORANGE = '#F65403';
export const BRAND_CHARCOAL = '#1A2F49';
export const BRAND_BLUE = '#01619E';
export const BRAND_SURFACE = '#F2F8FC';

/** Charcoal at 72% — the muted body tone used throughout. */
export const MUTED = 'rgba(26,47,73,0.72)';
/** Charcoal at 18% — hairline rules and table borders. */
export const HAIRLINE = 'rgba(26,47,73,0.18)';

/**
 * Every built email. One shape, so the caller cannot forget the text part.
 */
export interface BuiltEmail {
  subject: string;
  html: string;
  text: string;
}

/**
 * Strip newlines from any value bound for a subject line.
 *
 * Header injection is the risk: a poll title containing a CR or LF would let an
 * attacker append their own headers. Mirrors contact.ts's subject handling.
 */
export function sanitiseSubjectValue(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

/**
 * Wrap a body fragment in the shared shell.
 *
 * 'Open Sans' matches the site's body face. It will not load in an inbox — the
 * Helvetica/Arial fallback is the point, and no webfont link may be added. The
 * 560px cap keeps a line readable on a phone without a media query, which many
 * clients ignore anyway.
 */
export function wrapHtml(body: string): string {
  return `<div style="font-family:'Open Sans',Helvetica,Arial,sans-serif;color:${BRAND_CHARCOAL};max-width:560px;margin:0 auto;padding:24px;background:${BRAND_SURFACE};">
${body}
  <p style="margin:24px 0 0;font-size:13px;color:${MUTED};">
    Orange Jelly &middot;
    <a href="https://www.orangejelly.co.uk" style="color:${BRAND_BLUE};">www.orangejelly.co.uk</a>
  </p>
</div>`;
}

/** The plain-text counterpart to wrapHtml's footer. */
export function wrapText(body: string): string {
  return `${body.trim()}\n\nOrange Jelly\nwww.orangejelly.co.uk\n`;
}

/**
 * A primary call-to-action button.
 *
 * min-height and line-height together clear the 44px touch target the
 * accessibility baseline requires; a bare padded anchor does not on every client.
 */
export function primaryButton(url: string, label: string): string {
  return `<p style="margin:0 0 24px;">
    <a href="${escapeHtml(url)}"
       style="display:inline-block;background:${BRAND_ORANGE};color:#ffffff;text-decoration:none;
              padding:14px 28px;border-radius:6px;font-weight:700;min-height:44px;line-height:20px;">
      ${label}
    </a>
  </p>`;
}

/**
 * The full URL, written out.
 *
 * Every template that carries a button also carries the bare URL. Buttons fail —
 * a client strips the styles, or the reader is on a plain-text-only device — and
 * a capability URL the reader can see and paste is the fallback. It is also why
 * no link in this feature is ever shortened: a shortener hides the URL from the
 * person about to click it, and reads as spam to a filter besides.
 */
export function fallbackLink(url: string, lead: string): string {
  return `<p style="margin:0 0 16px;font-size:14px;">
    ${lead}<br>
    <a href="${escapeHtml(url)}" style="color:${BRAND_BLUE};word-break:break-all;">${escapeHtml(url)}</a>
  </p>`;
}
