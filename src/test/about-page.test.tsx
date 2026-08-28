import { render, screen, within } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import AboutPage from '@/app/about/page';
import { FACTS, LESSONS, REFUSALS } from '@/app/about/content';

function body(): string {
  render(<AboutPage />);
  return document.body.textContent ?? '';
}

describe('/about', () => {
  it('is about the company, not the founder', () => {
    // D21. The old page opened "I'm Peter". The brand is Orange Jelly.
    render(<AboutPage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('small on purpose.');
    const text = document.body.textContent ?? '';
    expect(text).not.toMatch(/\bI'm\b|\bI am\b|\bmy \b/);
  });

  it('names who you deal with without turning into a biography', () => {
    // Naming two people in a two-person company is a feature, not a founder story:
    // it is the answer to "who will actually be doing this".
    const text = body();
    expect(text).toMatch(/Billy Summers/);
    expect(text).toMatch(/Peter Pitcher/);
    expect(text).toMatch(/no account manager/i);
  });

  it('says what it will not do, which is the half that is worth reading', () => {
    render(<AboutPage />);
    expect(REFUSALS).toHaveLength(5);
    for (const refusal of REFUSALS) {
      expect(screen.getByText(refusal.title)).toBeInTheDocument();
    }
  });

  it('frames The Anchor as our own venue, never as a pub belonging to a person', () => {
    const text = body();
    expect(text).toMatch(/The Anchor is our own venue/);
    expect(text).not.toMatch(/Peter's pub|his pub/i);
  });

  it('uses only approved claims, as percentages', () => {
    const claims = readFileSync(join(process.cwd(), 'CLAIMS.md'), 'utf8');
    const text = body();
    for (const figure of ['828%', '403%', '567%', '98%', '89%']) {
      expect(text).toContain(figure);
      expect(claims).toContain(figure.replace('%', ''));
    }
    // Retired claims and raw money figures stay gone.
    expect(text).not.toMatch(/£|25 hours|58%|71%/);
  });

  it('states the facts it can evidence and no more', () => {
    const { container } = render(<AboutPage />);
    expect(FACTS).toHaveLength(6);

    // Scoped to the definition list: "Company" also appears in the footer heading,
    // and a page-wide text query would match that instead.
    const list = container.querySelector('dl.measure-wide') as HTMLElement;
    for (const fact of FACTS) {
      expect(within(list).getByText(fact.label)).toBeInTheDocument();
      expect(within(list).getByText(fact.value)).toBeInTheDocument();
    }
  });

  it('is honest that there was one business before there were clients', () => {
    // Six years of doing this in a business we owned is the reason the proof is
    // real and the reason the results page has one client on it. Saying both is
    // stronger than implying a client list that does not exist.
    const text = body();
    expect(text).toMatch(/First client outside our own business/);
    expect(text).toMatch(/September 2025/);
    expect(text).not.toMatch(/our clients|trusted by|hundreds of/i);
  });

  it('draws its lessons from the work rather than from assertion', () => {
    render(<AboutPage />);
    expect(LESSONS).toHaveLength(3);
    for (const lesson of LESSONS) {
      expect(screen.getByText(lesson.title)).toBeInTheDocument();
    }
  });

  it('routes its internal links through the library anchor', () => {
    render(<AboutPage />);
    expect(screen.getByRole('link', { name: /hear, challenge, build, optimise/ })).toHaveAttribute(
      'href',
      '/how-we-work'
    );
    expect(screen.getByRole('link', { name: /how they were measured/ })).toHaveAttribute(
      'href',
      '/results'
    );
  });

  it('says the same words as the approved copy', () => {
    const flatten = (value: string) => value.replace(/\s+/g, ' ');
    const copy = flatten(
      readFileSync(join(process.cwd(), 'tasks/repositioning/copy/about.md'), 'utf8')
    );
    for (const refusal of REFUSALS) expect(copy).toContain(flatten(refusal.title));
    for (const lesson of LESSONS) expect(copy).toContain(flatten(lesson.body));
  });
});
