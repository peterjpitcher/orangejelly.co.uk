export interface LeadSourceInput {
  sourcePage?: string;
  landingPage?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

const FIRST_LANDING_PAGE_KEY = 'oj_first_landing_page';

function blankToUndefined(value: string | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export interface LeadSourceOptions {
  /**
   * Whether the first landing page of the session may be remembered.
   *
   * This is sessionStorage, which PECR regulation 6 treats as device storage
   * regardless of whether the value is personal data. Remembering where someone
   * arrived is attribution for Orange Jelly, not something the visitor asked for,
   * so it is not covered by the strictly-necessary exemption and defaults to off.
   *
   * Callers pass `true` only once analytics consent has been given. Without it the
   * landing page simply equals the current page, which is accurate for the majority
   * of enquiries anyway: most arrive on the page they convert from.
   *
   * @see tasks/repositioning/SUB-SPECS.md part 3.3 and decision D24
   */
  persist?: boolean;
}

export function getBrowserLeadSource(options: LeadSourceOptions = {}): LeadSourceInput {
  if (typeof window === 'undefined') {
    return {};
  }

  const url = new URL(window.location.href);
  const sourcePage = `${url.pathname}${url.search}`;

  let landingPage = sourcePage;
  if (options.persist) {
    try {
      const storedLandingPage = window.sessionStorage.getItem(FIRST_LANDING_PAGE_KEY);
      if (storedLandingPage) {
        landingPage = storedLandingPage;
      } else {
        window.sessionStorage.setItem(FIRST_LANDING_PAGE_KEY, sourcePage);
      }
    } catch {
      landingPage = sourcePage;
    }
  }

  return {
    sourcePage,
    landingPage,
    referrer: blankToUndefined(document.referrer),
    utmSource: blankToUndefined(url.searchParams.get('utm_source')),
    utmMedium: blankToUndefined(url.searchParams.get('utm_medium')),
    utmCampaign: blankToUndefined(url.searchParams.get('utm_campaign')),
    utmTerm: blankToUndefined(url.searchParams.get('utm_term')),
    utmContent: blankToUndefined(url.searchParams.get('utm_content')),
  };
}
