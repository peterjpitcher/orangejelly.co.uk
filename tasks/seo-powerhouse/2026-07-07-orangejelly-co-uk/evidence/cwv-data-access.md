# Core Web Vitals — data access

Collected at: 2026-07-07 07:15:03

## Configuration

- Strategy (form factor): mobile
- API key supplied: no (keyless, low-volume quota)
- PSI lab opportunities: not requested
- Field data source: CrUX API (queryRecord)
- Lab data source: PageSpeed Insights API (runPagespeed)

## Coverage

- Targets queried: 6
- field (CrUX real-world data): 0
- lab (PSI synthetic Lighthouse run): 0
- unavailable (no data / error): 6

CrUX only holds field data for origins and URLs with enough real Chrome
traffic. Low-traffic URLs return HTTP 404 and are recorded as 'unavailable'
with blank metrics — never estimated.

## Per-target notes

- `https://www.orangejelly.co.uk` — HTTP 403: Method doesn't allow unregistered callers (callers without established identity). Please use API Key or other form of API consumer identity to call this API.
- `https://www.orangejelly.co.uk/` — HTTP 403: Method doesn't allow unregistered callers (callers without established identity). Please use API Key or other form of API consumer identity to call this API.; HTTP 429: Quota exceeded for quota metric 'Queries' and limit 'Queries per day' of service 'pagespeedonline.googleapis.com' for consumer 'project_number:583797351490'.
- `https://www.orangejelly.co.uk/fix-my-pub` — HTTP 403: Method doesn't allow unregistered callers (callers without established identity). Please use API Key or other form of API consumer identity to call this API.; HTTP 429: Quota exceeded for quota metric 'Queries' and limit 'Queries per day' of service 'pagespeedonline.googleapis.com' for consumer 'project_number:583797351490'.
- `https://www.orangejelly.co.uk/licensees-guide` — HTTP 403: Method doesn't allow unregistered callers (callers without established identity). Please use API Key or other form of API consumer identity to call this API.; HTTP 429: Quota exceeded for quota metric 'Queries' and limit 'Queries per day' of service 'pagespeedonline.googleapis.com' for consumer 'project_number:583797351490'.
- `https://www.orangejelly.co.uk/pub-marketing-agency` — HTTP 403: Method doesn't allow unregistered callers (callers without established identity). Please use API Key or other form of API consumer identity to call this API.; HTTP 429: Quota exceeded for quota metric 'Queries' and limit 'Queries per day' of service 'pagespeedonline.googleapis.com' for consumer 'project_number:583797351490'.
- `https://www.orangejelly.co.uk/ways-to-work` — HTTP 403: Method doesn't allow unregistered callers (callers without established identity). Please use API Key or other form of API consumer identity to call this API.; HTTP 429: Quota exceeded for quota metric 'Queries' and limit 'Queries per day' of service 'pagespeedonline.googleapis.com' for consumer 'project_number:583797351490'.

