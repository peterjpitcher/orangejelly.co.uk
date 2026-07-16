'use client';

import { useEffect, useRef, useState } from 'react';
import Text from '@/components/Text';
import { cn } from '@/lib/utils';

/**
 * The success state, and the ONLY delivery of the edit link.
 *
 * There is no edit-link email (Peter's decision, 16 July 2026). That email would
 * have gone to an address an anonymous caller typed into a public form, carrying
 * attacker-influenced text — the whole of this feature's relay surface — in
 * exchange for a capability the screen already gives. So the link is shown here
 * and nowhere else. Do not reinstate the email because "an on-screen link is easy
 * to lose": losing it costs one re-vote, which is a trade taken deliberately.
 */

export interface EditLinkPanelProps {
  /** Empty string means a honeypot hit: nothing was written, so show no link. */
  editUrl: string;
}

export default function EditLinkPanel({ editUrl }: EditLinkPanelProps): JSX.Element {
  const [copied, setCopied] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  async function copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(editUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 4000);
    } catch {
      // Clipboard access is refused in plenty of ordinary situations — an
      // insecure context, a locked-down browser, a webview. The link is on
      // screen as selectable text and as a working anchor either way, so this
      // failure costs nothing and must not raise an error at someone who has
      // just answered successfully.
      setCopied(false);
    }
  }

  return (
    <div
      className="rounded-lg border-2 border-orange bg-orange-light p-5"
      role="status"
      aria-live="polite"
    >
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-xl font-semibold text-charcoal focus-visible:outline-none"
      >
        That&rsquo;s your answer in — thank you
      </h2>

      {editUrl === '' ? (
        <Text className="mt-2" color="charcoal">
          Thanks for answering.
        </Text>
      ) : (
        <>
          <Text className="mt-2" color="charcoal">
            Keep this link if you need to change your answer. It&rsquo;s the only copy — if you lose
            it, just answer again and let the organiser know.
          </Text>

          <div className="mt-4 rounded-md border border-charcoal/20 bg-white p-3">
            <a
              className="block break-all text-sm font-medium text-charcoal underline hover:no-underline"
              href={editUrl}
            >
              {editUrl}
            </a>
          </div>

          <button
            type="button"
            onClick={copy}
            className={cn(
              'mt-3 inline-flex min-h-[44px] items-center justify-center rounded-md border-2 px-4 py-2',
              'text-sm font-semibold transition-colors',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
              'focus-visible:outline-charcoal',
              copied
                ? 'border-charcoal bg-surface-alt text-charcoal'
                : 'border-charcoal bg-white text-charcoal hover:bg-surface'
            )}
          >
            {copied ? '✓ Link copied' : 'Copy link'}
          </button>
        </>
      )}
    </div>
  );
}
