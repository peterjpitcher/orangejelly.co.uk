import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, realpathSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * What the language gates are allowed to read.
 *
 * Both gates are rules about published copy, but lint-staged hands them every staged
 * `js,jsx,ts,tsx,json,md` file, so their own filters are the only thing keeping them
 * off internal working files. That went wrong: on 8 September 2026 the growth gate
 * blocked a keyword-plan run over 34 instances of "save" in operator instructions,
 * and an earlier evidence note had already been written around it rather than quote
 * the words it was describing.
 *
 * Scope is therefore behaviour, not housekeeping, and it is tested the same way the
 * positioning gate is: build a fixture tree, run the checker against it, assert on
 * the exit code, which is the only thing the commit actually cares about.
 */
const GROWTH = join(process.cwd(), 'scripts/check-growth-language.mjs');
const BRITISH = join(process.cwd(), 'scripts/check-british-english.mjs');

type Result = { code: number; output: string };

/*
 * `args` defaults to the fixture's own files, which is what lint-staged does. It is
 * spelled separately so a test can pass absolute paths, because lint-staged passes
 * absolute paths and a scope check that only understands relative ones would let
 * every staged file straight through.
 */
function runOn(script: string, files: Record<string, string>, args?: (dir: string) => string[]) {
  // realpath, because on macOS `tmpdir()` is a symlink and the child's `process.cwd()`
  // is the resolved path. Without this every absolute argument reads as outside the
  // repo root and the scope check drops it, which would make these tests pass by
  // skipping the file rather than by scoping it.
  const dir = realpathSync(mkdtempSync(join(tmpdir(), 'oj-language-gate-')));
  try {
    for (const [name, content] of Object.entries(files)) {
      const target = join(dir, name);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, content);
    }
    const output = execFileSync('node', [script, ...(args ? args(dir) : Object.keys(files))], {
      cwd: dir,
      encoding: 'utf8',
    });
    return { code: 0, output } satisfies Result;
  } catch (error) {
    const failure = error as { status?: number; stdout?: string; stderr?: string };
    return {
      code: failure.status ?? 1,
      output: `${failure.stdout ?? ''}${failure.stderr ?? ''}`,
    } satisfies Result;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

describe('the growth-language gate', () => {
  it('still fails banned language in src/', () => {
    // Not one of the script's own FILE_TARGETS, so this proves the staged-file path
    // rather than the always-on sweep.
    const result = runOn(GROWTH, {
      'src/components/Offer.tsx': 'export const copy = "We save you money every month.";',
    });
    expect(result.code).toBe(1);
    expect(result.output).toContain('src/components/Offer.tsx');
  });

  it('still fails banned language in content/', () => {
    // `content/blog` is outside DIRECTORY_TARGETS for the same reason as above.
    const result = runOn(GROWTH, {
      'content/blog/margins.md': 'Cut your costs and bank the savings.',
    });
    expect(result.code).toBe(1);
    expect(result.output).toContain('content/blog/margins.md');
  });

  it('still fails a staged file handed over as an absolute path', () => {
    // lint-staged passes absolute paths. A scope check that reads them as
    // out-of-repo would silently stop gating everything.
    const result = runOn(
      GROWTH,
      { 'content/blog/margins.md': 'Cut your costs and bank the savings.' },
      (dir) => [join(dir, 'content/blog/margins.md')]
    );
    expect(result.code).toBe(1);
  });

  it('passes a tasks/ file that tells an operator to save a download', () => {
    /*
     * The exact shape that blocked the 8 September 2026 keyword-plan run. It is an
     * instruction to a person about writing a file to disk, not an offer to a
     * customer, and no reader outside the team ever sees it.
     */
    const result = runOn(GROWTH, {
      'tasks/keyword-plan/runs/2026-09-08-01-setup/request.md':
        'Save as `raw/gsc-month-all.zip`, then save the second export alongside it.',
    });
    expect(result.code).toBe(0);
  });

  it('passes an internal report that quotes the rule it is describing', () => {
    // `docs/reports/` is working material too, and a note about the gate has to be
    // able to name the words the gate bans.
    const result = runOn(GROWTH, {
      'docs/reports/language-audit.md': 'We removed the word savings from the offer page.',
    });
    expect(result.code).toBe(0);
  });
});

describe('the growth-language gate and developer-facing strings', () => {
  it('passes a console call that mentions saving to storage', () => {
    /*
     * The last false positive on the published surface after the scope was narrowed.
     * A console string goes to devtools, not to a page, so it is no more customer
     * copy than the comment above it.
     */
    const result = runOn(GROWTH, {
      'src/contexts/Store.tsx':
        "try { write(); } catch (error) { console.error('Failed to save state:', error); }",
    });
    expect(result.code).toBe(0);
  });

  it('still fails real copy sitting beside a console call', () => {
    // The risk in blanking a call is blanking past the end of it. This is the test
    // that would catch that, because the offer is on the very next statement.
    const result = runOn(GROWTH, {
      'src/components/Offer.tsx':
        "console.error('Failed to save state:', error);\nexport const copy = 'We save you money.';",
    });
    expect(result.code).toBe(1);
    expect(result.output).toContain('src/components/Offer.tsx');
  });

  it('does not let a bracket inside a console string close the call early', () => {
    // `console.error('oops :)')` would end the call at the smiley if quote state were
    // not tracked inside it, and everything after would be scanned as copy.
    const result = runOn(GROWTH, {
      'src/components/Smiley.tsx':
        "console.error('oops :) saving', wrap(inner));\nexport const ok = 1;",
    });
    expect(result.code).toBe(0);
  });

  it('does not treat an identifier ending in console as a console call', () => {
    const result = runOn(GROWTH, {
      'src/lib/logger.tsx': "myconsole.log('We save you money.');",
    });
    expect(result.code).toBe(1);
  });

  it('reports the right line number after a console call', () => {
    // Blanking has to preserve newlines, or every line number after it is wrong.
    const result = runOn(GROWTH, {
      'src/components/Multi.tsx':
        "console.error(\n  'Failed to save state:',\n  error\n);\nexport const copy = 'We save you money.';",
    });
    expect(result.code).toBe(1);
    expect(result.output).toContain('src/components/Multi.tsx:5:');
  });
});

describe('the British English gate', () => {
  it('still fails an American spelling in content/', () => {
    const result = runOn(BRITISH, {
      'content/blog/pricing.md': 'We optimize your menu.',
    });
    expect(result.code).toBe(1);
    expect(result.output).toContain('content/blog/pricing.md');
  });

  it('passes a tasks/ file containing the same spelling', () => {
    const result = runOn(BRITISH, {
      'tasks/keyword-plan/runs/2026-09-08-01-setup/request.md': 'Optimize the seed list first.',
    });
    expect(result.code).toBe(0);
  });

  it('passes src/ code that is correctly American', () => {
    /*
     * Why `src/` is a named page list here and a prefix in the growth gate. Sweeping
     * `src/` would fail on the schema.org `Organization` type, the iCalendar
     * `ORGANIZER` property and Next.js `optimization` keys, none of which are
     * spelling mistakes and none of which a customer reads.
     */
    const result = runOn(BRITISH, {
      'src/components/StructuredData.tsx': 'export const schema = { "@type": "Organization" };',
    });
    expect(result.code).toBe(0);
  });
});
