import { getAbsoluteUrl } from '@/lib/site-config';
import { PRIVACY_RIGHTS_EMAIL } from './privacyNotice';

/**
 * List-Unsubscribe headers for the two recurring messages — the digest (§4.2)
 * and the nudge (§4.5). The one-off emails (verify, links, confirmation) are
 * transactional and carry none.
 *
 * BOTH headers are required, not just the first. Gmail's bulk-sender rules want
 * the one-click POST form; the List-Unsubscribe header on its own is not
 * compliant, and non-compliance on a domain that also carries Peter's other mail
 * is not a risk worth taking.
 *
 * The mailto is the fallback for clients that do not do one-click. It points at
 * the one mailbox Orange Jelly actually runs.
 */
export function buildUnsubscribeHeaders(organiserToken: string): Record<string, string> {
  const unsubscribeUrl = getAbsoluteUrl(`/availability/o/${organiserToken}/unsubscribe`);

  return {
    'List-Unsubscribe': `<${unsubscribeUrl}>, <mailto:${PRIVACY_RIGHTS_EMAIL}?subject=unsubscribe>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  };
}
