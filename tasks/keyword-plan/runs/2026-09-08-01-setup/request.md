# What I need from you

**26 exports: 13 from Search Console, 13 from Keyword Planner.**

Put every file into `runs/2026-09-08-01-setup/raw/inbox/` exactly as it downloads.
Do not rename anything and do not unzip anything. Every Search Console export carries its
own filters and dates inside it, so I sort them by reading those, not by the filename.

---

## Part 1: Search Console, 13 exports

Open Performance, then Search results. Set these three once and leave them alone for all 13:

- **Search type:** Web
- **Country:** United Kingdom (worth the extra click: 31 percent of your impressions are not UK
  and are not your market, so leaving it off would mix them in)
- **Page filter:** none, on every single one

Then work down the list. Each row tells you only what changes from the row above it.
Hit Export, then Download CSV, after each one.

### The three with no query filter

**1.** Date range: **Last 16 months**. No query filter.

**2.** Date range: **Last 3 months**. No query filter.

**3.** Date range: **Last 28 days**. No query filter.

### The ten cluster exports

All ten are **Last 3 months**, so set that once and leave it. The only thing that changes
each time is the query filter. Set it with: Query, Custom (regex), Matches regex, then paste
the pattern on one line and Apply. Replace the pattern each time; do not stack them.

**4. Pub and hospitality marketing services**

```
(?i)((pub|bar|hospitality)\b.{0,25}\b(marketing|advertising|agency)|(marketing|advertising|instagram|facebook|content creation|paid social|social video)\b.{0,12}\bfor (pubs|bars))
```

**5. Pub turnaround**

```
(?i)(fix my pub|struggling pub|pub turnaround|failing pub|quiet pub|empty pub|pub business support)
```

**6. Pub quiz mechanics**

```
(?i)((pub )?quiz\b.{0,25}\b(night|round|format|question|answer|topic|scoring|prize|rule|idea)|picture round|quiz night)
```

**7. Pub bingo**

```
(?i)((pub|music|cash) bingo|bingo\b.{0,20}\b(pub|night|licence|equipment|idea))
```

**8. Pub food and menu profitability**

```
(?i)((pub|bar|gastropub) (food|menu)|profitable (menu|food|bar food)|menu (idea|profit|margin|cost|engineering)|food (gp|margin|cost))
```

**9. Pub events and entertainment**

```
(?i)((pub|bar)\b.{0,20}\b(event|entertainment)|event ideas for (pub|bar)|pop[- ]?up event)
```

**10. Pub social media marketing**

```
(?i)((pub|bar)\b.{0,20}\b(social media|instagram|facebook|tiktok)|social media (strategy|idea|post|content) for (pubs|bars))
```

**11. Cellar and drinks operations**

```
(?i)(cellar|beer (quality|line)|draught|keg|cask|line clean)
```

**12. Promotional calendar and drinks days**

```
(?i)(national\b.{0,20}\bday|drinks day|awareness day|promotion calendar)
```

**13. Pub refurbishment and property**

```
(?i)(pub|bar)\b.{0,15}\b(refurb|refit|interior|maintenance|decor)
```

Some of these will come back with very few rows. That is fine and it is the point: an empty
or thin result is a real finding about where the site has no footprint, not a mistake.

---

## Part 2: Keyword Planner, 13 exports

Set these once and leave them alone for all 13:

- **Location:** United Kingdom
- **Language:** English
- **Network:** Google Search only, not search partners
- **Date range:** the default last 12 months

### Twelve discovery exports

Use **Discover new keywords**, the *Start with keywords* tab. Paste the block, hit Get
results, then Download, CSV. This is the part that has never been run on this site, so it
is the part most likely to tell us something new.

**1.**

```
website design for small business
small business website developer
website redesign agency uk
web design agency uk
custom website development
website development company uk
small business web design cost
website designer for small business uk
```

**2.**

```
bespoke software development uk
custom application development
bespoke web application
internal business systems
custom software for small business
workflow automation software uk
business process automation small business
bespoke app development uk
```

**3.**

```
online booking system
table booking system uk
booking system for small business
reservation system for restaurants
appointment booking software uk
booking software for pubs
custom booking system
online booking system cost
```

**4.**

```
ai for small business uk
ai automation for business
ai tools for small business
how to use ai in my business
ai workflow automation
practical ai for small business
ai consultant uk
ai readiness assessment
```

**5.**

```
fractional cmo uk
fractional marketing director
part time marketing director
interim marketing director uk
outsourced marketing director
fractional cmo cost
marketing director for hire
```

**6.**

```
website for accountants
website for solicitors
marketing for professional services
website design for consultants
lead generation for professional services
accountancy practice marketing
law firm website design uk
```

**7.**

```
pub website design
restaurant website design uk
hospitality website design
website for a pub
restaurant web design cost
hotel website design uk
```

**8.**

```
christmas pub ideas
christmas pub promotions
pub christmas menu ideas
christmas events for pubs
pub christmas decorations
festive pub offers
```

**9.**

```
[Start with a website instead: https://www.orangejelly.co.uk/]
```

**10.**

```
[Start with a website instead: https://www.orangejelly.co.uk/solutions]
bespoke applications
website development
```

**11.**

```
[Start with a website instead: https://www.orangejelly.co.uk/solutions/booking-systems]
online booking system
table booking system
```

**12.**

```
[Start with a website instead: https://www.orangejelly.co.uk/pub-marketing]
pub marketing agency
marketing for pubs
```

### One volume export

**13.** Switch to **Get search volume and forecasts**. Paste the whole of
`paste/volumes-01.csv` (44 keywords, one per line, ignore the `Keyword` header line).
Download the **Historical metrics** tab, not the forecast tab.

These 44 all returned nothing on 9 August. Re-asking is how we find out whether that is
still true, and it is one paste rather than 44 lookups.

---

## When you are done

Tell me, and I will sort the inbox, validate every export against what was asked for,
import them, and write the plan.
