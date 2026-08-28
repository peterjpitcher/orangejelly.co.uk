import { render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import FractionalCmoPage from '@/app/fractional-cmo/page';
import { QUESTIONS_TO_ASK, RIGHT_ANSWER, WRONG_SHAPE } from '@/app/fractional-cmo/content';

function body(): string {
  render(<FractionalCmoPage />);
  return document.body.textContent ?? '';
}

describe('/fractional-cmo', () => {
  it('uses the category language, which is the point of existing', () => {
    // Four fractional terms sit in the 500 tier, one at competition index 12, and
    // the brand pack does not mention the category once.
    const text = body();
    expect(text).toMatch(/fractional CMO/);
    render(<FractionalCmoPage />);
  });

  it('concedes when a fractional CMO is the right hire', () => {
    // A page arguing against the format that never conceded it works would be a
    // sales pitch, and the reader would know by the second paragraph.
    render(<FractionalCmoPage />);
    expect(RIGHT_ANSWER).toHaveLength(3);
    for (const item of RIGHT_ANSWER) expect(screen.getByText(item.title)).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/If all three are true, hire one/);
  });

  it('offers to point somewhere else', () => {
    expect(body()).toMatch(/we can usually suggest where to look/);
  });

  it('makes the cross-functional argument, which is the actual case', () => {
    render(<FractionalCmoPage />);
    expect(
      screen.getByText('The problem crosses functions and only one of them gets a seat.')
    ).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/act on roughly a third of it/);
  });

  it('gives the reader questions to ask us as well as them', () => {
    const text = body();
    expect(QUESTIONS_TO_ASK).toHaveLength(5);
    for (const question of QUESTIONS_TO_ASK) expect(text).toContain(question);
    expect(text).toMatch(/Ask these of a fractional CMO and of us/);
  });

  it('includes the question that invites us to be sacked', () => {
    // A page listing questions to ask that omitted this one would be selecting
    // the questions it liked the answers to.
    expect(QUESTIONS_TO_ASK).toContain('What would make you tell me to stop paying you?');
  });

  it('says we are not a fractional anything', () => {
    expect(body()).toMatch(/We are not a fractional anything/);
  });

  it('keeps CMO upper case in the display heading', () => {
    const { container } = render(<FractionalCmoPage />);
    expect(container.querySelector('h1')?.textContent).toContain('CMO');
  });

  it('quotes no price and promises no timescale', () => {
    const text = body();
    expect(text).not.toMatch(/£/);
    expect(text).not.toMatch(/within \d+ (hours|days)/i);
  });

  it('says the same words as the approved copy', () => {
    const flatten = (value: string) => value.replace(/\s+/g, ' ');
    const copy = flatten(
      readFileSync(join(process.cwd(), 'tasks/repositioning/copy/fractional-cmo.md'), 'utf8')
    );
    for (const item of [...RIGHT_ANSWER, ...WRONG_SHAPE]) {
      expect(copy).toContain(flatten(item.body));
    }
    for (const question of QUESTIONS_TO_ASK) expect(copy).toContain(question);
  });
});
