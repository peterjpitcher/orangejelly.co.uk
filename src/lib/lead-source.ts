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

export function getBrowserLeadSource(): LeadSourceInput {
  if (typeof window === 'undefined') {
    return {};
  }

  const url = new URL(window.location.href);
  const sourcePage = `${url.pathname}${url.search}`;

  let landingPage = sourcePage;
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
