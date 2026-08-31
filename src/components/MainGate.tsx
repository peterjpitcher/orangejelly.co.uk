/**
 * The typeface scope, wrapped around everything the layout renders.
 *
 * WHAT THIS USED TO BE. A gate. The root layout opened `<main id="main-content">`
 * around its children, which was right while most of the site ran on the legacy
 * templates and rendered page content only. The repositioned pages render their own
 * header and footer, so their content cannot sit inside a main opened before the
 * header, and they declare their own. This component decided which got which, and
 * getting it wrong meant two main landmarks: a WCAG 1.3.1 failure that no
 * page-level axe sweep can see, because the sweep scans the page component and
 * never the layout around it.
 *
 * There is nothing left to decide. Phase 4 retired the last fifteen legacy pages on
 * 31 August 2026 and the component gallery moved onto the new system the same day,
 * so every route now opens its own `<main>`: the marketing pages, the guides,
 * /admin, the seven /availability screens, /privacy, the error pages and
 * `not-found.tsx`. Checked one by one before this was simplified rather than
 * assumed, because the skip link at the top of every page targets that id and a
 * page without one silently breaks it.
 *
 * What remains is the other thing the gate carried: `oj-root`, the class the
 * repositioned typeface hangs on. Nothing here reads the pathname any more, so this
 * no longer needs to be a client component and could move into the layout as a plain
 * element next time somebody is in that file.
 *
 * `ChromeGate`, `LegacyChrome`, `legacy-routes.ts`, `NavigationWrapper` and
 * `FooterWrapper` were deleted alongside this. They existed to serve the old header
 * and footer to pages that no longer exist.
 */
export default function MainGate({ children }: { children: React.ReactNode }): JSX.Element {
  /*
   * `oj-root` sits here rather than on `<body>` because it has to be inside the body
   * element the layout renders, and the typeface has to reach the header and footer
   * that each page brings with it. See `.oj-root` in globals.css.
   */
  return <div className="oj-root">{children}</div>;
}
