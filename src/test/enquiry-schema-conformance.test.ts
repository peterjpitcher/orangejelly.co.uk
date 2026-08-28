import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { LEAD_STATES } from '@/lib/schemas/enquiry';

/**
 * The code that writes, against the database that receives.
 *
 * This is the automatable half of the end-to-end check. The other half, an actual
 * submission through the live form against production Supabase and Resend, is on
 * the launch checklist as a human step, because it creates a real lead and sends
 * real mail and neither belongs in a test run.
 *
 * What this catches is the failure that would otherwise be found by a stranger
 * trying to enquire: the code writing a column the database does not have. Supabase
 * returns an error the action correctly turns into "something went wrong", the row
 * is never written, and nothing anywhere says why.
 *
 * The snapshot was taken from information_schema against production on 28 August
 * 2026, after the migrations. Regenerate it with:
 *
 *   select table_name, column_name, data_type, is_nullable
 *   from information_schema.columns
 *   where table_name in ('contacts','conversion_events')
 *   order by table_name, column_name;
 */
interface Column {
  type: string;
  nullable: boolean;
}

const SCHEMA = JSON.parse(
  readFileSync(join(process.cwd(), 'tasks/repositioning/data/production-schema-2026-08-28.json'), 'utf8')
) as {
  contacts: Record<string, Column>;
  conversion_events: Record<string, Column>;
  constraints: Record<string, string>;
};

const SOURCE = readFileSync(join(process.cwd(), 'src/lib/db/enquiries.ts'), 'utf8');

/**
 * Column names the writer actually sends, read out of the source.
 *
 * Shorthand properties count: `id,` on its own line is still a column being
 * written, and missing it would let this test pass while the insert omitted a
 * NOT NULL column.
 */
function columnsWritten(between: string, and: string): string[] {
  const start = SOURCE.indexOf(between);
  const body = SOURCE.slice(start, SOURCE.indexOf(and, start));
  return [...body.matchAll(/^\s+([a-z_]+)\s*[:,]/gm)].map((m) => m[1]);
}

describe('what the enquiry writer sends', () => {
  it('writes only columns that exist on contacts', () => {
    const written = columnsWritten("insert({", '});');
    expect(written.length).toBeGreaterThan(10);

    const missing = written.filter((column) => !(column in SCHEMA.contacts));
    expect(missing).toEqual([]);
  });

  it('writes every column contacts requires', () => {
    // A NOT NULL column with no default that the writer never sets is an insert
    // that fails every time, for everybody.
    const written = new Set(columnsWritten('insert({', '});'));
    const requiredWithoutDefault = ['name', 'email', 'email_normalized', 'id'];
    for (const column of requiredWithoutDefault) {
      expect(SCHEMA.contacts[column]?.nullable, column).toBe(false);
      expect(written.has(column), column).toBe(true);
    }
  });

  it('updates only columns that exist, on step two', () => {
    const written = columnsWritten('.update({', "})");
    expect(written.length).toBeGreaterThan(4);
    const missing = written.filter((column) => !(column in SCHEMA.contacts));
    expect(missing).toEqual([]);
  });

  it('keeps the historic pub columns readable rather than dropping them', () => {
    // Dropping them is a destructive migration and needs separate approval. They
    // stay in the table, stop being written, and the admin view still shows them
    // on the rows that have them.
    for (const legacy of ['pub_name', 'package_interest', 'message', 'phone']) {
      expect(SCHEMA.contacts[legacy], legacy).toBeDefined();
      expect(SCHEMA.contacts[legacy].nullable, `${legacy} must be nullable now`).toBe(true);
    }
  });

  it('agrees with the database about the six lead states', () => {
    // The constraint is the guarantee. This is what stops the TypeScript union and
    // the CHECK drifting apart, which would show up as an insert failing on a value
    // the type system said was fine.
    const check = SCHEMA.constraints.contacts_status_check;
    for (const state of LEAD_STATES) {
      expect(check, state).toContain(`'${state}'`);
    }
    const inConstraint = [...check.matchAll(/'([a-z_]+)'/g)].map((m) => m[1]);
    expect(inConstraint.sort()).toEqual([...LEAD_STATES].sort());
  });

  it('has somewhere to put the conversion events the enquiry path writes', () => {
    for (const column of ['event_name', 'owner_type', 'owner_id', 'properties']) {
      expect(SCHEMA.conversion_events[column], column).toBeDefined();
    }
    expect(SCHEMA.conversion_events.properties.type).toBe('jsonb');
  });
});
