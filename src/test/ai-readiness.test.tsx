import { render, screen, within } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import AiReadinessPage from '@/app/tools/ai-readiness/page';
import AiReadinessTool from '@/app/tools/ai-readiness/AiReadinessTool';
import { AREA_RESULTS } from '@/app/tools/ai-readiness/content';
import { SCORECARD_QUESTIONS } from '@/components/oj/scorecard-questions';

const track = vi.fn();
vi.mock('@/lib/tracking', () => ({
  trackClientEvent: (...args: unknown[]) => track(...args),
  hasAnalyticsConsent: () => false,
}));

/**
 * The AI readiness assessment.
 *
 * The thing worth testing hardest is the honesty rule: every area has to say where
 * AI does NOT help. A tool that concludes "you need AI" whatever the answers is a
 * lead magnet wearing an assessment's clothes.
 */
describe('the result texts', () => {
  it('covers all six areas in both states, twelve texts', () => {
    expect(AREA_RESULTS).toHaveLength(6);
    for (const area of AREA_RESULTS) {
      expect(area.pressed.what.length).toBeGreaterThan(80);
      expect(area.steady.length).toBeGreaterThan(60);
    }
  });

  it('says where AI does not help, for every single area', () => {
    // The sub-spec requires this for at least one area. Doing it for one and not
    // the others would be the same dishonesty, just rationed.
    for (const area of AREA_RESULTS) {
      expect(area.pressed.aiDoesNot.length, area.id).toBeGreaterThan(60);
    }
  });

  it('names something AI genuinely cannot do, not a soft caveat', () => {
    const cannot = AREA_RESULTS.map((a) => a.pressed.aiDoesNot.toLowerCase()).join(' ');
    // Each of these is a real limit rather than "results may vary".
    expect(cannot).toMatch(/decide what you are for/);
    expect(cannot).toMatch(/decide what to charge/);
    expect(cannot).toMatch(/rescue a bad process/);
    expect(cannot).toMatch(/deliver the experience/);
  });

  it('is honest that operations is where AI actually pays', () => {
    // Saying "AI helps everywhere" and "AI helps nowhere" are both useless. The
    // tool has to have a view.
    const operations = AREA_RESULTS.find((a) => a.id === 'operations');
    expect(operations?.pressed.aiHelps).toMatch(/More than anywhere else on this list/);
  });

  it('quantifies nothing and quotes no price', () => {
    const everything = JSON.stringify(AREA_RESULTS);
    expect(everything).not.toMatch(/£/);
    expect(everything).not.toMatch(/\d+%/);
  });
});

describe('the page', () => {
  it('says up front what it will not tell you', () => {
    render(<AiReadinessPage />);
    const text = document.body.textContent ?? '';
    expect(text).toMatch(/There is no score at the end/);
    expect(text).toMatch(/what this will not tell you/);
    expect(text).toMatch(/That you need AI\./);
  });

  it('keeps AI upper case in the display heading', () => {
    const { container } = render(<AiReadinessPage />);
    expect(container.querySelector('h1')?.textContent).toContain('AI');
    expect(container.querySelector('h1')?.querySelector('.oj-keep-case')?.textContent).toBe('AI');
  });

  it('renders the twelve statements server-side for the no-JavaScript case', () => {
    /*
     * The assessment runs in the browser, so without JavaScript the page still has
     * to be worth arriving at. An empty box for every crawler and for anyone with
     * scripts off is worse than a page that explains itself.
     *
     * Asserted against the SERVER markup rather than the client DOM. React does not
     * mount noscript children into the DOM when scripting is on, so a jsdom render
     * shows an empty element whether the fallback is there or not. The server
     * output is what a scripts-off browser is actually handed, so it is the only
     * thing worth asserting on.
     */
    const html = renderToStaticMarkup(<AiReadinessPage />);
    expect(html).toContain('<noscript>');
    for (const question of SCORECARD_QUESTIONS) {
      expect(html).toContain(question.text);
    }
  });

  it('offers the conversation from the fallback too', () => {
    const html = renderToStaticMarkup(<AiReadinessPage />);
    const fallback = html.slice(html.indexOf('<noscript>'), html.indexOf('</noscript>'));
    expect(fallback).toMatch(/Bring us the problem/);
    expect(fallback).toMatch(/href="\/start-here"/);
  });
});

describe('running the assessment', () => {
  async function answerAll(user: ReturnType<typeof userEvent.setup>, choice: string) {
    for (const question of SCORECARD_QUESTIONS) {
      const group = screen.getByText(question.text).closest('fieldset') as HTMLElement;
      await user.click(within(group).getByText(choice));
    }
  }

  it('shows no result until every statement is answered', async () => {
    const user = userEvent.setup();
    render(<AiReadinessTool />);

    const first = SCORECARD_QUESTIONS[0];
    const group = screen.getByText(first.text).closest('fieldset') as HTMLElement;
    await user.click(within(group).getByText('Never'));

    expect(screen.queryByText('This is a signal, not a diagnosis.')).not.toBeInTheDocument();
  });

  it('names the pressed areas and calls the result a signal', async () => {
    const user = userEvent.setup();
    render(<AiReadinessTool />);
    // "Never" on the positive statements is the worst answer, so everything is
    // under pressure and the result has to say so.
    await answerAll(user, 'Never');

    // One signal line, from the pressure map caption, and one call to action.
    expect(await screen.findByText('This is a signal, not a diagnosis.')).toBeInTheDocument();
    expect(screen.getAllByText('Where AI helps').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Where it does not').length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Bring us the problem/ })).toHaveLength(1);
  });

  it('respects the reverse-scored statements rather than straight-lining', async () => {
    const user = userEvent.setup();
    render(<AiReadinessTool />);
    // "Always" is healthy on the positive statements and the WORST answer on the
    // two operations ones, which are the reverse-scored pair. So operations must
    // come out pressed while the others do not.
    await answerAll(user, 'Always');

    await screen.findByText('This is a signal, not a diagnosis.');
    // The AI detail panel only renders areas under pressure, so Operations having
    // its own heading there is the proof that reverse scoring was applied.
    expect(screen.getByRole('heading', { name: 'Operations' })).toBeInTheDocument();
  });

  it('sends the pressed areas to the enquiry so nobody retypes them', async () => {
    const user = userEvent.setup();
    render(<AiReadinessTool />);
    await answerAll(user, 'Never');

    const cta = await screen.findByRole('link', { name: /Bring us the problem/ });
    const href = cta.getAttribute('href') ?? '';
    expect(href.startsWith('/start-here?situation=')).toBe(true);
    expect(decodeURIComponent(href)).toMatch(/put us under most pressure on/);
  });

  it('reports bands to analytics and never a raw answer', async () => {
    track.mockClear();
    const user = userEvent.setup();
    render(<AiReadinessTool />);
    await answerAll(user, 'Never');

    const completed = track.mock.calls.find((call) => call[0] === 'scorecard_completed');
    expect(completed).toBeDefined();
    const properties = completed?.[1]?.properties as Record<string, unknown>;
    // The dictionary forbids free text in any property, and the raw answers never
    // leave the browser.
    expect(Object.keys(properties)).toEqual(expect.arrayContaining(['pressure_bands']));
    expect(JSON.stringify(properties)).not.toMatch(/We can explain|enquiries turn into/);
  });
});
