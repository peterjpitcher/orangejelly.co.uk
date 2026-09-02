import { render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { PRESSURE_POINTS } from '@/app/home-content';
import SolutionsPage from '@/app/solutions/page';
import { CAPABILITIES, CAPABILITY_GROUPS, DECLINED } from '@/app/solutions/content';

function body(): string {
  render(<SolutionsPage />);
  return document.body.textContent ?? '';
}

describe('/solutions', () => {
  it('leads with the problem, not with the capability list', () => {
    render(<SolutionsPage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'once we know the problem, we build the fix.'
    );

    // Thirteen capabilities as a headline reads as a company that will do
    // anything, which is the impression the method exists to correct. The order of
    // the two sections is the argument.
    const text = document.body.textContent ?? '';
    expect(text.indexOf('start with where it is stuck.')).toBeLessThan(
      text.indexOf('what a fix can be made of.')
    );
  });

  it('shares the six pressure points with the homepage rather than restating them', () => {
    render(<SolutionsPage />);
    // Two lists of the same six things drift, and the day they drift the site
    // disagrees with itself about what it works on.
    for (const point of PRESSURE_POINTS) {
      expect(
        screen.getByRole('link', { name: new RegExp(`^${point.area} ${point.title}`) })
      ).toHaveAttribute('href', point.href);
    }
  });

  it('says nobody buys a capability on its own', () => {
    const text = body();
    expect(text).toMatch(/Nobody buys one of them on its own/);
    expect(text).toMatch(/Nobody buys a solution from this page/);
  });

  it('lists what it declines, including work it would be second best at', () => {
    render(<SolutionsPage />);
    // Five became three on 2 September 2026: the two dropped are said on Start
    // here, and this page had become the fifth list of refusals on the site.
    expect(DECLINED).toHaveLength(3);
    for (const item of DECLINED) expect(screen.getByText(item)).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/second-best supplier/);
  });

  it('names all thirteen capabilities, each under one of five groups', () => {
    render(<SolutionsPage />);
    expect(CAPABILITIES).toHaveLength(13);
    expect(CAPABILITY_GROUPS).toHaveLength(5);
    const groupIds = new Set(CAPABILITY_GROUPS.map((group) => group.id));
    for (const capability of CAPABILITIES) {
      expect(groupIds.has(capability.group), capability.name).toBe(true);
      expect(screen.getByText(capability.name)).toBeInTheDocument();
    }
    // Every group has something in it, and the headings render in the agreed order.
    const text = document.body.textContent ?? '';
    let last = -1;
    for (const group of CAPABILITY_GROUPS) {
      expect(CAPABILITIES.some((capability) => capability.group === group.id)).toBe(true);
      const at = text.indexOf(group.heading);
      expect(at, group.heading).toBeGreaterThan(last);
      last = at;
    }
  });

  it('quotes the hourly rate once and names no package', () => {
    const text = body();
    expect(text).toMatch(/£62\.50 plus VAT an hour/);
    expect(text.match(/£/g)).toHaveLength(1);
    expect(text).not.toMatch(/Growth Fix|Momentum Month|Turnaround Intensive/);
  });

  it('says the same words as the approved copy', () => {
    const flatten = (value: string) => value.replace(/\s+/g, ' ');
    const copy = flatten(
      readFileSync(join(process.cwd(), 'tasks/repositioning/copy/solutions.md'), 'utf8')
    );
    for (const capability of CAPABILITIES) expect(copy).toContain(flatten(capability.body));
    for (const item of DECLINED) expect(copy).toContain(flatten(item));
  });
});
