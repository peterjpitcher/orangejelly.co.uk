import { render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import HowWeWorkPage from '@/app/how-we-work/page';
import {
  METHOD_DETAIL,
  PRESSURE_AREAS_EXPLAINED,
  PREVENTS,
  STARTING_AGREEMENT,
} from '@/app/how-we-work/content';

function body(): string {
  render(<HowWeWorkPage />);
  return document.body.textContent ?? '';
}

describe('/how-we-work', () => {
  it('names the four steps in the agreed order', () => {
    expect(METHOD_DETAIL.map((step) => step.word)).toEqual([
      'HEAR.',
      'CHALLENGE.',
      'BUILD.',
      'OPTIMISE.',
    ]);
  });

  it('does not use the words the pack drafted and Peter changed', () => {
    // The draft said HEAR EXPOSE BUILD PROVE. EXPOSE became CHALLENGE because
    // challenge is what happens in the room; PROVE became OPTIMISE because proving
    // is a moment and optimising is the job.
    const text = body();
    expect(text).not.toMatch(/EXPOSE/);
    expect(text).not.toMatch(/\bPROVE\b/);
  });

  it('puts measurement inside OPTIMISE rather than in a fifth step', () => {
    const optimise = METHOD_DETAIL[3];
    expect(optimise.word).toBe('OPTIMISE.');
    expect(optimise.line).toMatch(/baseline/i);
    expect(optimise.outcome).toMatch(/impact report/i);
  });

  it('gives every step a discipline, which is the part that binds', () => {
    render(<HowWeWorkPage />);
    for (const step of METHOD_DETAIL) {
      expect(screen.getByText(step.discipline)).toBeInTheDocument();
    }
  });

  it('explains all six pressure areas', () => {
    render(<HowWeWorkPage />);
    expect(PRESSURE_AREAS_EXPLAINED).toHaveLength(6);
    for (const area of PRESSURE_AREAS_EXPLAINED) {
      expect(screen.getByText(area.area)).toBeInTheDocument();
      expect(screen.getByText(area.body)).toBeInTheDocument();
    }
  });

  it('refuses to score the pressure map', () => {
    // A total invites a league table and false precision, which is the argument the
    // Scorecard component makes too. The two must not disagree.
    expect(body()).toMatch(/not a generic scorecard with a total at the bottom/);
  });

  it('lists what is agreed before anything is built', () => {
    const text = body();
    expect(STARTING_AGREEMENT).toHaveLength(9);
    for (const item of STARTING_AGREEMENT) expect(text).toContain(item);
  });

  it('says what the method is there to prevent', () => {
    const text = body();
    for (const item of PREVENTS) expect(text).toContain(item);
  });

  it('quotes no price and promises no response time', () => {
    const text = body();
    expect(text).not.toMatch(/£/);
    expect(text).not.toMatch(/within \d+ (hours|days|working)|24 hours/i);
  });

  it('speaks as the company, never as the founder', () => {
    const text = body();
    expect(text).not.toMatch(/\bPeter\b/);
    expect(text).not.toMatch(/\bI \b|\bmy \b/);
  });

  it('sends its actions to the conversation', () => {
    render(<HowWeWorkPage />);
    const ctas = screen.getAllByRole('link', { name: /Let's talk/ });
    expect(ctas.length).toBeGreaterThanOrEqual(2);
    for (const cta of ctas) expect(cta).toHaveAttribute('href', '/start-here');
  });

  it('says the same words as the approved copy', () => {
    const copy = readFileSync(
      join(process.cwd(), 'tasks/repositioning/copy/how-we-work.md'),
      'utf8'
    );
    for (const step of METHOD_DETAIL) expect(copy).toContain(step.line);
    for (const item of PREVENTS) expect(copy).toContain(item);
    for (const item of STARTING_AGREEMENT) expect(copy).toContain(item);
  });
});
