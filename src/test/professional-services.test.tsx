import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ProfessionalServicesPage from '@/app/sectors/professional-services/page';
import { TRANSLATIONS, WHAT_WE_DO_NOT_HAVE } from '@/app/sectors/professional-services/content';

function body(): string {
  render(<ProfessionalServicesPage />);
  return document.body.textContent ?? '';
}

describe('/sectors/professional-services', () => {
  it('translates all six areas into firm language', () => {
    render(<ProfessionalServicesPage />);
    expect(TRANSLATIONS).toHaveLength(6);
    for (const item of TRANSLATIONS) {
      expect(screen.getByText(item.heading)).toBeInTheDocument();
    }
  });

  it('uses the vocabulary a firm uses about itself', () => {
    // The page has no sector case study, so its usefulness rests entirely on
    // whether it sounds like somebody who has been in the room.
    const text = body();
    for (const term of ['realisation', 'utilisation', 'write-offs', 'referral', 'charge-out']) {
      expect(text.toLowerCase(), term).toContain(term.toLowerCase());
    }
  });

  it('gives every area a tell, not just a description', () => {
    for (const item of TRANSLATIONS) {
      expect(item.tell.length, item.area).toBeGreaterThan(40);
    }
  });

  it('says plainly that there is no professional services case study', () => {
    // A sector page with no sector client that did not say so would be exactly the
    // behaviour this repositioning exists to remove.
    render(<ProfessionalServicesPage />);
    expect(screen.getByText('what we do not have.')).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/A professional services case study/);
  });

  it('disclaims the technical work rather than implying competence in it', () => {
    expect(WHAT_WE_DO_NOT_HAVE.join(' ')).toMatch(
      /What an accountant, a solicitor or a surveyor actually does is not our field/
    );
  });

  it('claims no sector experience anywhere', () => {
    const text = body();
    expect(text).not.toMatch(/our (accountancy|legal|professional services) clients/i);
    expect(text).not.toMatch(/we have worked with (firms|practices)/i);
    expect(text).not.toMatch(/trusted by/i);
  });

  it('makes the transferability argument rather than asserting it', () => {
    expect(body()).toMatch(/do not care what you sell/);
  });

  it('quotes no price and shows no unapproved number', () => {
    const text = body();
    expect(text).not.toMatch(/£/);
    expect(text).not.toMatch(/\d+%/);
  });

  it('routes to the growth problems rather than to a service list', () => {
    render(<ProfessionalServicesPage />);
    const links = screen.getAllByRole('link');
    const problemLinks = links.filter((l) =>
      (l.getAttribute('href') ?? '').startsWith('/growth-problems/')
    );
    expect(problemLinks.length).toBeGreaterThanOrEqual(6);
  });
});
