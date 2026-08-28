import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { PHASE_4_REDIRECTS } from '@/lib/route-manifest';

/**
 * The launch checklist.
 *
 * A hand-written checklist describes the release somebody remembered, not the one
 * the code performs. This one is generated from the manifest, so what needs
 * checking is that it stays generated and stays current: a stale checked-in copy is
 * exactly as misleading as a hand-written one.
 */
const GENERATED = execFileSync('node', [join(process.cwd(), 'scripts/launch-checklist.mjs')], {
  encoding: 'utf8',
});
const COMMITTED = readFileSync(join(process.cwd(), 'tasks/repositioning/LAUNCH-CHECKLIST.md'), 'utf8');

describe('the launch checklist', () => {
  it('is current', () => {
    // Regenerate with `npm run launch:checklist` when this fails. It failing means
    // the release changed and the document describing it did not.
    expect(COMMITTED.trim()).toBe(GENERATED.trim());
  });

  it('lists every redirect the release turns on', () => {
    for (const redirect of PHASE_4_REDIRECTS) {
      expect(GENERATED).toContain(`\`${redirect.path}\``);
    }
  });

  it('names what the release commit contains, and that it is only that', () => {
    expect(GENERATED).toMatch(/ACTIVE_PHASES.{0,60}gains `phase4`\. One line\./s);
    expect(GENERATED).toMatch(/Nothing else\./);
  });

  it('carries a rollback with a trigger, an action and an owner', () => {
    expect(GENERATED).toMatch(/\*\*Trigger:\*\*/);
    expect(GENERATED).toMatch(/\*\*Action:\*\* revert the release commit/);
    expect(GENERATED).toMatch(/\*\*Owner:\*\* Peter Pitcher/);
  });

  it('says what is deliberately not a rollback trigger', () => {
    // Without this somebody reverts on day two because a ranking moved, which
    // costs more authority than the consolidation was ever going to.
    expect(GENERATED).toMatch(/\*\*Not a trigger:\*\* a ranking movement/);
  });

  it('tells the reader to verify against production, not against the manifest', () => {
    expect(GENERATED).toMatch(/proves this against the declaration; this proves\s+it against production/);
    expect(GENERATED).toMatch(/curl -sIL/);
  });
});
