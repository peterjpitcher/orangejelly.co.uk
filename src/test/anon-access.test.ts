/**
 * Guards what the public anon key can reach in the live database.
 *
 * The reviewed state lives in supabase/anon-access-allowlist.ts. This file reads
 * the live catalogue and fails when the database grants anon anything that file
 * does not allow, naming the object.
 *
 * HOW TO RUN IT AGAINST A REAL PROJECT
 *   DATABASE_URL='postgresql://...' npx vitest run src/test/anon-access.test.ts
 *
 *   The connection string is the direct Postgres URL from the Supabase dashboard
 *   under Project Settings, Database. SUPABASE_DB_URL is accepted as an alias.
 *   DATABASE_URL and DATABASE_SSL are already this repository's names for a
 *   direct Postgres connection, see src/lib/db/client.ts.
 *
 * WITHOUT A CONNECTION STRING IT SKIPS, ON PURPOSE
 *   `npm test` must stay runnable offline and must not need production
 *   credentials, so the live check is opt-in and says out loud that it skipped
 *   and why. A silent skip is indistinguishable from a pass. The rest of this
 *   file is pure and always runs, so the comparison rules themselves are proven
 *   even when the live check does not run.
 *
 * IT CANNOT CHANGE ANYTHING
 *   Two SELECTs, on a session forced read-only before either of them runs, so a
 *   mistake here cannot write to the database it is inspecting.
 */

import { describe, expect, it } from 'vitest';

import {
  ANON_ALLOWLIST,
  ANON_CATALOGUE_QUERY,
  ANON_OPEN_ITEMS,
  LEAD_BEARING_RELATIONS,
  LEAD_EXPOSURE_QUERY,
  describeAnonAccessFindings,
  describeLeadExposure,
  diffAnonAccess,
  findLeadExposure,
  type AnonCatalogueEntry,
  type LeadExposureRow,
} from '../../supabase/anon-access-allowlist';

// ---------------------------------------------------------------------------
// Reaching the live database, or explaining why we are not going to.
// ---------------------------------------------------------------------------

const connectionString = process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL ?? '';

const SKIP_REASON =
  'no database connection configured. Set DATABASE_URL (or SUPABASE_DB_URL) to the project direct Postgres URL to run the live anon-grant check. Skipping is expected offline and in CI.';

/** Mirrors the SSL handling in src/lib/db/client.ts so both agree. */
function sslConfig(url: string): false | { rejectUnauthorized: boolean } | undefined {
  if (process.env.DATABASE_SSL === 'false') return false;
  if (process.env.DATABASE_SSL === 'true' || /sslmode=require|ssl=true/i.test(url)) {
    return { rejectUnauthorized: false };
  }
  return undefined;
}

interface LiveReading {
  reachable: AnonCatalogueEntry[];
  exposure: LeadExposureRow[];
}

async function readLiveCatalogue(): Promise<LiveReading> {
  const { Client } = await import('pg');
  const client = new Client({
    connectionString,
    ssl: sslConfig(connectionString),
    connectionTimeoutMillis: 15_000,
    statement_timeout: 30_000,
  });

  await client.connect();
  try {
    // Belt and braces: this session cannot write, whatever the queries say.
    await client.query('set session characteristics as transaction read only');

    const catalogue = await client.query<{ reachable: AnonCatalogueEntry[] }>(ANON_CATALOGUE_QUERY);
    const exposure = await client.query<LeadExposureRow>(LEAD_EXPOSURE_QUERY);

    return {
      reachable: catalogue.rows[0]?.reachable ?? [],
      exposure: exposure.rows,
    };
  } finally {
    await client.end();
  }
}

// ---------------------------------------------------------------------------
// The live checks.
// ---------------------------------------------------------------------------

describe.skipIf(!connectionString)('live database', () => {
  it('grants anon nothing beyond supabase/anon-access-allowlist.ts', async () => {
    const { reachable } = await readLiveCatalogue();

    const { findings, stale } = diffAnonAccess(reachable);

    for (const key of stale) {
      // eslint-disable-next-line no-console
      console.log(
        `[anon-access] allowlist entry no longer reachable by anon: ${key}. The database got tighter; trim the allowlist.`
      );
    }

    expect(findings, describeAnonAccessFindings(findings)).toEqual([]);
  }, 45_000);

  it('keeps every lead-bearing table closed to the public anon key', async () => {
    const { exposure } = await readLiveCatalogue();

    const findings = findLeadExposure(exposure);

    expect(findings, describeLeadExposure(findings)).toEqual([]);
  }, 45_000);
});

describe.runIf(!connectionString)('live database', () => {
  it.skip(`is not checked: ${SKIP_REASON}`, () => {
    // Intentionally empty. The name carries the message, so a skipped run says
    // why it skipped rather than passing quietly.
  });
});

// ---------------------------------------------------------------------------
// Rules about the allowlist itself. These need no database and always run.
// ---------------------------------------------------------------------------

describe('the allowlist itself', () => {
  it('never blesses a view over lead or contact data', () => {
    const leadBearing = new Set(LEAD_BEARING_RELATIONS);

    const offenders = ANON_ALLOWLIST.filter(
      (entry) =>
        (entry.kind === 'view' || entry.kind === 'materialized view') && leadBearing.has(entry.name)
    ).map((entry) => `${entry.kind} ${entry.name}`);

    expect(
      offenders,
      `These carry lead or contact data and must never be allowlisted as anon-readable views: ${offenders.join(', ')}. A view runs with its owner rights and steps past the row level security that is the only control on these tables. If the live database has one, write a migration that drops it or revokes anon. Do not add it here.`
    ).toEqual([]);
  });

  it('never blesses SELECT on a lead-bearing relation through a view of another name', () => {
    // A view does not have to be called `contacts` to expose it. Any view at all
    // in this schema is a review trigger, because there are currently none and
    // the site has never needed one.
    const views = ANON_ALLOWLIST.filter(
      (entry) => entry.kind === 'view' || entry.kind === 'materialized view'
    ).map((entry) => entry.name);

    expect(
      views,
      `This schema has no views and the site needs none, so an allowlisted anon-readable view is a decision that needs a human: ${views.join(', ')}. Confirm it selects nothing from ${LEAD_BEARING_RELATIONS.join(', ')} before allowing it.`
    ).toEqual([]);
  });

  it('gives every entry a reason and at least one privilege', () => {
    for (const entry of ANON_ALLOWLIST) {
      expect(
        entry.why.trim().length,
        `${entry.kind} ${entry.name} has no reason recorded`
      ).toBeGreaterThan(0);
      expect(
        entry.privileges.length,
        `${entry.kind} ${entry.name} is allowlisted with no privileges, so it should be removed`
      ).toBeGreaterThan(0);
    }
  });

  it('never allowlists an open item, because that would bless it', () => {
    const allowed = new Set(ANON_ALLOWLIST.map((entry) => `${entry.kind} ${entry.name}`));
    for (const item of ANON_OPEN_ITEMS) {
      expect(
        allowed.has(`${item.kind} ${item.name}`),
        `${item.kind} ${item.name} is recorded as an unresolved open item and must not appear in ANON_ALLOWLIST`
      ).toBe(false);
    }
  });
});

// ---------------------------------------------------------------------------
// The comparison rules, proven with fixtures so they hold even when the live
// check skips. Without these, an offline run proves nothing at all.
// ---------------------------------------------------------------------------

const fixtureAllowlist = [
  { kind: 'table' as const, name: 'polls', privileges: ['SELECT'], why: 'fixture' },
];

describe('diffAnonAccess', () => {
  it('passes when the live state matches the allowlist', () => {
    const { findings, stale } = diffAnonAccess(
      [{ kind: 'table', name: 'polls', privileges: ['SELECT'] }],
      fixtureAllowlist,
      []
    );

    expect(findings).toEqual([]);
    expect(stale).toEqual([]);
  });

  it('names an object anon reaches that is not allowlisted', () => {
    const { findings } = diffAnonAccess(
      [
        { kind: 'table', name: 'polls', privileges: ['SELECT'] },
        { kind: 'view', name: 'contacts_public', privileges: ['SELECT'] },
      ],
      fixtureAllowlist,
      []
    );

    expect(findings).toHaveLength(1);
    expect(findings[0].problem).toBe('unlisted');
    expect(findings[0].name).toBe('contacts_public');
    expect(describeAnonAccessFindings(findings)).toContain('contacts_public');
  });

  it('names a listed object whose privileges have widened', () => {
    const { findings } = diffAnonAccess(
      [{ kind: 'table', name: 'polls', privileges: ['SELECT', 'UPDATE', 'DELETE'] }],
      fixtureAllowlist,
      []
    );

    expect(findings).toHaveLength(1);
    expect(findings[0].problem).toBe('widened');
    expect(findings[0].extraPrivileges).toEqual(['DELETE', 'UPDATE']);
  });

  it('does not let a function overload hide behind a sibling with the same name', () => {
    const { findings } = diffAnonAccess(
      [
        { kind: 'function', name: 'f(a uuid)', privileges: ['EXECUTE'] },
        { kind: 'function', name: 'f(a uuid, b text)', privileges: ['EXECUTE'] },
      ],
      [{ kind: 'function', name: 'f(a uuid)', privileges: ['EXECUTE'], why: 'fixture' }],
      []
    );

    expect(findings).toHaveLength(1);
    expect(findings[0].name).toBe('f(a uuid, b text)');
  });

  it('still fails on a known open item, but says it is known', () => {
    const { findings } = diffAnonAccess(
      [{ kind: 'function', name: 'stray(x jsonb)', privileges: ['EXECUTE'] }],
      [],
      [
        {
          kind: 'function',
          name: 'stray(x jsonb)',
          why: 'reviewed, revoke pending an owner decision',
        },
      ]
    );

    expect(findings, 'an open item must still fail the test, not be excused by it').toHaveLength(1);
    expect(findings[0].knownOpenItem).toBe('reviewed, revoke pending an owner decision');
    expect(describeAnonAccessFindings(findings)).toContain('revoke pending an owner decision');
  });

  it('reports an allowlist entry the database no longer grants', () => {
    const { findings, stale } = diffAnonAccess([], fixtureAllowlist, []);

    expect(findings, 'a tighter database is not a failure').toEqual([]);
    expect(stale).toEqual(['table polls']);
  });
});

describe('findLeadExposure', () => {
  const closed: LeadExposureRow[] = LEAD_BEARING_RELATIONS.map((name) => ({
    name,
    rls_enabled: true,
    anon_select_policies: 0,
  }));

  it('passes when every lead table has RLS on and no anon SELECT policy', () => {
    expect(findLeadExposure(closed)).toEqual([]);
  });

  it('fails, naming the table, when RLS is switched off on a lead table', () => {
    const rows = closed.map((row) =>
      row.name === 'contacts' ? { ...row, rls_enabled: false } : row
    );

    const findings = findLeadExposure(rows);

    expect(findings).toHaveLength(1);
    expect(findings[0].name).toBe('contacts');
    expect(describeLeadExposure(findings)).toContain('contacts');
  });

  it('fails, naming the table, when a policy opens a lead table to anon', () => {
    const rows = closed.map((row) =>
      row.name === 'polls' ? { ...row, anon_select_policies: 1 } : row
    );

    const findings = findLeadExposure(rows);

    expect(findings).toHaveLength(1);
    expect(findings[0].name).toBe('polls');
    expect(findings[0].reason).toContain('SELECT path');
  });

  it('ignores a table that is not in the database being checked', () => {
    expect(findLeadExposure([], ['contacts'])).toEqual([]);
  });

  it('ignores a table that carries no lead data', () => {
    const rows: LeadExposureRow[] = [
      { name: 'poll_rate_limits', rls_enabled: false, anon_select_policies: 2 },
    ];

    expect(findLeadExposure(rows)).toEqual([]);
  });
});
