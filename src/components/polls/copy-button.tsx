'use client';

import { useRef, useState } from 'react';
import Button from '@/components/Button';

/**
 * A copy-to-clipboard button that a screen reader hears succeed.
 *
 * The share surfaces kept `select-all` boxes as well, deliberately: a copy
 * button needs JavaScript and a clipboard permission, and when either is
 * missing the person still needs a way to take the text. The button is the
 * fast path, not the only path.
 *
 * The fallback matters on exactly the device this tool is built for: the
 * Clipboard API needs a secure context, and a licensee on an older Android
 * WebView or an http:// dev preview does not have one. execCommand('copy') is
 * deprecated but it is the only fallback there is, and a deprecated copy beats
 * a silent failure.
 */
export interface CopyButtonProps {
  /** What lands on the clipboard. */
  text: string;
  label: string;
  /** Spoken and shown once it has worked. */
  copiedLabel?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export default function CopyButton({
  text,
  label,
  copiedLabel = 'Copied',
  variant = 'outline',
}: CopyButtonProps): JSX.Element {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const resetTimer = useRef<number | undefined>(undefined);

  async function copy(): Promise<void> {
    let ok = false;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        ok = true;
      }
    } catch {
      // Permission refused or API absent. The textarea fallback below has its
      // own verdict, so nothing to do here.
    }

    if (!ok) {
      const holder = document.createElement('textarea');
      holder.value = text;
      // Off-screen, not display:none: a hidden element cannot be selected, and
      // an unselectable element cannot be copied.
      holder.style.position = 'fixed';
      holder.style.left = '-9999px';
      holder.setAttribute('readonly', '');
      document.body.appendChild(holder);
      holder.select();
      try {
        ok = document.execCommand('copy');
      } catch {
        ok = false;
      }
      holder.remove();
    }

    setState(ok ? 'copied' : 'failed');
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setState('idle'), 2500);
  }

  return (
    <span className="inline-flex items-center gap-2">
      <Button type="button" variant={variant} size="small" onClick={copy}>
        {state === 'copied' ? `✓ ${copiedLabel}` : label}
      </Button>
      {/* The announcement. Visually the button label already changed; this is
          the same news for someone who cannot see it change. */}
      <span aria-live="polite" className="sr-only">
        {state === 'copied' ? copiedLabel : state === 'failed' ? 'Copy failed' : ''}
      </span>
      {state === 'failed' && (
        <span className="text-sm text-destructive">
          Copying is blocked here. Select the text and copy it yourself.
        </span>
      )}
    </span>
  );
}
