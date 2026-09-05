import { render, screen, within } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import HomePage from '@/app/page';
import { BUILDS, METHOD, PRESSURE_POINTS, PROOF, WORK_EXAMPLES } from '@/app/home-content';

function body(): string {
  render(<HomePage />);
  return document.body.textContent ?? '';
}

describe('the homepage', () => {
  it('makes the website and connected-system offer explicit', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Websites and connected systems that grow your business.'
    );
  });

  it('describes the company by market, not by sector', () => {
    const text = body();
    expect(text).toContain('websites, applications and useful AI');
    // The old homepage called Orange Jelly a hospitality marketing company. The
    // sector is now one market it works in, not the company's definition.
    expect(text).not.toMatch(/hospitality marketing/i);
  });

  it('quotes no price and names no package', () => {
    const text = body();
    expect(text).not.toMatch(/£/);
    // The four named packages went with D3. A page that argues every engagement is
    // priced to the problem cannot also list a menu.
    expect(text).not.toMatch(/Growth Fix|Momentum Month|Growth Partner|Turnaround Intensive/);
  });

  it('names the six places growth gets stuck and links each one', () => {
    render(<HomePage />);
    expect(PRESSURE_POINTS).toHaveLength(6);
    for (const point of PRESSURE_POINTS) {
      // The whole card is the link, so its accessible name is the area label, the
      // plain title and the description. That is deliberate: a bare arrow as the
      // only link is what the reference did, and it reads as "link" and nothing else.
      const link = screen.getByRole('link', { name: new RegExp(`^${point.area} ${point.title}`) });
      expect(link).toHaveAttribute('href', point.href);
    }
  });

  it('uses the agreed method words in the agreed order', () => {
    expect(METHOD.map((step) => step.word)).toEqual(['HEAR.', 'CHALLENGE.', 'BUILD.', 'OPTIMISE.']);
    // The pack said HEAR EXPOSE BUILD PROVE. Peter changed it, so the old words
    // must not survive anywhere.
    const text = body();
    expect(text).not.toMatch(/EXPOSE|PROVE\./);
  });

  it('shows only approved claims, every one as a percentage', () => {
    // CLAIMS.md is the single source of truth and requires percentages, never a raw
    // number and never a multiple: a client relates to +403% and not to fivefold.
    const claims = readFileSync(join(process.cwd(), 'CLAIMS.md'), 'utf8');
    for (const proof of PROOF) {
      const figure = proof.value.replace('+', '');
      expect(claims).toContain(figure.replace('%', ''));
      expect(proof.value).toMatch(/%$/);
    }
    expect(PROOF).toHaveLength(5);
  });

  it('states where every number came from', () => {
    render(<HomePage />);
    // A percentage with no provenance is a marketing estimate. Each card carries
    // its basis, and the section says the venue is ours.
    for (const proof of PROOF) {
      expect(screen.getByText(proof.context)).toBeInTheDocument();
    }
    expect(document.body.textContent).toMatch(/The Anchor is our own venue/);
  });

  it('uses no retired claim', () => {
    const text = body();
    for (const retired of ['58%', '71%', '60-70K', '300 contacts', '25 hours', '£75', '£250']) {
      expect(text).not.toContain(retired);
    }
  });

  it('speaks as the company, never as the founder', () => {
    const text = body();
    expect(text).not.toMatch(/\bPeter\b/);
    expect(text).not.toMatch(/\bI \b|\bmy \b/);
  });

  it('promises no response time', () => {
    expect(body()).not.toMatch(/within \d+ (hours|days|working)|24 hours|same day/i);
  });

  it('sends every primary action to the conversation', () => {
    render(<HomePage />);
    const ctas = screen.getAllByRole('link', { name: /Let's talk/ });
    expect(ctas.length).toBeGreaterThanOrEqual(2);
    for (const cta of ctas) expect(cta).toHaveAttribute('href', '/start-here');
  });

  it('does not mark itself current in its own navigation', () => {
    // The homepage is not in the nav list. If it ever is, this catches the day two
    // links both claim to be the current page.
    render(<HomePage />);
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(within(nav).queryByRole('link', { current: 'page' })).not.toBeInTheDocument();
  });

  it('puts the three builds and real work before broad diagnostic content', () => {
    render(<HomePage />);
    const main = screen.getByRole('main');
    const text = main.textContent ?? '';
    expect(text.indexOf('what we build.')).toBeLessThan(
      text.indexOf('where growth usually gets stuck.')
    );
    for (const build of BUILDS) {
      expect(
        within(main).getByRole('link', { name: new RegExp(`^${build.area} ${build.title}`) })
      ).toHaveAttribute('href', build.href);
    }
    for (const work of WORK_EXAMPLES)
      expect(within(main).getByRole('link', { name: new RegExp(work.title) })).toHaveAttribute(
        'href',
        work.href
      );
    expect(
      within(main).getByRole('link', { name: 'Tell us what you want to build or improve' })
    ).toHaveAttribute('href', '/start-here#enquiry');
    expect(text).toContain('not results from a website or an AI feature alone');
  });

  it('says the same words as the approved copy', () => {
    const copy = readFileSync(join(process.cwd(), 'tasks/repositioning/copy/homepage.md'), 'utf8');
    for (const build of BUILDS) expect(copy).toContain(build.desc);
    for (const point of PRESSURE_POINTS) expect(copy).toContain(point.desc);
    for (const step of METHOD) expect(copy).toContain(step.text);
  });
});
