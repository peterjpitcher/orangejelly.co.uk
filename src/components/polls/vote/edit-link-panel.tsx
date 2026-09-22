'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/oj';

/**
 * The success state, and the ONLY delivery of the edit link.
 *
 * There is no edit-link email (Peter's decision, 16 July 2026). That email would
 * have gone to an address an anonymous caller typed into a public form, carrying
 * attacker-influenced text (the whole of this feature's relay surface) in
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
      // Clipboard access is refused in plenty of ordinary situations: an
      // insecure context, a locked-down browser, a webview. The link is on
      // screen as selectable text and as a working anchor either way, so this
      // failure costs nothing and must not raise an error at someone who has
      // just answered successfully.
      setCopied(false);
    }
  }

  return (
    <div
      // Peach with the block's ink border and hard shadow: the success block, the
      // same one the edit screen shows after an update.
      className="rounded-oj border-1.5 border-oj-ink bg-oj-peach p-5 shadow-press-sm"
      role="status"
      aria-live="polite"
    >
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="font-oj text-xl font-black tracking-[-0.02em] text-oj-ink focus-visible:outline-none"
      >
        That&rsquo;s your answer in, thank you
      </h2>

      {editUrl === '' ? (
        <p className="mt-2 text-oj-ink">Thanks for answering.</p>
      ) : (
        <>
          <p className="mt-2 text-oj-ink">
            Keep this link if you need to change your answer. It&rsquo;s the only copy: if you lose
            it, just answer again and let the organiser know.
          </p>

          <div className="mt-4 rounded-oj border-1.5 border-oj-ink/20 bg-oj-paper p-3">
            <a
              className="block break-all text-sm font-semibold text-oj-ink underline hover:no-underline"
              href={editUrl}
            >
              {editUrl}
            </a>
          </div>

          {/* The design system's ghost button, which brings the ink outline and
              focus ring the hand-built one here spelt out in the old palette. */}
          <Button variant="ghost" size="md" type="button" onClick={copy} className="mt-3">
            {copied ? '✓ Link copied' : 'Copy link'}
          </Button>
        </>
      )}
    </div>
  );
}
