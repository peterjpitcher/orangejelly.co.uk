# Keyword plan request: orangejelly.co.uk (GB), run 2026-09-08-01-setup, mode setup

## Next required input

Total pulls needed now: 39 (26 Search Console exports; 12 Keyword Planner discovery exports; 1 Keyword Planner volume export).

Save everything under `runs/2026-09-08-01-setup/raw/` using the exact folder and file names below. Do not rename, open and re-save, or edit an export.

## Search Console exports

Property: `sc-domain:orangejelly.co.uk`. For every export: Performance, Search results; Search type = Web; Country = United Kingdom; a custom date range with the exact inclusive dates given; keep every tab; Export, Download CSV (this saves a zip of all tabs). Save the zip as `raw/<name>.zip` or its unzipped contents in `raw/<name>/`.

### 1. `raw/gsc-month-all`

Purpose: Property totals and named queries for August 2026 (Chart and Pages complete; Queries a named subset).

1. Open Performance, Search results for property `sc-domain:orangejelly.co.uk`.
2. Filters: Search type = Web; Country = United Kingdom; no query filter; no page filter.
3. Dates: custom range 2026-08-01 to 2026-08-31 (both days included).
4. Export, Download CSV; save as `raw/gsc-month-all.zip` or unzip into `raw/gsc-month-all/`.

### 2. `raw/gsc-3m-all`

Purpose: Property totals and named queries for the trailing three months June 2026 to August 2026.

1. Open Performance, Search results for property `sc-domain:orangejelly.co.uk`.
2. Filters: Search type = Web; Country = United Kingdom; no query filter; no page filter.
3. Dates: custom range 2026-06-01 to 2026-08-31 (both days included).
4. Export, Download CSV; save as `raw/gsc-3m-all.zip` or unzip into `raw/gsc-3m-all/`.

### 3. `raw/gsc-16m-all`

Purpose: Sixteen months of daily totals for site-level seasonality and the incident check (kept whole).

1. Open Performance, Search results for property `sc-domain:orangejelly.co.uk`.
2. Filters: Search type = Web; Country = United Kingdom; no query filter; no page filter.
3. Dates: custom range 2025-05-01 to 2026-08-31 (both days included).
4. Export, Download CSV; save as `raw/gsc-16m-all.zip` or unzip into `raw/gsc-16m-all/`.

### 4. `raw/gsc-3m-q-cl_0001`

Purpose: Named queries for cluster cl_0001 (Website and application build) over the trailing three months; a named subset, not a page total.

1. Open Performance, Search results for property `sc-domain:orangejelly.co.uk`.
2. Filters: Search type = Web; Country = United Kingdom; no page filter; add a Query filter, Custom (regex), Matches regex, using exactly this pattern:

```
(?i)(website|web app|web application|bespoke (application|software)|custom (application|software))
```

3. Dates: custom range 2026-06-01 to 2026-08-31 (both days included).
4. Export, Download CSV; save as `raw/gsc-3m-q-cl_0001.zip` or unzip into `raw/gsc-3m-q-cl_0001/`.

### 5. `raw/gsc-3m-q-cl_0002`

Purpose: Named queries for cluster cl_0002 (Booking systems) over the trailing three months; a named subset, not a page total.

1. Open Performance, Search results for property `sc-domain:orangejelly.co.uk`.
2. Filters: Search type = Web; Country = United Kingdom; no page filter; add a Query filter, Custom (regex), Matches regex, using exactly this pattern:

```
(?i)(booking system|online booking|reservation system|table booking|booking software)
```

3. Dates: custom range 2026-06-01 to 2026-08-31 (both days included).
4. Export, Download CSV; save as `raw/gsc-3m-q-cl_0002.zip` or unzip into `raw/gsc-3m-q-cl_0002/`.

### 6. `raw/gsc-3m-q-cl_0017`

Purpose: Named queries for cluster cl_0017 (Brand) over the trailing three months; a named subset, not a page total.

1. Open Performance, Search results for property `sc-domain:orangejelly.co.uk`.
2. Filters: Search type = Web; Country = United Kingdom; no page filter; add a Query filter, Custom (regex), Matches regex, using exactly this pattern:

```
(?i)orange ?jelly
```

3. Dates: custom range 2026-06-01 to 2026-08-31 (both days included).
4. Export, Download CSV; save as `raw/gsc-3m-q-cl_0017.zip` or unzip into `raw/gsc-3m-q-cl_0017/`.

### 7. `raw/gsc-3m-q-cl_0003`

Purpose: Named queries for cluster cl_0003 (Hospitality websites) over the trailing three months; a named subset, not a page total.

1. Open Performance, Search results for property `sc-domain:orangejelly.co.uk`.
2. Filters: Search type = Web; Country = United Kingdom; no page filter; add a Query filter, Custom (regex), Matches regex, using exactly this pattern:

```
(?i)(pub|bar|restaurant|hospitality) website
```

3. Dates: custom range 2026-06-01 to 2026-08-31 (both days included).
4. Export, Download CSV; save as `raw/gsc-3m-q-cl_0003.zip` or unzip into `raw/gsc-3m-q-cl_0003/`.

### 8. `raw/gsc-3m-q-cl_0004`

Purpose: Named queries for cluster cl_0004 (Pub and hospitality marketing services) over the trailing three months; a named subset, not a page total.

1. Open Performance, Search results for property `sc-domain:orangejelly.co.uk`.
2. Filters: Search type = Web; Country = United Kingdom; no page filter; add a Query filter, Custom (regex), Matches regex, using exactly this pattern:

```
(?i)((pub|bar|hospitality)\b.{0,25}\b(marketing|advertising|agency)|(marketing|advertising|instagram|facebook|content creation|paid social|social video)\b.{0,12}\bfor (pubs|bars))
```

3. Dates: custom range 2026-06-01 to 2026-08-31 (both days included).
4. Export, Download CSV; save as `raw/gsc-3m-q-cl_0004.zip` or unzip into `raw/gsc-3m-q-cl_0004/`.

### 9. `raw/gsc-3m-q-cl_0012`

Purpose: Named queries for cluster cl_0012 (Pub turnaround) over the trailing three months; a named subset, not a page total.

1. Open Performance, Search results for property `sc-domain:orangejelly.co.uk`.
2. Filters: Search type = Web; Country = United Kingdom; no page filter; add a Query filter, Custom (regex), Matches regex, using exactly this pattern:

```
(?i)(fix my pub|struggling pub|pub turnaround|failing pub|quiet pub|empty pub|pub business support)
```

3. Dates: custom range 2026-06-01 to 2026-08-31 (both days included).
4. Export, Download CSV; save as `raw/gsc-3m-q-cl_0012.zip` or unzip into `raw/gsc-3m-q-cl_0012/`.

### 10. `raw/gsc-3m-q-cl_0005`

Purpose: Named queries for cluster cl_0005 (Fractional marketing leadership) over the trailing three months; a named subset, not a page total.

1. Open Performance, Search results for property `sc-domain:orangejelly.co.uk`.
2. Filters: Search type = Web; Country = United Kingdom; no page filter; add a Query filter, Custom (regex), Matches regex, using exactly this pattern:

```
(?i)(fractional|part[- ]time|interim) (cmo|marketing director|marketing lead)
```

3. Dates: custom range 2026-06-01 to 2026-08-31 (both days included).
4. Export, Download CSV; save as `raw/gsc-3m-q-cl_0005.zip` or unzip into `raw/gsc-3m-q-cl_0005/`.

### 11. `raw/gsc-3m-q-cl_0006`

Purpose: Named queries for cluster cl_0006 (Professional services sector) over the trailing three months; a named subset, not a page total.

1. Open Performance, Search results for property `sc-domain:orangejelly.co.uk`.
2. Filters: Search type = Web; Country = United Kingdom; no page filter; add a Query filter, Custom (regex), Matches regex, using exactly this pattern:

```
(?i)(professional services|accountant|solicitor|consultancy)\b.{0,25}\b(website|marketing|application)
```

3. Dates: custom range 2026-06-01 to 2026-08-31 (both days included).
4. Export, Download CSV; save as `raw/gsc-3m-q-cl_0006.zip` or unzip into `raw/gsc-3m-q-cl_0006/`.

### 12. `raw/gsc-3m-q-cl_0007`

Purpose: Named queries for cluster cl_0007 (Pub quiz mechanics) over the trailing three months; a named subset, not a page total.

1. Open Performance, Search results for property `sc-domain:orangejelly.co.uk`.
2. Filters: Search type = Web; Country = United Kingdom; no page filter; add a Query filter, Custom (regex), Matches regex, using exactly this pattern:

```
(?i)((pub )?quiz\b.{0,25}\b(night|round|format|question|answer|topic|scoring|prize|rule|idea)|picture round|quiz night)
```

3. Dates: custom range 2026-06-01 to 2026-08-31 (both days included).
4. Export, Download CSV; save as `raw/gsc-3m-q-cl_0007.zip` or unzip into `raw/gsc-3m-q-cl_0007/`.

### 13. `raw/gsc-3m-q-cl_0008`

Purpose: Named queries for cluster cl_0008 (Pub bingo) over the trailing three months; a named subset, not a page total.

1. Open Performance, Search results for property `sc-domain:orangejelly.co.uk`.
2. Filters: Search type = Web; Country = United Kingdom; no page filter; add a Query filter, Custom (regex), Matches regex, using exactly this pattern:

```
(?i)((pub|music|cash) bingo|bingo\b.{0,20}\b(pub|night|licence|equipment|idea))
```

3. Dates: custom range 2026-06-01 to 2026-08-31 (both days included).
4. Export, Download CSV; save as `raw/gsc-3m-q-cl_0008.zip` or unzip into `raw/gsc-3m-q-cl_0008/`.

### 14. `raw/gsc-3m-q-cl_0009`

Purpose: Named queries for cluster cl_0009 (Pub food and menu profitability) over the trailing three months; a named subset, not a page total.

1. Open Performance, Search results for property `sc-domain:orangejelly.co.uk`.
2. Filters: Search type = Web; Country = United Kingdom; no page filter; add a Query filter, Custom (regex), Matches regex, using exactly this pattern:

```
(?i)((pub|bar|gastropub) (food|menu)|profitable (menu|food|bar food)|menu (idea|profit|margin|cost|engineering)|food (gp|margin|cost))
```

3. Dates: custom range 2026-06-01 to 2026-08-31 (both days included).
4. Export, Download CSV; save as `raw/gsc-3m-q-cl_0009.zip` or unzip into `raw/gsc-3m-q-cl_0009/`.

### 15. `raw/gsc-3m-q-cl_0010`

Purpose: Named queries for cluster cl_0010 (Pub events and entertainment) over the trailing three months; a named subset, not a page total.

1. Open Performance, Search results for property `sc-domain:orangejelly.co.uk`.
2. Filters: Search type = Web; Country = United Kingdom; no page filter; add a Query filter, Custom (regex), Matches regex, using exactly this pattern:

```
(?i)((pub|bar)\b.{0,20}\b(event|entertainment)|event ideas for (pub|bar)|pop[- ]?up event)
```

3. Dates: custom range 2026-06-01 to 2026-08-31 (both days included).
4. Export, Download CSV; save as `raw/gsc-3m-q-cl_0010.zip` or unzip into `raw/gsc-3m-q-cl_0010/`.

### 16. `raw/gsc-3m-p-pg_0002`

Purpose: Complete totals for page pg_0002 (https://www.orangejelly.co.uk/solutions) over the trailing three months, with the named queries that reached it; optional, but without it cannibalisation and unattributed traffic for this page cannot be assessed.

1. Open Performance, Search results for property `sc-domain:orangejelly.co.uk`.
2. Filters: Search type = Web; Country = United Kingdom; no query filter; add a Page filter, Custom (regex), Matches regex, using exactly this pattern:

```
^https://www[.]orangejelly[.]co[.]uk/solutions$
```

3. Dates: custom range 2026-06-01 to 2026-08-31 (both days included).
4. Export, Download CSV; save as `raw/gsc-3m-p-pg_0002.zip` or unzip into `raw/gsc-3m-p-pg_0002/`.

### 17. `raw/gsc-3m-p-pg_0004`

Purpose: Complete totals for page pg_0004 (https://www.orangejelly.co.uk/solutions/booking-systems) over the trailing three months, with the named queries that reached it; optional, but without it cannibalisation and unattributed traffic for this page cannot be assessed.

1. Open Performance, Search results for property `sc-domain:orangejelly.co.uk`.
2. Filters: Search type = Web; Country = United Kingdom; no query filter; add a Page filter, Custom (regex), Matches regex, using exactly this pattern:

```
^https://www[.]orangejelly[.]co[.]uk/solutions/booking-systems$
```

3. Dates: custom range 2026-06-01 to 2026-08-31 (both days included).
4. Export, Download CSV; save as `raw/gsc-3m-p-pg_0004.zip` or unzip into `raw/gsc-3m-p-pg_0004/`.

### 18. `raw/gsc-3m-p-pg_0001`

Purpose: Complete totals for page pg_0001 (https://www.orangejelly.co.uk/) over the trailing three months, with the named queries that reached it; optional, but without it cannibalisation and unattributed traffic for this page cannot be assessed.

1. Open Performance, Search results for property `sc-domain:orangejelly.co.uk`.
2. Filters: Search type = Web; Country = United Kingdom; no query filter; add a Page filter, Custom (regex), Matches regex, using exactly this pattern:

```
^https://www[.]orangejelly[.]co[.]uk/$
```

3. Dates: custom range 2026-06-01 to 2026-08-31 (both days included).
4. Export, Download CSV; save as `raw/gsc-3m-p-pg_0001.zip` or unzip into `raw/gsc-3m-p-pg_0001/`.

### 19. `raw/gsc-3m-p-pg_0003`

Purpose: Complete totals for page pg_0003 (https://www.orangejelly.co.uk/solutions/hospitality-websites) over the trailing three months, with the named queries that reached it; optional, but without it cannibalisation and unattributed traffic for this page cannot be assessed.

1. Open Performance, Search results for property `sc-domain:orangejelly.co.uk`.
2. Filters: Search type = Web; Country = United Kingdom; no query filter; add a Page filter, Custom (regex), Matches regex, using exactly this pattern:

```
^https://www[.]orangejelly[.]co[.]uk/solutions/hospitality-websites$
```

3. Dates: custom range 2026-06-01 to 2026-08-31 (both days included).
4. Export, Download CSV; save as `raw/gsc-3m-p-pg_0003.zip` or unzip into `raw/gsc-3m-p-pg_0003/`.

### 20. `raw/gsc-3m-p-pg_0006`

Purpose: Complete totals for page pg_0006 (https://www.orangejelly.co.uk/pub-marketing) over the trailing three months, with the named queries that reached it; optional, but without it cannibalisation and unattributed traffic for this page cannot be assessed.

1. Open Performance, Search results for property `sc-domain:orangejelly.co.uk`.
2. Filters: Search type = Web; Country = United Kingdom; no query filter; add a Page filter, Custom (regex), Matches regex, using exactly this pattern:

```
^https://www[.]orangejelly[.]co[.]uk/pub-marketing$
```

3. Dates: custom range 2026-06-01 to 2026-08-31 (both days included).
4. Export, Download CSV; save as `raw/gsc-3m-p-pg_0006.zip` or unzip into `raw/gsc-3m-p-pg_0006/`.

### 21. `raw/gsc-3m-p-pg_0017`

Purpose: Complete totals for page pg_0017 (https://www.orangejelly.co.uk/why-revenue-is-falling) over the trailing three months, with the named queries that reached it; optional, but without it cannibalisation and unattributed traffic for this page cannot be assessed.

1. Open Performance, Search results for property `sc-domain:orangejelly.co.uk`.
2. Filters: Search type = Web; Country = United Kingdom; no query filter; add a Page filter, Custom (regex), Matches regex, using exactly this pattern:

```
^https://www[.]orangejelly[.]co[.]uk/why-revenue-is-falling$
```

3. Dates: custom range 2026-06-01 to 2026-08-31 (both days included).
4. Export, Download CSV; save as `raw/gsc-3m-p-pg_0017.zip` or unzip into `raw/gsc-3m-p-pg_0017/`.

### 22. `raw/gsc-3m-p-pg_0008`

Purpose: Complete totals for page pg_0008 (https://www.orangejelly.co.uk/fractional-cmo) over the trailing three months, with the named queries that reached it; optional, but without it cannibalisation and unattributed traffic for this page cannot be assessed.

1. Open Performance, Search results for property `sc-domain:orangejelly.co.uk`.
2. Filters: Search type = Web; Country = United Kingdom; no query filter; add a Page filter, Custom (regex), Matches regex, using exactly this pattern:

```
^https://www[.]orangejelly[.]co[.]uk/fractional-cmo$
```

3. Dates: custom range 2026-06-01 to 2026-08-31 (both days included).
4. Export, Download CSV; save as `raw/gsc-3m-p-pg_0008.zip` or unzip into `raw/gsc-3m-p-pg_0008/`.

### 23. `raw/gsc-3m-p-pg_0007`

Purpose: Complete totals for page pg_0007 (https://www.orangejelly.co.uk/sectors/professional-services) over the trailing three months, with the named queries that reached it; optional, but without it cannibalisation and unattributed traffic for this page cannot be assessed.

1. Open Performance, Search results for property `sc-domain:orangejelly.co.uk`.
2. Filters: Search type = Web; Country = United Kingdom; no query filter; add a Page filter, Custom (regex), Matches regex, using exactly this pattern:

```
^https://www[.]orangejelly[.]co[.]uk/sectors/professional-services$
```

3. Dates: custom range 2026-06-01 to 2026-08-31 (both days included).
4. Export, Download CSV; save as `raw/gsc-3m-p-pg_0007.zip` or unzip into `raw/gsc-3m-p-pg_0007/`.

### 24. `raw/gsc-3m-p-pg_0019`

Purpose: Complete totals for page pg_0019 (https://www.orangejelly.co.uk/guides/quiz-night-101) over the trailing three months, with the named queries that reached it; optional, but without it cannibalisation and unattributed traffic for this page cannot be assessed.

1. Open Performance, Search results for property `sc-domain:orangejelly.co.uk`.
2. Filters: Search type = Web; Country = United Kingdom; no query filter; add a Page filter, Custom (regex), Matches regex, using exactly this pattern:

```
^https://www[.]orangejelly[.]co[.]uk/(licensees-guide|guides)/quiz-night-101$
```

3. Dates: custom range 2026-06-01 to 2026-08-31 (both days included).
4. Export, Download CSV; save as `raw/gsc-3m-p-pg_0019.zip` or unzip into `raw/gsc-3m-p-pg_0019/`.

### 25. `raw/gsc-3m-p-pg_0021`

Purpose: Complete totals for page pg_0021 (https://www.orangejelly.co.uk/guides/profitable-pub-food-menu-ideas) over the trailing three months, with the named queries that reached it; optional, but without it cannibalisation and unattributed traffic for this page cannot be assessed.

1. Open Performance, Search results for property `sc-domain:orangejelly.co.uk`.
2. Filters: Search type = Web; Country = United Kingdom; no query filter; add a Page filter, Custom (regex), Matches regex, using exactly this pattern:

```
^https://www[.]orangejelly[.]co[.]uk/(licensees-guide|guides)/profitable-pub-food-menu-ideas$
```

3. Dates: custom range 2026-06-01 to 2026-08-31 (both days included).
4. Export, Download CSV; save as `raw/gsc-3m-p-pg_0021.zip` or unzip into `raw/gsc-3m-p-pg_0021/`.

### 26. `raw/gsc-3m-p-pg_0027`

Purpose: Complete totals for page pg_0027 (https://www.orangejelly.co.uk/guides/pub-event-ideas) over the trailing three months, with the named queries that reached it; optional, but without it cannibalisation and unattributed traffic for this page cannot be assessed.

1. Open Performance, Search results for property `sc-domain:orangejelly.co.uk`.
2. Filters: Search type = Web; Country = United Kingdom; no query filter; add a Page filter, Custom (regex), Matches regex, using exactly this pattern:

```
^https://www[.]orangejelly[.]co[.]uk/(licensees-guide|guides)/pub-event-ideas$
```

3. Dates: custom range 2026-06-01 to 2026-08-31 (both days included).
4. Export, Download CSV; save as `raw/gsc-3m-p-pg_0027.zip` or unzip into `raw/gsc-3m-p-pg_0027/`.

## Keyword Planner settings (apply to every Keyword Planner step)

- Location: United Kingdom
- Language: English
- Network: Google Search
- Date range: last 12 months
- No filters in the tool. Do not apply the avoid list in the tool; the skill applies it after import.
- Download as CSV (not Google Sheets) and keep the file exactly as downloaded.

## Keyword Planner discovery

Discover new keywords, Start with keywords. One batch per block: paste the comma-separated seeds, enter the URL where one is given (with no seeds use Start with a website instead), Get results, then Download keyword ideas as CSV and save with the file name given.

### raw/gkp-discover-01-website-build.csv

```
website design for small business, small business website developer, website redesign agency uk, web design agency uk, custom website development, website development company uk, small business web design cost, website designer for small business uk
```

### raw/gkp-discover-02-web-applications.csv

```
bespoke software development uk, custom application development, bespoke web application, internal business systems, custom software for small business, workflow automation software uk, business process automation small business, bespoke app development uk
```

### raw/gkp-discover-03-booking-systems.csv

```
online booking system, table booking system uk, booking system for small business, reservation system for restaurants, appointment booking software uk, booking software for pubs, custom booking system, online booking system cost
```

### raw/gkp-discover-04-ai-for-business.csv

```
ai for small business uk, ai automation for business, ai tools for small business, how to use ai in my business, ai workflow automation, practical ai for small business, ai consultant uk, ai readiness assessment
```

### raw/gkp-discover-05-fractional-marketing.csv

```
fractional cmo uk, fractional marketing director, part time marketing director, interim marketing director uk, outsourced marketing director, fractional cmo cost, marketing director for hire
```

### raw/gkp-discover-06-professional-services-web.csv

```
website for accountants, website for solicitors, marketing for professional services, website design for consultants, lead generation for professional services, accountancy practice marketing, law firm website design uk
```

### raw/gkp-discover-07-hospitality-websites.csv

```
pub website design, restaurant website design uk, hospitality website design, website for a pub, restaurant web design cost, hotel website design uk
```

### raw/gkp-discover-08-christmas-pub.csv

```
christmas pub ideas, christmas pub promotions, pub christmas menu ideas, christmas events for pubs, pub christmas decorations, festive pub offers
```

### raw/gkp-discover-09-site.csv

URL: https://www.orangejelly.co.uk/

No seeds: use Start with a website with the URL above.

### raw/gkp-discover-10-solutions-hub.csv

URL: https://www.orangejelly.co.uk/solutions

```
bespoke applications, website development
```

### raw/gkp-discover-11-booking-systems-page.csv

URL: https://www.orangejelly.co.uk/solutions/booking-systems

```
online booking system, table booking system
```

### raw/gkp-discover-12-pub-marketing-page.csv

URL: https://www.orangejelly.co.uk/pub-marketing

```
pub marketing agency, marketing for pubs
```

## Keyword Planner search volumes

Get search volume and forecasts. Upload the file named (or paste its Keyword column), Get started, open the Historical metrics tab, then Download as CSV and save with the file name given. The forecast tab is not used.

1. Upload `paste/volumes-01.csv` (44 keywords); save the download as `raw/gkp-volumes-01.csv`.

## What to send back

- [ ] The Search Console zips or folders listed above, unrenamed, every tab included.
- [ ] Confirmation that every export came from property `sc-domain:orangejelly.co.uk`.
- [ ] The Keyword Planner CSV files named above.
- [ ] Did the Avg. monthly searches column show ranges (such as 1K to 10K) or plain numbers? Answer once for this run; it sets the volume mode.
- [ ] Confirmation that location, language, network and date range were exactly as printed.
- [ ] Reminder: the avoid list is applied by the skill after import, never in the tool.
- [ ] Anything that could not be exported, with the reason.
