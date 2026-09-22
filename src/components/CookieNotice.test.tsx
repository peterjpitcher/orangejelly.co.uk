import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import CookieNotice, { openCookieSettings } from './CookieNotice';
import { CookieSettingsButton } from './CookieSettingsButton';

/**
 * Changing your mind, which the privacy notice promises you can do at any time.
 *
 * Before 22 September 2026 the panel only appeared to somebody who had not chosen
 * yet, so a stored choice could not be changed from the site at all. These hold
 * the three things that make the promise true: the footer reopens the panel, it
 * says what is currently chosen, and switching analytics off really stops it.
 */
const pathnameMock = vi.fn(() => '/contact');
vi.mock('next/navigation', () => ({ usePathname: () => pathnameMock() }));

const updateGtagConsent = vi.fn();
vi.mock('@/components/GoogleTagManager', () => ({
  updateGtagConsent: (granted: boolean) => updateGtagConsent(granted),
}));

const KEY = 'oj-cookie-consent';
const stored = (analytics: boolean): string =>
  JSON.stringify({ analytics, timestamp: '2026-09-22T12:00:00.000Z' });

let store: Map<string, string>;
const reload = vi.fn();

beforeEach(() => {
  store = new Map();
  // This jsdom build has no localStorage.
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
    removeItem: (key: string) => void store.delete(key),
  });
  vi.stubGlobal('location', { ...window.location, hostname: 'www.orangejelly.co.uk', reload });
  updateGtagConsent.mockReset();
  reload.mockReset();
  pathnameMock.mockReturnValue('/contact');
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Cookie settings', () => {
  it('stays hidden once a choice is stored, until someone asks for it', () => {
    store.set(KEY, stored(true));
    render(<CookieNotice />);

    expect(screen.queryByRole('dialog', { name: 'Cookie preferences' })).toBeNull();
  });

  it('reopens from the footer, says what is chosen now and takes focus', async () => {
    store.set(KEY, stored(true));
    const user = userEvent.setup();
    render(
      <>
        <CookieNotice />
        <CookieSettingsButton />
      </>
    );

    await user.click(screen.getByRole('button', { name: 'Cookie settings' }));

    const panel = screen.getByRole('dialog', { name: 'Cookie preferences' });
    expect(panel).toHaveTextContent('Analytics is currently switched on.');
    expect(panel).toHaveFocus();
  });

  it('stops Google straight away when analytics is switched off: cookies cleared, page reloaded', async () => {
    store.set(KEY, stored(true));
    document.cookie = '_ga=GA1.1.123.456; path=/';
    document.cookie = '_ga_TEST=GS1.1.789; path=/';
    const user = userEvent.setup();
    render(<CookieNotice />);

    act(() => openCookieSettings());
    await user.click(screen.getByRole('button', { name: 'Reject analytics' }));

    expect(JSON.parse(store.get(KEY) ?? '{}').analytics).toBe(false);
    expect(updateGtagConsent).toHaveBeenLastCalledWith(false);
    expect(document.cookie).not.toMatch(/_ga/);
    // GTM cannot be unloaded from a running page, so the page reloads without it.
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('does not reload for somebody who had analytics off and keeps it off', async () => {
    store.set(KEY, stored(false));
    const user = userEvent.setup();
    render(<CookieNotice />);

    act(() => openCookieSettings());
    expect(screen.getByRole('dialog')).toHaveTextContent('Analytics is currently switched off.');
    await user.click(screen.getByRole('button', { name: 'Reject analytics' }));

    expect(reload).not.toHaveBeenCalled();
  });

  it('switches analytics on without a reload, so the choice takes effect on this page', async () => {
    store.set(KEY, stored(false));
    const user = userEvent.setup();
    render(<CookieNotice />);

    act(() => openCookieSettings());
    await user.click(screen.getByRole('button', { name: 'Accept analytics' }));

    expect(updateGtagConsent).toHaveBeenLastCalledWith(true);
    expect(reload).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('is not offered on a poll page, where the consent panel never mounts', () => {
    pathnameMock.mockReturnValue('/availability/o/0123456789abcdef0123456789abcdef');
    render(<CookieSettingsButton />);

    expect(screen.queryByRole('button', { name: 'Cookie settings' })).toBeNull();
  });
});
