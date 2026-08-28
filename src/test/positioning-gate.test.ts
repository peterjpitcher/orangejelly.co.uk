import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * The positioning gate, tested by running it.
 *
 * A gate nobody has watched fail is not a gate. These build a small fixture tree,
 * point the checker at it and assert on the exit code, which is the only thing the
 * build actually cares about.
 */
const SCRIPT = join(process.cwd(), 'scripts/check-positioning.mjs');

function runOn(files: Record<string, string>): { code: number; output: string } {
  const dir = mkdtempSync(join(tmpdir(), 'oj-positioning-'));
  try {
    // The checker walks a fixed surface list relative to cwd, so the fixture is
    // written into the same shape it expects to find.
    const appDir = join(dir, 'src/app');
    execFileSync('mkdir', [
      '-p',
      join(appDir, 'about'),
      join(dir, 'src/lib'),
      join(dir, 'content/data'),
    ]);
    for (const [name, content] of Object.entries(files)) {
      writeFileSync(join(dir, name), content);
    }
    const output = execFileSync('node', [SCRIPT], { cwd: dir, encoding: 'utf8' });
    return { code: 0, output };
  } catch (error) {
    const failure = error as { status?: number; stdout?: string; stderr?: string };
    return { code: failure.status ?? 1, output: `${failure.stdout ?? ''}${failure.stderr ?? ''}` };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

describe('the positioning gate', () => {
  it('passes a page that describes the company by what it does', () => {
    const result = runOn({
      'src/app/about/page.tsx': 'export const copy = "Growth partner for ambitious businesses.";',
    });
    expect(result.code).toBe(0);
  });

  it('fails a page that describes the company by its sector', () => {
    const result = runOn({
      'src/app/about/page.tsx': 'export const copy = "A hospitality marketing agency.";',
    });
    expect(result.code).toBe(1);
    expect(result.output).toMatch(/old position/);
  });

  it('fails a published price', () => {
    const result = runOn({
      'src/app/about/page.tsx': 'export const copy = "Packages from £375 + VAT.";',
    });
    expect(result.code).toBe(1);
    expect(result.output).toMatch(/published price/);
  });

  it('does not fail a small amount that is plainly not a fee for our work', () => {
    // The looser rule caught "£2" in a sample quiz-night message, which is a pub's
    // entry fee in example content. A gate that cries wolf gets switched off.
    const result = runOn({
      'src/app/about/page.tsx': 'export const copy = "£2 entry, winning team gets a round.";',
    });
    expect(result.code).toBe(0);
  });

  it('fails a retired package name', () => {
    const result = runOn({
      'src/app/about/page.tsx': 'export const copy = "Start with a Growth Fix.";',
    });
    expect(result.code).toBe(1);
    expect(result.output).toMatch(/retired package/);
  });

  it('fails a response-time promise', () => {
    const result = runOn({
      'src/app/about/page.tsx': 'export const copy = "We reply within 24 hours.";',
    });
    expect(result.code).toBe(1);
    expect(result.output).toMatch(/response-time promise/);
  });

  it('fails priceRange in structured data', () => {
    const result = runOn({
      'src/app/about/page.tsx': 'export const schema = { priceRange: "££" };',
    });
    expect(result.code).toBe(1);
  });

  it('does not fail a comment or a test that names the banned thing', () => {
    // Otherwise the gate fails on its own rules, on the comment explaining why
    // priceRange was removed, and on every test asserting a price is absent.
    const result = runOn({
      'src/app/about/page.tsx': [
        '// priceRange is deliberately absent, see D3.',
        '/* No hospitality marketing here. */',
        'expect(text).not.toMatch(/£375/);',
      ].join('\n'),
    });
    expect(result.code).toBe(0);
  });
});

describe('the real repository', () => {
  it('passes', () => {
    // This is the assertion that matters. It runs the gate over the actual
    // surfaces, so a violation introduced anywhere in them fails here as well as
    // in the build.
    expect(() => execFileSync('node', [SCRIPT], { cwd: process.cwd() })).not.toThrow();
  });
});
