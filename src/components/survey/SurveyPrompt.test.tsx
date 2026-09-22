import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import SurveyPrompt, {
  PROMPT_DELAY_MS,
  PROMPT_SNOOZE_MS,
  PROMPT_STORAGE_KEY,
  isPromptExcluded,
} from './SurveyPrompt';

const pathnameMock = vi.fn<[], string>(() => '/about');
vi.mock('next/navigation', () => ({ usePathname: () => pathnameMock() }));

const CONSENT_KEY = 'oj-cookie-consent';
const DAY = 24 * 60 * 60 * 1000;

let fetchMock: ReturnType<typeof vi.fn>;

/* The suite's jsdom has no localStorage, so each test gets a fresh in-memory one. */
function stubLocalStorage(getItem?: (key: string) => string | null): void {
  const store = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: getItem ?? ((key: string) => store.get(key) ?? null),
    setItem: (key: string, value: string) => void store.set(key, value),
    removeItem: (key: string) => void store.delete(key),
    clear: () => store.clear(),
  });
}

function serverSays(live: boolean, status = 200): void {
  fetchMock.mockResolvedValue({ ok: status < 400, status, json: async () => ({ live }) });
}

function chooseCookies(): void {
  window.localStorage.setItem(CONSENT_KEY, JSON.stringify({ analytics: false, timestamp: 'x' }));
}

function setWide(matches: boolean): void {
  vi.mocked(window.matchMedia).mockImplementation(
    (query: string) =>
      ({
        matches,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }) as unknown as MediaQueryList
  );
}

async function waitOut(ms = PROMPT_DELAY_MS): Promise<void> {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}

function record(): { slug: string; shownAt?: number; done?: boolean } | null {
  const raw = window.localStorage.getItem(PROMPT_STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

describe('the survey prompt', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    stubLocalStorage();
    pathnameMock.mockReturnValue('/about');
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    setWide(false);
    serverSays(true);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('opens as a small card on a phone, only once the delay has passed', async () => {
    chooseCookies();
    render(<SurveyPrompt />);

    await waitOut(PROMPT_DELAY_MS - 1);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await waitOut(1);
    const card = screen.getByRole('dialog');
    expect(card).toHaveAttribute('aria-modal', 'false');
    expect(screen.getByRole('link', { name: /Take the survey/ })).toHaveAttribute(
      'href',
      '/survey/pub-apps'
    );
    expect(fetchMock).toHaveBeenCalledWith('/api/survey-promotion');
  });

  it('opens as a lightbox on a wide screen', async () => {
    chooseCookies();
    setWide(true);
    render(<SurveyPrompt />);
    await waitOut();

    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('Which tools would make running your pub easier?')).toBeVisible();
  });

  it('stays closed when the survey is not live', async () => {
    chooseCookies();
    serverSays(false);
    render(<SurveyPrompt />);
    await waitOut();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(record()).toBeNull();
  });

  it('fails closed when the status check fails', async () => {
    chooseCookies();
    serverSays(false, 503);
    render(<SurveyPrompt />);
    await waitOut();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    fetchMock.mockRejectedValue(new Error('offline'));
    pathnameMock.mockReturnValue('/results');
    render(<SurveyPrompt />);
    await waitOut();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('waits for the cookie choice before it starts counting', async () => {
    render(<SurveyPrompt />);
    await waitOut(PROMPT_DELAY_MS * 3);
    expect(fetchMock).not.toHaveBeenCalled();

    chooseCookies();
    act(() => {
      window.dispatchEvent(new CustomEvent('oj:analytics-consent', { detail: false }));
    });
    await waitOut();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('stays away for 14 days once it has been seen', async () => {
    chooseCookies();
    const now = Date.now();
    window.localStorage.setItem(
      PROMPT_STORAGE_KEY,
      JSON.stringify({ slug: 'pub-apps', shownAt: now - DAY })
    );
    const { unmount } = render(<SurveyPrompt />);
    await waitOut();
    expect(fetchMock).not.toHaveBeenCalled();
    unmount();

    window.localStorage.setItem(
      PROMPT_STORAGE_KEY,
      JSON.stringify({ slug: 'pub-apps', shownAt: now - PROMPT_SNOOZE_MS - DAY })
    );
    render(<SurveyPrompt />);
    await waitOut();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('records the time it opened, and Not now simply closes it', async () => {
    chooseCookies();
    render(<SurveyPrompt />);
    await waitOut();
    expect(record()).toMatchObject({ slug: 'pub-apps', shownAt: expect.any(Number) });

    fireEvent.click(screen.getByRole('button', { name: 'Not now' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('never comes back after somebody takes the survey', async () => {
    chooseCookies();
    render(<SurveyPrompt />);
    await waitOut();
    fireEvent.click(screen.getByRole('link', { name: /Take the survey/ }));
    expect(record()).toMatchObject({ slug: 'pub-apps', done: true });
  });

  it('counts a visit to the survey page as taking it up', async () => {
    chooseCookies();
    pathnameMock.mockReturnValue('/survey/pub-apps');
    render(<SurveyPrompt />);
    await waitOut();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(record()).toEqual({ slug: 'pub-apps', done: true });
  });

  it('keeps off the survey, the back office and the enquiry page', async () => {
    chooseCookies();
    for (const path of ['/survey/another', '/admin', '/availability/new', '/start-here']) {
      expect(isPromptExcluded(path)).toBe(true);
      pathnameMock.mockReturnValue(path);
      const { unmount } = render(<SurveyPrompt />);
      await waitOut();
      unmount();
    }
    expect(fetchMock).not.toHaveBeenCalled();
    expect(isPromptExcluded('/guides/pub-quiz-night-ideas')).toBe(false);
  });

  it('does not open at all when the browser will not store the flag', async () => {
    stubLocalStorage((key: string) => {
      if (key === PROMPT_STORAGE_KEY) throw new Error('blocked');
      return key === CONSENT_KEY ? '{}' : null;
    });
    render(<SurveyPrompt />);
    await waitOut();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('closes on Escape on a phone', async () => {
    chooseCookies();
    render(<SurveyPrompt />);
    await waitOut();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
