Bottom conversion bar: ink field, orange top rule, one CTA. Appears after the reader scrolls past `showAfter` px and can be dismissed.

```jsx
<StickyCTA note="Quiet midweek? We fixed ours." label="Book a growth diagnostic" href="/diagnostic" showAfter={600} />
```

Use on long landing pages and articles only; never stack it with a NewsletterBand in view at the same time. `showAfter={0}` for previews.
