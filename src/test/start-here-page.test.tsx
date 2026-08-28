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
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('start here.');
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

  it('names all six poor-fit behaviours, not a hedged summary', () => {
    expect(FIT.doesNot).toHaveLength(6);
    const text = body();
    expect(text).toMatch(/post three times a week/);
    expect(text).toMatch(/pair of hands/);
    expect(text).toMatch(/AI because it is AI/);
  });

  it('quotes no price anywhere', () => {
    const text = body();
    expect(text).not.toMatch(/£/);
    expect(text).not.toMatch(/\bfrom \d/);
    expect(text).toMatch(/we do not publish prices/);
  });

  it('says the first conversation is free', () => {
    expect(body()).toMatch(/The conversation.{0,20}is an hour, and it is free/);
  });

  it('promises no response time', () => {
    // D23. A missed promise on first contact is worse than no promise.
    const text = body();
    expect(text).not.toMatch(/within \d+ (hours|days|working)|24 hours|same day|by return/i);
  });

  it('speaks as the company, never as the founder', () => {
    // D21. The brand is Orange Jelly, not Peter.
    const text = body();
    expect(text).not.toMatch(/\bPeter\b/);
    expect(text).not.toMatch(/\bI \b|\bmy \b/);
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
    const ctas = screen.getAllByRole('link', { name: /Bring us the problem/ });
    expect(ctas.length).toBeGreaterThanOrEqual(2);
    for (const cta of ctas) expect(cta).toHaveAttribute('href', '#enquiry');
  });

  it('puts the enquiry form on the page rather than sending people elsewhere', () => {
    render(<StartHerePage />);
    expect(screen.getByLabelText(/What is happening in the business/)).toBeInTheDocument();
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

  it('marks itself as the current page in its own navigation', () => {
    render(<StartHerePage />);
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(within(nav).getByRole('link', { name: 'Start here' })).toHaveAttribute(
      'aria-current',
      'page'
    );
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
