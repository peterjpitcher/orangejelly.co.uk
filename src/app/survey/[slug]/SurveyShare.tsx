'use client';

import * as React from 'react';

import { Button } from '@/components/oj';
import { trackClientEvent } from '@/lib/tracking';

/**
 * Share buttons for the end of a survey.
 *
 * Plain share URLs, no third-party scripts: the Facebook and LinkedIn SDKs would
 * set cookies on a page that has asked for no consent. Each link carries its own
 * UTM source, so the admin view can say which channel brought the answers.
 */

type Channel = 'native' | 'whatsapp' | 'facebook' | 'linkedin' | 'copy';

interface SurveyShareProps {
  slug: string;
  shareText: string;
  /** The survey's public URL, without query. */
  shareUrl: string;
}

export function shareLink(shareUrl: string, slug: string, channel: Channel): string {
  const url = new URL(shareUrl);
  url.searchParams.set(
    'utm_source',
    channel === 'native' || channel === 'copy' ? 'share' : channel
  );
  url.searchParams.set('utm_medium', 'social');
  url.searchParams.set('utm_campaign', `survey_${slug}`);
  return url.toString();
}

export default function SurveyShare({ slug, shareText, shareUrl }: SurveyShareProps): JSX.Element {
  const [canShare, setCanShare] = React.useState(false);
  const [copied, setCopied] = React.useState<'idle' | 'copied' | 'failed'>('idle');

  // navigator.share exists on phones and some desktops. Decided after mount so the
  // server render and the first client render agree.
  React.useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  function tracked(channel: Channel): void {
    trackClientEvent('survey_shared', {
      properties: { survey: slug, channel },
      dedupeKey: `survey_shared:${slug}:${channel}`,
    });
  }

  async function nativeShare(): Promise<void> {
    tracked('native');
    try {
      await navigator.share({
        title: shareText,
        text: shareText,
        url: shareLink(shareUrl, slug, 'native'),
      });
    } catch {
      // Dismissing the share sheet rejects the promise. That is not an error.
    }
  }

  async function copy(): Promise<void> {
    tracked('copy');
    try {
      await navigator.clipboard.writeText(shareLink(shareUrl, slug, 'copy'));
      setCopied('copied');
    } catch {
      setCopied('failed');
    }
  }

  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareLink(shareUrl, slug, 'whatsapp')}`)}`;
  const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink(shareUrl, slug, 'facebook'))}`;
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareLink(shareUrl, slug, 'linkedin'))}`;

  return (
    <section
      className="mt-12 border-t-1.5 border-oj-ink pt-8"
      aria-labelledby="survey-share-heading"
    >
      <h3 id="survey-share-heading" className="font-oj text-[22px] font-black text-oj-ink">
        Know someone who should answer this?
      </h3>
      <div className="mt-5 flex flex-wrap gap-3">
        {canShare ? (
          <Button onClick={() => void nativeShare()} arrow>
            Share
          </Button>
        ) : null}
        <Button
          variant="solid"
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => tracked('whatsapp')}
        >
          WhatsApp
        </Button>
        <Button
          variant="ghost"
          href={facebook}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => tracked('facebook')}
        >
          Facebook
        </Button>
        <Button
          variant="ghost"
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => tracked('linkedin')}
        >
          LinkedIn
        </Button>
        <Button variant="ghost" onClick={() => void copy()}>
          Copy link
        </Button>
      </div>
      <p className="mt-3 min-h-6 text-[14.5px] text-oj-ink-2" aria-live="polite">
        {copied === 'copied' ? 'Link copied.' : null}
        {copied === 'failed' ? `Copy this link: ${shareUrl}` : null}
      </p>
    </section>
  );
}
