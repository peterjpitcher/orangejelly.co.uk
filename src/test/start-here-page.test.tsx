import { render, screen, within } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';

import StartHerePage from '@/app/start-here/page';
import type * as ReactDom from 'react-dom';
import { FAQS, FIT, NEEDS, STEPS, TAKEAWAYS } from '@/app/start-here/content';
import { isOjRoute } from '@/lib/oj-routes';

vi.mock('@/lib/tracking', () => ({
  trackClientEvent: vi.fn(),
  hasAnalyticsConsent: () => false,
}));

vi.mock('react-dom', async () => {
  const actual = await vi.importActual<typeof ReactDom>('react-dom');
  return {
    ...actual,
    useFormStatus: () => ({ pending: false }),
    useFormState: () => [{ step: 1 }, vi.fn()],
  };
});

function body(): string {
  render(<StartHerePage />);
  return document.body.textContent ?? '';
}

describe('/start-here', () => {
  it('opens on the conversation, not on a service', () => {
    render(<StartHerePage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      "tell us what's happening. we'll tell you where to look first."
    );
    expect(screen.getByText('the first conversation')).toBeInTheDocument();
  });

  it('carries the fit language, which is what replaced the price', () => {
    // D3 took pricing off the site, and the price was the filter. Being specific
    // about who this is not for is the only honest filter left, so it is not
    // decoration and it does not get softened.
    const text = body();
    for (const item of FIT.doesNot) {
      expect(text).toContain(item.title);
    }
    expect(text).toContain('It makes us the wrong supplier');
  });

  it('names the poor-fit behaviours, not a hedged summary', () => {
    // Six became four on 2 September 2026. The page was spending more words on
    // who it turns away than on what it offers; the four that stay are the ones
    // that actually decide whether a piece of work can happen.
    expect(FIT.doesNot).toHaveLength(4);
    const text = body();
    expect(text).toMatch(/post three times a week/);
    expect(text).toMatch(/pair of hands/);
    expect(text).toMatch(/Nothing inside the business can actually change/);
  });

  /*
   * INVERTED 31 August 2026. This asserted the page quoted no price at all, which
   * was D3. The owner reinstated one number for transparency: £62.50 plus VAT an
   * hour, and only that. What the test protects is the same distinction the
   * positioning gate now draws, between a rate and a menu.
   */
  it('quotes the hourly rate and nothing else', () => {
    const text = body();
    expect(text).toMatch(/£62\.50 plus VAT an hour/);
    // No other price, and no package language of any kind.
    expect(text.match(/£/g) ?? []).toHaveLength(1);
    expect(text).not.toMatch(/\bfrom £/);
    // "We do not sell packages" is the point, so the word is allowed; a package
    // PRICE is what must never appear.
    expect(text).not.toMatch(/packages? (from|start|at) /i);
  });

  it('says the first conversation is free', () => {
    expect(body()).toMatch(/The conversation.{0,20}is an hour, and it is free/);
  });

  it('promises no response time', () => {
    // D23. A missed promise on first contact is worse than no promise.
    const text = body();
    expect(text).not.toMatch(/within \d+ (hours|days|working)|24 hours|same day|by return/i);
  });

  it('uses the approved personal invitation without changing the business positioning', () => {
    const text = body();
    expect(text).toContain(
      'Tell Peter what is happening and what you would like to change. A line is enough to start.'
    );
    expect(text).toContain('Any sector, any size.');
    expect(screen.getByRole('button', { name: 'Send my enquiry' })).toBeInTheDocument();
  });

  it('places first contact before process, price and qualification, with one visible anchor', () => {
    render(<StartHerePage />);
    const enquiry = document.getElementById('enquiry')!;
    expect(document.querySelectorAll('#enquiry')).toHaveLength(1);
    expect(enquiry).toHaveClass('scroll-mt-28');
    const headings = [
      'what you get from the hour.',
      'what actually happens.',
      'how long, and what it costs.',
      'who this works for.',
      'what we need from you.',
      "who this doesn't work for.",
      'questions people ask first.',
    ];
    let previous: Element = enquiry;
    for (const name of headings) {
      const heading = screen.getByRole('heading', { name });
      expect(
        previous.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
      previous = heading;
    }
    expect(enquiry).toHaveTextContent(
      'Sending a message does not commit you to a call or paid work.'
    );
    expect(
      within(enquiry).getByRole('link', { name: 'Message Peter on WhatsApp' })
    ).toHaveAttribute('href', expect.stringContaining('wa.me/'));
  });

  it('frames the Anchor as our own venue rather than a pub', () => {
    expect(body()).toMatch(/our own venue/);
  });

  it('uses the agreed method words, not the pack defaults', () => {
    // The pack says HEAR EXPOSE BUILD PROVE. Peter changed it to HEAR CHALLENGE
    // BUILD OPTIMISE, so EXPOSE must not resurface anywhere.
    expect(body()).not.toMatch(/EXPOSE/);
  });

  it('leads every action with the site-wide call', () => {
    render(<StartHerePage />);
    const ctas = screen.getAllByRole('link', { name: /Let's talk/ });
    expect(ctas.length).toBeGreaterThanOrEqual(2);
    for (const cta of ctas) expect(cta).toHaveAttribute('href', '#enquiry');
  });

  it('puts the enquiry form on the page rather than sending people elsewhere', () => {
    render(<StartHerePage />);
    expect(screen.getByLabelText(/What's going on/)).toBeInTheDocument();
    expect(document.getElementById('enquiry')).toBeInTheDocument();
  });

  it('answers the five questions people ask before enquiring', () => {
    render(<StartHerePage />);
    expect(FAQS).toHaveLength(5);
    for (const faq of FAQS) {
      expect(screen.getByText(faq.q)).toBeInTheDocument();
    }
  });

  it('renders every step, need and takeaway', () => {
    const text = body();
    expect(STEPS).toHaveLength(5);
    for (const item of [...TAKEAWAYS, ...NEEDS.map((n) => n.title), ...STEPS.map((s) => s.word)]) {
      expect(text).toContain(item);
    }
  });

  it('brings its own chrome, so the legacy navigation is suppressed', () => {
    // Both halves matter. If the route is not listed, two navigations stack; if it
    // is listed and the page renders none, there is no navigation at all.
    expect(isOjRoute('/start-here')).toBe(true);
    render(<StartHerePage />);
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
  });

  it('does not offer a second control to the page you are already on', () => {
    /*
     * "Start here" used to sit in the navigation bar a few pixels from a button
     * pointing at the same place, which asked the reader to work out whether two
     * differently worded controls meant the same thing. Peter had it removed.
     *
     * This asserts the absence rather than deleting the old test, because the bar is
     * the obvious place someone would put it back.
     */
    render(<StartHerePage />);
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(within(nav).queryByRole('link', { name: 'Start here' })).toBeNull();
  });

  it('says the same words as the approved copy', () => {
    // The copy is reviewed as prose in tasks/repositioning/copy/start-here.md. This
    // is what stops the page and the reviewed document drifting apart after
    // approval, which is the normal way an approved page stops being the approved
    // page.
    const copy = readFileSync(
      join(process.cwd(), 'tasks/repositioning/copy/start-here.md'),
      'utf8'
    );
    for (const item of FIT.doesNot) {
      expect(copy).toContain(item.title);
    }
    for (const faq of FAQS) {
      expect(copy).toContain(faq.q);
    }
    for (const takeaway of TAKEAWAYS) {
      expect(copy).toContain(takeaway);
    }
  });
});
