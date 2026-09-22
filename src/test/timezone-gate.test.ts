import { describe, expect, it } from 'vitest';
import { LONDON_TIME_ZONE } from '@/lib/dateUtils';

/**
 * The two-zone gate, guarded.
 *
 * `npm test` runs the suite in Europe/London, the business zone, and
 * `npm run test:utc` runs the same suite in UTC, which is what the serverless
 * runtime uses. vitest.config.ts sets that up. If it ever stops doing so, both runs
 * can land in the same zone and still go green, which is how the Anchor management
 * app once ran London twice with nobody noticing. These fail if the zone asked for
 * is not the zone the suite actually ran in.
 *
 * The London default is stated here as well as in the config on purpose, so a
 * change to the default in one place fails here instead of passing quietly.
 */
const expectedTimeZone = process.env.REQUESTED_TEST_TZ || LONDON_TIME_ZONE;

describe('test time zone gate', () => {
  it('runs in the zone asked for, or Europe/London when none was', () => {
    // Undefined here means the config no longer pins a zone at all, and the suite
    // is running in whatever zone the machine happens to be set to.
    expect(process.env.TZ).toBe(expectedTimeZone);
  });

  it('reads local time the way the expected zone does', () => {
    // Midsummer noon UTC is 13:00 in London (BST) and 12:00 in UTC. Reading the
    // local hour straight off a Date is the mistake the two runs exist to catch, so
    // the ambient zone must agree with a formatter pinned to the expected zone.
    const midsummerNoonUtc = new Date('2026-07-04T12:00:00.000Z');
    const expectedHour = Number(
      new Intl.DateTimeFormat('en-GB', {
        timeZone: expectedTimeZone,
        hour: 'numeric',
        hourCycle: 'h23',
      }).format(midsummerNoonUtc)
    );

    expect(midsummerNoonUtc.getHours()).toBe(expectedHour);
  });

  // npm names the script it is running in npm_lifecycle_event. This one guards the
  // script itself: if `TZ=UTC` is ever dropped from `test:utc`, the other two checks
  // would expect London and pass, so this is what fails.
  it.runIf(process.env.npm_lifecycle_event === 'test:utc')('runs `npm run test:utc` in UTC', () => {
    expect(process.env.TZ).toBe('UTC');
  });
});
