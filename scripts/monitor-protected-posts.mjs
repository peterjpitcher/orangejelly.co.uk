#!/usr/bin/env node

/**
 * Weekly check on the thirty protected posts.
 *
 * These carry 95% of the blog's clicks and the blog carries 92.9% of the site's.
 * Phase 4 changes what surrounds them, so for eight weeks afterwards somebody has
 * to actually look, and looking at a 1,000-row GSC export by eye is how a slow
 * decline goes unnoticed until it is a fast one.
 *
 * Usage:
 *   npm run monitor:posts -- tasks/repositioning/data/gsc-orangejelly-2026-10-20/Pages.csv
 *
 * There is no API access here, only CSV exports, so this takes the export as an
 * argument rather than fetching. Export "Pages" for the last 12 months from Search
 * Console, at the same 12-month window as the baseline, or the comparison is
 * meaningless.
 *
 * @see tasks/repositioning/data/baselines/protected-posts-2026-08-27.json
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const BASELINE = 'tasks/repositioning/data/baselines/protected-posts-2026-08-27.json';

/** A drop worth interrupting somebody about, rather than noise. */
const ALERT = {
  clicksDropPct: 30,
  positionWorsenBy: 3,
  impressionsDropPct: 40,
};

function parseCsv(text) {
  const [header, ...rows] = text.trim().split('\n');
  const columns = header.split(',').map((c) => c.trim());
  return rows.map((row) => {
    // GSC exports do not quote URLs or numbers, so a plain split is safe here.
    const cells = row.split(',');
    return Object.fromEntries(columns.map((c, i) => [c, cells[i]]));
  });
}

const toNumber = (value) => Number(String(value ?? '').replace(/[%,]/g, '')) || 0;

function pct(now, before) {
  if (!before) return now > 0 ? 100 : 0;
  return Math.round(((now - before) / before) * 100);
}

async function run() {
  const exportPath = process.argv[2];
  if (!exportPath) {
    console.error('Usage: npm run monitor:posts -- <path to GSC Pages.csv>');
    console.error(`Baseline: ${BASELINE}`);
    process.exit(2);
  }

  const baseline = JSON.parse(await fs.readFile(path.join(ROOT, BASELINE), 'utf8'));
  const rows = parseCsv(await fs.readFile(path.resolve(ROOT, exportPath), 'utf8'));

  // GSC gives absolute URLs; the baseline holds paths.
  const byPath = new Map();
  for (const row of rows) {
    const url = row['Top pages'] ?? row.Page ?? row.URL ?? '';
    try {
      byPath.set(new URL(url).pathname.replace(/\/$/, ''), row);
    } catch {
      byPath.set(String(url).replace(/\/$/, ''), row);
    }
  }

  const protectedPosts = baseline.posts.filter((post) =>
    ['1-critical', '2-protected'].includes(post.tier)
  );

  const alerts = [];
  const gone = [];
  const lines = [];

  for (const post of protectedPosts) {
    const row = byPath.get(post.url);
    if (!row) {
      gone.push(post.url);
      continue;
    }

    const now = {
      clicks: toNumber(row.Clicks),
      impressions: toNumber(row.Impressions),
      position: toNumber(row.Position),
    };
    const before = post.search;
    const clicksPct = pct(now.clicks, before.clicks);
    const imprPct = pct(now.impressions, toNumber(before.impressions));
    const positionDelta = Math.round((now.position - before.position) * 100) / 100;

    const bad =
      clicksPct <= -ALERT.clicksDropPct ||
      imprPct <= -ALERT.impressionsDropPct ||
      positionDelta >= ALERT.positionWorsenBy;

    if (bad) {
      alerts.push({ url: post.url, tier: post.tier, clicksPct, imprPct, positionDelta, now, before });
    }

    lines.push(
      `${bad ? '!' : ' '} ${post.url.padEnd(52)} ` +
        `clicks ${String(before.clicks).padStart(4)} -> ${String(now.clicks).padStart(4)} ` +
        `(${clicksPct >= 0 ? '+' : ''}${clicksPct}%)  ` +
        `pos ${before.position.toFixed(1)} -> ${now.position.toFixed(1)} ` +
        `(${positionDelta >= 0 ? '+' : ''}${positionDelta})`
    );
  }

  console.log(`\nProtected posts against the ${baseline.capturedAt} baseline\n`);
  console.log(lines.join('\n'));

  if (gone.length > 0) {
    console.log(`\nNOT IN THE EXPORT (${gone.length}). Either no impressions at all, or the URL moved:`);
    for (const url of gone) console.log(`  ${url}`);
  }

  console.log(
    `\n${alerts.length} of ${protectedPosts.length} moved enough to look at ` +
      `(clicks -${ALERT.clicksDropPct}%, impressions -${ALERT.impressionsDropPct}%, ` +
      `or position +${ALERT.positionWorsenBy}).`
  );

  if (alerts.length > 0) {
    console.log('\nWorth looking at:');
    for (const alert of alerts) {
      console.log(`  ${alert.url} (${alert.tier})`);
      console.log(
        `    clicks ${alert.clicksPct}%, impressions ${alert.imprPct}%, position ${alert.positionDelta >= 0 ? '+' : ''}${alert.positionDelta}`
      );
    }
    console.log(
      '\nA position move on its own is usually seasonal or a SERP change rather than\n' +
        'something we did. Clicks and impressions falling together on a post whose\n' +
        'content did not change is the pattern worth chasing.\n'
    );
  }

  // Deliberately exits 0 even with alerts. This is a report somebody reads, not a
  // gate: failing a build over a ranking wobble would train everyone to ignore it.
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
