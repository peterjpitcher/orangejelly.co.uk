/**
 * A Robots Exclusion Protocol matcher, so a test can ask the question Google asks.
 *
 * WHY THIS EXISTS. The obvious way to gate `src/app/robots.ts` is to assert that the
 * disallow array does not contain `/_next/`. That check passes for a file that still
 * blocks every stylesheet on the site, because `/*_next*` and a `Googlebot`-specific
 * group both block the same URLs without the string `/_next/` ever appearing in the
 * array being inspected. Membership in a list is not the question. The question is
 * whether a named crawler, reading the serialised file, may fetch a given URL.
 *
 * Implemented from RFC 9309 and Google's documented extensions, deliberately without a
 * dependency: this runs in a test and in `scripts/synthetic-check.mjs`, and neither
 * place should pull a package in to answer a question this small.
 *
 * The rules that matter, and the ones an ad-hoc implementation usually gets wrong:
 *
 * - Patterns are prefixes, not path segments. `/icon` blocks `/icon.png`, and because
 *   the match runs against `pathname + search` it also blocks `/icon.png?<hash>`. That
 *   is exactly how the old `Disallow: /icon` rule took the site's only favicon out of
 *   Google's reach.
 * - `*` is a wildcard and a trailing `$` anchors to the end of the path.
 * - The longest matching pattern wins, not the first one, and on an exact length tie an
 *   allow beats a disallow.
 * - An empty `Disallow:` value is a no-op, not a rule matching everything.
 * - Consecutive `User-agent` lines share one group of rules.
 *
 * @see tasks/gsc-indexing/SPEC.md section 4, P1
 */

/** @typedef {{ type: 'allow' | 'disallow', value: string }} RobotsRule */
/** @typedef {{ agents: string[], rules: RobotsRule[] }} RobotsGroup */
/** @typedef {{ allowed: boolean, target: string, rule: string | null, agents: string[] }} RobotsVerdict */

/**
 * Only these three fields belong to a group. `Sitemap` and `Host` are file-level lines
 * and must not end the run of consecutive `User-agent` lines that opens a group.
 */
const RULE_FIELDS = new Set(['allow', 'disallow', 'crawl-delay']);

/** Compiled patterns, keyed by the raw pattern text. Cheap, and this runs per URL. */
const patternCache = new Map();

/**
 * Parse a robots.txt file into its groups, in file order.
 *
 * @param {string} text
 * @returns {RobotsGroup[]}
 */
export function parseRobots(text) {
  /** @type {RobotsGroup[]} */
  const groups = [];
  /** @type {RobotsGroup | null} */
  let current = null;
  // True while the last group line seen was a `User-agent`, which is what makes
  // consecutive agent lines share one group rather than opening a new one each time.
  let collectingAgents = false;

  for (const rawLine of String(text).split(/\r?\n/)) {
    const line = rawLine.split('#')[0].trim();
    if (!line) continue;

    const separator = line.indexOf(':');
    if (separator === -1) continue;

    const field = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();

    if (field === 'user-agent') {
      if (!current || !collectingAgents) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      if (value) current.agents.push(value);
      collectingAgents = true;
      continue;
    }

    if (!RULE_FIELDS.has(field)) continue;

    collectingAgents = false;
    // Rules before the first `User-agent` line belong to no group, so they bind nobody.
    if (!current) continue;
    if (field === 'crawl-delay') continue;
    // An empty value is how a file says "no restriction". Treating it as a pattern
    // would make it match every path, which is the opposite of what it means.
    if (!value) continue;

    current.rules.push({ type: /** @type {'allow' | 'disallow'} */ (field), value });
  }

  return groups;
}

/**
 * Pick the group that governs a crawler: the longest matching specific agent token,
 * falling back to the `*` group, falling back to nothing at all.
 *
 * A group token matches when the crawler's name starts with it, case-insensitively, so
 * a `Googlebot` group governs `Googlebot-Image` unless a longer token claims it first.
 *
 * @param {RobotsGroup[]} groups
 * @param {string} userAgent
 * @returns {RobotsGroup | null}
 */
export function selectGroup(groups, userAgent = '*') {
  const wanted = String(userAgent).toLowerCase();
  /** @type {RobotsGroup | null} */
  let best = null;
  let bestLength = -1;
  /** @type {RobotsGroup | null} */
  let wildcard = null;

  for (const group of groups) {
    for (const agent of group.agents) {
      const token = agent.toLowerCase();
      if (token === '*') {
        if (!wildcard) wildcard = group;
        continue;
      }
      if (wanted.startsWith(token) && token.length > bestLength) {
        best = group;
        bestLength = token.length;
      }
    }
  }

  return best ?? wildcard ?? null;
}

/**
 * Compile a robots pattern to an anchored regular expression.
 *
 * @param {string} pattern
 * @returns {RegExp}
 */
function compile(pattern) {
  const cached = patternCache.get(pattern);
  if (cached) return cached;

  const anchored = pattern.endsWith('$');
  const body = anchored ? pattern.slice(0, -1) : pattern;
  const source = body
    .split('*')
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*');

  const compiled = new RegExp(`^${source}${anchored ? '$' : ''}`);
  patternCache.set(pattern, compiled);
  return compiled;
}

/**
 * Reduce a URL or path to what robots patterns are matched against: the path plus the
 * query string. The query is included on purpose. Without it `/icon` would not block
 * `/icon.png?9e068de9ff0ddf0e`, which is the URL the pages actually link to.
 *
 * @param {string} url
 * @returns {string}
 */
function targetOf(url) {
  // The base only exists so a bare path parses; it is never compared against anything.
  const parsed = new URL(String(url), 'https://robots.invalid');
  return `${parsed.pathname}${parsed.search}`;
}

/**
 * Decide whether a crawler may fetch a URL, and say which line decided it.
 *
 * `rule` is the deciding line as it would read in the file, for example
 * `Disallow: /_next/`, or null when nothing matched and the URL is allowed by default.
 *
 * @param {string} text robots.txt contents
 * @param {string} url an absolute URL or a path
 * @param {string} [userAgent]
 * @returns {RobotsVerdict}
 */
export function explain(text, url, userAgent = '*') {
  const target = targetOf(url);
  const group = selectGroup(parseRobots(text), userAgent);

  if (!group) {
    return { allowed: true, target, rule: null, agents: [] };
  }

  /** @type {RobotsRule | null} */
  let decision = null;

  for (const rule of group.rules) {
    if (!compile(rule.value).test(target)) continue;
    if (!decision) {
      decision = rule;
      continue;
    }
    if (rule.value.length > decision.value.length) {
      decision = rule;
      continue;
    }
    // A tie on length goes to the allow, which is how a narrow allow carves an
    // exception out of a disallow of the same width.
    if (
      rule.value.length === decision.value.length &&
      rule.type === 'allow' &&
      decision.type === 'disallow'
    ) {
      decision = rule;
    }
  }

  return {
    allowed: !decision || decision.type === 'allow',
    target,
    rule: decision
      ? `${decision.type === 'allow' ? 'Allow' : 'Disallow'}: ${decision.value}`
      : null,
    agents: [...group.agents],
  };
}

/**
 * @param {string} text robots.txt contents
 * @param {string} url an absolute URL or a path
 * @param {string} [userAgent]
 * @returns {boolean}
 */
export function isAllowed(text, url, userAgent = '*') {
  return explain(text, url, userAgent).allowed;
}
