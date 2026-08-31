import { render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { PROOF } from '@/app/home-content';
import PubMarketingPage from '@/app/pub-marketing/page';
import { FAQS, LOOK_AT_FIRST } from '@/app/pub-marketing/content';
import WhyRevenueIsFallingPage from '@/app/why-revenue-is-falling/page';
import { CAUSES, FAQS as RESCUE_FAQS, WOULD_NOT_DO } from '@/app/why-revenue-is-falling/content';

const COPY = readFileSync(
  join(process.cwd(), 'tasks/repositioning/copy/sector-hospitality.md'),
  'utf8'
).replace(/\s+/g, ' ');

function textOf(page: React.ReactElement): string {
  render(page);
  return document.body.textContent ?? '';
}

describe('/pub-marketing', () => {
  it('keeps the sector language, because it is accurate here', () => {
    // The strongest term the keyword research found. It stays where it is true and
    // stays out of the company description, which is what the positioning gate
    // enforces everywhere else.
    render(<PubMarketingPage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'pub marketing that starts with the numbers.'
    );
  });

  it('says what the company is before it says what the sector is', () => {
    expect(textOf(<PubMarketingPage />)).toMatch(
      /strategic growth partner for ambitious small and mid-sized businesses, and hospitality is the sector we know best/
    );
  });

  it('opens on the diagnosis rather than the campaign', () => {
    expect(textOf(<PubMarketingPage />)).toMatch(/most pubs do not have a marketing problem/i);
  });

  it('answers the cost question without a price', () => {
    const answer = FAQS.find((faq) => faq.q === 'What does it cost?');
    expect(answer?.a).toMatch(/no price list/);
    expect(answer?.a).not.toMatch(/£/);
    expect(textOf(<PubMarketingPage />)).not.toMatch(/£/);
  });

  it('keeps the five questions the old page ranked for', () => {
    render(<PubMarketingPage />);
    expect(FAQS).toHaveLength(5);
    for (const faq of FAQS) expect(screen.getByText(faq.q)).toBeInTheDocument();
  });

  it('makes no promise about how quickly it works', () => {
    const answer = FAQS.find((faq) => faq.q.startsWith('How quickly'));
    // The old answer said early movement in days and bankable results in 30 days.
    // This one separates what genuinely moves quickly from what cannot.
    expect(answer?.a).toMatch(/Anyone promising both in a fortnight/);
    expect(textOf(<PubMarketingPage />)).not.toMatch(/30 days|within \d+ days/i);
  });

  it('shares the proof with the rest of the site rather than restating it', () => {
    render(<PubMarketingPage />);
    for (const proof of PROOF) expect(screen.getByText(proof.context)).toBeInTheDocument();
  });

  it('renders what it looks at first', () => {
    render(<PubMarketingPage />);
    for (const item of LOOK_AT_FIRST) expect(screen.getByText(item.title)).toBeInTheDocument();
  });
});

describe('/why-revenue-is-falling', () => {
  it('still turns away the business it cannot help, after the reframe', () => {
    /*
     * A business that genuinely cannot pay this month needs an accountant and an
     * insolvency practitioner. Saying so is true, it is the reason to trust the rest
     * of the page, and it keeps Orange Jelly out of engagements where the client has
     * lost the ability to act.
     *
     * The wording changed when the page moved from rescue to diagnosis, so this
     * asserts the substance rather than a sentence: the refusal, and the two places
     * it sends people instead. A positive reframe that quietly dropped this would be
     * the reframe going wrong, and the old assertion would not have noticed.
     */
    const text = textOf(<WhyRevenueIsFallingPage />);
    expect(text).toMatch(/genuinely cannot pay its bills this month/);
    expect(text).toMatch(/insolvency practitioner/);
    expect(text).toMatch(/Licensed Trade Charity/);
    // And it must not claim to be the emergency service it is sending people to.
    expect(text).not.toMatch(/emergency (service|help|support) (we|is) (offer|provide)/i);
  });

  it('leads with finding the cause rather than with the fall', () => {
    // Peter asked for "a more positive intent". The test of that is what the page
    // offers, not how gently it says it: the promise is a findable cause, and the
    // word rescue is gone from the page entirely.
    const text = textOf(<WhyRevenueIsFallingPage />);
    expect(text).toMatch(/find out why revenue is falling/);
    expect(text).toMatch(/The cause is findable/);
    expect(text).not.toMatch(/\brescue\b/i);
  });

  it('sends people who need other help to other help', () => {
    render(<WhyRevenueIsFallingPage />);
    const link = screen.getByRole('link', { name: /Licensed Trade Charity/ });
    expect(link).toHaveAttribute('href', 'https://www.licensedtradecharity.org.uk');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('names the six causes and what it would not do', () => {
    render(<WhyRevenueIsFallingPage />);
    expect(CAUSES).toHaveLength(6);
    for (const cause of CAUSES) expect(screen.getByText(cause.title)).toBeInTheDocument();
    for (const item of WOULD_NOT_DO) expect(screen.getByText(item)).toBeInTheDocument();
  });

  it('insists on a baseline before anything changes', () => {
    const text = textOf(<WhyRevenueIsFallingPage />);
    expect(text).toMatch(/The baseline first/);
    expect(text).toMatch(/Start before there is a baseline/);
  });

  it('quotes no price and promises no timescale', () => {
    const text = textOf(<WhyRevenueIsFallingPage />);
    expect(text).not.toMatch(/£/);
    expect(text).not.toMatch(/within \d+ (hours|days)|30-day|guarantee/i);
  });
});

describe('both sector pages', () => {
  it('send every action to the conversation', () => {
    for (const page of [<PubMarketingPage key="m" />, <WhyRevenueIsFallingPage key="r" />]) {
      const { unmount } = render(page);
      const ctas = screen.getAllByRole('link', { name: /Start the conversation/ });
      expect(ctas.length).toBeGreaterThanOrEqual(2);
      for (const cta of ctas) expect(cta).toHaveAttribute('href', '/start-here');
      unmount();
    }
  });

  it('no longer push people into WhatsApp as the first step', () => {
    // The old pages led with a WhatsApp link, which skips the enquiry entirely and
    // leaves no record of the lead.
    for (const page of [<PubMarketingPage key="m" />, <WhyRevenueIsFallingPage key="r" />]) {
      const { container, unmount } = render(page);
      expect(container.querySelector('a[href*="wa.me"]')).toBeNull();
      unmount();
    }
  });

  it('say the same words as the approved copy', () => {
    for (const item of [...LOOK_AT_FIRST, ...CAUSES]) {
      expect(COPY).toContain(item.body.replace(/\s+/g, ' '));
    }
    for (const faq of [...FAQS, ...RESCUE_FAQS]) {
      expect(COPY).toContain(faq.a.replace(/\s+/g, ' '));
    }
  });
});
