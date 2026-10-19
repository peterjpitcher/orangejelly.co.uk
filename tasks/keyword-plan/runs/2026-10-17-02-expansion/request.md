# Keyword plan request: orangejelly.co.uk (GB), run 2026-10-17-02-expansion, mode expansion

## Next required input

Total pulls needed now: 3 (3 Keyword Planner discovery exports).

Save everything under `runs/2026-10-17-02-expansion/raw/` using the exact folder and file names below. Do not rename, open and re-save, or edit an export.

## Keyword Planner settings (apply to every Keyword Planner step)

- Location: United Kingdom
- Language: English
- Network: Google Search
- Date range: last 12 months
- No filters in the tool. Do not apply the avoid list in the tool; the skill applies it after import.
- Download as CSV (not Google Sheets) and keep the file exactly as downloaded.

## Keyword Planner discovery

Discover new keywords, Start with keywords. One batch per block: paste the comma-separated seeds, enter the URL where one is given (with no seeds use Start with a website instead), Get results, then Download keyword ideas as CSV and save with the file name given.

These are discovery pulls. The tile is **Discover new keywords**, not **Get search volume and forecasts**: the second one only prices the list you already have and cannot find anything new.

### raw/gkp-discover-01-spring-all.csv

```
pub event ideas, burns night menu ideas, valentines menu ideas, mothers day menu ideas, st patricks day food ideas, easter pub events, six nations pub, dry january pub ideas, national margarita day, international whisky day
```

Your check before you save: open Keyword Planner, click **Discover new keywords**, use the **Start with keywords** tab, then **Get results**, then **Download keyword ideas**. A discovery export returns far more rows than you put in (here, many more than 10 rows). If the file holds only what you typed, the pull came from Get search volume and forecasts by mistake and has to be taken again.

### raw/gkp-discover-02-page-six-nations-guide.csv

URL: https://www.orangejelly.co.uk/guides/pub-six-nations-rugby-marketing

```
six nations pub, rugby pub marketing
```

Your check before you save: open Keyword Planner, click **Discover new keywords**, use the **Start with keywords** tab, then **Get results**, then **Download keyword ideas**. A discovery export returns far more rows than you put in (here, many more than 2 rows). If the file holds only what you typed, the pull came from Get search volume and forecasts by mistake and has to be taken again.

### raw/gkp-discover-03-page-events-calendar-guide.csv

URL: https://www.orangejelly.co.uk/guides/seasonal-pub-events-calendar

```
pub events calendar, seasonal pub events
```

Your check before you save: open Keyword Planner, click **Discover new keywords**, use the **Start with keywords** tab, then **Get results**, then **Download keyword ideas**. A discovery export returns far more rows than you put in (here, many more than 2 rows). If the file holds only what you typed, the pull came from Get search volume and forecasts by mistake and has to be taken again.

## What to send back

- [ ] The Keyword Planner CSV files named above.
- [ ] Did the Avg. monthly searches column show ranges (such as 1K to 10K) or plain numbers? Answer once for this run; it sets the volume mode.
- [ ] Confirmation that location, language, network and date range were exactly as printed.
- [ ] Reminder: the avoid list is applied by the skill after import, never in the tool.
- [ ] Anything that could not be exported, with the reason.
